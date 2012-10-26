/**
 * enchant.js v0.6-pre
 *
 * Copyright (c) Ubiquitous Entertainment Inc.
 * Dual licensed under the MIT or GPL Version 3 licenses
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NON-INFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
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
        if (descs != null){
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
        for (var prop in module){
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

    if (modules != null && modules.length) {
        throw new Error('Cannot load module: ' + modules.join(', '));
    }
};

window.addEventListener("message", function(msg, origin) {
    try {
        var data = JSON.parse(msg.data);
        if (data.type === "event") {
            enchant.Game.instance.dispatchEvent(new enchant.Event(data.value));
        } else if (data.type === "debug") {
            switch (data.value) {
                case "start":
                    enchant.Game.instance.start();
                    break;
                case "pause":
                    enchant.Game.instance.pause();
                    break;
                case "resume":
                    enchant.Game.instance.resume();
                    break;
                case "tick":
                    enchant.Game.instance._tick();
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
 *          this.image = game.assets['ball.gif'];
 *       }
 *   });
 *
 * @param {Function} [superclass] The class from which the
 * new class will inherit the class definition.
 * @param {*} [definition] Class definition.
 * @static
 */
enchant.Class.create = function(superclass, definition) {
    if (superclass == null){
        throw new Error("superclass is undefined");
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
 * Get the inheritance tree of this class.
 * @param {ConstructorFunction}
    * @param {...ConstructorFunction}
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
 * Environment variable.
 * @type {Object}
 */
enchant.ENV = {
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
     * Will Use Flash instead of native Audio class?
     * @type {String}
     */
    USE_FLASH_SOUND: (function() {
        var ua = navigator.userAgent;
        var vendor = navigator.vendor || "";
        // ローカルではなく、モバイル端末向けでもなく、Safariでもない場合 (デフォルト)
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
    SOUND_ENABLED_IN_MOBILE_SAFARI: false,
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
        var game = enchant.Game.instance;
        this.x = this.localX = (pageX - game._pageX) / game.scale;
        this.y = this.localY = (pageY - game._pageY) / game.scale;
    }
});

/**
 * An event dispatched upon completion of game loading.
 *
 * It is necessary to wait for loading to finish and to do initial processing when preloading images.
 * Issued object: {@link enchant.Game}
 *
 * @example
 *   var game = new Game(320, 320);
 *   game.preload('player.gif');
 *   game.onload = function() {
 *      ... // Describes initial game processing
 *   };
 *   game.start();
 *
 * @type {String}
 */
enchant.Event.LOAD = 'load';

/**
 * Events which are occurring during game loading.
 * Dispatched each time preloaded image is loaded. Issued object: {@link enchant.Game}
 * @type {String}
 */
enchant.Event.PROGRESS = 'progress';

/**
 * An event which is occurring when a new frame is beeing processed.
 * Issued object: {@link enchant.Game}, {@link enchant.Node}
 * @type {String}
 */
enchant.Event.ENTER_FRAME = 'enterframe';

/**
 * An event which is occurring when the frame processing is about to end.
 * Issued object: {@link enchant.Game}
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
 * Issued object: {@link enchant.Game}, {@link enchant.Scene}
 * @type {String}
 */
enchant.Event.INPUT_START = 'inputstart';

/**
 * An event which is occurring when a button input changes.
 * Issued object: {@link enchant.Game}, {@link enchant.Scene}
 * @type {String}
 */
enchant.Event.INPUT_CHANGE = 'inputchange';

/**
 * An event which is occurring when a button input ends.
 * Issued object: {@link enchant.Game}, {@link enchant.Scene}
 * @type {String}
 */
enchant.Event.INPUT_END = 'inputend';

/**
 * An event which is occurring when the left button is pressed.
 * Issued object: {@link enchant.Game}, {@link enchant.Scene}
 * @type {String}
 */
enchant.Event.LEFT_BUTTON_DOWN = 'leftbuttondown';

/**
 * An event which is occurring when the left button is released.
 * Issued object: {@link enchant.Game}, {@link enchant.Scene}
 * @type {String}
 */
enchant.Event.LEFT_BUTTON_UP = 'leftbuttonup';

/**
 * An event which is occurring when the right button is pressed.
 * Issued object: {@link enchant.Game}, {@link enchant.Scene}
 * @type {String}
 */
enchant.Event.RIGHT_BUTTON_DOWN = 'rightbuttondown';

/**
 * An event which is occurring when the right button is released.
 * Issued object: {@link enchant.Game}, {@link enchant.Scene}
 * @type {String}
 */
enchant.Event.RIGHT_BUTTON_UP = 'rightbuttonup';

/**
 * An event which is occurring when the up button is pressed.
 * Issued object: {@link enchant.Game}, {@link enchant.Scene}
 * @type {String}
 */
enchant.Event.UP_BUTTON_DOWN = 'upbuttondown';

/**
 * An event which is occurring when the up button is released.
 * Issued object: {@link enchant.Game}, {@link enchant.Scene}
 * @type {String}
 */
enchant.Event.UP_BUTTON_UP = 'upbuttonup';

/**
 * An event which is occurring when the down button is pressed.
 * Issued object: {@link enchant.Game}, {@link enchant.Scene}
 * @type {String}
 */
enchant.Event.DOWN_BUTTON_DOWN = 'downbuttondown';

/**
 * An event which is occurring when the down button is released.
 * Issued object: {@link enchant.Game}, {@link enchant.Scene}
 * @type {String}
 */
enchant.Event.DOWN_BUTTON_UP = 'downbuttonup';

/**
 * An event which is occurring when the a button is pressed.
 * Issued object: {@link enchant.Game}, {@link enchant.Scene}
 * @type {String}
 */
enchant.Event.A_BUTTON_DOWN = 'abuttondown';

/**
 * An event which is occurring when the a button is released.
 * Issued object: {@link enchant.Game}, {@link enchant.Scene}
 * @type {String}
 */
enchant.Event.A_BUTTON_UP = 'abuttonup';

/**
 * An event which is occurring when the b button is pressed.
 * Issued object: {@link enchant.Game}, {@link enchant.Scene}
 * @type {String}
 */
enchant.Event.B_BUTTON_DOWN = 'bbuttondown';

/**
 * An event which is occurring when the b button is released.
 * Issued object: {@link enchant.Game}, {@link enchant.Scene}
 * @type {String}
 */
enchant.Event.B_BUTTON_UP = 'bbuttonup';

/**
 * @scope enchant.EventTarget.prototype
 */
enchant.EventTarget = enchant.Class.create({
    /**
     * A class for an independent implementation of events
     * similar to DOM Events.
     * However, it does not include the phase concept.
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
 * @scope enchant.Game.prototype
 */
(function() {
    var game;

    /**
     * @scope enchant.Game.prototype
     */
    enchant.Game = enchant.Class.create(enchant.EventTarget, {
        /**
         * A class which is controlling the games main loop and scenes.
         *
         * There can be only one instance at a time, when the constructor is executed
         * with an instance present, the existing instance will be overwritten. The existing instance
         * can be accessed from {@link enchant.Game.instance}.
         *
         * @param {Number} width The width of the game screen.
         * @param {Number} height The height of the game screen.
         * @constructs
         * @extends enchant.EventTarget
         */
        initialize: function(width, height) {
            if (window.document.body === null) {
                throw new Error("document.body is null. Please excute 'new Game()' in window.onload.");
            }

            enchant.EventTarget.call(this);
            var initial = true;
            if (game) {
                initial = false;
                game.stop();
            }
            game = enchant.Game.instance = this;

            /**
             * The width of the game screen.
             * @type {Number}
             */
            this.width = width || 320;
            /**
             * The height of the game screen.
             * @type {Number}
             */
            this.height = height || 320;
            /**
             * The scaling of the game rendering.
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
                this._pageX = Math.round(window.scrollX + bounding.left);
                this._pageY = Math.round(window.scrollY + bounding.top);
            }
            if (!this.scale) {
                this.scale = 1;
            }
            stage.style.fontSize = '12px';
            stage.style.webkitTextSizeAdjust = 'none';
            this._element = stage;

            /**
             * The frame rate of the game.
             * @type {Number}
             */
            this.fps = 30;
            /**
             * The amount of frames since the game was started.
             * @type {Number}
             */
            this.frame = 0;
            /**
             * Indicates if the game can be executed.
             * @type {Boolean}
             */
            this.ready = null;
            /**
             * Indicates if the game is currently executed.
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
            this._intervalID = null;

            this._offsetX = 0;
            this._offsetY = 0;

            /**
             * Object that saves the current input state for the game.
             * @type {Object.<String, Boolean>}
             */
            this.input = {};
            this._keybind = enchant.ENV.KEY_BIND_TABLE || {};

            var c = 0;
            ['left', 'right', 'up', 'down', 'a', 'b'].forEach(function(type) {
                this.addEventListener(type + 'buttondown', function(e) {
                    var inputEvent;
                    if (!this.input[type]) {
                        this.input[type] = true;
                        inputEvent = new enchant.Event((c++) ? 'inputchange' : 'inputstart');
                        this.dispatchEvent(inputEvent);
                    }
                    this.currentScene.dispatchEvent(e);
                    if (inputEvent) {
                        this.currentScene.dispatchEvent(inputEvent);
                    }
                });
                this.addEventListener(type + 'buttonup', function(e) {
                    var inputEvent;
                    if (this.input[type]) {
                        this.input[type] = false;
                        inputEvent = new enchant.Event((--c) ? 'inputchange' : 'inputend');
                        this.dispatchEvent(inputEvent);
                    }
                    this.currentScene.dispatchEvent(e);
                    if (inputEvent) {
                        this.currentScene.dispatchEvent(inputEvent);
                    }
                });
            }, this);

            if (initial) {
                stage = enchant.Game.instance._element;
                var evt;
                document.addEventListener('keydown', function(e) {
                    game.dispatchEvent(new enchant.Event('keydown'));
                    if (enchant.ENV.PREVENT_DEFAULT_KEY_CODES.indexOf(e.keyCode) !== -1) {
                        e.preventDefault();
                        e.stopPropagation();
                    }

                    if (!game.running) {
                        return;
                    }
                    var button = game._keybind[e.keyCode];
                    if (button) {
                        evt = new enchant.Event(button + 'buttondown');
                        game.dispatchEvent(evt);
                    }
                }, true);
                document.addEventListener('keyup', function(e) {
                    if (!game.running) {
                        return;
                    }
                    var button = game._keybind[e.keyCode];
                    if (button) {
                        evt = new enchant.Event(button + 'buttonup');
                        game.dispatchEvent(evt);
                    }
                }, true);

                if (enchant.ENV.TOUCH_ENABLED) {
                    stage.addEventListener('touchstart', function(e) {
                        var tagName = (e.target.tagName).toLowerCase();
                        if (enchant.ENV.USE_DEFAULT_EVENT_TAGS.indexOf(tagName) === -1) {
                            e.preventDefault();
                            if (!game.running) {
                                e.stopPropagation();
                            }
                        }
                    }, true);
                    stage.addEventListener('touchmove', function(e) {
                        var tagName = (e.target.tagName).toLowerCase();
                        if (enchant.ENV.USE_DEFAULT_EVENT_TAGS.indexOf(tagName) === -1) {
                            e.preventDefault();
                            if (!game.running) {
                                e.stopPropagation();
                            }
                        }
                    }, true);
                    stage.addEventListener('touchend', function(e) {
                        var tagName = (e.target.tagName).toLowerCase();
                        if (enchant.ENV.USE_DEFAULT_EVENT_TAGS.indexOf(tagName) === -1) {
                            e.preventDefault();
                            if (!game.running) {
                                e.stopPropagation();
                            }
                        }
                    }, true);
                }
                stage.addEventListener('mousedown', function(e) {
                    var tagName = (e.target.tagName).toLowerCase();
                    if (enchant.ENV.USE_DEFAULT_EVENT_TAGS.indexOf(tagName) === -1) {
                        e.preventDefault();
                        game._mousedownID++;
                        if (!game.running) {
                            e.stopPropagation();
                        }
                    }
                }, true);
                stage.addEventListener('mousemove', function(e) {
                    var tagName = (e.target.tagName).toLowerCase();
                    if (enchant.ENV.USE_DEFAULT_EVENT_TAGS.indexOf(tagName) === -1) {
                        e.preventDefault();
                        if (!game.running) {
                            e.stopPropagation();
                        }
                    }
                }, true);
                stage.addEventListener('mouseup', function(e) {
                    var tagName = (e.target.tagName).toLowerCase();
                    if (enchant.ENV.USE_DEFAULT_EVENT_TAGS.indexOf(tagName) === -1) {
                        e.preventDefault();
                        if (!game.running) {
                            e.stopPropagation();
                        }
                    }
                }, true);
                game._touchEventTarget = null;
                var _ontouchstart = function(e) {
                    var game = enchant.Game.instance;
                    var currentScene = game.currentScene;
                    var layer, target;
                    for (var i = currentScene._layerPriority.length - 1; i >= 0; i--) {
                        layer = currentScene._layers[currentScene._layerPriority[i]];
                        target = layer._determineEventTarget(e);
                        if (target) {
                            break;
                        }
                    }
                    if (!target) {
                        target = currentScene;
                    }
                    game._touchEventTarget = target;
                    var evt = new enchant.Event(enchant.Event.TOUCH_START);
                    evt._initPosition(e.x, e.y);
                    target.dispatchEvent(evt);
                };
                var _ontouchmove = function(e) {
                    var evt;
                    if (game._touchEventTarget) {
                        evt = new enchant.Event(enchant.Event.TOUCH_MOVE);
                        evt._initPosition(e.x, e.y);
                        game._touchEventTarget.dispatchEvent(evt);
                    }
                };
                var _ontouchend = function(e) {
                    var evt;
                    if (game._touchEventTarget) {
                        evt = new enchant.Event(enchant.Event.TOUCH_END);
                        evt._initPosition(e.x, e.y);
                        game._touchEventTarget.dispatchEvent(evt);
                        game._touchEventTarget = null;
                    }
                };
                if (enchant.ENV.TOUCH_ENABLED) {
                    stage.addEventListener('touchdown', _ontouchstart, false);
                    stage.addEventListener('touchmove', _ontouchmove, false);
                    stage.addEventListener('touchup', _ontouchend, false);
                }
                stage.addEventListener('mousedown', _ontouchstart, false);
                stage.addEventListener('mousemove', _ontouchmove, false);
                stage.addEventListener('mouseup', _ontouchend, false);
            }
        },
        /**
         * Performs a file preload.
         *
         * Sets files which are to be preloaded. When {@link enchant.Game#start} is called the
         * actual loading takes place. When all files are loaded, a {@link enchant.Event.LOAD} event
         * is dispatched from the Game object. Depending on the type of the file different objects will be
         * created and stored in {@link enchant.Game#assets} Variable.
         * When an image file is loaded, an {@link enchant.Surface} is created. If a sound file is loaded, an
         * {@link enchant.Sound} object is created. Otherwise it will be accessible as a string.
         *
         * In addition, because this Surface object used made with {@link enchant.Surface.load},
         * direct object manipulation is not possible. Refer to the items of {@link enchant.Surface.load}
         *
         * @example
         *   game.preload('player.gif');
         *   game.onload = function() {
         *      var sprite = new Sprite(32, 32);
         *      sprite.image = game.assets['player.gif']; // Access via path
         *      ...
         *   };
         *   game.start();
         *
         * @param {...String} assets Path of images to be preloaded. Multiple settings possible.
         */
        preload: function(assets) {
            if (!(assets instanceof Array)) {
                assets = Array.prototype.slice.call(arguments);
            }
            [].push.apply(this._assets, assets);
        },
        /**
         * Loads a file.
         *
         * @param {String} asset File path of the resource to be loaded.
         * @param {Function} [callback] Function called up when file loading is finished.
         */
        load: function(src, callback) {
            if (callback == null) {
                callback = function() {
                };
            }

            var ext = enchant.Game.findExt(src);

            if (enchant.Game._loadFuncs[ext]) {
                enchant.Game._loadFuncs[ext].call(this, src, callback, ext);
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
                            game.assets[src] = enchant.Surface.load(src);
                            game.assets[src].addEventListener('load', callback);
                        } else if (type.match(/^audio/)) {
                            game.assets[src] = enchant.Sound.load(src, type);
                            game.assets[src].addEventListener('load', callback);
                        } else {
                            game.assets[src] = req.responseText;
                            callback();
                        }
                    }
                };
                req.send(null);
            }
        },
        /**
         * Start the game.
         *
         * Obeying the frame rate set in {@link enchant.Game#fps}, the frame in
         * {@link enchant.Game#currentScene} will be updated. If images to preload are present,
         * loading will begin and the loading screen will be displayed.
         */
        start: function() {
            if (this._intervalID) {
                window.clearInterval(this._intervalID);
            } else if (this._assets.length) {
                if (enchant.Sound.enabledInMobileSafari && !game._touched &&
                    enchant.ENV.VENDOR_PREFIX === 'webkit' && enchant.ENV.TOUCH_ENABLED) {
                    var scene = new enchant.Scene();
                    scene.backgroundColor = '#000';
                    var size = Math.round(game.width / 10);
                    var sprite = new enchant.Sprite(game.width, size);
                    sprite.y = (game.height - size) / 2;
                    sprite.image = new enchant.Surface(game.width, size);
                    sprite.image.context.fillStyle = '#fff';
                    sprite.image.context.font = (size - 1) + 'px bold Helvetica,Arial,sans-serif';
                    var width = sprite.image.context.measureText('Touch to Start').width;
                    sprite.image.context.fillText('Touch to Start', (game.width - width) / 2, size - 1);
                    scene.addChild(sprite);
                    document.addEventListener('touchstart', function() {
                        game._touched = true;
                        game.removeScene(scene);
                        game.start();
                    }, true);
                    game.pushScene(scene);
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
                        game.dispatchEvent(e);
                        if (loaded === len) {
                            game.removeScene(game.loadingScene);
                            game.dispatchEvent(new enchant.Event('load'));
                        }
                    };

                for (var i = 0; i < len; i++) {
                    this.load(assets[i], loadFunc);
                }
                this.pushScene(this.loadingScene);
            } else {
                this.dispatchEvent(new enchant.Event('load'));
            }
            this.currentTime = this.getTime();
            this._intervalID = window.setInterval(function() {
                game._tick();
            }, 1000 / this.fps);
            this.running = true;
        },
        /**
         * Begin game debug mode.
         *
         * Game debug mode can be set to on even if enchant.Game.instance._debug
         * flag is already set to true.
         */
        debug: function() {
            this._debug = true;
            this.rootScene.addEventListener("enterframe", function(time) {
                this._actualFps = (1 / time);
            });
            this.start();
        },
        actualFps: {
            get: function() {
                return this._actualFps || this.fps;
            }
        },
        _tick: function() {
            var now = this.getTime();
            var e = new enchant.Event('enterframe');
            e.elapsed = now - this.currentTime;
            this.currentTime = now;

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
        },
        getTime: function() {
            if (window.performance && window.performance.now) {
                return window.performance.now();
            }else if(window.performance && window.performance.webkitNow){
                return window.performance.webkitNow();
            }else{
                return Date.now();
            }
        },
        /**
         * Stops the game.
         *
         * The frame will not be updated, and player input will not be accepted anymore.
         * Game can be restarted using {@link enchant.Game#start}.
         */
        stop: function() {
            if (this._intervalID) {
                window.clearInterval(this._intervalID);
                this._intervalID = null;
            }
            this.running = false;
        },
        /**
         * Stops the game.
         *
         * The frame will not be updated, and player input will not be accepted anymore.
         * Game can be started again using {@link enchant.Game#start}.
         */
        pause: function() {
            if (this._intervalID) {
                window.clearInterval(this._intervalID);
                this._intervalID = null;
            }
        },
        /**
         * Resumes the game.
         */
        resume: function() {
            if (this._intervalID) {
                return;
            }
            this.currentTime = this.getTime();
            this._intervalID = window.setInterval(function() {
                game._tick();
            }, 1000 / this.fps);
            this.running = true;
        },

        /**
         * Switch to a new Scene.
         *
         * Scenes are controlled using a stack, and the display order also obeys that stack order.
         * When {@link enchant.Game#pushScene} is executed, the Scene can be brought to the top of stack.
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
         * When {@link enchant.Game#popScene} is executed, the Scene at the top of the stack
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
         * {@link enchant.Game#popScene}, {@link enchant.Game#pushScene} are executed after
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
         * Maps an input key to an enchant.js left, right, up, down, a, b button.
         *
         * @param {Number} key Key code for the button which will be bound.
         * @param {String} button The enchant.js button (left, right, up, down, a, b).
         */
        keybind: function(key, button) {
            this._keybind[key] = button;
        },
        /**
         * Get the elapsed game time (not actual) from when game.start was called.
         * @return {Number} The elapsed time (seconds)
         */
        getElapsedTime: function() {
            return this.frame / this.fps;
        }
    });

    enchant.Game._loadFuncs = {};
    enchant.Game._loadFuncs['jpg'] =
        enchant.Game._loadFuncs['jpeg'] =
            enchant.Game._loadFuncs['gif'] =
                enchant.Game._loadFuncs['png'] =
                    enchant.Game._loadFuncs['bmp'] = function(src, callback) {
                        this.assets[src] = enchant.Surface.load(src);
                        this.assets[src].addEventListener('load', callback);
                    };
    enchant.Game._loadFuncs['mp3'] =
        enchant.Game._loadFuncs['aac'] =
            enchant.Game._loadFuncs['m4a'] =
                enchant.Game._loadFuncs['wav'] =
                    enchant.Game._loadFuncs['ogg'] = function(src, callback, ext) {
                        this.assets[src] = enchant.Sound.load(src, 'audio/' + ext);
                        this.assets[src].addEventListener('load', callback);
                    };


    /**
     * Get the file extension from a path
     * @param path
     * @return {*}
     */
    enchant.Game.findExt = function(path) {
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
     * The Current Game instance.
     * @type {enchant.Game}
     * @static
     */
    enchant.Game.instance = null;
}());

/**
 * @scope enchant.Node.prototype
 */
enchant.Node = enchant.Class.create(enchant.EventTarget, {
    /**
     * Base class for objects in the display tree which is rooted at a Scene.
     * Not to be used directly.
     * @constructs
     * @extends enchant.EventTarget
     */
    initialize: function() {
        enchant.EventTarget.call(this);

        this._dirty = false;

        this._x = 0;
        this._y = 0;
        this._offsetX = 0;
        this._offsetY = 0;

        /**
         *         *         * The age (frames) of this node which will be increased before this node receives {@link enchant.Event.ENTER_FRAME} event.
         *         *         * @type {Number}
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
         * Node が生成される際に、tl プロパティに Timeline オブジェクトを追加している
         */
        if(enchant.ENV.USE_ANIMATION){
            var tl = this.tl = new enchant.Timeline(this);
            this.addEventListener("enterframe", function(e) {
                tl.dispatchEvent(e);
            });
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
        this._updateCoordinate();
    },
    /**
     * Move the Node relative to its current position.
     * @param {Number} x x axis movement distance.
     * @param {Number} y y axis movement distance.
     */
    moveBy: function(x, y) {
        this._x += x;
        this._y += y;
        this._updateCoordinate();
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
            this._updateCoordinate();
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
            this._updateCoordinate();
        }
    },
    _updateCoordinate: function() {
        if (this.parentNode) {
            this._offsetX = this.parentNode._offsetX + this._x;
            this._offsetY = this.parentNode._offsetY + this._y;
        } else {
            this._offsetX = this._x;
            this._offsetY = this._y;
        }
        this._dirty = true;
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

/**
 * @scope enchant.Entity.prototype
 */
enchant.Entity = enchant.Class.create(enchant.Node, {
    /**
     * A class with objects displayed as DOM elements. Not to be used directly.
     * @constructs
     * @extends enchant.Node
     */
    initialize: function() {
        var game = enchant.Game.instance;
        enchant.Node.call(this);

        this._rotation = 0;
        this._scaleX = 1;
        this._scaleY = 1;

        this._originX = null;
        this._originY = null;

        this._width = 0;
        this._height = 0;
        this._backgroundColor = null;
        this._opacity = 1;
        this._visible = true;
        this._buttonMode = null;

        this._style = {};

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
            game.dispatchEvent(e);
        });
        this.addEventListener('touchend', function() {
            if (!this.buttonMode) {
                return;
            }
            this.buttonPressed = false;
            var e = new enchant.Event(this.buttonMode + 'buttonup');
            this.dispatchEvent(e);
            game.dispatchEvent(e);
        });

        var that = this;
        var event = new enchant.Event('render');
        var render = function() {
            that.dispatchEvent(event);
        };
        this.addEventListener('addedtoscene', function() {
            render();
            game.addEventListener('exitframe', render);
        });
        this.addEventListener('removedfromscene', function() {
            game.removeEventListener('exitframe', render);
        });

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
            this._opacity = opacity;
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
            /*
            if (this._touchEnabled = enabled) {
                this._style.pointerEvents = 'all';
            } else {
                this._style.pointerEvents = 'none';
            }
            */
        }
    },
    /**
     * Performs a collision detection based on whether or not the bounding rectangles are intersecting.
     * @param {*} other An object like Entity, with the properties x, y, width, height, which are used for the 
     * collision detection.
     * @return {Boolean} True, if a collision was detected.
     */
    intersect: function(other) {
        return this._offsetX < other._offsetX + other.width && other._offsetX < this._offsetX + this.width &&
            this._offsetY < other._offsetY + other.height && other._offsetY < this._offsetY + this.height;
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
    }
});

/**
 * @scope enchant.Sprite.prototype
 */
enchant.Sprite = enchant.Class.create(enchant.Entity, {
    /**
     * Class which can display images.
     * 
     * @param {Number} [width] Sprite width.
     * @param {Number} [height] Sprite height.
     * @example
     *   var bear = new Sprite(32, 32);
     *   bear.image = game.assets['chara1.gif'];
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
     * Image displayed in the Sprite.
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
    }
});

enchant.Sprite.prototype.cvsRender = function(ctx) {
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
};

/**
 * @scope enchant.Label.prototype
 */
enchant.Label = enchant.Class.create(enchant.Entity, {
    /**
     * Create Label object.
     * @constructs
     * @extends enchant.Entity
     */
    initialize: function(text) {
        enchant.Entity.call(this);

        this.width = 300;
        this.text = text;
        this.textAlign = 'left';
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
            this._text = text;
        }
    },
    /**
     * Specifies horizontal alignment of text.
     * Can be set according to the format of the CSS 'text-align' property.
     * @type {String}
     */
    textAlign: {
        get: function() {
            return this._style.textAlign;
        },
        set: function(textAlign) {
            this._style.textAlign = textAlign;
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
    }
});

enchant.Label.prototype.cvsRender = function(ctx) {
    if (this.text) {
        ctx.textBaseline = 'top';
        ctx.font = this.font;
        ctx.fillStyle = this.color || '#000000';
        ctx.fillText(this.text, 0, 0);
    }
};

/**
 * @scope enchant.Map.prototype
 */
enchant.Map = enchant.Class.create(enchant.Entity, {
    /**
     * A class to create and display maps from a tile set.
     *
     * @param {Number} tileWidth Tile width.
     * @param {Number} tileHeight Tile height.
     * @constructs
     * @extends enchant.Entity
     */
    initialize: function(tileWidth, tileHeight) {
        var game = enchant.Game.instance;

        enchant.Entity.call(this);

        var canvas = document.createElement('canvas');
        canvas.style.position = 'absolute';
        if (enchant.ENV.RETINA_DISPLAY && game.scale === 2) {
            canvas.width = game.width * 2;
            canvas.height = game.height * 2;
            this._style.webkitTransformOrigin = '0 0';
            this._style.webkitTransform = 'scale(0.5)';
        } else {
            canvas.width = game.width;
            canvas.height = game.height;
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
                this._dirty = false;
                this.redraw(0, 0, game.width, game.height);
            } else if (this._offsetX !== this._previousOffsetX ||
                this._offsetY !== this._previousOffsetY) {
                if (this._tight) {
                    var x = -this._offsetX;
                    var y = -this._offsetY;
                    var px = -this._previousOffsetX;
                    var py = -this._previousOffsetY;
                    var w1 = x - px + game.width;
                    var w2 = px - x + game.width;
                    var h1 = y - py + game.height;
                    var h2 = py - y + game.height;
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

                        if (game._buffer == null) {
                            game._buffer = document.createElement('canvas');
                            game._buffer.width = this._context.canvas.width;
                            game._buffer.height = this._context.canvas.height;
                        }
                        var context = game._buffer.getContext('2d');
                        if (this._doubledImage) {
                            context.clearRect(0, 0, sw * 2, sh * 2);
                            context.drawImage(this._context.canvas,
                                sx * 2, sy * 2, sw * 2, sh * 2, 0, 0, sw * 2, sh * 2);
                            context = this._context;
                            context.clearRect(dx * 2, dy * 2, sw * 2, sh * 2);
                            context.drawImage(game._buffer,
                                0, 0, sw * 2, sh * 2, dx * 2, dy * 2, sw * 2, sh * 2);
                        } else {
                            context.clearRect(0, 0, sw, sh);
                            context.drawImage(this._context.canvas,
                                sx, sy, sw, sh, 0, 0, sw, sh);
                            context = this._context;
                            context.clearRect(dx, dy, sw, sh);
                            context.drawImage(game._buffer,
                                0, 0, sw, sh, dx, dy, sw, sh);
                        }

                        if (dx === 0) {
                            this.redraw(sw, 0, game.width - sw, game.height);
                        } else {
                            this.redraw(0, 0, game.width - sw, game.height);
                        }
                        if (dy === 0) {
                            this.redraw(0, sh, game.width, game.height - sh);
                        } else {
                            this.redraw(0, 0, game.width, game.height - sh);
                        }
                    } else {
                        this.redraw(0, 0, game.width, game.height);
                    }
                } else {
                    this.redraw(0, 0, game.width, game.height);
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
            var game = enchant.Game.instance;

            this._image = image;
            if (enchant.ENV.RETINA_DISPLAY && game.scale === 2) {
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
    }
});

enchant.Map.prototype.cvsRender = function(ctx) {
    var game = enchant.Game.instance;
    if (this.width !== 0 && this.height !== 0) {
        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        var cvs = this._context.canvas;
            ctx.drawImage(cvs, 0, 0, game.width, game.height);
        ctx.restore();
    }
};

/**
 * @scope enchant.Group.prototype
 */
enchant.Group = enchant.Class.create(enchant.Node, {
    /**
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
     *
     * @constructs
     * @extends enchant.Node
     */
    initialize: function() {
        enchant.Node.call(this);

        /**
         * Child Nodes.
         * @type {Array.<enchant.Node>}
         */
        this.childNodes = [];

        this._rotation = 0;
        this._scaleX = 1;
        this._scaleY = 1;

        this._originX = null;
        this._originY = null;

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
    _updateCoordinate: function() {
        if (this.parentNode) {
            this._offsetX = this.parentNode._offsetX + this._x;
            this._offsetY = this.parentNode._offsetY + this._y;
        } else {
            this._offsetX = this._x;
            this._offsetY = this._y;
        }
        for (var i = 0, len = this.childNodes.length; i < len; i++) {
            this.childNodes[i]._updateCoordinate();
        }
        this._dirty = true;
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
    }
});

enchant.CanvasView = enchant.Class.create(enchant.EventTarget, {
    initialize: function(width, height, contextType) {
        enchant.EventTarget.call(this, width, height);
        this.width = width;
        this.height = height;

        this.element = document.createElement('canvas');
        this.element.width = this.width;
        this.element.height = this.height;
        contextType = contextType || '2d';
        this.context = this.element.getContext(contextType);
    }
});

enchant.DomView = enchant.Class.create(enchant.EventTarget, {
    initialize: function(width, height) {
        enchant.EventTarget.call(this);
        this.width = width;
        this.height = height;

        this.element = document.createElement('div');
        this.element.style.width = this.width + 'px';
        this.element.style.height = this.height + 'px';
    }
});

var rotate = function(rad, x, y) {
    var sinT = Math.sin(rad);
    var cosT = Math.cos(rad);
    return [
        cosT * x + sinT * y,
        -sinT * x + cosT * y
    ];
};

enchant.DomManager = enchant.Class.create({
    initialize: function(node, elementType) {
        var game = enchant.Game.instance;
        this.element = document.createElement(elementType);
        this.style = this.element.style;
        this.style.position = 'absolute';
        if (game._debug) {
            this.style.border = '1px solid blue';
            this.style.margin = '-1px';
        }
        this.targetNode = node;
        this.layer = null;

        var manager = this;
        var setDomTarget = function() {
            manager.layer._touchEventTarget = manager.targetNode;
        };
        if (enchant.ENV.TOUCH_ENABLED) {
            this.element.addEventListener('touchstart', setDomTarget, true);
        }
        this.element.addEventListener('mousedown', setDomTarget, true);
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
        } else if (this.targetNode.parentNode) {
            //nextElement = this.getNextManager(this);
        }
        this.element.insertBefore(childManager.getDomElement(), nextElement);
    },
    removeManager: function(childManager) {
        if (childManager instanceof enchant.DomlessManager) {
            childManager._domRef.forEach(function(element) {
                this.element.removeChild(element);
            }, this);
        } else {
            this.element.removeChild(childManager.element);
        }
    },
    render: function() {
        this.cssUpdate();
    },
    cssUpdate: function() {
        var node = this.targetNode;
        this.style.width = node._width + 'px';
        this.style.height = node._height + 'px';
        this.style.opacity = node._opacity;
        if (typeof node._visible !== 'undefined') {
            this.style.display = node._visible ? 'block' : 'none';
        }
        var ox = (typeof node._originX === 'number') ? node._originX : node._width / 2 | 0;
        var oy = (typeof node._originY === 'number') ? node._originY : node._height / 2 | 0;
        var x, y;
        var parentManager;
        if (node.parentNode && node.parentNode._domManager instanceof enchant.DomlessManager) {
            parentManager = node.parentNode._domManager;
            var rad = -parentManager._rotation * Math.PI / 180;
            var rx = node._x + ox;
            var ry = node._y + oy;
            var rot = rotate(rad, rx, ry);
            var X = rot[0] * parentManager._scaleX - ox;
            var Y = rot[1] * parentManager._scaleY - oy;
            x = parentManager._x + X;
            y = parentManager._y + Y;
            var cssTransform =
                'translate(' + x + 'px, ' + y + 'px) ' +
                'rotate(' + (parentManager._rotation + node._rotation) + 'deg) ' +
                'scale(' + (parentManager._scaleX * node._scaleX) + ', ' + (parentManager._scaleY * node._scaleY) + ') ';
            this.style[enchant.ENV.VENDOR_PREFIX + 'Transform'] = cssTransform;
            this.style[enchant.ENV.VENDOR_PREFIX + 'TransformOrigin'] = ox + ' ' + oy;
            this.style.backgroundColor = node._backgroundColor;

        } else {

        x = node._x;
        y = node._y;
        this.style[enchant.ENV.VENDOR_PREFIX + 'Transform'] =
            'translate(' + x + 'px, ' + y + 'px) ' +
            'rotate(' + node._rotation + 'deg) ' +
            'scale(' + node._scaleX + ', ' + node._scaleY + ') ';
        this.style[enchant.ENV.VENDOR_PREFIX + 'TransformOrigin'] = ox + ' ' + oy;
        this.style.backgroundColor = node._backgroundColor;

        }

        node._offsetX = x;
        node._offsetY = y;
    },
    remove: function() {
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
        if (element instanceof DocumentFragment) {
            if (i === -1) {
                Array.prototype.push.apply(this._domRef, element.childNodes);
            } else {
                this._domRef.splice(i, 0, element);
                Array.prototype.splice.apply(this._dom, [i, 0].join(element.childNodes));
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
        var frag = document.createDocumentFragment();
        var children = this.targetNode.childNodes;
        children.forEach(function(child) {
            var element = child._domManager.getDomElement();
            this._domRef.push(element);
            frag.appendChild(element);
        }, this);
        return frag;
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
        if (this.targetNode.parentNode) {
            if (nextManager === null) {
                nextManager = this.getNextManager(this);
            }
            this.targetNode.parentNode._domManager.addManager(childManager, nextManager);
        }
        var nextElement = nextManager ? nextManager.getDomElementAsNext() : null;
        this._register(childManager.getDomElement(), nextElement);
    },
    removeManager: function(childManager) {
        var dom;
        var i = this._domRef.indexOf(childManager.element);
        if (i !== -1) {
            dom = this._domRef[i];
            dom.parentNode.removeChild(dom);
            this._domRef.splice(i, 1);
        }
    },
    render: function() {
        var node = this.targetNode;
        var parentManager = node.parentNode._domManager;
        if (parentManager instanceof enchant.DomlessManager) {
            var parentX = parentManager._x;
            var parentY = parentManager._y;
            var parentSX = parentManager._scaleX;
            var parentSY = parentManager._scaleY;
            var parentRot = parentManager._rotation;

            var rad = -parentRot * Math.PI / 180;

            var ox = (typeof node._originX === 'number') ? node._originX : node._width / 2 | 0;
            var oy = (typeof node._originY === 'number') ? node._originY : node._height / 2 | 0;

            var rx = node._x + ox;
            var ry = node._y + oy;
            var rot = rotate(rad, rx, ry);
            var X = rot[0] * parentSX - ox;
            var Y = rot[1] * parentSY - oy;

            // subete childNode ga tsukau
            this._x = parentX + X;
            this._y = parentY + Y;
            this._scaleX = parentSX * node._scaleX;
            this._scaleY = parentSY * node._scaleY;
            this._rotation = parentRot + node._rotation;
        } else {
            this._x = node._x;
            this._y = node._y;
            this._scaleX = node._scaleX;
            this._scaleY = node._scaleY;
            this._rotation = node._rotation;
        }
        node._offsetX = this._x;
        node._offsetY = this._y;
    },
    remove: function() {
        this._domRef = [];
        this.targetNode = null;
    }
});

(function() {

    enchant.DomLayer = enchant.Class.create(enchant.Group, {
        initialize: function() {
            var game = enchant.Game.instance;
            var that = this;
            enchant.Group.call(this);

            this.width = this._width = game.width;
            this.height = this._height = game.height;

            this._touchEventTarget = null;

            this._frameBuffer = new enchant.DomView(this.width, this.height);
            this._domManager = new enchant.DomManager(this, 'div');
            this._domManager.layer = this;
            this._frameBuffer.element.appendChild(this._domManager.element);

            this._frameBuffer.element.style.position = 'absolute';

            // TODO
            this._element = this._frameBuffer.element;

            var start = [
                enchant.Event.ENTER,
                enchant.Event.ADDED_TO_SCENE
            ];
            var end = [
                enchant.Event.EXIT,
                enchant.Event.REMOVED_FROM_SCENE
            ];
            start.forEach(function(type) {
                this.addEventListener(type, this._startRendering);
            }, this);
            end.forEach(function(type) {
                this.addEventListener(type, this._stopRendering);
            }, this);

            var __onchildadded = function(e) {
                var child = e.node;
                var next = e.next;
                var self = e.target;
                if (child.childNodes) {
                    child.addEventListener('childadded', __onchildadded);
                    child.addEventListener('childremoved', __onchildremoved);
                }
                child._updateCoordinate();
                var nextManager = next ? next._domManager : null;
                attachDomManager.call(child);
                self._domManager.addManager(child._domManager, nextManager);
                child._domManager.layer = self;
                rendering.call(child);
            };

            var __onchildremoved = function(e) {
                var child = e.node;
                var self = e.target;
                if (child.childNodes) {
                    child.removeEventListener('childadded', __onchildadded);
                    child.removeEventListener('childremoved', __onchildremoved);
                }
                self._domManager.removeManager(child._domManager);
                detachDomManager.call(child, that._colorManager);
            };

            this.addEventListener('childremoved', __onchildremoved);
            this.addEventListener('childadded', __onchildadded);

            this._onexitframe = function() {
                rendering.call(that);
            };
        },
        _startRendering: function() {
            enchant.Game.instance.addEventListener('exitframe', this._onexitframe);
        },
        _stopRendering: function() {
            enchant.Game.instance.removeEventListener('exitframe', this._onexitframe);
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

    var nodesWalker = function(pre, post) {
        pre = pre || function() {
        };
        post = post || function() {
        };
        var walker = function() {
            pre.apply(this, arguments);
            var child;
            if (this.childNodes) {
                for (var i = 0, l = this.childNodes.length; i < l; i++) {
                    child = this.childNodes[i];
                    walker.apply(child, arguments);
                }
            }
            post.apply(this, arguments);
        };
        return walker;
    };

    var attachDomManager = nodesWalker(function() {
        if (!this._domManager) {
            if (this instanceof enchant.Group) {
                this._domManager = new enchant.DomlessManager(this);
            } else {
                this._domManager = new enchant.DomManager(this, 'div');
            }
        }
    });

    var detachDomManager = nodesWalker(function() {
        delete this._domManager;
    });

    var rendering = nodesWalker(function() {
        if (this._dirty) {
            this._domManager.render();
            if (typeof this.cssUpdate === 'function') {
                this.cssUpdate();
            }
            this._dirty = false;
        }
    });

enchant.Label.prototype.cssUpdate = function() {
    this._domManager.element.innerHTML = this._text;
    this._domManager.element.style.font = this._font;
    this._domManager.element.style.color = this._color;
    this._domManager.element.style.textAlign = this._textAlign;
};

enchant.Sprite.prototype.cssUpdate = function() {
    var element = this._domManager.element;
    if (this._image) {
        if (this._image._css) {
            element.style.backgroundImage = this._image._css;
            element.style.backgroundPosition =
                -this._frameLeft + 'px ' +
                -this._frameTop + 'px';
        } else if (element.firstChild) {
            // TODO new Surface
        }
    }
};

}());

(function() {
    /**
     * @scope enchant.CanvasGroup.prototype
     */
    enchant.CanvasLayer = enchant.Class.create(enchant.Group, {
        /**
         * A class which is using HTML Canvas for the rendering.
         * The rendering of children will be replaced by the Canvas rendering.
         * @constructs
         */
        initialize: function() {
            var game = enchant.Game.instance;
            var that = this;

            enchant.Group.call(this);

            this._cvsCache = {
                matrix: [1, 0, 0, 1, 0, 0],
                detectColor: '#000000'
            };

            this.width = game.width;
            this.height = game.height;

            this._element = document.createElement('canvas');
            this._element.width = game.width;
            this._element.height = game.height;
            this._element.style.position = 'absolute';

            this._detect = document.createElement('canvas');
            this._detect.width = game.width;
            this._detect.height = game.height;
            this._detect.style.position = 'absolute';
            this._lastDetected = 0;

            this.context = this._element.getContext('2d');
            this._dctx = this._detect.getContext('2d');

            this._colorManager = new DetectColorManager(16, 256);

            /**
             * canvas タグに対して、DOM のイベントリスナを貼る
             */
            if (enchant.ENV.TOUCH_ENABLED) {
                this._element.addEventListener('touchstart', function(e) {
                    var touches = e.touches;
                    for (var i = 0, len = touches.length; i < len; i++) {
                        e = new enchant.Event('touchstart');
                        e.identifier = touches[i].identifier;
                        e._initPosition(touches[i].pageX, touches[i].pageY);
                        _touchstartFromDom.call(that, e);
                    }
                }, false);
                this._element.addEventListener('touchmove', function(e) {
                    var touches = e.touches;
                    for (var i = 0, len = touches.length; i < len; i++) {
                        e = new enchant.Event('touchmove');
                        e.identifier = touches[i].identifier;
                        e._initPosition(touches[i].pageX, touches[i].pageY);
                        _touchmoveFromDom.call(that, e);
                    }
                }, false);
                this._element.addEventListener('touchend', function(e) {
                    var touches = e.changedTouches;
                    for (var i = 0, len = touches.length; i < len; i++) {
                        e = new enchant.Event('touchend');
                        e.identifier = touches[i].identifier;
                        e._initPosition(touches[i].pageX, touches[i].pageY);
                        _touchendFromDom.call(that, e);
                    }
                }, false);
            }
            this._element.addEventListener('mousedown', function(e) {
                var x = e.pageX;
                var y = e.pageY;
                e = new enchant.Event('touchstart');
                e.identifier = game._mousedownID;
                e._initPosition(x, y);
                _touchstartFromDom.call(that, e);
                that._mousedown = true;
            }, false);
            game._element.addEventListener('mousemove', function(e) {
                if (!that._mousedown) {
                    return;
                }
                var x = e.pageX;
                var y = e.pageY;
                e = new enchant.Event('touchmove');
                e.identifier = game._mousedownID;
                e._initPosition(x, y);
                _touchmoveFromDom.call(that, e);
            }, false);
            game._element.addEventListener('mouseup', function(e) {
                if (!that._mousedown) {
                    return;
                }
                var x = e.pageX;
                var y = e.pageY;
                e = new enchant.Event('touchend');
                e.identifier = game._mousedownID;
                e._initPosition(x, y);
                _touchendFromDom.call(that, e);
                that._mousedown = false;
            }, false);

            var start = [
                enchant.Event.ENTER,
                enchant.Event.ADDED_TO_SCENE
            ];
            var end = [
                enchant.Event.EXIT,
                enchant.Event.REMOVED_FROM_SCENE
            ];
            start.forEach(function(type) {
                this.addEventListener(type, this._startRendering);
                this.addEventListener(type, function() {
                    canvasGroupInstances.push(this);
                });
            }, this);
            end.forEach(function(type) {
                this.addEventListener(type, this._stopRendering);
                this.addEventListener(type, function() {
                    var i = canvasGroupInstances.indexOf(this);
                    if (i !== -1) {
                        canvasGroupInstances.splice(i, 1);
                    }
                });
            }, this);

            var __onchildadded = function(e) {
                var child = e.node;
                if (child.childNodes) {
                    child.addEventListener('childadded', __onchildadded);
                    child.addEventListener('childremoved', __onchildremoved);
                }
                attachCache.call(child, that._colorManager);
                rendering.call(child, that.context);
            };

            var __onchildremoved = function(e) {
                var child = e.node;
                if (child.childNodes) {
                    child.removeEventListener('childadded', __onchildadded);
                    child.removeEventListener('childremoved', __onchildremoved);
                }
                detachCache.call(child, that._colorManager);
            };

            this.addEventListener('childremoved', __onchildremoved);
            this.addEventListener('childadded', __onchildadded);

            this._onexitframe = function() {
                var ctx = that.context;
                ctx.clearRect(0, 0, game.width, game.height);
                rendering.call(that, ctx);
            };
        },
        /**
         * レンダリング用のイベントリスナを Game オブジェクトに登録
         * @private
         */
        _startRendering: function() {
            var game = enchant.Game.instance;
            if (!game._listeners['exitframe']) {
                game._listeners['exitframe'] = [];
            }
            game._listeners['exitframe'].push(this._onexitframe);

        },
        /**
         * _startRendering で登録したレンダリング用のイベントリスナを削除
         * @private
         */
        _stopRendering: function() {
            var game = enchant.Game.instance;
            game.removeEventListener('exitframe', this._onexitframe);
        },
        _determineEventTarget: function(e) {
            // TODO calc position offset
            return this._getEntityByPosition(e.x, e.y);
        },
        _getEntityByPosition: function(x, y) {
            var game = enchant.Game.instance;
            var ctx = this._dctx;
            if (this._lastDetected < game.frame) {
                ctx.clearRect(0, 0, this.width, this.height);
                detectrendering.call(this, ctx);
                this._lastDetected = game.frame;
            }
            var color = ctx.getImageData(x, y, 1, 1).data;
            return this._colorManager.getSpriteByColor(color);
        },
        _touchstartPropagation: function(e) {
            this._touching = this._getEntityByPosition(e.x, e.y);
            if (this._touching) {
                propagationUp.call(this._touching, e, this.parentNode);
            } else {
                this._touching = enchant.Game.instance.currentScene;
                this._touching.dispatchEvent(e);
            }
            return this._touching;
        },
        _touchmovePropagation: function(e) {
            propagationUp.call(this._touching, e, this.parentNode);
        },
        _touchendPropagation: function(e) {
            propagationUp.call(this._touching, e, this.parentNode);
            this._touching = null;
        }
    });

    var canvasGroupInstances = [];
    var touchingEntity = null;
    var touchingGroup = null;

    var _touchstartFromDom = function(e) {
        var game = enchant.Game.instance;
        var group;
        for (var i = canvasGroupInstances.length - 1; i >= 0; i--) {
            group = canvasGroupInstances[i];
            if (group.scene !== game.currentScene) {
                continue;
            }
            var sp = group._touchstartPropagation(e);
            if (sp) {
                touchingEntity = sp;
                touchingGroup = group;
                return;
            }
        }
    };

    var _touchmoveFromDom = function(e) {
        if (touchingGroup != null) {
            touchingGroup._touchmovePropagation(e);
        }
    };
    var _touchendFromDom = function(e) {
        if (touchingGroup != null) {
            touchingGroup._touchendPropagation(e);
            touchingEntity = null;
            touchingGroup = null;
        }
    };

    var DetectColorManager = enchant.Class.create({
        initialize: function(reso, max) {
            this.reference = [];
            this.detectColorNum = 0;
            this.colorResolution = reso || 16;
            this.max = max || 1;
        },
        attachDetectColor: function(sprite) {
            this.detectColorNum += 1;
            this.reference[this.detectColorNum] = sprite;
            return this._createNewColor();
        },
        detachDetectColor: function(sprite) {
            var i = this.reference.indexOf(sprite);
            if (i !== -1) {
                this.reference[i] = null;
            }
        },
        _createNewColor: function() {
            var n = this.detectColorNum;
            var C = this.colorResolution;
            var d = C / this.max;
            return [
                parseInt((n / C / C) % C, 10) / d,
                parseInt((n / C) % C, 10) / d,
                parseInt(n % C, 10) / d, 1.0
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

    var nodesWalker = function(pre, post) {
        pre = pre || function() {
        };
        post = post || function() {
        };
        var walker = function() {
            pre.apply(this, arguments);
            var child;
            if (this.childNodes) {
                for (var i = 0, l = this.childNodes.length; i < l; i++) {
                    child = this.childNodes[i];
                    walker.apply(child, arguments);
                }
            }
            post.apply(this, arguments);
        };
        return walker;
    };

    var makeTransformMatrix = function(node, dest) {
        var x = node._x;
        var y = node._y;
        var width = node._width || 0;
        var height = node._height || 0;
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
    };

    var alpha = function(ctx, node) {
        if (node.alphaBlending) {
            ctx.globalCompositeOperation = node.alphaBlending;
        } else {
            ctx.globalCompositeOperation = 'source-over';
        }
        ctx.globalAlpha = (typeof node.opacity === 'number') ? node.opacity : 1.0;
    };

    var _multiply = function(m1, m2, dest) {
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
    };

    var _multiplyVec = function(mat, vec, dest) {
        var x = vec[0], y = vec[1];
        var m11 = mat[0], m21 = mat[2], mdx = mat[4],
            m12 = mat[1], m22 = mat[3], mdy = mat[5];
        dest[0] = m11 * x + m21 * y + mdx;
        dest[1] = m12 * x + m22 * y + mdy;
    };

    var _stuck = [
        [ 1, 0, 0, 1, 0, 0 ]
    ];
    var _transform = function(mat) {
        var newmat = [];
        _multiply(_stuck[_stuck.length - 1], mat, newmat);
        _stuck.push(newmat);
    };

    var transform = function(ctx, node) {
        if (node._dirty) {
            makeTransformMatrix(node, node._cvsCache.matrix);
        }
        _transform(node._cvsCache.matrix);
        var mat = _stuck[_stuck.length - 1];
        ctx.setTransform.apply(ctx, mat);
        var ox = (typeof node._originX === 'number') ? node._originX : node._width / 2 || 0;
        var oy = (typeof node._originY === 'number') ? node._originY : node._height / 2 || 0;
        var vec = [ ox, oy ];
        _multiplyVec(mat, vec, vec);
        node._offsetX = vec[0] - ox;
        node._offsetY = vec[1] - oy;
        node._dirty = false;
    };

    var render = function(ctx, node) {
        var game = enchant.Game.instance;
        if (typeof node.visible !== 'undefined' && !node.visible) {
            return;
        }
        if (node.backgroundColor) {
            ctx.fillStyle = node.backgroundColor;
            ctx.fillRect(0, 0, node.width, node.height);
        }

        if (node.cvsRender) {
            node.cvsRender(ctx);
        }

        if (game._debug) {
            if (node instanceof enchant.Label || node instanceof enchant.Sprite) {
                ctx.strokeStyle = '#ff0000';
            } else {
                ctx.strokeStyle = '#0000ff';
            }
            ctx.strokeRect(0, 0, node.width, node.height);
        }
    };

    var rendering = nodesWalker(
        function(ctx) {
            ctx.save();
            alpha(ctx, this);
            transform(ctx, this);
            render(ctx, this);
        },
        function(ctx) {
            ctx.restore();
            _stuck.pop();
        }
    );

    var array2hexrgb = function(arr) {
        return '#' + ("00" + Number(parseInt(arr[0], 10)).toString(16)).slice(-2) +
            ("00" + Number(parseInt(arr[1], 10)).toString(16)).slice(-2) +
            ("00" + Number(parseInt(arr[2], 10)).toString(16)).slice(-2);
    };

    var detectrender = function(ctx, node) {
        ctx.fillStyle = node._cvsCache.detectColor;
        ctx.fillRect(0, 0, node.width, node.height);
    };

    var detectrendering = nodesWalker(
        function(ctx) {
            ctx.save();
            transform(ctx, this);
            detectrender(ctx, this);
        },
        function(ctx) {
            ctx.restore();
            _stuck.pop();
        }
    );

    var attachCache = nodesWalker(
        function(colorManager) {
            if (!this._cvsCache) {
                this._cvsCache = {};
                this._cvsCache.matrix = [ 1, 0, 0, 1, 0, 0 ];
                this._cvsCache.detectColor = array2hexrgb(colorManager.attachDetectColor(this));
            }
        }
    );

    var detachCache = nodesWalker(
        function(colorManager) {
            if (this._cvsCache) {
                colorManager.detachDetectColor(this);
                delete this._cvsCache;
            }
        }
    );

    var propagationUp = function(e, end) {
        this.dispatchEvent(e);
    };
}());

enchant.Scene = enchant.Class.create(enchant.Group, {
    initialize: function() {
        var game = enchant.Game.instance;
        enchant.Group.call(this);

        this.width = game.width;
        this.height = game.height;

        this.scene = this;

        this._element = document.createElement('div');
        this._element.style.width = this.width + 'px';
        this._element.style.height = this.height + 'px';
        this._element.style.position = 'absolute';
        this._element.style.overflow = 'hidden';
        this._element.style[enchant.ENV.VENDOR_PREFIX + 'TransformOrigin'] = '0 0';
        this._element.style[enchant.ENV.VENDOR_PREFIX + 'Transform'] = 'scale(' + enchant.Game.instance.scale + ')';

        this._layers = {};
        this._layerPriority = [];
        this.addLayer('Canvas');
        this.addLayer('Dom');
        this.addEventListener(enchant.Event.CHILD_ADDED, this._onchildadded);
        this.addEventListener(enchant.Event.CHILD_REMOVED, this._onchildremoved);
        this.addEventListener(enchant.Event.ENTER, this._onenter);
        this.addEventListener(enchant.Event.EXIT, this._onexit);
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
    addLayer: function(type, i) {
        var game = enchant.Game.instance;
        if (this._layers[type]) {
            return;
        }
        var layer = new enchant[type + 'Layer']();
        // TODO controll with enter, exit
        if (game.currentScene === this) {
            layer._startRendering();
        }
        this._layers[type] = layer;
        var element = layer._element;
        if (typeof i === 'number') {
            var nextSibling = this._element.childNodes.indexOf(i);
            this._element.insertBefore(element, nextSibling);
            this._layerPriority.splice(i, 0, type);
        } else {
            this._element.appendChild(element);
            this._layerPriority.push(type);
        }
        layer.scene = this;
    },
    _onchildadded: function(e) {
        var child = e.node;
        var next = e.next;
        if (next) {
        } else {
        }
    },
    _onchildremoved: function(e) {
        var child = e.node;
    },
    _onenter: function() {
        for (var type in this._layers) {
            this._layers[type]._startRendering();
        }
    },
    _onexit: function() {
        for (var type in this._layers) {
            this._layers[type]._stopRendering();
        }
    }
});

/**
 * @scope enchant.Surface.prototype
 */
enchant.Surface = enchant.Class.create(enchant.EventTarget, {
    /**
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

        var game = enchant.Game.instance;

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
     *   var src = game.assets['src.gif'];
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
 * @static
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

/**
 * @scope enchant.Sound.prototype
 */
enchant.Sound = enchant.Class.create(enchant.EventTarget, {
    /**
     * Class to wrap audio elements.
     *
     * Safari, Chrome, Firefox, Opera, and IE all play MP3 files
     * (Firefox and Opera play via Flash). WAVE files can be played on
     * Safari, Chrome, Firefox, and Opera. When the browser is not compatible with
     * the used codec the file will not play.
     *
     * Instances are created not via constructor but via {@link enchant.Sound.load}.
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
        if (this._element){
            this._element.play();
        }
    },
    /**
     * Pause playback.
     */
    pause: function() {
        if (this._element){
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
     * @return {enchant.Sound} Copied Sound.
     */
    clone: function() {
        var clone;
        if (this._element instanceof Audio) {
            clone = Object.create(enchant.Sound.prototype, {
                _element: { value: this._element.cloneNode(false) },
                duration: { value: this.duration }
            });
        } else if (enchant.ENV.USE_FLASH_SOUND) {
            return this;
        } else {
            clone = Object.create(enchant.Sound.prototype);
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
            if (this._element){
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
            if (this._element){
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
 * @static
 */
enchant.Sound.load = function(src, type) {
    if (type == null) {
        var ext = enchant.Game.findExt(src);
        if (ext) {
            type = 'audio/' + ext;
        } else {
            type = '';
        }
    }
    type = type.replace('mp3', 'mpeg').replace('m4a', 'mp4');

    var sound = Object.create(enchant.Sound.prototype);
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
            var id = 'enchant-audio' + enchant.Game.instance._soundID++;
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
            enchant.Game.instance._element.appendChild(embed);
            enchant.Sound[id] = sound;
        } else {
            window.setTimeout(function() {
                sound.dispatchEvent(new enchant.Event('load'));
            }, 0);
        }
    }
    return sound;
};


/**
 * ============================================================================================
 * Easing Equations v2.0
 * September 1, 2003
 * (c) 2003 Robert Penner, all rights reserved.
 * This work is subject to the terms in http://www.robertpenner.com/easing_terms_of_use.html.
 * ============================================================================================
 */

/**
 * イージング関数ライブラリ
 * ActionScript で広く使われている
 * Robert Penner による Easing Equations を JavaScript に移植した。
 * @type {Object}
 */
enchant.Easing = {
    LINEAR: function(t, b, c, d) {
        return c * t / d + b;
    },
    SWING: function(t, b, c, d) {
        return c * (0.5 - Math.cos(((t / d) * Math.PI)) / 2) + b;
    },
    // quad
    QUAD_EASEIN: function(t, b, c, d) {
        return c * (t /= d) * t + b;
    },
    QUAD_EASEOUT: function(t, b, c, d) {
        return -c * (t /= d) * (t - 2) + b;
    },
    QUAD_EASEINOUT: function(t, b, c, d) {
        if ((t /= d / 2) < 1) {
            return c / 2 * t * t + b;
        }
        return -c / 2 * ((--t) * (t - 2) - 1) + b;
    },
    // cubic
    CUBIC_EASEIN: function(t, b, c, d) {
        return c * (t /= d) * t * t + b;
    },
    CUBIC_EASEOUT: function(t, b, c, d) {
        return c * ((t = t / d - 1) * t * t + 1) + b;
    },
    CUBIC_EASEINOUT: function(t, b, c, d) {
        if ((t /= d / 2) < 1) {
            return c / 2 * t * t * t + b;
        }
        return c / 2 * ((t -= 2) * t * t + 2) + b;
    },
    // quart
    QUART_EASEIN: function(t, b, c, d) {
        return c * (t /= d) * t * t * t + b;
    },
    QUART_EASEOUT: function(t, b, c, d) {
        return -c * ((t = t / d - 1) * t * t * t - 1) + b;
    },
    QUART_EASEINOUT: function(t, b, c, d) {
        if ((t /= d / 2) < 1) {
            return c / 2 * t * t * t * t + b;
        }
        return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
    },
    // quint
    QUINT_EASEIN: function(t, b, c, d) {
        return c * (t /= d) * t * t * t * t + b;
    },
    QUINT_EASEOUT: function(t, b, c, d) {
        return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
    },
    QUINT_EASEINOUT: function(t, b, c, d) {
        if ((t /= d / 2) < 1) {
            return c / 2 * t * t * t * t * t + b;
        }
        return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
    },
    //sin
    SIN_EASEIN: function(t, b, c, d) {
        return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
    },
    SIN_EASEOUT: function(t, b, c, d) {
        return c * Math.sin(t / d * (Math.PI / 2)) + b;
    },
    SIN_EASEINOUT: function(t, b, c, d) {
        return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
    },
    // circ
    CIRC_EASEIN: function(t, b, c, d) {
        return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
    },
    CIRC_EASEOUT: function(t, b, c, d) {
        return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
    },
    CIRC_EASEINOUT: function(t, b, c, d) {
        if ((t /= d / 2) < 1) {
            return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
        }
        return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
    },
    // elastic
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
    BOUNCE_EASEIN: function(t, b, c, d) {
        return c - enchant.Easing.BOUNCE_EASEOUT(d - t, 0, c, d) + b;
    },
    BOUNCE_EASEINOUT: function(t, b, c, d) {
        if (t < d / 2) {
            return enchant.Easing.BOUNCE_EASEIN(t * 2, 0, c, d) * 0.5 + b;
        } else {
            return enchant.Easing.BOUNCE_EASEOUT(t * 2 - d, 0, c, d) * 0.5 + c * 0.5 + b;
        }

    },
    // back
    BACK_EASEIN: function(t, b, c, d, s) {
        if (s === undefined) {
            s = 1.70158;
        }
        return c * (t /= d) * t * ((s + 1) * t - s) + b;
    },
    BACK_EASEOUT: function(t, b, c, d, s) {
        if (s === undefined) {
            s = 1.70158;
        }
        return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
    },
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
    EXPO_EASEIN: function(t, b, c, d) {
        return (t === 0) ? b : c * Math.pow(2, 10 * (t / d - 1)) + b;
    },
    EXPO_EASEOUT: function(t, b, c, d) {
        return (t === d) ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b;
    },
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
     * イベントリスナの実行時にコンテキストを this.target にするよう書き換えた EventTarget
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
     * タイムラインクラス。
     * アクションを管理するためのクラス。
     * 操作するノードひとつに対して、必ずひとつのタイムラインが対応する。
     *
     * tl.enchant.js を読み込むと、Node クラスを継承したすべてのクラス (Group, Scene, Entity, Label, Sprite)の
     * tl プロパティに、タイムラインクラスのインスタンスが生成される。
     * タイムラインクラスは、自身に様々なアクションを追加するメソッドを持っており、
     * これらを使うことで簡潔にアニメーションや様々な操作をすることができる。
     * タイムラインクラスはフレームとタイムのアニメーションができる。
     *
     * @constructs
     * @param node 操作の対象となるノード
     * @param [unitialized] このパラメータはtrueだったら、
     * 最初のaddメソッド呼ぶ時nodeにenchant.Event.ENTER_FRAMEイベントリスナを追加される。
     */
    initialize: function(node, unitialized) {
        enchant.EventTarget.call(this);
        this.node = node;
        this.queue = [];
        this.paused = false;
        this.looped = false;
        this.isFrameBased = true;
        this._parallel = null;
        this._initialized = !unitialized;
        this.addEventListener(enchant.Event.ENTER_FRAME, this.tick);
    },
    /**
     * 一つのenchant.Event.ENTER_FRAMEイベントはアニメーションに一つの時間単位になる。 （デフォルト）
     */
    setFrameBased: function() {
        this.isFrameBased = true;
    },
    /**
     * 一つのenchant.Event.ENTER_FRAMEイベントはアニメーションに前のフレームから経過した時間になる。
     */
    setTimeBased: function() {
        this.isFrameBased = false;
    },
    /**
     * キューの先頭にあるアクションを終了し、次のアクションへ移行する。
     * アクションの中から呼び出されるが、外から呼び出すこともできる。
     *
     * アクション実行中に、アクションが終了した場合、
     * もう一度 tick() 関数が呼ばれるため、1フレームに複数のアクションが処理される場合もある。
     * ex.
     *   sprite.tl.then(function A(){ .. }).then(function B(){ .. });
     * と記述した場合、最初のフレームで A・B の関数どちらも実行される
     *
     */
    next: function(remainingTime) {
        var e, action = this.queue.shift();
        e = new enchant.Event("actionend");
        e.timeline = this;
        action.dispatchEvent(e);

        if (this.looped) {
            e = new enchant.Event("removedfromtimeline");
            e.timeline = this;
            action.dispatchEvent(e);

            action.frame = 0;

            this.add(action);
        } else {
            // イベントを発行して捨てる
            e = new enchant.Event("removedfromtimeline");
            e.timeline = this;
            action.dispatchEvent(e);
        }
        var event = new enchant.Event("enterframe");
        event.elapsed = Math.max(remainingTime, 1);
        this.dispatchEvent(event);
    },
    /**
     * ターゲットの enterframe イベントのリスナとして登録される関数
     * 1フレーム経過する際に実行する処理が書かれている。
     * (キューの先頭にあるアクションに対して、actionstart/actiontickイベントを発行する)
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
        if (!this._initialized) {
            var tl = this;
            this.node.addEventListener("enterframe", function(e) {
                tl.dispatchEvent(e);
            });
            this._initialized = true;
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
     * アクションを簡単に追加するためのメソッド。
     * 実体は add メソッドのラッパ。
     * @param params アクションの設定オブジェクト
     */
    action: function(params) {
        return this.add(new enchant.Action(params));
    },
    /**
     * トゥイーンを簡単に追加するためのメソッド。
     * 実体は add メソッドのラッパ。
     * @param params トゥイーンの設定オブジェクト。
     */
    tween: function(params) {
        return this.add(new enchant.Tween(params));
    },
    /**
     * タイムラインのキューをすべて破棄する。終了イベントは発行されない。
     */
    clear: function() {
        var e = new enchant.Event("removedfromtimeline");
        e.timeline = this;

        for (var i = 0, len = this.queue.length; i < len; i++) {
            this.queue[i].dispatchEvent(e);
        }
        this.queue = [];
        return this;
    },
    /**
     * タイムラインを早送りする。
     * 指定したフレーム数が経過したのと同様の処理を、瞬時に実行する。
     * 巻き戻しはできない。
     * @param frames
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
     * タイムラインの実行を一時停止する
     */
    pause: function() {
        this.paused = true;
        return this;
    },
    /**
     * タイムラインの実行を再開する
     */
    resume: function() {
        this.paused = false;
        return this;
    },
    /**
     * タイムラインをループさせる。
     * ループしているときに終了したアクションは、タイムラインから取り除かれた後
     * 再度タイムラインに追加される。このアクションは、ループが解除されても残る。
     */
    loop: function() {
        this.looped = true;
        return this;
    },
    /**
     * タイムラインのループを解除する。
     */
    unloop: function() {
        this.looped = false;
        return this;
    },
    /**
     * 指定したフレーム数だけ待ち、何もしないアクションを追加する。
     * @param time
     */
    delay: function(time) {
        this.add(new enchant.Action({
            time: time
        }));
        return this;
    },
    /**
     * @ignore
     * @param time
     */
    wait: function(time) {
        // reserved
        return this;
    },
    /**
     * 関数を実行し、即時に次のアクションに移るアクションを追加する。
     * @param func
     */
    then: function(func) {
        var timeline = this;
        this.add(new enchant.Action({
            onactiontick: function(evt) {
                func.call(timeline.node);
                timeline.next(evt.elapsed);
            }
        }));
        return this;
    },
    /**
     * then メソッドのシノニム。
     * 関数を実行し、即時に次のアクションに移る。
     * @param func
     */
    exec: function(func) {
        this.then(func);
    },
    /**
     * 実行したい関数を、フレーム数をキーとした連想配列(オブジェクト)で複数指定し追加する。
     * 内部的には delay, then を用いている。
     *
     * @example
     * sprite.tl.cue({
     *    10: function(){ 10フレーム経過した後に実行される関数 },
     *    20: function(){ 20フレーム経過した後に実行される関数 },
     *    30: function(){ 30フレーム経過した後に実行される関数 }
     * });
     * @param cue キューオブジェクト
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
     * ある関数を指定したフレーム数繰り返し実行するアクションを追加する。
     * @param func 実行したい関数
     * @param time 持続フレーム数
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
     * 複数のアクションを並列で実行したいときに指定する。
     * and で結ばれたすべてのアクションが終了するまで次のアクションには移行しない
     * @example
     * sprite.tl.fadeIn(30).and.rotateBy(360, 30);
     * 30フレームでフェードインしながら 360度回転する
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
     * true値 が返るまで、関数を毎フレーム実行するアクションを追加する。
     * @example
     * sprite.tl.waitUntil(function(){
     *    return this.x-- < 0
     * }).then(function(){ .. });
     * // x 座標が負になるまで毎フレーム x座標を減算し続ける
     *
     * @param func 実行したい関数
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
     * Entity の不透明度をなめらかに変えるアクションを追加する。
     * @param opacity 目標の不透明度
     * @param time フレーム数
     * @param [easing] イージング関数
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
     * Entity をフェードインするアクションを追加する。
     * fadeTo(1) のエイリアス。
     * @param time フレーム数
     * @param [easing] イージング関数
     */
    fadeIn: function(time, easing) {
        return this.fadeTo(1, time, easing);
    },
    /**
     * Entity をフェードアウトするアクションを追加する。
     * fadeTo(1) のエイリアス。
     * @param time フレーム数
     * @param [easing] イージング関数
     */
    fadeOut: function(time, easing) {
        return this.fadeTo(0, time, easing);
    },
    /**
     * Entity の位置をなめらかに移動させるアクションを追加する。
     * @param x 目標のx座標
     * @param y 目標のy座標
     * @param time フレーム数
     * @param [easing] イージング関数
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
     * Entity のx座標をなめらかに変化させるアクションを追加する。
     * @param x
     * @param time
     * @param [easing]
     */
    moveX: function(x, time, easing) {
        return this.tween({
            x: x,
            time: time,
            easing: easing
        });
    },
    /**
     * Entity のy座標をなめらかに変化させるアクションを追加する。
     * @param y
     * @param time
     * @param [easing]
     */
    moveY: function(y, time, easing) {
        return this.tween({
            y: y,
            time: time,
            easing: easing
        });
    },
    /**
     * Entity の位置をなめらかに変化させるアクションを追加する。
     * 座標は、アクション開始時からの相対座標で指定する。
     * @param x
     * @param y
     * @param time
     * @param [easing]
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
     * Entity の opacity を0にする (即時)
     */
    hide: function() {
        return this.then(function() {
            this.opacity = 0;
        });
    },
    /**
     * Entity の opacity を1にする (即時)
     */
    show: function() {
        return this.then(function() {
            this.opacity = 1;
        });
    },
    /**
     * Entity をシーンから削除する。
     * シーンから削除された場合、 enterframe イベントは呼ばれなくなるので、
     * タイムラインも止まることに注意。
     * これ以降のアクションは、再度シーンに追加されるまで実行されない。
     */
    removeFromScene: function() {
        return this.then(function() {
            this.scene.removeChild(this);
        });
    },
    /**
     * Entity をなめらかに拡大・縮小するアクションを追加する。
     * @param scaleX 縮尺
     * @param [scaleY] 縮尺。省略した場合 scaleX と同じ
     * @param time
     * @param [easing]
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
     * Entity をなめらかに拡大・縮小させるアクションを追加する。
     * 相対縮尺 (ex. アクション開始時の縮尺の n 倍) で指定する。
     * @param scaleX 相対縮尺
     * @param [scaleY] 相対縮尺。省略した場合 scaleX と同じ
     * @param time
     * @param [easing]
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
     * Entity をなめらかに回転させるアクションを追加する。
     * @param deg 目標の回転角度 (弧度法: 1回転を 360 とする)
     * @param time フレーム数
     * @param [easing] イージング関数
     */
    rotateTo: function(deg, time, easing) {
        return this.tween({
            rotation: deg,
            time: time,
            easing: easing
        });
    },
    /**
     * Entity をなめらかに回転させるアクションを追加する。
     * 角度は相対角度 (アクション開始時の角度から更に n 度) で指定する
     * @param deg 目標の相対角度 (弧度法: 1回転を 360 とする)
     * @param time フレーム数
     * @param [easing] イージング関数
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
     * @class
     * アクションクラス。
     * アクションはタイムラインを構成する単位であり、
     * 実行したい処理を指定するためのユニットである。
     * タイムラインに追加されたアクションは順に実行される。
     *
     * アクションが開始・終了された時に actionstart, actiontick イベントが発行され、
     * また1フレーム経過した時には actiontick イベントが発行される。
     * これらのイベントのリスナとして実行したい処理を指定する。
     *
     * time で指定されたフレーム数が経過すると自動的に次のアクションに移行するが、
     * null が指定されると、タイムラインの next メソッドが呼ばれるまで移行しない。
     *
     * @constructs
     * @param param
     * @config {integer} [time] アクションが持続するフレーム数。 null が指定されると無限長
     * @config {function} [onactionstart] アクションが開始される時のイベントリスナ
     * @config {function} [onactiontick] アクションが1フレーム経過するときのイベントリスナ
     * @config {function} [onactionend] アクションがが終了する時のイベントリスナ
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
     * アクションを並列で実行するためのアクション。
     * 子アクションを複数持つことができる。
     * @constructs
     * @extends enchant.Action
     */
    initialize: function(param) {
        enchant.Action.call(this, param);
        var timeline = this.timeline;
        var node = this.node;
        /**
         * 子アクション
         */
        this.actions = [];
        /**
         * 実行が終了したアクション
         */
        this.endedActions = [];
        var that = this;

        this.addEventListener(enchant.Event.ACTION_START, function(evt) {
            // start するときは同時
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

                    // イベントを発行
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
            // 残りアクションが 0 になったら次のアクションへ
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
            // すべて戻す
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
     * トゥイーンクラス。
     * アクションを扱いやすく拡張したクラス。
     * オブジェクトの特定のプロパティを、なめらかに変更したい時に用いる。
     *
     * コンストラクタに渡す設定オブジェクトに、プロパティの目標値を指定すると、
     * アクションが実行された時に、目標値までなめらかに値を変更するようなアクションを生成する。
     *
     * トゥイーンのイージングも、easing プロパティで指定できる。
     * デフォルトでは enchant.Easing.LINEAR が指定されている。
     *
     * @param params
     * @constructs
     * @config {time}
     * @config {easing} [function]
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
            // トゥイーンの対象とならないプロパティ
            var excepted = ["frame", "time", "callback", "onactiontick", "onactionstart", "onactionend"];
            for (var prop in params) {
                if (params.hasOwnProperty(prop)) {
                    // 値の代わりに関数が入っていた場合評価した結果を用いる
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
            var ratio = tween.easing(Math.min(tween.time,tween.frame + evt.elapsed), 0, 1, tween.time) - tween.easing(tween.frame, 0, 1, tween.time);
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
