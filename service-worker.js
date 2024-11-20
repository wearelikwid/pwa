const CACHE_NAME = 'workout-app-v1.2';
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
    'icons/icon-512x512.png'
];

// Dynamic cache for workout JSON files
const DYNAMIC_CACHE = 'workout-dynamic-v1';

// Install event - cache assets
self.addEventListener('install', event => {
    event.waitUntil(
        Promise.all([
            caches.open(CACHE_NAME)
                .then(cache => {
                    console.log('Caching static assets');
                    return cache.addAll(ASSETS_TO_CACHE);
                }),
            caches.open(DYNAMIC_CACHE)
                .then(cache => {
                    console.log('Creating dynamic cache');
                })
        ])
        .then(() => self.skipWaiting())
        .catch(error => {
            console.error('Cache installation failed:', error);
        })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
    event.waitUntil(
        Promise.all([
            caches.keys().then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => {
                        if (![CACHE_NAME, DYNAMIC_CACHE].includes(cacheName)) {
                            console.log('Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            }),
            self.clients.claim()
        ])
    );
});

// Fetch event - serve from cache, then network
self.addEventListener('fetch', event => {
    const url = new URL(event.request.url);
    
    // Special handling for workout JSON files
    if (url.pathname.includes('/workouts/')) {
        event.respondWith(
            caches.match(event.request)
                .then(cachedResponse => {
                    if (cachedResponse) {
                        return cachedResponse;
                    }
                    return fetch(event.request)
                        .then(response => {
                            if (!response || response.status !== 200) {
                                return response;
                            }
                            const responseToCache = response.clone();
                            caches.open(DYNAMIC_CACHE)
                                .then(cache => {
                                    cache.put(event.request, responseToCache);
                                });
                            return response;
                        })
                        .catch(() => {
                            // Return a custom response for workout files that don't exist
                            if (url.pathname.includes('.json')) {
                                return new Response(JSON.stringify({
                                    error: 'Workout not found',
                                    message: 'This workout is not available'
                                }), {
                                    headers: {
                                        'Content-Type': 'application/json'
                                    }
                                });
                            }
                        });
                })
        );
        return;
    }

    // Handle regular static assets
    event.respondWith(
        caches.match(event.request)
            .then(cachedResponse => {
                if (cachedResponse) {
                    return cachedResponse;
                }
                return fetch(event.request)
                    .then(response => {
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }
                        const responseToCache = response.clone();
                        caches.open(CACHE_NAME)
                            .then(cache => {
                                cache.put(event.request, responseToCache);
                            });
                        return response;
                    })
                    .catch(error => {
                        console.error('Fetch failed:', error);
                        return new Response('App is offline. Please check your connection.');
                    });
            })
    );
});

// Handle background sync
self.addEventListener('sync', event => {
    if (event.tag === 'sync-workouts') {
        event.waitUntil(syncWorkoutData());
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
