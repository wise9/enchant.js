enchant();

window.onload = function() {
    game = new Game(320, 320);
    game.fps = 24;
    game.preload(['chara1.gif','icon0.gif','bg.png']);
    //プリロードする画像を相対パスで指定

    game.onload = function() {
    // プリロード終了後に呼ばれる関数を指定する

        // ここから、クマのキャラクターを表示する処理
        bear = new Sprite(32, 32);  // 32x32サイズの Sprite オブジェクトを生成
        bear.x = 0;                 // Sprite の左上のx座標を指定
        bear.y = 240;               // Sprite の左上のy座標を指定
        bear.width = 32;
        bear.height = 32;

        bear.image = game.assets['chara1.gif']; // 画像を指定
        bear.frame = 0;
        // 「chara1.gif」を32x32の格子で切り取ったのち、0番目(=左上)のものを用いる
        // ゲーム中に frame の値を操作することで、アニメーションを表現できる

        background = new Sprite(320, 320);  // 320x320 サイズの Sprite オブジェクトを生成
        background.x = background.y = 0;    // Sprite の左上の x, y 座標を指定
        background.image = game.assets['bg.png'] // bg.png を指定

        // タッチしたときにクマを移動させる
        game.rootScene.addEventListener('touchstart', function(e){
            bear.x = e.localX
        });

        // タッチ座標が動いたときにクマを移動させる
        game.rootScene.addEventListener('touchmove', function(e){
            bear.x = e.localX
        });

        game.score = 0;

        game.rootScene.addEventListener('enterframe',function(){
            if(game.frame % 6 == 0){
                // 6フレームごとにバナナを増やす関数を実行
                addBanana();
            }
            if(game.rootScene.age > game.fps * 20){
                game.end(game.score, game.score + " 本のバナナを取りました!");
                // 結果を表示 (スコア, 結果のテキストの順で)
            }
        });

        game.rootScene.addChild(background);
        game.rootScene.addChild(bear);

    }
    game.start();
    // プリロードをスタート
}

// バナナを増やす関数 (6フレームごとに呼ばれる)
function addBanana(pos){
    var banana = new Sprite(16, 16);    // Spriteを生成
    banana.x = rand(320);               // 0 から 319 のあいだの乱数
    banana.y = 0;
    banana.image = game.assets['icon0.gif'];

    banana.frame = 16;
    // icon0.gif を 16x16 サイズの格子に区切ったとき、左上を 0番目として数えて
    // 16番目にある画像 (バナナ) を指定

    banana.addEventListener('enterframe', function(e) {
        if(this.intersect(bear)){       // bearとの当たり判定
            game.rootScene.removeChild(this); // 画面から消去
            game.score ++;                    // スコアを加算
        }else{
            this.y += 3;                // y座標を増やす (落下)
        }
    });
    game.rootScene.addChild(banana);
    // バナナを画面に追加
}

// 引数 num を受け取って、0 から (num - 1) までの乱数を返す関数
function rand(num){
    return Math.floor(Math.random() * num);
}
