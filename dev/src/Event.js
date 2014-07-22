/**
 * @scope enchant.Event.prototype
 */
enchant.Event = enchant.Class.create({
    /**
     * @name enchant.Event
     * @class
     [lang:ja]
     * DOM Event風味の独自イベント実装を行ったクラス.
     * ただしフェーズの概念はなし.
     * @param {String} type Eventのタイプ
     [/lang]
     [lang:en]
     * A class for an independent implementation of events similar to DOM Events.
     * Does not include phase concepts.
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
         * The type of the event.
         [/lang]
         [lang:de]
         * Typ des Ereignis.
         [/lang]
         * @type String
         */
        this.type = type;
        /**
         [lang:ja]
         * イベントのターゲット.
         [/lang]
         [lang:en]
         * The target of the event.
         [/lang]
         [lang:de]
         * Ziel des Ereignis.
         [/lang]
         * @type *
         */
        this.target = null;
        /**
         [lang:ja]
         * イベント発生位置のx座標.
         [/lang]
         [lang:en]
         * The x-coordinate of the event's occurrence.
         [/lang]
         [lang:de]
         * X Koordinate des Auftretens des Ereignis.
         [/lang]
         * @type Number
         */
        this.x = 0;
        /**
         [lang:ja]
         * イベント発生位置のy座標.
         [/lang]
         [lang:en]
         * The y-coordinate of the event's occurrence.
         [/lang]
         [lang:de]
         * Y Koordinate des Auftretens des Ereignis.
         [/lang]
         * @type Number
         */
        this.y = 0;
        /**
         [lang:ja]
         * イベントを発行したオブジェクトを基準とするイベント発生位置のx座標.
         [/lang]
         [lang:en]
         * The x-coordinate of the event's occurrence relative to the object
         * which issued the event.
         [/lang]
         [lang:de]
         * X Koordinate des lokalen Koordinatensystems des Auftretens des Ereignis.
         [/lang]
         * @type Number
         */
        this.localX = 0;
        /**
         [lang:ja]
         * イベントを発行したオブジェクトを基準とするイベント発生位置のy座標.
         [/lang]
         [lang:en]
         * The y-coordinate of the event's occurrence relative to the object
         * which issued the event.
         [/lang]
         [lang:de]
         * Y Koordinate des lokalen Koordinatensystems des Auftretens des Ereignis.
         [/lang]
         * @type Number
         */
        this.localY = 0;
    },
    _initPosition: function(pageX, pageY) {
        var core = enchant.Core.instance;
        this.x = this.localX = (pageX - core._pageX) / core.scale;
        this.y = this.localY = (pageY - core._pageY) / core.scale;
    }
});

/**
 [lang:ja]
 * Coreのロード完了時に発生するイベント.
 *
 * 画像のプリロードを行う場合ロードが完了するのを待ってゲーム開始時の処理を行う必要がある.
 * 発行するオブジェクト: {@link enchant.Core}
 *
 * @example
 * var core = new Core(320, 320);
 * core.preload('player.gif');
 * core.onload = function() {
 *     ... // ゲーム開始時の処理を記述
 * };
 * core.start();
 *
 [/lang]
 [lang:en]
 * An event dispatched once the core has finished loading.
 *
 * When preloading images, it is necessary to wait until preloading is complete
 * before starting the game.
 * Issued by: {@link enchant.Core}
 *
 * @example
 * var core = new Core(320, 320);
 * core.preload('player.gif');
 * core.onload = function() {
 *     ... // Describes initial core processing
 * };
 * core.start();
 *
 [/lang]
 [lang:de]
 * Ereignis, dass auftritt wenn das Laden des Spieles abgeschlossen wurde.
 *
 * Wenn Grafiken im voraus geladen werden ist es notwendig, auf dieses Ereignis zu warten bis mit
 * diesen gearbeitet werden kann. 
 * Objekt des Auftretens: {@link enchant.Core}
 *
 * @example
 * var core = new Core(320, 320);
 * core.preload('player.gif');
 * core.onload = function() {
 *     ... // initialisierung des Spieles 
 * };
 * core.start();
 *
 [/lang]
 * @type String
 */
