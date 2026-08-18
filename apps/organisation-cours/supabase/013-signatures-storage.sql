-- ============================================================================
-- organisation-cours — bucket privé pour les signatures scannées (écran 13,
-- Ordre de mission)
-- ============================================================================
-- Une signature scannée est une donnée personnelle sensible : elle ne doit
-- JAMAIS être accessible par une URL publique, ni vivre dans le dépôt git
-- (public). Chaque enseignant dépose la sienne dans son propre dossier du
-- bucket, lu uniquement via une URL signée à durée limitée (voir
-- missionChargerSignature/missionUploaderSignature dans app.js).
--
-- À exécuter dans le SQL Editor du projet Supabase "portail", APRÈS avoir créé
-- le bucket lui-même (le bucket se crée via le tableau de bord — Storage →
-- New bucket — pas en SQL) :
--   1. Storage → New bucket → nom EXACT "oc-signatures" → Public bucket : NON
--      (décoché — c'est ce qui garantit qu'aucune URL directe ne fonctionne
--      sans signature).
--   2. Puis exécuter ce fichier pour poser les policies RLS ci-dessous.
-- ============================================================================

-- Chaque utilisateur ne peut lire/écrire que dans <son propre user_id>/ —
-- le chemin utilisé côté app est toujours "<user_id>/signature.png".
-- (CREATE POLICY IF NOT EXISTS n'existe pas en PostgreSQL — on supprime
-- d'abord une éventuelle policy du même nom, pour pouvoir rejouer ce script
-- sans erreur si besoin.)
drop policy if exists "oc_signatures_lecture_perso" on storage.objects;
create policy "oc_signatures_lecture_perso"
  on storage.objects for select
  using (
    bucket_id = 'oc-signatures'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "oc_signatures_ecriture_perso" on storage.objects;
create policy "oc_signatures_ecriture_perso"
  on storage.objects for insert
  with check (
    bucket_id = 'oc-signatures'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "oc_signatures_maj_perso" on storage.objects;
create policy "oc_signatures_maj_perso"
  on storage.objects for update
  using (
    bucket_id = 'oc-signatures'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "oc_signatures_suppression_perso" on storage.objects;
create policy "oc_signatures_suppression_perso"
  on storage.objects for delete
  using (
    bucket_id = 'oc-signatures'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
