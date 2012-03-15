/**
 * animation.enchant.js
 * @version 0.2
 * @require enchant.js v0.4.3 or later
 * @author sidestepism
 *
 * @example
 * var bear = new Sprite(32, 32);
 * bear.image = game.assets['icon0.gif'];
 * bear.animation.moveTo(64, 64, 30).fadeOut(30);
 * game.rootScene.addChild(bear);
 *
 * @example
 * var bear = new Sprite(32, 32);
 * bear.animation.hide().pushTween({
 *     opacity: 0,
 *     scaleX: 3,
 *     scaleY: 3,
 *     time: 30
 * });
 * game.rootScene.addChild(bear);
 **/

/**
 * plugin object
 * enchant(); によってグローバルにエクスポートされる
 */
enchant.animation = {};

/**
 * アクションクラス
 * 一つ一つのアクションを管理するオブジェクト
 * enchant.animation.Timeline に登録して実行する
 * @scope enchant.animation.Action.prototype
 */
enchant.animation.Action = enchant.Class.create({
    /**
     * アクションクラスのコンストラクタ。
     * 第二引数で親となるタイムラインを指定する。
     * 第三引数にオブジェクトを渡すと、パラメータを上書きできる。
     * アクションを管理するオブジェクト(タイムラインオブジェクト) と組み合わせて利用する。
     * @param timeline
     * @param args
     */
    initialize: function(timeline, args){
        /**
         * 親となるタイムライン
         * @type {enchant.animation.Timeline}
         */
        this.timeline = timeline;

        /**
         * アクションのなか操作するノード
         * @type {enchant.Node}
         */
        this.node = timeline.node;

        /**
         * 現在の経過フレーム数
         * time: 1,
         * @type {Number}
         */
        this.frame = 0;

        /**
         * アクションが持続フレーム数
         * アクションを実行したのち、frame++ > time ならばタイムラインの次のアクションに遷移する
         * @type {Number}
         */
        this.time = 0;

        /**
         * アクションの実体となる関数
         * tick(); が実行されるごとに一度だけ実行される。
         * 実行された回数は frame プロパティに記録されている
         * @type {Function}
         */
        this.func = null;

        /**
         * アクションが終了する前に実行される
         * @type {Function}
         */
        this.callback = null;

        /**
         * アクションがすでに一度でも実行されているかどうか
         * @type {Boolean}
         */
        this.loaded = false;

        /**
         * アクションの初回実行時に実行される関数
         * @type {Function}
         */
        this.onload = null;
        if(args){
            for(var i in args){
                this[i] = args[i];
            }
        }
    },
    /**
     * 1フレーム経過するごとに実行する関数
     * @return {Boolean} [result] アクションが次のフレームでも持続するかどうか
     */
    tick: function(){
        if(!this.loaded){
            if(this.onload)this.onload.call(this);
            this.loaded = true;
        }
        if(this.func){
            this.func();
        }
        this.frame ++;
        if(this.time < this.frame){
            if(this.callback){
                this.callback();
                return false;
            }
        }else{
            return true;
        }
    },
    /**
     * 実行されていない状態に戻す
     */
    reset: function(){
        this.frame = 0;
        this.loaded = false;
    }
});


/**
 * @scope enchant.animation.Tween.prototype
 */