enchant.Event.LOAD = 'load';

/**
 [lang:ja]
 * エラーの発生をCoreに伝える際に発生するイベント.
 * 発行するオブジェクト: {@link enchant.Core}, {@link enchant.Surface}, {@link enchant.WebAudioSound}, {@link enchant.DOMSound}
 [/lang]
 [lang:en]
 * An event dispatched when an error occurs.
 * Issued by: {@link enchant.Core}, {@link enchant.Surface}, {@link enchant.WebAudioSound}, {@link enchant.DOMSound}
 [/lang]
 [lang:de]
 * Objekt des Auftretens: {@link enchant.Core}, {@link enchant.Surface}, {@link enchant.WebAudioSound}, {@link enchant.DOMSound}
 [/lang]
 */
enchant.Event.ERROR = 'error';

/**
 [lang:ja]
 * 表示サイズが変わったときに発生するイベント.
 * 発行するオブジェクト: {@link enchant.Core}, {@link enchant.Scene}
 [/lang]
 [lang:en]
 * An event dispatched when the display size is changed.
 * Issued by: {@link enchant.Core}, {@link enchant.Scene}
 [/lang]
 [lang:de]
 * Objekt des Auftretens: {@link enchant.Core}, {@link enchant.Scene}
 [/lang]
 @type String
 */
enchant.Event.CORE_RESIZE = 'coreresize';

/**
 [lang:ja]
 * Coreのロード進行中に発生するイベント.
 * プリロードする画像が一枚ロードされる度に発行される. 発行するオブジェクト: {@link enchant.LoadingScene}
 [/lang]
 [lang:en]
 * An event dispatched while the core is loading.
 * Dispatched each time an image is preloaded.
 * Issued by: {@link enchant.LoadingScene}
 [/lang]
 [lang:de]
 * Ereignis, welches während des Ladens des Spieles auftritt.
 * Das Ereignis tritt jedesmal auf, wenn eine im voraus geladene Grafik geladen wurde.
 * Objekt des Auftretens: {@link enchant.LoadingScene}
 [/lang]
 * @type String
 */
enchant.Event.PROGRESS = 'progress';

/**
 [lang:ja]
 * フレーム開始時に発生するイベント.
 * 発行するオブジェクト: {@link enchant.Core}, {@link enchant.Node}
 [/lang]
 [lang:en]
 * An event which is occurring when a new frame is beeing processed.
 * Issued object: {@link enchant.Core}, {@link enchant.Node}
 [/lang]
 [lang:de]
 * Ereignis, welches auftritt wenn ein neuer Frame bearbeitet wird.
 * Objekt des Auftretens: {@link enchant.Core}, {@link enchant.Node}
 [/lang]
 * @type String
 */
enchant.Event.ENTER_FRAME = 'enterframe';

/**
 [lang:ja]
 * フレーム終了時に発生するイベント.
 * 発行するオブジェクト: {@link enchant.Core}
 [/lang]
 [lang:en]
 * An event dispatched at the end of processing a new frame.
 * Issued by: {@link enchant.Core}, {@link enchant.Node}
 [/lang]
 [lang:de]
 * Ereignis, welches auftritt wenn ein Frame beendet wird.
 * Objekt des Auftretens: {@link enchant.Core}
 [/lang]
 * @type String
 */
enchant.Event.EXIT_FRAME = 'exitframe';

/**
 [lang:ja]
 * Sceneが開始したとき発生するイベント.
 * 発行するオブジェクト: {@link enchant.Scene}
 [/lang]
 [lang:en]
 * An event dispatched when a Scene begins.
 * Issued by: {@link enchant.Scene}
 [/lang]
 [lang:de]
 * Ereignis, dass auftritt wenn eine neue Szene
 * ({@link enchant.Scene}) beginnt.
 * Objekt des Auftretens: {@link enchant.Scene}
 [/lang]
 * @type String
 */
enchant.Event.ENTER = 'enter';

