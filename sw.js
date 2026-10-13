// AeroNet service worker.
// Pages: network-first (so a new deploy is picked up immediately, cached copy only when offline).
// Hashed build assets + vendored KaTeX: cache-first (their file names change when content changes).
const CACHE = 'aeronet-v5';
// Paths are relative to this file, so the app works at / (Netlify) and at /repo/ (GitHub Pages).
const SHELL = ['./', './index.html', './manifest.json', './vendor/katex/katex.min.js', './vendor/katex/katex.min.css'];
const INDEX = new URL('./index.html', self.location).href;

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).catch(() => {}));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return; // fonts, YouTube etc. go straight to the network
  if (url.pathname.includes('/.netlify/')) return; // never cache the tutor function

  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(INDEX, copy));
          return res;
        })
        .catch(() => caches.match(INDEX))
    );
    return;
  }

  if (url.pathname.includes('/assets/') || url.pathname.includes('/vendor/') || url.pathname.endsWith('.png')) {
    event.respondWith(
      caches.match(req).then(
        (hit) =>
          hit ||
          fetch(req).then((res) => {
            if (res.ok) {
              const copy = res.clone();
              caches.open(CACHE).then((c) => c.put(req, copy));
            }
            return res;
          })
      )
    );
  }
});
