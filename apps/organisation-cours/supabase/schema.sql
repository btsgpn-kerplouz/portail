-- ============================================================================
-- organisation-cours — schéma relationnel (étape 1 du plan multi-utilisateurs)
-- ============================================================================
-- Périmètre : le cœur pédagogique uniquement (enseignants, calendrier, UE,
-- séquences, séances, jointures de partage). Volontairement REPORTÉS à une
-- étape ultérieure : frais kilométriques, réunions, trames d'emploi du temps
-- type, notes libres — modules les plus nominatifs, cf. AUDIT-RGPD.md.
--
-- Aucune donnée réelle dans ce fichier. À exécuter dans le SQL Editor du
-- projet Supabase "portail" (voir README.md de ce dossier pour l'ordre
-- d'application : ce fichier, puis policies.sql).
--
-- Tables préfixées "oc_" pour cohabiter avec d'autres apps dans le même
-- projet Supabase (quota gratuit = 2 projets actifs par organisation).
--
-- Principe hybride : colonnes relationnelles pour tout ce qui sert au
-- partage / aux liens / aux filtres ; une colonne `contenu jsonb` pour le
-- texte pédagogique libre (objectifs, ressources, notes...), évolutif sans
-- nouvelle migration — à l'image du blob JSON de PhytoScope, mais sans
-- sacrifier le relationnel là où la co-édition partagée l'exige.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- oc_enseignants — un profil par compte enseignant (self-service, cf. policies.sql)
-- ----------------------------------------------------------------------------
create table if not exists oc_enseignants (
  user_id     uuid primary key references auth.users (id) on delete cascade,
  identifiant text not null unique,        -- ex. "diraisonm" (nom + 1re lettre prénom)
  nom         text not null,
  prenom      text not null,
  initiales   text not null,               -- pastilles d'affichage (ex. "MD")
  actif       boolean not null default false, -- garde-fou self-service : Martin active le compte
  created_at  timestamptz not null default now()
);

comment on table oc_enseignants is
  'Profil enseignant lié à auth.users. actif=false par défaut : un compte fraîchement '
  'créé en self-service ne voit aucune donnée pédagogique tant qu''il n''a pas été activé.';

-- ----------------------------------------------------------------------------
-- oc_weeks — calendrier de référence (semaines ISO de l'année scolaire)
-- ----------------------------------------------------------------------------
create table if not exists oc_weeks (
  id          text primary key,   -- ex. "2026-S36"
  label       text not null,
  week_number int not null,
  iso_year    int not null,
  date_range  text not null
);

-- ----------------------------------------------------------------------------
-- oc_constraints — vacances / stages / examens / EIL
-- ----------------------------------------------------------------------------
create table if not exists oc_constraints (
  id          text primary key,
  label       text not null,
  type        text not null,
  date_debut  date not null,
  date_fin    date not null,
  promotions  text[] not null default '{}',
  notes       text,
  cree_par    uuid references oc_enseignants (user_id) on delete set null,
  updated_at  timestamptz not null default now()
);

create index if not exists oc_constraints_promotions_idx on oc_constraints using gin (promotions);

-- ----------------------------------------------------------------------------
-- oc_ues — Unités d'Enseignement
-- ----------------------------------------------------------------------------
create table if not exists oc_ues (
  id             text primary key,
  code           text not null,             -- ex. "UE 1.1"
  title          text not null,
  promotion      text not null,             -- "GPN1" / "GPN2"
  semester       text not null,
  period         text,
  capacities     jsonb not null default '[]', -- [{code,title}, ...]
  hours_target   text,
  start_week_id  text references oc_weeks (id) on delete set null,
  end_week_id    text references oc_weeks (id) on delete set null,
  annual         boolean not null default false,
  contenu        jsonb not null default '{}', -- description, correction...
  cree_par       uuid references oc_enseignants (user_id) on delete set null,
  updated_at     timestamptz not null default now()
);

create index if not exists oc_ues_promotion_idx on oc_ues (promotion);

-- ----------------------------------------------------------------------------
-- oc_sequences — séquences pédagogiques
-- ----------------------------------------------------------------------------
create table if not exists oc_sequences (
  id              text primary key,
  ue_id           text references oc_ues (id) on delete cascade,
  title           text not null,
  promotion       text not null,
  semester        text,
  status          text,
  color           text,
  sequence_type   text,
  capacity_codes  text[] not null default '{}',
  contenu         jsonb not null default '{}', -- objectifs, prérequis, méthodes,
                                                -- évaluation, ressources, notes...
  cree_par        uuid references oc_enseignants (user_id) on delete set null,
  updated_at      timestamptz not null default now()
);

create index if not exists oc_sequences_ue_id_idx on oc_sequences (ue_id);
create index if not exists oc_sequences_promotion_idx on oc_sequences (promotion);
create index if not exists oc_sequences_capacity_codes_idx on oc_sequences using gin (capacity_codes);

-- ----------------------------------------------------------------------------
-- oc_sessions — séances planifiées
-- ----------------------------------------------------------------------------
create table if not exists oc_sessions (
  id                text primary key,
  title             text not null,
  ue_id             text references oc_ues (id) on delete set null,
  sequence_id       text references oc_sequences (id) on delete set null,
  constraint_id     text references oc_constraints (id) on delete set null,
  promotion         text not null,
  week_id           text references oc_weeks (id) on delete set null,
  day               int,
  start_slot        int,
  end_slot          int,
  type              text,
  color             text,
  status            text,
  placement_status  text,
  groupe            text,
  demi_groupe       text,
  room              text,
  capacity_codes    text[] not null default '{}',
  contenu           jsonb not null default '{}', -- activités, notions, matériel,
                                                  -- évaluation, devoirs, différenciation,
                                                  -- dates custom/fictives, notes...
  cree_par          uuid references oc_enseignants (user_id) on delete set null,
  updated_at        timestamptz not null default now()
);

create index if not exists oc_sessions_ue_id_idx on oc_sessions (ue_id);
create index if not exists oc_sessions_sequence_id_idx on oc_sessions (sequence_id);
create index if not exists oc_sessions_constraint_id_idx on oc_sessions (constraint_id);
create index if not exists oc_sessions_week_id_idx on oc_sessions (week_id);
create index if not exists oc_sessions_promotion_idx on oc_sessions (promotion);
create index if not exists oc_sessions_capacity_codes_idx on oc_sessions using gin (capacity_codes);

-- ----------------------------------------------------------------------------
-- Jointures de partage many-to-many (enseignants <-> ressources)
-- Remplacent le champ legacy `teacher` (chaîne libre d'initiales, parsée côté
-- client par teacherTokens/teacherPips dans l'ancien public/app.js).
-- ----------------------------------------------------------------------------
create table if not exists oc_ue_enseignants (
  ue_id         text not null references oc_ues (id) on delete cascade,
  enseignant_id uuid not null references oc_enseignants (user_id) on delete cascade,
  primary key (ue_id, enseignant_id)
);

create table if not exists oc_sequence_enseignants (
  sequence_id   text not null references oc_sequences (id) on delete cascade,
  enseignant_id uuid not null references oc_enseignants (user_id) on delete cascade,
  primary key (sequence_id, enseignant_id)
);

create table if not exists oc_session_enseignants (
  session_id    text not null references oc_sessions (id) on delete cascade,
  enseignant_id uuid not null references oc_enseignants (user_id) on delete cascade,
  primary key (session_id, enseignant_id)
);

create index if not exists oc_ue_enseignants_enseignant_idx on oc_ue_enseignants (enseignant_id);
create index if not exists oc_sequence_enseignants_enseignant_idx on oc_sequence_enseignants (enseignant_id);
create index if not exists oc_session_enseignants_enseignant_idx on oc_session_enseignants (enseignant_id);
