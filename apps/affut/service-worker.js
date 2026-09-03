/* À l'affût — service worker « coquille seule » (Lot 25, 03/09/2026).
   On ne met en cache QUE la coquille de l'app (HTML, manifest, icônes,
   polices, vendor/qrcode.js) — jamais les données. Toutes les requêtes
   Supabase (lecture/écriture des numéros, entrées, sources) sont
   cross-origin (uoeuzxstotqnembcpofx.supabase.co) : le test d'origine
   ci-dessous les laisse passer intactes, sans jamais les intercepter ni
   les mettre en cache — l'app reste une app en ligne, ce service worker
   ne fait que la rendre installable et lui donner une coquille rapide,
   pas un mode hors-ligne des numéros. Même pattern que
   apps/phytoscope/service-worker.js (modèle de référence, même
   contrainte Supabase). */

const CACHE_NAME = "affut-shell-v1";
const APP_SHELL = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./icons/icon.svg",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./fonts/ibm-plex-sans.woff2",
  "./fonts/ibm-plex-serif.woff2",
  "./fonts/ibm-plex-serif-bold.woff2",
  "./fonts/jetbrains-mono.woff2",
  "./vendor/qrcode.js"
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
    event.respondWith(fetch(req, { cache: "no-store" }).then(res => {
      const copy = res.clone();
      caches.open(CACHE_NAME).then(cache => cache.put("./index.html", copy));
      return res;
    }).catch(() => caches.match("./index.html")));
    return;
  }

  event.respondWith(caches.match(req).then(cached => cached || fetch(req).then(res => {
    const copy = res.clone();
    caches.open(CACHE_NAME).then(cache => cache.put(req, copy));
    return res;
  })));
});
