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
        
        
        //クォータニオンによる回転
        var labelA = new Label("Quaternion");
        labelA.x=50;
        labelA.y=220;
        labelA.color="#ffffff";
        game.rootScene.addChild(labelA);
        
	    var cubeA = new Cube();
	    cubeA.mesh.texture = new Texture("../../../images/enchant.png");
	    cubeA.mesh.texture.ambient = [0.2 ,0.2, 0.2, 1.0];
	    cubeA.x =-1;
	    cubeA.z =-12;
	    
    	//最初の姿勢をセット
    	cubeA.rotationSet(new Quat(1,0,0,Math.PI));
    	
	    cubeA.addEventListener('touchstart', function(e){
	    	this.px=e.x;
	    	this.py=e.y;
	    });
	    cubeA.addEventListener('touchmove', function(e){
	    	var rotA = (e.x - this.px)*0.05;
	    	this.rotationApply(new Quat(0,1,0,rotA)); //差分をもとにヘッド回転
	    	var rotB = (e.y - this.py)*0.05;
	    	this.rotationApply(new Quat(1,0,0,rotB)); //差分をもとにピッチ回転
	    	this.px=e.x;
	    	this.py=e.y;
	    });
	    scene.addChild(cubeA);

	    //オイラー角による回転
        var labelB = new Label("Euler Angles");
        labelB.x=210;
        labelB.y=220;
        labelB.color="#ffffff";
        game.rootScene.addChild(labelB);
        

	    cubeB = new Cube();
	    cubeB.mesh.texture = new Texture("../../../images/enchant.png");
	    cubeB.mesh.texture.ambient = [0.2 ,0.2, 0.2, 1.0];
	    cubeB.x = 1;
	    cubeB.z =-12;
    	cubeB.rotX = 0;
    	cubeB.rotY = 0;
    	
    	//最初の姿勢をセット
	    cubeB.rotationSet(new Quat(1,0,0,Math.PI));
	    
	    cubeB.addEventListener('touchstart', function(e){
	    	this.px=e.x;
	    	this.py=e.y;
	    });
	    cubeB.addEventListener('touchmove', function(e){
	    	this.rotationSet(new Quat(1,0,0,Math.PI));//リセットしてから
	    	this.rotY += (e.x - this.px)*0.05;
	    	this.rotationApply(new Quat(0,1,0,this.rotY)); //Y軸まわりに回転
	    	this.rotX += (e.y - this.py)*0.05;
	    	this.rotationApply(new Quat(1,0,0,this.rotX));//X軸まわりに回転
	    	this.px=e.x;
	    	this.py=e.y;
	    });
	    scene.addChild(cubeB);


    };
    game.start();
};