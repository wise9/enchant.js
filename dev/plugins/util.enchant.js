/**
 * util.enchant.js v0.2 (2011/10/06)
 * @author Ubiquitous Entertainment Inc.
 * @require enchant.js v0.4.0 or later
 * @description
 * enchant.js extension plugin
 * includes: MutableText, ScoreLabel, TimeLabel, LifeLabel, Bar, Material, ExSprite
 */

enchant.util = { assets: ['effect0.gif', 'icon0.gif', 'font.png'] };

// 背景専用スプライト
enchant.util.Wallpaper = enchant.Class.create(enchant.Sprite, { // Spriteを継承したクラスを作成する
	initialize: function(backgroundimaget) { // コンストラクタを上書きする
		Sprite.call(this, game.width, game.height); // 継承元のコンストラクタを適用する
		if(arguments.length == 1){
			this.image = arguments[0];
		}else{
			this.image = game.assets["back.png"];
		}
	}
});

// 画像でフォントを再現したラベル (参考: draw.text.js)
enchant.util.MutableText = enchant.Class.create(enchant.Sprite, {
	initialize: function(posX, posY, width, height) {
		enchant.Sprite.call(this, 0, 0);
		var game = enchant.Game.instance;
		var width = (arguments[2] || game.width);
		var height = (arguments[3] || game.height);
		this.fontSize = 16;
		this.widthItemNum = 16;
		// font.png の横の文字数
		this.returnLength = width/this.fontSize;
		// 改行を入れる文字数
		this.image = new Surface(width, height);
		this.x = posX;
		this.y = posY;
		this.text = '';
	},
	setText: function(txt) {
		var i, x, y, wNum, charCode, charPos;
		var game = enchant.Game.instance;
		this._text = txt;
		this.width = this.returnLength * this.widthItemNum;
		this.height = this.fontSize * (((this._text.length / this.returnLength)|0)+1);
		this.image.context.clearRect(0, 0, this.width, this.height);
		for(i=0; i<txt.length; i++) {
			charCode = txt.charCodeAt(i);
			if (charCode >= 32 && charCode <= 127) {
				charPos = charCode - 32;
			} else {
				charPos = 0;
			}
			x = charPos % this.widthItemNum;
			y = (charPos / this.widthItemNum)|0;
			this.image.draw(game.assets['font.png'], 
				x * this.fontSize, y * this.fontSize, this.fontSize, this.fontSize,
				(i%this.returnLength)*this.fontSize, ((i/this.returnLength)|0)*this.fontSize, this.fontSize, this.fontSize);
		}
	},
	text: {
		get: function() {
			return this._text;
		},
		set: function(txt) {
			this.setText(txt);
		}
	},
	row: {
		get: function() {
			return this.returnLength;
		},
		set: function(row) {
			this.returnLength = row;
			this.text = this.text;
		}
	}
});

// スコアラベル
enchant.util.ScoreLabel = enchant.Class.create(enchant.util.MutableText, {
	initialize: function(x, y) {
		MutableText.call(this, 0, 0);
		switch(arguments.length){
			case 2:
				this.y = y;
			case 1:
				this.x = x;
				break;
			default:
				break;
		}
		this._score = 0;
		this._current = 0;
		this.easing = 2.5;
		this.text = this.label = 'SCORE:';
		this.addEventListener('enterframe', function(){
			if(this.easing == 0){
				this.text = this.label + (this._current = this._score);
			}else{
				this._current += Math.ceil((this._score - this._current)/this.easing);
				this.text = this.label + this._current;
			}
		});
	},
	score: {
		get: function() {
			return this._score;
		},
		set: function(newscore){
			this._score = newscore;
		}
	}
});

// タイムラベル
enchant.util.TimeLabel = enchant.Class.create(enchant.util.MutableText, {
	initialize: function(x, y, counttype) {
		MutableText.call(this, 0, 0);
		switch(arguments.length){
			case 3:
			case 2:
				this.y = y;
			case 1:
				this.x = x;
				break;
			default:
				break;
		}
		this._time = 0;
		this._count = 1;// この数を毎フレーム每に足して上げ下げを制御する
		if(counttype == 'countdown')this._count = -1;
		this.text = this.label = 'TIME:';
		this.addEventListener('enterframe', function(){
			this._time += this._count;
			this.text = this.label + (this._time / game.fps).toFixed(2);
		});
	},
	time: {
		get: function() {
			return this._time;
		},
		set: function(newtime){
			this._time = newtime * game.fps;
		}
	}
});

