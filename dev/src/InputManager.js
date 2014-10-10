/**
 * @scope enchant.InputManager.prototype
 */
enchant.InputManager = enchant.Class.create(enchant.EventTarget, {
    /**
     * @name enchant.InputManager
     * @class
     [lang:ja]
     * 入力を管理するためのクラス.
     * @param {*} valueStore 入力の状態を保持させるオブジェクト.
     * @param {*} [source=this] イベントに付加される入力のソース.
     [/lang]
     [lang:en]
     * Class for managing input.
     * @param {*} valueStore object that store input state.
     * @param {*} [source=this] source that will be added to event object.
     [/lang]
     [lang:de]
     * @param {*} valueStore
     * @param {*} [source=this]
     [/lang]
     * @constructs
     * @extends enchant.EventTarget
     */
    initialize: function(valueStore, source) {
        enchant.EventTarget.call(this);

        /**
         [lang:ja]
         * 入力の変化を通知する対象を保持する配列.
         [/lang]
         [lang:en]
         * Array that store event target.
         [/lang]
         * @type enchant.EventTarget[]
         */
        this.broadcastTarget = [];
        /**
         [lang:ja]
         * 入力の状態を保持する連想配列.
         [/lang]
         [lang:en]
         * Object that store input state.
         [/lang]
         * @type Object
         */
        this.valueStore = valueStore;
        /**
         [lang:ja]
         * イベントに付加される入力のソース.
         [/lang]
         [lang:en]
         * source that will be added to event object.
         [/lang]
         * @type Object
         */
        this.source = source || this;

        this._binds = {};

        this._stateHandler = function(e) {
            var id = e.source.identifier;
            var name = this._binds[id];
            this.changeState(name, e.data);
        }.bind(this);
    },
    /**
     [lang:ja]
     * 特定の入力に名前をつける.
     * 入力はフラグとイベントで監視できるようになる.
     * @param {enchant.InputSource} inputSource {@link enchant.InputSource} のインスタンス.
     * @param {String} name 入力につける名前.
     [/lang]
     [lang:en]
     * Name specified input.
     * Input can be watched by flag or event.
     * @param {enchant.InputSource} inputSource input source.
     * @param {String} name input name.
     [/lang]
     [lang:de]
     * @param {enchant.InputSource} inputSource
     * @param {String} name
     [/lang]
     */
    bind: function(inputSource, name) {
        inputSource.addEventListener(enchant.Event.INPUT_STATE_CHANGED, this._stateHandler);
        this._binds[inputSource.identifier] = name;
    },
    /**
     [lang:ja]
     * 入力のバインドを解除する.
     * @param {enchant.InputSource} inputSource {@link enchant.InputSource} のインスタンス.
     [/lang]
     [lang:en]
     * Remove binded name.
     * @param {enchant.InputSource} inputSource input source.
     [/lang]
     [lang:de]
     * @param {enchant.InputSource} inputSource
     [/lang]
     */
    unbind: function(inputSource) {
        inputSource.removeEventListener(enchant.Event.INPUT_STATE_CHANGED, this._stateHandler);
        delete this._binds[inputSource.identifier];
    },
    /**
     [lang:ja]
     * 入力の変化を通知する対象を追加する.
     * @param {enchant.EventTarget} eventTarget イベントの通知を設定したい対象.
     [/lang]
     [lang:en]
     * Add event target.
     * @param {enchant.EventTarget} eventTarget broadcast target.
     [/lang]
     [lang:de]
     * @param {enchant.EventTarget} eventTarget
     [/lang]
     */
    addBroadcastTarget: function(eventTarget) {
        var i = this.broadcastTarget.indexOf(eventTarget);
        if (i === -1) {
            this.broadcastTarget.push(eventTarget);
        }
    },
    /**
     [lang:ja]
     * 入力の変化を通知する対象を削除する.
     * @param {enchant.EventTarget} eventTarget イベントの通知を削除したい対象.
     [/lang]
     [lang:en]
     * Remove event target.
     * @param {enchant.EventTarget} eventTarget broadcast target.
     [/lang]
     [lang:de]
     * @param {enchant.EventTarget} eventTarget
     [/lang]
     */
    removeBroadcastTarget: function(eventTarget) {
        var i = this.broadcastTarget.indexOf(eventTarget);
        if (i !== -1) {
            this.broadcastTarget.splice(i, 1);
        }
    },
    /**
     [lang:ja]
     * イベントを {@link enchant.InputManager#broadcastTarget} に発行する.
     * @param {enchant.Event} e イベント.
     [/lang]
     [lang:en]
     * Dispatch event to {@link enchant.InputManager#broadcastTarget}.
     * @param {enchant.Event} e event.
     [/lang]
     [lang:de]
     * @param {enchant.Event} e
     [/lang]
     */
    broadcastEvent: function(e) {
        var target = this.broadcastTarget;
        for (var i = 0, l = target.length; i < l; i++) {
            target[i].dispatchEvent(e);
        }
    },
    /**
     [lang:ja]
     * 入力の状態を変更する.
     * @param {String} name 入力の名前.
     * @param {*} data 入力の状態.
     [/lang]
     [lang:en]
     * Change state of input.
     * @param {String} name input name.
     * @param {*} data input state.
     [/lang]
     [lang:de]
     * @param {String} name
     * @param {*} data
     [/lang]
     */
    changeState: function(name, data) {
    }
});
