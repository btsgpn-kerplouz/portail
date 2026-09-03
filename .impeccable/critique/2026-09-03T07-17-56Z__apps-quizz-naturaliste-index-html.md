---
target: apps/quizz-naturaliste/index.html — revue ergonomie
total_score: 22
max_score: 40
na_heuristics: 
p0_count: 1
p1_count: 3
timestamp: 2026-09-03T07-17-56Z
slug: apps-quizz-naturaliste-index-html
---
Method: dual-agent (A: a6754e3f7a3c615a4 · B: a7cfd6a584f83c9a3)

## Design Health Score

| # | Heuristic | Score | Key issue |
|---|---|---|---|
| 1 | Visibility of system status | 2 | Bonne ligne récap + progression + score ; mais aucun état de chargement photo/audio, aucun signal réseau/hors-ligne. |
| 2 | Match system / real world | 3 | Vocabulaire naturaliste excellent. « Média » un peu technique. |
| 3 | User control & freedom | 2 | « Arrêter » termine la série sans confirmation ; changer de Média efface silencieusement les filtres ; pas de retour arrière sur une question ; pas de pause sur le chrono. |
| 4 | Consistency & standards | 3 | Système cohérent. Écarts : « Je ne sais pas » en petit texte et non bouton ; `<audio>` natif au milieu de contrôles sur-mesure ; deux libellés « aucun filtre » différents. |
| 5 | Error prevention | 1 | Pas de confirmation « Arrêter » ; pas de garde sur la perte de filtres au changement de Média ; timeout chrono = compté FAUX ; « Commencer » actif dès 2 espèces (série de 10 qui boucle sur 2 photos). |
| 6 | Recognition vs recall | 2 | L'écran de quiz ne rappelle ni le mode ni la difficulté ni les filtres actifs ; l'écran de fin liste les ratées par nom, SANS photo → il faut se souvenir de l'oiseau vu. |
| 7 | Flexibility & efficiency | 3 | Clavier 1–9 / Entrée, « Tout cocher », puces retirables. Manque : pas de config sauvegardée / presets, pas de « rejouer les ratées ». |
| 8 | Aesthetic & minimalist | 3 | Propre et discipliné, mais l'écran de config est dense et le sonagramme ajoute du bruit visuel pour une info quasi nulle. |
| 9 | Error recovery | 1 | Échec de chargement photo/audio = impasse silencieuse, aucun message, aucun réessai, aucun « passer ». Le seul vrai état d'erreur (« Données absentes ») s'adresse à un développeur. |
| 10 | Help & documentation | 2 | Ligne d'aide clavier + hints Média/Difficulté. Pas de guidage premier lancement, pas d'explication du score, syntaxe de l'autocomplétion Expert non documentée. |
| **Total** | | **22 / 40** | **Acceptable (55 %) — améliorations significatives nécessaires** |

## Design Specificity Verdict

**Identité et logique métier : spécifiques. Interaction et flux : quiz générique.**

Ce qui est authentiquement « ce produit » : la génération des distracteurs suit la vraie taxonomie (même sous-groupe → même genre → même famille, « espèces jumelles ») ; le secteur Bretagne/France recalcule les compteurs en direct ; sonagramme Xeno-canto + mode « vol nocturne » dédié ; attribution + licence + lien par stimulus ; vocabulaire de terrain (limicoles, ardéidés, passereaux) ; charte « papier technique froid » appliquée avec rigueur.

Mais le **modèle d'interaction est un constructeur de quiz générique** : une pile de 8 contrôles segmentés + une grille de 25 cases, poids visuel uniforme, aucun défaut opérant mis en avant, aucune persistance. Et **rien dans le flux ne reflète « terrain + téléphone + plein soleil + réseau incertain »** : pas de posture hors-ligne, pas de gestion d'échec réseau, pas de mode « grandes cibles », pas de reprise de série.

**Scan déterministe** : `detect.mjs` → 2 avertissements `layout-transition` (lignes 263, 266) sur `transition: width` des jauges progression + chrono. **Faux positifs** : width est la propriété correcte pour une jauge déterminée, bandes de 6–8 px, comme les autres apps du dépôt. Overlay navigateur : 11 signalements, essentiellement des **compromis assumés de la charte** (labels Mono < 11 px, capitales, `border-top` 5 px du bandeau) — sauf le contraste `--t4` qui est un vrai défaut, et le paragraphe de pied full-bleed.

