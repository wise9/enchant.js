/**
 [lang:ja]
 * @scope enchant.Label.prototype
 [/lang]
 [lang:en]
 * @scope enchant.Label.prototype
 [/lang]
 */
enchant.Label = enchant.Class.create(enchant.Entity, {
    /**
     [lang:ja]
     * Labelオブジェクトを作成する.
     * @constructs
     * @extends enchant.Entity
     [/lang]
     [lang:en]
     * Create Label object.
     * @constructs
     * @extends enchant.Entity
     [/lang]
     */
    initialize: function(text) {
        enchant.Entity.call(this);

        this.width = 300;
        this.text = text;
        this.textAlign = 'left';
    },
    /**
     [lang:ja]
     * 表示するテキスト.
     * @type {String}
     [/lang]
     [lang:en]
     * Text to display.
     * @type {String}
     [/lang]
     */
    text: {
        get: function() {
            return this._element.innerHTML;
        },
        set: function(text) {
            this._element.innerHTML = text;
        }
    },
    /**
     [lang:ja]
     * テキストの水平位置の指定.
     * CSSの'text-align'プロパティと同様の形式で指定できる.
     * @type {String}
     [/lang]
     [lang:en]
     * Specifies horizontal alignment of text.
     * Can be set to same format as CSS 'text-align' property.
     * @type {String}
     [/lang]
     */
    textAlign: {
        get: function() {
            return this._style.textAlign;
        },
        set: function(textAlign) {
            this._style.textAlign = textAlign;
        }
    },
    /**
     [lang:ja]
     * フォントの指定.
     * CSSの'font'プロパティと同様の形式で指定できる.
     * @type {String}
     [/lang]
     [lang:en]
     * Font settings.
     * CSSの'font' Can be set to same format as properties.
     * @type {String}
     [/lang]
     */
    font: {
        get: function() {
            return this._style.font;
        },
        set: function(font) {
            this._style.font = font;
        }
    },
    /**
     [lang:ja]
     * 文字色の指定.
     * CSSの'color'プロパティと同様の形式で指定できる.
     * @type {String}
     [/lang]
     [lang:en]
     * Text color settings.
     * CSSの'color' Can be set to same format as properties.
     * @type {String}
     [/lang]
     */
    color: {
        get: function() {
            return this._style.color;
        },
        set: function(color) {
            this._style.color = color;
        }
    }
});
