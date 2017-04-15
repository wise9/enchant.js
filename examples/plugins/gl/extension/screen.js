enchant();
window.onload = function() {
    var game = new Game(320, 320);
    game.onload = function() {
        var scene = new Scene3D();
        var cam = scene.getCamera();
        cam.x = 0;
        cam.y = 3;
        cam.z = 4;

        var sun = new Sphere(0.3);
        sun.mesh.setBaseColor([1, 0, 0, 1]);

        var earth = new Sphere(0.1);
        earth.mesh.setBaseColor([0, 0.5, 1, 1]);
        earth.x = 1;

        var moon = new Sphere(0.08);
        moon.mesh.setBaseColor([1, 1, 0, 1]);
        moon.x = 0.2;

        scene.addChild(sun);
        sun.addChild(earth);
        earth.addChild(moon);

        sun.on("enterframe", function() {
            this.rotateYaw(0.02);
        });
        earth.on("enterframe", function() {
            this.rotateYaw(0.06);
        });

        var marker = new Sprite(60, 60);
        marker.scale(2, 2);
        marker.image = lockOnSight();
        marker.target = sun;
        game.rootScene.addChild(marker);
        document.getElementById("sun").onclick = function() {
            marker.target = sun;
        };
        document.getElementById("earth").onclick = function(e) {
            marker.target = earth;
        };
        document.getElementById("moon").onclick = function(e) {
            marker.target = moon;
        };
        marker.on("enterframe", function() {
            var coord = this.target.getScreenCoord();
            this.x = coord.x - 30;
            this.y = coord.y - 30;
        });
    };
    game.start();
};

function lockOnSight() {
    var s = new Surface(60, 60);
    var ctx = s.context;
    ctx.fillStyle = "rgba(255, 255, 0, 0.8)";
    
    ctx.beginPath();
    ctx.moveTo(20, 0);
    ctx.lineTo(40, 0);
    ctx.lineTo(30, 20);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(20, 60);
    ctx.lineTo(40, 60);
    ctx.lineTo(30, 40);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(0, 20);
    ctx.lineTo(0, 40);
    ctx.lineTo(20, 30);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(60, 20);
    ctx.lineTo(60, 40);
    ctx.lineTo(40, 30);
    ctx.closePath();
    ctx.fill();

    return s;
}