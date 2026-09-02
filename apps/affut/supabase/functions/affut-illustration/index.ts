// ============================================================================
// affut — Edge Function "affut-illustration" (Lot 14)
// ============================================================================
// Appelée depuis le navigateur du rédacteur (bouton « Récupérer
// l'illustration » du formulaire d'entrée, apps/affut/index.html) : reçoit
// l'URL d'une source, va chercher la page côté serveur (impossible depuis
// le navigateur — la plupart des sites ne renvoient pas d'en-têtes CORS
// pour un fetch cross-origin) et en extrait l'image « og:image » (le
// mécanisme standard utilisé pour les aperçus de lien sur les réseaux
// sociaux).
//
// YouTube est un cas à part, TRAITÉ SANS SCRAPING : constaté le 02/09/2026,
// l'IP du datacenter Supabase se fait systématiquement servir par YouTube
// une page anti-robot (« Connectez-vous pour confirmer que vous n'êtes pas
// un robot », playabilityStatus LOGIN_REQUIRED, aucune balise og:image) —
// un blocage sur la réputation de l'IP cloud, sans rapport avec le RGPD ou
// la région (une tentative de contournement par cookie de consentement
// n'a rien changé). Scraper la page n'est donc pas fiable pour YouTube.
// À la place : l'identifiant de vidéo est extrait directement de l'URL, et
// l'adresse de vignette statique `img.youtube.com/vi/<id>/...jpg` est
// utilisée telle quelle (mécanisme public, indépendant du rendu de la page,
// voir idVideoYoutube()/vignetteYoutube() plus bas).
//
// Ne renvoie qu'une ADRESSE d'image (jamais l'image elle-même) : le front
// l'enregistre telle quelle dans affut_entrees.image_url et l'affiche par
// lien direct (hotlink) — voir 007-illustration-entree.sql pour le choix
// assumé de ne pas copier l'image dans un espace de stockage Supabase.
//
// Aucun accès privilégié : pas de service_role. La fonction utilise la clé
// anon + le jeton de la session appelante (le même que le navigateur
// utilise déjà pour lire/écrire affut_entrees), et vérifie elle-même que
// l'appelant est un rédacteur actif — sans ce contrôle, n'importe quel
// compte authentifié du projet Supabase partagé (portail, utilisé aussi
// par organisation-cours) pourrait s'en servir comme relais pour faire
// requêter le serveur vers une adresse de son choix (SSRF). Déployée avec
// vérification JWT par défaut (pas de --no-verify-jwt, contrairement à
// affut-veille qui a son propre jeton) : un appelant sans session Supabase
// valide est déjà rejeté par la plateforme avant d'atteindre ce code.
//
// Durcissement volontairement simple (usage bas volume, déclenché à la
// main par un enseignant de confiance, pas une routine automatique) :
// schéma http(s) uniquement, hôtes locaux/privés refusés (protection SSRF
// de base, sans résolution DNS), délai et taille de réponse plafonnés.
// ============================================================================

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;

const DELAI_MAX_MS = 8000;
const OCTETS_MAX = 2_000_000; // 2 Mo de HTML lus au maximum

const CORS_HEADERS: Record<string, string> = {
  "access-control-allow-origin": "*",
  // x-client-info : ajouté automatiquement par le client supabase-js à
  // chaque appel (identification de la librairie) — sans lui dans cette
  // liste, le navigateur bloque la vraie requête après un préflight
  // pourtant réussi (constaté le 02/09/2026, voir AVANCEMENT.md, Lot 14).
  "access-control-allow-headers": "authorization, x-client-info, apikey, content-type",
  "access-control-allow-methods": "POST, OPTIONS",
};

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json", ...CORS_HEADERS },
  });
}

// Pas de résolution DNS ici (pas d'accès réseau bas niveau en Edge Function) :
// on se contente d'écarter les hôtes évidemment locaux/privés tels qu'écrits
// dans l'URL. Protection de base, pas absolue — cohérent avec un usage
// déclenché à la main par un enseignant de confiance, pas exposé au public.
function urlAutorisee(u: URL): boolean {
  if (u.protocol !== "http:" && u.protocol !== "https:") return false;
  const h = u.hostname.toLowerCase();
  if (h === "localhost" || h.endsWith(".local") || h === "0.0.0.0") return false;
  if (h === "127.0.0.1" || h === "::1") return false;
  if (/^10\./.test(h) || /^192\.168\./.test(h) || /^169\.254\./.test(h)) return false;
  if (/^172\.(1[6-9]|2\d|3[01])\./.test(h)) return false;
  return true;
}

