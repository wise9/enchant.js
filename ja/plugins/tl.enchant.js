/**
 * tl.enchant.js
 * @version 0.3.1
 * @require enchant.js v0.4.3 or later
 * @author sidestepism
 *
 * @example
 * var bear = new Sprite(32, 32);
 * bear.image = game.assets['icon0.gif'];
 * bear.tl.moveTo(64, 64, 30).fadeOut(30);
 * game.rootScene.addChild(bear);
 *
 * @example
 * var bear = new Sprite(32, 32);
 * bear.tl.hide().tween({
 *     opacity: 0,
 *     scaleX: 3,
 *     scaleY: 3,
 *     time: 30
 * });
 * game.rootScene.addChild(bear);
 *
 * @example
 * var bear = new Sprite(32, 32);
 * bear.cue({
 *      0: function(){ do.something(); },
 *     10: function(){ do.something(); },
 *     20: function(){ do.something(); },
 *     30: function(){ do.something(); }
 * });
 *
 **/

/**
 * plugin namespace object
 */
enchant.tl = {};

/**
 * アクションがタイムラインに追加された時に発行されるイベント
 */
enchant.Event.ADDED_TO_TIMELINE = "addedtotimeline";
/**
 * アクションがタイムラインから削除された時に発行されるイベント
 * looped が設定されている時も、アクションは一度タイムラインから削除されもう一度追加される
 */
enchant.Event.REMOVED_FROM_TIMELINE = "removedfromtimeline";

/**
 * アクションが開始された時に発行されるイベント
 */
enchant.Event.ACTION_START = "actionstart";

/**
 * アクションが終了するときに発行されるイベント
 */
enchant.Event.ACTION_END = "actionend";

/**
 * アクションが1フレーム経過するときに発行されるイベント
 */
enchant.Event.ACTION_TICK = "actiontick";

/**
 * アクションが追加された時に、タイムラインに対して発行されるイベント
 */
enchant.Event.ACTION_ADDED = "actionadded";
/**
 * アクションが削除された時に、タイムラインに対して発行されるイベント
 */
enchant.Event.ACTION_REMOVED = "actionremoved";

/**
 * Node が生成される際に、tl プロパティに Timeline オブジェクトを追加している
 */
(function () {
    var orig = enchant.Node.prototype.initialize;
    enchant.Node.prototype.initialize = function () {
        orig.apply(this, arguments);
        var tl = this.tl = new enchant.tl.Timeline(this);
        this.addEventListener("enterframe", function () {
            tl.dispatchEvent(new enchant.Event("enterframe"));
        });
    };
})();

/**
 * @scope enchant.tl.ActionEventTarget
 */
enchant.tl.ActionEventTarget = enchant.Class.create(enchant.EventTarget, {
    /**
     * イベントリスナの実行時にコンテキストを this.target にするよう書き換えた EventTarget
     * @constructs
     * @extends enchant.EventTarget
     */
    initialize: function(){
        enchant.EventTarget.apply(this, arguments);
    },
    /**
     * Issue event.
     * @param {enchant.Event} e Event issued.
     */
    dispatchEvent: function(e) {
        if(this.node){
            var target = this.node;
            e.target = target;
            e.localX = e.x - target._offsetX;
            e.localY = e.y - target._offsetY;
        }else{
            this.node = null;
        }

        if (this['on' + e.type] != null) this['on' + e.type].call(target, e);
        var listeners = this._listeners[e.type];
        if (listeners != null) {
            listeners = listeners.slice();
            for (var i = 0, len = listeners.length; i < len; i++) {
                listeners[i].call(target, e);
            }
        }
    }
});

/**
 * @scope enchant.tl.Action
 */
