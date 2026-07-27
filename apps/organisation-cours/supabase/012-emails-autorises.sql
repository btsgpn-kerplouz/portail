-- ============================================================================
-- organisation-cours — liste blanche d'e-mails autorisés (mise en ligne V5.0)
-- ============================================================================
-- Remplace l'idée d'un mot de passe partagé devant l'app (étudiée puis
-- écartée) : on protège directement la CRÉATION d'un compte, pas un écran
-- devant l'app. Chaque enseignant garde son propre mot de passe (js/auth.js,
-- inchangé) ; seule une adresse e-mail présente dans oc_emails_autorises
-- peut obtenir un profil oc_enseignants (donc utiliser l'app) — cf.
-- policies.sql, policy oc_enseignants_insert_self resserrée ci-dessous.
--
-- Volontairement PAS un déclencheur sur auth.users (schéma géré par Supabase,
-- commun à tout le projet "portail" — de futures apps Habitats pourraient
-- vouloir s'y inscrire librement) : le verrou reste local à NOTRE table
-- oc_enseignants, via sa policy RLS d'insertion. Une adresse hors liste peut
-- donc encore, techniquement, créer un compte Supabase "brut" (auth.users),
-- mais n'obtiendra jamais de ligne oc_enseignants -> aucun accès à l'app,
-- jamais.
-- ============================================================================

create table if not exists oc_emails_autorises (
  email text primary key
);

comment on table oc_emails_autorises is
  'Liste blanche des e-mails autorisés à créer un profil oc_enseignants. '
  'RLS activée sans policy : illisible/inscriptible via l''API pour tout le '
  'monde (y compris authenticated), gérée uniquement via SQL Editor.';

alter table oc_emails_autorises enable row level security;
-- Volontairement AUCUNE policy créée ici : seule la fonction ci-dessous
-- (security definer, donc hors RLS) peut la consulter. Ajouter/retirer une
-- adresse se fait exclusivement en SQL Editor (rôle postgres, hors RLS) —
-- voir supabase/README.md, section « Liste blanche d'e-mails autorisés ».

create or replace function oc_email_autorise(p_email text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from oc_emails_autorises where lower(email) = lower(p_email)
  );
$$;

grant execute on function oc_email_autorise(text) to anon, authenticated;

-- Resserre l'auto-inscription : en plus des conditions déjà en place (sa
-- propre ligne, jamais actif=true d'entrée — voir policies.sql), l'adresse
-- e-mail du compte connecté doit être dans la liste blanche. auth.email()
-- est un helper Supabase standard (même famille que auth.uid()/auth.role(),
-- déjà utilisés ailleurs dans ce fichier).
drop policy if exists oc_enseignants_insert_self on oc_enseignants;
create policy oc_enseignants_insert_self on oc_enseignants
  for insert
  to authenticated
  with check (user_id = auth.uid() and actif = false and oc_email_autorise(auth.email()));
