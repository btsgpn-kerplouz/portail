# Jetons — Carnet de veille naturaliste

Variables CSS prêtes à coller : `jetons.css` (préfixe `--cv-`). Règles fermes : `REGLES.md`.
Chaque motif isolé avec ses états et ses valeurs :
`Carnet de veille - Planche de composants.dc.html` — **la planche fait foi** en cas d'écart.

## Deux papiers, un seul système

    papier chaud    l'app : vue publiée ET vue rédaction (crème #fbf6ea → #fffdf6)
    papier blanc    la feuille d'impression seule : #ffffff, encre #000, aucun accent

Le grenat et le crème **disparaissent à l'impression** : l'accent devient un filet noir.

## Couleurs

    fond                          #fbf6ea   fond d'app
    surface                       #fffdf6   carte d'entrée, panneau, champ
    surface-2                     #f5ead4   en-tête de numéro, bandeau d'annotation
    surface-3                     #f0e4cd   bandeau de rubrique, barre de moisson

    bandeau                       #241d15   bandeau titre (encre)
    surBandeau                    #fdf8ec   texte du bandeau
    surBandeau-2                  #efe3cd   onglets inactifs du bandeau
    surBandeau-3                  #b3a893   sous-titre « BTS GPN · Kerplouz »
    filetBandeau                  #55483a   cadre des boutons du bandeau

    filetFin                      #eadfc8   séparateur interne de carte
    filet                         #ddd2ba   bordure de carte, de bandeau
    filetMoyen                    #c9b896   filet de rubrique, pointillé d'annotation
    filetFort                     #b9a87f   bordure d'un champ au repos

    encre                         #1a1611   titres, valeurs, noms de source
    encreCourant                  #2b241c   corps de texte
    encre-2                       #4a4136   texte secondaire
    encre-3                       #6f6355   libellés, méta (5,1:1 sur surface — plancher)
    brunRubrique                  #5b3d1f   nom de rubrique, en-tête de colonne
    filetPastille                 #b79b6c   cadre de la pastille d'échelle territoriale

    accent                        #8a2f39   grenat de l'app
    surAccent                     #fffdf6   texte sur le bouton source
    surAccent-2                   #f2ced2   domaine sous « Ouvrir la source »
    cartouche                     #f7ecdd   fond de « ce qu'on trouve dans le document »
    cartoucheFilet                #e0c9b5

    valide                        #196549   entrée retenue, lien vérifié
    mort / mortFond / mortFilet   #A6421B / #f7e5dc / #e0c4b6   lien inaccessible
    mortTexte                     #7d3413
    prive                         #7a5b16   encadré « Usage en cours » (jamais publié)
    priveFond / priveChamp        #f4ead0 / #f9f2e3
    priveTexte / priveTexte-2     #5c4410 / #4a3a10
    priveHachure                  rgba(122,91,22,.32)   hachures 135°, 3px/8px

    editFond                      #f7edee   fond d'un texte modifiable (rédaction seule)
    editPointille                 #b98088   soulignage pointillé du même
    editHalo                      0 0 0 3px rgba(138,47,57,.15)   champ actif

    surlignage                    #f7d9a8   occurrence trouvée dans la recherche

## Échelle de corps

               bureau (1000-1240px)        téléphone (390px)      impression (A4)
    titre du numéro     27px / 700          20px / 700             21px / 700
    n° du numéro        24px mono / 700     21px mono / 700        22px mono / 700
    titre d'entrée      29px / 700 (-.018em) 21px / 700 (-.015em)  16.5px / 700
    nom de source       14px / 700          13px / 700             10px mono
    méta de source      11px mono           10.5px mono            10px mono
    chapô               15.5px / 1.65       14.5px / 1.5           12.5px / 1.6
    corps               13.5px / 1.65       13px / 1.6             12.5px / 1.6
    chiffre clé         21px mono           17-18px mono           11px mono / 700
    libellé de chiffre  10.5px              10px                   11px mono
    cartouche (titre)   9.5px mono .14em    9px mono .14em         9px mono .14em
    cartouche (liste)   12.5px / 1.6        12px / 1.55            11.5px / 1.5
    bouton source       15px / 700          15px / 700             —
    rubrique            10.5px mono .18em   10px mono .18em        9.5px mono .18em

**Plancher** : 10px pour du mono en capitales, 12px pour du texte courant. Jamais moins.

## Gabarits

    numéro publié bureau          cadre 1000px · colonne de lecture 640px · rail des sources 296px
    numéro en rédaction           cadre 1240px · carte 1fr + panneau de composition 258px
    sources suivies (5a)          cadre 1000px · grille 1fr 128 128 132 96, gap 14px
    recherche (4a)                cadre 1000px · résultat d'actualité 1fr + 118px
    téléphone                     390 × 844 · marge intérieure 14-16px
    état limite                   390px de large, hauteur libre ≥ 230px de contenu
    feuille imprimée              794 × 1123 border-box · marges 46/52/38px
    bouton « Ouvrir la source »   min-height 56px · padding 15-16px · largeur 268px au bureau
    cartouche « ce qu'on trouve » bureau : grille 1fr 268px · mobile : empilé
    cible tactile                 ≥ 48px

## Le pictogramme

Un dessin SVG **inline** sur grille 24 × 24, `stroke-width:1.6`, `fill:none`, `stroke-linecap:square` :
un feuillet à bandeau plein (le numéro) et une flèche qui en sort (aller au document).

    <path d="M3 6.5h10v14H3z"/><path d="M3 10h10"/><path d="M5.5 13.5h5M5.5 16.5h5"/>
    <path d="M14.5 9 21 2.5"/><path d="M16 2.5h5v5"/>

Il est posé dans le bandeau titre de tous les écrans (24px, trait `#fdf8ec`) et sur la tuile du
portail (28px dans un voile de 44px, trait `#f4f2ec` ; 27px dans 42px en mobile).
Distinct de celui d'Organisation des cours (cadre à bandeau plein + trois barres, sans flèche).

## Codes QR

Quatre PNG dans ce dossier (`qr-csa`, `qr-cevennes`, `qr-portcros`, `qr-carnet`), rendus à 76px
sur la feuille (58px pour celui du pied). Ils encodent réellement les adresses ci-dessous.
**À l'implémentation ils sont générés à la volée** depuis l'URL de chaque entrée — ces fichiers ne
sont là que pour la maquette. Marge blanche de 4 modules obligatoire, `image-rendering:pixelated`.

## Contenu réel (données, pas du style)

    5 rubriques      Terrain & gestion · Science & protocoles · Données & référentiels ·
                     Pépites · (la 5e reste à nommer avec l'équipe)
    3 échelles       national · régional (+ département) · local
    barème           aucun — le carnet ne calcule rien
    n° 12            Conservatoire des Sites Alsaciens (plan de gestion, 65 205 € dont 35 184 FEDER) ·
                     PN des Cévennes (rhinolophes, 770 → 30) · PN de Port-Cros (Pinna nobilis, 21)
    collecte         14 sources interrogées chaque samedi 6 h
