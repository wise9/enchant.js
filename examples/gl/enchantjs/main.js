enchant();
var game;
window.onload = function(){
    game = new Game(320, 320);
    game.fps = 60;
    game.preload(['../../../images/enchant.png', '../../../images/chara1.gif']);
    game.onload = function(){
         var scene = new Scene3D();
         scene.backgroundColor = [0.7, 0.7, 0.7, 1];
         var light = new DirectionalLight();
         scene.setDirectionalLight(light);
         var texture = new Texture('../../../images/enchant.png');
		 texture.ambient = [0.7, 0.7, 0.7, 1.0];
         for (var i = 0; i < 5; i++) {
             var box = new Cube();
             box.x = Math.random() * 4 - 2;
             box.y = Math.random() * 4 - 2;
             box.z = Math.random() * 15 - 30;
             box.rotX = 0;
             box.translate(box.x, box.y, box.z);
             box.speed = 0.1 * Math.random();
             box.vx = box.speed;
             box.vy = box.speed;
             box.vz = box.speed;
             box.mesh.texture = texture;
             touch = 0;
             box.addEventListener('touchstart', function(e){
                 console.log(touch);
                 touch ++;
             });
             box.addEventListener('render', function(e){
                 this.rotX += 0.1;
                 this.rotation = [
                 1, 0, 0, 0,
                 0, Math.cos(this.rotX), -Math.sin(this.rotX), 0,
                 0, Math.sin(this.rotX), Math.cos(this.rotX), 0,
                 0, 0, 0, 1
                 ];
                 if(this.x > 2) this.vx = -this.speed;
                 else if(this.x < -2) this.vx = this.speed;
                 if(this.y > 2) this.vy = -this.speed;
                 else if(this.y < -2) this.vy = this.speed;
                 if(this.z > -15) this.vz = -this.speed;
                 else if(this.z < -30) this.vz = this.speed;
                 this.translate(this.vx, this.vy, this.vz);
             });
             scene.addChild(box);
         }
         var kuma = new Sprite(32, 32);
         kuma.image = game.assets['../../../images/chara1.gif'];
         kuma.walk = 0;
         kuma.vx = parseInt(Math.random() * 10);
         kuma.vy = parseInt(Math.random() * 10);
         game.rootScene.addEventListener('enterframe', function() {
             kuma.walk++;
             if (kuma.walk == 5) {
                 kuma.frame = 2;
                 kuma.x += kuma.vx;
                 kuma.y += kuma.vy;
             } else if (kuma.walk == 10) {
                 kuma.frame = 1;
                 kuma.walk = 0;
                 kuma.x += kuma.vx;
                 kuma.y += kuma.vy;
             }
             if (kuma.x > game.width - 32) {
                 kuma.vx *= -1;
                 kuma.scaleX *= -1;
             } else if(kuma.x < 0) {
                 kuma.vx *= -1;
                 kuma.scaleX *= -1;
             }
             if (kuma.y > game.height- 32) {
                 kuma.vy *= -1;
             } else if(kuma.y < 0) {
                 kuma.vy *= -1;
             }

         });
             
         kuma.addEventListener('touchmove', function() {
             console.log('touchmooooove');
         });
         game.rootScene.addChild(kuma);
    };
    game.start();
};

