-- ============================================================================
-- organisation-cours — scénarios de vérification RLS (étape 1)
-- ============================================================================
-- À exécuter dans le SQL Editor du projet Supabase "portail", APRÈS schema.sql
-- et policies.sql. Tout est fait dans une transaction annulée à la fin
-- (`rollback`) : rien de ce test n'est conservé en base.
--
-- Technique : `set local role authenticated` bascule réellement sur le rôle
-- Postgres "authenticated" (le rôle "postgres"/superuser du SQL Editor
-- contourne la RLS, donc simuler seulement le JWT ne suffit pas) ; puis
-- `set local request.jwt.claims` fournit le `sub` (uuid) que `auth.uid()` lit.
--
-- Tout est regroupé dans UN SEUL bloc `do $$ ... $$`, qui affiche chaque
-- résultat via RAISE NOTICE (visible dans l'onglet "Messages"/"Logs" du SQL
-- Editor, sous la grille de résultats). Un essai précédent créait une table
-- normale pour collecter les résultats, mais provoquait une erreur "relation
-- does not exist" dès qu'on y écrivait après un changement de rôle (le SQL
-- Editor de Supabase semble mal gérer un CREATE TABLE suivi d'un accès dans
-- le même script) — RAISE NOTICE ne crée aucun objet, donc pas de problème.
--
-- Pour chaque ligne affichée, "attendu" doit être identique à "obtenu".
-- ============================================================================

begin;

