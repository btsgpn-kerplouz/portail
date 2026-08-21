-- ============================================================================
-- PhytoScope — table `lots` (synchro des lots de relevés, jusqu'ici stockés
-- uniquement en localStorage — voir apps/phytoscope/index.html)
-- ============================================================================
-- Un lot = un groupe coloré de relevés créé depuis l'écran Accueil
-- ({id, name, ids:[...releve_id], color, updated_at}). Même schéma que la
-- table `releves` déjà en place : id texte généré côté client (pas un uuid),
-- clé composite (proprietaire_id, id) car cet id n'est unique que pour un
-- même propriétaire, blob complet dans `donnees`, RLS scoping direct sur
-- auth.uid() sans fonction SQL intermédiaire (pas de risque d'inlining —
-- voir apps/organisation-cours/supabase/014-fix-inlining-security-definer.sql
-- pour ce piège précis, qui ne s'applique qu'aux fonctions `language sql`).
-- ============================================================================

create table if not exists public.lots (
  id text not null,
  proprietaire_id uuid not null references auth.users(id) on delete cascade,
  nom text not null default '',
  donnees jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  primary key (proprietaire_id, id)
);

alter table public.lots enable row level security;

create policy "lots_select_own" on public.lots
  for select
  using (proprietaire_id = auth.uid());

create policy "lots_insert_own" on public.lots
  for insert
  with check (proprietaire_id = auth.uid());

create policy "lots_update_own" on public.lots
  for update
  using (proprietaire_id = auth.uid())
  with check (proprietaire_id = auth.uid());

create policy "lots_delete_own" on public.lots
  for delete
  using (proprietaire_id = auth.uid());
