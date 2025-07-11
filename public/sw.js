// Minimal service worker for PWA functionality
const CACHE_NAME = 'travelsplit-v1';

// Install event - basic setup
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  self.skipWaiting();
});

// Activate event - take control immediately
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  event.waitUntil(self.clients.claim());
}); 