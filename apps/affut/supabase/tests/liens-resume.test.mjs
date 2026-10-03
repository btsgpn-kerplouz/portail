// Test local des liens cliquables du résumé factuel : extrait esc() et
// escLiens() de index.html et les exécute. Usage :
// node apps/affut/supabase/tests/liens-resume.test.mjs — aucun accès réseau.
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import assert from "node:assert/strict";

const racine = join(dirname(fileURLToPath(import.meta.url)), "../..");
const html = readFileSync(join(racine, "index.html"), "utf8");
const i = html.indexOf("  function esc(s){"), j = html.indexOf("  // role=\"textbox\" (lot 5");
assert.ok(i >= 0 && j > i, "esc/escLiens introuvables");
const escLiens = new Function(html.slice(i, j) + "\nreturn escLiens;")();
let n = 0;
const test = (nom, f) => { f(); n++; console.log("ok  " + nom); };

test("texte sans adresse : simplement échappé", () => {
  assert.equal(escLiens("Plus de 3 < 5 & rien"), "Plus de 3 &lt; 5 &amp; rien");
});
test("adresse https : lien cliquable, nouvel onglet", () => {
  assert.equal(escLiens("Voir https://inpn.mnhn.fr/espece/123 pour le détail"),
    'Voir <a class="lien-resume" href="https://inpn.mnhn.fr/espece/123" target="_blank" rel="noopener">https://inpn.mnhn.fr/espece/123</a> pour le détail');
});
test("ponctuation finale hors du lien", () => {
  const h = escLiens("Rapport : https://ex.fr/r.pdf. Puis (www.ex.org/a), fin");
  assert.match(h, /href="https:\/\/ex\.fr\/r\.pdf"[^>]*>https:\/\/ex\.fr\/r\.pdf<\/a>\. Puis/);
  assert.match(h, /\(<a [^>]*href="https:\/\/www\.ex\.org\/a"[^>]*>www\.ex\.org\/a<\/a>\), fin/);
});
test("parenthèse appartenant à l'adresse (Wikipédia) gardée dans le lien", () => {
  assert.match(escLiens("Voir https://fr.wikipedia.org/wiki/Zostera_(plante)."), /href="https:\/\/fr\.wikipedia\.org\/wiki\/Zostera_\(plante\)"[^>]*>[^<]+<\/a>\.$/);
});
test("paramètres avec & : échappés, lien intact", () => {
  assert.match(escLiens("https://ex.fr/?a=1&b=2"), /href="https:\/\/ex\.fr\/\?a=1&amp;b=2"/);
});
test("aucune injection : guillemet, chevrons et javascript: ne passent pas", () => {
  const h = escLiens('https://ex.fr/"onmouseover="alert(1) <script>x</script> javascript:alert(1)');
  assert.ok(!/<script/.test(h));
  assert.match(h, /href="https:\/\/ex\.fr\/"/);
  assert.ok(!/href="javascript/i.test(h));
});
test("plusieurs adresses dans le même résumé", () => {
  assert.equal((escLiens("https://a.fr et https://b.fr").match(/<a /g) || []).length, 2);
});
console.log(n + " tests passés");
