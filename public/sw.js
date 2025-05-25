// Service Worker for Push Notifications

const CACHE_NAME = 'comandero-push-v1';
const OFFLINE_URL = '/offline.html';

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Caching assets');
        return cache.addAll([
          '/',
          '/offline.html',
          '/icons/icon-192x192.png',
          '/icons/icon-512x512.png',
          '/icons/badge-72x72.png',
          '/manifest.json',
        ]);
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
            console.log('[Service Worker] Removing old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
    .then(() => self.clients.claim())
  );
});

// Fetch event - serve from cache, falling back to network
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') return;

  // Skip non-http(s) requests
  if (!event.request.url.startsWith('http')) return;

  // Handle API requests with network-first strategy
  if (event.request.url.includes('/api/')) {
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          // If network fails, return a custom offline response
          return new Response(
            JSON.stringify({ error: 'You are offline. Please check your connection.' }), 
            { 
              status: 503, 
              statusText: 'Service Unavailable',
              headers: { 'Content-Type': 'application/json' }
            }
          );
        })
    );
    return;
  }

  // For all other requests, use cache-first strategy
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached response if found
        if (response) {
          return response;
        }

        // Otherwise fetch from network
        return fetch(event.request)
          .then((response) => {
            // Check if we received a valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone the response
            const responseToCache = response.clone();

            // Cache the response for future use
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return response;
          })
          .catch(() => {
            // If offline and not in cache, return offline page for HTML requests
            if (event.request.headers.get('accept').includes('text/html')) {
              return caches.match(OFFLINE_URL);
            }
            // For other requests, return a generic error
            return new Response('You are offline and this resource is not cached.', {
              status: 503,
              statusText: 'Service Unavailable',
              headers: { 'Content-Type': 'text/plain' }
            });
          });
      })
  );
});

// Push event - handle incoming push notifications
self.addEventListener('push', (event) => {
  if (!event.data) return;

  let data;
  try {
    data = event.data.json();
  } catch (e) {
    console.error('Error parsing push data:', e);
    return;
  }

  const { title, body, icon, badge, data: notificationData, ...options } = data;

  // Ensure the service worker stays alive to show the notification
  event.waitUntil(
    self.registration.showNotification(title || 'New Notification', {
      body,
      icon: icon || '/icons/icon-192x192.png',
      badge: badge || '/icons/badge-72x72.png',
      data: notificationData,
      ...options
    })
  );
});

// Notification click event - handle when a notification is clicked
self.addEventListener('notificationclick', (event) => {
  // Close the notification
  event.notification.close();

  // Extract data from the notification
  const { data } = event.notification;
  
  // Default URL to open when notification is clicked
  let url = '/';
  
  // If the notification has a URL in its data, use that
  if (data && data.url) {
    url = data.url;
  }
  
  // Check if there's already a tab open with this URL
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // Check if there's a client with the same origin
        const client = clientList.find(
          (c) => c.url === url && 'focus' in c
        );
        
        if (client) {
          // If found, focus it
          return client.focus();
        } else if (clients.openWindow) {
          // Otherwise open a new window
          return clients.openWindow(url);
        }
      })
  );
  
  // Handle any custom actions
  if (event.action) {
    // You can handle different actions here
    console.log('Notification action:', event.action, data);
    
    // Example: If you have a 'view' action with a specific URL
    if (event.action === 'view' && data && data.actionUrl) {
      event.waitUntil(clients.openWindow(data.actionUrl));
    }
  }
});

// Handle push subscription change (e.g., when subscription expires)
self.addEventListener('pushsubscriptionchange', (event) => {
  event.waitUntil(
    Promise.resolve().then(async () => {
      const subscription = await self.registration.pushManager.subscribe(
        event.oldSubscription.options
      );
      
      // Send the new subscription to your server
      return fetch('/api/push/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          endpoint: subscription.endpoint,
          keys: {
            p256dh: arrayBufferToBase64(subscription.getKey('p256dh')),
            auth: arrayBufferToBase64(subscription.getKey('auth')),
          },
        }),
      });
    })
  );
});

// Helper function to convert ArrayBuffer to base64
function arrayBufferToBase64(buffer) {
  if (!buffer) return '';
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

// Handle background sync
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-orders') {
    event.waitUntil(handleOrderSync());
  }
});

// Example background sync handler
async function handleOrderSync() {
  // Get any pending orders from IndexedDB
  const db = await openDatabase();
  const tx = db.transaction('pendingOrders', 'readonly');
  const store = tx.objectStore('pendingOrders');
  const pendingOrders = await store.getAll();
  
  // Process each pending order
  for (const order of pendingOrders) {
    try {
      // Try to send the order to the server
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(order),
      });
      
      if (response.ok) {
        // If successful, remove from pending orders
        const tx = db.transaction('pendingOrders', 'readwrite');
        await tx.objectStore('pendingOrders').delete(order.id);
      }
    } catch (error) {
      console.error('Error syncing order:', error);
    }
  }
}

// Helper function to open IndexedDB
function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('ComanderoDB', 1);
    
    request.onerror = (event) => {
      console.error('Error opening database:', event);
      reject('Error opening database');
    };
    
    request.onsuccess = (event) => {
      resolve(event.target.result);
    };
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      
      // Create object store for pending orders
      if (!db.objectStoreNames.contains('pendingOrders')) {
        const store = db.createObjectStore('pendingOrders', { keyPath: 'id' });
        store.createIndex('createdAt', 'createdAt', { unique: false });
      }
    };
  });
}
