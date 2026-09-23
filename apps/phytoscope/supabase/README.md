# Supabase — PhytoScope

PhytoScope vit dans le **projet Supabase partagé** (BTS GPN — portail,
`uoeuzxstotqnembcpofx`), comme affut et organisation-cours, avec des tables
préfixées `phyto_`. Jusqu'au 23/09/2026 il avait son propre projet
(`eywuucedgtesgipniotf`, le tout premier, tables `releves` / `lots` sans
préfixe) : bascule faite par 002 + 003 ci-dessous.

## Comment appliquer une migration

1. Ouvrir le projet Supabase partagé (`uoeuzxstotqnembcpofx`) → **SQL Editor**.
2. Coller le contenu du fichier numéroté suivant (dans l'ordre), l'exécuter.
3. Vérifier dans **Table Editor** que la table/policy attendue existe bien.

Il n'y a pas de CLI Supabase configuré pour ce projet : chaque migration se
lance à la main, une fois.

## Migrations

- `001-create-lots-table.sql` — table `lots` (synchro des lots de relevés,
  jusqu'ici uniquement en `localStorage`). Même schéma que `releves` : id
  texte généré côté client, clé composite `(proprietaire_id, id)`, blob JSON
  dans `donnees`, RLS scoping direct sur `auth.uid()`.
  *Appliquée dans l'ancien projet ; remplacée par 002.*
- `002-tables-projet-partage.sql` — `phyto_releves` et `phyto_lots` dans le
  projet partagé, structure relevée à l'identique dans l'ancien projet.
- `003-generer-copie-depuis-ancien-projet.sql` — à lancer dans l'**ancien**
  projet (lecture seule) : génère le script qui copie comptes, relevés et lots
  vers le projet partagé. Le script généré contient les identifiants des
  élèves → ne jamais le committer ni le coller dans une conversation.
