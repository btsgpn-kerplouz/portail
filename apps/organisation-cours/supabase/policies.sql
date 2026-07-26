-- ============================================================================
-- organisation-cours — Row Level Security (étape 1 du plan multi-utilisateurs)
-- ============================================================================
-- À exécuter APRÈS schema.sql, dans le SQL Editor du projet Supabase "portail".
--
-- Principe général :
--   - Comptes créés en self-service (cf. étape 2 — auth), mais un compte neuf
--     est `actif=false` : il ne voit AUCUNE donnée pédagogique tant que Martin
--     ne l'a pas activé à la main (garde-fou nécessaire sur un dépôt public).
--   - La co-édition partagée passe par les tables de jointure : le créateur
--     d'une UE/séquence/séance garde toujours la main ; un co-enseignant ajouté
--     à la jointure peut modifier à son tour.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Fonction utilitaire : l'appelant est-il un enseignant actif ?
-- SECURITY INVOKER (par défaut) : inutile de s'octroyer plus de droits, la
-- policy SELECT de oc_enseignants ci-dessous est de toute façon ouverte à
-- tout authentifié.
-- ----------------------------------------------------------------------------
create or replace function oc_is_active_teacher()
returns boolean
language sql
stable
as $$
  select exists (
    select 1 from oc_enseignants
    where user_id = auth.uid() and actif
  );
$$;

-- ----------------------------------------------------------------------------
-- oc_enseignants
-- ----------------------------------------------------------------------------
alter table oc_enseignants enable row level security;

-- Lecture ouverte à tout authentifié : nécessaire pour lister les enseignants
-- dans les filtres et la multi-sélection, avant même d'être soi-même activé.
create policy oc_enseignants_select on oc_enseignants
  for select
  to authenticated
  using (true);

-- Un compte ne peut créer que SA propre ligne, et seulement inactive : le
-- self-service ne permet jamais de s'auto-activer.
create policy oc_enseignants_insert_self on oc_enseignants
  for insert
  to authenticated
  with check (user_id = auth.uid() and actif = false);

-- Un compte peut modifier ses propres infos (nom, prénom, initiales...).
-- Le flag `actif` est de toute façon reverrouillé par le trigger ci-dessous,
-- quelle que soit la valeur envoyée ici.
create policy oc_enseignants_update_self on oc_enseignants
  for update
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- Verrou dur sur `actif` : toute tentative de le changer hors contexte
-- service_role (donc hors dashboard Supabase / script admin) est annulée.
-- Note : dans le SQL Editor (rôle postgres, sans JWT), auth.role() vaut NULL
-- et la condition ci-dessous est fausse -> Martin peut activer un compte
-- directement en SQL sans avoir besoin de la clé service_role.
create or replace function oc_enseignants_lock_actif()
returns trigger
language plpgsql
as $$
begin
  if new.actif is distinct from old.actif and auth.role() = 'authenticated' then
    new.actif := old.actif;
  end if;
  return new;
end;
$$;

drop trigger if exists oc_enseignants_lock_actif_trg on oc_enseignants;
create trigger oc_enseignants_lock_actif_trg
  before update on oc_enseignants
  for each row execute function oc_enseignants_lock_actif();

-- ----------------------------------------------------------------------------
-- oc_weeks — calendrier de référence, seedé une fois par Martin (SQL Editor).
-- Volontairement AUCUNE policy insert/update/delete pour "authenticated" :
-- ce n'est pas un contenu produit par les enseignants au fil de l'eau.
-- ----------------------------------------------------------------------------
alter table oc_weeks enable row level security;

create policy oc_weeks_select on oc_weeks
  for select
  to authenticated
  using (oc_is_active_teacher());

-- ----------------------------------------------------------------------------
-- oc_constraints — vacances / stages / examens / EIL
-- Pas de jointure dédiée (donnée de calendrier partagée, pas "co-enseignée") :
-- édition réservée au créateur.
-- ----------------------------------------------------------------------------
alter table oc_constraints enable row level security;

