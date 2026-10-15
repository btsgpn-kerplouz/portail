# NOCMIG

Analyse d'enregistrements nocturnes d'oiseaux (NOCMIG) issus d'un traitement par
[Chirpity](https://chirpity.net/) (ou BirdNET). L'outil n'est lié à aucun lieu : le
coucher et le lever du soleil sont calculés au barycentre des sites de la campagne.
Données intégrées : deux campagnes (2025, et 2026 vérifiée par la classe) ; tout autre
jeu peut être importé en CSV (export Chirpity ou BirdNET : colonnes `File`,
`Start (s)`, `Common name`, `Confidence`, et si présentes `Latin name` ou
`Scientific name`, `End (s)`, `Latitude`, `Longitude`).
Consultation seule, **purement statique** : pas de Supabase, pas d'auth (seul appel
externe : la météo Open-Meteo, voir plus bas).

Logo : sonogramme réel d'un cri en vol (« tsip ») de Grive musicienne, extrait d'un
enregistrement de la campagne 2025 (15/10/2025, confiance 0,999), vectorisé en SVG
(`icon.svg` et bandeau).

Charte « papier technique froid », accent **indigo de nuit `#3d3a82`**, avec un
**écart assumé** (demandé pour l'ambiance nocturne) : bandeau, barre d'onglets et volet
de sélection en **bleu nuit** (`#0f1224` / `#171b33`) au lieu de l'encre, interrupteurs
actifs en aplat clair « allumé ». Deux accents : le **jaune lune `#f0e6c0`** sur les zones de
nuit (logo et titre, bord haut du bandeau, campagne active, numéros des onglets et des
sections, choix actif des boutons segmentés, anneau de focus, tranche isolée) et
l'**indigo `#3d3a82`** sur les zones claires (onglet actif, graphiques, liens). La zone de
visualisation reste sur papier clair, légèrement bleuté (`#eceef3`), pour la lecture.
Tuile du portail (une fois en service) : fond bleu nuit, textes jaune lune.

## Écran

- **Bandeau** : ‹ Portail, logo, titre « NOCMIG » et sous-titre « Analyse d'enregistrements
  de migration nocturne d'oiseaux issus d'un traitement par Chirpity », choix de la campagne (2026, 2025, puis « Import »).
- **Barre d'onglets** pleine largeur sous le bandeau, toujours visible ; dessous, une
  **bande de bilan** compacte : chiffres clés (contacts, espèces, sites actifs) et
  contexte de la sélection (nuit, fenêtre, comptage, seuil, tranche isolée).
- **Panneau Sélection** (à gauche ; tiroir sur téléphone) commun à tous les onglets,
  en quatre blocs repliables qui affichent leur valeur : 1 Quand (nuits, plage, axe en
  heure légale ou **heures après le coucher**, qui superpose les nuits) · 2 Où (sites) ·
  3 Quoi (séries d'espèces) · 4 Comptage (métrique, fusion, seuil de confiance).
  Une tranche horaire isolée s'affiche en tête. Interrupteurs : aplat clair « allumé » =
  pris en compte, pointillé barré = écarté.
- **Cartes** : étiquettes de sites placées automatiquement hors des symboles, reliées
  au point GPS par un filet. **Chronogramme** : densité (cases de quelques minutes) ou
  un trait fin par contact, sans contour.
- **Onglets** : Vue d'ensemble (carte, activité) · Espèces (classement,
  matrice espèces × sites) · Chronologie (chronogramme, activité par site) ·
  Simulation (nuit animée, export vidéo WebM) · Méthode (richesse cumulée, effet
  du seuil de confiance, distribution des scores) · Données (campagne, import CSV,
  tri des espèces en catégories, exports).
- **Ciel et météo** (vue d'ensemble, sous l'activité, même axe horaire) : lune levée
  (calculée localement, formules basse précision de l'Astronomical Almanac : phase,
  éclairement, lever/coucher), nuages, pluie, vent (vitesse et direction) heure par
  heure, et un tableau par nuit (lune, météo moyenne coucher → lever, activité par
  heure ; clic = afficher cette nuit). La lune apparaît aussi sur les pastilles de nuit
  du panneau et dans l'horloge de la simulation.
  Météo : **seul appel réseau de l'app**, vers [Open-Meteo](https://open-meteo.com/)
  (gratuit, sans clé, CC BY 4.0) — archive ERA5, sinon modèles de prévision pour les
  derniers jours. Seules les coordonnées du barycentre des sites et les dates sont
  envoyées. Mise en cache dans le navigateur (`localStorage`, clé `nocmig-meteo`).
- **Fiche espèce** : clic sur un nom d'espèce (barres, matrice, chronogramme, tableau).
- Chaque carte s'exporte en PNG, avec la sélection en légende (sur la carte Leaflet, les
  filets sont redessinés après coup : html2canvas décale le calque SVG de Leaflet). Un onglet s'ouvre
  directement par l'adresse : `#ov`, `#sp`, `#ch`, `#sim`, `#me`, `#da`.

Le tri des espèces, les séries et les positions manuelles sont mémorisés dans le
navigateur (`localStorage`, clé `nocmig-eil-v1`, compatible avec l'ancienne page
`nocmig_viz.html`) et s'exportent en JSON.

## Données (`data.js`)

Générées par `outils/construire_donnees.py` à partir des CSV au format Chirpity,
**hors dépôt** (dossier personnel de l'enseignant) :

```
python3 outils/construire_donnees.py \
  2026 "Campagne 2026" "Détections vérifiées par la classe" 0.4 <…>/EIL_2026/resultats_classe \
  2025 "Campagne 2025" "Base commune BirdNET" 0.6 <…>/EIL_2025
```

⚠️ **Dépôt public** : les CSV d'origine contiennent des chemins Windows avec les
prénoms et identifiants de session des élèves (`C:\Users\…`). Le script ne garde
que site, espèce, confiance, nom du wav, décalage et durée — **ne jamais committer
les CSV bruts**. Après toute régénération : `grep -ci users data.js` doit renvoyer 0.

Le dernier argument numérique est le **seuil de confiance par défaut** de la campagne
(0,4 pour 2026 : détections déjà vérifiées à la main).

## Déploiement

Worker Cloudflare `nocmig` (`wrangler.jsonc`, assets statiques ; `.assetsignore`
exclut `outils/` et ce README). À créer une fois dans le tableau de bord Cloudflare
(racine `apps/nocmig`), puis passer la tuile du portail de « en chantier » à
« en service » (commentaire dans `portail/index.html`).
