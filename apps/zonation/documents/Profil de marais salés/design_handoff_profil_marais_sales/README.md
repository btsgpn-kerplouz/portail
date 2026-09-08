# Handoff : Profil de zonation des habitats de marais salés

## Overview

Schéma interactif illustrant la position des habitats de marais salés le long d'un profil topographique, de la mer (gauche) à la dune (droite). Il remplace / complète la grille de cases colorées de l'application existante : les mêmes 7 catégories d'habitats, les mêmes numéros de fiches (1 → 19), mais rendus sur un profil dessiné, avec les zones colorées cliquables.

Le dessin du profil provient d'un schéma scientifique scanné (Fig. 6, COLASSE 2019), nettoyé, retourné en miroir horizontal, et redistribué horizontalement pour que chaque habitat occupe exactement 1/7 de la largeur — condition nécessaire pour aligner le profil sur les cases de l'appli.

## About the Design Files

Les fichiers de ce dossier sont des **références de design réalisées en HTML** — un prototype montrant l'apparence et le comportement voulus, **pas du code de production à copier tel quel**.

Le travail attendu est de **recréer ce design dans l'environnement existant de l'application cible** (React, Vue, SwiftUI, Flutter, natif…) en utilisant ses patterns, son design system et ses composants établis. Si l'application n'a pas encore d'environnement front, choisir le framework le plus adapté et y implémenter le design.

Le fichier `Profil-marais-sales.dc.html` est un composant HTML autonome : il s'ouvre directement dans un navigateur pour servir de référence visuelle et comportementale.

## Fidelity

**Haute fidélité (hifi).** Couleurs, tailles de police, géométrie et états sont définitifs. À reproduire fidèlement, en substituant les tokens couleur/typo par ceux du codebase quand des équivalents existent.

Une seule réserve : l'illustration du profil est actuellement un **PNG** (`trait-profil.png`). Voir la section Assets pour la recommandation de production.

## Structure générale

Trois blocs empilés verticalement dans une carte (fond `#fffdf8`, radius 16px, ombre douce, padding 26/28/22px) :

1. **Bandeau des 3 grandes zones** (en haut) — grille 3 colonnes de ratio `2fr 4fr 1fr`
2. **Le profil dessiné** (au centre) — SVG + image raster superposés
3. **Les 7 cases cliquables** (en bas) — grille 7 colonnes égales, collée sous le profil

Puis, sous la carte : une ligne d'état (`← mer` / libellé de sélection / `dune →`) et un paragraphe de source.

