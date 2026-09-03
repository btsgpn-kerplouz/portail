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
  SPEC_UES, SPEC_SEQUENCES, SPEC_SESSIONS, SPEC_CONSTRAINTS, SPEC_REUNIONS,
  versLigne, depuisLigne, empreinte,
} from "./mapping.js";
import * as enseignants from "./enseignants.js";

// `todoNotes`/`devNotes` (texte libre) restent listés pour lire les valeurs
// déjà en base chez qui avait écrit avant la refonte du 16/08/2026 (migration
// faite côté app.js, normalizeData) ; `todoItems`/`devNotesItems` sont les
// vraies listes à cocher utilisées depuis cette date — absentes d'ici, elles
// n'étaient jamais envoyées à Supabase (bug trouvé le 27/08/2026 : les
// tâches ajoutées survivaient en mémoire mais disparaissaient à la
// fermeture/au rechargement).
const CLES_PERSO = ["todoNotes", "todoItems", "deplacements"];
const CLES_PARTAGEES = ["devNotes", "devNotesItems", "todoPartageItems", "weekTemplates", "rubanOverrides", "rubanUeCaps", "promotions", "schoolYear", "weekNotes"];

// Bug trouvé le 27/07/2026 (import d'un gros volume, ~150 écritures dans le
// même enregistrer()) : envoyées TOUTES en une seule fois via Promise.all,
// une bonne partie revenait en 403 "new row violates row-level security
// policy" — y compris pour des lignes déjà écrites avec succès juste avant
// (mêmes droits, même utilisateur). Le lot le plus TÔT dans l'ordre
// (constraints, premier type traité) échouait intégralement, les suivants
// partiellement : signature d'une salve de requêtes concurrentes trop large
// pour le pool de connexions Supabase (offre gratuite), pas d'une erreur de
// logique — RLS retourne ce message quand le contexte d'authentification
// d'une requête individuelle n'a pas pu s'établir correctement sous charge.
// Limiter le nombre de requêtes HTTP simultanées par lot résout ceci sans
// perdre la résilience "un échec isolé n'affecte pas les autres lignes" (une
// grosse upsert unique par tableau serait atomique et perdrait cette
// propriété — cf. règles de conception en tête de fichier).
const CONCURRENCE_MAX = 6;

async function executerAvecLimite(items, tache, limite = CONCURRENCE_MAX) {
  const resultats = new Array(items.length);
  let curseur = 0;
  async function worker() {
    while (curseur < items.length) {
      const i = curseur++;
      resultats[i] = await tache(items[i], i);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limite, items.length) }, worker));
  return resultats;
}

