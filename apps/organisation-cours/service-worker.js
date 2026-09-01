const CACHE_NAME = "organisation-cours-pwa-v1-2-0";
const APP_SHELL = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./styles.css",
  "./app.js",
  "./reference-capacities.js",
  "./reference-modules.js",
  "./ruban-pedagogique.js",
  "./js/supabase-client.js",
  "./js/sync.js",
  "./js/enseignants-widget.js",
  "./js/auth.js",
  "./icons/icon.svg",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./fonts/ibm-plex-sans.woff2",
  "./fonts/atkinson.woff2",
  "./fonts/atkinson-bold.woff2",
  "./fonts/atkinson-italic.woff2",
  "./fonts/jetbrains-mono.woff2",
  "./img/logo-kerplouz.png"
];

self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});

self.addEventListener("fetch", event => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  if (req.mode === "navigate") {
    event.respondWith(fetch(req, {cache:"no-store"}).then(res => {
      const copy = res.clone();
      caches.open(CACHE_NAME).then(cache => cache.put("./index.html", copy));
      return res;
    }).catch(() => caches.match("./index.html")));
    return;
  }
  // Réseau d'abord (pas cache d'abord) pour app.js/styles.css/js/* : sans ça,
  // une install desktop (PWA) reste bloquée sur le code mis en cache au jour
  // de l'install tant que service-worker.js lui-même n'a pas changé (seul
  // déclencheur qui force le navigateur à réinstaller le SW et à rafraîchir
  // le cache) — un push-merge qui ne touche que app.js/js/*.js/styles.css
  // passait donc inaperçu indéfiniment. Le cache ne sert plus que de repli
  // hors-ligne.
  event.respondWith(fetch(req).then(res => {
    const copy = res.clone();
    caches.open(CACHE_NAME).then(cache => cache.put(req, copy));
    return res;
  }).catch(() => caches.match(req)));
});
