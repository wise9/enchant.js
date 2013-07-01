/**
 * @scope enchant.InputManager.prototype
 */
enchant.InputManager = enchant.Class.create(enchant.EventTarget, {
    /**
     * @name enchant.InputManager
     * @class
     [lang:ja]
     * 入力を管理するためのクラス.
     * @param {*} flagStore 入力のフラグを保持させるオブジェクト.
     * @param {String} activeEventNameSuffix イベント名の接尾辞.
     * @param {String} inactiveEventNameSuffix イベント名の接尾辞.
     [/lang]
     [lang:en]
     * Class for managing input.
     * @param {*} flagStore object that store input flag.
     * @param {String} activeEventNameSuffix event name suffix.
     * @param {String} inactiveEventNameSuffix event name suffix.
     [/lang]
     * @constructs
     * @extends enchant.EventTarget
     */
    initialize: function(flagStore, activeEventNameSuffix, inactiveEventNameSuffix) {
        enchant.EventTarget.call(this);
        /**
         [lang:ja]
         * アクティブな入力の数.
         [/lang]
         [lang:en]
         * The number of active inputs.
         [/lang]
         * @type {Number}
         */
        this.activeInputsNum = 0;
        /**
         [lang:ja]
         * 入力の変化を通知する対象を保持する配列.
         [/lang]
         [lang:en]
         * Array that store event target.
         [/lang]
         * @type {enchant.EventTarget[]}
         */
        this.broadcastTarget = [];
        /**
         [lang:ja]
         * 入力の状態を真偽値で保持する連想配列.
         [/lang]
         [lang:en]
         * Object that store input flag.
         [/lang]
         * @type {Object}
         */
        this.flagStore = flagStore;
        /**
         [lang:ja]
         * InputManagerが発行するイベント名の接尾辞.
         [/lang]
         [lang:en]
         * event name suffix that dispatched by InputManager.
         [/lang]
         * @type {String}
         */
        this.activeEventNameSuffix = activeEventNameSuffix;
        /**
         [lang:ja]
         * InputManagerが発行するイベント名の接尾辞.
         [/lang]
         [lang:en]
         * event name suffix that dispatched by InputManager.
         [/lang]
         * @type {String}
         */
        this.inactiveEventNameSuffix = inactiveEventNameSuffix;

        this._binds = {};
        this._stateHandler = function(e) {
            var id = e.source.identifier;
            var name = this._binds[id];
            this.changeState(name, e.state);
        }.bind(this);
    },
    /**
     [lang:ja]
     * 入力の変化を通知する対象を追加する.
     [/lang]
     [lang:en]
     * Add event target.
     [/lang]
     * @param {enchant.EventTarget} eventTarget broadcast target.
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
     [/lang]
     [lang:en]
     * Remove event target.
     [/lang]
     * @param {enchant.EventTarget} eventTarget broadcast target.
     */
    removeBroadcastTarget: function(eventTarget) {
        var i = this.broadcastTarget.indexOf(eventTarget);
        if (i !== -1) {
            this.broadcastTarget.splice(i, 1);
        }
    },
    /**
     [lang:ja]
     * イベントを{@link enchant.InputManager#broadcastTarget}に発行する.
     [/lang]
     [lang:en]
     * Dispatch event to {@link enchant.InputManager#broadcastTarget}.
     [/lang]
     * @param {enchant.Event} e event.
     */
    broadcastEvent: function(e) {
        var target = this.broadcastTarget;
        for (var i = 0, l = target.length; i < l; i++) {
            target[i].dispatchEvent(e);
        }
    },
    /**
     [lang:ja]
     * 特定の入力に名前をつける.
     * 入力はフラグとイベントで監視できるようになる.
     [/lang]
     [lang:en]
     * Name specified input.
     * Input can be watched by flag or event.
     [/lang]
     * @param {enchant.InputSource} inputSource input source.
     * @param {String} name input name.
     */
    bind: function(inputSource, name) {
        inputSource.addEventListener(enchant.Event.INPUT_STATE_CHANGED, this._stateHandler);
        this._binds[inputSource.identifier] = name;
        this.flagStore[name] = false;
    },
    /**
     [lang:ja]
     * 入力のバインドを解除する.
     [/lang]
     [lang:en]
     * Remove binded name.
     [/lang]
     * @param {enchant.InputSource} inputSource input source.
     */
    unbind: function(inputSource) {
        inputSource.removeEventListener(enchant.Event.INPUT_STATE_CHANGED, this._stateHandler);
        var name = this._binds[inputSource.identifier];
        delete this._binds[inputSource.identifier];
        delete this.flagStore[name];
    },
    /**
     [lang:ja]
     * 入力の状態変更を変更する.
     [/lang]
     [lang:en]
     * Change state of input.
     [/lang]
     * @param {String} name input name.
     * @param {Boolean} bool input state.
     */
    changeState: function(name, bool) {
        var inputEvent;
        if (bool) {
            this._down(name);
        } else {
            this._up(name);
        }
    },
    _down: function(name) {
        var inputEvent;
        if (!this.flagStore[name]) {
            this.flagStore[name] = true;
            inputEvent = new enchant.Event((this.activeInputsNum++) ? 'inputchange' : 'inputstart');
            inputEvent.manager = this;
            this.broadcastEvent(inputEvent);
        }
        var downEvent = new enchant.Event(name + this.activeEventNameSuffix);
        this.broadcastEvent(downEvent);
    },
    _up: function(name) {
        var inputEvent;
        if (this.flagStore[name]) {
            this.flagStore[name] = false;
            inputEvent = new enchant.Event((--this.activeInputsNum) ? 'inputchange' : 'inputend');
            inputEvent.manager = this;
            this.broadcastEvent(inputEvent);
        }
        var upEvent = new enchant.Event(name + this.inactiveEventNameSuffix);
        this.broadcastEvent(upEvent);
    }
});
