-- ============================================================================
-- organisation-cours — corrige un blocage RLS silencieux sur TOUTES les
-- écritures (UE, séquences, séances, contraintes, réunions), spécifique aux
-- écritures faites via l'API REST (json_to_recordset), diagnostiqué le
-- 21/08/2026
-- ============================================================================
-- Symptôme : "new row violates row-level security policy" sur oc_reunions
-- (puis constaté aussi sur oc_sessions) à CHAQUE tentative d'ajout, alors que
-- le compte est bien actif, le jeton valide, et `cree_par` correctement
-- envoyé — vérifié pas à pas (session, jeton décodé, policies en base,
-- simulation SQL directe de l'identité : tout concordait).
--
-- Cause réelle, isolée par élimination : `oc_is_active_teacher()` (et
-- `oc_reunion_est_participant()`, `oc_email_autorise()`) étaient écrites en
-- `language sql` — une fonction SQL "simple". Ce type de fonction peut être
-- "aplatie" (inlinée) par l'optimiseur Postgres : son corps est substitué
-- directement dans la requête appelante au lieu d'être exécuté comme un
-- véritable appel de fonction. Ce comportement, normalement inoffensif,
-- interagit mal avec les policies RLS quand la source de l'INSERT est une
-- fonction à ensemble de résultats (SRF) — exactement la construction que
-- PostgREST utilise TOUJOURS pour un insert via l'API REST (`insert into ...
-- select ... from json_to_recordset($1) ...`). Résultat : la policy refuse
-- systématiquement l'écriture via l'API, alors qu'un INSERT SQL direct
-- (VALUES, ou SELECT sans fonction), ou un appel RPC, réussit très bien avec
-- la même identité — un écart reproduit et confirmé en isolant chaque
-- hypothèse (session, jeton, policies, identité simulée, puis forme exacte
-- de la requête) avant d'arriver à celle-ci.
--
-- Correctif : réécrire ces fonctions en `language plpgsql`. Une fonction
-- PL/pgSQL n'est jamais inlinée par le planificateur (elle reste un vrai
-- appel de fonction en toutes circonstances) — logique strictement
-- identique, seul le langage change. Confirmé par test isolé (table
-- temporaire + policy minimale) avant application ici.
-- ============================================================================

create or replace function oc_is_active_teacher()
returns boolean
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  return exists (
    select 1 from oc_enseignants
    where user_id = auth.uid() and actif
  );
end;
$$;

create or replace function oc_reunion_est_participant(p_reunion_id text)
returns boolean
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  return exists (
    select 1 from oc_reunions r
    where r.id = p_reunion_id
      and (
        r.cree_par = auth.uid()
        or exists (select 1 from oc_reunion_enseignants m where m.reunion_id = r.id and m.enseignant_id = auth.uid())
      )
  );
end;
$$;

create or replace function oc_email_autorise(p_email text)
returns boolean
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  return exists (
    select 1 from oc_emails_autorises where lower(email) = lower(p_email)
  );
end;
$$;
