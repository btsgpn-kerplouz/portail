# Supabase — PhytoScope

Le schéma Supabase de PhytoScope (table `releves`) a été créé directement dans
l'éditeur SQL du dashboard, sans jamais être versionné ici — ce dossier ne
documente donc que ce qui s'ajoute à partir de maintenant.

## Comment appliquer une migration

1. Ouvrir le projet Supabase (`btsgpn-kerplouz`) → **SQL Editor**.
2. Coller le contenu du fichier numéroté suivant (dans l'ordre), l'exécuter.
3. Vérifier dans **Table Editor** que la table/policy attendue existe bien.

Il n'y a pas de CLI Supabase configuré pour ce projet : chaque migration se
lance à la main, une fois.

## Migrations

- `001-create-lots-table.sql` — table `lots` (synchro des lots de relevés,
  jusqu'ici uniquement en `localStorage`). Même schéma que `releves` : id
  texte généré côté client, clé composite `(proprietaire_id, id)`, blob JSON
  dans `donnees`, RLS scoping direct sur `auth.uid()`.
