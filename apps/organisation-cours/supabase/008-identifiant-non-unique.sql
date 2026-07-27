-- ============================================================================
-- organisation-cours — l'identifiant n'a plus besoin d'être unique
-- ============================================================================
-- La connexion se fait désormais directement par l'adresse e-mail
-- professionnelle (déjà unique côté auth.users), plus par un "identifiant"
-- nom+1re-lettre-du-prénom fabriqué côté client. Ce champ devient purement un
-- libellé interne (affichage/diagnostic) — le garder "unique" ferait échouer
-- l'inscription du 2e enseignant qui produirait le même identifiant (ex.
-- "Éric Dupont" et "Elise Dupont" donnent tous deux "duponte"), alors que
-- leurs adresses e-mail, elles, ne collisionnent jamais.
-- ============================================================================

alter table oc_enseignants drop constraint if exists oc_enseignants_identifiant_key;
