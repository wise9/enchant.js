enchant();


/**
 * emulation wii u
 */

window.wiiu = {};
window.wiiu.update = function() {
    var keyEventTable = {
        'a': 0x8000,
        'b': 0x4000,
        'x': 0x2000,
        'y': 0x1000,
        'l': 0x0020,
        'r': 0x0010,
        'zl': 0x0080,
        'zr': 0x0040,
        'up': 0x0200,
        'down': 0x0100,
        'right': 0x0800,
        'left': 0x0400
    };
    return {
        'isEnabled': 1,
        'isDataValid': 1,
        'tpTouch': 1,
        'tpValidity': 0,
        'lStickX': 0.7,
        'lStickY': 0.3,
        'rStickX': -0.3,
        'rStickY': 0.7,
        'hold': 0x00
    };
};

window.onload = function() {
    var game = new Game(320, 320);
    game.preload('chara1.png');
    game.onload = function() {
        var bear = new Sprite(32, 32);
        bear.image = game.assets['chara1.png'];
        bear.frame = 0;
        bear.moveTo(100, 160);
        game.rootScene.on(enchant.Event.L_STICK_MOVE, function(evt) {
            bear.x += evt.x * 10;
            bear.y += evt.y * 10;
        });
        game.rootScene.addChild(bear);

        var white = new Sprite(32, 32);
        white.image = game.assets['chara1.png'];
        white.frame = 5;
        white.moveTo(140, 160);
        game.rootScene.on(enchant.Event.R_STICK_MOVE, function(evt) {
            white.x += evt.x * 10;
            white.y += evt.y * 10;
        });
        game.rootScene.addChild(white);
    };
    game.start();
};