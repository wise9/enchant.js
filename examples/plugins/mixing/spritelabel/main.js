enchant();
var Description = enchant.Class.create(enchant.Label, {
	initialize: function(text,x,y) {
		enchant.Label.call(this,text);
		this.x = x;
		this.y = y;
		enchant.Game.instance.rootScene.addChild(this);
	}
});
window.onload = function(){
    var game = new Game(320, 320);
    game.fps = 15;
    game.preload("chara1.png");
    game.onload = function(){
    	new Description("I'm a Sprite:",0,0);
    	new Description("I'm a Label:",0,70);
    	new Description("I'm a Sprite mixed with a Label:",0,150);
        var kuma = new Sprite(32, 32);
        kuma.image = game.assets["chara1.png"];
        kuma.x = 0;
        kuma.y = 20;
        kuma.frame = [5,5,6,6,5,5,7,7];
        kuma.tl.moveTo(game.width-50,kuma.y,100).scaleTo(-1,1,1).moveTo(0,kuma.y,100).scaleTo(1,1,1).loop();
        game.rootScene.addChild(kuma);
        var label = new Label('Kuma');
        label.x = 0;
        label.y = 90;
        label.color = 'red';
        label.font = '12px Arial';
        game.rootScene.addChild(label);
        
        
        
        var SpriteLabel = enchant.Class.mixClasses(Sprite, Label,true);
        var kumaLabel = new SpriteLabel(32,32,'Kuma');
        kumaLabel.color = 'red';
        kumaLabel.font = '12px Arial';
        kumaLabel.image = game.assets["chara1.png"];
        kumaLabel.x = 0;
        kumaLabel.y = 170;
        kumaLabel.frame = [5,5,6,6,5,5,7,7];
        kumaLabel.tl.moveTo(game.width-50,kumaLabel.y,100).scaleTo(-1,1,1).moveTo(0,kumaLabel.y,100).scaleTo(1,1,1).loop();
        game.rootScene.addChild(kumaLabel);
    };
    game.start();
};