enchant.animation.Tween = enchant.Class.create(enchant.animation.Action, {
    /**
     * トゥイーンクラス。
     * アクションクラスを継承しており、座標や回転・大きさ・透明度などを、時間に従って変更するために使う。
     * イージング関数を指定することで、様々なイージングを実現できる。
     * コンストラクタの第二引数で、トゥイーンの詳細を指定する。
     *
     * @example
     * var tween = new Tween(sprite, {
     *     x: 100,
     *     y: 0,
     *     easing: enchant.Easing.QUAD_EASEINOUT
     * });
     *
     * @param {enchant.Node} [node] 親となるノード
     * @param {*} [args] パラメータ
     * @constructs
     * @extends enchant.animation.Action
     */
    initialize: function(node, args){
        this._origin = {};
        this._target = {};
        enchant.animation.Action.call(this, node, args);

        if(typeof this.easing === "undefined"){
            this.easing = function(t, b, c, d) {
                return c*t/d + b;
            };
        }

        if(this.onload == null){
            this.onload = function(){
                // トゥイーンの対象とならないプロパティ
                var excepted = ["frame", "time", "callback", "onload"];
                for(var i in args){
                    if(excepted.indexOf(i) == -1){
                        this._origin[i] = node[i];
                        this._target[i] = args[i];
                    }
                }
            }
        }

        this.node = node;
        
        /**
         * トゥイーンで毎フレーム実行される関数
         */
        this.func = function(){
            for(var i in this._target){
                if(typeof this.node[i] === "undefined")continue;
                var ratio = this.easing(this.frame, 0, 1, this.time);
                var val = this._target[i] * ratio + this._origin[i] * (1 - ratio);
                if(i === "x" || i === "y"){
                    this.node[i] = Math.round(val);
                }else{
                    this.node[i] = val;
                }
            }
        }
    }
});

/**
 * タイムラインクラス。
 * ノードに関するアクションの実行を管理するオブジェクト。
 * タイムラインに追加されたアクションは順に実行され、すべて実行し終わると待機状態となる。
 *
 * タイムライン自身に様々なアクション・トゥイーンを追加するメソッドが用意されており、
 * メソッドチェーンによりアクションを次々に追加することも可能。
 * @example
 * var bear = new AnimationSprite(32, 32);
 * bear.animation.delay(30).moveTo(0, 320, 60);
 */