create policy oc_constraints_select on oc_constraints
  for select
  to authenticated
  using (oc_is_active_teacher());

create policy oc_constraints_insert on oc_constraints
  for insert
  to authenticated
  with check (oc_is_active_teacher() and cree_par = auth.uid());

create policy oc_constraints_update on oc_constraints
  for update
  to authenticated
  using (oc_is_active_teacher() and cree_par = auth.uid())
  with check (oc_is_active_teacher() and cree_par = auth.uid());

create policy oc_constraints_delete on oc_constraints
  for delete
  to authenticated
  using (oc_is_active_teacher() and cree_par = auth.uid());

-- ----------------------------------------------------------------------------
-- oc_ues
-- ----------------------------------------------------------------------------
alter table oc_ues enable row level security;

create policy oc_ues_select on oc_ues
  for select
  to authenticated
  using (oc_is_active_teacher());

create policy oc_ues_insert on oc_ues
  for insert
  to authenticated
  with check (oc_is_active_teacher() and cree_par = auth.uid());

create policy oc_ues_update on oc_ues
  for update
  to authenticated
  using (
    oc_is_active_teacher()
    and (
      cree_par = auth.uid()
      or exists (select 1 from oc_ue_enseignants m where m.ue_id = id and m.enseignant_id = auth.uid())
    )
  )
  with check (
    oc_is_active_teacher()
    and (
      cree_par = auth.uid()
      or exists (select 1 from oc_ue_enseignants m where m.ue_id = id and m.enseignant_id = auth.uid())
    )
  );

create policy oc_ues_delete on oc_ues
  for delete
  to authenticated
  using (
    oc_is_active_teacher()
    and (
      cree_par = auth.uid()
      or exists (select 1 from oc_ue_enseignants m where m.ue_id = id and m.enseignant_id = auth.uid())
    )
  );

-- ----------------------------------------------------------------------------
-- oc_sequences
-- ----------------------------------------------------------------------------
alter table oc_sequences enable row level security;

create policy oc_sequences_select on oc_sequences
  for select
  to authenticated
  using (oc_is_active_teacher());

create policy oc_sequences_insert on oc_sequences
  for insert
  to authenticated
  with check (oc_is_active_teacher() and cree_par = auth.uid());

create policy oc_sequences_update on oc_sequences
  for update
  to authenticated
  using (
    oc_is_active_teacher()
    and (
      cree_par = auth.uid()
      or exists (select 1 from oc_sequence_enseignants m where m.sequence_id = id and m.enseignant_id = auth.uid())
    )
  )
  with check (
    oc_is_active_teacher()
    and (
      cree_par = auth.uid()
      or exists (select 1 from oc_sequence_enseignants m where m.sequence_id = id and m.enseignant_id = auth.uid())
    )
  );

create policy oc_sequences_delete on oc_sequences
  for delete
  to authenticated
  using (
    oc_is_active_teacher()
    and (
      cree_par = auth.uid()
      or exists (select 1 from oc_sequence_enseignants m where m.sequence_id = id and m.enseignant_id = auth.uid())
    )
  );

-- ----------------------------------------------------------------------------
-- oc_sessions
-- ----------------------------------------------------------------------------
alter table oc_sessions enable row level security;

create policy oc_sessions_select on oc_sessions
  for select
  to authenticated
  using (oc_is_active_teacher());

create policy oc_sessions_insert on oc_sessions
  for insert
  to authenticated
  with check (oc_is_active_teacher() and cree_par = auth.uid());

create policy oc_sessions_update on oc_sessions
  for update
  to authenticated
  using (
    oc_is_active_teacher()
    and (
      cree_par = auth.uid()
      or exists (select 1 from oc_session_enseignants m where m.session_id = id and m.enseignant_id = auth.uid())
    )
  )
  with check (
    oc_is_active_teacher()
    and (
      cree_par = auth.uid()
      or exists (select 1 from oc_session_enseignants m where m.session_id = id and m.enseignant_id = auth.uid())
    )
  );

