var game;
module('Group', {
	setup: function () {
		enchant();
		game = new Core(320, 320);
	},
	teardown: function () {
	}
});

test('Group#addChild, Group#removeChild', function () {
    var entity = new enchant.Entity();
    var sprite = new enchant.Sprite();

    var group = new enchant.Group();

    equal(group.childNodes.length, 0);
    group.addChild(entity);
    equal(group.childNodes.length, 1);
    group.addChild(sprite);
    equal(group.childNodes.length, 2);

    equal(group.childNodes[0], entity);
    equal(group.childNodes[1], sprite);

    group.removeChild(entity);
    equal(group.childNodes.length, 1);
    group.removeChild(sprite);
    equal(group.childNodes.length, 0);
});

test('enterframe Event Propagation (group in group)', function () {
    var entity = new enchant.Entity();
    var sprite = new enchant.Sprite();

    var group = new enchant.Group();
    var child_group = new enchant.Group();

    var child_sprite = new enchant.Sprite();

    group.addChild(entity);
    group.addChild(sprite);
    group.addChild(child_group);
    child_group.addChild(child_sprite);

    game.rootScene.addChild(group);
    game._tick();

    equal(entity.age, 1);
    equal(sprite.age, 1);
    equal(group.age, 1);
    equal(child_group.age, 1);
    equal(child_sprite.age, 1);
});
