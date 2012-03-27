/**
 * twitter.enchant.js
 * @version 0.2 (2011/07/20)
 * @requires enchant.js v0.4.0 or later
 * @requires nineleap.enchant.js v0.3 or later
 *
 * @description
 * enchant.js extention for 9leap.net
 *
 * @usage
 * EXAMPLE: use twitter icon as a sprite

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
(function() {

enchant();
/**
 * 依存ライブラリcheck
 */
if (enchant.nineleap.memory != undefined &&
    Object.getPrototypeOf(enchant.nineleap.memory) == Object.prototype) {
    var parentModule = enchant.nineleap.memory;
} else if (enchant.nineleap != undefined &&
    Object.getPrototypeOf(enchant.nineleap) == Object.prototype) {
    var parentModule = enchant.nineleap;
} else {
    throw new Error('Cannot load nineleap.enchant.js.');
}

enchant.nineleap.twitter = {};

/**
 * @scope enchant.nineleap.twitter.Game.prototype
 * enchant.Game or enchant.nineleap.Game クラスを拡張したクラス
 */
enchant.nineleap.twitter.Game = enchant.Class.create(parentModule.Game, {
    initialize: function(width, height) {
        parentModule.Game.call(this, width, height);
        this._twitterRequests = [];
        this._twitterAssets = [];
        this.requireAuth = true;
        this.authorized = true;
        this.twitterQueue = 0;
    },
    start: function() {
        if (this.twitterQueue != 0) {
            if (this._twitterRequests.length) {
                this.twitterAssets = {};
                for (var i in this._twitterRequests) {
                    this.twitterAssets[this._twitterRequests[i].path] = new Array();
                }
                for (var i = 0, l = this._twitterRequests.length; i < l; i++) {
                    this._twitterRequests[i]._sendRequest();
                }
            }
            return;
        }
        parentModule.Game.prototype.start.call(this);
    },
    /**
     * Twitterへのリクエストを送る。
     *
     * @param path {String} Twitter APIのパス
     * @param option {Object} Twitter APIへのリクエスト時に送信するオプション
     * @param checkError {Boolean} エラーで応答がない場合 (optional)
     */
    twitterRequest: function(path, option, checkError) {
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
        var request = new enchant.nineleap.twitter.TwitterRequest(id, path, option, checkError);
        this._twitterRequests.push(request);
    },

    _setTwitterAssets: function(resBody, path, checkError) {
        var game = enchant.Game.instance;
        if (!(resBody instanceof Array)) {
            resBody = Array.prototype.slice.call(arguments);
            resBody = resBody.filter(function(arg) {
                return (arg instanceof Object);
            });
        }
        this.twitterQueue--;
        if (resBody[0] == undefined) {
            this.twitterAssets[path] = [];
        } else if ('code' in resBody[0]) {
            if (resBody[0].code == 401 && this.requireAuth) {
                window.location.replace('http://9leap.net/api/login?after_login=' + window.location.href);
                return ;
            } else if (resBody[0].code == 401 && !this.requireAuth) {
                this.authorized = false;
            } else if (checkError) {
                alert (resBody[0].code + ' Error' + '\n Please try reload');
                throw new Error(resBody[0].code + ': ' +resBody[0].error);
            } else {
                this.twitterAssets[path] = [];
            }
        } else {
            for (var i = 0, l = resBody.length; i < l; i++) {
                if ('name' in resBody[i]) {
                    this.twitterAssets[path][i] = new enchant.nineleap.twitter.TwitterUserData(resBody[i]);
                    this._twitterAssets.push(resBody[i]['profile_image_url']);
                    if ('status' in resBody[i]) {
                        this.twitterAssets[path][i].status = new enchant.nineleap.twitter.TwitterStatusData(resBody[i].status);
                    }
                } else {
                    this.twitterAssets[path][i] = new enchant.nineleap.twitter.TwitterStatusData(resBody[i]);
                    this.twitterAssets[path][i].user = new enchant.nineleap.twitter.TwitterUserData(resBody[i].user);
                    this._twitterAssets.push(resBody[i].user['profile_image_url']);
                }
            }
        }
        if (this.twitterQueue == 0) {
            this.start();
        }
    }
});

enchant.nineleap.twitter.TwitterRequest = enchant.Class.create({
    initialize: function(id, path, option, checkError) {
        this.path = path;
        this.checkError = checkError;
        var callback = '?callback=enchant.Game.instance._twitterRequests[' + id + ']._callback';
        var src = 'http://9leap.net/api/twitter/' + path + '.json' + callback;
        if (option) {
            for (var key in option) {
                src += '&' + key + '=' + option[key];
            }
        }
        this.script = document.createElement('script');
        this.script.type = 'text/javascript';
        this.script.src = src;
    },
    _callback: function(resBody) {
        enchant.Game.instance._setTwitterAssets(resBody, this.path, this.checkError);
    },
    _sendRequest: function() {
        document.head.appendChild(this.script);
    }
});

enchant.nineleap.twitter.TwitterUserData = enchant.Class.create({
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

enchant.nineleap.twitter.TwitterStatusData = enchant.Class.create({
    initialize: function(obj) {
        for (var prop in obj) {
            this[prop] = obj[prop];
        }
    }
});

})();
