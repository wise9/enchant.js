/**
 * enchant.js v0.3
 *
 * Dual licensed under the MIT or GPL Version 3 licenses
 * Copyright (c) Ubiquitous Entertainment Inc.
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

 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.

 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.

 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

/**
 * グローバルにライブラリのクラスをエクスポートする.
 * @namespace
 * @function
 */
var enchant = function() {
    for (var prop in enchant) if (enchant.hasOwnProperty(prop)) {
        window[prop] = enchant[prop];
    }
};

(function() {

"use strict";

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

// the running instance
var game;

/**
 * Classオブジェクトを作成する.
 * @param {Function} [superclass] 継承するクラス.
 * @param {*} definition クラス定義.
 * @constructor
 */
enchant.Class = function(superclass, definition) {
    return enchant.Class.create(superclass, definition);
};

/**
 * Classオブジェクトを作成する.
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

    for (var prop in definition) if (typeof definition[prop] != 'object') {
        definition[prop] = { value: definition[prop] };
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
            superclass.call(this, arguments);
        };
    }
    return constructor;
}

/**
 * @scope enchant.Event.prototype
 */
enchant.Event = enchant.Class.create({
    /**
     * Eventオブジェクトを作成する.
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
 * @type {String}
 * @static
 */
enchant.Event.LOAD = 'load';

/**
 * Gameのロード進行中に発生するイベント.
 * @type {String}
 * @static
 */
enchant.Event.PROGRESS = 'progress';

/**
 * 毎フレームごとに発生するイベント.
 * @type {String}
 * @static
 */
enchant.Event.ENTER_FRAME = 'enterframe';

/**
 * Sceneが開始したとき発生するイベント.
 * @type {String}
 * @static
 */
enchant.Event.ENTER = 'enter';

/**
 * Sceneが終了したとき発生するイベント.
 * @type {String}
 * @static
 */
enchant.Event.EXIT = 'exit';

/**
 * NodeがGroupに追加されたとき発生するイベント.
 * @type {String}
 * @static
 */
enchant.Event.ADDED = 'added';

/**
 * NodeがSceneに追加されたとき発生するイベント.
 * @type {String}
 * @static
 */
enchant.Event.ADDED_TO_SCENE = 'addedtoscene';

/**
 * NodeがGroupから削除されたとき発生するイベント.
 * @type {String}
 * @static
 */
enchant.Event.REMOVED = 'removed';

/**
 * NodeがSceneから削除されたとき発生するイベント.
 * @type {String}
 * @static
 */
enchant.Event.REMOVED_FROM_SCENE = 'removedfromscene';

/**
 * Nodeに対するタッチが始まったとき発生するイベント.
 * @type {String}
 * @static
 */
enchant.Event.TOUCH_START = 'touchstart';

/**
 * Nodeに対するタッチが移動したとき発生するイベント.
 * @type {String}
 * @static
 */
enchant.Event.TOUCH_MOVE = 'touchmove';

/**
 * Nodeに対するタッチが終了したとき発生するイベント.
 * @type {String}
 * @static
 */
enchant.Event.TOUCH_END = 'touchend';

/**
 * leftボタンが押された発生するイベント.
 * @type {String}
 * @static
 */
enchant.Event.LEFT_BUTTON_DOWN = 'leftbuttondown';

/**
 * leftボタンが離された発生するイベント.
 * @type {String}
 * @static
 */
enchant.Event.LEFT_BUTTON_UP = 'leftbuttonup';

/**
 * rightボタンが押された発生するイベント.
 * @type {String}
 * @static
 */
enchant.Event.RIGHT_BUTTON_DOWN = 'rightbuttondown';

/**
 * rightボタンが離された発生するイベント.
 * @type {String}
 * @static
 */
enchant.Event.RIGHT_BUTTON_UP = 'rightbuttonup';

/**
 * upボタンが押された発生するイベント.
 * @type {String}
 * @static
 */
enchant.Event.UP_BUTTON_DOWN = 'upbuttondown';

/**
 * upボタンが離された発生するイベント.
 * @type {String}
 * @static
 */
enchant.Event.UP_BUTTON_UP = 'upbuttonup';

/**
 * downボタンが離された発生するイベント.
 * @type {String}
 * @static
 */
enchant.Event.DOwN_BUTTON_DOWN = 'downbuttondown';

/**
 * downボタンが離された発生するイベント.
 * @type {String}
 * @static
 */
enchant.Event.DOwN_BUTTON_UP = 'downbuttonup';

/**
 * aボタンが押された発生するイベント.
 * @type {String}
 * @static
 */
enchant.Event.A_BUTTON_DOWN = 'abuttondown';

/**
 * aボタンが離された発生するイベント.
 * @type {String}
 * @static
 */
enchant.Event.A_BUTTON_UP = 'abuttonup';

/**
 * bボタンが押された発生するイベント.
 * @type {String}
 * @stbtic
 */
enchant.Event.B_BUTTON_DOWN = 'bbuttondown';

/**
 * bボタンが離された発生するイベント.
 * @type {String}
 * @stbtic
 */
enchant.Event.B_BUTTON_UP = 'bbuttonup';


/**
 * @scope enchant.EventTarget.prototype
 */
enchant.EventTarget = enchant.Class.create({
    /**
     * EventTargetオブジェクトを作成する.
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
            listeners.unshift(listener);
        }
    },
    /**
     * イベントリスナを削除する.
     * @param {String} type イベントのタイプ.
     * @param {function(e:enchant.Event)} listener 削除するイベントリスナ.
     */
    removeEventListner: function(type, listener) {
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
     * Gameオブジェクトを作成する.
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
        game = this;

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
            if (document.body.firstChild) {
                document.body.insertBefore(stage, document.body.firstChild);
            } else {
                document.body.appendChild(stage);
            }
            this.scale = Math.min(
               window.innerWidth / this.width,
               window.innerHeight / this.height
            );
        } else {
            var style = window.getComputedStyle(stage);
            if (style.width && style.height) {
                this.scale = Math.min(
                   parseInt(style.width) / this.width,
                   parseInt(style.height) / this.height
                );
            } else {
                stage.style.width = this.width + 'px';
                stage.style.height = this.height + 'px';
            }
            while (stage.firstChild) {
                stage.removeChild(stage.firstChild);
            }
        }
        stage.style.position = 'relative';
        stage.style.overflow = 'hidden';
        var bounding = stage.getBoundingClientRect();
        this._pageX = Math.round(window.scrollX + bounding.left);
        this._pageY = Math.round(window.scrollY + bounding.top);
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
        this.debug = false;

        this._scenes = [];
        /**
         * ローディング時に表示されるScene.
         * @type {enchant.Scene}
         */
        this.loadingScene = null;
        /**
         * 現在のScene.
         * @type {enchant.Scene}
         */
        this.currentScene = null;
        /**
         * ルートScene.
         * @type {enchant.Scene}
         */
        this.rootScene = new enchant.Scene();
        this.pushScene(this.rootScene);

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

        this.addEventListener('leftbuttondown', function(e) {
            this.input.left = true;
            this.currentScene.dispatchEvent(e);
        });
        this.addEventListener('leftbuttonup', function(e) {
            this.input.left = false;
            this.currentScene.dispatchEvent(e);
        });
        this.addEventListener('rightbuttondown', function(e) {
            this.input.right = true;
            this.currentScene.dispatchEvent(e);
        });
        this.addEventListener('rightbuttonup', function(e) {
            this.input.right = false;
            this.currentScene.dispatchEvent(e);
        });
        this.addEventListener('upbuttondown', function(e) {
            this.input.up = true;
            this.currentScene.dispatchEvent(e);
        });
        this.addEventListener('upbuttonup', function(e) {
            this.input.up = false;
            this.currentScene.dispatchEvent(e);
        });
        this.addEventListener('downbuttondown', function(e) {
            this.input.down = true;
            this.currentScene.dispatchEvent(e);
        });
        this.addEventListener('downbuttonup', function(e) {
            this.input.down = false;
            this.currentScene.dispatchEvent(e);
        });
        this.addEventListener('abuttondown', function(e) {
            this.input.a = true;
            this.currentScene.dispatchEvent(e);
        });
        this.addEventListener('abuttonup', function(e) {
            this.input.a = false;
            this.currentScene.dispatchEvent(e);
        });
        this.addEventListener('bbuttondown', function(e) {
            this.input.b = true;
            this.currentScene.dispatchEvent(e);
        });
        this.addEventListener('bbuttonup', function(e) {
            this.input.b = false;
            this.currentScene.dispatchEvent(e);
        });

        this._mousedown_id = 0;
        if (initial) {
            document.addEventListener('keydown', function(e) {
                if (!game.running) return;
                var button = game._keybind[e.keyCode];
                if (button) {
                    var e = new enchant.Event(button + 'buttondown');
                    game.currentScene.dispatchEvent(e);
                    game.dispatchEvent(e);
                }
            }, true);
            document.addEventListener('keyup', function(e) {
                if (!game.running) return;
                var button = game._keybind[e.keyCode];
                if (button) {
                    var e = new enchant.Event(button + 'buttonup');
                    game.currentScene.dispatchEvent(e);
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
                    game._mousedown_id++;
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
     * ゲームに必要なリソースのプリロードを行う.
     * @param {Array.<String>} assets プリロードする画像のパスの配列.
     */
    preload: function(assets) {
        if (this.ready != null || assets == null) {
            return;
        }
        if (!(assets instanceof Array)) {
            assets = Array.prototype.slice.call(arguments);
        }

        if (this.loadingScene == null) {
            var loading = this.loadingScene = new enchant.Scene();
            loading.backgroundColor = '#000';
            var width = game.width * 0.9 | 0;
            var height = game.width * 0.3 | 0;
            var border = width * 0.05 | 0;
            var bar = new enchant.Sprite(width, height);
            bar.x = (game.width - width) / 2;
            bar.y = (game.height - height) / 2;
            var image = new enchant.Surface(width, height);
            image.context.fillStyle = '#fff';
            image.context.fillRect(0, 0, width, height);
            image.context.fillStyle = '#000';
            image.context.fillRect(border, border, width - border*2, height - border*2);
            bar.image = image;
            var progress = 0, _progress = 0;
            this.addEventListener('progress', function(e) {
                progress = e.loaded / e.total;
            });
            bar.addEventListener('enterframe', function() {
                _progress *= 0.9;
                _progress += progress * 0.1;
                image.context.fillStyle = '#fff';
                image.context.fillRect(border, 0, (width - border*2) * _progress, height);
            });
            loading.addChild(bar);
        }
        this.pushScene(this.loadingScene);

        var count = 0;
        assets.forEach(function(path) {
            var image = new Image();
            image.src = path;
            image.onerror = function() {};
            image.onload = function() {
                game.assets[path] = Object.create(Surface.prototype, {
                    width: { value: image.width },
                    height: { value: image.height },
                    _css: { value: 'url(' + image.src + ')' },
                    _element: { value: image }
                });
                var e = new enchant.Event('progress');
                e.loaded = ++count;
                e.total = assets.length;
                game.dispatchEvent(e);
                if (count == assets.length) {
                    game.popScene();
                    game.ready = true;
                    game.dispatchEvent(new enchant.Event('load'));
                }
            }
        });
        this.ready = false;
    },
    /**
     * ゲームを開始する.
     */
    start: function() {
        if (this._intervalID) {
            window.clearInterval(this._intervalID);
        }
        this.currentTime = Date.now();
        this._intervalID = window.setInterval(function() {
            game._tick()
        }, 1000 / this.fps);
        this.running = true;
    },
    /**
     * ゲームを停止する.
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
     */
    pause: function() {
        if (this._intervalID) {
            window.clearInterval(this._intervalID);
            this._intervalID = null;
        }
    },
    _tick: function() {
        var now = Date.now();
        var e = new enchant.Event('enterframe');
        e.frame = this.frame;
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

        this.frame++;
    },
    /**
     * 新しいSceneに移行する.
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
     * @return {enchant.Scene} 終了させたScene.
     */
    popScene: function() {
        if (this.currentScene === this.rootScene) {
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
     * @param {enchant.Scene} scene おきかえるScene.
     * @return {enchant.Scene} 新しいScene.
     */
    replaceScene: function(scene) {
        this.popScene();
        return this.pushScene(scene);
    },
    /**
     * キーバインドを設定する.
     * @param {Number} key キーバインドを設定するキーコード.
     * @param {String} button 割り当てるボタン.
     */
    keybind: function(key, button) {
        this._keybind[key] = button;
    }
});

/**
 * @scope enchant.Node.prototype
 */
enchant.Node = enchant.Class.create(enchant.EventTarget, {
    /**
     * Nodeオブジェクトを作成する.
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
        this.game = game;

        this.addEventListener('touchstart', function(e) {
            if (this.parentNode) this.parentNode.dispatchEvent(e);
        });
        this.addEventListener('touchmove', function(e) {
            if (this.parentNode) this.parentNode.dispatchEvent(e);
        });
        this.addEventListener('touchend', function(e) {
            if (this.parentNode) this.parentNode.dispatchEvent(e);
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
     * Entityオブジェクトを作成する.
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

        this._previousOffsetX = null;
        this._previousOffsetY = null;

        /**
         * Entityが押されているかどうか.
         * buttonModeがtrueのときだけ機能する.
         * @type {Boolean}
         */
        this.buttonPressed = false;

        var that = this;
        var updateCoordinate = function() {
            that.__updateCoordinate();
        };
        this.addEventListener('addedtoscene', function() {
            game.addEventListener('enterframe', updateCoordinate);
        });
        this.addEventListener('removedfromscene', function() {
            game.removeEventListner('enterframe', updateCoordinate);
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
                e.identifier = game._mousedown_id;
                e._initPosition(x, y);
                that.dispatchEvent(e);
                that._mousedown = true;
            }, false);
            game._element.addEventListener('mousemove', function(e) {
                if (!that._mousedown) return;
                var x = e.pageX;
                var y = e.pageY;
                e = new enchant.Event('touchmove');
                e.identifier = game._mousedown_id;
                e._initPosition(x, y);
                that.dispatchEvent(e);
            }, false);
            game._element.addEventListener('mouseup', function(e) {
                if (!that._mousedown) return;
                var x = e.pageX;
                var y = e.pageY;
                e = new enchant.Event('touchend');
                e.identifier = game._mousedown_id;
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
     * 0から1までの値を設定する(0が完全な透明、1が完全な不透明).
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
     * Entityにボタンの機能を設定する.
     * @type {String}
     */
    buttonMode: {
        get: function() {
            return this._buttonMode;
        },
        set: function(button) {
            if (this._buttonMode == button) {
                return;
            }

            if (this._buttonMode != null) {
                this.removeEventListner('touchstart', this._buttondown);
                this.removeEventListner('touchend', this._buttonup);
            }
            if (button != null) {
                this._buttondown = function() {
                    this.buttonPressed = true;
                    var e = new Event(button + 'buttondown');
                    this.dispatchEvent(e);
                    game.dispatchEvent(e);
                };
                this._buttonup = function() {
                    this.buttonPressed = false;
                    var e = new Event(button + 'buttonup');
                    this.dispatchEvent(e);
                    game.dispatchEvent(e);
                };
                this.addEventListener('touchstart', this._buttondown);
                this.addEventListener('touchend', this._buttonup);
            }
            this._buttonMode = button;
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
        return (_ = this.x + this.width * 0.5 - other.x - other.width * 0.5) * _ +
            (_ = this.y + this.height * 0.5 - other.y - other.height * 0.5) * _ < distance * distance;
    },
    __updateCoordinate: function() {
        if (this._offsetX != this._previousOffsetX) {
            this._style.left = this._offsetX + 'px';
        }
        if (this._offsetY != this._previousOffsetY) {
            this._style.top = this._offsetY + 'px';
        }
        this._previousOffsetX = this._offsetX;
        this._previousOffsetY = this._offsetY;
    }
});

/**
 * @scope enchant.Sprite.prototype
 */
enchant.Sprite = enchant.Class.create(enchant.Entity, {
    /**
     * Spriteオブジェクトを作成する.
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

        this.addEventListener('enterframe', function() {
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
                    this.addEventListener('enterframe', this._dirtyListener);
                    this._element.appendChild(canvas);
                } else {
                    image._parent = this;
                    this._element.appendChild(image._element);
                }
            } else {
                if (this._element.firstChild) {
                    this._element.removeChild(this._element.firstChild);
                    if (this._dirtyListener) {
                        this.removeEventListner('enterframe', this._dirtyListener);
                        this._dirtyListener = null;
                    } else {
                        this._image._parent = null;
                    }
                } else {
                    this._style.backgroundImage = '';
                }
            }
            this._image = image;
       }
    },
    /**
     * 表示するフレームのインデックス.
     * @type {Number}
     */
    frame: {
        get: function() {
            return this._frame;
        },
        set: function(frame) {
            this._frame = frame;
            var row = this._image.width / this._width | 0;
            if (this._element.firstChild) {
                var style = this._element.firstChild.style;
                style.left = -(frame % row) * this._width + 'px';
                style.top = -(frame / row | 0) * this._height + 'px';
            } else {
                this._style.backgroundPosition = [
                    -(frame % row) * this._width, 'px ',
                    -(frame / row | 0) * this._height, 'px'
                ].join('');
            }
        }
    },
    /**
     * Spriteを拡大縮小する.
     * @param {Number} x 拡大するx軸方向の倍率.
     * @param {Number} y 拡大するy軸方向の倍率.
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
     * HTMLタグが使える.
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
     * CSSの'font'プロパティと同様の形式で指定できる.
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
     * Mapオブジェクトを作成する.
     * @param {Number} tileWidth タイルの横幅.
     * @param {Number} tileHeight タイルの高さ.
     * @constructs
     * @extends enchant.Entity
     */
    initialize: function(tileWidth, tileHeight) {
        enchant.Entity.call(this);

        var canvas = document.createElement('canvas');
        canvas.width = game.width;
        canvas.height = game.height;
        this._element.appendChild(canvas);
        this._context = canvas.getContext('2d');

        this._tileWidth = tileWidth || 0;
        this._tileHeight = tileHeight || 0;
        this._image = null;
        this._data = [[[]]];

        this.touchEnabled = false;

        /**
         * タイルが衝突判定を持つかを表す値の二元配列.
         * @type {Array.<Array.<Number>>}
         */
        this.collisionData = null;
    },
    /**
     * データを設定する.
     * @param {Array<Array.<Number>>...} data タイルのインデックスの二元配列.
     */
    loadData: function(data) {
        this._data = Array.prototype.slice.apply(arguments);
    },
    /**
     * Map上に障害物があるかどうかを判定する.
     * 境界は当たり判定に含まれない.
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
     * Mapで表示するタイル画像.
     * @type {enchant.Surface}
     */
    image: {
        get: function() {
            return this._image;
        },
        set: function(image) {
            this._image = image;
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
    __updateCoordinate: function() {
        if (this._image == null) {
            return;
        }

        if (this._offsetX != this._previousOffsetX ||
            this._offsetY != this._previousOffsetY) {
            var image = this._image._element;
            var context = this._context;
            var width = game.width;
            var height = game.height;
            var dx = -this._offsetX;
            var dy = -this._offsetY;
            var tileWidth = this._tileWidth || this._image.width;
            var tileHeight = this._tileHeight || this._image.height;
            var row = this._image.width / tileWidth | 0;
            var col = this._image.height / tileHeight | 0;
            var left = Math.max(dx / tileWidth | 0, 0);
            var top = Math.max(dy / tileHeight | 0, 0);
            context.clearRect(0, 0, width, height);
            for (var i = 0, len = this._data.length; i < len; i++) {
                var data = this._data[i];
                var right = Math.min(Math.ceil((dx + width) / tileWidth), data[0].length);
                var bottom = Math.min(Math.ceil((dy + height) / tileHeight), data.length);
                for (var y = top; y < bottom; y++) {
                    for (var x = left; x < right; x++) {
                        var n = data[y][x];
                        if (0 <= n && n < row * col) {
                            var sx = (n % row) * tileWidth;
                            var sy = (n / row | 0) * tileHeight;
                            context.drawImage(image, sx, sy, tileWidth, tileHeight,
                                x * tileWidth - dx, y * tileHeight - dy, tileWidth, tileHeight );
                        }
                    }
                }
            }
        }
        this._previousOffsetX = this._offsetX;
        this._previousOffsetY = this._offsetY;
    }
});

/**
 * @scope enchant.Group.prototype
 */
enchant.Group = enchant.Class.create(enchant.Node, {
    /**
     * Groupオブジェクトを作成する.
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
        node.parentNode = this;
        this.childNodes.push(node);
        node.dispatchEvent(new enchant.Event('added'));
        if (this.scene) {
            var e = new enchant.Event('addedtoscene');
            node.scene = this.scene;
            node.dispatchEvent(e);
            node._updateCoordinate();

            var fragment = document.createDocumentFragment();
            var nodes;
            var push = Array.prototype.push;
            if (node.childNodes) {
                nodes = node.childNodes.slice().reverse();
                while (nodes.length) {
                    node = nodes.pop();
                    node.scene = this.scene;
                    node.dispatchEvent(e);
                    if (node._element) {
                        fragment.appendChild(node._element);
                    }
                    if (node.childNodes) {
                        push.apply(nodes, node.childNodes.reverse());
                    }
                }
            } else {
                fragment.appendChild(node._element);
            }
            if (!fragment.childNodes.length) return;

            var nextSibling;
            if (this.parentNode) {
                nodes = this.parentNode.childNodes;
                nodes = nodes.slice(nodes.indexOf(this) + 1).reverse();
                while (nodes.length) {
                    node = nodes.pop();
                    if (node.childNodes) {
                        push.apply(nodes, node.childNodes.slice().reverse());
                    } else {
                        nextSibling = node;
                        break;
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
            if (node.childNodes) {
                var nodes = node.childNodes.slice();
                var push = Array.prototype.push;
                while (nodes.length) {
                    node = nodes.pop();
                    node.scene = null;
                    node.dispatchEvent(e);
                    this.scene._element.removeChild(node._element);
                    if (node.childNodes) {
                        push.apply(nodes, node.childNodes);
                    }
                }
            } else {
                this.scene._element.removeChild(node._element);
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
     * Sceneオブジェクトを作成する.
     * @constructs
     * @extends enchant.Group
     */
    initialize: function() {
        enchant.Group.call(this);

        this._element = document.createElement('div');
        this._element.style.position = 'absolute';
        this._element.style.width = game.width + 'px';
        this._element.style.height = game.height + 'px';
        this._element.style[VENDER_PREFIX + 'TransformOrigin'] = '0 0';
        this._element.style[VENDER_PREFIX + 'Transform'] = 'scale(' +  game.scale + ')';

        this.scene = this;
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
var surface_id = 1;

/**
 * @scope enchant.Surface.prototype
 */
enchant.Surface = enchant.Class.create({
    /**
     * Surfaceオブジェクトを作成する.
     * @param {Number} width Surfaceの横幅.
     * @param {Number} height Surfaceの高さ.
     * @constructs
     */
    initialize: function(width, height) {
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

        var id = 'enchant-surface' + surface_id++;
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

            var that = this;
            CANVAS_DRAWING_METHODS.forEach(function(name) {
                var method = that.context[name];
                that.context[name] = function() {
                    method.apply(this, arguments);
                    that._dirty = true;
                }
            });
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
        var clone = new enchant.Surface(this.width, this,height);
        clone.draw(this);
        return clone;
    }
});

})();
