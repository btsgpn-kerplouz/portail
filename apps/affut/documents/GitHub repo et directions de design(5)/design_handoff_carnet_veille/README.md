# Handoff : Carnet de veille naturaliste

## Overview

Le **Carnet de veille naturaliste** est une **nouvelle app** du portail BTS GPN (Kerplouz), la
sixième. Elle publie chaque semaine un « numéro » : quelques actualités naturalistes repérées par
l'équipe pédagogique, chacune renvoyant au **document d'origine**. Deux publics, une seule base :

- **L'enseignant** (vue rédaction) trie la moisson hebdomadaire, corrige tout le texte en place,
  décoche les blocs inutiles, écrit une note privée d'usage pédagogique, puis publie.
- **Les étudiants** (vue publiée, publique, sans compte) lisent le numéro — et surtout **ouvrent la
  source**. C'est l'objectif explicite du projet : casser l'habitude de ne lire que les titres.

La bascule rédaction ↔ publiée est un interrupteur dans le bandeau, sur la même page.

## ⚠ Deux écarts assumés avec le reste du portail — lire avant d'implémenter

1. **Papier chaud.** Les cinq autres apps du système refondu sont sur le papier froid `#f4f2ec`.
   Cette app est sur un **crème chaud** (`#fbf6ea` / `#fffdf6`), filets bruns, bandeaux sable. C'est
   une décision de conception validée : le carnet est un objet de lecture, pas un outil de saisie.
   Les jetons de forme (angle droit, pas d'ombre, mêmes polices) sont en revanche identiques.
2. **Nouvelle couleur d'app.** Le grenat `#8a2f39` s'ajoute au jeu des accents du portail
   (vert `#1f6b45`, ocre `#B5651D`, sarcelle `#0b5f7d`, mauve `#6f4478`, bleu `#23458c`). Il n'entre
   en conflit avec aucun.

Comme pour les autres refontes : si le dépôt centralise ses jetons dans `shared/theme.css`, y
ajouter le bloc `--cv-` plutôt que de le dupliquer dans l'app.

## About the Design Files

Le fichier de ce dossier est une **référence de conception faite en HTML** — une maquette qui montre
l'apparence visée, pas du code de production à copier tel quel. La tâche est de créer l'app dans le
dépôt (`apps/carnet-de-veille/` par convention avec les autres), avec la stack du dépôt : HTML/CSS/JS
simple, autosuffisant, pas de nouvelle librairie UI.

Le fichier livré est un **canevas** : les écrans y sont posés côte à côte, groupés par tour
(les plus récents en haut), avec des encarts d'annotation destinés au lecteur — **jamais** à
l'interface. Les identifiants (`3a`, `4b`…) sont ceux du canevas, repris ci-dessous.

## Fidelity

**Haute fidélité** : couleurs, typographie, espacements, gabarits sont définitifs.
Le **contenu** ne l'est pas — voir « Contenu réel vs substitution ».

## Screens / Views — 13 écrans

### La vue publiée (ce que voient les étudiants)

- **`3a` Téléphone, 390 × 844 — trois cadres** (`01`, `02`, `03`) : le même numéro qui défile.
  En-tête du numéro (n°, semaine, titre, chapô) sur fond sable ; puis, par rubrique, une entrée =
  nom de source + pastille d'échelle + domaine et date, titre, bandeau de chiffres clés (si
  renseigné), résumé court, **bloc source**. Pied : numéro précédent + mention du carnet.
- **`3b` Grand écran, cadre 1000px** (`04`) : colonne de lecture 640px + **rail « les trois sources
  du numéro » de 296px** à droite, qui liste les *documents*, pas les titres. Les trois entrées y
  sont complètes ; la troisième (Port-Cros) montre une entrée **sans cartouche** « ce qu'on trouve ».
- **`4c` Feuille d'impression** (`13`) : A4 794 × 1123 border-box, noir sur blanc, un numéro par
  recto, **un code QR par source** + le domaine en clair, QR du carnet en pied.

### La vue rédaction (l'enseignant)

- **`2a` Le numéro en rédaction, cadre 1240px** (`05`) : en-tête éditable (n°, semaine, titre du
  numéro, décompte des retenues, « + Ajouter une entrée », « Publier »), barre de moisson, puis les
  entrées groupées par rubrique. La première est ouverte en édition avec son **panneau de
  composition** de 258px à droite ; la deuxième montre le **bandeau de chiffres décoché** ; la
  troisième est une ligne repliée en lien mort.
- **`2c` Sommaire des numéros** (`06`) : recherche, filtres (année scolaire, rubrique), numéros
  groupés par mois, le dernier en avant ; les mois anciens repliés en une ligne de pastilles.
