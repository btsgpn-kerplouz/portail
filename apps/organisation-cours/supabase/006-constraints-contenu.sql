-- ============================================================================
-- organisation-cours — ajoute la colonne contenu manquante sur oc_constraints
-- ============================================================================
-- Repéré en écrivant js/sync.js (étape 3) : schema.sql donne à oc_ues,
-- oc_sequences et oc_sessions une colonne `contenu jsonb` (résidu du legacy
-- sans colonne relationnelle dédiée), mais PAS à oc_constraints. Or une
-- contrainte de type examen porte un sous-objet `exam` (ueId, control,
-- capacityCodes, absences, remarks) sans équivalent dans le schéma. Sans
-- cette colonne, cette partie du legacy n'aurait eu nulle part où aller —
-- exactement la perte que la "liste blanche + contenu" doit empêcher par
-- construction.
-- ============================================================================

alter table oc_constraints
  add column if not exists contenu jsonb not null default '{}';