/**
 [lang:ja]
 * Sceneが終了したとき発生するイベント.
 * 発行するオブジェクト: {@link enchant.Scene}
 [/lang]
 [lang:en]
 * An event dispatched when a Scene ends.
 * Issued by: {@link enchant.Scene}
 [/lang]
 [lang:de]
 * Ereignis, dass auftritt wenn eine Szene
 * ({@link enchant.Scene}) endet.
 * Objekt des Auftretens: {@link enchant.Scene}
 [/lang]
 * @type String
 */
enchant.Event.EXIT = 'exit';

/**
 [lang:ja]
 * Nodeに子が追加されたとき発生するイベント.
 * 発行するオブジェクト: {@link enchant.Group}, {@link enchant.Scene}
 [/lang]
 [lang:en]
 * An event dispatched when a Child is added to a Node.
 * Issued by: {@link enchant.Group}, {@link enchant.Scene}
 [/lang]
 [lang:de]
 * Ereignis, welchses auftritt wenn ein Kindelement zu einem Node
 * hinzugefügt wird.
 * Objekt des Auftretens: {@link enchant.Group}, {@link enchant.Scene}
 [/lang]
 * @type String
 */
enchant.Event.CHILD_ADDED = 'childadded';

/**
 [lang:ja]
 * NodeがGroupに追加されたとき発生するイベント.
 * 発行するオブジェクト: {@link enchant.Node}
 [/lang]
 [lang:en]
 * An event dispatched when a Node is added to a Group.
 * Issued by: {@link enchant.Node}
 [/lang]
 [lang:de]
 * Ereignis, welchses auftritt wenn der Node zu einer Gruppe
 * hinzugefügt wird.
 * Objekt des Auftretens: {@link enchant.Node}
 [/lang]
 * @type String
 */
enchant.Event.ADDED = 'added';

/**
 [lang:ja]
 * NodeがSceneに追加されたとき発生するイベント.
 * 発行するオブジェクト: {@link enchant.Node}
 [/lang]
 [lang:en]
 * An event dispatched when a Node is added to a Scene.
 * Issued by: {@link enchant.Node}
 [/lang]
 [lang:de]
 * Ereignis, welchses auftritt wenn der Node zu einer Szene
 * hinzugefügt wird.
 * Objekt des Auftretens: {@link enchant.Node}
 [/lang]
 * @type String
 */
enchant.Event.ADDED_TO_SCENE = 'addedtoscene';

/**
 [lang:ja]
 * Nodeから子が削除されたとき発生するイベント.
 * 発行するオブジェクト: {@link enchant.Group}, {@link enchant.Scene}
 * @type String
 [/lang]
 [lang:en]
 * An event dispatched when a Child is removed from a Node.
 * Issued by: {@link enchant.Group}, {@link enchant.Scene}
 * @type String
 [/lang]
 [lang:de]
 * Ereignis, welchses auftritt wenn ein Kindelement von einem Node
 * entfernt wird.
 * Objekt des Auftretens: {@link enchant.Group}, {@link enchant.Scene}
 [/lang]
 * @type String
 */
enchant.Event.CHILD_REMOVED = 'childremoved';

/**
 [lang:ja]
 * NodeがGroupから削除されたとき発生するイベント.
 * 発行するオブジェクト: {@link enchant.Node}
 [/lang]
 [lang:en]
 * An event dispatched when a Node is deleted from a Group.
 * Issued by: {@link enchant.Node}
 [/lang]
 [lang:de]
 * Ereignis, welchses auftritt wenn der Node aus einer Gruppe
 * entfernt wird.
 * Objekt des Auftretens: {@link enchant.Node}
 [/lang]
 * @type String
 */
enchant.Event.REMOVED = 'removed';

/**
 [lang:ja]
 * NodeがSceneから削除されたとき発生するイベント.
 * 発行するオブジェクト: {@link enchant.Node}
 [/lang]
 [lang:en]
 * An event dispatched when a Node is deleted from a Scene.
 * Issued by: {@link enchant.Node}
 [/lang]
 [lang:de]
 * Ereignis, welchses auftritt wenn der Node aus einer Szene
 * entfernt wird.
 * Objekt des Auftretens: {@link enchant.Node}
 [/lang]
 * @type String
 */
