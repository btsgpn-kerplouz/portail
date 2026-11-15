-- ============================================================================
-- affut — Bilan par période (demande du 15/11/2026 : « toute la page Bilan
-- est compliquée à lire » ; elle doit dire si l'app est utilisée, à quelle
-- intensité, quand (au jour près, pas à l'heure) et quels contenus sont les
-- plus consultés, avec une période de 30 jours par défaut et la possibilité
-- de remonter jusqu'à la rentrée de septembre).
-- ============================================================================
-- Une seule fonction de lecture, `affut_bilan_periode(debut, fin)` (bornes
-- incluses, jours à l'heure de Paris). L'écran l'appelle deux fois : pour la
-- période affichée et pour la période précédente de même durée (comparaison).
--
-- Mêmes définitions que 020-frequentation-visiteurs.sql : visite = suite
-- d'événements sans pause de plus de 30 minutes ; une visite à cheval sur
-- minuit compte pour le jour où elle a commencé. Le découpage en visites est
-- calculé sur tout l'historique du visiteur, puis filtré sur la période
-- (sinon une visite commencée la veille de la période serait comptée deux
-- fois).
--
-- Événements sans visiteur (repris des anciens journaux, avant le
-- 15/11/2026) : impossibles à rattacher à un lecteur. Ils sont renvoyés à
-- part (`vues_anonymes`, `clics_anonymes`) pour que l'écran les montre
-- sans les mélanger aux lecteurs.
--
-- `affut_bilan_frequentation()` (020) reste en place mais n'est plus lue.
-- `security invoker` + test explicite : rédacteur actif seulement.
-- `language plpgsql` (jamais `sql`, voir 002-policies.sql).
-- ============================================================================

create or replace function affut_bilan_periode(p_debut date, p_fin date)
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
  per as (select * from ev where jour between p_debut and p_fin),
  per_v as (select * from ev_v where jour between p_debut and p_fin),
  visites_jour as (
    select visiteur, jour, sum(debut_visite) as nb
    from per_v
    group by visiteur, jour
  ),
  jours as (select distinct jour from per),
  par_jour as (
    select j.jour,
      (select count(*) from visites_jour v where v.jour = j.jour) as lecteurs,
      (select coalesce(sum(nb), 0) from visites_jour v where v.jour = j.jour) as visites,
      (select count(*) from visites_jour v where v.jour = j.jour and v.nb >= 2) as revenus,
      (select count(*) from per p where p.jour = j.jour and p.visiteur is null and p.type = 'vue_numero') as vues_anonymes
    from jours j
  ),
  numeros as (
    select numero,
      count(distinct visiteur) as lecteurs,
      count(*) filter (where visiteur is null) as vues_anonymes
    from per
    where type = 'vue_numero'
    group by numero
  ),
  entrees as (
    select entree_id,
      max(numero) as numero,
      count(distinct visiteur) as lecteurs,
      count(*) filter (where visiteur is null) as clics_anonymes
    from per
    where type = 'clic_source'
    group by entree_id
  )
  select json_build_object(
    'lecteurs', (select count(distinct visiteur) from per),
    'visites', (select coalesce(sum(debut_visite), 0) from per_v),
    'jours_actifs', (select count(*) from jours),
    'revenus', (select count(distinct visiteur) from visites_jour where nb >= 2),
    'anonymes', (select count(*) from per where visiteur is null),
    'suivi_depuis', (select min(jour) from ev where visiteur is not null),
    'par_jour', coalesce((select json_agg(p order by p.jour) from par_jour p), '[]'::json),
    'numeros', coalesce((select json_agg(n) from numeros n), '[]'::json),
    'entrees', coalesce((select json_agg(e) from entrees e), '[]'::json)
  ) into v_resultat;

  return v_resultat;
end;
$$;

grant execute on function affut_bilan_periode(date, date) to authenticated;
