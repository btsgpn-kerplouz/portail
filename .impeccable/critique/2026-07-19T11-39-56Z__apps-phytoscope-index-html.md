---
target: apps/phytoscope/index.html
total_score: 27
p0_count: 0
p1_count: 5
timestamp: 2026-07-19T11-39-56Z
slug: apps-phytoscope-index-html
---
⚠️ DEGRADED: single-context (politique de session : sous-agents non lancés sans demande de l'utilisateur)
Method: single-context (audit A design + B pédagogie, séquentiels, depuis la source — pas de connexion réelle, pas d'injection navigateur)

# Audit — PhytoScope (`apps/phytoscope/index.html`)

**Note de cadrage.** Cet audit porte sur deux axes distincts : (1) conformité à
la charte graphique commune « Atlas naturaliste », (2) clarté pédagogique de
l'outil. En cours de session, le commanditaire a précisé pour l'axe 2 : le
vocabulaire phytosociologique (Braun-Blanquet, indices d'Ellenberg, termes
écologiques) est déjà enseigné en classe et sur le terrain, et **aucun texte
pédagogique supplémentaire ne doit être ajouté à l'écran** — l'interface ne
doit pas s'alourdir. L'axe 2 ci-dessous est donc recadré : les écarts de
vocabulaire ne sont **pas** traités comme des défauts à corriger par de
l'affichage ; seuls des points d'interface indépendants du vocabulaire, ou des
ajustements à empreinte visuelle nulle, sont proposés.

## Design Health Score

| # | Heuristique | Score | Point clé |
|---|-------------|-------|-----------|
| 1 | Visibilité de l'état | 3/4 | `versionPill`, `authBar[aria-live]`, carte `.syncStatus` (ok/warn/err), toasts pour chaque action, badges de statut zone humide ; pas d'état de chargement initial visible |
| 2 | Correspondance monde réel | 3/4 | Terminologie phytosociologique juste et complète (Braun-Blanquet, 10 indices Ellenberg nommés en toutes lettres + code court) ; conforme aux usages du métier |
| 3 | Contrôle & liberté | 3/4 | `confirm()` avant toute action destructive (suppression relevé, remplacement JSON, reset cache, désolidarisation Sheet) ; pas d'undo mais le garde-fou est réel |
| 4 | Cohérence & standards | **1/4** | **Point le plus faible** : aucune trace de la charte commune — pas de `shared/theme.css`, pas de `--acc`, palette et polices propres à l'app, 7 blocs `<style>` empilés dont certains s'annulent explicitement entre eux |
| 5 | Prévention des erreurs | 3/4 | Contraintes de saisie (min/max/step), garde « conserver au moins un relevé », sélecteurs contraints, boutons segmentés Braun-Blanquet (pas de faute de frappe possible) |
| 6 | Reconnaissance vs rappel | 3/4 | Coefficients Braun-Blanquet affichés en boutons segmentés visibles (pas à retaper) ; indices toujours montrés en libellé long + code court côte à côte |
| 7 | Flexibilité & efficacité | 4/4 | App riche et mature : 6 vues fonctionnelles, choix d'axes, filtres, export PNG/Sheets/JSON, couleur par relevé, mode mobile dédié à navigation par icônes |
| 8 | Esthétique & minimalisme | **1/4** | 213 couleurs hexadécimales en dur, 3 systèmes de bandeau concurrents superposés (crème → vert foncé `#1e3d2c` → couche mobile qui neutralise les précédentes) : bruit visuel élevé, identité datée |
| 9 | Récupération d'erreur | 3/4 | Messages toasts clairs, en français, actionnables (« Indiquez votre nom. », « Conserver au moins un relevé. ») ; message rassurant en cas de stockage local corrompu (copie de secours conservée) |
| 10 | Aide & documentation | 3/4 | Onglet « Référentiels » dédié : source BaseFlor, table de conversion Braun-Blanquet, citation méthodologique complète (article scientifique) pour l'indicateur Ellenberg zones humides — documentation reléguée à sa place, pas de clutter |
| **Total** | | **27/40** | **Acceptable — application mature et fonctionnellement solide, jamais alignée sur la charte du portail** |

## Anti-Patterns Verdict

**Évaluation LLM.** Ne « sent » pas l'IA générique : c'est une app métier
ancienne, spécifique et très aboutie (échelle Braun-Blanquet fidèle, 10
indices écologiques avec bornes et qualificatifs corrects, citation d'un
article scientifique référencé pour la méthode zones humides, historique de
versions visible dans les commentaires — v14, v42, v43 — qui trahit un vrai
développement itératif sur la durée, pas un jet unique). Ce qui « sent »
franchement le **produit antérieur à la charte**, littéralement : palette
crème/parchemin (`--bg:#f6f3ed`) que `theme.css` proscrit nommément, police
serif éditoriale (Fraunces) que la charte a explicitement remplacée par
Atkinson Hyperlegible pour des raisons d'inclusion, et le même anti-pattern de
liseré latéral coloré déjà relevé et corrigé sur Végétations
(`.notice{border-left:4px solid var(--accent)}`, `.card h2::before` en barre
dégradée) — donc pas un réflexe de génération automatique, mais une **dette
de migration non faite**.

**Scan détecteur** : non exécuté (pas d'outil `detect.mjs` invoqué dans cette
session ; l'audit s'appuie sur lecture directe + recherche ciblée dans la
source, 1909 lignes).

**Pas d'overlay navigateur** : revue depuis la source uniquement, comme
demandé (lecture seule, pas de test en conditions réelles nécessaire pour
conclure sur ces deux axes).

## Overall Impression

PhytoScope mérite pleinement son statut d'« app modèle » **sur le plan
fonctionnel** : c'est l'outil le plus riche et le plus mûr du portail
(6 vues, exports multiples, synchronisation, calculs écologiques corrects).
Le score de 27/40 ne traduit pas un problème de qualité produit mais un
**retard de migration assumé et attendu** : c'est la seule des 4 apps jamais
passée sur la charte « Atlas naturaliste », alors que Végétations l'a déjà
fait. L'essentiel du travail restant est donc un **rhabillage**, pas une
refonte : les fondations (structure de vues, logique métier, contenu de
référence) sont saines et n'ont pas besoin d'être touchées.

## What's Working

- **Rigueur scientifique intacte.** Échelle Braun-Blanquet fidèle avec sa
  table de conversion documentée ; 10 indices écologiques nommés et bornés
  correctement ; méthode zones humides sourcée par un article scientifique
  cité en bonne et due forme (Perrin et al., 2023) — exactement le niveau
  « référence CBNB » visé par `PRODUCT.md`.
- **Documentation de référence bien rangée, pas intrusive.** L'onglet
  « Référentiels » centralise sources et barèmes **sans alourdir les écrans
  de saisie** — un patron déjà conforme à l'esprit « ne pas surcharger
  l'interface » que le commanditaire réaffirme pour cet audit.
- **Garde-fous solides sur les actions destructives.** `confirm()` posé
  systématiquement avant suppression, remplacement de données ou reset —
  aligné avec l'exigence de fiabilité des données saisies.
- **Erreurs et statuts déjà clairs, sans jargon.** Les toasts (« Indiquez
  votre nom. », « Conserver au moins un relevé. ») sont concrets et
  actionnables ; rien à changer ici.
- **Richesse fonctionnelle réelle**, pas décorative : export PNG/Sheets/JSON,
  choix d'axes interactif, comparaison multi-relevés, mode mobile pensé
  (navigation par icônes en bas d'écran, panneaux repliables).

## Priority Issues

- **[P1] Aucune trace de la charte commune — palette, tokens et police
  propres à l'app**
  - *Où* : `:root` (l.28-33) définit `--bg:#f6f3ed` (fond crème — **interdit
    explicitement** par la « règle du fond froid » de `theme.css`),
    `--brand:#3f6b4e` et `--accent:#b15a3c` (**deux accents concurrents**, ce
    que « la règle d'une seule voix » proscrit), `--display:"Fraunces"…serif`.
    Aucune variable `--acc`, `shared/theme.css` jamais chargé.
  - *Pourquoi* : c'est l'écart racine dont découlent la plupart des autres
    (bandeau, boutons, cartes tous hors charte). PhytoScope reste visuellement
    une île par rapport au reste du portail.
  - *Fix* : charger `shared/theme.css`, poser `--acc:#2e7d4f`, remplacer
    `--brand`/`--accent`/`--bg` locaux par les tokens partagés
    (`--page`/`--surface`/`--panel`/`--acc`).

- **[P1] Polices Inter/Fraunces toujours livrées, Atkinson Hyperlegible absente**
  - *Où* : `apps/phytoscope/fonts/` contient encore `inter.woff2`,
    `inter-italic.woff2`, `fraunces.woff2`, `fraunces-italic.woff2` ;
    `@font-face` (index.html l.21-24) les déclare ; `--display` (Fraunces)
    sert les h1/h2/h3, `Inter` sert le corps (l.52). Confirme et complète le
    point déjà noté dans `CLAUDE.md` : le problème n'est pas que dans
    `fonts/`, il est aussi actif dans tout le CSS.
  - *Pourquoi* : la charte a choisi Atkinson Hyperlegible précisément pour
    désambiguïser I/l/1 et O/0 au bénéfice des lecteurs dyslexiques — un
    engagement d'inclusion posé comme contrainte non négociable dans
    `PRODUCT.md`. Le maintenir sur l'app la plus utilisée par les élèves est
    l'écart le plus concret à ce principe.
  - *Fix* : retirer les 4 fichiers Inter/Fraunces de `fonts/`, ajouter les
    polices Atkinson (`shared/fonts/`), remplacer `var(--display)`/`Inter`
    par Atkinson Hyperlegible partout.

- **[P1] Bandeau et texture thématique jamais branchés**
  - *Où* : le `<header>` (l.53, puis surchargé par `#v42-topbar` l.230-264)
    est un dégradé radial puis un aplat vert foncé `#1e3d2c` — pas le
    composant `.banner` de la charte. `shared/texture.js` n'est référencé
    nulle part ; le motif `scatter` prévu spécifiquement pour Phytoscope
    n'est jamais dessiné. Pas de `.backlink ‹ Portail`, pas de `.pastille`
    signature `btsgpn-kerplouz`.
  - *Pourquoi* : le bandeau est le composant signature qui rend un outil
    reconnaissable comme membre du portail (`DESIGN.md` §5) ; sans lui,
    PhytoScope ne se rattache visuellement à rien.
  - *Fix* : remplacer le header/topbar actuel par `.banner` +
    `<canvas data-texture="scatter" data-tint="rgba(170,235,196,.5)">` +
    `.backlink` + `.pastille`, sur le modèle de Végétations V3.0.

- **[P1] Liserés latéraux décoratifs — anti-pattern déjà corrigé sur Végétations**
  - *Où* : `.card h2::before` (l.65, barre 4px en dégradé `--brand`→
    `--brandDark`), `.notice{border-left:4px solid var(--accent)}` (l.70).
  - *Pourquoi* : c'est l'anti-pattern nommément proscrit par
    `shared/theme.css` (« pas de liseré latéral coloré > 1px ») — déjà
    identifié comme le problème n°1 sur Végétations et corrigé là-bas ;
    PhytoScope porte exactement le même réflexe, non traité.
  - *Fix* : bordure complète 1px filet, ou aplat teinté doux, comme pour
    Végétations.

- **[P1] CSS en palimpseste avancé — dette de maintenance sérieuse**
  - *Où* : **7 blocs `<style>`** successifs dans le `<head>`, dont
    plusieurs traitent la même zone (header/topbar) de façon concurrente :
    le style de base (l.20-140) → `#v42-topbar` qui repasse le header en
    vert foncé (l.230-264) → `#mobile-compact-v43`, dont le commentaire dit
    lui-même : *« COUCHE MOBILE CANONIQUE (dernier bloc du `<head>` = gagne
    la cascade) […] neutralisées ici »* (l.346-354). Trois définitions de
    bandeau mobile qui se corrigent l'une l'autre par ordre d'apparition.
  - *Pourquoi* : sur un fichier « vanilla sans build » co-maintenu par des
    collègues (`CLAUDE.md`), chaque couche empilée augmente le risque qu'une
    prochaine modification touche la mauvaise couche sans le savoir —
    invisible pour l'élève, coûteux pour l'équipe enseignante.
  - *Fix* : fusionner les 7 blocs en un seul, supprimer les règles
    explicitement « neutralisées », documenter une seule source de vérité
    pour le mobile (l'occasion naturelle de cette migration, plutôt qu'un
    chantier séparé).

## Persona Red Flags

**Une élève de 1re année, sur le terrain, mobile en plein soleil** *(persona
projet, `PRODUCT.md`)* : le vocabulaire (Braun-Blanquet, indices) ne pose pas
de problème en soi — enseigné en amont, comme précisé par le commanditaire.
Ce qui reste un vrai frottement, indépendant du vocabulaire : la **densité
visuelle** issue du palimpseste CSS (couleurs et rayons incohérents d'un
écran à l'autre, bandeau qui change de traitement entre le header de base et
la couche mobile) demande plus d'effort de lecture que la grammaire commune
du portail, pensée justement pour réduire cet effort en extérieur.

**Sam (accessibilité)** : un seul `aria-live` dans toute l'app (`authBar`,
l.462) alors que de nombreux changements d'état passent par des toasts
transitoires (sync, export, validation) — ces annonces ne sont probablement
pas relayées à un lecteur d'écran. Pas de gestion de
`prefers-reduced-motion` (absente de `index.html`, alors que
`shared/theme.css` et `PRODUCT.md` la posent comme acquise). Ces deux points
sont indépendants du choix de police et méritent d'être corrigés dans le même
mouvement que la migration de charte.

## Minor Observations

- **213 couleurs hexadécimales en dur** dans le fichier, aucune ne référence
  un token partagé — à rapatrier sur `--acc`/`--page`/`--surface`/`--panel`
  en même temps que la migration de palette (P1 ci-dessus), pas comme un
  chantier séparé.
- Rayons d'arrondi incohérents d'un composant à l'autre (`9px`, `10px`,
  `11px`, `12px`, `13px`, `14px`, `16px`, `18px` cohabitent) — à resserrer
  sur l'échelle `--radius-sm`/`--radius`/`--radius-md` de la charte.
- Le sous-titre d'en-tête (« relevés phytosociologiques et indicateurs
  écologiques associés ») et les intitulés d'onglets (« Gradients »,
  « Écogrammes ») restent denses, mais conformément à la consigne reçue en
  cours d'audit, **aucune reformulation ni ajout de texte n'est proposé** :
  ce vocabulaire relève de l'enseignement, pas de l'interface.
