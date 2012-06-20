enchant();
var game;
window.onload = function() {
    game = new Game(320, 320);
    game.preload('../../../../images/enchant-sphere.png');
    game.onload = function() {
        /**
         * 3D用のシーンを定義する.
         * Sprite3DはScene3Dに追加することで画面に表示される.
         */
        var scene = new Scene3D();
        /**
         * 球体型のオブジェクトをつくる.
         * primitive.gl.enchant.js内のクラスを使用している.
         * primitive.gl.enchant.js内定義されている基本図形はSprite3Dを継承している.
         */
        var ball = new Sphere();
        /**
         * テクスチャを設定する.
         * Sprite3Dのmeshプロパティが表示上の実体となる.
         * テクスチャのソースはpreloadでロードしたデータの他に, canvasオブジェクト, imageオブジェクト, 画像のURLを表す文字列が使用できる.
         */
        ball.mesh.texture.src = game.assets['../../../../images/enchant-sphere.png'];
        ball.z = -20;

        ball.addEventListener('enterframe', function(e) {
            /**
             * オブジェクトを回転させる.
             * rotateYawはオブジェクトのY軸回転.
             */
            this.rotateYaw(0.01);
        });
        scene.addChild(ball);

        var cube = new Cube();
        cube.z = 0;
        cube.vz = -0.1;

        cube.addEventListener('enterframe', function(e) {
            /**
             * オブジェクトを回転させる.
             * rotateRollはオブジェクトのZ軸回転.
             */
            this.rotateYaw(0.01);
            this.rotateRoll(0.01);
            this.z += cube.vz;
            /**
             * オブジェクト同士の当たり判定を計算する.
             * 当たり判定は Sprite3D が持つ Bounding オブジェクト同士で行われる.
             * Bounding オブジェクトを変えることで当たり判定の方法を変更することができる.
             */
            if (this.intersect(ball)) {
                cube.vz = -cube.vz;
                console.log('hit!');
            }
            if (this.z > 0) {
                cube.vz = -cube.vz;
            }
        });
        scene.addChild(cube);
    };
    game.start();
};