// ライフラベル
enchant.util.LifeLabel = enchant.Class.create(enchant.Group, {
	initialize: function(x, y, maxlife) {
		Group.call(this);
		this.x = x || 0;
		this.y = y || 0;
		this._maxlife = maxlife || 9;
		this._life = 0;
		this.label = new MutableText(0, 0, 80, 'LIFE:')
		this.addChild(this.label);
		this.heart = [];
		for(var i=0; i<this._maxlife; i++){
			this.heart[i] = new Sprite(16, 16);
			this.heart[i].image = game.assets['icon0.gif'];
			this.heart[i].x = this.label.width + i*16;
			this.heart[i].y = -3;
			this.heart[i].frame = 11;
			this.addChild(this.heart[i]);
		}
	},
	life: {
		get: function() {
			return this._life;
		},
		set: function(newlife) {
			this._life = newlife;
			if(this._maxlife < newlife){
				this._life = this._maxlife;
			}
			for(var i=0; i<this._maxlife; i++){
				if(i <= newlife-1){
					this.heart[i].visible = true;
				}else{
					this.heart[i].visible = false;
				}
			}
		}
	}
});

// イージング付きのバー (左右方向のみ) 
enchant.Bar = enchant.Class.create(enchant.Sprite, {
	initialize: function(x, y) {
		Sprite.call(this, 1, 16);
		var game = enchant.Game.instance;
		this.image = new Surface(1, 16);// Null用
		this.image.context.fillColor = 'RGB(0, 0, 256)';
		this.image.context.fillRect(0, 0, 1, 16);
		this._direction = 'right';
		this._origin = 0;
		this._maxvalue = game.width;
		this._lastvalue = 0;
		this.value = 0;
		this.easing = 5;
		switch(arguments.length){
			case 2:
				this.y = y;
			case 1:
				this.x = x;
				this._origin = x;
			default:
				break;
		}
		this.addEventListener('enterframe', function(){
			if(this.value < 0)this.value = 0;
			this._lastvalue += (this.value - this._lastvalue)/this.easing;
			if(Math.abs(this._lastvalue - this.value) < 1.3)this._lastvalue = this.value;
			this.width = (this._lastvalue)|0;
			if(this.width > this._maxvalue)this.width = this._maxvalue;
			if(this._direction == 'left'){
				this._x = this._origin - this.width;
			}else{
				this._x = this._origin;
			}
			this._updateCoordinate();
		});
	},
	direction: {
		get: function() {
			return this._direction;
		},
		set: function(newdirection) {
			if(newdirection != 'right' && newdirection != 'left'){
				console.warn(newdirection + ' は未定義の向きです。rightかleftを指定してください.');
			}else{
				this._direction = newdirection;
			}
		}
	},
	x: {
		get: function() {
			return this._origin;
		},
		set: function(x) {
			this._x = x;
			this._origin = x;
			this._updateCoordinate();
		}
	},
	maxvalue: {
		get: function(){
			return this._maxvalue;
		},
		set: function(val){
			this._maxvalue = val;
		}
	}
});

enchant.util.ExSprite = enchant.Class.create(enchant.Sprite, {
	initialize: function(width, height) {
		Sprite.call(this, arguments[0], arguments[1]);
		this._mode = 'normal';	// 状態
		this._fade = 0;			// フェードイン・フェードアウトを制御
		this._blastf = 0;		// 爆発中の状態を保持する変数 (%) 
		this._blast = 0;		// 爆発の速度 (%) 
		this.addEventListener('enterframe', function(){
			switch(this._mode){
			case 'normal':
				break;
			case 'blast':
				this._blastf += this._blast;
				if(this._blastf > 1){
					this.scene.removeChild(this);
					delete this;
				}
				this.frame = (this._blastf*4)|0;
				break;
			case 'fadein':
				this.opacity += this._fade;
				if(this.opacity > 1){
					this.opacity = 1;
					this._fade = 0;
					this._mode = 'normal';
				}
				break;
			case 'fadeout':
				this.opacity -= this._fade;
				if(this.opacity < 0){
					this.opacity = 0;
					this._fade = 0;
					this._mode = 'normal';
				}
				break;
			default:
				break;
			}
		});
	},
	show: function() {
		game.rootScene.addChild(this);
	},
	hide: function() {
		game.rootScene.removeChild(this);
	},
	blast: function(frame) {
		if(this._mode == 'normal'){
			this._mode = 'blast';
			this.scale(this.width/16);
			this.image = game.assets['effect0.gif'];
			this.width = 16;
			this.height = 16;
			this.frame = 16;
			this._blastf = 0;
			this._blast = (1/frame) || (1/10);
		}
	},
	fadeOut: function(frame) {
		this._mode = 'fadeout';
		this._fade = (1/frame) || (1/10);
	},
	fadeIn: function(frame) {
		this._mode = 'fadein';
		this._fade = (1/frame) || (1/10);
	},
	intersect: function(target) {
		var mygapx = (1 - this.scaleX)*this.width;
		var mygapy = (1 - this.scaleY)*this.height;
		var tagapx = (1 - target.scaleX)*target.width;
		var tagapy = (1 - target.scaleY)*target.height;
		
		var myright = this.x + this.width - mygapx;
		var taright = target.x + target.width - mygapy;
		var mybottom = this.y + this.height - tagapx;
		var tabottom = target.y + target.height - tagapy;
		
		if (this.x + mygapx < taright && myright > target.x + tagapx &&
			this.y + mygapy < tabottom && mybottom > target.y + tagapy) {
			return true;
		} else {
			return false;
		}
	}
});

