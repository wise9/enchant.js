/**
 * @scope enchant.KeyboardInputSource.prototype
 */
enchant.KeyboardInputSource = enchant.Class.create(enchant.BinaryInputSource, {
    /**
     * @name enchant.KeyboardInputSource
     * @class
     [lang:ja]
     * キーボード入力をラップするBinaryInputSource.
     * キーコードをidとして持つ.
     * @param {String} keyCode キーコード.
     [/lang]
     [lang:en]
     * @param {String} keyCode key code of BinaryInputSource.
     [/lang]
     [lang:de]
     * @param {String} keyCode
     [/lang]
     * @constructs
     * @extends enchant.BinaryInputSource
     */
    initialize: function(keyCode) {
        enchant.BinaryInputSource.call(this, keyCode);
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
 [lang:de]
 * @param {Number} keyCode
 [/lang]
 * @return {enchant.KeyboardInputSource} instance.
 */
enchant.KeyboardInputSource.getByKeyCode = function(keyCode) {
    if (!this._instances[keyCode]) {
        this._instances[keyCode] = new enchant.KeyboardInputSource(keyCode);
    }
    return this._instances[keyCode];
};
