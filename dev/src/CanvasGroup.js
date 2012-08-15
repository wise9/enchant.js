/**
 * @scope enchant.CanvasGroup
 */
enchant.CanvasGroup = enchant.Class.create(enchant.Group, {
    initialize: function() {
        var game = enchant.Game.instance;
        var that = this;
        enchant.Group.call(this);
        this._dirty = false;
        this._rotation = 0;
        this._cvsCache = {};
        this._cvsCache.matrix = [ 1, 0, 0, 1, 0, 0];
        this._cvsCache.detectColor = '#000000';
        this.width = game.width;
        this.height = game.height;

        var sceneEvents = [
            enchant.Event.ADDED_TO_SCENE,
            enchant.Event.REMOVED_FROM_SCENE
        ];
        sceneEvents.forEach(function(event) {
            this.addEventListener(event, function(e) {
                this.childNodes.forEach(function(child) {
                    child.scene = this.scene;
                    child.dispatchEvent(e);
                }, this);
            });
        }, this);

        this._element = document.createElement('canvas');
        this._element.width = game.width;
        this._element.height = game.height;
        this._element.style.position = 'absolute';

        this._detect = document.createElement('canvas');
        this._detect.width = game.width;
        this._detect.height = game.height;
        this._detect.style.position = 'absolute';

        this.context = this._element.getContext('2d');
        this._dctx = this._detect.getContext('2d');

        this._colorManager = new DetectColorManager(16, 256);

        if (enchant.ENV.TOUCH_ENABLED) {
            this._element.addEventListener('touchstart', function(e) {
                var touches = e.touches;
                for (var i = 0, len = touches.length; i < len; i++) {
                    e = new enchant.Event('touchstart');
                    e.identifier = touches[i].identifier;
                    e._initPosition(touches[i].pageX, touches[i].pageY);
                    _touchstartFromDom.call(that, e);
                }
            }, false);
            this._element.addEventListener('touchmove', function(e) {
                var touches = e.touches;
                for (var i = 0, len = touches.length; i < len; i++) {
                    e = new enchant.Event('touchmove');
                    e.identifier = touches[i].identifier;
                    e._initPosition(touches[i].pageX, touches[i].pageY);
                    _touchmoveFromDom.call(that, e);
                }
            }, false);
            this._element.addEventListener('touchend', function(e) {
                var touches = e.changedTouches;
                for (var i = 0, len = touches.length; i < len; i++) {
                    e = new enchant.Event('touchend');
                    e.identifier = touches[i].identifier;
                    e._initPosition(touches[i].pageX, touches[i].pageY);
                    _touchendFromDom.call(that, e);
                }
            }, false);
        } else {
            this._element.addEventListener('mousedown', function(e) {
                var x = e.pageX;
                var y = e.pageY;
                e = new enchant.Event('touchstart');
                e.identifier = game._mousedownID;
                e._initPosition(x, y);
                _touchstartFromDom.call(that, e);
                that._mousedown = true;
            }, false);
            game._element.addEventListener('mousemove', function(e) {
                if (!that._mousedown) return;
                var x = e.pageX;
                var y = e.pageY;
                e = new enchant.Event('touchmove');
                e.identifier = game._mousedownID;
                e._initPosition(x, y);
                _touchmoveFromDom.call(that, e);
            }, false);
            game._element.addEventListener('mouseup', function(e) {
                if (!that._mousedown) return;
                var x = e.pageX;
                var y = e.pageY;
                e = new enchant.Event('touchend');
                e.identifier = game._mousedownID;
                e._initPosition(x, y);
                _touchendFromDom.call(that, e);
                that._mousedown = false;
            }, false);
        }
        var start = [
            enchant.Event.ENTER,
            enchant.Event.ADDED_TO_SCENE
        ];
        var end = [
            enchant.Event.EXIT,
            enchant.Event.REMOVED_FROM_SCENE
        ];
        start.forEach(function(type) {
            this.addEventListener(type, this._startRendering);
            this.addEventListener(type, function() {
                canvasGroupInstances.push(this);
            });
        }, this);
        end.forEach(function(type) {
            this.addEventListener(type, this._stopRendering);
            this.addEventListener(type, function() {
                var i = canvasGroupInstances.indexOf(this);
                if (i != -1) {
                    canvasGroupInstances.splice(i, 1);
                }
            });
        }, this);

        this._onexitframe = function() {
            var ctx = that.context;
            ctx.clearRect(0, 0, game.width, game.height);
            checkCache.call(that, that._colorManager);
            rendering.call(that, ctx);
        };
    },
    _startRendering: function() {
        var game = enchant.Game.instance;
        if (!game._listeners['exitframe']) game._listeners['exitframe'] = [];
        game._listeners['exitframe'].push(this._onexitframe);
    },
    _stopRendering: function() {
        var game = enchant.Game.instance;
        game.removeEventListener('exitframe', this._onexitframe);
    },
    _getEntityByPosition: function(x, y) {
        var ctx = this._dctx;
        ctx.clearRect(0, 0, this.width, this.height);
        detectrendering.call(this, ctx);
        var color = ctx.getImageData(x, y, 1, 1).data;
        return this._colorManager.getSpriteByColor(color);
    },
    _touchstartPropagation: function(e) {
        var sp = this._getEntityByPosition(e.x, e.y);
        if (sp) {
            this._touching = sp;
            propagationUp.call(this._touching, e, this.parentNode);
        } else {
            sp = null;
        }
        return sp;
    },
    _touchmovePropagation: function(e) {
        if (this._touching != null) {
            propagationUp.call(this._touching, e, this.parentNode);
        }
    },
    _touchendPropagation: function(e) {
        if (this._touching != null) {
            propagationUp.call(this._touching, e, this.parentNode);
            this._touching = null;
        }
    },
    rotation: {
        get: function() {
            return this._rotation;
        },
        set: function(rot) {
            this._rotation = rot;
            this._dirty = true;
        }
    },
    scaleX: {
        get: function() {
            return this._scaleX;
        },
        set: function(scale) {
            this._scaleX = scale;
            this._dirty = true;
        }
    },
    scaleY: {
        get: function() {
            return this._scaleY;
        },
        set: function(scale) {
            this._scaleY = scale;
            this._dirty = true;
        }
    },
    addChild: function(node) {
        this.childNodes.push(node);
        node.parentNode = this;
        node.dispatchEvent(new enchant.Event('added'));
        if (this.scene) {
            node.scene = this.scene;
            var e = new enchant.Event('addedtoscene');
            _onaddedtoscene.call(node, e, this._colorManager);
        }
    },
    insertBefore: function(node, reference) {
        var i = this.childNodes.indexOf(reference);
        if (i != -1) {
            this.childNodes.splice(i, 0, node);
            node.dispatchEvent(new enchant.Event('added'));
            if (this.scene) {
                node.scene = this.scene;
                var e = new enchant.Event('addedtoscene');
                _onaddedtoscene.call(node, e, this._colorManager);
            }
        } else {
            this.addChild(node);
        }
    },
    removeChild: function(node) {
        var i;
        if ((i = this.childNodes.indexOf(node)) != -1) {
            this.childNodes.splice(i, 1);
        }
        node.parentNode = null;
        node.dispatchEvent(new enchant.Event('removed'));
        if (this.scene) {
            node.scene = null;
            var e = new enchant.Event('removedfromscene');
            _onremovedfromscene.call(node, e, this._colorManager);
        }
    }
});