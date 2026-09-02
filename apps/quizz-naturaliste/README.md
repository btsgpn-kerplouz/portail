# Quizz naturaliste

Quiz pour **reconnaître des espèces sur photo** (oiseaux, insectes, mammifères,
herpéto) — BTS GPN. QCM à partir de photos :

> Le groupe **plantes** est présent dans les données mais **masqué**
> (`HIDDEN_GROUPS` dans `index.html`) le temps d'être retravaillé.

secteur **Bretagne / France métropolitaine** → **groupe (colonne,
silhouettes)** → **sous-groupes (cases à cocher, puces retirables)**, chrono
optionnel, clavier `1`–`9` / `Entrée`.

**Difficulté** : *Découverte* / *Entraînement* = QCM 4 choix (distracteurs de
plus en plus proches taxonomiquement) ; *Expert* = **pas de propositions**, on
saisit le nom (français ou scientifique) dans un champ avec **autocomplétion**
limitée aux espèces **du même groupe taxo que la réponse** (oiseau, plante,
insecte…) et du secteur en cours — flèches + `Entrée`, ou clic ; « Je ne sais
pas » révèle la réponse et la compte fausse.

App **purement statique + PWA coquille**, sur le modèle de
`vegetations-armoricaines`. Pas de Supabase, pas d'auth.

## Fichiers déployés

| Fichier | Rôle |
|---|---|
| `index.html` | L'app entière (HTML/CSS/JS vanilla, sans build). Charte « papier technique froid », accent rouille sombre `#9c3d2e`. |
| `quiz-data.js` | Les données : ~386 espèces / ~4600 photos (≤ 12 par espèce), définit `window.QUIZ_DATA`. |
| `manifest.webmanifest` · `service-worker.js` · `icons/` · `fonts/` | Coquille PWA. |
| `wrangler.jsonc` | Déploiement Cloudflare (worker `quizz-naturaliste`). |

## Images

Les photos sont des **liens directs iNaturalist**, chargés **en ligne uniquement**.
Le service worker ne met en cache **que la coquille** (`index.html`, `quiz-data.js`,
polices, icône) — jamais les photos (ressources cross-origin, laissées au navigateur).

Sous chaque photo : **crédit + licence + lien vers l'observation iNaturalist**
(obligation de droit d'auteur — non négociable).

## Régénérer `quiz-data.js`

Les données proviennent du dépôt **hors portail** `../Quizz naturaliste/`
(scripts d'import iNaturalist → export, **non déployés**). Voir le `README.md`
de ce dépôt. En résumé :

```bash
node import_inaturalist.mjs --init
node import_inaturalist.mjs --especes especes.csv --par-espece 40 --place-id 6753 --auto-approve
node enrich_bzh.mjs                          # taxa.bzh_obs : obs. research-grade en Bretagne (iNat place 13008)
node export_quiz_data.mjs --max-photos 12    # quiz.db -> quiz-data.js (coquille légère)
```

Puis recopier le `quiz-data.js` obtenu dans ce dossier.

`especes.csv` (colonnes `groupe;sous_groupe;nom_scientifique`) pilote la liste :
5 groupes — oiseaux, plantes, insectes, mammifères, herpéto (reptiles /
amphibiens).

**Filtre Bretagne** : un taxon est marqué `bzh: true` s'il a au moins
`--bzh-threshold` (5 par défaut) observations *research grade* en Bretagne sur
iNaturalist (`enrich_bzh.mjs`, place_id 13008). Heuristique imparfaite — un
seuil bas laisse passer une espèce mal identifiée au rang de l'espèce (ex.
*Bufo bufo* vs *B. spinosus* en façade atlantique) et une espèce réellement
présente mais peu photographiée (micromammifères, chauves-souris) peut
tomber sous le seuil. À ajuster à la main dans `especes.csv`/`quiz.db` si un
cas gênant est repéré. `resolveTaxon` (dans `import_inaturalist.mjs`)
utilise l'endpoint `/taxa?q=`, qui peut mal résoudre certains noms (vu sur
« Dama dama », « Glis glis ») — vérifier les nouveaux imports dans le log,
`/taxa/autocomplete` serait plus fiable.

## Icônes

`icons/icon.svg` (source, œil rouille sur fond `#9c3d2e`) + `icon-192.png` /
`icon-512.png` (rastérisées depuis le SVG). Pour les régénérer après un
changement de couleur/tracé : ouvrir le SVG dans un navigateur, le dessiner
sur un `<canvas>` de 192 puis 512, `toDataURL('image/png')`.
