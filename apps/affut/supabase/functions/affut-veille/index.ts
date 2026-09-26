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

// ---- Anti-doublons (26/09/2026) ---------------------------------------------
// Un candidat déjà vu — retenu dans un numéro, écarté un jour, ou déjà en
// attente dans une moisson — ne doit JAMAIS revenir, quel que soit l'ancien
// numéro et le temps écoulé. Avant cette date, seules les entrées retenues
// étaient comparées, et par égalité stricte d'adresse : un article écarté en
// septembre pouvait revenir en novembre, et une simple variante d'adresse
// (`?utm_source=…`, `www.`, `/` final, `http` au lieu de `https`) passait
// pour un article nouveau.
//
// Trois clés de comparaison, dans cet ordre : identifiant du candidat,
// adresse normalisée, titre normalisé (même article repris à une autre
// adresse, ex. site d'origine + relais). Le titre n'est comparé qu'au-delà de
// TITRE_MIN_CARACTERES : un titre très court et générique (« Actualités »)
// ferait rejeter à tort des articles sans rapport.
//
// Bloc volontairement PUR (aucun accès base ni API Deno) et balisé
// <dedoublonnage> : le test local (apps/affut/supabase/tests/) extrait ce
// bloc tel quel pour le vérifier — ne pas y ajouter d'import ni d'appel réseau.
// <dedoublonnage>
const TITRE_MIN_CARACTERES = 20;
const PARAMETRES_DE_PISTAGE = /^(utm_|mtm_|pk_|at_|_hs|xtor$|fbclid$|gclid$|dclid$|msclkid$|mc_cid$|mc_eid$|igshid$|spm$|ocid$|cmpid$)/i;

type RaisonDoublon = "deja_retenu" | "deja_ecarte" | "deja_en_moisson" | "doublon_dans_le_lot";

function normaliserUrl(brute: string): string {
  const texte = String(brute ?? "").trim();
  try {
    const u = new URL(texte);
    const hote = u.hostname.toLowerCase().replace(/^www\./, "");
    const chemin = u.pathname.replace(/\/index\.(html?|php)$/i, "").replace(/\/+$/, "");
    const params = [...u.searchParams.entries()]
      .filter(([cle]) => !PARAMETRES_DE_PISTAGE.test(cle))
      .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
      .map(([cle, valeur]) => `${cle}=${valeur}`)
      .join("&");
    return hote + chemin + (params ? "?" + params : "");
  } catch {
    return texte.toLowerCase();
  }
}

