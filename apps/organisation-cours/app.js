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
const DEFAULT_PROMOTIONS = ['GPN1', 'GPN2'];
const DEPLACEMENT_STATUSES = ['Demande à faire', 'En cours', 'Terminée'];
const DEFAULT_TAUX = 0.55;
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

const REFERENCE_DOCS = [
  { id: 'referentiel', title: 'Référentiel de diplôme BTSA GPN 2024', file: 'referentiel-diplome-2024.pdf', type: 'Référentiel de diplôme' },
  { id: 'm4', title: 'Module 4 — Expertise naturaliste', file: 'module-4-expertise-naturaliste.pdf', type: 'Document d’accompagnement' },
  { id: 'm5', title: 'Module 5 — Opérations de gestion environnementale', file: 'module-5-operations-gestion-environnementale.pdf', type: 'Document d’accompagnement' },
  { id: 'm6', title: 'Module 6 — Éducation à l’environnement et médiation scientifique', file: 'module-6-education-environnement-mediation.pdf', type: 'Document d’accompagnement' },
  { id: 'm7', title: 'Module 7 — Montage de projet de gestion environnementale et de valorisation de la nature', file: 'module-7-montage-projet.pdf', type: 'Document d’accompagnement' },
  { id: 'm8', title: 'Module 8 — Concertation territoriale et communication', file: 'module-8-concertation-territoriale.pdf', type: 'Document d’accompagnement' },
  { id: 'maths', title: 'Mathématiques appliquées — exemples de mobilisation', file: 'mathematiques-appliquees-exemples.pdf', type: 'Document thématique' }
];

// Référentiel structuré par capacités, chargé depuis reference-capacities.js
// (blocs B1–B8, capacités C1.1–C8.3, avec critères d'évaluation, savoirs et disciplines).
const CAPACITY_REFERENTIAL = window.REFERENCE_CAPACITIES || {};

let state = null;
let selectedWeek = '2026-S36';
let weekPickerMonthKey = null; // AAAA-MM du mois affiché dans le sélecteur compact
let seqCalMonthKey = null; // AAAA-MM du mois affiché dans le calendrier de la modale séquence
let designPromotionFilter = 'Tous';
let designSemesterFilter = 'Tous';
let semesterPromotionFilter = 'GPN1';
let semesterFilter = 'Semestre 1';
let ganttPromotionFilter = 'Tous';
let ganttSemesterFilters = ['Semestre 1', 'Semestre 3'];
let ganttFocusedUeId = 'ue_21';
let ganttFocusedUeIds = ['ue_21'];
let ganttDensity = 'compact';
let weekBacklogScope = 'week';
let weekBacklogUeFilter = 'Tous';
let weekBacklogSequenceFilter = 'Tous';
let designTeacherFilter = 'Tous';
let designHiddenUeIds = [];
let selectedReferenceCode = 'C4.2';
let selectedReferenceModule = 'm4';
let rubanTeacher = 'Tous';
let rubanMode = 'ruban';
let creneauxPeriod = 'autumn'; // période affichée dans l'éditeur de créneaux type
let weekMaskActive = false;    // masque « créneaux type » dans le Planning hebdo

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

