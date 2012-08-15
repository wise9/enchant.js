/**
 * @scope enchant.Event.prototype
 */
enchant.Event = enchant.Class.create({
    /**
     [lang:ja]
     * DOM Event風味の独自イベント実装を行ったクラス.
     * ただしフェーズの概念はなし.
     * @param {String} type Eventのタイプ
     * @constructs
     [/lang]
     [lang:en]
     * A class for independent event implementation like DOM Events.
     * However, does not include phase concept.
     * @param {String} type Event type.
     * @constructs
     [/lang]
     */
    initialize: function(type) {
        /**
         [lang:ja]
         * イベントのタイプ.
         * @type {String}
         [/lang]
         [lang:en]
         * Event type.
         * @type {String}
         [/lang]
         */
        this.type = type;
        /**
         [lang:ja]
         * イベントのターゲット.
         * @type {*}
         [/lang]
         [lang:en]
         * Event target.
         * @type {*}
         [/lang]
         */
        this.target = null;
        /**
         [lang:ja]
         * イベント発生位置のx座標.
         * @type {Number}
         [/lang]
         [lang:en]
         * Event occurrence's x coordinates.
         * @type {Number}
         [/lang]
         */
        this.x = 0;
        /**
         [lang:ja]
         * イベント発生位置のy座標.
         * @type {Number}
         [/lang]
         [lang:en]
         * Event occurrence's y coordinates.
         * @type {Number}
         [/lang]
         */
        this.y = 0;
        /**
         [lang:ja]
         * イベントを発行したオブジェクトを基準とするイベント発生位置のx座標.
         * @type {Number}
         [/lang]
         [lang:en]
         * X coordinates for event occurrence standard event-issuing object.
         * @type {Number}
         [/lang]
         */
        this.localX = 0;
        /**
         [lang:ja]
         * イベントを発行したオブジェクトを基準とするイベント発生位置のy座標.
         * @type {Number}
         [/lang]
         [lang:en]
         * Y coordinates for event occurrence standard event-issuing object.
         * @type {Number}
         [/lang]
         */
        this.localY = 0;
    },
    _initPosition: function(pageX, pageY) {
        var game = enchant.Game.instance;
        this.x = this.localX = (pageX - game._pageX) / game.scale;
        this.y = this.localY = (pageY - game._pageY) / game.scale;
    }
});

/**
 [lang:ja]
 * Gameのロード完了時に発生するイベント.
 *
 * 画像のプリロードを行う場合ロードが完了するのを待ってゲーム開始時の処理を行う必要がある.
 * 発行するオブジェクト: enchant.Game
 *
 * @example
 *   var game = new Game(320, 320);
 *   game.preload('player.gif');
 *   game.onload = function() {
 *      ... // ゲーム開始時の処理を記述
 *   };
 *   game.start();
 *
 * @type {String}
 [/lang]
 [lang:en]
 * Event activated upon completion of game loading.
 *
 * It is necessary to wait for loading to finish and to do initial processing when preloading images.
 * Issued object: enchant.Game
 *
 * @example
 *   var game = new Game(320, 320);
 *   game.preload('player.gif');
 *   game.onload = function() {
 *      ... // Describes initial game processing
 *   };
 *   game.start();
 *
 * @type {String}
 [/lang]
 */
enchant.Event.LOAD = 'load';

/**
 [lang:ja]
 * Gameのロード進行中に発生するイベント.
 * プリロードする画像が一枚ロードされる度に発行される. 発行するオブジェクト: enchant.Game
 * @type {String}
 [/lang]
 [lang:en]
 * Events occurring during game loading.
 * Activated each time a preloaded image is loaded. Issued object: enchant.Game
 * @type {String}
 [/lang]
 */
enchant.Event.PROGRESS = 'progress';

/**
 [lang:ja]
 * フレーム開始時に発生するイベント.
 * 発行するオブジェクト: enchant.Game, enchant.Node
 * @type {String}
 [/lang]
 [lang:en]
 * Events occurring during frame start.
 * Issued object: enchant.Game, enchant.Node
 * @type {String}
 [/lang]
 */
enchant.Event.ENTER_FRAME = 'enterframe';

/**
 [lang:ja]
 * フレーム終了時に発生するイベント.
 * 発行するオブジェクト: enchant.Game
 * @type {String}
 [/lang]
 [lang:en]
 * Events occurring during frame end.
 * Issued object: enchant.Game
 * @type {String}
 [/lang]
 */
enchant.Event.EXIT_FRAME = 'exitframe';

/**
 [lang:ja]
 * Sceneが開始したとき発生するイベント.
 * 発行するオブジェクト: enchant.Scene
 * @type {String}
 [/lang]
 [lang:en]
 * Events occurring during Scene beginning.
 * Issued object: enchant.Scene
 * @type {String}
 [/lang]
 */
enchant.Event.ENTER = 'enter';

