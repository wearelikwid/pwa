const CACHE_NAME = 'workout-app-v1';
const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/workout.html',
    '/styles/index.css',
    '/styles/workout.css',
    '/scripts/index.js',
    '/scripts/workout.js',
    '/manifest.json',
    '/icons/icon-192x192.png',
    '/icons/icon-512x512.png'
];

// Install event - cache assets
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                return cache.addAll(ASSETS_TO_CACHE);
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Fetch event - serve from cache, then network
self.addEventListener('fetch', event => {
    // Handle workout data requests separately
    if (event.request.url.includes('workouts/week')) {
        event.respondWith(
            caches.match(event.request)
                .then(response => {
                    return response || fetch(event.request)
                        .then(response => {
                            // Clone the response
                            const responseToCache = response.clone();
                            
                            // Add to cache
                            caches.open(CACHE_NAME)
                                .then(cache => {
                                    cache.put(event.request, responseToCache);
                                });

                            return response;
                        });
                })
                .catch(() => {
                    // Return offline fallback for workout data
                    return new Response(
                        JSON.stringify({
                            error: 'You are offline. Please check your connection.'
                        }),
                        {
                            headers: { 'Content-Type': 'application/json' }
                        }
                    );
                })
        );
    } else {
        // For other requests, try network first, then cache
        event.respondWith(
            fetch(event.request)
                .catch(() => {
                    return caches.match(event.request);
                })
        );
    }
});
