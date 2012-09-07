enchant();

window.onload = function() {
    var game = new Game(320, 320);
    game.fps = 20;
    game.preload('chara1.png', 'map1.gif');
    game.onload = function() {
        var map = new Map(16, 16);
        map.image = game.assets['map1.gif'];
        map.loadData([[0,2,1,3,0]]);
        game.rootScene.addChild(map);
    };
    game.start();
};