// table de jointure + colonne id par type d'entité porteuse d'un `teacher`.
const JOINTURES_TEACHER = {
  ues: { table: "oc_ue_enseignants", colonne: "ue_id" },
  sequences: { table: "oc_sequence_enseignants", colonne: "sequence_id" },
  sessions: { table: "oc_session_enseignants", colonne: "session_id" },
  reunions: { table: "oc_reunion_enseignants", colonne: "reunion_id" },
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
// Bug trouvé le 27/07/2026 : ids RÉELLEMENT présents en base au dernier
// charger(), constaté directement sur les lignes reçues de Supabase — à ne
// JAMAIS confondre avec `snapshot`, qui fige l'empreinte de `state` côté
// app.js APRÈS normalizeData()/mergeReferenceUes(). Cette dernière fonction
// reconstruit en mémoire les 11 UE du référentiel officiel MÊME quand la
// table oc_ues est vide (aucune n'a jamais été écrite) : si `estNouveau`
// s'appuyait sur `snapshot`, ces UE "connues côté client" ne recevraient
// jamais `cree_par` à l'écriture, et la policy d'INSERT (qui l'exige) les
// rejetterait indéfiniment — exactement le bug observé (seule l'UE au id
// non référentiel, donc absente de cette reconstruction, s'enregistrait).
let idsExistants = creerRegistreVide();

function creerSnapshotVide() {
  return {
    ues: new Map(), sequences: new Map(), sessions: new Map(), constraints: new Map(), reunions: new Map(),
    blocsPerso: new Map(), blocsPartages: new Map(),
    // Étape 8 — contrôle optimiste : `updated_at` connu de chaque clé
    // partagée, tel que lu au dernier chargement réussi (ou après notre
    // propre dernière écriture réussie). Sert de filtre WHERE à l'écriture
    // (voir ecrireBlocs) pour détecter qu'un collègue a modifié la même clé
    // entre-temps, plutôt que d'écraser silencieusement (cf. 002-blobs.sql).
    blocsPartagesUpdatedAt: new Map(),
    // id d'entité -> Set(user_id) déjà en jointure, tel que lu au chargement.
    teacherUes: new Map(), teacherSequences: new Map(), teacherSessions: new Map(), teacherReunions: new Map(),
  };
}
function creerRegistreVide() {
  return { ues: new Set(), sequences: new Set(), sessions: new Set(), constraints: new Set(), reunions: new Set() };
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
    const s = await client();
    await enseignants.rafraichir();
    const resultats = await Promise.all([
      s.from("oc_weeks").select("*"),
      s.from("oc_ues").select("*"),
      s.from("oc_sequences").select("*"),
      s.from("oc_sessions").select("*"),
      s.from("oc_constraints").select("*"),
      s.from("oc_reunions").select("*"),
      s.from("oc_blocs_perso").select("*"),
      s.from("oc_blocs_partages").select("*"),
      s.from("oc_ue_enseignants").select("ue_id, enseignant_id"),
      s.from("oc_sequence_enseignants").select("sequence_id, enseignant_id"),
      s.from("oc_session_enseignants").select("session_id, enseignant_id"),
      s.from("oc_reunion_enseignants").select("reunion_id, enseignant_id"),
    ]);
    const enErreur = resultats.find((r) => r.error);
    if (enErreur) {
      // Bug trouvé le 27/07/2026 : si le snapshot/idsExistants était remis à
      // vide AVANT ces requêtes (comme précédemment), un charger() en échec
      // (ex. la récursion RLS de oc_reunions ci-avant) laissait idsExistants
      // vide — alors qu'app.js reste utilisable (bindEvents() a déjà tourné).
      // Un import de sauvegarde déclenché juste après voyait alors TOUTE
      // entité comme "nouvelle" (idsExistants vide), tentait un INSERT même
      // pour des lignes déjà en base -> "duplicate key value violates unique
      // constraint" en masse. En ne réinitialisant qu'après un chargement
      // RÉUSSI (ci-dessous), un échec laisse l'état précédent (mieux qu'un
      // vide, qui garantit que tout paraîtra "nouveau").
      const message = "Chargement des données impossible : " + enErreur.error.message;
      window.alert(message);
      throw new Error(message);
    }
    const [weeks, ues, sequences, sessions, constraints, reunions, blocsPerso, blocsPartages, joinUes, joinSequences, joinSessions, joinReunions] =
      resultats.map((r) => r.data || []);

    // Nouvelle session (démarrer() après une connexion) : on repart d'un
    // snapshot vierge, sinon un changement de compte sur la même page
    // réutiliserait par erreur l'état d'un précédent utilisateur. Fait
    // seulement ICI (chargement réussi), cf. commentaire ci-dessus.
    snapshot = creerSnapshotVide();
    registreSuppression = creerRegistreVide();
    idsExistants = creerRegistreVide();

    // Constaté sur les lignes BRUTES reçues de Supabase, avant toute
    // reconstruction côté app.js (mergeReferenceUes et consorts) — voir le
    // commentaire sur la déclaration d'idsExistants ci-dessus.
    idsExistants.ues = new Set(ues.map((r) => r.id));
    idsExistants.sequences = new Set(sequences.map((r) => r.id));
    idsExistants.sessions = new Set(sessions.map((r) => r.id));
    idsExistants.constraints = new Set(constraints.map((r) => r.id));
    idsExistants.reunions = new Set(reunions.map((r) => r.id));

    const blocsPersoParCle = new Map(blocsPerso.map((r) => [r.cle, r.contenu]));
    const blocsPartagesParCle = new Map(blocsPartages.map((r) => [r.cle, r.contenu]));
    snapshot.blocsPartagesUpdatedAt = new Map(blocsPartages.map((r) => [r.cle, r.updated_at]));

    // Jointures telles que lues en base : servent à la fois à reconstruire
    // `teacher` ci-dessous ET de snapshot de départ pour enregistrer().
    snapshot.teacherUes = agregerJointure(joinUes, "ue_id");
    snapshot.teacherSequences = agregerJointure(joinSequences, "sequence_id");
    snapshot.teacherSessions = agregerJointure(joinSessions, "session_id");
    snapshot.teacherReunions = agregerJointure(joinReunions, "reunion_id");

    return {
      weeks: construireWeeks(weeks),
      ues: ues.map((r) => completerTeacher(depuisLigne(SPEC_UES, r), snapshot.teacherUes.get(r.id))),
      sequences: sequences.map((r) => completerTeacher(depuisLigne(SPEC_SEQUENCES, r), snapshot.teacherSequences.get(r.id))),
      sessions: sessions.map((r) => completerTeacher(depuisLigne(SPEC_SESSIONS, r), snapshot.teacherSessions.get(r.id))),
      constraints: constraints.map((r) => depuisLigne(SPEC_CONSTRAINTS, r)),
      reunions: reunions.map((r) => completerTeacher(depuisLigne(SPEC_REUNIONS, r), snapshot.teacherReunions.get(r.id))),
      todoNotes: blocsPersoParCle.get("todoNotes"),
      todoItems: blocsPersoParCle.get("todoItems"),
      devNotes: blocsPartagesParCle.get("devNotes"),
      devNotesItems: blocsPartagesParCle.get("devNotesItems"),
      todoPartageItems: blocsPartagesParCle.get("todoPartageItems"),
      deplacements: blocsPersoParCle.get("deplacements"),
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
    for (const type of ["ues", "sequences", "sessions", "constraints", "reunions"]) {
      snapshot[type] = new Map((state[type] || []).map((e) => [e.id, empreinte(e)]));
    }
    snapshot.blocsPerso = new Map(CLES_PERSO.map((cle) => [cle, empreinte(state[cle] ?? null)]));
    snapshot.blocsPartages = new Map(CLES_PARTAGEES.map((cle) => [cle, empreinte(state[cle] ?? null)]));
  },

  marquerSupprime(type, id) {
    registreSuppression[type]?.add(id);
  },

  // `forcer` (étape 4bis — bug d'import trouvé le 27/07/2026) : réécrit
  // chaque entité même si son empreinte est identique à celle du snapshot.
  // Nécessaire pour importDataFromFile(), qui promet à l'utilisateur que
  // l'import REMPLACE les données en ligne : sans ce drapeau, une entité dont
  // l'empreinte "semble" déjà connue est purement et simplement SAUTÉE — y
  // compris si elle a disparu de la table entre-temps (reset via le SQL
  // Editor, ou une autre session, sans rechargement de page). Une ue ainsi
  // sautée n'existe alors plus réellement en base, et toute séquence qui la
  // référence échoue avec une violation de clé étrangère à l'écriture
  // suivante. `estNouveau` (donc `cree_par`) n'est PAS affecté par `forcer` :
  // seul le fait d'ÉCRIRE est forcé, pas l'attribution de la création.
  async enregistrer(state, { forcer = false } = {}) {
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

    await ecrireEntites(s, uid, "constraints", "oc_constraints", SPEC_CONSTRAINTS, state.constraints, erreurs, forcer);
    await ecrireEntites(s, uid, "ues", "oc_ues", SPEC_UES, state.ues, erreurs, forcer);
    await ecrireEntites(s, uid, "sequences", "oc_sequences", SPEC_SEQUENCES, state.sequences, erreurs, forcer);
    await ecrireEntites(s, uid, "sessions", "oc_sessions", SPEC_SESSIONS, state.sessions, erreurs, forcer);
    await ecrireEntites(s, uid, "reunions", "oc_reunions", SPEC_REUNIONS, state.reunions, erreurs, forcer);

    // Jointures `teacher` : indépendant du diff des lignes ci-dessus (cf.
    // en-tête du fichier) — tourne à chaque enregistrement, pas seulement
    // quand l'entité elle-même change.
    await synchroniserEnseignants(s, "oc_ue_enseignants", "ue_id", snapshot.teacherUes, state.ues, erreurs);
    await synchroniserEnseignants(s, "oc_sequence_enseignants", "sequence_id", snapshot.teacherSequences, state.sequences, erreurs);
    await synchroniserEnseignants(s, "oc_session_enseignants", "session_id", snapshot.teacherSessions, state.sessions, erreurs);
    await synchroniserEnseignants(s, "oc_reunion_enseignants", "reunion_id", snapshot.teacherReunions, state.reunions, erreurs);

    // Suppressions dans l'ordre inverse des écritures ci-dessus.
    await supprimerRegistre(s, "sessions", "oc_sessions", erreurs);
    await supprimerRegistre(s, "sequences", "oc_sequences", erreurs);
    await supprimerRegistre(s, "ues", "oc_ues", erreurs);
    await supprimerRegistre(s, "constraints", "oc_constraints", erreurs);
    await supprimerRegistre(s, "reunions", "oc_reunions", erreurs);

    await ecrireBlocs(s, "oc_blocs_perso", CLES_PERSO, snapshot.blocsPerso, state,
      (cle, valeur) => ({ user_id: uid, cle, contenu: valeur ?? null }), erreurs, forcer);
    // oc_blocs_partages : contrôle optimiste (étape 8), voir ecrireBlocs et
    // snapshot.blocsPartagesUpdatedAt — sans objet pour oc_blocs_perso, privé
    // par construction (jamais touché que par son propre compte).
    await ecrireBlocs(s, "oc_blocs_partages", CLES_PARTAGEES, snapshot.blocsPartages, state,
      (cle, valeur) => ({ cle, contenu: valeur ?? null, updated_par: uid, updated_at: new Date().toISOString() }),
      erreurs, forcer, snapshot.blocsPartagesUpdatedAt);

    // En cas d'échec (même partiel), on ne fait pas croire à une sauvegarde
    // fraîche : l'horodatage affiché reste celui du dernier succès réel.
    return { lastSavedAt: erreurs.length ? state.lastSavedAt : new Date().toISOString(), erreurs };
  },
};

async function ecrireEntites(s, uid, type, table, spec, entites, erreurs, forcer = false) {
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
    if (forcer || snap.get(entite.id) !== fp) {
      const source = avecTeacher ? separerTeacher(entite).entite : entite;
      aEcrire.push({ id: entite.id, fp, estNouveau: !idsExistants[type].has(entite.id), colonnes: versLigne(spec, source) });
    }
  }
  if (!aEcrire.length) return;
  await executerAvecLimite(aEcrire, async (item) => {
    try {
      // Bug trouvé le 27/07/2026 : un .upsert() unique pour "créer OU
      // mettre à jour" ne convient pas ici. Sous RLS, `insert ... on
      // conflict do update` reste soumis à la policy d'INSERT (qui exige
      // `cree_par = auth.uid()`) même quand la ligne existe déjà et que
      // l'issue réelle est une mise à jour inoffensive — omettre `cree_par`
      // (le cas normal pour une ligne existante, volontairement, pour ne
      // pas écraser le vrai créateur) faisait alors rejeter jusqu'à des
      // lignes déjà correctement enregistrées. Séparer insert (nouvelle
      // ligne, cree_par envoyé) et update (ligne existante, cree_par jamais
      // touché) lève l'ambiguïté : chacun n'est jugé que par sa propre
      // policy.
      // .select('id') est ce qui permet de distinguer un succès d'un refus
      // SILENCIEUX de la RLS : sans lui, une écriture filtrée par la policy
      // ne renvoie pas d'erreur (comme un WHERE qui ne matche rien), donc
      // "pas d'erreur" ne veut pas dire "écrit".
      const requete = item.estNouveau
        ? s.from(table).insert({ id: item.id, ...item.colonnes, cree_par: uid }).select("id")
        : s.from(table).update(item.colonnes).eq("id", item.id).select("id");
      const { data, error } = await requete;
      if (error) erreurs.push(`${table} #${item.id} : ${error.message}`);
      else if (!data?.length) erreurs.push(`${table} #${item.id} : modification refusée (droits insuffisants ?).`);
      else { snap.set(item.id, item.fp); idsExistants[type].add(item.id); }
    } catch (e) {
      erreurs.push(`${table} #${item.id} : ${e.message || "erreur réseau."}`);
    }
  });
}

