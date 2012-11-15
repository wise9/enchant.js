/**
 * @fileOverview
 * nineleap.enchant.js
 * @version 0.3 (2012/02/01)
 * @requires enchant.js v0.4.0 or later
 *
 * @description
 * enchant.js extension for 9leap.net
 * 9leap.net 向けの enchant.js 拡張プラグイン。
 * game.end の引数にスコアと結果の文字列を渡すことで、ランキングに登録できる。
 * (9leapにアップロードした後のみランキング画面にジャンプする)
 *
 * @usage

 var game = new Game(320, 320);

 game.onload = function(){
 // executed after player pushed "START"
 // ...
 if(some.condition)game.end(score, result);
 };

 game.start();

 */

(function() {

    /**
     * @type {Object}
     */
    enchant.nineleap = { assets: ['start.png', 'end.png'] };

    /**
     * @scope enchant.nineleap.Game.prototype
     */
    enchant.nineleap.Game = enchant.Class.create(enchant.Game, {
        /**
         * start, gameover の画像を表示し、
         * 最後にスコアを送信するように拡張された Game クラス
         * @param width
         * @param height
         * @constructs
         */
        initialize: function(width, height) {
            enchant.Game.call(this, width, height);
            this.addEventListener('load', function() {
                var game = this;
                this.startScene = new enchant.nineleap.SplashScene();
                this.startScene._element.style.zIndex = 10;
                this.startScene.image = this.assets['start.png'];
                this.startScene.addEventListener('touchend', function() {
                    if (game.started === false) {
                        if (game.onstart != null) {
                            game.onstart();
                        }
                        game.started = true;
                        gameStart = true;   // deprecated
                    }
                    if (game.currentScene === this) {
                        game.popScene();
                    }
                    this.removeEventListener('touchend', arguments.callee);
                });
                this.addEventListener('keydown', function() {
                    if (this.started === false) {
                        if (this.onstart != null) {
                            this.onstart();
                        }
                        this.started = true;
                        gameStart = true;   // deprecated
                    }
                    if (game.currentScene === game.startScene) {
                        game.popScene();
                    }
                    this.removeEventListener('keydown', arguments.callee);
                });
                this.pushScene(this.startScene);

                this.endScene = new SplashScene();
                this.endScene.image = this.assets['end.png'];
            });
            this.scoreQueue = false;
            this.started = false;
            gameStart = false; // deprecated
        },

        loadImage: function(src, callback) {
            if (callback == null) {
                callback = function() {
                };
            }
            this.assets[src] = enchant.Surface.load(src);
            this.assets[src].addEventListener('load', callback);
        },

        start: function() {
            var game = this;

            if (this._intervalID) {
                window.clearInterval(this._intervalID);
            } else if (this._assets.length) {

                if (enchant.Sound.enabledInMobileSafari && !game._touched &&
                    enchant.ENV.VENDOR_PREFIX === 'webkit' && enchant.ENV.TOUCH_ENABLED) {
                    console.log("mobile_first");
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
                var tAssets = (this._twitterAssets != undefined) ? this._twitterAssets : [];
                var nAssets = (this._netpriceData != undefined) ? this._netpriceData : [];
                var mAssets = (this._memoryAssets != undefined) ? this._memoryAssets : [];
                var loaded = 0;
                var total = assets.length + tAssets.length + nAssets.length + mAssets.length;
                var i, l;
                var loadListener = function() {
                    var e = new enchant.Event('progress');
                    e.loaded = ++loaded;
                    e.total = total;
                    game.dispatchEvent(e);
                    if (loaded === total) {
                        game.removeScene(game.loadingScene);
                        game.dispatchEvent(new enchant.Event('load'));
                    }
                };
                for (i = 0, l = assets.length; i < l; i++) {
                    this.load(assets[i], loadListener);
                }
                for (i = 0, l = tAssets.length; i < l; i++) {
                    this.loadImage(tAssets[i], function() {
                        var e = new enchant.Event('progress');
                        e.loaded = ++loaded;
                        e.total = total;
                        game.dispatchEvent(e);
                        if (loaded === total) {
                            game.removeScene(game.loadingScene);
                            game.dispatchEvent(new enchant.Event('load'));
                        }
                    });
                }
                for (i = 0, l = mAssets.length; i < l; i++) {
                    this.loadImage(mAssets[i], function() {
                        var e = new enchant.Event('progress');
                        e.loaded = ++loaded;
                        e.total = total;
                        game.dispatchEvent(e);
                        if (loaded === total) {
                            game.removeScene(game.loadingScene);
                            game.dispatchEvent(new enchant.Event('load'));
                        }
                    });
                }

                for (i = 0, l = nAssets.length; i < l; i++) {
                    this.loadImage(nAssets[i], function() {
                        var e = new enchant.Event('progress');
                        e.loaded = ++loaded;
                        e.total = total;
                        game.dispatchEvent(e);
                        if (loaded === total) {
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
                game._tick();
            }, 1000 / this.fps);
            this.running = true;
        },

        end: function(score, result, img) {
            if (img !== undefined) {
                this.endScene.image = img;
            }
            this.pushScene(this.endScene);
            if (location.hostname === 'r.jsgames.jp') {
                var submit = function() {
                    var id = location.pathname.match(/^\/games\/(\d+)/)[1];
                    location.replace([
                        'http://9leap.net/games/', id, '/result',
                        '?score=', encodeURIComponent(score),
                        '&result=', encodeURIComponent(result)
                    ].join(''));
                };
                this.endScene.addEventListener('touchend', submit);
                window.setTimeout(submit, 3000);
            }
            enchant.Game.instance.end = function() {
            };
        }
    });

    /**
     * @scope enchant.nineleap.SplashScene.prototype
     */
    enchant.nineleap.SplashScene = enchant.Class.create(enchant.Scene, {
        /**
         * @extends enchant.Scene
         * @constructs
         * スプラッシュ画像を表示するシーン。
         */
        initialize: function() {
            enchant.Scene.call(this);
        },

        /**
         * 中央に表示する画像
         * @type {enchant.Surface}
         */
        image: {
            get: function() {
                return this._image;
            },
            set: function(image) {
                this._image = image;

                // discard all child nodes
                while (this.firstChild) {
                    this.removeChild(this.firstChild);
                }

                // generate an Sprite object and put it on center
                var sprite = new Sprite(image.width, image.height);
                sprite.image = image;
                sprite.x = (this.width - image.width) / 2;
                sprite.y = (this.height - image.height) / 2;
                this.addChild(sprite);
            }
        }
    });

})();