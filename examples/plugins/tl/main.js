enchant();

window.onload = function(){
    game = new Game(320, 320);
    game.preload();
    game.fps = 30;
    game.onload = function(){
        sprites = [];
        for(var i = 0; i < 9; i++){
            var sp = new Sprite(16, 16);
            sp.backgroundColor = "red";
            sp.x = 32;
            sp.y = 30 * i + 32;
            sprites.push(sp);
            game.rootScene.addChild(sp);
        }

        sprites[0].addEventListener("touchstart", function(){
            this.tl.moveBy(200, 0, 60, enchant.Easing.LINEAR);
            console.log(this.tl);
        });
        sprites[1].addEventListener("touchstart", function(){
            this.tl.moveBy(200, 0, 60, enchant.Easing.QUINT_EASEOUT);
        });
        sprites[2].addEventListener("touchstart", function(){
            this.tl.moveBy(200, 0, 60, enchant.Easing.QUINT_EASEIN);
        });
        sprites[3].addEventListener("touchstart", function(){
            this.tl.moveBy(200, 0, 60, enchant.Easing.QUINT_EASEINOUT);
        });
        sprites[4].addEventListener("touchstart", function(){
            this.tl.moveBy(20, 0, 10, enchant.Easing.QUINT_EASEINOUT).delay(30);
            this.tl.looped = true;
        });
        sprites[5].addEventListener("touchstart", function(){
            this.tl.moveBy(200, 0, 60, enchant.Easing.BOUNCE_EASEOUT).moveBy(-200, 0, 60, enchant.Easing.BACK_EASEOUT);
        });
        sprites[6].addEventListener("touchstart", function(){
            this.tl.fadeOut(30).delay(30).fadeIn(30);
        });
        sprites[7].addEventListener("touchstart", function(){
            this.tl.scaleTo(3, 30, enchant.Easing.BOUNCE_EASEOUT).scaleTo(1, 60);
        });
        sprites[8].addEventListener("touchstart", function(){
            this.tl.rotateBy(720, 300, enchant.Easing.QUINT_EASEOUT);
        });
    }
    game.start();
}

