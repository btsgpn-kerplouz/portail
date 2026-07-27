-- ============================================================================
-- organisation-cours — durcir la lecture du trombinoscope
-- ============================================================================
-- policies.sql ouvrait `oc_enseignants` en lecture à TOUT compte authentifié
-- (`using (true)`), y compris un compte fraîchement créé et encore inactif.
-- Or l'inscription est en self-service, sans confirmation d'e-mail, avec une
-- clé publique dans un dépôt public : n'importe qui pouvait créer un compte
-- juste pour lister noms/prénoms/initiales des enseignants.
--
-- Nouvelle règle : un compte voit toujours SA PROPRE ligne (nécessaire pour
-- afficher l'écran "en attente d'activation"), et ne voit les AUTRES lignes
-- qu'une fois lui-même activé — condition déjà utilisée partout ailleurs.
-- ============================================================================

drop policy if exists oc_enseignants_select on oc_enseignants;

create policy oc_enseignants_select on oc_enseignants
  for select
  to authenticated
  using (
    user_id = auth.uid()
    or oc_is_active_teacher()
  );
