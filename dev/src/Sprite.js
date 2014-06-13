/**
 * @scope enchant.Sprite.prototype
 */
enchant.Sprite = enchant.Class.create(enchant.Entity, {
    /**
     * @name enchant.Sprite
     * @class
     [lang:ja]
     * 画像表示機能を持ったクラス. Entity を継承している.
     * @param {Number} width Spriteの横幅.
     * @param {Number} height Spriteの高さ.
     [/lang]
     [lang:en]
     * Class which can display images.
     * @param {Number} width Sprite width.
     * @param {Number} height Sprite height.
     [/lang]
     [lang:de]
     * Eine Klasse die Grafiken darstellen kann.
     * @param {Number} width Die Breite des Sprites.
     * @param {Number} height Die Höhe des Sprites.
     [/lang]
     *
     * @example
     * var bear = new Sprite(32, 32);
     * bear.image = core.assets['chara1.gif'];
     *
     * @constructs
     * @extends enchant.Entity
     */
    initialize: function(width, height) {
        enchant.Entity.call(this);

        this.width = width;
        this.height = height;
        this._image = null;
        this._debugColor = '#ff0000';
        this._frameLeft = 0;
        this._frameTop = 0;
        this._frame = 0;
        this._frameSequence = [];

        // frame に配列が指定されたときの処理.
        this.addEventListener(enchant.Event.ENTER_FRAME, this._rotateFrameSequence);
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
     * @type enchant.Surface
     */
    image: {
        get: function() {
            return this._image;
        },
        set: function(image) {
            if (image === undefined) {
                throw new Error('Assigned value on Sprite.image is undefined. Please double-check image path, and check if the image you want to use is preload before use.');
            }
            if (image === this._image) {
                return;
            }
            this._image = image;
            this._computeFramePosition();
        }
    },
    /**
     [lang:ja]
     * 表示するフレームのインデックス.
     * Spriteと同じ横幅と高さを持ったフレームが{@link enchant.Sprite#image}プロパティの画像に左上から順に
     * 配列されていると見て, 0から始まるインデックスを指定することでフレームを切り替える.
     *
     * 数値の配列が指定された場合, それらを毎フレーム順に切り替える.
     * ループするが, null値が含まれているとそこでループをストップする.
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
     *
     * @example
     * var sprite = new Sprite(32, 32);
     * sprite.frame = [0, 1, 0, 2]
     * //-> 0, 1, 0, 2, 0, 1, 0, 2,..
     * sprite.frame = [0, 1, 0, 2, null]
     * //-> 0, 1, 0, 2, (2, 2,.. :stop)
     *
     * @type Number|Array
     */
    frame: {
        get: function() {
            return this._frame;
        },
        set: function(frame) {
            if (this._frame === frame || (frame instanceof Array && this._deepCompareToPreviousFrame(frame))) {
                return;
            }
            if (frame instanceof Array) {
                this._frameSequence = frame.slice();
                this._originalFrameSequence = frame.slice();
                this._rotateFrameSequence();
            } else {
                this._frameSequence = [];
                this._frame = frame;
                this._computeFramePosition();
            }
        }
    },
    /**
     *
     [lang:ja]
     [/lang]
     [lang:en]
     * If we are setting the same frame Array as animation,
     * just continue animating.
     [/lang]
     [lang:de]
     [/lang]
     * @private
     */
    _deepCompareToPreviousFrame: function(frameArray) {
        if (frameArray === this._originalFrameSequence) {
            return true;
        }
        if (frameArray == null || this._originalFrameSequence == null) {
            return false;
        }
        if (frameArray.length !== this._originalFrameSequence.length) {
            return false;
        }
        for (var i = 0; i < frameArray.length; ++i) {
            if (frameArray[i] !== this._originalFrameSequence[i]){
                return false;
            }
        }
        return true;
    },
    /**
     * 0 <= frame
     [lang:ja]
     * 0以下の動作は未定義.
     [/lang]
     [lang:en]
     [/lang]
     [lang:de]
     [/lang]
     * @private
     */
    _computeFramePosition: function() {
        var image = this._image;
        var row;
        if (image != null) {
            row = image.width / this._width | 0;
            this._frameLeft = (this._frame % row | 0) * this._width;
            this._frameTop = (this._frame / row | 0) * this._height % image.height;
        }
    },
    _rotateFrameSequence: function() {
        if (this._frameSequence.length !== 0) {
            var nextFrame = this._frameSequence.shift();
            if (nextFrame === null) {
                this._frameSequence = [];
                this.dispatchEvent(new enchant.Event(enchant.Event.ANIMATION_END));
            } else {
                this._frame = nextFrame;
                this._computeFramePosition();
                this._frameSequence.push(nextFrame);
            }
        }
    },
    /**#nocode+*/
    width: {
        get: function() {
            return this._width;
        },
        set: function(width) {
            this._width = width;
            this._computeFramePosition();
            this._dirty = true;
        }
    },
    height: {
        get: function() {
            return this._height;
        },
        set: function(height) {
            this._height = height;
            this._computeFramePosition();
            this._dirty = true;
        }
    },
    /**#nocode-*/
    cvsRender: function(ctx) {
        var image = this._image,
            w = this._width, h = this._height,
            iw, ih, elem, sx, sy, sw, sh;
        if (image && w !== 0 && h !== 0) {
            iw = image.width, ih = image.height;
            if (iw < w || ih < h) {
                ctx.fillStyle = enchant.Surface._getPattern(image);
                ctx.fillRect(0, 0, w, h);
            } else {
                elem = image._element;
                sx = this._frameLeft;
                sy = Math.min(this._frameTop, ih - h);
                // IE9 doesn't allow for negative or 0 widths/heights when drawing on the CANVAS element
                sw = Math.max(0.01, Math.min(iw - sx, w));
                sh = Math.max(0.01, Math.min(ih - sy, h));
                ctx.drawImage(elem, sx, sy, sw, sh, 0, 0, w, h);
            }
        }
    },
    domRender: (function() {
        if (enchant.ENV.VENDOR_PREFIX === 'ms') {
            return function(element) {
                if (this._image) {
                    if (this._image._css) {
                        this._style['background-image'] = this._image._css;
                        this._style['background-position'] =
                            -this._frameLeft + 'px ' +
                            -this._frameTop + 'px';
                    } else if (this._image._element) {
                    }
                }
            };
        } else {
            return function(element) {
                if (this._image) {
                    if (this._image._css) {
                        this._style['background-image'] = this._image._css;
                        this._style['background-position'] =
                            -this._frameLeft + 'px ' +
                            -this._frameTop + 'px';
                    } else if (this._image._element) {
                    }
                }
            };
        }
    }())
});
