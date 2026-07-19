# Récap & reprise — migration charte Atlas de PhytoScope

> Document de travail temporaire (comme `handoff.md`/`REFONTE-REPRISE.md` l'ont
> été pour Végétations) : à supprimer une fois le chantier terminé, contenu
> absorbé dans la mémoire Claude à ce moment-là. Sert à reprendre le fil dans
> une conversation neuve, dans `apps/phytoscope/`.

## Où on en est (mise à jour du 19/07/2026, session page d'accueil)

Toujours branche **`refonte-phytoscope-atlas`**, toujours **rien commité ni
poussé**. `git status` doit montrer :
- `apps/phytoscope/index.html` modifié (charte + page d'accueil, cf. ci-dessous)
- `apps/phytoscope/fonts/` : `inter*`/`fraunces*.woff2` supprimés, `atkinson*.woff2` ajoutés
- `.impeccable/critique/2026-07-19T11-39-56Z__apps-phytoscope-index-html.md` (audit initial)
- 2 fichiers sans rapport : `apps/phytoscope/PROMPT-AUDIT-CHARTE.txt`, `apps/vegetations-armoricaines/documents/exemple_dendrogramme_circulaire.jpg`

## Résumé des deux sessions précédentes (migration charte)

Audit lecture seule (score 27/40) puis migration exécutée : polices Atkinson,
tokens de palette, suppression des liserés, reconstruction du bandeau (texture
+ backlink + pastille), a11y. 3 corrections après relecture de Martin
(alignement backlink/pastille, séparation bandeau/onglets, épaisseur réduite).
Détail technique complet dans la mémoire Claude `phytoscope-audit-charte`.

## Session du 19/07/2026 — page d'accueil « rampe de lancement »

Demande de Martin (cadrée en deux tours de questions avant codage) : une page
d'accueil façon Végétations, avec l'espace de connexion, un sélecteur de
relevés, l'espace référentiel, l'espace admin, et 5 cartes décrivant les
usages de l'app. Plan détaillé validé puis exécuté intégralement. Réalisé :

1. **Nouvelle vue `#home`**, active par défaut : connexion, sélecteur de
   relevés filtrable, 5 cartes d'entrée (Saisie, Gradients, Écogrammes,
   Comparaison, Zone humide), bloc Référentiels repliable, bouton Admin
   (icône cadenas). `body.is-home` masque la rangée d'onglets **desktop**
   (redondante avec les cartes) ; la barre du bas **mobile** reste visible
   (repère de navigation permanent, différent du bandeau desktop).
2. **Navigation généralisée** : `showView(id)` remplace le handler par onglet ;
   un seul listener délégué `[data-view]`/`[data-home]` gère onglets, cartes
   d'accueil, lien « Modifier la sélection », bouton Admin. Les onglets
   « Référentiels » et « Administrateur » ne sont **plus dans la barre** —
   Référentiels est absorbé dans l'accueil (repliable), Admin reste une vraie
   vue (`#data`, mot de passe inchangé) atteinte via l'icône.
3. **Sélection de relevés unifiée** : les 4 panneaux dupliqués (un par vue
   Gradients/Écogrammes/Comparaison/Zone humide) sont remplacés par **un seul
   sélecteur sur l'accueil**, filtrable (texte + code projet), qui alimente
   `state.selectedIds` — consulté par les 4 vues via un simple rappel
   compact (« N relevés sélectionnés · Modifier la sélection »). Clic sur le
   nom d'un relevé dans la liste → l'ouvre directement dans Saisie.
