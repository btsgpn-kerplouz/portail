// Connexion au projet Supabase "portail" (mutualisé avec de futures apps,
// tables préfixées oc_ — voir apps/organisation-cours/supabase/README.md).
//
// La clé "anon" est publique par nature (protégée par la RLS côté serveur,
// voir supabase/policies.sql) : ce n'est pas un secret, elle peut être
// committée (comme le fait déjà apps/phytoscope/index.html).
//
// Où trouver ces deux valeurs : dashboard Supabase → projet "portail" →
// Project Settings → API → « Project URL » et clé « anon public ».

const SUPABASE_URL = "https://uoeuzxstotqnembcpofx.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_eW4e-uYvC8aHbTwESRdGJw_ceyhagM1";

export function estConfigure() {
  return (
    !SUPABASE_URL.includes("VOTRE-PROJET") &&
    !SUPABASE_ANON_KEY.includes("VOTRE_CLE_ANON")
  );
}

function attendreLibSupabase() {
  return new Promise((resolve, reject) => {
    const debut = Date.now();
    (function tick() {
      if (window.supabase && window.supabase.createClient) return resolve();
      if (Date.now() - debut > 8000) {
        return reject(new Error("Bibliothèque Supabase non chargée (vérifier la connexion réseau)."));
      }
      setTimeout(tick, 50);
    })();
  });
}

let clientPromise = null;

export function getClient() {
  if (!clientPromise) {
    clientPromise = attendreLibSupabase().then(() =>
      window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
      })
    );
  }
  return clientPromise;
}
