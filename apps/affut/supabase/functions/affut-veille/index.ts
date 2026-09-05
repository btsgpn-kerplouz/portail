// ============================================================================
// affut — Edge Function "affut-veille" (Lot 8)
// ============================================================================
// Point d'entrée unique de la routine cloud planifiée (skill `schedule`,
// voir apps/affut/documents/brief-veille.md) — la routine ne parle plus
// jamais directement à l'API REST Supabase avec la clé service_role : elle
// appelle cette fonction, qui fait le travail privilégié en interne.
//
// Pourquoi : la clé service_role ne peut être stockée nulle part côté
// Claude Code cloud de façon sûre (les "variables d'environnement" d'une
// routine sont explicitement en clair, visibles par quiconque utilise
// l'environnement — voir la discussion dans AVANCEMENT.md, Lot 8). Ici,
// SUPABASE_SERVICE_ROLE_KEY est fournie automatiquement par la plateforme
// Supabase à toute Edge Function, sans qu'on ait besoin de la stocker
// nous-mêmes. La routine ne détient qu'un jeton bien plus faible
// (AFFUT_VEILLE_TOKEN, secret de fonction) — même en fuite, il ne permet
// que d'appeler CETTE fonction, jamais un accès direct à la base.
//
// GET  : renvoie le contexte utile à la recherche (numéro cible, moisson
//        actuelle, entrées déjà publiées récemment, candidats récemment
//        écartés, URLs déjà utilisées, sources suivies à moissonner en
//        priorité — écran « Sources », voir brief-veille.md) — handleContext().
// POST : reçoit { numero, candidats: [...] } et les écrit dans
//        affut_numeros.moisson (dédoublonnées), journalise dans
//        affut_ingestion_log — voir handleIngest().
//
// Déployée avec `supabase functions deploy affut-veille --no-verify-jwt`
// (pas de vérification JWT Supabase : l'auth se fait via AFFUT_VEILLE_TOKEN
// ci-dessous, pas via un compte Supabase Auth).
//
// Durcissement (31/08/2026, suite à une discussion sur le risque d'une
// fuite d'AFFUT_VEILLE_TOKEN — jeton bien plus faible que service_role,
// mais quand même un secret posé dans un champ que la plateforme Claude
// Code elle-même déconseille pour des secrets) :
// - `motif` (raisonnement éditorial de l'enseignant sur un candidat
//   écarté) reste exposé par GET — décision assumée de l'enseignant après
//   avoir vu le risque précis (lecture seule, 15 dernières entrées, même
//   périmètre de fuite que le reste). En contrepartie, l'écran Moisson
//   rappelle maintenant explicitement ce risque au moment de la saisie
//   (apps/affut/index.html, invite de « Écarter »).
// - GET ne renvoie plus que les entrées d'un numéro RÉELLEMENT publié
//   (plus de fuite du contenu d'un numéro pas encore publié) ;
// - POST plafonne la taille de chaque champ et le nombre de candidats par
//   appel, et refuse au-delà d'un nombre d'appels par heure (voir
//   verifierEtEnregistrerAppel()) — sans ça, un jeton qui fuiterait
//   permettrait d'inonder indéfiniment l'écran de moisson (visible par
//   l'enseignant, jamais par les élèves, mais une vraie nuisance ciblée).
// ============================================================================

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const VEILLE_TOKEN = Deno.env.get("AFFUT_VEILLE_TOKEN");

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

const MOIS_FR = [
  "janvier", "février", "mars", "avril", "mai", "juin",
  "juillet", "août", "septembre", "octobre", "novembre", "décembre",
];

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

function estAutorise(req: Request): boolean {
  if (!VEILLE_TOKEN) return false; // pas de jeton configuré = fonction fermée
  return req.headers.get("x-veille-token") === VEILLE_TOKEN;
}