enchant.Event.REMOVED_FROM_SCENE = 'removedfromscene';

/**
 [lang:ja]
 * Nodeに対するタッチが始まったとき発生するイベント.
 * クリックもタッチとして扱われる. 発行するオブジェクト: {@link enchant.Node}
 [/lang]
 [lang:en]
 * An event dispatched when a touch event intersecting a Node begins.
 * A mouse event counts as a touch event. Issued by: {@link enchant.Node}
 [/lang]
 [lang:de]
 * Ereignis, welchses auftritt wenn ein Touch auf einen Node
 * beginnt. Klicks werden als Touch behandelt.
 * Objekt des Auftretens: {@link enchant.Node}
 [/lang]
 * @type String
 */
enchant.Event.TOUCH_START = 'touchstart';

/**
 [lang:ja]
 * Nodeに対するタッチが移動したとき発生するイベント.
 * クリックもタッチとして扱われる. 発行するオブジェクト: {@link enchant.Node}
 [/lang]
 [lang:en]
 * An event dispatched when a touch event intersecting the Node has been moved.
 * A mouse event counts as a touch event. Issued by: {@link enchant.Node}
 [/lang]
 [lang:de]
 * Ereignis, welchses auftritt wenn ein Touch auf einen Node
 * bewegt wurde. Klicks werden als Touch behandelt.
 * Objekt des Auftretens: {@link enchant.Node}
 [/lang]
 * @type String
 */
enchant.Event.TOUCH_MOVE = 'touchmove';

/**
 [lang:ja]
 * Nodeに対するタッチが終了したとき発生するイベント.
 * クリックもタッチとして扱われる. 発行するオブジェクト: {@link enchant.Node}
 [/lang]
 [lang:en]
 * An event dispatched when a touch event intersecting the Node ends.
 * A mouse event counts as a touch event. Issued by: {@link enchant.Node}
 [/lang]
 [lang:de]
 * Ereignis, welchses auftritt wenn ein Touch auf einen Node
 * endet. Klicks werden als Touch behandelt.
 * Objekt des Auftretens: {@link enchant.Node}
 [/lang]
 * @type String
 */
enchant.Event.TOUCH_END = 'touchend';

/**
 [lang:ja]
 * Entityがレンダリングされるときに発生するイベント.
 * 発行するオブジェクト: {@link enchant.Entity}
 [/lang]
 [lang:en]
 * An event dispatched when an Entity is rendered.
 * Issued by: {@link enchant.Entity}
 [/lang]
 [lang:de]
 * Ereignis, welchses auftritt wenn eine Entity
 * gerendert wird.
 * Objekt des Auftretens: {@link enchant.Entity}
 [/lang]
 * @type String
 */
enchant.Event.RENDER = 'render';

/**
 [lang:ja]
 * ボタン入力が始まったとき発生するイベント.
 * 発行するオブジェクト: {@link enchant.Core}, {@link enchant.Scene}
 [/lang]
 [lang:en]
 * An event dispatched when a button is pressed.
 * Issued by: {@link enchant.Core}, {@link enchant.Scene}
 [/lang]
 [lang:de]
 * Ereignis, welchses auftritt wenn ein Knopf gedückt wird.
 * Objekt des Auftretens: {@link enchant.Core}, {@link enchant.Scene}
 [/lang]
 * @type String
 */
enchant.Event.INPUT_START = 'inputstart';

/**
 [lang:ja]
 * ボタン入力が変化したとき発生するイベント.
 * 発行するオブジェクト: {@link enchant.Core}, {@link enchant.Scene}
 [/lang]
 [lang:en]
 * An event dispatched when button inputs change.
 * Issued by: {@link enchant.Core}, {@link enchant.Scene}
 [/lang]
 [lang:de]
 * Ereignis, welchses auftritt wenn eine Knopfeingabe verändert wird.
 * Objekt des Auftretens: {@link enchant.Core}, {@link enchant.Scene}
 [/lang]
 * @type String
 */