4. **Nouveau champ « Code projet »** sur chaque relevé (métadonnées Saisie +
   filtre d'accueil + exports CSV/Sheets). Comme les relevés sont stockés en
   blob JSON dans Supabase (colonne `donnees`), **aucune migration SQL**
   n'était nécessaire.
5. **Bandeau allégé** : le formulaire de connexion complet a quitté le
   bandeau sombre pour l'accueil ; le bandeau ne garde qu'une **pastille
   d'état compacte** (« Connecté · … » / « Non connecté », cliquable → accueil).
   → **Ceci résout le point 1 resté ouvert la session précédente** (bandeau
   trop épais à cause du logo + formulaire) via la piste B qui avait été
   identifiée (« sortir le formulaire hors du bandeau »).

**Écart volontaire par rapport à la demande initiale de Martin** : le
sélecteur de relevés sur l'accueil est **toujours visible**, pas seulement
« après connexion ». Raison technique : `state.releves` est la même liste que
l'utilisateur soit connecté ou non (mode invité/hors-ligne existant, données
locales) — la connexion ne fait que fusionner/synchroniser cette même liste
avec Supabase, elle ne révèle pas une liste séparée. Gater le sélecteur
derrière la connexion aurait cassé Gradients/Écogrammes/Comparaison/Zone
humide pour tout usage hors-ligne (régression). **À confirmer avec Martin**
que ce choix lui convient.

