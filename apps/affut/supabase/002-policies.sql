-- ============================================================================
-- affut — RLS + vues publiques (Lot 6 + Lot 7 combinés)
-- ============================================================================
-- Décision actée (30/08/2026) : pas d'écriture publique exposée même
-- temporairement, donc Lot 6 (tables) et Lot 7 (accès rédaction) posés
-- ensemble avant toute bascule du front — voir apps/affut/AVANCEMENT.md.
--
-- IMPORTANT — leçon apprise sur organisation-cours (voir
-- apps/organisation-cours/supabase/014-fix-inlining-security-definer.sql) :
-- les fonctions RLS ci-dessous sont TOUTES en `language plpgsql`, jamais
-- `language sql`. Une fonction SQL "simple" peut être inlinée par
-- l'optimiseur Postgres, ce qui casse silencieusement les policies RLS sur
-- les écritures faites via l'API REST (json_to_recordset). plpgsql n'est
-- jamais inliné : coût nul, bug évité d'avance plutôt que découvert en
-- production comme ce fut le cas là-bas.
-- ============================================================================

-- ---- fonctions security definer (contournent la RLS pour LEUR PROPRE
--      lecture interne, sans jamais exposer directement les tables
--      qu'elles consultent) -----------------------------------------------

create or replace function affut_is_active_redacteur()
returns boolean
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  return exists (
    select 1 from affut_redacteurs
    where user_id = auth.uid() and actif
  );
end;
$$;

create or replace function affut_email_autorise(p_email text)
returns boolean
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  return exists (
    select 1 from affut_emails_autorises where lower(email) = lower(p_email)
  );
end;
$$;

grant execute on function affut_is_active_redacteur() to authenticated;
grant execute on function affut_email_autorise(text) to authenticated;

-- ---- affut_numeros / affut_entrees / affut_sources_suivies ----------------
-- Base RLS : rédaction (authenticated + actif) a tout, anon n'a RIEN sur les
-- tables de base — seules les vues publiques ci-dessous, plus bas, exposent
-- un sous-ensemble de colonnes/lignes à anon.

alter table affut_numeros enable row level security;
alter table affut_entrees enable row level security;
alter table affut_sources_suivies enable row level security;

create policy affut_numeros_redaction on affut_numeros
  for all
  to authenticated
  using (affut_is_active_redacteur())
  with check (affut_is_active_redacteur());

create policy affut_entrees_redaction on affut_entrees
  for all
  to authenticated
  using (affut_is_active_redacteur())
  with check (affut_is_active_redacteur());

create policy affut_sources_suivies_redaction on affut_sources_suivies
  for all
  to authenticated
  using (affut_is_active_redacteur())
  with check (affut_is_active_redacteur());

-- ---- affut_ingestion_log --------------------------------------------------
-- Lecture rédaction seule (futur écran de suivi, Lot 8) ; écriture réservée
-- au Worker d'ingestion via la clé service_role (qui contourne la RLS de
-- toute façon) — aucune policy d'écriture ici, volontairement.

alter table affut_ingestion_log enable row level security;

create policy affut_ingestion_log_lecture on affut_ingestion_log
  for select
  to authenticated
  using (affut_is_active_redacteur());

-- ---- affut_redacteurs ------------------------------------------------------
-- Auto-inscription verrouillée par liste blanche (même principe que
-- oc_enseignants + oc_emails_autorises) : un compte Supabase Auth peut créer
-- SA PROPRE ligne, toujours actif=false, et seulement si son e-mail figure
-- dans affut_emails_autorises. Rendre le compte actif = flip manuel en SQL
-- Editor (update affut_redacteurs set actif = true where user_id = '...').
-- Chacun ne voit que sa propre ligne (pas de trombinoscope dans affut).

alter table affut_redacteurs enable row level security;

create policy affut_redacteurs_select_self on affut_redacteurs
  for select
  to authenticated
  using (user_id = auth.uid());

create policy affut_redacteurs_insert_self on affut_redacteurs
  for insert
  to authenticated
  with check (
    user_id = auth.uid()
    and actif = false
    and affut_email_autorise(auth.email())
  );

-- affut_emails_autorises : RLS activée, AUCUNE policy — illisible/
-- inscriptible via l'API pour tout le monde, y compris authenticated. Se
-- gère exclusivement en SQL Editor (rôle postgres, hors RLS) :
--   insert into affut_emails_autorises (email) values ('collegue@exemple.fr');

-- ---- vues publiques : seul point d'accès pour anon ------------------------
-- Postgres : une vue s'exécute par défaut avec les droits de son PROPRIÉTAIRE
-- (celui qui l'a créée ici, en SQL Editor — donc hors RLS), pas ceux de
-- l'appelant. C'est ce mécanisme, standard sur Supabase, qui permet à `anon`
-- de lire un sous-ensemble d'une table par ailleurs totalement verrouillée
-- pour lui. Ne PAS ajouter `security_invoker = true` ici : ça annulerait
-- exactement ce comportement et anon se retrouverait sans aucun accès.

create or replace view affut_numeros_public
with (security_invoker = false)
as
select numero, statut, mois, semaine, titre, chapo, vues
from affut_numeros
where statut = 'publie';

create or replace view affut_entrees_public
with (security_invoker = false)
as
select
  id, numero_id, rubrique, origine, source, url,
  lien_mort, lien_mort_depuis, titre,
  -- masquage serveur des blocs repliés (lot 4bis) : sans ça, quelqu'un
  -- inspectant directement la réponse réseau verrait un contenu que
  -- l'interface ne montre jamais — usage_en_cours reste, lui, totalement
  -- absent de cette vue, à aucune condition.
  case when (blocs->>'chiffres')::boolean then chiffres else '[]'::jsonb end as chiffres,
  case when (blocs->>'resume')::boolean then resume else null end as resume,
  blocs,
  clics_source
from affut_entrees
where valide = true;

grant usage on schema public to anon;
grant select on affut_numeros_public to anon;
grant select on affut_entrees_public to anon;