create policy oc_sessions_delete on oc_sessions
  for delete
  to authenticated
  using (
    oc_is_active_teacher()
    and (
      cree_par = auth.uid()
      or exists (select 1 from oc_session_enseignants m where m.session_id = id and m.enseignant_id = auth.uid())
    )
  );

-- ----------------------------------------------------------------------------
-- Jointures de partage — même grammaire pour les 3 tables :
--   SELECT : ouvert aux enseignants actifs.
--   INSERT/DELETE : autorisé si l'appelant est le créateur de la ressource
--   mère, OU s'il est déjà membre de la jointure pour cette ressource — ce qui
--   résout l'amorçage (le créateur pose la 1re jointure) tout en permettant
--   à un co-enseignant déjà ajouté d'inviter à son tour un autre collègue,
--   ou de se retirer / retirer un collègue.
-- ----------------------------------------------------------------------------
alter table oc_ue_enseignants enable row level security;

create policy oc_ue_enseignants_select on oc_ue_enseignants
  for select
  to authenticated
  using (oc_is_active_teacher());

create policy oc_ue_enseignants_insert on oc_ue_enseignants
  for insert
  to authenticated
  with check (
    oc_is_active_teacher()
    and (
      exists (select 1 from oc_ues u where u.id = ue_id and u.cree_par = auth.uid())
      or exists (select 1 from oc_ue_enseignants m where m.ue_id = oc_ue_enseignants.ue_id and m.enseignant_id = auth.uid())
    )
  );

create policy oc_ue_enseignants_delete on oc_ue_enseignants
  for delete
  to authenticated
  using (
    oc_is_active_teacher()
    and (
      exists (select 1 from oc_ues u where u.id = ue_id and u.cree_par = auth.uid())
      or exists (select 1 from oc_ue_enseignants m where m.ue_id = oc_ue_enseignants.ue_id and m.enseignant_id = auth.uid())
    )
  );

alter table oc_sequence_enseignants enable row level security;

create policy oc_sequence_enseignants_select on oc_sequence_enseignants
  for select
  to authenticated
  using (oc_is_active_teacher());

create policy oc_sequence_enseignants_insert on oc_sequence_enseignants
  for insert
  to authenticated
  with check (
    oc_is_active_teacher()
    and (
      exists (select 1 from oc_sequences s where s.id = sequence_id and s.cree_par = auth.uid())
      or exists (select 1 from oc_sequence_enseignants m where m.sequence_id = oc_sequence_enseignants.sequence_id and m.enseignant_id = auth.uid())
    )
  );

create policy oc_sequence_enseignants_delete on oc_sequence_enseignants
  for delete
  to authenticated
  using (
    oc_is_active_teacher()
    and (
      exists (select 1 from oc_sequences s where s.id = sequence_id and s.cree_par = auth.uid())
      or exists (select 1 from oc_sequence_enseignants m where m.sequence_id = oc_sequence_enseignants.sequence_id and m.enseignant_id = auth.uid())
    )
  );

alter table oc_session_enseignants enable row level security;

create policy oc_session_enseignants_select on oc_session_enseignants
  for select
  to authenticated
  using (oc_is_active_teacher());

create policy oc_session_enseignants_insert on oc_session_enseignants
  for insert
  to authenticated
  with check (
    oc_is_active_teacher()
    and (
      exists (select 1 from oc_sessions s where s.id = session_id and s.cree_par = auth.uid())
      or exists (select 1 from oc_session_enseignants m where m.session_id = oc_session_enseignants.session_id and m.enseignant_id = auth.uid())
    )
  );

create policy oc_session_enseignants_delete on oc_session_enseignants
  for delete
  to authenticated
  using (
    oc_is_active_teacher()
    and (
      exists (select 1 from oc_sessions s where s.id = session_id and s.cree_par = auth.uid())
      or exists (select 1 from oc_session_enseignants m where m.session_id = oc_session_enseignants.session_id and m.enseignant_id = auth.uid())
    )
  );