function extraireOgImage(html: string, base: URL): string | null {
  const motifs = [
    /<meta[^>]+property=["']og:image(?::secure_url)?["'][^>]+content=["']([^"']+)["']/i,
    /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image(?::secure_url)?["']/i,
    /<meta[^>]+name=["']twitter:image(?::src)?["'][^>]+content=["']([^"']+)["']/i,
    /<meta[^>]+content=["']([^"']+)["'][^>]+name=["']twitter:image(?::src)?["']/i,
  ];
  for (const motif of motifs) {
    const m = html.match(motif);
    if (m) {
      try { return new URL(m[1], base).toString(); } catch { /* URL relative invalide, motif suivant */ }
    }
  }
  return null;
}

// Identifiant de vidéo à partir des formats d'URL YouTube usuels ; null si
// l'URL n'est pas reconnue comme une page vidéo (ex. chaîne, playlist seule).
function idVideoYoutube(u: URL): string | null {
  const h = u.hostname.toLowerCase().replace(/^(www|m|music)\./, "");
  let id: string | null = null;
  if (h === "youtu.be") {
    id = u.pathname.split("/").filter(Boolean)[0] || null;
  } else if (h === "youtube.com" || h === "youtube-nocookie.com") {
    if (u.pathname === "/watch") id = u.searchParams.get("v");
    else {
      const m = u.pathname.match(/^\/(?:shorts|embed|live|v)\/([^/]+)/);
      if (m) id = m[1];
    }
  }
  return id && /^[A-Za-z0-9_-]{6,20}$/.test(id) ? id : null;
}

// Adresse de vignette statique YouTube, sans jamais charger la page vidéo
// (voir la note en tête de fichier). maxresdefault n'existe que pour les
// vidéos importées en haute définition — repli sur hqdefault, toujours
// généré par YouTube pour toute vidéo publique valide ; l'un ou l'autre
// renvoie une 404 propre (pas de faux placeholder) si l'identifiant est
// invalide ou la vidéo indisponible.
async function vignetteYoutube(id: string): Promise<string | null> {
  for (const taille of ["maxresdefault", "hqdefault"]) {
    const url = "https://img.youtube.com/vi/" + id + "/" + taille + ".jpg";
    try {
      const res = await fetch(url, { method: "HEAD", signal: AbortSignal.timeout(DELAI_MAX_MS) });
      if (res.ok) return url;
    } catch { /* délai dépassé ou réseau indisponible, on tente la taille suivante */ }
  }
  return null;
}

async function recupererHtml(u: URL): Promise<string> {
  const ctrl = new AbortController();
  const minuteur = setTimeout(() => ctrl.abort(), DELAI_MAX_MS);
  let res: Response;
  try {
    res = await fetch(u.toString(), {
      signal: ctrl.signal,
      redirect: "follow",
      headers: { "user-agent": "Mozilla/5.0 (compatible; AffutIllustrationBot/1.0)" },
    });
  } finally {
    clearTimeout(minuteur);
  }
  if (!res.ok) throw new Error("Page inaccessible (HTTP " + res.status + ")");

  const reader = res.body?.getReader();
  if (!reader) return await res.text();
  const decoder = new TextDecoder();
  let html = "";
  let octets = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    octets += value.length;
    html += decoder.decode(value, { stream: true });
    if (octets > OCTETS_MAX) { await reader.cancel(); break; }
  }
  return html;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: CORS_HEADERS });
  if (req.method !== "POST") return json({ error: "Méthode non supportée" }, 405);

  const authHeader = req.headers.get("authorization");
  if (!authHeader) return json({ error: "Non authentifié" }, 401);

  // Vérification de l'identité DIRECTEMENT via la RLS de affut_redacteurs
  // (auth.uid() = user_id, policy affut_redacteurs_select_self — voir
  // 002-policies.sql), plutôt que par un appel séparé à
  // supabase.auth.getUser(). Ce dernier échouait de façon incompréhensible
  // (réponse non-JSON du service d'authentification, cause non identifiée
  // avec certitude — possiblement liée au nouveau format de clé du projet,
  // sb_publishable_...) alors que le reste de l'appli prouve déjà, depuis
  // les Lots 6/7, que ce même en-tête authorization fonctionne parfaitement
  // pour les appels PostgREST classiques (.from()). Pas de filtre .eq()
  // nécessaire : la RLS ne laisse de toute façon voir que sa PROPRE ligne,
  // un jeton invalide ou anonyme est déjà rejeté avant d'arriver ici (soit
  // 401 par le gateway PostgREST, soit aucune ligne visible pour anon).
  const supabase = createClient(SUPABASE_URL, ANON_KEY, {
    global: { headers: { authorization: authHeader } },
  });
  const { data: redacteur, error: redacErr } = await supabase
    .from("affut_redacteurs")
    .select("actif")
    .maybeSingle();
  if (redacErr) return json({ error: "Non authentifié", diag: redacErr.message }, 401);
  if (!redacteur || !redacteur.actif) return json({ error: "Réservé aux rédacteurs actifs" }, 403);

  let body: unknown;
  try { body = await req.json(); } catch { return json({ error: "JSON invalide" }, 400); }
  const pageUrlTexte = typeof (body as { url?: unknown })?.url === "string" ? (body as { url: string }).url.trim() : "";
  if (!pageUrlTexte) return json({ error: "url manquante" }, 400);

  let pageUrl: URL;
  try { pageUrl = new URL(pageUrlTexte); } catch { return json({ error: "URL invalide" }, 400); }
  if (!urlAutorisee(pageUrl)) return json({ error: "URL non autorisée" }, 400);

  const videoId = idVideoYoutube(pageUrl);
  if (videoId) {
    try {
      return json({ image_url: await vignetteYoutube(videoId) });
    } catch (e) {
      return json({ error: e instanceof Error ? e.message : "Échec de la récupération" }, 502);
    }
  }

  try {
    const html = await recupererHtml(pageUrl);
    return json({ image_url: extraireOgImage(html, pageUrl) });
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : "Échec de la récupération" }, 502);
  }
});
