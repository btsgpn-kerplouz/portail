-- ============================================================================
-- affut — jeu de données jetable pour vérifier la RLS via l'API réelle
-- ============================================================================
-- Remplace test-rls.sql (abandonné : le SQL Editor de Supabase semble
-- découper un script sur les points-virgules internes d'un bloc PL/pgSQL
-- complexe, ce qui casse la création de la fonction/du bloc avant qu'elle
-- ne s'exécute). Ici, uniquement des instructions SQL plates, une par une,
-- aucun bloc PL/pgSQL — donc rien à découper de travers.
--
-- 1. Coller et exécuter CE fichier (crée 1 numéro publié + 1 brouillon,
--    3 entrées de test).
-- 2. Dire à Claude Code que c'est fait — il vérifie ensuite depuis son
--    propre terminal, directement sur l'API (clé anon publique, déjà
--    utilisée par PhytoScope/organisation-cours).
-- 3. Exécuter apps/affut/supabase/test-rls-nettoyage.sql pour tout retirer.
-- ============================================================================

insert into affut_numeros (numero, statut, titre, semaine, chapo, collecte, moisson)
values
  (90, 'publie', 'Numéro publié de test', 'semaine 1', 'chapo de test', null, null),
  (91, 'brouillon', 'Numéro brouillon de test', 'semaine 2', '', '{"date":"x","statut":"rapporte"}'::jsonb, '[]'::jsonb);

insert into affut_entrees (id, numero_id, valide, titre, resume, chiffres, blocs, usage_en_cours, source)
values
  ('test1', 90, true, 'Entrée validée, tout visible', 'Résumé qui doit apparaître', '[{"v":"1","l":"test"}]'::jsonb, '{"chiffres": true, "resume": true}'::jsonb, 'note privée qui ne doit JAMAIS sortir', '{"nom":"Source test","domaine":"exemple.fr","date":"1 janvier"}'::jsonb),
  ('test2', 90, true, 'Entrée validée, résumé masqué', 'Ce résumé ne doit PAS sortir côté public', '[]'::jsonb, '{"chiffres": true, "resume": false}'::jsonb, null, '{"nom":"Source test 2","domaine":"exemple.fr","date":"2 janvier"}'::jsonb),
  ('test3', 90, false, 'Entrée NON retenue, ne doit apparaître nulle part côté public', 'peu importe', '[]'::jsonb, '{"chiffres": true, "resume": true}'::jsonb, null, '{"nom":"Source test 3","domaine":"exemple.fr","date":"3 janvier"}'::jsonb);
