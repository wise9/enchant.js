/**
 * @scope enchant.Node.prototype
 */
enchant.Node = enchant.Class.create(enchant.EventTarget, {
    /**
     * @name enchant.Node
     * @class
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

        this._matrix = [ 1, 0, 0, 1, 0, 0 ];

        this._x = 0;
        this._y = 0;
        this._offsetX = 0;
        this._offsetY = 0;

        /**
         [lang:ja]
         * Node が画面に表示されてから経過したフレーム数。
         * {@link enchant.Event.ENTER_FRAME} イベントを受け取る前にインクリメントされる。
         * (ENTER_FRAME イベントのリスナが初めて実行される時に 1 となる。)
         [/lang]
         [lang:en]
         * The age (frames) of this node which will be increased before this node receives {@link enchant.Event.ENTER_FRAME} event.
         [/lang]
         [lang:de]
         * Das Alter (Frames) dieses Nodes welches vor dem {@link enchant.Event.ENTER_FRAME} Ereignis erhöht wird.
         [/lang]
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

        /**
         [lang:ja]
         * Node が生成される際に、tl プロパティに Timeline オブジェクトを追加している
         [/lang]
         */
        if(enchant.ENV.USE_ANIMATION){
            var tl = this.tl = new enchant.Timeline(this);
        }
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
        this._dirty = true;
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
        this._dirty = true;
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
            this._dirty = true;
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
            this._dirty = true;
        }
    },
    _updateCoordinate: function() {
        var node = this;
        var tree = [ node ];
        var parent = node.parentNode;
        var scene = this.scene;
        while (parent && node._dirty) {
            tree.unshift(parent);
            node = node.parentNode;
            parent = node.parentNode;
        }
        var matrix = enchant.Matrix.instance;
        var stack = matrix.stack;
        var mat = [];
        var newmat, ox, oy;
        stack.push(tree[0]._matrix);
        for (var i = 1, l = tree.length; i < l; i++) {
            node = tree[i];
            newmat = [];
            matrix.makeTransformMatrix(node, mat);
            matrix.multiply(stack[stack.length - 1], mat, newmat);
            node._matrix = newmat;
            stack.push(newmat);
            ox = (typeof node._originX === 'number') ? node._originX : node._width / 2 || 0;
            oy = (typeof node._originY === 'number') ? node._originY : node._height / 2 || 0;
            var vec = [ ox, oy ];
            matrix.multiplyVec(newmat, vec, vec);
            node._offsetX = vec[0] - ox;
            node._offsetY = vec[1] - oy;
            node._dirty = false;
        }
        matrix.reset();
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
