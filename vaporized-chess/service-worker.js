// service-worker.js

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open('app-cache').then((cache) => {
            return cache.addAll([
                '/',
                '/index.html',
                '/engine.mjs',
                '/game.mjs',
                '/service-worker.js',
                '/scenes/bishop.mjs',
                '/scenes/score.mjs',
                '/icons/icon-192x192.png',
                '/icons/icon-512x512.png',
                'fonts/PressStart2P-Regular.ttf'
            ]);
        })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});
