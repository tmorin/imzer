L.Control.FlashMessage = L.Control.extend({
    options: {
        position: 'topright',
        timeout: 3000
    },

    onAdd: function () {
        return L.DomUtil.create('div', 'leaflet-control-flashmessage');
    },

    close: function () {
        if (this._timeoutId) {
            clearTimeout(this._timeoutId)
        }
        L.DomUtil.removeClass(this.getContainer(), 'leaflet-control-flashmessage-opened');

    },

    flash: function (message) {
        this._timeoutId = setTimeout(this.close.bind(this), this.options.timeout || 3000);
        this.getContainer().textContent = message;
        L.DomUtil.addClass(this.getContainer(), 'leaflet-control-flashmessage-opened');
    }
});

L.Map.addInitHook(function () {
    this.flashMessage = new L.Control.FlashMessage().addTo(this);
    this.on('flashmessage', function (evt) {
        this.flashMessage.flash(evt.message);
    });
});