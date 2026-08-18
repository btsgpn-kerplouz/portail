/* =========================================================
   DONNEES — Typologie des végétations et des habitats
   des marais salés de la Petite Mer de Gâvres (56)
   Source : COLASSE V., 2019 - CBN de Brest, DREAL Bretagne,
   Conservatoire du littoral. 89 p., 3 annexes.

   statut espèce :
     "car"    = espèce caractéristique (combinaison caractéristique
                du syntaxon, incl. différentielles et unités supérieures)
     "freq"   = espèce fréquente / compagne, non caractéristique
     "absent" = citée comme caractéristique du syntaxon ailleurs
                mais rare ou non observée sur le site
   ========================================================= */
const HABITATS = [

// ---------- III.1 Herbiers marins ----------
{
  id:1, groupe:"Herbiers marins", zonation:"Basse slikke", ordre:1, zone:"Slikke",
  nomFr:"Herbier marin à Zostère naine",
  syntaxon:"Zosteretum noltii (Oberdorfer 1957) Gutte 1966",
  codes:{eunis:"A2.611",corine:"13.2",eur28:"1160",cahiers:"-"},
  especes:[
    {latin:"Zostera noltii", fr:"Zostère naine", statut:"car"}
  ],
  physionomie:"Herbier sous-marin de la zone médiolittorale, plus ou moins ouvert, dominé par Zostera noltii mêlé d'algues. Floraison juin-août, fructification juillet-septembre.",
  ecologie:"Plateaux sablo-vaseux à vaseux de la slikke (se découvrant aux grandes marées), eaux peu profondes (0,1 à 1,5 m) — végétation la plus basse du transect.",
  confusions:"Aucune sur le site.",
  dynamique:"Pas de dynamique particulière (fortes contraintes écologiques). Contact supérieur (vers la terre) avec la haute slikke : prairies à spartines (fiche 2) et salicornes annuelles de la haute slikke (fiche 3)."
},

// ---------- III.2 Végétations vivaces des vases salées ----------
{
  id:2, groupe:"Végétations vivaces des vases salées", zonation:"Haute slikke / fond de chenaux", ordre:2, zone:"Slikke",
  nomFr:"Prairies de la haute slikke à spartines",
  syntaxon:"Spartinetum maritimae (Emberger & Regnier 1926) Corillion 1953 / Spartinetum anglicae Corillion 1953",
  codes:{eunis:"A2.554",corine:"15.21",eur28:"1320",cahiers:"1320-1"},
  especes:[
    {latin:"Spartina maritima", fr:"Spartine maritime", statut:"car"},
    {latin:"Spartina x townsendii var. anglica", fr:"Spartine d'Angleterre", statut:"car"},
    {latin:"Arthrocnemum perenne", fr:"Salicorne vivace", statut:"car"},
    {latin:"Puccinellia maritima", fr:"Puccinellie maritime", statut:"freq"},
    {latin:"Salicornia procumbens gr.", fr:"Salicorne (gr. procumbens)", statut:"freq"},
    {latin:"Limonium vulgare", fr:"Lavande de mer", statut:"freq"}
  ],
  physionomie:"Végétation herbacée dressée et élevée (jusqu'à ~1 m pour S. x townsendii var. anglica), nettement dominée par une spartine, en îlots ou prés plus ou moins denses.",
  ecologie:"Colonise les vases nues en cours de stabilisation du haut de la slikke, ainsi que les chenaux larges et profonds du schorre.",
  confusions:"Aucune sur le site.",
  dynamique:"Végétation pionnière fixatrice de substrat, précédant les végétations du bas schorre. Contact avec l'herbier à Zostère naine (fiche 1), les salicornes annuelles de la haute slikke (fiche 3), et le fourré à Salicorne vivace du bas schorre (fiche 5)."
},

// ---------- III.3 Communautés éphémères des vases salées ----------
{
  id:3, groupe:"Communautés éphémères des vases salées", zonation:"Haute slikke", ordre:3, zone:"Slikke",
  nomFr:"Végétations annuelles de la haute slikke à salicornes",
  syntaxon:"Salicornion dolichostachyo-fragilis Géhu & Rivas-Mart. ex Géhu in Bardat et al. 2004 (Salicornietum dolichostachyae, Salicornietum fragilis, Salicornietum obscurae)",
  codes:{eunis:"A2.5512",corine:"15.1111",eur28:"1310",cahiers:"1310-1"},
  especes:[
    {latin:"Salicornia dolichostachya", fr:"Salicorne à longs épis", statut:"car"},
    {latin:"Salicornia fragilis", fr:"Salicorne fragile", statut:"car"},
    {latin:"Salicornia obscura", fr:"Salicorne obscure", statut:"car"},
    {latin:"Salicornia europaea", fr:"Salicorne d'Europe", statut:"car"},
    {latin:"Salicornia ramosissima", fr:"Salicorne rameuse", statut:"car"},
    {latin:"Salicornia emerici/nitens", fr:"Salicorne (gr. emerici/nitens)", statut:"car"},
    {latin:"Salicornia obscura x ramosissima", fr:"Salicorne (hybride obscura x ramosissima)", statut:"car"},
    {latin:"Suaeda maritima", fr:"Soude maritime", statut:"car"},
    {latin:"Arthrocnemum perenne", fr:"Salicorne vivace", statut:"freq"},
    {latin:"Puccinellia maritima", fr:"Puccinellie maritime", statut:"freq"},
    {latin:"Spartina maritima", fr:"Spartine maritime", statut:"freq"},
    {latin:"Spartina x townsendii var. anglica", fr:"Spartine d'Angleterre", statut:"freq"},
    {latin:"Limonium vulgare", fr:"Lavande de mer", statut:"freq"},
    {latin:"Halimione portulacoides", fr:"Obione faux-pourpier", statut:"freq"},
    {latin:"Spergularia media", fr:"Spergulaire intermédiaire", statut:"freq"}
  ],
  physionomie:"Végétation herbacée basse et ouverte, une seule strate, teinte jaune/verte se ternissant en automne. Meilleure période d'observation : fin d'été jusqu'aux grandes marées d'équinoxe.",
  ecologie:"Vases de la haute slikke atteintes à chaque marée haute ; sols limoneux à sablo-limoneux ; salinité proche de l'eau de mer, jamais d'assèchement. Aussi en dépressions du bas schorre et marges de chenaux.",
  confusions:"Avec la fiche 4 (salicornes du schorre) : groupe procumbens ici (fleurs latérales de la cyme ≈ égales à la centrale) contre groupe europaea pour la fiche 4 (fleurs latérales nettement inférieures ou absentes).",
  dynamique:"Végétations pionnières instables. Souvent en mosaïque avec les prairies à spartines (fiche 2). Contact supérieur avec le fourré à Salicorne vivace du bas schorre (fiche 5) ou le pré salé à Puccinellie maritime (fiche 9)."
},

// ---------- III.3 (suite) ----------
{
  id:4, groupe:"Communautés éphémères des vases salées", zonation:"Haut schorre / très haut schorre (annuelle)", ordre:16, zone:"Très haut schorre / contact dune",
  nomFr:"Végétations annuelles du schorre à salicornes",
  syntaxon:"Salicornion europaeo-ramosissimae Géhu & Géhu-Franck ex Rivas-Mart. 1990 (Salicornietum pusillo-ramosissimae, Salicornietum ramosissimae-nitentis, Salicornietum x marshallii, Suaedetum maritimae vulgaris)",
  codes:{eunis:"A2.5513",corine:"15.1112",eur28:"1310",cahiers:"1310-2"},
  especes:[
    {latin:"Salicornia europaea", fr:"Salicorne d'Europe", statut:"car"},
    {latin:"Salicornia pusilla", fr:"Salicorne naine", statut:"car"},
    {latin:"Salicornia ramosissima", fr:"Salicorne rameuse", statut:"car"},
    {latin:"Salicornia x marshallii", fr:"Salicorne de Marshall", statut:"car"},
    {latin:"Suaeda maritima", fr:"Soude maritime", statut:"car"},
    {latin:"Salicornia emerici/nitens", fr:"Salicorne (gr. emerici/nitens)", statut:"car"},
    {latin:"Salicornia obscura x ramosissima", fr:"Salicorne (hybride obscura x ramosissima)", statut:"car"},
    {latin:"Puccinellia maritima", fr:"Puccinellie maritime", statut:"freq"},
    {latin:"Elymus pycnanthus", fr:"Chiendent du littoral", statut:"freq"},
    {latin:"Halimione portulacoides", fr:"Obione faux-pourpier", statut:"freq"},
    {latin:"Arthrocnemum perenne", fr:"Salicorne vivace", statut:"freq"},
    {latin:"Arthrocnemum fruticosum", fr:"Salicorne ligneuse", statut:"freq"},
    {latin:"Limonium vulgare", fr:"Lavande de mer", statut:"freq"},
    {latin:"Scirpus maritimus", fr:"Scirpe maritime", statut:"freq"},
    {latin:"Juncus gerardi", fr:"Jonc de Gérard", statut:"freq"},
    {latin:"Juncus maritimus", fr:"Jonc maritime", statut:"freq"},
    {latin:"Aster tripolium", fr:"Aster maritime", statut:"freq"},
    {latin:"Triglochin maritima", fr:"Troscart maritime", statut:"freq"},
    {latin:"Spergularia media", fr:"Spergulaire intermédiaire", statut:"freq"},
    {latin:"Suaeda vera", fr:"Soude ligneuse", statut:"freq"},
    {latin:"Atriplex littoralis", fr:"Arroche des grèves", statut:"freq"},
    {latin:"Atriplex prostrata", fr:"Arroche couchée", statut:"freq"},
    {latin:"Plantago maritima", fr:"Plantain maritime", statut:"freq"}
  ],
  physionomie:"Végétation herbacée basse, plus ou moins ouverte, dominée par les salicornes annuelles (parfois Suaeda maritima) ; rougissement en fin de saison. Meilleure période d'observation : fin d'été jusqu'aux grandes marées d'équinoxe.",
  ecologie:"Haut schorre, substrats vaseux à sableux (cuvettes, replats, banquettes de chenaux, pourtour d'anciennes salines) ; humidité et salinité très variables, marée rarement atteinte ; chlorures pouvant dépasser l'eau de mer en été.",
  confusions:"Avec la fiche 3 (haute slikke), distinguée par une position plus basse et le groupe procumbens.",
  dynamique:"Végétations pionnières instables, pouvant évoluer vers le pré salé à Puccinellie maritime (fiche 9) par exhaussement du substrat. Mosaïque fréquente avec fiche 9 et le fourré à Obione faux-pourpier (fiche 6)."
},

// ---------- III.4 Fourrés nains crassulescents littoraux ----------
{
  id:5, groupe:"Fourrés nains crassulescents littoraux", zonation:"Bas schorre", ordre:4, zone:"Bas / moyen schorre",
  nomFr:"Fourré halophile du bas schorre à Salicorne vivace",
  syntaxon:"Puccinellio maritimae - Salicornietum perennis (Arènes 1933) Géhu 1976",
  codes:{eunis:"A2.5272",corine:"15.622 / 15.621 / 15.624",eur28:"1330 / 1420",cahiers:"1330-1 / 1330-2 / 1420-1"},
  especes:[
    {latin:"Arthrocnemum perenne", fr:"Salicorne vivace", statut:"car"},
    {latin:"Puccinellia maritima", fr:"Puccinellie maritime", statut:"car"},
    {latin:"Halimione portulacoides", fr:"Obione faux-pourpier", statut:"car"},
    {latin:"Suaeda maritima", fr:"Soude maritime", statut:"freq"},
    {latin:"Limonium vulgare", fr:"Lavande de mer", statut:"freq"},
    {latin:"Spergularia media", fr:"Spergulaire intermédiaire", statut:"freq"},
    {latin:"Suaeda vera", fr:"Soude ligneuse", statut:"freq"},
    {latin:"Aster tripolium", fr:"Aster maritime", statut:"freq"},
    {latin:"Plantago maritima", fr:"Plantain maritime", statut:"freq"},
    {latin:"Triglochin maritima", fr:"Troscart maritime", statut:"freq"}
  ],
  physionomie:"Végétation plus ou moins dense dominée par Arthrocnemum perenne, visible une grande partie de l'année, développement optimal en été.",
  ecologie:"Bas schorre, préférentiellement estrans graveleux à caillouteux sujets à agitation de l'eau ; peut border les microfalaises d'érosion du schorre.",
  confusions:"Ne pas confondre avec les salicornes annuelles de la haute slikke (fiche 3) ou du schorre (fiche 4).",
  dynamique:"Peut coloniser la haute slikke avant Puccinellia maritima, accélérant la sédimentation. Contact aval avec la haute slikke (fiches 2, 3) ; contact amont avec le moyen schorre (fourré à Obione, fiche 6 ; forme secondaire du pré salé à Puccinellie, fiche 9)."
},
{
  id:6, groupe:"Fourrés nains crassulescents littoraux", zonation:"Moyen schorre", ordre:6, zone:"Bas / moyen schorre",
  nomFr:"Fourré halophile du moyen schorre à Obione faux-pourpier",
  syntaxon:"Halimionetum portulacoidis Kuhnholtz-Lordat 1927",
  codes:{eunis:"A2.5271",corine:"15.623",eur28:"1420",cahiers:"1420-1"},
  especes:[
    {latin:"Halimione portulacoides", fr:"Obione faux-pourpier", statut:"car"},
    {latin:"Arthrocnemum perenne", fr:"Salicorne vivace", statut:"car"},
    {latin:"Limonium vulgare", fr:"Lavande de mer", statut:"freq"},
    {latin:"Salicornia sp.", fr:"Salicorne", statut:"freq"},
    {latin:"Aster tripolium", fr:"Aster maritime", statut:"freq"},
    {latin:"Plantago maritima", fr:"Plantain maritime", statut:"freq"},
    {latin:"Puccinellia maritima", fr:"Puccinellie maritime", statut:"freq"},
    {latin:"Spartina maritima", fr:"Spartine maritime", statut:"freq"},
    {latin:"Spartina x townsendii var. anglica", fr:"Spartine d'Angleterre", statut:"freq"}
  ],
  physionomie:"Végétation basse, très dense, sempervirente et sous-frutescente, quasi-monospécifique à Halimione portulacoides, aspect argenté ; visible toute l'année, optimum fin d'été.",
  ecologie:"Moyen schorre (remonte le long des chenaux jusqu'au haut schorre) ; sols limoneux à limono-argileux riches en sels, bien aérés ; défavorisée par tassement du sol ou cuvettes.",
  confusions:"Aucune sur le site.",
  dynamique:"Végétation climacique du niveau moyen ; disparaît par tassement (piétinement, pâturage, engins) au profit du pré salé à Puccinellie (fiche 9). Contact aval avec le fourré à Salicorne vivace (fiche 5) ; contact amont avec le pré salé à Jonc de Gérard (fiche 11), le pré salé des cuvettes (fiche 12) et le fourré à Salicorne ligneuse (fiche 7)."
},
{
  id:7, groupe:"Fourrés nains crassulescents littoraux", zonation:"Haut schorre", ordre:8, zone:"Haut schorre",
  nomFr:"Fourré halophile du haut schorre à Salicorne ligneuse",
  syntaxon:"Puccinellio maritimae - Salicornietum fruticosae (Arènes 1933) Géhu (1975) 1976",
  codes:{eunis:"A2.5274",corine:"n.c.",eur28:"n.c.",cahiers:"n.c."},
  especes:[
    {latin:"Arthrocnemum fruticosum", fr:"Salicorne ligneuse", statut:"car"},
    {latin:"Arthrocnemum perenne", fr:"Salicorne vivace", statut:"car"},
    {latin:"Halimione portulacoides", fr:"Obione faux-pourpier", statut:"car"},
    {latin:"Puccinellia maritima", fr:"Puccinellie maritime", statut:"freq"},
    {latin:"Plantago maritima", fr:"Plantain maritime", statut:"freq"},
    {latin:"Aster tripolium", fr:"Aster maritime", statut:"freq"},
    {latin:"Limonium vulgare", fr:"Lavande de mer", statut:"freq"},
    {latin:"Suaeda maritima", fr:"Soude maritime", statut:"freq"},
    {latin:"Spartina x townsendii var. anglica", fr:"Spartine d'Angleterre", statut:"freq"},
    {latin:"Spergularia media", fr:"Spergulaire intermédiaire", statut:"freq"},
    {latin:"Triglochin maritima", fr:"Troscart maritime", statut:"freq"}
  ],
  physionomie:"Végétation de taille moyenne, sous-frutescente, assez dense, dominée par Arthrocnemum fruticosum et Halimione portulacoides ; développement souvent linéaire ; visible toute l'année, optimum fin d'été.",
  ecologie:"Transition moyen schorre / haut schorre, substrat sablo-vaseux bien drainé.",
  confusions:"Aucune sur le site.",
  dynamique:"Contact aval au-dessus du fourré à Obione (fiche 6) ; contact amont avec la prairie du très haut schorre à Chiendent (fiche 17)."
},
{
  id:8, groupe:"Fourrés nains crassulescents littoraux", zonation:"Bordure du schorre / très haut schorre", ordre:15, zone:"Très haut schorre / contact dune",
  nomFr:"Fourré halophile des bordures du schorre à Soude ligneuse",
  syntaxon:"Agropyro pungentis - Suaedetum verae Géhu 1976",
  codes:{eunis:"A2.5273",corine:"n.c.",eur28:"n.c.",cahiers:"n.c."},
  especes:[
    {latin:"Suaeda vera", fr:"Soude ligneuse", statut:"car"},
    {latin:"Elymus pycnanthus", fr:"Chiendent du littoral", statut:"car"},
    {latin:"Halimione portulacoides", fr:"Obione faux-pourpier", statut:"car"},
    {latin:"Arthrocnemum fruticosum", fr:"Salicorne ligneuse", statut:"car"},
    {latin:"Juncus maritimus", fr:"Jonc maritime", statut:"freq"},
    {latin:"Suaeda maritima", fr:"Soude maritime", statut:"freq"},
    {latin:"Arthrocnemum perenne", fr:"Salicorne vivace", statut:"freq"},
    {latin:"Puccinellia maritima", fr:"Puccinellie maritime", statut:"freq"}
  ],
  physionomie:"Végétation assez haute (0,5 à 1 m) et dense, dominée par les buissons bas de Suaeda vera, souvent avec Elymus pycnanthus et Halimione portulacoides ; développement linéaire ; optimum fin d'été.",
  ecologie:"Frange sur les bordures du haut schorre ou sommets de buttes, limite supérieure atteinte par la marée ; substrats sablo-limoneux, parfois riches en éléments grossiers.",
  confusions:"Aucune sur le site.",
  dynamique:"Zones de contact schorre/dune, au-dessus ou en mélange avec les prés salés à statices et Frankénie (fiche 13) ; en dessous des prairies du très haut schorre à Chiendent (fiche 17)."
},

// ---------- III.5 Prés salés et prairies saumâtres ----------
{
  id:9, groupe:"Prés salés et prairies saumâtres", zonation:"Bas à moyen schorre", ordre:5, zone:"Bas / moyen schorre",
  nomFr:"Pré salé du bas (à moyen) schorre à Puccinellie maritime",
  syntaxon:"Puccinellietum maritimae Christiansen 1927",
  codes:{eunis:"A2.542",corine:"15.32 / 15.333",eur28:"1330",cahiers:"1330-1(-2) / 1330-3"},
  especes:[
    {latin:"Puccinellia maritima", fr:"Puccinellie maritime", statut:"car"},
    {latin:"Halimione portulacoides", fr:"Obione faux-pourpier", statut:"car"},
    {latin:"Salicornia dolichostachya/fragilis", fr:"Salicorne à longs épis / fragile", statut:"car"},
    {latin:"Aster tripolium", fr:"Aster maritime", statut:"car"},
    {latin:"Limonium vulgare", fr:"Lavande de mer", statut:"car"},
    {latin:"Spergularia media", fr:"Spergulaire intermédiaire", statut:"car"},
    {latin:"Suaeda maritima", fr:"Soude maritime", statut:"freq"},
    {latin:"Salicornia europaea/obscura", fr:"Salicorne d'Europe / obscure", statut:"freq"}
  ],
  physionomie:"Tapis graminéen dense, peu élevé, dominé par Puccinellia maritima (couleur vert-glauque caractéristique), accompagné d'Halimione portulacoides ; optimal en été.",
  ecologie:"Substrats vaseux plus ou moins consolidés ; bas schorre (cuvettes internes, bords de chenaux) en situation primaire, ou moyen à haut schorre en situation secondaire.",
  confusions:"Aucune sur le site.",
  dynamique:"En situation primaire, succède aux salicornes annuelles de la haute slikke (fiche 3). Contact aval avec le fourré à Obione (fiche 6), qu'elle peut remplacer en cas de tassement du sol. Contact amont avec le pré salé à Jonc de Gérard (fiche 11) et le pré salé des cuvettes (fiche 12)."
},
{
  id:11, groupe:"Prés salés et prairies saumâtres", zonation:"Haut schorre", ordre:10, zone:"Haut schorre",
  nomFr:"Pré salé du haut schorre à Jonc de Gérard",
  syntaxon:"Juncetum gerardii Warming 1906",
  codes:{eunis:"A2.5311",corine:"15.33D",eur28:"1330",cahiers:"1330-4"},
  especes:[
    {latin:"Juncus gerardi", fr:"Jonc de Gérard", statut:"car"},
    {latin:"Halimione portulacoides", fr:"Obione faux-pourpier", statut:"car"},
    {latin:"Suaeda maritima", fr:"Soude maritime", statut:"car"},
    {latin:"Aster tripolium", fr:"Aster maritime", statut:"car"},
    {latin:"Triglochin maritima", fr:"Troscart maritime", statut:"car"},
    {latin:"Plantago maritima", fr:"Plantain maritime", statut:"car"},
    {latin:"Limonium vulgare", fr:"Lavande de mer", statut:"car"},
    {latin:"Atriplex prostrata", fr:"Arroche couchée", statut:"car"},
    {latin:"Glaux maritima", fr:"Glaux maritime", statut:"car"},
    {latin:"Cochlearia anglica", fr:"Cochléaire anglaise", statut:"car"},
    {latin:"Festuca rubra subsp. litoralis", fr:"Fétuque littorale", statut:"freq"},
    {latin:"Elymus pycnanthus", fr:"Chiendent du littoral", statut:"freq"},
    {latin:"Scirpus maritimus", fr:"Scirpe maritime", statut:"freq"},
    {latin:"Juncus maritimus", fr:"Jonc maritime", statut:"freq"}
  ],
  physionomie:"Prairie dense, dominée par Juncus gerardii, souvent bistratifiée ; occupe souvent de petites surfaces ; optimum en été.",
  ecologie:"Haut schorre, substrats filtrants sablo-limoneux à sablo-argileux, très légèrement infiltrés d'eau douce phréatique ; inondations marines peu fréquentes.",
  confusions:"Aucune sur le site.",
  dynamique:"Contact amont avec les roselières saumâtres (fiche 19) et les prairies saumâtres à Jonc maritime (fiche 14)."
},
{
  id:12, groupe:"Prés salés et prairies saumâtres", zonation:"Cuvettes du haut schorre", ordre:11, zone:"Haut schorre",
  nomFr:"Pré salé des cuvettes du haut schorre à Plantain maritime et Lavande de mer",
  syntaxon:"Plantagini maritimae - Limonietum vulgaris Westhoff & Segal 1961",
  codes:{eunis:"A2.5317",corine:"15.33A",eur28:"1330",cahiers:"1330-3"},
  especes:[
    {latin:"Limonium vulgare", fr:"Lavande de mer", statut:"car"},
    {latin:"Triglochin maritima", fr:"Troscart maritime", statut:"car"},
    {latin:"Plantago maritima", fr:"Plantain maritime", statut:"car"},
    {latin:"Arthrocnemum perenne", fr:"Salicorne vivace", statut:"car"},
    {latin:"Cochlearia anglica", fr:"Cochléaire anglaise", statut:"car"},
    {latin:"Puccinellia maritima", fr:"Puccinellie maritime", statut:"car"},
    {latin:"Armeria maritima", fr:"Armérie maritime", statut:"car"},
    {latin:"Aster tripolium", fr:"Aster maritime", statut:"car"},
    {latin:"Juncus gerardi", fr:"Jonc de Gérard", statut:"car"},
    {latin:"Festuca rubra subsp. litoralis", fr:"Fétuque littorale", statut:"car"},
    {latin:"Spergularia media", fr:"Spergulaire intermédiaire", statut:"car"},
    {latin:"Halimione portulacoides", fr:"Obione faux-pourpier", statut:"freq"},
    {latin:"Salicornia sp.", fr:"Salicorne", statut:"freq"},
    {latin:"Parapholis strigosa", fr:"Lepture droit", statut:"freq"},
    {latin:"Suaeda maritima", fr:"Soude maritime", statut:"freq"},
    {latin:"Juncus maritimus", fr:"Jonc maritime", statut:"freq"}
  ],
  physionomie:"Prairie basse et dense, codominance visuelle de Plantago maritima et Limonium vulgare, floraison mauve massive en été.",
  ecologie:"Moyen et haut schorre, cuvettes et dépressions à fond plat où le drainage est ralenti ; submersions marines rares à exceptionnelles.",
  confusions:"Aucune sur le site.",
  dynamique:"Contact fréquent avec le fourré à Obione (fiche 6) ; contacts du bas au haut schorre avec le pré salé à Jonc de Gérard (fiche 11) et les prairies saumâtres à Jonc maritime (fiche 14)."
},
{
  id:13, groupe:"Prés salés et prairies saumâtres", zonation:"Contact schorre/dune", ordre:19, zone:"Très haut schorre / contact dune",
  nomFr:"Prés salés du contact schorre/dune à statices et Frankénie lisse",
  syntaxon:"Limonio ovalifolii - Frankenietum laevis Herrera 1995 / Groupement à Limonium auriculae-ursifolium",
  codes:{eunis:"A2.531D",corine:"n.c.",eur28:"n.c.",cahiers:"n.c."},
  especes:[
    {latin:"Limonium ovalifolium", fr:"Statice à feuilles ovales", statut:"car"},
    {latin:"Frankenia laevis", fr:"Frankénie lisse", statut:"car"},
    {latin:"Limonium auriculae-ursifolium", fr:"Statice oreille d'ours", statut:"car"},
    {latin:"Limonium dodartii", fr:"Statice de Dodart", statut:"car"},
    {latin:"Armeria maritima", fr:"Armérie maritime", statut:"car"},
    {latin:"Festuca rubra subsp. litoralis", fr:"Fétuque littorale", statut:"car"},
    {latin:"Puccinellia maritima", fr:"Puccinellie maritime", statut:"car"},
    {latin:"Plantago maritima", fr:"Plantain maritime", statut:"car"},
    {latin:"Aster tripolium", fr:"Aster maritime", statut:"car"},
    {latin:"Spergularia media", fr:"Spergulaire intermédiaire", statut:"car"},
    {latin:"Juncus gerardi", fr:"Jonc de Gérard", statut:"car"},
    {latin:"Cochlearia anglica", fr:"Cochléaire anglaise", statut:"car"},
    {latin:"Elymus pycnanthus", fr:"Chiendent du littoral", statut:"freq"},
    {latin:"Halimione portulacoides", fr:"Obione faux-pourpier", statut:"freq"},
    {latin:"Suaeda vera", fr:"Soude ligneuse", statut:"freq"},
    {latin:"Parapholis strigosa", fr:"Lepture droit", statut:"freq"},
    {latin:"Sagina maritima", fr:"Sagine maritime", statut:"freq"},
    {latin:"Plantago coronopus", fr:"Plantain corne-de-cerf", statut:"freq"},
    {latin:"Inula crithmoides", fr:"Inule faux-crithme", statut:"freq"},
    {latin:"Cochlearia danica", fr:"Cochléaire du Danemark", statut:"freq"},
    {latin:"Crithmum maritimum", fr:"Criste marine", statut:"freq"},
    {latin:"Suaeda maritima", fr:"Soude maritime", statut:"freq"},
    {latin:"Catapodium rigidum", fr:"Catapode rigide", statut:"freq"},
    {latin:"Salicornia sp.", fr:"Salicorne", statut:"freq"},
    {latin:"Triglochin bulbosum subsp. barrelieri", fr:"Troscart bulbeux", statut:"freq"},
    {latin:"Arthrocnemum fruticosum", fr:"Salicorne ligneuse", statut:"freq"},
    {latin:"Herniaria ciliolata", fr:"Herniaire ciliée", statut:"freq"},
    {latin:"Melilotus albus", fr:"Mélilot blanc", statut:"freq"},
    {latin:"Juncus maritimus", fr:"Jonc maritime", statut:"freq"},
    {latin:"Anagallis arvensis subsp. arvensis", fr:"Mouron rouge", statut:"freq"},
    {latin:"Cynodon dactylon", fr:"Chiendent pied-de-poule", statut:"freq"},
    {latin:"Linaria arenaria", fr:"Linaire des sables", statut:"freq"},
    {latin:"Sedum anglicum", fr:"Orpin d'Angleterre", statut:"freq"},
    {latin:"Silene vulgaris subsp. maritima", fr:"Silène maritime", statut:"freq"},
    {latin:"Arenaria serpyllifolia subsp. serpyllifolia", fr:"Sabline à feuilles de serpolet", statut:"freq"}
  ],
  physionomie:"Pelouses basses assez ouvertes dominées par un ou plusieurs Limonium, souvent avec Frankenia laevis ; floraison mauve massive des statices en été.",
  ecologie:"Hauts schorres au contact de la dune, exceptionnellement atteints par la marée, substrats sablo-limoneux compacts, humidité très variable. La Petite Mer de Gâvres serait l'unique localité bretonne pour Limonium ovalifolium.",
  confusions:"Aucune sur le site (mais détermination délicate entre les Limonium).",
  dynamique:"Mosaïque très étroite avec la pelouse annuelle à Lepture droit et Sagine maritime (fiche 15) ; contact supérieur avec le fourré à Soude ligneuse (fiche 8) ; contact inférieur avec le fourré à Obione (fiche 6) et les prairies du très haut schorre à Chiendent (fiche 17)."
},
{
  id:14, groupe:"Prés salés et prairies saumâtres", zonation:"Haut schorre saumâtre", ordre:12, zone:"Haut schorre",
  nomFr:"Prairies saumâtres du haut schorre à Jonc maritime",
  syntaxon:"Junco maritimi - Caricetum extensae (Corillion 1953) Parriaux in Géhu 1976 / Oenantho lachenalii - Juncetum maritimi Tüxen 1937",
  codes:{eunis:"A2.531A",corine:"n.c.",eur28:"n.c.",cahiers:"n.c."},
  especes:[
    {latin:"Juncus maritimus", fr:"Jonc maritime", statut:"car"},
    {latin:"Carex extensa", fr:"Laîche étirée", statut:"car"},
    {latin:"Triglochin maritima", fr:"Troscart maritime", statut:"car"},
    {latin:"Samolus valerandi", fr:"Samole de Valerand", statut:"car"},
    {latin:"Oenanthe lachenalii", fr:"Oenanthe de Lachenal", statut:"car"},
    {latin:"Carex distans", fr:"Laîche distante", statut:"car"},
    {latin:"Schoenus nigricans", fr:"Choin noirâtre", statut:"car"},
    {latin:"Juncus gerardi", fr:"Jonc de Gérard", statut:"car"},
    {latin:"Glaux maritima", fr:"Glaux maritime", statut:"car"},
    {latin:"Plantago maritima", fr:"Plantain maritime", statut:"car"},
    {latin:"Limonium vulgare", fr:"Lavande de mer", statut:"car"},
    {latin:"Aster tripolium", fr:"Aster maritime", statut:"car"},
    {latin:"Spergularia media", fr:"Spergulaire intermédiaire", statut:"car"},
    {latin:"Agrostis stolonifera var. pseudopungens", fr:"Agrostide maritime", statut:"freq"},
    {latin:"Elymus pycnanthus", fr:"Chiendent du littoral", statut:"freq"},
    {latin:"Scirpus maritimus", fr:"Scirpe maritime", statut:"freq"},
    {latin:"Juncus ambiguus", fr:"Jonc ambigu", statut:"freq"},
    {latin:"Atriplex prostrata", fr:"Arroche couchée", statut:"freq"},
    {latin:"Salicornia sp.", fr:"Salicorne", statut:"freq"},
    {latin:"Suaeda maritima", fr:"Soude maritime", statut:"freq"},
    {latin:"Phragmites australis", fr:"Roseau commun", statut:"freq"},
    {latin:"Lycopus europaeus", fr:"Lycope d'Europe", statut:"freq"},
    {latin:"Baccharis halimifolia", fr:"Baccharis à feuilles d'arroche", statut:"freq"},
    {latin:"Eupatorium cannabinum", fr:"Eupatoire chanvrine", statut:"freq"},
    {latin:"Calystegia sepium", fr:"Liseron des haies", statut:"freq"},
    {latin:"Thelypteris palustris", fr:"Théliptéris des marais", statut:"freq"},
    {latin:"Apium graveolens", fr:"Céleri sauvage", statut:"freq"},
    {latin:"Pulicaria dysenterica", fr:"Pulicaire dysentérique", statut:"freq"},
    {latin:"Festuca rubra gr.", fr:"Fétuque rouge (gr.)", statut:"freq"}
  ],
  physionomie:"Végétations prairiales denses dominées par Juncus maritimus et/ou Carex extensa, accompagnées d'espèces du schorre et parfois d'espèces subhalophiles/hygrophiles.",
  ecologie:"Haut schorre sur substrats humides saumâtres, dessalés par suintements d'eau douce ; submersions marines exceptionnelles.",
  confusions:"Avec le faciès à Juncus maritimus de la prairie du très haut schorre à Chiendent (fiche 17) : richesse spécifique nettement plus faible et Elymus pycnanthus dominant dans cette dernière.",
  dynamique:"Concurrencée par la roselière à Scirpe maritime (fiche 19) ; peut dériver du pré salé à Jonc de Gérard (fiche 11) par dessalinisation ; contact supérieur avec la prairie à Chiendent du littoral (fiche 17)."
},

// ---------- III.6 Pelouses annuelles halophiles littorales ----------
{
  id:15, groupe:"Pelouses annuelles halophiles littorales", zonation:"Contact schorre/dune", ordre:20, zone:"Très haut schorre / contact dune",
  nomFr:"Pelouse annuelle du contact schorre/dune à Lepture droit et Sagine maritime",
  syntaxon:"Parapholido strigosae - Saginetum maritimae Géhu et al. 1976",
  codes:{eunis:"A2.553",corine:"15.13",eur28:"1310",cahiers:"1310-4"},
  especes:[
    {latin:"Parapholis strigosa", fr:"Lepture droit", statut:"car"},
    {latin:"Sagina maritima", fr:"Sagine maritime", statut:"car"},
    {latin:"Plantago coronopus", fr:"Plantain corne-de-cerf", statut:"car"},
    {latin:"Spergularia marina", fr:"Spergulaire marine", statut:"car"},
    {latin:"Juncus bufonius subsp. minutulus", fr:"Jonc des crapauds", statut:"car"},
    {latin:"Juncus gerardi", fr:"Jonc de Gérard", statut:"car"},
    {latin:"Agrostis stolonifera var. pseudopungens", fr:"Agrostide maritime", statut:"car"},
    {latin:"Catapodium marinum", fr:"Catapode marin", statut:"car"},
    {latin:"Elymus pycnanthus", fr:"Chiendent du littoral", statut:"freq"},
    {latin:"Festuca rubra subsp. litoralis", fr:"Fétuque littorale", statut:"freq"},
    {latin:"Armeria maritima", fr:"Armérie maritime", statut:"freq"},
    {latin:"Limonium ovalifolium", fr:"Statice à feuilles ovales", statut:"freq"},
    {latin:"Catapodium rigidum", fr:"Catapode rigide", statut:"freq"},
    {latin:"Cochlearia danica", fr:"Cochléaire du Danemark", statut:"freq"},
    {latin:"Triglochin bulbosum subsp. barrelieri", fr:"Troscart bulbeux", statut:"freq"},
    {latin:"Suaeda maritima", fr:"Soude maritime", statut:"freq"}
  ],
  physionomie:"Pelouse rase, ouverte à assez dense, dominée par Sagina maritima et Parapholis strigosa, souvent associées à Plantago coronopus.",
  ecologie:"Hauts schorres sablonneux au contact de la dune, exceptionnellement atteints par la marée, substrats sablo-limoneux compacts, humidité très variable.",
  confusions:"Aucune sur le site.",
  dynamique:"Le piétinement favorise Plantago coronopus. Mosaïque très étroite avec la fiche 13 ; contact supérieur avec la fiche 8 ; contact inférieur avec les fiches 6 et 17."
},

// ---------- III.7 Prairies du très haut schorre ----------
{
  id:17, groupe:"Prairies du très haut schorre", zonation:"Très haut schorre", ordre:17, zone:"Très haut schorre / contact dune",
  nomFr:"Prairies du très haut schorre à Chiendent du littoral",
  syntaxon:"Beto maritimae - Agropyretum pungentis (Arènes 1933) Corillion 1953 / Inulo crithmoidis - Elymetum pycnanthi Géhu ex Izco, Guitian et Sanchez 1993",
  codes:{eunis:"A2.511",corine:"15.35",eur28:"1330",cahiers:"1330-5"},
  especes:[
    {latin:"Elymus pycnanthus", fr:"Chiendent du littoral", statut:"car"},
    {latin:"Beta vulgaris subsp. maritima", fr:"Betterave maritime", statut:"car"},
    {latin:"Atriplex prostrata", fr:"Arroche couchée", statut:"car"},
    {latin:"Inula crithmoides", fr:"Inule faux-crithme", statut:"car"},
    {latin:"Juncus maritimus", fr:"Jonc maritime", statut:"car"},
    {latin:"Festuca rubra subsp. litoralis", fr:"Fétuque littorale", statut:"freq"},
    {latin:"Sonchus oleraceus", fr:"Laiteron potager", statut:"freq"},
    {latin:"Atriplex littoralis", fr:"Arroche des grèves", statut:"freq"},
    {latin:"Juncus gerardi", fr:"Jonc de Gérard", statut:"freq"},
    {latin:"Dactylis glomerata", fr:"Dactyle aggloméré", statut:"freq"},
    {latin:"Daucus carota subsp. carota", fr:"Carotte sauvage", statut:"freq"},
    {latin:"Agrostis x murbeckii", fr:"Agrostide hybride", statut:"freq"},
    {latin:"Holcus lanatus", fr:"Houlque laineuse", statut:"freq"},
    {latin:"Matricaria maritima subsp. maritima", fr:"Matricaire maritime", statut:"freq"},
    {latin:"Atriplex laciniata", fr:"Arroche laciniée", statut:"freq"},
    {latin:"Scirpus maritimus", fr:"Scirpe maritime", statut:"freq"},
    {latin:"Baccharis halimifolia", fr:"Baccharis à feuilles d'arroche", statut:"freq"},
    {latin:"Halimione portulacoides", fr:"Obione faux-pourpier", statut:"freq"},
    {latin:"Arthrocnemum perenne", fr:"Salicorne vivace", statut:"freq"},
    {latin:"Limonium vulgare", fr:"Lavande de mer", statut:"freq"}
  ],
  physionomie:"Prairies denses, glauques, pauvres en espèces, très nettement dominées par Elymus pycnanthus, parfois avec Inula crithmoides codominant ; souvent linéaire en bordure du haut schorre.",
  ecologie:"Très haut schorre, substrats sablo-limoneux enrichis en dépôts organiques, exceptionnellement atteint par la marée (marées d'équinoxe), forte dessiccation estivale possible.",
  confusions:"Le faciès à Juncus maritimus ne doit pas être confondu avec les prairies saumâtres du haut schorre à Jonc maritime (fiche 14), de richesse spécifique plus élevée.",
  dynamique:"Se développe souvent après un enrichissement organique par les laisses de mer ; contacts variés avec les prés salés et prairies saumâtres du haut schorre (dont fiche 14)."
},

// ---------- III.9 Roselières saumâtres ----------
{
  id:19, groupe:"Roselières saumâtres", zonation:"Dépressions humides du haut schorre", ordre:7, zone:"Haut schorre",
  nomFr:"Roselière saumâtre à Scirpe maritime",
  syntaxon:"Scirpetum maritimi Langendonck 1932",
  codes:{eunis:"C3.27",corine:"53.17 / 53.11",eur28:"1130 p.p.",cahiers:"1130-1 p.p."},
  especes:[
    {latin:"Scirpus maritimus", fr:"Scirpe maritime", statut:"car"},
    {latin:"Aster tripolium", fr:"Aster maritime", statut:"freq"},
    {latin:"Atriplex prostrata", fr:"Arroche couchée", statut:"freq"},
    {latin:"Puccinellia maritima", fr:"Puccinellie maritime", statut:"freq"},
    {latin:"Halimione portulacoides", fr:"Obione faux-pourpier", statut:"freq"},
    {latin:"Polypogon monspeliensis", fr:"Polypogon de Montpellier", statut:"freq"},
    {latin:"Atriplex littoralis", fr:"Arroche des grèves", statut:"freq"}
  ],
  physionomie:"Roselière dense, de hauteur moyenne (0,75-1,5 m), pauvre en espèces, largement dominée par Scirpus maritimus.",
  ecologie:"Dépressions humides du haut schorre, zones de stagnation d'eau à salinité variable, substrat limoneux à limono-sableux imprégné d'eau salée à saumâtre.",
  confusions:"Aucune sur le site.",
  dynamique:"Stable si l'influence marine reste importante ; peut évoluer vers une roselière à Roseau commun par augmentation des apports d'eau douce."
},

];

