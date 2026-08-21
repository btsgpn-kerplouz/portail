-- ============================================================================
-- organisation-cours — corrige une auto-référence inutile dans les policies
-- de oc_reunions, seconde cause du même blocage RLS diagnostiqué le
-- 21/08/2026 (voir 014-fix-inlining-security-definer.sql pour la première)
-- ============================================================================
-- Après le correctif 014 (fonctions réécrites en plpgsql), les UE/séquences/
-- séances/contraintes s'enregistraient de nouveau, mais PAS les réunions :
-- même erreur "new row violates row-level security policy for table
-- oc_reunions", reproduite en isolant précisément que ça ne se produisait
-- QUE lors d'un insert avec `returning` (donc quand PostgREST redemande la
-- ligne insérée juste après écriture — ce qu'il fait toujours).
--
-- Cause : `oc_reunion_est_participant(id)` (011-fix-recursion-reunions.sql)
-- ré-interroge `oc_reunions` DEPUIS L'INTÉRIEUR MÊME d'une policy de
-- `oc_reunions` (select/update/delete) — une auto-référence à sa propre
-- table, en plus d'être inutile : `cree_par` est une colonne de LA LIGNE EN
-- COURS D'ÉVALUATION par la policy, donc directement accessible sans
-- ré-interroger la table. Cette auto-référence, évaluée juste après un
-- insert (dans le cadre du `returning`), échouait à voir correctement la
-- ligne tout juste insérée dans le cadre de la même commande.
--
-- 011 avait introduit `oc_reunion_est_participant()` pour casser une VRAIE
-- récursion croisée : oc_reunions_select interrogeait oc_reunion_enseignants
-- ET oc_reunion_enseignants_select interrogeait oc_reunions, un cycle sans
-- fin. Mais un seul des deux sens avait besoin d'être protégé (peu importe
-- lequel, tant qu'il en reste un) : côté oc_reunion_enseignants (qui
-- interroge une AUTRE table, oc_reunions) c'est nécessaire, et cette policy
-- N'EST PAS touchée ici. Côté oc_reunions lui-même, revenir à la vérification
-- directe (colonnes de la ligne + un simple `exists` vers
-- oc_reunion_enseignants, table différente donc pas de cycle) suffit à casser
-- le cycle tout aussi bien, sans l'auto-référence problématique — c'est
-- exactement la version de select/update/delete telle qu'écrite dans
-- 010-reunions-relationnelles.sql, avant que 011 ne l'y remplace inutilement.
--
-- Confirmé par test isolé (drop/create de la seule policy select, dans une
-- transaction annulée) avant application ici.
-- ============================================================================

drop policy oc_reunions_select on oc_reunions;
create policy oc_reunions_select on oc_reunions
  for select
  to authenticated
  using (
    oc_is_active_teacher()
    and (
      cree_par = auth.uid()
      or exists (select 1 from oc_reunion_enseignants m where m.reunion_id = id and m.enseignant_id = auth.uid())
    )
  );

drop policy oc_reunions_update on oc_reunions;
create policy oc_reunions_update on oc_reunions
  for update
  to authenticated
  using (
    oc_is_active_teacher()
    and (
      cree_par = auth.uid()
      or exists (select 1 from oc_reunion_enseignants m where m.reunion_id = id and m.enseignant_id = auth.uid())
    )
  )
  with check (
    oc_is_active_teacher()
    and (
      cree_par = auth.uid()
      or exists (select 1 from oc_reunion_enseignants m where m.reunion_id = id and m.enseignant_id = auth.uid())
    )
  );

drop policy oc_reunions_delete on oc_reunions;
create policy oc_reunions_delete on oc_reunions
  for delete
  to authenticated
  using (
    oc_is_active_teacher()
    and (
      cree_par = auth.uid()
      or exists (select 1 from oc_reunion_enseignants m where m.reunion_id = id and m.enseignant_id = auth.uid())
    )
  );

-- oc_reunion_enseignants_* (011) restent inchangées : elles interrogent une
-- AUTRE table (oc_reunions), donc gardent besoin de oc_reunion_est_participant().
