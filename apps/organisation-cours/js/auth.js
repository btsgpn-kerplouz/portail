// Authentification "organisation-cours" — connexion par e-mail + mot de passe
// (voir mémoire Claude Code : organisation-cours-multiuser-plan).
//
// L'adresse e-mail professionnelle EST l'identifiant Supabase : plus simple
// à saisir qu'un couple nom+prénom pour une action qui se répète souvent.
// Nom/prénom restent utilisés en interne (initiales, widget enseignants) :
// à l'inscription, ils sont déduits automatiquement de l'adresse (convention
// "prenom.nom@etablissement...") — approximatif (accents perdus) mais
// suffisant pour l'affichage.
//
// mot de passe PERSONNEL par enseignant (pas de secret de classe commun).
// "Mot de passe oublié ?" est autonome (lien Supabase envoyé par e-mail à
// l'adresse saisie) — aucune intervention de Martin nécessaire.
//
// Après connexion/inscription, la ligne du profil dans oc_enseignants est
// créée si besoin (actif=false par défaut — garde-fou décrit dans
// supabase/policies.sql : seul Martin peut activer un compte, via le SQL
// Editor). Tant qu'un compte n'est pas actif, la RLS ne renverra aucune
// donnée pédagogique.

import { getClient, estConfigure } from "./supabase-client.js";

const elCarte = document.getElementById("auth-card");
const elAppShell = document.getElementById("app-shell");
const elAuthShell = document.querySelector(".auth-shell");
const elAuthCompact = document.getElementById("auth-compact");

let sb = null;
let utilisateurCourant = null; // { user, profil } | null
// true entre l'arrivée via le lien "mot de passe oublié" et la saisie du
// nouveau mot de passe : court-circuite l'écran normal le temps de la saisie.
let enRecuperation = false;

