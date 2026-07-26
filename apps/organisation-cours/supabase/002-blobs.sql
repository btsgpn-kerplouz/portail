-- ============================================================================
-- organisation-cours — blobs jsonb (étape 2 du plan multi-utilisateurs)
-- ============================================================================
-- À exécuter APRÈS schema.sql + policies.sql, dans le SQL Editor du projet
-- Supabase "portail".
--
-- 7 clés du state legacy n'ont pas de table relationnelle dédiée : les
-- persister quand même (régression sinon, ce sont des données que Martin
-- utilise). Deux tables génériques jsonb, dans l'esprit de la colonne
-- `contenu` déjà retenue dans schema.sql :
--
--   - oc_blocs_perso     : strictement personnel (todoNotes, devNotes,
--                          deplacements, reunions — ces deux derniers sont
--                          les modules nominatifs identifiés par l'audit
--                          RGPD ; les rendre personnels résout la réserve).
--   - oc_blocs_partages  : commun aux enseignants actifs (weekTemplates,
--                          rubanOverrides, rubanUeCaps, promotions,
--                          schoolYear, weekNotes — decision Martin : notes de
--                          semaine communes pour l'instant).
--
-- Limite assumée : un bloc partagé est en "dernier écrivain gagnant" — cf.
-- js/sync.js (étape 3) et étape 8 (contrôle optimiste).
-- ============================================================================

-- ----------------------------------------------------------------------------
-- oc_blocs_perso — un blob par (enseignant, clé)
-- ----------------------------------------------------------------------------
create table if not exists oc_blocs_perso (
  user_id     uuid not null references oc_enseignants (user_id) on delete cascade,
  cle         text not null,
  contenu     jsonb not null default '{}',
  updated_at  timestamptz not null default now(),
  primary key (user_id, cle)
);

comment on table oc_blocs_perso is
  'Blobs jsonb strictement personnels (todoNotes, devNotes, deplacements, reunions). '
  'Jamais visible d''un autre compte, même actif.';

alter table oc_blocs_perso enable row level security;

create policy oc_blocs_perso_select on oc_blocs_perso
  for select
  to authenticated
  using (user_id = auth.uid() and oc_is_active_teacher());

create policy oc_blocs_perso_insert on oc_blocs_perso
  for insert
  to authenticated
  with check (user_id = auth.uid() and oc_is_active_teacher());

create policy oc_blocs_perso_update on oc_blocs_perso
  for update
  to authenticated
  using (user_id = auth.uid() and oc_is_active_teacher())
  with check (user_id = auth.uid() and oc_is_active_teacher());

create policy oc_blocs_perso_delete on oc_blocs_perso
  for delete
  to authenticated
  using (user_id = auth.uid() and oc_is_active_teacher());

-- ----------------------------------------------------------------------------
-- oc_blocs_partages — un blob par clé, partagé entre tous les enseignants actifs
-- ----------------------------------------------------------------------------
create table if not exists oc_blocs_partages (
  cle         text primary key,
  contenu     jsonb not null default '{}',
  updated_at  timestamptz not null default now(),
  updated_par uuid references oc_enseignants (user_id) on delete set null
);

comment on table oc_blocs_partages is
  'Blobs jsonb communs (weekTemplates, rubanOverrides, rubanUeCaps, promotions, '
  'schoolYear, weekNotes). Dernier écrivain gagnant : voir étape 8 pour un contrôle '
  'optimiste sur updated_at.';

alter table oc_blocs_partages enable row level security;

create policy oc_blocs_partages_select on oc_blocs_partages
  for select
  to authenticated
  using (oc_is_active_teacher());

create policy oc_blocs_partages_insert on oc_blocs_partages
  for insert
  to authenticated
  with check (oc_is_active_teacher());

create policy oc_blocs_partages_update on oc_blocs_partages
  for update
  to authenticated
  using (oc_is_active_teacher())
  with check (oc_is_active_teacher());
