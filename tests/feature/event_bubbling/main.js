/**
 * グループの回転。
 */

enchant();
window.onload = function() {
    var game = new enchant.Game(320, 320);
    game.preload('chara1.png');
    game.onload = function() {
        var grandchild_red = new enchant.Sprite(80, 80);
        grandchild_red.backgroundColor = '#660000';
        grandchild_red.moveTo(100, 100);
        grandchild_red.on('touchstart', function() {
            console.log('grandchild_red', 'touchstart');
        });
        grandchild_red.on('touchmove', function(evt) {
            console.log('grandchild_red', 'touchmove', evt.localX, evt.localY);
        });
        grandchild_red.on('touchend', function(evt) {
            console.log('grandchild_red', 'touchend');
        });


        var grandchild_blue = new enchant.Sprite(80, 80);
        grandchild_blue.backgroundColor = '#000066';
        grandchild_blue.moveTo(140, 140);
        grandchild_blue.on('touchstart', function() {
            console.log('grandchild_blue', 'touchstart');
        });
        grandchild_blue.on('touchmove', function(evt) {
            console.log('grandchild_blue', 'touchmove', evt.localX, evt.localY);
        });
        grandchild_blue.on('touchend', function(evt) {
            console.log('grandchild_blue', 'touchend');
        });


        var child_group = new enchant.Group();
        child_group.on('touchstart', function() {
            console.log('child_group', 'touchstart');
        });
        child_group.on('touchmove', function(evt) {
            console.log('child_group', 'touchmove', evt.localX, evt.localY);
        });
        child_group.on('touchend', function(evt) {
            console.log('child_group', 'touchend');
        });

        var group = new enchant.Group();
        group.on('touchstart', function() {
            console.log('group', 'touchstart');
        });
        group.on('touchmove', function(evt) {
            console.log('group', 'touchmove', evt.localX, evt.localY);
        });
        group.on('touchend', function(evt) {
            console.log('group', 'touchend');
        });

        game.rootScene.on('touchstart', function() {
            console.log('scene', 'touchstart');
        });
        game.rootScene.on('touchmove', function(evt) {
            console.log('scene', 'touchmove', evt.localX, evt.localY);
        });
        game.rootScene.on('touchend', function(evt) {
            console.log('scene', 'touchend');
        });

        game.rootScene.addChild(group);
        group.addChild(child_group);
        child_group.addChild(grandchild_red);
        child_group.addChild(grandchild_blue);

        console.log('parentNode', group.parentNode === game.rootScene);

    };
    game._debug = true;
    game.start();
};