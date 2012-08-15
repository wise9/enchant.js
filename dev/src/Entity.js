/**
 [lang:ja]
 * @scope enchant.Entity.prototype
 [/lang]
 [lang:en]
 * @scope enchant.Entity.prototype
 [/lang]
 */
enchant.Entity = enchant.Class.create(enchant.Node, {
    /**
     [lang:ja]
     * DOM上で表示する実体を持ったクラス.直接使用することはない.
     * @constructs
     * @extends enchant.Node
     [/lang]
     [lang:en]
     * A class with objects displayed on DOM. Not used directly.
     * @constructs
     * @extends enchant.Node
     [/lang]
     */
    initialize: function() {
        var game = enchant.Game.instance;
        enchant.Node.call(this);

        this._element = document.createElement('div');
        this._style = this._element.style;
        this._style.position = 'absolute';

        this._width = 0;
        this._height = 0;
        this._backgroundColor = null;
        this._opacity = 1;
        this._visible = true;
        this._buttonMode = null;

        if (enchant.Game.instance._debug) {
            this._style.border = "1px solid blue";
            this._style.margin = "-1px";
        }

        /**
         [lang:ja]
         * Entityにボタンの機能を設定する.
         * Entityに対するタッチ, クリックをleft, right, up, down, a, bいずれかの
         * ボタン入力として割り当てる.
         * @type {String}
         [/lang]
         [lang:en]
         * Set button function to Entity.
         * Apply touch, click to left, right, up, down, a, b
         * for button input for Entity.
         * @type {String}
         [/lang]
         */
        this.buttonMode = null;
        /**
         [lang:ja]
         * Entityが押されているかどうか.
         * buttonModeが設定されているときだけ機能する.
         * @type {Boolean}
         [/lang]
         [lang:en]
         * Checks if Entity is being pushed.
         * Only functions when buttonMode is set.
         * @type {Boolean}
         [/lang]
         */
        this.buttonPressed = false;
        this.addEventListener('touchstart', function() {
            if (!this.buttonMode){
                return;
            }
            this.buttonPressed = true;
            var e = new enchant.Event(this.buttonMode + 'buttondown');
            this.dispatchEvent(e);
            game.dispatchEvent(e);
        });
        this.addEventListener('touchend', function() {
            if (!this.buttonMode){
                return;
            }
            this.buttonPressed = false;
            var e = new enchant.Event(this.buttonMode + 'buttonup');
            this.dispatchEvent(e);
            game.dispatchEvent(e);
        });

        var that = this;
        var render = function() {
            that.dispatchEvent(new enchant.Event('render'));
        };
        this.addEventListener('addedtoscene', function() {
            render();
            game.addEventListener('exitframe', render);
        });
        this.addEventListener('removedfromscene', function() {
            game.removeEventListener('exitframe', render);
        });
        this.addEventListener('render', function() {
            if (this._offsetX !== this._previousOffsetX) {
                this._style.left = this._offsetX + 'px';
                /**
                 * @TODO transform-left で移動するやつをためす
                 */
            }
            if (this._offsetY !== this._previousOffsetY) {
                this._style.top = this._offsetY + 'px';
            }
            this._previousOffsetX = this._offsetX;
            this._previousOffsetY = this._offsetY;
        });

        if (enchant.ENV.TOUCH_ENABLED) {
            this._element.addEventListener('touchstart', function(e) {
                var touches = e.touches;
                for (var i = 0, len = touches.length; i < len; i++) {
                    e = new enchant.Event('touchstart');
                    e.identifier = touches[i].identifier;
                    e._initPosition(touches[i].pageX, touches[i].pageY);
                    that.dispatchEvent(e);
                }
            }, false);
            this._element.addEventListener('touchmove', function(e) {
                var touches = e.touches;
                for (var i = 0, len = touches.length; i < len; i++) {
                    e = new enchant.Event('touchmove');
                    e.identifier = touches[i].identifier;
                    e._initPosition(touches[i].pageX, touches[i].pageY);
                    that.dispatchEvent(e);
                }
            }, false);
            this._element.addEventListener('touchend', function(e) {
                var touches = e.changedTouches;
                for (var i = 0, len = touches.length; i < len; i++) {
                    e = new enchant.Event('touchend');
                    e.identifier = touches[i].identifier;
                    e._initPosition(touches[i].pageX, touches[i].pageY);
                    that.dispatchEvent(e);
                }
            }, false);
        } else {
            this._element.addEventListener('mousedown', function(e) {
                var x = e.pageX;
                var y = e.pageY;
                e = new enchant.Event('touchstart');
                e.identifier = game._mousedownID;
                e._initPosition(x, y);
                that.dispatchEvent(e);
                that._mousedown = true;
            }, false);
            game._element.addEventListener('mousemove', function(e) {
                if (!that._mousedown){
                    return;
                }
                var x = e.pageX;
                var y = e.pageY;
                e = new enchant.Event('touchmove');
                e.identifier = game._mousedownID;
                e._initPosition(x, y);
                that.dispatchEvent(e);
            }, false);
            game._element.addEventListener('mouseup', function(e) {
                if (!that._mousedown){
                    return;
                }
                var x = e.pageX;
                var y = e.pageY;
                e = new enchant.Event('touchend');
                e.identifier = game._mousedownID;
                e._initPosition(x, y);
                that.dispatchEvent(e);
                that._mousedown = false;
            }, false);
        }
    },
    /**
     [lang:ja]
     * DOMのID.
     * @type {String}
     [/lang]
     [lang:en]
     * DOM ID.
     * @type {String}
     [/lang]
     */
    id: {
        get: function() {
            return this._element.id;
        },
        set: function(id) {
            this._element.id = id;
        }
    },
    /**
     [lang:ja]
     * DOMのclass.
     * @type {String}
     [/lang]
     [lang:en]
     * DOM class.
     * @type {String}
     [/lang]
     */
    className: {
        get: function() {
            return this._element.className;
        },
        set: function(className) {
            this._element.className = className;
        }
    },
    /**
     [lang:ja]
     * Entityの横幅.
     * @type {Number}
     [/lang]
     [lang:en]
     * Entity width.
     * @type {Number}
     [/lang]
     */
    width: {
        get: function() {
            return this._width;
        },
        set: function(width) {
            this._style.width = (this._width = width) + 'px';
        }
    },
    /**
     [lang:ja]
     * Entityの高さ.
     * @type {Number}
     [/lang]
     [lang:en]
     * Entity height.
     * @type {Number}
     [/lang]
     */
    height: {
        get: function() {
            return this._height;
        },
        set: function(height) {
            this._style.height = (this._height = height) + 'px';
        }
    },
    /**
     [lang:ja]
     * Entityの背景色.
     * CSSの'color'プロパティと同様の形式で指定できる.
     * @type {String}
     [/lang]
     [lang:en]
     * Entity background color.
     * Designates as same format as CSS 'color' properties.
     * @type {String}
     [/lang]
     */
    backgroundColor: {
        get: function() {
            return this._backgroundColor;
        },
        set: function(color) {
            this._element.style.backgroundColor = this._backgroundColor = color;
        }
    },
    /**
     [lang:ja]
     * Entityの透明度.
     * 0から1までの値を設定する(0が完全な透明, 1が完全な不透明).
     * @type {Number}
     [/lang]
     [lang:en]
     * Entity transparency.
     * Sets level from 0 to 1 (0 is completely transparent, 1 is completely opaque).
     * @type {Number}
     [/lang]
     */
    opacity: {
        get: function() {
            return this._opacity;
        },
        set: function(opacity) {
            this._style.opacity = this._opacity = opacity;
        }
    },
    /**
     [lang:ja]
     * Entityを表示するかどうかを指定する.
     * @type {Boolean}
     [/lang]
     [lang:en]
     * Indicates whether or not to display Entity.
     * @type {Boolean}
     [/lang]
     */
    visible: {
        get: function() {
            return this._visible;
        },
        set: function(visible) {
            if (this._visible = visible) {
                this._style.display = 'block';
            } else {
                this._style.display = 'none';
            }
        }
    },
    /**
     [lang:ja]
     * Entityのタッチを有効にするかどうかを指定する.
     * @type {Boolean}
     [/lang]
     [lang:en]
     * Designates whether or not to make Entity touch valid.
     * @type {Boolean}
     [/lang]
     */
    touchEnabled: {
        get: function() {
            return this._touchEnabled;
        },
        set: function(enabled) {
            if (this._touchEnabled = enabled) {
                this._style.pointerEvents = 'all';
            } else {
                this._style.pointerEvents = 'none';
            }
        }
    },
    /**
     [lang:ja]
     * Entityの矩形が交差しているかどうかにより衝突判定を行う.
     * @param {*} other 衝突判定を行うEntityなどx, y, width, heightプロパティを持ったObject.
     * @return {Boolean} 衝突判定の結果.
     [/lang]
     [lang:en]
     * Operates collision detection based on whether or not rectangle angles are intersecting.
     * @param {*} other Object with properties of x, y, width, height that operate Entity collision detection.
     * @return {Boolean} Collision detection results.
     [/lang]
     */
    intersect: function(other) {
        return this._offsetX < other._offsetX + other.width && other._offsetX < this._offsetX + this.width &&
            this._offsetY < other._offsetY + other.height && other._offsetY < this._offsetY + this.height;
    },
    /**
     [lang:ja]
     * Entityの中心点どうしの距離により衝突判定を行う.
     * @param {*} other 衝突判定を行うEntityなどx, y, width, heightプロパティを持ったObject.
     * @param {Number} [distance] 衝突したと見なす最大の距離. デフォルト値は二つのEntityの横幅と高さの平均.
     * @return {Boolean} 衝突判定の結果.
     [/lang]
     [lang:en]
     * Operates collision detection based on distance from Entity's central point.
     * @param {*} other Object with properties of x, y, width, height that operate Entity collision detection.
     * @param {Number} [distance] Greatest distance considered in collision. Default level is average of Entity width and height.
     * @return {Boolean} Collision detection result.
     [/lang]
     */
    within: function(other, distance) {
        if (distance == null) {
            distance = (this.width + this.height + other.width + other.height) / 4;
        }
        var _;
        return (_ = this._offsetX - other._offsetX + (this.width - other.width) / 2) * _ +
            (_ = this._offsetY - other._offsetY + (this.height - other.height) / 2) * _ < distance * distance;
    }, /**
     [lang:ja]
     * Spriteを拡大縮小する.
     * @param {Number} x 拡大するx軸方向の倍率.
     * @param {Number} [y] 拡大するy軸方向の倍率.
     [/lang]
     [lang:en]
     * Expand or contract Sprite.
     * @param {Number} x Scaling for x axis to be expanded.
     * @param {Number} [y] Scaling for y axis to be expanded.
     [/lang]
     */
    scale: function(x, y) {
        if (y == null){
            y = x;
        }
        this._scaleX *= x;
        this._scaleY *= y;
        this._dirty = true;
    },
    /**
     [lang:ja]
     * Spriteを回転する.
     * @param {Number} deg 回転する角度 (度数法).
     [/lang]
     [lang:en]
     * Rotate Sprite.
     * @param {Number} deg Rotation angle (frequency).
     [/lang]
     */
    rotate: function(deg) {
        this._rotation += deg;
        this._dirty = true;
    },
    /**
     [lang:ja]
     * Spriteのx軸方向の倍率.
     * @type {Number}
     [/lang]
     [lang:en]
     * Scaling for Sprite's x axis direction.
     * @type {Number}
     [/lang]
     */
    scaleX: {
        get: function() {
            return this._scaleX;
        },
        set: function(scaleX) {
            this._scaleX = scaleX;
            this._dirty = true;
        }
    },
    /**
     [lang:ja]
     * Spriteのy軸方向の倍率.
     * @type {Number}
     [/lang]
     [lang:en]
     * Scaling for Sprite's y axis direction.
     * @type {Number}
     [/lang]
     */
    scaleY: {
        get: function() {
            return this._scaleY;
        },
        set: function(scaleY) {
            this._scaleY = scaleY;
            this._dirty = true;
        }
    },
    /**
     [lang:ja]
     * Spriteの回転角 (度数法).
     * @type {Number}
     [/lang]
     [lang:en]
     * Sprite rotation angle (frequency).
     * @type {Number}
     [/lang]
     */
    rotation: {
        get: function() {
            return this._rotation;
        },
        set: function(rotation) {
            this._rotation = rotation;
            this._dirty = true;
        }
    }
});