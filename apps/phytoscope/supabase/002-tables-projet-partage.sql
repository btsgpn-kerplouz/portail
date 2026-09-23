-- ============================================================================
-- PhytoScope — tables dans le projet Supabase PARTAGÉ (BTS GPN — portail)
-- ============================================================================
-- PhytoScope vivait jusqu'ici dans son propre projet Supabase (le tout premier,
-- créé avant qu'on regroupe toutes les apps dans un seul projet, l'offre
-- gratuite limitant le nombre de projets). Ce fichier recrée ses deux tables
-- dans le projet partagé, avec le préfixe `phyto_` comme les autres apps
-- (`affut_…`, `oc_…`) :
--   releves → phyto_releves
--   lots    → phyto_lots
--
-- Structure relevée à l'identique dans l'ancien projet (23/09/2026), y compris
-- ce que `releves` avait de propre, jamais versionné jusqu'ici (voir README) :
-- `nom` nullable, `proprietaire_id` par défaut à auth.uid(), index
-- (proprietaire_id, updated_at desc).
--
-- Seule différence : les policies sont restreintes au rôle `authenticated`
-- (elles étaient sur `public`). Sans effet réel — pour un visiteur anonyme
-- auth.uid() est nul, donc aucune ligne ne passait déjà — mais c'est la
-- convention des autres apps du projet partagé.
--
-- Comptes élèves (e-mails factices `@phytoscope.local`, auto-inscription) :
-- ils n'ouvrent rien chez affut ni organisation-cours, dont toutes les
-- policies exigent un rédacteur/enseignant actif ou un e-mail autorisé.
--
-- À lancer dans le SQL Editor du projet PARTAGÉ (relançable sans erreur).
-- ============================================================================

create table if not exists public.phyto_releves (
  id text not null,
  proprietaire_id uuid not null default auth.uid()
    references auth.users(id) on delete cascade,
  nom text,
  donnees jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  primary key (proprietaire_id, id)
);

create index if not exists phyto_releves_proprietaire_idx
  on public.phyto_releves (proprietaire_id, updated_at desc);

create table if not exists public.phyto_lots (
  id text not null,
  proprietaire_id uuid not null references auth.users(id) on delete cascade,
  nom text not null default '',
  donnees jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  primary key (proprietaire_id, id)
);

alter table public.phyto_releves enable row level security;
alter table public.phyto_lots enable row level security;

drop policy if exists phyto_releves_select_own on public.phyto_releves;
create policy phyto_releves_select_own on public.phyto_releves
  for select to authenticated
  using (proprietaire_id = auth.uid());

drop policy if exists phyto_releves_insert_own on public.phyto_releves;
create policy phyto_releves_insert_own on public.phyto_releves
  for insert to authenticated
  with check (proprietaire_id = auth.uid());

drop policy if exists phyto_releves_update_own on public.phyto_releves;
create policy phyto_releves_update_own on public.phyto_releves
  for update to authenticated
  using (proprietaire_id = auth.uid())
  with check (proprietaire_id = auth.uid());

drop policy if exists phyto_releves_delete_own on public.phyto_releves;
create policy phyto_releves_delete_own on public.phyto_releves
  for delete to authenticated
  using (proprietaire_id = auth.uid());

drop policy if exists phyto_lots_select_own on public.phyto_lots;
create policy phyto_lots_select_own on public.phyto_lots
  for select to authenticated
  using (proprietaire_id = auth.uid());

drop policy if exists phyto_lots_insert_own on public.phyto_lots;
create policy phyto_lots_insert_own on public.phyto_lots
  for insert to authenticated
  with check (proprietaire_id = auth.uid());

drop policy if exists phyto_lots_update_own on public.phyto_lots;
create policy phyto_lots_update_own on public.phyto_lots
  for update to authenticated
  using (proprietaire_id = auth.uid())
  with check (proprietaire_id = auth.uid());

drop policy if exists phyto_lots_delete_own on public.phyto_lots;
create policy phyto_lots_delete_own on public.phyto_lots
  for delete to authenticated
  using (proprietaire_id = auth.uid());
