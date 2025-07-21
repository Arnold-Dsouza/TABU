// PWA Service Worker for TABU app
// Supports offline functionality and iOS push notifications

const CACHE_NAME = 'tabu-pwa-v2';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/tabu.jpg',
  '/icons/icon-128.webp',
  '/icons/icon-192.webp',
  '/icons/icon-512.webp'
  // Add other critical assets here
];

// Install event - cache critical assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('PWA Service Worker caching assets');
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('PWA Service Worker removing old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - serve from cache or network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached response if available
        if (response) {
          return response;
        }
        
        // Clone the request because it can only be used once
        const fetchRequest = event.request.clone();
        
        // Make network request and cache the response
        return fetch(fetchRequest).then((response) => {
          // Check if valid response
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
          
          // Clone response as it can only be used once
          const responseToCache = response.clone();
          
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
          
          return response;
        });
      })
      .catch(() => {
        // Return fallback for navigation requests if offline
        if (event.request.mode === 'navigate') {
          return caches.match('/');
        }
      })
  );
});

// Push notification event handler
self.addEventListener('push', (event) => {
  console.log('Push event received', event);
  
  // Default notification options
  let title = 'TABU Notification';
  let options = {
    body: 'You have a new notification from TABU',
    icon: '/tabu.jpg',
    badge: '/icons/icon-96.webp',
    data: { timestamp: Date.now() },
    tag: 'tabu-notification' // Group similar notifications
  };
  
  if (event.data) {
    try {
      // Try to parse as JSON
      const data = event.data.json();
      
      title = data.title || title;
      options = {
        ...options,
        body: data.body || options.body,
        icon: data.icon || options.icon,
        badge: data.badge || options.badge,
        data: { ...(data.data || {}), timestamp: Date.now() },
        tag: data.tag || options.tag
      };
    } catch (error) {
      // If not JSON, use as plain text
      console.error('Error parsing push notification data:', error);
      options.body = event.data.text();
    }
  }
  
  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Notification click event handler
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked', event);
  event.notification.close();
  
  // Get the URL to open (if specified in the notification data)
  let urlToOpen = new URL('/', self.location.origin).href;
  if (event.notification.data && event.notification.data.url) {
    urlToOpen = event.notification.data.url;
  }
  
  event.waitUntil(
    clients.matchAll({
      type: 'window',
      includeUncontrolled: true
    })
    .then((clientList) => {
      // Check if there is already a window/tab open with the target URL
      for (const client of clientList) {
        if ('focus' in client) {
          return client.focus();
        }
      }
      
      // If no window/tab is open, open one
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});
