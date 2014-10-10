/**
 * @scope enchant.KeyboardInputManager.prototype
 */
enchant.KeyboardInputManager = enchant.Class.create(enchant.BinaryInputManager, {
    /**
     * @name enchant.KeyboardInputManager
     * @class
     [lang:ja]
     * キーボード入力を管理するためのクラス.
     * @param {HTMLElement} dom element that will be watched.
     * @param {*} flagStore object that store input flag.
     [/lang]
     [lang:en]
     * Class that manage keyboard input.
     * @param {HTMLElement} dom element that will be watched.
     * @param {*} flagStore object that store input flag.
     [/lang]
     [lang:de]
     * @param {HTMLElement} dom
     * @param {*} flagStore
     [/lang]
     * @constructs
     * @extends enchant.BinaryInputManager
     */
    initialize: function(domElement, flagStore) {
        enchant.BinaryInputManager.call(this, flagStore, 'buttondown', 'buttonup');
        this._attachDOMEvent(domElement, 'keydown', true);
        this._attachDOMEvent(domElement, 'keyup', false);
    },
    /**
     [lang:ja]
     * キーコードに対応したBinaryInputSourceを使って{@link enchant.BinaryInputManager#bind} を呼び出す.
     * @param {Number} keyCode キーコード.
     * @param {String} name 入力の名前.
     [/lang]
     [lang:en]
     * Call {@link enchant.BinaryInputManager#bind} with BinaryInputSource equivalent of key code.
     * @param {Number} keyCode key code.
     * @param {String} name input name.
     [/lang]
     [lang:de]
     * @param {Number} keyCode
     * @param {String} name
     [/lang]
     */
    keybind: function(keyCode, name) {
        this.bind(enchant.KeyboardInputSource.getByKeyCode('' + keyCode), name);
    },
    /**
     [lang:ja]
     * キーコードに対応したBinaryInputSourceを使って{@link enchant.BinaryInputManager#unbind} を呼び出す.
     * @param {Number} keyCode キーコード.
     [/lang]
     [lang:en]
     * Call {@link enchant.BinaryInputManager#unbind} with BinaryInputSource equivalent of key code.
     * @param {Number} keyCode key code.
     [/lang]
     [lang:de]
     * @param {Number} keyCode
     [/lang]
     */
    keyunbind: function(keyCode) {
        this.unbind(enchant.KeyboardInputSource.getByKeyCode('' + keyCode));
    },
    _attachDOMEvent: function(domElement, eventType, state) {
        domElement.addEventListener(eventType, function(e) {
            var core = enchant.Core.instance;
            if (!core || !core.running) {
                return;
            }
            var code = e.keyCode;
            var source = enchant.KeyboardInputSource._instances[code];
            if (source) {
                source.notifyStateChange(state);
            }
        }, true);
    }
});
