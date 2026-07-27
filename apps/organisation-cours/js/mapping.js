// Correspondance state (legacy) ⇄ colonnes Supabase — étape 3 du plan
// multi-utilisateurs (voir mémoire Claude Code : organisation-cours-multiuser-plan).
//
// Principe (règle de conception du plan approuvé) : une LISTE BLANCHE de
// colonnes relationnelles par table ; TOUT le reste d'un objet legacy tombe
// dans la colonne `contenu jsonb`, quel que soit son nom. Un champ ajouté
// demain côté front survit donc sans nouvelle migration — et une erreur dans
// cette liste (colonne oubliée, mal nommée) ne perd jamais de donnée : elle
// atterrit simplement dans `contenu` au lieu d'une colonne dédiée.
//
// Chaque entrée de spec : [cléLegacy, colonneSql, nature].
// natures : 'text' | 'fk' (normalise '' ⇄ null) | 'bool' | 'int' | 'array' | 'jsonb'.

export const SPEC_UES = [
  ['code', 'code', 'text'],
  ['title', 'title', 'text'],
  ['promotion', 'promotion', 'text'],
  ['semester', 'semester', 'text'],
  ['period', 'period', 'text'],
  ['capacities', 'capacities', 'jsonb'],
  ['hoursTarget', 'hours_target', 'text'],
  ['startWeekId', 'start_week_id', 'fk'],
  ['endWeekId', 'end_week_id', 'fk'],
  ['annual', 'annual', 'bool'],
];

export const SPEC_SEQUENCES = [
  ['ueId', 'ue_id', 'fk'],
  ['title', 'title', 'text'],
  ['promotion', 'promotion', 'text'],
  ['semester', 'semester', 'text'],
  ['status', 'status', 'text'],
  ['color', 'color', 'text'],
  ['sequenceType', 'sequence_type', 'text'],
  ['capacityCodes', 'capacity_codes', 'array'],
];

export const SPEC_SESSIONS = [
  ['title', 'title', 'text'],
  ['ueId', 'ue_id', 'fk'],
  ['sequenceId', 'sequence_id', 'fk'],
  ['constraintId', 'constraint_id', 'fk'],
  ['promotion', 'promotion', 'text'],
  ['weekId', 'week_id', 'fk'],
  ['day', 'day', 'int'],
  ['startSlot', 'start_slot', 'int'],
  ['endSlot', 'end_slot', 'int'],
  ['type', 'type', 'text'],
  ['color', 'color', 'text'],
  ['status', 'status', 'text'],
  ['placementStatus', 'placement_status', 'text'],
  ['group', 'groupe', 'text'],
  ['demiGroupe', 'demi_groupe', 'text'],
  ['room', 'room', 'text'],
  ['capacityCodes', 'capacity_codes', 'array'],
];

export const SPEC_CONSTRAINTS = [
  ['label', 'label', 'text'],
  ['type', 'type', 'text'],
  ['start', 'date_debut', 'text'],
  ['end', 'date_fin', 'text'],
  ['promotions', 'promotions', 'array'],
  ['notes', 'notes', 'text'],
];

// Réunions — table relationnelle (et non plus un blob oc_blocs_perso) : une
// réunion doit pouvoir être visible d'un collègue tagué comme participant
// (cf. mémoire Claude Code organisation-cours-multiuser-plan). `participants`
// (noms complets en texte libre, cf. AUDIT-RGPD.md) reste hors liste blanche
// et tombe donc dans `contenu` jsonb, comme n'importe quel champ non listé.
export const SPEC_REUNIONS = [
  ['date', 'date', 'text'],
  ['lieu', 'lieu', 'text'],
  ['sujets', 'sujets', 'text'],
  ['personalVehicle', 'personal_vehicle', 'bool'],
];

function versColonne(nature, valeur) {
  switch (nature) {
    case 'fk':
      return valeur === '' || valeur == null ? null : valeur;
    case 'bool':
      return !!valeur;
    case 'int': {
      const n = Number(valeur);
      return Number.isFinite(n) ? n : null;
    }
    case 'array':
      return Array.isArray(valeur) ? valeur : [];
    case 'jsonb':
      // Les colonnes jsonb du schéma sont toutes `not null default '[]'` —
      // jamais null explicitement, pour ne pas risquer une violation de
      // contrainte si le champ legacy est absent.
      return valeur ?? [];
    default: // 'text'
      return valeur ?? null;
  }
}

function depuisColonne(nature, valeur) {
  switch (nature) {
    case 'fk':
      return valeur ?? '';
    case 'bool':
      return !!valeur;
    case 'int':
      return valeur ?? 0;
    case 'array':
      return valeur ?? [];
    case 'jsonb':
      return valeur ?? null;
    default: // 'text'
      return valeur ?? '';
  }
}

// entité legacy -> ligne SQL (sans id ni cree_par/updated_at, ajoutés par sync.js).
export function versLigne(spec, entite) {
  const ligne = {};
  const contenu = { ...entite };
  delete contenu.id;
  for (const [cleLegacy, colonneSql, nature] of spec) {
    ligne[colonneSql] = versColonne(nature, entite[cleLegacy]);
    delete contenu[cleLegacy];
  }
  ligne.contenu = contenu;
  return ligne;
}

// ligne SQL -> entité legacy. `contenu` est étalé EN PREMIER : les colonnes
// relationnelles (systématiquement plus fiables) l'emportent toujours sur une
// éventuelle clé résiduelle du même nom laissée par une version antérieure.
export function depuisLigne(spec, ligne) {
  const entite = { id: ligne.id, ...(ligne.contenu || {}) };
  for (const [cleLegacy, colonneSql, nature] of spec) {
    entite[cleLegacy] = depuisColonne(nature, ligne[colonneSql]);
  }
  return entite;
}

// Empreinte canonique (clés triées récursivement) : deux objets JS
// représentant la même donnée, construits dans un ordre de clés différent,
// donnent la même empreinte. Sert à détecter ce qui a changé depuis le
// dernier chargement, sans dépendre de l'ordre d'assignation des handlers.
export function empreinte(valeur) {
  return JSON.stringify(trierClesRecursivement(valeur));
}

function trierClesRecursivement(valeur) {
  if (Array.isArray(valeur)) return valeur.map(trierClesRecursivement);
  if (valeur && typeof valeur === 'object') {
    return Object.keys(valeur)
      .sort()
      .reduce((acc, k) => { acc[k] = trierClesRecursivement(valeur[k]); return acc; }, {});
  }
  return valeur;
}