enchant.tl.Action = enchant.Class.create(enchant.tl.ActionEventTarget, {
    /**
     * アクションクラス。
     * アクションはタイムラインを構成する単位であり、
     * 実行したい処理を指定するためのユニットである。
     * タイムラインに追加されたアクションは順に実行される。
     *
     * アクションが開始・終了された時に actionstart, actiontick イベントが発行され、
     * また1フレーム経過した時には actiontick イベントが発行される。
     * これらのイベントのリスナとして実行したい処理を指定する。
     *
     * time で指定されたフレーム数が経過すると自動的に次のアクションに移行するが、
     * null が指定されると、タイムラインの next メソッドが呼ばれるまで移行しない。
     *
     * @param param
     * @config {integer} [time] アクションが持続するフレーム数。 null が指定されると無限長
     * @config {function} [onactionstart] アクションが開始される時のイベントリスナ
     * @config {function} [onactiontick] アクションが1フレーム経過するときのイベントリスナ
     * @config {function} [onactionend] アクションがが終了する時のイベントリスナ
     */
    initialize: function(param){
        enchant.tl.ActionEventTarget.call(this);
        this.time = null;
        this.frame = 0;
        for(var key in param)if(param.hasOwnProperty(key)){
            if(param[key] != null)this[key] = param[key];
        }

        var action = this;

        this.timeline = null;
        this.node = null;

        this.addEventListener(enchant.Event.ADDED_TO_TIMELINE, function(evt){
            action.timeline = evt.timeline;
            action.node = evt.timeline.node;
            action.frame = 0;
        });

        this.addEventListener(enchant.Event.REMOVED_FROM_TIMELINE, function(evt){
            action.timeline = null;
            action.node = null;
            action.frame = 0;
        });

        this.addEventListener(enchant.Event.ACTION_TICK, function(evt){
            action.frame ++;
            if(action.time != null && action.frame > action.time){
                evt.timeline.next();
            }
        });

    }
});

/**
 * @scope enchant.tl.ParallelAction
 */
enchant.tl.ParallelAction = enchant.Class.create(enchant.tl.Action, {
    /**
     * アクションを並列で実行するためのアクション。
     * 子アクションを複数持つことができる。
     * @constructs
     * @extends enchant.tl.Action
     */
    initialize: function(param){
        enchant.tl.Action.call(this, param);
        var timeline = this.timeline;
        var node = this.node;
        /**
         * 子アクション
         */
        this.actions = [];
        /**
         * 実行が終了したアクション
         */
        this.endedActions = [];
        var that = this;

        this.addEventListener(enchant.Event.ACTION_START, function(evt){
            // start するときは同時
            for(var i = 0, len = that.actions.length; i < len; i++){
                that.actions[i].dispatchEvent(evt);
            }
        });

        this.addEventListener(enchant.Event.ACTION_TICK, function(evt){
            var i, len, timeline = {
                next: function(){
                    var action = that.actions[i];
                    that.actions.splice(i--, 1);
                    len = that.actions.length;
                    that.endedActions.push(action);

                    // イベントを発行
                    var e = new enchant.Event("actionend");
                    e.timeline = this;
                    action.dispatchEvent(e);

                    e = new enchant.Event("removedfromtimeline");
                    e.timeline = this;
                    action.dispatchEvent(e);
                }
            };

            var e = new enchant.Event("actiontick");
            e.timeline = timeline;
            for(i = 0, len = that.actions.length; i < len; i++){
                that.actions[i].dispatchEvent(e);
            }
            // 残りアクションが 0 になったら次のアクションへ
            if(that.actions.length == 0){
                evt.timeline.next();
            }
        });

        this.addEventListener(enchant.Event.ADDED_TO_TIMELINE, function(evt){
            for(var i = 0, len = that.actions.length; i < len; i++){
                that.actions[i].dispatchEvent(evt);
            }
        });

        this.addEventListener(enchant.Event.REMOVED_FROM_TIMELINE, function(evt){
            // すべて戻す
            this.actions = this.endedActions;
            this.endedActions = [];
        });

    }
});

/**
 * @scope enchant.tl.Tween
 */
