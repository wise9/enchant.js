/** twitter.enchant.js v0.2.0 (2011/07/20)
 * 
 * enchant.js extention for 9leap.net
 * @requires enchant.js v0.3.1 or later
 * @requires nineleap.enchant.js v0.2.2 or later
 * 
EXAMPLE: use twitter icon as a sprite

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
                    this.twitterAssets[this._twitterRequests[i].requestType] = new Array();
                }
                for (var i = 0, l = this._twitterRequests.length; i < l; i++) {
                    this._twitterRequests[i]._sendRequest();
                }
            }
            return;
        }
        parentModule.Game.prototype.start.call(this);
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
    }
});

enchant.nineleap.twitter.TwitterRequest = enchant.Class.create({
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
    },
    _callback: function(resBody) {
        enchant.Game.instance._setTwitterAssets(resBody, this.requestType, this.checkError);
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