// Semaine de PUBLICATION (Lot 26), pas semaine de collecte : la moisson tourne
// le samedi (`0 6 * * 6` UTC) mais le numéro ne sort que le lundi suivant, et
// peut mélanger des entrées manuelles publiées hors semaine de veille — voir
// discussion du 04/09/2026. On ancre donc le calcul sur le prochain lundi
// (jamais sur « aujourd'hui »), qui devient aussi `date_publication`.
// -> { mois: "août 2026", semaine: "semaine 34 · 17 → 23 août 2026", datePublication: "2026-08-17" }
// Même calcul que formaterSemaineIso()/isoSemaineActuelle() dans apps/affut/index.html
// (Lot 6, Lot 26) — à garder synchronisé si cette logique évolue côté front.
function semaineIsoActuelle(): { mois: string; semaine: string; datePublication: string } {
  const auj = new Date();
  const jourAuj = auj.getUTCDay() || 7;
  const lundi = new Date(auj);
  if (jourAuj !== 1) lundi.setUTCDate(auj.getUTCDate() + (8 - jourAuj));

  const jeudi = new Date(lundi);
  jeudi.setUTCDate(lundi.getUTCDate() + 3); // jeudi de cette semaine ISO (fixe l'année ISO)
  const anneeIso = jeudi.getUTCFullYear();
  const jan1 = new Date(Date.UTC(anneeIso, 0, 1));
  const numSemaine = Math.ceil((((jeudi.getTime() - jan1.getTime()) / 86400000) + 1) / 7);

  const dimanche = new Date(lundi);
  dimanche.setUTCDate(lundi.getUTCDate() + 6);

  const moisLundi = MOIS_FR[lundi.getUTCMonth()], anneeLundi = lundi.getUTCFullYear();
  const moisDim = MOIS_FR[dimanche.getUTCMonth()], anneeDim = dimanche.getUTCFullYear();
  const plage = (moisLundi === moisDim && anneeLundi === anneeDim)
    ? `${lundi.getUTCDate()} → ${dimanche.getUTCDate()} ${moisDim} ${anneeDim}`
    : `${lundi.getUTCDate()} ${moisLundi}${anneeLundi !== anneeDim ? " " + anneeLundi : ""} → ${dimanche.getUTCDate()} ${moisDim} ${anneeDim}`;

  return {
    mois: `${moisLundi} ${anneeLundi}`,
    semaine: `semaine ${numSemaine} · ${plage}`,
    datePublication: lundi.toISOString().slice(0, 10),
  };
}

async function handleContext(): Promise<Response> {
  const { data: numeros, error: errNumeros } = await supabase
    .from("affut_numeros")
    .select("numero, statut, mois, semaine, moisson, candidates")
    .order("numero", { ascending: false });
  if (errNumeros) return json({ error: errNumeros.message }, 500);

  const brouillonAvecMoisson = (numeros ?? []).find(
    (n) => n.statut === "brouillon" && Array.isArray(n.moisson) && n.moisson.length > 0,
  );

  const cible = brouillonAvecMoisson
    ? {
      numero: brouillonAvecMoisson.numero,
      existe: true,
      moisson_actuelle: brouillonAvecMoisson.moisson,
    }
    : {
      numero: (numeros ?? []).reduce((m, n) => Math.max(m, n.numero), 0) + 1,
      existe: false,
      moisson_actuelle: [],
      ...semaineIsoActuelle(),
    };

  // Restreint aux entrées d'un numéro RÉELLEMENT publié (jointure sur
  // affut_numeros.statut) : un numéro encore en préparation ne doit pas
  // fuiter son contenu avant publication, même vers ce point d'accès à
  // faible privilège.
  const { data: entreesRecentesBrutes } = await supabase
    .from("affut_entrees")
    .select("id, titre, url, rubrique, source, cree_le, affut_numeros!inner(statut)")
    .eq("origine", "auto")
    .eq("valide", true)
    .eq("affut_numeros.statut", "publie")
    .order("cree_le", { ascending: false })
    .limit(15);
  const entreesRecentes = (entreesRecentesBrutes ?? []).map(
    ({ affut_numeros: _numero, ...reste }) => reste,
  );

  const { data: ecartesRecents } = await supabase
    .from("affut_candidats_ecartes")
    .select("candidat_id, titre, url, rubrique, source, motif, ecarte_le")
    .order("ecarte_le", { ascending: false })
    .limit(15);

  const { data: toutesEntrees } = await supabase.from("affut_entrees").select("url, rubrique");
  const urlsDejaUtilisees = Array.from(
    new Set((toutesEntrees ?? []).map((e) => e.url).filter(Boolean)),
  );

  // Rubriques connues (05/09/2026) : le champ `rubrique` n'est plus limité aux
  // 4 catégories de base côté écran de rédaction (liste déroulante qui se
  // complète elle-même, voir apps/affut/index.html `rubriquesConnues()`) —
  // même logique ici pour que l'agent de veille propose en priorité une
  // rubrique déjà en usage plutôt que d'en réinventer une proche à chaque
  // exécution. Les 4 de base restent toujours en tête même si aucune entrée
  // ne les utilise actuellement.
  const RUBRIQUES_CANONIQUES = ["Gestion", "Science & protocoles", "Données & référentiels", "En bonus"];
  const rubriquesUtilisees = new Set(
    (toutesEntrees ?? [])
      .map((e) => e.rubrique)
      .filter((r): r is string => Boolean(r && r.trim())),
  );
  const rubriquesExtra = Array.from(rubriquesUtilisees)
    .filter((r) => !RUBRIQUES_CANONIQUES.includes(r))
    .sort((a, b) => a.localeCompare(b, "fr"));
  const rubriquesConnues = [...RUBRIQUES_CANONIQUES, ...rubriquesExtra];

  // Sources suivies (écran « Sources », lot 4) : liste compilée à la main par
  // l'enseignant — voir brief-veille.md, section « Sources à moissonner en
  // priorité ». Contrairement à `entrees_retenues_recentes`/`candidats_ecartes_recents`
  // (de l'historique), cette liste est une consigne : chaque source doit être
  // effectivement visitée à chaque exécution, pas seulement lue comme contexte.
  const { data: sourcesSuivies } = await supabase
    .from("affut_sources_suivies")
    .select("id, nom, adresse, type, echelle, territoire, rubrique_defaut")
    .order("cree_le", { ascending: true })
    .limit(50);

  return json({
    cible,
    entrees_retenues_recentes: entreesRecentes,
    candidats_ecartes_recents: ecartesRecents ?? [],
    urls_deja_utilisees: urlsDejaUtilisees,
    sources_a_moissonner: sourcesSuivies ?? [],
    rubriques_connues: rubriquesConnues,
  });
}

