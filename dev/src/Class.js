/**
 * @name enchant.Class
 * @class
 [lang:ja]
 * クラスのクラス.
 * @param {Function} [superclass] 継承するクラス.
 * @param {*} [definition] クラス定義.
 [/lang]
 [lang:en]
 * A Class representing a class which supports inheritance.
 * @param {Function} [superclass] The class from which the
 * new class will inherit the class definition.
 * @param {*} [definition] Class definition.
 [/lang]
 [lang:de]
 * Eine Klasse für Klassen, die Vererbung unterstützen.
 * @param {Function} [superclass] Die Klasse, deren Klassendefinition
 * die neue Klasse erben wird.
 * @param {*} [definition] Klassendefinition.
 [/lang]
 * @constructor
 */
enchant.Class = function(superclass, definition) {
    return enchant.Class.create(superclass, definition);
};

/**
 [lang:ja]
 * クラスを作成する.
 *
 * ほかのクラスを継承したクラスを作成する場合, コンストラクタはデフォルトで
 * 継承元のクラスのものが使われる. コンストラクタをオーバーライドする場合継承元の
 * コンストラクタを適用するには明示的に呼び出す必要がある.
 *
 * @example
 * var Ball = Class.create({ // 何も継承しないクラスを作成する
 *     initialize: function(radius) { ... }, // メソッド定義
 *     fall: function() { ... }
 * });
 *
 * var Ball = Class.create(Sprite);  // Spriteを継承したクラスを作成する
 * var Ball = Class.create(Sprite, { // Spriteを継承したクラスを作成する
 *     initialize: function(radius) { // コンストラクタを上書きする
 *         Sprite.call(this, radius * 2, radius * 2); // 継承元のコンストラクタを適用する
 *         this.image = core.assets['ball.gif'];
 *     }
 * });
 *
 * @param {Function} [superclass] 継承するクラス.
 * @param {*} [definition] クラス定義.
 [/lang]
 [lang:en]
 * Creates a class.
 *
 * When defining a class that extends from another class, 
 * the constructor of the other class will be used by default.
 * Even if you override this constructor, you must still call it
 * to ensure that the class is initialized correctly.
 *
 * @example
 * // Creates a Ball class.
 * var Ball = Class.create({ 
 *
 *     // Ball's constructor
 *     initialize: function(radius) {
 *       // ... code ...
 *     }, 
 *
 *     // Defines a fall method that doesn't take any arguments.
 *     fall: function() { 
 *       // ... code ...
 *     }
 * });
 *
 * // Creates a Ball class that extends from "Sprite"
 * var Ball = Class.create(Sprite);  
 *
 * // Creates a Ball class that extends from "Sprite"
 * var Ball = Class.create(Sprite, { 
 *
 *     // Overwrite Sprite's constructor
 *     initialize: function(radius) { 
 *
 *         // Call Sprite's constructor.
 *         Sprite.call(this, radius * 2, radius * 2);
 *
 *         this.image = core.assets['ball.gif'];
 *     }
 * });
 *
 * @param {Function} [superclass] The class from which the
 * new class will inherit the class definition.
 * @param {*} [definition] Class definition.
 [/lang]
 [lang:de]
 * Erstellt eine neue Klasse
 *
 * Wenn eine Klasse definiert wird, die von einer anderen Klasse erbt, wird der Konstruktor der
 * Basisklasse als Standard definiert. Sollte dieser Konstruktor in der neuen Klasse überschrieben
 * werden, sollte der vorherige Konstruktor explizit aufgerufen werden, um eine korrekte
 * Klasseninitialisierung sicherzustellen.
 *
 * @example
 * var Ball = Class.create({ // definiert eine unabhängige Klasse.
 *     initialize: function(radius) { ... }, // Methodendefinitionen
 *     fall: function() { ... }
 * });
 *
 *   var Ball = Class.create(Sprite);  // definiert eine Klasse die von "Sprite" erbt.
 *   var Ball = Class.create(Sprite, { // definiert eine Klasse die von "Sprite" erbt.
 *       initialize: function(radius) { // überschreibt den Standardkonstruktor.
 *           Sprite.call(this, radius * 2, radius * 2); // Aufruf des Konstruktors der Basisklasse.
 *           this.image = core.assets['ball.gif'];
 *       }
 *   });
 *
 * @param {Function} [superclass] The class from which the
 * new class will inherit the class definition.
 * @param {*} [definition] Class definition.
 [/lang]
 * @static
 */
enchant.Class.create = function(superclass, definition) {
    if (superclass == null && definition) {
        throw new Error("superclass is undefined (enchant.Class.create)");
    } else if (superclass == null) {
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
 [lang:ja]
 * クラスの継承関係を取得する.
 * @param {Function} コンストラクタ.
 * @return {Function[]} 親のコンストラクタ.
 [/lang]
 [lang:en]
 * Get the inheritance tree of this class.
 * @param {Function} Constructor
 * @return {Function[]} Parent's constructor
 [/lang]
 [lang:de]
 * @param {Function}
 * @return {Function[]}
 [/lang]
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
