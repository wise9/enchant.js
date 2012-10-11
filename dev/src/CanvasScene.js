/**
 * @scope enchant.Scene.prototype
 */
enchant.CanvasScene = enchant.Class.create(enchant.CanvasGroup, {
    /**
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
     */
    initialize: function() {
        enchant.CanvasGroup.call(this);
        this.scene = this;
    },
    /**
     * Scene background color.
     * Can indicate same format as CSS 'color' property.
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
        this._dirty = true;
    }
});
