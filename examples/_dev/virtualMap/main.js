enchant();
window.onload = function(){
    var game = new Game(320, 320);
    game.onload = function(){
        game.rootScene.addEventListener("touchstart", function(evt){
            console.log("touchstart", evt.localX, evt.localY);
        });
        game.rootScene.addEventListener("touchmove", function(evt){
            console.log("touchmove", evt.localX, evt.localY);
        });
        game.rootScene.addEventListener("touchend", function(evt){
            console.log("touchend", evt.localX, evt.localY);
        });
    }
    game.start();
}