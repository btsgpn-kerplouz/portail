-- ============================================================================
-- organisation-cours — préférence « voir le contenu de mes collègues » (Cas 2)
-- ============================================================================
-- Complète le modèle de visibilité déjà en place côté front (commentaire
-- « Retours #3 (18-19/08/2026) » dans app.js, fonction contenuInteractifPourMoi) :
--   Cas 1 — pas enseignant·e de l'UE : aucun contenu (déjà géré, inchangé).
--   Cas 2 — enseignant·e de l'UE, pas de cette séquence/séance précise :
--     jusqu'ici toujours affiché en tuile atténuée non ouvrable. Cette colonne
--     ajoute le CHOIX (par défaut désactivé) de voir ce contenu, et — côté
--     app.js — de l'ouvrir en lecture seule une fois le choix activé.
--   Cas 3 — séquence/séance partagée via oc_sequence_enseignants /
--     oc_session_enseignants : édition partagée, inchangé.
--
-- Simple préférence de compte, aucune donnée sensible : pas de nouvelle
-- policy nécessaire, oc_enseignants_update_self (policies.sql) couvre déjà
-- la mise à jour de n'importe quelle colonne de sa propre ligne.
-- ============================================================================

alter table oc_enseignants
  add column if not exists voir_collegues boolean not null default false;
