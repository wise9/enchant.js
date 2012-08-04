enchant();
window.onload = function() {
    var game = new Game(320, 320);
    game.onload = function() {
        /*
        * new AlertScene()
        * アラートシーンを作成する。
        * ボタンを1つ設定する。
        */
        var alertScene = new AlertScene('その操作は実行できません。', '戻る'); // アラートシーンを作成
        alertScene.onaccept = function() {
            alert('「戻る」が選択されました。');
        };
        game.pushScene(alertScene);

        /*
        * new ConfirmScene()
        * コンファームシーンを作成する。
        * ボタンを2つ設定する。
        */
        var confirmScene = new ConfirmScene('本当に実行してもよろしいですか？', 'はい', 'いいえ'); // コンファームシーンを作成
        confirmScene.oncancel = function() {
            alert('「いいえ」が選択されました。');
        };
        confirmScene.onaccept = function() {
            alert('「はい」が選択されました。');
        };
        game.pushScene(confirmScene);
    };
    game.start();
};
