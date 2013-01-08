/**
 * enchant.js v0.6.2
 * http://enchantjs.com
 * 
 * Copyright Ubiquitous Entertainment Inc.
 * Released under the MIT license.
 */

(function(window, undefined){

/**
 * ECMA-262 5th edition Functions
 */
if (typeof Object.defineProperty !== 'function') {
    Object.defineProperty = function(obj, prop, desc) {
        if ('value' in desc) {
            obj[prop] = desc.value;
        }
        if ('get' in desc) {
            obj.__defineGetter__(prop, desc.get);
        }
        if ('set' in desc) {
            obj.__defineSetter__(prop, desc.set);
        }
        return obj;
    };
}
if (typeof Object.defineProperties !== 'function') {
    Object.defineProperties = function(obj, descs) {
        for (var prop in descs) {
            if (descs.hasOwnProperty(prop)) {
                Object.defineProperty(obj, prop, descs[prop]);
            }
        }
        return obj;
    };
}
if (typeof Object.create !== 'function') {
    Object.create = function(prototype, descs) {
        function F() {
        }

        F.prototype = prototype;
        var obj = new F();
        if (descs != null) {
            Object.defineProperties(obj, descs);
        }
        return obj;
    };
}
if (typeof Object.getPrototypeOf !== 'function') {
    Object.getPrototypeOf = function(obj) {
        return obj.__proto__;
    };
}

if (typeof Function.prototype.bind !== 'function') {
    Function.prototype.bind = function(thisObject) {
        var func = this;
        var args = Array.prototype.slice.call(arguments, 1);
        var Nop = function() {
        };
        var bound = function() {
            var a = args.concat(Array.prototype.slice.call(arguments));
            return func.apply(
                this instanceof Nop ? this : thisObject || window, a);
        };
        Nop.prototype = func.prototype;
        bound.prototype = new Nop();
        return bound;
    };
}

window.getTime = (function() {

    if (window.performance && window.performance.now) {
        return function() {
            return window.performance.now();
        };
    } else if (window.performance && window.performance.webkitNow) {
        return function() {
            return window.performance.webkitNow();
        };
    } else {
        return Date.now;
    }
}());

/**
 * define requestAnimationFrame
 */
window.requestAnimationFrame =
    window.requestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    (function() {
        var lastTime = window.getTime();
        var frame = 1000 / 60;
        return function(func) {
            var currentTime = window.getTime();
            var _id = setTimeout(function() {
                func(window.getTime());
            }, Math.max(0, lastTime + frame - currentTime));
            lastTime = currentTime;
            return _id;
        };
    }());

/**
 * Globaler Export der Programmbibliotheken.
 *
 * Wenn keine Argument übergeben werden, werden alle Klassen die in enchant.js und in den Plugins
 * definiert sind exportiert. Falls mehr als ein Argument übergeben wurde, werden standardmäßig nur Klassen
 * die in enchant.js selbst definiert sind exporitert. Wenn auch Plugin Klassen exportiert werden sollen,
 * müssen die Plugin Bezeichner explizit als Argumente übergeben werden.
 *
 * @example
 *   enchant();     // alle Klassen werden exportiert.
 *   enchant('');   // nur Klassen die in enchant.js definiert sind werden exportiert.
 *   enchant('ui'); // enchant.js Klassen und ui.enchant.js Klassen werden exportiert.
 *
 * @param {...String} [modules] Module die exportiert werden sollen.
 * @global
 * @type {Object}
 * @name enchant
 */
var enchant = function(modules) {
    if (modules != null) {
        if (!(modules instanceof Array)) {
            modules = Array.prototype.slice.call(arguments);
        }
        modules = modules.filter(function(module) {
            return [module].join();
        });
    }
    (function include(module, prefix) {
        var submodules = [],
            i, len;
        for (var prop in module) {
            if (module.hasOwnProperty(prop)) {
                if (typeof module[prop] === 'function') {
                    window[prop] = module[prop];
                } else if (typeof module[prop] === 'object' && Object.getPrototypeOf(module[prop]) === Object.prototype) {
                    if (modules == null) {
                        submodules.push(prop);
                    } else {
                        i = modules.indexOf(prefix + prop);
                        if (i !== -1) {
                            submodules.push(prop);
                            modules.splice(i, 1);
                        }
                    }
                }
            }
        }

        for (i = 0, len = submodules.length; i < len; i++) {
            include(module[submodules[i]], prefix + submodules[i] + '.');
        }
    }(enchant, ''));

    window.Game = window.Core;

    if (modules != null && modules.length) {
        throw new Error('Cannot load module: ' + modules.join(', '));
    }
};

/**
 * export enchant
 */
window.enchant = enchant;

window.addEventListener("message", function(msg, origin) {
    try {
        var data = JSON.parse(msg.data);
        if (data.type === "event") {
            enchant.Core.instance.dispatchEvent(new enchant.Event(data.value));
        } else if (data.type === "debug") {
            switch (data.value) {
                case "start":
                    enchant.Core.instance.start();
                    break;
                case "pause":
                    enchant.Core.instance.pause();
                    break;
                case "resume":
                    enchant.Core.instance.resume();
                    break;
                case "tick":
                    enchant.Core.instance._tick();
                    break;
                default:
                    break;
            }
        }
    } catch (e) {
        // ignore
    }
}, false);

/**
 * @name enchant.Class
 * @class
 * Eine Klasse für Klassen, die Vererbung unterstützen.
 *
 * @param {Function} [superclass] Die Klasse, deren Klassendefinition
 * die neue Klasse erben wird.
 * @param {*} definition Klassendefinition.
 * @constructor
 */
enchant.Class = function(superclass, definition) {
    return enchant.Class.create(superclass, definition);
};

/**
 * Erstellt eine neue Klasse
 *
 * Wenn eine Klasse definiert wird, die von einer anderen Klasse erbt, wird der Konstruktor der
 * Basisklasse als Standard definiert. Sollte dieser Konstruktor in der neuen Klasse überschrieben
 * werden, sollte der vorherige Konstruktor explizit aufgerufen werden, um eine korrekte
 * Klasseninitialisierung sicherzustellen.
 *
 * @example
 *   var Ball = Class.create({ // definiert eine unabhängige Klasse.
 *       initialize: function(radius) { ... }, // Methodendefinitionen
 *       fall: function() { ... }
 *   });
 *
 *   var Ball = Class.create(Sprite);  // definiert eine Klasse die von "Sprite" erbt.
 *   var Ball = Class.create(Sprite, { // definiert eine Klasse die von "Sprite" erbt.
 *       initialize: function(radius) { // überschreibt den Standardkonstruktor.
 *          Sprite.call(this, radius*2, radius*2); // Aufruf des Konstruktors der Basisklasse.
 *          this.image = core.assets['ball.gif'];
 *       }
 *   });
 *
 * @param {Function} [superclass] The class from which the
 * new class will inherit the class definition.
 * @param {*} [definition] Class definition.
 * Erstellt eine neue Klasse
 *
 * Wenn eine Klasse definiert wird, die von einer anderen Klasse erbt, wird der Konstruktor der
 * Basisklasse als Standard definiert. Sollte dieser Konstruktor in der neuen Klasse überschrieben
 * werden, sollte der vorherige Konstruktor explizit aufgerufen werden, um eine korrekte
 * Klasseninitialisierung sicherzustellen.
 * 
 * @example
 *   var Ball = Class.create({ // definiert eine unabhängige Klasse.
 *       initialize: function(radius) { ... }, // Methodendefinitionen
 *       fall: function() { ... }
 *   });
 *
 *   var Ball = Class.create(Sprite);  // definiert eine Klasse die von "Sprite" erbt.
 *   var Ball = Class.create(Sprite, { // definiert eine Klasse die von "Sprite" erbt.
 *       initialize: function(radius) { // überschreibt den Standardkonstruktor.
 *          Sprite.call(this, radius*2, radius*2); // Aufruf des Konstruktors der Basisklasse.
 *          this.image = core.assets['ball.gif'];
 *       }
 *   });
 *
 * @param {Function} [superclass] Die Klasse, deren Klassendefinition
 * die neue Klasse erben wird.
 * @param {*} definition Klassendefinition.
 * @static
 */
enchant.Class.create = function(superclass, definition) {
    if (superclass == null && definition){
        throw new Error("superclass is undefined (enchant.Class.create)");
    }else if(superclass == null){
        throw new Error("definition is undefined (enchant.Class.create)");
    }

    if (arguments.length === 0) {
        return enchant.Class.create(Object, definition);
    } else if (arguments.length === 1 && typeof arguments[0] !== 'function') {
        return enchant.Class.create(Object, arguments[0]);
    }

    for (var prop in definition) {
        if (definition.hasOwnProperty(prop)) {
            if (typeof definition[prop] === 'object' && definition[prop] !== null && Object.getPrototypeOf(definition[prop]) === Object.prototype) {
                if (!('enumerable' in definition[prop])) {
                    definition[prop].enumerable = true;
                }
            } else {
                definition[prop] = { value: definition[prop], enumerable: true, writable: true };
            }
        }
    }
    var Constructor = function() {
        if (this instanceof Constructor) {
            Constructor.prototype.initialize.apply(this, arguments);
        } else {
            return new Constructor();
        }
    };
    Constructor.prototype = Object.create(superclass.prototype, definition);
    Constructor.prototype.constructor = Constructor;
    if (Constructor.prototype.initialize == null) {
        Constructor.prototype.initialize = function() {
            superclass.apply(this, arguments);
        };
    }

    var tree = this.getInheritanceTree(superclass);
    for (var i = tree.length - 1; i >= 0; i--) {
        if (typeof tree[i]._inherited === 'function') {
            tree[i]._inherited(Constructor);
            break;
        }
    }

    return Constructor;
};

/**
 * @param {ConstructorFunction}
 * @return {...ConstructorFunction}
 */
enchant.Class.getInheritanceTree = function(Constructor) {
    var ret = [];
    var C = Constructor;
    var proto = C.prototype;
    while (C !== Object) {
        ret.push(C);
        proto = Object.getPrototypeOf(proto);
        C = proto.constructor;
    }
    return ret;
};

/**
 * @namespace
 * Umgebungsvariable.
 * @type {Object}
 */
enchant.ENV = {
    /**
     * Version of enchant.js
     * @type {String}
     */
    VERSION: "0.6.1",
    /**
     * The CSS vendor prefix of the current browser.
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
     * Determines if the current browser supports touch.
     * @type {Boolean} True, if touch is enabled.
     */
    TOUCH_ENABLED: (function() {
        var div = document.createElement('div');
        div.setAttribute('ontouchstart', 'return');
        return typeof div.ontouchstart === 'function';
    }()),
    /**
     * Determines if the current browser is an iPhone with a retina display.
     * @return {Boolean} True, if this display is a retina display
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
     * Determines if for current browser Flash should be used to play 
     * sound instead of the native audio class.
     * @type {Boolean} True, if flash should be used.
     */
    USE_FLASH_SOUND: (function() {
        var ua = navigator.userAgent;
        var vendor = navigator.vendor || "";
        // non-local access, not on mobile mobile device, not on safari
        return (location.href.indexOf('http') === 0 && ua.indexOf('Mobile') === -1 && vendor.indexOf('Apple') !== -1);
    }()),
    /**
     * If click/touch event occure for these tags the setPreventDefault() method will not be called.
     */
    USE_DEFAULT_EVENT_TAGS: ['input', 'textarea', 'select', 'area'],
    CANVAS_DRAWING_METHODS: [
        'putImageData', 'drawImage', 'drawFocusRing', 'fill', 'stroke',
        'clearRect', 'fillRect', 'strokeRect', 'fillText', 'strokeText'
    ],
    /**
     * Keybind Table.
     * You can use 'left', 'up', 'right', 'down', 'a', 'b' for preset event.
     * @example
     * enchant.ENV.KEY_BIND_TABLE = {
     *    37: 'left',
     *    38: 'up',
     *    39: 'right',
     *    40: 'down',
     *    32: 'a', //-> use 'space' key as 'a button'
     * }
     */
    KEY_BIND_TABLE: {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    },
    PREVENT_DEFAULT_KEY_CODES: [37, 38, 39, 40, 32],
    /**
     * @type {Boolean}
     */
    SOUND_ENABLED_ON_MOBILE_SAFARI: false,
    /**
     * Determines if WebAudioAPI is enabled. (true: use WebAudioAPI instead of Audio element if possible)
     */
    USE_WEBAUDIO: (function(){
        return location.protocol !== 'file:';
    }()),
    /**
     * Determines if animation feature is enabled. (true: Timeline instance will be generated in new Node)
     */
    USE_ANIMATION: true
};

/**
 * @scope enchant.Event.prototype
 */
enchant.Event = enchant.Class.create({
    /**
     * @name enchant.Event
     * @class
     * Eine Klasse für eine unabhängige Implementierung von Ereignissen 
     * (Events), ähnlich wie DOM Events.
     * Jedoch wird das Phasenkonzept nicht unterstützt.
     * @param {String} type Event Typ.
     * @constructs
     */
    initialize: function(type) {
        /**
         * Typ des Ereignis.
         * @type {String}
         */
        this.type = type;
        /**
         * Ziel des Ereignis.
         * @type {*}
         */
        this.target = null;
        /**
         * X Koordinate des Auftretens des Ereignis.
         * @type {Number}
         */
        this.x = 0;
        /**
         * Y Koordinate des Auftretens des Ereignis.
         * @type {Number}
         */
        this.y = 0;
        /**
         * X Koordinate des lokalen Koordinatensystems des Auftretens des Ereignis.
         * @type {Number}
         */
        this.localX = 0;
        /**
         * Y Koordinate des lokalen Koordinatensystems des Auftretens des Ereignis.
         * @type {Number}
         */
        this.localY = 0;
    },
    _initPosition: function(pageX, pageY) {
        var core = enchant.Core.instance;
        this.x = this.localX = (pageX - core._pageX) / core.scale;
        this.y = this.localY = (pageY - core._pageY) / core.scale;
    }
});

/**
 * Ereignis, dass auftritt wenn das Laden des Spieles abgeschlossen wurde.
 *
 * Wenn Grafiken im voraus geladen werden ist es notwendig, auf dieses Ereignis zu warten bis mit
 * diesen gearbeitet werden kann. 
 * Objekt des Auftretens: {@link enchant.Core}
 *
 * @example
 *   var core = new Core(320, 320);
 *   core.preload('player.gif');
 *   core.onload = function() {
 *      ... // initialisierung des Spieles 
 *   };
 *   core.start();
 *
 * @type {String}
 */
enchant.Event.LOAD = 'load';

/**
 * Ereignis, welches während des Ladens des Spieles auftritt.
 * Das Ereignis tritt jedesmal auf, wenn eine im voraus geladene Grafik geladen wurde.
 * Objekt des Auftretens: {@link enchant.Core}
 * @type {String}
 */
enchant.Event.PROGRESS = 'progress';

/**
 * Ereignis, welches auftritt wenn ein neuer Frame bearbeitet wird.
 * Objekt des Auftretens: {@link enchant.Core}, {@link enchant.Node}
 * @type {String}
 */
enchant.Event.ENTER_FRAME = 'enterframe';

/**
 * Ereignis, welches auftritt wenn ein Frame beendet wird.
 * Objekt des Auftretens: {@link enchant.Core}
 * @type {String}
 */
enchant.Event.EXIT_FRAME = 'exitframe';

/**
 * Ereignis, dass auftritt wenn eine neue Szene
 * ({@link enchant.Scene}) beginnt.
 * Objekt des Auftretens: {@link enchant.Scene}
 * @type {String}
 */
enchant.Event.ENTER = 'enter';

/**
 * Ereignis, dass auftritt wenn eine Szene
 * ({@link enchant.Scene}) endet.
 * Objekt des Auftretens: {@link enchant.Scene}
 * @type {String}
 */
enchant.Event.EXIT = 'exit';

/**
 * Ereignis, welchses auftritt wenn ein Kindelement zu einem Node
 * hinzugefügt wird.
 * Objekt des Auftretens: {@link enchant.Group}, {@link enchant.Scene}
 * @type {String}
 */
enchant.Event.CHILD_ADDED = 'childadded';

/**
 * Ereignis, welchses auftritt wenn der Node zu einer Gruppe
 * hinzugefügt wird.
 * Objekt des Auftretens: {@link enchant.Node}
 * @type {String}
 */
enchant.Event.ADDED = 'added';

/**
 * Ereignis, welchses auftritt wenn der Node zu einer Szene
 * hinzugefügt wird.
 * Objekt des Auftretens: {@link enchant.Node}
 * @type {String}
 */
enchant.Event.ADDED_TO_SCENE = 'addedtoscene';

/**
 * Ereignis, welchses auftritt wenn ein Kindelement von einem Node
 * entfernt wird.
 * Objekt des Auftretens: {@link enchant.Group}, {@link enchant.Scene}
 * @type {String}
 */
enchant.Event.CHILD_REMOVED = 'childremoved';

/**
 * Ereignis, welchses auftritt wenn der Node aus einer Gruppe
 * entfernt wird.
 * Objekt des Auftretens: {@link enchant.Node}
 * @type {String}
 */
enchant.Event.REMOVED = 'removed';

/**
 * Ereignis, welchses auftritt wenn der Node aus einer Szene
 * entfernt wird.
 * Objekt des Auftretens: {@link enchant.Node}
 * @type {String}
 */
enchant.Event.REMOVED_FROM_SCENE = 'removedfromscene';

/**
 * Ereignis, welchses auftritt wenn ein Touch auf einen Node
 * beginnt. Klicks werden als Touch behandelt.
 * Objekt des Auftretens: {@link enchant.Node}
 * @type {String}
 */
enchant.Event.TOUCH_START = 'touchstart';

/**
 * Ereignis, welchses auftritt wenn ein Touch auf einen Node
 * bewegt wurde. Klicks werden als Touch behandelt.
 * Objekt des Auftretens: {@link enchant.Node}
 * @type {String}
 */
enchant.Event.TOUCH_MOVE = 'touchmove';

/**
 * Ereignis, welchses auftritt wenn ein Touch auf einen Node
 * endet. Klicks werden als Touch behandelt.
 * Objekt des Auftretens: {@link enchant.Node}
 * @type {String}
 */
enchant.Event.TOUCH_END = 'touchend';

/**
 * Ereignis, welchses auftritt wenn eine Entity
 * gerendert wird.
 * Objekt des Auftretens: {@link enchant.Entity}
 * @type {String}
 */
enchant.Event.RENDER = 'render';

/**
 * Ereignis, welchses auftritt wenn ein Knopf gedückt wird.
 * Objekt des Auftretens: {@link enchant.Core}, {@link enchant.Scene}
 * @type {String}
 */
enchant.Event.INPUT_START = 'inputstart';

/**
 * Ereignis, welchses auftritt wenn eine Knopfeingabe verändert wird.
 * Objekt des Auftretens: {@link enchant.Core}, {@link enchant.Scene}
 * @type {String}
 */
enchant.Event.INPUT_CHANGE = 'inputchange';

/**
 * Ereignis, welchses auftritt wenn eine Knopf losgelassen wird.
 * Objekt des Auftretens: {@link enchant.Core}, {@link enchant.Scene}
 * @type {String}
 */
enchant.Event.INPUT_END = 'inputend';

/**
 * Ereignis, welchses auftritt wenn der "Nach Links"-Knopf gedrückt wird.
 * Objekt des Auftretens: {@link enchant.Core}, {@link enchant.Scene}
 * @type {String}
 */
enchant.Event.LEFT_BUTTON_DOWN = 'leftbuttondown';

/**
 * Ereignis, welchses auftritt wenn der "Nach Links"-Knopf losgelassen wird.
 * Objekt des Auftretens: {@link enchant.Core}, {@link enchant.Scene}
 * @type {String}
 */
enchant.Event.LEFT_BUTTON_UP = 'leftbuttonup';

/**
 * Ereignis, welchses auftritt wenn der "Nach Rechts"-Knopf gedrückt wird.
 * Objekt des Auftretens: {@link enchant.Core}, {@link enchant.Scene}
 * @type {String}
 */
enchant.Event.RIGHT_BUTTON_DOWN = 'rightbuttondown';

/**
 * Ereignis, welchses auftritt wenn der "Nach Rechts"-Knopf losgelassen wird.
 * Objekt des Auftretens: {@link enchant.Core}, {@link enchant.Scene}
 * @type {String}
 */
enchant.Event.RIGHT_BUTTON_UP = 'rightbuttonup';

/**
 * Ereignis, welchses auftritt wenn der "Nach Oben"-Knopf gedrückt wird.
 * Objekt des Auftretens: {@link enchant.Core}, {@link enchant.Scene}
 * @type {String}
 */
enchant.Event.UP_BUTTON_DOWN = 'upbuttondown';

/**
 * Ereignis, welchses auftritt wenn der "Nach Oben"-Knopf losgelassen wird.
 * Objekt des Auftretens: {@link enchant.Core}, {@link enchant.Scene}
 * @type {String}
 */
enchant.Event.UP_BUTTON_UP = 'upbuttonup';

/**
 * Ereignis, welchses auftritt wenn der "Nach Unten"-Knopf gedrückt wird.
 * Objekt des Auftretens: {@link enchant.Core}, {@link enchant.Scene}
 * @type {String}
 */
enchant.Event.DOWN_BUTTON_DOWN = 'downbuttondown';

/**
 * Ereignis, welchses auftritt wenn der "Nach Unten"-Knopf losgelassen wird.
 * Objekt des Auftretens: {@link enchant.Core}, {@link enchant.Scene}
 * @type {String}
 */
enchant.Event.DOWN_BUTTON_UP = 'downbuttonup';

/**
 * Ereignis, welchses auftritt wenn der "A"-Knopf gedrückt wird.
 * Objekt des Auftretens: {@link enchant.Core}, {@link enchant.Scene}
 * @type {String}
 */
enchant.Event.A_BUTTON_DOWN = 'abuttondown';

/**
 * Ereignis, welchses auftritt wenn der "A"-Knopf losgelassen wird.
 * Objekt des Auftretens: {@link enchant.Core}, {@link enchant.Scene}
 * @type {String}
 */
enchant.Event.A_BUTTON_UP = 'abuttonup';

/**
 * Ereignis, welchses auftritt wenn der "B"-Knopf gedrückt wird.
 * Objekt des Auftretens: {@link enchant.Core}, {@link enchant.Scene}
 * @type {String}
 */
enchant.Event.B_BUTTON_DOWN = 'bbuttondown';

/**
 * Ereignis, welchses auftritt wenn der "B"-Knopf losgelassen wird.
 * Objekt des Auftretens: {@link enchant.Core}, {@link enchant.Scene}
 * @type {String}
 */
enchant.Event.B_BUTTON_UP = 'bbuttonup';

/**
 */
enchant.Event.ADDED_TO_TIMELINE = "addedtotimeline";

/**
 * @type {String}
 */
enchant.Event.REMOVED_FROM_TIMELINE = "removedfromtimeline";

/**
 * @type {String}
 */
enchant.Event.ACTION_START = "actionstart";

/**
 * @type {String}
 */
enchant.Event.ACTION_END = "actionend";

/**
 * @type {String}
 */
enchant.Event.ACTION_TICK = "actiontick";

/**
 * @type {String}
 */
enchant.Event.ACTION_ADDED = "actionadded";

/**
 * @type {String}
 */
enchant.Event.ACTION_REMOVED = "actionremoved";

/**
 * @scope enchant.EventTarget.prototype
 */
enchant.EventTarget = enchant.Class.create({
    /**
     * @name enchant.EventTarget
     * @class
     * Eine Klasse für eine unabhängige Implementierung von Ereignissen 
     * (Events), ähnlich wie DOM Events.
     * Jedoch wird das Phasenkonzept nicht unterstützt.
     * @extends {enchant.Event}
     * @constructs
     */
    initialize: function() {
        this._listeners = {};
    },
    /**
     * Fügt einen neuen Ereignisbeobachter hinzu, welcher beim Auftreten des
     * Events ausgeführt wird.
     * @param {String} type Ereignis Typ.
     * @param {function(e:enchant.Event)} listener Der Ereignisbeobachter 
     * der hinzugefügt wird.
     */
    addEventListener: function(type, listener) {
        var listeners = this._listeners[type];
        if (listeners == null) {
            this._listeners[type] = [listener];
        } else if (listeners.indexOf(listener) === -1) {
            listeners.unshift(listener);

        }
    },
    /**
     * Synonym for addEventListener
     * @see {enchant.EventTarget#addEventListener}
     * @param {String} type Type of the events.
     * @param {function(e:enchant.Event)} listener Event listener to be added.
     */
    on: function() {
        this.addEventListener.apply(this, arguments);
    },
    /**
     * Entfernt einen Ereignisbeobachter.
     * @param {String} type Ereignis Typ.
     * @param {function(e:enchant.Event)} listener Der Ereignisbeobachter 
     * der entfernt wird.
     */
    removeEventListener: function(type, listener) {
        var listeners = this._listeners[type];
        if (listeners != null) {
            var i = listeners.indexOf(listener);
            if (i !== -1) {
                listeners.splice(i, 1);
            }
        }
    },
    /**
     * Entfernt alle Ereignisbeobachter für einen Typ.
     * Wenn kein Typ gegeben ist, werden alle 
     * Ereignisbeobachter entfernt.
     * @param [String] type Ereignis Typ.
     */
    clearEventListener: function(type) {
        if (type != null) {
            delete this._listeners[type];
        } else {
            this._listeners = {};
        }
    },
    /**
     * Löst ein Ereignis aus.
     * @param {enchant.Event} e Ereignis das ausgelöst werden soll.
     */
    dispatchEvent: function(e) {
        e.target = this;
        e.localX = e.x - this._offsetX;
        e.localY = e.y - this._offsetY;
        if (this['on' + e.type] != null){
            this['on' + e.type](e);
        }
        var listeners = this._listeners[e.type];
        if (listeners != null) {
            listeners = listeners.slice();
            for (var i = 0, len = listeners.length; i < len; i++) {
                listeners[i].call(this, e);
            }
        }
    }
});

/**
 * @scope enchant.Core.prototype
 */
(function() {
    var core;
    /**
     * @scope enchant.Core.prototype
     */
    enchant.Core = enchant.Class.create(enchant.EventTarget, {
        /**
         * @name enchant.Core
         * @class
         * Klasse, welche die Spielschleife und Szenen kontrolliert.
         *
         * Es kann immer nur eine Instanz geben und sollte der Konstruktor ausgeführt werden,
         * obwohl bereits eine Instanz existiert, wird die vorherige Instanz überschrieben.
         * Auf die aktuell existierende Instanz kann über die {@link enchant.Core.instance}
         * Variable zugegriffen werden.
         *
         * @param {Number} width Die Breite des Spieles.
         * @param {Number} height Die Höhe des Spieles.
         * @constructs
         * @extends enchant.EventTarget
         */
        initialize: function(width, height) {
            if (window.document.body === null) {
                // @TODO postpone initialization after window.onload
                throw new Error("document.body is null. Please excute 'new Core()' in window.onload.");
            }

            enchant.EventTarget.call(this);
            var initial = true;
            if (core) {
                initial = false;
                core.stop();
            }
            core = enchant.Core.instance = this;

            /**
             * Breite des Spieles.
             * @type {Number}
             */
            this.width = width || 320;
            /**
             * Höhe des Spieles.
             * @type {Number}
             */
            this.height = height || 320;
            /**
             * Skalierung der Spieldarstellung.
             * @type {Number}
             */
            this.scale = 1;

            var stage = document.getElementById('enchant-stage');
            if (!stage) {
                stage = document.createElement('div');
                stage.id = 'enchant-stage';
//                stage.style.width = window.innerWidth + 'px';
//                stage.style.height = window.innerHeight + 'px';
                stage.style.position = 'absolute';

                if (document.body.firstChild) {
                    document.body.insertBefore(stage, document.body.firstChild);
                } else {
                    document.body.appendChild(stage);
                }
                this.scale = Math.min(
                    window.innerWidth / this.width,
                    window.innerHeight / this.height
                );
                this._pageX = 0;
                this._pageY = 0;
            } else {
                var style = window.getComputedStyle(stage);
                width = parseInt(style.width, 10);
                height = parseInt(style.height, 10);
                if (width && height) {
                    this.scale = Math.min(
                        width / this.width,
                        height / this.height
                    );
                } else {
                    stage.style.width = this.width + 'px';
                    stage.style.height = this.height + 'px';
                }
                while (stage.firstChild) {
                    stage.removeChild(stage.firstChild);
                }
                stage.style.position = 'relative';

                var bounding = stage.getBoundingClientRect();
                this._pageX = Math.round(window.scrollX || window.pageXOffset + bounding.left);
                this._pageY = Math.round(window.scrollY || window.pageYOffset + bounding.top);
            }
            if (!this.scale) {
                this.scale = 1;
            }
            stage.style.fontSize = '12px';
            stage.style.webkitTextSizeAdjust = 'none';
            this._element = stage;

            /**
             * Frame Rate des Spieles.
             * @type {Number}
             */
            this.fps = 30;
            /**
             * Anzahl der Frames seit dem Spielestart.
             * @type {Number}
             */
            this.frame = 0;
            /**
             * Zeigt an ob das Spiel ausgeführt werden kann.
             * @type {Boolean}
             */
            this.ready = false;
            /**
             * Zeigt an ob das Spiel derzeit ausgeführt wird.
             * @type {Boolean}
             */
            this.running = false;
            /**
             * Geladene Objekte werden unter dem Pfad als Schlüssel in diesem Objekt abgelegt.
             * @type {Object.<String, Surface>}
             */
            this.assets = {};
            var assets = this._assets = [];
            (function detectAssets(module) {
                if (module.assets instanceof Array) {
                    [].push.apply(assets, module.assets);
                }
                for (var prop in module) {
                    if (module.hasOwnProperty(prop)) {
                        if (typeof module[prop] === 'object' && Object.getPrototypeOf(module[prop]) === Object.prototype) {
                            detectAssets(module[prop]);
                        }
                    }
                }
            }(enchant));

            this._scenes = [];
            /**
             * Die aktuell dargestellte Szene.
             * Diese Szene befindet sich oben auf dem Stapelspeicher.
             * @type {enchant.Scene}
             */
            this.currentScene = null;
            /**
             * Die Ursprungsszene.
             * Diese Szene befindet sich unten auf dem Stapelspeicher.
             * @type {enchant.Scene}
             */
            this.rootScene = new enchant.Scene();
            this.pushScene(this.rootScene);
            /**
             * Die Szene, welche während des Ladevorgangs dargestellt wird.
             * @type {enchant.Scene}
             */
            this.loadingScene = new enchant.Scene();
            this.loadingScene.backgroundColor = '#000';
            var barWidth = this.width * 0.4 | 0;
            var barHeight = this.width * 0.05 | 0;
            var border = barWidth * 0.03 | 0;
            var bar = new enchant.Sprite(barWidth, barHeight);

            bar.x = (this.width - barWidth) / 2;
            bar.y = (this.height - barHeight) / 2;
            var image = new enchant.Surface(barWidth, barHeight);
            image.context.fillStyle = '#fff';
            image.context.fillRect(0, 0, barWidth, barHeight);
            image.context.fillStyle = '#000';
            image.context.fillRect(border, border, barWidth - border * 2, barHeight - border * 2);
            bar.image = image;
            var progress = 0, _progress = 0;
            this.addEventListener('progress', function(e) {
                progress = e.loaded / e.total;
            });
            bar.addEventListener('enterframe', function() {
                _progress *= 0.9;
                _progress += progress * 0.1;
                image.context.fillStyle = '#fff';
                image.context.fillRect(border, 0, (barWidth - border * 2) * _progress, barHeight);
            });
            this.loadingScene.addChild(bar);

            this._mousedownID = 0;
            this._surfaceID = 0;
            this._soundID = 0;

            /**
             * @type {Boolean}
             * @private
             */
            this._activated = false;

            this._offsetX = 0;
            this._offsetY = 0;

            /**
             * Objekt, welches den aktuellen Eingabestatus des Spieles speichert.
             * @type {Object.<String, Boolean>}
             */
            this.input = {};
            if (!enchant.ENV.KEY_BIND_TABLE) {
                enchant.ENV.KEY_BIND_TABLE = {};
            }
            this._keybind = enchant.ENV.KEY_BIND_TABLE;
            this.pressedKeysNum = 0;
            this._internalButtondownListeners = {};
            this._internalButtonupListeners = {};

            for (var prop in this._keybind) {
                this.keybind(prop, this._keybind[prop]);
            }

            if (initial) {
                stage = enchant.Core.instance._element;
                var evt;
                document.addEventListener('keydown', function(e) {
                    core.dispatchEvent(new enchant.Event('keydown'));
                    if (enchant.ENV.PREVENT_DEFAULT_KEY_CODES.indexOf(e.keyCode) !== -1) {
                        e.preventDefault();
                        e.stopPropagation();
                    }

                    if (!core.running) {
                        return;
                    }
                    var button = core._keybind[e.keyCode];
                    if (button) {
                        evt = new enchant.Event(button + 'buttondown');
                        core.dispatchEvent(evt);
                    }
                }, true);
                document.addEventListener('keyup', function(e) {
                    if (!core.running) {
                        return;
                    }
                    var button = core._keybind[e.keyCode];
                    if (button) {
                        evt = new enchant.Event(button + 'buttonup');
                        core.dispatchEvent(evt);
                    }
                }, true);

                if (enchant.ENV.TOUCH_ENABLED) {
                    stage.addEventListener('touchstart', function(e) {
                        var tagName = (e.target.tagName).toLowerCase();
                        if (enchant.ENV.USE_DEFAULT_EVENT_TAGS.indexOf(tagName) === -1) {
                            e.preventDefault();
                            if (!core.running) {
                                e.stopPropagation();
                            }
                        }
                    }, true);
                    stage.addEventListener('touchmove', function(e) {
                        var tagName = (e.target.tagName).toLowerCase();
                        if (enchant.ENV.USE_DEFAULT_EVENT_TAGS.indexOf(tagName) === -1) {
                            e.preventDefault();
                            if (!core.running) {
                                e.stopPropagation();
                            }
                        }
                    }, true);
                    stage.addEventListener('touchend', function(e) {
                        var tagName = (e.target.tagName).toLowerCase();
                        if (enchant.ENV.USE_DEFAULT_EVENT_TAGS.indexOf(tagName) === -1) {
                            e.preventDefault();
                            if (!core.running) {
                                e.stopPropagation();
                            }
                        }
                    }, true);
                }
                stage.addEventListener('mousedown', function(e) {
                    var tagName = (e.target.tagName).toLowerCase();
                    if (enchant.ENV.USE_DEFAULT_EVENT_TAGS.indexOf(tagName) === -1) {
                        e.preventDefault();
                        core._mousedownID++;
                        if (!core.running) {
                            e.stopPropagation();
                        }
                    }
                }, true);
                stage.addEventListener('mousemove', function(e) {
                    var tagName = (e.target.tagName).toLowerCase();
                    if (enchant.ENV.USE_DEFAULT_EVENT_TAGS.indexOf(tagName) === -1) {
                        e.preventDefault();
                        if (!core.running) {
                            e.stopPropagation();
                        }
                    }
                }, true);
                stage.addEventListener('mouseup', function(e) {
                    var tagName = (e.target.tagName).toLowerCase();
                    if (enchant.ENV.USE_DEFAULT_EVENT_TAGS.indexOf(tagName) === -1) {
                        e.preventDefault();
                        if (!core.running) {
                            e.stopPropagation();
                        }
                    }
                }, true);
                core._touchEventTarget = {};
                if (enchant.ENV.TOUCH_ENABLED) {
                    stage.addEventListener('touchstart', function(e) {
                        var core = enchant.Core.instance;
                        var evt = new enchant.Event(enchant.Event.TOUCH_START);
                        var touches = e.changedTouches;
                        var touch, target;
                        for (var i = 0, l = touches.length; i < l; i++) {
                            touch = touches[i];
                            evt._initPosition(touch.pageX, touch.pageY);
                            target = core.currentScene._determineEventTarget(evt);
                            core._touchEventTarget[touch.identifier] = target;
                            target.dispatchEvent(evt);
                        }
                    }, false);
                    stage.addEventListener('touchmove', function(e) {
                        var core = enchant.Core.instance;
                        var evt = new enchant.Event(enchant.Event.TOUCH_MOVE);
                        var touches = e.changedTouches;
                        var touch, target;
                        for (var i = 0, l = touches.length; i < l; i++) {
                            touch = touches[i];
                            target = core._touchEventTarget[touch.identifier];
                            if (target) {
                                evt._initPosition(touch.pageX, touch.pageY);
                                target.dispatchEvent(evt);
                            }
                        }
                    }, false);
                    stage.addEventListener('touchend', function(e) {
                        var core = enchant.Core.instance;
                        var evt = new enchant.Event(enchant.Event.TOUCH_END);
                        var touches = e.changedTouches;
                        var touch, target;
                        for (var i = 0, l = touches.length; i < l; i++) {
                            touch = touches[i];
                            target = core._touchEventTarget[touch.identifier];
                            if (target) {
                                evt._initPosition(touch.pageX, touch.pageY);
                                target.dispatchEvent(evt);
                                delete core._touchEventTarget[touch.identifier];
                            }
                        }
                    }, false);
                }
                stage.addEventListener('mousedown', function(e) {
                    var core = enchant.Core.instance;
                    var evt = new enchant.Event(enchant.Event.TOUCH_START);
                    evt._initPosition(e.pageX, e.pageY);
                    var target = core.currentScene._determineEventTarget(evt);
                    core._touchEventTarget[core._mousedownID] = target;
                    target.dispatchEvent(evt);
                }, false);
                stage.addEventListener('mousemove', function(e) {
                    var core = enchant.Core.instance;
                    var evt = new enchant.Event(enchant.Event.TOUCH_MOVE);
                    evt._initPosition(e.pageX, e.pageY);
                    var target = core._touchEventTarget[core._mousedownID];
                    if (target) {
                        target.dispatchEvent(evt);
                    }
                }, false);
                stage.addEventListener('mouseup', function(e) {
                    var core = enchant.Core.instance;
                    var evt = new enchant.Event(enchant.Event.TOUCH_END);
                    evt._initPosition(e.pageX, e.pageY);
                    core._touchEventTarget[core._mousedownID].dispatchEvent(evt);
                    delete core._touchEventTarget[core._mousedownID];
                }, false);
            }
        },
        /**
         * Lässt Dateien im voraus laden.
         *
         * Diese Methode setzt die Dateien die im voraus geladen werden sollen. Wenn {@link enchant.Core#start}
         * aufgerufen wird, findet das tatsächliche laden der Resource statt. Sollten alle Dateien vollständig
         * geladen sein, wird ein {@link enchant.Event.LOAD} Ereignis auf dem Core Objekt ausgelöst.
         * Abhängig von den Dateien die geladen werden sollen, werden unterschiedliche Objekte erstellt und in
         * dem {@link enchant.Core#assets} Feld gespeichert.
         * Falls ein Bild geladen wird, wird ein {@link enchant.Surface} Objekt erstellt. Wenn es eine Ton Datei ist,
         * wird ein {@link enchant.Sound} Objekt erstellt. Ansonsten kann auf die Datei über einen String zugegriffen werden.
         *
         * Da die Surface Objekte mittels {@link enchant.Surface.load} erstellt werden ist zusätlich ist zu beachten, dass
         * eine direkte Objektmanipulation nicht möglich ist.
         * Für diesen Fall ist auf die {@link enchant.Surface.load} Dokumentation zu verweisen.
         *
         * @example
         *   core.preload('player.gif');
         *   core.onload = function() {
         *      var sprite = new Sprite(32, 32);
         *      sprite.image = core.assets['player.gif']; // zugriff mittels Dateipfades
         *      ...
         *   };
         *   core.start();
         *
         * @param {...String} assets Pfade zu den Dateien die im voraus geladen werden sollen.
         * Mehrfachangaben möglich.
         */
        preload: function(assets) {
            if (!(assets instanceof Array)) {
                assets = Array.prototype.slice.call(arguments);
            }
            [].push.apply(this._assets, assets);
        },
        /**
         * Laden von Dateien.
         *
         * @param {String} asset Pfad zu der Datei die geladen werden soll.
         * @param {Function} [callback] Funktion die ausgeführt wird wenn das laden abgeschlossen wurde.
         */
        load: function(src, callback) {
            if (callback == null) {
                callback = function() {
                };
            }

            var ext = enchant.Core.findExt(src);

            if (enchant.Core._loadFuncs[ext]) {
                enchant.Core._loadFuncs[ext].call(this, src, callback, ext);
            }
            else {
                var req = new XMLHttpRequest();
                req.open('GET', src, true);
                req.onreadystatechange = function(e) {
                    if (req.readyState === 4) {
                        if (req.status !== 200 && req.status !== 0) {
                            throw new Error(req.status + ': ' + 'Cannot load an asset: ' + src);
                        }

                        var type = req.getResponseHeader('Content-Type') || '';
                        if (type.match(/^image/)) {
                            core.assets[src] = enchant.Surface.load(src);
                            core.assets[src].addEventListener('load', callback);
                        } else if (type.match(/^audio/)) {
                            core.assets[src] = enchant.Sound.load(src, type);
                            core.assets[src].addEventListener('load', callback);
                        } else {
                            core.assets[src] = req.responseText;
                            callback();
                        }
                    }
                };
                req.send(null);
            }
        },
        /**
         * Starte das Spiel
         *
         * Je nach der Frame Rate definiert in {@link enchant.Core#fps}, wird der Frame in der
         * {@link enchant.Core#currentScene} aktualisiert. Sollten Dateien die im voraus geladen werden
         * sollen vorhanden sein, beginnt das laden dieser Dateien und der Ladebildschirm wird dargestellt.
         */
        start: function() {
            var onloadTimeSetter = function() {
                this.currentTime = this.getTime();
                this._nextTime = 0;
                this.removeEventListener('load', onloadTimeSetter);
                this.running = true;
                this.ready = true;
                this._requestNextFrame();
            };
            this.addEventListener('load', onloadTimeSetter);

            if (!this._activated && this._assets.length) {
                this._activated = true;
                if (enchant.Sound.enabledInMobileSafari && !core._touched &&
                    enchant.ENV.VENDOR_PREFIX === 'webkit' && enchant.ENV.TOUCH_ENABLED) {
                    var scene = new enchant.Scene();
                    scene.backgroundColor = '#000';
                    var size = Math.round(core.width / 10);
                    var sprite = new enchant.Sprite(core.width, size);
                    sprite.y = (core.height - size) / 2;
                    sprite.image = new enchant.Surface(core.width, size);
                    sprite.image.context.fillStyle = '#fff';
                    sprite.image.context.font = (size - 1) + 'px bold Helvetica,Arial,sans-serif';
                    var width = sprite.image.context.measureText('Touch to Start').width;
                    sprite.image.context.fillText('Touch to Start', (core.width - width) / 2, size - 1);
                    scene.addChild(sprite);
                    document.addEventListener('touchstart', function() {
                        core._touched = true;
                        core.removeScene(scene);
                        core.start();
                    }, true);
                    core.pushScene(scene);
                    return;
                }

                var o = {};
                var assets = this._assets.filter(function(asset) {
                    return asset in o ? false : o[asset] = true;
                });
                var loaded = 0,
                    len = assets.length,
                    loadFunc = function() {
                        var e = new enchant.Event('progress');
                        e.loaded = ++loaded;
                        e.total = len;
                        core.dispatchEvent(e);
                        if (loaded === len) {
                            core.removeScene(core.loadingScene);
                            core.dispatchEvent(new enchant.Event('load'));
                        }
                    };

                for (var i = 0; i < len; i++) {
                    this.load(assets[i], loadFunc);
                }
                this.pushScene(this.loadingScene);
            } else {
                this.dispatchEvent(new enchant.Event('load'));
            }
        },
        /**
         * Startet den Debug-Modus des Spieles.
         *
         * Auch wenn die enchant.Core.instance._debug Variable gesetzt ist,
         * kann der Debug-Modus gestartet werden.
         */
        debug: function() {
            this._debug = true;
            this.start();
        },
        actualFps: {
            get: function() {
                return this._actualFps || this.fps;
            }
        },
        /**
         * @private
         */
        _requestNextFrame: function() {
            if (!this.ready) {
                return;
            }
            var core = this;
            window.requestAnimationFrame(core._checkTick);
        },
        /**
         * @private
         */
        _checkTick: function(now) {
            var core = enchant.Core.instance;
            if (core._nextTime < now) {
                // if enough time has passed, execute _tick
                core._tick(now);
            } else {
                // if enough time has not passed yet, request next frame
                window.requestAnimationFrame(core._checkTick);
            }
        },
        _tick: function(now) {
            var e = new enchant.Event('enterframe');
            e.elapsed = now - this.currentTime;

            // frame fragment time, will be used in _checkTick
            this._nextTime = now + 1000 / this.fps;
            this.currentTime = now;
            this._actualFps = e.elapsed > 0 ? (1000 / e.elapsed) : 0;

            var nodes = this.currentScene.childNodes.slice();
            var push = Array.prototype.push;
            while (nodes.length) {
                var node = nodes.pop();
                node.age++;
                node.dispatchEvent(e);
                if (node.childNodes) {
                    push.apply(nodes, node.childNodes);
                }
            }

            this.currentScene.age++;
            this.currentScene.dispatchEvent(e);
            this.dispatchEvent(e);

            this.dispatchEvent(new enchant.Event('exitframe'));
            this.frame++;
            this._requestNextFrame();
        },
        getTime: function() {
            return window.getTime();
        },
        /**
         * Stoppt das Spiel.
         *
         * Der Frame wird nicht mehr aktualisiert und Spielereingaben werden nicht
         * mehr akzeptiert. Das spiel kann mit der {@link enchant.Core#start} Methode
         * erneut gestartet werden.
         */
        stop: function() {
            this.ready = false;
            this.running = false;
        },
        /**
         * Stoppt das Spiel.
         *
         * Der Frame wird nicht mehr aktualisiert und Spielereingaben werden nicht
         * mehr akzeptiert. Das spiel kann mit der {@link enchant.Core#start} Methode
         * erneut gestartet werden.
         */
        pause: function() {
            this.ready = false;
        },
        /**
         * Setzt die Ausführung des Spieles fort.
         */
        resume: function() {
            if (this.ready) {
                return;
            }
            this.currentTime = this.getTime();
            this.ready = true;
            this.running = true;
            this._requestNextFrame();
        },

        /**
         * Wechselt zu einer neuen Szene.
         *
         * Szenen werden durch einen Stapelspeicher kontrolliert und die Darstellungsreihenfolge
         * folgt ebenfalls der Ordnung des Stapelspeichers.
         * Wenn die {@link enchant.Core#pushScene} Methode ausgeführt wird, wird die Szene auf dem
         * Stapelspeicher oben abgelegt. Der Frame wird immer in der Szene ganz oben auf dem Stapelspeicher
         * aktualisiert.
         *
         * @param {enchant.Scene} scene Die neue Szene zu der gewechselt werden soll.
         * @return {enchant.Scene} Die neue Szene.
         */
        pushScene: function(scene) {
            this._element.appendChild(scene._element);
            if (this.currentScene) {
                this.currentScene.dispatchEvent(new enchant.Event('exit'));
            }
            this.currentScene = scene;
            this.currentScene.dispatchEvent(new enchant.Event('enter'));
            return this._scenes.push(scene);
        },
        /**
         * Beendet die aktuelle Szene und wechselt zu der vorherigen Szene.
         *
         * Szenen werden durch einen Stapelspeicher kontrolliert und die Darstellungsreihenfolge
         * folgt ebenfalls der Ordnung des Stapelspeichers.
         * Wenn die {@link enchant.Core#popScene} Methode ausgeführt wird, wird die Szene oben auf dem
         * Stapelspeicher entfernt und liefert diese als Rückgabewert.
         *
         * @return {enchant.Scene} Die Szene, die beendet wurde.
         */
        popScene: function() {
            if (this.currentScene === this.rootScene) {
                return this.currentScene;
            }
            this._element.removeChild(this.currentScene._element);
            this.currentScene.dispatchEvent(new enchant.Event('exit'));
            this.currentScene = this._scenes[this._scenes.length - 2];
            this.currentScene.dispatchEvent(new enchant.Event('enter'));
            return this._scenes.pop();
        },
        /**
         * Ersetzt die aktuelle Szene durch eine neue Szene.
         *
         * {@link enchant.Core#popScene}, {@link enchant.Core#pushScene} werden nacheinander
         * ausgeführt um die aktuelle Szene durch die neue zu ersetzen.
         *
         * @param {enchant.Scene} scene Die neue Szene, welche die aktuelle Szene ersetzen wird.
         * @return {enchant.Scene} Die neue Szene.
         */
        replaceScene: function(scene) {
            this.popScene();
            return this.pushScene(scene);
        },
        /**
         * Entfernt eine Szene.
         *
         * Entfernt eine Szene aus dem Szenen-Stapelspeicher.
         *
         * @param {enchant.Scene} scene Die Szene die entfernt werden soll.
         * @return {enchant.Scene} Die entfernte Szene.
         */
        removeScene: function(scene) {
            if (this.currentScene === scene) {
                return this.popScene();
            } else {
                var i = this._scenes.indexOf(scene);
                if (i !== -1) {
                    this._scenes.splice(i, 1);
                    this._element.removeChild(scene._element);
                    return scene;
                } else {
                    return null;
                }
            }
        },
        /**
         * Bindet eine Taste.
         *
         * @param {Number} key Der Tastencode der Taste die gebunden werden soll.
         * @param {String} button Der enchant.js Knopf (left, right, up, down, a, b).
         */
        keybind: function(key, button) {
            this._keybind[key] = button;
            var onxbuttondown = function(e) {
                var inputEvent;
                if (!this.input[button]) {
                    this.input[button] = true;
                    inputEvent = new enchant.Event((this.pressedKeysNum++) ? 'inputchange' : 'inputstart');
                    this.dispatchEvent(inputEvent);
                    this.currentScene.dispatchEvent(inputEvent);
                }
                this.currentScene.dispatchEvent(e);
            };
            var onxbuttonup = function(e) {
                var inputEvent;
                if (this.input[button]) {
                    this.input[button] = false;
                    inputEvent = new enchant.Event((--this.pressedKeysNum) ? 'inputchange' : 'inputend');
                    this.dispatchEvent(inputEvent);
                    this.currentScene.dispatchEvent(inputEvent);
                }
                this.currentScene.dispatchEvent(e);
            };

            this.addEventListener(button + 'buttondown', onxbuttondown);
            this.addEventListener(button + 'buttonup', onxbuttonup);

            this._internalButtondownListeners[key] = onxbuttondown;
            this._internalButtonupListeners[key] = onxbuttonup;
        },
        /**
         * Entbindet eine Taste.
         *
         * @param {Number} key Der Tastencode der entfernt werden soll.
         */
        keyunbind: function(key) {
            if (!this._keybind[key]) {
                return;
            }
            var buttondowns = this._internalButtondownListeners;
            var buttonups = this._internalButtonupListeners;

            this.removeEventListener(key + 'buttondown', buttondowns);
            this.removeEventListener(key + 'buttonup', buttonups);

            delete buttondowns[key];
            delete buttonups[key];

            delete this._keybind[key];
        },
        /**
         * Liefert die vergange Spielzeit (keine reale) die seit dem Aufruf von core.start
         * vergangen ist.
         * @return {Number} Die vergangene Zeit (Sekunden)
         */
        getElapsedTime: function() {
            return this.frame / this.fps;
        }
    });

    enchant.Core._loadFuncs = {};
    enchant.Core._loadFuncs['jpg'] =
        enchant.Core._loadFuncs['jpeg'] =
            enchant.Core._loadFuncs['gif'] =
                enchant.Core._loadFuncs['png'] =
                    enchant.Core._loadFuncs['bmp'] = function(src, callback) {
                        this.assets[src] = enchant.Surface.load(src);
                        this.assets[src].addEventListener('load', callback);
                    };
    enchant.Core._loadFuncs['mp3'] =
        enchant.Core._loadFuncs['aac'] =
            enchant.Core._loadFuncs['m4a'] =
                enchant.Core._loadFuncs['wav'] =
                    enchant.Core._loadFuncs['ogg'] = function(src, callback, ext) {
                        this.assets[src] = enchant.Sound.load(src, 'audio/' + ext, callback);
                    };

    /**
     * Get the file extension from a path
     * @param path
     * @return {*}
     */
    enchant.Core.findExt = function(path) {
        var matched = path.match(/\.\w+$/);
        if (matched && matched.length > 0) {
            return matched[0].slice(1).toLowerCase();
        }

        // for data URI
        if (path.indexOf('data:') === 0) {
            return path.split(/[\/;]/)[1].toLowerCase();
        }
        return null;
    };

    /**
     * Die aktuelle Instanz des Spieles.
     * @type {enchant.Core}
     * @static
     */
    enchant.Core.instance = null;
}());

/**
 * enchant.Core is moved to enchant.Core from v0.6
 * @type {*}
 */
enchant.Game = enchant.Core;
/**
 * @scope enchant.Node.prototype
 */
enchant.Node = enchant.Class.create(enchant.EventTarget, {
    /**
     * @name enchant.Node
     * @class
     * Basisklasse für Objekte die im Darstellungsbaum, 
     * dessen Wurzel eine Szene ist, enthalten sind.
     * Sollte nicht direkt verwendet werden.
     * @constructs
     * @extends enchant.EventTarget
     */
    initialize: function() {
        enchant.EventTarget.call(this);

        this._dirty = false;

        this._matrix = [ 1, 0, 0, 1, 0, 0 ];

        this._x = 0;
        this._y = 0;
        this._offsetX = 0;
        this._offsetY = 0;

        /**
         * Das Alter (Frames) dieses Nodes welches vor dem {@link enchant.Event.ENTER_FRAME} Ereignis erhöht wird.
         * @type {Number}
         */
        this.age = 0;

        /**
         * Der Eltern-Node dieses Node.
         * @type {enchant.Group}
         */
        this.parentNode = null;
        /**
         * Die Szene, zu welcher dieser Node gehört.
         * @type {enchant.Scene}
         */
        this.scene = null;

        this.addEventListener('touchstart', function(e) {
            if (this.parentNode) {
                this.parentNode.dispatchEvent(e);
            }
        });
        this.addEventListener('touchmove', function(e) {
            if (this.parentNode) {
                this.parentNode.dispatchEvent(e);
            }
        });
        this.addEventListener('touchend', function(e) {
            if (this.parentNode) {
                this.parentNode.dispatchEvent(e);
            }
        });

        /**
         */
        if(enchant.ENV.USE_ANIMATION){
            var tl = this.tl = new enchant.Timeline(this);
        }
    },
    /**
     * Bewegt diesen Node zu den gegebenen Ziel Koordinaten.
     * @param {Number} x Ziel x Koordinaten.
     * @param {Number} y Ziel y Koordinaten.
     */
    moveTo: function(x, y) {
        this._x = x;
        this._y = y;
        this._dirty = true;
    },
    /**
     * Bewegt diesen Node relativ zur aktuellen Position.
     * @param {Number} x Distanz auf der x Achse.
     * @param {Number} y Distanz auf der y Achse.
     */
    moveBy: function(x, y) {
        this._x += x;
        this._y += y;
        this._dirty = true;
    },
    /**
     * Die x Koordinaten des Nodes.
     * @type {Number}
     */
    x: {
        get: function() {
            return this._x;
        },
        set: function(x) {
            this._x = x;
            this._dirty = true;
        }
    },
    /**
     * Die y Koordinaten des Nodes.
     * @type {Number}
     */
    y: {
        get: function() {
            return this._y;
        },
        set: function(y) {
            this._y = y;
            this._dirty = true;
        }
    },
    _updateCoordinate: function() {
        var node = this;
        var tree = [ node ];
        var parent = node.parentNode;
        var scene = this.scene;
        while (parent && node._dirty) {
            tree.unshift(parent);
            node = node.parentNode;
            parent = node.parentNode;
        }
        var matrix = enchant.Matrix.instance;
        var stack = matrix.stack;
        var mat = [];
        var newmat, ox, oy;
        stack.push(tree[0]._matrix);
        for (var i = 1, l = tree.length; i < l; i++) {
            node = tree[i];
            newmat = [];
            matrix.makeTransformMatrix(node, mat);
            matrix.multiply(stack[stack.length - 1], mat, newmat);
            node._matrix = newmat;
            stack.push(newmat);
            ox = (typeof node._originX === 'number') ? node._originX : node._width / 2 || 0;
            oy = (typeof node._originY === 'number') ? node._originY : node._height / 2 || 0;
            var vec = [ ox, oy ];
            matrix.multiplyVec(newmat, vec, vec);
            node._offsetX = vec[0] - ox;
            node._offsetY = vec[1] - oy;
            node._dirty = false;
        }
        matrix.reset();
    },
    remove: function() {
        if (this._listener) {
            this.clearEventListener();
        }
        if (this.parentNode) {
            this.parentNode.removeChild(this);
        }
    }
});

var _intersectBetweenClassAndInstance = function(Class, instance) {
    /*
    return Class.collection.filter(function(classInstance) {
        return enchant.Entity.prototype._intersectone.call(instance, classInstance);
    });
    */
    var ret = [];
    var c;
    for (var i = 0, l = Class.collection.length; i < l; i++) {
        c = Class.collection[i];
        if (instance._intersectone(c)) {
            ret.push(c);
        }
    }
    return ret;
};

var _intersectBetweenClassAndClass = function(Class1, Class2) {
    var ret = [];
    /*
    Class1.collection.forEach(function(instance1) {
        Class2.collection.forEach(function(instance2) {
            if (enchant.Entity.prototype._intersectone.call(instance1, instance2)) {
                 ret.push([ instance1, instance2 ]);
            }
        });
    });
    */
    var c1, c2;
    for (var i = 0, l = Class1.collection.length; i < l; i++) {
        c1 = Class1.collection[i];
        for (var j = 0, ll = Class2.collection.length; j < ll; j++) {
            c2 = Class2.collection[j];
            if (c1._intersectone(c2)) {
                ret.push([ c1, c2 ]);
            }
        }
    }
    return ret;
};

var _staticintersect = function(other) {
    if (other instanceof enchant.Entity) {
        return _intersectBetweenClassAndInstance(this, other);
    } else if (typeof other === 'function' && other.collection) {
        return _intersectBetweenClassAndClass(this, other);
    }
    return false;
};

/**
 * @scope enchant.Entity.prototype
 */
enchant.Entity = enchant.Class.create(enchant.Node, {
    /**
     * @name enchant.Entity
     * @class
     * Eine Klasse die Objekte mit Hilfe von DOM Elementen darstellt.
     * Sollte nicht direkt verwendet werden.
     * @constructs
     * @extends enchant.Node
     */
    initialize: function() {
        var core = enchant.Core.instance;
        enchant.Node.call(this);

        this._rotation = 0;
        this._scaleX = 1;
        this._scaleY = 1;

        this._touchEnabled = true;
        this._clipping = false;

        this._originX = null;
        this._originY = null;

        this._width = 0;
        this._height = 0;
        this._backgroundColor = null;
        this._opacity = 1;
        this._visible = true;
        this._buttonMode = null;

        this._style = {};
        this.__styleStatus = {};

        /**
         */
        this.compositeOperation = null;

        /**
         * Definiert diese Entity als Schaltfläche (Button).
         * Bei einem Klick oder Touch wird das entsprechende
         * Button Ereignis (Event) ausgelöst.
         * Mögliche buttonModes sind: left, right, up, down, a, b. 
         * @type {String}
         */
        this.buttonMode = null;
        /**
         * Zeigt an, ob auf die Entity geklickt wurde.
         * Funktioniert nur wenn {@link enchant.Entity.buttonMode} gesetzt ist.
         * @type {Boolean}
         */
        this.buttonPressed = false;
        this.addEventListener('touchstart', function() {
            if (!this.buttonMode) {
                return;
            }
            this.buttonPressed = true;
            var e = new enchant.Event(this.buttonMode + 'buttondown');
            this.dispatchEvent(e);
            core.dispatchEvent(e);
        });
        this.addEventListener('touchend', function() {
            if (!this.buttonMode) {
                return;
            }
            this.buttonPressed = false;
            var e = new enchant.Event(this.buttonMode + 'buttonup');
            this.dispatchEvent(e);
            core.dispatchEvent(e);
        });

        this.enableCollection();
    },
    /**
     * Die Breite der Entity.
     * @type {Number}
     */
    width: {
        get: function() {
            return this._width;
        },
        set: function(width) {
            this._width = width;
            this._dirty = true;
        }
    },
    /**
     * Die Höhe der Entity.
     * @type {Number}
     */
    height: {
        get: function() {
            return this._height;
        },
        set: function(height) {
            this._height = height;
            this._dirty = true;
        }
    },
    /**
     * Die Hintergrundfarbe der Entity.
     * Muss im gleichen Format definiert werden wie das CSS 'color' Attribut.
     * @type {String}
     */
    backgroundColor: {
        get: function() {
            return this._backgroundColor;
        },
        set: function(color) {
            this._backgroundColor = color;
        }
    },
    /**
     * Transparenz der Entity.
     * Definiert den Level der Transparenz von 0 bis 1
     * (0 ist komplett transparent, 1 ist vollständig deckend).
     * @type {Number}
     */
    opacity: {
        get: function() {
            return this._opacity;
        },
        set: function(opacity) {
            this._opacity = parseFloat(opacity);
        }
    },
    /**
     * Zeigt an, ob die Entity dargestellt werden soll oder nicht.
     * @type {Boolean}
     */
    visible: {
        get: function() {
            return this._visible;
        },
        set: function(visible) {
            this._visible = visible;
        }
    },
    /**
     * Definiert ob auf die Entity geklickt werden kann. 
     * @type {Boolean}
     */
    touchEnabled: {
        get: function() {
            return this._touchEnabled;
        },
        set: function(enabled) {
            this._touchEnabled = enabled;
            if (enabled) {
                this._style.pointerEvents = 'all';
            } else {
                this._style.pointerEvents = 'none';
            }
        }
    },
    /**
     * Führt eine Kollisionsdetektion durch, die überprüft ob eine Überschneidung zwischen den
     * begrenzenden Rechtecken existiert. 
     * @param {*} other Ein Objekt wie Entity, welches x, y, width und height Variablen besitzt,
     * mit dem die Kollisionsdetektion durchgeführt wird.
     * @return {Boolean} True, falls eine Kollision festgestellt wurde.
     */
    intersect: function(other) {
        if (other instanceof enchant.Entity) {
            return this._intersectone(other);
        } else if (typeof other === 'function' && other.collection) {
            return _intersectBetweenClassAndInstance(other, this);
        }
        return false;
    },
    _intersectone: function(other) {
        if (this._dirty) {
            this._updateCoordinate();
        } if (other._dirty) {
            other._updateCoordinate();
        }
        return this._offsetX < other._offsetX + other.width && other._offsetX < this._offsetX + this.width &&
            this._offsetY < other._offsetY + other.height && other._offsetY < this._offsetY + this.height;
    },
    /**
     * Führt eine Kollisionsdetektion durch, die anhand der Distanz zwischen den Objekten feststellt,
     * ob eine Kollision aufgetreten ist.
     * @param {*} other Ein Objekt wie Entity, welches x, y, width und height Variablen besitzt,
     * mit dem die Kollisionsdetektion durchgeführt wird.
     * @param {Number} [distance] Die größte Distanz die für die Kollision in betracht gezogen wird.
     * Der Standardwert ist der Durchschnitt der Breite und Höhe beider Objekte.
     * @return {Boolean} True, falls eine Kollision festgestellt wurde.
     */
    within: function(other, distance) {
        if (this._dirty) {
            this._updateCoordinate();
        } if (other._dirty) {
            other._updateCoordinate();
        }
        if (distance == null) {
            distance = (this.width + this.height + other.width + other.height) / 4;
        }
        var _;
        return (_ = this._offsetX - other._offsetX + (this.width - other.width) / 2) * _ +
            (_ = this._offsetY - other._offsetY + (this.height - other.height) / 2) * _ < distance * distance;
    }, /**
     * Vergrößert oder verkleinert dieses Sprite.
     * @param {Number} x Skalierungsfaktor auf der x-Achse.
     * @param {Number} [y] Skalierungsfaktor auf der y-Achse.
     */
    scale: function(x, y) {
        this._scaleX *= x;
        this._scaleY *= (y != null) ? y : x;
        this._dirty = true;
    },
    /**
     * Rotiert dieses Sprite.
     * @param {Number} deg Rotationswinkel (Grad).
     */
    rotate: function(deg) {
        this._rotation += deg;
        this._dirty = true;
    },
    /**
     * Skalierungsfaktor auf der x-Achse dieses Sprites.
     * @type {Number}
     */
    scaleX: {
        get: function() {
            return this._scaleX;
        },
        set: function(scaleX) {
            this._scaleX = scaleX;
            this._dirty = true;
        }
    },
    /**
     * Skalierungsfaktor auf der y-Achse dieses Sprites.
     * @type {Number}
     */
    scaleY: {
        get: function() {
            return this._scaleY;
        },
        set: function(scaleY) {
            this._scaleY = scaleY;
            this._dirty = true;
        }
    },
    /**
     * Rotationswinkel des Sprites (Grad).
     * @type {Number}
     */
    rotation: {
        get: function() {
            return this._rotation;
        },
        set: function(rotation) {
            this._rotation = rotation;
            this._dirty = true;
        }
    },
    /**
     * Ausgangspunkt für Rotation und Skalierung.
     * @type {Number}
     */
    originX: {
        get: function() {
            return this._originX;
        },
        set: function(originX) {
            this._originX = originX;
            this._dirty = true;
        }
    },
    /**
     * Ausgangspunkt für Rotation und Skalierung.
     * @type {Number}
     */
    originY: {
        get: function() {
            return this._originY;
        },
        set: function(originY) {
            this._originY = originY;
            this._dirty = true;
        }
    },
    /**
     */
    enableCollection: function() {
        this.addEventListener('addedtoscene', this._addSelfToCollection);
        this.addEventListener('removedfromscene', this._removeSelfFromCollection);
        if (this.scene) {
            this._addSelfToCollection();
        }
    },
    /**
     */
    disableCollection: function() {
        this.removeEventListener('addedtoscene', this._addSelfToCollection);
        this.removeEventListener('removedfromscene', this._removeSelfFromCollection);
        if (this.scene) {
            this._removeSelfFromCollection();
        }
    },
    _addSelfToCollection: function() {
        var Constructor = this.getConstructor();
        Constructor._collectionTarget.forEach(function(C) {
            C.collection.push(this);
        }, this);
    },
    _removeSelfFromCollection: function() {
        var Constructor = this.getConstructor();
        Constructor._collectionTarget.forEach(function(C) {
            var i = C.collection.indexOf(this);
            if (i !== -1) {
                C.collection.splice(i, 1);
            }
        }, this);
    },
    getConstructor: function() {
        return Object.getPrototypeOf(this).constructor;
    }
});

var _collectizeConstructor = function(Constructor) {
    if (Constructor._collective) {
        return;
    }
    var rel = enchant.Class.getInheritanceTree(Constructor);
    var i = rel.indexOf(enchant.Entity);
    if (i !== -1) {
        Constructor._collectionTarget = rel.splice(0, i + 1);
    } else {
        Constructor._collectionTarget = [];
    }
    Constructor.intersect = _staticintersect;
    Constructor.collection = [];
    Constructor._collective = true;
};

_collectizeConstructor(enchant.Entity);

enchant.Entity._inherited = function(subclass) {
    _collectizeConstructor(subclass);
};

/**
 * @scope enchant.Sprite.prototype
 */
enchant.Sprite = enchant.Class.create(enchant.Entity, {
    /**
     * @name enchant.Sprite
     * @class
     * Eine Klasse die Grafiken darstellen kann.
     * 
     * @param {Number} [width] Die Breite des Sprites.
     * @param {Number} [height] Die Höhe des Sprites.
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
     * Die Grafik die im Sprite dargestellt wird.
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
     * Die Indizes der darzustellenden Frames.
     * Die Frames mit der selben Größe wie das Sprite werden aus der {@link enchant.Sprite#image} image Variable,
     * beginnend an der oberen linken Ecke, angeordnet. Wenn eine Nummbersequenz übergeben wird, wird
     * der dargestellte Frame automatisch gewechselt. Am ende des Arrays der Sequenz wird diese neugestartet.
     * Wenn ein Wert in der Sequenz auf null gesetzt wird, wird das automatische Framewechseln gestoppt.
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
            if(this._frame === frame) {
                return;
            }
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
    /**
     * width of Sprite
     * @type {Number}
     */
    width: {
        get: function() {
            return this._width;
        },
        set: function(width) {
            this._width = width;
            this._setFrame();
            this._dirty = true;
        }
    },
    /**
     * height of Sprite
     * @type {Number}
     */
    height: {
        get: function() {
            return this._height;
        },
        set: function(height) {
            this._height = height;
            this._setFrame();
            this._dirty = true;
        }
    },
    cvsRender: function(ctx) {
        if (this._image == null || this._width === 0 || this._height === 0) {
            return;
        }
        var image = this._image;
        var element = image._element;
        var sx = this._frameLeft;
        var sy = this._frameTop;
        var sw = Math.min(this.width, image.width - sx);
        var sh = Math.min(this.height, image.height - sy);
        var dw = Math.min(image.width, this.width);
        var dh = Math.min(image.height, this.height);
        var x, y, w, h;
        for (y = 0; y < this.height; y += dh) {
            h = (this.height < y + dh) ? this.height - y : dh;
            for (x = 0; x < this.width; x += dw) {
                w = (this.width < x + dw) ? this.width - x : dw;
                ctx.drawImage(element, sx, sy,
                    sw * w / dw, sh * h / dh, x, y, w, h);
            }
        }
    },
    domRender: function(element) {
        if (this._image) {
            if (this._image._css) {
                this._style['background-image'] = this._image._css;
                this._style['background-position'] =
                    -this._frameLeft + 'px ' +
                    -this._frameTop + 'px';
            } else if (this._image._element) {
            }
        }
    }
});

/**
 * @scope enchant.Label.prototype
 */
enchant.Label = enchant.Class.create(enchant.Entity, {
    /**
     * @name enchant.Label
     * @class
     * Erstellt ein Label Objekt.
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
     * Darzustellender Text.
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
     * Spezifiziert die horizontale Ausrichtung des Textes.
     * Kann im gleichen Format wie die CSS 'text-align' Eigenschaft angegeben werden.
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
     * Text Eigenschaften.
     * Kann im gleichen Format wie die CSS 'font' Eigenschaft angegeben werden.
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
     * Text Farbe.
     * Kann im gleichen Format wie die CSS 'color' Eigenschaft angegeben werden.
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

/**
 * @scope enchant.Map.prototype
 */
enchant.Map = enchant.Class.create(enchant.Entity, {
    /**
     * @name enchant.Map
     * @class
     * Eine Klasse mit der Karten aus Kacheln (Tiles)
     * erstellt und angezeigt werden können.
     *
     * @param {Number} tileWidth Kachelbreite.
     * @param {Number} tileHeight Kachelhöhe.
     * @constructs
     * @extends enchant.Entity
     */
    initialize: function(tileWidth, tileHeight) {
        var core = enchant.Core.instance;

        enchant.Entity.call(this);

        var surface = new enchant.Surface(core.width, core.height);
        this._surface = surface;
        var canvas = surface._element;
        canvas.style.position = 'absolute';
        if (enchant.ENV.RETINA_DISPLAY && core.scale === 2) {
            canvas.width = core.width * 2;
            canvas.height = core.height * 2;
            this._style.webkitTransformOrigin = '0 0';
            this._style.webkitTransform = 'scale(0.5)';
        } else {
            canvas.width = core.width;
            canvas.height = core.height;
        }
        this._context = canvas.getContext('2d');

        this._tileWidth = tileWidth || 0;
        this._tileHeight = tileHeight || 0;
        this._image = null;
        this._data = [
            [
                []
            ]
        ];
        this._dirty = false;
        this._tight = false;

        this.touchEnabled = false;

        /**
         * Ein 2-Dimensionales Array um zu speichern, ob für eine Kachel
         * Kollesionsdetektion durchgeführt werden soll.
         * @type {Array.<Array.<Number>>}
         */
        this.collisionData = null;

        this._listeners['render'] = null;
        this.addEventListener('render', function() {
            if (this._dirty || this._previousOffsetX == null) {
                this.redraw(0, 0, core.width, core.height);
            } else if (this._offsetX !== this._previousOffsetX ||
                this._offsetY !== this._previousOffsetY) {
                if (this._tight) {
                    var x = -this._offsetX;
                    var y = -this._offsetY;
                    var px = -this._previousOffsetX;
                    var py = -this._previousOffsetY;
                    var w1 = x - px + core.width;
                    var w2 = px - x + core.width;
                    var h1 = y - py + core.height;
                    var h2 = py - y + core.height;
                    if (w1 > this._tileWidth && w2 > this._tileWidth &&
                        h1 > this._tileHeight && h2 > this._tileHeight) {
                        var sx, sy, dx, dy, sw, sh;
                        if (w1 < w2) {
                            sx = 0;
                            dx = px - x;
                            sw = w1;
                        } else {
                            sx = x - px;
                            dx = 0;
                            sw = w2;
                        }
                        if (h1 < h2) {
                            sy = 0;
                            dy = py - y;
                            sh = h1;
                        } else {
                            sy = y - py;
                            dy = 0;
                            sh = h2;
                        }

                        if (core._buffer == null) {
                            core._buffer = document.createElement('canvas');
                            core._buffer.width = this._context.canvas.width;
                            core._buffer.height = this._context.canvas.height;
                        }
                        var context = core._buffer.getContext('2d');
                        if (this._doubledImage) {
                            context.clearRect(0, 0, sw * 2, sh * 2);
                            context.drawImage(this._context.canvas,
                                sx * 2, sy * 2, sw * 2, sh * 2, 0, 0, sw * 2, sh * 2);
                            context = this._context;
                            context.clearRect(dx * 2, dy * 2, sw * 2, sh * 2);
                            context.drawImage(core._buffer,
                                0, 0, sw * 2, sh * 2, dx * 2, dy * 2, sw * 2, sh * 2);
                        } else {
                            context.clearRect(0, 0, sw, sh);
                            context.drawImage(this._context.canvas,
                                sx, sy, sw, sh, 0, 0, sw, sh);
                            context = this._context;
                            context.clearRect(dx, dy, sw, sh);
                            context.drawImage(core._buffer,
                                0, 0, sw, sh, dx, dy, sw, sh);
                        }

                        if (dx === 0) {
                            this.redraw(sw, 0, core.width - sw, core.height);
                        } else {
                            this.redraw(0, 0, core.width - sw, core.height);
                        }
                        if (dy === 0) {
                            this.redraw(0, sh, core.width, core.height - sh);
                        } else {
                            this.redraw(0, 0, core.width, core.height - sh);
                        }
                    } else {
                        this.redraw(0, 0, core.width, core.height);
                    }
                } else {
                    this.redraw(0, 0, core.width, core.height);
                }
            }
            this._previousOffsetX = this._offsetX;
            this._previousOffsetY = this._offsetY;
        });
    },
    /**
     * Setzt die Kartendaten.
     * Setzt die Kartendaten, wobei die Daten (ein 2-Dimensionales Array bei dem die Indizes bei 0 beginnen) 
     * auf das Bild, beginned bei der linken oberen Ecke) projeziert werden.
     * Sollte mehr als ein Array übergeben worden sein, werden die Karten in invertierter Reihenfolge dargestellt. 
     * @param {...Array<Array.<Number>>} data 2-Dimensionales Array mit Kachel Indizes. Mehrfachangaben möglich.
     */
    loadData: function(data) {
        this._data = Array.prototype.slice.apply(arguments);
        this._dirty = true;

        this._tight = false;
        for (var i = 0, len = this._data.length; i < len; i++) {
            var c = 0;
            data = this._data[i];
            for (var y = 0, l = data.length; y < l; y++) {
                for (var x = 0, ll = data[y].length; x < ll; x++) {
                    if (data[y][x] >= 0) {
                        c++;
                    }
                }
            }
            if (c / (data.length * data[0].length) > 0.2) {
                this._tight = true;
                break;
            }
        }
    },
    /**
     * Überprüft welche Kachel an der gegeben Position vorhanden ist.
     * @param {Number} x Die x Koordinataten des Punktes auf der Karte.
     * @param {Number} y Die y Koordinataten des Punktes auf der Karte.
     * @return {*} Die Kachel für die angegebene Position.
     */
    checkTile: function(x, y) {
        if (x < 0 || this.width <= x || y < 0 || this.height <= y) {
            return false;
        }
        var width = this._image.width;
        var height = this._image.height;
        var tileWidth = this._tileWidth || width;
        var tileHeight = this._tileHeight || height;
        x = x / tileWidth | 0;
        y = y / tileHeight | 0;
        //		return this._data[y][x];
        var data = this._data[0];
        return data[y][x];
    },
    /**
     * Überprüft ob auf der Karte Hindernisse vorhanden sind.
     * @param {Number} x Die x Koordinataten des Punktes auf der Karte, der überprüft werden soll.
     * @param {Number} y Die y Koordinataten des Punktes auf der Karte, der überprüft werden soll.
     * @return {Boolean} True, falls Hindernisse vorhanden sind.
     */
    hitTest: function(x, y) {
        if (x < 0 || this.width <= x || y < 0 || this.height <= y) {
            return false;
        }
        var width = this._image.width;
        var height = this._image.height;
        var tileWidth = this._tileWidth || width;
        var tileHeight = this._tileHeight || height;
        x = x / tileWidth | 0;
        y = y / tileHeight | 0;
        if (this.collisionData != null) {
            return this.collisionData[y] && !!this.collisionData[y][x];
        } else {
            for (var i = 0, len = this._data.length; i < len; i++) {
                var data = this._data[i];
                var n;
                if (data[y] != null && (n = data[y][x]) != null &&
                    0 <= n && n < (width / tileWidth | 0) * (height / tileHeight | 0)) {
                    return true;
                }
            }
            return false;
        }
    },
    /**
     * Das Bild mit dem die Kacheln auf der Karte dargestellt werden.
     * @type {enchant.Surface}
     */
    image: {
        get: function() {
            return this._image;
        },
        set: function(image) {
            var core = enchant.Core.instance;

            this._image = image;
            if (enchant.ENV.RETINA_DISPLAY && core.scale === 2) {
                var img = new enchant.Surface(image.width * 2, image.height * 2);
                var tileWidth = this._tileWidth || image.width;
                var tileHeight = this._tileHeight || image.height;
                var row = image.width / tileWidth | 0;
                var col = image.height / tileHeight | 0;
                for (var y = 0; y < col; y++) {
                    for (var x = 0; x < row; x++) {
                        img.draw(image, x * tileWidth, y * tileHeight, tileWidth, tileHeight,
                            x * tileWidth * 2, y * tileHeight * 2, tileWidth * 2, tileHeight * 2);
                    }
                }
                this._doubledImage = img;
            }
            this._dirty = true;
        }
    },
    /**
     * Kachelbreite
     * @type {Number}
     */
    tileWidth: {
        get: function() {
            return this._tileWidth;
        },
        set: function(tileWidth) {
            this._tileWidth = tileWidth;
            this._dirty = true;
        }
    },
    /**
     * Kachelhöhe.
     * @type {Number}
     */
    tileHeight: {
        get: function() {
            return this._tileHeight;
        },
        set: function(tileHeight) {
            this._tileHeight = tileHeight;
            this._dirty = true;
        }
    },
    /**
     * @private
     */
    width: {
        get: function() {
            return this._tileWidth * this._data[0][0].length;
        }
    },
    /**
     * @private
     */
    height: {
        get: function() {
            return this._tileHeight * this._data[0].length;
        }
    },
    /**
     * @private
     */
    redraw: function(x, y, width, height) {
        if (this._image == null) {
            return;
        }

        var image, tileWidth, tileHeight, dx, dy;
        if (this._doubledImage) {
            image = this._doubledImage;
            tileWidth = this._tileWidth * 2;
            tileHeight = this._tileHeight * 2;
            dx = -this._offsetX * 2;
            dy = -this._offsetY * 2;
            x *= 2;
            y *= 2;
            width *= 2;
            height *= 2;
        } else {
            image = this._image;
            tileWidth = this._tileWidth;
            tileHeight = this._tileHeight;
            dx = -this._offsetX;
            dy = -this._offsetY;
        }
        var row = image.width / tileWidth | 0;
        var col = image.height / tileHeight | 0;
        var left = Math.max((x + dx) / tileWidth | 0, 0);
        var top = Math.max((y + dy) / tileHeight | 0, 0);
        var right = Math.ceil((x + dx + width) / tileWidth);
        var bottom = Math.ceil((y + dy + height) / tileHeight);

        var source = image._element;
        var context = this._context;
        var canvas = context.canvas;
        context.clearRect(x, y, width, height);
        for (var i = 0, len = this._data.length; i < len; i++) {
            var data = this._data[i];
            var r = Math.min(right, data[0].length);
            var b = Math.min(bottom, data.length);
            for (y = top; y < b; y++) {
                for (x = left; x < r; x++) {
                    var n = data[y][x];
                    if (0 <= n && n < row * col) {
                        var sx = (n % row) * tileWidth;
                        var sy = (n / row | 0) * tileHeight;
                        context.drawImage(source, sx, sy, tileWidth, tileHeight,
                            x * tileWidth - dx, y * tileHeight - dy, tileWidth, tileHeight);
                    }
                }
            }
        }
    },
    cvsRender: function(ctx) {
        var core = enchant.Core.instance;
        if (this.width !== 0 && this.height !== 0) {
            ctx.save();
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            var cvs = this._context.canvas;
                ctx.drawImage(cvs, 0, 0, core.width, core.height);
            ctx.restore();
        }
    },
    domRender: function(element) {
        if (this._image) {
            this._style['background-image'] = this._surface._css;
            // bad performance
            this._style[enchant.ENV.VENDOR_PREFIX + 'Transform'] = 'matrix(1, 0, 0, 1, 0, 0)';
        }
    }
});


/**
 * @scope enchant.Group.prototype
 */
enchant.Group = enchant.Class.create(enchant.Node, {
    /**
     * @name enchant.Group
     * @class
     * Eine Klasse die mehrere {@link enchant.Node} beinhalten kann.
     *
     * @example
     *   var stage = new Group();
     *   stage.addChild(player);
     *   stage.addChild(enemy);
     *   stage.addChild(map);
     *   stage.addEventListener('enterframe', function() {
     *      // Bewegt den gesamten Frame je nach der aktuelle Spielerposition.
     *      if (this.x > 64 - player.x) {
     *          this.x = 64 - player.x;
     *      }
     *   });
     *
     * @constructs
     * @extends enchant.Node
     */
    initialize: function() {
        /**
         * Kind-Nodes.
         * @type {Array.<enchant.Node>}
         */
        this.childNodes = [];

        enchant.Node.call(this);

        this._rotation = 0;
        this._scaleX = 1;
        this._scaleY = 1;

        this._originX = null;
        this._originY = null;

        this.__dirty = false;

        [enchant.Event.ADDED_TO_SCENE, enchant.Event.REMOVED_FROM_SCENE]
            .forEach(function(event) {
                this.addEventListener(event, function(e) {
                    this.childNodes.forEach(function(child) {
                        child.scene = this.scene;
                        child.dispatchEvent(e);
                    }, this);
                });
            }, this);
    },
    /**
     * Fügt einen Node zu der Gruppe hinzu.
     * @param {enchant.Node} node Node der hinzugeügt werden soll.
     */
    addChild: function(node) {
        this.childNodes.push(node);
        node.parentNode = this;
        var childAdded = new enchant.Event('childadded');
        childAdded.node = node;
        childAdded.next = null;
        this.dispatchEvent(childAdded);
        node.dispatchEvent(new enchant.Event('added'));
        if (this.scene) {
            node.scene = this.scene;
            var addedToScene = new enchant.Event('addedtoscene');
            node.dispatchEvent(addedToScene);
        }
    },
    /**
     * Fügt einen Node vor einen anderen Node zu dieser Gruppe hinzu.
     * @param {enchant.Node} node Der Node der hinzugefügt werden soll.
     * @param {enchant.Node} reference Der Node der sich vor dem einzufügendem Node befindet.
     */
    insertBefore: function(node, reference) {
        var i = this.childNodes.indexOf(reference);
        if (i !== -1) {
            this.childNodes.splice(i, 0, node);
            node.parentNode = this;
            var childAdded = new enchant.Event('childadded');
            childAdded.node = node;
            childAdded.next = reference;
            this.dispatchEvent(childAdded);
            node.dispatchEvent(new enchant.Event('added'));
            if (this.scene) {
                node.scene = this.scene;
                var addedToScene = new enchant.Event('addedtoscene');
                node.dispatchEvent(addedToScene);
            }
        } else {
            this.addChild(node);
        }
    },
    /**
     * Entfernt einen Node aus der Gruppe.
     * @param {enchant.Node} node Der Node der entfernt werden soll.
     */
    removeChild: function(node) {
        var i;
        if ((i = this.childNodes.indexOf(node)) !== -1) {
            this.childNodes.splice(i, 1);
            node.parentNode = null;
            var childRemoved = new enchant.Event('childremoved');
            childRemoved.node = node;
            this.dispatchEvent(childRemoved);
            node.dispatchEvent(new enchant.Event('removed'));
            if (this.scene) {
                node.scene = null;
                var removedFromScene = new enchant.Event('removedfromscene');
                node.dispatchEvent(removedFromScene);
            }
        }
    },
    /**
     * Der Node, welcher das erste Kind der Gruppe darstellt.
     * @type {enchant.Node}
     */
    firstChild: {
        get: function() {
            return this.childNodes[0];
        }
    },
    /**
     * Der Node, welcher das letzte Kind der Gruppe darstellt.
     * @type {enchant.Node}
     */
    lastChild: {
        get: function() {
            return this.childNodes[this.childNodes.length - 1];
        }
    },
    /**
    * Rotationswinkel der Gruppe (Grad).
    * @type {Number}
    */
    rotation: {
        get: function() {
            return this._rotation;
        },
        set: function(rotation) {
            this._rotation = rotation;
            this._dirty = true;
        }
    },
    /**
    * Skalierungsfaktor auf der x-Achse der Gruppe.
    * @type {Number}
    * @see enchant.CanvasGroup.originX
    * @see enchant.CanvasGroup.originY
    */
    scaleX: {
        get: function() {
            return this._scaleX;
        },
        set: function(scale) {
            this._scaleX = scale;
            this._dirty = true;
        }
    },
    /**
    * Skalierungsfaktor auf der y-Achse der Gruppe.
    * @type {Number}
    * @see enchant.CanvasGroup.originX
    * @see enchant.CanvasGroup.originY
    */
    scaleY: {
        get: function() {
            return this._scaleY;
        },
        set: function(scale) {
            this._scaleY = scale;
            this._dirty = true;
        }
    },
    /**
    * Ausgangspunkt für Rotation und Skalierung.
    * @type {Number}
    */
    originX: {
        get: function() {
            return this._originX;
        },
        set: function(originX) {
            this._originX = originX;
            this._dirty = true;
        }
    },
    /**
    * Ausgangspunkt für Rotation und Skalierung.
    * @type {Number}
    */
    originY: {
        get: function() {
            return this._originY;
        },
        set: function(originY) {
            this._originY = originY;
            this._dirty = true;
        }
    },
    _dirty: {
        get: function() {
            return this.__dirty;
        },
        set: function(dirty) {
            dirty = !!dirty;
            this.__dirty = dirty;
            if (dirty) {
                for (var i = 0, l = this.childNodes.length; i < l; i++) {
                    this.childNodes[i]._dirty = true;
                }
            }
        }
    }
});

enchant.Matrix = enchant.Class.create({
    initialize: function() {
        if (enchant.Matrix.instance) {
            return enchant.Matrix.instance;
        }
        this.reset();
    },
    reset: function() {
        this.stack = [];
        this.stack.push([ 1, 0, 0, 1, 0, 0 ]);
    },
    makeTransformMatrix: function(node, dest) {
        var x = node._x;
        var y = node._y;
        var width = node.width || 0;
        var height = node.height || 0;
        var rotation = node._rotation || 0;
        var scaleX = (typeof node._scaleX === 'number') ? node._scaleX : 1;
        var scaleY = (typeof node._scaleY === 'number') ? node._scaleY : 1;
        var theta = rotation * Math.PI / 180;
        var tmpcos = Math.cos(theta);
        var tmpsin = Math.sin(theta);
        var w = (typeof node._originX === 'number') ? node._originX : width / 2;
        var h = (typeof node._originY === 'number') ? node._originY : height / 2;
        var a = scaleX * tmpcos;
        var b = scaleX * tmpsin;
        var c = scaleY * tmpsin;
        var d = scaleY * tmpcos;
        dest[0] = a;
        dest[1] = b;
        dest[2] = -c;
        dest[3] = d;
        dest[4] = (-a * w + c * h + x + w);
        dest[5] = (-b * w - d * h + y + h);
    },
    multiply: function(m1, m2, dest) {
        var a11 = m1[0], a21 = m1[2], adx = m1[4],
            a12 = m1[1], a22 = m1[3], ady = m1[5];
        var b11 = m2[0], b21 = m2[2], bdx = m2[4],
            b12 = m2[1], b22 = m2[3], bdy = m2[5];

        dest[0] = a11 * b11 + a21 * b12;
        dest[1] = a12 * b11 + a22 * b12;
        dest[2] = a11 * b21 + a21 * b22;
        dest[3] = a12 * b21 + a22 * b22;
        dest[4] = a11 * bdx + a21 * bdy + adx;
        dest[5] = a12 * bdx + a22 * bdy + ady;
    },
    multiplyVec: function(mat, vec, dest) {
        var x = vec[0], y = vec[1];
        var m11 = mat[0], m21 = mat[2], mdx = mat[4],
            m12 = mat[1], m22 = mat[3], mdy = mat[5];
        dest[0] = m11 * x + m21 * y + mdx;
        dest[1] = m12 * x + m22 * y + mdy;
    }
});
enchant.Matrix.instance = new enchant.Matrix();

enchant.DetectColorManager = enchant.Class.create({
    initialize: function(reso, max) {
        this.reference = [];
        this.colorResolution = reso || 16;
        this.max = max || 1;
        this.capacity = Math.pow(this.colorResolution, 3);
        for (var i = 1, l = this.capacity; i < l; i++) {
            this.reference[i] = null;
        }
    },
    attachDetectColor: function(sprite) {
        var i = this.reference.indexOf(null);
        if (i === -1) {
            i = 1;
        }
        this.reference[i] = sprite;
        return this._getColor(i);
    },
    detachDetectColor: function(sprite) {
        var i = this.reference.indexOf(sprite);
        if (i !== -1) {
            this.reference[i] = null;
        }
    },
    _getColor: function(n) {
        var C = this.colorResolution;
        var d = C / this.max;
        return [
            parseInt((n / C / C) % C, 10) / d,
            parseInt((n / C) % C, 10) / d,
            parseInt(n % C, 10) / d,
            1.0
        ];
    },
    _decodeDetectColor: function(color) {
        var C = this.colorResolution;
        return ~~(color[0] * C * C * C / 256) +
            ~~(color[1] * C * C / 256) +
            ~~(color[2] * C / 256);
    },
    getSpriteByColor: function(color) {
        return this.reference[this._decodeDetectColor(color)];
    }
});

enchant.DomManager = enchant.Class.create({
    initialize: function(node, elementDefinition) {
        var core = enchant.Core.instance;
        this.layer = null;
        this.targetNode = node;
        if (typeof elementDefinition === 'string') {
            this.element = document.createElement(elementDefinition);
        } else if (elementDefinition instanceof HTMLElement) {
            this.element = elementDefinition;
        }
        this.style = this.element.style;
        this.style.position = 'absolute';
        this.style[enchant.ENV.VENDOR_PREFIX + 'TransformOrigin'] = '0px 0px';
        if (core._debug) {
            this.style.border = '1px solid blue';
            this.style.margin = '-1px';
        }

        var manager = this;
        this._setDomTarget = function() {
            manager.layer._touchEventTarget = manager.targetNode;
        };
        this._attachEvent();
    },
    getDomElement: function() {
        return this.element;
    },
    getDomElementAsNext: function() {
        return this.element;
    },
    getNextManager: function(manager) {
        var i = this.targetNode.parentNode.childNodes.indexOf(manager.targetNode);
        if (i !== this.targetNode.parentNode.childNodes.length - 1) {
            return this.targetNode.parentNode.childNodes[i + 1]._domManager;
        } else {
            return null;
        }
    },
    addManager: function(childManager, nextManager) {
        var nextElement;
        if (nextManager) {
            nextElement = nextManager.getDomElementAsNext();
        }
        var element = childManager.getDomElement();
        if (element instanceof Array) {
            element.forEach(function(child) {
                this.element.insertBefore(child, nextElement);
            }, this);
        } else {
            this.element.insertBefore(element, nextElement);
        }
        this.setLayer(this.layer);
    },
    removeManager: function(childManager) {
        if (childManager instanceof enchant.DomlessManager) {
            childManager._domRef.forEach(function(element) {
                this.element.removeChild(element);
            }, this);
        } else {
            this.element.removeChild(childManager.element);
        }
        this.setLayer(this.layer);
    },
    setLayer: function(layer) {
        this.layer = layer;
        var node = this.targetNode;
        var manager;
        if (node.childNodes) {
            for (var i = 0, l = node.childNodes.length; i < l; i++) {
                manager = node.childNodes[i]._domManager;
                if (manager) {
                    manager.setLayer(layer);
                }
            }
        }
    },
    render: function(inheritMat) {
        var node = this.targetNode;
        var matrix = enchant.Matrix.instance;
        var stack = matrix.stack;
        var dest = [];
        matrix.makeTransformMatrix(node, dest);
        matrix.multiply(stack[stack.length - 1], dest, dest);
        matrix.multiply(inheritMat, dest, inheritMat);
        node._matrix = inheritMat;
        var ox = (typeof node._originX === 'number') ? node._originX : node.width / 2 || 0;
        var oy = (typeof node._originY === 'number') ? node._originY : node.height / 2 || 0;
        var vec = [ ox, oy ];
        matrix.multiplyVec(dest, vec, vec);

        node._offsetX = vec[0] - ox;
        node._offsetY = vec[1] - oy;
        if(node.parentNode && !(node.parentNode instanceof enchant.Group)) {
            node._offsetX += node.parentNode._offsetX;
            node._offsetY += node.parentNode._offsetY;
        }
        this.style[enchant.ENV.VENDOR_PREFIX + 'Transform'] = 'matrix(' +
        dest[0].toFixed(10) + ',' +
        dest[1].toFixed(10) + ',' +
        dest[2].toFixed(10) + ',' +
        dest[3].toFixed(10) + ',' +
        dest[4].toFixed(10) + ',' +
        dest[5].toFixed(10) +
        ')';
        this.domRender();
    },
    domRender: function() {
        var node = this.targetNode;
        if(!node._style) {
            node._style = {};
        }
        if(!node.__styleStatus) {
            node.__styleStatus = {};
        }
        node._style.width = node.width + 'px';
        node._style.height = node.height + 'px';
        node._style.opacity = node._opacity;
        node._style['background-color'] = node._backgroundColor;
        if (typeof node._visible !== 'undefined') {
            node._style.display = node._visible ? 'block' : 'none';
        }
        if (typeof node.domRender === 'function') {
            node.domRender(this.element);
        }
        for (var prop in node._style) {
            if(node.__styleStatus[prop] !== node._style[prop]) {
                this.style.setProperty(prop, node._style[prop]);
                node.__styleStatus[prop] = node._style[prop];
            }
        }
    },
    _attachEvent: function() {
        if (enchant.ENV.TOUCH_ENABLED) {
            this.element.addEventListener('touchstart', this._setDomTarget, true);
        }
        this.element.addEventListener('mousedown', this._setDomTarget, true);
    },
    _detachEvent: function() {
        if (enchant.ENV.TOUCH_ENABLED) {
            this.element.removeEventListener('touchstart', this._setDomTarget, true);
        }
        this.element.removeEventListener('mousedown', this._setDomTarget, true);
    },
    remove: function() {
        this._detachEvent();
        this.element = this.style = this.targetNode = null;
    }
});

enchant.DomlessManager = enchant.Class.create({
    initialize: function(node) {
        this._domRef = [];
        this.targetNode = node;
    },
    _register: function(element, nextElement) {
        var i = this._domRef.indexOf(nextElement);
        var childNodes;
        if (element instanceof Array) {
            if (i === -1) {
                Array.prototype.push.apply(this._domRef, element);
            } else {
                Array.prototype.splice.apply(this._domRef, [i, 0].concat(element));
            }
        } else {
            if (i === -1) {
                this._domRef.push(element);
            } else {
                this._domRef.splice(i, 0, element);
            }
        }
    },
    getNextManager: function(manager) {
        var i = this.targetNode.parentNode.childNodes.indexOf(manager.targetNode);
        if (i !== this.targetNode.parentNode.childNodes.length - 1) {
            return this.targetNode.parentNode.childNodes[i + 1]._domManager;
        } else {
            return null;
        }
    },
    getDomElement: function() {
        var ret = [];
        this.targetNode.childNodes.forEach(function(child) {
            ret = ret.concat(child._domManager.getDomElement());
        });
        return ret;
    },
    getDomElementAsNext: function() {
        if (this._domRef.length) {
            return this._domRef[0];
        } else {
            var nextManager = this.getNextManager(this);
            if (nextManager) {
                return nextManager.element;
            } else {
                return null;
            }
        }
    },
    addManager: function(childManager, nextManager) {
        var parentNode = this.targetNode.parentNode;
        if (parentNode) {
            if (nextManager === null) {
                nextManager = this.getNextManager(this);
            }
            if (parentNode instanceof enchant.Scene) {
                parentNode._layers.Dom._domManager.addManager(childManager, nextManager);
            } else {
                parentNode._domManager.addManager(childManager, nextManager);
            }
        }
        var nextElement = nextManager ? nextManager.getDomElementAsNext() : null;
        this._register(childManager.getDomElement(), nextElement);
        this.setLayer(this.layer);
    },
    removeManager: function(childManager) {
        var dom;
        var i = this._domRef.indexOf(childManager.element);
        if (i !== -1) {
            dom = this._domRef[i];
            dom.parentNode.removeChild(dom);
            this._domRef.splice(i, 1);
        }
        this.setLayer(this.layer);
    },
    setLayer: function(layer) {
        this.layer = layer;
        var node = this.targetNode;
        var manager;
        if (node.childNodes) {
            for (var i = 0, l = node.childNodes.length; i < l; i++) {
                manager = node.childNodes[i]._domManager;
                if (manager) {
                    manager.setLayer(layer);
                }
            }
        }
    },
    render: function(inheritMat) {
        var matrix = enchant.Matrix.instance;
        var stack = matrix.stack;
        var node = this.targetNode;
        var dest = [];
        matrix.makeTransformMatrix(node, dest);
        matrix.multiply(stack[stack.length - 1], dest, dest);
        matrix.multiply(inheritMat, dest, inheritMat);
        node._matrix = inheritMat;
        var ox = (typeof node._originX === 'number') ? node._originX : node.width / 2 || 0;
        var oy = (typeof node._originY === 'number') ? node._originY : node.height / 2 || 0;
        var vec = [ ox, oy ];
        matrix.multiplyVec(dest, vec, vec);
        node._offsetX = vec[0] - ox;
        node._offsetY = vec[1] - oy;
        stack.push(dest);
    },
    remove: function() {
        this._domRef = [];
        this.targetNode = null;
    }
});

enchant.DomLayer = enchant.Class.create(enchant.Group, {
    initialize: function() {
        var core = enchant.Core.instance;
        enchant.Group.call(this);

        this.width = this._width = core.width;
        this.height = this._height = core.height;

        this._touchEventTarget = null;

        this._element = document.createElement('div');
        this._element.style.width = this.width + 'px';
        this._element.style.height = this.height + 'px';
        this._element.style.position = 'absolute';

        this._domManager = new enchant.DomManager(this, this._element);
        this._domManager.layer = this;

        var touch = [
            enchant.Event.TOUCH_START,
            enchant.Event.TOUCH_MOVE,
            enchant.Event.TOUCH_END
        ];

        touch.forEach(function(type) {
            this.addEventListener(type, function(e) {
                if (this._scene) {
                    this._scene.dispatchEvent(e);
                }
            });
        }, this);

        var __onchildadded = function(e) {
            var child = e.node;
            var next = e.next;
            var self = e.target;
            var nextManager = next ? next._domManager : null;
            enchant.DomLayer._attachDomManager(child, __onchildadded, __onchildremoved);
            self._domManager.addManager(child._domManager, nextManager);
            var render = new enchant.Event(enchant.Event.RENDER);
            child._dirty = true;
            self._domManager.layer._rendering(child, render);
        };

        var __onchildremoved = function(e) {
            var child = e.node;
            var self = e.target;
            self._domManager.removeManager(child._domManager);
            enchant.DomLayer._detachDomManager(child, __onchildadded, __onchildremoved);
        };

        this.addEventListener('childremoved', __onchildremoved);
        this.addEventListener('childadded', __onchildadded);

    },
    _startRendering: function() {
        this.addEventListener('exitframe', this._onexitframe);
        this._onexitframe();
    },
    _stopRendering: function() {
        this.removeEventListener('exitframe', this._onexitframe);
        this._onexitframe();
    },
    _onexitframe: function() {
        this._rendering(this, new enchant.Event(enchant.Event.RENDER));
    },
    _rendering: function(node, e, inheritMat) {
        var child;
        if (!inheritMat) {
            inheritMat = [ 1, 0, 0, 1, 0, 0 ];
        }
        node.dispatchEvent(e);
        node._domManager.render(inheritMat);
        if (node.childNodes) {
            for (var i = 0, l = node.childNodes.length; i < l; i++) {
                child = node.childNodes[i];
                this._rendering(child, e, inheritMat.slice());
            }
        }
        if (node._domManager instanceof enchant.DomlessManager) {
            enchant.Matrix.instance.stack.pop();
        }
        node._dirty = false;
    },
    _determineEventTarget: function() {
        if (this._touchEventTarget) {
            if (this._touchEventTarget !== this) {
                return this._touchEventTarget;
            }
        }
        return null;
    }
});

enchant.DomLayer._attachDomManager = function(node, onchildadded, onchildremoved) {
    var child;
    if (!node._domManager) {
        node.addEventListener('childadded', onchildadded);
        node.addEventListener('childremoved', onchildremoved);
        if (node instanceof enchant.Group) {
            node._domManager = new enchant.DomlessManager(node);
        } else {
            if (node._element) {
                node._domManager = new enchant.DomManager(node, node._element);
            } else {
                node._domManager = new enchant.DomManager(node, 'div');
            }
        }
    }
    if (node.childNodes) {
        for (var i = 0, l = node.childNodes.length; i < l; i++) {
            child = node.childNodes[i];
            enchant.DomLayer._attachDomManager(child, onchildadded, onchildremoved);
            node._domManager.addManager(child._domManager, null);
        }
    }
};

enchant.DomLayer._detachDomManager = function(node, onchildadded, onchildremoved) {
    var child;
    node.removeEventListener('childadded', onchildadded);
    node.removeEventListener('childremoved', onchildremoved);
    if (node.childNodes) {
        for (var i = 0, l = node.childNodes.length; i < l; i++) {
            child = node.childNodes[i];
            node._domManager.removeManager(child._domManager, null);
            enchant.DomLayer._detachDomManager(child, onchildadded, onchildremoved);
        }
    }
    node._domManager.remove();
    delete node._domManager;
};

/**
 * @scope enchant.CanvasLayer.prototype
 */
enchant.CanvasLayer = enchant.Class.create(enchant.Group, {
    /**
     * @name enchant.CanvasLayer
     * @class
     * Eine Klasse die HTML Canvas für das Rendern nutzt.
     * Das Rendern der Kinder wird durch das Canvas Rendering ersetzt.
     * @constructs
     */
    initialize: function() {
        var core = enchant.Core.instance;

        enchant.Group.call(this);

        this._cvsCache = {
            matrix: [1, 0, 0, 1, 0, 0],
            detectColor: '#000000'
        };
        this._cvsCache.layer = this;

        this.width = core.width;
        this.height = core.height;

        this._element = document.createElement('canvas');
        this._element.width = core.width;
        this._element.height = core.height;
        this._element.style.position = 'absolute';

        this._detect = document.createElement('canvas');
        this._detect.width = core.width;
        this._detect.height = core.height;
        this._detect.style.position = 'absolute';
        this._lastDetected = 0;

        this.context = this._element.getContext('2d');
        this._dctx = this._detect.getContext('2d');

        this._colorManager = new enchant.DetectColorManager(16, 256);

        var touch = [
            enchant.Event.TOUCH_START,
            enchant.Event.TOUCH_MOVE,
            enchant.Event.TOUCH_END
        ];

        touch.forEach(function(type) {
            this.addEventListener(type, function(e) {
                if (this._scene) {
                    this._scene.dispatchEvent(e);
                }
            });
        }, this);

        var __onchildadded = function(e) {
            var child = e.node;
            var self = e.target;
            var layer;
            if (self instanceof enchant.CanvasLayer) {
                layer = self._scene._layers.Canvas;
            } else {
                layer = self.scene._layers.Canvas;
            }
            enchant.CanvasLayer._attachCache(child, layer, __onchildadded, __onchildremoved);
            var render = new enchant.Event(enchant.Event.RENDER);
            if (self._dirty) {
                self._updateCoordinate();
            }
            child._dirty = true;
            enchant.Matrix.instance.stack.push(self._matrix);
            layer._rendering(child, render);
            enchant.Matrix.instance.stack.pop(self._matrix);
        };

        var __onchildremoved = function(e) {
            var child = e.node;
            var self = e.target;
            var layer;
            if (self instanceof enchant.CanvasLayer) {
                layer = self._scene._layers.Canvas;
            } else {
                layer = self.scene._layers.Canvas;
            }
            enchant.CanvasLayer._detachCache(child, layer, __onchildadded, __onchildremoved);
        };

        this.addEventListener('childremoved', __onchildremoved);
        this.addEventListener('childadded', __onchildadded);

    },
    /**
     * @private
     */
    _startRendering: function() {
        this.addEventListener('exitframe', this._onexitframe);
        this._onexitframe(new enchant.Event(enchant.Event.RENDER));
    },
    /**
     * @private
     */
    _stopRendering: function() {
        this.removeEventListener('render', this._onexitframe);
        this._onexitframe(new enchant.Event(enchant.Event.RENDER));
    },
    _onexitframe: function() {
        var core = enchant.Core.instance;
        var ctx = this.context;
        ctx.clearRect(0, 0, core.width, core.height);
        var render = new enchant.Event(enchant.Event.RENDER);
        this._rendering(this, render);
    },
    _rendering:  function(node, e) {
        var core = enchant.Core.instance;
        var matrix = enchant.Matrix.instance;
        var stack = matrix.stack;
        var width = node.width;
        var height = node.height;
        var ctx = this.context;
        var child;
        ctx.save();
        node.dispatchEvent(e);
        // composite
        if (node.compositeOperation) {
            ctx.globalCompositeOperation = node.compositeOperation;
        } else {
            ctx.globalCompositeOperation = 'source-over';
        }
        ctx.globalAlpha = (typeof node._opacity === 'number') ? node._opacity : 1.0;
        // transform
        this._transform(node, ctx);
        // render
        if (typeof node._visible === 'undefined' || node._visible) {
            if (node._backgroundColor) {
                ctx.fillStyle = node._backgroundColor;
                ctx.fillRect(0, 0, width, height);
            }

            if (node.cvsRender) {
                node.cvsRender(ctx);
            }

            if (core._debug) {
                if (node instanceof enchant.Label || node instanceof enchant.Sprite) {
                    ctx.strokeStyle = '#ff0000';
                } else {
                    ctx.strokeStyle = '#0000ff';
                }
                ctx.strokeRect(0, 0, width, height);
            }
            if (node._clipping) {
                ctx.rect(0, 0, width, height);
                ctx.clip();
            }
        }
        if (node.childNodes) {
            for (var i = 0, l = node.childNodes.length; i < l; i++) {
                child = node.childNodes[i];
                this._rendering(child, e);
            }
        }
        ctx.restore();
        enchant.Matrix.instance.stack.pop();
    },
    _detectrendering: function(node) {
        var width = node.width;
        var height = node.height;
        var ctx = this._dctx;
        var child;
        ctx.save();
        this._transform(node, ctx);
        ctx.fillStyle = node._cvsCache.detectColor;
        if (node._touchEnabled) {
            if (node.detectRender) {
                node.detectRender(ctx);
            } else {
                ctx.fillRect(0, 0, width, height);
            }
        }
        if (node._clipping) {
            ctx.rect(0, 0, width, height);
            ctx.clip();
        }
        if (node.childNodes) {
            for (var i = 0, l = node.childNodes.length; i < l; i++) {
                child = node.childNodes[i];
                this._detectrendering(child);
            }
        }
        ctx.restore();
        enchant.Matrix.instance.stack.pop();
    },
    _transform: function(node, ctx) {
        var matrix = enchant.Matrix.instance;
        var stack = matrix.stack;
        var newmat;
        if (node._dirty) {
            matrix.makeTransformMatrix(node, node._cvsCache.matrix);
            newmat = [];
            matrix.multiply(stack[stack.length - 1], node._cvsCache.matrix, newmat);
            node._matrix = newmat;
        } else {
            newmat = node._matrix;
        }
        stack.push(newmat);
        ctx.setTransform.apply(ctx, newmat);
        var ox = (typeof node._originX === 'number') ? node._originX : node._width / 2 || 0;
        var oy = (typeof node._originY === 'number') ? node._originY : node._height / 2 || 0;
        var vec = [ ox, oy ];
        matrix.multiplyVec(newmat, vec, vec);
        node._offsetX = vec[0] - ox;
        node._offsetY = vec[1] - oy;
        node._dirty = false;

    },
    _determineEventTarget: function(e) {
        return this._getEntityByPosition(e.x, e.y);
    },
    _getEntityByPosition: function(x, y) {
        var core = enchant.Core.instance;
        var ctx = this._dctx;
        if (this._lastDetected < core.frame) {
            ctx.clearRect(0, 0, this.width, this.height);
            this._detectrendering(this);
            this._lastDetected = core.frame;
        }
        var color = ctx.getImageData(x, y, 1, 1).data;
        return this._colorManager.getSpriteByColor(color);
    }
});

enchant.CanvasLayer._attachCache = function(node, layer, onchildadded, onchildremoved) {
    var child;
    if (!node._cvsCache) {
        node._cvsCache = {};
        node._cvsCache.matrix = [ 1, 0, 0, 1, 0, 0 ];
        node._cvsCache.detectColor = 'rgba(' + layer._colorManager.attachDetectColor(node) + ')';
        node.addEventListener('childadded', onchildadded);
        node.addEventListener('childremoved', onchildremoved);
    }
    if (node.childNodes) {
        for (var i = 0, l = node.childNodes.length; i < l; i++) {
            child = node.childNodes[i];
            enchant.CanvasLayer._attachCache(child, layer, onchildadded, onchildremoved);
        }
    }
};

enchant.CanvasLayer._detachCache = function(node, layer, onchildadded, onchildremoved) {
    var child;
    if (node._cvsCache) {
        layer._colorManager.detachDetectColor(node);
        node.removeEventListener('childadded', onchildadded);
        node.removeEventListener('childremoved', onchildremoved);
        delete node._cvsCache;
    }
    if (node.childNodes) {
        for (var i = 0, l = node.childNodes.length; i < l; i++) {
            child = node.childNodes[i];
            enchant.CanvasLayer._detachCache(child, layer, onchildadded, onchildremoved);
        }
    }
};

/**
 * @scope enchant.Scene.prototype
 * @type {*}
 */
enchant.Scene = enchant.Class.create(enchant.Group, {
    /**
     * @name enchant.Scene
     * @class
     * Eine Klasse die zur Wurzel im Darstellungsobjektbaum wird.
     *
     * @example
     *   var scene = new Scene();
     *   scene.addChild(player);
     *   scene.addChild(enemy);
     *   core.pushScene(scene);
     *
     * @constructs
     * @extends enchant.Group
     */
    initialize: function() {
        var core = enchant.Core.instance;

        // Call initialize method of enchant.Group
        enchant.Group.call(this);

        this.width = core.width;
        this.height = core.height;

        // All nodes (entities, groups, scenes) have reference to the scene that it belongs to.
        this.scene = this;

        this._backgroundColor = null;

        // Create div tag which possesses its layers
        this._element = document.createElement('div');
        this._element.style.width = this.width + 'px';
        this._element.style.height = this.height + 'px';
        this._element.style.position = 'absolute';
        this._element.style.overflow = 'hidden';
        this._element.style[enchant.ENV.VENDOR_PREFIX + 'TransformOrigin'] = '0 0';
        this._element.style[enchant.ENV.VENDOR_PREFIX + 'Transform'] = 'scale(' + enchant.Core.instance.scale + ')';

        this._layers = {};
        this._layerPriority = [];

        this.addEventListener(enchant.Event.CHILD_ADDED, this._onchildadded);
        this.addEventListener(enchant.Event.CHILD_REMOVED, this._onchildremoved);
        this.addEventListener(enchant.Event.ENTER, this._onenter);
        this.addEventListener(enchant.Event.EXIT, this._onexit);

        var that = this;
        this._dispatchExitframe = function() {
            var layer;
            for (var prop in that._layers) {
                layer = that._layers[prop];
                layer.dispatchEvent(new enchant.Event(enchant.Event.EXIT_FRAME));
            }
        };
    },
    x: {
        get: function() {
            return this._x;
        },
        set: function(x) {
            this._x = x;
            for (var type in this._layers) {
                this._layers[type].x = x;
            }
        }
    },
    y: {
        get: function() {
            return this._y;
        },
        set: function(y) {
            this._y = y;
            for (var type in this._layers) {
                this._layers[type].y = y;
            }
        }
    },
    rotation: {
        get: function() {
            return this._rotation;
        },
        set: function(rotation) {
            this._rotation = rotation;
            for (var type in this._layers) {
                this._layers[type].rotation = rotation;
            }
        }
    },
    scaleX: {
        get: function() {
            return this._scaleX;
        },
        set: function(scaleX) {
            this._scaleX = scaleX;
            for (var type in this._layers) {
                this._layers[type].scaleX = scaleX;
            }
        }
    },
    scaleY: {
        get: function() {
            return this._scaleY;
        },
        set: function(scaleY) {
            this._scaleY = scaleY;
            for (var type in this._layers) {
                this._layers[type].scaleY = scaleY;
            }
        }
    },
    backgroundColor: {
        get: function() {
            return this._backgroundColor;
        },
        set: function(color) {
            this._backgroundColor = this._element.style.backgroundColor = color;
        }
    },
    addLayer: function(type, i) {
        var core = enchant.Core.instance;
        if (this._layers[type]) {
            return;
        }
        var layer = new enchant[type + 'Layer']();
        if (core.currentScene === this) {
            layer._startRendering();
        }
        this._layers[type] = layer;
        var element = layer._element;
        if (typeof i === 'number') {
            var nextSibling = this._element.childNodes[i];
            this._element.insertBefore(element, nextSibling);
            this._layerPriority.splice(i, 0, type);
        } else {
            this._element.appendChild(element);
            this._layerPriority.push(type);
        }
        layer._scene = this;
    },
    _determineEventTarget: function(e) {
        var layer, target;
        for (var i = this._layerPriority.length - 1; i >= 0; i--) {
            layer = this._layers[this._layerPriority[i]];
            target = layer._determineEventTarget(e);
            if (target) {
                break;
            }
        }
        if (!target) {
            target = this;
        }
        return target;
    },
    _onchildadded: function(e) {
        var child = e.node;
        var next = e.next;
        if (child._element) {
            if (!this._layers.Dom) {
                this.addLayer('Dom', 1);
            }
            this._layers.Dom.insertBefore(child, next);
            child._layer = this._layers.Dom;
        } else {
            if (!this._layers.Canvas) {
                this.addLayer('Canvas', 0);
            }
            this._layers.Canvas.insertBefore(child, next);
            child._layer = this._layers.Canvas;
        }
        child.parentNode = this;
    },
    _onchildremoved: function(e) {
        var child = e.node;
        child._layer.removeChild(child);
        child._layer = null;
    },
    _onenter: function() {
        for (var type in this._layers) {
            this._layers[type]._startRendering();
        }
        enchant.Core.instance.addEventListener('exitframe', this._dispatchExitframe);
    },
    _onexit: function() {
        for (var type in this._layers) {
            this._layers[type]._stopRendering();
        }
        enchant.Core.instance.removeEventListener('exitframe', this._dispatchExitframe);
    }
});

/**
 * @scope enchant.CanvasScene.prototype
 * @type {*}
 */
enchant.CanvasScene = enchant.Class.create(enchant.Scene, {
    initialize: function() {
        enchant.Scene.call(this);
        this.addLayer('Canvas');
    },
    _determineEventTarget: function(e) {
        var target = this._layers.Canvas._determineEventTarget(e);
        if (!target) {
            target = this;
        }
        return target;
    },
    _onchildadded: function(e) {
        var child = e.node;
        var next = e.next;
        this._layers.Canvas.insertBefore(child, next);
        child._layer = this._layers.Canvas;
    },
    _onenter: function() {
        this._layers.Canvas._startRendering();
        enchant.Game.instance.addEventListener('exitframe', this._dispatchExitframe);
    },
    _onexit: function() {
        this._layers.Canvas._stopRendering();
        enchant.Game.instance.removeEventListener('exitframe', this._dispatchExitframe);
    }
});

/**
 * @scope enchant.CanvasScene.prototype
 * @type {*}
 */
enchant.DOMScene = enchant.Class.create(enchant.Scene, {
    initialize: function() {
        enchant.Scene.call(this);
        this.addLayer('Dom');
    },
    _determineEventTarget: function(e) {
        var target = this._layers.Dom._determineEventTarget(e);
        if (!target) {
            target = this;
        }
        return target;
    },
    _onchildadded: function(e) {
        var child = e.node;
        var next = e.next;
        this._layers.Dom.insertBefore(child, next);
        child._layer = this._layers.Dom;
    },
    _onenter: function() {
        this._layers.Dom._startRendering();
        enchant.Game.instance.addEventListener('exitframe', this._dispatchExitframe);
    },
    _onexit: function() {
        this._layers.Dom._stopRendering();
        enchant.Game.instance.removeEventListener('exitframe', this._dispatchExitframe);
    }
});

/**
 * @scope enchant.Surface.prototype
 */
enchant.Surface = enchant.Class.create(enchant.EventTarget, {
    /**
     * @name enchant.Surface
     * @class
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
     * @constructs
     */
    initialize: function(width, height) {
        enchant.EventTarget.call(this);

        var core = enchant.Core.instance;

        /**
         * Die Breite der Surface.
         * @type {Number}
         */
        this.width = width;
        /**
         * Die Höhe der Surface.
         * @type {Number}
         */
        this.height = height;
        /**
         * Der Surface Zeichenkontext.
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
     * Liefert einen Pixel der Surface.
     * @param {Number} x Die x Koordinaten des Pixel.
     * @param {Number} y Die y Koordinaten des Pixel.
     * @return {Array.<Number>} Ein Array das die Pixelinformationen im [r, g, b, a] Format enthält.
     */
    getPixel: function(x, y) {
        return this.context.getImageData(x, y, 1, 1).data;
    },
    /**
     * Setzt einen Pixel in der Surface.
     * @param {Number} x Die x Koordinaten des Pixel.
     * @param {Number} y Die y Koordinaten des Pixel.
     * @param {Number} r Der Rotwert des Pixel.
     * @param {Number} g Der Grünwert des Pixel.
     * @param {Number} b Der Blauwert des Pixels.
     * @param {Number} a Die Transparenz des Pixels
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
     * Löscht alle Pixel und setzt macht die Pixel transparent.
     */
    clear: function() {
        this.context.clearRect(0, 0, this.width, this.height);
    },
    /**
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
     * Kopiert diese Surface.
     * @return {enchant.Surface} Die kopierte Surface.
     */
    clone: function() {
        var clone = new enchant.Surface(this.width, this.height);
        clone.draw(this);
        return clone;
    },
    /**
     * Erstellt eine Data-URL (URI Schema) für diese Surface.
     * @return {String} Die Data-URL, welche diese Surface identifiziert und
     * welche genutzt werden kann um diese in einen DOM Baum einzubinden.
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
 * @static
 */
enchant.Surface.load = function(src, callback) {
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

/**
 * @scope enchant.DOMSound.prototype
 * @type {*}
 */
enchant.DOMSound = enchant.Class.create(enchant.EventTarget, {
    /**
     * @name enchant.DOMSound
     * @class
     * Klasse die eine Hüllenklasse (Wrapper) für Audio Elemente darstellt.
     *
     * Safari, Chrome, Firefox, Opera, und IE können alle MP3 Dateien abspielen
     * (Firefox und Opera spielen diese mit Hilfe von Flash ab). WAVE Dateien können
     * Safari, Chrome, Firefox, and Opera abspielen. Sollte der Browser nicht mit
     * dem genutzten Codec kompatibel sein, wird die Datei nicht abgespielt.
     *
     * Instanzen dieser Klasse werden nicht mit Hilfe des Konstruktors, sondern mit
     * {@link enchant.DOMSound.load} erstellt.
     * @constructs
     */
    initialize: function() {
        enchant.EventTarget.call(this);
        /**
         * Die länge der Sounddatei in Sekunden.
         * @type {Number}
         */
        this.duration = 0;
        throw new Error("Illegal Constructor");
    },
    /**
     * Startet die Wiedergabe.
     */
    play: function() {
        if (this._element) {
            this._element.play();
        }
    },
    /**
     * Pausiert die Wiedergabe.
     */
    pause: function() {
        if (this._element) {
            this._element.pause();
        }
    },
    /**
     * Stoppt die Wiedergabe.
     */
    stop: function() {
        this.pause();
        this.currentTime = 0;
    },
    /**
     * Erstellt eine Kopie dieses Soundobjektes.
     * @return {enchant.DOMSound} Kopiertes Sound Objekt.
     */
    clone: function() {
        var clone;
        if (this._element instanceof Audio) {
            clone = Object.create(enchant.DOMSound.prototype, {
                _element: { value: this._element.cloneNode(false) },
                duration: { value: this.duration }
            });
        } else if (enchant.ENV.USE_FLASH_SOUND) {
            return this;
        } else {
            clone = Object.create(enchant.DOMSound.prototype);
        }
        enchant.EventTarget.call(clone);
        return clone;
    },
    /**
     * Aktuelle Wiedergabeposition (seconds).
     * @type {Number}
     */
    currentTime: {
        get: function() {
            return this._element ? this._element.currentTime : 0;
        },
        set: function(time) {
            if (this._element) {
                this._element.currentTime = time;
            }
        }
    },
    /**
     * Lautstärke. 0 (stumm) ～ 1 (volle Lautstärke).
     * @type {Number}
     */
    volume: {
        get: function() {
            return this._element ? this._element.volume : 1;
        },
        set: function(volume) {
            if (this._element) {
                this._element.volume = volume;
            }
        }
    }
});

/**
 * Läd eine Audio Datei und erstellt ein Sound objekt.
 *
 * @param {String} src Pfad zu der zu ladenden Audiodatei.
 * @param {String} [type] MIME Type der Audtiodatei.
 * @static
 */
enchant.DOMSound.load = function(src, type, callback) {
    if (type == null) {
        var ext = enchant.Core.findExt(src);
        if (ext) {
            type = 'audio/' + ext;
        } else {
            type = '';
        }
    }
    type = type.replace('mp3', 'mpeg').replace('m4a', 'mp4');

    var sound = Object.create(enchant.DOMSound.prototype);
    enchant.EventTarget.call(sound);
    var audio = new Audio();
    if (!enchant.ENV.SOUND_ENABLED_ON_MOBILE_SAFARI &&
        enchant.ENV.VENDOR_PREFIX === 'webkit' && enchant.ENV.TOUCH_ENABLED) {
        window.setTimeout(function() {
            sound.dispatchEvent(new enchant.Event('load'));
        }, 0);
    } else {
        if (!enchant.ENV.USE_FLASH_SOUND && audio.canPlayType(type)) {
            audio.src = src;
            audio.load();
            audio.autoplay = false;
            audio.onerror = function() {
                throw new Error('Cannot load an asset: ' + audio.src);
            };
            audio.addEventListener('canplaythrough', function() {
                sound.duration = audio.duration;
                sound.dispatchEvent(new enchant.Event('load'));
            }, false);
            sound._element = audio;
        } else if (type === 'audio/mpeg') {
            var embed = document.createElement('embed');
            var id = 'enchant-audio' + enchant.Core.instance._soundID++;
            embed.width = embed.height = 1;
            embed.name = id;
            embed.src = 'sound.swf?id=' + id + '&src=' + src;
            embed.allowscriptaccess = 'always';
            embed.style.position = 'absolute';
            embed.style.left = '-1px';
            sound.addEventListener('load', function() {
                Object.defineProperties(embed, {
                    currentTime: {
                        get: function() {
                            return embed.getCurrentTime();
                        },
                        set: function(time) {
                            embed.setCurrentTime(time);
                        }
                    },
                    volume: {
                        get: function() {
                            return embed.getVolume();
                        },
                        set: function(volume) {
                            embed.setVolume(volume);
                        }
                    }
                });
                sound._element = embed;
                sound.duration = embed.getDuration();
            });
            enchant.Core.instance._element.appendChild(embed);
            enchant.DOMSound[id] = sound;
        } else {
            window.setTimeout(function() {
                sound.dispatchEvent(new enchant.Event('load'));
            }, 0);
        }
        sound.addEventListener('load', function() {
            callback.call(enchant.Core.instance);
        });
    }
    return sound;
};


window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext || window.msAudioContext || window.oAudioContext;

/**
 * @scope enchant.WebAudioSound.prototype
 * @type {*}
 */
enchant.WebAudioSound = enchant.Class.create(enchant.EventTarget, {
    /**
     * @name enchant.WebAudioSound
     * @class
     * Sound wrapper class for Web Audio API (supported on some webkit-based browsers)
     *
     * @constructs
     */
    initialize: function() {
        if(!window.webkitAudioContext){
            throw new Error("This browser does not support WebAudio API.");
        }
        var actx = enchant.WebAudioSound.audioContext;
        enchant.EventTarget.call(this);
        this.src = actx.createBufferSource();
        this.buffer = null;
        this._volume = 1;
        this._currentTime = 0;
        this._state = 0;
        this.connectTarget = enchant.WebAudioSound.destination;
    },
    play: function(dup) {
        var actx = enchant.WebAudioSound.audioContext;
        if (this._state === 2) {
            this.src.connect(this.connectTarget);
        } else {
            if (this._state === 1 && !dup) {
                this.src.disconnect(this.connectTarget);
            }
            this.src = actx.createBufferSource();
            this.src.buffer = this.buffer;
            this.src.gain.value = this._volume;
            this.src.connect(this.connectTarget);
            this.src.noteOn(0);
        }
        this._state = 1;
    },
    pause: function() {
        var actx = enchant.WebAudioSound.audioContext;
        this.src.disconnect(this.connectTarget);
        this._state = 2;
    },
    stop: function() {
        this.src.noteOff(0);
        this._state = 0;
    },
    clone: function() {
        var sound = new enchant.WebAudioSound();
        sound.buffer = this.buffer;
        return sound;
    },
    dulation: {
        get: function() {
            if (this.buffer) {
                return this.buffer.dulation;
            } else {
                return 0;
            }
        }
    },
    volume: {
        get: function() {
            return this._volume;
        },
        set: function(volume) {
            volume = Math.max(0, Math.min(1, volume));
            this._volume = volume;
            if (this.src) {
                this.src.gain.value = volume;
            }
        }
    },
    currentTime: {
        get: function() {
            window.console.log('currentTime is not allowed');
            return this._currentTime;
        },
        set: function(time) {
            window.console.log('currentTime is not allowed');
            this._currentTime = time;
        }
    }
});

enchant.WebAudioSound.load = function(src, type, callback) {
    var actx = enchant.WebAudioSound.audioContext;
    var xhr = new XMLHttpRequest();
    var sound = new enchant.WebAudioSound();
    var mimeType = 'audio/' + enchant.Core.findExt(src);
    // TODO check Audio.canPlayType(mimeType)
    xhr.responseType = 'arraybuffer';
    xhr.open('GET', src, true);
    xhr.onload = function() {
        actx.decodeAudioData(
            xhr.response,
            function(buffer) {
                sound.buffer = buffer;
                callback.call(enchant.Core.instance);
            },
            function(error) {
                // TODO change to enchant Error
                window.console.log(error);
            }
        );
    };
    xhr.send(null);
    return sound;
};

if(window.AudioContext){
    enchant.WebAudioSound.audioContext = new window.AudioContext();
    enchant.WebAudioSound.destination = enchant.WebAudioSound.audioContext.destination;
}

/* jshint newcap: false */

enchant.Sound = window.AudioContext && enchant.ENV.USE_WEBAUDIO ? enchant.WebAudioSound : enchant.DOMSound;

/**
 * ============================================================================================
 * Easing Equations v2.0
 * September 1, 2003
 * (c) 2003 Robert Penner, all rights reserved.
 * This work is subject to the terms in http://www.robertpenner.com/easing_terms_of_use.html.
 * ============================================================================================
 */

/**
 * Easing function library, from "Easing Equations" by Robert Penner.
 * @type {Object}
 * @namespace
 * {@link enchant.Tween} クラスで用いるイージング関数のライブラリ名前空間.
 */
enchant.Easing = {
    /**
     * @param t
     * @param b
     * @param c
     * @param d
     * @return {Number}
     */
    LINEAR: function(t, b, c, d) {
        return c * t / d + b;
    },
    /**
     * @param t
     * @param b
     * @param c
     * @param d
     * @return {Number}
     */
    SWING: function(t, b, c, d) {
        return c * (0.5 - Math.cos(((t / d) * Math.PI)) / 2) + b;
    },
    // quad
    /**
     * @param t
     * @param b
     * @param c
     * @param d
     * @return {Number}
     */
    QUAD_EASEIN: function(t, b, c, d) {
        return c * (t /= d) * t + b;
    },
    /**
     * @param t
     * @param b
     * @param c
     * @param d
     * @return {Number}
     */
    QUAD_EASEOUT: function(t, b, c, d) {
        return -c * (t /= d) * (t - 2) + b;
    },
    /**
     * @param t
     * @param b
     * @param c
     * @param d
     * @return {Number}
     */
    QUAD_EASEINOUT: function(t, b, c, d) {
        if ((t /= d / 2) < 1) {
            return c / 2 * t * t + b;
        }
        return -c / 2 * ((--t) * (t - 2) - 1) + b;
    },
    // cubic
    /**
     * @param t
     * @param b
     * @param c
     * @param d
     * @return {Number}
     */
    CUBIC_EASEIN: function(t, b, c, d) {
        return c * (t /= d) * t * t + b;
    },
    /**
     * @param t
     * @param b
     * @param c
     * @param d
     * @return {Number}
     */
    CUBIC_EASEOUT: function(t, b, c, d) {
        return c * ((t = t / d - 1) * t * t + 1) + b;
    },
    /**
     * @param t
     * @param b
     * @param c
     * @param d
     * @return {Number}
     */
    CUBIC_EASEINOUT: function(t, b, c, d) {
        if ((t /= d / 2) < 1) {
            return c / 2 * t * t * t + b;
        }
        return c / 2 * ((t -= 2) * t * t + 2) + b;
    },
    // quart
    /**
     * @param t
     * @param b
     * @param c
     * @param d
     * @return {Number}
     */
    QUART_EASEIN: function(t, b, c, d) {
        return c * (t /= d) * t * t * t + b;
    },
    /**
     * @param t
     * @param b
     * @param c
     * @param d
     * @return {Number}
     */
    QUART_EASEOUT: function(t, b, c, d) {
        return -c * ((t = t / d - 1) * t * t * t - 1) + b;
    },
    /**
     * @param t
     * @param b
     * @param c
     * @param d
     * @return {Number}
     */
    QUART_EASEINOUT: function(t, b, c, d) {
        if ((t /= d / 2) < 1) {
            return c / 2 * t * t * t * t + b;
        }
        return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
    },
    // quint
    /**
     * @param t
     * @param b
     * @param c
     * @param d
     * @return {Number}
     */
    QUINT_EASEIN: function(t, b, c, d) {
        return c * (t /= d) * t * t * t * t + b;
    },
    /**
     * @param t
     * @param b
     * @param c
     * @param d
     * @return {Number}
     */
    QUINT_EASEOUT: function(t, b, c, d) {
        return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
    },
    /**
     * @param t
     * @param b
     * @param c
     * @param d
     * @return {Number}
     */
    QUINT_EASEINOUT: function(t, b, c, d) {
        if ((t /= d / 2) < 1) {
            return c / 2 * t * t * t * t * t + b;
        }
        return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
    },
    //sin
    /**
     * @param t
     * @param b
     * @param c
     * @param d
     * @return {Number}
     */
    SIN_EASEIN: function(t, b, c, d) {
        return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
    },
    /**
     * @param t
     * @param b
     * @param c
     * @param d
     * @return {Number}
     */
    SIN_EASEOUT: function(t, b, c, d) {
        return c * Math.sin(t / d * (Math.PI / 2)) + b;
    },
    /**
     * @param t
     * @param b
     * @param c
     * @param d
     * @return {Number}
     */
    SIN_EASEINOUT: function(t, b, c, d) {
        return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
    },
    // circ
    /**
     * @param t
     * @param b
     * @param c
     * @param d
     * @return {Number}
     */
    CIRC_EASEIN: function(t, b, c, d) {
        return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
    },
    /**
     * @param t
     * @param b
     * @param c
     * @param d
     * @return {Number}
     */
    CIRC_EASEOUT: function(t, b, c, d) {
        return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
    },
    /**
     * @param t
     * @param b
     * @param c
     * @param d
     * @return {Number}
     */
    CIRC_EASEINOUT: function(t, b, c, d) {
        if ((t /= d / 2) < 1) {
            return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
        }
        return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
    },
    // elastic
    /**
     * @param t
     * @param b
     * @param c
     * @param d
     * @return {Number}
     */
    ELASTIC_EASEIN: function(t, b, c, d, a, p) {
        if (t === 0) {
            return b;
        }
        if ((t /= d) === 1) {
            return b + c;
        }

        if (!p) {
            p = d * 0.3;
        }

        var s;
        if (!a || a < Math.abs(c)) {
            a = c;
            s = p / 4;
        } else {
            s = p / (2 * Math.PI) * Math.asin(c / a);
        }
        return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
    },
    /**
     * @param t
     * @param b
     * @param c
     * @param d
     * @return {Number}
     */
    ELASTIC_EASEOUT: function(t, b, c, d, a, p) {
        if (t === 0) {
            return b;
        }
        if ((t /= d) === 1) {
            return b + c;
        }
        if (!p) {
            p = d * 0.3;
        }
        var s;
        if (!a || a < Math.abs(c)) {
            a = c;
            s = p / 4;
        } else {
            s = p / (2 * Math.PI) * Math.asin(c / a);
        }
        return (a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b);
    },
    /**
     * @param t
     * @param b
     * @param c
     * @param d
     * @return {Number}
     */
    ELASTIC_EASEINOUT: function(t, b, c, d, a, p) {
        if (t === 0) {
            return b;
        }
        if ((t /= d / 2) === 2) {
            return b + c;
        }
        if (!p) {
            p = d * (0.3 * 1.5);
        }
        var s;
        if (!a || a < Math.abs(c)) {
            a = c;
            s = p / 4;
        } else {
            s = p / (2 * Math.PI) * Math.asin(c / a);
        }
        if (t < 1) {
            return -0.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
        }
        return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * 0.5 + c + b;
    },
    // bounce
    /**
     * @param t
     * @param b
     * @param c
     * @param d
     * @return {Number}
     */
    BOUNCE_EASEOUT: function(t, b, c, d) {
        if ((t /= d) < (1 / 2.75)) {
            return c * (7.5625 * t * t) + b;
        } else if (t < (2 / 2.75)) {
            return c * (7.5625 * (t -= (1.5 / 2.75)) * t + 0.75) + b;
        } else if (t < (2.5 / 2.75)) {
            return c * (7.5625 * (t -= (2.25 / 2.75)) * t + 0.9375) + b;
        } else {
            return c * (7.5625 * (t -= (2.625 / 2.75)) * t + 0.984375) + b;
        }
    },
    /**
     * @param t
     * @param b
     * @param c
     * @param d
     * @return {Number}
     */
    BOUNCE_EASEIN: function(t, b, c, d) {
        return c - enchant.Easing.BOUNCE_EASEOUT(d - t, 0, c, d) + b;
    },
    /**
     * @param t
     * @param b
     * @param c
     * @param d
     * @return {Number}
     */
    BOUNCE_EASEINOUT: function(t, b, c, d) {
        if (t < d / 2) {
            return enchant.Easing.BOUNCE_EASEIN(t * 2, 0, c, d) * 0.5 + b;
        } else {
            return enchant.Easing.BOUNCE_EASEOUT(t * 2 - d, 0, c, d) * 0.5 + c * 0.5 + b;
        }

    },
    // back
    /**
     * @param t
     * @param b
     * @param c
     * @param d
     * @return {Number}
     */
    BACK_EASEIN: function(t, b, c, d, s) {
        if (s === undefined) {
            s = 1.70158;
        }
        return c * (t /= d) * t * ((s + 1) * t - s) + b;
    },
    /**
     * @param t
     * @param b
     * @param c
     * @param d
     * @return {Number}
     */
    BACK_EASEOUT: function(t, b, c, d, s) {
        if (s === undefined) {
            s = 1.70158;
        }
        return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
    },
    /**
     * @param t
     * @param b
     * @param c
     * @param d
     * @return {Number}
     */
    BACK_EASEINOUT: function(t, b, c, d, s) {
        if (s === undefined) {
            s = 1.70158;
        }
        if ((t /= d / 2) < 1) {
            return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
        }
        return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
    },
    // expo
    /**
     * @param t
     * @param b
     * @param c
     * @param d
     * @return {Number}
     */
    EXPO_EASEIN: function(t, b, c, d) {
        return (t === 0) ? b : c * Math.pow(2, 10 * (t / d - 1)) + b;
    },
    /**
     * @param t
     * @param b
     * @param c
     * @param d
     * @return {Number}
     */
    EXPO_EASEOUT: function(t, b, c, d) {
        return (t === d) ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b;
    },
    /**
     * @param t
     * @param b
     * @param c
     * @param d
     * @return {Number}
     */
    EXPO_EASEINOUT: function(t, b, c, d) {
        if (t === 0) {
            return b;
        }
        if (t === d) {
            return b + c;
        }
        if ((t /= d / 2) < 1) {
            return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
        }
        return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
    }
};

/**
 * Easing Equations v2.0
 */

/**
 * @scope enchant.ActionEventTarget.prototype
 * @type {*}
 */
enchant.ActionEventTarget = enchant.Class.create(enchant.EventTarget, {
    /**
     * @name enchant.ActionEventTarget
     * @class
     * @constructs
     * @extends enchant.EventTarget
     */
    initialize: function() {
        enchant.EventTarget.apply(this, arguments);
    },
    /**
     * Issue event.
     * @param {enchant.Event} e Event issued.
     */
    dispatchEvent: function(e) {
        var target;
        if (this.node) {
            target = this.node;
            e.target = target;
            e.localX = e.x - target._offsetX;
            e.localY = e.y - target._offsetY;
        } else {
            this.node = null;
        }

        if (this['on' + e.type] != null) {
            this['on' + e.type].call(target, e);
        }
        var listeners = this._listeners[e.type];
        if (listeners != null) {
            listeners = listeners.slice();
            for (var i = 0, len = listeners.length; i < len; i++) {
                listeners[i].call(target, e);
            }
        }
    }
});

/**
 * @scope enchant.Timeline.prototype
 */
enchant.Timeline = enchant.Class.create(enchant.EventTarget, {
    /**
     * @name enchant.Timeline
     * @class
     * @constructs
     */
    initialize: function(node) {
        enchant.EventTarget.call(this);
        this.node = node;
        this.queue = [];
        this.paused = false;
        this.looped = false;
        this.isFrameBased = true;
        this._parallel = null;
        this._activated = false;
        this.addEventListener(enchant.Event.ENTER_FRAME, this.tick);
    },
    /**
     * @private
     */
    _deactivateTimeline: function() {
        if (this._activated) {
            this._activated = false;
            this.node.removeEventListener('enterframe', this._nodeEventListener);
        }
    },
    /**
     * @private
     */
    _activateTimeline: function() {
        if (!this._activated && !this.paused) {
            this.node.addEventListener("enterframe", this._nodeEventListener);
            this._activated = true;
        }
    },
    /**
     */
    setFrameBased: function() {
        this.isFrameBased = true;
    },
    /**
     */
    setTimeBased: function() {
        this.isFrameBased = false;
    },
    /**
     */
    next: function(remainingTime) {
        var e, action = this.queue.shift();
        e = new enchant.Event("actionend");
        e.timeline = this;
        action.dispatchEvent(e);

        if (this.queue.length === 0) {
            this._activated = false;
            this.node.removeEventListener('enterframe', this._nodeEventListener);
            return;
        }

        if (this.looped) {
            e = new enchant.Event("removedfromtimeline");
            e.timeline = this;
            action.dispatchEvent(e);
            action.frame = 0;

            this.add(action);
        } else {
            // remove after dispatching removedfromtimeline event
            e = new enchant.Event("removedfromtimeline");
            e.timeline = this;
            action.dispatchEvent(e);
        }
        if (remainingTime > 0 || (this.queue[0] && this.queue[0].time === 0)) {
            var event = new enchant.Event("enterframe");
            event.elapsed = remainingTime;
            this.dispatchEvent(event);
        }
    },
    /**
     */
    tick: function(enterFrameEvent) {
        if (this.paused) {
            return;
        }
        if (this.queue.length > 0) {
            var action = this.queue[0];
            if (action.frame === 0) {
                var f;
                f = new enchant.Event("actionstart");
                f.timeline = this;
                action.dispatchEvent(f);
            }

            var e = new enchant.Event("actiontick");
            e.timeline = this;
            if (this.isFrameBased) {
                e.elapsed = 1;
            } else {
                e.elapsed = enterFrameEvent.elapsed;
            }
            action.dispatchEvent(e);
        }
    },
    add: function(action) {
        if (!this._activated) {
            var tl = this;
            this._nodeEventListener = function(e) {
                tl.dispatchEvent(e);
            };
            this.node.addEventListener("enterframe", this._nodeEventListener);

            this._activated = true;
        }
        if (this._parallel) {
            this._parallel.actions.push(action);
            this._parallel = null;
        } else {
            this.queue.push(action);
        }
        action.frame = 0;

        var e = new enchant.Event("addedtotimeline");
        e.timeline = this;
        action.dispatchEvent(e);

        e = new enchant.Event("actionadded");
        e.action = action;
        this.dispatchEvent(e);

        return this;
    },
    /**
     */
    action: function(params) {
        return this.add(new enchant.Action(params));
    },
    /**
     */
    tween: function(params) {
        return this.add(new enchant.Tween(params));
    },
    /**
     */
    clear: function() {
        var e = new enchant.Event("removedfromtimeline");
        e.timeline = this;

        for (var i = 0, len = this.queue.length; i < len; i++) {
            this.queue[i].dispatchEvent(e);
        }
        this.queue = [];
        this._deactivateTimeline();
        return this;
    },
    /**
     */
    skip: function(frames) {
        var event = new enchant.Event("enterframe");
        if (this.isFrameBased) {
            event.elapsed = 1;
        } else {
            event.elapsed = frames;
            frames = 1;
        }
        while (frames--) {
            this.dispatchEvent(event);
        }
        return this;
    },
    /**
     */
    pause: function() {
        if (!this.paused) {
            this.paused = true;
            this._deactivateTimeline();
        }
        return this;
    },
    /**
     */
    resume: function() {
        if (this.paused) {
            this.paused = false;
            this._activateTimeline();
        }
        return this;
    },
    /**
     */
    loop: function() {
        this.looped = true;
        return this;
    },
    /**
     */
    unloop: function() {
        this.looped = false;
        return this;
    },
    /**
     */
    delay: function(time) {
        this.add(new enchant.Action({
            time: time
        }));
        return this;
    },
    /**
     */
    wait: function(time) {
        // reserved
        return this;
    },
    /**
     */
    then: function(func) {
        var timeline = this;
        this.add(new enchant.Action({
            onactiontick: function(evt) {
                func.call(timeline.node);
            },
            // if time is 0, next action will be immediately executed
            time: 0
        }));
        return this;
    },
    /**
     */
    exec: function(func) {
        this.then(func);
    },
    /**
     */
    cue: function(cue) {
        var ptr = 0;
        for (var frame in cue) {
            if (cue.hasOwnProperty(frame)) {
                this.delay(frame - ptr);
                this.then(cue[frame]);
                ptr = frame;
            }
        }
    },
    /**
     */
    repeat: function(func, time) {
        this.add(new enchant.Action({
            onactiontick: function(evt) {
                func.call(this);
            },
            time: time
        }));
        return this;
    },
    /**
     */
    and: function() {
        var last = this.queue.pop();
        if (last instanceof enchant.ParallelAction) {
            this._parallel = last;
            this.queue.push(last);
        } else {
            var parallel = new enchant.ParallelAction();
            parallel.actions.push(last);
            this.queue.push(parallel);
            this._parallel = parallel;
        }
        return this;
    },
    /**
     * @ignore
     */
    or: function() {
        return this;
    },
    /**
     * @ignore
     */
    doAll: function(children) {
        return this;
    },
    /**
     * @ignore
     */
    waitAll: function() {
        return this;
    },
    /**
     */
    waitUntil: function(func) {
        var timeline = this;
        this.add(new enchant.Action({
            onactionstart: func,
            onactiontick: function(evt) {
                if (func.call(this)) {
                    timeline.next();
                }
            }
        }));
        return this;
    },
    /**
     */
    fadeTo: function(opacity, time, easing) {
        this.tween({
            opacity: opacity,
            time: time,
            easing: easing
        });
        return this;
    },
    /**
     */
    fadeIn: function(time, easing) {
        return this.fadeTo(1, time, easing);
    },
    /**
     */
    fadeOut: function(time, easing) {
        return this.fadeTo(0, time, easing);
    },
    /**
     */
    moveTo: function(x, y, time, easing) {
        return this.tween({
            x: x,
            y: y,
            time: time,
            easing: easing
        });
    },
    /**
     */
    moveX: function(x, time, easing) {
        return this.tween({
            x: x,
            time: time,
            easing: easing
        });
    },
    /**
     */
    moveY: function(y, time, easing) {
        return this.tween({
            y: y,
            time: time,
            easing: easing
        });
    },
    /**
     */
    moveBy: function(x, y, time, easing) {
        return this.tween({
            x: function() {
                return this.x + x;
            },
            y: function() {
                return this.y + y;
            },
            time: time,
            easing: easing
        });
    },
    /**
     */
    hide: function() {
        return this.then(function() {
            this.opacity = 0;
        });
    },
    /**
     */
    show: function() {
        return this.then(function() {
            this.opacity = 1;
        });
    },
    /**
     */
    removeFromScene: function() {
        return this.then(function() {
            this.scene.removeChild(this);
        });
    },
    /**
     */
    scaleTo: function(scale, time, easing) {
        if (typeof easing === "number") {
            return this.tween({
                scaleX: arguments[0],
                scaleY: arguments[1],
                time: arguments[2],
                easing: arguments[3]
            });
        }
        return this.tween({
            scaleX: scale,
            scaleY: scale,
            time: time,
            easing: easing
        });
    },
    /**
     */
    scaleBy: function(scale, time, easing) {
        if (typeof easing === "number") {
            return this.tween({
                scaleX: function() {
                    return this.scaleX * arguments[0];
                },
                scaleY: function() {
                    return this.scaleY * arguments[1];
                },
                time: arguments[2],
                easing: arguments[3]
            });
        }
        return this.tween({
            scaleX: function() {
                return this.scaleX * scale;
            },
            scaleY: function() {
                return this.scaleY * scale;
            },
            time: time,
            easing: easing
        });
    },
    /**
     */
    rotateTo: function(deg, time, easing) {
        return this.tween({
            rotation: deg,
            time: time,
            easing: easing
        });
    },
    /**
     */
    rotateBy: function(deg, time, easing) {
        return this.tween({
            rotation: function() {
                return this.rotation + deg;
            },
            time: time,
            easing: easing
        });
    }
});
/**
 * @scope enchant.Action.prototype
 * @type {*}
 */

enchant.Action = enchant.Class.create(enchant.ActionEventTarget, {
    /**
     * @name enchant.Action
     * @class
     * @constructs
     */
    initialize: function(param) {
        enchant.ActionEventTarget.call(this);
        this.time = null;
        this.frame = 0;
        for (var key in param) {
            if (param.hasOwnProperty(key)) {
                if (param[key] != null) {
                    this[key] = param[key];
                }
            }
        }
        var action = this;

        this.timeline = null;
        this.node = null;

        this.addEventListener(enchant.Event.ADDED_TO_TIMELINE, function(evt) {
            action.timeline = evt.timeline;
            action.node = evt.timeline.node;
            action.frame = 0;
        });

        this.addEventListener(enchant.Event.REMOVED_FROM_TIMELINE, function() {
            action.timeline = null;
            action.node = null;
            action.frame = 0;
        });

        this.addEventListener(enchant.Event.ACTION_TICK, function(evt) {
            var remaining = action.time - (action.frame + evt.elapsed);
            if (action.time != null && remaining <= 0) {
                action.frame = action.time;
                evt.timeline.next(-remaining);
            } else {
                action.frame += evt.elapsed;
            }
        });

    }
});
/**
 * @scope enchant.ParallelAction.prototype
 */
enchant.ParallelAction = enchant.Class.create(enchant.Action, {
    /**
     * @name enchant.ParallelAction
     * @class
     * @constructs
     * @extends enchant.Action
     */
    initialize: function(param) {
        enchant.Action.call(this, param);
        var timeline = this.timeline;
        var node = this.node;
        /**
         */
        this.actions = [];
        /**
         */
        this.endedActions = [];
        var that = this;

        this.addEventListener(enchant.Event.ACTION_START, function(evt) {
            for (var i = 0, len = that.actions.length; i < len; i++) {
                that.actions[i].dispatchEvent(evt);
            }
        });

        this.addEventListener(enchant.Event.ACTION_TICK, function(evt) {
            var i, len, timeline = {
                next: function(remaining) {
                    var action = that.actions[i];
                    that.actions.splice(i--, 1);
                    len = that.actions.length;
                    that.endedActions.push(action);

                    var e = new enchant.Event("actionend");
                    e.timeline = this;
                    action.dispatchEvent(e);

                    e = new enchant.Event("removedfromtimeline");
                    e.timeline = this;
                    action.dispatchEvent(e);
                }
            };

            var e = new enchant.Event("actiontick");
            e.timeline = timeline;
            e.elapsed = evt.elapsed;
            for (i = 0, len = that.actions.length; i < len; i++) {
                that.actions[i].dispatchEvent(e);
            }

            if (that.actions.length === 0) {
                evt.timeline.next();
            }
        });

        this.addEventListener(enchant.Event.ADDED_TO_TIMELINE, function(evt) {
            for (var i = 0, len = that.actions.length; i < len; i++) {
                that.actions[i].dispatchEvent(evt);
            }
        });

        this.addEventListener(enchant.Event.REMOVED_FROM_TIMELINE, function() {
            this.actions = this.endedActions;
            this.endedActions = [];
        });

    }
});

/**
 * @scope enchant.Tween.prototype
 */
enchant.Tween = enchant.Class.create(enchant.Action, {
    /**
     * @name enchant.Tween
     * @class
     */
    initialize: function(params) {
        var origin = {};
        var target = {};
        enchant.Action.call(this, params);

        if (this.easing == null) {
            // linear
            this.easing = function(t, b, c, d) {
                return c * t / d + b;
            };
        }

        var tween = this;
        this.addEventListener(enchant.Event.ACTION_START, function() {
            // excepted property
            var excepted = ["frame", "time", "callback", "onactiontick", "onactionstart", "onactionend"];
            for (var prop in params) {
                if (params.hasOwnProperty(prop)) {
                    // if function is used instead of numerical value, evaluate it
                    var target_val;
                    if (typeof params[prop] === "function") {
                        target_val = params[prop].call(tween.node);
                    } else {
                        target_val = params[prop];
                    }

                    if (excepted.indexOf(prop) === -1) {
                        origin[prop] = tween.node[prop];
                        target[prop] = target_val;
                    }
                }
            }
        });

        this.addEventListener(enchant.Event.ACTION_TICK, function(evt) {
            // if time is 0, set property to target value immediately
            var ratio = tween.time === 0 ? 1 : tween.easing(Math.min(tween.time,tween.frame + evt.elapsed), 0, 1, tween.time) - tween.easing(tween.frame, 0, 1, tween.time);

            for (var prop in target){
                if (target.hasOwnProperty(prop)) {
                    if (typeof this[prop] === "undefined"){
                        continue;
                    }
                    tween.node[prop] += (target[prop] - origin[prop]) * ratio;
                    if (Math.abs(tween.node[prop]) < 10e-8){
                        tween.node[prop] = 0;
                    }
                }
            }
        });
    }
});
/**
 *
 */
}(window));
