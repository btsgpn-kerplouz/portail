# Product

## Register

product

## Platform

web

## Users

Utilisateurs premiers : les **élèves de BTS GPN** (Kerplouz), sur le terrain comme
en salle. Leur contexte est souvent mobile et extérieur — identifier une
végétation ou un habitat, consulter une clé, saisir un relevé, parfois en plein
soleil, réseau incertain. Le travail à faire : trouver une information fiable ou
enregistrer une donnée de terrain, du premier coup, sans mode d'emploi.

Utilisateurs seconds : les **collègues enseignants**, qui à la fois se servent des
outils et les font vivre (ils co-construisent le dépôt). Le portail doit donc
rester lisible pour un enseignant qui n'a pas suivi la conversation d'origine.

Une même grammaire dessert deux familles d'outils : la **consultation seule**
(Végétations du massif armoricain) et la **saisie multi-utilisateur** (Phytoscope,
identification-habitats, organisation-cours).

## Product Purpose

Réunir plusieurs outils pédagogiques derrière **une seule adresse**, chacun se
mettant à jour **indépendamment**. La réussite ne se mesure pas à l'esthétique
pour elle-même mais à trois choses concrètes : l'utilisateur **se débrouille
seul** (il trouve ou saisit ce qu'il cherche sans aide), les données saisies sont
**fiables** et réutilisables, et l'ensemble **inspire confiance** — au niveau d'une
ressource professionnelle (référence CBNB), jamais d'un projet bricolé.

## Positioning

Des outils de terrain d'un sérieux professionnel, faits par et pour des
enseignants naturalistes — assez rigoureux pour qu'on s'y fie dehors, assez
simples pour qu'on les utilise seul, sans formation. C'est ce que chaque écran
doit réaffirmer : la fiabilité passe avant l'effet.

## Brand Personality

Avant tout **clair, accueillant, pédagogique** : on comprend vite, rien
n'intimide, le sérieux passe par la simplicité plutôt que par la démonstration.
S'y ajoute une **touche vivante et botanique** — couleur végétale assumée, textures
d'atlas, un peu de caractère éditorial — qui donne du relief sans jamais primer
sur l'information. La voix est sobre, précise, en français, de naturaliste de
terrain. L'émotion visée : **confiance et clarté posée**, pas l'enthousiasme
tapageur.

## Anti-references

Ce que le portail et ses apps ne doivent jamais devenir :

- **Le SaaS / dashboard générique** : dégradés violet-bleu, cartes identiques à la
  chaîne, jargon startup — froid, interchangeable, sans lieu ni âme.
- **Le site institutionnel daté** : lourd et administratif, menus surchargés, PDF
  partout, aucune respiration.
- **Le jouet enfantin** : trop coloré, arrondi, ludique — ce qui ferait perdre le
  sérieux attendu d'une ressource naturaliste.
- **La page marketing tape-à-l'œil** : grosses promesses, animations partout,
  boutons qui crient — de l'esbroufe au lieu d'un outil de travail.

## Design Principles

- **Cohérence de structure, variation de couleur.** Même grammaire partout
  (typographie, bandeau texturé, cartes, champs) ; chaque app porte SA couleur via
  `--acc`. Apprendre à lire une app, c'est apprendre à lire les autres.
- **Hub ≠ App.** Le portail se reconnaît au premier coup d'œil : base neutre
  graphite, toutes les couleurs en légende. Une app = une seule couleur + sa
  texture + un retour vers le hub.
- **Lisible par tous, d'abord.** L'inclusion est une contrainte de conception, pas
  une option : glyphes non ambigus, contrastes, lecture au soleil sur mobile.
- **Le sérieux par la sobriété.** La confiance vient de la retenue et de la
  précision (niveau CBNB), jamais de la décoration ni du vernis marketing.
- **Se débrouiller seul.** L'utilisateur trouve ou saisit ce qu'il cherche du
  premier coup, sans formation. La clarté prime sur l'astuce.

## Accessibility & Inclusion

Cible **WCAG AA**, avec l'inclusion posée en priorité assumée de la charte :

- Police **Atkinson Hyperlegible** (I/l/1 et O/0 désambiguïsés), interligne 1.6,
  texte aligné à gauche, chiffres tabulaires — pensé pour les lecteurs
  dyslexiques et confortable pour tous.
- Contrastes contrôlés ; texte courant ≥ 4.5:1. Rendu **clair forcé** (identité
  « papier de terrain », pas de bascule sombre automatique).
- **Terrain** : lisibilité sur mobile en plein soleil, cibles tactiles
  généreuses.
- `prefers-reduced-motion` respecté (déjà neutralisé dans `shared/theme.css`).