Largeur maximale du conteneur : 1500px, centré. Padding de page 44/36/52px, fond `var(--color-bg)` (#f5ead8).

### En-tête de page

- Kicker : « ZONATION DES HABITATS » — 14px, 700, `letter-spacing: 0.14em`, uppercase, couleur `#4a7a4f`
- Titre : « De la vasière à la dune » — 40px, `line-height: 1.1`, police display (Caprasimo dans le design system Organic)

## 1. Bandeau des 3 grandes zones

Grille `2fr 4fr 1fr` — les trois grandes unités écologiques recouvrent respectivement 2, 4 et 1 des 7 habitats.

| Zone | Colonnes couvertes | Fond de l'étiquette | Barre sous l'étiquette | Couleur du texte |
|---|---|---|---|---|
| SLIKKE | habitats 1–2 | `#dfeaf1` | `#3e6f92` | `#2d5875` |
| SCHORRE | habitats 3–6 | `#e2ecdb` | `#4f8035` | `#3c6b2c` |
| CONTACT DUNE | habitat 7 | `#e6dcf0` | `#6d5589` | `#5b4a72` |

Étiquette : padding `7px 4px`, `border-radius: 10px 10px 0 0`, texte centré 13px / 700 / `letter-spacing: 0.13em` / uppercase.
Barre : hauteur 4px, `border-radius: 999px`, `gap` de 5px entre étiquette et barre.

## 2. Le profil

Conteneur `position: relative; overflow: hidden`.

### 2a. L'image du trait

`<img src="trait-profil.png">` en `position: absolute; left: 0; top: -21.13%; width: 100%; height: 112.74%; pointer-events: none`.

Le décalage négatif et le sur-dimensionnement recadrent l'image sur la partie utile du profil. En production, préférer un SVG (voir Assets) et supprimer ces valeurs magiques.

### 2b. Le SVG

`viewBox="0 88 1600 212"`, `width: 100%; height: auto; display: block`.

Le système de coordonnées de référence est **1600 × 300** (le viewBox n'en montre que la bande y = 88 → 300). Toute la géométrie ci-dessous est exprimée dans ce repère.

**Limites des 7 zones**, en x : `0, 228.6, 457.1, 685.7, 914.3, 1142.9, 1371.4, 1600` — soit 1600/7 = 228.571 par zone.

#### Ordre de peinture (important)

1. **Rectangle de marée haute** — `x=0 y=174.5 width=1148 height=126`, `fill: #cfe1ec`, `opacity: 0.6` ; puis une ligne de surface `M0 174.5 H1148`, `stroke: #8fb4ca`, `stroke-width: 1.8`, `opacity: 0.9`, `stroke-linecap: round`.
   Il simule la tranche d'eau à marée haute, montant jusqu'à la fin du haut schorre (x = 1148 ≈ limite de la 5e zone). Il est peint **en premier**, donc les aplats d'habitats le recouvrent : le bleu n'apparaît que sur le fond blanc au-dessus du trait de sol.
2. **Aplats d'habitats** — 7 `<rect>` pleine hauteur, `clip-path: url(#soil7)` (le clip est le polygone du sol, voir plus bas). Un rect par zone, aux limites x listées ci-dessus, `y=0 height=300`.
3. **Symboles de végétation** — voir 2c.

#### Le chemin de clip du sol (`#soil7`)

Polyligne échantillonnée tous les 20px en x, fermée en bas à droite/gauche. Elle correspond au trait de sol du dessin original après redistribution. Valeurs (x, y) :

```
0,269.7  20,269.7  40,268.3  60,264.2  80,259.2  100,256.4  120,253.8  140,252.7
160,250.7  180,250.0  200,247.9  220,244.8  240,242.7  260,242.0  280,239.9
300,237.9  320,235.6  340,233.6  360,229.9  380,227.3  400,224.9  420,221.7
440,219.6  460,215.7  480,210.1  500,203.5  520,197.8  540,195.8  560,197.6
580,193.3  600,190.8  620,189.4  640,188.9  660,189.2  680,189.7  700,189.8
720,189.6  740,188.7  760,186.5  780,185.6  800,184.3  820,181.7  840,180.9
860,180.8  880,181.2  900,182.0  920,181.7  940,181.7  960,180.8  980,180.4
1000,178.7  1020,177.9  1040,177.7  1060,176.5  1080,177.0  1100,175.6
1120,174.5  1140,174.6  1160,170.8  1180,169.3  1200,166.4  1220,164.7
1240,162.4  1260,156.8  1280,154.1  1300,150.8  1320,149.1  1340,148.5
1360,146.7  1380,146.2  1400,146.1  1420,145.7  1440,145.7  1460,143.7
1480,142.5  1500,141.2  1520,139.6  1540,137.7  1560,135.3  1580,133.7  1600,131.4
```
puis `L 1600 300  L 0 300  Z`.

Le chemin exact est présent verbatim dans le fichier HTML — le copier depuis là plutôt que de le retaper.

#### 2c. Symboles de végétation ajoutés

Ajouts au trait noir, **uniquement sur le haut schorre, le très haut schorre et la zone de contact dune** (x > 914) — les zones où le dessin original manquait de matière. Groupe : `fill: none; stroke: #1d1b19; stroke-width: 2; stroke-linecap: round`.

Deux motifs, chacun planté sur le trait de sol :
- **Touffe de graminées** — 3 à 5 brins en courbes quadratiques divergentes depuis un point du sol
- **Ombellifère / plante en rosette** — une tige verticale surmontée de 5 rayons en éventail

La hauteur croît vers la dune (≈ 25px au haut schorre, ≈ 45px au contact dune). Les chemins exacts sont dans le HTML ; ils sont décoratifs et peuvent être reproduits librement tant que le style (trait noir 2px, arrondi, croissance vers la dune) est respecté.

## 3. Les 7 cases cliquables

Grille `repeat(7, 1fr)`, `gap: 0`, `margin-top: -1px` (collée au profil). Chaque case :

- `role="button"`, `tabindex="0"`, gestion `click` + `Enter`/`Space`
- `cursor: pointer`, `padding: 14px 10px 12px`
- Colonne flex, `gap: 12px`, centrée
- `border-right: 1px solid rgba(255,255,255,0.6)` (sauf la dernière)
- Hover : `filter: brightness(1.04)`
- Focus : `outline: 2px solid #2c2a28; outline-offset: -2px`

Contenu de chaque case :
- Une rangée de **pastilles rondes** — `flex-wrap: wrap`, `gap: 6px`, centrée, `min-height: 36px`. Pastille : 36 × 36px, `border-radius: 999px`, fond `#fffdf8`, bordure `2px solid #2c2a28`, texte 17px / 700 centré. La case « Haut schorre » en porte 7 et est limitée à `max-width: 200px` pour forcer le retour à la ligne.
- Le **libellé** — 17px / 600, centré, `line-height: 1.25`, sur deux lignes (`<br>`).

### Les 7 habitats, leurs couleurs et leurs numéros

| # | Habitat | Fond de la case (= aplat du profil) | Numéros de fiches |
|---|---|---|---|
| 1 | Basse slikke | `#b3cbd9` | 1 |
| 2 | Haute slikke | `#c8dae5` | 2, 3 |
| 3 | Bas schorre | `#d7e6cb` | 5 |
| 4 | Moyen schorre | `#bdd8ac` | 6, 9 |
| 5 | Haut schorre | `#a2c88b` | 4, 7, 8, 11, 12, 14, 19 |
| 6 | Très haut schorre | `#e9d9bd` | 17 |
| 7 | Contact schorre/dune | `#dcd0e9` | 13, 15 |

⚠️ **À vérifier côté application** : les numéros 10, 16 et 18 n'ont pas été attribués — ils viennent de la lecture d'une capture d'écran. Confirmer la table complète habitat → numéros de fiches avec la source de données réelle avant implémentation.

Les couleurs de fond des cases sont **identiques** aux aplats correspondants du profil : c'est ce qui rend la lecture verticale évidente. Toute modification doit être faite dans les deux endroits (idéalement une seule source de vérité par habitat).

## Interactions & Behavior

- **Clic sur une case** (ou `Enter`/`Space` au clavier) → sélectionne l'habitat. Un second clic sur la même case désélectionne (comportement toggle).
- **Sélection active** → un cadre est dessiné par-dessus le bloc profil+cases : `position: absolute; top: 0; bottom: 0; left: sel × (100/7)%; width: (100/7)%; border: 3px solid #2c2a28; border-radius: 14px; pointer-events: none; box-shadow: 0 6px 22px rgba(32,30,29,0.18)`.
- **Ligne d'état** — affiche « Cliquez une zone colorée » sans sélection, sinon « `<Nom de l'habitat>` — habitats `<numéros séparés par des virgules>` ».
- Dans l'application réelle, le clic doit vraisemblablement **naviguer vers la ou les fiches d'habitat** correspondantes, ou ouvrir un panneau de détail — le prototype se contente de la mise en évidence. À décider côté produit.
- Les pastilles pourraient elles-mêmes être cliquables (une fiche = une pastille) ; non implémenté dans le prototype.

## State Management

Un seul état : `sel: number | null` — l'index de l'habitat sélectionné (0–6), ou `null`.

Deux tables constantes :
```js
const NAMES = ['Basse slikke', 'Haute slikke', 'Bas schorre', 'Moyen schorre',
               'Haut schorre', 'Très haut schorre', 'Contact schorre/dune'];
const NUMS  = [[1], [2,3], [5], [6,9], [4,7,8,11,12,14,19], [17], [13,15]];
```
Aucun chargement de données. Dans l'appli cible, ces tables devraient provenir du modèle de données existant des habitats.

## Responsive

Le prototype est fluide en largeur (le SVG et la grille suivent le conteneur) mais **conçu pour un affichage large**. Sous ~900px, sept colonnes de 36px de pastilles ne tiennent plus. Pistes pour l'implémentation mobile :
- profil en défilement horizontal, cases synchronisées ;
- ou profil en vue d'ensemble non cliquable + liste verticale des 7 habitats en dessous.

À arbitrer côté produit ; non résolu ici.

## Design Tokens

### Couleurs — habitats
`#b3cbd9`, `#c8dae5`, `#d7e6cb`, `#bdd8ac`, `#a2c88b`, `#e9d9bd`, `#dcd0e9`

### Couleurs — grandes zones
Slikke `#dfeaf1` / `#3e6f92` / texte `#2d5875`
Schorre `#e2ecdb` / `#4f8035` / texte `#3c6b2c`
Contact dune `#e6dcf0` / `#6d5589` / texte `#5b4a72`

### Couleurs — eau
Remplissage `#cfe1ec` à 60% d'opacité ; ligne de surface `#8fb4ca`

### Couleurs — neutres
Fond de page `#f5ead8` (`--color-bg` du design system Organic)
Surface de carte `#fffdf8`
Encre / trait `#2c2a28`, trait des symboles `#1d1b19`
Texte principal `#201e1d`, texte secondaire `#6f6862`, texte de note `#4b453f`
Kicker `#4a7a4f`

### Typographie
Titres : police display du design system (Caprasimo dans Organic) — 40px, `line-height: 1.1`
Corps : Figtree — 18px note, 17px libellés et pastilles (600–700), 16px ligne d'état, 13px étiquettes de zone (700, `letter-spacing: 0.13em`), 14px kicker (700, `letter-spacing: 0.14em`)

### Rayons
Carte 16px (`--radius-lg`) · étiquettes de zone `10px 10px 0 0` · barres et pastilles `999px` · cadre de sélection 14px

### Ombres
Carte : `--shadow-sm` du design system · cadre de sélection : `0 6px 22px rgba(32,30,29,0.18)`

### Espacements
Page 44/36/52px · carte 26/28/22px · gap de colonne de page 24px · gap interne de carte 14px · gap de case 12px · gap de pastilles 6px

## Assets

- **`trait-profil.png`** (3200 × 478, transparent) — le trait du profil. Dérivé du schéma original scanné : niveaux de gris seuillés puis recolorés en `#2c2a28` avec canal alpha, et **étiré zone par zone** (7 segments) pour que les limites d'habitats tombent sur les septièmes.
- **`profil-marais-miroir.png`** (1678 × 239) — étape intermédiaire : le schéma original nettoyé de toutes ses annotations et retourné en miroir, largeurs de zones encore d'origine. Utile si une autre distribution horizontale est souhaitée un jour.
- Source : Fig. 6, COLASSE 2019 — **vérifier les droits de reproduction** avant publication dans l'application.

**Recommandation de production :** faire vectoriser le trait en SVG (ou le redessiner) avant intégration. Un PNG de 3200px de large est lourd, ne se met pas à l'échelle proprement, ne s'adapte pas au mode sombre, et impose les `top: -21.13% / height: 112.74%` du prototype. En SVG, le trait devient un `<path>` du même repère 1600 × 300 que tout le reste, et les valeurs magiques disparaissent.

## Files

- `Profil-marais-sales.dc.html` — le prototype complet (à ouvrir dans un navigateur). Contient tous les chemins SVG exacts.
- `trait-profil.png` — l'illustration du profil utilisée par le prototype
- `profil-marais-miroir.png` — le trait nettoyé avant redistribution horizontale
- `README.md` — ce document
