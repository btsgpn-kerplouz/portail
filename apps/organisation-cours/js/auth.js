// Authentification "organisation-cours" — étape 2 du plan multi-utilisateurs
// (voir mémoire Claude Code : organisation-cours-multiuser-plan).
//
// Modèle repris de apps/phytoscope (signInWithPassword, repli signUp), avec
// deux différences actées :
//   - mot de passe PERSONNEL par enseignant (pas de secret de classe commun) ;
//   - identifiant = nom + 1re lettre du prénom, en minuscule (ex. "diraisonm"),
//     construit ici puis transformé en email interne fictif
//     "<identifiant>@organisation-cours.local" (jamais envoyé, jamais lu).
//
// Après connexion/inscription, la ligne du profil dans oc_enseignants est
// créée si besoin (actif=false par défaut — garde-fou décrit dans
// supabase/policies.sql : seul Martin peut activer un compte, via le SQL
// Editor). Tant qu'un compte n'est pas actif, la RLS ne renverra aucune
// donnée pédagogique.

import { getClient, estConfigure } from "./supabase-client.js";

const DOMAINE_EMAIL = "@organisation-cours.local";

const elCarte = document.getElementById("auth-card");
const elPlaceholder = document.getElementById("app-placeholder");

let sb = null;
let utilisateurCourant = null; // { user, profil } | null

function normaliserToken(s) {
  return String(s || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // accents
    .toLowerCase()
    .replace(/[^a-z]/g, "");
}

function construireIdentifiant(nom, prenom) {
  const n = normaliserToken(nom);
  const p = normaliserToken(prenom);
  return p ? n + p[0] : n;
}

function identifiantVersEmail(identifiant) {
  return identifiant + DOMAINE_EMAIL;
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

async function creerProfil(userId, nom, prenom, identifiant) {
  const initiales = ((prenom[0] || "") + (nom[0] || "")).toUpperCase();
  const { data, error } = await sb
    .from("oc_enseignants")
    .insert({
      user_id: userId,
      identifiant,
      nom: nom.trim(),
      prenom: prenom.trim(),
      initiales,
    })
    .select("user_id, actif, nom, prenom, initiales")
    .single();
  if (error) throw error;
  return data;
}

async function connecterOuCreer(nom, prenom, motDePasse) {
  const identifiant = construireIdentifiant(nom, prenom);
  if (!identifiant) throw new Error("Nom et prénom requis.");
  const email = identifiantVersEmail(identifiant);

  let session;
  const tentative = await sb.auth.signInWithPassword({ email, password: motDePasse });

  if (tentative.error) {
    // Identifiant inconnu (1re connexion) OU mot de passe incorrect : dans les
    // deux cas Supabase renvoie la même erreur générique (par sécurité), donc
    // on tente la création — si le compte existe déjà avec un autre mot de
    // passe, l'inscription échoue à son tour avec un message explicite.
    const inscription = await sb.auth.signUp({ email, password: motDePasse });
    if (inscription.error) {
      if (/already|registered|exists/i.test(inscription.error.message || "")) {
        throw new Error("Cet identifiant existe déjà avec un autre mot de passe.");
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
  if (!profil) profil = await creerProfil(session.user.id, nom, prenom, identifiant);

  return { user: session.user, profil };
}

function afficherFormulaire(erreur) {
  elCarte.innerHTML = `
    <h2>Connexion</h2>
    <p class="hint">L'identifiant est construit automatiquement à partir du nom et du prénom.
      Le mot de passe est personnel : il est créé automatiquement à la première connexion.</p>
    <form id="form-auth" novalidate>
      <label>Nom
        <input type="text" name="nom" autocomplete="family-name" required>
      </label>
      <label>Prénom
        <input type="text" name="prenom" autocomplete="given-name" required>
      </label>
      <label>Mot de passe
        <input type="password" name="motdepasse" autocomplete="current-password" required minlength="6">
      </label>
      <button type="submit">Se connecter</button>
      ${erreur ? `<p class="erreur" role="alert">${erreur}</p>` : ""}
    </form>
  `;
  document.getElementById("form-auth").addEventListener("submit", async (ev) => {
    ev.preventDefault();
    const f = new FormData(ev.target);
    const bouton = ev.target.querySelector("button");
    bouton.disabled = true;
    bouton.textContent = "Connexion…";
    try {
      utilisateurCourant = await connecterOuCreer(f.get("nom"), f.get("prenom"), f.get("motdepasse"));
      afficherEtat();
    } catch (e) {
      afficherFormulaire(e.message || "Erreur de connexion.");
    }
  });
}

function brancherDeconnexion() {
  document.getElementById("btn-deconnexion").addEventListener("click", async () => {
    await sb.auth.signOut();
    utilisateurCourant = null;
    elPlaceholder.hidden = true;
    afficherFormulaire();
  });
}

function afficherEtatActif(profil) {
  elCarte.innerHTML = `
    <h2>Connecté</h2>
    <p>Bonjour <strong>${profil.prenom} ${profil.nom}</strong> (${profil.initiales}).</p>
    <button id="btn-deconnexion" class="secondary">Se déconnecter</button>
  `;
  brancherDeconnexion();
  elPlaceholder.hidden = false;
}

function afficherEtatEnAttente(profil) {
  elCarte.innerHTML = `
    <h2>Compte en attente d'activation</h2>
    <p>Bonjour <strong>${profil.prenom} ${profil.nom}</strong>. Le compte a bien été créé, mais
      il doit être activé par Martin avant de pouvoir voir les cours — le prévenir.</p>
    <button id="btn-deconnexion" class="secondary">Se déconnecter</button>
  `;
  brancherDeconnexion();
  elPlaceholder.hidden = true;
}

function afficherEtat() {
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

  await restaurerSession();
  afficherEtat();

  sb.auth.onAuthStateChange((event) => {
    if (event === "SIGNED_OUT") {
      utilisateurCourant = null;
      elPlaceholder.hidden = true;
      afficherEtat();
    }
  });
}

init();