function uid(prefix = 'id') {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

function normalizeData(data) {
  const normalized = {
    version: '4.2.0',
    schoolYear: data.schoolYear || '2026-2027',
    promotions: data.promotions || DEFAULT_PROMOTIONS,
    weeks: data.weeks || [],
    ues: data.ues || [],
    sequences: data.sequences || [],
    sessions: data.sessions || [],
    constraints: data.constraints || [],
    deplacements: Array.isArray(data.deplacements) ? data.deplacements : [],
    reunions: Array.isArray(data.reunions) ? data.reunions : [],
    weekNotes: data.weekNotes || {},
    todoNotes: typeof data.todoNotes === 'string' ? data.todoNotes : '',
    devNotes: typeof data.devNotes === 'string' ? data.devNotes : '',
    rubanOverrides: (data.rubanOverrides && typeof data.rubanOverrides === 'object') ? data.rubanOverrides : {},
    rubanUeCaps: (data.rubanUeCaps && typeof data.rubanUeCaps === 'object' && !Array.isArray(data.rubanUeCaps)) ? data.rubanUeCaps : {},
    weekTemplates: Array.isArray(data.weekTemplates) ? data.weekTemplates.map(normalizeTemplateSlot).filter(Boolean) : [],
    lastSavedAt: data.lastSavedAt || null
  };

  if (!normalized.weeks.some(w => w.id === '2026-S36') || normalized.schoolYear !== '2026-2027') {
    normalized.schoolYear = '2026-2027';
    normalized.weeks = buildAcademicWeeks(2026, 36, 2027, 22);
  }

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
    placementStatus: s.placementStatus || (s.weekId ? 'Définitif EDT' : 'Fictif à placer'),
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
    constraintId: s.constraintId || '', // Lot K — rattachement à une semaine thématique (EIL)
    personalVehicle: !!s.personalVehicle,
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
    reunionId: d.reunionId || '' // Lot M — déplacement issu d'une réunion
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
    personalVehicle: !!r.personalVehicle
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
      description: existing.description || ueDefaultDescription(ref),
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

function ueDefaultDescription(ref) {
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
function templateSemester(periodKey, promo) {
  const period = TEMPLATE_PERIODS.find(p => p.key === periodKey) || TEMPLATE_PERIODS[0];
  return period.semesters[promo] || period.semesters.GPN1;
}
/* Période (automne / printemps) d'une semaine du planning : les semaines 2026
   (S36→S53) = septembre-décembre, les semaines 2027 = janvier-mai. */
function periodOfWeek(week) { return Number(week?.isoYear) === 2026 ? 'autumn' : 'spring'; }
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
/* Contenu interne d'une cellule de l'éditeur (croix + code UE + intitulé + enseignant). */
function templateCellInner(t) {
  const code = templateSlotCode(t);
  return `<button type="button" class="tpl-del" data-del-template="${escapeAttr(t.id)}" title="Supprimer ce créneau" aria-label="Supprimer ce créneau">×</button>
    ${code ? `<div class="tpl-ue">${escapeHtml(code)}</div>` : ''}
    ${t.title ? `<div class="tpl-title">${escapeHtml(t.title)}</div>` : ''}
    ${t.teacher ? `<div class="tpl-teacher">${escapeHtml(t.teacher)}</div>` : ''}`;
}

async function loadData() {
  const brut = await window.OC_SYNC.charger();
  state = normalizeData(brut);
  window.OC_SYNC.memoriserSnapshot(state);
  if (!state.weeks.length) bootstrapWeeks();
  selectedWeek = state.weeks.find(w => w.id === selectedWeek)?.id || state.weeks[0]?.id || selectedWeek;
  const hasVisibleSession = state.sessions.some(s => s.weekId === selectedWeek && isDefinitiveSession(s));
  const firstDefinitive = state.sessions.find(s => isDefinitiveSession(s) && state.weeks.some(w => w.id === s.weekId));
  if (!hasVisibleSession && firstDefinitive) selectedWeek = firstDefinitive.weekId;
  hydrateSelectors();
  renderAll();
  maybeShowTodoAlert();
  setSaveStatus('Données chargées');
}

async function saveData(message = 'Enregistré', { rerender = true } = {}) {
  // Rendu optimiste : l'état local fait foi immédiatement, l'enregistrement
  // réseau (Supabase) arrive ensuite — sinon chaque action figerait l'écran
  // le temps de l'aller-retour.
  if (rerender) renderAll(false);
  setSaveStatus('Sauvegarde…');
  state.version = '4.2.0';
  const resultat = await window.OC_SYNC.enregistrer(state);
  state.lastSavedAt = resultat.lastSavedAt;
  setSaveStatus(resultat.erreurs?.length ? resultat.erreurs[0] : message);
}

let saveToastTimer = null;
function setSaveStatus(text) {
  const el = $('#saveStatus');
  if (!el) return;
  // N5 — toast discret : l'heure suffit (le message est transitoire).
  const suffix = state?.lastSavedAt ? ` · ${new Date(state.lastSavedAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}` : '';
  el.textContent = text + suffix;
  el.classList.add('is-visible');
  clearTimeout(saveToastTimer);
  saveToastTimer = setTimeout(() => el.classList.remove('is-visible'), 2400);
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

/* Crée (si absent) le déplacement lié à une séance cochée « véhicule perso ».
   Ne supprime jamais : décocher la case laisse le déplacement en place, il se
   gère ensuite dans l'onglet Frais (préservation des saisies). */
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
    sessionId: session.id
  });
}

/* Badge du panneau Tableau de bord : nb + total des demandes NON terminées.
   Visible même panneau replié, sans afficher les terminées. */
function updateFraisBadge() {
  const badge = $('#fraisSummaryBadge');
  if (!badge) return;
  const all = state.deplacements || [];
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
  const classeFilter = $('#fraisClasseFilter')?.value || 'all';
  const all = [...(state.deplacements || [])].sort((a, b) => (a.date || '').localeCompare(b.date || '') || String(a.id).localeCompare(String(b.id)));
  if (!all.length) {
    wrap.innerHTML = `<p class="empty-hint">Aucun déplacement enregistré. Cochez « Déplacement en véhicule personnel » sur une séance, ou ajoutez-en un avec « + Déplacement ».</p>`;
    return;
  }
  const matchStatus = d => statusFilter === 'all'
    ? true
    : (statusFilter === 'actives' ? d.statut !== 'Terminée' : d.statut === statusFilter);
  const rows = all.filter(d => matchStatus(d) && (classeFilter === 'all' || d.classe === classeFilter));
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
      <td>${escapeHtml(d.classe || '')}</td>
      <td>${escapeHtml(d.ue || '—')}</td>
      <td title="${escapeAttr(d.keywords || '')}">${escapeHtml(d.keywords ? truncate(d.keywords, 32) : '—')}</td>
      <td class="num">${Number(d.kmAR) || 0}</td>
      <td class="num">${escapeHtml(deplacementTaux(d).toLocaleString('fr-FR', { minimumFractionDigits: 2 }))}</td>
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
        <thead><tr><th>Date</th><th>Lieu</th><th>Conducteur</th><th>Classe</th><th>UE</th><th>Mots-clés</th><th class="num">Km A/R</th><th class="num">Taux</th><th class="num">Total</th><th>Statut</th><th aria-label="Actions"></th></tr></thead>
        <tbody>${body || `<tr><td colspan="11" class="empty-hint">Aucun déplacement pour ce filtre.</td></tr>`}</tbody>
      </table>
    </div>`;
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
  $('#deleteDeplacementButton').style.visibility = isNew ? 'hidden' : 'visible';
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
    sessionId: '',
    reunionId: reunion.id
  });
}

/* Badge du panneau : nombre de réunions enregistrées. */
function updateReunionsBadge() {
  const badge = $('#reunionsSummaryBadge');
  if (!badge) return;
  const n = (state.reunions || []).length;
  badge.textContent = n ? `${n} réunion${n > 1 ? 's' : ''}` : '';
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
  wrap.innerHTML = list.map(r => {
    const dep = r.personalVehicle ? reunionDeplacement(r) : null;
    const depTxt = dep && Number(dep.kmAR) ? ' ' + fmtEuro(deplacementTotal(dep)) : '';
    return `<article class="reunion-card" data-edit-reunion="${escapeAttr(r.id)}">
      <div class="reunion-card-head">
        <span class="reunion-date">${escapeHtml(r.date ? formatDateFr(r.date) : 'Date à préciser')}</span>
        ${r.lieu ? `<span class="reunion-lieu">${escapeHtml(r.lieu)}</span>` : ''}
        ${r.personalVehicle ? `<span class="reunion-vehicle" title="Déplacement en véhicule personnel (voir Frais de déplacement)">🚗${escapeHtml(depTxt)}</span>` : ''}
        <button type="button" class="icon-button small reunion-edit" data-edit-reunion="${escapeAttr(r.id)}" title="Modifier">✎</button>
      </div>
      ${r.participants ? `<p class="reunion-participants"><span class="reunion-label">Participants :</span> ${escapeHtml(r.participants)}</p>` : ''}
      ${r.sujets ? `<p class="reunion-sujets">${escapeHtml(r.sujets)}</p>` : ''}
    </article>`;
  }).join('');
}

function openReunionModal(reunion = null) {
  const isNew = !reunion;
  $('#reunionModalTitle').textContent = isNew ? 'Nouvelle réunion' : 'Modifier la réunion';
  $('#reunionId').value = reunion?.id || '';
  $('#reunionDate').value = reunion?.date || '';
  $('#reunionLieu').value = reunion?.lieu || '';
  $('#reunionParticipants').value = reunion?.participants || '';
  $('#reunionSujets').value = reunion?.sujets || '';
  $('#reunionVehicle').checked = !!reunion?.personalVehicle;
  const dep = reunion ? reunionDeplacement(reunion) : null;
  $('#reunionFraisHint').hidden = !dep;
  $('#deleteReunionButton').style.visibility = isNew ? 'hidden' : 'visible';
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

function downloadBlob(content, mime, ext) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const now = new Date();
  const stamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  const a = document.createElement('a');
  a.href = url;
  a.download = `frais-deplacement_${stamp}.${ext}`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  setSaveStatus(`Frais exportés (${ext.toUpperCase()})`);
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
  const counts = `${(parsed.ues || []).length} UE, ${(parsed.sequences || []).length} séquences, ${(parsed.sessions || []).length} séances`;
  if (!window.confirm(`Importer ces données (${counts}) ?\n\nCela REMPLACERA toutes les données actuellement enregistrées dans le portail. Pensez à exporter d’abord si besoin.`)) return;
  state = normalizeData(parsed);
  if (!state.weeks.length) bootstrapWeeks();
  selectedWeek = state.weeks.find(w => w.id === selectedWeek)?.id || state.weeks[0]?.id || selectedWeek;
  hydrateSelectors();
  try {
    await saveData('Données importées');
  } catch (e) {
    setSaveStatus('Import affiché, mais erreur d’enregistrement');
  }
  renderAll();
  maybeShowTodoAlert();
}


function bootstrapWeeks() {
  state.schoolYear = state.schoolYear || '2026-2027';
  state.weeks = buildAcademicWeeks(2026, 36, 2027, 22);
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

function formatDateShort(date) {
  return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function hydrateSelectors() {
  const promoOptions = state.promotions.map(p => `<option value="${escapeAttr(p)}">${escapeHtml(p)}</option>`).join('');
  const promoOptionsWithAll = `<option value="Tous">Toutes</option>${promoOptions}`;
  const semesterOptions = SEMESTERS.map(s => `<option value="${escapeAttr(s)}">${escapeHtml(s)}</option>`).join('');
  const semesterOptionsWithAll = `<option value="Tous">Tous</option>${semesterOptions}`;
  const weekOptions = state.weeks.map(w => `<option value="${escapeAttr(w.id)}">${escapeHtml(w.label)} · ${escapeHtml(w.dateRange)}</option>`).join('');
  // Lot T(b) — menu « Semaine » de la modale séance : n° seul (S37, S38…) sans les dates.
  const weekOptionsShort = state.weeks.map(w => `<option value="${escapeAttr(w.id)}">${escapeHtml(w.label)}</option>`).join('');

  setOptions('#weekSelect', weekOptions, selectedWeek);
  setOptions('#sessionWeek', weekOptionsShort, selectedWeek);
  setOptions('#ueStartWeek', `<option value="">À préciser</option>${weekOptions}`, $('#ueStartWeek')?.value || '');
  setOptions('#ueEndWeek', `<option value="">À préciser</option>${weekOptions}`, $('#ueEndWeek')?.value || '');

  setOptions('#designPromotionFilter', promoOptionsWithAll, designPromotionFilter);
  setOptions('#designSemesterFilter', semesterOptionsWithAll, designSemesterFilter);
  refreshTeacherFilters();
  setOptions('#semesterPromotionFilter', promoOptions, semesterPromotionFilter);
  setOptions('#semesterFilter', semesterOptions, semesterFilter);
  setOptions('#ganttPromotionFilter', promoOptionsWithAll, ganttPromotionFilter);
  renderGanttSemesterChoices();

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

function renderGanttSemesterChoices() {
  const container = $('#ganttSemesterChoices');
  if (!container) return;
  const selected = new Set(ganttSemesterFilters);
  container.innerHTML = SEMESTERS.map(sem => `<label class="checkbox-chip"><input type="checkbox" value="${escapeAttr(sem)}" ${selected.has(sem) ? 'checked' : ''}><span>${escapeHtml(sem.replace('Semestre ', 'S'))}</span></label>`).join('');
}

function renderGanttUeFocusOptions(ues = []) {
  const select = $('#ganttUeFocus');
  if (!select) return;
  const sorted = [...ues].sort((a, b) => `${a.semester}-${a.promotion}-${a.code}`.localeCompare(`${b.semester}-${b.promotion}-${b.code}`));
  const options = sorted.map(ue => `<option value="${escapeAttr(ue.id)}">${escapeHtml(ue.code)} · ${escapeHtml(ue.title)} · ${escapeHtml(ue.promotion)} · ${escapeHtml(ue.semester.replace('Semestre ', 'S'))}</option>`).join('');
  select.innerHTML = options || '<option value="">Aucune UE disponible</option>';
  if (!sorted.some(ue => ue.id === ganttFocusedUeId)) ganttFocusedUeId = sorted[0]?.id || '';
  select.value = ganttFocusedUeId;
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
  refreshWeekBacklogSequenceFilter();
}

function refreshWeekBacklogSequenceFilter() {
  const select = $('#weekBacklogSequenceFilter');
  if (!select || !state) return;
  const sequences = state.sequences.filter(seq => weekBacklogUeFilter === 'Tous' || seq.ueId === weekBacklogUeFilter);
  const options = ['<option value="Tous">Toutes les séquences</option>'].concat(
    sequences.map(seq => `<option value="${escapeAttr(seq.id)}">${escapeHtml(seq.title)} · ${escapeHtml(ueLabel(seq.ueId))}</option>`)
  ).join('');
  setOptions('#weekBacklogSequenceFilter', options, weekBacklogSequenceFilter);
  if (![...select.options].some(o => o.value === weekBacklogSequenceFilter)) weekBacklogSequenceFilter = 'Tous';
}


function teacherTokens(value = '') {
  return String(value || '').split(/[;,/]/).map(x => x.trim()).filter(Boolean);
}

function allTeachers() {
  const set = new Set();
  state?.ues?.forEach(ue => teacherTokens(ue.teacher).forEach(t => set.add(t)));
  state?.sequences?.forEach(seq => teacherTokens(seq.teacher).forEach(t => set.add(t)));
  state?.sessions?.forEach(session => teacherTokens(session.teacher).forEach(t => set.add(t)));
  return [...set].sort((a, b) => a.localeCompare(b, 'fr'));
}

function refreshTeacherFilters() {
  const options = ['<option value="Tous">Tous les contenus</option>'].concat(allTeachers().map(t => `<option value="${escapeAttr(t)}">${escapeHtml(t)}</option>`)).join('');
  setOptions('#designTeacherFilter', options, designTeacherFilter);
  if (!$('#designTeacherFilter') || ![...$('#designTeacherFilter').options].some(o => o.value === designTeacherFilter)) designTeacherFilter = 'Tous';
}

function matchesTeacherFilter(entity, related = []) {
  if (designTeacherFilter === 'Tous') return true;
  const tokens = [];
  [entity, ...related].forEach(x => teacherTokens(x?.teacher).forEach(t => tokens.push(t)));
  return tokens.some(t => t.toLowerCase() === designTeacherFilter.toLowerCase());
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
  renderDashboard();
  renderDesign();
  if ($('#semesterTable')) renderSemester();
  renderGantt();
  renderPlanning();
  if ($('#referenceModuleContent')) renderReference();
  if ($('#rubanGrid')) renderRuban();
  if ($('#creneauxGrids') && rubanMode === 'creneaux') renderCreneaux();
  if ($('#fraisTableWrap')) renderFrais();
  if ($('#reunionsList')) renderReunions();
  // Restaurer après le re-rendu (le DOM a la même hauteur, la position est conservée).
  window.scrollTo({ top: scrollY });
}

/* Préserve l'état ouvert/fermé des <details data-open-key> à travers un
   re-render qui réécrit innerHTML. captureOpenKeys renvoie null si le
   conteneur était vide (premier rendu) : on laisse alors les valeurs par
   défaut du gabarit au lieu de tout refermer. */
function captureOpenKeys(root) {
  if (!root || !root.querySelector('details[data-open-key]')) return null;
  return new Set(Array.from(root.querySelectorAll('details[data-open-key][open]'), d => d.dataset.openKey));
}
function restoreOpenKeys(root, keys) {
  if (!root || !keys) return;
  root.querySelectorAll('details[data-open-key]').forEach(d => { d.open = keys.has(d.dataset.openKey); });
}

function renderDashboard() {
  const definitive = state.sessions.filter(isDefinitiveSession);
  const fictive = state.sessions.filter(isFictiveSession);
  const plannedHours = definitive.reduce((sum, session) => sum + sessionDurationSlots(session) * 55 / 60, 0);
  const linkedSessions = state.sessions.filter(s => s.sequenceId && s.ueId).length;

  $('#kpiGrid').innerHTML = [
    ['UE', state.ues.length, 'Nombre d’unités d’enseignement'],
    ['Séquences', state.sequences.length, 'Nombre de séquences pédagogiques'],
    ['Séances à placer', fictive.length, 'Séances non encore posées dans un emploi du temps'],
    ['Plages définitives EDT', definitive.length, 'Séances posées sur un créneau du Planning hebdo'],
    ['Heures placées', plannedHours.toFixed(1).replace('.', ',') + ' h', 'Total des heures des séances posées dans l’EDT'],
    ['Séances rattachées', `${linkedSessions}/${state.sessions.length}`, 'Séances liées à la fois à une UE et à une séquence, sur le total des séances (une séance « rattachée » a donc une UE et une séquence de rattachement).']
  ].map(([label, value, tip]) => `<article class="kpi-card"${tip ? ` title="${escapeAttr(tip)}"` : ''}><strong>${value}</strong><span>${label}</span></article>`).join('');

  $('#dashboardBacklog').innerHTML = fictive.length
    ? fictive.slice(0, 12).map(s => sessionListItem(s)).join('')
    : '<p class="meta">Aucune séance à placer en attente.</p>';

  $('#constraintsList').innerHTML = state.constraints.length
    ? state.constraints.map(c => `<div class="row-item" data-edit-constraint="${escapeAttr(c.id)}"><div class="row-main"><strong class="row-title">${escapeHtml(c.label)}</strong><span class="row-meta">${escapeHtml(c.type)} · ${formatDateFr(c.start)} → ${formatDateFr(c.end)} · ${(c.promotions || []).length ? escapeHtml((c.promotions || []).join(', ')) : 'Toutes promotions'}</span></div></div>`).join('')
    : '<p class="meta">Aucune contrainte enregistrée.</p>';

  // Notes libres « À faire » : ne pas réécrire le champ pendant la saisie (sauvegarde auto)
  const todo = $('#todoNotes');
  if (todo && document.activeElement !== todo) todo.value = state.todoNotes || '';
  updateTodoStatus();
  // Notes libres « Bugs & améliorations » : même précaution (ne pas écraser pendant la saisie)
  const dev = $('#devNotes');
  if (dev && document.activeElement !== dev) dev.value = state.devNotes || '';
  updateDevStatus();
}

function updateTodoStatus() {
  const status = $('#todoNotesStatus');
  if (!status) return;
  const value = ($('#todoNotes')?.value ?? state?.todoNotes ?? '').trim();
  status.textContent = value ? 'Notes en attente' : 'Vide';
  status.classList.toggle('has-todo', !!value);
}

function updateDevStatus() {
  const status = $('#devNotesStatus');
  if (!status) return;
  const value = ($('#devNotes')?.value ?? state?.devNotes ?? '').trim();
  status.textContent = value ? 'Notes en attente' : 'Vide';
  status.classList.toggle('has-todo', !!value);
}

function setWeekNotesStatus(text) {
  const status = $('#weekNotesStatus');
  if (status) status.textContent = text || '';
}

function maybeShowTodoAlert() {
  const alert = $('#todoAlert');
  if (!alert) return;
  const has = !!(state?.todoNotes || '').trim();
  alert.hidden = !has;
}

function renderDesign() {
  const search = ($('#designSearch')?.value || '').trim().toLowerCase();
  const eligibleUes = state.ues.filter(ue => {
    const sequences = state.sequences.filter(seq => seq.ueId === ue.id);
    const sessions = state.sessions.filter(session => session.ueId === ue.id || sequences.some(seq => seq.id === session.sequenceId));
    const matchesPromotion = designPromotionFilter === 'Tous' || ue.promotion === designPromotionFilter;
    const matchesSemester = designSemesterFilter === 'Tous' || ueInSemester(ue, designSemesterFilter);
    const capacityHaystack = ueCapacities(ue).map(cap => `${cap.code} ${cap.title}`).join(' ').toLowerCase();
    const haystack = [ue.code, ue.title, ue.description, ue.promotion, ue.semester, ue.teacher, capacityHaystack, ...sequences.map(s => [s.title, s.objectives, s.keywords, s.teacher].join(' ')), ...sessions.map(s => [s.title, s.objectives, s.keywords, s.teacher].join(' '))].join(' ').toLowerCase();
    const matchesSearch = !search || haystack.includes(search);
    const matchesTeacher = matchesTeacherFilter(ue, [...sequences, ...sessions]);
    return matchesPromotion && matchesSemester && matchesSearch && matchesTeacher;
  });

  renderDesignUeChoices(eligibleUes);
  const hidden = new Set(designHiddenUeIds);
  const ues = eligibleUes.filter(ue => !hidden.has(ue.id));

  const byPromotion = state.promotions.map(promo => ({ promo, ues: ues.filter(ue => ue.promotion === promo) })).filter(group => group.ues.length);
  const tree = $('#ueTree');
  const openKeys = captureOpenKeys(tree);
  tree.innerHTML = byPromotion.length
    ? byPromotion.map(group => `<details class="promo-group tree-row-group" data-open-key="promo:${escapeAttr(group.promo)}"><summary><span>Promotion</span><strong>${escapeHtml(group.promo)}</strong><em>${group.ues.length} UE</em></summary>${group.ues.map(renderUeCard).join('')}</details>`).join('')
    : '<section class="panel"><p class="meta">Aucune UE ne correspond aux filtres.</p></section>';
  restoreOpenKeys(tree, openKeys);
}

/* Case à cocher par UE, limitée aux UE déjà éligibles selon Promotion /
   Semestre / Enseignant / Recherche : on affine encore l'affichage sans
   perdre la sélection faite via les autres filtres. */
function renderDesignUeChoices(eligibleUes = []) {
  const container = $('#designUeChoices');
  if (!container) return;
  designHiddenUeIds = designHiddenUeIds.filter(id => eligibleUes.some(ue => ue.id === id));
  const hidden = new Set(designHiddenUeIds);
  if (!eligibleUes.length) {
    container.innerHTML = '<p class="meta tight">Aucune UE disponible avec ces filtres.</p>';
    return;
  }
  container.innerHTML = eligibleUes.map(ue => {
    const color = ueColor(ue.id);
    return `<label class="checkbox-chip ue-choice" style="--ue-color:${color};--ue-soft:${hexToRgba(color, .14)}" title="${escapeAttr(ue.title)}">
      <input type="checkbox" value="${escapeAttr(ue.id)}" ${hidden.has(ue.id) ? '' : 'checked'}>
      <span>${escapeHtml(compactUeCode(ue.code))}</span>
    </label>`;
  }).join('');
}

function renderDesignReferenceSummary() {
  const bySemester = SEMESTERS.map(sem => {
    const ues = state.ues.filter(ue => ue.semester === sem);
    const count = ues.reduce((sum, ue) => sum + ueCapacities(ue).length, 0);
    return `<span class="reference-chip"><strong>${escapeHtml(sem)}</strong> ${ues.length} UE · ${count} capacité(s)</span>`;
  }).join('');
  $('#designReferenceSummary').innerHTML = bySemester;
}

function renderUeCard(ue) {
  const sequences = state.sequences.filter(seq => seq.ueId === ue.id);
  const sessionCount = state.sessions.filter(s => s.ueId === ue.id).length;
  // Lot K — séances d'EIL (rattachées à une semaine thématique) portées par cette
  // UE : regroupées par contrainte thématique, sous les séquences.
  const eilGroups = {};
  state.sessions.filter(s => s.ueId === ue.id && s.constraintId).forEach(s => {
    (eilGroups[s.constraintId] = eilGroups[s.constraintId] || []).push(s);
  });
  const eilBlock = Object.entries(eilGroups).map(([cid, list]) => {
    const c = findConstraint(cid);
    const ordered = [...list].sort((a, b) => sessionSortKey(a).localeCompare(sessionSortKey(b)));
    return `<div class="eil-detail-group"><div class="eil-detail-head"><span class="entity-level-label">EIL</span><strong>${escapeHtml(c ? c.label : 'Semaine thématique')}</strong><button class="small" data-new-eil-session="${escapeAttr(cid)}" data-eil-ue="${escapeAttr(ue.id)}">+ Séance</button></div><div class="session-card-grid">${ordered.map((s, i) => renderSessionCard(s, i + 1)).join('')}</div></div>`;
  }).join('');
  // Séances rattachées à l'UE mais à AUCUNE séquence (et hors semaine thématique
  // EIL) : sinon elles n'apparaissaient nulle part dans l'arbre de conception.
  const looseSessions = state.sessions
    .filter(s => s.ueId === ue.id && !s.sequenceId && !s.constraintId)
    .sort((a, b) => sessionSortKey(a).localeCompare(sessionSortKey(b)));
  // Bloc toujours présent (même vide) pour servir de zone de dépôt : glisser une
  // séance ici la détache de sa séquence. Quand il n'y a aucune séance libre, le
  // bloc reste masqué et n'apparaît que pendant un glissement (classe .loose-empty).
  const looseInner = looseSessions.length
    ? looseSessions.map((s, i) => renderSessionCard(s, i + 1)).join('')
    : '<p class="loose-empty-hint">Glissez une séance ici pour la détacher de sa séquence.</p>';
  const looseBlock = `<div class="loose-detail-group${looseSessions.length ? '' : ' loose-empty'}" data-loose-drop="${escapeAttr(ue.id)}"><div class="loose-detail-head"><span class="entity-level-label">Sans séquence</span><strong>Séances rattachées directement à l’UE</strong><button class="small" data-new-session-ue="${escapeAttr(ue.id)}">+ Séance</button></div><div class="session-card-grid">${looseInner}</div></div>`;
  const color = ueColor(ue.id);
  const capCodes = ueCapacities(ue).map(c => c.code).join(', ');
  const metaLine = renderMetaLine([
    ueDatePeriod(ue),
    ue.hoursTarget,
    compactTeacherInitials(ue.teacher),
    capCodes
  ]);
  return `<details class="entity-card entity-ue" data-open-key="ue:${escapeAttr(ue.id)}" style="--ue-color:${color}; --ue-soft:${hexToRgba(color, .14)}">
    <summary>
      <span class="entity-chevron">▸</span>
      <span class="entity-level-label">UE</span>
      <span class="code-badge entity-code">${escapeHtml(compactUeCode(ue.code))}</span>
      <span class="entity-title">${escapeHtml(ue.title)}</span>
      <span class="entity-tag">${escapeHtml(ue.promotion)} · ${escapeHtml(shortSemester(ue.semester))}</span>
      <span class="entity-count">${sequences.length} séq. · ${sessionCount} séance(s)</span>
    </summary>
    <div class="entity-body">
      ${metaLine}
      ${ue.description ? `<p class="entity-description">${escapeHtml(ue.description)}</p>` : ''}
      <div class="card-actions">
        <button class="small secondary" data-edit-ue="${escapeAttr(ue.id)}">Modifier</button>
        <button class="small secondary" data-export-ue="${escapeAttr(ue.id)}">Exporter</button>
        <span class="action-separator"></span>
        <button class="small" data-new-sequence-ue="${escapeAttr(ue.id)}">+ Séquence</button>
      </div>
      <div class="nested-list">${sequences.length ? sequences.map(renderSequenceCard).join('') : '<p class="meta">Aucune séquence créée dans cette UE pour l’instant.</p>'}</div>
      ${eilBlock}
      ${looseBlock}
    </div>
  </details>`;
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
  return {
    start,
    end,
    label: start && end ? (start === end ? start : `${start} → ${end}`) : (seq.targetWeeks || '')
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

/* Initiales d'UN seul enseignant (déjà des initiales si saisi ainsi, sinon
   premières lettres de chaque mot du nom). */
function teacherInitialsOf(token = '') {
  const clean = String(token).trim();
  if (!clean) return '';
  if (/^[A-ZÀ-Ÿ]{1,4}$/i.test(clean) && !clean.includes(' ')) return clean.toUpperCase();
  const parts = clean.split(/\s+/).filter(Boolean);
  return parts.map(part => part[0] || '').join('').slice(0, 4).toUpperCase();
}

function compactTeacherInitials(value = '') {
  return teacherTokens(value).map(teacherInitialsOf).filter(Boolean).join(', ');
}

/* Liste { name, initials } pour afficher une pastille par enseignant. */
function teacherPips(value = '') {
  return teacherTokens(value)
    .map(name => ({ name, initials: teacherInitialsOf(name) }))
    .filter(t => t.initials);
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
  const definitiveCount = sessions.filter(isDefinitiveSession).length;
  const color = sequenceColor(seq.id); // Lot L — couleur cohérente avec la frise
  const period = sequencePeriodParts(seq);
  const periodLabel = period.start && period.end ? (period.start === period.end ? period.start : `${period.start} → ${period.end}`) : (period.label || '');
  const teachers = compactTeacherInitials(seq.teacher || findUe(seq.ueId)?.teacher || '');
  const keywords = compactKeywords(seq.keywords, 8);
  const capCodes = (seq.capacityCodes || []).join(', ');
  const metaLine = renderMetaLine([periodLabel, seq.hoursEstimate, teachers, capCodes]);
  // Séances numérotées à partir de 1 dans l'ordre de la séquence.
  const orderedSessions = [...sessions].sort((a, b) => sessionSortKey(a).localeCompare(sessionSortKey(b)));
  return `<details class="entity-card entity-sequence" data-open-key="seq:${escapeAttr(seq.id)}" data-seq-drop="${escapeAttr(seq.id)}" style="--ue-color:${color}; --ue-soft:${hexToRgba(color, .12)}">
    <summary>
      <span class="entity-chevron">▸</span>
      <span class="entity-level-label">Séquence</span>
      <span class="entity-title">${escapeHtml(seq.title)}</span>
      <span class="status-pill ${statusSlug(seq.status)}">${escapeHtml(seq.status || 'Prévue')}</span>
      <span class="entity-count">${fictiveCount} à placer · ${definitiveCount} EDT</span>
    </summary>
    <div class="entity-body sequence-body">
      ${metaLine}
      ${seq.periodNote ? `<p class="entity-description">${escapeHtml(seq.periodNote)}</p>` : ''}
      ${seq.objectives ? `<p class="entity-description"><strong>Objectifs —</strong> ${escapeHtml(truncate(seq.objectives, 280))}</p>` : ''}
      ${keywords.length ? `<p class="entity-description entity-keywords"><strong>Mots-clés —</strong> ${escapeHtml(keywords.join(', '))}</p>` : ''}
      <div class="card-actions">
        <button class="small secondary" data-edit-sequence="${escapeAttr(seq.id)}">Modifier</button>
        <button class="small secondary" data-export-sequence="${escapeAttr(seq.id)}">Exporter</button>
        <span class="action-separator"></span>
        <button class="small" data-new-session-sequence="${escapeAttr(seq.id)}">+ Séance</button>
      </div>
      <div class="session-card-grid">
        ${orderedSessions.length ? orderedSessions.map((s, i) => renderSessionCard(s, i + 1)).join('') : '<p class="meta">Aucune séance rattachée pour l’instant.</p>'}
      </div>
    </div>
  </details>`;
}

/* Associe un statut texte libre (séquence ou séance) à une classe de pastille.
   Les libellés viennent des formulaires : on normalise juste pour le style. */
function statusSlug(status = '') {
  const slug = typeSlug(status);
  if (slug.includes('arbitrer')) return 'status-a-arbitrer';
  if (slug.includes('construction')) return 'status-en-construction';
  if (slug.includes('confirmer')) return 'status-a-confirmer';
  if (slug.includes('cours')) return 'status-en-cours';
  if (slug.includes('terminee')) return 'status-terminee';
  if (slug.includes('realisee')) return 'status-realisee';
  if (slug.includes('reportee')) return 'status-reportee';
  if (slug.includes('annulee')) return 'status-annulee';
  return 'status-prevue';
}

/* Carte de séance « format fiche » : petit rectangle vertical (évoque une
   feuille A4), numéroté à partir de 1 dans la séquence. Un bouton Modifier
   ouvre le formulaire. Forme volontairement différente des cartes UE/séquence
   (qui sont des bandeaux horizontaux dépliables). */
function renderSessionCard(s, number) {
  const color = sessionTint(s); // Lot L — la séance hérite de la couleur de sa séquence
  const temporal = isFictiveSession(s)
    ? [weekLabel(s.targetWeekId), s.fictiveDay !== '' ? DAY_NAMES[Number(s.fictiveDay)] : '', sessionHoursLabel(s)].filter(Boolean).join(' · ')
    : [weekLabel(s.weekId), DAY_NAMES[s.day], slotLabel(s.startSlot)].filter(Boolean).join(' · ');
  const keywords = compactKeywords(s.keywords, 4);
  return `<article class="session-card ${typeClass(s.type)}" draggable="true" style="--ue-color:${color}" data-drag-session="${escapeAttr(s.id)}" data-edit-session="${escapeAttr(s.id)}">
    <header class="session-card-head">
      <span class="session-card-number">${number}</span>
      <span class="status-pill ${isFictiveSession(s) ? 'status-a-placer' : 'status-definitif-edt'}">${isFictiveSession(s) ? 'À placer' : 'EDT'}</span>
    </header>
    <h5 class="session-card-title">${escapeHtml(s.title)}</h5>
    ${s.type ? `<span class="session-card-type">${escapeHtml(s.type)}</span>` : ''}
    ${temporal ? `<p class="session-card-meta">${escapeHtml(temporal)}</p>` : ''}
    ${s.room ? `<p class="session-card-meta">${escapeHtml(s.room)}</p>` : ''}
    ${keywords.length ? `<p class="session-card-keywords">${escapeHtml(keywords.join(', '))}</p>` : ''}
    <footer class="session-card-foot">
      <button class="small secondary" data-edit-session="${escapeAttr(s.id)}">Modifier</button>
    </footer>
  </article>`;
}

function renderSemester() {
  const ues = state.ues.filter(ue => ue.promotion === semesterPromotionFilter && ueInSemester(ue, semesterFilter));
  const weeks = weeksForSemester(semesterFilter);
  const header = `<tr><th class="semester-week">Semaine</th><th>Dates</th><th>Périodes / contraintes</th>${ues.map(ue => `<th><span class="th-ue-code">${escapeHtml(ue.code)}</span><br><span>${escapeHtml(ue.title)}</span></th>`).join('')}</tr>`;
  const rows = weeks.map(week => {
    const constraints = constraintsForWeek(week, semesterPromotionFilter);
    return `<tr>
      <td class="semester-week"><strong>${escapeHtml(week.label)}</strong></td>
      <td class="date-cell">${escapeHtml(week.dateRange)}</td>
      <td class="constraints-cell">${constraints.length ? constraints.map(renderConstraintPill).join('') : '<span class="meta">Aucune période renseignée</span>'}</td>
      ${ues.map(ue => `<td class="semester-cell">${renderSemesterCell(ue, week)}</td>`).join('')}
    </tr>`;
  }).join('');
  $('#semesterTable').innerHTML = `<thead>${header}</thead><tbody>${rows}</tbody>`;
}

function renderConstraintPill(c) {
  const examFlag = c.exam ? '<span class="exam-flag" title="Détails examen / jaquette renseignés">jaquette</span>' : '';
  return `<button class="constraint-pill constraint-${typeSlug(c.type)}" data-edit-constraint="${escapeAttr(c.id)}" title="${escapeAttr(examConstraintTooltip(c) || c.notes || c.type)}"><strong>${escapeHtml(c.label)}${examFlag}</strong><span>${escapeHtml(c.type)}</span></button>`;
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

function renderSemesterCell(ue, week) {
  const sequences = state.sequences.filter(seq => seq.ueId === ue.id && sequenceMatchesWeek(seq, week));
  const sessions = state.sessions.filter(s => s.ueId === ue.id && (s.targetWeekId === week.id || s.weekId === week.id));
  const blocks = [];
  sequences.forEach(seq => {
    const count = state.sessions.filter(s => s.sequenceId === seq.id).length;
    blocks.push(`<div class="semester-block semester-seq" data-edit-sequence="${escapeAttr(seq.id)}"><span class="block-kind">Séquence</span><strong>${escapeHtml(seq.title)}</strong><div class="meta">${escapeHtml(seq.status || '')} · ${escapeHtml(seq.hoursEstimate || 'Volume ?')} · ${count} séance(s)</div>${renderCapacityPills(seq.capacityCodes || [])}</div>`);
  });
  sessions.forEach(s => {
    blocks.push(`<div class="semester-block semester-session ${isFictiveSession(s) ? 'fictif' : 'definitif'}" data-edit-session="${escapeAttr(s.id)}"><span class="block-kind">Séance ${isFictiveSession(s) ? 'à placer' : 'EDT'}</span><strong>${escapeHtml(s.title)}</strong><div class="meta">${escapeHtml(s.type || '')}${isFictiveSession(s) ? ` · ${escapeHtml(s.expectedDuration || '')} · ${escapeHtml(s.fictiveSlot || '')}` : ` · ${DAY_NAMES[s.day]} ${slotLabel(s.startSlot)}`}</div></div>`);
  });
  return blocks.length ? blocks.join('') : '<span class="meta">—</span>';
}

function renderGantt() {
  if (!$('#ganttTimeline')) return;
  if (!ganttSemesterFilters.length) ganttSemesterFilters = ['Semestre 1'];
  const weeks = uniqueWeeks(ganttSemesterFilters.flatMap(weeksForSemester));
  const ues = state.ues.filter(ue => (ganttPromotionFilter === 'Tous' || ue.promotion === ganttPromotionFilter) && ueSemesters(ue).some(s => ganttSemesterFilters.includes(s)));
  renderGanttUeChoices(ues);
  const selectedUes = selectedTimelineUes(ues);
  renderGanttTimeline(selectedUes, weeks);
}

function renderGanttUeChoices(ues = []) {
  const container = $('#ganttUeChoices');
  if (!container) return;
  const sorted = [...ues].sort((a, b) => `${a.semester}-${a.promotion}-${a.code}`.localeCompare(`${b.semester}-${b.promotion}-${b.code}`));
  if (!ganttFocusedUeIds.length && ganttFocusedUeId) ganttFocusedUeIds = [ganttFocusedUeId];
  if (!sorted.some(ue => ganttFocusedUeIds.includes(ue.id))) ganttFocusedUeIds = sorted.slice(0, 2).map(ue => ue.id);
  const selected = new Set(ganttFocusedUeIds);
  container.innerHTML = sorted.length ? sorted.map(ue => {
    const color = ueColor(ue.id);
    return `<label class="checkbox-chip ue-choice" style="--ue-color:${color};--ue-soft:${hexToRgba(color,.12)}"><input type="checkbox" value="${escapeAttr(ue.id)}" ${selected.has(ue.id) ? 'checked' : ''}><span title="${escapeAttr(ue.title)}">${escapeHtml(ue.code.replace('UE ', ''))}</span></label>`;
  }).join('') : '<p class="meta">Aucune UE disponible avec ces filtres.</p>';
}

function selectedTimelineUes(ues = []) {
  const ids = new Set(ganttFocusedUeIds);
  const selected = ues.filter(ue => ids.has(ue.id));
  return selected.length ? selected : ues.slice(0, 1);
}

function renderGanttTimeline(ues = [], weeks = []) {
  const container = $('#ganttTimeline');
  if (!container) return;
  // Mémoriser le défilement horizontal de chaque frise UE avant de la recréer,
  // pour le restaurer ensuite (sinon la frise « saute » après un déplacement).
  const scrollMemory = {};
  container.querySelectorAll('.timeline-ue-card').forEach(card => {
    const id = card.dataset.ueId;
    const scroller = card.querySelector('.timeline-scroll');
    if (id && scroller) scrollMemory[id] = scroller.scrollLeft;
  });
  const visibleWeeks = weeks.length ? weeks : uniqueWeeks(ganttSemesterFilters.flatMap(weeksForSemester));
  if (!ues.length) {
    container.innerHTML = '<section class="panel"><p class="meta">Sélectionner au moins une UE à afficher.</p></section>';
    return;
  }
  container.innerHTML = ues.map((ue, index) => renderOneUeTimeline(ue, visibleWeeks, index)).join('');
  // Restaurer le défilement horizontal mémorisé.
  container.querySelectorAll('.timeline-ue-card').forEach(card => {
    const id = card.dataset.ueId;
    const scroller = card.querySelector('.timeline-scroll');
    if (id && scroller && scrollMemory[id] != null) scroller.scrollLeft = scrollMemory[id];
  });
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

function renderOneUeTimeline(ue, visibleWeeks, index = 0) {
  const sequences = state.sequences.filter(seq => seq.ueId === ue.id).sort((a, b) => firstSequenceWeekIndex(a, visibleWeeks) - firstSequenceWeekIndex(b, visibleWeeks));
  const sessions = state.sessions.filter(s => s.ueId === ue.id);
  const promotion = ue.promotion;
  const densityClass = ganttDensity === 'comfort' ? 'timeline-comfort' : 'timeline-compact';
  // UNE seule grille pour toute la frise : colonne d'étiquettes + une colonne
  // par semaine. Tous les bandeaux (mois, semaines, séquences, jours) sont des
  // lignes de CETTE grille, donc les colonnes de semaines sont rigoureusement
  // alignées entre la ligne des séquences et celles des jours, quelle que soit
  // la largeur de la fenêtre (c'était la cause du décalage en demi-écran).
  const columnsStyle = `grid-template-columns: var(--timeline-label-col) repeat(${visibleWeeks.length}, minmax(var(--timeline-week-min), 1fr)); --timeline-week-count: ${visibleWeeks.length};`;
  const ueStyle = `--ue-color:${ueColor(ue.id)};--ue-soft:${hexToRgba(ueColor(ue.id), .12)};--ue-pale:${hexToRgba(ueColor(ue.id), .06)}`;

  const monthBands = monthBandsForWeeks(visibleWeeks);
  const monthRow = `<div class="timeline-corner timeline-corner-month" style="grid-column: 1;"></div>${monthBands.map(band => `<div class="timeline-month" style="grid-column: ${band.start + 2} / ${band.end + 3};">${escapeHtml(band.label)}</div>`).join('')}`;

  const weekRow = `<div class="timeline-row-label header-label">Sem.</div>${visibleWeeks.map(week => {
    const constraints = constraintsForWeek(week, promotion);
    const blocked = isBlockedWeek(week, promotion);
    // Lot K — le libellé d'une contrainte THÉMATIQUE est porté par sa bande (piste
    // séquences), pas dupliqué dans l'entête. L'entête ne liste donc que les autres
    // contraintes (vacances, examens…). Pastille = semaine thématique d'une AUTRE
    // promo (repère non bloquant : marge pour caler des cours avec cette promo).
    const headerConstraints = constraints.filter(c => !isThematicConstraint(c));
    const otherPromoThematic = thematicItemsForWeek(week).filter(i => !i.promos.includes(promotion));
    // Lot L — samedi : séance posée le samedi (jour 5) de CETTE UE → alerte en tête de
    // colonne (comme fériés/thématiques), sans couloir Samedi dans la frise.
    const satSessions = sessions.filter(s => isDefinitiveSession(s) && Number(s.day) === 5 && s.weekId === week.id);
    return `<div class="timeline-week-head ${constraints.length ? 'has-constraint' : ''} ${blocked ? 'blocked-week' : ''} ${otherPromoThematic.length ? 'has-eil-info' : ''}${satSessions.length ? ' has-sat' : ''}" data-week-drop="${escapeAttr(week.id)}">
      <strong>${escapeHtml(week.label.replace('S0', 'S'))}</strong><span>${escapeHtml(compactDateRange(week.dateRange))}</span>${headerConstraints.length ? `<em>${headerConstraints.map(c => escapeHtml(c.label)).join(' · ')}</em>` : ''}${otherPromoThematic.length ? `<em class="timeline-week-eil" title="${escapeAttr('Autre(s) promo(s) en semaine thématique : ' + otherPromoThematic.map(i => `${i.title} (${i.promos.join('/')})`).join(' · '))}">◇ ${escapeHtml(otherPromoThematic.map(i => `${i.promos.join('/')} : ${i.title}`).join(' · '))}</em>` : ''}${satSessions.length ? `<em class="timeline-week-sat" title="${escapeAttr('Samedi : ' + satSessions.map(s => s.title).join(' · '))}">📅 Sam : ${escapeHtml(satSessions.map(s => s.title).join(' · '))}</em>` : ''}
    </div>`;
  }).join('')}`;

  const sequenceBands = sequences.flatMap(seq => sequenceWeekSegments(seq, visibleWeeks).map(segment => ({...segment, seq})));
  const constraintBands = timelineConstraintBands(promotion, visibleWeeks);
  // À l'intérieur de .timeline-sequence-track (sous-grille calée sur les
  // colonnes de semaines), la colonne 1 = première semaine. On utilise donc
  // startIndex+1 .. endIndex+2, et non +2/+3 comme dans la grille parente.
  // Les périodes/contraintes occupent leur(s) couloir(s) réservé(s) EN HAUT ;
  // les séquences se rangent dessous. Dans chaque groupe, deux bandes qui ne se
  // chevauchent pas partagent la même hauteur (ex. Maths appliquées #1/#2, ou
  // Toussaint / armistice / examens). Gain de place vertical.
  const constraintItems = constraintBands.map(segment => ({ kind: 'constraint', startIndex: segment.startIndex, endIndex: segment.endIndex, segment }));
  const sequenceItems = sequenceBands.map(segment => ({ kind: 'sequence', startIndex: segment.startIndex, endIndex: segment.endIndex, segment }));
  const constraintLanes = assignBandLanes(constraintItems);              // couloirs du haut (réservés)
  const sequenceLanes = assignBandLanes(sequenceItems, constraintLanes); // couloirs des séquences, dessous
  const bandItems = [...constraintItems, ...sequenceItems];
  const laneCount = constraintLanes + sequenceLanes;

  // Fonds de colonnes (une par semaine) placés DERRIÈRE les bandes : maillage
  // vertical discret + hachures « sans cours » sur les semaines bloquées, pour
  // rester cohérent avec les lignes de journées. Ils s'étendent sur tous les
  // couloirs (grid-row 1 / span laneCount) et ne captent pas les clics.
  const seqBgCells = laneCount ? visibleWeeks.map((week, i) =>
    `<div class="timeline-seq-bg ${isBlockedWeek(week, promotion) ? 'is-blocked' : ''} ${isThematicBlocked(week, promotion, ue.id, sessions) ? 'is-thematic' : ''}" style="grid-column: ${i + 1}; grid-row: 1 / span ${laneCount};" aria-hidden="true"></div>`
  ).join('') : '';

  // Filet délimitant la zone réservée aux périodes (en haut) des séquences.
  const zoneStrip = (constraintLanes && sequenceLanes) ? `<div class="timeline-seq-zone" style="grid-column: 1 / -1; grid-row: 1 / span ${constraintLanes};" aria-hidden="true"></div>` : '';

  const sequenceInner = bandItems.map(item => {
    const segment = item.segment;
    const cols = `grid-column: ${segment.startIndex + 1} / ${segment.endIndex + 2}; grid-row: ${item.lane + 1};`;
    if (item.kind === 'constraint') {
      return `<button class="timeline-sequence-band timeline-constraint-band period-${typeSlug(segment.constraint.type)}" style="${cols}" data-edit-constraint="${escapeAttr(segment.constraint.id)}" title="${escapeAttr(examConstraintTooltip(segment.constraint) || segment.constraint.notes || '')}"><span>${escapeHtml(segment.constraint.type || 'Contrainte')}</span><strong>${escapeHtml(segment.constraint.label)}${segment.constraint.exam ? '<span class="exam-flag">jaquette</span>' : ''}</strong><em>${escapeHtml(segment.label)}</em></button>`;
    }
    const seq = segment.seq;
    const blockedCols = visibleWeeks.slice(segment.startIndex, segment.endIndex + 1).some(w => isBlockedWeek(w, promotion));
    const sc = sequenceColor(seq.id);
    const bandMeta = seq.hoursEstimate || segment.label || '';
    const bandKeywords = compactKeywords(seq.keywords, 5);
    const bandTeachers = teacherPips(seq.teacher || findUe(seq.ueId)?.teacher || '');
    return `<button draggable="true" class="timeline-sequence-band seq-colored ${typeClass(seq.sequenceType || seq.title)} ${blockedCols ? 'has-blocked-week' : ''}" style="${cols} --ue-color:${sc}; --ue-soft:${hexToRgba(sc, .42)};" data-drag-sequence="${escapeAttr(seq.id)}" data-edit-sequence="${escapeAttr(seq.id)}"><span>Séquence</span><strong>${escapeHtml(seq.title)}</strong>${bandMeta ? `<em>${escapeHtml(bandMeta)}</em>` : ''}${bandKeywords.length ? `<small class="timeline-band-keywords">${escapeHtml(bandKeywords.join(' · '))}</small>` : ''}${bandTeachers.length ? `<span class="timeline-band-teachers">${bandTeachers.map(p => `<span class="teacher-pip" title="${escapeAttr(p.name)}">${escapeHtml(p.initials)}</span>`).join('')}</span>` : ''}</button>`;
  }).join('');
  const sequenceRow = `<div class="timeline-row-label sequence-label">Séq.</div><div class="timeline-sequence-track" style="grid-column: 2 / -1;">${seqBgCells}${zoneStrip}${sequenceInner || '<div class="timeline-no-sequence">Aucune séquence positionnée.</div>'}</div>`;

  // Toutes les cellules sont enfants DIRECTS de .timeline-grid (pas de div de
  // ligne intermédiaire) : c'est la condition pour qu'une seule grille gère
  // l'alignement des colonnes sur toutes les lignes.
  const dayCells = DAY_LANES.map(lane => `<div class="timeline-row-label">${escapeHtml(shortLaneLabel(lane))}</div>${visibleWeeks.map(week => timelineDayCell(ue, week, lane, sessions)).join('')}`).join('');

  return `<div class="timeline-card ${densityClass} timeline-ue-card" data-ue-id="${escapeAttr(ue.id)}" style="${ueStyle}">
    <div class="timeline-title compact-timeline-title">
      <div><h4>${escapeHtml(ue.code)} · ${escapeHtml(ue.title)}</h4><p>${escapeHtml(ue.promotion)} · ${escapeHtml(shortSemester(ue.semester))}${ueCapacities(ue).length ? ' · ' + ueCapacities(ue).map(c => c.code).join(', ') : ''}</p></div>
      <button class="small secondary no-print" data-print-timeline-ue="${escapeAttr(ue.id)}">Imprimer UE A3</button>
    </div>
    <div class="timeline-scroll">
      <div class="timeline-grid" style="${columnsStyle}">
        ${monthRow}
        ${weekRow}
        ${sequenceRow}
        ${dayCells}
      </div>
    </div>
  </div>`;
}

function shortLaneLabel(lane) {
  if (lane.key === 'unspecified') return 'À préciser';
  return DAYS[lane.day].slice(0, 3);
}

function timelineDayCell(ue, week, lane, allSessions) {
  const promotion = ue.promotion;
  const constraints = constraintsForWeek(week, promotion);
  const blocked = isBlockedWeek(week, promotion);
  // Lot K — semaine thématique / EIL (contrainte) couvrant cette promo : les cours
  // habituels sont impossibles ici (grisé + repère EIL), SAUF si cette UE porte du
  // contenu cette semaine-là (UE porteuse de l'EIL → elle affiche ses séances).
  const eilBlocked = isThematicBlocked(week, promotion, ue.id, allSessions);
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
  const drop = JSON.stringify({ ueId: ue.id, weekId: week.id, laneKey: lane.key, day: lane.day, part: lane.part });
  return `<div class="timeline-day-cell ${constraints.length ? 'has-constraint' : ''} ${blocked ? 'blocked-week' : ''} ${eilBlocked ? 'thematic-week' : ''} ${dayItems.length ? 'is-holiday' : ''} ${cellSessions.length ? 'has-session' : 'is-empty-day'}" data-timeline-drop='${escapeAttr(drop)}'${eilBlocked ? ` title="${escapeAttr('Semaine thématique : ' + eilTitle)}"` : ''}>
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
  const tooltip = [session.title, sessionTooltip(session), session.objectives].filter(Boolean).join(' — ');
  return `<button draggable="true" class="timeline-session seq-tinted ${typeClass(session.type)}" style="--ue-color:${color};--ue-soft:${hexToRgba(color, .32)}" data-drag-session="${escapeAttr(session.id)}" data-edit-session="${escapeAttr(session.id)}" title="${escapeAttr(tooltip)}">
    <span class="timeline-session-type">${demiGroupeBadge(session)}${escapeHtml(session.type || 'Séance')}</span>
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
      placementStatus: 'Définitif EDT',
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
      placementStatus: 'Fictif à placer',
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
  const weeks = uniqueWeeks(ganttSemesterFilters.flatMap(weeksForSemester));
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

function monthBandsForWeeks(weeks = []) {
  const bands = [];
  weeks.forEach((week, index) => {
    const [start] = weekDateRange(week);
    const label = start ? start.toLocaleDateString('fr-FR', { month: 'long' }) : '';
    const previous = bands[bands.length - 1];
    if (previous && previous.label === label) previous.end = index;
    else bands.push({ label, start: index, end: index });
  });
  return bands;
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

function ganttBar(segment) {
  const seq = segment.seq;
  const sessions = state.sessions.filter(s => s.sequenceId === seq.id);
  const fictive = sessions.filter(isFictiveSession).length;
  const definitive = sessions.filter(isDefinitiveSession).length;
  const cls = typeClass(seq.sequenceType || seq.title);
  const weekText = segment.label || seq.targetWeeks || '';
  const title = [seq.title, ueLabel(seq.ueId), weekText, seq.hoursEstimate, seq.objectives].filter(Boolean).join(' · ');
  return `<button class="gantt-bar ${cls}" style="grid-column: ${segment.startIndex + 1} / ${segment.endIndex + 2}; grid-row: ${segment.lane + 1};" data-edit-sequence="${escapeAttr(seq.id)}" title="${escapeAttr(title)}">
    <span class="gantt-bar-title">${escapeHtml(seq.title)}</span>
    <span class="gantt-bar-meta">${escapeHtml(weekText)} · ${escapeHtml(seq.hoursEstimate || 'Volume ?')} · ${fictive} à placer / ${definitive} EDT</span>
  </button>`;
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

function renderPlanning() {
  $('#weekSelect').value = selectedWeek;
  renderWeekCalendar();
  renderWeekBacklog();
  $('#planningContainer').innerHTML = state.promotions.map(renderPromotionTable).join('');
  const weekNotesEl = $('#weekNotes');
  if (weekNotesEl && document.activeElement !== weekNotesEl) {
    weekNotesEl.value = state.weekNotes[selectedWeek] || '';
    setWeekNotesStatus('');
  }
}

function renderWeekCalendar() {
  const container = $('#weekCalendar');
  const week = state.weeks.find(w => w.id === selectedWeek);
  // Libellé du bouton d'ouverture : toujours afficher la semaine courante.
  const toggle = $('#weekPickerToggle');
  if (toggle) {
    const lbl = week ? `${escapeHtml(week.label.replace('S0', 'S'))} · ${escapeHtml(compactDateRange(week.dateRange))}` : 'Choisir la semaine';
    toggle.innerHTML = `<span class="wp-cal-ico" aria-hidden="true">📅</span><span class="wp-label">${lbl}</span><span class="wp-caret" aria-hidden="true">▾</span>`;
  }
  if (!container) return;

  // Index : pour chaque jour (lundi de semaine), l'id de la semaine d'enseignement.
  const mondayToWeek = new Map();
  let minDate = null, maxDate = null;
  state.weeks.forEach(w => {
    const [start, end] = weekDateRange(w);
    if (!start) return;
    mondayToWeek.set(isoKey(start), w.id);
    if (!minDate || start < minDate) minDate = start;
    if (!maxDate || (end || start) > maxDate) maxDate = end || start;
  });
  if (!minDate) { container.innerHTML = '<p class="meta">Aucune semaine disponible.</p>'; return; }

  const selectedMonday = week ? weekDateRange(week)[0] : null;
  const selectedMondayKey = selectedMonday ? isoKey(selectedMonday) : '';

  // Bornes mensuelles (1er du mois) de l'année scolaire.
  const firstMonth = new Date(minDate.getFullYear(), minDate.getMonth(), 1);
  const lastMonth = new Date(maxDate.getFullYear(), maxDate.getMonth(), 1);
  const clampMonth = (d) => new Date(Math.min(Math.max(d.getTime(), firstMonth.getTime()), lastMonth.getTime()));

  // Mois affiché : mémorisé, sinon mois de la semaine sélectionnée, sinon premier mois.
  let shown;
  if (weekPickerMonthKey) {
    const [y, m] = weekPickerMonthKey.split('-').map(Number);
    shown = new Date(y, m - 1, 1);
  } else {
    const base = selectedMonday || minDate;
    shown = new Date(base.getFullYear(), base.getMonth(), 1);
  }
  shown = clampMonth(shown);
  const atFirst = shown.getTime() <= firstMonth.getTime();
  const atLast = shown.getTime() >= lastMonth.getTime();
  const monthLabel = shown.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });

  const header = `<div class="week-cal-header">
    <button type="button" class="week-cal-nav" data-cal-nav="prev"${atFirst ? ' disabled' : ''} aria-label="Mois précédent">‹</button>
    <div class="week-cal-monthlabel">${escapeHtml(monthLabel)}</div>
    <button type="button" class="week-cal-nav" data-cal-nav="next"${atLast ? ' disabled' : ''} aria-label="Mois suivant">›</button>
  </div>`;
  const selectedLine = week
    ? `<div class="week-cal-weeknav"><button type="button" class="week-cal-nav" data-week-nav="prev" aria-label="Semaine précédente">‹</button><div class="week-cal-selected"><strong>${escapeHtml(week.label.replace('S0', 'S'))}</strong><span>${escapeHtml(week.dateRange || '')}</span></div><button type="button" class="week-cal-nav" data-week-nav="next" aria-label="Semaine suivante">›</button></div>`
    : '';
  const grid = renderCalendarMonth(shown, mondayToWeek, selectedMondayKey, false);

  container.innerHTML = `<div class="week-cal-compact">${header}${selectedLine}${grid}</div>`;
}

/* Décale le mois affiché dans le sélecteur compact (sans changer la semaine). */
function moveCalendarMonth(offset) {
  const week = state.weeks.find(w => w.id === selectedWeek);
  let base;
  if (weekPickerMonthKey) {
    const [y, m] = weekPickerMonthKey.split('-').map(Number);
    base = new Date(y, m - 1, 1);
  } else {
    const d = week ? weekDateRange(week)[0] : null;
    base = d ? new Date(d.getFullYear(), d.getMonth(), 1) : new Date();
  }
  base.setMonth(base.getMonth() + offset);
  weekPickerMonthKey = `${base.getFullYear()}-${String(base.getMonth() + 1).padStart(2, '0')}`;
  renderWeekCalendar();
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

/* `selection` : soit une clé lundi (chaîne) → sélection d'UNE semaine (Planning
   semaine, attribut `data-set-week` porteur de l'id de semaine), soit un objet
   { start, end } de clés lundi → sélection de PLAGE (modale séquence, attribut
   `data-<opts.pickAttr>` porteur de la clé lundi). Rétrocompatible : appelé sans
   objet ni opts, le comportement d'origine (mono-sélection) est conservé. */
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
  // Cellules-jours à plat (vides de début + jours + complément) puis lignes de 7.
  const days = [];
  for (let i = 0; i < firstOffset; i += 1) days.push(null);
  for (let day = 1; day <= daysInMonth; day += 1) days.push(day);
  while (days.length % 7 !== 0) days.push(null);
  const wkNumberOf = (weekId) => {
    const w = state.weeks.find(x => x.id === weekId);
    return w ? `S${String(weekNumberOf(w)).padStart(2, '0')}` : '';
  };
  // UNE seule grille (n° de semaine + 7 jours) : alignement garanti, pas de
  // sous-grille imbriquée qui débordait. En-tête : cellule « Sem. » + L M M J V S D.
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

function moveWeek(offset) {
  const idx = state.weeks.findIndex(w => w.id === selectedWeek);
  if (idx < 0) return;
  const next = state.weeks[Math.max(0, Math.min(state.weeks.length - 1, idx + offset))];
  selectedWeek = next.id;
  weekPickerMonthKey = null;
  renderPlanning();
}

function renderWeekBacklog() {
  refreshWeekBacklogUeFilter();
  refreshWeekBacklogSequenceFilter();
  const selectedUe = weekBacklogUeFilter;
  const selectedSequence = weekBacklogSequenceFilter;
  const sessions = state.sessions
    .filter(s => isFictiveSession(s))
    .filter(s => weekBacklogScope === 'all' || s.targetWeekId === selectedWeek || !s.targetWeekId)
    .filter(s => selectedUe === 'Tous' || s.ueId === selectedUe)
    .filter(s => selectedSequence === 'Tous' || s.sequenceId === selectedSequence)
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
  const byUe = groupBy(sessions, s => s.ueId || 'none');
  backlog.innerHTML = `<div class="backlog-count">${escapeHtml(title)}</div>` + Object.entries(byUe).map(([ueId, ueSessions]) => {
    const bySeq = groupBy(ueSessions, s => s.sequenceId || 'none');
    return `<details class="backlog-ue-group" data-open-key="wbUe:${escapeAttr(ueId)}"><summary><strong>${escapeHtml(ueLabel(ueId))}</strong><span>${ueSessions.length} séance(s)</span></summary>${Object.entries(bySeq).map(([seqId, seqSessions]) => `<details class="backlog-seq-group" data-open-key="wbSeq:${escapeAttr(ueId)}:${escapeAttr(seqId)}"><summary>${escapeHtml(sequenceLabel(seqId))}<span>${seqSessions.length}</span></summary>${seqSessions.map(s => `<div class="backlog-item draggable-backlog" draggable="true" data-drag-session="${escapeAttr(s.id)}">${sessionListItem(s)}<button class="small" data-place-session="${escapeAttr(s.id)}">Placer / éditer</button></div>`).join('')}</details>`).join('')}</details>`;
  }).join('');
  restoreOpenKeys(backlog, openKeys);
}

function renderSessionEventContent(session, duration, compact = false) {
  const ue = findUe(session.ueId);
  const ueCode = ue ? ue.code : 'UE ?'; // « UE 3.2 » (préfixe conservé)
  // Lot V — demi-groupe : pastille courte (« A »/« B ») sur la MÊME ligne que l'UE.
  // La demi-largeur d'affichage suffit à signaler le demi-groupe → pas de « ½ ».
  const badge = session.demiGroupe ? `<span class="demi-badge demi-inline demi-${session.demiGroupe.toLowerCase()}" title="Demi-groupe ${session.demiGroupe}">${session.demiGroupe}</span>` : '';
  const detail = [session.teacher || '', session.room || ''].filter(Boolean).join(' · ');
  // Mots-clés affichés dans les cases PLEINES (police réduite) ; pas en demi-groupe (place).
  const keywords = compact ? [] : compactKeywords(session.keywords, 4);
  // Type de séance en texte simple (repère rapide Cours/TP/Pluri…), après les
  // infos enseignant/lieu et avant les mots-clés.
  const typeText = session.type ? `<div class="event-type">${escapeHtml(shortSessionType(session.type))}</div>` : '';
  return `<div class="event-ue">${escapeHtml(ueCode)}${badge}</div>
    <div class="event-session-title">${escapeHtml(truncate(session.title, compact ? 26 : 40))}</div>
    ${detail ? `<div class="event-details">${escapeHtml(detail)}</div>` : ''}
    ${typeText}
    ${keywords.length ? `<div class="event-keywords">${escapeHtml(keywords.join(', '))}</div>` : ''}`;
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
            const inner = isHead
              ? `<button type="button" class="unplace-btn" data-unplace-session="${escapeAttr(sess.id)}" title="Ressortir vers « Séances à placer »" aria-label="Ressortir cette séance">↩</button>${renderSessionEventContent(sess, rowspan, true)}`
              : '';
            return `<div class="demi-col drop-slot ${typeClass(sess.type)}" style="--seq-color:${sessionTint(sess)}" draggable="true" data-drag-session="${escapeAttr(sess.id)}" data-session-id="${escapeAttr(sess.id)}" data-edit-session="${escapeAttr(sess.id)}" data-drop-target='${cj}' title="${escapeAttr(sessionTooltip(sess))}">${inner}</div>`;
          };
          return `<td class="event-cell demi-cell${contClass}" rowspan="${rowspan}"><div class="demi-split">${halfCol(halfA[0], 'A')}${halfCol(halfB[0], 'B')}</div></td>`;
        }
        if (starting.length === 1) {
          const session = starting[0];
          const cls = typeClass(session.type);
          const inner = isHead
            ? `<button type="button" class="unplace-btn" data-unplace-session="${escapeAttr(session.id)}" title="Ressortir vers « Séances à placer »" aria-label="Ressortir cette séance">↩</button>${renderSessionEventContent(session, rowspan)}`
            : '';
          return `<td class="event-cell drop-slot ${cls}${contClass}" rowspan="${rowspan}" style="--seq-color:${sessionTint(session)}" draggable="true" data-drag-session="${escapeAttr(session.id)}" data-session-id="${escapeAttr(session.id)}" data-edit-session="${escapeAttr(session.id)}" data-drop-target='${escapeAttr(contextJson)}' title="${escapeAttr(sessionTooltip(session))}">${inner}</td>`;
        }
        return `<td class="event-cell overlap-cell drop-slot${contClass}" rowspan="${rowspan}" data-drop-target='${escapeAttr(contextJson)}' title="${starting.length} séances en chevauchement">
          <div class="overlap-warning">${starting.length} séances superposées</div>
          ${starting.map(session => `<div class="overlap-event ${typeClass(session.type)}" draggable="true" data-drag-session="${escapeAttr(session.id)}" data-session-id="${escapeAttr(session.id)}" data-edit-session="${escapeAttr(session.id)}" title="${escapeAttr(sessionTooltip(session))}"><button type="button" class="unplace-btn" data-unplace-session="${escapeAttr(session.id)}" title="Ressortir vers « Séances à placer »" aria-label="Ressortir cette séance">↩</button>${renderSessionEventContent(session, rowspan, true)}</div>`).join('')}
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
    ? `<tr class="saturday-row"><td class="time-cell saturday-legend">Samedi${saturdayDate ? `<br><small class="th-date">${escapeHtml(fmtDayDate(saturdayDate))}</small>` : ''}</td><td class="saturday-cell" colspan="${DAYS.length}">${satConstraints.map(dayConstraintChip).join('')}${satSessions.map(s => `<span class="saturday-session ${typeClass(s.type)}" style="--seq-color:${sessionTint(s)}" data-session-id="${escapeAttr(s.id)}" data-edit-session="${escapeAttr(s.id)}" title="${escapeAttr(sessionTooltip(s))}"><button type="button" class="unplace-btn" data-unplace-session="${escapeAttr(s.id)}" title="Ressortir vers « Séances à placer »" aria-label="Ressortir cette séance">↩</button>${escapeHtml(s.title)} · journée</span>`).join('')}</td></tr>`
    : '';
  const eilRow = eilBannerRow(eilSelf, eilOther, DAYS.length);

  // Lot R — teinte le bandeau de promo selon la période : automne (sept→déc)
  // GPN1 bleu / GPN2 rouge ; printemps (jan→mai) GPN1 jaune / GPN2 vert.
  const periodClass = weekPeriodClass(week);
  return `<section class="schedule-section">
    <div class="schedule-title ${promotion.toLowerCase()}${periodClass ? ' ' + periodClass : ''}">${escapeHtml(promotion)}</div>
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
    placementStatus: 'Définitif EDT',
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
    placementStatus: 'Fictif à placer',
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
    <div class="list-item"><strong>Avancement de la planification</strong><div class="meta">${fictive.length} séance(s) à placer · ${definitive.length} plage(s) définitive(s) EDT</div></div>
    <div class="list-item"><strong>Répartition semestrielle</strong><div class="meta">${escapeHtml(bySemester)}</div></div>
    <div class="list-item"><strong>Traçabilité pédagogique</strong><div class="meta">${linkedPercent}% des séances sont rattachées à une UE et une séquence.</div></div>
  `;
}

function openUeModal(ue = null) {
  const isNew = !ue;
  $('#ueModalTitle').textContent = isNew ? 'Créer une UE' : 'Modifier une UE';
  $('#ueId').value = ue?.id || '';
  $('#ueCode').value = ue?.code || '';
  $('#ueTitle').value = ue?.title || '';
  const defaultPromotion = designPromotionFilter !== 'Tous' ? designPromotionFilter : (state.promotions[0] || 'GPN1');
  const defaultSemester = designSemesterFilter !== 'Tous' ? designSemesterFilter : 'Semestre 1';
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
  $('#deleteUeButton').style.visibility = isNew ? 'hidden' : 'visible';
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
  refreshSequencePeriodDates(sequence?.targetWeeks || '', ue);
  // Nouvelle séquence : centrer le calendrier de période sur la semaine de début
  // de l'UE (sans pré-sélectionner de plage), pour que le choix se fasse d'emblée
  // dans les semaines de l'UE plutôt qu'au tout début du semestre.
  if (isNew && ue?.startWeekId) {
    const [monday] = weekDateRange(state.weeks.find(w => w.id === ue.startWeekId) || {});
    if (monday) {
      seqCalMonthKey = `${monday.getFullYear()}-${String(monday.getMonth() + 1).padStart(2, '0')}`;
      renderSequenceCalendar();
    }
  }
  $('#sequenceHours').value = sequence?.hoursEstimate || '';
  $('#sequenceType').value = sequence?.sequenceType || '';
  $('#sequenceStatus').value = sequence?.status || 'Prévue';
  const seqColorInput = $('#sequenceColorInput');
  if (seqColorInput) {
    const custom = isValidHexColor(sequence?.color);
    const auto = sequence ? computedSequenceColor(sequence) : computedSequenceColor({ ueId: ue?.id, id: '__new' });
    seqColorInput.value = custom ? sequence.color : auto;
    seqColorInput.dataset.custom = custom ? '1' : '0';
  }
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
  $('#deleteSequenceButton').style.visibility = isNew ? 'hidden' : 'visible';
  $('#exportSequenceButton').style.visibility = isNew ? 'hidden' : 'visible';
  $('#sequenceDialog').showModal();
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
  const placement = context.forceDefinitive ? 'Définitif EDT' : (session?.placementStatus || context.placementStatus || 'Fictif à placer');
  $('#sessionPlacementStatus').value = placement;
  applySessionPlacementVisibility();
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
  $('#sessionWeek').value = session?.targetWeekId || session?.weekId || context.weekId || designDefaultWeek || selectedWeek;
  $('#sessionDay').value = String(session?.day ?? context.day ?? 0);
  $('#sessionStart').value = String(session?.startSlot ?? context.slot ?? 0);
  $('#sessionEnd').value = String(session?.endSlot ?? context.slot ?? 0);
  $('#sessionExpectedDuration').value = session?.expectedDuration || '';
  $('#sessionOrder').value = session?.order || '';
  $('#sessionFictiveSlot').value = session?.fictiveSlot || '';
  $('#sessionFictiveDay').value = session?.fictiveDay ?? '';
  $('#sessionExactDate').value = session?.exactDate || '';
  $('#sessionCustomStart').value = session?.customStart || '';
  $('#sessionCustomEnd').value = session?.customEnd || '';
  $('#sessionType').value = session?.type || 'Cours en salle';
  if ($('#sessionDemiGroupe')) $('#sessionDemiGroupe').value = session?.demiGroupe || context.demiGroupe || ''; // Lot V — champ « Groupe » unifié
  $('#sessionTeacher').value = session?.teacher || '';
  $('#sessionRoom').value = session?.room || '';
  $('#sessionStatus').value = session?.status || 'Prévue';
  const sessColorInput = $('#sessionColorInput');
  if (sessColorInput) {
    const custom = isValidHexColor(session?.color);
    const inherited = session ? sessionInheritedColor(session) : (seq ? sequenceColor(seq.id) : ueColor(ue?.id));
    sessColorInput.value = custom ? session.color : inherited;
    sessColorInput.dataset.custom = custom ? '1' : '0';
  }
  if ($('#sessionPersonalVehicle')) $('#sessionPersonalVehicle').checked = !!session?.personalVehicle;
  renderSessionCapacityChoices(session?.capacityCodes || [], ue, seq);
  $('#sessionObjectives').value = session?.objectives || '';
  $('#sessionKeywords').value = session?.keywords || '';
  $('#sessionActivities').value = session?.activities || '';
  $('#sessionNotions').value = session?.notions || '';
  $('#sessionMaterials').value = session?.materials || '';
  $('#sessionAssessment').value = session?.assessment || '';
  $('#sessionHomework').value = session?.homework || '';
  $('#sessionDifferentiation').value = session?.differentiation || '';
  $('#sessionNotes').value = session?.notes || '';
  $('#deleteSessionButton').style.visibility = isNew ? 'hidden' : 'visible';
  const dupBtn = $('#duplicateSessionButton');
  if (dupBtn) dupBtn.style.visibility = isNew ? 'hidden' : 'visible';
  $('#sessionDialog').showModal();
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
  $('#deleteConstraintButton').style.visibility = isNew ? 'hidden' : 'visible';
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



function ueColor(ueId = '') {
  const palette = ['#2f6f73', '#8067b7', '#b56952', '#4f7cac', '#7a8f3a', '#a45a79', '#5b6f92', '#b08a2e', '#558b6e', '#7b6d8d', '#8a6f3d'];
  const index = Math.max(0, state?.ues?.findIndex(ue => ue.id === ueId) ?? 0);
  return palette[index % palette.length];
}

/* Couleur d'une séquence : dérivée de la couleur de son UE, mais nettement
   distincte d'une séquence à l'autre. But : une séquence et SES séances partagent
   exactement la même teinte (lecture du rattachement dans la frise), et deux
   séquences voisines sont franchement différenciables.
   Méthode : la 1re séquence garde la teinte de l'UE (ancrage), les suivantes
   tournent la teinte par l'ANGLE D'OR (~137°) — chaque rang atterrit loin du
   précédent, sans collision même avec beaucoup de séquences — tout en conservant
   la saturation/luminosité feutrée de la palette d'UE. Une légère alternance de
   luminosité et de saturation renforce encore le contraste des voisines. */
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
  const hue = (bh + rank * 137.508) % 360;
  const sat = 72 - (rank % 3) * 7;                    // 72 / 65 / 58 : couleurs vives
  const light = [49, 40, 58, 45, 53, 36][rank % 6];   // luminosités alternées, contraste fort
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
  copy.personalVehicle = false; // ne pas recopier un frais de déplacement lié
  copy.placementStatus = 'Fictif à placer';
  copy.weekId = '';
  copy.day = null;
  copy.fictiveDay = '';
  copy.startSlot = null;
  copy.endSlot = null;
  const srcWeek = source.weekId || source.targetWeekId || '';
  copy.targetWeekId = source.placementStatus === 'Définitif EDT'
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

function hexToRgba(hex, alpha = 1) {
  const clean = String(hex || '#000000').replace('#', '');
  const n = parseInt(clean.length === 3 ? clean.split('').map(c => c + c).join('') : clean, 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
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
      <td>${escapeHtml(seq.status || '')}</td>
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
  </style></head><body><button onclick="window.print()">Imprimer / enregistrer en PDF</button><h1>Progression UE — ${escapeHtml(ue.code)} ${escapeHtml(ue.title)}</h1><p class="meta">${escapeHtml(ue.promotion)} · ${escapeHtml(ue.semester)} · ${escapeHtml(ue.period || '')} · ${escapeHtml(ue.startWeekId ? `de ${weekLabel(ue.startWeekId)}` : '')} ${escapeHtml(ue.endWeekId ? `à ${weekLabel(ue.endWeekId)}` : '')}</p><div class="cap"><strong>Capacités de l’UE :</strong> ${escapeHtml(capacities || '')}</div><table><thead><tr><th>Titre de séquence</th><th>Période envisagée</th><th>Semaines</th><th>Volume horaire estimatif</th><th>Statut</th><th>Enseignant(s) impliqué(s)</th><th>Capacités cochées</th><th>Objectifs de la séquence</th><th>Apprentissages à réaliser / savoir-faire visés</th><th>Prérequis</th><th>Mots-clés / notions structurantes</th><th>Point de vigilance</th><th>Évaluation prévue</th><th>Production attendue / traces élèves</th><th>Notes internes</th><th>Séances rattachées</th></tr></thead><tbody>${rows}</tbody></table></body></html>`;
  const win = window.open('', '_blank');
  win.document.write(html);
  win.document.close();
  win.focus();
}

function exportSequencePrint(seq) {
  if (!seq) return;
  const ue = findUe(seq.ueId) || {};
  const sessions = state.sessions.filter(s => s.sequenceId === seq.id).sort((a, b) => sessionSortKey(a).localeCompare(sessionSortKey(b)));
  const rows = sessions.length ? sessions.map((s, i) => `<tr>
    <td>${i + 1}</td>
    <td>${escapeHtml(s.title || '')}</td>
    <td>${escapeHtml(s.type || '')}</td>
    <td>${escapeHtml(s.group || '')}</td>
    <td>${escapeHtml(s.teacher || '')}</td>
    <td>${escapeHtml(s.room || '')}</td>
    <td>${escapeHtml(s.status || '')}</td>
    <td>${escapeHtml(s.expectedDuration || '')}</td>
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
    <p><strong>Statut :</strong> ${escapeHtml(seq.status || '')}</p>
    <p><strong>Objectifs de la séquence :</strong> ${escapeHtml(seq.objectives || '')}</p>
    <p><strong>Apprentissages à réaliser / savoir-faire visés :</strong> ${escapeHtml(seq.learningOutcomes || '')}</p>
    <p><strong>Prérequis :</strong> ${escapeHtml(seq.prerequisites || '')}</p>
    <p><strong>Mots-clés / notions structurantes :</strong> ${escapeHtml(seq.keywords || '')}</p>
    <p><strong>Point de vigilance :</strong> ${escapeHtml(seq.differentiation || '')}</p>
    <p><strong>Évaluation prévue :</strong> ${escapeHtml(seq.assessment || '')}</p>
    <p><strong>Production attendue / traces élèves :</strong> ${escapeHtml(seq.deliverables || '')}</p>
    <p><strong>Notes internes :</strong> ${escapeHtml(seq.notes || '')}</p>
    <h2>Séances</h2><table><thead><tr><th>N°</th><th>Titre de séance</th><th>Type</th><th>Groupe</th><th>Enseignant(s)</th><th>Salle / lieu</th><th>Statut pédagogique</th><th>Durée prévue</th><th>Capacités cochées</th><th>Objectifs de séance</th><th>Notions abordées</th><th>Déroulé</th><th>Besoins matériels</th><th>Points de vigilance</th><th>Mots-clefs</th><th>Notes internes</th></tr></thead><tbody>${rows}</tbody></table>
  </body></html>`;
  const win = window.open('', '_blank');
  win.document.write(html);
  win.document.close();
  win.focus();
}




function printTimelineUe(ueId) {
  const ue = findUe(ueId);
  if (!ue) return;
  const weeks = uniqueWeeks(ganttSemesterFilters.flatMap(weeksForSemester));
  const html = renderOneUeTimeline(ue, weeks, 0);
  const css = [...document.styleSheets].map(sheet => { try { return [...sheet.cssRules].map(rule => rule.cssText).join('\n'); } catch (e) { return ''; } }).join('\n');
  const win = window.open('', '_blank');
  win.document.write(`<!doctype html><html lang="fr"><head><meta charset="utf-8"><title>Frise ${escapeHtml(ue.code)} ${escapeHtml(ue.title)}</title><style>${css} @page{size:A3 landscape;margin:8mm;}body{background:#fff;padding:0}.app-header,.tabs,.no-print,.timeline-heading{display:none!important}.timeline-card{box-shadow:none!important;border:1px solid #111!important;overflow:visible!important}.timeline-title,.timeline-month-header,.timeline-week-header,.timeline-sequence-band-row{position:static!important}.timeline-day-cell{min-height:12px!important}.timeline-session{font-size:7px!important;padding:1px 2px!important}.timeline-session p{display:none!important}</style></head><body>${html}<script>setTimeout(()=>window.print(),500)<\/script></body></html>`);
  win.document.close();
  win.focus();
}

function printWeekPlanning() {
  const week = state.weeks.find(w => w.id === selectedWeek);
  const html = $('#planningContainer')?.innerHTML || '';
  const css = [...document.styleSheets].map(sheet => { try { return [...sheet.cssRules].map(rule => rule.cssText).join('\n'); } catch (e) { return ''; } }).join('\n');
  const win = window.open('', '_blank');
  win.document.write(`<!doctype html><html lang="fr"><head><meta charset="utf-8"><title>Planning ${escapeHtml(week?.label || '')}</title><style>${css} @page{size:A3 landscape;margin:8mm;}body{background:#fff;padding:0}.app-header,.tabs,.no-print,.page-title,.filters-panel,.backlog-panel,.notes-panel,.week-calendar-panel{display:none!important}.schedule-section{break-inside:avoid;box-shadow:none!important;border:1px solid #111!important}.table-scroll{overflow:visible!important}.schedule-table th,.schedule-table td{height:auto!important;min-width:0!important;font-size:8px!important}.event-cell{padding:3px!important}.event-keywords{font-size:7px!important}.break-cell{height:7px!important;padding:0!important}</style></head><body><h1>Planning hebdomadaire — ${escapeHtml(week?.label || '')} ${escapeHtml(week?.dateRange || '')}</h1>${html}<script>setTimeout(()=>window.print(),500)<\/script></body></html>`);
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
function refGeneralSection(s) {
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

function refBlocs(module, c) {
  const blocks = (module.blocks && module.blocks[c.id]) || [];
  if (!blocks.length) return ''; // Modules 1-3 : pas de blocs encadrés → pas de section vide
  const body = blocks.map(b => {
    const leaves = (b.items || []).map(i => {
      const sub = c.subsections[i];
      if (!sub) return '';
      return refDetails('rm-leaf', escapeHtml(sub.title), `<div class="rm-leafpanel">${sub.html}</div>`);
    }).join('');
    const intro = b.intro ? `<div class="rm-card rm-compact">${b.intro}</div>` : '';
    return refDetails('rm-sub', escapeHtml(b.title), `<div class="rm-subpanel">${intro}${leaves}</div>`);
  }).join('');
  return refDetails('rm-part', 'Blocs encadrés et sous-parties', `<div class="rm-panel">${body}</div>`);
}

function refCapacite(module, c) {
  return refDetails('rm-cap', `<span class="rm-capcode">${escapeHtml(c.code)}</span> · ${escapeHtml(c.title)}`,
    `<div class="rm-cappanel">${refDeclinaison(c)}${refBlocs(module, c)}</div>`);
}

/* Annexe officielle : item de même niveau que les capacités (html = contenu riche, non échappé). */
function refAnnexe(a) {
  return refDetails('rm-cap rm-annexe', `<span class="rm-annexe-tag">Annexe</span> · ${escapeHtml(a.title.replace(/^Annexe\s*\d*\s*[·:]?\s*/i, ''))}`,
    `<div class="rm-cappanel"><div class="rm-panel rm-card">${a.html}</div></div>`);
}

function refReferences(module) {
  const hasBib = (module.biblio || []).length;
  const hasSito = (module.sitographie || []).length;
  if (!hasBib && !hasSito) return ''; // M6 : références citées au fil des sous-parties
  const bib = (module.biblio || []).map(cat => refDetails('rm-leaf', escapeHtml(cat.name),
    `<div class="rm-leafpanel"><div class="rm-refgrid">${cat.items.map(it => `<div class="rm-refentry">${escapeHtml(it)}</div>`).join('')}</div></div>`)).join('');
  const links = (module.sitographie || []).map(cat => refDetails('rm-leaf', escapeHtml(cat.name),
    `<div class="rm-leafpanel"><div class="rm-refgrid">${cat.links.map(([label, url]) => `<div class="rm-refentry rm-linkentry"><span class="rm-reflabel">${escapeHtml(label)}</span><a href="${escapeAttr(url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(url)}</a></div>`).join('')}</div></div>`)).join('');
  const inner = `${hasBib ? `<div class="rm-blocktitle">Ouvrages, revues et ressources imprimées</div>${bib}` : ''}${hasSito ? `<div class="rm-blocktitle" style="margin-top:16px">Sitographie et banques de données</div>${links}` : ''}`;
  return refDetails('rm-part', 'Références documentaires ou bibliographiques', `<div class="rm-panel">${inner}</div>`);
}

function renderReferenceModule() {
  const container = $('#referenceModuleContent');
  if (!container) return;
  const module = refModuleById(selectedReferenceModule);
  if (!module) { container.innerHTML = '<p class="meta">Aucun module chargé. Vérifier reference-modules.js.</p>'; return; }
  $$('[data-ref-module]').forEach(b => b.classList.toggle('active', b.dataset.refModule === module.id));
  const general = (module.general || []).map(refGeneralSection).join('') + refReferences(module);
  const caps = (module.capacites || []).map(c => refCapacite(module, c)).join('')
    + (module.annexes || []).map(refAnnexe).join('');
  const pdfLine = module.pdf ? ` <a class="rm-pdf" href="docs/${escapeAttr(module.pdf)}" target="_blank" rel="noopener">PDF source du module</a>` : '';
  container.innerHTML = `
    <div class="rm-head">
      <div class="rm-kicker">${escapeHtml(module.code)} · ${escapeHtml(module.bloc)}</div>
      <h3 class="rm-title">${escapeHtml(module.title)}</h3>
      <p class="rm-source">Source officielle : ${escapeHtml(module.source)}.${pdfLine}</p>
    </div>
    ${refDetails('rm-root', '1. Général', `<div class="rm-rootpanel">${general}</div>`, true)}
    ${refDetails('rm-root', '2. Précisions par capacités', `<div class="rm-rootpanel">${caps}</div>`, true)}
  `;
  const q = ($('#referenceModuleSearch')?.value || '').trim();
  if (q) refmodSearch(q);
}

/* -- Recherche / surlignage dans le module affiché -- */
function refmodClearMarks() {
  const content = $('#referenceModuleContent');
  if (!content) return;
  content.querySelectorAll('mark.rm-mark').forEach(mark => {
    const text = document.createTextNode(mark.textContent);
    mark.replaceWith(text);
    text.parentNode && text.parentNode.normalize();
  });
}

function refmodHighlight(query) {
  const content = $('#referenceModuleContent');
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
  const content = $('#referenceModuleContent');
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

function refmodExpandAll() { $('#referenceModuleContent')?.querySelectorAll('details').forEach(d => { d.open = true; }); }
function refmodCollapseAll() { $('#referenceModuleContent')?.querySelectorAll('details').forEach(d => { d.open = false; }); }

/* Depuis une pastille de capacité (conception pédagogique), ouvrir le module du
   référentiel qui contient cette capacité et déplier la capacité correspondante.
   Aucun renvoi inverse (référentiel -> séances) : navigation à sens unique. */
function openReferenceModuleForCapacity(code) {
  const clean = String(code || '').replace(/\s/g, '');
  const module = referenceModules().find(m => (m.capacites || []).some(c => clean.startsWith(c.code)));
  if (!module) return;
  // Bascule sur l'onglet fusionné « Référentiel & Ruban », mode Référentiel.
  $$('.tab').forEach(t => t.classList.toggle('active', t.dataset.view === 'ruban'));
  $$('.view').forEach(v => v.classList.toggle('active-view', v.id === 'ruban'));
  selectedReferenceModule = module.id;
  setRubanMode('reference');
  // Déplie la capacité ciblée et la fait défiler dans la vue.
  const cap = (module.capacites || []).find(c => clean.startsWith(c.code));
  if (!cap) return;
  requestAnimationFrame(() => {
    const container = $('#referenceModuleContent');
    const target = Array.from(container?.querySelectorAll('details.rm-cap') || [])
      .find(d => d.querySelector('summary .rm-capcode')?.textContent === cap.code);
    if (!target) return;
    let node = target;
    while (node && node !== container) { if (node.tagName === 'DETAILS') node.open = true; node = node.parentElement; }
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
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
/* Bascule une UE vers le modèle éditable (snapshot de l'effectif courant). */
function materializeUe(ueCode) {
  state.rubanUeCaps = state.rubanUeCaps || {};
  if (!Array.isArray(state.rubanUeCaps[ueCode])) {
    state.rubanUeCaps[ueCode] = rubanStaticUeCaps(ueCode);
  }
  return state.rubanUeCaps[ueCode];
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

  const q = ($('#rubanSearch')?.value || '').trim().toLowerCase();
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
      // Liseré gauche harmonisé avec le code période/promo du planning (Lot R) :
      // S1 bleu (GPN1 automne) · S2 jaune (GPN1 printemps) · S3 rouge (GPN2 automne) · S4 vert (GPN2 printemps).
      return `<article class="ruban-ue sem-${escapeAttr(s.id)}${anyMatch || !caps.length ? '' : ' is-dim'}${isUeModified(u) ? ' is-modified' : ''}">`
        + `<header class="ruban-ue-head"><span class="ruban-ue-code">${escapeHtml(u.code)}</span><strong>${escapeHtml(u.title)}</strong>${editBtn}</header>`
        + (u.resume ? `<p class="ruban-ue-resume">${escapeHtml(u.resume)}</p>` : '')
        + `<div class="ruban-cap-list">${capHtml}</div></article>`;
    }).join('');
    return `<section class="ruban-col sem-${escapeAttr(s.id)}"><header class="ruban-col-head">${escapeHtml(s.label)}</header>${uesHtml}</section>`;
  }).join('');

  renderRubanTable(matchCap);

  const countEl = $('#rubanCount');
  if (countEl) countEl.textContent = (q || teacher !== 'Tous')
    ? `${shown} capacité${shown > 1 ? 's' : ''} correspondante${shown > 1 ? 's' : ''}`
    : '';
}

function renderRubanTable(matchCap) {
  const data = rubanData();
  const target = $('#rubanTable');
  if (!data || !target) return;
  const rows = [];
  data.semestres.forEach(s => s.ues.forEach(u => {
    const modified = isUeModified(u);
    rubanUeCapacities(u).forEach(c => {
      if (!matchCap(c, u, s)) return;
      const hasRef = rubanCapHasReferentiel(c.code);
      const capCell = hasRef
        ? `<button type="button" class="ruban-cap-link has-ref" data-ruban-cap="${escapeAttr(c.code)}" title="Ouvrir dans le référentiel"><strong>${escapeHtml(c.code)}</strong> ${escapeHtml(c.title)}</button>`
        : `<span class="ruban-cap-plain"><strong>${escapeHtml(c.code)}</strong> ${escapeHtml(c.title)}</span>`;
      const editCell = (field, vals) => `<input class="ruban-edit" type="text" value="${escapeAttr(vals.join(', '))}"`
        + ` data-ruban-edit-ue="${escapeAttr(u.code)}" data-ruban-edit-code="${escapeAttr(c.code)}" data-ruban-edit-field="${field}"`
        + ` aria-label="${field === 'enseignants' ? 'Enseignants' : 'Évaluateurs'} de ${escapeAttr(c.code)}" placeholder="—" />`;
      rows.push(`<tr class="${modified ? 'is-modified' : ''}">`
        + `<td class="ruban-td-sem">${escapeHtml(s.label.replace('Semestre ', 'S'))}</td>`
        + `<td>${escapeHtml(u.code)}</td>`
        + `<td>${capCell}</td>`
        + `<td>${(c.disciplines || []).map(escapeHtml).join(', ')}</td>`
        + `<td>${editCell('enseignants', c.enseignants)}</td>`
        + `<td>${editCell('evaluateurs', c.evaluateurs)}</td>`
        + `<td class="ruban-td-reset">${modified ? `<button type="button" class="ruban-reset" data-ruban-reset-ue="${escapeAttr(u.code)}" title="Rétablir les capacités d'origine (PDF) de ${escapeAttr(u.code)}">↺</button>` : ''}</td>`
        + `</tr>`);
    });
  }));
  target.innerHTML = rows.length
    ? `<table class="ruban-table"><thead><tr><th>Sem.</th><th>UE</th><th>Capacité</th><th>Disciplines</th><th>Enseignants</th><th>Évaluateurs</th><th></th></tr></thead><tbody>${rows.join('')}</tbody></table>`
      + `<p class="ruban-edit-hint meta">Les colonnes <strong>Enseignants</strong> et <strong>Évaluateurs</strong> sont modifiables (initiales séparées par des virgules) ; enregistrement automatique. Pour ajouter/retirer une capacité, utiliser ✎ dans l'onglet <strong>Ruban</strong>. ↺ rétablit l'UE d'origine.</p>`
    : '<p class="meta">Aucune capacité ne correspond aux filtres.</p>';
}

function parseInitials(text) {
  return String(text || '').split(',').map(t => t.trim()).filter(Boolean);
}

/* Édition inline (Tableau) d'un champ enseignants/évaluateurs : passe par le
   modèle éditable (materialize) pour rester cohérent avec la modale de composition. */
async function rubanUpdateCapField(ueCode, capCode, field, text) {
  if (!state) return;
  const list = materializeUe(ueCode);
  const cap = list.find(c => c.code === capCode);
  if (!cap) return;
  cap[field] = parseInitials(text);
  cleanupUeOverride(ueCode);
  try { await saveData('Affectation enregistrée'); } catch (e) { setSaveStatus('Erreur d’enregistrement'); }
}

/* Rétablit une UE à sa composition d'origine (PDF) : supprime l'override complet
   ET les anciens overrides par capacité de cette UE. */
async function rubanResetUe(ueCode) {
  if (!state) return;
  if (state.rubanUeCaps) delete state.rubanUeCaps[ueCode];
  const u = findRubanUe(ueCode);
  (u?.capacites || []).forEach(c => { if (state.rubanOverrides) delete state.rubanOverrides[c.code]; });
  try { await saveData('Capacités rétablies'); } catch (e) { setSaveStatus('Erreur d’enregistrement'); }
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
  $('#resetUeCapsButton').style.visibility = isUeModified(u) ? 'visible' : 'hidden';
  $('#ueCapsDialog').showModal();
}

function renderRubanPdf() {
  const sel = $('#rubanPdfSelect');
  const frame = $('#rubanPdfFrame');
  const open = $('#rubanPdfOpen');
  if (!sel) return;
  const src = 'docs/' + (sel.value || 'ruban-semestres.pdf');
  if (frame && frame.getAttribute('src') !== src) frame.setAttribute('src', src);
  if (open) open.setAttribute('href', src);
}

/* ---------------------------------------------------------------------------
   Créneaux de cours type (onglet Référentiel & Ruban → mode « Créneaux type »).
   2 périodes (sept-déc / janv-mai) × 2 promos = 4 grilles hebdo type (1 par
   semestre). Alimentent le masque du Planning hebdo.
--------------------------------------------------------------------------- */
function renderCreneaux() {
  const container = $('#creneauxGrids');
  if (!container) return;
  $$('[data-creneaux-period]').forEach(b => b.classList.toggle('active', b.dataset.creneauxPeriod === creneauxPeriod));
  const period = TEMPLATE_PERIODS.find(p => p.key === creneauxPeriod) || TEMPLATE_PERIODS[0];
  container.innerHTML = renderTemplateGrid(period);
}

/* Une seule grille par période : les créneaux des DEUX promos y cohabitent
   (distinguées par le n° d'UE et la couleur). La promo d'un créneau est portée
   par son semestre de stockage. */
function renderTemplateGrid(period) {
  const slots = (state.weekTemplates || []).filter(t => periodOfSemester(t.semester) === period.key);
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

function setRubanMode(mode) {
  rubanMode = mode;
  $$('[data-ruban-mode]').forEach(b => b.classList.toggle('active', b.dataset.rubanMode === mode));
  $('#rubanModeRuban')?.classList.toggle('active-mode', mode === 'ruban');
  $('#rubanModeTable')?.classList.toggle('active-mode', mode === 'table');
  $('#rubanModeReference')?.classList.toggle('active-mode', mode === 'reference');
  $('#rubanModePdf')?.classList.toggle('active-mode', mode === 'pdf');
  $('#rubanModeCreneaux')?.classList.toggle('active-mode', mode === 'creneaux');
  // Les filtres enseignant/recherche ne concernent que le Ruban et le Tableau.
  const filters = $('#rubanFilters');
  if (filters) filters.hidden = (mode === 'reference' || mode === 'pdf' || mode === 'creneaux');
  if (mode === 'pdf') renderRubanPdf();
  if (mode === 'reference') renderReferenceModule();
  if (mode === 'creneaux') renderCreneaux();
}

function bindEvents() {
  $$('.tab').forEach(tab => tab.addEventListener('click', () => {
    $$('.tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    $$('.view').forEach(view => view.classList.remove('active-view'));
    $(`#${tab.dataset.view}`).classList.add('active-view');
  }));

  // Chip de capacité (conception pédagogique) -> ouvrir le module correspondant dans le Référentiel.
  document.body.addEventListener('click', (event) => {
    const cap = event.target.closest('[data-capacity-code]');
    if (!cap) return;
    event.preventDefault();
    openReferenceModuleForCapacity(cap.dataset.capacityCode);
  });

  // Onglets de module (M4 / M5).
  $$('[data-ref-module]').forEach(btn => btn.addEventListener('click', () => {
    selectedReferenceModule = btn.dataset.refModule;
    const countEl = $('#refmodCount'); if (countEl) countEl.textContent = '';
    const input = $('#referenceModuleSearch'); if (input) input.value = '';
    renderReferenceModule();
  }));
  // Recherche dans le module (débounce).
  let refmodTimer;
  $('#referenceModuleSearch')?.addEventListener('input', (event) => {
    clearTimeout(refmodTimer);
    const value = event.target.value;
    refmodTimer = setTimeout(() => refmodSearch(value), 180);
  });
  $('#refmodExpand')?.addEventListener('click', refmodExpandAll);
  $('#refmodCollapse')?.addEventListener('click', refmodCollapseAll);
  $('#refmodClear')?.addEventListener('click', () => {
    const input = $('#referenceModuleSearch'); if (input) input.value = '';
    refmodClearMarks();
    const countEl = $('#refmodCount'); if (countEl) countEl.textContent = '';
  });

  // Ruban pédagogique
  $$('[data-ruban-mode]').forEach(btn => btn.addEventListener('click', () => setRubanMode(btn.dataset.rubanMode)));

  // Créneaux de cours type
  $$('[data-creneaux-period]').forEach(btn => btn.addEventListener('click', () => {
    creneauxPeriod = btn.dataset.creneauxPeriod;
    renderCreneaux();
  }));
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
  let rubanTimer;
  $('#rubanSearch')?.addEventListener('input', () => { clearTimeout(rubanTimer); rubanTimer = setTimeout(renderRuban, 160); });
  $('#rubanPdfSelect')?.addEventListener('change', () => renderRubanPdf());
  // Clics Ruban : ✎ (composition d'UE), ↺ (rétablir une UE), capacité (→ référentiel).
  document.body.addEventListener('click', (event) => {
    const editUe = event.target.closest('[data-edit-ue]');
    if (editUe) { event.preventDefault(); openUeCapsModal(editUe.dataset.editUe); return; }
    const resetUe = event.target.closest('[data-ruban-reset-ue]');
    if (resetUe) {
      event.preventDefault();
      if (confirm('Rétablir les capacités d’origine (PDF) de cette UE ?')) rubanResetUe(resetUe.dataset.rubanResetUe);
      return;
    }
    const cap = event.target.closest('[data-ruban-cap]');
    if (!cap) return;
    event.preventDefault();
    openReferenceModuleForCapacity(cap.dataset.rubanCap);
  });
  // Édition inline des enseignants / évaluateurs (enregistrement sur "change" ou Entrée).
  document.body.addEventListener('change', (event) => {
    const input = event.target.closest('.ruban-edit');
    if (!input) return;
    rubanUpdateCapField(input.dataset.rubanEditUe, input.dataset.rubanEditCode, input.dataset.rubanEditField, input.value);
  });
  // Modale de composition d'une UE.
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
  $('#resetUeCapsButton')?.addEventListener('click', async () => {
    const ueCode = $('#ueCapsCode').value;
    if (!ueCode || !confirm('Rétablir les capacités d’origine (PDF) de cette UE ?')) return;
    await rubanResetUe(ueCode);
    $('#ueCapsDialog').close();
  });
  $('#cancelUeCapsButton')?.addEventListener('click', () => $('#ueCapsDialog').close());
  $('#closeUeCapsModal')?.addEventListener('click', () => $('#ueCapsDialog').close());
  document.body.addEventListener('keydown', (event) => {
    const input = event.target.closest('.ruban-edit');
    if (input && event.key === 'Enter') { event.preventDefault(); input.blur(); }
  });

  $('#printButton')?.addEventListener('click', () => window.print());
  $('#exportDataBtn')?.addEventListener('click', () => exportData());
  $('#importDataBtn')?.addEventListener('click', () => $('#importDataInput')?.click());
  $('#importDataInput')?.addEventListener('change', (event) => {
    const file = event.target.files && event.target.files[0];
    importDataFromFile(file);
    event.target.value = '';
  });
  $('#printWeekButton')?.addEventListener('click', () => printWeekPlanning());
  $('#addConstraintGlobalButton')?.addEventListener('click', () => openConstraintModal());
  $('#addConstraintDashboardButton').addEventListener('click', (e) => { e.stopPropagation(); openConstraintModal(); });
  $('#addConstraintSemesterButton')?.addEventListener('click', () => openConstraintModal());
  $('#addConstraintGanttButton')?.addEventListener('click', () => openConstraintModal());
  $('#addSequenceGanttButton')?.addEventListener('click', () => openSequenceModal());
  $('#addSessionGanttButton')?.addEventListener('click', () => openSessionModal(null, { placementStatus: 'Fictif à placer' }));
  $('#weekSelect').addEventListener('change', (event) => { selectedWeek = event.target.value; renderPlanning(); });
  $('#weekCalendar')?.addEventListener('click', (event) => {
    const nav = event.target.closest('[data-cal-nav]');
    if (nav) { if (!nav.disabled) moveCalendarMonth(nav.dataset.calNav === 'prev' ? -1 : 1); return; }
    const wnav = event.target.closest('[data-week-nav]');
    if (wnav) { moveWeek(wnav.dataset.weekNav === 'prev' ? -1 : 1); return; }
    const btn = event.target.closest('[data-set-week]');
    if (!btn) return;
    selectedWeek = btn.dataset.setWeek;
    weekPickerMonthKey = null; // resynchronise le mois affiché sur la semaine choisie
    $('#weekCalendar')?.classList.remove('is-open');
    renderPlanning();
  });
  $('#weekPickerToggle')?.addEventListener('click', () => $('#weekCalendar')?.classList.toggle('is-open'));
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

  // Notes libres « À faire » — saisie rapide, enregistrement automatique
  let todoTimer;
  const persistTodo = async () => {
    if (!state) return;
    const value = $('#todoNotes')?.value ?? '';
    if (value === state.todoNotes) return;
    state.todoNotes = value;
    // Autosave silencieux : ne PAS re-render tout le portail à chaque frappe
    // (sinon la vue « saute »). On rafraîchit seulement l'indicateur de statut.
    try { await saveData('Notes « À faire » enregistrées', { rerender: false }); updateTodoStatus(); } catch (e) { setSaveStatus('Erreur d’enregistrement des notes'); }
  };
  $('#todoNotes')?.addEventListener('input', () => {
    updateTodoStatus();
    clearTimeout(todoTimer);
    todoTimer = setTimeout(persistTodo, 800);
  });
  $('#todoNotes')?.addEventListener('blur', () => { clearTimeout(todoTimer); persistTodo(); });
  $('#clearTodoNotes')?.addEventListener('click', async () => {
    if (!($('#todoNotes')?.value || '').trim()) return;
    if (!window.confirm('Effacer toutes les notes « À faire » ?')) return;
    $('#todoNotes').value = '';
    state.todoNotes = '';
    updateTodoStatus();
    $('#todoAlert') && ($('#todoAlert').hidden = true);
    await saveData('Notes « À faire » effacées');
  });
  $('#todoAlertDismiss')?.addEventListener('click', () => { const a = $('#todoAlert'); if (a) a.hidden = true; });
  $('#todoAlert')?.addEventListener('click', (event) => {
    if (event.target.id === 'todoAlertDismiss') return;
    $('#todoNotes')?.focus();
  });

  // Notes libres « Bugs & améliorations » — même mécanique que « À faire »
  let devTimer;
  const persistDev = async () => {
    if (!state) return;
    const value = $('#devNotes')?.value ?? '';
    if (value === state.devNotes) return;
    state.devNotes = value;
    try { await saveData('Notes « Bugs & améliorations » enregistrées', { rerender: false }); updateDevStatus(); } catch (e) { setSaveStatus('Erreur d’enregistrement des notes'); }
  };
  $('#devNotes')?.addEventListener('input', () => {
    updateDevStatus();
    clearTimeout(devTimer);
    devTimer = setTimeout(persistDev, 800);
  });
  $('#devNotes')?.addEventListener('blur', () => { clearTimeout(devTimer); persistDev(); });
  $('#clearDevNotes')?.addEventListener('click', async () => {
    if (!($('#devNotes')?.value || '').trim()) return;
    if (!window.confirm('Effacer toutes les notes « Bugs & améliorations » ?')) return;
    $('#devNotes').value = '';
    state.devNotes = '';
    updateDevStatus();
    await saveData('Notes « Bugs & améliorations » effacées');
  });

  $('#weekBacklogScope')?.addEventListener('change', e => { weekBacklogScope = e.target.value; renderWeekBacklog(); });
  $('#weekBacklogUeFilter')?.addEventListener('change', e => { weekBacklogUeFilter = e.target.value; weekBacklogSequenceFilter = 'Tous'; renderWeekBacklog(); });
  $('#weekBacklogSequenceFilter')?.addEventListener('change', e => { weekBacklogSequenceFilter = e.target.value; renderWeekBacklog(); });

  $('#designPromotionFilter').addEventListener('change', e => { designPromotionFilter = e.target.value; renderDesign(); });
  $('#designSemesterFilter').addEventListener('change', e => { designSemesterFilter = e.target.value; renderDesign(); });
  $('#designTeacherFilter')?.addEventListener('change', e => { designTeacherFilter = e.target.value; renderDesign(); });
  $('#designSearch').addEventListener('input', () => renderDesign());
  $('#designUeChoices')?.addEventListener('change', (event) => {
    const checkbox = event.target.closest('input[type="checkbox"]');
    if (!checkbox) return;
    const id = checkbox.value;
    designHiddenUeIds = checkbox.checked ? designHiddenUeIds.filter(x => x !== id) : [...designHiddenUeIds, id];
    renderDesign();
  });
  $('#semesterPromotionFilter')?.addEventListener('change', e => { semesterPromotionFilter = e.target.value; renderSemester(); });
  $('#semesterFilter')?.addEventListener('change', e => { semesterFilter = e.target.value; renderSemester(); });
  $('#ganttPromotionFilter').addEventListener('change', e => { ganttPromotionFilter = e.target.value; renderGantt(); });
    $('#ganttDensity')?.addEventListener('change', e => { ganttDensity = e.target.value; renderGantt(); });
  $('#ganttUeChoices')?.addEventListener('change', () => { ganttFocusedUeIds = $$('#ganttUeChoices input[type="checkbox"]:checked').map(input => input.value); ganttFocusedUeId = ganttFocusedUeIds[0] || ''; renderGantt(); });
  $('#ganttSemesterChoices').addEventListener('change', () => {
    ganttSemesterFilters = $$('#ganttSemesterChoices input[type="checkbox"]:checked').map(input => input.value);
    renderGantt();
  });

  $('#addUeButton').addEventListener('click', () => openUeModal());
  $('#addSequenceButton').addEventListener('click', () => openSequenceModal());
  $('#addFictiveSessionButton').addEventListener('click', () => openSessionModal(null, { placementStatus: 'Fictif à placer' }));
  $('#addSessionButton').addEventListener('click', () => openSessionModal(null, { placementStatus: 'Définitif EDT', forceDefinitive: true, weekId: selectedWeek, promotion: 'GPN1', day: 0, slot: 0 }));

  $('#constraintsList').addEventListener('click', (event) => {
    const el = event.target.closest('[data-edit-constraint]');
    if (el) openConstraintModal(findConstraint(el.dataset.editConstraint));
  });

  $('#dashboardBacklog')?.addEventListener('click', (event) => {
    const row = event.target.closest('[data-edit-session]');
    if (row) openSessionModal(findSession(row.dataset.editSession));
  });
  $('#ueTree').addEventListener('click', (event) => {
    const editUe = event.target.closest('[data-edit-ue]');
    if (editUe) return openUeModal(findUe(editUe.dataset.editUe));
    const newSeq = event.target.closest('[data-new-sequence-ue]');
    if (newSeq) return openSequenceModal(null, { ueId: newSeq.dataset.newSequenceUe });
    const newSessionUe = event.target.closest('[data-new-session-ue]');
    if (newSessionUe) return openSessionModal(null, { ueId: newSessionUe.dataset.newSessionUe, placementStatus: 'Fictif à placer' });
    const exportUe = event.target.closest('[data-export-ue]');
    if (exportUe) return exportUeProgressionPrint(findUe(exportUe.dataset.exportUe));
    const exportSeq = event.target.closest('[data-export-sequence]');
    if (exportSeq) return exportSequencePrint(findSequence(exportSeq.dataset.exportSequence));
    const editSession = event.target.closest('[data-edit-session]');
    if (editSession) return openSessionModal(findSession(editSession.dataset.editSession));
    const editSeq = event.target.closest('[data-edit-sequence]');
    if (editSeq) return openSequenceModal(findSequence(editSeq.dataset.editSequence));
    const newSessionSeq = event.target.closest('[data-new-session-sequence]');
    if (newSessionSeq) {
      const seq = findSequence(newSessionSeq.dataset.newSessionSequence);
      return openSessionModal(null, { sequenceId: seq.id, ueId: seq.ueId, placementStatus: 'Fictif à placer' });
    }
    const newEilSession = event.target.closest('[data-new-eil-session]');
    if (newEilSession) {
      const c = findConstraint(newEilSession.dataset.newEilSession);
      return openSessionModal(null, { constraintId: newEilSession.dataset.newEilSession, ueId: newEilSession.dataset.eilUe, promotion: (c?.promotions || [])[0] || '', placementStatus: 'Fictif à placer' });
    }
  });

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

  $('#semesterTable')?.addEventListener('click', (event) => {
    const printUe = event.target.closest('[data-print-timeline-ue]');
    if (printUe) return printTimelineUe(printUe.dataset.printTimelineUe);
    const constraintEl = event.target.closest('[data-edit-constraint]');
    if (constraintEl) return openConstraintModal(findConstraint(constraintEl.dataset.editConstraint));
    const sessionEl = event.target.closest('[data-edit-session]');
    if (sessionEl) return openSessionModal(findSession(sessionEl.dataset.editSession));
    const seqEl = event.target.closest('[data-edit-sequence]');
    if (seqEl) return openSequenceModal(findSequence(seqEl.dataset.editSequence));
  });

  $('#ganttTimeline')?.addEventListener('click', (event) => {
    const printUe = event.target.closest('[data-print-timeline-ue]');
    if (printUe) return printTimelineUe(printUe.dataset.printTimelineUe);
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
      return openSessionModal(null, { ...context, placementStatus: 'Définitif EDT', forceDefinitive: true, weekId: selectedWeek });
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
    const button = event.target.closest('[data-place-session]');
    if (button) return openSessionModal(findSession(button.dataset.placeSession), { forceDefinitive: true, weekId: selectedWeek });
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
    refreshSequencePeriodDates('', ue);
  });
  $('#ueCode').addEventListener('input', () => updateUeCapacityPreview(findUeByCode($('#ueCode').value) || { code: $('#ueCode').value, capacities: [] }));
  $('#uePromotion').addEventListener('change', () => updateUeCapacityPreview(findUeByCode($('#ueCode').value) || {}));
  $('#ueSemester').addEventListener('change', () => updateUeCapacityPreview(findUeByCode($('#ueCode').value) || {}));
  $('#sequencePromotion')?.addEventListener('change', () => refreshSequencePeriodDates($('#sequenceWeeks')?.value || '', findUe($('#sequenceUe')?.value)));
  $('#sequenceCalendar')?.addEventListener('click', (event) => {
    const nav = event.target.closest('[data-seqcal-nav]');
    if (nav) { if (!nav.disabled) moveSequenceCalendarMonth(nav.dataset.seqcalNav === 'next' ? 1 : -1); return; }
    const btn = event.target.closest('[data-seqpick-week]');
    if (!btn) return;
    const key = btn.dataset.seqpickWeek; // clé lundi (AAAA-MM-JJ)
    const startEl = $('#sequenceStartDate');
    const endEl = $('#sequenceEndDate');
    if (!startEl || !endEl) return;
    const toKey = iso => { const d = parseIsoDate(iso); return d ? isoKey(mondayOf(d)) : ''; };
    const s = toKey(startEl.value);
    const e = toKey(endEl.value);
    if (!s || (s && e)) { startEl.value = key; endEl.value = ''; }          // (re)commence une plage
    else if (key < s) { endEl.value = startEl.value; startEl.value = key; } // clic avant le début → on inverse
    else { endEl.value = key; }
    syncSequenceWeeksField();
    renderSequenceCalendar();
  });
  $('#sequenceCapacityChoices')?.addEventListener('change', () => updateSequenceCapacityDetails());
  $('#sessionPlacementStatus').addEventListener('change', applySessionPlacementVisibility);
  // Lot S(a) — la « Durée prévue » pilote la fin standard (donc la hauteur du bloc
  // dans le Planning hebdo) : changer le nombre d'heures d'une séance déjà placée
  // recalcule la fin → le rowspan s'actualise à l'enregistrement. La fin reste
  // ajustable ensuite à la main. Ne s'active que sur interaction (pas à l'ouverture
  // de la modale, qui pose les valeurs sans déclencher d'événement).
  const syncSessionEndFromDuration = () => {
    const duration = $('#sessionExpectedDuration').value.trim();
    if (!duration) return; // aucune durée saisie : ne pas toucher à la fin choisie
    $('#sessionEnd').value = String(inferEndSlot(Number($('#sessionStart').value), duration));
  };
  $('#sessionExpectedDuration').addEventListener('input', syncSessionEndFromDuration);
  $('#sessionStart').addEventListener('change', syncSessionEndFromDuration);
  $('#sessionUe').addEventListener('change', () => {
    refreshSessionSequenceSelect('');
    renderSessionCapacityChoices([], findUe($('#sessionUe').value));
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
    $('#sessionUe').value = seq.ueId;
    $('#sessionPromotion').value = seq.promotion;
    refreshSessionSequenceSelect(seq.id);
    renderSessionCapacityChoices(seq.capacityCodes || [], findUe(seq.ueId), seq);
  });

  bindModalActions();
}

function bindModalActions() {
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
    const sequence = {
      id,
      ueId: $('#sequenceUe').value,
      title: $('#sequenceTitle').value.trim(),
      promotion: $('#sequencePromotion').value,
      semester: $('#sequenceSemester').value || findUe($('#sequenceUe').value)?.semester || '',
      targetWeeks: getSequencePeriodValue(),
      periodNote: $('#sequencePeriodNote').value.trim(),
      hoursEstimate: $('#sequenceHours').value.trim(),
      sequenceType: $('#sequenceType').value || '',
      status: $('#sequenceStatus').value,
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
  $('#cancelSequenceButton').addEventListener('click', () => $('#sequenceDialog').close());
  $('#closeSequenceModal').addEventListener('click', () => $('#sequenceDialog').close());
  // Lot L — sélecteur de couleur de séquence : toute modification manuelle = couleur
  // « choisie » ; le bouton Auto revient à la couleur automatique (dérivée de l'UE).
  $('#sequenceColorInput')?.addEventListener('input', (event) => { event.target.dataset.custom = '1'; });
  $('#sequenceColorAuto')?.addEventListener('click', () => {
    const el = $('#sequenceColorInput');
    if (!el) return;
    el.dataset.custom = '0';
    const seq = state.sequences.find(s => s.id === $('#sequenceId').value);
    el.value = computedSequenceColor(seq ? { ...seq, color: '' } : { ueId: $('#sequenceUe').value, id: '__new' });
  });

  $('#sessionForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const id = $('#sessionId').value || uid('session');
    const startSlot = Number($('#sessionStart').value);
    const endSlot = Number($('#sessionEnd').value);
    const placementStatus = $('#sessionPlacementStatus').value;
    const selectedSessionWeek = $('#sessionWeek').value;
    // Lot K — le rattachement est SOIT une séquence, SOIT une semaine thématique
    // (valeur « eil:<id> » → constraintId). Jamais les deux.
    const rattVal = $('#sessionSequence').value;
    const isEilRatt = rattVal.startsWith('eil:');
    const sessionDemiGroupe = $('#sessionDemiGroupe')?.value || ''; // Lot V — champ « Groupe » unifié
    const session = {
      id,
      title: $('#sessionTitle').value.trim(),
      ueId: $('#sessionUe').value,
      sequenceId: isEilRatt ? '' : rattVal,
      constraintId: isEilRatt ? rattVal.slice(4) : '',
      promotion: $('#sessionPromotion').value,
      placementStatus,
      targetWeekId: selectedSessionWeek,
      weekId: placementStatus === 'Définitif EDT' ? selectedSessionWeek : '',
      day: Number($('#sessionDay').value),
      startSlot: Math.min(startSlot, endSlot),
      endSlot: Math.max(startSlot, endSlot),
      expectedDuration: $('#sessionExpectedDuration').value.trim(),
      order: $('#sessionOrder').value.trim(),
      fictiveSlot: $('#sessionFictiveSlot').value.trim(),
      fictiveDay: $('#sessionFictiveDay').value,
      exactDate: $('#sessionExactDate').value.trim(),
      customStart: $('#sessionCustomStart').value.trim(),
      customEnd: $('#sessionCustomEnd').value.trim(),
      capacityCodes: selectedCheckboxValues('#sessionCapacityChoices'),
      type: $('#sessionType').value,
      color: getSessionColorFieldValue(),
      demiGroupe: sessionDemiGroupe, // Lot V — '' | 'A' | 'B'
      group: sessionDemiGroupe === 'A' ? 'Groupe A' : sessionDemiGroupe === 'B' ? 'Groupe B' : 'Classe entière', // dérivé (exports)
      teacher: $('#sessionTeacher').value.trim(),
      room: $('#sessionRoom').value.trim(),
      status: $('#sessionStatus').value,
      objectives: $('#sessionObjectives').value.trim(),
      keywords: $('#sessionKeywords').value.trim(),
      activities: $('#sessionActivities').value.trim(),
      notions: $('#sessionNotions').value.trim(),
      materials: $('#sessionMaterials').value.trim(),
      assessment: $('#sessionAssessment').value.trim(),
      homework: $('#sessionHomework').value.trim(),
      differentiation: $('#sessionDifferentiation').value.trim(),
      notes: $('#sessionNotes').value.trim(),
      personalVehicle: $('#sessionPersonalVehicle')?.checked || false
    };
    const index = state.sessions.findIndex(s => s.id === id);
    if (index >= 0) state.sessions[index] = session; else state.sessions.push(session);
    if (session.weekId) selectedWeek = session.weekId;
    if (session.personalVehicle) ensureDeplacementForSession(session);
    $('#sessionDialog').close();
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
  $('#cancelSessionButton').addEventListener('click', () => $('#sessionDialog').close());
  $('#closeSessionModal').addEventListener('click', () => $('#sessionDialog').close());
  $('#duplicateSessionButton')?.addEventListener('click', async () => {
    const source = findSession($('#sessionId').value);
    if (!source) return;
    $('#sessionDialog').close();
    await duplicateSession(source);
  });
  // Lot L — couleur propre d'une séance : modification manuelle = couleur choisie ;
  // Auto = couleur héritée (séquence si rattachée, sinon UE).
  $('#sessionColorInput')?.addEventListener('input', (event) => { event.target.dataset.custom = '1'; });
  $('#sessionColorAuto')?.addEventListener('click', () => {
    const el = $('#sessionColorInput');
    if (!el) return;
    el.dataset.custom = '0';
    const seqId = $('#sessionSequence').value;
    el.value = seqId ? sequenceColor(seqId) : ueColor($('#sessionUe').value);
  });

  // ---- Frais de déplacement (Lot E — encart du Tableau de bord) ----
  $('#addDeplacementButton')?.addEventListener('click', () => openDeplacementModal());
  $('#fraisStatusFilter')?.addEventListener('change', renderFrais);
  $('#fraisClasseFilter')?.addEventListener('change', renderFrais);
  $$('[data-export-frais]').forEach(btn => btn.addEventListener('click', () => {
    const fmt = btn.dataset.exportFrais;
    if (fmt === 'csv') exportFraisCsv();
    else if (fmt === 'xls') exportFraisXls();
    else exportFraisOds();
  }));
  const openDeplacementFromEvent = (event) => {
    const el = event.target.closest('[data-edit-deplacement]');
    if (!el) return;
    const dep = state.deplacements.find(d => d.id === el.dataset.editDeplacement);
    if (dep) openDeplacementModal(dep);
  };
  $('#fraisTableWrap')?.addEventListener('click', openDeplacementFromEvent);
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
    if (!id || !confirm('Supprimer ce déplacement ?')) return;
    state.deplacements = state.deplacements.filter(d => d.id !== id);
    $('#deplacementDialog').close();
    await saveData('Déplacement supprimé');
  });

  // ---- Réunions (Lot M — journal du Tableau de bord) ----
  $('#addReunionButton')?.addEventListener('click', () => openReunionModal());
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
      personalVehicle: $('#reunionVehicle').checked
    };
    const idx = state.reunions.findIndex(r => r.id === id);
    if (idx >= 0) state.reunions[idx] = reunion; else state.reunions.push(reunion);
    // Coché → garantit une ligne dans Frais (jamais supprimée si décoché ensuite).
    if (reunion.personalVehicle) ensureDeplacementForReunion(reunion);
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
    openSessionModal(null, { constraintId: c.id, ueId: carrierUe?.id || '', promotion: promo, placementStatus: 'Fictif à placer' });
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

function renderCapacityPills(codes = []) {
  if (!codes || !codes.length) return '';
  return `<div class="capacity-pills">${codes.map(code => `<button type="button" class="capacity-pill" data-capacity-code="${escapeAttr(code)}">${escapeHtml(code)}</button>`).join('')}</div>`;
}

function renderCapacityCheckboxes(containerSelector, capacities = [], selectedCodes = []) {
  const container = $(containerSelector);
  if (!container) return;
  const selected = new Set(selectedCodes || []);
  container.innerHTML = capacities.length
    ? capacities.map(cap => `<label class="checkbox-item"><input type="checkbox" value="${escapeAttr(cap.code)}" ${selected.has(cap.code) ? 'checked' : ''}><span><strong>${escapeHtml(cap.code)}</strong> — ${escapeHtml(cap.title)}</span></label>`).join('')
    : '<p class="meta">Aucune capacité disponible pour cette UE.</p>';
}

function renderSequenceCapacityChoices(selectedCodes = [], ue = null) {
  renderCapacityCheckboxes('#sequenceCapacityChoices', ueCapacities(ue || $('#sequenceUe')?.value), selectedCodes);
  updateSequenceCapacityDetails();
}

function renderSessionCapacityChoices(selectedCodes = [], ue = null, seq = null) {
  const codesFromSequence = seq?.capacityCodes || [];
  const selected = selectedCodes.length ? selectedCodes : codesFromSequence;
  renderCapacityCheckboxes('#sessionCapacityChoices', ueCapacities(ue || $('#sessionUe')?.value), selected);
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

/* D3 / D3-bis — la période de séquence se saisit dans le calendrier maison (à n°
   de semaine). On pré-remplit les bornes (lundi ISO début/fin, champs cachés)
   depuis targetWeeks — sur toute l'année de la promo, pour couvrir les UE à cheval
   S3/S4 — puis on (re)dessine le calendrier en sélection de plage. */
function refreshSequencePeriodDates(targetWeeks = '', ue = null) {
  const startInput = $('#sequenceStartDate');
  const endInput = $('#sequenceEndDate');
  if (!startInput || !endInput) return;
  const resolvedUe = ue || findUe($('#sequenceUe')?.value);
  const semester = resolvedUe?.semester || $('#sequenceSemester')?.value || 'Semestre 1';
  if ($('#sequenceSemester')) $('#sequenceSemester').value = semester;
  const weeks = weeksForSemesterSpan(semester);
  const ranges = parseWeekRanges(targetWeeks);
  const firstRange = ranges[0] || {};
  const startWeek = firstRange.start ? weeks.find(w => weekNumberOf(w) === Number(firstRange.start)) : null;
  const endWeek = firstRange.end ? weeks.find(w => weekNumberOf(w) === Number(firstRange.end)) : startWeek;
  startInput.value = startWeek ? isoOf(weekDateRange(startWeek)[0]) : '';
  endInput.value = endWeek ? isoOf(weekDateRange(endWeek)[0]) : (startInput.value || '');
  seqCalMonthKey = null; // recentre le calendrier sur la période sélectionnée
  syncSequenceWeeksField();
  renderSequenceCalendar();
}

/* D3-bis Étape 2 — calendrier maison (à n° de semaine) intégré à la modale
   séquence, en sélection de PLAGE : 1er clic = semaine de début, 2e = semaine de
   fin (surlignage). Semaines cliquables = toute l'année de la promo (paire de
   semestres), pour couvrir les UE à cheval et les EIL hors semestre nominal. */
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

  const startIso = $('#sequenceStartDate')?.value || '';
  const endIso = $('#sequenceEndDate')?.value || '';
  const toKey = iso => { const d = parseIsoDate(iso); return d ? isoKey(mondayOf(d)) : ''; };
  const startKey = toKey(startIso);
  const endKey = toKey(endIso);

  const firstMonth = new Date(minDate.getFullYear(), minDate.getMonth(), 1);
  const lastMonth = new Date(maxDate.getFullYear(), maxDate.getMonth(), 1);
  const clampMonth = (d) => new Date(Math.min(Math.max(d.getTime(), firstMonth.getTime()), lastMonth.getTime()));
  let shown;
  if (seqCalMonthKey) {
    const [y, m] = seqCalMonthKey.split('-').map(Number);
    shown = new Date(y, m - 1, 1);
  } else {
    const base = parseIsoDate(startIso) || minDate;
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
    const d = parseIsoDate($('#sequenceStartDate')?.value || '') || (weeks[0] ? weekDateRange(weeks[0])[0] : new Date());
    base = new Date(d.getFullYear(), d.getMonth(), 1);
  }
  base.setMonth(base.getMonth() + offset);
  seqCalMonthKey = `${base.getFullYear()}-${String(base.getMonth() + 1).padStart(2, '0')}`;
  renderSequenceCalendar();
}

function getSequencePeriodValue() {
  const startIso = $('#sequenceStartDate')?.value || '';
  const endIso = $('#sequenceEndDate')?.value || '';
  if (!startIso && !endIso) return ($('#sequenceWeeks')?.value || '').trim();
  const sN = startIso ? weekNumberOf(weekForIsoDate(startIso) || {}) : 0;
  const eN = endIso ? weekNumberOf(weekForIsoDate(endIso) || {}) : 0;
  const fmt = n => `S${String(n).padStart(2, '0')}`;
  if (sN && !eN) return fmt(sN);
  if (!sN && eN) return fmt(eN);
  if (sN && eN) return sN === eN ? fmt(sN) : `${fmt(sN)}-${fmt(eN)}`;
  return ($('#sequenceWeeks')?.value || '').trim();
}

function syncSequenceWeeksField() {
  const value = getSequencePeriodValue();
  const target = $('#sequenceWeeks');
  if (target) target.value = value;
  const hint = $('#sequencePeriodWeeks');
  if (hint) hint.textContent = value ? `Semaines couvertes : ${value.replace('-', ' → ')}` : '';
}

function renderSequenceWeekPicker(selectedWeeksText = '') {
  const container = $('#sequenceWeekPicker');
  if (!container || !state) return;
  const semester = $('#sequenceSemester')?.value || 'Semestre 1';
  const promotion = $('#sequencePromotion')?.value || '';
  const weeks = weeksForSemester(semester);
  const selectedNumbers = new Set(parseWeekRanges(selectedWeeksText).flatMap(range => {
    const nums = [];
    weeks.forEach(w => { const n = weekNumberOf(w); if (rangeIncludesWeek(range, n)) nums.push(n); });
    return nums;
  }));
  container.innerHTML = weeks.map(w => {
    const n = weekNumberOf(w);
    const checked = selectedNumbers.has(n);
    const constraints = constraintsForWeek(w, promotion);
    return `<label class="week-chip ${checked ? 'selected' : ''} ${constraints.length ? 'has-constraint' : ''}" title="${escapeAttr(w.dateRange)}${constraints.length ? ' · ' + escapeAttr(constraints.map(c => c.label).join(', ')) : ''}"><input type="checkbox" value="${n}" ${checked ? 'checked' : ''}><span>${escapeHtml(w.label)}</span><small>${escapeHtml(compactDateRange(w.dateRange))}</small></label>`;
  }).join('');
  updateSequenceWeeksFromPicker(false);
}

function updateSequenceWeeksFromPicker(updateClasses = true) {
  const inputs = $$('#sequenceWeekPicker input[type="checkbox"]');
  const selected = inputs.filter(input => input.checked).map(input => Number(input.value)).sort((a, b) => a - b);
  const target = $('#sequenceWeeks');
  if (target) target.value = compressWeekNumbers(selected);
  if (updateClasses) inputs.forEach(input => input.closest('.week-chip')?.classList.toggle('selected', input.checked));
}

function compressWeekNumbers(numbers = []) {
  if (!numbers.length) return '';
  const unique = [...new Set(numbers)].sort((a, b) => a - b);
  const ranges = [];
  let start = unique[0];
  let prev = unique[0];
  for (let i = 1; i <= unique.length; i += 1) {
    const current = unique[i];
    if (current === prev + 1) { prev = current; continue; }
    ranges.push(start === prev ? `S${String(start).padStart(2, '0')}` : `S${String(start).padStart(2, '0')}-S${String(prev).padStart(2, '0')}`);
    start = current;
    prev = current;
  }
  return ranges.join(', ');
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

function applySessionPlacementVisibility() {
  const placement = $('#sessionPlacementStatus')?.value || 'Fictif à placer';
  const section = $('#sessionPlacementSection');
  if (!section) return;
  section.dataset.mode = placement === 'Définitif EDT' ? 'definitive' : 'fictive';
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
    <span class="status-pill ${isFictiveSession(s) ? 'status-a-placer' : 'status-definitif-edt'}">${isFictiveSession(s) ? 'À placer' : 'EDT'}</span>
  </div>`;
}

function displayPlacementStatus(value) { return value === 'Fictif à placer' ? 'À placer' : (value || ''); }
function isFictiveSession(s) { return s.placementStatus === 'Fictif à placer' || !s.weekId; }
function isDefinitiveSession(s) { return s.placementStatus === 'Définitif EDT' && !!s.weekId; }

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
  if (t.includes('tp')) return 'type-tp';
  if (t.includes('terrain') || t.includes('sortie')) return 'type-terrain';
  if (t.includes('pluri')) return 'type-pluri';
  if (t.includes('autonomie')) return 'type-autonomie';
  if (t.includes('projet')) return 'type-projet';
  if (t.includes('thématique') || t.includes('eil')) return 'type-theme';
  if (t.includes('évaluation') || t.includes('evaluation')) return 'type-eval';
  return '';
}

function weeksForSemester(semester) {
  return state.weeks.filter(w => {
    const n = Number(w.weekNumber ?? String(w.label).replace(/\D/g, ''));
    if (semester === 'Semestre 1' || semester === 'Semestre 3') return (Number(w.isoYear) === 2026 && n >= 36 && n <= 53);
    if (semester === 'Semestre 2') return (Number(w.isoYear) === 2027 && n >= 1 && n <= 17);
    if (semester === 'Semestre 4') return (Number(w.isoYear) === 2027 && n >= 1 && n <= 22);
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

// Lot R — période calendaire d'une semaine : automne = année ISO 2026 (sem. 36→53,
// sept→déc), printemps = année ISO 2027 (sem. 1→22, jan→mai). Sert à colorer les
// bandeaux de promo dans le planning hebdo.
function weekPeriodClass(week) {
  if (!week) return '';
  const n = Number(week.weekNumber ?? String(week.label).replace(/\D/g, ''));
  const y = Number(week.isoYear);
  if (y === 2026 && n >= 36 && n <= 53) return 'period-autumn';
  if (y === 2027 && n >= 1 && n <= 22) return 'period-spring';
  return '';
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

// Démarrage piloté depuis js/auth.js : l'app ne se lance qu'après connexion
// (compte actif). bindEvents() ne doit s'exécuter qu'une fois par page — une
// déconnexion/reconnexion dans la même page ne doit pas rebrancher les
// écouteurs d'événements une deuxième fois.
let ocAppDemarre = false;
window.OC_APP = {
  demarrer() {
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
  }
};
