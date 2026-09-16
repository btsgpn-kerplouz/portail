/* =========================================================
   DONNÉES — Typologie des végétations et des habitats dunaires
   du site Natura 2000 « Massif dunaire de Gâvres - Quiberon »
   Source : DELASSUS L., QUÉRÉ E., HARDEGEN M., 2018/2019 — Typologie des
   végétations et des habitats dunaires. CBN de Brest, DREAL Bretagne, 181 p.

   Périmètre retenu pour l'appli : les deux premières séries d'habitats du
   document, « 1. Hauts de plages et dunes mobiles » et « 2. Xérosère
   intradunaire ». Les dépressions dunaires (3.x) et les habitats hors contexte
   dunaire (4.x) sont hors sujet ici.

   L'identification porte sur les UNITÉS DE CARTOGRAPHIE (1.1a, 2.1c…), niveau
   auquel le document donne les tableaux de relevés.

   statut espèce :
     "car"    = espèce caractéristique de l'unité : citée comme diagnostique
                dans le texte de Delassus, ou présente dans au moins 75 % des
                relevés de l'unité ;
     "freq"   = espèce compagne, présente dans au moins 25 % des relevés ;
     "absent" = citée comme diagnostique dans le texte mais absente des relevés.
   Les espèces présentes dans moins de 25 % des relevés ne sont pas listées,
   sauf dans les unités de trois relevés ou moins, où tout est conservé.
   "constance" = pourcentage des relevés de l'unité où l'espèce est notée.
   Les bryophytes et lichens portent groupe:"bryolichenique" : ils structurent
   les dunes grises mais ne sont pas déterminables par des débutants.

   Fichier produit par scratchpad/gen-data-dunes.js à partir des tableaux
   extraits du PDF ; ne pas éditer à la main sans reporter dans le générateur.
   ========================================================= */

