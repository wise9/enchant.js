enchant();
var game;

window.onload = function(){
    game = new Game(640, 640);
    game.fps = 60;
    game.keybind(32, 'a');
    game.onload = function(){
        var ballsNum = 30;
        var playing = true;
        var sum = 0;

        var label = new Label();
        label.font = '24px helvetica';
        label._style.color = '#ffffff';
        game.rootScene.addChild(label);
        game.addEventListener('enterframe', function() {
            sum += this.actualFps;
            if (this.frame % this.fps == 0) {
                label.text = (sum / this.fps).toFixed(2);
                sum = 0;
            }
        });

        var boxtex = new Texture("../../../images/enchant.png");
        boxtex.ambient = [ 0.6, 0.6, 0.7, 1.0 ];
        boxtex.diffuse = [ 0.4, 0.4, 0.3, 1.0 ];
        boxtex.specular = [ 0.1, 0.1, 0.2, 1.0 ];

        var spheretex = new Texture("../../../images/enchant-sphere.png");
        spheretex.ambient = [ 0.6, 0.6, 0.7, 1.0 ];
        spheretex.diffuse = [ 0.4, 0.4, 0.3, 1.0 ];
        spheretex.specular = [ 0.1, 0.1, 0.2, 1.0 ];

        var scene = new PhyScene3D();
        scene.timeStep = 1 / 60;
        camera = scene.getCamera();
        camera.y = 16;
        camera.z = 5;
        camera.x = 0;

        var plane = new PhyPlane(0, 1, 0, 0);
        scene.addChild(plane);

        var container = new PhyContainer(1, 10); 
        container.mesh.texture = boxtex;
        container.translate(0, 1, 0);
        container.rotationSet(new Quat(0, 1, 0, Math.PI/16));
        scene.addChild(container);

        for (var i = 0; i < ballsNum; i++) {
            var x = Math.random() * 0.5 - 0.25;
            var y = i * 1.0 + 5;
            var z = Math.random() * 0.5 - 0.25;
            var ball = new PhySphere(0.2, 0.35);
            ball.mesh.texture = spheretex;
            ball.translate(x, y, z);
            scene.addChild(ball);
        }

        game.addEventListener('abuttonup', function() {
            if (playing) {
                scene.stop();
                playing = false;
            } else {
                scene.play();
                playing = true;
            }
        });

        scene.play();
    };
    game.debug();
};
