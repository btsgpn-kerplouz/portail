-- ============================================================================
-- organisation-cours — corrige une récursion infinie sur oc_reunions
-- ============================================================================
-- Même famille de bug que 005-fix-recursion-is-active-teacher.sql, sur une
-- paire de tables cette fois plutôt qu'une fonction auto-référente :
--   - oc_reunions_select interroge oc_reunion_enseignants (participant tagué ?)
--   - oc_reunion_enseignants_select interroge oc_reunions (réunion visible ?)
-- Chaque lecture de l'une déclenche l'évaluation de la policy de l'autre, qui
-- rappelle la première... → "infinite recursion detected in policy for
-- relation oc_reunions".
--
-- Correctif standard (identique à 005) : une fonction SECURITY DEFINER dont
-- les requêtes internes s'exécutent avec les droits du propriétaire (donc
-- SANS repasser par la RLS des deux tables), pour casser le cycle. Les
-- policies externes, elles, continuent de s'appliquer normalement à chaque
-- ligne de la table qu'elles protègent.
-- ============================================================================

create or replace function oc_reunion_est_participant(p_reunion_id text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from oc_reunions r
    where r.id = p_reunion_id
      and (
        r.cree_par = auth.uid()
        or exists (select 1 from oc_reunion_enseignants m where m.reunion_id = r.id and m.enseignant_id = auth.uid())
      )
  );
$$;

-- ----------------------------------------------------------------------------
-- oc_reunions
-- ----------------------------------------------------------------------------
drop policy if exists oc_reunions_select on oc_reunions;
create policy oc_reunions_select on oc_reunions
  for select
  to authenticated
  using (oc_is_active_teacher() and oc_reunion_est_participant(id));

drop policy if exists oc_reunions_update on oc_reunions;
create policy oc_reunions_update on oc_reunions
  for update
  to authenticated
  using (oc_is_active_teacher() and oc_reunion_est_participant(id))
  with check (oc_is_active_teacher() and oc_reunion_est_participant(id));

drop policy if exists oc_reunions_delete on oc_reunions;
create policy oc_reunions_delete on oc_reunions
  for delete
  to authenticated
  using (oc_is_active_teacher() and oc_reunion_est_participant(id));

-- oc_reunions_insert (cree_par = auth.uid() sur la ligne insérée elle-même,
-- aucune sous-requête vers l'autre table) n'est pas concernée : inchangée.

-- ----------------------------------------------------------------------------
-- oc_reunion_enseignants
-- ----------------------------------------------------------------------------
drop policy if exists oc_reunion_enseignants_select on oc_reunion_enseignants;
create policy oc_reunion_enseignants_select on oc_reunion_enseignants
  for select
  to authenticated
  using (oc_is_active_teacher() and oc_reunion_est_participant(reunion_id));

drop policy if exists oc_reunion_enseignants_insert on oc_reunion_enseignants;
create policy oc_reunion_enseignants_insert on oc_reunion_enseignants
  for insert
  to authenticated
  with check (oc_is_active_teacher() and oc_reunion_est_participant(reunion_id));

drop policy if exists oc_reunion_enseignants_delete on oc_reunion_enseignants;
create policy oc_reunion_enseignants_delete on oc_reunion_enseignants
  for delete
  to authenticated
  using (oc_is_active_teacher() and oc_reunion_est_participant(reunion_id));
