# Zonation

Outil de terrain pour l'identification des habitats des marais salés de la
**Petite Mer de Gâvres** (BTS GPN — Kerplouz), à partir du référentiel
phytosociologique COLASSE V., 2019 (CBN de Brest).

Un·e élève réalise un relevé floristique à chaque point d'un transect
(abondance-dominance Braun-Blanquet), et l'application propose l'habitat le
plus probable en comparant le relevé au référentiel des 16 groupements
végétaux trouvables sur le site.

## État actuel

- **Front seul, vanilla (sans build)** : `index.html` + `data.js` + `fonts/`,
  charte « papier technique froid » déjà appliquée.
- **Données en `localStorage`** (hors-ligne, un appareil = ses propres
  transects) — pas encore branché sur Supabase. La bascule vers Supabase
  (comme `apps/phytoscope`, modèle pilote) est prévue dans une étape
  ultérieure, une fois ce front validé en ligne.
- Export CSV (résumé) et export CSV compatible avec le gabarit d'import de
  `apps/phytoscope` (mêmes coefficients Braun-Blanquet, résolution des taxons
  par nom scientifique exact).

## Développement local

Aucune étape de build : ouvrir `index.html` directement, ou servir le dossier
avec n'importe quel serveur statique.
