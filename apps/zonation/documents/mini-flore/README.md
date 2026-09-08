# Mini flore — pipeline de génération

Trois sorties générées à partir de `../especes_zonation_illustrations(URL).csv` :

- `mini-flore-illustrations.html` — document imprimable A4, photos + noms
  uniquement, regroupés par famille botanique, agencement « galerie
  justifiée » (pas de bande vide, pas de déformation).
- `mini-flore-descriptions.html` — document imprimable A4, texte seul
  (description Abbé Coste ou, à défaut, traits Baseflor), regroupé par
  famille, 2 colonnes par page.
- `../../mini-flore-data.js` — uniquement les photos (pas de texte), au
  format consommé par l'app zonation elle-même (écran « Mini-flore de cet
  habitat » sur chaque fiche : carrousel plein écran, priorité aux
  illustrations), indexées par nom scientifique. Ne dépend que du CSV, pas
  du cache de descriptions.

## Pour régénérer après avoir complété le CSV

```bash
cd apps/zonation/documents/mini-flore
python3 build_app_data.py       # régénère mini-flore-data.js pour l'app (photos seules)

# Uniquement si les documents imprimables (texte + mise en page photo) sont aussi à jour :
python3 fetch_species_data.py   # familles + descriptions (Tela Botanica)
python3 fetch_image_dims.py     # dimensions des photos (pour l'agencement)
python3 build_illustrations.py
python3 build_descriptions.py
```

`fetch_image_dims.py` ne re-télécharge que les URLs pas encore connues
dans `cache/image_dims.json`. `fetch_species_data.py` re-télécharge tout
à chaque lancement (~75 espèces, quelques minutes) — sans conséquence,
l'API Tela Botanica répond vite.

## Points importants à ne pas reperdre

- **Sécurité/vie privée** : le champ « description collaborative »
  d'eFlore Tela Botanica (`class="description wikini editable_sur_clic"`)
  est modifiable par n'importe quel visiteur du site. On y a trouvé un
  commentaire personnel hors-sujet contenant une adresse email. Les
  scripts n'utilisent **jamais** ce champ — uniquement le bloc officiel
  non-éditable `class="description coste"` (Abbé H. Coste, 1901-1906,
  domaine public) et l'index structuré Baseflor (Julve, Ph.).
- Le nom scientifique du CSV n'est pas forcément une espèce reconnue par
  bdtfx (sous-espèces jamais indexées séparément, groupes `gr.`, mentions
  `s.l.`, `sp.` indéterminées, hybrides `x`) : `find_num_nom()` retente
  automatiquement avec des formes simplifiées.
- 47 des ~75 espèces du CSV ont au moins une photo ; 33 de ces 47 ont une
  vraie description Coste, les autres un résumé Baseflor ou rien.
- `cache/*.json` est committable (petit, dérivé, pas de données
  personnelles) ; il n'y a pas de cache HTML brut conservé — si besoin de
  retravailler le parsing, relancer `fetch_species_data.py`.

## Historique

Conçu par itérations successives : d'abord vignettes à taille fixe, puis
photos beaucoup plus grandes (min. 7×5 cm demandé), puis scission en deux
documents (illustrations / descriptions) avec agencement justifié pour
éliminer les vides, puis regroupement par famille botanique.
