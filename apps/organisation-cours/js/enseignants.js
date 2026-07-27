// Cache des comptes enseignants actifs + résolution des jetons "teacher"
// legacy — étapes 5 et 6 du plan multi-utilisateurs (voir mémoire Claude
// Code : organisation-cours-multiuser-plan, et humming-singing-canyon.md).
//
// Utilisé par sync.js (résolution jeton -> compte, en coulisse) ET par
// js/enseignants-widget.js (étape 6 : cases à cocher des comptes actifs, à
// la place des 4 champs texte libres).
//
// Résolution d'un jeton legacy ("TZ", "Tanguy Zorro"...) vers un compte réel :
//   1. table oc_alias_initiales (déclaration explicite "je suis aussi TZ") ;
//   2. sinon égalité avec oc_enseignants.initiales (le cas courant : le jeton
//      legacy est déjà les initiales telles que construites à l'inscription).
// Ce qui ne résout pas reste résidu texte, géré par sync.js.

import { getClient } from "./supabase-client.js";

let parId = new Map();        // user_id -> { initiales, nom, prenom }
let parInitiales = new Map(); // initiales (MAJ) -> user_id (premier trouvé)
let parAlias = new Map();     // alias (MAJ) -> user_id

export async function rafraichir() {
  const s = await getClient();
  const [ens, alias] = await Promise.all([
    s.from("oc_enseignants").select("user_id, initiales, nom, prenom").eq("actif", true),
    s.from("oc_alias_initiales").select("alias, enseignant_id"),
  ]);
  if (ens.error) throw ens.error;
  if (alias.error) throw alias.error;

  parId = new Map((ens.data || []).map((e) => [e.user_id, e]));
  parInitiales = new Map();
  for (const e of ens.data || []) {
    const cle = (e.initiales || "").trim().toUpperCase();
    // Premier trouvé gagne : deux enseignants aux mêmes initiales, le second
    // devra passer par un alias explicite (ou des initiales personnalisées).
    if (cle && !parInitiales.has(cle)) parInitiales.set(cle, e.user_id);
  }
  parAlias = new Map((alias.data || []).map((a) => [String(a.alias).trim().toUpperCase(), a.enseignant_id]));
}

export function initialesDe(userId) {
  return parId.get(userId)?.initiales || "";
}

// Comptes actifs, pour le widget de multi-sélection (étape 6) : cases à
// cocher à la place des 4 champs texte libres legacy.
export function listerActifs() {
  return [...parId.values()].sort((a, b) => (a.initiales || "").localeCompare(b.initiales || ""));
}

export function resoudre(jeton) {
  const cle = String(jeton || "").trim().toUpperCase();
  if (!cle) return null;
  return parAlias.get(cle) || parInitiales.get(cle) || null;
}
