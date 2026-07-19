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
