// Test local du tableau « par format » du Bilan et des puces de motif (index.html).
// Extrait les fonctions du HTML et les exécute avec des données factices — aucun accès réseau.
// Usage : node apps/affut/supabase/tests/bilan-formats.test.mjs
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import assert from "node:assert/strict";

const html = readFileSync(join(dirname(fileURLToPath(import.meta.url)), "../../index.html"), "utf8");
const entre = (debut, fin) => {
  const i = html.indexOf(debut), j = html.indexOf(fin, i);
  assert.ok(i >= 0 && j > i, "introuvable : " + debut);
  return html.slice(i, j);
};
const vocab = entre("  var FORMATS = {", "  function motifCodeChoisi");
const motifCodeChoisi = entre("  function motifCodeChoisi", "\n  }\n") + "\n  }\n";
const bilan = entre("  function renderBilanFormats(){", "  function renderBilanEcran(){");

const fabrique = new Function("numeros", "ecartes", "esc", `
  ${vocab}
  ${motifCodeChoisi}
  ${bilan}
  return { renderMotifChoix, motifCodeChoisi, renderBilanFormats, FORMATS, MOTIFS_ECART };`);
const esc = (t) => String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
let n = 0;
const test = (nom, f) => { f(); n++; console.log("ok  " + nom); };

test("puces de motif : un radio par motif, tous les codes de la migration SQL", () => {
  const { renderMotifChoix, MOTIFS_ECART } = fabrique([], [], esc);
  const h = renderMotifChoix();
  assert.equal((h.match(/type="radio"/g) || []).length, MOTIFS_ECART.length);
  const sql = readFileSync(join(dirname(fileURLToPath(import.meta.url)), "../017-format-et-motif-ecart.sql"), "utf8");
  for (const m of MOTIFS_ECART) assert.ok(sql.includes("'" + m.code + "'"), "motif absent du SQL : " + m.code);
});
test("formats du front : mêmes codes que la migration SQL", () => {
  const { FORMATS } = fabrique([], [], esc);
  const sql = readFileSync(join(dirname(fileURLToPath(import.meta.url)), "../017-format-et-motif-ecart.sql"), "utf8");
  for (const c of Object.keys(FORMATS).filter((c) => c !== "non_classe")) assert.ok(sql.includes("'" + c + "'"), "format absent du SQL : " + c);
});
test("motif choisi lu dans le panneau ; aucun choix = null", () => {
  const { motifCodeChoisi } = fabrique([], [], esc);
  assert.equal(motifCodeChoisi({ querySelector: () => ({ value: "trop_court" }) }), "trop_court");
  assert.equal(motifCodeChoisi({ querySelector: () => null }), null);
  assert.equal(motifCodeChoisi(null), null);
});
test("bilan : migration non appliquée (ecartes = null) → message, pas d'erreur", () => {
  const h = fabrique([], null, esc).renderBilanFormats();
  assert.match(h, /migration 017/);
});
test("bilan : aucune décision → message vide", () => {
  assert.match(fabrique([{ entrees: [] }], [], esc).renderBilanFormats(), /Rien à afficher/);
});
test("bilan : parts retenues par format, non classé signalé, sources absentes", () => {
  const numeros = [{ entrees: [
    { origine: "auto", valide: true, format: "rapport_etude" }, { origine: "auto", valide: true, format: "rapport_etude" },
    { origine: "auto", valide: true, format: "breve" }, { origine: "auto", valide: true, format: null },
    { origine: "manuel", valide: true, format: "breve" },          // saisie manuelle : hors mesure
    { origine: "auto", valide: false, format: "breve" },           // pas encore validée : hors mesure
  ] }];
  const ecartes = [
    { format: "breve", motif_code: "trop_court" }, { format: "breve", motif_code: "trop_court" },
    { format: "breve", motif_code: null }, { format: "agenda", motif_code: "hors_sujet" },
  ];
  const h = fabrique(numeros, ecartes, esc).renderBilanFormats();
  assert.match(h, /Rapport, bilan, étude<\/span><span class="nb">2<\/span><span class="nb">0<\/span>[\s\S]*?100 %/);
  assert.match(h, /Brève \/ communiqué court<\/span><span class="nb">1<\/span><span class="nb">3<\/span>[\s\S]*?25 %/);
  assert.match(h, /Non classé<\/span><span class="nb">1<\/span>/);
  assert.match(h, /Trop court, simple résumé <b>2<\/b>/);
  assert.match(h, /Non classé » : décisions antérieures/);
});
console.log(`\n${n} tests passés`);
