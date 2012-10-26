/**
 * @scope enchant.Node.prototype
 */
enchant.Node = enchant.Class.create(enchant.EventTarget, {
    /**
     [lang:ja]
     * Sceneをルートとした表示オブジェクトツリーに属するオブジェクトの基底クラス.
     * 直接使用することはない.
     [/lang]
     [lang:en]
     * Base class for objects in the display tree which is rooted at a Scene.
     * Not to be used directly.
     [/lang]
     [lang:de]
     * Basisklasse für Objekte die im Darstellungsbaum, 
     * dessen Wurzel eine Szene ist, enthalten sind.
     * Sollte nicht direkt verwendet werden.
     [/lang]
     * @constructs
     * @extends enchant.EventTarget
     */
    initialize: function() {
        enchant.EventTarget.call(this);

        this._dirty = false;

        this._x = 0;
        this._y = 0;
        this._offsetX = 0;
        this._offsetY = 0;

        /**
         * [lang:ja]
         * Node が画面に表示されてから経過したフレーム数。
         * {@link enchant.Event.ENTER_FRAME} イベントを受け取る前にインクリメントされる。
         * (ENTER_FRAME イベントのリスナが初めて実行される時に 1 となる。)
         * [/lang]
         * [lang:en]
         * age (frames) of this node which will be increased before this node receives {@link enchant.Event.ENTER_FRAME} event.
         * [/lang]
         * [lang:de]
         * Das Alter (Frames) dieses Nodes welches vor dem {@link enchant.Event.ENTER_FRAME} Ereignis erhöht wird.
         * [/lang]
         * @type {Number}
         */
        this.age = 0;

        /**
         [lang:ja]
         * Nodeの親Node.
         [/lang]
         [lang:en]
         * Parent Node of this Node.
         [/lang]
         [lang:de]
         * Der Eltern-Node dieses Node.
         [/lang]
         * @type {enchant.Group}
         */
        this.parentNode = null;
        /**
         [lang:ja]
         * Nodeが属しているScene.
         [/lang]
         [lang:en]
         * Scene to which Node belongs.
         [/lang]
         [lang:de]
         * Die Szene, zu welcher dieser Node gehört.
         [/lang]
         * @type {enchant.Scene}
         */
        this.scene = null;

        this.addEventListener('touchstart', function(e) {
            if (this.parentNode) {
                this.parentNode.dispatchEvent(e);
            }
        });
        this.addEventListener('touchmove', function(e) {
            if (this.parentNode) {
                this.parentNode.dispatchEvent(e);
            }
        });
        this.addEventListener('touchend', function(e) {
            if (this.parentNode) {
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
     * Move the Node to the given target location.
     * @param {Number} x Target x coordinates.
     * @param {Number} y Target y coordinates.
     [/lang]
     [lang:de]
     * Bewegt diesen Node zu den gegebenen Ziel Koordinaten.
     * @param {Number} x Ziel x Koordinaten.
     * @param {Number} y Ziel y Koordinaten.
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
     * Move the Node relative to its current position.
     * @param {Number} x x axis movement distance.
     * @param {Number} y y axis movement distance.
     [/lang]
     [lang:de]
     * Bewegt diesen Node relativ zur aktuellen Position.
     * @param {Number} x Distanz auf der x Achse.
     * @param {Number} y Distanz auf der y Achse.
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
     [/lang]
     [lang:en]
     * x coordinates of the Node.
     [/lang]
     [lang:de]
     * Die x Koordinaten des Nodes.
     [/lang]
     * @type {Number}
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
     [/lang]
     [lang:en]
     * y coordinates of the Node.
     [/lang]
     [lang:de]
     * Die y Koordinaten des Nodes.
     [/lang]
     * @type {Number}
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
        this._dirty = true;
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
