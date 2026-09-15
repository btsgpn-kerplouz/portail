-- ============================================================================
-- organisation-cours — lecture partagée du bucket "oc-signatures"
-- ============================================================================
-- Besoin (retours 15/09/2026, Martin) : un ordre de mission peut être rédigé
-- par n'importe quel enseignant pour le compte d'un·e collègue (ex. celui/
-- celle qui conduit réellement) — il faut donc pouvoir choisir, dans l'écran
-- « Ordre de mission », LA signature à afficher/imprimer parmi celles déjà
-- enregistrées, pas uniquement la sienne.
--
-- 013-signatures-storage.sql limitait la lecture au propriétaire du dossier
-- (auth.uid() = 1er segment du chemin) : on l'élargit à tout enseignant actif
-- (oc_is_active_teacher(), voir 005-fix-recursion-is-active-teacher.sql — déjà
-- SECURITY DEFINER, pas de récursion possible ici). L'écriture (insert/
-- update/delete) RESTE strictement personnelle : personne ne doit pouvoir
-- déposer/remplacer/supprimer la signature d'un·e collègue à sa place.
--
-- À exécuter dans le SQL Editor du projet Supabase "portail", APRÈS
-- 013-signatures-storage.sql (bucket "oc-signatures" déjà créé, non public).
-- ============================================================================

drop policy if exists "oc_signatures_lecture_perso" on storage.objects;
drop policy if exists "oc_signatures_lecture_equipe" on storage.objects;
create policy "oc_signatures_lecture_equipe"
  on storage.objects for select
  using (
    bucket_id = 'oc-signatures'
    and oc_is_active_teacher()
  );

-- Insert/update/delete : inchangées (013-signatures-storage.sql), reprises
-- ici uniquement en commentaire pour mémoire — rien à rejouer pour elles.
