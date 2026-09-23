-- ============================================================================
-- PhytoScope — GÉNÉRATEUR du script de copie ancien projet → projet partagé
-- ============================================================================
-- À lancer dans le SQL Editor de l'ANCIEN projet PhytoScope (lecture seule :
-- cette requête n'écrit rien). Elle renvoie UNE cellule `script_a_coller` :
-- un script SQL complet, à coller ensuite dans le SQL Editor du projet
-- PARTAGÉ (après 002-tables-projet-partage.sql).
--
-- Le script généré copie, dans une seule transaction (tout ou rien) :
--   1. les comptes PhytoScope — et eux seuls : e-mail factice
--      `@phytoscope.local` (auth.users + auth.identities) — en gardant leur uuid et
--      leur mot de passe haché → les élèves se reconnectent avec le même
--      identifiant, et `proprietaire_id` reste valable tel quel ;
--   2. les relevés (releves → phyto_releves) et lots (lots → phyto_lots).
-- Un compte à adresse réelle (ex. compte de test enseignant créé avant le
-- mode « identifiant ») n'est PAS copié : PhytoScope ne s'en sert pas, et
-- son adresse existe souvent déjà dans le projet partagé (affut /
-- organisation-cours) → conflit d'unicité qui annulerait toute la copie.
-- Les relevés/lots sont filtrés de même ; le script généré affiche combien
-- de lignes sont ainsi écartées (attendu : 0).
--
-- ⚠️ Le script GÉNÉRÉ contient les identifiants des élèves (nom-prénom) :
-- il ne transite que par le presse-papiers, JAMAIS dans le dépôt (public)
-- ni dans une conversation.
-- ============================================================================

with
comptes as (
  select * from auth.users where email like '%@phytoscope.local'
),
cols as (
  select
    'instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, '
    || 'confirmation_token, recovery_token, email_change_token_new, email_change, '
    || 'email_change_token_current, phone_change, phone_change_token, '
    || 'reauthentication_token, last_sign_in_at, raw_app_meta_data, '
    || 'raw_user_meta_data, created_at, updated_at, is_sso_user, is_anonymous' as cu,
    'id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at' as ci,
    'id, proprietaire_id, nom, donnees, updated_at' as cd
),
script as (
  select
    '-- Copie PhytoScope : ancien projet -> projet partagé (généré le ' || now()::text || ')' || E'\n'
    || 'begin;' || E'\n\n'
    || 'insert into auth.users (' || cu || ')' || E'\n'
    || '  select ' || cu || ' from jsonb_populate_recordset(null::auth.users, $phyto$'
    || coalesce((select jsonb_agg(to_jsonb(u)) from comptes u), '[]'::jsonb)::text
    || '$phyto$::jsonb);' || E'\n\n'
    || 'insert into auth.identities (' || ci || ')' || E'\n'
    || '  select ' || ci || ' from jsonb_populate_recordset(null::auth.identities, $phyto$'
    || coalesce((select jsonb_agg(to_jsonb(i)) from auth.identities i where i.user_id in (select id from comptes)), '[]'::jsonb)::text
    || '$phyto$::jsonb);' || E'\n\n'
    || 'insert into public.phyto_releves (' || cd || ')' || E'\n'
    || '  select ' || cd || ' from jsonb_populate_recordset(null::public.phyto_releves, $phyto$'
    || coalesce((select jsonb_agg(to_jsonb(r)) from public.releves r where r.proprietaire_id in (select id from comptes)), '[]'::jsonb)::text
    || '$phyto$::jsonb);' || E'\n\n'
    || 'insert into public.phyto_lots (' || cd || ')' || E'\n'
    || '  select ' || cd || ' from jsonb_populate_recordset(null::public.phyto_lots, $phyto$'
    || coalesce((select jsonb_agg(to_jsonb(l)) from public.lots l where l.proprietaire_id in (select id from comptes)), '[]'::jsonb)::text
    || '$phyto$::jsonb);' || E'\n\n'
    || 'commit;' || E'\n\n'
    || '-- Vérification : chaque colonne "copies" doit égaler sa colonne "attendus".' || E'\n'
    || 'select'
    || ' ' || (select count(*) from comptes) || ' as comptes_attendus,'
    || ' (select count(*) from auth.users where id = any(array['
    ||   coalesce((select string_agg(quote_literal(id::text) || '::uuid', ',') from comptes), '')
    ||   ']::uuid[])) as comptes_copies,'
    || ' ' || (select count(*) from public.releves where proprietaire_id in (select id from comptes)) || ' as releves_attendus,'
    || ' (select count(*) from public.phyto_releves) as releves_copies,'
    || ' ' || (select count(*) from public.lots where proprietaire_id in (select id from comptes)) || ' as lots_attendus,'
    || ' (select count(*) from public.phyto_lots) as lots_copies,'
    || ' ' || ((select count(*) from public.releves) + (select count(*) from public.lots)
               - (select count(*) from public.releves where proprietaire_id in (select id from comptes))
               - (select count(*) from public.lots where proprietaire_id in (select id from comptes)))
    || ' as lignes_ecartees_hors_comptes_phytoscope;' || E'\n' as s
  from cols
)
select length(s) as taille_caracteres, s as script_a_coller from script;
