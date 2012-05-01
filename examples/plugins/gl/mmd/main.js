enchant();

var game;

// PMDファイルのディレクトリパス
var MODEL_PATH = 'model';
// PMDファイルのファイル名
var MODEL_NAME = 'Miku_Hatsune_Metal.pmd';

// VMDファイルのディレクトリパス
var MOTION_PATH = 'motion';
// VMDファイルのファイル名
var MOTION_NAME = 'kishimen.vmd';

window.onload = function(){
    game = new Game(800, 800);
    game.onload = function() {

        var scene = new Scene3D();
        scene.backgroundColor = '#ffffff';

        var camera = scene.getCamera();
        camera.y = 20;
        camera.z = 80;
        camera.centerY = 10;

        // PMDファイル読み込み
        var miku = new MSprite3D();
        miku.loadPmd(MODEL_PATH, MODEL_NAME, function() {
            scene.addChild(miku);
        });

        // VMDファイル読み込み
        var animation = new MAnimation(MOTION_PATH, MOTION_NAME, function() {
            miku.pushAnimation(animation);
        });

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
