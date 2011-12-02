function findElementsWithClass(className) {
	return document.getElementsByClassName(className);
}

function findElementWithId(id) {
	return document.getElementById(id);
}


module('Entity', {
	setup: function () {
		enchant();
		var game = new Game();
	},
	teardown: function () {
		// Gameインスタンスを破棄したいのだがそんな処理は無い様子
	}
});


test('Entity.className', function () {
	var label = new Label();
	label.className = 'myClassName';
	equal(label.className, 'myClassName');

	ok(findElementsWithClass('myClassName').length === 0);
	enchant.Game.instance.rootScene.addChild(label);
	ok(findElementsWithClass('myClassName').length === 1);
});

test('Entity.id', function () {
	var label = new Label();
	label.id = 'myId';
	equal(label.id, 'myId');

	ok(findElementWithId('myId') === null);
	enchant.Game.instance.rootScene.addChild(label);
	ok(findElementWithId('myId') !== null);
});

/**
 * @see https://github.com/wise9/enchant.js/issues/14
 */
test('Entity.frame issue 14', function() {
	var sprite = new Sprite(32, 32);
	sprite.frame = 0;
	sprite.image = enchant.Game.instance.assets['start.png'];
});

/**
 * @see https://github.com/wise9/enchant.js/issues/18
 */
test('Entity.buttonMode issue 18', function () {
	var sprite = new Sprite();
	sprite.buttonMode = 'a';

	ok(!sprite.buttonPressed);
	sprite.dispatchEvent(new enchant.Event('touchstart'))
	ok(sprite.buttonPressed);
	sprite.dispatchEvent(new enchant.Event('touchend'))
	ok(!sprite.buttonPressed);
});


/**
 * add/remove/clearEventListener
 */
test('add/remove/clear EventListeners', function () {
	var sprite = new Sprite();
	listener = function(){};
	listener2 = function(){};

    sprite.addEventListener('enterframe', listener);
    equal(sprite._listeners['enterframe'].length, 1);
    sprite.removeEventListener('enterframe', listener);
    equal(sprite._listeners['enterframe'].length, 0);

    sprite.addEventListener('enterframe', listener);
    equal(sprite._listeners['enterframe'].length, 1);
    sprite.addEventListener('enterframe', listener2);
    equal(sprite._listeners['enterframe'].length, 2);
    sprite.clearEventListener('enterframe');
    equal(sprite._listeners['enterframe'], undefined);

    sprite.addEventListener('enterframe', listener);
    equal(sprite._listeners['enterframe'].length, 1);
    sprite.addEventListener('enterframe', listener2);
    equal(sprite._listeners['enterframe'].length, 2);
    sprite.clearEventListener();
    equal(sprite._listeners['enterframe'], undefined);
    console.log(sprite._listeners);

});

