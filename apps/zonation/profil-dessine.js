/* =========================================================
   PROFIL DE VÉGÉTATION DESSINÉ
   Dans l'esprit des profils de COLASSE (2019, fig. 6) : la végétation de
   chaque quadrat est dessinée au trait, espèce par espèce, sur une ligne de
   sol, pour donner à voir ce que le tableau ne montre pas :
     - la DENSITÉ : le nombre de dessins d'une espèce suit le recouvrement
       médian de son coefficient d'abondance-dominance ;
     - la STRATIFICATION : chaque espèce est dessinée à sa hauteur type, et
       les plus hautes passent derrière les plus basses.

   Il occupe le bas du diagramme de transect, sous les barres d'espèces.

   Limites assumées, rappelées sous la figure :
     - les hauteurs sont des hauteurs TYPES (port adulte habituel sur les
       prés salés), pas des mesures ;
     - aucune altitude n'est relevée : le relief est un PROFIL TYPE déduit de
       la succession des zones, ou le sol est plat au choix.
   ========================================================= */

/* Port (famille de dessin) et hauteur type en cm de chaque espèce du
   référentiel. Les ports reprennent les pictogrammes des profils de
   COLASSE : coussins arrondis de l'obione, touffes dressées des graminées,
   petits candélabres des salicornes annuelles… */
