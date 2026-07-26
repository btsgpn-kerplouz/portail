// Backend de synchronisation Supabase — étape 3 du portage multi-utilisateurs
// (voir mémoire Claude Code : organisation-cours-multiuser-plan, et le plan
// détaillé humming-singing-canyon.md).
//
// Remplace js/sync-local.js (étape tampon en localStorage) : même contrat
// window.OC_SYNC attendu par app.js (charger, enregistrer, marquerSupprime,
// memoriserSnapshot), mais qui lit/écrit vraiment les tables oc_* au lieu
// d'un blob unique.
//
// Règles de conception (du plan approuvé, à ne pas perdre de vue en cas de
// modification future) :
//   - Jamais de suppression déduite d'une absence dans `state` : seules les
//     4 actions explicites de app.js (marquerSupprime) déclenchent un DELETE.
//   - Le "sont-ils modifiés ?" se décide par empreinte canonique (clés
//     triées), comparée à l'état chargé au démarrage (memoriserSnapshot),
//     jamais par un simple "présent ou pas".
//   - `cree_par` n'est envoyé QUE pour une entité inédite (absente du
//     snapshot de départ) — sinon on écraserait le vrai créateur au premier
//     enregistrement d'un compte qui n'a fait que la modifier.
//   - Le snapshot d'une entité n'avance qu'après un écriture réussie : un
//     échec réseau/RLS ponctuel se retente automatiquement au prochain
//     enregistrer(), sans action de l'utilisateur.
//   - enregistrer() ne lève jamais d'exception : les erreurs sont recueillies
//     dans le tableau retourné, affiché par setSaveStatus() côté app.js.

import { getClient } from "./supabase-client.js";
import {
  SPEC_UES, SPEC_SEQUENCES, SPEC_SESSIONS, SPEC_CONSTRAINTS,
  versLigne, depuisLigne, empreinte,
} from "./mapping.js";

const CLES_PERSO = ["todoNotes", "devNotes", "deplacements", "reunions"];
const CLES_PARTAGEES = ["weekTemplates", "rubanOverrides", "rubanUeCaps", "promotions", "schoolYear", "weekNotes"];

let sb = null;
async function client() {
  if (!sb) sb = await getClient();
  return sb;
}

async function utilisateurId() {
  const s = await client();
  const { data } = await s.auth.getSession();
  return data?.session?.user?.id || null;
}

// empreinte par entité (ues/sequences/sessions/constraints) + par clé de bloc.
let snapshot = creerSnapshotVide();
// ids explicitement marqués supprimés par app.js, en attente d'un DELETE réussi.
let registreSuppression = creerRegistreVide();

function creerSnapshotVide() {
  return {
    ues: new Map(), sequences: new Map(), sessions: new Map(), constraints: new Map(),
    blocsPerso: new Map(), blocsPartages: new Map(),
  };
}
function creerRegistreVide() {
  return { ues: new Set(), sequences: new Set(), sessions: new Set(), constraints: new Set() };
}

function construireWeeks(lignes) {
  return lignes.map((r) => ({
    id: r.id, label: r.label, weekNumber: r.week_number, isoYear: r.iso_year, dateRange: r.date_range,
  }));
}

