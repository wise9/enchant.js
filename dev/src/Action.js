/**
 * @scope enchant.Action.prototype
 */
enchant.Action = enchant.Class.create(enchant.ActionEventTarget, {
    /**
     * @name enchant.Action
     * @class
     [lang:ja]
     * アニメーションタイムラインを構成する, 実行したい処理を指定するためのクラス.
     *
     * タイムラインに追加されたアクションは順に実行される.
     * アクションが開始・終了された時に actionstart, actionend イベントが発行され,
     * また1フレーム経過した時には actiontick イベントが発行される.
     * これらのイベントのリスナとして実行したい処理を指定する.
     *
     * time で指定されたフレーム数が経過すると自動的に次のアクションに移行するが,
     * null が指定されると, タイムラインの next メソッドが呼ばれるまで移行しない.
     * @param {Object} param
     * @param {Number} [param.time] アクションが持続するフレーム数. null が指定されると無限長.
     * @param {Function} [param.onactionstart] アクションが開始される時のイベントリスナ.
     * @param {Function} [param.onactiontick] アクションが1フレーム経過するときのイベントリスナ.
     * @param {Function} [param.onactionend] アクションがが終了する時のイベントリスナ.
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
     * @param {Object} param
     * @param {Number} [param.time] The number of frames that will last action. infinite length is specified null.
     * @param {Function} [param.onactionstart] Event listener for when the action is initiated.
     * @param {Function} [param.onactiontick] Event listener for when the action has passed one frame.
     * @param {Function} [param.onactionend] Event listener for when the action is finished.
     [/lang]
     [lang:de]
     * @param {Object} param
     * @param {Number} [param.time]
     * @param {Function} [param.onactionstart]
     * @param {Function} [param.onactiontick]
     * @param {Function} [param.onactionend]
     [/lang]
     * @constructs
     * @extends enchant.ActionEventTarget
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
