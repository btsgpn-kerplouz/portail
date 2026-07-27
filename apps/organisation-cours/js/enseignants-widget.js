// Widget de multi-sélection des enseignants — étape 6 du plan
// multi-utilisateurs (voir mémoire Claude Code :
// organisation-cours-multiuser-plan, et humming-singing-canyon.md).
//
// Remplace visuellement les 4 champs texte libres "Enseignant(s)" par des
// cases à cocher (comptes actifs) + un champ résiduel (jetons non résolus —
// ex. un collègue pas encore inscrit). Écrit la même chaîne "TZ, MD" que le
// legacy dans l'input caché d'origine (id inchangé) : app.js n'a besoin
// d'aucune modification (ouverture, sauvegarde, affichage — teacherTokens()
// et alentours — restent identiques, cf. étape 5 / js/sync.js).
//
// Les 4 <dialog> (ueDialog, templateDialog, sequenceDialog, sessionDialog)
// n'émettent aucun événement d'ouverture : on observe l'attribut `open` de
// chacun (posé par showModal(), déjà appelé APRÈS que app.js ait rempli
// l'input caché) pour rafraîchir les cases à cocher à chaque ouverture — y
// compris la liste des comptes actifs, au cas où un collègue aurait été
// activé en cours de session (même logique que sync.js).
//
// Tant que l'utilisateur ne touche pas au widget, l'input caché garde
// exactement la valeur posée par app.js à l'ouverture : aucune réécriture
// silencieuse. La reconstruction case/résidu ne sert qu'à l'AFFICHAGE ; elle
// n'est répercutée dans l'input caché qu'au premier changement (case cochée
// ou champ résiduel modifié).

import * as enseignants from "./enseignants.js";

const CIBLES = [
  { dialog: "ueDialog", input: "ueTeacher", cases: "ueTeacherChoices", residu: "ueTeacherResidu" },
  { dialog: "templateDialog", input: "templateTeacher", cases: "templateTeacherChoices", residu: "templateTeacherResidu" },
  { dialog: "sequenceDialog", input: "sequenceTeacher", cases: "sequenceTeacherChoices", residu: "sequenceTeacherResidu" },
  { dialog: "sessionDialog", input: "sessionTeacher", cases: "sessionTeacherChoices", residu: "sessionTeacherResidu" },
  { dialog: "reunionDialog", input: "reunionTeacher", cases: "reunionTeacherChoices", residu: "reunionTeacherResidu" },
];

// Même grammaire que teacherTokens() dans app.js — dupliquée volontairement
// (module ES, ne peut pas importer d'un <script> classique non-module ; même
// choix que teacherTokensLocal() dans sync.js).
function tokensDe(valeur) {
  return String(valeur || "").split(/[;,/]/).map((x) => x.trim()).filter(Boolean);
}

function echapper(s) {
  return String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function brancher({ dialog, input, cases, residu }) {
  const dialogEl = document.getElementById(dialog);
  const inputEl = document.getElementById(input);
  const casesEl = document.getElementById(cases);
  const residuEl = document.getElementById(residu);
  if (!dialogEl || !inputEl || !casesEl || !residuEl) return;

  function recalculer() {
    const coches = [...casesEl.querySelectorAll("input[type=checkbox]:checked")].map((c) => c.dataset.initiales);
    inputEl.value = [...coches, ...tokensDe(residuEl.value)].join(", ");
  }

  casesEl.addEventListener("change", recalculer);
  residuEl.addEventListener("input", recalculer);

  async function rafraichirDepuisInput() {
    try {
      await enseignants.rafraichir();
    } catch (e) {
      console.error("Widget enseignants : liste des comptes actifs indisponible.", e);
    }
    const comptes = enseignants.listerActifs();
    const tokens = tokensDe(inputEl.value);
    const majTokens = new Set(tokens.map((t) => t.toUpperCase()));
    casesEl.innerHTML = comptes.length
      ? comptes.map((c) => {
          const coche = majTokens.has((c.initiales || "").toUpperCase());
          const nomComplet = `${c.prenom || ""} ${c.nom || ""}`.trim();
          return `<label class="checkbox-chip"><input type="checkbox" data-initiales="${echapper(c.initiales)}" ${coche ? "checked" : ""}><span title="${echapper(nomComplet)}">${echapper(c.initiales)}</span></label>`;
        }).join("")
      : '<p class="form-help tight">Aucun collègue actif pour l’instant.</p>';
    const initialesActives = new Set(comptes.map((c) => (c.initiales || "").toUpperCase()));
    residuEl.value = tokens.filter((t) => !initialesActives.has(t.toUpperCase())).join(", ");
  }

  new MutationObserver(() => { if (dialogEl.open) rafraichirDepuisInput(); })
    .observe(dialogEl, { attributes: true, attributeFilter: ["open"] });
}

CIBLES.forEach(brancher);
