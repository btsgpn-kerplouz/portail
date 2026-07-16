# btsgpn-kerplouz — Portail d'outils pédagogiques (mono-dépôt)

> Conventions **communes** héritées par toutes les apps. Ce fichier est le
> savoir partagé du projet : il est versionné, donc à jour pour tout le monde.
> La mémoire locale de Claude Code ne se partageant pas entre postes, **rien
> d'important ne doit vivre en mémoire — tout vit ici, dans `.claude/` ou `shared/`.**

## But du projet

Regrouper plusieurs outils pédagogiques (BTS GPN — Kerplouz — et collègues
enseignants) derrière **une URL unique**, où **chaque app se met à jour
indépendamment**. Travail collaboratif via Claude Code.

## Décisions d'architecture (actées)

- **Hébergement du front** : statique (HTML/CSS/JS **vanilla, sans build**) sur
  hébergeur gratuit (**Cloudflare Pages** ou **Netlify**), **déploiement
  automatique** à chaque merge. Chaque app = un déploiement indépendant.
- **Données** : **Supabase** (Postgres + Row Level Security + Auth + Storage),
  **région EU**. Service géré → **pas de serveur à administrer**.
- **Portail** : page-hub statique qui liste et lance les apps.
- **Nom d'équipe** (Organisation GitHub + Organisation Supabase + projet
  d'hébergement) : **`btsgpn-kerplouz`**.
- Alternative **VPS écartée** : on ne veut pas devenir administrateur système.

## Les 4 applications

| App | Nature | Données | État |
|---|---|---|---|
| **organisation-cours** | saisie | à migrer vers Supabase | Historique : serveur Node local + fichiers `data/`. **Ne jamais écraser `data/`.** |
| **phytoscope** | saisie · multi-utilisateur | Supabase ✓ | **Modèle de référence** (déjà éprouvé). |
| **vegetations-armoricaines** | consultation seule | aucune | « Végétations du massif armoricain ». **Purement statique** (PWA) : pas de Supabase, pas d'auth. |
| **identification-habitats** | saisie | Supabase | **En cours**, à bâtir sur le modèle Phytoscope. |

## Structure du dépôt

```
CLAUDE.md            <- ce fichier (conventions communes)
.claude/             <- réglages + skills partagés (committés)
shared/              <- design system CSS + helpers + client Supabase
portail/             <- la page-hub
apps/organisation-cours/
apps/phytoscope/
apps/vegetations-armoricaines/
apps/identification-habitats/
```

## Conventions communes

- Front **vanilla, sans étape de build**.
- **Ne jamais écraser ni committer** `apps/organisation-cours/data/`
  (données locales, potentiellement personnelles → RGPD).
- Clé Supabase **`service_role` : jamais dans le front, jamais committée.**
  Seule la clé publique **`anon`** va côté client, protégée par la **RLS**.
- Secrets dans un fichier **`.env`** (ignoré par git), jamais en dur dans le code.
- Données d'élèves **minimisées** ; **région EU** ; **RLS bien configurée**.
- Langue de travail : **français**.

## Workflow git

`git pull` → **créer une branche** → commit/push → **Pull Request** → merge →
**déploiement auto**. **Jamais de push direct sur `main`.** On peut travailler
**une app à la fois** : Claude Code lancé dans un sous-dossier hérite quand même
de ce `CLAUDE.md` racine.

## Deux canaux à ne pas confondre

- **CODE** : se partage via **Git / GitHub** (clone / push / PR).
- **DONNÉES** : se partagent via **Supabase**, en temps réel, indépendamment de Git.

## Modèle de référence

**Phytoscope** (déjà sur Supabase, multi-utilisateur) est le **pilote**.
Aligner les autres apps sur son modèle.
