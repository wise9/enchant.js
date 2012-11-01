(function() {
    /**
     * @scope enchant.CanvasGroup.prototype
     */
    enchant.CanvasGroup = enchant.Class.create(enchant.Group, {
        /**
         [lang:ja]
         * Canvas を用いた描画を行うクラス。
         * 子を Canvas を用いた描画に切り替えるクラス
         [/lang]
         [lang:en]
         [/lang]
         * @constructs
         */
        initialize: function() {
            var game = enchant.Game.instance;
            var that = this;
            enchant.Group.call(this);
            this._dirty = false;
            this._rotation = 0;

            this._cvsCache = {
                matrix: [1, 0, 0, 1, 0, 0],
                detectColor: '#0000000'
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

            this.context = this._element.getContext('2d');
            this._dctx = this._detect.getContext('2d');

            this._colorManager = new DetectColorManager(16, 256);

            if (enchant.ENV.TOUCH_ENABLED) {
                this._element.addEventListener('touchstart', function(e) {
                    var touches = e.touches;
                    for (var i = 0, len = touches.length; i < len; i++) {
                        e = new enchant.Event('touchstart');
                        e.identifier = touches[i].identifier;
                        e._initPosition(touches[i].pageX, touches[i].pageY);
                        _touchstartFromDom.call(that, e);
                    }
                }, false);
                this._element.addEventListener('touchmove', function(e) {
                    var touches = e.touches;
                    for (var i = 0, len = touches.length; i < len; i++) {
                        e = new enchant.Event('touchmove');
                        e.identifier = touches[i].identifier;
                        e._initPosition(touches[i].pageX, touches[i].pageY);
                        _touchmoveFromDom.call(that, e);
                    }
                }, false);
                this._element.addEventListener('touchend', function(e) {
                    var touches = e.changedTouches;
                    for (var i = 0, len = touches.length; i < len; i++) {
                        e = new enchant.Event('touchend');
                        e.identifier = touches[i].identifier;
                        e._initPosition(touches[i].pageX, touches[i].pageY);
                        _touchendFromDom.call(that, e);
                    }
                }, false);
            }
            this._element.addEventListener('mousedown', function(e) {
                var x = e.pageX;
                var y = e.pageY;
                e = new enchant.Event('touchstart');
                e.identifier = game._mousedownID;
                e._initPosition(x, y);
                _touchstartFromDom.call(that, e);
                that._mousedown = true;
            }, false);
            game._element.addEventListener('mousemove', function(e) {
                if (!that._mousedown) {
                    return;
                }
                var x = e.pageX;
                var y = e.pageY;
                e = new enchant.Event('touchmove');
                e.identifier = game._mousedownID;
                e._initPosition(x, y);
                _touchmoveFromDom.call(that, e);
            }, false);
            game._element.addEventListener('mouseup', function(e) {
                if (!that._mousedown) {
                    return;
                }
                var x = e.pageX;
                var y = e.pageY;
                e = new enchant.Event('touchend');
                e.identifier = game._mousedownID;
                e._initPosition(x, y);
                _touchendFromDom.call(that, e);
                that._mousedown = false;
            }, false);

            var start = [
                enchant.Event.ENTER,
                enchant.Event.ADDED_TO_SCENE
            ];
            var end = [
                enchant.Event.EXIT,
                enchant.Event.REMOVED_FROM_SCENE
            ];
            start.forEach(function(type) {
                this.addEventListener(type, this._startRendering);
                this.addEventListener(type, function() {
                    canvasGroupInstances.push(this);
                });
            }, this);
            end.forEach(function(type) {
                this.addEventListener(type, this._stopRendering);
                this.addEventListener(type, function() {
                    var i = canvasGroupInstances.indexOf(this);
                    if (i !== -1) {
                        canvasGroupInstances.splice(i, 1);
                    }
                });
            }, this);

            this._onexitframe = function() {
                var ctx = that.context;
                ctx.clearRect(0, 0, game.width, game.height);
                checkCache.call(that, that._colorManager);
                rendering.call(that, ctx);
            };
        },
        _startRendering: function() {
            var game = enchant.Game.instance;
            if (!game._listeners['exitframe']) {
                game._listeners['exitframe'] = [];
            }
            game._listeners['exitframe'].push(this._onexitframe);
        },
        _stopRendering: function() {
            var game = enchant.Game.instance;
            game.removeEventListener('exitframe', this._onexitframe);
        },
        _getEntityByPosition: function(x, y) {
            var ctx = this._dctx;
            ctx.clearRect(0, 0, this.width, this.height);
            detectrendering.call(this, ctx);
            var color = ctx.getImageData(x, y, 1, 1).data;
            return this._colorManager.getSpriteByColor(color);
        },
        _touchstartPropagation: function(e) {
            var sp = this._getEntityByPosition(e.x, e.y);
            if (sp) {
                this._touching = sp;
                propagationUp.call(this._touching, e, this.parentNode);
            } else {
                sp = null;
            }
            return sp;
        },
        _touchmovePropagation: function(e) {
            if (this._touching != null) {
                propagationUp.call(this._touching, e, this.parentNode);
            }
        },
        _touchendPropagation: function(e) {
            if (this._touching != null) {
                propagationUp.call(this._touching, e, this.parentNode);
                this._touching = null;
            }
        },
        /**
         * rotation of group
         * @see enchant.CanvasGroup.originX
         * @see enchant.CanvasGroup.originY
         * @type {Number}
         */
        rotation: {
            get: function() {
                return this._rotation;
            },
            set: function(rot) {
                this._rotation = rot;
                this._dirty = true;
            }
        },
        /**
         * scaling of group in the direction of x axis
         * @see enchant.CanvasGroup.originX
         * @see enchant.CanvasGroup.originY
         * @type {Number}
         */
        scaleX: {
            get: function() {
                return this._scaleX;
            },
            set: function(scale) {
                this._scaleX = scale;
                this._dirty = true;
            }
        },
        /**
         * scaling of group in the direction of y axis
         * @see enchant.CanvasGroup.originX
         * @see enchant.CanvasGroup.originY
         * @type {Number}
         */
        scaleY: {
            get: function() {
                return this._scaleY;
            },
            set: function(scale) {
                this._scaleY = scale;
                this._dirty = true;
            }
        },
        addChild: function(node) {
            this.childNodes.push(node);
            node.parentNode = this;
            node.dispatchEvent(new enchant.Event('added'));
            if (this.scene) {
                node.scene = this.scene;
                var e = new enchant.Event('addedtoscene');
                _onaddedtoscene.call(node, e, this._colorManager);
            }
        },
        insertBefore: function(node, reference) {
            var i = this.childNodes.indexOf(reference);
            if (i !== -1) {
                this.childNodes.splice(i, 0, node);
                node.parentNode = this;
                node.dispatchEvent(new enchant.Event('added'));
                if (this.scene) {
                    node.scene = this.scene;
                    var e = new enchant.Event('addedtoscene');
                    _onaddedtoscene.call(node, e, this._colorManager);
                }
            } else {
                this.addChild(node);
            }
        },
        removeChild: function(node) {
            var i;
            if ((i = this.childNodes.indexOf(node)) !== -1) {
                this.childNodes.splice(i, 1);
            }
            node.parentNode = null;
            node.dispatchEvent(new enchant.Event('removed'));
            if (this.scene) {
                node.scene = null;
                var e = new enchant.Event('removedfromscene');
                _onremovedfromscene.call(node, e, this._colorManager);
            }
        }
    });

    var RENDER_OFFSET = 0;
    var canvasGroupInstances = [];
    var touchingEntity = null;
    var touchingGroup = null;
    var _touchstartFromDom = function(e) {
        var game = enchant.Game.instance;
        var group;
        for (var i = canvasGroupInstances.length - 1; i >= 0; i--) {
            group = canvasGroupInstances[i];
            if (group.scene !== game.currentScene) {
                continue;
            }
            var sp = group._touchstartPropagation(e);
            if (sp) {
                touchingEntity = sp;
                touchingGroup = group;
                return;
            }
        }
    };
    var _touchmoveFromDom = function(e) {
        if (touchingGroup != null) {
            touchingGroup._touchmovePropagation(e);
        }
    };
    var _touchendFromDom = function(e) {
        if (touchingGroup != null) {
            touchingGroup._touchendPropagation(e);
            touchingEntity = null;
            touchingGroup = null;
        }
    };

    enchant.Map.prototype.cvsRender = function(ctx) {
        var game = enchant.Game.instance;
        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        var cvs = this._element.firstChild;
        ctx.drawImage(cvs, 0, 0, game.width, game.height);
        ctx.restore();
    };

    enchant.Sprite.prototype.cvsRender = function(ctx) {
        var img, imgdata, row, frame;
        var sx, sy, sw, sh;
        if (this._image) {
            frame = Math.abs(this._frame) || 0;
            img = this._image;
            imgdata = img._element;
            row = img.width / this._width | 0;
            sx = (frame % row | 0) * this._width;
            sy = (frame / row | 0) * this._height % img.height;
            sy = Math.min(sy, img.height - this._height);
            sw = Math.min(img.width - sx, this._width);
            sh = Math.min(img.height - sy, this._height);
            ctx.drawImage(imgdata, sx, sy, sw, sh, RENDER_OFFSET, RENDER_OFFSET, this._width + RENDER_OFFSET, this._height + RENDER_OFFSET);
        }
    };

    enchant.Label.prototype.cvsRender = function(ctx) {
        if (this.text) {
            ctx.textBaseline = 'top';
            ctx.font = this.font;
            ctx.fillStyle = this.color || '#000000';
            ctx.fillText(this.text, RENDER_OFFSET, RENDER_OFFSET, this.width + RENDER_OFFSET);
        }
    };

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

    var makeTransformMatrix = function(node, dest) {
        var x = node.x;
        var y = node.y;
        var width = node.width || 0;
        var height = node.height || 0;
        var rotation = node.rotation || 0;
        var scaleX = (typeof node.scaleX === 'number') ? node.scaleX : 1;
        var scaleY = (typeof node.scaleY === 'number') ? node.scaleY : 1;
        var theta = Math.PI * rotation / 180;
        var tmpcos = Math.cos(theta);
        var tmpsin = Math.sin(theta);
        var w = (typeof node.originX === 'number') ? node.originX : width / 2;
        var h = (typeof node.originY === 'number') ? node.originY : height / 2;
        var a = scaleX * tmpcos;
        var b = scaleX * tmpsin;
        var c = scaleY * tmpsin;
        var d = scaleY * tmpcos;
        dest[0] = scaleX * tmpcos;
        dest[1] = scaleX * tmpsin;
        dest[2] = -scaleY * tmpsin;
        dest[3] = scaleY * tmpcos;
        dest[4] = (-a * w + c * h + x + w);
        dest[5] = (-b * w - d * h + y + h);
    };

    var dirtyCheck = function(node) {
        if (node.__dirty ||
            node._cvsCache.x !== node.x ||
            node._cvsCache.y !== node.y ||
            node._cvsCache.width !== node.width ||
            node._cvsCache.height !== node.height
            ) {
            makeTransformMatrix(node, node._cvsCache.matrix);
            node.__dirty = false;
            node._cvsCache.x = node.x;
            node._cvsCache.y = node.y;
            node._cvsCache.width = node.width;
            node._cvsCache.height = node.height;
        }
    };

    var alpha = function(ctx, node) {
        if (node.alphaBlending) {
            ctx.globalCompositeOperation = node.alphaBlending;
        } else {
            ctx.globalCompositeOperation = 'source-over';
        }
        ctx.globalAlpha = (typeof node.opacity === 'number') ? node.opacity : 1.0;
    };

    var transform = function(ctx, node) {
        dirtyCheck(node);
        ctx.transform.apply(ctx, node._cvsCache.matrix);
    };

    var render = function(ctx, node) {
        var game = enchant.Game.instance;
        if (typeof node.visible !== 'undefined' && !node.visible) {
            return;
        }
        if (node.backgroundColor) {
            ctx.fillStyle = node.backgroundColor;
            ctx.fillRect(RENDER_OFFSET, RENDER_OFFSET, node.width + RENDER_OFFSET, node.height + RENDER_OFFSET);
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
            ctx.strokeRect(RENDER_OFFSET, RENDER_OFFSET, node.width + RENDER_OFFSET, node.height + RENDER_OFFSET);
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
        }
    );

    var array2hexrgb = function(arr) {
        return '#' + ("00" + Number(parseInt(arr[0], 10)).toString(16)).slice(-2) +
            ("00" + Number(parseInt(arr[1], 10)).toString(16)).slice(-2) +
            ("00" + Number(parseInt(arr[2], 10)).toString(16)).slice(-2);
    };

    var detectrender = function(ctx, node) {
        ctx.fillStyle = node._cvsCache.detectColor;
        ctx.fillRect(0, 0, node.width, node.height);
    };

    var detectrendering = nodesWalker(
        function(ctx) {
            ctx.save();
            transform(ctx, this);
            detectrender(ctx, this);
        },
        function(ctx) {
            ctx.restore();
        }
    );

    var is__dirty = function() {
        if (this._dirty) {
            this.__dirty = true;
        } else {
            this.__dirty = false;
        }
    };

    var attachCache = function(colorManager) {
        if (this._cvsCache) {
            return;
        }
        this.addEventListener('render', is__dirty);
        this._cvsCache = {};
        this._cvsCache.matrix = [];
        this._cvsCache.detectColor = array2hexrgb(colorManager.attachDetectColor(this));
    };

    var detachCache = function(colorManager) {
        if (!this._cvsCache) {
            return;
        }
        this.removeEventListener('render', is__dirty);
        colorManager.detachDetectColor(this);
        delete this._cvsCache;
    };

    var checkCache = nodesWalker(
        function(colorManager) {
            attachCache.call(this, colorManager);
        }
    );

    var _onaddedtoscene = nodesWalker(
        function(e, colorManager) {
            this.dispatchEvent(e);
            attachCache.call(this, colorManager);
        }
    );

    var _onremovedfromscene = nodesWalker(
        function(e, colorManager) {
            this.dispatchEvent(e);
            detachCache.call(this, colorManager);
        }
    );

    var propagationDown = nodesWalker(
        function(e) {
            this.dispatchEvent(e);
        }
    );

    var propagationUp = function(e, end) {
        this.dispatchEvent(e);
        if (this.parentNode && this.parentNode !== end) {
            propagationUp.call(this.parentNode, e, end);
        }
    };
}());
