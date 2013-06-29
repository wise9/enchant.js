/**
 * @scope enchant.KeyboardInputSource.prototype
 */
enchant.KeyboardInputSource = enchant.Class.create(enchant.InputSource, {
    /**
     * @name enchant.KeyboardInputSource
     * @class
     [lang:ja]
     * キーボード入力をラップするInputSource.
     * キーコードをidとして持つ.
     * @param {String} keyCode キーコード.
     [/lang]
     [lang:en]
     * @param {String} keyCode key code of InputSource.
     [/lang]
     * @constructs
     * @extends enchant.InputSource
     */
    initialize: function(keyCode) {
        enchant.InputSource.call(this, keyCode);
    }
});
/**
 * @private
 */
enchant.KeyboardInputSource._instances = {};
/**
 * @static
 [lang:ja]
 * キーコードに対応したインスタンスを取得する.
 * @param {Number} keyCode キーコード.
 [/lang]
 [lang:en]
 * Get the instance by key code.
 * @param {Number} keyCode key code.
 [/lang]
 * @return {enchant.KeyboardInputSource} instance.
 */
enchant.KeyboardInputSource.getByKeyCode = function(keyCode) {
    if (!this._instances[keyCode]) {
        this._instances[keyCode] = new enchant.KeyboardInputSource(keyCode);
    }
    return this._instances[keyCode];
};
