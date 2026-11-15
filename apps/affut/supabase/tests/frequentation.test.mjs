// Test local du suivi de fréquentation (index.html, migration 020) : identifiant
// visiteur, exclusion du rédacteur, regroupement du Bilan. Aucun accès réseau.
// Usage : node apps/affut/supabase/tests/frequentation.test.mjs
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
const suivi = entre('  var CLE_VISITEUR = "affut:visiteur"', "  // ---- authentification");
const bilan = entre("  var frequentation = null, frequentationEtat", "  // Histogramme compact");
const lignes = entre("  function pluriel(nb, mot)", "  function renderBilanRowNumero");
const app = entre("  function renderBilanFrequentationApp(){", "  function renderBilanEcran(){");

const esc = (t) => String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
function fabrique({ redacteur = false, stockage = new Map(), rpcReponse = { data: null, error: null } } = {}) {
  const appels = [];
  const localStorage = {
    getItem: (k) => (stockage.has(k) ? stockage.get(k) : null),
    setItem: (k, v) => stockage.set(k, String(v)),
  };
  const client = () => ({
    rpc: (nom, args) => { appels.push([nom, args]); return { then: (ok) => Promise.resolve(nom === "affut_bilan_frequentation" ? rpcReponse : (args && args.p_type === "repli" ? {} : rpcReponse)).then(ok) }; },
  });
  const window = { addEventListener() {}, crypto: globalThis.crypto };
  const f = new Function("localStorage", "client", "window", "esc", "estRedacteurActif", "render", "crypto", `
    ${suivi}
    ${bilan}
    ${lignes}
    ${app}
    return { idVisiteur, enregistrerEvenement, compterVueNumero, marquerAppareilRedacteur, chargerFrequentation,
      fenetreSeptJours, compterParJour, detailFrequentationNumero, formatDelai, renderBilanFrequentationApp,
      etat: () => frequentationEtat };`);
  return { ...f(localStorage, client, window, esc, () => redacteur, () => {}, globalThis.crypto), appels, stockage };
}
let n = 0;
const test = async (nom, f) => { await f(); n++; console.log("ok  " + nom); };

await test("identifiant visiteur : uuid stable dans le stockage", () => {
  const t = fabrique();
  const a = t.idVisiteur(), b = t.idVisiteur();
  assert.match(a, /^[0-9a-f-]{36}$/);
  assert.equal(a, b);
  assert.equal(t.stockage.get("affut:visiteur"), a);
});
await test("stockage bloqué : uuid propre à la page, sans erreur", () => {
  const t = fabrique();
  const f = new Function("localStorage", "window", "client", "estRedacteurActif", `${suivi}; return idVisiteur;`);
  const id = f({ getItem() { throw new Error("bloqué"); }, setItem() { throw new Error("bloqué"); } }, { addEventListener() {} }, null, () => false);
  assert.equal(id(), id());
});
await test("vue d'un numéro : un seul envoi par chargement de page, avec le visiteur", () => {
  const t = fabrique();
  t.compterVueNumero(3); t.compterVueNumero(3); t.compterVueNumero(4);
  assert.equal(t.appels.length, 2);
  assert.deepEqual(t.appels[0], ["affut_enregistrer_evenement", { p_type: "vue_numero", p_visiteur: t.idVisiteur(), p_numero: 3, p_entree_id: null }]);
});
await test("rédacteur connecté, ou appareil déjà marqué : rien n'est envoyé", () => {
  const t1 = fabrique({ redacteur: true });
  t1.enregistrerEvenement("ouverture");
  assert.equal(t1.appels.length, 0);
  const t2 = fabrique();
  t2.marquerAppareilRedacteur();
  t2.enregistrerEvenement("ouverture");
  assert.equal(t2.appels.length, 0);
});
await test("migration 020 absente : repli sur l'ancien compteur", async () => {
  const t = fabrique({ rpcReponse: { error: { code: "PGRST202", message: "x" } } });
  t.enregistrerEvenement("clic_source", null, "e1");
  await new Promise((r) => setTimeout(r, 0));
  assert.deepEqual(t.appels[1], ["affut_incrementer_clic_source", { p_entree_id: "e1" }]);
});
await test("Bilan : chiffres regroupés lus, graphes jour par jour remplis", async () => {
  const data = {
    depuis: "2026-11-10T07:00:00+00:00", visiteurs: 2, visites: 5, visiteurs_multi: 1, jours_multi: 1, recherches: 0, installations: 0,
    par_jour: [{ jour: "2026-11-10", visiteurs: 2, visites: 4, visiteurs_multi: 1 }, { jour: "2026-11-11", visiteurs: 1, visites: 1, visiteurs_multi: 0 }],
    par_numero: [{ numero: 1, lecteurs: 2, lecteurs_source: 1, relecteurs: 1, delai_median_h: 33.175 }],
    par_jour_numero: [{ numero: 1, jour: "2026-11-10", vues: 3, lecteurs: 2 }],
    par_jour_entree: [],
  };
  const t = fabrique({ rpcReponse: { data, error: null } });
  await t.chargerFrequentation();
  assert.equal(t.etat(), "ok");
  assert.equal(t.detailFrequentationNumero({ numero: 1 }), "2 lecteurs · 1 l'ont rouvert · 50 % ont ouvert une source · 1re lecture en médiane 33 h après parution");
  assert.equal(t.detailFrequentationNumero({ numero: 9 }), "");
  const h = t.renderBilanFrequentationApp();
  assert.ok(h.indexOf("11 nov") < h.indexOf("10 nov"), "le plus récent en haut");
  assert.ok(h.includes("1 lecteur<"));
  const jours = t.fenetreSeptJours("2026-11-09", {});
  const c = t.compterParJour(jours, { "2026-11-10": 3 });
  assert.deepEqual(c.map((x) => x.total), [0, 3, 0, 0, 0, 0, 0]);
  assert.equal(t.fenetreSeptJours(null, { "2026-11-12": 1, "2026-11-10": 2 })[0].toISOString().slice(0, 10), "2026-11-10");
  assert.equal(t.fenetreSeptJours(null, {}), null);
});
await test("Bilan : migration absente → message, pas de plantage", async () => {
  const t = fabrique({ rpcReponse: { data: null, error: { code: "PGRST202" } } });
  await t.chargerFrequentation();
  assert.equal(t.etat(), "indisponible");
  assert.ok(t.renderBilanFrequentationApp().includes("migration 020"));
});
await test("délais lisibles", () => {
  const t = fabrique();
  assert.equal(t.formatDelai(0.4), "moins d'1 h");
  assert.equal(t.formatDelai(5.2), "5 h");
  assert.equal(t.formatDelai(60), "2,5 j");
});
console.log(n + " tests passés");