const PORT_ESPECES = {
  // herbiers et annuelles de la slikke
  "Zostera noltii":                        ["herbier", 8],
  "Salicornia europaea s.l.":              ["salicorne", 20],
  "Salicornia procumbens s.l.":            ["salicorne", 20],
  "Salicornia sp.":                        ["salicorne", 20],
  "Suaeda maritima":                       ["soude", 22],
  // chaméphytes et fourrés halophiles
  "Salicornia perennis":                   ["rampant", 12],
  "Halimione portulacoides":               ["coussin", 40],
  "Salicornia pruinosa":                   ["buisson", 45],
  "Suaeda vera":                           ["buisson", 60],
  "Inula crithmoides":                     ["hampe-capitule", 45],
  "Baccharis halimifolia":                 ["buisson", 150],
  // graminées
  "Spartina maritima":                     ["graminee-epi", 35],
  "Spartina x townsendii var. anglica":    ["graminee-epi", 70],
  "Puccinellia maritima":                  ["graminee", 25],
  "Festuca rubra subsp. litoralis":        ["graminee", 30],
  "Festuca rubra gr.":                     ["graminee", 30],
  "Agrostis stolonifera var. pseudopungens":["graminee", 30],
  "Agrostis x murbeckii":                  ["graminee", 30],
  "Elymus pycnanthus":                     ["graminee-epi", 70],
  "Parapholis strigosa":                   ["graminee", 12],
  "Polypogon monspeliensis":               ["graminee", 30],
  "Catapodium marinum":                    ["graminee", 10],
  "Catapodium rigidum":                    ["graminee", 10],
  "Cynodon dactylon":                      ["graminee", 15],
  "Holcus lanatus":                        ["graminee", 50],
  "Dactylis glomerata":                    ["graminee-epi", 70],
  "Phragmites australis":                  ["roseau", 150],
  // joncs, laîches, scirpes
  "Scirpus maritimus":                     ["roseau", 80],
  "Juncus maritimus":                      ["jonc", 90],
  "Juncus gerardi":                        ["jonc", 25],
  "Juncus ambiguus":                       ["jonc", 8],
  "Juncus bufonius subsp. minutulus":      ["jonc", 8],
  "Carex extensa":                         ["jonc", 25],
  "Carex distans":                         ["jonc", 40],
  "Schoenus nigricans":                    ["jonc", 50],
  "Triglochin maritima":                   ["plantain", 35],
  "Triglochin bulbosum subsp. barrelieri": ["plantain", 25],
  // rosettes et hampes fleuries
  "Plantago maritima":                     ["plantain", 20],
  "Plantago coronopus":                    ["plantain", 8],
  "Limonium vulgare":                      ["hampe-corymbe", 35],
  "Limonium ovalifolium":                  ["hampe-corymbe", 20],
  "Limonium auriculae-ursifolium":         ["hampe-corymbe", 20],
  "Limonium dodartii":                     ["hampe-corymbe", 30],
  "Aster tripolium":                       ["hampe-capitule", 60],
  "Armeria maritima":                      ["hampe-boule", 20],
  "Crithmum maritimum":                    ["hampe-corymbe", 35],
  "Matricaria maritima subsp. maritima":   ["hampe-capitule", 40],
  "Daucus carota subsp. carota":           ["hampe-corymbe", 60],
  "Apium graveolens":                      ["hampe-corymbe", 60],
  "Oenanthe lachenalii":                   ["hampe-corymbe", 60],
  "Eupatorium cannabinum":                 ["hampe-corymbe", 120],
  "Pulicaria dysenterica":                 ["hampe-capitule", 50],
  "Sonchus oleraceus":                     ["hampe-capitule", 60],
  "Silene vulgaris subsp. maritima":       ["hampe-capitule", 25],
  "Samolus valerandi":                     ["hampe-corymbe", 25],
  "Melilotus albus":                       ["hampe-corymbe", 100],
  "Cochlearia anglica":                    ["rosette", 15],
  "Cochlearia danica":                     ["rosette", 8],
  // tapis bas
  "Glaux maritima":                        ["tapis", 8],
  "Spergularia media":                     ["tapis", 15],
  "Spergularia marina":                    ["tapis", 10],
  "Sagina maritima":                       ["tapis", 5],
  "Frankenia laevis":                      ["tapis", 6],
  "Herniaria ciliolata":                   ["tapis", 5],
  "Sedum anglicum":                        ["tapis", 5],
  "Arenaria serpyllifolia subsp. serpyllifolia": ["tapis", 8],
  "Anagallis arvensis subsp. arvensis":    ["tapis", 10],
  "Linaria arenaria":                      ["herbe", 10],
  // herbes ramifiées des hauts niveaux
  "Atriplex littoralis":                   ["herbe", 60],
  "Atriplex prostrata":                    ["herbe", 40],
  "Atriplex laciniata":                    ["herbe", 30],
  "Beta vulgaris subsp. maritima":         ["herbe", 60],
  "Calystegia sepium":                     ["herbe", 80],
  "Lycopus europaeus":                     ["herbe", 60],
  "Thelypteris palustris":                 ["graminee", 50],

  /* ---- Espèces dunaires (DELASSUS et al. 2018) ---- */
  // hauts de plages et dunes mobiles
  "Atriplex laciniata":                    ["herbe", 25],
  "Cakile maritima subsp. maritima":       ["herbe", 30],
  "Salsola kali subsp. kali":              ["buisson", 25],
  "Honckenya peploides":                   ["tapis", 10],
  "Euphorbia peplis":                      ["rampant", 8],
  "Polygonum maritimum":                   ["rampant", 15],
  "Elymus farctus":                        ["graminee-epi", 50],
  "Calystegia soldanella":                 ["rampant", 12],
  "Eryngium maritimum":                    ["hampe-boule", 40],
  "Euphorbia paralias":                    ["buisson", 45],
  "Otanthus maritimus":                    ["coussin", 30],
  "Medicago marina":                       ["tapis", 15],
  "Ammophila arenaria subsp. arenaria":    ["graminee-epi", 90],
  "Festuca juncifolia":                    ["graminee", 45],
  "Galium arenarium":                      ["tapis", 12],
  "Matthiola sinuata":                     ["hampe-capitule", 35],
  "Pancratium maritimum":                  ["plantain", 40],
  // pelouses et prairies des dunes fixées
  "Ephedra distachya subsp. distachya":    ["buisson", 40],
  "Rosa pimpinellifolia":                  ["arbuste", 60],
  "Helichrysum stoechas subsp. stoechas":  ["coussin", 35],
  "Corynephorus canescens":                ["graminee", 25],
  "Koeleria glauca":                       ["graminee", 30],
  "Carex arenaria":                        ["jonc", 30],
  "Sedum acre":                            ["tapis", 8],
  "Thymus drucei":                         ["tapis", 8],
  "Sanguisorba minor subsp. minor":        ["hampe-boule", 35],
  "Dianthus gallicus":                     ["hampe-capitule", 25],
  "Asperula cynanchica":                   ["hampe-corymbe", 25],
  "Eryngium campestre":                    ["hampe-boule", 45],
  "Euphorbia portlandica":                 ["buisson", 25],
  "Silene otites subsp. otites":           ["hampe-corymbe", 40],
  "Thesium humifusum":                     ["tapis", 15],
  "Geranium sanguineum":                   ["herbe", 35],
  "Ononis repens":                         ["buisson", 25],
  "Lagurus ovatus":                        ["graminee-epi", 35],
  "Phleum arenarium":                      ["graminee-epi", 15],
  "Mibora minima":                         ["graminee", 8],
  "Vulpia myuros":                         ["graminee-epi", 25],
  "Vulpia sp.":                            ["graminee-epi", 25],
  "Bromus diandrus subsp. diandrus":       ["graminee-epi", 45],
  "Bromus diandrus subsp. maximus":        ["graminee-epi", 55],
  "Bromus hordeaceus subsp. hordeaceus":   ["graminee-epi", 40],
  "Aira praecox":                          ["graminee", 12],
  "Anthoxanthum odoratum":                 ["graminee-epi", 40],
  "Gaudinia fragilis":                     ["graminee-epi", 50],
  "Elymus x acutus":                       ["graminee-epi", 70],
  "Poa pratensis":                         ["graminee", 35],
  "Poa bulbosa":                           ["graminee", 15],
  "Poa annua":                             ["graminee", 12],
  "Arrhenatherum elatius s.l.":            ["graminee-epi", 90],
  "Arrhenatherum elatius subsp. bulbosum": ["graminee-epi", 80],
  "Leontodon saxatilis":                   ["hampe-capitule", 20],
  "Hypochaeris radicata":                  ["hampe-capitule", 35],
  "Hieracium pilosella":                   ["hampe-capitule", 15],
  "Jasione montana subsp. montana":        ["hampe-boule", 25],
  "Armeria maritima":                      ["hampe-boule", 20],
  "Lotus corniculatus subsp. corniculatus":["tapis", 15],
  "Anthyllis vulneraria":                  ["hampe-corymbe", 25],
  "Viola kitaibeliana":                    ["rosette", 8],
  "Crassula tillaea":                      ["tapis", 3],
  "Sagina apetala":                        ["tapis", 5],
  "Aphanes microcarpa":                    ["tapis", 8],
  "Sherardia arvensis":                    ["tapis", 10],
  "Cerastium diffusum subsp. diffusum":    ["tapis", 10],
  "Cerastium semidecandrum subsp. semidecandrum": ["tapis", 8],
  "Valerianella locusta":                  ["rosette", 15],
  "Bupleurum baldense subsp. baldense":    ["herbe", 12],
  "Asterolinon linum-stellatum":           ["herbe", 8],
  "Trifolium scabrum":                     ["tapis", 10],
  "Trifolium ornithopodioides":            ["tapis", 6],
  "Trifolium suffocatum":                  ["tapis", 4],
  "Medicago minima":                       ["tapis", 12],
  "Lamium amplexicaule subsp. amplexicaule": ["herbe", 15],
  "Allium sphaerocephalon":                ["hampe-boule", 50],
  "Ophrys passionis":                      ["plantain", 25],
  // friches, fourrés et chemins
  "Glaucium flavum":                       ["hampe-capitule", 50],
  "Carduus nutans subsp. nutans":          ["hampe-capitule", 70],
  "Carduus tenuiflorus":                   ["hampe-capitule", 60],
  "Diplotaxis tenuifolia":                 ["hampe-corymbe", 60],
  "Anchusa arvensis subsp. arvensis":      ["herbe", 40],
  "Echium vulgare":                        ["hampe-corymbe", 70],
  "Verbascum thapsus":                     ["hampe-corymbe", 120],
  "Verbascum nigrum subsp. nigrum":        ["hampe-corymbe", 90],
  "Salvia verbenaca":                      ["hampe-corymbe", 40],
  "Smyrnium olusatrum":                    ["hampe-corymbe", 100],
  "Heracleum sphondylium":                 ["hampe-corymbe", 120],
  "Urtica dioica":                         ["herbe", 80],
  "Rumex obtusifolius":                    ["hampe-corymbe", 80],
  "Rumex crispus":                         ["hampe-corymbe", 80],
  "Prunus spinosa":                        ["arbuste", 200],
  "Ulex europaeus subsp. europaeus":       ["arbuste", 150],
  "Rubus sp.":                             ["buisson", 120],
  "Sambucus nigra":                        ["arbuste", 250],
  "Hedera helix subsp. helix":             ["tapis", 20],
  "Iris foetidissima":                     ["jonc", 60],
  "Arum italicum subsp. neglectum":        ["plantain", 40],
  "Bryonia dioica":                        ["herbe", 90],
  "Solanum dulcamara":                     ["herbe", 90],
  "Cynoglossum officinale":                ["hampe-corymbe", 60]
};
const PORT_DEFAUT = ["herbe", 20];