const HABITATS_DUNES = [
 {
  "id": "1.1a",
  "fiche": "1.1",
  "ordre": 1,
  "zone": "Haut de plage",
  "rang": 1,
  "groupe": "Laisses de mer",
  "nomFr": "Laisses de mer des hauts de plages de sable fin à Arroche laciniée",
  "nomFiche": "Laisses de mer des hauts de plages de sable",
  "syntaxon": "Beto maritimae - Atriplicetum laciniatae Tüxen (1950) 1967",
  "codes": {
   "eunis": "B1.12",
   "corine": "16.12",
   "eur28": "2110",
   "cahiers": "2110-1"
  },
  "nbReleves": 3,
  "especes": [
   {
    "latin": "Atriplex laciniata",
    "fr": "Arroche laciniée",
    "statut": "car",
    "constance": 100
   },
   {
    "latin": "Salsola kali subsp. kali",
    "fr": "Soude épineuse",
    "statut": "car",
    "constance": 100
   },
   {
    "latin": "Cakile maritima subsp. maritima",
    "fr": "Roquette de mer",
    "statut": "freq",
    "constance": 100
   },
   {
    "latin": "Honckenya peploides",
    "fr": "Pourpier de mer",
    "statut": "freq",
    "constance": 67
   },
   {
    "latin": "Elymus farctus",
    "fr": "Chiendent des sables",
    "statut": "freq",
    "constance": 67
   },
   {
    "latin": "Polygonum maritimum",
    "fr": "Renouée maritime",
    "statut": "freq",
    "constance": 33
   },
   {
    "latin": "Calystegia soldanella",
    "fr": "Liseron des dunes",
    "statut": "freq",
    "constance": 33
   },
   {
    "latin": "Beta vulgaris subsp. maritima",
    "fr": "Betterave maritime",
    "statut": "absent",
    "constance": 0
   }
  ],
  "description": "Sable fin très mobile, enfouissements fréquents. Se distingue par la présence significative d'Atriplex laciniata et Salsola kali subsp. kali, et une faible part d'Honckenya peploides.",
  "ecologie": "Paquets d'algues et débris végétaux déposés en haut de plage par les marées de vives eaux. Leur décomposition libère beaucoup d'azote : une végétation halonitrophile originale s'y installe, sur sable nu très mobile.",
  "physionomie": "Bandes étroites et discontinues parallèles au trait de côte, végétation lâche, presque uniquement des annuelles et bisannuelles (sauf Honckenya peploides et Polygonum maritimum).",
  "periode": "Fin d'été à début d'automne (fructification).",
  "confusions": "Avec les dunes embryonnaires, en contact et parfois en mosaïque : celles-ci sont dominées par Elymus farctus, et les espèces des laisses de mer y sont nettement plus discrètes.",
  "dynamique": "L'accumulation de sable permet aux vivaces, surtout Elymus farctus, de s'installer : la laisse de mer évolue alors en dune embryonnaire. Contact inférieur avec la plage nue, supérieur avec la dune embryonnaire."
 },
 {
  "id": "1.1b",
  "fiche": "1.1",
  "ordre": 2,
  "zone": "Haut de plage",
  "rang": 1,
  "groupe": "Laisses de mer",
  "nomFr": "Laisses de mer des hauts de plages de sable grossier à Euphorbe péplis",
  "nomFiche": "Laisses de mer des hauts de plages de sable",
  "syntaxon": "Matricario maritimae - Euphorbietum peplis (Tüxen 1950) Géhu 1964",
  "codes": {
   "eunis": "B1.12",
   "corine": "16.12",
   "eur28": "2110",
   "cahiers": "2110-1"
  },
  "nbReleves": 1,
  "especes": [
   {
    "latin": "Polygonum maritimum",
    "fr": "Renouée maritime",
    "statut": "car",
    "constance": 100
   },
   {
    "latin": "Calystegia soldanella",
    "fr": "Liseron des dunes",
    "statut": "freq",
    "constance": 100
   },
   {
    "latin": "Honckenya peploides",
    "fr": "Pourpier de mer",
    "statut": "freq",
    "constance": 100
   },
   {
    "latin": "Atriplex laciniata",
    "fr": "Arroche laciniée",
    "statut": "freq",
    "constance": 100
   },
   {
    "latin": "Elymus farctus",
    "fr": "Chiendent des sables",
    "statut": "freq",
    "constance": 100
   },
   {
    "latin": "Euphorbia peplis",
    "fr": "Euphorbe péplis",
    "statut": "car",
    "constance": 100
   },
   {
    "latin": "Salsola kali subsp. kali",
    "fr": "Soude épineuse",
    "statut": "freq",
    "constance": 100
   },
   {
    "latin": "Ammophila arenaria subsp. arenaria",
    "fr": "Oyat",
    "statut": "freq",
    "constance": 100
   },
   {
    "latin": "Matricaria maritima subsp. maritima",
    "fr": "Matricaire maritime",
    "statut": "absent",
    "constance": 0
   }
  ],
  "description": "Sable grossier, mouvements de sable encore importants. Caractérisée par Euphorbia peplis, Polygonum maritimum et Matricaria maritima subsp. maritima (présente sur le site, absente des relevés).",
  "ecologie": "Paquets d'algues et débris végétaux déposés en haut de plage par les marées de vives eaux. Leur décomposition libère beaucoup d'azote : une végétation halonitrophile originale s'y installe, sur sable nu très mobile.",
  "physionomie": "Bandes étroites et discontinues parallèles au trait de côte, végétation lâche, presque uniquement des annuelles et bisannuelles (sauf Honckenya peploides et Polygonum maritimum).",
  "periode": "Fin d'été à début d'automne (fructification).",
  "confusions": "Avec les dunes embryonnaires, en contact et parfois en mosaïque : celles-ci sont dominées par Elymus farctus, et les espèces des laisses de mer y sont nettement plus discrètes.",
  "dynamique": "L'accumulation de sable permet aux vivaces, surtout Elymus farctus, de s'installer : la laisse de mer évolue alors en dune embryonnaire. Contact inférieur avec la plage nue, supérieur avec la dune embryonnaire."
 },
 {
  "id": "1.1c",
  "fiche": "1.1",
  "ordre": 3,
  "zone": "Haut de plage",
  "rang": 1,
  "groupe": "Laisses de mer",
  "nomFr": "Laisses de mer des hauts de plages de sable grossier à Pourpier de mer",
  "nomFiche": "Laisses de mer des hauts de plages de sable",
  "syntaxon": "Honckenyetum latifoliae Géhu 1996",
  "codes": {
   "eunis": "B1.12",
   "corine": "16.12",
   "eur28": "2110",
   "cahiers": "2110-1"
  },
  "nbReleves": 4,
  "especes": [
   {
    "latin": "Honckenya peploides",
    "fr": "Pourpier de mer",
    "statut": "car",
    "constance": 100
   },
   {
    "latin": "Cakile maritima subsp. maritima",
    "fr": "Roquette de mer",
    "statut": "freq",
    "constance": 100
   },
   {
    "latin": "Ammophila arenaria subsp. arenaria",
    "fr": "Oyat",
    "statut": "freq",
    "constance": 75
   },
   {
    "latin": "Elymus farctus",
    "fr": "Chiendent des sables",
    "statut": "freq",
    "constance": 75
   },
   {
    "latin": "Calystegia soldanella",
    "fr": "Liseron des dunes",
    "statut": "freq",
    "constance": 50
   },
   {
    "latin": "Atriplex laciniata",
    "fr": "Arroche laciniée",
    "statut": "freq",
    "constance": 25
   }
  ],
  "description": "Sable grossier, peu de mouvements : une communauté vivace s'installe. Forte représentation d'Honckenya peploides, faible participation des annuelles des deux unités précédentes.",
  "ecologie": "Paquets d'algues et débris végétaux déposés en haut de plage par les marées de vives eaux. Leur décomposition libère beaucoup d'azote : une végétation halonitrophile originale s'y installe, sur sable nu très mobile.",
  "physionomie": "Bandes étroites et discontinues parallèles au trait de côte, végétation lâche, presque uniquement des annuelles et bisannuelles (sauf Honckenya peploides et Polygonum maritimum).",
  "periode": "Fin d'été à début d'automne (fructification).",
  "confusions": "Avec les dunes embryonnaires, en contact et parfois en mosaïque : celles-ci sont dominées par Elymus farctus, et les espèces des laisses de mer y sont nettement plus discrètes.",
  "dynamique": "L'accumulation de sable permet aux vivaces, surtout Elymus farctus, de s'installer : la laisse de mer évolue alors en dune embryonnaire. Contact inférieur avec la plage nue, supérieur avec la dune embryonnaire."
 },
 {
  "id": "1.2a",
  "fiche": "1.2",
  "ordre": 4,
  "zone": "Dune embryonnaire",
  "rang": 2,
  "groupe": "Dunes mobiles",
  "nomFr": "Dunes embryonnaires de sable fin",
  "nomFiche": "Dunes embryonnaires",
  "syntaxon": "Euphorbio paraliae - Agropyretum junceiformis Tüxen 1945",
  "codes": {
   "eunis": "B1.311",
   "corine": "16.2111",
   "eur28": "2110",
   "cahiers": "2110-1"
  },
  "nbReleves": 8,
  "especes": [
   {
    "latin": "Elymus farctus",
    "fr": "Chiendent des sables",
    "statut": "car",
    "constance": 100
   },
   {
    "latin": "Calystegia soldanella",
    "fr": "Liseron des dunes",
    "statut": "car",
    "constance": 100
   },
   {
    "latin": "Cakile maritima subsp. maritima",
    "fr": "Roquette de mer",
    "statut": "car",
    "constance": 88
   },
   {
    "latin": "Atriplex laciniata",
    "fr": "Arroche laciniée",
    "statut": "freq",
    "constance": 50
   },
   {
    "latin": "Ammophila arenaria subsp. arenaria",
    "fr": "Oyat",
    "statut": "freq",
    "constance": 50
   },
   {
    "latin": "Eryngium maritimum",
    "fr": "Panicaut de mer (Chardon bleu)",
    "statut": "car",
    "constance": 50
   },
   {
    "latin": "Euphorbia paralias",
    "fr": "Euphorbe des dunes",
    "statut": "car",
    "constance": 25
   }
  ],
  "description": "Sable fin, enfouissements fréquents. Groupement vivace bistratifié dominé par Elymus farctus ; strate basse à Calystegia soldanella et rosettes des dunes semi-fixées. Ouvert, 25 à 50 cm.",
  "ecologie": "Pieds de dune exposés à la mer, en secteur d'accumulation de sable. Niveau du substrat très variable, sable filtrant et instable, sans sol : la végétation supporte l'enfouissement et les embruns.",
  "physionomie": "Développement linéaire parallèle au trait de côte. Végétation vivace bistratifiée, ouverte, de 25 à 50 cm, marquée par Elymus farctus accompagné de Calystegia soldanella, Eryngium maritimum et Euphorbia paralias.",
  "periode": "Début d'été à début d'automne.",
  "confusions": "Avec les laisses de mer, jamais dominées par Elymus farctus. Avec la dune blanche, dominée par Ammophila arenaria : l'oyat peut être ponctuellement présent dans la dune embryonnaire, mais jamais dominant.",
  "dynamique": "Dynamique interne nulle : la végétation reste en place tant que les apports éoliens durent. En grandissant, la dune reçoit moins de sable et évolue vers la dune blanche à Oyat. Contact inférieur avec les laisses de mer, supérieur avec la dune vive ; les dunes embryonnaires de sable grossier peuvent toucher directement les pelouses des dunes grises."
 },
 {
  "id": "1.2b",
  "fiche": "1.2",
  "ordre": 5,
  "zone": "Dune embryonnaire",
  "rang": 2,
  "groupe": "Dunes mobiles",
  "nomFr": "Dunes embryonnaires de sable grossier",
  "nomFiche": "Dunes embryonnaires",
  "syntaxon": "Crithmo maritimi - Otanthetum maritimi Pavillard ex Géhu 2008",
  "codes": {
   "eunis": "B1.311",
   "corine": "16.2111",
   "eur28": "2110",
   "cahiers": "2110-1"
  },
  "nbReleves": 3,
  "especes": [
   {
    "latin": "Elymus farctus",
    "fr": "Chiendent des sables",
    "statut": "freq",
    "constance": 100
   },
   {
    "latin": "Calystegia soldanella",
    "fr": "Liseron des dunes",
    "statut": "freq",
    "constance": 100
   },
   {
    "latin": "Crithmum maritimum",
    "fr": "Criste marine",
    "statut": "car",
    "constance": 100
   },
   {
    "latin": "Honckenya peploides",
    "fr": "Pourpier de mer",
    "statut": "freq",
    "constance": 100
   },
   {
    "latin": "Otanthus maritimus",
    "fr": "Immortelle des sables (Diotis)",
    "statut": "car",
    "constance": 100
   },
   {
    "latin": "Eryngium maritimum",
    "fr": "Panicaut de mer (Chardon bleu)",
    "statut": "freq",
    "constance": 67
   },
   {
    "latin": "Galium arenarium",
    "fr": "Gaillet des sables",
    "statut": "freq",
    "constance": 67
   },
   {
    "latin": "Ammophila arenaria subsp. arenaria",
    "fr": "Oyat",
    "statut": "freq",
    "constance": 67
   },
   {
    "latin": "Cakile maritima subsp. maritima",
    "fr": "Roquette de mer",
    "statut": "freq",
    "constance": 67
   },
   {
    "latin": "Leontodon saxatilis",
    "fr": "Liondent des rochers",
    "statut": "freq",
    "constance": 67
   },
   {
    "latin": "Matthiola sinuata",
    "fr": "Giroflée des dunes",
    "statut": "freq",
    "constance": 67
   },
   {
    "latin": "Euphorbia paralias",
    "fr": "Euphorbe des dunes",
    "statut": "freq",
    "constance": 33
   },
   {
    "latin": "Matricaria maritima subsp. maritima",
    "fr": "Matricaire maritime",
    "statut": "freq",
    "constance": 33
   }
  ],
  "description": "Sables plus grossiers, moins mobiles. Dominance d'Otanthus maritimus et Crithmum maritimum, reconnaissable aux teintes argentées de l'immortelle des sables. Ouvert, 20 à 35 cm.",
  "ecologie": "Pieds de dune exposés à la mer, en secteur d'accumulation de sable. Niveau du substrat très variable, sable filtrant et instable, sans sol : la végétation supporte l'enfouissement et les embruns.",
  "physionomie": "Développement linéaire parallèle au trait de côte. Végétation vivace bistratifiée, ouverte, de 25 à 50 cm, marquée par Elymus farctus accompagné de Calystegia soldanella, Eryngium maritimum et Euphorbia paralias.",
  "periode": "Début d'été à début d'automne.",
  "confusions": "Avec les laisses de mer, jamais dominées par Elymus farctus. Avec la dune blanche, dominée par Ammophila arenaria : l'oyat peut être ponctuellement présent dans la dune embryonnaire, mais jamais dominant.",
  "dynamique": "Dynamique interne nulle : la végétation reste en place tant que les apports éoliens durent. En grandissant, la dune reçoit moins de sable et évolue vers la dune blanche à Oyat. Contact inférieur avec les laisses de mer, supérieur avec la dune vive ; les dunes embryonnaires de sable grossier peuvent toucher directement les pelouses des dunes grises."
 },
 {
  "id": "1.3a",
  "fiche": "1.3",
  "ordre": 6,
  "zone": "Dune blanche",
  "rang": 3,
  "groupe": "Dunes mobiles",
  "nomFr": "Dunes blanches à Oyat",
  "nomFiche": "Dunes vives",
  "syntaxon": "Euphorbio paraliae - Ammophiletum arenariae Tüxen in Braun-Blanquet & Tüxen 1952",
  "codes": {
   "eunis": "B1.3211",
   "corine": "16.2121",
   "eur28": "2120",
   "cahiers": "2120-1"
  },
  "nbReleves": 14,
  "especes": [
   {
    "latin": "Ammophila arenaria subsp. arenaria",
    "fr": "Oyat",
    "statut": "car",
    "constance": 100
   },
   {
    "latin": "Calystegia soldanella",
    "fr": "Liseron des dunes",
    "statut": "car",
    "constance": 93
   },
   {
    "latin": "Galium arenarium",
    "fr": "Gaillet des sables",
    "statut": "car",
    "constance": 86
   },
   {
    "latin": "Eryngium maritimum",
    "fr": "Panicaut de mer (Chardon bleu)",
    "statut": "car",
    "constance": 57
   },
   {
    "latin": "Euphorbia paralias",
    "fr": "Euphorbe des dunes",
    "statut": "car",
    "constance": 57
   },
   {
    "latin": "Matthiola sinuata",
    "fr": "Giroflée des dunes",
    "statut": "freq",
    "constance": 57
   },
   {
    "latin": "Crithmum maritimum",
    "fr": "Criste marine",
    "statut": "freq",
    "constance": 43
   },
   {
    "latin": "Sonchus oleraceus",
    "fr": "Laiteron potager",
    "statut": "freq",
    "constance": 43
   },
   {
    "latin": "Carex arenaria",
    "fr": "Laîche des sables",
    "statut": "freq",
    "constance": 36
   },
   {
    "latin": "Conyza sumatrensis",
    "fr": "Vergerette de Sumatra",
    "statut": "freq",
    "constance": 29
   },
   {
    "latin": "Elymus farctus",
    "fr": "Chiendent des sables",
    "statut": "freq",
    "constance": 29
   },
   {
    "latin": "Cakile maritima subsp. maritima",
    "fr": "Roquette de mer",
    "statut": "freq",
    "constance": 29
   },
   {
    "latin": "Senecio jacobaea",
    "fr": "Séneçon jacobée",
    "statut": "freq",
    "constance": 29
   }
  ],
  "description": "Sommet et versant exposé à la mer, très soumis au vent. Groupement vivace dominé par Ammophila arenaria, avec Calystegia soldanella, Eryngium maritimum et Euphorbia paralias. Assez ouvert, 50 à 90 cm.",
  "ecologie": "Cordon dunaire typique, en arrière de la dune embryonnaire ou au contact direct de la mer. Niveau du sol instable (apports et arrachements éoliens), substrat brut très filtrant, sans sol : la végétation vit surtout de l'eau atmosphérique.",
  "physionomie": "Cordons où le sable reste visible, soit nu (caoudeyres, micro-falaises), soit sous une végétation lâche. Végétation vivace bistratifiée : strate haute de graminées (Ammophila arenaria et/ou Festuca juncifolia), accompagnées de Calystegia soldanella, Eryngium maritimum, Euphorbia paralias et Galium arenarium.",
  "periode": "Début à fin d'été, mais visible toute l'année.",
  "confusions": "Avec la dune embryonnaire (dominée par Elymus farctus, sans Festuca juncifolia). Entre dune blanche et dune semi-fixée, c'est la balance Ammophila / Festuca juncifolia et l'ouverture de la végétation qui départagent. Avec les faciès à oyat des dunes fixées, où les espèces des dunes grises, surtout les bryophytes, sont bien présentes.",
  "dynamique": "Dunes vives globalement stables ; seule l'évolution du trait de côte les fait bouger. La dune blanche peut être ravivée par l'ouverture de caoudeyres, dont la cicatrisation passe par un groupement à fétuques. Contact avec les dunes embryonnaires ou le haut de plage côté mer, avec les dunes fixées côté terre."
 },
 {
  "id": "1.3b",
  "fiche": "1.3",
  "ordre": 7,
  "zone": "Dune semi-fixée",
  "rang": 4,
  "groupe": "Dunes mobiles",
  "nomFr": "Dunes semi-fixées à Fétuque à feuilles de jonc",
  "nomFiche": "Dunes vives",
  "syntaxon": "Festuco dumetorum - Galietum arenarii Géhu 1964",
  "codes": {
   "eunis": "B1.3211",
   "corine": "16.2121",
   "eur28": "2120",
   "cahiers": "2120-1"
  },
  "nbReleves": 7,
  "especes": [
   {
    "latin": "Festuca juncifolia",
    "fr": "Fétuque à feuilles de jonc",
    "statut": "car",
    "constance": 100
   },
   {
    "latin": "Galium arenarium",
    "fr": "Gaillet des sables",
    "statut": "car",
    "constance": 100
   },
   {
    "latin": "Leontodon saxatilis",
    "fr": "Liondent des rochers",
    "statut": "car",
    "constance": 86
   },
   {
    "latin": "Eryngium maritimum",
    "fr": "Panicaut de mer (Chardon bleu)",
    "statut": "car",
    "constance": 86
   },
   {
    "latin": "Calystegia soldanella",
    "fr": "Liseron des dunes",
    "statut": "freq",
    "constance": 71
   },
   {
    "latin": "Ammophila arenaria subsp. arenaria",
    "fr": "Oyat",
    "statut": "freq",
    "constance": 57
   },
   {
    "latin": "Plantago lanceolata",
    "fr": "Plantain lancéolé",
    "statut": "freq",
    "constance": 57
   },
   {
    "latin": "Cerastium diffusum subsp. diffusum",
    "fr": "Céraiste à quatre étamines",
    "statut": "freq",
    "constance": 57
   },
   {
    "latin": "Matthiola sinuata",
    "fr": "Giroflée des dunes",
    "statut": "freq",
    "constance": 57
   },
   {
    "latin": "Hypochaeris radicata",
    "fr": "Porcelle enracinée",
    "statut": "freq",
    "constance": 43
   },
   {
    "latin": "Euphorbia paralias",
    "fr": "Euphorbe des dunes",
    "statut": "freq",
    "constance": 43
   },
   {
    "latin": "Medicago marina",
    "fr": "Luzerne marine",
    "statut": "car",
    "constance": 29
   },
   {
    "latin": "Carex arenaria",
    "fr": "Laîche des sables",
    "statut": "freq",
    "constance": 29
   },
   {
    "latin": "Mibora minima",
    "fr": "Mibora naine",
    "statut": "freq",
    "constance": 29
   }
  ],
  "description": "Revers de la dune vive, abrité : le sable se dépose sans être arraché. Sable nu dominant visuellement, mais groupement dominé par Festuca juncifolia avec de larges taches de Galium arenarium et/ou Medicago marina. Pelouse très ouverte, 20 à 60 cm.",
  "ecologie": "Cordon dunaire typique, en arrière de la dune embryonnaire ou au contact direct de la mer. Niveau du sol instable (apports et arrachements éoliens), substrat brut très filtrant, sans sol : la végétation vit surtout de l'eau atmosphérique.",
  "physionomie": "Cordons où le sable reste visible, soit nu (caoudeyres, micro-falaises), soit sous une végétation lâche. Végétation vivace bistratifiée : strate haute de graminées (Ammophila arenaria et/ou Festuca juncifolia), accompagnées de Calystegia soldanella, Eryngium maritimum, Euphorbia paralias et Galium arenarium.",
  "periode": "Début à fin d'été, mais visible toute l'année.",
  "confusions": "Avec la dune embryonnaire (dominée par Elymus farctus, sans Festuca juncifolia). Entre dune blanche et dune semi-fixée, c'est la balance Ammophila / Festuca juncifolia et l'ouverture de la végétation qui départagent. Avec les faciès à oyat des dunes fixées, où les espèces des dunes grises, surtout les bryophytes, sont bien présentes.",
  "dynamique": "Dunes vives globalement stables ; seule l'évolution du trait de côte les fait bouger. La dune blanche peut être ravivée par l'ouverture de caoudeyres, dont la cicatrisation passe par un groupement à fétuques. Contact avec les dunes embryonnaires ou le haut de plage côté mer, avec les dunes fixées côté terre."
 },
 {
  "id": "1.3c",
  "fiche": "1.3",
  "ordre": 8,
  "zone": "Dune semi-fixée",
  "rang": 4,
  "groupe": "Dunes mobiles",
  "nomFr": "Caoudeyres (siffle-vent)",
  "nomFiche": "Dunes vives",
  "syntaxon": "Festuco dumetorum - Galietum arenarii Géhu 1964 (végétation cicatricielle)",
  "codes": {
   "eunis": "B1.3211",
   "corine": "16.2121",
   "eur28": "2120",
   "cahiers": "2120-1"
  },
  "nbReleves": 0,
  "especes": [],
  "description": "Dépressions creusées par le vent dans la dune, sans végétation lorsqu'elles sont actives. Les caoudeyres inactives se cicatrisent par une végétation proche de la dune semi-fixée. À considérer comme une mosaïque de sable nu et de pelouse du Festuco dumetorum - Galietum arenarii.",
  "ecologie": "Cordon dunaire typique, en arrière de la dune embryonnaire ou au contact direct de la mer. Niveau du sol instable (apports et arrachements éoliens), substrat brut très filtrant, sans sol : la végétation vit surtout de l'eau atmosphérique.",
  "physionomie": "Cordons où le sable reste visible, soit nu (caoudeyres, micro-falaises), soit sous une végétation lâche. Végétation vivace bistratifiée : strate haute de graminées (Ammophila arenaria et/ou Festuca juncifolia), accompagnées de Calystegia soldanella, Eryngium maritimum, Euphorbia paralias et Galium arenarium.",
  "periode": "Début à fin d'été, mais visible toute l'année.",
  "confusions": "Avec la dune embryonnaire (dominée par Elymus farctus, sans Festuca juncifolia). Entre dune blanche et dune semi-fixée, c'est la balance Ammophila / Festuca juncifolia et l'ouverture de la végétation qui départagent. Avec les faciès à oyat des dunes fixées, où les espèces des dunes grises, surtout les bryophytes, sont bien présentes.",
  "dynamique": "Dunes vives globalement stables ; seule l'évolution du trait de côte les fait bouger. La dune blanche peut être ravivée par l'ouverture de caoudeyres, dont la cicatrisation passe par un groupement à fétuques. Contact avec les dunes embryonnaires ou le haut de plage côté mer, avec les dunes fixées côté terre.",
  "sansReleve": "Aucun relevé : unité trop ponctuelle sur le site. L'appli ne peut donc pas la proposer à partir d'un cortège."
 },
 {
  "id": "2.1a",
  "fiche": "2.1",
  "ordre": 9,
  "zone": "Dune grise",
  "rang": 5,
  "groupe": "Pelouses des dunes fixées",
  "nomFr": "Pelouses typiques des dunes fixées",
  "nomFiche": "Pelouses des dunes grises",
  "syntaxon": "Roso spinosissimae - Ephedretum distachyae Künholtz-Lordat (1927) 1931",
  "codes": {
   "eunis": "B1.42",
   "corine": "16.222",
   "eur28": "2130*",
   "cahiers": "2130*-2"
  },
  "nbReleves": 25,
  "especes": [
   {
    "latin": "Ephedra distachya subsp. distachya",
    "fr": "Éphèdre à deux épis (Raisin de mer)",
    "statut": "car",
    "constance": 100
   },
   {
    "latin": "Sedum acre",
    "fr": "Orpin âcre",
    "statut": "car",
    "constance": 96
   },
   {
    "latin": "Eryngium campestre",
    "fr": "Panicaut champêtre",
    "statut": "car",
    "constance": 92
   },
   {
    "latin": "Euphorbia portlandica",
    "fr": "Euphorbe de Portland",
    "statut": "car",
    "constance": 88
   },
   {
    "latin": "Sanguisorba minor subsp. minor",
    "fr": "Petite pimprenelle",
    "statut": "car",
    "constance": 84
   },
   {
    "latin": "Koeleria glauca",
    "fr": "Koelérie glauque",
    "statut": "car",
    "constance": 76
   },
   {
    "latin": "Plantago lanceolata",
    "fr": "Plantain lancéolé",
    "statut": "car",
    "constance": 76
   },
   {
    "latin": "Thymus drucei",
    "fr": "Thym de Bretagne",
    "statut": "freq",
    "constance": 72
   },
   {
    "latin": "Mibora minima",
    "fr": "Mibora naine",
    "statut": "freq",
    "constance": 72
   },
   {
    "latin": "Carex arenaria",
    "fr": "Laîche des sables",
    "statut": "freq",
    "constance": 68
   },
   {
    "latin": "Veronica arvensis",
    "fr": "Véronique des champs",
    "statut": "freq",
    "constance": 68
   },
   {
    "latin": "Geranium molle",
    "fr": "Géranium à feuilles molles",
    "statut": "freq",
    "constance": 68
   },
   {
    "latin": "Lamium amplexicaule subsp. amplexicaule",
    "fr": "Lamier amplexicaule",
    "statut": "freq",
    "constance": 68
   },
   {
    "latin": "Viola kitaibeliana",
    "fr": "Pensée de Kitaibel",
    "statut": "freq",
    "constance": 64
   },
   {
    "latin": "Cerastium diffusum subsp. diffusum",
    "fr": "Céraiste à quatre étamines",
    "statut": "freq",
    "constance": 60
   },
   {
    "latin": "Helichrysum stoechas subsp. stoechas",
    "fr": "Immortelle des dunes",
    "statut": "car",
    "constance": 52
   },
   {
    "latin": "Cochlearia danica",
    "fr": "Cochléaire du Danemark",
    "statut": "freq",
    "constance": 52
   },
   {
    "latin": "Linaria arenaria",
    "fr": "Linaire des sables",
    "statut": "freq",
    "constance": 52
   },
   {
    "latin": "Erodium lebelii",
    "fr": "Bec-de-grue de Lebel",
    "statut": "freq",
    "constance": 52
   },
   {
    "latin": "Tortella squarrosa",
    "fr": "Tortella squarrosa (mousse)",
    "statut": "freq",
    "constance": 48,
    "groupe": "bryolichenique"
   },
   {
    "latin": "Hypochaeris radicata",
    "fr": "Porcelle enracinée",
    "statut": "freq",
    "constance": 48
   },
   {
    "latin": "Bupleurum baldense subsp. baldense",
    "fr": "Buplèvre du mont Baldo",
    "statut": "freq",
    "constance": 44
   },
   {
    "latin": "Leontodon saxatilis",
    "fr": "Liondent des rochers",
    "statut": "freq",
    "constance": 44
   },
   {
    "latin": "Galium arenarium",
    "fr": "Gaillet des sables",
    "statut": "freq",
    "constance": 44
   },
   {
    "latin": "Homalothecium lutescens",
    "fr": "Homalothecium lutescens (mousse)",
    "statut": "freq",
    "constance": 40,
    "groupe": "bryolichenique"
   },
   {
    "latin": "Rosa pimpinellifolia",
    "fr": "Rosier pimprenelle",
    "statut": "car",
    "constance": 40
   },
   {
    "latin": "Armeria maritima",
    "fr": "Armérie maritime",
    "statut": "freq",
    "constance": 40
   },
   {
    "latin": "Asperula cynanchica",
    "fr": "Aspérule à l'esquinancie",
    "statut": "car",
    "constance": 40
   },
   {
    "latin": "Valerianella locusta",
    "fr": "Mâche doucette",
    "statut": "freq",
    "constance": 40
   },
   {
    "latin": "Sherardia arvensis",
    "fr": "Rubéole des champs",
    "statut": "freq",
    "constance": 40
   },
   {
    "latin": "Lichen sp.",
    "fr": "Lichen (non déterminé)",
    "statut": "freq",
    "constance": 36,
    "groupe": "bryolichenique"
   },
   {
    "latin": "Senecio vulgaris",
    "fr": "Séneçon commun",
    "statut": "freq",
    "constance": 36
   },
   {
    "latin": "Catapodium rigidum",
    "fr": "Catapode rigide",
    "statut": "freq",
    "constance": 32
   },
   {
    "latin": "Saxifraga tridactylites",
    "fr": "Saxifrage à trois doigts",
    "statut": "freq",
    "constance": 32
   },
   {
    "latin": "Dianthus gallicus",
    "fr": "Œillet de France",
    "statut": "car",
    "constance": 32
   },
   {
    "latin": "Allium sphaerocephalon",
    "fr": "Ail à tête ronde",
    "statut": "freq",
    "constance": 28
   },
   {
    "latin": "Medicago minima",
    "fr": "Luzerne naine",
    "statut": "freq",
    "constance": 28
   },
   {
    "latin": "Trifolium scabrum",
    "fr": "Trèfle scabre",
    "statut": "freq",
    "constance": 28
   }
  ],
  "description": "Pelouse dunaire caractéristique du site, sans contrainte dynamique ni anthropique. Communautés très diversifiées accueillant Ephedra distachya, Rosa pimpinellifolia, Dianthus gallicus, Asperula cynanchica, Tortella squarrosa, Helichrysum stoechas, Lamium amplexicaule, Galium arenarium, Bupleurum baldense, Cerastium semidecandrum, Phleum arenarium, Trifolium scabrum, Medicago minima. Un faciès à Schoenus nigricans existe localement, le reste du cortège restant typique.",
  "ecologie": "Intérieur des dunes, à l'abri des dunes mobiles. Apports de sable faibles, substrat plus ou moins fixé, mince couche humifère qui devient très sèche en été. Fortes amplitudes thermiques journalières ; les débris coquilliers apportent des bases, ce qui distingue ces dunes des sables intérieurs acides.",
  "physionomie": "Pelouses rases et très recouvrantes mêlant annuelles, vivaces et bryophytes, parfois ouvertes après un saupoudrage de sable hivernal. Fond spécifique commun : Sanguisorba minor, Carex arenaria, Hypnum cupressiforme var. lacunosum, Sedum acre, Cerastium diffusum, Thymus drucei, Euphorbia portlandica, Ononis repens, Mibora minima, Koeleria glauca, Arenaria serpyllifolia, Leontodon saxatilis.",
  "periode": "Visible toute l'année, optimum de floraison du printemps au début de l'été.",
  "confusions": "Les sous-unités sont floristiquement proches : Delassus en donne une clé, reprise ici. Retenir surtout : richesse en espèces oligotrophiles (Éphèdre, Rosier pimprenelle, Œillet de France, Aspérule…) pour les pelouses en bon état, contre présence de taxons de perturbation (Plantain corne-de-cerf, Lagure, Chiendent pied-de-poule…) pour les pelouses dégradées ou piétinées. La strate bryolichénique distingue les pelouses typiques (Hypnum) des pelouses saupoudrées (Syntrichia) et des pentes décapées (Tortella).",
  "dynamique": "Les pelouses proches du trait de côte sont quasi stables ; les plus internes évoluent vers les fourrés dunaires sur sol sec, d'autant plus vite qu'elles sont dégradées. Le piétinement fait passer les pelouses typiques aux pelouses des chemins non empierrés, processus réversible. Contact avec les dunes mobiles côté mer, les prairies et fourrés côté terre, et avec les dépressions dunaires.",
  "cle": [
   "Pelouse riche en espèces oligotrophiles (Ephedra distachya, Rosa pimpinellifolia, Dianthus gallicus, Asperula cynanchica, Thesium humifusum, Silene otites, Helichrysum stoechas…) → 2",
   "2. Strate bryolichénique fermée à Hypnum cupressiforme var. lacunosum, strate herbacée diversifiée → 3 ; strate bryolichénique peu dense à Syntrichia ou Tortella, végétation plus ouverte → 4",
   "3. Dominée par Ephedra distachya et/ou Rosa pimpinellifolia → 2.1a ; dominée par Helichrysum stoechas, Éphèdre et Rosier rares, sommet de butte → 2.1d",
   "4. Saupoudrage hivernal, sol en « millefeuille », Syntrichia ruralis subsp. ruraliformis → 2.1b ; pente décapée, Tortella squarrosa, Corynephorus canescens et Koeleria glauca → 2.1c",
   "Pelouse pauvre en oligotrophiles → 5. Ourlet fermé à Geranium sanguineum → 2.1e ; sinon → 6",
   "6. Fond de carrière ou ancienne culture, Sanguisorba minor dominant, taxons piétinés rares → 2.1f ; sinon → 7",
   "7. Camping ou chemin sur sable, Plantago coronopus, Cynodon dactylon, Sagina apetala → 2.1g ; voile d'annuelles à Lagurus ovatus et Bromus diandrus → 2.1h ; sables remaniés et enrichis à Glaucium flavum, Linaria arenaria, Carduus nutans → 2.1i"
  ]
 },
 {
  "id": "2.1b",
  "fiche": "2.1",
  "ordre": 10,
  "zone": "Dune grise",
  "rang": 5,
  "groupe": "Pelouses des dunes fixées",
  "nomFr": "Pelouses des dunes fixées saupoudrées de sable",
  "nomFiche": "Pelouses des dunes grises",
  "syntaxon": "Roso spinosissimae - Ephedretum distachyae Künholtz-Lordat (1927) 1931",
  "codes": {
   "eunis": "B1.42",
   "corine": "16.222",
   "eur28": "2130*",
   "cahiers": "2130*-2"
  },
  "nbReleves": 8,
  "especes": [
   {
    "latin": "Syntrichia ruralis subsp. ruraliformis",
    "fr": "Syntrichia ruralis (mousse des dunes saupoudrées)",
    "statut": "car",
    "constance": 100,
    "groupe": "bryolichenique"
   },
   {
    "latin": "Mibora minima",
    "fr": "Mibora naine",
    "statut": "car",
    "constance": 100
   },
   {
    "latin": "Plantago lanceolata",
    "fr": "Plantain lancéolé",
    "statut": "car",
    "constance": 88
   },
   {
    "latin": "Sedum acre",
    "fr": "Orpin âcre",
    "statut": "car",
    "constance": 88
   },
   {
    "latin": "Cerastium diffusum subsp. diffusum",
    "fr": "Céraiste à quatre étamines",
    "statut": "car",
    "constance": 88
   },
   {
    "latin": "Eryngium campestre",
    "fr": "Panicaut champêtre",
    "statut": "car",
    "constance": 88
   },
   {
    "latin": "Helichrysum stoechas subsp. stoechas",
    "fr": "Immortelle des dunes",
    "statut": "car",
    "constance": 75
   },
   {
    "latin": "Geranium molle",
    "fr": "Géranium à feuilles molles",
    "statut": "car",
    "constance": 75
   },
   {
    "latin": "Linaria arenaria",
    "fr": "Linaire des sables",
    "statut": "car",
    "constance": 75
   },
   {
    "latin": "Cochlearia danica",
    "fr": "Cochléaire du Danemark",
    "statut": "car",
    "constance": 75
   },
   {
    "latin": "Ononis repens",
    "fr": "Bugrane rampante",
    "statut": "car",
    "constance": 75
   },
   {
    "latin": "Galium arenarium",
    "fr": "Gaillet des sables",
    "statut": "freq",
    "constance": 63
   },
   {
    "latin": "Carex arenaria",
    "fr": "Laîche des sables",
    "statut": "freq",
    "constance": 63
   },
   {
    "latin": "Lamium amplexicaule subsp. amplexicaule",
    "fr": "Lamier amplexicaule",
    "statut": "freq",
    "constance": 63
   },
   {
    "latin": "Euphorbia portlandica",
    "fr": "Euphorbe de Portland",
    "statut": "car",
    "constance": 63
   },
   {
    "latin": "Leontodon saxatilis",
    "fr": "Liondent des rochers",
    "statut": "freq",
    "constance": 63
   },
   {
    "latin": "Valerianella locusta",
    "fr": "Mâche doucette",
    "statut": "freq",
    "constance": 63
   },
   {
    "latin": "Senecio vulgaris",
    "fr": "Séneçon commun",
    "statut": "freq",
    "constance": 63
   },
   {
    "latin": "Ephedra distachya subsp. distachya",
    "fr": "Éphèdre à deux épis (Raisin de mer)",
    "statut": "car",
    "constance": 50
   },
   {
    "latin": "Phleum arenarium",
    "fr": "Fléole des sables",
    "statut": "freq",
    "constance": 50
   },
   {
    "latin": "Homalothecium lutescens",
    "fr": "Homalothecium lutescens (mousse)",
    "statut": "freq",
    "constance": 50,
    "groupe": "bryolichenique"
   },
   {
    "latin": "Myosotis ramosissima subsp. lebelii",
    "fr": "Myosotis de Lebel",
    "statut": "freq",
    "constance": 50
   },
   {
    "latin": "Viola kitaibeliana",
    "fr": "Pensée de Kitaibel",
    "statut": "freq",
    "constance": 50
   },
   {
    "latin": "Thymus drucei",
    "fr": "Thym de Bretagne",
    "statut": "freq",
    "constance": 38
   },
   {
    "latin": "Sanguisorba minor subsp. minor",
    "fr": "Petite pimprenelle",
    "statut": "freq",
    "constance": 38
   },
   {
    "latin": "Calystegia soldanella",
    "fr": "Liseron des dunes",
    "statut": "freq",
    "constance": 38
   },
   {
    "latin": "Jasione montana subsp. montana",
    "fr": "Jasione des montagnes",
    "statut": "freq",
    "constance": 38
   },
   {
    "latin": "Asperula cynanchica",
    "fr": "Aspérule à l'esquinancie",
    "statut": "freq",
    "constance": 38
   },
   {
    "latin": "Hypochaeris radicata",
    "fr": "Porcelle enracinée",
    "statut": "freq",
    "constance": 38
   },
   {
    "latin": "Rosa pimpinellifolia",
    "fr": "Rosier pimprenelle",
    "statut": "freq",
    "constance": 25
   },
   {
    "latin": "Festuca juncifolia",
    "fr": "Fétuque à feuilles de jonc",
    "statut": "car",
    "constance": 25
   },
   {
    "latin": "Koeleria glauca",
    "fr": "Koelérie glauque",
    "statut": "freq",
    "constance": 25
   },
   {
    "latin": "Erodium lebelii",
    "fr": "Bec-de-grue de Lebel",
    "statut": "freq",
    "constance": 25
   }
  ],
  "description": "En arrière des dunes mobiles, saupoudrées lors des tempêtes d'hiver : physionomie très ouverte, mais cortège dominé par les taxons des dunes fixées, seul Festuca juncifolia rappelant les dunes mobiles. En strate bryolichénique, Syntrichia ruralis subsp. ruraliformis remplace Hypnum cupressiforme, car elle supporte mieux l'enfouissement ; le sol forme un « millefeuille » de couches de sable et de bryophytes desséchées. Artemisia campestris subsp. maritima y est fréquente.",
  "ecologie": "Intérieur des dunes, à l'abri des dunes mobiles. Apports de sable faibles, substrat plus ou moins fixé, mince couche humifère qui devient très sèche en été. Fortes amplitudes thermiques journalières ; les débris coquilliers apportent des bases, ce qui distingue ces dunes des sables intérieurs acides.",
  "physionomie": "Pelouses rases et très recouvrantes mêlant annuelles, vivaces et bryophytes, parfois ouvertes après un saupoudrage de sable hivernal. Fond spécifique commun : Sanguisorba minor, Carex arenaria, Hypnum cupressiforme var. lacunosum, Sedum acre, Cerastium diffusum, Thymus drucei, Euphorbia portlandica, Ononis repens, Mibora minima, Koeleria glauca, Arenaria serpyllifolia, Leontodon saxatilis.",
  "periode": "Visible toute l'année, optimum de floraison du printemps au début de l'été.",
  "confusions": "Les sous-unités sont floristiquement proches : Delassus en donne une clé, reprise ici. Retenir surtout : richesse en espèces oligotrophiles (Éphèdre, Rosier pimprenelle, Œillet de France, Aspérule…) pour les pelouses en bon état, contre présence de taxons de perturbation (Plantain corne-de-cerf, Lagure, Chiendent pied-de-poule…) pour les pelouses dégradées ou piétinées. La strate bryolichénique distingue les pelouses typiques (Hypnum) des pelouses saupoudrées (Syntrichia) et des pentes décapées (Tortella).",
  "dynamique": "Les pelouses proches du trait de côte sont quasi stables ; les plus internes évoluent vers les fourrés dunaires sur sol sec, d'autant plus vite qu'elles sont dégradées. Le piétinement fait passer les pelouses typiques aux pelouses des chemins non empierrés, processus réversible. Contact avec les dunes mobiles côté mer, les prairies et fourrés côté terre, et avec les dépressions dunaires.",
  "cle": [
   "Pelouse riche en espèces oligotrophiles (Ephedra distachya, Rosa pimpinellifolia, Dianthus gallicus, Asperula cynanchica, Thesium humifusum, Silene otites, Helichrysum stoechas…) → 2",
   "2. Strate bryolichénique fermée à Hypnum cupressiforme var. lacunosum, strate herbacée diversifiée → 3 ; strate bryolichénique peu dense à Syntrichia ou Tortella, végétation plus ouverte → 4",
   "3. Dominée par Ephedra distachya et/ou Rosa pimpinellifolia → 2.1a ; dominée par Helichrysum stoechas, Éphèdre et Rosier rares, sommet de butte → 2.1d",
   "4. Saupoudrage hivernal, sol en « millefeuille », Syntrichia ruralis subsp. ruraliformis → 2.1b ; pente décapée, Tortella squarrosa, Corynephorus canescens et Koeleria glauca → 2.1c",
   "Pelouse pauvre en oligotrophiles → 5. Ourlet fermé à Geranium sanguineum → 2.1e ; sinon → 6",
   "6. Fond de carrière ou ancienne culture, Sanguisorba minor dominant, taxons piétinés rares → 2.1f ; sinon → 7",
   "7. Camping ou chemin sur sable, Plantago coronopus, Cynodon dactylon, Sagina apetala → 2.1g ; voile d'annuelles à Lagurus ovatus et Bromus diandrus → 2.1h ; sables remaniés et enrichis à Glaucium flavum, Linaria arenaria, Carduus nutans → 2.1i"
  ]
 },
 {
  "id": "2.1c",
  "fiche": "2.1",
  "ordre": 11,
  "zone": "Dune grise",
  "rang": 5,
  "groupe": "Pelouses des dunes fixées",
  "nomFr": "Pelouses ouvertes des dunes fixées à Corynéphore blanchâtre",
  "nomFiche": "Pelouses des dunes grises",
  "syntaxon": "Grpt. dunaire à Corynephorus canescens et Helichrysum stoechas",
  "codes": {
   "eunis": "B1.42",
   "corine": "16.222",
   "eur28": "2130*",
   "cahiers": "2130*-2"
  },
  "nbReleves": 5,
  "especes": [
   {
    "latin": "Helichrysum stoechas subsp. stoechas",
    "fr": "Immortelle des dunes",
    "statut": "car",
    "constance": 100
   },
   {
    "latin": "Tortella squarrosa",
    "fr": "Tortella squarrosa (mousse)",
    "statut": "car",
    "constance": 100,
    "groupe": "bryolichenique"
   },
   {
    "latin": "Corynephorus canescens",
    "fr": "Corynéphore blanchâtre",
    "statut": "car",
    "constance": 100
   },
   {
    "latin": "Leontodon saxatilis",
    "fr": "Liondent des rochers",
    "statut": "freq",
    "constance": 100
   },
   {
    "latin": "Sanguisorba minor subsp. minor",
    "fr": "Petite pimprenelle",
    "statut": "freq",
    "constance": 100
   },
   {
    "latin": "Koeleria glauca",
    "fr": "Koelérie glauque",
    "statut": "car",
    "constance": 80
   },
   {
    "latin": "Mibora minima",
    "fr": "Mibora naine",
    "statut": "freq",
    "constance": 80
   },
   {
    "latin": "Syntrichia ruralis subsp. ruraliformis",
    "fr": "Syntrichia ruralis (mousse des dunes saupoudrées)",
    "statut": "freq",
    "constance": 80,
    "groupe": "bryolichenique"
   },
   {
    "latin": "Thymus drucei",
    "fr": "Thym de Bretagne",
    "statut": "freq",
    "constance": 80
   },
   {
    "latin": "Sedum acre",
    "fr": "Orpin âcre",
    "statut": "freq",
    "constance": 80
   },
   {
    "latin": "Saxifraga tridactylites",
    "fr": "Saxifrage à trois doigts",
    "statut": "freq",
    "constance": 80
   },
   {
    "latin": "Jasione montana subsp. montana",
    "fr": "Jasione des montagnes",
    "statut": "freq",
    "constance": 80
   },
   {
    "latin": "Cerastium diffusum subsp. diffusum",
    "fr": "Céraiste à quatre étamines",
    "statut": "freq",
    "constance": 60
   },
   {
    "latin": "Asperula cynanchica",
    "fr": "Aspérule à l'esquinancie",
    "statut": "freq",
    "constance": 60
   },
   {
    "latin": "Phleum arenarium",
    "fr": "Fléole des sables",
    "statut": "freq",
    "constance": 60
   },
   {
    "latin": "Eryngium campestre",
    "fr": "Panicaut champêtre",
    "statut": "freq",
    "constance": 60
   },
   {
    "latin": "Catapodium rigidum",
    "fr": "Catapode rigide",
    "statut": "freq",
    "constance": 40
   },
   {
    "latin": "Cerastium semidecandrum subsp. semidecandrum",
    "fr": "Céraiste à cinq étamines",
    "statut": "freq",
    "constance": 40
   },
   {
    "latin": "Festuca juncifolia",
    "fr": "Fétuque à feuilles de jonc",
    "statut": "freq",
    "constance": 40
   },
   {
    "latin": "Carex arenaria",
    "fr": "Laîche des sables",
    "statut": "freq",
    "constance": 40
   },
   {
    "latin": "Ephedra distachya subsp. distachya",
    "fr": "Éphèdre à deux épis (Raisin de mer)",
    "statut": "freq",
    "constance": 40
   },
   {
    "latin": "Silene otites subsp. otites",
    "fr": "Silène à oreillettes",
    "statut": "freq",
    "constance": 40
   },
   {
    "latin": "Tortella flavovirens",
    "fr": "Tortella flavovirens (mousse)",
    "statut": "freq",
    "constance": 40,
    "groupe": "bryolichenique"
   },
   {
    "latin": "Dianthus gallicus",
    "fr": "Œillet de France",
    "statut": "freq",
    "constance": 40
   },
   {
    "latin": "Lamium amplexicaule subsp. amplexicaule",
    "fr": "Lamier amplexicaule",
    "statut": "freq",
    "constance": 40
   },
   {
    "latin": "Galium arenarium",
    "fr": "Gaillet des sables",
    "statut": "freq",
    "constance": 40
   },
   {
    "latin": "Plantago lanceolata",
    "fr": "Plantain lancéolé",
    "statut": "freq",
    "constance": 40
   },
   {
    "latin": "Ononis repens",
    "fr": "Bugrane rampante",
    "statut": "freq",
    "constance": 40
   },
   {
    "latin": "Viola kitaibeliana",
    "fr": "Pensée de Kitaibel",
    "statut": "freq",
    "constance": 40
   },
   {
    "latin": "Senecio vulgaris",
    "fr": "Séneçon commun",
    "statut": "freq",
    "constance": 40
   }
  ],
  "description": "Pentes décapées mécaniquement, en bordure des carrières de sable : la végétation est en contact avec des couches plus profondes, probablement décalcifiées. Outre Corynephorus canescens, se distingue par la rareté des taxons calcicoles (Ephedra, Rosa pimpinellifolia, Galium arenarium, Euphorbia portlandica) et d'Hypnum cupressiforme. Strate bryolichénique ouverte à Tortella squarrosa.",
  "ecologie": "Intérieur des dunes, à l'abri des dunes mobiles. Apports de sable faibles, substrat plus ou moins fixé, mince couche humifère qui devient très sèche en été. Fortes amplitudes thermiques journalières ; les débris coquilliers apportent des bases, ce qui distingue ces dunes des sables intérieurs acides.",
  "physionomie": "Pelouses rases et très recouvrantes mêlant annuelles, vivaces et bryophytes, parfois ouvertes après un saupoudrage de sable hivernal. Fond spécifique commun : Sanguisorba minor, Carex arenaria, Hypnum cupressiforme var. lacunosum, Sedum acre, Cerastium diffusum, Thymus drucei, Euphorbia portlandica, Ononis repens, Mibora minima, Koeleria glauca, Arenaria serpyllifolia, Leontodon saxatilis.",
  "periode": "Visible toute l'année, optimum de floraison du printemps au début de l'été.",
  "confusions": "Les sous-unités sont floristiquement proches : Delassus en donne une clé, reprise ici. Retenir surtout : richesse en espèces oligotrophiles (Éphèdre, Rosier pimprenelle, Œillet de France, Aspérule…) pour les pelouses en bon état, contre présence de taxons de perturbation (Plantain corne-de-cerf, Lagure, Chiendent pied-de-poule…) pour les pelouses dégradées ou piétinées. La strate bryolichénique distingue les pelouses typiques (Hypnum) des pelouses saupoudrées (Syntrichia) et des pentes décapées (Tortella).",
  "dynamique": "Les pelouses proches du trait de côte sont quasi stables ; les plus internes évoluent vers les fourrés dunaires sur sol sec, d'autant plus vite qu'elles sont dégradées. Le piétinement fait passer les pelouses typiques aux pelouses des chemins non empierrés, processus réversible. Contact avec les dunes mobiles côté mer, les prairies et fourrés côté terre, et avec les dépressions dunaires.",
  "cle": [
   "Pelouse riche en espèces oligotrophiles (Ephedra distachya, Rosa pimpinellifolia, Dianthus gallicus, Asperula cynanchica, Thesium humifusum, Silene otites, Helichrysum stoechas…) → 2",
   "2. Strate bryolichénique fermée à Hypnum cupressiforme var. lacunosum, strate herbacée diversifiée → 3 ; strate bryolichénique peu dense à Syntrichia ou Tortella, végétation plus ouverte → 4",
   "3. Dominée par Ephedra distachya et/ou Rosa pimpinellifolia → 2.1a ; dominée par Helichrysum stoechas, Éphèdre et Rosier rares, sommet de butte → 2.1d",
   "4. Saupoudrage hivernal, sol en « millefeuille », Syntrichia ruralis subsp. ruraliformis → 2.1b ; pente décapée, Tortella squarrosa, Corynephorus canescens et Koeleria glauca → 2.1c",
   "Pelouse pauvre en oligotrophiles → 5. Ourlet fermé à Geranium sanguineum → 2.1e ; sinon → 6",
   "6. Fond de carrière ou ancienne culture, Sanguisorba minor dominant, taxons piétinés rares → 2.1f ; sinon → 7",
   "7. Camping ou chemin sur sable, Plantago coronopus, Cynodon dactylon, Sagina apetala → 2.1g ; voile d'annuelles à Lagurus ovatus et Bromus diandrus → 2.1h ; sables remaniés et enrichis à Glaucium flavum, Linaria arenaria, Carduus nutans → 2.1i"
  ]
 },
 {
  "id": "2.1d",
  "fiche": "2.1",
  "ordre": 12,
  "zone": "Dune grise",
  "rang": 5,
  "groupe": "Pelouses des dunes fixées",
  "nomFr": "Pelouses dunaires des buttes sèches",
  "nomFiche": "Pelouses des dunes grises",
  "syntaxon": "Thymo drucei - Helichrysetum stoechadis Géhu & Sissingh in Sissingh 1974 prov.",
  "codes": {
   "eunis": "B1.42",
   "corine": "16.222",
   "eur28": "2130*",
   "cahiers": "2130*-2"
  },
  "nbReleves": 4,
  "especes": [
   {
    "latin": "Hypnum cupressiforme var. lacunosum",
    "fr": "Hypnum cupressiforme (mousse des dunes grises)",
    "statut": "car",
    "constance": 100,
    "groupe": "bryolichenique"
   },
   {
    "latin": "Helichrysum stoechas subsp. stoechas",
    "fr": "Immortelle des dunes",
    "statut": "car",
    "constance": 100
   },
   {
    "latin": "Tortella squarrosa",
    "fr": "Tortella squarrosa (mousse)",
    "statut": "freq",
    "constance": 100,
    "groupe": "bryolichenique"
   },
   {
    "latin": "Mibora minima",
    "fr": "Mibora naine",
    "statut": "freq",
    "constance": 100
   },
   {
    "latin": "Sedum acre",
    "fr": "Orpin âcre",
    "statut": "freq",
    "constance": 100
   },
   {
    "latin": "Thymus drucei",
    "fr": "Thym de Bretagne",
    "statut": "car",
    "constance": 75
   },
   {
    "latin": "Sanguisorba minor subsp. minor",
    "fr": "Petite pimprenelle",
    "statut": "freq",
    "constance": 75
   },
   {
    "latin": "Carex arenaria",
    "fr": "Laîche des sables",
    "statut": "freq",
    "constance": 75
   },
   {
    "latin": "Hypochaeris radicata",
    "fr": "Porcelle enracinée",
    "statut": "freq",
    "constance": 75
   },
   {
    "latin": "Koeleria glauca",
    "fr": "Koelérie glauque",
    "statut": "freq",
    "constance": 75
   },
   {
    "latin": "Plantago lanceolata",
    "fr": "Plantain lancéolé",
    "statut": "freq",
    "constance": 75
   },
   {
    "latin": "Arenaria serpyllifolia",
    "fr": "Sabline à feuilles de serpolet",
    "statut": "freq",
    "constance": 75
   },
   {
    "latin": "Cerastium diffusum subsp. diffusum",
    "fr": "Céraiste à quatre étamines",
    "statut": "freq",
    "constance": 75
   },
   {
    "latin": "Cerastium semidecandrum subsp. semidecandrum",
    "fr": "Céraiste à cinq étamines",
    "statut": "freq",
    "constance": 75
   },
   {
    "latin": "Euphorbia portlandica",
    "fr": "Euphorbe de Portland",
    "statut": "freq",
    "constance": 75
   },
   {
    "latin": "Galium arenarium",
    "fr": "Gaillet des sables",
    "statut": "freq",
    "constance": 75
   },
   {
    "latin": "Saxifraga tridactylites",
    "fr": "Saxifrage à trois doigts",
    "statut": "freq",
    "constance": 75
   },
   {
    "latin": "Veronica arvensis",
    "fr": "Véronique des champs",
    "statut": "freq",
    "constance": 75
   },
   {
    "latin": "Eryngium campestre",
    "fr": "Panicaut champêtre",
    "statut": "freq",
    "constance": 75
   },
   {
    "latin": "Syntrichia ruralis subsp. ruraliformis",
    "fr": "Syntrichia ruralis (mousse des dunes saupoudrées)",
    "statut": "car",
    "constance": 50,
    "groupe": "bryolichenique"
   },
   {
    "latin": "Festuca rubra gr.",
    "fr": "Fétuque rouge (groupe)",
    "statut": "freq",
    "constance": 50
   },
   {
    "latin": "Hieracium pilosella",
    "fr": "Piloselle",
    "statut": "freq",
    "constance": 50
   },
   {
    "latin": "Ononis repens",
    "fr": "Bugrane rampante",
    "statut": "freq",
    "constance": 50
   },
   {
    "latin": "Asterolinon linum-stellatum",
    "fr": "Astérolinon",
    "statut": "freq",
    "constance": 50
   },
   {
    "latin": "Leontodon saxatilis",
    "fr": "Liondent des rochers",
    "statut": "freq",
    "constance": 50
   },
   {
    "latin": "Lotus corniculatus subsp. corniculatus",
    "fr": "Lotier corniculé",
    "statut": "freq",
    "constance": 50
   },
   {
    "latin": "Ranunculus bulbosus subsp. bulbosus",
    "fr": "Renoncule bulbeuse",
    "statut": "freq",
    "constance": 50
   },
   {
    "latin": "Senecio vulgaris",
    "fr": "Séneçon commun",
    "statut": "freq",
    "constance": 50
   },
   {
    "latin": "Geranium molle",
    "fr": "Géranium à feuilles molles",
    "statut": "freq",
    "constance": 50
   },
   {
    "latin": "Medicago lupulina",
    "fr": "Minette",
    "statut": "freq",
    "constance": 50
   },
   {
    "latin": "Ophrys passionis",
    "fr": "Ophrys de la Passion",
    "statut": "freq",
    "constance": 50
   },
   {
    "latin": "Senecio jacobaea",
    "fr": "Séneçon jacobée",
    "statut": "freq",
    "constance": 50
   },
   {
    "latin": "Lichen sp.",
    "fr": "Lichen (non déterminé)",
    "statut": "freq",
    "constance": 25,
    "groupe": "bryolichenique"
   },
   {
    "latin": "Anthyllis vulneraria",
    "fr": "Anthyllide vulnéraire",
    "statut": "freq",
    "constance": 25
   },
   {
    "latin": "Armeria maritima",
    "fr": "Armérie maritime",
    "statut": "freq",
    "constance": 25
   },
   {
    "latin": "Asperula cynanchica",
    "fr": "Aspérule à l'esquinancie",
    "statut": "freq",
    "constance": 25
   },
   {
    "latin": "Brachythecium albicans",
    "fr": "Brachythecium albicans (mousse)",
    "statut": "freq",
    "constance": 25,
    "groupe": "bryolichenique"
   },
   {
    "latin": "Cochlearia danica",
    "fr": "Cochléaire du Danemark",
    "statut": "freq",
    "constance": 25
   },
   {
    "latin": "Homalothecium lutescens",
    "fr": "Homalothecium lutescens (mousse)",
    "statut": "freq",
    "constance": 25,
    "groupe": "bryolichenique"
   },
   {
    "latin": "Linaria arenaria",
    "fr": "Linaire des sables",
    "statut": "freq",
    "constance": 25
   },
   {
    "latin": "Rosa pimpinellifolia",
    "fr": "Rosier pimprenelle",
    "statut": "freq",
    "constance": 25
   },
   {
    "latin": "Aira praecox",
    "fr": "Canche printanière",
    "statut": "freq",
    "constance": 25
   },
   {
    "latin": "Dianthus gallicus",
    "fr": "Œillet de France",
    "statut": "freq",
    "constance": 25
   },
   {
    "latin": "Lamium amplexicaule subsp. amplexicaule",
    "fr": "Lamier amplexicaule",
    "statut": "freq",
    "constance": 25
   },
   {
    "latin": "Myosotis ramosissima subsp. lebelii",
    "fr": "Myosotis de Lebel",
    "statut": "freq",
    "constance": 25
   },
   {
    "latin": "Taraxacum gr. erythrospermum",
    "fr": "Pissenlit à graines rouges (groupe)",
    "statut": "freq",
    "constance": 25
   },
   {
    "latin": "Thesium humifusum",
    "fr": "Thésium couché",
    "statut": "freq",
    "constance": 25
   },
   {
    "latin": "Viola kitaibeliana",
    "fr": "Pensée de Kitaibel",
    "statut": "freq",
    "constance": 25
   }
  ],
  "description": "Buttes les plus sèches et secteurs historiquement érodés. Un peu plus ouvertes que les pelouses typiques, elles se distinguent par l'absence ou la grande rareté d'Ephedra distachya, Rosa pimpinellifolia, Dianthus gallicus et Asperula cynanchica ; Helichrysum stoechas est très présent, Corynephorus canescens absent.",
  "ecologie": "Intérieur des dunes, à l'abri des dunes mobiles. Apports de sable faibles, substrat plus ou moins fixé, mince couche humifère qui devient très sèche en été. Fortes amplitudes thermiques journalières ; les débris coquilliers apportent des bases, ce qui distingue ces dunes des sables intérieurs acides.",
  "physionomie": "Pelouses rases et très recouvrantes mêlant annuelles, vivaces et bryophytes, parfois ouvertes après un saupoudrage de sable hivernal. Fond spécifique commun : Sanguisorba minor, Carex arenaria, Hypnum cupressiforme var. lacunosum, Sedum acre, Cerastium diffusum, Thymus drucei, Euphorbia portlandica, Ononis repens, Mibora minima, Koeleria glauca, Arenaria serpyllifolia, Leontodon saxatilis.",
  "periode": "Visible toute l'année, optimum de floraison du printemps au début de l'été.",
  "confusions": "Les sous-unités sont floristiquement proches : Delassus en donne une clé, reprise ici. Retenir surtout : richesse en espèces oligotrophiles (Éphèdre, Rosier pimprenelle, Œillet de France, Aspérule…) pour les pelouses en bon état, contre présence de taxons de perturbation (Plantain corne-de-cerf, Lagure, Chiendent pied-de-poule…) pour les pelouses dégradées ou piétinées. La strate bryolichénique distingue les pelouses typiques (Hypnum) des pelouses saupoudrées (Syntrichia) et des pentes décapées (Tortella).",
  "dynamique": "Les pelouses proches du trait de côte sont quasi stables ; les plus internes évoluent vers les fourrés dunaires sur sol sec, d'autant plus vite qu'elles sont dégradées. Le piétinement fait passer les pelouses typiques aux pelouses des chemins non empierrés, processus réversible. Contact avec les dunes mobiles côté mer, les prairies et fourrés côté terre, et avec les dépressions dunaires.",
  "cle": [
   "Pelouse riche en espèces oligotrophiles (Ephedra distachya, Rosa pimpinellifolia, Dianthus gallicus, Asperula cynanchica, Thesium humifusum, Silene otites, Helichrysum stoechas…) → 2",
   "2. Strate bryolichénique fermée à Hypnum cupressiforme var. lacunosum, strate herbacée diversifiée → 3 ; strate bryolichénique peu dense à Syntrichia ou Tortella, végétation plus ouverte → 4",
   "3. Dominée par Ephedra distachya et/ou Rosa pimpinellifolia → 2.1a ; dominée par Helichrysum stoechas, Éphèdre et Rosier rares, sommet de butte → 2.1d",
   "4. Saupoudrage hivernal, sol en « millefeuille », Syntrichia ruralis subsp. ruraliformis → 2.1b ; pente décapée, Tortella squarrosa, Corynephorus canescens et Koeleria glauca → 2.1c",
   "Pelouse pauvre en oligotrophiles → 5. Ourlet fermé à Geranium sanguineum → 2.1e ; sinon → 6",
   "6. Fond de carrière ou ancienne culture, Sanguisorba minor dominant, taxons piétinés rares → 2.1f ; sinon → 7",
   "7. Camping ou chemin sur sable, Plantago coronopus, Cynodon dactylon, Sagina apetala → 2.1g ; voile d'annuelles à Lagurus ovatus et Bromus diandrus → 2.1h ; sables remaniés et enrichis à Glaucium flavum, Linaria arenaria, Carduus nutans → 2.1i"
  ]
 },
 {
  "id": "2.1e",
  "fiche": "2.1",
  "ordre": 13,
  "zone": "Dune grise",
  "rang": 5,
  "groupe": "Pelouses des dunes fixées",
  "nomFr": "Pelouses et ourlets des dunes fixées à Géranium sanguin",
  "nomFiche": "Pelouses des dunes grises",
  "syntaxon": "Grpt. à Geranium sanguineum et Carex arenaria in Demartini 2016",
  "codes": {
   "eunis": "B1.42",
   "corine": "16.222",
   "eur28": "2130*",
   "cahiers": "2130*-2"
  },
  "nbReleves": 2,
  "especes": [
   {
    "latin": "Hypnum cupressiforme var. lacunosum",
    "fr": "Hypnum cupressiforme (mousse des dunes grises)",
    "statut": "car",
    "constance": 100,
    "groupe": "bryolichenique"
   },
   {
    "latin": "Geranium sanguineum",
    "fr": "Géranium sanguin",
    "statut": "car",
    "constance": 100
   },
   {
    "latin": "Lotus corniculatus subsp. corniculatus",
    "fr": "Lotier corniculé",
    "statut": "freq",
    "constance": 100
   },
   {
    "latin": "Thymus drucei",
    "fr": "Thym de Bretagne",
    "statut": "freq",
    "constance": 100
   },
   {
    "latin": "Koeleria glauca",
    "fr": "Koelérie glauque",
    "statut": "freq",
    "constance": 100
   },
   {
    "latin": "Hieracium pilosella",
    "fr": "Piloselle",
    "statut": "freq",
    "constance": 100
   },
   {
    "latin": "Plantago lanceolata",
    "fr": "Plantain lancéolé",
    "statut": "freq",
    "constance": 100
   },
   {
    "latin": "Carex arenaria",
    "fr": "Laîche des sables",
    "statut": "car",
    "constance": 100
   },
   {
    "latin": "Hypochaeris radicata",
    "fr": "Porcelle enracinée",
    "statut": "freq",
    "constance": 100
   },
   {
    "latin": "Thesium humifusum",
    "fr": "Thésium couché",
    "statut": "freq",
    "constance": 100
   },
   {
    "latin": "Anthyllis vulneraria",
    "fr": "Anthyllide vulnéraire",
    "statut": "freq",
    "constance": 50
   },
   {
    "latin": "Festuca rubra gr.",
    "fr": "Fétuque rouge (groupe)",
    "statut": "freq",
    "constance": 50
   },
   {
    "latin": "Sedum acre",
    "fr": "Orpin âcre",
    "statut": "freq",
    "constance": 50
   },
   {
    "latin": "Asterolinon linum-stellatum",
    "fr": "Astérolinon",
    "statut": "freq",
    "constance": 50
   },
   {
    "latin": "Bupleurum baldense subsp. baldense",
    "fr": "Buplèvre du mont Baldo",
    "statut": "freq",
    "constance": 50
   },
   {
    "latin": "Medicago lupulina",
    "fr": "Minette",
    "statut": "freq",
    "constance": 50
   },
   {
    "latin": "Tortella squarrosa",
    "fr": "Tortella squarrosa (mousse)",
    "statut": "freq",
    "constance": 50,
    "groupe": "bryolichenique"
   },
   {
    "latin": "Arenaria serpyllifolia",
    "fr": "Sabline à feuilles de serpolet",
    "statut": "freq",
    "constance": 50
   },
   {
    "latin": "Armeria maritima",
    "fr": "Armérie maritime",
    "statut": "freq",
    "constance": 50
   },
   {
    "latin": "Asperula cynanchica",
    "fr": "Aspérule à l'esquinancie",
    "statut": "freq",
    "constance": 50
   },
   {
    "latin": "Cerastium diffusum subsp. diffusum",
    "fr": "Céraiste à quatre étamines",
    "statut": "freq",
    "constance": 50
   },
   {
    "latin": "Cochlearia danica",
    "fr": "Cochléaire du Danemark",
    "statut": "freq",
    "constance": 50
   },
   {
    "latin": "Eryngium campestre",
    "fr": "Panicaut champêtre",
    "statut": "freq",
    "constance": 50
   },
   {
    "latin": "Leontodon saxatilis",
    "fr": "Liondent des rochers",
    "statut": "freq",
    "constance": 50
   },
   {
    "latin": "Medicago minima",
    "fr": "Luzerne naine",
    "statut": "freq",
    "constance": 50
   },
   {
    "latin": "Myosotis ramosissima subsp. lebelii",
    "fr": "Myosotis de Lebel",
    "statut": "freq",
    "constance": 50
   },
   {
    "latin": "Sanguisorba minor subsp. minor",
    "fr": "Petite pimprenelle",
    "statut": "freq",
    "constance": 50
   },
   {
    "latin": "Helichrysum stoechas subsp. stoechas",
    "fr": "Immortelle des dunes",
    "statut": "freq",
    "constance": 50
   },
   {
    "latin": "Linaria arenaria",
    "fr": "Linaire des sables",
    "statut": "freq",
    "constance": 50
   }
  ],
  "description": "Ourlets peu élevés succédant aux pelouses typiques, encore riches en espèces, dominés par Geranium sanguineum et Hypnum cupressiforme var. lacunosum, avec Carex arenaria, Thymus drucei et Festuca juncifolia. Les taxons les plus caractéristiques des pelouses précédentes sont rares ou absents.",
  "ecologie": "Intérieur des dunes, à l'abri des dunes mobiles. Apports de sable faibles, substrat plus ou moins fixé, mince couche humifère qui devient très sèche en été. Fortes amplitudes thermiques journalières ; les débris coquilliers apportent des bases, ce qui distingue ces dunes des sables intérieurs acides.",
  "physionomie": "Pelouses rases et très recouvrantes mêlant annuelles, vivaces et bryophytes, parfois ouvertes après un saupoudrage de sable hivernal. Fond spécifique commun : Sanguisorba minor, Carex arenaria, Hypnum cupressiforme var. lacunosum, Sedum acre, Cerastium diffusum, Thymus drucei, Euphorbia portlandica, Ononis repens, Mibora minima, Koeleria glauca, Arenaria serpyllifolia, Leontodon saxatilis.",
  "periode": "Visible toute l'année, optimum de floraison du printemps au début de l'été.",
  "confusions": "Les sous-unités sont floristiquement proches : Delassus en donne une clé, reprise ici. Retenir surtout : richesse en espèces oligotrophiles (Éphèdre, Rosier pimprenelle, Œillet de France, Aspérule…) pour les pelouses en bon état, contre présence de taxons de perturbation (Plantain corne-de-cerf, Lagure, Chiendent pied-de-poule…) pour les pelouses dégradées ou piétinées. La strate bryolichénique distingue les pelouses typiques (Hypnum) des pelouses saupoudrées (Syntrichia) et des pentes décapées (Tortella).",
  "dynamique": "Les pelouses proches du trait de côte sont quasi stables ; les plus internes évoluent vers les fourrés dunaires sur sol sec, d'autant plus vite qu'elles sont dégradées. Le piétinement fait passer les pelouses typiques aux pelouses des chemins non empierrés, processus réversible. Contact avec les dunes mobiles côté mer, les prairies et fourrés côté terre, et avec les dépressions dunaires.",
  "cle": [
   "Pelouse riche en espèces oligotrophiles (Ephedra distachya, Rosa pimpinellifolia, Dianthus gallicus, Asperula cynanchica, Thesium humifusum, Silene otites, Helichrysum stoechas…) → 2",
   "2. Strate bryolichénique fermée à Hypnum cupressiforme var. lacunosum, strate herbacée diversifiée → 3 ; strate bryolichénique peu dense à Syntrichia ou Tortella, végétation plus ouverte → 4",
   "3. Dominée par Ephedra distachya et/ou Rosa pimpinellifolia → 2.1a ; dominée par Helichrysum stoechas, Éphèdre et Rosier rares, sommet de butte → 2.1d",
   "4. Saupoudrage hivernal, sol en « millefeuille », Syntrichia ruralis subsp. ruraliformis → 2.1b ; pente décapée, Tortella squarrosa, Corynephorus canescens et Koeleria glauca → 2.1c",
   "Pelouse pauvre en oligotrophiles → 5. Ourlet fermé à Geranium sanguineum → 2.1e ; sinon → 6",
   "6. Fond de carrière ou ancienne culture, Sanguisorba minor dominant, taxons piétinés rares → 2.1f ; sinon → 7",
   "7. Camping ou chemin sur sable, Plantago coronopus, Cynodon dactylon, Sagina apetala → 2.1g ; voile d'annuelles à Lagurus ovatus et Bromus diandrus → 2.1h ; sables remaniés et enrichis à Glaucium flavum, Linaria arenaria, Carduus nutans → 2.1i"
  ]
 },
 {
  "id": "2.1f",
  "fiche": "2.1",
  "ordre": 14,
  "zone": "Dune grise",
  "rang": 5,
  "groupe": "Pelouses des dunes fixées",
  "nomFr": "Pelouses dégradées des dunes fixées",
  "nomFiche": "Pelouses des dunes grises",
  "syntaxon": "BC Sanguisorba minor - Hypnum cupressiforme var. lacunosum [Euphorbio portlandicae - Helichrysion stoechadis]",
  "codes": {
   "eunis": "B1.42",
   "corine": "16.222",
   "eur28": "2130*",
   "cahiers": "2130*-2"
  },
  "nbReleves": 4,
  "especes": [
   {
    "latin": "Hypnum cupressiforme var. lacunosum",
    "fr": "Hypnum cupressiforme (mousse des dunes grises)",
    "statut": "car",
    "constance": 100,
    "groupe": "bryolichenique"
   },
   {
    "latin": "Sanguisorba minor subsp. minor",
    "fr": "Petite pimprenelle",
    "statut": "car",
    "constance": 100
   },
   {
    "latin": "Sedum acre",
    "fr": "Orpin âcre",
    "statut": "freq",
    "constance": 100
   },
   {
    "latin": "Thymus drucei",
    "fr": "Thym de Bretagne",
    "statut": "freq",
    "constance": 100
   },
   {
    "latin": "Ononis repens",
    "fr": "Bugrane rampante",
    "statut": "freq",
    "constance": 100
   },
   {
    "latin": "Asterolinon linum-stellatum",
    "fr": "Astérolinon",
    "statut": "freq",
    "constance": 100
   },
   {
    "latin": "Cochlearia danica",
    "fr": "Cochléaire du Danemark",
    "statut": "freq",
    "constance": 100
   },
   {
    "latin": "Geranium molle",
    "fr": "Géranium à feuilles molles",
    "statut": "freq",
    "constance": 100
   },
   {
    "latin": "Euphorbia portlandica",
    "fr": "Euphorbe de Portland",
    "statut": "freq",
    "constance": 100
   },
   {
    "latin": "Myosotis ramosissima subsp. lebelii",
    "fr": "Myosotis de Lebel",
    "statut": "freq",
    "constance": 100
   },
   {
    "latin": "Taraxacum gr. erythrospermum",
    "fr": "Pissenlit à graines rouges (groupe)",
    "statut": "freq",
    "constance": 100
   },
   {
    "latin": "Plantago lanceolata",
    "fr": "Plantain lancéolé",
    "statut": "freq",
    "constance": 75
   },
   {
    "latin": "Festuca rubra gr.",
    "fr": "Fétuque rouge (groupe)",
    "statut": "freq",
    "constance": 75
   },
   {
    "latin": "Mibora minima",
    "fr": "Mibora naine",
    "statut": "freq",
    "constance": 75
   },
   {
    "latin": "Viola kitaibeliana",
    "fr": "Pensée de Kitaibel",
    "statut": "freq",
    "constance": 75
   },
   {
    "latin": "Arenaria serpyllifolia",
    "fr": "Sabline à feuilles de serpolet",
    "statut": "freq",
    "constance": 75
   },
   {
    "latin": "Hieracium pilosella",
    "fr": "Piloselle",
    "statut": "freq",
    "constance": 75
   },
   {
    "latin": "Carex arenaria",
    "fr": "Laîche des sables",
    "statut": "freq",
    "constance": 75
   },
   {
    "latin": "Cerastium diffusum subsp. diffusum",
    "fr": "Céraiste à quatre étamines",
    "statut": "freq",
    "constance": 75
   },
   {
    "latin": "Veronica arvensis",
    "fr": "Véronique des champs",
    "statut": "freq",
    "constance": 75
   },
   {
    "latin": "Senecio jacobaea",
    "fr": "Séneçon jacobée",
    "statut": "freq",
    "constance": 75
   },
   {
    "latin": "Lotus corniculatus subsp. corniculatus",
    "fr": "Lotier corniculé",
    "statut": "freq",
    "constance": 50
   },
   {
    "latin": "Koeleria glauca",
    "fr": "Koelérie glauque",
    "statut": "freq",
    "constance": 50
   },
   {
    "latin": "Lichen sp.",
    "fr": "Lichen (non déterminé)",
    "statut": "freq",
    "constance": 50,
    "groupe": "bryolichenique"
   },
   {
    "latin": "Tortella squarrosa",
    "fr": "Tortella squarrosa (mousse)",
    "statut": "freq",
    "constance": 50,
    "groupe": "bryolichenique"
   },
   {
    "latin": "Aira praecox",
    "fr": "Canche printanière",
    "statut": "freq",
    "constance": 50
   },
   {
    "latin": "Armeria maritima",
    "fr": "Armérie maritime",
    "statut": "freq",
    "constance": 50
   },
   {
    "latin": "Lamium amplexicaule subsp. amplexicaule",
    "fr": "Lamier amplexicaule",
    "statut": "freq",
    "constance": 50
   },
   {
    "latin": "Senecio vulgaris",
    "fr": "Séneçon commun",
    "statut": "freq",
    "constance": 50
   },
   {
    "latin": "Dianthus gallicus",
    "fr": "Œillet de France",
    "statut": "freq",
    "constance": 50
   },
   {
    "latin": "Eryngium campestre",
    "fr": "Panicaut champêtre",
    "statut": "freq",
    "constance": 50
   },
   {
    "latin": "Pseudoscleropodium purum",
    "fr": "Pseudoscleropodium purum (mousse)",
    "statut": "freq",
    "constance": 25,
    "groupe": "bryolichenique"
   },
   {
    "latin": "Helichrysum stoechas subsp. stoechas",
    "fr": "Immortelle des dunes",
    "statut": "freq",
    "constance": 25
   },
   {
    "latin": "Homalothecium lutescens",
    "fr": "Homalothecium lutescens (mousse)",
    "statut": "freq",
    "constance": 25,
    "groupe": "bryolichenique"
   },
   {
    "latin": "Rosa pimpinellifolia",
    "fr": "Rosier pimprenelle",
    "statut": "freq",
    "constance": 25
   },
   {
    "latin": "Hypochaeris radicata",
    "fr": "Porcelle enracinée",
    "statut": "freq",
    "constance": 25
   },
   {
    "latin": "Anthyllis vulneraria",
    "fr": "Anthyllide vulnéraire",
    "statut": "freq",
    "constance": 25
   },
   {
    "latin": "Asperula cynanchica",
    "fr": "Aspérule à l'esquinancie",
    "statut": "freq",
    "constance": 25
   },
   {
    "latin": "Bupleurum baldense subsp. baldense",
    "fr": "Buplèvre du mont Baldo",
    "statut": "freq",
    "constance": 25
   },
   {
    "latin": "Leontodon saxatilis",
    "fr": "Liondent des rochers",
    "statut": "freq",
    "constance": 25
   },
   {
    "latin": "Medicago minima",
    "fr": "Luzerne naine",
    "statut": "freq",
    "constance": 25
   },
   {
    "latin": "Saxifraga tridactylites",
    "fr": "Saxifrage à trois doigts",
    "statut": "freq",
    "constance": 25
   },
   {
    "latin": "Ophrys passionis",
    "fr": "Ophrys de la Passion",
    "statut": "freq",
    "constance": 25
   },
   {
    "latin": "Ranunculus bulbosus subsp. bulbosus",
    "fr": "Renoncule bulbeuse",
    "statut": "freq",
    "constance": 25
   }
  ],
  "description": "Secteurs fortement perturbés : fonds de carrières, anciennes cultures, zones anciennement très fréquentées. Absence ou grande rareté des oligotrophiles (Éphèdre, Rosier pimprenelle, Œillet de France, Aspérule, Thésium, Silène…). Enrichissement par des taxons peu caractéristiques des dunes : Senecio jacobaea, Bellis perennis, Holcus lanatus, Poa pratensis, Potentilla reptans. Faciès à Ammophila arenaria possibles.",
  "ecologie": "Intérieur des dunes, à l'abri des dunes mobiles. Apports de sable faibles, substrat plus ou moins fixé, mince couche humifère qui devient très sèche en été. Fortes amplitudes thermiques journalières ; les débris coquilliers apportent des bases, ce qui distingue ces dunes des sables intérieurs acides.",
  "physionomie": "Pelouses rases et très recouvrantes mêlant annuelles, vivaces et bryophytes, parfois ouvertes après un saupoudrage de sable hivernal. Fond spécifique commun : Sanguisorba minor, Carex arenaria, Hypnum cupressiforme var. lacunosum, Sedum acre, Cerastium diffusum, Thymus drucei, Euphorbia portlandica, Ononis repens, Mibora minima, Koeleria glauca, Arenaria serpyllifolia, Leontodon saxatilis.",
  "periode": "Visible toute l'année, optimum de floraison du printemps au début de l'été.",
  "confusions": "Les sous-unités sont floristiquement proches : Delassus en donne une clé, reprise ici. Retenir surtout : richesse en espèces oligotrophiles (Éphèdre, Rosier pimprenelle, Œillet de France, Aspérule…) pour les pelouses en bon état, contre présence de taxons de perturbation (Plantain corne-de-cerf, Lagure, Chiendent pied-de-poule…) pour les pelouses dégradées ou piétinées. La strate bryolichénique distingue les pelouses typiques (Hypnum) des pelouses saupoudrées (Syntrichia) et des pentes décapées (Tortella).",
  "dynamique": "Les pelouses proches du trait de côte sont quasi stables ; les plus internes évoluent vers les fourrés dunaires sur sol sec, d'autant plus vite qu'elles sont dégradées. Le piétinement fait passer les pelouses typiques aux pelouses des chemins non empierrés, processus réversible. Contact avec les dunes mobiles côté mer, les prairies et fourrés côté terre, et avec les dépressions dunaires.",
  "cle": [
   "Pelouse riche en espèces oligotrophiles (Ephedra distachya, Rosa pimpinellifolia, Dianthus gallicus, Asperula cynanchica, Thesium humifusum, Silene otites, Helichrysum stoechas…) → 2",
   "2. Strate bryolichénique fermée à Hypnum cupressiforme var. lacunosum, strate herbacée diversifiée → 3 ; strate bryolichénique peu dense à Syntrichia ou Tortella, végétation plus ouverte → 4",
   "3. Dominée par Ephedra distachya et/ou Rosa pimpinellifolia → 2.1a ; dominée par Helichrysum stoechas, Éphèdre et Rosier rares, sommet de butte → 2.1d",
   "4. Saupoudrage hivernal, sol en « millefeuille », Syntrichia ruralis subsp. ruraliformis → 2.1b ; pente décapée, Tortella squarrosa, Corynephorus canescens et Koeleria glauca → 2.1c",
   "Pelouse pauvre en oligotrophiles → 5. Ourlet fermé à Geranium sanguineum → 2.1e ; sinon → 6",
   "6. Fond de carrière ou ancienne culture, Sanguisorba minor dominant, taxons piétinés rares → 2.1f ; sinon → 7",
   "7. Camping ou chemin sur sable, Plantago coronopus, Cynodon dactylon, Sagina apetala → 2.1g ; voile d'annuelles à Lagurus ovatus et Bromus diandrus → 2.1h ; sables remaniés et enrichis à Glaucium flavum, Linaria arenaria, Carduus nutans → 2.1i"
  ]
 },
 {
  "id": "2.1g",
  "fiche": "2.1",
  "ordre": 15,
  "zone": "Dune grise",
  "rang": 5,
  "groupe": "Pelouses des dunes fixées",
  "nomFr": "Pelouses des chemins non empierrés et lieux piétinés",
  "nomFiche": "Pelouses des dunes grises",
  "syntaxon": "Polycarpion tetraphylli Rivas-Martínez 1975",
  "codes": {
   "eunis": "B1.42",
   "corine": "16.222",
   "eur28": "2130*",
   "cahiers": "2130*-2"
  },
  "nbReleves": 8,
  "especes": [
   {
    "latin": "Plantago coronopus subsp. coronopus",
    "fr": "Plantain corne-de-cerf",
    "statut": "car",
    "constance": 100
   },
   {
    "latin": "Cerastium diffusum subsp. diffusum",
    "fr": "Céraiste à quatre étamines",
    "statut": "car",
    "constance": 88
   },
   {
    "latin": "Carex arenaria",
    "fr": "Laîche des sables",
    "statut": "car",
    "constance": 75
   },
   {
    "latin": "Thymus drucei",
    "fr": "Thym de Bretagne",
    "statut": "freq",
    "constance": 63
   },
   {
    "latin": "Plantago lanceolata",
    "fr": "Plantain lancéolé",
    "statut": "freq",
    "constance": 63
   },
   {
    "latin": "Bromus hordeaceus subsp. hordeaceus",
    "fr": "Brome mou",
    "statut": "freq",
    "constance": 50
   },
   {
    "latin": "Bellis perennis subsp. perennis",
    "fr": "Pâquerette",
    "statut": "freq",
    "constance": 50
   },
   {
    "latin": "Catapodium rigidum",
    "fr": "Catapode rigide",
    "statut": "freq",
    "constance": 50
   },
   {
    "latin": "Sedum acre",
    "fr": "Orpin âcre",
    "statut": "freq",
    "constance": 50
   },
   {
    "latin": "Mibora minima",
    "fr": "Mibora naine",
    "statut": "freq",
    "constance": 50
   },
   {
    "latin": "Cynodon dactylon",
    "fr": "Chiendent pied-de-poule",
    "statut": "car",
    "constance": 38
   },
   {
    "latin": "Juncus bufonius",
    "fr": "Jonc des crapauds",
    "statut": "freq",
    "constance": 38
   },
   {
    "latin": "Poa annua",
    "fr": "Pâturin annuel",
    "statut": "car",
    "constance": 38
   },
   {
    "latin": "Sagina apetala",
    "fr": "Sagine apétale",
    "statut": "car",
    "constance": 38
   },
   {
    "latin": "Anagallis arvensis",
    "fr": "Mouron rouge",
    "statut": "freq",
    "constance": 38
   },
   {
    "latin": "Arenaria serpyllifolia",
    "fr": "Sabline à feuilles de serpolet",
    "statut": "freq",
    "constance": 38
   },
   {
    "latin": "Geranium molle",
    "fr": "Géranium à feuilles molles",
    "statut": "freq",
    "constance": 38
   },
   {
    "latin": "Medicago minima",
    "fr": "Luzerne naine",
    "statut": "freq",
    "constance": 38
   },
   {
    "latin": "Saxifraga tridactylites",
    "fr": "Saxifrage à trois doigts",
    "statut": "freq",
    "constance": 38
   },
   {
    "latin": "Hypochaeris radicata",
    "fr": "Porcelle enracinée",
    "statut": "freq",
    "constance": 38
   },
   {
    "latin": "Senecio vulgaris",
    "fr": "Séneçon commun",
    "statut": "freq",
    "constance": 38
   },
   {
    "latin": "Ptychostomum imbricatulum",
    "fr": "Ptychostomum imbricatulum (mousse)",
    "statut": "freq",
    "constance": 25,
    "groupe": "bryolichenique"
   },
   {
    "latin": "Trifolium suffocatum",
    "fr": "Trèfle étouffé",
    "statut": "freq",
    "constance": 25
   },
   {
    "latin": "Festuca rubra gr.",
    "fr": "Fétuque rouge (groupe)",
    "statut": "freq",
    "constance": 25
   },
   {
    "latin": "Parentucellia latifolia",
    "fr": "Parentucelle à larges feuilles",
    "statut": "freq",
    "constance": 25
   },
   {
    "latin": "Tortella squarrosa",
    "fr": "Tortella squarrosa (mousse)",
    "statut": "freq",
    "constance": 25,
    "groupe": "bryolichenique"
   },
   {
    "latin": "Ephedra distachya subsp. distachya",
    "fr": "Éphèdre à deux épis (Raisin de mer)",
    "statut": "freq",
    "constance": 25
   },
   {
    "latin": "Veronica arvensis",
    "fr": "Véronique des champs",
    "statut": "freq",
    "constance": 25
   }
  ],
  "description": "Chemins et lieux piétinés (campings) à l'intérieur du massif, sur substrat resté sableux : l'évolution depuis la pelouse typique est due à la seule fréquentation et reste réversible. Rareté des taxons des pelouses typiques, présence voire dominance de Plantago coronopus avec Cynodon dactylon, Anagallis arvensis, Parentucellia latifolia, Sagina apetala, Juncus bufonius, Poa annua, Poa bulbosa, Trifolium ornithopodioides, Trifolium suffocatum.",
  "ecologie": "Intérieur des dunes, à l'abri des dunes mobiles. Apports de sable faibles, substrat plus ou moins fixé, mince couche humifère qui devient très sèche en été. Fortes amplitudes thermiques journalières ; les débris coquilliers apportent des bases, ce qui distingue ces dunes des sables intérieurs acides.",
  "physionomie": "Pelouses rases et très recouvrantes mêlant annuelles, vivaces et bryophytes, parfois ouvertes après un saupoudrage de sable hivernal. Fond spécifique commun : Sanguisorba minor, Carex arenaria, Hypnum cupressiforme var. lacunosum, Sedum acre, Cerastium diffusum, Thymus drucei, Euphorbia portlandica, Ononis repens, Mibora minima, Koeleria glauca, Arenaria serpyllifolia, Leontodon saxatilis.",
  "periode": "Visible toute l'année, optimum de floraison du printemps au début de l'été.",
  "confusions": "Les sous-unités sont floristiquement proches : Delassus en donne une clé, reprise ici. Retenir surtout : richesse en espèces oligotrophiles (Éphèdre, Rosier pimprenelle, Œillet de France, Aspérule…) pour les pelouses en bon état, contre présence de taxons de perturbation (Plantain corne-de-cerf, Lagure, Chiendent pied-de-poule…) pour les pelouses dégradées ou piétinées. La strate bryolichénique distingue les pelouses typiques (Hypnum) des pelouses saupoudrées (Syntrichia) et des pentes décapées (Tortella).",
  "dynamique": "Les pelouses proches du trait de côte sont quasi stables ; les plus internes évoluent vers les fourrés dunaires sur sol sec, d'autant plus vite qu'elles sont dégradées. Le piétinement fait passer les pelouses typiques aux pelouses des chemins non empierrés, processus réversible. Contact avec les dunes mobiles côté mer, les prairies et fourrés côté terre, et avec les dépressions dunaires.",
  "cle": [
   "Pelouse riche en espèces oligotrophiles (Ephedra distachya, Rosa pimpinellifolia, Dianthus gallicus, Asperula cynanchica, Thesium humifusum, Silene otites, Helichrysum stoechas…) → 2",
   "2. Strate bryolichénique fermée à Hypnum cupressiforme var. lacunosum, strate herbacée diversifiée → 3 ; strate bryolichénique peu dense à Syntrichia ou Tortella, végétation plus ouverte → 4",
   "3. Dominée par Ephedra distachya et/ou Rosa pimpinellifolia → 2.1a ; dominée par Helichrysum stoechas, Éphèdre et Rosier rares, sommet de butte → 2.1d",
   "4. Saupoudrage hivernal, sol en « millefeuille », Syntrichia ruralis subsp. ruraliformis → 2.1b ; pente décapée, Tortella squarrosa, Corynephorus canescens et Koeleria glauca → 2.1c",
   "Pelouse pauvre en oligotrophiles → 5. Ourlet fermé à Geranium sanguineum → 2.1e ; sinon → 6",
   "6. Fond de carrière ou ancienne culture, Sanguisorba minor dominant, taxons piétinés rares → 2.1f ; sinon → 7",
   "7. Camping ou chemin sur sable, Plantago coronopus, Cynodon dactylon, Sagina apetala → 2.1g ; voile d'annuelles à Lagurus ovatus et Bromus diandrus → 2.1h ; sables remaniés et enrichis à Glaucium flavum, Linaria arenaria, Carduus nutans → 2.1i"
  ]
 },
 {
  "id": "2.1h",
  "fiche": "2.1",
  "ordre": 16,
  "zone": "Dune grise",
  "rang": 5,
  "groupe": "Pelouses des dunes fixées",
  "nomFr": "Voiles annuels des dunes fixées à Lagure ovale",
  "nomFiche": "Pelouses des dunes grises",
  "syntaxon": "Laguro ovati - Brometum rigidi Géhu & Géhu-Franck 1985",
  "codes": {
   "eunis": "B1.42",
   "corine": "16.222",
   "eur28": "2130*",
   "cahiers": "2130*-2"
  },
  "nbReleves": 2,
  "especes": [
   {
    "latin": "Hypnum cupressiforme var. lacunosum",
    "fr": "Hypnum cupressiforme (mousse des dunes grises)",
    "statut": "car",
    "constance": 100,
    "groupe": "bryolichenique"
   },
   {
    "latin": "Lagurus ovatus",
    "fr": "Lagure ovale (Queue-de-lièvre)",
    "statut": "car",
    "constance": 100
   },
   {
    "latin": "Tortella squarrosa",
    "fr": "Tortella squarrosa (mousse)",
    "statut": "freq",
    "constance": 100,
    "groupe": "bryolichenique"
   },
   {
    "latin": "Homalothecium lutescens",
    "fr": "Homalothecium lutescens (mousse)",
    "statut": "freq",
    "constance": 100,
    "groupe": "bryolichenique"
   },
   {
    "latin": "Cerastium diffusum subsp. diffusum",
    "fr": "Céraiste à quatre étamines",
    "statut": "freq",
    "constance": 100
   },
   {
    "latin": "Bromus hordeaceus subsp. hordeaceus",
    "fr": "Brome mou",
    "statut": "freq",
    "constance": 100
   },
   {
    "latin": "Euphorbia portlandica",
    "fr": "Euphorbe de Portland",
    "statut": "freq",
    "constance": 100
   },
   {
    "latin": "Bromus diandrus subsp. diandrus",
    "fr": "Brome à deux étamines",
    "statut": "car",
    "constance": 50
   },
   {
    "latin": "Bromus diandrus subsp. maximus",
    "fr": "Grand brome des sables",
    "statut": "car",
    "constance": 50
   },
   {
    "latin": "Carex arenaria",
    "fr": "Laîche des sables",
    "statut": "freq",
    "constance": 50
   },
   {
    "latin": "Ephedra distachya subsp. distachya",
    "fr": "Éphèdre à deux épis (Raisin de mer)",
    "statut": "freq",
    "constance": 50
   },
   {
    "latin": "Festuca rubra gr.",
    "fr": "Fétuque rouge (groupe)",
    "statut": "freq",
    "constance": 50
   },
   {
    "latin": "Sedum acre",
    "fr": "Orpin âcre",
    "statut": "freq",
    "constance": 50
   },
   {
    "latin": "Arenaria serpyllifolia",
    "fr": "Sabline à feuilles de serpolet",
    "statut": "freq",
    "constance": 50
   },
   {
    "latin": "Mibora minima",
    "fr": "Mibora naine",
    "statut": "freq",
    "constance": 50
   },
   {
    "latin": "Syntrichia ruralis subsp. ruraliformis",
    "fr": "Syntrichia ruralis (mousse des dunes saupoudrées)",
    "statut": "freq",
    "constance": 50,
    "groupe": "bryolichenique"
   },
   {
    "latin": "Catapodium rigidum",
    "fr": "Catapode rigide",
    "statut": "freq",
    "constance": 50
   },
   {
    "latin": "Medicago minima",
    "fr": "Luzerne naine",
    "statut": "freq",
    "constance": 50
   },
   {
    "latin": "Senecio vulgaris",
    "fr": "Séneçon commun",
    "statut": "freq",
    "constance": 50
   },
   {
    "latin": "Veronica arvensis",
    "fr": "Véronique des champs",
    "statut": "freq",
    "constance": 50
   },
   {
    "latin": "Geranium molle",
    "fr": "Géranium à feuilles molles",
    "statut": "freq",
    "constance": 50
   }
  ],
  "description": "Pelouses annuelles se superposant en voile aux autres pelouses ou occupant leurs ouvertures, changeant de place d'une année sur l'autre. Reconnaissables au développement de Lagurus ovatus et de Bromus diandrus (subsp. maximus et/ou subsp. diandrus).",
  "ecologie": "Intérieur des dunes, à l'abri des dunes mobiles. Apports de sable faibles, substrat plus ou moins fixé, mince couche humifère qui devient très sèche en été. Fortes amplitudes thermiques journalières ; les débris coquilliers apportent des bases, ce qui distingue ces dunes des sables intérieurs acides.",
  "physionomie": "Pelouses rases et très recouvrantes mêlant annuelles, vivaces et bryophytes, parfois ouvertes après un saupoudrage de sable hivernal. Fond spécifique commun : Sanguisorba minor, Carex arenaria, Hypnum cupressiforme var. lacunosum, Sedum acre, Cerastium diffusum, Thymus drucei, Euphorbia portlandica, Ononis repens, Mibora minima, Koeleria glauca, Arenaria serpyllifolia, Leontodon saxatilis.",
  "periode": "Visible toute l'année, optimum de floraison du printemps au début de l'été.",
  "confusions": "Les sous-unités sont floristiquement proches : Delassus en donne une clé, reprise ici. Retenir surtout : richesse en espèces oligotrophiles (Éphèdre, Rosier pimprenelle, Œillet de France, Aspérule…) pour les pelouses en bon état, contre présence de taxons de perturbation (Plantain corne-de-cerf, Lagure, Chiendent pied-de-poule…) pour les pelouses dégradées ou piétinées. La strate bryolichénique distingue les pelouses typiques (Hypnum) des pelouses saupoudrées (Syntrichia) et des pentes décapées (Tortella).",
  "dynamique": "Les pelouses proches du trait de côte sont quasi stables ; les plus internes évoluent vers les fourrés dunaires sur sol sec, d'autant plus vite qu'elles sont dégradées. Le piétinement fait passer les pelouses typiques aux pelouses des chemins non empierrés, processus réversible. Contact avec les dunes mobiles côté mer, les prairies et fourrés côté terre, et avec les dépressions dunaires.",
  "cle": [
   "Pelouse riche en espèces oligotrophiles (Ephedra distachya, Rosa pimpinellifolia, Dianthus gallicus, Asperula cynanchica, Thesium humifusum, Silene otites, Helichrysum stoechas…) → 2",
   "2. Strate bryolichénique fermée à Hypnum cupressiforme var. lacunosum, strate herbacée diversifiée → 3 ; strate bryolichénique peu dense à Syntrichia ou Tortella, végétation plus ouverte → 4",
   "3. Dominée par Ephedra distachya et/ou Rosa pimpinellifolia → 2.1a ; dominée par Helichrysum stoechas, Éphèdre et Rosier rares, sommet de butte → 2.1d",
   "4. Saupoudrage hivernal, sol en « millefeuille », Syntrichia ruralis subsp. ruraliformis → 2.1b ; pente décapée, Tortella squarrosa, Corynephorus canescens et Koeleria glauca → 2.1c",
   "Pelouse pauvre en oligotrophiles → 5. Ourlet fermé à Geranium sanguineum → 2.1e ; sinon → 6",
   "6. Fond de carrière ou ancienne culture, Sanguisorba minor dominant, taxons piétinés rares → 2.1f ; sinon → 7",
   "7. Camping ou chemin sur sable, Plantago coronopus, Cynodon dactylon, Sagina apetala → 2.1g ; voile d'annuelles à Lagurus ovatus et Bromus diandrus → 2.1h ; sables remaniés et enrichis à Glaucium flavum, Linaria arenaria, Carduus nutans → 2.1i"
  ]
 },
 {
  "id": "2.1i",
  "fiche": "2.1",
  "ordre": 17,
  "zone": "Dune grise",
  "rang": 5,
  "groupe": "Pelouses des dunes fixées",
  "nomFr": "Friches dunaires à Linaire des sables et Glaucière jaune",
  "nomFiche": "Pelouses des dunes grises",
  "syntaxon": "Grpt. à Linaria arenaria et Glaucium flavum Vanden Berghen 1958",
  "codes": {
   "eunis": "B1.42",
   "corine": "16.222",
   "eur28": "2130*",
   "cahiers": "2130*-2"
  },
  "nbReleves": 1,
  "especes": [
   {
    "latin": "Glaucium flavum",
    "fr": "Glaucière jaune (Pavot cornu)",
    "statut": "car",
    "constance": 100
   },
   {
    "latin": "Linaria arenaria",
    "fr": "Linaire des sables",
    "statut": "car",
    "constance": 100
   },
   {
    "latin": "Carduus nutans subsp. nutans",
    "fr": "Chardon penché",
    "statut": "car",
    "constance": 100
   },
   {
    "latin": "Plantago coronopus subsp. coronopus",
    "fr": "Plantain corne-de-cerf",
    "statut": "freq",
    "constance": 100
   },
   {
    "latin": "Plantago lanceolata",
    "fr": "Plantain lancéolé",
    "statut": "freq",
    "constance": 100
   },
   {
    "latin": "Arenaria serpyllifolia",
    "fr": "Sabline à feuilles de serpolet",
    "statut": "freq",
    "constance": 100
   },
   {
    "latin": "Carex arenaria",
    "fr": "Laîche des sables",
    "statut": "freq",
    "constance": 100
   },
   {
    "latin": "Euphorbia portlandica",
    "fr": "Euphorbe de Portland",
    "statut": "freq",
    "constance": 100
   },
   {
    "latin": "Mibora minima",
    "fr": "Mibora naine",
    "statut": "freq",
    "constance": 100
   },
   {
    "latin": "Solanum nigrum",
    "fr": "Morelle noire",
    "statut": "freq",
    "constance": 100
   }
  ],
  "description": "Secteurs fraîchement remaniés et eutrophisés (décrits en 1958 sur des cultures sur sable amendées au goémon ; rencontrée en 2016 sur une plateforme de travaux). Végétation ouverte à touffes de Glaucium flavum et Linaria arenaria, complétée par des taxons des dunes fixées de contact et des friches. Forme dégradée des pelouses des dunes fixées.",
  "ecologie": "Intérieur des dunes, à l'abri des dunes mobiles. Apports de sable faibles, substrat plus ou moins fixé, mince couche humifère qui devient très sèche en été. Fortes amplitudes thermiques journalières ; les débris coquilliers apportent des bases, ce qui distingue ces dunes des sables intérieurs acides.",
  "physionomie": "Pelouses rases et très recouvrantes mêlant annuelles, vivaces et bryophytes, parfois ouvertes après un saupoudrage de sable hivernal. Fond spécifique commun : Sanguisorba minor, Carex arenaria, Hypnum cupressiforme var. lacunosum, Sedum acre, Cerastium diffusum, Thymus drucei, Euphorbia portlandica, Ononis repens, Mibora minima, Koeleria glauca, Arenaria serpyllifolia, Leontodon saxatilis.",
  "periode": "Visible toute l'année, optimum de floraison du printemps au début de l'été.",
  "confusions": "Les sous-unités sont floristiquement proches : Delassus en donne une clé, reprise ici. Retenir surtout : richesse en espèces oligotrophiles (Éphèdre, Rosier pimprenelle, Œillet de France, Aspérule…) pour les pelouses en bon état, contre présence de taxons de perturbation (Plantain corne-de-cerf, Lagure, Chiendent pied-de-poule…) pour les pelouses dégradées ou piétinées. La strate bryolichénique distingue les pelouses typiques (Hypnum) des pelouses saupoudrées (Syntrichia) et des pentes décapées (Tortella).",
  "dynamique": "Les pelouses proches du trait de côte sont quasi stables ; les plus internes évoluent vers les fourrés dunaires sur sol sec, d'autant plus vite qu'elles sont dégradées. Le piétinement fait passer les pelouses typiques aux pelouses des chemins non empierrés, processus réversible. Contact avec les dunes mobiles côté mer, les prairies et fourrés côté terre, et avec les dépressions dunaires.",
  "cle": [
   "Pelouse riche en espèces oligotrophiles (Ephedra distachya, Rosa pimpinellifolia, Dianthus gallicus, Asperula cynanchica, Thesium humifusum, Silene otites, Helichrysum stoechas…) → 2",
   "2. Strate bryolichénique fermée à Hypnum cupressiforme var. lacunosum, strate herbacée diversifiée → 3 ; strate bryolichénique peu dense à Syntrichia ou Tortella, végétation plus ouverte → 4",
   "3. Dominée par Ephedra distachya et/ou Rosa pimpinellifolia → 2.1a ; dominée par Helichrysum stoechas, Éphèdre et Rosier rares, sommet de butte → 2.1d",
   "4. Saupoudrage hivernal, sol en « millefeuille », Syntrichia ruralis subsp. ruraliformis → 2.1b ; pente décapée, Tortella squarrosa, Corynephorus canescens et Koeleria glauca → 2.1c",
   "Pelouse pauvre en oligotrophiles → 5. Ourlet fermé à Geranium sanguineum → 2.1e ; sinon → 6",
   "6. Fond de carrière ou ancienne culture, Sanguisorba minor dominant, taxons piétinés rares → 2.1f ; sinon → 7",
   "7. Camping ou chemin sur sable, Plantago coronopus, Cynodon dactylon, Sagina apetala → 2.1g ; voile d'annuelles à Lagurus ovatus et Bromus diandrus → 2.1h ; sables remaniés et enrichis à Glaucium flavum, Linaria arenaria, Carduus nutans → 2.1i"
  ]
 },
 {
  "id": "2.2a",
  "fiche": "2.2",
  "ordre": 18,
  "zone": "Dune fixée, prairies",
  "rang": 6,
  "groupe": "Prairies des dunes fixées",
  "nomFr": "Prairies des dunes fixées à Laîche des sables, Fétuque rouge et Chiendent",
  "nomFiche": "Prairies des dunes fixées",
  "syntaxon": "Carici arenariae - Arrhenatherion elatioris B. Foucault 2016",
  "codes": {
   "eunis": "B1.4",
   "corine": "16.22",
   "eur28": "2130*",
   "cahiers": "2130*-3"
  },
  "nbReleves": 16,
  "especes": [
   {
    "latin": "Plantago lanceolata",
    "fr": "Plantain lancéolé",
    "statut": "car",
    "constance": 94
   },
   {
    "latin": "Festuca rubra gr.",
    "fr": "Fétuque rouge (groupe)",
    "statut": "car",
    "constance": 81
   },
   {
    "latin": "Sanguisorba minor subsp. minor",
    "fr": "Petite pimprenelle",
    "statut": "car",
    "constance": 75
   },
   {
    "latin": "Carex arenaria",
    "fr": "Laîche des sables",
    "statut": "car",
    "constance": 69
   },
   {
    "latin": "Poa pratensis",
    "fr": "Pâturin des prés",
    "statut": "freq",
    "constance": 69
   },
   {
    "latin": "Dactylis glomerata",
    "fr": "Dactyle aggloméré",
    "statut": "freq",
    "constance": 63
   },
   {
    "latin": "Eryngium campestre",
    "fr": "Panicaut champêtre",
    "statut": "freq",
    "constance": 63
   },
   {
    "latin": "Ranunculus bulbosus subsp. bulbosus",
    "fr": "Renoncule bulbeuse",
    "statut": "freq",
    "constance": 56
   },
   {
    "latin": "Potentilla reptans",
    "fr": "Potentille rampante",
    "statut": "freq",
    "constance": 56
   },
   {
    "latin": "Geranium columbinum",
    "fr": "Géranium colombin",
    "statut": "freq",
    "constance": 56
   },
   {
    "latin": "Rosa pimpinellifolia",
    "fr": "Rosier pimprenelle",
    "statut": "freq",
    "constance": 50
   },
   {
    "latin": "Arrhenatherum elatius s.l.",
    "fr": "Fromental",
    "statut": "freq",
    "constance": 50
   },
   {
    "latin": "Elymus x acutus",
    "fr": "Chiendent hybride du littoral",
    "statut": "car",
    "constance": 44
   },
   {
    "latin": "Holcus lanatus",
    "fr": "Houlque laineuse",
    "statut": "freq",
    "constance": 44
   },
   {
    "latin": "Geranium molle",
    "fr": "Géranium à feuilles molles",
    "statut": "freq",
    "constance": 44
   },
   {
    "latin": "Vicia sativa subsp. segetalis",
    "fr": "Vesce des moissons",
    "statut": "freq",
    "constance": 44
   },
   {
    "latin": "Senecio jacobaea",
    "fr": "Séneçon jacobée",
    "statut": "freq",
    "constance": 44
   },
   {
    "latin": "Homalothecium lutescens",
    "fr": "Homalothecium lutescens (mousse)",
    "statut": "freq",
    "constance": 38,
    "groupe": "bryolichenique"
   },
   {
    "latin": "Bromus hordeaceus subsp. hordeaceus",
    "fr": "Brome mou",
    "statut": "freq",
    "constance": 38
   },
   {
    "latin": "Medicago lupulina",
    "fr": "Minette",
    "statut": "freq",
    "constance": 38
   },
   {
    "latin": "Ononis repens",
    "fr": "Bugrane rampante",
    "statut": "freq",
    "constance": 38
   },
   {
    "latin": "Taraxacum gr. erythrospermum",
    "fr": "Pissenlit à graines rouges (groupe)",
    "statut": "freq",
    "constance": 38
   },
   {
    "latin": "Hypnum cupressiforme var. lacunosum",
    "fr": "Hypnum cupressiforme (mousse des dunes grises)",
    "statut": "freq",
    "constance": 31,
    "groupe": "bryolichenique"
   },
   {
    "latin": "Bellis perennis subsp. perennis",
    "fr": "Pâquerette",
    "statut": "freq",
    "constance": 31
   },
   {
    "latin": "Lotus corniculatus subsp. corniculatus",
    "fr": "Lotier corniculé",
    "statut": "freq",
    "constance": 31
   },
   {
    "latin": "Prunus spinosa",
    "fr": "Prunellier",
    "statut": "freq",
    "constance": 31
   },
   {
    "latin": "Plantago coronopus subsp. coronopus",
    "fr": "Plantain corne-de-cerf",
    "statut": "freq",
    "constance": 31
   },
   {
    "latin": "Carex flacca subsp. flacca",
    "fr": "Laîche glauque",
    "statut": "freq",
    "constance": 25
   },
   {
    "latin": "Luzula campestris",
    "fr": "Luzule champêtre",
    "statut": "freq",
    "constance": 25
   },
   {
    "latin": "Myosotis ramosissima subsp. lebelii",
    "fr": "Myosotis de Lebel",
    "statut": "freq",
    "constance": 25
   },
   {
    "latin": "Euphorbia portlandica",
    "fr": "Euphorbe de Portland",
    "statut": "freq",
    "constance": 25
   },
   {
    "latin": "Hypochaeris radicata",
    "fr": "Porcelle enracinée",
    "statut": "freq",
    "constance": 25
   },
   {
    "latin": "Leontodon saxatilis",
    "fr": "Liondent des rochers",
    "statut": "freq",
    "constance": 25
   },
   {
    "latin": "Daucus carota subsp. carota",
    "fr": "Carotte sauvage",
    "statut": "freq",
    "constance": 25
   }
  ],
  "description": "Type le plus répandu sur le site. Dominée par Carex arenaria, Festuca rubra gr. et/ou Elymus x acutus ; Poa pratensis (surtout subsp. latifolia) peut jouer un rôle structural. Cortège mêlant taxons prairiaux et pelousaires.",
  "ecologie": "Intérieur des dunes, substrat stabilisé, mais sol plus épais que sous les pelouses : horizon organo-minéral de quelques centimètres à quelques décimètres, retenant mieux eau et éléments nutritifs. Sur le site, surtout d'anciennes parcelles cultivées amendées au goémon, avec un horizon de labour.",
  "physionomie": "Végétation terne, dense et assez haute, dominée par des graminoïdes sociales à rhizome traçant : Carex arenaria, Festuca rubra gr., Elymus x acutus et/ou Anthoxanthum odoratum. Cortège de taxons prairiaux (Eryngium campestre, Plantago lanceolata, Arrhenatherum elatius, Holcus lanatus, Dactylis glomerata, Poa pratensis) avec quelques espèces des dunes fixées et des taxons eutrophiles.",
  "periode": "Observable toute l'année, diversité maximale à la fin du printemps.",
  "confusions": "Avec les prairies des dépressions dunaires, qui se distinguent par leurs taxons hygrophiles (Agrostis stolonifera, Mentha aquatica, Potentilla reptans, Pulicaria dysenterica).",
  "dynamique": "Évolution progressive vers les fourrés dunaires sur sol sec, plus rapide que depuis les pelouses, du fait de l'épais horizon organo-minéral. Les prairies peuvent localement coloniser des pelouses dégradées. Contact avec les pelouses et les fourrés des dunes fixées."
 },
 {
  "id": "2.2b",
  "fiche": "2.2",
  "ordre": 19,
  "zone": "Dune fixée, prairies",
  "rang": 6,
  "groupe": "Prairies des dunes fixées",
  "nomFr": "Prairies des dunes fixées à Flouve odorante et Gaudinie fragile",
  "nomFiche": "Prairies des dunes fixées",
  "syntaxon": "Carici arenariae - Arrhenatherion elatioris B. Foucault 2016",
  "codes": {
   "eunis": "B1.4",
   "corine": "16.22",
   "eur28": "2130*",
   "cahiers": "2130*-3"
  },
  "nbReleves": 3,
  "especes": [
   {
    "latin": "Anthoxanthum odoratum",
    "fr": "Flouve odorante",
    "statut": "car",
    "constance": 100
   },
   {
    "latin": "Gaudinia fragilis",
    "fr": "Gaudinie fragile",
    "statut": "car",
    "constance": 100
   },
   {
    "latin": "Ranunculus bulbosus subsp. bulbosus",
    "fr": "Renoncule bulbeuse",
    "statut": "freq",
    "constance": 100
   },
   {
    "latin": "Bromus hordeaceus subsp. hordeaceus",
    "fr": "Brome mou",
    "statut": "freq",
    "constance": 100
   },
   {
    "latin": "Dactylis glomerata",
    "fr": "Dactyle aggloméré",
    "statut": "freq",
    "constance": 100
   },
   {
    "latin": "Sanguisorba minor subsp. minor",
    "fr": "Petite pimprenelle",
    "statut": "car",
    "constance": 67
   },
   {
    "latin": "Holcus lanatus",
    "fr": "Houlque laineuse",
    "statut": "freq",
    "constance": 67
   },
   {
    "latin": "Bellis perennis subsp. perennis",
    "fr": "Pâquerette",
    "statut": "freq",
    "constance": 67
   },
   {
    "latin": "Rosa pimpinellifolia",
    "fr": "Rosier pimprenelle",
    "statut": "freq",
    "constance": 67
   },
   {
    "latin": "Trifolium dubium",
    "fr": "Trèfle douteux",
    "statut": "freq",
    "constance": 67
   },
   {
    "latin": "Arrhenatherum elatius s.l.",
    "fr": "Fromental",
    "statut": "freq",
    "constance": 67
   },
   {
    "latin": "Luzula campestris",
    "fr": "Luzule champêtre",
    "statut": "freq",
    "constance": 67
   },
   {
    "latin": "Plantago lanceolata",
    "fr": "Plantain lancéolé",
    "statut": "freq",
    "constance": 67
   },
   {
    "latin": "Sherardia arvensis",
    "fr": "Rubéole des champs",
    "statut": "freq",
    "constance": 67
   },
   {
    "latin": "Myosotis ramosissima subsp. lebelii",
    "fr": "Myosotis de Lebel",
    "statut": "freq",
    "constance": 67
   },
   {
    "latin": "Senecio vulgaris",
    "fr": "Séneçon commun",
    "statut": "freq",
    "constance": 67
   },
   {
    "latin": "Hypnum cupressiforme var. lacunosum",
    "fr": "Hypnum cupressiforme (mousse des dunes grises)",
    "statut": "freq",
    "constance": 33,
    "groupe": "bryolichenique"
   },
   {
    "latin": "Brachythecium rutabulum",
    "fr": "Brachythecium rutabulum (mousse)",
    "statut": "freq",
    "constance": 33,
    "groupe": "bryolichenique"
   },
   {
    "latin": "Festuca rubra gr.",
    "fr": "Fétuque rouge (groupe)",
    "statut": "freq",
    "constance": 33
   },
   {
    "latin": "Homalothecium lutescens",
    "fr": "Homalothecium lutescens (mousse)",
    "statut": "freq",
    "constance": 33,
    "groupe": "bryolichenique"
   },
   {
    "latin": "Koeleria glauca",
    "fr": "Koelérie glauque",
    "statut": "freq",
    "constance": 33
   },
   {
    "latin": "Medicago arabica",
    "fr": "Luzerne tachetée",
    "statut": "freq",
    "constance": 33
   },
   {
    "latin": "Potentilla reptans",
    "fr": "Potentille rampante",
    "statut": "freq",
    "constance": 33
   },
   {
    "latin": "Carex arenaria",
    "fr": "Laîche des sables",
    "statut": "freq",
    "constance": 33
   },
   {
    "latin": "Festuca arundinacea",
    "fr": "Fétuque roseau",
    "statut": "freq",
    "constance": 33
   },
   {
    "latin": "Geranium molle",
    "fr": "Géranium à feuilles molles",
    "statut": "freq",
    "constance": 33
   },
   {
    "latin": "Leucanthemum vulgare",
    "fr": "Marguerite commune",
    "statut": "freq",
    "constance": 33
   },
   {
    "latin": "Lotus corniculatus subsp. corniculatus",
    "fr": "Lotier corniculé",
    "statut": "freq",
    "constance": 33
   },
   {
    "latin": "Medicago lupulina",
    "fr": "Minette",
    "statut": "freq",
    "constance": 33
   },
   {
    "latin": "Myosotis discolor",
    "fr": "Myosotis bicolore",
    "statut": "freq",
    "constance": 33
   },
   {
    "latin": "Poa pratensis",
    "fr": "Pâturin des prés",
    "statut": "freq",
    "constance": 33
   },
   {
    "latin": "Prunus spinosa",
    "fr": "Prunellier",
    "statut": "freq",
    "constance": 33
   },
   {
    "latin": "Veronica arvensis",
    "fr": "Véronique des champs",
    "statut": "freq",
    "constance": 33
   },
   {
    "latin": "Cerastium diffusum subsp. diffusum",
    "fr": "Céraiste à quatre étamines",
    "statut": "freq",
    "constance": 33
   },
   {
    "latin": "Eryngium campestre",
    "fr": "Panicaut champêtre",
    "statut": "freq",
    "constance": 33
   },
   {
    "latin": "Geranium columbinum",
    "fr": "Géranium colombin",
    "statut": "freq",
    "constance": 33
   },
   {
    "latin": "Hypochaeris radicata",
    "fr": "Porcelle enracinée",
    "statut": "freq",
    "constance": 33
   },
   {
    "latin": "Leontodon saxatilis",
    "fr": "Liondent des rochers",
    "statut": "freq",
    "constance": 33
   },
   {
    "latin": "Senecio jacobaea",
    "fr": "Séneçon jacobée",
    "statut": "freq",
    "constance": 33
   },
   {
    "latin": "Taraxacum gr. erythrospermum",
    "fr": "Pissenlit à graines rouges (groupe)",
    "statut": "freq",
    "constance": 33
   },
   {
    "latin": "Arenaria serpyllifolia",
    "fr": "Sabline à feuilles de serpolet",
    "statut": "freq",
    "constance": 33
   }
  ],
  "description": "Type très localisé, dominé par Anthoxanthum odoratum, Gaudinia fragilis et Sanguisorba minor. Les taxons prairiaux se font plus rares, donnant une physionomie plus pelousaire ; les eutrophiles sont moins représentés.",
  "ecologie": "Intérieur des dunes, substrat stabilisé, mais sol plus épais que sous les pelouses : horizon organo-minéral de quelques centimètres à quelques décimètres, retenant mieux eau et éléments nutritifs. Sur le site, surtout d'anciennes parcelles cultivées amendées au goémon, avec un horizon de labour.",
  "physionomie": "Végétation terne, dense et assez haute, dominée par des graminoïdes sociales à rhizome traçant : Carex arenaria, Festuca rubra gr., Elymus x acutus et/ou Anthoxanthum odoratum. Cortège de taxons prairiaux (Eryngium campestre, Plantago lanceolata, Arrhenatherum elatius, Holcus lanatus, Dactylis glomerata, Poa pratensis) avec quelques espèces des dunes fixées et des taxons eutrophiles.",
  "periode": "Observable toute l'année, diversité maximale à la fin du printemps.",
  "confusions": "Avec les prairies des dépressions dunaires, qui se distinguent par leurs taxons hygrophiles (Agrostis stolonifera, Mentha aquatica, Potentilla reptans, Pulicaria dysenterica).",
  "dynamique": "Évolution progressive vers les fourrés dunaires sur sol sec, plus rapide que depuis les pelouses, du fait de l'épais horizon organo-minéral. Les prairies peuvent localement coloniser des pelouses dégradées. Contact avec les pelouses et les fourrés des dunes fixées."
 },
 {
  "id": "2.3",
  "fiche": "2.3",
  "ordre": 20,
  "zone": "Fourrés et boisements",
  "rang": 7,
  "groupe": "Fourrés dunaires",
  "nomFr": "Fourrés dunaires sur sol sec à Iris fétide et Prunellier",
  "nomFiche": "Fourrés dunaires sur sol sec",
  "syntaxon": "Irido foetidissimae - Prunetum spinosae Géhu 2008",
  "codes": {
   "eunis": "B1.612",
   "corine": "16.252",
   "eur28": "-",
   "cahiers": "-"
  },
  "nbReleves": 9,
  "especes": [
   {
    "latin": "Rubus sp.",
    "fr": "Ronce (non déterminée)",
    "statut": "car",
    "constance": 100
   },
   {
    "latin": "Iris foetidissima",
    "fr": "Iris fétide",
    "statut": "car",
    "constance": 89
   },
   {
    "latin": "Prunus spinosa",
    "fr": "Prunellier",
    "statut": "car",
    "constance": 78
   },
   {
    "latin": "Hedera helix subsp. helix",
    "fr": "Lierre grimpant",
    "statut": "car",
    "constance": 78
   },
   {
    "latin": "Ulex europaeus subsp. europaeus",
    "fr": "Ajonc d'Europe",
    "statut": "car",
    "constance": 78
   },
   {
    "latin": "Arum italicum subsp. neglectum",
    "fr": "Gouet d'Italie",
    "statut": "car",
    "constance": 67
   },
   {
    "latin": "Bryonia dioica",
    "fr": "Bryone dioïque",
    "statut": "freq",
    "constance": 56
   },
   {
    "latin": "Sambucus nigra",
    "fr": "Sureau noir",
    "statut": "freq",
    "constance": 44
   },
   {
    "latin": "Cardamine hirsuta",
    "fr": "Cardamine hérissée",
    "statut": "freq",
    "constance": 44
   },
   {
    "latin": "Solanum dulcamara",
    "fr": "Morelle douce-amère",
    "statut": "freq",
    "constance": 44
   },
   {
    "latin": "Galium aparine",
    "fr": "Gaillet gratteron",
    "statut": "freq",
    "constance": 44
   },
   {
    "latin": "Geranium purpureum",
    "fr": "Géranium pourpre",
    "statut": "freq",
    "constance": 33
   },
   {
    "latin": "Cynoglossum officinale",
    "fr": "Cynoglosse officinale",
    "statut": "freq",
    "constance": 33
   },
   {
    "latin": "Rosa pimpinellifolia",
    "fr": "Rosier pimprenelle",
    "statut": "freq",
    "constance": 33
   },
   {
    "latin": "Senecio jacobaea",
    "fr": "Séneçon jacobée",
    "statut": "freq",
    "constance": 33
   }
  ],
  "description": "Un seul type de fourré sur le site. Faciès dominé par Ulex europaeus selon les secteurs ; Salix atrocinerea peut être présent, jamais dominant. L'ourlet bordant ces fourrés n'a pas pu être mis en évidence.",
  "ecologie": "Intérieur des dunes, sur sables enrichis en éléments fins sur plusieurs centimètres. Surtout dans les secteurs perturbés (anciennes cultures, anciennes carrières, prairies dunaires), parfois en recolonisation de pelouses typiques, toujours hors des secteurs saupoudrés.",
  "physionomie": "Groupements ligneux denses dominés par Prunus spinosa et/ou Ulex europaeus, accompagnés de ronces. Strate herbacée clairsemée mais typique des fourrés littoraux sur sols riches en bases, avec Iris foetidissima et Arum italicum subsp. neglectum.",
  "periode": "Printemps à fin d'été.",
  "confusions": "Avec la saulaie mésohygrophile, qui abrite aussi Iris foetidissima et Arum italicum subsp. neglectum, mais où Salix atrocinerea domine la strate arbustive, avec des taxons hygrophiles (Mentha aquatica, Agrostis stolonifera, Hydrocotyle vulgaris).",
  "dynamique": "Colonisent les pelouses des dunes fixées, surtout après perturbation, et localement les dunes grises typiques. L'évolution vers une forêt est incertaine sur le site : chênaie pédonculée probable, ou forêt secondaire à Pinus pinaster et Cupressus macrocarpa à partir des plantations voisines."
 },
 {
  "id": "2.4a",
  "fiche": "2.4",
  "ordre": 21,
  "zone": "Fourrés et boisements",
  "rang": 7,
  "groupe": "Boisements",
  "nomFr": "Plantations et boisements subspontanés de conifères",
  "nomFiche": "Plantations et boisements subspontanés récents",
  "syntaxon": "-",
  "codes": {
   "eunis": "G3.F / G1.C",
   "corine": "83.3",
   "eur28": "-",
   "cahiers": "-"
  },
  "nbReleves": 0,
  "especes": [],
  "description": "Boisements dominés par des conifères, surtout Pinus pinaster et Cupressus macrocarpa.",
  "ecologie": "Dune fixée, généralement en arrière des dunes saupoudrées, parfois loin du trait de côte, les ligneux supportant mal le vent et les mouvements de sable.",
  "physionomie": "Formations arborées dominées par des essences exogènes, plantées ou issues de dissémination. Sous-bois fait de reliques des pelouses dunaires et de jeunes arbustes : ni strate arbustive ni strate herbacée typiques d'une forêt dunaire.",
  "periode": "Printemps à fin d'été.",
  "confusions": "Avec les plantations dunaires anciennes sur sol sec (habitat 2180), à strate arbustive dense (Ligustrum vulgare, Crataegus monogyna, Corylus avellana) et strate herbacée forestière (Iris foetidissima, Asplenium scolopendrium, Tamus communis) : ce type n'a pas été trouvé sur le site, mais reste à rechercher.",
  "dynamique": "Stade terminal plus ou moins stable. Rencontrés au contact direct des pelouses des dunes grises, qu'ils colonisent.",
  "sansReleve": "Aucun relevé phytosociologique dans le document : l'appli ne peut pas proposer cette unité à partir d'un cortège."
 },
 {
  "id": "2.4b",
  "fiche": "2.4",
  "ordre": 22,
  "zone": "Fourrés et boisements",
  "rang": 7,
  "groupe": "Boisements",
  "nomFr": "Plantations et boisements subspontanés de feuillus",
  "nomFiche": "Plantations et boisements subspontanés récents",
  "syntaxon": "-",
  "codes": {
   "eunis": "G3.F / G1.C",
   "corine": "83.3",
   "eur28": "-",
   "cahiers": "-"
  },
  "nbReleves": 0,
  "especes": [],
  "description": "Boisements dominés par des feuillus, surtout Populus sp. sur le site.",
  "ecologie": "Dune fixée, généralement en arrière des dunes saupoudrées, parfois loin du trait de côte, les ligneux supportant mal le vent et les mouvements de sable.",
  "physionomie": "Formations arborées dominées par des essences exogènes, plantées ou issues de dissémination. Sous-bois fait de reliques des pelouses dunaires et de jeunes arbustes : ni strate arbustive ni strate herbacée typiques d'une forêt dunaire.",
  "periode": "Printemps à fin d'été.",
  "confusions": "Avec les plantations dunaires anciennes sur sol sec (habitat 2180), à strate arbustive dense (Ligustrum vulgare, Crataegus monogyna, Corylus avellana) et strate herbacée forestière (Iris foetidissima, Asplenium scolopendrium, Tamus communis) : ce type n'a pas été trouvé sur le site, mais reste à rechercher.",
  "dynamique": "Stade terminal plus ou moins stable. Rencontrés au contact direct des pelouses des dunes grises, qu'ils colonisent.",
  "sansReleve": "Aucun relevé phytosociologique dans le document : l'appli ne peut pas proposer cette unité à partir d'un cortège."
 },
 {
  "id": "2.5a",
  "fiche": "2.5",
  "ordre": 23,
  "zone": "Milieux anthropiques",
  "rang": null,
  "groupe": "Friches",
  "nomFr": "Friches dunaires à Buglosse des champs et Diplotaxis vivace",
  "nomFiche": "Friches dunaires",
  "syntaxon": "Grpt. à Carduus tenuiflorus et Diplotaxis tenuifolia",
  "codes": {
   "eunis": "E5.1",
   "corine": "87.1",
   "eur28": "-",
   "cahiers": "-"
  },
  "nbReleves": 1,
  "especes": [
   {
    "latin": "Urtica dioica",
    "fr": "Grande ortie",
    "statut": "freq",
    "constance": 100
   },
   {
    "latin": "Anagallis arvensis",
    "fr": "Mouron rouge",
    "statut": "freq",
    "constance": 100
   },
   {
    "latin": "Diplotaxis tenuifolia",
    "fr": "Diplotaxis vivace",
    "statut": "car",
    "constance": 100
   },
   {
    "latin": "Galium mollugo",
    "fr": "Gaillet mollugine",
    "statut": "freq",
    "constance": 100
   },
   {
    "latin": "Anchusa arvensis subsp. arvensis",
    "fr": "Buglosse des champs",
    "statut": "car",
    "constance": 100
   },
   {
    "latin": "Carduus tenuiflorus",
    "fr": "Chardon à petits capitules",
    "statut": "car",
    "constance": 100
   },
   {
    "latin": "Conium maculatum",
    "fr": "Grande ciguë",
    "statut": "freq",
    "constance": 100
   },
   {
    "latin": "Echium vulgare",
    "fr": "Vipérine commune",
    "statut": "freq",
    "constance": 100
   },
   {
    "latin": "Geranium lucidum",
    "fr": "Géranium luisant",
    "statut": "freq",
    "constance": 100
   },
   {
    "latin": "Geranium molle",
    "fr": "Géranium à feuilles molles",
    "statut": "freq",
    "constance": 100
   },
   {
    "latin": "Potentilla reptans",
    "fr": "Potentille rampante",
    "statut": "freq",
    "constance": 100
   },
   {
    "latin": "Silene latifolia subsp. alba",
    "fr": "Compagnon blanc",
    "statut": "freq",
    "constance": 100
   },
   {
    "latin": "Solanum dulcamara",
    "fr": "Morelle douce-amère",
    "statut": "freq",
    "constance": 100
   },
   {
    "latin": "Verbascum thapsus",
    "fr": "Bouillon blanc",
    "statut": "freq",
    "constance": 100
   },
   {
    "latin": "Anthriscus caucalis",
    "fr": "Cerfeuil vulgaire",
    "statut": "freq",
    "constance": 100
   },
   {
    "latin": "Bryonia dioica",
    "fr": "Bryone dioïque",
    "statut": "freq",
    "constance": 100
   },
   {
    "latin": "Cardaria draba",
    "fr": "Passerage drave",
    "statut": "freq",
    "constance": 100
   },
   {
    "latin": "Cirsium arvense",
    "fr": "Cirse des champs",
    "statut": "freq",
    "constance": 100
   },
   {
    "latin": "Cynodon dactylon",
    "fr": "Chiendent pied-de-poule",
    "statut": "freq",
    "constance": 100
   },
   {
    "latin": "Cynoglossum officinale",
    "fr": "Cynoglosse officinale",
    "statut": "freq",
    "constance": 100
   },
   {
    "latin": "Geranium rotundifolium",
    "fr": "Géranium à feuilles rondes",
    "statut": "freq",
    "constance": 100
   },
   {
    "latin": "Hypericum perforatum",
    "fr": "Millepertuis perforé",
    "statut": "freq",
    "constance": 100
   },
   {
    "latin": "Mercurialis annua",
    "fr": "Mercuriale annuelle",
    "statut": "freq",
    "constance": 100
   },
   {
    "latin": "Plantago lanceolata",
    "fr": "Plantain lancéolé",
    "statut": "freq",
    "constance": 100
   },
   {
    "latin": "Reseda luteola",
    "fr": "Réséda des teinturiers",
    "statut": "freq",
    "constance": 100
   },
   {
    "latin": "Sisymbrium officinale",
    "fr": "Herbe aux chantres",
    "statut": "freq",
    "constance": 100
   },
   {
    "latin": "Sonchus asper",
    "fr": "Laiteron épineux",
    "statut": "freq",
    "constance": 100
   },
   {
    "latin": "Verbascum nigrum subsp. nigrum",
    "fr": "Molène noire",
    "statut": "freq",
    "constance": 100
   },
   {
    "latin": "Verbena officinalis",
    "fr": "Verveine officinale",
    "statut": "freq",
    "constance": 100
   }
  ],
  "description": "Dunes mécaniquement aplanies, substrat modifié par apport de matériaux (béton, gravats). Végétation assez ouverte et diversifiée à Diplotaxis tenuifolia, Anchusa arvensis, Echium vulgare, Silene latifolia subsp. alba, Verbascum thapsus, V. nigrum, Galium mollugo, Carduus tenuiflorus. Plus indicatrices de rudéralisation que d'eutrophisation.",
  "ecologie": "Milieux assez modifiés par l'Homme — eutrophisation ou apport de matériaux extérieurs — pour que les propriétés du sable dunaire soient changées.",
  "physionomie": "Végétations herbacées ouvertes à fermées, dominées par des espèces nitrophiles ou rudérales, souvent annuelles ou bisannuelles. Les taxons caractéristiques des dunes sont rares ou absents.",
  "periode": "Printemps et été.",
  "confusions": "Avec les prairies dunaires, à cause de la dominance des graminées : les friches sont dominées par des graminées annuelles (Bromus diandrus, Vulpia sp., Lagurus ovatus) accompagnées de nitrophiles (Heracleum sphondylium, Rumex obtusifolius, Stellaria media, Salvia verbenaca).",
  "dynamique": "Dérivent des pelouses des dunes fixées par eutrophisation ou rudéralisation ; le retour à un groupement dunaire typique semble aujourd'hui compliqué, ce qui les fait traiter comme des habitats à part. Évolution possible vers les fourrés puis les boisements. Contact avec les pelouses ou les prairies dont elles dérivent."
 },
 {
  "id": "2.5b",
  "fiche": "2.5",
  "ordre": 24,
  "zone": "Milieux anthropiques",
  "rang": null,
  "groupe": "Friches",
  "nomFr": "Friches dunaires à Brome et Berce commune",
  "nomFiche": "Friches dunaires",
  "syntaxon": "Heracleo sphondylii - Rumicetum obtusifolii B. Foucault in Royer et al. 2006",
  "codes": {
   "eunis": "E5.1",
   "corine": "87.1",
   "eur28": "-",
   "cahiers": "-"
  },
  "nbReleves": 1,
  "especes": [
   {
    "latin": "Bromus diandrus subsp. maximus",
    "fr": "Grand brome des sables",
    "statut": "car",
    "constance": 100
   },
   {
    "latin": "Urtica dioica",
    "fr": "Grande ortie",
    "statut": "freq",
    "constance": 100
   },
   {
    "latin": "Arrhenatherum elatius subsp. bulbosum",
    "fr": "Fromental bulbeux",
    "statut": "freq",
    "constance": 100
   },
   {
    "latin": "Geranium molle",
    "fr": "Géranium à feuilles molles",
    "statut": "freq",
    "constance": 100
   },
   {
    "latin": "Heracleum sphondylium",
    "fr": "Berce commune",
    "statut": "car",
    "constance": 100
   },
   {
    "latin": "Silene latifolia subsp. alba",
    "fr": "Compagnon blanc",
    "statut": "freq",
    "constance": 100
   },
   {
    "latin": "Geranium dissectum",
    "fr": "Géranium découpé",
    "statut": "freq",
    "constance": 100
   },
   {
    "latin": "Lagurus ovatus",
    "fr": "Lagure ovale (Queue-de-lièvre)",
    "statut": "freq",
    "constance": 100
   },
   {
    "latin": "Stellaria media subsp. media",
    "fr": "Mouron des oiseaux",
    "statut": "freq",
    "constance": 100
   },
   {
    "latin": "Bromus hordeaceus subsp. hordeaceus",
    "fr": "Brome mou",
    "statut": "freq",
    "constance": 100
   },
   {
    "latin": "Plantago lanceolata",
    "fr": "Plantain lancéolé",
    "statut": "freq",
    "constance": 100
   },
   {
    "latin": "Ranunculus bulbosus subsp. bulbosus",
    "fr": "Renoncule bulbeuse",
    "statut": "freq",
    "constance": 100
   },
   {
    "latin": "Rumex crispus",
    "fr": "Patience crépue",
    "statut": "freq",
    "constance": 100
   },
   {
    "latin": "Rumex obtusifolius",
    "fr": "Patience à feuilles obtuses",
    "statut": "car",
    "constance": 100
   }
  ],
  "description": "Légères dépressions mésophiles où s'accumulent des matières organiques (produits de tonte ou de fauche) : sol épais, riche en azote. Végétation nitrophile à Heracleum sphondylium, Rumex obtusifolius, Urtica dioica, Dactylis glomerata, enrichie d'annuelles des friches dunaires (Lagurus ovatus, Bromus diandrus subsp. maximus) qui marquent la physionomie.",
  "ecologie": "Milieux assez modifiés par l'Homme — eutrophisation ou apport de matériaux extérieurs — pour que les propriétés du sable dunaire soient changées.",
  "physionomie": "Végétations herbacées ouvertes à fermées, dominées par des espèces nitrophiles ou rudérales, souvent annuelles ou bisannuelles. Les taxons caractéristiques des dunes sont rares ou absents.",
  "periode": "Printemps et été.",
  "confusions": "Avec les prairies dunaires, à cause de la dominance des graminées : les friches sont dominées par des graminées annuelles (Bromus diandrus, Vulpia sp., Lagurus ovatus) accompagnées de nitrophiles (Heracleum sphondylium, Rumex obtusifolius, Stellaria media, Salvia verbenaca).",
  "dynamique": "Dérivent des pelouses des dunes fixées par eutrophisation ou rudéralisation ; le retour à un groupement dunaire typique semble aujourd'hui compliqué, ce qui les fait traiter comme des habitats à part. Évolution possible vers les fourrés puis les boisements. Contact avec les pelouses ou les prairies dont elles dérivent."
 },
 {
  "id": "2.5c",
  "fiche": "2.5",
  "ordre": 25,
  "zone": "Milieux anthropiques",
  "rang": null,
  "groupe": "Friches",
  "nomFr": "Friches dunaires à Brome et Sauge verveine",
  "nomFiche": "Friches dunaires",
  "syntaxon": "Grpt. à Salvia verbenaca et Bromus hordeaceus subsp. hordeaceus",
  "codes": {
   "eunis": "E5.1",
   "corine": "87.1",
   "eur28": "-",
   "cahiers": "-"
  },
  "nbReleves": 1,
  "especes": [
   {
    "latin": "Bromus diandrus subsp. diandrus",
    "fr": "Brome à deux étamines",
    "statut": "car",
    "constance": 100
   },
   {
    "latin": "Salvia verbenaca",
    "fr": "Sauge verveine",
    "statut": "car",
    "constance": 100
   },
   {
    "latin": "Anthoxanthum odoratum",
    "fr": "Flouve odorante",
    "statut": "freq",
    "constance": 100
   },
   {
    "latin": "Bellis perennis subsp. perennis",
    "fr": "Pâquerette",
    "statut": "freq",
    "constance": 100
   },
   {
    "latin": "Bromus hordeaceus subsp. hordeaceus",
    "fr": "Brome mou",
    "statut": "freq",
    "constance": 100
   },
   {
    "latin": "Lagurus ovatus",
    "fr": "Lagure ovale (Queue-de-lièvre)",
    "statut": "freq",
    "constance": 100
   },
   {
    "latin": "Plantago lanceolata",
    "fr": "Plantain lancéolé",
    "statut": "freq",
    "constance": 100
   },
   {
    "latin": "Vulpia sp.",
    "fr": "Vulpie (non déterminée)",
    "statut": "freq",
    "constance": 100
   },
   {
    "latin": "Gaudinia fragilis",
    "fr": "Gaudinie fragile",
    "statut": "freq",
    "constance": 100
   },
   {
    "latin": "Geranium molle",
    "fr": "Géranium à feuilles molles",
    "statut": "freq",
    "constance": 100
   },
   {
    "latin": "Medicago sativa",
    "fr": "Luzerne cultivée",
    "statut": "freq",
    "constance": 100
   },
   {
    "latin": "Sherardia arvensis",
    "fr": "Rubéole des champs",
    "statut": "freq",
    "constance": 100
   },
   {
    "latin": "Eryngium campestre",
    "fr": "Panicaut champêtre",
    "statut": "freq",
    "constance": 100
   },
   {
    "latin": "Geranium dissectum",
    "fr": "Géranium découpé",
    "statut": "freq",
    "constance": 100
   },
   {
    "latin": "Leucanthemum vulgare",
    "fr": "Marguerite commune",
    "statut": "freq",
    "constance": 100
   },
   {
    "latin": "Ranunculus bulbosus subsp. bulbosus",
    "fr": "Renoncule bulbeuse",
    "statut": "freq",
    "constance": 100
   },
   {
    "latin": "Raphanus raphanistrum",
    "fr": "Radis sauvage",
    "statut": "freq",
    "constance": 100
   },
   {
    "latin": "Silene latifolia subsp. alba",
    "fr": "Compagnon blanc",
    "statut": "freq",
    "constance": 100
   },
   {
    "latin": "Papaver dubium",
    "fr": "Coquelicot douteux",
    "statut": "freq",
    "constance": 100
   }
  ],
  "description": "Prairies de fauche sur dune converties en parking l'été : le tassement favorise les annuelles tout en gardant un fond prairial appauvri. Dominance de Bromus diandrus subsp. diandrus et Salvia verbenaca, avec Plantago lanceolata, Bromus hordeaceus, Lagurus ovatus, Bellis perennis, Anthoxanthum odoratum, Gaudinia fragilis.",
  "ecologie": "Milieux assez modifiés par l'Homme — eutrophisation ou apport de matériaux extérieurs — pour que les propriétés du sable dunaire soient changées.",
  "physionomie": "Végétations herbacées ouvertes à fermées, dominées par des espèces nitrophiles ou rudérales, souvent annuelles ou bisannuelles. Les taxons caractéristiques des dunes sont rares ou absents.",
  "periode": "Printemps et été.",
  "confusions": "Avec les prairies dunaires, à cause de la dominance des graminées : les friches sont dominées par des graminées annuelles (Bromus diandrus, Vulpia sp., Lagurus ovatus) accompagnées de nitrophiles (Heracleum sphondylium, Rumex obtusifolius, Stellaria media, Salvia verbenaca).",
  "dynamique": "Dérivent des pelouses des dunes fixées par eutrophisation ou rudéralisation ; le retour à un groupement dunaire typique semble aujourd'hui compliqué, ce qui les fait traiter comme des habitats à part. Évolution possible vers les fourrés puis les boisements. Contact avec les pelouses ou les prairies dont elles dérivent."
 },
 {
  "id": "2.5d",
  "fiche": "2.5",
  "ordre": 26,
  "zone": "Milieux anthropiques",
  "rang": null,
  "groupe": "Friches",
  "nomFr": "Friches dunaires à Maceron",
  "nomFiche": "Friches dunaires",
  "syntaxon": "Grpt. à Carex arenaria et Smyrnium olusatrum",
  "codes": {
   "eunis": "E5.1",
   "corine": "87.1",
   "eur28": "-",
   "cahiers": "-"
  },
  "nbReleves": 1,
  "especes": [
   {
    "latin": "Smyrnium olusatrum",
    "fr": "Maceron",
    "statut": "car",
    "constance": 100
   },
   {
    "latin": "Carex arenaria",
    "fr": "Laîche des sables",
    "statut": "car",
    "constance": 100
   },
   {
    "latin": "Potentilla reptans",
    "fr": "Potentille rampante",
    "statut": "freq",
    "constance": 100
   },
   {
    "latin": "Cynodon dactylon",
    "fr": "Chiendent pied-de-poule",
    "statut": "freq",
    "constance": 100
   },
   {
    "latin": "Rumex crispus",
    "fr": "Patience crépue",
    "statut": "freq",
    "constance": 100
   },
   {
    "latin": "Eryngium campestre",
    "fr": "Panicaut champêtre",
    "statut": "freq",
    "constance": 100
   }
  ],
  "description": "Sables initialement enrichis en azote et en phosphore. La dominance de Smyrnium olusatrum entretient ensuite cette eutrophisation, rendant la végétation stable même après la coupure de la source initiale. Quelques taxons rappellent les pelouses dunaires dont ces friches dérivent.",
  "ecologie": "Milieux assez modifiés par l'Homme — eutrophisation ou apport de matériaux extérieurs — pour que les propriétés du sable dunaire soient changées.",
  "physionomie": "Végétations herbacées ouvertes à fermées, dominées par des espèces nitrophiles ou rudérales, souvent annuelles ou bisannuelles. Les taxons caractéristiques des dunes sont rares ou absents.",
  "periode": "Printemps et été.",
  "confusions": "Avec les prairies dunaires, à cause de la dominance des graminées : les friches sont dominées par des graminées annuelles (Bromus diandrus, Vulpia sp., Lagurus ovatus) accompagnées de nitrophiles (Heracleum sphondylium, Rumex obtusifolius, Stellaria media, Salvia verbenaca).",
  "dynamique": "Dérivent des pelouses des dunes fixées par eutrophisation ou rudéralisation ; le retour à un groupement dunaire typique semble aujourd'hui compliqué, ce qui les fait traiter comme des habitats à part. Évolution possible vers les fourrés puis les boisements. Contact avec les pelouses ou les prairies dont elles dérivent."
 },
 {
  "id": "2.6a",
  "fiche": "2.6",
  "ordre": 27,
  "zone": "Milieux anthropiques",
  "rang": null,
  "groupe": "Chemins",
  "nomFr": "Chemins empierrés sans végétation",
  "nomFiche": "Chemins empierrés des dunes",
  "syntaxon": "-",
  "codes": {
   "eunis": "H5.61",
   "corine": "-",
   "eur28": "-",
   "cahiers": "-"
  },
  "nbReleves": 0,
  "especes": [],
  "description": "La majeure partie des chemins empierrés ne porte pas de végétation, ou une végétation très éparse et peu caractérisée.",
  "ecologie": "Chemins artificiels créés dans le massif par apport de cailloux, graviers ou gravats, pour stabiliser le sable et permettre le passage de véhicules. Substrat empierré très drainant, donc très sec, et fortes amplitudes thermiques.",
  "physionomie": "Physionomie très ouverte, la végétation n'occupant qu'une faible surface, en bords et milieu de piste : taxons supportant le piétinement ou le passage d'engins (Cynodon dactylon, Poa annua, Poa bulbosa, Sagina apetala, Plantago coronopus, Crassula tillaea).",
  "periode": "Identifiables toute l'année ; végétation optimale au printemps.",
  "confusions": "Avec les chemins non empierrés des dunes fixées (2.1g), formés par le seul piétinement, sans apport de matériaux : on reste alors dans un habitat de dune fixée, dégradé mais restaurable. Les routes asphaltées n'accueillent plus de végétation.",
  "dynamique": "Dynamique à préciser. Ces chemins peuvent être en contact avec n'importe quel habitat dunaire.",
  "sansReleve": "Aucun relevé : unité définie par l'absence de végétation. À déclarer comme un quadrat sans végétation (sol nu)."
 },
 {
  "id": "2.6b",
  "fiche": "2.6",
  "ordre": 28,
  "zone": "Milieux anthropiques",
  "rang": null,
  "groupe": "Chemins",
  "nomFr": "Pelouses à Crassule mousse et Sagine apétale des chemins empierrés",
  "nomFiche": "Chemins empierrés des dunes",
  "syntaxon": "Crassulo tillaeae - Saginetum apetalae Rivas-Martinez 1975",
  "codes": {
   "eunis": "H5.61",
   "corine": "-",
   "eur28": "-",
   "cahiers": "-"
  },
  "nbReleves": 2,
  "especes": [
   {
    "latin": "Poa bulbosa",
    "fr": "Pâturin bulbeux",
    "statut": "car",
    "constance": 100
   },
   {
    "latin": "Plantago coronopus subsp. coronopus",
    "fr": "Plantain corne-de-cerf",
    "statut": "freq",
    "constance": 100
   },
   {
    "latin": "Aphanes microcarpa",
    "fr": "Alchémille à petits fruits",
    "statut": "car",
    "constance": 100
   },
   {
    "latin": "Sherardia arvensis",
    "fr": "Rubéole des champs",
    "statut": "freq",
    "constance": 100
   },
   {
    "latin": "Aira praecox",
    "fr": "Canche printanière",
    "statut": "freq",
    "constance": 100
   },
   {
    "latin": "Crassula tillaea",
    "fr": "Crassule mousse",
    "statut": "car",
    "constance": 100
   },
   {
    "latin": "Sagina apetala",
    "fr": "Sagine apétale",
    "statut": "car",
    "constance": 100
   },
   {
    "latin": "Carex arenaria",
    "fr": "Laîche des sables",
    "statut": "freq",
    "constance": 100
   },
   {
    "latin": "Plantago lanceolata",
    "fr": "Plantain lancéolé",
    "statut": "freq",
    "constance": 100
   },
   {
    "latin": "Dactylis glomerata",
    "fr": "Dactyle aggloméré",
    "statut": "freq",
    "constance": 100
   },
   {
    "latin": "Trifolium suffocatum",
    "fr": "Trèfle étouffé",
    "statut": "freq",
    "constance": 100
   },
   {
    "latin": "Homalothecium lutescens",
    "fr": "Homalothecium lutescens (mousse)",
    "statut": "freq",
    "constance": 50,
    "groupe": "bryolichenique"
   },
   {
    "latin": "Ptychostomum compactum",
    "fr": "Ptychostomum compactum (mousse)",
    "statut": "freq",
    "constance": 50,
    "groupe": "bryolichenique"
   },
   {
    "latin": "Thymus drucei",
    "fr": "Thym de Bretagne",
    "statut": "freq",
    "constance": 50
   },
   {
    "latin": "Erodium cicutarium",
    "fr": "Bec-de-grue commun",
    "statut": "freq",
    "constance": 50
   },
   {
    "latin": "Leontodon saxatilis",
    "fr": "Liondent des rochers",
    "statut": "freq",
    "constance": 50
   },
   {
    "latin": "Trifolium ornithopodioides",
    "fr": "Trèfle pied-d'oiseau",
    "statut": "freq",
    "constance": 50
   },
   {
    "latin": "Vulpia myuros",
    "fr": "Vulpie queue-de-rat",
    "statut": "freq",
    "constance": 50
   },
   {
    "latin": "Anagallis arvensis",
    "fr": "Mouron rouge",
    "statut": "freq",
    "constance": 50
   },
   {
    "latin": "Arenaria serpyllifolia",
    "fr": "Sabline à feuilles de serpolet",
    "statut": "freq",
    "constance": 50
   },
   {
    "latin": "Catapodium rigidum",
    "fr": "Catapode rigide",
    "statut": "freq",
    "constance": 50
   },
   {
    "latin": "Cerastium diffusum subsp. diffusum",
    "fr": "Céraiste à quatre étamines",
    "statut": "freq",
    "constance": 50
   },
   {
    "latin": "Cynodon dactylon",
    "fr": "Chiendent pied-de-poule",
    "statut": "freq",
    "constance": 50
   },
   {
    "latin": "Didymodon vinealis",
    "fr": "Didymodon vinealis (mousse)",
    "statut": "freq",
    "constance": 50,
    "groupe": "bryolichenique"
   },
   {
    "latin": "Ephedra distachya subsp. distachya",
    "fr": "Éphèdre à deux épis (Raisin de mer)",
    "statut": "freq",
    "constance": 50
   },
   {
    "latin": "Geranium molle",
    "fr": "Géranium à feuilles molles",
    "statut": "freq",
    "constance": 50
   },
   {
    "latin": "Parentucellia latifolia",
    "fr": "Parentucelle à larges feuilles",
    "statut": "freq",
    "constance": 50
   },
   {
    "latin": "Bellis perennis subsp. perennis",
    "fr": "Pâquerette",
    "statut": "freq",
    "constance": 50
   },
   {
    "latin": "Myosotis ramosissima",
    "fr": "Myosotis rameux",
    "statut": "freq",
    "constance": 50
   },
   {
    "latin": "Saxifraga tridactylites",
    "fr": "Saxifrage à trois doigts",
    "statut": "freq",
    "constance": 50
   }
  ],
  "description": "Chemins empierrés et parkings portant une végétation à Crassula tillaea, Sagina apetala, Poa bulbosa et Aphanes microcarpa. Assez présente sur le site, observable seulement un court moment au printemps.",
  "ecologie": "Chemins artificiels créés dans le massif par apport de cailloux, graviers ou gravats, pour stabiliser le sable et permettre le passage de véhicules. Substrat empierré très drainant, donc très sec, et fortes amplitudes thermiques.",
  "physionomie": "Physionomie très ouverte, la végétation n'occupant qu'une faible surface, en bords et milieu de piste : taxons supportant le piétinement ou le passage d'engins (Cynodon dactylon, Poa annua, Poa bulbosa, Sagina apetala, Plantago coronopus, Crassula tillaea).",
  "periode": "Identifiables toute l'année ; végétation optimale au printemps.",
  "confusions": "Avec les chemins non empierrés des dunes fixées (2.1g), formés par le seul piétinement, sans apport de matériaux : on reste alors dans un habitat de dune fixée, dégradé mais restaurable. Les routes asphaltées n'accueillent plus de végétation.",
  "dynamique": "Dynamique à préciser. Ces chemins peuvent être en contact avec n'importe quel habitat dunaire."
 }
];

