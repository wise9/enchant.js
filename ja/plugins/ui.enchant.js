/**
 * ui.enchant.js v1.0
 * ui parts support
 * @require enchant.js v0.3 or later
 * @require image files for gamepad (default: pad.png, apad.png)
 *
 * @features
 * - D-Pad (left, right, up, down)
 * - Analog Pad
 * - Button (3 built-in themes and can be customized)
 *
 * @usage
 * [D-Pad]
 * var pad = new Pad();
 * pad.x = 0;
 * pad.y = 220;
 * game.rootScene.addChild(pad);
 *  (input of X direction can be detected from "Xbuttonup" "Xbuttondown" events
 *   or enchant.Game.instance.input.X)
 *
 * [A-Pad]
 * var pad = new APad();
 * pad.x = 0;
 * pad.y = 220;
 * game.rootScene.addChild(pad);
 *  (input can be detected from pad.vx/vy and pad.touched)
 *
 * [Button]
 * var button = new Button("Press me");
 * button.addEventListener("touchstart", function(){ ... })
 * game.rootScene.addEventListener(button);
 *
 * var button_light = new Button("Press me", "light");
 * game.rootScene.addEventListener(button);
 *
 * var button_blue = new Button("Press me", "blue");
 * game.rootScene.addEventListener(button);
 *
 */

enchant.ui = { assets: ['pad.png', 'apad.png'] };

/**
 * 方向キーパッドのクラス: Pad
 * @scope enchant.ui.Pad
 */
enchant.ui.Pad = enchant.Class.create(enchant.Sprite, {
    /**
     * 方向キーパッドオブジェクトを作成する。
     * @constructs
     * @extends enchant.Sprite
     */
    initialize: function() {
        var game = enchant.Game.instance;
        var image = game.assets['pad.png'];
        enchant.Sprite.call(this, image.width / 2, image.height);
        this.image = image;
        this.input = { left: false, right: false, up: false, down:false };
        this.addEventListener('touchstart', function(e) {
            this._updateInput(this._detectInput(e.localX, e.localY));
        });
        this.addEventListener('touchmove', function(e) {
            this._updateInput(this._detectInput(e.localX, e.localY));
        });
        this.addEventListener('touchend', function(e) {
            this._updateInput({ left: false, right: false, up: false, down:false });
        });
    },
    _detectInput: function(x, y) {
        x -= this.width / 2;
        y -= this.height / 2;
        var input = { left: false, right: false, up: false, down:false };
        if (x * x + y * y > 200) {
            if (x < 0 && y < x * x * 0.1 && y > x * x * -0.1) {
                input.left = true;
            }
            if (x > 0 && y < x * x * 0.1 && y > x * x * -0.1) {
                input.right = true;
            }
            if (y < 0 && x < y * y * 0.1 && x > y * y * -0.1) {
                input.up = true;
            }
            if (y > 0 && x < y * y * 0.1 && x > y * y * -0.1) {
                input.down = true;
            }
        }
        return input;
    },
    _updateInput: function(input) {
        var game = enchant.Game.instance;
        ['left', 'right', 'up', 'down'].forEach(function(type) {
            if (this.input[type] && !input[type]) {
                game.dispatchEvent(new Event(type + 'buttonup'));
            }
            if (!this.input[type] && input[type]) {
                game.dispatchEvent(new Event(type + 'buttondown'));
            }
        }, this);
        this.input = input;
    }
});

/**
 * アナログパッドのクラス: APad
 * @scope enchant.ui.APad
 */
