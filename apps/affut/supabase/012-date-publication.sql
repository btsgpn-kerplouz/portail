-- ============================================================================
-- affut — date de publication distincte de la semaine de collecte (Lot 26,
-- 04/09/2026)
-- ============================================================================
-- Jusqu'ici, `semaine`/`mois` étaient calculés à partir du jour de collecte
-- (le samedi de la moisson automatique), ce qui donnait l'impression qu'un
-- numéro est forcément composé d'actualités parues « la semaine du samedi »
-- — faux dès qu'une entrée manuelle, publiée à une autre date, s'y ajoute.
-- Décision (voir discussion utilisateur du 04/09/2026) : un numéro porte
-- désormais une vraie date de publication (le lundi suivant le samedi de
-- moisson), et `semaine`/`mois` sont recalculés côté client/Worker à partir
-- de CE lundi, pas du jour de collecte — voir formaterSemaineIso()/
-- isoSemaineActuelle() dans apps/affut/index.html et
-- supabase/functions/affut-veille/index.ts.
--
-- Rétrocompatibilité : les numéros déjà publiés n'ont pas cette date en
-- base. On la déduit du meilleur indice disponible — `collecte->>'date'`
-- (jour de moisson, samedi) + 2 jours = lundi suivant — pour ne pas laisser
-- `date_publication` vide sur des numéros déjà en ligne. Les numéros publiés
-- sans `collecte` (créés/publiés à la main, hors veille automatique)
-- restent à `null` : à renseigner manuellement si besoin, aucune façon
-- fiable de deviner leur date de publication réelle.
-- ============================================================================

alter table affut_numeros add column if not exists date_publication date;

update affut_numeros
set date_publication = (collecte->>'date')::date + 2
where date_publication is null
  and collecte->>'date' is not null;

-- `date_publication` ajoutée en DERNIÈRE position de la liste de colonnes :
-- `create or replace view` refuse de changer la position/le nom d'une
-- colonne existante (vu comme un renommage) — même règle déjà suivie au
-- Lot 16 pour `image_url` (008-numero-image.sql), qui est donc, en prod,
-- déjà la dernière colonne de cette vue : `date_publication` vient après.
create or replace view affut_numeros_public
with (security_invoker = false)
as
select numero, statut, mois, semaine, titre, chapo, vues, image_url, date_publication
from affut_numeros
where statut = 'publie';
