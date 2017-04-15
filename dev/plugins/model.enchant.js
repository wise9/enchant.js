/**
 * @fileOverview
 * observer.sprite.enchant.js v2 (2013/09/30)
 * 
 * enchant では Sprite Class をモデルとする、
 * つまり Sprite Class に HP などの状態を持たせる書き方が多い。
 * その際に Sprite 同士の連携を直接とる場合が出てくる。
 * 例えば、プレイヤー (Sprite) の HP が減った時に 
 * HP を表現するバー (Sprite) を減少させる場合などが想定される。
 * その時、実装手法は プレイヤーの HP が減少したというイベントに対し、
 * イベントリスナを加えるとよいと思われる。
 * 
 * 本プラグインでは Sprite をモデルと捉え、モデルのデータを監視し、
 * データ変更が確認された場合、他の Sprite 等に通知する Observer Pattern
 * を適用したSpriteの拡張クラスを提供する。
 *
 * @require enchant.js v0.8.0 or later
 * @author Taketo Yoshida.
 *
 * @features
 * [lang:ja]
 * Sprite Class にモデルの機能を持たせたクラス
 * そのモデルのフィールドにオブザーバーを追加することができる
 * [/lang]
 * [lang:en]
 * Sprite Class with Model
 * It is possible to add a field to the observer of the sprite
 * [/lang]
 *
 * @usage
 *
 * sp = new SpriteModel(16, 16);
 * sp.backgroundColor = "red";
 * sp.x = 32;
 * sp.y = 32;
 *
 * sp.setup("key", "test");
 * sp.on("key", function(data){ console.log("fire1:" + data) });
 * sp.on("key", function(data){ console.log("fire2:" + data) });
 * sp.set("key", 16);
 * # fire1:16
 * # fire1:16
 * console.log(sp.key)
 * # 16
 * sp.key = "test";
 * # fire1:test
 * # fire1:test
 * console.log(sp.get("key"))
 * # test
 * game.rootScene.addChild(sp);
 *
 */
