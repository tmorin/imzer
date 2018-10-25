L.Control.MyLocation = L.Control.extend({
    options: {
        position: 'topleft',
        timeout: 3000
    },

    onAdd: function () {
        var container = L.DomUtil.create('div', 'leaflet-control-mylocation');

        var a = container.appendChild(
            L.DomUtil.create('a', 'leaflet-control-button')
        );

        a.setAttribute('role', 'button');
        a.setAttribute('title', 'Locate me');
        a.setAttribute('href', '#');
        a.innerHTML = '<i class="fas fa-map-marker"/>';

        L.DomEvent.on(a, 'click', function (evt) {
            evt.preventDefault();
            var started = L.DomUtil.hasClass(
                this.getContainer().querySelector('a.leaflet-control-button'),
                'leaflet-control-mylocation-started'
            );
            if (started) {
                this.stopLocateMe();
            } else {
                this.startLocateMe();
            }
        }.bind(this));

        return container;
    },

    startLocateMe: function () {
        L.DomUtil.addClass(
            this.getContainer().querySelector('a.leaflet-control-button'),
            'leaflet-control-mylocation-started'
        );
        this._map.locate({
            watch: true,
            enableHighAccuracy: true
        });
    },

    stopLocateMe: function () {
        L.DomUtil.removeClass(
            this.getContainer().querySelector('a.leaflet-control-button'),
            'leaflet-control-mylocation-started'
        );
        this._map.stopLocate();
    }
});

L.Map.addInitHook(function () {
    var control = new L.Control.MyLocation({}).addTo(this);

    var meMarker = L.marker([0, 0], {
        icon: L.icon({
            iconUrl: 'icons/me.svg',
            iconSize: [48, 48],
            iconAnchor: [24, 46]
        }),
        title: 'I\'m there'
    }).addTo(this).setOpacity(0);

    var meCircleMarker = L.circle([0, 0], {
        radius: 0,
        opacity: 0
    }).addTo(this);

    this.on('locationfound', function (evt) {
        // move the marker to the right position
        meMarker.setLatLng(evt.latlng).setOpacity(1);
        // move the circle marker to the right position
        meCircleMarker.setLatLng(evt.latlng).setRadius(evt.accuracy).setStyle({
            opacity: 1
        });
        // add the pulsing state because watching is working
        L.DomUtil.addClass(
            control.getContainer().querySelector('a.leaflet-control-button'),
            'leaflet-control-mylocation-started'
        );
        // notify the new location of the current device
        this.fire('mylocation', {
            latlng: evt.latlng,
            accuracy: evt.accuracy
        });
    });

    this.on('locationerror', function (evt) {
        // remove the pulsing state because watching is not working
        L.DomUtil.removeClass(
            control.getContainer().querySelector('a.leaflet-control-button'),
            'leaflet-control-mylocation-started'
        );
        // notify the geo localization is not working for the current device
        this.fire('flashmessage', {
            message: evt.message
        });
        // notify no location
        this.fire('mylocation', {
            latlng: undefined,
            accuracy: undefined
        });
        // stop to watch
        control.stopLocateMe();
    });
});