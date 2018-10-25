import './index.scss';
import {map, tileLayer, control} from 'leaflet';

import './MyLocationControl';
import './CenterMapControl';
import './ShareControl';
import './FlashMessageControl';
import './OtherLocationInitializer';

document.addEventListener('DOMContentLoaded', () => {

    const m = map('map', {
        center: [0, 0],
        zoom: 3,
        zoomControl: false,
        attributionControl: false
    });

    tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {}).addTo(m);

    control.attribution()
        .addAttribution('&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors')
        .addAttribution('<i class="fab fa-gitlab"></i> <a href="https://gitlab.com/tmorin/imzer" target="_blank">source code</a>')
        .addTo(m);

    control.zoom({position: 'bottomright'}).addTo(m);

});