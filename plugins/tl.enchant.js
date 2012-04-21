/**
 * tl.enchant.js
 * @version 0.3
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

enchant.tl = {};

enchant.Event.START = "start";
enchant.Event.END = "end";
enchant.Event.ADDED_TO_TIMELINE = "addedtotimeline";
enchant.Event.REMOVED_FROM_TIMELINE = "removedfromtimeline";

enchant.Event.ACTION_START = "actionstart";
enchant.Event.ACTION_END = "actionend";
enchant.Event.ACTION_TICK = "actiontick";

enchant.Event.ACTION_ADDED = "actionadded";
enchant.Event.ACTION_REMOVED = "actionremoved";

enchant.Event.START = "start";
enchant.Event.END = "end";
enchant.Event.TICK = "tick";


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
 * @extends enchant.EventTarget
 */
enchant.tl.ActionEventTarget = enchant.Class.create(enchant.EventTarget, {
    /**
     * @constructs
     * @param e
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

enchant.tl.Action = enchant.Class.create(enchant.tl.ActionEventTarget, {
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
 * @extends enchant.tl.Action
 */
enchant.tl.ParallelAction = enchant.Class.create(enchant.tl.Action, {
    initialize: function(){
        enchant.tl.Action.call(this);
        var timeline = this.timeline;
        var node = this.node;
        this.actions = [];
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

enchant.tl.Tween = enchant.Class.create(enchant.tl.Action, {
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
            var excepted = ["frame", "time", "callback", "ontick", "onstart", "onend"];
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
    initialize: function(node){
        enchant.EventTarget.call(this);
        this.node = node;
        this.queue = [];
        this.paused = false;
        this.looped = false;

        this._parallel = null;

        this.addEventListener(enchant.Event.ENTER_FRAME, this.tick);
    },
    next: function(){
        var e, action = this.queue.shift();
        e = new enchant.Event("actionend");
        e.timeline = this;
        action.dispatchEvent(e);

        if(this.looped){
            e = new enchant.Event("removedfromtimeline");
            e.timeline = this;
            action.dispatchEvent(e);

            // 再度追加する
            e = new enchant.Event("addedtotimeline");
            e.timeline = this;
            action.dispatchEvent(e);

            this.add(action);
        }else{
            // イベントを発行して捨てる
            e = new enchant.Event("removedfromtimeline");
            e.timeline = this;
            action.dispatchEvent(e);
        }
        this.dispatchEvent(new enchant.Event("enterframe"));
    },
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
    action: function(params){
        return this.add(new enchant.tl.Action(params));
    },
    tween: function(params){
        return this.add(new enchant.tl.Tween(params));
    },
    add: function(action){
        if(this._parallel){
            this._parallel.actions.push(action);
            this._parallel = null;
        }else{
            this.queue.push(action);
        }

        var e = new enchant.Event("addedtotimeline");
        e.timeline = this;
        action.dispatchEvent(e);

        e = new enchant.Event("actionadded");
        e.action = action;
        this.dispatchEvent(e);

        return this;
    },
    clear: function(){
        var e = new enchant.Event("removedfromtimeline");
        e.timeline = this;

        for(var i = 0, len = this.queue.length; i < len; i++){
            this.queue[i].dispatchEvent(e);
        }
        this.queue = [];
        return this;
    },
    skip: function(frames){
        while(frames --){
            this.dispatchEvent(new enchant.Event("enterframe"));
        }
        return this;
    },
    resume: function(){
        this.paused = true;
        return this;
    },
    pause: function(){
        this.paused = false;
        return this;
    },
    loop: function(){
        this.looped = true;
        return this;
    },
    unloop: function(){
        this.looped = false;
        return this;
    },
    delay: function(time){
        this.add(new enchant.tl.Action({
            time: time
        }));
        return this;
    },
    wait: function(time){
        // reserved
        return this;
    },
    then: function(func){
        var timeline = this;
        this.add(new enchant.tl.Action({
                    onactionstart: func,
                    onactiontick: function(evt){
                        timeline.next();
                    }
                }));
        return this;
    },
    cue: function(cue){
        var ptr = 0;
        for(var frame in cue)if(cue.hasOwnProperty(frame)){
            this.delay(frame - ptr);
            this.then(cue[frame]);
            ptr = frame;
        }
    },
    repeat: function(func, time){
        this.add(new enchant.tl.Action({
            onactiontick: function(evt){
                func.call(this);
            },
            time: time
        }));
        return this;
    },
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
    or: function(){
        return this;
    },
    doAll: function(children){
        return this;
    },
    waitAll: function(){
        return this;
    },
    waitUntil: function(){
        return this;
    },
    fadeTo: function(opacity, time, easing){
        this.tween({
            opacity: opacity,
            time: time,
            easing: easing
        });
        return this;
    },
    fadeIn: function(time, easing){
        return this.fadeTo(1, time, easing);
    },
    fadeOut: function(time, easing){
        return this.fadeTo(0, time, easing);
    },
    moveTo: function(x, y, time, easing){
        return this.tween({
            x: x,
            y: y,
            time: time,
            easing: easing
        });
    },
    moveX: function(x, time, easing){
        return this.tween({
            x: x,
            time: time,
            easing: easing
        });
    },
    moveY: function(y, time, easing){
        return this.tween({
            y: y,
            time: time,
            easing: easing
        });
    },
    moveBy: function(x, y, time, easing){
        return this.tween({
            x: function(){ return this.x + x },
            y: function(){ return this.y + y },
            time: time,
            easing: easing
        });
    },
    hide: function(){
        return this.then(function(){
            this.opacity = 0;
        });
    },
    show: function(){
        return this.then(function(){
            this.opacity = 1;
        });
    },
    removeFromScene: function(){
        return this.then(function(){
            this.scene.removeChild(this);
        });
    },
    scaleTo: function(x, y, time, easing){
        if(y == null)y = x;
        return this.tween({
            scaleX: x,
            scaleY: y,
            time: time,
            easing: easing
        });
    },
    scaleBy: function(x, y, time, easing){
        if(y == null)y = x;
        return this.tween({
            scaleX: function(){ return this.scaleX * x },
            scaleY: function(){ return this.scaleY * y },
            time: time,
            easing: easing
        })
    },
    rotateTo: function(deg, time, easing){
        return this.tween({
            rotation: deg,
            time: time,
            easing: easing
        });
    },
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
    // qubic
    QUBIC_EASEIN: function (t, b, c, d) {
        return c * (t /= d) * t * t + b;
    },
    QUBIC_EASEOUT: function (t, b, c, d) {
        return c * ((t = t / d - 1) * t * t + 1) + b;
    },
    QUBIC_EASEINOUT: function (t, b, c, d) {
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

