# Coup d'œil

Entraînement à la **reconnaissance visuelle d'espèces** (oiseaux, plantes,
insectes, mammifères, herpéto) pour le BTS GPN. QCM à partir de photos :
sélecteur **groupe (colonne, silhouettes)** → **sous-groupes (cases à cocher,
puces retirables)**, difficulté réglable (proximité taxonomique des
distracteurs), chrono optionnel, clavier `1`–`9` / `Entrée`.

App **purement statique + PWA coquille**, sur le modèle de
`vegetations-armoricaines`. Pas de Supabase, pas d'auth.

## Fichiers déployés

| Fichier | Rôle |
|---|---|
| `index.html` | L'app entière (HTML/CSS/JS vanilla, sans build). Charte « papier technique froid », accent rouille sombre `#9c3d2e`. |
| `quiz-data.js` | Les données : ~386 espèces / ~4600 photos (≤ 12 par espèce), définit `window.QUIZ_DATA`. |
| `manifest.webmanifest` · `service-worker.js` · `icons/` · `fonts/` | Coquille PWA. |
| `wrangler.jsonc` | Déploiement Cloudflare (worker `coup-doeil`). |

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
node export_quiz_data.mjs --max-photos 12   # quiz.db -> quiz-data.js (coquille légère)
```

Puis recopier le `quiz-data.js` obtenu dans ce dossier.

`especes.csv` (colonnes `groupe;sous_groupe;nom_scientifique`) pilote la liste :
5 groupes — oiseaux, plantes, insectes, mammifères, herpéto (reptiles /
amphibiens).

## Icônes

`icons/icon.svg` (source, œil rouille sur fond `#9c3d2e`) + `icon-192.png` /
`icon-512.png` (rastérisées depuis le SVG). Pour les régénérer après un
changement de couleur/tracé : ouvrir le SVG dans un navigateur, le dessiner
sur un `<canvas>` de 192 puis 512, `toDataURL('image/png')`.
