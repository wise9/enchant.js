enchant();

window.onload = function(){
    var core = new Core(320, 320);
    core.onload = function(){
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

        core.rootScene.on('touchstart', function(evt) {
            status.add('touchstart (' + round(evt.x) + ', ' + round(evt.y) + ')');
        });
        core.rootScene.on('touchmove', function(evt){
            status.add('touchmove (' + round(evt.x) + ', ' + round(evt.y) + ')');
        });
        core.rootScene.on('touchstart', function(evt){
            status.add('touchend (' + round(evt.x) + ', ' + round(evt.y) + ')');
        });
        
        ['up', 'down', 'right', 'left'].forEach(function (direction){
            var d = direction;
            core.rootScene.on(direction + 'buttondown', function(){
                status.add(d + 'buttondown');
            })
            core.rootScene.on(direction + 'buttonup', function(){
                status.add(d + 'buttonup');
            })
        });
        core.rootScene.addChild(status);
    };
    core.start();
};