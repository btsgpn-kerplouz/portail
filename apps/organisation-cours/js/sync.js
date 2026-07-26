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
//
// Étape 5 — champ `teacher` dérivé (aucune modification d'interface) :
//   - `teacher` (chaîne libre "TZ, MD") n'a jamais eu de colonne dédiée : il
//     tombait dans `contenu` comme n'importe quel champ hors liste blanche.
//     Il est maintenant reconstruit à CHAQUE chargement à partir des tables
//     de jointure oc_*_enseignants + d'un résidu texte `contenu.teacherLegacy`
//     (voir reconstruireTeacher ci-dessous), puis ré-séparé à CHAQUE
//     enregistrement (separerTeacher) : les jetons résolus vers un compte
//     actif partent en jointure, le reste reste résidu. Ni `app.js` ni la
//     colonne `contenu` legacy `teacher` (import étape 3) n'ont besoin d'être
//     migrés : le premier enregistrement réussi bascule tout seul.
//   - La synchronisation des jointures (synchroniserEnseignants) tourne à
//     CHAQUE enregistrer(), indépendamment du diff de la ligne elle-même :
//     c'est ce qui permet à un jeton de basculer en jointure dès qu'un
//     collègue devient actif, sans que Martin retouche la séance concernée.

import { getClient } from "./supabase-client.js";
import {
  SPEC_UES, SPEC_SEQUENCES, SPEC_SESSIONS, SPEC_CONSTRAINTS,
  versLigne, depuisLigne, empreinte,
} from "./mapping.js";
import * as enseignants from "./enseignants.js";

const CLES_PERSO = ["todoNotes", "devNotes", "deplacements", "reunions"];
const CLES_PARTAGEES = ["weekTemplates", "rubanOverrides", "rubanUeCaps", "promotions", "schoolYear", "weekNotes"];

// table de jointure + colonne id par type d'entité porteuse d'un `teacher`.
const JOINTURES_TEACHER = {
  ues: { table: "oc_ue_enseignants", colonne: "ue_id" },
  sequences: { table: "oc_sequence_enseignants", colonne: "sequence_id" },
  sessions: { table: "oc_session_enseignants", colonne: "session_id" },
};

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
    // id d'entité -> Set(user_id) déjà en jointure, tel que lu au chargement.
    teacherUes: new Map(), teacherSequences: new Map(), teacherSessions: new Map(),
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

// Même grammaire que teacherTokens() dans app.js (";", "," ou "/" comme
// séparateurs) : dupliquée ici volontairement, sync.js ne pouvant pas
// importer d'un <script> classique non-module.
function teacherTokensLocal(valeur) {
  return String(valeur || "").split(/[;,/]/).map((x) => x.trim()).filter(Boolean);
}

function agregerJointure(lignes, colonne) {
  const m = new Map();
  for (const r of lignes || []) {
    if (!m.has(r[colonne])) m.set(r[colonne], new Set());
    m.get(r[colonne]).add(r.enseignant_id);
  }
  return m;
}

// Jointure(s) + résidu texte -> chaîne d'affichage legacy.
//
// Le résidu n'est PAS nettoyé en filtrant "tout jeton qui résout vers un
// compte" : `contenu.teacherLegacy` peut rester du texte non réécrit
// pendant longtemps (la ligne elle-même n'est réécrite que si un AUTRE de
// ses champs change — cf. ecrireEntites), alors que la jointure, elle, est
// mise à jour à CHAQUE enregistrement (synchroniserEnseignants). Filtrer sur
// "résout globalement" ferait donc disparaître un nom du champ `teacher` dès
// qu'un compte devient actif, potentiellement avant que sa jointure existe
// réellement — cas vécu au déploiement de l'étape 5 (le "MD" de Martin,
// résiduel depuis l'étape 3, aurait disparu du premier chargement).
// On ne filtre donc que ce qui est DÉJÀ dans la jointure de CETTE entité :
// ni disparition prématurée, ni doublon une fois la jointure posée.
function reconstruireTeacher(idsJoints, residuBrut) {
  const initiales = [...(idsJoints || [])].map((id) => enseignants.initialesDe(id)).filter(Boolean);
  const dejaJoints = new Set(initiales.map((i) => i.toUpperCase()));
  const residu = teacherTokensLocal(residuBrut).filter((jeton) => !dejaJoints.has(jeton.trim().toUpperCase()));
  return [...initiales, ...residu].join(", ");
}

