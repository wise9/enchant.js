/**
 * @scope enchant.Sprite.prototype
 */
enchant.Sprite = enchant.Class.create(enchant.Entity, {
    /**
     * @class
     [lang:ja]
     * 画像表示機能を持ったクラス。
     * Entity を継承している。
     *
     * @param {Number} [width] Spriteの横幅.
     * @param {Number} [height] Spriteの高さ.
     [/lang]
     [lang:en]
     * Class which can display images.
     * 
     * @param {Number} [width] Sprite width.
     * @param {Number} [height] Sprite height.
     [/lang]
     [lang:de]
     * Eine Klasse die Grafiken darstellen kann.
     * 
     * @param {Number} [width] Die Breite des Sprites.
     * @param {Number} [height] Die Höhe des Sprites.
     [/lang]
     * @example
     *   var bear = new Sprite(32, 32);
     *   bear.image = core.assets['chara1.gif'];
     *   
     * @constructs
     * @extends enchant.Entity
     */
    initialize: function(width, height) {
        enchant.Entity.call(this);

        this.width = width;
        this.height = height;
        this._image = null;
        this._frameLeft = 0;
        this._frameTop = 0;
        this._frame = 0;
        this._frameSequence = [];

        /**
         * frame に配列が指定されたときの処理。
         * _frameSeuence に
         */
        this.addEventListener('enterframe', function() {
            if (this._frameSequence.length !== 0) {
                var nextFrame = this._frameSequence.shift();
                if (nextFrame === null) {
                    this._frameSequence = [];
                } else {
                    this._setFrame(nextFrame);
                    this._frameSequence.push(nextFrame);
                }
            }
        });
    },
    /**
     [lang:ja]
     * Spriteで表示する画像.
     [/lang]
     [lang:en]
     * Image displayed in the Sprite.
     [/lang]
     [lang:de]
     * Die Grafik die im Sprite dargestellt wird.
     [/lang]
     * @type {enchant.Surface}
     */
    image: {
        get: function() {
            return this._image;
        },
        set: function(image) {
            if (image === this._image) {
                return;
            }
            this._image = image;
            this._setFrame(this._frame);
        }
    },
    /**
     [lang:ja]
     * 表示するフレームのインデックス.
     * Spriteと同じ横幅と高さを持ったフレームが{@link enchant.Sprite#image}プロパティの画像に左上から順に
     * 配列されていると見て, 0から始まるインデックスを指定することでフレームを切り替える.
     *
     * 数値の配列が指定された場合、それらを毎フレーム順に切り替える。
     * ループするが、null値が含まれているとそこでループをストップする。
     [/lang]
     [lang:en]
     * Indizes of the frames to be displayed.
     * Frames with same width and height as Sprite will be arrayed from upper left corner of the 
     * {@link enchant.Sprite#image} image. When a sequence of numbers is provided, the displayed frame 
     * will switch automatically. At the end of the array the sequence will restart. By setting 
     * a value within the sequence to null, the frame switching is stopped.
     [/lang]
     [lang:de]
     * Die Indizes der darzustellenden Frames.
     * Die Frames mit der selben Größe wie das Sprite werden aus der {@link enchant.Sprite#image} image Variable,
     * beginnend an der oberen linken Ecke, angeordnet. Wenn eine Nummbersequenz übergeben wird, wird
     * der dargestellte Frame automatisch gewechselt. Am ende des Arrays der Sequenz wird diese neugestartet.
     * Wenn ein Wert in der Sequenz auf null gesetzt wird, wird das automatische Framewechseln gestoppt.
     [/lang]
     * @example
     * var sprite = new Sprite(32, 32);
     * sprite.frame = [0, 1, 0, 2]
     * //-> 0, 1, 0, 2, 0, 1, 0, 2,..
     * sprite.frame = [0, 1, 0, 2, null]
     * //-> 0, 1, 0, 2, (2, 2,.. :stop)
     *
     * @type {Number|Array}
     */
    frame: {
        get: function() {
            return this._frame;
        },
        set: function(frame) {
            if (frame instanceof Array) {
                var frameSequence = frame;
                var nextFrame = frameSequence.shift();
                this._setFrame(nextFrame);
                frameSequence.push(nextFrame);
                this._frameSequence = frameSequence;
            } else {
                this._setFrame(frame);
                this._frameSequence = [];
                this._frame = frame;
            }
        }
    },
    /**
     * 0 <= frame
     * 0以下の動作は未定義.
     * @param frame
     * @private
     */
    _setFrame: function(frame) {
        var image = this._image;
        var row, col;
        if (image != null) {
            this._frame = frame;
            row = image.width / this._width | 0;
            this._frameLeft = (frame % row | 0) * this._width;
            this._frameTop = (frame / row | 0) * this._height % image.height;
        }
    },
    cvsRender: function(ctx) {
        var img, imgdata, row, frame;
        var sx, sy, sw, sh;
        if (this._image && this._width !== 0 && this._height !== 0) {
            frame = Math.abs(this._frame) || 0;
            img = this._image;
            imgdata = img._element;
            sx = this._frameLeft;
            sy = Math.min(this._frameTop, img.height - this._height);
            sw = Math.min(img.width - sx, this._width);
            sh = Math.min(img.height - sy, this._height);
            ctx.drawImage(imgdata, sx, sy, sw, sh, 0, 0, this._width, this._height);
        }
    },
    domRender: function(element) {
        if (this._image) {
            if (this._image._css) {
                element.style.backgroundImage = this._image._css;
                element.style.backgroundPosition =
                    -this._frameLeft + 'px ' +
                    -this._frameTop + 'px';
            } else if (this._image._element) {
            }
        }
    }
});
