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

test('tl.delay.then', function() {
    var sprite = enchant.Game.instance.rootScene.childNodes[0];
    var then = false;
    sprite.tl.delay(30).then(function() {
        then = true;
    });
    ok(!then);

    var enterframe = new enchant.Event('enterframe');
    for (var i = 0; i < 30 - 1; i++) {
        sprite.dispatchEvent(enterframe);
    }

    ok(!then);
    sprite.dispatchEvent(enterframe);
    ok(then);

    sprite.tl.clear();
});

test('tl.tween', function() {
    var sprite = enchant.Game.instance.rootScene.childNodes[0];
    sprite.tl.moveTo(320, 320, 30);
    equal(sprite.x, 0);
    equal(sprite.y, 0);
    for (var i = 0; i < 30 - 1; i++) {
        var enterframe = new enchant.Event('enterframe');
        sprite.dispatchEvent(enterframe);
    }
    notEqual(Math.round(sprite.x, 5), 320);
    notEqual(Math.round(sprite.y, 5), 320);

    sprite.dispatchEvent(enterframe);
    equal(Math.round(sprite.x, 5), 320);
    equal(Math.round(sprite.y, 5), 320);
});


test('tl.tween (and)', function() {
    var sprite = enchant.Game.instance.rootScene.childNodes[0];
    sprite.tl.moveTo(320, 0, 30).and().moveTo(0, 320, 30);
    equal(sprite.x, 0);
    equal(sprite.y, 0);
    for (var i = 0; i < 30 - 1; i++) {
        var enterframe = new enchant.Event('enterframe');
        sprite.dispatchEvent(enterframe);
    }
    notEqual(Math.round(sprite.x, 5), 320);
    notEqual(Math.round(sprite.y, 5), 320);

    sprite.dispatchEvent(enterframe);
    equal(Math.round(sprite.x, 5), 320);
    equal(Math.round(sprite.y, 5), 320);
});


test('tl.fadeOut', function() {
    var sprite = enchant.Game.instance.rootScene.childNodes[0];
    sprite.tl.fadeOut(10);
    equal(sprite.opacity, 1);
    for (var i = 0; i < 10 - 1; i++) {
        var enterframe = new enchant.Event('enterframe');
        sprite.dispatchEvent(enterframe);
    }
    notEqual(sprite.opacity, 0);

    sprite.dispatchEvent(enterframe);
    equal(sprite.opacity, 0);
});



