enchant();

window.onload = function(){
    game = new Game(320, 320);
    game.preload("bar.png");
    game.fps = 30;
    game.onload = function(){
        game.rootScene.backgroundColor = "#ccccff";

        // MutableText
        var mutableText = new MutableText(20, 20, 300);
        mutableText.text= "Hello util 0";
        mutableText.on("enterframe", function() {
            if (this.age % 30 == 0) {
                this.text = "Hello util " + ~~(this.age/30);
            }
        });
        game.rootScene.addChild(mutableText);

        // ScoreLabel
        var scoreLabel = new ScoreLabel(20, 40);
        scoreLabel.on("enterframe", function() {
            if (this.age % 30 == 0) {
                this.score += ~~(Math.random() * 1000);
            }
        });
        game.rootScene.addChild(scoreLabel);

        // TimeLabel
        var timeLabel = new TimeLabel(20, 60, 2);
        timeLabel.time = 0;
        game.rootScene.addChild(timeLabel);

        // LifeLabel
        var lifeLabel = new LifeLabel(20, 80, 10);
        lifeLabel.life = 10;
        lifeLabel.on("enterframe", function() {
            if (this.age % 30 == 0) {
                this.life = Math.random() * 10;
            }
        });
        game.rootScene.addChild(lifeLabel);

        // Bar
        var bar = new Bar(20, 100);
        bar.image = game.assets["bar.png"];
        bar.maxvalue = 200;
        bar.value = 0;
        bar.on("enterframe", function() {
            if (this.age % 60 == 0) {
                this.value = Math.random() * 200;
            }
        });
        game.rootScene.addChild(bar);

        // VirtualMap
        var virtualMap = new VirtualMap(16, 16);
        virtualMap.x = 20;
        virtualMap.y = 120;
        virtualMap.width = 280;
        virtualMap.height = 180;
        {
            var banana = new Sprite(16, 16);
            banana.image = game.assets["icon0.png"];
            banana.frame = 16;
            virtualMap.addChild(banana);
            banana.mx = 0;
            banana.my = 0;
        }
        {
            var apple = new Sprite(16, 16);
            apple.image = game.assets["icon0.png"];
            apple.frame = 15;
            virtualMap.addChild(apple);
            apple.mx = 0;
            apple.my = 1;
        }
        {
            var grape = new Sprite(16, 16);
            grape.image = game.assets["icon0.png"];
            grape.frame = 17;
            virtualMap.addChild(grape);
            grape.mx = 18;
            grape.my = 2;
        }
        virtualMap.on("enterframe", function() {
            if (this.age % 30 === 0) {
                banana.mx += 1;
            }
            if (this.age % 30 === 10) {
                apple.mx += 1;
            }
            if (this.age % 30 === 20) {
                grape.mx -= 1;
            }
        });
        game.rootScene.addChild(virtualMap);
    }
    game.start();
}