enchant.animation.Timeline = enchant.Class.create(
    {
    /**
     * @construct
     * @param {enchant.Node} [node] アクションの対象となるノード (スプライトなど)
     */
    initialize: function(node){
        this.queue = [];
        this.node = node;
        this.paused = false;
        this.looped = false;
    },
    /**
     * 1フレームごとに実行するメソッド。
     * 親ノードの、enterframeイベントに対するリスナとして登録される。
     * queue プロパティの最初のアクションを実行する。
     * 返値が false ならば、次のアクションを実行する。
     */
    tick: function(){
        if(this.paused) return;
        if(this.queue.length == 0){
            // do nothing
        }else{
            if(this.queue[0].tick()){
                // ticked
            }else{
                // end
                if(this.looped){
                    // 再度キューに追加する
                    var action = this.queue.shift();
                    action.reset();
                    this.queue.push(action);
                }else{
                    this.queue.shift();
                }
                this.tick();
            }
        }
    },
    /**
     * トゥイーンを生成し、追加する。
     * 引数で生成するトゥイーンの詳細を指定できる。
     * (すでに生成したトゥイーンを実行待ちキューに追加するには、
     *  timeline.queue.push(tween) を用いる。)
     * @param {Number} args
     * @time {Number} フレーム数 optional
     */
    pushTween: function(args, time){
        var tween = new enchant.animation.Tween(this.node, args);
        if(time !== undefined)tween.time = time;
        this.queue.push(tween);
        return this;
    },
    /**
     * アクションを生成し、追加する。
     * 引数で生成するアクションの詳細を指定できる。
     * (すでに生成したアクションを実行待ちキューに追加するには、
     *  timeline.queue.push(tween) を用いる。)
     * @param {Number} args
     * @time {Number} フレーム数 optional
     */
    pushAction: function(args, time){
        var action = new enchant.animation.Action(this, args)
        if(time !== undefined)tween.time = time;
        this.queue.push(action);
        return this;
    },
    /**
     * 不透明度を遷移させるトゥイーンを生成し、キューに追加するメソッド
     * @param {Number} opacity 目標値
     * @param {Number} time フレーム数
     * @param {Function} easing トゥイーン関数
     */
    fadeTo: function(opacity, time, easing){
        if(arguments.length < 2)time = enchant.Game.instance.fps;
        if(arguments.length < 3)easing = enchant.Easing.LINEAR;
        this.pushTween({
            time: time,
            opacity: opacity,
            easing: easing
        });
        return this;
    },
    /**
     * 不透明度を現在の値から1に遷移させるトゥイーンを生成し、キューに追加するメソッド
     * フェードインが実現できる。
     * シーンからの removeChild は実行されないので注意
     * @param {Number} time フレーム数
     * @param {Function} easing トゥイーン関数
     */
    fadeIn: function(time, easing){
        if(time === undefined)time = enchant.Game.instance.fps;
        if(easing === undefined)easing = enchant.Easing.LINEAR;
        this.fadeTo(1, time, easing);
        return this;
    },
    /**
     * 不透明度を現在の値から1に遷移させるトゥイーンを生成し、キューに追加するメソッド
     * フェードインが実現できる。
     * シーンへの addChild は実行されないので注意
     * @param {Number} time フレーム数
     * @param {Function} easing トゥイーン関数
     */
    fadeOut: function(time, easing){
        if(time === undefined)time = enchant.Game.instance.fps;
        if(easing === undefined)easing = enchant.Easing.LINEAR;
        this.fadeTo(0, time, easing);
        return this;
    },
    /**
     * Entity を画面から消すアクションを追加。
     * removeChild しているわけではなく、透明になるだけなので (opacity = 0)、
     * クリックイベントなどは受け取ることができる。
     */
    hide: function(){
        this.pushAction({
            time: 0,
            callback: function(){
                this.node.opacity = 0;
            }
        });
        return this;
    },
    /**
     * hide() や fadeOut() などで画面から消した
     * Entityを再度出現させるアクションを追加 (opacity = 1)
     */
    show: function(){
        this.pushAction({
            time: 0,
            callback: function(){
                this.opacity = 0;
            }
        })
    },
    /**
     * 縮尺を変化させるトゥイーンを生成し、キューに追加するメソッド
     * @param {Number} scale 目標値
     * @param {Number} time フレーム数
     * @param {Function} easing トゥイーン関数
     */
    scaleTo: function(scale, time, easing){
        if(arguments.length < 2)time = enchant.Game.instance.fps;
        if(arguments.length < 3)easing = enchant.Easing.LINEAR;
        this.pushTween({
            time: time,
            scaleX: scale,
            scaleY: scale,
            easing: easing
        });
        return this;
    },
    /**
     * 縮尺を変化させるトゥイーンを生成し、キューに追加するメソッド
     * @param {Number} scale 目標値
     * @param {Number} time フレーム数
     * @param {Function} easing トゥイーン関数
     */
    scaleBy: function(scale, time, easing){
        if(time === undefined)time = enchant.Game.instance.fps;
        if(easing === undefined)easing = enchant.Easing.LINEAR;
        this.pushTween({
            time: time,
            onload: function(){
                this._origin.scaleX = this.node.scaleX;
                this._target.scaleX = this.node.scaleX * scale;
                this._origin.scaleY = this.node.scaleY;
                this._target.scaleY = this.node.scaleY * scale;
            },
            scale: scale,
            easing: easing
        });
        return this;
    },
    /**
     * 回転するトゥイーンを生成し、キューに追加するメソッド
     * rotation プロパティの値を、現在の値から指定した値に変化させる
     * @param {Number} deg 回転角度 (度数法)
     * @param {Number} time フレーム数
     * @param {Function} easing トゥイーン関数
     */
    rotateTo: function(deg, time, easing){
        if(time === undefined)time = enchant.Game.instance.fps;
        if(easing === undefined)easing = enchant.Easing.LINEAR;
        this.pushTween({
            time: time,
            rotation: deg,
            easing: easing
        });
        return this;
    },
    /**
     * 回転するトゥイーンを生成し、キューに追加するメソッド
     * rotation プロパティの値を、現在の値から指定した値だけ変化させる
     * @param {Number} deg 回転角度 (度数法)
     * @param {Number} time フレーム数
     * @param {Function} easing トゥイーン関数
     */
    rotateBy: function(deg, time, easing){
        if(time === undefined)time = enchant.Game.instance.fps;
        if(easing === undefined)easing = enchant.Easing.LINEAR;
        this.pushTween({
            time: time,
            onload: function(){
                this._origin.rotation = this.node.rotation;
                this._target.rotation = this.node.rotation + deg;
            },
            rotation: deg,
            easing: easing
        });
        return this;
    },
    /**
     * 移動するトゥイーンを生成し、キューに追加するメソッド
     * x, y座標を、現在の値から指定した値に変化させる
     * @param {Number} x 移動先のx座標
     * @param {Number} y 移動先のy座標
     * @param {Number} time 角度
     * @param {Function} easing トゥイーン関数
     */
    moveTo: function(x, y, time, easing){
        if(time === undefined)time = enchant.Game.instance.fps;
        if(easing === undefined)easing = enchant.Easing.LINEAR;
        this.pushTween({
            time: time,
            x: x,
            y: y,
            easing: easing
        });
        return this;
    },
    /**
     * 移動するトゥイーンを生成し、キューに追加するメソッド
     * x, y座標を、現在の値から指定した値だけ変化させる
     * @param {Number} x x座標の移動量
     * @param {Number} y y座標の移動量
     * @param {Number} time 角度
     * @param {Function} easing トゥイーン関数
     */
    moveBy: function(x, y, time, easing){
        if(time === undefined)time = enchant.Game.instance.fps;
        if(easing === undefined)easing = enchant.Easing.LINEAR;
        this.pushTween({
            time: time,
            onload: function(){
                this._origin.x = this.node.x;
                this._origin.y = this.node.y;
                this._target.x = this.node.x + x;
                this._target.y = this.node.y + y;
            },
            easing: easing
        });
        return this;
    },
    /**
     * 何もせず、指定されたフレーム数だけ待つアクションをキューに追加する
     * @param time
     */
    delay: function(time){
        this.pushAction({
            time: time
        });
        return this;
    },
    /**
     *
     * 指定した関数を1度だけ実行するアクションをキューに追加する
     * delayと組み合わせて、一定フレーム後に実行する関数を指定することもできる
     * @param func 実行する関数
     */
    then: function(func){
        this.pushAction({
            time: 0,
            callback: func
        });
        return this;
    },
    /**
     * 指定した関数を、返り値が true になるまで毎フレーム実行するアクションをキューに追加する
     * @param func 実行する関数
     */
    after: function(func){
        this.pushAction({
            tick: function(){
                return !func();
            }
        });
        return this;
    },
    /**
     * 指定した関数を、返り値が true になるまで毎フレーム実行するアクションをキューに追加する
     * @param func 実行する関数
     */
    repeat: function(func, time, span){
        if(span === undefined)span = 1;
        this.pushAction({
            func: function(){
                if(this.frame % span == 0){
                    func();
                }
            },
            time: time
        });
        return this;
    },
    loop: function(actions){
        return this;
    },
    /**
     * x,y 座標をディレイなしで変更するアクションをキューに追加する
     * @param x
     * @param y
     */
    jumpTo: function(x, y){
        var node = this.node;
        return this.then(function(){
            node.x = x;
            node.y = y;
            });
    },
    /**
     * x,y 座標をディレイなしで変更するアクションをキューに追加する
     * @param x
     * @param y
     */
    jumpBy: function(x, y){
        var node = this.node;
        return this.then(function(){
            node.x = node.x + x;
            node.y = node.y + y;
            });
    },
    /**
     * アニメーションキューの実行をストップする
     */
    pause: function(){
        this.paused = true;
        return this;
    },
    /**
     * アニメーションキューの実行を再開する
     */
    start: function(){
        this.paused = false;
        return this;
    },
    /**
     * アニメーションキューを空にする
     */
    clear: function(){
        this.queue = [];
        this.paused = false;
        return this;
    }
})

