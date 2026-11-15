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
const bilan = entre("  function pluriel(nb, mot)", "  // « Ce que vous retenez, par format »");
const esc = (t) => String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
function fabrique({ redacteur = false, stockage = new Map(), rpcReponse = { data: null, error: null }, numeros = [] } = {}) {
  const appels = [];
  const localStorage = {
    getItem: (k) => (stockage.has(k) ? stockage.get(k) : null),
    setItem: (k, v) => stockage.set(k, String(v)),
  };
  const client = () => ({
    rpc: (nom, args) => { appels.push([nom, args]); return { then: (ok) => Promise.resolve(nom === "affut_bilan_frequentation" ? rpcReponse : (args && args.p_type === "repli" ? {} : rpcReponse)).then(ok) }; },
  });
  const window = { addEventListener() {}, crypto: globalThis.crypto };
  const etat = { vue: "bilan", bilanPeriode: { duree: "30", decalage: 0 }, bilanTout: { numeros: false, entrees: false } };
  const f = new Function("localStorage", "client", "window", "esc", "estRedacteurActif", "render", "crypto", "state", "numeros", "mobileActif", `
    ${suivi}
    ${bilan}
    return { idVisiteur, enregistrerEvenement, compterVueNumero, marquerAppareilRedacteur,
      periodeBilan, donneesPeriode, renderBilanEcran, renderBilanQuand, maxRond, isoJour };`);
  return { ...f(localStorage, client, window, esc, () => redacteur, () => {}, globalThis.crypto, etat, numeros, () => false), appels, stockage, etat };
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
const J = (a, m, j) => new Date(a, m - 1, j);
const iso = (d) => d.toISOString ? `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}` : d;
await test("période : 30 jours par défaut, précédente comparable", () => {
  const t = fabrique();
  const p = t.periodeBilan(J(2026, 11, 15), { duree: "30", decalage: 0 });
  assert.deepEqual([iso(p.debut), iso(p.fin), p.jours, p.plusRecente, p.plusAncienne], ["2026-10-17", "2026-11-15", 30, true, false]);
  assert.deepEqual([iso(p.precedente.debut), iso(p.precedente.fin)], ["2026-09-17", "2026-10-16"]);
});
await test("période : ‹ remonte et s'arrête au 1er septembre", () => {
  const t = fabrique();
  const p1 = t.periodeBilan(J(2026, 11, 15), { duree: "30", decalage: 1 });
  assert.deepEqual([iso(p1.debut), iso(p1.fin), p1.plusAncienne], ["2026-09-17", "2026-10-16", false]);
  const p2 = t.periodeBilan(J(2026, 11, 15), { duree: "30", decalage: 2 });
  assert.deepEqual([iso(p2.debut), iso(p2.fin), p2.plusAncienne, p2.precedente], ["2026-09-01", "2026-09-16", true, null]);
});
await test("période : depuis la rentrée (y compris en janvier)", () => {
  const t = fabrique();
  const p = t.periodeBilan(J(2027, 1, 10), { duree: "rentree", decalage: 0 });
  assert.deepEqual([iso(p.debut), iso(p.fin), p.precedente], ["2026-09-01", "2027-01-10", null]);
});
await test("graduation ronde", () => {
  const t = fabrique();
  assert.deepEqual([1, 3, 7, 12, 48].map(t.maxRond), [1, 5, 10, 20, 50]);
});
const DONNEES = {
  lecteurs: 3, visites: 5, jours_actifs: 2, revenus: 1, anonymes: 2, suivi_depuis: "2026-11-10",
  par_jour: [{ jour: "2026-11-01", lecteurs: 0, visites: 0, revenus: 0, vues_anonymes: 2 }, { jour: "2026-11-12", lecteurs: 3, visites: 5, revenus: 1, vues_anonymes: 0 }],
  numeros: [{ numero: 12, lecteurs: 1, vues_anonymes: 2 }, { numero: 13, lecteurs: 3, vues_anonymes: 0 }],
  entrees: [{ entree_id: "e1", numero: 13, lecteurs: 2, clics_anonymes: 0 }, { entree_id: "inconnue", numero: 13, lecteurs: 9, clics_anonymes: 0 }],
};
const NUMEROS = [
  { numero: 12, statut: "publie", titre: "Haies", semaine: "S45", datePublication: "2026-11-02", entrees: [] },
  { numero: 13, statut: "publie", titre: "Loutre", semaine: "S46", datePublication: "2026-11-09", entrees: [{ id: "e1", titre: "La loutre <revient>", rubrique: "Faune" }] },
];
await test("Bilan : chargement puis page complète", async () => {
  const t = fabrique({ rpcReponse: { data: DONNEES, error: null }, numeros: NUMEROS });
  assert.ok(t.renderBilanEcran().includes("Chargement"));
  await new Promise((r) => setTimeout(r, 0));
  const h = t.renderBilanEcran();
  assert.equal(t.appels.filter((a) => a[0] === "affut_bilan_periode").length, 2, "période + précédente, une seule fois chacune");
  for (const attendu of ["Est-ce utilisé ?", "Quand ?", "Quoi ?", "Revenus plusieurs fois le même jour", "Vues anciennes"]) assert.ok(h.includes(attendu), attendu);
  assert.ok(h.indexOf("n° 13 · Loutre") < h.indexOf("n° 12 · Haies"), "classé par lecteurs");
  assert.ok(h.includes("+ 2 vues avant le suivi"));
  assert.ok(h.includes("La loutre &lt;revient&gt;"), "titre échappé");
  assert.ok(!h.includes("inconnue"), "entrée supprimée ignorée");
  assert.ok(!h.includes("bilan-ecart\">▲"), "pas de comparaison : période précédente antérieure au suivi");
});
await test("Quand : barres, parutions, vues anciennes légendées, infobulles", () => {
  const t = fabrique({ numeros: NUMEROS });
  const p = t.periodeBilan(J(2026, 11, 15), { duree: "30", decalage: 0 });
  const h = t.renderBilanQuand(p, DONNEES);
  assert.equal((h.match(/class="bg-barre"/g) || []).length, 1);
  assert.equal((h.match(/class="bg-barre ancien"/g) || []).length, 1);
  assert.equal((h.match(/class="bg-parution"/g) || []).length, 2);
  assert.equal((h.match(/class="bg-zone"/g) || []).length, 30);
  assert.ok(h.includes("3 lecteurs · 5 visites · 1 revenu le même jour"));
  assert.ok(h.includes("Vues, avant le suivi par lecteur"));
  assert.ok(t.renderBilanQuand(p, { par_jour: [] }).includes("Aucune visite"));
});
await test("Bilan : migration 021 absente → message", async () => {
  const t = fabrique({ rpcReponse: { data: null, error: { code: "PGRST202" } } });
  t.renderBilanEcran();
  await new Promise((r) => setTimeout(r, 0));
  assert.ok(t.renderBilanEcran().includes("migration 021"));
});
console.log(n + " tests passés");