// Complète une entité issue de depuisLigne() avec son `teacher` reconstruit.
// Compatibilité étape 3 -> 5 sans migration : une ligne jamais réenregistrée
// depuis l'ajout de l'étape 5 n'a pas encore de `contenu.teacherLegacy` ; son
// résidu de départ est alors l'ancien `contenu.teacher` (étalé par
// depuisLigne comme n'importe quelle clé hors liste blanche).
function completerTeacher(entite, idsJoints) {
  const residuBrut = entite.teacherLegacy ?? entite.teacher ?? "";
  entite.teacher = reconstruireTeacher(idsJoints, residuBrut);
  delete entite.teacherLegacy;
  return entite;
}

// Inverse de completerTeacher, appelé à l'écriture de la ligne elle-même :
// les jetons résolus vers un compte actif partent en jointure (via
// synchroniserEnseignants, indépendamment de cette fonction — voir en-tête
// du fichier) ; seul le résidu texte repart dans `contenu.teacherLegacy`.
// `teacher` lui-même ne doit JAMAIS être écrit dans `contenu` (sinon
// versLigne l'y remettrait tel quel, figeant une chaîne déjà obsolète au
// prochain chargement) : on le retire avant d'appeler versLigne.
function separerTeacher(entite) {
  const residu = teacherTokensLocal(entite.teacher).filter((jeton) => !enseignants.resoudre(jeton));
  const { teacher, ...reste } = entite;
  reste.teacherLegacy = residu.join(", ");
  return { entite: reste };
}

window.OC_SYNC = {
  async charger() {
    // Nouvelle session (démarrer() après une connexion) : on repart d'un
    // snapshot vierge, sinon un changement de compte sur la même page
    // réutiliserait par erreur l'état d'un précédent utilisateur.
    snapshot = creerSnapshotVide();
    registreSuppression = creerRegistreVide();

    const s = await client();
    await enseignants.rafraichir();
    const resultats = await Promise.all([
      s.from("oc_weeks").select("*"),
      s.from("oc_ues").select("*"),
      s.from("oc_sequences").select("*"),
      s.from("oc_sessions").select("*"),
      s.from("oc_constraints").select("*"),
      s.from("oc_blocs_perso").select("*"),
      s.from("oc_blocs_partages").select("*"),
      s.from("oc_ue_enseignants").select("ue_id, enseignant_id"),
      s.from("oc_sequence_enseignants").select("sequence_id, enseignant_id"),
      s.from("oc_session_enseignants").select("session_id, enseignant_id"),
    ]);
    const enErreur = resultats.find((r) => r.error);
    if (enErreur) {
      const message = "Chargement des données impossible : " + enErreur.error.message;
      window.alert(message);
      throw new Error(message);
    }
    const [weeks, ues, sequences, sessions, constraints, blocsPerso, blocsPartages, joinUes, joinSequences, joinSessions] =
      resultats.map((r) => r.data || []);

    const blocsPersoParCle = new Map(blocsPerso.map((r) => [r.cle, r.contenu]));
    const blocsPartagesParCle = new Map(blocsPartages.map((r) => [r.cle, r.contenu]));

    // Jointures telles que lues en base : servent à la fois à reconstruire
    // `teacher` ci-dessous ET de snapshot de départ pour enregistrer().
    snapshot.teacherUes = agregerJointure(joinUes, "ue_id");
    snapshot.teacherSequences = agregerJointure(joinSequences, "sequence_id");
    snapshot.teacherSessions = agregerJointure(joinSessions, "session_id");

    return {
      weeks: construireWeeks(weeks),
      ues: ues.map((r) => completerTeacher(depuisLigne(SPEC_UES, r), snapshot.teacherUes.get(r.id))),
      sequences: sequences.map((r) => completerTeacher(depuisLigne(SPEC_SEQUENCES, r), snapshot.teacherSequences.get(r.id))),
      sessions: sessions.map((r) => completerTeacher(depuisLigne(SPEC_SESSIONS, r), snapshot.teacherSessions.get(r.id))),
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
    // Rafraîchi ici (pas seulement à charger()) : un collègue activé en cours
    // de session doit pouvoir résoudre ses jetons dès l'enregistrement
    // suivant, sans recharger la page.
    try {
      await enseignants.rafraichir();
    } catch (e) {
      erreurs.push("Liste des enseignants indisponible : " + (e.message || "erreur réseau."));
    }

    await ecrireEntites(s, uid, "constraints", "oc_constraints", SPEC_CONSTRAINTS, state.constraints, erreurs);
    await ecrireEntites(s, uid, "ues", "oc_ues", SPEC_UES, state.ues, erreurs);
    await ecrireEntites(s, uid, "sequences", "oc_sequences", SPEC_SEQUENCES, state.sequences, erreurs);
    await ecrireEntites(s, uid, "sessions", "oc_sessions", SPEC_SESSIONS, state.sessions, erreurs);

    // Jointures `teacher` : indépendant du diff des lignes ci-dessus (cf.
    // en-tête du fichier) — tourne à chaque enregistrement, pas seulement
    // quand l'entité elle-même change.
    await synchroniserEnseignants(s, "oc_ue_enseignants", "ue_id", snapshot.teacherUes, state.ues, erreurs);
    await synchroniserEnseignants(s, "oc_sequence_enseignants", "sequence_id", snapshot.teacherSequences, state.sequences, erreurs);
    await synchroniserEnseignants(s, "oc_session_enseignants", "session_id", snapshot.teacherSessions, state.sessions, erreurs);

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
  const avecTeacher = Boolean(JOINTURES_TEACHER[type]);
  const aEcrire = [];
  for (const entite of entites || []) {
    if (!entite || !entite.id) continue;
    // L'empreinte se calcule TOUJOURS sur l'entité brute (avec son `teacher`
    // reconstruit tel que rendu par charger()) : c'est la même valeur que
    // celle figée par memoriserSnapshot(), donc la comparaison reste valable
    // même si separerTeacher() en fait une copie amputée juste après.
    const fp = empreinte(entite);
    if (snap.get(entite.id) !== fp) {
      const source = avecTeacher ? separerTeacher(entite).entite : entite;
      aEcrire.push({ id: entite.id, fp, estNouveau: !snap.has(entite.id), colonnes: versLigne(spec, source) });
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

const SNAPSHOT_TEACHER_PAR_TYPE = { ues: "teacherUes", sequences: "teacherSequences", sessions: "teacherSessions" };

async function supprimerRegistre(s, type, table, erreurs) {
  const ids = [...registreSuppression[type]];
  if (!ids.length) return;
  const cleTeacher = SNAPSHOT_TEACHER_PAR_TYPE[type];
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
        // Les jointures teacher de l'id supprimé disparaissent en cascade
        // côté base (cf. schema.sql) : juste du ménage côté snapshot ici.
        if (cleTeacher) snapshot[cleTeacher].delete(id);
      }
    } catch (e) {
      erreurs.push(`${table} #${id} (suppression) : ${e.message || "erreur réseau."}`);
    }
  }));
}

