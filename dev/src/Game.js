/**
 * @scope enchant.Game.prototype
 */

(function() {
    var game;

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
                    if ((37 <= e.keyCode && e.keyCode <= 40) || e.keyCode === 32) {
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
                } else {
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
                            // フォームじゃない
                            e.preventDefault();
                            if (!game.running) {
                                e.stopPropagation();
                            }
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
            this.currentTime = Date.now();
            this._intervalID = window.setInterval(function() {
                game._tick();
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
            var now = Date.now();
            var e = new enchant.Event('enterframe');
            e.elapsed = now - this.currentTime;
            this.currentTime = now;

            var nodes = this.currentScene.childNodes.slice();
            var push = Array.prototype.push;
            while (nodes.length) {
                var node = nodes.pop();
                node.dispatchEvent(e);
                node.age++;
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
            if (this._intervalID) {
                return;
            }
            this.currentTime = Date.now();
            this._intervalID = window.setInterval(function() {
                game._tick();
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
        getElapsedTime: function() {
            return this.frame / this.fps;
        }
    });
// img
    enchant.Game._loadFuncs = {};
    enchant.Game._loadFuncs['jpg'] =
        enchant.Game._loadFuncs['jpeg'] =
            enchant.Game._loadFuncs['gif'] =
                enchant.Game._loadFuncs['png'] =
                    enchant.Game._loadFuncs['bmp'] = function(src, callback) {
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
     * find extension from path
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
}());
