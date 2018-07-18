L.Control.CenterMap = L.Control.extend({
    options: {
        position: 'topleft',
        timeout: 3000
    },

    onAdd: function () {
        var container = L.DomUtil.create('div', 'leaflet-control-centermap');

        var a = container.appendChild(
            L.DomUtil.create('a', 'leaflet-control-button')
        );

        a.setAttribute('role', 'button');
        a.setAttribute('title', 'Center the map');
        a.setAttribute('href', '#');
        a.innerHTML = '<i class="fas fa-expand"/>';

        L.DomEvent.on(a, 'click', function (evt) {
            evt.preventDefault();
            var started = L.DomUtil.hasClass(
                this.getContainer().querySelector('a.leaflet-control-button'),
                'leaflet-control-centermap-started'
            );
            if (started) {
                this.stopCenterMap();
            } else {
                this.startCenterMap();
            }
        }.bind(this));

        return container;
    },

    startCenterMap: function () {
        L.DomUtil.addClass(
            this.getContainer().querySelector('a.leaflet-control-button'),
            'leaflet-control-centermap-started'
        );
        this.centerMap();
    },

    stopCenterMap: function () {
        L.DomUtil.removeClass(
            this.getContainer().querySelector('a.leaflet-control-button'),
            'leaflet-control-centermap-started'
        );
    },

    centerMap() {
        var started = L.DomUtil.hasClass(
            this.getContainer().querySelector('a.leaflet-control-button'),
            'leaflet-control-centermap-started'
        );
        if (started && this.mylocation && this.otherlocation) {
            // when centering is activated, fly to get both points
            this._map.flyToBounds([
                this.mylocation,
                this.otherlocation
            ]);
        } else if (started && this.mylocation) {
            // when centering is activated but no other location, center to the device location
            this._map.flyTo(this.mylocation, 18);
        } else if (!this.mylocation && this.otherlocation) {
            // when centering is not activated, center the view to the other location
            this._map.setView(this.otherlocation, 18);
        }
    }
});

L.Map.addInitHook(function () {
    var control = new L.Control.CenterMap({}).addTo(this);

    this.on('mylocation', function (evt) {
        control.mylocation = evt.latlng;
        control.centerMap();
    });

    this.on('otherlocation', function (evt) {
        control.otherlocation = evt.latlng;
        control.centerMap();
    });

    control.startCenterMap();
});