// Fait converger les tables oc_*_enseignants vers ce qu'implique la chaîne
// `teacher` COURANTE de chaque entité (résolution via enseignants.resoudre),
// sans dépendre du diff de la ligne elle-même (voir en-tête du fichier).
async function synchroniserEnseignants(s, table, colonne, snap, entites, erreurs) {
  const taches = [];
  for (const entite of entites || []) {
    if (!entite || !entite.id) continue;
    const voulu = new Set(
      teacherTokensLocal(entite.teacher).map((jeton) => enseignants.resoudre(jeton)).filter(Boolean)
    );
    const actuel = snap.get(entite.id) || new Set();
    const aAjouter = [...voulu].filter((id) => !actuel.has(id));
    const aRetirer = [...actuel].filter((id) => !voulu.has(id));
    if (aAjouter.length || aRetirer.length) taches.push({ id: entite.id, voulu, aAjouter, aRetirer });
  }
  if (!taches.length) return;
  await Promise.all(taches.map(async (t) => {
    try {
      if (t.aAjouter.length) {
        // Un INSERT refusé par la RLS (with check) lève toujours une erreur
        // (contrairement à UPDATE/DELETE, qui filtrent silencieusement) :
        // pas de vérification supplémentaire nécessaire ici.
        const { error } = await s.from(table).insert(t.aAjouter.map((eid) => ({ [colonne]: t.id, enseignant_id: eid })));
        if (error) { erreurs.push(`${table} #${t.id} : ${error.message}`); return; }
      }
      if (t.aRetirer.length) {
        const { data, error } = await s.from(table).delete().eq(colonne, t.id).in("enseignant_id", t.aRetirer).select("enseignant_id");
        if (error) { erreurs.push(`${table} #${t.id} : ${error.message}`); return; }
        // DELETE filtré silencieusement par la RLS (using) : un id non
        // confirmé par .select() n'a pas vraiment été retiré, on le remet
        // dans l'état "réel" pour ne pas perdre le fil au prochain passage.
        const confirmes = new Set((data || []).map((r) => r.enseignant_id));
        for (const id of t.aRetirer) if (!confirmes.has(id)) t.voulu.add(id);
      }
      snap.set(t.id, t.voulu);
    } catch (e) {
      erreurs.push(`${table} #${t.id} : ${e.message || "erreur réseau."}`);
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