// ---- limite de fréquence (durcissement 31/08/2026) -------------------------
// Un jeton AFFUT_VEILLE_TOKEN qui fuirait ne doit pas permettre un flot
// illimité d'appels : au-delà de MAX_APPELS_PAR_HEURE appels POST acceptés
// sur l'heure glissante, la fonction refuse (429). Journal minimal dans
// affut_veille_appels (voir 005-veille-rate-limit.sql).
const MAX_APPELS_PAR_HEURE = 10;

async function verifierEtEnregistrerAppel(): Promise<boolean> {
  const uneHeureAvant = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const { count, error } = await supabase
    .from("affut_veille_appels")
    .select("id", { count: "exact", head: true })
    .gte("horodatage", uneHeureAvant);
  if (error) return false; // en cas de doute, on refuse plutôt que d'ouvrir grand
  if ((count ?? 0) >= MAX_APPELS_PAR_HEURE) return false;
  await supabase.from("affut_veille_appels").insert({});
  return true;
}

// ---- plafonds de taille (durcissement 31/08/2026) --------------------------
const MAX_CANDIDATS_PAR_APPEL = 20;
const MAX_MOISSON_PAR_NUMERO = 100;
const MAX_LONGUEUR_COURTE = 200; // titre, source.nom/territoire/domaine, chaque élément de chiffres
const MAX_LONGUEUR_LONGUE = 2000; // resume, usage
const MAX_ELEMENTS_CHIFFRES = 20;

function erreurValidationCandidat(c: Candidat): string | null {
  if (typeof c.titre !== "string" || c.titre.length > MAX_LONGUEUR_COURTE) return "titre trop long";
  if (typeof c.url !== "string" || c.url.length > 2000) return "url trop longue";
  if (typeof c.resume !== "string" || c.resume.length > MAX_LONGUEUR_LONGUE) return "resume trop long";
  if (typeof c.usage !== "string" || c.usage.length > MAX_LONGUEUR_LONGUE) return "usage trop long";
  if (!Array.isArray(c.chiffres) || c.chiffres.length > MAX_ELEMENTS_CHIFFRES) return "chiffres invalides";
  if (c.chiffres.some((x) => typeof x !== "string" || x.length > MAX_LONGUEUR_COURTE)) return "élément de chiffres trop long";
  const s = c.source;
  if (!s || typeof s !== "object") return "source manquante";
  for (const champ of ["nom", "territoire", "domaine"] as const) {
    if (typeof s[champ] !== "string" || s[champ].length > MAX_LONGUEUR_COURTE) return `source.${champ} trop long`;
  }
  return null;
}

type Candidat = {
  id: string;
  rubrique: string;
  origine: string;
  source: { nom: string; territoire: string; domaine: string; date: string };
  url: string;
  lienMort: boolean;
  lienMortDepuis: string | null;
  titre: string;
  chiffres: string[];
  resume: string;
  usage: string;
};

