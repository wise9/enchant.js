
enchant();

var game, maploader, map, player;
var charset = "chara0.gif";
var mapUrl = "maps/map1.tmx";

window.onload = function() {

  game = new Game(320, 240);
  game.fps = 30;
  game.preload(charset);
  game.onload = function() {

    // player behaviour
    player = new Sprite(32, 32);
    player.x = 0;
    player.y = 0;
    var image = new Surface(96, 128);
    image.draw(game.assets[charset], 0, 0, 96, 128, 0, 0, 96, 128);
    player.image = image;

    player.isMoving = false;
    player.direction = 0;
    player.steps = [1, 0, 1, 2];
    player.currentStep = 0;
    player.stepSize = 4;
    player.addEventListener("enterframe", function() {
      this.frame = this.direction * 3 + this.steps[this.currentStep];
      if (this.vx || this.vy) {
        this.isMoving = map.moveTest(this.x, this.y, this.vx, this.vy, this.hitBox);
      }
      if (this.isMoving) {
        this.moveBy(this.vx, this.vy);
        this.walkedX += Math.abs(this.vx);
        this.walkedY += Math.abs(this.vy);

        if (!(game.frame % 3)) {
          this.currentStep = (this.currentStep + 1) % this.steps.length;
        }

        if (this.walkedX >= map.tileWidth || this.walkedY >= map.tileHeight) {
          this.vx = this.vy = 0;
          this.isMoving = false;
        }
      } else {
        this.walkedX = this.walkedY = this.vx = this.vy = 0;
        //this.currentStep = 0;
        if (game.input.left) {
          this.direction = 1;
          this.vx = -this.stepSize;
        } else if (game.input.right) {
          this.direction = 2;
          this.vx = this.stepSize;
        } else if (game.input.up) {
          this.direction = 3;
          this.vy = -this.stepSize;
        } else if (game.input.down) {
          this.direction = 0;
          this.vy = this.stepSize;
        } else {
          this.currentStep = 0;
        }
      }
    });
    // simple hit box
    var hitBox = { };
    hitBox.x = Math.floor(player.width / 2 - 16 / 2);
    hitBox.y = Math.floor(player.height - 16);
    hitBox.width = 16;
    hitBox.height = 16;
    player.hitBox = hitBox;

    // class to fill foo entities
    var fooClass = new enchant.Class.create(enchant.Entity, {
      initialize : function(entity) {
        // the class fills the entity with a color
        enchant.Entity.call(this);
        this.width = parseInt(entity.width) || 16;
        this.height = parseInt(entity.height) || 16;
        // the color is taken from entity properties
        this.backgroundColor = entity.properties.color || "black";
      }
    });

    maploader = new enchant.TMX.TMXMapLoader();
    // put the player on "player" entity
    maploader.bindName("player", player);
    // put fooClass objects on foo entities
    maploader.bindType("foo", fooClass);

    // load map
    map = maploader.loadMap(mapUrl, function(theMap) {

      // add map to the game
      var stage = new Group();
      stage.addChild(map);
      game.rootScene.addChild(stage);

      // map scroll
      game.rootScene.addEventListener("enterframe", function(e) {
          var x = Math.min((game.width  - theMap.tileWidth)  / 2 - player.x, 0);
          var y = Math.min((game.height - theMap.tileHeight) / 2 - player.y, 0);
          x = Math.max(game.width,  x + theMap.width)  - theMap.width;
          y = Math.max(game.height, y + theMap.height) - theMap.height;
          stage.x = x;
          stage.y = y;
      });
    });

  };
  game.start();
};

