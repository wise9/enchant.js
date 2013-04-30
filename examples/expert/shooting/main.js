/**
 * enchant();
 * Necessary processing before using enchant.js
 * (Exports enchant.js and enchant.Foo, enchant.Plugin.Bar and other classes
 * to global Foo, Bar)
 * enchant();
 * enchant.js を使う前に必要な処理。
 * (enchant.js 本体や、読み込んだプラグインの中で定義されている enchant.Foo, enchant.Plugin.Bar などのクラスを、
 *  それぞれグローバルの Foo, Bar にエクスポートする。)
 */
enchant();

/**
 * Function executed when HTML loading is complete. Initialization settings.
 * HTMLのロードが完了したときに実行する関数。初期設定
 */
window.onload = function () {
    /**
     * Game initiliazation settings:
     * Screen size is set to (320, 320), fps to 24.
     * ゲームの初期設定:
     * 画面の大きさは (320, 320) 、fps は 24 に設定する。
     */
    game = new Game(320, 320);
    game.fps = 24;
    /**
     * Initialization for variables containing the score,
     * and whether or not touch is occurring = whether or not bullets are being fired
     * スコアを格納する変数と、
     * タッチされているかどうか = 弾を撃っているかどうかのフラグを初期化
     */
    game.score = 0;
    game.touched = false;
    /**
     * Sets files to load before game starts.
     * Here we only set graphic.png.
     * A progress bar will appear when some time is required.
     * ゲームが始まる前にロードしておくファイルを指定する。
     * ここでは graphic.png のみを指定する。
     * ロードに時間がかかる場合プログレスバーが出現する。
     */
    game.preload('graphic.png');
    /**
     * Functions after loading.
     * ロードされたときの関数
     */
    game.onload = function () {
        player = new Player(0, 152);
        enemies = new Array();
        /**
         * Background is black
         * 背景は黒一色
         */
        game.rootScene.backgroundColor = 'black';
        /**
         * Executed every other frame
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
 * Inherits Sprite class, creates Player class.
 * Sets as successive class in first argument of enchant.Class.create,
 * as object in second argument, and sets desired addition/override methods.
 * Here, only constructor is overridden.
 * Sprite クラスを継承して, Player クラスを作成する。
 * enchant.Class.create の第一引数に継承元のクラスを指定し、
 * 第二引数にオブジェクトとして、追加・オーバーライドしたいメソッドやプロパティを指定する。
 * ここでは、コンストラクタのみをオーバーライドしている。
 */
var Player = enchant.Class.create(enchant.Sprite, {
    /**
     * Player class constructor. Sets the (x, y) coordinates you want to display in argument.
     * Succeeds Sprite class, but Sprite succeeds Entity, Node, EventTarget,
     * and you can use respective methods and properties.
     *
     * - Sprite … Class expanded to make Entity, image easier to handle
     * - Label  … Class expanded to make Entity, text easy to handle
     * - Entity … Body drawn in Node
     * - Group  … Without drawing body, the ability to have child in Node
     * - Node   … Object tree construction element
     * - EventTarget … Object to issue events and register listeners
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
    initialize: function (x, y) {
        /**
         * Executes argument of (16, 16), enchant.Sprite (parent class constructor function)
         * Extends 16x16 Sprite as base.
         * (16, 16) を引数として、enchant.Sprite (親クラスのコンストラクタ関数) を実行する。
         * 大きさ 16x16 のSpriteをベースとして拡張していく。
         */
        enchant.Sprite.call(this, 16, 16);
        /**
         * Sprite.image {Object}
         * Files set in Game#preload are stored as Game.assets properties.
         * By substituting these to Sprite.image, you can display an image
         * Sprite.image {Object}
         * Game#preload で指定されたファイルは、Game.assets のプロパティとして格納される。
         * Sprite.image にこれらを代入することで、画像を表示することができる
         */
        this.image = game.assets['graphic.png'];
        /**
         * Entity.x, Entity.y {Number}
         * Drawing coordinates. Sets (x, y) coordinates with top left as standard.
         * In cases where the screen is adjusted to fit the viewport size,
         *  coordinates from before adjustment will be used.
         * Entity.x, Entity.y {Number}
         * 描画される位置。左上を基準とする(x, y)座標を指定する。
         * viewport の大きさに合わせて画面が拡大縮小されている場合も、
         * 拡大・縮小される前の座標系で指定できる。
         */
        this.x = x;
        this.y = y;

        /**
         * Sprite.frame {Number}
         You can separate the images separated by the (width, height) pixel lattice,
         * and display images in order counting downing from top left.
         * By default, the 0:top left image is displayed.
         * In this sample, the player graphic.png is displayed.
         * Sprite.frame {Number}
         * (width, height) ピクセルの格子で指定された画像を区切り、
         * 左上から数えて frame 番目の画像を表示することができる。
         * デフォルトでは、0:左上の画像が表示される。
         * このサンプルでは、自機の画像を表示する (graphic.png 参照)。
         */
        this.frame = 0;

        /**
         * EventTarget#addEventListener(event, listener)
         * Registers listener in response to event.
         * Function registered as event is executed during release of set event.
         * Here are some common events.
         * - "touchstart" :  During touch/click
         * - "touchmove" : When touch coordinates are moved/dragged
         * - "touchend" : When touch/click is released
         * - "enterframe" : Before drawing new frame
         * - "exitframe" : After drawing new frame
         * enchant.js and its bundled plugins are automatically executed at their respective timing,
         * but they can else issued irrespective of event with EventTarget#dispatchEvent.
         *
         * Here the following kind of processing is registered
         *    When image is clicked, icon will be moved to those coordinates and bullets will be fired.
         *    When the clicked coordinates move, icon will be moved to them.
         *    When click is released, icon will be moved to those coordinates, and bullets will cease firing.
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
        game.rootScene.addEventListener('touchstart', function (e) {
            player.y = e.y;
            game.touched = true;
        });
        game.rootScene.addEventListener('touchmove', function (e) {
            player.y = e.y;
        });
        game.rootScene.addEventListener('touchend', function (e) {
            player.y = e.y;
            game.touched = false;
        });

        /**
         * In addition, by updating every other frame you register the processing issued.
         * The flag for bullets firing (game.touched) will be registered as true,
         * and after game has started, when the number of frames passed (game.frame) has been divided into three
         * a new icon's bullets (new PlayerShoot) will be activated in player's coordinates.
         * The "this" written within listener indicates the player's instance object.
         * さらに、フレームが更新されるごとに実行する処理を登録する。
         * 弾を撃っているフラグ (game.touched) が true になっており、
         * かつゲームが始まってからの経過フレーム数 (game.frame) を3で割った余りが 0 のとき
         * 新しい自機の弾 (new PlayerShoot) をプレイヤーの座標に出現させる。
         * リスナ内に書かれた this は、player のインスタンスオブジェクト自身を指す。
         */
        this.addEventListener('enterframe', function () {
            if(game.touched && game.frame % 3 == 0) {
                var s = new PlayerShoot(this.x, this.y);
            }
        });

        /**
         * Group#addChild(node) {Function}
         * Method to add object to node tree.
         * Here a sprite object that displays the icon image is added to rootScene.
         * Game.rootScene is an instance of Group-succeeding Scene class, and a special Scene object that becomes the drawing tree root.
         * By adding the object you want to draw as a child (addChild) to this rootScene, drawing will be conducted every frame.
         * In the argument classes that succeed enchant.Node (Entity, Group, Scene, Label, Sprite) are set.
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
     * Enemy class constructor. Used to create enemy object.
     * Unlike Player, it moves self-sufficiently, requiring necessary programming.
     * In constructor, in addition to initial postion (x, y), the directional movement angle omega is set.
     * Enemy クラスのコンストラクタ。敵機のオブジェクトを生成するために用いる。
     * Player と異なり自律して動くため、そのための処理が追加されている。
     * コンストラクタには初期位置 (x, y) のほか、移動方向の角速度 omega を指定する。
     */
    initialize: function (x, y, omega) {
        /**
         * As with the Player class, you set size at 16x16 Sprite base and expand.
         * Playerクラスと同じく 大きさ 16x16 のSpriteをベースとして拡張していく。
         */
        enchant.Sprite.call(this, 16, 16);
        this.image = game.assets['graphic.png'];
        this.x = x;
        this.y = y;

        /**
         * Display enemy image.
         * You divide the graphic.png image into 16x16 lattices,
         * and start counting from 0 at the top left, and because the image you want to display is at 3, you set frame to 3.
         * 敵機の画像を表示する。
         * graphic.png の画像を 16x16 の格子で区切ると、
         * 左上を0番目として数えて、表示したい画像は3番目にあるため、frameには3を指定する。
         */
        this.frame = 3;
        /**
         * Sets rotation angle.
         * Here rotation angle (for circles, this is 360°) is used.
         * 角速度を指定する。
         * ここでは度数法 (円周を360°とする) を用いる。
         */
        this.omega = omega;

        /**
         * Set movement angle and movement speed (pixels per frame).
         * Here rotation angle (for circles, this is 360°) is used.
         * 移動方向と、移動速度(ピクセル毎フレーム)を指定する。
         * ここでは度数法 (円周を360°とする) を用いる。
         */
        this.direction = 0;
        this.moveSpeed = 3;

        /**
         * ets processing executed each time enemy object is drawn.
         * One frame moves, and if drawn within the parameters of the image this.remove(); is used and image is removed from drawing tree.
         * 敵機が描画されるごとに実行する処理を指定する。
         * 1フレームぶん移動し、画面に描画される範囲外であれば this.remove(); を実行し、描画ツリーから除く。
         */
        this.addEventListener('enterframe', function () {
            this.move();
            if(this.y > 320 || this.x > 320 || this.x < -this.width || this.y < -this.height) {
                this.remove();
            } else if(this.age % 10 == 0) {
                var s = new EnemyShoot(this.x, this.y);
            }
        });
        /**
         * Normally addChild is performed in Group or Scene from outside constructor,
         * but here this process is performed within constructor.
         * 通常はコンストラクタの外から、Group や Scene に addChild するが、
         * ここではコンストラクタの中でこの処理を行っている。
         */
        game.rootScene.addChild(this);
    },
    /**
     * Sets function called up for movement.
     * By overriding from outside this function, you can change movement partway through.
     * 移動のために呼ばれる関数を指定する。
     * この関数を外からオーバーライドすることによって、途中で動きを変えたりすることができる。
     */
    move: function () {
        /**
         * You change the movement direction angle only, and move only by that amount.
         * In the initialization settings smooth rotation occurs.
         * 移動方向を角速度ぶんだけ変化させ、移動方向に速度ぶんだけ移動する。
         * 初期設定ではゆるやかな回転運動となる。
         */
        this.direction += this.omega;
        this.x -= this.moveSpeed * Math.cos(this.direction / 180 * Math.PI);
        this.y += this.moveSpeed * Math.sin(this.direction / 180 * Math.PI)
    },
    remove: function () {
        /**
         * Deletes enemy object (body) from drawing tree.
         * By this processing, the enemy object
         * will no longer be displayed anywhere, withdrawing it via GC.
         * 描画ツリーから敵機のオブジェクト(自身)を取り除く。
         * この処理により敵機オブジェクトは
         * どこからも参照されなくなるので、GCによって回収される。
         */
        game.rootScene.removeChild(this);
        delete enemies[this.key];
    }
});

/**
 * Succeeds Sprite class, creates bullet class.
 * Usage is indirect, succeeding PlayerShoot, EnemyShoot.
 * Spriteクラスを継承して、弾クラスを生成する。
 * 直接は使わず、PlayerShoot、EnemyShootから継承して利用する
 */
var Shoot = enchant.Class.create(enchant.Sprite, {
    initialize: function (x, y, direction) {
        enchant.Sprite.call(this, 16, 16);
        this.image = game.assets['graphic.png'];
        this.x = x;
        this.y = y;
        this.frame = 1;
        this.direction = direction;
        this.moveSpeed = 10;
        this.addEventListener('enterframe', function () {
            this.x += this.moveSpeed * Math.cos(this.direction);
            this.y += this.moveSpeed * Math.sin(this.direction);
            if(this.y > 320 || this.x > 320 || this.x < -this.width || this.y < -this.height) {
                this.remove();
            }
        });
        game.rootScene.addChild(this);
    },
    remove: function () {
        game.rootScene.removeChild(this);
        delete this;
    }
});

/**
 * PlayerShoot (self shooting) class. Created and succeeds Shoot class.
 * PlayerShoot (自弾) クラス。Shootクラスを継承して作成する。
 */
var PlayerShoot = enchant.Class.create(Shoot, {
    initialize: function (x, y) {
        Shoot.call(this, x, y, 0);
        this.addEventListener('enterframe', function () {
            for (var i in enemies) {
                if(enemies[i].intersect(this)) {
                    this.remove();
                    enemies[i].remove();
                    game.score += 100;
                }
            }
        });
    }
});
/**
 *
 */
var EnemyShoot = enchant.Class.create(Shoot, {
    initialize: function (x, y) {
        Shoot.call(this, x, y, Math.PI);
        this.addEventListener('enterframe', function () {
            if(player.within(this, 8)) {
                game.end(game.score, "SCORE: " + game.score)
            }
        });
    }
});