async function handleIngest(req: Request): Promise<Response> {
  let body: { numero?: number; candidats?: Candidat[] };
  try {
    body = await req.json();
  } catch {
    return json({ error: "JSON invalide" }, 400);
  }

  const numeroCible = Number(body.numero);
  if (!Number.isFinite(numeroCible)) {
    return json({ error: "numero manquant ou invalide" }, 400);
  }

  const candidats = Array.isArray(body.candidats) ? body.candidats : [];
  if (!candidats.length) {
    return json({ error: "candidats vide" }, 400);
  }
  if (candidats.length > MAX_CANDIDATS_PAR_APPEL) {
    return json({ error: `trop de candidats en un seul appel (max ${MAX_CANDIDATS_PAR_APPEL})` }, 400);
  }
  for (const c of candidats) {
    if (!c || !c.id || !c.titre || !c.url || !c.rubrique) {
      return json({ error: "candidat invalide (id/titre/url/rubrique requis)", candidat: c }, 400);
    }
    const erreur = erreurValidationCandidat(c);
    if (erreur) return json({ error: erreur, candidat_id: c.id }, 400);
  }

  const autorise = await verifierEtEnregistrerAppel();
  if (!autorise) {
    return json({ error: "trop d'appels récents, réessayer plus tard" }, 429);
  }

  const { data: numeroExistant, error: errLecture } = await supabase
    .from("affut_numeros")
    .select("numero, moisson, candidates")
    .eq("numero", numeroCible)
    .maybeSingle();
  if (errLecture) return json({ error: errLecture.message }, 500);

  const { data: toutesEntrees } = await supabase.from("affut_entrees").select("url");
  const urlsExistantes = new Set((toutesEntrees ?? []).map((e) => e.url).filter(Boolean));

  const moissonActuelle: Candidat[] = numeroExistant?.moisson ?? [];
  const idsExistants = new Set(moissonActuelle.map((c) => c.id));

  const placeRestante = Math.max(0, MAX_MOISSON_PAR_NUMERO - moissonActuelle.length);
  const candidatsRetenus = candidats
    .filter((c) => !idsExistants.has(c.id) && !urlsExistantes.has(c.url))
    .slice(0, placeRestante);
  const nouveaux = candidatsRetenus;
  const ignores = candidats.length - nouveaux.length;
  const moissonFusionnee = [...moissonActuelle, ...nouveaux];
  const statutCollecte = moissonFusionnee.length > 0 ? "rapporte" : "rien";
  const dateCollecte = new Date().toISOString().slice(0, 10);

  if (numeroExistant) {
    const { error: errUpdate } = await supabase
      .from("affut_numeros")
      .update({
        moisson: moissonFusionnee,
        collecte: { date: dateCollecte, statut: statutCollecte },
        candidates: (numeroExistant.candidates ?? 0) + nouveaux.length,
      })
      .eq("numero", numeroCible);
    if (errUpdate) return json({ error: errUpdate.message }, 500);
  } else {
    const { mois, semaine, datePublication } = semaineIsoActuelle();
    const { error: errCreate } = await supabase.from("affut_numeros").insert({
      numero: numeroCible,
      statut: "brouillon",
      mois,
      semaine,
      date_publication: datePublication,
      titre: "",
      chapo: "",
      candidates: nouveaux.length,
      collecte: { date: dateCollecte, statut: statutCollecte },
      moisson: moissonFusionnee,
    });
    if (errCreate) return json({ error: errCreate.message }, 500);
  }

  if (nouveaux.length) {
    const lignesLog = nouveaux.map((c) => ({
      slug: c.id,
      numero_id: numeroCible,
      statut: "cree" as const,
      detail: c.titre,
    }));
    // Idempotence par slug (contrainte unique sur affut_ingestion_log.slug) :
    // un candidat déjà journalisé une semaine précédente (même id réutilisé
    // par erreur) ne casse pas l'ingestion des autres, ignoré silencieusement.
    await supabase.from("affut_ingestion_log").upsert(lignesLog, { onConflict: "slug", ignoreDuplicates: true });
  }

  return json({
    ok: true,
    numero: numeroCible,
    candidats_ajoutes: nouveaux.length,
    candidats_ignores_doublon: ignores,
  });
}

Deno.serve(async (req) => {
  if (!estAutorise(req)) return json({ error: "unauthorized" }, 401);
  if (req.method === "GET") return await handleContext();
  if (req.method === "POST") return await handleIngest(req);
  return json({ error: "method not allowed" }, 405);
});
