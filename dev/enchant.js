/**
 * enchant.js v0.4.5
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

if (typeof Object.defineProperty != 'function') {
    Object.defineProperty = function(obj, prop, desc) {
        if ('value' in desc) obj[prop] =  desc.value;
        if ('get' in desc) obj.__defineGetter__(prop, desc.get);
        if ('set' in desc) obj.__defineSetter__(prop, desc.set);
        return obj;
    };
}
if (typeof Object.defineProperties != 'function') {
    Object.defineProperties = function(obj, descs) {
        for (var prop in descs) if (descs.hasOwnProperty(prop))  {
            Object.defineProperty(obj, prop, descs[prop]);
        }
        return obj;
    };
}
if (typeof Object.create != 'function') {
    Object.create = function(prototype, descs) {
        function F() {};
        F.prototype = prototype;
        var obj = new F();
        if (descs != null) Object.defineProperties(obj, descs);
        return obj;
    };
}
if (typeof Object.getPrototypeOf != 'function') {
    Object.getPrototypeOf = function(obj) {
        return obj.__proto__;
    };
}

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
 * Export library classes globally.
 *
 * When no arguments are delivered, all classes defined in enchant.js as well as all classes defined in
 * plugins will be exported. When more than one argument is delivered, by default only classes defined
 * in enchant.js will be exported. When you wish to export plugin classes you must explicitly deliver  *  * plugin identifiers as arguments.
 *
 * @example
 *   enchant();     // All classes will be exported.
 *   enchant('');   // Only classes in enchant.js will be exported.
 *   enchant('ui'); // enchant.js classes and ui.enchant.js classes will be exported.
 *
 * @param {...String} [modules] Export module. Multiple designations possible.
[/lang]
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
        var submodules = [];
        for (var prop in module) if (module.hasOwnProperty(prop)) {
            if (typeof module[prop] == 'function') {
                window[prop] = module[prop];
            } else if (typeof module[prop] == 'object' && Object.getPrototypeOf(module[prop]) == Object.prototype) {
                if (modules == null) {
                    submodules.push(prop);
                } else {
                    i = modules.indexOf(prefix + prop);
                    if (i != -1) {
                        submodules.push(prop);
                        modules.splice(i, 1);
                    }
                }
            }
        }
        for (var i = 0, len = submodules.length; i < len; i++) {
            include(module[submodules[i]], prefix + submodules[i] + '.');
        }
    })(enchant, '');

    if (modules != null && modules.length) {
        throw new Error('Cannot load module: ' + modules.join(', '));
    }
};

(function() {

"use strict";

var VENDER_PREFIX = (function() {
    var ua = navigator.userAgent;
    if (ua.indexOf('Opera') != -1) {
        return 'O';
    } else if (ua.indexOf('MSIE') != -1) {
        return 'ms';
    } else if (ua.indexOf('WebKit') != -1) {
        return 'webkit';
    } else if (navigator.product == 'Gecko') {
        return 'Moz';
    } else {
        return '';
    }
})();
var TOUCH_ENABLED = (function() {
    var div = document.createElement('div');
    div.setAttribute('ontouchstart', 'return');
    return typeof div.ontouchstart == 'function';
})();
var RETINA_DISPLAY = (function() {
    if (navigator.userAgent.indexOf('iPhone') != -1 && window.devicePixelRatio == 2) {
        var viewport = document.querySelector('meta[name="viewport"]');
        if (viewport == null) {
            viewport = document.createElement('meta');
            document.head.appendChild(viewport);
        }
        viewport.setAttribute('content', 'width=640px');
        return true;
    } else {
        return false;
    }
})();
var USE_FLASH_SOUND = (function() {
    var ua = navigator.userAgent;
    var vendor = navigator.vendor || "";
    if(location.href.indexOf('http') == 0 && ua.indexOf('Mobile') == -1 && vendor.indexOf('Apple') != -1){
        return true;
    }
    return false;
})();

// the running instance
var game;

/**
[lang:ja]
 * クラスのクラス.
 *
 * @param {Function} [superclass] 継承するクラス.
 * @param {*} definition クラス定義.
 * @constructor
[/lang]
[lang:en]
 * Class Classes
 *
 * @param {Function} [superclass] Successor class.
 * @param {*} definition Class definition.
 * @constructor
[/lang]
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
 *   var Ball = Class.create({ // 何も継承しないクラスを作成する
 *       initialize: function(radius) { ... }, // メソッド定義
 *       fall: function() { ... }
 *   });
 *
 *   var Ball = Class.create(Sprite);  // Spriteを継承したクラスを作成する
 *   var Ball = Class.create(Sprite, { // Spriteを継承したクラスを作成する
 *       initialize: function(radius) { // コンストラクタを上書きする
 *          Sprite.call(this, radius*2, radius*2); // 継承元のコンストラクタを適用する
 *          this.image = game.assets['ball.gif'];
 *       }
 *   });
 *
 * @param {Function} [superclass] 継承するクラス.
 * @param {*} [definition] クラス定義.
 * @static
[/lang]
[lang:en]
 * Create class.
 *
 * When making classes that succeed other classes, the previous class is used as a base with
 * constructor as default. In order to override the constructor, it is necessary to explicitly
 * call up the previous constructor to use it.
 *
 * @example
 *   var Ball = Class.create({ // Creates independent class.
 *       initialize: function(radius) { ... }, // Method definition.
 *       fall: function() { ... }
 *   });
 *
 *   var Ball = Class.create(Sprite);  // Creates a class succeeding "Sprite"
 *   var Ball = Class.create(Sprite, { // Creates a class succeeding "Sprite"
 *       initialize: function(radius) { // Overwrites constructor
 *          Sprite.call(this, radius*2, radius*2); // Applies previous constructor.
 *          this.image = game.assets['ball.gif'];
 *       }
 *   });
 *
 * @param {Function} [superclass] Preceding class.
 * @param {*} [definition] Class definition.
 * @static
[/lang]
 */
enchant.Class.create = function(superclass, definition) {
    if (arguments.length == 0) {
        return enchant.Class.create(Object, definition);
    } else if (arguments.length == 1 && typeof arguments[0] != 'function') {
        return enchant.Class.create(Object, arguments[0]);
    }

    for (var prop in definition) if (definition.hasOwnProperty(prop)) {
        if (typeof definition[prop] == 'object' && Object.getPrototypeOf(definition[prop]) == Object.prototype) {
            if (!('enumerable' in definition[prop])) definition[prop].enumerable = true;
        } else {
            definition[prop] = { value: definition[prop], enumerable: true, writable: true };
        }
    }
    var constructor = function() {
        if (this instanceof constructor) {
            constructor.prototype.initialize.apply(this, arguments);
        } else {
            return new constructor();
        }
    };
    constructor.prototype = Object.create(superclass.prototype, definition);
    constructor.prototype.constructor = constructor;
    if (constructor.prototype.initialize == null) {
        constructor.prototype.initialize = function() {
            superclass.apply(this, arguments);
        };
    }

    return constructor;
};

/**
 * @scope enchant.Event.prototype
 */
enchant.Event = enchant.Class.create({
    /**
[lang:ja]
     * DOM Event風味の独自イベント実装を行ったクラス.
     * ただしフェーズの概念はなし.
     * @param {String} type Eventのタイプ
     * @constructs
[/lang]
[lang:en]
     * A class for independent event implementation like DOM Events.
     * However, does not include phase concept.
     * @param {String} type Event type.
     * @constructs
[/lang]
     */
    initialize: function(type) {
        /**
[lang:ja]
         * イベントのタイプ.
         * @type {String}
[/lang]
[lang:en]
         * Event type.
         * @type {String}
[/lang]
         */
        this.type = type;
        /**
[lang:ja]
         * イベントのターゲット.
         * @type {*}
[/lang]
[lang:en]
         * Event target.
         * @type {*}
[/lang]
         */
        this.target = null;
        /**
[lang:ja]
         * イベント発生位置のx座標.
         * @type {Number}
[/lang]
[lang:en]
         * Event occurrence's x coordinates.
         * @type {Number}
[/lang]
         */
        this.x = 0;
        /**
[lang:ja]
         * イベント発生位置のy座標.
         * @type {Number}
[/lang]
[lang:en]
         * Event occurrence's y coordinates.
         * @type {Number}
[/lang]
         */
        this.y = 0;
        /**
[lang:ja]
         * イベントを発行したオブジェクトを基準とするイベント発生位置のx座標.
         * @type {Number}
[/lang]
[lang:en]
         * X coordinates for event occurrence standard event-issuing object.
         * @type {Number}
[/lang]
         */
        this.localX = 0;
        /**
[lang:ja]
         * イベントを発行したオブジェクトを基準とするイベント発生位置のy座標.
         * @type {Number}
[/lang]
[lang:en]
         * Y coordinates for event occurrence standard event-issuing object.
         * @type {Number}
[/lang]
         */
        this.localY = 0;
    },
    _initPosition: function(pageX, pageY) {
        this.x = this.localX = (pageX - game._pageX) / game.scale;
        this.y = this.localY = (pageY - game._pageY) / game.scale;
    }
});

/**
[lang:ja]
 * Gameのロード完了時に発生するイベント.
 *
 * 画像のプリロードを行う場合ロードが完了するのを待ってゲーム開始時の処理を行う必要がある.
 * 発行するオブジェクト: enchant.Game
 *
 * @example
 *   var game = new Game(320, 320);
 *   game.preload('player.gif');
 *   game.onload = function() {
 *      ... // ゲーム開始時の処理を記述
 *   };
 *   game.start();
 *
 * @type {String}
[/lang]
[lang:en]
 * Event activated upon completion of game loading.
 *
 * It is necessary to wait for loading to finish and to do initial processing when preloading images.
 * Issued object: enchant.Game
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
[/lang]
 */
enchant.Event.LOAD = 'load';

/**
[lang:ja]
 * Gameのロード進行中に発生するイベント.
 * プリロードする画像が一枚ロードされる度に発行される. 発行するオブジェクト: enchant.Game
 * @type {String}
[/lang]
[lang:en]
 * Events occurring during game loading.
 * Activated each time a preloaded image is loaded. Issued object: enchant.Game
 * @type {String}
[/lang]
 */
enchant.Event.PROGRESS = 'progress';

/**
[lang:ja]
 * フレーム開始時に発生するイベント.
 * 発行するオブジェクト: enchant.Game, enchant.Node
 * @type {String}
[/lang]
[lang:en]
 * Events occurring during frame start.
 * Issued object: enchant.Game, enchant.Node
 * @type {String}
[/lang]
 */
enchant.Event.ENTER_FRAME = 'enterframe';

/**
[lang:ja]
 * フレーム終了時に発生するイベント.
 * 発行するオブジェクト: enchant.Game
 * @type {String}
[/lang]
[lang:en]
 * Events occurring during frame end.
 * Issued object: enchant.Game
 * @type {String}
[/lang]
 */
enchant.Event.EXIT_FRAME = 'exitframe';

/**
[lang:ja]
 * Sceneが開始したとき発生するイベント.
 * 発行するオブジェクト: enchant.Scene
 * @type {String}
[/lang]
[lang:en]
 * Events occurring during Scene beginning.
 * Issued object: enchant.Scene
 * @type {String}
[/lang]
 */
enchant.Event.ENTER = 'enter';

