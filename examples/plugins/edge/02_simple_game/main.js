enchant();
window.onload = function() {
	game = new Game(550, 400);
    var imageChara1 = '../../../../images/chara1.png'
	game.preload(imageChara1);
	
	game.onload = function() {

		var scene = game.rootScene;
        
        //Edgeのデータを読み込んでるCompositionsクラスのインスタンス
		var edge = enchant.edge.Compositions.instance;
		
        //シンボル名
		var symbol = 'stage';
        
        //合成IDはedgeのファイルの中に書いてある。例えば、bear_edge.jsの最後の行目:「(jQuery, AdobeEdge, "EDGE-62789179")」
		var compId = 'EDGE-62789179';

        //symbolInstanceは全てのenchant.jsのスプライトに変換したEdgeのオブジェクト
		var symbolInstance = edge.createSymbolInstance(compId,symbol);
        
        //今作成したシンボルのインスタンス名
		var instanceName = symbolInstance.instanceName;
		
        //シーンにEdgeのシンボルを追加する
        symbolInstance.addToGroup(scene);
		
        //プレイヤーのクマのスプライトを生成する
		var player = new enchant.Sprite(32,32);
		player.image=game.assets[imageChara1];
		
        //Edgeで作ったアニメのスプライトを取り出す
		var skatingKuma = symbolInstance.getSprite('bear');
        var stage = symbolInstance.getSprite('Stage');
		
        /*この方法もあります
        var skatingKuma = edge.getSprite('bear',compId,symbol,instanceName);
		var stage = edge.getSprite('Stage',compId,symbol,instanceName);
		*/
        
        //クマのスプライトを画面の中心へ
		player.moveTo(stage.width/2,stage.height/2);
        
        scene.addChild(player);
        
		player.addEventListener('enterframe', function(e) {
			if(game.frame % 3 == 0){
				player.frame = (player.frame)%2+1;
			}
            //Edgeで作ったアニメのスプライト(skatingKuma)と衝突判定
			if(skatingKuma.intersect(player)) {
				alert('crash');
				game.stop();
			}
			if(game.input.right){
				if(player.x < stage.width-32){
					player.x += 4;
					if(player.scaleX < 0)
						player.scaleX *= -1;
				}
			}
			if(game.input.left){
				if(player.x > 0){
					player.x -= 4;
					if(player.scaleX > 0)
						player.scaleX *= -1;
				}
			}
			if(game.input.up){
				if(player.y > 0){
					player.y -= 4;
				}
			}
			if(game.input.down){
				if(player.y < stage.height-32){
					player.y += 4;
				}
			}
		});
	};
	game.start();
};