**Pièges rencontrés et corrigés pendant la vérification navigateur** :
- Classes `.authBar`/`.authInput`/`.authSelect` du bandeau sombre étaient
  **non scopées** → elles s'appliquaient telles quelles (texte blanc sur fond
  clair, quasi invisible) au nouveau formulaire de connexion sur l'accueil.
  Corrigé par des sélecteurs scopés `#homeAuthBar .authInput` etc. (plus
  spécifiques, gagnent quel que soit l'ordre des blocs `<style>`). Même souci
  sur le `<select>` « Code projet » (`.homeFilterBar select`).
- `body.is-home` n'était posé que par `showView()`, jamais au chargement
  initial (l'accueil est actif par défaut dans le HTML statique) → la rangée
  d'onglets desktop restait visible sur l'accueil au premier chargement.
  Corrigé en posant `class="is-home"` directement sur `<body>`.
- La règle mobile existante `.tabs{display:grid!important}` (7 colonnes,
  jamais retouchée) l'emportait sur le nouveau `display:none` — d'où le choix
  final de **scoper le masquage au desktop uniquement** (`@media(min-width:761px)`)
  plutôt que de forcer un `!important` supplémentaire, cf. décision UX du
  point précédent (barre mobile = chrome permanent).
- Le nombre d'onglets mobiles est passé de 7 à 6 (`grid-template-columns:
  repeat(6,1fr)`), sinon la grille aurait laissé une colonne vide.

**Vérification** : Chrome headless (`google-chrome --headless=new`) sur
`python3 -m http.server` local, captures desktop (1440×900) et mobile
(390×844) de l'accueil, + navigation testée vers Saisie (champ Code projet
visible dans les métadonnées repliables), Gradients, Écogrammes, Comparaison,
Zone humide (rappel de sélection visible partout). Vérification qu'aucune
erreur JS n'est levée via un `window.onerror` injecté sur une copie
temporaire (jamais sur le vrai fichier). **Rien commité, rien poussé.**

## Session du 19/07/2026 (suite) — ajustements après relecture de Martin

Martin a testé l'accueil en local et demandé une série d'ajustements ciblés,
tous faits et vérifiés (Chrome headless desktop+mobile, 0 erreur JS) :

- **Accueil épuré** : suppression du titre « Que voulez-vous faire ? » et de
  sa description (déjà présente dans le bandeau). Carte de connexion renommée
  **« Se connecter »**, avec son état connecté réétalé sur la largeur de
  l'encart (identité / statut sync / actions, au lieu d'être serrés en ligne).
- **Nouvel ordre de l'accueil** : Se connecter → **« Saisir un relevé »**
  (petit encart cliquable, sorti de la grille des 5 cartes) → **« Mes
  relevés »** (grand encart, réorganisé en **2 colonnes** : tous les relevés
  filtrables/cochables à gauche, relevés sélectionnés à droite) → 4 cartes
  restantes (Gradients/Écogrammes/Comparaison/Zone humide) sous « Analyser mes
  relevés » → Référentiels → Administrateur (inchangés).
- **Pastille de version simplifiée** : n'affiche plus que le numéro (ex. `v43`),
  retiré « bêta · » et la date, desktop et mobile. *(Martin a signalé un futur
  passage en V5.0 — non fait ici, pas demandé explicitement.)*
- **Saisie du relevé** : carte Métadonnées **ouverte par défaut** ; champs
  réorganisés en **3 colonnes** (`.grid3` au lieu de `.grid2`, Code projet y
  compris) ; espacement harmonisé entre tous les encarts de la vue
  (`#entry > * + *{margin-top:18px}`) ; **double scroll supprimé** (le tableau
  du cortège n'a plus de `max-height` propre, une seule barre de défilement
  pour toute la page — le même correctif existait déjà pour mobile seul,
  étendu au desktop).
- **Sélection ajustable depuis les 4 vues d'analyse** : sous le rappel « N
  relevés sélectionnés · Modifier la sélection », un `<details>` repliable
  « Cocher/décocher ici » réutilise la même checklist que l'accueil. Le
  handler de coche a été rendu robuste aux **copies DOM multiples** (accueil +
  4 vues + colonne « Sélectionnés ») : il **toggle l'id cliqué** dans
  `state.selectedIds` au lieu de recalculer depuis tous les `.releveCheck`
  cochés du DOM (qui aurait mélangé des cases visibles et masquées).
- **Passe esthétique** (skill `impeccable`, routée vers `colorize`, registre
  *Product* → stratégie **Restrained** confirmée par `PRODUCT.md`/`DESIGN.md`) :
  diagnostic = le vert servait à la fois aux actions ET à tous les titres de
  carte, aplatissant la hiérarchie (« trop de vert » = pas assez de contraste
  entre contenu et action, pas une question de teinte). Corrigé sans
  introduire de 2e couleur de marque : titres de carte (`.card h2,.card h3`,
  `.entries-title`) repassés en **encre neutre** (`--ink`), le vert reste
  réservé au titre de page, aux boutons/actions et à l'état sélectionné (lavis
  vert 6-7% sur « Saisir un relevé » et la colonne « Sélectionnés »). Icônes
  d'entrée dotées d'un fond circulaire teinté (`--brand2`) pour plus de
  relief ; icône **Zone humide** teintée en **ambre** (`--accent`, déjà la
  couleur sémantique « attention » ailleurs dans l'appli — cohérent car c'est
  l'unique fonctionnalité de diagnostic/alerte, pas une couleur arbitraire).

**Piège technique retenu pour la suite** : le handler de coche des relevés
doit rester **par toggle d'id**, jamais par relecture globale du DOM — dès
qu'un même relevé peut être coché depuis plusieurs endroits de la page en
même temps (même masqués via `display:none`), `querySelectorAll(...):checked`
compte aussi les copies invisibles et désynchronise l'état.

## Session du 19/07/2026 (suite) — corrections après retour critique de Martin

Martin a jugé le résultat de la session précédente insatisfaisant malgré l'audit :
bandeau toujours visiblement différent de Végétations (police/mise en page du
titre+sous-titre), encarts d'accueil sans liseré coloré. Plus 3 demandes
fonctionnelles nouvelles. Tout fait et vérifié (Chrome headless desktop+mobile,
0 erreur JS), **rien commité/poussé**.

1. **Bandeau reconstruit pour matcher EXACTEMENT le patron Végétations** :
   `.banner-inner` = ligne `.banner-meta` (backlink + pastille + pastille
   version + statut connexion, flex/gap, statut poussé à droite via
   `margin-left:auto`) → `<h1>` seul → `<p class="subtitle">` seule (masquée
   hors accueil via `body.is-home`, comme `.atlas-banner .subtitle` chez
   Végétations — allège le bandeau sur les vues de travail). Logo `.appLogo`
   et toute la mécanique `.headerTop`/`.authToggle`/`.authToggleCb` (menu
   déroulant mobile de l'ancien formulaire d'auth, mort depuis que la connexion
   a déménagé sur l'accueil) **retirés**. Cause racine du décalage de police
   trouvée : `h1`/`.h-screen` utilisaient `font-weight:600` +
   `font-variation-settings:"wght" 600` — reliquat de l'époque Fraunces
   (variable font) ; Atkinson Hyperlegible n'a que 2 graisses statiques
   (400/700), donc 600 forçait un rendu ambigu. Corrigé en `font-weight:700`
   sans `font-variation-settings`, `h1` recalé sur le même `clamp()` que
   `.atlas-banner h1` de Végétations.
2. **Liseré fin coloré sur les encarts d'accueil** (`#homeAuthCard`,
   `#homeReleveCard`, `#homeRefsCard`, `.entry`, `.entrySolo`) :
   `border-color:var(--brand)` + léger lavis 5 % pour les cartes qui n'en
   avaient aucun — reprend exactement le patron `.entry-block`/`.how-card` de
   Végétations (`border:1px solid var(--accent)` + `color-mix(...5%...)`).
3. **« Mes relevés » repliable, replié par défaut** : converti en
   `<details class="card metaCard">` (même patron que `#homeRefsCard`
   « Référentiels »), résumé = titre + compteur « N/M sélectionné(s) ».
4. **Filtrage des 4 vues d'analyse sur la sélection** : les panneaux
   « Cocher/décocher ici » (Gradients/Écogrammes/Comparaison/Zone humide)
   listaient TOUS les relevés de l'appli, pas seulement ceux cochés à
   l'accueil (`renderSelectionControls()`, la ligne qui construisait
   `gradientsSelChecks`/`scatterSelChecks`/`compareSelChecks`/`wetlandsSelChecks`
   itérait `state.releves` au lieu de le filtrer par `ids.has(r.id)`). Les
   graphiques eux-mêmes (`selectedReleves()`) filtraient déjà correctement —
   seule cette liste de coche montrait tout. Corrigé : ces 4 panneaux ne
   montrent plus, et ne permettent donc de décocher, que les relevés déjà
   sélectionnés à l'accueil (on ne peut plus en ajouter de nouveaux sans
   repasser par l'accueil — comportement demandé explicitement par Martin).
