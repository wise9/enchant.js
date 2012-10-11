/**
 [lang:ja]
 * @scope enchant.Group.prototype
 [/lang]
 [lang:en]
 * @scope enchant.Group.prototype
 [/lang]
 */
enchant.Group = enchant.Class.create(enchant.Node, {
    /**
     [lang:ja]
     * 複数のNodeを子に持つことができるクラス.
     *
     * @example
     *   var stage = new Group();
     *   stage.addChild(player);
     *   stage.addChild(enemy);
     *   stage.addChild(map);
     *   stage.addEventListener('enterframe', function() {
     *      // playerの座標に従って全体をスクロールする
     *      if (this.x > 64 - player.x) {
     *          this.x = 64 - player.x;
     *      }
     *   });
     *
     * @constructs
     * @extends enchant.Node
     [/lang]
     [lang:en]
     * A class that can hold multiple Nodes.
     *
     * @example
     *   var stage = new Group();
     *   stage.addChild(player);
     *   stage.addChild(enemy);
     *   stage.addChild(map);
     *   stage.addEventListener('enterframe', function() {
     *      // Scrolls entire frame in response to player's coordinates.
     *      if (this.x > 64 - player.x) {
     *          this.x = 64 - player.x;
     *      }
     *   });
     *
     * @constructs
     * @extends enchant.Node
     [/lang]
     */
    initialize: function() {
        enchant.Node.call(this);

        /**
         [lang:ja]
         * 子のNode.
         * @type {Array.<enchant.Node>}
         [/lang]
         [lang:en]
         * Child Node.
         * @type {Array.<enchant.Node>}
         [/lang]
         */
        this.childNodes = [];

        this._originX = null;
        this._originY = null;

        this._rotation = 0;
    },
    /**
     [lang:ja]
     * GroupにNodeを追加する.
     * @param {enchant.Node} node 追加するNode.
     [/lang]
     [lang:en]
     * Adds Node to Group.
     * @param {enchant.Node} node Added Node.
     [/lang]
     */
    addChild: function(node) {
        this.childNodes.push(node);
        node.parentNode = this;
        var childAdded = new enchant.Event('childadded');
        childAdded.node = node;
        this.dispatchEvent(childAdded);
        node.dispatchEvent(new enchant.Event('added'));
        if (this.scene) {
            node.scene = this.scene;
            var addedToScene = new enchant.Event('addedtoscene');
            node.dispatchEvent(addedToScene);
        }
    },
    /**
     [lang:ja]
     * GroupにNodeを挿入する.
     * @param {enchant.Node} node 挿入するNode.
     * @param {enchant.Node} reference 挿入位置の前にあるNode.
     [/lang]
     [lang:en]
     * Incorporates Node into Group.
     * @param {enchant.Node} node Incorporated Node.
     * @param {enchant.Node} reference Node in position before incorporation.
     [/lang]
     */
    insertBefore: function(node, reference) {
        var i = this.childNodes.indexOf(reference);
        if (i !== -1) {
            this.childNodes.splice(i, 0, node);
            node.parentNode = this;
            var childAdded = new enchant.Event('childadded');
            childAdded.node = node;
            this.dispatchEvent(childAdded);
            node.dispatchEvent(new enchant.Event('added'));
            if (this.scene) {
                node.scene = this.scene;
                var addedToScene = new enchant.Event('addedtoscene');
                node.dispatchEvent(addedToScene);
            }
        } else {
            this.addChild(node);
        }
    },
    /**
     [lang:ja]
     * GroupからNodeを削除する.
     * @param {enchant.Node} node 削除するNode.
     [/lang]
     [lang:en]
     * Delete Node from Group.
     * @param {enchant.Node} node Deleted Node.
     [/lang]
     */
    removeChild: function(node) {
        var i;
        if ((i = this.childNodes.indexOf(node)) !== -1) {
            this.childNodes.splice(i, 1);
            node.parentNode = null;
            var childRemoved = new enchant.Event('childremoved');
            childRemoved.node = node;
            this.dispatchEvent(childRemoved);
            node.dispatchEvent(new enchant.Event('removed'));
            if (this.scene) {
                node.scene = null;
                var removedFromScene = new enchant.Event('removedfromscene');
                node.dispatchEvent(removedFromScene);
            }
        }
    }
    /**
     [lang:ja]
     * 最初の子Node.
     * @type {enchant.Node}
     [/lang]
     [lang:en]
     * First child Node.
     * @type {enchant.Node}
     [/lang]
     */
    firstChild: {
        get: function() {
            return this.childNodes[0];
        }
    },
    /**
     [lang:ja]
     * 最後の子Node.
     * @type {enchant.Node}
     [/lang]
     [lang:en]
     * Last child Node.
     * @type {enchant.Node}
     [/lang]
     */
    lastChild: {
        get: function() {
            return this.childNodes[this.childNodes.length - 1];
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
        for (var i = 0, len = this.childNodes.length; i < len; i++) {
            this.childNodes[i]._updateCoordinate();
        }
    },
    /**
     * rotation of group
     * @type {Number}
     */
    rotation: {
        get: function() {
            return this._rotation;
        },
        set: function(rotation) {
            this._rotation = rotation;
            this._dirty = true;
        }
    },
    /**
     * origin point of rotation, scaling
     * @type {Number}
     */
    originX: {
        get: function() {
            return this._originX;
        },
        set: function(originX) {
            this._originX = originX;
            this._dirty = true;
        }
    },
    /**
     * origin point of rotation, scaling
     * @type {Number}
     */
    originY: {
        get: function() {
            return this._originY;
        },
        set: function(originY) {
            this._originY = originY;
            this._dirty = true;
        }
    }
});
