import {Control, DomUtil, Map} from 'leaflet';

Control.FlashMessage = Control.extend({
    options: {
        position: 'topright',
        timeout: 5000
    },

    onAdd() {
        return DomUtil.create('div', 'leaflet-control-flashmessage');
    },

    close() {
        if (this._timeoutId) {
            clearTimeout(this._timeoutId)
        }
        DomUtil.removeClass(this.getContainer(), 'leaflet-control-flashmessage-opened');

    },

    flash(message) {
        this._timeoutId = setTimeout(this.close.bind(this), this.options.timeout || 3000);
        this.getContainer().innerHTML = message;
        DomUtil.addClass(this.getContainer(), 'leaflet-control-flashmessage-opened');
    }
});

Map.addInitHook(function () {
    this.flashMessage = new Control.FlashMessage().addTo(this);
    this.on('flashmessage', function (evt) {
        this.flashMessage.flash(evt.message);
    });
});