enchant();

var game;

window.onload = function() {
    game = new Game(640, 480);
    game.keybind(32, 'a');
    game.preload('../../../../images/enchant-sphere.png');
    game.onload = function() {
        /**
         * ボールの色
         */
        var ballscolor = [
            '#222222', '#222288', '#228822', '#228888', '#882222',
            '#882288', '#888822', '#444444', '#4444aa', '#44aa44',
            '#44aaaa', '#aa4444', '#aa44aa', '#aaaa44', '#aaaaaa'
        ];
        /**
         * ボールのX座標
         */
        var ballsx = [ 0, -0.05, 0.05, -0.1, 0, 0.1, -0.15, -0.05, 0.05, 0.15, -0.2, -0.1, 0, 0.1, 0.2 ];
        /**
         * ボールのZ座標
         */
        var ballsz = [
            0, -0.05 * Math.sqrt(3) * 1, -0.05 * Math.sqrt(3) * 1, -0.05 * Math.sqrt(3) * 2, -0.05 * Math.sqrt(3) * 2,
            -0.05 * Math.sqrt(3) * 2, -0.05 * Math.sqrt(3) * 3, -0.05 * Math.sqrt(3) * 3, -0.05 * Math.sqrt(3) * 3, -0.05 * Math.sqrt(3) * 3,
            -0.05 * Math.sqrt(3) * 4, -0.05 * Math.sqrt(3) * 4, -0.05 * Math.sqrt(3) * 4, -0.05 * Math.sqrt(3) * 4, -0.05 * Math.sqrt(3) * 4
        ];

        /**
         * 物理エンジンに対応したScene3D.
         * enchant.gl.physics.Worldを内包している.
         */
        var scene = new PhyScene3D();
        var camera = scene.getCamera();
        camera.x = 3;
        camera.y = 4;
        camera.z = 2;

        var tabletex = new Texture();
        tabletex.ambient = [0.8, 0.8, 0.8, 1.0];
        tabletex.diffuse = [0.1, 2.1, 0.1, 1.0];
        tabletex.specular = [0.01, 0.01, 0.01, 1.0];

        /**
         * 剛体を持つオブジェクト.
         * 剛体オブジェクトを内包している.
         * PhyScene3DにaddChildすると, 剛体オブジェクトがPhyScene3Dが持つ物理世界オブジェクトに自動的に追加される.
         */
        var table = new PhyBox(0.75, 0.1, 1.5, 0);
        table.mesh.setBaseColor('#446644');
        table.mesh.texture = tabletex;

        /**
         * 物体の反発係数.
         */
        table.restitution = 0.3;
        scene.addChild(table);

        var tableleft = new PhyBox(0.05, 0.1, 1.4, 0);
        tableleft.mesh.setBaseColor('#664444');
        tableleft.mesh.texture = tabletex;
        tableleft.restitution = 0.7;
        tableleft.x = -0.7;
        tableleft.y = 0.2;
        scene.addChild(tableleft);

        var tableright = new PhyBox(0.05, 0.1, 1.4, 0);
        tableright.mesh.setBaseColor('#664444');
        tableright.mesh.texture = tabletex;
        tableright.restitution = 0.7;
        tableright.x = 0.7;
        tableright.y = 0.2;
        scene.addChild(tableright);

        var tabletop = new PhyBox(0.75, 0.1, 0.05, 0);
        tabletop.mesh.setBaseColor('#664444');
        tabletop.mesh.texture = tabletex;
        tabletop.restitution = 1.0;
        tabletop.y = 0.2;
        tabletop.z = -1.45;
        scene.addChild(tabletop);

        var tablebottom = new PhyBox(0.75, 0.1, 0.05, 0);
        tablebottom.mesh.setBaseColor('#664444');
        tablebottom.mesh.texture = tabletex;
        tablebottom.restitution = 0.7;
        tablebottom.y = 0.2;
        tablebottom.z = 1.45;
        scene.addChild(tablebottom);

        var balls = new Array();
        for (var i = 0; i < ballsx.length; i++) {
            var ball = new PhySphere(0.05, 0.15);
            ball.mesh.setBaseColor(ballscolor[i]);
            ball.mesh.texture.ambient = [0.2, 0.2, 0.2, 1.0];
            ball.mesh.texture.diffuse = [0.8, 0.8, 0.8, 1.0];
            ball.mesh.texture.specular = [0.4, 0.4, 0.4, 1.0];
            ball.mesh.texture.src = game.assets['../../../../images/enchant-sphere.png'];
            ball.x = ballsx[i];
            ball.y = 0.15;
            ball.z = ballsz[i];
            ball.friction = 0.5;
            ball.restitution = 1.0;
            scene.addChild(ball);
            balls.push(ball);
        }

        var player = new PhySphere(0.05, 0.15);
        player.x = Math.random() * 0.1 - 0.05;
        player.y = 0.15;
        player.z = 0.5;
        player.restitution = 0.5;
        /**
         * 物体の摩擦係数.
         */
        player.friction = 0;
        scene.addChild(player);
        player.addEventListener('touchend', function() {
            var args = [
                0, 0, -2.8,
                0, 0.1, 0
            ];
            /**
             * 剛体に力を加える.
             */
            this.applyImpulse.apply(this, args);
        });

        var reset = new Label('reset');
        reset.font = '24px helvetica';
        reset.color = '#ffffff';
        reset.addEventListener('touchend', function() {
            player.clearForces();
            player.x = Math.random() * 0.1 - 0.05;
            player.y = 0.15;
            player.z = 0.5;
            for (var i = 0, l = balls.length; i < l; i++) {
                /**
                 * 剛体オブジェクトに掛かっている力をリセットする.
                 */
                balls[i].clearForces();
                balls[i].x = ballsx[i];
                balls[i].y = 0.15;
                balls[i].z = ballsz[i];
            }
        });
        game.rootScene.addChild(reset);

        /**
         * 物理世界の時間を進める.
         * 1フレームに進む時間は, PhyScene3D.world.timestepによって設定されている.
         */
        scene.play();
    };
    game.start();
};