/**
 * @scope enchant.animation.Node.prototype
 */
enchant.animation.Node = enchant.Class.create(enchant.Node, {
    initialize: function(){
        enchant.Node.apply(this, arguments);
        this.animation = new enchant.animation.Timeline(this);
        this.addEventListener("enterframe", function(){ this.animation.tick(); });
    }
});

/**
 * @scope enchant.animation.Entity.prototype
 */
enchant.animation.Entity = enchant.Class.create(enchant.Entity, {
    initialize: function(){
        enchant.Entity.apply(this, arguments);
        this.animation = new enchant.animation.Timeline(this);
        this.addEventListener("enterframe", function(){ this.animation.tick(); });
    }
});

/**
 * @scope enchant.animation.Sprite.prototype
 */
enchant.animation.Sprite = enchant.Class.create(enchant.Sprite, {
    initialize: function(){
        enchant.Sprite.apply(this, arguments);
        this.animation = new enchant.animation.Timeline(this);
        this.addEventListener("enterframe", function(){ this.animation.tick(); });
    }
});

/**
 * @scope enchant.animation.Label.prototype
 */
enchant.animation.Label = enchant.Class.create(enchant.Label, {
    initialize: function(){
        enchant.Label.apply(this, arguments);
        this.animation = new enchant.animation.Timeline(this);
        this.addEventListener("enterframe", function(){ this.animation.tick(); });
    }
});

