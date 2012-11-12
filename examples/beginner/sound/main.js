enchant();

window.onload = function() {
    var game = new Game(200, 200);
    game.preload('bomb1.wav', 'se6.wav');
    game.onload = function() {
        var bomb = game.assets['bomb1.wav'];
        var jing = game.assets['se6.wav'];
        var pad = new Pad();
        pad.x = game.width / 2 - pad.width / 2;
        pad.y = game.height / 2 - pad.height / 2;
        game.rootScene.addChild(pad);
        game.rootScene.addEventListener('leftbuttonup', function() {
            bomb.play();
        });
        game.rootScene.addEventListener('rightbuttonup', function() {
            jing.play();
        });
        game.rootScene.addEventListener('upbuttonup', function() {
            setTimeout(function() {
                bomb.play();
            }, 500);
        });
        game.rootScene.addEventListener('downbuttonup', function() {
            setTimeout(playjingle, 500);
        });
        var playjingle = function() {
            jing.play();
        };
        try {
            jing.play();
        } catch(e) {
            alert(e.message);
        }
    };
    game.start();
};
