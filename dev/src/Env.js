/**
 [lang:ja]
 * 環境変数
 * @type {Object}
 [/lang]
 [lang:ja]
 * Environment variable
 * @type {Object}
 [/lang]
 */
enchant.ENV = {
    /**
     * css vendor prefix in current browser
     * @type {String}
     */
    VENDOR_PREFIX: (function() {
        var ua = navigator.userAgent;
        if (ua.indexOf('Opera') !== -1) {
            return 'O';
        } else if (ua.indexOf('MSIE') !== -1) {
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
     * CSS vendor prefix in current browser
     * @type {String}
     */
    TOUCH_ENABLED: (function() {
        var div = document.createElement('div');
        div.setAttribute('ontouchstart', 'return');
        return typeof div.ontouchstart === 'function';
    }()),
    /**
     * Is this browser iPhone with Retina display?
     * @type {String}
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
     * Use Flash instead of native Audio class?
     * @type {String}
     */
    USE_FLASH_SOUND: (function() {
        var ua = navigator.userAgent;
        var vendor = navigator.vendor || "";
        return (location.href.indexOf('http') === 0 && ua.indexOf('Mobile') === -1 && vendor.indexOf('Apple') !== -1);
    }()),
    /**
     * On click/touch event in these tags, setPreventDefault() will not be called
     */
    USE_DEFAULT_EVENT_TAGS: ['input', 'textarea', 'select', 'area'],
    CANVAS_DRAWING_METHODS: [
        'putImageData', 'drawImage', 'drawFocusRing', 'fill', 'stroke',
        'clearRect', 'fillRect', 'strokeRect', 'fillText', 'strokeText'
    ]
};