/**
 [lang:ja]
 * @scope enchant.Sprite.prototype
 [/lang]
 [lang:en]
 * @scope enchant.Sprite.prototype
 [/lang]
 */
enchant.Sprite = enchant.Class.create(enchant.Entity, {
    /**
     [lang:ja]
     * 画像表示機能を持ったクラス.
     *
     * @example
     *   var bear = new Sprite(32, 32);
     *   bear.image = game.assets['chara1.gif'];
     *
     * @param {Number} [width] Spriteの横幅.
     * @param {Number} [height] Spriteの高さ.
     * @constructs
     * @extends enchant.Entity
     [/lang]
     [lang:en]
     * Class for image display function.
     *
     * @example
     *   var bear = new Sprite(32, 32);
     *   bear.image = game.assets['chara1.gif'];
     *
     * @param {Number} [width] Sprite width.g
     * @param {Number} [height] Sprite height.
     * @constructs
     * @extends enchant.Entity
     [/lang]
     */
    initialize: function(width, height) {
        enchant.Entity.call(this);

        this.width = width;
        this.height = height;
        this._scaleX = 1;
        this._scaleY = 1;
        this._rotation = 0;
        this._dirty = false;
        this._image = null;
        this._frame = 0;
        this._frameSequence = [];

        this._style.overflow = 'hidden';

        this.addEventListener('render', function() {
            if (this._dirty) {
                var transform = [
                    'rotate(', this._rotation, 'deg)',
                    'scale(', this._scaleX, ',', this._scaleY, ')'
                ];
                // Issues #80
                if (navigator.userAgent.indexOf('iPhone') !== -1) {
                  transform.push('translate3d(0,0,0)');
                }
                this._style[enchant.ENV.VENDOR_PREFIX + 'Transform'] = transform.join('');
                this._dirty = false;
            }
        });

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

        if (enchant.Game.instance._debug) {
            this._style.border = "1px solid red";
            this._style.margin = "-1px";
        }
    },
    /**
     [lang:ja]
     * Spriteで表示する画像.
     * @type {enchant.Surface}
     [/lang]
     [lang:en]
     * Image displayed in Sprite.
     * @type {enchant.Surface}
     [/lang]
     */
    image: {
        get: function() {
            return this._image;
        },
        set: function(image) {
            if (image === this._image){
                return;
            }

            if (this._image != null) {
                if (this._image.css) {
                    this._style.backgroundImage = '';
                } else if (this._element.firstChild) {
                    this._element.removeChild(this._element.firstChild);
                    if (this._dirtyListener) {
                        this.removeEventListener('render', this._dirtyListener);
                        this._dirtyListener = null;
                    } else {
                        this._image._parent = null;
                    }
                }
            }

            if (image != null) {
                if (image._css) {
                    this._style.backgroundImage = image._css;
                } else if (image._parent) {
                    var canvas = document.createElement('canvas');
                    var context = canvas.getContext('2d');
                    canvas.width = image.width;
                    canvas.height = image.height;
                    context.drawImage(image._element, 0, 0);
                    this._dirtyListener = function() {
                        if (image._dirty) {
                            context.drawImage(image._element);
                            image._dirty = false;
                        }
                    };
                    this.addEventListener('render', this._dirtyListener);
                    this._element.appendChild(canvas);
                } else {
                    image._parent = this;
                    this._element.appendChild(image._element);
                }
            }
            this._image = image;
            this.frame = this.frame;
        }
    },
    /**
     [lang:ja]
     * 表示するフレームのインデックス.
     * Spriteと同じ横幅と高さを持ったフレームがimageプロパティの画像に左上から順に
     * 配列されていると見て, 0から始まるインデックスを指定することでフレームを切り替える.
     *
     * 数値の配列が指定された場合、それらを毎フレーム順に切り替える。
     * ループするが、null値が含まれているとそこでループをストップする。
     * @example
     * var sprite = new Sprite(32, 32);
     * sprite.frame = [0, 1, 0, 2]
     * //-> 0, 1, 0, 2, 0, 1, 0, 2,..
     * sprite.frame = [0, 1, 0, 2, null]
     * //-> 0, 1, 0, 2, (2, 2,.. :stop)
     *
     * @type {Number|Array}
     [/lang]
     [lang:en]
     * Frame index display.
     * Frames with same width and height as Sprite will be arrayed in order from upper left of image properties image.
     * By setting the index to start with 0, frames are switched.
     * @type {Number|Array}
     [/lang]
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
     * @param frame
     * @private
     */
    _setFrame: function(frame) {
        if (this._image != null) {
            this._frame = frame;
            var row = this._image.width / this._width | 0;
            if (this._image._css) {
                this._style.backgroundPosition = [
                    -(frame % row | 0) * this._width, 'px ',
                    -(frame / row | 0) * this._height, 'px'
                ].join('');
            } else if (this._element.firstChild) {
                var style = this._element.firstChild.style;
                style.left = -(frame % row | 0) * this._width + 'px';
                style.top = -(frame / row | 0) * this._height + 'px';
            }
        }
    }
});