// Service Worker: офлайн-режим игры «Лавка на перекрёстке миров».
// Стратегия: cache-first для всего своего origin (игра — чистая статика),
// в фоне подтягиваем свежее. При новой версии бандла (деплой) кэш
// пересоздаётся по изменившемуся имени.
const CACHE = 'cozy-adventures-v1';

// Ядро: то, без чего игра не откроется офлайн.
const CORE = [
  '.',
  'index.html',
  'styles.css',
  'bundle.js',
  'manifest.webmanifest',
  'assets/fav2_mug.svg',
  'assets/icon-192.png',
  'assets/icon-512.png',
];

self.addEventListener('install', (ev) => {
  ev.waitUntil(
    caches.open(CACHE)
      .then((c) => c.addAll(CORE))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (ev) => {
  ev.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (ev) => {
  const url = new URL(ev.request.url);
  if (ev.request.method !== 'GET' || url.origin !== self.location.origin) return;
  ev.respondWith(
    caches.match(ev.request, { ignoreSearch: true }).then((cached) => {
      const fresh = fetch(ev.request).then((resp) => {
        if (resp && resp.ok) {
          const copy = resp.clone();
          caches.open(CACHE).then((c) => c.put(ev.request, copy));
        }
        return resp;
      }).catch(() => cached);
      return cached || fresh;
    }),
  );
});
