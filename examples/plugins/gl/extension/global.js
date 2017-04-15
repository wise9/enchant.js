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

        var marker = new Marker();
        marker.target = sun;
        scene.addChild(marker);
        document.getElementById("sun").onclick = function() {
            marker.target = sun;
        };
        document.getElementById("earth").onclick = function() {
            marker.target = earth;
        };
        document.getElementById("moon").onclick = function() {
            marker.target = moon;
        };
        marker.on("enterframe", function() {
            var gc = this.target.getWorldCoord();
            this.x = gc.x;
            this.y = gc.y + 0.3;
            this.z = gc.z;
        });
    };
    game.start();
};

var Marker = Class.create(Sprite3D, {
    initialize: function() {
        Sprite3D.call(this);
        var m = new Mesh();
        m.texture = new Texture();
        m.vertices = [
            0, 0, 0,
            -.1, .5, 0,
            .1, .5, 0,
            0, 0, 0,
            -.1, .5, 0,
            .1, .5, 0
        ];
        m.normals = [
            0, 0, 1,
            0, 0, 1,
            0, 0, 1,
            0, 0, -1,
            0, 0, -1,
            0, 0, -1
        ];
        m.texCoords = [
            0, 0,
            0, 0,
            0, 0,
            0, 0,
            0, 0,
            0, 0
        ];
        m.indices = [
            0, 2, 1,
            3, 4, 5
        ];
        m.setBaseColor([1, 1, 0, 1]);
        this.mesh = m;
        this.on("enterframe", function() {
            this.rotateYaw(0.1);
        });
    }
});
