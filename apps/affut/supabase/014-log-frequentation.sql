-- ============================================================================
-- affut — historique journalier de fréquentation (Lot 28, demande du
-- 15/09/2026 : « je veux des graphiques avec la fréquentation journalière de
-- chaque numéro »)
-- ============================================================================
-- Jusqu'ici (003-compteurs.sql), affut_numeros.vues / affut_entrees.clics_source
-- ne sont que des totaux cumulés, sans horodatage — impossible d'en tirer un
-- graphique jour par jour. Ce lot ajoute un journal d'événements horodatés,
-- EN PLUS des compteurs existants (qu'on garde tels quels : le Bilan continue
-- de lire les totaux directement, rien à recalculer, zéro risque de régression
-- sur ce qui marche déjà).
--
-- Pas d'historique rétroactif possible : les numéros déjà parus n'ont pas ces
-- horodatages, seuls leurs totaux existent. Le détail jour par jour ne
-- commence à s'enregistrer qu'à partir de l'application de cette migration.
--
-- Écriture réservée aux 2 fonctions RPC existantes (affut_incrementer_vue_
-- numero/affut_incrementer_clic_source, remplacées ici) : `security definer`
-- contourne la RLS pour LEUR PROPRE écriture, sans jamais exposer aux
-- appelants (anon/authenticated) un accès direct en insertion — même
-- principe que 002-policies.sql/003-compteurs.sql. `language plpgsql`
-- (jamais `sql`, voir 002-policies.sql pour le pourquoi).
-- ============================================================================

create table if not exists affut_vues_log (
  id bigint generated always as identity primary key,
  numero integer not null references affut_numeros(numero) on delete cascade,
  survenu_le timestamptz not null default now()
);

create table if not exists affut_clics_log (
  id bigint generated always as identity primary key,
  entree_id text not null references affut_entrees(id) on delete cascade,
  numero integer not null references affut_numeros(numero) on delete cascade,
  survenu_le timestamptz not null default now()
);

create index if not exists affut_vues_log_numero_idx on affut_vues_log(numero);
create index if not exists affut_clics_log_entree_id_idx on affut_clics_log(entree_id);

-- Lecture rédaction seule (écran Bilan), même principe que affut_ingestion_log
-- dans 002-policies.sql : aucune policy d'écriture, l'insertion ne passe QUE
-- par les fonctions security definer ci-dessous.
alter table affut_vues_log enable row level security;
alter table affut_clics_log enable row level security;

create policy affut_vues_log_lecture on affut_vues_log
  for select
  to authenticated
  using (affut_is_active_redacteur());

create policy affut_clics_log_lecture on affut_clics_log
  for select
  to authenticated
  using (affut_is_active_redacteur());

-- `if found` (plpgsql) : vrai seulement si l'UPDATE a bien touché une ligne
-- (numéro publié / entrée validée) — même garde-fou que l'UPDATE lui-même,
-- pour ne jamais logger un événement sur un numéro/une entrée qui n'existe
-- pas ou n'est pas publique.
create or replace function affut_incrementer_vue_numero(p_numero integer)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update affut_numeros
  set vues = vues + 1
  where numero = p_numero and statut = 'publie';

  if found then
    insert into affut_vues_log (numero) values (p_numero);
  end if;
end;
$$;

create or replace function affut_incrementer_clic_source(p_entree_id text)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_numero integer;
begin
  update affut_entrees
  set clics_source = clics_source + 1
  where id = p_entree_id and valide = true
  returning numero_id into v_numero;

  if found then
    insert into affut_clics_log (entree_id, numero) values (p_entree_id, v_numero);
  end if;
end;
$$;

grant execute on function affut_incrementer_vue_numero(integer) to anon, authenticated;
grant execute on function affut_incrementer_clic_source(text) to anon, authenticated;
