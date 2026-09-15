-- ============================================================================
-- organisation-cours — bucket "oc-signatures" partagé entre enseignants
-- ============================================================================
-- Besoin (retours 15/09/2026, Martin) : n'importe quel enseignant actif doit
-- pouvoir rédiger l'ordre de mission d'un·e collègue ET y déposer/afficher SA
-- signature à elle/lui — pas seulement lire une signature déjà présente (une
-- bonne partie des collègues ne dépose jamais rien elle-même, ou n'est pas à
-- l'aise pour le faire).
--
-- Les 4 policies de 013-signatures-storage.sql (lecture/écriture strictement
-- personnelles, `auth.uid() = 1er segment du chemin`) sont donc TOUTES
-- remplacées ici par `oc_is_active_teacher()` — même fonction que le reste de
-- l'appli (voir 005-fix-recursion-is-active-teacher.sql, SECURITY DEFINER,
-- pas de récursion possible ici) : tout compte enseignant actif peut
-- désormais lire/déposer/remplacer/retirer la signature de N'IMPORTE QUEL
-- collègue actif, pas seulement la sienne.
--
-- ⚠️ Ce que ça implique : une signature scannée reste une image, pas une
-- signature électronique qualifiée — elle sert à préremplir le PDF, pas à
-- authentifier juridiquement l'ordre de mission (la signature réelle reste
-- apposée à la main sur le document final). Élargir l'écriture veut dire
-- qu'un compte pourrait en théorie déposer une image à la place de celle
-- d'un·e collègue à son insu — accepté ici (petite équipe de confiance, pas
-- un système de signature légale), à garder en tête si l'usage change.
--
-- À exécuter dans le SQL Editor du projet Supabase "portail", APRÈS
-- 013-signatures-storage.sql (bucket "oc-signatures" déjà créé, non public).
-- Remplace entièrement les 4 policies de 013 (elles sont d'abord supprimées).
-- ============================================================================

drop policy if exists "oc_signatures_lecture_perso" on storage.objects;
drop policy if exists "oc_signatures_lecture_equipe" on storage.objects;
create policy "oc_signatures_lecture_equipe"
  on storage.objects for select
  using (
    bucket_id = 'oc-signatures'
    and oc_is_active_teacher()
  );

drop policy if exists "oc_signatures_ecriture_perso" on storage.objects;
drop policy if exists "oc_signatures_ecriture_equipe" on storage.objects;
create policy "oc_signatures_ecriture_equipe"
  on storage.objects for insert
  with check (
    bucket_id = 'oc-signatures'
    and oc_is_active_teacher()
  );

drop policy if exists "oc_signatures_maj_perso" on storage.objects;
drop policy if exists "oc_signatures_maj_equipe" on storage.objects;
create policy "oc_signatures_maj_equipe"
  on storage.objects for update
  using (
    bucket_id = 'oc-signatures'
    and oc_is_active_teacher()
  );

drop policy if exists "oc_signatures_suppression_perso" on storage.objects;
drop policy if exists "oc_signatures_suppression_equipe" on storage.objects;
create policy "oc_signatures_suppression_equipe"
  on storage.objects for delete
  using (
    bucket_id = 'oc-signatures'
    and oc_is_active_teacher()
  );
