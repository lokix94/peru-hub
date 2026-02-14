const CACHE_NAME = 'peru-hub-v1';
const STATIC_ASSETS = [
  '/',
  '/marketplace',
  '/sugerencias',
  '/community',
  '/lobster-black.png',
  '/lobster-black-192.png',
  '/qr-usdt-bep20.jpg'
];

// Install - cache static assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

// Activate - clean old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch - cache first for assets, network first for pages/API
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  if (url.pathname.startsWith('/api/')) {
    // Network first for API
    event.respondWith(
      fetch(event.request).catch(() => caches.match(event.request))
    );
  } else if (event.request.destination === 'image' || event.request.destination === 'style' || event.request.destination === 'script') {
    // Cache first for static assets
    event.respondWith(
      caches.match(event.request).then(cached => cached || fetch(event.request).then(response => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        return response;
      }))
    );
  } else {
    // Network first for pages
    event.respondWith(
      fetch(event.request).catch(() => caches.match(event.request).then(r => r || caches.match('/')))
    );
  }
});
