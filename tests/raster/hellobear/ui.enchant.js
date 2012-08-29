enchant.ui = { assets: ['pad.png'] };
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
