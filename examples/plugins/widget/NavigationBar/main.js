enchant();
window.onload = function() {
    var game = new Game(320, 320);
    game.onload = function() {
        var button1 = new Button('Back'); // 左の項目に配置するボタンを作成
        button1.ontouchend = function() {
            alert('「Back」がタップされました。');
        };
        var button2 = new Button('Edit'); // 右の項目に配置するボタンを作成
        button2.ontouchend = function() {
            alert('「Edit」がタップされました。');
        };

        /*
        * new NavigationBar(center, left, right)
        * ナビゲーションバー（ボタンなどを設定できるメニューバー）を作成する。
        * 中央、左、右の項目を設定できる。
        */
        var navigationBar = new NavigationBar('Navigationbar', button1, button2); // ナビゲーションバーを作成

        game.rootScene.addChild(navigationBar);
    };
    game.start();
};
