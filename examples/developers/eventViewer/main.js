enchant();

window.onload = function() {
    var game = new Game(320, 320);
    game.onload = function() {
        var status = new Label("");
        status._log = [];
        status.add = function(str) {
            this._log.unshift(str);
            this._log = this._log.slice(0, 20);
            this.text =  this._log.join('<br />');
        };

        var round = function(num) {
            return Math.round(num * 1e3) / 1e3;
        };

        game.rootScene.on('touchstart', function(evt) {
            status.add('touchstart (' + round(evt.x) + ', ' + round(evt.y) + ')');
        });
        game.rootScene.on('touchmove', function(evt) {
            status.add('touchmove (' + round(evt.x) + ', ' + round(evt.y) + ')');
        });
        game.rootScene.on('touchstart', function(evt) {
            status.add('touchend (' + round(evt.x) + ', ' + round(evt.y) + ')');
        });

        ['up', 'down', 'right', 'left'].forEach(function (direction) {
            game.rootScene.on(direction + 'buttondown', function() {
                status.add(direction + 'buttondown');
            });
            game.rootScene.on(direction + 'buttonup', function() {
                status.add(direction + 'buttonup');
            });
        });
        game.rootScene.addChild(status);
    };
    game.start();
};
