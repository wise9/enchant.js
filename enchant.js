/**
 * enchant.js v0.6.3
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
    var origin;
    if (window.performance && window.performance.now) {
        origin = Date.now();
        return function() {
            return origin + window.performance.now();
        };
    } else if (window.performance && window.performance.webkitNow) {
        origin = Date.now();
        return function() {
            return origin + window.performance.webkitNow();
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
            var _id = setTimeout(function() {
                lastTime = window.getTime();
                func(lastTime);
            }, Math.max(0, lastTime + frame - window.getTime()));
            return _id;
        };
    }());

/**
 * Export the library classes globally.
 *
 * When no arguments are given, all classes defined in enchant.js as well as all classes defined in
 * plugins will be exported. When more than one argument is given, by default only classes defined
 * in enchant.js will be exported. When you wish to export plugin classes you must explicitly deliver
 * the plugin identifiers as arguments.
 *
 * @example
 *   enchant();     // All classes will be exported.
 *   enchant('');   // Only classes in enchant.js will be exported.
 *   enchant('ui'); // enchant.js classes and ui.enchant.js classes will be exported.
 *
 * @param {...String} [modules] Export module. Multiple designations possible.
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
                } else if (typeof module[prop] === 'object' && module[prop] !== null && Object.getPrototypeOf(module[prop]) === Object.prototype) {
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

    // issue 185
    if (enchant.Class.getInheritanceTree(window.Game).length <= enchant.Class.getInheritanceTree(window.Core).length) {
        window.Game = window.Core;
    }

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
 * A Class representing a class which supports inheritance.
 *
 * @param {Function} [superclass] The class from which the
 * new class will inherit the class definition.
 * @param {*} definition Class definition.
 * @constructor
 */
enchant.Class = function(superclass, definition) {
    return enchant.Class.create(superclass, definition);
};

