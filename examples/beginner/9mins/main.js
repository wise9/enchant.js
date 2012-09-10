enchant();
window.onload = function() {
    var game = new Game(320, 320);
    game.preload('enchant.png', 'chara1.png'); // chara1.gifを読み込む
    game.onload = function() {
        // 映画

        game.rootScene.backgroundColor = 'white';

        var gray = new Label('');

        var black = new Label('');
        black.y = 32;
        black.font = 'black';

        game.rootScene.addChild(black);
        game.rootScene.addChild(gray);

        var words = [
            'function(){}',
            'var',
            'window',
            'game.onload',
            'enchant.sprite',
            'return',
            'enchant.Game',
        ];

        function getword(){
            return words[rand(words.length)];
        }
        var word;

        function newword(){
            word = getword();
            gray.text = word;
        }

        var score = 0;

        window.addEventListener('keypress', function(evt) {
            var str = String.fromCharCode(evt.keyCode);
            black.text += str;
            if(black.text == gray.text){
                newword();
                black.text = '';
                score++;
                if(score > 10){
                    alert(Math.floor(game.rootScene.age/game.fps) + 'びょう');
                }
            }
            if(str === '\n'){
                black.text = '';
            }
            console.log(str);
            return false;
        });

        function rand(num) {
            return Math.floor(Math.random() * num);
        }
        game.rootScene.tl.delay(5).then(function() {
            newword();
        });
    }
    game.start();
}