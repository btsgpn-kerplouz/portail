# shared/ — design system commun

Ressources **communes à toutes les apps** (source de vérité de l'identité visuelle).

- **`theme.css`** — la charte **« Atlas naturaliste »** : couleurs, typographie,
  bandeau, cartes, boutons, champs, statuts. Tokens sémantiques.
- **`texture.js`** — le moteur de **textures de bandeau** (canvas) : `grille`,
  `scatter`, `ondes`, `relief`, `classification`.
- **`fonts/`** — polices embarquées : **Atkinson Hyperlegible** (lecture, inclusive)
  + **JetBrains Mono** (chiffres & repères).

## Principes de la charte

- **Cohérence de structure, variation de couleur.** Même grammaire partout ;
  chaque app porte SA couleur via la variable `--acc`.
- **Hub ≠ App.** Le **portail** = base **neutre graphite** (`--house`) + toutes les
  couleurs en légende. Une **app** = **une seule** couleur + sa texture + un retour
  `‹ Portail`.
- **Inclusion.** Atkinson Hyperlegible, interligne 1.6, texte aligné à gauche,
  chiffres tabulaires désambiguïsés.

## Thémer une app (exemple)

```html
<link rel="stylesheet" href="../../shared/theme.css">
<script src="../../shared/texture.js" defer></script>
...
<header class="banner" style="--acc:#0f7aa0">   <!-- bleu littoral -->
  <canvas class="banner-texture" data-texture="ondes"
          data-tint="rgba(175,224,244,.4)" aria-hidden="true"></canvas>
  <div class="banner-scrim"></div>
  <div class="banner-inner">
    <a class="backlink" href="../../portail/">‹ Portail</a>
    <span class="pastille"><span class="dot" style="--dot:#b3e4f4"></span>btsgpn-kerplouz</span>
    <h1>Habitats — Petite Mer de Gâvres</h1>
  </div>
</header>
```

Palette d'app conseillée : Phytoscope `#2e7d4f` · Végétations `#6f8f2c` ·
Habitats-Gâvres `#0f7aa0` · Habitats-Landes `#7d4f83` · Organisation `#8a6d3d`.

## ⚠ Règle de synchronisation (« vanilla sans build »)

Chaque app est **déployée séparément** (Netlify) → un `shared/` central n'est pas
garanti d'être servi. Deux options :

1. **Lier** `../../shared/theme.css` + `texture.js` **si** le déploiement inclut
   `shared/` (ex. publication depuis la racine du dépôt).
2. **Recopier** la charte en local dans la page (cas du **portail**, auto-suffisant :
   `portail/index.html` embarque une copie + `portail/fonts/`).

Quand la charte évolue : **modifier `shared/` d'abord**, puis répercuter dans les
pages auto-suffisantes.