// 引数豊富なスプライト (自動移動付き) 
enchant.util.Material = enchant.Class.create(enchant.util.ExSprite, {
	initialize: function(width, height, x, y, toSpriteImage) {
		ExSprite.call(this, arguments[0], arguments[1]);
		switch(arguments.length){
			case 5:
				this.image = arguments[4];
			case 4:
				this.y = arguments[3];
			case 3:
				this.x = arguments[2];
			case 2:
				this.height = arguments[1];
			case 1:
				this.width = arguments[0];
				break;
		}
		this.name = '';				/* 名前 (IDとして使用) */
		this.physical = true;		/* 物理演算っぽいことを行うか */
		this.static = false;		/* 不動か */
		this.weight = 10;			/* 重さ */
		this.maxspeed = 10;			/* 最大加速度 */
		this._colled = false;		/* 前フレーム時に衝突しているか */
		this.partner = {};			/* 衝突相手 */
		this._preventx = 0;			/* 前フレーム時のx座標 */
		this._preventy = 0;
		this.vx = 0;
		this.vy = 0;
		this.addEventListener('enterframe', function(){
			if(this._mode != 'blast')this.move();
		});
		this.addEventListener('colled', function(){// 衝突時のイベントリスナ
			
		});
	},
	move: function() {
		this._preventx = this.x;
		this._preventy = this.y;
		/* 物質であるとき */
		if(this.physical){
			// 自由に動いているとき
			if(!this.static){
				this.vy += this.weight * 0.1;
				// 衝突判定
				// 自身の登録されたシーン内のオブジェクト同士を比較する
				this._colled = false;
				for(var i=this.scene.childNodes.length-1; i>=0; i--){
					if(		this.scene.childNodes[i].physical &&
							this.y != this.scene.childNodes[i].y &&
							this.x != this.scene.childNodes[i].x &&
							this.intersect(this.scene.childNodes[i])){
						this._colled = true;
						this.partner = this.scene.childNodes[i];
						// (物理演算で) 反発させる (未実装) 
						if(this.scene.childNodes[i].static){
							this.vx *= -0.5;
							this.vy *= -0.5;
						}else{
							var vx = +(this.x - this.scene.childNodes[i].x);
							var vy = +(this.y - this.scene.childNodes[i].y);
							var raito = (this.weight/(this.weight+this.scene.childNodes[i].weight))/2;
							this.vx = vx/raito;
							this.vy = vy/raito;
						}
					}
				}
				/* 速度制限 */
				if(this.vx > this.maxspeed)this.vx = this.maxspeed;
				else if(this.vx < -this.maxspeed)this.vx = -this.maxspeed;
				if(this.vy > this.maxspeed)this.vy = this.maxspeed;
				else if(this.vy < -this.maxspeed)this.vy = -this.maxspeed;
			}
			/* 速度制限 */
			if(this.vx > this.maxspeed)this.vx = this.maxspeed;
			else if(this.vx < -this.maxspeed)this.vx = -this.maxspeed;
			if(this.vy > this.maxspeed)this.vy = this.maxspeed;
			else if(this.vy < -this.maxspeed)this.vy = -this.maxspeed;
			
			if(this._colled){
				this.x = this._preventx - Math.abs(this._preventx - this.partner.x);
				this.y = this._preventy - Math.abs(this._preventy - this.partner.y);
			}else{
				this.x += this.vx;
				this.y += this.vy;
			}
		}else{
			this.x += this.vx;
			this.y += this.vy;
		}
	}
});

/*タッチイベントが使えるかを調べる関数*/
function isTouch(){
	return (document.ontouchstart !== undefined);
}

function rand(num){
    return Math.floor(Math.random() * num);
}