/**
 [lang:ja]
 * Sceneが終了したとき発生するイベント.
 * 発行するオブジェクト: enchant.Scene
 * @type {String}
 [/lang]
 [lang:en]
 * Events occurring during Scene end.
 * Issued object: enchant.Scene
 * @type {String}
 [/lang]
 */
enchant.Event.EXIT = 'exit';

/**
 [lang:ja]
 * NodeがGroupに追加されたとき発生するイベント.
 * 発行するオブジェクト: enchant.Node
 * @type {String}
 [/lang]
 [lang:en]
 * Event occurring when Node is added to Group.
 * Issued object: enchant.Node
 * @type {String}
 [/lang]
 */
enchant.Event.ADDED = 'added';

/**
 [lang:ja]
 * NodeがSceneに追加されたとき発生するイベント.
 * 発行するオブジェクト: enchant.Node
 * @type {String}
 [/lang]
 [lang:en]
 * Event occurring when Node is added to Scene.
 * Issued object: enchant.Node
 * @type {String}
 [/lang]
 */
enchant.Event.ADDED_TO_SCENE = 'addedtoscene';

/**
 [lang:ja]
 * NodeがGroupから削除されたとき発生するイベント.
 * 発行するオブジェクト: enchant.Node
 * @type {String}
 [/lang]
 [lang:en]
 * Event occurring when Node is deleted from Group.
 * Issued object: enchant.Node
 * @type {String}
 [/lang]
 */
enchant.Event.REMOVED = 'removed';

/**
 [lang:ja]
 * NodeがSceneから削除されたとき発生するイベント.
 * 発行するオブジェクト: enchant.Node
 * @type {String}
 [/lang]
 [lang:en]
 * Event occurring when Node is deleted from Scene.
 * Issued object: enchant.Node
 * @type {String}
 [/lang]
 */
enchant.Event.REMOVED_FROM_SCENE = 'removedfromscene';

/**
 [lang:ja]
 * Nodeに対するタッチが始まったとき発生するイベント.
 * クリックもタッチとして扱われる. 発行するオブジェクト: enchant.Node
 * @type {String}
 [/lang]
 [lang:en]
 * Event occurring when touch corresponding to Node has begun.
 * Click is also treated as touch. Issued object: enchant.Node
 * @type {String}
 [/lang]
 */
enchant.Event.TOUCH_START = 'touchstart';

/**
 [lang:ja]
 * Nodeに対するタッチが移動したとき発生するイベント.
 * クリックもタッチとして扱われる. 発行するオブジェクト: enchant.Node
 * @type {String}
 [/lang]
 [lang:en]
 * Event occurring when touch corresponding to Node has been moved.
 * Click is also treated as touch. Issued object: enchant.Node
 * @type {String}
 [/lang]
 */
enchant.Event.TOUCH_MOVE = 'touchmove';

/**
 [lang:ja]
 * Nodeに対するタッチが終了したとき発生するイベント.
 * クリックもタッチとして扱われる. 発行するオブジェクト: enchant.Node
 * @type {String}
 [/lang]
 [lang:en]
 * Event occurring when touch corresponding to touch has ended.
 * Click is also treated as touch. Issued object: enchant.Node
 * @type {String}
 [/lang]
 */
enchant.Event.TOUCH_END = 'touchend';

/**
 [lang:ja]
 * Entityがレンダリングされるときに発生するイベント.
 * 発行するオブジェクト: enchant.Entity
 * @type {String}
 [/lang]
 [lang:en]
 * Event occurring when Entity is rendered.
 * Issued object: enchant.Entity
 * @type {String}
 [/lang]
 */
enchant.Event.RENDER = 'render';

/**
 [lang:ja]
 * ボタン入力が始まったとき発生するイベント.
 * 発行するオブジェクト: enchant.Game, enchant.Scene
 * @type {String}
 [/lang]
 [lang:en]
 * Event occurring when button is pushed.
 * Issued object: enchant.Game, enchant.Scene
 * @type {String}
 [/lang]
 */
enchant.Event.INPUT_START = 'inputstart';

/**
 [lang:ja]
 * ボタン入力が変化したとき発生するイベント.
 * 発行するオブジェクト: enchant.Game, enchant.Scene
 * @type {String}
 [/lang]
 [lang:en]
 * Event occurring when button input changes.
 * Issued object: enchant.Game, enchant.Scene
 * @type {String}
 [/lang]
 */
enchant.Event.INPUT_CHANGE = 'inputchange';

/**
 [lang:ja]
 * ボタン入力が終了したとき発生するイベント.
 * 発行するオブジェクト: enchant.Game, enchant.Scene
 * @type {String}
 [/lang]
 [lang:en]
 * Event occurring when button input ends.
 * Issued object: enchant.Game, enchant.Scene
 * @type {String}
 [/lang]
 */
enchant.Event.INPUT_END = 'inputend';

