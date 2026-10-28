/* ================================================================
   Service Worker — ToKnow
   - met en cache l'app (index.html, manifest, icônes) pour un
     lancement hors-ligne
   - l'appel a l'API meteo est TOUJOURS fait au reseau (jamais mis
     en cache) : une prevision perimee serait pire que rien
   - toute requete dont l'URL est versionnee (?v=...) est ignoree
   ================================================================ */

const CACHE = 'toknow-v1';

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

  // uniquement les GET http(s)
  if (req.method !== 'GET') return;
  if (!req.url.startsWith('http')) return;

  const url = new URL(req.url);

  // 1. API meteo : reseau d'abord, et on ne met rien en cache
  if (url.hostname.endsWith('open-meteo.com')) {
    return;                       // laisse le navigateur gerer normalement
  }

  // 2. ressources externes (Google Fonts) : reseau, repli cache
  if (url.origin !== self.location.origin) {
    event.respondWith(
      fetch(req).catch(() => caches.match(req))
    );
    return;
  }

  // 3. app locale : cache d'abord, reseau en repli
  event.respondWith(
    caches.match(req).then((hit) => {
      if (hit) return hit;
      return fetch(req).then((res) => {
        // on ne met en cache que les reponses completes et exploitables
        if (res && res.status === 200 && res.type === 'basic') {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
        }
        return res;
      }).catch(() => caches.match('./index.html'));
    })
  );
});

/* ---------- enregistrement cote page ----------
   Ajoutez ceci dans index.html, juste avant </body> :

   <script>
     if ("serviceWorker" in navigator) {
       window.addEventListener("load", function () {
         navigator.serviceWorker.register("./sw.js").catch(function () {});
       });
     }
   </script>
   ---------------------------------------------- */
