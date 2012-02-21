enchant();
var game;
window.onload = function(){
    game = new Game(320, 320);
    game.fps = 60;
    game.onload = function(){
	    var scene = new Scene3D();
        scene.setDirectionalLight(new DirectionalLight());
        var camera = new Camera3D();
        scene.setCamera(camera);
	    var ball = new Sphere();
	    ball.mesh.texture = new Texture("../../../images/enchant-sphere.png");
	    ball.z =-10;
	    ball.rotX = 0;
	    ball.addEventListener('enterframe', function(e){
	        this.rotX += 0.01;
	        this.rotation = [
	        	Math.cos(this.rotX), 0, -Math.sin(this.rotX), 0,
	        	0, 1, 0, 0,
	        	Math.sin(this.rotX), 0, Math.cos(this.rotX), 0,
	        	0, 0, 0, 1
	        ];
	    });
	    scene.addChild(ball);
    };
    game.start();
};