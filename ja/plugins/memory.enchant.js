/**
 * memory.enchant.js
 * @version 0.2.2 (2011/07/31)
 * @requires enchant.js v0.3.1 or later
 * @requires nineleap.enchant.js v0.2.2 or later
 * @author Ubiquitous Entertainment Inc.
 *
 * @description
 * enchant.js extention for 9leap.net
 * @usage
 * EXAMPLE: use user memory
 * var game = new Game();
 * game.memory.player.preload();
 * game.onload = function () {
 *    var playerSp = this.memory.player.toSprite();
 *    playerSp.x = this.width / 2 - playerSp.width / 2;
 *    playerSp.y = this.height / 2 - playerSp.height / 2;
 *    this.rootScene.addChild(playerSp);
 * };
 * game.start();
 */

(function() {
enchant();
/**
 * 依存ライブラリcheck
 */
if (enchant.nineleap.twitter != undefined &&
    Object.getPrototypeOf(enchant.nineleap.twitter) == Object.prototype) {
    var parentModule = enchant.nineleap.twitter;
} else if (enchant.nineleap != undefined &&
    Object.getPrototypeOf(enchant.nineleap) == Object.prototype) {
    var parentModule = enchant.nineleap;
} else {
    throw new Error('Cannot load nineleap.enchant.js.');
}

enchant.nineleap.memory = { assets: ['indicator.png'] };

/**
 * ゲームメモリーリクエストが成功した時に発生するイベント.
 * 発行するオブジェクト: enchant.Game, enchant.Scene,
 * @type {String}
 */
enchant.Event.COMPLETE_MEMORY_REQUEST = 'complete_memory_request';


/**
 * ゲームメモリーリクエストのレスポンスがエラーの時に発生するイベント.
 * 発行するオブジェクト: enchant.Game, enchant.Scene,
 * @type {String}
 */
enchant.Event.ERROR_MEMORY_REQUEST = 'error_memory_request';

/**
 * ゲームメモリーのアップデートが完了したときに発生するイベント.
 * 発行するオブジェクト: enchant.Game, enchant.Scene,
 * @type {String}
 */
enchant.Event.COMPLETE_UPDATE = 'complete_update';

/**
 * XHRのreadyStateが4になった時に発生するイベント.
 * 発行するオブジェクト: enchant.Game, enchant.Scene, enchant.nineleap.memory.MemoryWrite,
 * @type {String}
 */
enchant.Event.COMPLETE_XHR_REQUEST = 'complete_xhr_request';

/**
 * XHRのreadyStateが1になった時に発生するイベント.
 * 発行するオブジェクト: enchant.Game, enchant.Scene, enchant.nineleap.memory.MemoryWrite,
 * @type {String}
 */
enchant.Event.LOADING_XHR_REQUEST = 'loading_xhr_request';

/**
 * XHRのreadyStateが2になった時に発生するイベント.
 * 発行するオブジェクト: enchant.Game, enchant.Scene, enchant.nineleap.memory.MemoryWrite,
 * @type {String}
 */
enchant.Event.LOADED_XHR_REQUEST = 'loaded_xhr_request';

/**
 * XHRのreadyDtateが3になった時に発生するイベント.
 * 発行するオブジェクト: enchant.Game, enchant.Scene, enchant.nineleap.memory.MemoryWrite,
 * @type {String}
 */
enchant.Event.INTERACTIVE_XHR_REQUEST = 'interactive_xhr_request';

/**
 * XHRのレスポンスがエラーの時に発生するイベント.
 * 発行するオブジェクト: enchant.Game, enchant.Scene, enchant.nineleap.memory.MemoryWrite,
 * @type {String}
 */
enchant.Event.ERROR_XHR_REQUEST = 'error_xhr_request';

/**
 * @scope enchant.nineleap.memory.Game.prototype
 */
enchant.nineleap.memory.Game = enchant.Class.create(parentModule.Game, {

    initialize: function(width, height) {
        parentModule.Game.call(this, width, height);
        this._memoryRequests = [];
        this.requireAuth = true;
        this.authorized = true;
        this.memoryQueue = 0;
        this.ajaxQueue = 0;
        this._ajaxRequests = [];
        this._memoryAssets = [];
        this._memory = {
            user: {
                preload: enchant.nineleap.memory.Game.prototype.user_preload
            },
            player: {
                preload: enchant.nineleap.memory.Game.prototype.player_preload
            },
            update: enchant.nineleap.memory.Game.prototype.memory_update
        };
        this._memories = {
            friends: {
                preload: enchant.nineleap.memory.Game.prototype.friends_preload
            },
            ranking: {
                preload: enchant.nineleap.memory.Game.prototype.ranking_preload
            },
            recent: {
                preload: enchant.nineleap.memory.Game.prototype.recent_preload
            }
        };
        this.addEventListener('load', function() {
            this.ajaxloading = new SplashScene();
            this.ajaxloading.image = this.assets['indicator.png'];
            var game = this;
            this.ajaxloading.childNodes[0].addEventListener('enterframe', function() {
                if (game.frame%5 == 0) this.rotate(16);
            });
        });
        this.addEventListener('enterframe', function() {
            if (this.ajaxQueue + this.memoryQueue && this.running) {
                if (this.currentScene != this.ajaxloading) this.pushScene(this.ajaxloading);
            } else {
                if (this.currentScene == this.ajaxloading) this.popScene();
            }
        });
    },

    start: function() {
        if (this.memoryQueue != 0) {
            if (this._memoryRequests.length) {
                for (var i = 0, l = this._memoryRequests.length; i < l; i++) {
                    this._memoryRequests[i]._sendRequest();
                }
            }
            return;
        }
        parentModule.Game.prototype.start.call(this);
    },

    memory: {
        get: function() {
            return this._memory;
        },
        set: function(data) {
            return this._memory = data;
        }
    },

    memories: {
        get: function () {
            return this._memories;
        },
        set: function (data) {
            return this._memories = data;
        }
    },

    preloadMemory: function (requestType, option, checkError) {
        if (arguments.length == 2) {
            if (typeof arguments[1] == 'boolean') {
                checkError = arguments[1];
                option = {};
            } else {
                checkError = true;
            }
        } else if (arguments.length == 1){
            option = {};
            checkError = true;
        }
        this.memoryQueue++;
        if(LocalStorage.DEBUG_MODE) {
            var setmemory = (requestType.match(/user_memory/)) ? this.memory.player :
                            (requestType.match(/u\/[0-9a-zA-Z_+]/)) ? this.memory.user[requestType.replace(/u\//, '')] :
                            (requestType.match(/friends_memories/)) ? this.memories.friends :
                            (requestType.match(/recent_memories/)) ? this.memories.recent :
                            (requestType.match(/ranking_memories/)) ? this.memories.ranking : null;
            var localstorage = new LocalStorage(LocalStorage.GAME_ID);
            var resBody = (requestType == 'user_memory') ? localstorage.get_user_memory('mine') :
                          (requestType.match(/(friends|recent|ranking)_memories/)) ?
                          localstorage.all_user_memories : (requestType.match(/$u\/.+/)) ?
                          localstorage.get_user_memory(requestType.replace(/u\//,"")) : null;
            this.memoryQueue--;
            if (resBody == null) {
                setmemory.data = null;
                if (requestType == 'user_memory') setmemory.user = 'mine';
            } else {
                if (resBody instanceof Array) {
                    for (var i = 0, l = resBody.length; i < l; i++) {
                        if (resBody[i] instanceof Object) {
                            setmemory[i] = {};
                            this._pushData(resBody[i], setmemory[i]);
                        } else setmemory[i] = resBody[i];
                    }
                    setmemory.length = l;
                } else if (resBody instanceof Object)
                    this._pushData(resBody, setmemory);
                else setmemory.data = resBody;
                var e = new Event('complete_memory_request');
                enchant.Game.instance.dispatchEvent(e);
                enchant.Game.instance.currentScene.dispatchEvent(e);
            }
        } else {
            var id = this._memoryRequests.length;
            var request = new MemoryRequest(id, requestType, option, checkError);
            this._memoryRequests.push(request);
            return id;
        }
    },

    _resend_request: function (requestType, option, checkError) {
        var id = this.preloadMemory(requestType, option, checkError);
        if(!LocalStorage.DEBUG_MODE) this._memoryRequests[id]._sendRequest();
    },

    check_ajax_running: function (requestType) {
        if(LocalStorage.DEBUG_MODE) return false;
        for (var i = 0, l = this._ajaxRequests.length; i < l; i++) {
            if (this._ajaxRequests[i].requestType == requestType && this._ajaxRequests[i].running)
                return true;
        }
        return false;
    },

    _setMemoryAssets: function(resBody, requestType, checkError){
        var game = enchant.Game.instance;
        this.memoryQueue--;
        if (requestType.match(/u\/[0-9a-zA-Z_+]/)) {
            this.memory.user[requestType.replace(/u\//, '')] = {};
            var setmemory = this.memory.user[requestType.replace(/u\//, '')];
        } else {
          var setmemory = (requestType.match(/user_memory/)) ? this.memory.player :
                          (requestType.match(/friends_memories/)) ? this.memories.friends :
                          (requestType.match(/recent_memories/)) ? this.memories.recent :
                          (requestType.match(/ranking_memories/)) ? this.memories.ranking : null;
        }
        if(setmemory == null) return;
        if (resBody == undefined) {
        } else if ('code' in resBody) {
            if (resBody.code == 401 && this.requireAuth) {
                window.location.replace(HttpRequest.SERVER_URL + 'login?after_login=' + window.location.href);
                return;
            } else if (resBody.code == 401 && !this.requireAuth) {
                this.authorized = false;
            } else if (resBody.code != 404 && checkError) {
                alert (resBody.code + ' error' + '\nリロードしてみてください');
                throw new Error(resBody.code + ': ' +resBody.error);
                return;
            } else if (resBody.code == 403 && checkError) {
                alert (resBody.code + ' error' + '\nAPIリクエスト制限オーバーです' + '\n' + requestType);
                throw new Error(resBody.code + ': ' + resBody.error);
            } else {
                if (requestType == "user_memory") {
                    setmemory.data = {};
                    setmemory.user = resBody.user;
                } else {
                    setmemory.data = {};
                }
            }
            var e = new Event('error_memory_request');
            this.dispatchEvent(e);
            this.currentScene.dispatchEvent(e);
        } else {
            if (resBody instanceof Array) {
                for (var i = 0, l = resBody.length; i < l; i++) {
                    setmemory[i] = {};
                    if (resBody[i] instanceof Object)
                        this._pushData(resBody[i], setmemory[i]);
                    else setmemory[i] = resBody[i];
                }
                setmemory.length = l;
            } else if (resBody instanceof Object)
                this._pushData(resBody, setmemory);
            else setmemory.data = resBody;
            var e = new Event('complete_memory_request');
            this.dispatchEvent(e);
            this.currentScene.dispatchEvent(e);
        }
        if (this.memoryQueue == 0 && !this.running) {
            this.start();
        }
    },
    _pushData: function(data, obj) {
        for (var prop in data) {
            obj[prop] = data[prop];
        }
        if (!LocalStorage.DEBUG_MODE && obj['profile_image_url'] != undefined) {
            obj['toSprite'] = function (width, height) {
                if (arguments.length < 2) {
                    var width = 48;
                    var height = 48;
                }
                var g = enchant.Game.instance;
                var sp = new Sprite(width, height);
                sp.image = g.assets[obj['profile_image_url']];
                return sp;
            };
            if(enchant.Game.instance.assets[obj['profile_image_url']] == undefined)
                this._memoryAssets.push(obj['profile_image_url']);
        }
    },
    user_preload: function (user, option, checkError) {
        if(user === undefined) return false;
        var requestType = 'u/' + user;
        return enchant.Game.instance.preloadMemory(requestType, option, checkError);
    },
    player_preload: function (option, checkError) {
        var requestType = 'user_memory';
        return enchant.Game.instance.preloadMemory(requestType, option, checkError);
    },
    friends_preload: function (option, checkError) {
        var requestType = 'friends_memories';
        return enchant.Game.instance.preloadMemory(requestType, option, checkError);
    },
    recent_preload: function (option, checkError) {
        var requestType = 'recent_memories';
        return enchant.Game.instance.preloadMemory(requestType, option, checkError);
    },
    ranking_preload: function (option, checkError) {
        var requestType = 'ranking_memories';
        return enchant.Game.instance.preloadMemory(requestType, option, checkError);
    },
    memory_update: function (option, checkError) {
        var requestType = 'user_memory';
        var game = enchant.Game.instance;
        if ( game.memory.player.data === undefined ||
             game.check_ajax_running(requestType) ) return false;
        if (arguments.length == 1) {
            if (typeof arguments[0] == 'boolean') {
                checkError = arguments[0];
                option = {};
            } else {
                checkError = true;
            }
        } else if (arguments.length == 0) {
            checkError = true;
            option = {};
        }
        if(LocalStorage.DEBUG_MODE) {
            game.ajaxQueue++;
            var localstorage = new LocalStorage(LocalStorage.GAME_ID);
            localstorage.set_user_memory('mine', game.memory.player.data);
            game.ajaxQueue--;
            var e = new Event('complete_update');
            setTimeout(function() {
                game.dispatchEvent(e);
                game.currentScene.dispatchEvent(e);
            }, 100);
        } else {
            var id = game._ajaxRequests.length;
            var data = game.memory.player.data;
            var request = new MemoryWrite(id, requestType, function () {
                var e = new Event('complete_update');
                enchant.Game.instance.dispatchEvent(e);
                enchant.Game.instance.currentScene.dispatchEvent(e);
            },checkError, data);
            game._ajaxRequests.push(request);
            if (game.ajaxQueue + game.memoryQueue < HttpRequest.MAX_REQUEST_SIZE) {
                request.send();
            } else {
                game.addEventListener('complete_xhr_request', function () {
                    if (game.ajaxQueue + game.memoryQueue < HttpRequest.MAX_REQUEST_SIZE) {
                        game.removeEventListener('compleate_xhr_request', arguments.callee);
                        game._ajaxRequests[id].send();
                    }
                });
            }
            return request;
        }
    },
});


/**
 * @scope enchant.nineleap.memory.HttpRequest.prototype
 */
enchant.nineleap.memory.HttpRequest = enchant.Class.create(enchant.EventTarget, {
    initialize: function () {
        if(LocalStorage.DEBUG) return;
        enchant.EventTarget.call(this);
        this.gameid = enchant.nineleap.memory.LocalStorage.GAME_ID != null ?
            enchant.nineleap.memory.LocalStorage.GAME_ID :
            location.pathname.match(/^\/games\/(\d+)/)[1];
        this._running = false;
        if(window.XMLHttpRequest) {
            this.httpRequest = new XMLHttpRequest();
        } else if(window.XDomainRequest) { // truly useless XD
            var xhr = function(){
                this.readyState = 0; // uninitialized
                this.responseText = "";
                this.status = "";
                this.onreadstatechange = undefined;
                var xdr = new XDomainRequest();

                xdr.onprogress = function(){
                    var f;
                    this.xhr.readyState = 2; // loaded
                    if( this.xhr && ( f = this.xhr.onreadystatechange ) ){
                        f.apply( this.xhr );
                    }
                };

                xdr.onload = function(){
                    var f;
                    this.xhr.readyState = 3;    // interactive
                    if( this.xhr && ( f = this.xhr.onreadystatechange ) ){
                        f.apply( this.xhr );
                    }
                    this.xhr.responseText = xdr.responseText;
                    this.xhr.readyState = 4;    // complete
                    this.xhr.status = "200";
                    if( f ){
                        f.apply( this.xhr );
                    }
                };

                xdr.onerror = function(){
                    var f;
                    this.xhr.responseText = xdr.responseText;
                    this.xhr.readyState = 4;
                    this.xhr.status = "201";
                    if( this.xhr && ( f = this.xhr.onreadystatechange ) ){
                        f.apply( this.xhr );
                    }
                }

                this.open = function( method, url, async ){
                    return xdr.open( method, url, async );
                    readyState = 1; // loading
                }
                this.send = function( body ){
                    xdr.send( body );
                };
                this.setRequestHeader = function( headerName, headerValue ){
                };
                this.getResponseHeader = function( headerName ){
                    if( headerName.match( /^Content\-Type$/i ) ){
                        return xdr.contentType;
                    }else{
                        return "";
                    }
                };
                xdr.xhr = this;
                return this;
            };
            this.httpRequest = new xhr();
        } else throw new Error('Cannot create XMLHttpRequest object.');
    },
    running: {
        get: function () {
            return this._running;
        }
    },
    requestType: {
        get: function () {
            return this._requestType;
        }
    }
});

enchant.nineleap.memory.HttpRequest.SERVER_URL = 'http://9leap.net/api/';
enchant.nineleap.memory.HttpRequest.MAX_REQUEST_SIZE = 3;

/**
 * @scope enchant.nineleap.memory.MemoryRequest.prototype
 */
enchant.nineleap.memory.MemoryRequest = enchant.Class.create({
    initialize: function(id, requestType, option, checkError) {
        if(LocalStorage.DEBUG) return;
        this.id = id;
        this.checkError = checkError;
        this.requestType = requestType;
        var gameid = enchant.nineleap.memory.LocalStorage.GAME_ID != null ?
            enchant.nineleap.memory.LocalStorage.GAME_ID :
            location.pathname.match(/^\/games\/(\d+)/)[1];
        var jsonpcallback = '?callback=enchant.Game.instance._memoryRequests[' + id + ']._callback';
        var src = [HttpRequest.SERVER_URL, 'memory/', gameid, '/', requestType, '.json', jsonpcallback].join('');
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
        enchant.Game.instance._setMemoryAssets(resBody, this.requestType, this.checkError);
    },
    _sendRequest: function() {
        document.head.appendChild(this.script);
    }
});

/**
 * @scope enchant.nineleap.memory.MemoryWrite.prototype
 */
enchant.nineleap.memory.MemoryWrite = enchant.Class.create(enchant.nineleap.memory.HttpRequest, {
    initialize: function(id, requestType, callback, checkError, data) {
        if(LocalStorage.DEBUG) return;
        enchant.nineleap.memory.HttpRequest.call(this);
        this.id = id;
        this.callback = callback;
        this.checkError = checkError;
        this._requestType = requestType;
        this._src = [HttpRequest.SERVER_URL, 'memory/', this.gameid, '/', requestType, '.json'].join('');
        this._jsonstring = 'json=' + JSON.stringify(data);
    },
    send: function () {
        enchant.Game.instance.ajaxQueue++;
        this._running = true;
        this.httpRequest.open('POST', this._src, true);
        this.httpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;charset=UTF-8');
        this.httpRequest.withCredentials = true;
        var req = this;
        this.httpRequest.onreadystatechange = function(e) {
            switch (req.httpRequest.readyState) {
                case 1:
                    var e = new enchant.Event('loading_xhr_request');
                    req.dispatchEvent(e);
                    enchant.Game.instance.dispatchEvent(e);
                    enchant.Game.instance.currentScene.dispatchEvent(e);
                    break;
                case 2:
                    var e = new enchant.Event('loaded_xhr_request');
                    req.dispatchEvent(e);
                    enchant.Game.instance.dispatchEvent(e);
                    enchant.Game.instance.currentScene.dispatchEvent(e);
                    break;
                case 3:
                    var e = new enchant.Event('interactive_xhr_request');
                    req.dispatchEvent(e);
                    enchant.Game.instance.dispatchEvent(e);
                    enchant.Game.instance.currentScene.dispatchEvent(e);
                    break;
                case 4:
                    enchant.Game.instance.ajaxQueue--;
                    req._running = false;
                    var status = req.httpRequest.status;
                    if (status != 201) {
                        if (status == 413) {
                            if (req.checkError) {
                                alert('Too large memory data.');
                                throw new Error('Too large memory data.');
                            }
                        } else if (status == 401) {
                            if (enchant.Game.instance.requireAuth)
                                window.location.replace(HttpRequest.SERVER_URL + 'login?after_login=' + window.location.href);
                            else enchant.Game.instance.authorized = false;
                        } else if (status == 403) {
                            if (req.checkError) {
                                console.log(req.httpRequest.responseText);
                                alert('APIアクセス制限です。');
                                throw new Error('Over memory api access limit');
                            }
                        } else {
                            if (req.checkError) {
                                console.log(req.httpRequest.responseText);
                                alert(['status code:', status, ', response:', req.httpRequest.responseText].join(''));
                                throw new Error('Cannot write memory data: ' + req._src);
                            }
                        }
                        var e = new enchant.Event('error_xhr_request');
                        req.dispatchEvent(e);
                        enchant.Game.instance.dispatchEvent(e);
                        enchant.Game.instance.currentScene.dispatchEvent(e);
                    } else {
                        (typeof req.callback == 'function') ? req.callback() : Function('x', 'return ' + req.callback);
                        var e = new enchant.Event('complete_xhr_request');
                        req.dispatchEvent(e);
                        enchant.Game.instance.dispatchEvent(e);
                        enchant.Game.instance.currentScene.dispatchEvent(e);
                    }
                    break;
            }
        };
        this.httpRequest.send(this._jsonstring);
    }
});

/**
 * @scope enchant.nineleap.memory.LocalStorage.prototype
 */
enchant.nineleap.memory.LocalStorage = enchant.Class.create({
    initialize: function (requestType, callback) {
        var game_id = (LocalStorage.GAME_ID == null) ? 0 : LocalStorage.GAME_ID;
        this._user_memory_key = "game_" + game_id + "_user_";
    },
    get_user_memory: function (key) {
        var ret = JSON.parse(localStorage.getItem(this._user_memory_key + key));
        if (ret == null) return {'data':{}};
        ret.toSprite = function (width, height) {
            if (arguments.length < 2) {
                var width = 48;
                var height = 48;
            }
            var g = enchant.Game.instance;
            var sp = new Sprite(width, height);
            sp.backgroundColor = ret['profile_image_url'];
            return sp;
        }  
        return ret;
    },
    set_user_memory: function (key, obj) {
        if(localStorage.getItem(this._user_memory_key + key) != null)
            var color = localStorage.getItem(this._user_memory_key + key).profile_image_url;
        else var color = null;
        if (color == null) {
            var color_list = ['blue', 'red', 'yellow', 'green', 'orange'];
            color = color_list[Math.floor( Math.random() * 5 )];
        }
        return localStorage.setItem(this._user_memory_key + key,
            JSON.stringify({'user': key, 'data': obj, 'updated_at': parseInt((new Date)/1000), 'profile_image_url':color}));
    },
    all_user_memories: {
        get: function() {
            var re = new RegExp(this._user_memory_key);
            var list = new Array();
            try{
                for (var i = 0, l = localStorage.length; i<l; i++){
                    var k = localStorage.key(i);
                    if(k.match(re)) list.push(this.get_user_memory(k.replace(re,"")));
                }
            }catch(e){
                for (var k in localStorage){
                    if(k === 'key') continue;
                    if(k.match(re)) list.push(this.get_user_memory(k.replace(re,"")));
                }
            }
            return list;
        }
    },
    reset: function() {
        localStorage.clear();
    }
});

/**
 * Debug mode setting
 * change true to alter using html5 localStorage api for game memory.
 */
enchant.nineleap.memory.LocalStorage.DEBUG_MODE = false;
/** 
 * To debug, setting game ID
 * Don't change this if you don't upload game to 9leap.net yet.
 */
enchant.nineleap.memory.LocalStorage.GAME_ID = null;

})();
