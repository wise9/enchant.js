enchant();

window.onload = function() {
	game = new Game(320, 320);
	game.preload(['bar.png', 'icon0.gif']);
	game.fps = 30;
	game.onload = function() {
		
		var bar = new Bar();
		bar.image = game.assets['bar.png'];
		bar.y = 304;
		bar.value = 150;
		this.rootScene.addChild(bar);
		
		var scrlbl = new ScoreLabel();
		scrlbl.score = 0;
		scrlbl.row = 1;
		scrlbl.y = 16;
		this.rootScene.addChild(scrlbl);
		
		var timlbl = new TimeLabel(16, 0, 'countdown');
		timlbl.time = 30;
		this.rootScene.addChild(timlbl);
		
		var player = new Material(16, 16, 160, 288);
		player.image = game.assets['icon0.gif'];
		player.static = true;
		player.name = 'player';
		player.frame = 22;
		player.show();
		player.addEventListener('enterframe', function(e){
			bar.value += 5;
			if(game.input.up && bar.value > 50 && game.frame%4==0){
				addShoot();
				bar.value -= 50;
				if(bar.value >= 320)bar.value = 320;
			}
			if(game.input.left){
				player.vx -= 8;
			}else if(game.input.right){
				player.vx += 8;
			}
			player.vx /= 2;
		});
		
		var pad = new Pad();
		pad.x = 0;
		pad.y = 220;
		game.rootScene.addChild(pad);
		
			addEnem = function() {
			var enem = new Material(16, 16, Math.random(game.frame) * 300 + 10, 0);
			enem.image = game.assets['icon0.gif'];
			enem.weight = 1;
			enem.maxspeed = 6;
			enem.name = 'enemy';
			enem.frame = 11;
			enem.addEventListener('enterframe', function(){
				if(this._mode != 'blast'){// ←爆発中の敵はゲームにかかわれない
					this.vx = Math.sin(game.frame/20);
					if(this.partner.name == 'missile'){
						this.blast(16);
						scrlbl.score += 500;
					}else if(this.y > 320){
						this.blast();
					}else if(this.partner.name == 'player'){
						this.blast();
						scrlbl.score -= 500;
					}
				}
			});
			enem.show();
		}
		
		addShoot = function(){
			var shot = new Material(16, 16);
			shot.image = game.assets['icon0.gif'];
			shot.frame = 48;
			shot.static = true;
			shot.name = 'missile';
			shot.x = player.x;
			shot.y = player.y - 16;
			shot.vy = - 3;
			shot.show();
			shot.addEventListener('enterframe', function() {
				if(this.y < -16){
					this.blast();
				}else{
					this.vy -= 0.7;
				}
			});
		};
		
		game.rootScene.addEventListener('enterframe', function() {
			if(timlbl.time <= 0)game.end(scrlbl.score, 'ブタ力:' + scrlbl.score);
			if(game.rootScene.childNodes.length < 6 + Math.min(scrlbl.score/500, 30))addEnem();
		});
	}
	game.start();
};