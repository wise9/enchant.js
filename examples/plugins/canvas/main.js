enchant();

var game;

window.onload = function () {
    game = new Game(320, 320);
    game.fps = 30;
    game.preload('chara1.gif');
    game.onload = function () {
        
        // CanvasGroup に addChild されたノードは canvas上で描画されます。
        // 回転や拡大縮小などを含む場合、DOMよりも高速な描画が可能です。
        // enchant.js v0.7では、特に宣言のないGroupはCanvasによって描画されます。
        var canvasGroup = new Group();
        game.rootScene.addChild(canvasGroup);
        
        function addBear () {
            var bear = new Sprite(32, 32);
            bear.image = game.assets['chara1.gif'];
            canvasGroup.addChild(bear);
            bear.frame = 5;
            bear.vx = 3;
            bear.vy = 2;
            bear.vs = 0.01;
            bear.onenterframe = function(){
                this.x += this.vx;
                this.y += this.vy;
                if(this.x > 288 || this.x < 0){
                    this.vx *= -1;
                    this.vs *= -1;
                }
                if(this.y > 288 || this.y < 0){
                    this.vy *= -1;
                    this.vs *= -1;
                }
                this.rotation += 5;
                this.scaleX += this.vs;
                this.scaleY += this.vs;
            };
            return bear;
        }
        addBear();
        
        // クリックするとクマが登場
        game.rootScene.addEventListener('touchend', function(evt){
            var bear = addBear();
            bear.moveTo(evt.localX, evt.localY);
        })
    };
    game.start();
};
