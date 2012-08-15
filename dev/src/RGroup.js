/**
 * @scope enchant.RGroup.prototype
 */
enchant.RGroup = enchant.Class.create(enchant.Group, {
    /**
     * 回転できるGroup。ただし高さ・幅を指定しなければならない
     *
     * @example
     *   var scene = new RotateGroup();
     *   scene.addChild(player);
     *   scene.addChild(enemy);
     *   game.pushScene(scene);
     *
     * @constructs
     * @extends enchant.Group
     */
    initialize: function(width, height) {
        enchant.Group.call(this);

        if (arguments.length < 2){
            throw("Width and height of RGroup must be specified");
        }
        this.width = width;
        this.height = height;
        this.rotationOrigin = {
            x: width / 2,
            y: height / 2
        };
        this._rotation = 0;
    },
    addChild: function(node) {
        enchant.Group.prototype.addChild.apply(this, arguments);
        node.transformOrigin = "0 0";
    },
    rotation: {
        get: function() {
            return this._rotation;
        },
        set: function(rotation) {
            var diff_rotation = (rotation - this._rotation);

            if (diff_rotation === 0){
                return;
            }
            var rad = diff_rotation / 180 * Math.PI;
            var sin = Math.sin(rad);
            var cos = Math.cos(rad);
            var origin = {
                x: this.width / 2,
                y: this.height / 2
            };

            for (var i = 0, len = this.childNodes.length; i < len; i++) {
                var node = this.childNodes[i];
                node.rotation -= diff_rotation;
                var rx = (node.x - origin.x);
                var ry = (node.y - origin.y);
                node.x = +cos * rx + sin * ry + origin.x;
                node.y = -sin * rx + cos * ry + origin.y;
            }

            this._rotation = rotation;
        }
    }
});


/**
 [lang:ja]
 * @scope enchant.Scene.prototype
 [/lang]
 [lang:en]
 * @scope enchant.Scene.prototype
 [/lang]
 */
enchant.Scene = enchant.Class.create(enchant.Group, {
    /**
     [lang:ja]
     * 表示オブジェクトツリーのルートになるクラス.
     *
     * @example
     *   var scene = new Scene();
     *   scene.addChild(player);
     *   scene.addChild(enemy);
     *   game.pushScene(scene);
     *
     * @constructs
     * @extends enchant.Group
     [/lang]
     [lang:en]
     * Class that becomes route for display object tree.
     *
     * @example
     *   var scene = new Scene();
     *   scene.addChild(player);
     *   scene.addChild(enemy);
     *   game.pushScene(scene);
     *
     * @constructs
     * @extends enchant.Group
     [/lang]
     */
    initialize: function() {
        var game = enchant.Game.instance;

        enchant.Group.call(this);

        this._element = document.createElement('div');
        this._element.style.position = 'absolute';
        this._element.style.overflow = 'hidden';
        this._element.style.width = (this.width = game.width) + 'px';
        this._element.style.height = (this.height = game.height) + 'px';
        this._element.style[enchant.ENV.VENDOR_PREFIX + 'TransformOrigin'] = '0 0';
        this._element.style[enchant.ENV.VENDOR_PREFIX + 'Transform'] = 'scale(' + game.scale + ')';

        this.scene = this;

        var that = this;
        if (enchant.ENV.TOUCH_ENABLED) {
            this._element.addEventListener('touchstart', function(e) {
                var touches = e.touches;
                for (var i = 0, len = touches.length; i < len; i++) {
                    e = new enchant.Event('touchstart');
                    e.identifier = touches[i].identifier;
                    e._initPosition(touches[i].pageX, touches[i].pageY);
                    that.dispatchEvent(e);
                }
            }, false);
            this._element.addEventListener('touchmove', function(e) {
                var touches = e.touches;
                for (var i = 0, len = touches.length; i < len; i++) {
                    e = new enchant.Event('touchmove');
                    e.identifier = touches[i].identifier;
                    e._initPosition(touches[i].pageX, touches[i].pageY);
                    that.dispatchEvent(e);
                }
            }, false);
            this._element.addEventListener('touchend', function(e) {
                var touches = e.changedTouches;
                for (var i = 0, len = touches.length; i < len; i++) {
                    e = new enchant.Event('touchend');
                    e.identifier = touches[i].identifier;
                    e._initPosition(touches[i].pageX, touches[i].pageY);
                    that.dispatchEvent(e);
                }
            }, false);
        } else {
            this._element.addEventListener('mousedown', function(e) {
                var x = e.pageX;
                var y = e.pageY;
                e = new enchant.Event('touchstart');
                e.identifier = game._mousedownID;
                e._initPosition(x, y);
                that.dispatchEvent(e);
                that._mousedown = true;
            }, false);
            game._element.addEventListener('mousemove', function(e) {
                if (!that._mousedown){
                    return;
                }
                var x = e.pageX;
                var y = e.pageY;
                e = new enchant.Event('touchmove');
                e.identifier = game._mousedownID;
                e._initPosition(x, y);
                that.dispatchEvent(e);
            }, false);
            game._element.addEventListener('mouseup', function(e) {
                if (!that._mousedown){
                    return;
                }
                var x = e.pageX;
                var y = e.pageY;
                e = new enchant.Event('touchend');
                e.identifier = game._mousedownID;
                e._initPosition(x, y);
                that.dispatchEvent(e);
                that._mousedown = false;
            }, false);
        }
    },
    /**
     [lang:ja]
     * Sceneの背景色.
     * CSSの'color'プロパティと同様の形式で指定できる.
     * @type {String}
     [/lang]
     [lang:en]
     * Scene background color.
     * Can indicate same format as CSS 'color' property.
     * @type {String}
     [/lang]
     */
    backgroundColor: {
        get: function() {
            return this._backgroundColor;
        },
        set: function(color) {
            this._element.style.backgroundColor = this._backgroundColor = color;
        }
    },
    _updateCoordinate: function() {
        this._offsetX = this._x;
        this._offsetY = this._y;
        for (var i = 0, len = this.childNodes.length; i < len; i++) {
            this.childNodes[i]._updateCoordinate();
        }
    }
});
