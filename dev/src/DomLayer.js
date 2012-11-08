enchant.DomLayer = enchant.Class.create(enchant.Group, {
    initialize: function() {
        var game = enchant.Game.instance;
        var that = this;
        enchant.Group.call(this);

        this.width = this._width = game.width;
        this.height = this._height = game.height;

        this._touchEventTarget = null;

        this._frameBuffer = new enchant.DomView(this.width, this.height);
        this._domManager = new enchant.DomManager(this, 'div');
        this._domManager.layer = this;
        this._frameBuffer.element.appendChild(this._domManager.element);

        this._frameBuffer.element.style.position = 'absolute';

        // TODO
        this._element = this._frameBuffer.element;

        this.addEventListener('enter', this._startRendering);
        this.addEventListener('exit', this._stopRendering);

        var touch = [
            enchant.Event.TOUCH_START,
            enchant.Event.TOUCH_MOVE,
            enchant.Event.TOUCH_END
        ];

        touch.forEach(function(type) {
            this.addEventListener(type, function(e) {
                if (this.scene) {
                    this.scene.dispatchEvent(e);
                }
            });
        }, this);

        var __onchildadded = function(e) {
            var child = e.node;
            var next = e.next;
            var self = e.target;
            if (child.childNodes) {
                child.addEventListener('childadded', __onchildadded);
                child.addEventListener('childremoved', __onchildremoved);
            }
            var nextManager = next ? next._domManager : null;
            enchant.DomLayer._attachDomManager(child);
            self._domManager.addManager(child._domManager, nextManager);
            that._rendering(child);
        };

        var __onchildremoved = function(e) {
            var child = e.node;
            var self = e.target;
            if (child.childNodes) {
                child.removeEventListener('childadded', __onchildadded);
                child.removeEventListener('childremoved', __onchildremoved);
            }
            self._domManager.removeManager(child._domManager);
            enchant.DomLayer._detachDomManager(child);
        };

        this.addEventListener('childremoved', __onchildremoved);
        this.addEventListener('childadded', __onchildadded);

        this._onexitframe = function() {
            that._rendering(that);
        };
    },
    _startRendering: function() {
        enchant.Game.instance.addEventListener('exitframe', this._onexitframe);
    },
    _stopRendering: function() {
        enchant.Game.instance.removeEventListener('exitframe', this._onexitframe);
    },
    _rendering: function(node, inheritMat) {
        var child;
        if (!inheritMat) {
            inheritMat = [ 1, 0, 0, 1, 0, 0 ];
        }
        node._domManager.render(inheritMat);
        if (node.childNodes) {
            for (var i = 0, l = node.childNodes.length; i < l; i++) {
                child = node.childNodes[i];
                this._rendering(child, inheritMat.slice());
            }
        }
        if (node._domManager instanceof enchant.DomlessManager) {
            enchant.Matrix.instance.stack.pop();
        }
        node._dirty = false;
    },
    _determineEventTarget: function() {
        if (this._touchEventTarget) {
            if (this._touchEventTarget !== this) {
                return this._touchEventTarget;
            }
        }
        return null;
    }
});

enchant.DomLayer._attachDomManager = function(node) {
    var child;
    if (!node._domManager) {
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
            enchant.DomLayer._attachDomManager(child);
        }
    }
};

enchant.DomLayer._detachDomManager = function(node) {
    var child;
    node._domManager.remove();
    delete node._domManager;
    if (node.childNodes) {
        for (var i = 0, l = node.childNodes.length; i < l; i++) {
            child = node.childNodes[i];
            enchant.DomLayer._detachDomManager(child);
        }
    }
};

enchant.Label.prototype.cssUpdate = function() {
    this._domManager.element.innerHTML = this._text;
    this._domManager.element.style.font = this._font;
    this._domManager.element.style.color = this._color;
    this._domManager.element.style.textAlign = this._textAlign;
};

enchant.Sprite.prototype.cssUpdate = function() {
    var element = this._domManager.element;
    if (this._image) {
        if (this._image._css) {
            element.style.backgroundImage = this._image._css;
            element.style.backgroundPosition =
                -this._frameLeft + 'px ' +
                -this._frameTop + 'px';
        } else if (element.firstChild) {
            // TODO new Surface
        }
    }
};
