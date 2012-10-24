enchant.Scene = enchant.Class.create(enchant.Group, {
    initialize: function() {
        var game = enchant.Game.instance;
        enchant.Group.call(this);

        this.width = game.width;
        this.height = game.height;

        this._element = document.createElement('div');
        this._element.style.width = this.width + 'px';
        this._element.style.height = this.height + 'px';
        this._element.style.position = 'absolute';
        this._element.style[enchant.ENV.VENDOR_PREFIX + 'TransformOrigin'] = '0 0';
        this._element.style[enchant.ENV.VENDOR_PREFIX + 'Transform'] = 'scale(' + enchant.Game.instance.scale + ')';

        this._layers = {};
        this.addLayer('Canvas');
        this.addEventListener(enchant.Event.CHILD_ADDED, this._onchildadded);
        this.addEventListener(enchant.Event.CHILD_REMOVED, this._onchildremoved);
        this.addEventListener(enchant.Event.ENTER, this._onenter);
        this.addEventListener(enchant.Event.EXIT, this._onexit);
    },
    addLayer: function(type, i) {
        var game = enchant.Game.instance;
        if (this._layers[type]) {
            return;
        }
        var layer = new enchant[type + 'Layer']();
        // TODO controll with enter, exit
        if (game.currentScene === this) {
            layer._startRendering();
        }
        this._layers[type] = layer;
        var element = layer._element;
        if (typeof i === 'number') {
            var nextSibling = this._element.childNodes.indexOf(i);
            this._element.insertBefore(element, nextSibling);
        } else {
            this._element.appendChild(element);
        }
    },
    _onchildadded: function(e) {
        var child = e.node;
        var next = e.next;
        if (next) {
            this._layers.Canvas.insertBefore(child, next);
        } else {
            this._layers.Canvas.addChild(child);
        }
    },
    _onchildremoved: function(e) {
        var child = e.node;
        this._layers.Canvas.removeChild(child);
    },
    _onenter: function() {
        for (var type in this._layers) {
            this._layers[type]._startRendering();
        }
    },
    _onexit: function() {
        for (var type in this._layers) {
            this._layers[type]._stopRendering();
        }
    }
});
