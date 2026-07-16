# organisation-cours

Outil de **saisie** pour l'organisation de cours.

- **Historique** : tournait en local (serveur Node natif + front vanilla +
  persistance dans des fichiers `data/`).
- **Cible** : migrer les données vers **Supabase** pour rentrer dans le modèle
  statique du portail.
- ⚠️ **Règle héritée : ne jamais écraser NI committer `data/`** (données
  locales, potentiellement personnelles → RGPD). Ce dossier est dans `.gitignore`.