/**
 [lang:ja]
 * leftボタンが押された発生するイベント.
 * 発行するオブジェクト: enchant.Game, enchant.Scene
 * @type {String}
 [/lang]
 [lang:en]
 * Event occurring when left button is pushed.
 * Issued object: enchant.Game, enchant.Scene
 * @type {String}
 [/lang]
 */
enchant.Event.LEFT_BUTTON_DOWN = 'leftbuttondown';

/**
 [lang:ja]
 * leftボタンが離された発生するイベント.
 * 発行するオブジェクト: enchant.Game, enchant.Scene
 * @type {String}
 [/lang]
 [lang:en]
 * Event occurring when left button is released.
 * Issued object: enchant.Game, enchant.Scene
 * @type {String}
 [/lang]
 */
enchant.Event.LEFT_BUTTON_UP = 'leftbuttonup';

/**
 [lang:ja]
 * rightボタンが押された発生するイベント.
 * 発行するオブジェクト: enchant.Game, enchant.Scene
 * @type {String}
 [/lang]
 [lang:en]
 * Event occurring when right button is pushed.
 * Issued object: enchant.Game, enchant.Scene
 * @type {String}
 [/lang]
 */
enchant.Event.RIGHT_BUTTON_DOWN = 'rightbuttondown';

/**
 [lang:ja]
 * rightボタンが離された発生するイベント.
 * 発行するオブジェクト: enchant.Game, enchant.Scene
 * @type {String}
 [/lang]
 [lang:en]
 * Event occurring when right button is released.
 * Issued object: enchant.Game, enchant.Scene
 * @type {String}
 [/lang]
 */
enchant.Event.RIGHT_BUTTON_UP = 'rightbuttonup';

/**
 [lang:ja]
 * upボタンが押された発生するイベント.
 * 発行するオブジェクト: enchant.Game, enchant.Scene
 * @type {String}
 [/lang]
 [lang:en]
 * Even occurring when up button is pushed.
 * Issued object: enchant.Game, enchant.Scene
 * @type {String}
 [/lang]
 */
enchant.Event.UP_BUTTON_DOWN = 'upbuttondown';

/**
 [lang:ja]
 * upボタンが離された発生するイベント.
 * 発行するオブジェクト: enchant.Game, enchant.Scene
 * @type {String}
 [/lang]
 [lang:en]
 * Event occurring when up button is released.
 * Issued object: enchant.Game, enchant.Scene
 * @type {String}
 [/lang]
 */
enchant.Event.UP_BUTTON_UP = 'upbuttonup';

/**
 [lang:ja]
 * downボタンが離された発生するイベント.
 * 発行するオブジェクト: enchant.Game, enchant.Scene
 * @type {String}
 [/lang]
 [lang:en]
 * Event occurring when down button is pushed.
 * Issued object: enchant.Game, enchant.Scene
 * @type {String}
 [/lang]
 */
enchant.Event.DOWN_BUTTON_DOWN = 'downbuttondown';

/**
 [lang:ja]
 * downボタンが離された発生するイベント.
 * 発行するオブジェクト: enchant.Game, enchant.Scene
 * @type {String}
 [/lang]
 [lang:en]
 * Event occurring when down button is released.
 * Issued object: enchant.Game, enchant.Scene
 * @type {String}
 [/lang]
 */
enchant.Event.DOWN_BUTTON_UP = 'downbuttonup';

/**
 [lang:ja]
 * aボタンが押された発生するイベント.
 * 発行するオブジェクト: enchant.Game, enchant.Scene
 * @type {String}
 [/lang]
 [lang:en]
 * Event occurring when a button is pushed.
 * Issued object: enchant.Game, enchant.Scene
 * @type {String}
 [/lang]
 */
enchant.Event.A_BUTTON_DOWN = 'abuttondown';

/**
 [lang:ja]
 * aボタンが離された発生するイベント.
 * 発行するオブジェクト: enchant.Game, enchant.Scene
 * @type {String}
 [/lang]
 [lang:en]
 * Event occurring when a button is released.
 * Issued object: enchant.Game, enchant.Scene
 * @type {String}
 [/lang]
 */
enchant.Event.A_BUTTON_UP = 'abuttonup';

/**
 [lang:ja]
 * bボタンが押された発生するイベント.
 * 発行するオブジェクト: enchant.Game, enchant.Scene
 * @type {String}
 [/lang]
 [lang:en]
 * Event occurring when b button is pushed.
 * Issued object: enchant.Game, enchant.Scene
 * @type {String}
 [/lang]
 */
enchant.Event.B_BUTTON_DOWN = 'bbuttondown';

/**
 [lang:ja]
 * bボタンが離された発生するイベント.
 * 発行するオブジェクト: enchant.Game, enchant.Scene
 * @type {String}
 [/lang]
 [lang:en]
 * Event occurring when b button is released.
 * Issued object: enchant.Game, enchant.Scene
 * @type {String}
 [/lang]
 */
enchant.Event.B_BUTTON_UP = 'bbuttonup';
