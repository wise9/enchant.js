enchant();
var game;
window.onload = function() {
    game = new Game(320, 320);
    game.fps = 30;
    game.onload = function() {
        sprites = [];
        var scene = new Scene3D();
        scene.backgroundColor = [1, 1, 1, 0.1];
        for (var i = 0; i < 9; i++) {
            var sp = new Cube(0.1);
            sp.mesh.setBaseColor([1, 0, 0, 1]);
            sp.x = -1;
            sp.y = 1.2 - i * 0.3;
            sprites.push(sp);
            scene.addChild(sp);
        }

        sprites[0].addEventListener("touchstart", function() {
            this.tl.moveBy(2.0, 0.0, 0.0, 60, enchant.Easing.LINEAR);
            console.log(this.tl);
        });
        sprites[1].addEventListener("touchstart", function(){
            this.tl.moveBy(2.0, 0.0, 0.0, 60, enchant.Easing.QUINT_EASEOUT);
        });
        sprites[2].addEventListener("touchstart", function(){
            this.tl.moveBy(2.0, 0.0, 0.0, 60, enchant.Easing.QUINT_EASEIN);
        });
        sprites[3].addEventListener("touchstart", function(){
            this.tl.moveBy(2.0, 0.0, 0.0, 60, enchant.Easing.QUINT_EASEINOUT);
        });
        sprites[4].addEventListener("touchstart", function(){
            this.tl.moveBy(0.2, 0.0, 0.0, 10, enchant.Easing.QUINT_EASEINOUT).delay(30);
            this.tl.looped = true;
        });
        sprites[5].addEventListener("touchstart", function(){
            this.tl.moveBy(2.0, 0.0, 0.0, 60, enchant.Easing.BOUNCE_EASEOUT).moveBy(-2.0, 0.0, 0.0, 60, enchant.Easing.BACK_EASEOUT);
        });
        sprites[6].addEventListener("touchstart", function(){
            this.tl.scaleTo(3, 0.1, 5, 30, enchant.Easing.BOUNCE_EASEOUT).scaleTo(1, 60, enchant.Easing.BOUNCE_EASEOUT);
        });
        sprites[7].addEventListener("touchstart", function(){
            this.tl.scaleTo(3, 30, enchant.Easing.BOUNCE_EASEOUT).scaleTo(1, 60);
        });
        sprites[8].addEventListener("touchstart", function(){
            this.tl.rotateBy(new Quat(0, 0, 1, Math.PI), 60, enchant.Easing.QUAD_EASEINOUT);
        });
    };
    game.start();
};
