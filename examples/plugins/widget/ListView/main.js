enchant();
window.onload = function() {
    var game = new Game(320, 320);
    game.onload = function() {
        var navigationBar = new NavigationBar('NavigationBar'); // ナビゲーションバーを作成
        game.rootScene.addChild(navigationBar);

        /*
        * new ListView(width, height, draggable)
        * ListView オブジェクトを作成する。
        * 横幅、縦幅、項目をドラッグ可能かを設定する。
        */
        var listView = new ListView(320, 320 - navigationBar.height, true); // リストビューを作成
        listView.y = navigationBar.height;

        // 項目を10個作成する
        for (var i = 0; i < 10; i++) {
            var item = new ListItem(320, 48); // リストアイテムを作成
            item.content = 'ListItem' + i;
            listView.addChild(item); // リストビューに項目を追加
        }
        game.rootScene.addChild(listView);
    };
    game.start();
};
