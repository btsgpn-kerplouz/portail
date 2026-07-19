---
target: apps/vegetations-armoricaines/index.html
total_score: 26
p0_count: 0
p1_count: 3
timestamp: 2026-07-18T08-56-19Z
slug: apps-vegetations-armoricaines-index-html
---
⚠️ DEGRADED: single-context (politique de session : sous-agents non lancés sans demande de l'utilisateur)
Method: single-context (A design review + B detector, séquentiels, sans injection navigateur)

# Critique — Végétations du massif armoricain (`apps/vegetations-armoricaines/index.html`)

## Design Health Score

| # | Heuristique | Score | Point clé |
|---|-------------|-------|-----------|
| 1 | Visibilité de l'état | 3/4 | `aria-live` sur la fiche, onglets actifs, compteur de comparaison ; pas d'état de chargement (données embarquées, instantané) |
| 2 | Correspondance monde réel | 3/4 | Langage phytosociologique juste, italiques pour les noms scientifiques ; mais code des rangs (11 couleurs + sigles) sans clé visible |
| 3 | Contrôle & liberté | 3/4 | Fil d'Ariane, retour Accueil, déplier/replier, recentrer, effacer recherche |
| 4 | Cohérence & standards | 2/4 | CSS empilé en « lots » (4 `:root`, `--muted` redéfini 3×), liserés latéraux qui contredisent la charte partagée, arbre arc-en-ciel vs identité monochrome |
| 5 | Prévention des erreurs | 3/4 | App de consultation (faible surface d'erreur), handler `window.onerror`, selects contraints |
| 6 | Reconnaissance vs rappel | 2/4 | **Point faible** : légende des rangs `display:none`, 11 couleurs + sigles à mémoriser |
| 7 | Flexibilité & efficacité | 3/4 | 4 vues, filtres de profondeur, déploiement par niveau, bascule radial/arbre, zoom |
| 8 | Esthétique & minimalisme | 2/4 | Globalement propre et sur charte, mais liserés + arc-en-ciel + micro-typo 9–11px ajoutent du bruit |
| 9 | Récupération d'erreur | 2/4 | Read-only, faible enjeu ; handler global écrit dans la fiche |
| 10 | Aide & documentation | 3/4 | Guide « ? » dédié, sous-titres explicatifs par vue, `title=` sur les outils |
| **Total** | | **26/40** | **Acceptable — base solide, améliorations ciblées** |

## Anti-Patterns Verdict

**Évaluation LLM.** Ça ne « sent » PAS l'IA générique — c'est une app métier sophistiquée, spécifique et soignée (arbre syntaxonomique, indicateurs d'Ellenberg en barres, cartes SVG, comparateur, couverture d'ouvrage). Les italiques pour genres/alliances/associations respectent la convention botanique. Mais deux réflexes esthétiques trahissent une main automatique et, surtout, **contredisent la charte maison** : les liserés latéraux colorés et l'arc-en-ciel des rangs sur fond « app monochrome ».

**Scan déterministe (detect.mjs).** 132 signalements : `design-system-color` ×56, `design-system-font-size` ×48, `design-system-radius` ×17, **`side-tab` ×10**, `border-accent-on-rounded` ×1. Les couleurs/tailles/rayons « hors système » sont en partie des faux positifs (l'app a son propre jeu de tokens locaux `--accent`, `--rank-*`, `--radius`), mais pointent une vérité : beaucoup de valeurs en dur (`#d7e2d7`, `13.5px`, `border-radius:14px`) au lieu des tokens. Les 10 `side-tab` sont le vrai sujet.

**Pas d'overlay navigateur** : injection non lancée (revue depuis la source + détecteur). Aucun surlignage visuel dans un onglet.

## Overall Impression

Une app **riche et clairement au-dessus du niveau « projet bricolé »** — exactement l'objectif « donner confiance » du cadrage. Ce qui la retient : un **code des rangs à moitié engagé** (11 couleurs, mais la légende qui les explique est masquée) et des **liserés latéraux décoratifs** qui vont à l'encontre de la charte que ce dépôt s'est lui-même donnée. La plus grande opportunité : **trancher sur le système de couleur des rangs** (l'assumer avec une clé visible et une rampe ordonnée, ou le retirer au profit de la pastille de rang textuelle).

## What's Working

- **Typographie métier juste.** Italique pour les noms scientifiques (genre/alliance/association), capitales pour les classes : la charte respecte les conventions phytosociologiques. C'est ce qui fait « ressource pro ».
- **Dataviz utile, pas décorative.** Les barres d'Ellenberg (repère de moyenne + bande d'écart-type + point) et les cartes de répartition SVG encodent de la vraie information écologique.
- **Vraie aide + accessibilité soignée.** Guide « ? » dédié, `aria-live` sur la fiche, 23 `aria-label`, `role=dialog/search`, focus visible 2.5px, `--muted` remonté pour viser WCAG AA, `prefers-reduced-motion` géré. Sur la bonne voie pour la cible AA.
- **Couverture d'ouvrage inclinée + lien PDF** : une touche éditoriale « atlas » sincère, sur la marque.

## Priority Issues

- **[P1] Liserés latéraux décoratifs (`border-left:4–5px solid var(--accent)`)**
  - *Où* : `.home-hero`, `.home-maintenance`, `.entry-block`, `.how-card`, `.entry-search`, `.entry-nav`, `.eco-portrait`.
  - *Pourquoi* : c'est LE tell n°1 des UI générées, et il **contredit frontalement `shared/theme.css`** (« border-left > 1px comme accent coloré : jamais intentionnel »). Sur une app dont le but est d'inspirer confiance et cohérence avec le portail, c'est l'incohérence la plus visible.
  - *Fix* : retirer ces liserés ; porter l'accent par une bordure complète 1px, un aplat teinté doux, ou une pastille/icône de tête. Garder l'effet « tranche de livre » (`.book img`) qui, lui, est une skeuomorphie assumée, pas un liseré slop.
  - *Commande suggérée* : `/impeccable quieter`

- **[P1] Le code couleur des rangs est à moitié engagé, et sa légende est masquée**
  - *Où* : `--rank-*` (11 teintes : marine, bleus, verts, olive, or, sarcelle, violets, ambre, rouge) sur `.node-card`/`.rank-chip`/dendrogramme ; `#rankLegend { display:none !important }` (répété 3×).
  - *Pourquoi* : rupture avec « une seule voix » (app monochrome ocre) ET problème de reconnaissance : l'utilisateur voit 11 couleurs **sans clé** pour les lire. De plus le rang est **ordinal** (Classe > Ordre > Alliance > Association) alors que les teintes sont catégorielles/arbitraires (violet pour l'alliance, sarcelle pour le genre…), donc l'ordre n'est pas lisible dans la couleur.
  - *Fix* : trancher. Soit **assumer** : rampe **ordonnée** dans la famille ocre/neutre (foncé = rang haut → clair = rang bas) + **légende visible** (une bande de rappel compacte, pas `display:none`). Soit **retirer la couleur** et s'appuyer sur la pastille de rang textuelle (CL, F, AL…) déjà présente.
  - *Commande suggérée* : `/impeccable colorize` (recomposer un encodage ordinal cohérent) ou `/impeccable distill` (simplifier vers la pastille seule)

