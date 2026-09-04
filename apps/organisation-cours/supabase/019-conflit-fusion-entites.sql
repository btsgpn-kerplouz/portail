-- ============================================================================
-- organisation-cours — détection de conflit + fusion sur les tables relationnelles
-- ============================================================================
-- Bug remonté le 04/09/2026 : un collègue a tapé du texte dans le « Déroulé »
-- d'une séance co-enseignée, et l'a retrouvé vide en rouvrant la séance plus
-- tard. Cause : chaque enregistrement réécrit TOUTE la ligne oc_sessions (un
-- seul UPDATE par ligne, tous les champs à la fois, y compris la colonne
-- jsonb `contenu` où vivent « Déroulé »/« Notions »/« Différenciation »/...).
-- Si un·e collègue avait modifié la ligne entre le chargement et
-- l'enregistrement (même un champ différent, ex. la salle), sa version
-- écrasait silencieusement la nôtre — RIEN ne détectait le conflit,
-- contrairement à oc_blocs_partages qui vérifie déjà `updated_at` (étape 8).
-- Même faille sur oc_ues/oc_sequences/oc_reunions/oc_constraints.
--
-- Correctif (voir js/sync.js, ecrireEntites + fusionnerValeur/fusionnerObjet,
-- committé dans le même lot) : le client vérifie désormais `updated_at` à
-- l'écriture (comme pour les blocs partagés) et tente une fusion champ par
-- champ avant d'abandonner. Mais ce filtre ne sert à rien si `updated_at` ne
-- change jamais tout seul : aucune des écritures actuelles ne le renseigne
-- explicitement (`versLigne` ne le produit pas). D'où ce trigger, qui fait ce
-- que ferait un `updated_at default now()` seul si Postgres le permettait
-- nativement sur UPDATE (il ne le permet que sur INSERT) : le mettre à jour
-- SERVEUR, indépendamment de ce que le client envoie ou omet — fiable même
-- pour une future écriture faite ailleurs (SQL Editor, script d'import...).
-- ============================================================================

create or replace function oc_bump_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists oc_constraints_bump_updated_at on oc_constraints;
create trigger oc_constraints_bump_updated_at
  before update on oc_constraints
  for each row execute function oc_bump_updated_at();

drop trigger if exists oc_ues_bump_updated_at on oc_ues;
create trigger oc_ues_bump_updated_at
  before update on oc_ues
  for each row execute function oc_bump_updated_at();

drop trigger if exists oc_sequences_bump_updated_at on oc_sequences;
create trigger oc_sequences_bump_updated_at
  before update on oc_sequences
  for each row execute function oc_bump_updated_at();

drop trigger if exists oc_sessions_bump_updated_at on oc_sessions;
create trigger oc_sessions_bump_updated_at
  before update on oc_sessions
  for each row execute function oc_bump_updated_at();

drop trigger if exists oc_reunions_bump_updated_at on oc_reunions;
create trigger oc_reunions_bump_updated_at
  before update on oc_reunions
  for each row execute function oc_bump_updated_at();

-- oc_blocs_partages n'a pas besoin de ce trigger : js/sync.js renseigne déjà
-- `updated_at` explicitement dans la ligne écrite (voir construireLigne dans
-- enregistrer(), étape 8) — laissé tel quel.