/* =========================================================
   PROFIL DE ZONATION — reprend la classification générale du rapport
   (Figure 5 : "Répartition schématique des groupements végétaux des
   marais salés de la Petite Mer de Gâvres depuis la slikke jusqu'au
   très haut schorre", p.83), qui fait autorité sur la position
   typique de chaque habitat dans la zonation.
   Les habitats liés aux bassins saumâtres et aux estuaires (fiches 16,
   20, 21, 22 — anciens marais salants, vases estuariennes) ne sont pas
   traités par cette application : ils sortent du gradient altitudinal
   simple slikke → dune et ne sont pas rencontrés sur le profil de
   Linés utilisé pour ce TP (à l'exception de la fiche 19, présente à
   Linés et conservée ici en "Haut schorre"). Le référentiel HABITATS ne garde
   que les groupements effectivement trouvables sur le site.
   ========================================================= */

const PROFIL_ZONATION = [
  { zone:"Basse slikke", fiches:[1],
    note:"Herbier de zostère, niveau le plus bas, découvert seulement aux grandes marées." },
  { zone:"Haute slikke", fiches:[2, 3],
    note:"Prairies à spartines et végétations annuelles à salicornes de la haute slikke." },
  { zone:"Bas schorre", fiches:[5],
    note:"Fourré halophile à Salicorne vivace." },
  { zone:"Moyen schorre", fiches:[9, 6],
    note:"Pré salé à Puccinellie maritime (situation primaire) et fourré à Obione faux-pourpier." },
  { zone:"Haut schorre", fiches:[4, 7, 11, 12, 14, 8, 19],
    note:"Salicornes annuelles, fourré à Salicorne ligneuse, prés salés (Jonc de Gérard, cuvettes), prairies saumâtres à Jonc maritime, fourré à Soude ligneuse, roselière à Scirpe maritime." },
  { zone:"Très haut schorre", fiches:[17],
    note:"Prairies à Chiendent du littoral." },
  { zone:"Contact schorre/dune", fiches:[13, 15],
    note:"Prés salés à statices/Frankénie lisse, pelouse annuelle à Lepture et Sagine." }
];

