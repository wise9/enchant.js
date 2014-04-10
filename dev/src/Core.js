(function() {
    var core;
    /**
     * @scope enchant.Core.prototype
     */
    enchant.Core = enchant.Class.create(enchant.EventTarget, {
        /**
         * @name enchant.Core
         * @class
         [lang:ja]
         * アプリケーションのメインループ, シーンを管理するクラス.
         *
         * インスタンスは一つしか存在することができず, すでにインスタンスが存在する状態で
         * コンストラクタを実行した場合既存のものが上書きされる. 存在するインスタンスには
         * {@link enchant.Core.instance} からアクセスできる.
         *
         * @param {Number} [width=320] 画面の横幅.
         * @param {Number} [height=320] 画面の高さ.
         [/lang]
         [lang:en]
         * A class for controlling the core’s main loop and scenes.
         *
         * There can be only one instance at a time. When the
         * constructor is executed while an instance exists, the
         * existing instance will be overwritten. The existing instance
         * can be accessed from {@link enchant.Core.instance}.
         *
         * @param {Number} [width=320] The width of the core viewport.
         * @param {Number} [height=320] The height of the core viewport.
         [/lang]
         [lang:de]
         * Klasse, welche die Spielschleife und Szenen kontrolliert.
         *
         * Es kann immer nur eine Instanz geben und sollte der Konstruktor ausgeführt werden,
         * obwohl bereits eine Instanz existiert, wird die vorherige Instanz überschrieben.
         * Auf die aktuell existierende Instanz kann über die {@link enchant.Core.instance}
         * Variable zugegriffen werden.
         *
         * @param {Number} [width=320] Die Breite des Spieles.
         * @param {Number} [height=320] Die Höhe des Spieles.
         [/lang]
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
                this._pageX = stage.getBoundingClientRect().left;
                this._pageY = stage.getBoundingClientRect().top;
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
            stage.style.webkitTapHighlightColor = 'rgba(0, 0, 0, 0)';
            this._element = stage;

            this.addEventListener('coreresize', this._oncoreresize);

            this._width = width;
            this._height = height;
            this.scale = scale;

            /**
             [lang:ja]
             * フレームレート.
             [/lang]
             [lang:en]
             * The frame rate of the core.
             [/lang]
             [lang:de]
             * Frame Rate des Spieles.
             [/lang]
             * @type Number
             */
            this.fps = 30;
            /**
             [lang:ja]
             * アプリの開始からのフレーム数.
             [/lang]
             [lang:en]
             * The number of frames processed since the core was started.
             [/lang]
             [lang:de]
             * Anzahl der Frames seit dem Spielestart.
             [/lang]
             * @type Number
             */
            this.frame = 0;
            /**
             [lang:ja]
             * アプリが実行可能な状態かどうか.
             [/lang]
             [lang:en]
             * Indicates whether or not the core can be executed.
             [/lang]
             [lang:de]
             * Zeigt an ob das Spiel ausgeführt werden kann.
             [/lang]
             * @type Boolean
             */
            this.ready = false;
            /**
             [lang:ja]
             * アプリが実行状態かどうか.
             [/lang]
             [lang:en]
             * Indicates whether or not the core is currently running.
             [/lang]
             [lang:de]
             * Zeigt an ob das Spiel derzeit ausgeführt wird.
             [/lang]
             * @type Boolean
             */
            this.running = false;
            /**
             [lang:ja]
             * ロードされた画像をパスをキーとして保存するオブジェクト.
             [/lang]
             [lang:en]
             * Object which stores loaded assets using their paths as keys.
             [/lang]
             [lang:de]
             * Geladene Objekte werden unter dem Pfad als Schlüssel in diesem Objekt abgelegt.
             [/lang]
             * @type Object
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
             [lang:ja]
             * 現在のScene. Sceneスタック中の一番上のScene.
             [/lang]
             [lang:en]
             * The Scene which is currently displayed. This Scene is on top of the Scene stack.
             [/lang]
             [lang:de]
             * Die aktuell dargestellte Szene.
             * Diese Szene befindet sich oben auf dem Stapelspeicher.
             [/lang]
             * @type enchant.Scene
             */
            this.currentScene = null;
            /**
             [lang:ja]
             * ルートScene. Sceneスタック中の一番下のScene.
             [/lang]
             [lang:en]
             * The root Scene. The Scene at the bottom of the Scene stack.
             [/lang]
             [lang:de]
             * Die Ursprungsszene.
             * Diese Szene befindet sich unten auf dem Stapelspeicher.
             [/lang]
             * @type enchant.Scene
             */
            this.rootScene = new enchant.Scene();
            this.pushScene(this.rootScene);
            /**
             [lang:ja]
             * ローディング時に表示されるScene.
             [/lang]
             [lang:en]
             * The Scene to be displayed during loading.
             [/lang]
             [lang:de]
             * Die Szene, welche während des Ladevorgangs dargestellt wird.
             [/lang]
             * @type enchant.Scene
             */
            this.loadingScene = new enchant.LoadingScene();

            /**
             [lang:ja]
             * 一度でも {@link enchant.Core#start} が呼ばれたことがあるかどうか.
             [/lang]
             [/lang:ja]
             * Indicates whether or not {@link enchant.Core#start} has been called.
             [/lang]
             [lang:de]
             [/lang]
             * @type Boolean
             * @private
             */
            this._activated = false;

            this._offsetX = 0;
            this._offsetY = 0;

            /**
             [lang:ja]
             * アプリに対する入力状態を保存するオブジェクト.
             [/lang]
             [lang:en]
             * Object that saves the current input state for the core.
             [/lang]
             [lang:de]
             * Objekt, welches den aktuellen Eingabestatus des Spieles speichert.
             [/lang]
             * @type Object
             */
            this.input = {};

            this.keyboardInputManager = new enchant.KeyboardInputManager(window.document, this.input);
            this.keyboardInputManager.addBroadcastTarget(this);
            this._keybind = this.keyboardInputManager._binds;

            if (!enchant.ENV.KEY_BIND_TABLE) {
                enchant.ENV.KEY_BIND_TABLE = {};
            }

            for (var prop in enchant.ENV.KEY_BIND_TABLE) {
                this.keybind(prop, enchant.ENV.KEY_BIND_TABLE[prop]);
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
         [lang:ja]
         * 画面の横幅.
         [/lang]
         [lang:en]
         * The width of the core screen.
         [/lang]
         [lang:de]
         * Breite des Spieles.
         [/lang]
         * @type Number
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
         [lang:ja]
         * 画面の高さ.
         [/lang]
         [lang:en]
         * The height of the core screen.
         [/lang]
         [lang:de]
         * Höhe des Spieles.
         [/lang]
         * @type Number
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
         [lang:ja]
         * 画面の表示倍率.
         [/lang]
         [lang:en]
         * The scaling of the core rendering.
         [/lang]
         [lang:de]
         * Skalierung der Spieldarstellung.
         [/lang]
         * @type Number
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
         [lang:ja]
         * ファイルのプリロードを行う.
         *
         * プリロードを行うよう設定されたファイルは {@link enchant.Core#start} が実行されるとき
         * ロードが行われる. 全てのファイルのロードが完了したときはCoreオブジェクトからload
         * イベントが発行され, Coreオブジェクトのassetsプロパティから画像ファイルの場合は
         * Surfaceオブジェクトとして, 音声ファイルの場合はSoundオブジェクトとして,
         * その他の場合は文字列としてアクセスできるようになる.
         *
         * なおこのSurfaceオブジェクトは {@link enchant.Surface.load} を使って作成されたものである
         * ため直接画像操作を行うことはできない. enchant.Surface.loadの項を参照.
         *
         * @example
         * core.preload('player.gif');
         * core.onload = function() {
         *     var sprite = new Sprite(32, 32);
         *     sprite.image = core.assets['player.gif']; // パス名でアクセス
         *     ...
         * };
         * core.start();
         *
         * @param {...String|String[]} assets プリロードするファイルのパス. 複数指定できる.
         [/lang]
         [lang:en]
         * File preloader.
         *
         * Loads the files specified in the parameters when
         * {@link enchant.Core#start} is called.
         * When all files are loaded, a {@link enchant.Event.LOAD}
         * event is dispatched from the Core object. Depending on the
         * type of each file, different objects will be created and
         * stored in {@link enchant.Core#assets} Variable.
         *
         * When an image file is loaded, a {@link enchant.Surface} is
         * created. If a sound file is loaded, an {@link enchant.Sound}
         * object is created. Any other file type will be accessible
         * as a string.
         *
         * In addition, because this Surface object is created with
         * {@link enchant.Surface.load}, it is not possible to
         * manipulate the image directly.
         * Refer to the {@link enchant.Surface.load} documentation.
         *
         * @example
         * core.preload('player.gif');
         * core.onload = function() {
         *     var sprite = new Sprite(32, 32);
         *     sprite.image = core.assets['player.gif']; // Access via path
         *     ...
         * };
         * core.start();
         *
         * @param {...String|String[]} assets Path of images to be preloaded.
         * Multiple settings possible.
         [/lang]
         [lang:de]
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
         * core.preload('player.gif');
         * core.onload = function() {
         *     var sprite = new Sprite(32, 32);
         *     sprite.image = core.assets['player.gif']; // zugriff mittels Dateipfades
         *     ...
         * };
         * core.start();
         *
         * @param {...String|String[]} assets Pfade zu den Dateien die im voraus geladen werden sollen.
         * Mehrfachangaben möglich.
         [/lang]
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
         [lang:ja]
         * ファイルのロードを行う.
         *
         * @param {String} src ロードするファイルのパス.
         * @param {String} [alias] ロードするファイルに設定したい名前.
         * @param {Function} [callback] ファイルのロードが完了したときに呼び出される関数.
         * @param {Function} [onerror] ファイルのロードに失敗したときに呼び出される関数.
         * @return {enchant.Deferred} ファイル読み込み後に起動するDeferredオブジェクト.
         [/lang]
         [lang:en]
         * Loads a file.
         *
         * @param {String} src File path of the resource to be loaded.
         * @param {String} [alias] Name you want to designate for the resource to be loaded.
         * @param {Function} [callback] Function to be called if the file loads successfully.
         * @param {Function} [onerror] Function to be called if the file fails to load.
         * @return {enchant.Deferred}
         [/lang]
         [lang:de]
         * Laden von Dateien.
         *
         * @param {String} src Pfad zu der Datei die geladen werden soll.
         * @param {String} [alias]
         * @param {Function} [callback] Funktion die ausgeführt wird wenn das laden abgeschlossen wurde.
         * @param {Function} [onerror]
         * @return {enchant.Deferred}
         [/lang]
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
                                _callback.call(enchant.Core.instance, new enchant.Event('load'));
                            }
                        }
                    };
                    req.send(null);
                }
                return d;
            });
        },
        /**
         [lang:ja]
         * アプリを起動する.
         *
         * enchant.Core#fpsで設定されたフレームレートに従って {@link enchant.Core#currentScene} の
         * フレームの更新が行われるようになる. プリロードする画像が存在する場合はロードが
         * 始まりローディング画面が表示される.
         * @return {enchant.Deferred} ローディング画面終了後に起動するDeferredオブジェクト.
         [/lang]
         [lang:en]
         * Start the core.
         *
         * Sets the framerate of the {@link enchant.Core#currentScene}
         * according to the value stored in {@link enchant.core#fps}. If
         * there are images to preload, loading will begin and the
         * loading screen will be displayed.
         * @return {enchant.Deferred}
         [/lang]
         [lang:de]
         * Starte das Spiel
         *
         * Je nach der Frame Rate definiert in {@link enchant.Core#fps}, wird der Frame in der
         * {@link enchant.Core#currentScene} aktualisiert. Sollten Dateien die im voraus geladen werden
         * sollen vorhanden sein, beginnt das laden dieser Dateien und der Ladebildschirm wird dargestellt.
         * @return {enchant.Deferred}
         [/lang]
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
                if (enchant.ENV.BROWSER === 'mobilesafari' &&
                    enchant.ENV.USE_WEBAUDIO &&
                    enchant.ENV.USE_TOUCH_TO_START_SCENE) {
                    var d = new enchant.Deferred();
                    var scene = this._createTouchToStartScene();
                    scene.addEventListener(enchant.Event.TOUCH_START, function waitTouch() {
                        this.removeEventListener(enchant.Event.TOUCH_START, waitTouch);
                        var a = new enchant.WebAudioSound();
                        a.buffer = enchant.WebAudioSound.audioContext.createBuffer(1, 1, 48000);
                        a.play();
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
                    enchant.Core.instance.loadingScene.dispatchEvent(new enchant.Event(enchant.Event.LOAD));
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
        _createTouchToStartScene: function() {
            var label = new enchant.Label('Touch to Start'),
                size = Math.round(core.width / 10),
                scene = new enchant.Scene();

            label.color = '#fff';
            label.font = (size - 1) + 'px bold Helvetica,Arial,sans-serif';
            label.textAlign = 'center';
            label.width = core.width;
            label.height = label._boundHeight;
            label.y = (core.height - label.height) / 2;

            scene.backgroundColor = '#000';
            scene.addChild(label);

            return scene;
        },
        /**
         [lang:ja]
         * アプリをデバッグモードで開始する.
         *
         * {@link enchant.Core#_debug} フラグを true にすることでもデバッグモードをオンにすることができる
         * @return {enchant.Deferred} ローディング画面終了後に起動するDeferredオブジェクト.
         [/lang]
         [lang:en]
         * Start application in debug mode.
         *
         * Core debug mode can be turned on even if the
         * {@link enchant.Core#_debug} flag is already set to true.
         * @return {enchant.Deferred}
         [/lang]
         [lang:de]
         * Startet den Debug-Modus des Spieles.
         *
         * Auch wenn die {@link enchant.Core#_debug} Variable gesetzt ist,
         * kann der Debug-Modus gestartet werden.
         * @return {enchant.Deferred}
         [/lang]
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
         [lang:ja]
         * 次のフレームの実行を要求する.
         * @param {Number} delay requestAnimationFrameを呼び出すまでの遅延時間.
         [/lang]
         [lang:en]
         * Requests the next frame.
         * @param {Number} delay Amount of time to delay before calling requestAnimationFrame.
         [/lang]
         [lang:de]
         [/lang]
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
         [lang:ja]
         * Core#_tickを呼び出す.
         * @param {Number} time 呼び出し時の時間.
         [/lang]
         [lang:en]
         * Calls {@link enchant.Core#_tick}.
         * @param {Number} time
         [/lang]
         [lang:de]
         * @param {Number} time
         [/lang]
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
         [lang:ja]
         * アプリを停止する.
         *
         * フレームは更新されず, ユーザの入力も受け付けなくなる.
         * {@link enchant.Core#resume} で再開できる.
         [/lang]
         [lang:en]
         * Stops the core.
         *
         * The frame will not be updated, and player input will not be accepted anymore.
         * Core can be restarted using {@link enchant.Core#resume}.
         [/lang]
         [lang:de]
         * Stoppt das Spiel.
         *
         * Der Frame wird nicht mehr aktualisiert und Spielereingaben werden nicht
         * mehr akzeptiert. Das spiel kann mit der {@link enchant.Core#resume} Methode
         * erneut gestartet werden.
         [/lang]
         */
        stop: function() {
            this.ready = false;
            this.running = false;
        },
        /**
         [lang:ja]
         * アプリを一時停止する.
         *
         * フレームは更新されず, ユーザの入力は受け付ける.
         * {@link enchant.Core#resume} で再開できる.
         [/lang]
         [lang:en]
         * Stops the core.
         *
         * The frame will not be updated, and player input will not be accepted anymore.
         * Core can be started again using {@link enchant.Core#resume}.
         [/lang]
         [lang:de]
         * Stoppt das Spiel.
         *
         * Der Frame wird nicht mehr aktualisiert und Spielereingaben werden nicht
         * mehr akzeptiert. Das spiel kann mit der {@link enchant.Core#resume} Methode
         * erneut gestartet werden.
         [/lang]
         */
        pause: function() {
            this.ready = false;
        },
        /**
         [lang:ja]
         * アプリを再開する.
         [/lang]
         [lang:en]
         * Resumes core operations.
         [/lang]
         [lang:de]
         * Setzt die Ausführung des Spieles fort.
         [/lang]
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
         [lang:ja]
         * 新しいSceneに移行する.
         *
         * Sceneはスタック状に管理されており, 表示順序もスタックに積み上げられた順に従う.
         * enchant.Core#pushSceneを行うとSceneをスタックの一番上に積むことができる. スタックの
         * 一番上のSceneに対してはフレームの更新が行われる.
         *
         * @param {enchant.Scene} scene 移行する新しいScene.
         * @return {enchant.Scene} 新しいScene.
         [/lang]
         [lang:en]
         * Switches to a new Scene.
         *
         * Scenes are controlled using a stack, with the top scene on
         * the stack being the one displayed.
         * When {@link enchant.Core#pushScene} is executed, the Scene is
         * placed top of the stack. Frames will be only updated for the
         * Scene which is on the top of the stack.
         *
         * @param {enchant.Scene} scene The new scene to display.
         * @return {enchant.Scene} The new Scene.
         [/lang]
         [lang:de]
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
         * enchant.Core#popSceneを行うとスタックの一番上のSceneを取り出すことができる.
         *
         * @return {enchant.Scene} 終了させたScene.
         [/lang]
         [lang:en]
         * Ends the current Scene and returns to the previous Scene.
         *
         * Scenes are controlled using a stack, with the top scene on
         * the stack being the one displayed.
         * When {@link enchant.Core#popScene} is executed, the Scene at
         * the top of the stack is removed and returned.
         *
         * @return {enchant.Scene} Removed Scene.
         [/lang]
         [lang:de]
         * Beendet die aktuelle Szene und wechselt zu der vorherigen Szene.
         *
         * Szenen werden durch einen Stapelspeicher kontrolliert und die Darstellungsreihenfolge
         * folgt ebenfalls der Ordnung des Stapelspeichers.
         * Wenn die {@link enchant.Core#popScene} Methode ausgeführt wird, wird die Szene oben auf dem
         * Stapelspeicher entfernt und liefert diese als Rückgabewert.
         *
         * @return {enchant.Scene} Die Szene, die beendet wurde.
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
         * {@link enchant.Core#popScene}, {@link enchant.Core#pushScene}を同時に行う.
         *
         * @param {enchant.Scene} scene おきかえるScene.
         * @return {enchant.Scene} 新しいScene.
         [/lang]
         [lang:en]
         * Overwrites the current Scene with a new Scene.
         *
         * Executes {@link enchant.Core#popScene} and {@link enchant.Core#pushScene}
         * one after another to replace the current scene with the new scene.
         *
         * @param {enchant.Scene} scene The new scene with which to replace the current scene.
         * @return {enchant.Scene} The new Scene.
         [/lang]
         [lang:de]
         * Ersetzt die aktuelle Szene durch eine neue Szene.
         *
         * {@link enchant.Core#popScene}, {@link enchant.Core#pushScene} werden nacheinander
         * ausgeführt um die aktuelle Szene durch die neue zu ersetzen.
         *
         * @param {enchant.Scene} scene Die neue Szene, welche die aktuelle Szene ersetzen wird.
         * @return {enchant.Scene} Die neue Szene.
         [/lang]
         */
        replaceScene: function(scene) {
            this.popScene();
            return this.pushScene(scene);
        },
        /**
         [lang:ja]
         * Sceneを削除する.
         *
         * Sceneスタック中からSceneを削除する.
         *
         * @param {enchant.Scene} scene 削除するScene.
         * @return {enchant.Scene} 削除したScene.
         [/lang]
         [lang:en]
         * Removes a Scene from the Scene stack.
         *
         * If the scene passed in as a parameter is not the current
         * scene, the stack will be searched for the given scene.
         * If the given scene does not exist anywhere in the stack,
         * this method returns null.
         *
         * @param {enchant.Scene} scene Scene to be removed.
         * @return {enchant.Scene} The deleted Scene.
         [/lang]
         [lang:de]
         * Entfernt eine Szene.
         *
         * Entfernt eine Szene aus dem Szenen-Stapelspeicher.
         *
         * @param {enchant.Scene} scene Die Szene die entfernt werden soll.
         * @return {enchant.Scene} Die entfernte Szene.
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
        _buttonListener: function(e) {
            this.currentScene.dispatchEvent(e);
        },
        /**
         [lang:ja]
         * キーバインドを設定する.
         *
         * @param {Number} key キーバインドを設定するキーコード.
         * @param {String} button 割り当てるボタン.
         [/lang]
         [lang:en]
         * Bind a key code to an enchant.js button.
         *
         * Binds the given key code to the given enchant.js button
         * ('left', 'right', 'up', 'down', 'a', 'b').
         *
         * @param {Number} key Key code for the button to be bound.
         * @param {String} button An enchant.js button.
         [/lang]
         [lang:de]
         * Bindet eine Taste.
         *
         * @param {Number} key Der Tastencode der Taste die gebunden werden soll.
         * @param {String} button Der enchant.js Knopf (left, right, up, down, a, b).
         [/lang]
         * @return {enchant.Core} this
         */
        keybind: function(key, button) {
            this.keyboardInputManager.keybind(key, button);
            this.addEventListener(button + 'buttondown', this._buttonListener);
            this.addEventListener(button + 'buttonup', this._buttonListener);
            return this;
        },
        /**
         [lang:ja]
         * キーバインドを削除する.
         * @param {Number} key 削除するキーコード.
         [/lang]
         [lang:en]
         * Delete the key binding for the given key.
         *
         * @param {Number} key Key code whose binding is to be deleted.
         [/lang]
         [lang:de]
         * Entbindet eine Taste.
         *
         * @param {Number} key Der Tastencode der entfernt werden soll.
         [/lang]
         * @return {enchant.Core} this
         */
        keyunbind: function(key) {
            var button = this._keybind[key];
            this.keyboardInputManager.keyunbind(key);
            this.removeEventListener(button + 'buttondown', this._buttonListener);
            this.removeEventListener(button + 'buttonup', this._buttonListener);
            return this;
        },
        changeButtonState: function(button, bool) {
            this.keyboardInputManager.changeState(button, bool);
        },
        /**
         [lang:ja]
         * Core#startが呼ばれてから経過した時間を取得する.
         * @return {Number} 経過した時間 (秒)
         [/lang]
         [lang:en]
         * Get the core time (not actual) elapsed since {@link enchant.Core#start} was called.
         * @return {Number} Time elapsed (in seconds).
         [/lang]
         [lang:de]
         * Liefert die vergange Spielzeit (keine reale) die seit dem Aufruf von {@link enchant.Core#start}
         * vergangen ist.
         * @return {Number} Die vergangene Zeit (Sekunden)
         [/lang]
         */
        getElapsedTime: function() {
            return this.frame / this.fps;
        }
    });

    /**
     [lang:ja]
     * 拡張子に対応したアセットのロード関数.
     * ロード関数はファイルのパス, 拡張子, コールバックを引数に取り,
     * 対応したクラスのインスタンスを返す必要がある.
     * コールバックはEvent.LOADとEvent.ERRORでハンドルする.
     [/lang]
     [lang:en]
     * Functions for loading assets of the corresponding file type.
     * The loading functions must take the file path, extension and
     * callback function as arguments, then return the appropriate
     * class instance.
     [/lang]
     [lang:de]
     [/lang]
     * @static
     * @private
     * @type Object
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
     [lang:ja]
     * ファイルパスを取り, 拡張子を返す.
     * @param {String} path ファイルパス.
     [/lang]
     [lang:en]
     * Get the file extension from a path.
     * @param {String} path file path.
     [/lang]
     [lang:de]
     * @param {String} path
     [/lang]
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
     [lang:ja]
     * 現在のCoreインスタンス.
     [/lang]
     [lang:en]
     * The current Core instance.
     [/lang]
     [lang:de]
     * Die aktuelle Instanz des Spieles.
     [/lang]
     * @type enchant.Core
     * @static
     */
    enchant.Core.instance = null;
}());