- **[P1] La clé de lecture (couleurs + sigles de rang) n'est jamais visible pour un débutant**
  - *Où* : sigles CL / S-CL / F / D / M / G / S-G / AL / S-AL / As, sans glossaire persistant ; la seule aide est derrière le bouton « ? ».
  - *Pourquoi* : le cadrage vise « se débrouiller seul » pour des **étudiants de 1re année** de BTS GPN. Un code à mémoriser (11 sigles + 11 couleurs) sans rappel à l'écran force le rappel de mémoire.
  - *Fix* : rendre la légende des rangs **visible et persistante** (repliable), et déplier les sigles au survol/focus (`title`/`aria`). Relier au guide.
  - *Commande suggérée* : `/impeccable clarify`

- **[P2] CSS en palimpseste (dette de maintenance)**
  - *Où* : 4 blocs `:root` successifs, `--muted` redéfini 3×, `#rankLegend{display:none!important}` en 3 endroits, nombreux `!important`, fonctionnalités abandonnées masquées (`#globalMeta`, `#searchMeta`, `#speciesFilter`, `#rootFilter`).
  - *Pourquoi* : fichier « vanilla sans build » co-maintenu par des collègues → chaque couche de correctifs rend la suivante plus risquée. Invisible pour l'utilisateur, coûteux pour l'équipe.
  - *Fix* : fusionner les `:root`, supprimer le code mort, consolider les tokens locaux sur ceux de `shared/theme.css`.
  - *Commande suggérée* : `/impeccable distill`

## Persona Red Flags

**Jordan (débutant·e — étudiant·e de 1re année)** : arrive sur l'arbre, voit 11 couleurs et des sigles (CL, S‑CL, AL…) **sans légende à l'écran**. Doit ouvrir le guide « ? » pour décoder, ou deviner. Risque d'abandon sur la vue Classification faute de clé.

**Sam (accessibilité / daltonisme)** : le rang est doublé d'une pastille texte (bien), donc ce n'est pas « couleur seule ». Mais parmi les 11 teintes, deux violets (`#7c3aed`/`#a855f7`) et deux bleus (`#345995`/`#0284c7`) sont difficiles à distinguer ; la légende masquée prive du repli textuel. Focus visible : OK.

**Maëlle (étudiante BTS GPN, sur le terrain, mobile au soleil)** *[persona projet, tiré du Contexte design]* : micro‑typographie 9–11px (axes, sous‑titres de nœuds, sigles) dure à lire en plein soleil ; l'arbre horizontal large impose du scroll latéral au pouce. Les cibles tactiles principales (onglets, boutons) sont correctes (≥40px).

## Minor Observations

- `.home-kicker` (mono, majuscules, `letter-spacing:.1em`) au‑dessus du titre d'accueil = l'« eyebrow » classique. Le reste des micro‑labels mono forme un **système cohérent** (en‑têtes de section, rangs) et se défend ; le kicker d'accueil est le seul qui relève du réflexe.
- Beaucoup de couleurs en dur hors tokens (`#2d382f`, `#304337`, `#d7e2d7`, `#bdcbbf`…) : à rapatrier sur les variables pour tenir la charte.
- Tailles en dur non arrondies (`13.5px`, `12.8px`, `12.4px`, `10.5px`) : cohérence d'échelle typographique à resserrer.

## Questions to Consider

- Et si le **code des rangs** devenait une **rampe ordonnée** (du foncé au clair) plutôt qu'un arc‑en‑ciel — l'œil lirait la profondeur sans légende ?
- La légende des rangs a‑t‑elle été masquée par manque de place, ou parce qu'elle n'aidait pas sous sa forme d'alors ? (ça oriente le fix)
- Combien de ces 11 rangs un étudiant de 1re année manipule‑t‑il vraiment ? Peut‑on n'en colorer que les 3–4 utiles et neutraliser le reste ?
