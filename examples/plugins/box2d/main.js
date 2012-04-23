enchant();

var game, physicsWorld;

window.onload = function () {
    game = new Game(320, 320);
    game.fps = 30;
    game.preload("chara1.gif", "icon1.png", "map2.gif");
    game.onload = function () {
        physicsWorld = new PhysicsWorld(0, 9.8);

        for(var i = 0; i < 20; i++){
            //床を生成
            var floor = new PhyBoxSprite(16, 16, enchant.box2d.STATIC_SPRITE, 1.0, 0.5, 0.3, true);
            floor.image = game.assets["map2.gif"];
            floor.frame = 2;
            floor.position = { x: i*16, y: 300 };
            game.rootScene.addChild(floor);
        }

        game.rootScene.addEventListener("enterframe", function () {
            physicsWorld.step(game.fps);
            if(game.frame % game.fps == 0){
                //ボールを生成
                var ball = new PhyCircleSprite(8, enchant.box2d.DYNAMIC_SPRITE, 1.0, 0.5, 0.2, true);
                ball.image = game.assets["icon1.png"];
                ball.frame = 4;
                ball.position = { x: 0, y: 120 };
                ball.applyImpulse(new b2Vec2(Math.random(), 0));
                game.rootScene.addChild(ball);
                ball.addEventListener("enterframe", function(){
                    if(ball > 320)ball.destroy();
                })
            }
        });
        game.rootScene.addEventListener("touchstart", function (evt) {
                //ボールを生成
                var ball = new PhyCircleSprite(8, enchant.box2d.DYNAMIC_SPRITE, 1.0, 0.5, 0.2, true);
                ball.image = game.assets["icon1.png"];
                ball.frame = 3;
                ball.position = { x: evt.x, y: evt.y };
                ball.applyImpulse(new b2Vec2(Math.random() * 0.1, 0));
                game.rootScene.addChild(ball);
                ball.addEventListener("enterframe", function(){
                    if(ball > 320)ball.destroy();
                })


        });


    };
    game.start();
};