enchant.Event.INPUT_CHANGE = 'inputchange';

/**
 [lang:ja]
 * ボタン入力が終了したとき発生するイベント.
 * 発行するオブジェクト: {@link enchant.Core}, {@link enchant.Scene}
 [/lang]
 [lang:en]
 * An event dispatched when button input ends.
 * Issued by: {@link enchant.Core}, {@link enchant.Scene}
 [/lang]
 [lang:de]
 * Ereignis, welchses auftritt wenn eine Knopf losgelassen wird.
 * Objekt des Auftretens: {@link enchant.Core}, {@link enchant.Scene}
 [/lang]
 * @type String
 */
enchant.Event.INPUT_END = 'inputend';

/**
 [lang:ja]
 * 入力が変化したとき発生するイベント.
 * ボタン入力が変化したとき発生する内部的なイベント.
 * 発行するオブジェクト: {@link enchant.InputSource}
 [/lang]
 [lang:en]
 * An internal event which is occurring when a input changes.
 * Issued object: {@link enchant.InputSource}
 [/lang]
 * @type String
 */
enchant.Event.INPUT_STATE_CHANGED = 'inputstatechanged';

/**
 [lang:ja]
 * leftボタンが押された発生するイベント.
 * 発行するオブジェクト: {@link enchant.Core}, {@link enchant.Scene}
 [/lang]
 [lang:en]
 * An event dispatched when the 'left' button is pressed.
 * Issued by: {@link enchant.Core}, {@link enchant.Scene}
 [/lang]
 [lang:de]
 * Ereignis, welchses auftritt wenn der "Nach Links"-Knopf gedrückt wird.
 * Objekt des Auftretens: {@link enchant.Core}, {@link enchant.Scene}
 [/lang]
 * @type String
 */
enchant.Event.LEFT_BUTTON_DOWN = 'leftbuttondown';

/**
 [lang:ja]
 * leftボタンが離された発生するイベント.
 * 発行するオブジェクト: {@link enchant.Core}, {@link enchant.Scene}
 [/lang]
 [lang:en]
 * An event dispatched when the 'left' button is released.
 * Issued by: {@link enchant.Core}, {@link enchant.Scene}
 [/lang]
 [lang:de]
 * Ereignis, welchses auftritt wenn der "Nach Links"-Knopf losgelassen wird.
 * Objekt des Auftretens: {@link enchant.Core}, {@link enchant.Scene}
 [/lang]
 * @type String
 */
enchant.Event.LEFT_BUTTON_UP = 'leftbuttonup';

/**
 [lang:ja]
 * rightボタンが押された発生するイベント.
 * 発行するオブジェクト: {@link enchant.Core}, {@link enchant.Scene}
 [/lang]
 [lang:en]
 * An event dispatched when the 'right' button is pressed.
 * Issued by: {@link enchant.Core}, {@link enchant.Scene}
 [/lang]
 [lang:de]
 * Ereignis, welchses auftritt wenn der "Nach Rechts"-Knopf gedrückt wird.
 * Objekt des Auftretens: {@link enchant.Core}, {@link enchant.Scene}
 [/lang]
 * @type String
 */
enchant.Event.RIGHT_BUTTON_DOWN = 'rightbuttondown';

/**
 [lang:ja]
 * rightボタンが離された発生するイベント.
 * 発行するオブジェクト: {@link enchant.Core}, {@link enchant.Scene}
 [/lang]
 [lang:en]
 * An event dispatched when the 'right' button is released.
 * Issued by: {@link enchant.Core}, {@link enchant.Scene}
 [/lang]
 [lang:de]
 * Ereignis, welchses auftritt wenn der "Nach Rechts"-Knopf losgelassen wird.
 * Objekt des Auftretens: {@link enchant.Core}, {@link enchant.Scene}
 [/lang]
 * @type String
 */
enchant.Event.RIGHT_BUTTON_UP = 'rightbuttonup';

