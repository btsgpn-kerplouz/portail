# Coup d'œil

Entraînement à la **reconnaissance visuelle d'espèces** (oiseaux, plantes,
insectes) pour le BTS GPN. QCM à partir de photos : groupe → sous-groupe
taxonomique, difficulté réglable (proximité taxonomique des distracteurs),
chrono optionnel, clavier `1`–`9` / `Entrée`.

App **purement statique + PWA coquille**, sur le modèle de
`vegetations-armoricaines`. Pas de Supabase, pas d'auth.

## Fichiers déployés

| Fichier | Rôle |
|---|---|
| `index.html` | L'app entière (HTML/CSS/JS vanilla, sans build). Charte « papier technique froid », accent rouille sombre `#9c3d2e`. |
| `quiz-data.js` | Les données : ~210 espèces / ~4700 photos, définit `window.QUIZ_DATA`. |
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
node export_quiz_data.mjs        # quiz.db -> quiz-data.js
```

Puis recopier le `quiz-data.js` obtenu dans ce dossier.

## Icônes

`icons/icon.svg` (source, œil rouille sur fond `#9c3d2e`) + `icon-192.png` /
`icon-512.png` (rastérisées depuis le SVG). Pour les régénérer après un
changement de couleur/tracé : ouvrir le SVG dans un navigateur, le dessiner
sur un `<canvas>` de 192 puis 512, `toDataURL('image/png')`.