window.OC_SYNC = {
  async charger() {
    // Nouvelle session (démarrer() après une connexion) : on repart d'un
    // snapshot vierge, sinon un changement de compte sur la même page
    // réutiliserait par erreur l'état d'un précédent utilisateur.
    snapshot = creerSnapshotVide();
    registreSuppression = creerRegistreVide();

    const s = await client();
    const resultats = await Promise.all([
      s.from("oc_weeks").select("*"),
      s.from("oc_ues").select("*"),
      s.from("oc_sequences").select("*"),
      s.from("oc_sessions").select("*"),
      s.from("oc_constraints").select("*"),
      s.from("oc_blocs_perso").select("*"),
      s.from("oc_blocs_partages").select("*"),
    ]);
    const enErreur = resultats.find((r) => r.error);
    if (enErreur) {
      const message = "Chargement des données impossible : " + enErreur.error.message;
      window.alert(message);
      throw new Error(message);
    }
    const [weeks, ues, sequences, sessions, constraints, blocsPerso, blocsPartages] =
      resultats.map((r) => r.data || []);

    const blocsPersoParCle = new Map(blocsPerso.map((r) => [r.cle, r.contenu]));
    const blocsPartagesParCle = new Map(blocsPartages.map((r) => [r.cle, r.contenu]));

    return {
      weeks: construireWeeks(weeks),
      ues: ues.map((r) => depuisLigne(SPEC_UES, r)),
      sequences: sequences.map((r) => depuisLigne(SPEC_SEQUENCES, r)),
      sessions: sessions.map((r) => depuisLigne(SPEC_SESSIONS, r)),
      constraints: constraints.map((r) => depuisLigne(SPEC_CONSTRAINTS, r)),
      todoNotes: blocsPersoParCle.get("todoNotes"),
      devNotes: blocsPersoParCle.get("devNotes"),
      deplacements: blocsPersoParCle.get("deplacements"),
      reunions: blocsPersoParCle.get("reunions"),
      weekTemplates: blocsPartagesParCle.get("weekTemplates"),
      rubanOverrides: blocsPartagesParCle.get("rubanOverrides"),
      rubanUeCaps: blocsPartagesParCle.get("rubanUeCaps"),
      promotions: blocsPartagesParCle.get("promotions"),
      schoolYear: blocsPartagesParCle.get("schoolYear"),
      weekNotes: blocsPartagesParCle.get("weekNotes"),
    };
  },

  // Fige l'empreinte de CHAQUE entité/bloc telle que reçue de charger() (donc
  // après normalizeData côté app.js) : c'est la référence à laquelle
  // enregistrer() comparera l'état courant pour savoir quoi (ré)écrire.
  memoriserSnapshot(state) {
    for (const type of ["ues", "sequences", "sessions", "constraints"]) {
      snapshot[type] = new Map((state[type] || []).map((e) => [e.id, empreinte(e)]));
    }
    snapshot.blocsPerso = new Map(CLES_PERSO.map((cle) => [cle, empreinte(state[cle] ?? null)]));
    snapshot.blocsPartages = new Map(CLES_PARTAGEES.map((cle) => [cle, empreinte(state[cle] ?? null)]));
  },

  marquerSupprime(type, id) {
    registreSuppression[type]?.add(id);
  },

  async enregistrer(state) {
    const erreurs = [];
    let s;
    try {
      s = await client();
    } catch (e) {
      return { lastSavedAt: state.lastSavedAt, erreurs: [e.message || "Connexion Supabase indisponible."] };
    }
    const uid = await utilisateurId();
    if (!uid) {
      return { lastSavedAt: state.lastSavedAt, erreurs: ["Session expirée : reconnectez-vous pour enregistrer."] };
    }

    await ecrireEntites(s, uid, "constraints", "oc_constraints", SPEC_CONSTRAINTS, state.constraints, erreurs);
    await ecrireEntites(s, uid, "ues", "oc_ues", SPEC_UES, state.ues, erreurs);
    await ecrireEntites(s, uid, "sequences", "oc_sequences", SPEC_SEQUENCES, state.sequences, erreurs);
    await ecrireEntites(s, uid, "sessions", "oc_sessions", SPEC_SESSIONS, state.sessions, erreurs);

    // Suppressions dans l'ordre inverse des écritures ci-dessus.
    await supprimerRegistre(s, "sessions", "oc_sessions", erreurs);
    await supprimerRegistre(s, "sequences", "oc_sequences", erreurs);
    await supprimerRegistre(s, "ues", "oc_ues", erreurs);
    await supprimerRegistre(s, "constraints", "oc_constraints", erreurs);

    await ecrireBlocs(s, "oc_blocs_perso", CLES_PERSO, snapshot.blocsPerso, state,
      (cle, valeur) => ({ user_id: uid, cle, contenu: valeur ?? null }), erreurs);
    await ecrireBlocs(s, "oc_blocs_partages", CLES_PARTAGEES, snapshot.blocsPartages, state,
      (cle, valeur) => ({ cle, contenu: valeur ?? null, updated_par: uid }), erreurs);

    // En cas d'échec (même partiel), on ne fait pas croire à une sauvegarde
    // fraîche : l'horodatage affiché reste celui du dernier succès réel.
    return { lastSavedAt: erreurs.length ? state.lastSavedAt : new Date().toISOString(), erreurs };
  },
};

