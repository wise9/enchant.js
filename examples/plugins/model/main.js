
/**
 * PlayerのモデルのHPが減った時に、
 * そのイベントを監視してラベルを更新するプログラム。
 * なお、プレイヤーは便宜上16x16の赤色四角で表現する。
 */

enchant();
window.onload = function(){
    game = new Game(320, 320);
    game.preload();
    game.fps = 30;
    game.onload = function(){
      var label = new Label("HP: 1000");
      label.x = 64;
      label.y = 32;

      var player = new SpriteModel(16, 16);
      player.x = 32;
      player.y = 32;
      player.backgroundColor = "red";


      player.setup("hp", 1000);
      player.setup("bullets", ["test0"]);

      // add observer to bullet array
      player.on("bullets", function(data, method){
        console.log(method + " bullet: " + data);
      });
      player.bullets.push("test1");
      player.bullets.push("test2");
      player.bullets.unshift("test3", "test4");
      player.bullets.shift();
      console.log("display all bullets");
      player.bullets.forEach(function(d){
        console.log(d);
      });

      // add observer to hp
      player.on("hp", function(data){
          if (data > 0) {
              label.text = "HP: " + data;
          } else {
              label.text = "player die ..."
          }
      });

      game.rootScene.addChild(label);
      game.rootScene.addChild(player);

      setInterval(function(){
        player.hp -= 10;
        // or player.set("hp", player.hp - 10)
      }, 500);
    }
    game.start();
}

