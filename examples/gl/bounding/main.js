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
	    ball.z =-20;
	    ball.addEventListener('enterframe', function(e){
	    	this.rotationApply(new Quat(0,1,0,0.01));
	    });
	    scene.addChild(ball);
	    
	    var cube = new Cube();
	    cube.z=0;
	    cube.vz=-0.1;
	    cube.addEventListener('enterframe', function(e){
	    	this.rotationApply(new Quat(0,1,0,0.01));
	    	this.rotationApply(new Quat(0,0,1,0.01));
	    	this.z+=cube.vz;
	    	if(this.intersect(ball)){
	    		cube.vz=-cube.vz;
	    		console.log("hit!");
	    	}
	    	if(this.z>0)
	    		cube.vz=-cube.vz;
	    });
	    scene.addChild(cube);
	    
    };
    game.start();
};