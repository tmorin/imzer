import './index.scss';
import {Control, map, tileLayer} from 'leaflet';

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
        zoomControl: false
    });

    tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {}).addTo(m);

    new Control.Zoom({position: 'bottomright'}).addTo(m);
});