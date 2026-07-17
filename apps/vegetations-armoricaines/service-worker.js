const CACHE_NAME = 'cbnb-vegetations-pwa-v1-13';
const APP_SHELL = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icons/favicon.svg',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/maskable-192.png',
  './icons/maskable-512.png',
  './icons/apple-touch-icon.png',
  './fonts/atkinson.woff2',
  './fonts/atkinson-bold.woff2',
  './fonts/atkinson-italic.woff2',
  './fonts/jetbrains-mono.woff2',
  './documents/couverture.webp',
  './documents/photo-aquatiques.webp',
  './documents/photo-herbacees.webp',
  './documents/photo-forets.webp',
  './documents/photo-fourres-nains.webp',
  './documents/photo-fourres-arbustifs.webp',
  './documents/logo-cbnb.webp',
  './documents/schema-fig3.webp',
  './documents/schema-tableau.webp'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.map(key => {
      if (key !== CACHE_NAME) return caches.delete(key);
    })))
  );
  self.clients.claim();
});

self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => caches.match('./index.html'))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
        return response;
      });
    })
  );
});