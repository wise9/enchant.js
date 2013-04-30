enchant();

window.onload = function(){
    var core = new Game(320, 320);
    core.preload('chara1.png', 'icon0.png')
    core.onload = function(){

        var bear = new enchant.Sprite(32, 32);
        bear.image = core.assets['chara1.png'];
        bear.moveTo(144, 144);
        core.rootScene.addChild(bear);

        var apple = new enchant.Sprite(16, 16);
        apple.image = core.assets['icon0.png'];
        apple.frame = 15;
        apple.moveTo(180, 152);
        core.rootScene.addChild(apple);
    };
    core.start();
};