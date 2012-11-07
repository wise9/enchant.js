(function() {
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

            this._colorManager = new DetectColorManager(16, 256);

            var start = [
                enchant.Event.ENTER,
                enchant.Event.ADDED_TO_SCENE
            ];
            var end = [
                enchant.Event.EXIT,
                enchant.Event.REMOVED_FROM_SCENE
            ];
            var touch = [
                enchant.Event.TOUCH_START,
                enchant.Event.TOUCH_MOVE,
                enchant.Event.TOUCH_END
            ];

            start.forEach(function(type) {
                this.addEventListener(type, this._startRendering);
            }, this);
            end.forEach(function(type) {
                this.addEventListener(type, this._stopRendering);
            }, this);
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
                attachCache.call(child, that._colorManager);
                rendering.call(child, that.context);
            };

            var __onchildremoved = function(e) {
                var child = e.node;
                if (child.childNodes) {
                    child.removeEventListener('childadded', __onchildadded);
                    child.removeEventListener('childremoved', __onchildremoved);
                }
                detachCache.call(child, that._colorManager);
            };

            this.addEventListener('childremoved', __onchildremoved);
            this.addEventListener('childadded', __onchildadded);

            this._onexitframe = function() {
                var ctx = that.context;
                ctx.clearRect(0, 0, game.width, game.height);
                rendering.call(that, ctx);
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
        _determineEventTarget: function(e) {
            // TODO calc position offset
            return this._getEntityByPosition(e.x, e.y);
        },
        _getEntityByPosition: function(x, y) {
            var game = enchant.Game.instance;
            var ctx = this._dctx;
            if (this._lastDetected < game.frame) {
                ctx.clearRect(0, 0, this.width, this.height);
                detectrendering.call(this, ctx);
                this._lastDetected = game.frame;
            }
            var color = ctx.getImageData(x, y, 1, 1).data;
            return this._colorManager.getSpriteByColor(color);
        }
    });

    var DetectColorManager = enchant.Class.create({
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

    var nodesWalker = function(pre, post) {
        pre = pre || function() {
        };
        post = post || function() {
        };
        var walker = function() {
            pre.apply(this, arguments);
            var child;
            if (this.childNodes) {
                for (var i = 0, l = this.childNodes.length; i < l; i++) {
                    child = this.childNodes[i];
                    walker.apply(child, arguments);
                }
            }
            post.apply(this, arguments);
        };
        return walker;
    };

    var alpha = function(ctx, node) {
        if (node.compositeOperation) {
            ctx.globalCompositeOperation = node.compositeOperation;
        } else {
            ctx.globalCompositeOperation = 'source-over';
        }
        ctx.globalAlpha = (typeof node.opacity === 'number') ? node.opacity : 1.0;
    };


    var _transform = function(mat) {
        var matrix = enchant.Matrix.instance;
        var stack = matrix.stack;
        var newmat = [];
        matrix.multiply(stack[stack.length - 1], mat, newmat);
        stack.push(newmat);
    };

    var transform = function(ctx, node) {
        var matrix = enchant.Matrix.instance;
        var stack = matrix.stack;
        if (node._dirty) {
            matrix.makeTransformMatrix(node, node._cvsCache.matrix);
        }
        _transform(node._cvsCache.matrix);
        var mat = stack[stack.length - 1];
        ctx.setTransform.apply(ctx, mat);
        var ox = (typeof node._originX === 'number') ? node._originX : node._width / 2 || 0;
        var oy = (typeof node._originY === 'number') ? node._originY : node._height / 2 || 0;
        var vec = [ ox, oy ];
        matrix.multiplyVec(mat, vec, vec);
        node._offsetX = vec[0] - ox;
        node._offsetY = vec[1] - oy;
        node._dirty = false;
    };

    var render = function(ctx, node) {
        var game = enchant.Game.instance;
        if (typeof node.visible !== 'undefined' && !node.visible) {
            return;
        }
        if (node.backgroundColor) {
            ctx.fillStyle = node.backgroundColor;
            ctx.fillRect(0, 0, node.width, node.height);
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
            ctx.strokeRect(0, 0, node.width, node.height);
        }
        if (node._clipping) {
            ctx.clip();
        }
    };

    var rendering = nodesWalker(
        function(ctx) {
            ctx.save();
            alpha(ctx, this);
            transform(ctx, this);
            render(ctx, this);
        },
        function(ctx) {
            ctx.restore();
            enchant.Matrix.instance.stack.pop();
        }
    );

    var detectrender = function(ctx, node) {
        ctx.fillStyle = node._cvsCache.detectColor;
        ctx.fillRect(0, 0, node.width, node.height);
        if (node._clipping) {
            ctx.clip();
        }
    };

    var detectrendering = nodesWalker(
        function(ctx) {
            ctx.save();
            transform(ctx, this);
            detectrender(ctx, this);
        },
        function(ctx) {
            ctx.restore();
            enchant.Matrix.instance.stack.pop();
        }
    );

    var attachCache = nodesWalker(
        function(colorManager) {
            if (!this._cvsCache) {
                this._cvsCache = {};
                this._cvsCache.matrix = [ 1, 0, 0, 1, 0, 0 ];
                this._cvsCache.detectColor = 'rgba(' + colorManager.attachDetectColor(this) + ')';
            }
        }
    );

    var detachCache = nodesWalker(
        function(colorManager) {
            if (this._cvsCache) {
                colorManager.detachDetectColor(this);
                delete this._cvsCache;
            }
        }
    );
}());
