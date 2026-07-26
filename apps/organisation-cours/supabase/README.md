# Supabase — organisation-cours (étapes 1 et 2 : schéma + RLS + blobs)

Cœur pédagogique en tables relationnelles (enseignants, calendrier, UE,
séquences, séances + partage) ; frais kilométriques, réunions, trames et
notes libres en blobs jsonb (`002-blobs.sql`) — ce sont les modules les plus
nominatifs identifiés par l'audit RGPD, désormais strictement personnels
(`oc_blocs_perso`) plutôt qu'écartés.

## Projet Supabase ciblé

Le projet **`portail`** de l'organisation `btsgpn-kerplouz` (créé, région EU,
inutilisé jusqu'ici). Le quota gratuit Supabase est de **2 projets actifs par
organisation** ; l'org en a déjà 2 (`portail` + Phytoscope) — pas de nouveau
projet possible sans passer en payant. D'où le choix de réutiliser `portail`
avec des tables préfixées **`oc_`**, pour cohabiter proprement avec de futures
apps (Habitats-Gâvres, Habitats-Landes) dans ce même projet.

## Ordre d'application

Dans le **SQL Editor** du projet `portail` (dashboard Supabase) :

1. `schema.sql` — crée les tables `oc_*`.
2. `policies.sql` — active la RLS, crée les policies et la fonction
   `oc_is_active_teacher()`.
3. `002-blobs.sql` — tables `oc_blocs_perso` / `oc_blocs_partages` (notes,
   frais, réunions, trames, ruban...).
4. `003-fk-detacher.sql` — corrige `oc_sequences.ue_id` (`on delete cascade`
   → `on delete set null`), pour que supprimer une UE détache ses séquences
   au lieu de les détruire.
5. `004-durcissement-enseignants.sql` — restreint la lecture du
   trombinoscope : un compte inactif ne voit plus que sa propre ligne.
6. `005-fix-recursion-is-active-teacher.sql` — **indispensable juste après
   `004`** : sans lui, toute lecture déclenche une récursion infinie
   ("stack depth limit exceeded") — `004` fait que la policy de
   `oc_enseignants` appelle une fonction qui relit `oc_enseignants`.
7. `seed-weeks.sql` — peuple `oc_weeks` avec les 40 semaines ISO de l'année
   2026-2027, générées par le même algorithme que le front
   (`buildAcademicWeeks()` dans `app.js`) pour que les ids concordent au
   caractère près.
8. (optionnel, recommandé) `test-rls.sql` — scénarios de vérification, tout
   dans une transaction annulée (`rollback`), ne modifie rien en base.

## Réglage obligatoire côté Auth

Dans **Authentication → Providers → Email**, désactiver **« Confirm email »**.

Pourquoi : l'étape 2 (authentification, à venir) reprend le modèle PhytoScope
— `signInWithPassword`, et en cas d'échec `signUp` automatique à la première
connexion. Si la confirmation par e-mail reste active, ce `signUp` ne connecte
pas immédiatement l'utilisateur (email de confirmation jamais reçu, l'adresse
étant une adresse synthétique `@organisation-cours.local`).

## Activer un compte enseignant

Un compte créé en self-service arrive avec `actif = false` : il ne voit aucune
donnée pédagogique tant qu'il n'est pas activé (garde-fou nécessaire — le
dépôt et donc l'URL de l'app sont publics). Pour activer un enseignant, dans
le **SQL Editor**, en tant que `postgres` (donc RLS non appliquée, pas besoin
de la clé `service_role`) :

```sql
update oc_enseignants set actif = true where identifiant = 'diraisonm';
```

(remplacer par l'`identifiant` réel de l'enseignant concerné). Le flag `actif`
est verrouillé par un trigger côté client (un enseignant ne peut pas se
l'attribuer lui-même) — seule cette voie (SQL Editor / `service_role`)
fonctionne.

## Ce qui n'est PAS dans ce dossier

- **Aucun secret** : ni clé `anon`, ni clé `service_role`, ni `.env`. Ces
  fichiers `.sql` sont publiables sans risque (structure seulement).
- **Aucune donnée réelle** : les identifiants dans `test-rls.sql` sont des
  UUID et noms fictifs, dans une transaction annulée.
- **Le code front** (étape 5) et **le script d'import** du `data.json` legacy
  (étape 4, script ponctuel jamais versionné) — pas encore écrits.
