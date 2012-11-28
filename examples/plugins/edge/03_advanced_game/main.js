enchant();

var PlayerClass = enchant.Class.create(enchant.Sprite,{
	initialize : function(image,game) {
		enchant.Sprite.call(this,32,32);
		this.image=game.assets[image];
		this.moveTo(game.width/2,game.height/2);
		this.health = 100;
		this.previousHealth = this.health;
		this.speed = 4;
	},
	onenterframe : function(e) {
		var moved = false;
		if(game.input.right){
			if(this.x < game.width-32){
				this.x += this.speed;
				moved = true;
				if(this.scaleX < 0)
					this.scaleX *= -1;
			}
		} else if(game.input.left){
			if(this.x > 0){
				this.x -= this.speed;
				moved = true;
				if(this.scaleX > 0)
					this.scaleX *= -1;
			}
		} else if(game.input.up){
			if(this.y > 0){
				this.y -= this.speed;
				moved = true;
			}
		} else if(game.input.down){
			if(this.y < game.height-32){
				this.y += this.speed;
				moved = true;
			}
		}
		if(this.previousHealth != this.health) {
			this.frame = 3;
			//this.previousHealth = this.health;
			this.health = this.previousHealth; // TODO
		} else if(this.health < 30) {
			this.speed = 10;
			this.frame = 4;
		} else if(!moved) {
			this.frame = 0;
		} else if(game.frame % 3 == 0){
			this.frame = (this.frame)%2+1;
		}
	}
});
var prepareNext = function(list) {
	var next = list.shift();
	if(Math.random() < 0.3) {
		next.moveTo(Math.max(0,Math.min(game.width*0.9,game.player.x+game.width*0.2*(Math.random()-0.5))),Math.max(0,Math.min(game.height*0.9,game.player.y+game.width*0.2*(Math.random()-0.5))));
	} else {
		next.moveTo(game.width*0.9*Math.random(),game.height*0.9*Math.random());
	}
	next.scaleTo(Math.random()+0.2);
	return next;
};

window.onload = function() {
	game = new Game(320, 320);
	var imageChara1 = '../../../../images/chara1.png';
	game.preload(imageChara1);

	//Edgeのデータを読み込んでるCompositionsクラスのインスタンス
	edge = enchant.edge.Compositions.instance;

	game.onload = function() {
		var scene = game.rootScene;
		
		//プレイヤーのクマのスプライトを生成する
		var player = new PlayerClass(imageChara1,game);
		scene.addChild(player);
		game.player = player;
		
		var maxSymbols = 1; // TODO
		
        //シンボル名はEdgeのファイルの中に書いてある
		var symbol = 'Spin';
		//合成IDもEdgeのファイルの中に書いてある
		var compId = 'EDGE-130892631';
		
		var freeSymbols = [];
		for(var i=0; i<maxSymbols; i++) {
			//新たな「Spin」シンボルを生成する
			var symbolInstance = edge.createSymbolInstance(compId,symbol);
			//シーンにEdgeのシンボルを追加する
			symbolInstance.addToGroup(scene);
			symbolInstance.scaleTo(5);
			symbolInstance.moveTo(-10000,-10000);
			freeSymbols.push(symbolInstance);

			//Edgeで作ったアニメのスプライトを取り出す
			var sprite = symbolInstance.getSprite('SpinRect');
			//Edgeで作ったルートのスプライトと衝突判定
			sprite.addEventListener('enterframe', function(spinSprite,player,symbol) { 
				return function(e) {
					plotOffsetXY.call(spinSprite, sf.context, 'rgba(0, 255, 0, 0.5)', -0.5, -0.5);
					//isPlayingはアニメーションが再生されているかどうかフラグ戻す
					if(symbol.isPlaying() && spinSprite.within(player)) {
						player.health--;
						console.log(player.health);
						if(player.health == 0) {
							alert('Game Over!');
							game.stop();
						}
					};
				};
			}(sprite,player,symbolInstance));
		}
		var next = prepareNext(freeSymbols);

		scene.addEventListener('enterframe', function(e) {
			if(next) {
				if(Math.random() < ((0.01/(maxSymbols-freeSymbols.length) + 0.005*(Math.log(game.frame/game.fps))))) {
					var closure = function(symbol) {
						setTimeout(function(){
							//シンボルのアニメーション再生を開始する
							symbol.play();
						},500);
					}(next);
					next = null;
				}
			} else if(freeSymbols.length > 0) {
				next = prepareNext(freeSymbols);
			}

		});

		//edgeアニメーション終了時、シンボルをゲームの外に移動する
		edge.addEventListener(enchant.Event.EDGE_TIMELINE_FINISHED,function(e){
			//freeSymbols.push(e.symbol);
			//e.symbol.moveTo(-10000,-10000);
			e.symbol.play();
			if(!next) {
				next = prepareNext(freeSymbols);
			}
		});
		{{ // TODO
		var nodesWalker = function(pre, post) {
            pre = pre || function() {
            };
            post = post || function() {
            };
            var walker = function() {
                pre.apply(this, arguments);
                var child;
                if (this.childNodes && false) {
                    for (var i = 0, l = this.childNodes.length; i < l; i++) {
                        child = this.childNodes[i];
                        walker.apply(child, arguments);
                    }
                }
                if (this.parentNode && false) {
                	plotOffsetXY.call(this.parentNode, sf.context, 'rgba(255, 0, 255, 0.5)', -0.5, -0.5);
                }
                post.apply(this, arguments);
            };
            return walker;
        };

        var plotOffsetXY = nodesWalker(function(ctx, color, ox, oy) {
            ox = ox || 0;
            oy = oy || 0;
            if (this._domManager && this._domManager.element) {
                var rect = this._domManager.element.getBoundingClientRect();
                var rx = rect.left;
                var ry = rect.top;
                ctx.fillStyle = '#888888';
                //ctx.fillRect(rx - 2, ry - 2, 4, 4);
            }
            ctx.fillStyle = color || '#000000';
            var x = this._offsetX * game.scale;
            var y = this._offsetY * game.scale;
            ctx.fillRect(x - 2 + ox, y - 2 + oy, 4, 4);
        });

        //var sp = new Sprite(320, 320);
        var w = parseInt(320 * game.scale, 10);
        var sf = new Surface(w, w);
        //sp.image = sf;
        //scene.addChild(sp);
        sf._element.style.position = 'absolute';
        document.body.appendChild(sf._element);

        if (!game._listeners['exitframe']) {
            game._listeners['exitframe'] = [];
        };
        game._listeners['exitframe'].push(function() {
        //game.addEventListener('exitframe', function() {
            plotOffsetXY.call(scene._layers.Canvas, sf.context, 'rgba(255, 0, 255, 0.5)', 0.5, 0.5);
        });
	}}

	};
	game.debug();
};
