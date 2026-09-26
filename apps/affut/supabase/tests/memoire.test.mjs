// Test local de l'espace « Mémoire de la veille » (onglet Sources, règles éditoriales, étape 3) : extrait
// renderMemoireEspace() de index.html et l'exécute avec des données factices.
// Usage : node apps/affut/supabase/tests/memoire.test.mjs — aucun accès réseau.
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import assert from "node:assert/strict";

const racine = join(dirname(fileURLToPath(import.meta.url)), "../..");
const html = readFileSync(join(racine, "index.html"), "utf8");
const i = html.indexOf("  function renderMemoireEspace(){"), j = html.indexOf("  function renderBilanEcran(){");
assert.ok(i >= 0 && j > i, "renderMemoireEspace introuvable");
const fabrique = (regles, propositions, regleEdition = null) =>
  new Function("regles", "propositions", "state", "esc", "MAX_REGLES_ACTIVES", html.slice(i, j) + "\nreturn renderMemoireEspace();")(
    regles, propositions, { regleEdition }, (t) => String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"), 30);
let n = 0;
const test = (nom, f) => { f(); n++; console.log("ok  " + nom); };
const regle = (id, texte, extra = {}) => ({ id, texte, actif: true, origine: "enseignant", ...extra });

test("migration 018 non appliquée (regles = null) : message, pas d'erreur", () => {
  assert.match(fabrique(null, []), /migration 018/);
});
test("aucune règle : message d'accueil et formulaire d'ajout", () => {
  const h = fabrique([], []);
  assert.match(h, /Aucune règle pour l'instant/);
  assert.match(h, /data-action="regle-ajouter"/);
  assert.match(h, /Règles en vigueur \(0 active\)/);
});
test("règles : compteur d'actives, désactivée barrée et signalée, origine indiquée", () => {
  const h = fabrique([regle(1, "Pas d'agenda."), regle(2, "Rapports complets d'abord.", { origine: "proposition_agent" }), regle(3, "Ancienne règle.", { actif: false })], []);
  assert.match(h, /Règles en vigueur \(2 actives\)/);
  assert.match(h, /regle-ligne inactive[\s\S]*?Ancienne règle\./);
  assert.match(h, /désactivée — ignorée par la routine/);
  assert.match(h, /proposée par la routine, acceptée/);
  assert.match(h, /écrite par vous/);
});
test("propositions en attente : affichées avec justification, boutons accepter/refuser ; décidées : absentes", () => {
  const h = fabrique([], [
    { id: 7, texte: "Éviter les communiqués sans données.", justification: "8 écarts sur 10", statut: "en_attente" },
    { id: 8, texte: "Déjà refusée.", justification: "", statut: "refusee" },
  ]);
  assert.match(h, /Proposé par la routine \(1\)/);
  assert.match(h, /Pourquoi : 8 écarts sur 10/);
  assert.match(h, /data-action="proposition-accepter" data-id="7"/);
  assert.match(h, /data-action="proposition-refuser" data-id="7"/);
  assert.ok(!h.includes("Déjà refusée."));
});
test("modification : la ligne en cours devient un champ de saisie prérempli", () => {
  const h = fabrique([regle(4, "Texte <à modifier>")], [], "4");
  assert.match(h, /<textarea id="regle-edit-4"[^>]*>Texte &lt;à modifier&gt;<\/textarea>/);
  assert.match(h, /data-action="regle-enregistrer" data-id="4"/);
});
test("texte échappé : aucune balise injectée depuis une règle ou une proposition", () => {
  const h = fabrique([regle(1, "<img src=x onerror=alert(1)>")], [{ id: 2, texte: "<script>x</script>", justification: "<b>", statut: "en_attente" }]);
  assert.ok(!/<img src=x/.test(h) && !/<script>x/.test(h));
});
test("30 règles actives : formulaire d'ajout remplacé par un message, acceptation et réactivation bloquées", () => {
  const trente = Array.from({ length: 30 }, (_, k) => regle(k + 1, "Règle numéro " + (k + 1)));
  const h = fabrique(trente, [{ id: 99, texte: "Une de plus.", justification: "", statut: "en_attente" }]);
  assert.ok(!h.includes('data-action="regle-ajouter"'));
  assert.match(h, /30 règles actives : c'est le maximum/);
  assert.match(h, /data-action="proposition-accepter" data-id="99" disabled/);
});

// ---- routage par adresse : #/sources et #/sources/memoire ----
const a = html.indexOf("  function navPage(){"), b = html.indexOf("  function navSynchroniser(){");
assert.ok(a >= 0 && b > a, "navPage/navAppliquer introuvables");
const routage = (redacteur, etat) => {
  const state = { vue: "sommaire", numeroId: 5, mode: "publiee", sourcesEspace: "sources", ...etat };
  const f = new Function("state", "numeros", "estRedacteurActif", html.slice(a, b) + "\nreturn { navPage, navAppliquer };")(
    state, [{ numero: 5 }], () => redacteur);
  return { state, ...f };
};
test("adresse de l'onglet Sources : liste = #/sources, espace Mémoire = #/sources/memoire", () => {
  assert.equal(routage(true, { vue: "sources" }).navPage(), "sources");
  assert.equal(routage(true, { vue: "sources", sourcesEspace: "memoire" }).navPage(), "sources/memoire");
});
test("lien direct #/sources/memoire : ouvre l'espace Mémoire pour un rédacteur", () => {
  const r = routage(true, {}); r.navAppliquer("sources/memoire");
  assert.equal(r.state.vue, "sources"); assert.equal(r.state.sourcesEspace, "memoire");
});
test("Retour vers #/sources : revient à la liste des sources, pas à la mémoire", () => {
  const r = routage(true, { vue: "sources", sourcesEspace: "memoire" }); r.navAppliquer("sources");
  assert.equal(r.state.vue, "sources"); assert.equal(r.state.sourcesEspace, "sources");
});
test("lien direct #/sources/memoire sans connexion : retombe sur le Sommaire", () => {
  const r = routage(false, { vue: "recherche" }); r.navAppliquer("sources/memoire");
  assert.equal(r.state.vue, "sommaire");
});
test("l'ancienne adresse #/memoire n'existe plus : Sommaire", () => {
  const r = routage(true, {}); r.navAppliquer("memoire");
  assert.equal(r.state.vue, "sommaire");
});
console.log(`\n${n} tests passés`);
