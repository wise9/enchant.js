enchant.DomLayer = enchant.Class.create(enchant.Group, {
    initialize: function() {
        var core = enchant.Core.instance;
        enchant.Group.call(this);

        this._touchEventTarget = null;

        this._element = document.createElement('div');
        this._element.style.position = 'absolute';

        this._domManager = new enchant.DomManager(this, this._element);
        this._domManager.layer = this;

        this.width = core.width;
        this.height = core.height;

        var touch = [
            enchant.Event.TOUCH_START,
            enchant.Event.TOUCH_MOVE,
            enchant.Event.TOUCH_END
        ];

        touch.forEach(function(type) {
            this.addEventListener(type, function(e) {
                if (this._scene) {
                    this._scene.dispatchEvent(e);
                }
            });
        }, this);

        var __onchildadded = function(e) {
            var child = e.node;
            var next = e.next;
            var self = e.target;
            var nextManager = next ? next._domManager : null;
            enchant.DomLayer._attachDomManager(child, __onchildadded, __onchildremoved);
            self._domManager.addManager(child._domManager, nextManager);
            var render = new enchant.Event(enchant.Event.RENDER);
            child._dirty = true;
            self._domManager.layer._rendering(child, render);
        };

        var __onchildremoved = function(e) {
            var child = e.node;
            var self = e.target;
            self._domManager.removeManager(child._domManager);
            enchant.DomLayer._detachDomManager(child, __onchildadded, __onchildremoved);
        };

        this.addEventListener('childremoved', __onchildremoved);
        this.addEventListener('childadded', __onchildadded);

    },
    width: {
        get: function() {
            return this._width;
        },
        set: function(width) {
            this._width = width;
            this._element.style.width = width + 'px';
        }
    },
    height: {
        get: function() {
            return this._height;
        },
        set: function(height) {
            this._height = height;
            this._element.style.height = height + 'px';
        }
    },
    addChild: function(node) {
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
    insertBefore: function(node, reference) {
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
    _startRendering: function() {
        this.addEventListener('exitframe', this._onexitframe);
        this._onexitframe();
    },
    _stopRendering: function() {
        this.removeEventListener('exitframe', this._onexitframe);
        this._onexitframe();
    },
    _onexitframe: function() {
        this._rendering(this, new enchant.Event(enchant.Event.RENDER));
    },
    _rendering: function(node, e, inheritMat) {
        var child;
        if (!inheritMat) {
            inheritMat = [ 1, 0, 0, 1, 0, 0 ];
        }
        node.dispatchEvent(e);
        node._domManager.render(inheritMat);
        if (node.childNodes) {
            for (var i = 0, l = node.childNodes.length; i < l; i++) {
                child = node.childNodes[i];
                this._rendering(child, e, inheritMat.slice());
            }
        }
        if (node._domManager instanceof enchant.DomlessManager) {
            enchant.Matrix.instance.stack.pop();
        }
        node._dirty = false;
    },
    _determineEventTarget: function() {
        var target = this._touchEventTarget;
        this._touchEventTarget = null;
        return (target === this) ? null : target;
    }
});

enchant.DomLayer._attachDomManager = function(node, onchildadded, onchildremoved) {
    var child;
    if (!node._domManager) {
        node.addEventListener('childadded', onchildadded);
        node.addEventListener('childremoved', onchildremoved);
        if (node instanceof enchant.Group) {
            node._domManager = new enchant.DomlessManager(node);
        } else {
            if (node._element) {
                node._domManager = new enchant.DomManager(node, node._element);
            } else {
                node._domManager = new enchant.DomManager(node, 'div');
            }
        }
    }
    if (node.childNodes) {
        for (var i = 0, l = node.childNodes.length; i < l; i++) {
            child = node.childNodes[i];
            enchant.DomLayer._attachDomManager(child, onchildadded, onchildremoved);
            node._domManager.addManager(child._domManager, null);
        }
    }
};

enchant.DomLayer._detachDomManager = function(node, onchildadded, onchildremoved) {
    var child;
    node.removeEventListener('childadded', onchildadded);
    node.removeEventListener('childremoved', onchildremoved);
    if (node.childNodes) {
        for (var i = 0, l = node.childNodes.length; i < l; i++) {
            child = node.childNodes[i];
            node._domManager.removeManager(child._domManager, null);
            enchant.DomLayer._detachDomManager(child, onchildadded, onchildremoved);
        }
    }
    node._domManager.remove();
    delete node._domManager;
};
