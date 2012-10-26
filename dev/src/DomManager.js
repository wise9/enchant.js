var rotate = function(rad, x, y) {
    var sinT = Math.sin(rad);
    var cosT = Math.cos(rad);
    return [
        cosT * x + sinT * y,
        -sinT * x + cosT * y
    ];
};

enchant.DomManager = enchant.Class.create({
    initialize: function(node, elementType) {
        this.element = document.createElement(elementType);
        this.style = this.element.style;
        this.style.position = 'absolute';
        this.targetNode = node;
        this.layer = null;

        var manager = this;
        var setDomTarget = function() {
            manager.layer._touchEventTarget = manager.targetNode;
        };
        if (enchant.ENV.TOUCH_ENABLED) {
            this.element.addEventListener('touchstart', setDomTarget, true);
        }
        this.element.addEventListener('mousedown', setDomTarget, true);
    },
    getDomElement: function() {
        return this.element;
    },
    getDomElementAsNext: function() {
        return this.element;
    },
    getNextManager: function(manager) {
        var i = this.targetNode.parentNode.childNodes.indexOf(manager.targetNode);
        if (i !== this.targetNode.parentNode.childNodes.length - 1) {
            return this.targetNode.parentNode.childNodes[i + 1]._domManager;
        } else {
            return null;
        }
    },
    addManager: function(childManager, nextManager) {
        var nextElement;
        if (nextManager) {
            nextElement = nextManager.getDomElementAsNext();
        } else if (this.targetNode.parentNode) {
            //nextElement = this.getNextManager(this);
        }
        this.element.insertBefore(childManager.getDomElement(), nextElement);
    },
    removeManager: function(childManager) {
        if (childManager instanceof enchant.DomlessManager) {
            childManager._domRef.forEach(function(element) {
                this.element.removeChild(element);
            }, this);
        } else {
            this.element.removeChild(childManager.element);
        }
    },
    render: function() {
        this.cssUpdate();
    },
    cssUpdate: function() {
        var node = this.targetNode;
        this.style.width = node._width + 'px';
        this.style.height = node._height + 'px';
        this.style.opacity = node._opacity;
        if (typeof node._visible !== 'undefined') {
            this.style.display = node._visible ? 'block' : 'none';
        }
        var ox = (typeof node._originX === 'number') ? node._originX : node._width / 2 | 0;
        var oy = (typeof node._originY === 'number') ? node._originY : node._height / 2 | 0;
        var x, y;
        var parentManager;
        if (node.parentNode && node.parentNode._domManager instanceof enchant.DomlessManager) {
            parentManager = node.parentNode._domManager;
            var rad = -parentManager._rotation * Math.PI / 180;
            var rx = node._x + ox;
            var ry = node._y + oy;
            var rot = rotate(rad, rx, ry);
            var X = rot[0] * parentManager._scaleX - ox;
            var Y = rot[1] * parentManager._scaleY - oy;
            x = parentManager._x + X;
            y = parentManager._y + Y;
            var cssTransform =
                'translate(' + x + 'px, ' + y + 'px) ' +
                'rotate(' + (parentManager._rotation + node._rotation) + 'deg) ' +
                'scale(' + (parentManager._scaleX * node._scaleX) + ', ' + (parentManager._scaleY * node._scaleY) + ') ';
            this.style[enchant.ENV.VENDOR_PREFIX + 'Transform'] = cssTransform;
            this.style[enchant.ENV.VENDOR_PREFIX + 'TransformOrigin'] = ox + ' ' + oy;
            this.style.backgroundColor = node._backgroundColor;

        } else {

        x = node._x;
        y = node._y;
        this.style[enchant.ENV.VENDOR_PREFIX + 'Transform'] =
            'translate(' + x + 'px, ' + y + 'px) ' +
            'rotate(' + node._rotation + 'deg) ' +
            'scale(' + node._scaleX + ', ' + node._scaleY + ') ';
        this.style[enchant.ENV.VENDOR_PREFIX + 'TransformOrigin'] = ox + ' ' + oy;
        this.style.backgroundColor = node._backgroundColor;

        }

        node._offsetX = x;
        node._offsetY = y;
    },
    remove: function() {
        this.element = this.style = this.targetNode = null;
    }
});

