enchant();
window.onload = function() {
    var game = new Game(320, 320);
    game.onload = function() {
        //選択肢を作成する
        var select = {
            male: '男',
            female: '女'
        };
        /*
        * new InputSelectBox(option)
        * セレクトボックスを作成する。
        * 選択できる項目を設定する。
        */
        var inputSelectBox = new InputSelectBox(select); // セレクトボックスを作成
        game.rootScene.addChild(inputSelectBox);

        /*
        * new InputCheckBox(value, text, checked)
        * チェックボックスを作成する。
        * 値、ラベルテキスト、チェックされているかどうかを設定する。
        */
        var inputCheckBox1 = new InputCheckBox('tv', 'テレビで知った。'); // チェックボックスを作成
        inputCheckBox1.y = 48;
        game.rootScene.addChild(inputCheckBox1);
        var inputCheckBox2 = new InputCheckBox('web', 'WEBで知った。');
        inputCheckBox2.y = 48 * 2;
        game.rootScene.addChild(inputCheckBox2);

        /*
        * new InputTextBox()
        * テキストボックスを作成する。
        * 一行でテキスト入力を行う。
        */
        var inputTextBox = new InputTextBox(); // テキストボックスを作成
        inputTextBox.x = 8;
        inputTextBox.y = 48 * 3;
        game.rootScene.addChild(inputTextBox);

        /*
        * new InputTextArea()
        * テキストエリアを作成する。
        * 複数行でテキスト入力を行う。
        */
        var inputTextArea = new InputTextArea(); // テキストエリアを作成
        inputTextArea.width = 300;
        inputTextArea.height = 100;
        inputTextArea.x = 8;
        inputTextArea.y = 48 * 4;
        game.rootScene.addChild(inputTextArea);
    };
    game.start();
};