function normaliserToken(s) {
  return String(s || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // accents
    .toLowerCase()
    .replace(/[^a-z]/g, "");
}

function capitaliser(s) {
  return s ? s[0].toUpperCase() + s.slice(1) : s;
}

// Déduit nom/prénom depuis la partie locale de l'adresse, au format
// "prenom.nom@..." (convention de l'établissement de Martin). Résultat
// approximatif (accents perdus, casse reconstituée) mais suffisant pour
// l'affichage ; en cas de format inhabituel (pas de point), tout devient le
// "nom" et le prénom reste vide plutôt que de deviner au hasard.
function deriverNomPrenom(email) {
  const local = String(email || "").split("@")[0];
  const morceaux = local.split(".").map((m) => m.trim()).filter(Boolean);
  if (morceaux.length === 0) return { nom: "", prenom: "" };
  const [premier, ...reste] = morceaux;
  const nom = reste.length ? reste.join(" ") : premier;
  const prenom = reste.length ? premier : "";
  return { nom: capitaliser(nom), prenom: capitaliser(prenom) };
}

function construireIdentifiant(nom, prenom) {
  const n = normaliserToken(nom);
  const p = normaliserToken(prenom);
  return p ? n + p[0] : n;
}

function urlPage() {
  return window.location.origin + window.location.pathname;
}

async function chargerProfil(userId) {
  const { data, error } = await sb
    .from("oc_enseignants")
    .select("user_id, actif, nom, prenom, initiales")
    .eq("user_id", userId)
    .maybeSingle();
  if (error) throw error;
  return data;
}

async function creerProfil(userId, email) {
  const { nom, prenom } = deriverNomPrenom(email);
  const identifiant = construireIdentifiant(nom, prenom);
  const initiales = ((prenom[0] || "") + (nom[0] || "")).toUpperCase();
  const { data, error } = await sb
    .from("oc_enseignants")
    .insert({ user_id: userId, identifiant, nom, prenom, initiales })
    .select("user_id, actif, nom, prenom, initiales")
    .single();
  if (error) throw error;
  return data;
}

async function connecterOuCreer(email, motDePasse) {
  const tentative = await sb.auth.signInWithPassword({ email, password: motDePasse });

  let session;
  if (tentative.error) {
    // Adresse inconnue (1re connexion) OU mot de passe incorrect : Supabase
    // renvoie la même erreur générique dans les deux cas (par sécurité), donc
    // on tente la création — si le compte existe déjà avec un autre mot de
    // passe, l'inscription échoue à son tour avec un message explicite.
    const inscription = await sb.auth.signUp({ email, password: motDePasse });
    if (inscription.error) {
      if (/already|registered|exists/i.test(inscription.error.message || "")) {
        throw new Error(
          "Ce mot de passe ne correspond pas à cette adresse. « Mot de passe oublié ? » pour le réinitialiser."
        );
      }
      throw inscription.error;
    }
    if (!inscription.data || !inscription.data.session) {
      throw new Error(
        "Compte créé, mais la connexion immédiate est bloquée : « Confirm email » doit être désactivé côté Supabase (Authentication → Providers → Email)."
      );
    }
    session = inscription.data.session;
  } else {
    session = tentative.data.session;
  }

  let profil = await chargerProfil(session.user.id);
  if (!profil) profil = await creerProfil(session.user.id, email);

  return { user: session.user, profil };
}

async function demanderReinitialisation(email) {
  const { error } = await sb.auth.resetPasswordForEmail(email, { redirectTo: urlPage() });
  if (error) throw error;
}

function afficherFormulaire(erreur, info) {
  elAuthShell.hidden = false;
  elAuthCompact.innerHTML = "";
  elCarte.innerHTML = `
    <h2>Connexion</h2>
    <p class="hint">Adresse e-mail professionnelle. Le mot de passe est personnel : il est créé
      automatiquement à la première connexion.</p>
    <form id="form-auth" novalidate>
      <label>E-mail
        <input type="email" name="email" autocomplete="username" required>
      </label>
      <label>Mot de passe
        <input type="password" name="motdepasse" autocomplete="current-password" required minlength="6">
      </label>
      <button type="submit">Se connecter</button>
      <button type="button" id="btn-mdp-oublie" class="lien">Mot de passe oublié ?</button>
      ${erreur ? `<p class="erreur" role="alert">${erreur}</p>` : ""}
      ${info ? `<p class="hint">${info}</p>` : ""}
    </form>
  `;
  const form = document.getElementById("form-auth");
  form.addEventListener("submit", async (ev) => {
    ev.preventDefault();
    const f = new FormData(ev.target);
    const bouton = ev.target.querySelector("button[type=submit]");
    bouton.disabled = true;
    bouton.textContent = "Connexion…";
    try {
      utilisateurCourant = await connecterOuCreer(f.get("email").trim().toLowerCase(), f.get("motdepasse"));
      afficherEtat();
    } catch (e) {
      afficherFormulaire(e.message || "Erreur de connexion.");
    }
  });
  document.getElementById("btn-mdp-oublie").addEventListener("click", async () => {
    const champEmail = form.querySelector('input[name="email"]');
    const email = (champEmail.value || "").trim().toLowerCase();
    if (!email) {
      champEmail.focus();
      return;
    }
    try {
      await demanderReinitialisation(email);
      afficherFormulaire(null, `Si un compte existe pour ${escapeAttrLocal(email)}, un lien de réinitialisation vient d'être envoyé.`);
    } catch (e) {
      afficherFormulaire(e.message || "Échec de l'envoi du lien.");
    }
  });
}

function afficherFormulaireNouveauMotDePasse(erreur) {
  elAuthShell.hidden = false;
  elAuthCompact.innerHTML = "";
  elCarte.innerHTML = `
    <h2>Nouveau mot de passe</h2>
    <p class="hint">Vous arrivez depuis le lien de réinitialisation. Choisissez un nouveau mot de passe.</p>
    <form id="form-nouveau-mdp" novalidate>
      <label>Nouveau mot de passe
        <input type="password" name="motdepasse" autocomplete="new-password" required minlength="6">
      </label>
      <button type="submit">Valider</button>
      ${erreur ? `<p class="erreur" role="alert">${erreur}</p>` : ""}
    </form>
  `;
  document.getElementById("form-nouveau-mdp").addEventListener("submit", async (ev) => {
    ev.preventDefault();
    const f = new FormData(ev.target);
    const bouton = ev.target.querySelector("button");
    bouton.disabled = true;
    bouton.textContent = "Validation…";
    try {
      const { error } = await sb.auth.updateUser({ password: f.get("motdepasse") });
      if (error) throw error;
      enRecuperation = false;
      const { data } = await sb.auth.getSession();
      const profil = await chargerProfil(data.session.user.id);
      utilisateurCourant = { user: data.session.user, profil };
      afficherEtat();
    } catch (e) {
      afficherFormulaireNouveauMotDePasse(e.message || "Échec de la mise à jour.");
    }
  });
}

function brancherDeconnexion() {
  document.getElementById("btn-deconnexion").addEventListener("click", async () => {
    await sb.auth.signOut();
    utilisateurCourant = null;
    elAppShell.hidden = true;
    window.OC_APP?.arreter();
    afficherFormulaire();
  });
}

async function modifierInitiales(nouvellesInitiales) {
  const initiales = nouvellesInitiales.trim().toUpperCase();
  if (!initiales) throw new Error("Les initiales ne peuvent pas être vides.");
  const { data, error } = await sb
    .from("oc_enseignants")
    .update({ initiales })
    .eq("user_id", utilisateurCourant.user.id)
    .select("user_id, actif, nom, prenom, initiales")
    .single();
  if (error) throw error;
  utilisateurCourant.profil = data;
  return data;
}

// Après connexion, la grande carte de connexion disparaît complètement (elle
// prenait toute la largeur au-dessus du bandeau titre — retour utilisateur) :
// il ne reste qu'un indicateur discret dans le bandeau, à côté des onglets.
function afficherEtatActif(profil) {
  elAuthShell.hidden = true;
  elCarte.innerHTML = "";
  elAuthCompact.innerHTML = `
    <span id="initiales-affichees" title="${escapeAttrLocal(profil.prenom)} ${escapeAttrLocal(profil.nom)}">${escapeAttrLocal(profil.initiales)}</span>
    <button type="button" id="btn-modifier-initiales" class="lien" title="Modifier mes initiales">✎</button>
    <button type="button" id="btn-recharger" class="lien" title="Recharger les données (récupérer les dernières modifications des collègues)">⟳</button>
    <button type="button" id="btn-deconnexion" class="lien" title="Se déconnecter">Déconnexion</button>
  `;
  document.getElementById("btn-modifier-initiales").addEventListener("click", () => {
    const actuelles = utilisateurCourant.profil.initiales;
    const saisie = window.prompt("Initiales affichées dans les pastilles (2-4 lettres) :", actuelles);
    if (saisie == null || saisie.trim() === actuelles) return;
    modifierInitiales(saisie)
      .then((p) => afficherEtatActif(p))
      .catch((e) => window.alert(e.message || "Échec de la modification des initiales."));
  });
  document.getElementById("btn-recharger").addEventListener("click", (ev) => {
    const bouton = ev.currentTarget;
    if (bouton.disabled) return; // évite un double-clic pendant le rechargement
    bouton.disabled = true;
    Promise.resolve(window.OC_APP?.recharger()).finally(() => {
      bouton.disabled = false;
    });
  });
  brancherDeconnexion();
  elAppShell.hidden = false;
  window.OC_APP.demarrer(profil.initiales);
}

// Compte créé mais pas encore activé : l'app reste inaccessible (RLS), donc
// la page dédiée reste pertinente ici — rien à cacher derrière un indicateur.
function afficherEtatEnAttente(profil) {
  elAuthShell.hidden = false;
  elAuthCompact.innerHTML = "";
  elCarte.innerHTML = `
    <h2>Compte en attente d'activation</h2>
    <p>Bonjour <strong>${profil.prenom} ${profil.nom}</strong>. Le compte a bien été créé, mais
      il doit être activé par Martin avant de pouvoir voir les cours — le prévenir.</p>
    <button id="btn-deconnexion" class="secondary">Se déconnecter</button>
  `;
  brancherDeconnexion();
  elAppShell.hidden = true;
}

function escapeAttrLocal(s) {
  return String(s ?? "").replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
}

function afficherEtat() {
  if (enRecuperation) return afficherFormulaireNouveauMotDePasse();
  if (!utilisateurCourant) return afficherFormulaire();
  const { profil } = utilisateurCourant;
  if (profil.actif) afficherEtatActif(profil);
  else afficherEtatEnAttente(profil);
}

async function restaurerSession() {
  const { data } = await sb.auth.getSession();
  if (!data || !data.session) return;
  try {
    const profil = await chargerProfil(data.session.user.id);
    if (profil) utilisateurCourant = { user: data.session.user, profil };
  } catch (e) {
    console.error("Impossible de charger le profil enseignant :", e);
  }
}

async function init() {
  if (!estConfigure()) {
    elCarte.innerHTML = `<p class="erreur">Configuration Supabase manquante — voir js/supabase-client.js.</p>`;
    return;
  }
  sb = await getClient();

  // Abonnement AVANT toute lecture de session : le lien "mot de passe oublié"
  // peut faire émettre PASSWORD_RECOVERY dès l'hydratation initiale du SDK.
  sb.auth.onAuthStateChange((event) => {
    if (event === "PASSWORD_RECOVERY") {
      enRecuperation = true;
      afficherEtat();
    } else if (event === "SIGNED_OUT") {
      utilisateurCourant = null;
      enRecuperation = false;
      elAppShell.hidden = true;
      window.OC_APP?.arreter();
      afficherEtat();
    }
  });

  await restaurerSession();
  afficherEtat();
}

init();
