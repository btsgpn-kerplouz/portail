# Handoff : Coup d'œil — refonte filtres & silhouettes

## Overview
Refonte de l'app de quiz "Coup d'œil" (BTS GPN — reconnaissance visuelle d'espèces).
Deux axes : rendre la filtration (groupe / sous-groupe) plus lisible, et introduire des
silhouettes de groupe (type PhyloPic) dans l'en-tête de sélection.

## About the Design Files
Le fichier `Coup d'oeil - refonte.dc.html` est une **référence de design en HTML** — un
prototype fonctionnel montrant l'apparence et le comportement voulus, pas du code à copier
tel quel. La tâche consiste à **recréer ce design dans l'app existante** (`index.html` +
`quiz-data.js` du dossier `quizz-naturaliste`), en réutilisant ses patterns actuels (vanilla
JS, PWA hors-ligne, polices auto-hébergées), pas dans un nouveau framework.

## Fidelity
**High-fidelity.** Couleurs, typographie, espacements et interactions sont définitifs.
Le prototype tourne sur les vraies données (`quiz-data.js`, ~210 taxons, photos iNaturalist).

## Screens / Views

### 1. Écran de configuration (setup)
Bloc "Filtres" en carte blanche cassée (`#fffefb`) bordée `1px solid #d8d4c6` :
- **Barre puces** : ligne de puces retirables (fond `#9c3d2e`, texte blanc) listant les
  sous-groupes cochés, avec compteur d'espèces et lien "Tout effacer". Si rien n'est coché :
  texte gris "Aucun filtre — les N espèces sont dans le tirage."
- **Colonnes** : grid `240px / 1fr`.
  - Colonne gauche "Groupe" : liste verticale (Tous / oiseaux / plantes / insectes), chaque
    ligne = icône + libellé + compteur ; ligne active en aplat rouille plein `#9c3d2e`.
  - Colonne droite "Sous-groupes" : grille `repeat(auto-fill, minmax(190px,1fr))` de cases à
    cocher (case carrée 18px, coche "✓"), + lien "Tout cocher / Tout décocher" en haut.
  - **Mobile (<700px)** : la grille passe à 1 colonne ; la colonne "Groupe" devient une
    rangée horizontale scrollable au-dessus des sous-groupes.
- **Réglages** (sous le bloc filtres, carte séparée) : trois segmented control côte à côte
  (Difficulté / Chrono / Nombre de questions), chacun avec une phrase d'aide sous le contrôle.
  Un `<details>` "Options d'affichage ▾" replié contient le choix nom fr / sci / les deux.
- **Barre de lancement** : bande sticky en bas, fond `#191b16`, texte récap du tirage +
  bouton "Commencer" (désactivé si <2 espèces dans le pool).

### 2. Écran de quiz
Barre de progression + score, chrono optionnel (barre fine qui se vide), photo 4:3 avec
crédit + lien iNaturalist, liste de choix (max 4), feedback vert/orange après réponse,
boutons Arrêter / Suivant.

### 3. Écran de fin
Score en gros chiffre rouille, liste "À revoir" des espèces manquées, boutons Rejouer /
Nouvelle série.

## Interactions & Behavior
- Toggle sous-groupe : clic sur la case = ajoute/retire du filtre (état dans un objet
  `{ [sousGroupe]: true }`).
- Sélection de groupe : change `grp`, la colonne sous-groupes se recalcule (`Tous` = les
  25 sous-groupes empilés par groupe).
- Puce retirable : clic sur la puce = retire ce sous-groupe du filtre.
- Clavier en jeu : touches `1`–`9` répondent, `Entrée`/`Espace` passe à la question suivante
  une fois répondu.
- Chrono : décompte visuel, temps écoulé = réponse fausse automatique.
- Distracteurs générés selon la difficulté : "Découverte" = familles variées, "Entraînement"
  = même sous-groupe, "Expert" = même genre (repli sur sous-groupe puis groupe si pas assez
  de candidats).

## State Management
- `grp` (groupe sélectionné ou "tous"), `sous` (map des sous-groupes cochés), `diff`,
  `chrono`, `count`, `labelmode`.
- `game` : `{ i, answered, correct, missed[], pool[], options[], answer, photo, done, chosen }`.
- `screen` : `setup` | `quiz` | `end`.

## Design Tokens
- Fond page `#f4f2ec`, carte `#fffefb`, bordures `#d8d4c6` / `#ece8db`.
- Accent rouille `#9c3d2e` (hover `#7f2f22`), header/bandeau noir `#191b16`.
- Texte `#191b16`, gris secondaire `#565a4e` / `#6b6a5e` / `#8a958c`.
- Succès `#1f7a5c`, erreur `#c0562b`.
- Police titres : IBM Plex Serif (600). Police texte/UI : IBM Plex Sans. Police mono
  (labels, compteurs, chrono) : JetBrains Mono. Fichiers `.woff2` dans `fonts/`.
- Pas de radius (coins carrés partout), bordures 1–1.5px pleines.

## Assets
- Icônes de groupe : glyphes Lucide (`bird`, `bug`, stroke-width 2.75) redessinés en SVG
  inline — substituts provisoires à des vrais fichiers PhyloPic (CC0/CC BY) si l'utilisateur
  veut la vraie source PhyloPic + crédit.
- Photos : iNaturalist, chargées en direct via `quiz-data.js` (licences CC0/CC BY/CC BY-SA,
  crédit affiché sous chaque photo).
- Polices : `fonts/ibm-plex-sans.woff2`, `fonts/ibm-plex-serif-bold.woff2`,
  `fonts/jetbrains-mono.woff2` (déjà dans le projet original).

## Files
- `Coup d'oeil - refonte.dc.html` — prototype complet (template + logique) à la racine du
  projet de design. Contient tout le comportement décrit ci-dessus.
- Référence de l'app d'origine à modifier : `index.html` + `quiz-data.js` (dossier
  `quizz-naturaliste` fourni par l'utilisateur).
