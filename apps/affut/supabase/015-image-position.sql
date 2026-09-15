-- ============================================================================
-- affut — cadrage manuel de l'illustration d'un numéro (Lot 29, demande du
-- 15/09/2026 : la photo du n°3 tombe mal centrée sur la tuile Sommaire en
-- desktop — colonne étroite et haute, object-fit:cover recadre au centre par
-- défaut, ce qui ne convient pas à toutes les photos)
-- ============================================================================
-- `image_position` stocke un point focal en pourcentages ("X% Y%", format
-- CSS `object-position` direct — voir apps/affut/index.html, .nc-image) que
-- l'enseignant règle en cliquant sur l'aperçu, dans le panneau de rédaction.
-- Défaut '50% 50%' (centre, comportement actuel inchangé pour les numéros
-- déjà publiés).
-- ============================================================================

alter table affut_numeros add column if not exists image_position text not null default '50% 50%';

-- Ajoutée en DERNIÈRE position de la liste de colonnes de la vue publique
-- (même règle que 008-numero-image.sql et 012-date-publication.sql :
-- `create or replace view` refuse de changer la position/le nom d'une
-- colonne existante).
create or replace view affut_numeros_public
with (security_invoker = false)
as
select numero, statut, mois, semaine, titre, chapo, vues, image_url, date_publication, image_position
from affut_numeros
where statut = 'publie';
