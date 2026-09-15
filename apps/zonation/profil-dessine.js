/* =========================================================
   PROFIL DE VÉGÉTATION DESSINÉ
   Dans l'esprit des profils de COLASSE (2019, fig. 6) : la végétation de
   chaque quadrat est dessinée au trait, espèce par espèce, sur une ligne de
   sol, pour donner à voir ce que le tableau ne montre pas :
     - la DENSITÉ : le nombre de dessins d'une espèce suit le recouvrement
       médian de son coefficient d'abondance-dominance ;
     - la STRATIFICATION : chaque espèce est dessinée à sa hauteur type, et
       les plus hautes passent derrière les plus basses.

   Limites assumées, rappelées sous la figure :
     - les hauteurs sont des hauteurs TYPES (port adulte habituel sur les
       prés salés), pas des mesures ;
     - le sol est plat : aucune altitude n'est relevée sur le terrain, et
       dessiner une topographie serait inventer.
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
  "Thelypteris palustris":                 ["graminee", 50]
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
const DESSIN_MARGE_G = 150;     // colonne de l'échelle des hauteurs
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

/* Construit le profil dessiné d'un transect.
   Retourne {svg, especes} ou null s'il n'y a pas assez de relevés. */
function construireProfilDessineSVG(nomTransect, options){
  const pourFichier = !!(options && options.fichier);
  const rs = chargerHistorique()
    .filter(r => (r.transect || 'Transect (sans nom)') === nomTransect)
    .filter(r => r.distance !== '' && r.distance != null && isFinite(Number(r.distance)))
    .map(r => ({...r, d: Number(r.distance)}))
    .sort((a, b) => a.d - b.d);
  if(rs.length < 2) return null;

  const pas = pasCourant(rs);
  const dMin = rs[0].d, dMax = rs[rs.length - 1].d;
  const largeur = (dMax - dMin + pas) * DESSIN_PX_M;

  /* Espèces présentes et hauteur maximale, qui fixe l'échelle verticale. */
  const especes = new Map();
  rs.forEach(r => (r.cortege || []).forEach(e => {
    const cle = e.latin || e.fr;
    if(!especes.has(cle)){
      const [port, hcm] = portEspece(e);
      especes.set(cle, {latin: e.latin, fr: e.fr, port, hcm, connu: !!PORT_ESPECES[e.latin], n: 0});
    }
    especes.get(cle).n++;
  }));
  const liste = [...especes.values()].sort((a, b) => b.hcm - a.hcm || a.fr.localeCompare(b.fr, 'fr'));
  const hMaxCm = Math.max(50, Math.ceil(Math.max(0, ...[...especes.values()].map(e => e.hcm)) / 25) * 25);

  /* Relief : PROFIL TYPE. Aucune altitude n'est relevée ; la ligne de sol monte
     avec le rang de la zone de chaque relevé (slikke en bas, haut schorre en
     haut), lissé par une moyenne glissante pour donner une pente continue. Sans
     relief, le sol est plat. */
  const relief = !(options && options.relief === false);
  const rangs = rs.map(r => r.solNu ? 0 : (r.topFiche != null && zoneDeFiche(r.topFiche) ? zoneDeFiche(r.topFiche).rang : null));
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
  const ampli = relief ? DESSIN_PX_RANG * (rMax - rMin) : 0;

  const yTitre = pourFichier ? 58 : 0;
  const ySol = yTitre + 18 + hMaxCm * DESSIN_PX_CM + ampli;   // sol au plus bas
  /* Hauteur du sol à la distance d, par interpolation entre relevés. */
  const solY = d => {
    if(!relief) return ySol;
    let rg;
    if(d <= rs[0].d) rg = lisses[0];
    else if(d >= rs[rs.length - 1].d) rg = lisses[lisses.length - 1];
    else {
      let i = 1; while(rs[i].d < d) i++;
      const t = (d - rs[i - 1].d) / (rs[i].d - rs[i - 1].d);
      rg = lisses[i - 1] + t * (lisses[i] - lisses[i - 1]);
    }
    return ySol - (rg - rMin) * DESSIN_PX_RANG;
  };
  const yBande = ySol + 6, hBande = 8;
  const yAxe = yBande + hBande + 4;
  const W = DESSIN_MARGE_G + largeur + 24;
  /* Le fichier téléchargé porte sa légende : il doit se lire seul. */
  const colLeg = 250, nbCol = Math.max(2, Math.min(4, Math.floor((W - 28) / colLeg)));
  const yLeg = yAxe + 44, hLeg = pourFichier ? 20 + Math.ceil(liste.length / nbCol) * 48 : 0;
  const H = yAxe + 30 + (pourFichier ? hLeg + 40 : 0);
  const x = d => DESSIN_MARGE_G + (d - dMin + pas / 2) * DESSIN_PX_M;

  const S = [];
  S.push(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${n1(W)} ${H}" width="${n1(W)}" height="${H}" font-family="Georgia, 'Times New Roman', serif" class="profil-dessine">`);
  S.push(`<rect width="${n1(W)}" height="${H}" fill="#ffffff"/>`);
  if(pourFichier){
    const id0 = rs[0];
    S.push(`<text x="14" y="26" font-size="17" font-weight="bold">Profil de végétation — ${echapXML(id0.site || '')}</text>`);
    S.push(`<text x="14" y="45" font-size="11.5" fill="#565a4e">Transect ${echapXML(nomTransect)} · ${rs.length} relevés${id0.dateReleve ? ' · ' + echapXML(id0.dateReleve.split('-').reverse().join('/')) : ''}${id0.observateur ? ' · ' + echapXML(id0.observateur) : ''}</text>`);
  }

  /* Cellules : chaque relevé occupe la moitié des intervalles qui le séparent
     de ses voisins, sans dépasser un pas de part et d'autre — au-delà, le sol
     est laissé en pointillés « non relevé ». */
  const cellules = rs.map((r, i) => {
    const prec = rs[i - 1], suiv = rs[i + 1];
    const a = prec && r.d - prec.d <= pas * 2 ? (r.d + prec.d) / 2 : r.d - pas / 2;
    const b = suiv && suiv.d - r.d <= pas * 2 ? (r.d + suiv.d) / 2 : r.d + pas / 2;
    return {r, a, b};
  });

  /* Tracé d'une ligne parallèle au sol (décalée de dy px) entre deux distances. */
  const trace = (da, db, dy = 0) => {
    const nb = Math.max(1, Math.ceil((db - da) * DESSIN_PX_M / 6));
    const pts = [];
    for(let k = 0; k <= nb; k++){ const d = da + (db - da) * k / nb; pts.push(`${n1(x(d))},${n1(solY(d) - dy)}`); }
    return pts.join(' ');
  };
  const d0 = dMin - pas / 2, d1 = dMax + pas / 2;

  /* Terre sous la ligne de sol, pour que le relief se lise d'un coup d'œil. */
  if(relief) S.push(`<polygon points="${trace(d0, d1)} ${n1(x(d1))},${ySol + 5} ${n1(x(d0))},${ySol + 5}" fill="#f1eee4"/>`);

  /* Strates : repères parallèles au sol, et échelle des hauteurs au départ. */
  STRATES.forEach(s => S.push(`<polyline points="${trace(d0, d1, s.lim * DESSIN_PX_CM)}" fill="none" stroke="#cfc9b8" stroke-width="0.8" stroke-dasharray="5 5"/>`));
  const ySol0 = solY(d0);
  const yCm = cm => ySol0 - cm * DESSIN_PX_CM;
  S.push(`<line x1="${DESSIN_MARGE_G - 8}" y1="${n1(yCm(hMaxCm))}" x2="${DESSIN_MARGE_G - 8}" y2="${n1(ySol0)}" stroke="#191b16" stroke-width="1"/>`);
  for(const cm of [0, STRATES[0].lim, STRATES[1].lim, hMaxCm]){
    S.push(`<line x1="${DESSIN_MARGE_G - 12}" y1="${n1(yCm(cm))}" x2="${DESSIN_MARGE_G - 8}" y2="${n1(yCm(cm))}" stroke="#191b16"/>`);
    S.push(`<text x="${DESSIN_MARGE_G - 15}" y="${n1(yCm(cm) + 3.5)}" text-anchor="end" font-size="10" fill="#565a4e">${cm} cm</text>`);
  }
  const bornes = [0, STRATES[0].lim, STRATES[1].lim, hMaxCm];
  ['basse', 'moyenne', 'haute'].forEach((nom, i) => {
    const yc = (yCm(bornes[i]) + yCm(bornes[i + 1])) / 2;
    S.push(`<text x="12" y="${n1(yc + 3.5)}" font-size="10" font-style="italic" fill="#8a8676">strate ${nom}</text>`);
  });
  if(relief) S.push(`<text x="12" y="${ySol + 3}" font-size="9" font-style="italic" fill="#8a8676">sol (profil type)</text>`);

  /* Sol, bande de zone et trous d'échantillonnage. */
  cellules.forEach((c, i) => {
    const z = c.r.solNu ? {rang: 0, zone: 'Sol nu'} : (c.r.topFiche != null ? zoneDeFiche(c.r.topFiche) : null);
    S.push(`<rect x="${n1(x(c.a))}" y="${yBande}" width="${n1(Math.max(1, x(c.b) - x(c.a)))}" height="${hBande}" fill="${teinteZone(z ? z.rang : null)}"/>`);
    S.push(`<polyline points="${trace(c.a, c.b)}" fill="none" stroke="#191b16" stroke-width="1.4"/>`);
    const suiv = cellules[i + 1];
    if(suiv && suiv.a > c.b + 1e-9){
      S.push(`<polyline points="${trace(c.b, suiv.a)}" fill="none" stroke="#191b16" stroke-width="1" stroke-dasharray="3 4"/>`);
      if(suiv.a - c.b >= 3) S.push(`<text x="${n1((x(c.b) + x(suiv.a)) / 2)}" y="${n1(solY((c.b + suiv.a) / 2) - 8)}" text-anchor="middle" font-size="9.5" font-style="italic" fill="#8a8676">non relevé</text>`);
    }
  });

  /* Individus dessinés, tous quadrats confondus, puis triés du plus haut au
     plus bas : les grandes plantes passent derrière, les petites devant. */
  const individus = [];
  cellules.forEach(c => {
    const largeurPx = (c.b - c.a) * DESSIN_PX_M;
    (c.r.cortege || []).forEach(e => {
      const [port, hcm] = portEspece(e);
      const pct = pctDeCouverture('bb', e.cover) || 0;
      const R = aleaGraine(graineTexte(`${nomTransect}|${c.r.d}|${e.latin || e.fr}`));
      const rare = ['i', 'r', '+'].includes(String(e.cover));
      const hPx = hcm * DESSIN_PX_CM * (rare ? .8 : 1);
      /* Une touffe ou un coussin isolé n'a pas l'ampleur d'un peuplement : la
         largeur du dessin diminue avec le recouvrement, la hauteur ne change pas. */
      const lw = .55 + .45 * Math.min(1, pct / 37.5);
      const capacite = largeurPx / Math.max(4, hPx * (EMPRISE_PORT[port] || .6) * .8);
      const nb = Math.max(1, Math.round(capacite * pct / 100));
      const phase = R();
      for(let k = 0; k < nb; k++){
        const t = ((k + phase * .8 + .1) / nb);
        const f = Math.min(.97, Math.max(.03, t + (R() - .5) * .35 / nb));
        const xi = x(c.a) + f * largeurPx;
        // pied posé sur le sol, un peu enfoncé pour ne pas flotter dans la pente
        const yi = solY(c.a + f * (c.b - c.a)) + (relief ? 1 : 0);
        individus.push({port, lw, hPx: hPx * (.88 + R() * .24), xi, yi, R: aleaGraine(graineTexte(`${c.r.d}|${e.latin || e.fr}|${k}`))});
      }
    });
  });
  individus.sort((a, b) => b.hPx - a.hPx);
  S.push(`<g fill="none" stroke="#191b16" stroke-width="1.05" stroke-linecap="round" stroke-linejoin="round">`);
  individus.forEach(v => S.push((PICTOS[v.port] || PICTOS.herbe)(v.xi, v.yi, v.hPx, v.R, undefined, v.lw)));
  S.push(`</g>`);

  /* Axe des distances. */
  const etendue = dMax - dMin;
  const pasAxe = etendue > 60 ? 10 : (etendue > 25 ? 5 : 2);
  for(let d = Math.ceil(dMin / pasAxe) * pasAxe; d <= dMax; d += pasAxe){
    S.push(`<line x1="${n1(x(d))}" y1="${yAxe}" x2="${n1(x(d))}" y2="${yAxe + 5}" stroke="#191b16"/>`);
    S.push(`<text x="${n1(x(d))}" y="${yAxe + 18}" text-anchor="middle" font-size="10.5">${d} m</text>`);
  }

  /* Zones sensibles au survol : un rectangle transparent par quadrat. */
  const yHaut = ySol - ampli - hMaxCm * DESSIN_PX_CM;
  if(!pourFichier) cellules.forEach(c => {
    const z = c.r.solNu ? 'Sol nu' : (c.r.topFiche != null ? (zoneDeFiche(c.r.topFiche) || {}).zone : null);
    const esp = (c.r.cortege || []).slice().sort((a, b) => (pctDeCouverture('bb', b.cover) || 0) - (pctDeCouverture('bb', a.cover) || 0))
      .map(e => `${e.fr} (${e.cover})`).join(', ');
    S.push(`<rect x="${n1(x(c.a))}" y="${n1(yHaut)}" width="${n1(Math.max(1, x(c.b) - x(c.a)))}" height="${n1(yBande + hBande - yHaut)}" fill="transparent" class="cellule-dessin"><title>${c.r.d} m${z ? ' · ' + echapXML(z) : ''}${c.r.topFiche != null ? ' (f' + c.r.topFiche + ')' : ''}\n${echapXML(esp || 'sol nu')}</title></rect>`);
  });

  if(pourFichier){
    S.push(`<text x="14" y="${yLeg}" font-size="11" font-weight="bold">Espèces, de la plus haute à la plus basse</text>`);
    liste.forEach((e, i) => {
      const gx = 14 + (i % nbCol) * colLeg, gy = yLeg + 8 + Math.floor(i / nbCol) * 48;
      S.push(`<g transform="translate(${gx} ${gy})">${pictoLegendeGroupe(e.latin, e.fr)}`
        + `<text x="56" y="20" font-size="11.5">${echapXML(e.fr)}</text>`
        + `<text x="56" y="35" font-size="9.5" fill="#565a4e">${echapXML(NOMS_PORTS[e.port] || '')} · ~${e.hcm} cm${e.connu ? '' : ' · dessin générique'}</text></g>`);
    });
    S.push(`<text x="14" y="${H - 14}" font-size="9.5" fill="#565a4e">Hauteurs types des espèces (non mesurées) · nombre de dessins proportionnel au recouvrement · ${relief ? 'relief : profil type déduit des zones, altitude non mesurée' : 'sol plat'} · d'après les profils de COLASSE V., 2019 (CBN de Brest)</text>`);
  }
  S.push('</svg>');
  return {svg: S.join('\n'), especes: liste};
}

/* Relief affiché : profil type (par défaut) ou sol plat. Mémorisé pour la
   session, et repris par le téléchargement. */
let dessinRelief = true;

/* Bloc HTML de l'écran d'analyse : dessin + légende par strate. */
function blocProfilDessine(nomTransect){
  const res = construireProfilDessineSVG(nomTransect, {relief: dessinRelief});
  if(!res) return '';
  const parStrate = {haute: [], moyenne: [], basse: []};
  res.especes.forEach(e => parStrate[strateDe(e.hcm)].push(e));
  const libelles = {haute: `Strate haute (≥ ${STRATES[1].lim} cm)`, moyenne: `Strate moyenne (${STRATES[0].lim}–${STRATES[1].lim} cm)`, basse: `Strate basse (< ${STRATES[0].lim} cm)`};
  const legende = ['haute', 'moyenne', 'basse'].filter(s => parStrate[s].length).map(s => `
    <div class="dessin-strate"><h4>${libelles[s]}</h4><ul>
      ${parStrate[s].map(e => `<li>${pictoLegendeSVG(e.latin, e.fr)}<span><b>${echapHTML(e.fr)}</b><small>${echapHTML(NOMS_PORTS[e.port] || '')} · ~${e.hcm} cm${e.connu ? '' : ' · dessin générique'}</small></span></li>`).join('')}
    </ul></div>`).join('');
  const cible = String(nomTransect).replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/"/g, '&quot;');
  return `
    <div class="carte" id="bloc-profil-dessine">
      <h3>Profil de végétation dessiné</h3>
      <p class="analyse-aide">Densité : plus une espèce couvre le quadrat, plus elle est dessinée de fois. Stratification : chaque espèce à sa hauteur type, les plus hautes derrière. Survol d'un quadrat : ses espèces.</p>
      <div class="analyse-vues">
        <button type="button" aria-pressed="${dessinRelief}" onclick="basculerReliefDessin('${cible}', true)">Relief (profil type)</button>
        <button type="button" aria-pressed="${!dessinRelief}" onclick="basculerReliefDessin('${cible}', false)">Sol plat</button>
      </div>
      <div class="analyse-diagramme reelle dessin-profil">${res.svg}</div>
      <div class="dessin-legende">${legende}</div>
      <p class="analyse-note">${dessinRelief
        ? 'Relief : profil type déduit de la zone de chaque relevé (slikke en bas, haut schorre en haut), sans altitude mesurée. Un creux correspond à un point de vigilance : cuvette, chenal… ou détermination à revoir.'
        : 'Sol plat : aucune topographie n\'est relevée sur le terrain.'} Hauteurs des plantes : hauteurs types, non mesurées. D'après les profils de COLASSE (2019, fig. 6).</p>
      <button class="secondaire" onclick="exporterProfilDessine('${cible}')">⬇ Télécharger le profil dessiné (SVG)</button>
    </div>`;
}

function basculerReliefDessin(nomTransect, relief){
  dessinRelief = relief;
  const bloc = document.getElementById('bloc-profil-dessine');
  if(!bloc) return;
  const defil = bloc.querySelector('.dessin-profil').scrollLeft;
  bloc.outerHTML = blocProfilDessine(nomTransect);
  document.querySelector('#bloc-profil-dessine .dessin-profil').scrollLeft = defil;
}

function exporterProfilDessine(nomTransect){
  const res = construireProfilDessineSVG(nomTransect, {fichier: true, relief: dessinRelief});
  if(!res){ informer('Il faut au moins deux relevés avec une distance renseignée pour dessiner un profil.'); return; }
  telechargerTexte(res.svg, `profil_dessine_${String(nomTransect).normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^\w-]+/g, '_')}${dessinRelief ? '' : '_sol_plat'}.svg`, 'image/svg+xml');
}
