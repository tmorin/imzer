import './index.scss';
import {control, map, tileLayer} from 'leaflet';
import './MyLocationControl';
import './CenterMapControl';
import './ShareControl';
import './FlashMessageControl';
import './OtherLocationInitializer';

document.addEventListener('DOMContentLoaded', () => {

    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('service-worker.js');
    }

    const m = map('map', {
        center: [0, 0],
        zoom: 3,
        zoomControl: false,
        attributionControl: false
    });

    tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {}).addTo(m);

    control.attribution()
        .addAttribution('&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>')
        .addAttribution('<i class="fab fa-github"></i> <a href="https://github.com/tmorin/imzer" target="_blank">source code</a>')
        .addAttribution(document.head.querySelector('meta[name="imzer-version"]').getAttribute('content'))
        .addTo(m);

    control.zoom({position: 'bottomright'}).addTo(m);

});