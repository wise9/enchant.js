/**
 * @scope enchant.DOMScene.prototype
 */
enchant.DOMScene = enchant.Class.create(enchant.Group, {
	/**
     * @class
    [lang:ja]
    * 表示オブジェクトツリーのルートになるクラス.
    [/lang]
    [lang:en]
    * A Class that becomes the root of the display object tree.
    [/lang]
    [lang:de]
    * Eine Klasse die zur Wurzel im Darstellungsobjektbaum wird.
    [/lang]
    *
    * @example
    *   var scene = new DOMScene();
    *   scene.addChild(player);
    *   scene.addChild(enemy);
    *   game.pushScene(scene);
    *
    * @constructs
    * @extends enchant.Group
    */
    initialize: function() {
        enchant.Group.call(this);

        this._element = document.createElement('div');
        this._element.style.position = 'absolute';
        this._element.style.overflow = 'hidden';
        this._element.style.width = (this.width = enchant.Core.instance.width) + 'px';
        this._element.style.height = (this.height = enchant.Core.instance.height) + 'px';
        this._element.style[enchant.ENV.VENDOR_PREFIX + 'TransformOrigin'] = '0 0';
        this._element.style[enchant.ENV.VENDOR_PREFIX + 'Transform'] = 'scale(' + enchant.Core.instance.scale + ')';

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
                e.identifier = enchant.Core.instance._mousedownID;
                e._initPosition(x, y);
                that.dispatchEvent(e);
                that._mousedown = true;
            }, false);
            enchant.Core.instance._element.addEventListener('mousemove', function(e) {
                if (!that._mousedown) {
                    return;
                }
                var x = e.pageX;
                var y = e.pageY;
                e = new enchant.Event('touchmove');
                e.identifier = enchant.Core.instance._mousedownID;
                e._initPosition(x, y);
                that.dispatchEvent(e);
            }, false);
            enchant.Core.instance._element.addEventListener('mouseup', function(e) {
                if (!that._mousedown) {
                    return;
                }
                var x = e.pageX;
                var y = e.pageY;
                e = new enchant.Event('touchend');
                e.identifier = enchant.Core.instance._mousedownID;
                e._initPosition(x, y);
                that.dispatchEvent(e);
                that._mousedown = false;
            }, false);
        }
    },
    /**
    [lang:ja]
    * DOMSceneの背景色.
    * CSSの'color'プロパティと同様の形式で指定できる.
    [/lang]
    [lang:en]
    * The DOMScene background color.
    * Must be provided in the same format as the CSS 'color' property.
    [/lang]
    [lang:de]
    * Die Hintergrundfarbe der DOM Szene.
    * Muss im gleichen Format definiert werden wie das CSS 'color' Attribut.
    [/lang]
    * @type {String}
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