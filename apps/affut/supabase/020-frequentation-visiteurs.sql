-- ============================================================================
-- affut — fréquentation par visiteur anonyme (demande du 15/11/2026)
-- ============================================================================
-- Jusqu'ici (003-compteurs.sql, 014-log-frequentation.sql), chaque ouverture
-- d'un numéro et chaque clic « Ouvrir la source » ajoutaient +1, sans savoir
-- QUI : impossible de distinguer 30 élèves d'un seul élève qui recharge 30
-- fois, ni de repérer ceux qui reviennent plusieurs fois dans la journée.
--
-- Ce lot :
--   1. ajoute une table unique d'événements `affut_evenements`, qui remplace
--      les deux journaux affut_vues_log / affut_clics_log (repris ici, puis
--      plus alimentés — conservés tels quels, suppressibles plus tard) ;
--   2. chaque événement porte un identifiant de visiteur ANONYME : un uuid
--      tiré au hasard par le navigateur et gardé dans son localStorage.
--      Aucun nom, aucun compte, aucune adresse IP stockée. Les événements
--      repris des anciens journaux ont `visiteur = null` (inconnu) ;
--   3. un seul point d'écriture, `affut_enregistrer_evenement()`, qui
--      continue d'incrémenter les totaux affut_numeros.vues /
--      affut_entrees.clics_source (ils contiennent l'historique d'avant le
--      15/09/2026, absent de tout journal : on les garde) ;
--   4. un seul point de lecture, `affut_bilan_frequentation()`, qui renvoie
--      au Bilan des chiffres DÉJÀ regroupés côté base — le Bilan ne charge
--      plus le journal brut (la lecture directe était plafonnée à 1 000
--      lignes par l'API Supabase : le détail jour par jour aurait fini par
--      être tronqué sans message).
--
-- Définition d'une « visite » : une suite d'événements d'un même visiteur
-- sans pause de plus de 30 minutes (convention habituelle des outils de
-- mesure d'audience). Un élève qui ouvre l'app le matin puis le soir
-- compte donc 2 visites ce jour-là — c'est ce qui permet de compter les
-- visiteurs revenus plusieurs fois dans une même journée. Les jours sont
-- calculés à l'heure de Paris.
--
-- Anti-rebond : un même événement (même visiteur, même type, même numéro,
-- même entrée) répété à moins de 10 secondes est ignoré (double clic,
-- rechargement immédiat).
--
-- Durée de conservation : les événements de plus de 25 mois sont purgés
-- automatiquement (repère CNIL pour la mesure d'audience exemptée de
-- consentement).
--
-- Pas de protection anti-abus au-delà de l'anti-rebond (même choix assumé
-- que 003-compteurs.sql : repère interne pour l'enseignant, pas un chiffre
-- public). `language plpgsql` partout (jamais `sql`, voir 002-policies.sql).
--
-- À appliquer en une fois dans le SQL Editor du projet `portail`.
-- Réappliquer le script est sans danger (idempotent).
-- ============================================================================

create table if not exists affut_evenements (
  id bigint generated always as identity primary key,
  type text not null check (type in ('ouverture', 'sommaire', 'recherche', 'vue_numero', 'clic_source', 'installation')),
  visiteur uuid,
  numero integer references affut_numeros(numero) on delete cascade on update cascade,
  entree_id text references affut_entrees(id) on delete cascade,
  survenu_le timestamptz not null default now()
);

create index if not exists affut_evenements_survenu_le_idx on affut_evenements(survenu_le);
create index if not exists affut_evenements_visiteur_idx on affut_evenements(visiteur, survenu_le);
create index if not exists affut_evenements_numero_idx on affut_evenements(numero);

alter table affut_evenements enable row level security;

