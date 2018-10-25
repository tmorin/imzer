const APP_CACHE = 'APP-v1.2.2';
const TILES_CACHE = 'TILES-v1.2.2';

self.addEventListener('install', function (event) {
    console.log('sw', 'install');
    event.waitUntil(
        Promise.all([
            caches.open(APP_CACHE).then(function (cache) {
                return cache.addAll([
                    'icons/imzer.svg',
                    'icons/imzer-64.png',
                    'icons/imzer-128.png',
                    'icons/imzer-512.png',
                    'icons/me.svg',
                    'icons/other.svg',
                    'images/layers.png',
                    'images/layers-2x.png',
                    'images/marker-icon.png',
                    'images/marker-icon-2x.png',
                    'images/marker-shadow.png',
                    'imzer.webmanifest',
                    'index.js',
                    'manifest.json',
                    'robot.txt'
                ]);
            }),
            caches.open(TILES_CACHE).then(function (cache) {
                return cache.addAll([])
            })
        ])
    );
});

self.addEventListener('fetch', function (event) {
    const isTileRequest = /\.tile\./.test(event.request.url);
    event.respondWith(caches.match(event.request).then(function (response) {
        if (response !== undefined) {
            return response;
        } else {
            return fetch(event.request).then(function (response) {
                caches.open(isTileRequest ? TILES_CACHE : APP_CACHE).then(function (cache) {
                    cache.put(event.request, response.clone());
                });
                return response;
            }).catch(function (e) {
                console.warn('unable to fetch', e);
            });
        }
    }));
});

self.addEventListener('activate', function (event) {
    // clear existing cache
    const whiteList = [APP_CACHE, TILES_CACHE];
    event.waitUntil(
        caches.keys().then(function (cacheNames) {
            return Promise.all(
                cacheNames.filter(function (cacheName) {
                    return whiteList.indexOf(cacheName) < 0;
                }).map(function (cacheName) {
                    console.log('delete', cacheName);
                    return caches.delete(cacheName);
                })
            );
        })
    );
});
