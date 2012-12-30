/**
 * @scope enchant.Label.prototype
 */
enchant.Label = enchant.Class.create(enchant.Entity, {
    /**
     * @name enchant.Label
     * @class
     [lang:ja]
     * Label クラス。
     [/lang]
     [lang:en]
     * A class for Label object.
     [/lang]
     [lang:de]
     * Erstellt ein Label Objekt.
     [/lang]
     * @constructs
     * @extends enchant.Entity
     */
    initialize: function(text) {
        enchant.Entity.call(this);

        this.width = 300;
        this.font = '14px serif';
        this.text = text || '';
        this.textAlign = 'left';
    },
    /**
     [lang:ja]
     * 表示するテキスト.
     [/lang]
     [lang:en]
     * Text to be displayed.
     [/lang]
     [lang:de]
     * Darzustellender Text.
     [/lang]
     * @type {String}
     */
    text: {
        get: function() {
            return this._text;
        },
        set: function(text) {
            if(this._text === text) {
                return;
            }
            this._text = text;
            text = text.replace(/<(br|BR) ?\/?>/g, '<br/>');
            this._splitText = text.split('<br/>');
            this.updateBoundArea();
            for (var i = 0, l = this._splitText.length; i < l; i++) {
                text = this._splitText[i];
                var metrics = this.getMetrics(text);
                this._splitText[i] = {};
                this._splitText[i].text = text;
                this._splitText[i].height = metrics.height;
            }
        }
    },
    /**
     [lang:ja]
     * テキストの水平位置の指定.
     * CSSの'text-align'プロパティと同様の形式で指定できる.
     [/lang]
     [lang:en]
     * Specifies horizontal alignment of text.
     * Can be set according to the format of the CSS 'text-align' property.
     [/lang]
     [lang:de]
     * Spezifiziert die horizontale Ausrichtung des Textes.
     * Kann im gleichen Format wie die CSS 'text-align' Eigenschaft angegeben werden.
     [/lang]
     * @type {String}
     */
    textAlign: {
        get: function() {
            return this._style['text-align'];
        },
        set: function(textAlign) {
            this._style['text-align'] = textAlign;
            this.updateBoundArea();
        }
    },
    /**
     [lang:ja]
     * フォントの指定.
     * CSSの'font'プロパティと同様の形式で指定できる.
     [/lang]
     [lang:en]
     * Font settings.
     * Can be set according to the format of the CSS 'font' property.
     [/lang]
     [lang:de]
     * Text Eigenschaften.
     * Kann im gleichen Format wie die CSS 'font' Eigenschaft angegeben werden.
     [/lang]
     * @type {String}
     */
    font: {
        get: function() {
            return this._style.font;
        },
        set: function(font) {
            this._style.font = font;
            this.updateBoundArea();
        }
    },
    /**
     [lang:ja]
     * 文字色の指定.
     * CSSの'color'プロパティと同様の形式で指定できる.
     [/lang]
     [lang:en]
     * Text color settings.
     * Can be set according to the format of the CSS 'color' property.
     [/lang]
     [lang:de]
     * Text Farbe.
     * Kann im gleichen Format wie die CSS 'color' Eigenschaft angegeben werden.
     [/lang]
     * @type {String}
     */
    color: {
        get: function() {
            return this._style.color;
        },
        set: function(color) {
            this._style.color = color;
        }
    },
    cvsRender: function(ctx) {
        var x, y = 0;
        var text, buf, c;
        if (this._splitText) {
            ctx.textBaseline = 'top';
            ctx.font = this.font;
            ctx.fillStyle = this.color || '#000000';
            for (var i = 0, l = this._splitText.length; i < l; i++) {
                text = this._splitText[i];
                buf = '';
                for (var j = 0, ll = text.text.length; j < ll; j++) {
                    c = text.text[j];
                    if (ctx.measureText(buf).width > this.width) {
                        ctx.fillText(buf, 0, y);
                        y += text.height - 1;
                        buf = '';
                    }
                    buf += c;
                }
                if (this.textAlign === 'right') {
                    x = this.width - ctx.measureText(buf).width;
                } else if (this.textAlign === 'center') {
                    x = (this.width - ctx.measureText(buf).width) / 2;
                } else {
                    x = 0;
                }
                ctx.fillText(buf, x, y);
                y += text.height - 1;
            }
        }
    },
    domRender: function(element) {
        if (element.innerHTML !== this._text) {
            element.innerHTML = this._text;
        }
    },
    detectRender: function(ctx) {
        ctx.fillRect(this._boundOffset, 0, this._boundWidth, this._boundHeight);
    },
    updateBoundArea: function() {
        var metrics = this.getMetrics();
        this._boundWidth = metrics.width;
        this._boundHeight = metrics.height;
        if (this.textAlign === 'right') {
            this._boundOffset = this.width - this._boundWidth;
        } else if (this.textAlign === 'center') {
            this._boundOffset = (this.width - this._boundWidth) / 2;
        } else {
            this._boundOffset = 0;
        }
    }
});

enchant.Label.prototype.getMetrics = function(text) {
    var ret = {};
    var div, width, height;
    if (document.body) {
        div = document.createElement('div');
        for (var prop in this._style) {
            if(prop !== 'width' && prop !== 'height') {
                div.style[prop] = this._style[prop];
            }
        }
        div.innerHTML = text || this._text;
        document.body.appendChild(div);
        ret.height = parseInt(getComputedStyle(div).height, 10) + 1;
        div.style.position = 'absolute';
        ret.width = parseInt(getComputedStyle(div).width, 10) + 1;
        document.body.removeChild(div);
    } else {
        ret.width = this.width;
        ret.height = this.height;
    }
    return ret;
};
