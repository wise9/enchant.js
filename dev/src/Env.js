/**
 * @namespace
 [lang:ja]
 * enchant.js の環境変数.
 * new Core() を呼ぶ前に変更することで変更することで, 動作設定を変えることができる.
 [/lang]
 [lang:en]
 * enchant.js environment variables.
 * Execution settings can be changed by modifying these before calling new Core().
 [/lang]
 [lang:de]
 * Umgebungsvariable.
 [/lang]
 */
enchant.ENV = {
    /**
     [lang:ja]
     * enchant.jsのバージョン.
     [/lang]
     [lang:en]
     * Version of enchant.js
     [/lang]
     * @type String
     */
    VERSION: '<%= pkg.version %>',
    /**
     [lang:ja]
     * 実行中のブラウザの種類.
     [/lang]
     [lang:en]
     * Identifier of the current browser.
     [/lang]
     * @type String
     */
    BROWSER: (function(ua) {
        if (/Eagle/.test(ua)) {
            return 'eagle';
        } else if (/Opera/.test(ua)) {
            return 'opera';
        } else if (/MSIE|Trident/.test(ua)) {
            return 'ie';
        } else if (/Chrome/.test(ua)) {
            return 'chrome';
        } else if (/(?:Macintosh|Windows).*AppleWebKit/.test(ua)) {
            return 'safari';
        } else if (/(?:iPhone|iPad|iPod).*AppleWebKit/.test(ua)) {
            return 'mobilesafari';
        } else if (/Firefox/.test(ua)) {
            return 'firefox';
        } else if (/Android/.test(ua)) {
            return 'android';
        } else {
            return '';
        }
    }(navigator.userAgent)),
    /**
     [lang:ja]
     * 実行中のブラウザに対応するCSSのベンダープレフィックス.
     [/lang]
     [lang:en]
     * The CSS vendor prefix of the current browser.
     [/lang]
     * @type String
     */
    VENDOR_PREFIX: (function() {
        var ua = navigator.userAgent;
        if (ua.indexOf('Opera') !== -1) {
            return 'O';
        } else if (/MSIE|Trident/.test(ua)) {
            return 'ms';
        } else if (ua.indexOf('WebKit') !== -1) {
            return 'webkit';
        } else if (navigator.product === 'Gecko') {
            return 'Moz';
        } else {
            return '';
        }
    }()),
    /**
     [lang:ja]
     * ブラウザがタッチ入力をサポートしているかどうか.
     [/lang]
     [lang:en]
     * Determines if the current browser supports touch.
     * True, if touch is enabled.
     [/lang]
     * @type Boolean
     */
    TOUCH_ENABLED: (function() {
        var div = document.createElement('div');
        div.setAttribute('ontouchstart', 'return');
        return typeof div.ontouchstart === 'function';
    }()),
    /**
     [lang:ja]
     * 実行中の環境がRetina DisplayのiPhoneかどうか.
     [/lang]
     [lang:en]
     * Determines if the current browser is an iPhone with a retina display.
     * True, if this display is a retina display.
     [/lang]
     * @type Boolean
     */
    RETINA_DISPLAY: (function() {
        if (navigator.userAgent.indexOf('iPhone') !== -1 && window.devicePixelRatio === 2) {
            var viewport = document.querySelector('meta[name="viewport"]');
            if (viewport == null) {
                viewport = document.createElement('meta');
                document.head.appendChild(viewport);
            }
            viewport.setAttribute('content', 'width=640');
            return true;
        } else {
            return false;
        }
    }()),
    /**
     [lang:ja]
     * サウンドの再生にHTMLAudioElement/WebAudioの代わりにflashのプレーヤーを使うかどうか.
     [/lang]
     [lang:en]
     * Determines if for current browser Flash should be used to play 
     * sound instead of the native audio class.
     * True, if flash should be used.
     [/lang]
     * @type Boolean
     */
    USE_FLASH_SOUND: (function() {
        var ua = navigator.userAgent;
        var vendor = navigator.vendor || "";
        // non-local access, not on mobile mobile device, not on safari
        return (location.href.indexOf('http') === 0 && ua.indexOf('Mobile') === -1 && vendor.indexOf('Apple') !== -1);
    }()),
    /**
     [lang:ja]
     * クリック/タッチ時の規定の動作を許可するhtmlタグ名.
     * ここに追加したhtmlタグへのイベントはpreventDefaultされない.
     [/lang]
     [lang:en]
     * If click/touch event occure for these tags the setPreventDefault() method will not be called.
     [/lang]
     * @type String[]
     */
    USE_DEFAULT_EVENT_TAGS: ['input', 'textarea', 'select', 'area'],
    /**
     [lang:ja]
     * SurfaceのメソッドとしてアクセスできるようにするCanvasRenderingContext2Dのメソッド.
     [/lang]
     [lang:en]
     * Method names of CanvasRenderingContext2D that will be defined as Surface method.
     [/lang]
     * @type String[]
     */
    CANVAS_DRAWING_METHODS: [
        'putImageData', 'drawImage', 'drawFocusRing', 'fill', 'stroke',
        'clearRect', 'fillRect', 'strokeRect', 'fillText', 'strokeText'
    ],
    /**
     [lang:ja]
     * キーバインドのテーブル.
     * デフォルトで 'left, 'up', 'right', 'down' のイベントが使用可能.
     * @example
     * enchant.ENV.KEY_BIND_TABLE = {
     *     37: 'left',
     *     38: 'up',
     *     39: 'right',
     *     40: 'down',
     *     32: 'a', //-> スペースキーをaボタンとして使う.
     * };
     [/lang]
     [lang:en]
     * Keybind Table.
     * You can use 'left', 'up', 'right', 'down' for preset event.
     * @example
     * enchant.ENV.KEY_BIND_TABLE = {
     *     37: 'left',
     *     38: 'up',
     *     39: 'right',
     *     40: 'down',
     *     32: 'a', //-> use 'space' key as 'a button'
     * };
     [/lang]
     * @type Object
     */
    KEY_BIND_TABLE: {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    },
    /**
     [lang:ja]
     * キー押下時の規定の動作を抑止するキーコード.
     * ここに追加したキーによるイベントはpreventDefaultされる.
     [/lang]
     [lang:en]
     * If keydown event occure for these keycodes the setPreventDefault() method will be called.
     [/lang]
     * @type Number[]
     */
    PREVENT_DEFAULT_KEY_CODES: [37, 38, 39, 40, 32],
    /**
     [lang:ja]
     * Mobile Safariでサウンドの再生を有効にするかどうか.
     [/lang]
     [lang:en]
     * Determines if Sound is enabled on Mobile Safari.
     [/lang]
     * @type Boolean
     */
    SOUND_ENABLED_ON_MOBILE_SAFARI: true,
    /**
     [lang:ja]
     * "touch to start" のシーンを使用するかどうか.
     * Mobile SafariでWebAudioのサウンドを再生するためには,
     * 一度タッチイベントハンドラ内で音声を流す必要があるため,
     * Mobile Safariでの実行時にはこのシーンが追加される.
     * falseにすることで, このシーンを表示しないようにできるが,
     * その場合は, 自身の責任でサウンドを有効化する必要がある.
     [/lang]
     [lang:en]
     * Determines if "touch to start" scene is enabled.
     * It is necessary on Mobile Safari because WebAudio Sound is
     * muted by browser until play any sound in touch event handler.
     * If set it to false, you should control this behavior manually.
     [/lang]
     * @type Boolean
     */
    USE_TOUCH_TO_START_SCENE: true,
    /**
     [lang:ja]
     * WebAudioを有効にするどうか.
     * trueならサウンドの再生の際HTMLAudioElementの代わりにWebAudioAPIを使用する.
     [/lang]
     [lang:en]
     * Determines if WebAudioAPI is enabled. (true: use WebAudioAPI instead of Audio element if possible)
     [/lang]
     * @type Boolean
     */
    USE_WEBAUDIO: (function() {
        return location.protocol !== 'file:';
    }()),
    /**
     [lang:ja]
     * アニメーション機能を有効にするかどうか.
     * trueだと, Node#tlにTimelineオブジェクトが作成される.
     [/lang]
     [lang:en]
     * Determines if animation feature is enabled. (true: Timeline instance will be generated in new Node)
     [/lang]
     * @type Boolean
     */
    USE_ANIMATION: true
};
