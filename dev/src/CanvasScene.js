/**
 * @scope enchant.CanvasScene.prototype
 * @type {*}
 */
enchant.CanvasScene = enchant.Class.create(enchant.Scene, {
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
        this._layers.Canvas.insertBefore(child, next);
        child._layer = this._layers.Canvas;
    },
    _onenter: function() {
        this._layers.Canvas._startRendering();
        enchant.Game.instance.addEventListener('exitframe', this._dispatchExitframe);
    },
    _onexit: function() {
        this._layers.Canvas._stopRendering();
        enchant.Game.instance.removeEventListener('exitframe', this._dispatchExitframe);
    }
});