enchant.tl.Tween = enchant.Class.create(enchant.tl.Action, {
    /**
     * トゥイーンクラス。
     * アクションを扱いやすく拡張したクラス。
     * オブジェクトの特定のプロパティを、なめらかに変更したい時に用いる。
     *
     * コンストラクタに渡す設定オブジェクトに、プロパティの目標値を指定すると、
     * アクションが実行された時に、目標値までなめらかに値を変更するようなアクションを生成する。
     *
     * トゥイーンのイージングも、easing プロパティで指定できる。
     * デフォルトでは enchant.Easing.LINEAR が指定されている。
     *
     * @param params
     * @config {time}
     * @config {easing} [function]
     */
    initialize: function(params){
        var origin = {};
        var target = {};
        enchant.tl.Action.call(this, params);

        if(this.easing == null) {
            // linear
            this.easing = function (t, b, c, d) {
                return c * t / d + b;
            };
        }

        var tween = this;
        this.addEventListener(enchant.Event.ACTION_START, function(){
            // トゥイーンの対象とならないプロパティ
            var excepted = ["frame", "time", "callback", "onactiontick", "onactionstart", "onactionend"];
            for (var prop in params) if (params.hasOwnProperty(prop)) {
                // 値の代わりに関数が入っていた場合評価した結果を用いる
                var target_val;
                if(typeof params[prop] == "function"){
                    target_val = params[prop].call(tween.node);
                }else target_val = params[prop];

                if(excepted.indexOf(prop) == -1) {
                    origin[prop] = tween.node[prop];
                    target[prop] = target_val;
                }
            }
        });

        this.addEventListener(enchant.Event.ACTION_TICK, function (evt) {
            var ratio = tween.easing(tween.frame, 0, 1, tween.time);
            for (var prop in target) if (target.hasOwnProperty(prop)) {
                if(typeof this[prop] === "undefined")continue;
                var val = target[prop] * ratio + origin[prop] * (1 - ratio);
                if(prop === "x" || prop === "y") {
                    tween.node[prop] = Math.round(val);
                } else {
                    tween.node[prop] = val;
                }
            }
        });
    }
});

