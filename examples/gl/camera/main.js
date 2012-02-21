enchant();
var game;
window.onload = function(){
    game = new Game(320, 320);
    game.fps = 60;
    game.onload = function(){
	    var scene = new Scene3D();
        scene.setDirectionalLight(light = new DirectionalLight());
		light.directionZ=-1;
        var camera = new Camera3D();
		camera.x = 0;
		camera.y = 0;
        camera.z =-10;
		camera.centerX = 0;
		camera.centerY = 0;
		camera.centerZ = 0;
        scene.setCamera(camera);

		camera.theta=0;
		speed=0;

		game.rootScene.addEventListener('touchstart',function(e){
			this.tx = e.x;
			this.ty = e.y;
		});
		game.rootScene.addEventListener('touchmove',function(e){

			var dx = (e.x-this.tx)*0.01;
			var dy = (e.y-this.ty)*0.01;
			speed-=dy;
			camera.theta+=dx;
			this.tx = e.x;
			this.ty = e.y;

		});
		game.rootScene.addEventListener('enterframe',function(e){
			var fx =-Math.sin(camera.theta);
			var fz = Math.cos(camera.theta);

			camera.x += fx*speed;
			camera.z += fz*speed;
			camera.centerX = camera.x+fx;
			camera.centerZ = camera.z+fz;
		});


		for(i=0;i<40;i++){
		    var ball = new Sphere();
		    ball.mesh.texture = new Texture("../../../images/enchant-sphere.png");
		    ball.x = i%2*10-5;
		    ball.y = i%3*2-2;
		    ball.z = i*5;
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
		}
    };
    game.start();
};

