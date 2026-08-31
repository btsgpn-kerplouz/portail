# À l'affût — carnet de veille naturaliste

Veille médiatique naturaliste **hebdomadaire** (BTS GPN — Kerplouz). Chaque
semaine, un « numéro » : quelques actualités naturalistes retenues par
l'enseignant, chacune renvoyant vers sa **source primaire**. Deux publics,
une seule base :

- **L'enseignant** (vue rédaction) trie la moisson hebdomadaire, corrige le
  texte en place, décoche les entrées inutiles, écrit une note privée
  d'usage pédagogique, puis publie.
- **Les élèves** (vue publiée, publique, sans compte) lisent le numéro et
  ouvrent la source — c'est le geste que le carnet veut leur montrer.

## État actuel

- **Lots 1 à 3 faits** (voir `AVANCEMENT.md`) : `index.html` gère
  plusieurs numéros (n°5 à n°12) avec bascule rédaction ↔ vue publiée
  réelle sur le numéro ouvert, décochage de blocs, encadré « Usage en
  cours » jamais rendu hors rédaction. Les données sont persistées dans
  le `localStorage` du navigateur ; un formulaire modal (rédaction)
  permet d'ajouter, modifier et supprimer une entrée, et l'édition en
  place (titres, résumé, méta source, chapô…) écrit réellement dans les
  données. Un écran Sommaire regroupe les numéros par mois, un écran
  Recherche cherche un mot-clé dans toutes les actualités publiées et
  leurs sources. Toujours pas de backend ni de compte multi-poste (les
  données restent propres à un navigateur). Tuile du portail toujours
  « en chantier » (pas encore de vraie donnée).
- Le gabarit d'entrée s'écarte du dossier de passation (ligne aplatie
  plutôt que carte verticale, pas de repli/dépliage) — voir
  `AVANCEMENT.md` pour le détail des écarts assumés et pourquoi.
- **Cadrage complet déposé dans `documents/`** : brief fonctionnel et
  modèle de données (`promptveilleportail.md`), et un dossier de passation
  design (`GitHub repo et directions de design(5)/design_handoff_carnet_veille/`)
  avec 37 règles fermes, jetons de design (préfixe `--cv-` dans les fichiers
  sources, à harmoniser en `--af-` à l'implémentation), et 13 écrans
  maquettés (Claude Design, fichiers `.dc.html` + captures).
- **Nom d'affichage retenu : « À l'affût »**, sous-titré « carnet de veille
  naturaliste » — le dossier de passation a été produit sous ce second nom
  avant l'arbitrage ; le fond (couleurs, jetons, gabarits, règles,
  pictogramme) reste valable tel quel, seuls les textes portant l'ancien
  nom sont à adapter à l'implémentation.
- Pile prévue **Cloudflare (front) + Supabase (données, RLS stricte)**, sur
  le modèle de `apps/phytoscope`. Ordre de construction conseillé par le
  brief : vue rédaction + import JSON manuel d'abord, endpoint d'ingestion
  automatique ensuite.
- Accent **grenat `#8a2f39`**, papier chaud crème (`#fbf6ea` / `#fffdf6`) —
  écart assumé et documenté par rapport au papier froid du reste du
  portail (voir le README du dossier de passation).

## Développement local

Aucune étape de build : ouvrir `index.html` directement, ou servir le
dossier avec n'importe quel serveur statique.
