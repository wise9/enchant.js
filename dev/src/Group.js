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

        this._x = 0;
        this._y = 0;

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
     * Adds Node to Group.
     * @param {enchant.Node} node Added Node.
     [/lang]
     */
    addChild: function(node) {
        this.childNodes.push(node);
        node.parentNode = this;
        node.dispatchEvent(new enchant.Event('added'));
        if (this.scene) {
            var e = new enchant.Event('addedtoscene');
            node.scene = this.scene;
            node.dispatchEvent(e);
            node._updateCoordinate();

            var fragment = document.createDocumentFragment();
            var nodes;
            var push = Array.prototype.push;
            if (node._element) {
                fragment.appendChild(node._element);
            } else if (node.childNodes) {
                nodes = node.childNodes.slice().reverse();
                while (nodes.length) {
                    node = nodes.pop();
                    node.scene = this.scene;
                    node.dispatchEvent(e);
                    if (node._element) {
                        fragment.appendChild(node._element);
                    } else if (node.childNodes) {
                        push.apply(nodes, node.childNodes.reverse());
                    }
                }
            }
            if (!fragment.childNodes.length){
                return;
            }

            var nextSibling, thisNode = this;
            while (thisNode.parentNode) {
                nodes = thisNode.parentNode.childNodes;
                nodes = nodes.slice(nodes.indexOf(thisNode) + 1).reverse();
                while (nodes.length) {
                    node = nodes.pop();
                    if (node._element) {
                        nextSibling = node._element;
                        break;
                    } else if (node.childNodes) {
                        push.apply(nodes, node.childNodes.slice().reverse());
                    }
                }
                thisNode = thisNode.parentNode;
            }
            if (nextSibling) {
                this.scene._element.insertBefore(fragment, nextSibling);
            } else {
                this.scene._element.appendChild(fragment);
            }
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
            node.dispatchEvent(new enchant.Event('added'));
            if (this.scene) {
                var e = new enchant.Event('addedtoscene');
                node.scene = this.scene;
                node.dispatchEvent(e);
                node._updateCoordinate();

                var fragment = document.createDocumentFragment();
                var nodes;
                var push = Array.prototype.push;
                if (node._element) {
                    fragment.appendChild(node._element);
                } else if (node.childNodes) {
                    nodes = node.childNodes.slice().reverse();
                    while (nodes.length) {
                        node = nodes.pop();
                        node.scene = this.scene;
                        node.dispatchEvent(e);
                        if (node._element) {
                            fragment.appendChild(node._element);
                        } else if (node.childNodes) {
                            push.apply(nodes, node.childNodes.reverse());
                        }
                    }
                }
                if (!fragment.childNodes.length){
                    return;
                }

                var nextSibling, thisNode = reference;
                while (thisNode !== this) {
                    if (i != null) {
                        nodes = this.childNodes.slice(i + 1).reverse();
                        i = null;
                    } else {
                        nodes = thisNode.parentNode.childNodes;
                        nodes = nodes.slice(nodes.indexOf(thisNode) + 1).reverse();
                    }
                    while (nodes.length) {
                        node = nodes.pop();
                        if (node._element) {
                            nextSibling = node._element;
                            break;
                        } else if (node.childNodes) {
                            push.apply(nodes, node.childNodes.slice().reverse());
                        }
                    }
                    thisNode = thisNode.parentNode;
                }
                if (nextSibling) {
                    this.scene._element.insertBefore(fragment, nextSibling);
                } else {
                    this.scene._element.appendChild(fragment);
                }
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
        var i = this.childNodes.indexOf(node);
        if (i !== -1) {
            this.childNodes.splice(i, 1);
        } else {
            return;
        }
        node.parentNode = null;
        node.dispatchEvent(new enchant.Event('removed'));
        if (this.scene) {
            var e = new enchant.Event('removedfromscene');
            node.scene = null;
            node.dispatchEvent(e);
            if (node._element) {
                this.scene._element.removeChild(node._element);
            } else if (node.childNodes) {
                var nodes = node.childNodes.slice();
                var push = Array.prototype.push;
                while (nodes.length) {
                    node = nodes.pop();
                    node.scene = null;
                    node.dispatchEvent(e);
                    if (node._element) {
                        this.scene._element.removeChild(node._element);
                    } else if (node.childNodes) {
                        push.apply(nodes, node.childNodes);
                    }
                }
            }
        }
    },
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
    }
});
