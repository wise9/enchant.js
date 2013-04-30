/**
 * @scope enchant.Action.prototype
 * @type {*}
 */

enchant.Action = enchant.Class.create(enchant.ActionEventTarget, {
    /**
     * @name enchant.Action
     * @class
     [lang:ja]
     * アニメーションタイムラインを構成する、実行したい処理を指定するためのクラス.
     *
     * タイムラインに追加されたアクションは順に実行される。
     * アクションが開始・終了された時に actionstart, actionend イベントが発行され、
     * また1フレーム経過した時には actiontick イベントが発行される。
     * これらのイベントのリスナとして実行したい処理を指定する。
     *
     * time で指定されたフレーム数が経過すると自動的に次のアクションに移行するが、
     * null が指定されると、タイムラインの next メソッドが呼ばれるまで移行しない。
     * @constructs
     * @param param
     * @config {integer} [time] アクションが持続するフレーム数。 null が指定されると無限長
     * @config {function} [onactionstart] アクションが開始される時のイベントリスナ
     * @config {function} [onactiontick] アクションが1フレーム経過するときのイベントリスナ
     * @config {function} [onactionend] アクションがが終了する時のイベントリスナ
     [/lang]
     [lang:en]
     * Action class.
     * Actions are units that make up the time line,
     * It is a unit used to specify the action you want to perform.
     * Action has been added to the time line is performed in order.
     *
     * Actionstart, actiontick event is fired when the action is started and stopped,
     * When one frame has elapsed actiontick event is also issued.
     * Specify the action you want to perform as a listener for these events.
     * The transition to the next action automatically the number of frames that are specified in the time has elapsed.
     *
     * @constructs
     * @param param
     * @config {integer} [time] The number of frames that will last action. infinite length is specified null
     * @config {function} [onactionstart] Event listener for when the action is initiated
     * @config {function} [onactiontick] Event listener for when the action has passed one frame
     * @config {function} [onactionend] Event listener for when the action is finished
     [/lang]
     * @constructs
     */
    initialize: function(param) {
        enchant.ActionEventTarget.call(this);
        this.time = null;
        this.frame = 0;
        for (var key in param) {
            if (param.hasOwnProperty(key)) {
                if (param[key] != null) {
                    this[key] = param[key];
                }
            }
        }
        var action = this;

        this.timeline = null;
        this.node = null;

        this.addEventListener(enchant.Event.ADDED_TO_TIMELINE, function(evt) {
            action.timeline = evt.timeline;
            action.node = evt.timeline.node;
            action.frame = 0;
        });

        this.addEventListener(enchant.Event.REMOVED_FROM_TIMELINE, function() {
            action.timeline = null;
            action.node = null;
            action.frame = 0;
        });

        this.addEventListener(enchant.Event.ACTION_TICK, function(evt) {
            var remaining = action.time - (action.frame + evt.elapsed);
            if (action.time != null && remaining <= 0) {
                action.frame = action.time;
                evt.timeline.next(-remaining);
            } else {
                action.frame += evt.elapsed;
            }
        });

    }
});
