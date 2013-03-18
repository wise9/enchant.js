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
            var currentTime = window.getTime();
            var _id = setTimeout(function() {
                func(window.getTime());
            }, Math.max(0, lastTime + frame - currentTime));
            lastTime = currentTime;
            return _id;
        };
    }());

/**
 [lang:ja]
 * グローバルにライブラリのクラスをエクスポートする.
 *
 * 引数に何も渡さない場合enchant.jsで定義されたクラス及びプラグインで定義されたクラス
 * 全てがエクスポートされる. 引数が一つ以上の場合はenchant.jsで定義されたクラスのみ
 * がデフォルトでエクスポートされ, プラグインのクラスをエクスポートしたい場合は明示的に
 * プラグインの識別子を引数として渡す必要がある.
 *
 * @example
 *   enchant();     // 全てのクラスがエクスポートされる
 *   enchant('');   // enchant.js本体のクラスのみがエクスポートされる
 *   enchant('ui'); // enchant.js本体のクラスとui.enchant.jsのクラスがエクスポートされる
 *
 * @param {...String} [modules] エクスポートするモジュール. 複数指定できる.
 [/lang]
 [lang:en]
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
 [/lang]
 [lang:de]
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
 [/lang]
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
