# Supabase — organisation-cours (étape 1 : schéma + RLS)

Cœur pédagogique uniquement (enseignants, calendrier, UE, séquences, séances +
partage). Frais kilométriques, réunions, trames et notes libres sont reportés
à une étape ultérieure — voir `../AUDIT-RGPD.md`.

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
3. (optionnel, recommandé) `test-rls.sql` — scénarios de vérification, tout
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
