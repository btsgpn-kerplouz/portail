-- Mémoire de la veille, étape 3 : règles éditoriales durables
-- ---------------------------------------------------------------------------
-- Une courte liste de règles écrites, relue par la routine de veille à CHAQUE
-- passage et jamais tronquée (contrairement aux 15 dernières décisions).
-- Exemple : « Les sorties et conférences ne m'intéressent pas, sauf les
-- colloques scientifiques. » Deux façons de l'alimenter :
--   1. l'enseignant écrit une règle dans l'espace « Mémoire de la veille » de l'onglet Sources de l'app ;
--   2. la routine PROPOSE une règle (une fois par mois, à partir des motifs
--      d'écart) — elle atterrit dans `affut_propositions_regles`, et n'entre
--      dans les règles en vigueur que si l'enseignant l'accepte. La routine
--      n'écrit jamais dans `affut_regles_editoriales` (elle n'a d'ailleurs que
--      la fonction Edge, jamais d'accès direct à la base).
--
-- Une règle porte sur des TYPES de contenu, jamais sur une source précise
-- (principe posé par l'utilisateur, voir documents/brief-veille.md).
--
-- Même protection que affut_candidats_ecartes : rédacteur actif = tout, anon =
-- rien, aucune vue publique (ce n'est pas une donnée destinée aux élèves).
-- À appliquer AVANT de déployer le front de cette étape. Idempotent.

create table if not exists affut_regles_editoriales (
  id bigint generated always as identity primary key,
  texte text not null check (char_length(texte) between 5 and 400),
  actif boolean not null default true,
  origine text not null default 'enseignant' check (origine in ('enseignant', 'proposition_agent')),
  cree_le timestamptz not null default now(),
  modifie_le timestamptz not null default now()
);

create table if not exists affut_propositions_regles (
  id bigint generated always as identity primary key,
  texte text not null check (char_length(texte) between 5 and 400),
  -- Pourquoi la routine propose cette règle (chiffres à l'appui) : montré à
  -- l'enseignant pour qu'il décide en connaissance de cause.
  justification text not null default '' check (char_length(justification) <= 800),
  statut text not null default 'en_attente' check (statut in ('en_attente', 'acceptee', 'refusee')),
  cree_le timestamptz not null default now(),
  decidee_le timestamptz
);

comment on table affut_regles_editoriales is
  'Règles éditoriales durables lues par la routine de veille à chaque passage (étape 3 de la mémoire de la veille). Jamais publiques.';
comment on table affut_propositions_regles is
  'Règles proposées par la routine, en attente de décision de l''enseignant (acceptée = copiée dans affut_regles_editoriales par l''app).';

create index if not exists affut_propositions_regles_statut_idx on affut_propositions_regles(statut);

alter table affut_regles_editoriales enable row level security;
alter table affut_propositions_regles enable row level security;

drop policy if exists affut_regles_editoriales_redaction on affut_regles_editoriales;
create policy affut_regles_editoriales_redaction on affut_regles_editoriales
  for all
  to authenticated
  using (affut_is_active_redacteur())
  with check (affut_is_active_redacteur());

drop policy if exists affut_propositions_regles_redaction on affut_propositions_regles;
create policy affut_propositions_regles_redaction on affut_propositions_regles
  for all
  to authenticated
  using (affut_is_active_redacteur())
  with check (affut_is_active_redacteur());
