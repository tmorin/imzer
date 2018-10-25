(function () {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js');
    }

    var map = L.map('map', {
        center: [0, 0],
        zoom: 3
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {}).addTo(map);
}());