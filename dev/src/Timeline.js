/**
 * @scope enchant.Timeline.prototype
 */
enchant.Timeline = enchant.Class.create(enchant.EventTarget, {
    /**
     * タイムラインクラス。
     * アクションを管理するためのクラス。
     * 操作するノードひとつに対して、必ずひとつのタイムラインが対応する。
     *
     * tl.enchant.js を読み込むと、Node クラスを継承したすべてのクラス (Group, Scene, Entity, Label, Sprite)の
     * tl プロパティに、タイムラインクラスのインスタンスが生成される。
     * タイムラインクラスは、自身に様々なアクションを追加するメソッドを持っており、
     * これらを使うことで簡潔にアニメーションや様々な操作をすることができる。
     * タイムラインクラスはフレームとタイムのアニメーションができる。
     *
     * @constructs
     * @param node 操作の対象となるノード
     * @param [unitialized] このパラメータはtrueだったら、
     * 最初のaddメソッド呼ぶ時nodeにenchant.Event.ENTER_FRAMEイベントリスナを追加される。
     */
    initialize: function(node, unitialized) {
        enchant.EventTarget.call(this);
        this.node = node;
        this.queue = [];
        this.paused = false;
        this.looped = false;
        this.isFrameBased = true;
        this._parallel = null;
        this._initialized = !unitialized;
        this.addEventListener(enchant.Event.ENTER_FRAME, this.tick);
    },
    /**
     * 一つのenchant.Event.ENTER_FRAMEイベントはアニメーションに一つの時間単位になる。 （デフォルト）
     */
    setFrameBased: function() {
        this.isFrameBased = true;
    },
    /**
     * 一つのenchant.Event.ENTER_FRAMEイベントはアニメーションに前のフレームから経過した時間になる。
     */
    setTimeBased: function() {
        this.isFrameBased = false;
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
    next: function(remainingTime) {
        var e, action = this.queue.shift();
        e = new enchant.Event("actionend");
        e.timeline = this;
        action.dispatchEvent(e);

        if (this.looped) {
            e = new enchant.Event("removedfromtimeline");
            e.timeline = this;
            action.dispatchEvent(e);

            action.frame = 0;

            this.add(action);
        } else {
            // イベントを発行して捨てる
            e = new enchant.Event("removedfromtimeline");
            e.timeline = this;
            action.dispatchEvent(e);
        }
        var event = new enchant.Event("enterframe");
        event.elapsed = Math.max(remainingTime, 1);
        this.dispatchEvent(event);
    },
    /**
     * ターゲットの enterframe イベントのリスナとして登録される関数
     * 1フレーム経過する際に実行する処理が書かれている。
     * (キューの先頭にあるアクションに対して、actionstart/actiontickイベントを発行する)
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
    add: function(action) {
        if (!this._initialized) {
            var tl = this;
            this.node.addEventListener("enterframe", function(e) {
                tl.dispatchEvent(e);
            });
            this._initialized = true;
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
     * アクションを簡単に追加するためのメソッド。
     * 実体は add メソッドのラッパ。
     * @param params アクションの設定オブジェクト
     */
    action: function(params) {
        return this.add(new enchant.Action(params));
    },
    /**
     * トゥイーンを簡単に追加するためのメソッド。
     * 実体は add メソッドのラッパ。
     * @param params トゥイーンの設定オブジェクト。
     */
    tween: function(params) {
        return this.add(new enchant.Tween(params));
    },
    /**
     * タイムラインのキューをすべて破棄する。終了イベントは発行されない。
     */
    clear: function() {
        var e = new enchant.Event("removedfromtimeline");
        e.timeline = this;

        for (var i = 0, len = this.queue.length; i < len; i++) {
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
     * タイムラインの実行を一時停止する
     */
    pause: function() {
        this.paused = true;
        return this;
    },
    /**
     * タイムラインの実行を再開する
     */
    resume: function() {
        this.paused = false;
        return this;
    },
    /**
     * タイムラインをループさせる。
     * ループしているときに終了したアクションは、タイムラインから取り除かれた後
     * 再度タイムラインに追加される。このアクションは、ループが解除されても残る。
     */
    loop: function() {
        this.looped = true;
        return this;
    },
    /**
     * タイムラインのループを解除する。
     */
    unloop: function() {
        this.looped = false;
        return this;
    },
    /**
     * 指定したフレーム数だけ待ち、何もしないアクションを追加する。
     * @param time
     */
    delay: function(time) {
        this.add(new enchant.Action({
            time: time
        }));
        return this;
    },
    /**
     * @ignore
     * @param time
     */
    wait: function(time) {
        // reserved
        return this;
    },
    /**
     * 関数を実行し、即時に次のアクションに移るアクションを追加する。
     * @param func
     */
    then: function(func) {
        var timeline = this;
        this.add(new enchant.Action({
            onactiontick: function(evt) {
                func.call(timeline.node);
                timeline.next(evt.elapsed);
            }
        }));
        return this;
    },
    /**
     * then メソッドのシノニム。
     * 関数を実行し、即時に次のアクションに移る。
     * @param func
     */
    exec: function(func) {
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
     * ある関数を指定したフレーム数繰り返し実行するアクションを追加する。
     * @param func 実行したい関数
     * @param time 持続フレーム数
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
     * 複数のアクションを並列で実行したいときに指定する。
     * and で結ばれたすべてのアクションが終了するまで次のアクションには移行しない
     * @example
     * sprite.tl.fadeIn(30).and.rotateBy(360, 30);
     * 30フレームでフェードインしながら 360度回転する
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
     * true値 が返るまで、関数を毎フレーム実行するアクションを追加する。
     * @example
     * sprite.tl.waitUntil(function(){
     *    return this.x-- < 0
     * }).then(function(){ .. });
     * // x 座標が負になるまで毎フレーム x座標を減算し続ける
     *
     * @param func 実行したい関数
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
     * Entity の不透明度をなめらかに変えるアクションを追加する。
     * @param opacity 目標の不透明度
     * @param time フレーム数
     * @param [easing] イージング関数
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
     * Entity をフェードインするアクションを追加する。
     * fadeTo(1) のエイリアス。
     * @param time フレーム数
     * @param [easing] イージング関数
     */
    fadeIn: function(time, easing) {
        return this.fadeTo(1, time, easing);
    },
    /**
     * Entity をフェードアウトするアクションを追加する。
     * fadeTo(1) のエイリアス。
     * @param time フレーム数
     * @param [easing] イージング関数
     */
    fadeOut: function(time, easing) {
        return this.fadeTo(0, time, easing);
    },
    /**
     * Entity の位置をなめらかに移動させるアクションを追加する。
     * @param x 目標のx座標
     * @param y 目標のy座標
     * @param time フレーム数
     * @param [easing] イージング関数
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
     * Entity のx座標をなめらかに変化させるアクションを追加する。
     * @param x
     * @param time
     * @param [easing]
     */
    moveX: function(x, time, easing) {
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
    moveY: function(y, time, easing) {
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
     * Entity の opacity を0にする (即時)
     */
    hide: function() {
        return this.then(function() {
            this.opacity = 0;
        });
    },
    /**
     * Entity の opacity を1にする (即時)
     */
    show: function() {
        return this.then(function() {
            this.opacity = 1;
        });
    },
    /**
     * Entity をシーンから削除する。
     * シーンから削除された場合、 enterframe イベントは呼ばれなくなるので、
     * タイムラインも止まることに注意。
     * これ以降のアクションは、再度シーンに追加されるまで実行されない。
     */
    removeFromScene: function() {
        return this.then(function() {
            this.scene.removeChild(this);
        });
    },
    /**
     * Entity をなめらかに拡大・縮小するアクションを追加する。
     * @param scaleX 縮尺
     * @param [scaleY] 縮尺。省略した場合 scaleX と同じ
     * @param time
     * @param [easing]
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
     * Entity をなめらかに拡大・縮小させるアクションを追加する。
     * 相対縮尺 (ex. アクション開始時の縮尺の n 倍) で指定する。
     * @param scaleX 相対縮尺
     * @param [scaleY] 相対縮尺。省略した場合 scaleX と同じ
     * @param time
     * @param [easing]
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
     * Entity をなめらかに回転させるアクションを追加する。
     * @param deg 目標の回転角度 (弧度法: 1回転を 360 とする)
     * @param time フレーム数
     * @param [easing] イージング関数
     */
    rotateTo: function(deg, time, easing) {
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