enchant.tl.Timeline = enchant.Class.create(enchant.EventTarget, {
    /**
     * タイムラインクラス。
     * アクションを管理するためのクラス。
     * 操作するノードひとつに対して、必ずひとつのタイムラインが対応する。
     *
     * tl.enchant.js を読み込むと、Node クラスを継承したすべてのクラス (Group, Scene, Entity, Label, Sprite)の
     * tl プロパティに、タイムラインクラスのインスタンスが生成される。
     * タイムラインクラスは、自身に様々なアクションを追加するメソッドを持っており、
     * これらを使うことで簡潔にアニメーションや様々な操作をすることができる。
     *
     * @param node 操作の対象となるノード
     */
    initialize: function(node){
        enchant.EventTarget.call(this);
        this.node = node;
        this.queue = [];
        this.paused = false;
        this.looped = false;

        this._parallel = null;

        this.addEventListener(enchant.Event.ENTER_FRAME, this.tick);
    },
    /**
     * キューの先頭にあるアクションを終了し、次のアクションへ移行する。
     * アクションの中から呼び出されるが、外から呼び出すこともできる。
     *
     * アクション実行中に、アクションが終了した場合、
     * もう一度 tick() 関数が呼ばれるため、1フレームに複数のアクションが処理される場合もある。
     * ex.
     *   sprite.tl.then(function A(){ .. }).then(function B(){ .. });
     * と記述した場合、最初のフレームで A・B の関数どちらも実行される
     *
     */
    next: function(){
        var e, action = this.queue.shift();
        e = new enchant.Event("actionend");
        e.timeline = this;
        action.dispatchEvent(e);

        if(this.looped){
            e = new enchant.Event("removedfromtimeline");
            e.timeline = this;
            action.dispatchEvent(e);

            action.frame = 0;

            this.add(action);
        }else{
            // イベントを発行して捨てる
            e = new enchant.Event("removedfromtimeline");
            e.timeline = this;
            action.dispatchEvent(e);
        }
        this.dispatchEvent(new enchant.Event("enterframe"));
    },
    /**
     * ターゲットの enterframe イベントのリスナとして登録される関数
     * 1フレーム経過する際に実行する処理が書かれている。
     * (キューの先頭にあるアクションに対して、actionstart/actiontickイベントを発行する)
     */
    tick: function(){
        if(this.queue.length > 0){
            var action = this.queue[0];
            if(action.frame == 0){
                e = new enchant.Event("actionstart");
                e.timeline = this;
                action.dispatchEvent(e);
            }
            var e = new enchant.Event("actiontick");
            e.timeline = this;
            action.dispatchEvent(e);
        }
    },
    add: function(action){
        if(this._parallel){
            this._parallel.actions.push(action);
            this._parallel = null;
        }else{
            this.queue.push(action);
        }
        action.frame = 0;

        var e = new enchant.Event("addedtotimeline");
        e.timeline = this;
        action.dispatchEvent(e);

        e = new enchant.Event("actionadded");
        e.action = action;
        this.dispatchEvent(e);

        return this;
    },
    /**
     * アクションを簡単に追加するためのメソッド。
     * 実体は add メソッドのラッパ。
     * @param params アクションの設定オブジェクト
     */
    action: function(params){
        return this.add(new enchant.tl.Action(params));
    },
    /**
     * トゥイーンを簡単に追加するためのメソッド。
     * 実体は add メソッドのラッパ。
     * @param params トゥイーンの設定オブジェクト。
     */
    tween: function(params){
        return this.add(new enchant.tl.Tween(params));
    },
    /**
     * タイムラインのキューをすべて破棄する。終了イベントは発行されない。
     */
    clear: function(){
        var e = new enchant.Event("removedfromtimeline");
        e.timeline = this;

        for(var i = 0, len = this.queue.length; i < len; i++){
            this.queue[i].dispatchEvent(e);
        }
        this.queue = [];
        return this;
    },
    /**
     * タイムラインを早送りする。
     * 指定したフレーム数が経過したのと同様の処理を、瞬時に実行する。
     * 巻き戻しはできない。
     * @param frames
     */
    skip: function(frames){
        while(frames --){
            this.dispatchEvent(new enchant.Event("enterframe"));
        }
        return this;
    },
    /**
     * タイムラインの実行を一時停止する
     */
    pause: function(){
        this.paused = false;
        return this;
    },
    /**
     * タイムラインの実行を再開する
     */
    resume: function(){
        this.paused = true;
        return this;
    },
    /**
     * タイムラインをループさせる。
     * ループしているときに終了したアクションは、タイムラインから取り除かれた後
     * 再度タイムラインに追加される。このアクションは、ループが解除されても残る。
     */
    loop: function(){
        this.looped = true;
        return this;
    },
    /**
     * タイムラインのループを解除する。
     */
    unloop: function(){
        this.looped = false;
        return this;
    },
    /**
     * 指定したフレーム数だけ待ち、何もしないアクションを追加する。
     * @param time
     */
    delay: function(time){
        this.add(new enchant.tl.Action({
            time: time
        }));
        return this;
    },
    /**
     * @ignore
     * @param time
     */
    wait: function(time){
        // reserved
        return this;
    },
    /**
     * 関数を実行し、即時に次のアクションに移るアクションを追加する。
     * @param func
     */
    then: function(func){
        var timeline = this;
        this.add(new enchant.tl.Action({
                    onactiontick: function(evt){
                        func.call(timeline.node);
                        timeline.next();
                    }
                }));
        return this;
    },
    /**
     * then メソッドのシノニム。
     * 関数を実行し、即時に次のアクションに移る。
     * @param func
     */
    exec: function(func){
        this.then(func);
    },
    /**
     * 実行したい関数を、フレーム数をキーとした連想配列(オブジェクト)で複数指定し追加する。
     * 内部的には delay, then を用いている。
     *
     * @example
     * sprite.tl.cue({
     *    10: function(){ 10フレーム経過した後に実行される関数 },
     *    20: function(){ 20フレーム経過した後に実行される関数 },
     *    30: function(){ 30フレーム経過した後に実行される関数 }
     * });
     * @param cue キューオブジェクト
     */
    cue: function(cue){
        var ptr = 0;
        for(var frame in cue)if(cue.hasOwnProperty(frame)){
            this.delay(frame - ptr);
            this.then(cue[frame]);
            ptr = frame;
        }
    },
    /**
     * ある関数を指定したフレーム数繰り返し実行するアクションを追加する。
     * @param func 実行したい関数
     * @param time 持続フレーム数
     */
    repeat: function(func, time){
        this.add(new enchant.tl.Action({
            onactiontick: function(evt){
                func.call(this);
            },
            time: time
        }));
        return this;
    },
    /**
     * 複数のアクションを並列で実行したいときに指定する。
     * and で結ばれたすべてのアクションが終了するまで次のアクションには移行しない
     * @example
     * sprite.tl.fadeIn(30).and.rotateBy(360, 30);
     * 30フレームでフェードインしながら 360度回転する
     */
    and: function(){
        var last = this.queue.pop();
        if(last instanceof enchant.tl.ParallelAction){
            this._parallel = last;
            this.queue.push(last);
        }else{
            var parallel = new enchant.tl.ParallelAction();
            parallel.actions.push(last)
            this.queue.push(parallel);
            this._parallel = parallel;
        }
        return this;
    },
    /**
     * @ignore
     */
    or: function(){
        return this;
    },
    /**
     * @ignore
     */
    doAll: function(children){
        return this;
    },
    /**
     * @ignore
     */
    waitAll: function(){
        return this;
    },
    /**
     * true値 が返るまで、関数を毎フレーム実行するアクションを追加する。
     * @example
     * sprite.tl.waitUntil(function(){
     *    return this.x-- < 0
     * }).then(function(){ .. });
     * // x 座標が負になるまで毎フレーム x座標を減算し続ける
     *
     * @param func 実行したい関数
     */
    waitUntil: function(func){
        var timeline = this;
        this.add(new enchant.tl.Action({
                    onactionstart: func,
                    onactiontick: function(func){
                        if(func.call(this)){
                            timeline.next();
                        }
                    }
                }));
        return this;
    },
    /**
     * Entity の不透明度をなめらかに変えるアクションを追加する。
     * @param opacity 目標の不透明度
     * @param time フレーム数
     * @param [easing] イージング関数
     */
    fadeTo: function(opacity, time, easing){
        this.tween({
            opacity: opacity,
            time: time,
            easing: easing
        });
        return this;
    },
    /**
     * Entity をフェードインするアクションを追加する。
     * fadeTo(1) のエイリアス。
     * @param time フレーム数
     * @param [easing] イージング関数
     */
    fadeIn: function(time, easing){
        return this.fadeTo(1, time, easing);
    },
    /**
     * Entity をフェードアウトするアクションを追加する。
     * fadeTo(1) のエイリアス。
     * @param time フレーム数
     * @param [easing] イージング関数
     */
    fadeOut: function(time, easing){
        return this.fadeTo(0, time, easing);
    },
    /**
     * Entity の位置をなめらかに移動させるアクションを追加する。
     * @param x 目標のx座標
     * @param y 目標のy座標
     * @param time フレーム数
     * @param [easing] イージング関数
     */
    moveTo: function(x, y, time, easing){
        return this.tween({
            x: x,
            y: y,
            time: time,
            easing: easing
        });
    },
    /**
     * Entity のx座標をなめらかに変化させるアクションを追加する。
     * @param x
     * @param time
     * @param [easing]
     */
    moveX: function(x, time, easing){
        return this.tween({
            x: x,
            time: time,
            easing: easing
        });
    },
    /**
     * Entity のy座標をなめらかに変化させるアクションを追加する。
     * @param y
     * @param time
     * @param [easing]
     */
    moveY: function(y, time, easing){
        return this.tween({
            y: y,
            time: time,
            easing: easing
        });
    },
    /**
     * Entity の位置をなめらかに変化させるアクションを追加する。
     * 座標は、アクション開始時からの相対座標で指定する。
     * @param x
     * @param y
     * @param time
     * @param [easing]
     */
    moveBy: function(x, y, time, easing){
        return this.tween({
            x: function(){ return this.x + x },
            y: function(){ return this.y + y },
            time: time,
            easing: easing
        });
    },
    /**
     * Entity の opacity を0にする (即時)
     */
    hide: function(){
        return this.then(function(){
            this.opacity = 0;
        });
    },
    /**
     * Entity の opacity を1にする (即時)
     */
    show: function(){
        return this.then(function(){
            this.opacity = 1;
        });
    },
    /**
     * Entity をシーンから削除する。
     * シーンから削除された場合、 enterframe イベントは呼ばれなくなるので、
     * タイムラインも止まることに注意。
     * これ以降のアクションは、再度シーンに追加されるまで実行されない。
     */
    removeFromScene: function(){
        return this.then(function(){
            this.scene.removeChild(this);
        });
    },
    /**
     * Entity をなめらかに拡大・縮小するアクションを追加する。
     * @param scale 相対縮尺
     * @param time
     * @param [easing]
     */
    scaleTo: function(scale, time, easing){
        return this.tween({
            scaleX: scale,
            scaleY: scale,
            time: time,
            easing: easing
        });
    },
    /**
     * Entity をなめらかに拡大・縮小させるアクションを追加する。
     * 相対縮尺 (ex. アクション開始時の縮尺の n 倍) で指定する。
     * @param scale 相対縮尺
     * @param time
     * @param [easing]
     */
    scaleBy: function(scale, time, easing){
        return this.tween({
            scaleX: function(){ return this.scaleX * scale },
            scaleY: function(){ return this.scaleY * scale },
            time: time,
            easing: easing
        })
    },
    /**
     * Entity をなめらかに回転させるアクションを追加する。
     * @param deg 目標の回転角度 (弧度法: 1回転を 360 とする)
     * @param time フレーム数
     * @param [easing] イージング関数
     */
    rotateTo: function(deg, time, easing){
        return this.tween({
            rotation: deg,
            time: time,
            easing: easing
        });
    },
    /**
     * Entity をなめらかに回転させるアクションを追加する。
     * 角度は相対角度 (アクション開始時の角度から更に n 度) で指定する
     * @param deg 目標の相対角度 (弧度法: 1回転を 360 とする)
     * @param time フレーム数
     * @param [easing] イージング関数
     */
    rotateBy: function(deg, time, easing){
        return this.tween({
            rotation: function(){ return this.rotation + deg },
            time: time,
            easing: easing
        })
    }});