**Bug latent** (Assessment B) : `finish()` ne garde pas `if(!game) return;` → `TypeError` si appelé avant toute partie. Non atteignable par l'UI normale, mais fragilité à corriger.

## Overall Impression

L'app fait bien son travail de quiz et son identité est soignée. Deux angles morts dominent, tous deux liés à la **scène d'usage réelle** (élève BTS GPN, téléphone, terrain) :

1. **L'entrée dans l'app** — un mur de réglages avant de pouvoir lancer quoi que ce soit, sans défaut opérant ni mémoire.
2. **Les moments à enjeu** — échec réseau (impasse muette), mauvaise réponse (n'apprend rien), fin de série (liste froide sans photos).

La plus grosse opportunité : **transformer le flux « constructeur de quiz » en flux « je m'entraîne » ** — défaut immédiat + affiner ensuite, et faire des erreurs/ratées le cœur pédagogique (comparaison photo, « rejouer les ratées », carnet cross-session).

## What's Working

1. **La ligne de lancement vivante.** La barre encre collante « N espèces dans le tirage · 10 questions · entraînement », mise à jour à chaque filtre et qui désactive « Commencer » sous 2 espèces, relie les réglages abstraits à la seule conséquence qui compte (taille et cohérence du tirage). La plupart des quiz font découvrir ça après avoir commencé.
2. **Difficulté = provenance des distracteurs, calquée sur le raisonnement du naturaliste.** « Confirmé » qui tire des congénères (« espèces jumelles ») puis retombe sur la famille, avec un hint nommant de vrais taxons.
3. **Attribution par stimulus, faite correctement.** Crédit + licence + « voir l'observation » sur chaque question — respecte la contrainte CC-libre et apprend discrètement d'où viennent les données de référence.
4. **Compteurs recalculés par secteur** avant de s'engager — permet de juger si un filtre laisse un vivier utilisable.

## Priority Issues

### [P0] Échec de chargement image/audio = impasse silencieuse
- **Quoi** : `.photo` (background-image distante) et `<audio src>` distant (iNaturalist / xeno-canto.org) n'ont aucun état de chargement, d'erreur, de réessai ou de « passer ». Un chargement lent ou raté rend la question insoluble et l'app « cassée » ; `preload="none"` retarde encore l'audio.
- **Pourquoi ça compte** : la scène annoncée est un réseau côtier instable — ça arrivera à presque chaque session. Chaque occurrence coûte une question et sape la confiance dans l'outil de terrain.
- **Fix** : détecter l'échec ; afficher « Image non chargée — Réessayer / Passer (non comptée) » ; précharger le stimulus suivant ; cacher les N derniers via le service worker déjà enregistré ; proposer un « télécharger une série pour le terrain » hors-ligne.
- **Commande** : `/impeccable harden`

### [P1] L'écran de config est un mur (~8 contrôles + grille de 25) avant de pouvoir lancer
- **Quoi** : Média (3), Secteur (2), Groupe (6), Sous-groupes (25), Difficulté (4), Chrono (3), Questions (3), Réponses proposées (3) — presque tout visible à la fois, poids uniforme, aucun défaut mis en avant, aucune persistance (`cfg` en mémoire seulement).
- **Pourquoi ça compte** : un élève qui s'entraîne entre deux points de terrain veut une série *maintenant* ; les débutants rebondissent sur la machinerie ; les habitués re-règlent tout à chaque session.
- **Fix** : défaut opérant (Photo · Bretagne · Entraînement · 10) avec « Commencer » au-dessus de la ligne de flottaison ; tout replier sauf Média + Difficulté dans un « Affiner le tirage » ; mémoriser la dernière config en localStorage + 2–3 presets nommés (« Limicoles baie », « Passereaux jardin »).
- **Commande** : `/impeccable shape` (IA du flux) puis `/impeccable layout`

### [P1] Le mode son est sous-construit pour la façon dont on identifie au son
- **Quoi** : `<audio controls>` natif nu, autoplay une fois, pas de boucle, pas de bouton « réécouter », pas de ralenti, cible ~42 px ; le sonagramme s'affiche en gris pâle quasi invisible, sans axes temps/fréquence.
- **Pourquoi ça compte** : un naturaliste réécoute un cri 5–10× et ralentit les cas difficiles ; sur un téléphone au soleil le contrôle natif est un filet et le sonagramme ne dit rien.
- **Fix** : gros bouton « Réécouter », vitesse 0,5×/0,75× optionnelle, compteur d'écoutes ; sonagramme haut contraste avec au moins un axe temps, ou derrière « voir le sonagramme ».
- **Commande** : `/impeccable shape` sur le composant lecteur, puis `/impeccable adapt`

### [P1] Le feedback de mauvaise réponse n'apprend rien
- **Quoi** : « Raté — c'était X (Sci) » en rouge, puis suivant. « À revoir » = noms seulement — pas de vignette, pas de « ta réponse », pas de récap par question, pas de lien.
- **Pourquoi ça compte** : tout l'intérêt pédagogique BTS GPN est d'apprendre à discriminer des espèces proches ; le moment d'erreur est là où ça doit se jouer, et c'est actuellement une impasse.
- **Fix** : sur une erreur, garder le stimulus visible + montrer la bonne espèce (vignette + nom + un critère de distinction quand la donnée existe) ; « À revoir » avec vignettes + bouton « Rejouer les ratées » ; persister les ratées dans un « carnet à revoir » cross-session.
- **Commande** : `/impeccable shape` + `/impeccable clarify`

### [P2] « Arrêter » : bouton un-tap non confirmé qui termine la série, à côté de l'action primaire
- **Quoi** : `#quit` → `finish()` immédiat ; même poids visuel et adjacence que « Suivant » ; sur mobile « Suivant » est sous la ligne de flottaison alors que « Arrêter » est toujours à portée de pouce.
- **Pourquoi ça compte** : usage à une main, interrompu → perte accidentelle de toute la série facile.
- **Fix** : « Arrêter » en lien discret dans la barre du haut, ou confirmation (« Arrêter la série ? Score partiel : N % ») ; barre d'action collante sur l'écran de quiz pour que « Suivant » soit toujours atteignable.
- **Commande** : `/impeccable harden` + `/impeccable adapt`

### [P2] États dynamiques non annoncés ; contraste insuffisant sur les chiffres clés
- **Quoi** : pas d'`aria-live` sur `#feedback` / `#progress` / `#score` ; focus non déplacé à la transition config→quiz (perdu sur `<body>`) ; chrono purement visuel, sans `role="timer"` ni avertissement avant de compter faux ; `--t4 #8a958c` (compteurs, phrase du vivier, chips-empty, placeholder) mesuré **2,78–3,11:1** — échoue AA partout ; « Je ne sais pas » désactivé à `opacity:.4` invisible ; combobox Expert sans `aria-activedescendant`.
- **Cibles tactiles < 44 px @ 375 px** : Secteur 30 px, « Tout cocher/effacer » 18 px, « Options d'affichage » 17 px, segs Difficulté/Chrono/Questions 42 px (limite). **Débordement horizontal ~8 px à 320 px** (bloc filtres).
- **Commande** : `/impeccable audit` (a11y) + `/impeccable adapt` (cibles, 320 px)

## Persona Red Flags

**Casey (mobile distrait, une main, interrompu, réseau lent)**
- `.photo` + `<audio>` distants sans cache/repli/passer ; `preload="none"` retarde l'audio.
- `#quit` non confirmé, termine la série, toujours à portée de pouce, collé au bouton primaire.
- « Suivant » sous une photo 4:3 + 4 choix, pas de barre d'action collante sur le quiz (il y en a une sur la config).
- Chrono 10 s + timeout compté faux → toute interruption = question ratée d'office.
- État `game` en mémoire, aucune persistance → PWA tuée en arrière-plan = série perdue, pas de reprise.
- `.launch` collante observée en train de rogner la ligne récap sur écran court.

**Jordan (débutant perdu)**
- 8 contrôles segmentés + 25 cases, labels Mono CAPITALES, aucune phrase d'intro (« choisis un mode et lance une série »).
- « Vol nocturne » présenté comme pair de Photo / Au son ; le hint dit « l'exercice le plus pointu » → intimidant.
- Les boutons Difficulté ne disent pas ce qui change ; rien n'avertit que « Expert » supprime le QCM avant d'être en pleine partie.
- « Réponses proposées : français / scientifique / les deux » caché dans un `<details>` — un élève qui veut les noms scientifiques peut ne jamais le trouver.
- « À revoir » : liste sans consigne sur quoi en faire.

**Sam (accessibilité / clavier / lecteur d'écran / contraste)**
- Transition config→quiz : focus non géré, atterrit sur `<body>` ; aucune annonce du démarrage.
- `#feedback` sans `aria-live` : « Correct ! » / « Raté » jamais vocalisé. `#progress` / `#score` mis à jour en silence.
- `#chronoBar` : décompte visuel seul, pas de `role="timer"`, pas d'avertissement ; l'utilisateur SR est compté faux sans signal.
- `--t4 #8a958c` (~2,8:1) sur compteurs, `.chips-empty`, `.giveup:disabled` — échoue AA. `.launch-line` (le texte de confirmation le plus important) : 12 px capitales Mono interlettré.
- `#answerInput` : combobox `role="listbox"` présent mais **pas d'`aria-activedescendant`** → surlignage flèches inaudible.
- Segs Chrono/Questions/Réponses à 42 px < 44 px iOS / 48 dp Android.
- **Bon** : `:focus-visible` fort et dans la charte ; `prefers-reduced-motion` entièrement géré.

## Minor Observations

- Ligne d'aide dit « 1–9 » mais le QCM ne rend jamais plus de 4 choix.
- Deux libellés « aucun filtre » différents (header vs zone puces).
- `#filterSum` du header est `display:none` sur mobile — élément mort là.
- Score en compte brut pendant la partie (« Score : 3 »), en pourcentage à la fin — deux modèles mentaux.
- « Rejouer » re-tire le même vivier avec un nouveau hasard (pas les mêmes questions) ; le label suggère un rejeu identique. Paire « Rejouer » / « Nouvelle série » ambiguë.
- `pl.play().catch(function(){})` avale silencieusement un autoplay bloqué → l'élève peut conclure que l'audio est cassé.
- Le `<img>` sonagramme part d'un data-URI SVG vide puis bascule → flash visible à chaque question.
- « voir l'observation » / « voir sur Xeno-canto » en `target="_blank"` en pleine partie → ouvre des onglets sur mobile, peut couper l'audio.
- `HIDDEN_GROUPS = { plantes: true }` — la flore est absente en silence.
- `<audio controls>` natif : coins arrondis / chrome navigateur dans un système strictement à angle droit — incohérence visuelle.

## Questions to Consider

1. L'écran de config à 8 contrôles résout-il un problème que les élèves ont vraiment le jour 1 — ou faudrait-il un seul « Lancer une série » avec défaut, et tout le filtrage repoussé dans un « Affiner » progressif ?
2. Média et Difficulté sont traités comme orthogonaux, mais « Expert · vol nocturne » est un mur et « Découverte · au son » est à peine défini. **La difficulté devrait-elle signifier autre chose selon le média** — au son : nombre de réécoutes autorisées, durée de l'extrait, sonagramme oui/non — plutôt que de ne régler que les distracteurs du QCM ?
3. Le sonagramme tel que rendu est illisible. Gagne-t-il sa place, ou le mode son devrait-il mener avec un grand waveform + réécoute + ralenti, le sonagramme devenant un « voir le sonagramme » optionnel ?
4. L'écran de quiz ne montre rien du mode / de la difficulté / des filtres actifs. Faut-il une fine bande de contexte persistante — surtout qu'une mauvaise réponse fait douter que le distracteur était juste ?
5. Le moment « mauvaise réponse » ne montre que « c'était X ». Pour un outil d'entraînement à la discrimination, faut-il montrer la photo de la bonne espèce à côté de celle vue, + un « critère de distinction » d'une ligne ?
6. « À revoir » est une liste morte. La fin devrait-elle proposer « Rejouer seulement les ratées », et les ratées persister d'une session à l'autre dans un « carnet des espèces à revoir » ?
7. Les réglages se réinitialisent à chaque visite. Pour une révision sur un trimestre, l'app devrait-elle retenir la dernière config et gérer quelques presets nommés ?
8. La scène est « plein soleil, réseau incertain ». Faut-il un mode pré-téléchargement hors-ligne explicite et un bascule d'affichage « terrain » (haut contraste / grandes cibles) — plutôt qu'une seule UI calée sur la salle de classe ?
9. Un chrono dur de 10 s qui compte *faux* est-il le bon modèle pour un entraînement de terrain, plutôt qu'un chrono doux qui enregistre la vitesse sans jamais pénaliser un apprenant ?
10. Changer de Média efface en silence un filtre sous-groupe soigneusement construit. Le Média devrait-il être dans le modèle de filtre, ou les filtres survivre au changement là où le groupe choisi existe encore ?