/* Libellés des ports, pour la légende. */
const NOMS_PORTS = {
  herbier:"herbier couché", salicorne:"annuelle charnue", soude:"annuelle charnue",
  rampant:"sous-arbrisseau rampant", coussin:"sous-arbrisseau en coussin",
  buisson:"sous-arbrisseau dressé", graminee:"graminée en touffe",
  "graminee-epi":"graminée à épis", roseau:"grande hélophyte", jonc:"jonc, laîche",
  plantain:"rosette à épis", rosette:"rosette", tapis:"tapis bas", herbe:"herbe ramifiée",
  "hampe-corymbe":"hampe fleurie", "hampe-capitule":"hampe fleurie", "hampe-boule":"hampe fleurie"
};

/* Emprise au sol d'un dessin, en fraction de sa hauteur (px). Sert à calculer
   combien de dessins tiennent dans un quadrat. */
const EMPRISE_PORT = {
  herbier:2.6, salicorne:.6, soude:.75, rampant:2, coussin:1.25, buisson:.7,
  graminee:.7, "graminee-epi":.45, roseau:.3, jonc:.45, plantain:.9, rosette:1.4,
  tapis:2.4, herbe:.55, "hampe-corymbe":.6, "hampe-capitule":.6, "hampe-boule":.6
};

const DESSIN_PX_M = 46;        // pixels par mètre le long du transect
const DESSIN_PX_CM = 1.25;     // pixels par cm de hauteur : exagération verticale ≈ ×3
const DESSIN_PX_RANG = 14;     // relief du profil type : dénivelé dessiné par rang de zone
const STRATES = [{lim:15, nom:"strate basse"}, {lim:40, nom:"strate moyenne"}];

function portEspece(e){
  return PORT_ESPECES[e.latin] || PORT_DEFAUT;
}

/* Générateur pseudo-aléatoire à graine : le même transect donne toujours le
   même dessin, d'un affichage et d'un ordinateur à l'autre. */
