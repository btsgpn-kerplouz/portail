---
name: btsgpn-kerplouz — Papier technique froid
description: Design system commun des outils pédagogiques de terrain (BTS GPN — Kerplouz).
colors:
  ink: "#191b16"
  page: "#f4f2ec"
  page-chantier: "#f7f5ee"
  card: "#fffefb"
  neutre-sombre: "#343830"
  line: "#d8d4c6"
  line-soft: "#ece8db"
  line-chantier: "#c2beac"
  text-2: "#565a4e"
  text-3: "#6b6a5e"
  text-4: "#8a958c"
  acc-phytoscope: "#1f6b45"
  acc-vegetations: "#b5651d"
  acc-habitats-gavres: "#0b5f7d"
  acc-habitats-landes: "#6f4478"
  acc-organisation: "#23458c"
  acc-affut: "#8a2f39"
  acc-quizz-naturaliste: "#6d3a5d"
  status-chantier: "#8a5f17"
  status-valide: "#1f7a5c"
  status-invalide: "#c0562b"
  status-reserve: "#7a5b16"
typography:
  serif:
    fontFamily: "IBM Plex Serif, Georgia, serif"
    usage: "Titres (bandeau, nom d'app, titre de carte). Absente des apps qui n'en ont pas besoin (organisation-cours)."
  sans:
    fontFamily: "IBM Plex Sans, system-ui, sans-serif"
    usage: "Interface, paragraphes, boutons. La police de tous les jours."
  mono:
    fontFamily: "JetBrains Mono, ui-monospace, monospace"
    usage: "Repères ou données comptées uniquement : statuts, chiffres, étiquettes, décomptes. Jamais du texte courant."
rounded:
  default: "0"
  exceptions: "aucune au niveau système ; une app peut garder des exceptions étroites et documentées (ex. PhytoScope : puces rondes, case de légende 3px, bande d'écart-type 6px) — jamais une carte, un bouton ou un champ."
spacing:
  tuile: "16px 18px (bureau) · 14px 15px (mobile)"
  corps: "26px 32px 30px (bureau) · 16px 16px 22px (mobile)"
components:
  button-primary:
    backgroundColor: "{colors.acc-*}"
    textColor: "#ffffff"
    typography: "sans, 700"
    rounded: "0"
    padding: "0.6rem 1rem"
  button-ghost:
    backgroundColor: "#ffffff"
    textColor: "{colors.acc-*}"
    typography: "sans, 700"
    rounded: "0"
    padding: "0.6rem 1rem"
  input:
    backgroundColor: "#ffffff"
    textColor: "{colors.ink}"
    typography: "sans"
    rounded: "0"
    padding: "0.6rem 0.75rem"
    height: "2.6rem"
  card:
    backgroundColor: "{colors.card}"
    rounded: "0"
    border: "1px solid {colors.line}"
  banner:
    backgroundColor: "{colors.ink}"
    textColor: "#f4f2ec"
    accentTreatment: "filet de tête ~5px dans la couleur de l'app — jamais un aplat"
---

# Design System: btsgpn-kerplouz — Papier technique froid

> Remplace entièrement l'ancienne charte « Atlas naturaliste » (coins arrondis, ombres
> douces, Atkinson Hyperlegible, textures canvas par bandeau, fond sauge). Ce document
> décrit désormais le **seul système de référence** pour tout ajout ou modification visuelle.
> État de la migration app par app : voir le tableau des applications dans `CLAUDE.md`
> (une app peut ne pas encore être passée sur ce système — ce n'est pas une variante
> acceptée, c'est une dette à résorber).

## 1. Overview

**Registre : le papier technique**, pas l'atlas illustré. On vise l'objet qu'un
enseignant ou un élève de terrain reconnaît déjà — fiche de relevé, carnet de
laboratoire, feuille de calcul imprimée : angles droits, encre franche, aucune
décoration qui ne porte pas d'information. La rigueur du rendu doit rassurer avant
même d'être lue.

Ce système **retire** ce que la charte précédente mettait en avant : plus de coins
adoucis, plus d'ombres, plus de texture de bandeau (canvas), plus de dégradé
décoratif. Ce qui reste pour distinguer une app d'une autre : **une seule couleur
d'accent**, posée avec parcimonie (filet, bouton, lien) — jamais en aplat de fond.

**Key Characteristics:**
- Angle droit **partout**, sans exception au niveau système.
- Aucune ombre portée, aucune élévation au survol — la profondeur se lit au filet
  et à l'empilement des fonds (page → carte), pas à un flou.
- Aucun dégradé décoratif, aucune texture de bandeau. Le bandeau est un **aplat encre**.
- Une couleur d'app **en filet et en accent d'action**, jamais en bandeau plein.
- Trois polices, trois emplois stricts : Serif = titres, Sans = interface, Mono =
  repères/données comptées.
- Glyphes-caractères pour les micro-interactions (`⌕ ✕ ▾ ▸ ✓`) plutôt que des icônes
  dessinées, quand un texte suffit.

## 2. Colors

Une base de neutres **froids et encrés**, commune à tout le dépôt, sur laquelle
chaque app pose **une seule couleur franche** en usage restreint (filet, action),
jamais en fond dominant.

### Neutrals
- **Encre** (`#191b16`) : bandeau plein, filet de section, texte principal.
- **Fond** (`#f4f2ec`) : fond de page, sert aussi d'« encre claire » sur le bandeau.
- **Fond chantier** (`#f7f5ee`) : élément qui n'existe pas encore (tuile, état vide).
- **Carte** (`#fffefb`) : fond des cartes et panneaux, quasi blanc.
- **Neutre sombre** (`#343830`) : fond d'un bloc à part (ex. bloc « réservé aux
  enseignants » du portail) — pas une couleur d'app.
