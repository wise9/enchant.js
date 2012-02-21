enchant();
var game;
window.onload = function(){
    game = new Game(320, 320);
    game.fps = 120;
    game.preload('droid.dae');
    game.onload = function(){
        scene = new Scene3D();
        scene.setDirectionalLight(new DirectionalLight());
        scene.setCamera(new Camera3D());
        var droid = Sprite3D();
        droid.set(game.assets['../../../images/droid.dae']);
		droid.y= -1;
		droid.z=-10;
        scene.addChild(droid);
        var theta = 0;
        var phi = 0;
        var offsetX = 0;
        var offsetY = 0;
        var matrix = new mat4.create();

        game.rootScene.addEventListener('touchstart', function(e){
        	offsetX = e.x;
        	offsetY = e.y;
        });
        game.rootScene.addEventListener('touchmove', function(e){
        	theta += (e.x - offsetX) / 160;
        	offsetX = e.x;
        	phi += (e.y - offsetY) / 160;
        	offsetY = e.y;
        });
        game.addEventListener('enterframe', function() {
        	if(!droid) return;
            if (game.input.up) {
            	phi -= 0.05;
            } if (game.input.down) {
            	phi += 0.05;
            } if (game.input.right) {
            	theta += 0.05;
            } if (game.input.left) {
            	theta -= 0.05;
            }
            mat4.identity(matrix);
            mat4.rotateY(matrix, theta);
            mat4.rotateX(matrix, phi);
            droid.rotation = matrix;
        });
    };
    game.start();
};

