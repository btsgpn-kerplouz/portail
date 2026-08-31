# Règles fermes — Carnet de veille naturaliste

Ce que la maquette impose, en toutes lettres. Une règle non respectée est un écart, pas une
interprétation. Les exceptions assumées sont dites comme telles.

## Le geste central : aller à la source

1. **Toute entrée publiée porte un bloc source.** Il n'existe aucune entrée sans lien : le bouton
   « Ouvrir la source » et son adresse sont **verrouillés**, ils ne se décochent pas.
2. **Le bouton fait au moins 56 px de haut**, fond grenat plein, texte 15px/700, et porte le
   **domaine** de la source en dessous. Jamais un lien souligné en fin de paragraphe.
3. **La source est nommée avant le titre** : organisme en 13-14px/700, puis pastille d'échelle,
   puis domaine et date en mono. L'entrée se lit « qui publie, puis quoi ».
4. **Le résumé s'arrête court.** Il donne le fait, pas le contenu du document ; ce qui reste à lire
   est dans le cartouche « ce qu'on trouve », pas dans un résumé exhaustif.
5. **Trois portes vers les documents** : le bloc de l'entrée, le rail « les trois sources du
   numéro » (bureau), et la liste « les sources » de la recherche. Ne pas en supprimer une sans
   décision explicite.
6. **À l'impression, un code QR remplace le bouton**, avec le domaine en clair à côté. Jamais une
   URL longue à recopier — et jamais un bouton « Ouvrir » imprimé, qui ne veut rien dire sur papier.

## Édition et publication

7. **Tout le texte publiable est modifiable en place** : titre, chapô, résumé, nom de source,
   échelle, date, chaque chiffre **et son libellé**, chaque ligne du cartouche, le titre du numéro
   et sa semaine.
8. **Un texte modifiable se signale par le fond rosé + le soulignage pointillé**
   (`--cv-edit-fond` / `--cv-edit-pointille`) ; le champ actif prend un cadre grenat 1px et le halo
   `--cv-edit-halo`. Ces deux repères n'existent **que** dans la vue rédaction.
9. **Six blocs se décochent par entrée** : rail d'identification, chapô, bandeau de chiffres clés,
   résumé, cartouche « ce qu'on trouve », et — verrouillés — bouton source et « Usage en cours ».
10. **Un bloc décoché ou vide n'existe pas dans le numéro publié.** Jamais de cadre vide, jamais de
    tiret de remplissage, jamais de « non renseigné ». En rédaction il reste visible, replié en
    bandeau pointillé, avec ses valeurs conservées et un « Réafficher ».
11. **« Usage en cours » n'est jamais publié**, ni à l'écran, ni à l'impression, ni dans la
    recherche. Il porte toujours son hachurage ambre et son libellé explicite.
12. **Deux réglages au niveau du numéro** pour éviter de décocher dix fois : « afficher les chiffres
    clés partout » et « grouper par rubrique ».
13. **La publication est refusée** tant qu'une entrée retenue a un lien mort ou aucun lien. L'écran
    de refus nomme les entrées fautives et y renvoie.

## Papier, formes, couleur

14. **Angle droit partout.** `border-radius: 0` sans exception — boutons, champs, pastilles,
    pictogramme, codes QR.
15. **Aucune ombre portée.** Seule ombre autorisée dans toute l'app : le halo de focus
    `0 0 0 3px rgba(138,47,57,.15)`.
16. **Deux papiers seulement** : le crème de l'app (vue publiée et rédaction), le blanc de
    l'impression. Pas de troisième fond, pas de dégradé décoratif.
17. **La couleur ne porte jamais seule une information.** État = mot + forme (case cochée, texte
    barré, hachures) ; échelle territoriale = mot dans un cadre ; origine = glyphe + mot.
18. **Un seul accent**, le grenat `#8a2f39`. Le vert de validation, l'orange de lien mort et l'ambre
    du privé sont sémantiques, jamais décoratifs.
19. **Les hachures ont un sens fixe** : 135°, 3px/8px, ambre = privé ; pointillé gris = bloc replié
    ou annotation de canevas.
20. **Aucune image bitmap dans l'interface** — sauf les codes QR, qui sont des données. Le
    pictogramme est un SVG inline.

## Typographie

21. **IBM Plex Sans pour tout le texte, JetBrains Mono pour tout ce qui est repère ou compté**
    (dates, chiffres clés, adresses, libellés en capitales, décomptes, statuts).
22. **IBM Plex Serif n'apparaît que sur la tuile du portail**, parce que c'est la convention du
    portail — jamais à l'intérieur de l'app.
23. **Les chiffres sont en `font-variant-numeric: tabular-nums`** dès qu'ils s'alignent en colonne.
24. **Plancher de corps** : 10px pour du mono en capitales, 12px pour du texte courant.
25. **Les capitales mono portent toujours un `letter-spacing`** : .06em (méta), .1em (libellé de
    champ), .14em (titre de cartouche), .18em (rubrique).

## Accessibilité

26. **Cible tactile ≥ 48 px** sur téléphone, y compris les boutons de pied d'écran.
27. **`--cv-encre-3` (#6f6355) est le texte le plus clair autorisé** sur `--cv-surface` : 5,1:1.
    Rien de plus clair pour du texte, même décoratif.
28. **Le surlignage de recherche est un fond ambre + le mot en encre pleine**, jamais une couleur de
    texte seule.
29. **Chaque code QR porte un `alt` qui nomme sa destination**, et le domaine reste écrit à côté en
    clair : le papier doit rester utilisable sans téléphone.

## États limites

30. **Six états, six emplacements précis** (voir l'écran 4b, chaque cadre porte sa ligne « OÙ »).
    Chacun dit ce qui s'est passé, puis propose le geste qui débloque.
31. **« Rien de neuf » et « la collecte a échoué » sont deux états distincts.** Une veille sans
    nouveauté est un résultat normal ; ne pas les fondre dans un même écran vide.
32. **Aucun écran vide ne se contente d'un message.** Il porte toujours au moins une action, ou dit
    explicitement qu'il n'y a rien à faire (« Rien à faire — revenir vendredi »).

## Le portail

33. **La tuile suit les conventions du portail existant**, pas celles de l'app : fond plein grenat
    (le plein est réservé à ce qui s'ouvre), voile `rgba(244,242,236,.16)` de 44px autour d'un
    pictogramme de 28px, nom en IBM Plex Serif 21px/600, badge « ✓ en service » en filet clair,
    bouton « Ouvrir → » en encre claire.
34. **Le décompte du bandeau du portail est à reprendre** : 6 outils · 4 en service · 2 en chantier.

## Ce que l'app ne fait pas

35. **Le carnet ne calcule rien et n'interprète rien.** Les chiffres clés sont recopiés de la
    source, pas dérivés. Aucune synthèse générée, aucune connexion à une IA.
36. **Aucun compte étudiant.** La vue publiée est publique : pas de favori, pas de « lu / non lu »,
    pas de personnalisation.
37. **Le thème sombre a été écarté** (décision du 29 août 2026). Deux cartes du fichier de travail
    en gardent une trace ; elles ne font pas partie de la livraison.
