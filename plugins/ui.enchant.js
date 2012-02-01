enchant.ui = { assets: ['pad.png', 'apad.png'] };
enchant.ui.Pad = enchant.Class.create(enchant.Sprite, {
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

enchant.ui.APad = enchant.Class.create(enchant.Group, {
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
		this.isTouched = false;
		this.r = w/2;
		this.vx = 0;
		this.vy = 0;
		this._updateImage();
		if (mode == 'direct') {
			this.mode = 'direct';
		} else {
			this.mode = 'normal';
		}
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