/**
 * Create a class.
 *
 * When defining classes that inherit from other classes, the previous class is used as a base with
 * the superclass's constructor as default. When overriding the default constructor, it is necessary
 * to explicitly call the previous constructor to ensure a correct class initialization.
 *
 * @example
 *   var Ball = Class.create({ // Creates independent class.
 *       initialize: function(radius) { ... }, // Method definition.
 *       fall: function() { ... }
 *   });
 *
 *   var Ball = Class.create(Sprite);  // Creates a class inheriting from "Sprite"
 *   var Ball = Class.create(Sprite, { // Creates a class inheriting "Sprite"
 *       initialize: function(radius) { // Overwrites constructor
 *          Sprite.call(this, radius*2, radius*2); // Applies previous constructor.
 *          this.image = core.assets['ball.gif'];
 *       }
 *   });
 *
 * @param {Function} [superclass] The class from which the
 * new class will inherit the class definition.
 * @param {*} [definition] Class definition.
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
    for (var i = 0, l = tree.length; i < l; i++) {
        if (typeof tree[i]._inherited === 'function') {
            tree[i]._inherited(Constructor);
            break;
        }
    }

    return Constructor;
};

/**
 * Get the inheritance tree of this class.
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
 * Environment variable.
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
     * A class for an independent implementation of events
     * similar to DOM Events.
     * However, it does not include phase concept.
     * @param {String} type Event type.
     * @constructs
     */
    initialize: function(type) {
        /**
         * The type of the event.
         * @type {String}
         */
        this.type = type;
        /**
         * The target of the event.
         * @type {*}
         */
        this.target = null;
        /**
         * The x coordinate of the events occurrence.
         * @type {Number}
         */
        this.x = 0;
        /**
         * The y coordinate of the events occurrence.
         * @type {Number}
         */
        this.y = 0;
        /**
         * The event occurrences local coordinate systems x coordinates.
         * @type {Number}
         */
        this.localX = 0;
        /**
         * The event occurrences local coordinate systems y coordinates.
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
 * An event dispatched upon completion of core loading.
 *
 * It is necessary to wait for loading to finish and to do initial processing when preloading images.
 * Issued object: {@link enchant.Core}
 *
 * @example
 *   var core = new Core(320, 320);
 *   core.preload('player.gif');
 *   core.onload = function() {
 *      ... // Describes initial core processing
 *   };
 *   core.start();
 * @type {String}
 */
enchant.Event.LOAD = 'load';

/**
 * Events which are occurring when error is occured.
 * Issued object: {@link enchant.Core}, {@link enchant.Surface}, {@link enchant.WebAudioSound}, {@link enchant.DOMSound}
 */
enchant.Event.ERROR = 'error';

/**
 * Events which are occurring when display size is changed.
 * Issued object: {@link enchant.Core}, {@link enchant.Scene}
 @type {String}
 */
enchant.Event.CORE_RESIZE = 'coreresize';

/**
 * Events which are occurring during core loading.
 * Dispatched each time preloaded image is loaded. Issued object: {@link enchant.LoadingScene}
 * @type {String}
 */
enchant.Event.PROGRESS = 'progress';

/**
 * An event which is occurring when a new frame is beeing processed.
 * Issued object: {@link enchant.Core}, {@link enchant.Node}
 * @type {String}
 */
enchant.Event.ENTER_FRAME = 'enterframe';

/**
 * An event which is occurring when the frame processing is about to end.
 * Issued object: {@link enchant.Core}
 * @type {String}
 */
enchant.Event.EXIT_FRAME = 'exitframe';

/**
 * Events occurring during Scene beginning.
 * Issued object: {@link enchant.Scene}
 * @type {String}
 */
enchant.Event.ENTER = 'enter';

/**
 * Events occurring during Scene end.
 * Issued object: {@link enchant.Scene}
 * @type {String}
 */
enchant.Event.EXIT = 'exit';

/**
 * An event which is occurring when a Child is getting added to a Node.
 * Issued object: {@link enchant.Group}, {@link enchant.Scene}
 * @type {String}
 */
enchant.Event.CHILD_ADDED = 'childadded';

/**
 * An event which is occurring when the Node is added to a Group.
 * Issued object: {@link enchant.Node}
 * @type {String}
 */
enchant.Event.ADDED = 'added';

/**
 * An event which is occurring when the Node is added to a Scene.
 * Issued object: {@link enchant.Node}
 * @type {String}
 */
enchant.Event.ADDED_TO_SCENE = 'addedtoscene';

/**
 * An event which is occurring when a Child is removed from a Node.
 * Issued object: {@link enchant.Group}, {@link enchant.Scene}
 * @type {String}
 * @type {String}
 */
enchant.Event.CHILD_REMOVED = 'childremoved';

/**
 * An event which is occurring when the Node is deleted from a Group.
 * Issued object: {@link enchant.Node}
 * @type {String}
 */
enchant.Event.REMOVED = 'removed';

/**
 * An event which is occurring when the Node is deleted from a Scene.
 * Issued object: {@link enchant.Node}
 * @type {String}
 */
enchant.Event.REMOVED_FROM_SCENE = 'removedfromscene';

/**
 * An event occurring when a touch related to the Node has begun.
 * A click is also treated as touch. Issued object: {@link enchant.Node}
 * @type {String}
 */
enchant.Event.TOUCH_START = 'touchstart';

/**
 * An event occurring when a touch related to the Node has been moved.
 * A click is also treated as touch. Issued object: {@link enchant.Node}
 * @type {String}
 */
enchant.Event.TOUCH_MOVE = 'touchmove';

/**
 * An event which is occurring when a touch related to the Node has ended.
 * A Click is also treated as touch. Issued object: enchant.Node
 * @type {String}
 */
enchant.Event.TOUCH_END = 'touchend';

/**
 * An event which is occurring when an Entity is rendered.
 * Issued object: {@link enchant.Entity}
 * @type {String}
 */
enchant.Event.RENDER = 'render';

/**
 * An event which is occurring when a button is pressed.
 * Issued object: {@link enchant.Core}, {@link enchant.Scene}
 * @type {String}
 */
enchant.Event.INPUT_START = 'inputstart';

/**
 * An event which is occurring when a button input changes.
 * Issued object: {@link enchant.Core}, {@link enchant.Scene}
 * @type {String}
 */
enchant.Event.INPUT_CHANGE = 'inputchange';

/**
 * An event which is occurring when a button input ends.
 * Issued object: {@link enchant.Core}, {@link enchant.Scene}
 * @type {String}
 */
enchant.Event.INPUT_END = 'inputend';

/**
 * An event which is occurring when the left button is pressed.
 * Issued object: {@link enchant.Core}, {@link enchant.Scene}
 * @type {String}
 */
enchant.Event.LEFT_BUTTON_DOWN = 'leftbuttondown';

/**
 * An event which is occurring when the left button is released.
 * Issued object: {@link enchant.Core}, {@link enchant.Scene}
 * @type {String}
 */
enchant.Event.LEFT_BUTTON_UP = 'leftbuttonup';

/**
 * An event which is occurring when the right button is pressed.
 * Issued object: {@link enchant.Core}, {@link enchant.Scene}
 * @type {String}
 */
enchant.Event.RIGHT_BUTTON_DOWN = 'rightbuttondown';

/**
 * An event which is occurring when the right button is released.
 * Issued object: {@link enchant.Core}, {@link enchant.Scene}
 * @type {String}
 */
enchant.Event.RIGHT_BUTTON_UP = 'rightbuttonup';

/**
 * An event which is occurring when the up button is pressed.
 * Issued object: {@link enchant.Core}, {@link enchant.Scene}
 * @type {String}
 */
enchant.Event.UP_BUTTON_DOWN = 'upbuttondown';

/**
 * An event which is occurring when the up button is released.
 * Issued object: {@link enchant.Core}, {@link enchant.Scene}
 * @type {String}
 */
enchant.Event.UP_BUTTON_UP = 'upbuttonup';

/**
 * An event which is occurring when the down button is pressed.
 * Issued object: {@link enchant.Core}, {@link enchant.Scene}
 * @type {String}
 */
enchant.Event.DOWN_BUTTON_DOWN = 'downbuttondown';

/**
 * An event which is occurring when the down button is released.
 * Issued object: {@link enchant.Core}, {@link enchant.Scene}
 * @type {String}
 */
enchant.Event.DOWN_BUTTON_UP = 'downbuttonup';

/**
 * An event which is occurring when the a button is pressed.
 * Issued object: {@link enchant.Core}, {@link enchant.Scene}
 * @type {String}
 */
enchant.Event.A_BUTTON_DOWN = 'abuttondown';

/**
 * An event which is occurring when the a button is released.
 * Issued object: {@link enchant.Core}, {@link enchant.Scene}
 * @type {String}
 */
enchant.Event.A_BUTTON_UP = 'abuttonup';

/**
 * An event which is occurring when the b button is pressed.
 * Issued object: {@link enchant.Core}, {@link enchant.Scene}
 * @type {String}
 */
enchant.Event.B_BUTTON_DOWN = 'bbuttondown';

/**
 * An event which is occurring when the b button is released.
 * Issued object: {@link enchant.Core}, {@link enchant.Scene}
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
     * A class for an independent implementation of events
     * similar to DOM Events.
     * However, it does not include the phase concept.
     * @extends {enchant.Event}
     * @constructs
     */
    initialize: function() {
        this._listeners = {};
    },
    /**
     * Add a new event listener which will be executed when the event
     * is being dispatched.
     * @param {String} type Type of the events.
     * @param {function(e:enchant.Event)} listener Event listener to be added.
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
     * Delete an event listener.
     * @param {String} type Type of the events.
     * @param {function(e:enchant.Event)} listener Event listener to be deleted.
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
     * Clear all defined event listener for a given type.
     * If no type is given, all listener will be removed.
     * @param [String] type Type of the events.
     */
    clearEventListener: function(type) {
        if (type != null) {
            delete this._listeners[type];
        } else {
            this._listeners = {};
        }
    },
    /**
     * Issue an event.
     * @param {enchant.Event} e Event to be issued.
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
         * A class which is controlling the cores main loop and scenes.
         *
         * There can be only one instance at a time, when the constructor is executed
         * with an instance present, the existing instance will be overwritten. The existing instance
         * can be accessed from {@link enchant.Core.instance}.
         *
         * @param {Number} width The width of the core screen.
         * @param {Number} height The height of the core screen.
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

            this._calledTime = 0;
            this._mousedownID = 0;
            this._surfaceID = 0;
            this._soundID = 0;

            this._scenes = [];

            width = width || 320;
            height = height || 320;

            var stage = document.getElementById('enchant-stage');
            var scale, sWidth, sHeight;
            if (!stage) {
                stage = document.createElement('div');
                stage.id = 'enchant-stage';
                stage.style.position = 'absolute';

                if (document.body.firstChild) {
                    document.body.insertBefore(stage, document.body.firstChild);
                } else {
                    document.body.appendChild(stage);
                }
                scale = Math.min(
                    window.innerWidth / width,
                    window.innerHeight / height
                );
                this._pageX = 0;
                this._pageY = 0;
            } else {
                var style = window.getComputedStyle(stage);
                sWidth = parseInt(style.width, 10);
                sHeight = parseInt(style.height, 10);
                if (sWidth && sHeight) {
                    scale = Math.min(
                        sWidth / width,
                        sHeight / height
                    );
                } else {
                    scale = 1;
                }
                while (stage.firstChild) {
                    stage.removeChild(stage.firstChild);
                }
                stage.style.position = 'relative';

                var bounding = stage.getBoundingClientRect();
                this._pageX = Math.round(window.scrollX || window.pageXOffset + bounding.left);
                this._pageY = Math.round(window.scrollY || window.pageYOffset + bounding.top);
            }
            stage.style.fontSize = '12px';
            stage.style.webkitTextSizeAdjust = 'none';
            this._element = stage;

            this.addEventListener('coreresize', this._oncoreresize);

            this._width = width;
            this._height = height;
            this.scale = scale;

            /**
             * The frame rate of the core.
             * @type {Number}
             */
            this.fps = 30;
            /**
             * The amount of frames since the core was started.
             * @type {Number}
             */
            this.frame = 0;
            /**
             * Indicates if the core can be executed.
             * @type {Boolean}
             */
            this.ready = false;
            /**
             * Indicates if the core is currently executed.
             * @type {Boolean}
             */
            this.running = false;
            /**
             * Object which stores loaded objects with the path as key.
             * @type {Object.<String, Surface>}
             */
            this.assets = {};
            var assets = this._assets = [];
            (function detectAssets(module) {
                if (module.assets) {
                    enchant.Core.instance.preload(module.assets);
                }
                for (var prop in module) {
                    if (module.hasOwnProperty(prop)) {
                        if (typeof module[prop] === 'object' && module[prop] !== null && Object.getPrototypeOf(module[prop]) === Object.prototype) {
                            detectAssets(module[prop]);
                        }
                    }
                }
            }(enchant));

            /**
             * The Scene which is currently displayed. This Scene is on top of Scene stack.
             * @type {enchant.Scene}
             */
            this.currentScene = null;
            /**
             * The root Scene. The Scene at bottom of Scene stack.
             * @type {enchant.Scene}
             */
            this.rootScene = new enchant.Scene();
            this.pushScene(this.rootScene);
            /**
             * The Scene which is getting displayed during loading.
             * @type {enchant.Scene}
             */
            this.loadingScene = new enchant.LoadingScene();

            /**
             * @type {Boolean}
             * @private
             */
            this._activated = false;

            this._offsetX = 0;
            this._offsetY = 0;

            /**
             * Object that saves the current input state for the core.
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
                    var target = core._touchEventTarget[core._mousedownID];
                    if (target) {
                        target.dispatchEvent(evt);
                    }
                    delete core._touchEventTarget[core._mousedownID];
                }, false);
            }
        },
        /**
         * The width of the core screen.
         * @type {Number}
         */
        width: {
            get: function() {
                return this._width;
            },
            set: function(w) {
                this._width = w;
                this._dispatchCoreResizeEvent();
            }
        },
        /**
         * The height of the core screen.
         * @type {Number}
         */
        height: {
            get: function() {
                return this._height;
            },
            set: function(h) {
                this._height = h;
                this._dispatchCoreResizeEvent();
            }
        },
        /**
         * The scaling of the core rendering.
         * @type {Number}
         */
        scale: {
            get: function() {
                return this._scale;
            },
            set: function(s) {
                this._scale = s;
                this._dispatchCoreResizeEvent();
            }
        },
        _dispatchCoreResizeEvent: function() {
            var e = new enchant.Event('coreresize');
            e.width = this._width;
            e.height = this._height;
            e.scale = this._scale;
            this.dispatchEvent(e);
        },
        _oncoreresize: function(e) {
            this._element.style.width = Math.floor(this._width * this._scale) + 'px';
            this._element.style.height = Math.floor(this._height * this._scale) + 'px';
            var scene;
            for (var i = 0, l = this._scenes.length; i < l; i++) {
                scene = this._scenes[i];
                scene.dispatchEvent(e);
            }
        },
        /**
         * Performs a file preload.
         *
         * Sets files which are to be preloaded. When {@link enchant.Core#start} is called the
         * actual loading takes place. When all files are loaded, a {@link enchant.Event.LOAD} event
         * is dispatched from the Core object. Depending on the type of the file different objects will be
         * created and stored in {@link enchant.Core#assets} Variable.
         * When an image file is loaded, an {@link enchant.Surface} is created. If a sound file is loaded, an
         * {@link enchant.Sound} object is created. Otherwise it will be accessible as a string.
         *
         * In addition, because this Surface object used made with {@link enchant.Surface.load},
         * direct object manipulation is not possible. Refer to the items of {@link enchant.Surface.load}
         *
         * @example
         *   core.preload('player.gif');
         *   core.onload = function() {
         *      var sprite = new Sprite(32, 32);
         *      sprite.image = core.assets['player.gif']; // Access via path
         *      ...
         *   };
         *   core.start();
         *
         * @param {...String} assets Path of images to be preloaded. Multiple settings possible.
         * @return {enchant.Core} this
         */
        preload: function(assets) {
            var a;
            if (!(assets instanceof Array)) {
                if (typeof assets === 'object') {
                    a = [];
                    for (var name in assets) {
                        if (assets.hasOwnProperty(name)) {
                            a.push([ assets[name], name ]);
                        }
                    }
                    assets = a;
                } else {
                    assets = Array.prototype.slice.call(arguments);
                }
            }
            Array.prototype.push.apply(this._assets, assets);
            return this;
        },
        /**
         * Loads a file.
         *
         * @param {String} asset File path of the resource to be loaded.
         * @param {String} asset name of the resource to be loaded.
         * @param {Function} [callback] Function called up when file loading is finished.
         * @param {Function} [callback] Function called up when file loading is failed.
         */
        load: function(src, alias, callback, onerror) {
            var assetName, offset;
            if (typeof arguments[1] === 'string') {
                assetName = alias;
                offset = 1;
            } else {
                assetName = src;
                offset = 0;
            }
            callback = arguments[1 + offset] || function() {};
            onerror = arguments[2 + offset] || function() {};

            var ext = enchant.Core.findExt(src);

            return enchant.Deferred.next(function() {
                var d = new enchant.Deferred();
                var _callback = function(e) {
                    d.call(e);
                    callback.call(this, e);
                };
                var _onerror = function(e) {
                    d.fail(e);
                    onerror.call(this, e);
                };
                if (enchant.Core._loadFuncs[ext]) {
                    enchant.Core.instance.assets[assetName] = enchant.Core._loadFuncs[ext](src, ext, _callback, _onerror);
                } else {
                    var req = new XMLHttpRequest();
                    req.open('GET', src, true);
                    req.onreadystatechange = function() {
                        if (req.readyState === 4) {
                            if (req.status !== 200 && req.status !== 0) {
                                // throw new Error(req.status + ': ' + 'Cannot load an asset: ' + src);
                                var e = new enchant.Event('error');
                                e.message = req.status + ': ' + 'Cannot load an asset: ' + src;
                                _onerror.call(enchant.Core.instance, e);
                            }

                            var type = req.getResponseHeader('Content-Type') || '';
                            if (type.match(/^image/)) {
                                core.assets[assetName] = enchant.Surface.load(src, _callback, _onerror);
                            } else if (type.match(/^audio/)) {
                                core.assets[assetName] = enchant.Sound.load(src, type, _callback, _onerror);
                            } else {
                                core.assets[assetName] = req.responseText;
                                _callback.call(enchant.Core.instance, new enchant.Event('laod'));
                            }
                        }
                    };
                    req.send(null);
                }
                return d;
            });
        },
        /**
         * Start the core.
         *
         * Obeying the frame rate set in {@link enchant.Core#fps}, the frame in
         * {@link enchant.Core#currentScene} will be updated. If images to preload are present,
         * loading will begin and the loading screen will be displayed.
         * @return {enchant.Deferred} Deferred
         */
        start: function(deferred) {
            var onloadTimeSetter = function() {
                this.frame = 0;
                this.removeEventListener('load', onloadTimeSetter);
            };
            this.addEventListener('load', onloadTimeSetter);

            this.currentTime = window.getTime();
            this.running = true;
            this.ready = true;

            if (!this._activated) {
                this._activated = true;
                if (enchant.ENV.SOUND_ENABLED_ON_MOBILE_SAFARI && !core._touched &&
                    (navigator.userAgent.indexOf('iPhone OS') !== -1 ||
                    navigator.userAgent.indexOf('iPad') !== -1)) {
                    var d = new enchant.Deferred();
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
                    document.addEventListener('mousedown', function waitTouch() {
                        document.removeEventListener('mousedown', waitTouch);
                        core._touched = true;
                        core.removeScene(scene);
                        core.start(d);
                    }, false);
                    core.pushScene(scene);
                    return d;
                }
            }

            this._requestNextFrame(0);

            var ret = this._requestPreload()
                .next(function() {
                    var core = enchant.Core.instance;
                    core.removeScene(core.loadingScene);
                    core.dispatchEvent(new enchant.Event(enchant.Event.LOAD));
                });

            if (deferred) {
                ret.next(function(arg) {
                    deferred.call(arg);
                })
                .error(function(arg) {
                    deferred.fail(arg);
                });
            }

            return ret;
        },
        _requestPreload: function() {
            var o = {};
            var loaded = 0,
                len = 0,
                loadFunc = function() {
                    var e = new enchant.Event('progress');
                    e.loaded = ++loaded;
                    e.total = len;
                    core.loadingScene.dispatchEvent(e);
                };
            this._assets
                .reverse()
                .forEach(function(asset) {
                    var src, name;
                    if (asset instanceof Array) {
                        src = asset[0];
                        name = asset[1];
                    } else {
                        src = name = asset;
                    }
                    if (!o[name]) {
                        o[name] = this.load(src, name, loadFunc);
                        len++;
                    }
                }, this);

            this.pushScene(this.loadingScene);
            return enchant.Deferred.parallel(o);
        },
        /**
         * Begin core debug mode.
         *
         * Core debug mode can be set to on even if enchant.Core.instance._debug
         * flag is already set to true.
         * @return {enchant.Deferred} Deferred
         */
        debug: function() {
            this._debug = true;
            return this.start();
        },
        actualFps: {
            get: function() {
                return this._actualFps || this.fps;
            }
        },
        /**
         * @private
         */
        _requestNextFrame: function(delay) {
            if (!this.ready) {
                return;
            }
            if (this.fps >= 60 || delay <= 16) {
                this._calledTime = window.getTime();
                window.requestAnimationFrame(this._callTick);
            } else {
                setTimeout(function() {
                    var core = enchant.Core.instance;
                    core._calledTime = window.getTime();
                    window.requestAnimationFrame(core._callTick);
                }, Math.max(0, delay));
            }
        },
        /**
         * @private
         */
        _callTick: function(time) {
            enchant.Core.instance._tick(time);
        },
        _tick: function(time) {
            var e = new enchant.Event('enterframe');
            var now = window.getTime();
            var elapsed = e.elapsed = now - this.currentTime;

            this._actualFps = elapsed > 0 ? (1000 / elapsed) : 0;

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
            now = window.getTime();
            this.currentTime = now;
            this._requestNextFrame(1000 / this.fps - (now - this._calledTime));
        },
        getTime: function() {
            return window.getTime();
        },
        /**
         * Stops the core.
         *
         * The frame will not be updated, and player input will not be accepted anymore.
         * Core can be restarted using {@link enchant.Core#start}.
         */
        stop: function() {
            this.ready = false;
            this.running = false;
        },
        /**
         * Stops the core.
         *
         * The frame will not be updated, and player input will not be accepted anymore.
         * Core can be started again using {@link enchant.Core#start}.
         */
        pause: function() {
            this.ready = false;
        },
        /**
         * Resumes the core.
         */
        resume: function() {
            if (this.ready) {
                return;
            }
            this.currentTime = window.getTime();
            this.ready = true;
            this.running = true;
            this._requestNextFrame(0);
        },

        /**
         * Switch to a new Scene.
         *
         * Scenes are controlled using a stack, and the display order also obeys that stack order.
         * When {@link enchant.Core#pushScene} is executed, the Scene can be brought to the top of stack.
         * Frames will be updated in the Scene which is on the top of the stack.
         *
         * @param {enchant.Scene} scene The new scene to be switched to.
         * @return {enchant.Scene} The new Scene.
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
         * Ends the current Scene, return to the previous Scene.
         *
         * Scenes are controlled using a stack, and the display order also obeys that stack order.
         * When {@link enchant.Core#popScene} is executed, the Scene at the top of the stack
         * will be removed and returned.
         *
         * @return {enchant.Scene} Ended Scene.
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
         * Overwrites the current Scene with a new Scene.
         *
         * {@link enchant.Core#popScene}, {@link enchant.Core#pushScene} are executed after
         * each other to replace to current scene with the new scene.
         *
         * @param {enchant.Scene} scene The new scene which will replace the previous scene.
         * @return {enchant.Scene} The new Scene.
         */
        replaceScene: function(scene) {
            this.popScene();
            return this.pushScene(scene);
        },
        /**
         * Removes a Scene.
         *
         * Removes a Scene from the Scene stack.
         *
         * @param {enchant.Scene} scene Scene to be removed.
         * @return {enchant.Scene} The deleted Scene.
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
         * Set a key binding.
         *
         * @param {Number} key Key code for the button which will be bound.
         * @param {String} button The enchant.js button (left, right, up, down, a, b).
         * @return {enchant.Core} this
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
            return this;
        },
        /**
         * Delete a key binding.
         *
         * @param {Number} key Key code that want to delete.
         * @return {enchant.Core} this
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

            return this;
        },
        /**
         * Get the elapsed core time (not actual) from when core.start was called.
         * @return {Number} The elapsed time (seconds)
         */
        getElapsedTime: function() {
            return this.frame / this.fps;
        }
    });

    /**
     * @static
     * @private
     * @type {Object.<String, Function>}
     */
    enchant.Core._loadFuncs = {};
    enchant.Core._loadFuncs['jpg'] =
        enchant.Core._loadFuncs['jpeg'] =
            enchant.Core._loadFuncs['gif'] =
                enchant.Core._loadFuncs['png'] =
                    enchant.Core._loadFuncs['bmp'] = function(src, ext, callback, onerror) {
                        return enchant.Surface.load(src, callback, onerror);
                    };
    enchant.Core._loadFuncs['mp3'] =
        enchant.Core._loadFuncs['aac'] =
            enchant.Core._loadFuncs['m4a'] =
                enchant.Core._loadFuncs['wav'] =
                    enchant.Core._loadFuncs['ogg'] = function(src, ext, callback, onerror) {
                        return enchant.Sound.load(src, 'audio/' + ext, callback, onerror);
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
     * The Current Core instance.
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
     * Base class for objects in the display tree which is rooted at a Scene.
     * Not to be used directly.
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
         * The age (frames) of this node which will be increased before this node receives {@link enchant.Event.ENTER_FRAME} event.
         * @type {Number}
         */
        this.age = 0;

        /**
         * Parent Node of this Node.
         * @type {enchant.Group}
         */
        this.parentNode = null;
        /**
         * Scene to which Node belongs.
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
     * Move the Node to the given target location.
     * @param {Number} x Target x coordinates.
     * @param {Number} y Target y coordinates.
     */
    moveTo: function(x, y) {
        this._x = x;
        this._y = y;
        this._dirty = true;
    },
    /**
     * Move the Node relative to its current position.
     * @param {Number} x x axis movement distance.
     * @param {Number} y y axis movement distance.
     */
    moveBy: function(x, y) {
        this._x += x;
        this._y += y;
        this._dirty = true;
    },
    /**
     * x coordinates of the Node.
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
     * y coordinates of the Node.
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
    var ret = [];
    var c;
    for (var i = 0, l = Class.collection.length; i < l; i++) {
        c = Class.collection[i];
        if (instance._intersectOne(c)) {
            ret.push(c);
        }
    }
    return ret;
};

var _intersectBetweenClassAndClass = function(Class1, Class2) {
    var ret = [];
    var c1, c2;
    for (var i = 0, l = Class1.collection.length; i < l; i++) {
        c1 = Class1.collection[i];
        for (var j = 0, ll = Class2.collection.length; j < ll; j++) {
            c2 = Class2.collection[j];
            if (c1._intersectOne(c2)) {
                ret.push([ c1, c2 ]);
            }
        }
    }
    return ret;
};

var _intersectStrictBetweenClassAndInstance = function(Class, instance) {
    var ret = [];
    var c;
    for (var i = 0, l = Class.collection.length; i < l; i++) {
        c = Class.collection[i];
        if (instance._intersectStrictOne(c)) {
            ret.push(c);
        }
    }
    return ret;
};

var _intersectStrictBetweenClassAndClass = function(Class1, Class2) {
    var ret = [];
    var c1, c2;
    for (var i = 0, l = Class1.collection.length; i < l; i++) {
        c1 = Class1.collection[i];
        for (var j = 0, ll = Class2.collection.length; j < ll; j++) {
            c2 = Class2.collection[j];
            if (c1._intersectStrictOne(c2)) {
                ret.push([ c1, c2 ]);
            }
        }
    }
    return ret;
};

var _staticIntersect = function(other) {
    if (other instanceof enchant.Entity) {
        return _intersectBetweenClassAndInstance(this, other);
    } else if (typeof other === 'function' && other.collection) {
        return _intersectBetweenClassAndClass(this, other);
    }
    return false;
};

var _staticIntersectStrict = function(other) {
    if (other instanceof enchant.Entity) {
        return _intersectStrictBetweenClassAndInstance(this, other);
    } else if (typeof other === 'function' && other.collection) {
        return _intersectStrictBetweenClassAndClass(this, other);
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
     * A class with objects displayed as DOM elements. Not to be used directly.
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
        this._debugColor = '#0000ff';
        this._opacity = 1;
        this._visible = true;
        this._buttonMode = null;

        this._style = {};
        this.__styleStatus = {};

        /**
         */
        this.compositeOperation = null;

        /**
         * Defines this Entity as a button.
         * When touched or clicked the corresponding button event is dispatched.
         * Valid buttonModes are: left, right, up, down, a, b. 
         * @type {String}
         */
        this.buttonMode = null;
        /**
         * Indicates if this Entity is being clicked.
         * Only works when {@link enchant.Entity.buttonMode} is set.
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
     * The width of the Entity.
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
     * The height of the Entity.
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
     * The Entity background color.
     * Must be provided in the same format as the CSS 'color' property.
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
     * The Entity debug color.
     * Must be provided in the same format as the CSS 'color' property.
     * @type {String}
     */
    debugColor: {
        get: function() {
            return this._debugColor;
        },
        set: function(color) {
            this._debugColor = color;
        }
    },
    /**
     * The transparency of this entity.
     * Defines the transparency level from 0 to 1
     * (0 is completely transparent, 1 is completely opaque).
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
     * Indicates whether or not to display this Entity.
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
     * Indicates whether or not this Entity can be touched.
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
     * Performs a collision detection based on whether or not the bounding rectangles are intersecting.
     * @param {*} other An object like Entity, with the properties x, y, width, height, which are used for the 
     * collision detection.
     * @return {Boolean} True, if a collision was detected.
     */
    intersect: function(other) {
        if (other instanceof enchant.Entity) {
            return this._intersectOne(other);
        } else if (typeof other === 'function' && other.collection) {
            return _intersectBetweenClassAndInstance(other, this);
        }
        return false;
    },
    _intersectOne: function(other) {
        if (this._dirty) {
            this._updateCoordinate();
        } if (other._dirty) {
            other._updateCoordinate();
        }
        return this._offsetX < other._offsetX + other.width && other._offsetX < this._offsetX + this.width &&
            this._offsetY < other._offsetY + other.height && other._offsetY < this._offsetY + this.height;
    },
    intersectStrict: function(other) {
        if (other instanceof enchant.Entity) {
            return this._intersectStrictOne(other);
        } else if (typeof other === 'function' && other.collection) {
            return _intersectStrictBetweenClassAndInstance(other, this);
        }
        return false;
    },
    _intersectStrictOne: function(other) {
        if (this._dirty) {
            this._updateCoordinate();
        } if (other._dirty) {
            other._updateCoordinate();
        }
        var rect1 = this.getOrientedBoundingRect(),
            rect2 = other.getOrientedBoundingRect(),
            lt1 = rect1.leftTop, rt1 = rect1.rightTop,
            lb1 = rect1.leftBottom, rb1 = rect1.rightBottom,
            lt2 = rect2.leftTop, rt2 = rect2.rightTop,
            lb2 = rect2.leftBottom, rb2 = rect2.rightBottom,
            ltx1 = lt1[0], lty1 = lt1[1], rtx1 = rt1[0], rty1 = rt1[1],
            lbx1 = lb1[0], lby1 = lb1[1], rbx1 = rb1[0], rby1 = rb1[1],
            ltx2 = lt2[0], lty2 = lt2[1], rtx2 = rt2[0], rty2 = rt2[1],
            lbx2 = lb2[0], lby2 = lb2[1], rbx2 = rb2[0], rby2 = rb2[1],
            t1 = [ rtx1 - ltx1, rty1 - lty1 ],
            r1 = [ rbx1 - rtx1, rby1 - rty1 ],
            b1 = [ lbx1 - rbx1, lby1 - rby1 ],
            l1 = [ ltx1 - lbx1, lty1 - lby1 ],
            t2 = [ rtx2 - ltx2, rty2 - lty2 ],
            r2 = [ rbx2 - rtx2, rby2 - rty2 ],
            b2 = [ lbx2 - rbx2, lby2 - rby2 ],
            l2 = [ ltx2 - lbx2, lty2 - lby2 ],
            cx1 = (ltx1 + rtx1 + lbx1 + rbx1) >> 2,
            cy1 = (lty1 + rty1 + lby1 + rby1) >> 2,
            cx2 = (ltx2 + rtx2 + lbx2 + rbx2) >> 2,
            cy2 = (lty2 + rty2 + lby2 + rby2) >> 2,
            i, j, poss1, poss2, dirs1, dirs2, pos1, pos2, dir1, dir2,
            px1, py1, px2, py2, dx1, dy1, dx2, dy2, vx, vy, c, c1, c2;
        if (t1[0] * (cy2 - lty1) - t1[1] * (cx2 - ltx1) > 0 &&
            r1[0] * (cy2 - rty1) - r1[1] * (cx2 - rtx1) > 0 &&
            b1[0] * (cy2 - rby1) - b1[1] * (cx2 - rbx1) > 0 &&
            l1[0] * (cy2 - lby1) - l1[1] * (cx2 - lbx1) > 0) {
            return true;
        } else if (t2[0] * (cy1 - lty2) - t2[1] * (cx1 - ltx2) > 0 &&
            r2[0] * (cy1 - rty2) - r2[1] * (cx1 - rtx2) > 0 &&
            b2[0] * (cy1 - rby2) - b2[1] * (cx1 - rbx2) > 0 &&
            l2[0] * (cy1 - lby2) - l2[1] * (cx1 - lbx2) > 0) {
            return true;
        } else {
            poss1 = [ lt1, rt1, rb1, lb1 ];
            poss2 = [ lt2, rt2, rb2, lb2 ];
            dirs1 = [ t1, r1, b1, l1 ];
            dirs2 = [ t2, r2, b2, l2 ];
            for (i = 0; i < 4; i++) {
                pos1 = poss1[i];
                px1 = pos1[0]; py1 = pos1[1];
                dir1 = dirs1[i];
                dx1 = dir1[0]; dy1 = dir1[1];
                for (j = 0; j < 4; j++) {
                    pos2 = poss2[j];
                    px2 = pos2[0]; py2 = pos2[1];
                    dir2 = dirs2[j];
                    dx2 = dir2[0]; dy2 = dir2[1];
                    c = dx1 * dy2 - dy1 * dx2;
                    if (c !== 0) {
                        vx = px2 - px1;
                        vy = py2 - py1;
                        c1 = (vx * dy1 - vy * dx1) / c;
                        c2 = (vx * dy2 - vy * dx2) / c;
                        if (0 < c1 && c1 < 1 && 0 < c2 && c2 < 1) {
                            return true;
                        }
                    }
                }
            }
            return false;
        }
    },
    /**
     * Performs a collision detection based on distance from the Entity's central point.
     * @param {*} other An object like Entity, with properties x, y, width, height, which are used for the 
     * collision detection.
     * @param {Number} [distance] The greatest distance to be considered for a collision.
     * The default distance is the average of both objects width and height.
     * @return {Boolean} True, if a collision was detected.
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
     * Enlarges or shrinks this Sprite.
     * @param {Number} x Scaling factor on the x axis.
     * @param {Number} [y] Scaling factor on the y axis.
     */
    scale: function(x, y) {
        this._scaleX *= x;
        this._scaleY *= (y != null) ? y : x;
        this._dirty = true;
    },
    /**
     * Rotate this Sprite.
     * @param {Number} deg Rotation angle (degree).
     */
    rotate: function(deg) {
        this._rotation += deg;
        this._dirty = true;
    },
    /**
     * Scaling factor on the x axis of this Sprite.
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
     * Scaling factor on the y axis of this Sprite.
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
     * Sprite rotation angle (degree).
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
     * The point of origin used for rotation and scaling.
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
     * The point of origin used for rotation and scaling.
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
    getBoundingRect: function() {
        var w = this.width || 0;
        var h = this.height || 0;
        var mat = this._matrix;
        var m11w = mat[0] * w, m12w = mat[1] * w,
            m21h = mat[2] * h, m22h = mat[3] * h,
            mdx = mat[4], mdy = mat[5];
        var xw = [ mdx, m11w + mdx, m21h + mdx, m11w + m21h + mdx ].sort(function(a, b) { return a - b; });
        var yh = [ mdy, m12w + mdy, m22h + mdy, m12w + m22h + mdy ].sort(function(a, b) { return a - b; });

        return {
            left: xw[0],
            top: yh[0],
            width: xw[3] - xw[0],
            height: yh[3] - yh[0]
        };
    },
    getOrientedBoundingRect: function() {
        var w = this.width || 0;
        var h = this.height || 0;
        var mat = this._matrix;
        var m11w = mat[0] * w, m12w = mat[1] * w,
            m21h = mat[2] * h, m22h = mat[3] * h,
            mdx = mat[4], mdy = mat[5];

        return {
            leftTop: [ mdx, mdy ],
            rightTop: [ m11w + mdx, m12w + mdy ],
            leftBottom: [ m21h + mdx, m22h + mdy ],
            rightBottom: [ m11w + m21h + mdx, m12w + m22h + mdy ]
        };
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
    Constructor.intersect = _staticIntersect;
    Constructor.intersectStrict = _staticIntersectStrict;
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
     * Class which can display images.
     * 
     * @param {Number} [width] Sprite width.
     * @param {Number} [height] Sprite height.
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
        this._debugColor = '#ff0000';
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
     * Image displayed in the Sprite.
     * @type {enchant.Surface}
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
            this._setFrame(this._frame);
        }
    },
    /**
     * Indizes of the frames to be displayed.
     * Frames with same width and height as Sprite will be arrayed from upper left corner of the 
     * {@link enchant.Sprite#image} image. When a sequence of numbers is provided, the displayed frame 
     * will switch automatically. At the end of the array the sequence will restart. By setting 
     * a value within the sequence to null, the frame switching is stopped.
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
            this._setFrame(this._frame);
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
            this._setFrame(this._frame);
            this._dirty = true;
        }
    },
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
                sw = Math.min(iw - sx, w);
                sh = Math.min(ih - sy, h);
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

/**
 * @scope enchant.Label.prototype
 */
enchant.Label = enchant.Class.create(enchant.Entity, {
    /**
     * @name enchant.Label
     * @class
     * A class for Label object.
     * @constructs
     * @extends enchant.Entity
     */
    initialize: function(text) {
        enchant.Entity.call(this);

        this.text = text || '';
        this.width = 300;
        this.font = '14px serif';
        this.textAlign = 'left';

        this._debugColor = '#ff0000';
    },
    width: {
        get: function() {
            return this._width;
        },
        set: function(width) {
            this._width = width;
            this._dirty = true;
            // issue #164
            this.updateBoundArea();
        }
    },
    /**
     * Text to be displayed.
     * @type {String}
     */
    text: {
        get: function() {
            return this._text;
        },
        set: function(text) {
            text = '' + text;
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
     * Specifies horizontal alignment of text.
     * Can be set according to the format of the CSS 'text-align' property.
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
     * Font settings.
     * Can be set according to the format of the CSS 'font' property.
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
     * Text color settings.
     * Can be set according to the format of the CSS 'color' property.
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
        var labelWidth = this.width;
        var charWidth, amount, line, text, c, buf, increase, length;
        var bufWidth;
        if (this._splitText) {
            ctx.textBaseline = 'top';
            ctx.font = this.font;
            ctx.fillStyle = this.color || '#000000';
            charWidth = ctx.measureText(' ').width;
            amount = labelWidth / charWidth;
            for (var i = 0, l = this._splitText.length; i < l; i++) {
                line = this._splitText[i];
                text = line.text;
                c = 0;
                while (text.length > c + amount || ctx.measureText(text.slice(c, c + amount)).width > labelWidth) {
                    buf = '';
                    increase = amount;
                    length = 0;
                    while (increase > 0) {
                        if (ctx.measureText(buf).width < labelWidth) {
                            length += increase;
                            buf = text.slice(c, c + length);
                        } else {
                            length -= increase;
                            buf = text.slice(c, c + length);
                        }
                        increase = increase / 2 | 0;
                    }
                    ctx.fillText(buf, 0, y);
                    y += line.height - 1;
                    c += length;
                }
                buf = text.slice(c, c + text.length);
                if (this.textAlign === 'right') {
                    x = labelWidth - ctx.measureText(buf).width;
                } else if (this.textAlign === 'center') {
                    x = (labelWidth - ctx.measureText(buf).width) / 2;
                } else {
                    x = 0;
                }
                ctx.fillText(buf, x, y);
                y += line.height - 1;
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
    },
    getMetrics: function(text) {
        var ret = {};
        var div, width, height;
        if (document.body) {
            div = document.createElement('div');
            for (var prop in this._style) {
                if(prop !== 'width' && prop !== 'height') {
                    div.style[prop] = this._style[prop];
                }
            }
            text = text || this._text;
            div.innerHTML = text.replace(/ /g, '&nbsp;');
            div.style.whiteSpace = 'noWrap';
            div.style.lineHeight = 1;
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
    }
});

/**
 * @scope enchant.Map.prototype
 */
enchant.Map = enchant.Class.create(enchant.Entity, {
    /**
     * @name enchant.Map
     * @class
     * A class to create and display maps from a tile set.
     *
     * @param {Number} tileWidth Tile width.
     * @param {Number} tileHeight Tile height.
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
         * Two dimensional array to store if collision detection should be performed for a tile.
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
     * Set map data.
     * Sets the tile data, whereas the data (two-dimensional array with indizes starting from 0) 
     * is mapped on the image starting from the upper left corner.
     * When more than one map data array is set, they are displayed in reverse order.
     * @param {...Array<Array.<Number>>} data Two-dimensional array of tile indizes. Multiple designations possible.
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
     * Checks what tile is present at the given position.
     * @param {Number} x x coordinates of the point on the map.
     * @param {Number} y y coordinates of the point on the map.
     * @return {*} The tile data for the given position.
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
     * Judges whether or not obstacles are on top of Map.
     * @param {Number} x x coordinates of detection spot on map.
     * @param {Number} y y coordinates of detection spot on map.
     * @return {Boolean} True, if there are obstacles.
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
     * Image with which the tile set is displayed on the map.
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
     * Map tile width.
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
     * Map tile height.
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
     * A class that can hold multiple {@link enchant.Node}.
     *
     * @example
     *   var stage = new Group();
     *   stage.addChild(player);
     *   stage.addChild(enemy);
     *   stage.addChild(map);
     *   stage.addEventListener('enterframe', function() {
     *      // Moves the entire frame in according to the player's coordinates.
     *      if (this.x > 64 - player.x) {
     *          this.x = 64 - player.x;
     *      }
     *   });
     * @constructs
     * @extends enchant.Node
     */
    initialize: function() {
        /**
         * Child Nodes.
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
     * Adds a Node to the Group.
     * @param {enchant.Node} node Node to be added.
     */
    addChild: function(node) {
        if (node.parentNode) {
            node.parentNode.removeChild(node);
        }
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
     * Incorporates Node into Group.
     * @param {enchant.Node} node Node to be incorporated.
     * @param {enchant.Node} reference Node in position before insertion.
     */
    insertBefore: function(node, reference) {
        if (node.parentNode) {
            node.parentNode.removeChild(node);
        }
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
     * Remove a Node from the Group.
     * @param {enchant.Node} node Node to be deleted.
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
     * The Node which is the first child.
     * @type {enchant.Node}
     */
    firstChild: {
        get: function() {
            return this.childNodes[0];
        }
    },
    /**
     * The Node which is the last child.
     * @type {enchant.Node}
     */
    lastChild: {
        get: function() {
            return this.childNodes[this.childNodes.length - 1];
        }
    },
    /**
    * Group rotation angle (degree).
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
    * Scaling factor on the x axis of the Group.
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
    * Scaling factor on the y axis of the Group.
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
    * origin point of rotation, scaling
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
    * origin point of rotation, scaling
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
                if (nextElement) {
                    this.element.insertBefore(child, nextElement);
                } else {
                    this.element.appendChild(child);
                }
            }, this);
        } else {
            if (nextElement) {
                this.element.insertBefore(element, nextElement);
            } else {
                this.element.appendChild(element);
            }
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
        if (node._dirty) {
            this.style[enchant.ENV.VENDOR_PREFIX + 'Transform'] = 'matrix(' +
                dest[0].toFixed(10) + ',' +
                dest[1].toFixed(10) + ',' +
                dest[2].toFixed(10) + ',' +
                dest[3].toFixed(10) + ',' +
                dest[4].toFixed(10) + ',' +
                dest[5].toFixed(10) +
            ')';
        }
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
        if (node.width !== null) {
            node._style.width = node.width + 'px';
        }
        if (node.height !== null) {
            node._style.height = node.height + 'px';
        }
        node._style.opacity = node._opacity;
        node._style['background-color'] = node._backgroundColor;
        if (typeof node._visible !== 'undefined') {
            node._style.display = node._visible ? 'block' : 'none';
        }
        if (typeof node.domRender === 'function') {
            node.domRender(this.element);
        }
        var value;
        for (var prop in node._style) {
            value = node._style[prop];
            if(node.__styleStatus[prop] !== value && value != null) {
                this.style.setProperty(prop, '' + value);
                node.__styleStatus[prop] = value;
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

        this._touchEventTarget = null;

        this._element = document.createElement('div');
        this._element.style.position = 'absolute';

        this._domManager = new enchant.DomManager(this, this._element);
        this._domManager.layer = this;

        this.width = core.width;
        this.height = core.height;

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
    width: {
        get: function() {
            return this._width;
        },
        set: function(width) {
            this._width = width;
            this._element.style.width = width + 'px';
        }
    },
    height: {
        get: function() {
            return this._height;
        },
        set: function(height) {
            this._height = height;
            this._element.style.height = height + 'px';
        }
    },
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
        var target = this._touchEventTarget;
        this._touchEventTarget = null;
        return (target === this) ? null : target;
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
     * A class which is using HTML Canvas for the rendering.
     * The rendering of children will be replaced by the Canvas rendering.
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

        this._element = document.createElement('canvas');
        this._element.style.position = 'absolute';
        // issue 179
        this._element.style.left = this._element.style.top = '0px';

        this._detect = document.createElement('canvas');
        this._detect.style.position = 'absolute';
        this._lastDetected = 0;

        this.context = this._element.getContext('2d');
        this._dctx = this._detect.getContext('2d');

        this._colorManager = new enchant.DetectColorManager(16, 256);

        this.width = core.width;
        this.height = core.height;

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
            enchant.CanvasRenderer.instance.render(layer.context, child, render);
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
    width: {
        get: function() {
            return this._width;
        },
        set: function(width) {
            this._width = width;
            this._element.width = this._detect.width = width;
        }
    },
    height: {
        get: function() {
            return this._height;
        },
        set: function(height) {
            this._height = height;
            this._element.height = this._detect.height = height;
        }
    },
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
        enchant.CanvasRenderer.instance.render(ctx, this, render);
    },
    _determineEventTarget: function(e) {
        return this._getEntityByPosition(e.x, e.y);
    },
    _getEntityByPosition: function(x, y) {
        var core = enchant.Core.instance;
        var ctx = this._dctx;
        if (this._lastDetected < core.frame) {
            ctx.clearRect(0, 0, this.width, this.height);
            enchant.CanvasRenderer.instance.detectRender(ctx, this);
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

enchant.CanvasRenderer = enchant.Class.create({
    render: function(ctx, node, e) {
        var width, height, child;
        ctx.save();
        node.dispatchEvent(e);
        // transform
        this.transform(ctx, node);
        if (typeof node._visible === 'undefined' || node._visible) {
            width = node.width;
            height = node.height;
            // composite
            if (node.compositeOperation) {
                ctx.globalCompositeOperation = node.compositeOperation;
            }
            ctx.globalAlpha = (typeof node._opacity === 'number') ? node._opacity : 1.0;
            // render
            if (node._backgroundColor) {
                ctx.fillStyle = node._backgroundColor;
                ctx.fillRect(0, 0, width, height);
            }

            if (node.cvsRender) {
                node.cvsRender(ctx);
            }

            if (enchant.Core.instance._debug && node._debugColor) {
                ctx.strokeStyle = node._debugColor;
                ctx.strokeRect(0, 0, width, height);
            }
            if (node._clipping) {
                ctx.beginPath();
                ctx.rect(0, 0, width, height);
                ctx.clip();
            }
            if (node.childNodes) {
                for (var i = 0, l = node.childNodes.length; i < l; i++) {
                    child = node.childNodes[i];
                    this.render(ctx, child, e);
                }
            }
        }
        ctx.restore();
        enchant.Matrix.instance.stack.pop();
    },
    detectRender: function(ctx, node) {
        var width, height, child;
        if (typeof node._visible === 'undefined' || node._visible) {
            width = node.width;
            height = node.height;
            ctx.save();
            this.transform(ctx, node);
            ctx.fillStyle = node._cvsCache.detectColor;
            if (node._touchEnabled) {
                if (node.detectRender) {
                    node.detectRender(ctx);
                } else {
                    ctx.fillRect(0, 0, width, height);
                }
            }
            if (node._clipping) {
                ctx.beginPath();
                ctx.rect(0, 0, width, height);
                ctx.clip();
            }
            if (node.childNodes) {
                for (var i = 0, l = node.childNodes.length; i < l; i++) {
                    child = node.childNodes[i];
                    this.detectRender(ctx, child);
                }
            }
            ctx.restore();
            enchant.Matrix.instance.stack.pop();
        }
    },
    transform: function(ctx, node) {
        var matrix = enchant.Matrix.instance;
        var stack = matrix.stack;
        var newmat, ox, oy, vec;
        if (node._dirty) {
            matrix.makeTransformMatrix(node, node._cvsCache.matrix);
            newmat = [];
            matrix.multiply(stack[stack.length - 1], node._cvsCache.matrix, newmat);
            node._matrix = newmat;
            ox = (typeof node._originX === 'number') ? node._originX : node._width / 2 || 0;
            oy = (typeof node._originY === 'number') ? node._originY : node._height / 2 || 0;
            vec = [ ox, oy ];
            matrix.multiplyVec(newmat, vec, vec);
            node._offsetX = vec[0] - ox;
            node._offsetY = vec[1] - oy;
            node._dirty = false;
        } else {
            newmat = node._matrix;
        }
        stack.push(newmat);
        ctx.setTransform.apply(ctx, newmat);
    }
});
enchant.CanvasRenderer.instance = new enchant.CanvasRenderer();

/**
 * @scope enchant.Scene.prototype
 * @type {*}
 */
enchant.Scene = enchant.Class.create(enchant.Group, {
    /**
     * @name enchant.Scene
     * @class
     * A Class that becomes the root of the display object tree.
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

        // All nodes (entities, groups, scenes) have reference to the scene that it belongs to.
        this.scene = this;

        this._backgroundColor = null;

        // Create div tag which possesses its layers
        this._element = document.createElement('div');
        this._element.style.position = 'absolute';
        this._element.style.overflow = 'hidden';
        this._element.style[enchant.ENV.VENDOR_PREFIX + 'TransformOrigin'] = '0 0';

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

        this.addEventListener(enchant.Event.CORE_RESIZE, this._oncoreresize);

        this._oncoreresize(core);
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
    width: {
        get: function() {
            return this._width;
        },
        set: function(width) {
            this._width = width;
            for (var type in this._layers) {
                this._layers[type].width = width;
            }
        }
    },
    height: {
        get: function() {
            return this._height;
        },
        set: function(height) {
            this._height = height;
            for (var type in this._layers) {
                this._layers[type].height = height;
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
    _oncoreresize: function(e) {
        this._element.style.width = e.width + 'px';
        this.width = e.width;
        this._element.style.height = e.height + 'px';
        this.height = e.height;
        this._element.style[enchant.ENV.VENDOR_PREFIX + 'Transform'] = 'scale(' + e.scale + ')';

        for (var type in this._layers) {
            this._layers[type].dispatchEvent(e);
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
            if (nextSibling) {
                this._element.insertBefore(element, nextSibling);
            } else {
                this._element.appendChild(element);
            }
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
        var target, i;
        if (child._element) {
            target = 'Dom';
            i = 1;
        } else {
            target = 'Canvas';
            i = 0;
        }
        if (!this._layers[target]) {
            this.addLayer(target, i);
        }
        child._layer = this._layers[target];
        this._layers[target].insertBefore(child, next);
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
 * @scope enchant.LoadingScene.prototype
 */
enchant.LoadingScene = enchant.Class.create(enchant.Scene, {
    /**
     * @name enchant.LoadingScene.
     * @class
     * @constructs
     * @extends enchant.Scene
     */
    initialize: function() {
        enchant.Scene.call(this);
        this.backgroundColor = '#000';
        var barWidth = this.width * 0.4 | 0;
        var barHeight = this.width * 0.05 | 0;
        var border = barWidth * 0.03 | 0;
        var bar = new enchant.Sprite(barWidth, barHeight);
        bar.disableCollection();
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
            // avoid #167 https://github.com/wise9/enchant.js/issues/177
            progress = e.loaded / e.total * 1.0;
        });
        bar.addEventListener('enterframe', function() {
            _progress *= 0.9;
            _progress += progress * 0.1;
            image.context.fillStyle = '#fff';
            image.context.fillRect(border, 0, (barWidth - border * 2) * _progress, barHeight);
        });
        this.addChild(bar);
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
        child._layer = this._layers.Canvas;
        this._layers.Canvas.insertBefore(child, next);
    },
    _onenter: function() {
        this._layers.Canvas._startRendering();
        enchant.Core.instance.addEventListener('exitframe', this._dispatchExitframe);
    },
    _onexit: function() {
        this._layers.Canvas._stopRendering();
        enchant.Core.instance.removeEventListener('exitframe', this._dispatchExitframe);
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
        child._layer = this._layers.Dom;
        this._layers.Dom.insertBefore(child, next);
    },
    _onenter: function() {
        this._layers.Dom._startRendering();
        enchant.Core.instance.addEventListener('exitframe', this._dispatchExitframe);
    },
    _onexit: function() {
        this._layers.Dom._stopRendering();
        enchant.Core.instance.removeEventListener('exitframe', this._dispatchExitframe);
    }
});

/**
 * @scope enchant.Surface.prototype
 */
enchant.Surface = enchant.Class.create(enchant.EventTarget, {
    /**
     * @name enchant.Surface
     * @class
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
     * @constructs
     */
    initialize: function(width, height) {
        enchant.EventTarget.call(this);

        var core = enchant.Core.instance;

        /**
         * Surface width.
         * @type {Number}
         */
        this.width = width;
        /**
         * Surface height.
         * @type {Number}
         */
        this.height = height;
        /**
         * Surface drawing context.
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
     * Returns 1 pixel from the Surface.
     * @param {Number} x The pixel's x coordinates.
     * @param {Number} y The pixel's y coordinates.
     * @return {Array.<Number>} An array that holds pixel information in [r, g, b, a] format.
     */
    getPixel: function(x, y) {
        return this.context.getImageData(x, y, 1, 1).data;
    },
    /**
     * Sets one pixel within the surface.
     * @param {Number} x The pixel's x coordinates.
     * @param {Number} y The pixel's y coordinates.
     * @param {Number} r The pixel's red level.
     * @param {Number} g The pixel's green level.
     * @param {Number} b The pixel's blue level.
     * @param {Number} a The pixel's transparency.
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
     * Clears all Surface pixels and makes the pixels transparent.
     */
    clear: function() {
        this.context.clearRect(0, 0, this.width, this.height);
    },
    /**
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
     * Copies Surface.
     * @return {enchant.Surface} The copied Surface.
     */
    clone: function() {
        var clone = new enchant.Surface(this.width, this.height);
        clone.draw(this);
        return clone;
    },
    /**
     * Creates a data URI scheme from this Surface.
     * @return {String} The data URI scheme that identifies this Surface and
     * can be used to include this Surface into a dom tree.
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
        enchant.Core.instance.dispatchEvent(e);
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

if (window.Deferred) {
    enchant.Deferred = window.Deferred;
} else {
    enchant.Deferred = enchant.Class.create({
        initialize: function() {
            this._succ = this._fail = this._next = this._id = null;
            this._tail = this;
        },
        next: function(func) {
            var q = new enchant.Deferred();
            q._succ = func;
            return this._add(q);
        },
        error: function(func) {
            var q = new enchant.Deferred();
            q._fail = func;
            return this._add(q);
        },
        _add: function(queue) {
            this._tail._next = queue;
            this._tail = queue;
            return this;
        },
        call: function(arg) {
            var received;
            var queue = this;
            while (queue && !queue._succ) {
                queue = queue._next;
            }
            if (!(queue instanceof enchant.Deferred)) {
                return;
            }
            try {
                received = queue._succ(arg);
            } catch (e) {
                return queue.fail(e);
            }
            if (received instanceof enchant.Deferred) {
                enchant.Deferred._insert(queue, received);
            } else if (queue._next instanceof enchant.Deferred) {
                queue._next.call(received);
            }
        },
        fail: function(arg) {
            var result, err,
                queue = this;
            while (queue && !queue._fail) {
                queue = queue._next;
            }
            if (queue instanceof enchant.Deferred) {
                result = queue._fail(arg);
                queue.call(result);
            } else if (arg instanceof Error) {
                throw arg;
            } else {
                err = new Error('failed in Deferred');
                err.arg = arg;
                throw err;
            }
        }
    });
    enchant.Deferred._insert = function(queue, ins) {
        if (queue._next instanceof enchant.Deferred) {
            ins._next = queue._next;
        }
        queue._next = ins;
    };
    enchant.Deferred.next = function(func) {
        var q = new enchant.Deferred().next(func);
        q._id = setTimeout(function() { q.call(); }, 0);
        return q;
    };
    enchant.Deferred.parallel = function(arg) {
        var q = new enchant.Deferred();
        q._id = setTimeout(function() { q.call(); }, 0);
        var progress = 0;
        var ret = (arg instanceof Array) ? [] : {};
        var p = new enchant.Deferred();
        for (var prop in arg) {
            if (arg.hasOwnProperty(prop)) {
                progress++;
                /*jshint loopfunc:true */
                (function(queue, name) {
                    queue.next(function(arg) {
                        progress--;
                        ret[name] = arg;
                        if (progress <= 0) {
                            p.call(ret);
                        }
                    })
                    .error(function(err) { p.fail(err); });
                    if (typeof queue._id === 'number') {
                        clearTimeout(queue._id);
                    }
                    queue._id = setTimeout(function() { queue.call(); }, 0);
                }(arg[prop], prop));
            }
        }
        if (!progress) {
            p._id = setTimeout(function() { p.call(ret); }, 0);
        }
        return q.next(function() { return p; });
    };
}

/**
 * @scope enchant.DOMSound.prototype
 * @type {*}
 */
enchant.DOMSound = enchant.Class.create(enchant.EventTarget, {
    /**
     * @name enchant.DOMSound
     * @class
     * Class to wrap audio elements.
     *
     * Safari, Chrome, Firefox, Opera, and IE all play MP3 files
     * (Firefox and Opera play via Flash). WAVE files can be played on
     * Safari, Chrome, Firefox, and Opera. When the browser is not compatible with
     * the used codec the file will not play.
     *
     * Instances are created not via constructor but via {@link enchant.DOMSound.load}.
     * @constructs
     */
    initialize: function() {
        enchant.EventTarget.call(this);
        /**
         * Sound file duration (seconds).
         * @type {Number}
         */
        this.duration = 0;
        throw new Error("Illegal Constructor");
    },
    /**
     * Begin playing.
     */
    play: function() {
        if (this._element) {
            this._element.play();
        }
    },
    /**
     * Pause playback.
     */
    pause: function() {
        if (this._element) {
            this._element.pause();
        }
    },
    /**
     * Stop playing.
     */
    stop: function() {
        this.pause();
        this.currentTime = 0;
    },
    /**
     * Create a copy of this Sound object.
     * @return {enchant.DOMSound} Copied Sound.
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
     * Current playback position (seconds).
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
     * Volume. 0 (muted) ～ 1 (full volume).
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
 * Loads an audio file and creates Sound object.
 *
 * @param {String} src Path of the audio file to be loaded.
 * @param {String} [type] MIME Type of the audio file.
 * @param {Function} callback on load callback.
 * @param {Function} [onerror] on error callback.
 * @return {enchant.DOMSound} DOMSound
 * @static
 */
enchant.DOMSound.load = function(src, type, callback, onerror) {
    if (type == null) {
        var ext = enchant.Core.findExt(src);
        if (ext) {
            type = 'audio/' + ext;
        } else {
            type = '';
        }
    }
    type = type.replace('mp3', 'mpeg').replace('m4a', 'mp4');
    onerror = onerror || function() {};

    var sound = Object.create(enchant.DOMSound.prototype);
    enchant.EventTarget.call(sound);
    sound.addEventListener('load', callback);
    sound.addEventListener('error', onerror);
    var audio = new Audio();
    if (!enchant.ENV.SOUND_ENABLED_ON_MOBILE_SAFARI &&
        enchant.ENV.VENDOR_PREFIX === 'webkit' && enchant.ENV.TOUCH_ENABLED) {
        window.setTimeout(function() {
            sound.dispatchEvent(new enchant.Event('load'));
        }, 0);
    } else {
        if (!enchant.ENV.USE_FLASH_SOUND && audio.canPlayType(type)) {
            audio.addEventListener('canplaythrough', function() {
                sound.duration = audio.duration;
                sound.dispatchEvent(new enchant.Event('load'));
            }, false);
            audio.src = src;
            audio.load();
            audio.autoplay = false;
            audio.onerror = function() {
                var e = new enchant.Event(enchant.Event.ERROR);
                e.message = 'Cannot load an asset: ' + audio.src;
                enchant.Core.instance.dispatchEvent(e);
                sound.dispatchEvent(e);
            };
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

enchant.WebAudioSound.load = function(src, type, callback, onerror) {
    var canPlay = (new Audio()).canPlayType(type);
    var sound = new enchant.WebAudioSound();
    onerror = onerror || function() {};
    sound.addEventListener(enchant.Event.LOAD, callback);
    sound.addEventListener(enchant.Event.ERROR, onerror);
    var e = new enchant.Event(enchant.Event.ERROR);
    e.message = 'Cannot load an asset: ' + src;
    var actx, xhr;
    if (canPlay === 'maybe' || canPlay === 'probably') {
        actx = enchant.WebAudioSound.audioContext;
        xhr = new XMLHttpRequest();
        xhr.responseType = 'arraybuffer';
        xhr.open('GET', src, true);
        xhr.onload = function() {
            actx.decodeAudioData(
                xhr.response,
                function(buffer) {
                    sound.buffer = buffer;
                    sound.dispatchEvent(new enchant.Event(enchant.Event.LOAD));
                },
                function(error) {
                    enchant.Core.instance.dispatchEvent(e);
                    sound.dispatchEvent(e);
                }
            );
        };
        xhr.send(null);
    } else {
        setTimeout(function() {
            sound.dispatchEvent(e);
        }, 50);
    }
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
     * EventTarget which can change the context of event listeners
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
     * Time-line class.
     * Class for managing the action.
     * For one node to manipulate the timeline of one must correspond.
     *
          * Reading a tl.enchant.js, all classes (Group, Scene, Entity, Label, Sprite) of the Node class that inherits
          * Tlthe property, an instance of the Timeline class is generated.
          * Time-line class has a method to add a variety of actions to himself,
          * entities can be animated and various operations by using these briefly.
          * You can choose time based and frame based(default) animation.
     *
     * @param node target node
     * @param [unitialized] if this param is true, when add method called in the first time,
     * enchant.Event.ENTER_FRAME event listener will be added to node (for reducing unused event listeners)
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
     * Action class.
     * Actions are units that make up the time line,
     * It is a unit used to specify the action you want to perform.
     * Action has been added to the time line is performed in order.
     *
     * Actionstart, actiontick event is fired when the action is started and stopped,
     * When one frame has elapsed actiontick event is also issued.
     * Specify the action you want to perform as a listener for these events.
     * The transition to the next action automatically the number of frames that are specified in the time has elapsed.
     *
     * @constructs
     * @param param
     * @config {integer} [time] The number of frames that will last action. infinite length is specified null
     * @config {function} [onactionstart] Event listener for when the action is initiated
     * @config {function} [onactiontick] Event listener for when the action has passed one frame
     * @config {function} [onactionend] Event listener for when the action is finished
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
         * Children Actions
         */
        this.actions = [];
        /**
         * Removed actions
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
