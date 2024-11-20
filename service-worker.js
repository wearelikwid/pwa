const CACHE_NAME = 'workout-app-v1.1';
const ASSETS_TO_CACHE = [
    './',
    'index.html',
    'workout.html',
    'styles/index.css',
    'styles/workout.css',
    'scripts/index.js',
    'scripts/workout.js',
    'scripts/pwa.js',
    'manifest.json',
    'icons/icon.svg',
    'icons/icon-192x192.png',
    'icons/icon-512x512.png',
    'workouts/'  // Add this to cache the workouts directory
];

// Install event - cache assets
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache');
                return cache.addAll(ASSETS_TO_CACHE);
            })
            .catch(error => {
                console.error('Cache installation failed:', error);
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
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Fetch event - serve from cache, then network
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(cachedResponse => {
                if (cachedResponse) {
                    return cachedResponse;
                }
                
                return fetch(event.request)
                    .then(response => {
                        // Don't cache if not a valid response
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }

                        // Clone the response
                        const responseToCache = response.clone();

                        caches.open(CACHE_NAME)
                            .then(cache => {
                                cache.put(event.request, responseToCache);
                            });

                        return response;
                    })
                    .catch(error => {
                        console.error('Fetch failed:', error);
                        // You might want to return a custom offline page here
                        return new Response('Offline content not available');
                    });
            })
    );
});

// Handle background sync for offline changes
self.addEventListener('sync', event => {
    if (event.tag === 'sync-workouts') {
        event.waitUntil(
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

// Handle service worker updates
self.addEventListener('message', event => {
    if (event.data.action === 'skipWaiting') {
        self.skipWaiting();
    }
});