/**
 * ============================================================================================
 * Easing Equations v2.0
 * September 1, 2003
 * (c) 2003 Robert Penner, all rights reserved.
 * This work is subject to the terms in http://www.robertpenner.com/easing_terms_of_use.html.
 * ============================================================================================
 */

/**
 * イージング関数ライブラリ
 * ActionScript で広く使われている
 * Robert Penner による Easing Equations を JavaScript に移植した。
 * @scope enchant.Easing
 */
enchant.Easing = {
    LINEAR: function (t, b, c, d) {
        return c * t / d + b;
    },
    // quad
    QUAD_EASEIN: function (t, b, c, d) {
        return c * (t /= d) * t + b;
    },
    QUAD_EASEOUT: function (t, b, c, d) {
        return -c * (t /= d) * (t - 2) + b;
    },
    QUAD_EASEINOUT: function (t, b, c, d) {
        if((t /= d / 2) < 1) return c / 2 * t * t + b;
        return -c / 2 * ((--t) * (t - 2) - 1) + b;
    },
    // cubic
    CUBIC_EASEIN: function (t, b, c, d) {
        return c * (t /= d) * t * t + b;
    },
    CUBIC_EASEOUT: function (t, b, c, d) {
        return c * ((t = t / d - 1) * t * t + 1) + b;
    },
    CUBIC_EASEINOUT: function (t, b, c, d) {
        if((t /= d / 2) < 1) return c / 2 * t * t * t + b;
        return c / 2 * ((t -= 2) * t * t + 2) + b;
    },
    // quart
    QUART_EASEIN: function (t, b, c, d) {
        return c * (t /= d) * t * t * t + b;
    },
    QUART_EASEOUT: function (t, b, c, d) {
        return -c * ((t = t / d - 1) * t * t * t - 1) + b;
    },
    QUART_EASEINOUT: function (t, b, c, d) {
        if((t /= d / 2) < 1) return c / 2 * t * t * t * t + b;
        return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
    },
    // quint
    QUINT_EASEIN: function (t, b, c, d) {
        return c * (t /= d) * t * t * t * t + b;
    },
    QUINT_EASEOUT: function (t, b, c, d) {
        return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
    },
    QUINT_EASEINOUT: function (t, b, c, d) {
        if((t /= d / 2) < 1) return c / 2 * t * t * t * t * t + b;
        return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
    },
    //sin
    SIN_EASEIN: function (t, b, c, d) {
        return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
    },
    SIN_EASEOUT: function (t, b, c, d) {
        return c * Math.sin(t / d * (Math.PI / 2)) + b;
    },
    SIN_EASEINOUT: function (t, b, c, d) {
        return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
    },
    // circ
    CIRC_EASEIN: function (t, b, c, d) {
        return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
    },
    CIRC_EASEOUT: function (t, b, c, d) {
        return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
    },
    CIRC_EASEINOUT: function (t, b, c, d) {
        if((t /= d / 2) < 1) return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
        return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
    },
    // elastic
    ELASTIC_EASEIN: function (t, b, c, d, a, p) {
        if(t == 0) return b;
        if((t /= d) == 1) return b + c;
        if(!p) p = d * .3;
        if(!a || a < Math.abs(c)) {
            a = c;
            var s = p / 4;
        }
        else var s = p / (2 * Math.PI) * Math.asin(c / a);
        return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
    },
    ELASTIC_EASEOUT: function (t, b, c, d, a, p) {
        if(t == 0) return b;
        if((t /= d) == 1) return b + c;
        if(!p) p = d * .3;
        if(!a || a < Math.abs(c)) {
            a = c;
            var s = p / 4;
        }
        else var s = p / (2 * Math.PI) * Math.asin(c / a);
        return (a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b);
    },
    ELASTIC_EASEINOUT: function (t, b, c, d, a, p) {
        if(t == 0) return b;
        if((t /= d / 2) == 2) return b + c;
        if(!p) p = d * (.3 * 1.5);
        if(!a || a < Math.abs(c)) {
            a = c;
            var s = p / 4;
        }
        else var s = p / (2 * Math.PI) * Math.asin(c / a);
        if(t < 1) return -.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
        return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * .5 + c + b;
    },
    // bounce
    BOUNCE_EASEOUT: function (t, b, c, d) {
        if((t /= d) < (1 / 2.75)) {
            return c * (7.5625 * t * t) + b;
        } else if(t < (2 / 2.75)) {
            return c * (7.5625 * (t -= (1.5 / 2.75)) * t + .75) + b;
        } else if(t < (2.5 / 2.75)) {
            return c * (7.5625 * (t -= (2.25 / 2.75)) * t + .9375) + b;
        } else {
            return c * (7.5625 * (t -= (2.625 / 2.75)) * t + .984375) + b;
        }
    },
    BOUNCE_EASEIN: function (t, b, c, d) {
        return c - enchant.Easing.BOUNCE_EASEOUT(d - t, 0, c, d) + b;
    },
    BOUNCE_EASEINOUT: function (t, b, c, d) {
        if(t < d / 2) return enchant.Easing.BOUNCE_EASEIN(t * 2, 0, c, d) * .5 + b;
        else return enchant.Easing.BOUNCE_EASEOUT(t * 2 - d, 0, c, d) * .5 + c * .5 + b;
    },
    // back
    BACK_EASEIN: function (t, b, c, d, s) {
        if(s == undefined) s = 1.70158;
        return c * (t /= d) * t * ((s + 1) * t - s) + b;
    },
    BACK_EASEOUT: function (t, b, c, d, s) {
        if(s == undefined) s = 1.70158;
        return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
    },
    BACK_EASEINOUT: function (t, b, c, d, s) {
        if(s == undefined) s = 1.70158;
        if((t /= d / 2) < 1) return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
        return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
    },
    // expo
    EXPO_EASEIN: function (t, b, c, d) {
        return (t == 0) ? b : c * Math.pow(2, 10 * (t / d - 1)) + b;
    },
    EXPO_EASEOUT: function (t, b, c, d) {
        return (t == d) ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b;
    },
    EXPO_EASEINOUT: function (t, b, c, d) {
        if(t == 0) return b;
        if(t == d) return b + c;
        if((t /= d / 2) < 1) return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
        return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
    }
};

/**
 * Easing Equations v2.0
 */
