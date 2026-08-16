/**
 * Offline support.
 *
 * Every tool is client-side, so once its page and chunks are cached the
 * tool genuinely works with no network at all. Nothing here caches user
 * input — only the app's own assets.
 *
 * Strategy:
 *   navigations  → network first, cache fallback (fresh when online,
 *                  still works on a plane)
 *   static build → cache first (immutable, hashed filenames)
 *   everything else passes through untouched
 */
const VERSION = 'v2';
const PAGES = `pages-${VERSION}`;
const ASSETS = `assets-${VERSION}`;

self.addEventListener('install', (event) => {
  // Warm the shell so a first offline visit isn't a dead end.
  event.waitUntil(
    caches.open(PAGES).then((c) => c.addAll(['/', '/offline'])).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((k) => !k.endsWith(VERSION))
            .map((k) => caches.delete(k))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // Never cache the analytics beacon or generated images.
  if (url.pathname.startsWith('/_vercel') || url.pathname.startsWith('/og/')) return;

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((res) => {
          const copy = res.clone();
          caches.open(PAGES).then((c) => c.put(request, copy)).catch(() => {});
          return res;
        })
        .catch(async () => {
          const hit = await caches.match(request);
          return hit || (await caches.match('/offline')) || Response.error();
        })
    );
    return;
  }

  if (url.pathname.startsWith('/_next/static/')) {
    event.respondWith(
      caches.match(request).then(
        (hit) =>
          hit ||
          fetch(request).then((res) => {
            const copy = res.clone();
            caches.open(ASSETS).then((c) => c.put(request, copy)).catch(() => {});
            return res;
          })
      )
    );
  }
});
