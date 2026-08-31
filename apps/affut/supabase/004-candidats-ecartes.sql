-- ============================================================================
-- affut — motif d'écart des candidats de moisson (Lot 8, préparation)
-- ============================================================================
-- Aujourd'hui, écarter un candidat de la moisson (bouton « Écarter », écran
-- Moisson) se contente de le retirer de affut_numeros.moisson sans rien
-- garder — la boucle de retour prévue pour l'agent de veille (Lot 8, voir
-- apps/affut/documents/brief-veille.md, section « Boucle de retour ») ne
-- voit alors que « rejeté », jamais pourquoi. Cette table capture un motif
-- optionnel au moment de l'écart, pour qu'une future exécution de l'agent
-- puisse s'en servir comme exemple négatif.
--
-- Pas une table de log d'ingestion (affut_ingestion_log, posée au Lot 6,
-- reste réservée au futur agent lui-même) : celle-ci est écrite côté
-- rédaction, par l'enseignant, au moment du tri humain.
-- ============================================================================

create table if not exists affut_candidats_ecartes (
  id bigint generated always as identity primary key,
  numero_id integer references affut_numeros(numero) on delete set null,
  candidat_id text not null,
  rubrique text not null default '',
  source jsonb not null default '{}'::jsonb,
  url text not null default '',
  titre text not null default '',
  motif text,
  ecarte_le timestamptz not null default now()
);

comment on table affut_candidats_ecartes is
  'Historique des candidats de moisson écartés par l''enseignant, avec motif optionnel — alimente la boucle de retour de l''agent de veille (Lot 8).';

create index if not exists affut_candidats_ecartes_numero_id_idx on affut_candidats_ecartes(numero_id);

-- Même principe que affut_numeros/affut_entrees/affut_sources_suivies :
-- rédaction (authenticated + actif) a tout, anon n'a rien — jamais de vue
-- publique pour cette table, ce n'est pas une donnée destinée aux élèves.
alter table affut_candidats_ecartes enable row level security;

create policy affut_candidats_ecartes_redaction on affut_candidats_ecartes
  for all
  to authenticated
  using (affut_is_active_redacteur())
  with check (affut_is_active_redacteur());
