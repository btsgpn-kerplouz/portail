-- ============================================================================
-- organisation-cours — réunions : table relationnelle + visibilité par
-- participant tagué (retour terrain multi-utilisateurs)
-- ============================================================================
-- Jusqu'ici `reunions` vivait dans oc_blocs_perso (strictement privé, jamais
-- visible d'un autre compte). Nouveau besoin : qu'une réunion apparaisse chez
-- un collègue quand on l'a coché comme présent ("Enseignant(s) présent(s)"),
-- en plus du champ `participants` en texte libre déjà existant (personnes et
-- organismes externes, hors périmètre de ce tag).
--
-- Contrairement aux autres tables partagées (oc_ues/oc_sequences/oc_sessions,
-- SELECT ouvert à tout enseignant actif), la lecture ici est restreinte au
-- créateur + aux enseignants tagués : `participants` contient des noms
-- complets en texte libre (cf. AUDIT-RGPD.md, qui différait justement ce
-- module pour cette raison) — pas de raison de l'exposer à toute l'équipe.
-- ============================================================================

create table if not exists oc_reunions (
  id                text primary key,
  date              date,
  lieu              text,
  sujets            text,
  personal_vehicle  boolean not null default false,
  contenu           jsonb not null default '{}', -- participants (texte libre, noms complets)...
  cree_par          uuid references oc_enseignants (user_id) on delete set null,
  updated_at        timestamptz not null default now()
);

create table if not exists oc_reunion_enseignants (
  reunion_id    text not null references oc_reunions (id) on delete cascade,
  enseignant_id uuid not null references oc_enseignants (user_id) on delete cascade,
  primary key (reunion_id, enseignant_id)
);

create index if not exists oc_reunion_enseignants_enseignant_idx on oc_reunion_enseignants (enseignant_id);

alter table oc_reunions enable row level security;

-- SELECT restreint (voir en-tête) : créateur OU participant tagué, pas
-- "tout enseignant actif" comme pour ues/sequences/sessions.
create policy oc_reunions_select on oc_reunions
  for select
  to authenticated
  using (
    oc_is_active_teacher()
    and (
      cree_par = auth.uid()
      or exists (select 1 from oc_reunion_enseignants m where m.reunion_id = id and m.enseignant_id = auth.uid())
    )
  );

create policy oc_reunions_insert on oc_reunions
  for insert
  to authenticated
  with check (oc_is_active_teacher() and cree_par = auth.uid());

create policy oc_reunions_update on oc_reunions
  for update
  to authenticated
  using (
    oc_is_active_teacher()
    and (
      cree_par = auth.uid()
      or exists (select 1 from oc_reunion_enseignants m where m.reunion_id = id and m.enseignant_id = auth.uid())
    )
  )
  with check (
    oc_is_active_teacher()
    and (
      cree_par = auth.uid()
      or exists (select 1 from oc_reunion_enseignants m where m.reunion_id = id and m.enseignant_id = auth.uid())
    )
  );

create policy oc_reunions_delete on oc_reunions
  for delete
  to authenticated
  using (
    oc_is_active_teacher()
    and (
      cree_par = auth.uid()
      or exists (select 1 from oc_reunion_enseignants m where m.reunion_id = id and m.enseignant_id = auth.uid())
    )
  );

alter table oc_reunion_enseignants enable row level security;

-- SELECT : visible si la réunion mère l'est déjà (la sous-requête est
-- elle-même filtrée par oc_reunions_select) — donc créateur ET tout
-- participant déjà tagué voient l'ensemble des tags de cette réunion.
create policy oc_reunion_enseignants_select on oc_reunion_enseignants
  for select
  to authenticated
  using (
    oc_is_active_teacher()
    and exists (select 1 from oc_reunions r where r.id = reunion_id)
  );

create policy oc_reunion_enseignants_insert on oc_reunion_enseignants
  for insert
  to authenticated
  with check (
    oc_is_active_teacher()
    and (
      exists (select 1 from oc_reunions r where r.id = reunion_id and r.cree_par = auth.uid())
      or exists (select 1 from oc_reunion_enseignants m where m.reunion_id = oc_reunion_enseignants.reunion_id and m.enseignant_id = auth.uid())
    )
  );

create policy oc_reunion_enseignants_delete on oc_reunion_enseignants
  for delete
  to authenticated
  using (
    oc_is_active_teacher()
    and (
      exists (select 1 from oc_reunions r where r.id = reunion_id and r.cree_par = auth.uid())
      or exists (select 1 from oc_reunion_enseignants m where m.reunion_id = oc_reunion_enseignants.reunion_id and m.enseignant_id = auth.uid())
    )
  );

-- ----------------------------------------------------------------------------
-- Migration des données existantes (oc_blocs_perso, cle='reunions') vers la
-- nouvelle table relationnelle. cree_par = le compte qui détenait le blob
-- privé ; aucun tag enseignant au départ (à cocher au prochain enregistrement
-- de chaque réunion).
-- ----------------------------------------------------------------------------
insert into oc_reunions (id, date, lieu, sujets, personal_vehicle, contenu, cree_par)
select
  elem->>'id',
  nullif(elem->>'date', '')::date,
  elem->>'lieu',
  elem->>'sujets',
  coalesce((elem->>'personalVehicle')::boolean, false),
  jsonb_build_object('participants', elem->>'participants'),
  b.user_id
from oc_blocs_perso b
cross join lateral jsonb_array_elements(
  case jsonb_typeof(b.contenu) when 'array' then b.contenu else '[]'::jsonb end
) as elem
where b.cle = 'reunions'
on conflict (id) do nothing;

delete from oc_blocs_perso where cle = 'reunions';