/* Gradient dunaire, de la mer vers l'intérieur. Le document de Delassus ne
   propose aucun schéma de zonation : cette séquence est reconstruite à partir
   des rubriques « Dynamique et contacts » des fiches. Les friches et les
   chemins empierrés sont hors gradient (milieux anthropiques), et les
   caoudeyres sont traitées comme une situation de déflation de la dune
   semi-fixée. */
const PROFIL_ZONATION_DUNES = [
  {
    "zone": "Haut de plage",
    "rang": 1,
    "fiches": [
      "1.1a",
      "1.1b",
      "1.1c"
    ]
  },
  {
    "zone": "Dune embryonnaire",
    "rang": 2,
    "fiches": [
      "1.2a",
      "1.2b"
    ]
  },
  {
    "zone": "Dune blanche",
    "rang": 3,
    "fiches": [
      "1.3a"
    ]
  },
  {
    "zone": "Dune semi-fixée",
    "rang": 4,
    "fiches": [
      "1.3b",
      "1.3c"
    ]
  },
  {
    "zone": "Dune grise",
    "rang": 5,
    "fiches": [
      "2.1a",
      "2.1b",
      "2.1c",
      "2.1d",
      "2.1e",
      "2.1f",
      "2.1g",
      "2.1h",
      "2.1i"
    ]
  },
  {
    "zone": "Dune fixée, prairies",
    "rang": 6,
    "fiches": [
      "2.2a",
      "2.2b"
    ]
  },
  {
    "zone": "Fourrés et boisements",
    "rang": 7,
    "fiches": [
      "2.3",
      "2.4a",
      "2.4b"
    ]
  },
  {
    "zone": "Milieux anthropiques",
    "rang": null,
    "fiches": [
      "2.5a",
      "2.5b",
      "2.5c",
      "2.5d",
      "2.6a",
      "2.6b"
    ]
  }
];

