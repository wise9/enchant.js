enchant.Pad = enchant.Class.create(enchant.Sprite, {
    initialize: function() {
        enchant.Sprite.call(this, 100, 100);
        this.image = this.game.assets['pad.png'];
        this.state = null;
        this.addEventListener('touchmove', function(e) {
            var x = e.localX - 50;
            var y = e.localY - 50;
            if (x < 0 && ((x-5) * (x-5)) / 100 - (y * y) / 200 > 1) {
                this.frame = 1;
                this.rotation = -90;
                if (this.state != 'left') this.game.dispatchEvent(new Event(this.state + 'buttonup'));
                this.state = 'left';
                this.game.dispatchEvent(new Event('leftbuttondown'));
            } else if (x > 0 && ((x+5) * (x+5)) / 100 - (y * y) / 200 > 1) {
                this.frame = 1;
                this.rotation = 90;
                if (this.state != 'right') this.game.dispatchEvent(new Event(this.state + 'buttonup'));
                this.state = 'right';
                this.game.dispatchEvent(new Event('rightbuttondown'));
            } else if (y < 0 && ((y-5) * (y-5)) / 100 - (x * x) / 200 > 1) {
                this.frame = 1;
                this.rotation = 0;
                if (this.state != 'up') this.game.dispatchEvent(new Event(this.state + 'buttonup'));
                this.state = 'up';
                this.game.dispatchEvent(new Event('upbuttondown'));
            } else if (y > 0 && ((y+5) * (y+5)) / 100 - (x * x) / 200 > 1) {
                this.frame = 1;
                this.rotation = 180;
                if (this.state != 'down') this.game.dispatchEvent(new Event(this.state + 'buttonup'));
                this.state = 'down';
                this.game.dispatchEvent(new Event('downbuttondown'));
            } else {
                this.frame = 0;
                if (this.state) this.game.dispatchEvent(new Event(this.state + 'buttonup'));
                this.state = null;
            }
        });
        this.addEventListener('touchend', function(e) {
            this.frame = 0;
            if (this.state) this.scene.dispatchEvent(new Event(this.state + 'buttonup'));
            this.state = null;
        });
    },
});
