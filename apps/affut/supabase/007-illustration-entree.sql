-- ============================================================================
-- affut — illustration miniature sur une entrée (Lot 14, 02/09/2026)
-- ============================================================================
-- Objectif : rendre les numéros plus attractifs par une petite illustration
-- par entrée (et, en tuile de Sommaire, celle de la 1re entrée du numéro),
-- sans nouvelle infrastructure de stockage — voir AVANCEMENT.md, Lot 14.
--
-- `image_url` est un simple lien direct (hotlink), pas un fichier hébergé
-- par cette base : soit l'adresse d'une image « og:image » extraite de la
-- page source par la fonction Edge `affut-illustration` (bouton « Récupérer
-- l'illustration » dans le formulaire d'entrée), soit une adresse collée à
-- la main par l'enseignant (ex. une image qu'il héberge déjà ailleurs).
-- Décision assumée (02/09/2026) : pas de copie dans un espace de stockage
-- Supabase pour cette passe — si l'image change ou disparaît côté source,
-- la miniature peut casser rétroactivement ; jugé acceptable pour une
-- veille hebdomadaire, à revoir si ça devient gênant en pratique.
-- ============================================================================

alter table affut_entrees add column if not exists image_url text;

-- Vue publique : ajoute `image_url` en toute dernière colonne (comme
-- `ordre` au Lot 10bis — Postgres refuse d'insérer une colonne au milieu
-- d'une vue existante sans DROP VIEW). Exposée sans condition particulière,
-- au même titre que `titre` : ce n'est qu'une adresse d'image, jamais
-- masquée par `blocs` (elle n'a pas de bloc "replié" équivalent).
create or replace view affut_entrees_public
with (security_invoker = false)
as
select
  id, numero_id, rubrique, origine, source, url,
  lien_mort, lien_mort_depuis, titre,
  case when (blocs->>'chiffres')::boolean then chiffres else '[]'::jsonb end as chiffres,
  case when (blocs->>'resume')::boolean then resume else null end as resume,
  blocs,
  clics_source, ordre, image_url
from affut_entrees
where valide = true;

grant select on affut_entrees_public to anon;