-- Lecture rédaction seule ; aucune policy d'écriture : l'insertion ne passe
-- QUE par affut_enregistrer_evenement() (security definer).
drop policy if exists affut_evenements_lecture on affut_evenements;
create policy affut_evenements_lecture on affut_evenements
  for select
  to authenticated
  using (affut_is_active_redacteur());

-- ---- Reprise des anciens journaux (visiteur inconnu) ----------------------
-- Idempotente : une ligne déjà reprise (même type, même cible, même instant)
-- n'est pas recopiée.

insert into affut_evenements (type, visiteur, numero, survenu_le)
select 'vue_numero', null, l.numero, l.survenu_le
from affut_vues_log l
where not exists (
  select 1 from affut_evenements e
  where e.type = 'vue_numero' and e.visiteur is null and e.numero = l.numero and e.survenu_le = l.survenu_le
);

insert into affut_evenements (type, visiteur, numero, entree_id, survenu_le)
select 'clic_source', null, l.numero, l.entree_id, l.survenu_le
from affut_clics_log l
where not exists (
  select 1 from affut_evenements e
  where e.type = 'clic_source' and e.visiteur is null and e.entree_id = l.entree_id and e.survenu_le = l.survenu_le
);

-- ---- Écriture : point d'entrée unique ---------------------------------------