/**
 * @scope enchant.animation.Scene.prototype
 */
enchant.animation.Scene = enchant.Class.create(enchant.Scene, {
    initialize: function(){
        enchant.Scene.apply(this, arguments);
        this.animation = new enchant.animation.Timeline(this);
        this.addEventListener("enterframe", function(){ this.animation.tick(); });
    }
});

/**
 * @scope enchant.animation.Group.prototype
 */
enchant.animation.Group = enchant.Class.create(enchant.Group, {
    initialize: function(){
        enchant.Group.apply(this, arguments);
        this.animation = new enchant.animation.Timeline(this);
        this.addEventListener("enterframe", function(){ this.animation.tick(); });
    }
});

if(enchant.RGroup){
    enchant.animation.RGroup = enchant.Class.create(enchant.RGroup, {
        initialize: function(){
            enchant.RGroup.apply(this, arguments);
            this.animation = new enchant.animation.Timeline(this);
            this.addEventListener("enterframe", function(){ this.animation.tick(); });
        }
    });
}

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
    LINEAR: function(t, b, c, d) {
		return c*t/d + b;
    },
	// quad
	QUAD_EASEIN: function(t, b, c, d) {
		return c*(t/=d)*t + b;
	},
	QUAD_EASEOUT: function(t, b, c, d) {
		return -c *(t/=d)*(t-2) + b;
	},
	QUAD_EASEINOUT: function(t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t + b;
		return -c/2 * ((--t)*(t-2) - 1) + b;
	},
	// qubic
	QUBIC_EASEIN: function(t, b, c, d) {
		return c*(t/=d)*t*t + b;
	},
	QUBIC_EASEOUT: function(t, b, c, d) {
		return c*((t=t/d-1)*t*t + 1) + b;
	},
	QUBIC_EASEINOUT: function(t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t*t + b;
		return c/2*((t-=2)*t*t + 2) + b;
	},
	// quart
	QUART_EASEIN: function(t, b, c, d) {
		return c*(t/=d)*t*t*t + b;
	},
	QUART_EASEOUT: function(t, b, c, d) {
		return -c * ((t=t/d-1)*t*t*t - 1) + b;
	},
	QUART_EASEINOUT: function(t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t*t*t + b;
		return -c/2 * ((t-=2)*t*t*t - 2) + b;
	},
	// quint
	QUINT_EASEIN: function(t, b, c, d) {
		return c*(t/=d)*t*t*t*t + b;
	},
	QUINT_EASEOUT: function(t, b, c, d) {
		return c*((t=t/d-1)*t*t*t*t + 1) + b;
	},
	QUINT_EASEINOUT: function(t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t*t*t*t + b;
		return c/2*((t-=2)*t*t*t*t + 2) + b;
	},
    //sin
	SIN_EASEIN: function(t, b, c, d) {
		return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
	},
	SIN_EASEOUT: function(t, b, c, d) {
		return c * Math.sin(t/d * (Math.PI/2)) + b;
	},
	SIN_EASEINOUT: function(t, b, c, d) {
		return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
	},
	// circ
	CIRC_EASEIN: function(t, b, c, d) {
		return -c * (Math.sqrt(1 - (t/=d)*t) - 1) + b;
	},
	CIRC_EASEOUT: function(t, b, c, d) {
		return c * Math.sqrt(1 - (t=t/d-1)*t) + b;
	},
	CIRC_EASEINOUT: function(t, b, c, d) {
		if ((t/=d/2) < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;
		return c/2 * (Math.sqrt(1 - (t-=2)*t) + 1) + b;
	},
	// elastic
    ELASTIC_EASEIN: function (t, b, c, d, a, p) {
		if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
		if (!a || a < Math.abs(c)) { a=c; var s=p/4; }
		else var s = p/(2*Math.PI) * Math.asin (c/a);
		return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
	},
	ELASTIC_EASEOUT: function (t, b, c, d, a, p) {
		if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
		if (!a || a < Math.abs(c)) { a=c; var s=p/4; }
		else var s = p/(2*Math.PI) * Math.asin (c/a);
		return (a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b);
	},
	ELASTIC_EASEINOUT: function (t, b, c, d, a, p) {
		if (t==0) return b;  if ((t/=d/2)==2) return b+c;  if (!p) p=d*(.3*1.5);
		if (!a || a < Math.abs(c)) { a=c; var s=p/4; }
		else var s = p/(2*Math.PI) * Math.asin (c/a);
		if (t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
		return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )*.5 + c + b;
	},
    // bounce
	BOUNCE_EASEOUT: function(t, b, c, d) {
		if ((t/=d) < (1/2.75)) {
			return c*(7.5625*t*t) + b;
		} else if (t < (2/2.75)) {
			return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
		} else if (t < (2.5/2.75)) {
			return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
		} else {
			return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
		}
	},
	BOUNCE_EASEIN: function(t, b, c, d) {
		return c - enchant.Easing.BOUNCE_EASEOUT(d-t, 0, c, d) + b;
	},
	BOUNCE_EASEINOUT: function(t, b, c, d) {
		if (t < d/2) return enchant.Easing.BOUNCE_EASEIN(t*2, 0, c, d) * .5 + b;
		else return enchant.Easing.BOUNCE_EASEOUT(t*2-d, 0, c, d) * .5 + c*.5 + b;
	},
    // back
	BACK_EASEIN: function(t, b, c, d, s) {
		if (s == undefined) s = 1.70158;
		return c*(t/=d)*t*((s+1)*t - s) + b;
	},
	BACK_EASEOUT: function(t, b, c, d, s) {
		if (s == undefined) s = 1.70158;
		return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
	},
	BACK_EASEINOUT: function(t, b, c, d, s) {
		if (s == undefined) s = 1.70158;
		if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
		return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
	},
	// expo
	EXPO_EASEIN: function(t, b, c, d) {
		return (t==0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b;
	},
	EXPO_EASEOUT: function(t, b, c, d) {
		return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
	},
	EXPO_EASEINOUT: function(t, b, c, d) {
		if (t==0) return b;
		if (t==d) return b+c;
		if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;
		return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;
	}
};

/**
 * Easing Equations v2.0
 */
