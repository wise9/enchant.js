enchant();

window.onload=function(){
	game = new Game(320,320);
	game.preload('avatarBg1.png','avatarBg2.png','avatarBg3.png','monster/bigmonster1.gif');
	game.onload=function(){
		game.rootScene.backgroundColor="#000000";
		bg =new AvatarBG(1);
		bg.y=50;
		game.rootScene.addChild(bg);
		
		monster = new AvatarMonster(game.assets['monster/bigmonster1.gif']);
		monster.x=200;
		monster.y=100;
		game.rootScene.addChild(monster);
		
		
		chara = new Avatar("2:2:1:2004:21230:22480");
		game.rootScene.addChild(chara);
		chara.scaleX=-1;
		chara.scaleY=1;
		chara.x=50;
		chara.y=100;
		chara.addEventListener('enterframe',function(){
			if(this.action=="run"){
									bg.scroll(game.frame*2);
			}
			if(game.frame%40==0){
				switch(Math.floor(Math.random()*3)){
					case 0 :this.action="run";
									break;
					case 1 :this.action="attack";break;
					case 2 :this.action="special";break;
				}
			}
		});
	}

	game.start();
}