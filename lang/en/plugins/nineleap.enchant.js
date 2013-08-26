/**
 * @fileOverview
 * nineleap.enchant.js
 * @version 0.3.4 (2013/04/03)
 * @requires enchant.js v0.6.3 or later
 *
 * @description
 * enchant.js extension for 9leap.net
 * 9leap.net 向けの enchant.js 拡張プラグイン。
 * core.end の引数にスコアと結果の文字列を渡すことで、ランキングに登録できる。
 * (9leapにアップロードした後のみランキング画面にジャンプする)
 *
 * @usage
 * 
 * var core = new Core(320, 320);
 * 
 * core.onload = function(){
 * // executed after player pushed "START"
 * // ...
 * if(some.condition)core.end(score, result);
 * };
 * 
 * core.start();
 */

(function() {

    /**
     * @type {Object}
     */
    enchant.nineleap = { assets: ['start.png', 'end.png'] };

    /**
     * @scope enchant.nineleap.Core.prototype
     */
    enchant.nineleap.Core = enchant.Class.create(enchant.Core, {
        /**
         * start, gameover の画像を表示し、
         * 最後にスコアを送信するように拡張された Core クラス
         * @param width
         * @param height
         * @constructs
         */
        initialize: function(width, height) {
            enchant.Core.call(this, width, height);
            this.addEventListener('load', function() {
                var core = this;
                this.startScene = new enchant.nineleap.SplashScene();
                this.startScene.image = this.assets['start.png'];
                this.startScene.addEventListener('touchend', function() {
                    if (core.started === false) {
                        if (core.onstart != null) {
                            core.onstart();
                        }
                        core.started = true;
                        coreStart = true;   // deprecated
                    }
                    if (core.currentScene === this) {
                        core.popScene();
                    }
                    this.removeEventListener('touchend', arguments.callee);
                });
                this.addEventListener('keydown', function() {
                    if (this.started === false) {
                        if (this.onstart != null) {
                            this.onstart();
                        }
                        this.started = true;
                    }
                    if (core.currentScene === core.startScene) {
                        core.popScene();
                    }
                    this.removeEventListener('keydown', arguments.callee);
                });
                this.pushScene(this.startScene);

                this.endScene = new SplashScene();
                this.endScene.image = this.assets['end.png'];
                this.removeEventListener('load', arguments.callee);
            });
            this.scoreQueue = false;
            this.started = false;
            coreStart = false; // deprecated
        },

        _requestPreload: function() {
            var o = {};
            var loaded = 0,
                len = 0,
                loadFunc = function() {
                    var e = new enchant.Event('progress');
                    e.loaded = ++loaded;
                    e.total = len;
                    enchant.Core.instance.loadingScene.dispatchEvent(e);
                };
            this._assets
                .concat(this._twitterAssets || [])
                .concat(this._netpriceData || [])
                .concat(this._memoryAssets || [])
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
            enchant.Core.instance.end = function() {
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
