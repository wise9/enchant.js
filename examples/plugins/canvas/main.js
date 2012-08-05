enchant();

var game;

window.onload = function () {
    game = new Game(320, 320);
    game.fps = 30;
    game.preload('chara1.gif');
    game.onload = function () {
        
        // CanvasGroup に addChild されたノードは canvas上で描画されます。
        // 回転や拡大縮小などを含む場合、DOMよりも高速な描画が可能です。
        var canvasGroup = new CanvasGroup();
        game.rootScene.addChild(canvasGroup);
        
        var bear = new Sprite(32, 32);
        bear.image = game.assets['chara1.gif'];
        canvasGroup.addChild(bear);

        bear.vx = 3;
        bear.vy = 2;
        bear.onenterframe = function(){
            this.x += this.vx;
            this.y += this.vy;
            if(bear.x > 288 || this.x < 0)this.vx *= -1;
            if(bear.y > 288 || this.y < 0)this.vy *= -1;
            this.rotation += 5;
        };
    };
    game.start();
};
