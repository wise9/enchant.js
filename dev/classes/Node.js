/**
 [lang:ja]
 * @scope enchant.Node.prototype
 [/lang]
 [lang:en]
 * @scope enchant.Node.prototype
 [/lang]
 */
enchant.Node = enchant.Class.create(enchant.EventTarget, {
    /**
     [lang:ja]
     * Sceneをルートとした表示オブジェクトツリーに属するオブジェクトの基底クラス.
     * 直接使用することはない.
     * @constructs
     * @extends enchant.EventTarget
     [/lang]
     [lang:en]
     * Base class for objects in displayed object tree routed to Scene.
     * Not directly used.
     * @constructs
     * @extends enchant.EventTarget
     [/lang]
     */
    initialize: function() {
        enchant.EventTarget.call(this);

        this._x = 0;
        this._y = 0;
        this._offsetX = 0;
        this._offsetY = 0;

        this.age = 0;

        /**
         [lang:ja]
         * Nodeの親Node.
         * @type {enchant.Group}
         [/lang]
         [lang:en]
         * Parent Node for Node.
         * @type {enchant.Group}
         [/lang]
         */
        this.parentNode = null;
        /**
         [lang:ja]
         * Nodeが属しているScene.
         * @type {enchant.Scene}
         [/lang]
         [lang:en]
         * Scene to which Node belongs.
         * @type {enchant.Scene}
         [/lang]
         */
        this.scene = null;

        this.addEventListener('touchstart', function(e) {
            if (this.parentNode && !this.parentNode._element) {
                this.parentNode.dispatchEvent(e);
            }
        });
        this.addEventListener('touchmove', function(e) {
            if (this.parentNode && !this.parentNode._element) {
                this.parentNode.dispatchEvent(e);
            }
        });
        this.addEventListener('touchend', function(e) {
            if (this.parentNode && !this.parentNode._element) {
                this.parentNode.dispatchEvent(e);
            }
        });
    },
    /**
     [lang:ja]
     * Nodeを移動する.
     * @param {Number} x 移動先のx座標.
     * @param {Number} y 移動先のy座標.
     [/lang]
     [lang:en]
     * Move Node.
     * @param {Number} x Target x coordinates.
     * @param {Number} y Target y coordinates.
     [/lang]
     */
    moveTo: function(x, y) {
        this._x = x;
        this._y = y;
        this._updateCoordinate();
    },
    /**
     [lang:ja]
     * Nodeを移動する.
     * @param {Number} x 移動するx軸方向の距離.
     * @param {Number} y 移動するy軸方向の距離.
     [/lang]
     [lang:en]
     * Move Node.
     * @param {Number} x x axis movement distance.
     * @param {Number} y y axis movement distance.
     [/lang]
     */
    moveBy: function(x, y) {
        this._x += x;
        this._y += y;
        this._updateCoordinate();
    },
    /**
     [lang:ja]
     * Nodeのx座標.
     * @type {Number}
     [/lang]
     [lang:en]
     * x coordinates of Node.
     * @type {Number}
     [/lang]
     */
    x: {
        get: function() {
            return this._x;
        },
        set: function(x) {
            this._x = x;
            this._updateCoordinate();
        }
    },
    /**
     [lang:ja]
     * Nodeのy座標.
     * @type {Number}
     [/lang]
     [lang:en]
     * y coordinates of Node.
     * @type {Number}
     [/lang]
     */
    y: {
        get: function() {
            return this._y;
        },
        set: function(y) {
            this._y = y;
            this._updateCoordinate();
        }
    },
    _updateCoordinate: function() {
        if (this.parentNode) {
            this._offsetX = this.parentNode._offsetX + this._x;
            this._offsetY = this.parentNode._offsetY + this._y;
        } else {
            this._offsetX = this._x;
            this._offsetY = this._y;
        }
    },
    remove: function() {
        if (this._listener) {
            this.clearEventListener();
        }
        if (this.parentNode) {
            this.parentNode.removeChild(this);
        }
    }
});