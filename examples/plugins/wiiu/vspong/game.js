enchant();
window.onload = function(){
    game = new Game(854/2, 448/2);
    game.preload("pong.png");
    game.fps = 30;
    game.onload = function(){
        var title = new Sprite(208, 32);  // [A]ここから
        title.image = game.assets["pong.png"];
        title.frame = 1;
        title.moveTo(game.width/2 - title.width/2, 80);
        game.rootScene.addChild(title);
        title.tl.delay(60).then(function() {
            game.rootScene.removeChild(title);
        });
        var myscore = new Sprite(32, 32); // [B]ここから
        myscore.image = game.assets["pong.png"];
        myscore.moveTo(game.width/2 - 48, 16);
        game.rootScene.addChild(myscore);
        var enemyscore = new Sprite(32, 32);
        enemyscore.moveTo(game.width/2, 16);
        enemyscore.image = game.assets["pong.png"];
        game.rootScene.addChild(enemyscore); // [B]ここまで
        var player = new Sprite(8, 80);   // [C]
        player.moveTo(8, 0);
        player.backgroundColor = "white";
        game.rootScene.addChild(player);

        if(window.wiiu){
            game.rootScene.on("enterframe", function(evt){
                player.x += game.input.lstick.x * 3;
                player.y += game.input.lstick.y * 3;
                enemy. x += game.input.rstick.x * 3;
                enemy.y  += game.input.rstick.y * 3;
            });                               // [C]ここまで

        }else{
            game.rootScene.on("touchmove", function(evt){
                if(evt.x < game.width/2){
                player.y = evt.localY - 40;
                }else{
                enemy.y = evt.localY - 40;
                }
            });                               // [C]ここまで
        }
        
        var enemy = new Sprite(8, 80);    // [D]
        enemy.backgroundColor = "white"
        game.rootScene.addChild(enemy);
        enemy.moveTo(game.width-16, 0);
        enemy.vy = 0;
        ball = addBall();                 // [E]
        game.rootScene.backgroundColor = "black";
    function addBall(){                   // [F]
        var ball = new Sprite(8, 8);
        ball.vx = 2*3;    // [F1]ここから
        ball.vy = 4*3;
        ball.moveTo(game.width/2, game.height/2);
        ball.backgroundColor = "white";
        game.rootScene.addChild(ball); // [F1]ここまで
        ball.addEventListener("enterframe", function(){
            this.x += this.vx;  // [F2]
            this.y += this.vy;  // [F2]
            if(this.intersect(player)){ //[F3]ここから
                this.x = 24;
                this.vx = 0.2 - this.vx;
                this.vy -= (player.y + 40 - this.y)/10 ;
            }
            if(this.intersect(enemy)){
                this.x = game.width - 20;
                this.vx *= -1;
                this.vx -= 2;
                this.vy -= (enemy.y + 40 - this.y)/10;
            }                           // [F3]ここまで
            if(this.x > game.width){           // [F4]ここから
                myscore.frame ++;  
                if(myscore.frame == 3 || myscore.frame == 5){
                    setTimeout(addBall, 1500);
                }
                if(myscore.frame == 7){
                    title.frame = 2;
                    game.rootScene.addChild(title);
                    game.pause();
                }
                this.moveTo(game.width/2, game.height/2);
                this.vx = 2;
                this.vy = -4;
            }
            if(this.x < 0){
                enemyscore.frame ++;
                if(enemyscore.frame == 7){
                    title.frame = 3;
                    game.rootScene.addChild(title);
                    game.pause();
                }
                this.moveTo(game.width/2, game.height/2);
                this.vx = -2;
                this.vy = 4;
            }                       // [F4]ここまで
            if(this.y > game.height){       // [F5]ここから
                this.y = game.height;
                this.vy *= -1;
            }
            if(this.y < 0){
                this.y = 0;
                this.vy *= -1;
            }                       // [F5]ここまで
        });
        return ball;
    }   // [F]ここまで
       }
    game.start();
}