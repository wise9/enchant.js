/**
 * @scope enchant.CanvasLayer.prototype
 */
enchant.CanvasLayer = enchant.Class.create(enchant.Group, {
    /**
     * @name enchant.CanvasLayer
     * @class
     [lang:ja]
     * Canvas を用いた描画を行うクラス.
     * 子を Canvas を用いた描画に切り替えるクラス
     [/lang]
     [lang:en]
     * A class which is using HTML Canvas for the rendering.
     * The rendering of children will be replaced by the Canvas rendering.
     [/lang]
     [lang:de]
     * Eine Klasse die HTML Canvas für das Rendern nutzt.
     * Das Rendern der Kinder wird durch das Canvas Rendering ersetzt.
     [/lang]
     * @constructs
     */
    initialize: function() {
        var core = enchant.Core.instance;

        enchant.Group.call(this);

        this._cvsCache = {
            matrix: [1, 0, 0, 1, 0, 0],
            detectColor: '#000000'
        };
        this._cvsCache.layer = this;

        this.width = core.width;
        this.height = core.height;

        this._element = document.createElement('canvas');
        this._element.width = core.width;
        this._element.height = core.height;
        this._element.style.position = 'absolute';

        this._detect = document.createElement('canvas');
        this._detect.width = core.width;
        this._detect.height = core.height;
        this._detect.style.position = 'absolute';
        this._lastDetected = 0;

        this.context = this._element.getContext('2d');
        this._dctx = this._detect.getContext('2d');

        this._colorManager = new enchant.DetectColorManager(16, 256);

        var touch = [
            enchant.Event.TOUCH_START,
            enchant.Event.TOUCH_MOVE,
            enchant.Event.TOUCH_END
        ];

        touch.forEach(function(type) {
            this.addEventListener(type, function(e) {
                if (this._scene) {
                    this._scene.dispatchEvent(e);
                }
            });
        }, this);

        var __onchildadded = function(e) {
            var child = e.node;
            var self = e.target;
            var layer;
            if (self instanceof enchant.CanvasLayer) {
                layer = self._scene._layers.Canvas;
            } else {
                layer = self.scene._layers.Canvas;
            }
            enchant.CanvasLayer._attachCache(child, layer, __onchildadded, __onchildremoved);
            var render = new enchant.Event(enchant.Event.RENDER);
            if (self._dirty) {
                self._updateCoordinate();
            }
            child._dirty = true;
            enchant.Matrix.instance.stack.push(self._matrix);
            layer._rendering(child, render);
            enchant.Matrix.instance.stack.pop(self._matrix);
        };

        var __onchildremoved = function(e) {
            var child = e.node;
            var self = e.target;
            var layer;
            if (self instanceof enchant.CanvasLayer) {
                layer = self._scene._layers.Canvas;
            } else {
                layer = self.scene._layers.Canvas;
            }
            enchant.CanvasLayer._detachCache(child, layer, __onchildadded, __onchildremoved);
        };

        this.addEventListener('childremoved', __onchildremoved);
        this.addEventListener('childadded', __onchildadded);

    },
    /**
     * [lang:ja]
     * レンダリングを開始.
     * [/lang]
     * @private
     */
    _startRendering: function() {
        this.addEventListener('exitframe', this._onexitframe);
        this._onexitframe(new enchant.Event(enchant.Event.RENDER));
    },
    /**
     * [lang:ja]
     * レンダリングを停止.
     * [/lang]
     * @private
     */
    _stopRendering: function() {
        this.removeEventListener('render', this._onexitframe);
        this._onexitframe(new enchant.Event(enchant.Event.RENDER));
    },
    _onexitframe: function() {
        var core = enchant.Core.instance;
        var ctx = this.context;
        ctx.clearRect(0, 0, core.width, core.height);
        var render = new enchant.Event(enchant.Event.RENDER);
        this._rendering(this, render);
    },
    _rendering:  function(node, e) {
        var core = enchant.Core.instance;
        var matrix = enchant.Matrix.instance;
        var stack = matrix.stack;
        var width = node.width;
        var height = node.height;
        var ctx = this.context;
        var child;
        ctx.save();
        node.dispatchEvent(e);
        // composite
        if (node.compositeOperation) {
            ctx.globalCompositeOperation = node.compositeOperation;
        } else {
            ctx.globalCompositeOperation = 'source-over';
        }
        ctx.globalAlpha = (typeof node._opacity === 'number') ? node._opacity : 1.0;
        // transform
        this._transform(node, ctx);
        // render
        if (typeof node._visible === 'undefined' || node._visible) {
            if (node._backgroundColor) {
                ctx.fillStyle = node._backgroundColor;
                ctx.fillRect(0, 0, width, height);
            }

            if (node.cvsRender) {
                node.cvsRender(ctx);
            }

            if (core._debug) {
                if (node instanceof enchant.Label || node instanceof enchant.Sprite) {
                    ctx.strokeStyle = '#ff0000';
                } else {
                    ctx.strokeStyle = '#0000ff';
                }
                ctx.strokeRect(0, 0, width, height);
            }
            if (node._clipping) {
                ctx.beginPath();
                ctx.rect(0, 0, width, height);
                ctx.clip();
            }
        }
        if (node.childNodes) {
            for (var i = 0, l = node.childNodes.length; i < l; i++) {
                child = node.childNodes[i];
                this._rendering(child, e);
            }
        }
        ctx.restore();
        enchant.Matrix.instance.stack.pop();
    },
    _detectrendering: function(node) {
        var width = node.width;
        var height = node.height;
        var ctx = this._dctx;
        var child;
        ctx.save();
        this._transform(node, ctx);
        ctx.fillStyle = node._cvsCache.detectColor;
        if (node._touchEnabled) {
            if (node.detectRender) {
                node.detectRender(ctx);
            } else {
                ctx.fillRect(0, 0, width, height);
            }
        }
        if (node._clipping) {
            ctx.rect(0, 0, width, height);
            ctx.clip();
        }
        if (node.childNodes) {
            for (var i = 0, l = node.childNodes.length; i < l; i++) {
                child = node.childNodes[i];
                this._detectrendering(child);
            }
        }
        ctx.restore();
        enchant.Matrix.instance.stack.pop();
    },
    _transform: function(node, ctx) {
        var matrix = enchant.Matrix.instance;
        var stack = matrix.stack;
        var newmat;
        if (node._dirty) {
            matrix.makeTransformMatrix(node, node._cvsCache.matrix);
            newmat = [];
            matrix.multiply(stack[stack.length - 1], node._cvsCache.matrix, newmat);
            node._matrix = newmat;
        } else {
            newmat = node._matrix;
        }
        stack.push(newmat);
        ctx.setTransform.apply(ctx, newmat);
        var ox = (typeof node._originX === 'number') ? node._originX : node._width / 2 || 0;
        var oy = (typeof node._originY === 'number') ? node._originY : node._height / 2 || 0;
        var vec = [ ox, oy ];
        matrix.multiplyVec(newmat, vec, vec);
        node._offsetX = vec[0] - ox;
        node._offsetY = vec[1] - oy;
        node._dirty = false;

    },
    _determineEventTarget: function(e) {
        return this._getEntityByPosition(e.x, e.y);
    },
    _getEntityByPosition: function(x, y) {
        var core = enchant.Core.instance;
        var ctx = this._dctx;
        if (this._lastDetected < core.frame) {
            ctx.clearRect(0, 0, this.width, this.height);
            this._detectrendering(this);
            this._lastDetected = core.frame;
        }
        var color = ctx.getImageData(x, y, 1, 1).data;
        return this._colorManager.getSpriteByColor(color);
    }
});

