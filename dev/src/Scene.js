/**
 * @scope enchant.Scene.prototype
 * @type {*}
 */
enchant.Scene = enchant.Class.create(enchant.Group, {
    /**
     * @name enchant.Scene
     * @class
     [lang:ja]
     * 表示オブジェクトツリーのルートになるクラス.
     * シーンはレイヤーを持っていて、子として追加されたオブジェクト (Entity) は描画方法に応じてレイヤーに振り分けられる。
     * Scene クラスは最も汎用的なシーンの実装で、({@link enchant.DOMLayer} と {@link enchant.CanvasLayer}) を持っており、
     * それぞれ DOM, Canvas を用いて描画される。描画順は DOM が手前、Canvas が奥で、
     * 各レイヤーの間では新しく追加されたオブジェクトほど手前に表示される。
     * Scene クラスを継承することで、新しい種類の Layer を持つシーンクラスを作ることができる。
     [/lang]
     [lang:en]
     * A Class that becomes the root of the display object tree.
     [/lang]
     [lang:de]
     * Eine Klasse die zur Wurzel im Darstellungsobjektbaum wird.
     [/lang]
     *
     * @example
     *   var scene = new Scene();
     *   scene.addChild(player);
     *   scene.addChild(enemy);
     *   core.pushScene(scene);
     *
     * @constructs
     * @extends enchant.Group
     */
    initialize: function() {
        var core = enchant.Core.instance;

        // Call initialize method of enchant.Group
        enchant.Group.call(this);

        // All nodes (entities, groups, scenes) have reference to the scene that it belongs to.
        this.scene = this;

        this._backgroundColor = null;

        // Create div tag which possesses its layers
        this._element = document.createElement('div');
        this._element.style.position = 'absolute';
        this._element.style.overflow = 'hidden';
        this._element.style[enchant.ENV.VENDOR_PREFIX + 'TransformOrigin'] = '0 0';

        this._layers = {};
        this._layerPriority = [];

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

        this.addEventListener(enchant.Event.CORE_RESIZE, this._oncoreresize);

        this._oncoreresize(core);
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
    width: {
        get: function() {
            return this._width;
        },
        set: function(width) {
            this._width = width;
            for (var type in this._layers) {
                this._layers[type].width = width;
            }
        }
    },
    height: {
        get: function() {
            return this._height;
        },
        set: function(height) {
            this._height = height;
            for (var type in this._layers) {
                this._layers[type].height = height;
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
    _oncoreresize: function(e) {
        this._element.style.width = e.width + 'px';
        this.width = e.width;
        this._element.style.height = e.height + 'px';
        this.height = e.height;
        this._element.style[enchant.ENV.VENDOR_PREFIX + 'Transform'] = 'scale(' + e.scale + ')';

        for (var type in this._layers) {
            this._layers[type].dispatchEvent(e);
        }
    },
    addLayer: function(type, i) {
        var core = enchant.Core.instance;
        if (this._layers[type]) {
            return;
        }
        var layer = new enchant[type + 'Layer']();
        if (core.currentScene === this) {
            layer._startRendering();
        }
        this._layers[type] = layer;
        var element = layer._element;
        if (typeof i === 'number') {
            var nextSibling = this._element.childNodes[i];
            if (nextSibling) {
                this._element.insertBefore(element, nextSibling);
            } else {
                this._element.appendChild(element);
            }
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
        var target, i;
        if (child._element) {
            target = 'Dom';
            i = 1;
        } else {
            target = 'Canvas';
            i = 0;
        }
        if (!this._layers[target]) {
            this.addLayer(target, i);
        }
        child._layer = this._layers[target];
        this._layers[target].insertBefore(child, next);
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
        enchant.Core.instance.addEventListener('exitframe', this._dispatchExitframe);
    },
    _onexit: function() {
        for (var type in this._layers) {
            this._layers[type]._stopRendering();
        }
        enchant.Core.instance.removeEventListener('exitframe', this._dispatchExitframe);
    }
});
