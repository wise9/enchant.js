/**
 * @scope enchant.Group.prototype
 */
enchant.Group = enchant.Class.create(enchant.Node, {
    /**
     * @name enchant.Group
     * @class
     [lang:ja]
     * 複数の{@link enchant.Node}を子に持つことができるクラス.
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
     * @extends enchant.Node
     [/lang]
     [lang:en]
     * A class that can hold multiple {@link enchant.Node}.
     *
     * @example
     *   var stage = new Group();
     *   stage.addChild(player);
     *   stage.addChild(enemy);
     *   stage.addChild(map);
     *   stage.addEventListener('enterframe', function() {
     *      // Moves the entire frame in according to the player's coordinates.
     *      if (this.x > 64 - player.x) {
     *          this.x = 64 - player.x;
     *      }
     *   });
     *
     [/lang]
     [lang:de]
     * Eine Klasse die mehrere {@link enchant.Node} beinhalten kann.
     *
     * @example
     *   var stage = new Group();
     *   stage.addChild(player);
     *   stage.addChild(enemy);
     *   stage.addChild(map);
     *   stage.addEventListener('enterframe', function() {
     *      // Bewegt den gesamten Frame je nach der aktuelle Spielerposition.
     *      if (this.x > 64 - player.x) {
     *          this.x = 64 - player.x;
     *      }
     *   });
     *
     [/lang]
     * @constructs
     * @extends enchant.Node
     */
    initialize: function() {
        /**
         [lang:ja]
         * 子のNode.
         [/lang]
         [lang:en]
         * Child Nodes.
         [/lang]
         [lang:de]
         * Kind-Nodes.
         [/lang]
         * @type {Array.<enchant.Node>}
         */
        this.childNodes = [];

        enchant.Node.call(this);

        this._rotation = 0;
        this._scaleX = 1;
        this._scaleY = 1;

        this._originX = null;
        this._originY = null;

        this.__dirty = false;

        [enchant.Event.ADDED_TO_SCENE, enchant.Event.REMOVED_FROM_SCENE]
            .forEach(function(event) {
                this.addEventListener(event, function(e) {
                    this.childNodes.forEach(function(child) {
                        child.scene = this.scene;
                        child.dispatchEvent(e);
                    }, this);
                });
            }, this);
    },
    /**
     [lang:ja]
     * GroupにNodeを追加する.
     * @param {enchant.Node} node 追加するNode.
     [/lang]
     [lang:en]
     * Adds a Node to the Group.
     * @param {enchant.Node} node Node to be added.
     [/lang]
     [lang:de]
     * Fügt einen Node zu der Gruppe hinzu.
     * @param {enchant.Node} node Node der hinzugeügt werden soll.
     [/lang]
     */
    addChild: function(node) {
        if (node.parentNode) {
            node.parentNode.removeChild(node);
        }
        this.childNodes.push(node);
        node.parentNode = this;
        var childAdded = new enchant.Event('childadded');
        childAdded.node = node;
        childAdded.next = null;
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
     * @param {enchant.Node} node Node to be incorporated.
     * @param {enchant.Node} reference Node in position before insertion.
     [/lang]
     [lang:de]
     * Fügt einen Node vor einen anderen Node zu dieser Gruppe hinzu.
     * @param {enchant.Node} node Der Node der hinzugefügt werden soll.
     * @param {enchant.Node} reference Der Node der sich vor dem einzufügendem Node befindet.
     [/lang]
     */
    insertBefore: function(node, reference) {
        if (node.parentNode) {
            node.parentNode.removeChild(node);
        }
        var i = this.childNodes.indexOf(reference);
        if (i !== -1) {
            this.childNodes.splice(i, 0, node);
            node.parentNode = this;
            var childAdded = new enchant.Event('childadded');
            childAdded.node = node;
            childAdded.next = reference;
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
     * Remove a Node from the Group.
     * @param {enchant.Node} node Node to be deleted.
     [/lang]
     [lang:de]
     * Entfernt einen Node aus der Gruppe.
     * @param {enchant.Node} node Der Node der entfernt werden soll.
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
    },
    /**
     [lang:ja]
     * 最初の子Node.
     [/lang]
     [lang:en]
     * The Node which is the first child.
     [/lang]
     [lang:de]
     * Der Node, welcher das erste Kind der Gruppe darstellt.
     [/lang]
     * @type {enchant.Node}
     */
    firstChild: {
        get: function() {
            return this.childNodes[0];
        }
    },
    /**
     [lang:ja]
     * 最後の子Node.
     [/lang]
     [lang:en]
     * The Node which is the last child.
     [/lang]
     [lang:de]
     * Der Node, welcher das letzte Kind der Gruppe darstellt.
     [/lang]
     * @type {enchant.Node}
     */
    lastChild: {
        get: function() {
            return this.childNodes[this.childNodes.length - 1];
        }
    },
    /**
    [lang:ja]
    * Groupの回転角 (度数法).
    [/lang]
    [lang:en]
    * Group rotation angle (degree).
    [/lang]
    [lang:de]
    * Rotationswinkel der Gruppe (Grad).
    [/lang]
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
    [lang:ja]
    * Groupのx軸方向の倍率.
    [/lang]
    [lang:en]
    * Scaling factor on the x axis of the Group.
    [/lang]
    [lang:de]
    * Skalierungsfaktor auf der x-Achse der Gruppe.
    [/lang]
    * @type {Number}
    * @see enchant.CanvasGroup.originX
    * @see enchant.CanvasGroup.originY
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
    [lang:ja]
    * Groupのy軸方向の倍率.
    [/lang]
    [lang:en]
    * Scaling factor on the y axis of the Group.
    [/lang]
    [lang:de]
    * Skalierungsfaktor auf der y-Achse der Gruppe.
    [/lang]
    * @type {Number}
    * @see enchant.CanvasGroup.originX
    * @see enchant.CanvasGroup.originY
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
    /**
    [lang:ja]
    * 回転・拡大縮小の基準点のX座標
    [/lang]
    [lang:en]
    * origin point of rotation, scaling
    [/lang]
    [lang:de]
    * Ausgangspunkt für Rotation und Skalierung.
    [/lang]
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
    [lang:ja]
    * 回転・拡大縮小の基準点のX座標
    [/lang]
    [lang:en]
    * origin point of rotation, scaling
    [/lang]
    [lang:de]
    * Ausgangspunkt für Rotation und Skalierung.
    [/lang]
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
    },
    _dirty: {
        get: function() {
            return this.__dirty;
        },
        set: function(dirty) {
            dirty = !!dirty;
            this.__dirty = dirty;
            if (dirty) {
                for (var i = 0, l = this.childNodes.length; i < l; i++) {
                    this.childNodes[i]._dirty = true;
                }
            }
        }
    }
});
