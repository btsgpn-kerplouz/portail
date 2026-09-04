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
   frais, trames, ruban...). Voir `009`/`010` : `devNotes` et `reunions` en
   sont ressortis depuis.
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
8. `006-constraints-contenu.sql` — colonne `contenu jsonb` sur `oc_constraints`
   (texte libre pour les contraintes, même principe que les autres tables).
9. `007-alias-initiales.sql` — table `oc_alias_initiales` (jetons `teacher`
   legacy qui ne correspondent pas exactement aux initiales d'un compte).
10. `008-identifiant-non-unique.sql` — l'`identifiant` n'a plus besoin d'être
    unique depuis que la connexion se fait par e-mail (voir plus bas).
11. `009-devnotes-partage.sql` — « Bugs & améliorations » (`devNotes`) passe de
    `oc_blocs_perso` (privé) à `oc_blocs_partages` (commun à tous les comptes
    actifs) ; `todoNotes` (« À faire ») reste privé, lui.
12. `010-reunions-relationnelles.sql` — `reunions` sort de `oc_blocs_perso`
    (strictement privé) pour devenir une table relationnelle `oc_reunions` +
    jointure `oc_reunion_enseignants` : une réunion n'est visible que de son
    créateur et des enseignants tagués « présents » (pas de tout le monde,
    contrairement aux ue/séquences/séances — cf. AUDIT-RGPD.md sur les noms
    complets du champ `participants`). Migre les réunions déjà enregistrées.
13. `011-fix-recursion-reunions.sql` — **indispensable juste après `010`** :
    sans lui, tout chargement déclenche une récursion infinie
    ("infinite recursion detected in policy for relation oc_reunions"), même
    cause que `005` (les policies SELECT de `oc_reunions` et
    `oc_reunion_enseignants` s'interrogent mutuellement).
14. `012-emails-autorises.sql` — pour la mise en ligne V5.0 : seule une
    adresse e-mail présente dans une liste blanche peut créer un profil
    `oc_enseignants` (donc utiliser l'app) ; voir « Liste blanche d'e-mails
    autorisés » plus bas pour la gérer.
15. (optionnel, recommandé) `test-rls.sql` — scénarios de vérification, tout
    dans une transaction annulée (`rollback`), ne modifie rien en base.
16. `013-signatures-storage.sql` — bucket privé `oc-signatures` (écran 13,
    Ordre de mission). **Le bucket se crée d'abord à la main** (Storage → New
    bucket → nom exact `oc-signatures` → Public bucket : décoché), puis ce
    fichier pose les policies RLS dessus — voir le commentaire en tête du
    fichier pour le détail.
17. `014-fix-inlining-security-definer.sql` — **indispensable** : sans lui,
    toute écriture via l'API REST (ajouter une UE, une séquence, une séance,
    une réunion...) échoue avec "new row violates row-level security policy",
    même avec un compte actif et un jeton valide — voir le commentaire en
    tête du fichier pour le détail (fonctions SQL "simples" inlinées par
    l'optimiseur, mauvaise interaction avec les inserts via `json_to_recordset`).
18. `015-fix-reunions-select-self-reference.sql` — **indispensable juste
    après `014`**, spécifique aux réunions : sans lui, `014` suffit pour
    UE/séquences/séances/contraintes mais pas pour `oc_reunions` (même erreur
    RLS, cette fois seulement au moment du `returning` qui suit l'insert) —
    voir le commentaire en tête du fichier (auto-référence inutile de
    `oc_reunion_est_participant()` dans les policies de `oc_reunions` lui-même).
19. `016-visibilite-collegues.sql` — colonne `oc_enseignants.voir_collegues`
    (défaut `false`) : préférence de compte « voir le contenu de mes
    collègues » (Cas 2 du partage entre comptes). Aucune policy à changer.
20. `017-oc-constraints-edition-partagee.sql` — **à appliquer** : ouvre
    l'UPDATE/DELETE de `oc_constraints` (« Périodes particulières ») à tout
    compte enseignant actif, plus seulement au créateur — l'écran ne
    distingue pas les périodes des collègues comme lecture seule, la RLS ne
    doit donc plus les bloquer.
21. `018-oc-ues-edition-partagee.sql` — **à appliquer** : même correctif que
    `017`, appliqué cette fois aux 11 UE du référentiel (`oc_ues` +
    sa jointure `oc_ue_enseignants`) — plus seulement le créateur/les
    co-enseignant·e·s déjà en jointure, tout compte enseignant actif peut les
    modifier/supprimer et gérer leurs affectations. `oc_sequences`/
    `oc_sessions`/`oc_reunions` et leurs jointures restent, elles, inchangées
    (contenu personnel d'un·e enseignant·e, pas un planning d'équipe).
22. `019-conflit-fusion-entites.sql` — **à appliquer** : `updated_at` de
    `oc_ues`/`oc_sequences`/`oc_sessions`/`oc_reunions`/`oc_constraints` est
    désormais mis à jour automatiquement (trigger) à chaque UPDATE — sans lui
    le nouveau filtre optimiste + fusion de conflit côté `js/sync.js` (bug du
    04/09/2026 : un « Déroulé » de séance co-enseignée écrasé en silence par
    l'enregistrement d'un·e collègue) ne détecterait jamais rien.

## Réglage obligatoire côté Auth

Dans **Authentication → Providers → Email**, désactiver **« Confirm email »**.

Pourquoi : `js/auth.js` fait `signInWithPassword`, et en cas d'échec `signUp`
automatique à la première connexion, avec l'adresse e-mail **professionnelle
réelle** saisie par l'enseignant. Si la confirmation par e-mail reste active,
ce `signUp` ne connecte pas immédiatement l'utilisateur (il faudrait un écran
« vérifiez votre boîte mail », pas encore construit) — le garde-fou réel contre
les inscriptions non désirées reste `actif = false` par défaut, pas la
confirmation d'e-mail.

## Activer un compte enseignant

Un compte créé en self-service arrive avec `actif = false` : il ne voit aucune
donnée pédagogique tant qu'il n'est pas activé (garde-fou nécessaire — le
dépôt et donc l'URL de l'app sont publics). Pour activer un enseignant, dans
le **SQL Editor**, en tant que `postgres` (donc RLS non appliquée, pas besoin
de la clé `service_role`) :

```sql
update oc_enseignants set actif = true
where user_id = (select id from auth.users where email = 'prenom.nom@etablissement.fr');
```

(remplacer par l'adresse e-mail réelle de l'enseignant concerné). Le flag
`actif` est verrouillé par un trigger côté client (un enseignant ne peut pas se
l'attribuer lui-même) — seule cette voie (SQL Editor / `service_role`)
fonctionne.

## Mot de passe oublié

Autonome depuis `008` : chaque enseignant peut cliquer « Mot de passe oublié ? »
sur l'écran de connexion (déclenche `resetPasswordForEmail`, lien envoyé par
Supabase à l'adresse saisie). Aucune intervention de Martin nécessaire dans le
cas courant. En dépannage seulement, un mot de passe peut aussi être forcé
directement en SQL Editor :

```sql
update auth.users
set encrypted_password = crypt('nouveau-mot-de-passe', gen_salt('bf'))
where email = 'prenom.nom@etablissement.fr';
```

## Liste blanche d'e-mails autorisés (mise en ligne V5.0)

Depuis `012-emails-autorises.sql`, seule une adresse e-mail présente dans
`oc_emails_autorises` peut créer un profil `oc_enseignants` — donc utiliser
l'app. Chaque enseignant garde son propre mot de passe (rien ne change côté
`js/auth.js`) ; c'est la **création du compte** qui est protégée, pas un écran
supplémentaire devant l'app. Une adresse hors liste peut encore, techniquement,
créer un compte Supabase "brut" (`auth.users`) — mais n'obtiendra jamais de
ligne `oc_enseignants`, donc jamais d'accès réel à quoi que ce soit.

Volontairement, ce n'est **pas** un déclencheur sur `auth.users` (le schéma
de comptes géré par Supabase, commun à tout le projet "portail" — de futures
apps Habitats pourraient vouloir s'y inscrire librement) : le verrou reste
local à notre propre table `oc_enseignants`, via sa policy RLS d'insertion.

La liste n'est **jamais** commitée (adresses réelles = données personnelles,
dépôt public) : à gérer exclusivement dans le **SQL Editor**, dans une
**nouvelle requête** (pas dans `012-emails-autorises.sql` lui-même, qui ne
contient aucune adresse) :

```sql
-- Autoriser une adresse
insert into oc_emails_autorises (email) values (lower('prenom.nom@etablissement.fr'))
on conflict (email) do nothing;

-- Retirer une adresse (ne désactive pas un compte déjà créé : voir `actif` plus haut)
delete from oc_emails_autorises where email = lower('prenom.nom@etablissement.fr');
```

## Ce qui n'est PAS dans ce dossier

- **Aucun secret** : ni clé `anon`, ni clé `service_role`, ni `.env`. Ces
  fichiers `.sql` sont publiables sans risque (structure seulement).
- **Aucune donnée réelle** : les identifiants dans `test-rls.sql` sont des
  UUID et noms fictifs, dans une transaction annulée.
- **Le code front** (étape 5) et **le script d'import** du `data.json` legacy
  (étape 4, script ponctuel jamais versionné) — pas encore écrits.
