enchant();
var game;
window.onload = function() {
    game = new Game(320, 320);
    game.onload = function() {
        var scene = new Scene3D();

        var cam = scene.getCamera();
        cam.angle = 0;
        cam.y = 5;
        game.on("enterframe", function() {
            cam.x = Math.cos(cam.angle) * 10;
            cam.z = Math.sin(cam.angle) * 10;
            cam.angle += 0.02;
        });

        var box1 = new Box(2.0, 0.2, 0.4);
        box1.bounding = new AABB2();
        box1.bounding.scaleX = 1.0;
        box1.bounding.scaleY = 0.2;
        box1.bounding.scaleZ = 0.4;
        scene.addChild(box1);

        game.on("enterframe", function() {
            if (game.frame % 20 !== 0) return;
            var sx = Math.random() * 0.7 + 0.1;
            var sy = Math.random() * 0.7 + 0.1;
            var sz = Math.random() * 0.7 + 0.1;
            var b = new Box(sx, sy, sz);
            b.bounding = new AABB2();
            b.bounding.scaleX = sx;
            b.bounding.scaleY = sy;
            b.bounding.scaleZ = sz;
            b.x = Math.random() * 2 - 1;
            b.y = 2;
            b.z = Math.random() * 2 - 1;
            b.on("enterframe", function() {
                if (this.intersect(box1)) {
                    this.y -= 0.02;
                    this.mesh.setBaseColor([1, 1, 0, 1]);
                } else {
                    this.y -= 0.1;
                    this.mesh.setBaseColor([0, 1, 1, 1]);
                }
                if (this.y < -4) scene.removeChild(this);
            });
            scene.addChild(b);
        });
    };
    game.start();
};
