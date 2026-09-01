-- ============================================================================
-- organisation-cours — édition partagée des « périodes particulières »
-- ============================================================================
-- Bug remonté par un collègue le 01/09/2026 : modifier une période existante
-- (vacances / stage / examen / EIL) dans le tableau de bord échouait avec
-- « modification refusée (droits insuffisants ?) », en rafale sur des
-- dizaines de lignes à la fois.
--
-- Cause : policies.sql restreignait l'UPDATE/DELETE de `oc_constraints` au
-- seul créateur de la ligne (commentaire d'origine : « pas co-enseignée »).
-- Mais côté écran, « Périodes particulières » est rendu comme une liste
-- commune — chaque ligne a un bouton modifier/supprimer, sans aucune marque
-- « lecture seule » pour les périodes créées par un·e collègue (contrairement
-- aux séquences, qui distinguent bien les deux cas). Résultat : dès qu'un
-- compte différent du créateur initial (souvent tout le calendrier saisi
-- d'un coup par une seule personne au démarrage) touche une période, la RLS
-- bloque silencieusement l'écriture alors que l'interface ne l'annonce pas.
--
-- Correctif : ce calendrier partagé (vacances, stages, examens, EIL) devient
-- éditable par n'importe quel compte enseignant actif, à l'image de la
-- lecture (déjà ouverte à tous) — pas de jointure de co-édition à ajouter,
-- contrairement aux UE/séquences qui restent, elles, réservées à leurs
-- enseignant·e·s. `cree_par` est conservé (utile en historique) mais n'est
-- plus vérifié à l'update/delete.
-- ============================================================================

drop policy if exists oc_constraints_update on oc_constraints;
create policy oc_constraints_update on oc_constraints
  for update
  to authenticated
  using (oc_is_active_teacher())
  with check (oc_is_active_teacher());

drop policy if exists oc_constraints_delete on oc_constraints;
create policy oc_constraints_delete on oc_constraints
  for delete
  to authenticated
  using (oc_is_active_teacher());

-- oc_constraints_select (déjà ouverte à tout compte actif) et
-- oc_constraints_insert (cree_par = auth.uid() sur la ligne insérée elle-même)
-- ne sont pas concernées : inchangées.
