enchant();

Bear = enchant.Class.create(Sprite, {
    initialize: function() {
        var game = enchant.Game.instance;
        Sprite.call(this, 32, 32);
        this.image = game.assets['chara1.png'];
        this.addEventListener('enterframe', function() {
            if (this.x < -320 || 640 < this.x ||
                this.y < -320 || 640 < this.y) {
                this.parentNode.removeChild(this);
            }
        });
    }
});

Player = enchant.Class.create(Bear, {
    initialize: function() {
        Bear.call(this);
    },
    onenterframe: function() {
        if (this.age % 15 == 0) {
            var bullet = new Bullet(this.x + 8, this.y - 8);
            this.parentNode.addChild(bullet);
        }
    }
});

Enemy = enchant.Class.create(Bear, {
    initialize: function() {
        Bear.call(this);
        this.frame = 5;
        this.y = -32;
        this.x = Math.random() * 288;
        this.addEventListener('enterframe', function() {
            this.y += 1;
        });
    }
});

SineEnemy = enchant.Class.create(Enemy, {
    initialize: function() {
        Enemy.call(this);
        this.addEventListener('enterframe', function() {
            this.x += Math.sin(this.age / 10);
        });
    }
});

Bullet = enchant.Class.create(Sprite, {
    initialize: function(x, y) {
        var game = enchant.Game.instance;
        Sprite.call(this, 16, 16);
        this.image = game.assets['icon0.png'];
        this.x = x;
        this.y = y;
        this.frame = 48;
        this.addEventListener('enterframe', function() {
            this.y -= 1;
        });
        this.addEventListener('enterframe', function() {
            if (this.x < -320 || 640 < this.x ||
                this.y < -320 || 640 < this.y) {
                this.parentNode.removeChild(this);
                //this.remove();
            }
        });
    }
});

enchant();

window.onload = function() {
    var game = new Game(320, 320);
    game.preload('chara1.png', 'icon0.png');
    game.onload = function() {
        var player = new Player();
        player.x = 144;
        player.y = 144;
        var info = new Label('');

        game.rootScene.addChild(player);
        game.rootScene.addChild(info);

        var touchX, touchY;
        touchX = touchY = 160;
        game.rootScene.addEventListener('touchstart', function(e) {
            touchX = e.x;
            touchY = e.y;
        });
        game.rootScene.addEventListener('touchmove', function(e) {
            touchX = e.x;
            touchY = e.y;
        });
        player.addEventListener('enterframe', function() {
            this.x += (touchX - this.x - 16) / 10;
            this.y += (touchY - this.y - 16) / 10;
        });

        game.rootScene.addEventListener('enterframe', function() {
            info.text = '';
            info.text += 'Entity: ' + Entity.collection.length;
            info.text += 'Sprite: ' + Sprite.collection.length;
            info.text += 'Label: ' + Label.collection.length;
            info.text += 'Enemy: ' + Enemy.collection.length;
            info.text += 'SineEnemy: ' + SineEnemy.collection.length;
            info.text += 'Bullet: ' + Bullet.collection.length;
            if (game.frame % 30 == 0) {
                this.addChild(new (Math.random() > 0.5 ? Enemy : SineEnemy)());
            }
            var set = Bullet.intersect(Enemy);
            for (var i = 0, l = set.length; i < l; i++) {
                set[i][0].remove();
                set[i][1].remove();
            }
        });
};
    game.start();
};
