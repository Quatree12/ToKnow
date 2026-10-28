/* ================================================================
   Service Worker — ToKnow
   Strategie « reseau d'abord » pour la page : toute mise a jour est
   visible immediatement, et le cache ne sert qu'en cas de coupure.
   (L'ancienne version servait le cache d'abord et masquait les
   corrections — c'etait la cause des allers-retours.)
   ================================================================ */

const CACHE = 'toknow-v2';

const SHELL = [
  './',
  './index.html',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-512.png',
  './icons/apple-touch-icon.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE)
      .then((cache) => cache.addAll(SHELL).catch(() => {}))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;

  if (req.method !== 'GET') return;
  if (!req.url.startsWith('http')) return;

  const url = new URL(req.url);

  // 1. API meteo : jamais mise en cache
  if (url.hostname.endsWith('open-meteo.com')) return;

  // 2. ressources externes (polices) : reseau, repli cache
  if (url.origin !== self.location.origin) {
    event.respondWith(fetch(req).catch(() => caches.match(req)));
    return;
  }

  // 3. app locale : RESEAU D'ABORD — le cache ne sert que hors-ligne
  event.respondWith(
    fetch(req)
      .then((res) => {
        if (res && res.status === 200 && res.type === 'basic') {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
        }
        return res;
      })
      .catch(() => caches.match(req).then((hit) => hit || caches.match('./index.html')))
  );
});
