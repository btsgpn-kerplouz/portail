---
name: btsgpn-kerplouz — Atlas naturaliste
description: Design system commun des outils pédagogiques de terrain (BTS GPN — Kerplouz).
colors:
  accent: "#2b3a40"
  house-graphite: "#2b3a40"
  acc-phytoscope: "#2e7d4f"
  acc-vegetations: "#c2662f"
  acc-habitats-gavres: "#0f7aa0"
  acc-habitats-landes: "#7d4f83"
  acc-organisation: "#8a6d3d"
  page: "#e2e7e0"
  surface: "#f2f5ef"
  panel: "#fbfcf9"
  ink: "#141d17"
  muted: "#55605a"
  faint: "#8a958c"
  line: "#d0d9ce"
  line-soft: "#e0e6dd"
  soft: "#e7ebe3"
  status-live: "#2e7d4f"
  status-wip: "#a9772a"
typography:
  display:
    fontFamily: "Atkinson Hyperlegible, system-ui, sans-serif"
    fontSize: "clamp(1.8rem, 4.6vw, 2.7rem)"
    fontWeight: 700
    lineHeight: 1.12
    letterSpacing: "-0.015em"
  title:
    fontFamily: "Atkinson Hyperlegible, system-ui, sans-serif"
    fontSize: "1.04rem"
    fontWeight: 700
    lineHeight: 1.12
    letterSpacing: "-0.015em"
  body:
    fontFamily: "Atkinson Hyperlegible, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
  label:
    fontFamily: "Atkinson Hyperlegible, system-ui, sans-serif"
    fontSize: "0.9rem"
    fontWeight: 700
    lineHeight: 1.4
    letterSpacing: "normal"
  mono:
    fontFamily: "JetBrains Mono, ui-monospace, monospace"
    fontSize: "0.66rem"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "0.03em"
    fontFeature: "tabular-nums slashed-zero"
rounded:
  sm: "11px"
  card: "12px"
  md: "16px"
  pill: "999px"
spacing:
  xs: "0.45rem"
  sm: "0.9rem"
  md: "1rem"
  body: "clamp(1.2rem, 3vw, 1.7rem)"
  banner: "clamp(1.5rem, 3.6vw, 2.3rem)"
components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "#ffffff"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: "0.58rem 1rem"
  button-ghost:
    backgroundColor: "#ffffff"
    textColor: "{colors.accent}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: "0.58rem 1rem"
  input:
    backgroundColor: "#ffffff"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.sm}"
    padding: "0.6rem 0.75rem"
    height: "2.6rem"
  card:
    backgroundColor: "{colors.panel}"
    rounded: "{rounded.card}"
    padding: "0"
  tool-band:
    backgroundColor: "{colors.accent}"
    textColor: "#ffffff"
    typography: "{typography.title}"
    padding: "0.6rem 0.9rem"
  chip:
    backgroundColor: "#ffffff"
    textColor: "{colors.muted}"
    typography: "{typography.mono}"
    rounded: "{rounded.pill}"
    padding: "0.16rem 0.5rem"
---

# Design System: btsgpn-kerplouz — Atlas naturaliste

## 1. Overview

**Creative North Star: "La clé de détermination"**

Le système se lit comme une clé de détermination : chaque écran conduit
l'utilisateur, pas à pas, vers la bonne réponse. On ne cherche pas à
impressionner, on cherche à faire trouver. La grammaire est identique partout —
même bandeau, mêmes cartes, mêmes champs — de sorte qu'apprendre à lire une app,
c'est apprendre à lire les autres. Ce qui change d'un outil à l'autre n'est jamais
la structure, seulement **une couleur franche** et **une texture thématique**.

L'ambiance est celle d'un **papier de terrain** : fond clair, jamais de bascule
sombre automatique, contrastes francs, lisibilité au soleil. Le sérieux vient de
la retenue, pas du vernis. C'est un outil qui doit inspirer confiance au niveau
d'une ressource professionnelle (référence CBNB), tenu par des enseignants
naturalistes, pour des élèves qui doivent **se débrouiller seuls**.

