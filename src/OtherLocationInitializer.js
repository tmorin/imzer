import {circle, icon, Map, marker} from 'leaflet';

Map.addInitHook(function () {

    function getQueryParams() {
        return location.search
            .replace(/(^\?)/, '')
            .split('&')
            .map(function (i) {
                return i.split('=');
            })
            .reduce(function (a, c) {
                a[c[0]] = c[1];
                return a;
            }, {});
    }

    function getOtherLocation() {
        const queryParams = getQueryParams();
        if (queryParams.latitude && queryParams.longitude) {
            const latlng = [parseFloat(queryParams.latitude), parseFloat(queryParams.longitude)];
            if (isNaN(latlng[0]) || isNaN(latlng[1])) {
                throw new Error('Unable to parse the other location.');
            }
            const accuracy = parseFloat(queryParams.accuracy);
            return {
                latlng: latlng,
                accuracy: isNaN(accuracy) ? undefined : accuracy
            };
        }
    }

    let otherLocation;
    try {
        otherLocation = getOtherLocation();
    } catch (e) {
        this.fire('flashmessage', {
            message: e.message
        });
    }

    if (otherLocation) {
        marker(otherLocation.latlng, {
            icon: icon({
                iconUrl: 'icons/other.svg',
                iconSize: [48, 48],
                iconAnchor: [6, 46]
            }),
            title: 'It\'s the other location.'
        }).addTo(this);

        if (otherLocation.accuracy) {
            circle(otherLocation.latlng, {
                radius: otherLocation.accuracy,
                opacity: 1
            }).addTo(this);
        }

        this.fire('otherlocation', otherLocation);
    }

});