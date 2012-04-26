enchant.nineleap = { assets: ['start.png', 'end.png'] };
enchant.nineleap.Game = enchant.Class.create(enchant.Game, {
    initialize: function(width, height) {
        enchant.Game.call(this, width, height);
        this.addEventListener('load', function() {
            var game = this;
            this.startScene = new SplashScene();
            this.startScene.image = this.assets['start.png'];
            this.startScene.addEventListener('touchend', function() {
                if (game.currentScene == this) game.popScene();
            });
            this.addEventListener('keydown', function() {
                if (this.currentScene == this.startScene) this.popScene();
                this.removeEventListener('keydown', arguments.callee);
            });
            this.pushScene(this.startScene);

            this.endScene = new SplashScene();
            this.endScene.image = this.assets['end.png'];
        });
    },
    end: function(score, result) {
        this.pushScene(this.endScene);
        if (location.hostname == 'r.jsgames.jp') {
            var submit = function() {
                var id = location.pathname.match(/^\/games\/(\d+)/)[1]; 
                location.replace([
                    'http://9leap.net/games/', id, '/result',
                    '?score=', encodeURIComponent(score),
                    '&result=', encodeURIComponent(result)
                ].join(''));
            }
            this.endScene.addEventListener('touchend', submit);
            window.setTimeout(submit, 3000);
        }
        this.end = function() {};
    }
});

enchant.nineleap.SplashScene = enchant.Class.create(enchant.Scene, {
    image: {
        get: function() {
            return this._image;
        },
        set: function(image) {
            this._image = image;

            while (this.firstChild) {
                this.removeChild(this.firstChild);
            }
            var sprite = new Sprite(image.width, image.height);
            sprite.image = image;
            sprite.x = (this.width - image.width) / 2;
            sprite.y = (this.height - image.height) / 2;
            this.addChild(sprite);
        }
    }
});
