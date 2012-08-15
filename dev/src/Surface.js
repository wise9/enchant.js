/**
 [lang:ja]
 * @scope enchant.Surface.prototype
 [/lang]
 [lang:en]
 * @scope enchant.Surface.prototype
 [/lang]
 */
enchant.Surface = enchant.Class.create(enchant.EventTarget, {
    /**
     [lang:ja]
     * canvas要素をラップしたクラス.
     *
     * SpriteやMapのimageプロパティに設定して表示させることができる.
     * Canvas APIにアクセスしたいときはcontextプロパティを用いる.
     *
     * @example
     *   // 円を表示するSpriteを作成する
     *   var ball = new Sprite(50, 50);
     *   var surface = new Surface(50, 50);
     *   surface.context.beginPath();
     *   surface.context.arc(25, 25, 25, 0, Math.PI*2, true);
     *   surface.context.fill();
     *   ball.image = surface;
     *
     * @param {Number} width Surfaceの横幅.
     * @param {Number} height Surfaceの高さ.
     * @constructs
     [/lang]
     [lang:en]
     * Class that wraps canvas elements.
     *
     * Can set Sprite and Map's image properties and display.
     * Uses context properties when you wish to access Canvas API.
     *
     * @example
     *   // Creates Sprite that displays a circle.
     *   var ball = new Sprite(50, 50);
     *   var surface = new Surface(50, 50);
     *   surface.context.beginPath();
     *   surface.context.arc(25, 25, 25, 0, Math.PI*2, true);
     *   surface.context.fill();
     *   ball.image = surface;
     *
     * @param {Number} width Surface width.
     * @param {Number} height Surface height.
     * @constructs
     [/lang]
     */
    initialize: function(width, height) {
        enchant.EventTarget.call(this);

        var game = enchant.Game.instance;

        /**
         [lang:ja]
         * Surfaceの横幅.
         * @type {Number}
         [/lang]
         [lang:en]
         * Surface width.
         * @type {Number}
         [/lang]
         */
        this.width = width;
        /**
         [lang:ja]
         * Surfaceの高さ.
         * @type {Number}
         [/lang]
         [lang:en]
         * Surface height.
         * @type {Number}
         [/lang]
         */
        this.height = height;
        /**
         [lang:ja]
         * Surfaceの描画コンテクスト.
         * @type {CanvasRenderingContext2D}
         [/lang]
         [lang:en]
         * Surface drawing context.
         * @type {CanvasRenderingContext2D}
         [/lang]
         */
        this.context = null;

        var id = 'enchant-surface' + game._surfaceID++;
        if (document.getCSSCanvasContext) {
            this.context = document.getCSSCanvasContext('2d', id, width, height);
            this._element = this.context.canvas;
            this._css = '-webkit-canvas(' + id + ')';
            var context = this.context;
        } else if (document.mozSetImageElement) {
            this._element = document.createElement('canvas');
            this._element.width = width;
            this._element.height = height;
            this._css = '-moz-element(#' + id + ')';
            this.context = this._element.getContext('2d');
            document.mozSetImageElement(id, this._element);
        } else {
            this._element = document.createElement('canvas');
            this._element.width = width;
            this._element.height = height;
            this._element.style.position = 'absolute';
            this.context = this._element.getContext('2d');

            enchant.ENV.CANVAS_DRAWING_METHODS.forEach(function(name) {
                var method = this.context[name];
                this.context[name] = function() {
                    method.apply(this, arguments);
                    this._dirty = true;
                };
            }, this);
        }
    },
    /**
     [lang:ja]
     * Surfaceから1ピクセル取得する.
     * @param {Number} x 取得するピクセルのx座標.
     * @param {Number} y 取得するピクセルのy座標.
     * @return {Array.<Number>} ピクセルの情報を[r, g, b, a]の形式で持つ配列.
     [/lang]
     [lang:en]
     * Acquires 1 pixel from Surface.
     * @param {Number} x Acquired pixel's x coordinates.
     * @param {Number} y Acquired pixel's y coordinates.
     * @return {Array.<Number>} An array that holds pixel information in [r, g, b, a] format.
     [/lang]
     */
    getPixel: function(x, y) {
        return this.context.getImageData(x, y, 1, 1).data;
    },
    /**
     [lang:ja]
     * Surfaceに1ピクセル設定する.
     * @param {Number} x 設定するピクセルのx座標.
     * @param {Number} y 設定するピクセルのy座標.
     * @param {Number} r 設定するピクセルのrの値.
     * @param {Number} g 設定するピクセルのgの値.
     * @param {Number} b 設定するピクセルのbの値.
     * @param {Number} a 設定するピクセルの透明度.
     [/lang]
     [lang:en]
     * Surfaceに1ピクセル設定する.
     * @param {Number} x Set pixel's x coordinates.
     * @param {Number} y Set pixel's y coordinates.
     * @param {Number} r Set pixel's r level.
     * @param {Number} g Set pixel's g level.
     * @param {Number} b Set pixel's b level.
     * @param {Number} a Set pixel's transparency.
     [/lang]
     */
    setPixel: function(x, y, r, g, b, a) {
        var pixel = this.context.createImageData(1, 1);
        pixel.data[0] = r;
        pixel.data[1] = g;
        pixel.data[2] = b;
        pixel.data[3] = a;
        this.context.putImageData(pixel, x, y);
    },
    /**
     [lang:ja]
     * Surfaceの全ピクセルをクリアし透明度0の黒に設定する.
     [/lang]
     [lang:en]
     * Clears all Surface pixels and sets transparency level 0 to black.
     [/lang]
     */
    clear: function() {
        this.context.clearRect(0, 0, this.width, this.height);
    },
    /**
     [lang:ja]
     * Surfaceに対して引数で指定されたSurfaceを描画する.
     *
     * Canvas APIのdrawImageをラップしており, 描画する矩形を同様の形式で指定できる.
     *
     * @example
     *   var src = game.assets['src.gif'];
     *   var dst = new Surface(100, 100);
     *   dst.draw(src);         // ソースを(0, 0)に描画
     *   dst.draw(src, 50, 50); // ソースを(50, 50)に描画
     *   // ソースを(50, 50)に縦横30ピクセル分だけ描画
     *   dst.draw(src, 50, 50, 30, 30);
     *   // ソースの(10, 10)から縦横40ピクセルの領域を(50, 50)に縦横30ピクセルに縮小して描画
     *   dst.draw(src, 10, 10, 40, 40, 50, 50, 30, 30);
     *
     * @param {enchant.Surface} image 描画に用いるSurface.
     [/lang]
     [lang:en]
     * Draws indicated Surface in argument corresponding to Surface.
     *
     * Wraps Canvas API drawImage, and sets drawing rectangle to same format.
     *
     * @example
     *   var src = game.assets['src.gif'];
     *   var dst = new Surface(100, 100);
     *   dst.draw(src);         // Draws source at (0, 0)
     *   dst.draw(src, 50, 50); // Draws source at (50, 50)
     *   // Draws just 30 horizontal and vertical pixels of source at (50, 50)
     *   dst.draw(src, 50, 50, 30, 30);
     *   // Reduces the horizontal and vertical 40 pixel image at source (10, 10) to a horizontal and vertical 30 pixel image at (50, 50)
     *   dst.draw(src, 10, 10, 40, 40, 50, 50, 30, 30);
     *
     * @param {enchant.Surface} image Surface used in drawing.
     [/lang]
     */
    draw: function(image) {
        image = image._element;
        if (arguments.length === 1) {
            this.context.drawImage(image, 0, 0);
        } else {
            var args = arguments;
            args[0] = image;
            this.context.drawImage.apply(this.context, args);
        }
    },
    /**
     [lang:ja]
     * Surfaceを複製する.
     * @return {enchant.Surface} 複製されたSurface.
     [/lang]
     [lang:en]
     * Copies Surface.
     * @return {enchant.Surface} Copied Surface.
     [/lang]
     */
    clone: function() {
        var clone = new enchant.Surface(this.width, this.height);
        clone.draw(this);
        return clone;
    },
    /**
     [lang:ja]
     * SurfaceからdataスキームのURLを生成する.
     * @return {String} Surfaceを表すdataスキームのURL.
     [/lang]
     [lang:en]
     * Creates data scheme URL from Surface.
     * @return {String} Data scheme URL that shows Surface.
     [/lang]
     */
    toDataURL: function() {
        var src = this._element.src;
        if (src) {
            if (src.slice(0, 5) === 'data:') {
                return src;
            } else {
                return this.clone().toDataURL();
            }
        } else {
            return this._element.toDataURL();
        }
    }
});

