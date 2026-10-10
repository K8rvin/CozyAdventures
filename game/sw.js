// Service Worker: офлайн-режим игры «Лавка на перекрёстке миров».
// Документ и код — network-first (свежее сразу, офлайн — из кэша),
// ассеты — cache-first (картинки/звуки меняются редко, кэш ускоряет).
const CACHE = 'cozy-adventures-v2';

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

function put(cache, request, response) {
  if (response && response.ok) cache.put(request, response.clone());
  return response;
}

self.addEventListener('fetch', (ev) => {
  const url = new URL(ev.request.url);
  if (ev.request.method !== 'GET' || url.origin !== self.location.origin) return;
  const isAsset = url.pathname.includes('/assets/');

  ev.respondWith((async () => {
    const cache = await caches.open(CACHE);
    if (isAsset) {
      // Ассеты: сначала кэш, в фоне — обновление
      const cached = await cache.match(ev.request, { ignoreSearch: true });
      const fresh = fetch(ev.request)
        .then((r) => put(cache, ev.request, r))
        .catch(() => cached);
      return cached || fresh;
    }
    // Документ/код/манифест: сначала сеть, офлайн — кэш
    try {
      return await fetch(ev.request).then((r) => put(cache, ev.request, r));
    } catch {
      const cached = await cache.match(ev.request, { ignoreSearch: true });
      return cached || Response.error();
    }
  })());
});
