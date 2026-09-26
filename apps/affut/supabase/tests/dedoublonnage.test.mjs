// Test local du bloc <dedoublonnage> de functions/affut-veille/index.ts.
// Usage : node apps/affut/supabase/tests/dedoublonnage.test.mjs  (Node ≥ 22, sans dépendance)
import { readFileSync, writeFileSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import assert from "node:assert/strict";

const source = readFileSync(join(dirname(fileURLToPath(import.meta.url)), "../functions/affut-veille/index.ts"), "utf8");
const bloc = (nom) => {
  const m = source.match(new RegExp("// <" + nom + ">\\n([\\s\\S]*?)\\n// </" + nom + ">"));
  assert.ok(m, "bloc <" + nom + "> introuvable dans index.ts");
  return m[1];
};
const dossier = mkdtempSync(join(tmpdir(), "dedoublonnage-"));
const fichier = join(dossier, "bloc.ts");
writeFileSync(fichier, bloc("dedoublonnage") + "\n" + bloc("memoire") + "\n" + bloc("regles") + "\nexport { normaliserUrl, normaliserTitre, classerDoublons, compterParFormat, FORMATS_AUTORISES, erreurProposition, filtrerPropositions };\n");
const { normaliserUrl, normaliserTitre, classerDoublons, compterParFormat, FORMATS_AUTORISES, erreurProposition, filtrerPropositions } = await import(pathToFileURL(fichier).href);

let n = 0;
const test = (nom, f) => { f(); n++; console.log("ok  " + nom); };

test("adresse : protocole, www, / final, ancre, pistage ignorés", () => {
  const ref = normaliserUrl("https://parcs.fr/actu/loup");
  for (const v of [
    "http://parcs.fr/actu/loup", "https://www.parcs.fr/actu/loup/", "https://PARCS.fr/actu/loup#haut",
    "https://parcs.fr/actu/loup?utm_source=newsletter&utm_medium=mail", "https://parcs.fr/actu/loup?fbclid=abc",
    "https://parcs.fr/actu/loup/index.html",
  ]) assert.equal(normaliserUrl(v), ref, v);
});
test("adresse : un paramètre qui identifie l'article est conservé", () => {
  assert.notEqual(normaliserUrl("https://x.fr/?p=12"), normaliserUrl("https://x.fr/?p=13"));
  assert.equal(normaliserUrl("https://x.fr/a?b=2&a=1"), normaliserUrl("https://x.fr/a?a=1&b=2"));
});
test("adresse : deux pages différentes restent différentes", () => {
  assert.notEqual(normaliserUrl("https://x.fr/actu/1"), normaliserUrl("https://x.fr/actu/2"));
  assert.notEqual(normaliserUrl("https://x.fr/actu"), normaliserUrl("https://y.fr/actu"));
});
test("adresse : texte invalide sans plantage", () => {
  assert.equal(typeof normaliserUrl("pas une url"), "string");
  assert.equal(typeof normaliserUrl(undefined), "string");
});
test("titre : accents, casse, ponctuation, guillemets ignorés", () => {
  assert.equal(normaliserTitre("Le Castor, un allié pour les prairies humides de l'Encrême"),
    normaliserTitre("« LE CASTOR : un allie pour les prairies humides de l’Encreme »"));
});

const cand = (id, url, titre) => ({ id, url, titre });
const T = "Suivi de la population reproductrice de Gravelot à collier interrompu en Bretagne";

test("déjà retenu, déjà écarté, déjà en moisson : refusés avec la bonne raison", () => {
  const vus = [
    { id: "a", url: "https://x.fr/1", titre: "", raison: "deja_retenu" },
    { id: "b", url: "https://x.fr/2", titre: "", raison: "deja_ecarte" },
    { id: "c", url: "https://x.fr/3", titre: "", raison: "deja_en_moisson" },
  ];
  const r = classerDoublons([
    cand("n1", "https://www.x.fr/1/?utm_source=a", "Autre titre un"),
    cand("n2", "http://x.fr/2", "Autre titre deux"),
    cand("n3", "https://x.fr/3#ancre", "Autre titre trois"),
    cand("n4", "https://x.fr/4", "Article vraiment nouveau"),
  ], vus);
  assert.deepEqual(r.ignores.map((i) => i.raison), ["deja_retenu", "deja_ecarte", "deja_en_moisson"]);
  assert.deepEqual(r.gardes.map((g) => g.id), ["n4"]);
});
test("un article écarté il y a longtemps revient à une autre adresse : refusé par le titre", () => {
  const vus = [{ id: "old", url: "https://site-a.fr/gravelot", titre: T, raison: "deja_ecarte" }];
  const r = classerDoublons([cand("n1", "https://relais-b.fr/actu/gravelot-2026", T.toUpperCase())], vus);
  assert.equal(r.gardes.length, 0);
  assert.equal(r.ignores[0].raison, "deja_ecarte");
});
test("même identifiant réutilisé : refusé", () => {
  const r = classerDoublons([cand("2026-09-x", "https://z.fr/1", "Titre suffisamment long pour test")],
    [{ id: "2026-09-x", url: "https://autre.fr", titre: "", raison: "deja_retenu" }]);
  assert.equal(r.gardes.length, 0);
});
test("titre court et générique : jamais comparé", () => {
  const r = classerDoublons([cand("n1", "https://a.fr/1", "Actualités")],
    [{ id: "z", url: "https://b.fr/9", titre: "Actualités", raison: "deja_retenu" }]);
  assert.equal(r.gardes.length, 1);
});
test("doublon dans un même envoi : seul le premier passe", () => {
  const r = classerDoublons([
    cand("n1", "https://a.fr/1", "Un premier article assez long"),
    cand("n2", "https://a.fr/1?utm_campaign=z", "Un premier article assez long"),
    cand("n3", "https://c.fr/1", "Un premier article assez long"),
  ], []);
  assert.deepEqual(r.gardes.map((g) => g.id), ["n1"]);
  assert.deepEqual(r.ignores.map((i) => i.raison), ["doublon_dans_le_lot", "doublon_dans_le_lot"]);
});
test("aucun historique : tout passe", () => {
  const r = classerDoublons([cand("n1", "https://a.fr/1", "Titre nouveau numéro un"), cand("n2", "https://a.fr/2", "Titre nouveau numéro deux")], []);
  assert.equal(r.gardes.length, 2);
  assert.equal(r.ignores.length, 0);
});

test("bilan par format : retenues et écartées comptées, jamais par source", () => {
  const r = compterParFormat(
    [{ format: "rapport_etude" }, { format: "rapport_etude" }, { format: "breve" }, { format: null }],
    [{ format: "breve", motif_code: "trop_court" }, { format: "breve", motif_code: "trop_court" }, { format: "breve", motif_code: null },
     { format: "agenda", motif_code: "hors_sujet" }, { format: "inconnu", motif_code: null }],
  );
  const get = (f) => r.par_format.find((x) => x.format === f);
  assert.deepEqual(get("rapport_etude"), { format: "rapport_etude", retenues: 2, ecartees: 0 });
  assert.deepEqual(get("breve"), { format: "breve", retenues: 1, ecartees: 3 });
  assert.deepEqual(get("non_classe"), { format: "non_classe", retenues: 1, ecartees: 1 }); // sans format ou format hors vocabulaire
  assert.deepEqual(r.motifs_ecart, [{ motif: "trop_court", nombre: 2 }, { motif: "hors_sujet", nombre: 1 }]);
  assert.equal(r.par_format[0].format, "breve"); // le plus fréquent d'abord
});
test("vocabulaire des formats : codes uniques, identiques à la migration SQL", () => {
  const codes = FORMATS_AUTORISES.map((f) => f.code);
  assert.equal(new Set(codes).size, codes.length);
  const sql = readFileSync(join(dirname(fileURLToPath(import.meta.url)), "../017-format-et-motif-ecart.sql"), "utf8");
  for (const c of codes) assert.ok(sql.includes("'" + c + "'"), "code absent du SQL : " + c);
});

test("proposition de règle : texte valide accepté, adresse ou source refusée", () => {
  assert.equal(erreurProposition({ texte: "Ne pas proposer de communiqué sans données chiffrées.", justification: "8 écarts sur 10" }), null);
  assert.equal(erreurProposition({ texte: "Privilégier les rapports complets aux brèves." }), null);
  assert.match(erreurProposition({ texte: "Éviter tout ce qui vient de https://exemple.fr/actu" }), /adresse|source/);
  assert.match(erreurProposition({ texte: "Éviter les articles de reporterre.net en général" }), /adresse|source/);
  assert.match(erreurProposition({ texte: "abc" }), /caractères/);
  assert.match(erreurProposition({ texte: "x".repeat(401) }), /caractères/);
  assert.match(erreurProposition({}), /manquant/);
  assert.match(erreurProposition({ texte: "Une règle correcte.", justification: "j".repeat(801) }), /justification/);
});
test("propositions : règle déjà connue, refusée ou en double dans le lot écartées", () => {
  const r = filtrerPropositions([
    { texte: "Éviter les communiqués sans données." },
    { texte: "éviter les COMMUNIQUÉS sans données !" },
    { texte: "Privilégier les rapports complets.", justification: "  11 retenus sur 13  " },
    { texte: "Ne pas proposer d'agenda." },
  ], ["Ne pas proposer d'agenda", "Une autre règle déjà refusée"]);
  assert.deepEqual(r.gardees.map((g) => g.texte), ["Éviter les communiqués sans données.", "Privilégier les rapports complets."]);
  assert.equal(r.gardees[1].justification, "11 retenus sur 13");
  assert.deepEqual(r.ignorees.map((i) => i.raison), ["doublon_dans_le_lot", "deja_connue"]);
});
console.log(`\n${n} tests passés`);