5. **Version → V5.0** : `APP_VERSION="5.0"`, affichage bandeau `"V"+APP_VERSION`
   (format aligné sur le `V3.0` de Végétations, au lieu de l'ancien schéma
   `v43 · date`).
6. **Bug préexistant corrigé au passage** (trouvé en vérifiant la console) :
   `service-worker.js` précachait encore `fonts/inter*.woff2`/`fraunces*.woff2`,
   supprimés de `apps/phytoscope/fonts/` à la migration précédente → l'install
   du service worker échouait silencieusement (`cache.addAll` rejeté).
   `APP_SHELL` repointé sur les 4 fichiers Atkinson/JetBrains réels,
   `CACHE_NAME` bumpé en `phytoscope-pwa-v5-0`.

**Vérification** : Chrome headless (`--headless=new --enable-logging=stderr`
pour capter la console + `--screenshot`), desktop 1440×900 et mobile 390×844,
captures comparées côte à côte avec Végétations. Test additionnel sur copie
temporaire (jamais le vrai fichier, supprimée après coup) : relevé fictif non
sélectionné injecté en `state.releves` pour confirmer qu'il n'apparaît QUE
dans le sélecteur d'accueil, pas dans le panneau « Cocher/décocher ici » de
Gradients. 0 erreur JS avant/après (l'erreur console du service worker a
disparu après le fix #6).

**Reste à faire** : relecture de Martin en conditions réelles (navigateur),
puis commit/push/PR — rien fait à ce stade, tout reste local sur
`refonte-phytoscope-atlas`.

## Session du 19/07/2026 (suite) — accueil numéroté en 3 étapes (rail vertical)

Nouveau retour de Martin sur l'accueil : déséquilibre entre les 3 blocs
d'action. Itéré via **3 variantes A/B/C** présentées en artifact (numérotation
jeton-inline / pastille-en-coin / rail vertical), Martin a choisi **C (rail
vertical)** puis demandé une série d'affinages, tout **codé directement dans
apps/phytoscope/index.html** (plus d'itération artifact ensuite). Vérifié
Chrome headless 1440/1024/mobile 390, navigation testée, 0 erreur JS. Toujours
**rien commité/poussé**.

**Structure retenue** : chaque étape = `.homeRail` (`.railCol` avec pastille
`.stepBadge` ronde vert plein + trait vertical `::before` reliant les 3
pastilles, sauf la dernière) + `.railContent` (titre externe `.entries-title`
en **vert foncé**, puis le/les encart(s) de l'étape). Seules les étapes 1/2/3
sont numérotées — **Référentiels n'a pas de chiffre**, séparé par un fin
liseré neutre `.ref-divider` (`border-top:1px solid var(--line)`, repris de
`.home-reference` de Végétations) + son titre passé en vert foncé aussi
(`#homeRefsCard summary h2`, override ciblé car `.card h2,.card h3{color:ink}`
est plus spécifique qu'une classe seule).

**Changements précis** :
1. **Titres externes** : « Se connecter » et « Relevés » sortent de leur
   encart (comme « Analyser mes relevés » déjà en place) → `<h3
   class="entries-title">` vert foncé, hors de tout `.card` (donc pas de
   conflit de spécificité avec `.card h2,.card h3{color:ink}`).
2. **Renommages** : « Mes relevés » → **« Sélectionner mes relevés »** ;
   « Saisir un relevé » → **« Saisir un nouveau relevé »** (description
   « Nouveau relevé phytosociologique… » **retirée**, jugée redondante avec le
   titre). Bloc 2 gagne un titre propre **« Relevés »**.
3. **Séparateur « et/ou »** entre les 2 encarts de l'étape 2 : `<p
   class="homeEtOu">`, aligné à gauche (pas centré), marges serrées (6px/10px)
   pour lire comme une charnière entre les deux cartes plutôt qu'un espace
   neutre.
4. **Tailles harmonisées** : « Saisir un nouveau relevé »
   (`.entrySoloText b`) et « Sélectionner mes relevés »
   (`#homeReleveCard summary h2`) ramenés à **.88rem/700**, identique à
   `.entry-head b` (Gradients/Écogrammes/Comparaison/Zone humide ?) — avant,
   1.02rem vs 1rem vs tailles de `.card h2` (1.24rem), sans cohérence.
5. **Icônes sans fond, vert foncé** (`--brandDark`) sur `.entry-ico`
   (générique), `.entrySolo .entry-ico` et `.authWhoIcon` (identité connectée)
   — avant : rond `--brand2` clair + icône `--brand`, jugé « vert foncé sur
   vert clair, ça ne fonctionne pas bien » par Martin. Override ambre de
   Zone humide (`#home .entry[data-view="wetlands"] .entry-ico{color:accent}`)
   **supprimé** — plus de 2e couleur de marque, cohérence « une seule voix ».
6. **Nouvelle icône « Saisir un nouveau relevé »** : l'ancienne (silhouette
   pointe-en-bas + tige, ambiguë feuille/pin/goutte) remplacée par un
   **crayon** (Martin a choisi l'option 1 parmi 2 proposées en artifact,
   l'autre étant une fiche/formulaire). Appliquée aux **deux endroits** où
   cette icône existait : la carte d'accueil **et** l'onglet de nav
   `data-view="entry"` (cohérence tout au long de l'app, même icône partout).
7. **Sous-titres du bloc 3 raccourcis** (remplacent les longues phrases
   descriptives) : Gradients → « Indices écologiques d'Ellenberg » (titre
   « Gradients d'Ellenberg » raccourci en juste « Gradients » pour éviter la
   redondance) ; Écogrammes → « Croiser deux indices » ; Comparaison →
   « Tableaux bruts » ; Zone humide ? → « Diagnostic floristique ».
8. **Flèche verte en bas à droite** sur les 4 cartes du bloc 3 (`.entry-arrow`,
   nouvelle classe) — alignement garanti homogène quelle que soit la longueur
   du texte grâce à `.entry{display:flex;flex-direction:column}` +
   `.entry-arrow{margin-top:auto;align-self:flex-end}` : la flèche se cale
   toujours en bas, même si "Zone humide ?" prend plus de lignes que les
   autres (les cartes d'une même rangée grid sont naturellement étirées à
   hauteur égale).
9. **Lien Baseflor ajouté** dans le bloc Référentiels : URL
   `https://www.tela-botanica.org/projets/phytosociologie` (reprise de la
   citation Baseflor du guide « Bien lire l'application » de Végétations).

**Piège de spécificité CSS rencontré et évité** : ajouter juste une classe
`.entries-title` (color vert foncé) sur le `<h2>` de Référentiels ne suffit
PAS à gagner contre `.card h2,.card h3{color:var(--ink)}` (compound selector,
plus spécifique qu'une classe seule) — nécessite un sélecteur ciblé
`#homeRefsCard summary h2{color:var(--brandDark)}` pour gagner à coup sûr.

**Fausse alerte débogguée en chemin** : premier essai de mockup artifact avait
un `.entries-grid{grid-template-columns:repeat(4,1fr)}` fixe dans une scène de
760px de large → 4ᵉ carte « débordait » visuellement, ce que Martin a
signalé. Diagnostic : bug du mockup seul (largeur artificiellement étroite +
grille non responsive), pas un bug de la vraie app — l'app réelle utilise déjà
`repeat(auto-fit,minmax(210px,1fr))` sur un conteneur large (`main` max-width
1480px), vérifié sans débordement à 1440/1024/mobile.

**Méthode de travail suivie** : cadrage en questions (AskUserQuestion) sur le
style de numérotation → 3 variantes construites en **artifact HTML unique
réutilisant les vraies polices Atkinson inlinées en base64** (le sandbox
Artifact ne peut pas charger `./fonts/...`) et les vrais tokens CSS de l'app,
pour un rendu fidèle → itéré 2 fois sur retours de Martin → une fois la
variante et les réglages validés, **implémentation directe dans le vrai
fichier** (plus d'aller-retour artifact), vérifiée en Chrome headless avant
de rapporter.

## Session 2026-07-19 (suite) — Référentiels, bug rail, exploration teintes

**Référentiels (accueil)** : converti de `<details>` repliable vers un `<div
class="card metaCard">` toujours visible (plus de `<summary>`). Logo Tela
Botanica ajouté à gauche du paragraphe BaseFlor (`documents/logo-telabotanica.png`,
renommé depuis `logo_tela botanica.png` déposé par Martin — espace dans le nom
remplacé par un tiret, convention kebab-case du dépôt), sur le modèle exact du
bloc `.home-reference`/`.cbnb-logo` de Végétations armoricaines (logo cliquable
+ texte à droite, `flex` avec `gap`). Lien cliquable Baseflor ajouté
(`https://www.tela-botanica.org/projets/phytosociologie`, absent jusqu'ici — ce
n'était donc pas encore fait malgré la demande initiale). Police du bloc
réduite (`.homeRefsBody{font-size:.82rem}`, tableau `.78rem` + paddings
resserrés). Piège de spécificité CSS retrouvé une 2ᵉ fois : `.card h2,.card
h3{color:var(--ink)}` (règle globale, plus bas dans le fichier) écrase toute
classe simple sur le même `h2` → fix par sélecteur ID-scopé
`#homeRefsCard .homeRefsHead h2`.

**Bug ligne du rail (chiffres 1-2-3)** : la ligne continuait après le badge 3.
Cause réelle : `.homeRail:last-of-type` ne visait **aucun** des 3 `.homeRail`,
car `:last-of-type` compare par **nom de balise**, pas par classe — or
`.ref-divider` (juste après) est *aussi* une `<div>`, donc c'est elle la
« dernière div » du parent, jamais le 3ᵉ `.homeRail`. Fix : classe explicite
`.homeRail-last` posée sur le 3ᵉ bloc, sélecteur CSS changé en conséquence.
Bug confirmé absent après capture d'écran (ligne bien arrêtée sous le badge 3).

**Exploration « trop de vert »** : Martin n'arrivait pas à formuler pourquoi
Végétations « fonctionne » visuellement et pas PhytoScope, en soupçonnant un
excès de vert / fond olive. Diagnostic établi par comparaison directe des deux
apps : le mécanisme de carte teintée (`border:1px solid var(--acc);
background:color-mix(in srgb, var(--acc) 5%, var(--panel))`) est **identique**
dans les deux apps et appliqué à peu près au même nombre d'encarts — la vraie
différence est (1) la teinte : l'orange de Végétations (`--accent:#c2662f`)
**contraste** avec le fond gris-vert froid partagé (`--bg:#e2e7e0`), alors que
le vert de PhytoScope (`--brand:#2e7d4f`) s'y **fond** (teintes analogues) ; et
(2) l'usage cumulé du vert sur *tous* les encarts de l'accueil (connexion,
sélection, 4 cartes d'analyse, référentiels) en plus du bandeau et des icônes,
alors que Végétations réserve sa couleur à quelques encarts « premier niveau »
et laisse le reste varier (bandeaux-photos multicolores par « porte »).
Deux variantes construites **directement dans le vrai fichier** (copies
temporaires jetables, jamais dans le fichier réel — cf. convention établie) et
capturées en Chrome headless pour comparaison :
- **Variante 1** — vert réservé à la seule action principale (« Saisir un
  nouveau relevé ») ; tous les autres encarts (connexion, sélection, 4 cartes
  d'analyse, référentiels) reviennent à une bordure neutre `--line` + fond
  `--panel` uni, icônes et flèches en encre/muted ; pastilles 1-2-3 restent
  vertes (fil rouge de marque ténu).
- **Variante 2** — encore plus neutre : mêmes révisions que la variante 1,
  mais pastilles 1-2-3 en encre/graphite au lieu du vert (aucune couleur de
  marque en dehors du bandeau et du bouton principal).
**Décision de Martin, tranchée après une 2ᵉ passe de variantes** (les
premières — vert réservé à un seul bouton — jugées « pas assez radicales »,
demande explicite de voir les rendus réels plutôt qu'un menu texte → export
PNG ouvert via `xdg-open`, pas de nouvel artifact) : **variante crème
retenue**. Direction finale, **appliquée pour de vrai dans le fichier** (plus
un test) :
- Nouveaux tokens `--warmpanel:#faf3e6` / `--warmline:#e8dcc4` dans `:root`.
- `.card{background:var(--warmpanel);border-color:var(--warmline)}` — changé
  à la base, donc **appliqué à toute l'app** (Martin : « la direction
  visuelle de la page d'accueil s'étend aussi sur l'ensemble de l'app »), pas
  seulement à l'accueil : Saisie du relevé, Gradients, Écogrammes,
  Comparaison, Zone humide en héritent automatiquement.
- `.entry`/`.entrySolo` (cartes cliquables de l'accueil) : même crème,
  bordure `--warmline`, survol → bordure `--brandDark`.
- Couleur portée par une **puce carrée pleine** (`--brandDark`, icône blanche,
  9px de rayon) sur l'icône, jamais par un aplat de carte — homogène sur les
  5 cartes cliquables (Saisir + les 4 cartes d'analyse) après que Martin a
  fait remarquer l'incohérence d'un seul bouton plein parmi des cartes crème.
- Titre du bandeau (`h1` « PhytoScope ») recoloré en crème (`--warmpanel`) au
  lieu de blanc pur, écho du crème des cartes — s'applique bandeau inclus
  puisque le bandeau est commun à toutes les vues.
- Icône ajoutée devant « Sélectionner mes relevés » (coche, même puce que les
  autres — demande explicite de Martin après avoir vu que ce libellé était le
  seul sans icône).
- Diagnostic retenu : le fond commun de la charte (gris-vert froid `#e2e7e0`,
  partagé par toutes les apps du portail) absorbe un accent vert (teintes
  analogues) au lieu de le faire ressortir, contrairement à l'accent chaud de
  Végétations qui contraste avec ce même fond — d'où le crème comme fond de
  carte propre à PhytoScope (mécanisme déjà présent chez Végétations : cartes
  claires + accent contrastant sur fond froid partagé).
Vérifié en Chrome headless : accueil, Saisie du relevé, Gradients, mobile
390px — aucune erreur console, rendu cohérent partout.

**Ajustement demandé après coup** : les onglets non sélectionnés de la barre
d'onglets desktop (`.tab{background:#fff}`) passés eux aussi en crème
(`--warmpanel`/`--warmline`), pour rester homogènes avec le reste — seul
l'onglet actif garde le vert plein. La barre du bas mobile (chrome de nav
fixe, pas des pastilles) n'est pas concernée, pattern différent.

**Retouches finales Référentiels/icônes** : mention « sources · barème de
cotation » retirée (titre seul) ; icône de « Saisir un nouveau relevé »
réduite de 42px à 34px pour s'aligner sur les 4 autres puces (elle
détonnait). Puis retour de Martin : le bloc Référentiels devait être posé
**sur le fond général de l'app, sans cadre** — pas une carte crème de plus,
plutôt une note de bas de page (exactement le traitement `.home-reference`
de Végétations). Fix : `#homeRefsCard{background:transparent;border:0;
box-shadow:none;padding:4px 4px 0}` (règle ID, bat la règle `.card` de base
sans avoir besoin de toucher celle-ci). Le fin liseré `.ref-divider`
au-dessus suffit à séparer visuellement de la section « Analyser mes
relevés ». `CACHE_NAME` du service worker bumpé en passant
(`phytoscope-pwa-v5-1`) par précaution contre un cache PWA obsolète.

**Prompt logo (4 identités)** : rédigé à la demande de Martin pour cadrer une
future création de déclinaisons de logo (portail, Végétations, PhytoScope,
Création de cours) — bandeau + icônes PWA + favicon. Sauvegardé dans
`prompt-logos-btsgpn-kerplouz.txt` (racine du dépôt, non commité) à la
demande de Martin (« sort le mot dans le dossier de travail en format
texte »).

## Points encore OUVERTS

### 1. Confirmer avec Martin l'écart volontaire ci-dessus
Sélecteur de relevés toujours visible sur l'accueil, pas seulement après
connexion — à valider.

### 2. Constat de Martin (session précédente) : « la charte est peu détectée/réapplicable »
Toujours non traité — pas de gabarit HTML+CSS canonique du bandeau partagé
entre apps. Idée de piste inchangée : extraire un snippet de référence dans
`shared/`, script de comparaison visuelle inter-apps.

### 3. Toujours en attente depuis l'audit initial
- Fusion des 7 blocs `<style>` du fichier (item 5 du plan d'audit) — gros
  chantier, volontairement reporté, pas commencé.
- Commit / push / PR : rien fait, tout reste local sur la branche.

## Pour reprendre proprement

1. Relire ce fichier (contient maintenant l'état à jour) + la mémoire
   `phytoscope-audit-charte` pour le détail de la migration charte initiale.
2. Avec Martin : valider le point 1 ouvert ci-dessus (sélecteur toujours
   visible), relire l'app en navigateur.
3. Si tout convient : commit/push/PR (rien fait à ce stade).
4. **Supprimer ce fichier** une fois le chantier phytoscope absorbé en
   mémoire Claude (même logique que pour Végétations).