- **Filet** (`#d8d4c6`) / **filet interne** (`#ece8db`) : bordures et séparateurs.
- **Filet chantier** (`#c2beac`, 1px pointillé) : ce qui n'existe pas encore.
- **Texte 2/3/4** (`#565a4e` / `#6b6a5e` / `#8a958c`) : hiérarchie de texte secondaire,
  du paragraphe au placeholder — jamais plus clair que `#8a958c`.

### Accent d'app (une couleur, un usage restreint)
Roster actuel : PhytoScope vert `#1f6b45` · Végétations ocre `#b5651d` ·
Habitats-Gâvres sarcelle `#0b5f7d` · Habitats-Landes mauve `#6f4478` · Organisation
des cours bleu `#23458c` · À l'affût bordeaux `#8a2f39` · Quizz naturaliste prune
sombre `#6d3a5d`. Chaque app garde la liberté de nuances internes
supplémentaires (ex. couleurs de série de relevés en PhytoScope) tant qu'elles ne
concurrencent pas l'accent identitaire.

### Statuts (sémantiques, indépendants de l'accent d'app)
- **En chantier** : ambre `#8a5f17` — la seule couleur de statut à s'afficher en plein
  (badge, filet pointillé). « En service » n'a **pas** de couleur dédiée : encre claire
  + filet suffisent, éventuellement un préfixe `✓`.
- **Validé / cohérent** `#1f7a5c` · **Non validé / incohérent** `#c0562b` ·
  **Incertain / avertissement** `#7a5b16` — vocabulaire commun aux apps de saisie qui
  en ont besoin (PhytoScope : critère flore, zone humide…).

### Named Rules
**La règle d'une seule voix.** Une app ne porte qu'**une** couleur franche. Elle
habille des surfaces **étroites** : filet de tête (~5px), bouton d'action, lien,
liseré — jamais un bandeau ou une carte en aplat plein, **sauf** la tuile d'une app
« en service » sur la grille du portail (seul endroit où l'accent occupe tout un fond,
précisément parce que c'est le repère qui dit « ça, ça s'ouvre »).

**La règle du bandeau neutre.** Le bandeau (hub et apps) est un **aplat encre**
(`#191b16`) partout. Ce n'est plus la couleur d'app qui distingue une app dans son
bandeau, mais un **filet de tête** fin (~5px) à son accent — parfois deux couleurs de
filet dans une même app pour distinguer deux espaces internes (ex. PhytoScope : vert
en espace pédagogique, brun en espace Admin).

**La règle du fond froid.** Le fond de page reste un neutre clair choisi (`#f4f2ec`),
jamais un fond sombre par défaut — pas de bascule sombre automatique.

## 3. Typography

**Titres :** IBM Plex Serif (avec fallback Georgia, serif) — 400/600.
**Interface / corps :** IBM Plex Sans (avec fallback system-ui, sans-serif) — 400–700.
**Repères / données comptées :** JetBrains Mono (avec fallback ui-monospace,
monospace) — 400/500/700.

**Character :** un appariement classique presse technique — serif pour le titre qui
identifie, sans humaniste pour tout ce qu'on lit en continu, mono pour tout ce qui se
compte ou se compare d'un coup d'œil. Une app sans besoin de titre éditorial (ex.
organisation-cours) peut se passer du Serif : deux polices suffisent, jamais moins.

### Named Rules
**La règle des trois emplois.** Mono ne sert **jamais** de texte courant ni de titre —
seulement statuts, chiffres, étiquettes de section, décomptes, en capitales avec un
`letter-spacing` généreux (0.08–0.2em selon le repère). Serif ne sert **jamais** à un
paragraphe. Un nom d'espèce ou un terme scientifique reste en **italique** dans la
police du corps, pas en serif.

**Chiffres.** Toujours en Mono, alignés à droite dans les tableaux, décimales à la
**virgule**.

## 4. Forms & Elevation