enchant.ui.APad = enchant.Class.create(enchant.Group, {
    /**
     * アナログパッドオブジェクトを作成する。
     * @constructs
     * @extends enchant.Group
     * @param mode
     *   'direct': 入力ベクトルは正規化されない (大きさは 0~1 の間)
     *   'normal': 入力ベクトルを常に正規化する (大きさは常に1となる)
     */
	initialize: function(mode) {
        var game = enchant.Game.instance;
        var image = game.assets['apad.png'];
		var w = this.width = image.width;
		var h = this.height = image.height;
        enchant.Group.call(this);

		this.outside = new Sprite(w, h);
		var outsideImage = new Surface(w, h);
		outsideImage.draw(image,     0,     0,   w, h/4,     0,     0,   w, h/4);
		outsideImage.draw(image,     0, h/4*3,   w, h/4,     0, h/4*3,   w, h/4);
		outsideImage.draw(image,     0,   h/4, w/4, h/2,     0,   h/4, w/4, h/2);
		outsideImage.draw(image, w/4*3,   h/4, w/4, h/2, w/4*3,   h/4, w/4, h/2);
		this.outside.image = outsideImage;
		this.inside = new Sprite(w/2, h/2);
		var insideImage = new Surface(w/2, h/2);
		insideImage.draw(image, w/4, h/4, w/2, h/2, 0, 0, w/2, h/2);
		this.inside.image = insideImage;
        this.r = w/2;

        /**
         * isTouched
         * @type {Boolean}
         * タッチされているかどうか
         */
		this.isTouched = false;

        /**
         * vx, vy
         * @type {Number}
         * 入力ベクトルの(x, y)方向の大きさ
         */
        this.vx = 0;
		this.vy = 0;

        /**
         * rad, dist
         * @type {Number}
         * 入力ベクトルの極座標表示
         * radは角度、distはベクトルの大きさを示す
         */
        this.rad = 0;
        this.dist = 0;

		if (mode === 'direct') {
			this.mode = 'direct';
		} else {
			this.mode = 'normal';
		}
        this._updateImage();
		this.addChild(this.inside);
		this.addChild(this.outside);
		this.addEventListener('touchstart', function(e) {
			this._detectInput(e.localX, e.localY);
			this._calcPolar(e.localX, e.localY);
			this._updateImage(e.localX, e.localY);
			this._dispatchPadEvent('apadstart');
			this.isTouched = true;
		});
		this.addEventListener('touchmove', function(e) {
			this._detectInput(e.localX, e.localY);
			this._calcPolar(e.localX, e.localY);
			this._updateImage(e.localX, e.localY);
			this._dispatchPadEvent('apadmove');
		});
		this.addEventListener('touchend', function(e) {
			this._detectInput(this.width / 2, this.height / 2);
			this._calcPolar(this.width / 2, this.height / 2);
			this._updateImage(this.width / 2, this.height / 2);
			this._dispatchPadEvent('apadend');
			this.isTouched = false;
		});
	},
	_dispatchPadEvent: function(type) {
		var e = new Event(type);
		e.vx = this.vx;
		e.vy = this.vy;
		e.rad = this.rad;
		e.dist = this.dist;
		this.dispatchEvent(e);
	},
	_updateImage: function(x, y) {
		x -= this.width / 2;
		y -= this.height / 2;
		this.inside.x = this.vx * (this.r - 10) + 25;
		this.inside.y = this.vy * (this.r - 10) + 25;
	},
	_detectInput: function(x, y) {
		x -= this.width / 2;
		y -= this.height / 2;
		var distance = Math.sqrt(x * x + y * y);
		var tan = y / x;
		var rad = Math.atan(tan);
		var dir = x / Math.abs(x);
		if (distance == 0) {
			this.vx = 0;
			this.vy = 0;
		} else if (x == 0) {
			this.vx = 0;
			if (this.mode == 'direct') {
				this.vy = (y / this.r);
			} else {
				dir = y / Math.abs(y);
				this.vy = Math.pow((y / this.r), 2) * dir;
			}
		} else if (distance < this.r) {
			if (this.mode == 'direct') {
				this.vx = (x / this.r);
				this.vy = (y / this.r);
			} else {
				this.vx = Math.pow((distance / this.r), 2) * Math.cos(rad) * dir;
				this.vy = Math.pow((distance / this.r), 2) * Math.sin(rad) * dir;
			}
		} else {
			this.vx = Math.cos(rad) * dir;
			this.vy = Math.sin(rad) * dir;
		}
	},
	_calcPolar: function(x, y) {
		x -= this.width / 2;
		y -= this.height / 2;
		var add = 0;
		var rad = 0;
		var dist = Math.sqrt(x * x + y * y);
		if (dist > this.r) {
			dist = this.r;
		}
		dist /= this.r;
		if (this.mode == 'normal') {
			dist *= dist;
		}
		if (x >= 0 && y < 0) {
			add = Math.PI/2*3;
			rad = x / y;
		} else if (x < 0 && y <= 0) {
			add = Math.PI;
			rad = y / x;
		} else if (x <= 0 && y > 0) {
			add = Math.PI / 2;
			rad = x / y;
		} else if (x > 0 && y >= 0) {
			add = 0;
			rad = y / x;
		} 
		if (x == 0 || y == 0) {
			rad = 0;
		}
		this.rad = Math.abs(Math.atan(rad)) + add; 
		this.dist = dist;
	}
});

/**
 * ボタンオブジェクトのクラス: Button
 * @scope enchant.ui.Button.prototype
 */
