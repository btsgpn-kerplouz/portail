# Supabase — affut (Lot 6 + Lot 7 combinés)

Remplace le `localStorage` (`STORAGE_KEY "affut:numeros"`) par Supabase, et
protège la rédaction par authentification dans le même mouvement — décision
du 30/08/2026 : pas d'écriture publique exposée même temporairement (voir
`apps/affut/AVANCEMENT.md`, Lot 6/Lot 7).

## Projet Supabase ciblé

Le projet **`portail`** de l'organisation `btsgpn-kerplouz` — le même
qu'organisation-cours (tables `oc_*`), pas un projet dédié : l'org est au
quota gratuit de 2 projets (`portail` + Phytoscope), un 3e demanderait de
passer payant (voir `apps/organisation-cours/supabase/README.md`). Tables
préfixées **`affut_`** pour cohabiter proprement.

## Ordre d'application

Dans le **SQL Editor** du projet `portail` (dashboard Supabase) :

1. `001-schema.sql` — crée les tables `affut_*`.
2. `002-policies.sql` — active la RLS, crée les policies, les vues
   publiques (`affut_numeros_public`, `affut_entrees_public`) et les
   fonctions `affut_is_active_redacteur()` / `affut_email_autorise()`.
3. `003-compteurs.sql` — fonctions RPC d'incrémentation des compteurs de
   fréquentation (`affut_incrementer_vue_numero`,
   `affut_incrementer_clic_source`), utilisables par `anon`.
4. (optionnel, recommandé) `test-rls-manuel.sql` puis
   `test-rls-nettoyage.sql` — vérification via l'API réelle plutôt qu'en
   SQL Editor : un bloc PL/pgSQL complexe (fonction ou `do $$...$$`) tenté
   ici s'est heurté à un découpage apparent du script sur les
   points-virgules internes par l'éditeur SQL de Supabase, qui casse la
   création de la fonction avant qu'elle ne s'exécute (`function ... does
   not exist` malgré un script syntaxiquement correct). `test-rls-manuel.sql`
   ne contient que des `insert` plats (rien à découper de travers), la
   vérification elle-même se fait ensuite directement sur l'API REST
   (`curl`, clé anon), pas dans le SQL Editor.

## Avant de basculer le front

- **Authentication → Providers → Email → « Confirm email »** : à désactiver,
  sinon un compte fraîchement créé ne peut pas se connecter immédiatement
  (même piège que pour organisation-cours, voir son `js/auth.js`).
- **Liste blanche des e-mails autorisés** : ajouter chaque adresse
  d'enseignant AVANT sa première connexion —
  ```sql
  insert into affut_emails_autorises (email) values ('prenom.nom@etablissement.fr');
  ```
  Sans ça, l'inscription échoue (policy `affut_redacteurs_insert_self`).
- **Activer chaque compte après sa première connexion** — un compte reste
  `actif = false` (donc RLS le bloque partout) tant qu'il n'a pas été
  flippé manuellement :
  ```sql
  update affut_redacteurs set actif = true where user_id = '...';
  -- retrouver l'uuid : select id, email from auth.users;
  ```

## Ce qui reste hors de cette bascule

- **`affut_ingestion_log`** est posée dès maintenant (schéma stable) mais
  restera vide tant que le Lot 8 (Worker d'ingestion automatique) n'existe
  pas.
- **Migration du front** (`apps/affut/index.html` : `loadData()`/
  `saveData()`, écran de connexion, appel aux vues publiques/RPC) n'est
  **pas** couverte par ce dossier SQL — c'est l'étape suivante, une fois ce
  schéma appliqué et vérifié.
