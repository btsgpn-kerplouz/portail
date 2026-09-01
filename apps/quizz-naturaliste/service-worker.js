/* Coup d'œil — service worker « coquille seule ».
   On ne met en cache QUE la coquille de l'app (HTML, données, polices, icône).
   Les photos iNaturalist sont des ressources distantes (cross-origin) : elles ne
   sont JAMAIS mises en cache — l'app a besoin du réseau pour afficher les images. */

const CACHE_NAME = 'coup-doeil-shell-v2';
const APP_SHELL = [
  './',
  './index.html',
  './quiz-data.js',
  './manifest.webmanifest',
  './icons/icon.svg',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './fonts/ibm-plex-sans.woff2',
  './fonts/ibm-plex-serif-bold.woff2',
  './fonts/jetbrains-mono.woff2'
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL)));
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.map(key => key !== CACHE_NAME ? caches.delete(key) : null)
    ))
  );
  self.clients.claim();
});

self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);

  // Tout ce qui n'est pas notre propre origine (= les photos iNaturalist) :
  // on laisse le navigateur faire, sans intercepter ni mettre en cache.
  if (url.origin !== self.location.origin) return;

  // Navigation : réseau d'abord, repli sur la coquille hors ligne.
  if (req.mode === 'navigate') {
    event.respondWith(fetch(req).catch(() => caches.match('./index.html')));
    return;
  }

  // Ressources de la coquille : cache d'abord.
  event.respondWith(
    caches.match(req).then(cached => cached || fetch(req).then(res => {
      const copy = res.clone();
      caches.open(CACHE_NAME).then(cache => cache.put(req, copy));
      return res;
    }))
  );
});
