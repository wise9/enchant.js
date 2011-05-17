/**
 * enchant.js v0.3
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
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
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
            } else if (Object.getPrototypeOf(module[prop]) == Object.prototype) {
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

// the running instance
var game;

/**
 * クラスのクラス.
 *
 * @param {Function} [superclass] 継承するクラス.
 * @param {*} definition クラス定義.
 * @constructor
 */
enchant.Class = function(superclass, definition) {
    return enchant.Class.create(superclass, definition);
};

/**
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
 */
enchant.Class.create = function(superclass, definition) {
    if (arguments.length == 0) {
        return enchant.Class.create(Object, definition);
    } else if (arguments.length == 1 && typeof arguments[0] != 'function') {
        return enchant.Class.create(Object, arguments[0]);
    }

    for (var prop in definition) if (definition.hasOwnProperty(prop)) {
        if (Object.getPrototypeOf(definition[prop]) != Object.prototype) {
            definition[prop] = { value: definition[prop] };
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
     * DOM Event風味の独自イベント実装を行ったクラス.
     * ただしフェーズの概念はなし.
     * @param {String} type Eventのタイプ
     * @constructs
     */
    initialize: function(type) {
        /**
         * イベントのタイプ.
         * @type {String}
         */
        this.type = type;
        /**
         * イベントのターゲット.
         * @type {*}
         */
        this.target = null;
        /**
         * イベント発生位置のx座標.
         * @type {Number}
         */
        this.x = 0;
        /**
         * イベント発生位置のy座標.
         * @type {Number}
         */
        this.y = 0;
        /**
         * イベントを発行したオブジェクトを基準とするイベント発生位置のx座標.
         * @type {Number}
         */
        this.localX = 0;
        /**
         * イベントを発行したオブジェクトを基準とするイベント発生位置のy座標.
         * @type {Number}
         */
        this.localY = 0;
    },
    _initPosition: function(pageX, pageY) {
        this.x = this.localX = (pageX - game._pageX) / game.scale;
        this.y = this.localY = (pageY - game._pageY) / game.scale;
    }
});

/**
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
 */
enchant.Event.LOAD = 'load';

/**
 * Gameのロード進行中に発生するイベント.
 * プリロードする画像が一枚ロードされる度に発行される. 発行するオブジェクト: enchant.Game
 * @type {String}
 */
enchant.Event.PROGRESS = 'progress';

/**
 * フレーム開始時に発生するイベント.
 * 発行するオブジェクト: enchant.Game, enchant.Node
 * @type {String}
 */
enchant.Event.ENTER_FRAME = 'enterframe';

/**
 * フレーム終了時に発生するイベント.
 * 発行するオブジェクト: enchant.Game
 * @type {String}
 */
enchant.Event.EXIT_FRAME = 'exitframe';

/**
 * Sceneが開始したとき発生するイベント.
 * 発行するオブジェクト: enchant.Scene
 * @type {String}
 */
enchant.Event.ENTER = 'enter';

/**
 * Sceneが終了したとき発生するイベント.
 * 発行するオブジェクト: enchant.Scene
 * @type {String}
 */
enchant.Event.EXIT = 'exit';

/**
 * NodeがGroupに追加されたとき発生するイベント.
 * 発行するオブジェクト: enchant.Node
 * @type {String}
 */
enchant.Event.ADDED = 'added';

/**
 * NodeがSceneに追加されたとき発生するイベント.
 * 発行するオブジェクト: enchant.Node
 * @type {String}
 */
enchant.Event.ADDED_TO_SCENE = 'addedtoscene';

/**
 * NodeがGroupから削除されたとき発生するイベント.
 * 発行するオブジェクト: enchant.Node
 * @type {String}
 */
enchant.Event.REMOVED = 'removed';

/**
 * NodeがSceneから削除されたとき発生するイベント.
 * 発行するオブジェクト: enchant.Node
 * @type {String}
 */
enchant.Event.REMOVED_FROM_SCENE = 'removedfromscene';

/**
 * Nodeに対するタッチが始まったとき発生するイベント.
 * クリックもタッチとして扱われる. 発行するオブジェクト: enchant.Node
 * @type {String}
 */
enchant.Event.TOUCH_START = 'touchstart';

/**
 * Nodeに対するタッチが移動したとき発生するイベント.
 * クリックもタッチとして扱われる. 発行するオブジェクト: enchant.Node
 * @type {String}
 */
enchant.Event.TOUCH_MOVE = 'touchmove';

/**
 * Nodeに対するタッチが終了したとき発生するイベント.
 * クリックもタッチとして扱われる. 発行するオブジェクト: enchant.Node
 * @type {String}
 */
enchant.Event.TOUCH_END = 'touchend';

/**
 * Entityがレンダリングされるときに発生するイベント.
 * 発行するオブジェクト: enchant.Entity
 * @type {String}
 */
enchant.Event.RENDER = 'render';

/**
 * ボタン入力が始まったとき発生するイベント.
 * 発行するオブジェクト: enchant.Game, enchant.Scene
 * @type {String}
 */
enchant.Event.INPUT_START = 'inputstart';

/**
 * ボタン入力が変化したとき発生するイベント.
 * 発行するオブジェクト: enchant.Game, enchant.Scene
 * @type {String}
 */
enchant.Event.INPUT_CHANGE = 'inputchange';

/**
 * ボタン入力が終了したとき発生するイベント.
 * 発行するオブジェクト: enchant.Game, enchant.Scene
 * @type {String}
 */
enchant.Event.INPUT_END = 'inputend';

/**
 * leftボタンが押された発生するイベント.
 * 発行するオブジェクト: enchant.Game, enchant.Scene
 * @type {String}
 */
enchant.Event.LEFT_BUTTON_DOWN = 'leftbuttondown';

/**
 * leftボタンが離された発生するイベント.
 * 発行するオブジェクト: enchant.Game, enchant.Scene
 * @type {String}
 */
enchant.Event.LEFT_BUTTON_UP = 'leftbuttonup';

/**
 * rightボタンが押された発生するイベント.
 * 発行するオブジェクト: enchant.Game, enchant.Scene
 * @type {String}
 */
enchant.Event.RIGHT_BUTTON_DOWN = 'rightbuttondown';

/**
 * rightボタンが離された発生するイベント.
 * 発行するオブジェクト: enchant.Game, enchant.Scene
 * @type {String}
 */
enchant.Event.RIGHT_BUTTON_UP = 'rightbuttonup';

/**
 * upボタンが押された発生するイベント.
 * 発行するオブジェクト: enchant.Game, enchant.Scene
 * @type {String}
 */
enchant.Event.UP_BUTTON_DOWN = 'upbuttondown';

/**
 * upボタンが離された発生するイベント.
 * 発行するオブジェクト: enchant.Game, enchant.Scene
 * @type {String}
 */
enchant.Event.UP_BUTTON_UP = 'upbuttonup';

/**
 * downボタンが離された発生するイベント.
 * 発行するオブジェクト: enchant.Game, enchant.Scene
 * @type {String}
 */
enchant.Event.DOWN_BUTTON_DOWN = 'downbuttondown';

/**
 * downボタンが離された発生するイベント.
 * 発行するオブジェクト: enchant.Game, enchant.Scene
 * @type {String}
 */
enchant.Event.DOWN_BUTTON_UP = 'downbuttonup';

/**
 * aボタンが押された発生するイベント.
 * 発行するオブジェクト: enchant.Game, enchant.Scene
 * @type {String}
 */
enchant.Event.A_BUTTON_DOWN = 'abuttondown';

/**
 * aボタンが離された発生するイベント.
 * 発行するオブジェクト: enchant.Game, enchant.Scene
 * @type {String}
 */
enchant.Event.A_BUTTON_UP = 'abuttonup';

/**
 * bボタンが押された発生するイベント.
 * 発行するオブジェクト: enchant.Game, enchant.Scene
 * @type {String}
 */
enchant.Event.B_BUTTON_DOWN = 'bbuttondown';

/**
 * bボタンが離された発生するイベント.
 * 発行するオブジェクト: enchant.Game, enchant.Scene
 * @type {String}
 */
enchant.Event.B_BUTTON_UP = 'bbuttonup';


/**
 * @scope enchant.EventTarget.prototype
 */
enchant.EventTarget = enchant.Class.create({
    /**
     * DOM Event風味の独自イベント実装を行ったクラス.
     * ただしフェーズの概念はなし.
     * @constructs
     */
    initialize: function() {
        this._listeners = {};
    },
    /**
     * イベントリスナを追加する.
     * @param {String} type イベントのタイプ.
     * @param {function(e:enchant.Event)} listener 追加するイベントリスナ.
     */
    addEventListener: function(type, listener) {
        var listeners = this._listeners[type];
        if (listeners == null) {
            this._listeners[type] = [listener];
        } else if (listeners.indexOf(listener) == -1) {
            listeners.push(listener);
        }
    },
    /**
     * イベントリスナを削除する.
     * @param {String} type イベントのタイプ.
     * @param {function(e:enchant.Event)} listener 削除するイベントリスナ.
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
     * イベントを発行する.
     * @param {enchant.Event} e 発行するイベント.
     */
    dispatchEvent: function(e) {
        e.target = this;
        e.localX = e.x - this._offsetX;
        e.localY = e.y - this._offsetY;
        if (this['on' + e.type] != null) this['on' + e.type]();
        var listeners = this._listeners[e.type];
        if (listeners != null) {
            for (var i = 0, len = listeners.length; i < len; i++) {
                listeners[i].call(this, e);
            }
        }
    }
});

/**
 * @scope enchant.Game.prototype
 */
enchant.Game = enchant.Class.create(enchant.EventTarget, {
    /**
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
     */
    initialize: function(width, height) {
        enchant.EventTarget.call(this);

        var initial = true;
        if (game) {
            initial = false;
            game.stop();
        }
        game = enchant.Game.instance = this;

        /**
         * ゲーム画面の横幅.
         * @type {Number}
         */
        this.width = width || 320;
        /**
         * ゲーム画面の高さ.
         * @type {Number}
         */
        this.height = height || 320;
        /**
         * ゲームの表示倍率.
         * @type {Number}
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
         * ゲームのフレームレート.
         * @type {Number}
         */
        this.fps = 30;
        /**
         * ゲーム開始からのフレーム数.
         * @type {Number}
         */
        this.frame = 0;
        /**
         * ゲームが実行可能な状態かどうか.
         * @type {Boolean}
         */
        this.ready = null;
        /**
         * ゲームが実行状態かどうか.
         * @type {Boolean}
         */
        this.running = false;
        /**
         * ロードされた画像をパスをキーとして保存するオブジェクト.
         * @type {Object.<String, Surface>}
         */
        this.assets = {};
        var assets = this._assets = [];
        (function detectAssets(module) {
            if (module.assets instanceof Array) {
                [].push.apply(assets, module.assets);
            }
            for (var prop in module) if (module.hasOwnProperty(prop)) {
                if (Object.getPrototypeOf(module[prop]) == Object.prototype) {
                    detectAssets(module[prop]);
                }
            }
        })(enchant);

        this._scenes = [];
        /**
         * 現在のScene. Sceneスタック中の一番上のScene.
         * @type {enchant.Scene}
         */
        this.currentScene = null;
        /**
         * ルートScene. Sceneスタック中の一番下のScene.
         * @type {enchant.Scene}
         */
        this.rootScene = new enchant.Scene();
        this.pushScene(this.rootScene);
        /**
         * ローディング時に表示されるScene.
         * @type {enchant.Scene}
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
        this._intervalID = null;

        /**
         * ゲームに対する入力状態を保存するオブジェクト.
         * @type {Object.<String, Boolean>}
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
                if (!this.input[type]) {
                    this.input[type] = true;
                    this.dispatchEvent(new enchant.Event((c++) ? 'inputchange' : 'inputstart'));
                }
                this.currentScene.dispatchEvent(e);
            });
            this.addEventListener(type + 'buttonup', function(e) {
                if (this.input[type]) {
                    this.input[type] = false;
                    this.dispatchEvent(new enchant.Event((--c) ? 'inputchange' : 'inputend'));
                }
                this.currentScene.dispatchEvent(e);
            });
        }, this);

        if (initial) {
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
                document.addEventListener('touchstart', function(e) {
                    e.preventDefault();
                    if (!game.running) e.stopPropagation();
                }, true);
                document.addEventListener('touchmove', function(e) {
                    e.preventDefault();
                    if (!game.running) e.stopPropagation();
                }, true);
                document.addEventListener('touchend', function(e) {
                    e.preventDefault();
                    if (!game.running) e.stopPropagation();
                }, true);
            } else {
                document.addEventListener('mousedown', function(e) {
                    e.preventDefault();
                    game._mousedownID++;
                    if (!game.running) e.stopPropagation();
                }, true);
                document.addEventListener('mousemove', function(e) {
                    e.preventDefault();
                    if (!game.running) e.stopPropagation();
                }, true);
                document.addEventListener('mouseup', function(e) {
                    e.preventDefault();
                    if (!game.running) e.stopPropagation();
                }, true);
            }
        }
    },
    /**
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
     */
    preload: function(assets) {
        if (!(assets instanceof Array)) {
            assets = Array.prototype.slice.call(arguments);
        }
        [].push.apply(this._assets, assets);
    },
    /**
     * ファイルのロードを行う.
     *
     * @param {String} asset ロードするファイルのパス.
     * @param {Function} [callback] ファイルのロードが完了したときに呼び出される関数.
     */
    load: function(src, callback) {
        if (callback == null) callback = function() {};

        var ext = (src.match(/\.(\w+)$/) || [])[1];
        switch (ext) {
            case 'jpg':
            case 'gif':
            case 'png':
                game.assets[src] = enchant.Surface.load(src);
                game.assets[src].addEventListener('load', callback);
                break;
            case 'mp3':
            case 'aac':
            case 'wav':
            case 'ogg':
                game.assets[src] = enchant.Sound.load(src);
                game.assets[src].addEventListener('load', callback);
                break;
            default:
                var req = new XMLHttpRequest();
                req.open('GET', asset, true);
                req.onreadystatechange = function(e) {
                    if (req.readyState == 4) {
                        if (req.status != 200) {
                            throw new Error('Cannot load an asset: ' + src);
                        }

                        var type = req.getResponseHeaders('Content-Type') || '';
                        if (type.match(/^image/)) {
                            game.assets[src] = enchant.Surface.load(src);
                            game.assets[src].addEventListener('load', callback);
                        } else if (type.match(/^audio/)) {
                            game.assets[src] = enchant.Sound.load(src);
                            game.assets[src].addEventListener('load', callback);
                        } else {
                            game.assets[asset] = req.responseText;
                            callback();
                        }
                    }
                };
                req.send(null);
        }
    },
    /**
     * ゲームを開始する.
     *
     * enchant.Game#fpsで設定されたフレームレートに従ってenchant.Game#currentSceneの
     * フレームの更新が行われるようになる. プリロードする画像が存在する場合はロードが
     * 始まりローディング画面が表示される.
     */
    start: function() {
        if (this._intervalID) {
            window.clearInterval(this._intervalID);
        } else if (this._assets.length) {
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
     * ゲームを停止する.
     *
     * フレームは更新されず, プレイヤーの入力も受け付けなくなる.
     * enchant.Game#startで再開できる.
     */
    stop: function() {
        if (this._intervalID) {
            window.clearInterval(this._intervalID);
            this._intervalID = null;
        }
        this.running = false;
    },
    /**
     * ゲームを一時停止する.
     *
     * フレームは更新されず, プレイヤーの入力は受け付ける.
     * enchant.Game#startで再開できる.
     */
    pause: function() {
        if (this._intervalID) {
            window.clearInterval(this._intervalID);
            this._intervalID = null;
        }
    },
    /**
     * 新しいSceneに移行する.
     *
     * Sceneはスタック状に管理されており, 表示順序もスタックに積み上げられた順に従う.
     * enchant.Game#pushSceneを行うとSceneをスタックの一番上に積むことができる. スタックの
     * 一番上のSceneに対してはフレームの更新が行われる.
     *
     * @param {enchant.Scene} scene 移行する新しいScene.
     * @return {enchant.Scene} 新しいScene.
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
     * 現在のSceneを終了させ前のSceneに戻る.
     *
     * Sceneはスタック状に管理されており, 表示順序もスタックに積み上げられた順に従う.
     * enchant.Game#popSceneを行うとスタックの一番上のSceneを取り出すことができる.
     *
     * @return {enchant.Scene} 終了させたScene.
     */
    popScene: function() {
        if (this.currentScene == this.rootScene) {
            return;
        }
        this._element.removeChild(this.currentScene._element);
        this.currentScene.dispatchEvent(new enchant.Event('exit'));
        this.currentScene = this._scenes[this._scenes.length-2];
        this.currentScene.dispatchEvent(new enchant.Event('enter'));
        return this._scenes.pop();
    },
    /**
     * 現在のSceneを別のSceneにおきかえる.
     *
     * enchant.Game#popScene, enchant.Game#pushSceneを同時に行う.
     *
     * @param {enchant.Scene} scene おきかえるScene.
     * @return {enchant.Scene} 新しいScene.
     */
    replaceScene: function(scene) {
        this.popScene();
        return this.pushScene(scene);
    },
    /**
     * Scene削除する.
     *
     * Sceneスタック中からSceneを削除する.
     *
     * @param {enchant.Scene} scene 削除するScene.
     * @return {enchant.Scene} 削除したScene.
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
     * キーバインドを設定する.
     *
     * キー入力をleft, right, up, down, a, bいずれかのボタン入力として割り当てる.
     *
     * @param {Number} key キーバインドを設定するキーコード.
     * @param {String} button 割り当てるボタン.
     */
    keybind: function(key, button) {
        this._keybind[key] = button;
    }
});

/**
 * 現在のGameインスタンス.
 * @type {enchant.Game}
 * @static
 */
enchant.Game.instance = null;

/**
 * @scope enchant.Node.prototype
 */
enchant.Node = enchant.Class.create(enchant.EventTarget, {
    /**
     * Sceneをルートとした表示オブジェクトツリーに属するオブジェクトの基底クラス.
     * 直接使用することはない.
     * @constructs
     * @extends enchant.EventTarget
     */
    initialize: function() {
        enchant.EventTarget.call(this);

        this._x = 0;
        this._y = 0;
        this._offsetX = 0;
        this._offsetY = 0;

        /**
         * Nodeの親Node.
         * @type {enchant.Group}
         */
        this.parentNode = null;
        /**
         * Nodeが属しているScene.
         * @type {enchant.Scene}
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
     * Nodeを移動する.
     * @param {Number} x 移動先のx座標.
     * @param {Number} y 移動先のy座標.
     */
    moveTo: function(x, y) {
        this._x = x;
        this._y = y;
        this._updateCoordinate();
    },
    /**
     * Nodeを移動する.
     * @param {Number} x 移動するx軸方向の距離.
     * @param {Number} y 移動するy軸方向の距離.
     */
    moveBy: function(x, y) {
        this._x += x;
        this._y += y;
        this._updateCoordinate();
    },
    /**
     * Nodeのx座標.
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
     * Nodeのy座標.
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
    }
});

/**
 * @scope enchant.Entity.prototype
 */
enchant.Entity = enchant.Class.create(enchant.Node, {
    /**
     * DOM上で表示する実体を持ったクラス.直接使用することはない.
     * @constructs
     * @extends enchant.Node
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

        /**
         * Entityにボタンの機能を設定する.
         * Entityに対するタッチ, クリックをleft, right, up, down, a, bいずれかの
         * ボタン入力として割り当てる.
         * @type {String}
         */
        this.buttonMode = null;
        /**
         * Entityが押されているかどうか.
         * buttonModeが設定されているときだけ機能する.
         * @type {Boolean}
         */
        this.buttonPressed = false;
        this.addEventListener('touchstart', function() {
            if (!this.buttonMode) return;
            this.buttonPressed = true;
            var e = new Event(button + 'buttondown');
            this.dispatchEvent(e);
            game.dispatchEvent(e);
        });
        this.addEventListener('touchend', function() {
            if (!this.buttonMode) return;
            this.buttonPressed = false;
            var e = new Event(button + 'buttonup');
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
     * Entityの横幅.
     * @type {Number}
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
     * Entityの高さ.
     * @type {Number}
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
     * Entityの背景色.
     * CSSの'color'プロパティと同様の形式で指定できる.
     * @type {String}
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
     * Entityの透明度.
     * 0から1までの値を設定する(0が完全な透明, 1が完全な不透明).
     * @type {Number}
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
     * Entityを表示するかどうかを指定する.
     * @type {Boolean}
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
     * Entityのタッチを有効にするかどうかを指定する.
     * @type {Boolean}
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
     * Entityの矩形が交差しているかどうかにより衝突判定を行う.
     * @param {*} other 衝突判定を行うEntityなどx, y, width, heightプロパティを持ったObject.
     * @return {Boolean} 衝突判定の結果.
     */
    intersect: function(other) {
        return this.x < other.x + other.width && other.x < this.x + this.width &&
            this.y < other.y + other.height && other.y < this.y + this.height;
    },
    /**
     * Entityの中心点どうしの距離により衝突判定を行う.
     * @param {*} other 衝突判定を行うEntityなどx, y, width, heightプロパティを持ったObject.
     * @param {Number} [distance] 衝突したと見なす最大の距離. デフォルト値は二つのEntityの横幅と高さの平均.
     * @return {Boolean} 衝突判定の結果.
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
 * @scope enchant.Sprite.prototype
 */
enchant.Sprite = enchant.Class.create(enchant.Entity, {
    /**
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
    },
    /**
     * Spriteで表示する画像.
     * @type {enchant.Surface}
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
       }
    },
    /**
     * 表示するフレームのインデックス.
     * Spriteと同じ横幅と高さを持ったフレームがimageプロパティの画像に左上から順に
     * 配列されていると見て, 0から始まるインデックスを指定することでフレームを切り替える.
     * @type {Number}
     */
    frame: {
        get: function() {
            return this._frame;
        },
        set: function(frame) {
            this._frame = frame;
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
     * Spriteを拡大縮小する.
     * @param {Number} x 拡大するx軸方向の倍率.
     * @param {Number} [y] 拡大するy軸方向の倍率.
     */
    scale: function(x, y) {
        if (y == null) y = x;
        this._scaleX *= x;
        this._scaleY *= y;
        this._dirty = true;
    },
    /**
     * Spriteを回転する.
     * @param {Number} deg 回転する角度(度数法).
     */
    rotate: function(deg) {
        this._rotation += deg;
        this._dirty = true;
    },
    /**
     * Spriteのx軸方向の倍率.
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
     * Spriteのy軸方向の倍率.
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
     * Spriteの回転角(度数法).
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
    }
});

/**
 * @scope enchant.Label.prototype
 */
enchant.Label = enchant.Class.create(enchant.Entity, {
    /**
     * Labelオブジェクトを作成する.
     * @constructs
     * @extends enchant.Entity
     */
    initialize: function(text) {
        enchant.Entity.call(this);

        this.width = 300;
        this.text = text;
    },
    /**
     * 表示するテキスト.
     * @type {String}
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
     * フォントの指定.
     * CSSの'font'プロパティと同様の形式で指定できる.
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
     * 文字色の指定.
     * CSSの'color'プロパティと同様の形式で指定できる.
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

/**
 * @scope enchant.Map.prototype
 */
enchant.Map = enchant.Class.create(enchant.Entity, {
    /**
     * タイルセットからマップを生成して表示するクラス.
     *
     * @param {Number} tileWidth タイルの横幅.
     * @param {Number} tileHeight タイルの高さ.
     * @constructs
     * @extends enchant.Entity
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
         * タイルが衝突判定を持つかを表す値の二元配列.
         * @type {Array.<Array.<Number>>}
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
     * データを設定する.
     * タイルががimageプロパティの画像に左上から順に配列されていると見て, 0から始まる
     * インデックスの二元配列を設定する.複数指定された場合は後のものから順に表示される.
     * @param {...Array<Array.<Number>>} data タイルのインデックスの二元配列. 複数指定できる.
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
     * Map上に障害物があるかどうかを判定する.
     * @param {Number} x 判定を行うマップ上の点のx座標.
     * @param {Number} y 判定を行うマップ上の点のy座標.
     * @return {Boolean} 障害物があるかどうか.
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
     * Mapで表示するタイルセット画像.
     * @type {enchant.Surface}
     */
    image: {
        get: function() {
            return this._image;
        },
        set: function(image) {
            this._image = image;
            if (RETINA_DISPLAY && game.scale == 2) {
                var img = new Surface(image.width * 2, image.height * 2);
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
     * Mapのタイルの横幅.
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
     * Mapのタイルの高さ.
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
            return this._tileWidth * this._data[0][0].length
        }
    },
    /**
     * @private
     */
    height: {
        get: function() {
            return this._tileHeight * this._data[0].length
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

/**
 * @scope enchant.Group.prototype
 */
enchant.Group = enchant.Class.create(enchant.Node, {
    /**
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
     */
    initialize: function() {
        enchant.Node.call(this);

        /**
         * 子のNode.
         * @type {Array.<enchant.Node>}
         */
        this.childNodes = [];

        this._x = 0;
        this._y = 0;
    },
    /**
     * GroupにNodeを追加する.
     * @param {enchant.Node} node 追加するNode.
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

            var nextSibling;
            if (this.parentNode) {
                nodes = this.parentNode.childNodes;
                nodes = nodes.slice(nodes.indexOf(this) + 1).reverse();
                while (nodes.length) {
                    node = nodes.pop();
                    if (node._element) {
                        nextSibling = node._element;
                        break;
                    } else if (node.childNodes) {
                        push.apply(nodes, node.childNodes.slice().reverse());
                    }
                }
            }
            if (nextSibling) {
                this.scene._element.insertBefore(fragment, nextSibling);
            } else {
                this.scene._element.appendChild(fragment);
            }
        }
    },
    /**
     * GroupからNodeを削除する.
     * @param {enchant.Node} node 削除するNode.
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
     * 最初の子Node.
     * @type {enchant.Node}
     */
    firstChild: {
        get: function() {
            return this.childNodes[0];
        }
    },
    /**
     * 最後の子Node.
     * @type {enchant.Node}
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
 * @scope enchant.Scene.prototype
 */
enchant.Scene = enchant.Class.create(enchant.Group, {
    /**
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
     * Sceneの背景色.
     * CSSの'color'プロパティと同様の形式で指定できる.
     * @type {String}
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
 * @scope enchant.Surface.prototype
 */
enchant.Surface = enchant.Class.create(enchant.EventTarget, {
    /**
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
     */
    initialize: function(width, height) {
        enchant.EventTarget.call(this);

        /**
         * Surfaceの横幅.
         * @type {Number}
         */
        this.width = width;
        /**
         * Surfaceの高さ.
         * @type {Number}
         */
        this.height = height;
        /**
         * Surfaceの描画コンテクスト.
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
     * Surfaceから1ピクセル取得する.
     * @param {Number} x 取得するピクセルのx座標.
     * @param {Number} y 取得するピクセルのy座標.
     * @return {Array.<Number>} ピクセルの情報を[r, g, b, a]の形式で持つ配列.
     */
    getPixel: function(x, y) {
        return this.context.getImageData(x, y, 1, 1).data;
    },
    /**
     * Surfaceに1ピクセル設定する.
     * @param {Number} x 設定するピクセルのx座標.
     * @param {Number} y 設定するピクセルのy座標.
     * @param {Number} r 設定するピクセルのrの値.
     * @param {Number} g 設定するピクセルのgの値.
     * @param {Number} b 設定するピクセルのbの値.
     * @param {Number} a 設定するピクセルの透明度.
     */
    setPixel: function(x, y, r, g, b, a) {
        var pixel = this.context.createImageData(1, 1);
        pixel.data[0] = r;
        pixel.data[1] = g;
        pixel.data[2] = b;
        pixel.data[3] = a;
        this.context.putImageData(pixel, x, y, 1, 1);
    },
    /**
     * Surfaceの全ピクセルをクリアし透明度0の黒に設定する.
     */
    clear: function() {
        this.context.clearRect(0, 0, this.width, this.height);
    },
    /**
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
     * Surfaceを複製する.
     * @return {enchant.Surface} 複製されたSurface.
     */
    clone: function() {
        var clone = new enchant.Surface(this.width, this.height);
        clone.draw(this);
        return clone;
    }
});

/**
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
 */
enchant.Surface.load = function(src) {
    var image = new Image();
    var surface = Object.create(Surface.prototype, {
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
     * audio要素をラップしたクラス.
     *
     * @constructs
     */
    initialize: function() {
        // enchant.EventTarget.call(this);
        throw new Error("Illegal Constructor");
    },
    play: function() {
        this._element.play();
    },
    pause: function() {
        this._element.pause();
    },
    stop: function() {
        this._element.pause();
        this._element.currentTime = this._element.startTime;
    }
});

/**
 * 音声ファイルを読み込んでSurfaceオブジェクトを作成する.
 *
 * @param {String} src ロードする音声ファイルのパス.
 * @static
 */
enchant.Sound.load = function(src) {
    var audio = new Audio();
    var sound = Object.create(enchant.Sound.prototype, {
        _element: { value: audio }
    });
    enchant.EventTarget.call(sound);
    audio.src = src;
    audio.load();
    audio.autoplay = false;
    audio.onerror = function() {
        throw new Error('Cannot load an asset: ' + audio.src);
    };
    audio.onload = function() {
        sound.duration = audio.duration;
        sound.dispatchEvent(new enchant.Event('load'));
    };
};

})();
