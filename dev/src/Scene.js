enchant.Scene = enchant.Class.create(enchant.Group, {
    initialize: function() {
        var game = enchant.Game.instance;
        enchant.Group.call(this);

        this.width = game.width;
        this.height = game.height;

        this.scene = this;

        this._backgroundColor = null;

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

        var that = this;
        this._dispatchExitframe = function() {
            var layer;
            for (var prop in that._layers) {
                layer = that._layers[prop];
                layer.dispatchEvent(new enchant.Event(enchant.Event.EXIT_FRAME));
            }
        };
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
    backgroundColor: {
        get: function() {
            return this._backgroundColor;
        },
        set: function(color) {
            this._backgroundColor = this._element.style.backgroundColor = color;
        }
    },
    addLayer: function(type, i) {
        var game = enchant.Game.instance;
        if (this._layers[type]) {
            return;
        }
        var layer = new enchant[type + 'Layer']();
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
        layer._scene = this;
    },
    _determineEventTarget: function(e) {
        var layer, target;
        for (var i = this._layerPriority.length - 1; i >= 0; i--) {
            layer = this._layers[this._layerPriority[i]];
            target = layer._determineEventTarget(e);
            if (target) {
                break;
            }
        }
        if (!target) {
            target = this;
        }
        return target;
    },
    _onchildadded: function(e) {
        var child = e.node;
        var next = e.next;
        if (child._element) {
            this._layers.Dom.insertBefore(child, next);
            child._layer = this._layers.Dom;
        } else {
            this._layers.Canvas.insertBefore(child, next);
            child._layer = this._layers.Canvas;
        }
        child.parentNode = this;
    },
    _onchildremoved: function(e) {
        var child = e.node;
        child._layer.removeChild(child);
        child._layer = null;
    },
    _onenter: function() {
        for (var type in this._layers) {
            this._layers[type]._startRendering();
        }
        enchant.Game.instance.addEventListener('exitframe', this._dispatchExitframe);
    },
    _onexit: function() {
        for (var type in this._layers) {
            this._layers[type]._stopRendering();
        }
        enchant.Game.instance.removeEventListener('exitframe', this._dispatchExitframe);
    }
});
