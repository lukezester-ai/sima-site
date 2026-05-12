/**
 * Минимален service worker за инсталируемо PWA (Chrome и др.).
 * Мрежата остава източник на истина — без офлайн кеш на API/HTML.
 */
self.addEventListener("install", (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
  event.respondWith(fetch(event.request));
});
