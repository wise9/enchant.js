/**
 * @scope enchant.BinaryInputSource.prototype
 */
enchant.BinaryInputSource = enchant.Class.create(enchant.EventTarget, {
    /**
     * @name enchant.BinaryInputSource
     * @class
     [lang:ja]
     * 任意の入力をラップするクラス.
     * @param {String} identifier identifier of BinaryInputSource.
     [/lang]
     [lang:en]
     * Class that wrap input.
     * @param {String} identifier 入力のid.
     [/lang]
     * @constructs
     * @extends enchant.EventTarget
     */
    initialize: function(identifier) {
        enchant.EventTarget.call(this);
        /**
         [lang:ja]
         * 入力のid.
         [/lang]
         [lang:en]
         * Identifier of BinaryInputSource.
         [/lang]
         * @type {String}
         */
        this.identifier = identifier;
    },
    /**
     [lang:ja]
     * 入力の状態変更をイベントで通知する.
     * @param {Boolean} state 新しい状態.
     [/lang]
     [lang:en]
     * Notify state change by event.
     * @param {Boolean} state state.
     [/lang]
     */
    notifyStateChange: function(state) {
        var e = new enchant.Event(enchant.Event.INPUT_STATE_CHANGED);
        e.state = state;
        e.source = this;
        this.dispatchEvent(e);
    }
});
