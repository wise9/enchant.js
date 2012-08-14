enchant();

window.onload = function() {
    var game = new Game(320, 320);
    game.preload('chara1.png');
    game.fps = 20;

    game.onload = function() {
        var bear = new Sprite(32, 32);
        bear.image = game.assets['chara1.gif'];
        game.rootScene.addChild(bear);
        var white = new Sprite(32, 32);
        white.image = game.assets['chara1.gif'];
        game.rootScene.addChild(white);
    };


    game.start();
}