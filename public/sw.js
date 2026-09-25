// Mortgage Freedom Planner — Service Worker
// Bump CACHE_NAME whenever you ship a new deploy so returning visitors
// get the fresh version instead of a stale cached one.

var CACHE_NAME = 'freedom-planner-v1';
var APP_SHELL = ['/', '/manifest.json', '/icon-192.png', '/icon-512.png', '/icon-512-maskable.png'];

self.addEventListener('install', function (event) {
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE_NAME).then(function (cache) { return cache.addAll(APP_SHELL); }));
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches
      .keys()
      .then(function (names) {
        return Promise.all(names.filter(function (n) { return n !== CACHE_NAME; }).map(function (n) { return caches.delete(n); }));
      })
      .then(function () { return self.clients.claim(); })
  );
});

// Never cache API calls (the AI Coach) — always go to the network.
self.addEventListener('fetch', function (event) {
  var url = event.request.url;
  if (url.indexOf('/api/') !== -1) {
    event.respondWith(fetch(event.request));
    return;
  }

  event.respondWith(
    caches.match(event.request).then(function (cached) {
      if (cached) return cached;
      return fetch(event.request)
        .then(function (response) {
          var copy = response.clone();
          caches.open(CACHE_NAME).then(function (cache) { cache.put(event.request, copy); });
          return response;
        })
        .catch(function () {
          if (event.request.mode === 'navigate') return caches.match('/');
        });
    })
  );
});
