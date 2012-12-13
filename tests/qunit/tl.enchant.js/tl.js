module('tl.enchant.js', {
    setup: function() {
        enchant();
        var game = new Core();
        var sprite = new Sprite(32, 32);
        sprite.moveTo(0, 0);
        game.rootScene.addChild(sprite);
    },
    teardown: function() {

    }
});

test('tl.frameBased', function() {
    var sprite = enchant.Core.instance.rootScene.childNodes[0];

    equal(sprite.tl.isFrameBased, true);
    sprite.tl.setFrameBased();
    equal(sprite.tl.isFrameBased, true);
    sprite.tl.setTimeBased();
    equal(sprite.tl.isFrameBased, false);
    sprite.tl.setFrameBased();
    equal(sprite.tl.isFrameBased, true);
});

test('tl.activated', function() {
    var sprite = enchant.Core.instance.rootScene.childNodes[0];

    equal(sprite.tl._activated, false);
    var defaultListeners = sprite._listeners['enterframe'].length;

    sprite.tl.delay(30);

    equal(sprite.tl._activated, true);
    equal(sprite._listeners['enterframe'].length, defaultListeners + 1);

    var enterframe = new enchant.Event('enterframe');
    for (var i = 0; i < 30 - 1; i++) {
        sprite.dispatchEvent(enterframe);
    }

    equal(sprite.tl._activated, true);
    equal(sprite._listeners['enterframe'].length, defaultListeners + 1);

    sprite.dispatchEvent(enterframe);

    equal(sprite.tl._activated, false);
    equal(sprite._listeners['enterframe'].length, defaultListeners);
});

test('tl.activated (clear)', function() {
    var sprite = enchant.Core.instance.rootScene.childNodes[0];

    equal(sprite.tl._activated, false);
    var defaultListeners = sprite._listeners['enterframe'].length;

    sprite.tl.delay(30);

    equal(sprite.tl._activated, true);
    equal(sprite._listeners['enterframe'].length, defaultListeners + 1);

    var enterframe = new enchant.Event('enterframe');
    for (var i = 0; i < 15; i++) {
        sprite.dispatchEvent(enterframe);
    }

    equal(sprite.tl._activated, true);
    equal(sprite._listeners['enterframe'].length, defaultListeners + 1);

    sprite.tl.clear();

    equal(sprite.tl._activated, false);
    equal(sprite._listeners['enterframe'].length, defaultListeners);
});

test('tl.activated (pause,resume)', function() {
    var sprite = enchant.Core.instance.rootScene.childNodes[0];

    equal(sprite.tl._activated, false);
    equal(sprite.tl.paused, false);
    var defaultListeners = sprite._listeners['enterframe'].length;

    sprite.tl.delay(30);

    equal(sprite.tl._activated, true);
    equal(sprite.tl.paused, false);
    equal(sprite._listeners['enterframe'].length, defaultListeners + 1);

    var enterframe = new enchant.Event('enterframe');
    for (var i = 0; i < 15; i++) {
        sprite.dispatchEvent(enterframe);
    }

    equal(sprite.tl._activated, true);
    equal(sprite.tl.paused, false);
    equal(sprite._listeners['enterframe'].length, defaultListeners + 1);

    sprite.tl.pause();

    equal(sprite.tl._activated, false);
    equal(sprite.tl.paused, true);
    equal(sprite._listeners['enterframe'].length, defaultListeners);
    
    for (i = 0; i < 15; i++) {
        sprite.dispatchEvent(enterframe);
    }
    
    equal(sprite.tl._activated, false);
    equal(sprite.tl.paused, true);
    equal(sprite._listeners['enterframe'].length, defaultListeners);
    
    sprite.tl.resume();
    
    equal(sprite.tl._activated, true);
    equal(sprite.tl.paused, false);
    equal(sprite._listeners['enterframe'].length, defaultListeners + 1);
    
    for (i = 0; i < 14; i++) {
        sprite.dispatchEvent(enterframe);
    }
    
    equal(sprite.tl._activated, true);
    equal(sprite.tl.paused, false);
    equal(sprite._listeners['enterframe'].length, defaultListeners + 1);
    
    sprite.dispatchEvent(enterframe);
    
    equal(sprite.tl._activated, false);
    equal(sprite.tl.paused, false);
    equal(sprite._listeners['enterframe'].length, defaultListeners);
    
    
});

