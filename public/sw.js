// Service Worker for TravelSplit PWA
// Version: auto-updated on deployment

// Check if we're in development mode
const isDevelopment = () => {
  // Check for development flag set by the main app
  return self.location.search.includes('dev=true') || 
         self.location.hostname === 'localhost' || 
         self.location.hostname === '127.0.0.1' ||
         self.location.port === '5173' ||
         self.location.port === '3000';
};

// Simple cache version that changes on each deployment
const CACHE_VERSION = 'travelsplit-v1';
const STATIC_CACHE = `travelsplit-static-${CACHE_VERSION}`;
const DYNAMIC_CACHE = `travelsplit-dynamic-${CACHE_VERSION}`;

const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.png',
  '/icon-192x192.png',
  '/icon-512x512.png',
  // Add other static assets as needed
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...', CACHE_VERSION);
  
  // Skip caching in development mode
  if (isDevelopment()) {
    console.log('Development mode detected - skipping cache installation');
    event.waitUntil(self.skipWaiting());
    return;
  }
  
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      console.log('Caching static assets');
      return cache.addAll(PRECACHE_ASSETS);
    }).then(() => {
      console.log('Service Worker installed');
      return self.skipWaiting(); // Force immediate activation
    })
  );
});

// Activate event - clean up old caches and take control
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...', CACHE_VERSION);
  
  // Skip cache cleanup in development mode
  if (isDevelopment()) {
    console.log('Development mode detected - skipping cache cleanup');
    event.waitUntil(self.clients.claim());
    return;
  }
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // Delete all old caches that don't match current version
          if (!cacheName.includes(CACHE_VERSION)) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('Service Worker activated');
      return self.clients.claim(); // Take control immediately
    })
  );
});

// Fetch event - network-first for HTML, cache-first for static assets
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip unsupported schemes (chrome-extension, data:, etc.)
  if (url.protocol === 'chrome-extension:' || url.protocol === 'data:' || url.protocol === 'blob:') {
    return;
  }

  // In development mode, always fetch from network and don't cache
  if (isDevelopment()) {
    console.log('Development mode - fetching from network:', request.url);
    event.respondWith(fetch(request));
    return;
  }

  // Handle deep linking for shared trip URLs
  if (url.pathname.includes('/trip/') && url.pathname.includes('/share')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cache successful responses
          if (response.ok) {
            const responseClone = response.clone();
            caches.open(DYNAMIC_CACHE).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          // Fallback to cache
          return caches.match(request);
        })
    );
    return;
  }

  // Network-first strategy for HTML files (ensures fresh content)
  if (request.destination === 'document' || url.pathname.endsWith('.html')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cache successful responses
          if (response.ok) {
            const responseClone = response.clone();
            caches.open(DYNAMIC_CACHE).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          // Fallback to cache
          return caches.match(request);
        })
    );
    return;
  }

  // Cache-first strategy for static assets (JS, CSS, images)
  if (request.destination === 'script' || 
      request.destination === 'style' || 
      request.destination === 'image' ||
      url.pathname.startsWith('/static/') ||
      url.pathname.startsWith('/assets/')) {
    event.respondWith(
      caches.match(request).then((response) => {
        if (response) {
          // Return cached response
          return response;
        }
        // Fetch from network and cache
        return fetch(request).then((networkResponse) => {
          if (networkResponse.ok) {
            const responseClone = networkResponse.clone();
            caches.open(STATIC_CACHE).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return networkResponse;
        });
      })
    );
    return;
  }

  // Default: network-first with cache fallback
  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response.ok) {
          const responseClone = response.clone();
          caches.open(DYNAMIC_CACHE).then((cache) => {
            cache.put(request, responseClone);
          });
        }
        return response;
      })
      .catch(() => caches.match(request))
  );
});

// Handle service worker updates
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  // Handle cache clearing
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            console.log('Clearing cache:', cacheName);
            return caches.delete(cacheName);
          })
        );
      })
    );
  }
});

// Handle navigation events for deep linking
self.addEventListener('navigate', (event) => {
  // This helps ensure deep links work properly in the PWA
  console.log('Navigation event:', event);
});
