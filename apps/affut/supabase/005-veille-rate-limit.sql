-- ============================================================================
-- affut — limite de fréquence pour l'Edge Function affut-veille (Lot 8, durcissement)
-- ============================================================================
-- Le jeton AFFUT_VEILLE_TOKEN protège l'Edge Function, mais reste un secret
-- plus faible que service_role — s'il fuitait, rien ne devait empêcher un
-- appel répété d'inonder la moisson de contenu abusif (voir la discussion
-- dans apps/affut/AVANCEMENT.md, Lot 8, 31/08/2026). Cette table journalise
-- chaque appel POST accepté ; l'Edge Function refuse (429) au-delà d'un
-- seuil sur la dernière heure — voir index.ts, verifierLimiteFrequence().
--
-- Pas de policy d'écriture ici : seule l'Edge Function (via service_role,
-- fourni automatiquement par la plateforme) y écrit.
-- ============================================================================

create table if not exists affut_veille_appels (
  id bigint generated always as identity primary key,
  horodatage timestamptz not null default now()
);

alter table affut_veille_appels enable row level security;

create policy affut_veille_appels_lecture on affut_veille_appels
  for select
  to authenticated
  using (affut_is_active_redacteur());
