# À l'affût — avancement

> Fichier de suivi versionné : à relire en premier dans une conversation
> neuve (après un `/clear` ou une compaction) pour savoir où on en est,
> sans dépendre de la mémoire de la conversation précédente.

## État au 02/09/2026 — reprendre ici

**✅ Lots 14 à 21 fusionnés dans `main` et déployés** (PR #70, commit
`9911db2`, 02/09/2026 20:31 UTC) — vérifié en direct sur
https://affut-veille-naturaliste.kerplouz.workers.dev juste après la
fusion (marqueurs Lot 20/21 présents dans le HTML servi). **Lot 22 fait
dans la foulée** : tuile « À l'affût » activée dans le portail général
(`portail/index.html`, passée de « en chantier » à « en service ») avec un
badge « n°X disponible » lu en direct sur Supabase — détail et piège
rencontré (main local périmé) dans l'entrée « Lot 22 » en fin de fichier.
**Pas encore committé/poussé** à ce stade.

**✅ Correctif Lot 19 appliqué et confirmé par l'utilisateur** (« ok c'est
mieux ») — la migration a bien été jouée, les entrées s'affichent
maintenant en vue publique. Voir aussi le **Lot 20** (connexion discrète +
rédaction mobile) démarré dans la foulée, détail en fin de fichier.

**🔴 Rappel du bug corrigé (Lot 19, 02/09/2026)** : aucune entrée ne s'est
jamais affichée en
vue publique/anonyme (élèves), sur aucun numéro, depuis l'origine de
`affut_entrees_public` : la vue filtre `where valide = true` mais n'a
jamais exposé la colonne `valide` elle-même, donc `depuisLigneEntree()`
côté front lit `valide: undefined` pour chaque ligne, et tous les filtres
d'affichage public (`e.valide`, ~10 usages) traitent `undefined` comme
faux → toutes les entrées disparaissent silencieusement pour un visiteur
non connecté, alors que la même donnée s'affiche normalement une fois
connecté en rédaction (chemin de code différent, qui lit la vraie colonne).
Jamais détecté avant car les vérifications précédentes se faisaient
toujours en étant connecté. Diagnostic détaillé et correctif dans l'entrée
« Lot 19 » en fin de fichier — **migration
`supabase/010-fix-entrees-public-valide.sql` à appliquer par l'utilisateur
au dashboard Supabase (SQL Editor) avant toute autre vérification**, puis
retester déconnecté (bouton « Déconnexion ») qu'un numéro publié affiche
bien ses entrées.

**Lots 12 à 17 faits le 02/09/2026** — voir les entrées correspondantes en
fin de fichier pour le détail. Le backlog du 01/09/2026 est maintenant
**entièrement traité** (plus rien dans « Idées pour plus tard »), et
largement dépassé par les Lots 15/17 (carte « réseaux sociaux », mise en
page à plat), qui n'étaient pas prévus à l'origine. **Rien de
committé/poussé** pour l'instant — attente explicite de l'utilisateur, à
committer avec les prochains ajustements.

**Correctif Lot 17bis (même jour, à la reprise) : l'ordre à plat des
entrées ne fonctionnait pas réellement** — `entreesOrdonnees()` passait
encore par `groupByRubrique()`, qui empêchait toute entrée de franchir sa
frontière de rubrique à l'écran malgré des boutons Monter/Descendre
fonctionnels en apparence. Corrigé (tri direct par `ordre`) + migration
`009-ordre-entrees-plat.sql` **pas encore appliquée** (nécessaire pour les
numéros déjà en base, pas pour les nouveaux) — voir l'entrée « Lot 17bis »
en fin de fichier pour le détail et la vérification en conditions réelles.

**Repère technique découvert en cours de route (important pour la suite) :**
le bouton **« Imprimer ce numéro »** ne passe PAS par le CSS/DOM affiché à
l'écran — il génère un PDF de façon entièrement programmatique via jsPDF
(`numeroGenererPdfDoc()`/`pdfBuildBlocks()`/`pdfPreparerEntree()`, écran
par écran en mm, Lot 4quater). Le bloc `@media print` du CSS (existant
depuis longtemps) n'est donc qu'un **repli pour un Ctrl+P direct du
navigateur**, jamais ce que déclenche ce bouton — les Lots 15 et 17
n'avaient donc PAS besoin d'être vérifiés à l'impression pour valider le
bouton lui-même (correction par rapport à une note précédente de ce
fichier qui supposait le contraire) ; l'export PDF, lui, continue de
grouper par rubrique (`groupByRubrique()`, inchangé, toujours appelé
directement par `numeroGenererPdfDoc()`) — non retouché par le Lot 17, qui
ne change que l'écran.

**Migration SQL et fonction Edge du Lot 14 appliquées/déployées par
l'utilisateur le 02/09/2026** — voir le détail (déploiement nettement plus
accidenté que prévu, 4 problèmes distincts rencontrés côté Supabase) dans
l'entrée « Lot 14 » en fin de fichier. Bouton individuel de récupération
d'illustration confirmé fonctionnel en conditions réelles par l'utilisateur.

**PROCHAINE REPRISE — reste à confirmer par l'utilisateur en conditions
réelles avant de considérer les Lots 12 à 17 définitivement clos :**
0. Migration `apps/affut/supabase/009-ordre-entrees-plat.sql` (correctif
   Lot 17bis) — **pas encore appliquée**, à faire pour que le tri à plat par
   `ordre` reproduise l'affichage actuel sur les numéros déjà en base (sans
   elle, l'ordre affiché peut sembler mélangé sur ces numéros tant qu'on n'a
   pas encore utilisé Monter/Descendre dessus).
1. Migration `apps/affut/supabase/008-numero-image.sql` (illustration du
   numéro, Lot 16) — **pas encore appliquée**, à faire avant de tester le
   nouveau champ « Illustration du numéro » en rédaction.
2. Les Lots 15 et 17 (carte « réseaux sociaux », mise en page à plat, grille
   2-3 colonnes) — vérifiés avec de vraies données via la session déjà
   ouverte dans le navigateur de cette session de travail (rendu correct :
   grille, pastilles de rubrique, tuile Sommaire cliquable), mais jamais
   testés par l'utilisateur lui-même.
3. Le bouton **« Récupérer les illustrations manquantes »** (traitement en
   masse, Lot 14) — jamais encore testé en conditions réelles, seulement
   en isolation.
4. Les Lots 12 et 13 (chiffres clés éditables en place, écran Bilan) —
   toujours en attente d'une confirmation en conditions réelles de
   rédaction (voir leurs entrées respectives).

Aucun autre point de backlog planifié après ça — prochaine session à
définir avec l'utilisateur.

**Lot 18 (mobile, vue publique) démarré le 02/09/2026 — EN COURS, pas
terminé.** Demande explicite de l'utilisateur : soigner la mise en page
mobile des 3 écrans de consultation (Sommaire, lecture d'un numéro,
Rechercher) — c'est l'usage principal réel de l'app (terrain, testé sur
Samsung Galaxy XCover4s). Voir l'entrée « Lot 18 » en fin de fichier pour
le détail : 2 correctifs faits et vérifiés en navigateur (page d'accueil
qui atterrissait sur une page vide → Sommaire par défaut ; débordement
horizontal de toute l'app sur l'en-tête de mois du Sommaire). L'audit du
**rendu des cartes d'entrée sur mobile n'a pas pu être vérifié
visuellement** : les 2 numéros publiés en base sont actuellement sans
aucune entrée (dépôt de test/démarrage) — seule une revue de code du CSS
existant a pu être faite pour cet écran. À la prochaine reprise : soit
demander à l'utilisateur de regarder lui-même sur un numéro qui a de
vraies entrées, soit repasser avec des données de test.

## État au 01/09/2026

**Fait :** Lots 1 à 7 complets. Lots 1-5 : page numéro, persistance,
sommaire/recherche, sources suivies + impression PDF via jsPDF, audit RGAA.
**Lots 6+7 (bascule Supabase + accès rédaction) codés le 31/08/2026** :
front `apps/affut/index.html` entièrement migré de `localStorage` vers
Supabase (écran de connexion, lecture via les vues publiques hors session,
lecture/écriture directe des tables de base une fois rédacteur actif
authentifié, compteurs de fréquentation branchés, bouton « + Nouveau
numéro » avec sélecteur de semaine natif pour amorcer une base qui démarre
vide) — détail complet dans les entrées « Lot 6 »/« Lot 7 » ci-dessous.
**Connexion confirmée fonctionnelle par l'utilisateur** (whitelist
`affut_emails_autorises` copiée depuis celle d'organisation-cours, comptes
activés directement en SQL Editor sans attendre leur 1re connexion).
**CRUD rédacteur validé manuellement par l'utilisateur le 31/08/2026**
(création de numéro, entrée, publication, sources suivies) — le Lot 6/7
est donc entièrement clos, plus rien en attente de validation dessus.

**Lot 8 ENTIÈREMENT opérationnel et validé en conditions réelles le
31/08/2026** — voir l'entrée « Lot 8 » ci-dessous pour le détail complet :
1. Brief éditorial versionné (`apps/affut/documents/brief-veille.md`, relu
   et amendé par l'utilisateur) et capture du motif d'écart d'un candidat
   de moisson (table `affut_candidats_ecartes`, migration
   `004-candidats-ecartes.sql`, appliquée).
2. `apps/affut/` committé et poussé sur GitHub pour la première fois
   (PR #53, #55, #56, mergées sur `main` le 31/08/2026) — nécessaire pour
   qu'une routine cloud puisse lire le brief depuis son checkout.
   Configuration machine faite dans la foulée (identité git, `gh` CLI +
   `gh auth login`), plus rien à refaire pour les prochains commits/PR de
   ce poste.
3. **Architecture finale : la routine cloud n'a jamais accès à
   `service_role`.** Elle appelle une **Edge Function Supabase**
   (`affut-veille`, `apps/affut/supabase/functions/affut-veille/index.ts`)
   qui fait le travail privilégié en interne (service_role fournie
   automatiquement par la plateforme) ; la routine ne détient qu'un jeton
   étroit (`AFFUT_VEILLE_TOKEN`) qui n'autorise qu'un GET (contexte) et un
   POST (ajout de candidats à un brouillon) sur cette seule fonction —
   jamais un accès direct à la base. Fonction durcie (31/08/2026, après
   discussion sur le risque d'une fuite du jeton) : plafonds de taille par
   champ, 20 candidats max par appel, 100 par numéro, limite de fréquence
   réelle (10 appels/heure) — testée en conditions réelles (429 déclenché
   au 10e appel). `motif` reste exposé en lecture (décision assumée de
   l'utilisateur) ; l'écran Moisson rappelle ce risque au moment de la
   saisie du motif.
4. Routine cloud planifiée créée (skill `schedule`), id
   `trig_01MGPb4JdPKzBdA9nVf7bcT7`, nom `affut-veille-hebdo` —
   hebdomadaire, samedi 8h Paris (`0 6 * * 6` UTC), modèle Opus 5.
   `AFFUT_VEILLE_TOKEN` posé sur l'environnement cloud utilisé
   (`env_01US7dF8TxHiVbduaxdT74a8`, réglé en **« Network access: Full »**
   — voir plus bas, nécessaire pour que `WebFetch` marche). Prochaine
   exécution planifiée : 05/09/2026 (samedi), mais peut aussi être
   redéclenchée manuellement à tout moment (`RemoteTrigger action: run`).
5. **Premier run réel réussi le 31/08/2026** (après un faux départ dû à la
   politique réseau, voir plus bas) : **7 candidats déposés dans un
   numéro 2 en brouillon**, réparti sur les 4 rubriques, 4 sur 7 concernant
   la Bretagne — conforme au brief. Repère RGA : les 7 candidats de ce
   premier run datent d'avant le passage en « Network access: Full »,
   leurs URLs n'ont donc **pas** été vérifiées automatiquement (pas de
   test 404/paywall) — à vérifier manuellement avant de les retenir dans
   la Moisson. Les prochains runs (avec Full activé) feront cette
   vérification eux-mêmes.

**Piège réseau rencontré et résolu (31/08/2026)** — à connaître pour toute
future routine cloud qui doit utiliser `WebFetch`/`curl` vers des domaines
imprévisibles à l'avance : par défaut, un environnement cloud Claude Code
bloque tout accès réseau sortant sauf une allowlist. Ajouter un domaine
précis dans « Accès réseau » (fait d'abord pour l'hôte Supabase) ne suffit
**pas** pour un usage type veille web (des dizaines de sites imprévisibles) —
la vraie solution est de régler le sélecteur **« Network access » sur
« Full »** dans les réglages de l'environnement (`claude.ai/code` →
sélecteur d'environnement → engrenage → Network access → Full). C'est fait
sur `env_01US7dF8TxHiVbduaxdT74a8`, l'environnement utilisé par la routine.
Feedback envoyé sur l'absence de mécanisme de secret dédié pour les
routines simples (question distincte, voir historique `/feedback`).

**Lots 10 à 10quinquies (refonte Moisson, ordre manuel des entrées,
dépublier, rail retiré, nav à deux barres) ENTIÈREMENT clos et mergés sur
`main` le 01/09/2026** (PR #58 puis PR #62), testés en vrai navigateur
(skill `claude-in-chrome`) sur le vrai n°2 (7 candidats réels du Lot 8,
tous retenus et publiés). Les deux scripts SQL du lot (`006-ordre-
entrees.sql`, `fix-chiffres-candidats-legacy.sql`) ont été appliqués et
confirmés par l'utilisateur — plus rien en attente côté données ni côté
git pour ce thread de travail. Détail complet dans les entrées « Lot 10 »
à « Lot 10quinquies » ci-dessous.

**Lot 10sexies (boutons visibles sur la barre publique) fait le
01/09/2026, PAS ENCORE COMMITTÉ** — modification locale de
`apps/affut/index.html` (CSS `.bandeau-nav`), en attente de l'accord de
l'utilisateur pour committer/PR (voir entrée « Lot 10sexies » ci-dessous).

**PROCHAINE REPRISE — backlog du 01/09/2026, voir « Idées pour plus tard »
en fin de fichier pour le détail et l'ordre conseillé :**
1. Chiffres clés éditables **en place** (pas seulement via le formulaire
   modal, qui le permet déjà).
2. Espace bilan/analyse (vues + clics par entrée/numéro), nouvel onglet
   dans la barre connectée.
3. Miniature automatique pour une URL YouTube sur une entrée.
4. Images/illustrations générales sur une entrée (Supabase Storage).
5. Illustration dans les tuiles du Sommaire (reprend celle de la 1re
   entrée du numéro) — dépend du point 4.
**Rien commencé** : l'utilisateur a explicitement demandé de tout noter
avant un `/clear` de conversation, sans démarrer l'implémentation.

## Où trouver le cadrage

- `documents/promptveilleportail.md` — brief fonctionnel, modèle de
  données, règles métier, pile technique (Cloudflare + Supabase).
- `documents/GitHub repo et directions de design(5)/design_handoff_carnet_veille/`
  — dossier de passation design : `REGLES.md` (37 règles fermes),
  `JETONS.md` / `jetons.css` (préfixe `--cv-` dans les fichiers sources,
  produits avant l'arbitrage de nom — voir ci-dessous), captures d'écran,
  fichiers Claude Design `.dc.html`.

## Décisions arrêtées

- **Nom d'affichage : « À l'affût »**, sous-titre « carnet de veille
  naturaliste ». Le dossier de passation a été produit sous le nom
  « Carnet de veille naturaliste » avant cet arbitrage — son contenu visuel
  (couleurs, jetons, gabarits, règles, pictogramme) reste valable tel
  quel, seuls les textes portant l'ancien nom sont à adapter à
  l'implémentation.
- Accent **grenat `#8a2f39`**, papier chaud crème (`#fbf6ea` / `#fffdf6`)
  — écart assumé par rapport au papier froid des autres apps du portail,
  documenté dans `CLAUDE.md` racine et dans le README du handoff.
- Dossier de l'app : `apps/affut/` (pas `apps/carnet-de-veille` — conservé
  tel que créé avant le handoff).
- Tuile posée sur le portail (`portail/index.html`), statut *en chantier*.
- **Gabarit d'entrée retravaillé pendant le Lot 1** (écart assumé au
  dossier de passation, décidé le 30/08/2026) : le dossier montrait des
  cartes verticales pleine hauteur par entrée. En pratique une veille peut
  compter une douzaine d'entrées par semaine — le gabarit retenu est une
  **ligne aplatie** (source/échelle/date, titre, chiffres clés compacts,
  résumé, bouton « Ouvrir la source ») pour en voir plusieurs d'un coup à
  l'écran. **Aucun repli/dépliage** : tout le contenu retenu (résumé,
  cartouche « ce qu'on trouve », et en rédaction « Usage en cours » + le
  panneau de décochage) est toujours affiché — en vue publiée, la seule
  action possible sur une entrée est d'ouvrir la source.
- **Titres d'entrée en grenat** en vue publiée (redevenant couleur encre
  neutre en rédaction, pour ne pas les confondre avec un champ éditable).
- **Numéro du carnet (`n° 12`) en grosse pastille** sur fond plein dans
  l'en-tête, plutôt qu'en simple texte mono.
- **Palette de rédaction distincte** : accent **ambre `#8a5f17`** (repris
  du statut « en chantier » du portail, nouveau jeton `--af-redaction` /
  `--af-sur-redaction`, absent du `jetons.css` d'origine) + papier plus
  neutre/mat pour le cadre, le bandeau de mode et les boutons d'action —
  pour que rédaction et vue publiée ne soient jamais confondues d'un
  coup d'œil. Titres de section, halo de focus et liens « Réafficher »
  suivent aussi l'ambre en rédaction (le grenat reste l'accent de la vue
  publiée uniquement).
- Cadre desktop élargi par rapport aux gabarits fixes du dossier de
  passation (1000/1240px) : `1360px` en vue publiée, `1560px` en
  rédaction, pour profiter de la largeur d'écran (demandé le 30/08/2026).
- **Résumé sans balise `<em>`** (Lot 2, 30/08/2026) : le résumé est
  désormais toujours échappé (`esc()`) avant affichage, y compris en vue
  publiée, pour permettre l'édition en place sans risque d'injection.
  Conséquence assumée : plus de mise en italique automatique (ex.
  *Pinna nobilis* dans l'entrée e3) — à retraiter plus tard si besoin
  d'italique réel (ex. mini-syntaxe `*mot*` interprétée à l'affichage).
- **Chiffres clés et cartouche non éditables en place** (Lot 2) : leur
  édition passe uniquement par le formulaire modal (textarea « une ligne
  par élément », `valeur | libellé` + `*` final pour l'accent côté
  chiffres) — l'édition ligne à ligne inline aurait demandé une UI de
  liste à part entière, hors budget du lot.
- **Champ `url` ajouté à chaque entrée** (Lot 2) : le bouton « Ouvrir la
  source » utilise désormais ce champ (les 3 entrées de démo gardent une
  ancre `#e1`/`#e2`/`#e3` fictive, une vraie URL est attendue pour toute
  entrée saisie à la main).
- **Bouton « Réinitialiser les données de démonstration »** (Lot 2,
  rédaction uniquement) : vide le `localStorage` de l'app et recharge —
  outil de test, pas une fonctionnalité du brief.
- **Clé de stockage passée à `affut:numeros`** (Lot 3, 30/08/2026) : un
  tableau de numéros, chacun avec ses propres entrées, remplace la clé
  `affut:numero:12` du lot 2 (un seul numéro). Migration automatique et
  silencieuse au premier chargement : si l'ancienne clé existe, ses
  données (numéro 12) sont reprises dans le nouveau format puis
  l'ancienne clé est supprimée — pour ne pas perdre les données de test
  du lot 2.
- **8 numéros fictifs (n°5 à n°12)** ajoutés au jeu de démonstration
  (Lot 3), répartis sur juin/juillet/août 2026, pour peupler le sommaire
  (regroupement par mois) et donner de la matière à la recherche
  transversale (l'exemple « FEDER » remonte des résultats dans 3 numéros
  différents).
- **Pas de routage par URL/hash** (Lot 3) : la navigation numéro ↔
  sommaire ↔ recherche est un simple état en mémoire, pas de lien
  permanent vers un numéro ou une recherche donnée. À revoir si le besoin
  de partager un lien se présente.
- **Recherche déclenchée par soumission**, pas au fil de la frappe
  (Lot 3) : l'affichage se reconstruit entièrement à chaque rendu
  (`innerHTML`), une recherche « live » ferait perdre le focus du champ
  à chaque caractère tapé. Idem pour le filtre de rubrique et le bouton
  « titres seuls », qui relisent la valeur du champ avant de relancer.
- **Recherche filtrée par rubrique seulement** (Lot 3) : le dossier de
  passation propose aussi échelle et année scolaire, non repris —
  suffisant pour valider la navigation, les autres filtres pourront
  revenir plus tard.
- **« Les sources » de la recherche** = les documents des actualités
  trouvées, dédupliqués par URL (Lot 3), pas une recherche indépendante
  sur les seuls documents.
- **Sommaire et Recherche toujours en lecture publique** (Lot 3) : la
  bascule Rédaction / Vue publiée ne concerne que l'écran d'un numéro
  ouvert ; ces deux écrans ne montrent que les entrées validées et
  n'indexent jamais `usage_en_cours` (règle 11 du dossier de passation).
- **Ajustements visuels du sommaire** demandés après la première passe
  du Lot 3 (30/08/2026) : bouton « Ouvrir le numéro » stylé comme
  « Ouvrir la source » (fond accent plein + flèche) pour créer le même
  réflexe visuel ; icône chevron ▸ / ▾ sur le bouton Déplier/Replier des
  mois passés ; pastille du numéro (haut de la carte) en fond accent
  plein, en rappel de la pastille « N° » de l'en-tête d'un numéro ouvert ;
  semaine/date retirées sous le numéro de la carte (redondant avec le
  contenu de la carte) ; mention « mois replié : les titres apparaissent
  au dépliage » supprimée ; survol des puces de mois repliés en fond
  accent plein + texte clair (au lieu d'un simple changement de couleur
  de bordure/texte).
- **QR codes générés à la volée avec une bibliothèque vendorisée** (Lot 4,
  30/08/2026) : `apps/affut/vendor/qrcode.js` (Kazuhiko Arase, licence MIT,
  fichier unique sans dépendance) plutôt qu'un service tiers en ligne
  (cohérent avec l'app hors-ligne et `localStorage`) ou une image bitmap
  pré-générée (interdite par la règle 20 hors QR). Le type de QR n'est pas
  auto-détecté par la bibliothèque : `makeQr()` essaie les tailles de la
  plus petite à la plus grande jusqu'à ce que l'adresse tienne.
- **Statut `brouillon` / `publie` ajouté au numéro** (Lot 4) : un numéro
  `brouillon` n'apparaît ni au Sommaire, ni dans la Recherche, ni comme
  « dernier numéro » (voir `numerosPublies()`). Un **numéro 13 fictif**,
  brouillon avec sa moisson de 6 candidats et son statut de collecte, sert
  de terrain d'exercice organique aux états limites ②③④ — atteignable en
  rédaction via le lien « Ouvrir le n° 13 (brouillon en préparation) ».
- **Choix entre les états ③ (rien de neuf) et ④ (collecte en échec) simulé
  par un sélecteur dev** (Lot 4), faute d'un vrai job de collecte (prévu
  au Lot 8) : les deux résultats sont mutuellement exclusifs pour un même
  brouillon, on ne peut pas les déclencher tous les deux « naturellement »
  sans un vrai historique de collectes. L'état ① (tout premier lancement)
  n'a pas d'équivalent organique du tout — 8 numéros de démonstration sont
  déjà publiés — et se prévisualise via un lien dev dédié qui ne touche
  pas aux données réelles (pur bascule d'affichage, `state.previewEtat`).
- **Le bouton « Publier le n° X » fonctionne enfin** (Lot 4) : il n'avait
  aucun `data-action` depuis le Lot 1 (bouton mort). Il valide maintenant
  chaque entrée retenue (lien mort ou bloc source vide → publication
  refusée, état ⑥, avec renvoi vers la première entrée fautive) puis
  passe le numéro en `statut: "publie"`.
- **Groupement des sources suivies par ratio, pas à la main** (Lot 4,
  écran 5a) : une source rejoint « rien de retenu depuis longtemps » si
  son ratio retenues/rapportées est sous 5 % (seuil choisi pour reproduire
  exactement le regroupement de la maquette avec les compteurs fournis).
  Les actions (Réessayer, Modifier, Ne plus suivre, Relancer la collecte,
  + Suivre une source) écrivent réellement dans `sourcesSuivies` et
  persistent, mais **simulent** le résultat (pas de vraie collecte
  réseau — prévue au Lot 8).
- **Recherche sans résultat (état ⑤)** : pas de suggestions par synonyme
  (« essayer chauve-souris… ») faute d'un vrai index des mots du carnet
  (Known Gap n°2 du dossier de passation) — seul le rappel du filtre de
  rubrique actif est affiché, avec le nombre de numéros qu'il exclurait.
- **`.usage` masqué à l'impression sans condition de mode** (Lot 4,
  défense en profondeur pour la règle 11) : `renderUsage()` l'exclut déjà
  du DOM hors rédaction, mais un déclenchement manuel de l'impression
  (Ctrl+P) depuis la vue rédaction ne doit dans aucun cas exposer
  l'encadré privé — la feuille de style d'impression le cache donc aussi,
  quel que soit le mode.
- **Impression pensée pour la vue publiée, pas testée depuis la
  rédaction** (Lot 4) : un Ctrl+P manuel pendant la rédaction reste
  fonctionnel et sans fuite de données (voir ci-dessus) mais peut laisser
  une mise en page imparfaite. Pagination statique « page 1/1 » (voir
  Known Gaps du dossier de passation, point 5) : un numéro qui
  déborderait sur plusieurs pages A4 n'est pas encore géré (revu au
  Lot 4quater).
