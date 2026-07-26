# Audit RGPD — préalable à la migration de `organisation-cours`

> Exigé par `CLAUDE.md` : « AUDIT OBLIGATOIRE de `organisation-cours` AVANT de migrer son code
> dans le dépôt ». Le dépôt `btsgpn-kerplouz` est **public** — rien de ce qui suit ne doit y
> entrer tel quel.

Code legacy audité : `~/Documents/IA/Claude_Code/organisation_cours_btsgpn/` (hors dépôt).

## Point critique — bloquant

**`public/ruban-pedagogique.js`** (fichier de code, donc **suivi par git**, contrairement à
`data/` qui est gitignoré) contient **en dur** :

- le nom de l'établissement : `etablissement: "Kerplouz LaSalle — Auray"` ;
- environ **75 initiales réelles** d'enseignants et d'évaluateurs, réparties sur les ~25
  capacités du référentiel, dans les tableaux `enseignants` / `evaluateurs` de chaque appel
  `C(code, title, disciplines, enseignants, evaluateurs)`.

Ce fichier mélange donc **référentiel officiel** (structure semestres → UE → capacités →
disciplines, publiable) et **données identifiantes** (qui enseigne/évalue quoi, non publiable).
→ **Ce fichier ne doit pas être copié tel quel dans le dépôt.**

## Ce qui est publiable en l'état

- `public/reference-modules.js` — transcription structurelle des modules M1…M8 (documents
  d'accompagnement officiels, Inspection Enseignement Agricole / Chlorofil). Pas de donnée
  personnelle.
- `public/reference-capacities.js` — référentiel de diplôme 2024 (blocs B1–B8, capacités
  C1.1–C8.3). Pas de donnée personnelle.
- La **structure** de `ruban-pedagogique.js` (semestres → UE → capacités), une fois vidée des
  colonnes `enseignants`/`evaluateurs` et du nom d'établissement.
- `README.md`, les scripts de lancement, `public/index.html`, `public/styles.css` : aucune
  donnée personnelle ou nom d'établissement trouvés à l'audit.

## Ce qui doit être externalisé (pas de code, que des données Supabase)

- **Affectations enseignant/évaluateur par capacité** (aujourd'hui dans `ruban-pedagogique.js`)
  → à modéliser en base au moment de l'étape « ruban » (hors périmètre de cette 1ʳᵉ étape), via
  une table de jointure liée à `oc_enseignants`, jamais en dur dans un fichier JS publiable.
- **Nom de l'établissement** → à sortir en valeur de configuration (variable d'environnement ou
  champ de réglages Supabase), jamais en dur dans le code source public.
- **`data/data.json`** (et ses ~200 sauvegardes) : contient les vraies initiales (`teacher`,
  `conducteur`), et pour le module réunions des **noms complets** (`participants`). Ce dossier
  est déjà `.gitignore`d et ne doit **jamais** être committé. Son import vers Supabase se fera
  par un **script ponctuel, non versionné** (étape 4 du plan multi-utilisateurs), exécuté en
  local, jamais poussé sur GitHub.

## Modules reportés (hors périmètre de l'étape 1, données les plus nominatives)

- **Frais kilométriques** (`deplacements` : `conducteur`, `lieu`, `date`, montants) — données
  professionnelles nominatives.
- **Réunions** (`reunions.participants`) — noms complets en texte libre, pas des initiales.

Ces deux modules sont volontairement exclus du schéma de l'étape 1 (voir
`supabase/schema.sql`) ; leur migration nécessitera une réflexion RLS dédiée avant d'être
rouverte.

## Conclusion

- ✅ Le **schéma relationnel** de l'étape 1 (`supabase/schema.sql`) ne reprend **aucune** donnée
  réelle : uniquement des colonnes vides à remplir plus tard, et des identifiants génériques
  dans les exemples/commentaires.
- ⛔ **Aucun fichier du code legacy n'est copié dans le dépôt à ce stade.** La copie du front
  (étape 5) devra d'abord passer par le nettoyage de `ruban-pedagogique.js` décrit ci-dessus.
- Rappel permanent : `data/` reste hors dépôt, hors git, toujours.