- **`2d` Ajouter une entrée, 390px** (`07`) : on colle un lien, la vérification remplit source,
  échelle et date ; titre repris de la page ; rubrique, résumé, chiffres clés (décochés par défaut),
  note privée. Deux issues : « Enregistrer en attente » / « Retenir pour le n° 12 ».
- **`5a` Les sources suivies, cadre 1000px** (`11`) : les 14 sources de la collecte, triées **par
  décision à prendre** — en échec, puis « rien de retenu depuis longtemps », puis les autres
  repliées. La colonne qui compte est « ce qu'elle a rapporté » (retenues / rapportées).

### Transversal

- **`4a` Recherche** (`08`) : deux jeux de résultats jamais mélangés — **les actualités** (extrait
  surligné, provenance de l'occurrence, numéro d'origine) et **les sources** (documents ouvrables
  directement, même bouton grenat).
- **`4b` Les six états limites** (`09`, `10`) : premier lancement · numéro vide · collecte sans
  nouveauté · collecte en échec · recherche sans résultat · publication refusée. Chaque cadre porte
  une ligne « OÙ · … » qui dit précisément où l'état apparaît.
- **Le report mobile de la tuile et le pictogramme agrandi** sont dans le même cadre `5b`.
- **`5b` La tuile du portail** (`12`) : tuile grenat aux conventions du portail, en regard de la
  tuile PhytoScope reprise verbatim ; report mobile 390px ; le pictogramme agrandi.

## Interactions & Behavior

- **Le bloc source est le geste central.** Bouton ≥ 56px, domaine sous le libellé. Il ne se décoche
  jamais ; une entrée sans lien n'est pas publiable.
- **Édition en place** : tout texte au fond rosé pointillé s'édite au clic ; le champ actif prend le
  cadre grenat et le halo. Ces repères n'existent que côté rédaction.
- **Décocher un bloc** le replie en rédaction (bandeau pointillé + « Réafficher », valeurs
  conservées) et le **supprime** du numéro publié. Vide = inexistant, jamais de cadre vide.
- **Vérification des liens** : à la saisie, puis périodiquement. Un lien mort marque l'entrée,
  propose « corriger l'adresse / chercher une copie archivée / écarter », et **bloque la
  publication** du numéro tant qu'il est retenu.
- **Collecte** : 14 sources interrogées chaque samedi à 6 h, dépôt en brouillon. Trois issues
  distinctes : entrées rapportées, rien de neuf, échec partiel (états ③ et ④).
- **Survol — non maquetté.** Même contrainte que le reste du système : pas d'élévation ni d'ombre ;
  proposer un filet plus foncé ou un léger assombrissement. À trancher en codant.

## State Management

- **Un numéro** : identifiant (n°), semaine, titre facultatif, statut (brouillon / publié), date de
  publication, auteur, deux réglages (« chiffres clés partout », « grouper par rubrique »).
- **Une entrée** : source (nom, domaine, échelle, territoire), date de publication, rubrique, titre,
  chapô, résumé, 0-n chiffres clés (valeur + libellé, ordonnables), 1-n liens (URL, type de
  document, nombre de pages ou durée, date et résultat de vérification), cartouche « ce qu'on
  trouve » (0-n lignes), note privée d'usage, origine (collecte / saisie), statut (en attente /
  retenue / écartée / lien mort), et **l'état coché de chacun de ses six blocs**.
- **Une source suivie** : nom, adresse du flux ou de la page, type, échelle, rubrique par défaut,
  historique de collecte, compteurs rapportées / retenues.
- La vue publiée est **publique et sans état** : aucun compte étudiant, aucun favori, aucun
  « lu / non lu ».

## Design Tokens

> Liste nommée : **`JETONS.md`** · variables à coller : **`jetons.css`** (préfixe `--cv-`) ·
> règles fermes : **`REGLES.md`** · chaque motif isolé avec ses états :
> **`Carnet de veille - Planche de composants.dc.html`** — **la planche fait foi** en cas d'écart
> avec un écran.

**Couleurs** — papier `#fbf6ea` / surface `#fffdf6` / sable `#f5ead4` et `#f0e4cd` ; bandeau encre
`#241d15` ; encre `#1a1611`, courant `#2b241c`, secondaire `#4a4136`, méta `#6f6355` (plancher de
contraste) ; accent grenat `#8a2f39` ; validé `#196549` ; lien mort `#A6421B` ; privé `#7a5b16`.

**Typographie** — IBM Plex Sans (texte), JetBrains Mono (repères, chiffres, adresses, capitales),
IBM Plex Serif **uniquement** sur la tuile du portail.

**Forme** — angle droit partout, aucune ombre sauf le halo de focus
`0 0 0 3px rgba(138,47,57,.15)`, cible tactile ≥ 48px, bouton source ≥ 56px.

## Assets

