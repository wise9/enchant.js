enchant();

window.onload = function() {
    var game = new Game(320, 320);
    game.fps = 20;
    game.preload('chara1.png', 'map0.png');
    game.onload = function() {
        var map = new Map(16, 16);
        map.image = game.assets['map0.png'];
        map.loadData(
            [
                [4, 4, 4, 4, 4, 4, 4],
                [4, 5, 5, 5, 5, 5, 4],
                [4, 5, 4, 5, 4, 5, 4],
                [4, 5, 5, 5, 5, 5, 4],
                [4, 5, 4, 5, 4, 5, 4],
                [4, 5, 5, 5, 5, 5, 4],
                [4, 4, 4, 4, 4, 4, 4]
            ]
        );
        game.rootScene.addChild(map);
    };
    game.start();
};