create or replace function affut_enregistrer_evenement(
  p_type text,
  p_visiteur uuid default null,
  p_numero integer default null,
  p_entree_id text default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_numero integer := null;
begin
  if p_type not in ('ouverture', 'sommaire', 'recherche', 'vue_numero', 'clic_source', 'installation') then
    return;
  end if;

  -- Anti-rebond (visiteurs identifiés seulement).
  if p_visiteur is not null and exists (
    select 1 from affut_evenements
    where visiteur = p_visiteur
      and type = p_type
      and numero is not distinct from p_numero
      and entree_id is not distinct from p_entree_id
      and survenu_le > now() - interval '10 seconds'
  ) then
    return;
  end if;

  if p_type = 'vue_numero' then
    -- Seulement sur un numéro publié, comme le compteur historique.
    update affut_numeros set vues = vues + 1
    where numero = p_numero and statut = 'publie';
    if not found then return; end if;
    v_numero := p_numero;
  elsif p_type = 'clic_source' then
    -- Seulement sur une entrée validée ; le numéro est retrouvé ici, jamais
    -- cru sur parole.
    update affut_entrees set clics_source = clics_source + 1
    where id = p_entree_id and valide = true
    returning numero_id into v_numero;
    if not found then return; end if;
  end if;

  insert into affut_evenements (type, visiteur, numero, entree_id)
  values (p_type, p_visiteur, v_numero, case when p_type = 'clic_source' then p_entree_id else null end);

  -- Purge des événements trop anciens, une fois par ouverture de l'app
  -- (index sur survenu_le : coût négligeable).
  if p_type = 'ouverture' then
    delete from affut_evenements where survenu_le < now() - interval '25 months';
  end if;
end;
$$;

grant execute on function affut_enregistrer_evenement(text, uuid, integer, text) to anon, authenticated;

-- Anciennes fonctions conservées pour les navigateurs qui auraient encore
-- l'ancienne version de la page en mémoire : elles écrivent désormais dans
-- la nouvelle table (visiteur inconnu) au lieu des anciens journaux.
create or replace function affut_incrementer_vue_numero(p_numero integer)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  perform affut_enregistrer_evenement('vue_numero', null, p_numero, null);
end;
$$;

create or replace function affut_incrementer_clic_source(p_entree_id text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  perform affut_enregistrer_evenement('clic_source', null, null, p_entree_id);
end;
$$;

grant execute on function affut_incrementer_vue_numero(integer) to anon, authenticated;
grant execute on function affut_incrementer_clic_source(text) to anon, authenticated;

-- ---- Lecture : bilan déjà regroupé ------------------------------------------
-- `security invoker` : la RLS de affut_evenements s'applique (rédacteur
-- actif seulement) ; le test explicite renvoie null à tout autre appelant.
-- p_jours : profondeur de la série « fréquentation de l'app jour par jour ».

create or replace function affut_bilan_frequentation(p_jours integer default 30)
returns json
language plpgsql
stable
security invoker
set search_path = public
as $$
declare
  v_resultat json;
begin
  if not affut_is_active_redacteur() then
    return null;
  end if;

  with ev as (
    select e.*, (e.survenu_le at time zone 'Europe/Paris')::date as jour
    from affut_evenements e
  ),
  -- Découpage en visites : nouvelle visite si premier événement du visiteur
  -- ou pause de plus de 30 minutes depuis le précédent.
  ev_v as (
    select ev.*,
      case
        when lag(survenu_le) over w is null then 1
        when survenu_le - lag(survenu_le) over w > interval '30 minutes' then 1
        else 0
      end as debut_visite
    from ev
    where visiteur is not null
    window w as (partition by visiteur order by survenu_le)
  ),
  visites_jour as (
    select visiteur, jour, sum(debut_visite) as nb
    from ev_v
    group by visiteur, jour
  ),
  par_jour as (
    select jour,
      count(*) as visiteurs,
      sum(nb) as visites,
      count(*) filter (where nb >= 2) as visiteurs_multi
    from visites_jour
    where jour > (now() at time zone 'Europe/Paris')::date - p_jours
    group by jour
  ),
  premiere_vue as (
    select numero, visiteur, min(survenu_le) as premiere
    from ev
    where type = 'vue_numero' and visiteur is not null
    group by numero, visiteur
  ),
  par_numero as (
    select n.numero,
      (select count(distinct visiteur) from ev where type = 'vue_numero' and ev.numero = n.numero) as lecteurs,
      (select count(distinct visiteur) from ev where type = 'clic_source' and ev.numero = n.numero) as lecteurs_source,
      (select count(*) from (
         select visiteur from ev
         where type = 'vue_numero' and ev.numero = n.numero and visiteur is not null
         group by visiteur having count(*) >= 2
       ) r) as relecteurs,
      (select percentile_cont(0.5) within group (order by extract(epoch from (p.premiere - (n.date_publication::timestamp at time zone 'Europe/Paris'))) / 3600.0)
       from premiere_vue p
       where p.numero = n.numero and n.date_publication is not null and p.premiere >= (n.date_publication::timestamp at time zone 'Europe/Paris')) as delai_median_h
    from affut_numeros n
    where n.statut = 'publie'
  ),
  par_jour_numero as (
    select numero, jour, count(*) as vues, count(distinct visiteur) as lecteurs
    from ev
    where type = 'vue_numero'
    group by numero, jour
  ),
  par_jour_entree as (
    select entree_id, jour, count(*) as clics
    from ev
    where type = 'clic_source'
    group by entree_id, jour
  )
  select json_build_object(
    'depuis', (select min(survenu_le) from ev where visiteur is not null),
    'visiteurs', (select count(distinct visiteur) from ev),
    'visites', (select coalesce(sum(debut_visite), 0) from ev_v),
    'visiteurs_multi', (select count(distinct visiteur) from visites_jour where nb >= 2),
    'jours_multi', (select count(*) from visites_jour where nb >= 2),
    'recherches', (select count(*) from ev where type = 'recherche'),
    'installations', (select count(*) from ev where type = 'installation'),
    'par_jour', coalesce((select json_agg(p order by p.jour) from par_jour p), '[]'::json),
    'par_numero', coalesce((select json_agg(p) from par_numero p), '[]'::json),
    'par_jour_numero', coalesce((select json_agg(p) from par_jour_numero p), '[]'::json),
    'par_jour_entree', coalesce((select json_agg(p) from par_jour_entree p), '[]'::json)
  ) into v_resultat;

  return v_resultat;
end;
$$;

grant execute on function affut_bilan_frequentation(integer) to authenticated;
