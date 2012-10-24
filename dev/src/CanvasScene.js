/**
 * @scope enchant.Scene.prototype
 */
enchant.CanvasScene = enchant.Class.create(enchant.CanvasLayer, {
    /**
     [lang:ja]
     * 表示オブジェクトツリーのルートになるクラス.
     [/lang]
     [lang:en]
     * Class that becomes the root of the display object tree.
     [/lang]
     [lang:de]
     * Eine Klasse die zur Wurzel im Darstellungsobjektbaum wird.
     [/lang]
     *
     * @example
     *   var scene = new CanvasScene();
     *   scene.addChild(player);
     *   scene.addChild(enemy);
     *   game.pushScene(scene);
     *
     * @constructs
     * @extends enchant.CanvasGroup
     */
    initialize: function() {
        enchant.CanvasLayer.call(this);
        this.scene = this;
        this._element.style[enchant.ENV.VENDOR_PREFIX + 'TransformOrigin'] = '0 0';
        this._element.style[enchant.ENV.VENDOR_PREFIX + 'Transform'] = 'scale(' + enchant.Game.instance.scale + ')';
    },
    /**
     [lang:ja]
     * CanvasSceneの背景色.
     * CSSの'color'プロパティと同様の形式で指定できる.
     [/lang]
     [lang:en]
     * The CanvasScene background color.
     * Must be provided in the same format as the CSS 'color' property.
     [/lang]
     [lang:de]
     * Die Hintergrundfarbe der Canvas Szene.
     * Muss im gleichen Format definiert werden wie das CSS 'color' Attribut.
     [/lang]
     * @type {String}
     */
    backgroundColor: {
        get: function() {
            return this._backgroundColor;
        },
        set: function(color) {
            this._backgroundColor = color;
        }
    },
    _updateCoordinate: function() {
        this._offsetX = this._x;
        this._offsetY = this._y;
        for (var i = 0, len = this.childNodes.length; i < len; i++) {
            this.childNodes[i]._updateCoordinate();
        }
        this._dirty = true;
    }
});
