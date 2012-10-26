/**
 * @scope enchant.Event.prototype
 */
enchant.Event = enchant.Class.create({
    /**
     [lang:ja]
     * DOM Event風味の独自イベント実装を行ったクラス.
     * ただしフェーズの概念はなし.
     * @param {String} type Eventのタイプ
     [/lang]
     [lang:en]
     * A class for an independent implementation of events
     * similar to DOM Events.
     * However, does not include phase concept.
     * @param {String} type Event type.
     [/lang]
     [lang:de]
     * Eine Klasse für eine unabhängige Implementierung von Ereignissen 
     * (Events), ähnlich wie DOM Events.
     * Jedoch wird das Phasenkonzept nicht unterstützt.
     * @param {String} type Event Typ.
     [/lang]
     * @constructs
     */
    initialize: function(type) {
        /**
         [lang:ja]
         * イベントのタイプ.
         [/lang]
         [lang:en]
         * Event type.
         [/lang]
         [lang:de]
         * Typ des Ereignis.
         [/lang]
         * @type {String}
         */
        this.type = type;
        /**
         [lang:ja]
         * イベントのターゲット.
         [/lang]
         [lang:en]
         * Event target.
         [/lang]
         [lang:de]
         * Ziel des Ereignis.
         [/lang]
         * @type {*}
         */
        this.target = null;
        /**
         [lang:ja]
         * イベント発生位置のx座標.
         [/lang]
         [lang:en]
         * Event occurrence's x coordinates.
         [/lang]
         [lang:de]
         * X Koordinate des Auftretens des Ereignis.
         [/lang]
         * @type {Number}
         */
        this.x = 0;
        /**
         [lang:ja]
         * イベント発生位置のy座標.
         [/lang]
         [lang:en]
         * Event occurrence's y coordinates.
         [/lang]
         [lang:de]
         * Y Koordinate des Auftretens des Ereignis.
         [/lang]
         * @type {Number}
         */
        this.y = 0;
        /**
         [lang:ja]
         * イベントを発行したオブジェクトを基準とするイベント発生位置のx座標.
         [/lang]
         [lang:en]
         * Event occurrence's local coordinate system's x coordinates.
         [/lang]
         [lang:de]
         * X Koordinate des lokalen Koordinatensystems des Auftretens des Ereignis.
         [/lang]
         * @type {Number}
         */
        this.localX = 0;
        /**
         [lang:ja]
         * イベントを発行したオブジェクトを基準とするイベント発生位置のy座標.
         [/lang]
         [lang:en]
         * Event occurrence's local coordinate system's y coordinates.
         [/lang]
         [lang:de]
         * Y Koordinate des lokalen Koordinatensystems des Auftretens des Ereignis.
         [/lang]
         * @type {Number}
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
 * 発行するオブジェクト: {@link enchant.Game}
 *
 * @example
 *   var game = new Game(320, 320);
 *   game.preload('player.gif');
 *   game.onload = function() {
 *      ... // ゲーム開始時の処理を記述
 *   };
 *   game.start();
 *
 [/lang]
 [lang:en]
 * Event dispatched upon completion of game loading.
 *
 * It is necessary to wait for loading to finish and to do initial processing when preloading images.
 * Issued object: {@link enchant.Game}
 *
 * @example
 *   var game = new Game(320, 320);
 *   game.preload('player.gif');
 *   game.onload = function() {
 *      ... // Describes initial game processing
 *   };
 *   game.start();
 *
 [/lang]
 [lang:de]
 * Ereignis, dass auftritt wenn das Laden des Spieles abgeschlossen wurde.
 *
 * Wenn Grafiken im voraus geladen werden ist es notwendig, auf dieses Ereignis zu warten bis mit
 * diesen gearbeitet werden kann. 
 * Objekt des Auftretens: {@link enchant.Game}
 *
 * @example
 *   var game = new Game(320, 320);
 *   game.preload('player.gif');
 *   game.onload = function() {
 *      ... // initialisierung des Spieles 
 *   };
 *   game.start();
 *
 [/lang]
 * @type {String}
 */
enchant.Event.LOAD = 'load';

/**
 [lang:ja]
 * Gameのロード進行中に発生するイベント.
 * プリロードする画像が一枚ロードされる度に発行される. 発行するオブジェクト: {@link enchant.Game}
 [/lang]
 [lang:en]
 * Events occurring during game loading.
 * Dispatched each time preloaded image is loaded. Issued object: {@link enchant.Game}
 [/lang]
 [lang:de]
 * Ereignis, welches während des Ladens des Spieles auftritt.
 * Das Ereignis tritt jedesmal auf, wenn eine im voraus geladene Grafik geladen wurde.
 * Objekt des Auftretens: {@link enchant.Game}
 [/lang]
 * @type {String}
 */
enchant.Event.PROGRESS = 'progress';

/**
 [lang:ja]
 * フレーム開始時に発生するイベント.
 * 発行するオブジェクト: {@link enchant.Game}, {@link enchant.Node}
 [/lang]
 [lang:en]
 * Events occurring when a new frame is beeing processed.
 * Issued object: {@link enchant.Game}, {@link enchant.Node}
 [/lang]
 [lang:de]
 * Ereignis, welches auftritt wenn ein neuer Frame bearbeitet wird.
 * Objekt des Auftretens: {@link enchant.Game}, {@link enchant.Node}
 [/lang]
 * @type {String}
 */
enchant.Event.ENTER_FRAME = 'enterframe';

/**
 [lang:ja]
 * フレーム終了時に発生するイベント.
 * 発行するオブジェクト: {@link enchant.Game}
 [/lang]
 [lang:en]
 * Events occurring during frame end.
 * Issued object: {@link enchant.Game}
 [/lang]
 [lang:de]
 * Ereignis, welches auftritt wenn ein Frame beendet wird.
 * Objekt des Auftretens: {@link enchant.Game}
 [/lang]
 * @type {String}
 */
enchant.Event.EXIT_FRAME = 'exitframe';

/**
 [lang:ja]
 * Sceneが開始したとき発生するイベント.
 * 発行するオブジェクト: {@link enchant.Scene}
 [/lang]
 [lang:en]
 * Events occurring during Scene beginning.
 * Issued object: {@link enchant.Scene}
 [/lang]
 [lang:de]
 * Ereignis, dass auftritt wenn eine neue Szene
 * ({@link enchant.Scene}) beginnt.
 * Objekt des Auftretens: {@link enchant.Scene}
 [/lang]
 * @type {String}
 */
enchant.Event.ENTER = 'enter';

/**
 [lang:ja]
 * Sceneが終了したとき発生するイベント.
 * 発行するオブジェクト: {@link enchant.Scene}
 [/lang]
 [lang:en]
 * Events occurring during Scene end.
 * Issued object: {@link enchant.Scene}
 [/lang]
 [lang:de]
 * Ereignis, dass auftritt wenn eine Szene
 * ({@link enchant.Scene}) endet.
 * Objekt des Auftretens: {@link enchant.Scene}
 [/lang]
 * @type {String}
 */
enchant.Event.EXIT = 'exit';

/**
 [lang:ja]
 * Nodeに子が追加されたとき発生するイベント.
 * 発行するオブジェクト: {@link enchant.Group}, {@link enchant.Scene}
 [/lang]
 [lang:en]
 * Event occurring when Child is added to Node.
 * Issued object: {@link enchant.Group}, {@link enchant.Scene}
 [/lang]
 [lang:de]
 * Ereignis, welchses auftritt wenn ein Kindelement zu einem Node
 * hinzugefügt wird.
 * Objekt des Auftretens: {@link enchant.Group}, {@link enchant.Scene}
 [/lang]
 * @type {String}
 */
enchant.Event.CHILD_ADDED = 'childadded';

/**
 [lang:ja]
 * NodeがGroupに追加されたとき発生するイベント.
 * 発行するオブジェクト: {@link enchant.Node}
 [/lang]
 [lang:en]
 * Event occurring when the Node is added to Group.
 * Issued object: {@link enchant.Node}
 [/lang]
 [lang:de]
 * Ereignis, welchses auftritt wenn der Node zu einer Gruppe
 * hinzugefügt wird.
 * Objekt des Auftretens: {@link enchant.Node}
 [/lang]
 * @type {String}
 */
enchant.Event.ADDED = 'added';

/**
 [lang:ja]
 * NodeがSceneに追加されたとき発生するイベント.
 * 発行するオブジェクト: {@link enchant.Node}
 [/lang]
 [lang:en]
 * Event occurring when the Node is added to Scene.
 * Issued object: {@link enchant.Node}
 [/lang]
 [lang:de]
 * Ereignis, welchses auftritt wenn der Node zu einer Szene
 * hinzugefügt wird.
 * Objekt des Auftretens: {@link enchant.Node}
 [/lang]
 * @type {String}
 */
enchant.Event.ADDED_TO_SCENE = 'addedtoscene';

/**
 [lang:ja]
 * Nodeから子が削除されたとき発生するイベント.
 * 発行するオブジェクト: {@link enchant.Group}, {@link enchant.Scene}
 * @type {String}
 [/lang]
 [lang:en]
 * Event occurring when Child is removed from Node.
 * Issued object: {@link enchant.Group}, {@link enchant.Scene}
 * @type {String}
 [/lang]
 [lang:de]
 * Ereignis, welchses auftritt wenn ein Kindelement von einem Node
 * entfernt wird.
 * Objekt des Auftretens: {@link enchant.Group}, {@link enchant.Scene}
 [/lang]
 * @type {String}
 */
enchant.Event.CHILD_REMOVED = 'childremoved';

/**
 [lang:ja]
 * NodeがGroupから削除されたとき発生するイベント.
 * 発行するオブジェクト: {@link enchant.Node}
 [/lang]
 [lang:en]
 * Event occurring when the Node is deleted from Group.
 * Issued object: {@link enchant.Node}
 [/lang]
 [lang:de]
 * Ereignis, welchses auftritt wenn der Node aus einer Gruppe
 * entfernt wird.
 * Objekt des Auftretens: {@link enchant.Node}
 [/lang]
 * @type {String}
 */
enchant.Event.REMOVED = 'removed';

/**
 [lang:ja]
 * NodeがSceneから削除されたとき発生するイベント.
 * 発行するオブジェクト: {@link enchant.Node}
 [/lang]
 [lang:en]
 * Event occurring when Node is deleted from Scene.
 * Issued object: {@link enchant.Node}
 [/lang]
 [lang:de]
 * Ereignis, welchses auftritt wenn der Node aus einer Szene
 * entfernt wird.
 * Objekt des Auftretens: {@link enchant.Node}
 [/lang]
 * @type {String}
 */
enchant.Event.REMOVED_FROM_SCENE = 'removedfromscene';

/**
 [lang:ja]
 * Nodeに対するタッチが始まったとき発生するイベント.
 * クリックもタッチとして扱われる. 発行するオブジェクト: {@link enchant.Node}
 [/lang]
 [lang:en]
 * Event occurring when touch corresponding to Node has begun.
 * Click is also treated as touch. Issued object: {@link enchant.Node}
 [/lang]
 [lang:de]
 * Ereignis, welchses auftritt wenn ein Touch auf einen Node
 * beginnt. Klicks werden als Touch behandelt.
 * Objekt des Auftretens: {@link enchant.Node}
 [/lang]
 * @type {String}
 */
enchant.Event.TOUCH_START = 'touchstart';

/**
 [lang:ja]
 * Nodeに対するタッチが移動したとき発生するイベント.
 * クリックもタッチとして扱われる. 発行するオブジェクト: {@link enchant.Node}
 [/lang]
 [lang:en]
 * Event occurring when touch corresponding to Node has been moved.
 * Click is also treated as touch. Issued object: {@link enchant.Node}
 [/lang]
 [lang:de]
 * Ereignis, welchses auftritt wenn ein Touch auf einen Node
 * bewegt wurde. Klicks werden als Touch behandelt.
 * Objekt des Auftretens: {@link enchant.Node}
 [/lang]
 * @type {String}
 */
enchant.Event.TOUCH_MOVE = 'touchmove';

/**
 [lang:ja]
 * Nodeに対するタッチが終了したとき発生するイベント.
 * クリックもタッチとして扱われる. 発行するオブジェクト: enchant.Node
 [/lang]
 [lang:en]
 * Event occurring when touch corresponding to touch has ended.
 * Click is also treated as touch. Issued object: enchant.Node
 [/lang]
 [lang:de]
 * Ereignis, welchses auftritt wenn ein Touch auf einen Node
 * endet. Klicks werden als Touch behandelt.
 * Objekt des Auftretens: {@link enchant.Node}
 [/lang]
 * @type {String}
 */
enchant.Event.TOUCH_END = 'touchend';

/**
 [lang:ja]
 * Entityがレンダリングされるときに発生するイベント.
 * 発行するオブジェクト: {@link enchant.Entity}
 [/lang]
 [lang:en]
 * Event occurring when an Entity is rendered.
 * Issued object: {@link enchant.Entity}
 [/lang]
 [lang:de]
 * Ereignis, welchses auftritt wenn eine Entity
 * gerendert wird.
 * Objekt des Auftretens: {@link enchant.Entity}
 [/lang]
 * @type {String}
 */
enchant.Event.RENDER = 'render';

/**
 [lang:ja]
 * ボタン入力が始まったとき発生するイベント.
 * 発行するオブジェクト: {@link enchant.Game}, {@link enchant.Scene}
 [/lang]
 [lang:en]
 * Event occurring when a button is pushed.
 * Issued object: {@link enchant.Game}, {@link enchant.Scene}
 [/lang]
 [lang:de]
 * Ereignis, welchses auftritt wenn ein Knopf gedückt wird.
 * Objekt des Auftretens: {@link enchant.Game}, {@link enchant.Scene}
 [/lang]
 * @type {String}
 */
enchant.Event.INPUT_START = 'inputstart';

/**
 [lang:ja]
 * ボタン入力が変化したとき発生するイベント.
 * 発行するオブジェクト: {@link enchant.Game}, {@link enchant.Scene}
 [/lang]
 [lang:en]
 * Event occurring when a button input changes.
 * Issued object: {@link enchant.Game}, {@link enchant.Scene}
 [/lang]
 [lang:de]
 * Ereignis, welchses auftritt wenn eine Knopfeingabe verändert wird.
 * Objekt des Auftretens: {@link enchant.Game}, {@link enchant.Scene}
 [/lang]
 * @type {String}
 */
enchant.Event.INPUT_CHANGE = 'inputchange';

/**
 [lang:ja]
 * ボタン入力が終了したとき発生するイベント.
 * 発行するオブジェクト: {@link enchant.Game}, {@link enchant.Scene}
 [/lang]
 [lang:en]
 * Event occurring when a button input ends.
 * Issued object: {@link enchant.Game}, {@link enchant.Scene}
 [/lang]
 [lang:de]
 * Ereignis, welchses auftritt wenn eine Knopf losgelassen wird.
 * Objekt des Auftretens: {@link enchant.Game}, {@link enchant.Scene}
 [/lang]
 * @type {String}
 */
enchant.Event.INPUT_END = 'inputend';

/**
 [lang:ja]
 * leftボタンが押された発生するイベント.
 * 発行するオブジェクト: {@link enchant.Game}, {@link enchant.Scene}
 [/lang]
 [lang:en]
 * Event occurring when the left button is pushed.
 * Issued object: {@link enchant.Game}, {@link enchant.Scene}
 [/lang]
 [lang:de]
 * Ereignis, welchses auftritt wenn der "Nach Links"-Knopf gedrückt wird.
 * Objekt des Auftretens: {@link enchant.Game}, {@link enchant.Scene}
 [/lang]
 * @type {String}
 */
enchant.Event.LEFT_BUTTON_DOWN = 'leftbuttondown';

/**
 [lang:ja]
 * leftボタンが離された発生するイベント.
 * 発行するオブジェクト: {@link enchant.Game}, {@link enchant.Scene}
 [/lang]
 [lang:en]
 * Event occurring when the left button is released.
 * Issued object: {@link enchant.Game}, {@link enchant.Scene}
 [/lang]
 [lang:de]
 * Ereignis, welchses auftritt wenn der "Nach Links"-Knopf losgelassen wird.
 * Objekt des Auftretens: {@link enchant.Game}, {@link enchant.Scene}
 [/lang]
 * @type {String}
 */
enchant.Event.LEFT_BUTTON_UP = 'leftbuttonup';

/**
 [lang:ja]
 * rightボタンが押された発生するイベント.
 * 発行するオブジェクト: {@link enchant.Game}, {@link enchant.Scene}
 [/lang]
 [lang:en]
 * Event occurring when the right button is pushed.
 * Issued object: {@link enchant.Game}, {@link enchant.Scene}
 [/lang]
 [lang:de]
 * Ereignis, welchses auftritt wenn der "Nach Rechts"-Knopf gedrückt wird.
 * Objekt des Auftretens: {@link enchant.Game}, {@link enchant.Scene}
 [/lang]
 * @type {String}
 */
enchant.Event.RIGHT_BUTTON_DOWN = 'rightbuttondown';

/**
 [lang:ja]
 * rightボタンが離された発生するイベント.
 * 発行するオブジェクト: {@link enchant.Game}, {@link enchant.Scene}
 [/lang]
 [lang:en]
 * Event occurring when the right button is released.
 * Issued object: {@link enchant.Game}, {@link enchant.Scene}
 [/lang]
 [lang:de]
 * Ereignis, welchses auftritt wenn der "Nach Rechts"-Knopf losgelassen wird.
 * Objekt des Auftretens: {@link enchant.Game}, {@link enchant.Scene}
 [/lang]
 * @type {String}
 */
enchant.Event.RIGHT_BUTTON_UP = 'rightbuttonup';

/**
 [lang:ja]
 * upボタンが押された発生するイベント.
 * 発行するオブジェクト: {@link enchant.Game}, {@link enchant.Scene}
 [/lang]
 [lang:en]
 * Even occurring when the up button is pushed.
 * Issued object: {@link enchant.Game}, {@link enchant.Scene}
 [/lang]
 [lang:de]
 * Ereignis, welchses auftritt wenn der "Nach Oben"-Knopf gedrückt wird.
 * Objekt des Auftretens: {@link enchant.Game}, {@link enchant.Scene}
 [/lang]
 * @type {String}
 */
enchant.Event.UP_BUTTON_DOWN = 'upbuttondown';

/**
 [lang:ja]
 * upボタンが離された発生するイベント.
 * 発行するオブジェクト: {@link enchant.Game}, {@link enchant.Scene}
 [/lang]
 [lang:en]
 * Event occurring when the up button is released.
 * Issued object: {@link enchant.Game}, {@link enchant.Scene}
 [/lang]
 [lang:de]
 * Ereignis, welchses auftritt wenn der "Nach Oben"-Knopf losgelassen wird.
 * Objekt des Auftretens: {@link enchant.Game}, {@link enchant.Scene}
 [/lang]
 * @type {String}
 */
enchant.Event.UP_BUTTON_UP = 'upbuttonup';

/**
 [lang:ja]
 * downボタンが離された発生するイベント.
 * 発行するオブジェクト: {@link enchant.Game}, {@link enchant.Scene}
 [/lang]
 [lang:en]
 * Event occurring when the down button is pushed.
 * Issued object: {@link enchant.Game}, {@link enchant.Scene}
 [/lang]
 [lang:de]
 * Ereignis, welchses auftritt wenn der "Nach Unten"-Knopf gedrückt wird.
 * Objekt des Auftretens: {@link enchant.Game}, {@link enchant.Scene}
 [/lang]
 * @type {String}
 */
enchant.Event.DOWN_BUTTON_DOWN = 'downbuttondown';

/**
 [lang:ja]
 * downボタンが離された発生するイベント.
 * 発行するオブジェクト: {@link enchant.Game}, {@link enchant.Scene}
 [/lang]
 [lang:en]
 * Event occurring when the down button is released.
 * Issued object: {@link enchant.Game}, {@link enchant.Scene}
 [/lang]
 [lang:de]
 * Ereignis, welchses auftritt wenn der "Nach Unten"-Knopf losgelassen wird.
 * Objekt des Auftretens: {@link enchant.Game}, {@link enchant.Scene}
 [/lang]
 * @type {String}
 */
enchant.Event.DOWN_BUTTON_UP = 'downbuttonup';

/**
 [lang:ja]
 * aボタンが押された発生するイベント.
 * 発行するオブジェクト: {@link enchant.Game}, {@link enchant.Scene}
 [/lang]
 [lang:en]
 * Event occurring when the a button is pushed.
 * Issued object: {@link enchant.Game}, {@link enchant.Scene}
 [/lang]
 [lang:de]
 * Ereignis, welchses auftritt wenn der "A"-Knopf gedrückt wird.
 * Objekt des Auftretens: {@link enchant.Game}, {@link enchant.Scene}
 [/lang]
 * @type {String}
 */
enchant.Event.A_BUTTON_DOWN = 'abuttondown';

/**
 [lang:ja]
 * aボタンが離された発生するイベント.
 * 発行するオブジェクト: {@link enchant.Game}, {@link enchant.Scene}
 [/lang]
 [lang:en]
 * Event occurring when the a button is released.
 * Issued object: {@link enchant.Game}, {@link enchant.Scene}
 [/lang]
 [lang:de]
 * Ereignis, welchses auftritt wenn der "A"-Knopf losgelassen wird.
 * Objekt des Auftretens: {@link enchant.Game}, {@link enchant.Scene}
 [/lang]
 * @type {String}
 */
enchant.Event.A_BUTTON_UP = 'abuttonup';

/**
 [lang:ja]
 * bボタンが押された発生するイベント.
 * 発行するオブジェクト: {@link enchant.Game}, {@link enchant.Scene}
 [/lang]
 [lang:en]
 * Event occurring when the b button is pushed.
 * Issued object: {@link enchant.Game}, {@link enchant.Scene}
 [/lang]
 [lang:de]
 * Ereignis, welchses auftritt wenn der "B"-Knopf gedrückt wird.
 * Objekt des Auftretens: {@link enchant.Game}, {@link enchant.Scene}
 [/lang]
 * @type {String}
 */
enchant.Event.B_BUTTON_DOWN = 'bbuttondown';

/**
 [lang:ja]
 * bボタンが離された発生するイベント.
 * 発行するオブジェクト: {@link enchant.Game}, {@link enchant.Scene}
 [/lang]
 [lang:en]
 * Event occurring when the b button is released.
 * Issued object: {@link enchant.Game}, {@link enchant.Scene}
 [/lang]
 [lang:de]
 * Ereignis, welchses auftritt wenn der "B"-Knopf losgelassen wird.
 * Objekt des Auftretens: {@link enchant.Game}, {@link enchant.Scene}
 [/lang]
 * @type {String}
 */
enchant.Event.B_BUTTON_UP = 'bbuttonup';
