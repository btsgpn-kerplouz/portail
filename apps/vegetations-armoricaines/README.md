# Classification des végétations CBNB — PWA

Application HTML autonome de consultation de la classification physionomique et phytosociologique des végétations du CBNB.

## Contenu du dépôt

```text
/
├── index.html
├── manifest.webmanifest
├── service-worker.js
├── .nojekyll
└── icons/
    ├── favicon.svg
    ├── icon-192.png
    ├── icon-512.png
    ├── maskable-192.png
    ├── maskable-512.png
    ├── apple-touch-icon.png
    └── icon-preview.png
```

## Publication sur GitHub Pages

1. Créer un nouveau dépôt GitHub.
2. Déposer tous les fichiers présents dans ce dossier à la racine du dépôt.
3. Aller dans **Settings → Pages**.
4. Dans **Build and deployment**, choisir **Deploy from a branch**.
5. Sélectionner la branche `main` et le dossier `/root`.
6. Enregistrer, puis attendre la publication de l’URL GitHub Pages.

## Installation smartphone

### Android / Chrome

1. Ouvrir l’URL GitHub Pages de l’application.
2. Ouvrir le menu Chrome.
3. Choisir **Installer l’application** ou **Ajouter à l’écran d’accueil**.

### iPhone / Safari

1. Ouvrir l’URL GitHub Pages dans Safari.
2. Appuyer sur le bouton **Partager**.
3. Choisir **Ajouter à l’écran d’accueil**.

## Notes techniques

- L’application reste un HTML autonome enrichi en PWA.
- Le manifeste déclare les icônes, le mode `standalone`, les couleurs et l’URL de démarrage.
- Le service worker met en cache les ressources applicatives principales.
- Le fonctionnement hors ligne dépend du premier chargement complet depuis une URL HTTPS.
- Après modification de `index.html`, augmenter éventuellement la constante `CACHE_NAME` dans `service-worker.js` pour forcer la mise à jour du cache.


## Ajustements V1.1

- Clic dans l’arborescence : sélection de la fiche sans défilement automatique vers le panneau de détail.
- Affichage par défaut : classification complète.
- Libellé corrigé : `Macrotype` → `Macro-groupe`.
- Gradients d’Ellenberg : les espèces des niveaux inférieurs sont compilées pour les rangs de Division à Association ; les rangs parents de Division restent inchangés.
- Cartes régionales : contours SVG affinés.
- Cache PWA incrémenté (`cbnb-vegetations-pwa-v1-1`).

## V1.2 ajustée

- affichage du rang en toutes lettres dans les fiches ;
- retrait des badges techniques ID, parent, page et source dans les fiches ;
- masquage automatique des rubriques vides ;
- suppression des mentions « Champ source » ;
- liens externes de recherche Tela Botanica sur les noms d’espèces structurés ;
- cache PWA incrémenté en `cbnb-vegetations-pwa-v1-2`.


## V1.4 ajustée

- page d’accueil affichée par défaut au lieu de la première fiche de l’arborescence ;
- aperçu de la première page du PDF source CBNB dans la page d’accueil ;
- lien direct vers le PDF source officiel du CBNB ;
- affichage discret de la version applicative ;
- bouton « Mise à jour » pour vider le cache PWA local, désinscrire l’ancien service worker et recharger la dernière version ;
- charte graphique modernisée : palette vert CBNB, fond papier, accueil type couverture de cahier technique ;
- cache PWA incrémenté en `cbnb-vegetations-pwa-v1-4`.

## V1.5

- Page d’accueil simplifiée.
- Retrait de l’espace « Première page » et de la synthèse du contenu applicatif.
- Conservation du lien vers le PDF source et du bloc discret version / mise à jour.
- Cache PWA incrémenté en `cbnb-vegetations-pwa-v1-5`.


## V1.6

- Retrait du sous-titre redondant de la page d’accueil : « de Basse-Normandie, Bretagne et Pays de la Loire ».
- Conservation du titre complet unique.
- Cache PWA incrémenté en `cbnb-vegetations-pwa-v1-6`.

## V1.7 — Lot 0 (correctifs express, audit UX)

- **D1** — Nettoyage de la fiche « Prairies et pelouses des régions tempérées » : suppression d’un résidu d’extraction (identifiants internes, codes de rang, descriptions d’enfants concaténées) ; conservation de la description légitime (486 c. au lieu de 6 562).
- **B2** — Réaffichage de la légende des rangs dans la barre latérale, avec libellé complet (« CL · Classe »…) ; info-bulle du libellé au survol des pastilles de rang dans l’arbre et les badges.
- **G1** — Réactivation de la recherche intégrée au comparateur ; message d’état vide corrigé (« recherche ci-dessus … depuis n’importe quelle fiche »).
- **H1** — Titre d’en-tête raccourci (« Végétations du Massif armoricain ») pour lever la redondance avec le titre d’accueil.
- **E1 / E2** — Carte régionale : phrase de synthèse générée (ex. « Absent : Basse-Normandie, Bretagne · Présent : Pays de la Loire ») et légende adaptative (seuls les statuts réellement présents).
- **F2** — Comparateur : suppression du débordement horizontal sur mobile.
- **A11y** — États de focus clavier visibles ; contraste du texte atténué renforcé.
- Cache PWA incrémenté en `cbnb-vegetations-pwa-v1-7`.

## V1.8 — Lot 1 (Ellenberg « en clair », audit UX)

Toutes ces lectures sont **calculées à partir des indices** existants — aucun texte du CBNB n’est modifié.

