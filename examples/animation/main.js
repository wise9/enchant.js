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
            this.animation.moveBy(200, 0, 60, enchant.Easing.LINEAR);
        });
        sprites[1].addEventListener("touchstart", function(){
            this.animation.moveBy(200, 0, 60, enchant.Easing.QUINT_EASEOUT);
        });
        sprites[2].addEventListener("touchstart", function(){
            this.animation.moveBy(200, 0, 60, enchant.Easing.QUINT_EASEIN);
        });
        sprites[3].addEventListener("touchstart", function(){
            this.animation.moveBy(200, 0, 60, enchant.Easing.QUINT_EASEINOUT);
        });
        sprites[4].addEventListener("touchstart", function(){
            this.animation.moveBy(20, 0, 10, enchant.Easing.QUINT_EASEINOUT).delay(30);
            this.animation.looped = true;
        });
        sprites[5].addEventListener("touchstart", function(){
            this.animation.moveBy(200, 0, 60, enchant.Easing.BOUNCE_EASEOUT).moveBy(-200, 0, 60, enchant.Easing.BACK_EASEOUT);
        });
        sprites[6].addEventListener("touchstart", function(){
            this.animation.fadeOut(30).delay(30).fadeIn(30);
        });
        sprites[7].addEventListener("touchstart", function(){
            this.animation.scaleTo(3, 30, enchant.Easing.BOUNCE_EASEOUT).scaleTo(1, 60);
        });
        sprites[8].addEventListener("touchstart", function(){
            this.animation.rotateBy(720, 300, enchant.Easing.QUINT_EASEOUT);
        });
/*        sprites[1].animation.moveBy(288, 0, 60, enchant.Easing.QUAD_EASEIN);
        sprites[2].animation.moveBy(288, 0, 60, enchant.Easing.QUAD_EASEOUT);
        sprites[3].animation.moveBy(288, 0, 60, enchant.Easing.QUAD_EASEINOUT);
        sprites[4].animation.moveBy(288, 0, 60, enchant.Easing.SIN_EASEIN);
        sprites[5].animation.moveBy(288, 0, 60, enchant.Easing.SIN_EASEOUT);
        sprites[6].animation.moveBy(288, 0, 60, enchant.Easing.SIN_EASEINOUT);
        sprites[7].animation.moveBy(288, 0, 60, enchant.Easing.BOUNCE_EASEIN);
        sprites[8].animation.moveBy(288, 0, 60, enchant.Easing.BOUNCE_EASEOUT);
        sprites[9].animation.moveBy(288, 0, 60, enchant.Easing.BOUNCE_EASEINOUT);
        sprites[10].animation.moveBy(288, 0, 60, enchant.Easing.QUAD_EASEIN);
        sprites[11].animation.moveBy(288, 0, 60, enchant.Easing.QUAD_EASEOUT);
        sprites[12].animation.moveBy(288, 0, 60, enchant.Easing.QUAD_EASEINOUT);
        sprites[13].animation.moveBy(288, 0, 60, enchant.Easing.SIN_EASEIN);
        sprites[14].animation.moveBy(288, 0, 60, enchant.Easing.SIN_EASEOUT);
        sprites[15].animation.moveBy(288, 0, 60, enchant.Easing.SIN_EASEINOUT);
        sprites[16].animation.moveBy(288, 0, 60, enchant.Easing.BOUNCE_EASEIN);
        sprites[17].animation.moveBy(288, 0, 60, enchant.Easing.BOUNCE_EASEOUT);
        sprites[9].animation.moveBy(288, 0, 60, enchant.Easing.BOUNCE_EASEINOUT);
        */
    }
    game.start();
}