/**
 [lang:ja]
 * upボタンが押された発生するイベント.
 * 発行するオブジェクト: {@link enchant.Core}, {@link enchant.Scene}
 [/lang]
 [lang:en]
 * An event dispatched when the 'up' button is pressed.
 * Issued by: {@link enchant.Core}, {@link enchant.Scene}
 [/lang]
 [lang:de]
 * Ereignis, welchses auftritt wenn der "Nach Oben"-Knopf gedrückt wird.
 * Objekt des Auftretens: {@link enchant.Core}, {@link enchant.Scene}
 [/lang]
 * @type String
 */
enchant.Event.UP_BUTTON_DOWN = 'upbuttondown';

/**
 [lang:ja]
 * upボタンが離された発生するイベント.
 * 発行するオブジェクト: {@link enchant.Core}, {@link enchant.Scene}
 [/lang]
 [lang:en]
 * An event dispatched when the 'up' button is released.
 * Issued by: {@link enchant.Core}, {@link enchant.Scene}
 [/lang]
 [lang:de]
 * Ereignis, welchses auftritt wenn der "Nach Oben"-Knopf losgelassen wird.
 * Objekt des Auftretens: {@link enchant.Core}, {@link enchant.Scene}
 [/lang]
 * @type String
 */
enchant.Event.UP_BUTTON_UP = 'upbuttonup';

/**
 [lang:ja]
 * downボタンが離された発生するイベント.
 * 発行するオブジェクト: {@link enchant.Core}, {@link enchant.Scene}
 [/lang]
 [lang:en]
 * An event dispatched when the 'down' button is pressed.
 * Issued by: {@link enchant.Core}, {@link enchant.Scene}
 [/lang]
 [lang:de]
 * Ereignis, welchses auftritt wenn der "Nach Unten"-Knopf gedrückt wird.
 * Objekt des Auftretens: {@link enchant.Core}, {@link enchant.Scene}
 [/lang]
 * @type String
 */
enchant.Event.DOWN_BUTTON_DOWN = 'downbuttondown';

/**
 [lang:ja]
 * downボタンが離された発生するイベント.
 * 発行するオブジェクト: {@link enchant.Core}, {@link enchant.Scene}
 [/lang]
 [lang:en]
 * An event dispatched when the 'down' button is released.
 * Issued by: {@link enchant.Core}, {@link enchant.Scene}
 [/lang]
 [lang:de]
 * Ereignis, welchses auftritt wenn der "Nach Unten"-Knopf losgelassen wird.
 * Objekt des Auftretens: {@link enchant.Core}, {@link enchant.Scene}
 [/lang]
 * @type String
 */
enchant.Event.DOWN_BUTTON_UP = 'downbuttonup';

/**
 [lang:ja]
 * aボタンが押された発生するイベント.
 * 発行するオブジェクト: {@link enchant.Core}, {@link enchant.Scene}
 [/lang]
 [lang:en]
 * An event dispatched when the 'a' button is pressed.
 * Issued by: {@link enchant.Core}, {@link enchant.Scene}
 [/lang]
 [lang:de]
 * Ereignis, welchses auftritt wenn der "A"-Knopf gedrückt wird.
 * Objekt des Auftretens: {@link enchant.Core}, {@link enchant.Scene}
 [/lang]
 * @type String
 */
enchant.Event.A_BUTTON_DOWN = 'abuttondown';

/**
 [lang:ja]
 * aボタンが離された発生するイベント.
 * 発行するオブジェクト: {@link enchant.Core}, {@link enchant.Scene}
 [/lang]
 [lang:en]
 * An event dispatched when the 'a' button is released.
 * Issued by: {@link enchant.Core}, {@link enchant.Scene}
 [/lang]
 [lang:de]
 * Ereignis, welchses auftritt wenn der "A"-Knopf losgelassen wird.
 * Objekt des Auftretens: {@link enchant.Core}, {@link enchant.Scene}
 [/lang]
 * @type String
 */
enchant.Event.A_BUTTON_UP = 'abuttonup';

