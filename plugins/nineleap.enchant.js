/** nineleap.enchant.js v0.2.2 (2011/06/03)
 * 
 * enchant.js extention for 9leap.net
 * @requires enchant.js v0.3.1 or later
 * 
EXAMPLE: use switter icon as a sprite

enchant();
window.onload = function() {
    var game = new Game(320, 320);
    game.twitterRequest('account/verify_credentials');
    game.onload = function() {
        var player = game.twitterAssets['account/verify_credentials'][0].toSprite(48, 48);
        player.x = 0;
        player.y = 0;
        game.rootScene.addChild(player);
    };
    game.start();
}

 */

enchant.nineleap = { assets: ['start.png', 'end.png'] };
enchant.nineleap.Game = enchant.Class.create(enchant.Game, {
    initialize: function(width, height) {
        enchant.Game.call(this, width, height);
        this._twitterRequests = [];
        this._twitterAssets = [];
        this.requireAuth = true;
        this.authorized = true;
        this.twitterQueue = 0;
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

        });
    },
    loadImage: function(src, callback) {
        if (callback == null) callback = function() {};
        this.assets[src] = enchant.Surface.load(src);
        this.assets[src].addEventListener('load', callback);
    },
    start: function() {
        var game = this;
        if (this.twitterQueue != 0) {
            if (this._twitterRequests.length) {
                this.twitterAssets = {};
                for (var i in this._twitterRequests) {
                    this.twitterAssets[this._twitterRequests[i].requestType] = new Array();
                }
                for (var i = 0, l = this._twitterRequests.length; i < l; i++) {
                    this._twitterRequests[i]._sendRequest();
                }
            } else {
            }
            return;
        }
        if (this._intervalID) {
            window.clearInterval(this._intervalID);
        } else if (this._assets.length) {
            var o = {};
            var assets = this._assets.filter(function(asset) {
                return asset in o ? false : o[asset] = true;
            });
            var tAssets = this._twitterAssets;
            var loaded = 0;
            var total = assets.length + tAssets.length;
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
    twitterRequest: function(requestType, option, checkError) {
        if (checkError == undefined) {
            checkError = true;
        }
        if (arguments.length == 2) {
            if (typeof arguments[1] == 'boolean') {
                checkError = arguments[1];
                option = {};
            } else {
                checkError = true;
            }
        }
        this.twitterQueue++;
        var id = this._twitterRequests.length;
        var request = new TwitterRequest(id, requestType, option, checkError);
        this._twitterRequests.push(request);
    },
    _setTwitterAssets: function(resBody, requestType, checkError) {
        var game = enchant.Game.instance;
        if (!(resBody instanceof Array)) {
            resBody = Array.prototype.slice.call(arguments);
            resBody = resBody.filter(function(arg) {
                return arg instanceof Object ? true : false;
            });
        }
        this.twitterQueue--;
        if (resBody[0] == undefined) {
            this.twitterAssets[requestType] = [];
        } else if ('code' in resBody[0]) {
            if (resBody[0].code == 401 && this.requireAuth) {
                window.location.replace('http://9leap.net/api/login?after_login=' + window.location.href);
                return;
            } else if (resBody[0].code == 401 && !this.requireAuth) {
                this.authorized = false;
            } else if (checkError) {
                alert (resBody[0].code + ' error' + '\nリロードしてみてください');
                throw new Error(resBody[0].code + ': ' +resBody[0].error);
                return;
            } else {
                this.twitterAssets[requestType] = [];
            }
        } else {
            for (var i = 0, l = resBody.length; i < l; i++) {
                if ('name' in resBody[i]) {
                    this.twitterAssets[requestType][i] = new TwitterUserData(resBody[i]);
                    this._twitterAssets.push(resBody[i]['profile_image_url']);
                    if ('status' in resBody[i]) {
                        this.twitterAssets[requestType][i].status = new TwitterStatusData(resBody[i].status);
                    }
                } else {
                    this.twitterAssets[requestType][i] = new TwitterStatusData(resBody[i]);
                    this.twitterAssets[requestType][i].user = new TwitterUserData(resBody[i].user);
                    this._twitterAssets.push(resBody[i].user['profile_image_url']);
                }
            }
        }
        if (this.twitterQueue == 0) {
            this.start();
        }
    },
});

enchant.twitter = {};
enchant.twitter.TwitterRequest = enchant.Class.create({
    initialize: function(id, requestType, option, checkError) {
        this.requestType = requestType;
        this.checkError = checkError;
        var callback = '?callback=enchant.Game.instance._twitterRequests[' + id + ']._callback';
        var src = 'http://9leap.net/api/twitter/' + requestType + '.json' + callback;
        if (option) {
            for (var key in option) {
                src += '&' + key + '=' + option[key];
            }
        }
        this.script = document.createElement('script');
        this.script.type = 'text/javascript';
        this.script.src = src;
        this.requestType = requestType;
    },
    _callback: function(resBody) {
        enchant.Game.instance._setTwitterAssets(resBody, this.requestType, this.checkError);
    },
    _sendRequest: function() {
        document.head.appendChild(this.script);
    }
});

enchant.twitter.TwitterUserData = enchant.Class.create({
    initialize: function(obj) {
        for (var prop in obj) {
            this[prop] = obj[prop];
        }
    },
    toSprite: function(width, height) {
        if (arguments.length < 2) {
            var width = 48;
            var height = 48;
        }
        var g = enchant.Game.instance;
        var sp = new Sprite(width, height);
        sp.image = g.assets[this['profile_image_url']];
        return sp;
    }
});

enchant.twitter.TwitterStatusData = enchant.Class.create({
    initialize: function(obj) {
        for (var prop in obj) {
            this[prop] = obj[prop];
        }
    }
});

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