test('tl.delay.then', function() {
    var sprite = enchant.Core.instance.rootScene.childNodes[0];
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


test('tl.delay x 2.then', function() {
    var sprite = enchant.Core.instance.rootScene.childNodes[0];
    var then = false;
    sprite.tl.delay(15).delay(15).then(function() {
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
    var sprite = enchant.Core.instance.rootScene.childNodes[0];
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

test('tl.tween (paused)', function() {
    var sprite = enchant.Core.instance.rootScene.childNodes[0];
    equal(sprite.tl.paused,false);
    sprite.tl.moveTo(320, 320, 60);
    equal(sprite.x, 0);
    equal(sprite.y, 0);
    for (var i = 0; i < 30 - 1; i++) {
        var enterframe = new enchant.Event('enterframe');
        sprite.dispatchEvent(enterframe);
    }
    equal(sprite.tl.paused,false);
    notEqual(Math.round(sprite.x, 5), 320);
    notEqual(Math.round(sprite.y, 5), 320);
    
    equal(sprite.tl.paused,false);
    sprite.tl.pause();
    equal(sprite.tl.paused,true);
    
    for (i = 0; i < 100 - 1; i++) {
        var enterframe = new enchant.Event('enterframe');
        sprite.dispatchEvent(enterframe);
    }
    notEqual(Math.round(sprite.x, 5), 320);
    notEqual(Math.round(sprite.y, 5), 320);
    
    equal(sprite.tl.paused,true);
    sprite.tl.resume();
    equal(sprite.tl.paused,false);
    
    for (var i = 0; i < 30; i++) {
        var enterframe = new enchant.Event('enterframe');
        sprite.dispatchEvent(enterframe);
    }
    
    notEqual(Math.round(sprite.x, 5), 320);
    notEqual(Math.round(sprite.y, 5), 320);
    equal(sprite.tl.paused,false);
    
    sprite.dispatchEvent(enterframe);
    equal(Math.round(sprite.x, 5), 320);
    equal(Math.round(sprite.y, 5), 320);
    equal(sprite.tl.paused,false);
});

test('tl.tween (zero)', function() {
    var sprite = enchant.Core.instance.rootScene.childNodes[0];
    var then = false;
    sprite.tl.delay(1).moveTo(320, 320, 0).then(function(){
        then = true;
    });

    var enterframe = new enchant.Event('enterframe');
    sprite.dispatchEvent(enterframe);

    equal(Math.round(sprite.x, 5), 320);
    equal(Math.round(sprite.y, 5), 320);
    equal(then, true);
});

test('tl.multiMove', function() {
    var sprite = enchant.Core.instance.rootScene.childNodes[0];
    sprite.tl.clear();
    for (var i = 0; i < 10; i++) {
        sprite.tl.moveTo((i + 1) * 10, 0, 1);
    }
    equal(Math.round(sprite.x, 5), 0);
    var enterframe = new enchant.Event('enterframe');
    for (i = 0; i < 9; i++) {
        sprite.dispatchEvent(enterframe);
        notEqual(Math.round(sprite.x, 5), 0);
        notEqual(Math.round(sprite.x, 5), 100);
    }
    sprite.dispatchEvent(enterframe);
    equal(Math.round(sprite.x, 5), 100);
})

test('tl.tween', function() {
    var sprite = enchant.Core.instance.rootScene.childNodes[0];
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
    var sprite = enchant.Core.instance.rootScene.childNodes[0];

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
    var sprite = enchant.Core.instance.rootScene.childNodes[0];
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

var periodTestingFunction = function(time, checkArray,period,sprite,property) {
    for(var j = 0; j < checkArray.length; j++) {
        if(checkArray[j][0] === time%period) {
            equal(sprite[property] === checkArray[j][1],checkArray[j][2],' ' + property + ' for time ' + time + ' testing: ' + checkArray[j][1] + ' === ' + sprite[property] + ', expecting ' + checkArray[j][2]);
        }
    }
}

test('tl.multipleTl', function() {
    var sprite = enchant.Core.instance.rootScene.childNodes[0];
    var tl = new Timeline(sprite,true);
    tl.rotateTo(360,10).delay(2).rotateTo(0,10).delay(2).loop();
    //<- 1-10 rotate -><- 11,12 delay -><- 13-22 rotate -><- 23,24 delay ->
    var rotateCheck = [[0,0,true],[1,0,false],[9,360,false],[9,0,false],[10,360,true],  //rotate
                       [11,360,true],[12,360,true],             //delay
                       [13,360,false],[13,0,false],[21,360,false],[21,0,false],[22,0,true],           //rotate
                       [23,0,true]             //delay
                   ];
    var rotationPeriod = 24;
    
    tl = new Timeline(sprite,true);
    tl.delay(Math.round(Math.random()*10+5)).delay(Math.round(Math.random()*10+5))
    .delay(Math.round(Math.random()*10+5)).delay(Math.round(Math.random()*10+5));
    
    tl = new Timeline(sprite,true);
    tl.fadeOut(20).delay(2).fadeIn(20).delay(2).loop();
    //<- 1-20 fadeOut -><- 21,22 delay -><- 23-42 fadeIn -><- 43,44 delay ->
    var fadeCheck = [[0,1,true],[1,1,false],[9,1,false],[9,0,false],
                     [19,1,false],[19,0,false],[20,0,true],
                     [21,0,true],[22,0,true],
                   [23,0,false],[23,1,false],[29,0,false],[29,1,false],
                   [41,0,false],[41,1,false],[42,1,true],[43,1,true]
                   ];
    var fadePeriod = 44;
    
    sprite.tl.moveTo(300,sprite.y,10).scaleTo(-1,1,1).delay(2).moveTo(0,sprite.y,10).scaleTo(1,1,1).delay(2).loop();
    //<- 1-10 move -><- 11 scale -><- 12,13 delay -><- 14-23 move -><- 24 scale -><- 25,26 delay ->
    var spriteTlMoveCheckX = [[0,0,true],[9,300,false],[10,300,true],
                              [11,300,true],[12,300,true],[13,300,true],
                              [19,300,false],[19,0,false],
                              [23,300,false],[23,0,true],
                              [24,300,false],[24,0,true],
                              [25,0,true]
                              ];
    var spriteTlMoveCheckPeriodX = 26;
    
    var spriteTlScaleCheckX = [[0,1,true],[9,-1,false],[10,-1,false],[11,-1,true],
                              [11,-1,true],[19,-1,true],[23,-1,true],[24,1,true],[25,1,true]];
    var spriteTlScaleCheckPeriodX = 26;
    
    var enterframe = new enchant.Event('enterframe');
    
    for (var i = 0; i < 200 - 1; i++) {
        equal(sprite.y,0,' testing sprite.y === 0');
        equal(sprite.scaleY,1,' testing sprite.scaleY === 1');
        periodTestingFunction(i, rotateCheck,rotationPeriod,sprite,'rotation');
        periodTestingFunction(i, fadeCheck,fadePeriod,sprite,'opacity');
        periodTestingFunction(i, spriteTlMoveCheckX,spriteTlMoveCheckPeriodX,sprite,'x');
        periodTestingFunction(i, spriteTlScaleCheckX,spriteTlScaleCheckPeriodX,sprite,'scaleX');
        
        enterframe.elapsed = Math.round((Math.random()*50+10));
        sprite.dispatchEvent(enterframe);
    }
});


/* time based testing */

test('tl.timebased.activated', function() {
    var sprite = enchant.Core.instance.rootScene.childNodes[0];
    sprite.tl.setTimeBased();
    equal(sprite.tl._activated, false);
    var defaultListeners = sprite._listeners['enterframe'].length;

    sprite.tl.delay(300);

    equal(sprite.tl._activated, true);
    equal(sprite._listeners['enterframe'].length, defaultListeners + 1);

    var enterframe = new enchant.Event('enterframe');
    enterframe.elapsed = 10;
    for (var i = 0; i < 30 - 1; i++) {
        sprite.dispatchEvent(enterframe);
    }

    equal(sprite.tl._activated, true);
    equal(sprite._listeners['enterframe'].length, defaultListeners + 1);

    sprite.dispatchEvent(enterframe);

    equal(sprite.tl._activated, false);
    equal(sprite._listeners['enterframe'].length, defaultListeners);
});

test('tl.timebased.activated (clear)', function() {
    var sprite = enchant.Core.instance.rootScene.childNodes[0];
    sprite.tl.setTimeBased();
    equal(sprite.tl._activated, false);
    var defaultListeners = sprite._listeners['enterframe'].length;

    sprite.tl.delay(1000);

    equal(sprite.tl._activated, true);
    equal(sprite._listeners['enterframe'].length, defaultListeners + 1);

    var enterframe = new enchant.Event('enterframe');
    enterframe.elapsed = 33;
    for (var i = 0; i < 15; i++) {
        sprite.dispatchEvent(enterframe);
    }

    equal(sprite.tl._activated, true);
    equal(sprite._listeners['enterframe'].length, defaultListeners + 1);

    sprite.tl.clear();

    equal(sprite.tl._activated, false);
    equal(sprite._listeners['enterframe'].length, defaultListeners);
});

test('tl.timebased.activated (pause,resume)', function() {
    var sprite = enchant.Core.instance.rootScene.childNodes[0];
    sprite.tl.setTimeBased();
    
    equal(sprite.tl._activated, false);
    equal(sprite.tl.paused, false);
    var defaultListeners = sprite._listeners['enterframe'].length;

    sprite.tl.delay(1000);

    equal(sprite.tl._activated, true);
    equal(sprite.tl.paused, false);
    equal(sprite._listeners['enterframe'].length, defaultListeners + 1);

    var enterframe = new enchant.Event('enterframe');
    enterframe.elapsed = 33;
    for (var i = 0; i < 15; i++) {
        sprite.dispatchEvent(enterframe);
    }

    equal(sprite.tl._activated, true);
    equal(sprite.tl.paused, false);
    equal(sprite._listeners['enterframe'].length, defaultListeners + 1);

    sprite.tl.pause();

    equal(sprite.tl._activated, false);
    equal(sprite.tl.paused, true);
    equal(sprite._listeners['enterframe'].length, defaultListeners);
    
    for (i = 0; i < 15; i++) {
        sprite.dispatchEvent(enterframe);
    }
    
    equal(sprite.tl._activated, false);
    equal(sprite.tl.paused, true);
    equal(sprite._listeners['enterframe'].length, defaultListeners);
    
    sprite.tl.resume();
    
    equal(sprite.tl._activated, true);
    equal(sprite.tl.paused, false);
    equal(sprite._listeners['enterframe'].length, defaultListeners + 1);
    
    for (i = 0; i < 14; i++) {
        sprite.dispatchEvent(enterframe);
    }
    
    equal(sprite.tl._activated, true);
    equal(sprite.tl.paused, false);
    equal(sprite._listeners['enterframe'].length, defaultListeners + 1);
    
    enterframe.elapsed = 1000-29*33;
    sprite.dispatchEvent(enterframe);
    
    equal(sprite.tl._activated, false);
    equal(sprite.tl.paused, false);
    equal(sprite._listeners['enterframe'].length, defaultListeners);
    
    
});

test('tl.timebased.delay.then', function() {
    var sprite = enchant.Core.instance.rootScene.childNodes[0];
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

test('tl.timebased.delay x 2.then', function() {
    var sprite = enchant.Core.instance.rootScene.childNodes[0];
    sprite.tl.setTimeBased();
    
    var then = false;
    sprite.tl.delay(150).delay(150).then(function() {
        then = true;
    });
    ok(!then);

    var enterframe = new enchant.Event('enterframe');
    enterframe.elapsed = 10;
    for (var i = 0; i < 30 - 1; i++) {
        sprite.dispatchEvent(enterframe);
    }

    ok(!then);
    sprite.dispatchEvent(enterframe);
    ok(then);

    sprite.tl.clear();
});

test('tl.timebased.tween', function() {
    var sprite = enchant.Core.instance.rootScene.childNodes[0];
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
    var sprite = enchant.Core.instance.rootScene.childNodes[0];
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
    var sprite = enchant.Core.instance.rootScene.childNodes[0];
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
    var sprite = enchant.Core.instance.rootScene.childNodes[0];
    sprite.tl.moveTo(320, 320, 30);
    equal(sprite.x, 0);
    equal(sprite.y, 0);
    for (var i = 0; i < 30 - 1; i++) {
        var enterframe = new enchant.Event('enterframe');
        enterframe.elapsed = Math.round((Math.random() * 100));
        sprite.dispatchEvent(enterframe);
    }
    notEqual(Math.round(sprite.x, 5), 320);
    notEqual(Math.round(sprite.y, 5), 320);

    enterframe.elapsed = (Math.random() * 100).toFixed(0);
    sprite.dispatchEvent(enterframe);
    equal(Math.round(sprite.x, 5), 320);
    equal(Math.round(sprite.y, 5), 320);
});

test('tl.timebased.parallel (random time)', function() {
    var sprite = enchant.Core.instance.rootScene.childNodes[0];
    sprite.tl.moveTo(320, 320, 2000).and().scaleTo(100, 2000);
    sprite.tl.setTimeBased();
    equal(sprite.x, 0);
    equal(sprite.y, 0);
    equal(sprite._scaleX, 1);
    equal(sprite._scaleY, 1);
    var time = 0;
    while (time < 2000) {
        notEqual(Math.round(sprite.x * 1e5) / 1e5, 320);
        notEqual(Math.round(sprite.y * 1e5) / 1e5, 320);
        notEqual(Math.round(sprite._scaleX * 1e5) / 1e5, 100);
        notEqual(Math.round(sprite._scaleY * 1e5) / 1e5, 100);
        var enterframe = new enchant.Event('enterframe');
        enterframe.elapsed = Math.round((Math.random() * 100));
        sprite.dispatchEvent(enterframe);
        time += enterframe.elapsed;
    }

    equal(Math.round(sprite.x, 5), 320);
    equal(Math.round(sprite.y, 5), 320);
    equal(Math.round(sprite._scaleX, 5), 100);
    equal(Math.round(sprite._scaleY, 5), 100);
});

test('tl.parallel (random time)', function() {
    var sprite = enchant.Core.instance.rootScene.childNodes[0];
    sprite.tl.moveTo(100, 100, 20).and().scaleTo(100, 20);
    equal(sprite.x, 0);
    equal(sprite.y, 0);
    equal(sprite._scaleX, 1);
    equal(sprite._scaleY, 1);
    var time = 0;
    while (time < 20) {
        notEqual(Math.round(sprite.x * 1e5) / 1e5, 320);
        notEqual(Math.round(sprite.y * 1e5) / 1e5, 320);
        notEqual(Math.round(sprite._scaleX * 1e5) / 1e5, 100);
        notEqual(Math.round(sprite._scaleY * 1e5) / 1e5, 100);
        var enterframe = new enchant.Event('enterframe');
        enterframe.elapsed = Math.round((Math.random() * 100));
        sprite.dispatchEvent(enterframe);
        time += 1;
    }

    equal(Math.round(sprite.x, 5), 100);
    equal(Math.round(sprite.y, 5), 100);
    equal(Math.round(sprite._scaleX, 5), 100);
    equal(Math.round(sprite._scaleY, 5), 100);
});