- Deux champs de la barre de saisie (« Mode », « Strate ») n'ont pas
  d'attribut `title=`, contrairement à d'autres contrôles de l'app qui en
  ont un. Remarque mineure, à effet visuel nul (un `title=` ne s'affiche
  qu'au survol) — mentionné seulement parce que le patron existe déjà
  ailleurs dans le fichier, pas comme un manque à combler par du texte.

## Questions to Consider

- La migration de charte de PhytoScope se fait-elle **d'un coup** (comme
  Végétations V3.0) ou **par étapes** (tokens d'abord, bandeau ensuite, puis
  nettoyage CSS) ? Vu le volume (1909 lignes, 7 blocs `<style>`), un
  séquençage réduit le risque de régression sur une app en production avec
  de vraies données d'élèves.
- Le nettoyage du palimpseste CSS (P1, gros effort) doit-il être fait **en
  même temps** que la migration de palette/police (puisqu'il faudra de toute
  façon toucher ces blocs), ou **après**, une fois la charte posée, pour ne
  pas mélanger deux risques dans le même changement ?
- Le motif de bandeau « scatter » déjà prévu dans `shared/texture.js`
  correspond bien au sujet (nuage d'ordination) — confirmer qu'il n'y a pas
  de raison métier de préférer un autre motif avant de le brancher tel quel.

---

## Plan d'action priorisé (proposé — non exécuté)

| # | Action | Impact | Effort | Dépend de |
|---|--------|--------|--------|-----------|
| 1 | Charger `shared/theme.css`, poser `--acc:#2e7d4f`, remplacer `--brand`/`--accent`/`--bg` locaux par les tokens partagés | Haut | Moyen | — |
| 2 | Retirer Inter/Fraunces de `fonts/` + CSS, brancher Atkinson Hyperlegible (JetBrains Mono déjà présent, à conserver) | Haut | Faible–Moyen | (1) même vague |
| 3 | Reconstruire le bandeau : `.banner` + `<canvas data-texture="scatter">` + `.backlink` + `.pastille`, en remplacement du header/`#v42-topbar` actuel | Haut | Moyen | (1) |
| 4 | Retirer les liserés latéraux (`.card h2::before`, `.notice`) au profit d'une bordure pleine ou d'un aplat teinté | Moyen | Faible | (1) |
| 5 | Fusionner les 7 blocs `<style>`, supprimer les règles mobiles « neutralisées », consolider sur les tokens partagés (213 couleurs en dur → tokens) | Moyen | Élevé | (1)(2)(3) — à faire dans la même vague pour éviter de toucher deux fois les mêmes blocs |
| 6 | Étendre `aria-live` aux toasts, ajouter `prefers-reduced-motion` | Faible | Faible | indépendant |
| 7 | Axe pédagogique : aucune action requise sur le texte (vocabulaire couvert par l'enseignement) ; au mieux, `title=` discret sur « Mode »/« Strate » | Faible | Trivial | indépendant, optionnel |

**Lecture suggérée** : 1 → 2 → 3 forment le socle visuel (même vague, car ils
touchent les mêmes zones de `:root` et du header) ; 4 et 5 sont la suite
naturelle (nettoyage), 5 étant le plus coûteux — à ne pas sous-estimer vu la
taille du fichier (1909 lignes). 6 est indépendant et peu coûteux, peut se
faire à tout moment. 7 n'est pas un chantier, juste une option laissée
ouverte.