(function() {

    enchant.model = {};

    /**
     * 監視対象のオブジェクト
     */
    var Observable = enchant.Class.create({

        /**
         * @constructs
         * @param value
         *   オブジェクトの値
         */
        initialize: function(value) {
            this._value = value;
            this._subscribers = [];
        },

        value: {
            get: function() {
                return this._value;
            },
            set: function(value) {
                this._value = value;
                this._publish(value);
            }
        },

        /**
         * listenerを追加する
         * @param listener
         */
        subscribe: function(listener) {
            this._subscribers.push(listener);
        },

        /**
         * listenerを破棄する
         * @param listener
         */
        unsubscribe: function(listener) {
            var i = 0,
                len = this._subscribers.length;
            for (; i < len; i++) {
                if (this._subscribers[i] === listener) {
                    this._subscribers.splice(i, 1);
                    return;
                }
            }
        },

        /**
         * listenerをすべて破棄する
         */
        clear: function() {
            this._subscribers.length = 0;
        },

        /**
         * 関連付けられているlistenerをすべて呼ぶ
         */
        _publish: function(data) {
            var i = 0,
                len = this._subscribers.length;
            for (; i < len; i++) {
                this._subscribers[i](data);
            }
        }
    });

    var hookObserver = function(arr, name, hook) {
        arr[name] = hook;
    };

    var ArrayObservable = enchant.Class.create(Observable, {
        /**
         * @constructs
         * @param value
         *   オブジェクトの値
         */
        initialize: function(value) {
            Observable.call(this, value);
            this._initializeArrayValue();
        },

        /**
         * push, pop, shift, unshiftを監視対象に加える
         */
        _initializeArrayValue: function() {
            var observable = this;
            // hook push method
            this._value._push = this._value.push;
            hookObserver(this._value, "push", function(d){
                for (var i = 0; i < arguments.length; i++) {
                    observable._value._push(arguments[i]);
                }
                observable._publish(arguments.length == 1 ? d : arguments, "push");
            });

            // hook pop method
            this._value._pop = this._value.pop;
            hookObserver(this._value, "pop", function(){
                var d = observable._value._pop();
                observable._publish(d, "pop");
            });

            // hook unshift method
            this._value._unshift = this._value.unshift;
            hookObserver(this._value, "unshift", function(d){
                for (var i = 0; i < arguments.length; i++) {
                    observable._value._unshift(arguments[i]);
                }
                observable._publish(arguments.length == 1 ? d : arguments, "unshift");
            });

            // hook shift method
            this._value._shift = this._value.shift;
            hookObserver(this._value, "shift", function(){
                var d = observable._value._shift();
                observable._publish(d, "shift");
            });
        },

        /**
         * override
         *  listenerの2番目の引数にメソッド名が入る
         */
        _publish: function(data, method) {
            var i = 0,
                len = this._subscribers.length;
            for (; i < len; i++) {
                this._subscribers[i](data, method);
            }
        }
    });

    /**
     * Subject
     *  登録されたデータフィールドを監視して、
     *  更新された場合リスナーを呼ぶ
     */
    var Subject = {
        _prefix : "_",

        /**
         * 監視対象のフィールドを初期化して追加する
         * @param key
         * @param value
         * @usage
         *  値の場合:
         *  model.setup("key", "value");
         *
         *  配列の場合:
         *  model.setup("key", []);
         *  model.setup("key", [0, 1]);
        */
        setup: function(key, value) {
            if (value instanceof Array) {
                this[this._prefix + key] = new ArrayObservable(value);
            } else {
                this[this._prefix + key] = new Observable(value);
            }
            Object.defineProperty(this, key, {
                get: function() {
                    return this[this._prefix + key].value;
                },
                set: function(value) {
                    return this[this._prefix + key].value = value;
                },
            });
        },

        /**
         * 監視対象のフィールドを更新する
         * @param key
         * @param value
         */
        set: function(key, value) {
            if (this[this._prefix + key] instanceof Observable) {
                this[key] = value;
            } else {
                this.setup(key, value);
            }
            return value;
        },

        /**
         * 監視対象のフィールドを取得する
         * @param key
         */
        get: function(key) {
            return this[this._prefix + key] instanceof Observable ? this[key] : null;
        },

        /**
         * 監視対象のフィールドにリスナーを設定する
         * @usage
         *    値の場合:
         *    model.on("key", function(data){ console.log("fire: " + data); });
         *    model.key = "test"; // or model.set("key", "test")
         *    // fire: test
         *    // => "test"
         *
         *    配列の場合:
         *    model.on("arr", function(data, method){ console.log(method + " : " + data); });
         *    model.arr.push("test");
         *    // push : test
         *    // => "test"
         *    model.arr.pop();
         *    // pop : test
         *    // => "test"
         *  
         * @param key
         *  フィールドのキー
         * @param listener
         *  監視対象のフィールドが更新された時によばれるリスナー
         */
        on: function(key, listener) {
            if (this[this._prefix + key] instanceof Observable) {
                this[this._prefix + key].subscribe(listener);
            }
        },

        /**
         * 監視対象のフィールドにリスナーを削除する
         * @param key
         *  フィールドのキー
         * @param listener
         *  監視対象にすでに登録されているリスナー
         */
        off: function(key, listener) {
            if (this[this._prefix + key] instanceof Observable) {
                this[this._prefix + key].unsubscribe(listener);
            }
        },

        /**
         * 監視対象のフィールドにリスナーをすべて削除する
         * @param key
         *  フィールドのキー
         */
        clearObserver: function(key) {
            if (this[this._prefix + key] instanceof Observable) {
                this[this._prefix + key].clear();
            } 
        }

    };

    /**
     * Observer Pattern が適用された Sprite
     * @scope enchant.model.SpriteModel
     */
    Subject['initialize'] =
      /**
       * @constructs
       * @extends enchant.Sprite
       */
      function(width, height) {
          enchant.Sprite.call(this, width, height);
      };
    enchant.model.SpriteModel = enchant.Class.create(enchant.Sprite, Subject);

    /**
     * Observer Pattern が適用された Group
     * @scope enchant.model.GroupModel
     */
    Subject['initialize'] =
      /**
       * @constructs
       * @extends enchant.Group
       */
      function() {
          enchant.Group.call(this);
      };
    enchant.model.GroupModel = enchant.Class.create(enchant.Group, Subject);

})();