function graineTexte(s){
  let h = 2166136261;
  for(let i = 0; i < s.length; i++){ h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}
function aleaGraine(graine){
  let a = graine;
  return function(){
    a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* ---------- Pictogrammes ----------
   Chaque fonction dessine une plante posée en (x, y) — y est la ligne de sol —
   de hauteur h pixels, avec un tirage R() pour varier le trait. */
const n1 = v => v.toFixed(1);

const PICTOS = {
  herbier(x, y, h, R){
    const w = h * 2.6;
    let p = '';
    for(let k = 0; k < 3; k++){
      const d = (R() - .5) * w * .3;
      p += `M${n1(x - w/2 + d)} ${n1(y - .5)} Q${n1(x + d)} ${n1(y - h * (.5 + R() * .5))} ${n1(x + w/2 + d)} ${n1(y - 1)} `;
    }
    return `<path d="${p}"/>`;
  },
  salicorne(x, y, h, R, dense){
    const nb = (dense ? 4 : 2) + Math.floor(R() * 2);
    let p = `M${n1(x)} ${n1(y)} Q${n1(x + (R() - .5) * 2)} ${n1(y - h * .5)} ${n1(x + (R() - .5) * 2)} ${n1(y - h)}`;
    for(let k = 0; k < nb; k++){
      const yb = y - h * (.18 + .5 * k / nb), cote = k % 2 ? 1 : -1, bw = h * (.22 + R() * .12);
      p += ` M${n1(x)} ${n1(yb)} Q${n1(x + cote * bw)} ${n1(yb)} ${n1(x + cote * bw)} ${n1(yb - h * (.42 - .25 * k / nb))}`;
    }
    return `<path d="${p}"/>`;
  },
  soude(x, y, h, R){ return PICTOS.salicorne(x, y, h, R, true); },
  rampant(x, y, h, R){
    const w = h * 2;
    let p = `M${n1(x - w/2)} ${n1(y - 1)} Q${n1(x - w/4)} ${n1(y - h * .45)} ${n1(x)} ${n1(y - 2)} T${n1(x + w/2)} ${n1(y - 1)}`;
    for(let k = 0; k < 4; k++){
      const xb = x - w/2 + w * (k + .5) / 4;
      p += ` M${n1(xb)} ${n1(y - 2)} l${n1((R() - .5) * 3)} ${n1(-h * (.55 + R() * .45))}`;
    }
    return `<path d="${p}"/>`;
  },
  coussin(x, y, h, R, _, lw = 1){
    const w = h * 1.25 * lw, nb = 5;
    const pts = [];
    for(let k = 0; k <= nb; k++){
      const a = Math.PI - Math.PI * k / nb;
      const rr = 1 + (R() - .5) * .12;
      pts.push([x + Math.cos(a) * w / 2 * rr, y - Math.sin(a) * h * rr * (k === 0 || k === nb ? 0 : 1) - (k === 0 || k === nb ? 0 : 0)]);
    }
    // les deux extrémités remontent un peu pour que le coussin ne soit pas une dalle
    pts[0][1] = y - h * .12; pts[nb][1] = y - h * .12;
    let p = `M${n1(x - w * .42)} ${n1(y)} L${n1(pts[0][0])} ${n1(pts[0][1])}`;
    for(let k = 1; k <= nb; k++){
      const [xa, ya] = pts[k - 1], [xb, yb] = pts[k];
      const r = Math.hypot(xb - xa, yb - ya) * .58;
      p += ` A${n1(r)} ${n1(r)} 0 0 1 ${n1(xb)} ${n1(yb)}`;
    }
    p += ` L${n1(x + w * .42)} ${n1(y)} Z`;
    // ramification en Y visible à travers le feuillage, comme sur la figure 6
    const br = `M${n1(x)} ${n1(y)} L${n1(x)} ${n1(y - h * .35)} L${n1(x - w * .16)} ${n1(y - h * .6)} M${n1(x)} ${n1(y - h * .35)} L${n1(x + w * .18)} ${n1(y - h * .62)}`
      + ` M${n1(x - w * .28)} ${n1(y)} L${n1(x - w * .3)} ${n1(y - h * .3)}`;
    // fond blanc légèrement transparent : ce qui pousse derrière reste deviné
    return `<path d="${p}" fill="#fff" fill-opacity=".82"/><path d="${br}"/>`;
  },
  buisson(x, y, h, R, _, lw = 1){
    const nb = Math.max(3, Math.round((6 + Math.floor(R() * 3)) * lw)), w = h * .7 * lw;
    let p = '';
    for(let k = 0; k < nb; k++){
      const t = nb > 1 ? k / (nb - 1) - .5 : 0;
      const bx = x + t * w * .3, tx = x + t * w * (1 + R() * .3), th = h * (.7 + R() * .3);
      p += `M${n1(bx)} ${n1(y)} Q${n1(bx + t * 2)} ${n1(y - th * .55)} ${n1(tx)} ${n1(y - th)} `;
      // articles des tiges charnues : petits nœuds le long de la tige
      const ym = y - th * .55, xm = bx + (tx - bx) * .45;
      p += `M${n1(xm - 1.6)} ${n1(ym + 1)} L${n1(xm)} ${n1(ym)} L${n1(xm + 1.6)} ${n1(ym + 1)} `;
    }
    return `<path d="${p}"/>`;
  },
  graminee(x, y, h, R, epi, lw = 1){
    const nb = Math.max(3, Math.round((7 + Math.floor(R() * 3)) * lw)), w = h * .7 * lw;
    let p = '';
    for(let k = 0; k < nb; k++){
      const t = k / (nb - 1) - .5, th = h * (.5 + R() * .45);
      const tx = x + t * w * (1.1 + R() * .4);
      p += `M${n1(x + t * 3)} ${n1(y)} Q${n1(x + t * w * .25)} ${n1(y - th * .7)} ${n1(tx)} ${n1(y - th)} `;
    }
    if(epi){
      const ne = 1 + Math.floor(R() * 2);
      for(let k = 0; k < ne; k++){
        const ex = x + (k - (ne - 1) / 2) * 3;
        p += `M${n1(ex)} ${n1(y)} L${n1(ex + (R() - .5) * 2)} ${n1(y - h * .82)} `;
        p += `M${n1(ex)} ${n1(y - h * .78)} q-1.6 ${n1(-h * .12)} 0 ${n1(-h * .22)} q1.6 ${n1(h * .1)} 0 ${n1(h * .22)} `;
      }
    }
    return `<path d="${p}"/>`;
  },
  "graminee-epi"(x, y, h, R, _, lw){ return PICTOS.graminee(x, y, h, R, true, lw); },
  roseau(x, y, h, R){
    let p = '';
    for(let k = 0; k < 3; k++){
      const sx = x + (k - 1) * 3, top = y - h * (.85 + R() * .15);
      p += `M${n1(sx)} ${n1(y)} L${n1(sx + (R() - .5) * 3)} ${n1(top)} `;
      // feuilles en lanières obliques
      const yl = y - h * (.3 + .3 * R()), cote = k % 2 ? 1 : -1;
      p += `M${n1(sx)} ${n1(yl)} q${n1(cote * h * .12)} ${n1(-h * .08)} ${n1(cote * h * .2)} ${n1(h * .04)} `;
      // inflorescence en panache
      p += `M${n1(sx)} ${n1(top)} l-3 5 M${n1(sx)} ${n1(top)} l3 5 M${n1(sx)} ${n1(top)} l0 6 `;
    }
    return `<path d="${p}"/>`;
  },
  jonc(x, y, h, R, _, lw = 1){
    const nb = Math.max(3, Math.round((7 + Math.floor(R() * 4)) * lw)), w = h * .45 * lw;
    let p = '';
    for(let k = 0; k < nb; k++){
      const t = k / (nb - 1) - .5, th = h * (.6 + R() * .4);
      p += `M${n1(x + t * 2)} ${n1(y)} L${n1(x + t * w)} ${n1(y - th)} `;
    }
    // glomérule latéral des joncs
    p += `M${n1(x + w * .12)} ${n1(y - h * .62)} l2.5 -1.5 l-0.5 3 z`;
    return `<path d="${p}"/>`;
  },
  plantain(x, y, h, R){
    const w = h * .9;
    let p = '';
    for(let k = 0; k < 6; k++){
      const t = k / 5 - .5;
      p += `M${n1(x)} ${n1(y)} Q${n1(x + t * w * .5)} ${n1(y - h * .25)} ${n1(x + t * w)} ${n1(y - h * (.2 + R() * .15))} `;
    }
    const ne = 1 + Math.floor(R() * 2);
    for(let k = 0; k < ne; k++){
      const ex = x + (k - (ne - 1) / 2) * 4, top = y - h * (.85 + R() * .15);
      p += `M${n1(ex)} ${n1(y)} L${n1(ex)} ${n1(top + h * .25)} `;
      p += `M${n1(ex)} ${n1(top + h * .25)} q-1.3 ${n1(-h * .12)} 0 ${n1(-h * .25)} q1.3 ${n1(h * .13)} 0 ${n1(h * .25)} `;
    }
    return `<path d="${p}"/>`;
  },
  rosette(x, y, h, R){
    const w = h * 1.4;
    let p = '';
    for(let k = 0; k < 4; k++){
      const t = k / 3 - .5;
      p += `M${n1(x)} ${n1(y)} q${n1(t * w * .3 - 2)} ${n1(-h * .5)} ${n1(t * w)} ${n1(-h * .35)} q${n1(-t * w * .3)} ${n1(h * .25)} ${n1(-t * w)} ${n1(h * .35)} `;
    }
    p += `M${n1(x)} ${n1(y)} L${n1(x + 1)} ${n1(y - h)} `;
    return `<path d="${p}"/><circle cx="${n1(x + 1)}" cy="${n1(y - h)}" r="1.4"/>`;
  },
  tapis(x, y, h, R){
    const w = h * 2.4, nb = 4;
    let p = `M${n1(x - w/2)} ${n1(y)}`;
    for(let k = 0; k < nb; k++){
      p += ` q${n1(w / nb / 2)} ${n1(-h * (.7 + R() * .3) * 2)} ${n1(w / nb)} 0`;
    }
    return `<path d="${p}"/>`;
  },
  herbe(x, y, h, R){
    let p = `M${n1(x)} ${n1(y)} Q${n1(x + (R() - .5) * 3)} ${n1(y - h * .5)} ${n1(x)} ${n1(y - h)}`;
    for(let k = 0; k < 3; k++){
      const yb = y - h * (.25 + .22 * k), cote = k % 2 ? 1 : -1, l = h * (.22 - .04 * k);
      p += ` M${n1(x)} ${n1(yb)} q${n1(cote * l * .6)} ${n1(-l * .6)} ${n1(cote * l)} ${n1(-l * .2)} q${n1(-cote * l * .4)} ${n1(l * .35)} ${n1(-cote * l)} ${n1(l * .2)}`;
    }
    p += ` M${n1(x)} ${n1(y - h * .8)} l${n1(-h * .12)} ${n1(-h * .16)} M${n1(x)} ${n1(y - h * .8)} l${n1(h * .12)} ${n1(-h * .14)}`;
    return `<path d="${p}"/>`;
  },
  hampe(x, y, h, R, fleur){
    let p = `M${n1(x)} ${n1(y)} q-3 -3 -6 -1 M${n1(x)} ${n1(y)} q3 -3 6 -1 M${n1(x)} ${n1(y)} q-1 -4 -4 -5 `;
    const top = y - h * .78;
    p += `M${n1(x)} ${n1(y)} Q${n1(x + (R() - .5) * 3)} ${n1(y - h * .4)} ${n1(x)} ${n1(top)} `;
    const fleurs = [];
    if(fleur === 'boule'){
      p += `L${n1(x)} ${n1(y - h + 3)} `;
      fleurs.push(`<circle cx="${n1(x)}" cy="${n1(y - h + 3)}" r="3" fill="#fff"/>`);
    } else {
      const nb = fleur === 'corymbe' ? 4 : 3;
      for(let k = 0; k < nb; k++){
        const t = k / (nb - 1) - .5, fx = x + t * h * .45, fy = y - h * (.9 + (1 - Math.abs(t) * 2) * .1);
        p += `M${n1(x)} ${n1(top)} L${n1(fx)} ${n1(fy)} `;
        if(fleur === 'corymbe') p += `M${n1(fx - 2)} ${n1(fy - 1)} l2 1 l2 -1 `;
        else fleurs.push(`<circle cx="${n1(fx)}" cy="${n1(fy - 1.5)}" r="1.8" fill="#fff"/>`);
      }
    }
    return `<path d="${p}"/>` + fleurs.join('');
  },
  "hampe-corymbe"(x, y, h, R){ return PICTOS.hampe(x, y, h, R, 'corymbe'); },
  "hampe-capitule"(x, y, h, R){ return PICTOS.hampe(x, y, h, R, 'capitule'); },
  "hampe-boule"(x, y, h, R){ return PICTOS.hampe(x, y, h, R, 'boule'); }
};

function strateDe(hcm){
  return hcm < STRATES[0].lim ? 'basse' : (hcm < STRATES[1].lim ? 'moyenne' : 'haute');
}

/* Pictogramme isolé, pour la légende : un groupe de 48 × 44 px. */
function pictoLegendeGroupe(latin, fr){
  const [port, hcm] = portEspece({latin, fr});
  const R = aleaGraine(graineTexte(latin || fr || ''));
  const h = Math.min(34, 10 + hcm * .35);
  return `<g fill="none" stroke="#191b16" stroke-width="1.1" stroke-linecap="round" stroke-linejoin="round">`
    + `<line x1="2" y1="40" x2="46" y2="40" stroke="#b9b4a4"/>`
    + (PICTOS[port] || PICTOS.herbe)(24, 40, h, R) + `</g>`;
}
function pictoLegendeSVG(latin, fr){
  return `<svg viewBox="0 0 48 44" width="48" height="44" aria-hidden="true">${pictoLegendeGroupe(latin, fr)}</svg>`;
}

/* ---------- Panneau dessiné du diagramme de transect ----------
   Le profil dessiné n'est pas une figure à part : il occupe le bas du diagramme
   de transect (construireProfilTransectSVG), sous les barres d'espèces et sur
   la même échelle de distance, comme sur les transects publiés.

   rs : relevés triés, avec d (distance en m).
   o  : {x: d → abscisse, pxm: pixels par mètre, yHaut, margeG, relief,
         graine, interactif}
   Retourne {svg, hauteur, liste}. */

/* Relief affiché : profil type (par défaut) ou sol plat. */
let dessinRelief = true;

function especesDessinees(rs){
  const especes = new Map();
  rs.forEach(r => (r.cortege || []).forEach(e => {
    const cle = e.latin || e.fr;
    if(!especes.has(cle)){
      const [port, hcm] = portEspece(e);
      especes.set(cle, {latin: e.latin, fr: e.fr, port, hcm, connu: !!PORT_ESPECES[e.latin]});
    }
  }));
  return [...especes.values()].sort((a, b) => b.hcm - a.hcm || a.fr.localeCompare(b.fr, 'fr'));
}

function panneauProfilDessine(rs, o){
  const {x, pxm, yHaut, margeG, graine} = o;
  const relief = o.relief !== false;
  const pas = pasCourant(rs);
  const dMin = rs[0].d, dMax = rs[rs.length - 1].d;
  /* Les dessins gardent leurs proportions quelle que soit l'échelle horizontale
     du diagramme : sur une échelle serrée, tout est un peu réduit. */
  const reduction = Math.max(.6, Math.min(1, pxm / DESSIN_PX_M));
  const pxCm = DESSIN_PX_CM * reduction;
  const pxRang = DESSIN_PX_RANG * Math.max(.75, reduction);

  const liste = especesDessinees(rs);
  const hMaxCm = Math.max(50, Math.ceil(Math.max(0, ...liste.map(e => e.hcm)) / 25) * 25);

  /* Relief : PROFIL TYPE. Aucune altitude n'est relevée ; la ligne de sol monte
     avec le rang de la zone de chaque relevé (slikke en bas, haut schorre en
     haut), lissé par une moyenne glissante pour donner une pente continue. */
  const rangs = rs.map(r => r.solNu ? 0 : (r.topFiche != null && zoneDeFiche(r.topFiche, milieuDuReleve(r)) ? zoneDeFiche(r.topFiche, milieuDuReleve(r)).rang : null));
  let dernierRang = rangs.find(v => v != null) ?? 0;
  const bruts = rangs.map(v => (v == null ? dernierRang : (dernierRang = v)));
  const lisses = bruts.map((_, i) => {
    let s = 0, n = 0;
    for(let k = i - 2; k <= i + 2; k++){
      if(k < 0 || k >= bruts.length) continue;
      const p = 3 - Math.abs(k - i);
      s += bruts[k] * p; n += p;
    }
    return s / n;
  });
  const rMin = Math.min(...lisses), rMax = Math.max(...lisses);
  const ampli = relief ? pxRang * (rMax - rMin) : 0;

  const ySol = yHaut + 30 + hMaxCm * pxCm + ampli;       // sol au plus bas
  const solY = d => {
    if(!relief) return ySol;
    let rg;
    if(d <= dMin) rg = lisses[0];
    else if(d >= dMax) rg = lisses[lisses.length - 1];
    else {
      let i = 1; while(rs[i].d < d) i++;
      const t = (d - rs[i - 1].d) / (rs[i].d - rs[i - 1].d);
      rg = lisses[i - 1] + t * (lisses[i] - lisses[i - 1]);
    }
    return ySol - (rg - rMin) * pxRang;
  };
  const S = [];

  /* Cellules : chaque relevé occupe la moitié des intervalles qui le séparent
     de ses voisins, sans dépasser un pas de part et d'autre — au-delà, le sol
     est laissé en pointillés « non relevé ». Bornées aux extrémités du
     transect, comme les barres d'espèces. */
  const cellules = rs.map((r, i) => {
    const prec = rs[i - 1], suiv = rs[i + 1];
    const a = prec && r.d - prec.d <= pas * 2 ? (r.d + prec.d) / 2 : Math.max(dMin, r.d - pas / 2);
    const b = suiv && suiv.d - r.d <= pas * 2 ? (r.d + suiv.d) / 2 : Math.min(dMax, r.d + pas / 2);
    return {r, a, b};
  });

  const trace = (da, db, dy = 0) => {
    const nb = Math.max(1, Math.ceil(Math.abs(x(db) - x(da)) / 6));
    const pts = [];
    for(let k = 0; k <= nb; k++){ const d = da + (db - da) * k / nb; pts.push(`${n1(x(d))},${n1(solY(d) - dy)}`); }
    return pts.join(' ');
  };

  // terre sous la ligne de sol
  if(relief) S.push(`<polygon points="${trace(dMin, dMax)} ${n1(x(dMax))},${n1(ySol + 4)} ${n1(x(dMin))},${n1(ySol + 4)}" fill="#f1eee4" fill-opacity=".85"/>`);

  /* Strates : repères parallèles au sol ; échelle des hauteurs dans la marge. */
  STRATES.forEach(s => S.push(`<polyline points="${trace(dMin, dMax, s.lim * pxCm)}" fill="none" stroke="#b9b3a0" stroke-width="0.8" stroke-dasharray="5 5"/>`));
  const ySol0 = solY(dMin), yCm = cm => ySol0 - cm * pxCm;
  const xEch = margeG - 10;
  S.push(`<line x1="${xEch}" y1="${n1(yCm(hMaxCm))}" x2="${xEch}" y2="${n1(ySol0)}" stroke="#191b16"/>`);
  for(const cm of [0, STRATES[0].lim, STRATES[1].lim, hMaxCm]){
    S.push(`<line x1="${xEch - 4}" y1="${n1(yCm(cm))}" x2="${xEch}" y2="${n1(yCm(cm))}" stroke="#191b16"/>`);
    S.push(`<text x="${xEch - 7}" y="${n1(yCm(cm) + 3.5)}" text-anchor="end" font-size="10" fill="#565a4e">${cm} cm</text>`);
  }
  const bornes = [0, STRATES[0].lim, STRATES[1].lim, hMaxCm];
  ['basse', 'moyenne', 'haute'].forEach((nom, i) => {
    S.push(`<text x="${xEch - 58}" y="${n1((yCm(bornes[i]) + yCm(bornes[i + 1])) / 2 + 3.5)}" text-anchor="end" font-size="10" font-style="italic" fill="#8a8676">strate ${nom}</text>`);
  });
  S.push(`<text x="14" y="${n1(yHaut + 14)}" font-size="11" font-weight="bold">Profil de végétation</text>`);
  S.push(`<text x="14" y="${n1(yHaut + 28)}" font-size="9.5" fill="#565a4e">${relief ? 'relief : profil type déduit des zones' : 'sol plat'}</text>`);

  // sol, et trous d'échantillonnage
  cellules.forEach((c, i) => {
    S.push(`<polyline points="${trace(c.a, c.b)}" fill="none" stroke="#191b16" stroke-width="1.4"/>`);
    const suiv = cellules[i + 1];
    if(suiv && suiv.a > c.b + 1e-9){
      S.push(`<polyline points="${trace(c.b, suiv.a)}" fill="none" stroke="#191b16" stroke-width="1" stroke-dasharray="3 4"/>`);
      if(x(suiv.a) - x(c.b) >= 50) S.push(`<text x="${n1((x(c.b) + x(suiv.a)) / 2)}" y="${n1(solY((c.b + suiv.a) / 2) + 13)}" text-anchor="middle" font-size="9.5" font-style="italic" fill="#8a8676">non relevé</text>`);
    }
  });

  /* Individus dessinés, tous quadrats confondus, puis triés du plus haut au
     plus bas : les grandes plantes passent derrière, les petites devant.
     Le nombre de dessins d'une espèce suit le recouvrement médian de son
     coefficient ; une touffe ou un coussin isolé est aussi plus étroit. */
  const individus = [];
  cellules.forEach(c => {
    const largeurPx = Math.max(2, x(c.b) - x(c.a));
    (c.r.cortege || []).forEach(e => {
      const [port, hcm] = portEspece(e);
      const pct = pctDeCouverture('bb', e.cover) || 0;
      const R = aleaGraine(graineTexte(`${graine}|${c.r.d}|${e.latin || e.fr}`));
      const rare = ['i', 'r', '+'].includes(String(e.cover));
      const hPx = hcm * pxCm * (rare ? .8 : 1);
      const lw = .55 + .45 * Math.min(1, pct / 37.5);
      const capacite = largeurPx / Math.max(4, hPx * (EMPRISE_PORT[port] || .6) * .8);
      const nb = Math.max(1, Math.round(capacite * pct / 100));
      const phase = R();
      for(let k = 0; k < nb; k++){
        const t = (k + phase * .8 + .1) / nb;
        const f = Math.min(.97, Math.max(.03, t + (R() - .5) * .35 / nb));
        individus.push({port, lw, hPx: hPx * (.88 + R() * .24), xi: x(c.a) + f * largeurPx,
          yi: solY(c.a + f * (c.b - c.a)) + (relief ? 1 : 0),
          R: aleaGraine(graineTexte(`${c.r.d}|${e.latin || e.fr}|${k}`))});
      }
    });
  });
  individus.sort((a, b) => b.hPx - a.hPx);
  S.push(`<g fill="none" stroke="#191b16" stroke-width="1.05" stroke-linecap="round" stroke-linejoin="round">`);
  individus.forEach(v => S.push((PICTOS[v.port] || PICTOS.herbe)(v.xi, v.yi, v.hPx, v.R, undefined, v.lw)));
  S.push(`</g>`);

  /* À l'écran : un quadrat survolé donne ses espèces ; cliqué, la fiche de
     son habitat. */
  const yCell = ySol - ampli - hMaxCm * pxCm - 4;
  if(o.interactif) cellules.forEach(c => {
    const z = c.r.solNu ? {zone: 'Sol nu'} : (c.r.topFiche != null ? zoneDeFiche(c.r.topFiche, milieuDuReleve(c.r)) : null);
    const esp = (c.r.cortege || []).slice()
      .sort((a, b) => (pctDeCouverture('bb', b.cover) || 0) - (pctDeCouverture('bb', a.cover) || 0))
      .map(e => `${e.fr} (${e.cover})`).join(' · ');
    S.push(`<rect x="${n1(x(c.a))}" y="${n1(yCell)}" width="${n1(Math.max(1, x(c.b) - x(c.a)))}" height="${n1(ySol + 4 - yCell)}" fill="transparent"`
      + ` class="cellule-dessin${c.r.topFiche != null ? ' zone-cliquable' : ''}" data-d="${c.r.d}" data-zone="${echapXML(z ? z.zone : '')}"`
      + `${c.r.topFiche != null ? ` data-fiche="${c.r.topFiche}"` : ''} data-especes="${echapXML(esp || 'sol nu')}"/>`);
  });

  return {svg: S.join('\n'), hauteur: ySol + 6 - yHaut, liste};
}

/* Légende des dessins pour le SVG téléchargé : il doit se lire seul. */
function legendeDessinsSVG(liste, x0, y0, largeurDispo){
  const colLeg = 250, nbCol = Math.max(2, Math.min(4, Math.floor(largeurDispo / colLeg)));
  const S = [`<text x="${x0}" y="${y0}" font-size="11" font-weight="bold">Dessins : de l'espèce la plus haute à la plus basse (hauteurs types, non mesurées)</text>`];
  liste.forEach((e, i) => {
    const gx = x0 + (i % nbCol) * colLeg, gy = y0 + 8 + Math.floor(i / nbCol) * 48;
    S.push(`<g transform="translate(${gx} ${gy})">${pictoLegendeGroupe(e.latin, e.fr)}`
      + `<text x="56" y="20" font-size="11.5">${echapXML(e.fr)}</text>`
      + `<text x="56" y="35" font-size="9.5" fill="#565a4e">${echapXML(NOMS_PORTS[e.port] || '')} · ~${e.hcm} cm${e.connu ? '' : ' · dessin générique'}</text></g>`);
  });
  return {svg: S.join('\n'), hauteur: 20 + Math.ceil(liste.length / nbCol) * 48};
}

/* Légende des dessins à l'écran, par strate. */
function legendeDessinsHTML(nomTransect){
  const rs = chargerHistorique().filter(r => (r.transect || 'Transect (sans nom)') === nomTransect);
  const parStrate = {haute: [], moyenne: [], basse: []};
  especesDessinees(rs).forEach(e => parStrate[strateDe(e.hcm)].push(e));
  const libelles = {haute: `Strate haute (≥ ${STRATES[1].lim} cm)`, moyenne: `Strate moyenne (${STRATES[0].lim}–${STRATES[1].lim} cm)`, basse: `Strate basse (< ${STRATES[0].lim} cm)`};
  return ['haute', 'moyenne', 'basse'].filter(s => parStrate[s].length).map(s => `
    <div class="dessin-strate"><h4>${libelles[s]}</h4><ul>
      ${parStrate[s].map(e => `<li>${pictoLegendeSVG(e.latin, e.fr)}<span><b>${echapHTML(e.fr)}</b><small>${echapHTML(NOMS_PORTS[e.port] || '')} · ~${e.hcm} cm${e.connu ? '' : ' · dessin générique'}</small></span></li>`).join('')}
    </ul></div>`).join('');
}
