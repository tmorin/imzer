(function () {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js');
    }

    var map = L.map('map', {
        center: [0, 0],
        zoom: 3,
        zoomControl: false
    });

    new L.Control.Zoom({ position: 'bottomright' }).addTo(map);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {}).addTo(map);
}());