-- Comptes "auth.users" factices, nécessaires pour satisfaire la contrainte de
-- clé étrangère de oc_enseignants.user_id (uniquement dans cette transaction
-- annulée : rien n'est conservé après le rollback final).
insert into auth.users (id) values
  ('00000000-0000-0000-0000-00000000000a'),
  ('00000000-0000-0000-0000-00000000000b'),
  ('00000000-0000-0000-0000-00000000000c');

do $$
declare
  v_bool   boolean;
  v_count  bigint;
  v_room   text;
begin
  -- Deux comptes de test, créés directement en tant que postgres (équivalent
  -- de ce que ferait le self-service, mais sans passer par l'API auth).
  insert into oc_enseignants (user_id, identifiant, nom, prenom, initiales, actif)
  values
    ('00000000-0000-0000-0000-00000000000a', 'test-a', 'Aupetit', 'Anne', 'AA', true),   -- A, ACTIF
    ('00000000-0000-0000-0000-00000000000b', 'test-b', 'Bertin', 'Boris', 'BB', true),   -- B, ACTIF
    ('00000000-0000-0000-0000-00000000000c', 'test-c', 'Colin', 'Claire', 'CC', false);  -- C, INACTIF

  -- Une UE créée par A (en tant que postgres, pour amorcer le scénario).
  insert into oc_ues (id, code, title, promotion, semester, cree_par)
  values ('test-ue-1', 'UE 4.2', 'Test RLS', 'GPN1', 'Semestre 3', '00000000-0000-0000-0000-00000000000a');

  -- Une séance sur cette UE, créée par A.
  insert into oc_sessions (id, title, ue_id, promotion, cree_par)
  values ('test-session-1', 'Séance test', 'test-ue-1', 'GPN1', '00000000-0000-0000-0000-00000000000a');

  -- --------------------------------------------------------------------------
  -- Scénario 1 — un compte INACTIF (C) ne lit aucune donnée pédagogique, mais
  -- voit quand même la liste des enseignants (nécessaire pour les filtres).
  -- --------------------------------------------------------------------------
  set local role authenticated;
  set local request.jwt.claims to '{"sub":"00000000-0000-0000-0000-00000000000c","role":"authenticated"}';

  select oc_is_active_teacher() into v_bool;
  raise notice '1a. C (inactif) est actif ?           attendu=false  obtenu=%', v_bool;

  select count(*) into v_count from oc_ues;
  raise notice '1b. C : nb UE visibles                 attendu=0      obtenu=%', v_count;

  select count(*) into v_count from oc_enseignants;
  raise notice '1c. C : nb enseignants visibles (liste) attendu=3      obtenu=%', v_count;

  reset role;

  -- --------------------------------------------------------------------------
  -- Scénario 2 — lecture entre enseignants ACTIFS (A et B se voient mutuellement).
  -- --------------------------------------------------------------------------
  set local role authenticated;
  set local request.jwt.claims to '{"sub":"00000000-0000-0000-0000-00000000000b","role":"authenticated"}';

  select count(*) into v_count from oc_ues where id = 'test-ue-1';
  raise notice '2.  B (actif) voit l''UE créée par A    attendu=1      obtenu=%', v_count;

  -- --------------------------------------------------------------------------
  -- Scénario 3 — B ne peut PAS modifier la séance de A tant qu'il n'est pas
  -- dans la jointure oc_session_enseignants (mise à jour silencieusement
  -- filtrée, pas d'erreur : la policy exclut la ligne, l'UPDATE porte sur 0
  -- ligne).
  -- --------------------------------------------------------------------------
  update oc_sessions set room = 'Salle B' where id = 'test-session-1';
  select room into v_room from oc_sessions where id = 'test-session-1';
  raise notice '3.  B modifie séance de A (hors jointure) -> room  attendu=NULL  obtenu=%', coalesce(v_room, 'NULL');

  reset role;

  -- Retour en tant que postgres pour ajouter B à la jointure — dans la vraie
  -- appli, c'est A (créateur) qui ferait cet ajout depuis son propre compte,
  -- déjà autorisé par la policy oc_session_enseignants_insert.
  insert into oc_session_enseignants (session_id, enseignant_id)
  values ('test-session-1', '00000000-0000-0000-0000-00000000000b');

  -- --------------------------------------------------------------------------
  -- Scénario 4 — une fois ajouté à la jointure, B PEUT modifier la séance.
  -- --------------------------------------------------------------------------
  set local role authenticated;
  set local request.jwt.claims to '{"sub":"00000000-0000-0000-0000-00000000000b","role":"authenticated"}';

  update oc_sessions set room = 'Salle B' where id = 'test-session-1';
  select room into v_room from oc_sessions where id = 'test-session-1';
  raise notice '4.  B modifie séance de A (après jointure) -> room attendu=Salle B  obtenu=%', coalesce(v_room, 'NULL');

  reset role;

  -- --------------------------------------------------------------------------
  -- Scénario 5 — un enseignant déjà membre de LA jointure d'une UE ne doit PAS
  -- pouvoir s'ajouter à la jointure d'une AUTRE UE dont il n'est ni créateur
  -- ni déjà membre. (Ce scénario aurait détecté un bug d'auto-référence
  -- corrigé dans policies.sql : une sous-requête mal qualifiée —
  -- `where m.ue_id = ue_id` à l'intérieur d'une sous-requête sur
  -- oc_ue_enseignants aliasée `m` — résolvait `ue_id` sur l'alias local au
  -- lieu de la ligne extérieure, transformant le test en tautologie toujours
  -- vraie.)
  -- --------------------------------------------------------------------------
  -- Une 2e UE, créée par A, où B n'a aucun rôle.
  insert into oc_ues (id, code, title, promotion, semester, cree_par)
  values ('test-ue-2', 'UE 4.3', 'Test RLS 2', 'GPN1', 'Semestre 3', '00000000-0000-0000-0000-00000000000a');

  -- B est déjà membre de la jointure de test-ue-1 (ajouté en tant que
  -- postgres) — condition nécessaire pour déclencher l'ancien bug.
  insert into oc_ue_enseignants (ue_id, enseignant_id)
  values ('test-ue-1', '00000000-0000-0000-0000-00000000000b');

  set local role authenticated;
  set local request.jwt.claims to '{"sub":"00000000-0000-0000-0000-00000000000b","role":"authenticated"}';

  begin
    insert into oc_ue_enseignants (ue_id, enseignant_id)
    values ('test-ue-2', '00000000-0000-0000-0000-00000000000b');
    raise notice '5.  B rejoint UE-2 sans lien           attendu=refusé  obtenu=ACCEPTÉ = FAILLE';
  exception
    when insufficient_privilege then
      raise notice '5.  B rejoint UE-2 sans lien           attendu=refusé  obtenu=refusé (OK)';
  end;

  reset role;

  -- --------------------------------------------------------------------------
  -- Scénario 6 — un compte ne peut pas s'auto-activer.
  -- --------------------------------------------------------------------------
  set local role authenticated;
  set local request.jwt.claims to '{"sub":"00000000-0000-0000-0000-00000000000c","role":"authenticated"}';

  update oc_enseignants set actif = true where user_id = '00000000-0000-0000-0000-00000000000c';
  select actif into v_bool from oc_enseignants where user_id = '00000000-0000-0000-0000-00000000000c';
  raise notice '6.  C tente de s''auto-activer -> actif attendu=false  obtenu=%', v_bool;

  reset role;
end $$;

-- Rien de tout ceci n'est conservé.
rollback;
