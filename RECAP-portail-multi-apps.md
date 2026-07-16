# Portail d'outils pédagogiques (multi-apps) — récap de démarrage

> Fichier de passation à coller / conserver au démarrage d'une nouvelle
> conversation dans le futur dossier du **mono-dépôt du portail**.
> Il est auto-suffisant : aucune connaissance de la conversation d'origine
> n'est nécessaire. À terme, ce contenu a vocation à devenir le `CLAUDE.md`
> racine du projet (le savoir commun doit vivre dans des fichiers versionnés,
> pas en mémoire locale de Claude).

## But du projet

Regrouper plusieurs outils pédagogiques (BTS GPN + collègues enseignants)
derrière **une page web / URL unique**, accessible à plusieurs enseignants,
où **chaque app se met à jour indépendamment**. Travail collaboratif via
Claude Code.

## Les 4 applications à intégrer

| App | Nature | Données | État |
|---|---|---|---|
| **Organisation de cours** | saisie | à migrer vers Supabase | En LOCAL aujourd'hui (serveur Node natif + front vanilla + persistance fichiers `data/`). Règle héritée : **ne jamais écraser `data/`**. |
| **Phytoscope** | saisie · multi-utilisateur | **Supabase — déjà en place ✓** | Sert de **pilote / modèle de référence** (modèle déjà éprouvé). |
| **Végétations de l'Ouest** | consultation seule | **aucune** | Document interactif, aucune saisie → **purement statique**, pas de Supabase, pas d'auth. |
| **Identification d'habitats** | saisie | Supabase | **En cours d'élaboration** ; à construire sur le même modèle que Phytoscope. |

## Architecture retenue (recommandée)

- **Front statique** (HTML/JS vanilla, sans build) hébergé sur un hébergeur
  statique gratuit (**Cloudflare Pages** ou **Netlify**), **déploiement
  automatique** à chaque push/merge. Chaque app = un déploiement indépendant.
- **Données via Supabase** (Postgres + Row Level Security + Auth + Storage),
  **région EU**. Supabase = service géré → **pas de serveur à administrer**.
- **Portail** = une page-hub statique qui liste et lance les apps.
- **Alternative écartée pour l'instant** : VPS + Caddy (plus de contrôle mais
  on devient administrateur système).

## Organisation du code & collaboration

- **UN mono-dépôt GitHub**, sous une **Organisation GitHub** — comptes
  individuels de chaque enseignant, **pas d'identifiants partagés**. Idem
  **Supabase** : Organisation avec membres individuels, pas de login commun.
- Structure cible du dépôt :

  ```
  CLAUDE.md            <- conventions COMMUNES (héritées par toutes les apps)
  .claude/             <- réglages + skills partagés (committés)
  shared/              <- design system CSS + helpers + client Supabase
  portail/             <- la page-hub
  apps/organisation-cours/
  apps/phytoscope/
  apps/vegetations-ouest/
  apps/identification-habitats/
  ```

- **Workflow** : `git pull` → branche → commit/push → Pull Request → merge →
  déploiement auto. On peut travailler **une app à la fois** : Claude Code
  lancé dans un sous-dossier **hérite quand même du `CLAUDE.md` racine**.

## À savoir sur Claude Code

- La **mémoire de Claude est locale** à chaque poste et par dossier : elle
  **ne se partage pas** entre enseignants. Donc tout le savoir commun
  (conventions, décisions d'archi) doit vivre dans des **fichiers versionnés**
  (`CLAUDE.md`, `.claude/`, `shared/`), **jamais en mémoire**.

## Deux canaux distincts (à ne pas confondre)

- **CODE** : se partage via **Git/GitHub** (clone / push / PR).
- **DONNÉES** : se partagent via **Supabase**, en temps réel, indépendamment
  de Git.

## Sécurité / RGPD

- **Région EU**. Sécurité des données par **Row Level Security** bien configurée.
- Clé Supabase **`service_role` jamais dans le front** ni committée.
- Données d'élèves **minimisées** ; vérifier les règles de l'établissement.

## Prochaines étapes envisagées

1. Trancher l'hébergement (**static + Supabase** recommandé vs VPS).
2. Créer l'**Organisation GitHub** + l'**Organisation Supabase**.
3. Faire le **portail statique** (la page-hub).
4. **App pilote** : Phytoscope valide déjà le modèle → aligner les autres dessus.

## Schéma d'architecture (visuel)

<https://claude.ai/code/artifact/31e4bfaa-f326-4def-bfe4-797980854dce>
