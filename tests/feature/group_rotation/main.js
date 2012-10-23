/**
 * グループの回転。
 */

enchant();
window.onload = function() {
    var game = new Game(320, 320);
    game.preload('chara1.png');
    game.onload = function() {
        var bear = new Sprite(32, 32);
        bear.image = game.assets['chara1.png'];
        bear.frame = 1;
        bear.x = 0;

        var white = new Sprite(32, 32);
        white.image = game.assets['chara1.png'];
        white.x = 32;
        white.y = 32;
        white.frame = 5;

        var group = new enchant.Group();
        group.addChild(bear);
        group.addChild(white);
        group.originX = 32;
        group.originY = 32;

        game.rootScene.addChild(group);
        group.on('enterframe', function() {
            this.rotation += 2;
            this.x += 1;
            this.y += 1;
        });
    };
    game._debug = true;
    game.start();
};