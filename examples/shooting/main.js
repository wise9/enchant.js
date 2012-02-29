/**
 * enchant();
 * enchant.js を使う前に必要な処理。
 * (enchant.js 本体や、読み込んだプラグインの中で定義されている enchant.Foo, enchant.Plugin.Bar などのクラスを、
 *  それぞれグローバルの Foo, Bar にエクスポートする。)
 */
enchant();

/**
 * HTMLのロードが完了したときに実行する関数。初期設定
 */
window.onload = function () {
    /**
     * ゲームの初期設定:
     * 画面の大きさは (320, 320) 、fps は 24 に設定する。
     */
    game = new Game(320, 320);
    game.fps = 24;
    /**
     * スコアを格納する変数と、
     * タッチされているかどうか = 弾を撃っているかどうかのフラグを初期化
     */
    game.score = 0;
    game.touched = false;
    /**
     * ゲームが始まる前にロードしておくファイルを指定する。
     * ここでは graphic.png のみを指定する。
     * ロードに時間がかかる場合プログレスバーが出現する。
     */
    game.preload('graphic.png');
    /**
     * ロードされたときの関数
     */
    game.onload = function () {
        player = new Player(0, 152);
        enemies = new Array();
        /**
         * 背景は黒一色
         */
        game.rootScene.backgroundColor = 'black';
        /**
         * フレームごとに実行する
         */
        game.rootScene.addEventListener('enterframe', function () {
            if(rand(1000) < game.frame / 20 * Math.sin(game.frame / 100) + game.frame / 20 + 50) {
                var y = rand(320);
                var omega = y < 160 ? 0.01 : -0.01;
                var enemy = new Enemy(320, y, omega);
                enemy.key = game.frame;
                enemies[game.frame] = enemy;
            }
            scoreLabel.score = game.score;
        });
        scoreLabel = new ScoreLabel(8, 8);
        game.rootScene.addChild(scoreLabel);
    };
    game.start();
};
/**
 * Sprite クラスを継承して, Player クラスを作成する。
 * enchant.Class.create の第一引数に継承元のクラスを指定し、
 * 第二引数にオブジェクトとして、追加・オーバーライドしたいメソッドやプロパティを指定する。
 * ここでは、コンストラクタのみをオーバーライドしている。
 */
var Player = enchant.Class.create(enchant.Sprite, {
    /**
     * Player クラスのコンストラクタ。表示したい位置の (x, y) 座標を引数で指定する
     * Sprite クラスを継承しているが、Spriteは Entity, Node, EventTarget を継承しており、
     * それぞれのメソッドやプロパティを利用することができる。
     *
     * - Sprite … Entityを、画像を扱いやすく拡張したクラス
     * - Label  … Entityを、文字を扱いやすく拡張したクラス
     * - Entity … Nodeのうち、自身が描画されるもの
     * - Group  … Nodeのうち、自身は描画されず、子を持つことができるもの
     * - Node   … オブジェクト木の構成要素
     * - EventTarget … イベントを発行したり、リスナを登録できるオブジェクト
     */
    initialize: function(x, y){
        /**
         * (16, 16) を引数として、enchant.Sprite (親クラスのコンストラクタ関数) を実行する。
         * 大きさ 16x16 のSpriteをベースとして拡張していく。
         */
        enchant.Sprite.call(this, 16, 16);
        /**
         * Sprite.image {Object}
         * Game#preload で指定されたファイルは、Game.assets のプロパティとして格納される。
         * Sprite.image にこれらを代入することで、画像を表示することができる
         */
        this.image = game.assets['graphic.png'];
        /**
         * Entity.x, Entity.y {Number}
         * 描画される位置。左上を基準とする(x, y)座標を指定する。
         * viewport の大きさに合わせて画面が拡大縮小されている場合も、
         * 拡大・縮小される前の座標系で指定できる。
         */
        this.x = x;
        this.y = y;

        /**
         * Sprite.frame {Number}
         * (width, height) ピクセルの格子で指定された画像を区切り、
         * 左上から数えて frame 番目の画像を表示することができる。
         * デフォルトでは、0:左上の画像が表示される。
         * このサンプルでは、自機の画像を表示する (graphic.png 参照)。
         */
        this.frame = 0;

        /**
         * EventTarget#addEventListener(event, listener)
         * イベントに対するリスナを登録する。
         * リスナとして登録された関数は、指定されたイベントの発行時に実行される。
         * よく使うイベントには、以下のようなものがある。
         * - "touchstart" : タッチ/クリックされたとき
         * - "touchmove" : タッチ座標が動いた/ドラッグされたとき
         * - "touchend" : タッチ/クリックが離されたとき
         * - "enterframe" : 新しいフレームが描画される前
         * - "exitframe" : 新しいフレームが描画された後
         * enchant.js やプラグインに組み込まれたイベントは、それぞれのタイミングで自動で発行されるが、
         * EventTarget#dispatchEvent で任意のイベントを発行することもできる。
         *
         * ここでは、以下のような処理を登録してしている
         *    画面がクリックされたとき … 自機をその座標に移動させ、弾を撃ちはじめる
         *    クリックしている座標が動いたとき … 自機をその座標に移動させる
         *    クリックが離されたとき … 自機をその座標に移動させ、弾を撃つのをやめる
         */
        game.rootScene.addEventListener('touchstart', function(e){ player.y = e.y; game.touched = true; });
        game.rootScene.addEventListener('touchmove', function(e){ player.y = e.y; });
        game.rootScene.addEventListener('touchend', function(e){ player.y = e.y; game.touched = false; });

        /**
         * さらに、フレームが更新されるごとに実行する処理を登録する。
         * 弾を撃っているフラグ (game.touched) が true になっており、
         * かつゲームが始まってからの経過フレーム数 (game.frame) を3で割った余りが 0 のとき
         * 新しい自機の弾 (new PlayerShoot) をプレイヤーの座標に出現させる。
         * リスナ内に書かれた this は、player のインスタンスオブジェクト自身を指す。
         */
        this.addEventListener('enterframe', function(){
            if(game.touched && game.frame % 3 == 0){ var s = new PlayerShoot(this.x, this.y); }
        });

        /**
         * Group#addChild(node) {Function}
         * オブジェクトをノードツリーに追加するメソッド。
         * ここでは、自機の画像を表示するスプライトオブジェクトを、rootScene に追加している。
         * Game.rootScene は Group を継承した Scene クラスのインスタンスで、描画ツリーのルートになる特別な Scene オブジェクト。
         * この rootScene に描画したいオブジェクトを子として追加する (addChild) ことで、毎フレーム描画されるようになる。
         * 引数には enchant.Node を継承したクラス (Entity, Group, Scene, Label, Sprite..) を指定する。
         */
         game.rootScene.addChild(this);
    }
});

