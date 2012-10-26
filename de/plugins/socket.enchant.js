/**
 * @fileOverview
 * socket.enchant.js
 * @version beta (2011/12/03)
 * @require enchant.js v0.4.1+
 * @author Ubiquitous Entertainment Inc.
 *
 * @description
 * enchant.js extension for online game
 *
 * @usage
 * see http://wise9.jp/archives/5659
 */

(function() {
    enchant.socket = {};
    enchant.socket.Socket = enchant.Class.create({
        initialize: function(gameID, twitterID) {
            // timeout(ms)
            this.timeout = 10000;

            if (gameID === undefined) {
                if (location.hostname === 'r.jsgames.jp') {
                    gameID = location.pathname.match(/^\/games\/(\d+)/)[1];
                } else {
                    alert('gameID required. (it will be autodetected if you upload it to 9leap.net)');
                }
            }
            this.gameID = gameID;
            // デバッグ用引数があるかどうか
            if (twitterID !== undefined) {
                this.twitterID = twitterID;
            }

            /*
             * 変数初期化
             */
            var socket = this;
            this.matching = false; // マッチ中かどうか
            this.timer = undefined; // timeout用タイマー


            /*
             * 通信系定義
             * １番アウトプットに近いレイヤーです
             * XHRとPusherを隠蔽します
             * @type {connection}
             */
            var connection = function(pusherKey, url) {
                var pusher = new Pusher(pusherKey);

                var channelList = {};
                var callbackList = {};

                // JSONP用CallBack
                window._onlineCallback = function(callbackPath) {
                    return function(data) {
                        if (typeof data === 'string') data = JSON.parse(data);
                        callbackList[callbackPath](data);
                    };
                };

                return {
                    // JSONPでAPIアクセス
                    send: function(roomType, apiName, option, func) {
                        callbackList[roomType + '-' + apiName] = func;
                        var jsonpCallback = '?callback=_onlineCallback("' + roomType + '-' + apiName + '")';
                        console.log(socket.gameID);
                        var src = [url, 'api/online/', socket.gameID, '/', roomType, '/', apiName, '.json', jsonpCallback, '&twitterID=' + socket.twitterID].join('');

                        if (option)
                            for (var key in option) src += '&' + key + '=' + option[key];

                        var script = document.createElement('script');
                        script.type = 'text/javascript';
                        script.src = src;
                        document.head.appendChild(script);
                    },
                    // WebSocketから受信する
                    receiveBinder: function(roomType, channelID) {
                        var pusherChannelID = socket.gameID + '-' + roomType + '-' + channelID;
                        channelList[pusherChannelID] = pusher.subscribe(pusherChannelID);
                        return function(channel) {
                            return function(eventName, func) {
                                channel.bind(eventName, function(data) {
                                    if (typeof data === 'string') data = JSON.parse(data);
                                    func(data.data);
                                });
                            };
                        }(channelList[pusherChannelID]);
                    },
                    releaseBinder: function(roomType, channelID) {
                        var pusherChannelID = socket.gameID + '-' + roomType + '-' + channelID;
                        channelList[pusherChannelID] = pusher.unsubscribe(pusherChannelID);
                    }
                };
            }('551141852cce2fe668d5', 'http://9leap.net/');


            /*
             * Online APIのラッパー
             * サーバーで実装しているAPIを関数化しています
             * また、Pusherのbinderをpatt throughしています
             */
            var apiClosure = function(connection) {
                return function(roomType) {
                    var send = function(apiName, option, callback) {
                        connection.send(roomType, apiName, option, callback);
                    };

                    var retObject = {
                        join: function(channelID, callback) {
                            if (channelID === undefined) channelID = -1;

                            if (channelID === -1)
                                send('join', {}, callback);
                            else
                                send('join', {channelID: channelID}, callback);
                        },
                        list: function(callback) {
                            send('list', {}, callback);
                        },
                        broadcast: function(data, channelID, callback) {
                            send('broadcast', {data: JSON.stringify(data), channelID: channelID}, callback);
                        },
                        quit: function(channelID, callback) {
                            send('quit', {channelID: channelID}, callback);
                            connection.releaseBinder(roomType, channelID);
                        },
                        pong: function(channelID, callback) {
                            send('pong', {channelID: channelID}, callback);
                        },
                        binder: function(channelID) {
                            return connection.receiveBinder(roomType, channelID);
                        }
                    };
                    return retObject;
                };
            }(connection);

            /*
             * room処理のベースになるオブジェクト
             * broadcastパケットに意味付け（送り元、宛先の付与）等を行っています。
             * また、Pusherへの接続なども隠蔽しています。
             */
            var roomClosure = function(apiClosure) {
                return function(roomType) {
                    var api = apiClosure(roomType);
                    var channelID = -1;
                    var bind = {};

                    var toPrev = '';

                    var retObject = {
                        // public
                        api: api,
                        setToPrev: function(_toPrev) {
                            toPrev = _toPrev;
                        },
                        onreceive: function(data) {

                        },
                        onjoin: function() {

                        },
                        onresult: function() {

                        },
                        onquit: function() {

                        },
                        /*
                         * 一般的なjoin実装
                         * channelIDが指定されれば送り、指定されなければ送らない
                         * また、pusherへのbroadcastAPIからのbindingもここで処理しています。
                         * channelIDが指定されれば送り、指定されなければ送らない
                         */
                        join: function(_channelID) {
                            var joinCallback = function(data) {
                                if (data.code === 200) {
                                    socket.twitterID = data.twitterID;
                                    channelID = data.channelID;
                                    bind = api.binder(channelID);
                                    bind('MSG', function(data) {
                                        if (data.playerID !== socket.twitterID)
                                            return;
                                        retObject.onreceive(data);
                                    });
                                    bind('PING', function(data) {
                                        api.pong(channelID, function() {
                                        });
                                    });

                                    retObject.onjoin(data);
                                } else {
                                    console.log('error: cannot connect');
                                }
                            };

                            if (_channelID === undefined) {
                                api.join(-1, joinCallback);
                            } else {
                                api.join(_channelID, joinCallback);
                            }
                        },
                        // broadcastパケットに送信元、送信先を付与します。
                        broadcast: function(data, to) {
                            var broadcastCallback = function(data) {
                                retObject.onresult(data);
                            };

                            if (to === undefined)
                                if (toPrev === '') {
                                    console.log('error');
                                    return;
                                } else {
                                    data.playerID = toPrev;
                                }
                            else
                                data.playerID = to;

                            toPrev = data.playerID;

                            data.myPlayerID = socket.twitterID;
                            api.broadcast(data, channelID, broadcastCallback);
                        },
                        quit: function() {
                            api.quit(channelID, retObject.onquit);
                        }
                    };
                    return retObject;
                };
            }(apiClosure);


            /*
             * lobbyの実体
             * 1:1 でのランダムマッチの実装を行っている部分
             * onjoin等イベントリスナーになっている箇所を書き換えるとlobbyから勝手にgameRoomへ入る処理が崩れるのでご注意を
             */
            var lobby = roomClosure('lobby');

            /*
             * 自分が入室したときに呼ばれる
             * マッチングできる人がいればランダムマッチング
             * いなければ、JOINイベント待機
             */
            lobby.onjoin = function(data) {
                // 対戦可能プレーヤの確認
                if (data['playerList'].length !== 0) {
                    setTimeout(function() {
                        socket.matching = true;
                        lobby.broadcast({op: 'apply'}, data['playerList'][Math.floor(Math.random() * data['playerList'].length)]);
                        socket.timer = setTimeout(function() {
                            socket.matching = false;
                        }, socket.timeout);
                    }, 1000);
                }
            };

            /*
             * メッセージを受信したときに呼ばれる
             * マッチング確認
             * 自分宛でなければ無視
             */
            lobby.onreceive = function(data) {
                if (data.playerID !== socket.twitterID)
                    return;

                if (data.op === 'apply' && socket.matching === false) {
                    socket.matching = true;
                    setTimeout(function() {
                        lobby.broadcast({op: 'accept'}, data.myPlayerID);
                        socket.timer = setTimeout(function() {
                            socket.matching = false;
                        }, socket.timeout);
                    }, 1000);
                } else if (data.op === 'accept' && socket.matching === true) {
                    clearTimeout(socket.timer);
                    gameRoom.onjoin = function(joinData) {
                        lobby.broadcast({op: 'goGameRoom', channelID: joinData.channelID});
                        lobby.quit();
                        socket.matching = false;
                        gameRoom.member[0] = [data.myPlayerID];
                    };
                    gameRoom.join();
                } else if (data.op === 'goGameRoom' && socket.matching === true) {
                    console.log(data);
                    clearTimeout(socket.timer);
                    lobby.quit();
                    socket.matching = false;
                    gameRoom.member[0] = [data.myPlayerID];
                    gameRoom.onjoin = function() {
                        gameRoom.broadcast({op: 'ready', isLead: false}, data.myPlayerID);
                        gameReceiveList['ready']({op: 'ready', isLead: true});
                    };
                    gameRoom.join(data.channelID);
                } else {
                    console.log('error : ' + data.op);
                    console.log(socket.matching);
                }
            };

            /*
             * デフォルトの動作ではなく、channelIDが指定されなかったらすでにchannelが存在しているかどうか確認して、あれば入るような実装。
             */
            lobby.join = function(join) {
                return function(channelID) {
                    if (channelID === undefined) {
                        // 既存のチャネルの確認、あればつなぐ。なければ新規取得
                        lobby.api.list(function(data) {
                            if (data['code'] == 403) {
                                window.location.replace('http://9leap.net/api/login?after_login=' + window.location.href);
                                return;
                            }
                            if (data['channelList'].length === 0)
                                join();
                            else
                                join(data['channelList'][0]);
                        });
                    } else {
                        join(channelID);
                    }
                };
            }(lobby.join);
            this.lobby = lobby;


            /*
             * gameRoomオブジェクト定義
             * ユーザーによるイベント管理をbroadcast上のパケットに構築
             * そのイベント管理方法等を付与した
             */
            var gameRoom = roomClosure('gameRoom');
            var gameReceiveList = {};
            gameReceiveList['ready'] = gameRoom.onready;
            gameRoom.onready = function() {
            };
            gameRoom.member = [];
            gameRoom.onreceive = function(data) {
                var op = data.op;
                //delete data.op;
                if (op === 'ready') {
                    gameRoom.setToPrev(data.myPlayerID);
                }
                gameReceiveList[op](data);
            };
            gameRoom.push = function(eventName, data) {
                data.op = eventName;
                gameRoom.broadcast(data);
            };
            gameRoom.addEventListener = function(eventName, func) {
                gameReceiveList[eventName] = func;
            };
            this.gameRoom = gameRoom;
        }
    });

})();