/**
 [lang:ja]
 * 画像ファイルを読み込んでSurfaceオブジェクトを作成する.
 *
 * このメソッドによって作成されたSurfaceはimg要素のラップしておりcontextプロパティに
 * アクセスしたりdraw, clear, getPixel, setPixelメソッドなどの呼び出しでCanvas API
 * を使った画像操作を行うことはできない. ただしdrawメソッドの引数とすることはでき,
 * ほかのSurfaceに描画した上で画像操作を行うことはできる(クロスドメインでロードした
 * 場合はピクセルを取得するなど画像操作の一部が制限される).
 *
 * @param {String} src ロードする画像ファイルのパス.
 * @static
 [/lang]
 [lang:en]
 * Loads image and creates Surface object.
 *
 * Surface created with this method does not allow access to wrap img elements context properties,
 * or image operation via Canvas API called up by draw,clear, getPixel, setPixel and other methods.
 * However it is possible to make draw method arguments, and you can operate images drawn on other surfaces
 * (when loading in cross domain, pixel acquisition and other image manipulation is limited).
 *
 *
 *
 * @param {String} src Loaded image file path.
 * @static
 [/lang]
 */
enchant.Surface.load = function(src) {
    var image = new Image();
    var surface = Object.create(enchant.Surface.prototype, {
        context: { value: null },
        _css: { value: 'url(' + src + ')' },
        _element: { value: image }
    });
    enchant.EventTarget.call(surface);
    image.src = src;
    image.onerror = function() {
        throw new Error('Cannot load an asset: ' + image.src);
    };
    image.onload = function() {
        surface.width = image.width;
        surface.height = image.height;
        surface.dispatchEvent(new enchant.Event('load'));
    };
    return surface;
};