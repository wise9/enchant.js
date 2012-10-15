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

test('tl.frameBased', function() {
	var sprite = enchant.Game.instance.rootScene.childNodes[0];
	ok(sprite.tl.isFrameBased);
	sprite.tl.setFrameBased();
	ok(sprite.tl.isFrameBased);
	sprite.tl.setTimeBased();
	ok(!sprite.tl.isFrameBased);
	sprite.tl.setFrameBased();
	ok(sprite.tl.isFrameBased);
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



test('tl.tween (minus)', function() {
	var sprite = enchant.Game.instance.rootScene.childNodes[0];

	sprite.moveTo(200, 0);
	sprite.tl.moveBy(-200, 0, 8);
	equal(sprite.x, 200);

	for (var i = 0; i < 8; i++) {
		var enterframe = new enchant.Event('enterframe');
		sprite.dispatchEvent(enterframe);
	}
	equal(sprite.x, 0);
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

/* time based testing */

test('tl.timebased.delay.then', function() {
	var sprite = enchant.Game.instance.rootScene.childNodes[0];
	sprite.tl.setTimeBased();
	var then = false;
	sprite.tl.delay(1000).then(function() {
		then = true;
	});
	ok(!then);

	var enterframe = new enchant.Event('enterframe');
	enterframe.elapsed = 33;
	var time = 0;
	for (var i = 0; i < 30; i++) {
		sprite.dispatchEvent(enterframe);
		time += enterframe.elapsed;
	}
	equal(time, 990);
	enterframe.elapsed = 10;
	ok(!then);
	sprite.dispatchEvent(enterframe);
	ok(then);

	sprite.tl.clear();
	sprite.tl.setFrameBased();
});

test('tl.timebased.tween', function() {
	var sprite = enchant.Game.instance.rootScene.childNodes[0];
	sprite.tl.setTimeBased();
	sprite.tl.moveTo(320, 320, 1000);
	equal(sprite.x, 0);
	equal(sprite.y, 0);
	var enterframe = new enchant.Event('enterframe');
	enterframe.elapsed = 6;
	var time = 0;
	for (var i = 0; i < 165; i++) {
		sprite.dispatchEvent(enterframe);
		time += enterframe.elapsed;
	}
	equal(time, 990);

	notEqual(Math.round(sprite.x, 5), 320);
	notEqual(Math.round(sprite.y, 5), 320);

	enterframe.elapsed = 10;
	sprite.dispatchEvent(enterframe);
	equal(Math.round(sprite.x, 5), 320);
	equal(Math.round(sprite.y, 5), 320);
	sprite.tl.setFrameBased();
	sprite.tl.clear();
});



test('tl.timebased.tween (minus)', function() {
	var sprite = enchant.Game.instance.rootScene.childNodes[0];
	sprite.tl.setTimeBased();
	sprite.moveTo(200, 0);
	sprite.tl.moveBy(-200, 0, 800);
	equal(sprite.x, 200);

	var enterframe = new enchant.Event('enterframe');
	enterframe.elapsed = 20;
	var time = 0;
	for (var i = 0; i < 40; i++) {
		sprite.dispatchEvent(enterframe);
		time += enterframe.elapsed;
	}
	equal(time, 800);
	equal(sprite.x, 0);
	sprite.tl.setFrameBased();
	sprite.tl.clear();
});


test('tl.timebased.fadeOut', function() {
	var sprite = enchant.Game.instance.rootScene.childNodes[0];
	sprite.tl.setTimeBased();
	sprite.tl.fadeOut(100);
	equal(sprite.opacity, 1);
	var enterframe = new enchant.Event('enterframe');
	enterframe.elapsed = 7;
	var time = 0;
	for (var i = 0; i < 14; i++) {
		sprite.dispatchEvent(enterframe);
		time += enterframe.elapsed;
	}
	equal(time, 98);
	notEqual(sprite.opacity, 0);

	enterframe.elapsed = 2;
	sprite.dispatchEvent(enterframe);
	equal(sprite.opacity, 0);
});


test('tl.timebased.tween (framebased with elapsed)', function() {
	var sprite = enchant.Game.instance.rootScene.childNodes[0];
	sprite.tl.moveTo(320, 320, 30);
	equal(sprite.x, 0);
	equal(sprite.y, 0);
	for (var i = 0; i < 30 - 1; i++) {
		var enterframe = new enchant.Event('enterframe');
		enterframe.elapsed = Math.round((Math.random()*100));
		sprite.dispatchEvent(enterframe);
	}
	notEqual(Math.round(sprite.x, 5), 320);
	notEqual(Math.round(sprite.y, 5), 320);

	enterframe.elapsed = (Math.random()*100).toFixed(0);
	sprite.dispatchEvent(enterframe);
	equal(Math.round(sprite.x, 5), 320);
	equal(Math.round(sprite.y, 5), 320);
});

test('tl.timebased.parallel (random time)', function() {
	var sprite = enchant.Game.instance.rootScene.childNodes[0];
	sprite.tl.moveTo(320, 320, 2000).and().scaleTo(100, 2000);
	sprite.tl.setTimeBased();
	equal(sprite.x, 0);
	equal(sprite.y, 0);
	equal(sprite._scaleX, 1);
	equal(sprite._scaleY, 1);
	var time = 0;
	while(time < 2000) {
		notEqual(Math.round(sprite.x, 5), 320);
		notEqual(Math.round(sprite.y, 5), 320);
		notEqual(Math.round(sprite._scaleX, 5), 100);
		notEqual(Math.round(sprite._scaleY, 5), 100);
		var enterframe = new enchant.Event('enterframe');
		enterframe.elapsed = Math.round((Math.random()*100));
		sprite.dispatchEvent(enterframe);
		time += enterframe.elapsed;
	}

	equal(Math.round(sprite.x, 5), 320);
	equal(Math.round(sprite.y, 5), 320);
	equal(Math.round(sprite._scaleX, 5), 100);
	equal(Math.round(sprite._scaleY, 5), 100);
});

test('tl.parallel (random time)', function() {
	var sprite = enchant.Game.instance.rootScene.childNodes[0];
	sprite.tl.moveTo(100, 100, 20).and().scaleTo(100, 20);
	equal(sprite.x, 0);
	equal(sprite.y, 0);
	equal(sprite._scaleX, 1);
	equal(sprite._scaleY, 1);
	var time = 0;
	while(time < 20) {
		notEqual(Math.round(sprite.x, 5), 100);
		notEqual(Math.round(sprite.y, 5), 100);
		notEqual(Math.round(sprite._scaleX, 5), 100);
		notEqual(Math.round(sprite._scaleY, 5), 100);
		var enterframe = new enchant.Event('enterframe');
		enterframe.elapsed = Math.round((Math.random()*100));
		sprite.dispatchEvent(enterframe);
		time += 1;
	}

	equal(Math.round(sprite.x, 5), 100);
	equal(Math.round(sprite.y, 5), 100);
	equal(Math.round(sprite._scaleX, 5), 100);
	equal(Math.round(sprite._scaleY, 5), 100);
});