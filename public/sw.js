// Service Worker for TravelSplit PWA
const STATIC_CACHE = 'travelsplit-static-custom';

const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.png',
  // Add other static assets as needed
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => cache.addAll(PRECACHE_ASSETS))
  );
  self.skipWaiting(); // Force immediate activation
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.filter((name) => name !== STATIC_CACHE).map((name) => caches.delete(name))
      )
    )
  );
  self.clients.claim(); // Take control immediately
});
