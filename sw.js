// Ocean Basket service worker — network-first, cache fallback.
// Bump CACHE_VERSION to force-refresh installed clients.
const CACHE_VERSION = 'ob-v23';
const CORE = ['./ocean-basket-app.html', './manifest.json', './ob-icon-192.png', './ob-icon-512.png'];

self.addEventListener('install', function(e){
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE_VERSION).then(function(c){ return c.addAll(CORE).catch(function(){}); }));
});

self.addEventListener('activate', function(e){
  e.waitUntil(
    caches.keys().then(function(keys){
      return Promise.all(keys.filter(function(k){ return k !== CACHE_VERSION; }).map(function(k){ return caches.delete(k); }));
    }).then(function(){ return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function(e){
  if(e.request.method !== 'GET') return;                 // never cache POST (orders etc.)
  var url = new URL(e.request.url);
  // Always go to network for API calls; don't cache them.
  if(url.pathname.indexOf('/api/') !== -1){ return; }
  e.respondWith(
    fetch(e.request).then(function(res){
      var copy = res.clone();
      caches.open(CACHE_VERSION).then(function(c){ c.put(e.request, copy).catch(function(){}); });
      return res;
    }).catch(function(){ return caches.match(e.request); })
  );
});
