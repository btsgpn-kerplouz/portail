const DAYS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'];
// Libellés incluant le samedi (index 5). La grille du planning reste à 5 colonnes
// (DAYS) ; le samedi est saisissable via la modale séance et affiché à part (ligne
// « Samedi » conditionnelle + alerte en tête de frise) — événements rares.
const DAY_NAMES = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
const SLOTS = [
  '8h15 – 9h10',
  '9h10 – 10h05',
  '10h20 – 11h15',
  '11h15 – 12h10',
  'Repas',
  '13h25 – 14h20',
  '14h20 – 15h15',
  '15h30 – 16h25',
  '16h25 – 17h20'
];
// Bornes en minutes depuis minuit de chaque créneau de SLOTS (ajustements #6,
//22/08/2026 — voir seanceRangeMinutes) : « Repas » (index 4) n'a pas
// d'horaire dans le libellé, mais a bien de vraies bornes (12h10–13h25) qui
// ne changent jamais — plus fiable qu'un parsing de texte, qui échouait
// justement sur ce créneau-là ("Repas" ne matche aucune heure).
const SLOT_BOUNDS_MIN = [
  [8 * 60 + 15, 9 * 60 + 10],
  [9 * 60 + 10, 10 * 60 + 5],
  [10 * 60 + 20, 11 * 60 + 15],
  [11 * 60 + 15, 12 * 60 + 10],
  [12 * 60 + 10, 13 * 60 + 25],
  [13 * 60 + 25, 14 * 60 + 20],
  [14 * 60 + 20, 15 * 60 + 15],
  [15 * 60 + 30, 16 * 60 + 25],
  [16 * 60 + 25, 17 * 60 + 20]
];
const DEFAULT_PROMOTIONS = ['GPN1', 'GPN2'];
const DEPLACEMENT_STATUSES = ['Demande à faire', 'En cours', 'Terminée'];
const DEFAULT_TAUX = 0.55;
const ROOM_TO_BOOK_LABELS = { info: 'Salle informatique', amphi: 'Amphithéâtre' };
const VEHICULE_LABEL = 'Véhicule de l’établissement';
const MATERIEL_LABEL = 'Matériel à réserver';
const ROOM_ALERT_DAYS = 15;
const DAY_LANES = [
  { key: 'd0', day: 0, part: 'day', label: 'Lundi' },
  { key: 'd1', day: 1, part: 'day', label: 'Mardi' },
  { key: 'd2', day: 2, part: 'day', label: 'Mercredi' },
  { key: 'd3', day: 3, part: 'day', label: 'Jeudi' },
  { key: 'd4', day: 4, part: 'day', label: 'Vendredi' },
  { key: 'unspecified', day: '', part: 'unspecified', label: 'Jour à préciser' }
];
const SEMESTERS = ['Semestre 1', 'Semestre 2', 'Semestre 3', 'Semestre 4'];
// Créneaux type : 2 périodes de l'année, chacune couvrant les 2 promos.
// (GPN1 = 1re année, GPN2 = 2e année) → un semestre par (période, promo).
const TEMPLATE_PERIODS = [
  { key: 'autumn', label: 'Septembre – décembre', short: 'Sept–déc', semesters: { GPN1: 'Semestre 1', GPN2: 'Semestre 3' } },
  { key: 'spring', label: 'Janvier – mai', short: 'Janv–mai', semesters: { GPN1: 'Semestre 2', GPN2: 'Semestre 4' } }
];
// Créneaux de début / fin de bloc visuel (séparés par les pauses & le repas)
// → BLOCK_STARTS = où le masque réaffiche le libellé « UE X.X » (contour haut) ;
//   BLOCK_ENDS = contour bas d'un bloc masqué.
const BLOCK_STARTS = new Set([0, 2, 5, 7]);
const BLOCK_ENDS = new Set([1, 3, 6, 8]);
const UE_REFERENCE = [
  { id: 'ue_11', code: 'UE 1.1', title: 'Inventaires naturalistes', promotion: 'GPN1', semester: 'Semestre 1', period: 'Septembre-décembre', capacities: [
    { code: 'C4.1', title: 'Élaborer une stratégie de mise en œuvre de protocoles' }
  ] },
  { id: 'ue_12', code: 'UE 1.2', title: 'Concertation territoriale', promotion: 'GPN1', semester: 'Semestre 1', period: 'Septembre-décembre', capacities: [
    { code: 'C8.1', title: 'Réaliser un diagnostic territorial' },
    { code: 'C8.2', title: 'Participer à un processus de concertation' }
  ] },
  { id: 'ue_13', code: 'UE 1.3', title: 'Enjeux socio-économiques', promotion: 'GPN1', semester: 'Semestre 1', period: 'Septembre-décembre', capacities: [
    { code: 'C1.1', title: 'Saisir les enjeux de la réalité socio-économique' },
    { code: 'C1.2', title: 'Se situer dans des questions sociétales' },
    { code: 'C1.3', title: 'Argumenter un point de vue dans un débat de société' }
  ] },
  { id: 'ue_21', code: 'UE 2.1', title: 'Diagnostic écologique', promotion: 'GPN1', semester: 'Semestre 2', period: 'Janvier-avril', capacities: [
    { code: 'C4.2', title: 'Recueillir des données écologiques à partir d’un protocole sur une base cartographique géoréférencée' },
    { code: 'C4.3', title: 'Produire un diagnostic de synthèse' },
    { code: 'C5.1', title: 'Choisir des stratégies opérationnelles en fonction du contexte' }
  ] },
  { id: 'ue_22', code: 'UE 2.2', title: 'Animation nature', promotion: 'GPN1', semester: 'Semestre 2', period: 'Janvier-avril', capacities: [
    { code: 'C6.2', title: 'Réaliser des prestations d’animation scientifique' },
    { code: 'C6.3', title: 'Coordonner l’accueil du public en sécurité' }
  ] },
  { id: 'ue_31', code: 'UE 3.1', title: 'Génie écologique', promotion: 'GPN2', semester: 'Semestre 3', period: 'Septembre-décembre', capacities: [
    { code: 'C2.4', title: 'Conduire un projet' },
    { code: 'C5.2', title: 'Organiser des actions de gestion de la nature' },
    { code: 'C5.3', title: 'Coordonner la mise en œuvre des opérations de génie écologique' },
    { code: 'C7.1', title: 'Monter un projet professionnel' }
  ], correction: 'C2.4 rattachée à l’UE 3.1 selon correction demandée.' },
  { id: 'ue_32', code: 'UE 3.2', title: 'Médiation scientifique', promotion: 'GPN2', semester: 'Semestre 3', period: 'Septembre-décembre', capacities: [
    { code: 'C3.1', title: 'Répondre à des besoins d’information pour soi et pour un public' },
    { code: 'C3.3', title: 'Communiquer avec des moyens adaptés' },
    { code: 'C6.1', title: 'Concevoir des projets de médiation scientifique dans le cadre d’activités EREDD' }
  ] },
  { id: 'ue_41', code: 'UE 4.1', title: 'Communication', promotion: 'GPN2', semester: 'Semestre 4', period: 'Janvier-mai', capacities: [
    { code: 'C8.3', title: 'Communiquer sur un projet sensible en situation de conflit' }
  ] },
  { id: 'ue_42', code: 'UE 4.2', title: 'Valorisation des espaces naturels', promotion: 'GPN2', semester: 'Semestre 4', period: 'Janvier-mai', capacities: [
    { code: 'C7.2', title: 'Opérationnaliser les différentes phases d’un projet professionnel' },
    { code: 'C7.3', title: 'Évaluer globalement le déroulement d’un projet professionnel' }
  ] },
  { id: 'ue_43', code: 'UE 4.3', title: 'Multisports', promotion: 'GPN2', semester: 'Semestre 4', period: 'Janvier-mai', capacities: [
    { code: 'C2.1', title: 'S’engager dans un mode de vie actif et solidaire' }
  ] },
  { id: 'ue_44', code: 'UE 4.4', title: 'Insertion professionnelle', promotion: 'GPN2', semester: 'Semestre 4', annual: true, period: 'Janvier-mai', capacities: [
    { code: 'C2.2', title: 'S’insérer dans un environnement professionnel' },
    { code: 'C2.3', title: 'S’adapter à des enjeux ou des contextes particuliers' },
    { code: 'C3.2', title: 'Communiquer en langue étrangère' }
  ] }
];

/* 18/08 — Lot F : « PDF d'origine » devient une vraie page (liste + lecteur),
   voir #rubanTabPdf/renderPdfLibrary. La liste s'était arrêtée à M4-M8 alors que
   docs/ contient déjà M1-M3 (mêmes intitulés que les onglets du référentiel
   interactif, ci-dessous) : complétée pour couvrir tout le dossier. */
const REFERENCE_DOCS = [
  { id: 'referentiel', title: 'Référentiel de diplôme BTSA GPN 2024', file: 'referentiel-diplome-2024.pdf', type: 'Référentiel de diplôme' },
  { id: 'm1', title: 'Module 1 — Inscription dans le monde d’aujourd’hui', file: 'module-1-inscription-monde-aujourdhui.pdf', type: 'Document d’accompagnement' },
  { id: 'm2', title: 'Module 2 — Construction du projet personnel et professionnel', file: 'module-2-projet-personnel-professionnel.pdf', type: 'Document d’accompagnement' },
  { id: 'm3', title: 'Module 3 — Communication', file: 'module-3-communication.pdf', type: 'Document d’accompagnement' },
  { id: 'm4', title: 'Module 4 — Expertise naturaliste', file: 'module-4-expertise-naturaliste.pdf', type: 'Document d’accompagnement' },
  { id: 'm5', title: 'Module 5 — Opérations de gestion environnementale', file: 'module-5-operations-gestion-environnementale.pdf', type: 'Document d’accompagnement' },
  { id: 'm6', title: 'Module 6 — Éducation à l’environnement et médiation scientifique', file: 'module-6-education-environnement-mediation.pdf', type: 'Document d’accompagnement' },
  { id: 'm7', title: 'Module 7 — Montage de projet de gestion environnementale et de valorisation de la nature', file: 'module-7-montage-projet.pdf', type: 'Document d’accompagnement' },
  { id: 'm8', title: 'Module 8 — Concertation territoriale et communication', file: 'module-8-concertation-territoriale.pdf', type: 'Document d’accompagnement' },
  { id: 'maths', title: 'Mathématiques appliquées — exemples de mobilisation', file: 'mathematiques-appliquees-exemples.pdf', type: 'Document thématique' },
  { id: 'ruban', title: 'Ruban semestriel (document d’origine)', file: 'ruban-semestres.pdf', type: 'Ruban pédagogique' }
];

// Référentiel structuré par capacités, chargé depuis reference-capacities.js
// (blocs B1–B8, capacités C1.1–C8.3, avec critères d'évaluation, savoirs et disciplines).
const CAPACITY_REFERENTIAL = window.REFERENCE_CAPACITIES || {};

let state = null;
// Lot 4 — semaine du jour par défaut (repli sur le début d'année scolaire si
// hors année scolaire, cf. loadData() qui retombe sur state.weeks[0] quand
// cette semaine n'existe pas dans le planning).
let selectedWeek = currentWeekId();
// Écran 12 — modale séance : semaine affichée par le sélecteur de créneaux et
// choix courant de l'utilisateur (un créneau standard, « autre créneau » ou
// « sans date »). État UI pur, jamais persisté tel quel (voir submitSessionForm).
let sessionSlotPickerWeekId = '';
let sessionSlotChoice = null;
// 18/08 — calendrier de la modale séquence (exception assumée à REGLES.md #22 pour cet
// écran précis, décision de Martin) : mois affiché ('AAAA-MM'), null = pas encore navigué.
let seqCalMonthKey = null;
// Écran 12 — « Créer et enchaîner » : le prochain submit du formulaire séance
// doit rouvrir le formulaire au lieu de fermer la modale.
let sessionChainRequested = false;
// Refonte écran 4 (16/08/2026) — période affichée par la bande de semaines du
// Planning hebdo (REGLES.md #22, seul sélecteur de date de l'app). Resynchronisée
// sur la semaine sélectionnée à chaque renderPlanning() ; la bascule Sept–déc/
// Janv–mai ne fait que parcourir, elle ne déplace pas la semaine affichée.
let weekStripPeriod = 'autumn';
// Refonte écran 2 (16/08/2026) — le sidebar UE est le seul filtrage de la
// Conception (REGLES.md #21) : une promotion active, une UE sélectionnée à la
// fois (vrai sélecteur, seule exception à l'estompage), un sous-onglet actif.
let designPromotionFilter = 'GPN1';
let designSelectedUeId = '';
let designActiveTab = 'sequences';
/* Refonte écran 3 (16/08/2026) — la frise s'ouvre sur la promotion/semestre de
   la SAISON en cours, et sur MON UE (vrai sélecteur, comme Conception). `null`
   = « pas encore décidé », calculé une fois les données chargées (les semaines
   n'existent pas encore avant ça). */
let ganttPromo = null;
let ganttSemester = null;
let ganttSelectedUeId = '';
let ganttStacked = false;
// Mémoire de la dernière frise rendue, pour recalculer « hors fenêtre » et
// recadrer sur la semaine en cours à l'activation de l'onglet (panneau alors
// caché → clientWidth invalide au moment du rendu programmé par renderAll()).
let ganttLastUes = [];
let ganttLastWeeks = [];
let weekBacklogScope = 'week';
let weekBacklogUeFilter = 'Tous';
/* Lot G — mémoire de travail de la modale de séance : les capacités cochées,
   rangées par UE, le temps que la modale reste ouverte. Changer d'UE puis
   revenir retrouve donc sa sélection au lieu de la perdre. Vidée à chaque
   ouverture (openSessionModal). */
let capacitesParUe = {};
let ueCapacitesPrecedente = '';
let selectedReferenceCode = 'C4.2';
let selectedReferenceModule = 'm4';
let rubanTeacher = 'Tous';
let creneauxPeriod = 'autumn'; // période affichée dans l'éditeur de créneaux type
let creneauxTeacherFilter = ''; // '' -> par défaut mes créneaux (moiInitiales) une fois connu
let studentPlanningPromo = ''; // Écran 8 — promotion affichée, résolue au premier rendu (state.promotions[0])
// Retours #3 (18-19/08/2026) — comme creneauxPeriod (Mes créneaux types) :
// la semaine type d'une promotion n'est pas forcément la même sur les 2
// périodes de l'année.
let studentPlanningPeriod = 'autumn';
let studentPlanningMineOnly = true; // case « Mettre mes cours en avant »
let weekMaskActive = false;    // masque « créneaux type » dans le Planning hebdo

// initiales transmises par js/auth.js via OC_APP.demarrer(initiales) — sert
// au périmètre strictement personnel du Tableau de bord (voir estVisiblePourMoi).
let moiInitiales = '';
// Nom/prénom transmis en même temps (écran 13, Ordre de mission — préremplissage
// de « Commandé par »). Absents si non fournis (ex. anciens appels non mis à jour).
let moiNom = '';
let moiPrenom = '';

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

function uid(prefix = 'id') {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

/* Date du jour en LOCAL (pas toISOString, qui bascule en UTC — décalerait la
   journée de la case « À faire » autour de minuit). */
function todayIso() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/* Lot 7 — la modale séance affichait la valeur brute enregistrée (« Fictif à
   placer » / « Définitif EDT ») dans son menu, jargon interne. Les nouvelles
   valeurs stockées sont des codes courts (fictif/definitif), décorrélés du
   texte affiché (« Pas encore placée » / « Placée à l'emploi du temps ») ;
   cette fonction fait passer les séances déjà enregistrées avec l'ancien
   texte vers le nouveau code, sans quoi elles basculeraient toutes en
   « à placer » au premier chargement. */
function normalizePlacementStatus(value) {
  if (value === 'fictif' || value === 'definitif') return value;
  if (value === 'Fictif à placer') return 'fictif';
  if (value === 'Définitif EDT') return 'definitif';
  return '';
}

/* ---- Lot B — LE DÉPLACEMENT, DE BOUT EN BOUT ----------------------------
   Règle métier : une séance ou une réunion HORS ÉTABLISSEMENT demande un
   véhicule, et la suite dépend duquel.
     ''              pas de déplacement
     'etablissement' véhicule de l'établissement → à RÉSERVER (alerte 15 j,
                     exactement comme une salle informatique). Ni ordre de
                     mission, ni frais.
     'personnel'     véhicule personnel → ORDRE DE MISSION avant, FRAIS après.
   Ordre de mission et frais ne sont donc pas deux modules : ce sont les deux
   étapes du MÊME déplacement.

   L'ancienne case à cocher `personalVehicle` ne distinguait pas « véhicule de
   l'établissement » de « pas de déplacement ». Elle est conservée et tenue à
   jour, jamais lue comme source de vérité : c'est une colonne Supabase dédiée
   côté réunions (`personal_vehicle`), et un poste resté sur une version
   antérieure du front doit continuer à y lire une valeur juste. Les trois
   nouveaux champs tombent dans `contenu` jsonb → aucune migration. */
const DEPLACEMENT_MODES = ['', 'etablissement', 'personnel'];

function normalizeDeplacementFields(entity) {
  const mode = DEPLACEMENT_MODES.includes(entity?.deplacement)
    ? entity.deplacement
    : (entity?.personalVehicle ? 'personnel' : '');
  return {
    deplacement: mode,
    personalVehicle: mode === 'personnel',
    // Ces deux-là n'ont de sens que dans leur branche : les y borner évite
    // qu'un ancien « réservé » ressorte si le mode change plus tard.
    vehicleBooked: mode === 'etablissement' && !!entity?.vehicleBooked,
    ordreMission: mode === 'personnel' && !!entity?.ordreMission
  };
}

function normalizeData(data) {
  const normalized = {
    version: '5.0.0',
    schoolYear: data.schoolYear || '',
    promotions: data.promotions || DEFAULT_PROMOTIONS,
    weeks: [],
    ues: data.ues || [],
    sequences: data.sequences || [],
    sessions: data.sessions || [],
    constraints: data.constraints || [],
    deplacements: Array.isArray(data.deplacements) ? data.deplacements : [],
    reunions: Array.isArray(data.reunions) ? data.reunions : [],
    // Espace « Matériel emprunté » (ajustements #5, 22/08/2026). `dateRetour`
    // vide = encore emprunté. Ajustements #6 (22/08/2026) : le champ libre
    // `materiel` cède la place à un vrai catalogue à 2 niveaux (type +
    // identifiant individuel, cf. materielTypes/materielItems ci-dessous) —
    // toujours stocké en texte à plat sur l'emprunt (pas de référence vers
    // l'item du catalogue) : cohérent avec le reste de l'appli (aucune
    // intégrité référentielle ailleurs, ex. `lieu`/`conducteur` des
    // déplacements) et robuste si un item est renommé/supprimé après coup.
    materielEmprunts: Array.isArray(data.materielEmprunts) ? data.materielEmprunts.map(m => ({
      id: m.id || uid('materiel'),
      materielType: m.materielType || '',
      materielIdentifiant: m.materielIdentifiant || '',
      etudiant: m.etudiant || '',
      classe: m.classe || 'GPN1',
      date: m.date || '',
      dateRetour: m.dateRetour || '',
      teacher: m.teacher || ''
    })) : [],
    // Catalogue de matériel (ajustements #6, 22/08/2026) — géré depuis le
    // Tableau de bord desktop (encart « Matériel — catalogue ») : types
    // suggérés par Martin (loupe, longue-vue, jumelles, loupe binoculaire,
    // enregistreur), sans identifiant individuel préconçu — les numéros
    // réels sont à lui, pas à inventer. Seed uniquement si jamais sauvegardé.
    materielTypes: Array.isArray(data.materielTypes) && data.materielTypes.length
      ? data.materielTypes.slice()
      : ['Loupe', 'Longue-vue', 'Jumelles', 'Loupe binoculaire', 'Enregistreur'],
    materielItems: Array.isArray(data.materielItems) ? data.materielItems.map(it => ({
      id: it.id || uid('materielitem'),
      type: it.type || '',
      identifiant: it.identifiant || ''
    })) : [],
    // Ordres de mission autonomes (ajustements #5, 22/08/2026) : pas rattachés
    // à une séance/réunion (bouton « + Nouvel ordre de mission », écran Accueil
    // mobile) — `titre` reste vide tant que le champ « Objet » du document n'a
    // pas été rempli (voir missionSetField, il l'y recopie).
    missions: Array.isArray(data.missions) ? data.missions.map(m => ({
      id: m.id || uid('mission'),
      titre: m.titre || '',
      missionDetail: (m.missionDetail && typeof m.missionDetail === 'object') ? m.missionDetail : null
    })) : [],
    weekNotes: data.weekNotes || {},
    // « À faire » : vraie liste à cocher (refonte écran 1, 16/08/2026), pas du
    // texte libre. `todoNotes` (ancien format, string) reste lu en migration
    // juste en dessous, pour ne pas perdre les notes déjà saisies.
    todoNotes: typeof data.todoNotes === 'string' ? data.todoNotes : '',
    todoItems: Array.isArray(data.todoItems) ? data.todoItems.map(normalizeTodoItem).filter(Boolean) : [],
    // « Amélioration de l'appli » : même liste à cocher que « À faire » (retours
    // 17/08/2026), mais partagée entre tous les comptes. `devNotes` (ancien
    // format, texte libre) reste lu en migration juste en dessous.
    devNotes: typeof data.devNotes === 'string' ? data.devNotes : '',
    devNotesItems: Array.isArray(data.devNotesItems) ? data.devNotesItems.map(normalizeTodoItem).filter(Boolean) : [],
    rubanOverrides: (data.rubanOverrides && typeof data.rubanOverrides === 'object') ? data.rubanOverrides : {},
    rubanUeCaps: (data.rubanUeCaps && typeof data.rubanUeCaps === 'object' && !Array.isArray(data.rubanUeCaps)) ? data.rubanUeCaps : {},
    weekTemplates: Array.isArray(data.weekTemplates) ? data.weekTemplates.map(normalizeTemplateSlot).filter(Boolean) : [],
    // Écran 8 — Planning étudiant : semaine type PAR PROMOTION, saisie à la main.
    // Même forme que weekTemplates mais sans semestre ni colonne L/R (aucune
    // cellule scindée dans la maquette de cet écran) et une promotion propre
    // (weekTemplates la déduit du semestre ; ici il n'y a pas de semestre).
    studentWeekTemplate: Array.isArray(data.studentWeekTemplate) ? data.studentWeekTemplate.map(normalizeStudentSlot).filter(Boolean) : [],
    lastSavedAt: data.lastSavedAt || null
  };

  // Retours 17/08/2026 — fenêtre glissante (~26 semaines avant/après
  // aujourd'hui) RECALCULÉE à chaque chargement, plutôt que persistée : plus
  // de mur « hors année scolaire » l'été, plus de bornes en dur à retoucher
  // à la main chaque rentrée (voir buildRollingWeeks). Les identifiants de
  // semaine restent des clés ISO stables (année-Sxx) : une séance placée
  // dans « 2026-S38 » retrouve toujours la même semaine calendaire.
  normalized.weeks = buildRollingWeeks();
  normalized.schoolYear = anneeScolaireLabel(normalized.weeks);

  normalized.ues = mergeReferenceUes(normalized.ues);
  normalized.ues = normalized.ues.map(ue => ({ ...ue, startWeekId: ue.startWeekId || '', endWeekId: ue.endWeekId || '', teacher: ue.teacher || ue.teachers || '', annual: !!ue.annual }));
  normalized.sequences = normalized.sequences.map(seq => normalizeSequence(seq));

  if (!normalized.ues.length && normalized.sequences.length) {
    const uniqueModules = [...new Set(normalized.sequences.map(s => s.module || s.ue || 'UE non précisée'))];
    normalized.ues = uniqueModules.map((title, i) => ({
      id: `ue_migration_${i + 1}`,
      code: title.startsWith('UE') ? title.split(' ')[0] : `UE ${i + 1}`,
      title,
      promotion: 'GPN1',
      semester: 'Semestre 1',
      period: '',
      hoursTarget: 'À préciser',
      description: 'UE créée automatiquement lors de la migration depuis une version antérieure.'
    }));
    normalized.sequences = normalized.sequences.map(seq => ({
      ...seq,
      ueId: seq.ueId || normalized.ues.find(ue => ue.title === (seq.module || seq.ue))?.id || normalized.ues[0]?.id || '',
      semester: seq.semester || 'Semestre 1',
      targetWeeks: seq.targetWeeks || seq.weeks || '',
      hoursEstimate: seq.hoursEstimate || seq.hours || '',
      capacities: seq.capacities || '',
      prerequisites: seq.prerequisites || '',
      keywords: seq.keywords || seq.details || '',
      assessment: seq.assessment || '',
      resources: seq.resources || '',
      notes: seq.notes || seq.details || ''
    }));
  }

  normalized.sessions = normalized.sessions.map(s => ({
    ...s,
    ueId: s.ueId || normalized.sequences.find(seq => seq.id === s.sequenceId)?.ueId || '',
    placementStatus: normalizePlacementStatus(s.placementStatus) || (s.weekId ? 'definitif' : 'fictif'),
    targetWeekId: s.targetWeekId || s.weekId || normalized.weeks[0]?.id || '',
    expectedDuration: s.expectedDuration || '',
    order: s.order || '',
    fictiveSlot: s.fictiveSlot || '',
    exactDate: s.exactDate || '',
    customStart: s.customStart || '',
    customEnd: s.customEnd || '',
    capacityCodes: Array.isArray(s.capacityCodes) ? s.capacityCodes : [],
    objectives: s.objectives || s.notes || '',
    keywords: s.keywords || '',
    activities: s.activities || '',
    notions: s.notions || '',
    materials: s.materials || '',
    assessment: s.assessment || '',
    homework: s.homework || '',
    differentiation: s.differentiation || '',
    fictiveDay: s.fictiveDay ?? '',
    teacher: s.teacher || '',
    status: s.status || 'Prévue',
    // Écran 17 (mobile, 21/08/2026) — « ✓ Faite », coché à la main : une
    // séance passée (est-passe, calculée sur la date) n'est PAS forcément
    // « réalisée » (elle peut avoir sauté), et inversement on veut pouvoir
    // la traiter avant la fin du créneau. Champ neuf, indépendant de la date.
    realisee: !!s.realisee,
    constraintId: s.constraintId || '', // Lot K — rattachement à une semaine thématique (EIL)
    ...normalizeDeplacementFields(s),                      // Lot B — '' | 'etablissement' | 'personnel'
    demiGroupe: normalizeDemiGroupe(s.demiGroupe, s.group) // Lot V — '' | 'A' | 'B'
  }));

  normalized.deplacements = normalized.deplacements.map(d => ({
    id: d.id || uid('deplacement'),
    date: d.date || '',
    lieu: d.lieu || '',
    conducteur: d.conducteur || '',
    classe: d.classe || 'GPN1',
    kmAR: Number(d.kmAR) || 0,
    taux: (d.taux === 0 || d.taux) ? Number(d.taux) : DEFAULT_TAUX,
    statut: DEPLACEMENT_STATUSES.includes(d.statut) ? d.statut : DEPLACEMENT_STATUSES[0],
    ue: d.ue || '',
    keywords: d.keywords || '',
    sessionId: d.sessionId || '',
    reunionId: d.reunionId || '', // Lot M — déplacement issu d'une réunion
    // Partage inter-comptes (22/08/2026) : à qui revient cette ligne (même
    // convention que session.teacher/reunion.teacher — initiales, vide =
    // moi). « Le véhicule était celui d'un collègue » se traduit ici : on
    // réassigne la ligne, elle sort de mon Frais et rejoint le sien.
    teacher: d.teacher || ''
  }));

  // Lot M — Réunions réalisées (journal consultable a posteriori : qui/où/quand
  // + sujets abordés). Une réunion peut documenter un frais de déplacement, qui
  // alimente alors le module « Frais de déplacement » (via reunionId ci-dessus).
  normalized.reunions = normalized.reunions.map(r => ({
    id: r.id || uid('reunion'),
    date: r.date || '',
    lieu: r.lieu || '',
    participants: r.participants || '',
    sujets: r.sujets || '',
    ...normalizeDeplacementFields(r),                      // Lot B
    teacher: r.teacher || '' // enseignant(s) présents : détermine la visibilité (RLS oc_reunions)
  }));

  normalized.constraints = normalized.constraints.map(c => ({
    ...c,
    id: c.id || uid('constraint'),
    label: c.label || 'Contrainte sans intitulé',
    type: c.type || 'Autre',
    start: c.start || '',
    end: c.end || c.start || '',
    promotions: Array.isArray(c.promotions) ? c.promotions : [],
    notes: c.notes || ''
  }));

  // Migration ancien format « À faire » (texte libre) → liste à cocher : une
  // seule fois, à la première ouverture après la refonte — sans quoi les
  // notes déjà saisies par Martin disparaîtraient silencieusement.
  if (!normalized.todoItems.length && normalized.todoNotes.trim()) {
    normalized.todoItems = [{ id: uid('todo'), text: normalized.todoNotes.trim(), done: false, doneAt: '' }];
    normalized.todoNotes = '';
  }

  // Migration « Amélioration de l'appli » (texte libre) → liste à cocher
  // (retours 17/08/2026) : une ligne du texte devient une tâche.
  if (!normalized.devNotesItems.length && normalized.devNotes.trim()) {
    normalized.devNotesItems = normalized.devNotes.split('\n').map(l => l.trim()).filter(Boolean)
      .map(text => ({ id: uid('devnote'), text, done: false, doneAt: '' }));
    normalized.devNotes = '';
  }
  normalized.todoItems = purgerTachesFaites(normalized.todoItems);
  normalized.devNotesItems = purgerTachesFaites(normalized.devNotesItems);

  return normalized;
}

function mergeReferenceUes(currentUes = []) {
  const byCode = new Map(currentUes.map(ue => [String(ue.code || '').trim(), ue]));
  const merged = UE_REFERENCE.map(ref => {
    const existing = byCode.get(ref.code) || currentUes.find(ue => ue.id === ref.id) || {};
    return {
      ...ref,
      ...existing,
      id: existing.id || ref.id,
      code: ref.code,
      // Référentiel (ruban) = source de vérité pour l'IDENTITÉ de l'UE : intitulé,
      // promotion, semestre nominal, caractère annuel (à cheval) et capacités. Empêche
      // toute combinaison impossible (ex. UE 4.2 en S3) issue d'une saisie libre.
      // L'utilisateur reste maître du PLANNING (dates, enseignant, description, contenu).
      title: ref.title,
      promotion: ref.promotion,
      semester: ref.semester,
      annual: !!ref.annual,
      period: existing.period || ref.period,
      hoursTarget: existing.hoursTarget || 'À préciser',
      startWeekId: existing.startWeekId || defaultSemesterStartWeek(ref.semester),
      endWeekId: existing.endWeekId || defaultSemesterEndWeek(ref.semester),
      teacher: existing.teacher || existing.teachers || '',
      description: (existing.description && existing.description !== legacyUeDefaultDescription(ref)) ? existing.description : ueDefaultDescription(ref),
      capacities: ref.capacities,
      correction: ref.correction || existing.correction || ''
    };
  });
  currentUes.forEach(ue => {
    if (!merged.some(x => x.id === ue.id || x.code === ue.code)) merged.push(ue);
  });
  return merged;
}

function defaultSemesterStartWeek(semester = '') {
  if (semester === 'Semestre 1' || semester === 'Semestre 3') return '2026-S36';
  if (semester === 'Semestre 2' || semester === 'Semestre 4') return '2027-S01';
  return '';
}

function defaultSemesterEndWeek(semester = '') {
  if (semester === 'Semestre 1' || semester === 'Semestre 3') return '2026-S53';
  if (semester === 'Semestre 2') return '2027-S17';
  if (semester === 'Semestre 4') return '2027-S22';
  return '';
}

/* Le titre de l'UE est déjà dans le bandeau de la carte (entity-title) : pas
   besoin de le répéter ici. À la place du texte générique d'origine, les
   intitulés des capacités disent concrètement ce que contient l'UE. */
function ueDefaultDescription(ref) {
  const titles = (ref.capacities || []).map(c => c.title).filter(Boolean);
  return `${ref.semester} · ${ref.promotion}. ${titles.join(' · ')}`;
}
/* Reproduit l'ancienne formule (titre d'UE en tête + phrase générique) pour
   distinguer une description jamais retouchée — à faire glisser vers le
   nouveau texte — d'une description que l'utilisateur a réellement personnalisée. */
function legacyUeDefaultDescription(ref) {
  return `${ref.title} · ${ref.semester} · ${ref.promotion}. UE préchargée depuis la répartition semestres / capacités.`;
}

function normalizeSequence(seq = {}) {
  return {
    ...seq,
    capacityCodes: Array.isArray(seq.capacityCodes) ? seq.capacityCodes : capacityCodesFromText(seq.capacities || ''),
    learningOutcomes: seq.learningOutcomes || seq.apprentissages || '',
    teachingMethods: seq.teachingMethods || '',
    differentiation: seq.differentiation || '',
    deliverables: seq.deliverables || '',
    adjustmentNotes: seq.adjustmentNotes || '',
    teacher: seq.teacher || seq.teachers || ''
  };
}

function capacityCodesFromText(text = '') {
  const matches = String(text).match(/C\s?\d+\.\d+/g) || [];
  return [...new Set(matches.map(code => code.replace(/\s/g, '')))];
}

/* Créneau de cours type (planning hebdo type). Champs de placement identiques à
   une séance (day 0-4, startSlot/endSlot = index de créneaux inclusifs, index 4 =
   Repas exclu). `ueId` = lien vers une UE existante (couleur/code hérités) ;
   `ueCode` = code libre saisi à la main (PLURI, Projets tutorés…). */
function normalizeTemplateSlot(t = {}) {
  if (!t || typeof t !== 'object') return null;
  const semester = SEMESTERS.includes(t.semester) ? t.semester : 'Semestre 1';
  const start = clampTemplateSlots(Number(t.startSlot) || 0, Number(t.endSlot));
  return {
    id: t.id || uid('tpl'),
    semester,
    promotion: promoOfSemester(semester),
    day: Math.max(0, Math.min(4, Number(t.day) || 0)),
    startSlot: start.start,
    endSlot: start.end,
    col: (t.col === 'L' || t.col === 'R') ? t.col : '', // '' = pleine largeur, L/R = demi-plage
    ueId: t.ueId || '',
    ueCode: typeof t.ueCode === 'string' ? t.ueCode : '',
    title: typeof t.title === 'string' ? t.title : '',
    teacher: typeof t.teacher === 'string' ? t.teacher : '',
    color: isValidHexColor(t.color) ? t.color : ''
  };
}

function normalizeStudentSlot(t = {}) {
  if (!t || typeof t !== 'object') return null;
  const start = clampTemplateSlots(Number(t.startSlot) || 0, Number(t.endSlot));
  return {
    id: t.id || uid('etu'),
    promotion: DEFAULT_PROMOTIONS.includes(t.promotion) ? t.promotion : DEFAULT_PROMOTIONS[0],
    // Retours #3 (18-19/08/2026) — 2 périodes comme « Mes créneaux types » :
    // pas de notion de semestre ici (juste promotion + période), donc un champ
    // à plat plutôt que la dérivation periodOfSemester() des créneaux types.
    period: t.period === 'spring' ? 'spring' : 'autumn',
    day: Math.max(0, Math.min(4, Number(t.day) || 0)),
    startSlot: start.start,
    endSlot: start.end,
    ueId: t.ueId || '',
    ueCode: typeof t.ueCode === 'string' ? t.ueCode : '',
    title: typeof t.title === 'string' ? t.title : '',
    room: typeof t.room === 'string' ? t.room : '',
    teacher: typeof t.teacher === 'string' ? t.teacher : '',
    color: isValidHexColor(t.color) ? t.color : ''
  };
}

// « Tâches faites » (retours 17/08/2026) : une tâche cochée rejoint un petit
// historique consultable, purgé au-delà de 30 jours plutôt que conservé
// indéfiniment en silence dans l'état.
const CHECKLIST_HISTORIQUE_JOURS = 30;
function purgerTachesFaites(items) {
  const limite = new Date(); limite.setDate(limite.getDate() - CHECKLIST_HISTORIQUE_JOURS); limite.setHours(0, 0, 0, 0);
  return items.filter(t => !t.done || !t.doneAt || new Date(t.doneAt) >= limite);
}

function normalizeTodoItem(t = {}) {
  if (!t || typeof t !== 'object' || !String(t.text || '').trim()) return null;
  return {
    id: t.id || uid('todo'),
    text: String(t.text).trim(),
    done: !!t.done,
    doneAt: typeof t.doneAt === 'string' ? t.doneAt : ''
  };
}

/* Contraint début/fin à rester dans la même demi-journée (jamais à cheval sur le
   repas, index 4) et fin ≥ début. */
function clampTemplateSlots(start, endRaw) {
  let s = Math.max(0, Math.min(8, start));
  if (s === 4) s = 5;
  let e = Number.isFinite(endRaw) ? Math.max(0, Math.min(8, endRaw)) : s;
  if (e < s) e = s;
  if (s < 4) e = Math.min(e, 3);          // matin : borné à 12h10
  else e = Math.max(s, Math.min(e, 8));   // après-midi : 13h25 → 17h20
  return { start: s, end: e };
}

function promoOfSemester(sem) { return (sem === 'Semestre 1' || sem === 'Semestre 2') ? 'GPN1' : 'GPN2'; }
function periodOfSemester(sem) { return (sem === 'Semestre 1' || sem === 'Semestre 3') ? 'autumn' : 'spring'; }

// Retours #4 (18/08/2026) — code couleur semestre repris du Ruban (S1 bleu,
// S2 ambre, S3 rouge, S4 vert — S1/S2 = GPN1, S3/S4 = GPN2), généralisé à tout
// ce qui teintait jusqu'ici une UE (Conception, Progression, Planning hebdo) :
// remplace l'ancienne palette arbitraire par index d'UE (ueColor) et la
// couleur de promo fixe du bandeau Planning hebdo (voir renderPromotionTable).
const SEMESTER_COLORS = { 'Semestre 1': '#3a6ea5', 'Semestre 2': '#c08a12', 'Semestre 3': '#b0423f', 'Semestre 4': '#41874f' };
function semesterColorOf(semester) { return SEMESTER_COLORS[semester] || '#5b6f92'; }
// Semestre correspondant à une promo + une période (automne/printemps) du
// Planning hebdo — utilisé pour teinter le bandeau promo (été = gris, hors
// mapping, géré à part).
function semesterForPromoPeriod(promo, period) {
  return promo === 'GPN2'
    ? (period === 'spring' ? 'Semestre 4' : 'Semestre 3')
    : (period === 'spring' ? 'Semestre 2' : 'Semestre 1');
}
function templateSemester(periodKey, promo) {
  const period = TEMPLATE_PERIODS.find(p => p.key === periodKey) || TEMPLATE_PERIODS[0];
  return period.semesters[promo] || period.semesters.GPN1;
}
/* Période (automne / printemps) d'une semaine du planning : S36→S53 =
   septembre-décembre, S01→S26 = janvier-mai (et le creux d'été, sans
   séances en pratique). Ajustements #2 [E2.5] (18/08/2026) — bug trouvé :
   l'ancienne version comparait l'année calendaire à 2026 en dur, correcte
   uniquement pour LA fenêtre fixe 2026-2027 d'origine. Depuis le passage à
   `buildRollingWeeks` (fenêtre glissante, n'importe quelle année), ce test
   cassait dès qu'on avançait dans le temps — et la fenêtre glissante de 26
   semaines après aujourd'hui n'atteint qu'une petite portion de « janvier-
   mai » de l'année suivante, d'où les « seulement 7 cases » observées.
   Basé sur le numéro de semaine (indépendant de l'année civile) : ça résout
   les deux à la fois. */
function periodOfWeek(week) { return weekNumberOf(week) >= 36 ? 'autumn' : 'spring'; }

// Retours #3 (18-19/08/2026) — la frise du Planning hebdo (weekStripPeriod)
// gagne une 3e période « Juin – août » : le seul découpage en 2 de
// periodOfWeek rangeait tout l'été dans « Janvier – mai », frise illisible
// (jusqu'à S35 pour un printemps qui finit en pratique vers S22). Fonction à
// part : periodOfWeek reste binaire pour templateSemester/TEMPLATE_PERIODS
// (créneaux types, seulement 2 semestres par promo, pas de « été »).
function weekStripPeriodOf(week) {
  const n = weekNumberOf(week);
  if (n >= 36) return 'autumn';
  if (n >= 22) return 'summer';
  return 'spring';
}
function templateSlotsFor(semester) { return (state?.weekTemplates || []).filter(t => t.semester === semester); }
function findTemplateSlot(id) { return state?.weekTemplates?.find(t => t.id === id); }

/* Code affiché d'un créneau type : code de l'UE liée, sinon code libre saisi. */
function templateSlotCode(t) {
  if (!t) return '';
  if (t.ueId) return findUe(t.ueId)?.code || t.ueCode || '';
  return t.ueCode || '';
}
/* Teinte d'un créneau type (éditeur) : couleur choisie, sinon celle de l'UE,
   sinon un gris neutre pour les créneaux hors UE. */
function templateSlotTint(t) {
  if (!t) return '#9aa0ad';
  if (isValidHexColor(t.color)) return t.color;
  if (t.ueId) return ueColor(t.ueId);
  return '#9aa0ad';
}
/* Libellé du masque : « UE X.X » pour un créneau d'UE, intitulé court sinon. */
function templateMaskLabel(t) {
  const code = templateSlotCode(t);
  if (/^\s*ue\b/i.test(code)) return code.trim();
  return truncate((t.title || code || '').trim(), 16);
}
/* Contenu interne d'une cellule de l'éditeur (croix + code UE + intitulé + intervenants).
   09/10-creneaux-types.png — les intervenants sont des pastilles (pleine = vous,
   creuse = collègue), pas du texte brut, et peuvent être plusieurs sur un créneau. */
function templateCellInner(t) {
  const code = templateSlotCode(t);
  const teachers = teacherTokens(t.teacher);
  return `<button type="button" class="tpl-del" data-del-template="${escapeAttr(t.id)}" title="Supprimer ce créneau" aria-label="Supprimer ce créneau">×</button>
    ${code ? `<div class="tpl-ue">${escapeHtml(code)}</div>` : ''}
    ${t.title ? `<div class="tpl-title">${escapeHtml(t.title)}</div>` : ''}
    ${teachers.length ? `<div class="tpl-teachers">${teachers.map(x => `<span class="design-ue-pill${x.toLowerCase() === moiInitiales.toLowerCase() ? ' is-mine' : ''}">${escapeHtml(x)}</span>`).join('')}</div>` : ''}`;
}

/* Écran 8 — Planning étudiant. Dupliqué depuis les fonctions ci-dessus
   (templateSlotCode/templateSlotTint/templateCellInner) plutôt que paramétré :
   voir la mémoire du chantier, on évite de toucher au code déjà approuvé de
   « Mes créneaux types ». */
function findStudentSlot(id) { return state?.studentWeekTemplate?.find(t => t.id === id); }
function studentSlotCode(t) {
  if (!t) return '';
  if (t.ueId) return findUe(t.ueId)?.code || t.ueCode || '';
  return t.ueCode || '';
}
function studentSlotTint(t) {
  if (!t) return '#9aa0ad';
  if (isValidHexColor(t.color)) return t.color;
  if (t.ueId) return ueColor(t.ueId);
  return '#9aa0ad';
}
/* REGLES.md #21 : « mes cours » = un intervenant du créneau porte mes initiales
   (même comparaison que rubanUeIsMine ailleurs dans le fichier). */
function isMyStudentSlot(t) {
  return teacherTokens(t?.teacher).some(x => x.toLowerCase() === moiInitiales.toLowerCase());
}
function studentSlotCellInner(t) {
  const code = studentSlotCode(t);
  const teachers = teacherTokens(t.teacher);
  return `<button type="button" class="tpl-del" data-del-student-slot="${escapeAttr(t.id)}" title="Supprimer ce cours" aria-label="Supprimer ce cours">×</button>
    ${code ? `<div class="tpl-ue">${escapeHtml(code)}</div>` : ''}
    ${t.title ? `<div class="tpl-title">${escapeHtml(t.title)}</div>` : ''}
    ${t.room ? `<div class="tpl-room meta">${escapeHtml(t.room)}</div>` : ''}
    ${teachers.length ? `<div class="tpl-teachers">${teachers.map(x => `<span class="design-ue-pill${x.toLowerCase() === moiInitiales.toLowerCase() ? ' is-mine' : ''}">${escapeHtml(x)}</span>`).join('')}</div>` : ''}`;
}

async function loadData() {
  const brut = await window.OC_SYNC.charger();
  state = normalizeData(brut);
  window.OC_SYNC.memoriserSnapshot(state);
  pruneOpenState(); // Lot 6 — retirer les UE/séquences supprimées de la mémoire ouvert/fermé
  if (!state.weeks.length) bootstrapWeeks();
  selectedWeek = state.weeks.find(w => w.id === selectedWeek)?.id || state.weeks[0]?.id || selectedWeek;
  const hasVisibleSession = state.sessions.some(s => s.weekId === selectedWeek && isDefinitiveSession(s));
  const firstDefinitive = state.sessions.find(s => isDefinitiveSession(s) && state.weeks.some(w => w.id === s.weekId));
  if (!hasVisibleSession && firstDefinitive) selectedWeek = firstDefinitive.weekId;
  hydrateSelectors();
  renderAll();
  setSaveStatus('Données chargées');
}

async function saveData(message = 'Enregistré', { rerender = true, forcer = false } = {}) {
  // Rendu optimiste : l'état local fait foi immédiatement, l'enregistrement
  // réseau (Supabase) arrive ensuite — sinon chaque action figerait l'écran
  // le temps de l'aller-retour.
  if (rerender) renderAll(false);
  setSaveStatus('Sauvegarde…');
  state.version = '5.0.0';
  const resultat = await window.OC_SYNC.enregistrer(state, { forcer });
  state.lastSavedAt = resultat.lastSavedAt;
  // Étape 4 — indicateur persistant : un échec (réseau coupé, droits refusés…)
  // ne doit pas s'effacer après 2,4s comme un message de succès normal, sinon
  // il passe inaperçu. window.OC_SYNC réessaiera de lui-même au prochain
  // enregistrer() (le snapshot n'avance que sur écriture réussie) ; ce
  // bandeau reste visible jusqu'à ce qu'un enregistrement reparte sans erreur.
  if (resultat.erreurs?.length) {
    const suffixe = resultat.erreurs.length > 1 ? ` (+${resultat.erreurs.length - 1} autre(s))` : '';
    setSaveStatus(`⚠ Non enregistré : ${resultat.erreurs[0]}${suffixe}`, { persistant: true });
    // Le bandeau ne montre que le premier message + un compteur (place limitée) —
    // la liste complète va dans la console pour le diagnostic.
    console.error('[organisation-cours] erreurs de sauvegarde :', resultat.erreurs);
  } else {
    setSaveStatus(message);
  }
}

/* Refonte écran 1 (16/08/2026) — le statut de synchro rejoint le bandeau
   (mockup : « synchronisé il y a 2 min »), texte PERSISTANT au lieu d'un
   toast qui s'efface après 2,4 s (ancienne décision N5, périmée par le
   mockup). L'heure relative se rafraîchit seule, sans re-render complet. */
let lastStatusMessage = '';
let saveStatusRefreshTimer = null;
function relativeTimeFr(iso) {
  if (!iso) return '';
  const min = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
  if (min <= 0) return 'à l’instant';
  if (min < 60) return `il y a ${min} min`;
  const h = Math.round(min / 60);
  if (h < 24) return `il y a ${h} h`;
  return `il y a ${Math.round(h / 24)} j`;
}
function setSaveStatus(text, { persistant = false } = {}) {
  const el = $('#saveStatus');
  if (!el) return;
  lastStatusMessage = text;
  const suffix = state?.lastSavedAt ? ` · ${relativeTimeFr(state.lastSavedAt)}` : '';
  el.textContent = text + suffix;
  el.classList.toggle('is-error', persistant);
  // Simplification bandeau (17/08/2026) : « Réessayer » ne s'affiche qu'en cas
  // d'erreur — l'auto-enregistrement se charge du cas normal, plus besoin d'un
  // bouton permanent qui faisait doublon.
  const retryBtn = $('#btn-sauvegarder');
  if (retryBtn) retryBtn.hidden = !persistant;
  if (!saveStatusRefreshTimer) {
    saveStatusRefreshTimer = setInterval(() => {
      const el2 = $('#saveStatus');
      if (!el2 || !state?.lastSavedAt) return;
      el2.textContent = lastStatusMessage + ` · ${relativeTimeFr(state.lastSavedAt)}`;
    }, 30000);
  }
}

/* ===== Export / import des données (sauvegarde manuelle, transfert entre postes) ===== */
function exportData() {
  if (!state) return;
  const payload = JSON.stringify(state, null, 2);
  const blob = new Blob([payload], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const now = new Date();
  const stamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}_${String(now.getHours()).padStart(2, '0')}h${String(now.getMinutes()).padStart(2, '0')}`;
  const a = document.createElement('a');
  a.href = url;
  a.download = `bts-gpn-donnees_${stamp}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  setSaveStatus('Données exportées');
}

/* ============================================================
   Lot E — Frais de déplacement (véhicule personnel)
   Module autonome et volontairement simple (le dispositif de
   remboursement de l'établissement pouvant évoluer) : une liste
   de déplacements alimentée soit en cochant une séance
   (« véhicule perso »), soit en saisie libre. Champs : date, lieu,
   conducteur, classe, km A/R, taux (€/km, défaut 0.55), statut.
   Total ligne = km A/R × taux.
   ============================================================ */

function deplacementTaux(d) {
  return (d && (d.taux === 0 || d.taux)) ? Number(d.taux) : DEFAULT_TAUX;
}
function deplacementTotal(d) {
  return Math.round((Number(d?.kmAR) || 0) * deplacementTaux(d) * 100) / 100;
}
function fmtEuro(n) {
  return (Number(n) || 0).toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';
}

/* Origine textuelle d'un déplacement : séance ou réunion liée, sinon vide. */
function deplacementOrigin(d) {
  if (d?.sessionId) {
    const sess = state.sessions.find(s => s.id === d.sessionId);
    if (sess) return sess.title || 'Séance';
  }
  if (d?.reunionId) {
    const reu = (state.reunions || []).find(r => r.id === d.reunionId);
    if (reu) return 'Réunion' + (reu.lieu ? ' — ' + reu.lieu : '');
  }
  return '';
}

/* Date ISO d'une séance : date exacte si saisie, sinon jour de la semaine cible. */
function sessionIsoDate(session) {
  if (session?.exactDate) return session.exactDate;
  const week = state.weeks.find(w => w.id === (session?.weekId || session?.targetWeekId));
  const day = Number(session?.day) || 0;
  const date = week ? dayDatesForWeek(week)[day] : null;
  return date ? isoKey(date) : '';
}

/* ---- Lot B — le RETOUR de la relation séance/réunion ⇄ frais.
   `ensureDeplacementForSession` ne fait que l'aller : la source crée la ligne de
   frais. Supprimer cette ligne laissait la séance cochée « véhicule personnel »,
   alors qu'il ne restait plus rien à rembourser — l'étiquette « Ordre de
   mission » continuait même de s'afficher. Les frais et l'ordre de mission sont
   deux étapes du MÊME déplacement : supprimer les frais, c'est dire qu'il n'y a
   pas eu de déplacement en véhicule personnel. On repose donc la relation au
   lieu de colmater l'affichage. */
function clearDeplacementSource(dep) {
  if (!dep || !state) return null;
  const source = dep.sessionId
    ? (state.sessions || []).find(s => s.id === dep.sessionId)
    : (dep.reunionId ? (state.reunions || []).find(r => r.id === dep.reunionId) : null);
  if (!source || source.deplacement !== 'personnel') return null;
  Object.assign(source, normalizeDeplacementFields({ deplacement: '' }));
  return source;
}

/* Crée (si absent) le déplacement lié à une séance en véhicule personnel.
   Ne supprime jamais depuis ce sens-ci : décocher la case laisse la ligne de
   frais en place, elle se gère ensuite dans l'encart Frais (préservation des
   saisies). C'est la suppression de la ligne qui, elle, remonte à la source. */
function ensureDeplacementForSession(session) {
  if (!session || !state) return;
  const existing = state.deplacements.find(d => d.sessionId === session.id);
  if (existing) {
    // Backfill des infos venues de la séance si elles manquent (sans écraser une
    // saisie manuelle) — Lot P : promo (classe), UE et mots-clés.
    if (!existing.date) existing.date = sessionIsoDate(session);
    if (!existing.ue) existing.ue = findUe(session.ueId)?.code || '';
    if (!existing.keywords) existing.keywords = session.keywords || '';
    return;
  }
  state.deplacements.push({
    id: uid('deplacement'),
    date: sessionIsoDate(session),
    lieu: '',
    conducteur: session.teacher || '',
    classe: session.promotion === 'GPN2' ? 'GPN2' : 'GPN1', // promo de la séance
    kmAR: 0,
    taux: DEFAULT_TAUX,
    statut: DEPLACEMENT_STATUSES[0],
    ue: findUe(session.ueId)?.code || '',      // UE de la séance
    keywords: session.keywords || '',          // mots-clés de la séance
    teacher: session.teacher || '',            // compte par défaut = celui de la séance
    sessionId: session.id
  });
}

/* ---- Salles à réserver (salle informatique, amphithéâtre) — encart + alerte
   du tableau de bord. roomToBook/roomBooked vivent dans la colonne `contenu`
   jsonb de la séance comme tout champ non mappé : aucune migration Supabase. */

/* Salle à réserver d'une séance, y compris pour l'existant (lot A [6]).
   Le pré-remplissage de `roomToBook` n'agit qu'à la saisie : les séances de type
   « Cours en salle informatique » créées AVANT l'ajout du champ n'ont rien de
   stocké et n'apparaissaient donc jamais dans « À réserver ». On déduit ici la
   valeur au lieu d'écrire en base : rien à migrer, et le jour où la séance est
   rouverte et enregistrée, la valeur déduite devient la valeur stockée. */
function sessionRoomToBook(s) {
  if (!s) return '';
  if (s.roomToBook) return s.roomToBook;
  return s.type === 'Cours en salle informatique' ? 'info' : '';
}

/* Date approximative d'une séance pour le suivi de réservation : même calcul
   que « Frais de déplacement » (sessionIsoDate) — définitive = date réelle,
   à placer = lundi de la semaine cible (approximatif, assumé). */
function roomBookingDate(s) {
  const iso = sessionIsoDate(s);
  return iso ? parseIsoDate(iso) : null;
}

function roomBookingDaysUntil(date) {
  if (!date) return null;
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const d = new Date(date); d.setHours(0, 0, 0, 0);
  return Math.round((d - today) / 86400000);
}

/* Tout ce qui est à réserver, trié par date (sans date en dernier).
   Lot B — l'encart ne porte plus seulement des salles : un VÉHICULE DE
   L'ÉTABLISSEMENT se réserve exactement de la même façon (même délai de 15 j,
   même case « Réservée »), et il peut être demandé par une réunion autant que
   par une séance. Une ligne décrit donc « quoi réserver, pour quoi », et non
   plus « une séance ». Une même séance peut produire deux lignes (salle ET
   véhicule) : ce sont deux démarches distinctes auprès de deux personnes. */
function reservationRows() {
  const rows = [];
  const pousser = (kind, source, entity, label, booked, date, titre, detail) => {
    rows.push({
      kind, source, entity, label, booked,
      id: entity.id, titre, detail,
      date, daysUntil: roomBookingDaysUntil(date)
    });
  };

  (state.sessions || []).forEach(s => {
    const salle = sessionRoomToBook(s);
    const date = roomBookingDate(s);
    if (salle) {
      pousser('salle', 'session', s, ROOM_TO_BOOK_LABELS[salle] || salle, !!s.roomBooked,
        date, s.title || 'Séance sans titre', s.promotion || '');
    }
    if (s.deplacement === 'etablissement') {
      pousser('vehicule', 'session', s, VEHICULE_LABEL, !!s.vehicleBooked,
        date, s.title || 'Séance sans titre', s.promotion || '');
    }
    // Retours #3 (18-19/08/2026) — case « matériel à réserver » à côté du champ
    // Matériel : même mécanique que salle/véhicule (reprend la même date de
    // référence que la séance).
    if (s.materielAReserver) {
      pousser('materiel', 'session', s, MATERIEL_LABEL, !!s.materielReserve,
        date, s.title || 'Séance sans titre', s.promotion || '');
    }
  });

  (state.reunions || []).forEach(r => {
    if (r.deplacement !== 'etablissement') return;
    pousser('vehicule', 'reunion', r, VEHICULE_LABEL, !!r.vehicleBooked,
      parseIsoDate(r.date), r.sujets ? truncate(r.sujets, 48) : 'Réunion', r.lieu || '');
  });

  return rows.sort((a, b) => {
    if (!a.date && !b.date) return 0;
    if (!a.date) return 1;
    if (!b.date) return -1;
    return a.date - b.date;
  });
}

/* Lignes de l'encart « à faire » : celles pas encore réservées, délestées
   d'elles-mêmes une fois la date passée (rien à réserver pour une séance déjà
   eue). Retour de Martin (22/08/2026) : cocher « réservée »/« fait » retire
   directement la ligne d'ici — plus besoin d'un second clic sur un × à part
   (peu lisible, mal compris) — elle rejoint doneRoomBookingRows() (menu
   « Faites »), d'où on peut la décocher pour revenir ici si besoin. */
function activeRoomBookingRows() {
  return reservationRows().filter(r => !r.booked && (r.daysUntil === null || r.daysUntil >= 0));
}

/* Symétrique : les réservations déjà faites, consultables et réversibles
   depuis le menu « Faites » (renderUrgencesFaites/renderMobileFaites) plutôt
   que mêlées à la liste active. */
function doneRoomBookingRows() {
  return reservationRows().filter(r => r.booked);
}

const URGENCE_LABELS = { salle: 'Salle', vehicule: 'Véhicule', materiel: 'Matériel', mission: 'Ordre de mission', reunion: 'Réunion' };
const URGENCE_VERBES = { salle: 'Marquer réservée', vehicule: 'Réserver', materiel: 'Réserver' };
// Retour de Martin (21/08/2026) : une règle commune à tout type d'urgence
// (pas seulement les réunions) — n'apparaît dans le tableau que si elle a
// moins de URGENCE_FENETRE_JOURS jours (au-delà, ça encombre sans être
// actionnable). Une ligne sans date du tout (« date à préciser ») n'a rien à
// comparer : elle reste visible, même logique que dashBacklogSessions.
const URGENCE_FENETRE_JOURS = 45;

/* Pile unique « Urgences » (REGLES.md #25) : salles et véhicules à réserver
   (reservationRows) + ordres de mission à établir (ordresDeMissionAFaire) +
   réunions enregistrées à venir (kind:'reunion', ajouté le 21/08/2026 sur
   demande de Martin — purement informatif, aucun verbe de réservation),
   fusionnés et triés par échéance seule — jamais groupés par UE, promotion ou
   type. La nature n'est qu'une étiquette de colonne, pas un panneau séparé. */
function urgenceRows() {
  const out = [];
  activeRoomBookingRows().forEach(r => {
    const horaire = r.source === 'session' ? dashHoraire(r.entity) : '';
    // Retours #3 (18-19/08/2026) : le titre en gras affichait l'étiquette
    // générique (« Salle informatique », « Véhicule de l'établissement »)
    // plutôt que le nom de la séance — au clic sur « Non dispo → perso »/
    // « Perso → établissement », le nom bougeait donc de place par rapport à
    // une ligne « Ordre de mission » (qui, elle, l'a toujours mis en titre).
    // Le nom de la séance reste maintenant le titre dans tous les cas ;
    // l'étiquette générique rejoint le détail.
    out.push({
      kind: r.kind, titre: r.titre,
      detail: [r.label, r.detail, horaire].filter(Boolean).join(' · '),
      date: r.date, daysUntil: r.daysUntil,
      source: r.source, id: r.id, fait: r.booked,
      teacher: r.entity?.teacher || ''
    });
  });
  ordresDeMissionAFaire().forEach(o => {
    const entity = o.source === 'reunion' ? (state.reunions || []).find(r => r.id === o.id) : findSession(o.id);
    out.push({
      kind: 'mission', titre: o.titre,
      detail: o.detail || '',
      date: o.date, daysUntil: o.date ? dashJoursEntre(o.date) : null,
      source: o.source, id: o.id, fait: false,
      teacher: entity?.teacher || ''
    });
  });
  (state.reunions || []).filter(estVisiblePourMoi).forEach(r => {
    const date = r.date ? parseIsoDate(r.date) : null;
    const daysUntil = date ? dashJoursEntre(date) : null;
    if (daysUntil !== null && daysUntil < 0) return; // réunion passée
    out.push({
      kind: 'reunion', titre: r.sujets ? truncate(r.sujets, 48) : 'Réunion',
      detail: r.lieu || '',
      date, daysUntil,
      source: 'reunion', id: r.id, fait: false,
      teacher: r.teacher || ''
    });
  });
  return out
    .filter(r => r.daysUntil === null || r.daysUntil <= URGENCE_FENETRE_JOURS)
    .sort((a, b) => {
    if (a.daysUntil === null && b.daysUntil === null) return 0;
    if (a.daysUntil === null) return 1;
    if (b.daysUntil === null) return -1;
    return a.daysUntil - b.daysUntil;
  });
}

/* Symétrique de urgenceRows() : les réservations/ordres de mission déjà faits
   (menu « Faites », retour de Martin 22/08/2026 — cocher « fait » retire la
   ligne de la pile active, mais elle doit rester consultable et réversible
   à part). Les réunions n'ont pas d'état « fait » (purement informatif,
   cf. urgenceRows) : rien à archiver ici pour elles. Triées de la plus
   récente à la plus ancienne. */
function urgenceRowsFaites() {
  const out = [];
  doneRoomBookingRows().forEach(r => {
    const horaire = r.source === 'session' ? dashHoraire(r.entity) : '';
    out.push({
      kind: r.kind, titre: r.titre,
      detail: [r.label, r.detail, horaire].filter(Boolean).join(' · '),
      date: r.date, daysUntil: r.daysUntil,
      source: r.source, id: r.id, fait: true,
      teacher: r.entity?.teacher || ''
    });
  });
  ordresDeMissionFaits().forEach(o => {
    const entity = o.source === 'reunion' ? (state.reunions || []).find(r => r.id === o.id) : findSession(o.id);
    out.push({
      kind: 'mission', titre: o.titre,
      detail: o.detail || '',
      date: o.date, daysUntil: o.date ? dashJoursEntre(o.date) : null,
      source: o.source, id: o.id, fait: true,
      teacher: entity?.teacher || ''
    });
  });
  return out.sort((a, b) => {
    if (!a.date && !b.date) return 0;
    if (!a.date) return 1;
    if (!b.date) return -1;
    return b.date - a.date;
  });
}

// Extrait de renderUrgences (refonte mobile, 21/08/2026) pour être réutilisé
// tel quel par renderMobileAValider() : même markup, mêmes attributs
// data-* (data-reservation-kind, data-open-mission, data-bascule-vehicule…),
// tous branchés sur des délégués globaux (document.body.addEventListener) —
// aucun nouveau JS de comportement à écrire côté mobile, seule la mise en
// page qui les entoure change. N'affiche que des lignes actives (jamais
// « fait » — voir urgenceFaiteRowMarkup pour le menu « Faites »).
function urgenceRowMarkup(r) {
  const quand = r.date ? r.date.toLocaleDateString('fr-FR') : 'Date à préciser';
  const delaiLabel = r.daysUntil === null ? '' : (r.daysUntil <= 0 ? 'J' : `J–${r.daysUntil}`);
  const urgent = r.daysUntil !== null && r.daysUntil <= ROOM_ALERT_DAYS;
  // Retours 17/08/2026 — bascule rapide depuis la ligne, quand le véhicule
  // de l'établissement s'avère indisponible : plus besoin de rouvrir la
  // fiche pour changer le menu Déplacement, ça bascule direct en
  // personnel (l'ordre de mission remplace la réservation à la ligne suivante).
  const basculeBtn = r.kind === 'vehicule'
    ? `<button type="button" class="urgence-bascule" data-bascule-vehicule="${escapeAttr(r.source)}:${escapeAttr(r.id)}" title="Véhicule de l’établissement non disponible : passer en véhicule personnel (déclenche l’ordre de mission)">Non dispo → perso</button>`
    : '';
  // Retours #3 (18-19/08/2026) : bascule inverse, pour revenir en arrière
  // facilement après un clic "Non dispo → perso" fait par erreur.
  const basculeRetourBtn = r.kind === 'mission'
    ? `<button type="button" class="urgence-bascule" data-bascule-vehicule-retour="${escapeAttr(r.source)}:${escapeAttr(r.id)}" title="Revenir à un déplacement en véhicule de l’établissement">Perso → établissement</button>`
    : '';
  const verbe = r.kind === 'mission'
    ? `<span class="urgence-verbe" data-open-mission="${escapeAttr(r.source)}:${escapeAttr(r.id)}" tabindex="0" role="button">Éditer</span>${basculeRetourBtn}`
    // Une réunion enregistrée (21/08/2026) n'est pas une réservation à
    // traiter : purement informatif, pas de case à cocher — juste un
    // rappel qu'elle existe, la ligne entière ouvre déjà sa fiche.
    : r.kind === 'reunion'
      ? `<span class="urgence-verbe" data-edit-reunion="${escapeAttr(r.id)}" tabindex="0" role="button">Ouvrir</span>`
      : `<label class="urgence-verbe room-booked-check"><input type="checkbox" data-reservation-kind="${escapeAttr(r.kind)}" data-reservation-source="${escapeAttr(r.source)}" data-reservation-id="${escapeAttr(r.id)}"><span>${escapeHtml(URGENCE_VERBES[r.kind] || 'Réserver')}</span></label>${basculeBtn}`;
  // La ligne entière ouvre la fiche de la séance/réunion (comme les cartes
  // « Ma semaine »/« Prochainement ») — la case et le lien Éditer gardent
  // leur propre action (guard dans le gestionnaire de clic).
  const editAttr = r.source === 'reunion' ? `data-edit-reunion="${escapeAttr(r.id)}"` : `data-edit-session="${escapeAttr(r.id)}"`;
  const teachers = teacherPillsMarkup(r.teacher);
  return `<div class="urgence-row${urgent ? ' est-urgent' : ''}" ${editAttr} tabindex="0" role="button">
    <span class="urgence-type">${escapeHtml(URGENCE_LABELS[r.kind] || r.kind)}</span>
    <span class="urgence-delai${urgent ? ' est-urgent' : ''}">${escapeHtml(delaiLabel)}</span>
    <strong class="urgence-titre">${escapeHtml(r.titre)}</strong>
    ${teachers ? `<span class="design-ue-pills urgence-teachers">${teachers}</span>` : ''}
    <span class="urgence-detail">${escapeHtml([quand, r.detail].filter(Boolean).join(' · '))}</span>
    ${verbe}
  </div>`;
}

/* Menu « Faites » : mêmes lignes, un seul verbe (case cochée « Fait », à
   décocher pour revenir dans la pile active) — pas de bascule véhicule ni
   d'« Éditer », qui n'ont de sens que pour une ligne encore à traiter. */
function urgenceFaiteRowMarkup(r) {
  const quand = r.date ? r.date.toLocaleDateString('fr-FR') : 'Date à préciser';
  const faitCheckbox = r.kind === 'mission'
    ? `<input type="checkbox" checked data-mission-toggle="${escapeAttr(r.source)}:${escapeAttr(r.id)}">`
    : `<input type="checkbox" checked data-reservation-kind="${escapeAttr(r.kind)}" data-reservation-source="${escapeAttr(r.source)}" data-reservation-id="${escapeAttr(r.id)}">`;
  const editAttr = r.source === 'reunion' ? `data-edit-reunion="${escapeAttr(r.id)}"` : `data-edit-session="${escapeAttr(r.id)}"`;
  const teachers = teacherPillsMarkup(r.teacher);
  return `<div class="urgence-row est-fait" ${editAttr} tabindex="0" role="button">
    <span class="urgence-type">${escapeHtml(URGENCE_LABELS[r.kind] || r.kind)}</span>
    <strong class="urgence-titre">${escapeHtml(r.titre)}</strong>
    ${teachers ? `<span class="design-ue-pills urgence-teachers">${teachers}</span>` : ''}
    <span class="urgence-detail">${escapeHtml([quand, r.detail].filter(Boolean).join(' · '))}</span>
    <label class="urgence-verbe room-booked-check est-fait" title="Décocher pour remettre à faire">${faitCheckbox}<span>Fait</span></label>
  </div>`;
}

function renderUrgences() {
  const rows = urgenceRows();
  const faites = urgenceRowsFaites();
  const badge = $('#urgencesBadge');
  if (badge) { badge.textContent = rows.length ? String(rows.length) : ''; badge.hidden = !rows.length; }
  const panel = $('#urgencesPanel');
  if (panel) panel.hidden = !rows.length && !faites.length;
  const wrap = $('#urgencesList');
  if (wrap) {
    wrap.innerHTML = rows.length
      ? rows.map(urgenceRowMarkup).join('') + `<div class="urgence-pied">Cliquer une ligne ouvre la séance ou la réunion. Cocher « fait »/« réservée » la retire de cette liste et la range dans « Faites », ci-dessous.</div>`
      : '<p class="empty-hint">Rien d’urgent pour le moment.</p>';
  }
  const faitesDetail = $('#urgencesFaitesDetail');
  if (faitesDetail) faitesDetail.hidden = !faites.length;
  const faitesCompte = $('#urgencesFaitesCompte');
  if (faitesCompte) faitesCompte.textContent = String(faites.length);
  const faitesWrap = $('#urgencesFaitesList');
  if (faitesWrap) faitesWrap.innerHTML = faites.map(urgenceFaiteRowMarkup).join('');
}

/* Écran 15 — À valider (mobile). Puces de filtre + groupage Cette semaine/
   Plus tard, mais les lignes elles-mêmes réutilisent urgenceRowMarkup() —
   mêmes verbes, mêmes cases à cocher, aucune divergence de comportement avec
   le Tableau de bord desktop. « Déplacements » (puce du handoff) regroupe
   véhicule + ordre de mission (les deux relèvent d'un trajet), Salles et
   Matériel restent chacun leur propre kind. */
const MOBILE_URGENCE_FILTRES = {
  tout: () => true,
  salle: r => r.kind === 'salle',
  materiel: r => r.kind === 'materiel',
  deplacement: r => r.kind === 'vehicule' || r.kind === 'mission',
  reunion: r => r.kind === 'reunion'
};
let mobileUrgenceFiltre = 'tout';

// Ajustements #5 (22/08/2026) : les sous-onglets passent du texte au
// pictogramme (Martin — tout = carré, salles = manoir (Kerplouz), matériel =
// longue-vue, déplacement = voiture, réunion = silhouettes). Le libellé texte
// reste porté par title/aria-label, pour la lecture au survol et les lecteurs
// d'écran plutôt que perdu avec le texte.
const MOBILE_URGENCE_PICTOS = { tout: '◻', salle: '🏰', materiel: '🔭', deplacement: '🚗', reunion: '👥' };

function renderMobileAValider() {
  const host = $('#mobileAValider');
  if (!host) return;
  const rows = urgenceRows().filter(MOBILE_URGENCE_FILTRES[mobileUrgenceFiltre] || MOBILE_URGENCE_FILTRES.tout);
  const cetteSemaine = rows.filter(r => r.daysUntil !== null && r.daysUntil <= 7);
  const plusTard = rows.filter(r => r.daysUntil === null || r.daysUntil > 7);
  const groupe = (titre, liste) => liste.length
    ? `<h3 class="mobile-group-title">${titre}</h3>${liste.map(urgenceRowMarkup).join('')}`
    : '';
  const chip = (cle, label) => `<button type="button" class="mobile-filtre-chip${mobileUrgenceFiltre === cle ? ' active' : ''}" data-mobile-filtre-urgence="${cle}" title="${escapeAttr(label)}" aria-label="${escapeAttr(label)}">${MOBILE_URGENCE_PICTOS[cle]}</button>`;
  const nbFaites = urgenceRowsFaites().length;
  host.innerHTML = `
    <div class="mobile-filtres">
      ${chip('tout', 'Tout')}
      ${chip('salle', 'Salles')}
      ${chip('materiel', 'Matériel')}
      ${chip('deplacement', 'Déplacements')}
      ${chip('reunion', 'Réunions')}
    </div>
    ${rows.length ? (groupe('Cette semaine', cetteSemaine) + groupe('Plus tard', plusTard)) : '<p class="empty-hint">Rien à valider pour le moment.</p>'}
    <button type="button" class="lien mobile-voir-faites" data-mobile-goto="mobileFaites">Voir les faites${nbFaites ? ` (${nbFaites})` : ''} →</button>`;
}

/* Écran « Faites » (mobile) : menu à part demandé par Martin (22/08/2026) —
   cocher « fait »/« réservée » retire une ligne de À valider sans détour par
   un × ; elle reste consultable et réversible ici (décocher = retour dans
   À valider). Mêmes lignes que urgenceRowsFaites() côté desktop. */
function renderMobileFaites() {
  const host = $('#mobileFaites');
  if (!host) return;
  const rows = urgenceRowsFaites();
  host.innerHTML = `
    <div class="mobile-topbar">
      <button type="button" class="lien mobile-back" data-mobile-goto="mobileAValider">‹ À valider</button>
      <h2 class="mobile-topbar-title">Faites</h2>
    </div>
    ${rows.length ? rows.map(urgenceFaiteRowMarkup).join('') : '<p class="empty-hint">Rien de fait pour le moment.</p>'}`;
}

/* ============================================================
   Écran 13 — Ordre de mission. Document A4 édité en place, atteint
   uniquement depuis une ligne Urgences (data-open-mission="session:id" ou
   "reunion:id") — PAS un onglet permanent de .header-tabs. Contenu calé sur
   le vrai PDF de l'établissement (retours/, jamais commité — voir mémoire
   Claude Code organisation-cours-refonte-papier-technique-froid).
   ============================================================ */
let missionViewTarget = null; // { kind: 'session' | 'reunion', id }

function missionEntity() {
  if (!missionViewTarget) return null;
  if (missionViewTarget.kind === 'standalone') return (state.missions || []).find(m => m.id === missionViewTarget.id);
  return missionViewTarget.kind === 'reunion'
    ? (state.reunions || []).find(r => r.id === missionViewTarget.id)
    : findSession(missionViewTarget.id);
}

function missionDeplacementLie(entity) {
  if (!entity || missionViewTarget.kind === 'standalone') return null;
  return missionViewTarget.kind === 'reunion'
    ? reunionDeplacement(entity)
    : (state.deplacements || []).find(d => d.sessionId === entity.id) || null;
}

function missionTitreEntite(entity) {
  if (missionViewTarget.kind === 'standalone') return entity.titre || 'Nouvel ordre de mission';
  return missionViewTarget.kind === 'reunion'
    ? (entity.sujets ? truncate(entity.sujets, 48) : 'Réunion')
    : (entity.title || 'Séance sans titre');
}

// Préférences purement locales au poste (pas de colonne Supabase pour ça :
// la fonction change rarement, les destinataires sont propres à chaque
// enseignant) — jamais de vraie adresse codée en dur dans le dépôt.
function missionFonctionMemorisee() {
  try { return localStorage.getItem('oc-ma-fonction') || ''; } catch (e) { return ''; }
}
function memoriserMissionFonction(valeur) {
  try { localStorage.setItem('oc-ma-fonction', valeur || ''); } catch (e) { /* stockage indisponible : tant pis */ }
}
function missionDestinatairesMemorises() {
  try { return JSON.parse(localStorage.getItem('oc-mission-destinataires') || '[]'); } catch (e) { return []; }
}
function memoriserMissionDestinataires(liste) {
  try { localStorage.setItem('oc-mission-destinataires', JSON.stringify(liste || [])); } catch (e) { /* tant pis */ }
}

// Ajustements #6 (22/08/2026) : le vrai gabarit administratif (Martin,
// retours/ODM_Gabarit.pdf) écrit les heures en HH:MM ("08:30"), pas au
// format oral des créneaux affichés ailleurs dans l'appli ("8h15") — d'où
// le pré-remplissage automatique qui converti, un champ resté texte libre
// (l'utilisateur peut toujours taper autre chose s'il le faut vraiment).
function heureVersHHMM(str) {
  const m = /(\d{1,2})h(\d{2})?/.exec(str || '');
  return m ? `${String(parseInt(m[1], 10)).padStart(2, '0')}:${m[2] || '00'}` : (str || '');
}
function defaultMissionDetail(entity) {
  const dep = missionDeplacementLie(entity);
  const iso = missionViewTarget.kind === 'reunion' ? (entity.date || '')
    : missionViewTarget.kind === 'standalone' ? '' : sessionIsoDate(entity);
  const horaire = missionViewTarget.kind === 'session' ? dashHoraire(entity) : '';
  const [heureDebut, heureFin] = horaire ? horaire.split('–').map(x => heureVersHHMM(x.trim())) : ['', ''];
  return {
    commandePar: { nom: `${moiNom} ${moiPrenom}`.trim(), fonction: missionFonctionMemorisee() },
    destination: dep?.lieu || entity.room || '',
    dateMission: iso || '',
    heureDebut: heureDebut || '', heureFin: heureFin || '',
    description: missionViewTarget.kind === 'standalone' ? '' : missionTitreEntite(entity),
    accompagnants: [],
    transport: { vehiculePersonnel: true, vehiculeDe: '', verifAssurance: false, verifPermis: false, controleFormateur: false },
    faitLe: new Date().toISOString().slice(0, 10),
    faitA: 'Auray',
    destinataires: missionDestinatairesMemorises(),
    envoyeAt: null
  };
}

function ensureMissionDetail(entity) {
  if (!entity.missionDetail) entity.missionDetail = defaultMissionDetail(entity);
  // Toujours au moins une ligne réelle en état : le champ affiché doit pouvoir
  // s'écrire (accompagnants.0.nom) même avant tout clic sur « + Ajouter ».
  if (!entity.missionDetail.accompagnants.length) entity.missionDetail.accompagnants.push({ nom: '', fonction: '' });
  return entity.missionDetail;
}

// Écran 18 (mobile, 21/08/2026) — #missionView est partagé desktop/mobile
// (voir styles.css « Coquille mobile »), atteint depuis Urgences aussi bien
// sur #dashSemaine/#urgencesList (desktop) que #mobileAValider/#mobileSemaine
// (mobile). missionViewReturnTo mémorise la vue d'où l'on vient pour que
// closeMissionView() y revienne — sinon un retour depuis mobile activait
// toujours l'onglet desktop « Tableau de bord », invisible en CSS sous
// 780px, laissant l'écran mobile vide (aucune .view mobile active-view).
let missionViewReturnTo = 'dashboard';
function openMissionView(kind, id) {
  if (!kind || !id) return;
  missionViewTarget = { kind, id };
  const entity = missionEntity();
  if (!entity) { missionViewTarget = null; return; }
  ensureMissionDetail(entity);
  const vueActuelle = $('.view.active-view');
  if (vueActuelle) missionViewReturnTo = vueActuelle.id;
  $$('.tab').forEach(t => t.classList.remove('active'));
  $$('.view').forEach(v => v.classList.remove('active-view'));
  $('#missionView')?.classList.add('active-view');
  renderMissionView();
  window.scrollTo(0, 0);
  updateMobileBannerBack();
}

function closeMissionView() {
  missionViewTarget = null;
  const cible = missionViewReturnTo || 'dashboard';
  const realTab = $(`.tab[data-view="${cible}"]`);
  if (realTab) realTab.click(); else showMobileScreen(cible);
}

function missionStatutLabel(entity, detail) {
  if (detail.envoyeAt) return `envoyé le ${new Date(detail.envoyeAt).toLocaleDateString('fr-FR')}`;
  const iso = detail.dateMission;
  if (!iso) return 'date à préciser · non envoyé';
  const j = dashJoursEntre(iso);
  const delai = j === null ? '' : (j <= 0 ? 'J' : `J–${j}`);
  return `${delai} · non envoyé`;
}

function missionAccompagnantRow(a, index) {
  return `<div class="mission-accompagnant-row">
    <label class="mission-field-label">Nom Prénom :
      <input type="text" class="mission-field" data-mission-field="accompagnants.${index}.nom" value="${escapeAttr(a.nom || '')}" />
    </label>
    <label class="mission-field-label">Fonction :
      <input type="text" class="mission-field" data-mission-field="accompagnants.${index}.fonction" value="${escapeAttr(a.fonction || '')}" />
    </label>
    <button type="button" class="icon-button mission-remove-accompagnant" data-mission-remove-accompagnant="${index}" title="Retirer">×</button>
  </div>`;
}

function missionCheck(checked, field, label) {
  return `<label class="checkbox-inline mission-check">
    <input type="checkbox" data-mission-field="${escapeAttr(field)}" ${checked ? 'checked' : ''} />
    <span>${escapeHtml(label)}</span>
  </label>`;
}

function missionSignatureBoxHtml() {
  const url = missionSignatureUrlCache;
  if (url) return `<img src="${escapeAttr(url)}" alt="Signature" class="mission-signature-img" />`;
  return `<button type="button" id="missionSignatureUpload" class="lien mission-signature-add">Ajouter ma signature (privé)</button>
    <input type="file" id="missionSignatureFile" accept="image/*" hidden />`;
}

function renderMissionView() {
  const entity = missionEntity();
  if (!entity) return;
  const detail = ensureMissionDetail(entity);
  const titre = missionTitreEntite(entity);

  const titleEl = $('#missionTitle');
  if (titleEl) titleEl.textContent = `Ordre de mission — ${titre}`;
  const statusEl = $('#missionStatus');
  if (statusEl) statusEl.textContent = missionStatutLabel(entity, detail);

  const accompagnants = detail.accompagnants; // toujours ≥ 1 (ensureMissionDetail)
  const doc = $('#missionDocument');
  if (doc) doc.innerHTML = `
    <header class="mission-doc-header">
      <img src="img/logo-kerplouz.png" alt="Kerplouz LaSalle — Auray" class="mission-logo" />
      <h1>Ordre de mission</h1>
    </header>
    <div class="mission-field-line">
      <span class="mission-field-label">Commandé par (Nom/Prénom) :</span>
      <input type="text" class="mission-field mission-field-wide" data-mission-field="commandePar.nom" value="${escapeAttr(detail.commandePar.nom)}" />
    </div>
    <div class="mission-field-line">
      <span class="mission-field-label">Fonction :</span>
      <input type="text" class="mission-field mission-field-wide" data-mission-field="commandePar.fonction" value="${escapeAttr(detail.commandePar.fonction)}" />
    </div>
    <div class="mission-field-line">
      <span class="mission-field-label">Est autorisé(e) à se rendre le :</span>
      <input type="date" class="mission-field" data-mission-field="dateMission" value="${escapeAttr(detail.dateMission)}" />
      <span class="mission-field-label">à :</span>
      <input type="text" class="mission-field mission-field-wide" data-mission-field="destination" value="${escapeAttr(detail.destination)}" />
    </div>
    <div class="mission-field-line">
      <span class="mission-field-label">Heure début :</span>
      <input type="text" class="mission-field mission-field-narrow" data-mission-field="heureDebut" value="${escapeAttr(detail.heureDebut)}" />
      <span class="mission-field-label">Heure fin :</span>
      <input type="text" class="mission-field mission-field-narrow" data-mission-field="heureFin" value="${escapeAttr(detail.heureFin)}" />
    </div>
    <div class="mission-block">
      <span class="mission-block-title">Description de la mission :</span>
      <textarea class="mission-field mission-field-block" rows="3" data-mission-field="description">${escapeHtml(detail.description)}</textarea>
    </div>
    <div class="mission-block">
      <span class="mission-block-title">Accompagnants :</span>
      <div id="missionAccompagnants">${accompagnants.map(missionAccompagnantRow).join('')}</div>
      ${accompagnants.length < 4 ? '<button type="button" id="missionAddAccompagnant" class="lien">+ Ajouter un accompagnant</button>' : ''}
    </div>
    <div class="mission-block">
      <span class="mission-block-title mission-transport-title">Moyens de transports</span>
      <div class="mission-transport-grid">
        <div>
          ${missionCheck(detail.transport.vehiculePersonnel, 'transport.vehiculePersonnel', 'Véhicule personnel')}
          <label class="mission-field-label mission-vehicule-de">Véhicule de :
            <input type="text" class="mission-field" data-mission-field="transport.vehiculeDe" value="${escapeAttr(detail.transport.vehiculeDe)}" />
          </label>
        </div>
        <div>
          ${missionCheck(detail.transport.verifAssurance, 'transport.verifAssurance', 'Vérification assurance avant départ')}
          ${missionCheck(detail.transport.verifPermis, 'transport.verifPermis', 'Vérification permis avant départ')}
          ${missionCheck(detail.transport.controleFormateur, 'transport.controleFormateur', 'Contrôle formateur avant départ')}
        </div>
      </div>
    </div>
    <div class="mission-field-line mission-fait">
      <span class="mission-field-label">Fait à</span>
      <input type="text" class="mission-field mission-field-narrow" data-mission-field="faitA" value="${escapeAttr(detail.faitA)}" />
      <span class="mission-field-label">le :</span>
      <input type="date" class="mission-field" data-mission-field="faitLe" value="${escapeAttr(detail.faitLe)}" />
    </div>
    <div class="mission-signatures">
      <div class="mission-sig-box">
        <span class="mission-sig-title">Le Demandeur :</span>
        ${missionSignatureBoxHtml()}
      </div>
      <div class="mission-sig-box">
        <span class="mission-sig-title">Formateur / Enseignant :</span>
      </div>
      <div class="mission-sig-box">
        <span class="mission-sig-title">Direction (1 des 3 pers.) :</span>
        <p class="meta mission-sig-hint">Chef d’établissement · Gestionnaire · Responsable UFA/CFA</p>
      </div>
    </div>`;

  const chipsEl = $('#missionDestinatairesList');
  if (chipsEl) chipsEl.innerHTML = detail.destinataires.map((email, i) => `
    <span class="mission-chip">${escapeHtml(email)}<button type="button" data-mission-remove-destinataire="${i}" title="Retirer">×</button></span>`).join('')
    || '<span class="meta">Aucun destinataire pour l’instant.</span>';

  const pdfBtn = $('#missionPdfButton');
  if (pdfBtn) pdfBtn.textContent = 'Enregistrer le PDF';
}

function missionSetField(path, value) {
  const entity = missionEntity();
  if (!entity) return;
  const detail = ensureMissionDetail(entity);
  const parts = path.split('.');
  let target = detail;
  for (let i = 0; i < parts.length - 1; i++) target = target[parts[i]];
  target[parts[parts.length - 1]] = value;
  if (path === 'commandePar.fonction') memoriserMissionFonction(value);
  // Un ODM autonome n'a pas de titre de séance/réunion à afficher dans les
  // listes (Accueil, écran « Ordre de mission ») : l'« Objet » du document en
  // tient lieu, recopié à chaque frappe.
  if (path === 'description' && missionViewTarget?.kind === 'standalone') {
    entity.titre = value.trim();
    const titleEl = $('#missionTitle');
    if (titleEl) titleEl.textContent = `Ordre de mission — ${missionTitreEntite(entity)}`;
  }
}

// Écran « Ordre de mission » (Accueil mobile, ajustements #5 22/08/2026) —
// un ODM qui n'attend pas qu'une séance/réunion coche « véhicule personnel »,
// pour les déplacements décidés trop tard pour avoir été anticipés ainsi.
function createStandaloneMission() {
  state.missions = state.missions || [];
  const m = { id: uid('mission'), titre: '', missionDetail: null };
  state.missions.push(m);
  openMissionView('standalone', m.id);
  saveData('Ordre de mission créé', { rerender: false });
}

function renderMobileMission() {
  const host = $('#mobileMission');
  if (!host) return;
  const aFaire = ordresDeMissionAFaire();
  const mesMissions = (state.missions || []).slice()
    .sort((a, b) => (b.missionDetail?.dateMission || '').localeCompare(a.missionDetail?.dateMission || ''));
  const ligneAFaire = o => `<div class="urgence-row" data-open-mission="${escapeAttr(o.source)}:${escapeAttr(o.id)}" tabindex="0" role="button">
    <strong class="urgence-titre">${escapeHtml(o.titre)}</strong>
    <span class="urgence-detail">${escapeHtml([o.date ? o.date.toLocaleDateString('fr-FR') : 'Date à préciser', o.detail].filter(Boolean).join(' · '))}</span>
    <span class="urgence-verbe" data-open-mission="${escapeAttr(o.source)}:${escapeAttr(o.id)}" tabindex="0" role="button">Éditer</span>
  </div>`;
  const ligneStandalone = m => {
    const detail = m.missionDetail || {};
    const statut = detail.envoyeAt ? `envoyé le ${new Date(detail.envoyeAt).toLocaleDateString('fr-FR')}` : 'non envoyé';
    return `<div class="urgence-row" data-open-mission="standalone:${escapeAttr(m.id)}" tabindex="0" role="button">
      <strong class="urgence-titre">${escapeHtml(m.titre || 'Ordre de mission')}</strong>
      <span class="urgence-detail">${escapeHtml([detail.dateMission ? formatDateFr(detail.dateMission) : 'Date à préciser', statut].filter(Boolean).join(' · '))}</span>
    </div>`;
  };
  host.innerHTML = `
    <button type="button" class="mobile-add-deplacement" id="mobileNewMissionButton">+ Nouvel ordre de mission</button>
    ${aFaire.length ? `<h3 class="mobile-group-title">Déplacements sans ordre de mission</h3>${aFaire.map(ligneAFaire).join('')}` : ''}
    ${mesMissions.length ? `<h3 class="mobile-group-title">Mes ordres de mission</h3>${mesMissions.map(ligneStandalone).join('')}` : ''}
    ${(!aFaire.length && !mesMissions.length) ? '<p class="empty-hint">Rien à signaler.</p>' : ''}`;
}

const MISSION_PRINT_CSS = `
* { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
@page { size: A4 portrait; margin: 12mm; }
body{background:#e9e6dc;font-family:'IBM Plex Sans',sans-serif;}
.mission-print-page{background:#fffefb;max-width:190mm;margin:0 auto;padding:14mm;}
.mission-doc-header{display:flex;align-items:center;gap:16px;border-bottom:1px solid #191b16;padding-bottom:10px;margin-bottom:18px;}
.mission-doc-header img{height:48px;}
.mission-doc-header h1{font-size:22px;margin:0;}
.mission-print-line{margin:0 0 10px;font-size:13px;}
.mission-print-line strong{border-bottom:1px solid #191b16;padding:0 4px;}
.mission-print-block{margin:14px 0;}
.mission-print-block h3{font-size:12px;text-transform:uppercase;letter-spacing:.04em;margin:0 0 6px;}
.mission-print-desc{border:1px solid #191b16;padding:10px;min-height:50px;white-space:pre-wrap;font-size:13px;}
.mission-print-table{width:100%;border-collapse:collapse;font-size:12px;margin-top:6px;}
.mission-print-table td{padding:3px 6px;border-bottom:1px solid #d8d4c6;}
/* Ajustements #6 (22/08/2026) : « ne ressemble pas tout à fait au format
   administratif » — comparé au vrai gabarit fourni par Martin
   (retours/ODM_Gabarit.pdf, jamais commité), le PDF exporté avait pris du
   retard sur les affinages déjà faits côté document en ligne (colonnes
   Moyens de transports, rappel des 3 rôles Direction) : remis en phase ici,
   plus le titre en couleur repère (même --danger que le document en ligne,
   codé en dur — cette fenêtre d'impression n'a pas accès aux variables CSS
   de l'appli). */
.mission-print-block h3.mission-print-transport-title{color:#C0562B;}
.mission-print-transport-grid{display:grid;grid-template-columns:1fr 1fr;gap:0 16px;}
.mission-print-check{margin:2px 0;font-size:12px;}
.mission-print-sigs{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:24px;border-top:2px solid #C0562B;padding-top:10px;}
.mission-print-sigs div{border:1px solid #191b16;min-height:70px;padding:8px;font-size:11px;}
.mission-print-sigs strong{display:block;margin-bottom:4px;}
.mission-print-sigs img{max-height:50px;}
.mission-print-sig-hint{margin:2px 0 0;font-size:9.5px;color:#4b5563;}
@media print{body{background:#fff;}.mission-print-page{box-shadow:none;padding:0;max-width:none;}}
`;

function missionPagePrintHtml(entity, detail) {
  const acc = detail.accompagnants.filter(a => a.nom || a.fonction);
  return `<div class="mission-print-page">
    <div class="mission-doc-header"><img src="img/logo-kerplouz.png" alt="" /><h1>Ordre de mission</h1></div>
    <p class="mission-print-line">Commandé par (Nom/Prénom) : <strong>${escapeHtml(detail.commandePar.nom || '—')}</strong></p>
    <p class="mission-print-line">Fonction : <strong>${escapeHtml(detail.commandePar.fonction || '—')}</strong></p>
    <p class="mission-print-line">Est autorisé(e) à se rendre le <strong>${escapeHtml(detail.dateMission ? new Date(detail.dateMission).toLocaleDateString('fr-FR') : '—')}</strong> à : <strong>${escapeHtml(detail.destination || '—')}</strong></p>
    <p class="mission-print-line">Heure début : <strong>${escapeHtml(detail.heureDebut || '—')}</strong> Heure fin : <strong>${escapeHtml(detail.heureFin || '—')}</strong></p>
    <div class="mission-print-block"><h3>Description de la mission :</h3><div class="mission-print-desc">${escapeHtml(detail.description || '')}</div></div>
    <div class="mission-print-block"><h3>Accompagnants :</h3><table class="mission-print-table">${acc.length ? acc.map(a => `<tr><td>${escapeHtml(a.nom || '—')}</td><td>${escapeHtml(a.fonction || '—')}</td></tr>`).join('') : '<tr><td class="meta">Aucun</td></tr>'}</table></div>
    <div class="mission-print-block"><h3 class="mission-print-transport-title">Moyens de transports</h3>
      <div class="mission-print-transport-grid">
        <div>
          <p class="mission-print-check">${detail.transport.vehiculePersonnel ? '☒' : '☐'} Véhicule personnel</p>
          <p class="mission-print-check">${detail.transport.vehiculeDe ? '☒' : '☐'} Véhicule de : ${escapeHtml(detail.transport.vehiculeDe || '')}</p>
        </div>
        <div>
          <p class="mission-print-check">${detail.transport.verifAssurance ? '☒' : '☐'} Vérification assurance avant départ</p>
          <p class="mission-print-check">${detail.transport.verifPermis ? '☒' : '☐'} Vérification permis avant départ</p>
          <p class="mission-print-check">${detail.transport.controleFormateur ? '☒' : '☐'} Contrôle formateur avant départ</p>
        </div>
      </div>
    </div>
    <p class="mission-print-line">Fait à ${escapeHtml(detail.faitA || '—')} le : ${escapeHtml(detail.faitLe ? new Date(detail.faitLe).toLocaleDateString('fr-FR') : '—')}</p>
    <div class="mission-print-sigs">
      <div><strong>Le Demandeur :</strong>${missionSignatureUrlCache ? `<br><img src="${escapeAttr(missionSignatureUrlCache)}" alt="" />` : ''}</div>
      <div><strong>Formateur / Enseignant :</strong></div>
      <div><strong>Direction (1 des 3 pers.) :</strong><p class="mission-print-sig-hint">- Chef d’établissement<br>- Gestionnaire<br>- Responsable UFA / CFA</p></div>
    </div>
  </div>`;
}

function missionOpenPrintWindow() {
  const entity = missionEntity();
  if (!entity) return;
  const detail = ensureMissionDetail(entity);
  const win = window.open('', '_blank');
  if (!win) { alert('Le navigateur a bloqué l’ouverture de la fenêtre d’impression. Autorisez les pop-ups pour ce site.'); return; }
  win.document.write(`<!doctype html><html lang="fr"><head><meta charset="utf-8"><title>Ordre de mission — ${escapeHtml(missionTitreEntite(entity))}</title><style>${MISSION_PRINT_CSS}</style></head><body>${missionPagePrintHtml(entity, detail)}<script>setTimeout(()=>window.print(),400)<\/script></body></html>`);
  win.document.close();
}

// mailto: ne peut pas joindre de fichier (limite du protocole, pas de l'app) —
// on ouvre donc d'abord l'impression (l'utilisateur choisit « Enregistrer en
// PDF »), puis le mail pré-rempli qui le rappelle dans le corps du message.
function missionSendMail() {
  const entity = missionEntity();
  if (!entity) return;
  const detail = ensureMissionDetail(entity);
  missionOpenPrintWindow();
  const sujet = `Ordre de mission — ${missionTitreEntite(entity)}`;
  const corps = `Bonjour,\n\nVeuillez trouver ci-joint l’ordre de mission du ${detail.dateMission ? new Date(detail.dateMission).toLocaleDateString('fr-FR') : ''} (${detail.destination || ''}).\nMerci de joindre le PDF que vous venez d’enregistrer avant l’envoi.\n\nCordialement,\n${detail.commandePar.nom}`;
  const href = `mailto:${detail.destinataires.join(',')}?subject=${encodeURIComponent(sujet)}&body=${encodeURIComponent(corps)}`;
  window.location.href = href;
  detail.envoyeAt = new Date().toISOString();
  entity.ordreMission = true;
  saveData('Ordre de mission marqué envoyé');
}

// Signature — stockage privé Supabase (bucket "oc-signatures", voir
// supabase/013-signatures-storage.sql), jamais dans le dépôt. Non testable
// depuis retours/preview.js (stub sans Supabase réel) : à vérifier par Martin
// sur http://localhost:8765/index.html une fois le bucket créé.
let missionSignatureUrlCache = '';

async function missionChargerSignature() {
  try {
    const getClient = window.OC_SUPABASE_CLIENT;
    if (!getClient) return;
    const sb = await getClient();
    const { data: { user } } = await sb.auth.getUser();
    if (!user) return;
    const { data, error } = await sb.storage.from('oc-signatures').createSignedUrl(`${user.id}/signature.png`, 3600);
    if (error) { console.error('[signature] createSignedUrl', error); return; }
    if (!data) return;
    missionSignatureUrlCache = data.signedUrl;
    if (missionViewTarget) renderMissionView();
  } catch (e) { console.error('[signature] chargement', e); }
}

async function missionUploaderSignature(file) {
  try {
    const getClient = window.OC_SUPABASE_CLIENT;
    if (!getClient || !file) return;
    const sb = await getClient();
    const { data: { user } } = await sb.auth.getUser();
    if (!user) return;
    setSaveStatus('Envoi de la signature…');
    const { error } = await sb.storage.from('oc-signatures').upload(`${user.id}/signature.png`, file, { upsert: true, contentType: file.type });
    if (error) { console.error('[signature] upload', error); alert('Échec de l’envoi de la signature : ' + error.message); return; }
    await missionChargerSignature();
    setSaveStatus('Signature enregistrée (privée)');
  } catch (e) { console.error('[signature] upload', e); alert('Échec de l’envoi de la signature.'); }
}

/* Badge du panneau Tableau de bord : nb + total des demandes NON terminées.
   Visible même panneau replié, sans afficher les terminées.
   Filtré à estVisiblePourMoi (22/08/2026, partage inter-comptes) : une ligne
   réassignée au compte d'un collègue (d.teacher) sort de mon Frais — c'est
   justement le principe du partage, « vous n'aurez rien à déclarer ». */
function updateFraisBadge() {
  const badge = $('#fraisSummaryBadge');
  if (!badge) return;
  const all = (state.deplacements || []).filter(estVisiblePourMoi);
  const pending = all.filter(d => d.statut !== 'Terminée');
  const total = pending.reduce((s, d) => s + deplacementTotal(d), 0);
  badge.textContent = pending.length ? `${pending.length} à traiter · ${fmtEuro(total)}` : (all.length ? 'à jour' : '');
  badge.classList.toggle('has-pending', pending.length > 0);
}

function renderFrais() {
  updateFraisBadge();
  const wrap = $('#fraisTableWrap');
  if (!wrap) return;
  const statusFilter = $('#fraisStatusFilter')?.value || 'actives';
  const all = (state.deplacements || []).filter(estVisiblePourMoi)
    .sort((a, b) => (a.date || '').localeCompare(b.date || '') || String(a.id).localeCompare(String(b.id)));
  if (!all.length) {
    wrap.innerHTML = `<p class="empty-hint">Aucun déplacement enregistré. Cochez « Déplacement en véhicule personnel » sur une séance, ou ajoutez-en un avec « + Déplacement ».</p>`;
    return;
  }
  const matchStatus = d => statusFilter === 'all'
    ? true
    : (statusFilter === 'actives' ? d.statut !== 'Terminée' : d.statut === statusFilter);
  const rows = all.filter(matchStatus);
  const totalFiltered = rows.reduce((s, d) => s + deplacementTotal(d), 0);
  const totalAll = all.reduce((s, d) => s + deplacementTotal(d), 0);
  const statusClass = st => st === 'Terminée' ? 'is-done' : (st === 'En cours' ? 'is-progress' : 'is-todo');
  const body = rows.map(d => {
    const linkedSession = d.sessionId && state.sessions.some(s => s.id === d.sessionId);
    const linkedReunion = d.reunionId && (state.reunions || []).some(r => r.id === d.reunionId);
    const linkTitle = linkedSession ? 'Créé depuis une séance' : 'Créé depuis une réunion';
    return `<tr data-edit-deplacement="${escapeAttr(d.id)}">
      <td>${escapeHtml(d.date ? formatDateFr(d.date) : '—')}</td>
      <td>${escapeHtml(d.lieu || '—')}${(linkedSession || linkedReunion) ? ` <span class="frais-link" title="${escapeAttr(linkTitle)}">🔗</span>` : ''}</td>
      <td>${escapeHtml(d.conducteur || '—')}</td>
      <td title="${escapeAttr(d.keywords || '')}">${escapeHtml(d.keywords ? truncate(d.keywords, 32) : '—')}</td>
      <td class="num">${Number(d.kmAR) || 0}</td>
      <td class="num">${escapeHtml(fmtEuro(deplacementTotal(d)))}</td>
      <td><span class="frais-status ${statusClass(d.statut)}">${escapeHtml(d.statut)}</span></td>
      <td class="frais-row-actions"><button type="button" class="icon-button small" data-edit-deplacement="${escapeAttr(d.id)}" title="Modifier">✎</button></td>
    </tr>`;
  }).join('');
  const totalsLine = rows.length === all.length
    ? `<span><strong>${all.length}</strong> déplacement(s) · Total : <strong>${escapeHtml(fmtEuro(totalAll))}</strong></span>`
    : `<span><strong>${rows.length}</strong> affiché(s) · ${escapeHtml(fmtEuro(totalFiltered))}</span><span class="meta">Total général (${all.length} lignes) : <strong>${escapeHtml(fmtEuro(totalAll))}</strong></span>`;
  wrap.innerHTML = `
    <div class="frais-totals">${totalsLine}</div>
    <div class="table-scroll">
      <table class="frais-table">
        <!-- Classe, UE et Taux ne sont plus affichés ici : ils allongeaient le
             tableau au point d'exiger la pleine largeur, alors que l'encart doit
             tenir dans sa colonne. Ils restent saisissables dans la fiche et
             présents dans les exports, qui eux vont à l'administration. -->
        <thead><tr><th>Date</th><th>Lieu</th><th>Conducteur</th><th>Mots-clés</th><th class="num">Km A/R</th><th class="num">Total</th><th>Statut</th><th aria-label="Actions"></th></tr></thead>
        <tbody>${body || `<tr><td colspan="8" class="empty-hint">Aucun déplacement pour ce filtre.</td></tr>`}</tbody>
      </table>
    </div>`;
}

/* Espace « Matériel emprunté » (ajustements #5, 22/08/2026) — nouvelle
   fonctionnalité mobile ET desktop, même principe que Frais : suivre qui a
   emprunté quoi (élèves), pas de catalogue, texte libre. `estVisiblePourMoi`
   partagé avec le reste de l'appli (même « Compte concerné » que Déplacements). */
function updateMaterielEmpruntsBadge() {
  const badge = $('#materielEmpruntsBadge');
  if (!badge) return;
  const enCours = (state.materielEmprunts || []).filter(estVisiblePourMoi).filter(m => !m.dateRetour);
  badge.textContent = enCours.length ? `${enCours.length} en cours` : '';
  badge.classList.toggle('has-pending', enCours.length > 0);
}

function materielEmpruntLabel(m) {
  return [m.materielType, m.materielIdentifiant].filter(Boolean).join(' — ') || 'Matériel';
}
function materielEmpruntRowMarkup(m, mobile) {
  const rendu = !!m.dateRetour;
  const quand = [m.date ? formatDateFr(m.date) : 'date à préciser', rendu ? `rendu le ${formatDateFr(m.dateRetour)}` : ''].filter(Boolean).join(' · ');
  if (mobile) {
    const verbe = rendu ? '' : `<label class="urgence-verbe room-booked-check"><input type="checkbox" data-materiel-marquer-rendu="${escapeAttr(m.id)}"><span>Rendu</span></label>`;
    return `<div class="urgence-row${rendu ? ' est-fait' : ''}" data-edit-materiel-emprunt="${escapeAttr(m.id)}" tabindex="0" role="button">
      <strong class="urgence-titre">${escapeHtml(materielEmpruntLabel(m))}</strong>
      <span class="urgence-detail">${escapeHtml([m.etudiant || 'étudiant à préciser', m.classe].filter(Boolean).join(' · '))} · ${escapeHtml(quand)}</span>
      ${verbe}
    </div>`;
  }
  return `<tr data-edit-materiel-emprunt="${escapeAttr(m.id)}">
    <td>${escapeHtml(materielEmpruntLabel(m))}</td>
    <td>${escapeHtml(m.etudiant || '—')}</td>
    <td>${escapeHtml(m.classe || '—')}</td>
    <td>${escapeHtml(m.date ? formatDateFr(m.date) : '—')}</td>
    <td>${rendu ? escapeHtml(formatDateFr(m.dateRetour)) : '<span class="frais-status is-todo">En cours</span>'}</td>
    <td class="frais-row-actions"><button type="button" class="icon-button small" data-edit-materiel-emprunt="${escapeAttr(m.id)}" title="Modifier">✎</button></td>
  </tr>`;
}

function renderMaterielEmprunts() {
  updateMaterielEmpruntsBadge();
  const wrap = $('#materielEmpruntsList');
  if (!wrap) return;
  const all = (state.materielEmprunts || []).filter(estVisiblePourMoi)
    .sort((a, b) => (b.date || '').localeCompare(a.date || ''));
  if (!all.length) {
    wrap.innerHTML = `<p class="empty-hint">Aucun emprunt enregistré. Ajoutez-en un avec « + Emprunt ».</p>`;
    return;
  }
  const body = all.map(m => materielEmpruntRowMarkup(m, false)).join('');
  wrap.innerHTML = `
    <div class="table-scroll">
      <table class="frais-table">
        <thead><tr><th>Matériel</th><th>Étudiant</th><th>Classe</th><th>Emprunté le</th><th>Rendu</th><th aria-label="Actions"></th></tr></thead>
        <tbody>${body}</tbody>
      </table>
    </div>`;
}

function renderMobileMateriel() {
  const host = $('#mobileMateriel');
  if (!host) return;
  const all = (state.materielEmprunts || []).filter(estVisiblePourMoi)
    .sort((a, b) => (b.date || '').localeCompare(a.date || ''));
  const enCours = all.filter(m => !m.dateRetour);
  const rendus = all.filter(m => m.dateRetour);
  const groupe = (titre, liste) => liste.length
    ? `<h3 class="mobile-group-title">${titre}</h3>${liste.map(m => materielEmpruntRowMarkup(m, true)).join('')}`
    : '';
  host.innerHTML = `
    <button type="button" class="mobile-add-deplacement" id="mobileAddMaterielEmpruntButton">+ Emprunt</button>
    ${all.length ? (groupe('En cours', enCours) + groupe('Rendus', rendus)) : '<p class="empty-hint">Aucun emprunt enregistré.</p>'}`;
}

/* Catalogue de matériel (ajustements #6, 22/08/2026) — encart desktop du
   Tableau de bord, du même patron que Réunions/Déplacements : liste à plat de
   `state.materielTypes` (chaînes) et `state.materielItems` ({id,type,
   identifiant}), édités ici, qui alimentent ensuite les 2 menus en cascade du
   formulaire d'emprunt (voir remplirMaterielTypeSelect/remplirMaterielIdentifiantSelect). */
function renderMaterielCatalogue() {
  const wrap = $('#materielCatalogueList');
  if (!wrap) return;
  const types = state.materielTypes || [];
  if (!types.length) { wrap.innerHTML = '<p class="empty-hint">Aucun type de matériel. Ajoutez-en un ci-dessus.</p>'; return; }
  wrap.innerHTML = types.map(type => {
    const items = (state.materielItems || []).filter(it => it.type === type);
    const itemsHtml = items.length
      ? `<ul class="materiel-item-liste">${items.map(it => `<li>${escapeHtml(it.identifiant)}<button type="button" class="icon-button small" data-delete-materiel-item="${escapeAttr(it.id)}" title="Supprimer cet identifiant">×</button></li>`).join('')}</ul>`
      : '<p class="empty-hint">Aucun identifiant enregistré.</p>';
    return `<div class="materiel-type-bloc">
      <div class="materiel-type-tete">
        <strong>${escapeHtml(type)}</strong>
        <span class="meta">(${items.length})</span>
        <button type="button" class="icon-button small" data-delete-materiel-type="${escapeAttr(type)}" title="Supprimer ce type">×</button>
      </div>
      ${itemsHtml}
      <form class="materiel-item-add-form" data-materiel-item-type="${escapeAttr(type)}">
        <input type="text" placeholder="Identifiant (ex. LV-3)" maxlength="40" required />
        <button type="submit" class="secondary small">+ Ajouter</button>
      </form>
    </div>`;
  }).join('');
}

// Menus en cascade du formulaire d'emprunt : le type choisi filtre les
// identifiants proposés (remplirMaterielIdentifiantSelect), rappelé au
// changement de type (voir bindEvents) comme à l'ouverture de la modale.
function remplirMaterielTypeSelect(typeActuel) {
  const sel = $('#materielEmpruntType');
  if (!sel) return;
  const types = state.materielTypes || [];
  sel.innerHTML = (types.includes(typeActuel) || !typeActuel ? types : [typeActuel, ...types])
    .map(t => `<option value="${escapeAttr(t)}">${escapeHtml(t)}</option>`).join('') || '<option value="">—</option>';
  if (typeActuel) sel.value = typeActuel;
}
function remplirMaterielIdentifiantSelect(identifiantActuel) {
  const sel = $('#materielEmpruntIdentifiant');
  if (!sel) return;
  const type = $('#materielEmpruntType')?.value || '';
  const items = (state.materielItems || []).filter(it => it.type === type);
  const options = items.map(it => it.identifiant);
  if (identifiantActuel && !options.includes(identifiantActuel)) options.unshift(identifiantActuel);
  sel.innerHTML = options.length
    ? options.map(id => `<option value="${escapeAttr(id)}">${escapeHtml(id)}</option>`).join('')
    : '<option value="">Aucun identifiant pour ce type</option>';
  if (identifiantActuel) sel.value = identifiantActuel;
}

function openMaterielEmpruntModal(m = null) {
  const isNew = !m;
  $('#materielEmpruntModalTitle').textContent = isNew ? 'Nouvel emprunt' : 'Modifier l’emprunt';
  $('#materielEmpruntId').value = m?.id || '';
  remplirMaterielTypeSelect(m?.materielType || '');
  remplirMaterielIdentifiantSelect(m?.materielIdentifiant || '');
  $('#materielEmpruntEtudiant').value = m?.etudiant || '';
  $('#materielEmpruntClasse').value = m?.classe || 'GPN1';
  $('#materielEmpruntTeacher').value = m?.teacher || '';
  $('#materielEmpruntDate').value = m?.date || (isNew ? todayIso() : '');
  $('#materielEmpruntDateRetour').value = m?.dateRetour || '';
  $('#deleteMaterielEmpruntButton').hidden = isNew;
  $('#materielEmpruntDialog').showModal();
}

function openDeplacementModal(dep = null) {
  const isNew = !dep;
  $('#deplacementModalTitle').textContent = isNew ? 'Nouveau déplacement' : 'Modifier le déplacement';
  $('#deplacementId').value = dep?.id || '';
  $('#deplacementSessionId').value = dep?.sessionId || '';
  $('#deplacementReunionId').value = dep?.reunionId || '';
  $('#deplacementDate').value = dep?.date || '';
  $('#deplacementClasse').value = dep?.classe || 'GPN1';
  $('#deplacementConducteur').value = dep?.conducteur || '';
  if ($('#deplacementTeacher')) $('#deplacementTeacher').value = dep?.teacher || '';
  $('#deplacementLieu').value = dep?.lieu || '';
  if ($('#deplacementUe')) $('#deplacementUe').value = dep?.ue || '';
  if ($('#deplacementKeywords')) $('#deplacementKeywords').value = dep?.keywords || '';
  $('#deplacementKm').value = (dep?.kmAR ?? '') === 0 ? '0' : (dep?.kmAR || '');
  $('#deplacementTaux').value = (dep && (dep.taux === 0 || dep.taux)) ? dep.taux : DEFAULT_TAUX;
  $('#deplacementStatut').value = dep?.statut || DEPLACEMENT_STATUSES[0];
  const linkedSession = !!(dep?.sessionId && state.sessions.some(s => s.id === dep.sessionId));
  const linkedReunion = !!(dep?.reunionId && (state.reunions || []).some(r => r.id === dep.reunionId));
  const hint = $('#deplacementSessionHint');
  hint.hidden = !(linkedSession || linkedReunion);
  hint.textContent = linkedReunion
    ? 'Déplacement lié à une réunion : la date et le lieu sont repris de la réunion.'
    : 'Déplacement lié à une séance : la date est reprise de la séance.';
  $('#deleteDeplacementButton').hidden = isNew;
  updateDeplacementTotalPreview();
  $('#deplacementDialog').showModal();
}

function updateDeplacementTotalPreview() {
  const km = Number($('#deplacementKm')?.value) || 0;
  const taux = $('#deplacementTaux')?.value === '' ? DEFAULT_TAUX : (Number($('#deplacementTaux')?.value) || 0);
  const el = $('#deplacementTotalPreview');
  if (el) el.textContent = fmtEuro(Math.round(km * taux * 100) / 100);
}

/* ---- Lot M — Réunions réalisées (journal consultable) ---- */

/* Déplacement (Frais) lié à une réunion, s'il existe. */
function reunionDeplacement(reunion) {
  if (!reunion) return null;
  return (state.deplacements || []).find(d => d.reunionId === reunion.id) || null;
}

/* Crée (si absent) le déplacement lié à une réunion cochée « véhicule perso ».
   Même logique que pour une séance : ne supprime jamais (décocher laisse la
   ligne dans Frais, elle s'y gère ensuite — préservation des saisies). */
function ensureDeplacementForReunion(reunion) {
  if (!reunion || !state) return;
  const existing = reunionDeplacement(reunion);
  if (existing) {
    if (!existing.date) existing.date = reunion.date || '';
    if (!existing.lieu) existing.lieu = reunion.lieu || '';
    return;
  }
  state.deplacements.push({
    id: uid('deplacement'),
    date: reunion.date || '',
    lieu: reunion.lieu || '',
    conducteur: '',
    classe: 'GPN1',
    kmAR: 0,
    taux: DEFAULT_TAUX,
    statut: DEPLACEMENT_STATUSES[0],
    ue: '',
    keywords: '',
    teacher: reunion.teacher || '',
    sessionId: '',
    reunionId: reunion.id
  });
}

/* Badge du panneau : réunions À VENIR seulement (lot A [4]). Compter tout
   l'historique donnait un nombre qui ne cessait de grossir sans rien dire de ce
   qui reste à faire. La liste dépliée, elle, garde bien tout l'historique. */
function updateReunionsBadge() {
  const badge = $('#reunionsSummaryBadge');
  if (!badge) return;
  const today = dashAujourdhui();
  const n = (state.reunions || []).filter(r => {
    const d = parseIsoDate(r.date);
    return d && d >= today;
  }).length;
  badge.textContent = n ? `${n} à venir` : '';
}

function renderReunions() {
  updateReunionsBadge();
  const wrap = $('#reunionsList');
  if (!wrap) return;
  // Journal consultable a posteriori → plus récentes en tête.
  const list = [...(state.reunions || [])].sort((a, b) =>
    (b.date || '').localeCompare(a.date || '') || String(b.id).localeCompare(String(a.id)));
  if (!list.length) {
    wrap.innerHTML = `<p class="empty-hint">Aucune réunion enregistrée. Cliquez « + Réunion » pour garder trace d'une réunion réalisée (qui, où, quand, sujets abordés).</p>`;
    return;
  }
  // Retours 17/08/2026 — tableau plutôt que des cartes : plus dense, plus
  // facile à parcourir d'un coup d'œil (date, lieu, participants, sujet).
  // L'icône voiture ne marque que le véhicule personnel (ordre de mission à
  // suivre) ; le van d'établissement a sa propre étiquette de réservation
  // ailleurs (Urgences), pas besoin de la dupliquer ici.
  const rows = list.map(r => {
    const vehiculeTitre = r.ordreMission
      ? 'Véhicule personnel — ordre de mission demandé (voir Frais de déplacement)'
      : 'Véhicule personnel — ordre de mission à demander';
    return `<tr data-edit-reunion="${escapeAttr(r.id)}">
      <td>${escapeHtml(r.date ? formatDateFr(r.date) : '—')}</td>
      <td>${escapeHtml(r.lieu || '—')}</td>
      <td title="${escapeAttr(r.participants || '')}">${escapeHtml(r.participants ? truncate(r.participants, 40) : '—')}</td>
      <td title="${escapeAttr(r.sujets || '')}">${escapeHtml(r.sujets ? truncate(r.sujets, 60) : '—')}</td>
      <td>${r.deplacement === 'personnel' ? `<span title="${escapeAttr(vehiculeTitre)}">🚗</span>` : ''}</td>
    </tr>`;
  }).join('');
  wrap.innerHTML = `<table class="frais-table"><thead><tr>
      <th>Date</th><th>Lieu</th><th>Participants</th><th>Sujet</th><th>Véhicule perso</th>
    </tr></thead><tbody>${rows}</tbody></table>`;
}

function openReunionModal(reunion = null) {
  const isNew = !reunion;
  $('#reunionModalTitle').textContent = isNew ? 'Nouvelle réunion' : 'Modifier la réunion';
  $('#reunionId').value = reunion?.id || '';
  $('#reunionDate').value = reunion?.date || '';
  $('#reunionLieu').value = reunion?.lieu || '';
  $('#reunionParticipants').value = reunion?.participants || '';
  $('#reunionSujets').value = reunion?.sujets || '';
  $('#reunionTeacher').value = reunion?.teacher || '';
  if ($('#reunionDeplacement')) {
    $('#reunionDeplacement').value = reunion?.deplacement || '';
    if ($('#reunionVehicleBooked')) $('#reunionVehicleBooked').checked = !!reunion?.vehicleBooked;
    if ($('#reunionOrdreMission')) $('#reunionOrdreMission').checked = !!reunion?.ordreMission;
    syncDeplacementFields('reunion');
  }
  const dep = reunion ? reunionDeplacement(reunion) : null;
  $('#reunionFraisHint').hidden = !dep;
  $('#deleteReunionButton').hidden = isNew;
  $('#reunionDialog').showModal();
}

/* Matrice texte (toutes lignes, terminées comprises) pour CSV/XLS. */
function deplacementStringMatrix() {
  const header = ['Date', 'Lieu', 'Conducteur', 'Classe', 'UE', 'Mots-clés', 'Km A/R', 'Taux (€/km)', 'Total (€)', 'Statut', 'Origine'];
  const list = [...(state.deplacements || [])].sort((a, b) => (a.date || '').localeCompare(b.date || ''));
  const rows = list.map(d => {
    return [
      d.date ? formatDateFr(d.date) : '',
      d.lieu || '',
      d.conducteur || '',
      d.classe || '',
      d.ue || '',
      d.keywords || '',
      String(Number(d.kmAR) || 0),
      deplacementTaux(d).toFixed(2).replace('.', ','),
      deplacementTotal(d).toFixed(2).replace('.', ','),
      d.statut || '',
      deplacementOrigin(d)
    ];
  });
  const total = list.reduce((s, d) => s + deplacementTotal(d), 0);
  rows.push(['', '', '', '', '', '', '', 'TOTAL', total.toFixed(2).replace('.', ','), '', '']);
  return { header, rows };
}

function downloadBlob(content, mime, ext, filenameBase = 'frais-deplacement', statusLabel = 'Frais exportés') {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const now = new Date();
  const stamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filenameBase}_${stamp}.${ext}`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  setSaveStatus(`${statusLabel} (${ext.toUpperCase()})`);
}

function exportFraisCsv() {
  const { header, rows } = deplacementStringMatrix();
  const esc = v => `"${String(v).replace(/"/g, '""')}"`;
  const content = '﻿' + [header, ...rows].map(r => r.map(esc).join(';')).join('\r\n');
  downloadBlob(content, 'text/csv;charset=utf-8', 'csv');
}

function exportFraisXls() {
  const { header, rows } = deplacementStringMatrix();
  const th = header.map(h => `<th>${escapeHtml(h)}</th>`).join('');
  const trs = rows.map(r => `<tr>${r.map(c => `<td>${escapeHtml(c)}</td>`).join('')}</tr>`).join('');
  const html = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel"><head><meta charset="utf-8"></head><body><table border="1"><thead><tr>${th}</tr></thead><tbody>${trs}</tbody></table></body></html>`;
  downloadBlob('﻿' + html, 'application/vnd.ms-excel', 'xls');
}

/* ODF plat (.fods) : ouvert nativement par LibreOffice Calc. Colonnes km/taux/
   total typées numériques (sommables), le reste en texte. */
function exportFraisOds() {
  const NS = 'urn:oasis:names:tc:opendocument:xmlns:';
  const cellStr = v => `<table:table-cell office:value-type="string"><text:p>${escapeHtml(v)}</text:p></table:table-cell>`;
  const cellNum = (n, dec) => `<table:table-cell office:value-type="float" office:value="${Number(n) || 0}"><text:p>${escapeHtml((Number(n) || 0).toLocaleString('fr-FR', { minimumFractionDigits: dec, maximumFractionDigits: dec }))}</text:p></table:table-cell>`;
  const cellInt = n => `<table:table-cell office:value-type="float" office:value="${Number(n) || 0}"><text:p>${Number(n) || 0}</text:p></table:table-cell>`;
  const header = ['Date', 'Lieu', 'Conducteur', 'Classe', 'UE', 'Mots-clés', 'Km A/R', 'Taux (€/km)', 'Total (€)', 'Statut', 'Origine'];
  const headRow = `<table:table-row>${header.map(cellStr).join('')}</table:table-row>`;
  const list = [...(state.deplacements || [])].sort((a, b) => (a.date || '').localeCompare(b.date || ''));
  const bodyRows = list.map(d => {
    return `<table:table-row>${[
      cellStr(d.date ? formatDateFr(d.date) : ''),
      cellStr(d.lieu || ''),
      cellStr(d.conducteur || ''),
      cellStr(d.classe || ''),
      cellStr(d.ue || ''),
      cellStr(d.keywords || ''),
      cellInt(d.kmAR),
      cellNum(deplacementTaux(d), 2),
      cellNum(deplacementTotal(d), 2),
      cellStr(d.statut || ''),
      cellStr(deplacementOrigin(d))
    ].join('')}</table:table-row>`;
  }).join('');
  const total = list.reduce((s, d) => s + deplacementTotal(d), 0);
  const totalRow = `<table:table-row>${[cellStr(''), cellStr(''), cellStr(''), cellStr(''), cellStr(''), cellStr(''), cellStr(''), cellStr('TOTAL'), cellNum(total, 2), cellStr(''), cellStr('')].join('')}</table:table-row>`;
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<office:document xmlns:office="${NS}office:1.0" xmlns:table="${NS}table:1.0" xmlns:text="${NS}text:1.0" office:version="1.3" office:mimetype="application/vnd.oasis.opendocument.spreadsheet"><office:body><office:spreadsheet><table:table table:name="Frais de déplacement">${headRow}${bodyRows}${totalRow}</table:table></office:spreadsheet></office:body></office:document>`;
  downloadBlob(xml, 'application/vnd.oasis.opendocument.spreadsheet', 'fods');
}

async function importDataFromFile(file) {
  if (!file) return;
  let parsed;
  try {
    parsed = JSON.parse(await file.text());
  } catch (e) {
    window.alert('Fichier illisible : ce n’est pas un export JSON valide.');
    return;
  }
  // Contrôle minimal de cohérence : on attend la structure d'un export du portail.
  const looksValid = parsed && typeof parsed === 'object'
    && ['ues', 'sequences', 'sessions'].some(k => Array.isArray(parsed[k]));
  if (!looksValid) {
    window.alert('Ce fichier ne ressemble pas à un export du portail (UE, séquences ou séances introuvables).');
    return;
  }
  // Étape 4 — garde-fou renforcé : depuis le passage à Supabase (js/sync.js),
  // un import ne remplace plus un simple fichier local mais LA base partagée,
  // visible de tous les enseignants actifs. Afficher les deux comptages
  // (en ligne vs fichier importé) aide à repérer un fichier périmé avant
  // de valider, plutôt qu'après coup.
  const compter = (d) => `${(d?.ues || []).length} UE, ${(d?.sequences || []).length} séquences, ${(d?.sessions || []).length} séances`;
  const actuel = compter(state);
  const importe = compter(parsed);
  if (!window.confirm(
    `Importer ce fichier (${importe}) ?\n\n` +
    `Actuellement enregistré EN LIGNE (Supabase, partagé) : ${actuel}.\n\n` +
    `Cela REMPLACERA les données en ligne — visibles de tous les enseignants actifs, pas seulement sur cet ordinateur. Exportez d’abord une sauvegarde si vous n’êtes pas sûr·e du fichier.`
  )) return;
  // Étape 8 — verrouillage : un import remplace les données de TOUT LE MONDE,
  // un simple OK est trop facile à valider par réflexe (double-clic, geste
  // habituel). On exige de retaper un mot pour confirmer une seconde fois.
  const saisie = window.prompt('Pour confirmer le remplacement des données en ligne, tapez REMPLACER :');
  if ((saisie || '').trim().toUpperCase() !== 'REMPLACER') {
    setSaveStatus('Import annulé');
    return;
  }
  state = normalizeData(parsed);
  if (!state.weeks.length) bootstrapWeeks();
  selectedWeek = state.weeks.find(w => w.id === selectedWeek)?.id || state.weeks[0]?.id || selectedWeek;
  hydrateSelectors();
  try {
    // forcer: true — un import promet de REMPLACER les données en ligne (cf.
    // confirm() ci-dessus). Sans ce drapeau, une entité dont l'empreinte
    // coïncide avec le snapshot en mémoire est sautée à l'écriture — y
    // compris si elle a été supprimée de la base entre-temps (SQL Editor,
    // autre session) sans rechargement de page. Un import doit réécrire
    // inconditionnellement, pour garantir que chaque UE référencée par une
    // séquence existe réellement avant l'écriture des séquences (sinon :
    // violation de clé étrangère "oc_sequences_ue_id_fkey" et assimilées).
    await saveData('Données importées', { forcer: true });
  } catch (e) {
    setSaveStatus('Import affiché, mais erreur d’enregistrement');
  }
  renderAll();
}


function bootstrapWeeks() {
  state.weeks = buildRollingWeeks();
  state.schoolYear = anneeScolaireLabel(state.weeks);
}

// Retours 17/08/2026 — remplace l'ancienne fenêtre fixe (S36→S22, années en
// dur) : une fenêtre glissante centrée sur aujourd'hui, recalculée à chaque
// chargement (voir normalizeData). L'app reste utilisable toute l'année,
// vacances comprises, sans plus jamais avoir à mettre les bornes à jour.
function buildRollingWeeks(centre = new Date(), avantSemaines = 26, apresSemaines = 26) {
  const debut = addDays(centre, -avantSemaines * 7);
  const fin = addDays(centre, apresSemaines * 7);
  const { year: anDebut, week: semDebut } = isoWeekInfo(debut);
  const { year: anFin, week: semFin } = isoWeekInfo(fin);
  return buildAcademicWeeks(anDebut, semDebut, anFin, semFin);
}
function anneeScolaireLabel(weeks) {
  if (!weeks.length) return '';
  const premiere = weeks[0].isoYear, derniere = weeks[weeks.length - 1].isoYear;
  return premiere === derniere ? String(premiere) : `${premiere}-${derniere}`;
}

function buildAcademicWeeks(startIsoYear, startWeek, endIsoYear, endWeek) {
  const weeks = [];
  let cursor = isoWeekStart(startIsoYear, startWeek);
  const end = isoWeekStart(endIsoYear, endWeek);
  while (cursor <= end) {
    const { year, week } = isoWeekInfo(cursor);
    const friday = addDays(cursor, 4);
    weeks.push({
      id: `${year}-S${String(week).padStart(2, '0')}`,
      label: `S${String(week).padStart(2, '0')}`,
      weekNumber: week,
      isoYear: year,
      dateRange: `${formatDateShort(cursor)} – ${formatDateShort(friday)}`
    });
    cursor = addDays(cursor, 7);
  }
  return weeks;
}

function isoWeekStart(year, week) {
  const jan4 = new Date(year, 0, 4);
  const day = jan4.getDay() || 7;
  const mondayWeek1 = addDays(jan4, 1 - day);
  return addDays(mondayWeek1, (week - 1) * 7);
}

function isoWeekInfo(date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const day = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const week = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
  return { year: d.getUTCFullYear(), week };
}

function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

/* Lot 4 — identifiant (même format que state.weeks[].id) de la semaine ISO du
   jour, pour ouvrir le Planning hebdo et cadrer la frise dessus par défaut. */
function currentWeekId() {
  const { year, week } = isoWeekInfo(new Date());
  return `${year}-S${String(week).padStart(2, '0')}`;
}

function formatDateShort(date) {
  return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function hydrateSelectors() {
  const promoOptions = state.promotions.map(p => `<option value="${escapeAttr(p)}">${escapeHtml(p)}</option>`).join('');
  const semesterOptions = SEMESTERS.map(s => `<option value="${escapeAttr(s)}">${escapeHtml(s)}</option>`).join('');
  const weekOptions = state.weeks.map(w => `<option value="${escapeAttr(w.id)}">${escapeHtml(w.label)} · ${escapeHtml(w.dateRange)}</option>`).join('');
  // Lot T(b) — menu « Semaine » de la modale séance : n° seul (S37, S38…) sans les dates.
  const weekOptionsShort = state.weeks.map(w => `<option value="${escapeAttr(w.id)}">${escapeHtml(w.label)}</option>`).join('');

  setOptions('#weekSelect', weekOptions, selectedWeek);
  setOptions('#sessionWeek', weekOptionsShort, selectedWeek);
  setOptions('#ueStartWeek', `<option value="">À préciser</option>${weekOptions}`, $('#ueStartWeek')?.value || '');
  setOptions('#ueEndWeek', `<option value="">À préciser</option>${weekOptions}`, $('#ueEndWeek')?.value || '');

  setOptions('#uePromotion', promoOptions, state.promotions[0] || 'GPN1');
  setOptions('#ueSemester', semesterOptions, 'Semestre 1');
  setOptions('#sequencePromotion', promoOptions, state.promotions[0] || 'GPN1');
  setOptions('#sequenceSemester', semesterOptions, 'Semestre 1');
  setOptions('#sessionPromotion', promoOptions, state.promotions[0] || 'GPN1');
  setOptions('#sessionDay', DAY_NAMES.map((d, i) => `<option value="${i}">${d}</option>`).join(''), '0');
  setOptions('#sessionStart', SLOTS.map((s, i) => i === 4 ? '' : `<option value="${i}">${s}</option>`).join(''), '0');
  setOptions('#sessionEnd', SLOTS.map((s, i) => i === 4 ? '' : `<option value="${i}">${s}</option>`).join(''), '0');
  renderConstraintPromotionChoices();
  refreshUeSelects();
  refreshSessionSequenceSelect();
}

function setOptions(selector, html, value) {
  const el = $(selector);
  if (!el) return;
  const previous = value ?? el.value;
  if (!('options' in el)) {
    el.value = previous || '';
    return;
  }
  el.innerHTML = html;
  if ([...el.options].some(o => o.value === previous)) el.value = previous;
}

/* Lot D [17] — les 4 semestres rangés en 2 binômes de promotion. GPN1 fait sa
   première année sur S1 puis S2, GPN2 sa deuxième sur S3 puis S4 : la promotion
   se lit donc dans le semestre coché, d'où la suppression du filtre « Promotion »
   qui en était le doublon. Le mapping vient de semesterPair(), qui portait déjà
   cette paire pour les UE à cheval sur deux semestres. */
const SEMESTER_PAIRS = [
  { promotion: 'GPN1', semesters: semesterPair('Semestre 1') },
  { promotion: 'GPN2', semesters: semesterPair('Semestre 3') }
];

/* Lot D [16] — le binôme de semestres de la saison où l'on consulte l'app :
   septembre-décembre, ce sont les deux premiers semestres de chaque promo
   (S1 + S3) ; le reste de l'année, les deux seconds (S2 + S4).
   On interroge d'abord les VRAIES semaines (weeksForSemester connaît les bornes
   de l'année scolaire en cours) ; le repli sur le mois ne sert qu'en dehors,
   l'été, où août compte déjà pour la rentrée qu'on prépare. */
function semestresDeLaSaison() {
  const semaineDuJour = currentWeekId();
  const dansLaSaison = sem => weeksForSemester(sem).some(w => w.id === semaineDuJour);
  if (dansLaSaison('Semestre 1') || dansLaSaison('Semestre 3')) return ['Semestre 1', 'Semestre 3'];
  if (dansLaSaison('Semestre 2') || dansLaSaison('Semestre 4')) return ['Semestre 2', 'Semestre 4'];
  const mois = new Date().getMonth() + 1;
  return mois >= 8 ? ['Semestre 1', 'Semestre 3'] : ['Semestre 2', 'Semestre 4'];
}

function renderGanttTopBar() {
  $$('#ganttPromoSwitch .promo-switch-btn').forEach(btn => btn.classList.toggle('active', btn.dataset.ganttPromo === ganttPromo));
  const pair = SEMESTER_PAIRS.find(p => p.promotion === ganttPromo) || SEMESTER_PAIRS[0];
  const semContainer = $('#ganttSemesterSwitch');
  if (semContainer) {
    semContainer.innerHTML = pair.semesters.map(sem => `<button type="button" class="promo-switch-btn${sem === ganttSemester ? ' active' : ''}" data-gantt-semester="${escapeAttr(sem)}">${escapeHtml(sem)}</button>`).join('');
  }
  const weeks = weeksForSemester(ganttSemester);
  const range = $('#ganttWeekRange');
  if (range) range.textContent = weeks.length ? `${weeks[0].label.replace('S0', 'S')} → ${weeks[weeks.length - 1].label.replace('S0', 'S')}` : '';
}

function renderConstraintPromotionChoices(selectedPromotions = state?.promotions || DEFAULT_PROMOTIONS) {
  const container = $('#constraintPromotionChoices');
  if (!container || !state) return;
  const selected = new Set(selectedPromotions && selectedPromotions.length ? selectedPromotions : state.promotions);
  container.innerHTML = state.promotions.map(p => `<label class="checkbox-chip"><input type="checkbox" value="${escapeAttr(p)}" ${selected.has(p) ? 'checked' : ''}><span>${escapeHtml(p)}</span></label>`).join('');
}

function refreshUeSelects() {
  const options = state.ues.length
    ? state.ues.map(ue => `<option value="${escapeAttr(ue.id)}">${escapeHtml(ue.code)} · ${escapeHtml(ue.title)} · ${escapeHtml(ue.promotion)} · ${escapeHtml(ue.semester)}</option>`).join('')
    : '<option value="">Aucune UE créée</option>';
  setOptions('#sequenceUe', options, $('#sequenceUe')?.value);
  setOptions('#sessionUe', options, $('#sessionUe')?.value);
  refreshWeekBacklogUeFilter();
}

function refreshWeekBacklogUeFilter() {
  const select = $('#weekBacklogUeFilter');
  if (!select || !state) return;
  const options = ['<option value="Tous">Toutes les UE</option>'].concat(
    state.ues.map(ue => `<option value="${escapeAttr(ue.id)}">${escapeHtml(ue.code)} · ${escapeHtml(ue.title)}</option>`)
  ).join('');
  setOptions('#weekBacklogUeFilter', options, weekBacklogUeFilter);
  if (![...select.options].some(o => o.value === weekBacklogUeFilter)) weekBacklogUeFilter = 'Tous';
}


function teacherTokens(value = '') {
  return String(value || '').split(/[;,/]/).map(x => x.trim()).filter(Boolean);
}

function allTeachers() {
  const set = new Set();
  state?.ues?.forEach(ue => teacherTokens(ue.teacher).forEach(t => set.add(t)));
  state?.sequences?.forEach(seq => teacherTokens(seq.teacher).forEach(t => set.add(t)));
  state?.sessions?.forEach(session => teacherTokens(session.teacher).forEach(t => set.add(t)));
  state?.weekTemplates?.forEach(slot => teacherTokens(slot.teacher).forEach(t => set.add(t)));
  return [...set].sort((a, b) => a.localeCompare(b, 'fr'));
}


/* Référentiel & Ruban → Créneaux type : par défaut, seuls MES créneaux
   s'affichent (comme pour les ue/séquences/séances, un créneau sans
   enseignant assigné reste visible de tous). Sélecteur pour voir "Tous" ou
   ceux d'un collègue précis. */
function refreshCreneauxTeacherFilter() {
  const select = $('#creneauxTeacherFilter');
  if (!select) return;
  if (!creneauxTeacherFilter) creneauxTeacherFilter = moiInitiales || 'Tous';
  const autres = allTeachers().filter(t => t.toLowerCase() !== moiInitiales.toLowerCase());
  const options = [
    moiInitiales ? `<option value="${escapeAttr(moiInitiales)}">Mes créneaux (${escapeHtml(moiInitiales)})</option>` : '',
    '<option value="Tous">Tous les enseignants</option>',
    ...autres.map(t => `<option value="${escapeAttr(t)}">${escapeHtml(t)}</option>`)
  ].filter(Boolean).join('');
  setOptions('#creneauxTeacherFilter', options, creneauxTeacherFilter);
  if (![...select.options].some(o => o.value === creneauxTeacherFilter)) creneauxTeacherFilter = 'Tous';
}

function matchesCreneauxTeacherFilter(slot) {
  if (creneauxTeacherFilter === 'Tous') return true;
  const tokens = teacherTokens(slot?.teacher);
  if (!tokens.length) return true;
  return tokens.some(t => t.toLowerCase() === (creneauxTeacherFilter || '').toLowerCase());
}

/* Périmètre strictement personnel (distinct du filtre manuel ci-dessus, propre
   aux Créneaux types) : l'entité me concerne-t-elle DIRECTEMENT (mes initiales dans
   `teacher`) ? Sert au Tableau de bord, dont les encarts personnels (séances
   à placer, à faire, frais, réunions) restent strictement les miens. Une
   entité sans enseignant assigné (teacher vide) est comptée comme mienne :
   rien à exclure tant que personne ne se l'est appropriée.
   Référentiel/Planning/Gantt/Semaine restent volontairement non filtrés par
   enseignant (tout le monde y voit tout) — l'ancien filtre de visibilité par
   UE (grisé + bouton « Visibilité ») a été retiré à la demande de l'enseignant. */
function estVisiblePourMoi(entity) {
  if (!moiInitiales) return true;
  const tokens = teacherTokens(entity?.teacher).map(teacherInitialsOf).filter(Boolean);
  if (!tokens.length) return true;
  return tokens.includes(moiInitiales);
}

// Périmètre strictement personnel (Tableau de bord, backlog de placement).
function visibleUes() { return state.ues.filter(estVisiblePourMoi); }
function visibleSequences() { return state.sequences.filter(estVisiblePourMoi); }
function visibleSessions() { return state.sessions.filter(estVisiblePourMoi); }

/* Retours #3 (18-19/08/2026) — 3 cas de visibilité entre comptes enseignants,
   distincts du périmètre « strictement personnel » ci-dessus (propre au
   Tableau de bord). Portée : tuiles séquence/séance (Conception pédagogique,
   Progression, Planning hebdo, Dossier). Le Référentiel/Ruban reste la vue de
   référence, toujours non filtrée (cf. commentaire sur estVisiblePourMoi).
   Cas 1 — je ne suis PAS enseignant de l'UE : aucun contenu de séquence/séance
     ne m'est montré, seuls les affichages génériques (l'UE elle-même) restent.
   Cas 2 — je SUIS enseignant de l'UE, mais pas sur CETTE séquence/séance
     précise (collègues seuls) : tuile visible, en style atténué, non ouvrable.
   Cas 3 — je SUIS enseignant de l'UE ET sur cette séquence/séance : normal,
     entièrement interactif (comportement déjà existant, inchangé). */
function jeSuisEnseignantDeLUe(ue) {
  if (!moiInitiales || !ue) return true;
  const enseignants = enseignantsDeLUe(ue);
  // Même convention que estVisiblePourMoi : une UE sans AUCUN enseignant
  // déclaré (fréquent tant que la Répartition n'a pas été remplie, cf.
  // ruban-pedagogique.js livré vide) n'est le Cas 1 de personne — elle reste
  // visible de tous, faute de savoir à qui l'exclure.
  if (!enseignants.length) return true;
  return enseignants.includes(moiInitiales);
}
// Cas 2 vs Cas 3, une fois établi que le contenu est au moins visible (Cas ≥ 2).
function contenuInteractifPourMoi(entity) {
  return estVisiblePourMoi(entity);
}

function refreshSessionSequenceSelect(preferredValue = '') {
  const ueId = $('#sessionUe')?.value || '';
  const uePromo = findUe(ueId)?.promotion || '';
  const sequences = state.sequences.filter(seq => !ueId || seq.ueId === ueId);
  const options = ['<option value="">Aucune séquence rattachée</option>'].concat(
    sequences.map(seq => `<option value="${escapeAttr(seq.id)}">${escapeHtml(seq.title)} · ${escapeHtml(ueLabel(seq.ueId))}</option>`)
  );
  // Lot K — rattacher la séance à une SEMAINE THÉMATIQUE (EIL) plutôt qu'à une
  // séquence : la séance devient un « détail » de la contrainte thématique.
  // Valeur préfixée « eil: ». Filtré sur la promo de l'UE choisie.
  const thematic = (state.constraints || []).filter(c => isThematicConstraint(c)
    && (!uePromo || !Array.isArray(c.promotions) || !c.promotions.length || c.promotions.includes(uePromo)));
  if (thematic.length) {
    options.push(`<optgroup label="— Semaine thématique / EIL —">${thematic.map(c => `<option value="eil:${escapeAttr(c.id)}">${escapeHtml(c.label)}${(c.promotions || []).length ? ' · ' + escapeHtml(c.promotions.join('/')) : ''}</option>`).join('')}</optgroup>`);
  }
  setOptions('#sessionSequence', options.join(''), preferredValue || $('#sessionSequence')?.value || '');
}

function renderAll(resetSelectors = true) {
  // Mémoriser la position de défilement de la page : un enregistrement re-rend
  // tout le portail, ce qui sinon ramène brutalement la vue en haut.
  const scrollY = window.scrollY;
  if (resetSelectors) hydrateSelectors();
  const yearEl = $('#bannerYear');
  if (yearEl) yearEl.textContent = state.schoolYear || '';
  renderDashboard();
  renderDesign();
  renderGantt();
  renderPlanning();
  if ($('#refreadToc')) renderReference();
  if ($('#rubanGrid')) renderRuban();
  if ($('#creneauxGrids') && rubanTab === 'creneaux') renderCreneaux();
  if ($('#studentPlanningGrid') && rubanTab === 'etudiant') renderStudentPlanning();
  if ($('#dossierUeSelect')) renderDossier();
  if (missionViewTarget) renderMissionView();
  if ($('#fraisTableWrap')) renderFrais();
  if ($('#materielEmpruntsList')) renderMaterielEmprunts();
  if ($('#materielCatalogueList')) renderMaterielCatalogue();
  if ($('#reunionsList')) renderReunions();
  if ($('#mobileAccueil')) renderMobileAccueil();
  if ($('#mobileAValider')) renderMobileAValider();
  if ($('#mobileFaites')) renderMobileFaites();
  if ($('#mobileSemaine')) renderMobileSemaine();
  if (mobileSeanceTarget) renderMobileSeance();
  if ($('#mobileFrais')) renderMobileFrais();
  if ($('#mobileMission')) renderMobileMission();
  if ($('#mobileMateriel')) renderMobileMateriel();
  // Restaurer après le re-rendu (le DOM a la même hauteur, la position est conservée).
  window.scrollTo({ top: scrollY });
}

/* Préserve l'état ouvert/fermé des <details data-open-key> à travers un
   re-render qui réécrit innerHTML. captureOpenKeys renvoie null si le
   conteneur était vide (premier rendu) : restoreOpenKeys consulte alors la
   mémoire inter-session (Lot 6) plutôt que de tout refermer, et laisse la
   valeur par défaut du gabarit pour toute clé jamais rencontrée. */
function captureOpenKeys(root) {
  if (!root || !root.querySelector('details[data-open-key]')) return null;
  return new Set(Array.from(root.querySelectorAll('details[data-open-key][open]'), d => d.dataset.openKey));
}
function restoreOpenKeys(root, keys) {
  if (!root) return;
  root.querySelectorAll('details[data-open-key]').forEach(d => {
    if (keys) { d.open = keys.has(d.dataset.openKey); return; }
    const key = d.dataset.openKey;
    if (key in openState) d.open = openState[key];
  });
}

/* Lot 6 — mémoire inter-session (localStorage) de ce qui est ouvert/fermé :
   les 5 encarts du Tableau de bord (jamais recréés, donc jamais concernés par
   captureOpenKeys) et les branches de la Conception pédagogique / Référentiel
   / séances à placer (recréées à chaque rendu). Un simple objet clé -> bool,
   pour distinguer "jamais ouvert/fermé" (absent, garde le défaut du gabarit)
   de "explicitement refermé" (présent à false). */
const OC_OPEN_STATE_KEY = 'oc_openState_v1';
let openState = (() => {
  try { return JSON.parse(localStorage.getItem(OC_OPEN_STATE_KEY)) || {}; }
  catch { return {}; }
})();
function saveOpenState() {
  try { localStorage.setItem(OC_OPEN_STATE_KEY, JSON.stringify(openState)); } catch {}
}
// Capture en phase de capture (et non de bulle) : robuste même sur les
// navigateurs où l'évènement "toggle" d'un <details> ne remonte pas.
document.addEventListener('toggle', (event) => {
  const d = event.target;
  if (!(d instanceof HTMLDetailsElement) || !d.dataset.openKey) return;
  openState[d.dataset.openKey] = d.open;
  saveOpenState();
}, true);

/* Lot 8 — la tuile de séance (.session-card) n'a plus de bouton « Modifier »
   en pied : Entrée/Espace au clavier déclenchent le même clic délégué que la
   souris (data-edit-session, géré par conteneur dans bindEvents). */
document.addEventListener('keydown', (event) => {
  if (event.key !== 'Enter' && event.key !== ' ') return;
  const card = event.target.closest('.session-card');
  if (!card) return;
  event.preventDefault();
  card.click();
});

/* Purge les clés qui ne référencent plus une UE/séquence existante, pour que
   la mémoire ne grossisse pas indéfiniment au fil des suppressions. */
function pruneOpenState() {
  const ueIds = new Set(state.ues.map(u => u.id));
  const seqIds = new Set(state.sequences.map(s => s.id));
  let changed = false;
  Object.keys(openState).forEach(key => {
    const [kind, a, b] = key.split(':');
    let stale = false;
    if (kind === 'ue') stale = !ueIds.has(a);
    else if (kind === 'seq') stale = !seqIds.has(a);
    else if (kind === 'wbUe') stale = !ueIds.has(a);
    else if (kind === 'wbSeq') stale = !seqIds.has(b);
    if (stale) { delete openState[key]; changed = true; }
  });
  if (changed) saveOpenState();
}

/* ================================================================
   TABLEAU DE BORD — zone hebdomadaire
   Structure arrêtée en revue (audit en 8 tours) : « Ma semaine »
   jour par jour, puis « Prochainement » semaine par semaine, puis les
   encarts de travail, puis le mensuel replié.
   Code couleur retenu (variante N) : LA COULEUR DIT QUAND.
   Rouge = en retard ou urgent · ambre = dans la quinzaine ·
   gris = plus tard. Deux exceptions demandées en revue :
   une réservation passe au rouge dès 15 jours, et une séance sans
   créneau dans la semaine en cours est rouge d'emblée.
   ================================================================ */

const DASH_SEMAINES = 2;        // « Les deux semaines suivantes » (REGLES.md — un seul écran, pas de pagination)
const FRAIS_RETARD_JOURS = 45;  // les frais partent au mois : pas d'alerte avant

// Lot B [1] (retours/ 17/08/2026) — navigation semaine par semaine du bloc
// « Ma semaine », indépendante de « Les deux semaines suivantes » (qui reste
// ancré sur la semaine réelle). Décalage en nombre de semaines par rapport à
// currentWeekId() ; remis à 0 au rechargement, pas persisté.
let dashSemaineOffset = 0;
function dashSemaineIdCourante() {
  const i = state.weeks.findIndex(w => w.id === currentWeekId());
  if (i < 0) return currentWeekId();
  const idx = Math.min(Math.max(i + dashSemaineOffset, 0), state.weeks.length - 1);
  return state.weeks[idx]?.id || currentWeekId();
}

const DASH_JOURS_COURTS = ['lun.', 'mar.', 'mer.', 'jeu.', 'ven.', 'sam.', 'dim.'];
const DASH_JOURS_LONGS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'];

function dashAujourdhui() { const d = new Date(); d.setHours(0, 0, 0, 0); return d; }
function dashJoursEntre(date) {
  if (!date) return null;
  const d = new Date(date); d.setHours(0, 0, 0, 0);
  return Math.round((d - dashAujourdhui()) / 86400000);
}
function dashDelaiCourt(j) {
  if (j === null) return '';
  if (j < 0) return `il y a ${-j} j`;
  if (j === 0) return "aujourd'hui";
  if (j === 1) return 'demain';
  return `dans ${j} j`;
}
function dashJJMM(d) { return d ? `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}` : ''; }
function dashSemaineDe(date) {
  if (!date) return null;
  const { year, week } = isoWeekInfo(date);
  return `${year}-S${String(week).padStart(2, '0')}`;
}
function dashSemaineObjet(id) { return state.weeks.find(w => w.id === id) || null; }
function dashDatesSemaine(id) { const w = dashSemaineObjet(id); return w ? w.dateRange.replace(/\/\d{4}/g, '') : ''; }
// Ajustements #2 [B2.1] (18/08/2026) — « les deux semaines suivantes » suit
// désormais la semaine affichée dans « Ma semaine » (dashSemaineIdCourante,
// pilotée par dashSemaineOffset), plus la semaine réelle fixe : les 3 blocs
// forment ensemble une fenêtre glissante de 3 semaines.
function dashSemainesApres(n) {
  const i = state.weeks.findIndex(w => w.id === dashSemaineIdCourante());
  if (i < 0) return [];
  return state.weeks.slice(i + 1, i + 1 + n).map(w => w.id);
}
function dashHoraire(s) {
  if (s.customStart && s.customEnd) return `${s.customStart}–${s.customEnd}`;
  const debut = (SLOTS[Number(s.startSlot)] || '').split('–')[0].trim();
  const fin = (SLOTS[Number(s.endSlot)] || '').split('–')[1] || '';
  return debut && fin ? `${debut}–${fin.trim()}` : debut;
}
/* Date réelle d'une séance posée dans l'emploi du temps. */
function dashDateDeSeance(s) {
  const w = dashSemaineObjet(s.weekId);
  if (!w || !isDefinitiveSession(s)) return null;
  return dayDatesForWeek(w)[Number(s.day) || 0] || null;
}

/* Ce qui fait qu'une séance demande une action, ET ce qui a déjà été fait
   (`fait: true`, retours 17/08/2026 — sinon une réservation/mission traitée
   redevient invisible d'un coup, sans confirmation visuelle sur la carte).
   `date` sert à décider si une réservation encore à faire est devenue
   urgente (moins de ROOM_ALERT_DAYS jours). */
function dashActionsDeSeance(s, date) {
  const out = [];
  const j = dashJoursEntre(date);
  if (isFictiveSession(s)) out.push({ cle: 'placer', texte: 'À placer' });
  const salle = sessionRoomToBook(s);
  if (salle) {
    out.push(s.roomBooked
      ? { cle: 'salle', texte: `${ROOM_TO_BOOK_LABELS[salle] || 'Salle'} réservée`, fait: true }
      : { cle: 'salle', texte: `${ROOM_TO_BOOK_LABELS[salle] || 'Salle'} à réserver`, urgent: j !== null && j <= ROOM_ALERT_DAYS });
  }
  // Lot B — les deux étiquettes du déplacement. Un véhicule de l'établissement
  // se réserve (même urgence qu'une salle) ; un véhicule personnel demande un
  // ordre de mission AVANT le départ — c'est donc aussi une échéance.
  if (s.deplacement === 'etablissement') {
    out.push(s.vehicleBooked
      ? { cle: 'vehicule', texte: 'Véhicule réservé', fait: true }
      : { cle: 'vehicule', texte: 'Véhicule à réserver', urgent: j !== null && j <= ROOM_ALERT_DAYS });
  }
  if (s.deplacement === 'personnel') {
    out.push(s.ordreMission
      ? { cle: 'mission', texte: 'Ordre de mission envoyé', fait: true }
      : { cle: 'mission', texte: 'Ordre de mission', urgent: j !== null && j <= ROOM_ALERT_DAYS });
  }
  // Retours #3 (18-19/08/2026) — même mécanique que salle/véhicule ci-dessus.
  if (s.materielAReserver) {
    out.push(s.materielReserve
      ? { cle: 'materiel', texte: 'Matériel réservé', fait: true }
      : { cle: 'materiel', texte: 'Matériel à réserver', urgent: j !== null && j <= ROOM_ALERT_DAYS });
  }
  if (!s.sequenceId || !s.ueId) out.push({ cle: 'rattacher', texte: 'À rattacher' });
  return out;
}

function dashEtiquettes(actions) {
  return actions.map(a => `<span class="act act-${a.cle}${a.urgent ? ' act-urgent' : ''}${a.fait ? ' act-fait' : ''}">${escapeHtml(a.texte)}</span>`).join('');
}

/* Le retard : ce qui aurait dû être fait. Les frais de déplacement n'y entrent
   qu'au-delà de FRAIS_RETARD_JOURS — ils partent à l'administration une fois
   par mois, les afficher en rouge tout de suite n'aurait aucun sens. */
function dashRetards() {
  const out = [];
  (state.deplacements || []).filter(d => d.statut !== 'Terminée').forEach(d => {
    const j = dashJoursEntre(parseIsoDate(d.date));
    if (j === null || j > -FRAIS_RETARD_JOURS) return;
    out.push({
      titre: 'Frais de déplacement qui traînent',
      detail: `${d.lieu || 'lieu à préciser'} · ${fmtEuro(deplacementTotal(d))}`,
      delai: dashDelaiCourt(j), cible: 'dash:frais'
    });
  });
  visibleSessions().filter(isFictiveSession).forEach(s => {
    const w = dashSemaineObjet(s.targetWeekId || s.weekId);
    if (!w || w.id === currentWeekId()) return; // déjà montrée dans « sans créneau »
    const j = dashJoursEntre(dayDatesForWeek(w)[0]);
    if (j === null || j >= 0) return;
    out.push({ titre: 'Séance encore à placer', detail: `${s.title} · ${w.label}`, delai: dashDelaiCourt(j), cible: 'dash:backlog' });
  });
  return out;
}

function dashBandeauRetard() {
  const r = dashRetards();
  if (!r.length) return '';
  return `<div class="retard-bandeau">
    <span class="retard-titre">${r.length} en retard</span>
    <ul class="retard-liste">${r.map(x => `<li data-ouvrir="${escapeAttr(x.cible)}" tabindex="0" role="button">
      <span class="retard-quand">${escapeHtml(x.delai)}</span>
      <strong>${escapeHtml(x.titre)}</strong>
      <span class="retard-detail">${escapeHtml(x.detail)}</span></li>`).join('')}</ul>
  </div>`;
}

/* Contenu de la semaine en cours : les 5 jours + ce qui n'a pas de créneau. */
function dashContenuSemaine(semaineId) {
  const w = dashSemaineObjet(semaineId);
  if (!w) return null;
  const dates = dayDatesForWeek(w);
  const cleJour = isoKey(dashAujourdhui());
  const seances = visibleSessions().filter(s => isDefinitiveSession(s) && s.weekId === semaineId);
  const reunions = (state.reunions || []).filter(r => dashSemaineDe(parseIsoDate(r.date)) === semaineId);

  const jours = [0, 1, 2, 3, 4].map(i => {
    const date = dates[i];
    const cle = date ? isoKey(date) : '';
    return {
      nomLong: DASH_JOURS_LONGS[i], date, jjmm: dashJJMM(date),
      estAujourdhui: cle === cleJour, estPasse: !!cle && cle < cleJour,
      seances: seances.filter(s => Number(s.day) === i).sort((a, b) => Number(a.startSlot) - Number(b.startSlot)),
      reunions: reunions.filter(r => isoKey(parseIsoDate(r.date)) === cle),
      periodes: date ? constraintsForDate(date) : []
    };
  });
  const aPlacer = visibleSessions().filter(s => isFictiveSession(s) && (s.targetWeekId || s.weekId) === semaineId);
  return { semaine: w, jours, aPlacer, nbSeances: seances.length, nbReunions: reunions.length };
}

/* ---- Ligne 1 : « Ma semaine », un jour par colonne ---- */
// Ajustements #2 [B2.2] (18/08/2026) — `reduit` : version abrégée (heure +
// titre seulement) pour « les deux semaines suivantes », SAUF si la séance a
// une action réelle en attente (réservation, matériel, déplacement…) — dans
// ce cas elle garde l'affichage complet, quitte à être moins compacte, pour
// que l'urgence reste visible là où elle doit l'être.
// Ajustements #5 (22/08/2026) : la promo d'une séance était un simple mot dans
// la ligne meta (« GPN1 ») — remplacée par une pastille colorée reprenant le
// code couleur du SEMESTRE en cours pour cette promo (S1 bleu/S2 ambre/S3
// rouge/S4 vert, déjà utilisé pour teinter le bandeau Planning hebdo — voir
// applyScheduleTitleColors), pour repérer la promo d'un coup d'œil.
function promoPillMarkup(s) {
  if (!s.promotion) return '';
  const w = s.weekId ? dashSemaineObjet(s.weekId) : null;
  const semester = w ? semesterForPromoPeriod(s.promotion, periodOfWeek(w)) : null;
  const hex = semester ? semesterColorOf(semester) : null;
  if (!hex) return `<span class="carte-promo-pill">${escapeHtml(s.promotion)}</span>`;
  return `<span class="carte-promo-pill" style="background:${hexToRgba(hex, .2)};color:${deepColor(hex)}">${escapeHtml(s.promotion)}</span>`;
}

function dashCarteSeance(s, date, compact) {
  const actions = dashActionsDeSeance(s, date);
  const aTraiter = actions.some(a => !a.fait);
  const urgent = actions.some(a => a.urgent);
  const reduit = compact && !aTraiter;
  if (reduit) {
    return `<li class="carte carte-reduite" data-edit-session="${escapeAttr(s.id)}" tabindex="0" role="button">
      <span class="carte-heure">${escapeHtml(dashHoraire(s) || '—')}</span>
      <span class="carte-titre">${escapeHtml(s.title)}</span>
    </li>`;
  }
  const meta = [ueCodeOnly(s.ueId) !== 'UE ?' ? 'UE ' + ueCodeOnly(s.ueId) : 'sans UE', s.demiGroupe ? '½' + s.demiGroupe : '']
    .filter(Boolean).join(' · ');
  const teachers = teacherPillsMarkup(s.teacher);
  return `<li class="carte${aTraiter ? ' a-traiter' : ''}${urgent ? ' est-urgent' : ''}" data-edit-session="${escapeAttr(s.id)}" tabindex="0" role="button">
    <span class="carte-heure">${escapeHtml(dashHoraire(s) || '—')}</span>
    <span class="carte-titre">${escapeHtml(s.title)}</span>
    ${promoPillMarkup(s)}
    <span class="carte-meta">${escapeHtml(meta)}</span>
    ${teachers ? `<span class="design-ue-pills carte-teachers">${teachers}</span>` : ''}
    ${actions.length ? `<span class="carte-actions">${dashEtiquettes(actions)}</span>` : ''}
  </li>`;
}

function dashCarteReunion(r) {
  // Pastille d'initiales (22/08/2026) : dashCarteSeance en a une depuis les
  // retours #3, dashCarteReunion l'avait oubliée — pourtant tout aussi utile
  // ici pour savoir d'un coup d'œil quelle réunion concerne quel compte.
  const teachers = teacherPillsMarkup(r.teacher);
  return `<li class="carte est-reunion" data-edit-reunion="${escapeAttr(r.id)}" tabindex="0" role="button">
    <span class="carte-heure">—</span>
    <span class="carte-titre">${escapeHtml(r.lieu ? 'Réunion — ' + r.lieu : 'Réunion')}</span>
    <span class="carte-meta">${escapeHtml(r.participants || 'participants à préciser')}</span>
    ${teachers ? `<span class="design-ue-pills carte-teachers">${teachers}</span>` : ''}
    <span class="carte-actions"><span class="act act-reunion">Réunion</span></span>
  </li>`;
}

function dashColonneJour(j, videHtml, compact) {
  const classes = ['col-jour'];
  if (j.estAujourdhui) classes.push('est-aujourdhui');
  if (j.estPasse) classes.push('est-passe');
  const periodes = j.periodes.length
    ? `<p class="col-periode">${escapeHtml(j.periodes.map(p => p.label).join(' · '))}</p>` : '';
  const cartes = [...j.seances.map(s => dashCarteSeance(s, j.date, compact)), ...j.reunions.map(dashCarteReunion)];
  return `<div class="${classes.join(' ')}">
    <div class="col-tete">
      <span class="col-nom">${escapeHtml(j.estAujourdhui ? "Aujourd'hui" : j.nomLong)}</span>
      <span class="col-date">${escapeHtml(j.jjmm)}</span>
    </div>
    ${periodes}
    ${cartes.length ? `<ul class="col-liste">${cartes.join('')}</ul>` : (videHtml || '<p class="col-vide">pas de cours</p>')}
  </div>`;
}

function renderDashSemaine() {
  const hote = $('#dashSemaine');
  if (!hote) return;
  const semaineId = dashSemaineIdCourante();
  const iCourante = state.weeks.findIndex(w => w.id === currentWeekId());
  const iAffichee = state.weeks.findIndex(w => w.id === semaineId);
  const nav = iCourante >= 0 ? `<div class="dash-semaine-nav">
      <button type="button" class="dash-week-nav-btn" data-dash-week-nav="-1" ${iAffichee <= 0 ? 'disabled' : ''} aria-label="Semaine précédente">‹</button>
      <button type="button" class="dash-week-nav-btn" data-dash-week-nav="1" ${iAffichee < 0 || iAffichee >= state.weeks.length - 1 ? 'disabled' : ''} aria-label="Semaine suivante">›</button>
    </div>` : '';
  const c = dashContenuSemaine(semaineId);
  if (!c) {
    hote.innerHTML = `<div class="panel-heading-inline bloc-tete"><h3>Ma semaine</h3>${nav}</div>
      ${dashBandeauRetard()}<p class="bloc-vide">Nous sommes hors année scolaire.</p>`;
    return;
  }
  const nbActions = c.jours.reduce((n, j) => n + j.seances.filter(s => dashActionsDeSeance(s, j.date).some(a => !a.fait)).length, 0) + c.aPlacer.length;

  /* Une séance sans créneau dans la semaine en cours est urgente : rouge. */
  const sansCreneau = c.aPlacer.length
    ? `<div class="bande-sans-creneau">
        <span class="sc-titre">Sans créneau — à placer cette semaine</span>
        <ul class="sc-liste">${c.aPlacer.map(s => `<li class="carte a-traiter est-urgent" data-edit-session="${escapeAttr(s.id)}" tabindex="0" role="button">
          <span class="carte-titre">${escapeHtml(s.title)}</span>
          <span class="carte-meta">${escapeHtml([ueCodeOnly(s.ueId) !== 'UE ?' ? 'UE ' + ueCodeOnly(s.ueId) : '', s.expectedDuration].filter(Boolean).join(' · '))}</span>
          <span class="carte-actions"><span class="act act-placer act-urgent">À placer</span></span>
        </li>`).join('')}</ul>
      </div>` : '';

  hote.innerHTML = `<div class="panel-heading-inline bloc-tete">
      <h3>Ma semaine <span class="bloc-id">${escapeHtml(c.semaine.label)} · ${escapeHtml(dashDatesSemaine(c.semaine.id))}</span></h3>
      ${nav}
      <span class="bloc-compte">${c.nbSeances} séance${c.nbSeances > 1 ? 's' : ''}${c.nbReunions ? ` · ${c.nbReunions} réunion${c.nbReunions > 1 ? 's' : ''}` : ''}${nbActions ? ` · <strong>${nbActions} à traiter</strong>` : ''}</span>
      <span class="bloc-lien" data-goto-view="week" tabindex="0" role="button">Ouvrir le planning hebdo →</span>
    </div>
    ${dashBandeauRetard()}
    <div class="bande bande-5">${c.jours.map(j => dashColonneJour(j)).join('')}</div>
    ${sansCreneau}`;
}

/* ---- Ligne 2 : « Les deux semaines suivantes » — même grille jour par jour
   que « Ma semaine » (réutilise dashContenuSemaine/dashColonneJour), en plus
   compact (voir .bande-compacte en CSS) : DASH_SEMAINES semaines qui suivent
   celle affichée, sans sélecteur de date. Le premier jour vide de la semaine
   signale, s'il y en a, les séances de cette semaine encore sans créneau. */
function dashLigneSemaine(semaineId) {
  const c = dashContenuSemaine(semaineId);
  if (!c) return '';
  let aPlacerMontre = false;
  const joursHtml = c.jours.map(j => {
    let videHtml;
    if (!j.seances.length && !j.reunions.length && c.aPlacer.length && !aPlacerMontre) {
      aPlacerMontre = true;
      videHtml = `<p class="col-vide col-vide-libre"><span>créneau libre</span><span class="col-vide-lien" data-ouvrir="dash:backlog" tabindex="0" role="button">${c.aPlacer.length} séance${c.aPlacer.length > 1 ? 's' : ''} à placer</span></p>`;
    }
    return dashColonneJour(j, videHtml, true);
  }).join('');
  return `<div class="ligne-semaine">
    <div class="col-semaine-num"><span class="sem-nom">${escapeHtml(c.semaine.label)}</span><span class="sem-date">${escapeHtml(dashDatesSemaine(semaineId))}</span></div>
    <div class="bande bande-5">${joursHtml}</div>
  </div>`;
}

function renderDashProchainement() {
  const hote = $('#dashProchainement');
  if (!hote) return;
  const ids = dashSemainesApres(DASH_SEMAINES);
  if (!ids.length) { hote.innerHTML = ''; hote.hidden = true; return; }
  hote.hidden = false;
  const aAnticiper = ids.some(id => {
    const c = dashContenuSemaine(id);
    if (!c) return false;
    return c.aPlacer.length || c.jours.some(j => j.seances.some(s => dashActionsDeSeance(s, j.date).some(a => a.urgent)));
  });
  hote.innerHTML = `<div class="panel-heading-inline bloc-tete">
      <h3>Les deux semaines suivantes <span class="bloc-id">ce qui demande d&rsquo;anticiper</span></h3>
      ${aAnticiper ? `<span class="bloc-legende"><span class="bloc-legende-puce"></span>une réservation ou un ordre à produire</span>` : ''}
    </div>
    <div class="bande-compacte">${ids.map(dashLigneSemaine).join('')}</div>`;
}

/* Badges de l'encart « Séances à placer » : visibles panneau replié.
   Ajustements #2 [B2.3] (18/08/2026) — le compteur « à rattacher » est
   retiré (redondant avec la pastille « À rattacher » déjà posée sur chaque
   carte concernée) ; le compteur « à placer » ne garde que le chiffre.
   Retours #3 (18-19/08/2026) — le compteur portait sur TOUTES les séances
   fictives alors que les tuiles n'affichent que celles dans la fenêtre de
   DASH_BACKLOG_FENETRE_JOURS (dashBacklogSessions) : les deux chiffres
   pouvaient diverger. On compte désormais exactement ce qui est affiché. */
function renderDashBacklogBadges(nb) {
  const hote = $('#backlogBadges');
  if (!hote) return;
  hote.innerHTML = `<span class="frais-badge${nb ? ' has-pending' : ''}">${nb || 'à jour'}</span>`;
}

/* Les ordres de mission : séances et réunions en véhicule PERSONNEL. Une
   mission pas encore demandée se déleste d'elle-même passé la date (rien à
   demander pour un déplacement déjà eu lieu). Retour de Martin (22/08/2026) :
   une fois faite, elle rejoint ordresDeMissionFaits() (menu « Faites »)
   plutôt que de rester ici marquée verte jusqu'à un × à part. Triées par
   date, les plus proches en tête. */
function ordresDeMissionAFaire() {
  const out = [];
  const pousser = (source, id, titre, date, detail, fait) => {
    if (fait) return;
    if (date && dashJoursEntre(date) < 0) return;
    out.push({ source, id, titre, date, detail, fait: false });
  };
  (state.sessions || []).filter(estVisiblePourMoi).forEach(s => {
    if (s.deplacement !== 'personnel') return;
    const iso = sessionIsoDate(s);
    pousser('session', s.id, s.title || 'Séance sans titre', iso ? parseIsoDate(iso) : null, s.promotion || '', !!s.ordreMission);
  });
  (state.reunions || []).filter(estVisiblePourMoi).forEach(r => {
    if (r.deplacement !== 'personnel') return;
    pousser('reunion', r.id, r.sujets ? truncate(r.sujets, 48) : 'Réunion', parseIsoDate(r.date), r.lieu || '', !!r.ordreMission);
  });
  return out.sort((a, b) => {
    if (!a.date && !b.date) return 0;
    if (!a.date) return 1;
    if (!b.date) return -1;
    return a.date - b.date;
  });
}

/* Symétrique : les ordres de mission déjà faits, pour le menu « Faites ». */
function ordresDeMissionFaits() {
  const out = [];
  const pousser = (source, id, titre, date, detail, fait) => {
    if (!fait) return;
    out.push({ source, id, titre, date, detail, fait: true });
  };
  (state.sessions || []).filter(estVisiblePourMoi).forEach(s => {
    if (s.deplacement !== 'personnel') return;
    const iso = sessionIsoDate(s);
    pousser('session', s.id, s.title || 'Séance sans titre', iso ? parseIsoDate(iso) : null, s.promotion || '', !!s.ordreMission);
  });
  (state.reunions || []).filter(estVisiblePourMoi).forEach(r => {
    if (r.deplacement !== 'personnel') return;
    pousser('reunion', r.id, r.sujets ? truncate(r.sujets, 48) : 'Réunion', parseIsoDate(r.date), r.lieu || '', !!r.ordreMission);
  });
  return out.sort((a, b) => {
    if (!a.date && !b.date) return 0;
    if (!a.date) return 1;
    if (!b.date) return -1;
    return b.date - a.date;
  });
}

// Ajustements #2 [B2.4] (18/08/2026) — les séances encore à placer, triées
// chronologiquement (sessionSortKey, déjà utilisée pour le backlog du
// Planning hebdo) et bornées à une fenêtre de 2 mois : au-delà, elles
// resteraient visibles dans le Planning hebdo/la Conception pédagogique,
// juste plus dans cet encart. Une séance sans semaine cible connue n'a pas
// de date à comparer : gardée (pas cachée) plutôt que perdue de vue.
const DASH_BACKLOG_FENETRE_JOURS = 61; // ≈ 2 mois
function dashBacklogSessions() {
  return visibleSessions().filter(isFictiveSession).filter(s => {
    const w = dashSemaineObjet(sessionCanonicalWeekId(s));
    if (!w) return true;
    const j = dashJoursEntre(dayDatesForWeek(w)[0]);
    return j === null || j <= DASH_BACKLOG_FENETRE_JOURS;
  }).sort((a, b) => sessionSortKey(a).localeCompare(sessionSortKey(b)));
}

function renderDashboard() {
  const fictive = dashBacklogSessions();

  renderDashSemaine();
  renderDashProchainement();
  renderDashBacklogBadges(fictive.length);
  renderUrgences();

  // Lot A [7] — mêmes tuiles qu'en Conception pédagogique et qu'au Planning
  // hebdo (renderBacklogSessionTile), au lieu des lignes de liste : une séance à
  // placer se reconnaît à sa couleur d'UE, et se glisse depuis les trois vues.
  $('#dashboardBacklog').innerHTML = fictive.length
    ? fictive.map(s => renderBacklogSessionTile(s)).join('')
    : '<p class="meta">Aucune séance à placer en attente.</p>';

  // Triées par ordre chronologique (date de début) : une liste de périodes se
  // parcourt naturellement dans le temps, pas dans l'ordre de saisie.
  const constraintsTriees = [...state.constraints].sort((a, b) => (a.start || '').localeCompare(b.start || ''));
  $('#constraintsList').innerHTML = constraintsTriees.length
    ? constraintsTriees.map(c => `<div class="row-item" data-edit-constraint="${escapeAttr(c.id)}"><div class="row-main"><strong class="row-title">${escapeHtml(c.label)}</strong><span class="row-meta">${escapeHtml(c.type)} · ${formatDateFr(c.start)} → ${formatDateFr(c.end)} · ${(c.promotions || []).length ? escapeHtml((c.promotions || []).join(', ')) : 'Toutes promotions'}</span></div></div>`).join('')
    : '<p class="meta">Aucune période enregistrée (vacances, stage, examen…).</p>';

  renderChecklist('todo');
  renderChecklist('devnotes');
  renderChecklist('mobiletodo');
}

/* Écrans mobile (14-21 du handoff), fondation. Accueil (écran 14) : sur
   demande explicite de Martin, ce n'est PAS le « Bord » dense de la maquette
   d'origine (Aujourd'hui + aperçu Urgences + À faire empilés) mais un vrai
   menu à gros boutons de lancement — aucun contenu détaillé ici, juste un
   badge/compteur quand il y a quelque chose à traiter. « À faire » n'a pas de
   bouton pour l'instant : pas de destination mobile définie (pas dans le
   handoff, jamais tranché avec Martin) — à ajouter une fois décidé plutôt que
   d'inventer un écran.
   showMobileScreen()/[data-mobile-goto] (bindEvents) généralisent le geste
   déjà utilisé par openMissionView pour une vue qui n'est pas un onglet
   permanent (À valider, Une séance, Frais…). */
function showMobileScreen(id) {
  $$('.tab').forEach(t => t.classList.remove('active'));
  $$('.view').forEach(v => v.classList.remove('active-view'));
  $(`#${id}`)?.classList.add('active-view');
  window.scrollTo(0, 0);
  updateMobileBannerBack();
}

// Ajustements #5 (22/08/2026) : l'emplacement « ‹ Portail » du bandeau titre
// (toujours visible, commun à tous les écrans) n'a de sens que sur l'accueil
// mobile — ailleurs il devient trompeur (on croit revenir en arrière dans
// l'appli, on ressort vers le portail externe). Sur les autres écrans mobile,
// cet emplacement bascule donc sur un vrai bouton de retour.
// Ajustements #6 (22/08/2026) : ce bouton faisait doublon avec le petit lien
// « ‹ Accueil » répété en haut de chaque écran mobile — Martin a demandé de
// retirer ces doublons et de renommer celui du bandeau en « ‹ Accueil » (au
// lieu de « ‹ Retour ») : un seul bouton de retour, toujours au même endroit,
// qui ramène directement à l'accueil mobile (sauf depuis #missionView, où il
// délègue à closeMissionView() pour revenir à l'écran d'origine — cf.
// missionViewReturnTo — plutôt que de sauter systématiquement à l'accueil).
function updateMobileBannerBack() {
  const portailLink = $('.atlas-backlink');
  const backBtn = $('#bannerMobileBack');
  if (!portailLink || !backBtn) return;
  // Desktop (>780px, cf. styles.css) : le bandeau garde son unique rôle
  // « retour portail » quelle que soit la vue active — seul le mobile a
  // besoin d'un retour interne, faute d'onglets permanents.
  if (window.innerWidth > 780) { portailLink.hidden = false; backBtn.hidden = true; return; }
  const active = activeMobileView();
  const isAccueil = !active || active.id === 'mobileAccueil';
  portailLink.hidden = !isAccueil;
  backBtn.hidden = isAccueil;
}
// #dashboard (desktop) ET #mobileAccueil (mobile) portent tous les deux la
// classe .active-view au chargement (chacun caché/montré par CSS selon
// desktop-only/mobile-only) : `.view.active-view` seul renvoie le premier du
// DOM (#dashboard), pas la vue mobile réellement affichée. Il faut restreindre
// la recherche aux vraies vues mobiles (+ #missionView, partagé, qui gère sa
// propre classe active-view sans être .mobile-only).
function activeMobileView() {
  if ($('#missionView')?.classList.contains('active-view')) return $('#missionView');
  return $('.view.mobile-only.active-view');
}
function mobileGoBack() {
  const active = activeMobileView();
  if (active && active.id === 'missionView') { closeMissionView(); return; }
  showMobileScreen('mobileAccueil');
}

function renderMobileAccueil() {
  const host = $('#mobileAccueil');
  if (!host) return;
  const nbUrgences = urgenceRows().length;
  const nbFrais = (state.deplacements || []).filter(estVisiblePourMoi).filter(d => d.statut !== 'Terminée').length;
  const nbAFaire = (state.todoItems || []).filter(t => !t.done).length;
  const nbMission = ordresDeMissionAFaire().length;
  const nbMateriel = (state.materielEmprunts || []).filter(estVisiblePourMoi).filter(m => !m.dateRetour).length;
  const bouton = (icon, label, target, count, alerte) => `
    <button type="button" class="mobile-home-btn" data-mobile-goto="${target}">
      <span class="mobile-home-icon" aria-hidden="true">${icon}</span>
      <span class="mobile-home-label">${label}</span>
      ${count ? `<span class="mobile-home-badge${alerte ? ' is-alert' : ''}">${count}</span>` : ''}
    </button>`;
  host.innerHTML = `
    <div class="mobile-home">
      ${bouton('📅', 'Ma semaine', 'mobileSemaine', 0, false)}
      ${bouton('⚑', 'Urgences', 'mobileAValider', nbUrgences, true)}
      ${bouton('✎', 'À faire', 'mobileAFaire', nbAFaire, false)}
      ${bouton('📋', 'Ordre de mission', 'mobileMission', nbMission, false)}
      ${bouton('💶', 'Frais', 'mobileFrais', nbFrais, false)}
      ${bouton('🎒', 'Matériel', 'mobileMateriel', nbMateriel, false)}
    </div>`;
}

/* Écran 16 — Ma semaine (mobile). Réutilise dashContenuSemaine (jours/séances/
   réunions/périodes) et dashCarteSeance/dashCarteReunion (cartes) telles
   quelles — seul le patron de mise en page change : retour de Martin
   (21/08/2026, « encore trop de cadres dans des cadres ») abandonnant
   dashColonneJour (boîte de jour + boîte englobante desktop) au profit d'un
   simple titre de jour à plat (même patron que .mobile-group-title de À
   valider), .carte restant le seul niveau de cadre. Partage dashSemaineOffset
   avec le Tableau de bord desktop : navigation cohérente entre les deux, un
   seul utilisateur à la fois. */
// Ajustements #6 (22/08/2026) : Martin distingue deux cas pour les séances
// d'un même jour — deux créneaux au MÊME horaire (deux groupes en parallèle)
// peuvent se partager la largeur côte à côte (accord déjà donné sur le fait
// qu'elles se touchent), mais deux créneaux SUCCESSIFS (l'un après l'autre
// dans la journée) doivent au contraire s'empiler verticalement en pleine
// largeur — les regrouper toutes en lignes de ~3 (ajustements #5) rendait les
// tuiles illisibles dès que les horaires ne coïncidaient pas (cf. son exemple
// du vendredi 18/09). `seanceRangeMinutes`/`seancesChevauchent` détectent ce
// chevauchement horaire (créneau fixe ou horaire personnalisé) pour grouper
// uniquement les séances réellement simultanées.
function seanceRangeMinutes(s) {
  if (s.customStart && s.customEnd) {
    const parseHM = str => {
      const m = /(\d{1,2})h(\d{2})?/.exec(str || '');
      return m ? (parseInt(m[1], 10) * 60 + parseInt(m[2] || '0', 10)) : null;
    };
    return [parseHM(s.customStart), parseHM(s.customEnd)];
  }
  return [SLOT_BOUNDS_MIN[Number(s.startSlot)]?.[0] ?? null, SLOT_BOUNDS_MIN[Number(s.endSlot)]?.[1] ?? null];
}
function seancesChevauchent(a, b) {
  const [aDeb, aFin] = seanceRangeMinutes(a);
  const [bDeb, bFin] = seanceRangeMinutes(b);
  if (aDeb === null || bDeb === null) return false;
  return aDeb < (bFin === null ? aDeb + 1 : bFin) && bDeb < (aFin === null ? bDeb + 1 : aFin);
}
function clusterSeancesChevauchantes(seances) {
  const triees = seances.slice().sort((a, b) => (seanceRangeMinutes(a)[0] ?? 0) - (seanceRangeMinutes(b)[0] ?? 0));
  const clusters = [];
  triees.forEach(s => {
    const cible = clusters.find(cl => cl.some(o => seancesChevauchent(o, s)));
    if (cible) cible.push(s); else clusters.push([s]);
  });
  return clusters;
}
// Change de semaine affichée dans « Ma semaine » (‹/› desktop et mobile, et
// balayage tactile mobile — ajustements #6) : un seul point d'entrée pour ne
// pas dupliquer le trio de rendus à chaque nouveau geste de navigation.
function dashChangerSemaine(delta) {
  dashSemaineOffset += delta;
  renderDashSemaine();
  renderDashProchainement();
  renderMobileSemaine();
}
function renderMobileSemaine() {
  const host = $('#mobileSemaine');
  if (!host) return;
  const semaineId = dashSemaineIdCourante();
  const iAffichee = state.weeks.findIndex(w => w.id === semaineId);
  const nav = `<div class="dash-semaine-nav">
    <button type="button" class="dash-week-nav-btn" data-dash-week-nav="-1" ${iAffichee <= 0 ? 'disabled' : ''} aria-label="Semaine précédente">‹</button>
    <button type="button" class="dash-week-nav-btn" data-dash-week-nav="1" ${iAffichee < 0 || iAffichee >= state.weeks.length - 1 ? 'disabled' : ''} aria-label="Semaine suivante">›</button>
  </div>`;
  const c = dashContenuSemaine(semaineId);
  if (!c) {
    host.innerHTML = `<div class="mobile-topbar"><h2 class="mobile-topbar-title">Ma semaine</h2>${nav}</div><p class="empty-hint">Nous sommes hors année scolaire.</p>`;
    return;
  }
  const jourBlock = j => {
    const titre = j.estAujourdhui ? "Aujourd'hui" : `${j.nomLong} ${j.jjmm}`;
    const periodes = j.periodes.length ? `<p class="col-periode">${escapeHtml(j.periodes.map(p => p.label).join(' · '))}</p>` : '';
    // dashCarteSeance()/dashCarteReunion() renvoient déjà un <li class="carte">
    // (repris tel quel du Tableau de bord desktop) — le regroupeur de ligne ne
    // peut donc pas être un <li> à son tour : un <li> dans un <li> referme
    // implicitement le premier (règle du parseur HTML), qui redevient frère
    // du second au lieu d'être son parent. D'où un <div> ici.
    const lignes = clusterSeancesChevauchantes(j.seances).map(cl => `<div class="col-liste-ligne">${cl.map(s => dashCarteSeance(s, j.date, false)).join('')}</div>`).join('')
      + j.reunions.map(r => `<div class="col-liste-ligne">${dashCarteReunion(r)}</div>`).join('');
    return `<h3 class="mobile-jour-titre${j.estAujourdhui ? ' est-aujourdhui' : ''}">${escapeHtml(titre)}</h3>
      ${periodes}
      ${lignes ? `<ul class="col-liste">${lignes}</ul>` : '<p class="empty-hint">pas de cours</p>'}`;
  };
  host.innerHTML = `
    <div class="mobile-topbar">
      <h2 class="mobile-topbar-title">${escapeHtml(c.semaine.label)} <span class="carte-meta">${escapeHtml(dashDatesSemaine(c.semaine.id))}</span></h2>
      ${nav}
    </div>
    <div class="mobile-semaine-jours">${c.jours.map(jourBlock).join('')}</div>`;
}

/* Écran 17 — Une séance ouverte (mobile). Atteint en tapant une carte séance
   depuis Ma semaine ou À valider (pas un onglet). 3 verbes de la maquette :
   ✓ Faite (nouveau champ s.realisee, décidé avec Martin le 21/08/2026 — la
   date passée seule ne suffisait pas) / ✎ Annoter (fait défiler jusqu'au
   champ note déjà présent plus bas et le met au focus) / ⚠ Modifier (réutilise
   le vrai formulaire desktop #sessionDialog via openSessionModal — l'écran 19
   dédié de la maquette a été jugé pas assez utile par Martin pour être
   construit maintenant, les ajustements se font avant la séance, pas dans
   l'urgence mobile). « Bilan de séance » et « Mes notes · privé » de la
   maquette sont UN SEUL champ réel (`s.notes`, déjà labellisé côté desktop
   « Notes internes / bilan — s'écrit après la séance ») : pas deux sections,
   une seule, fidèle au modèle de données réel. */
let mobileSeanceTarget = null; // id de séance (state.sessions)
let mobileSeanceNotesTimer;
async function persistMobileSeanceNotes() {
  const s = mobileSeanceTarget && findSession(mobileSeanceTarget);
  const champ = $('#mobileSeanceNotes');
  if (!s || !champ) return;
  if (champ.value === (s.notes || '')) return;
  s.notes = champ.value;
  const statusEl = $('#mobileSeanceNotesStatus');
  try { await saveData('Notes de séance enregistrées', { rerender: false }); if (statusEl) statusEl.textContent = 'Enregistré'; }
  catch (e) { if (statusEl) statusEl.textContent = 'Erreur d’enregistrement'; }
}
function openMobileSeance(id) {
  mobileSeanceTarget = id;
  renderMobileSeance();
  showMobileScreen('mobileSeance');
}
function renderMobileSeance() {
  const host = $('#mobileSeance');
  if (!host || !mobileSeanceTarget) return;
  const s = findSession(mobileSeanceTarget);
  if (!s) { host.innerHTML = '<p class="empty-hint">Séance introuvable.</p>'; return; }
  const w = s.weekId ? dashSemaineObjet(s.weekId) : null;
  const date = w ? dayDatesForWeek(w)[Number(s.day)] : null;
  const actions = dashActionsDeSeance(s, date);
  const meta = [ueCodeOnly(s.ueId) !== 'UE ?' ? 'UE ' + ueCodeOnly(s.ueId) : 'sans UE', s.promotion, dashHoraire(s), date ? date.toLocaleDateString('fr-FR') : 'Date à préciser']
    .filter(Boolean).join(' · ');
  host.innerHTML = `
    <div class="mobile-topbar">
      <button type="button" class="lien mobile-back" data-mobile-goto="mobileSemaine">‹ Retour</button>
    </div>
    <h2 class="mobile-seance-titre">${escapeHtml(s.title || 'Séance sans titre')}</h2>
    <p class="carte-meta">${escapeHtml(meta)}</p>
    <div class="mobile-seance-verbes">
      <button type="button" class="mobile-verbe-btn${s.realisee ? ' is-actif' : ''}" data-mobile-toggle-realisee="${escapeAttr(s.id)}">${s.realisee ? '✓ Faite' : 'Marquer faite'}</button>
      <button type="button" class="mobile-verbe-btn" data-mobile-annoter="1">✎ Annoter</button>
      <button type="button" class="mobile-verbe-btn" data-edit-session="${escapeAttr(s.id)}">⚠ Modifier</button>
    </div>
    ${actions.length ? `<div class="carte-actions mobile-seance-actions">${dashEtiquettes(actions)}</div>` : ''}
    ${s.activities ? `<section class="mobile-seance-bloc"><h3>Déroulé</h3><p>${escapeHtml(s.activities)}</p></section>` : ''}
    ${s.objectives ? `<section class="mobile-seance-bloc"><h3>Objectifs</h3><p>${escapeHtml(s.objectives)}</p></section>` : ''}
    ${s.keywords ? `<section class="mobile-seance-bloc"><h3>Mots-clés</h3><p>${escapeHtml(s.keywords)}</p></section>` : ''}
    <section class="mobile-seance-bloc">
      <h3>Notes internes / bilan <small>— s’écrit après la séance</small></h3>
      <textarea id="mobileSeanceNotes" rows="5">${escapeHtml(s.notes || '')}</textarea>
      <span id="mobileSeanceNotesStatus" class="meta"></span>
    </section>`;
  // « Modifier » ouvre le vrai formulaire desktop : data-edit-session est déjà
  // géré par le handler global existant (voir CIBLES_ARBRE / listeners dédiés)
  // uniquement dans certains conteneurs desktop — ici on appelle directement.
  $('#mobileSeance [data-edit-session]')?.addEventListener('click', () => openSessionModal(s));
}

/* Écran 20 — Frais (mobile). Réutilise state.deplacements / deplacementTotal /
   deplacementOrigin / DEPLACEMENT_STATUSES tels quels (mêmes données que le
   tableau desktop, cf. renderFrais) : seule la mise en page change — cartes
   groupées par statut au lieu d'un tableau à 8 colonnes, illisible à 390px.
   Taper une ligne ouvre le VRAI formulaire desktop (openDeplacementModal,
   dialog déjà responsive depuis la refonte desktop) plutôt qu'un second
   formulaire à maintenir — même choix qu'« ⚠ Modifier » sur l'écran 17.
   Volontairement absents de cette passe (maquette 20/21 du handoff, jamais
   tranchés avec Martin) : justificatif photographié (repas/péage/parking),
   auto-remplissage du kilométrage depuis la séance, partage d'une ligne de
   frais vers le compte d'un collègue (« déclarer un trajet » reste donc la
   même fiche que « modifier un déplacement », pas un écran séparé). */
function mobileFraisRowMarkup(d) {
  const quand = d.date ? formatDateFr(d.date) : 'Date à préciser';
  const lieu = d.lieu || deplacementOrigin(d) || 'Déplacement';
  const detail = [`${Number(d.kmAR) || 0} km`, fmtEuro(deplacementTotal(d))].filter(Boolean).join(' · ');
  const verbe = d.statut === DEPLACEMENT_STATUSES[0]
    ? `<span class="urgence-verbe" data-edit-deplacement="${escapeAttr(d.id)}" tabindex="0" role="button">Déclarer</span>`
    : '';
  // Même repère que le tableau desktop (renderFrais) : distingue une ligne
  // rattachée à une séance/réunion (préremplie, se remet à zéro si on la
  // supprime) d'une saisie libre (frais imprévu, pas de source à nettoyer).
  const linkedSession = d.sessionId && (state.sessions || []).some(s => s.id === d.sessionId);
  const linkedReunion = d.reunionId && (state.reunions || []).some(r => r.id === d.reunionId);
  const lien = (linkedSession || linkedReunion)
    ? ` <span class="frais-link" title="${escapeAttr(linkedSession ? 'Créé depuis une séance' : 'Créé depuis une réunion')}">🔗</span>`
    : '';
  return `<div class="urgence-row" data-edit-deplacement="${escapeAttr(d.id)}" tabindex="0" role="button">
    <span class="urgence-delai">${escapeHtml(quand)}</span>
    <strong class="urgence-titre">${escapeHtml(lieu)}${lien}</strong>
    <span class="urgence-detail">${escapeHtml(detail)}</span>
    ${verbe}
  </div>`;
}
function renderMobileFrais() {
  const host = $('#mobileFrais');
  if (!host) return;
  const all = (state.deplacements || []).filter(estVisiblePourMoi)
    .sort((a, b) => (a.date || '').localeCompare(b.date || ''));
  const aDeclarer = all.filter(d => d.statut === DEPLACEMENT_STATUSES[0]);
  const enCours = all.filter(d => d.statut === DEPLACEMENT_STATUSES[1]);
  const rembourses = all.filter(d => d.statut === DEPLACEMENT_STATUSES[2]);
  const totalRembourse = rembourses.reduce((s, d) => s + deplacementTotal(d), 0);
  const groupe = (titre, liste) => liste.length
    ? `<h3 class="mobile-group-title">${titre}</h3>${liste.map(mobileFraisRowMarkup).join('')}`
    : '';
  host.innerHTML = `
    <div class="mobile-frais-totaux">
      <div class="mobile-frais-total"><span>À déclarer</span><strong>${aDeclarer.length}</strong></div>
      <div class="mobile-frais-total"><span>Envoyés</span><strong>${enCours.length}</strong></div>
      <div class="mobile-frais-total"><span>Remboursés</span><strong class="est-rembourse">${escapeHtml(fmtEuro(totalRembourse))}</strong></div>
    </div>
    ${all.length
      ? (groupe('À déclarer', aDeclarer) + groupe('Envoyés', enCours) + groupe('Remboursés', rembourses))
      : '<p class="empty-hint">Aucun déplacement enregistré. Cochez « Déplacement en véhicule personnel » sur une séance, ou ajoutez-en un avec « + Un trajet ».</p>'}
    <button type="button" class="lien mobile-add-deplacement" id="mobileAddDeplacementButton">+ Un trajet</button>`;
}

/* « À faire » et « Amélioration de l'appli » — refonte écran 1 (16/08/2026)
   puis retours 17/08/2026 : deux listes à cocher de même forme (la seconde
   partagée entre comptes plutôt que privée), un seul moteur pour les deux.
   Une tâche cochée reste visible (barrée) jusqu'à la fin de la journée où
   elle a été cochée (repérage par `doneAt === todayIso()`), puis rejoint un
   historique consultable (⌄ Tâches faites) purgé au-delà de 30 jours
   (purgerTachesFaites, appliqué au chargement). */
const CHECKLISTS = {
  todo: { list: '#todoList', input: '#todoNewInput', panel: '#todoPriorityPanel', history: '#todoHistoryList', historyCount: '#todoHistoryCount', idPrefix: 'todo', field: 'todoItems' },
  devnotes: { list: '#devNotesList', input: '#devNotesNewInput', panel: '#devNotesPanel', history: '#devNotesHistoryList', historyCount: '#devNotesHistoryCount', idPrefix: 'devnote', badge: '#devNotesBadge', field: 'devNotesItems' },
  // Écran d'accueil mobile (ajustements #5, 22/08/2026) — même tâches que le
  // panneau desktop « À faire » (state.todoItems), juste un second jeu d'id
  // DOM pour l'écran mobile dédié : même moteur, même donnée, deux vues.
  mobiletodo: { list: '#mobileAFaireList', input: '#mobileAFaireInput', panel: '#mobileAFaire', history: '#mobileAFaireHistoryList', historyCount: '#mobileAFaireHistoryCount', idPrefix: 'todo', field: 'todoItems' }
};
function checklistItems(key) {
  const field = CHECKLISTS[key].field;
  state[field] = state[field] || [];
  return state[field];
}
function renderChecklist(key) {
  const cfg = CHECKLISTS[key];
  const host = $(cfg.list);
  if (!host) return;
  const today = todayIso();
  const items = checklistItems(key);
  const visibles = items.filter(t => !t.done || t.doneAt === today);
  const faites = items.filter(t => t.done && t.doneAt !== today).sort((a, b) => (b.doneAt || '').localeCompare(a.doneAt || ''));
  host.innerHTML = visibles.length
    ? visibles.map(t => `<label class="todo-row${t.done ? ' is-done' : ''}">
        <input type="checkbox" data-checklist-check="${escapeAttr(t.id)}" ${t.done ? 'checked' : ''} />
        <span class="todo-row-text">${escapeHtml(t.text)}</span>
        <button type="button" class="todo-row-remove" data-checklist-remove="${escapeAttr(t.id)}" title="Supprimer" aria-label="Supprimer « ${escapeAttr(t.text)} »">✕</button>
      </label>`).join('')
    : '<p class="meta tight">Aucune tâche en attente.</p>';
  $(cfg.panel)?.classList.toggle('has-pending', items.some(t => !t.done));
  if (cfg.badge) {
    const nb = visibles.filter(t => !t.done).length;
    const badge = $(cfg.badge);
    if (badge) { badge.textContent = nb ? `${nb} à traiter` : ''; badge.classList.toggle('has-pending', nb > 0); }
  }

  const histHost = $(cfg.history);
  if (histHost) {
    histHost.innerHTML = faites.length
      ? faites.map(t => `<li class="todo-history-row"><span class="todo-history-text">${escapeHtml(t.text)}</span><span class="todo-history-date">${escapeHtml(formatDateFr(t.doneAt))}</span></li>`).join('')
      : '<li class="meta tight">Aucune tâche faite ces 30 derniers jours.</li>';
  }
  const histCount = $(cfg.historyCount);
  if (histCount) histCount.textContent = faites.length ? `Tâches faites (${faites.length})` : 'Tâches faites';
}
function wireChecklist(key) {
  const cfg = CHECKLISTS[key];
  // Retours #4 (18/08/2026) — champ passé en <textarea> pour laisser plus de
  // place à la rédaction ; Entrée valide toujours, Maj+Entrée insère un saut
  // de ligne (sinon impossible d'écrire une note sur plusieurs lignes).
  $(cfg.input)?.addEventListener('keydown', async (event) => {
    if (event.key !== 'Enter' || event.shiftKey) return;
    event.preventDefault();
    const input = event.target;
    const text = input.value.trim();
    if (!text) return;
    checklistItems(key).push({ id: uid(cfg.idPrefix), text, done: false, doneAt: '' });
    input.value = '';
    renderChecklist(key);
    await saveData('Tâche ajoutée', { rerender: false });
  });
  $(cfg.list)?.addEventListener('change', async (event) => {
    const box = event.target.closest('[data-checklist-check]');
    if (!box) return;
    const item = checklistItems(key).find(t => t.id === box.dataset.checklistCheck);
    if (!item) return;
    item.done = box.checked;
    item.doneAt = box.checked ? todayIso() : '';
    renderChecklist(key);
    await saveData(item.done ? 'Tâche cochée' : 'Tâche décochée', { rerender: false });
  });
  $(cfg.list)?.addEventListener('click', async (event) => {
    const del = event.target.closest('[data-checklist-remove]');
    if (!del) return;
    const arr = checklistItems(key);
    const idx = arr.findIndex(t => t.id === del.dataset.checklistRemove);
    if (idx < 0) return;
    arr.splice(idx, 1);
    renderChecklist(key);
    await saveData('Tâche supprimée', { rerender: false });
  });
}

function setWeekNotesStatus(text) {
  const status = $('#weekNotesStatus');
  if (status) status.textContent = text || '';
}

/* Refonte écran 2 « Conception pédagogique » (16/08/2026) — sidebar UE (seul
   filtrage, REGLES.md #21) + panneau de détail à sous-onglets Séquences /
   Séances / Capacités pour l'UE sélectionnée. Remplace l'ancien arbre plat de
   toutes les UE d'un coup (une seule à la fois désormais). */
function renderDesign() {
  if (!$('#designSidebarList')) return;
  if (!state.promotions.includes(designPromotionFilter)) designPromotionFilter = state.promotions[0] || 'GPN1';
  const promoUes = state.ues.filter(ue => ue.promotion === designPromotionFilter);
  if (!promoUes.some(ue => ue.id === designSelectedUeId)) {
    // Même règle de repli que la frise (mesUesParDefaut) : mes UE d'abord, dans
    // l'ordre où la sidebar les affiche réellement (semestre puis code) — sinon
    // « la première UE sur la liste » (retours #3, 18-19/08/2026) pouvait
    // différer de l'ordre d'itération brut de state.ues.
    const ordonnees = [...promoUes].sort((a, b) => {
      const parSemestre = SEMESTERS.indexOf(a.semester) - SEMESTERS.indexOf(b.semester);
      return parSemestre !== 0 ? parSemestre : compactUeCode(a.code).localeCompare(compactUeCode(b.code), 'fr', { numeric: true });
    });
    const miennes = moiInitiales ? ordonnees.filter(ue => enseignantsDeLUe(ue).includes(moiInitiales)) : [];
    designSelectedUeId = (miennes[0] || ordonnees[0] || {}).id || '';
  }
  renderDesignSidebar(promoUes);
  renderDesignDetail(findUe(designSelectedUeId));
}

function renderDesignSidebar(promoUes) {
  $$('.promo-switch-btn').forEach(btn => btn.classList.toggle('active', btn.dataset.designPromo === designPromotionFilter));
  const countEl = $('#designSidebarCount');
  if (countEl) countEl.textContent = `${state.ues.length} UE`;
  const semesters = [...new Set(promoUes.map(ue => ue.semester))].sort((a, b) => SEMESTERS.indexOf(a) - SEMESTERS.indexOf(b));
  const list = $('#designSidebarList');
  list.innerHTML = semesters.length
    ? semesters.map(sem => {
        const group = [...promoUes]
          .filter(ue => ue.semester === sem)
          .sort((a, b) => compactUeCode(a.code).localeCompare(compactUeCode(b.code), 'fr', { numeric: true }));
        return `<div class="design-sidebar-group">
          <p class="design-sidebar-group-label">${escapeHtml(sem)}</p>
          ${group.map(ue => renderDesignSidebarRow(ue)).join('')}
        </div>`;
      }).join('')
    : '<p class="meta tight">Aucune UE pour cette promotion.</p>';
}

function renderDesignSidebarRow(ue) {
  const sequenceCount = state.sequences.filter(seq => seq.ueId === ue.id).length;
  const sessionCount = state.sessions.filter(s => s.ueId === ue.id).length;
  // Pastille pleine = j'y interviens, pastille creuse = un·e collègue (JETONS.md).
  const enseignants = enseignantsDeLUe(ue);
  const pills = enseignants.map(initiale => `<span class="design-ue-pill${initiale === moiInitiales ? ' is-mine' : ''}">${escapeHtml(initiale)}</span>`).join('');
  const estMienne = moiInitiales && enseignants.includes(moiInitiales);
  // Estompage (REGLES.md #21) : atténue, ne retire jamais. Appliqué en
  // permanence depuis le retrait de la case « j'y interviens » (18/08/2026,
  // Ajustements #2) — 3 niveaux fixes : sélectionnée / mes UE / collègues.
  const dimmed = (enseignants.length && moiInitiales) ? !estMienne : false;
  const selected = ue.id === designSelectedUeId;
  const compteLabel = (sequenceCount || sessionCount)
    ? `${sequenceCount} séq · ${sessionCount} séance${sessionCount > 1 ? 's' : ''}`
    : 'aucune séance';
  return `<button type="button" class="design-ue-row${selected ? ' is-selected' : ''}${dimmed ? ' is-dimmed' : ''}${!sessionCount ? ' is-empty' : ''}" style="--ue-color:${ueColor(ue.id)}" data-select-ue="${escapeAttr(ue.id)}" aria-pressed="${selected}">
    <span class="design-ue-title">${escapeHtml(ue.code)} — ${escapeHtml(ue.title)}</span>
    <span class="design-ue-sub">
      <span class="design-ue-count">${escapeHtml(compteLabel)}</span>
      ${pills ? `<span class="design-ue-pills">${pills}</span>` : ''}
    </span>
  </button>`;
}

function renderDesignDetail(ue) {
  const head = $('#designDetailHead');
  if (!ue) {
    head.innerHTML = '<p class="meta">Aucune UE à afficher pour cette promotion.</p>';
    $('#ueTree').innerHTML = '';
    $('#designSessionsPanel').innerHTML = '';
    $('#designCapacitiesPanel').innerHTML = '';
    return;
  }
  // Volume horaire : le champ saisi (ue.hoursTarget) prime, mais tant qu'il vaut
  // « à préciser » on affiche à la place le total des séances déjà enregistrées
  // (mêmes fonctions que le Dossier, app.js:5559) plutôt qu'un texte creux.
  const hoursDeclared = (ue.hoursTarget || '').trim();
  const hoursComputed = hoursDeclared.toLowerCase() === 'à préciser' || !hoursDeclared
    ? dossierHoursLabel(dossierUeSessions(ue).reduce((sum, s) => sum + dossierSessionMinutes(s), 0))
    : '';
  const hoursLabel = hoursComputed ? `${hoursComputed} · d’après les séances enregistrées` : (hoursDeclared || 'à préciser');
  const metaLine = renderMetaLine([ueDatePeriod(ue), hoursLabel]);
  const color = ueColor(ue.id);
  head.style.setProperty('--ue-color', color);
  head.style.setProperty('--ue-soft', hexToRgba(color, .1));
  head.style.setProperty('--ue-ink', inkColor(color));
  head.innerHTML = `
    <div class="design-detail-headline">
      <h2>${escapeHtml(ue.code)} — ${escapeHtml(ue.title)}</h2>
      ${metaLine}
    </div>
    <div class="entity-actions">
      <button class="icon-button small" data-export-ue="${escapeAttr(ue.id)}" title="Exporter la progression de cette UE" aria-label="Exporter la progression de l’UE ${escapeAttr(ue.code)}">⎙</button>
      <button type="button" class="small secondary" data-edit-ue="${escapeAttr(ue.id)}">Modifier l’UE</button>
    </div>`;

  const sequences = state.sequences.filter(seq => seq.ueId === ue.id).sort((a, b) => sequenceSortKey(a).localeCompare(sequenceSortKey(b)));
  const allSessions = state.sessions.filter(s => s.ueId === ue.id).sort((a, b) => sessionSortKey(a).localeCompare(sessionSortKey(b)));
  const capacities = ueCapacities(ue);

  const countSeq = $('#designCountSequences'); if (countSeq) countSeq.textContent = String(sequences.length);
  const countSess = $('#designCountSessions'); if (countSess) countSess.textContent = String(allSessions.length);
  const countCap = $('#designCountCapacities'); if (countCap) countCap.textContent = String(capacities.length);

  const tree = $('#ueTree');
  const openKeys = captureOpenKeys(tree);
  tree.innerHTML = renderDesignSequencesPanel(ue, sequences);
  restoreOpenKeys(tree, openKeys);

  $('#designSessionsPanel').innerHTML = !jeSuisEnseignantDeLUe(ue)
    ? '<p class="meta design-not-mine-hint">Vous n’êtes pas enregistré·e comme enseignant·e sur cette UE : son contenu pédagogique (séquences, séances) n’est pas affiché.</p>'
    : allSessions.length
      ? allSessions.map((s, i) => renderSessionCard(s, i + 1)).join('')
      : '<p class="meta">Aucune séance dans cette UE.</p>';

  $('#designCapacitiesPanel').innerHTML = renderCapacityList(capacities);

  setDesignTab(designActiveTab);
}

/* Contenu de l'onglet « Séquences » : ex-corps de renderUeCard, sans le
   bandeau UE (devenu l'en-tête du panneau de détail) — la sélection d'UE se
   fait maintenant dans le sidebar, une seule à la fois. */
function renderDesignSequencesPanel(ue, sequences) {
  // Retours #3 (18-19/08/2026) — Cas 1 : pas enseignant·e de cette UE, aucun
  // contenu de séquence/séance (les affichages génériques — en-tête d'UE,
  // capacités du référentiel — restent, eux, dans renderDesignDetail).
  if (!jeSuisEnseignantDeLUe(ue)) {
    return '<p class="meta design-not-mine-hint">Vous n’êtes pas enregistré·e comme enseignant·e sur cette UE : son contenu pédagogique (séquences, séances) n’est pas affiché.</p>';
  }
  // Lot K — séances d'EIL (rattachées à une semaine thématique) portées par cette
  // UE : regroupées par contrainte thématique, sous les séquences.
  const eilGroups = {};
  state.sessions.filter(s => s.ueId === ue.id && s.constraintId).forEach(s => {
    (eilGroups[s.constraintId] = eilGroups[s.constraintId] || []).push(s);
  });
  const eilBlock = Object.entries(eilGroups).map(([cid, list]) => {
    const c = findConstraint(cid);
    const ordered = [...list].sort((a, b) => sessionSortKey(a).localeCompare(sessionSortKey(b)));
    return `<div class="eil-detail-group"><div class="eil-detail-head"><span class="entity-level-label">EIL</span><strong>${escapeHtml(c ? c.label : 'Semaine thématique')}</strong></div><div class="session-card-grid">${ordered.map((s, i) => renderSessionCard(s, i + 1)).join('')}${renderAddTile(`data-new-eil-session="${escapeAttr(cid)}" data-eil-ue="${escapeAttr(ue.id)}"`, 'Séance')}</div></div>`;
  }).join('');
  // Séances rattachées à l'UE mais à AUCUNE séquence (et hors semaine thématique
  // EIL) : sinon elles n'apparaissaient nulle part dans l'arbre de conception.
  const looseSessions = state.sessions
    .filter(s => s.ueId === ue.id && !s.sequenceId && !s.constraintId)
    .sort((a, b) => sessionSortKey(a).localeCompare(sessionSortKey(b)));
  const sansSequence = !sequences.length;
  const looseInner = looseSessions.map((s, i) => renderSessionCard(s, i + 1)).join('')
    + renderAddTile(`data-new-session-ue="${escapeAttr(ue.id)}"`, 'Séance');
  const looseMasque = !looseSessions.length && !sansSequence;
  const looseBlock = `<div class="loose-detail-group${looseMasque ? ' loose-empty' : ''}" data-loose-drop="${escapeAttr(ue.id)}"><div class="loose-detail-head"><span class="entity-level-label">Sans séquence</span><strong>Séances rattachées directement à l’UE</strong></div><div class="session-card-grid">${looseInner}</div></div>`;
  return `<div class="nested-list">${sequences.map(renderSequenceCard).join('')}${renderAddBand(`data-new-sequence-ue="${escapeAttr(ue.id)}"`, 'Séquence')}</div>
    ${eilBlock}
    ${looseBlock}`;
}

function setDesignTab(tab) {
  designActiveTab = tab;
  $$('.design-subtab').forEach(btn => {
    const active = btn.dataset.designTab === tab;
    btn.classList.toggle('active', active);
    btn.setAttribute('aria-selected', String(active));
  });
  const panels = { sequences: '#ueTree', sessions: '#designSessionsPanel', capacities: '#designCapacitiesPanel' };
  Object.entries(panels).forEach(([key, sel]) => { const el = $(sel); if (el) el.hidden = key !== tab; });
}

/* Construit une grille label/valeur en ignorant les champs vides : on ne
   montre jamais "Non renseigné" pour un champ optionnel, seulement ce qui
   a réellement été saisi dans le formulaire. */
function renderInfoGrid(pairs = []) {
  const rows = pairs.filter(([, value]) => value !== undefined && value !== null && String(value).trim() !== '');
  if (!rows.length) return '';
  return `<div class="info-grid">${rows.map(([label, value]) => {
    const text = String(value).trim();
    // Si le champ saisi répète déjà le nom du champ (ex. "Volume" -> "Volume à préciser"),
    // on n'affiche pas l'étiquette une seconde fois : seul le contenu réel est montré.
    const redundant = text.toLowerCase().startsWith(label.toLowerCase());
    return redundant
      ? `<div class="info-row info-row-plain"><strong>${escapeHtml(text)}</strong></div>`
      : `<div class="info-row"><span>${escapeHtml(label)}</span><strong>${escapeHtml(text)}</strong></div>`;
  }).join('')}</div>`;
}

function shortSemester(semester = '') {
  return String(semester || '').replace('Semestre ', 'S');
}

/* Ligne d'informations inline, sans étiquette de catégorie : les valeurs
   parlent d'elles-mêmes (dates, "24h", initiales, codes capacités). Chaque
   valeur non vide devient une "puce" séparée par un séparateur léger. */
function renderMetaLine(values = []) {
  const items = values.filter(v => v !== undefined && v !== null && String(v).trim() !== '');
  if (!items.length) return '';
  return `<div class="meta-line">${items.map(v => `<span class="meta-item">${escapeHtml(String(v).trim())}</span>`).join('')}</div>`;
}

/* Période d'une UE exprimée en dates (bornes de semaines) quand on les a,
   sinon le libellé texte saisi. */
function ueDatePeriod(ue = {}) {
  const start = ue.startWeekId ? weekDateStart(ue.startWeekId) : '';
  const end = ue.endWeekId ? weekDateEnd(ue.endWeekId) : '';
  if (start && end) return `${start} → ${end}`;
  if (start) return `dès ${start}`;
  return ue.period || '';
}

function weekDateStart(weekId) {
  const range = state.weeks.find(w => w.id === weekId)?.dateRange || '';
  return range.split(/[–-]/)[0]?.trim() || '';
}
function weekDateEnd(weekId) {
  const range = state.weeks.find(w => w.id === weekId)?.dateRange || '';
  const parts = range.split(/[–-]/);
  return parts[parts.length - 1]?.trim() || '';
}


function weekLabelFromNumber(number) {
  const n = Number(number);
  if (!Number.isFinite(n)) return '';
  const week = state.weeks.find(w => weekNumberOf(w) === n);
  return week?.label || `S${String(n).padStart(2, '0')}`;
}

function sequencePeriodParts(seq = {}) {
  const ranges = parseWeekRanges(seq.targetWeeks || '');
  const first = ranges[0] || {};
  const start = first.start ? weekLabelFromNumber(first.start) : '';
  const end = first.end ? weekLabelFromNumber(first.end) : (first.start ? start : '');
  // 17/08 — Martin veut garder l'indicatif de semaines mais y ajouter les vraies
  // dates + le nombre de semaines couvertes (les deux se déduisent de state.weeks).
  const startWeek = first.start ? state.weeks.find(w => weekNumberOf(w) === first.start) : null;
  const endWeek = first.end ? state.weeks.find(w => weekNumberOf(w) === first.end) : startWeek;
  const dateStart = startWeek ? weekDateStart(startWeek.id) : '';
  const dateEnd = endWeek ? weekDateEnd(endWeek.id) : '';
  const dates = dateStart && dateEnd ? (dateStart === dateEnd ? dateStart : `${dateStart} – ${dateEnd}`) : '';
  const weeksCount = (first.start && first.end) ? (first.end - first.start + 1) : (first.start ? 1 : 0);
  return {
    start,
    end,
    label: start && end ? (start === end ? start : `${start} → ${end}`) : (seq.targetWeeks || ''),
    dates,
    weeksLabel: weeksCount ? `${weeksCount} semaine${weeksCount > 1 ? 's' : ''}` : ''
  };
}

/* Première semaine (weekId) couverte par une séquence, déduite de son champ
   targetWeeks (ex. "S37-S40" -> weekId de S37 dans l'année de la promo). Sert de
   semaine par défaut pour une nouvelle séance rattachée à cette séquence. */
function firstWeekIdOfSequence(seq) {
  if (!seq) return '';
  const n = parseWeekRanges(seq.targetWeeks || '')[0]?.start;
  if (!n) return '';
  const span = weeksForSemesterSpan(seq.semester || findUe(seq.ueId)?.semester || 'Semestre 1');
  return (span.find(w => weekNumberOf(w) === Number(n)) || {}).id || '';
}

/* Lot C [12] — clé de tri CHRONOLOGIQUE d'une séquence : rang de sa première
   semaine dans le calendrier de l'année (et non le numéro de semaine brut, qui
   repartirait à 1 en janvier et remonterait janvier avant septembre). Une
   séquence sans semaine cible n'a pas de place dans le calendrier : elle passe
   en fin de liste plutôt que de s'intercaler au hasard. */
function sequenceSortKey(seq) {
  const weekId = firstWeekIdOfSequence(seq);
  const index = weekId ? weekChronoIndex(weekId) : 999;
  return `${String(index).padStart(3, '0')}-${String(seq?.order || '').padStart(8, '0')}-${seq?.title || ''}`;
}

/* Initiales d'UN seul enseignant (déjà des initiales si saisi ainsi, sinon
   premières lettres de chaque mot du nom). */
function teacherInitialsOf(token = '') {
  const clean = String(token).trim();
  if (!clean) return '';
  if (/^[A-ZÀ-Ÿ]{1,4}$/i.test(clean) && !clean.includes(' ')) return clean.toUpperCase();
  const parts = clean.split(/\s+/).filter(Boolean);
  return parts.map(part => part[0] || '').join('').slice(0, 4).toUpperCase();
}

/* Liste { name, initials } pour afficher une pastille par enseignant. */
function teacherPips(value = '') {
  return teacherTokens(value)
    .map(name => ({ name, initials: teacherInitialsOf(name) }))
    .filter(t => t.initials);
}

// Retours #3 (18-19/08/2026) — « pastilles initiales d'enseignant » :
// harmonisation demandée sur tous les écrans. `onTint` bascule le pourtour/
// texte sur --ue-deep (teinte du fond coloré : bandeau de séquence, tuile
// séance) au lieu du bleu générique --acc, utilisé partout ailleurs (contexte
// lié à une UE plutôt qu'à un fond coloré — Martin a confirmé garder le bleu
// actuel dans ce cas). Plein pour moi (.is-mine), vide pour les collègues.
function teacherPillsMarkup(value = '', onTint = false) {
  const cls = 'design-ue-pill' + (onTint ? ' on-tint' : '');
  return teacherPips(value)
    .map(p => `<span class="${cls}${p.initials.toLowerCase() === moiInitiales.toLowerCase() ? ' is-mine' : ''}" title="${escapeAttr(p.name)}">${escapeHtml(p.initials)}</span>`)
    .join('');
}

function compactKeywords(value = '', max = 4) {
  return String(value || '')
    .split(/[;,\n]/)
    .map(x => x.trim())
    .filter(Boolean)
    .slice(0, max);
}

function renderMetaChips(items = []) {
  return items
    .filter(item => item && item.value)
    .map(item => `<span class="meta-chip ${escapeAttr(item.className || '')}" title="${escapeAttr(item.label || '')}">${escapeHtml(item.value)}</span>`)
    .join('');
}

function renderKeywordChips(keywords = []) {
  return keywords.map(k => `<span class="keyword-chip">${escapeHtml(k)}</span>`).join('');
}

function compactUeCode(code = '') {
  return String(code || '').replace(/^UE\s*/i, '').trim();
}

function renderSequenceCard(seq) {
  const sessions = state.sessions.filter(s => s.sequenceId === seq.id);
  const fictiveCount = sessions.filter(isFictiveSession).length;
  const color = sequenceColor(seq.id); // Lot L — couleur cohérente avec la frise
  const period = sequencePeriodParts(seq);
  const periodLabel = [period.label, period.dates, period.weeksLabel].filter(Boolean).join(' · ');
  const teacherValue = seq.teacher || findUe(seq.ueId)?.teacher || '';
  const teacherPillsHtml = teacherPillsMarkup(teacherValue, true);
  const keywords = compactKeywords(seq.keywords, 8);
  const capCodes = (seq.capacityCodes || []).join(', ');
  const metaLine = renderMetaLine([periodLabel, seq.hoursEstimate, capCodes]);
  // Retours #3 (18-19/08/2026) — Cas 2 : séquence d'un ou plusieurs collègues
  // seuls (je suis enseignant·e de l'UE, mais pas rattaché·e à CETTE séquence).
  // Visible, en style atténué, mais pas ouvrable — un <div> statique plutôt
  // qu'un <details> : pas de bascule d'ouverture possible.
  if (!contenuInteractifPourMoi(seq)) {
    return `<div class="entity-card entity-sequence is-collegue" style="--ue-color:${color}; --ue-soft:${hexToRgba(color, .12)}; --ue-ink:${inkColor(color)}; --ue-deep:${deepColor(color)}" title="Séquence d'un ou plusieurs collègues — pas la vôtre">
      <div class="entity-card-locked-head">
        <span class="entity-level-label">Séquence</span>
        <span class="entity-title">${escapeHtml(seq.title)}</span>
        ${teacherPillsHtml ? `<span class="design-ue-pills entity-teachers">${teacherPillsHtml}</span>` : ''}
        <span class="entity-count">${sessions.length} séance${sessions.length > 1 ? 's' : ''}</span>
      </div>
    </div>`;
  }
  // Séances numérotées à partir de 1 dans l'ordre de la séquence.
  const orderedSessions = [...sessions].sort((a, b) => sessionSortKey(a).localeCompare(sessionSortKey(b)));
  return `<details class="entity-card entity-sequence" data-open-key="seq:${escapeAttr(seq.id)}" data-seq-drop="${escapeAttr(seq.id)}" style="--ue-color:${color}; --ue-soft:${hexToRgba(color, .12)}; --ue-ink:${inkColor(color)}; --ue-deep:${deepColor(color)}">
    <summary>
      <span class="entity-chevron">▸</span>
      <span class="entity-level-label">Séquence</span>
      <span class="entity-title">${escapeHtml(seq.title)}</span>
      ${teacherPillsHtml ? `<span class="design-ue-pills entity-teachers">${teacherPillsHtml}</span>` : ''}
      <span class="entity-count">${sessions.length} séance${sessions.length > 1 ? 's' : ''} · ${fictiveCount} à placer</span>
    </summary>
    <div class="entity-body sequence-body">
      <div class="entity-headline">
        ${metaLine}
        <div class="entity-actions">
          <button class="icon-button small" data-export-sequence="${escapeAttr(seq.id)}" title="Exporter cette séquence" aria-label="Exporter la séquence « ${escapeAttr(seq.title)} »">⎙</button>
          <button class="small secondary" data-edit-sequence="${escapeAttr(seq.id)}">Modifier</button>
        </div>
      </div>
      ${seq.periodNote ? `<p class="entity-description">${escapeHtml(seq.periodNote)}</p>` : ''}
      ${seq.objectives ? `<p class="entity-description"><strong>Objectifs —</strong> ${escapeHtml(truncate(seq.objectives, 280))}</p>` : ''}
      ${keywords.length ? `<p class="entity-description entity-keywords"><strong>Mots-clés —</strong> ${escapeHtml(keywords.join(', '))}</p>` : ''}
      <div class="session-card-grid">
        ${orderedSessions.map((s, i) => renderSessionCard(s, i + 1)).join('')}
        ${renderAddTile(`data-new-session-sequence="${escapeAttr(seq.id)}"`, 'Séance')}
      </div>
    </div>
  </details>`;
}

/* Lot C-bis — `statusSlug()` a été supprimée : elle traduisait un statut en
   classe de pastille, et plus aucun statut n'est affiché (celui de la séance
   comme celui de la séquence ont quitté les formulaires). Seule subsiste la
   pastille `room-urgent` du tableau de bord, qui n'est pas un statut mais un
   délai calculé. */

/* Carte de séance « format fiche » : petit rectangle vertical (évoque une
   feuille A4), numéroté à partir de 1 dans la séquence. La carte entière est
   cliquable et ouvre le formulaire (Lot 8 — plus de bouton « Modifier » isolé
   en pied, redondant avec la tuile déjà cliquable) ; tabindex + role="button"
   pour garder l'accès clavier que le bouton supprimé assurait jusqu'ici (voir
   le clavier global sur .session-card dans bindEvents). Forme volontairement
   différente des cartes UE/séquence (qui sont des bandeaux horizontaux
   dépliables). */
/* Tuile d'ajout : même gabarit que les tuiles de séance, en plus sobre
   (pointillés, pas de couleur d'UE). Elle prend la place que tenait le bouton
   « + Séance » en tête d'encart, ce qui libère cette tête pour « Modifier » et
   rend au bandeau sommaire son rôle unique de déplier/replier. */
function renderAddTile(attrs, label) {
  return `<button type="button" class="session-card add-card" ${attrs} aria-label="Ajouter : ${escapeAttr(label)}">
    <span class="add-card-plus" aria-hidden="true">+</span>
    <span class="add-card-label">${escapeHtml(label)}</span>
  </button>`;
}

/* Même idée, en bande : les séquences sont des bandeaux pleine largeur, pas des
   tuiles — une carte de 210 px isolée en bout de colonne aurait flotté. La
   bande ferme la liste des séquences, juste avant le bloc « Sans séquence ». */
function renderAddBand(attrs, label) {
  return `<button type="button" class="add-band" ${attrs}><span aria-hidden="true">+</span> ${escapeHtml(label)}</button>`;
}

function renderSessionCard(s, number) {
  const color = sessionTint(s); // Lot L — la séance hérite de la couleur de sa séquence
  const temporal = isFictiveSession(s)
    ? [weekLabel(s.targetWeekId), s.fictiveDay !== '' ? DAY_NAMES[Number(s.fictiveDay)] : '', sessionHoursLabel(s)].filter(Boolean).join(' · ')
    : [weekLabel(s.weekId), DAY_NAMES[s.day], slotLabel(s.startSlot)].filter(Boolean).join(' · ');
  const keywords = compactKeywords(s.keywords, 4);
  // Lot C-bis — la tuile n'est plus coiffée d'un aplat vif : son CORPS devient
  // pastel et son titre prend la couleur. L'encre est donc calculée sur le
  // pastel réellement obtenu, pas sur la surface nue.
  const pastel = hexToRgba(color, .13);
  const ink = inkColor(color, mixHex(color, '#fbfcf9', .13));
  const teachers = teacherPillsMarkup(s.teacher, true);
  // Retours #3 (18-19/08/2026) — Cas 2 : séance d'un ou plusieurs collègues
  // seuls, visible mais pas ouvrable (ni glissable) ; Cas 3 (mienne, ou sans
  // enseignant assigné) : comportement inchangé.
  const mien = contenuInteractifPourMoi(s);
  const interactiveAttrs = mien
    ? `draggable="true" tabindex="0" role="button" aria-label="Modifier la séance « ${escapeAttr(s.title)} »" data-drag-session="${escapeAttr(s.id)}" data-edit-session="${escapeAttr(s.id)}"`
    : `aria-label="Séance « ${escapeAttr(s.title)} » — collègue(s) seul(s), pas la vôtre" title="Collègue(s) seul(s) — pas la vôtre"`;
  return `<article class="session-card ${typeClass(s.type)}${mien ? '' : ' is-collegue'}" ${interactiveAttrs} style="--ue-color:${color}; --ue-soft:${pastel}; --ue-ink:${ink}; --ue-deep:${deepColor(color)}">
    <header class="session-card-head">
      <span class="session-card-number">${number}</span>
      ${s.type ? `<span class="session-card-headtype" title="${escapeAttr(s.type)}">${escapeHtml(s.type)}</span>` : '<span class="session-card-headtype"></span>'}
      ${placementFlag(s)}
    </header>
    <h5 class="session-card-title">${escapeHtml(s.title)}</h5>
    ${teachers ? `<span class="design-ue-pills tile-teachers">${teachers}</span>` : ''}
    ${temporal ? `<p class="session-card-meta">${escapeHtml(temporal)}</p>` : ''}
    ${s.room ? `<p class="session-card-meta">${escapeHtml(s.room)}</p>` : ''}
    ${keywords.length ? `<p class="session-card-keywords">${escapeHtml(keywords.join(', '))}</p>` : ''}
  </article>`;
}

// Lot 10 — tuile compacte pour l'encart « Séances à placer » du Planning
// hebdo : la pastille « À placer » et le bouton dédié sont redondants avec
// l'emplacement (déjà « à placer » par nature) ; la tuile entière est
// cliquable, comme les cartes de Conception pédagogique.
// Lot E [19] — elle reprend la silhouette de `renderSessionCard` telle que le
// lot C-bis l'a redessinée : tête foncée portant le type, corps pastel, titre
// encré. Elle en garde deux différences volontaires : pas de numéro (la
// réserve ne montre QUE les séances à placer d'une séquence, un « 1, 2 » y
// désignerait d'autres séances que dans la Conception) et pas de marqueur de
// placement (ici, aucune n'est placée — le signe serait le même partout).
function renderBacklogSessionTile(s) {
  const color = sessionTint(s);
  // Retours 17/08/2026 — UE + promo remplacent le nombre d'heures : ce qui
  // manque pour placer la séance (dans quelle UE, pour quelle promo), pas sa
  // durée (déjà lisible dans la fiche). Le bandeau de type de séance (tête)
  // ne change pas.
  const temporal = [weekLabel(s.targetWeekId), s.fictiveDay !== '' ? DAY_NAMES[Number(s.fictiveDay)] : ''].filter(Boolean).join(' · ');
  const ueLabel = ueCodeOnly(s.ueId) !== 'UE ?' ? 'UE ' + ueCodeOnly(s.ueId) : '';
  const infoLigne = [ueLabel, s.promotion].filter(Boolean).join(' · ');
  const keywords = compactKeywords(s.keywords, 3);
  const pastel = hexToRgba(color, .13);
  const ink = inkColor(color, mixHex(color, '#fbfcf9', .13));
  const teachers = teacherPillsMarkup(s.teacher, true);
  return `<article class="session-card backlog-session-tile ${typeClass(s.type)}" draggable="true" tabindex="0" role="button" aria-label="Modifier la séance « ${escapeAttr(s.title)} »" style="--ue-color:${color}; --ue-soft:${pastel}; --ue-ink:${ink}; --ue-deep:${deepColor(color)}" data-drag-session="${escapeAttr(s.id)}" data-edit-session="${escapeAttr(s.id)}">
    <header class="session-card-head">
      <span class="drag-handle" aria-hidden="true">⠿</span>
      <span class="session-card-headtype" title="${escapeAttr(s.type || '')}">${escapeHtml(s.type || 'Séance')}</span>
    </header>
    <h5 class="session-card-title">${escapeHtml(s.title)}</h5>
    ${infoLigne ? `<p class="session-card-meta">${escapeHtml(infoLigne)}</p>` : ''}
    ${temporal ? `<p class="session-card-meta">${escapeHtml(temporal)}</p>` : ''}
    ${teachers ? `<span class="design-ue-pills tile-teachers">${teachers}</span>` : ''}
    ${keywords.length ? `<p class="session-card-keywords">${escapeHtml(keywords.join(', '))}</p>` : ''}
  </article>`;
}

/* Infobulle synthétique pour une contrainte d'examen renseignée. */
function examConstraintTooltip(c) {
  if (!c.exam) return '';
  const ue = (state.ues || []).find(u => u.id === c.exam.ueId);
  const parts = [
    ue ? `UE : ${ue.code}` : '',
    c.exam.control ? `Contrôle ${c.exam.control}` : '',
    (c.exam.capacityCodes || []).length ? `Capacités : ${c.exam.capacityCodes.join(', ')}` : '',
    c.exam.absences ? `Absences : ${c.exam.absences}` : '',
    c.exam.remarks ? `Remarques : ${c.exam.remarks}` : ''
  ].filter(Boolean);
  return parts.join(' · ');
}

function renderGantt() {
  if (!$('#ganttTimeline')) return;
  if (!ganttPromo || !state.promotions.includes(ganttPromo)) ganttPromo = state.promotions[0] || 'GPN1';
  const pair = SEMESTER_PAIRS.find(p => p.promotion === ganttPromo) || SEMESTER_PAIRS[0];
  if (!ganttSemester || !pair.semesters.includes(ganttSemester)) {
    ganttSemester = semestresDeLaSaison().find(s => pair.semesters.includes(s)) || pair.semesters[0];
  }
  const weeks = weeksForSemester(ganttSemester);
  const ues = state.ues.filter(ue => ueInSemester(ue, ganttSemester))
    .sort((a, b) => compactUeCode(a.code).localeCompare(compactUeCode(b.code), 'fr', { numeric: true }));
  // Sidebar Conception mise à part (REGLES.md #21), c'est le seul vrai
  // sélecteur (une UE à la fois) de l'app : la case « Empiler » ci-dessous en
  // est l'exception assumée (voir README « Progression »).
  if (!ues.some(ue => ue.id === ganttSelectedUeId)) {
    ganttSelectedUeId = (mesUesParDefaut(ues)[0] || ues[0] || {}).id || '';
  } else {
    ganttDefautMessage = '';
  }
  renderGanttTopBar();
  renderGanttUeCards(ues);
  const visibleUes = ganttStacked ? ues : ues.filter(ue => ue.id === ganttSelectedUeId);
  ganttLastUes = visibleUes;
  ganttLastWeeks = weeks;
  renderGanttSequencesPanel(visibleUes, weeks);
  renderGanttSessionsPanel(visibleUes, weeks);
  computeGanttHorsFenetre(visibleUes, weeks);
}

/* Codes d'UE : le Ruban les écrit sans espace (« UE1.1 »), les UE du planning
   avec (« UE 1.1 »). Toute comparaison entre les deux mondes passe par ici. */
function ueCodeCompact(code) { return String(code || '').replace(/\s+/g, '').toUpperCase(); }

/* Lot D [16] — QUI enseigne une UE ? La réponse vit dans le RUBAN (onglet
   « Référentiel & Ruban » → Tableau détaillé), colonne « Enseignants »,
   renseignée capacité par capacité : c'est la seule source que l'enseignant
   tient à jour. Le champ « Enseignant » de la fiche d'UE ne compte que comme
   appoint (union), il est souvent laissé vide.
   ⚠️ Les colonnes du Ruban sont livrées VIDES dans ruban-pedagogique.js (dépôt
   public, aucune donnée nominative) : tant qu'elles ne sont pas remplies dans
   l'app, aucune UE ne « me » revient — d'où le message de repli plus bas. */
function enseignantsDeLUe(ue) {
  const cible = ueCodeCompact(ue?.code);
  const initiales = new Set(teacherTokens(ue?.teacher).map(teacherInitialsOf).filter(Boolean));
  (rubanData()?.semestres || []).forEach(s => (s.ues || []).forEach(u => {
    if (ueCodeCompact(u.code) !== cible) return;
    rubanUeCapacities(u).forEach(c => (c.enseignants || []).forEach(t => {
      const initiale = String(t).trim().toUpperCase();
      if (initiale) initiales.add(initiale);
    }));
  }));
  return [...initiales];
}

/* Cochage d'office : l'UE que j'enseigne. Repli sur la première quand rien ne
   me revient — accompagné d'un message, sinon on croit à une erreur. Le
   message est consommé par renderGanttUeCards. */
let ganttDefautMessage = '';
function mesUesParDefaut(ues = []) {
  const miennes = moiInitiales ? ues.filter(ue => enseignantsDeLUe(ue).includes(moiInitiales)) : [];
  if (miennes.length) {
    ganttDefautMessage = '';
    return miennes;
  }
  ganttDefautMessage = moiInitiales
    ? `Aucune UE de ce semestre ne porte vos initiales (${moiInitiales}) dans le Ruban : sélection par défaut. Renseigner la colonne « Enseignants » du Tableau détaillé (onglet Référentiel) pour que la frise s'ouvre sur votre UE.`
    : '';
  return ues.slice(0, 1);
}

function renderGanttUeCards(ues = []) {
  const container = $('#ganttUeCards');
  if (!container) return;
  container.innerHTML = ues.length ? ues.map(ue => {
    const seqCount = state.sequences.filter(seq => seq.ueId === ue.id).length;
    const sessCount = state.sessions.filter(s => s.ueId === ue.id).length;
    const teachers = enseignantsDeLUe(ue);
    const pills = teachers.map(i => `<span class="design-ue-pill${i === moiInitiales ? ' is-mine' : ''}">${escapeHtml(i)}</span>`).join('');
    const selected = ue.id === ganttSelectedUeId;
    const countLabel = (seqCount || sessCount) ? `${seqCount} séq · ${sessCount} séance${sessCount > 1 ? 's' : ''}` : 'aucune séquence';
    return `<button type="button" class="progression-ue-card${selected ? ' is-selected' : ''}${!seqCount ? ' is-empty' : ''}" data-select-gantt-ue="${escapeAttr(ue.id)}" aria-pressed="${selected}">
      <span class="progression-ue-card-title">${escapeHtml(ue.code)} — ${escapeHtml(ue.title)}</span>
      <span class="progression-ue-card-sub"><span class="progression-ue-card-count">${escapeHtml(countLabel)}</span>${pills ? `<span class="design-ue-pills">${pills}</span>` : ''}</span>
    </button>`;
  }).join('') : '<p class="meta">Aucune UE pour ce semestre.</p>';
  const countEl = $('#ganttUeCount');
  if (countEl) countEl.textContent = String(ues.length);
  const note = $('#ganttUeNote');
  if (note) note.textContent = ganttDefautMessage || '';
}

/* Lot 4 — cadrer la frise sur la semaine en cours à l'ouverture de l'onglet
   « Progression ». Recalcule aussi « hors fenêtre » (voir plus bas) : au
   moment du rendu déclenché par renderAll(), le panneau était peut-être
   caché (display:none → clientWidth invalide), donc sans effet avant cette
   activation d'onglet. */
function scrollGanttToCurrentWeek() {
  ['#ganttSequencesScroll', '#ganttSessionsScroll'].forEach(sel => {
    $(sel)?.querySelector('.is-current-week')?.scrollIntoView({ inline: 'center', block: 'nearest' });
  });
  computeGanttHorsFenetre(ganttLastUes, ganttLastWeeks);
}

/* En-tête des semaines, partagé par les deux bandes (Séquences et Séances) :
   mêmes colonnes, mêmes repères (contrainte, semaine en cours, samedi…). Les
   deux bandes ne sont PAS imbriquées dans une grille commune (README : elles
   se relient par la couleur de séquence, pas par un alignement mécanique). */
function renderGanttWeekHeaderRow(weeks, promotion, cornerLabel) {
  const todayWeekId = currentWeekId();
  const corner = `<div class="timeline-corner" style="grid-column: 1; grid-row: 1;">${escapeHtml(cornerLabel)}</div>`;
  const cells = weeks.map((week, i) => {
    const constraints = constraintsForWeek(week, promotion);
    const blocked = isBlockedWeek(week, promotion);
    const headerConstraints = constraints.filter(c => !isThematicConstraint(c));
    const otherPromoThematic = thematicItemsForWeek(week).filter(item => !item.promos.includes(promotion));
    const satSessions = state.sessions.filter(s => isDefinitiveSession(s) && Number(s.day) === 5 && s.weekId === week.id && findUe(s.ueId)?.promotion === promotion);
    const isCurrent = week.id === todayWeekId;
    return `<div class="timeline-week-head ${constraints.length ? 'has-constraint' : ''} ${blocked ? 'blocked-week' : ''} ${otherPromoThematic.length ? 'has-eil-info' : ''}${satSessions.length ? ' has-sat' : ''}${isCurrent ? ' is-current-week' : ''}" style="grid-column: ${i + 2}; grid-row: 1;" data-week-drop="${escapeAttr(week.id)}">
      <strong>${escapeHtml(week.label.replace('S0', 'S'))}</strong><span>${escapeHtml(compactDateRange(week.dateRange))}</span>${isCurrent ? '<em class="timeline-week-current">Cette semaine</em>' : ''}${headerConstraints.length ? `<em>${headerConstraints.map(c => escapeHtml(c.label)).join(' · ')}</em>` : ''}${otherPromoThematic.length ? `<em class="timeline-week-eil" title="${escapeAttr('Autre(s) promo(s) en semaine thématique : ' + otherPromoThematic.map(i => `${i.title} (${i.promos.join('/')})`).join(' · '))}">◇ ${escapeHtml(otherPromoThematic.map(i => `${i.promos.join('/')} : ${i.title}`).join(' · '))}</em>` : ''}${satSessions.length ? `<em class="timeline-week-sat" title="${escapeAttr('Samedi : ' + satSessions.map(s => s.title).join(' · '))}">📅 Sam : ${escapeHtml(satSessions.map(s => s.title).join(' · '))}</em>` : ''}
    </div>`;
  }).join('');
  return corner + cells;
}

/* Bande SÉQUENCES : une grille CSS partagée par toutes les UE affichées — une
   ligne « Semaines particulières » (contraintes/périodes, UE-agnostique) en
   haut, puis un groupe de lignes par UE (un couloir par ligne, plusieurs si
   des séquences se chevauchent dans le temps), et « Hors fenêtre » en pied
   (résumé texte calculé après coup par computeGanttHorsFenetre, une fois la
   largeur réellement rendue connue). */
function renderGanttSequencesPanel(ues, weeks) {
  const grid = $('#ganttSequencesGrid');
  if (!grid) return;
  const promotion = ganttPromo;
  grid.style.cssText = `grid-template-columns: var(--timeline-label-col) repeat(${weeks.length}, minmax(var(--timeline-week-min), 1fr)); --timeline-week-count: ${weeks.length};`;

  const weekRow = renderGanttWeekHeaderRow(weeks, promotion, 'UE');

  const constraintBands = timelineConstraintBands(promotion, weeks);
  const constraintItems = constraintBands.map(segment => ({ startIndex: segment.startIndex, endIndex: segment.endIndex, segment }));
  const constraintLanes = Math.max(1, assignBandLanes(constraintItems));
  let rowCursor = 2;
  const constraintBg = weeks.map((week, i) => `<div class="timeline-seq-bg ${isBlockedWeek(week, promotion) ? 'is-blocked' : ''} ${weekIsThematic(week, promotion) ? 'is-thematic' : ''}${week.id === currentWeekId() ? ' is-current-week' : ''}" style="grid-column: ${i + 2}; grid-row: ${rowCursor} / span ${constraintLanes};" aria-hidden="true"></div>`).join('');
  const constraintInner = constraintItems.map(item => renderConstraintBandHtml(item.segment, rowCursor + item.lane)).join('');
  const constraintLabel = `<div class="timeline-row-label header-label" style="grid-row: ${rowCursor} / span ${constraintLanes};">Semaines particulières</div>`;
  rowCursor += constraintLanes;

  const ueBlocks = ues.map(ue => {
    // Retours #3 (18-19/08/2026) — Cas 1 : pas enseignant·e de cette UE, aucune
    // séquence n'est positionnée dans sa ligne (message dédié, distinct de
    // « aucune séquence positionnée » qui donnerait à tort l'impression qu'il
    // suffit d'en créer une).
    const mienne = jeSuisEnseignantDeLUe(ue);
    const ueSessions = mienne ? state.sessions.filter(s => s.ueId === ue.id) : [];
    const sequences = mienne ? state.sequences.filter(seq => seq.ueId === ue.id) : [];
    const bands = sequences.flatMap(seq => sequenceWeekSegments(seq, weeks).map(segment => ({ ...segment, seq })));
    const items = bands.map(segment => ({ startIndex: segment.startIndex, endIndex: segment.endIndex, segment }));
    const lanes = Math.max(1, assignBandLanes(items));
    const bg = weeks.map((week, i) => `<div class="timeline-seq-bg ${isBlockedWeek(week, promotion) ? 'is-blocked' : ''} ${isThematicBlocked(week, promotion, ue.id, ueSessions) ? 'is-thematic' : ''}${week.id === currentWeekId() ? ' is-current-week' : ''}" style="grid-column: ${i + 2}; grid-row: ${rowCursor} / span ${lanes};" aria-hidden="true"></div>`).join('');
    const inner = !mienne
      ? `<div class="timeline-no-sequence" style="grid-column: 2 / -1; grid-row: ${rowCursor};">Vous n’êtes pas enregistré·e comme enseignant·e sur cette UE.</div>`
      : items.length ? items.map(item => renderSequenceBandHtml(item.segment, rowCursor + item.lane, promotion, weeks)).join('') : `<div class="timeline-no-sequence" style="grid-column: 2 / -1; grid-row: ${rowCursor};">Aucune séquence positionnée.</div>`;
    const label = `<div class="timeline-row-label" style="grid-row: ${rowCursor} / span ${lanes};">${escapeHtml(ue.code)} — ${escapeHtml(ue.title)}</div>`;
    rowCursor += lanes;
    return bg + inner + label;
  }).join('');

  const horsFenetreRow = `<div class="timeline-row-label header-label" style="grid-row: ${rowCursor};">Hors fenêtre</div><div class="progression-hors-fenetre" id="ganttHorsFenetre" style="grid-column: 2 / -1; grid-row: ${rowCursor};"></div>`;

  grid.innerHTML = ues.length
    ? weekRow + constraintLabel + constraintBg + constraintInner + ueBlocks + horsFenetreRow
    : weekRow + constraintLabel + constraintBg + constraintInner + `<div class="timeline-no-sequence" style="grid-column: 2 / -1; grid-row: ${rowCursor};">Sélectionner une UE à afficher.</div>`;
}

/* 18/08 — bande réduite à sa couleur (catégorie du type, via .period-*) + son
   nom, sur consigne directe (« créneaux de période particulière réduits à
   leur bande + nom »). Le type et la période restent lisibles en infobulle. */
function renderConstraintBandHtml(segment, gridRow) {
  const c = segment.constraint;
  const tooltip = [c.type || 'Contrainte', segment.label, examConstraintTooltip(c) || c.notes].filter(Boolean).join(' — ');
  return `<button class="timeline-sequence-band timeline-constraint-band period-${typeSlug(c.type)}" style="grid-column: ${segment.startIndex + 2} / ${segment.endIndex + 3}; grid-row: ${gridRow};" data-edit-constraint="${escapeAttr(c.id)}" title="${escapeAttr(tooltip)}"><strong>${escapeHtml(c.label)}${c.exam ? '<span class="exam-flag">jaquette</span>' : ''}</strong></button>`;
}

/* 18/08 — bande allégée à nom + mots-clés + pastilles seulement (consigne
   directe : « beaucoup plus fines »), plus de libellé « Séquence » ni de ligne
   heures/période (visibles dans le détail de la séquence, pas ici). */
function renderSequenceBandHtml(segment, gridRow, promotion, weeks) {
  const seq = segment.seq;
  const blockedCols = weeks.slice(segment.startIndex, segment.endIndex + 1).some(w => isBlockedWeek(w, promotion));
  const sc = sequenceColor(seq.id);
  const bandKeywords = compactKeywords(seq.keywords, 5);
  const bandTeachers = teacherPillsMarkup(seq.teacher || findUe(seq.ueId)?.teacher || '', true);
  // Retours #3 (18-19/08/2026) — Cas 2 : séquence de collègue(s) seul(s) au
  // sein d'une UE que j'enseigne par ailleurs. Visible, non colorée, non
  // glissable/ouvrable (pas de data-drag-sequence/data-edit-sequence).
  const mienne = contenuInteractifPourMoi(seq);
  const interactiveAttrs = mienne
    ? `draggable="true" data-drag-sequence="${escapeAttr(seq.id)}" data-edit-sequence="${escapeAttr(seq.id)}"`
    : '';
  return `<button ${interactiveAttrs} class="timeline-sequence-band seq-colored ${blockedCols ? 'has-blocked-week' : ''}${mienne ? '' : ' is-collegue'}" style="grid-column: ${segment.startIndex + 2} / ${segment.endIndex + 3}; grid-row: ${gridRow}; --ue-color:${sc}; --ue-soft:${hexToRgba(sc, .42)}; --ue-deep:${deepColor(sc)};" title="${escapeAttr(seq.title)}${mienne ? '' : ' — collègue(s) seul(s), pas la vôtre'}"><strong>${escapeHtml(seq.title)}</strong>${bandKeywords.length ? `<span class="timeline-band-keywords">${escapeHtml(bandKeywords.join(' · '))}</span>` : ''}${bandTeachers ? `<span class="timeline-band-teachers design-ue-pills">${bandTeachers}</span>` : ''}</button>`;
}

/* Bande SÉANCES : jours en lignes (Lundi→Vendredi + « à préciser »), semaines
   en colonnes. En mode « Empiler », les séances des UE affichées se mélangent
   dans les mêmes cases (teintées chacune par sa propre séquence). */
function renderGanttSessionsPanel(ues, weeks) {
  const grid = $('#ganttSessionsGrid');
  if (!grid) return;
  const promotion = ganttPromo;
  grid.style.cssText = `grid-template-columns: var(--timeline-label-col) repeat(${weeks.length}, minmax(var(--timeline-week-min), 1fr)); --timeline-week-count: ${weeks.length};`;

  // Retours #3 (18-19/08/2026) — Cas 1 : les séances d'une UE que je n'enseigne
  // pas ne remontent pas dans cette grille jour par jour (même règle que le
  // panneau Séquences ci-dessus, via jeSuisEnseignantDeLUe).
  const ueIds = new Set(ues.filter(jeSuisEnseignantDeLUe).map(ue => ue.id));
  const allSessions = state.sessions.filter(s => ueIds.has(s.ueId));

  const weekRow = renderGanttWeekHeaderRow(weeks, promotion, 'Jour');

  let rowCursor = 2;
  const dayRows = DAY_LANES.map(lane => {
    const laneSessions = allSessions.filter(s => sessionLaneKey(s) === lane.key);
    const label = `<div class="timeline-row-label timeline-row-label-day" style="grid-row: ${rowCursor};"><span>${escapeHtml(shortLaneLabel(lane))}</span><span class="meta progression-day-count">${laneSessions.length} séance${laneSessions.length > 1 ? 's' : ''}</span></div>`;
    const cells = weeks.map((week, i) => timelineDayCell(ues, week, lane, allSessions, promotion, i, rowCursor)).join('');
    rowCursor += 1;
    return label + cells;
  }).join('');

  grid.innerHTML = weekRow + dayRows;

  const unattached = allSessions.filter(s => !s.sequenceId).length;
  const foot = $('#ganttSessionsFoot');
  if (foot) foot.innerHTML = `<span class="legend-dot legend-dot-filled" aria-hidden="true"></span> pastille pleine = votre compte <span class="meta">· ${unattached} séance${unattached > 1 ? 's' : ''} non rattachée${unattached > 1 ? 's' : ''} à une séquence (jamais masquée)</span>`;
}

/* « Hors fenêtre » (bande Séquences) : les séquences qui commencent au-delà de
   ce qui tient dans la largeur visible du panneau, pour ne pas les laisser
   invisibles sans indice qu'il faut défiler. Mesure le DOM après rendu — sans
   effet si le panneau est caché (display:none), rattrapé par
   scrollGanttToCurrentWeek() à l'activation de l'onglet. */
function computeGanttHorsFenetre(ues, weeks) {
  const foot = $('#ganttHorsFenetre');
  if (!foot) return;
  const scrollEl = $('#ganttSequencesScroll');
  const weekHeads = scrollEl ? [...scrollEl.querySelectorAll('.timeline-week-head')] : [];
  if (!scrollEl || !scrollEl.clientWidth || !weekHeads.length) { foot.textContent = ''; return; }
  // Retours #4 (18/08/2026) — bug : la frise se recentre sur la semaine en
  // cours à l'ouverture de l'onglet (scrollGanttToCurrentWeek), donc la
  // fenêtre visible ne commence plus forcément à l'indice 0 ; l'ancien calcul
  // (nombre de semaines visibles déduit de la seule largeur du conteneur)
  // supposait un scroll à 0 et annonçait « hors fenêtre » des séquences en
  // réalité déjà visibles après recentrage. On mesure ici le chevauchement
  // RÉEL de chaque en-tête de semaine avec le viewport du scroll.
  const viewport = scrollEl.getBoundingClientRect();
  const lastVisibleIndex = weekHeads.reduce((last, el, i) => {
    const r = el.getBoundingClientRect();
    return (r.left < viewport.right - 1 && r.right > viewport.left + 1) ? i : last;
  }, -1);
  if (lastVisibleIndex >= weeks.length - 1) { foot.textContent = ''; return; }
  const items = [];
  ues.forEach(ue => {
    state.sequences.filter(seq => seq.ueId === ue.id).forEach(seq => {
      const segments = sequenceWeekSegments(seq, weeks);
      if (segments.length && segments[0].startIndex > lastVisibleIndex) items.push({ title: seq.title, start: segments[0].startIndex });
    });
  });
  if (!items.length) { foot.textContent = ''; return; }
  items.sort((a, b) => a.start - b.start);
  const from = weeks[items[0].start]?.label.replace('S0', 'S') || '';
  const to = weeks[weeks.length - 1]?.label.replace('S0', 'S') || '';
  foot.textContent = `${items.map(i => i.title).join(' · ')} — ${from} → ${to}, faire défiler →`;
}

/* Range des bandes {startIndex,endIndex} en couloirs horizontaux : deux bandes
   dont les colonnes ne se chevauchent pas partagent le même couloir (partition
   d'intervalles gloutonne, calée sur la position de début). Mute chaque bande
   avec .lane (décalée de laneOffset, pour empiler un groupe sous un autre) et
   renvoie le nombre de couloirs utilisés — moins il y en a, moins la ligne
   « Séquences » est haute (donc moins de défilement vertical). */
function assignBandLanes(bands, laneOffset = 0) {
  const order = [...bands].sort((a, b) => a.startIndex - b.startIndex || a.endIndex - b.endIndex);
  const laneEnds = []; // dernier endIndex occupé, par couloir
  order.forEach(band => {
    let lane = laneEnds.findIndex(end => end < band.startIndex);
    if (lane === -1) { lane = laneEnds.length; laneEnds.push(band.endIndex); }
    else laneEnds[lane] = band.endIndex;
    band.lane = lane + laneOffset;
  });
  return laneEnds.length;
}


function shortLaneLabel(lane) {
  if (lane.key === 'unspecified') return 'À préciser';
  return DAYS[lane.day].slice(0, 3);
}

function timelineDayCell(ues, week, lane, allSessions, promotion, weekIndex, gridRow) {
  const constraints = constraintsForWeek(week, promotion);
  const blocked = isBlockedWeek(week, promotion);
  // Lot K — semaine thématique / EIL (contrainte) couvrant cette promo : les cours
  // habituels sont impossibles ici (grisé + repère EIL), SAUF si l'une des UE
  // affichées porte du contenu cette semaine-là (elle garde ses séances visibles).
  const eilBlocked = ues.length > 0 && ues.every(ue => isThematicBlocked(week, promotion, ue.id, allSessions));
  const off = blocked || eilBlocked;
  const eilTitle = thematicItemsForWeek(week).filter(i => i.promos.includes(promotion)).map(i => i.title).filter(Boolean).join(' · ');
  // D2 + Lot U — jour férié OU contrainte/examen/période sur UNE seule journée
  // tombant précisément sur cette colonne-jour : affiché ici (partie journées).
  const dayDate = lane.part === 'day' ? dayDatesForWeek(week)[Number(lane.day)] : null;
  const dayItems = dayDate ? constraintsForDate(dayDate, promotion).filter(c => isHolidayConstraint(c) || isSingleDayConstraint(c)) : [];
  const dayItemChips = dayItems.map(timelineDayConstraintChip).join('');
  // Une séance n'appartient qu'à UNE semaine : sa semaine EDT si elle est
  // placée, sinon sa semaine cible. On ne teste plus "weekId OU targetWeekId"
  // (qui faisait apparaître une même séance dans deux colonnes).
  const cellSessions = allSessions
    .filter(s => sessionCanonicalWeekId(s) === week.id && sessionLaneKey(s) === lane.key)
    .sort((a, b) => sessionSortKey(a).localeCompare(sessionSortKey(b)));
  // En mode « Empiler », une séance neuve déposée ici sans UE encore choisie
  // rejoint la première UE affichée — cas ambigu et rare en pratique.
  const drop = JSON.stringify({ ueId: ues[0]?.id || '', weekId: week.id, laneKey: lane.key, day: lane.day, part: lane.part });
  const isCurrent = week.id === currentWeekId(); // Lot 4
  // Retours #3 (18-19/08/2026) : une séquence se dépose maintenant n'importe où
  // dans sa frise (comme une tuile séance), pas seulement sur l'en-tête de
  // semaine tout en haut — data-week-drop rejoint data-timeline-drop ici, sans
  // rien retirer (moveSessionToTimeline/moveSequenceToWeek se distinguent déjà
  // par le type de drag, pas par la cible).
  return `<div class="timeline-day-cell ${constraints.length ? 'has-constraint' : ''} ${blocked ? 'blocked-week' : ''} ${eilBlocked ? 'thematic-week' : ''} ${dayItems.length ? 'is-holiday' : ''} ${cellSessions.length ? 'has-session' : 'is-empty-day'}${isCurrent ? ' is-current-week' : ''}" style="grid-column: ${weekIndex + 2}; grid-row: ${gridRow};" data-timeline-drop='${escapeAttr(drop)}' data-week-drop="${escapeAttr(week.id)}"${eilBlocked ? ` title="${escapeAttr('Semaine thématique : ' + eilTitle)}"` : ''}>
    ${off
      ? (blocked ? '<span class="timeline-blocked-label">sans cours</span>' : '')
      : `${dayItemChips}${cellSessions.map(timelineSessionCard).join('')}`}
    ${!off && !dayItems.length && !cellSessions.length && !constraints.length ? '<span class="timeline-empty">·</span>' : ''}
  </div>`;
}

/* D2 + Lot U — pastille d'une contrainte affichée DANS une case-journée de la
   frise (jour férié, examen ou période sur une seule journée). Icône et teinte
   selon le type, comme les pastilles « Périodes » du Planning hebdo. */
function timelineDayConstraintChip(c) {
  const exam = !!c.exam || isExamConstraintType(c.type);
  const blocking = isBlockingConstraint(c);
  const variant = exam ? 'is-exam' : (blocking ? 'is-blocked' : 'is-period');
  const ico = exam ? '📝' : (blocking ? '🚫' : '📌');
  const tip = examConstraintTooltip(c) || c.notes || `${c.label} · ${c.type}`;
  return `<button type="button" class="timeline-holiday-chip ${variant}" data-edit-constraint="${escapeAttr(c.id)}" title="${escapeAttr(tip)}">${ico} ${escapeHtml(c.label)}</button>`;
}

/* Semaine de référence unique d'une séance pour l'affichage dans la frise. */
function sessionCanonicalWeekId(session) {
  if (isDefinitiveSession(session) && session.weekId) return session.weekId;
  return session.targetWeekId || session.weekId || '';
}

function sessionLaneKey(session) {
  // Lot O — source de vérité unique du JOUR : une séance placée dans l'EDT
  // (Planning hebdo) est rangée dans la frise sur son jour EDT (`day`), AVANT
  // tout `fictiveDay` éventuellement obsolète → aucun conflit de journée
  // possible entre les deux vues (et auto-correction des données existantes).
  if (isDefinitiveSession(session) && Number.isFinite(Number(session.day))) {
    return `d${Number(session.day)}`;
  }
  if (session.fictiveDay !== '' && session.fictiveDay !== undefined && session.fictiveDay !== null) {
    const day = Number(session.fictiveDay);
    return `d${day}`;
  }
  const text = [session.fictiveSlot, session.expectedDuration, session.type, session.title].join(' ').toLowerCase();
  const day = DAYS.findIndex(d => text.includes(d.toLowerCase()));
  if (day >= 0) return `d${day}`;
  return 'unspecified';
}

function timelinePartFromSession(session) {
  const text = [session.fictiveSlot, session.expectedDuration, session.type, session.title].join(' ').toLowerCase();
  if (text.includes('aprem') || text.includes('après') || text.includes('apres') || Number(session.startSlot) >= 5) return 'pm';
  return 'am';
}

function timelineSessionCard(session) {
  const hours = sessionHoursLabel(session);
  const dayLabel = isDefinitiveSession(session) && Number.isFinite(Number(session.day))
    ? DAY_NAMES[Number(session.day)]
    : (session.fictiveDay !== '' && session.fictiveDay !== undefined && session.fictiveDay !== null ? DAY_NAMES[Number(session.fictiveDay)] : '');
  const meta = [hours, dayLabel, session.room].filter(Boolean).join(' · ');
  const keywords = compactKeywords(session.keywords, 4);
  const color = sessionTint(session);
  const teachers = teacherPillsMarkup(session.teacher || findUe(session.ueId)?.teacher || '', true);
  const tooltip = [session.title, sessionTooltip(session), session.objectives].filter(Boolean).join(' — ');
  // Retours #3 (18-19/08/2026) — Cas 2 : séance de collègue(s) seul(s).
  const mienne = contenuInteractifPourMoi(session);
  const interactiveAttrs = mienne ? `draggable="true" data-drag-session="${escapeAttr(session.id)}" data-edit-session="${escapeAttr(session.id)}"` : '';
  return `<button ${interactiveAttrs} class="timeline-session seq-tinted ${typeClass(session.type)}${mienne ? '' : ' is-collegue'}" style="--ue-color:${color};--ue-soft:${hexToRgba(color, .32)};--ue-deep:${deepColor(color)}" title="${escapeAttr(tooltip)}${mienne ? '' : ' — collègue(s) seul(s), pas la vôtre'}">
    <span class="timeline-session-head">
      <span class="timeline-session-type">${demiGroupeBadge(session)}${escapeHtml(session.type || 'Séance')}</span>
      ${teachers ? `<span class="timeline-band-teachers design-ue-pills">${teachers}</span>` : ''}
    </span>
    <strong class="timeline-session-title">${escapeHtml(session.title)}</strong>
    ${meta ? `<em class="timeline-session-meta">${escapeHtml(meta)}</em>` : ''}
    ${keywords.length ? `<small class="timeline-session-keywords">${escapeHtml(keywords.join(', '))}</small>` : ''}
  </button>`;
}

/* Renvoie un libellé d'heures lisible pour une séance, quelle que soit la
   façon dont la durée a été saisie (champ texte libre ou créneaux EDT). */
function sessionHoursLabel(session) {
  if (session.expectedDuration && String(session.expectedDuration).trim()) return String(session.expectedDuration).trim();
  if (isDefinitiveSession(session)) {
    const slots = sessionDurationSlots(session);
    if (Number.isFinite(slots) && slots > 0) return `${slots}h`;
  }
  return '';
}

function isBlockedWeek(week, promotion = '') {
  return constraintsForWeek(week, promotion).some(c => /vacances|stage/i.test(c.type || '') || /vacances/i.test(c.label || ''));
}

async function moveSessionToTimeline(session, context) {
  if (!session) return;
  const targetWeek = state.weeks.find(w => w.id === context.weekId);
  const targetPromo = findUe(context.ueId)?.promotion || '';
  if (isBlockedWeek(targetWeek, targetPromo) && !confirm('Cette semaine est marquée comme sans cours. Déplacer quand même la séance ?')) return;
  // Lot K — avertir seulement si on pose une séance NON-EIL sur une semaine
  // thématique (une séance d'EIL, rattachée à la contrainte de la semaine, est
  // au contraire attendue ici).
  const isEilSession = session.constraintId && thematicConstraintsForWeek(targetWeek, targetPromo).some(c => c.id === session.constraintId);
  if (weekIsThematic(targetWeek, targetPromo) && !isEilSession && !confirm('Cette semaine est une semaine thématique / EIL pour cette promo (cours habituels suspendus). Placer quand même la séance ?')) return;
  session.ueId = session.ueId || context.ueId;
  session.targetWeekId = context.weekId;
  const ownUe = findUe(session.ueId) || findUe(context.ueId);
  const promotion = ownUe?.promotion || session.promotion || '';
  if (context.part === 'day' && context.day !== '' && context.day !== null && context.day !== undefined) {
    // Lot O — déposer une séance sur une JOURNÉE de la frise revient à la placer
    // dans l'emploi du temps ce jour-là (source de vérité unique : `day`, relu
    // par le Planning hebdo). La frise n'ayant pas d'heures, on auto-empile la
    // séance depuis le 1er créneau libre du matin (durée déduite de sa saisie).
    const day = Number(context.day);
    if (promotion) session.promotion = promotion;
    const durationSlots = sessionDurationSlotsFromText(session);
    const start = autoSlotStart(promotion, context.weekId, day, durationSlots, session.id);
    const end = inferEndSlot(start, session.expectedDuration || session.fictiveSlot || '');
    Object.assign(session, {
      placementStatus: 'definitif',
      weekId: context.weekId,
      day,
      fictiveDay: day,
      startSlot: start,
      endSlot: end,
      status: session.status || 'Prévue'
    });
  } else {
    // Journée « À préciser » : la séance (re)devient « à placer » pour la
    // semaine cible, sans jour figé — elle quitte donc l'EDT du Planning hebdo.
    Object.assign(session, {
      placementStatus: 'fictif',
      weekId: '',
      day: null,
      fictiveDay: '',
      startSlot: null,
      endSlot: null
    });
    session.fictiveSlot = session.fictiveSlot || 'À préciser';
  }
  await saveData('Séance déplacée dans la frise');
}

async function moveSequenceToWeek(sequence, weekId) {
  if (!sequence) return;
  const weeks = weeksForSemester(ganttSemester);
  const targetIndex = weeks.findIndex(w => w.id === weekId);
  if (targetIndex < 0) return;
  const oldSegments = sequenceWeekSegments(sequence, weeks);
  const length = oldSegments.length ? (oldSegments[0].endIndex - oldSegments[0].startIndex + 1) : 1;
  const start = weekNumberOf(weeks[targetIndex]);
  const endWeek = weeks[Math.min(weeks.length - 1, targetIndex + length - 1)];
  const end = weekNumberOf(endWeek);
  sequence.targetWeeks = start === end ? `S${String(start).padStart(2,'0')}` : `S${String(start).padStart(2,'0')}-S${String(end).padStart(2,'0')}`;
  await saveData('Séquence repositionnée dans la frise');
}

/* Conception — rattacher une séance à une séquence par glisser-déposer. La séance
   suit l'UE de la séquence et quitte une éventuelle semaine thématique (EIL). Le
   placement dans l'EDT (semaine / jour / créneau) est conservé tel quel. */
async function attachSessionToSequence(session, seq) {
  if (!session || !seq || session.sequenceId === seq.id) return;
  session.sequenceId = seq.id;
  session.ueId = seq.ueId;
  session.constraintId = '';
  await saveData(`Séance rattachée à « ${seq.title} »`);
}

/* Conception — détacher une séance vers le bloc « Sans séquence » d'une UE : elle
   perd son rattachement (séquence et semaine thématique) mais reste dans l'UE. */
async function detachSessionFromSequence(session, ueId) {
  if (!session) return;
  if (!session.sequenceId && !session.constraintId && session.ueId === ueId) return;
  session.sequenceId = '';
  session.constraintId = '';
  if (ueId) session.ueId = ueId;
  await saveData('Séance détachée de sa séquence');
}

function timelineConstraintBands(promotion, weeks = []) {
  const bands = [];
  (state.constraints || []).forEach(constraint => {
    // D2 — férié + Lot U — contrainte/examen/période sur 1 seule journée : rendus
    // dans la case-journée concernée (pas en bande dans le couloir des séquences).
    if (isHolidayConstraint(constraint) || isSingleDayConstraint(constraint)) return;
    if (constraint.promotions?.length && !constraint.promotions.includes(promotion)) return;
    const indices = weeks.map((week, index) => constraintsForWeek(week, promotion).some(c => c.id === constraint.id) ? index : -1).filter(i => i >= 0);
    if (!indices.length) return;
    let start = indices[0];
    let previous = indices[0];
    for (let i = 1; i <= indices.length; i += 1) {
      if (indices[i] === previous + 1) { previous = indices[i]; continue; }
      const startWeek = weeks[start]?.label || '';
      const endWeek = weeks[previous]?.label || startWeek;
      bands.push({ constraint, startIndex: start, endIndex: previous, label: startWeek === endWeek ? startWeek : `${startWeek}–${endWeek}` });
      start = indices[i];
      previous = indices[i];
    }
  });
  return bands;
}

/* Rang chronologique d'une semaine = sa position dans state.weeks, qui est
   construit dans l'ordre du calendrier. 999 si la semaine est inconnue. */
function weekChronoIndex(weekId) {
  const i = state.weeks.findIndex(w => w.id === weekId);
  return i < 0 ? 999 : i;
}

/* Clé de tri CHRONOLOGIQUE (ordre du calendrier), et non l'ordre de création :
   semaine effective, puis jour, puis créneau, puis date exacte. L'ordre de
   création `order` ne sert plus que de départage stable en tout dernier. */
function sessionSortKey(session) {
  const weekIndex = String(weekChronoIndex(sessionCanonicalWeekId(session))).padStart(3, '0');
  const dayVal = isDefinitiveSession(session) && Number.isFinite(Number(session.day))
    ? Number(session.day)
    : (session.fictiveDay !== '' && session.fictiveDay !== undefined && session.fictiveDay !== null ? Number(session.fictiveDay) : 9);
  const day = String(dayVal).padStart(2, '0');
  const slot = String(session.startSlot ?? 99).padStart(2, '0');
  const date = session.exactDate || '';
  const order = String(session.order || '').padStart(8, '0');
  return `${weekIndex}-${day}-${slot}-${date}-${order}-${session.title}`;
}

function sequenceWeekSegments(seq, weeks) {
  if (!seq.targetWeeks || !weeks.length) return [];
  const weekNumbers = weeks.map(weekNumberOf);
  const ranges = parseWeekRanges(seq.targetWeeks);
  const segments = [];
  ranges.forEach(range => {
    const indices = weekNumbers
      .map((number, index) => rangeIncludesWeek(range, number) ? index : -1)
      .filter(index => index >= 0);
    if (!indices.length) return;
    let start = indices[0];
    let previous = indices[0];
    for (let i = 1; i <= indices.length; i += 1) {
      if (indices[i] === previous + 1) {
        previous = indices[i];
        continue;
      }
      segments.push({ startIndex: start, endIndex: previous, label: rangeLabel(range) });
      start = indices[i];
      previous = indices[i];
    }
  });
  return mergeIdenticalSegments(segments);
}

function parseWeekRanges(value) {
  return String(value || '')
    .split(/[;,]/)
    .map(segment => {
      const nums = segment.match(/\d{1,2}/g)?.map(Number) || [];
      if (!nums.length) return null;
      return { start: nums[0], end: nums[1] ?? nums[0] };
    })
    .filter(Boolean);
}

function rangeIncludesWeek(range, weekNumber) {
  if (range.start <= range.end) return weekNumber >= range.start && weekNumber <= range.end;
  return weekNumber >= range.start || weekNumber <= range.end;
}

function rangeLabel(range) {
  return range.start === range.end ? `S${String(range.start).padStart(2, '0')}` : `S${String(range.start).padStart(2, '0')}–S${String(range.end).padStart(2, '0')}`;
}

function mergeIdenticalSegments(segments) {
  const map = new Map();
  segments.forEach(segment => map.set(`${segment.startIndex}-${segment.endIndex}-${segment.label}`, segment));
  return [...map.values()];
}

function firstSequenceWeekIndex(seq, weeks) {
  const segments = sequenceWeekSegments(seq, weeks);
  return segments.length ? segments[0].startIndex : 999;
}

function weekNumberOf(week) {
  return Number(week.weekNumber ?? String(week.label).replace(/\D/g, ''));
}

function compactDateRange(dateRange = '') {
  return String(dateRange).replace(/\/2025|\/2026|\/2027/g, '').replace(/\s+/g, ' ');
}

// Retours #4 (18/08/2026) — couleur du bandeau promo (code couleur semestre
// du Ruban), appliquée à part de renderPromotionTable : appelée à la fois
// après un rendu complet et depuis le clic sur l'onglet de période seul (qui
// ne redessine pas la grille), pour que la couleur suive weekStripPeriod
// dans les deux cas.
function applyScheduleTitleColors() {
  $$('.schedule-title').forEach(el => {
    const promotion = el.dataset.promotion;
    const summer = weekStripPeriod === 'summer';
    const semester = semesterForPromoPeriod(promotion, weekStripPeriod);
    el.style.background = summer ? '#e4e1d6' : hexToRgba(semesterColorOf(semester), .22);
    el.style.color = summer ? '#5b584c' : deepColor(semesterColorOf(semester));
  });
}

function renderPlanning() {
  $('#weekSelect').value = selectedWeek;
  const currentWeek = state.weeks.find(w => w.id === selectedWeek);
  if (currentWeek) weekStripPeriod = weekStripPeriodOf(currentWeek);
  renderWeekStrip();
  renderWeekBacklog();
  $('#planningContainer').innerHTML = state.promotions.map(renderPromotionTable).join('');
  applyScheduleTitleColors();
  const weekNotesEl = $('#weekNotes');
  if (weekNotesEl && document.activeElement !== weekNotesEl) {
    weekNotesEl.value = state.weekNotes[selectedWeek] || '';
    setWeekNotesStatus('');
  }
}

/* Refonte écran 4 (16/08/2026) — REGLES.md #22 : la bande de semaines est le
   seul sélecteur de date de l'app (remplace l'ancien calendrier mensuel, qui
   en était un). Une période à la fois (l'année scolaire compte ~40 semaines,
   trop pour une bande lisible d'un coup) ; la bascule ne fait que parcourir,
   `weekStripPeriod` est resynchronisée sur la semaine réellement affichée à
   chaque renderPlanning() (cf. plus haut). */
function renderWeekStrip() {
  $$('#weekStripPeriodSwitch .promo-switch-btn').forEach(btn => btn.classList.toggle('active', btn.dataset.weekPeriod === weekStripPeriod));

  // 17/08 — le texte "Septembre-décembre S36→S53 · cliquer une semaine" (ex-#weekStripLabel)
  // doublonnait les boutons Sept./Janv. ci-dessus : retiré, les boutons suffisent seuls.
  const weeks = state.weeks.filter(w => weekStripPeriodOf(w) === weekStripPeriod);

  const strip = $('#weekStrip');
  if (!strip) return;
  if (!weeks.length) { strip.innerHTML = '<p class="meta">Aucune semaine disponible.</p>'; return; }
  strip.innerHTML = weeks.map(w => {
    const blocked = constraintsForWeek(w).some(isBlockingConstraint);
    const thematic = weekIsThematic(w);
    const selected = w.id === selectedWeek;
    const cls = ['week-strip-tile'];
    if (blocked) cls.push('is-blocked');
    if (thematic) cls.push('is-thematic');
    if (selected) cls.push('is-selected');
    const [monday] = weekDateRange(w);
    const wkLabel = w.label.replace('S0', 'S');
    return `<button type="button" class="${cls.join(' ')}" data-set-week="${escapeAttr(w.id)}" title="${escapeAttr(`${wkLabel} · ${w.dateRange || ''}`)}">
      <span class="week-strip-num">${escapeHtml(wkLabel)}</span>
      <span class="week-strip-date">${escapeHtml(monday ? fmtDayDate(monday) : '')}</span>
      <span class="week-strip-tile-bar" aria-hidden="true"></span>
    </button>`;
  }).join('');

  // Ajustements #2 [E2.3] (18/08/2026) — au premier affichage (pas après un
  // simple clic sur une case déjà visible), la semaine affichée doit être la
  // 2e case VISIBLE du défilement : on cale le défilement une case avant elle,
  // plutôt que sur la première semaine de toute la période.
  const idx = weeks.findIndex(w => w.id === selectedWeek);
  if (idx >= 0) {
    // `.week-strip` n'étant pas positionné (pas de `position:relative`),
    // `offsetLeft` remontait au mauvais ancêtre — scrollIntoView calcule la
    // bonne distance lui-même, quel que soit l'ancêtre positionné.
    const tiles = strip.querySelectorAll('.week-strip-tile');
    const cible = tiles[Math.max(0, idx - 1)];
    cible?.scrollIntoView({ inline: 'start', block: 'nearest' });
  }
}

/* Clé jour (AAAA-MM-JJ) en heure locale, sans décalage de fuseau. */
function isoKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

/* Lundi de la semaine contenant `date` (semaine ISO, lundi premier jour). */
function mondayOf(date) {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const offset = (d.getDay() + 6) % 7; // 0 = lundi
  d.setDate(d.getDate() - offset);
  return d;
}

function renderWeekBacklog() {
  refreshWeekBacklogUeFilter();
  const selectedUe = weekBacklogUeFilter;
  const sessions = state.sessions
    .filter(s => isFictiveSession(s))
    .filter(estVisiblePourMoi)
    .filter(s => weekBacklogScope === 'all' || s.targetWeekId === selectedWeek || !s.targetWeekId)
    .filter(s => selectedUe === 'Tous' || s.ueId === selectedUe)
    .sort((a, b) => `${ueLabel(a.ueId)}-${sequenceLabel(a.sequenceId)}-${weekLabel(a.targetWeekId)}-${sessionSortKey(a)}`.localeCompare(`${ueLabel(b.ueId)}-${sequenceLabel(b.sequenceId)}-${weekLabel(b.targetWeekId)}-${sessionSortKey(b)}`));

  const backlog = $('#weekBacklog');
  const openKeys = captureOpenKeys(backlog);
  const title = weekBacklogScope === 'all'
    ? `${sessions.length} séance(s) à placer disponible(s)`
    : `${sessions.length} séance(s) à placer ciblée(s) sur ${weekLabel(selectedWeek)} ou sans semaine`;
  if (!sessions.length) {
    backlog.innerHTML = '<p class="meta">Aucune séance à placer ne correspond aux filtres.</p>';
    return;
  }
  // Ajustements #2 [E2.7] (18/08/2026) — retour de Martin : deux niveaux de
  // tiroirs repliés (UE puis séquence) pour atteindre une tuile, c'est trop.
  // Le niveau séquence perd son `<details>` (simple étiquette non repliable,
  // les tuiles restent toujours visibles en dessous) ; le niveau UE reste
  // repliable (utile s'il y a beaucoup d'UE) mais s'ouvre par défaut (`open`)
  // au lieu de partir fermé — restoreOpenKeys respecte ensuite un repli
  // explicite de Martin d'un rendu à l'autre, comme avant.
  const byUe = groupBy(sessions, s => s.ueId || 'none');
  backlog.innerHTML = `<div class="backlog-count">${escapeHtml(title)}</div>` + Object.entries(byUe).map(([ueId, ueSessions]) => {
    const bySeq = groupBy(ueSessions, s => s.sequenceId || 'none');
    return `<details class="backlog-ue-group" data-open-key="wbUe:${escapeAttr(ueId)}" open><summary><strong>${escapeHtml(ueLabel(ueId))}</strong><span>${ueSessions.length} séance(s)</span></summary>${Object.entries(bySeq).map(([seqId, seqSessions]) => `<div class="backlog-seq-group"><p class="backlog-seq-label">${escapeHtml(sequenceLabel(seqId))}<span>${seqSessions.length}</span></p>${seqSessions.map(s => renderBacklogSessionTile(s)).join('')}</div>`).join('')}</details>`;
  }).join('');
  restoreOpenKeys(backlog, openKeys);
}

/* Retours #3 (18-19/08/2026) — Cas 2/3 de visibilité entre comptes enseignants
   pour une case du Planning hebdo. data-session-id est le vrai déclencheur du
   clic (#planningContainer, cf. plus bas) : Cas 2 = tous les attributs
   d'interaction (draggable/data-drag-session/data-session-id/data-edit-session)
   omis d'un coup, plus de bouton « ↩ Ressortir » (action réservée au Cas 3).
   data-drop-target n'est PAS concerné : déposer une de mes séances reste
   possible même sur le créneau d'un·e collègue, géré séparément par l'appelant. */
function planningSessionAttrs(session) {
  const mienne = contenuInteractifPourMoi(session);
  return {
    mienne,
    classSuffix: mienne ? '' : ' is-collegue',
    idAttrs: mienne
      ? `draggable="true" data-drag-session="${escapeAttr(session.id)}" data-session-id="${escapeAttr(session.id)}" data-edit-session="${escapeAttr(session.id)}"`
      : '',
    unplaceBtn: mienne
      ? `<button type="button" class="unplace-btn" data-unplace-session="${escapeAttr(session.id)}" title="Ressortir vers « Séances à placer »" aria-label="Ressortir cette séance">↩</button>`
      : ''
  };
}

function renderSessionEventContent(session, duration, compact = false) {
  const ue = findUe(session.ueId);
  const ueCode = ue ? ue.code : 'UE ?'; // « UE 3.2 » (préfixe conservé)
  // Lot V — demi-groupe : pastille courte (« A »/« B ») sur la MÊME ligne que l'UE.
  // La demi-largeur d'affichage suffit à signaler le demi-groupe → pas de « ½ ».
  const badge = session.demiGroupe ? `<span class="demi-badge demi-inline demi-${session.demiGroupe.toLowerCase()}" title="Demi-groupe ${session.demiGroupe}">${session.demiGroupe}</span>` : '';
  // Ajustements #2 [E2.6] (18/08/2026) — les initiales de l'enseignant en
  // pastilles (.design-ue-pill, même composant que Conception/Répartition/
  // Créneaux types), plutôt qu'en texte brut, pour homogénéiser avec le reste
  // de l'appli. Le lieu reste en texte simple juste en dessous.
  const eventTeachers = teacherPillsMarkup(session.teacher || '', true);
  const detail = session.room || '';
  // Mots-clés affichés dans les cases PLEINES (police réduite) ; pas en demi-groupe (place).
  const keywords = compact ? [] : compactKeywords(session.keywords, 4);
  // Type de séance en texte simple (repère rapide Cours/TP/Pluri…), après les
  // infos enseignant/lieu et avant les mots-clés.
  const typeText = session.type ? `<div class="event-type">${escapeHtml(shortSessionType(session.type))}</div>` : '';
  // Lot 9 — l'horaire libre (saisi, non réécrit en base) ne pilote pas le créneau
  // standard de la grille : on l'affiche donc explicitement quand les deux bornes
  // sont renseignées, pour qu'il ne soit plus un champ « saisi et ignoré ».
  const customHours = session.customStart && session.customEnd ? `${session.customStart}–${session.customEnd}` : '';
  // 18/08 — retour Martin : « les espaces de séances ne doivent pas changer de
  // taille d'une semaine à l'autre ». Une case de tableau n'impose sa hauteur
  // qu'en minimum : une séance chargée (titre long + type + enseignant/lieu +
  // mots-clés) poussait sa ligne bien au-delà — vérifié : jusqu'à 115px sur un
  // créneau d'1h censé faire 58px, et `height:100%` seul ne suffit pas à borner
  // une cellule de tableau (elle reste elle-même « auto » tant que son contenu
  // n'est pas plafonné ailleurs — vérifié aussi). Hauteur figée en dur, calquée
  // sur la géométrie réelle de la grille (58px/créneau, `duration` = nombre de
  // créneaux occupés) : l'excédent est coupé net plutôt que d'étirer la ligne.
  const maxBodyHeight = Math.max(1, Number(duration) || 1) * 58 - 10;
  return `<div class="event-body" style="max-height:${maxBodyHeight}px">
    <div class="event-ue">${escapeHtml(ueCode)}${badge}</div>
    <div class="event-session-title">${escapeHtml(truncate(session.title, compact ? 26 : 40))}</div>
    ${customHours ? `<div class="event-hours" title="Horaire libre saisi pour cette séance">${escapeHtml(customHours)}</div>` : ''}
    ${eventTeachers ? `<div class="event-teachers design-ue-pills">${eventTeachers}</div>` : ''}
    ${detail ? `<div class="event-details">${escapeHtml(detail)}</div>` : ''}
    ${typeText}
    ${keywords.length ? `<div class="event-keywords">${escapeHtml(keywords.join(', '))}</div>` : ''}
  </div>`;
}

/* Libellé court du type de séance pour la pastille du Planning hebdo (les types
   longs sont abrégés ; les autres restent tels quels). */
function shortSessionType(type = '') {
  return {
    'Cours en salle': 'Cours',
    'Cours en salle informatique': 'Salle info',
    'Projet tutoré': 'Projet tut.',
    'Semaine thématique': 'Sem. thém.',
    'Évaluation': 'Éval'
  }[type] || type;
}

/* Infobulle native (attribut title) : reçoit les informations qui ne
   tiennent pas dans la cellule (séquence, durée, mots-clés). */
function sessionTooltip(session) {
  return [
    sequenceLabel(session.sequenceId),
    session.type || '',
    session.expectedDuration || durationFromSlots(session),
    session.keywords ? `Mots-clés : ${session.keywords}` : ''
  ].filter(Boolean).join(' · ');
}

function renderPromotionTable(promotion) {
  const sessions = state.sessions.filter(s => s.weekId === selectedWeek && s.promotion === promotion && isDefinitiveSession(s));
  const week = state.weeks.find(w => w.id === selectedWeek);
  const dayDates = dayDatesForWeek(week);
  const dayConstraints = dayDates.map(d => constraintsForDate(d, promotion));
  // Lot K — EIL : semaine thématique (contrainte) de CETTE promo → cours suspendus
  // (grise les créneaux vides ; les séances d'EIL placées s'affichent par-dessus) ;
  // celles d'AUTRES promos → info (créneaux souvent libres).
  const eilSelf = thematicItemsForWeek(week).filter(i => i.promos.includes(promotion));
  const eilOther = thematicItemsForWeek(week).filter(i => !i.promos.includes(promotion));
  const blockedDay = dayConstraints.map(list => list.some(isBlockingConstraint) || eilSelf.length > 0);
  // Masque « créneaux type » : superpose la trame du planning hebdo type
  // (semestre déduit de la période de la semaine + promo) sur les cases vides.
  const maskSlots = weekMaskActive ? templateSlotsFor(templateSemester(periodOfWeek(week), promotion)) : [];
  const skip = new Set();
  const rows = SLOTS.map((slot, slotIndex) => {
    if (slotIndex === 4) {
      return `<tr><td class="time-cell lunch-cell">Repas</td><td class="lunch-cell" colspan="5">Repas</td></tr>`;
    }
    const recreationBefore = slotIndex === 2 ? `<tr class="break-row"><td class="time-cell break-cell">10h05 – 10h20</td><td class="break-cell" colspan="5">pause</td></tr>` : '';
    const recreationAfternoon = slotIndex === 7 ? `<tr class="break-row"><td class="time-cell break-cell">15h15 – 15h30</td><td class="break-cell" colspan="5">pause</td></tr>` : '';
    const cells = DAYS.map((day, dayIndex) => {
      const key = `${dayIndex}-${slotIndex}`;
      if (skip.has(key)) return '';
      const starting = sessions.filter(s => Number(s.day) === dayIndex && segmentStartsAt(s, slotIndex));
      if (starting.length) {
        // Découpage aux récréations : le segment courant s'arrête en fin de bloc.
        const segEnd = Math.max(...starting.map(s => segmentEndSlot(s, slotIndex)));
        const rowspan = Math.max(1, segEnd - slotIndex + 1);
        const isHead = starting.some(s => Number(s.startSlot) === slotIndex);
        const hasMore = starting.some(s => Number(s.endSlot) > segEnd); // un segment suit après la récré
        for (let i = slotIndex + 1; i <= segEnd; i += 1) skip.add(`${dayIndex}-${i}`);
        const contextJson = JSON.stringify({ promotion, day: dayIndex, slot: slotIndex });
        const contClass = `${isHead ? '' : ' is-continuation'}${hasMore ? ' has-continuation' : ''}`;
        // Lot V — demi-groupes : au plus 1×A + 1×B, aucune classe entière → cellule
        // scindée côte à côte (½A gauche / ½B droite). Sinon 1 séance = cellule
        // simple ; le reste (A+A, entière + moitié, 3+) = vrai conflit « superposées ».
        const halfA = starting.filter(s => s.demiGroupe === 'A');
        const halfB = starting.filter(s => s.demiGroupe === 'B');
        const full = starting.filter(s => !s.demiGroupe);
        const isDemiSplit = full.length === 0 && halfA.length <= 1 && halfB.length <= 1;
        if (isDemiSplit) {
          const halfCol = (sess, side) => {
            const cj = escapeAttr(JSON.stringify({ promotion, day: dayIndex, slot: slotIndex, demiGroupe: side }));
            if (!sess) {
              // Continuation (séance de l'autre moitié qui enjambe une récré) : demi-
              // colonne vide muette, pas un emplacement de création « + ½X ».
              if (!isHead) return '<div class="demi-col demi-empty is-continuation" aria-hidden="true"></div>';
              return `<div class="demi-col demi-empty drop-slot" data-create='${cj}' data-drop-target='${cj}' title="Créer / déposer le demi-groupe ${side}"><span class="drop-hint">+ ½${side}</span></div>`;
            }
            const p = planningSessionAttrs(sess);
            const inner = isHead ? `${p.unplaceBtn}${renderSessionEventContent(sess, rowspan, true)}` : '';
            return `<div class="demi-col drop-slot ${typeClass(sess.type)}${p.classSuffix}" style="--seq-color:${sessionTint(sess)}; --ue-deep:${deepColor(sessionTint(sess))}" ${p.idAttrs} data-drop-target='${cj}' title="${escapeAttr(sessionTooltip(sess))}${p.mienne ? '' : ' — collègue(s) seul(s), pas la vôtre'}">${inner}</div>`;
          };
          return `<td class="event-cell demi-cell${contClass}" rowspan="${rowspan}"><div class="demi-split">${halfCol(halfA[0], 'A')}${halfCol(halfB[0], 'B')}</div></td>`;
        }
        if (starting.length === 1) {
          const session = starting[0];
          const cls = typeClass(session.type);
          const p = planningSessionAttrs(session);
          const inner = isHead ? `${p.unplaceBtn}${renderSessionEventContent(session, rowspan)}` : '';
          return `<td class="event-cell drop-slot ${cls}${contClass}${p.classSuffix}" rowspan="${rowspan}" style="--seq-color:${sessionTint(session)}; --ue-deep:${deepColor(sessionTint(session))}" ${p.idAttrs} data-drop-target='${escapeAttr(contextJson)}' title="${escapeAttr(sessionTooltip(session))}${p.mienne ? '' : ' — collègue(s) seul(s), pas la vôtre'}">${inner}</td>`;
        }
        return `<td class="event-cell overlap-cell drop-slot${contClass}" rowspan="${rowspan}" data-drop-target='${escapeAttr(contextJson)}' title="${starting.length} séances en chevauchement">
          <div class="overlap-warning">${starting.length} séances superposées</div>
          ${starting.map(session => { const p = planningSessionAttrs(session); return `<div class="overlap-event ${typeClass(session.type)}${p.classSuffix}" style="--ue-deep:${deepColor(sessionTint(session))}" ${p.idAttrs} title="${escapeAttr(sessionTooltip(session))}${p.mienne ? '' : ' — collègue(s) seul(s), pas la vôtre'}">${p.unplaceBtn}${renderSessionEventContent(session, rowspan, true)}</div>`; }).join('')}
        </td>`;
      }
      const contextJson = JSON.stringify({ promotion, day: dayIndex, slot: slotIndex });
      if (maskSlots.length) {
        const covering = maskSlots.filter(m => Number(m.day) === dayIndex && slotIndex >= Number(m.startSlot) && slotIndex <= Number(m.endSlot));
        if (covering.length) {
          const head = covering.some(m => slotIndex === Number(m.startSlot)) || BLOCK_STARTS.has(slotIndex);
          const foot = covering.some(m => slotIndex === Number(m.endSlot)) || BLOCK_ENDS.has(slotIndex);
          const clsBase = `empty-slot drop-slot mask-slot${head ? ' mask-head' : ''}${foot ? ' mask-foot' : ''} ${blockedDay[dayIndex] ? 'day-off-slot' : ''}`;
          const tip = covering.map(m => [templateSlotCode(m), m.title, m.teacher].filter(Boolean).join(' · ')).join(' / ');
          const attrs = `data-create='${escapeAttr(contextJson)}' data-drop-target='${escapeAttr(contextJson)}' title="Créneau${covering.length > 1 ? 'x' : ''} type : ${escapeAttr(tip)} · Cliquer pour créer · Glisser une séance ici"`;
          const left = covering.find(m => m.col === 'L');
          const right = covering.find(m => m.col === 'R');
          // Deux créneaux côte à côte (L + R) → masque scindé (comme les demi-groupes).
          if (covering.length >= 2 && (left || right) && !covering.some(m => !m.col)) {
            const half = (m) => `<span class="mask-half">${head && m ? `<span class="mask-label">${escapeHtml(templateMaskLabel(m))}</span>` : ''}</span>`;
            return `<td class="${clsBase} mask-split" ${attrs}><span class="mask-split-inner">${half(left)}${half(right)}</span><span class="drop-hint">+</span></td>`;
          }
          const label = templateMaskLabel(covering[0]);
          return `<td class="${clsBase}" ${attrs}>${head && label ? `<span class="mask-label">${escapeHtml(label)}</span>` : ''}<span class="drop-hint">+</span></td>`;
        }
      }
      return `<td class="empty-slot drop-slot ${blockedDay[dayIndex] ? 'day-off-slot' : ''}" data-create='${escapeAttr(contextJson)}' data-drop-target='${escapeAttr(contextJson)}' title="Cliquer pour créer · Glisser une séance ici"><span class="drop-hint">+</span></td>`;
    }).join('');
    return `${recreationBefore}${recreationAfternoon}<tr><td class="time-cell">${slot}</td>${cells}</tr>`;
  }).join('');

  // Lot K — la contrainte thématique est portée par la bannière EIL ; on ne la
  // répète pas dans chaque jour de la ligne « Périodes ».
  const dayChips = dayConstraints.map(list => list.filter(c => !isThematicConstraint(c)));
  const hasConstraint = dayChips.some(list => list.length);
  const constraintRow = hasConstraint
    ? `<tr class="day-constraint-row"><td class="time-cell day-constraint-legend">Périodes</td>${DAYS.map((d, i) => `<td class="day-constraint-cell ${blockedDay[i] ? 'day-blocked' : ''}">${dayChips[i].map(dayConstraintChip).join('')}</td>`).join('')}</tr>`
    : '';
  // Lot L — samedi (rare) : séances posées le samedi (jour 5, journée entière) +
  // contraintes datées le samedi (portes ouvertes…). Ligne conditionnelle en bas du
  // planning ; n'apparaît que si non vide → aucun impact les semaines ordinaires.
  const satMonday = weekDateRange(week)[0];
  const saturdayDate = satMonday ? new Date(satMonday.getFullYear(), satMonday.getMonth(), satMonday.getDate() + 5) : null;
  const satSessions = sessions.filter(s => Number(s.day) === 5);
  const satConstraints = saturdayDate ? constraintsForDate(saturdayDate, promotion).filter(c => !isThematicConstraint(c)) : [];
  const saturdayRow = (satSessions.length || satConstraints.length)
    ? `<tr class="saturday-row"><td class="time-cell saturday-legend">Samedi${saturdayDate ? `<br><small class="th-date">${escapeHtml(fmtDayDate(saturdayDate))}</small>` : ''}</td><td class="saturday-cell" colspan="${DAYS.length}">${satConstraints.map(dayConstraintChip).join('')}${satSessions.map(s => { const p = planningSessionAttrs(s); return `<span class="saturday-session ${typeClass(s.type)}${p.classSuffix}" style="--seq-color:${sessionTint(s)}" ${p.idAttrs} title="${escapeAttr(sessionTooltip(s))}${p.mienne ? '' : ' — collègue(s) seul(s), pas la vôtre'}">${p.unplaceBtn}${escapeHtml(s.title)} · journée</span>`; }).join('')}</td></tr>`
    : '';
  const eilRow = eilBannerRow(eilSelf, eilOther, DAYS.length);

  // Retours #4 (18/08/2026) — décision inversée : le bandeau promo reprend
  // désormais le code couleur semestre du Ruban (S1/S3 en septembre-décembre,
  // S2/S4 en janvier-mai, gris en juin-août). La couleur elle-même est posée
  // à part par applyScheduleTitleColors() plutôt qu'ici : elle doit changer
  // dès qu'on coche un onglet de période (weekStripPeriod), même quand ce
  // clic seul ne redessine pas la grille (cf. le commentaire sur
  // #weekStripPeriodSwitch dans bindEvents — la bascule ne fait que parcourir
  // la bande, elle ne déclenche pas renderPlanning()).
  return `<section class="schedule-section">
    <div class="schedule-title" data-promotion="${escapeAttr(promotion)}">${escapeHtml(promotion)}</div>
    <div class="table-scroll"><table class="schedule-table">
      <thead><tr><th>Créneau</th>${DAYS.map((d, i) => `<th>${d}${dayDates[i] ? `<br><small class="th-date">${escapeHtml(fmtDayDate(dayDates[i]))}</small>` : ''}</th>`).join('')}</tr></thead>
      <tbody>${eilRow}${constraintRow}${rows}${saturdayRow}</tbody>
    </table></div>
  </section>`;
}

async function placeSessionOnSlot(session, context) {
  const start = Number(context.slot);
  const end = inferEndSlot(start, session.expectedDuration || session.fictiveSlot || '');
  // Lot V — déposée sur une demi-colonne « ½A »/« ½B » : la séance prend ce
  // demi-groupe (le créneau accepte alors la moitié complémentaire sans conflit).
  const targetDemi = context.demiGroupe !== undefined ? context.demiGroupe : session.demiGroupe;
  const conflict = findPlanningConflict({
    id: session.id,
    weekId: selectedWeek,
    promotion: context.promotion,
    day: Number(context.day),
    startSlot: start,
    endSlot: end,
    demiGroupe: targetDemi
  });
  if (conflict && !confirm(`Le créneau chevauche déjà : ${conflict.title}. Placer quand même la séance ?`)) return;
  // Lot K — semaine thématique : avertir si on y pose une séance non-EIL.
  const placeWeek = state.weeks.find(w => w.id === selectedWeek);
  const isEilSession = session.constraintId && thematicConstraintsForWeek(placeWeek, context.promotion).some(c => c.id === session.constraintId);
  if (weekIsThematic(placeWeek, context.promotion) && !isEilSession && !confirm('Cette semaine est une semaine thématique / EIL pour cette promo (cours habituels suspendus). Placer quand même la séance ?')) return;
  Object.assign(session, {
    placementStatus: 'definitif',
    targetWeekId: selectedWeek,
    weekId: selectedWeek,
    promotion: context.promotion,
    day: Number(context.day),
    fictiveDay: Number(context.day), // Lot O — jour figé partagé avec la frise
    startSlot: start,
    endSlot: end,
    demiGroupe: targetDemi, // Lot V
    status: session.status || 'Prévue'
  });
  await saveData('Séance glissée-déposée dans le planning');
}

/* C1 — ressort une séance placée de l'emploi du temps vers la zone
   « Séances à placer » : elle redevient fictive et cible la semaine où
   elle était posée, pour la retrouver aussitôt dans le backlog. */
async function unplaceSession(session) {
  if (!session || isFictiveSession(session)) return;
  Object.assign(session, {
    placementStatus: 'fictif',
    targetWeekId: session.weekId || session.targetWeekId || selectedWeek,
    weekId: '',
    day: null,
    fictiveDay: '', // Lot O — plus de jour figé : retourne en « Jour à préciser »
    startSlot: null,
    endSlot: null
  });
  await saveData('Séance ressortie vers « Séances à placer »');
}

function findPlanningConflict(candidate) {
  return state.sessions.find(s => s.id !== candidate.id && isDefinitiveSession(s)
    && s.weekId === candidate.weekId
    && s.promotion === candidate.promotion
    && Number(s.day) === Number(candidate.day)
    && rangesOverlap(Number(s.startSlot), Number(s.endSlot), Number(candidate.startSlot), Number(candidate.endSlot))
    // Lot V — deux demi-groupes complémentaires (A vs B) coexistent sans conflit.
    && !areComplementaryHalves(s, candidate));
}

function rangesOverlap(aStart, aEnd, bStart, bEnd) {
  return aStart <= bEnd && bStart <= aEnd;
}

function inferEndSlot(startSlot, durationText = '') {
  const text = String(durationText).toLowerCase();
  let slots = 1;
  if (text.includes('demi') || text.includes('1/2') || text.includes('4h') || text.includes('4 h')) slots = 4;
  else if (text.includes('3h') || text.includes('3 h')) slots = 3;
  else if (text.includes('2h') || text.includes('2 h') || text.includes('2*55')) slots = 2;
  else if (text.includes('110')) slots = 2;
  let end = startSlot + slots - 1;
  if (startSlot < 4) end = Math.min(end, 3);
  if (startSlot > 4) end = Math.min(end, SLOTS.length - 1);
  if (end === 4) end = 3;
  return Math.max(startSlot, end);
}

/* Lot O — nombre de créneaux qu'occupe une séance d'après sa durée saisie
   (champ libre `expectedDuration`/`fictiveSlot`). 2 créneaux (2h) par défaut. */
function sessionDurationSlotsFromText(session) {
  const end = inferEndSlot(0, session.expectedDuration || session.fictiveSlot || '');
  return Math.max(1, end + 1);
}

/* Lot O — premier créneau libre d'une journée (Planning hebdo) pour empiler une
   séance auto-placée depuis la frise : on remplit d'abord le matin {0,1,2,3}
   puis l'après-midi {5,6,7,8} (aucune séance n'enjambe le Repas), en cherchant
   la 1ʳᵉ plage contiguë assez longue et libre. Repli : 1er créneau libre, sinon 0. */
function autoSlotStart(promotion, weekId, day, durationSlots, excludeId) {
  const occupied = new Set();
  state.sessions.forEach(s => {
    if (s.id === excludeId || !isDefinitiveSession(s)) return;
    if (s.weekId !== weekId || s.promotion !== promotion || Number(s.day) !== Number(day)) return;
    for (let i = Number(s.startSlot); i <= Number(s.endSlot); i += 1) occupied.add(i);
  });
  const blocks = [[0, 1, 2, 3], [5, 6, 7, 8]];
  for (const block of blocks) {
    for (let k = 0; k + durationSlots - 1 < block.length; k += 1) {
      const range = block.slice(k, k + durationSlots);
      if (range.every(slot => !occupied.has(slot))) return range[0];
    }
  }
  for (const block of blocks) {
    for (const slot of block) if (!occupied.has(slot)) return slot;
  }
  return 0;
}

/* 18/08 — grille complète des créneaux de la semaine (5 jours × 8 créneaux, hors Repas)
   pour le sélecteur de créneau de la modale séance : remplace l'ancienne
   `freeSlotsForWeek` qui ne retournait QUE les créneaux libres (retour de Martin — « je
   veux avoir toutes les possibilités de créneaux »). Un créneau occupé reste dans le
   résultat (flag `occupied`+`title`) : il reste cliquable, le garde-fou de chevauchement
   existe déjà au submit (`findPlanningConflict`). Indexé `[day][slotIndex]` pour un accès
   direct au rendu de la grille. */
function weekSlotGrid(promotion, weekId, excludeId) {
  const grid = {};
  DAYS.forEach((_, day) => {
    const occ = {};
    if (weekId) {
      state.sessions.forEach(s => {
        if (s.id === excludeId || !isDefinitiveSession(s)) return;
        if (s.weekId !== weekId || s.promotion !== promotion || Number(s.day) !== day) return;
        for (let i = Number(s.startSlot); i <= Number(s.endSlot); i += 1) occ[i] = s.title || 'Occupé';
      });
    }
    grid[day] = {};
    SLOTS.forEach((label, slotIndex) => {
      if (slotIndex === 4) return; // Repas — jamais un créneau
      grid[day][slotIndex] = { occupied: slotIndex in occ, title: occ[slotIndex] || '' };
    });
  });
  return grid;
}

/* #6 — les récréations sont des lignes <tr> pleine largeur intercalées dans la
   table planning (pause du matin avant le créneau 2, pause de l'après-midi avant
   le créneau 7). Pour qu'une séance longue N'ENJAMBE PAS ces lignes (ce qui les
   recouvrait et cassait l'alignement des colonnes), on la découpe en SEGMENTS aux
   récréations. Chaque segment est une cellule ; deux segments d'une même séance
   sont stylés pour se lire comme un seul bloc continu, la fine ligne « pause »
   restant visible entre les deux. Les blocs sans récréation interne :
   {0,1} · {2,3} · [Repas 4] · {5,6} · {7,8}. Le Repas (SLOTS 4) est un vrai
   créneau qu'aucune séance n'enjambe (borné dans inferEndSlot). */
function blockEndSlot(slot) {
  slot = Number(slot);
  if (slot <= 1) return 1;
  if (slot <= 3) return 3;
  if (slot <= 6) return 6;
  return SLOTS.length - 1;
}
/* 18/08 — borne DURE du sélecteur de créneau de la modale séance : une séance ne doit
   jamais enjamber le Repas (index 4), contrairement à `blockEndSlot` ci-dessus qui borne
   à la petite pause suivante (pour le rendu en segments visuels, une séance PEUT
   enjamber une récréation). Matin = 0-3, après-midi = 5-8 — mêmes demi-journées que le
   tableau local `blocks` d'`autoSlotStart` ci-dessous. */
function halfDayEndSlot(slot) {
  return Number(slot) < 4 ? 3 : SLOTS.length - 1;
}
/* Un segment de la séance `s` commence-t-il au créneau `slot` ? (vrai début, ou
   reprise juste après une récréation enjambée). */
function segmentStartsAt(s, slot) {
  const a = Number(s.startSlot), b = Number(s.endSlot);
  if (a === slot) return true;
  if (slot === 2 && a <= 1 && b >= 2) return true; // reprise après la pause du matin
  if (slot === 7 && a <= 6 && b >= 7) return true; // reprise après la pause de l'aprem
  return false;
}
/* Dernier créneau du segment de `s` démarrant à `slot` (borné à la fin du bloc). */
function segmentEndSlot(s, slot) {
  return Math.min(Number(s.endSlot), blockEndSlot(slot));
}



function renderInspection() {
  const definitive = state.sessions.filter(isDefinitiveSession);
  const fictive = state.sessions.filter(isFictiveSession);
  const linkedPercent = state.sessions.length ? Math.round(state.sessions.filter(s => s.sequenceId && s.ueId).length / state.sessions.length * 100) : 0;
  const bySemester = SEMESTERS.map(sem => `${sem} : ${state.ues.filter(ue => ue.semester === sem).length} UE`).join(' · ');
  $('#inspectionSummary').innerHTML = `
    <div class="list-item"><strong>Année scolaire</strong><div class="meta">${escapeHtml(state.schoolYear || '')}</div></div>
    <div class="list-item"><strong>Structuration</strong><div class="meta">${state.ues.length} UE, ${state.sequences.length} séquence(s), ${state.sessions.length} séance(s), ${state.constraints.length} contrainte(s)</div></div>
    <div class="list-item"><strong>Avancement de la planification</strong><div class="meta">${fictive.length} séance(s) à placer · ${definitive.length} placée(s)</div></div>
    <div class="list-item"><strong>Répartition semestrielle</strong><div class="meta">${escapeHtml(bySemester)}</div></div>
    <div class="list-item"><strong>Traçabilité pédagogique</strong><div class="meta">${linkedPercent}% des séances sont rattachées à une UE et une séquence.</div></div>
  `;
}

function openUeModal(ue = null, defaults = {}) {
  const isNew = !ue;
  $('#ueModalTitle').textContent = isNew ? 'Créer une UE' : 'Modifier une UE';
  $('#ueId').value = ue?.id || '';
  $('#ueCode').value = ue?.code || '';
  $('#ueTitle').value = ue?.title || '';
  // Pré-remplissage sur la promotion active du sidebar de la Conception.
  const defaultPromotion = defaults.promotion || designPromotionFilter || state.promotions[0] || 'GPN1';
  const defaultSemester = defaults.semester || 'Semestre 1';
  $('#uePromotion').value = ue?.promotion || defaultPromotion;
  if (!state.promotions.includes($('#uePromotion').value)) $('#uePromotion').value = state.promotions[0] || 'GPN1';
  $('#ueSemester').value = ue?.semester || defaultSemester;
  if (!SEMESTERS.includes($('#ueSemester').value)) $('#ueSemester').value = 'Semestre 1';
  $('#ueStartWeek').value = ue?.startWeekId || '';
  $('#ueEndWeek').value = ue?.endWeekId || '';
  $('#uePeriod').value = ue?.period || '';
  $('#ueTeacher').value = ue?.teacher || '';
  $('#ueHoursTarget').value = ue?.hoursTarget || 'À préciser';
  $('#ueDescription').value = ue?.description || '';
  updateUeCapacityPreview(ue || findUeByCode($('#ueCode').value) || {});
  $('#deleteUeButton').hidden = isNew;
  $('#ueDialog').showModal();
}

function openSequenceModal(sequence = null, context = {}) {
  const isNew = !sequence;
  const ue = sequence ? findUe(sequence.ueId) : findUe(context.ueId) || state.ues[0];
  $('#sequenceModalTitle').textContent = isNew ? 'Créer une séquence' : 'Modifier une séquence';
  $('#sequenceId').value = sequence?.id || '';
  refreshUeSelects();
  $('#sequenceUe').value = sequence?.ueId || ue?.id || '';
  $('#sequenceTitle').value = sequence?.title || '';
  $('#sequencePromotion').value = sequence?.promotion || ue?.promotion || state.promotions[0] || 'GPN1';
  $('#sequenceSemester').value = sequence?.semester || ue?.semester || 'Semestre 1';
  $('#sequenceWeeks').value = sequence?.targetWeeks || '';
  $('#sequencePeriodNote').value = sequence?.periodNote || '';
  // Écran 12 — semaines saisies dans #sequenceWeekStart/#sequenceWeekEnd (S45 → S46), à
  // la main ou via le calendrier (18/08). `parseWeekRanges` est la même fonction que la
  // Progression.
  const [firstRange] = parseWeekRanges(sequence?.targetWeeks || '');
  $('#sequenceWeekStart').value = firstRange ? `S${String(firstRange.start).padStart(2, '0')}` : '';
  $('#sequenceWeekEnd').value = firstRange ? `S${String(firstRange.end).padStart(2, '0')}` : '';
  syncSequenceWeeksField();
  seqCalMonthKey = null; // recentre le calendrier sur la période de cette séquence
  renderSequenceCalendar();
  // Toujours une chaîne (« 5 h », « 12 h »…) : on n'affiche que le nombre dans
  // le stepper, le reste du texte éventuel (arbitrage ancien) est ignoré ici
  // mais reste conservé tel quel s'il n'est jamais réenregistré.
  const hoursMatch = /\d+/.exec(sequence?.hoursEstimate || '');
  $('#sequenceHours').value = hoursMatch ? hoursMatch[0] : '';
  // Lot C-bis — champs retirés du formulaire (voir la note à l'enregistrement) ;
  // le `?.` garde ces lignes inoffensives s'ils venaient à revenir.
  if ($('#sequenceType')) $('#sequenceType').value = sequence?.sequenceType || '';
  if ($('#sequenceStatus')) $('#sequenceStatus').value = sequence?.status || 'Prévue';
  const seqColorInput = $('#sequenceColorInput');
  if (seqColorInput) {
    const custom = isValidHexColor(sequence?.color);
    const auto = sequence ? computedSequenceColor(sequence) : computedSequenceColor({ ueId: ue?.id, id: '__new' });
    seqColorInput.value = custom ? sequence.color : auto;
    seqColorInput.dataset.custom = custom ? '1' : '0';
    syncColorSwatchActive('#sequenceColorSwatches', '#sequenceColorInput');
  }
  const assessmentType = sequence?.assessmentType || '';
  $('#sequenceAssessmentType').value = assessmentType;
  $$('#sequenceAssessmentTypeButtons button').forEach(b => b.classList.toggle('active', (b.dataset.assessmentType || '') === assessmentType));
  $('#sequenceTeacher').value = sequence?.teacher || '';
  $('#sequenceObjectives').value = sequence?.objectives || '';
  renderSequenceCapacityChoices(sequence?.capacityCodes || [], ue);
  $('#sequenceCapacities').value = sequence?.capacities || '';
  $('#sequenceLearningOutcomes').value = sequence?.learningOutcomes || '';
  $('#sequencePrerequisites').value = sequence?.prerequisites || '';
  $('#sequenceKeywords').value = sequence?.keywords || '';
  $('#sequenceTeachingMethods').value = sequence?.teachingMethods || '';
  $('#sequenceDifferentiation').value = sequence?.differentiation || '';
  $('#sequenceAssessment').value = sequence?.assessment || '';
  $('#sequenceResources').value = sequence?.resources || '';
  $('#sequenceDeliverables').value = sequence?.deliverables || '';
  $('#sequenceAdjustmentNotes').value = sequence?.adjustmentNotes || '';
  $('#sequenceNotes').value = sequence?.notes || '';
  $('#deleteSequenceButton').hidden = isNew;
  $('#exportSequenceButton').hidden = isNew;
  $('#submitSequenceButton').textContent = isNew ? 'Créer la séquence' : 'Enregistrer';
  $('#sequenceDialog').showModal();
  $('#sequenceDialog')._dirty = false;
}

/* Séance : simple coche depuis Ajustements #2 (18/08/2026) — le mode réel
   ('etablissement'/'personnel') est gardé sur dataset.mode plutôt que redemandé
   à la saisie, pour ne pas écraser une bascule « personnel » déjà faite depuis
   le tableau de bord (data-bascule-vehicule) quand on rouvre la fiche. Cochée
   sans mode connu (nouvelle séance) → établissement, la priorité voulue. */
function deplacementModeOf(prefixe) {
  if (prefixe === 'reunion') return $('#reunionDeplacement')?.value || '';
  const cb = $('#sessionDeplacement');
  return cb?.checked ? (cb.dataset.mode || 'etablissement') : '';
}

/* N'affiche que la suite qui correspond au mode choisi : une réservation de
   véhicule pour l'établissement, un ordre de mission pour le véhicule personnel.
   Même fonction pour les deux modales — les identifiants ne diffèrent que par le
   préfixe. */
function syncDeplacementFields(prefixe) {
  const p = prefixe === 'reunion' ? 'reunion' : 'session';
  const mode = deplacementModeOf(prefixe);
  const suite = $('#sessionDeplacementSuite');
  const vehicule = $(`#${p}VehicleBookedField`);
  const mission = $(`#${p}OrdreMissionField`);
  if (vehicule) vehicule.hidden = mode !== 'etablissement';
  if (mission) mission.hidden = mode !== 'personnel';
  if (p === 'session' && suite) suite.hidden = !mode;
}

function openSessionModal(session = null, context = {}) {
  const isNew = !session;
  const seq = session ? findSequence(session.sequenceId) : findSequence(context.sequenceId);
  const ue = session ? findUe(session.ueId || seq?.ueId) : findUe(context.ueId || seq?.ueId) || state.ues[0];
  $('#sessionModalTitle').textContent = isNew ? 'Créer une séance' : 'Modifier une séance';
  $('#sessionId').value = session?.id || '';
  refreshUeSelects();
  $('#sessionUe').value = session?.ueId || ue?.id || '';
  // Lot K — rattachement : semaine thématique (constraintId, valeur « eil:… ») en
  // priorité, sinon séquence.
  const rattValue = session?.constraintId ? `eil:${session.constraintId}` : (session?.sequenceId || (context.constraintId ? `eil:${context.constraintId}` : '') || seq?.id || '');
  refreshSessionSequenceSelect(rattValue);
  $('#sessionSequence').value = rattValue;
  $('#sessionTitle').value = session?.title || '';
  $('#sessionPromotion').value = session?.promotion || context.promotion || ue?.promotion || state.promotions[0] || 'GPN1';
  const noSeqBox = $('#sessionNoSequence');
  if (noSeqBox) { noSeqBox.checked = !rattValue; $('#sessionSequence').disabled = !rattValue; }
  // Semaine par défaut d'une NOUVELLE séance calée sur les semaines de l'UE en
  // conception : 1re semaine de la séquence de rattachement, sinon semaine de la
  // semaine thématique (EIL), sinon semaine de début de l'UE. À l'édition, la
  // semaine déjà saisie de la séance a toujours la priorité.
  const constraintForDefault = findConstraint(session?.constraintId || context.constraintId);
  const designDefaultWeek = isNew
    ? (firstWeekIdOfSequence(seq)
        || (constraintForDefault ? (weekForIsoDate(constraintForDefault.start)?.id || '') : '')
        || ue?.startWeekId
        || '')
    : '';
  // Écran 12 — créneau choisi via la grille hebdomadaire (plus de jour/début/fin/statut
  // de placement saisis à la main ; exception assumée à REGLES.md #22 pour cet écran, cf.
  // renderSessionSlotPicker).
  sessionSlotPickerWeekId = session?.targetWeekId || session?.weekId || context.weekId || designDefaultWeek || selectedWeek;
  if (session && isDefinitiveSession(session) && !session.customStart && !session.customEnd) {
    sessionSlotChoice = { type: 'range', day: Number(session.day), startSlot: Number(session.startSlot), endSlot: Number(session.endSlot) };
  } else if (session && isDefinitiveSession(session)) {
    sessionSlotChoice = { type: 'other' };
  } else if (session) {
    sessionSlotChoice = { type: 'none' };
  } else if (context.day != null && context.slot != null) {
    sessionSlotChoice = { type: 'range', day: Number(context.day), startSlot: Number(context.slot), endSlot: Number(context.slot) };
  } else {
    sessionSlotChoice = null;
  }
  $('#sessionDay').value = String(session?.day ?? context.day ?? 0);
  $('#sessionStart').value = String(session?.startSlot ?? context.slot ?? 0);
  $('#sessionEnd').value = String(session?.endSlot ?? context.slot ?? 0);
  $('#sessionCustomStart').value = session?.customStart || '';
  $('#sessionCustomEnd').value = session?.customEnd || '';
  $('#sessionType').value = session?.type || 'Cours en salle';
  if ($('#sessionDemiGroupe')) $('#sessionDemiGroupe').value = session?.demiGroupe || context.demiGroupe || ''; // Lot V — champ « Groupe » unifié
  $('#sessionTeacher').value = session?.teacher || '';
  $('#sessionRoom').value = session?.room || '';
  if ($('#sessionRoomToBook')) $('#sessionRoomToBook').value = session?.roomToBook || (($('#sessionType').value === 'Cours en salle informatique') ? 'info' : '');
  // Lot C-bis — plus de champ « Statut pédagogique » dans la modale (voir la note
  // à l'enregistrement). Le `?.` garde la ligne inoffensive si le champ revenait.
  if ($('#sessionStatus')) $('#sessionStatus').value = session?.status || 'Prévue';
  const sessColorInput = $('#sessionColorInput');
  if (sessColorInput) {
    const custom = isValidHexColor(session?.color);
    const inherited = session ? sessionInheritedColor(session) : (seq ? sequenceColor(seq.id) : ueColor(ue?.id));
    sessColorInput.value = custom ? session.color : inherited;
    sessColorInput.dataset.custom = custom ? '1' : '0';
    syncColorSwatchActive('#sessionColorSwatches', '#sessionColorInput');
  }
  renderSessionSlotPicker();
  if ($('#sessionDeplacement')) {
    $('#sessionDeplacement').checked = !!session?.deplacement;
    $('#sessionDeplacement').dataset.mode = session?.deplacement || '';
    if ($('#sessionVehicleBooked')) $('#sessionVehicleBooked').checked = !!session?.vehicleBooked;
    if ($('#sessionOrdreMission')) $('#sessionOrdreMission').checked = !!session?.ordreMission;
    syncDeplacementFields('session');
  }
  if ($('#sessionCapacityResetHint')) $('#sessionCapacityResetHint').hidden = true;
  capacitesParUe = {}; // mémoire propre à chaque ouverture de la modale
  ueCapacitesPrecedente = $('#sessionUe')?.value || '';
  renderSessionCapacityChoices(session?.capacityCodes || [], ue, seq);
  $('#sessionObjectives').value = session?.objectives || '';
  $('#sessionKeywords').value = session?.keywords || '';
  $('#sessionActivities').value = session?.activities || '';
  $('#sessionNotions').value = session?.notions || '';
  $('#sessionMaterials').value = session?.materials || '';
  if ($('#sessionMaterielReserver')) $('#sessionMaterielReserver').checked = !!session?.materielAReserver;
  $('#sessionDifferentiation').value = session?.differentiation || '';
  $('#sessionNotes').value = session?.notes || '';
  $('#deleteSessionButton').hidden = isNew;
  const dupBtn = $('#duplicateSessionButton');
  if (dupBtn) dupBtn.hidden = isNew;
  $('#submitSessionButton').textContent = isNew ? 'Créer la séance' : 'Enregistrer';
  const chainBtn = $('#chainSessionButton');
  if (chainBtn) chainBtn.hidden = !isNew;
  sessionChainRequested = false;
  $('#sessionDialog').showModal();
  $('#sessionDialog')._dirty = false;
}

function openConstraintModal(constraint = null) {
  const isNew = !constraint;
  $('#constraintModalTitle').textContent = isNew ? 'Ajouter une période / contrainte' : 'Modifier une période / contrainte';
  $('#constraintId').value = constraint?.id || '';
  $('#constraintLabel').value = constraint?.label || '';
  $('#constraintType').value = constraint?.type || 'Vacances';
  $('#constraintStart').value = constraint?.start || '';
  $('#constraintEnd').value = constraint?.end || constraint?.start || '';
  $('#constraintNotes').value = constraint?.notes || '';
  renderConstraintPromotionChoices(constraint?.promotions || state.promotions);
  // Sous-formulaire examen
  const exam = constraint?.exam || {};
  $('#constraintExamControl').value = exam.control || '';
  $('#constraintExamAbsences').value = exam.absences || '';
  $('#constraintExamRemarks').value = exam.remarks || '';
  renderConstraintExamUeSelect(exam.ueId || '');
  renderConstraintExamCapacities(exam.ueId || '', exam.capacityCodes || []);
  toggleConstraintExamSection();
  toggleConstraintEilButton();
  $('#deleteConstraintButton').hidden = isNew;
  $('#constraintDialog').showModal();
}

/* Le sous-formulaire examen n'apparaît que pour une contrainte de type examen. */
function isExamConstraintType(type = '') {
  return /examen|ccf|évaluation|evaluation/i.test(type);
}

function toggleConstraintExamSection() {
  const section = $('#constraintExamSection');
  if (!section) return;
  section.hidden = !isExamConstraintType($('#constraintType')?.value || '');
}

/* Lot K — le bouton « + Séance (EIL) » ne s'affiche que pour une semaine thématique
   DÉJÀ enregistrée (il faut son id pour y rattacher des séances). */
function toggleConstraintEilButton() {
  const btn = $('#detailEilButton');
  if (!btn) return;
  const on = isThematicConstraint({ type: $('#constraintType')?.value || '' }) && !!$('#constraintId')?.value;
  btn.style.display = on ? '' : 'none';
}

function renderConstraintExamUeSelect(selectedUeId = '') {
  const select = $('#constraintExamUe');
  if (!select) return;
  const options = ['<option value="">— UE à préciser —</option>']
    .concat((state.ues || []).map(ue => `<option value="${escapeAttr(ue.id)}">${escapeHtml(ue.code)} · ${escapeHtml(ue.title)}</option>`))
    .join('');
  select.innerHTML = options;
  select.value = selectedUeId || '';
}

function renderConstraintExamCapacities(ueId = '', selectedCodes = []) {
  const container = $('#constraintExamCapacities');
  if (!container) return;
  const ue = (state.ues || []).find(u => u.id === ueId);
  // Capacités proposées : celles de l'UE (composition effective, cf. #5), sinon
  // toutes les capacités connues.
  let caps = ueCapacities(ue).map(c => ({ code: c.code, title: c.title }));
  if (!caps.length) {
    caps = (state.ues || []).flatMap(u => ueCapacities(u)).filter((c, i, arr) => arr.findIndex(x => x.code === c.code) === i);
  }
  const selected = new Set(selectedCodes);
  container.innerHTML = caps.length
    ? caps.map(c => `<label class="checkbox-chip"><input type="checkbox" value="${escapeAttr(c.code)}" ${selected.has(c.code) ? 'checked' : ''}><span title="${escapeAttr(c.title || '')}">${escapeHtml(c.code)}</span></label>`).join('')
    : '<p class="meta">Aucune capacité indexée.</p>';
}



// Retours #4 (18/08/2026) — la couleur d'une UE suit désormais son semestre
// (S1 bleu, S2 ambre, S3 rouge, S4 vert, cf. SEMESTER_COLORS), pas un index
// arbitraire dans state.ues : Martin veut retrouver le code couleur du Ruban
// partout où une UE est teintée (sidebar/titre Conception, bandeaux séquences/
// séances de Progression, via sequenceColor/sessionTint qui en dérivent).
function ueColor(ueId = '') {
  const ue = state?.ues?.find(u => u.id === ueId);
  return semesterColorOf(ue?.semester);
}

/* Couleur d'une séquence : dérivée de la couleur de son UE, mais nettement
   distincte d'une séquence à l'autre. But : une séquence et SES séances partagent
   exactement la même teinte (lecture du rattachement dans la frise), et deux
   séquences voisines sont franchement différenciables.
   Méthode (Lot 5, Q1) : la 1re séquence garde la teinte de l'UE (ancrage), les
   suivantes s'en écartent d'au plus ±25° (une séquence reste identifiable comme
   appartenant à son UE — elle ne part plus en cyan/magenta sous une UE
   vert-bleu) ; c'est la clarté, plafonnée, qui distingue surtout les voisines. */
function sequenceColor(seqId = '') {
  const seq = state?.sequences?.find(s => s.id === seqId);
  if (!seq) return ueColor('');
  // Lot L — couleur CHOISIE par l'utilisateur (modale séquence) prioritaire ;
  // à défaut, couleur automatique. Les séances héritent de cette couleur via
  // sessionTint(), pour une cohérence entre Conception, Progression semestre et
  // Planning hebdo.
  if (isValidHexColor(seq.color)) return seq.color;
  return computedSequenceColor(seq);
}

/* Couleur automatique d'une séquence (utilisée quand aucune couleur n'a été
   choisie) : voir la note ci-dessus — ancrage sur l'UE puis rotation par l'angle
   d'or, saturation vive et luminosités alternées pour distinguer les voisines. */
function computedSequenceColor(seq) {
  if (!seq) return ueColor('');
  const base = ueColor(seq.ueId);
  const [bh] = hexToHsl(base);
  const siblings = (state?.sequences || []).filter(s => s.ueId === seq.ueId);
  const rank = Math.max(0, siblings.findIndex(s => s.id === seq.id));
  const hueOffset = [0, 18, -22, 9, -16, 24][rank % 6]; // ±25° maxi, rang 0 = ancrage
  const hue = (bh + hueOffset + 360) % 360;
  const sat = 72 - (rank % 3) * 7;                    // 72 / 65 / 58 : couleurs vives
  const light = [46, 38, 50, 42, 47, 35][rank % 6];   // plafonnées à 50 : plus de couleurs trop claires
  return hslToHex(hue, sat, light);
}

function isValidHexColor(c) { return typeof c === 'string' && /^#[0-9a-fA-F]{6}$/.test(c); }

/* Teinte d'une séance : couleur PROPRE choisie sur la séance (prioritaire),
   sinon couleur de sa séquence (si rattachée), sinon couleur de son UE. Point
   d'entrée unique pour colorer une séance dans toutes les vues. */
function sessionTint(s) {
  if (s && isValidHexColor(s.color)) return s.color;
  return s && s.sequenceId ? sequenceColor(s.sequenceId) : ueColor(s?.ueId);
}

/* Couleur héritée par une séance si elle n'a pas de couleur propre (séquence ou UE). */
function sessionInheritedColor(s) { return s && s.sequenceId ? sequenceColor(s.sequenceId) : ueColor(s?.ueId); }

/* Valeur du sélecteur de couleur de la modale séquence : la couleur n'est
   enregistrée que si l'utilisateur l'a explicitement choisie (dataset.custom),
   sinon chaîne vide = couleur automatique. */
function getSequenceColorFieldValue() {
  const el = $('#sequenceColorInput');
  if (!el) return '';
  return el.dataset.custom === '1' && isValidHexColor(el.value) ? el.value : '';
}

function getSessionColorFieldValue() {
  const el = $('#sessionColorInput');
  if (!el) return '';
  return el.dataset.custom === '1' && isValidHexColor(el.value) ? el.value : '';
}

/* Écran 12 — grille figée de 12 teintes (JETONS.md « Palette libre de séquence
   / séance »), partagée par les deux modales. Le champ `hiddenInputId` (le même
   `<input type="color">` qu'avant, resté la source de vérité pour
   get*ColorFieldValue ci-dessus) reste aussi le picker « autre… » : la grille
   ne fait qu'écrire dedans par-dessus. */
const SEQUENCE_COLOR_PALETTE = ['#1a5fb4', '#1c71d8', '#3584e4', '#99c1f1', '#23ccd7', '#33d17a', '#26a269', '#f5c211', '#ff7800', '#e01b24', '#e66100', '#6e4f82'];

function renderColorSwatchGrid(gridSelector, hiddenInputId) {
  const grid = $(gridSelector);
  if (!grid) return;
  grid.innerHTML = SEQUENCE_COLOR_PALETTE.map(hex =>
    `<button type="button" class="color-swatch" data-color="${hex}" style="background:${hex}" aria-label="${hex}"></button>`
  ).join('');
  grid.addEventListener('click', (event) => {
    const btn = event.target.closest('.color-swatch');
    if (!btn) return;
    const input = $(hiddenInputId);
    if (!input) return;
    input.value = btn.dataset.color;
    input.dataset.custom = '1';
    syncColorSwatchActive(gridSelector, hiddenInputId);
  });
}

function syncColorSwatchActive(gridSelector, hiddenInputId) {
  const grid = $(gridSelector);
  const input = $(hiddenInputId);
  if (!grid || !input) return;
  const value = (input.value || '').toLowerCase();
  $$(`${gridSelector} .color-swatch`).forEach(btn => {
    btn.classList.toggle('active', btn.dataset.color.toLowerCase() === value);
  });
}

/* 18/08 — sélecteur de créneau de la modale séance, en mini-grille hebdomadaire complète
   (exception assumée à REGLES.md #22 pour cet écran précis, décision de Martin — « je
   veux avoir toutes les possibilités de créneaux »). `sessionSlotPickerWeekId`/
   `sessionSlotChoice` sont l'état UI (déclarés en haut du fichier) ; le submit du
   formulaire séance les traduit en day/startSlot/endSlot/weekId/placementStatus. Un clic
   simple pose 1 créneau (cas courant, inchangé en nombre de clics) ; un 2e clic sur le
   même jour étend la plage (`applySlotClick`), plafonnée à la demi-journée
   (`blockEndSlot`, jamais au-delà du Repas). */
function renderSessionSlotPicker() {
  const weekId = sessionSlotPickerWeekId || selectedWeek;
  sessionSlotPickerWeekId = weekId;
  const week = state.weeks.find(w => w.id === weekId);
  const label = $('#sessionSlotWeekLabel');
  if (label) label.textContent = week ? `${week.label.replace('S0', 'S')} · ${compactDateRange(week.dateRange)}` : 'Semaine à choisir';
  const promotion = $('#sessionPromotion')?.value || state.promotions[0] || 'GPN1';
  const excludeId = $('#sessionId')?.value || '';
  const grid = $('#sessionSlotGrid');
  if (grid) {
    const occ = weekSlotGrid(promotion, weekId, excludeId);
    const header = `<span class="slot-grid-corner" aria-hidden="true"></span>${DAYS.map(d => `<span class="slot-grid-day">${escapeHtml(d.slice(0, 3))}</span>`).join('')}`;
    const rows = SLOTS.map((slotLabel, slotIndex) => {
      if (slotIndex === 4) {
        return `<span class="slot-grid-time slot-grid-lunch">Repas</span>${DAYS.map(() => '<span class="slot-cell-lunch" aria-hidden="true"></span>').join('')}`;
      }
      const time = `<span class="slot-grid-time">${escapeHtml(slotLabel.split(' – ')[0])}</span>`;
      const cells = DAYS.map((_, day) => {
        const cell = occ[day]?.[slotIndex];
        const occupied = !!cell?.occupied;
        const title = occupied ? ` title="${escapeAttr(cell.title)}"` : '';
        return `<button type="button" class="slot-cell${occupied ? ' is-occupied' : ''}" data-slot-day="${day}" data-slot-index="${slotIndex}"${title}>${occupied ? escapeHtml(truncate(cell.title, 12)) : ''}</button>`;
      }).join('');
      return time + cells;
    }).join('');
    grid.innerHTML = header + rows;
  }
  syncSessionSlotPickerActive();
  renderSessionSlotSummary();
}

/* Bandeau au-dessus/en dessous de la grille : lecture de la plage/durée choisie, plus des
   boutons de durée rapide (voie alternative au 2e clic — répond au retour de Martin
   « il manque la possibilité de renseigner la durée »). Boutons en nombre de créneaux
   (pas un texte libre : évite un 2e parseur de durée à côté de celui du backlog). */
function formatSlotDuration(minutes) {
  const h = Math.floor(minutes / 60), m = minutes % 60;
  if (!h) return `${m} min`;
  return m ? `${h} h ${String(m).padStart(2, '0')}` : `${h} h`;
}

function renderSessionSlotSummary() {
  const el = $('#sessionSlotSummary');
  if (!el) return;
  if (sessionSlotChoice?.type !== 'range') { el.innerHTML = ''; return; }
  const { day, startSlot, endSlot } = sessionSlotChoice;
  const count = endSlot - startSlot + 1;
  const startLabel = SLOTS[startSlot].split(' – ')[0];
  const endLabel = SLOTS[endSlot].split(' – ')[1];
  const duree = formatSlotDuration(count * 55);
  const maxSlots = halfDayEndSlot(startSlot) - startSlot + 1;
  const quickButtons = [];
  for (let n = 1; n <= maxSlots; n += 1) {
    const durLabel = formatSlotDuration(n * 55);
    quickButtons.push(`<button type="button" class="quick-duration-btn${n === count ? ' active' : ''}" data-quick-duration="${n}">${n} créneau${n > 1 ? 'x' : ''} · ${durLabel}</button>`);
  }
  el.innerHTML = `<p class="slot-picker-summary-text"><strong>${escapeHtml(DAY_NAMES[day])}</strong> · ${escapeHtml(startLabel)}–${escapeHtml(endLabel)} · ${count} créneau${count > 1 ? 'x' : ''} (${duree})</p><div class="quick-duration-buttons">${quickButtons.join('')}</div>`;
}

/* Logique d'interaction de la grille : pas de sélection sur ce jour (ou sélection sur un
   autre jour), ou plage déjà complète (2e clic déjà fait), ou clic avant le départ actuel
   → redémarre une plage à 1 créneau sur le slot cliqué. Sélection à 1 créneau sur ce même
   jour et clic postérieur → étend la fin (plafonnée à la demi-journée). Jamais plus de
   2 clics pour une plage complète. */
function applySlotClick(day, slotIndex) {
  const cur = sessionSlotChoice?.type === 'range' ? sessionSlotChoice : null;
  const canExtend = cur && cur.day === day && cur.startSlot === cur.endSlot && slotIndex > cur.startSlot;
  if (canExtend) {
    const maxEnd = halfDayEndSlot(cur.startSlot);
    sessionSlotChoice = { type: 'range', day, startSlot: cur.startSlot, endSlot: Math.min(slotIndex, maxEnd) };
  } else {
    sessionSlotChoice = { type: 'range', day, startSlot: slotIndex, endSlot: slotIndex };
  }
}

/* Bouton de durée rapide : pose la fin depuis le début déjà choisi, sans second clic sur
   la grille — plafonnée à la demi-journée comme applySlotClick. */
function applyQuickDuration(slots) {
  if (sessionSlotChoice?.type !== 'range') return;
  const maxEnd = halfDayEndSlot(sessionSlotChoice.startSlot);
  sessionSlotChoice = { ...sessionSlotChoice, endSlot: Math.min(sessionSlotChoice.startSlot + slots - 1, maxEnd) };
}

function syncSessionSlotPickerActive() {
  const cur = sessionSlotChoice?.type === 'range' ? sessionSlotChoice : null;
  $$('#sessionSlotGrid .slot-cell').forEach(btn => {
    const day = Number(btn.dataset.slotDay), idx = Number(btn.dataset.slotIndex);
    const inRange = !!cur && day === cur.day && idx >= cur.startSlot && idx <= cur.endSlot;
    btn.classList.toggle('is-selected', inRange);
    btn.classList.toggle('is-range-start', inRange && idx === cur.startSlot);
    btn.classList.toggle('is-range-end', inRange && idx === cur.endSlot);
    btn.classList.toggle('is-in-range', inRange && idx !== cur.startSlot && idx !== cur.endSlot);
  });
  $('.slot-option-other')?.classList.toggle('active', sessionSlotChoice?.type === 'other');
  $('.slot-option-none')?.classList.toggle('active', sessionSlotChoice?.type === 'none');
  const customFields = $('#sessionCustomSlotFields');
  if (customFields) customFields.hidden = sessionSlotChoice?.type !== 'other';
}

/* Id de la semaine suivante dans l'ordre chronologique de state.weeks ('' si aucune). */
function nextWeekId(weekId) {
  const i = state.weeks.findIndex(w => w.id === weekId);
  return (i >= 0 && i + 1 < state.weeks.length) ? state.weeks[i + 1].id : '';
}

/* Lot L — duplique une séance pour réutiliser ses contenus sans tout ressaisir.
   Le duplicata part « à placer » (aucun créneau → pas de superposition) et cible
   la semaine SUIVANTE si la source était placée dans l'EDT, sinon la même semaine
   cible. La modale se rouvre sur la copie pour ajustement/placement immédiat. */
async function duplicateSession(source) {
  if (!source) return;
  const copy = { ...source };
  copy.id = uid('session');
  copy.title = `${source.title || 'Séance'} (copie)`;
  copy.order = Date.now();
  copy.capacityCodes = Array.isArray(source.capacityCodes) ? [...source.capacityCodes] : [];
  // Lot B — une copie n'hérite d'aucune démarche déjà engagée : ni frais liés,
  // ni ordre de mission, ni réservation (de salle comme de véhicule). Le MODE de
  // déplacement, lui, est une caractéristique de la séance et se recopie.
  Object.assign(copy, normalizeDeplacementFields({ deplacement: source.deplacement || '' }));
  copy.roomBooked = false;
  copy.placementStatus = 'fictif';
  copy.weekId = '';
  copy.day = null;
  copy.fictiveDay = '';
  copy.startSlot = null;
  copy.endSlot = null;
  const srcWeek = source.weekId || source.targetWeekId || '';
  copy.targetWeekId = source.placementStatus === 'definitif'
    ? (nextWeekId(srcWeek) || srcWeek)
    : (source.targetWeekId || srcWeek);
  state.sessions.push(copy);
  await saveData('Séance dupliquée (à placer)');
  openSessionModal(findSession(copy.id));
}

/* Conversions HSL <-> hex (teinte en degrés, S/L en %). */
function hexToHsl(hex) {
  const m = String(hex || '#3e6b52').replace('#', '');
  const r = parseInt(m.slice(0, 2), 16) / 255, g = parseInt(m.slice(2, 4), 16) / 255, b = parseInt(m.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b); let h = 0, s = 0; const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min; s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) h = (g - b) / d + (g < b ? 6 : 0); else if (max === g) h = (b - r) / d + 2; else h = (r - g) / d + 4;
    h /= 6;
  }
  return [h * 360, s * 100, l * 100];
}
function hslToHex(h, s, l) {
  h = (((h % 360) + 360) % 360) / 360; s = Math.min(1, Math.max(0, s / 100)); l = Math.min(1, Math.max(0, l / 100));
  const hue2rgb = (p, q, t) => { if (t < 0) t += 1; if (t > 1) t -= 1; if (t < 1 / 6) return p + (q - p) * 6 * t; if (t < 1 / 2) return q; if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6; return p; };
  let r, g, b;
  if (s === 0) { r = g = b = l; } else { const q = l < 0.5 ? l * (1 + s) : l + s - l * s; const p = 2 * l - q; r = hue2rgb(p, q, h + 1 / 3); g = hue2rgb(p, q, h); b = hue2rgb(p, q, h - 1 / 3); }
  const toHex = v => Math.round(v * 255).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/* Décale une couleur hex dans l'espace HSL (teinte en degrés, luminosité et
   saturation en points de %). */
function shiftColor(hex, hueDeg = 0, lightPct = 0, satPct = 0) {
  const m = String(hex).replace('#', '');
  const r = parseInt(m.slice(0, 2), 16) / 255;
  const g = parseInt(m.slice(2, 4), 16) / 255;
  const b = parseInt(m.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0; const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h /= 6;
  }
  h = (h * 360 + hueDeg + 360) % 360 / 360;
  const l2 = Math.min(1, Math.max(0, l + lightPct / 100));
  const s2 = Math.min(1, Math.max(0, s + satPct / 100));
  const hue2rgb = (p, q, t) => {
    if (t < 0) t += 1; if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };
  let r2, g2, b2;
  if (s2 === 0) { r2 = g2 = b2 = l2; }
  else {
    const q = l2 < 0.5 ? l2 * (1 + s2) : l2 + s2 - l2 * s2;
    const p = 2 * l2 - q;
    r2 = hue2rgb(p, q, h + 1 / 3); g2 = hue2rgb(p, q, h); b2 = hue2rgb(p, q, h - 1 / 3);
  }
  const toHex = v => Math.round(v * 255).toString(16).padStart(2, '0');
  return `#${toHex(r2)}${toHex(g2)}${toHex(b2)}`;
}

/* Lot C-bis — aplat de la même couleur, mais APLATI (mélangé au fond) : donne
   la valeur hex réelle d'un `--ue-soft` posé en rgba, ce qui permet de calculer
   une encre lisible PAR-DESSUS le pastel et non par-dessus la surface nue. */
function mixHex(hex, baseHex, ratio = .13) {
  const parse = h => {
    const c = String(h || '#000000').replace('#', '');
    const n = parseInt(c.length === 3 ? c.split('').map(x => x + x).join('') : c, 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  };
  const [r1, g1, b1] = parse(hex);
  const [r2, g2, b2] = parse(baseHex);
  const mix = (a, b) => Math.round(a * ratio + b * (1 - ratio));
  const toHex = v => v.toString(16).padStart(2, '0');
  return `#${toHex(mix(r1, r2))}${toHex(mix(g1, g2))}${toHex(mix(b1, b2))}`;
}

/* Lot C-bis — teinte d'aplat FONCÉ pour le bandeau d'UE : la palette d'UE va du
   sombre (#2f6f73) au doré clair (#b08a2e) ; on l'assombrit juste ce qu'il faut
   pour écrire en blanc dessus, sinon les UE claires deviendraient illisibles.
   Même mécanique qu'inkColor, cible inversée (fond au lieu d'encre).
   Seuil visé 5,5 et non 4,5 : le bandeau ne porte pas que du blanc pur, il porte
   aussi des mentions atténuées (étiquette, promotion, compteur). S'arrêter à 4,5
   les faisait tomber à 3,7 — la marge est là pour elles. */
function deepColor(hex) { return inkColor(hex, '#ffffff', 5.5); }

function hexToRgba(hex, alpha = 1) {
  const clean = String(hex || '#000000').replace('#', '');
  const n = parseInt(clean.length === 3 ? clean.split('').map(c => c + c).join('') : clean, 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/* Lot 5 — luminance/contraste WCAG, pour dériver une « encre » (couleur assez
   foncée pour écrire) de n'importe quelle couleur d'UE/séquence. Les couleurs
   de séquence sont calculées automatiquement et les modales proposent un
   sélecteur libre : aucune palette figée ne peut garantir le contraste, il
   faut donc le calculer à la volée. */
function relativeLuminance(hex) {
  const clean = String(hex).replace('#', '');
  const [r, g, b] = [0, 2, 4].map(i => {
    const c = parseInt(clean.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
function contrastRatio(hexA, hexB) {
  const lA = relativeLuminance(hexA) + 0.05;
  const lB = relativeLuminance(hexB) + 0.05;
  return lA > lB ? lA / lB : lB / lA;
}
/* Assombrit hex (même teinte, luminosité HSL réduite par paliers) jusqu'à
   atteindre 4.5:1 sur onHex (fond clair par défaut : --surface). Les aplats
   (bandeau de tuile, bande de frise, pastille) restent en --ue-color ; seule
   cette « encre » sert à écrire par-dessus. */
function inkColor(hex, onHex = '#fbfcf9', seuil = 4.5) {
  const [h, s] = hexToHsl(hex);
  let l = hexToHsl(hex)[2];
  let candidate = hex;
  let steps = 0;
  while (contrastRatio(candidate, onHex) < seuil && l > 0 && steps < 40) {
    l = Math.max(0, l - 3);
    candidate = hslToHex(h, s, l);
    steps++;
  }
  return candidate;
}


function exportUeProgressionPrint(ue) {
  if (!ue) return;
  const sequences = state.sequences.filter(seq => seq.ueId === ue.id).sort((a, b) => firstSequenceWeekIndex(a, state.weeks) - firstSequenceWeekIndex(b, state.weeks));
  const rows = sequences.length ? sequences.map(seq => {
    const sessions = state.sessions.filter(s => s.sequenceId === seq.id).sort((a, b) => sessionSortKey(a).localeCompare(sessionSortKey(b)));
    const sessionTitles = sessions.map(s => escapeHtml(s.title || '')).filter(Boolean).join('<br>');
    return `<tr>
      <td>${escapeHtml(seq.title || '')}</td>
      <td>${escapeHtml(seq.periodNote || seq.targetWeeks || '')}</td>
      <td>${escapeHtml(seq.targetWeeks || '')}</td>
      <td>${escapeHtml(seq.hoursEstimate || '')}</td>
      <td>${escapeHtml(seq.teacher || '')}</td>
      <td>${escapeHtml((seq.capacityCodes || []).join(', '))}</td>
      <td>${escapeHtml(seq.objectives || '')}</td>
      <td>${escapeHtml(seq.learningOutcomes || '')}</td>
      <td>${escapeHtml(seq.prerequisites || '')}</td>
      <td>${escapeHtml(seq.keywords || '')}</td>
      <td>${escapeHtml(seq.differentiation || '')}</td>
      <td>${escapeHtml(seq.assessment || '')}</td>
      <td>${escapeHtml(seq.deliverables || '')}</td>
      <td>${escapeHtml(seq.notes || '')}</td>
      <td>${sessionTitles}</td>
    </tr>`;
  }).join('') : '<tr><td colspan="16"></td></tr>';
  const capacities = ueCapacities(ue).map(c => `${c.code} — ${c.title}`).join(' ; ');
  const html = `<!doctype html><html lang="fr"><head><meta charset="utf-8"><title>${escapeHtml(ue.code)} ${escapeHtml(ue.title)}</title><style>
    @page{size:A3 landscape;margin:8mm;}body{font-family:Arial,sans-serif;margin:18px;color:#111827;font-size:9.5px} h1{font-size:18px;margin:0 0 4px} .meta{color:#4b5563;margin:2px 0 10px} table{border-collapse:collapse;width:100%;table-layout:fixed;margin-top:10px} th,td{border:1px solid #444;padding:4px;vertical-align:top;word-wrap:break-word} th{background:#f3f4f6} small,.muted{color:#4b5563} .cap{border:1px solid #d1d5db;background:#f9fafb;padding:6px;margin-top:8px} @media print{body{margin:0} button{display:none}}
  </style></head><body><button onclick="window.print()">Imprimer / enregistrer en PDF</button><h1>Progression UE — ${escapeHtml(ue.code)} ${escapeHtml(ue.title)}</h1><p class="meta">${escapeHtml(ue.promotion)} · ${escapeHtml(ue.semester)} · ${escapeHtml(ue.period || '')} · ${escapeHtml(ue.startWeekId ? `de ${weekLabel(ue.startWeekId)}` : '')} ${escapeHtml(ue.endWeekId ? `à ${weekLabel(ue.endWeekId)}` : '')}</p><div class="cap"><strong>Capacités de l’UE :</strong> ${escapeHtml(capacities || '')}</div><table><thead><tr><th>Titre de séquence</th><th>Période envisagée</th><th>Semaines</th><th>Volume horaire estimatif</th><th>Enseignant(s) impliqué(s)</th><th>Capacités cochées</th><th>Objectifs de la séquence</th><th>Apprentissages à réaliser / savoir-faire visés</th><th>Prérequis</th><th>Mots-clés / notions structurantes</th><th>Point de vigilance</th><th>Évaluation prévue</th><th>Production attendue / traces élèves</th><th>Notes internes</th><th>Séances rattachées</th></tr></thead><tbody>${rows}</tbody></table></body></html>`;
  const win = window.open('', '_blank');
  win.document.write(html);
  win.document.close();
  win.focus();
}

function exportSequencePrint(seq) {
  if (!seq) return;
  const ue = findUe(seq.ueId) || {};
  // Séquence déjà dans mon périmètre : l'export imprime toutes ses séances.
  const sessions = state.sessions.filter(s => s.sequenceId === seq.id).sort((a, b) => sessionSortKey(a).localeCompare(sessionSortKey(b)));
  const rows = sessions.length ? sessions.map((s, i) => `<tr>
    <td>${i + 1}</td>
    <td>${escapeHtml(s.title || '')}</td>
    <td>${escapeHtml(s.type || '')}</td>
    <td>${escapeHtml(s.group || '')}</td>
    <td>${escapeHtml(s.teacher || '')}</td>
    <td>${escapeHtml(s.room || '')}</td>
    <td>${escapeHtml([s.expectedDuration || '', s.customStart && s.customEnd ? `${s.customStart}–${s.customEnd}` : ''].filter(Boolean).join(' · '))}</td>
    <td>${escapeHtml((s.capacityCodes || []).join(', '))}</td>
    <td>${escapeHtml(s.objectives || '')}</td>
    <td>${escapeHtml(s.notions || '')}</td>
    <td>${escapeHtml(s.activities || '')}</td>
    <td>${escapeHtml(s.materials || '')}</td>
    <td>${escapeHtml(s.differentiation || '')}</td>
    <td>${escapeHtml(s.keywords || '')}</td>
    <td>${escapeHtml(s.notes || '')}</td>
  </tr>`).join('') : '<tr><td colspan="16"></td></tr>';
  const html = `<!doctype html><html lang="fr"><head><meta charset="utf-8"><title>${escapeHtml(seq.title)}</title><style>
    @page{size:A3 landscape;margin:9mm;}body{font-family:Arial, sans-serif;margin:20px;color:#111827;font-size:10px} h1{font-size:20px;margin:0 0 4px} h2{font-size:14px;margin:14px 0 6px;border-bottom:1px solid #333;padding-bottom:3px} .meta{color:#4b5563;margin:2px 0} table{border-collapse:collapse;width:100%;table-layout:fixed;margin-top:10px} th,td{border:1px solid #444;padding:5px;vertical-align:top;word-wrap:break-word} th{background:#f3f4f6} small{color:#4b5563} @media print{body{margin:0} button{display:none}}
  </style></head><body><button onclick="window.print()">Imprimer / enregistrer en PDF</button>
    <h1>${escapeHtml(seq.title || '')}</h1>
    <div class="meta"><strong>${escapeHtml(ue.code || '')} ${escapeHtml(ue.title || '')}</strong> · ${escapeHtml(seq.promotion || '')} · ${escapeHtml(seq.semester || '')}</div>
    <div class="meta">Période envisagée : ${escapeHtml(seq.periodNote || seq.targetWeeks || '')} · Semaines : ${escapeHtml(seq.targetWeeks || '')} · Volume horaire estimatif : ${escapeHtml(seq.hoursEstimate || '')} · Enseignant(s) impliqué(s) : ${escapeHtml(seq.teacher || '')}</div>
    <div class="meta">Capacités cochées : ${escapeHtml((seq.capacityCodes || []).join(', '))}</div>
    <h2>Champs de séquence</h2>
    <p><strong>Objectifs de la séquence :</strong> ${escapeHtml(seq.objectives || '')}</p>
    <p><strong>Apprentissages à réaliser / savoir-faire visés :</strong> ${escapeHtml(seq.learningOutcomes || '')}</p>
    <p><strong>Prérequis :</strong> ${escapeHtml(seq.prerequisites || '')}</p>
    <p><strong>Mots-clés / notions structurantes :</strong> ${escapeHtml(seq.keywords || '')}</p>
    <p><strong>Point de vigilance :</strong> ${escapeHtml(seq.differentiation || '')}</p>
    <p><strong>Évaluation prévue :</strong> ${escapeHtml(seq.assessment || '')}</p>
    <p><strong>Production attendue / traces élèves :</strong> ${escapeHtml(seq.deliverables || '')}</p>
    <p><strong>Notes internes :</strong> ${escapeHtml(seq.notes || '')}</p>
    <h2>Séances</h2><table><thead><tr><th>N°</th><th>Titre de séance</th><th>Type</th><th>Groupe</th><th>Enseignant(s)</th><th>Salle / lieu</th><th>Durée prévue</th><th>Capacités cochées</th><th>Objectifs de séance</th><th>Notions abordées</th><th>Déroulé</th><th>Besoins matériels</th><th>Points de vigilance</th><th>Mots-clefs</th><th>Notes internes</th></tr></thead><tbody>${rows}</tbody></table>
  </body></html>`;
  const win = window.open('', '_blank');
  win.document.write(html);
  win.document.close();
  win.focus();
}




/* « Exporter la frise » : ouvre les deux bandes telles qu'affichées à l'écran
   (une UE, ou tout le semestre en mode « Empiler ») dans une fenêtre A3
   paysage — plus simple et plus fidèle que reconstruire un rendu séparé. */
function exportGanttPrint() {
  const seqEl = $('#ganttSequencesPanel');
  const sessEl = $('#ganttSessionsPanel');
  if (!seqEl || !sessEl) return;
  const css = [...document.styleSheets].map(sheet => { try { return [...sheet.cssRules].map(rule => rule.cssText).join('\n'); } catch (e) { return ''; } }).join('\n');
  const win = window.open('', '_blank');
  win.document.write(`<!doctype html><html lang="fr"><head><meta charset="utf-8"><title>Frise — ${escapeHtml(ganttPromo)} ${escapeHtml(ganttSemester)}</title><style>${css} @page{size:A3 landscape;margin:8mm;} body{background:#fff;padding:16px;} .timeline-scroll{overflow:visible!important;}</style></head><body><h1>${escapeHtml(ganttPromo)} · ${escapeHtml(ganttSemester)}</h1>${seqEl.outerHTML}${sessEl.outerHTML}<script>setTimeout(()=>window.print(),500)<\/script></body></html>`);
  win.document.close();
  win.focus();
}

function printWeekPlanning() {
  const week = state.weeks.find(w => w.id === selectedWeek);
  const html = $('#planningContainer')?.innerHTML || '';
  const css = [...document.styleSheets].map(sheet => { try { return [...sheet.cssRules].map(rule => rule.cssText).join('\n'); } catch (e) { return ''; } }).join('\n');
  const win = window.open('', '_blank');
  win.document.write(`<!doctype html><html lang="fr"><head><meta charset="utf-8"><title>Planning ${escapeHtml(week?.label || '')}</title><style>${css} @page{size:A3 landscape;margin:8mm;}body{background:#fff;padding:0}.topbar,.tabs,.no-print,.page-title,.filters-panel,.backlog-panel,.notes-panel,.week-calendar-panel{display:none!important}.schedule-section{break-inside:avoid;box-shadow:none!important;border:1px solid #111!important}.table-scroll{overflow:visible!important}.schedule-table th,.schedule-table td{height:auto!important;min-width:0!important;font-size:8px!important}.event-cell{padding:3px!important}.event-keywords{font-size:7px!important}.break-cell{height:7px!important;padding:0!important}</style></head><body><h1>Planning hebdomadaire — ${escapeHtml(week?.label || '')} ${escapeHtml(week?.dateRange || '')}</h1>${html}<script>setTimeout(()=>window.print(),500)<\/script></body></html>`);
  win.document.close();
  win.focus();
}

function renderReference() {
  renderReferenceModule();
}

/* ============================================================
   Référentiel — consultation interactive par module (M4, M5)
   Accordéon imbriqué : Général + Précisions par capacités.
   Données : window.REFERENCE_MODULES (reference-modules.js).
   ============================================================ */
function referenceModules() { return window.REFERENCE_MODULES || []; }
function refModuleById(id) { return referenceModules().find(m => m.id === id) || referenceModules()[0]; }

function refHtmlList(items) { return `<ul>${(items || []).map(x => `<li>${x}</li>`).join('')}</ul>`; }

function refDetails(cls, title, body, open) {
  return `<details class="${cls}"${open ? ' open' : ''}><summary>${title}</summary>${body}</details>`;
}

function refFirstParagraph(html) {
  const m = String(html || '').match(/<p>[\s\S]*?<\/p>/);
  return m ? m[0] : html;
}

/* Sections générales (préambule, rappel, finalités, activités) — html = contenu riche, non échappé. */
function refGeneralSection(s, module) {
  return refDetails('rm-part', escapeHtml(s.title), `<div class="rm-panel rm-card">${s.html}</div>`);
}

function refEvalTable(c) {
  return `<div class="rm-tablewrap"><table class="rm-eval">
    <thead><tr><th>Capacité évaluée</th><th>Critères d’évaluation</th><th>Savoirs mobilisés</th><th>Disciplines</th></tr></thead>
    <tbody><tr>
      <td><strong>${escapeHtml(c.code)}</strong><br>${escapeHtml(c.title)}</td>
      <td>${refHtmlList((c.criteres || []).map(escapeHtml))}</td>
      <td>${refHtmlList((c.savoirs || []).map(escapeHtml))}</td>
      <td>${refHtmlList((c.disciplines || []).map(escapeHtml))}</td>
    </tr></tbody>
  </table></div>`;
}

function refDeclinaison(c) {
  const intro = c.intro || '';
  const conditions = c.conditionsHtml
    ? c.conditionsHtml
    : refHtmlList((c.conditions || []).map(escapeHtml));
  // Aplati : tableau d'éval + conditions + précisions directement sous la capacité (plus de <details> intermédiaire)
  return `
    <div class="rm-panel rm-declinaison">
      <div class="rm-blocktitle">Tableau d’évaluation</div>
      ${refEvalTable(c)}
      <div class="rm-conditions"><h4>Conditions d’atteinte de la capacité</h4>${conditions}</div>
      <div class="rm-precision"><h4>Précisions sur les attendus de la formation</h4>${intro}</div>
    </div>`;
}

/* 18/08 — retour Martin : « la navigation dans les sous blocs encadrés et
   sous-parties avec des encarts repliés dépliables n'est pas du tout pratique
   […] un sommaire plus exhaustif dans la barre latérale […] sans sous-partie
   repliée ». Les ids ci-dessous sont la clé commune entre le sommaire
   (renderRefToc, qui pointe dessus en <a href="#…">) et le contenu (ici, qui
   les porte) : plus de <details> imbriqués, tout est affiché, on saute d'une
   sous-partie à l'autre par ancre plutôt que par un clic-pour-déplier. */
function refBlocAnchorId(moduleId, capId, blocIdx) { return `refblock-${moduleId}-${capId}-${blocIdx}`; }
function refLeafAnchorId(moduleId, capId, blocIdx, leafIdx) { return `refleaf-${moduleId}-${capId}-${blocIdx}-${leafIdx}`; }

function refBlocs(module, c) {
  const blocks = (module.blocks && module.blocks[c.id]) || [];
  if (!blocks.length) return ''; // Modules 1-3 : pas de blocs encadrés → pas de section vide
  const body = blocks.map((b, bIdx) => {
    const leaves = (b.items || []).map((i, lIdx) => {
      const sub = c.subsections[i];
      if (!sub) return '';
      return `<div class="rm-leaf" id="${refLeafAnchorId(module.id, c.id, bIdx, lIdx)}">
        <div class="rm-leaf-title">${escapeHtml(sub.title)}</div>
        <div class="rm-leafpanel">${sub.html}</div>
      </div>`;
    }).join('');
    const intro = b.intro ? `<div class="rm-card rm-compact">${b.intro}</div>` : '';
    return `<div class="rm-sub" id="${refBlocAnchorId(module.id, c.id, bIdx)}">
      <div class="rm-sub-title">${escapeHtml(b.title)}</div>
      <div class="rm-subpanel">${intro}${leaves}</div>
    </div>`;
  }).join('');
  return `<div class="rm-part">
    <div class="rm-part-title">Blocs encadrés et sous-parties</div>
    <div class="rm-panel">${body}</div>
  </div>`;
}

/* Annexe officielle : item de même niveau que les capacités (html = contenu riche, non échappé). */
function refAnnexe(a) {
  return refDetails('rm-cap rm-annexe', `<span class="rm-annexe-tag">Annexe</span> · ${escapeHtml(a.title.replace(/^Annexe\s*\d*\s*[·:]?\s*/i, ''))}`,
    `<div class="rm-cappanel"><div class="rm-panel rm-card">${a.html}</div></div>`);
}

/* Un seul encart dépliable pour toute la bibliographie/sitographie d'un module
   (avant : un sous-encart par catégorie, à déplier une à une). Les catégories
   restent visuellement séparées par un intitulé, sans être repliables. */
function refReferences(module) {
  const hasBib = (module.biblio || []).length;
  const hasSito = (module.sitographie || []).length;
  if (!hasBib && !hasSito) return ''; // M6 : références citées au fil des sous-parties
  const refCat = (name, gridHtml) => `<div class="rm-refcat"><h5 class="rm-refcat-title">${escapeHtml(name)}</h5><div class="rm-refgrid">${gridHtml}</div></div>`;
  const bib = (module.biblio || []).map(cat => refCat(cat.name,
    cat.items.map(it => `<div class="rm-refentry">${escapeHtml(it)}</div>`).join(''))).join('');
  const links = (module.sitographie || []).map(cat => refCat(cat.name,
    cat.links.map(([label, url]) => `<div class="rm-refentry rm-linkentry"><span class="rm-reflabel">${escapeHtml(label)}</span><a href="${escapeAttr(url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(url)}</a></div>`).join(''))).join('');
  const inner = `${hasBib ? `<div class="rm-blocktitle">Ouvrages, revues et ressources imprimées</div>${bib}` : ''}${hasSito ? `<div class="rm-blocktitle" style="margin-top:16px">Sitographie et banques de données</div>${links}` : ''}`;
  return refDetails('rm-part', 'Références documentaires ou bibliographiques', `<div class="rm-panel">${inner}</div>`);
}

/* Version hybride (16/08/2026, retour de Martin sur le 1er essai « lecteur à 3
   colonnes ») : la barre latérale gauche garde son rôle de navigation rapide,
   mais reste PLATE (Général + une ligne par capacité du module actif, pas de
   blocs imbriqués les uns dans les autres) ; le contenu central redevient
   exactement celui d'avant — mêmes fonctions (refDeclinaison/refBlocs/
   refGeneralSection/refReferences), juste affiché un élément à la fois au lieu
   d'un accordéon à tout déplier soi-même. */
let refReadSection = ''; // '' = pas encore choisi ; 'general' ; id de capacité ; id/titre d'annexe

function refModuleSections(module) {
  const items = [{ kind: 'general', id: 'general', label: 'Général' }];
  (module.capacites || []).forEach(c => items.push({ kind: 'cap', id: c.id, code: c.code, label: c.title, cap: c }));
  (module.annexes || []).forEach(a => items.push({ kind: 'annexe', id: a.id || a.title, label: a.title.replace(/^Annexe\s*\d*\s*[·:]?\s*/i, ''), annexe: a }));
  return items;
}

function renderRefToc() {
  const toc = $('#refreadToc');
  if (!toc) return;
  const module = refModuleById(selectedReferenceModule);
  if (!module) { toc.innerHTML = ''; return; }
  const items = refModuleSections(module);
  if (!items.some(i => i.id === refReadSection)) refReadSection = (items[1] || items[0]).id;
  // 18/08 — « sommaire plus exhaustif […] sauter d'une sous-partie à l'autre » :
  // sous la capacité affichée, on liste aussi ses blocs/sous-parties (mêmes ids
  // que refBlocs) comme entrées de sommaire indentées — pas un second niveau
  // replié, juste des ancres dans le même sommaire plat.
  const rows = items.map(i => {
    const row = `<li><button type="button" class="refread-toc-item refread-toc-${i.kind}${i.id === refReadSection ? ' active' : ''}" data-refread-section="${escapeAttr(i.id)}">${i.kind === 'cap' ? `<span class="refread-toc-code">${escapeHtml(i.code)}</span>` : ''}<span>${escapeHtml(i.kind === 'cap' ? truncate(i.label, 40) : i.label)}</span></button></li>`;
    if (i.kind !== 'cap' || i.id !== refReadSection) return row;
    const blocks = (module.blocks && module.blocks[i.id]) || [];
    if (!blocks.length) return row;
    const subRows = blocks.map((b, bIdx) => {
      const blocRow = `<li><button type="button" class="refread-toc-item refread-toc-subpart" data-refread-jump="${refBlocAnchorId(module.id, i.id, bIdx)}"><span>${escapeHtml(truncate(b.title, 42))}</span></button></li>`;
      const leafRows = (b.items || []).map((leafKey, lIdx) => {
        const sub = i.cap.subsections[leafKey];
        if (!sub) return '';
        return `<li><button type="button" class="refread-toc-item refread-toc-leaf" data-refread-jump="${refLeafAnchorId(module.id, i.id, bIdx, lIdx)}"><span>${escapeHtml(truncate(sub.title, 42))}</span></button></li>`;
      }).join('');
      return blocRow + leafRows;
    }).join('');
    return row + subRows;
  }).join('');
  toc.innerHTML = `<div class="refread-toc-head">${escapeHtml(module.code)} · ${escapeHtml(truncate(module.title, 30))}</div>
    <ul class="refread-toc-list">${rows}</ul>`;
}

function renderRefBody() {
  const body = $('#refreadBody');
  if (!body) return;
  const module = refModuleById(selectedReferenceModule);
  if (!module) { body.innerHTML = '<p class="meta">Aucun module chargé. Vérifier reference-modules.js.</p>'; return; }
  const items = refModuleSections(module);
  const current = items.find(i => i.id === refReadSection) || items[0];
  if (current.kind === 'general') {
    const pdfLine = module.pdf ? ` <a class="rm-pdf" href="docs/${escapeAttr(module.pdf)}" target="_blank" rel="noopener">PDF source du module</a>` : '';
    body.innerHTML = `<div class="rm-head">
        <div class="rm-kicker">${escapeHtml(module.code)} · ${escapeHtml(module.bloc)}</div>
        <h3 class="rm-title">${escapeHtml(module.title)}</h3>
        <p class="rm-source">Source officielle : ${escapeHtml(module.source)}.${pdfLine}</p>
      </div>` + (module.general || []).map(s => refGeneralSection(s, module)).join('') + refReferences(module);
  } else if (current.kind === 'cap') {
    body.innerHTML = `<div class="refread-cap-head"><span class="refread-cap-code">${escapeHtml(current.cap.code)}</span><h3>${escapeHtml(current.cap.title)}</h3></div>`
      + refDeclinaison(current.cap) + refBlocs(module, current.cap);
  } else {
    body.innerHTML = `<div class="rm-panel rm-card">${current.annexe.html}</div>`;
  }
  renderRefChezVous(current.kind === 'cap' ? current.cap : null);
  const q = ($('#rubanUnifiedSearch')?.value || '').trim();
  if (q) refmodSearch(q);
}

/* « Chez vous » (repris tel quel de la 1re tentative — Martin ne l'a pas
   critiqué) : qui porte/évalue la capacité affichée (Répartition réelle) +
   les séquences réelles qui la travaillent. Vide hors capacité (Général/annexe). */
function refChezVous(code) {
  const porte = new Set(), evalue = new Set(), disciplines = new Set();
  (rubanData()?.semestres || []).forEach(s => s.ues.forEach(u => {
    rubanUeCapacities(u).forEach(c => {
      if (c.code !== code) return;
      (c.enseignants || []).forEach(t => porte.add(t));
      (c.evaluateurs || []).forEach(t => evalue.add(t));
      (c.disciplines || []).forEach(d => disciplines.add(d));
    });
  }));
  const sequences = (state.sequences || [])
    .filter(seq => (seq.capacityCodes || []).includes(code))
    .map(seq => ({ seq, ue: findUe(seq.ueId) }));
  return { porte: [...porte], evalue: [...evalue], disciplines: [...disciplines], sequences };
}

function renderRefChezVous(cap) {
  const el = $('#refreadChezVous');
  if (!el) return;
  if (!cap) { el.innerHTML = '<p class="meta">Sélectionnez une capacité pour voir qui la porte, qui l’évalue et où elle est travaillée.</p>'; return; }
  const data = refChezVous(cap.code);
  const pills = vals => vals.length
    ? `<div class="repartition-pills">${vals.map(t => `<span class="design-ue-pill${t.toLowerCase() === moiInitiales.toLowerCase() ? ' is-mine' : ''}">${escapeHtml(t)}</span>`).join('')}</div>`
    : '<span class="ruban-vide" title="Non renseigné — à saisir avec ✎ dans l’onglet Ruban">—</span>';
  const seqList = data.sequences.length
    ? data.sequences.map(({ seq, ue }) => `<button type="button" class="refread-seq-item" style="--seq-color:${escapeAttr(sequenceColor(seq.id))}" data-edit-sequence="${escapeAttr(seq.id)}" title="Ouvrir cette séquence dans la Conception pédagogique">
        <strong>${escapeHtml(seq.title)}</strong>
        <span class="meta">${escapeHtml(ue?.code || 'UE ?')} · ${escapeHtml(sequencePeriodParts(seq).label)} · ${escapeHtml(seq.teacher || '—')}</span>
      </button>`).join('')
    : '<p class="meta">Aucune séquence réelle rattachée pour l’instant.</p>';
  el.innerHTML = `
    <h4>Chez vous <span class="meta">pour ${escapeHtml(cap.code)}</span></h4>
    <div class="refread-cv-block"><span class="refread-cv-label">Qui la porte</span>${pills(data.porte)}</div>
    <div class="refread-cv-block"><span class="refread-cv-label">Qui l’évalue</span>${pills(data.evalue)}</div>
    <div class="refread-cv-block"><span class="refread-cv-label">Disciplines</span><p class="refread-cv-disc">${data.disciplines.length ? data.disciplines.map(escapeHtml).join(' · ') : '—'}</p></div>
    <div class="refread-cv-block"><span class="refread-cv-label">Où elle est travaillée <span class="refread-cv-count">${data.sequences.length} séquence${data.sequences.length > 1 ? 's' : ''}</span></span>${seqList}</div>
  `;
}

function renderReferenceModule() {
  $$('[data-ref-module]').forEach(b => {
    const isActive = b.dataset.refModule === selectedReferenceModule;
    b.classList.toggle('active', isActive);
    b.setAttribute('aria-pressed', String(isActive));
  });
  renderRefToc();
  renderRefBody();
}

/* -- Recherche / surlignage dans le contenu affiché -- */
function refmodClearMarks() {
  const content = $('#refreadBody');
  if (!content) return;
  content.querySelectorAll('mark.rm-mark').forEach(mark => {
    const text = document.createTextNode(mark.textContent);
    mark.replaceWith(text);
    text.parentNode && text.parentNode.normalize();
  });
}

function refmodHighlight(query) {
  const content = $('#refreadBody');
  if (!content) return 0;
  const q = query.toLowerCase();
  let count = 0;
  function walk(n) {
    if (n.nodeType === Node.TEXT_NODE) {
      const value = n.nodeValue;
      const lower = value.toLowerCase();
      let pos = lower.indexOf(q);
      if (pos >= 0) {
        const frag = document.createDocumentFragment();
        let last = 0;
        while (pos >= 0) {
          frag.appendChild(document.createTextNode(value.slice(last, pos)));
          const mark = document.createElement('mark');
          mark.className = 'rm-mark';
          mark.textContent = value.slice(pos, pos + query.length);
          frag.appendChild(mark);
          count += 1;
          last = pos + query.length;
          pos = lower.indexOf(q, last);
        }
        frag.appendChild(document.createTextNode(value.slice(last)));
        n.replaceWith(frag);
      }
    } else if (n.nodeType === Node.ELEMENT_NODE && !['SCRIPT', 'STYLE', 'MARK'].includes(n.tagName)) {
      Array.from(n.childNodes).forEach(walk);
    }
  }
  walk(content);
  return count;
}

function refmodSearch(query) {
  const content = $('#refreadBody');
  if (!content) return;
  refmodClearMarks();
  const q = String(query || '').trim();
  const countEl = $('#refmodCount');
  if (!q) { if (countEl) countEl.textContent = ''; return; }
  content.querySelectorAll('details').forEach(d => {
    const sum = d.querySelector(':scope > summary');
    const bodyText = Array.from(d.childNodes).filter(n => n !== sum).map(n => n.textContent || '').join(' ');
    if (bodyText.toLowerCase().includes(q.toLowerCase())) d.open = true;
  });
  const marks = refmodHighlight(q);
  if (countEl) countEl.textContent = marks ? `${marks} occurrence${marks > 1 ? 's' : ''}` : 'Aucun résultat';
}

function refmodExpandAll() { $('#refreadBody')?.querySelectorAll('details').forEach(d => { d.open = true; }); }
function refmodCollapseAll() { $('#refreadBody')?.querySelectorAll('details').forEach(d => { d.open = false; }); }

/* Depuis une pastille de capacité (conception pédagogique, Ruban…), ouvrir le
   référentiel sur cette capacité précise. Aucun renvoi inverse
   (référentiel -> séances) : navigation à sens unique. */
function openReferenceModuleForCapacity(code) {
  const clean = String(code || '').replace(/\s/g, '');
  const module = referenceModules().find(m => (m.capacites || []).some(c => clean.startsWith(c.code)));
  if (!module) return;
  const cap = (module.capacites || []).find(c => clean.startsWith(c.code));
  if (!cap) return;
  // Bascule sur l'onglet fusionné « Référentiel & Ruban », mode Référentiel.
  $$('.tab').forEach(t => t.classList.toggle('active', t.dataset.view === 'ruban'));
  $$('.view').forEach(v => v.classList.toggle('active-view', v.id === 'ruban'));
  selectedReferenceModule = module.id;
  refReadSection = cap.id;
  setRubanTab('reference');
  requestAnimationFrame(() => $('#refreadBody')?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
}

/* ================= Ruban pédagogique ================= */
function rubanData() { return window.RUBAN_PEDAGOGIQUE || null; }
function rubanCapHasReferentiel(code) { return /^C[4-8]\./.test(String(code || '')); }

// Affectations effectives = données du PDF, écrasées par les modifications enregistrées (state.rubanOverrides).
function rubanOverride(code) { return (state && state.rubanOverrides && state.rubanOverrides[code]) || null; }
function rubanCapEffective(c) {
  const o = rubanOverride(c.code);
  return {
    ...c,
    enseignants: o && Array.isArray(o.enseignants) ? o.enseignants : (c.enseignants || []),
    evaluateurs: o && Array.isArray(o.evaluateurs) ? o.evaluateurs : (c.evaluateurs || [])
  };
}

/* F1 — composition éditable des UE. Une UE dont la composition a été modifiée
   est stockée intégralement dans state.rubanUeCaps[ueCode] (liste de capacités
   {code,title,disciplines,enseignants,evaluateurs}) ; sinon on part du statique
   (RUBAN_PEDAGOGIQUE) fusionné avec les anciens overrides par capacité. */
function findRubanUe(ueCode) {
  let found = null;
  (rubanData()?.semestres || []).forEach(s => s.ues.forEach(u => { if (u.code === ueCode) found = u; }));
  return found;
}
function normalizeCap(c) {
  return {
    code: c.code || '', title: c.title || '',
    disciplines: Array.isArray(c.disciplines) ? [...c.disciplines] : [],
    enseignants: Array.isArray(c.enseignants) ? [...c.enseignants] : [],
    evaluateurs: Array.isArray(c.evaluateurs) ? [...c.evaluateurs] : []
  };
}
function rubanStaticUeCaps(ueCode) {
  const u = findRubanUe(ueCode);
  return (u?.capacites || []).map(c => normalizeCap(rubanCapEffective(c)));
}
/* Liste effective des capacités d'une UE (override complet prioritaire). */
function rubanUeCapacities(u) {
  const ov = state?.rubanUeCaps?.[u.code];
  if (Array.isArray(ov)) return ov.map(normalizeCap);
  return (u.capacites || []).map(c => normalizeCap(rubanCapEffective(c)));
}
function isUeModified(u) {
  if (state?.rubanUeCaps?.[u.code]) return true;
  return (u.capacites || []).some(c => rubanOverride(c.code));
}
/* Si l'override d'une UE redevient identique au statique, on le supprime. */
function cleanupUeOverride(ueCode) {
  const cur = state.rubanUeCaps?.[ueCode];
  if (!cur) return;
  if (JSON.stringify(cur.map(normalizeCap)) === JSON.stringify(rubanStaticUeCaps(ueCode))) delete state.rubanUeCaps[ueCode];
}

function rubanAllTeachers() {
  const set = new Set();
  (rubanData()?.semestres || []).forEach(s => s.ues.forEach(u => rubanUeCapacities(u).forEach(c => {
    c.enseignants.forEach(t => set.add(t));
    c.evaluateurs.forEach(t => set.add(t));
  })));
  return [...set].filter(Boolean).sort((a, b) => a.localeCompare(b, 'fr'));
}

function renderRuban() {
  const data = rubanData();
  if (!data || !$('#rubanGrid')) return;

  const sel = $('#rubanTeacherFilter');
  if (sel) {
    const teachers = rubanAllTeachers();
    sel.innerHTML = '<option value="Tous">Tous les enseignants</option>'
      + teachers.map(t => `<option value="${escapeAttr(t)}">${escapeHtml(t)}</option>`).join('');
    sel.value = teachers.includes(rubanTeacher) || rubanTeacher === 'Tous' ? rubanTeacher : 'Tous';
    rubanTeacher = sel.value;
  }

  const q = ($('#rubanUnifiedSearch')?.value || '').trim().toLowerCase();
  const teacher = rubanTeacher;
  const matchCap = (c, u, s) => {
    const inTeacher = teacher === 'Tous' || c.enseignants.includes(teacher) || c.evaluateurs.includes(teacher);
    const hay = [c.code, c.title, u.code, u.title, s.label, ...(c.disciplines || []), ...c.enseignants, ...c.evaluateurs].join(' ').toLowerCase();
    return inTeacher && (!q || hay.includes(q));
  };

  let shown = 0;
  $('#rubanGrid').innerHTML = data.semestres.map(s => {
    const uesHtml = s.ues.map(u => {
      const caps = rubanUeCapacities(u);
      const anyMatch = caps.some(c => matchCap(c, u, s));
      const capHtml = caps.map(c => {
        const on = matchCap(c, u, s);
        if (on) shown += 1;
        const hasRef = rubanCapHasReferentiel(c.code);
        const inner = `<span class="ruban-cap-code">${escapeHtml(c.code)}</span><span class="ruban-cap-title">${escapeHtml(c.title)}</span>`;
        // Capacités présentes dans le référentiel (M1–M8) : cliquables (ouvrent le référentiel). Autres : affichage simple.
        return hasRef
          ? `<button type="button" class="ruban-cap has-ref${on ? '' : ' is-dim'}" data-ruban-cap="${escapeAttr(c.code)}" title="Ouvrir « ${escapeAttr(c.title)} » dans le référentiel">${inner}</button>`
          : `<span class="ruban-cap is-static${on ? '' : ' is-dim'}" title="${escapeAttr(c.title)}">${inner}</span>`;
      }).join('') || '<p class="ruban-cap-empty meta">Aucune capacité — cliquer ✎ pour en ajouter.</p>';
      const editBtn = `<button type="button" class="ruban-ue-edit" data-edit-ue="${escapeAttr(u.code)}" title="Modifier les capacités de ${escapeAttr(u.code)}">✎</button>`;
      // Couleur de semestre (REGLES.md #14, JETONS.md) : S1 bleu, S2 ambre, S3 rouge, S4 vert —
      // fixe, n'a rien à voir avec la promo/période (voir le CSS .ruban-ue.sem-s1..s4).
      return `<article class="ruban-ue sem-${escapeAttr(s.id)}${anyMatch || !caps.length ? '' : ' is-dim'}${isUeModified(u) ? ' is-modified' : ''}">`
        + `<header class="ruban-ue-head"><span class="ruban-ue-code">${escapeHtml(u.code)}</span><strong>${escapeHtml(u.title)}</strong>${editBtn}</header>`
        + (u.resume ? `<p class="ruban-ue-resume">${escapeHtml(u.resume)}</p>` : '')
        + `<div class="ruban-cap-list">${capHtml}</div></article>`;
    }).join('');
    // 07-ruban.png — le bandeau de semestre porte aussi la promo associée (mono, en retrait).
    return `<section class="ruban-col sem-${escapeAttr(s.id)}"><header class="ruban-col-head"><span>${escapeHtml(s.label)}</span><span class="ruban-col-promo">${escapeHtml(promoOfSemester(s.label))}</span></header>${uesHtml}</section>`;
  }).join('');

  renderRubanTable(matchCap);

  // Lot F [5] — « correspondante(s) » redisait ce que la barre montre déjà (le
  // filtre est à 30 px de là) et poussait la case de recherche à la ligne.
  const countEl = $('#rubanCount');
  if (countEl) countEl.textContent = (q || teacher !== 'Tous')
    ? `${shown} capacité${shown > 1 ? 's' : ''}`
    : '';
}

/* Retrouve la vraie UE (state.ues, séquences réelles) derrière un code du ruban
   (« UE1.1 », sans espace) — les deux jeux de données ne partagent pas le même
   format de code. Sert au compte de séquences et à l'estompage « mes UE ». */
function rubanRealUe(u) {
  const flat = String(u.code || '').replace(/\s/g, '');
  return (state?.ues || []).find(real => String(real.code || '').replace(/\s/g, '') === flat);
}
function rubanUeIsMine(u) {
  return rubanUeCapacities(u).some(c => (c.enseignants || []).concat(c.evaluateurs || []).some(t => t.toLowerCase() === moiInitiales.toLowerCase()));
}

/* 06-referentiel-repartition.png — une ligne par capacité, groupée par semestre
   puis par UE (code+titre en rowspan, comme la maquette) : « Le Tableau détaillé
   AFFICHE, il ne modifie plus » (raison inchangée, voir plus bas). */
function renderRubanTable(matchCap) {
  const data = rubanData();
  const target = $('#rubanTable');
  if (!data || !target) return;
  const mineOnly = $('#repartitionMineToggle')?.checked;

  const pillsCell = vals => vals.length
    ? `<div class="repartition-pills">${vals.map(t => `<span class="design-ue-pill${t.toLowerCase() === moiInitiales.toLowerCase() ? ' is-mine' : ''}">${escapeHtml(t)}</span>`).join('')}</div>`
    : '<span class="ruban-vide" title="Non renseigné — à saisir avec ✎ dans l’onglet Ruban">—</span>';

  const semBlocks = data.semestres.map(s => {
    const period = TEMPLATE_PERIODS.find(p => p.key === periodOfSemester(s.label))?.label || '';
    const ueBlocks = s.ues.map(u => {
      const caps = rubanUeCapacities(u).filter(c => matchCap(c, u, s));
      if (!caps.length) return '';
      const dimmed = mineOnly && !rubanUeIsMine(u);
      const realUe = rubanRealUe(u);
      const seqCount = realUe ? (state.sequences || []).filter(seq => seq.ueId === realUe.id).length : 0;
      const ueCellBase = `<span class="ruban-ue-code">${escapeHtml(u.code)}</span> <strong>${escapeHtml(u.title)}</strong>`
        + `<span class="repartition-seq-count">${seqCount} séq.</span>`;
      return caps.map((c, i) => {
        const hasRef = rubanCapHasReferentiel(c.code);
        const capTitleCell = hasRef
          ? `<button type="button" class="ruban-cap-link has-ref" data-ruban-cap="${escapeAttr(c.code)}" title="Ouvrir dans le référentiel">${escapeHtml(c.title)}</button>`
          : `<span class="ruban-cap-plain">${escapeHtml(c.title)}</span>`;
        const ueCell = i === 0 ? `<td class="repartition-td-ue${dimmed ? ' is-dim' : ''}" rowspan="${caps.length}">${ueCellBase}</td>` : '';
        return `<tr class="${dimmed ? 'is-dim' : ''}${isUeModified(u) ? ' is-modified' : ''}">`
          + ueCell
          + `<td class="ruban-td-cap">${escapeHtml(c.code)}</td>`
          + `<td>${capTitleCell}</td>`
          + `<td>${(c.disciplines || []).map(escapeHtml).join(' · ')}</td>`
          + `<td>${pillsCell(c.enseignants)}</td>`
          + `<td>${pillsCell(c.evaluateurs)}</td>`
          + `</tr>`;
      }).join('');
    }).filter(Boolean).join('');
    if (!ueBlocks) return '';
    return `<tr class="repartition-sem-row"><td colspan="6"><span class="repartition-sem-label">${escapeHtml(s.label)} · ${escapeHtml(promoOfSemester(s.label))}</span><span class="repartition-sem-period">${escapeHtml(period)}</span></td></tr>${ueBlocks}`;
  }).join('');

  // Résumé fixe (README : « 11 UE · 25 capacités déclarées · 12 enseignants ») —
  // décrit tout le référentiel, pas le résultat filtré par la recherche.
  const summary = $('#repartitionSummary');
  if (summary) {
    const allUes = new Set(), allTeachers = new Set();
    let allCaps = 0;
    data.semestres.forEach(s => s.ues.forEach(u => { allUes.add(u.code); rubanUeCapacities(u).forEach(c => { allCaps += 1; (c.enseignants || []).concat(c.evaluateurs || []).forEach(t => allTeachers.add(t)); }); }));
    summary.textContent = `${allUes.size} UE · ${allCaps} capacités déclarées · ${allTeachers.size} enseignants`;
  }

  target.innerHTML = semBlocks
    ? `<table class="ruban-table repartition-table"><thead><tr><th>Unité d'enseignement</th><th>Cap.</th><th>Capacité du référentiel</th><th>Disciplines déclarées</th><th>Qui enseigne</th><th>Qui évalue</th></tr></thead><tbody>${semBlocks}</tbody></table>`
      // Le Tableau détaillé AFFICHE, il ne modifie plus : la composition d'une UE
      // (capacités, enseignants, évaluateurs) se saisit au seul endroit ✎ de
      // l'onglet Ruban. Deux voies d'édition pour la même donnée entretenaient la
      // confusion sur l'endroit où l'information vit vraiment.
      + `<p class="ruban-edit-hint meta">Vue d'ensemble. Pour modifier une UE — capacités, <strong>enseignants</strong>, <strong>évaluateurs</strong> — utiliser <strong>✎</strong> sur sa carte dans l'onglet <strong>Ruban</strong>. Les affectations renseignées ici décident des UE ouvertes par défaut dans <strong>Progressions semestres</strong>.</p>`
    : '<p class="meta">Aucune capacité ne correspond aux filtres.</p>';
}

function parseInitials(text) {
  return String(text || '').split(',').map(t => t.trim()).filter(Boolean);
}

/* ---- Modale de composition d'une UE ---- */
function ueCapRowHtml(c = {}) {
  const v = a => Array.isArray(a) ? a.join(', ') : (a || '');
  return `<div class="ue-cap-row">
    <input class="ue-cap-code" data-cap-field="code" value="${escapeAttr(c.code || '')}" placeholder="C4.1" aria-label="Code de la capacité" />
    <input data-cap-field="title" value="${escapeAttr(c.title || '')}" placeholder="Intitulé de la capacité" aria-label="Intitulé" />
    <input data-cap-field="disciplines" value="${escapeAttr(v(c.disciplines))}" placeholder="BE, STAE…" aria-label="Disciplines" />
    <input data-cap-field="enseignants" value="${escapeAttr(v(c.enseignants))}" placeholder="AB, CD…" aria-label="Enseignants" />
    <input data-cap-field="evaluateurs" value="${escapeAttr(v(c.evaluateurs))}" placeholder="AB, CD…" aria-label="Évaluateurs" />
    <button type="button" class="icon-button danger ue-cap-remove" data-remove-cap-row title="Retirer cette capacité">✕</button>
  </div>`;
}
function renderUeCapsRows(caps) {
  const box = $('#ueCapsRows');
  if (box) box.innerHTML = (caps || []).map(ueCapRowHtml).join('');
}
function readUeCapsRows() {
  return $$('#ueCapsRows .ue-cap-row').map(row => {
    const get = f => row.querySelector(`[data-cap-field="${f}"]`)?.value || '';
    return {
      code: get('code').trim(),
      title: get('title').trim(),
      disciplines: parseInitials(get('disciplines')),
      enseignants: parseInitials(get('enseignants')),
      evaluateurs: parseInitials(get('evaluateurs'))
    };
  }).filter(c => c.code || c.title || c.disciplines.length || c.enseignants.length || c.evaluateurs.length);
}
function openUeCapsModal(ueCode) {
  const u = findRubanUe(ueCode);
  if (!u) return;
  $('#ueCapsCode').value = ueCode;
  $('#ueCapsModalTitle').textContent = `Capacités — ${u.code} · ${u.title}`;
  renderUeCapsRows(rubanUeCapacities(u));
  $('#ueCapsDialog').showModal();
}

/* ---------------------------------------------------------------------------
   Créneaux de cours type (onglet Référentiel & Ruban → mode « Créneaux type »).
   2 périodes (sept-déc / janv-mai) × 2 promos = 4 grilles hebdo type (1 par
   semestre). Alimentent le masque du Planning hebdo.
--------------------------------------------------------------------------- */
function renderCreneaux() {
  const container = $('#creneauxGrids');
  if (!container) return;
  refreshCreneauxTeacherFilter();
  $$('[data-creneaux-period]').forEach(b => {
    const isActive = b.dataset.creneauxPeriod === creneauxPeriod;
    b.classList.toggle('active', isActive);
    b.setAttribute('aria-pressed', String(isActive));
  });
  const period = TEMPLATE_PERIODS.find(p => p.key === creneauxPeriod) || TEMPLATE_PERIODS[0];
  container.innerHTML = renderTemplateGrid(period);

  // Retour de Martin (16/08/2026) : plus de compte de créneaux ni de calcul
  // horaire — seule la portée affichée (personnel / tous / un collègue) reste.
  const summaryEl = $('#creneauxSummary');
  if (summaryEl) {
    summaryEl.textContent = creneauxTeacherFilter === 'Tous' ? 'tous les enseignants' : (creneauxTeacherFilter.toLowerCase() === moiInitiales.toLowerCase() ? 'personnel' : creneauxTeacherFilter);
  }
}

/* Une seule grille par période : les créneaux des DEUX promos y cohabitent
   (distinguées par le n° d'UE et la couleur). La promo d'un créneau est portée
   par son semestre de stockage. */
function renderTemplateGrid(period) {
  const slots = (state.weekTemplates || []).filter(t => periodOfSemester(t.semester) === period.key && matchesCreneauxTeacherFilter(t));
  const skip = new Set();
  const rows = SLOTS.map((slotLbl, slotIndex) => {
    if (slotIndex === 4) {
      return `<tr class="tpl-lunch"><td class="time-cell">Repas</td><td class="lunch-cell" colspan="5">Repas</td></tr>`;
    }
    const afterBreak = (slotIndex === 2 || slotIndex === 7) ? ' tpl-after-break' : '';
    const cells = DAYS.map((day, dayIndex) => {
      const key = `${dayIndex}-${slotIndex}`;
      if (skip.has(key)) return '';
      const starting = slots.filter(s => Number(s.day) === dayIndex && Number(s.startSlot) === slotIndex);
      if (starting.length) {
        const cap = slotIndex < 4 ? 3 : 8;
        const segEnd = Math.min(Math.max(...starting.map(s => Number(s.endSlot))), cap);
        const rowspan = Math.max(1, segEnd - slotIndex + 1);
        for (let i = slotIndex + 1; i <= segEnd; i += 1) skip.add(`${dayIndex}-${i}`);
        const left = starting.filter(s => s.col === 'L');
        const right = starting.filter(s => s.col === 'R');
        const full = starting.filter(s => !s.col);
        // Cellule scindée gauche/droite (comme les demi-groupes) : au plus 1×L + 1×R,
        // aucune pleine largeur, au moins une moitié présente.
        const isSplit = full.length === 0 && left.length <= 1 && right.length <= 1 && (left.length + right.length) >= 1;
        if (isSplit) {
          const sibling = left[0] || right[0];
          const halfCol = (t, side) => {
            if (!t) {
              const ctx = JSON.stringify({ period: period.key, day: dayIndex, slot: slotIndex, col: side, endSlot: sibling ? Number(sibling.endSlot) : slotIndex, promo: sibling ? sibling.promotion : '' });
              return `<div class="tpl-col tpl-empty tpl-half-empty" data-create-template='${escapeAttr(ctx)}' title="Ajouter un créneau (${side === 'L' ? 'gauche' : 'droite'})"><span class="drop-hint">+ ½</span></div>`;
            }
            return `<div class="tpl-col" style="--seq-color:${templateSlotTint(t)}" data-edit-template="${escapeAttr(t.id)}" title="Modifier ce créneau">${templateCellInner(t)}</div>`;
          };
          return `<td class="tpl-cell tpl-split-cell" rowspan="${rowspan}"><div class="tpl-split">${halfCol(left[0], 'L')}${halfCol(right[0], 'R')}</div></td>`;
        }
        if (starting.length === 1) {
          const t = starting[0];
          return `<td class="tpl-cell" rowspan="${rowspan}" style="--seq-color:${templateSlotTint(t)}" data-edit-template="${escapeAttr(t.id)}" title="Modifier ce créneau">${templateCellInner(t)}</td>`;
        }
        // Cas résiduel (plusieurs pleines, ou même moitié en double) → empilé.
        return `<td class="tpl-cell tpl-overlap" rowspan="${rowspan}">${starting.map(t => `<div class="tpl-overlap-item" style="--seq-color:${templateSlotTint(t)}" data-edit-template="${escapeAttr(t.id)}" title="Modifier ce créneau"><button type="button" class="tpl-del" data-del-template="${escapeAttr(t.id)}" title="Supprimer" aria-label="Supprimer">×</button>${escapeHtml(templateSlotCode(t) || t.title || '?')}</div>`).join('')}</td>`;
      }
      const ctx = JSON.stringify({ period: period.key, day: dayIndex, slot: slotIndex });
      return `<td class="tpl-empty" data-create-template='${escapeAttr(ctx)}' title="Ajouter un créneau"><span class="drop-hint">+</span></td>`;
    }).join('');
    return `<tr class="${afterBreak}"><td class="time-cell">${slotLbl}</td>${cells}</tr>`;
  }).join('');
  const header = `<tr><th class="tpl-corner">${escapeHtml(period.short)}</th>${DAYS.map(d => `<th>${escapeHtml(d)}</th>`).join('')}</tr>`;
  return `<div class="tpl-grid-wrap">
    <div class="tpl-grid-head"><h3>Semaine type — ${escapeHtml(period.label)}</h3><span class="meta">Les deux promos (GPN1 &amp; GPN2) sur une même grille · distinction par le n° d'UE et la couleur</span></div>
    <table class="tpl-grid"><thead>${header}</thead><tbody>${rows}</tbody></table>
  </div>`;
}

/* Liste des UE proposables pour une période : les UE des DEUX promos (les 2
   semestres de la période), avec la promo indiquée pour lever l'ambiguïté. */
function templateUeOptionsHtml(periodKey, selectedId) {
  const sems = [templateSemester(periodKey, 'GPN1'), templateSemester(periodKey, 'GPN2')];
  const ues = (state.ues || []).filter(ue => ueSemesters(ue).some(s => sems.includes(s)));
  const opts = ues.map(ue => `<option value="${escapeAttr(ue.id)}" ${ue.id === selectedId ? 'selected' : ''}>${escapeHtml(ue.code)} — ${escapeHtml(ue.title)} (${escapeHtml(ue.promotion)})</option>`).join('');
  return `<option value="">— UE liée —</option>${opts}<option value="__free__" ${selectedId === '__free__' ? 'selected' : ''}>Autre (texte libre)…</option>`;
}

function openTemplateModal(slot, context = {}) {
  const dialog = $('#templateDialog');
  if (!dialog) return;
  const periodKey = slot ? periodOfSemester(slot.semester) : (context.period || creneauxPeriod);
  const promo = slot?.promotion || context.promo || state.promotions[0] || 'GPN1';
  $('#templateId').value = slot?.id || '';
  $('#templatePeriod').value = periodKey;
  setOptions('#templatePromotion', state.promotions.map(p => `<option value="${escapeAttr(p)}">${escapeHtml(p)}</option>`).join(''), promo);
  $('#templateModalTitle').textContent = slot ? 'Modifier un créneau type' : 'Ajouter un créneau type';
  $('#templateContext').textContent = `Semaine type · ${TEMPLATE_PERIODS.find(p => p.key === periodKey)?.label || ''}`;
  setOptions('#templateDay', DAYS.map((d, i) => `<option value="${i}">${d}</option>`).join(''), String(slot?.day ?? context.day ?? 0));
  const slotOpts = SLOTS.map((s, i) => i === 4 ? '' : `<option value="${i}">${s}</option>`).join('');
  setOptions('#templateStart', slotOpts, String(slot?.startSlot ?? context.slot ?? 0));
  setOptions('#templateEnd', slotOpts, String(slot?.endSlot ?? context.endSlot ?? context.slot ?? 0));
  if ($('#templatePosition')) $('#templatePosition').value = slot?.col ?? context.col ?? '';
  const ueSelectValue = slot ? (slot.ueId || (slot.ueCode ? '__free__' : '')) : '';
  $('#templateUe').innerHTML = templateUeOptionsHtml(periodKey, ueSelectValue);
  $('#templateUe').value = ueSelectValue;
  $('#templateUeCode').value = slot?.ueCode || '';
  $('#templateTitle').value = slot?.title || '';
  $('#templateTeacher').value = slot?.teacher || '';
  const colorEl = $('#templateColor');
  if (colorEl) {
    const hasColor = isValidHexColor(slot?.color);
    colorEl.value = hasColor ? slot.color : (slot?.ueId ? ueColor(slot.ueId) : '#9aa0ad');
    colorEl.dataset.custom = hasColor ? '1' : '';
  }
  toggleTemplateFreeCode();
  $('#deleteTemplateButton').style.display = slot ? '' : 'none';
  if (!dialog.open) dialog.showModal();
}

function toggleTemplateFreeCode() {
  const isFree = $('#templateUe')?.value === '__free__';
  const wrap = $('#templateUeCodeField');
  if (wrap) wrap.hidden = !isFree;
}

async function saveTemplateSlot(event) {
  event?.preventDefault();
  const id = $('#templateId').value;
  const periodKey = $('#templatePeriod').value;
  const ueSel = $('#templateUe').value;
  // Promo = celle de l'UE liée (fait foi), sinon le champ Promotion (créneaux libres).
  const ueId = ueSel && ueSel !== '__free__' ? ueSel : '';
  const promo = ueId ? (findUe(ueId)?.promotion || $('#templatePromotion').value) : $('#templatePromotion').value;
  const semester = templateSemester(periodKey, promo);
  const clamp = clampTemplateSlots(Number($('#templateStart').value), Number($('#templateEnd').value));
  const colorEl = $('#templateColor');
  const color = (colorEl?.dataset.custom === '1' && isValidHexColor(colorEl.value)) ? colorEl.value : '';
  const slot = normalizeTemplateSlot({
    id: id || undefined,
    semester,
    day: Number($('#templateDay').value),
    startSlot: clamp.start,
    endSlot: clamp.end,
    col: $('#templatePosition')?.value || '',
    ueId,
    ueCode: ueSel === '__free__' ? $('#templateUeCode').value.trim() : '',
    title: $('#templateTitle').value.trim(),
    teacher: $('#templateTeacher').value.trim(),
    color
  });
  const idx = state.weekTemplates.findIndex(t => t.id === slot.id);
  if (idx >= 0) state.weekTemplates[idx] = slot;
  else state.weekTemplates.push(slot);
  $('#templateDialog')?.close();
  await saveData('Créneau type enregistré');
}

async function deleteTemplateSlot() {
  const id = $('#templateId').value;
  $('#templateDialog')?.close();
  if (!id) return;
  state.weekTemplates = state.weekTemplates.filter(t => t.id !== id);
  await saveData('Créneau type supprimé');
}

/* ---------------------------------------------------------------------------
   Écran 8 — Planning étudiant (sous-onglet « Planning étudiant » de Référentiel
   & Ruban). Semaine type PAR PROMOTION, saisie à la main — sans date, sans
   glisser-déposer ni étirement (voir la mémoire du chantier : cette interaction
   n'existe nulle part ailleurs dans l'appli). Même mécanique clic-vide=créer /
   clic-tuile=modifier que « Mes créneaux types » juste au-dessus, dupliquée
   plutôt que partagée pour ne rien risquer sur cet écran déjà approuvé.
--------------------------------------------------------------------------- */
function renderStudentPlanning() {
  if (!studentPlanningPromo) studentPlanningPromo = state.promotions[0] || 'GPN1';
  $$('#rubanTabEtudiant [data-student-promo]').forEach(b => {
    const isActive = b.dataset.studentPromo === studentPlanningPromo;
    b.classList.toggle('active', isActive);
    b.setAttribute('aria-pressed', String(isActive));
  });
  $$('#rubanTabEtudiant [data-student-period]').forEach(b => {
    const isActive = b.dataset.studentPeriod === studentPlanningPeriod;
    b.classList.toggle('active', isActive);
    b.setAttribute('aria-pressed', String(isActive));
  });
  const mineToggle = $('#studentMineToggle');
  if (mineToggle) studentPlanningMineOnly = mineToggle.checked;
  const slots = (state.studentWeekTemplate || []).filter(t => t.promotion === studentPlanningPromo && t.period === studentPlanningPeriod);
  const countEl = $('#studentSummaryCount');
  if (countEl) countEl.textContent = `· ${slots.length} créneaux sur 40`;
  renderStudentGrid(studentPlanningPromo);
}

function renderStudentGrid(promotion) {
  const container = $('#studentPlanningGrid');
  if (!container) return;
  const slots = (state.studentWeekTemplate || []).filter(t => t.promotion === promotion && t.period === studentPlanningPeriod);
  const skip = new Set();
  const rows = SLOTS.map((slotLbl, slotIndex) => {
    if (slotIndex === 4) {
      return `<tr class="tpl-lunch"><td class="time-cell">Repas</td><td class="lunch-cell" colspan="5">Repas</td></tr>`;
    }
    const afterBreak = (slotIndex === 2 || slotIndex === 7) ? ' tpl-after-break' : '';
    const cells = DAYS.map((day, dayIndex) => {
      const key = `${dayIndex}-${slotIndex}`;
      if (skip.has(key)) return '';
      const t = slots.find(s => Number(s.day) === dayIndex && Number(s.startSlot) === slotIndex);
      if (t) {
        const cap = slotIndex < 4 ? 3 : 8;
        const segEnd = Math.min(Number(t.endSlot), cap);
        const rowspan = Math.max(1, segEnd - slotIndex + 1);
        for (let i = slotIndex + 1; i <= segEnd; i += 1) skip.add(`${dayIndex}-${i}`);
        const dimmed = studentPlanningMineOnly && !isMyStudentSlot(t);
        return `<td class="tpl-cell${dimmed ? ' student-dimmed' : ''}" rowspan="${rowspan}" style="--seq-color:${studentSlotTint(t)}" data-edit-student-slot="${escapeAttr(t.id)}" title="Modifier ce cours">${studentSlotCellInner(t)}</td>`;
      }
      const ctx = JSON.stringify({ promotion, period: studentPlanningPeriod, day: dayIndex, slot: slotIndex });
      return `<td class="tpl-empty" data-create-student-slot='${escapeAttr(ctx)}' title="Ajouter un cours"><span class="drop-hint">+</span></td>`;
    }).join('');
    return `<tr class="${afterBreak}"><td class="time-cell">${slotLbl}</td>${cells}</tr>`;
  }).join('');
  const header = `<tr><th class="tpl-corner">Créneau</th>${DAYS.map(d => `<th>${escapeHtml(d)}</th>`).join('')}</tr>`;
  container.innerHTML = `<table class="tpl-grid"><thead>${header}</thead><tbody>${rows}</tbody></table>`;
}

function studentUeOptionsHtml(promotion, selectedId) {
  const ues = (state.ues || []).filter(ue => ue.promotion === promotion);
  const opts = ues.map(ue => `<option value="${escapeAttr(ue.id)}" ${ue.id === selectedId ? 'selected' : ''}>${escapeHtml(ue.code)} — ${escapeHtml(ue.title)}</option>`).join('');
  return `<option value="">— UE liée —</option>${opts}<option value="__free__" ${selectedId === '__free__' ? 'selected' : ''}>Autre (texte libre)…</option>`;
}

function openStudentSlotModal(slot, context = {}) {
  const dialog = $('#studentSlotDialog');
  if (!dialog) return;
  const promotion = slot?.promotion || context.promotion || studentPlanningPromo || state.promotions[0] || 'GPN1';
  const period = slot?.period || context.period || studentPlanningPeriod;
  $('#studentSlotId').value = slot?.id || '';
  $('#studentSlotPromotion').value = promotion;
  $('#studentSlotPeriod').value = period;
  $('#studentSlotModalTitle').textContent = slot ? 'Modifier un cours' : 'Ajouter un cours';
  setOptions('#studentSlotDay', DAYS.map((d, i) => `<option value="${i}">${d}</option>`).join(''), String(slot?.day ?? context.day ?? 0));
  const slotOpts = SLOTS.map((s, i) => i === 4 ? '' : `<option value="${i}">${s}</option>`).join('');
  setOptions('#studentSlotStart', slotOpts, String(slot?.startSlot ?? context.slot ?? 0));
  setOptions('#studentSlotEnd', slotOpts, String(slot?.endSlot ?? context.slot ?? 0));
  const ueSelectValue = slot ? (slot.ueId || (slot.ueCode ? '__free__' : '')) : '';
  $('#studentSlotUe').innerHTML = studentUeOptionsHtml(promotion, ueSelectValue);
  $('#studentSlotUe').value = ueSelectValue;
  $('#studentSlotUeCode').value = slot?.ueCode || '';
  $('#studentSlotTitle').value = slot?.title || '';
  $('#studentSlotRoom').value = slot?.room || '';
  $('#studentSlotTeacher').value = slot?.teacher || '';
  const colorEl = $('#studentSlotColorInput');
  if (colorEl) {
    const hasColor = isValidHexColor(slot?.color);
    colorEl.value = hasColor ? slot.color : (slot?.ueId ? ueColor(slot.ueId) : '#9aa0ad');
    colorEl.dataset.custom = hasColor ? '1' : '0';
    syncColorSwatchActive('#studentSlotColorSwatches', '#studentSlotColorInput');
  }
  toggleStudentSlotFreeCode();
  $('#deleteStudentSlotButton').style.display = slot ? '' : 'none';
  if (!dialog.open) dialog.showModal();
}

function toggleStudentSlotFreeCode() {
  const isFree = $('#studentSlotUe')?.value === '__free__';
  const wrap = $('#studentSlotUeCodeField');
  if (wrap) wrap.hidden = !isFree;
}

async function saveStudentSlot(event) {
  event?.preventDefault();
  const id = $('#studentSlotId').value;
  const ueSel = $('#studentSlotUe').value;
  const ueId = ueSel && ueSel !== '__free__' ? ueSel : '';
  const clamp = clampTemplateSlots(Number($('#studentSlotStart').value), Number($('#studentSlotEnd').value));
  const colorEl = $('#studentSlotColorInput');
  const color = (colorEl?.dataset.custom === '1' && isValidHexColor(colorEl.value)) ? colorEl.value : '';
  const slot = normalizeStudentSlot({
    id: id || undefined,
    promotion: $('#studentSlotPromotion').value,
    period: $('#studentSlotPeriod').value,
    day: Number($('#studentSlotDay').value),
    startSlot: clamp.start,
    endSlot: clamp.end,
    ueId,
    ueCode: ueSel === '__free__' ? $('#studentSlotUeCode').value.trim() : '',
    title: $('#studentSlotTitle').value.trim(),
    room: $('#studentSlotRoom').value.trim(),
    teacher: $('#studentSlotTeacher').value.trim(),
    color
  });
  const idx = state.studentWeekTemplate.findIndex(t => t.id === slot.id);
  if (idx >= 0) state.studentWeekTemplate[idx] = slot; else state.studentWeekTemplate.push(slot);
  $('#studentSlotDialog')?.close();
  await saveData('Cours (planning étudiant) enregistré');
}

async function deleteStudentSlot() {
  const id = $('#studentSlotId').value;
  $('#studentSlotDialog')?.close();
  if (!id) return;
  state.studentWeekTemplate = state.studentWeekTemplate.filter(t => t.id !== id);
  await saveData('Cours (planning étudiant) supprimé');
}

/* Écran 8 — 3 binômes de sous-onglets (reference/pdf, ruban/repartition,
   etudiant/creneaux), tous au même niveau (retours #3, 18-19/08/2026 : Ruban
   et Répartition étaient un seul sous-onglet avec bascule interne, promus en
   deux sous-onglets à part entière). Chaque panneau garde son id et son
   contenu d'origine ; seule la visibilité change (attribut `hidden`). Le
   filtre enseignant (#rubanFilters) est commun à ruban/repartition, qui
   partagent la même donnée. La recherche unifiée n'a de sens que sur
   reference/ruban/repartition : vidée et neutralisée ailleurs, comme « Réglages
   d'année » (Créneaux types) n'a pas de comportement défini par la maquette
   non plus. */
let rubanTab = 'reference';
function setRubanTab(tab) {
  rubanTab = tab;
  $$('[data-ruban-tab]').forEach(b => {
    const isActive = b.dataset.rubanTab === tab;
    b.classList.toggle('active', isActive);
    b.setAttribute('aria-selected', String(isActive));
  });
  $('#rubanModeReference').hidden = tab !== 'reference';
  $('#rubanTabRuban').hidden = tab !== 'ruban';
  $('#rubanTabRepartition').hidden = tab !== 'repartition';
  $('#rubanTabEtudiant').hidden = tab !== 'etudiant';
  $('#rubanModeCreneaux').hidden = tab !== 'creneaux';
  $('#rubanTabPdf').hidden = tab !== 'pdf';
  const filtres = $('#rubanFilters');
  if (filtres) filtres.hidden = !(tab === 'ruban' || tab === 'repartition');
  const search = $('#rubanUnifiedSearch');
  if (search) {
    search.value = '';
    search.disabled = (tab === 'etudiant' || tab === 'creneaux' || tab === 'pdf');
  }
  if (tab === 'reference') renderReferenceModule();
  else if (tab === 'ruban' || tab === 'repartition') renderRuban();
  else if (tab === 'etudiant') renderStudentPlanning();
  else if (tab === 'creneaux') renderCreneaux();
  else if (tab === 'pdf') renderPdfLibrary();
}

/* 18/08 — Lot F : sous-onglet « PDF d'origine ». Sidebar = liste organisée des
   documents (REFERENCE_DOCS) groupée par type, cliquer un document le charge
   dans le lecteur central (iframe, rendu PDF natif du navigateur). */
let pdfLibSelected = REFERENCE_DOCS[0]?.id || '';
function renderPdfLibrary() {
  const toc = $('#pdfLibToc');
  if (!toc) return;
  if (!pdfLibSelected) pdfLibSelected = REFERENCE_DOCS[0]?.id || '';
  const groups = [];
  REFERENCE_DOCS.forEach(doc => {
    let group = groups.find(g => g.type === doc.type);
    if (!group) { group = { type: doc.type, docs: [] }; groups.push(group); }
    group.docs.push(doc);
  });
  toc.innerHTML = `<div class="refread-toc-head">Documents</div>` + groups.map(g => `
    <p class="pdf-lib-group-label">${escapeHtml(g.type)}</p>
    <ul class="refread-toc-list">
      ${g.docs.map(doc => `<li><button type="button" class="refread-toc-item pdf-lib-item ${doc.id === pdfLibSelected ? 'active' : ''}" data-pdf-doc="${escapeAttr(doc.id)}">${escapeHtml(doc.title)}</button></li>`).join('')}
    </ul>`).join('');
  const selected = REFERENCE_DOCS.find(d => d.id === pdfLibSelected) || REFERENCE_DOCS[0];
  const frame = $('#pdfLibFrame');
  if (frame && selected) {
    const src = `docs/${selected.file}`;
    if (frame.getAttribute('src') !== src) frame.setAttribute('src', src);
  }
}

/* ============================================================
   Écran 11 — Dossier (compositeur 3 colonnes + document imprimé)
   ============================================================
   Toutes les pages viennent des données réelles déjà saisies
   ailleurs (UE/séquences/séances, référentiel, ruban) — rien de
   nouveau à ressaisir. Seul ajout de donnée : ue.bilan (texte
   libre « Bilan de l'unité »), édité ici, persisté comme tout
   autre champ d'UE (mergeReferenceUes le porte via ...existing).
   Pagination : 1 page A4 par section cochée, 1 page par séquence
   cochée (pas de tassement à plusieurs séquences par page comme
   le document de référence — trop fragile à garantir en CSS
   d'impression réelle sans risquer un contenu tronqué ; le nombre
   de pages n'est donc jamais figé à 7, il dépend de l'UE choisie
   et des sections cochées, conformément au Known Gap #3). */

const DOSSIER_PRINT_CSS = `
/* Retours #3 (18-19/08/2026) : Chrome n'imprime pas les background-color par
   défaut (case « Graphiques d'arrière-plan » décochée), ce qui faisait
   disparaître les barres colorées de la frise de progression (.dossier-frise-bar
   et consorts, qui portent leur information PAR la couleur de fond, pas par
   une bordure) — comportement indépendant du réglage réel de la case, cette
   propriété l'impose. */
* { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
.dossier-page{box-sizing:border-box;width:210mm;min-height:297mm;margin:0 auto 8mm;padding:16mm 15mm 20mm;background:#fffefb;border:1px solid #d8d4c6;font-family:'IBM Plex Sans',sans-serif;color:#191b16;break-before:page;position:relative}
.dossier-page:first-child{break-before:auto}
.dossier-page .mono{font-family:'JetBrains Mono',monospace}
.dossier-page-header{display:flex;justify-content:space-between;align-items:baseline;border-bottom:1px solid #d8d4c6;padding-bottom:8px;margin-bottom:20px;font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:.08em;text-transform:uppercase;color:#8a958c}
.dossier-h2{margin:0 0 4px;font-size:21px;font-weight:600;letter-spacing:-.01em}
.dossier-h3{margin:20px 0 8px;font-size:13px;font-weight:700}
.dossier-h2-rule{width:40px;height:3px;background:#1a5fb4;margin-bottom:18px}
.dossier-body-text{font-size:13px;line-height:1.6;color:#3b3e36;max-width:70ch;margin:0 0 12px}
.dossier-body-text.meta{color:#6b6a5e}
.dossier-note-warn{font-size:12px;color:#7a5b16;background:#f4ead0;border:1px solid #e7dcb6;padding:8px 10px;margin:10px 0}
.dossier-label{display:block;font-family:'JetBrains Mono',monospace;font-size:9.5px;letter-spacing:.08em;text-transform:uppercase;color:#8a958c;margin-bottom:4px}
.dossier-page-footer{position:absolute;left:15mm;right:15mm;bottom:9mm;display:flex;justify-content:space-between;border-top:1px solid #ece8db;padding-top:7px;font-size:10px;color:#8a958c;font-family:'JetBrains Mono',monospace}
.dossier-chip-row{display:flex;flex-wrap:wrap;gap:6px;align-items:center}
.dossier-chip{display:inline-flex;align-items:center;height:20px;padding:0 8px;border:1px solid #d8d4c6;background:#f4f2ec;font-family:'JetBrains Mono',monospace;font-size:10.5px;color:#3b3e36}
.dossier-chip.mine{background:#23458c;border-color:#23458c;color:#fffefb;font-weight:600}
.dossier-chip.dossier-chip-accent{background:#dde4f2;border-color:#b7c5e0;color:#17305f;font-weight:600}
.dossier-table{width:100%;border-collapse:collapse;font-size:12px;margin:8px 0 4px}
.dossier-table thead{display:table-header-group}
.dossier-table th{text-align:left;padding:6px 8px;background:#f0ede2;border:1px solid #d8d4c6;font-family:'JetBrains Mono',monospace;font-size:9.5px;letter-spacing:.06em;text-transform:uppercase;color:#6b6a5e}
.dossier-table td{padding:7px 8px;border:1px solid #ece8db;vertical-align:top}
.dossier-table-sub{display:block;font-size:11px;color:#6b6a5e;margin-top:2px;font-weight:400}
.dossier-flag-warn{color:#C0562B}
.dossier-flag-ok{color:#1F7A5C}
.dossier-recap-total{margin-top:10px;font-size:12px}
/* Garde */
.dossier-page-garde{padding:0;display:flex;flex-direction:column}
.dossier-garde-band{height:8px;background:#1a5fb4;flex:0 0 auto}
.dossier-garde-inner{flex:1;padding:16mm 15mm 12mm;display:flex;flex-direction:column}
.dossier-garde-topbar{display:flex;justify-content:space-between;border-bottom:1px solid #d8d4c6;padding-bottom:10px;font-family:'JetBrains Mono',monospace;font-size:11px;color:#6b6a5e}
.dossier-eyebrow{font-family:'JetBrains Mono',monospace;font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:#6b6a5e;margin-bottom:16px}
.dossier-garde-title{margin-top:14mm}
.dossier-ue-code-big{font-family:'JetBrains Mono',monospace;font-size:24px;font-weight:600;color:#17305f}
.dossier-garde-title h1{margin:6px 0 0;font-size:38px;line-height:1.08;font-weight:600;letter-spacing:-.02em;max-width:16ch}
.dossier-garde-desc{margin:20px 0 0;font-size:14px;line-height:1.55;color:#3b3e36;max-width:56ch}
.dossier-garde-meta{margin-top:auto;border-top:1px solid #d8d4c6;padding-top:18px;display:grid;grid-template-columns:repeat(4,1fr);gap:16px 18px;font-size:14px}
.dossier-garde-meta .span-2{grid-column:span 2}
.dossier-garde-meta strong{display:block;font-size:14px;font-weight:600}
.dossier-garde-meta small{display:block;font-size:11px;color:#565a4e;margin-top:2px}
.dossier-teacher-pills{display:flex;flex-wrap:wrap;gap:12px}
.dossier-teacher-pill{display:flex;align-items:center;gap:7px}
.dossier-teacher-pill .pip{display:inline-flex;align-items:center;justify-content:center;width:20px;height:20px;background:#f0ede2;border:1px solid #d8d4c6;font-family:'JetBrains Mono',monospace;font-size:9.5px;font-weight:600;color:#3b3e36}
.dossier-teacher-pill.mine .pip{background:#1a5fb4;border-color:#1a5fb4;color:#fffefb}
.dossier-teacher-pill span.mono{font-size:11px;color:#565a4e}
.dossier-garde-footer{margin-top:20px;border-top:1px solid #d8d4c6;padding-top:16px;display:flex;align-items:center;gap:14px;font-family:'JetBrains Mono',monospace;font-size:10.5px;color:#6b6a5e}
.dossier-garde-footer .dossier-garde-footer-right{margin-left:auto;font-family:'IBM Plex Sans',sans-serif;font-size:11px;color:#565a4e}
/* Capacités */
.dossier-capacity-block{border:1px solid #d8d4c6;border-left:3px solid #1a5fb4;margin-bottom:16px}
.dossier-capacity-head{display:flex;align-items:baseline;gap:12px;padding:12px 14px 10px;border-bottom:1px solid #ece8db}
.dossier-capacity-code{font-size:15px;font-weight:600;color:#17305f}
.dossier-capacity-title{font-size:14px;font-weight:600}
.dossier-capacity-grid{padding:10px 14px 12px;display:grid;grid-template-columns:120px 1fr;gap:8px 14px;font-size:12px}
.dossier-criteria-list{margin:0;padding-left:16px;color:#3b3e36}
.dossier-volumes-row{display:flex;border:1px solid #d8d4c6;margin:6px 0 4px}
.dossier-volume-cell{flex:1;padding:10px 10px;text-align:center;border-right:1px solid #ece8db}
.dossier-volume-cell:last-child{border-right:none}
.dossier-volume-cell strong{display:block;font-size:17px}
.dossier-volume-cell span{font-size:10.5px;color:#565a4e}
/* Progression */
.dossier-frise-grid{display:grid;row-gap:2px;column-gap:2px;margin-bottom:14px}
.dossier-frise-week{font-size:9px;text-align:center;color:#8a958c;padding-bottom:4px}
.dossier-frise-label{font-size:11px;padding:4px 6px 4px 0;align-self:center}
.dossier-frise-cell{background:#f4f2ec;height:20px}
.dossier-frise-bar{background:var(--seq-color,#1a5fb4);height:20px}
.dossier-frise-week.is-thematic,.dossier-frise-cell.is-thematic{background:#f3e6c2}
.dossier-frise-week.is-blocked,.dossier-frise-cell.is-blocked{background:#e8e6dd}
.dossier-frise-legend{margin:-6px 0 12px;font-size:10px;color:#6b6a5e}
.dossier-frise-swatch{display:inline-block;width:9px;height:9px;margin:0 4px 0 14px;vertical-align:middle}
.dossier-frise-swatch:first-child{margin-left:0}
.dossier-frise-swatch.is-thematic{background:#f3e6c2;border:1px solid #d9b75a}
.dossier-frise-swatch.is-blocked{background:#e8e6dd;border:1px solid #b3ac93}
.dossier-table-compact th,.dossier-table-compact td{padding:5px 8px;font-size:11px}
/* Fiche de séquence */
.dossier-sequence-head{border-left:4px solid var(--seq-color,#1a5fb4);padding-left:14px;margin-bottom:14px}
.dossier-sequence-head h2{margin:0 0 8px;font-size:21px;font-weight:600;letter-spacing:-.01em}
.dossier-sequence-meta{display:grid;grid-template-columns:1fr 1fr;gap:10px 20px;margin-top:14px;font-size:12px}
.dossier-sequence-meta p{margin:0;color:#3b3e36;line-height:1.5}
`;

let dossierUeId = '';
let dossierViewMode = 'grille';
let dossierSections = null;

function resetDossierSections(ue) {
  dossierSections = {
    ueId: ue?.id || '',
    garde: true,
    intention: true,
    referentiel: true,
    referentielIntitules: true,
    referentielCriteres: false,
    progression: true,
    sequences: true,
    sequenceIds: new Set((state.sequences || []).filter(s => s.ueId === ue?.id).map(s => s.id)),
    recapitulatif: true,
    bilan: false,
    vigilance: false
  };
}

function dossierEditedDateLabel() {
  return new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date());
}

function ensureDossierPrintStyle() {
  if (document.getElementById('dossierPrintStyle')) return;
  const style = document.createElement('style');
  style.id = 'dossierPrintStyle';
  style.textContent = DOSSIER_PRINT_CSS;
  document.head.appendChild(style);
}

function renderDossier() {
  const select = $('#dossierUeSelect');
  if (!select) return;
  ensureDossierPrintStyle();
  // 17/08 — retour Martin : « réduire le filtre des UE à celles pour lesquelles je suis
  // concerné ». Décoché par défaut (liste complète inchangée) : un filtre qu'on choisit
  // d'activer, pas un repli silencieux qui viderait la liste tant que le Ruban n'est pas
  // renseigné en prod (piège déjà rencontré ailleurs — voir organisation-cours-charte).
  const mineOnly = !!$('#dossierMineFilter')?.checked;
  const allUes = state.ues.slice().sort((a, b) => compactUeCode(a.code).localeCompare(compactUeCode(b.code), 'fr', { numeric: true }));
  const sortedUes = mineOnly ? allUes.filter(ue => moiInitiales && enseignantsDeLUe(ue).includes(moiInitiales)) : allUes;
  select.innerHTML = sortedUes.length
    ? sortedUes.map(ue => `<option value="${escapeAttr(ue.id)}">${escapeHtml(ue.code)} · ${escapeHtml(ue.title)}</option>`).join('')
    : '<option value="">Aucune UE</option>';
  if (!dossierUeId || !sortedUes.some(u => u.id === dossierUeId)) dossierUeId = sortedUes[0]?.id || '';
  select.value = dossierUeId;

  const ue = findUe(dossierUeId);
  if (!dossierSections || dossierSections.ueId !== dossierUeId) resetDossierSections(ue);

  renderDossierUeSummary(ue);
  renderDossierSectionsList(ue);

  const units = ue ? dossierBuildUnits(ue, dossierSections) : [];
  renderDossierPreviewGrille(ue, units);
  renderDossierPreviewLecture(ue, units);
  renderDossierAvantImprimer(ue, units);
}

function dossierUeSessions(ue) {
  if (!ue) return [];
  return state.sessions.filter(s => s.ueId === ue.id);
}

function dossierSessionMinutes(session) {
  const fromText = String(session.expectedDuration || '').match(/(\d+)\s*h(?:\s*(\d+))?/i);
  if (fromText) return Number(fromText[1]) * 60 + Number(fromText[2] || 0);
  if (isDefinitiveSession(session)) return sessionDurationSlots(session) * 55;
  return 0;
}
function dossierHoursLabel(minutes) {
  if (!minutes) return '';
  const h = Math.floor(minutes / 60), m = minutes % 60;
  return m ? `${h} h ${String(m).padStart(2, '0')}` : `${h} h`;
}

function dossierPeriodLabel(ue) {
  if (!ue.startWeekId || !ue.endWeekId) return 'à préciser';
  return `${weekLabel(ue.startWeekId)} → ${weekLabel(ue.endWeekId)}`;
}

function dossierTeacherStats(ue) {
  const counts = new Map();
  dossierUeSessions(ue).forEach(s => teacherTokens(s.teacher).forEach(t => counts.set(t, (counts.get(t) || 0) + 1)));
  return [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([initials, count]) => ({ initials, count }));
}

function dossierTeacherPillsHtml(teachers) {
  if (!teachers.length) return '<p class="meta tight">Aucun enseignant déclaré sur les séances.</p>';
  return `<div class="dossier-teacher-pills">${teachers.map(t => `<span class="dossier-teacher-pill ${t.initials === moiInitiales ? 'mine' : ''}"><span class="pip">${escapeHtml(t.initials)}</span><span class="mono">${escapeHtml(t.initials)} · ${t.count} séance(s)</span></span>`).join('')}</div>`;
}

function dossierUnitShortLabel(u) {
  if (u.kind === 'sequence') return truncate(u.title, 18);
  return { garde: 'Garde', intention: 'Intention', referentiel: 'Capacités', progression: 'Progression', recapitulatif: 'Séances', bilan: 'Bilan' }[u.kind] || u.title;
}

/* Liste ordonnée des unités (= pages) à sortir, selon les cases cochées. Une
   unité = une page A4 exactement (voir note d'en-tête du bloc). */
function dossierBuildUnits(ue, sections) {
  // Retours #3 (18-19/08/2026) — Cas 1 (visibilité entre comptes enseignants,
  // renforcé sur demande explicite) : aucun contenu de dossier pour une UE que
  // je n'enseigne pas, PAS MÊME la page de garde — ni affiché, ni imprimable.
  // Point de passage unique : aperçus (grille/lecture), complétude et
  // dossierOpenPrintWindow en dépendent tous, via units.length === 0.
  if (!jeSuisEnseignantDeLUe(ue)) return [];
  const seqs = state.sequences.filter(s => s.ueId === ue.id).slice()
    .sort((a, b) => dossierSequenceOrder(a) - dossierSequenceOrder(b));
  const units = [{ key: 'garde', kind: 'garde', title: 'Page de garde' }];
  if (sections.intention) units.push({ key: 'intention', kind: 'intention', title: 'Intention pédagogique' });
  if (sections.referentiel) units.push({ key: 'referentiel', kind: 'referentiel', title: 'Le référentiel interactif' });
  if (sections.progression) units.push({ key: 'progression', kind: 'progression', title: 'Progression de l’unité' });
  if (sections.sequences) {
    seqs.forEach((seq, i) => {
      if (sections.sequenceIds.has(seq.id)) units.push({ key: `seq:${seq.id}`, kind: 'sequence', title: seq.title || `Séquence ${i + 1}`, seq });
    });
  }
  if (sections.recapitulatif) units.push({ key: 'recapitulatif', kind: 'recapitulatif', title: 'Récapitulatif des séances' });
  if (sections.bilan) units.push({ key: 'bilan', kind: 'bilan', title: 'Bilan de l’unité' });
  return units;
}
function dossierSequenceOrder(seq) {
  // Trier par vraie position chronologique (index dans state.weeks, qui couvre
  // l'année scolaire dans l'ordre) plutôt que par simple numéro de semaine —
  // sinon une séquence de janvier (S3) passait avant une séquence de décembre
  // (S50) puisque 3 < 50 numériquement, alors qu'elle est plus tardive.
  const weekId = firstWeekIdOfSequence(seq);
  const idx = weekId ? state.weeks.findIndex(w => w.id === weekId) : -1;
  if (idx !== -1) return idx;
  const m = String(seq.targetWeeks || '').match(/\d{1,2}/);
  return m ? 100000 + Number(m[0]) : 999999;
}

function dossierSessionSort(a, b) {
  const wa = a.weekId || a.targetWeekId || '', wb = b.weekId || b.targetWeekId || '';
  if (wa !== wb) return wa.localeCompare(wb);
  return (a.day ?? 9) - (b.day ?? 9);
}

/* ---- Contenu des pages (réutilisé tel quel par l'aperçu « Lecture » et par
   la fenêtre d'impression : une seule fonction produit le HTML des deux). ---- */

function dossierPageHeaderInner(ue) {
  return `<span>${escapeHtml(ue.code)} · ${escapeHtml(ue.title)}</span><span>${escapeHtml(ue.promotion)} · ${escapeHtml(ue.semester)}</span>`;
}
function dossierPageFooter(ue, footerOpts) {
  if (!footerOpts?.show) return '';
  const num = footerOpts.pageOf ? `page ${footerOpts.index} sur ${footerOpts.total}` : String(footerOpts.index);
  return `<div class="dossier-page-footer"><span>${escapeHtml(ue.code)} · dossier édité le ${dossierEditedDateLabel()}</span><span class="mono">${num}</span></div>`;
}

function dossierPageGarde(ue, footerOpts, total) {
  const seqs = state.sequences.filter(s => s.ueId === ue.id);
  const sessions = dossierUeSessions(ue);
  const minutes = sessions.reduce((sum, s) => sum + dossierSessionMinutes(s), 0);
  const teachers = dossierTeacherStats(ue);
  const footer = footerOpts?.show ? `<div class="dossier-garde-footer">
      <span>Édité le ${dossierEditedDateLabel()}</span>
      <span>${total} page${total > 1 ? 's' : ''} · année ${escapeHtml(state.schoolYear || '')}</span>
      <span class="dossier-garde-footer-right">Organisation des cours — BTS GPN Kerplouz</span>
    </div>` : '';
  return `<article class="dossier-page dossier-page-garde">
    <div class="dossier-garde-band"></div>
    <div class="dossier-garde-inner">
      <div class="dossier-garde-topbar mono"><span>Kerplouz LaSalle — Auray</span><span>BTSA Gestion et Protection de la Nature</span></div>
      <div class="dossier-garde-title">
        <div class="dossier-eyebrow">Dossier d'unité d'enseignement</div>
        <div class="dossier-ue-code-big mono">${escapeHtml(ue.code)}</div>
        <h1>${escapeHtml(ue.title)}</h1>
        ${ue.description ? `<p class="dossier-garde-desc">${escapeHtml(ue.description)}</p>` : ''}
      </div>
      <div class="dossier-garde-meta">
        <div><span class="dossier-label">Promotion</span><strong>${escapeHtml(ue.promotion)}</strong></div>
        <div><span class="dossier-label">Semestre</span><strong>${escapeHtml(ue.semester)}</strong></div>
        <div><span class="dossier-label">Période</span><strong class="mono">${escapeHtml(dossierPeriodLabel(ue))}</strong></div>
        <div><span class="dossier-label">Volume</span><strong class="mono">${escapeHtml(dossierHoursLabel(minutes) || 'à préciser')}</strong><small>${seqs.length} séquence(s) · ${sessions.length} séance(s)</small></div>
        <div class="span-2"><span class="dossier-label">Enseignants intervenant sur les séances</span>${dossierTeacherPillsHtml(teachers)}</div>
      </div>
      ${footer}
    </div>
  </article>`;
}

function dossierPageIntention(ue, footerOpts) {
  return `<article class="dossier-page">
    <header class="dossier-page-header mono">${dossierPageHeaderInner(ue)}</header>
    <h2 class="dossier-h2">Intention pédagogique</h2><div class="dossier-h2-rule"></div>
    <p class="dossier-body-text">${ue.description ? escapeHtml(ue.description) : '<span class="meta">Aucune intention pédagogique renseignée pour cette UE.</span>'}</p>
    ${dossierPageFooter(ue, footerOpts)}
  </article>`;
}

function dossierUeCapacitiesFull(ue) {
  const rubanUe = findRubanUe(ueCodeCompact(ue.code));
  const caps = rubanUe ? rubanUeCapacities(rubanUe) : ueCapacities(ue).map(c => ({ code: c.code, title: c.title, disciplines: [], enseignants: [], evaluateurs: [] }));
  const seqs = state.sequences.filter(s => s.ueId === ue.id);
  return caps.map(cap => ({
    ...cap,
    ref: (window.REFERENCE_CAPACITIES || {})[cap.code] || null,
    sequences: seqs.filter(s => (s.capacityCodes || []).includes(cap.code))
  }));
}

function dossierCapacityBlockHtml(cap, sections) {
  const seqNames = cap.sequences.map(s => s.title || 'sans titre');
  const title = (sections.referentielIntitules && cap.ref?.title) ? cap.ref.title : cap.title;
  return `<div class="dossier-capacity-block">
    <div class="dossier-capacity-head"><span class="mono dossier-capacity-code">${escapeHtml(cap.code)}</span><span class="dossier-capacity-title">${escapeHtml(title)}</span></div>
    <div class="dossier-capacity-grid">
      <span class="dossier-label">Disciplines</span><span class="dossier-chip-row">${cap.disciplines.length ? cap.disciplines.map(d => `<span class="dossier-chip">${escapeHtml(d)}</span>`).join('') : '<span class="meta">Non renseignées</span>'}</span>
      <span class="dossier-label">Enseignants</span><span class="dossier-chip-row">${cap.enseignants.length ? cap.enseignants.map(t => `<span class="dossier-chip ${t === moiInitiales ? 'mine' : ''}">${escapeHtml(t)}</span>`).join('') : '<span class="meta">Non renseignés</span>'}</span>
      <span class="dossier-label">Évaluateurs</span><span class="dossier-chip-row">${cap.evaluateurs.length ? cap.evaluateurs.map(t => `<span class="dossier-chip ${t === moiInitiales ? 'mine' : ''}">${escapeHtml(t)}</span>`).join('') : '<span class="meta">Non renseignés</span>'}</span>
      <span class="dossier-label">Travaillée en</span><span>${seqNames.length ? escapeHtml(seqNames.join(' · ')) : '<span class="meta">Aucune séquence ne déclare cette capacité.</span>'}</span>
      ${sections.referentielCriteres && cap.ref?.criteria?.length ? `<span class="dossier-label">Critères d'évaluation</span><span><ul class="dossier-criteria-list">${cap.ref.criteria.map(c => `<li>${escapeHtml(c)}</li>`).join('')}</ul></span>` : ''}
    </div>
  </div>`;
}

function dossierVolumesByType(ue) {
  const map = new Map();
  dossierUeSessions(ue).forEach(s => {
    const type = s.type || 'Non précisé';
    map.set(type, (map.get(type) || 0) + dossierSessionMinutes(s));
  });
  return [...map.entries()].filter(([, minutes]) => minutes > 0).sort((a, b) => b[1] - a[1]);
}
function dossierVolumesTableHtml(rows) {
  if (!rows.length) return '<p class="dossier-body-text meta">Aucune séance saisie pour cette UE.</p>';
  return `<div class="dossier-volumes-row">${rows.map(([type, minutes]) => `<div class="dossier-volume-cell"><strong class="mono">${escapeHtml(dossierHoursLabel(minutes))}</strong><span>${escapeHtml(type)}</span></div>`).join('')}</div>`;
}

function dossierEvaluationTableHtml(ue) {
  const rows = dossierUeSessions(ue).filter(s => s.type === 'Évaluation');
  if (!rows.length) return '<p class="dossier-body-text meta">Aucune évaluation d’unité saisie sur les séances (type « Évaluation »).</p>';
  return `<table class="dossier-table"><thead><tr><th>Épreuve</th><th>Objet</th><th>Semaine</th></tr></thead><tbody>
    ${rows.map(s => `<tr><td><strong>${escapeHtml(s.title || 'Sans titre')}</strong></td><td>${escapeHtml(s.objectives || s.notes || '')}</td><td class="mono">${escapeHtml(weekLabel(s.weekId || s.targetWeekId))}${isFictiveSession(s) ? ' <span class="dossier-flag-warn">à placer</span>' : ''}</td></tr>`).join('')}
  </tbody></table>`;
}

function dossierPageReferentiel(ue, sections, footerOpts) {
  const caps = dossierUeCapacitiesFull(ue);
  const capsHtml = caps.length ? caps.map(cap => dossierCapacityBlockHtml(cap, sections)).join('')
    : '<p class="dossier-body-text meta">Aucune capacité déclarée pour cette UE dans Référentiel.</p>';
  const seqsWithoutCap = state.sequences.filter(s => s.ueId === ue.id && !(s.capacityCodes || []).length);
  return `<article class="dossier-page">
    <header class="dossier-page-header mono">${dossierPageHeaderInner(ue)}</header>
    <h2 class="dossier-h2">Le référentiel interactif</h2><div class="dossier-h2-rule"></div>
    ${capsHtml}
    ${seqsWithoutCap.length ? `<p class="dossier-note-warn">${seqsWithoutCap.length} séquence(s) sans capacité déclarée : ${escapeHtml(seqsWithoutCap.map(s => s.title || 'sans titre').join(', '))}.</p>` : ''}
    <h3 class="dossier-h3">Volumes par type de séance</h3>
    ${dossierVolumesTableHtml(dossierVolumesByType(ue))}
    <h3 class="dossier-h3">Évaluation de l'unité</h3>
    ${dossierEvaluationTableHtml(ue)}
    ${dossierPageFooter(ue, footerOpts)}
  </article>`;
}

function dossierProgressionTableHtml(seqs, ue) {
  if (!seqs.length) return '';
  // Retours #3 (18-19/08/2026) : distinguer mon ressort de celui des
  // collègues quand plusieurs enseignent l'UE sans co-concevoir les mêmes
  // séquences (même chip .mine qu'ailleurs dans le dossier).
  return `<table class="dossier-table dossier-table-compact"><thead><tr><th>Séquence</th><th>Semaines</th><th>Durée</th><th>Séances</th><th>Ens.</th></tr></thead><tbody>
    ${seqs.map(seq => { const teachers = teacherTokens(seq.teacher || ue?.teacher); return `<tr><td><strong>${escapeHtml(seq.title || 'Sans titre')}</strong></td><td class="mono">${escapeHtml(seq.targetWeeks || '—')}</td><td class="mono">${escapeHtml(seq.hoursEstimate || '—')}</td><td class="mono">${state.sessions.filter(s => s.sequenceId === seq.id).length}</td><td class="mono">${teachers.length ? teachers.map(t => `<span class="dossier-chip ${t === moiInitiales ? 'mine' : ''}">${escapeHtml(t)}</span>`).join('') : '—'}</td></tr>`; }).join('')}
  </tbody></table>`;
}

function dossierPageProgression(ue, footerOpts) {
  const weeks = weeksForSemester(ue.semester);
  // Même tri chronologique que dossierBuildUnits (app.js) — sans lui, l'ordre
  // suivait la création des séquences, pas leur position dans l'année
  // (Ajustements #2, 18/08/2026, retour Martin : régression du même bug que
  // le Lot G avait corrigé ailleurs).
  const seqs = state.sequences.filter(s => s.ueId === ue.id).slice()
    .sort((a, b) => dossierSequenceOrder(a) - dossierSequenceOrder(b));
  let grid = '';
  // Ajustements #2 (18/08/2026, retour Martin) : marquer les semaines hors
  // routine (vacances/stage, thématique·EIL non portée par cette UE) pour que
  // les vides de la frise se comprennent au lieu de sembler des oublis.
  // isThematicBlocked exclut la (les) UE porteuse(s) de l'EIL : chez elles la
  // semaine a de vraies séances, ce n'est pas un vide.
  let hasThematic = false, hasBlocked = false;
  const weekMark = weeks.map(w => {
    if (isThematicBlocked(w, ue.promotion, ue.id)) { hasThematic = true; return 'is-thematic'; }
    if (isBlockedWeek(w, ue.promotion)) { hasBlocked = true; return 'is-blocked'; }
    return '';
  });
  if (seqs.length && weeks.length) {
    weeks.forEach((w, i) => { grid += `<div class="dossier-frise-week mono ${weekMark[i]}" style="grid-column:${i + 2};grid-row:1">${escapeHtml(w.label)}</div>`; });
    seqs.forEach((seq, idx) => {
      const row = idx + 2;
      grid += `<div class="dossier-frise-label" style="grid-row:${row}">${escapeHtml(seq.title || 'Séquence sans titre')}</div>`;
      weeks.forEach((w, i) => { grid += `<div class="dossier-frise-cell ${weekMark[i]}" style="grid-column:${i + 2};grid-row:${row}"></div>`; });
      sequenceWeekSegments(seq, weeks).forEach(seg => {
        grid += `<div class="dossier-frise-bar" style="grid-column:${seg.startIndex + 2} / ${seg.endIndex + 3};grid-row:${row};--seq-color:${sequenceColor(seq.id)}"></div>`;
      });
    });
  }
  const cols = `130px repeat(${weeks.length || 1}, 1fr)`;
  const legend = (hasThematic || hasBlocked) ? `<p class="dossier-frise-legend meta tight">${hasThematic ? '<span class="dossier-frise-swatch is-thematic"></span>semaine thématique / EIL' : ''}${hasBlocked ? '<span class="dossier-frise-swatch is-blocked"></span>vacances / sans cours' : ''}</p>` : '';
  return `<article class="dossier-page">
    <header class="dossier-page-header mono">${dossierPageHeaderInner(ue)}</header>
    <h2 class="dossier-h2">Progression de l'unité</h2><div class="dossier-h2-rule"></div>
    ${seqs.length ? `<div class="dossier-frise-grid" style="grid-template-columns:${cols}">${grid}</div>` : '<p class="dossier-body-text meta">Aucune séquence pour cette UE.</p>'}
    ${legend}
    ${dossierProgressionTableHtml(seqs, ue)}
    ${dossierPageFooter(ue, footerOpts)}
  </article>`;
}

function dossierSequenceBlock(seq, ue, footerOpts) {
  const sessions = state.sessions.filter(s => s.sequenceId === seq.id).slice().sort(dossierSessionSort);
  const rows = sessions.map((s, i) => { const teachers = teacherTokens(s.teacher || seq.teacher || ue.teacher); return `<tr>
    <td class="mono">${i + 1}</td>
    <td><strong>${escapeHtml(s.title || 'Sans titre')}</strong>${s.objectives ? `<span class="dossier-table-sub">${escapeHtml(truncate(s.objectives, 160))}</span>` : ''}</td>
    <td class="mono">${escapeHtml(s.type || '—')}</td>
    <td class="mono">${escapeHtml(weekLabel(s.weekId || s.targetWeekId))}</td>
    <td class="mono">${escapeHtml(dossierHoursLabel(dossierSessionMinutes(s)) || '—')}</td>
    <td>${escapeHtml(s.room || '—')}</td>
    <td class="mono">${teachers.length ? teachers.map(t => `<span class="dossier-chip ${t === moiInitiales ? 'mine' : ''}">${escapeHtml(t)}</span>`).join('') : '—'}</td>
  </tr>`; }).join('') || `<tr><td colspan="7" class="meta">Aucune séance rattachée à cette séquence.</td></tr>`;
  return `<article class="dossier-page">
    <header class="dossier-page-header mono"><span>${escapeHtml(ue.code)} · Séquences</span><span>${escapeHtml(ue.promotion)} · ${escapeHtml(ue.semester)}</span></header>
    <div class="dossier-sequence-head" style="--seq-color:${sequenceColor(seq.id)}">
      <div class="dossier-eyebrow">Séquence</div>
      <h2>${escapeHtml(seq.title || 'Sans titre')}</h2>
      <div class="dossier-chip-row">
        <span class="dossier-chip">${escapeHtml(seq.targetWeeks || '—')}</span>
        <span class="dossier-chip">${escapeHtml(seq.hoursEstimate || '—')}</span>
        <span class="dossier-chip">${sessions.length} séance(s)</span>
        ${(seq.capacityCodes || []).map(c => `<span class="dossier-chip dossier-chip-accent">${escapeHtml(c)}</span>`).join('')}
        ${teacherTokens(seq.teacher || ue.teacher).map(t => `<span class="dossier-chip ${t === moiInitiales ? 'mine' : ''}">${escapeHtml(t)}</span>`).join('')}
      </div>
    </div>
    <table class="dossier-table"><thead><tr><th>Nº</th><th>Séance</th><th>Type</th><th>Sem.</th><th>Durée</th><th>Lieu</th><th>Ens.</th></tr></thead><tbody>${rows}</tbody></table>
    <div class="dossier-sequence-meta">
      ${seq.objectives ? `<div><span class="dossier-label">Objectifs</span><p>${escapeHtml(seq.objectives)}</p></div>` : ''}
      ${seq.learningOutcomes ? `<div><span class="dossier-label">Acquis visés</span><p>${escapeHtml(seq.learningOutcomes)}</p></div>` : ''}
      ${seq.keywords ? `<div><span class="dossier-label">Mots-clés</span><p>${escapeHtml(seq.keywords)}</p></div>` : ''}
      ${seq.deliverables ? `<div><span class="dossier-label">Production attendue</span><p>${escapeHtml(seq.deliverables)}</p></div>` : ''}
    </div>
    ${!seq.deliverables ? '<p class="dossier-note-warn">Aucune production attendue renseignée pour cette séquence.</p>' : ''}
    ${dossierPageFooter(ue, footerOpts)}
  </article>`;
}

function dossierPageRecapitulatif(ue, footerOpts) {
  const sessions = dossierUeSessions(ue).slice().sort(dossierSessionSort);
  const minutes = sessions.reduce((sum, s) => sum + dossierSessionMinutes(s), 0);
  const placed = sessions.filter(s => !isFictiveSession(s)).length;
  const toPlace = sessions.length - placed;
  const rows = sessions.map(s => `<tr>
    <td class="mono">${escapeHtml(weekLabel(s.weekId || s.targetWeekId))}</td>
    <td class="mono">${!isFictiveSession(s) && Number.isInteger(s.day) ? escapeHtml((DAY_NAMES[s.day] || '').slice(0, 3).toLowerCase()) : '—'}</td>
    <td><strong>${escapeHtml(s.title || 'Sans titre')}</strong></td>
    <td class="mono">${escapeHtml(s.type || '—')}</td>
    <td class="mono">${escapeHtml(dossierHoursLabel(dossierSessionMinutes(s)) || '—')}</td>
    <td>${escapeHtml(s.room || '—')}</td>
    <!-- Retours #3 (18-19/08/2026) : distinguer mon ressort de celui des
         collègues, même chip .mine que la fiche de séquence et le référentiel
         (dossier-chip-row), plutôt qu'une liste d'initiales indifférenciée. -->
    <td class="mono">${teacherTokens(s.teacher).length ? teacherTokens(s.teacher).map(t => `<span class="dossier-chip ${t === moiInitiales ? 'mine' : ''}">${escapeHtml(t)}</span>`).join('') : '—'}</td>
    <td class="mono ${isFictiveSession(s) ? 'dossier-flag-warn' : 'dossier-flag-ok'}">${escapeHtml(displayPlacementStatus(s.placementStatus) || 'placée')}</td>
  </tr>`).join('') || `<tr><td colspan="8" class="meta">Aucune séance pour cette UE.</td></tr>`;
  return `<article class="dossier-page">
    <header class="dossier-page-header mono">${dossierPageHeaderInner(ue)}</header>
    <h2 class="dossier-h2">Récapitulatif des séances</h2><div class="dossier-h2-rule"></div>
    <p class="dossier-body-text meta">Les ${sessions.length} séance(s) de l'unité, une ligne chacune.</p>
    <table class="dossier-table"><thead><tr><th>Sem.</th><th>Jour</th><th>Séance</th><th>Type</th><th>Durée</th><th>Lieu</th><th>Ens.</th><th>État</th></tr></thead><tbody>${rows}</tbody></table>
    <p class="dossier-recap-total mono">Total : ${escapeHtml(dossierHoursLabel(minutes) || '—')} · ${placed} placée(s)${toPlace ? ` · <span class="dossier-flag-warn">${toPlace} à placer</span>` : ''}</p>
    ${dossierPageFooter(ue, footerOpts)}
  </article>`;
}

function dossierPageBilan(ue, footerOpts) {
  return `<article class="dossier-page">
    <header class="dossier-page-header mono">${dossierPageHeaderInner(ue)}</header>
    <h2 class="dossier-h2">Bilan de l'unité</h2><div class="dossier-h2-rule"></div>
    <p class="dossier-body-text">${ue.bilan ? escapeHtml(ue.bilan).replace(/\n/g, '<br>') : '<span class="meta">Aucun bilan renseigné.</span>'}</p>
    ${dossierPageFooter(ue, footerOpts)}
  </article>`;
}

function dossierPageContentHtml(unit, ue, sections, footerOpts, total) {
  switch (unit.kind) {
    case 'garde': return dossierPageGarde(ue, footerOpts, total);
    case 'intention': return dossierPageIntention(ue, footerOpts);
    case 'referentiel': return dossierPageReferentiel(ue, sections, footerOpts);
    case 'progression': return dossierPageProgression(ue, footerOpts);
    case 'sequence': return dossierSequenceBlock(unit.seq, ue, footerOpts);
    case 'recapitulatif': return dossierPageRecapitulatif(ue, footerOpts);
    case 'bilan': return dossierPageBilan(ue, footerOpts);
    default: return '';
  }
}

function dossierPagesHtml(ue, units, opts = {}) {
  const footerDate = opts.footerDate !== undefined ? opts.footerDate : !!$('#dossierOptFooterDate')?.checked;
  const pageOf = opts.pageOf !== undefined ? opts.pageOf : !!$('#dossierOptPageOf')?.checked;
  const total = units.length;
  return units.map((u, i) => dossierPageContentHtml(u, ue, dossierSections, { show: footerDate, pageOf, index: i + 1, total }, total)).join('');
}

/* ---- Colonne 2 : la checklist des sections ---- */

function dossierSectionRow(key, label, opts = {}) {
  const checked = opts.locked ? (key === 'garde') : !!dossierSections[key];
  const disabled = opts.disabled ? 'disabled' : '';
  const hint = opts.hint ? `<p class="dossier-section-hint">${escapeHtml(opts.hint)}</p>` : '';
  const subRows = opts.sub ? `<div class="dossier-subsections">${opts.sub.join('')}</div>` : '';
  const editor = (key === 'bilan' && dossierSections.bilan) ? dossierBilanEditorHtml() : '';
  return `<div class="dossier-section-row ${opts.locked ? 'locked' : ''}">
    <label class="checkbox-inline">
      <input type="checkbox" data-dossier-section="${key}" ${checked ? 'checked' : ''} ${disabled} />
      <span>${escapeHtml(label)}</span>
    </label>
    ${hint}
    ${subRows}
    ${editor}
  </div>`;
}
function dossierSubRow(key, label) {
  const checked = key.startsWith('seq:') ? dossierSections.sequenceIds.has(key.slice(4)) : !!dossierSections[key];
  return `<label class="checkbox-inline dossier-subrow"><input type="checkbox" data-dossier-subsection="${escapeAttr(key)}" ${checked ? 'checked' : ''} /><span>${escapeHtml(label)}</span></label>`;
}
function dossierBilanEditorHtml() {
  const ue = findUe(dossierUeId);
  return `<textarea class="dossier-bilan-editor" id="dossierBilanText" rows="3" placeholder="Ce qui a marché, ce qui a coincé, à ajuster l'an prochain…">${escapeHtml(ue?.bilan || '')}</textarea>`;
}

function renderDossierUeSummary(ue) {
  const el = $('#dossierUeSummary');
  if (!el) return;
  if (!ue) { el.innerHTML = '<p class="meta">Aucune UE.</p>'; return; }
  const seqs = state.sequences.filter(s => s.ueId === ue.id);
  const sessions = dossierUeSessions(ue);
  const minutes = sessions.reduce((sum, s) => sum + dossierSessionMinutes(s), 0);
  el.innerHTML = `<div class="dossier-ue-card">
    <div class="dossier-ue-code mono">${escapeHtml(ue.code)}</div>
    <div class="dossier-ue-title">${escapeHtml(ue.title)}</div>
    <div class="dossier-ue-meta">${escapeHtml(ue.promotion)} · ${escapeHtml(ue.semester)} · ${seqs.length} séq. · ${sessions.length} séances</div>
    <div class="dossier-ue-meta">${escapeHtml(dossierHoursLabel(minutes) || 'Volume à préciser')}</div>
  </div>`;
}

function renderDossierSectionsList(ue) {
  const el = $('#dossierSectionsList');
  const countEl = $('#dossierSectionsCount');
  if (!el) return;
  if (!ue) { el.innerHTML = ''; if (countEl) countEl.textContent = ''; return; }
  const seqs = state.sequences.filter(s => s.ueId === ue.id);
  const rows = [
    dossierSectionRow('garde', 'Page de garde', { locked: true, hint: 'obligatoire' }),
    dossierSectionRow('intention', 'Intention pédagogique'),
    dossierSectionRow('referentiel', 'Le référentiel interactif', { sub: [
      dossierSubRow('referentielIntitules', 'Intitulés complets'),
      dossierSubRow('referentielCriteres', 'Critères d’évaluation détaillés')
    ] }),
    dossierSectionRow('progression', 'Progression de l’unité'),
    dossierSectionRow('sequences', 'Fiches de séquence', { sub: seqs.length
      ? seqs.map(seq => dossierSubRow(`seq:${seq.id}`, seq.title || 'Séquence sans titre'))
      : ['<p class="meta tight dossier-subrow">Aucune séquence pour cette UE.</p>'] }),
    dossierSectionRow('recapitulatif', 'Récapitulatif des séances'),
    dossierSectionRow('bilan', 'Bilan de l’unité', { hint: 'Jamais inclus par défaut. Vous le sortez pour ce dossier-ci.' }),
    dossierSectionRow('vigilance', 'Points de vigilance', { locked: true, disabled: true, hint: 'Ne sort jamais du logiciel — non désactivable.' })
  ];
  el.innerHTML = rows.join('');
  if (countEl) {
    const checked = ['garde', 'intention', 'referentiel', 'progression', 'sequences', 'recapitulatif', 'bilan'].filter(k => dossierSections[k]).length;
    countEl.textContent = `${checked} / 7`;
  }
}

/* ---- Colonne centrale : Aperçu (Grille / Lecture) ---- */

function renderDossierPreviewGrille(ue, units) {
  const el = $('#dossierPreviewGrille');
  if (!el) return;
  const footerDate = !!$('#dossierOptFooterDate')?.checked;
  const pageOf = !!$('#dossierOptPageOf')?.checked;
  const total = units.length;
  el.innerHTML = ue && !jeSuisEnseignantDeLUe(ue)
    ? '<p class="meta design-not-mine-hint">Vous n’êtes pas enregistré·e comme enseignant·e sur cette UE : son dossier n’est ni affiché ni imprimable.</p>'
    : ue && units.length
      ? units.map((u, i) => `<div class="dossier-thumb">
        <div class="dossier-thumb-page">${dossierPageContentHtml(u, ue, dossierSections, { show: footerDate, pageOf, index: i + 1, total }, total)}</div>
        <div class="dossier-thumb-label">${i + 1} · ${escapeHtml(dossierUnitShortLabel(u))}</div>
      </div>`).join('')
      : '<p class="meta">Choisir une UE et au moins une section.</p>';
}
function renderDossierPreviewLecture(ue, units) {
  const el = $('#dossierPreviewLecture');
  if (!el) return;
  el.innerHTML = ue && !jeSuisEnseignantDeLUe(ue)
    ? '<p class="meta design-not-mine-hint">Vous n’êtes pas enregistré·e comme enseignant·e sur cette UE : son dossier n’est ni affiché ni imprimable.</p>'
    : ue && units.length ? dossierPagesHtml(ue, units) : '<p class="meta">Choisir une UE et au moins une section.</p>';
}

/* ---- Colonne 3 : complétude + manques + impression ---- */

function dossierCompleteness(ue) {
  // Retours #3 (18-19/08/2026) — Cas 1 : les manques révèlent du contenu
  // (titres de séances/séquences) même sans afficher le dossier lui-même.
  if (!ue || !jeSuisEnseignantDeLUe(ue)) return { percent: 0, gaps: [] };
  const sessions = dossierUeSessions(ue);
  const seqs = state.sequences.filter(s => s.ueId === ue.id);
  const gaps = [];
  const noObjectives = sessions.filter(s => !String(s.objectives || '').trim());
  if (noObjectives.length) gaps.push({ label: `${noObjectives.length} séance(s) sans objectifs`, detail: noObjectives.slice(0, 4).map(s => s.title || 'sans titre').join(', '), action: 'Les remplir →', goto: ue.id });
  const toPlace = sessions.filter(isFictiveSession);
  if (toPlace.length) gaps.push({ label: `${toPlace.length} séance(s) à placer`, detail: 'Apparaîtront « à placer » dans le récapitulatif.', action: 'Voir le planning →', goto: ue.id });
  const noCapacity = seqs.filter(s => !(s.capacityCodes || []).length);
  if (noCapacity.length) gaps.push({ label: `${noCapacity.length} séquence(s) sans capacité déclarée`, detail: noCapacity.map(s => s.title || 'sans titre').join(', '), action: 'Les compléter →', goto: ue.id });
  const noDeliverable = seqs.filter(s => !String(s.deliverables || '').trim());
  if (noDeliverable.length) gaps.push({ label: `${noDeliverable.length} séquence(s) sans production attendue`, detail: noDeliverable.map(s => s.title || 'sans titre').join(', '), action: 'Les compléter →', goto: ue.id });
  const bilanMissing = dossierSections.bilan && !String(ue.bilan || '').trim();
  if (bilanMissing) gaps.push({ label: `Bilan de l'unité vide`, detail: 'La page sortira sans texte.', action: 'Le rédiger →', goto: ue.id });
  const checks = [noObjectives, toPlace, noCapacity, noDeliverable, bilanMissing ? [1] : []];
  const failed = checks.filter(a => a.length).length;
  const percent = Math.round(((checks.length - failed) / checks.length) * 100);
  return { percent, gaps };
}

function renderDossierAvantImprimer(ue, units) {
  const total = units.length;
  const nonMienne = ue && !jeSuisEnseignantDeLUe(ue);
  const countEl = $('#dossierPageCount');
  if (countEl) countEl.textContent = nonMienne ? '' : ue ? `${total} page${total > 1 ? 's' : ''} · A4 portrait` : '';
  const { percent, gaps } = dossierCompleteness(ue);
  const barEl = $('#dossierCompleteness');
  if (barEl) {
    barEl.innerHTML = nonMienne
      ? '<p class="meta design-not-mine-hint">Vous n’êtes pas enregistré·e comme enseignant·e sur cette UE.</p>'
      : ue ? `
      <p class="dossier-completeness-label">Le dossier est complet à ${percent} %</p>
      <p class="meta tight">${gaps.length ? `${gaps.length} manque(s) repéré(s). Le dossier s'imprime quand même : les champs vides ne sortent pas.` : 'Aucun manque repéré.'}</p>
      <div class="dossier-completeness-bar"><span style="width:${percent}%"></span></div>` : '';
  }
  const gapsEl = $('#dossierGaps');
  if (gapsEl) {
    gapsEl.innerHTML = gaps.map(g => `<div class="dossier-gap">
      <p>${escapeHtml(g.label)}</p>
      ${g.detail ? `<p class="meta tight">${escapeHtml(g.detail)}</p>` : ''}
      <button type="button" class="link-button" data-dossier-gap-goto="${escapeAttr(g.goto || '')}">${escapeHtml(g.action || 'Voir →')}</button>
    </div>`).join('');
  }
  const printBtn = $('#dossierPrintButton');
  if (printBtn) printBtn.textContent = ue && total ? `Imprimer le dossier — ${total} page${total > 1 ? 's' : ''}` : 'Imprimer le dossier';
  if (printBtn) printBtn.disabled = !ue || !total;
  const pdfBtn = $('#dossierPdfButton');
  if (pdfBtn) pdfBtn.disabled = !ue || !total;
}

function dossierOpenPrintWindow() {
  const ue = findUe(dossierUeId);
  if (!ue) return;
  const units = dossierBuildUnits(ue, dossierSections);
  if (!units.length) return;
  const footerDate = !!$('#dossierOptFooterDate')?.checked;
  const pageOf = !!$('#dossierOptPageOf')?.checked;
  const pagesHtml = dossierPagesHtml(ue, units, { footerDate, pageOf });
  const win = window.open('', '_blank');
  if (!win) { alert('Le navigateur a bloqué l’ouverture de la fenêtre d’impression. Autorisez les pop-ups pour ce site.'); return; }
  win.document.write(`<!doctype html><html lang="fr"><head><meta charset="utf-8"><title>Dossier — ${escapeHtml(ue.code)} ${escapeHtml(ue.title)}</title><style>body{margin:0;background:#e9e6dc}${DOSSIER_PRINT_CSS}@media print{body{background:#fff}.dossier-page{border:none;margin:0}}</style></head><body>${pagesHtml}<script>setTimeout(()=>window.print(),400)<\/script></body></html>`);
  win.document.close();
}

function bindEvents() {
  // Lot 6 — les 5 encarts du Tableau de bord existent dès le HTML et ne sont
  // jamais recréés (contrairement aux arbres Conception/Référentiel, dont le
  // premier rendu passe par restoreOpenKeys via renderDesign() etc.) : leur
  // mémoire ouvert/fermé doit donc être appliquée une seule fois, ici.
  restoreOpenKeys(document, null);

  $$('.tab').forEach(tab => tab.addEventListener('click', () => {
    $$('.tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    $$('.view').forEach(view => view.classList.remove('active-view'));
    $(`#${tab.dataset.view}`).classList.add('active-view');
    // Lot 4 — s'ouvrir sur la semaine en cours à chaque entrée dans l'onglet.
    if (tab.dataset.view === 'gantt') scrollGanttToCurrentWeek();
    // Ajustements #2 [E2.3] (18/08/2026) — même piège : positionner le
    // défilement d'une bande cachée (`display:none`, vue pas encore active)
    // n'a aucun effet tant qu'elle n'est pas mise en page. Refaire le calcul
    // une fois la vue affichée, comme scrollGanttToCurrentWeek juste au-dessus.
    if (tab.dataset.view === 'week') renderWeekStrip();
    // Retours #3 (18-19/08/2026) : l'onglet principal « Référentiel » doit
    // toujours rouvrir sur son sous-onglet Référentiel, pas sur le dernier
    // sous-onglet consulté (Répartition, Ruban…).
    if (tab.dataset.view === 'ruban') setRubanTab('reference');
  }));

  // Chip de capacité (conception pédagogique) -> ouvrir le module correspondant dans le Référentiel.
  document.body.addEventListener('click', (event) => {
    const cap = event.target.closest('[data-capacity-code]');
    if (!cap) return;
    event.preventDefault();
    openReferenceModuleForCapacity(cap.dataset.capacityCode);
  });

  // Écrans mobile : gros boutons de l'Accueil + tout lien « ‹ Retour ».
  // data-mobile-goto vise soit un vrai onglet permanent (Accueil/Ma semaine,
  // on déclenche son vrai clic pour que la nav basse reste synchronisée),
  // soit une vue programmatique sans onglet (À valider, Frais…), auquel cas
  // showMobileScreen() fait la bascule à la main (même geste qu'openMissionView).
  document.body.addEventListener('click', (event) => {
    const goto = event.target.closest('[data-mobile-goto]');
    if (!goto) return;
    const target = goto.dataset.mobileGoto;
    const realTab = $(`.tab[data-view="${target}"]`);
    if (realTab) realTab.click(); else showMobileScreen(target);
  });
  // Écran 15 — puces de filtre de « À valider » mobile.
  document.body.addEventListener('click', (event) => {
    const chip = event.target.closest('[data-mobile-filtre-urgence]');
    if (!chip) return;
    mobileUrgenceFiltre = chip.dataset.mobileFiltreUrgence;
    renderMobileAValider();
  });
  // Écran 17 — tap sur une carte séance/réunion depuis Ma semaine ou À valider
  // mobile : ouvre l'écran mobile dédié (pas d'onglet), pas le gros formulaire
  // desktop directement (celui-ci reste réservé au verbe « Modifier »). Gère
  // aussi ‹/› de Ma semaine (data-dash-week-nav) : PAS ajouté au tableau
  // desktop équivalent (#dashSemaine/#dashProchainement/#urgencesList) pour
  // éviter un double-branchement — dashSemaineOffset reste partagé, on
  // rappelle juste les 3 fonctions de rendu concernées.
  ['#mobileSemaine', '#mobileAValider', '#mobileFaites'].forEach(sel => {
    const zone = $(sel);
    if (!zone) return;
    zone.addEventListener('click', (event) => {
      if (event.target.closest('.room-booked-check, [data-open-mission], [data-bascule-vehicule], [data-bascule-vehicule-retour], [data-mobile-filtre-urgence], [data-mobile-goto]')) return;
      const nav = event.target.closest('[data-dash-week-nav]');
      if (nav) { dashChangerSemaine(Number(nav.dataset.dashWeekNav)); return; }
      const seance = event.target.closest('[data-edit-session]');
      if (seance) return openMobileSeance(seance.dataset.editSession);
      const reunion = event.target.closest('[data-edit-reunion]');
      if (reunion) return openReunionModal((state.reunions || []).find(r => r.id === reunion.dataset.editReunion));
    });
  });
  // Ajustements #6 (22/08/2026) — « Ma semaine » mobile : balayage horizontal
  // pour changer de semaine (balayer vers la gauche = semaine suivante, comme
  // demandé), en plus des boutons ‹/›. Seuil de 60px et dx nettement plus
  // marqué que dy pour ne pas se déclencher sur un simple scroll vertical.
  (() => {
    const zone = $('#mobileSemaine');
    if (!zone) return;
    let startX = null, startY = null;
    zone.addEventListener('touchstart', (event) => {
      const t = event.changedTouches[0];
      startX = t.clientX; startY = t.clientY;
    }, { passive: true });
    zone.addEventListener('touchend', (event) => {
      if (startX === null) return;
      const t = event.changedTouches[0];
      const dx = t.clientX - startX, dy = t.clientY - startY;
      startX = null;
      if (Math.abs(dx) < 60 || Math.abs(dx) < Math.abs(dy) * 1.5) return;
      dashChangerSemaine(dx < 0 ? 1 : -1);
    }, { passive: true });
  })();
  // Écran 17 — verbe « ✓ Faite »/« Marquer faite ».
  document.body.addEventListener('click', (event) => {
    const btn = event.target.closest('[data-mobile-toggle-realisee]');
    if (!btn) return;
    const s = findSession(btn.dataset.mobileToggleRealisee);
    if (!s) return;
    s.realisee = !s.realisee;
    saveData(s.realisee ? 'Séance marquée faite' : 'Séance remise à traiter');
  });
  // Écran 17 — verbe « ✎ Annoter » : amène au champ notes déjà affiché plus bas.
  document.body.addEventListener('click', (event) => {
    if (!event.target.closest('[data-mobile-annoter]')) return;
    const champ = $('#mobileSeanceNotes');
    if (!champ) return;
    champ.scrollIntoView({ block: 'center', behavior: 'smooth' });
    champ.focus();
  });
  // Écran 17 — notes internes/bilan : autosave (même mécanique que #weekNotes).
  document.body.addEventListener('input', (event) => {
    if (event.target.id !== 'mobileSeanceNotes') return;
    const statusEl = $('#mobileSeanceNotesStatus');
    if (statusEl) statusEl.textContent = 'Modifié…';
    clearTimeout(mobileSeanceNotesTimer);
    mobileSeanceNotesTimer = setTimeout(persistMobileSeanceNotes, 800);
  });
  document.body.addEventListener('blur', (event) => {
    if (event.target.id !== 'mobileSeanceNotes') return;
    clearTimeout(mobileSeanceNotesTimer);
    persistMobileSeanceNotes();
  }, true);

  // Onglets de module (M4 / M5).
  $$('[data-ref-module]').forEach(btn => btn.addEventListener('click', () => {
    selectedReferenceModule = btn.dataset.refModule;
    refReadSection = ''; // redémarre sur la 1re capacité du nouveau module
    const countEl = $('#refmodCount'); if (countEl) countEl.textContent = '';
    const input = $('#rubanUnifiedSearch'); if (input) input.value = '';
    renderReferenceModule();
  }));
  // Barre latérale du référentiel : Général / une capacité / une annexe, ou —
  // sous la capacité affichée — une de ses sous-parties (ancre, pas de re-rendu).
  $('#refreadToc')?.addEventListener('click', (event) => {
    const jump = event.target.closest('[data-refread-jump]');
    if (jump) {
      $('#' + CSS.escape(jump.dataset.refreadJump))?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    const item = event.target.closest('[data-refread-section]');
    if (!item) return;
    refReadSection = item.dataset.refreadSection;
    renderReferenceModule();
  });
  // « Chez vous » : ouvrir la séquence réelle rattachée à la capacité affichée.
  $('#refreadChezVous')?.addEventListener('click', (event) => {
    const seqBtn = event.target.closest('[data-edit-sequence]');
    if (seqBtn) openSequenceModal(findSequence(seqBtn.dataset.editSequence));
  });
  // Recherche unifiée (écran 8) : débounce, routée selon le sous-onglet actif —
  // « reference » cherche dans le module (refmodSearch), « repartition » filtre
  // le Ruban/la Répartition (renderRuban) ; inerte ailleurs (champ désactivé par
  // setRubanTab).
  let rubanSearchTimer;
  $('#rubanUnifiedSearch')?.addEventListener('input', (event) => {
    clearTimeout(rubanSearchTimer);
    const value = event.target.value;
    rubanSearchTimer = setTimeout(() => {
      if (rubanTab === 'reference') refmodSearch(value);
      else if (rubanTab === 'repartition') renderRuban();
    }, 180);
  });
  $('#refmodExpand')?.addEventListener('click', refmodExpandAll);
  $('#refmodCollapse')?.addEventListener('click', refmodCollapseAll);
  mesurerBandeauCollant();
  $('#bannerMobileBack')?.addEventListener('click', mobileGoBack);
  window.addEventListener('resize', updateMobileBannerBack);
  updateMobileBannerBack();
  $('#refmodClear')?.addEventListener('click', () => {
    const input = $('#rubanUnifiedSearch'); if (input) input.value = '';
    refmodClearMarks();
    const countEl = $('#refmodCount'); if (countEl) countEl.textContent = '';
  });

  // Écran 11 — Dossier
  $('#dossierMineFilter')?.addEventListener('change', renderDossier);
  $('#dossierUeSelect')?.addEventListener('change', (event) => {
    dossierUeId = event.target.value;
    resetDossierSections(findUe(dossierUeId));
    renderDossier();
  });
  $('#dossierSectionsList')?.addEventListener('change', (event) => {
    const mainKey = event.target.dataset.dossierSection;
    if (mainKey) {
      if (mainKey === 'garde' || mainKey === 'vigilance') { event.target.checked = mainKey === 'garde'; return; }
      dossierSections[mainKey] = event.target.checked;
      renderDossier();
      return;
    }
    const subKey = event.target.dataset.dossierSubsection;
    if (!subKey) return;
    if (subKey.startsWith('seq:')) {
      const id = subKey.slice(4);
      if (event.target.checked) dossierSections.sequenceIds.add(id); else dossierSections.sequenceIds.delete(id);
    } else {
      dossierSections[subKey] = event.target.checked;
    }
    renderDossier();
  });
  // Capture:true — un <textarea> ne fait pas remonter « blur » en bulle.
  $('#dossierSectionsList')?.addEventListener('blur', (event) => {
    if (event.target?.id !== 'dossierBilanText') return;
    const ue = findUe(dossierUeId);
    if (!ue) return;
    const value = event.target.value;
    if ((ue.bilan || '') === value) return;
    ue.bilan = value;
    saveData('Bilan de l’unité enregistré');
  }, true);
  $$('[data-dossier-view]').forEach(btn => btn.addEventListener('click', () => {
    dossierViewMode = btn.dataset.dossierView;
    $$('[data-dossier-view]').forEach(b => { b.classList.toggle('active', b === btn); b.setAttribute('aria-pressed', String(b === btn)); });
    const grille = $('#dossierPreviewGrille'), lecture = $('#dossierPreviewLecture');
    if (grille) grille.hidden = dossierViewMode !== 'grille';
    if (lecture) lecture.hidden = dossierViewMode !== 'lecture';
  }));
  $('#dossierOptFooterDate')?.addEventListener('change', renderDossier);
  $('#dossierOptPageOf')?.addEventListener('change', renderDossier);
  $('#dossierGaps')?.addEventListener('click', (event) => {
    const btn = event.target.closest('[data-dossier-gap-goto]');
    if (!btn?.dataset.dossierGapGoto) return;
    designSelectedUeId = btn.dataset.dossierGapGoto;
    $('.tab[data-view="design"]')?.click();
    renderDesign();
  });
  $('#dossierPrintButton')?.addEventListener('click', dossierOpenPrintWindow);
  $('#dossierPdfButton')?.addEventListener('click', dossierOpenPrintWindow);

  // Écran 13 — Ordre de mission (atteint depuis une ligne Urgences, pas un onglet).
  document.body.addEventListener('click', (event) => {
    const open = event.target.closest('[data-open-mission]');
    if (!open) return;
    const [kind, id] = open.dataset.openMission.split(':');
    openMissionView(kind, id);
  });
  // Bascule rapide « véhicule établissement indisponible → personnel »
  // (retours 17/08/2026) : évite de rouvrir toute la fiche pour changer le
  // menu Déplacement quand la réservation échoue.
  document.body.addEventListener('click', (event) => {
    const btn = event.target.closest('[data-bascule-vehicule]');
    if (!btn) return;
    const [source, id] = btn.dataset.basculeVehicule.split(':');
    const entity = source === 'reunion' ? (state.reunions || []).find(r => r.id === id) : findSession(id);
    if (!entity) return;
    entity.deplacement = 'personnel';
    entity.vehicleBooked = false;
    saveData('Basculé en véhicule personnel');
  });
  document.body.addEventListener('click', (event) => {
    const btn = event.target.closest('[data-bascule-vehicule-retour]');
    if (!btn) return;
    const [source, id] = btn.dataset.basculeVehiculeRetour.split(':');
    const entity = source === 'reunion' ? (state.reunions || []).find(r => r.id === id) : findSession(id);
    if (!entity) return;
    entity.deplacement = 'etablissement';
    saveData('Repassé en véhicule de l’établissement');
  });
  $('#missionBackButton')?.addEventListener('click', closeMissionView);
  // Un seul écouteur « change » (pas blur) pour tous les champs du document :
  // évite le double déclenchement blur+change sur les <input type="date">.
  $('#missionDocument')?.addEventListener('change', (event) => {
    const el = event.target.closest('[data-mission-field]');
    if (!el) return;
    const estCase = el.tagName === 'INPUT' && el.type === 'checkbox';
    missionSetField(el.dataset.missionField, estCase ? el.checked : el.value);
    saveData('Ordre de mission enregistré');
  });
  $('#missionDocument')?.addEventListener('click', (event) => {
    if (event.target.closest('#missionAddAccompagnant')) {
      const entity = missionEntity(); if (!entity) return;
      ensureMissionDetail(entity).accompagnants.push({ nom: '', fonction: '' });
      renderMissionView();
      return;
    }
    const remove = event.target.closest('[data-mission-remove-accompagnant]');
    if (remove) {
      const entity = missionEntity(); if (!entity) return;
      const detail = ensureMissionDetail(entity);
      detail.accompagnants.splice(Number(remove.dataset.missionRemoveAccompagnant), 1);
      renderMissionView();
      saveData('Ordre de mission enregistré');
      return;
    }
    if (event.target.closest('#missionSignatureUpload')) {
      $('#missionSignatureFile')?.click();
      return;
    }
  });
  $('#missionDocument')?.addEventListener('change', (event) => {
    if (event.target.id !== 'missionSignatureFile') return;
    const file = event.target.files?.[0];
    if (file) missionUploaderSignature(file);
  });
  $('#missionAddDestinataire')?.addEventListener('click', () => {
    const entity = missionEntity(); if (!entity) return;
    const email = window.prompt('Adresse e-mail à ajouter :', '');
    if (!email || !email.trim()) return;
    const detail = ensureMissionDetail(entity);
    detail.destinataires.push(email.trim());
    memoriserMissionDestinataires(detail.destinataires);
    renderMissionView();
  });
  $('#missionDestinatairesList')?.addEventListener('click', (event) => {
    const btn = event.target.closest('[data-mission-remove-destinataire]');
    if (!btn) return;
    const entity = missionEntity(); if (!entity) return;
    const detail = ensureMissionDetail(entity);
    detail.destinataires.splice(Number(btn.dataset.missionRemoveDestinataire), 1);
    memoriserMissionDestinataires(detail.destinataires);
    renderMissionView();
  });
  $('#missionPdfButton')?.addEventListener('click', missionOpenPrintWindow);
  $('#missionSendButton')?.addEventListener('click', missionSendMail);
  missionChargerSignature();

  // Ruban pédagogique
  // Écran 8 — sous-onglets Référentiel & Ruban.
  $$('[data-ruban-tab]').forEach(btn => btn.addEventListener('click', () => setRubanTab(btn.dataset.rubanTab)));
  // Lot F — sous-onglet « PDF d'origine » : clic sur un document de la sidebar.
  $('#pdfLibToc')?.addEventListener('click', (event) => {
    const btn = event.target.closest('[data-pdf-doc]');
    if (!btn) return;
    pdfLibSelected = btn.dataset.pdfDoc;
    renderPdfLibrary();
  });

  // Créneaux de cours type
  $$('[data-creneaux-period]').forEach(btn => btn.addEventListener('click', () => {
    creneauxPeriod = btn.dataset.creneauxPeriod;
    renderCreneaux();
  }));
  $('#creneauxTeacherFilter')?.addEventListener('change', e => { creneauxTeacherFilter = e.target.value; renderCreneaux(); });
  $('#creneauxGrids')?.addEventListener('click', async (event) => {
    const del = event.target.closest('[data-del-template]');
    if (del) {
      event.stopPropagation();
      if (!confirm('Supprimer ce créneau type ?')) return;
      state.weekTemplates = state.weekTemplates.filter(t => t.id !== del.dataset.delTemplate);
      await saveData('Créneau type supprimé');
      return;
    }
    const edit = event.target.closest('[data-edit-template]');
    if (edit) return openTemplateModal(findTemplateSlot(edit.dataset.editTemplate));
    const create = event.target.closest('[data-create-template]');
    if (create) return openTemplateModal(null, JSON.parse(create.dataset.createTemplate));
  });
  $('#templateForm')?.addEventListener('submit', saveTemplateSlot);
  $('#templateUe')?.addEventListener('change', () => {
    toggleTemplateFreeCode();
    const ueId = $('#templateUe').value;
    if (ueId && ueId !== '__free__') {
      const ue = findUe(ueId);
      if (ue && $('#templatePromotion')) $('#templatePromotion').value = ue.promotion; // la promo suit l'UE
      const colorEl = $('#templateColor');
      if (colorEl && colorEl.dataset.custom !== '1') colorEl.value = ueColor(ueId);
    }
  });
  $('#templatePromotion')?.addEventListener('change', () => {
    // Si une UE liée d'une autre promo est sélectionnée, on la désélectionne (cohérence).
    const ueId = $('#templateUe').value;
    if (ueId && ueId !== '__free__' && findUe(ueId)?.promotion !== $('#templatePromotion').value) {
      $('#templateUe').value = '';
      toggleTemplateFreeCode();
    }
  });
  $('#cancelTemplateButton')?.addEventListener('click', () => $('#templateDialog')?.close());
  $('#closeTemplateModal')?.addEventListener('click', () => $('#templateDialog')?.close());
  $('#deleteTemplateButton')?.addEventListener('click', deleteTemplateSlot);
  $('#templateColorAuto')?.addEventListener('click', () => {
    const colorEl = $('#templateColor');
    if (!colorEl) return;
    const ueId = $('#templateUe').value;
    colorEl.value = (ueId && ueId !== '__free__') ? ueColor(ueId) : '#9aa0ad';
    colorEl.dataset.custom = '';
  });
  $('#templateColor')?.addEventListener('input', (e) => { e.target.dataset.custom = '1'; });
  $('#rubanTeacherFilter')?.addEventListener('change', e => { rubanTeacher = e.target.value; renderRuban(); });
  $('#repartitionMineToggle')?.addEventListener('change', () => renderRuban());

  // Écran 8 — Planning étudiant.
  $$('#rubanTabEtudiant [data-student-promo]').forEach(btn => btn.addEventListener('click', () => {
    studentPlanningPromo = btn.dataset.studentPromo;
    renderStudentPlanning();
  }));
  $$('#rubanTabEtudiant [data-student-period]').forEach(btn => btn.addEventListener('click', () => {
    studentPlanningPeriod = btn.dataset.studentPeriod;
    renderStudentPlanning();
  }));
  $('#studentMineToggle')?.addEventListener('change', () => renderStudentPlanning());
  $('#studentPlanningGrid')?.addEventListener('click', (event) => {
    const del = event.target.closest('[data-del-student-slot]');
    if (del) {
      event.stopPropagation();
      if (!confirm('Supprimer ce cours ?')) return;
      state.studentWeekTemplate = state.studentWeekTemplate.filter(t => t.id !== del.dataset.delStudentSlot);
      saveData('Cours (planning étudiant) supprimé');
      return;
    }
    const edit = event.target.closest('[data-edit-student-slot]');
    if (edit) return openStudentSlotModal(findStudentSlot(edit.dataset.editStudentSlot));
    const create = event.target.closest('[data-create-student-slot]');
    if (create) return openStudentSlotModal(null, JSON.parse(create.dataset.createStudentSlot));
  });
  $('#studentSlotForm')?.addEventListener('submit', saveStudentSlot);
  $('#studentSlotUe')?.addEventListener('change', () => {
    toggleStudentSlotFreeCode();
    const ueId = $('#studentSlotUe').value;
    if (ueId && ueId !== '__free__') {
      const colorEl = $('#studentSlotColorInput');
      if (colorEl && colorEl.dataset.custom !== '1') {
        colorEl.value = ueColor(ueId);
        syncColorSwatchActive('#studentSlotColorSwatches', '#studentSlotColorInput');
      }
    }
  });
  $('#cancelStudentSlotButton')?.addEventListener('click', () => $('#studentSlotDialog')?.close());
  $('#closeStudentSlotModal')?.addEventListener('click', () => $('#studentSlotDialog')?.close());
  $('#deleteStudentSlotButton')?.addEventListener('click', deleteStudentSlot);
  $('#studentSlotColorInput')?.addEventListener('input', (event) => {
    event.target.dataset.custom = '1';
    syncColorSwatchActive('#studentSlotColorSwatches', '#studentSlotColorInput');
  });
  $('#studentSlotColorAuto')?.addEventListener('click', () => {
    const el = $('#studentSlotColorInput');
    if (!el) return;
    el.dataset.custom = '0';
    const ueId = $('#studentSlotUe').value;
    el.value = (ueId && ueId !== '__free__') ? ueColor(ueId) : '#9aa0ad';
    syncColorSwatchActive('#studentSlotColorSwatches', '#studentSlotColorInput');
  });

  /* Clics Ruban : ✎ (composition d'UE), ↺ (rétablir une UE), capacité (→ référentiel).
     Écouteur limité à la vue Ruban, et non posé sur <body> : `data-edit-ue` sert
     AUSSI dans la Conception pédagogique depuis le lot C, où le corps de carte le
     porte. Sur <body>, ce gestionnaire happait donc tout clic dans une carte d'UE
     — y compris sur le sommaire d'une séquence, dont il annulait le
     déplier/replier par son preventDefault(). */
  $('#ruban')?.addEventListener('click', (event) => {
    const editUe = event.target.closest('[data-edit-ue]');
    if (editUe) { event.preventDefault(); openUeCapsModal(editUe.dataset.editUe); return; }
    const cap = event.target.closest('[data-ruban-cap]');
    if (!cap) return;
    event.preventDefault();
    openReferenceModuleForCapacity(cap.dataset.rubanCap);
  });
  // Modale de composition d'une UE — seule voie de modification du Ruban.
  $('#addUeCapRow')?.addEventListener('click', () => $('#ueCapsRows')?.insertAdjacentHTML('beforeend', ueCapRowHtml({})));
  $('#ueCapsRows')?.addEventListener('click', (event) => {
    const rm = event.target.closest('[data-remove-cap-row]');
    if (rm) rm.closest('.ue-cap-row')?.remove();
  });
  $('#ueCapsForm')?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const ueCode = $('#ueCapsCode').value;
    if (!ueCode) return;
    state.rubanUeCaps = state.rubanUeCaps || {};
    state.rubanUeCaps[ueCode] = readUeCapsRows().map(normalizeCap);
    cleanupUeOverride(ueCode);
    $('#ueCapsDialog').close();
    await saveData('Capacités de l’UE enregistrées');
  });
  $('#cancelUeCapsButton')?.addEventListener('click', () => $('#ueCapsDialog').close());
  $('#closeUeCapsModal')?.addEventListener('click', () => $('#ueCapsDialog').close());

  $('#printButton')?.addEventListener('click', () => window.print());
  $('#exportDataBtn')?.addEventListener('click', () => exportData());
  $('#importDataBtn')?.addEventListener('click', () => $('#importDataInput')?.click());
  $('#importDataInput')?.addEventListener('change', (event) => {
    const file = event.target.files && event.target.files[0];
    importDataFromFile(file);
    event.target.value = '';
  });
  // Bandeau (mockup) — statut de synchro + « Sauvegarder ». Le bouton
  // « Recharger » vivait auparavant dans js/auth.js (recréé à chaque
  // connexion) : élément statique désormais, un seul branchement ici.
  $('#btn-recharger')?.addEventListener('click', (event) => {
    const bouton = event.currentTarget;
    if (bouton.disabled) return;
    bouton.disabled = true;
    Promise.resolve(window.OC_APP?.recharger()).finally(() => { bouton.disabled = false; });
  });
  // « Réessayer » (visible seulement après une erreur, voir setSaveStatus)
  // force un réenregistrement complet (forcer:true, comme un import).
  $('#btn-sauvegarder')?.addEventListener('click', (event) => {
    const bouton = event.currentTarget;
    bouton.disabled = true;
    saveData('Enregistré', { forcer: true }).finally(() => { bouton.disabled = false; });
  });
  $('#printWeekButton')?.addEventListener('click', () => printWeekPlanning());
  $('#addConstraintDashboardButton').addEventListener('click', (e) => { e.stopPropagation(); openConstraintModal(); });
  $('#addConstraintSemesterButton')?.addEventListener('click', () => openConstraintModal());
  // Refonte écran 3 (16/08/2026) — plus de boutons de création dans Progression :
  // « + Vacances » reste accessible depuis Tableau de bord/Planning hebdo,
  // « + Séquence »/« + Séance » depuis Conception (édition en place).
  $('#weekSelect').addEventListener('change', (event) => { selectedWeek = event.target.value; renderPlanning(); });
  $('#weekStrip')?.addEventListener('click', (event) => {
    const btn = event.target.closest('[data-set-week]');
    if (!btn) return;
    selectedWeek = btn.dataset.setWeek;
    renderPlanning();
  });
  // Ajustements #2 [E2.2] (18/08/2026) — « un défilement par touches droite et
  // gauche du clavier est-il possible ? » : déplace le focus d'une case à
  // l'autre (comme un groupe de boutons classique) et la ramène dans la zone
  // visible ; le clic/Entrée sélectionne déjà la semaine, inchangé.
  $('#weekStrip')?.addEventListener('keydown', (event) => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    const tiles = [...$('#weekStrip').querySelectorAll('.week-strip-tile')];
    const i = tiles.indexOf(document.activeElement);
    if (i < 0) return;
    const suivante = tiles[i + (event.key === 'ArrowRight' ? 1 : -1)];
    if (!suivante) return;
    event.preventDefault();
    suivante.focus();
    suivante.scrollIntoView({ inline: 'nearest', block: 'nearest' });
  });
  // La bascule de période ne fait que parcourir la bande : elle ne touche pas
  // à la semaine affichée dans les grilles (renderWeekStrip seul, pas renderPlanning).
  $('#weekStripPeriodSwitch')?.addEventListener('click', (event) => {
    const btn = event.target.closest('[data-week-period]');
    if (!btn) return;
    weekStripPeriod = btn.dataset.weekPeriod;
    renderWeekStrip();
    // Retours #4 (18/08/2026) : le bandeau promo (code couleur semestre) doit
    // suivre l'onglet de période coché, même si la grille affichée ne change
    // pas tant qu'aucune semaine précise n'est cliquée.
    applyScheduleTitleColors();
  });
  $('#weekMaskToggle')?.addEventListener('change', (event) => {
    weekMaskActive = event.target.checked;
    renderPlanning();
  });
  // Notes de semaine — enregistrement automatique (comme « À faire » / « Dev »)
  let weekNotesTimer;
  const persistWeekNotes = async () => {
    if (!state) return;
    const value = $('#weekNotes')?.value ?? '';
    if (value === (state.weekNotes[selectedWeek] || '')) return;
    state.weekNotes[selectedWeek] = value;
    // Autosave silencieux (pas de re-render → la vue ne « saute » pas)
    try { await saveData('Notes de semaine enregistrées', { rerender: false }); setWeekNotesStatus('Enregistré'); }
    catch (e) { setWeekNotesStatus('Erreur d’enregistrement'); }
  };
  $('#weekNotes')?.addEventListener('input', () => {
    setWeekNotesStatus('Modifié…');
    clearTimeout(weekNotesTimer);
    weekNotesTimer = setTimeout(persistWeekNotes, 800);
  });
  $('#weekNotes')?.addEventListener('blur', () => { clearTimeout(weekNotesTimer); persistWeekNotes(); });

  // « À faire » et « Amélioration de l'appli » (voir renderChecklist) : ajout
  // par Entrée, coche/décoche et suppression par délégation sur chaque liste.
  wireChecklist('todo');
  wireChecklist('devnotes');
  wireChecklist('mobiletodo');

  $('#weekBacklogScope')?.addEventListener('change', e => { weekBacklogScope = e.target.value; renderWeekBacklog(); });
  $('#weekBacklogUeFilter')?.addEventListener('change', e => { weekBacklogUeFilter = e.target.value; renderWeekBacklog(); });

  // Sidebar de la Conception (écran 2) : promotion (vrai sélecteur, REGLES.md #21),
  // estompage permanent des UE des collègues, sélection d'UE, sous-onglets du
  // panneau de détail.
  $$('.promo-switch-btn').forEach(btn => btn.addEventListener('click', () => {
    designPromotionFilter = btn.dataset.designPromo;
    designSelectedUeId = '';
    renderDesign();
  }));
  $('#designSidebarList')?.addEventListener('click', (event) => {
    const row = event.target.closest('[data-select-ue]');
    if (!row) return;
    designSelectedUeId = row.dataset.selectUe;
    renderDesign();
  });
  $$('.design-subtab').forEach(btn => btn.addEventListener('click', () => setDesignTab(btn.dataset.designTab)));
  $('#ganttPromoSwitch')?.addEventListener('click', (event) => {
    const btn = event.target.closest('[data-gantt-promo]');
    if (!btn) return;
    ganttPromo = btn.dataset.ganttPromo;
    ganttSemester = null; // recalculé par renderGantt() depuis la saison courante
    ganttSelectedUeId = '';
    renderGantt();
  });
  $('#ganttSemesterSwitch')?.addEventListener('click', (event) => {
    const btn = event.target.closest('[data-gantt-semester]');
    if (!btn) return;
    ganttSemester = btn.dataset.ganttSemester;
    ganttSelectedUeId = '';
    renderGantt();
  });
  $('#ganttStackedToggle')?.addEventListener('change', (event) => { ganttStacked = event.target.checked; renderGantt(); });
  // Retours #4 (18/08/2026) — le texte « hors fenêtre » ne se recalculait
  // qu'au clic sur l'onglet Progression (scrollGanttToCurrentWeek) : un
  // défilement manuel de la frise (barre de défilement, molette, flèches)
  // le laissait ensuite périmé. Recalcul à chaque scroll (rAF pour ne pas
  // spammer le calcul de mise en page pendant le défilement).
  let ganttHorsFenetreRaf = null;
  $('#ganttSequencesScroll')?.addEventListener('scroll', () => {
    if (ganttHorsFenetreRaf) return;
    ganttHorsFenetreRaf = requestAnimationFrame(() => {
      ganttHorsFenetreRaf = null;
      computeGanttHorsFenetre(ganttLastUes, ganttLastWeeks);
    });
  });
  $('#ganttUeCards')?.addEventListener('click', (event) => {
    const card = event.target.closest('[data-select-gantt-ue]');
    if (!card) return;
    ganttSelectedUeId = card.dataset.selectGanttUe;
    renderGantt();
  });
  $('#exportGanttButton')?.addEventListener('click', () => exportGanttPrint());

  /* Les boutons « + » de la barre de la Conception ont été retirés : ils
     doublonnaient les créations déjà offertes là où elles ont du sens. Seule
     « Créer une UE » n'existait nulle part ailleurs — elle est reprise par la
     bande d'ajout en fin de promotion (data-new-ue). Même logique pour le
     Planning hebdo (17/08, retour Martin) : « + Séance » y doublonnait les
     cases de séance, déjà toutes cliquables pour créer/modifier — retiré. */

  $('#constraintsList').addEventListener('click', (event) => {
    const el = event.target.closest('[data-edit-constraint]');
    if (el) openConstraintModal(findConstraint(el.dataset.editConstraint));
  });

  $('#dashboardBacklog')?.addEventListener('click', (event) => {
    const row = event.target.closest('[data-edit-session]');
    if (row) openSessionModal(findSession(row.dataset.editSession));
  });

  // Retours #3 (18-19/08/2026) : « Les placer dans le planning → » ne
  // réagissait à aucun clic — c'est un frère de #dashboardBacklog (pas un
  // enfant), donc hors de portée du data-goto-view géré plus bas, qui n'écoute
  // que #dashSemaine/#dashProchainement/#urgencesList. Écouteur dédié ici.
  $('.backlog-panel-link[data-goto-view]')?.addEventListener('click', function () {
    $(`.tab[data-view="${this.dataset.gotoView}"]`)?.click();
    $('.week-sidebar')?.scrollIntoView({ block: 'center', behavior: 'smooth' });
  });

  /* « Ma semaine » et « Prochainement » : chaque ligne ouvre sa fiche, et une
     ligne de retard déplie l'encart concerné. Deux écouteurs ciblés plutôt
     qu'un seul sur #dashboard, pour ne pas doubler ceux qui existent déjà sur
     #constraintsList et #dashboardBacklog. */
  // #urgencesList (pile fusionnée) rejoint la liste : ses lignes ouvrent la
  // séance ou la réunion d'origine, c'est là que la case « ordre de mission »
  // se coche pour un ordre de mission ; salle/véhicule passent par la case
  // "reservation" gérée par l'écouteur dédié plus bas.
  ['#dashSemaine', '#dashProchainement', '#urgencesList', '#urgencesFaitesList'].forEach(sel => {
    const zone = $(sel);
    if (!zone) return;
    zone.addEventListener('click', (event) => {
      // Une ligne Urgences porte maintenant data-edit-session/-reunion sur
      // toute sa largeur (clic = ouvrir la fiche) ; la case « Fait »/case de
      // réservation, le lien « Éditer » (ordre de mission) et le × gardent
      // chacun leur propre action et ne doivent pas AUSSI ouvrir la fiche.
      if (event.target.closest('.room-booked-check, [data-open-mission], [data-bascule-vehicule], [data-bascule-vehicule-retour]')) return;
      const nav = event.target.closest('[data-dash-week-nav]');
      if (nav) { dashChangerSemaine(Number(nav.dataset.dashWeekNav)); return; }
      const ouvrir = event.target.closest('[data-ouvrir]');
      if (ouvrir) {
        // « Séances pas encore placées » n'est plus un <details> repliable
        // (toujours visible, colonne de droite) : on y défile simplement.
        const cible = ouvrir.dataset.ouvrir === 'dash:backlog'
          ? $('#backlogPanel')
          : document.querySelector(`details[data-open-key="${ouvrir.dataset.ouvrir}"]`);
        if (cible) {
          if (cible.tagName === 'DETAILS') cible.open = true;
          cible.scrollIntoView({ block: 'center', behavior: 'smooth' });
        }
        return;
      }
      const goto = event.target.closest('[data-goto-view]');
      if (goto) { $(`.tab[data-view="${goto.dataset.gotoView}"]`)?.click(); return; }
      const seance = event.target.closest('[data-edit-session]');
      if (seance) return openSessionModal(findSession(seance.dataset.editSession));
      const reunion = event.target.closest('[data-edit-reunion]');
      if (reunion) return openReunionModal((state.reunions || []).find(r => r.id === reunion.dataset.editReunion));
      const contrainte = event.target.closest('[data-edit-constraint]');
      if (contrainte) return openConstraintModal(findConstraint(contrainte.dataset.editConstraint));
    });
    /* Même geste au clavier : les cartes sont focusables (tabindex + role). */
    zone.addEventListener('keydown', (event) => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      if (event.target.closest('.room-booked-check, [data-open-mission], [data-bascule-vehicule], [data-bascule-vehicule-retour]')) return;
      const carte = event.target.closest('.carte, .retard-liste li, .om-row, .urgence-row, .urgence-verbe[data-edit-session], .urgence-verbe[data-edit-reunion], .col-vide-lien, .bloc-lien');
      if (!carte) return;
      event.preventDefault();
      carte.click();
    });
  });
  /* Lot C — UE et séquences ont chacune un bouton « Modifier » explicite en tête
     de corps ; le bandeau sommaire ne fait que déplier/replier, et les créations
     passent par des tuiles/bandes en creux placées là où elles ont du sens.
     Comme les cartes s'emboîtent (séance dans séquence dans UE), on ne teste pas
     les attributs dans un ordre figé : on cherche l'ancêtre le PLUS PROCHE, si
     bien qu'une tuile « + Séance » d'une séquence ne se confonde jamais avec la
     bande « + Séquence » de l'UE qui la contient. */
  // Écouteur posé sur `.design-detail` (pas seulement `#ueTree`) : les boutons
  // « Modifier l'UE »/export ⎙ vivent maintenant dans l'en-tête du panneau, au
  // dessus des sous-onglets, et les cartes de séance de l'onglet « Séances »
  // (data-edit-session) doivent rester cliquables elles aussi.
  const CIBLES_ARBRE = '[data-edit-session],[data-edit-sequence],[data-edit-ue],[data-new-sequence-ue],[data-new-session-ue],[data-new-session-sequence],[data-new-eil-session],[data-export-ue],[data-export-sequence]';
  $('.design-detail').addEventListener('click', (event) => {
    const cible = event.target.closest(CIBLES_ARBRE);
    if (!cible) return;
    const d = cible.dataset;
    if (d.exportUe) return exportUeProgressionPrint(findUe(d.exportUe));
    if (d.exportSequence) return exportSequencePrint(findSequence(d.exportSequence));
    if (d.newSequenceUe) return openSequenceModal(null, { ueId: d.newSequenceUe });
    if (d.newSessionUe) return openSessionModal(null, { ueId: d.newSessionUe, placementStatus: 'fictif' });
    if (d.newSessionSequence) {
      const seq = findSequence(d.newSessionSequence);
      return openSessionModal(null, { sequenceId: seq.id, ueId: seq.ueId, placementStatus: 'fictif' });
    }
    if (d.newEilSession) {
      const c = findConstraint(d.newEilSession);
      return openSessionModal(null, { constraintId: d.newEilSession, ueId: d.eilUe, promotion: (c?.promotions || [])[0] || '', placementStatus: 'fictif' });
    }
    if (d.editSession) return openSessionModal(findSession(d.editSession));
    if (d.editSequence) return openSequenceModal(findSequence(d.editSequence));
    if (d.editUe) return openUeModal(findUe(d.editUe));
  });

  /* Plus de gestionnaire clavier ici : « Modifier », l'export et les tuiles
     d'ajout sont de vrais <button>, donc déjà atteignables au Tab et
     activables à l'Entrée. Seules les tuiles de séance gardent le leur, posé
     globalement sur .session-card. */

  // Conception — glisser une séance vers une séquence (rattachement) ou vers le
  // bloc « Sans séquence » d'une UE (détachement). Miroir du DnD de la frise.
  $('#ueTree').addEventListener('dragstart', (event) => {
    const card = event.target.closest('[data-drag-session]');
    if (!card) return;
    event.dataTransfer.setData('text/session-id', card.dataset.dragSession);
    event.dataTransfer.effectAllowed = 'move';
    card.classList.add('is-dragging');
    $('#ueTree').classList.add('dragging-session'); // révèle les zones « Sans séquence » vides
  });
  $('#ueTree').addEventListener('dragend', (event) => {
    event.target.closest('[data-drag-session]')?.classList.remove('is-dragging');
    $('#ueTree').classList.remove('dragging-session');
    $$('.seq-drop-hover, .loose-drop-hover').forEach(el => el.classList.remove('seq-drop-hover', 'loose-drop-hover'));
  });
  $('#ueTree').addEventListener('dragover', (event) => {
    const target = event.target.closest('[data-seq-drop], [data-loose-drop]');
    if (!target) return;
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
    const cls = target.dataset.seqDrop ? 'seq-drop-hover' : 'loose-drop-hover';
    $$('.seq-drop-hover, .loose-drop-hover').forEach(el => { if (el !== target) el.classList.remove('seq-drop-hover', 'loose-drop-hover'); });
    target.classList.add(cls);
  });
  $('#ueTree').addEventListener('dragleave', (event) => {
    const target = event.target.closest('[data-seq-drop], [data-loose-drop]');
    if (target && !target.contains(event.relatedTarget)) target.classList.remove('seq-drop-hover', 'loose-drop-hover');
  });
  $('#ueTree').addEventListener('drop', async (event) => {
    const target = event.target.closest('[data-seq-drop], [data-loose-drop]');
    if (!target) return;
    event.preventDefault();
    target.classList.remove('seq-drop-hover', 'loose-drop-hover');
    $('#ueTree').classList.remove('dragging-session');
    const session = findSession(event.dataTransfer.getData('text/session-id'));
    if (!session) return;
    if (target.dataset.seqDrop) return attachSessionToSequence(session, findSequence(target.dataset.seqDrop));
    if (target.dataset.looseDrop) return detachSessionFromSequence(session, target.dataset.looseDrop);
  });


  $('#ganttTimeline')?.addEventListener('click', (event) => {
    const constraintEl = event.target.closest('[data-edit-constraint]');
    if (constraintEl) return openConstraintModal(findConstraint(constraintEl.dataset.editConstraint));
    const sessionEl = event.target.closest('[data-edit-session]');
    if (sessionEl) return openSessionModal(findSession(sessionEl.dataset.editSession));
    const seqEl = event.target.closest('[data-edit-sequence]');
    if (seqEl) return openSequenceModal(findSequence(seqEl.dataset.editSequence));
  });
  $('#ganttTimeline')?.addEventListener('dragstart', (event) => {
    const session = event.target.closest('[data-drag-session]');
    const sequence = event.target.closest('[data-drag-sequence]');
    if (session) event.dataTransfer.setData('text/session-id', session.dataset.dragSession);
    if (sequence) event.dataTransfer.setData('text/sequence-id', sequence.dataset.dragSequence);
    event.dataTransfer.effectAllowed = 'move';
  });
  $('#ganttTimeline')?.addEventListener('dragover', (event) => {
    const target = event.target.closest('[data-timeline-drop], [data-week-drop]');
    if (!target) return;
    event.preventDefault();
    target.classList.add('drop-hover');
  });
  $('#ganttTimeline')?.addEventListener('dragleave', (event) => {
    event.target.closest('[data-timeline-drop], [data-week-drop]')?.classList.remove('drop-hover');
  });
  $('#ganttTimeline')?.addEventListener('drop', async (event) => {
    const target = event.target.closest('[data-timeline-drop], [data-week-drop]');
    if (!target) return;
    event.preventDefault();
    target.classList.remove('drop-hover');
    const sessionId = event.dataTransfer.getData('text/session-id');
    const sequenceId = event.dataTransfer.getData('text/sequence-id');
    if (sessionId && target.dataset.timelineDrop) return moveSessionToTimeline(findSession(sessionId), JSON.parse(target.dataset.timelineDrop));
    if (sequenceId && target.dataset.weekDrop) return moveSequenceToWeek(findSequence(sequenceId), target.dataset.weekDrop);
  });

  $('#planningContainer').addEventListener('click', (event) => {
    const unplace = event.target.closest('[data-unplace-session]');
    if (unplace) { event.stopPropagation(); return unplaceSession(findSession(unplace.dataset.unplaceSession)); }
    const constraintChip = event.target.closest('[data-edit-constraint]');
    if (constraintChip) return openConstraintModal(findConstraint(constraintChip.dataset.editConstraint));
    const eventCell = event.target.closest('[data-session-id]');
    if (eventCell) return openSessionModal(findSession(eventCell.dataset.sessionId));
    const emptyCell = event.target.closest('[data-create]');
    if (emptyCell) {
      const context = JSON.parse(emptyCell.dataset.create);
      return openSessionModal(null, { ...context, placementStatus: 'definitif', forceDefinitive: true, weekId: selectedWeek });
    }
  });

  $('#planningContainer').addEventListener('dragstart', (event) => {
    const item = event.target.closest('[data-drag-session]');
    if (!item) return;
    event.dataTransfer.setData('text/session-id', item.dataset.dragSession);
    event.dataTransfer.effectAllowed = 'move';
    item.classList.add('is-dragging');
  });
  $('#planningContainer').addEventListener('dragend', (event) => {
    event.target.closest('[data-drag-session]')?.classList.remove('is-dragging');
  });

  $('#planningContainer').addEventListener('dragover', (event) => {
    const dropCell = event.target.closest('[data-drop-target]');
    if (!dropCell) return;
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
    $$('.drop-slot.drop-hover').forEach(cell => { if (cell !== dropCell) cell.classList.remove('drop-hover'); });
    dropCell.classList.add('drop-hover');
  });
  $('#planningContainer').addEventListener('dragleave', (event) => {
    const dropCell = event.target.closest('[data-drop-target]');
    if (dropCell && !dropCell.contains(event.relatedTarget)) dropCell.classList.remove('drop-hover');
  });
  $('#planningContainer').addEventListener('drop', async (event) => {
    const dropCell = event.target.closest('[data-drop-target]');
    if (!dropCell) return;
    event.preventDefault();
    dropCell.classList.remove('drop-hover');
    const sessionId = event.dataTransfer.getData('text/session-id');
    const session = findSession(sessionId);
    if (!session) return;
    const context = JSON.parse(dropCell.dataset.dropTarget);
    await placeSessionOnSlot(session, context);
  });

  $('#weekBacklog').addEventListener('click', (event) => {
    const row = event.target.closest('[data-edit-session]');
    if (row) openSessionModal(findSession(row.dataset.editSession));
  });
  $('#weekBacklog').addEventListener('dragstart', (event) => {
    const item = event.target.closest('[data-drag-session]');
    if (!item) return;
    event.dataTransfer.setData('text/session-id', item.dataset.dragSession);
    event.dataTransfer.effectAllowed = 'move';
    item.classList.add('is-dragging');
  });
  $('#weekBacklog').addEventListener('dragend', (event) => {
    event.target.closest('[data-drag-session]')?.classList.remove('is-dragging');
  });
  // C1 — déposer une séance placée sur la zone d'attente la fait ressortir de l'EDT.
  $('#weekBacklog').addEventListener('dragover', (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
    $('#weekBacklog').classList.add('backlog-drop-hover');
  });
  $('#weekBacklog').addEventListener('dragleave', (event) => {
    if (!$('#weekBacklog').contains(event.relatedTarget)) $('#weekBacklog').classList.remove('backlog-drop-hover');
  });
  $('#weekBacklog').addEventListener('drop', async (event) => {
    event.preventDefault();
    $('#weekBacklog').classList.remove('backlog-drop-hover');
    const session = findSession(event.dataTransfer.getData('text/session-id'));
    if (session && !isFictiveSession(session)) await unplaceSession(session);
  });


  $('#sequenceUe').addEventListener('change', () => {
    const ue = findUe($('#sequenceUe').value);
    if (!ue) return;
    $('#sequencePromotion').value = ue.promotion;
    $('#sequenceSemester').value = ue.semester;
    renderSequenceCapacityChoices([], ue);
    // 18/08 — l'UE change le semestre donc la plage de semaines cliquables du calendrier.
    seqCalMonthKey = null;
    renderSequenceCalendar();
  });
  $('#ueCode').addEventListener('input', () => updateUeCapacityPreview(findUeByCode($('#ueCode').value) || { code: $('#ueCode').value, capacities: [] }));
  $('#uePromotion').addEventListener('change', () => updateUeCapacityPreview(findUeByCode($('#ueCode').value) || {}));
  $('#ueSemester').addEventListener('change', () => updateUeCapacityPreview(findUeByCode($('#ueCode').value) || {}));
  ['#sequenceWeekStart', '#sequenceWeekEnd'].forEach(sel => $(sel)?.addEventListener('input', () => { syncSequenceWeeksField(); renderSequenceCalendar(); }));
  // 18/08 — calendrier de semaines (exception assumée à REGLES.md #22 pour cet écran).
  $('#sequenceCalendar')?.addEventListener('click', (event) => {
    const nav = event.target.closest('[data-seqcal-nav]');
    if (nav) { if (!nav.disabled) moveSequenceCalendarMonth(nav.dataset.seqcalNav === 'next' ? 1 : -1); return; }
    const btn = event.target.closest('[data-seqpick-week]');
    if (!btn) return;
    const key = btn.dataset.seqpickWeek; // clé lundi (AAAA-MM-JJ) de la semaine cliquée
    const semester = $('#sequenceSemester')?.value || 'Semestre 1';
    const weeks = weeksForSemesterSpan(semester);
    const weekOfKey = (k) => weeks.find(x => { const [mon] = weekDateRange(x); return mon && isoKey(mon) === k; });
    const keyOfField = (fieldValue) => {
      const m = /\d{1,2}/.exec(fieldValue || '');
      const w = m ? weeks.find(x => weekNumberOf(x) === Number(m[0])) : null;
      return w ? isoKey(weekDateRange(w)[0]) : '';
    };
    const clickedWeek = weekOfKey(key);
    if (!clickedWeek) return;
    const s = keyOfField($('#sequenceWeekStart')?.value);
    const e = keyOfField($('#sequenceWeekEnd')?.value);
    if (!s || (s && e)) {
      // (re)commence une plage.
      setSequenceWeekFieldsFromWeek(clickedWeek.id, 'start');
      $('#sequenceWeekEnd').value = '';
    } else if (key < s) {
      // Clic avant le début déjà posé → on inverse (le clic devient le début).
      const startField = $('#sequenceWeekStart').value;
      setSequenceWeekFieldsFromWeek(clickedWeek.id, 'start');
      $('#sequenceWeekEnd').value = startField;
    } else {
      setSequenceWeekFieldsFromWeek(clickedWeek.id, 'end');
    }
    syncSequenceWeeksField();
    renderSequenceCalendar();
  });
  $('#sequenceHoursMinus')?.addEventListener('click', () => {
    const input = $('#sequenceHours');
    input.value = String(Math.max(0, (parseInt(input.value, 10) || 0) - 1));
  });
  $('#sequenceHoursPlus')?.addEventListener('click', () => {
    const input = $('#sequenceHours');
    input.value = String((parseInt(input.value, 10) || 0) + 1);
  });
  $('#sequenceAssessmentTypeButtons')?.addEventListener('click', (event) => {
    const btn = event.target.closest('[data-assessment-type]');
    if (!btn) return;
    $$('#sequenceAssessmentTypeButtons button').forEach(b => b.classList.toggle('active', b === btn));
    $('#sequenceAssessmentType').value = btn.dataset.assessmentType;
  });
  $('#sequenceCapacityChoices')?.addEventListener('change', () => updateSequenceCapacityDetails());
  // Écran 12 — sélecteur de créneaux libres de la modale séance.
  $('#sessionSlotWeekPrev')?.addEventListener('click', () => {
    const idx = state.weeks.findIndex(w => w.id === sessionSlotPickerWeekId);
    if (idx > 0) { sessionSlotPickerWeekId = state.weeks[idx - 1].id; renderSessionSlotPicker(); }
  });
  $('#sessionSlotWeekNext')?.addEventListener('click', () => {
    const idx = state.weeks.findIndex(w => w.id === sessionSlotPickerWeekId);
    if (idx >= 0 && idx < state.weeks.length - 1) { sessionSlotPickerWeekId = state.weeks[idx + 1].id; renderSessionSlotPicker(); }
  });
  $('#sessionSlotGrid')?.addEventListener('click', (event) => {
    const btn = event.target.closest('.slot-cell');
    if (!btn) return;
    applySlotClick(Number(btn.dataset.slotDay), Number(btn.dataset.slotIndex));
    syncSessionSlotPickerActive();
    renderSessionSlotSummary();
  });
  $('#sessionSlotSummary')?.addEventListener('click', (event) => {
    const btn = event.target.closest('[data-quick-duration]');
    if (!btn) return;
    applyQuickDuration(Number(btn.dataset.quickDuration));
    syncSessionSlotPickerActive();
    renderSessionSlotSummary();
  });
  $$('.slot-picker-options-fixed .slot-option').forEach(btn => btn.addEventListener('click', () => {
    sessionSlotChoice = { type: btn.dataset.slotChoice };
    syncSessionSlotPickerActive();
    renderSessionSlotSummary();
  }));
  $('#sessionPromotion')?.addEventListener('change', renderSessionSlotPicker);
  $('#sessionNoSequence')?.addEventListener('change', (event) => {
    const seqSelect = $('#sessionSequence');
    if (!seqSelect) return;
    if (event.target.checked) {
      seqSelect.dataset.prev = seqSelect.value;
      seqSelect.value = '';
      seqSelect.disabled = true;
    } else {
      seqSelect.disabled = false;
      if (seqSelect.dataset.prev) seqSelect.value = seqSelect.dataset.prev;
    }
  });
  /* Lot G — changer d'UE vidait les capacités cochées EN SILENCE. Remettre à
     zéro est juste (les codes de l'ancienne UE n'existent pas dans la nouvelle),
     mais le faire sans un mot se lit comme une perte de saisie — même leçon
     qu'au lot D avec le repli silencieux des UE par défaut. On prévient donc,
     et on garde la sélection de côté : revenir à l'UE précédente la retrouve,
     le temps que la modale reste ouverte. */
  $('#sessionUe').addEventListener('change', () => {
    const cochees = selectedCheckboxValues('#sessionCapacityChoices');
    if (ueCapacitesPrecedente && cochees.length) capacitesParUe[ueCapacitesPrecedente] = cochees;
    const nouvelleUe = $('#sessionUe').value;
    const retrouvees = capacitesParUe[nouvelleUe] || [];
    const resetHint = $('#sessionCapacityResetHint');
    if (resetHint) {
      resetHint.hidden = !(cochees.length && !retrouvees.length);
      resetHint.textContent = 'Les capacités cochées appartenaient à l’UE précédente : elles ont été décochées. Revenir à cette UE les retrouvera.';
    }
    ueCapacitesPrecedente = nouvelleUe;
    refreshSessionSequenceSelect('');
    renderSessionCapacityChoices(retrouvees, findUe(nouvelleUe));
  });
  $('#sessionSequence').addEventListener('change', () => {
    const val = $('#sessionSequence').value;
    // Lot K — rattachement à une semaine thématique (EIL) : pré-cibler la promo et
    // la semaine de la contrainte (l'UE reste celle choisie = UE porteuse).
    if (val.startsWith('eil:')) {
      const c = findConstraint(val.slice(4));
      if (c) {
        if ((c.promotions || []).length === 1) $('#sessionPromotion').value = c.promotions[0];
        const wk = weekForIsoDate(c.start);
        if (wk && $('#sessionWeek')) $('#sessionWeek').value = wk.id;
      }
      return;
    }
    const seq = findSequence(val);
    if (!seq) return;
    // Lot 3.3 — ne pas écraser une sélection de capacités déjà cochée par
    // l'utilisateur quand on corrige juste le rattachement à une séquence de
    // la même UE ; ne repartir de zéro (avec un mot à l'écran) que si l'UE
    // change réellement, puisque les anciens codes ne sont alors plus valides.
    const ueChanges = $('#sessionUe').value !== seq.ueId;
    const keptCodes = ueChanges ? [] : selectedCheckboxValues('#sessionCapacityChoices');
    $('#sessionUe').value = seq.ueId;
    $('#sessionPromotion').value = seq.promotion;
    refreshSessionSequenceSelect(seq.id);
    const resetHint = $('#sessionCapacityResetHint');
    if (resetHint) {
      resetHint.hidden = !ueChanges;
      resetHint.textContent = 'Cette séquence relève d’une autre UE : votre sélection de capacités n’y était plus valide, elle a été remplacée par celle de la séquence.';
    }
    renderSessionCapacityChoices(keptCodes.length ? keptCodes : (seq.capacityCodes || []), findUe(seq.ueId), seq);
  });

  bindModalActions();
}

/* Lot 3.1 — confirmation avant de fermer une saisie en cours. La modale
   séance (jusqu'à 7 grandes zones de texte) et la modale séquence se
   fermaient sans un mot sur Échap (réflexe pour refermer le petit calendrier
   du navigateur), Annuler ou la croix. L'indicateur "modifié" ne se lève
   qu'à la première vraie interaction utilisateur (jamais lors du
   pré-remplissage programmatique des champs à l'ouverture, qui ne déclenche
   pas d'événement input/change) : consulter puis refermer reste sans friction. */
function guardUnsavedModal(dialog, form) {
  if (!dialog || !form) return;
  dialog._dirty = false;
  form.addEventListener('input', () => { dialog._dirty = true; });
  form.addEventListener('change', () => { dialog._dirty = true; });
  dialog.addEventListener('cancel', (event) => {
    if (dialog._dirty && !confirm('Fermer sans enregistrer les modifications en cours ?')) {
      event.preventDefault();
    }
  });
}
function confirmCloseModal(dialog) {
  if (dialog._dirty && !confirm('Fermer sans enregistrer les modifications en cours ?')) return;
  dialog.close();
}

function bindModalActions() {
  // Écran 12 — grille de 12 teintes, une fois pour chaque modale (statique).
  renderColorSwatchGrid('#sequenceColorSwatches', '#sequenceColorInput');
  renderColorSwatchGrid('#sessionColorSwatches', '#sessionColorInput');
  renderColorSwatchGrid('#studentSlotColorSwatches', '#studentSlotColorInput');
  $('#ueForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const id = $('#ueId').value || uid('ue');
    const code = $('#ueCode').value.trim();
    const reference = findUeByCode(code);
    const previous = state.ues.find(x => x.id === id) || {};
    const ue = {
      id,
      code,
      title: $('#ueTitle').value.trim(),
      promotion: $('#uePromotion').value,
      semester: $('#ueSemester').value,
      annual: previous.annual || false,
      period: $('#uePeriod').value.trim(),
      startWeekId: $('#ueStartWeek').value,
      endWeekId: $('#ueEndWeek').value,
      teacher: $('#ueTeacher').value.trim(),
      hoursTarget: $('#ueHoursTarget').value.trim(),
      description: $('#ueDescription').value.trim(),
      capacities: reference?.capacities || previous.capacities || [],
      correction: reference?.correction || previous.correction || ''
    };
    const index = state.ues.findIndex(x => x.id === id);
    if (index >= 0) state.ues[index] = ue; else state.ues.push(ue);
    $('#ueDialog').close();
    await saveData('UE enregistrée');
  });
  $('#deleteUeButton').addEventListener('click', async () => {
    const id = $('#ueId').value;
    if (!id || !confirm('Supprimer cette UE ? Les séquences et séances associées seront conservées mais détachées.')) return;
    window.OC_SYNC.marquerSupprime('ues', id);
    state.ues = state.ues.filter(ue => ue.id !== id);
    state.sequences = state.sequences.map(seq => seq.ueId === id ? { ...seq, ueId: '' } : seq);
    state.sessions = state.sessions.map(s => s.ueId === id ? { ...s, ueId: '' } : s);
    $('#ueDialog').close();
    await saveData('UE supprimée');
  });
  $('#cancelUeButton').addEventListener('click', () => $('#ueDialog').close());
  $('#closeUeModal').addEventListener('click', () => $('#ueDialog').close());

  $('#sequenceForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const id = $('#sequenceId').value || uid('sequence');
    // Lot C-bis — « Type de séquence » et « Statut » ont quitté le formulaire.
    // On recopie les valeurs déjà enregistrées au lieu de les écraser : sans ça,
    // le premier enregistrement d'une séquence ancienne effacerait son type et
    // ferait décrocher la couleur de sa bande dans la frise.
    const existing = findSequence(id);
    const existingSeqType = existing?.sequenceType || '';
    const existingSeqStatus = existing?.status || 'Prévue';
    const sequence = {
      id,
      ueId: $('#sequenceUe').value,
      title: $('#sequenceTitle').value.trim(),
      promotion: $('#sequencePromotion').value,
      semester: $('#sequenceSemester').value || findUe($('#sequenceUe').value)?.semester || '',
      targetWeeks: getSequencePeriodValue(),
      periodNote: $('#sequencePeriodNote').value.trim(),
      hoursEstimate: $('#sequenceHours').value.trim() ? `${$('#sequenceHours').value.trim()} h` : '',
      sequenceType: existingSeqType,
      status: existingSeqStatus,
      color: getSequenceColorFieldValue(),
      teacher: $('#sequenceTeacher').value.trim(),
      capacityCodes: selectedCheckboxValues('#sequenceCapacityChoices'),
      objectives: $('#sequenceObjectives').value.trim(),
      capacities: $('#sequenceCapacities').value.trim(),
      learningOutcomes: $('#sequenceLearningOutcomes').value.trim(),
      prerequisites: $('#sequencePrerequisites').value.trim(),
      keywords: $('#sequenceKeywords').value.trim(),
      teachingMethods: $('#sequenceTeachingMethods').value.trim(),
      differentiation: $('#sequenceDifferentiation').value.trim(),
      assessmentType: $('#sequenceAssessmentType').value,
      assessment: $('#sequenceAssessment').value.trim(),
      resources: $('#sequenceResources').value.trim(),
      deliverables: $('#sequenceDeliverables').value.trim(),
      adjustmentNotes: $('#sequenceAdjustmentNotes').value.trim(),
      notes: $('#sequenceNotes').value.trim()
    };
    const index = state.sequences.findIndex(s => s.id === id);
    if (index >= 0) state.sequences[index] = sequence; else state.sequences.push(sequence);
    $('#sequenceDialog').close();
    await saveData('Séquence enregistrée');
  });
  $('#exportSequenceButton')?.addEventListener('click', () => {
    const id = $('#sequenceId').value;
    if (id) exportSequencePrint(findSequence(id));
  });
  $('#deleteSequenceButton').addEventListener('click', async () => {
    const id = $('#sequenceId').value;
    if (!id || !confirm('Supprimer cette séquence ? Les séances resteront conservées mais non rattachées.')) return;
    window.OC_SYNC.marquerSupprime('sequences', id);
    state.sequences = state.sequences.filter(s => s.id !== id);
    state.sessions = state.sessions.map(s => s.sequenceId === id ? { ...s, sequenceId: '' } : s);
    $('#sequenceDialog').close();
    await saveData('Séquence supprimée');
  });
  guardUnsavedModal($('#sequenceDialog'), $('#sequenceForm'));
  $('#cancelSequenceButton').addEventListener('click', () => confirmCloseModal($('#sequenceDialog')));
  $('#closeSequenceModal').addEventListener('click', () => confirmCloseModal($('#sequenceDialog')));
  // Lot L — sélecteur de couleur de séquence : toute modification manuelle = couleur
  // « choisie » ; le bouton Auto revient à la couleur automatique (dérivée de l'UE).
  $('#sequenceColorInput')?.addEventListener('input', (event) => {
    event.target.dataset.custom = '1';
    syncColorSwatchActive('#sequenceColorSwatches', '#sequenceColorInput');
  });
  $('#sequenceColorAuto')?.addEventListener('click', () => {
    const el = $('#sequenceColorInput');
    if (!el) return;
    el.dataset.custom = '0';
    const seq = state.sequences.find(s => s.id === $('#sequenceId').value);
    el.value = computedSequenceColor(seq ? { ...seq, color: '' } : { ueId: $('#sequenceUe').value, id: '__new' });
    syncColorSwatchActive('#sequenceColorSwatches', '#sequenceColorInput');
  });

  $('#sessionForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const isNewSession = !$('#sessionId').value;
    const id = $('#sessionId').value || uid('session');
    const existingSession = findSession(id);
    // Écran 12 — le créneau vient du sélecteur (sessionSlotChoice), plus des
    // anciens champs jour/début/fin/semaine/statut saisis à la main.
    let day = 0, startSlot = 0, endSlot = 0, placementStatus = 'fictif', selectedSessionWeek = '', customStart = '', customEnd = '';
    if (sessionSlotChoice?.type === 'range') {
      day = sessionSlotChoice.day;
      startSlot = sessionSlotChoice.startSlot;
      endSlot = sessionSlotChoice.endSlot;
      placementStatus = 'definitif';
      selectedSessionWeek = sessionSlotPickerWeekId;
    } else if (sessionSlotChoice?.type === 'other') {
      day = Number($('#sessionDay').value || 0);
      startSlot = Number($('#sessionStart').value || 0);
      endSlot = Number($('#sessionEnd').value || 0);
      placementStatus = 'definitif';
      selectedSessionWeek = sessionSlotPickerWeekId;
      customStart = $('#sessionCustomStart').value.trim();
      customEnd = $('#sessionCustomEnd').value.trim();
    } // sessionSlotChoice null ou {type:'none'} → séance non placée (backlog)
    // Lot K — le rattachement est SOIT une séquence, SOIT une semaine thématique
    // (valeur « eil:<id> » → constraintId). Jamais les deux.
    const rattVal = $('#sessionSequence').value;
    const isEilRatt = rattVal.startsWith('eil:');
    const sessionDemiGroupe = $('#sessionDemiGroupe')?.value || ''; // Lot V — champ « Groupe » unifié
    // roomBooked se coche depuis l'encart « Salles à réserver » du tableau de
    // bord, jamais dans ce formulaire : on le préserve tel quel à l'édition.
    const existingRoomBooked = existingSession?.roomBooked || false;
    const existingMaterielReserve = existingSession?.materielReserve || false;
    // Lot C-bis — le champ « Statut pédagogique » a quitté la modale : il était
    // saisi mais affiché NULLE PART (seul un export le sortait), pendant que la
    // pastille de la tuile montre le PLACEMENT, qui est autre chose. La donnée
    // déjà saisie est conservée telle quelle — on ne l'écrase pas au premier
    // enregistrement qui suit. Même motif que roomBooked ci-dessus.
    const existingStatus = existingSession?.status || 'Prévue';
    // Écran 12 — expectedDuration/order/fictiveSlot/fictiveDay pilotent le
    // classement et l'auto-placement du backlog (voir dashboard, drag&drop)
    // mais n'ont plus de champ dans ce formulaire : préservés tels quels à
    // l'édition (même motif que roomBooked/status ci-dessus) ; une NOUVELLE
    // séance sans date reçoit juste un `order` (tri par date de création),
    // le reste retombe sur les replis déjà gérés en aval (« à préciser »).
    const session = {
      id,
      title: $('#sessionTitle').value.trim(),
      ueId: $('#sessionUe').value,
      sequenceId: isEilRatt ? '' : rattVal,
      constraintId: isEilRatt ? rattVal.slice(4) : '',
      promotion: $('#sessionPromotion').value,
      placementStatus,
      targetWeekId: selectedSessionWeek,
      weekId: placementStatus === 'definitif' ? selectedSessionWeek : '',
      day,
      startSlot: Math.min(startSlot, endSlot),
      endSlot: Math.max(startSlot, endSlot),
      expectedDuration: existingSession?.expectedDuration || '',
      order: existingSession?.order || (isNewSession ? Date.now() : ''),
      fictiveSlot: existingSession?.fictiveSlot || '',
      fictiveDay: existingSession?.fictiveDay ?? '',
      exactDate: existingSession?.exactDate || '',
      customStart,
      customEnd,
      capacityCodes: existingSession?.capacityCodes || [],
      type: $('#sessionType').value,
      color: getSessionColorFieldValue(),
      demiGroupe: sessionDemiGroupe, // Lot V — '' | 'A' | 'B'
      group: sessionDemiGroupe === 'A' ? 'Groupe A' : sessionDemiGroupe === 'B' ? 'Groupe B' : 'Classe entière', // dérivé (exports)
      teacher: $('#sessionTeacher').value.trim(),
      room: $('#sessionRoom').value.trim(),
      roomToBook: $('#sessionRoomToBook')?.value || '',
      roomBooked: existingRoomBooked,
      status: existingStatus,
      objectives: $('#sessionObjectives').value.trim(),
      keywords: $('#sessionKeywords').value.trim(),
      activities: $('#sessionActivities').value.trim(),
      notions: $('#sessionNotions').value.trim(),
      materials: $('#sessionMaterials').value.trim(),
      materielAReserver: $('#sessionMaterielReserver')?.checked || false,
      materielReserve: existingMaterielReserve,
      materielReserveDismissed: existingSession?.materielReserveDismissed || false,
      assessment: existingSession?.assessment || '',
      homework: existingSession?.homework || '',
      differentiation: $('#sessionDifferentiation').value.trim(),
      notes: $('#sessionNotes').value.trim(),
      // Lot B — normalizeDeplacementFields borne les deux cases à leur branche et
      // tient `personalVehicle` à jour pour la compatibilité.
      ...normalizeDeplacementFields({
        deplacement: deplacementModeOf('session'),
        vehicleBooked: $('#sessionVehicleBooked')?.checked || false,
        ordreMission: $('#sessionOrdreMission')?.checked || false
      })
    };
    // Lot 3.2 — rejouer les mêmes contrôles que le glisser-déposer quand la
    // séance est enregistrée « Placée à l'emploi du temps » depuis le formulaire : jusqu'ici
    // seul le glisser-déposer les déclenchait, on pouvait donc poser deux
    // séances sur le même créneau ou en pleine semaine bloquée via ce
    // formulaire. Avertit sans bloquer (un chevauchement peut être volontaire).
    if (session.weekId) {
      const week = state.weeks.find(w => w.id === session.weekId);
      const isEilSession = !!session.constraintId && thematicConstraintsForWeek(week, session.promotion).some(c => c.id === session.constraintId);
      if (isBlockedWeek(week, session.promotion) && !confirm('Cette semaine est marquée comme sans cours. Enregistrer quand même la séance ?')) return;
      if (weekIsThematic(week, session.promotion) && !isEilSession && !confirm('Cette semaine est une semaine thématique / EIL pour cette promo (cours habituels suspendus). Enregistrer quand même la séance ?')) return;
      const conflict = findPlanningConflict(session);
      if (conflict && !confirm(`Le créneau chevauche déjà : ${conflict.title}. Enregistrer quand même la séance ?`)) return;
    }
    const index = state.sessions.findIndex(s => s.id === id);
    if (index >= 0) state.sessions[index] = session; else state.sessions.push(session);
    if (session.weekId) selectedWeek = session.weekId;
    // Seul le véhicule PERSONNEL ouvre des frais. Le véhicule de l'établissement
    // se réserve et s'arrête là : ni ordre de mission, ni remboursement.
    if (session.deplacement === 'personnel') ensureDeplacementForSession(session);
    // Écran 12 — « Créer et enchaîner » : rouvre un formulaire de création
    // vierge (nom + créneau) en gardant séquence/type/enseignants/promotion.
    if (sessionChainRequested) {
      sessionChainRequested = false;
      $('#sessionId').value = '';
      $('#sessionTitle').value = '';
      $('#sessionModalTitle').textContent = 'Créer une séance';
      $('#deleteSessionButton').hidden = true;
      const dupBtn = $('#duplicateSessionButton'); if (dupBtn) dupBtn.hidden = true;
      sessionSlotChoice = null;
      renderSessionSlotPicker();
      $('#sessionDialog')._dirty = false;
      $('#sessionTitle').focus();
    } else {
      $('#sessionDialog').close();
    }
    await saveData('Séance enregistrée');
  });
  $('#deleteSessionButton').addEventListener('click', async () => {
    const id = $('#sessionId').value;
    if (!id || !confirm('Supprimer cette séance ?')) return;
    window.OC_SYNC.marquerSupprime('sessions', id);
    state.sessions = state.sessions.filter(s => s.id !== id);
    $('#sessionDialog').close();
    await saveData('Séance supprimée');
  });
  guardUnsavedModal($('#sessionDialog'), $('#sessionForm'));
  $('#cancelSessionButton').addEventListener('click', () => confirmCloseModal($('#sessionDialog')));
  $('#closeSessionModal').addEventListener('click', () => confirmCloseModal($('#sessionDialog')));
  $('#duplicateSessionButton')?.addEventListener('click', async () => {
    const source = findSession($('#sessionId').value);
    if (!source) return;
    $('#sessionDialog').close();
    await duplicateSession(source);
  });
  $('#chainSessionButton')?.addEventListener('click', () => {
    sessionChainRequested = true;
    $('#sessionForm').requestSubmit();
  });
  // Cocher/décocher Déplacement change la suite à afficher (établissement/personnel).
  $('#sessionDeplacement')?.addEventListener('change', () => syncDeplacementFields('session'));
  $('#reunionDeplacement')?.addEventListener('change', () => syncDeplacementFields('reunion'));

  // Lot L — couleur propre d'une séance : modification manuelle = couleur choisie ;
  // Auto = couleur héritée (séquence si rattachée, sinon UE).
  $('#sessionColorInput')?.addEventListener('input', (event) => {
    event.target.dataset.custom = '1';
    syncColorSwatchActive('#sessionColorSwatches', '#sessionColorInput');
  });
  $('#sessionColorAuto')?.addEventListener('click', () => {
    const el = $('#sessionColorInput');
    if (!el) return;
    el.dataset.custom = '0';
    const seqId = $('#sessionSequence').value;
    el.value = seqId ? sequenceColor(seqId) : ueColor($('#sessionUe').value);
    syncColorSwatchActive('#sessionColorSwatches', '#sessionColorInput');
  });
  // Pré-remplissage discret : passer le type en « Cours en salle informatique »
  // suggère la salle à réserver, sans jamais écraser un choix déjà fait.
  $('#sessionType')?.addEventListener('change', (event) => {
    const roomToBook = $('#sessionRoomToBook');
    if (roomToBook && !roomToBook.value && event.target.value === 'Cours en salle informatique') {
      roomToBook.value = 'info';
    }
  });

  // ---- Frais de déplacement (Lot E — encart du Tableau de bord) ----
  // Retours #3 (18-19/08/2026) : bouton remonté dans le <summary> (visible
  // encart replié, comme « + Période ») — stopPropagation indispensable, sinon
  // le clic bascule aussi l'ouverture/fermeture du <details>.
  $('#addDeplacementButton')?.addEventListener('click', (e) => { e.stopPropagation(); openDeplacementModal(); });
  $('#fraisStatusFilter')?.addEventListener('change', renderFrais);
  $$('[data-export-frais]').forEach(btn => btn.addEventListener('click', () => {
    const fmt = btn.dataset.exportFrais;
    if (fmt === 'csv') exportFraisCsv();
    else if (fmt === 'xls') exportFraisXls();
    else exportFraisOds();
  }));

  /* Pile « Urgences » (Tableau de bord + À valider/Faites mobile) — la case
     « réservée » porte sur deux natures (salle, véhicule) et deux origines
     (séance, réunion) : c'est la ligne qui dit dans quel champ écrire, plus
     le seul identifiant de séance. Délégué sur document.body (pas juste
     #urgencesList) : ces mêmes cases apparaissent aussi dans
     #urgencesFaitesList, #mobileAValider et #mobileFaites. */
  document.body.addEventListener('change', (event) => {
    const cb = event.target.closest('[data-reservation-id]');
    if (cb) {
      const { reservationKind, reservationSource, reservationId } = cb.dataset;
      const entity = reservationSource === 'reunion'
        ? (state.reunions || []).find(r => r.id === reservationId)
        : findSession(reservationId);
      if (!entity) return;
      if (reservationKind === 'vehicule') entity.vehicleBooked = cb.checked;
      else if (reservationKind === 'materiel') entity.materielReserve = cb.checked;
      else entity.roomBooked = cb.checked;
      const quoi = reservationKind === 'vehicule' ? 'Véhicule' : reservationKind === 'materiel' ? 'Matériel' : 'Salle';
      saveData(cb.checked ? `${quoi} marqué réservé` : `${quoi} marqué non réservé`);
      return;
    }
    // Case « Fait » d'un ordre de mission : décocher revient directement à
    // « à faire » (retour arrière facile, symétrique du toggle salle/véhicule
    // ci-dessus), sans passer par la case du formulaire de la séance/réunion.
    const mb = event.target.closest('[data-mission-toggle]');
    if (mb) {
      const [source, id] = mb.dataset.missionToggle.split(':');
      const entity = source === 'reunion' ? (state.reunions || []).find(r => r.id === id) : findSession(id);
      if (!entity) return;
      entity.ordreMission = mb.checked;
      if (!mb.checked && entity.missionDetail) entity.missionDetail.envoyeAt = null;
      saveData(mb.checked ? 'Ordre de mission marqué fait' : 'Ordre de mission remis à faire');
      return;
    }
    // « Matériel emprunté » (ajustements #5, 22/08/2026) — coche rapide
    // « Rendu » depuis la liste, sans rouvrir la fiche (même geste que les
    // cases de réservation ci-dessus).
    const me = event.target.closest('[data-materiel-marquer-rendu]');
    if (!me) return;
    const item = (state.materielEmprunts || []).find(m => m.id === me.dataset.materielMarquerRendu);
    if (!item) return;
    item.dateRetour = todayIso();
    saveData('Matériel marqué rendu');
  });
  const openDeplacementFromEvent = (event) => {
    const el = event.target.closest('[data-edit-deplacement]');
    if (!el) return;
    const dep = state.deplacements.find(d => d.id === el.dataset.editDeplacement);
    if (dep) openDeplacementModal(dep);
  };
  $('#fraisTableWrap')?.addEventListener('click', openDeplacementFromEvent);
  // Écran 20 (mobile) — même dialogue que le tableau desktop (openDeplacementModal
  // est déjà responsive) : un seul délégué, « + Un trajet » ouvre en création.
  $('#mobileFrais')?.addEventListener('click', (event) => {
    if (event.target.closest('#mobileAddDeplacementButton')) { openDeplacementModal(); return; }
    openDeplacementFromEvent(event);
  });
  $('#mobileMission')?.addEventListener('click', (event) => {
    if (event.target.closest('#mobileNewMissionButton')) createStandaloneMission();
  });
  ['#deplacementKm', '#deplacementTaux'].forEach(sel => $(sel)?.addEventListener('input', updateDeplacementTotalPreview));
  $('#closeDeplacementModal')?.addEventListener('click', () => $('#deplacementDialog').close());
  $('#cancelDeplacementButton')?.addEventListener('click', () => $('#deplacementDialog').close());
  $('#deplacementForm')?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const id = $('#deplacementId').value || uid('deplacement');
    const tauxRaw = $('#deplacementTaux').value;
    const dep = {
      id,
      date: $('#deplacementDate').value || '',
      lieu: $('#deplacementLieu').value.trim(),
      conducteur: $('#deplacementConducteur').value.trim(),
      teacher: $('#deplacementTeacher')?.value.trim() || '',
      classe: $('#deplacementClasse').value || 'GPN1',
      ue: $('#deplacementUe')?.value.trim() || '',
      keywords: $('#deplacementKeywords')?.value.trim() || '',
      kmAR: Number($('#deplacementKm').value) || 0,
      taux: tauxRaw === '' ? DEFAULT_TAUX : (Number(tauxRaw) || 0),
      statut: $('#deplacementStatut').value || DEPLACEMENT_STATUSES[0],
      sessionId: $('#deplacementSessionId').value || '',
      reunionId: $('#deplacementReunionId').value || ''
    };
    const idx = state.deplacements.findIndex(d => d.id === id);
    if (idx >= 0) state.deplacements[idx] = dep; else state.deplacements.push(dep);
    $('#deplacementDialog').close();
    await saveData('Déplacement enregistré');
  });
  $('#deleteDeplacementButton')?.addEventListener('click', async () => {
    const id = $('#deplacementId').value;
    const dep = (state.deplacements || []).find(d => d.id === id);
    // Lot B [15] — prévenir avant de supprimer : la séance ou la réunion
    // d'origine repassera à « pas de déplacement ». C'est la même démarche,
    // pas deux enregistrements indépendants.
    const lie = dep && (dep.sessionId || dep.reunionId);
    const question = lie
      ? 'Supprimer ce déplacement ? La séance ou la réunion d’origine repassera à « pas de déplacement ».'
      : 'Supprimer ce déplacement ?';
    if (!id || !confirm(question)) return;
    const source = clearDeplacementSource(dep);
    state.deplacements = state.deplacements.filter(d => d.id !== id);
    $('#deplacementDialog').close();
    await saveData(source ? 'Déplacement supprimé (origine remise à zéro)' : 'Déplacement supprimé');
  });

  // ---- Matériel emprunté (ajustements #5, 22/08/2026) ----
  const openMaterielEmpruntFromEvent = (event) => {
    const el = event.target.closest('[data-edit-materiel-emprunt]');
    if (!el) return;
    const m = (state.materielEmprunts || []).find(x => x.id === el.dataset.editMaterielEmprunt);
    if (m) openMaterielEmpruntModal(m);
  };
  $('#addMaterielEmpruntButton')?.addEventListener('click', (e) => { e.stopPropagation(); openMaterielEmpruntModal(); });
  $('#materielEmpruntsList')?.addEventListener('click', openMaterielEmpruntFromEvent);
  $('#mobileMateriel')?.addEventListener('click', (event) => {
    if (event.target.closest('#mobileAddMaterielEmpruntButton')) { openMaterielEmpruntModal(); return; }
    openMaterielEmpruntFromEvent(event);
  });
  $('#closeMaterielEmpruntModal')?.addEventListener('click', () => $('#materielEmpruntDialog').close());
  $('#cancelMaterielEmpruntButton')?.addEventListener('click', () => $('#materielEmpruntDialog').close());
  // Le type choisi filtre les identifiants proposés (catalogue à 2 niveaux,
  // ajustements #6) : on repart sans valeur présélectionnée à chaque
  // changement de type, l'ancien identifiant n'ayant plus de sens.
  $('#materielEmpruntType')?.addEventListener('change', () => remplirMaterielIdentifiantSelect(''));
  $('#materielEmpruntForm')?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const id = $('#materielEmpruntId').value || uid('materiel');
    const m = {
      id,
      materielType: $('#materielEmpruntType').value || '',
      materielIdentifiant: $('#materielEmpruntIdentifiant').value || '',
      etudiant: $('#materielEmpruntEtudiant').value.trim(),
      classe: $('#materielEmpruntClasse').value || 'GPN1',
      teacher: $('#materielEmpruntTeacher')?.value.trim() || '',
      date: $('#materielEmpruntDate').value || '',
      dateRetour: $('#materielEmpruntDateRetour').value || ''
    };
    state.materielEmprunts = state.materielEmprunts || [];
    const idx = state.materielEmprunts.findIndex(x => x.id === id);
    if (idx >= 0) state.materielEmprunts[idx] = m; else state.materielEmprunts.push(m);
    $('#materielEmpruntDialog').close();
    await saveData('Emprunt de matériel enregistré');
  });
  $('#deleteMaterielEmpruntButton')?.addEventListener('click', async () => {
    const id = $('#materielEmpruntId').value;
    if (!id || !confirm('Supprimer cet emprunt ?')) return;
    state.materielEmprunts = (state.materielEmprunts || []).filter(x => x.id !== id);
    $('#materielEmpruntDialog').close();
    await saveData('Emprunt de matériel supprimé');
  });

  // ---- Catalogue de matériel (ajustements #6, 22/08/2026) ----
  $('#materielTypeForm')?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const input = $('#materielTypeInput');
    const type = input.value.trim();
    if (!type) return;
    state.materielTypes = state.materielTypes || [];
    if (!state.materielTypes.includes(type)) state.materielTypes.push(type);
    input.value = '';
    await saveData('Type de matériel ajouté');
  });
  $('#materielCatalogueList')?.addEventListener('submit', async (event) => {
    const form = event.target.closest('[data-materiel-item-type]');
    if (!form) return;
    event.preventDefault();
    const input = form.querySelector('input');
    const identifiant = input.value.trim();
    if (!identifiant) return;
    state.materielItems = state.materielItems || [];
    state.materielItems.push({ id: uid('materielitem'), type: form.dataset.materielItemType, identifiant });
    await saveData('Identifiant de matériel ajouté');
  });
  $('#materielCatalogueList')?.addEventListener('click', async (event) => {
    const delType = event.target.closest('[data-delete-materiel-type]');
    if (delType) {
      const type = delType.dataset.deleteMaterielType;
      if (!confirm(`Supprimer le type « ${type} » et ses identifiants ?`)) return;
      state.materielTypes = (state.materielTypes || []).filter(t => t !== type);
      state.materielItems = (state.materielItems || []).filter(it => it.type !== type);
      await saveData('Type de matériel supprimé');
      return;
    }
    const delItem = event.target.closest('[data-delete-materiel-item]');
    if (delItem) {
      state.materielItems = (state.materielItems || []).filter(it => it.id !== delItem.dataset.deleteMaterielItem);
      await saveData('Identifiant de matériel supprimé');
    }
  });

  // ---- Réunions (Lot M — journal du Tableau de bord) ----
  $('#addReunionButton')?.addEventListener('click', (e) => { e.stopPropagation(); openReunionModal(); });
  $('#reunionsList')?.addEventListener('click', (event) => {
    const el = event.target.closest('[data-edit-reunion]');
    if (!el) return;
    const reunion = state.reunions.find(r => r.id === el.dataset.editReunion);
    if (reunion) openReunionModal(reunion);
  });
  $('#closeReunionModal')?.addEventListener('click', () => $('#reunionDialog').close());
  $('#cancelReunionButton')?.addEventListener('click', () => $('#reunionDialog').close());
  $('#reunionForm')?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const id = $('#reunionId').value || uid('reunion');
    const reunion = {
      id,
      date: $('#reunionDate').value || '',
      lieu: $('#reunionLieu').value.trim(),
      participants: $('#reunionParticipants').value.trim(),
      sujets: $('#reunionSujets').value.trim(),
      teacher: $('#reunionTeacher').value.trim(),
      ...normalizeDeplacementFields({
        deplacement: $('#reunionDeplacement')?.value || '',
        vehicleBooked: $('#reunionVehicleBooked')?.checked || false,
        ordreMission: $('#reunionOrdreMission')?.checked || false
      })
    };
    const idx = state.reunions.findIndex(r => r.id === id);
    if (idx >= 0) state.reunions[idx] = reunion; else state.reunions.push(reunion);
    // Véhicule personnel → garantit une ligne dans Frais (jamais supprimée si le
    // mode change ensuite ; c'est la suppression de la ligne qui remonte, [15]).
    if (reunion.deplacement === 'personnel') ensureDeplacementForReunion(reunion);
    $('#reunionDialog').close();
    await saveData('Réunion enregistrée');
  });
  $('#deleteReunionButton')?.addEventListener('click', async () => {
    const id = $('#reunionId').value;
    if (!id || !confirm('Supprimer cette réunion ? (le déplacement éventuellement lié dans « Frais » est conservé)')) return;
    state.reunions = state.reunions.filter(r => r.id !== id);
    $('#reunionDialog').close();
    await saveData('Réunion supprimée');
  });

  $('#constraintForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const id = $('#constraintId').value || uid('constraint');
    const type = $('#constraintType').value;
    const constraint = {
      id,
      label: $('#constraintLabel').value.trim(),
      type,
      start: $('#constraintStart').value,
      end: $('#constraintEnd').value || $('#constraintStart').value,
      promotions: selectedCheckboxValues('#constraintPromotionChoices'),
      notes: $('#constraintNotes').value.trim()
    };
    if (isExamConstraintType(type)) {
      const exam = {
        ueId: $('#constraintExamUe').value || '',
        control: $('#constraintExamControl').value.trim(),
        capacityCodes: selectedCheckboxValues('#constraintExamCapacities'),
        absences: $('#constraintExamAbsences').value.trim(),
        remarks: $('#constraintExamRemarks').value.trim()
      };
      if (exam.ueId || exam.control || exam.capacityCodes.length || exam.absences || exam.remarks) constraint.exam = exam;
    }
    const index = state.constraints.findIndex(c => c.id === id);
    if (index >= 0) state.constraints[index] = constraint; else state.constraints.push(constraint);
    $('#constraintDialog').close();
    await saveData('Période / contrainte enregistrée');
  });
  $('#constraintType').addEventListener('change', () => { toggleConstraintExamSection(); toggleConstraintEilButton(); });
  $('#constraintExamUe').addEventListener('change', (event) => renderConstraintExamCapacities(event.target.value, []));
  // Lot K — détailler une semaine thématique en séances (rattachées à la contrainte).
  $('#detailEilButton')?.addEventListener('click', () => {
    const c = findConstraint($('#constraintId').value);
    if (!c) return;
    const promo = (c.promotions || [])[0] || '';
    const carrierUe = state.ues.find(u => u.promotion === promo) || null;
    $('#constraintDialog').close();
    openSessionModal(null, { constraintId: c.id, ueId: carrierUe?.id || '', promotion: promo, placementStatus: 'fictif' });
  });
  $('#deleteConstraintButton').addEventListener('click', async () => {
    const id = $('#constraintId').value;
    if (!id || !confirm('Supprimer cette période / contrainte ?')) return;
    window.OC_SYNC.marquerSupprime('constraints', id);
    state.constraints = state.constraints.filter(c => c.id !== id);
    // Lot K — les séances d'EIL rattachées ne pointent plus vers une contrainte morte.
    state.sessions = state.sessions.map(s => s.constraintId === id ? { ...s, constraintId: '' } : s);
    $('#constraintDialog').close();
    await saveData('Période / contrainte supprimée');
  });
  $('#cancelConstraintButton').addEventListener('click', () => $('#constraintDialog').close());
  $('#closeConstraintModal').addEventListener('click', () => $('#constraintDialog').close());
}


function ueCapacities(ueOrId) {
  const ue = typeof ueOrId === 'string' ? findUe(ueOrId) : ueOrId;
  if (!ue) return [];
  // #5 — si la composition de l'UE a été réorganisée dans « Référentiel & Ruban »
  // (override state.rubanUeCaps), c'est elle qui fait foi : cases à cocher des
  // séquences/séances ET entêtes des encarts UE. Les clés Ruban sont sans espace
  // (« UE 3.1 » côté planning → « UE3.1 » côté Ruban).
  const ov = state?.rubanUeCaps?.[String(ue.code || '').replace(/\s+/g, '')];
  if (Array.isArray(ov)) return ov.map(c => ({ code: c.code, title: c.title || '' }));
  return Array.isArray(ue.capacities) ? ue.capacities : [];
}

function findUeByCode(code = '') {
  const normalizedCode = String(code).trim().toLowerCase();
  return state?.ues?.find(ue => String(ue.code || '').trim().toLowerCase() === normalizedCode) || UE_REFERENCE.find(ue => ue.code.toLowerCase() === normalizedCode);
}

function renderCapacityList(capacities = [], compact = false) {
  if (!capacities.length) return '<p class="meta">Aucune capacité référencée.</p>';
  return `<div class="capacity-list ${compact ? 'compact' : ''}">${capacities.map(cap => `<button type="button" class="capacity-item" data-capacity-code="${escapeAttr(cap.code)}"><span class="capacity-code">${escapeHtml(cap.code)}</span><span class="capacity-title">${escapeHtml(cap.title)}</span></button>`).join('')}</div>`;
}

function renderCapacityCheckboxes(containerSelector, capacities = [], selectedCodes = [], ue = null) {
  const container = $(containerSelector);
  if (!container) return;
  const selected = new Set(selectedCodes || []);
  const emptyMessage = ue
    ? `<p class="meta">Aucune capacité enregistrée pour l’UE ${escapeHtml(ue.code || '')}. Ajoutez-les dans l’onglet Référentiel.</p>`
    : '<p class="meta">Choisissez une UE pour afficher ses capacités.</p>';
  container.innerHTML = capacities.length
    ? capacities.map(cap => `<label class="checkbox-item"><input type="checkbox" value="${escapeAttr(cap.code)}" ${selected.has(cap.code) ? 'checked' : ''}><span><strong>${escapeHtml(cap.code)}</strong> — ${escapeHtml(cap.title)}</span></label>`).join('')
    : emptyMessage;
}

function renderSequenceCapacityChoices(selectedCodes = [], ue = null) {
  const resolvedUe = ue || findUe($('#sequenceUe')?.value);
  renderCapacityCheckboxes('#sequenceCapacityChoices', ueCapacities(resolvedUe), selectedCodes, resolvedUe);
  updateSequenceCapacityDetails();
}

function renderSessionCapacityChoices(selectedCodes = [], ue = null, seq = null) {
  const resolvedUe = ue || findUe($('#sessionUe')?.value);
  const codesFromSequence = seq?.capacityCodes || [];
  const selected = selectedCodes.length ? selectedCodes : codesFromSequence;
  renderCapacityCheckboxes('#sessionCapacityChoices', ueCapacities(resolvedUe), selected, resolvedUe);
}

function updateSequenceCapacityDetails() {
  const target = $('#sequenceCapacityDetails');
  if (!target) return;
  const codes = selectedCheckboxValues('#sequenceCapacityChoices');
  if (!codes.length) {
    target.innerHTML = '<p class="form-help tight">Cocher une ou plusieurs capacités pour afficher les critères d’évaluation et savoirs mobilisés associés.</p>';
    return;
  }
  target.innerHTML = codes.map(code => {
    const ref = CAPACITY_REFERENTIAL[code] || {};
    const title = ref.title || code;
    const criteria = Array.isArray(ref.criteria) && ref.criteria.length
      ? `<ul>${ref.criteria.map(item => `<li>${escapeHtml(item)}</li>`).join('')}</ul>`
      : '<p class="meta">Critères non intégrés dans le référentiel interne pour cette capacité.</p>';
    const knowledge = Array.isArray(ref.knowledge) && ref.knowledge.length
      ? `<ul>${ref.knowledge.map(item => `<li>${escapeHtml(item)}</li>`).join('')}</ul>`
      : '<p class="meta">Savoirs mobilisés non intégrés dans le référentiel interne pour cette capacité.</p>';
    return `<article class="sequence-reference-card">
      <h5>${escapeHtml(title)}</h5>
      <div class="sequence-reference-grid">
        <section><strong>Critères d’évaluation</strong>${criteria}</section>
        <section><strong>Savoirs mobilisés</strong>${knowledge}</section>
      </div>
    </article>`;
  }).join('');
}

/* D3 — Date (JS) → chaîne ISO yyyy-mm-dd pour un <input type="date">. */
function isoOf(date) {
  if (!date) return '';
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/* D3 — semaine scolaire contenant une date ISO ; à défaut (week-end / jour hors
   semaine), la dernière semaine dont le début précède la date. */
function weekForIsoDate(iso) {
  const date = parseIsoDate(iso);
  if (!date) return null;
  const weeks = state.weeks || [];
  const hit = weeks.find(w => { const [s, e] = weekDateRange(w); return s && e && date >= s && date <= e; });
  if (hit) return hit;
  let prior = null;
  weeks.forEach(w => { const [s] = weekDateRange(w); if (s && s <= date) prior = w; });
  return prior || weeks[0] || null;
}

/* Écran 12 — semaines de séquence saisies dans #sequenceWeekStart/#sequenceWeekEnd
   (« S45 » → « S46 »), à la main OU via le calendrier ci-dessous (18/08 — exception
   assumée à REGLES.md #22 pour cet écran précis, décision de Martin). Même format
   `targetWeeks` (« S45-S46 ») qu'avant : aucun autre écran à toucher (Progression, Ruban,
   exports le consomment tel quel). */
function getSequencePeriodValue() {
  const numFrom = (v) => { const m = /\d{1,2}/.exec(v || ''); return m ? Number(m[0]) : null; };
  const s = numFrom($('#sequenceWeekStart')?.value);
  const e = numFrom($('#sequenceWeekEnd')?.value);
  const fmt = n => `S${String(n).padStart(2, '0')}`;
  if (s != null && e != null) return s === e ? fmt(s) : `${fmt(s)}-${fmt(e)}`;
  if (s != null) return fmt(s);
  if (e != null) return fmt(e);
  return ($('#sequenceWeeks')?.value || '').trim();
}

function syncSequenceWeeksField() {
  const value = getSequencePeriodValue();
  const target = $('#sequenceWeeks');
  if (target) target.value = value;
  const hint = $('#sequencePeriodWeeks');
  if (hint) hint.textContent = value ? `Semaines couvertes : ${value.replace('-', ' → ')}` : '';
}

/* Rendu générique d'un mois calendaire en grille (colonne n° de semaine + 7 jours) —
   18/08, réintroduit pour le calendrier de la modale séquence (seul appelant à ce jour).
   Mode « selection » : objet {start,end} (clés lundi ISO) = plage surlignée, sinon chaîne
   = sélection simple. `opts.pickAttr` = attribut data- posé sur chaque jour cliquable. */
function renderCalendarMonth(monthDate, mondayToWeek, selection, showLabel = true, opts = {}) {
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const monthLabel = monthDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstOffset = (new Date(year, month, 1).getDay() + 6) % 7; // colonne du 1er (lun=0)
  const dows = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
  const pickAttr = opts.pickAttr || 'set-week';
  const rangeMode = selection && typeof selection === 'object';
  const singleKey = rangeMode ? '' : (selection || '');
  const rStart = rangeMode ? (selection.start || '') : '';
  const rEnd = rangeMode ? (selection.end || '') : '';
  const lo = rStart && rEnd ? (rStart <= rEnd ? rStart : rEnd) : (rStart || rEnd);
  const hi = rStart && rEnd ? (rStart <= rEnd ? rEnd : rStart) : (rStart || rEnd);
  const days = [];
  for (let i = 0; i < firstOffset; i += 1) days.push(null);
  for (let day = 1; day <= daysInMonth; day += 1) days.push(day);
  while (days.length % 7 !== 0) days.push(null);
  const wkNumberOf = (weekId) => {
    const w = state.weeks.find(x => x.id === weekId);
    return w ? `S${String(weekNumberOf(w)).padStart(2, '0')}` : '';
  };
  let body = `<span class="cal-wk cal-wk-head">Sem.</span>${dows.map(d => `<span class="cal-dow">${d}</span>`).join('')}`;
  for (let i = 0; i < days.length; i += 7) {
    const row = days.slice(i, i + 7);
    let wk = '';
    for (const day of row) {
      if (!day) continue;
      const id = mondayToWeek.get(isoKey(mondayOf(new Date(year, month, day))));
      if (id) { wk = wkNumberOf(id); break; }
    }
    body += `<span class="cal-wk">${escapeHtml(wk)}</span>`;
    for (const day of row) {
      if (!day) { body += '<span class="cal-day cal-empty"></span>'; continue; }
      const date = new Date(year, month, day);
      const mKey = isoKey(mondayOf(date));
      const weekId = mondayToWeek.get(mKey);
      if (!weekId) { body += `<span class="cal-day cal-off">${day}</span>`; continue; }
      const wObj = state.weeks.find(x => x.id === weekId);
      const tip = wObj ? `${wObj.label.replace('S0', 'S')} · ${wObj.dateRange || ''}` : '';
      let cls = 'cal-day cal-active';
      let dataAttr;
      if (rangeMode) {
        const isStart = rStart && mKey === rStart;
        const isEnd = rEnd && mKey === rEnd;
        if (isStart || isEnd) cls += ' cal-selected';
        if (isStart) cls += ' cal-range-start';
        if (isEnd) cls += ' cal-range-end';
        if (lo && hi && mKey >= lo && mKey <= hi && !isStart && !isEnd) cls += ' cal-in-range';
        dataAttr = `data-${pickAttr}="${escapeAttr(mKey)}"`;
      } else {
        if (mKey === singleKey) cls += ' cal-selected';
        dataAttr = `data-${pickAttr}="${escapeAttr(weekId)}"`;
      }
      body += `<button type="button" class="${cls}" ${dataAttr} title="${escapeAttr(tip)}">${day}</button>`;
    }
  }
  const labelHtml = showLabel ? `<div class="cal-month-label">${escapeHtml(monthLabel)}</div>` : '';
  return `<div class="cal-month${showLabel ? '' : ' single'}">${labelHtml}<div class="cal-grid cal-grid-wk">${body}</div></div>`;
}

/* 18/08 — calendrier de la modale séquence, sélection de PLAGE (1er clic = semaine de
   début, 2e = semaine de fin, surlignage). Semaines cliquables = toute l'année de la
   promo (paire de semestres, weeksForSemesterSpan), pour couvrir les UE à cheval et les
   EIL hors semestre nominal. Lit/écrit directement #sequenceWeekStart/#sequenceWeekEnd
   (format "S37") : pas de champ caché séparé, contrairement à l'ancienne version
   (retirée le 17/08) qui passait par des dates ISO dédiées. */
function renderSequenceCalendar() {
  const container = $('#sequenceCalendar');
  if (!container) return;
  const semester = $('#sequenceSemester')?.value || 'Semestre 1';
  const weeks = weeksForSemesterSpan(semester);
  const mondayToWeek = new Map();
  let minDate = null, maxDate = null;
  weeks.forEach(w => {
    const [s, e] = weekDateRange(w);
    if (!s) return;
    mondayToWeek.set(isoKey(s), w.id);
    if (!minDate || s < minDate) minDate = s;
    if (!maxDate || (e || s) > maxDate) maxDate = e || s;
  });
  if (!minDate) { container.innerHTML = '<p class="meta">Aucune semaine disponible.</p>'; return; }

  const numFrom = (v) => { const m = /\d{1,2}/.exec(v || ''); return m ? Number(m[0]) : null; };
  const keyOfField = (fieldValue) => {
    const n = numFrom(fieldValue);
    const w = n != null ? weeks.find(x => weekNumberOf(x) === n) : null;
    return w ? isoKey(weekDateRange(w)[0]) : '';
  };
  const startKey = keyOfField($('#sequenceWeekStart')?.value);
  const endKey = keyOfField($('#sequenceWeekEnd')?.value);

  const firstMonth = new Date(minDate.getFullYear(), minDate.getMonth(), 1);
  const lastMonth = new Date(maxDate.getFullYear(), maxDate.getMonth(), 1);
  const clampMonth = (d) => new Date(Math.min(Math.max(d.getTime(), firstMonth.getTime()), lastMonth.getTime()));
  let shown;
  if (seqCalMonthKey) {
    const [y, m] = seqCalMonthKey.split('-').map(Number);
    shown = new Date(y, m - 1, 1);
  } else {
    const base = (startKey && parseIsoDate(startKey)) || minDate;
    shown = new Date(base.getFullYear(), base.getMonth(), 1);
  }
  shown = clampMonth(shown);
  const atFirst = shown.getTime() <= firstMonth.getTime();
  const atLast = shown.getTime() >= lastMonth.getTime();
  const monthLabel = shown.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });

  const header = `<div class="week-cal-header">
    <button type="button" class="week-cal-nav" data-seqcal-nav="prev"${atFirst ? ' disabled' : ''} aria-label="Mois précédent">‹</button>
    <div class="week-cal-monthlabel">${escapeHtml(monthLabel)}</div>
    <button type="button" class="week-cal-nav" data-seqcal-nav="next"${atLast ? ' disabled' : ''} aria-label="Mois suivant">›</button>
  </div>`;
  const grid = renderCalendarMonth(shown, mondayToWeek, { start: startKey, end: endKey }, false, { pickAttr: 'seqpick-week' });
  let hint;
  if (startKey && endKey) hint = 'Plage définie — recliquez une semaine pour repartir d’un nouveau début.';
  else if (startKey) hint = 'Cliquez la semaine de fin (ou la même pour une seule semaine).';
  else hint = 'Cliquez la semaine de début.';
  container.innerHTML = `<div class="week-cal-compact seq-cal">${header}${grid}<p class="week-cal-hint">${hint}</p></div>`;
}

/* Décale le mois affiché dans le calendrier de la modale séquence. */
function moveSequenceCalendarMonth(offset) {
  const semester = $('#sequenceSemester')?.value || 'Semestre 1';
  const weeks = weeksForSemesterSpan(semester);
  let base;
  if (seqCalMonthKey) {
    const [y, m] = seqCalMonthKey.split('-').map(Number);
    base = new Date(y, m - 1, 1);
  } else {
    const numFrom = (v) => { const m2 = /\d{1,2}/.exec(v || ''); return m2 ? Number(m2[0]) : null; };
    const n = numFrom($('#sequenceWeekStart')?.value);
    const w = n != null ? weeks.find(x => weekNumberOf(x) === n) : null;
    const d = (w && weekDateRange(w)[0]) || (weeks[0] ? weekDateRange(weeks[0])[0] : new Date());
    base = new Date(d.getFullYear(), d.getMonth(), 1);
  }
  base.setMonth(base.getMonth() + offset);
  seqCalMonthKey = `${base.getFullYear()}-${String(base.getMonth() + 1).padStart(2, '0')}`;
  renderSequenceCalendar();
}

/* Pont clic calendrier → champ texte : `weekId` cliqué -> "S37" écrit dans le champ de
   début ou de fin. N'appelle PAS syncSequenceWeeksField/renderSequenceCalendar (à la
   charge de l'appelant, qui sait s'il doit aussi toucher l'autre champ dans le même geste
   — cf. logique de plage du handler de clic). */
function setSequenceWeekFieldsFromWeek(weekId, which) {
  const week = state.weeks.find(w => w.id === weekId);
  if (!week) return;
  const field = which === 'end' ? $('#sequenceWeekEnd') : $('#sequenceWeekStart');
  if (field) field.value = `S${String(weekNumberOf(week)).padStart(2, '0')}`;
}

function uniqueWeeks(weeks = []) {
  const map = new Map();
  weeks.forEach(w => { if (w && w.id) map.set(w.id, w); });
  return [...map.values()].sort((a, b) => {
    const ya = Number(a.isoYear || 0), yb = Number(b.isoYear || 0);
    return ya === yb ? weekNumberOf(a) - weekNumberOf(b) : ya - yb;
  });
}

function groupBy(items, keyFn) {
  return items.reduce((acc, item) => {
    const key = keyFn(item);
    (acc[key] ||= []).push(item);
    return acc;
  }, {});
}

function typeSlug(type = '') {
  return String(type).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'autre';
}


function selectedCheckboxValues(containerSelector) {
  return $$(`${containerSelector} input[type="checkbox"]:checked`).map(input => input.value);
}

function updateUeCapacityPreview(ue = null) {
  const capacities = ueCapacities(ue);
  const target = $('#ueCapacityPreview');
  if (target) target.innerHTML = renderCapacityList(capacities, true);
}

function sessionListItem(s) {
  const temporal = isFictiveSession(s)
    ? [weekLabel(s.targetWeekId || s.weekId), s.expectedDuration].filter(Boolean).join(' · ')
    : [weekLabel(s.weekId), DAY_NAMES[s.day], s.customStart && s.customEnd ? `${s.customStart}-${s.customEnd}` : slotLabel(s.startSlot)].filter(Boolean).join(' · ');
  const meta = [ueCodeOnly(s.ueId), sequenceLabel(s.sequenceId), temporal].filter(Boolean).join(' · ');
  const kws = compactKeywords(s.keywords, 4);
  const kwHtml = kws.length ? `<div class="row-keywords">${kws.map(k => `<span class="kw-chip">${escapeHtml(k)}</span>`).join('')}</div>` : '';
  return `<div class="row-item" data-edit-session="${escapeAttr(s.id)}">
    <div class="row-main">
      <strong class="row-title">${escapeHtml(s.title)}</strong>
      <span class="row-meta">${escapeHtml(meta)}</span>
      ${kwHtml}
    </div>
    ${placementFlag(s)}
  </div>`;
}

function displayPlacementStatus(value) { return value === 'fictif' ? 'À placer' : (value || ''); }
/* Lot C-bis (3e passe) — le placement n'a que deux états, et l'un des deux est
   le cas ordinaire : deux pastilles pleines criaient plus fort que
   l'information qu'elles portaient. Un signe suffit — coche = validée à
   l'emploi du temps, « ? » = pas encore placée précisément. Le mot entier reste
   dans title/aria-label : le symbole seul ne se lit pas au lecteur d'écran. */
function placementFlag(s) {
  const fictive = isFictiveSession(s);
  const label = fictive ? 'Pas encore placée à l’emploi du temps' : 'Placée à l’emploi du temps';
  return `<span class="placement-flag ${fictive ? 'is-unplaced' : 'is-placed'}" title="${escapeAttr(label)}" aria-label="${escapeAttr(label)}">${fictive ? '?' : '✓'}</span>`;
}

function isFictiveSession(s) { return s.placementStatus === 'fictif' || !s.weekId; }
function isDefinitiveSession(s) { return s.placementStatus === 'definitif' && !!s.weekId; }

/* Lot V — demi-groupe normalisé : '' (classe entière), 'A' ou 'B'. Si `demiGroupe`
   est absent, migre depuis l'ancien champ descriptif `group` (« Groupe A »,
   « Demi-groupe B »…) pour que les données existantes fonctionnent au chargement. */
function normalizeDemiGroupe(demiGroupe, group) {
  const dg = String(demiGroupe || '').trim().toUpperCase();
  if (dg === 'A' || dg === 'B') return dg;
  const g = String(group || '').trim();
  if (/groupe\s*a$/i.test(g)) return 'A';
  if (/groupe\s*b$/i.test(g)) return 'B';
  return '';
}

/* Lot V — deux séances placées formant des demi-groupes complémentaires
   (l'une A, l'autre B) : elles peuvent coexister sur le même créneau (côte à
   côte), ce n'est PAS un conflit. */
function areComplementaryHalves(a, b) {
  return !!a.demiGroupe && !!b.demiGroupe && a.demiGroupe !== b.demiGroupe;
}

/* Lot V — badge compact ½A / ½B (vide si classe entière). */
function demiGroupeBadge(session) {
  return session.demiGroupe ? `<span class="demi-badge demi-${session.demiGroupe.toLowerCase()}" title="Demi-groupe ${session.demiGroupe}">½${session.demiGroupe}</span>` : '';
}
function sessionDurationSlots(session) { return Math.max(1, Number(session.endSlot) - Number(session.startSlot) + 1); }
function slotLabel(index) { return SLOTS[Number(index)] || ''; }
function weekLabel(id) { return state.weeks.find(w => w.id === id)?.label || id || 'Semaine ?'; }
function findUe(id) { return state?.ues?.find(ue => ue.id === id); }
function findSequence(id) { return state?.sequences?.find(seq => seq.id === id); }
function findSession(id) { return state?.sessions?.find(s => s.id === id); }
function findConstraint(id) { return state?.constraints?.find(c => c.id === id); }
function ueLabel(id) { const ue = findUe(id); return ue ? `${ue.code} ${ue.title}` : 'UE non rattachée'; }
function ueCodeOnly(id) { const ue = findUe(id); return ue ? ue.code.replace('UE ', '') : 'UE ?'; }
function durationFromSlots(session) { return `${sessionDurationSlots(session) * 55} min`; }
function sequenceLabel(id) { const seq = findSequence(id); return seq ? seq.title : 'Séquence non rattachée'; }

function typeClass(type = '') {
  const t = type.toLowerCase();
  if (t.includes('salle informatique')) return 'type-salle-info';
  if (t.includes('salle')) return 'type-salle';
  if (t.includes('tp')) return 'type-tp';
  if (t.includes('terrain') || t.includes('sortie')) return 'type-terrain';
  if (t.includes('pluri')) return 'type-pluri';
  if (t.includes('autonomie')) return 'type-autonomie';
  if (t.includes('projet')) return 'type-projet';
  if (t.includes('thématique') || t.includes('eil')) return 'type-theme';
  if (t.includes('évaluation') || t.includes('evaluation')) return 'type-eval';
  return '';
}

// Ajustements #2 [E2.5], correctif jumeau (18/08/2026) — même bug que
// periodOfWeek ci-dessus (année civile en dur, cassé par buildRollingWeeks) :
// trouvé en cherchant d'autres `isoYear === 2026/2027` pendant l'investigation
// du ticket « 7 cases en janvier-mai ». Même correctif, au numéro de semaine.
function weeksForSemester(semester) {
  return state.weeks.filter(w => {
    const n = weekNumberOf(w);
    if (semester === 'Semestre 1' || semester === 'Semestre 3') return n >= 36 && n <= 53;
    if (semester === 'Semestre 2') return n >= 1 && n <= 17;
    if (semester === 'Semestre 4') return n >= 1 && n <= 22;
    return true;
  });
}

/* Semaines sélectionnables pour une séquence : TOUTE l'année de la promo (paire
   de semestres), et pas seulement le semestre nominal de l'UE. Indispensable pour
   les UE à cheval sur deux semestres (ex. UE 4.4, S3↔S4) et les semaines EIL qui
   peuvent tomber hors du semestre déclaré. Ordre chronologique conservé (state.weeks). */
function semesterPair(semester) {
  return (semester === 'Semestre 1' || semester === 'Semestre 2')
    ? ['Semestre 1', 'Semestre 2']
    : ['Semestre 3', 'Semestre 4'];
}

function weeksForSemesterSpan(semester) {
  const ids = new Set(semesterPair(semester).flatMap(s => weeksForSemester(s).map(w => w.id)));
  return state.weeks.filter(w => ids.has(w.id));
}

/* Semestres couverts par une UE. Cas normal : son semestre nominal. UE « annuelle »
   (à cheval, ex. UE 4.4 « Insertion professionnelle » sur S3↔S4) : les deux semestres
   de l'année de la promo, pour rester visible dans la frise et le planning quel que
   soit le semestre affiché/coché. Rétrocompatible : sans flag, comportement inchangé. */
function ueSemesters(ue) {
  if (!ue) return [];
  return ue.annual ? semesterPair(ue.semester) : [ue.semester];
}

function ueInSemester(ue, semester) {
  return ueSemesters(ue).includes(semester);
}

function sequenceMatchesWeek(seq, week) {
  if (!seq.targetWeeks) return false;
  const n = Number(week.weekNumber ?? String(week.label).replace(/\D/g, ''));
  const segments = seq.targetWeeks.split(/[;,]/).map(x => x.trim()).filter(Boolean);
  return segments.some(segment => {
    const nums = segment.match(/S?\s*(\d{1,2})/gi)?.map(x => Number(x.replace(/\D/g, ''))) || [];
    if (nums.length === 1) return n === nums[0];
    if (nums.length >= 2) {
      const [start, end] = nums;
      return start <= end ? (n >= start && n <= end) : (n >= start || n <= end);
    }
    return false;
  });
}

/* D1 — une séquence marquée « semaine thématique / EIL » (via son sequenceType)
   signifie que les élèves de sa promo sont mobilisés cette/ces semaine(s) : les
   cours habituels des AUTRES UE ne peuvent donc pas avoir lieu. */
function isThematicSequence(seq) {
  return /th[ée]matique|eil/i.test(seq?.sequenceType || '');
}

/* Séquences thématiques (EIL) couvrant `week` pour `promotion`, en excluant
   l'UE porteuse `excludeUeId` (elle, affiche ses propres séances au lieu d'être
   grisée). Sert à diffuser le blocage dans les plannings des autres UE. */
function thematicSequencesForWeek(week, promotion = '', excludeUeId = '') {
  if (!week) return [];
  return (state.sequences || []).filter(seq => {
    if (!isThematicSequence(seq)) return false;
    if (excludeUeId && seq.ueId === excludeUeId) return false;
    const promo = findUe(seq.ueId)?.promotion || seq.promotion || '';
    if (promotion && promo && promo !== promotion) return false;
    return sequenceMatchesWeek(seq, week);
  });
}

/* D1 — TOUTES les séquences thématiques (EIL) couvrant `week`, toutes promos et
   toutes UE confondues. Sert à poser une pastille d'info sur CHAQUE UE de CHAQUE
   promo (repère général : « cette semaine est une EIL »). Le blocage des cours,
   lui, reste réservé aux autres UE de la MÊME promo (thematicSequencesForWeek). */
function thematicSequencesAny(week) {
  if (!week) return [];
  return (state.sequences || []).filter(seq => isThematicSequence(seq) && sequenceMatchesWeek(seq, week));
}

/* ---------- Lot K — semaines thématiques / EIL (concept unique = contrainte) ----------
   Une « Semaine thématique » est une CONTRAINTE (type ~ thématique/EIL). Elle
   bloque la semaine de sa/ses promo(s) et peut être DÉTAILLÉE en séances qui s'y
   rattachent (session.constraintId), affichées dans l'UE porteuse (celle qui a des
   séances cette semaine-là n'est pas hachurée). */
function isThematicConstraint(c) { return /th[ée]matique|eil/i.test(c?.type || ''); }

function thematicConstraintsForWeek(week, promotion = '') {
  if (!week) return [];
  return constraintsForWeek(week, promotion).filter(isThematicConstraint);
}

/* La semaine est-elle thématique pour cette promo ? Source = contraintes ; compat
   avec d'anciennes séquences thématiques encore présentes dans les données. */
function weekIsThematic(week, promotion = '') {
  return thematicConstraintsForWeek(week, promotion).length > 0
      || thematicSequencesForWeek(week, promotion).length > 0;
}

/* Repères thématiques (titre + promos) couvrant `week`, pour la pastille d'info
   « ◇ EIL <promos> » posée sur toutes les UE/promos. */
function thematicItemsForWeek(week) {
  const items = [];
  thematicConstraintsForWeek(week).forEach(c => {
    const promos = (Array.isArray(c.promotions) && c.promotions.length) ? c.promotions : [...(state.promotions || [])];
    items.push({ title: c.label, promos });
  });
  (state.sequences || []).forEach(seq => {
    if (isThematicSequence(seq) && sequenceMatchesWeek(seq, week)) {
      const p = findUe(seq.ueId)?.promotion || seq.promotion || '';
      items.push({ title: seq.title, promos: p ? [p] : [] });
    }
  });
  return items;
}

/* Une UE est PORTEUSE d'une semaine thématique si elle DÉTAILLE l'EIL : elle a des
   séances RATTACHÉES à la (aux) contrainte(s) thématique(s) de la semaine (ou porte
   une ancienne séquence thématique — compat). Seule une porteuse échappe à la
   hachure ; les autres UE sont hachurées même si elles ont, par erreur, un cours ce
   jour-là (il s'affiche alors PAR-DESSUS la hachure = conflit rendu visible). */
function ueCarriesThematicWeek(week, promotion, ueId, ueSessions) {
  const conIds = new Set(thematicConstraintsForWeek(week, promotion).map(c => c.id));
  const list = ueSessions || (state.sessions || []).filter(s => s.ueId === ueId);
  const carriesEilSessions = conIds.size > 0 && list.some(s => s.constraintId && conIds.has(s.constraintId) && sessionCanonicalWeekId(s) === week.id);
  const carriesThematicSeq = (state.sequences || []).some(seq => isThematicSequence(seq) && seq.ueId === ueId && sequenceMatchesWeek(seq, week));
  return carriesEilSessions || carriesThematicSeq;
}

/* Blocage thématique d'une UE sur une semaine (unifié) : la semaine est thématique
   pour la promo ET cette UE n'en est PAS la porteuse (elle ne détaille pas l'EIL). */
function isThematicBlocked(week, promotion, ueId, ueSessions) {
  if (!weekIsThematic(week, promotion)) return false;
  return !ueCarriesThematicWeek(week, promotion, ueId, ueSessions);
}

/* Séances rattachées à une (des) contrainte(s) thématique(s) donnée(s). */
function sessionsForConstraint(constraintId) {
  return (state.sessions || []).filter(s => s.constraintId === constraintId);
}

/* D1b — bannière EIL pleine largeur en tête d'une table de planning hebdo.
   `eilSelf` = EIL de la promo affichée (cours suspendus) ; `eilOther` = EIL
   d'autres promos (info : créneaux souvent libres pour caler des cours). */
/* Lot K — bannière EIL en tête de planning. Reçoit des repères normalisés
   { title, promos:[...] } (issus de thematicItemsForWeek). */
function eilBannerRow(eilSelf, eilOther, colspan) {
  if (eilSelf.length) {
    const titles = eilSelf.map(s => s.title).filter(Boolean).join(' · ');
    return `<tr class="eil-banner-row is-self"><td class="time-cell">EIL</td><td colspan="${colspan}"><span class="eil-banner">🔶 Semaine thématique / EIL — cours habituels suspendus${titles ? ' : ' + escapeHtml(titles) : ''}</span></td></tr>`;
  }
  if (eilOther.length) {
    const promos = [...new Set(eilOther.flatMap(s => s.promos || []).filter(Boolean))].join(', ');
    const titles = eilOther.map(s => s.title).filter(Boolean).join(' · ');
    return `<tr class="eil-banner-row is-info"><td class="time-cell">EIL</td><td colspan="${colspan}"><span class="eil-banner">◇ EIL ${escapeHtml(promos)} — créneaux souvent libres pour caler des cours${titles ? ' (' + escapeHtml(titles) + ')' : ''}</span></td></tr>`;
  }
  return '';
}

function constraintsForWeek(week, promotion = '') {
  if (!week) return [];
  const [start, end] = weekDateRange(week);
  if (!start || !end) return [];
  return state.constraints.filter(c => {
    if (promotion && Array.isArray(c.promotions) && c.promotions.length && !c.promotions.includes(promotion)) return false;
    const cs = parseIsoDate(c.start);
    const ce = parseIsoDate(c.end || c.start);
    return cs && ce && cs <= end && ce >= start;
  });
}

/* Date courte jj/mm pour l'entête d'un jour de planning. */
function fmtDayDate(date) {
  return date ? `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}` : '';
}

/* C2 — dates (lun→ven) de la semaine d'enseignement affichée. */
function dayDatesForWeek(week) {
  const monday = week ? weekDateRange(week)[0] : null;
  if (!monday) return DAYS.map(() => null);
  return DAYS.map((_, i) => new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + i));
}

/* C2 — contraintes/périodes couvrant un jour précis (et non toute la semaine). */
function constraintsForDate(date, promotion = '') {
  if (!date) return [];
  return state.constraints.filter(c => {
    if (promotion && Array.isArray(c.promotions) && c.promotions.length && !c.promotions.includes(promotion)) return false;
    const cs = parseIsoDate(c.start);
    const ce = parseIsoDate(c.end || c.start);
    return cs && ce && cs <= date && ce >= date;
  });
}

/* C2 — période « sans cours » (grise la colonne du jour). */
function isBlockingConstraint(c) {
  return /vacances|stage|f[eé]ri[eé]|ferm/i.test(`${c?.type || ''} ${c?.label || ''}`);
}

/* D2 — jour férié : contrainte à afficher DANS la colonne-jour du diagramme
   (partie « journées »), et non comme une bande dans le couloir des séquences.
   On se base sur le TYPE (« Jour férié ») pour ne pas capter un simple libellé. */
function isHolidayConstraint(c) {
  return /f[eé]ri[eé]/i.test(`${c?.type || ''}`);
}

/* Lot U — contrainte couvrant EXACTEMENT une journée (start == end, ou end vide) :
   comme un jour férié, elle s'affiche dans la bonne case-journée de la frise
   (partie « journées »), et non comme une bande dans le couloir des séquences. */
function isSingleDayConstraint(c) {
  const cs = parseIsoDate(c?.start);
  const ce = parseIsoDate(c?.end || c?.start);
  if (!cs || !ce) return false;
  return cs.getFullYear() === ce.getFullYear() && cs.getMonth() === ce.getMonth() && cs.getDate() === ce.getDate();
}

/* C2 — pastille compacte d'une contrainte affichée en tête de colonne-jour. */
function dayConstraintChip(c) {
  const exam = !!c.exam || isExamConstraintType(c.type);
  const variant = exam ? 'is-exam' : (isBlockingConstraint(c) ? 'is-blocked' : 'is-period');
  const ico = exam ? '📝' : (isBlockingConstraint(c) ? '🚫' : '📌');
  const tip = examConstraintTooltip(c) || c.notes || `${c.label} · ${c.type}`;
  return `<button type="button" class="day-constraint-chip constraint-${typeSlug(c.type)} ${variant}" data-edit-constraint="${escapeAttr(c.id)}" title="${escapeAttr(tip)}"><span class="dcc-ico" aria-hidden="true">${ico}</span><span class="dcc-label">${escapeHtml(c.label)}</span></button>`;
}

function weekDateRange(week) {
  const parts = String(week.dateRange || '').split('–').map(x => x.trim());
  return [parseFrDate(parts[0]), parseFrDate(parts[1] || parts[0])];
}
function parseFrDate(value) {
  const m = String(value || '').match(/(\d{2})\/(\d{2})\/(\d{4})/);
  if (!m) return null;
  return new Date(Number(m[3]), Number(m[2]) - 1, Number(m[1]));
}
function parseIsoDate(value) {
  const m = String(value || '').match(/(\d{4})-(\d{2})-(\d{2})/);
  if (!m) return null;
  return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
}
function formatDateFr(value) {
  const d = parseIsoDate(value);
  return d ? d.toLocaleDateString('fr-FR') : value || '';
}
function escapeHtml(value) { return String(value ?? '').replace(/[&<>\"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])); }
function escapeAttr(value) { return escapeHtml(value).replace(/'/g, '&#39;'); }
function truncate(value, max) { const text = String(value || ''); return text.length > max ? text.slice(0, max - 1) + '…' : text; }

/* Lot C [11] — la barre de la Conception se colle SOUS le bandeau + les
   onglets. Cette hauteur n'est pas constante : les onglets passent sur deux
   lignes dès que la fenêtre rétrécit. On la mesure donc au lieu de la coder en
   dur, et on la publie dans --hauteur-collante, que le CSS consomme. */
function mesurerBandeauCollant() {
  const entete = document.querySelector('.app-sticky-header');
  if (!entete) return;
  // Pas d'arrondi : une hauteur arrondie à l'entier laisse la barre flotter
  // d'une fraction de pixel sous l'en-tête, ce qui se voit au défilement.
  const appliquer = () => {
    const h = entete.getBoundingClientRect().height;
    if (h > 0) document.documentElement.style.setProperty('--hauteur-collante', `${h}px`);
  };
  appliquer();
  if (typeof ResizeObserver === 'function') new ResizeObserver(appliquer).observe(entete);
  else window.addEventListener('resize', appliquer);
}

// Démarrage piloté depuis js/auth.js : l'app ne se lance qu'après connexion
// (compte actif). bindEvents() ne doit s'exécuter qu'une fois par page — une
// déconnexion/reconnexion dans la même page ne doit pas rebrancher les
// écouteurs d'événements une deuxième fois.
let ocAppDemarre = false;
window.OC_APP = {
  demarrer(initiales = '', nom = '', prenom = '') {
    moiInitiales = String(initiales || '').toUpperCase();
    moiNom = String(nom || '');
    moiPrenom = String(prenom || '');
    if (!ocAppDemarre) {
      ocAppDemarre = true;
      bindEvents();
    }
    return loadData().catch(error => {
      console.error(error);
      setSaveStatus('Erreur de chargement');
      alert(error.message);
    });
  },
  arreter() {
    state = null;
  },
  // Étape 8 — pas de synchronisation temps réel : sans ce bouton, les
  // modifications d'un collègue ne remontent qu'au prochain F5 (rechargement
  // complet de la page). Recharger() relit Supabase et re-rend sans ça.
  recharger() {
    setSaveStatus('Rechargement…');
    return loadData().catch(error => {
      console.error(error);
      setSaveStatus('Erreur de rechargement');
      alert(error.message);
    });
  }
};
