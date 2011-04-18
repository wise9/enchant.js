enchant();

window.onload = function() {
    var game = new Game(320, 320);
    game.preload('bear.gif');
    game.onload = function() {
        var bear = new Sprite(20, 30);
        bear.image = game.assets['bear.gif'];
        bear.addEventListener('enterframe', function() {
            this.x += 3;
        });
        game.rootScene.addChild(bear);
    };
    game.start();
};
