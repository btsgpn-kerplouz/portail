-- ============================================================================
-- organisation-cours — corrige une récursion infinie dans oc_is_active_teacher()
-- ============================================================================
-- Bug introduit par 004-durcissement-enseignants.sql (pas par policies.sql lui-
-- même) : oc_is_active_teacher() interroge oc_enseignants ; or depuis 004, la
-- policy SELECT de oc_enseignants appelle elle-même oc_is_active_teacher().
-- Résultat : la fonction se rappelle indéfiniment (chaque appel réévalue la
-- policy, qui rappelle la fonction...) → "stack depth limit exceeded".
--
-- Avant 004, oc_enseignants_select était `using (true)` (aucun appel à la
-- fonction) : la requête interne de oc_is_active_teacher() se terminait tout
-- de suite, pas de récursion possible. D'où un bug resté invisible jusqu'à
-- l'étape 2.
--
-- Correctif standard Postgres/Supabase pour ce cas ("helper function qui lit
-- la table qu'elle protège") : SECURITY DEFINER. La requête interne de la
-- fonction s'exécute alors avec les droits de son PROPRIÉTAIRE (le rôle
-- `postgres` du SQL Editor, propriétaire de la table, donc PAS soumis à la
-- RLS — sauf si `FORCE ROW LEVEL SECURITY` avait été ajouté, ce qui n'est pas
-- le cas ici) au lieu des droits de l'utilisateur connecté. La policy externe
-- (sur la table appelante) continue, elle, à s'appliquer normalement.
-- `set search_path` est la précaution usuelle qui accompagne tout
-- SECURITY DEFINER (empêche un search_path détourné de faire résoudre
-- `oc_enseignants` vers une autre table).
-- ============================================================================

create or replace function oc_is_active_teacher()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from oc_enseignants
    where user_id = auth.uid() and actif
  );
$$;
