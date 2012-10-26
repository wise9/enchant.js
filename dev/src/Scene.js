enchant.Scene = enchant.Class.create(enchant.Group, {
    initialize: function() {
        var game = enchant.Game.instance;
        enchant.Group.call(this);

        this.width = game.width;
        this.height = game.height;

        this.scene = this;

        this._element = document.createElement('div');
        this._element.style.width = this.width + 'px';
        this._element.style.height = this.height + 'px';
        this._element.style.position = 'absolute';
        this._element.style.overflow = 'hidden';
        this._element.style[enchant.ENV.VENDOR_PREFIX + 'TransformOrigin'] = '0 0';
        this._element.style[enchant.ENV.VENDOR_PREFIX + 'Transform'] = 'scale(' + enchant.Game.instance.scale + ')';

        this._layers = {};
        this._layerPriority = [];
        this.addLayer('Canvas');
        this.addLayer('Dom');
        this.addEventListener(enchant.Event.CHILD_ADDED, this._onchildadded);
        this.addEventListener(enchant.Event.CHILD_REMOVED, this._onchildremoved);
        this.addEventListener(enchant.Event.ENTER, this._onenter);
        this.addEventListener(enchant.Event.EXIT, this._onexit);
    },
    x: {
        get: function() {
            return this._x;
        },
        set: function(x) {
            this._x = x;
            for (var type in this._layers) {
                this._layers[type].x = x;
            }
        }
    },
    y: {
        get: function() {
            return this._y;
        },
        set: function(y) {
            this._y = y;
            for (var type in this._layers) {
                this._layers[type].y = y;
            }
        }
    },
    rotation: {
        get: function() {
            return this._rotation;
        },
        set: function(rotation) {
            this._rotation = rotation;
            for (var type in this._layers) {
                this._layers[type].rotation = rotation;
            }
        }
    },
    scaleX: {
        get: function() {
            return this._scaleX;
        },
        set: function(scaleX) {
            this._scaleX = scaleX;
            for (var type in this._layers) {
                this._layers[type].scaleX = scaleX;
            }
        }
    },
    scaleY: {
        get: function() {
            return this._scaleY;
        },
        set: function(scaleY) {
            this._scaleY = scaleY;
            for (var type in this._layers) {
                this._layers[type].scaleY = scaleY;
            }
        }
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
            this._layerPriority.splice(i, 0, type);
        } else {
            this._element.appendChild(element);
            this._layerPriority.push(type);
        }
        layer.scene = this;
    },
    _onchildadded: function(e) {
        var child = e.node;
        var next = e.next;
        if (next) {
        } else {
        }
    },
    _onchildremoved: function(e) {
        var child = e.node;
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
