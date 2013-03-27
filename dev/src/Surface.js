/**
 * @scope enchant.Surface.prototype
 */
enchant.Surface = enchant.Class.create(enchant.EventTarget, {
    /**
     * @name enchant.Surface
     * @class
     [lang:ja]
     * canvas要素をラップしたクラス.
     *
     * {@link enchant.Sprite}や{@link enchant.Map}のimageプロパティに設定して表示させることができる.
     * Canvas APIにアクセスしたいときは{@link enchant.Surface#context}プロパティを用いる.
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
     [/lang]
     [lang:en]
     * Class that wraps canvas elements.
     *
     * Can be used to set the {@link enchant.Sprite} and {@link enchant.Map}'s image properties to be displayed.
     * If you wish to access Canvas API use the {@link enchant.Surface#context} property.
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
     [/lang]
     [lang:de]
     * Diese Klasse dient als Hüllenklasse (Wrapper) für Canvas Elemente.
     *
     * Mit dieser Klasse können die image Felder der {@link enchant.Sprite} und {@link enchant.Map}'s
     * Klassen gesetzt werden und dadurch dargestellt werden.
     * Falls die Canvas API genutzt werden möchte kann dies über die
     * {@link enchant.Surface#context} Variable erfolgen.
     *
     * @example
     *   // Erstellt einen Sprite und stellt einen Kreis dar.
     *   var ball = new Sprite(50, 50);
     *   var surface = new Surface(50, 50);
     *   surface.context.beginPath();
     *   surface.context.arc(25, 25, 25, 0, Math.PI*2, true);
     *   surface.context.fill();
     *   ball.image = surface;
     *
     * @param {Number} width Die Breite der Surface.
     * @param {Number} height Die Höhe der Surface.
     [/lang]
     * @constructs
     */
    initialize: function(width, height) {
        enchant.EventTarget.call(this);

        var core = enchant.Core.instance;

        /**
         [lang:ja]
         * Surfaceの横幅.
         [/lang]
         [lang:en]
         * Surface width.
         [/lang]
         [lang:de]
         * Die Breite der Surface.
         [/lang]
         * @type {Number}
         */
        this.width = width;
        /**
         [lang:ja]
         * Surfaceの高さ.
         [/lang]
         [lang:en]
         * Surface height.
         [/lang]
         [lang:de]
         * Die Höhe der Surface.
         [/lang]
         * @type {Number}
         */
        this.height = height;
        /**
         [lang:ja]
         * Surfaceの描画コンテクスト.
         [/lang]
         [lang:en]
         * Surface drawing context.
         [/lang]
         [lang:de]
         * Der Surface Zeichenkontext.
         [/lang]
         * @type {CanvasRenderingContext2D}
         */
        this.context = null;

        var id = 'enchant-surface' + core._surfaceID++;
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
     * Returns 1 pixel from the Surface.
     * @param {Number} x The pixel's x coordinates.
     * @param {Number} y The pixel's y coordinates.
     * @return {Array.<Number>} An array that holds pixel information in [r, g, b, a] format.
     [/lang]
     [lang:de]
     * Liefert einen Pixel der Surface.
     * @param {Number} x Die x Koordinaten des Pixel.
     * @param {Number} y Die y Koordinaten des Pixel.
     * @return {Array.<Number>} Ein Array das die Pixelinformationen im [r, g, b, a] Format enthält.
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
     * Sets one pixel within the surface.
     * @param {Number} x The pixel's x coordinates.
     * @param {Number} y The pixel's y coordinates.
     * @param {Number} r The pixel's red level.
     * @param {Number} g The pixel's green level.
     * @param {Number} b The pixel's blue level.
     * @param {Number} a The pixel's transparency.
     [/lang]
     [lang:de]
     * Setzt einen Pixel in der Surface.
     * @param {Number} x Die x Koordinaten des Pixel.
     * @param {Number} y Die y Koordinaten des Pixel.
     * @param {Number} r Der Rotwert des Pixel.
     * @param {Number} g Der Grünwert des Pixel.
     * @param {Number} b Der Blauwert des Pixels.
     * @param {Number} a Die Transparenz des Pixels
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
     * Clears all Surface pixels and makes the pixels transparent.
     [/lang]
     [lang:de]
     * Löscht alle Pixel und setzt macht die Pixel transparent.
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
     *   var src = core.assets['src.gif'];
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
     * Draws the content of the given Surface onto this surface.
     *
     * Wraps Canvas API drawImage and if multiple arguments are given,
     * these are getting applied to the Canvas drawImage method.
     *
     * @example
     *   var src = core.assets['src.gif'];
     *   var dst = new Surface(100, 100);
     *   dst.draw(src);         // Draws source at (0, 0)
     *   dst.draw(src, 50, 50); // Draws source at (50, 50)
     *   // Draws just 30 horizontal and vertical pixels of source at (50, 50)
     *   dst.draw(src, 50, 50, 30, 30);
     *   // Takes the image content in src starting at (10,10) with a (Width, Height) of (40,40),
     *   // scales it and draws it in this surface at (50, 50) with a (Width, Height) of (30,30).
     *   dst.draw(src, 10, 10, 40, 40, 50, 50, 30, 30);
     *
     * @param {enchant.Surface} image Surface used in drawing.
     [/lang]
     [lang:de]
     * Zeichnet den Inhalt der gegebenen Surface auf diese Surface.
     *
     * Umhüllt (wraps) die Canvas drawImage Methode und sollten mehrere Argumente
     * übergeben werden, werden diese auf die Canvas drawImage Methode angewendet.
     *
     * @example
     *   var src = core.assets['src.gif'];
     *   var dst = new Surface(100, 100);
     *   dst.draw(src);         // Zeichnet src bei (0, 0)
     *   dst.draw(src, 50, 50); // Zeichnet src bei (50, 50)
     *   // Zeichnet src an der Position (50,50), jedoch nur 30x30 Pixel
     *   dst.draw(src, 50, 50, 30, 30);
     *   // Skaliert und zeichnet den Bereich mit der (Breite, Höhe) von (40, 40)
     *   // in src ab (10,10) in diese Surface bei (50,50) mit einer (Breite, Höhe) von (30, 30).
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
     * @return {enchant.Surface} The copied Surface.
     [/lang]
     [lang:de]
     * Kopiert diese Surface.
     * @return {enchant.Surface} Die kopierte Surface.
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
     * Creates a data URI scheme from this Surface.
     * @return {String} The data URI scheme that identifies this Surface and
     * can be used to include this Surface into a dom tree.
     [/lang]
     [lang:de]
     * Erstellt eine Data-URL (URI Schema) für diese Surface.
     * @return {String} Die Data-URL, welche diese Surface identifiziert und
     * welche genutzt werden kann um diese in einen DOM Baum einzubinden.
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
 * このメソッドによって作成されたSurfaceはimg要素のラップしており{@link enchant.Surface#context}プロパティに
 * アクセスしたり{@link enchant.Surface#draw}, {@link enchant.Surface#clear}, {@link enchant.Surface#getPixel},
 * {@link enchant.Surface#setPixel}メソッドなどの呼び出しでCanvas APIを使った画像操作を行うことはできない.
 * ただし{@link enchant.Surface#draw}メソッドの引数とすることはでき,
 * ほかのSurfaceに描画した上で画像操作を行うことはできる(クロスドメインでロードした
 * 場合はピクセルを取得するなど画像操作の一部が制限される).
 *
 * @param {String} src ロードする画像ファイルのパス.
 * @param {Function} callback ロード完了時のコールバック.
 * @param {Function} [onerror] ロード失敗時のコールバック.
 [/lang]
 [lang:en]
 * Loads an image and creates a Surface object out of it.
 *
 * It is not possible to access properties or methods of the {@link enchant.Surface#context}, or to call methods using the Canvas API -
 * like {@link enchant.Surface#draw}, {@link enchant.Surface#clear}, {@link enchant.Surface#getPixel}, {@link enchant.Surface#setPixel}.. -
 * of the wrapped image created with this method.
 * However, it is possible to use this surface to draw it to another surface using the {@link enchant.Surface#draw} method.
 * The resulting surface can then be manipulated. (when loading images in a cross-origin resource sharing environment,
 * pixel acquisition and other image manipulation might be limited).
 *
 * @param {String} src The file path of the image to be loaded.
 * @param {Function} callback on load callback.
 * @param {Function} [onerror] on error callback.
 [/lang]
 [lang:de]
 * Läd eine Grafik und erstellt daraus ein Surface Objekt.
 *
 * Bei Grafiken die mit dieser Methode erstellt wurden ist es nicht möglich auf Variablen oder Methoden des {@link enchant.Surface#context}
 * zuzugreifen, oder Methoden die die Canvas API nutzen, wie {@link enchant.Surface#draw}, {@link enchant.Surface#clear},
 * {@link enchant.Surface#getPixel}, {@link enchant.Surface#setPixel}.., aufzurufen.
 * Jedoch ist es möglich diese Surface zu nutzen um sie in eine andere Surface mittels der {@link enchant.Surface#draw} zu zeichen.
 * Die daraus resultierende Surface kann dann manipuliert werden. (Wenn Bilder in einer Cross-Origin Resource Sharing Umgebung
 * geladen werden, kann es sein, dass die Pixelabfrage und andere Bildmanipulationen limitiert sind)
 *
 * @param {String} src Der Dateipfad der Grafik die geladen werden soll.
 [/lang]
 * @static
 * @return {enchant.Surface} Surface
 */
enchant.Surface.load = function(src, callback, onerror) {
    var image = new Image();
    var surface = Object.create(enchant.Surface.prototype, {
        context: { value: null },
        _css: { value: 'url(' + src + ')' },
        _element: { value: image }
    });
    enchant.EventTarget.call(surface);
    onerror = onerror || function() {};
    surface.addEventListener('load', callback);
    surface.addEventListener('error', onerror);
    image.onerror = function() {
        var e = new enchant.Event(enchant.Event.ERROR);
        e.message = 'Cannot load an asset: ' + image.src;
        surface.dispatchEvent(e);
    };
    image.onload = function() {
        surface.width = image.width;
        surface.height = image.height;
        surface.dispatchEvent(new enchant.Event('load'));
    };
    image.src = src;
    return surface;
};
enchant.Surface._staticCanvas2DContext = document.createElement('canvas').getContext('2d');

enchant.Surface._getPattern = function(surface, force) {
    if (!surface._pattern || force) {
        surface._pattern = this._staticCanvas2DContext.createPattern(surface._element, 'repeat');
    }
    return surface._pattern;
};
