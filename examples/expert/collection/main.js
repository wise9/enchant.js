enchant();

Bear = enchant.Class.create(Sprite, {
    initialize: function() {
        var game = enchant.Game.instance;
        Sprite.call(this, 32, 32);
        this.image = game.assets['chara1.png'];
        this.addEventListener('enterframe', function() {
            if (this.x < -320 || 640 < this.x ||
                this.y < -320 || 640 < this.y) {
                this.scene.removeChild(this);
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
            this.scene.addChild(bullet);
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
                this.scene.removeChild(this);
            }
        });
    }
});

window.onload = function() {
    var game = new Game(320, 320);
    game.preload('chara1.png', 'icon0.png');
    game.onload = function() {
        var info = new Label('');
        game.rootScene.addChild(info);

        var player = new Player();
        player.x = 144;
        player.y = 144;
        game.rootScene.addChild(player);

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
            info.text = 'Entity: ' + Entity.collection.length + '<br/>' +
                'Sprite: ' + Sprite.collection.length + '<br/>' +
                'Label: ' + Label.collection.length + '<br/>' +
                'Enemy: ' + Enemy.collection.length + '<br/>' +
                'SineEnemy: ' + SineEnemy.collection.length + '<br/>' +
                'Bullet: ' + Bullet.collection.length;
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
