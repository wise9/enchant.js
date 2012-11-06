(function() {

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

            var start = [
                enchant.Event.ENTER,
                enchant.Event.ADDED_TO_SCENE
            ];
            var end = [
                enchant.Event.EXIT,
                enchant.Event.REMOVED_FROM_SCENE
            ];
            var touch = [
                enchant.Event.TOUCH_START,
                enchant.Event.TOUCH_MOVE,
                enchant.Event.TOUCH_END
            ];

            start.forEach(function(type) {
                this.addEventListener(type, this._startRendering);
            }, this);
            end.forEach(function(type) {
                this.addEventListener(type, this._stopRendering);
            }, this);
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
                child._updateCoordinate();
                var nextManager = next ? next._domManager : null;
                attachDomManager.call(child);
                self._domManager.addManager(child._domManager, nextManager);
                child._domManager.layer = self;
                rendering.call(child);
            };

            var __onchildremoved = function(e) {
                var child = e.node;
                var self = e.target;
                if (child.childNodes) {
                    child.removeEventListener('childadded', __onchildadded);
                    child.removeEventListener('childremoved', __onchildremoved);
                }
                self._domManager.removeManager(child._domManager);
                detachDomManager.call(child, that._colorManager);
            };

            this.addEventListener('childremoved', __onchildremoved);
            this.addEventListener('childadded', __onchildadded);

            this._onexitframe = function() {
                rendering.call(that);
            };
        },
        _startRendering: function() {
            enchant.Game.instance.addEventListener('exitframe', this._onexitframe);
        },
        _stopRendering: function() {
            enchant.Game.instance.removeEventListener('exitframe', this._onexitframe);
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

    var attachDomManager = nodesWalker(function() {
        if (!this._domManager) {
            if (this instanceof enchant.Group) {
                this._domManager = new enchant.DomlessManager(this);
            } else {
                if (this._element) {
                    this._domManager = new enchant.DomManager(this, this._element);
                } else {
                    this._domManager = new enchant.DomManager(this, 'div');
                }
            }
        }
    });

    var detachDomManager = nodesWalker(function() {
        this._domManager.remove();
        delete this._domManager;
    });

    var rendering = nodesWalker(function() {
        if (this._dirty) {
            this._domManager.render();
            if (typeof this.cssUpdate === 'function') {
                this.cssUpdate();
            }
            this._dirty = false;
        }
    });

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

}());