Ce système **rejette** explicitement : le SaaS/dashboard générique (dégradés
violet-bleu, cartes clonées, jargon startup) ; le site institutionnel daté
(menus surchargés, PDF partout) ; le jouet enfantin (trop coloré, trop arrondi) ;
et la page marketing tape-à-l'œil (animations partout, boutons qui crient).

**Key Characteristics:**
- Cohérence de structure, variation de couleur (une couleur franche par app).
- Papier de terrain : clair forcé, contrastes contrôlés, lisible dehors.
- Inclusion posée en contrainte de conception, pas en option.
- Retenue : la confiance passe par la sobriété, jamais par la décoration.
- Guidage : chaque écran mène à l'action ou à l'information suivante.

## 2. Colors

Une palette de **neutres froids « papier »** sur laquelle chaque app pose **une
seule couleur franche**, choisie dans une gamme naturelle et botanique.

### Primary
- **Couleur d'app (`--acc`)** (variable, défaut #2b3a40) : la couleur signature de
  chaque outil. Elle habille le bandeau (à plat, sous la texture), les boutons,
  les liens, les bandeaux de carte, l'anneau de focus. **Une app = une seule
  couleur.** Le roster actuel : Phytoscope vert phytosociologue (#2e7d4f),
  Végétations orange brûlé (#c2662f), Habitats-Gâvres bleu littoral (#0f7aa0),
  Habitats-Landes prune de lande (#7d4f83), Organisation ocre (#8a6d3d).

### Secondary
- **Graphite du hub (`--house`)** (#2b3a40) : le neutre du **portail** uniquement.
  Il n'appartient à aucune app ; c'est ce qui fait qu'on reconnaît le hub au
  premier coup d'œil. Sur le portail, toutes les couleurs d'app apparaissent en
  légende, jamais en aplat dominant.

### Tertiary
- **Vert « en ligne »** (#2e7d4f) et **ambre « en chantier »** (#a9772a) : couleurs
  **sémantiques** de statut (`.status.live` / `.status.wip`), indépendantes de
  l'accent de l'app. Elles disent un état, pas une identité.

### Neutral
- **Page** (#e2e7e0) : fond général, neutre franchement froid (pas de crème).
- **Surface** (#f2f5ef) : cadres et enveloppes.
- **Panneau** (#fbfcf9) : fond des cartes, quasi blanc.
- **Encre** (#141d17) : texte principal, très foncé (contraste ~13:1 sur panneau).
- **Estompé** (#55605a) : texte secondaire.
- **Ténu** (#8a958c) : texte tertiaire, placeholders, désactivé.
- **Filet** (#d0d9ce) / **filet doux** (#e0e6dd) : bordures et séparateurs.
- **Aplat doux** (#e7ebe3) : fonds discrets (ghost survolé, désactivé).

### Named Rules
**La règle d'une seule voix.** Une app ne porte qu'**une** couleur franche.
Deux accents concurrents sur un même écran sont interdits — la couleur sert à
identifier l'outil et à guider l'œil, pas à décorer.

**La règle Hub ≠ App.** Le portail est graphite + couleurs en légende ; une app
est monochrome + sa texture + un retour `‹ Portail`. Ne jamais teinter le hub
avec la couleur d'une app, ni priver une app de sa couleur.

**La règle du fond froid.** Le fond de page est un neutre froid choisi (#e2e7e0).
Jamais de crème, beige, sable ou parchemin : la chaleur, s'il en faut, vient de
l'accent d'app, pas du fond.

## 3. Typography

**Display / Body Font:** Atkinson Hyperlegible (avec fallback system-ui, sans-serif)
**Label / Mono Font:** JetBrains Mono (avec fallback ui-monospace, monospace)

**Character:** un appariement sur axe de contraste (humaniste inclusive + mono
technique), jamais deux sans-serifs voisines. Atkinson désambiguïse les glyphes
piégeux (I/l/1, O/0) : c'est le choix d'inclusion qui aide les lecteurs
dyslexiques et le confort de tous. JetBrains Mono, en petit, porte les repères
« machine » : statuts, compteurs, pastille de signature, chiffres tabulaires.

### Hierarchy
- **Display** (700, clamp(1.8rem, 4.6vw, 2.7rem), 1.12) : titre de bandeau, en
  blanc cassé (#f4f8f4) sur l'accent foncé, avec ombre portée légère.
- **Title** (700, ~1.04rem, 1.12) : titres de carte (`.tool-band h3`), titres de
  section dans le corps.
- **Body** (400, 1rem, 1.6) : texte courant. Interligne 1.6, aligné à gauche,
  longueur de ligne visée 65–75ch.
- **Label** (700, 0.9rem) : étiquettes de champ des apps de saisie.
- **Mono** (500, ~0.66rem, letter-spacing 0.03em, chiffres tabulaires) : micro-
  repères (`.status`, `.chip`, `.pastille`, `.backlink`). Souvent en majuscules
  pour les statuts.

### Named Rules
**La règle « lisible d'abord ».** Atkinson Hyperlegible n'est pas décoratif, c'est
une contrainte : ne jamais la remplacer par une sans-serif « plus jolie » qui
réambiguïse I/l/1. L'interligne descend rarement sous 1.6 dans le corps.

**La règle du mono minuscule.** JetBrains Mono ne sert qu'aux **micro-repères**
(statuts, chiffres, tags) — jamais pour du texte courant ni pour un titre.

## 4. Elevation

Système **majoritairement plat, en calques tonals** : la profondeur se lit surtout
à l'éclaircissement des surfaces (page #e2e7e0 → surface #f2f5ef → panneau #fbfcf9)
et aux filets, pas à des ombres marquées. Les ombres existent mais restent
diffuses et discrètes ; elles s'intensifient **en réponse à une intention**
(survol d'une carte cliquable), jamais au repos par décoration.

### Shadow Vocabulary
- **Repos** (`box-shadow: 0 1px 2px rgba(20,30,20,.05), 0 22px 46px rgba(20,30,20,.09)`) :
  ombre d'enveloppe très douce sur le cadre `.frame`.
- **Intention** (`box-shadow: 0 10px 26px rgba(20,30,20,.12)`) : au survol d'une
  carte-lien (`a.tool:hover`), combinée à un léger `translateY(-3px)`.
- **Focus** (`box-shadow: 0 0 0 3px color-mix(in srgb, var(--acc) 22%, transparent)`) :
  halo teinté de l'accent autour d'un champ actif.

### Named Rules
**La règle « à plat au repos ».** Les surfaces sont plates par défaut ; l'ombre
apparaît en réponse à un état (survol, focus), pas pour signaler l'importance.
Si une carte a besoin d'une ombre lourde pour ressortir, c'est la hiérarchie qu'il
faut revoir, pas l'ombre.

## 5. Components

### Buttons
- **Shape :** coins doux (11px, `--radius-sm`).
- **Primary :** fond `var(--acc)`, texte blanc, bordure 1px de l'accent, padding
  0.58rem 1rem, graisse 700, ~0.94rem.
- **Hover / Focus :** `filter: brightness(.93)` + `translateY(-1px)` ; focus visible
  = contour 2px de l'accent, offset 2px.
- **Ghost :** fond blanc, texte de l'accent, même bordure ; survol = fond aplat
  doux (#e7ebe3). **Disabled :** fond doux, texte ténu, sans interaction.

### Chips
- **Style :** fond blanc très légèrement teinté de l'accent
  (`color-mix(in srgb, var(--acc) 9%, #fff)`), bordure teintée, texte estompé en
  mono, coins pilule (999px), chiffres tabulaires.
- **Rôle :** porter une donnée compacte (compteur, repère), pas une action.

### Cards / Containers
- **Corner Style :** 12px (carte outil) ; 16px pour le cadre-enveloppe `.frame`.
- **Background :** panneau (#fbfcf9) ; bandeau de tête à l'accent de l'app.
- **Shadow Strategy :** plate au repos, ombre « intention » au survol si la carte
  est un lien (voir Elevation).
- **Border :** 1px filet (#d0d9ce). **Padding interne :** ~0.85rem 0.95rem.
- **Cliquable :** la carte entière est le lien (`a.tool`) — pas de bouton isolé
  dedans ; le survol lève la carte et fait avancer la flèche `.go`.

### Inputs / Fields
- **Style :** fond blanc, bordure 1px filet, coins 11px, hauteur min 2.6rem
  (cible tactile terrain).
- **Focus :** bordure de l'accent + halo `0 0 0 3px` de l'accent à 22%.
- **Select :** chevron SVG intégré (pas d'appearance native).
- **Placeholder :** couleur ténue (#8a958c) — jamais plus clair.

### Navigation
- **Retour au hub** (`.backlink`) : présent dans **toutes les apps**, absent du
  portail. En mono minuscule (0.68rem), `‹ Portail`, sur le bandeau foncé.
- **Pastille de signature** (`.pastille`) : `btsgpn-kerplouz` précédé d'un point
  coloré (couleur de l'app dans une app ; légende multi-points sur le hub).

### Banner (composant signature)
Bandeau foncé texturé, commun à tout le système. Fond **à plat**
(`color-mix(in srgb, var(--acc) 82%, #0a1510)`) + un `<canvas>` de **texture
thématique** (moteur `shared/texture.js`) + un `.banner-scrim` en dégradé qui
garantit la lisibilité du titre. Chaque contexte a son motif, même langage de
traits fins : `grille` (hub), `scatter` (Phytoscope), `ondes` (Habitats-Gâvres),
`relief` (Habitats-Landes), `classification` (Végétations). La texture est
`aria-hidden`, purement décorative.

## 6. Do's and Don'ts

### Do:
- **Do** poser exactement **une** couleur franche par app via `--acc`, et laisser
  la structure (bandeau, cartes, champs) identique partout.
- **Do** garder le **fond froid papier** (#e2e7e0) et le rendu **clair forcé** ;
  la chaleur vient de l'accent, jamais du fond.
- **Do** viser des contrastes francs : texte courant ≥ 4.5:1, placeholders compris
  (couleur ténue, pas plus clair).
- **Do** réserver **JetBrains Mono** aux micro-repères (statuts, chiffres, tags)
  et **Atkinson Hyperlegible** à tout le reste.
- **Do** laisser les surfaces **plates au repos** ; l'ombre est une réponse au
  survol/focus, pas un décor.
- **Do** distinguer le **hub** (graphite + légende de couleurs) d'une **app**
  (monochrome + texture + retour `‹ Portail`).

### Don't:
- **Don't** verser dans le **SaaS/dashboard générique** : pas de dégradés
  violet-bleu, pas de cartes clonées à la chaîne, pas de jargon startup.
- **Don't** produire un **site institutionnel daté** : menus surchargés, PDF
  partout, absence de respiration.
- **Don't** basculer vers le **jouet enfantin** : sur-couleur, coins trop arrondis,
  ton ludique qui casse le sérieux naturaliste.
- **Don't** faire une **page marketing tape-à-l'œil** : animations partout,
  boutons qui crient, promesses au lieu d'informations.
- **Don't** utiliser un **fond crème/beige/sable/parchemin** — c'est le réflexe à
  fuir ; le neutre est froid et choisi.
- **Don't** mettre **deux accents** concurrents sur un même écran, ni teinter le
  hub avec la couleur d'une app.
- **Don't** remplacer Atkinson Hyperlegible par une sans-serif « plus jolie » qui
  réambiguïse I/l/1 et O/0.
- **Don't** ajouter de **liseré latéral coloré** (`border-left`/`right` > 1px) sur
  cartes ou alertes, ni de **texte en dégradé** (`background-clip: text`).
