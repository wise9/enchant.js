/**
 * @scope enchant.Timeline.prototype
 */
enchant.Timeline = enchant.Class.create(enchant.EventTarget, {
    /**
     * @name enchant.Timeline
     * @class
     [lang:ja]
     * アニメーションを管理するためのクラス.
     *
     * 操作するノードひとつに対して, 必ずひとつのタイムラインが対応する.
     * タイムラインクラスは, 自身に様々なアクションを追加するメソッドを持っており,
     * これらを使うことで簡潔にアニメーションや様々な操作をすることができる.
     * タイムラインクラスはフレームとタイムのアニメーションができる.
     * @param {enchant.Node} node 操作の対象となるノード.
     [/lang]
     [lang:en]
     * Time-line class.
     * Class for managing the action.
     *
     * For one node to manipulate the timeline of one must correspond.
     * Time-line class has a method to add a variety of actions to himself,
     * entities can be animated and various operations by using these briefly.
     * You can choose time based and frame based(default) animation.
     * @param {enchant.Node} node target node.
     [/lang]
     [lang:de]
     * @param {enchant.Node} node
     [/lang]
     * @constructs
     * @extends enchant.EventTarget
     */
    initialize: function(node) {
        enchant.EventTarget.call(this);
        this.node = node;
        this.queue = [];
        this.paused = false;
        this.looped = false;
        this.isFrameBased = true;
        this._parallel = null;
        this._activated = false;
        this.addEventListener(enchant.Event.ENTER_FRAME, this.tick);
    },
    /**
     * @private
     */
    _deactivateTimeline: function() {
        if (this._activated) {
            this._activated = false;
            this.node.removeEventListener('enterframe', this._nodeEventListener);
        }
    },
    /**
     * @private
     */
    _activateTimeline: function() {
        if (!this._activated && !this.paused) {
            this.node.addEventListener("enterframe", this._nodeEventListener);
            this._activated = true;
        }
    },
    /**
     [lang:ja]
     * 一つのenchant.Event.ENTER_FRAMEイベントはアニメーションに一つの時間単位になる. （デフォルト）
     [/lang]
     [lang:en]
     [/lang]
     [lang:de]
     [/lang]
     */
    setFrameBased: function() {
        this.isFrameBased = true;
    },
    /**
     [lang:ja]
     * 一つのenchant.Event.ENTER_FRAMEイベントはアニメーションに前のフレームから経過した時間になる.
     [/lang]
     [lang:en]
     [/lang]
     [lang:de]
     [/lang]
     */
    setTimeBased: function() {
        this.isFrameBased = false;
    },
    /**
     [lang:ja]
     * キューの先頭にあるアクションを終了し, 次のアクションへ移行する.
     * アクションの中から呼び出されるが, 外から呼び出すこともできる.
     *
     * アクション実行中に, アクションが終了した場合,
     * もう一度 tick() 関数が呼ばれるため, 1フレームに複数のアクションが処理される場合もある.
     *
     * @example
     * sprite.tl.then(function A(){ .. }).then(function B(){ .. });
     * // 最初のフレームで A・B の関数どちらも実行される.
     [/lang]
     [lang:en]
     [/lang]
     [lang:de]
     [/lang]
     */
    next: function(remainingTime) {
        var e, action = this.queue.shift();

        if (action) {
            e = new enchant.Event("actionend");
            e.timeline = this;
            action.dispatchEvent(e);
        }

        if (this.queue.length === 0) {
            this._activated = false;
            this.node.removeEventListener('enterframe', this._nodeEventListener);
            return;
        }

        if (this.looped) {
            e = new enchant.Event("removedfromtimeline");
            e.timeline = this;
            action.dispatchEvent(e);
            action.frame = 0;

            this.add(action);
        } else {
            // remove after dispatching removedfromtimeline event
            e = new enchant.Event("removedfromtimeline");
            e.timeline = this;
            action.dispatchEvent(e);
        }
        if (remainingTime > 0 || (this.queue[0] && this.queue[0].time === 0)) {
            var event = new enchant.Event("enterframe");
            event.elapsed = remainingTime;
            this.dispatchEvent(event);
        }
    },
    /**
     [lang:ja]
     * 自身のenterframeイベントのリスナとして登録される関数.
     * 1フレーム経過する際に実行する処理が書かれている.
     * (キューの先頭にあるアクションに対して, actionstart/actiontickイベントを発行する)
     * @param {enchant.Event} enterFrameEvent enterframeイベント.
     [/lang]
     [lang:en]
     * @param {enchant.Event} enterFrameEvent
     [/lang]
     [lang:de]
     * @param {enchant.Event} enterFrameEvent
     [/lang]
     */
    tick: function(enterFrameEvent) {
        if (this.paused) {
            return;
        }
        if (this.queue.length > 0) {
            var action = this.queue[0];
            if (action.frame === 0) {
                var f;
                f = new enchant.Event("actionstart");
                f.timeline = this;
                action.dispatchEvent(f);
            }

            var e = new enchant.Event("actiontick");
            e.timeline = this;
            if (this.isFrameBased) {
                e.elapsed = 1;
            } else {
                e.elapsed = enterFrameEvent.elapsed;
            }
            action.dispatchEvent(e);
        }
    },
    /**
     [lang:ja]
     * タイムラインにアクションを追加する.
     * @param {enchant.Action} action 追加するアクション.
     * @return {enchant.Timeline} 自身.
     [/lang]
     [lang:en]
     * @param {enchant.Action} action
     * @return {enchant.Timeline}
     [/lang]
     [lang:de]
     * @param {enchant.Action} action
     * @return {enchant.Timeline}
     [/lang]
     */
    add: function(action) {
        if (!this._activated) {
            var tl = this;
            this._nodeEventListener = function(e) {
                tl.dispatchEvent(e);
            };
            this.node.addEventListener("enterframe", this._nodeEventListener);

            this._activated = true;
        }
        if (this._parallel) {
            this._parallel.actions.push(action);
            this._parallel = null;
        } else {
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
     [lang:ja]
     * アクションを簡単に追加するためのメソッド.
     * 実体は {@link enchant.Timeline#add} のラッパ.
     * @param {Object} params アクションの設定オブジェクト.
     * @return {enchant.Timeline} 自身.
     [/lang]
     [lang:en]
     * @param {Object} params
     * @return {enchant.Timeline}
     [/lang]
     [lang:de]
     * @param {Object} params
     * @return {enchant.Timeline}
     [/lang]
     */
    action: function(params) {
        return this.add(new enchant.Action(params));
    },
    /**
     [lang:ja]
     * トゥイーンを簡単に追加するためのメソッド.
     * 実体は {@link enchant.Timeline#add} のラッパ.
     * @param {Object} params トゥイーンの設定オブジェクト.
     * @return {enchant.Timeline} 自身.
     [/lang]
     [lang:en]
     * @param {Object} params
     * @return {enchant.Timeline}
     [/lang]
     [lang:de]
     * @param {Object} params
     * @return {enchant.Timeline}
     [/lang]
     */
    tween: function(params) {
        return this.add(new enchant.Tween(params));
    },
    /**
     [lang:ja]
     * タイムラインのキューをすべて破棄する. 終了イベントは発行されない.
     * @return {enchant.Timeline} 自身.
     [/lang]
     [lang:en]
     * @return {enchant.Timeline}
     [/lang]
     [lang:de]
     * @return {enchant.Timeline}
     [/lang]
     */
    clear: function() {
        var e = new enchant.Event("removedfromtimeline");
        e.timeline = this;

        for (var i = 0, len = this.queue.length; i < len; i++) {
            this.queue[i].dispatchEvent(e);
        }
        this.queue = [];
        this._deactivateTimeline();
        return this;
    },
    /**
     [lang:ja]
     * タイムラインを早送りする.
     * 指定したフレーム数が経過したのと同様の処理を, 瞬時に実行する.
     * 巻き戻しはできない.
     * @param {Number} frames スキップするフレーム数.
     * @return {enchant.Timeline} 自身.
     [/lang]
     [lang:en]
     * @param {Number} frames
     * @return {enchant.Timeline}
     [/lang]
     [lang:de]
     * @param {Number} frames
     * @return {enchant.Timeline}
     [/lang]
     */
    skip: function(frames) {
        var event = new enchant.Event("enterframe");
        if (this.isFrameBased) {
            event.elapsed = 1;
        } else {
            event.elapsed = frames;
            frames = 1;
        }
        while (frames--) {
            this.dispatchEvent(event);
        }
        return this;
    },
    /**
     [lang:ja]
     * タイムラインの実行を一時停止する.
     * @return {enchant.Timeline} 自身.
     [/lang]
     [lang:en]
     * @return {enchant.Timeline}
     [/lang]
     [lang:de]
     * @return {enchant.Timeline}
     [/lang]
     */
    pause: function() {
        if (!this.paused) {
            this.paused = true;
            this._deactivateTimeline();
        }
        return this;
    },
    /**
     [lang:ja]
     * タイムラインの実行を再開する.
     * @return {enchant.Timeline} 自身.
     [/lang]
     [lang:en]
     * @return {enchant.Timeline}
     [/lang]
     [lang:de]
     * @return {enchant.Timeline}
     [/lang]
     */
    resume: function() {
        if (this.paused) {
            this.paused = false;
            this._activateTimeline();
        }
        return this;
    },
    /**
     [lang:ja]
     * タイムラインをループさせる.
     * ループしているときに終了したアクションは, タイムラインから取り除かれた後,
     * 再度タイムラインに追加される. このアクションは, ループが解除されても残る.
     * @return {enchant.Timeline} 自身.
     [/lang]
     [lang:en]
     * @return {enchant.Timeline}
     [/lang]
     [lang:de]
     * @return {enchant.Timeline}
     [/lang]
     */
    loop: function() {
        this.looped = true;
        return this;
    },
    /**
     [lang:ja]
     * タイムラインのループを解除する.
     * @return {enchant.Timeline} 自身.
     [/lang]
     [lang:en]
     * @return {enchant.Timeline}
     [/lang]
     [lang:de]
     * @return {enchant.Timeline}
     [/lang]
     */
    unloop: function() {
        this.looped = false;
        return this;
    },
    /**
     [lang:ja]
     * 指定したフレーム数だけ待ち, 何もしないアクションを追加する.
     * @param {Number} time 待機するフレーム数.
     * @return {enchant.Timeline} 自身.
     [/lang]
     [lang:en]
     * @param {Number} time
     * @return {enchant.Timeline}
     [/lang]
     [lang:de]
     * @param {Number} time
     * @return {enchant.Timeline}
     [/lang]
     */
    delay: function(time) {
        this.add(new enchant.Action({
            time: time
        }));
        return this;
    },
    /**
     * @ignore
     * @param {Number} time
     */
    wait: function(time) {
        // reserved
        return this;
    },
    /**
     [lang:ja]
     * 関数を実行し, 即時に次のアクションに移るアクションを追加する.
     * @param {Function} func 実行する関数.
     * @return {enchant.Timeline} 自身.
     [/lang]
     [lang:en]
     * @param {Function} func
     * @return {enchant.Timeline}
     [/lang]
     [lang:de]
     * @param {Function} func
     * @return {enchant.Timeline}
     [/lang]
     */
    then: function(func) {
        var timeline = this;
        this.add(new enchant.Action({
            onactiontick: function(evt) {
                func.call(timeline.node);
            },
            // if time is 0, next action will be immediately executed
            time: 0
        }));
        return this;
    },
    /**
     [lang:ja]
     * 関数を実行し, 即時に次のアクションに移るアクションを追加する.
     * {@link enchant.Timeline#then} のシノニム.
     * @param {Function} func 実行する関数.
     * @return {enchant.Timeline} 自身.
     [/lang]
     [lang:en]
     * @param {Function} func
     * @return {enchant.Timeline}
     [/lang]
     [lang:de]
     * @param {Function} func
     * @return {enchant.Timeline}
     [/lang]
     */
    exec: function(func) {
        this.then(func);
    },
    /**
     [lang:ja]
     * 実行したい関数を, フレーム数をキーとした連想配列(オブジェクト)で複数指定し追加する.
     * 内部的には {@link enchant.Timeline#delay}, {@link enchant.Timeline#then} を用いている.
     *
     * @example
     * sprite.tl.cue({
     *     10: function() {}, // 10フレーム経過した後に実行される関数
     *     20: function() {}, // 20フレーム経過した後に実行される関数
     *     30: function() {}  // 30フレーム経過した後に実行される関数
     * });
     *
     * @param {Object} cue キューオブジェクト.
     * @return {enchant.Timeline} 自身.
     [/lang]
     [lang:en]
     * @param {Object} cue
     * @return {enchant.Timeline}
     [/lang]
     [lang:de]
     * @param {Object} cue
     * @return {enchant.Timeline}
     [/lang]
     */
    cue: function(cue) {
        var ptr = 0;
        for (var frame in cue) {
            if (cue.hasOwnProperty(frame)) {
                this.delay(frame - ptr);
                this.then(cue[frame]);
                ptr = frame;
            }
        }
    },
    /**
     [lang:ja]
     * ある関数を指定したフレーム数繰り返し実行するアクションを追加する.
     * @param {Function} func 実行したい関数.
     * @param {Number} time 持続フレーム数.
     * @return {enchant.Timeline} 自身.
     [/lang]
     [lang:en]
     * @param {Function} func
     * @param {Number} time
     * @return {enchant.Timeline}
     [/lang]
     [lang:de]
     * @param {Function} func
     * @param {Number} time
     * @return {enchant.Timeline}
     [/lang]
     */
    repeat: function(func, time) {
        this.add(new enchant.Action({
            onactiontick: function(evt) {
                func.call(this);
            },
            time: time
        }));
        return this;
    },
    /**
     [lang:ja]
     * 複数のアクションを並列で実行したいときに指定する.
     * and で結ばれたすべてのアクションが終了するまで次のアクションには移行しない.
     *
     * @example
     * sprite.tl.fadeIn(30).and().rotateBy(360, 30);
     *
     * // 30フレームでフェードインしながら360度回転する.
     * @return {enchant.Timeline} 自身.
     [/lang]
     [lang:en]
     * @return {enchant.Timeline}
     [/lang]
     [lang:de]
     * @return {enchant.Timeline}
     [/lang]
     */
    and: function() {
        var last = this.queue.pop();
        if (last instanceof enchant.ParallelAction) {
            this._parallel = last;
            this.queue.push(last);
        } else {
            var parallel = new enchant.ParallelAction();
            parallel.actions.push(last);
            this.queue.push(parallel);
            this._parallel = parallel;
        }
        return this;
    },
    /**
     * @ignore
     */
    or: function() {
        return this;
    },
    /**
     * @ignore
     */
    doAll: function(children) {
        return this;
    },
    /**
     * @ignore
     */
    waitAll: function() {
        return this;
    },
    /**
     [lang:ja]
     * trueが返るまで, 関数を毎フレーム実行するアクションを追加する.
     *
     * @example
     * sprite.tl.waitUntil(function() {
     *     return --this.x < 0;
     * }).then(function(){ .. });
     * // x座標が負になるまで毎フレームx座標を減算し続ける.
     *
     * @param {Function} func 条件とする関数.
     * @return {enchant.Timeline} 自身.
     [/lang]
     [lang:en]
     * @param {Function} func
     * @return {enchant.Timeline}
     [/lang]
     [lang:de]
     * @param {Function} func
     * @return {enchant.Timeline}
     [/lang]
     */
    waitUntil: function(func) {
        var timeline = this;
        this.add(new enchant.Action({
            onactionstart: func,
            onactiontick: function(evt) {
                if (func.call(this)) {
                    timeline.next();
                }
            }
        }));
        return this;
    },
    /**
     [lang:ja]
     * Entityの不透明度をなめらかに変えるアクションを追加する.
     * @param {Number} opacity 目標の不透明度.
     * @param {Number} time フレーム数.
     * @param {Function} [easing=enchant.Easing.LINEAR] イージング関数.
     * @return {enchant.Timeline} 自身.
     [/lang]
     [lang:en]
     * @param {Number} opacity
     * @param {Number} time
     * @param {Function} [easing=enchant.Easing.LINEAR]
     * @return {enchant.Timeline}
     [/lang]
     [lang:de]
     * @param {Number} opacity
     * @param {Number} time
     * @param {Function} [easing=enchant.Easing.LINEAR]
     * @return {enchant.Timeline}
     [/lang]
     */
    fadeTo: function(opacity, time, easing) {
        this.tween({
            opacity: opacity,
            time: time,
            easing: easing
        });
        return this;
    },
    /**
     [lang:ja]
     * Entityをフェードインするアクションを追加する.
     * fadeTo(1, time, easing) のエイリアス.
     * @param {Number} time フレーム数.
     * @param {Function} [easing=enchant.Easing.LINEAR] イージング関数.
     * @return {enchant.Timeline} 自身.
     [/lang]
     [lang:en]
     * @param {Number} time
     * @param {Function} [easing=enchant.Easing.LINEAR]
     * @return {enchant.Timeline}
     [/lang]
     [lang:de]
     * @param {Number} time
     * @param {Function} [easing=enchant.Easing.LINEAR]
     * @return {enchant.Timeline}
     [/lang]
     */
    fadeIn: function(time, easing) {
        return this.fadeTo(1, time, easing);
    },
    /**
     [lang:ja]
     * Entityをフェードアウトするアクションを追加する.
     * fadeTo(1, time, easing) のエイリアス.
     * @param {Number} time フレーム数.
     * @param {Function} [easing=enchant.Easing.LINEAR] イージング関数.
     * @return {enchant.Timeline} 自身.
     [/lang]
     [lang:en]
     * @param {Number} time
     * @param {Function} [easing=enchant.Easing.LINEAR]
     * @return {enchant.Timeline}
     [/lang]
     [lang:de]
     * @param {Number} time
     * @param {Function} [easing=enchant.Easing.LINEAR]
     * @return {enchant.Timeline}
     [/lang]
     */
    fadeOut: function(time, easing) {
        return this.fadeTo(0, time, easing);
    },
    /**
     [lang:ja]
     * Entityの位置をなめらかに移動させるアクションを追加する.
     * @param {Number} x 目標のx座標.
     * @param {Number} y 目標のy座標.
     * @param {Number} time フレーム数.
     * @param {Function} [easing=enchant.Easing.LINEAR] イージング関数.
     * @return {enchant.Timeline} 自身.
     [/lang]
     [lang:en]
     * @param {Number} x
     * @param {Number} y
     * @param {Number} time
     * @param {Function} [easing=enchant.Easing.LINEAR]
     * @return {enchant.Timeline}
     [/lang]
     [lang:de]
     * @param {Number} x
     * @param {Number} y
     * @param {Number} time
     * @param {Function} [easing=enchant.Easing.LINEAR]
     * @return {enchant.Timeline}
     [/lang]
     */
    moveTo: function(x, y, time, easing) {
        return this.tween({
            x: x,
            y: y,
            time: time,
            easing: easing
        });
    },
    /**
     [lang:ja]
     * Entityのx座標をなめらかに移動させるアクションを追加する.
     * @param {Number} x 目標のx座標.
     * @param {Number} time フレーム数.
     * @param {Function} [easing=enchant.Easing.LINEAR] イージング関数.
     * @return {enchant.Timeline} 自身.
     [/lang]
     [lang:en]
     * @param {Number} x
     * @param {Number} time
     * @param {Function} [easing=enchant.Easing.LINEAR]
     * @return {enchant.Timeline}
     [/lang]
     [lang:de]
     * @param {Number} x
     * @param {Number} time
     * @param {Function} [easing=enchant.Easing.LINEAR]
     * @return {enchant.Timeline}
     [/lang]
     */
    moveX: function(x, time, easing) {
        return this.tween({
            x: x,
            time: time,
            easing: easing
        });
    },
    /**
     [lang:ja]
     * Entityのy座標をなめらかに移動させるアクションを追加する.
     * @param {Number} y 目標のy座標.
     * @param {Number} time フレーム数.
     * @param {Function} [easing=enchant.Easing.LINEAR] イージング関数.
     * @return {enchant.Timeline} 自身.
     [/lang]
     [lang:en]
     * @param {Number} y
     * @param {Number} time
     * @param {Function} [easing=enchant.Easing.LINEAR]
     * @return {enchant.Timeline}
     [/lang]
     [lang:de]
     * @param {Number} y
     * @param {Number} time
     * @param {Function} [easing=enchant.Easing.LINEAR]
     * @return {enchant.Timeline}
     [/lang]
     */
    moveY: function(y, time, easing) {
        return this.tween({
            y: y,
            time: time,
            easing: easing
        });
    },
    /**
     [lang:ja]
     * Entityの位置をなめらかに変化させるアクションを追加する.
     * 座標は, アクション開始時からの相対座標で指定する.
     * @param {Number} x x軸方向の移動量.
     * @param {Number} y y軸方向の移動量.
     * @param {Number} time フレーム数.
     * @param {Function} [easing=enchant.Easing.LINEAR] イージング関数.
     * @return {enchant.Timeline} 自身.
     [/lang]
     [lang:en]
     * @param {Number} x
     * @param {Number} y
     * @param {Number} time
     * @param {Function} [easing=enchant.Easing.LINEAR]
     * @return {enchant.Timeline}
     [/lang]
     [lang:de]
     * @param {Number} x
     * @param {Number} y
     * @param {Number} time
     * @param {Function} [easing=enchant.Easing.LINEAR]
     * @return {enchant.Timeline}
     [/lang]
     */
    moveBy: function(x, y, time, easing) {
        return this.tween({
            x: function() {
                return this.x + x;
            },
            y: function() {
                return this.y + y;
            },
            time: time,
            easing: easing
        });
    },
    /**
     [lang:ja]
     * Entityの不透明度を0にする. (即時)
     * @return {enchant.Timeline} 自身.
     [/lang]
     [lang:en]
     * @return {enchant.Timeline}
     [/lang]
     [lang:de]
     * @return {enchant.Timeline}
     [/lang]
     */
    hide: function() {
        return this.then(function() {
            this.opacity = 0;
        });
    },
    /**
     [lang:ja]
     * Entityの不透明度を1にする. (即時)
     * @return {enchant.Timeline} 自身.
     [/lang]
     [lang:en]
     * @return {enchant.Timeline}
     [/lang]
     [lang:de]
     * @return {enchant.Timeline}
     [/lang]
     */
    show: function() {
        return this.then(function() {
            this.opacity = 1;
        });
    },
    /**
     [lang:ja]
     * Entityをシーンから削除する.
     * シーンから削除された場合,  enterframe イベントは呼ばれなくなるので,
     * タイムラインも止まることに注意.
     * これ以降のアクションは, 再度シーンに追加されるまで実行されない.
     * @return {enchant.Timeline} 自身.
     [/lang]
     [lang:en]
     * @return {enchant.Timeline}
     [/lang]
     [lang:de]
     * @return {enchant.Timeline}
     [/lang]
     */
    removeFromScene: function() {
        return this.then(function() {
            this.scene.removeChild(this);
        });
    },
    /**
     [lang:ja]
     * Entityをなめらかに拡大・縮小するアクションを追加する.
     * @param {Number} scaleX x軸方向の縮尺.
     * @param {Number} [scaleY] y軸方向の縮尺. 省略した場合 scaleX と同じ.
     * @param {Number} time フレーム数.
     * @param {Function} [easing=enchant.Easing.LINEAR]
     * @return {enchant.Timeline} 自身.
     [/lang]
     [lang:en]
     * @param {Number} scaleX
     * @param {Number} [scaleY]
     * @param {Number} time
     * @param {Function} [easing=enchant.Easing.LINEAR]
     * @return {enchant.Timeline}
     [/lang]
     [lang:de]
     * @param {Number} scaleX
     * @param {Number} [scaleY]
     * @param {Number} time
     * @param {Function} [easing=enchant.Easing.LINEAR]
     * @return {enchant.Timeline}
     [/lang]
     */
    scaleTo: function(scale, time, easing) {
        if (typeof easing === "number") {
            return this.tween({
                scaleX: arguments[0],
                scaleY: arguments[1],
                time: arguments[2],
                easing: arguments[3]
            });
        }
        return this.tween({
            scaleX: scale,
            scaleY: scale,
            time: time,
            easing: easing
        });
    },
    /**
     [lang:ja]
     * Entityをなめらかに拡大・縮小させるアクションを追加する.
     * 相対縮尺 (アクション開始時の縮尺のn倍) で指定する.
     * @param {Number} scaleX x軸方向の相対縮尺.
     * @param {Number} [scaleY] y軸方向の相対縮尺. 省略した場合 scaleX と同じ.
     * @param {Number} time フレーム数.
     * @param {Function} [easing=enchant.Easing.LINEAR] イージング関数.
     * @return {enchant.Timeline} 自身.
     [/lang]
     [lang:en]
     * @param {Number} scaleX
     * @param {Number} [scaleY]
     * @param {Number} time
     * @param {Function} [easing=enchant.Easing.LINEAR]
     * @return {enchant.Timeline}
     [/lang]
     [lang:de]
     * @param {Number} scaleX
     * @param {Number} [scaleY]
     * @param {Number} time
     * @param {Function} [easing=enchant.Easing.LINEAR]
     * @return {enchant.Timeline}
     [/lang]
     */
    scaleBy: function(scale, time, easing) {
        if (typeof easing === "number") {
            return this.tween({
                scaleX: function() {
                    return this.scaleX * arguments[0];
                },
                scaleY: function() {
                    return this.scaleY * arguments[1];
                },
                time: arguments[2],
                easing: arguments[3]
            });
        }
        return this.tween({
            scaleX: function() {
                return this.scaleX * scale;
            },
            scaleY: function() {
                return this.scaleY * scale;
            },
            time: time,
            easing: easing
        });
    },
    /**
     [lang:ja]
     * Entityをなめらかに回転させるアクションを追加する.
     * @param {Number} deg 目標の回転角度. (度数法)
     * @param {Number} time フレーム数.
     * @param {Function} [easing=enchant.Easing.LINEAR] イージング関数.
     * @return {enchant.Timeline} 自身.
     [/lang]
     [lang:en]
     * @param {Number} deg
     * @param {Number} time
     * @param {Function} [easing=enchant.Easing.LINEAR]
     * @return {enchant.Timeline}
     [/lang]
     [lang:de]
     * @param {Number} deg
     * @param {Number} time
     * @param {Function} [easing=enchant.Easing.LINEAR]
     * @return {enchant.Timeline}
     [/lang]
     */
    rotateTo: function(deg, time, easing) {
        return this.tween({
            rotation: deg,
            time: time,
            easing: easing
        });
    },
    /**
     [lang:ja]
     * Entityをなめらかに回転させるアクションを追加する.
     * 角度は相対角度 (アクション開始時の角度から更にn度) で指定する.
     * @param {Number} deg 目標の相対角度. (度数法)
     * @param {Number} time フレーム数.
     * @param {Function} [easing=enchant.Easing.LINEAR] イージング関数.
     * @return {enchant.Timeline} 自身.
     [/lang]
     [lang:en]
     * @param {Number} deg
     * @param {Number} time
     * @param {Function} [easing=enchant.Easing.LINEAR]
     * @return {enchant.Timeline}
     [/lang]
     [lang:de]
     * @param {Number} deg
     * @param {Number} time
     * @param {Function} [easing=enchant.Easing.LINEAR]
     * @return {enchant.Timeline}
     [/lang]
     */
    rotateBy: function(deg, time, easing) {
        return this.tween({
            rotation: function() {
                return this.rotation + deg;
            },
            time: time,
            easing: easing
        });
    }
});