var Enemy = enchant.Class.create(enchant.Sprite, {
    /**
     * Enemy クラスのコンストラクタ。敵機のオブジェクトを生成するために用いる。
     * Player と異なり自律して動くため、そのための処理が追加されている。
     * コンストラクタには初期位置 (x, y) のほか、移動方向の角速度 omega を指定する。
     */
    initialize: function(x, y, omega){
        /**
         * Playerクラスと同じく 大きさ 16x16 のSpriteをベースとして拡張していく。
         */
        enchant.Sprite.call(this, 16, 16);
        this.image = game.assets['graphic.png'];
        this.x = x;
        this.y = y;

        /**
         * 敵機の画像を表示する。
         * graphic.png の画像を 16x16 の格子で区切ると、
         * 左上を0番目として数えて、表示したい画像は3番目にあるため、frameには3を指定する。
         */
        this.frame = 3;
        /**
         * 角速度を指定する。
         * ここでは度数法 (円周を360°とする) を用いる。
         */
        this.omega = omega;

        /**
         * 移動方向と、移動速度(ピクセル毎フレーム)を指定する。
         * ここでは度数法 (円周を360°とする) を用いる。
         */
        this.direction = 0;
        this.moveSpeed = 3;

        /**
         * 敵機が描画されるごとに実行する処理を指定する。
         * 1フレームぶん移動し、画面に描画される範囲外であれば this.remove(); を実行し、描画ツリーから除く。
         */
        this.addEventListener('enterframe', function(){
            this.move();
            if(this.y > 320 || this.x > 320 || this.x < -this.width || this.y < -this.height){
                this.remove();
            }else if(this.age % 10 == 0){
                var s = new EnemyShoot(this.x, this.y);
            }
        });
        /**
         * 通常はコンストラクタの外から、Group や Scene に addChild するが、
         * ここではコンストラクタの中でこの処理を行っている。
         */
        game.rootScene.addChild(this);
    },
    /**
     * 移動のために呼ばれる関数を指定する。
     * この関数を外からオーバーライドすることによって、途中で動きを変えたりすることができる。
     */
    move: function(){
        /**
         * 移動方向を角速度ぶんだけ変化させ、移動方向に速度ぶんだけ移動する。
         * 初期設定ではゆるやかな回転運動となる。
         */
        this.direction += this.omega;
        this.x -= this.moveSpeed * Math.cos(this.direction/180*Math.PI);
        this.y += this.moveSpeed * Math.sin(this.direction/180*Math.PI)
    },
    remove: function(){
        /**
         * 描画ツリーから敵機のオブジェクト(自身)を取り除く。
         * この処理により敵機オブジェクトは
         * どこからも参照されなくなるので、GCによって回収される。
         */
        game.rootScene.removeChild(this);
        delete enemies[this.key];
    }
});

/**
 * Spriteクラスを継承して、弾クラスを生成する。
 * 直接は使わず、PlayerShoot、EnemyShootから継承して利用する
 */
var Shoot = enchant.Class.create(enchant.Sprite, {
    initialize: function(x, y, direction){
        enchant.Sprite.call(this, 16, 16);
        this.image = game.assets['graphic.png'];
        this.x = x; this.y = y; this.frame = 1; 
        this.direction = direction; this.moveSpeed = 10;
        this.addEventListener('enterframe', function(){
            this.x += this.moveSpeed * Math.cos(this.direction);
            this.y += this.moveSpeed * Math.sin(this.direction);
            if(this.y > 320 || this.x > 320 || this.x < -this.width || this.y < -this.height){
                this.remove();
            }
        });
        game.rootScene.addChild(this);
    },
    remove: function(){ game.rootScene.removeChild(this); delete this; }
});

/**
 * PlayerShoot (自弾) クラス。Shootクラスを継承して作成する。
 */
var PlayerShoot = enchant.Class.create(Shoot, {
    initialize: function(x, y){
        Shoot.call(this, x, y, 0);
        this.addEventListener('enterframe', function(){
            for(var i in enemies){
                if(enemies[i].intersect(this)){
                    this.remove(); enemies[i].remove(); game.score += 100;
                }
            }
        });
    }
});
/**
 *
 */
var EnemyShoot = enchant.Class.create(Shoot, {
    initialize: function(x, y){
        Shoot.call(this, x, y, Math.PI);
        this.addEventListener('enterframe', function(){
            if(player.within(this, 8)){ game.end(game.score, "SCORE: " + game.score) }
        });
    }
});
