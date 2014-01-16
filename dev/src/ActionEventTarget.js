/**
 * @scope enchant.ActionEventTarget.prototype
 */
enchant.ActionEventTarget = enchant.Class.create(enchant.EventTarget, {
    /**
     * @name enchant.ActionEventTarget
     * @class
     [lang:ja]
     * timelineの {@link enchant.Action} クラス向けに拡張された {@link enchant.EventTarget} クラス.
     [/lang]
     [lang:en]
     * EventTarget which can change the context of event listeners.
     [/lang]
     [lang:de]
     [/lang]
     * @constructs
     * @extends enchant.EventTarget
     */
    initialize: function() {
        enchant.EventTarget.apply(this, arguments);
    },
    dispatchEvent: function(e) {
        var target;
        if (this.node) {
            target = this.node;
            e.target = target;
            e.localX = e.x - target._offsetX;
            e.localY = e.y - target._offsetY;
        } else {
            this.node = null;
        }

        if (this['on' + e.type] != null) {
            this['on' + e.type].call(target, e);
        }
        var listeners = this._listeners[e.type];
        if (listeners != null) {
            listeners = listeners.slice();
            for (var i = 0, len = listeners.length; i < len; i++) {
                listeners[i].call(target, e);
            }
        }
    }
});