- **Lot 4bis, retour d'usage du 30/08/2026** : après relecture du Lot 4
  par l'enseignant, plusieurs simplifications ont été demandées et
  appliquées, avec des écarts assumés par rapport au dossier de
  passation d'origine :
  - **Champ « Ce qu'on trouve dans le document » (cartouche) supprimé
    entièrement** : formulaire, affichage, indexation recherche, modèle
    de données. Écart assumé par rapport aux règles 4/9/10/14 du dossier
    de passation, qui reposaient sur ce cartouche comme second niveau de
    lecture ; le résumé factuel reste donc le seul texte de fond d'une
    entrée.
  - **Panneau latéral « Ce qui part dans le numéro » supprimé** : il
    faisait doublon avec la case « Entrée retenue » (déjà portée par la
    case à cocher à gauche de chaque ligne) et avec les bandeaux
    « Réafficher » déjà présents dans le corps. Deux de ses réglages
    (« Rail d'identification », « Chapô ») se sont révélés **morts** en
    l'auditant : ils ne pilotaient déjà aucun affichage réel — pas une
    régression du lot, un bug latent depuis le Lot 2. Seuls les blocs
    Chiffres clés et Résumé restent effectivement masquables.
  - **Deuxième passe (30/08/2026, retour d'usage)** : les boutons
    Masquer/Réafficher de la première passe ont été remplacés par une
    **case à cocher** posée à gauche de chaque bloc (chiffres, résumé),
    sur le même principe que la case « Entrée retenue » mais avec un
    style distinct (teinte encre neutre, classe `.case-bloc`, plutôt
    que l'amber de rédaction de la case de validation) pour ne pas
    confondre « ce qui s'affiche » et « ce qui est retenu pour le
    numéro ». Un seul type de contrôle, toujours au même endroit.
  - **Échelle retirée du formulaire d'entrée**, seul le Territoire est
    conservé (`source.echelle` disparaît du modèle des entrées — la
    pastille d'identification n'affiche plus que le territoire, ou rien
    s'il est vide). Cette simplification ne touche pas les *sources
    suivies* (écran du Lot 4), qui gardent leur propre champ Échelle.
  - **Domaine affiché déduit de l'URL** : en saisie, taper ou coller une
    adresse dans « Adresse de la source (URL) » remplit automatiquement
    « Domaine affiché » (nom d'hôte, sans `www.`) tant que ce champ est
    encore vide ; une valeur déjà présente (saisie à la main, ou reprise
    en modification d'une entrée existante) n'est jamais écrasée. L'aide
    du champ l'indique explicitement.
  - **« Nature du document » et « Libellé du document » (`sourceDoc`)
    supprimés** du formulaire, de l'affichage de l'entrée et du rail des
    sources (qui utilise désormais le titre de l'entrée à la place).
  - **Bouton « Supprimer cette entrée » retiré du formulaire de
    modification** : l'action existe déjà au niveau de la ligne de
    l'entrée, à côté du bouton source — la doublonner dans la modale
    n'apportait rien.
  - **Résumé du numéro (chapô) et bouton « Imprimer ce numéro » retirés
    de l'en-tête en vue publiée** : le chapô reste éditable en
    rédaction (pas d'autre usage identifié pour l'instant), l'impression
    reste accessible par le raccourci navigateur natif (Ctrl+P), qui
    applique déjà la feuille `@media print` — sans bouton dédié en
    attendant la refonte de l'impression (Lot 4quater).
  - **Bug corrigé, signalé par capture d'écran** : `.print-numero` et
    `.print-semaine` (bandeau d'impression : gros n°/titre, puis semaine
    + date + décompte) n'avaient jamais reçu de `display:none` hors
    `@media print`, contrairement à `.print-entete`/`.print-pied` — ils
    s'affichaient donc en texte brut, sans style, juste sous le titre du
    numéro en vue publiée, dupliquant l'en-tête réel. En corrigeant,
    `.print-semaine` n'avait pas non plus de `display` déclaré à
    l'intérieur de `@media print` : sans le `display:none` extérieur ça
    ne se voyait pas, mais ça aurait aussi disparu à l'impression réelle
    une fois le premier bug corrigé — les deux sont réglés ensemble.
  - **Bouton « Ouvrir la source » agrandi en vue publiée (30/08/2026)** :
    il occupe désormais toute la hauteur du bandeau de l'entrée (bandeau
    en deux zones — contenu à gauche, bouton plein à droite — plutôt
    qu'un bouton posé en encart dans le bandeau), avec un texte plus
    grand. La rédaction garde le bouton compact d'origine. Nouveau
    conteneur `.entree-row-gauche` (contenu paddé) séparé de
    `.entree-row` (qui ne porte plus lui-même de padding, pour permettre
    l'étirement en pleine hauteur du bouton).
  - **Troisième passe (30/08/2026, retour d'usage)** :
    - En-tête du numéro : la semaine/date, qui était affichée à côté de
      la pastille N°, en est retirée — la pastille et le titre du numéro
      sont désormais sur la même ligne (`entete-num-ligne` contient
      maintenant le `<h1>`), la semaine/date passe en ligne dédiée juste
      en dessous.
    - Rédaction : Modifier/Supprimer ne sont plus une colonne de liens à
      droite du bouton source, mais **deux boutons posés sous le bouton
      source**, dont la largeur cumulée égale exactement celle du
      bouton (bords extérieurs alignés) — nouveau conteneur
      `.entree-row-droite` (colonne : bouton source, puis les deux
      actions), nouvelle classe `.btn-mini` (bordée, pleine largeur de
      sa moitié) qui remplace `.lien-action` pour ces deux boutons
      précis (le reste de l'app garde `.lien-action` tel quel).

## Lots de travail

Chaque lot vise une session, avec une fin vérifiable dans le navigateur.
Cocher au fur et à mesure, noter les écarts/décisions prises pendant le lot.

- [x] **Lot 1 — Page « Numéro »** : un numéro (n°12 du brief), données en
      dur, pas de backend, pas de persistance (`apps/affut/index.html`
      entièrement réécrit). Bascule rédaction ↔ publiée en direct, bloc
      source verrouillé (≥56px), cartouche/chiffres décochables via le
      panneau de rédaction, encadré « Usage en cours » jamais rendu hors
      rédaction (absent du DOM, pas juste masqué en CSS), gabarits bureau
      + mobile. Voir « Décisions arrêtées » ci-dessus pour les écarts de
      gabarit/interaction validés en cours de route.
      *Validé le 30/08/2026* par test visuel dans le navigateur (serveur
      statique local `python3 -m http.server` dans `apps/affut/` — pas de
      Node/navigateur pilotable dans l'environnement Claude Code).
      *Restant volontairement simplifié* : pas de moisson/brouillons/liens
      morts (une seule « vague » de 3 entrées), Sommaire/Recherche en
      chrome inerte (renvoyés au Lot 3), contenteditable techniquement
      actif même hors rédaction (sans effet visible, à durcir si besoin
      au Lot 5/accessibilité).
- [x] **Lot 2 — Persistance + formulaire d'entrée** : les données du
      numéro (`numero` + `entrees`) sont chargées/sauvées dans
      `localStorage` (clé `affut:numero:12`) à chaque modification.
      Formulaire modal (rédaction seule) pour ajouter, modifier ou
      supprimer une entrée (rubrique, source, URL, titre, chiffres,
      résumé, cartouche, document, usage). Édition en place généralisée
      et fonctionnelle (titre du numéro, semaine, chapô, nom/date de
      source, titre d'entrée, résumé, lignes de cartouche, usage en
      cours) : les modifications écrivent réellement dans le modèle et
      persistent au rechargement. Voir « Décisions arrêtées » ci-dessus
      pour les simplifications assumées (résumé en texte brut, chiffres/
      cartouche édités seulement via le formulaire).
      *Validé le 30/08/2026* par test manuel dans le navigateur (ajout,
      modification, suppression, édition en place, rechargement de page).
- [x] **Lot 3 — Sommaire + recherche** : 8 numéros fictifs (n°5 à n°12),
      écran Sommaire regroupé par mois (mois le plus récent déplié, les
      précédents repliés en puces avec bouton Déplier/Replier à chevron),
      écran Recherche transversale (actualités + leurs sources, filtre
      par rubrique, surlignage ambre des correspondances). Navigation
      numéro ↔ sommaire ↔ recherche via le bandeau (logo + liens Sommaire/
      Rechercher) et les boutons « Ouvrir le numéro » / « Parue dans n° X ».
      Voir « Décisions arrêtées » ci-dessus pour le détail des
      simplifications et des ajustements visuels.
      *Validé le 30/08/2026* par test manuel dans le navigateur
      (navigation numéro → sommaire → recherche → numéro, recherche
      « FEDER » remontant plusieurs numéros, dépliage des mois passés).
- [x] **Lot 4 — Sources suivies, états limites, impression** : écran
      « Sources » (14 sources, groupées en échec / rien de retenu depuis
      longtemps / rien à décider, actions Réessayer/Modifier/Ne plus
      suivre/Relancer la collecte/+ Suivre une source) ; les 6 états
      limites (① premier lancement et ②③④ moisson/collecte du numéro en
      cours via le nouveau numéro 13 brouillon, ⑤ recherche sans
      résultat restylée, ⑥ publication refusée — qui rend enfin
      fonctionnel le bouton « Publier ») ; feuille d'impression A4 avec
      QR codes générés à la volée (`vendor/qrcode.js`) et bandeau/panneau
      masqués. Voir « Décisions arrêtées » ci-dessus pour le détail des
      simplifications (sélecteur dev pour ③/④, aperçu dev pour ①, pas de
      vraie collecte réseau, pagination d'impression statique).
      *Validé le 30/08/2026* par relecture de code et vérification
      d'équilibrage des accolades/parenthèses (pas de navigateur pilotable
      dans l'environnement Claude Code, comme au Lot 1) — **à revalider
      manuellement dans un vrai navigateur** avant de considérer le lot
      définitivement clos (voir note ci-dessous).
- [x] **Lot 4bis — Simplifier l'entrée (affichage + formulaire)** :
      retrait du cartouche « ce qu'on trouve dans le document », du
      panneau latéral de composition (remplacé par un bouton
      Masquer/Afficher inline sur les deux blocs qui le méritent encore,
      chiffres et résumé), de l'Échelle et du bloc « nature/libellé du
      document » de l'entrée, du bouton Supprimer en doublon dans la
      modale, et du chapô + bouton Imprimer en vue publiée. Domaine
      affiché déduit automatiquement de l'URL saisie. Voir « Décisions
      arrêtées » ci-dessus pour le détail des écarts assumés.
      *Fin :* formulaire d'entrée réduit à Rubrique / Source / Territoire
      / URL / Domaine / Date / Titre / Chiffres clés / Résumé / Usage en
      cours ; plus de panneau latéral.
      *Validé le 30/08/2026* par relecture de code et vérification
      d'équilibrage des accolades/parenthèses (pas de navigateur pilotable
      dans l'environnement Claude Code) — **à revalider manuellement dans
      un vrai navigateur**.
- [x] **Lot 4ter — Navigation entre numéros en rédaction** : remplacer le
      lien unique vers « le » brouillon par un sélecteur listant tous les
      numéros (publiés et brouillons), pour travailler sur plusieurs
      numéros en parallèle.
      *Fin :* changer de numéro en rédaction en un seul geste, quel que
      soit le nombre de brouillons en cours.
      *Fait le 30/08/2026* : le lien unique « Ouvrir le n° X (brouillon
      en préparation) » — qui ne pointait que vers le premier brouillon
      trouvé, et disparaissait dès qu'on l'ouvrait — est remplacé par un
      menu déroulant `<select>` (« Numéro en cours ») en tête de la
      colonne d'actions, listant **tous** les numéros existants triés du
      plus récent au plus ancien, chacun étiqueté `n° X · brouillon` ou
      `n° X · sem. NN` selon son statut, avec le numéro affiché
      pré-sélectionné. Choisir une option change `state.numeroId` et
      recharge la page numéro (`data-action="changer-numero"`, geste
      unique, aucune navigation intermédiaire par le sommaire). Fonctionne
      pour un nombre quelconque de brouillons en parallèle (le cas visé —
      décaler des entrées vers un numéro suivant — n'était pas couvert par
      l'ancien lien qui ne gérait qu'un seul brouillon à la fois).
      Le déplacement d'une entrée d'un numéro à un autre n'est **pas**
      inclus (réponse du 30/08/2026 : « le sélecteur seulement pour
      l'instant ») — seul le changement de numéro affiché l'est.
      *Validé le 30/08/2026* par relecture de code et vérification
      d'équilibrage des accolades/parenthèses (pas de navigateur pilotable
      dans l'environnement Claude Code) — **à revalider manuellement dans
      un vrai navigateur**.
- [x] **Lot 4quater — Impression en grille visuelle** : cartes de largeur
      fixe (2 colonnes), hauteur libre, contenu allégé (source, date,
      titre, résumé court, QR + domaine), en-tête de page compacté.
      *Fin :* aperçu avant impression (Ctrl+P) lisible en grille, QR
      fonctionnels.
      *Fait le 30/08/2026* (réponse retenue : « largeur fixe, hauteur
      libre ») :
      - **Grille 2 colonnes** : `.colonne{column-count:2;column-gap:10mm}`
        en `@media print` — mise en page « journal » (largeur de colonne
        fixe, chaque carte garde sa hauteur naturelle, pas de grille à
        cellules égales). Chaque entrée (`.entree{break-inside:avoid}`) et
        chaque en-tête de rubrique (`break-after:avoid-column`) évitent
        d'être coupés entre deux colonnes/pages.
      - **Cartes bordées** : chaque `.entree` devient un encart avec bordure
        complète (`border:1px solid`) et padding resserré, au lieu de
        l'ancien simple filet horizontal pleine largeur.
      - **Contenu allégé à l'impression**, conformément à la liste
        retenue (source, date, titre, résumé court, QR + domaine) :
        territoire (`.pastille-echelle`), chiffres clés (`.flat-chiffres`)
        et le texte de remplacement « masqué » (`.bloc-masque-texte`) sont
        masqués en `@media print` (le bouton source, les actions
        modifier/supprimer, l'état validé/en attente l'étaient déjà). Le
        résumé est tronqué à 4 lignes (`-webkit-line-clamp`) pour garder
        des cartes de hauteur raisonnable.
      - **En-tête de page compacté** : les 3 bandeaux empilés (ligne
        organisme+date, gros n°/titre en 34px, ligne semaine) sont
        remplacés par un bloc à 2 lignes (`.print-ligne1` : mention
        organisme, petite et discrète ; `.print-ligne2` : n°+titre à
        gauche, semaine/nombre d'actualités/date d'impression à droite) —
        un seul filet de séparation au lieu de deux. Le pied de page (QR
        du carnet) est aussi resserré (SVG 28px au lieu de 34px).
      *Non traité* : le sommaire visé à l'origine (« 4 entrées par page
      A4 ») n'est pas un objectif chiffré fixe ici — le nombre d'entrées
      par page dépend de la longueur de chaque résumé, conformément au
      choix « hauteur libre » ; un contenu très court peut en tenir plus
      de 4, un résumé proche de la limite de troncature un peu moins.
      *Validé le 30/08/2026* par relecture de code, vérification
      d'équilibrage des accolades CSS/JS et test HTTP local (pas de
      navigateur pilotable dans l'environnement Claude Code, et l'aperçu
      avant impression n'est de toute façon accessible que dans un vrai
      navigateur) — **à revalider manuellement via Ctrl+P dans un vrai
      navigateur**.
      *Deuxième passe (30/08/2026, retour d'usage sur capture d'écran)* :
      - **Cadre allégé** : `.entree` n'a plus de bordure complète (encart)
        mais un simple filet en bas de carte ; `.qr-impression` n'a plus
        sa propre bordure complète non plus mais un simple filet en haut,
        pour ne plus avoir un encart QR imbriqué dans l'encart de la
        carte.
      - **QR codes agrandis** : 52px → **80px** (la place libérée par la
        suppression des cadres imbriqués le permettait).
      - **Résumé justifié** : `.flat-resume` passe en `text-align:justify`
        avec `hyphens:auto` (page en `lang="fr"`) pour de meilleures
        coupures de mots ; `text-indent:0` explicite pour garantir
        qu'aucun retrait ne s'introduit en début de paragraphe.
      - **Bug d'alignement corrigé** : la répartition automatique du
        navigateur entre les 2 colonnes CSS pouvait laisser le titre
        d'une rubrique seul en bas d'une colonne pendant que sa carte
        partait seule en haut de la colonne suivante (`break-after` seul
        ne suffisait pas à empêcher ça). Le titre de rubrique et sa
        **première** entrée sont maintenant regroupés dans un même bloc
        `.rubrique-groupe-tete` avec `break-inside:avoid`, qui les force
        à rester ensemble dans la même colonne ; les entrées suivantes de
        la rubrique restent libres de continuer sur la colonne d'après.
      *Validé le 30/08/2026* par relecture de code et vérification
      d'équilibrage (mêmes limites d'environnement que ci-dessus) — **à
      revalider manuellement via Ctrl+P**.
      *Troisième passe (30/08/2026)* — **bascule sur jsPDF** : le rendu
      CSS `@media print` restait insatisfaisant malgré deux passes de
      correction (retour d'usage sur capture d'écran : cadres imbriqués,
      colonnes mal réparties). Décision : reprendre la solution qui avait
      déjà réglé le même problème sur organisation-cours pour l'ordre de
      mission (Lot C, commit `6257c18`, 23/08/2026) — dessiner le document
      au mm près avec **jsPDF** plutôt que de compter sur le moteur
      d'impression du navigateur.
      - **Bouton « Imprimer ce numéro »** ajouté dans la barre d'actions
        de la vue rédaction (à côté de « + Ajouter une entrée »),
        déclenche la génération du PDF puis l'imprime via un `<iframe>`
        invisible + URL blob (même technique que
        `missionImprimerDoc`/`missionImprimerPdf` dans
        `organisation-cours/app.js`).
      - **Grille 2 colonnes reproduite en coordonnées mm** :
        `numeroGenererPdfDoc()` construit des blocs (titre de rubrique +
        1re entrée regroupés de façon insécable, puis les entrées
        suivantes) et les répartit colonne par colonne, page par page,
        en mesurant à l'avance la hauteur de chaque bloc
        (`pdfPreparerEntree()`) — a supprimé le bug d'alignement observé
        avec `column-count` CSS (impossible par construction : c'est nous
        qui décidons du saut de colonne/page, pas le moteur du
        navigateur).
      - **QR codes en vecteur, pas en image** : dessinés module par module
        avec `doc.rect()` d'après `qr.isDark()/getModuleCount()` de
        `vendor/qrcode.js` (déjà utilisé pour les QR HTML) — plus net
        qu'un bitmap, pas de conversion SVG→image à gérer.
      - **Résumé justifié** avec troncature propre (ellipse ajoutée au mm
        près via `getTextWidth`) quand il dépasse 4 lignes ; la dernière
        ligne n'est **pas** justifiée quand c'est la fin naturelle du
        paragraphe (évite l'effet de mots trop espacés sur une ligne
        courte — limite connue de la justification PDF).
      - **Contenu toujours filtré sur `e.valide`**, même déclenché depuis
        la rédaction (contrairement à l'écran, qui y affiche aussi les
        entrées non retenues) : le PDF représente toujours le numéro tel
        qu'il sera lu par les élèves, jamais un brouillon de tri.
      - **Le CSS `@media print` existant n'a pas été supprimé** : il reste
        en secours pour un Ctrl+P direct hors du bouton (raccourci
        clavier natif du navigateur), mais n'est plus le chemin
        recommandé — c'est désormais le bouton qui fait foi.
      - Nouvelle dépendance : `jspdf.umd.min.js` (v2.5.1, CDN cdnjs) —
        même version que celle déjà utilisée par organisation-cours.
      *Validé le 30/08/2026* par relecture de code et vérification
      d'équilibrage des accolades (pas de navigateur pilotable dans
      l'environnement Claude Code) — **à revalider manuellement dans un
      vrai navigateur** (bouton Imprimer, plusieurs numéros de longueurs
      différentes pour vérifier la pagination multi-page).
      *Quatrième passe (30/08/2026, retour d'usage sur le PDF généré)* —
      **grille 2 colonnes abandonnée au profit d'une colonne pleine
      largeur** : avec peu d'entrées (le n°12 de démonstration en a 3),
      la 2 colonnes laissait la seconde à moitié — voire totalement —
      vide, ce qui n'a de sens que si le numéro a assez d'entrées pour
      remplir les deux. Remplacé par :
      - **Une seule colonne**, chaque entrée sur toute la largeur utile
        de la page (`PDF_PAGE_W - 2×PDF_MARGE_X`, soit 178mm).
      - **Chaque entrée coupée en 2 blocs côte à côte** au lieu d'un
        empilement vertical : **2/3 gauche** (domaine/date, titre,
        résumé justifié) et **1/3 droite** de largeur fixe (52mm,
        `PDF_ENTREE_DROITE_W`) avec le **QR agrandi** (28mm, centré) et
        le domaine + « Flasher pour ouvrir la source » en dessous. La
        hauteur de l'entrée est le max des deux blocs (`pdfPreparerEntree`
        calcule les deux avant de dessiner), avec un filet de séparation
        sous l'ensemble.
      - **Pied de page remonté** : il débordait quasiment du bord
        physique de la feuille (marge basse de 16mm, texte dessiné
        au-delà). Marge basse portée à 26mm et pied redessiné à
        l'intérieur de cette marge (6mm sous la limite de contenu, donc
        ~20mm du bord réel) au lieu de la déborder.
      - La pagination reste par mesure de hauteur (plus de notion de
        colonne à gérer : un seul `y` courant, saut de page dès qu'un
        bloc ne tient plus).
      *Validé le 30/08/2026* par relecture de code et vérification
      d'équilibrage (mêmes limites d'environnement que ci-dessus) — **à
      revalider manuellement dans un vrai navigateur**.
      *Cinquième passe (30/08/2026, retour d'usage : « trop de lignes
      horizontales »)* : avec 3 rubriques à 1 entrée chacune, le PDF
      dessinait 11 filets (1 sous l'en-tête + 2 par rubrique + 1 par
      entrée + 1 en pied de page). Réduit à 5 :
      - **`pdfDessinerRubriqueTete`** ne trace plus qu'**un seul filet**,
        sous le libellé — celui du dessus faisait doublon avec le
        séparateur de l'entrée précédente juste au-dessus.
      - **`pdfDessinerEntree`** ne trace plus de filet du tout sous la
        carte ; l'espacement déjà prévu dans `layout.hauteur` (~8mm)
        suffit à distinguer deux entrées d'une même rubrique.
      - Restent seulement : le filet sous l'en-tête de page et celui du
        pied de page (1 chacun, un seul par page).
      *Validé le 30/08/2026* par relecture de code et vérification
      d'équilibrage (mêmes limites d'environnement que ci-dessus) — **à
      revalider manuellement dans un vrai navigateur**.
- [x] **Lot 5 — Portail + accessibilité** : audit RGAA (contrastes,
      clavier, focus, titres), responsive final.
      *Fin :* audit accessibilité passé.
      *Fait le 30/08/2026* — **volet accessibilité uniquement** : le
      raccordement au portail commun (`portail/`) n'a pas été touché dans
      cette passe, elle ne concerne que `apps/affut/index.html`. Audit
      mené par relecture de code et calculs de contraste WCAG (pas de
      navigateur, lecteur d'écran ou vrai appareil disponible dans cet
      environnement — **à revalider manuellement**, notamment au clavier
      et avec un lecteur d'écran réel). Trouvailles corrigées :
      - **Contraste insuffisant** : `--af-filet-fort` (bordures des
        champs de saisie, de la barre de recherche, de plusieurs
        boutons) ne tenait que 2,3:1 sur `--af-surface`, sous le seuil
        3:1 exigé par le WCAG 1.4.11 pour les limites de composants
        d'interface. Assombri en `#9b8655` (3,5:1). Les autres paires
        texte/fond de la palette ont été vérifiées et tiennent toutes
        largement le 4,5:1 du texte normal.
      - **Focus clavier invisible** : le champ de recherche
        (`.recherche-champ-texte input`) supprimait son contour de focus
        (`outline:none`) sans le remplacer par quoi que ce soit — un
        utilisateur au clavier perdait toute indication visuelle en
        l'atteignant. Ajout d'un contour sur tout l'encadré au focus
        (`:focus-within`).
      - **Modales sans gestion du focus** : `render()` reconstruit tout
        le DOM à chaque appel (`innerHTML`), donc ouvrir une modale ne
        déplaçait jamais le focus clavier dedans — il restait perdu en
        haut de page, la modale n'étant jamais atteinte au Tab suivant.
        Les 4 conteneurs `role="dialog"` reçoivent maintenant
        `tabindex="-1"` et le focus y est envoyé automatiquement, mais
        **seulement à l'ouverture** (un repère compare la modale du
        rendu précédent à celle du rendu courant, sinon on arracherait
        le focus au champ en cours de saisie à chaque re-rendu sans
        rapport, ex. cocher une case pendant que la modale est ouverte).
        Fermeture déjà au clavier (Échap) depuis le lot 4 — non touché.
      - **Champs éditables sans sémantique** : les `<span
        contenteditable>` de la rédaction (titre, résumé, dates…) n'ont
        par défaut aucun rôle de champ de saisie pour un lecteur d'écran.
        `role="textbox"` ajouté une fois dans `ed()`, qui génère tous ces
        champs.
      - **Champ de recherche sans étiquette** : le texte « Chercher dans
        tous les numéros » était un `<div>` décoratif, pas un `<label>`
        relié à l'input (seul un `placeholder` l'accompagnait — pas un
        substitut valable au WCAG 3.3.2 / RGAA 11.1). Devenu un vrai
        `<label for="recherche-q">`.
      - **Titres de page manquants** : Sommaire, Recherche et Sources
        suivies n'avaient aucun `<h1>` (seul le bandeau de navigation,
        pas une vraie structure de titres, signalait la page active) —
        ajout d'un `<h1>` visuellement masqué (`.sr-only`, sans impact
        visuel) sur les 3. Les 2 écrans d'état limite qui s'affichent
        seuls, sans l'en-tête habituel (numéro pas encore publié, tout
        premier lancement), utilisaient un `<h2>` sans aucun `<h1>`
        parent — passés en `<h1>` (les `<h2>` des autres états limites,
        eux bien nichés sous l'en-tête du numéro, restent des `<h2>`).
      *Non corrigé, à traiter dans une prochaine passe si besoin* :
      pas de piège à focus (Tab cycle hors de la modale ouverte au lieu
      d'y rester confiné) ; le focus n'est pas restitué au bouton
      déclencheur à la fermeture d'une modale ; taille de cible tactile
      des petits boutons (`.btn-mini` notamment) sous les 24×24px
      recommandés par le WCAG 2.5.8 — hors du périmètre du RGAA (basé sur
      WCAG 2.1, qui n'a pas ce critère), signalé à titre indicatif.
      Responsive : le point de rupture à 640px existant a été relu mais
      pas revérifié à l'œil sur un vrai appareil (même limite
      d'environnement) — en particulier les ajouts récents (bouton
      Imprimer, sélecteur de numéro, entree-row-droite).
- [x] **Lot 6 — Bascule Supabase** : tables `numeros`/`entrees`/
      `ingestion_log`, RLS, vue publique sans `usage_en_cours`, migration
      du front (modèle PhytoScope).
      *Fin :* le test anonyme (pas de fuite `usage_en_cours` / entrée non
      validée) passe.
      *Décisions actées (30/08/2026)* :
      - **Projet Supabase** : réutilisation du projet **`portail`**
        (org btsgpn-kerplouz), déjà utilisé par organisation-cours —
        l'org est au quota gratuit de 2 projets (`portail` + Phytoscope),
        un 3e projet dédié à affut demanderait de passer payant. Tables
        préfixées `affut_`.
      - **Lot 6 + Lot 7 combinés** : pas d'écriture publique exposée même
        temporairement (contrairement à PhytoScope actuellement) — le
        schéma et l'authentification sont posés dans la même passe avant
        toute bascule active du front.
      - **Nouvelle demande instruite dans la foulée** (mémoire
        `affut-bilan-vues-redaction`, notée le 29/08/2026) : compteurs de
        fréquentation — vues par numéro et clics sur le bouton « Ouvrir
        la source » par entrée.
      *Fait le 30/08/2026 — volet SQL uniquement* (`apps/affut/supabase/`,
      structure et conventions reprises d'`apps/organisation-cours/supabase/`) :
      - `001-schema.sql` — tables `affut_numeros`, `affut_entrees`,
        `affut_sources_suivies`, `affut_ingestion_log` (posée à vide pour
        le Lot 8), `affut_redacteurs`, `affut_emails_autorises`. Colonnes
        `vues`/`clics_source` ajoutées pour les compteurs. Champ renommé
        `usage` (JS) → `usage_en_cours` (colonne), pour coller au nom
        déjà utilisé dans `CLAUDE.md` — à traduire dans la couche de
        mapping du front lors de la migration.
      - `002-policies.sql` — RLS + vues publiques. Fonctions
        `affut_is_active_redacteur()`/`affut_email_autorise()` écrites en
        `language plpgsql` (jamais `sql`) dès le départ : leçon reprise
        d'`organisation-cours/supabase/014-fix-inlining-security-definer.sql`
        (une fonction SQL "simple" peut être inlinée par l'optimiseur et
        casser silencieusement la RLS sur les écritures via l'API REST).
        Auto-inscription verrouillée par liste blanche + `actif=false`
        par défaut (flip manuel en SQL Editor) — même principe que
        `oc_enseignants`+`oc_emails_autorises`. Vues `affut_numeros_public`
        / `affut_entrees_public` : seul point d'accès `anon`, masquent
        `usage_en_cours`, `collecte`, `moisson`, les entrées non
        retenues, les numéros non publiés, et **masquent aussi
        chiffres/résumé côté serveur** quand `blocs.chiffres`/
        `blocs.resume` est à `false` (pas seulement côté affichage —
        sans ça, la réponse réseau brute laisserait voir un contenu que
        l'interface ne montre jamais).
      - `003-compteurs.sql` — `affut_incrementer_vue_numero()` /
        `affut_incrementer_clic_source()`, RPC `security definer`
        exécutables par `anon`, strictement limitées à incrémenter un
        compteur sur une ligne déjà publique (aucune lecture/écriture
        arbitraire possible par ce biais). Pas de garde-fou anti-abus
        (accepté sciemment : repère approximatif à faible enjeu).
      - `test-rls.sql` — scénarios de vérification (transaction annulée,
        même technique qu'`organisation-cours/supabase/test-rls.sql`) :
        fuite `usage_en_cours`, brouillon/entrée non retenue exposés,
        écriture par un rédacteur inactif, compteurs sur du contenu non
        public — à faire tourner dans le SQL Editor avant de continuer.
      - `README.md` — ordre d'application, réglages Supabase préalables
        (désactiver « Confirm email »), gestion de la liste blanche et de
        l'activation des comptes.
      *Fait le 30/08/2026* : les 3 fichiers appliqués avec succès dans le
      SQL Editor du projet `portail`, « Confirm email » désactivé, premier
      e-mail ajouté à `affut_emails_autorises`.
      *Vérifié le 30/08/2026* — `test-rls.sql` (bloc PL/pgSQL complexe,
      fonction ou `do $$...$$`) a échoué à deux reprises dans le SQL
      Editor Supabase (« relation does not exist » puis « function does
      not exist ») : l'éditeur semble découper un script sur les
      points-virgules internes d'un bloc PL/pgSQL conséquent, cassant sa
      création avant exécution — abandonné. Remplacé par
      `test-rls-manuel.sql` (uniquement des `insert` plats, posés par
      l'utilisateur dans le SQL Editor) + vérification directe sur l'API
      REST réelle (`curl`, clé anon publique — même clé que
      PhytoScope/organisation-cours) menée depuis cet environnement.
      Tout est passé : vue publique n'expose que le numéro publié (pas le
      brouillon), ni `collecte`/`moisson`/`candidates` ; entrée non
      retenue invisible côté public ; résumé masqué
      (`blocs.resume=false`) rendu `null` côté public ; `usage_en_cours`
      totalement absent des réponses anon ; lecture directe des tables de
      base par anon → 0 ligne (RLS bloque tout, la table elle-même reste
      interrogeable côté PostgREST — comportement Supabase normal, la
      sécurité vient de la RLS et non d'un refus de privilège) ; les 2 RPC
      de compteurs incrémentent sur du contenu public et ignorent
      silencieusement brouillon/entrée non retenue. Jeu de données de
      test retiré ensuite via `test-rls-nettoyage.sql`.
      *Fait le 31/08/2026 — migration complète du front* (`apps/affut/index.html`) :
      `loadData()`/`saveData()` (localStorage, jeu de démo à 13 numéros)
      remplacés par des appels directs Supabase — lecture via
      `affut_numeros_public`/`affut_entrees_public` hors session (Sommaire,
      Recherche, numéro publié), via les tables de base une fois rédacteur
      actif authentifié. **Écriture directe, pas de copie locale ni de
      synchro de fond** (décision du 31/08/2026, à la différence du modèle
      PhytoScope) : chaque action (formulaire d'entrée, bascule d'un bloc,
      publication, moisson, sources suivies…) mute l'état local puis écrit
      la ligne modifiée dans Supabase ; un échec réseau/RLS s'affiche
      (`alert`) sans annuler la mutation déjà rendue à l'écran. Compteurs de
      fréquentation branchés (RPC `affut_incrementer_vue_numero`/
      `affut_incrementer_clic_source`, une fois par ouverture de numéro
      publié / clic sur « Ouvrir la source »). **Nouveauté non prévue au
      départ** : les tables Supabase démarrent vides (le jeu de démo ne
      migre pas) — ajout d'un bouton « + Nouveau numéro » (rédaction) et
      d'un état vide dédié (`renderAucunNumero()`, variantes public/
      rédaction) pour amorcer le tout premier numéro réel.
      *Chemin rédacteur authentifié testé en conditions réelles* : voir
      Lot 7 ci-dessous, combiné à cette même passe.
      *Validé le 31/08/2026* par relecture de code, vérification
      d'équilibrage accolades/parenthèses (script), cohérence des
      `data-action` markup ↔ gestionnaires, **et — nouveauté cette fois —
      un vrai test dans Chrome piloté via la skill `claude-in-chrome`**
      (serveur statique local `python3 -m http.server`) : lecture publique
      confirmée contre le vrai projet Supabase `portail`
      (`affut_numeros_public`/`affut_entrees_public` répondent 200), état
      vide public correct base réellement vide, onglet Sources bien masqué
      hors session, modale de connexion s'ouvre/se ferme sans erreur
      console. **Non testé par Claude** (saisie de mot de passe interdite,
      même avec des identifiants fournis) : connexion réelle, création de
      numéro, écriture d'entrée, publication — validé manuellement par
      l'utilisateur le 31/08/2026, qui confirme pouvoir se connecter.
      **Correction du 31/08/2026** (retour d'usage) : les champs Mois/
      Semaine de « Nouveau numéro » étaient en rédaction libre — remplacés
      par un sélecteur de semaine natif (`input type="week"`) ; mois et
      libellé de semaine (« semaine 34 · 17 → 23 août 2026 ») sont
      désormais calculés (`formaterSemaineIso()`), jamais saisis à la main
      — cohérent avec le principe déjà appliqué au domaine déduit de l'URL.
- [x] **Lot 7 — Accès rédaction** : Cloudflare Access ou Supabase Auth (à
      trancher : auteur unique ou plusieurs enseignants).
      *Fin :* vue rédaction inaccessible sans authentification.
      *Décidé le 30/08/2026* : **Supabase Auth**, e-mail + mot de passe,
      bouton de connexion dans l'appli publique (cohérent avec le modèle
      déjà en place sur organisation-cours, plutôt qu'introduire un 2e
      mécanisme comme Cloudflare Access) — **plusieurs enseignants** dès
      le départ, via liste blanche d'e-mails (voir Lot 6 ci-dessus,
      `affut_emails_autorises`/`affut_redacteurs`). Combiné au Lot 6 :
      RLS déjà posée dans `002-policies.sql`, reste à écrire l'écran de
      connexion côté front.
      *Fait le 31/08/2026* : écran de connexion (e-mail + mot de passe,
      calqué sur `organisation-cours/js/auth.js` — tentative de connexion,
      repli sur inscription, message dédié si « Confirm email » bloque,
      « mot de passe oublié ? »), rendu en modale (réutilise les classes
      `.modal`/`.champ` déjà en place, pas de nouvelle charte). Après
      connexion : ligne `affut_redacteurs` chargée ou créée (`actif:false`
      par défaut, refusée si l'e-mail n'est pas dans
      `affut_emails_autorises` → message dédié) ; `actif:false` → écran
      « compte en attente d'activation » ; `actif:true` → rédaction
      déverrouillée (bascule vers les tables de base, RLS ouverte). Bouton
      « Rédaction » du bandeau : ouvre la connexion au lieu de basculer le
      mode si aucun rédacteur actif n'est connecté ; onglet « Sources » du
      bandeau masqué hors rédaction (pas de vue publique pour cette
      donnée). Déconnexion recharge automatiquement le jeu de données
      public. **Le chemin rédacteur authentifié (actif vs inactif,
      écriture RLS), jamais testé jusqu'ici, est donc désormais
      exerçable** — reste à le valider avec un vrai compte dans un
      navigateur (voir note de validation du Lot 6 ci-dessus).
- [ ] **Lot 8 — Ingestion automatique par veille Claude** (31/08/2026,
      remplace l'idée initiale de Worker RSS/Atom — décision prise en
      conversation, pas encore engagée) :
      *Fin :* un agent planifié écrit un numéro `brouillon` avec ses
      candidats (`moisson`) dans Supabase sans intervention humaine ; le
      tri (Retenir/Écarter, déjà construit au Lot 4) reste entièrement
      manuel — rien à changer côté écran de moisson.
      *Décisions actées (31/08/2026)* :
      - **Écriture directe en base** (pas d'écran d'import manuel d'un
        fichier) : le script/agent écrit dans `affut_numeros`/
        `affut_entrees` (colonnes `moisson`/`collecte`), via la clé
        `service_role` — celle-ci reste côté agent planifié, **jamais
        dans le front** (cohérent avec `CLAUDE.md`).
      - **Filtre éditorial = un brief versionné**, pas un réglage caché :
        fichier markdown (ex. `apps/affut/documents/brief-veille.md`, à
        rédiger — cadrage produit à partir de l'exemple déjà fourni
        `apps/affut/documents/carnetveille.html`) qui liste sources à
        privilégier/éviter, équilibre des rubriques, angle pédagogique
        attendu (ce qui fait un bon « Usage en cours »), critères
        d'exclusion explicites. Modifier le filtre = éditer ce fichier.
      - **Boucle de retour, pas d'entraînement de modèle** : à chaque
        exécution, l'agent reçoit dans son contexte un échantillon récent
        des candidats retenus vs écartés par les enseignants
        (apprentissage en contexte, pas de fine-tuning). Nécessite un
        petit ajout pas encore fait : capter un **motif d'écart optionnel**
        au clic sur « Écarter » (aujourd'hui la suppression est muette) —
        sans ça la boucle ne voit que « rejeté », pas pourquoi.
      - **Mécanisme d'exécution envisagé** : agent cloud planifié
        hebdomadaire (skill `schedule` de Claude Code), pas un Worker
        Cloudflare — la recherche web agentique s'y prête mieux qu'un
        simple parseur RSS/Atom.
      - **Écarts par rapport au dossier de passation d'origine** : l'idée
        de Worker `POST /api/veille/ingest` idempotent par `slug` sur flux
        RSS/Atom est abandonnée au profit de ce mécanisme — à documenter
        plus précisément une fois le brief et l'agent réellement posés.
      *Fait le 31/08/2026 — brief éditorial* : `apps/affut/documents/brief-veille.md`,
      rédigé à partir de `documents/promptveilleportail.md` (partie A) et
      des exemples de `documents/carnetveille.html`, **puis relu et amendé
      par l'utilisateur** (mêmes 31/08/2026) : rubriques renommées
      **Gestion** (ex-« Terrain & gestion ») et **En bonus** (ex-
      « Pépites »), chiffres de terrain devenus facultatifs (plus une
      condition rédhibitoire), objectif ajouté de panel varié des
      métiers/missions/territoires (jusqu'à débloquer des idées de stage,
      sans que la sélection s'attarde sur ce critère), et surtout
      **assouplissement du filtre politique/opinion** : les articles
      d'opinion, tribunes et positions politiques ou polémiques sur le
      champ de la protection de la nature sont désormais explicitement
      bienvenus (le carnet est aussi vu comme un espace de découverte/
      positionnement), alors que la première version les excluait.
      Couvre : le rôle de l'agent (chercher + écrire en `moisson`, jamais
      publier), le territoire (Bretagne à sujet égal, pas de restriction
      stricte), les 4 rubriques avec leur définition, une liste de sources
      à privilégier (CEN, parcs nationaux/PNR, associations naturalistes
      bretonnes, OFB, MNHN/INPN — point de départ, pas fermée), les
      critères d'exclusion restants (pas de source primaire, contenu
      commercial, paywall, doublon), ce qui fait un bon « Usage en cours »
      pédagogique, le format JSON exact d'un candidat de moisson (calqué
      sur l'objet lu par le bouton « Retenir »), la boucle de retour
      (relire un échantillon retenus/écartés avant de chercher) et une
      liste d'interdits (ne jamais publier, ne jamais inventer un chiffre,
      ne jamais toucher une entrée déjà validée).
      *Fait le 31/08/2026 — motif d'écart* : nouvelle table
      `affut_candidats_ecartes` (migration
      `apps/affut/supabase/004-candidats-ecartes.sql`, même schéma RLS
      rédaction-seule que les autres tables de base — **pas encore
      appliquée dans le SQL Editor du projet `portail`**, à faire avant de
      tester). Le bouton « Écarter » de l'écran Moisson utilise maintenant
      `window.prompt` (au lieu de `window.confirm`) pour capter un motif
      facultatif, écrit dans cette table via la nouvelle fonction
      `creerCandidatEcarte()` avant de retirer le candidat de
      `numero.moisson` — annuler la boîte de dialogue (`null`) annule
      toujours l'écart, comme avant. Choix délibéré : `window.prompt`
      plutôt qu'une modale dédiée, pour rester au plus près du geste
      existant (l'app n'utilisait jusqu'ici aucun `window.prompt`, mais
      `window.confirm` pour cette même action) sur un champ facultatif à
      une seule ligne. *Validé* par équilibrage accolades/parenthèses/
      crochets du script (pas de navigateur pilotable) — **à revalider
      manuellement** (appliquer la migration SQL, puis tester Écarter avec
      et sans motif, avec Annuler).
      *Fait le 31/08/2026 — dépôt et routine* : `apps/affut/` committé et
      poussé sur GitHub pour la première fois (PR #53 → `main`), nécessaire
      pour qu'une routine cloud puisse lire le brief depuis son checkout —
      décision prise avec l'utilisateur, qui l'a explicitement demandé une
      fois le blocage identifié. Configuration machine faite dans la
      foulée (identité git `user.name`/`user.email`, installation `gh` CLI
      + `gh auth login`) : plus rien à refaire pour les prochains commits/
      PR sur ce poste. Routine cloud créée via la skill `schedule` :
      `trig_01MGPb4JdPKzBdA9nVf7bcT7` (`affut-veille-hebdo`), hebdomadaire
      samedi 8h Paris (`0 6 * * 6` UTC), modèle **Opus 5** (choisi plutôt
      que Sonnet 5 : tâche de curation éditoriale, l'écart de qualité
      compte plus que le coût vu la cadence hebdomadaire), dépôt
      `btsgpn-kerplouz/portail`, outils Bash/Read/Grep/Glob/WebSearch/
      WebFetch — pas d'écriture de fichier, écrit uniquement dans Supabase
      via curl (voir le prompt complet dans la config de la routine sur
      `claude.ai/code/routines/trig_01MGPb4JdPKzBdA9nVf7bcT7`).
      *Revu en cours de session : architecture service_role abandonnée.*
      En cherchant où poser `SUPABASE_SERVICE_ROLE_KEY` sur l'environnement
      cloud, le champ « Variables d'environnement » de Claude Code a
      affiché un avertissement explicite (« visibles par toute personne
      utilisant cet environnement, n'ajoutez pas de secrets ni
      d'identifiants ») — une recherche de doc (agent `claude-code-guide`)
      n'a trouvé aucun mécanisme de secret distinct pour les routines
      simples (seulement pour les « vaults » d'un autre produit, Managed
      Agents). Feedback produit envoyé sur ce manque. Plutôt que d'exposer
      `service_role` (accès total, contourne toute RLS) dans ce champ,
      **nouvelle architecture** : une **Edge Function Supabase**
      (`affut-veille`, voir `apps/affut/supabase/functions/affut-veille/`)
      fait désormais tout le travail privilégié — `service_role` lui est
      fournie automatiquement par la plateforme Supabase, jamais stockée
      nulle part par nous. La routine ne détient plus qu'un jeton étroit
      (`AFFUT_VEILLE_TOKEN`) qui n'autorise qu'un GET (contexte) et un POST
      (ajout à un brouillon) sur cette seule fonction.
      **Discussion de risque menée avec l'utilisateur (31/08/2026)** avant
      d'accepter de poser ce jeton dans le même champ « Variables
      d'environnement » : même en fuite, il ne permet ni lecture de
      `usage_en_cours`, ni publication, ni modification d'une entrée
      validée — seulement l'ajout de candidats à un brouillon (visible par
      l'enseignant seul) et la lecture du contexte de veille. Risque
      résiduel identifié et corrigé : contenu libre non modéré en écriture
      (nuisance ciblant l'enseignant, jamais les élèves) → plafonds de
      taille + limite de fréquence ajoutés ; `motif` d'écart (raisonnement
      privé) exposé en lecture → **gardé sciemment** après explication
      précise du risque (l'utilisateur voulait conserver la boucle de
      retour), avec un rappel ajouté dans l'invite d'écran Moisson pour
      inciter à une rédaction professionnelle du motif. Détail complet de
      la fonction et de son durcissement en tête de `index.ts`.
      *Fait le 31/08/2026 — jeton posé, bascule d'environnement, premier
      run réel réussi.* `AFFUT_VEILLE_TOKEN` posé, puis la routine a été
      rebasculée sur `env_01US7dF8TxHiVbduaxdT74a8` (2e essai, la 1ère
      exécution avait buté sur la politique réseau — voir le piège réseau
      documenté en tête de fichier). Réglage **« Network access: Full »**
      appliqué sur cet environnement (3e essai) : premier run complet
      réussi, **7 candidats déposés dans un numéro 2 brouillon**. Détail
      du run et de la limite « leurs URLs de ce 1er run n'ont pas été
      vérifiées » en tête de fichier. Lot 8 clos — **le prochain chantier
      est l'écran Moisson**, voir « PROCHAINE REPRISE » en tête de fichier.
- [ ] **Lot 9 — Déploiement** : Cloudflare Pages, cron de revérification
      des liens, purge de cache, tuile passée en « en service ».
      *Fin :* premier vrai numéro en ligne, URL stable.
      **Fait le 31/08/2026 — Worker Cloudflare créé et déployé** :
      `apps/affut/wrangler.jsonc` connecté en Git (Workers Builds) au
      dépôt `btsgpn-kerplouz/portail`, branche `main`, racine `apps/affut`
      (build command vide — vanilla, pas d'étape de build ; deploy command
      par défaut `npx wrangler deploy` ; token API dédié créé, sur le même
      principe qu'un token par app déjà en place pour phytoscope). Premier
      build réussi, sous-domaine `workers.dev` activé puis renommé dans
      Settings → General : **URL publique stable :
      https://affut-veille-naturaliste.kerplouz.workers.dev** — répond
      HTTP 200, sert bien `apps/affut/index.html` (vérifié par `curl`
      depuis cet environnement). Déploiement automatique à chaque merge
      sur `main` désormais actif pour cette app, indépendant des autres.
      *Pas encore fait :* domaine personnalisé (pas demandé pour l'instant,
      le `.workers.dev` suffit) ; cron de revérification des liens ; purge
      de cache ; tuile portail toujours en statut « en chantier » — la
      question de la nouvelle tuile centrée élève a été reportée par
      l'utilisateur à après le déploiement (31/08/2026), à reprendre
      maintenant que l'URL réelle existe.
- [x] **Lot 10 — Refonte de l'écran Moisson** (retour d'usage du 31/08/2026,
      après le 1er run réel du Lot 8 : 7 candidats déposés dans un n°2
      brouillon, la modale « Voir la moisson » trop petite pour valider
      sérieusement).
      *Fin :* la moisson est visible directement dans l'écran du numéro
      (plus de modale), chaque candidat au même niveau de détail qu'une
      entrée retenue, avec accès direct à la source et geste « écarter avec
      motif » toujours visible.
      *Fait le 01/09/2026* (`apps/affut/index.html`) :
      - **Modale « Voir la moisson » supprimée** (`renderMoissonModal()`,
        `state.moissonOuverte`, boutons `voir-moisson`/`close-moisson`) au
        profit d'une nouvelle section intégrée à l'écran du numéro,
        `renderMoissonSection()` : affichée directement sous les entrées
        déjà retenues (ou sous le bandeau « numéro vide » à l'état ②),
        toujours visible sans clic supplémentaire.
      - **Chaque candidat rendu au même niveau de détail qu'une entrée**
        (`renderCandidat()`, réutilise les classes `.entree`/`.entree-row`/
        `.flat` de `renderEntree()`) : source, territoire, domaine, date,
        rubrique, titre, chiffres clés, résumé complet — plus de simple
        ligne titre+meta comme dans l'ancienne modale.
      - **Accès direct à la source** : bouton « Ouvrir la source » plein
        format (ouvre dans un nouvel onglet, `target="_blank"`), absent de
        l'ancienne modale (point le plus souligné par l'utilisateur — « impossible
        de vérifier une source sans lien cliquable »). Un candidat sans URL
        affiche un bouton désactivé « Pas encore de lien » plutôt qu'un
        lien mort.
      - **Bug corrigé au passage** : le bouton « Retenir » copiait
        `cand.chiffres` (tableau de chaînes brutes, format de l'Edge
        Function `affut-veille`) tel quel dans `entree.chiffres`, qui
        attend des couples `{v,l,accent}` — une fois retenue, une entrée
        née de la moisson aurait affiché "undefined" à la place de ses
        chiffres clés. Nouvelle fonction `chiffresCandidatVersBlocs()`,
        appelée au moment de retenir. Corrigé en même temps : `flatChiffres()`
        laissait une espace insécable en tête du texte quand `v` est vide
        (nouvelle fonction commune `chiffreTexte()`).
      - **Geste « écarter avec motif » rendu visible** : remplacé le
        `window.prompt()` du Lot 8 (motif jamais trouvé/vu à l'usage selon
        le retour utilisateur) par un panneau inline (`.ecart-panel`,
        `state.ecarterOuvert`) qui s'ouvre sous la carte du candidat au clic
        sur « Écarter… », avec le même rappel de confidentialité qu'avant
        (motif lu par la routine automatisée, jamais par les élèves) et un
        bouton « Écarter définitivement » explicite plutôt qu'une boîte de
        dialogue navigateur.
      - **Bouton « + Ajouter » en doublon supprimé** de l'état ② (« le n° X
        est vide pour l'instant ») : le texte renvoie maintenant vers le
        bouton « + Ajouter une entrée », déjà présent en permanence dans la
        barre d'actions du numéro (signalé comme doublon par l'utilisateur).
      - **Déplacement d'une entrée retenue vers un autre numéro** (demandé
        le 31/08/2026, limite connue du Lot 4ter) : nouveau bouton
        « Déplacer » dans les actions de chaque entrée en rédaction, ouvre
        un sélecteur inline (`renderDeplacerPanel()`) listant tous les
        numéros existants (comme `renderSelecteurNumero()`) plus une option
        « + Nouveau numéro » qui ouvre le formulaire de création existant et
        termine le déplacement une fois le numéro créé
        (`deplacerEntreeVersNumero()`/`deplacerEntreeDistante()`, écrit
        `numero_id` en base). Mutation locale immédiate dans les deux
        numéros (source et cible), tous deux déjà chargés en mémoire en
        rédaction (`chargerDonneesRedaction()` lit `affut_entrees` sans
        filtre) — pas de rechargement réseau nécessaire.
      - CSS : ancien bloc `.moisson-barre`/`.moisson-item`/`.moisson-liste`
        remplacé par `.moisson-section`/`.moisson-candidat`/`.ecart-panel`/
        `.deplacer-select-wrap` ; règle d'impression et règle mobile mises à
        jour en conséquence (nouvelles classes ajoutées à la liste masquée
        à l'impression, ancienne règle mobile devenue inutile retirée).
      *Validé le 01/09/2026* par relecture de code et vérification
      d'équilibrage des accolades/parenthèses/crochets du script (même
      limite d'environnement que les lots précédents — pas de compte
      Supabase disponible dans cet environnement pour se connecter en
      rédaction et charger de vraies données de moisson) — **à revalider
      manuellement dans un vrai navigateur, connecté en rédaction sur le n°2
      brouillon qui porte les 7 candidats réels du 1er run de veille**,
      notamment : rendu des chiffres clés d'un candidat retenu (bug corrigé
      ci-dessus), panneau « écarter avec motif », sélecteur « Déplacer vers ».
      **Un serveur statique local a été lancé pour que l'utilisateur teste
      lui-même** (`python3 -m http.server 8765` dans `apps/affut/`,
      http://localhost:8765/) — l'app pointe directement sur le vrai projet
      Supabase (`SUPABASE_URL` en dur dans `index.html`), donc la connexion
      rédaction réelle fonctionne depuis ce serveur local.
      **PAS PUSHÉ, PAS DE PR** pour cette passe-ci suite au retour du
      01/09/2026 (« Tu n'as jamais eu l'autorisation de push sans mon
      accord ») — attendre l'accord explicite avant `git push`/`gh pr
      create` désormais, y compris pour un lot déjà entièrement codé (voir
      mémoire `feedback_git_push_permission`). La PR #58 du Lot 10
      lui-même avait déjà été poussée avant ce recadrage.
- [x] **Lot 10bis — Ordre d'affichage manuel des entrées** (demandé le
      01/09/2026, même session que le Lot 10).
      *Fin :* une entrée retenue peut être déplacée d'un cran vers le haut
      ou le bas au sein de sa rubrique, en rédaction.
      *Fait le 01/09/2026* (`apps/affut/index.html` +
      `apps/affut/supabase/006-ordre-entrees.sql`, **pas encore appliquée
      dans le SQL Editor du projet `portail`**) :
      - Nouvelle colonne `ordre` (entier, défaut 0) sur `affut_entrees` —
        migration `006-ordre-entrees.sql`, avec backfill des entrées déjà
        en base par ordre de création (`cree_le`) au sein de chaque
        `(numero_id, rubrique)`, et ajout de `ordre` à la vue publique
        `affut_entrees_public` (le tri s'applique aussi côté élèves, même
        code de rendu que la rédaction).
      - `groupByRubrique()` trie désormais les entrées de chaque rubrique
        par `ordre` avant affichage — **l'ordre des rubriques elles-mêmes
        ne change pas** (toujours la 1re apparition dans la liste chargée,
        comme avant ce lot) : deux rubriques différentes peuvent réutiliser
        les mêmes valeurs d'`ordre` sans aucun effet l'une sur l'autre, le
        tri est scopé par rubrique.
      - Boutons compacts ▲/▼ (`renderEntree()`, nouvelle classe
        `.reorder-btns`), désactivés en butée de rubrique plutôt que
        masqués. `deplacerOrdreEntree()` réassigne 0..n-1 à **toutes** les
        entrées de la rubrique concernée à chaque clic (pas un simple
        échange de deux valeurs) — évite tout cas particulier avec des
        `ordre` par défaut à 0 ou déjà égaux.
      - Nouvelles entrées (formulaire manuel ou candidat retenu de la
        moisson) : `prochainOrdreRubrique()` les place en fin de leur
        rubrique plutôt qu'à une position arbitraire.
      *Validé le 01/09/2026* par relecture de code et vérification
      d'équilibrage du script (même limite d'environnement que les lots
      précédents) — **à revalider manuellement** après avoir appliqué
      `006-ordre-entrees.sql` dans le SQL Editor : Monter/Descendre sur une
      rubrique à plusieurs entrées, boutons bien désactivés en haut/bas de
      rubrique, ordre conservé après rechargement de page, ordre repris
      côté vue publique.
      **Bug corrigé en cours de route (`006-ordre-entrees.sql`)** : le
      `create or replace view` initial insérait `ordre` au milieu de la
      liste des colonnes de `affut_entrees_public`, ce que Postgres refuse
      (« cannot change name of view column "clics_source" to "ordre" » —
      un `CREATE OR REPLACE VIEW` ne peut qu'AJOUTER des colonnes en toute
      fin de liste, jamais en insérer une au milieu). Corrigé en déplaçant
      `ordre` après `clics_source` ; script relançable sans risque
      (`alter table ... if not exists`, backfill idempotent).
      **Premier test réel dans un vrai navigateur (01/09/2026, via la
      skill `claude-in-chrome`, contrairement aux lots précédents)** sur le
      vrai n°2 (7 candidats du run de veille, déjà tous retenus et publiés
      par l'utilisateur entre-temps) : bandeau de rédaction, sélecteur de
      numéro, compteur « 7 sur 7 candidates », boutons ▲/▼ sur chaque
      entrée, bouton Déplacer, tout s'affiche correctement.
- [x] **Lot 10ter — retours d'usage post-Lot 10/10bis** (01/09/2026, même
      session).
      *Fait le 01/09/2026* (`apps/affut/index.html` sauf mention contraire) :
      - **Bug confirmé en conditions réelles** : les chiffres clés de
        l'entrée « Ours infos 2025 » (numéro 2 réel) affichaient
        littéralement `undefined · undefined · ...` — c'est exactement le
        bug corrigé au Lot 10 (`chiffresCandidatVersBlocs()`), mais sur des
        **données déjà enregistrées avant le correctif** (un ou plusieurs
        candidats du numéro 2 avaient déjà été retenus avec l'ancien code
        bogué). Le correctif du Lot 10 empêche le problème pour tout
        nouveau « Retenir », mais ne répare pas ce qui est déjà en base.
        Nouveau script de réparation ponctuelle,
        `apps/affut/supabase/fix-chiffres-candidats-legacy.sql` : convertit
        tout élément `chiffres` de type chaîne brute en `{v:"", l: <la
        chaîne>}`, sans toucher aux entrées déjà au bon format — **à lancer
        dans le SQL Editor du projet `portail`**, idempotent (relançable
        sans risque).
      - **Onglet Rédaction/Vue publiée toujours visible** dans le bandeau,
        y compris sur Sommaire/Recherche/Sources (avant : seulement sur la
        page d'un numéro) — condition `state.vue === "numero"` retirée de
        `modeToggleHtml`. Le mode choisi n'a d'effet visible que sur la
        page d'un numéro, mais reste actif quand on y revient depuis un
        autre écran, sans avoir à rebasculer à chaque fois.
      - **Dépublier un numéro** : le bouton « Publier le n° X » devient
        « Dépublier le n° X » (nouvelle classe `.btn-ligne.danger`, accent
        `--af-mort`) une fois le numéro publié, avec confirmation
        (`window.confirm`) avant de repasser `statut` à `brouillon` — le
        numéro redevient alors invisible des élèves (les vues publiques ne
        servent que `statut = publie`) et de nouveau librement modifiable.
        Jusqu'ici publier était un aller simple, sans retour possible sans
        intervention en base.
      - **Rail (`renderRail()`, colonne de droite d'un numéro publié)
        retravaillé** : affichait le **domaine** (ex. `ofb.gouv.fr`) en
        texte brut sous chaque titre, plus un texte de bas de rail
        affirmant à tort « ne pas lister les titres du numéro » — devenu
        faux depuis que le rail liste une entrée par ligne (stale depuis
        un lot antérieur). Remplacé par le **nom de la source** (ex.
        « Office français de la biodiversité — Réseau Ours brun ») en
        pastille (nouvelle classe `.rail-item .source-pastille`, même
        recette visuelle que `.pastille-echelle`) ; titre du rail passé de
        « Les N sources du numéro » à « N titres de ce numéro » ; texte de
        bas de rail obsolète retiré. CSS `.rail-item .domaine`/`.rail-note`
        supprimées (plus référencées nulle part).
      *Validé le 01/09/2026* — **testé dans un vrai navigateur** (skill
      `claude-in-chrome`, serveur local + vrai compte connecté) sur le
      vrai n°2 : onglet Rédaction visible sur l'écran Sommaire confirmé
      par capture d'écran, bouton « Dépublier le n° 2 » bien affiché (le
      numéro est déjà publié), rail affichant « 7 titres de ce numéro »
      avec pastilles de source. **Non testé** : le clic réel sur
      « Dépublier » (confirmation + republication), et le script SQL de
      réparation des chiffres légués (pas encore lancé au moment de ce
      commit).
- [x] **Lot 10quater — correction du Lot 10ter** (01/09/2026, retour
      d'usage à chaud : « c'est un peu n'importe quoi là », le rail n'était
      pas ce qui était demandé et le script de réparation débordait
      l'écran).
      *Fait le 01/09/2026* :
      - **Le rail n'a pas été « corrigé », il a été SUPPRIMÉ** :
        malentendu du Lot 10ter — l'utilisateur le juge « totalement en
        doublon inutile » avec le bouton « Ouvrir la source » déjà sur
        chaque entrée. `renderRail()` et tout son CSS (`.rail`,
        `.rail-titre`, `.rail-liste`, `.rail-item*`) retirés ; `.corps`
        repasse à une seule colonne pleine largeur, identique en rédaction
        et en vue publiée (`.mode-publiee .corps{display:grid;
        grid-template-columns:1fr 340px}` supprimé).
      - **Cause racine du débordement à l'écran identifiée** : ce n'était
        PAS un problème de longueur de texte des chiffres réparés, mais un
        piège classique de CSS Grid — `.mode-publiee .corps` était en
        `display:grid`, et un item de grille garde par défaut
        `min-width:auto` (contrairement à un item flex) : un texte non
        cassable (`white-space:nowrap` sur `.flat-chiffres`) peut donc
        forcer toute la piste `1fr` à s'élargir bien au-delà, au lieu de se
        faire tronquer par son `text-overflow:ellipsis`. En supprimant la
        grille (ci-dessus) le problème disparaît structurellement — testé
        en vrai navigateur, plus aucun débordement en rédaction ni en vue
        publiée.
      - **2e bug dans le script de réparation lui-même** : la 1ère version
        de `fix-chiffres-candidats-legacy.sql` empaquetait toute la chaîne
        brute d'un candidat dans le libellé (`{v:"", l:"108 | ours détectés
        a minima…"}`) sans la découper — alors que
        `documents/brief-veille.md` documente explicitement le format
        `"valeur | libellé"` pour ces chaînes (même convention que le
        textarea de saisie manuelle). Script réécrit avec une fonction
        PL/pgSQL (`affut_reparer_chiffre_legacy`, auto-supprimée en fin de
        script) qui découpe sur le premier `|` — répare en une seule passe
        aussi bien les chaînes encore brutes que celles déjà mal réparées
        par la 1ère version (idempotent). **Front corrigé au même endroit**
        (`chiffresCandidatVersBlocs()`) via une nouvelle fonction partagée
        `parseChiffreLigne()` (extraite de `parseChiffres()`, qui servait
        déjà à parser exactement ce format côté formulaire manuel) — plus
        aucun futur « Retenir » ne pourra reproduire ce bug.
      - **Sommaire (tuile d'un numéro, `renderNumeroCarte()`)** : montre
        désormais **toutes** les actualités du numéro (pas seulement les 3
        premières + « et N autres »), chacune avec le **nom de la source**
        en pastille — en texte simple, sans lien (demande explicite : la
        tuile sert à se repérer avant d'ouvrir le numéro, pas à ouvrir une
        source directement). Nouvelles classes `.nc-titre-entree`/
        `.nc-source-pastille`, `.nc-liste li.plus` retirée (plus de
        troncature à afficher).
      - **Bascule Rédaction/Vue publiée : re-limitée à la page d'un numéro**
        (retour à son comportement d'avant le Lot 10ter) — visible sur
        Sommaire/Recherche/Sources, elle n'avait strictement aucun effet
        (ces écrans ignorent `state.mode`), un contrôle qui ne fait rien au
        clic se lit comme cassé.
      - **Nouveau bouton permanent « Rédaction »** dans `.bandeau-nav`
        (à côté de Sommaire/Rechercher/Sources), visible sur tous les
        écrans dès qu'un rédacteur actif est connecté — clarification de
        l'utilisateur juste après : ce n'est **pas** la bascule
        rédaction/vue publiée d'un numéro déjà ouvert (celle-ci, propre à
        `renderNumeroPage()`, reste limitée à cette page), mais un simple
        **bouton de retour** vers l'espace de rédaction depuis n'importe
        où. `data-action="aller-redaction"` force `state.vue = "numero"` +
        `state.mode = "redaction"`, en gardant `state.numeroId` inchangé
        (revient donc au dernier numéro affiché, pas nécessairement le
        plus récent).
      - **Sommaire, ordre du texte dans une tuile** : nom de la source
        avant le titre de chaque actualité (demandé le 01/09/2026, après
        un premier essai titre-puis-source) — simple inversion des deux
        `<span>` dans `renderNumeroCarte()`, `.nc-liste li` étant déjà en
        flex, l'ordre visuel suit l'ordre du balisage.
      *Validé le 01/09/2026* — **revérifié dans un vrai navigateur** (skill
      `claude-in-chrome`) sur le vrai n°2, en rédaction et en vue publiée :
      plus aucun débordement à l'écran, tuile du Sommaire affichant les 7
      actualités avec pastille de source avant le titre, bouton
      « Rédaction » présent sur Sommaire et ramenant bien au n°2 en
      rédaction au clic. **Le script SQL de réparation a été relancé par
      l'utilisateur entre-temps** : les chiffres clés affichent maintenant
      la valeur en gras suivie du libellé, sans le `|` brut (ex. « **108**
      ours détectés a minima sur l'ensemble des Pyrénées en 2025 »),
      confirmé visuellement — plus rien en attente côté données sur ce
      point.
- [x] **Lot 10quinquies — deux barres d'onglets distinctes** (01/09/2026,
      l'utilisateur n'était pas d'accord avec le bouton « Rédaction » isolé
      du Lot 10quater). Nav publique inchangée (Sommaire/Rechercher, texte
      classique) ; rédacteur actif : **une seule barre en pastilles**
      (classe `.mode-toggle`, déjà utilisée pour Rédaction/Vue publiée —
      « satisfaisant et extrapolable » selon l'utilisateur) regroupant
      Sommaire, Rechercher, Sources, Rédaction, Vue publiée — Sommaire
      reste donc la 1re pastille juste après le logo dans les deux cas
      (« onglets en commun au même endroit »). Anciens `data-action="mode"`
      (bascule 2 boutons, numéro seulement) retiré, remplacé par
      `aller-redaction`/`aller-vue-publiee` (déjà génériques, utilisables
      depuis n'importe quel écran). « Sources » n'a PAS été rendu public
      malgré sa présence dans la liste donnée par l'utilisateur pour la
      barre publique — **confirmé le 01/09/2026 : c'était une erreur de sa
      part**, Sources reste rédaction-only comme avant, rien à changer sur
      ce point. *Validé* en vrai navigateur (skill `claude-in-chrome`) :
      barre unique confirmée sur Sommaire et sur un numéro, positions
      cohérentes.
- [x] **Lot 10sexies — boutons visibles sur la barre publique**
      (01/09/2026, retour d'usage : « je ne suis pas satisfait de la barre
      d'onglet […] je veux des boutons visibles, pas seulement des liens
      cliquables »). Audit : le **contenu** des deux barres était déjà
      correct (5 pastilles connecté — Sommaire/Rechercher/Sources/
      Rédaction/Vue publiée, 2 en public — Sommaire/Rechercher, posé au
      Lot 10quinquies), seul le **style** de `.bandeau-nav` (barre publique,
      non connecté) restait celui d'avant le Lot 10quinquies : texte simple
      coloré, souligné au survol/actif, sans bordure ni fond — un vrai lien,
      pas un bouton.
      *Fait le 01/09/2026* : `.bandeau-nav button` reprend exactement le
      même traitement que `.mode-toggle button` (bordure `--af-filet-
      bandeau`, padding 6px 13px, fond `--af-sur-bandeau` + texte encre sur
      l'onglet actif via `aria-current="page"`) — les deux barres ont
      désormais un rendu bouton identique, seul le nombre/l'étiquette des
      onglets change selon la connexion. Règle responsive `.bandeau-nav{
      padding-left:0}` (640px) retirée avec le `gap`/`padding-left` de base
      qu'elle neutralisait, devenue sans effet.
      *Validé le 01/09/2026* — **testé dans un vrai navigateur** (skill
      `claude-in-chrome`, serveur local) : barre publique confirmée par
      capture d'écran (SOMMAIRE / RECHERCHER en boutons bordés). Barre
      connectée **non re-testée visuellement** (pas d'identifiants de
      rédacteur disponibles dans cet environnement pour se connecter) —
      son CSS/HTML n'a pas été touché, seule `.bandeau-nav` a changé ; le
      rendu pastille de `.mode-toggle` avait déjà été validé en vrai
      navigateur au Lot 10quinquies — **à confirmer d'un coup d'œil à la
      prochaine connexion réelle**.
- [x] **Lot 11 — Les sources suivies alimentent la veille automatique**
      (demandé le 01/09/2026 : l'utilisateur avait remarqué que l'écran
      « Sources » — liste compilée à la main, lot 4 — n'avait en réalité
      aucun effet sur la routine de veille du Lot 8, qui ne fait qu'une
      recherche web générale guidée par `brief-veille.md`. Deux demandes,
      dont une déjà satisfaite avant même d'être posée :
      1. « Espace de rédaction expliquant pourquoi on écarte une entrée » —
         **déjà fait au Lot 10** (`.ecart-panel`, motif écrit dans
         `affut_candidats_ecartes.motif`, déjà relu par l'agent via
         `candidats_ecartes_recents`). Rien à ajouter.
      2. « Compiler à la main les liens que la veille doit moissonner » —
         **le vrai manque**, comblé ici : `handleContext()`
         (`affut-veille/index.ts`) interroge maintenant
         `affut_sources_suivies` et renvoie un nouveau champ
         `sources_a_moissonner` (id/nom/adresse/type/echelle/territoire/
         rubrique_defaut, 50 lignes max) — aucune migration SQL, la table
         existait déjà (posée au Lot 4, jamais lue jusqu'ici). `brief-
         veille.md` reçoit une nouvelle section « Sources à moissonner en
         priorité » : consigne (pas suggestion) de visiter effectivement
         chaque adresse à chaque exécution, distincte de la liste
         générique « Sources à privilégier » (point de départ pour une
         recherche ouverte).
      *Volontairement pas fait ici* : boucler le retour d'état par source
      (`derniere_moisson`/`compteurs`, écran Sources) — ces champs et les
      boutons « Relancer la collecte »/« Réessayer » restent purement
      manuels (l'agent n'écrit toujours que via `handleIngest()`, qui ne
      touche pas `affut_sources_suivies`) ; le texte « interrogées chaque
      samedi à 6 h » de l'écran Sources reste donc optimiste tant que ce
      bouclage n'est pas fait — signalé à l'utilisateur, pas demandé.
      *Fait le 01/09/2026 — fonction Edge `affut-veille` redéployée avec
      succès* (confirmé par l'utilisateur ; les autres fonctions listées
      dans le dashboard Supabase du projet `portail` ne viennent pas de ce
      dépôt — au moins une est le modèle « Hello World » par défaut,
      inoffensive, jamais appelée par l'app).
      *Piège de session concurrente (01/09/2026)* : le geste « supprimer
      une entrée déjà retenue avec motif » (partie 1 de cette demande,
      voir ci-dessus) a été mergé dans le même commit que le Lot 10sexies
      (PR #64) par une **session Claude Code concurrente** travaillant
      dans le même dossier de travail — le message de commit ne le
      mentionne pas, seul `git show 6d564e9 -- apps/affut/index.html`
      le révèle. Fonctionnellement complet et vérifié en place, juste mal
      étiqueté dans l'historique — à garder en tête si deux sessions
      tournent en parallèle sur ce dépôt.
- [x] **Lot 12 — Chiffres clés éditables en place** (02/09/2026, backlog du
      01/09/2026, item 1) : la valeur et le libellé de chaque chiffre clé
      d'une entrée sont désormais éditables directement sur la ligne, en
      rédaction — même geste que le titre ou le résumé (`ed()`,
      `contenteditable`, écriture au blur).
      *Écart assumé par rapport à la piste notée le 01/09/2026* (un bloc
      `contenteditable` unique reprenant la syntaxe ligne à ligne « valeur |
      libellé* » du formulaire) : implémenté à la place comme **deux spans
      éditables par chiffre** (`eid.chiffres.i.v` / `eid.chiffres.i.l`),
      plutôt qu'un bloc texte multi-ligne. Raison : le gestionnaire
      générique `focusout` (`setEdValue`/`persisterEdValue`) collapse tout
      le texte saisi sur une seule ligne (`replace(/\s+/g," ")`), ce qui
      aurait cassé le parsing « une ligne par chiffre » sans un traitement
      spécifique des sauts de ligne (`innerText`, gestion `<br>`/`<div>`
      insérés par le navigateur) — la solution par champ évite ce problème
      en réutilisant tel quel le mécanisme déjà éprouvé pour titre/résumé.
      *Toujours réservé au formulaire modal (non traité ici, écart déjà
      assumé pour le reste de l'entrée depuis le Lot 2)* : ajout/suppression
      d'un chiffre, réordonnancement, bascule de l'accent (`*`) — seules la
      valeur et le libellé d'un chiffre déjà présent s'éditent en place.
      `setEdValue()` étendu pour un chemin à 4 segments
      (`eid.chiffres.<index>.v|l`) ; `persisterEdValue()` n'a pas eu besoin
      de changement (envoie déjà la colonne `chiffres` entière, générique).
      *Validé le 02/09/2026* par test unitaire des fonctions modifiées
      (`chiffreTexte`, `setEdValue`) exécuté dans un vrai navigateur (skill
      `claude-in-chrome`, isolé de tout Supabase — pas de identifiants
      utilisés) : rendu rédaction correct (span éditable par valeur/
      libellé, y compris un chiffre à valeur vide), rendu public strictement
      inchangé (comparé caractère à caractère à l'algorithme d'avant Lot
      12), mutation `chiffres[i].v`/`chiffres[i].l` correcte. Application
      réelle rechargée sur serveur statique local sans erreur console.
      **Non revalidé en conditions réelles de rédaction** (connexion
      rédacteur, clic dans un champ, blur, relecture après rechargement) —
      l'accès rédaction nécessite des identifiants que cette session n'a
      pas saisis (règle du produit : jamais de mot de passe entré à la
      place de l'utilisateur) : **à confirmer par l'utilisateur** en
      conditions réelles avant de considérer le lot définitivement clos.
      *Confirmé fonctionnel par l'utilisateur le 02/09/2026*, en testant la
      copie locale (même poste, serveur `python3 -m http.server`) — le
      site déployé n'avait pas encore le Lot 12, d'où un premier essai
      infructueux sur l'ancien déploiement avant ce constat.
      *Suite demandée le 02/09/2026* : mise en avant (`*`) jugée pas assez
      visible en simple texte gras coloré — remplacée par une **pastille
      pleine grenat (`--af-accent`) + texte clair (`--af-sur-accent`)**,
      même logique visuelle que le badge du numéro en en-tête (`n° 12`).
      Correction de lisibilité associée : le span éditable imbriqué
      (`[data-ed="true"]`) hérite sinon de la couleur claire de la pastille
      et devient illisible en rédaction — forcé en encre normale
      spécifiquement dans ce contexte
      (`.mode-redaction .flat-chiffres b [data-ed="true"]`).

- [x] **Lot 13 — Espace bilan/analyse (fréquentation)** (02/09/2026,
      backlog du 01/09/2026 devenu item 1 du 02/09/2026 après le Lot 12) :
      nouvel onglet **Bilan** dans la barre connectée (entre Sources et
      Rédaction), pur écran de lecture — aucune nouvelle donnée à
      collecter, les compteurs `vues`/`clics_source` étaient déjà réels et
      branchés depuis le Lot 6.
      *Contenu :* bandeau de totaux (vues cumulées sur les numéros
      publiés, clics cumulés sur « Ouvrir la source », numéro le plus
      consulté) ; tableau des numéros du plus au moins consulté (barre de
      comparaison relative + nombre de vues) ; tableau des entrées triées
      par clics décroissants, dépliable au-delà des 10 premières (même
      geste « Déplier les N autres » que l'écran Sources).
      *Portée assumée pour cette passe* (choix fait avec l'utilisateur,
      02/09/2026) : **totaux seulement, pas de graphique temporel.** La
      base ne stocke qu'un compteur cumulé (`vues integer`,
      `clics_source integer`), pas d'historique daté — un graphique
      d'évolution dans le temps demanderait une table de log horodatée
      (nouvelle migration SQL à appliquer par l'utilisateur côté Supabase,
      écriture supplémentaire à chaque vue/clic) : reporté à une passe
      ultérieure si le besoin se confirme.
      *Numéros brouillon exclus du tableau des numéros* (ils n'ont par
      construction aucune vue, la vue publique ne servant que les numéros
      `statut=publie`) — la colonne « Statut » envisagée un temps a été
      retirée car toujours égale à « Publié » dans ce cas, donc sans
      intérêt.
      *Validé le 02/09/2026* par test unitaire des fonctions ajoutées
      (`renderBilanEcran`, `renderBilanRowNumero`, `renderBilanRowEntree`)
      exécuté dans un vrai navigateur (skill `claude-in-chrome`, isolé de
      tout Supabase — pas d'identifiants utilisés) : totaux exacts,
      numéros triés y compris à égalité de vues, seuil de dépliage (10)
      correct, texte au singulier/pluriel correct, cas du titre vide géré
      (« (sans titre) »), numéros brouillon bien exclus. Rendu vérifié
      visuellement par injection isolée dans une page réelle (capture
      d'écran) : cohérent avec la charte (mêmes classes que l'écran
      Sources). Application réelle rechargée sur serveur statique local
      sans erreur console.
      **Non revalidé en conditions réelles de rédaction** (connexion
      rédacteur, onglet Bilan sur les vraies données Supabase) — même
      limite que pour le Lot 12, l'accès rédaction nécessite des
      identifiants que cette session n'a pas saisis : **à confirmer par
      l'utilisateur** avant de considérer le lot définitivement clos.

- [x] **Lot 14 — Illustrations sur les entrées** (02/09/2026, fusionne les
      3 derniers points du backlog du 01/09/2026 — demandé explicitement
      comme un seul objectif : « rendre les numéros plus attractifs par
      l'ajout d'illustrations, les solutions sobres sont les bienvenues »).
      *Repère technique décisif (question de l'utilisateur, 02/09/2026)* :
      la page ouverte par le lien d'une entrée peut effectivement servir de
      miniature — la plupart des pages exposent une balise `og:image` (le
      mécanisme standard des aperçus de lien sur les réseaux sociaux), et
      les pages YouTube publient la leur (= la vignette de la vidéo), donc
      un seul mécanisme générique couvre à la fois YouTube et les articles
      classiques — les deux items distincts du backlog du 01/09/2026 se
      sont fondus en un seul.
      *Un seul champ, une seule origine possible côté front* :
      `affut_entrees.image_url` (`text`, nullable), qu'il soit rempli
      automatiquement ou collé à la main — le rendu ne distingue jamais
      l'origine. Choix assumé avec l'utilisateur (02/09/2026, sobriété
      demandée) : **lien direct (hotlink) vers l'image source, pas de
      copie dans un espace de stockage Supabase** — donc pas de nouveau
      bucket, pas de code d'upload de fichier. Contrepartie assumée : si
      la page source change ou retire son image plus tard, la miniature
      peut casser rétroactivement (jugé acceptable pour une veille
      hebdomadaire).
      *Nouvelle fonction Edge `affut-illustration`*
      (`apps/affut/supabase/functions/affut-illustration/`) : lire le HTML
      d'un site tiers depuis le navigateur est bloqué par CORS pour la
      plupart des sources, donc la récupération de l'`og:image` doit se
      faire côté serveur, sur le même principe que `affut-veille` (Lot 8).
      À la différence de `affut-veille` (jeton dédié, appelée par une
      routine cloud), celle-ci est appelée en direct par le navigateur du
      rédacteur connecté : authentification par la session Supabase Auth
      normale (JWT vérifié par la plateforme), plus une vérification
      explicite côté fonction que l'appelant est un rédacteur actif
      (`affut_redacteurs.actif`) — sans ce 2e contrôle, n'importe quel
      compte authentifié du projet `portail` (partagé avec
      organisation-cours) aurait pu s'en servir comme relais pour faire
      requêter le serveur vers une adresse de son choix (SSRF). Pas de
      `service_role` : la fonction n'écrit jamais en base, elle ne fait
      que lire une page tierce et en extraire une adresse d'image.
      Durcissement volontairement simple (usage bas volume, déclenché à la
      main) : schéma http(s) uniquement, hôtes locaux/privés refusés,
      délai (8 s) et taille de réponse (2 Mo de HTML) plafonnés.
      *Écran* : dans le formulaire modal d'une entrée (pas d'édition en
      place comme pour titre/résumé/chiffres — jugé inutile pour un champ
      modifié rarement), un champ « Illustration (adresse d'image,
      facultative) » avec un bouton **Récupérer l'illustration** (appelle
      la fonction Edge avec l'URL de la source déjà saisie dans le même
      formulaire) et un aperçu. Le bouton et l'aperçu sont manipulés en
      DOM direct, jamais via `render()` : le formulaire n'est pas
      contrôlé (lu seulement à la soumission), un `render()` en cours de
      saisie effacerait toute frappe non enregistrée dans les autres
      champs. Si aucune `og:image` n'est trouvée (site sans cette balise),
      message explicite invitant à coller une adresse à la main — c'est le
      filet de sécurité qui couvre le cas « je m'occuperai moi-même
      d'insérer une illustration » évoqué par l'utilisateur, sans qu'il
      soit nécessaire de construire un vrai formulaire d'upload de fichier
      pour cette passe.
      *Affichage* : petite vignette sobre (46×46) dans la ligne de
      l'entrée (rédaction et vue publiée, même gabarit) si `imageUrl` est
      renseigné, sinon rien (pas d'espace réservé). Tuile du Sommaire :
      bande de 88 px de large reprenant l'illustration de la **1re entrée
      validée** du numéro (jamais une entrée écartée/non retenue, même si
      elle apparaît avant dans le tableau) — pas de montage/collage de
      plusieurs images, conforme à la piste notée le 01/09/2026.
      *Validé le 02/09/2026* par test unitaire des fonctions ajoutées/
      modifiées (`renderChampIllustration`, `renderEntree`,
      `renderNumeroCarte`) exécuté dans un vrai navigateur (skill
      `claude-in-chrome`, isolé de tout Supabase — pas d'identifiants
      utilisés, la fonction Edge elle-même n'a pas pu être testée en
      conditions réelles depuis cet environnement) : champ et bouton
      présents, aperçu masqué/affiché selon la valeur, vignette d'entrée
      affichée seulement si `imageUrl` présent, tuile Sommaire reprend
      bien l'image de la première entrée **validée** (et ignore une
      entrée écartée placée avant). Rendu vérifié visuellement par
      injection isolée dans une page réelle (capture d'écran) : cohérent
      avec la charte, aucun débordement de mise en page. Application
      réelle rechargée sur serveur statique local sans erreur console.
      **Déployé et confirmé fonctionnel par l'utilisateur le 02/09/2026**,
      après un déploiement Supabase nettement plus accidenté que prévu —
      détail ci-dessous, à connaître pour toute prochaine Edge Function
      appelée directement depuis le navigateur (différent du cas
      `affut-veille`, appelée par une routine cloud) :
      1. **Nom de fonction non pris en compte au dashboard** : le
         formulaire « Deploy a new function » a déployé sous un nom
         d'exemple pré-rempli (`super-responder`, puis `clever-worker` à
         l'essai suivant) au lieu de `affut-illustration` malgré la
         correction du champ — cause exacte non identifiée avec certitude
         (dashboard Supabase), contournement : bien vérifier ensuite dans
         la liste des Edge Functions que le nom voulu y figure.
      2. **Désynchronisation du routage public** : une fois déployée sous
         le bon nom, la fonction répondait correctement au testeur intégré
         du dashboard mais 404 (« Requested function was not found ») sur
         l'URL publique `functions/v1/affut-illustration` pendant plusieurs
         minutes — résolu par un simple redéploiement (Deploy à nouveau,
         sans changement de code), qui a forcé une resynchronisation.
      3. **CORS — `x-client-info` manquant** : la librairie supabase-js
         ajoute automatiquement cet en-tête à chaque appel ; l'en-tête
         `access-control-allow-headers` de la fonction ne le listait pas
         (seulement `authorization, content-type, apikey`), donc le
         navigateur bloquait la vraie requête après un préflight pourtant
         réussi — corrigé en l'ajoutant à `CORS_HEADERS` dans `index.ts`.
      4. **`supabase.auth.getUser()` cassé pour cette clé de projet** :
         une fois le routage et le CORS réglés, la fonction recevait bien
         le jeton de session (vérifié : en-tête `authorization` present,
         967 caractères, bien du rédacteur) mais `getUser()` échouait avec
         une erreur de parsing JSON (« Unexpected token '<' » — une page
         HTML renvoyée par le service d'auth au lieu d'un JSON), cause
         précise non identifiée (probablement liée au nouveau format de
         clé du projet, `sb_publishable_...`, mais pas confirmé). **Solution
         retenue, plus simple et plus robuste que corriger `getUser()`** :
         vérifier le rédacteur directement par une requête PostgREST sur
         `affut_redacteurs` sous RLS (`auth.uid() = user_id`, policy déjà
         en place) — le même en-tête `authorization` que le reste de
         l'appli utilise déjà avec succès depuis les Lots 6/7, sans jamais
         passer par `auth.getUser()`. Fonction Edge finale donc plus
         simple que sa version d'origine, pas seulement corrigée.
      *Ajustements visuels demandés après validation fonctionnelle
      (02/09/2026)* :
      - Vignette d'entrée déplacée du côté gauche de la ligne vers la
        droite, **juste avant le bouton « Ouvrir la source »**, nettement
        agrandie (46×46 → 118×88), avec une légère rotation (-2°) et une
        ombre portée — écart assumé au « aucune ombre » du reste du
        portail (`.entree-image`), dans la continuité des écarts déjà
        actés pour affut (papier chaud, accent grenat) : rendu façon
        photo glissée dans un carnet, jugé cohérent avec le registre
        « carnet de veille naturaliste ». `.entree-row-droite` passé de
        colonne à ligne ; bouton + actions regroupés dans un nouveau
        `.entree-droite-colonne` pour garder leur empilement d'origine.
      - Vignette de tuile Sommaire élargie (88px → 220px) et la vue
        Sommaire elle-même élargie (1360px → 1560px, nouvelle classe
        `.app.vue-sommaire`, appliquée seulement à cette vue — pas à la
        lecture d'un numéro ni à la recherche, qui n'en ont pas besoin)
        pour lui laisser plus de place, sans toucher au reste de la mise
        en page publique.
      - **Récupération en masse** : bouton « Récupérer les illustrations
        manquantes » dans la barre d'actions du numéro (rédaction),
        à côté de « + Ajouter une entrée » — traite séquentiellement
        toutes les entrées du numéro affiché sans illustration, avec URL
        exploitable et sans lien mort ; le champ/bouton individuel du
        formulaire modal reste disponible pour changer une adresse au cas
        par cas, comme demandé. `appellerFonctionIllustration()` extrait
        en fonction partagée entre les deux chemins (individuel et en
        masse) pour ne pas dupliquer la logique de jeton/erreur.
      *Validé le 02/09/2026* : filtre de sélection des entrées à traiter
      testé unitairement (exclut une entrée déjà illustrée, sans URL,
      avec URL de repli `#...`, ou en lien mort), rendu de la vignette
      d'entrée et de la tuile Sommaire élargie vérifiés visuellement par
      injection isolée (capture d'écran). **Fonctionnement réel du bouton
      individuel confirmé par l'utilisateur en conditions réelles** (seul
      lot des trois du 02/09/2026 à l'être) — le bouton de récupération en
      masse n'a en revanche pas encore été testé par l'utilisateur en
      conditions réelles.
      *Bug constaté ensuite (02/09/2026) sur une entrée YouTube* : « Aucune
      illustration trouvée » alors que la page dispose bien d'une balise
      `og:image`. Première hypothèse (interstitiel RGPD lié à la région EU
      de la fonction Edge, cookie `CONSENT`/`SOCS` de contournement)
      **infirmée** après redéploiement et retest par l'utilisateur — toujours
      le même échec. Diagnostic ajouté temporairement à la fonction (renvoyé
      dans la réponse JSON et affiché dans le message de statut du front)
      pour voir ce que le serveur recevait réellement : `playabilityStatus`
      valait `LOGIN_REQUIRED` (« Connectez-vous pour confirmer que vous
      n'êtes pas un robot »), sans aucune balise `og:image`. **Cause réelle**
      : blocage anti-robot de YouTube sur la réputation de l'IP du
      datacenter Supabase — sans rapport avec le RGPD ni la région,
      confirmé par les 3 tentatives réussies depuis un poste hors datacenter
      pour la même vidéo. Scraper la page YouTube n'est donc pas fiable.
      **Corrigé différemment** : la fonction ne scrape plus jamais YouTube.
      `idVideoYoutube()` extrait l'identifiant de vidéo directement depuis
      l'URL (formats `watch?v=`, `youtu.be/`, `shorts/`, `embed/`, `live/`,
      `v/`), et `vignetteYoutube()` construit l'adresse de vignette statique
      publique `img.youtube.com/vi/<id>/maxresdefault.jpg` (repli sur
      `hqdefault.jpg`, toujours généré par YouTube — vérifié par un `HEAD`
      qui renvoie une 404 propre si l'identifiant est invalide ou la vidéo
      indisponible, pas de faux placeholder). Diagnostic temporaire retiré
      une fois la cause confirmée. **Pas encore redéployé ni revérifié en
      conditions réelles** — à faire au dashboard Supabase (Edge Functions
      → `affut-illustration` → recoller `index.ts` → Deploy, voir le
      `README.md` de la fonction) puis retester avec une entrée YouTube.

- [x] **Lot 15 — Carte « réseaux sociaux » en vue publiée** (02/09/2026,
      demande spontanée après le Lot 14, hors backlog prévu) : l'image
      d'une entrée devient elle-même le lien vers la source (au lieu du
      bouton « Ouvrir la source » à côté), et peut donc être bien plus
      grande — remaniement complet de l'affichage à l'écran d'une entrée
      en vue publiée, en carte façon fil Instagram/Twitter (image en haut,
      texte en dessous), plutôt que la ligne compacte partagée jusqu'ici
      avec la rédaction.
      *Décision structurante :* **deux rendus distincts pour une entrée en
      vue publiée**, générés côte à côte (`renderNumeroPage()`) — l'ancien
      `renderEntree()` (ligne compacte) et le nouveau `renderEntreeCarte()`
      (carte). Pourquoi ne pas avoir simplement remplacé l'un par l'autre :
      l'impression (Lot 4quater, grille 2 colonnes déjà réglée après
      plusieurs retours d'usage fin août) dépend entièrement de la
      structure de `renderEntree()` (`.entree`, `.qr-impression`, découpe
      en colonnes CSS) — la retoucher pour l'impression aurait remis en
      cause un réglage déjà validé, pour un besoin (le format carte)
      propre à l'écran. Résolu en CSS plutôt qu'en JS : `renderEntree()`
      généré comme avant mais **masqué à l'écran** en vue publiée
      (`.mode-publiee .entree{display:none}`) et **réaffiché à
      l'impression** (`@media print{.mode-publiee .entree{display:block
      !important}}`) ; `renderEntreeCarte()` fait l'inverse (visible à
      l'écran, masqué à l'impression). Rédaction non concernée :
      `renderEntreeCarte()` n'est jamais généré en rédaction (le choix se
      fait au niveau de la boucle `state.mode === "redaction" ? ... : ...`
      dans `renderNumeroPage()`), pas de carte à masquer pour cette vue.
      *Accessibilité (déjà auditée RGAA au Lot 5, à respecter) :* jamais
      l'image seule comme lien — le lien contient toujours aussi une
      légende textuelle visible (« Ouvrir la source → domaine ») en
      superposition basse sur l'image (dégradé sombre pour la lisibilité),
      qui donne au lien son nom accessible malgré l'`alt=""` (décoratif)
      de l'image ; entrée sans illustration : repli sur un bouton texte
      seul (réutilise `.btn-source-compact`, même style que l'ancien
      bouton en vue publiée).
      *Largeur* : carte plafonnée à 560px, centrée (`margin:0 auto`) —
      lecture en fil unique façon réseau social plutôt qu'une grille large,
      choix qui la rend de fait déjà adaptée au mobile sans média requête
      dédiée (confirmé par le retour de l'utilisateur : « ça sera
      sans doute plus simple de passer en mode mobile »). Vue Sommaire
      élargie au Lot 14 (`.app.vue-sommaire`, 1560px) non retouchée ici —
      concerne une tuile de numéro, pas une entrée.
      *Validé le 02/09/2026* : vérifié en conditions quasi réelles (la
      session Supabase déjà ouverte par l'utilisateur dans le même
      navigateur restait active dans les onglets ouverts par cette
      session de travail, aucun identifiant saisi par elle) — rendu
      correct sur les 8 entrées réelles du numéro 2 (avec et sans
      illustration, y compris une « illustration » qui est en réalité une
      capture d'écran d'un site cartographique, cas limite qui reste
      lisible), légende et dégradé lisibles, chiffre clé mis en avant
      toujours visible en carte. Largeur réduite testée via une `<iframe>`
      de 384px (équivalent mobile) injectée dans la page : la carte se
      redimensionne correctement, aucun débordement horizontal.
      *Précision a posteriori (repère découvert plus tard dans la même
      session)* : la note ci-dessus supposait que « Imprimer ce numéro »
      dépendait du `@media print` du CSS — faux, ce bouton génère un PDF de
      façon entièrement programmatique via jsPDF, sans jamais lire ce HTML
      (voir la note en tête de fichier, section « reprendre ici »). Le
      `@media print` reste correct et utile en repli pour un Ctrl+P direct
      du navigateur, mais ne bloque pas la validation du bouton lui-même.

- [x] **Lot 16 — Illustration du numéro (champ dédié)** (02/09/2026,
      demande explicite après confusion sur le Lot 14 : « je ne comprends
      pas bien comment l'illustration du numéro dans le sommaire est
      sélectionnée, ça ne semble pas correspondre à la première entrée »).
      *Cause du problème signalé* : la dérivation automatique (Lot 14)
      prenait `n.entrees[0]` — l'ordre brut renvoyé par Supabase, jamais
      trié par rubrique/`ordre` d'affichage réel — d'où un résultat
      imprévisible pour l'utilisateur.
      *Solution retenue, plus simple qu'une correction du tri* : un champ
      dédié `affut_numeros.image_url` (migration
      `apps/affut/supabase/008-numero-image.sql`, **pas encore
      appliquée**), rempli à la main par l'enseignant dans un nouveau champ
      « Illustration du numéro » en tête de l'écran de rédaction
      (`renderChampIllustrationNumero()` — texte seul, pas de bouton
      « Récupérer » comme pour une entrée : un numéro n'a pas de page
      source unique dont extraire une og:image). **Plus de repli
      automatique** : si le champ est vide, la tuile Sommaire n'affiche
      simplement aucune illustration — fini la règle peu lisible. Pour
      reprendre l'image d'une entrée déjà illustrée, la copier depuis son
      propre champ et la coller ici (pas d'automatisation prévue pour ce
      geste, jugé suffisamment rare).
      **Non testé en conditions réelles** — la migration SQL n'est pas
      encore appliquée (voir « reprendre ici » en tête de fichier).

- [x] **Lot 17 — Simplification de l'écran du numéro (fin des blocs par
      rubrique)** (02/09/2026, décidé en deux temps dans la même
      conversation) :
      1. D'abord demandé : pouvoir réordonner les rubriques dans un numéro
         (boutons Monter/Descendre sur le titre de rubrique, ordre stocké
         par numéro). **Implémenté puis entièrement retiré** dans la même
         session, l'utilisateur ayant reconsidéré juste après : « on s'en
         fiche d'ordonner les rubriques ». Rien n'en subsiste (ni en base —
         la colonne envisagée n'a jamais été ajoutée à la migration
         appliquée, ni dans le code).
      2. Décidé à la place : **plus de sections par rubrique à l'écran du
         tout** — remplacées par une **pastille de rubrique** sur chaque
         entrée (`.pastille-rubrique`, en tête de `.flat-meta`, pleine
         plutôt que contourée pour rester repérable malgré sa taille), en
         rédaction comme en carte publiée. Ordre des entrées **à plat sur
         tout le numéro** plutôt que par rubrique (Lot 10bis) :
         `entreesOrdonnees()` remplace `voisinsRubrique()`,
         `prochainOrdre()` remplace `prochainOrdreRubrique(rubrique)`. Pas
         de migration de données nécessaire : `entreesOrdonnees()`
         recalcule un ordre à plat stable à partir du regroupement par
         rubrique existant (`groupByRubrique()`, conservé tel quel — deux
         rubriques différentes pouvaient légitimement partager les mêmes
         valeurs `ordre` avant ce lot, les trier globalement sans ce détour
         les aurait mélangées au hasard) ; dès le premier déplacement
         Monter/Descendre, `ordre` redevient unique sur tout le numéro.
      3. Vue publiée à l'écran : une seule grille responsive
         (`.carte-grille`, `auto-fit`/`minmax`, 1 colonne sur mobile, 2 à 3
         selon la largeur réelle) pour tout le numéro, plus une par
         rubrique — demandé explicitement (« grille 2 voire 3 colonnes »).
         Repli d'impression navigateur direct (Ctrl+P, `renderEntree()`)
         et export PDF (bouton dédié, jsPDF) inchangés dans leur principe,
         voir le repère en tête de fichier — **le PDF continue de grouper
         par rubrique**, seul l'écran est concerné par ce lot.
      4. Tuile Sommaire (`renderNumeroCarte`) : simplifiée en même temps
         (même conversation, retour d'usage direct) — **toute la tuile
         devient cliquable** (`<button>` plutôt que `<div>`, reprend
         `data-action="ouvrir-numero"` déjà géré par le handler existant),
         **retrait du bloc de droite** (compteur d'actualités + bouton
         « Ouvrir le numéro », jugé redondant). Mobile (`max-width:640px`)
         : empilé plutôt que côte à côte, liste détaillée des actualités
         masquée — ne restent que le numéro, l'image et le titre, comme
         demandé (« simplement une suite de bandeau/carte avec
         n°+illustration cliquable »).
      *Validé le 02/09/2026* avec de vraies données, via la session déjà
      ouverte dans le navigateur par l'utilisateur (aucun identifiant saisi
      par cette session) : aucune erreur console ; en rédaction, 8 entrées
      affichées à plat avec leur pastille de rubrique, plus aucune section ;
      en vue publiée, une seule grille de 8 cartes confirmée sur 3 colonnes
      actives à cette largeur (`gridTemplateColumns` inspecté directement),
      chaque carte porte sa pastille ; tuile Sommaire testée en conditions
      réelles — clic sur la tuile ouvre bien le numéro (a d'ailleurs
      confirmé au passage, par un clic accidentel sur une image pendant la
      vérification, que le lien-image d'une carte fonctionne bien en
      conditions réelles, jusqu'au comptage du clic). **Non testé par
      l'utilisateur lui-même.**

- [x] **Lot 17bis — correctif : l'ordre à plat ne fonctionnait pas vraiment**
      (02/09/2026, retour d'usage à la reprise : « je ne peux pas vraiment
      ordonner les entrées comme je veux, seulement au sein d'une
      rubrique »). Cause : `entreesOrdonnees()` (Lot 17) passait encore par
      `groupByRubrique()` pour calculer l'ordre à plat — qui groupe
      **d'abord** par rubrique (1re apparition) puis trie **seulement** à
      l'intérieur de chaque groupe. Monter/Descendre modifiait donc bien
      `ordre` en base, mais une entrée ne pouvait jamais visuellement
      franchir sa frontière de rubrique : le Lot 17 n'avait donc pas
      vraiment livré ce qui était demandé, malgré une vérification qui
      n'avait testé qu'un déplacement à l'intérieur d'une même rubrique.
      Corrigé : `entreesOrdonnees()` trie maintenant **directement** par
      `ordre`, sans repasser par `groupByRubrique()` (qui reste utilisée
      telle quelle, elle, uniquement par l'export PDF — voir le repère en
      tête de fichier). Ce tri direct suppose `ordre` unique à plat sur tout
      le numéro, ce qui n'est pas le cas des entrées déjà en base (`ordre`
      attribué **par rubrique** depuis le Lot 10bis, deux rubriques pouvant
      partager les mêmes valeurs 0,1,2…) : migration dédiée
      `supabase/009-ordre-entrees-plat.sql`, qui renumérote `ordre` à plat
      par numéro en reproduisant l'affichage actuel (groupé par rubrique,
      approximée par la date de création la plus ancienne de chaque
      rubrique, puis par `ordre` existant) — **pas encore appliquée par
      l'utilisateur**, à faire avant de considérer ce correctif définitivement
      opérationnel sur les numéros existants (les nouveaux numéros, sans
      historique, ne sont pas concernés par la collision).
      *Vérifié en conditions réelles* le 02/09/2026 (session déjà ouverte
      dans le navigateur par l'utilisateur, aucun identifiant saisi) : ajout
      de logs temporaires ayant confirmé le diagnostic (`idx`/`idxCible`
      corrects, mais l'affichage ne changeait pas), puis, après correctif,
      déplacement de l'entrée « L'INPN… » (rubrique Données & référentiels)
      **avant** l'entrée « VivArmor Nature » (rubrique Positionnement) —
      confirmé persistant après un rechargement complet de la page, y
      compris en vue publiée — puis remis à sa position d'origine pour ne
      pas perturber le jeu de données de démonstration.

- [ ] **Lot 18 — Repasse mobile sur la vue publique** (démarré 02/09/2026,
      EN COURS). Demande explicite : « il y a beaucoup de boulot de mise
      en page sur la partie mobile ! » — priorité aux 3 écrans de
      consultation (Sommaire, lecture d'un numéro, Rechercher), qui sont
      l'usage principal réel de l'app (terrain, testé notamment sur
      Samsung Galaxy XCover4s — 5", 720×1280, viewport CSS ~360×640).
      *Méthode* : `node` indisponible sur ce poste (pas de gestionnaire de
      version Node ni de droits `sudo` pour l'installer) → impossible de
      lancer `context.mjs` du skill `impeccable`, PRODUCT.md/DESIGN.md et
      `reference/adapt.md` relus à la main à la place. App servie en local
      (`python3 -m http.server`) et inspectée dans Chrome via
      claude-in-chrome ; `resize_window` ne redimensionne pas réellement
      la fenêtre dans cet environnement (elle reste bloquée à sa taille
      d'écran) — contournement : une page wrapper avec une `<iframe
      width=360 height=640>` chargeant l'app, qui a son propre viewport
      CSS indépendant de la fenêtre du navigateur.
      **Corrigé et vérifié en navigateur (360×640)** :
      1. **Page d'accueil vide.** `state.vue` valait `"numero"` par défaut
         (`index.html`) : l'app atterrissait directement sur le dernier
         numéro, y compris quand celui-ci n'a encore aucune entrée — page
         qui semble cassée/vide au premier chargement, sur mobile comme
         sur desktop (retour d'usage direct de l'utilisateur en cours de
         session). **Corrigé** : `vue: "sommaire"` par défaut — le
         Sommaire affiche toujours au moins la liste des numéros parus.
         `numeroId` reste calculé normalement à l'init
         (`numeroParDefaut()`) : ouvrir un numéro ou passer en Rédaction
         retombe bien sur le bon numéro, aucune régression identifiée.
      2. **Débordement horizontal de toute l'app sur le Sommaire.**
         `.sommaire-mois` (en-tête de groupe mensuel : nom du mois + filet
         décoratif + décompte + bouton « Déplier » pour les mois
         repliables) n'avait pas de repli mobile — nom, décompte et bouton
         sont tous incompressibles (`white-space:nowrap` ou largeur
         minimale de contenu), et sans `flex-wrap` la somme dépassait la
         largeur de l'écran, forçant une scrollbar horizontale sur **toute
         l'app**, pas seulement cette ligne. Un mois replié (avec bouton)
         déclenchait le bug, le premier mois (ouvert, sans bouton) non —
         d'où un bug qui n'apparaissait qu'à partir du 2e mois du
         Sommaire. **Corrigé** dans le bloc `@media(max-width:640px)`
         existant : `.sommaire-mois{flex-wrap:wrap}`, filet décoratif
         masqué sur mobile (`display:none` — n'apporte aucune information,
         inutile de lui trouver une place), décompte poussé à droite du
         nom (`margin-left:auto`), bouton Déplier libre de passer à la
         ligne suivante si besoin.
      **Pas encore vérifié** : le rendu des cartes d'entrée
      (`.entree-row`/`.flat-titre`/`.flat-resume`/`.btn-source-compact`…)
      sur les écrans Sommaire→lecture d'un numéro et Rechercher — CSS déjà
      substantiel à `@media(max-width:640px)` pour ces classes (empilement,
      cibles tactiles ≥44px sur `.btn-source-compact`), a priori issu du
      Lot 10 (refonte Moisson), mais **aucune vérification visuelle
      possible** : les numéros n°1 et n°2 actuellement publiés en base
      n'ont aucune entrée (dépôt de test/démarrage — seule une illustration
      de numéro est présente sur le n°2, via le Lot 16). Écran Rechercher
      vérifié visuellement (barre de recherche, filtres, bouton) : pas de
      débordement, mise en page correcte en l'absence de résultats.
      **Reste à faire à la prochaine reprise** : soit tester avec un
      numéro contenant de vraies entrées, soit repasser avec un jeu de
      données de démonstration, pour auditer réellement l'écran le plus
      consulté (liste des entrées d'un numéro).

- [ ] **Lot 19 — Correctif : aucune entrée ne s'affichait en vue publique**
      (trouvé 02/09/2026, EN COURS — migration pas encore appliquée par
      l'utilisateur). Retour direct de l'utilisateur pendant le Lot 18 :
      « pourquoi je ne peux pas accéder aux entrées en cliquant sur le
      numéro publié ? […] je ne vois pas la liste des entrées s'afficher
      dans la tuile du dernier numéro […] Il y a des bugs sévères là. »
      *Diagnostic* (navigateur, `apps/affut/index.html` servi en local) :
      1. Connecté en rédaction : Sommaire et « Vue publiée » affichent
         correctement les 9 entrées du n°2 — aucun souci apparent.
      2. Déconnecté (bouton Déconnexion) puis page rechargée à froid
         (visiteur anonyme réel) : le même numéro affiche « 0 actualité »
         partout, la tuile Sommaire et la lecture du numéro sont vides.
      3. Éliminé un par un : requêtes réseau vers `affut_numeros_public` et
         `affut_entrees_public` toutes deux 200 (vérifié via
         `read_network_requests`) ; un `fetch()` direct de la même URL
         depuis la page renvoie les 9 entrées complètes (11 343 octets) ;
         une requête `curl` indépendante hors navigateur, avec la même clé
         `sb_publishable_…`, renvoie aussi les 9 entrées ; un client
         Supabase-JS flambant neuf créé à la console renvoie aussi
         `count: 9`. **Donc ni le réseau, ni la clé anon, ni la RLS.**
      4. Cause trouvée en lisant `affut_entrees_public` dans
         `supabase/007-illustration-entree.sql` (et ses versions
         précédentes, 002/006, identiques sur ce point) : la vue filtre
         `where valide = true` mais n'a **jamais** inclus la colonne
         `valide` dans son `select` — vrai depuis sa toute première
         définition. Côté front, `depuisLigneEntree()` (index.html) fait
         `valide: r.valide`, donc `undefined` pour chaque ligne de cette
         vue. Or l'écran public filtre systématiquement par `e.valide`
         (compteurs de mois du Sommaire, liste d'entrées d'un numéro,
         Rechercher, impression — une dizaine d'usages de
         `.filter(e => e.valide)` dans tout le fichier) : `undefined` y
         est traité comme faux, donc **chaque entrée disparaît sans
         erreur ni exception, sur tous les numéros**, dès qu'on n'est pas
         connecté. La rédaction n'est jamais touchée : elle lit
         `affut_entrees` en direct (`chargerDonneesRedaction()`), qui a la
         vraie colonne `valide` — un chemin de code entièrement différent,
         d'où un bug invisible à toute vérification faite connecté (tout
         le travail des Lots 1 à 18 a été vérifié ainsi).
      **Corrigé** : nouvelle migration
      `supabase/010-fix-entrees-public-valide.sql` — recrée la vue en
      ajoutant `true as valide` en dernière colonne (Postgres interdit
      d'insérer une colonne ailleurs qu'en fin de liste sur un `CREATE OR
      REPLACE VIEW` sans `DROP VIEW`, même contrainte que `image_url` au
      Lot 14 ; `true` en dur plutôt que la vraie colonne — le `where valide
      = true` de la vue garantit déjà que toute ligne renvoyée est valide,
      pas besoin de la colonne réelle). **Pas encore appliquée par
      l'utilisateur** (pas d'accès `service_role`/SQL direct depuis cette
      session) — à faire au dashboard Supabase (SQL Editor, coller le
      contenu du fichier, Run), puis revérifier déconnecté qu'un numéro
      publié affiche bien ses entrées.
      *Non couvert par ce correctif, à vérifier séparément si besoin* :
      `affut_numeros_public` n'est pas concernée (pas de notion de
      `valide` par entrée) ; aucune autre vue publique du projet ne suit ce
      même motif `where X = true` sans exposer `X` — vérifié par lecture
      des migrations, mais pas testé une par une en conditions réelles.

- [x] **Lot 20 — Connexion discrète + rédaction mobile praticable**
      (02/09/2026). Trois demandes explicites de l'utilisateur après
      confirmation que le Lot 19 (correctif entrées publiques) fonctionne :
      1. **Bouton « Se connecter » retiré du bandeau public**, déplacé en
         bas de la seule page Sommaire, discret (glyphe `⚿`, mono, petit,
         aligné à droite — `.connexion-discrete`) : plus jamais visible sur
         les autres écrans publics ni pour un rédacteur déjà connecté.
         Message « **Espace réservé** à l'équipe pédagogique » ajouté en
         tête de la modale de connexion.
      2. **Barre d'onglets rédacteur qui débordait sur mobile** (Sommaire/
         Rechercher/Sources/Bilan/Rédaction/Vue publiée, 6 boutons, jamais
         couverte par un repli mobile jusqu'ici) : rendue défilante
         horizontalement dans son propre cadre (`.mode-toggle{overflow-x:
         auto}`) plutôt que passée à la ligne (6 pastilles sur plusieurs
         lignes aurait pris toute la hauteur d'écran) — motif de barre
         d'onglets mobile courant, reste compact. Confirmé : plus de
         défilement horizontal de la page entière (`document.body.
         scrollWidth` vérifié < largeur d'écran après le correctif).
      3. **Rédaction mobile peu praticable, "en vrac"** (retour direct :
         « je suggère qu'en vue mobile rédaction il faut cliquer sur des
         titres d'entrées pour ouvrir un menu avec les champs modifiables,
         plutôt que de les avoir en vrac »). Constat : ce « menu » demandé
         **existait déjà** — la modale « Modifier » (`renderModal()`,
         bouton jusque-là secondaire) a tous les champs (rubrique, source,
         territoire, URL, domaine, date, titre, illustration, chiffres,
         résumé, usage). Il manquait juste le déclencheur adapté au mobile.
         Corrigé dans `index.html` :
         - Nouvelle fonction `mobileActif()` (`matchMedia(max-width:640px)`).
         - `ed()` (les `<span contenteditable>` d'édition en place) ne
           s'active plus sur mobile — au doigt, un span d'édition minuscule
           au milieu d'une ligne dense est peu praticable, et les deux
           modes de saisie en même temps prêtaient à confusion. Sur
           desktop, l'édition en place reste inchangée.
         - Le **titre de l'entrée devient un bouton** sur mobile
           (`.flat-titre-bouton`, chevron `›`) qui ouvre directement la
           modale « Modifier » — le bouton « Modifier » de la ligne
           d'actions, devenu redondant, est masqué en CSS mobile
           (`.entree-actions [data-action="edit-entree"]{display:none}`) ;
           Déplacer/Supprimer/Monter/Descendre/case « retenue » restent
           tels quels (pas couverts par la modale).
         - Écouteur `resize` (anti-rebond 150 ms) ajouté en toute fin de
           fichier : sans lui, franchir le seuil mobile (rotation d'écran,
           redimensionnement DevTools) n'aurait changé le rendu qu'au
           prochain clic — le HTML émis en rédaction dépend maintenant de
           la largeur d'écran, pas seulement de l'état.
      **Bug préexistant trouvé en testant ce lot (pas introduit par lui)** :
      `.entree-droite-colonne` (bouton « Ouvrir la source » + Déplacer/
      Supprimer, colonne de droite d'une entrée) était `flex:none` alors
      que son contenu réclamait `width:100%` — sizing circulaire côté
      navigateur, qui retombait sur la largeur naturelle du contenu et
      dépassait l'écran, réservé à la rédaction mobile (jamais vu en vue
      publiée, qui n'affiche pas `.entree-actions`). Corrigé au passage
      (`flex:1;min-width:0`, aux côtés de l'illustration de l'entrée).
      *Méthode de vérification* : `node` indisponible sur ce poste (voir
      Lot 18) → pas de connexion réelle possible pour tester la rédaction
      (pas d'identifiants dans cette session). Contournement ponctuel :
      copie de `index.html` dans le répertoire de travail temporaire, avec
      `estRedacteurActif()` forcé à `true` et `state.mode` forcé à
      `"redaction"`, servie en local et inspectée en navigateur (iframe
      360×900, même technique que le Lot 18) — copie et serveur de test
      supprimés après vérification, **le fichier réel n'a jamais été
      modifié pour ce test** (confirmé par `git status` après coup).
      Chargement des données passé par `chargerDonneesPubliques()` (pas de
      vraie session), donc `numero.candidates` affichait "undefined" dans
      ce test uniquement — artefact du contournement, pas un bug, absent
      avec une vraie session rédacteur.
      **Non vérifié par l'utilisateur lui-même** — à confirmer à la
      prochaine reprise, notamment le geste titre → modale sur un vrai
      téléphone (au doigt, pas à la souris).

- [x] **Lot 21 — Correctif : espace vide sous l'illustration du n° 2 au
      Sommaire** (02/09/2026). Retour direct de l'utilisateur, en creusant
      un point soulevé pendant le Lot 18 (mise en page mobile) sur le
      traitement des illustrations (conteneur à format fixe + image
      recadrée par `object-fit:cover`, partout dans l'app) : « Le cadre est
      plus grand que l'image, ce qui donne un espace vide sous l'image »,
      sur la tuile du n° 2 en page Sommaire.
      *Diagnostic* : rien à voir avec le CSS/`object-fit` — vérifié en
      navigateur, `.nc-image` (220×235px sur le rendu observé) est
      correctement dimensionnée par `align-items:stretch`, que l'image soit
      chargée ou non. La vraie cause : `<img loading="lazy">`
      (`renderNumeroCarte()`) restait bloquée à `complete: false,
      naturalWidth: 0` malgré une image valide et rapide (vérifié en curl
      direct : 456 Ko, ~0,5 s) — forcer `img.loading = "eager"` en console
      la charge instantanément (1200×800), qui confirme que seul
      l'attribut `loading="lazy"` posait problème.
      **Corrigé** : `loading="lazy"` retiré de l'image de tuile Sommaire
      (`renderNumeroCarte()`) — cette tuile est quasi toujours au-dessus de
      la ligne de flottaison (c'est LE visuel de tête du Sommaire, la
      dernière rendue en premier), le différer n'apportait rien face au
      risque d'espace vide. Les autres images de l'app (vignette d'entrée,
      carte « réseaux sociaux », aperçus de formulaire) restent en l'état,
      pas concernées par ce retour.
      *Discussion adjacente, tranchée avec l'utilisateur* : le choix
      « conteneur à format fixe, image recadrée » (plutôt que l'inverse)
      reste approprié pour cet écran — chaque tuile de numéro occupe toute
      la largeur et s'empile verticalement (pas une grille à plusieurs
      colonnes), donc une hauteur d'image variable n'aurait pas d'impact
      d'alignement ici, contrairement à la grille 2-3 colonnes des entrées
      publiées (Lot 15/17) où ça compterait davantage.
      *Vérifié en navigateur* (`img.complete`/`naturalWidth` avant/après,
      capture d'écran) — **pas encore vérifié par l'utilisateur en
      conditions réelles**.

- [x] **Lot 22 — Tuile active dans le portail général + badge « dernier
      numéro »** (02/09/2026, demandé juste après la fusion de la PR des
      Lots 14-21). Deux changements dans `portail/index.html` :
      1. La tuile « À l'affût » passe de `tool--wip`/`chantier` à
         `tool--active`/`service` (même traitement visuel que PhytoScope,
         Végétations, Zonation) — la mention « Premier numéro pas encore
         paru » est retirée de la description, devenue fausse (2 numéros
         publiés en base).
      2. Badge dynamique (`#affut-badge`, dans `.tool-foot`, à gauche de la
         flèche) qui affiche « n°X disponible » — X venant d'une requête
         `fetch` en direct sur la vue publique Supabase
         `affut_numeros_public` (`select=numero&order=numero.desc&limit=1`,
         clé `anon` publique, même couple URL/clé que `apps/affut/index.html`).
         Choix délibéré : pas de valeur codée en dur, pour que le badge
         s'incrémente d'elle-même à chaque nouvelle publication côté
         rédaction, sans retouche du portail. En échec réseau/silence de
         l'API, le badge reste `hidden` (aucun texte cassé affiché).
      *Piège rencontré et évité* : au moment de faire ce lot, le `main`
      local était périmé de 6 commits par rapport à `origin/main` (la
      fusion de la PR #70 avait réussi côté GitHub, mais la synchronisation
      locale avait échoué à cause de fichiers non liés modifiés dans l'arbre
      de travail — voir plus haut). `portail/index.html` avait entre-temps
      reçu la tuile « Quizz naturaliste » sur `origin/main`, absente du
      fichier local. Modifier le fichier local en l'état aurait fait
      disparaître cette tuile au prochain merge. Corrigé en reconstruisant
      `portail/index.html` (et `AVANCEMENT.md`) à partir du contenu de
      `origin/main` avant d'y réappliquer ces changements — **le `main`
      local reste périmé**, à mettre à jour un jour (fast-forward bloqué par
      des modifications non commitées à `DESIGN.md` et
      `apps/zonation/index.html`, sans rapport avec affut, non touchées).
      *Vérifié* : rendu desktop et mobile (gabarit iframe local), badge
      confirmé affichant « n°2 disponible » en conditions réelles (requête
      Supabase live) — **pas encore vérifié par l'utilisateur en conditions
      réelles**.

## Idées pour plus tard (hors lots planifiés)

**Backlog du 01/09/2026 entièrement traité au 02/09/2026** (chiffres clés
éditables en place → Lot 12 ; espace bilan/analyse → Lot 13 ; miniature
YouTube + images générales + illustration du Sommaire, fusionnés en un
seul objectif → Lot 14). Rien en attente ici pour l'instant — prochaine
idée à définir avec l'utilisateur.

## Points laissés ouverts par le brief (à trancher en cours de route)

- Auteur unique ou plusieurs enseignants (impacte le Lot 7).
- Nom de la 5e rubrique (4 sont utilisées dans les maquettes).
- Métadonnées de source (type de document, pages, durée de lecture) :
  déduites du lien ou saisies à la main.
- Jour/heure de collecte et de publication, incohérents entre deux
  écrans du handoff — à fixer.