enchant.DomlessManager = enchant.Class.create({
    initialize: function(node) {
        this._domRef = [];
        this.targetNode = node;
    },
    _register: function(element, nextElement) {
        var i = this._domRef.indexOf(nextElement);
        if (element instanceof DocumentFragment) {
            if (i === -1) {
                Array.prototype.push.apply(this._domRef, element.childNodes);
            } else {
                this._domRef.splice(i, 0, element);
                Array.prototype.splice.apply(this._dom, [i, 0].join(element.childNodes));
            }
        } else {
            if (i === -1) {
                this._domRef.push(element);
            } else {
                this._domRef.splice(i, 0, element);
            }
        }
    },
    getNextManager: function(manager) {
        var i = this.targetNode.parentNode.childNodes.indexOf(manager.targetNode);
        if (i !== this.targetNode.parentNode.childNodes.length - 1) {
            return this.targetNode.parentNode.childNodes[i + 1]._domManager;
        } else {
            return null;
        }
    },
    getDomElement: function() {
        var frag = document.createDocumentFragment();
        var children = this.targetNode.childNodes;
        children.forEach(function(child) {
            var element = child._domManager.getDomElement();
            this._domRef.push(element);
            frag.appendChild(element);
        }, this);
        return frag;
    },
    getDomElementAsNext: function() {
        if (this._domRef.length) {
            return this._domRef[0];
        } else {
            var nextManager = this.getNextManager(this);
            if (nextManager) {
                return nextManager.element;
            } else {
                return null;
            }
        }
    },
    addManager: function(childManager, nextManager) {
        if (this.targetNode.parentNode) {
            if (nextManager === null) {
                nextManager = this.getNextManager(this);
            }
            this.targetNode.parentNode._domManager.addManager(childManager, nextManager);
        }
        var nextElement = nextManager ? nextManager.getDomElementAsNext() : null;
        this._register(childManager.getDomElement(), nextElement);
    },
    removeManager: function(childManager) {
        var dom;
        var i = this._domRef.indexOf(childManager.element);
        if (i !== -1) {
            dom = this._domRef[i];
            dom.parentNode.removeChild(dom);
            this._domRef.splice(i, 1);
        }
    },
    render: function() {
        var node = this.targetNode;
        var parentManager = node.parentNode._domManager;
        if (parentManager instanceof enchant.DomlessManager) {
            var parentX = parentManager._x;
            var parentY = parentManager._y;
            var parentSX = parentManager._scaleX;
            var parentSY = parentManager._scaleY;
            var parentRot = parentManager._rotation;

            var rad = -parentRot * Math.PI / 180;

            var ox = (typeof node._originX === 'number') ? node._originX : node._width / 2 | 0;
            var oy = (typeof node._originY === 'number') ? node._originY : node._height / 2 | 0;

            var rx = node._x + ox;
            var ry = node._y + oy;
            var rot = rotate(rad, rx, ry);
            var X = rot[0] * parentSX - ox;
            var Y = rot[1] * parentSY - oy;

            // subete childNode ga tsukau
            this._x = parentX + X;
            this._y = parentY + Y;
            this._scaleX = parentSX * node._scaleX;
            this._scaleY = parentSY * node._scaleY;
            this._rotation = parentRot + node._rotation;
        } else {
            this._x = node._x;
            this._y = node._y;
            this._scaleX = node._scaleX;
            this._scaleY = node._scaleY;
            this._rotation = node._rotation;
        }
        node._offsetX = this._x;
        node._offsetY = this._y;
    },
    remove: function() {
        this._domRef = [];
        this.targetNode = null;
    }
});
