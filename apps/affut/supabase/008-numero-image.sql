-- ============================================================================
-- affut — illustration du numéro (Lot 16, 02/09/2026)
-- ============================================================================
-- `image_url` — illustration de la tuile Sommaire, choisie EXPLICITEMENT par
-- l'enseignant (champ dédié en rédaction), plutôt que déduite automatiquement
-- de la 1re entrée du numéro (règle du Lot 14 jugée peu lisible par
-- l'utilisateur : « je ne comprends pas bien comment l'illustration du
-- numéro dans le sommaire est sélectionnée » — la dérivation automatique se
-- basait sur l'ordre brut de lecture réseau des entrées, pas sur leur ordre
-- d'affichage réel). Plus de repli automatique : si `image_url` est vide, la
-- tuile Sommaire n'affiche simplement aucune illustration.
--
-- Une 2e colonne (`rubriques_ordre`, ordre des rubriques par numéro) a été
-- envisagée puis abandonnée dans la même conversation (Lot 17, retour
-- d'usage : « on s'en fiche d'ordonner les rubriques ») avant d'être
-- appliquée — voir apps/affut/AVANCEMENT.md, elle n'apparaît donc jamais
-- dans cette migration.
-- ============================================================================

alter table affut_numeros add column if not exists image_url text;

-- Vue publique : ajoute `image_url` en dernière colonne (comme `vues` au
-- Lot 6, `ordre`/`image_url` sur affut_entrees_public — une vue ne peut pas
-- recevoir de colonne insérée au milieu sans DROP VIEW).
create or replace view affut_numeros_public
with (security_invoker = false)
as
select numero, statut, mois, semaine, titre, chapo, vues, image_url
from affut_numeros
where statut = 'publie';

grant select on affut_numeros_public to anon;
