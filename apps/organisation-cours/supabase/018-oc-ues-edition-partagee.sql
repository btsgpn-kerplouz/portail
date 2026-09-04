-- ============================================================================
-- organisation-cours — édition partagée des UE du référentiel
-- ============================================================================
-- Bug remonté par un collègue le 04/09/2026 : « non enregistré oc_ues #ue_13 :
-- modification refusée (droits insuffisants ?) », déclenché en marge d'un
-- enregistrement (chaque clic « Enregistrer » retente TOUT ce qui a changé
-- localement, pas seulement l'écran ouvert — voir sync.js).
--
-- Cause : policies.sql restreint l'UPDATE/DELETE de `oc_ues` (et l'INSERT/
-- DELETE de sa jointure `oc_ue_enseignants`) au créateur de la ligne ou aux
-- enseignant·e·s déjà en jointure — même grammaire que oc_sequences/
-- oc_sessions (contenu personnel d'un·e enseignant·e). Mais les 11 UE du
-- référentiel (UE_REFERENCE, app.js) ne sont PAS un contenu personnel : ce
-- sont les 11 mêmes lignes pour toute l'équipe, recréées automatiquement par
-- mergeReferenceUes() si elles manquent. La première personne à avoir
-- enregistré après le passage à Supabase (étape 3) en est devenue la
-- « créatrice » de fait sur les 11 lignes, verrouillant les autres — un
-- comportement déjà tranché en sens inverse pour "Périodes particulières"
-- (017-oc-constraints-edition-partagee.sql), qui notait alors que les UE
-- restaient volontairement réservées à leurs enseignant·e·s. Décision
-- reconsidérée le 04/09/2026 (discussion Martin) : les UE se comportent en
-- pratique comme ce calendrier partagé (dates, affectations posées par
-- toute l'équipe), pas comme une séquence/séance individuelle — d'où cet
-- alignement, alors que oc_sequences/oc_sessions/oc_reunions et leurs
-- jointures restent, elles, INCHANGÉES (contenu personnel).
--
-- Correctif : `oc_ues` devient éditable/supprimable par n'importe quel
-- compte enseignant actif, à l'image de la lecture (déjà ouverte à tous) ;
-- sa jointure `oc_ue_enseignants` s'aligne (n'importe quel enseignant actif
-- peut ajouter/retirer une affectation), pour lever l'amorçage circulaire
-- (impossible de s'ajouter soi-même tant qu'on n'est ni créateur ni déjà en
-- jointure). `cree_par` est conservé (historique) mais n'est plus vérifié.
-- ============================================================================

drop policy if exists oc_ues_update on oc_ues;
create policy oc_ues_update on oc_ues
  for update
  to authenticated
  using (oc_is_active_teacher())
  with check (oc_is_active_teacher());

drop policy if exists oc_ues_delete on oc_ues;
create policy oc_ues_delete on oc_ues
  for delete
  to authenticated
  using (oc_is_active_teacher());

drop policy if exists oc_ue_enseignants_insert on oc_ue_enseignants;
create policy oc_ue_enseignants_insert on oc_ue_enseignants
  for insert
  to authenticated
  with check (oc_is_active_teacher());

drop policy if exists oc_ue_enseignants_delete on oc_ue_enseignants;
create policy oc_ue_enseignants_delete on oc_ue_enseignants
  for delete
  to authenticated
  using (oc_is_active_teacher());

-- oc_ues_select (déjà ouverte à tout compte actif) et oc_ues_insert
-- (cree_par = auth.uid() sur la ligne insérée elle-même) ne sont pas
-- concernées : inchangées. oc_ue_enseignants_select également inchangée.
