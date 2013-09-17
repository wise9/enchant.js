/**
 * @scope enchant.InputSource.prototype
 */
enchant.InputSource = enchant.Class.create(enchant.EventTarget, {
    /**
     * @name enchant.InputSource
     * @class
     [lang:ja]
     * 任意の入力をラップするクラス.
     * @param {String} identifier 入力のid.
     [/lang]
     [lang:en]
     * Class that wrap input.
     * @param {String} identifier identifier of InputSource.
     [/lang]
     * @constructs
     * @extends enchant.EventTarget
     */
    initialize: function(identifier) {
        enchant.EventTarget.call(this);
        this.identifier = identifier;
    },
    /**
     [lang:ja]
     * 入力の状態変更をイベントで通知する.
     * @param {*} data 新しい状態.
     [/lang]
     [lang:en]
     * Notify state change by event.
     * @param {*} data state.
     [/lang]
     */
    notifyStateChange: function(data) {
        var e = new enchant.Event(enchant.Event.INPUT_STATE_CHANGED);
        e.data = data;
        e.source = this;
        this.dispatchEvent(e);
    }
});
