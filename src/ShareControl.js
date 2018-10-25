import ClipboardJS from 'clipboard';
import {Control, DomEvent, DomUtil, Map, Util} from 'leaflet';

Control.Share = Control.extend({
    options: {
        position: 'topleft',
        timeout: 3000
    },

    onAdd(map) {
        const container = DomUtil.create('div', 'leaflet-control-share');

        const a = container.appendChild(
            DomUtil.create('a', 'leaflet-control-button')
        );

        a.setAttribute('role', 'button');
        a.setAttribute('title', 'Share my position');
        a.setAttribute('href', '#');
        a.setAttribute('disabled', '');
        a.innerHTML = '<i class="fas fa-share-square"/>';

        DomEvent.on(a, 'click', function (evt) {
            evt.preventDefault();
            if (navigator.share) {
                navigator.share({
                    title: 'imzer - localize and be localized',
                    text: 'Hey, I\'m there!',
                    url: a.dataset.clipboardText
                });
            }

        });

        const clipboard = new ClipboardJS(a);
        clipboard.on('success', function () {
            map.fire('flashmessage', {
                message: 'URL copied to clipboard!'
            });
        });

        return container;
    }
});

Map.addInitHook(function () {
    const control = new Control.Share({}).addTo(this);
    this.on('mylocation', function (evt) {
        // handle disabled according to mylocationn result
        const a = control.getContainer().querySelector('a');
        if (evt.latlng) {
            const origin = 'browser' in window ? 'https://imzer.morin.io' : location.origin;

            const queryParams = Util.getParamString({
                latitude: evt.latlng.lat,
                longitude: evt.latlng.lng,
                accuracy: evt.accuracy
            });

            a.dataset.clipboardText = Util.template(
                '{origin}{pathname}{queryParams}',
                Object.assign({}, location, {queryParams: queryParams, origin: origin})
            );

            a.removeAttribute('disabled');
        } else {
            a.setAttribute('disabled', '');
        }
    });
});
