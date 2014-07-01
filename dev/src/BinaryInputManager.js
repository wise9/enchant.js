/**
 * @scope enchant.BinaryInputManager.prototype
 */
enchant.BinaryInputManager = enchant.Class.create(enchant.InputManager, {
    /**
     * @name enchant.BinaryInputManager
     * @class
     [lang:ja]
     * 入力を管理するためのクラス.
     * @param {*} flagStore 入力のフラグを保持させるオブジェクト.
     * @param {String} activeEventNameSuffix イベント名の接尾辞.
     * @param {String} inactiveEventNameSuffix イベント名の接尾辞.
     * @param {*} [source=this] イベントに付加される入力のソース.
     [/lang]
     [lang:en]
     * Class for managing input.
     * @param {*} flagStore object that store input flag.
     * @param {String} activeEventNameSuffix event name suffix.
     * @param {String} inactiveEventNameSuffix event name suffix.
     * @param {*} [source=this] source that will be added to event object.
     [/lang]
     [lang:de]
     * @param {*} flagStore
     * @param {String} activeEventNameSuffix
     * @param {String} inactiveEventNameSuffix
     * @param {*} [source=this] source
     [/lang]
     * @constructs
     * @extends enchant.InputManager
     */
    initialize: function(flagStore, activeEventNameSuffix, inactiveEventNameSuffix, source) {
        enchant.InputManager.call(this, flagStore, source);
        /**
         [lang:ja]
         * アクティブな入力の数.
         [/lang]
         [lang:en]
         * The number of active inputs.
         [/lang]
         [lang:de]
         [/lang]
         * @type Number
         */
        this.activeInputsNum = 0;
        /**
         [lang:ja]
         * BinaryInputManagerが発行するイベント名の接尾辞.
         [/lang]
         [lang:en]
         * event name suffix that dispatched by BinaryInputManager.
         [/lang]
         [lang:de]
         [/lang]
         * @type String
         */
        this.activeEventNameSuffix = activeEventNameSuffix;
        /**
         [lang:ja]
         * BinaryInputManagerが発行するイベント名の接尾辞.
         [/lang]
         [lang:en]
         * event name suffix that dispatched by BinaryInputManager.
         [/lang]
         [lang:de]
         [/lang]
         * @type String
         */
        this.inactiveEventNameSuffix = inactiveEventNameSuffix;
    },
    /**
     [lang:ja]
     * 特定の入力に名前をつける.
     * @param {enchant.BinaryInputSource} inputSource {@link enchant.InputSource}のインスタンス.
     * @param {String} name 入力につける名前.
     [/lang]
     [lang:en]
     * Name specified input.
     * @param {enchant.BinaryInputSource} inputSource input source.
     * @param {String} name input name.
     [/lang]
     [lang:de]
     * @param {enchant.BinaryInputSource} inputSource
     * @param {String} name
     [/lang]
     * @see enchant.InputManager#bind
     */
    bind: function(binaryInputSource, name) {
        enchant.InputManager.prototype.bind.call(this, binaryInputSource, name);
        this.valueStore[name] = false;
    },
    /**
     [lang:ja]
     * 入力のバインドを解除する.
     * @param {enchant.BinaryInputSource} inputSource {@link enchant.InputSource}のインスタンス.
     [/lang]
     [lang:en]
     * Remove binded name.
     * @param {enchant.BinaryInputSource} inputSource input source.
     [/lang]
     [lang:de]
     * @param {enchant.BinaryInputSource} inputSource
     [/lang]
     * @see enchant.InputManager#unbind
     */
    unbind: function(binaryInputSource) {
        var name = this._binds[binaryInputSource.identifier];
        enchant.InputManager.prototype.unbind.call(this, binaryInputSource);
        delete this.valueStore[name];
    },
    /**
     [lang:ja]
     * 入力の状態を変更する.
     * @param {String} name 入力の名前.
     * @param {Boolean} bool 入力の状態.
     [/lang]
     [lang:en]
     * Change state of input.
     * @param {String} name input name.
     * @param {Boolean} bool input state.
     [/lang]
     [lang:de]
     * @param {String} name
     * @param {Boolean} bool
     [/lang]
     */
    changeState: function(name, bool) {
        if (bool) {
            this._down(name);
        } else {
            this._up(name);
        }
    },
    _down: function(name) {
        var inputEvent;
        if (!this.valueStore[name]) {
            this.valueStore[name] = true;
            inputEvent = new enchant.Event((this.activeInputsNum++) ? 'inputchange' : 'inputstart');
            inputEvent.source = this.source;
            this.broadcastEvent(inputEvent);
        }
        var downEvent = new enchant.Event(name + this.activeEventNameSuffix);
        downEvent.source = this.source;
        this.broadcastEvent(downEvent);
    },
    _up: function(name) {
        var inputEvent;
        if (this.valueStore[name]) {
            this.valueStore[name] = false;
            inputEvent = new enchant.Event((--this.activeInputsNum) ? 'inputchange' : 'inputend');
            inputEvent.source = this.source;
            this.broadcastEvent(inputEvent);
        }
        var upEvent = new enchant.Event(name + this.inactiveEventNameSuffix);
        upEvent.source = this.source;
        this.broadcastEvent(upEvent);
    }
});