- **Pictogramme de l'app** : SVG inline 24 × 24 (feuillet + flèche sortante), dans le bandeau de
  tous les écrans et sur la tuile du portail. Tracé exact dans `JETONS.md`.
- **Codes QR** : `qr-csa.png`, `qr-cevennes.png`, `qr-portcros.png`, `qr-carnet.png` — réels et
  scannables, fournis pour la maquette seulement. **En production, générer le QR à la volée** depuis
  l'URL de l'entrée (marge de 4 modules, rendu net, `alt` nommant la destination).
- **Aucune autre image.** Polices via Google Fonts, ou en local si le dépôt auto-héberge.

## Contenu réel vs substitution

**Réel** : les organismes cités (Conservatoire des Sites Alsaciens, PN des Cévennes, PN de
Port-Cros, PatriNat, OFB, Tela Botanica, Bretagne Vivante, CEN Bretagne, Agence de l'eau
Loire-Bretagne…), les faits des trois actualités du n° 12, la structure du portail et la tuile
PhytoScope (copiée verbatim du handoff Portail).

**Substitution — à ne pas prendre pour des données** : toutes les **URL** ; les numéros 1 à 11 et
leurs titres ; les décomptes (12 numéros, 41 actualités, 38 sources, 14 sources suivies et tous
leurs compteurs) ; les extraits et résultats de la recherche ; les cinq noms de rubrique (quatre
sont utilisés, la cinquième reste à nommer avec l'équipe) ; les nombres de pages et durées de
lecture.

## Known Gaps — à trancher avant/pendant l'implémentation

1. **Le cartouche « ce qu'on trouve dans le document » est du travail d'écriture** : deux ou trois
   lignes par entrée, à la main. Il est décochable, donc l'app fonctionne sans — mais c'est lui qui
   fait cliquer. À suivre à l'usage : s'il n'est jamais rempli, le remplacer par la seule nature du
   document.
2. **Suggestions de la recherche vide** (« essayer chauve-souris, rhinolophe ») : elles supposent un
   index des mots réellement présents dans le carnet, **pas** un dictionnaire de synonymes. Si
   l'index n'est pas fait, ne garder que le rappel du filtre actif.
3. **Métadonnées de source** (type de document, nombre de pages, durée de lecture) : à déduire du
   lien à la vérification, ou à saisir. Non tranché.
4. **La cinquième rubrique n'est pas nommée.** Quatre sont utilisées dans les maquettes.
5. **Fréquence et jour de collecte** (« samedi 6 h ») et **jour de publication** (vendredi dans
   l'état ①, 16 août = dimanche dans le n° 12) sont incohérents entre deux écrans : à fixer.
6. **États de survol** — non maquetté, voir Interactions & Behavior.
7. **Thème sombre écarté** le 29 août 2026 après exploration. Le fichier de travail en garde deux
   cartes ; elles ne font pas partie de cette livraison. Si le besoin revient, l'accent s'éclaircit
   en `#d9838c` sur fond brun-noir `#14100d` / `#1e1811`.
8. **Impact sur le portail** : une tuile de plus, décompte du bandeau à reprendre
   (6 outils · 4 en service · 2 en chantier), grenat à ajouter au jeu des accents.

## Files

**Lire dans cet ordre** : `CHANGELOG.md` → `REGLES.md` → `JETONS.md` / `jetons.css` →
`Carnet de veille - Planche de composants.dc.html` → ce README + `screenshots/`.

- `CHANGELOG.md` — révisions du dossier et décisions arrêtées. À lire en premier.
- `REGLES.md` — 37 règles fermes et leurs exceptions assumées.
- `JETONS.md` / `jetons.css` — jetons nommés et variables CSS (préfixe `--cv-`).
- `Carnet de veille - Planche de composants.dc.html` — chaque motif une fois, avec tous ses états
  et ses valeurs sous lui.
- `Carnet de veille - design retenu.dc.html` — le canevas complet des 13 écrans (tours 1 à 5).
- `screenshots/` — captures 2× :
  `01-03-numero-publie-telephone.png` (les trois cadres de `3a`) ·
  `04-numero-publie-grand-ecran.png` (`3b`) ·
  `05-numero-redaction.png` (`2a`) ·
  `06-sommaire-des-numeros.png` (`2c`) ·
  `07-ajouter-une-entree.png` (`2d`) ·
  `08-recherche-transversale.png` (`4a`) ·
  `09-etats-limites.png` (les six cadres de `4b`) ·
  `11-sources-suivies.png` (`5a`) ·
  `12-tuile-portail.png` (`5b`) ·
  `13-feuille-impression.png` (`4c`) ·
  `14-planche-de-composants.png`.
- `qr-*.png` — les quatre codes QR de la feuille imprimée.
- `support.js` — dépendance technique des `.dc.html` (pour les ouvrir dans un navigateur ; sans
  objet pour l'implémentation).