function normaliserTitre(brut: string): string {
  return String(brut ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

type VuDeja = { id?: string; url?: string; titre?: string; raison: RaisonDoublon };

function classerDoublons<T extends { id: string; url: string; titre: string }>(
  candidats: T[],
  dejaVus: VuDeja[],
): { gardes: T[]; ignores: { id: string; titre: string; raison: RaisonDoublon }[] } {
  const parId = new Map<string, RaisonDoublon>();
  const parUrl = new Map<string, RaisonDoublon>();
  const parTitre = new Map<string, RaisonDoublon>();
  const memoriser = (v: VuDeja) => {
    if (v.id && !parId.has(v.id)) parId.set(v.id, v.raison);
    const u = v.url ? normaliserUrl(v.url) : "";
    if (u && !parUrl.has(u)) parUrl.set(u, v.raison);
    const t = v.titre ? normaliserTitre(v.titre) : "";
    if (t.length >= TITRE_MIN_CARACTERES && !parTitre.has(t)) parTitre.set(t, v.raison);
  };
  dejaVus.forEach(memoriser);

  const gardes: T[] = [];
  const ignores: { id: string; titre: string; raison: RaisonDoublon }[] = [];
  for (const c of candidats) {
    const t = normaliserTitre(c.titre);
    const raison = parId.get(c.id) ?? parUrl.get(normaliserUrl(c.url)) ??
      (t.length >= TITRE_MIN_CARACTERES ? parTitre.get(t) : undefined);
    if (raison) {
      ignores.push({ id: c.id, titre: c.titre, raison });
    } else {
      gardes.push(c);
      // Deux candidats identiques dans un même envoi : seul le premier passe.
      memoriser({ id: c.id, url: c.url, titre: c.titre, raison: "doublon_dans_le_lot" });
    }
  }
  return { gardes, ignores };
}
// </dedoublonnage>

// ---- Mémoire de la veille, étape 2 : formats et motifs (26/09/2026) ---------
// La veille doit apprendre des FORMATS d'actualité qu'on retient ou écarte
// (rapport avec données, brève sans fond…), jamais des sources : une très
// bonne source publie aussi des contenus trop courts, et l'inverse. Aucun
// compteur par source n'est donc calculé ni exposé ici, volontairement.
//
// Vocabulaire FERMÉ, répété dans 017-format-et-motif-ecart.sql, index.html
// (FORMATS / MOTIFS_ECART) et documents/brief-veille.md — à garder synchronisé.
// Bloc pur, balisé <memoire> : extrait tel quel par le test local.
// <memoire>
const FORMATS_AUTORISES: { code: string; description: string }[] = [
  { code: "rapport_etude", description: "Rapport, bilan ou étude complète, avec données ou résultats détaillés" },
  { code: "article_fond", description: "Article de fond : dossier, enquête, reportage documenté, analyse développée" },
  { code: "publication_scientifique", description: "Article ou note d'une revue scientifique ou naturaliste" },
  { code: "breve", description: "Brève ou communiqué court : quelques lignes, peu ou pas de développement, souvent un simple résumé renvoyant ailleurs" },
  { code: "texte_officiel", description: "Texte officiel : arrêté, décret, avis, réglementation, plan" },
  { code: "agenda", description: "Agenda : sortie, conférence, colloque, appel à contributions" },
  { code: "tribune", description: "Tribune, opinion, prise de position" },
  { code: "donnees_outil", description: "Jeu de données, référentiel, outil, carte interactive" },
  { code: "multimedia", description: "Vidéo ou podcast" },
  { code: "autre", description: "Autre — à éviter, seulement si aucun format ne convient" },
];
const CODES_FORMATS = FORMATS_AUTORISES.map((f) => f.code);

// Comptes par format (retenues / écartées) et par motif d'écart. Entrées :
// les entrées retenues d'origine « auto » et les candidats écartés. Sans
// format renseigné (historique d'avant l'étape 2) : rangé sous « non_classe ».
function compterParFormat(
  entrees: { format?: string | null }[],
  ecartes: { format?: string | null; motif_code?: string | null }[],
): {
  par_format: { format: string; retenues: number; ecartees: number }[];
  motifs_ecart: { motif: string; nombre: number }[];
} {
  const formats = new Map<string, { retenues: number; ecartees: number }>();
  const ligne = (f?: string | null) => {
    const cle = f && CODES_FORMATS.includes(f) ? f : "non_classe";
    if (!formats.has(cle)) formats.set(cle, { retenues: 0, ecartees: 0 });
    return formats.get(cle)!;
  };
  for (const e of entrees) ligne(e.format).retenues++;
  for (const e of ecartes) ligne(e.format).ecartees++;
  const motifs = new Map<string, number>();
  for (const e of ecartes) if (e.motif_code) motifs.set(e.motif_code, (motifs.get(e.motif_code) ?? 0) + 1);
  return {
    par_format: [...formats.entries()]
      .map(([format, c]) => ({ format, ...c }))
      .sort((a, b) => b.retenues + b.ecartees - (a.retenues + a.ecartees)),
    motifs_ecart: [...motifs.entries()].map(([motif, nombre]) => ({ motif, nombre })).sort((a, b) => b.nombre - a.nombre),
  };
}
// </memoire>

// Tout ce que la veille a déjà vu, depuis toujours : entrées retenues (tous
// numéros, publiés ou non), candidats écartés, candidats encore en attente
// dans la moisson d'un numéro. Lecture paginée : PostgREST plafonne une
// requête à 1000 lignes, et l'historique n'a plus de raison de rester sous
// ce seuil. Une lecture qui échoue fait échouer l'appel (500) plutôt que de
// laisser passer des doublons en silence — la routine peut réessayer.
async function lireTout<T>(table: string, colonnes: string, ordre: string): Promise<T[]> {
  const PAGE = 1000;
  const lignes: T[] = [];
  for (let debut = 0; ; debut += PAGE) {
    const { data, error } = await supabase.from(table).select(colonnes).order(ordre).range(debut, debut + PAGE - 1);
    if (error) throw new Error(`lecture ${table} : ${error.message}`);
    lignes.push(...((data ?? []) as T[]));
    if (!data || data.length < PAGE) break;
  }
  return lignes;
}

type VuDejaDate = VuDeja & { quand: string };

async function chargerDejaVus(): Promise<VuDejaDate[]> {
  const [entrees, ecartes, numeros] = await Promise.all([
    lireTout<{ id: string; url: string | null; titre: string | null; cree_le: string | null }>(
      "affut_entrees", "id, url, titre, cree_le", "id"),
    lireTout<{ candidat_id: string; url: string | null; titre: string | null; ecarte_le: string | null }>(
      "affut_candidats_ecartes", "candidat_id, url, titre, ecarte_le", "id"),
    lireTout<{ numero: number; moisson: Candidat[] | null }>("affut_numeros", "numero, moisson", "numero"),
  ]);
  const vus: VuDejaDate[] = [];
  for (const e of entrees) {
    vus.push({ id: e.id, url: e.url ?? "", titre: e.titre ?? "", raison: "deja_retenu", quand: e.cree_le ?? "" });
  }
  for (const e of ecartes) {
    vus.push({ id: e.candidat_id, url: e.url ?? "", titre: e.titre ?? "", raison: "deja_ecarte", quand: e.ecarte_le ?? "" });
  }
  for (const n of numeros) {
    for (const c of n.moisson ?? []) {
      // Encore en attente de tri : compté comme le plus récent ("9999" trie avant toute date ISO en ordre décroissant).
      vus.push({ id: c.id, url: c.url, titre: c.titre, raison: "deja_en_moisson", quand: "9999" });
    }
  }
  return vus;
}

async function handleContext(): Promise<Response> {
  const { data: numeros, error: errNumeros } = await supabase
    .from("affut_numeros")
    .select("numero, statut, mois, semaine, moisson, candidates")
    .order("numero", { ascending: false });
  if (errNumeros) return json({ error: errNumeros.message }, 500);

  // Le brouillon « en cours » est le numéro pas encore publié, qu'il ait ou
  // non des candidats en attente de tri dans sa moisson : un brouillon dont
  // la moisson a déjà été entièrement triée (candidats validés en entrées,
  // ou écartés) reste le numéro à alimenter — il ne faut PAS en fabriquer un
  // suivant tant que celui-ci n'est pas publié (bug constaté le 12/09/2026 :
  // la routine avait créé un n°4 alors que le n°3, brouillon avec moisson
  // vide car déjà triée, était toujours en préparation).
  const brouillons = (numeros ?? []).filter((n) => n.statut === "brouillon");
  const brouillonActuel = brouillons.length
    ? brouillons.reduce((plusAncien, n) => (n.numero < plusAncien.numero ? n : plusAncien))
    : null;

  const cible = brouillonActuel
    ? {
      numero: brouillonActuel.numero,
      existe: true,
      moisson_actuelle: brouillonActuel.moisson ?? [],
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

  // `format` et `motif_code` : migration 017. Tant qu'elle n'est pas appliquée,
  // la lecture échoue — on retombe alors sur les colonnes d'avant plutôt que
  // de casser tout le contexte de la routine.
  let ecartesRecents: Record<string, unknown>[] | null = null;
  {
    const complet = await supabase
      .from("affut_candidats_ecartes")
      .select("candidat_id, titre, url, rubrique, source, motif, motif_code, format, ecarte_le")
      .order("ecarte_le", { ascending: false })
      .limit(15);
    if (!complet.error) {
      ecartesRecents = complet.data;
    } else {
      const ancien = await supabase
        .from("affut_candidats_ecartes")
        .select("candidat_id, titre, url, rubrique, source, motif, ecarte_le")
        .order("ecarte_le", { ascending: false })
        .limit(15);
      ecartesRecents = ancien.data;
    }
  }

  // Ce que l'enseignant retient / écarte, PAR FORMAT (jamais par source).
  // Absent (null) si la migration 017 n'est pas encore appliquée.
  let bilanFormats: ReturnType<typeof compterParFormat> | null = null;
  try {
    const [entreesFormat, ecartesFormat] = await Promise.all([
      lireTout<{ format: string | null; origine: string | null; valide: boolean | null }>(
        "affut_entrees", "format, origine, valide", "id"),
      lireTout<{ format: string | null; motif_code: string | null }>(
        "affut_candidats_ecartes", "format, motif_code", "id"),
    ]);
    bilanFormats = compterParFormat(
      entreesFormat.filter((e) => e.origine === "auto" && e.valide === true),
      ecartesFormat,
    );
  } catch (_e) {
    bilanFormats = null;
  }

  // Ce que la veille a déjà vu, depuis toujours (26/09/2026) : plus seulement
  // les entrées retenues, mais aussi tout ce qui a été écarté un jour et ce qui
  // attend encore dans une moisson. Le serveur refuse de toute façon ces
  // candidats à l'envoi (POST) ; les donner ici évite à l'agent de perdre du
  // temps à les rédiger.
  let dejaVus: VuDejaDate[];
  try {
    dejaVus = await chargerDejaVus();
  } catch (e) {
    return json({ error: (e as Error).message }, 500);
  }
  const urlsDejaUtilisees = Array.from(new Set(dejaVus.map((v) => v.url).filter(Boolean) as string[]));
  // Titres : les 300 plus récents seulement (la liste grossit d'environ 20 à
  // 40 par semaine) ; les adresses, elles, sont toutes renvoyées.
  const titresDejaVus = [...dejaVus]
    .filter((v) => v.titre)
    .sort((a, b) => (a.quand < b.quand ? 1 : a.quand > b.quand ? -1 : 0))
    .slice(0, 300)
    .map((v) => v.titre as string);

  const { data: toutesEntrees } = await supabase.from("affut_entrees").select("rubrique");

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

  // Sources suivies (écran « Sources », lot 4 ; périodicité ajoutée le
  // 12/09/2026) : liste compilée à la main par l'enseignant — voir
  // brief-veille.md, section « Sources à moissonner en priorité ». Seule
  // liste d'adresses à visiter (fusion avec l'ancien catalogue statique de
  // revues du brief, qui faisait doublon et prêtait à confusion — voir
  // AVANCEMENT.md). Contrairement à `entrees_retenues_recentes`/
  // `candidats_ecartes_recents` (de l'historique), cette liste est une
  // consigne : chaque source renvoyée doit être effectivement visitée à
  // cette exécution, pas seulement lue comme contexte.
  //
  // `periodicite` distingue trois cadences, éditables par source depuis
  // l'écran Sources, plutôt que des listes séparées :
  // - 'hebdomadaire' (défaut) : renvoyée à chaque exécution ;
  // - 'tiers-mensuelle' (revues/bulletins peu fréquents, ~137 lignes à
  //   l'origine) : renvoyée par **rotation d'un tiers par semaine** plutôt
  //   qu'en bloc une fois par mois (choix du 12/09/2026 : visiter 151
  //   adresses en une seule exécution coûtait trop cher en temps/crédits par
  //   rapport à un rythme régulier). Chaque source est assignée à l'un de 3
  //   groupes par un hash déterministe de son `id` (`groupeRotation()`) —
  //   pas stocké en base, recalculé à chaque appel. Le groupe actif tourne
  //   avec le numéro de semaine ISO (`groupeSemaine = numeroSemaineIso() %
  //   3`), donc chaque source est visitée une semaine sur trois ;
  // - 'mensuelle' (introduite le 18/09/2026, pour une source qu'on veut
  //   vraiment au rythme du mois plutôt qu'en rotation) : renvoyée en bloc
  //   complet le premier samedi du mois (`estPremierSamediDuMois()`), le
  //   reste du temps absente de la moisson.
  // limit(200) plutôt que 50 : la fusion avec le catalogue de revues (voir
  // 013-sources-suivies-periodicite.sql) porte le total à ~150 lignes
  // (silencieusement tronqué au-delà, comme avant — mais avec de la marge).
  const numeroSemaineIso = (d: Date): number => {
    const jour = d.getUTCDay() || 7;
    const jeudi = new Date(d);
    jeudi.setUTCDate(d.getUTCDate() + 4 - jour);
    const anneeIso = jeudi.getUTCFullYear();
    const jan1 = new Date(Date.UTC(anneeIso, 0, 1));
    return Math.ceil((((jeudi.getTime() - jan1.getTime()) / 86400000) + 1) / 7);
  };
  const groupeRotation = (id: string): number => {
    let h = 0;
    for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
    return h % 3;
  };
  const groupeSemaine = numeroSemaineIso(new Date()) % 3;
  const estPremierSamediDuMois = (d: Date): boolean => d.getUTCDate() <= 7;
  const aujourdhui = new Date();
  const { data: sourcesSuiviesBrutes } = await supabase
    .from("affut_sources_suivies")
    .select("id, nom, adresse, type, echelle, territoire, rubrique_defaut, periodicite")
    .order("cree_le", { ascending: true })
    .limit(200);
  const sourcesAMoissonner = (sourcesSuiviesBrutes ?? [])
    .filter((s) => {
      if (s.periodicite === "tiers-mensuelle") return groupeRotation(s.id) === groupeSemaine;
      if (s.periodicite === "mensuelle") return estPremierSamediDuMois(aujourdhui);
      return true;
    })
    .map(({ periodicite: _periodicite, ...reste }) => reste);

  return json({
    cible,
    entrees_retenues_recentes: entreesRecentes,
    candidats_ecartes_recents: ecartesRecents ?? [],
    formats_autorises: FORMATS_AUTORISES,
    bilan_par_format: bilanFormats?.par_format ?? null,
    motifs_ecart_frequents: bilanFormats?.motifs_ecart ?? null,
    urls_deja_utilisees: urlsDejaUtilisees,
    titres_deja_vus: titresDejaVus,
    sources_a_moissonner: sourcesAMoissonner,
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
  format?: string;
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

  // Format : facultatif, vocabulaire fermé. Une valeur inconnue est retirée
  // (candidat gardé, non classé) et signalée en retour plutôt que de rejeter
  // tout l'envoi pour ça.
  const avertissements: string[] = [];
  for (const c of candidats) {
    if (c.format !== undefined && c.format !== null && !CODES_FORMATS.includes(c.format)) {
      avertissements.push(`format inconnu « ${String(c.format).slice(0, 40)} » pour ${c.id} : ignoré (voir formats_autorises dans le GET)`);
      delete c.format;
    }
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

  const moissonActuelle: Candidat[] = numeroExistant?.moisson ?? [];

  let dejaVus: VuDejaDate[];
  try {
    dejaVus = await chargerDejaVus();
  } catch (e) {
    return json({ error: (e as Error).message }, 500);
  }
  const { gardes, ignores: ignoresDetail } = classerDoublons(candidats, dejaVus);

  const placeRestante = Math.max(0, MAX_MOISSON_PAR_NUMERO - moissonActuelle.length);
  const nouveaux = gardes.slice(0, placeRestante);
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
    candidats_ignores_doublon: ignoresDetail.length,
    // Détail : pourquoi chaque candidat a été refusé (deja_retenu, deja_ecarte,
    // deja_en_moisson, doublon_dans_le_lot) — à lire avant de conclure qu'une
    // source « n'a rien donné ».
    doublons: ignoresDetail,
    candidats_ignores_faute_de_place: gardes.length - nouveaux.length,
    avertissements,
  });
}

Deno.serve(async (req) => {
  if (!estAutorise(req)) return json({ error: "unauthorized" }, 401);
  if (req.method === "GET") return await handleContext();
  if (req.method === "POST") return await handleIngest(req);
  return json({ error: "method not allowed" }, 405);
});
