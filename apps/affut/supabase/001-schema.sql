-- ============================================================================
-- affut — schéma (Lot 6, bascule Supabase)
-- ============================================================================
-- Projet Supabase ciblé : `portail` (org btsgpn-kerplouz), déjà utilisé par
-- organisation-cours (tables oc_*) et bientôt d'autres apps (Habitats...) —
-- l'org est au quota gratuit de 2 projets, pas de 3e projet possible sans
-- passer payant (voir apps/organisation-cours/supabase/README.md). Tables
-- préfixées affut_ pour cohabiter proprement.
--
-- Remplace le localStorage (STORAGE_KEY "affut:numeros") qui stockait tout
-- dans un seul blob JSON {numeros, sources} — voir apps/affut/index.html,
-- fonctions seedNumeros()/seedSources()/loadData()/saveData(), pour le détail
-- exact des champs repris ici.
-- ============================================================================

create table if not exists affut_numeros (
  numero integer primary key,
  statut text not null default 'brouillon' check (statut in ('brouillon', 'publie')),
  mois text not null default '',
  semaine text not null default '',
  titre text not null default '',
  chapo text not null default '',
  candidates integer not null default 0,
  -- collecte/moisson : suivi de la collecte hebdomadaire en cours (écran 4b,
  -- états limites ②③④) — nul une fois le numéro bouclé (voir seedNumeros() :
  -- seul le brouillon en cours, n°13, les porte dans le jeu de démo actuel).
  collecte jsonb,
  moisson jsonb,
  -- compteur de fréquentation (idée notée le 29/08/2026, instruite ici) :
  -- nombre de fois où la page du numéro a été ouverte en vue publiée.
  vues integer not null default 0,
  cree_le timestamptz not null default now()
);

comment on column affut_numeros.collecte is 'redaction uniquement : {date, statut} — jamais dans la vue publique affut_numeros_public';
comment on column affut_numeros.moisson is 'redaction uniquement : candidats pas encore triés — jamais dans la vue publique affut_numeros_public';

create table if not exists affut_entrees (
  id text primary key,
  numero_id integer not null references affut_numeros(numero) on delete cascade,
  rubrique text not null default '',
  valide boolean not null default false,
  origine text not null default 'manuel' check (origine in ('auto', 'manuel')),
  -- source : {nom, territoire, domaine, date} — un seul blob plutôt que 4
  -- colonnes, jamais interrogé par filtre/tri côté serveur pour l'instant.
  source jsonb not null default '{}'::jsonb,
  url text not null default '',
  lien_mort boolean not null default false,
  lien_mort_depuis text,
  titre text not null default '',
  chiffres jsonb not null default '[]'::jsonb,
  resume text not null default '',
  -- usage_en_cours (nom repris de CLAUDE.md) : notes d'usage pédagogique de
  -- l'enseignant, PRIVÉES — jamais exposées, même pour une entrée validée.
  usage_en_cours text,
  -- blocs : {chiffres, resume} — bascules d'affichage (lot 4bis) : si false,
  -- le contenu correspondant reste en base mais doit être masqué même côté
  -- vue publique (voir la vue affut_entrees_public, qui applique le masquage
  -- plutôt que de compter sur le seul comportement du front).
  blocs jsonb not null default '{"chiffres": true, "resume": true}'::jsonb,
  -- compteur de clics sur le bouton « Ouvrir la source » en vue publiée.
  clics_source integer not null default 0,
  cree_le timestamptz not null default now()
);

comment on column affut_entrees.usage_en_cours is 'jamais exposé publiquement (CLAUDE.md) — absent de affut_entrees_public';

create index if not exists affut_entrees_numero_id_idx on affut_entrees(numero_id);

-- Sources suivies (écran « Sources », lot 4) : strictement rédaction, aucun
-- usage public — pas de vue dédiée, RLS authenticated uniquement.
create table if not exists affut_sources_suivies (
  id text primary key,
  nom text not null default '',
  adresse text not null default '',
  type text not null default '',
  echelle text not null default '',
  territoire text not null default '',
  rubrique_defaut text not null default '',
  derniere_moisson jsonb not null default '{}'::jsonb,
  compteurs jsonb not null default '{}'::jsonb,
  cree_le timestamptz not null default now()
);

-- Journal d'ingestion (Lot 8, à venir) : posé dès maintenant pour ne pas
-- redemander une migration séparée le moment venu — idempotence par slug,
-- alimenté par le futur Worker via la clé service_role (donc aucune policy
-- RLS d'écriture nécessaire ici, seulement une lecture authenticated pour un
-- futur écran de suivi).
create table if not exists affut_ingestion_log (
  id bigint generated always as identity primary key,
  slug text not null unique,
  numero_id integer references affut_numeros(numero) on delete set null,
  entree_id text references affut_entrees(id) on delete set null,
  statut text not null default 'cree' check (statut in ('cree', 'actualise', 'ignore', 'erreur')),
  detail text,
  traite_le timestamptz not null default now()
);

-- Profil rédacteur (mêmes principes que oc_enseignants dans
-- organisation-cours) : une ligne par compte Supabase Auth autorisé à écrire
-- dans affut_numeros/affut_entrees/affut_sources_suivies. `actif=false` par
-- défaut à l'inscription — seul un flip manuel en SQL Editor donne l'accès
-- réel (voir policies.sql). Pas de nom/prénom/initiales ici : rien dans
-- l'app n'affiche encore « qui » a rédigé quoi (contrairement à
-- organisation-cours) — à ajouter si ce besoin apparaît.
create table if not exists affut_redacteurs (
  user_id uuid primary key references auth.users(id) on delete cascade,
  actif boolean not null default false,
  cree_le timestamptz not null default now()
);

-- Liste blanche d'e-mails autorisés à créer un profil affut_redacteurs (même
-- principe que oc_emails_autorises, organisation-cours/supabase/012) :
-- gérée exclusivement en SQL Editor, jamais via l'API (RLS activée, aucune
-- policy créée — voir policies.sql pour la fonction security definer qui la
-- consulte).
create table if not exists affut_emails_autorises (
  email text primary key
);

comment on table affut_emails_autorises is
  'Liste blanche des e-mails autorisés à créer un profil affut_redacteurs. '
  'RLS activée sans policy : illisible/inscriptible via l''API pour tout le '
  'monde (y compris authenticated), gérée uniquement via SQL Editor.';