/**
[lang:ja]
 * Sceneが終了したとき発生するイベント.
 * 発行するオブジェクト: enchant.Scene
 * @type {String}
[/lang]
[lang:en]
 * Events occurring during Scene end.
 * Issued object: enchant.Scene
 * @type {String}
[/lang]
 */
enchant.Event.EXIT = 'exit';

/**
[lang:ja]
 * NodeがGroupに追加されたとき発生するイベント.
 * 発行するオブジェクト: enchant.Node
 * @type {String}
[/lang]
[lang:en]
 * Event occurring when Node is added to Group.
 * Issued object: enchant.Node
 * @type {String}
[/lang]
 */
enchant.Event.ADDED = 'added';

/**
[lang:ja]
 * NodeがSceneに追加されたとき発生するイベント.
 * 発行するオブジェクト: enchant.Node
 * @type {String}
[/lang]
[lang:en]
 * Event occurring when Node is added to Scene.
 * Issued object: enchant.Node
 * @type {String}
[/lang]
 */
enchant.Event.ADDED_TO_SCENE = 'addedtoscene';

/**
[lang:ja]
 * NodeがGroupから削除されたとき発生するイベント.
 * 発行するオブジェクト: enchant.Node
 * @type {String}
[/lang]
[lang:en]
 * Event occurring when Node is deleted from Group.
 * Issued object: enchant.Node
 * @type {String}
[/lang]
 */
enchant.Event.REMOVED = 'removed';

/**
[lang:ja]
 * NodeがSceneから削除されたとき発生するイベント.
 * 発行するオブジェクト: enchant.Node
 * @type {String}
[/lang]
[lang:en]
 * Event occurring when Node is deleted from Scene.
 * Issued object: enchant.Node
 * @type {String}
[/lang]
 */
enchant.Event.REMOVED_FROM_SCENE = 'removedfromscene';

/**
[lang:ja]
 * Nodeに対するタッチが始まったとき発生するイベント.
 * クリックもタッチとして扱われる. 発行するオブジェクト: enchant.Node
 * @type {String}
[/lang]
[lang:en]
 * Event occurring when touch corresponding to Node has begun.
 * Click is also treated as touch. Issued object: enchant.Node
 * @type {String}
[/lang]
 */
enchant.Event.TOUCH_START = 'touchstart';

/**
[lang:ja]
 * Nodeに対するタッチが移動したとき発生するイベント.
 * クリックもタッチとして扱われる. 発行するオブジェクト: enchant.Node
 * @type {String}
[/lang]
[lang:en]
 * Event occurring when touch corresponding to Node has been moved.
 * Click is also treated as touch. Issued object: enchant.Node
 * @type {String}
[/lang]
 */
enchant.Event.TOUCH_MOVE = 'touchmove';

/**
[lang:ja]
 * Nodeに対するタッチが終了したとき発生するイベント.
 * クリックもタッチとして扱われる. 発行するオブジェクト: enchant.Node
 * @type {String}
[/lang]
[lang:en]
 * Event occurring when touch corresponding to touch has ended.
 * Click is also treated as touch. Issued object: enchant.Node
 * @type {String}
[/lang]
 */
enchant.Event.TOUCH_END = 'touchend';

/**
[lang:ja]
 * Entityがレンダリングされるときに発生するイベント.
 * 発行するオブジェクト: enchant.Entity
 * @type {String}
[/lang]
[lang:en]
 * Event occurring when Entity is rendered.
 * Issued object: enchant.Entity
 * @type {String}
[/lang]
 */
enchant.Event.RENDER = 'render';

/**
[lang:ja]
 * ボタン入力が始まったとき発生するイベント.
 * 発行するオブジェクト: enchant.Game, enchant.Scene
 * @type {String}
[/lang]
[lang:en]
 * Event occurring when button is pushed.
 * Issued object: enchant.Game, enchant.Scene
 * @type {String}
[/lang]
 */
enchant.Event.INPUT_START = 'inputstart';

/**
[lang:ja]
 * ボタン入力が変化したとき発生するイベント.
 * 発行するオブジェクト: enchant.Game, enchant.Scene
 * @type {String}
[/lang]
[lang:en]
 * Event occurring when button input changes.
 * Issued object: enchant.Game, enchant.Scene
 * @type {String}
[/lang]
 */
enchant.Event.INPUT_CHANGE = 'inputchange';

/**
[lang:ja]
 * ボタン入力が終了したとき発生するイベント.
 * 発行するオブジェクト: enchant.Game, enchant.Scene
 * @type {String}
[/lang]
[lang:en]
 * Event occurring when button input ends.
 * Issued object: enchant.Game, enchant.Scene
 * @type {String}
[/lang]
 */
enchant.Event.INPUT_END = 'inputend';

/**
[lang:ja]
 * leftボタンが押された発生するイベント.
 * 発行するオブジェクト: enchant.Game, enchant.Scene
 * @type {String}
[/lang]
[lang:en]
 * Event occurring when left button is pushed.
 * Issued object: enchant.Game, enchant.Scene
 * @type {String}
[/lang]
 */
enchant.Event.LEFT_BUTTON_DOWN = 'leftbuttondown';

/**
[lang:ja]
 * leftボタンが離された発生するイベント.
 * 発行するオブジェクト: enchant.Game, enchant.Scene
 * @type {String}
[/lang]
[lang:en]
 * Event occurring when left button is released.
 * Issued object: enchant.Game, enchant.Scene
 * @type {String}
[/lang]
 */
enchant.Event.LEFT_BUTTON_UP = 'leftbuttonup';

/**
[lang:ja]
 * rightボタンが押された発生するイベント.
 * 発行するオブジェクト: enchant.Game, enchant.Scene
 * @type {String}
[/lang]
[lang:en]
 * Event occurring when right button is pushed.
 * Issued object: enchant.Game, enchant.Scene
 * @type {String}
[/lang]
 */
enchant.Event.RIGHT_BUTTON_DOWN = 'rightbuttondown';

/**
[lang:ja]
 * rightボタンが離された発生するイベント.
 * 発行するオブジェクト: enchant.Game, enchant.Scene
 * @type {String}
[/lang]
[lang:en]
 * Event occurring when right button is released.
 * Issued object: enchant.Game, enchant.Scene
 * @type {String}
[/lang]
 */
enchant.Event.RIGHT_BUTTON_UP = 'rightbuttonup';

/**
[lang:ja]
 * upボタンが押された発生するイベント.
 * 発行するオブジェクト: enchant.Game, enchant.Scene
 * @type {String}
[/lang]
[lang:en]
 * Even occurring when up button is pushed.
 * Issued object: enchant.Game, enchant.Scene
 * @type {String}
[/lang]
 */
enchant.Event.UP_BUTTON_DOWN = 'upbuttondown';

/**
[lang:ja]
 * upボタンが離された発生するイベント.
 * 発行するオブジェクト: enchant.Game, enchant.Scene
 * @type {String}
[/lang]
[lang:en]
 * Event occurring when up button is released.
 * Issued object: enchant.Game, enchant.Scene
 * @type {String}
[/lang]
 */
enchant.Event.UP_BUTTON_UP = 'upbuttonup';

/**
[lang:ja]
 * downボタンが離された発生するイベント.
 * 発行するオブジェクト: enchant.Game, enchant.Scene
 * @type {String}
[/lang]
[lang:en]
 * Event occurring when down button is pushed.
 * Issued object: enchant.Game, enchant.Scene
 * @type {String}
[/lang]
 */
enchant.Event.DOWN_BUTTON_DOWN = 'downbuttondown';

/**
[lang:ja]
 * downボタンが離された発生するイベント.
 * 発行するオブジェクト: enchant.Game, enchant.Scene
 * @type {String}
[/lang]
[lang:en]
 * Event occurring when down button is released.
 * Issued object: enchant.Game, enchant.Scene
 * @type {String}
[/lang]
 */
enchant.Event.DOWN_BUTTON_UP = 'downbuttonup';

/**
[lang:ja]
 * aボタンが押された発生するイベント.
 * 発行するオブジェクト: enchant.Game, enchant.Scene
 * @type {String}
[/lang]
[lang:en]
 * Event occurring when a button is pushed.
 * Issued object: enchant.Game, enchant.Scene
 * @type {String}
[/lang]
 */
enchant.Event.A_BUTTON_DOWN = 'abuttondown';

/**
[lang:ja]
 * aボタンが離された発生するイベント.
 * 発行するオブジェクト: enchant.Game, enchant.Scene
 * @type {String}
[/lang]
[lang:en]
 * Event occurring when a button is released.
 * Issued object: enchant.Game, enchant.Scene
 * @type {String}
[/lang]
 */
enchant.Event.A_BUTTON_UP = 'abuttonup';

/**
[lang:ja]
 * bボタンが押された発生するイベント.
 * 発行するオブジェクト: enchant.Game, enchant.Scene
 * @type {String}
[/lang]
[lang:en]
 * Event occurring when b button is pushed.
 * Issued object: enchant.Game, enchant.Scene
 * @type {String}
[/lang]
 */
enchant.Event.B_BUTTON_DOWN = 'bbuttondown';

/**
[lang:ja]
 * bボタンが離された発生するイベント.
 * 発行するオブジェクト: enchant.Game, enchant.Scene
 * @type {String}
[/lang]
[lang:en]
 * Event occurring when b button is released.
 * Issued object: enchant.Game, enchant.Scene
 * @type {String}
[/lang]
 */
enchant.Event.B_BUTTON_UP = 'bbuttonup';


/**
[lang:ja]
 * @scope enchant.EventTarget.prototype
[/lang]
[lang:en]
 * @scope enchant.EventTarget.prototype
[/lang]
 */