/**
 [lang:ja]
 * bボタンが押された発生するイベント.
 * 発行するオブジェクト: {@link enchant.Core}, {@link enchant.Scene}
 [/lang]
 [lang:en]
 * An event dispatched when the 'b' button is pressed.
 * Issued by: {@link enchant.Core}, {@link enchant.Scene}
 [/lang]
 [lang:de]
 * Ereignis, welchses auftritt wenn der "B"-Knopf gedrückt wird.
 * Objekt des Auftretens: {@link enchant.Core}, {@link enchant.Scene}
 [/lang]
 * @type String
 */
enchant.Event.B_BUTTON_DOWN = 'bbuttondown';

/**
 [lang:ja]
 * bボタンが離された発生するイベント.
 * 発行するオブジェクト: {@link enchant.Core}, {@link enchant.Scene}
 [/lang]
 [lang:en]
 * An event dispatched when the 'b' button is released.
 * Issued by: {@link enchant.Core}, {@link enchant.Scene}
 [/lang]
 [lang:de]
 * Ereignis, welchses auftritt wenn der "B"-Knopf losgelassen wird.
 * Objekt des Auftretens: {@link enchant.Core}, {@link enchant.Scene}
 [/lang]
 * @type String
 */
enchant.Event.B_BUTTON_UP = 'bbuttonup';

/**
 [lang:ja]
 * アクションがタイムラインに追加された時に発行されるイベント.
 * looped が設定されている時も, アクションは一度タイムラインから削除されもう一度追加される.
 [/lang]
 [lang:en]
 * An event dispatched when an Action is added to a Timeline.
 * When looped, an Action is removed from the Timeline and added back into it.
 [/lang]
 [lang:de]
 [/lang]
 * @type String
 */
enchant.Event.ADDED_TO_TIMELINE = "addedtotimeline";

/**
 [lang:ja]
 * アクションがタイムラインから削除された時に発行されるイベント.
 * looped が設定されている時も, アクションは一度タイムラインから削除されもう一度追加される.
 [/lang]
 [lang:en]
 * An event dispatched when an Action is removed from a Timeline.
 * When looped, an Action is removed from the timeline and added back into it.
 [/lang]
 [lang:de]
 [/lang]
 * @type String
 */
enchant.Event.REMOVED_FROM_TIMELINE = "removedfromtimeline";

/**
 [lang:ja]
 * アクションが開始された時に発行されるイベント.
 [/lang]
 [lang:en]
 * An event dispatched when an Action begins.
 [/lang]
 [lang:de]
 [/lang]
 * @type String
 */
enchant.Event.ACTION_START = "actionstart";

/**
 [lang:ja]
 * アクションが終了するときに発行されるイベント.
 [/lang]
 [lang:en]
 * An event dispatched when an Action finishes.
 [/lang]
 [lang:de]
 [/lang]
 * @type String
 */
enchant.Event.ACTION_END = "actionend";

/**
 [lang:ja]
 * アクションが1フレーム経過するときに発行されるイベント.
 [/lang]
 [lang:en]
 * An event dispatched when an Action has gone through one frame.
 [/lang]
 [lang:de]
 [/lang]
 * @type String
 */
enchant.Event.ACTION_TICK = "actiontick";

/**
 [lang:ja]
 * アクションが追加された時に, タイムラインに対して発行されるイベント.
 [/lang]
 [lang:en]
 * An event dispatched to the Timeline when an Action is added.
 [/lang]
 [lang:de]
 [/lang]
 * @type String
 */
enchant.Event.ACTION_ADDED = "actionadded";

/**
 [lang:ja]
 * アクションが削除された時に, タイムラインに対して発行されるイベント.
 [/lang]
 [lang:en]
 * An event dispatched to the Timeline when an Action is removed.
 [/lang]
 [lang:de]
 [/lang]
 * @type String
 */
enchant.Event.ACTION_REMOVED = "actionremoved";

/**
 [lang:ja]
 * フレームアニメーションが終了したときに発生するイベント. フレームの再生がnullに到達したことを意味する.
 [/lang]
 [lang:en]
 * An event dispatched when an animation finishes, meaning null element was encountered
 * Issued by: {@link enchant.Sprite}
 [/lang]
 [lang:de]
 [/lang]
 * @type String
 */
enchant.Event.ANIMATION_END = "animationend";