async function ecrireEntites(s, uid, type, table, spec, entites, erreurs) {
  const snap = snapshot[type];
  const aEcrire = [];
  for (const entite of entites || []) {
    if (!entite || !entite.id) continue;
    const fp = empreinte(entite);
    if (snap.get(entite.id) !== fp) {
      aEcrire.push({ id: entite.id, fp, estNouveau: !snap.has(entite.id), colonnes: versLigne(spec, entite) });
    }
  }
  if (!aEcrire.length) return;
  await Promise.all(aEcrire.map(async (item) => {
    const ligne = { id: item.id, ...item.colonnes };
    if (item.estNouveau) ligne.cree_par = uid;
    try {
      // .select('id') est ce qui permet de distinguer un succès d'un refus
      // SILENCIEUX de la RLS : sans lui, upsert() ne renvoie pas d'erreur
      // quand la policy exclut la ligne (elle est simplement filtrée, comme
      // un WHERE), donc "pas d'erreur" ne veut pas dire "écrit".
      const { data, error } = await s.from(table).upsert(ligne).select("id");
      if (error) erreurs.push(`${table} #${item.id} : ${error.message}`);
      else if (!data?.length) erreurs.push(`${table} #${item.id} : modification refusée (droits insuffisants ?).`);
      else snap.set(item.id, item.fp);
    } catch (e) {
      erreurs.push(`${table} #${item.id} : ${e.message || "erreur réseau."}`);
    }
  }));
}

async function supprimerRegistre(s, type, table, erreurs) {
  const ids = [...registreSuppression[type]];
  if (!ids.length) return;
  await Promise.all(ids.map(async (id) => {
    try {
      const { error } = await s.from(table).delete().eq("id", id);
      if (error) {
        erreurs.push(`${table} #${id} (suppression) : ${error.message}`);
      } else {
        // 0 ligne touchée (déjà supprimée) ou 1 ligne réellement effacée :
        // dans les deux cas plus rien à refaire pour cet id. Un DELETE
        // refusé par la RLS ne lève pas d'erreur non plus (ligne simplement
        // filtrée) ; retenter en boucle n'aiderait pas — cf. étape 7 pour
        // distinguer proprement ce cas une fois le partage réel en place.
        registreSuppression[type].delete(id);
        snapshot[type].delete(id);
      }
    } catch (e) {
      erreurs.push(`${table} #${id} (suppression) : ${e.message || "erreur réseau."}`);
    }
  }));
}

async function ecrireBlocs(s, table, cles, snap, state, construireLigne, erreurs) {
  const aEcrire = [];
  for (const cle of cles) {
    const valeur = state[cle];
    const fp = empreinte(valeur ?? null);
    if (snap.get(cle) !== fp) aEcrire.push({ cle, valeur, fp });
  }
  if (!aEcrire.length) return;
  await Promise.all(aEcrire.map(async ({ cle, valeur, fp }) => {
    try {
      const { data, error } = await s.from(table).upsert(construireLigne(cle, valeur)).select();
      if (error) erreurs.push(`${table} « ${cle} » : ${error.message}`);
      else if (!data?.length) erreurs.push(`${table} « ${cle} » : modification refusée (droits insuffisants ?).`);
      else snap.set(cle, fp);
    } catch (e) {
      erreurs.push(`${table} « ${cle} » : ${e.message || "erreur réseau."}`);
    }
  }));
}
