/**
 * @scope enchant.CanvasScene.prototype
 * @type {*}
 */
enchant.DOMScene = enchant.Class.create(enchant.Scene, {
    initialize: function() {
        enchant.Scene.call(this);
        this.addLayer('Dom');
    },
    _determineEventTarget: function(e) {
        var target = this._layers.Dom._determineEventTarget(e);
        if (!target) {
            target = this;
        }
        return target;
    },
    _onchildadded: function(e) {
        var child = e.node;
        var next = e.next;
        child._layer = this._layers.Dom;
        this._layers.Dom.insertBefore(child, next);
    },
    _onenter: function() {
        this._layers.Dom._startRendering();
        enchant.Core.instance.addEventListener('exitframe', this._dispatchExitframe);
    },
    _onexit: function() {
        this._layers.Dom._stopRendering();
        enchant.Core.instance.removeEventListener('exitframe', this._dispatchExitframe);
    }
});