Système **strictement plat**. `border-radius: 0` partout, sans exception au niveau
système — angle droit sur boutons, champs, cartes, badges, cadres de pictogramme.
**Aucune ombre portée**, nulle part, y compris au survol : c'est une règle absolue,
pas une valeur par défaut modulable. La seule exception tolérée à « aucune ombre » est
le **halo de focus clavier** (`box-shadow: 0 0 0 3px` de l'accent à faible opacité) —
un signal d'accessibilité, pas une décoration.

**Comment se lit alors la profondeur ?** À l'empilement des fonds (page `#f4f2ec` →
carte `#fffefb`) et au filet (`1px #d8d4c6`), jamais au flou. Au survol d'un élément
cliquable (tuile, carte), pas de levée ni d'assombrissement générique imposé : un
filet qui fonce ou un très léger assombrissement du fond, dans l'esprit du système —
à trancher à l'implémentation, jamais une ombre ni une translation.

**Aucun dégradé décoratif, aucune texture.** Les seuls dégradés tolérés sont
fonctionnels et documentés par l'app qui en a besoin (ex. jauges d'humidité/ratio en
PhytoScope, avec des arrêts exacts) ou le liseré hachuré d'une tuile « en chantier »
sur le portail (`repeating-linear-gradient`). Le moteur de texture canvas de l'ancien
système (bandeau illustré par app) est **abandonné** : le bandeau est un aplat.

## 5. Components

### Banner
Aplat **encre plein** (`#191b16`), commun au hub et à toutes les apps — plus de
couleur de bandeau par app. Texte clair (`#f4f2ec`, ou ses opacités `.66`/`.86` pour
un repère/un paragraphe). Une app pose son identité par un **filet de tête** fin
(~5px, sa couleur d'accent), pas par un aplat. Aucune texture, aucun scrim.

### Portal tool tiles
Seul endroit du système où l'accent d'une app occupe un fond plein : la tuile d'une
app « en service » sur la grille du portail. Une app « en chantier » n'a **jamais**
de fond plein — bordure pointillée (`1px dashed #c2beac`) + liseré latéral hachuré
(6px, pleine hauteur) dans sa couleur, pas de bouton « Ouvrir ». Toute la tuile est le
lien ; une tuile en chantier est un `<article>`, pas un `<a>`.

### Cards / Containers
Fond `#fffefb`, bordure 1px `#d8d4c6`, angle droit. Pas d'ombre au repos ni au
survol (voir §4). Padding généreux (~16–18px bureau, cibles tactiles ≥ 44px en
mobile).

### Buttons
Angle droit. **Primaire** : fond à l'accent de l'app, texte blanc, 700. **Fantôme** :
fond blanc, texte à l'accent, même bordure. Survol : assombrissement (`filter:
brightness`), jamais de levée ni d'ombre.

### Inputs / Fields
Fond blanc, bordure 1px filet, angle droit, hauteur min. 2.6rem (cible tactile).
Focus : bordure à l'accent + halo (seule ombre du système). Placeholder en
`text-4` (`#8a958c`) — jamais plus clair.

### Status
Badge plein pour un statut sémantique (« en chantier », « validé »…), texte blanc,
angle droit. « En service » n'a pas de badge dédié : encre claire + filet suffisent.

### Navigation
Retour au hub (`‹ Portail`) présent dans toutes les apps, absent du portail — en mono
minuscule, sur le bandeau encre. Glyphes-caractères (`⌕ ✕ ▾ ▸ ▴ ⬇ ✓ !`) plutôt que des
icônes dessinées quand un caractère suffit à porter le sens ; un pictogramme SVG
inline (grille 24×24, `stroke-width:1.6`) seulement quand un dessin est nécessaire
(ex. identité d'une app sur le portail) — jamais une image bitmap ni un jeu d'icônes
importé.

## 6. Do's and Don'ts

### Do:
- **Do** garder l'angle droit **sans aucune exception** au niveau du système commun.
- **Do** poser l'accent d'une app en usage **restreint** (filet, bouton, lien) —
  jamais en aplat de bandeau ou de carte (exception : tuile « en service » du portail).
- **Do** garder le bandeau en aplat **encre**, identique au hub et à toutes les apps.
- **Do** réserver Mono aux repères/chiffres, Serif aux titres, Sans à tout le reste.
- **Do** lire la profondeur au filet et à l'empilement des fonds, jamais à l'ombre.
- **Do** viser des contrastes francs (texte courant ≥ 4.5:1) et des cibles tactiles
  ≥ 44px.

### Don't:
- **Don't** arrondir quoi que ce soit au niveau système : pas de coin adouci sur un
  bouton, une carte, un champ, un badge.
- **Don't** ajouter une ombre portée, même discrète, même au survol — la seule
  exception est le halo de focus clavier.
- **Don't** ajouter de dégradé décoratif ni de texture de bandeau (le moteur canvas
  de l'ancienne charte est abandonné).
- **Don't** remplir le bandeau d'une app avec sa couleur d'accent : c'est l'aplat
  encre + un filet de tête qui portent l'identité désormais.
- **Don't** mettre deux accents concurrents sur un même écran.
- **Don't** utiliser Mono pour du texte courant ou Serif pour un paragraphe.
- **Don't** verser dans le SaaS/dashboard générique, le site institutionnel daté, le
  jouet enfantin ou la page marketing tape-à-l'œil — voir `PRODUCT.md` §Anti-references.
