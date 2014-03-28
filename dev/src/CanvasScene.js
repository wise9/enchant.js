/**
 * @scope enchant.CanvasScene.prototype
 */
enchant.CanvasScene = enchant.Class.create(enchant.Scene, {
    /**
     * @name enchant.CanvasScene
     * @class
     [lang:ja]
     * すべての子をCanvasに描画するScene.
     [/lang]
     [lang:en]
     * Scene to draw by the Canvas all of the children.
     [/lang]
     [lang:de]
     [/lang]
     * @constructs
     * @extends enchant.Scene
     */
    initialize: function() {
        enchant.Scene.call(this);
        this.addLayer('Canvas');
    },
    _determineEventTarget: function(e) {
        var target = this._layers.Canvas._determineEventTarget(e);
        if (!target) {
            target = this;
        }
        return target;
    },
    _onchildadded: function(e) {
        var child = e.node;
        var next = e.next;
        child._layer = this._layers.Canvas;
        this._layers.Canvas.insertBefore(child, next);
    },
    _onenter: function() {
        this._layers.Canvas._startRendering();
        enchant.Core.instance.addEventListener('exitframe', this._dispatchExitframe);
    },
    _onexit: function() {
        this._layers.Canvas._stopRendering();
        enchant.Core.instance.removeEventListener('exitframe', this._dispatchExitframe);
    }
});