enchant.CanvasLayer._attachCache = function(node, layer, onchildadded, onchildremoved) {
    var child;
    if (!node._cvsCache) {
        node._cvsCache = {};
        node._cvsCache.matrix = [ 1, 0, 0, 1, 0, 0 ];
        node._cvsCache.detectColor = 'rgba(' + layer._colorManager.attachDetectColor(node) + ')';
        node.addEventListener('childadded', onchildadded);
        node.addEventListener('childremoved', onchildremoved);
    }
    if (node.childNodes) {
        for (var i = 0, l = node.childNodes.length; i < l; i++) {
            child = node.childNodes[i];
            enchant.CanvasLayer._attachCache(child, layer, onchildadded, onchildremoved);
        }
    }
};

enchant.CanvasLayer._detachCache = function(node, layer, onchildadded, onchildremoved) {
    var child;
    if (node._cvsCache) {
        layer._colorManager.detachDetectColor(node);
        node.removeEventListener('childadded', onchildadded);
        node.removeEventListener('childremoved', onchildremoved);
        delete node._cvsCache;
    }
    if (node.childNodes) {
        for (var i = 0, l = node.childNodes.length; i < l; i++) {
            child = node.childNodes[i];
            enchant.CanvasLayer._detachCache(child, layer, onchildadded, onchildremoved);
        }
    }
};