/* =========================================================
   CORRESPONDANCE AVEC LE RÉFÉRENTIEL DE PHYTOSCOPE
   Identifiants BaseFlor (champ "id" de apps/phytoscope/taxa.json), utilisés par
   l'export CSV : Phytoscope résout un taxon d'abord par taxon_id, avant le nom
   scientifique. Sans cet id, 35 de nos 85 espèces étaient rejetées à l'import
   ("taxon non reconnu"), faute de correspondance exacte des noms (auteurs,
   sous-espèces, synonymies de genre).

   Établie en rejouant la logique de résolution de Phytoscope, avec trois voies :
   - correspondance exacte ou normalisée du nom (50 espèces) ;
   - repli au rang espèce quand la sous-espèce/variété est absente de leur
     référentiel (16, ex. Festuca rubra subsp. litoralis → Festuca rubra L.) ;
   - synonymie vérifiée à la main (8, ex. Matricaria maritima subsp. maritima →
     Tripleurospermum maritimum, Anagallis arvensis → Lysimachia arvensis).

   ⚠️ 11 espèces restent sans correspondance et seront omises de l'export :
   Agrostis x murbeckii, Melilotus albus, et surtout 9 salicornes (dolichostachya,
   fragilis, obscura, ramosissima, x marshallii, sp., et les déterminations
   incertaines "A/B"). Le référentiel de Phytoscope ne connaît que S. europaea,
   S. procumbens et S. perennans : rattacher les autres relève d'un choix
   taxonomique à trancher, pas d'un simple appariement de chaînes.
   ========================================================= */
