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
		Sprite.call(this, enchant.Game.instance.width, enchant.Game.instance.height); // 継承元のコンストラクタを適用する
		if(arguments.length == 1){
			this.image = arguments[0];
		}else{
			this.image = enchant.Game.instance.assets["back.png"];
		}
	}
});

// 画像でフォントを再現したラベル (参考: draw.text.js)
enchant.util.MutableText = enchant.Class.create(enchant.Sprite, {
	initialize: function(posX, posY, width) {
		enchant.Sprite.call(this, 0, 0);
		this.fontSize = 16;
		this.widthItemNum = 16;
		// font.png の横の文字数
		this.x = posX;
		this.y = posY;
		this.text = '';
		if (arguments[2]) {
			this.row = Math.floor(arguments[2] / this.fontSize);
		}
	},
	setText: function(txt) {
		var i, x, y, wNum, charCode, charPos;
		this._text = txt;
		if (!this.returnLength) {
			this.width = Math.min(this.fontSize * this._text.length, enchant.Game.instance.width);
		} else {
			this.width = Math.min(this.returnLength * this.fontSize, enchant.Game.instance.width);
		}
		this.height = this.fontSize * (Math.ceil(this._text.length / this.row) || 1);
		this.image = new Surface(this.width, this.height);
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
			this.image.draw(enchant.Game.instance.assets['font.png'], 
				x * this.fontSize, y * this.fontSize, this.fontSize, this.fontSize,
				(i%this.row)*this.fontSize, ((i/this.row)|0)*this.fontSize, this.fontSize, this.fontSize);
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
			return this.returnLength || this.width/this.fontSize;
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
			this.text = this.label + (this._time / enchant.Game.instance.fps).toFixed(2);
		});
	},
	time: {
		get: function() {
			return Math.floor(this._time / enchant.Game.instance.fps);
		},
		set: function(newtime){
			this._time = newtime * enchant.Game.instance.fps;
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
			this.heart[i].image = enchant.Game.instance.assets['icon0.gif'];
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
		this.image = new Surface(1, 16);// Null用
		this.image.context.fillColor = 'RGB(0, 0, 256)';
		this.image.context.fillRect(0, 0, 1, 16);
		this._direction = 'right';
		this._origin = 0;
		this._maxvalue = enchant.Game.instance.width;
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

/**
 * マップライクな Group
 * addChildで Sprite 等を追加すると、自動的に mx, my プロパティが追加され、
 * VirtualMap内での座標で Sprite を操作できる
 *
 * 使い方
 * //20 x 20 メッシュの縦横320ピクセルの盤を作り、その上に16 x 16の駒を8つ並べる
 * var board = new VirtualMap(20, 20);
 * board.width = 320;
 * board.height = 320;
 * for(var i=0; i<8; i++){
 *     var piece = new Sprite(16, 16);
 *     piece.image = game.assets['icon0.gif'];
 *     board.addChild(piece);
 *     piece.mx = i + 3;
 *     piece.my = 16;
 * }
 * game.rootScene.addChild(board);
 */
enchant.util.VirtualMap = enchant.Class.create(enchant.Group, {
    initialize: function (meshWidth, meshHeight) {
        enchant.Group.call(this);
        this.meshWidth = meshWidth || 16;
        this.meshHeight = meshHeight || 16;
    },
    addChild: function (obj) {
        enchant.Group.prototype.addChild.call(this, obj);
        this.bind(obj);
    },
    insertBefore: function (obj, reference) {
        enchant.Group.prototype.insertBefore.call(this, obj, reference);
        this.bind(obj);
    },
    bind: function (obj) {
        Object.defineProperties(obj, {
            "mx": {
                get: function () {
                    return Math.floor(this.x / this.parentNode.meshWidth);
                },
                set: function (arg) {
                    this.x = Math.floor(arg * this.parentNode.meshWidth);
                }
            },
            "my": {
                get: function () {
                    return Math.floor(this.y / this.parentNode.meshHeight);
                },
                set: function (arg) {
                    this.y = Math.floor(arg * this.parentNode.meshWidth);
                }
            }
        });
        obj.mx = 0;
        obj.my = 0;
    }
});

/*タッチイベントが使えるかを調べる関数*/
function isTouch(){
	return (document.ontouchstart !== undefined);
}

function rand(num){
    return Math.floor(Math.random() * num);
}
