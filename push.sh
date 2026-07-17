#!/usr/bin/env bash
# Enregistre et envoie tout le travail en cours vers GitHub, en une seule commande.
#
#   Usage :  bash push.sh "message décrivant ce que tu as fait"
#
# À lancer dans un vrai terminal connecté à GitHub (partage 4G recommandé).
set -e
cd "$(dirname "$0")"   # se placer à la racine du dépôt, quel que soit l'endroit d'appel

if [ -z "$(git status --porcelain)" ]; then
  echo "ℹ️  Rien à enregistrer : aucune modification depuis le dernier envoi."
  exit 0
fi

MESSAGE="${1:-Mise à jour}"

git add .
git commit -m "$MESSAGE"
git push -u origin HEAD

echo ""
echo "✅ C'est enregistré et envoyé sur GitHub."
