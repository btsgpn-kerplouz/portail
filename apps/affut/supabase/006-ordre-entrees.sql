-- ============================================================================
-- affut — ordre d'affichage manuel des entrées (Lot 10bis, 01/09/2026)
-- ============================================================================
-- Demandé par l'utilisateur après le Lot 10 (refonte de l'écran Moisson) :
-- pouvoir changer l'ordre d'affichage des entrées au sein d'une rubrique
-- (boutons Monter/Descendre, apps/affut/index.html). Jusqu'ici l'ordre était
-- simplement celui de lecture réseau de affut_entrees (non garanti, jamais
-- explicitement trié).
--
-- Pas de contrainte d'unicité sur `ordre` : le front réassigne 0..n-1 à
-- TOUTES les entrées d'une même (numero_id, rubrique) à chaque déplacement
-- (voir deplacerOrdreEntree() dans index.html) — aucune gestion de
-- collision ou de « trou » nécessaire côté serveur. Comparé/trié seulement
-- à l'intérieur d'une rubrique (groupByRubrique() côté front) : des valeurs
-- identiques entre deux rubriques différentes du même numéro n'ont aucun
-- effet, l'ordre des rubriques elles-mêmes reste inchangé (1re apparition
-- dans la liste chargée, comme avant ce lot).
-- ============================================================================

alter table affut_entrees add column if not exists ordre integer not null default 0;

-- Backfill des entrées déjà en base : ordre de création (cree_le) au sein
-- de chaque (numero_id, rubrique), pour préserver l'ordre d'affichage
-- actuel plutôt que de tout remettre à 0 (ce qui aurait mélangé les
-- entrées existantes selon l'ordre de lecture réseau).
with numerotees as (
  select id, row_number() over (partition by numero_id, rubrique order by cree_le asc) - 1 as rang
  from affut_entrees
)
update affut_entrees set ordre = numerotees.rang
from numerotees
where affut_entrees.id = numerotees.id;

-- Vue publique : ajoute `ordre`, pour que le tri s'applique aussi côté
-- lecture publique — même code de rendu (groupByRubrique()) que la
-- rédaction, voir 002-policies.sql pour la définition d'origine de cette
-- vue. `ordre` DOIT rester la toute dernière colonne du select : Postgres
-- refuse un CREATE OR REPLACE VIEW qui insère une colonne au milieu d'une
-- vue existante (« cannot change name of view column ... to ... », les
-- colonnes d'une vue sont liées à leur position) — seul un ajout en fin de
-- liste est autorisé sans DROP VIEW.
create or replace view affut_entrees_public
with (security_invoker = false)
as
select
  id, numero_id, rubrique, origine, source, url,
  lien_mort, lien_mort_depuis, titre,
  case when (blocs->>'chiffres')::boolean then chiffres else '[]'::jsonb end as chiffres,
  case when (blocs->>'resume')::boolean then resume else null end as resume,
  blocs,
  clics_source, ordre
from affut_entrees
where valide = true;

grant select on affut_entrees_public to anon;
