function findElementsWithClass(className) {
	return document.getElementsByClassName(className);
}

function findElementWithId(id) {
	return document.getElementById(id);
}


module('Entity', {
	setup: function () {
		enchant();
		var game = new Core(320, 320);
        game.preload('start.png');
        // working around of error "game.assets['start.png'] is undefined"
        game.assets['start.png'] = new Surface();
	},
    // Coreインスタンスを破棄したいのだがそんな処理は無い様子
    teardown: function () {
    }
});



/**
 * @see https://github.com/wise9/enchant.js/issues/14
 */
test('Entity.frame issue 14', function() {
	var sprite = new enchant.Sprite(32, 32);
	var error;

    try{
        sprite.frame = 0;
    	sprite.image = enchant.Core.instance.assets['start.png'];
    }catch(e){
        error = e;
    }
    equal(error, undefined);

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

    // clear before test
    sprite.clearEventListener('enterframe');

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

/**
 * 異なるGroupの中のEntity同士についてintersectやwithinが誤動作
 */
test('Entity#intersect, #within between two entities in different Group', function() {
    var a = new enchant.Sprite(32, 32);
    var b = new enchant.Sprite(32, 32);
    var scene = new enchant.Scene();
    var ga = new enchant.Group();
    var gb = new enchant.Group();
    ga.addChild(a);
    gb.addChild(b);
    scene.addChild(ga);
    scene.addChild(gb);

    equal(a.intersect(b), true);
    equal(a.within(b), true);

    a.x = 64;
    equal(a.intersect(b), false);
    equal(a.within(b), false);

    ga.x = -64;
    equal(a.intersect(b), true);
    equal(a.within(b), true);

    b.y = 64;
    equal(a.intersect(b), false);
    equal(a.within(b), false);

    gb.y = -64;
    equal(a.intersect(b), true);
    equal(a.within(b), true);
});

/**
 * @see https://github.com/wise9/enchant.js/issues/95
 */
test('Sprite should draw a image repetitively, ' +
    'when the image is smaller than the sprite', function() {
    var surface = new enchant.Surface(24, 24);
    var context = surface.context;
    // Draw checkerboard pattern.
    context.fillStyle = '#FFFFFF';
    context.fillRect(0, 0, 24, 24);
    context.fillStyle = '#000000';
    context.fillRect(0, 0, 12, 12);
    context.fillRect(12, 12, 12, 12);

    var expected = new enchant.Surface(32, 32);
    var ctx = expected.context;
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, 32, 32);
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, 12, 12);
    ctx.fillRect(12, 12, 12, 12);
    ctx.fillRect(24, 0, 8, 12);
    ctx.fillRect(0, 24, 12, 8);
    ctx.fillRect(24, 24, 8, 8);
    var expectedArray = ctx.getImageData(0, 0, 32, 32).data;

    var sprite = new enchant.Sprite(32, 32);
    sprite.image = surface;

    var actual = new enchant.Surface(32, 32);
    sprite.cvsRender(actual.context);
    var actualArray = actual.context.getImageData(0, 0, 32, 32).data;

    equal(actualArray.length, expectedArray.length);
    //for (var i = 0; i < actualArray.length; i++)
        //equal(actualArray[i], expectedArray[i]);
    var length = actualArray.length;
    var error = 0;
    var errorCapacity = Math.round(length / 100);
    for (var i = 0; i < length; i++) {
        if (actualArray[i] !== expectedArray[i]) {
            error++;
        }
    }
    var result = ((length - error) / length * 100).toFixed(2) + '% same';
    ok(error < errorCapacity, result);
});
