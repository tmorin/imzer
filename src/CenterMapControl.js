import {Control, DomEvent, DomUtil, Map} from 'leaflet';

Control.CenterMap = Control.extend({
    options: {
        position: 'bottomleft',
        timeout: 3000
    },

    onAdd() {
        const container = DomUtil.create('div', 'leaflet-control-centermap leaflet-control-action');

        const a = container.appendChild(
            DomUtil.create('a', 'leaflet-control-button')
        );

        a.setAttribute('role', 'button');
        a.setAttribute('title', 'Center the map');
        a.setAttribute('href', '#');
        a.innerHTML = '<i class="fas fa-expand"/>';

        DomEvent.on(a, 'click', function (evt) {
            evt.preventDefault();
            const started = DomUtil.hasClass(
                this.getContainer().querySelector('a.leaflet-control-button'),
                'leaflet-control-centermap-started'
            );
            if (started) {
                this.stopCenterMap();
            } else {
                this.startCenterMap();
            }
        }.bind(this));

        const span = container.appendChild(
            DomUtil.create('span', 'leaflet-control-label')
        );
        span.innerText = 'center the map';

        return container;
    },

    startCenterMap() {
        DomUtil.addClass(
            this.getContainer().querySelector('a.leaflet-control-button'),
            'leaflet-control-centermap-started'
        );
        this.centerMap();
    },

    stopCenterMap() {
        DomUtil.removeClass(
            this.getContainer().querySelector('a.leaflet-control-button'),
            'leaflet-control-centermap-started'
        );
    },

    centerMap() {
        const a = this.getContainer().querySelector('a.leaflet-control-button');
        if (a.disable) {
            return;
        }

        const started = DomUtil.hasClass(
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
    },

    enable() {
        const a = this.getContainer().querySelector('a.leaflet-control-button');
        a.removeAttribute('disabled');
    },

    disable() {
        const a = this.getContainer().querySelector('a.leaflet-control-button');
        a.setAttribute('disabled', '');
    }
});

Map.addInitHook(function () {
    const control = new Control.CenterMap({}).addTo(this);
    control.disable();

    this.on('mylocation', function (evt) {
        control.enable();
        control.mylocation = evt.latlng;
        control.centerMap();
    });

    this.on('otherlocation', function (evt) {
        control.enable();
        control.otherlocation = evt.latlng;
        control.centerMap();
    });

    control.startCenterMap();
});