enchant.ui.Button = enchant.Class.create(enchant.Entity, {
    /**
     * ボタンオブジェクトを作成する。
     * @constructs
     * @extends enchant.Entity
     */
    initialize: function(text, theme, height, width) {
        enchant.Entity.call(this);
        
        // ベンタプレフィクスを判定
        this.VENDOR_PREFIX = (function() {
            var ua = navigator.userAgent;
            if (ua.indexOf('Opera') != -1) {
                return '-O-';
            } else if (ua.indexOf('MSIE') != -1) {
                return '-ms-';
            } else if (ua.indexOf('WebKit') != -1) {
                return '-webkit-';
            } else if (navigator.product == 'Gecko') {
                return '-Moz-';
            } else {
                return '';
            }
        })();

        this.width = width || null;
        this.height = height || null;
        this.text = text;
        this.pressed = false;

        // デフォルトのスタイル (テーマで上書き可能)
        var style = this._element.style;
        style["display"]          = "inline-block";
        style["font-size"]        = "12px";
        style["height"]           = "2em";
        style["line-height"]      = "2em";
        style["min-width"]        = "2em";
        style["padding"]          = "2px 10px";
        style["text-align"]       = "center";
        style["font-weight"]      = "bold";
        style[this.VENDOR_PREFIX + "border-radius"] = "0.5em";

        // テーマの指定がなければ "dark" を使う
        theme = theme || "dark";

        if(typeof theme === "string"){
            // theme 引数が string なら、その名前のデフォルトテーマを使う
            this.theme = enchant.ui.Button.DEFAULT_THEME[theme];
        }else{
            // theme 引数が object なら、その引数をテーマとして扱う
            this.theme = theme;
        }

        // テーマを適用する
        this._applyTheme(this.theme.normal);

        // タッチしたときの挙動
        this.addEventListener("touchstart", function(){
            this._applyTheme(this.theme.active);
            this.pressed = true;
            this.y ++;
        });

        // タッチが離されたときの挙動
        this.addEventListener("touchend", function(){
            this._applyTheme(this.theme.normal);
            this.pressed = false;
            this.y --;
        });
    },
    _applyTheme: function(theme){
        var style = this._element.style;
        for(var i in theme) if(theme.hasOwnProperty(i)){
            var prop = i.replace(/\-VENDOR\-/, this.VENDOR_PREFIX);
            style[prop] = theme[i].replace(/\-VENDOR\-/, this.VENDOR_PREFIX);
            console.log("apply theme",i,":",theme[i]);
            console.log("# vendor prefix replaced : ",prop,":", theme[i].replace(/\-VENDOR\-/, this.VENDOR_PREFIX));
        }
    },
    /**
     * 表示するテキスト
     * @type {String}
     */
    text: {
        get: function() {
            return this._element.innerHTML;
        },
        set: function(text) {
            this._element.innerHTML = text;
        }
    },
    /**
     * フォントサイズ
     */
    size: {
        get: function() {
            return this._element.style["fontSize"];
        },
        set: function(size){
            this._element.style["fontSize"] = size;
        }
    },
    /**
     * フォントの指定
     * @type {String}
     */
    font: {
        get: function() {
            return this._style.font;
        },
        set: function(font) {
            this._style.font = font;
        }
    },
    /**
     * Text color settings.
     * CSS��'color' Can be set to same format as properties.
     * @type {String}
     */
    color: {
        get: function() {
            return this._style.color;
        },
        set: function(color) {
            this._style.color = color;
        }
    }
});

enchant.ui.Button.DEFAULT_THEME = {
    dark:
    {
        normal: {
            "background-image" : "-VENDOR-linear-gradient(#666, #333)",
            "color" : "#fff",
            "border" : "#333 1px solid",
            "text-shadow" : "0 1px 0 #666",
            "-VENDOR-box-shadow" : "0 1px 0 rgba(0,0,0,.8), 0 2px 0 rgba(255,255,255,.3)"
        },
        active: {
            "background-image" : "-VENDOR-linear-gradient(#333, #000)",
            "color" : "#ccc",
            "border" : "#333 1px solid",
            "text-shadow" : "0 1px 0 #000",
            "-VENDOR-box-shadow" : "0 1px 0 rgba(255,255,255,.3)"
        }
    },
    light:
    {
        normal: {
            "background-image" : "-VENDOR-linear-gradient(#fff, #ccc)",
            "color" : "#333",
            "border" : "#999 1px solid",
            "text-shadow" : "0 1px 0 #fff",
            "-VENDOR-box-shadow" : "0 1px 0 rgba(0,0,0,1), 0 2px 0 rgba(255,255,255,.2)"
        },
        active: {
            "background-image" : "-VENDOR-linear-gradient(#ccc, #999)",
            "color" : "#333",
            "border" : "#666 1px solid",
            "text-shadow" : "0 1px 0 #ccc",
            "-VENDOR-box-shadow" : "0 1px 0 rgba(255,255,255,.3)"
        }
    },
    blue:
    {
        normal: {
            "background-image" : "-VENDOR-linear-gradient(#04f, #04c)",
            "color" : "#fff",
            "border" : "#026 1px solid",
            "text-shadow" : "0 1px 0 #666",
            "-VENDOR-box-shadow" : "0 1px 0 rgba(0,0,0,.5), 0 2px 0 rgba(255,255,255,0.2)"
        },
        active: {
            "background-image" : "-VENDOR-linear-gradient(#029, #026)",
            "color" : "#ccc",
            "border" : "#026 1px solid",
            "text-shadow" : "0 1px 0 #000",
            "-VENDOR-box-shadow" : "none"
        }
    }
};
