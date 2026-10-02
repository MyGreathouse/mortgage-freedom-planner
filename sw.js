// Mortgage Freedom Planner — Service Worker
//
// IMPORTANT: the root page ("/") and manifest are always fetched fresh from the
// network first (falling back to cache only if offline). Earlier versions of
// this file cached "/" cache-first, which meant returning visitors could get
// silently stuck on an old build forever — since "/" references Next.js's
// per-build hashed JS filenames, an old cached "/" keeps pointing at old code
// even after a brand new deploy succeeds. Only the hashed, per-build static
// assets (safe, because their URL itself changes every build) stay cache-first
// below, for fast offline loads.

var CACHE_NAME = 'freedom-planner-v2';
var APP_SHELL = ['/manifest.json', '/icon-192.png', '/icon-512.png', '/icon-512-maskable.png'];

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

// Never cache API calls — always go to the network.
self.addEventListener('fetch', function (event) {
  var url = event.request.url;
  if (url.indexOf('/api/') !== -1) {
    event.respondWith(fetch(event.request));
    return;
  }

  // Navigations (the page itself) and the manifest: network-first, so a new
  // deploy is picked up on the very next load. Falls back to the last cached
  // copy only if there's no connection at all.
  var isNavigation = event.request.mode === 'navigate' || url.endsWith('/manifest.json');
  if (isNavigation) {
    event.respondWith(
      fetch(event.request)
        .then(function (response) {
          var copy = response.clone();
          caches.open(CACHE_NAME).then(function (cache) { cache.put(event.request, copy); });
          return response;
        })
        .catch(function () {
          return caches.match(event.request).then(function (cached) { return cached || caches.match('/'); });
        })
    );
    return;
  }

  // Everything else (hashed build assets, icons): cache-first is safe here,
  // since each build's files live at a unique URL and never need invalidating.
  event.respondWith(
    caches.match(event.request).then(function (cached) {
      if (cached) return cached;
      return fetch(event.request).then(function (response) {
        var copy = response.clone();
        caches.open(CACHE_NAME).then(function (cache) { cache.put(event.request, copy); });
        return response;
      });
    })
  );
});