enchant.EventTarget = enchant.Class.create({
    /**
[lang:ja]
     * DOM Event風味の独自イベント実装を行ったクラス.
     * ただしフェーズの概念はなし.
     * @constructs
[/lang]
[lang:en]
     * A class for independent event implementation like DOM Events.
     * However, does not include phase concept.
     * @constructs
[/lang]
     */
    initialize: function() {
        this._listeners = {};
    },
    /**
[lang:ja]
     * イベントリスナを追加する.
     * @param {String} type イベントのタイプ.
     * @param {function(e:enchant.Event)} listener 追加するイベントリスナ.
[/lang]
[lang:en]
     * Add EventListener.
     * @param {String} type Event type.
     * @param {function(e:enchant.Event)} listener EventListener added.
[/lang]
     */
    addEventListener: function(type, listener) {
        var listeners = this._listeners[type];
        if (listeners == null) {
            this._listeners[type] = [listener];
        } else if (listeners.indexOf(listener) == -1) {
            listeners.unshift(listener);

        }
    },
    /**
[lang:ja]
     * イベントリスナを削除する.
     * @param {String} type イベントのタイプ.
     * @param {function(e:enchant.Event)} listener 削除するイベントリスナ.
[/lang]
[lang:en]
     * Delete EventListener.
     * @param {String} type Event type.
     * @param {function(e:enchant.Event)} listener EventListener deleted.
[/lang]
     */
    removeEventListener: function(type, listener) {
        var listeners = this._listeners[type];
        if (listeners != null) {
            var i = listeners.indexOf(listener);
            if (i != -1) {
                listeners.splice(i, 1);
            }
        }
    },
    /**
[lang:ja]
     * すべてのイベントリスナを削除する.
     * @param {String} type イベントのタイプ.
[/lang]
[lang:en]
     * Clear EventListener.
     * @param {String} type Event type.
[/lang]
     */
    clearEventListener: function(type) {
        if(type != null){
            delete this._listeners[type];
        }else{
            this._listeners = {};
        }
    },
    /**
[lang:ja]
     * イベントを発行する.
     * @param {enchant.Event} e 発行するイベント.
[/lang]
[lang:en]
     * Issue event.
     * @param {enchant.Event} e Event issued.
[/lang]
     */
    dispatchEvent: function(e) {
        e.target = this;
        e.localX = e.x - this._offsetX;
        e.localY = e.y - this._offsetY;
        if (this['on' + e.type] != null) this['on' + e.type](e);
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
[lang:ja]
 * @scope enchant.Game.prototype
[/lang]
[lang:en]
 * @scope enchant.Game.prototype
[/lang]
 */
enchant.Game = enchant.Class.create(enchant.EventTarget, {
    /**
[lang:ja]
     * ゲームのメインループ, シーンを管理するクラス.
     *
     * インスタンスは一つしか存在することができず, すでにインスタンスが存在する状態で
     * コンストラクタを実行した場合既存のものが上書きされる. 存在するインスタンスには
     * enchant.Game.instanceからアクセスできる.
     *
     * @param {Number} width ゲーム画面の横幅.
     * @param {Number} height ゲーム画面の高さ.
     * @constructs
     * @extends enchant.EventTarget
[/lang]
[lang:en]
     * Class controlling game main loop, scene.
     *
     * There can be only one instance, and when the constructor is executed
     * with an instance present, the existing item will be overwritten. The existing instance
     * can be accessed from enchant.Game.instance.
     *
     * @param {Number} width Game screen width.
     * @param {Number} height Game screen height.
     * @constructs
     * @extends enchant.EventTarget
[/lang]
     */
    initialize: function(width, height) {
        if (window.document.body === null){
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
[lang:ja]
         * ゲーム画面の横幅.
         * @type {Number}
[/lang]
[lang:en]
         * Game screen width.
         * @type {Number}
[/lang]
         */
        this.width = width || 320;
        /**
[lang:ja]
         * ゲーム画面の高さ.
         * @type {Number}
[/lang]
[lang:en]
         * Game screen height.
         * @type {Number}
[/lang]
         */
        this.height = height || 320;
        /**
[lang:ja]
         * ゲームの表示倍率.
         * @type {Number}
[/lang]
[lang:en]
         * Game display scaling.
         * @type {Number}
[/lang]
         */
        this.scale = 1;

        var stage = document.getElementById('enchant-stage');
        if (!stage) {
            stage = document.createElement('div');
            stage.id = 'enchant-stage';
            stage.style.width = window.innerWidth + 'px';
            stage.style.height = window.innerHeight + 'px';
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
            width = parseInt(style.width);
            height = parseInt(style.height);
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
        if (!this.scale) this.scale = 1;
        stage.style.fontSize = '12px';
        stage.style.webkitTextSizeAdjust = 'none';
        this._element = stage;

        /**
[lang:ja]
         * ゲームのフレームレート.
         * @type {Number}
[/lang]
[lang:en]
         * Game frame rate.
         * @type {Number}
[/lang]
         */
        this.fps = 30;
        /**
[lang:ja]
         * ゲーム開始からのフレーム数.
         * @type {Number}
[/lang]
[lang:en]
         * Number of frames from game start.
         * @type {Number}
[/lang]
         */
        this.frame = 0;
        /**
[lang:ja]
         * ゲームが実行可能な状態かどうか.
         * @type {Boolean}
[/lang]
[lang:en]
         * Game executability (valid or not).
         * @type {Boolean}
[/lang]
         */
        this.ready = null;
        /**
[lang:ja]
         * ゲームが実行状態かどうか.
         * @type {Boolean}
[/lang]
[lang:en]
         * Game execution state (valid or not).
         * @type {Boolean}
[/lang]
         */
        this.running = false;
        /**
[lang:ja]
         * ロードされた画像をパスをキーとして保存するオブジェクト.
         * @type {Object.<String, Surface>}
[/lang]
[lang:en]
         * Object saved as loaded image path key.
         * @type {Object.<String, Surface>}
[/lang]
         */
        this.assets = {};
        var assets = this._assets = [];
        (function detectAssets(module) {
            if (module.assets instanceof Array) {
                [].push.apply(assets, module.assets);
            }
            for (var prop in module) if (module.hasOwnProperty(prop)) {
                if (typeof module[prop] == 'object' && Object.getPrototypeOf(module[prop]) == Object.prototype) {
                    detectAssets(module[prop]);
                }
            }
        })(enchant);

        this._scenes = [];
        /**
[lang:ja]
         * 現在のScene. Sceneスタック中の一番上のScene.
         * @type {enchant.Scene}
[/lang]
[lang:en]
         * Current Scene. Scene at top of Scene stack.
         * @type {enchant.Scene}
[/lang]
         */
        this.currentScene = null;
        /**
[lang:ja]
         * ルートScene. Sceneスタック中の一番下のScene.
         * @type {enchant.Scene}
[/lang]
[lang:en]
         * Route Scene. Scene at bottom of Scene stack.
         * @type {enchant.Scene}
[/lang]
         */
        this.rootScene = new enchant.Scene();
        this.pushScene(this.rootScene);
        /**
[lang:ja]
         * ローディング時に表示されるScene.
         * @type {enchant.Scene}
[/lang]
[lang:en]
         * Scene displayed during loading.
         * @type {enchant.Scene}
[/lang]
         */
        this.loadingScene = new enchant.Scene();
        this.loadingScene.backgroundColor = '#000';
        var barWidth = this.width * 0.9 | 0;
        var barHeight = this.width * 0.3 | 0;
        var border = barWidth * 0.05 | 0;
        var bar = new enchant.Sprite(barWidth, barHeight);
        bar.x = (this.width - barWidth) / 2;
        bar.y = (this.height - barHeight) / 2;
        var image = new enchant.Surface(barWidth, barHeight);
        image.context.fillStyle = '#fff';
        image.context.fillRect(0, 0, barWidth, barHeight);
        image.context.fillStyle = '#000';
        image.context.fillRect(border, border, barWidth - border*2, barHeight - border*2);
        bar.image = image;
        var progress = 0, _progress = 0;
        this.addEventListener('progress', function(e) {
            progress = e.loaded / e.total;
        });
        bar.addEventListener('enterframe', function() {
            _progress *= 0.9;
            _progress += progress * 0.1;
            image.context.fillStyle = '#fff';
            image.context.fillRect(border, 0, (barWidth - border*2) * _progress, barHeight);
        });
        this.loadingScene.addChild(bar);

        this._mousedownID = 0;
        this._surfaceID = 0;
        this._soundID = 0;
        this._intervalID = null;

        this._offsetX = 0;
        this._offsetY = 0;

        /**
[lang:ja]
         * ゲームに対する入力状態を保存するオブジェクト.
         * @type {Object.<String, Boolean>}
[/lang]
[lang:en]
         * Object that saves input conditions for game.
         * @type {Object.<String, Boolean>}
[/lang]
         */
        this.input = {};
        this._keybind = {};
        this.keybind(37, 'left');  // Left Arrow
        this.keybind(38, 'up');    // Up Arrow
        this.keybind(39, 'right'); // Right Arrow
        this.keybind(40, 'down');  // Down Arrow

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
                if(inputEvent)
                    this.currentScene.dispatchEvent(inputEvent);
            });
            this.addEventListener(type + 'buttonup', function(e) {
                var inputEvent;
                if (this.input[type]) {
                    this.input[type] = false;
                    inputEvent = new enchant.Event((--c) ? 'inputchange' : 'inputend');
                    this.dispatchEvent(inputEvent);
                }
                this.currentScene.dispatchEvent(e);
                if(inputEvent)
                    this.currentScene.dispatchEvent(inputEvent);
            });
        }, this);

        if (initial) {
            var stage = enchant.Game.instance._element;
            document.addEventListener('keydown', function(e) {
                game.dispatchEvent(new enchant.Event('keydown'));
                if ((37 <= e.keyCode && e.keyCode <= 40) || e.keyCode == 32) {
                    e.preventDefault();
                    e.stopPropagation();
                }

                if (!game.running) return;
                var button = game._keybind[e.keyCode];
                if (button) {
                    var e = new enchant.Event(button + 'buttondown');
                    game.dispatchEvent(e);
                }
            }, true);
            document.addEventListener('keyup', function(e) {
                if (!game.running) return;
                var button = game._keybind[e.keyCode];
                if (button) {
                    var e = new enchant.Event(button + 'buttonup');
                    game.dispatchEvent(e);
                }
            }, true);
            if (TOUCH_ENABLED) {
                stage.addEventListener('touchstart', function(e) {
                    var tagName = (e.target.tagName).toLowerCase();
                    if(tagName !== "input" && tagName !== "textarea"){
                        e.preventDefault();
                    }
                }, true);
                stage.addEventListener('touchmove', function(e) {
                    var tagName = (e.target.tagName).toLowerCase();
                    if(tagName !== "input" && tagName !== "textarea"){
                        e.preventDefault();
                        if (!game.running) e.stopPropagation();
                    }
                }, true);
                stage.addEventListener('touchend', function(e) {
                    var tagName = (e.target.tagName).toLowerCase();
                    if(tagName !== "input" && tagName !== "textarea"){
                        e.preventDefault();
                        if (!game.running) e.stopPropagation();
                    }
                }, true);
            } else {
                stage.addEventListener('mousedown', function(e) {
                    var tagName = (e.target.tagName).toLowerCase();
                    if(tagName !== "input" && tagName !== "textarea"){
                        e.preventDefault();
                        game._mousedownID++;
                        if (!game.running) e.stopPropagation();
                    }
                }, true);
                stage.addEventListener('mousemove', function(e) {
                    var tagName = (e.target.tagName).toLowerCase();
                    if(tagName !== "input" && tagName !== "textarea"){
                        e.preventDefault();
                        if (!game.running) e.stopPropagation();
                    }
                }, true);
                stage.addEventListener('mouseup', function(e) {
                    var tagName = (e.target.tagName).toLowerCase();
                    if(tagName !== "input" && tagName !== "textarea"){
                        e.preventDefault();
                        if (!game.running) e.stopPropagation();
                    }
                }, true);
            }
        }
    },
    /**
[lang:ja]
     * ファイルのプリロードを行う.
     *
     * プリロードを行うよう設定されたファイルはenchant.Game#startが実行されるとき
     * ロードが行われる. 全てのファイルのロードが完了したときはGameオブジェクトからload
     * イベントが発行され, Gameオブジェクトのassetsプロパティから画像ファイルの場合は
     * Surfaceオブジェクトとして, 音声ファイルの場合はSoundオブジェクトとして,
     * その他の場合は文字列としてアクセスできるようになる.
     *
     * なおこのSurfaceオブジェクトはenchant.Surface.loadを使って作成されたものである
     * ため直接画像操作を行うことはできない. enchant.Surface.loadの項を参照.
     *
     * @example
     *   game.preload('player.gif');
     *   game.onload = function() {
     *      var sprite = new Sprite(32, 32);
     *      sprite.image = game.assets['player.gif']; // パス名でアクセス
     *      ...
     *   };
     *   game.start();
     *
     * @param {...String} assets プリロードする画像のパス. 複数指定できる.
[/lang]
[lang:en]
     * Performs file preload.
     *
     * enchant is a file set to execute preload. It is loaded when
     * Game#start is activated. When all files are loaded, load events are activated
     * from Game objects. When an image file is from Game object assets properties,
     * it will as a Surface object, or a Sound object for sound files,
     * and in other cases it will be accessible as string.
     *
     * In addition, because this Surface object used made with enchant.Surface.load,
     * direct object manipulation is not possible. Refer to the items of enchant.Surface.load
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
     * @param {...String} assets Preload image path. Multiple settings possible.
[/lang]
     */
    preload: function(assets) {
        if (!(assets instanceof Array)) {
            assets = Array.prototype.slice.call(arguments);
        }
        [].push.apply(this._assets, assets);
    },
    /**
[lang:ja]
     * ファイルのロードを行う.
     *
     * @param {String} asset ロードするファイルのパス.
     * @param {Function} [callback] ファイルのロードが完了したときに呼び出される関数.
[/lang]
[lang:en]
     * File loading.
     *
     * @param {String} asset Load file path.
     * @param {Function} [callback] Function called up when file loading is finished.
[/lang]
     */
    load: function(src, callback) {
        if (callback == null) callback = function() {};

        var ext = findExt(src);

        if (enchant.Game._loadFuncs[ext]) {
            enchant.Game._loadFuncs[ext].call(this, src, callback, ext);
        }
        else {
            var req = new XMLHttpRequest();
            req.open('GET', src, true);
            req.onreadystatechange = function(e) {
                if (req.readyState == 4) {
                    if (req.status != 200 && req.status != 0) {
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
[lang:ja]
     * ゲームを開始する.
     *
     * enchant.Game#fpsで設定されたフレームレートに従ってenchant.Game#currentSceneの
     * フレームの更新が行われるようになる. プリロードする画像が存在する場合はロードが
     * 始まりローディング画面が表示される.
[/lang]
[lang:en]
     * Begin game.
     *
     * Obeying the frame rate set in enchant.Game#fps, the frame in
     * enchant.Game#currentScene will be updated. When a preloaded image is present,
     * loading will begin and the loading screen will be displayed.
[/lang]
     */
    start: function() {
        if (this._intervalID) {
            window.clearInterval(this._intervalID);
        } else if (this._assets.length) {
            if (enchant.Sound.enabledInMobileSafari && !game._touched &&
                VENDER_PREFIX == 'webkit' && TOUCH_ENABLED) {
                var scene = new enchant.Scene();
                scene.backgroundColor = '#000';
                var size = Math.round(game.width / 10);
                var sprite = new enchant.Sprite(game.width, size);
                sprite.y = (game.height - size) / 2;
                sprite.image = new enchant.Surface(game.width, size);
                sprite.image.context.fillStyle = '#fff';
                sprite.image.context.font = (size-1) + 'px bold Helvetica,Arial,sans-serif';
                var width = sprite.image.context.measureText('Touch to Start').width;
                sprite.image.context.fillText('Touch to Start', (game.width - width) / 2, size-1);
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
            var loaded = 0;
            for (var i = 0, len = assets.length; i < len; i++) {
                this.load(assets[i], function() {
                    var e = new enchant.Event('progress');
                    e.loaded = ++loaded;
                    e.total = len;
                    game.dispatchEvent(e);
                    if (loaded == len) {
                        game.removeScene(game.loadingScene);
                        game.dispatchEvent(new enchant.Event('load'));
                    }
                });
            }
            this.pushScene(this.loadingScene);
        } else {
            this.dispatchEvent(new enchant.Event('load'));
        }
        this.currentTime = Date.now();
        this._intervalID = window.setInterval(function() {
            game._tick()
        }, 1000 / this.fps);
        this.running = true;
    },
    /**
[lang:ja]
     * ゲームをデバッグモードで開始する.
     *
     * enchant.Game.instance._debug フラグを true にすることでもデバッグモードをオンにすることができる
[/lang]
[lang:en]
     * Begin game debug mode.
     *
     * Game debug mode can be set to on even if enchant.Game.instance._debug flag is set to true.
[/lang]
     */
    debug: function() {
        this._debug = true;
        this.rootScene.addEventListener("enterframe", function(time){
            this._actualFps = (1 / time);
        })
        this.start();
    },
    actualFps: {
        get: function(){
            return this._actualFps || this.fps;
        }
    },
    _tick: function() {
        var now = Date.now();
        var e = new enchant.Event('enterframe');
        e.elapsed = now - this.currentTime;
        this.currentTime = now;

        var nodes = this.currentScene.childNodes.slice();
        var push = Array.prototype.push;
        while (nodes.length) {
            var node = nodes.pop();
            node.dispatchEvent(e);
            node.age ++;
            if (node.childNodes) {
                push.apply(nodes, node.childNodes);
            }
        }

        this.currentScene.dispatchEvent(e);
        this.dispatchEvent(e);

        this.dispatchEvent(new enchant.Event('exitframe'));
        this.frame++;
    },
    /**
[lang:ja]
     * ゲームを停止する.
     *
     * フレームは更新されず, プレイヤーの入力も受け付けなくなる.
     * enchant.Game#startで再開できる.
[/lang]
[lang:en]
     * Stops game.
     *
     * The frame will not be updated, and player input will not be accepted.
     * Game can be reopened in enchant.Game#start.
[/lang]
     */
    stop: function() {
        if (this._intervalID) {
            window.clearInterval(this._intervalID);
            this._intervalID = null;
        }
        this.running = false;
    },
    /**
[lang:ja]
     * ゲームを一時停止する.
     *
     * フレームは更新されず, プレイヤーの入力は受け付ける.
     * enchant.Game#startで再開できる.
[/lang]
[lang:en]
     * Stops game.
     *
     * The frame will not be updated, and player input will not be accepted.
     * Game can be reopened in enchant.Game#start.
[/lang]
     */
    pause: function() {
        if (this._intervalID) {
            window.clearInterval(this._intervalID);
            this._intervalID = null;
        }
    },
    /**
[lang:ja]
     * ゲームを再開する。
[/lang]
[lang:en]
     * Resumes game.
[/lang]
     */
    resume: function() {
        this.currentTime = Date.now();
        this._intervalID = window.setInterval(function() {
            game._tick()
        }, 1000 / this.fps);
        this.running = true;
    },

    /**
[lang:ja]
     * 新しいSceneに移行する.
     *
     * Sceneはスタック状に管理されており, 表示順序もスタックに積み上げられた順に従う.
     * enchant.Game#pushSceneを行うとSceneをスタックの一番上に積むことができる. スタックの
     * 一番上のSceneに対してはフレームの更新が行われる.
     *
     * @param {enchant.Scene} scene 移行する新しいScene.
     * @return {enchant.Scene} 新しいScene.
[/lang]
[lang:en]
     * Switch to new Scene.
     *
     * Scene is controlled in stack, and the display order also obeys stack order.
     * When enchant.Game#pushScene is executed, Scene can be brought to the top of stack.
     * Frame will be updated to reflect Scene at the top of stack.
     *
     * @param {enchant.Scene} scene Switch to new Scene.
     * @return {enchant.Scene} New Scene.
[/lang]
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
[lang:ja]
     * 現在のSceneを終了させ前のSceneに戻る.
     *
     * Sceneはスタック状に管理されており, 表示順序もスタックに積み上げられた順に従う.
     * enchant.Game#popSceneを行うとスタックの一番上のSceneを取り出すことができる.
     *
     * @return {enchant.Scene} 終了させたScene.
[/lang]
[lang:en]
     * End current Scene, return to previous Scene.
     *
     * Scene is controlled in stack, with display order obeying stack order.
     * When enchant.Game#popScene is activated, the Scene at the top of the stack can be pulled out.
     *
     * @return {enchant.Scene} Ended Scene.
[/lang]
     */
    popScene: function() {
        if (this.currentScene == this.rootScene) {
            return this.currentScene;
        }
        this._element.removeChild(this.currentScene._element);
        this.currentScene.dispatchEvent(new enchant.Event('exit'));
        this.currentScene = this._scenes[this._scenes.length-2];
        this.currentScene.dispatchEvent(new enchant.Event('enter'));
        return this._scenes.pop();
    },
    /**
[lang:ja]
     * 現在のSceneを別のSceneにおきかえる.
     *
     * enchant.Game#popScene, enchant.Game#pushSceneを同時に行う.
     *
     * @param {enchant.Scene} scene おきかえるScene.
     * @return {enchant.Scene} 新しいScene.
[/lang]
[lang:en]
     * Overwrite current Scene with separate Scene.
     *
     * enchant.Game#popScene, enchant.Game#pushScene are enacted simultaneously.
     *
     * @param {enchant.Scene} scene Replace Scene.
     * @return {enchant.Scene} New Scene.
[/lang]
     */
    replaceScene: function(scene) {
        this.popScene();
        return this.pushScene(scene);
    },
    /**
[lang:ja]
     * Scene削除する.
     *
     * Sceneスタック中からSceneを削除する.
     *
     * @param {enchant.Scene} scene 削除するScene.
     * @return {enchant.Scene} 削除したScene.
[/lang]
[lang:en]
     * Delete Scene.
     *
     * Deletes Scene from Scene stack.
     *
     * @param {enchant.Scene} scene Delete Scene.
     * @return {enchant.Scene} Deleted Scene.
[/lang]
     */
    removeScene: function(scene) {
        if (this.currentScene == scene) {
            return this.popScene();
        } else {
            var i = this._scenes.indexOf(scene);
            if (i != -1) {
                this._scenes.splice(i, 1);
                this._element.removeChild(scene._element);
                return scene;
            }
        }
    },
    /**
[lang:ja]
     * キーバインドを設定する.
     *
     * キー入力をleft, right, up, down, a, bいずれかのボタン入力として割り当てる.
     *
     * @param {Number} key キーバインドを設定するキーコード.
     * @param {String} button 割り当てるボタン.
[/lang]
[lang:en]
     * Set key binding.
     *
     * Assigns key input to left, right, up, down, a, b button input.
     *
     * @param {Number} key Key code that sets key bind.
     * @param {String} button Assign button.
[/lang]
     */
    keybind: function(key, button) {
        this._keybind[key] = button;
    },
    /**
[lang:ja]
     * Game#start が呼ばれてから経過した時間を取得する
     * @return {Number} 経過した時間 (秒)
[/lang]
[lang:en]
     * get elapsed time from game.start is called
     * @return {Number} elapsed time (seconds)
[/lang]
     */
    getElapsedTime: function(){
        return this.frame / this.fps;
    }
});
// img
enchant.Game._loadFuncs = {};
enchant.Game._loadFuncs['jpg']  =
enchant.Game._loadFuncs['jpeg'] =
enchant.Game._loadFuncs['gif']  =
enchant.Game._loadFuncs['png']  =
enchant.Game._loadFuncs['bmp']  = function(src, callback) {
    this.assets[src] = enchant.Surface.load(src);
    this.assets[src].addEventListener('load', callback);
};
// sound
enchant.Game._loadFuncs['mp3'] =
enchant.Game._loadFuncs['aac'] =
enchant.Game._loadFuncs['m4a'] =
enchant.Game._loadFuncs['wav'] =
enchant.Game._loadFuncs['ogg'] = function(src, callback, ext) {
    this.assets[src] = enchant.Sound.load(src, 'audio/' + ext);
    this.assets[src].addEventListener('load', callback);
};

/**
[lang:ja]
 * 現在のGameインスタンス.
 * @type {enchant.Game}
 * @static
[/lang]
[lang:en]
 * Current Game instance.
 * @type {enchant.Game}
 * @static
[/lang]
 */
enchant.Game.instance = null;

/**
[lang:ja]
 * @scope enchant.Node.prototype
[/lang]
[lang:en]
 * @scope enchant.Node.prototype
[/lang]
 */
enchant.Node = enchant.Class.create(enchant.EventTarget, {
    /**
[lang:ja]
     * Sceneをルートとした表示オブジェクトツリーに属するオブジェクトの基底クラス.
     * 直接使用することはない.
     * @constructs
     * @extends enchant.EventTarget
[/lang]
[lang:en]
     * Base class for objects in displayed object tree routed to Scene.
     * Not directly used.
     * @constructs
     * @extends enchant.EventTarget
[/lang]
     */
    initialize: function() {
        enchant.EventTarget.call(this);

        this._x = 0;
        this._y = 0;
        this._offsetX = 0;
        this._offsetY = 0;

        this.age = 0;

        /**
[lang:ja]
         * Nodeの親Node.
         * @type {enchant.Group}
[/lang]
[lang:en]
         * Parent Node for Node.
         * @type {enchant.Group}
[/lang]
         */
        this.parentNode = null;
        /**
[lang:ja]
         * Nodeが属しているScene.
         * @type {enchant.Scene}
[/lang]
[lang:en]
         * Scene to which Node belongs.
         * @type {enchant.Scene}
[/lang]
         */
        this.scene = null;

        this.addEventListener('touchstart', function(e) {
            if (this.parentNode && this.parentNode != this.scene) {
                this.parentNode.dispatchEvent(e);
            }
        });
        this.addEventListener('touchmove', function(e) {
            if (this.parentNode && this.parentNode != this.scene) {
                this.parentNode.dispatchEvent(e);
            }
        });
        this.addEventListener('touchend', function(e) {
            if (this.parentNode && this.parentNode != this.scene) {
                this.parentNode.dispatchEvent(e);
            }
        });
    },
    /**
[lang:ja]
     * Nodeを移動する.
     * @param {Number} x 移動先のx座標.
     * @param {Number} y 移動先のy座標.
[/lang]
[lang:en]
     * Move Node.
     * @param {Number} x Target x coordinates.
     * @param {Number} y Target y coordinates.
[/lang]
     */
    moveTo: function(x, y) {
        this._x = x;
        this._y = y;
        this._updateCoordinate();
    },
    /**
[lang:ja]
     * Nodeを移動する.
     * @param {Number} x 移動するx軸方向の距離.
     * @param {Number} y 移動するy軸方向の距離.
[/lang]
[lang:en]
     * Move Node.
     * @param {Number} x x axis movement distance.
     * @param {Number} y y axis movement distance.
[/lang]
     */
    moveBy: function(x, y) {
        this._x += x;
        this._y += y;
        this._updateCoordinate();
    },
    /**
[lang:ja]
     * Nodeのx座標.
     * @type {Number}
[/lang]
[lang:en]
     * x coordinates of Node.
     * @type {Number}
[/lang]
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
[lang:ja]
     * Nodeのy座標.
     * @type {Number}
[/lang]
[lang:en]
     * y coordinates of Node.
     * @type {Number}
[/lang]
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
    },
    remove: function(){
        if(this._listener){
            this.clearEventListener();
        }
        if(this.parentNode){
            this.parentNode.removeChild(this);
        }
    }
});

/**
[lang:ja]
 * @scope enchant.Entity.prototype
[/lang]
[lang:en]
 * @scope enchant.Entity.prototype
[/lang]
 */
enchant.Entity = enchant.Class.create(enchant.Node, {
    /**
[lang:ja]
     * DOM上で表示する実体を持ったクラス.直接使用することはない.
     * @constructs
     * @extends enchant.Node
[/lang]
[lang:en]
     * A class with objects displayed on DOM. Not used directly.
     * @constructs
     * @extends enchant.Node
[/lang]
     */
    initialize: function() {
        enchant.Node.call(this);

        this._element = document.createElement('div');
        this._style = this._element.style;
        this._style.position = 'absolute';

        this._width = 0;
        this._height = 0;
        this._backgroundColor = null;
        this._opacity = 1;
        this._visible = true;
        this._buttonMode = null;

        if(enchant.Game.instance._debug){
            this._style.border = "1px solid blue";
            this._style.margin = "-1px";
        }

        /**
[lang:ja]
         * Entityにボタンの機能を設定する.
         * Entityに対するタッチ, クリックをleft, right, up, down, a, bいずれかの
         * ボタン入力として割り当てる.
         * @type {String}
[/lang]
[lang:en]
         * Set button function to Entity.
         * Apply touch, click to left, right, up, down, a, b
         * for button input for Entity.
         * @type {String}
[/lang]
         */
        this.buttonMode = null;
        /**
[lang:ja]
         * Entityが押されているかどうか.
         * buttonModeが設定されているときだけ機能する.
         * @type {Boolean}
[/lang]
[lang:en]
         * Checks if Entity is being pushed.
         * Only functions when buttonMode is set.
         * @type {Boolean}
[/lang]
         */
        this.buttonPressed = false;
        this.addEventListener('touchstart', function() {
            if (!this.buttonMode) return;
            this.buttonPressed = true;
            var e = new enchant.Event(this.buttonMode + 'buttondown');
            this.dispatchEvent(e);
            game.dispatchEvent(e);
        });
        this.addEventListener('touchend', function() {
            if (!this.buttonMode) return;
            this.buttonPressed = false;
            var e = new enchant.Event(this.buttonMode + 'buttonup');
            this.dispatchEvent(e);
            game.dispatchEvent(e);
        });

        var that = this;
        var render = function() {
            that.dispatchEvent(new enchant.Event('render'));
        };
        this.addEventListener('addedtoscene', function() {
            render();
            game.addEventListener('exitframe', render);
        });
        this.addEventListener('removedfromscene', function() {
            game.removeEventListener('exitframe', render);
        });
        this.addEventListener('render', function() {
            if (this._offsetX != this._previousOffsetX) {
                this._style.left = this._offsetX + 'px';
            }
            if (this._offsetY != this._previousOffsetY) {
                this._style.top = this._offsetY + 'px';
            }
            this._previousOffsetX = this._offsetX;
            this._previousOffsetY = this._offsetY;
        });

        var that = this;
        if (TOUCH_ENABLED) {
            this._element.addEventListener('touchstart', function(e) {
                var touches = e.touches;
                for (var i = 0, len = touches.length; i < len; i++) {
                    e = new enchant.Event('touchstart');
                    e.identifier = touches[i].identifier;
                    e._initPosition(touches[i].pageX, touches[i].pageY);
                    that.dispatchEvent(e);
                }
            }, false);
            this._element.addEventListener('touchmove', function(e) {
                var touches = e.touches;
                for (var i = 0, len = touches.length; i < len; i++) {
                    e = new enchant.Event('touchmove');
                    e.identifier = touches[i].identifier;
                    e._initPosition(touches[i].pageX, touches[i].pageY);
                    that.dispatchEvent(e);
                }
            }, false);
            this._element.addEventListener('touchend', function(e) {
                var touches = e.changedTouches;
                for (var i = 0, len = touches.length; i < len; i++) {
                    e = new enchant.Event('touchend');
                    e.identifier = touches[i].identifier;
                    e._initPosition(touches[i].pageX, touches[i].pageY);
                    that.dispatchEvent(e);
                }
            }, false);
        } else {
            this._element.addEventListener('mousedown', function(e) {
                var x = e.pageX;
                var y = e.pageY;
                e = new enchant.Event('touchstart');
                e.identifier = game._mousedownID;
                e._initPosition(x, y);
                that.dispatchEvent(e);
                that._mousedown = true;
            }, false);
            game._element.addEventListener('mousemove', function(e) {
                if (!that._mousedown) return;
                var x = e.pageX;
                var y = e.pageY;
                e = new enchant.Event('touchmove');
                e.identifier = game._mousedownID;
                e._initPosition(x, y);
                that.dispatchEvent(e);
            }, false);
            game._element.addEventListener('mouseup', function(e) {
                if (!that._mousedown) return;
                var x = e.pageX;
                var y = e.pageY;
                e = new enchant.Event('touchend');
                e.identifier = game._mousedownID;
                e._initPosition(x, y);
                that.dispatchEvent(e);
                that._mousedown = false;
            }, false);
        }
    },
    /**
[lang:ja]
     * DOMのID.
     * @type {String}
[/lang]
[lang:en]
     * DOM ID.
     * @type {String}
[/lang]
     */
    id: {
        get: function() {
            return this._element.id;
        },
        set: function(id) {
            this._element.id = id;
        }
    },
    /**
[lang:ja]
     * DOMのclass.
     * @type {String}
[/lang]
[lang:en]
     * DOM class.
     * @type {String}
[/lang]
     */
    className: {
        get: function() {
            return this._element.className;
        },
        set: function(className) {
            this._element.className = className;
        }
    },
    /**
[lang:ja]
     * Entityの横幅.
     * @type {Number}
[/lang]
[lang:en]
     * Entity width.
     * @type {Number}
[/lang]
     */
    width: {
        get: function() {
            return this._width;
        },
        set: function(width) {
            this._style.width = (this._width = width) + 'px';
        }
    },
    /**
[lang:ja]
     * Entityの高さ.
     * @type {Number}
[/lang]
[lang:en]
     * Entity height.
     * @type {Number}
[/lang]
     */
    height: {
        get: function() {
            return this._height;
        },
        set: function(height) {
            this._style.height = (this._height = height) + 'px';
        }
    },
    /**
[lang:ja]
     * Entityの背景色.
     * CSSの'color'プロパティと同様の形式で指定できる.
     * @type {String}
[/lang]
[lang:en]
     * Entity background color.
     * Designates as same format as CSS 'color' properties.
     * @type {String}
[/lang]
     */
    backgroundColor: {
        get: function() {
            return this._backgroundColor;
        },
        set: function(color) {
            this._element.style.backgroundColor = this._backgroundColor = color;
        }
    },
    /**
[lang:ja]
     * Entityの透明度.
     * 0から1までの値を設定する(0が完全な透明, 1が完全な不透明).
     * @type {Number}
[/lang]
[lang:en]
     * Entity transparency.
     * Sets level from 0 to 1 (0 is completely transparent, 1 is completely opaque).
     * @type {Number}
[/lang]
     */
    opacity: {
        get: function() {
            return this._opacity;
        },
        set: function(opacity) {
            this._style.opacity = this._opacity = opacity;
        }
    },
    /**
[lang:ja]
     * Entityを表示するかどうかを指定する.
     * @type {Boolean}
[/lang]
[lang:en]
     * Indicates whether or not to display Entity.
     * @type {Boolean}
[/lang]
     */
    visible: {
        get: function() {
            return this._visible;
        },
        set: function(visible) {
            if (this._visible = visible) {
                this._style.display = 'block';
            } else {
                this._style.display = 'none';
            }
        }
    },
    /**
[lang:ja]
     * Entityのタッチを有効にするかどうかを指定する.
     * @type {Boolean}
[/lang]
[lang:en]
     * Designates whether or not to make Entity touch valid.
     * @type {Boolean}
[/lang]
     */
    touchEnabled: {
        get: function() {
            return this._touchEnabled;
        },
        set: function(enabled) {
            if (this._touchEnabled = enabled) {
                this._style.pointerEvents = 'all';
            } else {
                this._style.pointerEvents = 'none';
            }
        }
    },
    /**
[lang:ja]
     * Entityの矩形が交差しているかどうかにより衝突判定を行う.
     * @param {*} other 衝突判定を行うEntityなどx, y, width, heightプロパティを持ったObject.
     * @return {Boolean} 衝突判定の結果.
[/lang]
[lang:en]
     * Operates collision detection based on whether or not rectangle angles are intersecting.
     * @param {*} other Object with properties of x, y, width, height that operate Entity collision detection.
     * @return {Boolean} Collision detection results.
[/lang]
     */
    intersect: function(other) {
        return this.x < other.x + other.width && other.x < this.x + this.width &&
            this.y < other.y + other.height && other.y < this.y + this.height;
    },
    /**
[lang:ja]
     * Entityの中心点どうしの距離により衝突判定を行う.
     * @param {*} other 衝突判定を行うEntityなどx, y, width, heightプロパティを持ったObject.
     * @param {Number} [distance] 衝突したと見なす最大の距離. デフォルト値は二つのEntityの横幅と高さの平均.
     * @return {Boolean} 衝突判定の結果.
[/lang]
[lang:en]
     * Operates collision detection based on distance from Entity's central point.
     * @param {*} other Object with properties of x, y, width, height that operate Entity collision detection.
     * @param {Number} [distance] Greatest distance considered in collision. Default level is average of Entity width and height.
     * @return {Boolean} Collision detection result.
[/lang]
     */
    within: function(other, distance) {
        if (distance == null) {
            distance = (this.width + this.height + other.width + other.height) / 4;
        }
        var _;
        return (_ = this.x - other.x + (this.width - other.width) / 2) * _ +
            (_ = this.y - other.y + (this.height - other.height) / 2) * _ < distance * distance;
    }
});

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
     * @param {Number} [width] Sprite width.
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
                this._style[VENDER_PREFIX + 'Transform'] = [
                    'rotate(', this._rotation, 'deg)',
                    'scale(', this._scaleX, ',', this._scaleY, ')'
                ].join('');
                this._dirty = false;
            }
        });

        /**
         * frame に配列が指定されたときの処理。
         * _frameSeuence に
         */
        this.addEventListener('enterframe', function(){
            if(this._frameSequence.length !== 0){
                var nextFrame = this._frameSequence.shift();
                if(nextFrame === null){
                    this._frameSequence = [];
                }else{
                    this._setFrame(nextFrame);
                    this._frameSequence.push(nextFrame);
                }
            }
        })

        if(enchant.Game.instance._debug){
            this._style.border = "1px solid red";
            this._style.margin = "-1px";
            this.addEventListener("touchstart", function(){
                if(!enchant.Game.instance.running) console.log("touchstart", this);
            });
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
            if (image == this._image) return;

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
            if(frame instanceof Array){
                var frameSequence = frame;
                var nextFrame = frameSequence.shift();
                this._setFrame(nextFrame);
                frameSequence.push(nextFrame);
                this._frameSequence = frameSequence;
            }else{
                this._setFrame(frame);
                this._frameSequence = [];
                this._frame = frame;
            }
        }
    },
    _setFrame: function(frame){
        if (this._image != null){
            this._frame = frame
            var row = this._image.width / this._width | 0;
            if (this._image._css) {
                this._style.backgroundPosition = [
                    -(frame % row) * this._width, 'px ',
                    -(frame / row | 0) * this._height, 'px'
                ].join('');
            } else if (this._element.firstChild) {
                var style = this._element.firstChild.style;
                style.left = -(frame % row) * this._width + 'px';
                style.top = -(frame / row | 0) * this._height + 'px';
            }
        }
    },
    /**
[lang:ja]
     * Spriteを拡大縮小する.
     * @param {Number} x 拡大するx軸方向の倍率.
     * @param {Number} [y] 拡大するy軸方向の倍率.
[/lang]
[lang:en]
     * Expand or contract Sprite.
     * @param {Number} x Scaling for x axis to be expanded.
     * @param {Number} [y] Scaling for y axis to be expanded.
[/lang]
     */
    scale: function(x, y) {
        if (y == null) y = x;
        this._scaleX *= x;
        this._scaleY *= y;
        this._dirty = true;
    },
    /**
[lang:ja]
     * Spriteを回転する.
     * @param {Number} deg 回転する角度 (度数法).
[/lang]
[lang:en]
     * Rotate Sprite.
     * @param {Number} deg Rotation angle (frequency).
[/lang]
     */
    rotate: function(deg) {
        this._rotation += deg;
        this._dirty = true;
    },
    /**
[lang:ja]
     * Spriteのx軸方向の倍率.
     * @type {Number}
[/lang]
[lang:en]
     * Scaling for Sprite's x axis direction.
     * @type {Number}
[/lang]
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
[lang:ja]
     * Spriteのy軸方向の倍率.
     * @type {Number}
[/lang]
[lang:en]
     * Scaling for Sprite's y axis direction.
     * @type {Number}
[/lang]
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
[lang:ja]
     * Spriteの回転角 (度数法).
     * @type {Number}
[/lang]
[lang:en]
     * Sprite rotation angle (frequency).
     * @type {Number}
[/lang]
     */
    rotation: {
        get: function() {
            return this._rotation;
        },
        set: function(rotation) {
            this._rotation = rotation;
            this._dirty = true;
        }
    }
});

/**
[lang:ja]
 * @scope enchant.Label.prototype
[/lang]
[lang:en]
 * @scope enchant.Label.prototype
[/lang]
 */
enchant.Label = enchant.Class.create(enchant.Entity, {
    /**
[lang:ja]
     * Labelオブジェクトを作成する.
     * @constructs
     * @extends enchant.Entity
[/lang]
[lang:en]
     * Create Label object.
     * @constructs
     * @extends enchant.Entity
[/lang]
     */
    initialize: function(text) {
        enchant.Entity.call(this);

        this.width = 300;
        this.text = text;
        this.textAlign = 'left';
    },
    /**
[lang:ja]
     * 表示するテキスト.
     * @type {String}
[/lang]
[lang:en]
     * Text to display.
     * @type {String}
[/lang]
     */
    text: {
        get: function() {
            return this._element.innerHTML;
        },
        set: function(text) {
            this._element.innerHTML = text;
        }
    },
    /**
[lang:ja]
     * テキストの水平位置の指定.
     * CSSの'text-align'プロパティと同様の形式で指定できる.
     * @type {String}
[/lang]
[lang:en]
     * Specifies horizontal alignment of text.
     * Can be set to same format as CSS 'text-align' property.
     * @type {String}
[/lang]
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
[lang:ja]
     * フォントの指定.
     * CSSの'font'プロパティと同様の形式で指定できる.
     * @type {String}
[/lang]
[lang:en]
     * Font settings.
     * CSSの'font' Can be set to same format as properties.
     * @type {String}
[/lang]
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
[lang:ja]
     * 文字色の指定.
     * CSSの'color'プロパティと同様の形式で指定できる.
     * @type {String}
[/lang]
[lang:en]
     * Text color settings.
     * CSSの'color' Can be set to same format as properties.
     * @type {String}
[/lang]
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

/**
[lang:ja]
 * @scope enchant.Map.prototype
[/lang]
[lang:en]
 * @scope enchant.Map.prototype
[/lang]
 */
enchant.Map = enchant.Class.create(enchant.Entity, {
    /**
[lang:ja]
     * タイルセットからマップを生成して表示するクラス.
     *
     * @param {Number} tileWidth タイルの横幅.
     * @param {Number} tileHeight タイルの高さ.
     * @constructs
     * @extends enchant.Entity
[/lang]
[lang:en]
     * A class to create and display maps from a tile set.
     *
     * @param {Number} tileWidth Tile width.
     * @param {Number} tileHeight Tile height.
     * @constructs
     * @extends enchant.Entity
[/lang]
     */
    initialize: function(tileWidth, tileHeight) {
        enchant.Entity.call(this);

        var canvas = document.createElement('canvas');
        if (RETINA_DISPLAY && game.scale == 2) {
            canvas.width = game.width * 2;
            canvas.height = game.height * 2;
            this._style.webkitTransformOrigin = '0 0';
            this._style.webkitTransform = 'scale(0.5)';
        } else {
            canvas.width = game.width;
            canvas.height = game.height;
        }
        this._element.appendChild(canvas);
        this._context = canvas.getContext('2d');

        this._tileWidth = tileWidth || 0;
        this._tileHeight = tileHeight || 0;
        this._image = null;
        this._data = [[[]]];
        this._dirty = false;
        this._tight = false;

        this.touchEnabled = false;

        /**
[lang:ja]
         * タイルが衝突判定を持つかを表す値の二元配列.
         * @type {Array.<Array.<Number>>}
[/lang]
[lang:en]
         * Two dimensional array to show level of tiles with collision detection.
         * @type {Array.<Array.<Number>>}
[/lang]
         */
        this.collisionData = null;

        this._listeners['render'] = null;
        this.addEventListener('render', function() {
            if (this._dirty || this._previousOffsetX == null) {
                this._dirty = false;
                this.redraw(0, 0, game.width, game.height);
            } else if (this._offsetX != this._previousOffsetX ||
                       this._offsetY != this._previousOffsetY) {
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
                            context.clearRect(0, 0, sw*2, sh*2);
                            context.drawImage(this._context.canvas,
                                sx*2, sy*2, sw*2, sh*2, 0, 0, sw*2, sh*2);
                            context = this._context;
                            context.clearRect(dx*2, dy*2, sw*2, sh*2);
                            context.drawImage(game._buffer,
                                0, 0, sw*2, sh*2, dx*2, dy*2, sw*2, sh*2);
                        } else {
                            context.clearRect(0, 0, sw, sh);
                            context.drawImage(this._context.canvas,
                                sx, sy, sw, sh, 0, 0, sw, sh);
                            context = this._context;
                            context.clearRect(dx, dy, sw, sh);
                            context.drawImage(game._buffer,
                                0, 0, sw, sh, dx, dy, sw, sh);
                        }

                        if (dx == 0) {
                            this.redraw(sw, 0, game.width - sw, game.height);
                        } else {
                            this.redraw(0, 0, game.width - sw, game.height);
                        }
                        if (dy == 0) {
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
[lang:ja]
     * データを設定する.
     * タイルががimageプロパティの画像に左上から順に配列されていると見て, 0から始まる
     * インデックスの二元配列を設定する.複数指定された場合は後のものから順に表示される.
     * @param {...Array<Array.<Number>>} data タイルのインデックスの二元配列. 複数指定できる.
[/lang]
[lang:en]
     * Set data.
     * Sees that tiles are set in order in array from the upper left of image properties image,
     * and sets a two-dimensional index array starting from 0. When more than one is set, they are displayed in reverse order.
     * @param {...Array<Array.<Number>>} data Two-dimensional display of tile index. Multiple designations possible.
[/lang]
     */
    loadData: function(data) {
        this._data = Array.prototype.slice.apply(arguments);
        this._dirty = true;

        this._tight = false;
        for (var i = 0, len = this._data.length; i < len; i++) {
            var c = 0;
            var data = this._data[i];
            for (var y = 0, l = data.length; y < l; y++) {
                for (var x = 0, ll = data[y].length; x < ll; x++) {
                    if (data[y][x] >= 0) c++;
                }
            }
            if (c / (data.length * data[0].length) > 0.2) {
                this._tight = true;
                break;
            }
        }
    },
    /**
[lang:ja]
     * Map上に障害物があるかどうかを判定する.
     * @param {Number} x 判定を行うマップ上の点のx座標.
     * @param {Number} y 判定を行うマップ上の点のy座標.
     * @return {Boolean} 障害物があるかどうか.
[/lang]
[lang:en]
     * Judges whether or not obstacles are on top of Map.
     * @param {Number} x x coordinates of detection spot on map.
     * @param {Number} y y coordinates of detection spot on map.
     * @return {Boolean} Checks for obstacles.
[/lang]
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
[lang:ja]
     * Mapで表示するタイルセット画像.
     * @type {enchant.Surface}
[/lang]
[lang:en]
     * Tile set image displayed on Map.
     * @type {enchant.Surface}
[/lang]
     */
    image: {
        get: function() {
            return this._image;
        },
        set: function(image) {
            this._image = image;
            if (RETINA_DISPLAY && game.scale == 2) {
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
[lang:ja]
     * Mapのタイルの横幅.
     * @type {Number}
[/lang]
[lang:en]
     * Map tile width.
     * @type {Number}
[/lang]
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
[lang:ja]
     * Mapのタイルの高さ.
     * @type {Number}
[/lang]
[lang:en]
     * Map tile height.
     * @type {Number}
[/lang]
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
[lang:ja]
     * @private
[/lang]
[lang:en]
     * @private
[/lang]
     */
    width: {
        get: function() {
            return this._tileWidth * this._data[0][0].length
        }
    },
    /**
[lang:ja]
     * @private
[/lang]
[lang:en]
     * @private
[/lang]
     */
    height: {
        get: function() {
            return this._tileHeight * this._data[0].length
        }
    },
    /**
[lang:ja]
     * @private
[/lang]
[lang:en]
     * @private
[/lang]
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

/**
[lang:ja]
 * @scope enchant.Group.prototype
[/lang]
[lang:en]
 * @scope enchant.Group.prototype
[/lang]
 */
enchant.Group = enchant.Class.create(enchant.Node, {
    /**
[lang:ja]
     * 複数のNodeを子に持つことができるクラス.
     *
     * @example
     *   var stage = new Group();
     *   stage.addChild(player);
     *   stage.addChild(enemy);
     *   stage.addChild(map);
     *   stage.addEventListener('enterframe', function() {
     *      // playerの座標に従って全体をスクロールする
     *      if (this.x > 64 - player.x) {
     *          this.x = 64 - player.x;
     *      }
     *   });
     *
     * @constructs
     * @extends enchant.Node
[/lang]
[lang:en]
     * A class that can hold multiple Nodes.
     *
     * @example
     *   var stage = new Group();
     *   stage.addChild(player);
     *   stage.addChild(enemy);
     *   stage.addChild(map);
     *   stage.addEventListener('enterframe', function() {
     *      // Scrolls entire frame in response to player's coordinates.
     *      if (this.x > 64 - player.x) {
     *          this.x = 64 - player.x;
     *      }
     *   });
     *
     * @constructs
     * @extends enchant.Node
[/lang]
     */
    initialize: function() {
        enchant.Node.call(this);

        /**
[lang:ja]
         * 子のNode.
         * @type {Array.<enchant.Node>}
[/lang]
[lang:en]
         * Child Node.
         * @type {Array.<enchant.Node>}
[/lang]
         */
        this.childNodes = [];

        this._x = 0;
        this._y = 0;
    },
    /**
[lang:ja]
     * GroupにNodeを追加する.
     * @param {enchant.Node} node 追加するNode.
[/lang]
[lang:en]
     * Adds Node to Group.
     * @param {enchant.Node} node Added Node.
[/lang]
     */
    addChild: function(node) {
        this.childNodes.push(node);
        node.parentNode = this;
        node.dispatchEvent(new enchant.Event('added'));
        if (this.scene) {
            var e = new enchant.Event('addedtoscene');
            node.scene = this.scene;
            node.dispatchEvent(e);
            node._updateCoordinate();

            var fragment = document.createDocumentFragment();
            var nodes;
            var push = Array.prototype.push;
            if (node._element) {
                fragment.appendChild(node._element);
            } else if (node.childNodes) {
                nodes = node.childNodes.slice().reverse();
                while (nodes.length) {
                    node = nodes.pop();
                    node.scene = this.scene;
                    node.dispatchEvent(e);
                    if (node._element) {
                        fragment.appendChild(node._element);
                    } else if (node.childNodes) {
                        push.apply(nodes, node.childNodes.reverse());
                    }
                }
            }
            if (!fragment.childNodes.length) return;

            var nextSibling, thisNode = this;
            while (thisNode.parentNode) {
                nodes = thisNode.parentNode.childNodes;
                nodes = nodes.slice(nodes.indexOf(thisNode) + 1).reverse();
                while (nodes.length) {
                    node = nodes.pop();
                    if (node._element) {
                        nextSibling = node._element;
                        break;
                    } else if (node.childNodes) {
                        push.apply(nodes, node.childNodes.slice().reverse());
                    }
                }
                thisNode = thisNode.parentNode;
            }
            if (nextSibling) {
                this.scene._element.insertBefore(fragment, nextSibling);
            } else {
                this.scene._element.appendChild(fragment);
            }
        }
    },
    /**
[lang:ja]
     * GroupにNodeを挿入する.
     * @param {enchant.Node} node 挿入するNode.
     * @param {enchant.Node} reference 挿入位置の前にあるNode.
[/lang]
[lang:en]
     * Incorporates Node into Group.
     * @param {enchant.Node} node Incorporated Node.
     * @param {enchant.Node} reference Node in position before incorporation.
[/lang]
     */
    insertBefore: function(node, reference) {
        var i = this.childNodes.indexOf(reference);
        if (i != -1) {
            this.childNodes.splice(i, 0, node);
            node.parentNode = this;
            node.dispatchEvent(new enchant.Event('added'));
            if (this.scene) {
                var e = new enchant.Event('addedtoscene');
                node.scene = this.scene;
                node.dispatchEvent(e);
                node._updateCoordinate();

                var fragment = document.createDocumentFragment();
                var nodes;
                var push = Array.prototype.push;
                if (node._element) {
                    fragment.appendChild(node._element);
                } else if (node.childNodes) {
                    nodes = node.childNodes.slice().reverse();
                    while (nodes.length) {
                        node = nodes.pop();
                        node.scene = this.scene;
                        node.dispatchEvent(e);
                        if (node._element) {
                            fragment.appendChild(node._element);
                        } else if (node.childNodes) {
                            push.apply(nodes, node.childNodes.reverse());
                        }
                    }
                }
                if (!fragment.childNodes.length) return;

                var nextSibling, thisNode = reference;
                while (thisNode != this) {
                    if (i != null) {
                        nodes = this.childNodes.slice(i+1).reverse();
                        i = null;
                    } else {
                        nodes = thisNode.parentNode.childNodes;
                        nodes = nodes.slice(nodes.indexOf(thisNode) + 1).reverse();
                    }
                    while (nodes.length) {
                        node = nodes.pop();
                        if (node._element) {
                            nextSibling = node._element;
                            break;
                        } else if (node.childNodes) {
                            push.apply(nodes, node.childNodes.slice().reverse());
                        }
                    }
                    thisNode = thisNode.parentNode;
                }
                if (nextSibling) {
                    this.scene._element.insertBefore(fragment, nextSibling);
                } else {
                    this.scene._element.appendChild(fragment);
                }
            }
        } else {
            this.addChild(node);
        }
    },
    /**
[lang:ja]
     * GroupからNodeを削除する.
     * @param {enchant.Node} node 削除するNode.
[/lang]
[lang:en]
     * Delete Node from Group.
     * @param {enchant.Node} node Deleted Node.
[/lang]
     */
    removeChild: function(node) {
        var i = this.childNodes.indexOf(node);
        if (i != -1) {
            this.childNodes.splice(i, 1);
        } else {
            return;
        }
        node.parentNode = null;
        node.dispatchEvent(new enchant.Event('removed'));
        if (this.scene) {
            var e = new enchant.Event('removedfromscene');
            node.scene = null;
            node.dispatchEvent(e);
            if (node._element) {
                this.scene._element.removeChild(node._element);
            } else if (node.childNodes) {
                var nodes = node.childNodes.slice();
                var push = Array.prototype.push;
                while (nodes.length) {
                    node = nodes.pop();
                    node.scene = null;
                    node.dispatchEvent(e);
                    if (node._element) {
                        this.scene._element.removeChild(node._element);
                    } else if (node.childNodes) {
                        push.apply(nodes, node.childNodes);
                    }
                }
            }
        }
    },
    /**
[lang:ja]
     * 最初の子Node.
     * @type {enchant.Node}
[/lang]
[lang:en]
     * First child Node.
     * @type {enchant.Node}
[/lang]
     */
    firstChild: {
        get: function() {
            return this.childNodes[0];
        }
    },
    /**
[lang:ja]
     * 最後の子Node.
     * @type {enchant.Node}
[/lang]
[lang:en]
     * Last child Node.
     * @type {enchant.Node}
[/lang]
     */
    lastChild: {
        get: function() {
            return this.childNodes[this.childNodes.length-1];
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
    }
});

/**
 * @scope enchant.RGroup.prototype
 */
enchant.RGroup = enchant.Class.create(enchant.Group, {
    /**
     * 回転できるGroup。ただし高さ・幅を指定しなければならない
     *
     * @example
     *   var scene = new RotateGroup();
     *   scene.addChild(player);
     *   scene.addChild(enemy);
     *   game.pushScene(scene);
     *
     * @constructs
     * @extends enchant.Group
     */
    initialize: function(width, height) {
        enchant.Group.call(this);

        if(arguments.length < 2) throw("Width and height of RGroup must be specified");
        this.width = width;
        this.height = height;
        this.rotationOrigin = {
            x : width/2 ,
            y : height/2
        }
        this._rotation = 0;
    },
    addChild: function(node) {
        enchant.Group.prototype.addChild.apply(this, arguments);
        node.transformOrigin = "0 0";
    },
    rotation: {
        get: function(){
            return this._rotation;
        },
        set: function(rotation){
            var diff_rotation = (rotation - this._rotation);

            if(diff_rotation == 0)return;
            var rad = diff_rotation / 180 * Math.PI;
            var sin = Math.sin(rad);
            var cos = Math.cos(rad);
            var origin = {
                x : this.width/2,
                y : this.height/2
            }

            for(var i = 0, len = this.childNodes.length; i < len; i++){
                var node = this.childNodes[i];
                node.rotation -= diff_rotation;
                var rx = (node.x - origin.x);
                var ry = (node.y - origin.y);
                node.x = +cos * rx + sin * ry + origin.x;
                node.y = -sin * rx + cos * ry + origin.y;
            }

            this._rotation = rotation;
        }
    }
});



/**
[lang:ja]
 * @scope enchant.Scene.prototype
[/lang]
[lang:en]
 * @scope enchant.Scene.prototype
[/lang]
 */
enchant.Scene = enchant.Class.create(enchant.Group, {
    /**
[lang:ja]
     * 表示オブジェクトツリーのルートになるクラス.
     *
     * @example
     *   var scene = new Scene();
     *   scene.addChild(player);
     *   scene.addChild(enemy);
     *   game.pushScene(scene);
     *
     * @constructs
     * @extends enchant.Group
[/lang]
[lang:en]
     * Class that becomes route for display object tree.
     *
     * @example
     *   var scene = new Scene();
     *   scene.addChild(player);
     *   scene.addChild(enemy);
     *   game.pushScene(scene);
     *
     * @constructs
     * @extends enchant.Group
[/lang]
     */
    initialize: function() {
        enchant.Group.call(this);

        this._element = document.createElement('div');
        this._element.style.position = 'absolute';
        this._element.style.overflow = 'hidden';
        this._element.style.width = (this.width = game.width) + 'px';
        this._element.style.height = (this.height = game.height) + 'px';
        this._element.style[VENDER_PREFIX + 'TransformOrigin'] = '0 0';
        this._element.style[VENDER_PREFIX + 'Transform'] = 'scale(' +  game.scale + ')';

        this.scene = this;

        var that = this;
        if (TOUCH_ENABLED) {
            this._element.addEventListener('touchstart', function(e) {
                var touches = e.touches;
                for (var i = 0, len = touches.length; i < len; i++) {
                    e = new enchant.Event('touchstart');
                    e.identifier = touches[i].identifier;
                    e._initPosition(touches[i].pageX, touches[i].pageY);
                    that.dispatchEvent(e);
                }
            }, false);
            this._element.addEventListener('touchmove', function(e) {
                var touches = e.touches;
                for (var i = 0, len = touches.length; i < len; i++) {
                    e = new enchant.Event('touchmove');
                    e.identifier = touches[i].identifier;
                    e._initPosition(touches[i].pageX, touches[i].pageY);
                    that.dispatchEvent(e);
                }
            }, false);
            this._element.addEventListener('touchend', function(e) {
                var touches = e.changedTouches;
                for (var i = 0, len = touches.length; i < len; i++) {
                    e = new enchant.Event('touchend');
                    e.identifier = touches[i].identifier;
                    e._initPosition(touches[i].pageX, touches[i].pageY);
                    that.dispatchEvent(e);
                }
            }, false);
        } else {
            this._element.addEventListener('mousedown', function(e) {
                var x = e.pageX;
                var y = e.pageY;
                e = new enchant.Event('touchstart');
                e.identifier = game._mousedownID;
                e._initPosition(x, y);
                that.dispatchEvent(e);
                that._mousedown = true;
            }, false);
            game._element.addEventListener('mousemove', function(e) {
                if (!that._mousedown) return;
                var x = e.pageX;
                var y = e.pageY;
                e = new enchant.Event('touchmove');
                e.identifier = game._mousedownID;
                e._initPosition(x, y);
                that.dispatchEvent(e);
            }, false);
            game._element.addEventListener('mouseup', function(e) {
                if (!that._mousedown) return;
                var x = e.pageX;
                var y = e.pageY;
                e = new enchant.Event('touchend');
                e.identifier = game._mousedownID;
                e._initPosition(x, y);
                that.dispatchEvent(e);
                that._mousedown = false;
            }, false);
        }
    },
    /**
[lang:ja]
     * Sceneの背景色.
     * CSSの'color'プロパティと同様の形式で指定できる.
     * @type {String}
[/lang]
[lang:en]
     * Scene background color.
     * Can indicate same format as CSS 'color' property.
     * @type {String}
[/lang]
     */
    backgroundColor: {
        get: function() {
            return this._backgroundColor;
        },
        set: function(color) {
            this._element.style.backgroundColor = this._backgroundColor = color;
        }
    },
    _updateCoordinate: function() {
        this._offsetX = this._x;
        this._offsetY = this._y;
        for (var i = 0, len = this.childNodes.length; i < len; i++) {
            this.childNodes[i]._updateCoordinate();
        }
    }
});

var CANVAS_DRAWING_METHODS = [
    'putImageData', 'drawImage', 'drawFocusRing', 'fill', 'stroke',
    'clearRect', 'fillRect', 'strokeRect', 'fillText', 'strokeText'
];

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
            document.mozSetImageElement(id, this._element)
        } else {
            this._element = document.createElement('canvas');
            this._element.width = width;
            this._element.height = height;
            this._element.style.position = 'absolute';
            this.context = this._element.getContext('2d');

            CANVAS_DRAWING_METHODS.forEach(function(name) {
                var method = this.context[name];
                this.context[name] = function() {
                    method.apply(this, arguments);
                    this._dirty = true;
                }
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
        arguments[0] = image = image._element;
        if (arguments.length == 1) {
            this.context.drawImage(image, 0, 0);
        } else {
            this.context.drawImage.apply(this.context, arguments);
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
            if (src.slice(0, 5) == 'data:') {
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

/**
[lang:ja]
 * @scope enchant.Sound.prototype
[/lang]
[lang:en]
 * @scope enchant.Sound.prototype
[/lang]
 */
enchant.Sound = enchant.Class.create(enchant.EventTarget, {
    /**
[lang:ja]
     * audio要素をラップしたクラス.
     *
     * MP3ファイルの再生はSafari, Chrome, Firefox, Opera, IEが対応
     * (Firefox, OperaではFlashを経由して再生). WAVEファイルの再生は
     * Safari, Chrome, Firefox, Operaが対応している. ブラウザが音声ファイル
     * のコーデックに対応していない場合は再生されない.
     *
     * コンストラクタではなくenchant.Sound.loadを通じてインスタンスを作成する.
     *
     * @constructs
[/lang]
[lang:en]
     * Class to wrap audio elements.
     *
     * Safari, Chrome, Firefox, Opera, and IE all play MP3 files
     * (Firefox and Opera play via Flash). WAVE files can be played on
     * Safari, Chrome, Firefox, and Opera. When the browser is not compatible with
     * the codec the file will not fully play.
     *
     * Instances are created not via constructor but via enchant.Sound.load.
     *
     * @constructs
[/lang]
     */
    initialize: function() {
        enchant.EventTarget.call(this);
        throw new Error("Illegal Constructor");

        /**
[lang:ja]
         * Soundの再生時間 (秒).
         * @type {Number}
[/lang]
[lang:en]
         * Sound play time (seconds).
         * @type {Number}
[/lang]
         */
        this.duration = 0;
    },
    /**
[lang:ja]
     * 再生を開始する.
[/lang]
[lang:en]
     * Begin playing.
[/lang]
     */
    play: function() {
        if (this._element) this._element.play();
    },
    /**
[lang:ja]
     * 再生を中断する.
[/lang]
[lang:en]
     * Interrupt playing.
[/lang]
     */
    pause: function() {
        if (this._element) this._element.pause();
    },
    /**
[lang:ja]
     * 再生を停止する.
[/lang]
[lang:en]
     * Stop playing.
[/lang]
     */
    stop: function() {
        this.pause();
        this.currentTime = 0;
    },
    /**
[lang:ja]
     * Soundを複製する.
     * @return {enchant.Sound} 複製されたSound.
[/lang]
[lang:en]
     * Copy Sound.
     * @return {enchant.Sound} Copied Sound.
[/lang]
     */
    clone: function() {
        var clone;
        if (this._element instanceof Audio) {
            clone = Object.create(enchant.Sound.prototype, {
                _element: { value: this._element.cloneNode(false) },
                duration: { value: this.duration }
            });
        } else if(USE_FLASH_SOUND) {
                       return this;
        } else {
            clone = Object.create(enchant.Sound.prototype);
        }
        enchant.EventTarget.call(clone);
        return clone;
    },
    /**
[lang:ja]
     * 現在の再生位置 (秒).
     * @type {Number}
[/lang]
[lang:en]
     * Current play point (seconds).
     * @type {Number}
[/lang]
     */
    currentTime: {
        get: function() {
            return this._element ? this._element.currentTime : 0;
        },
        set: function(time) {
            if (this._element) this._element.currentTime = time;
        }
    },
    /**
[lang:ja]
     * ボリューム. 0 (無音) ～ 1 (フルボリューム).
     * @type {Number}
[/lang]
[lang:en]
     * Volume. 0 (mute) ～ 1 (full volume).
     * @type {Number}
[/lang]
     */
    volume: {
        get: function() {
            return this._element ? this._element.volume : 1;
        },
        set: function(volume) {
            if (this._element) this._element.volume = volume;
        }
    }
});

/**
[lang:ja]
 * 音声ファイルを読み込んでSurfaceオブジェクトを作成する.
 *
 * @param {String} src ロードする音声ファイルのパス.
 * @param {String} [type] 音声ファイルのMIME Type.
 * @static
[/lang]
[lang:en]
 * Load audio file, create Surface object.
 *
 * @param {String} src Path of loaded audio file.
 * @param {String} [type] MIME Type of audio file.
 * @static
[/lang]
 */
enchant.Sound.load = function(src, type) {
    if (type == null) {
        var ext = findExt(src);
        if (ext) {
            type = 'audio/' + ext;
        } else {
            type = '';
        }
    }
    type = type.replace('mp3', 'mpeg');

    var sound = Object.create(enchant.Sound.prototype);
    enchant.EventTarget.call(sound);
    var audio = new Audio();
    if (!enchant.Sound.enabledInMobileSafari &&
        VENDER_PREFIX == 'webkit' && TOUCH_ENABLED) {
        window.setTimeout(function() {
            sound.dispatchEvent(new enchant.Event('load'));
        }, 0);
    } else {
        if (!USE_FLASH_SOUND && audio.canPlayType(type)) {
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
        } else if (type == 'audio/mpeg') {
            var embed = document.createElement('embed');
            var id = 'enchant-audio' + game._soundID++;
            embed.width = embed.height = 1;
            embed.name = id;
            embed.src = 'sound.swf?id=' + id + '&src=' + src;
            embed.allowscriptaccess = 'always';
            embed.style.position = 'absolute';
            embed.style.left = '-1px';
            sound.addEventListener('load', function() {
                Object.defineProperties(embed, {
                    currentTime: {
                        get: function() { return embed.getCurrentTime() },
                        set: function(time) { embed.setCurrentTime(time) }
                    },
                    volume: {
                        get: function() { return embed.getVolume() },
                        set: function(volume) { embed.setVolume(volume) }
                    }
                });
                sound._element = embed;
                sound.duration = embed.getDuration();
            });
            game._element.appendChild(embed);
            enchant.Sound[id] = sound;
        } else {
            window.setTimeout(function() {
                sound.dispatchEvent(new enchant.Event('load'));
            }, 0);
        }
    }
    return sound;
};

window.addEventListener("message", function(msg, origin){
    var data = JSON.parse(msg.data);
    if (data.type == "event") {
        game.dispatchEvent(new Event(data.value));
    }else if (data.type == "debug"){
        switch(data.value) {
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
}, false);

enchant.Sound.enabledInMobileSafari = false;

function findExt(path) {
    var matched = path.match(/\.\w+$/);
    if (matched && matched.length > 0) {
        return matched[0].slice(1).toLowerCase();
    }

    // for data URI
    if (path.indexOf('data:') === 0) {
        return path.split(/[\/;]/)[1].toLowerCase();
    }
    return null;
}

})();
