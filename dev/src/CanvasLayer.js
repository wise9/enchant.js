/**
 * @scope enchant.CanvasGroup.prototype
 */
enchant.CanvasLayer = enchant.Class.create(enchant.Group, {
    /**
     [lang:ja]
     * Canvas を用いた描画を行うクラス。
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
        var game = enchant.Game.instance;
        var that = this;

        enchant.Group.call(this);

        this._cvsCache = {
            matrix: [1, 0, 0, 1, 0, 0],
            detectColor: '#000000'
        };

        this.width = game.width;
        this.height = game.height;

        this._element = document.createElement('canvas');
        this._element.width = game.width;
        this._element.height = game.height;
        this._element.style.position = 'absolute';

        this._detect = document.createElement('canvas');
        this._detect.width = game.width;
        this._detect.height = game.height;
        this._detect.style.position = 'absolute';
        this._lastDetected = 0;

        this.context = this._element.getContext('2d');
        this._dctx = this._detect.getContext('2d');

        this._colorManager = new enchant.DetectColorManager(16, 256);

        this.addEventListener('enter', this._startRendering);
        this.addEventListener('exit', this._stopRendering);

        var touch = [
            enchant.Event.TOUCH_START,
            enchant.Event.TOUCH_MOVE,
            enchant.Event.TOUCH_END
        ];

        touch.forEach(function(type) {
            this.addEventListener(type, function(e) {
                if (this.scene) {
                    this.scene.dispatchEvent(e);
                }
            });
        }, this);

        var __onchildadded = function(e) {
            var child = e.node;
            if (child.childNodes) {
                child.addEventListener('childadded', __onchildadded);
                child.addEventListener('childremoved', __onchildremoved);
            }
            enchant.CanvasLayer._attachCache(child, that._colorManager);
            that._rendering(child);
        };

        var __onchildremoved = function(e) {
            var child = e.node;
            if (child.childNodes) {
                child.removeEventListener('childadded', __onchildadded);
                child.removeEventListener('childremoved', __onchildremoved);
            }
            enchant.CanvasLayer._detachCache(child, that._colorManager);
        };

        this.addEventListener('childremoved', __onchildremoved);
        this.addEventListener('childadded', __onchildadded);

        this._onexitframe = function() {
            var ctx = that.context;
            ctx.clearRect(0, 0, game.width, game.height);
            that._rendering(that);
        };
    },
    /**
     * レンダリングを開始.
     * @private
     */
    _startRendering: function() {
        var game = enchant.Game.instance;
        if (!game._listeners['exitframe']) {
            game._listeners['exitframe'] = [];
        }
        game._listeners['exitframe'].push(this._onexitframe);

    },
    /**
     * レンダリングを停止.
     * @private
     */
    _stopRendering: function() {
        var game = enchant.Game.instance;
        game.removeEventListener('exitframe', this._onexitframe);
    },
    _rendering:  function(node) {
        var game = enchant.Game.instance;
        var matrix = enchant.Matrix.instance;
        var stack = matrix.stack;
        var ctx = this.context;
        var child;
        ctx.save();
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
                ctx.fillRect(0, 0, node._width, node._height);
            }

            if (node.cvsRender) {
                node.cvsRender(ctx);
            }

            if (game._debug) {
                if (node instanceof enchant.Label || node instanceof enchant.Sprite) {
                    ctx.strokeStyle = '#ff0000';
                } else {
                    ctx.strokeStyle = '#0000ff';
                }
                ctx.strokeRect(0, 0, node._width, node._height);
            }
            if (node._clipping) {
                ctx.clip();
            }
        }
        if (node.childNodes) {
            for (var i = 0, l = node.childNodes.length; i < l; i++) {
                child = node.childNodes[i];
                this._rendering(child);
            }
        }
        ctx.restore();
        enchant.Matrix.instance.stack.pop();
    },
    _detectrendering: function(node) {
        var ctx = this._dctx;
        var child;
        ctx.save();
        this._transform(node, ctx);
        ctx.fillStyle = node._cvsCache.detectColor;
        ctx.fillRect(0, 0, node.width, node.height);
        if (node._clipping) {
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
        // TODO calc position offset
        return this._getEntityByPosition(e.x, e.y);
    },
    _getEntityByPosition: function(x, y) {
        var game = enchant.Game.instance;
        var ctx = this._dctx;
        if (this._lastDetected < game.frame) {
            ctx.clearRect(0, 0, this.width, this.height);
            this._detectrendering(this);
            this._lastDetected = game.frame;
        }
        var color = ctx.getImageData(x, y, 1, 1).data;
        return this._colorManager.getSpriteByColor(color);
    }
});

enchant.DetectColorManager = enchant.Class.create({
    initialize: function(reso, max) {
        this.reference = [];
        this.detectColorNum = 0;
        this.colorResolution = reso || 16;
        this.max = max || 1;
    },
    attachDetectColor: function(sprite) {
        this.detectColorNum += 1;
        this.reference[this.detectColorNum] = sprite;
        return this._createNewColor();
    },
    detachDetectColor: function(sprite) {
        var i = this.reference.indexOf(sprite);
        if (i !== -1) {
            this.reference[i] = null;
        }
    },
    _createNewColor: function() {
        var n = this.detectColorNum;
        var C = this.colorResolution;
        var d = C / this.max;
        return [
            parseInt((n / C / C) % C, 10) / d,
            parseInt((n / C) % C, 10) / d,
            parseInt(n % C, 10) / d, 1.0
        ];
    },
    _decodeDetectColor: function(color) {
        var C = this.colorResolution;
        return ~~(color[0] * C * C * C / 256) +
            ~~(color[1] * C * C / 256) +
            ~~(color[2] * C / 256);
    },
    getSpriteByColor: function(color) {
        return this.reference[this._decodeDetectColor(color)];
    }
});

enchant.CanvasLayer._attachCache = function(node, colorManager) {
    var child;
    if (!node._cvsCache) {
        node._cvsCache = {};
        node._cvsCache.matrix = [ 1, 0, 0, 1, 0, 0 ];
        node._cvsCache.detectColor = 'rgba(' + colorManager.attachDetectColor(node) + ')';
    }
    if (node.childNodes) {
        for (var i = 0, l = node.childNodes.length; i < l; i++) {
            child = node.childNodes[i];
            enchant.CanvasLayer._attachCache(child, colorManager);
        }
    }
};

enchant.CanvasLayer._detachCache = function(node, colorManager) {
    var child;
    if (node._cvsCache) {
        colorManager.detachDetectColor(node);
        delete node._cvsCache;
    }
    if (node.childNodes) {
        for (var i = 0, l = node.childNodes.length; i < l; i++) {
            child = node.childNodes[i];
            enchant.CanvasLayer._detachCache(child, colorManager);
        }
    }
};
