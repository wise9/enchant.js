enchant();
window.onload = function() {
	game = new Game(500, 300);
	game.fps = 30;
	game.onload = function() {
        //Edgeのデータを読み込んでるCompositionsクラスのインスタンス
        var edge = enchant.edge.Compositions.instance;
		
        //symbolInstanceは全てのenchant.jsのスプライトに変換したEdgeのオブジェクト
		var symbolInstance = edge.createSymbolInstance();
        
        //シーンにEdgeのシンボルを追加する
		symbolInstance.addToGroup(game.rootScene);

	};
	game.start();
};