const TAXON_PHYTOSCOPE = {
  "Agrostis stolonifera var. pseudopungens": 145,
  "Anagallis arvensis subsp. arvensis": 380,
  "Apium graveolens": 526,
  "Arenaria serpyllifolia subsp. serpyllifolia": 7672,
  "Armeria maritima": 631,
  "Arthrocnemum fruticosum": 6139,
  "Arthrocnemum perenne": 683,
  "Aster tripolium": 787,
  "Atriplex laciniata": 853,
  "Atriplex littoralis": 854,
  "Atriplex prostrata": 850,
  "Baccharis halimifolia": 8183,
  "Beta vulgaris subsp. maritima": 938,
  "Calystegia sepium": 1209,
  "Carex distans": 1365,
  "Carex extensa": 1377,
  "Catapodium marinum": 2157,
  "Catapodium rigidum": 2159,
  "Cochlearia anglica": 1797,
  "Cochlearia danica": 1798,
  "Crithmum maritimum": 1941,
  "Cynodon dactylon": 2000,
  "Dactylis glomerata": 2063,
  "Daucus carota subsp. carota": 2129,
  "Elymus pycnanthus": 2375,
  "Eupatorium cannabinum": 2564,
  "Festuca rubra gr.": 2766,
  "Festuca rubra subsp. litoralis": 2766,
  "Frankenia laevis": 2807,
  "Glaux maritima": 3056,
  "Halimione portulacoides": 3109,
  "Herniaria ciliolata": 3197,
  "Holcus lanatus": 3483,
  "Inula crithmoides": 3621,
  "Juncus ambiguus": 3721,
  "Juncus bufonius subsp. minutulus": 3697,
  "Juncus gerardi": 3712,
  "Juncus maritimus": 3718,
  "Limonium auriculae-ursifolium": 4010,
  "Limonium dodartii": 4014,
  "Limonium ovalifolium": 4038,
  "Limonium vulgare": 4051,
  "Linaria arenaria": 4058,
  "Lycopus europaeus": 4223,
  "Matricaria maritima subsp. maritima": 4270,
  "Oenanthe lachenalii": 4624,
  "Parapholis strigosa": 4947,
  "Phragmites australis": 5076,
  "Plantago coronopus": 5193,
  "Plantago maritima": 5206,
  "Polypogon monspeliensis": 5328,
  "Puccinellia maritima": 5501,
  "Pulicaria dysenterica": 5503,
  "Sagina maritima": 6033,
  "Salicornia europaea": 6050,
  "Salicornia europaea/obscura": 6050,
  "Salicornia procumbens gr.": 6052,
  "Salicornia pusilla": 7602,
  "Samolus valerandi": 6118,
  "Schoenus nigricans": 6250,
  "Scirpus maritimus": 6277,
  "Sedum anglicum": 6359,
  "Silene vulgaris subsp. maritima": 6611,
  "Sonchus oleraceus": 6688,
  "Spartina maritima": 6712,
  "Spartina x townsendii var. anglica": 6714,
  "Spergularia marina": 6724,
  "Spergularia media": 6726,
  "Suaeda maritima": 6802,
  "Suaeda vera": 6806,
  "Thelypteris palustris": 6998,
  "Triglochin bulbosum subsp. barrelieri": 7199,
  "Triglochin maritima": 7202,
  "Zostera noltii": 7600
};
