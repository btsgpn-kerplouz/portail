-- ============================================================================
-- affut — correctif : aucune entrée ne s'affichait jamais en vue publique
-- ============================================================================
-- Bug SÉVÈRE trouvé le 02/09/2026 (retour direct de l'utilisateur : clic sur
-- un numéro publié → page vide, aucune entrée nulle part en vue publique/
-- anonyme, alors que les mêmes entrées s'affichent normalement une fois
-- connecté en rédaction). Reproduit et diagnostiqué en navigateur
-- (déconnexion + rechargement complet) : les requêtes réseau vers
-- affut_numeros_public et affut_entrees_public renvoient bien 200 avec les
-- bonnes données (vérifié aussi en curl direct, hors app) — le bug n'est
-- donc ni réseau, ni RLS, ni la clé anon.
--
-- Cause réelle : affut_entrees_public a TOUJOURS filtré `where valide =
-- true` sans jamais exposer la colonne `valide` elle-même dans son SELECT
-- (vrai depuis sa toute première définition, 002-policies.sql, reconduit
-- sans changement par 006 et 007). Côté front (index.html,
-- depuisLigneEntree()), chaque ligne récupérée devient donc `valide:
-- undefined`. Or TOUT l'affichage public/anonyme filtre les entrées par
-- `e.valide` (compteurs du Sommaire, liste d'un numéro, Rechercher,
-- impression — voir index.html, ~10 usages de `.filter(e => e.valide)`) :
-- `undefined` y est traité comme faux, donc CHAQUE entrée disparaît
-- silencieusement en lecture publique, sur tous les numéros, depuis
-- l'origine de cette vue. Jamais détecté jusqu'ici car les vérifications
-- précédentes se faisaient systématiquement connecté en rédaction
-- (chargerDonneesRedaction(), qui lit affut_entrees en direct, colonne
-- `valide` incluse — un chemin de code entièrement différent).
--
-- Correctif : ajoute `true as valide` à la vue (dernière colonne, comme
-- `image_url` au Lot 14 — Postgres refuse d'insérer une colonne ailleurs
-- qu'en fin de liste sur un CREATE OR REPLACE VIEW). `true` en dur, pas la
-- colonne réelle : la clause `where valide = true` garantit déjà que toute
-- ligne renvoyée par cette vue est valide par construction, exposer la
-- vraie colonne n'apporterait rien de plus.
-- ============================================================================

create or replace view affut_entrees_public
with (security_invoker = false)
as
select
  id, numero_id, rubrique, origine, source, url,
  lien_mort, lien_mort_depuis, titre,
  case when (blocs->>'chiffres')::boolean then chiffres else '[]'::jsonb end as chiffres,
  case when (blocs->>'resume')::boolean then resume else null end as resume,
  blocs,
  clics_source, ordre, image_url,
  true as valide
from affut_entrees
where valide = true;

grant select on affut_entrees_public to anon;
