const CACHE_NAME = 'workout-app-v1.1';
const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/workout.html',
    '/styles/index.css',
    '/styles/workout.css',
    '/scripts/index.js',
    '/scripts/workout.js',
    '/scripts/pwa.js',
    '/manifest.json',
    '/icons/icon.svg',
    '/icons/icon-192x192.png',
    '/icons/icon-512x512.png'
];

// Install event - cache assets
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache');
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
    if (event.request.url.includes('workouts/')) {
        event.respondWith(
            caches.match(event.request)
                .then(response => {
                    // Return cached response if found
                    if (response) {
                        return response;
                    }

                    // Clone the request
                    const fetchRequest = event.request.clone();

                    return fetch(fetchRequest).then(response => {
                        // Check if valid response
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }

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
        );
    } else {
        // For other requests, try cache first, then network
        event.respondWith(
            caches.match(event.request)
                .then(response => {
                    return response || fetch(event.request);
                })
        );
    }
});

// Handle background sync for offline changes
self.addEventListener('sync', event => {
    if (event.tag === 'sync-workouts') {
        event.waitUntil(
            // Sync workout completion status
            syncWorkoutData()
        );
    }
});

// Function to sync workout data
async function syncWorkoutData() {
    try {
        const offlineData = await localforage.getItem('offlineWorkouts');
        if (offlineData) {
            // Process offline data here
            await localforage.removeItem('offlineWorkouts');
        }
    } catch (error) {
        console.error('Error syncing workout data:', error);
    }
}
