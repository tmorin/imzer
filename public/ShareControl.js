L.Control.Share = L.Control.extend({
    options: {
        position: 'topleft',
        timeout: 3000
    },

    onAdd: function (map) {
        var container = L.DomUtil.create('div', 'leaflet-control-share');

        var a = container.appendChild(
            L.DomUtil.create('a', 'leaflet-control-button')
        );

        a.setAttribute('role', 'button');
        a.setAttribute('title', 'Share my position');
        a.setAttribute('href', '#');
        a.setAttribute('disabled', '');
        a.innerHTML = '<i class="fas fa-share-square"/>';

        L.DomEvent.on(a, 'click', function (evt) {
            evt.preventDefault();
            if (navigator.share) {
                navigator.share({
                    title: 'imzer - localize and be localized',
                    text: 'Hey, I\'m there!',
                    url: a.dataset.clipboardText
                });
            }

        });

        var clipboard = new ClipboardJS(a);
        clipboard.on('success', function () {
            map.fire('flashmessage', {
                message: 'URL copied to clipboard!'
            });
        });

        return container;
    }
});

L.Map.addInitHook(function () {
    var control = new L.Control.Share({}).addTo(this);
    this.on('mylocation', function (evt) {
        // handle disabled according to mylocationn result
        var a = control.getContainer().querySelector('a');
        if (evt.latlng) {

            var origin = location.origin;
            if ("browser" in window) {
                origin = 'https://imzer.morin.io'
            }

            var queryParams = L.Util.getParamString({
                latitude: evt.latlng.lat,
                longitude: evt.latlng.lng,
                accuracy: evt.accuracy
            });

            a.dataset.clipboardText = L.Util.template(
                '{origin}{pathname}{queryParams}',
                Object.assign({}, location, {queryParams: queryParams, origin: origin})
            );

            a.removeAttribute('disabled');
        } else {
            a.setAttribute('disabled', '');
        }
    });
});