- **01 — Portrait écologique** : bandeau « En clair » en tête de la rubrique Ellenberg, résumant le milieu par quelques traits **saillants** seulement (ex. « très salé · pleine lumière · sol neutre · sol très riche »). Les indices peu distinctifs sont écartés ; la **continentalité** n’apparaît que si elle est remarquable.
- **04 — Gradients traduits** : sous chaque axe, une lecture en langage courant de la moyenne (« ≈ pleine lumière », « ≈ sol acide »), à côté des descripteurs techniques conservés.
- **G2 — Comparateur en clair** : chaque cellule de la matrice affiche la lecture en clair ; les gradients où les végétations comparées diffèrent nettement sont marqués « **contraste** ».
- **H4 — Rangs élevés** : pour les niveaux qui agrègent de nombreuses espèces (Division, Macro-groupe… ou ≥ 30 espèces), la moyenne cède la vedette à l’**étendue** (barre claire min–max) et un bandeau « Vue d’ensemble » invite à la prudence.
- Cache PWA incrémenté en `cbnb-vegetations-pwa-v1-8`.

## V1.9 — Lot 3 (accueil & orientation, audit UX)

- **A1 — Accueil ≠ Explorer** : l’**Accueil** devient une page pleine largeur (sans l’arborescence), l’**Explorer** reste l’atelier arbre + fiche. Ouvrir Explorer sans sélection affiche une invite au lieu de l’accueil.
- **A2 — Orientation** : l’action principale n’est plus « Ouvrir le PDF » mais « **Explorer l’arborescence** » et « **Comment ça marche ?** ». Le PDF source devient un lien discret en pied d’accueil.
- **02 — Cinq portes physionomiques** : cartes d’entrée (Aquatiques, Herbacées, Fourrés nains, Fourrés arbustifs, Forêts) avec icônes botaniques et nombre de végétations ; un clic ouvre la classe correspondante.
- **A3 — Guide** : bouton « ? » discret dans l’en-tête et « Comment ça marche ? » sur l’accueil, ouvrant un guide (rangs, lecture d’une fiche, comparateur, indices d’Ellenberg) — pensé pour un usage encadré.
- **A4 — Maintenance** : version et bouton « Mise à jour » relégués en pied d’accueil discret.
- Cache PWA incrémenté en `cbnb-vegetations-pwa-v1-9`.

## V1.10 — Lot 3 (ajustement des portes physionomiques)

Prolonge la V1.9. Aucun texte du CBNB n’est modifié : la couche d’orientation est purement graphique.

- **Portes colorées** : chaque « porte » d’accueil reçoit un **disque plein** aux couleurs de sa classe, d’après la charte du cahier technique — bleu marais (aquatiques), vert clair (herbacées), marron/violet (fourrés nains), marron/vert (fourrés arbustifs), vert profond (forêts) — avec le **glyphe botanique en blanc** et le libellé en noir.
- **Trois icônes redessinées** : aquatiques (plante immergée plumeuse sous une ligne d’eau), fourrés nains (épis de bruyère), forêts (bosquet de deux arbres) ; herbacées et fourrés arbustifs conservés.
- Cache PWA incrémenté en `cbnb-vegetations-pwa-v1-10`.

## V1.11 — Lot 2 (glossaire au survol, audit UX)

Le texte source du CBNB n’est pas modifié : le glossaire est une **couche interactive ajoutée par-dessus** la description.

- **Glossaire de 30 entrées** (≈ 90 termes avec familles et variantes), validé au registre technique : concepts sigmatistes (phytosociologie, association, syntaxon, relevé…), autécologie (édaphique, trophie, gradients en `-phile`, salinité…), milieux (lande, ourlet, pelouse/prairie, mégaphorbiaie, roselière, bas-marais/tourbière, herbier…), facteurs stationnels (strate, substrat/texture, hydromorphie, chorologie atlantique, étages, dynamique/série) et types biologiques de Raunkiær.
- **B1 / 03 — couche au survol** : dans la description d’une fiche, la **1ʳᵉ occurrence** de chaque terme reçoit un discret **souligné pointillé** ; au survol (bureau), au **focus clavier** ou au **tap** (mobile), une bulle affiche la définition. **Jamais** appliqué aux noms latins d’espèces (rendus dans une carte distincte).
- Détection insensible à la casse et aux accents, gestion des pluriels ; les termes composés priment (ex. « thermo-atlantique » avant « atlantique »).
- Cache PWA incrémenté en `cbnb-vegetations-pwa-v1-11`.

## V1.12 — Lot 4 partiel (confort de navigation, audit UX)

Navigation hiérarchique fluide sur poste fixe (le volet mobile « fiche d’abord » — F1 — reste à venir).

- **C1 — descente depuis la fiche** : nouvelle carte « **Niveaux inférieurs** » listant les végétations filles directes (puce cliquable + code de rang coloré), pour descendre d’un cran sans passer par l’arbre. Elle complète le fil d’Ariane, qui assure la remontée.
- **C1 — repérage dans l’arbre** : le **chemin d’ancêtres** de la fiche sélectionnée est désormais **surligné** dans l’arborescence (fond vert pâle), de la classe jusqu’au parent direct — on situe immédiatement sa position.
- **C2 — indentation** : réduction de l’indentation par niveau (26 → 20 px) et des connecteurs, pour limiter l’étalement horizontal des rangs profonds.
- Cache PWA incrémenté en `cbnb-vegetations-pwa-v1-12`.
