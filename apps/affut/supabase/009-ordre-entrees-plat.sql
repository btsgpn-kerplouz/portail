-- ============================================================================
-- affut — correctif : ordre d'affichage réellement à PLAT (02/09/2026)
-- ============================================================================
-- Le Lot 17 (voir 007/008 et AVANCEMENT.md) a retiré l'affichage groupé par
-- rubrique à l'écran au profit d'une liste à plat + pastille de rubrique par
-- entrée. Mais entreesOrdonnees() (apps/affut/index.html) continuait à
-- passer par groupByRubrique() pour calculer cet ordre — qui groupe D'ABORD
-- par rubrique (1re apparition) puis trie SEULEMENT à l'intérieur de chaque
-- groupe. Résultat : Monter/Descendre modifiait bien `ordre` en base, mais
-- ne pouvait jamais faire franchir à une entrée sa frontière de rubrique à
-- l'écran — bug remonté le 02/09/2026 (« je ne peux pas vraiment ordonner
-- les entrées ... seulement au sein d'une rubrique »).
--
-- Corrigé côté front : entreesOrdonnees() trie maintenant directement par
-- `ordre`, sans repasser par groupByRubrique() (toujours utilisée, elle,
-- pour l'export PDF qui reste volontairement groupé par rubrique).
--
-- Ce tri direct suppose `ordre` unique à PLAT sur tout le numéro. Or les
-- valeurs existantes ont été attribuées PAR RUBRIQUE (006-ordre-entrees.sql,
-- Lot 10bis) : deux rubriques différentes d'un même numéro peuvent partager
-- les mêmes valeurs 0,1,2… Cette migration renumérote donc `ordre` UNE FOIS
-- pour reproduire l'affichage actuel (groupé par rubrique — approximé par
-- la date de création la plus ancienne de chaque rubrique — puis par
-- `ordre` existant au sein de la rubrique) sous forme d'une séquence 0..n-1
-- à plat par numéro. Une fois appliquée, le tri direct par `ordre` donne
-- exactement le même affichage qu'avant ce correctif ; les futurs
-- déplacements Monter/Descendre (qui réassignent déjà 0..n-1 à plat sur
-- tout le numéro, voir deplacerOrdreEntree()) fonctionneront ensuite
-- correctement, y compris d'une rubrique à l'autre.
-- ============================================================================

with rubrique_rang as (
  select numero_id, rubrique,
         row_number() over (partition by numero_id order by min(cree_le) asc) as rang_rubrique
  from affut_entrees
  group by numero_id, rubrique
),
plat as (
  select e.id,
         row_number() over (
           partition by e.numero_id
           order by rr.rang_rubrique asc, e.ordre asc, e.cree_le asc
         ) - 1 as nouvel_ordre
  from affut_entrees e
  join rubrique_rang rr on rr.numero_id = e.numero_id and rr.rubrique = e.rubrique
)
update affut_entrees set ordre = plat.nouvel_ordre
from plat
where affut_entrees.id = plat.id;
