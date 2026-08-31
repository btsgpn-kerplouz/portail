/* Service worker de Zonation.
   Deux rôles : rendre l'application installable (Chrome n'émet
   « beforeinstallprompt » que si un service worker gère les requêtes) et la
   rendre utilisable sans réseau — ce qui est le cas d'usage réel, la Petite Mer
   de Gâvres n'ayant pas partout de couverture mobile.

   Même stratégie que PhytoScope : réseau d'abord pour la page (afin de recevoir
   les mises à jour), cache d'abord pour les ressources, qui ne changent qu'avec
   une nouvelle version du cache. */
const CACHE_NAME = "zonation-pwa-v1-0-0";

const VIGNETTES_BB = ["i", "r", "+", "1", "2", "3", "4", "5"];
const DISPOSITIONS = ["agregee", "eclatee", "mixte"];
/* Pourcentage figurant dans le nom de fichier, par coefficient. */
const PCT_VIGNETTE = {
  "i": "0p05pct", "r": "0p1pct", "+": "0p5pct", "1": "2p5pct",
  "2": "15pct", "3": "37p5pct", "4": "62p5pct", "5": "87p5pct"
};

const APP_SHELL = [
  "./",
  "./index.html",
  "./data.js",
  "./manifest.webmanifest",
  "./icons/icon.svg",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/apple-touch-icon.png",
  "./fonts/ibm-plex-sans.woff2",
  "./fonts/ibm-plex-serif.woff2",
  "./fonts/ibm-plex-serif-bold.woff2",
  "./fonts/jetbrains-mono.woff2",
  "./documents/couverture.jpg",
  ...VIGNETTES_BB.flatMap(c => DISPOSITIONS.map(
    d => "./documents/bb-taches/BB_" + c + "_" + d + "_" + PCT_VIGNETTE[c] + ".png"))
];

self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE_NAME)
    .then(cache => cache.addAll(APP_SHELL))
    .then(() => self.skipWaiting()));
});

self.addEventListener("activate", event => {
  event.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
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
  event.respondWith(caches.match(req).then(cached => cached || fetch(req).then(res => {
    const copy = res.clone();
    caches.open(CACHE_NAME).then(cache => cache.put(req, copy));
    return res;
  })));
});
