enchant();
var game;
window.onload = function() {
    game = new Game(320, 320);
    game.onload = function() {
        var scene = new Scene3D();

        for (var i = 0; i < 12; i++) {
            var cube = new Cube();
            scene.addChild(cube);
            cube.on("enterframe", function(){
                if (this.age % 40 !== 0) return;
                var mx = Math.random() * 5 - 2.5;
                var my = Math.random() * 5 - 2.5;
                var mz = Math.random() * 5 - 2.5;
                var rx = Math.random();
                var ry = Math.random();
                var rz = Math.random();
                var ra = Math.random() * Math.PI * 2;
                var sx = Math.random();
                var sy = Math.random();
                var sz = Math.random();
                this.tl
                    .moveTo(mx, my, mz, 60, enchant.Easing.BOUNCE_EASEOUT)
                    .and()
                    .rotateBy(new Quat(rx, ry, rz, ra), 60, enchant.Easing.QUAD_EASEINOUT)
                    .and()
                    .scaleXYZTo(sx, sy, sz, 60, enchant.Easing.SWING);
            });
        }
    };
    game.start();
};