const SNAPSHOT_TEACHER_PAR_TYPE = { ues: "teacherUes", sequences: "teacherSequences", sessions: "teacherSessions", reunions: "teacherReunions" };

async function supprimerRegistre(s, type, table, erreurs) {
  const ids = [...registreSuppression[type]];
  if (!ids.length) return;
  const cleTeacher = SNAPSHOT_TEACHER_PAR_TYPE[type];
  await executerAvecLimite(ids, async (id) => {
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
        idsExistants[type]?.delete(id);
        // Les jointures teacher de l'id supprimé disparaissent en cascade
        // côté base (cf. schema.sql) : juste du ménage côté snapshot ici.
        if (cleTeacher) snapshot[cleTeacher].delete(id);
      }
    } catch (e) {
      erreurs.push(`${table} #${id} (suppression) : ${e.message || "erreur réseau."}`);
    }
  });
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
  await executerAvecLimite(taches, async (t) => {
    try {
      if (t.aAjouter.length) {
        // Un INSERT refusé par la RLS (with check) lève toujours une erreur
        // (contrairement à UPDATE/DELETE, qui filtrent silencieusement) :
        // pas de vérification supplémentaire nécessaire ici. `upsert` avec
        // `ignoreDuplicates` évite le "duplicate key" quand un autre compte
        // a déjà inséré la même paire entre le chargement du snapshot local
        // et cet appel (deux comptes ouverts en même temps).
        const { error } = await s.from(table)
          .upsert(t.aAjouter.map((eid) => ({ [colonne]: t.id, enseignant_id: eid })), {
            onConflict: `${colonne},enseignant_id`,
            ignoreDuplicates: true,
          });
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
  });
}

// `updatedAtSnap` (étape 8, seulement pour oc_blocs_partages) : quand fourni
// et que la clé était déjà connue, l'écriture se fait via un UPDATE filtré
// sur l'`updated_at` lu au dernier chargement plutôt qu'un upsert nu. Si un
// collègue a réenregistré cette même clé entre-temps, la ligne en base ne
// matche plus ce filtre : 0 ligne modifiée, on le détecte et on prévient au
// lieu d'écraser silencieusement son écriture (dernier écrivain "bloqué",
// pas "gagnant").
async function ecrireBlocs(s, table, cles, snap, state, construireLigne, erreurs, forcer = false, updatedAtSnap = null) {
  const aEcrire = [];
  for (const cle of cles) {
    const valeur = state[cle];
    const fp = empreinte(valeur ?? null);
    if (forcer || snap.get(cle) !== fp) aEcrire.push({ cle, valeur, fp });
  }
  if (!aEcrire.length) return;
  await executerAvecLimite(aEcrire, async ({ cle, valeur, fp }) => {
    try {
      const ligne = construireLigne(cle, valeur);
      const connu = updatedAtSnap?.get(cle);
      let data, error;
      if (updatedAtSnap && connu) {
        ({ data, error } = await s.from(table).update(ligne).eq("cle", cle).eq("updated_at", connu).select());
        if (!error && !data?.length) {
          erreurs.push(`${table} « ${cle} » : quelqu'un d'autre a modifié cette donnée entre-temps — rechargez (⟳) avant de réessayer.`);
          return;
        }
      } else {
        ({ data, error } = await s.from(table).upsert(ligne).select());
      }
      if (error) erreurs.push(`${table} « ${cle} » : ${error.message}`);
      else if (!data?.length) erreurs.push(`${table} « ${cle} » : modification refusée (droits insuffisants ?).`);
      else {
        snap.set(cle, fp);
        if (updatedAtSnap) updatedAtSnap.set(cle, data[0].updated_at);
      }
    } catch (e) {
      erreurs.push(`${table} « ${cle} » : ${e.message || "erreur réseau."}`);
    }
  });
}
