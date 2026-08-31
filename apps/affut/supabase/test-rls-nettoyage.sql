-- Retire le jeu de données jetable posé par test-rls-manuel.sql — à
-- exécuter une fois la vérification terminée.
delete from affut_entrees where numero_id in (90, 91);
delete from affut_numeros where numero in (90, 91);
