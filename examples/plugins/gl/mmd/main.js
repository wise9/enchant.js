enchant();

var game;

// PMDファイルのパス
var MODEL_PATH = 'model/Miku_Hatsune_Metal.pmd';

// VMDファイルのパス
var MOTION_PATH = 'motion/kishimen.vmd';

window.onload = function(){
    game = new Game(800, 800);
    // v0.2.1よりgame.preloadから読み込めるようになった.
    game.preload(MODEL_PATH, MOTION_PATH);
    game.onload = function() {

        var scene = new Scene3D();
        scene.backgroundColor = '#ffffff';

        var camera = scene.getCamera();
        camera.y = 20;
        camera.z = 80;
        camera.centerY = 10;

        // PMDファイル読み込み.
        // colladaの読み込みと同様にcloneかsetして使用する.
        var miku = game.assets[MODEL_PATH].clone();
        scene.addChild(miku);

        // VMDファイル読み込み
        miku.pushAnimation(game.assets[MOTION_PATH]);

        var oldX = 0;
        r = Math.PI / 2;
        game.rootScene.addEventListener('touchstart', function(e) {
            oldX = e.x;
        });
        game.rootScene.addEventListener('touchmove', function(e) {
            r += (e.x - oldX) / 100;
            camera.x = Math.cos(r) * 80;
            camera.z = Math.sin(r) * 80;
            oldX = e.x;
        });

        var label = new Label('0');
        label.font = '24px helvetica';
        game.rootScene.addChild(label);
        var c = 0;
        setInterval(function() {
            label.text = c;
            c = 0;
        }, 1000);
        game.rootScene.addEventListener('enterframe', function(e) {
            c++;
        });

    };
    game.start();
};
