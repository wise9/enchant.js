enchant();
window.onload = function () {
    console.log('hello enchant.js');
    var game = new Game(320, 320);
    game.preload('i.png', 'c.png', 'e.png', '4.png');
    game.onload = function(){
        var back = new Sprite(320, 320);
        back.image = game.assets['e.png'];
        back.addEventListener('enterframe', function(){
            this.y += 3 + (game.frame / 100);
            if(this.y > 320){
                this.y = -320;
            }
        });
        game.rootScene.addChild(back);
        
        var car = new Sprite(32, 32);
        car.image = game.assets['4.png'];
        car.y = 280;
        game.rootScene.addChild(car);
        
        game.rootScene.addEventListener('touchmove', function(e){
            car.x = (2 * car.x + e.x) / 3;
        });
        game.rootScene.addEventListener('enterframe', function(){
            if(Math.random() < 0.05){
                var bear = new Sprite(32, 32);
                bear.image = game.assets['c.png'];
                bear.x = Math.random() * 320;
                bear.frame = 15;
                bear.y = -32;
                bear.addEventListener('enterframe', function(){
                    this.y += 3 + (game.frame / 100);
                    if(this.within(car, 20)){
                        this.frame = 18;
                        game.end();
                    }
                });
                game.rootScene.addChild(bear);
            }
        });
    }
    game.start();
}

window.addEventListener('message', function (e) {
    console.log(e);
});