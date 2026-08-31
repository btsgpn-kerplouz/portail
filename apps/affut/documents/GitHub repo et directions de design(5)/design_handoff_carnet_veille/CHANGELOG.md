# Journal du dossier de passation

## Révision 1 — 29 août 2026 (création)

Premier dossier de passation du **Carnet de veille naturaliste**, sixième app du portail BTS GPN.
Rien à relire ailleurs : tout ce que contient ce dossier est nouveau.

Contenu livré :
- `README.md` — 13 écrans décrits un par un, ce qui est réel et ce qui est de substitution.
- `REGLES.md` — 37 règles fermes.
- `JETONS.md` / `jetons.css` — jetons nommés, préfixe `--cv-`.
- `Carnet de veille - Planche de composants.dc.html` — chaque motif isolé avec ses états.
- `Carnet de veille - design retenu.dc.html` — la source des 13 écrans (canevas, tours 1 à 5).
- `screenshots/` — un PNG par écran.
- `qr-*.png` — les quatre codes QR de la feuille imprimée (maquette ; à générer à la volée en prod).
- `support.js` — dépendance technique du `.dc.html`.

Décisions arrêtées pendant la conception, dans l'ordre :
1. Direction visuelle « revue de presse spécialisée » retenue sur trois pistes explorées
   (carnet de relevés et fiche d'inventaire écartées, retirées du fichier de travail).
2. Papier chaud crème adopté pour la vue publiée **puis étendu à la rédaction**, contre le papier
   froid du reste du portail : c'est un choix assumé, propre à cette app.
3. Le lien discret de fin de résumé remplacé par le **bloc source** (cartouche + bouton 56px).
4. Le cartouche « ce qu'on trouve dans le document » rendu **éditable et décochable** ; vide, il
   n'existe pas.
5. Feuille d'impression simplifiée : **codes QR** au lieu des URL en toutes lettres.
6. **Thème sombre écarté** après l'avoir exploré (deux cartes en gardent la trace dans le fichier
   de travail, non livrées).
7. **Aucun compte étudiant** : la vue publiée est publique.
