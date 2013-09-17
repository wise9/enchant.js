/**
 * @scope enchant.BinaryInputSource.prototype
 */
enchant.BinaryInputSource = enchant.Class.create(enchant.InputSource, {
    /**
     * @name enchant.BinaryInputSource
     * @class
     [lang:ja]
     * 任意の2値入力をラップするクラス.
     * @param {String} identifier 入力のid.
     [/lang]
     [lang:en]
     * Class that wrap binary input.
     * @param {String} identifier identifier of BinaryInputSource.
     [/lang]
     * @constructs
     * @extends enchant.InputSource
     */
    initialize: function(identifier) {
        enchant.InputSource.call(this, identifier);
    }
});
