/** nineleap.enchant.js v0.2.5 (2011/07/25)
 * 
 * enchant.js extention for 9leap.net
 * @requires enchant.js v0.3.1 or later
 */

(function () {

enchant.nineleap = { assets: ['start.png', 'end.png'] };

/**
 * @scope enchant.nineleap.Game.prototype
 */
enchant.nineleap.Game = enchant.Class.create(enchant.Game, {

    initialize: function(width, height) {
        enchant.Game.call(this, width, height);
        this.addEventListener('load', function() {
            var game = this;
            this.startScene = new SplashScene();
            this.startScene.image = this.assets['start.png'];
            this.startScene.addEventListener('touchend', function() {
                if (game.currentScene == this) game.popScene();
                gameStart=true;
            });
            this.addEventListener('keydown', function() {
                if (this.currentScene == this.startScene) this.popScene();
                this.removeEventListener('keydown', arguments.callee);
                gameStart=true;
            });
            this.pushScene(this.startScene);

            this.endScene = new SplashScene();
            this.endScene.image = this.assets['end.png'];
            this.scoreQueue = false;
        });
    },

    loadImage: function(src, callback) {
        if (callback == null) callback = function() {};
        this.assets[src] = enchant.Surface.load(src);
        this.assets[src].addEventListener('load', callback);
    },

    start: function() {
        var game = this;

        if (this._intervalID) {
            window.clearInterval(this._intervalID);
        } else if (this._assets.length) {
            var o = {};
            var assets = this._assets.filter(function(asset) {
                return asset in o ? false : o[asset] = true;
            });
            var tAssets = (this._twitterAssets != undefined)? this._twitterAssets : [];
            var mAssets = (this._memoryAssets != undefined) ? this._memoryAssets : [];
            var loaded = 0;
            var total = assets.length + tAssets.length + mAssets.length;
            for (var i = 0, len = assets.length; i < len; i++) {
                this.load(assets[i], function() {
                    var e = new enchant.Event('progress');
                    e.loaded = ++loaded;
                    e.total = total;
                    game.dispatchEvent(e);
                    if (loaded == total) {
                        game.removeScene(game.loadingScene);
                        game.dispatchEvent(new enchant.Event('load'));
                    }
                });
            }
            for (var i = 0, len = tAssets.length; i < len; i++) {
                this.loadImage(tAssets[i], function() {
                    var e = new enchant.Event('progress');
                    e.loaded = ++loaded;
                    e.total = total;
                    game.dispatchEvent(e);
                    if (loaded == total) {
                        game.removeScene(game.loadingScene);
                        game.dispatchEvent(new enchant.Event('load'));
                    }
                });
            }
            for (var i = 0, len = mAssets.length; i < len; i++) {
                this.loadImage(mAssets[i], function() {
                    var e = new enchant.Event('progress');
                    e.loaded = ++loaded;
                    e.total = total;
                    game.dispatchEvent(e);
                    if (loaded == total) {
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

    end: function(score, result) {
        this.pushScene(this.endScene);
        if (location.hostname == 'r.jsgames.jp') {
            var submit = function() {
                var id = location.pathname.match(/^\/games\/(\d+)/)[1]; 
                location.replace([
                    'http://9leap.net/games/', id, '/result',
                    '?score=', encodeURIComponent(score),
                    '&result=', encodeURIComponent(result)
                ].join(''));
            }
            this.endScene.addEventListener('touchend', submit);
            window.setTimeout(submit, 3000);
        }
    },

});

/**
 * @scope enchant.nineleap.SplashScene.prototype
 */
enchant.nineleap.SplashScene = enchant.Class.create(enchant.Scene, {
    image: {
        get: function() {
            return this._image;
        },
        set: function(image) {
            this._image = image;

            while (this.firstChild) {
                this.removeChild(this.firstChild);
            }
            var sprite = new Sprite(image.width, image.height);
            sprite.image = image;
            sprite.x = (this.width - image.width) / 2;
            sprite.y = (this.height - image.height) / 2;
            this.addChild(sprite);
        }
    }
});

})();
