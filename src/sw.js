var APP_CACHE = 'APP-v2';
var TILES_CACHE = 'TILES-v1';

self.addEventListener('install', function (event) {
    event.waitUntil(
        Promise.all([
            caches.open(APP_CACHE).then(function (cache) {
                return cache.addAll([
                    'clipboard.js/clipboard.min.js',
                    'fontawesome/css/solid.css',
                    'fontawesome/css/fontawesome.css',
                    'fontawesome/webfonts/fa-solid-900.eot',
                    'fontawesome/webfonts/fa-solid-900.svg',
                    'fontawesome/webfonts/fa-solid-900.ttf',
                    'fontawesome/webfonts/fa-solid-900.woff',
                    'fontawesome/webfonts/fa-solid-900.woff2',
                    'icons/imzer.svg',
                    'icons/imzer-512.png',
                    'icons/me.svg',
                    'icons/other.svg',
                    'leaflet/leaflet.js',
                    'leaflet/leaflet.css',
                    'CenterMapControl.js',
                    'FlashMessageControl.js',
                    'imzer.webmanifest',
                    'index.html',
                    'index.js',
                    'MyLocationControl.js',
                    'OtherLocationInitializer.js',
                    'robot.txt',
                    'ShareControl.js',
                    'style.css'
                ]);
            }),
            caches.open(TILES_CACHE).then(function (cache) {
                return cache.addAll([])
            })
        ])
    );
});

self.addEventListener('fetch', function (event) {
    event.respondWith(caches.match(event.request).then(function (response) {
        if (response !== undefined) {
            return response;
        } else {
            return fetch(event.request).then(function (response) {
                var responseClone = response.clone();
                caches.open(TILES_CACHE).then(function (cache) {
                    cache.put(event.request, responseClone);
                });
                return response;
            }).catch(function () {
                return caches.match('/sw-test/gallery/myLittleVader.jpg');
            });
        }
    }));
});

self.addEventListener('activate', function (event) {
    var whiteList = [APP_CACHE, TILES_CACHE];
    event.waitUntil(
        caches.keys().then(function (cacheNames) {
            return Promise.all(
                cacheNames.filter(function (cacheName) {
                    return whiteList.indexOf(cacheName) < 0;
                }).map(function (cacheName) {
                    return caches.delete(cacheName);
                })
            );
        })
    );
});
