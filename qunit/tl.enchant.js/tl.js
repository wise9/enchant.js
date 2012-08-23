module('tl.enchant.js', {
    setup: function() {
        enchant();
        var game = new Game();
        var sprite = new Sprite(32, 32);
        sprite.moveTo(0, 0);
        game.rootScene.addChild(sprite);

    },
    teardown: function() {

    }
});

test('tl.tween (and)', function() {
    var sprite = game.rootScene.childNodes[0];
    sprite.tl.moveTo(320, 0, 30).and().moveTo(0, 320, 30);
    equal(sprite.x, 0);
    equal(sprite.y, 0);
    for(var i = 0; i < 30; i++){
        var enterframe = new enchant.Event('enterframe');
        game.rootScene.dispatchEvent(enterframe);
    }
    equal(Math.round(sprite.x, 5), 320);
    equal(Math.round(sprite.y, 5), 320);
});



