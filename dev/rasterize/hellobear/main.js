enchant();
window.onload = function() {
    var game = new Game(640, 640);
    game.preload('chara1.png');

    /**
     * テストスプライトのクラス
     */
    var Bear = enchant.Class.create(enchant.Sprite,{
        /**
         * 初期化
         * @constructor
         */
        initialize: function() {
            enchant.Sprite.call(this, 32, 32);
            this.image = game.assets['chara1.png'];
        }
    });

    game.onload = function() {
        // 普通に表示
        var bear = new Bear();
        bear.moveTo(64, 64);
        game.rootScene.addChild(bear);

        // ズームして表示
        var zoom = new Bear();
        zoom.moveTo(64 * 2, 64);
        zoom.scaleX = 2;
        zoom.frame = 2;
        game.rootScene.addChild(zoom);

        // 45度回転して表示
        var rotate = new Bear();
        rotate.moveTo(64 * 3, 64);
        rotate.rotation = 45;
        rotate.frame = 3;
        game.rootScene.addChild(rotate);

        // 90度回転して2倍ズームして表示
        var rotatezoom = new Bear();
        rotatezoom.moveTo(64 * 4, 64);
        rotatezoom.rotation = 90;
        rotatezoom.scaleX = 2;
        rotatezoom.scaleY = 2;
        rotatezoom.frame = 4;
        game.rootScene.addChild(rotatezoom);

        // シロクマを表示
        var frame = new Bear();
        frame.moveTo(64 * 5, 64);
        frame.frame = 5;
        frame.rotation = 180;
        frame.scaleY = 2;
        game.rootScene.addChild(frame);

        // グループの中にクマ
        var child_bear = new Bear();
        var group = new enchant.Group();
        group.addChild(child_bear);
        game.rootScene.addChild(group);
        group.moveTo(64*6, 64);

        // グループの中にクマ
        var grandchild_bear = new Bear();
        var parent_group = new enchant.Group();
        var child_group = new enchant.Group();
        grandchild_bear.x = 64;
        parent_group.moveTo(64*3, 64);
        child_group.moveTo(64*3, 0);
        child_group.addChild(grandchild_bear);
        parent_group.addChild(child_group);
        game.rootScene.addChild(parent_group);

        // グループの中にクマ
        var child_bear = new Bear();
        var group = new enchant.Group(32, 32);
        group.moveTo(64*8, 64);
        group.addChild(child_bear);
        game.rootScene.addChild(group);


    };


    game.start();

};