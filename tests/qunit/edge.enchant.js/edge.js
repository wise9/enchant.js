module('edge.enchant.js', {
    setup: function() {
        enchant();
        game = new Core();
        game.onload = function() {
            game._onloadCalled = true;
            if(game._loadedTimeout) {
                clearTimeout(game._loadedTimeout);
                start();
            }
        }
        stop();
        game.start();
        game._loadedTimeout = setTimeout(function() {
            start();
            game._loadedTimeout = null;
        }, 500);
    },
    teardown: function() {
    }
});
var fEqual = function(a,b) {
    var e = Math.abs(a-b);
    equal(e < 0.01,true,a + ' not equal to ' + b);
}
var assertInstanceOf = function(object,clazz,objectName,clazzName) {
    if(!objectName) {
        objectName = clazz;
    }
    if(!clazzName) {
        clazzName = clazz;
    }
    equal(object instanceof clazz,true, objectName + ' not instance of ' + clazzName + ' (was ' + object + ')');
}
test('edge.init', function() {
    assertInstanceOf(AdobeEdge, Object,
            "AdobeEdge", "Object");
    assertInstanceOf(enchant.edge.Compositions.instance, enchant.edge.Compositions,
            "enchant.edge.Compositions.instance", "enchant.edge.Compositions");
});

test('edge.getRegisteredCompositionIds', function() {
    deepEqual(enchant.edge.Compositions.instance.getRegisteredCompositionIds(),["EDGE-17094758", "EDGE-298358922"]);
});

test('edge.enchant_edge.js', function() {
    assertInstanceOf(game.assets['images/enchant.png'], enchant.Surface,
            "game.assets['images/enchant.png']", "enchant.Surface");
    
    var edge = enchant.edge.Compositions.instance;
    var symbolInstance = edge.createSymbolInstance();
    
    assertInstanceOf(symbolInstance, enchant.edge.Symbol,
            "symbolInstance", "enchant.edge.Symbol");
    equal(symbolInstance.id,"EDGE-17094758");
    symbolInstance.addToGroup(game.rootScene);
    
    var sprite = symbolInstance.getSprite('enchant');
    
    assertInstanceOf(sprite, enchant.edge.EdgeSprite,
            "sprite", "enchant.edge.EdgeSprite");
    
    stop();
    var nextFrame = false;
    var cb = function() {
        if(nextFrame) {
        game.rootScene.removeEventListener('enterframe',cb);
        start();
        equal(symbolInstance.isPlaying(),true);
        equal(sprite.scaleX,1);
        equal(sprite.scaleY,1);
        notEqual(sprite.x,0);
        notEqual(sprite.y,0);
        equal(sprite.rotation,0);
        game.stop();
        
        symbolInstance.play(1970);
        game.currentTime = game.getTime()-30;
        game._tick();
        equal(symbolInstance.isPlaying(),true);
        fEqual(sprite.scaleX,1);
        fEqual(sprite.scaleY,1);
        fEqual(sprite.x,225);
        fEqual(sprite.y,150);
        fEqual(sprite.rotation,0);
        
        symbolInstance.play(2970);
        game.currentTime = game.getTime()-31;
        game._tick();
        game.currentTime = game.getTime()-1;
        game._tick();
        equal(symbolInstance.isPlaying(),false);
        fEqual(sprite.scaleX,4);
        fEqual(sprite.scaleY,4);
        fEqual(sprite.x,225);
        fEqual(sprite.y,150);
        fEqual(sprite.rotation,360);
        } else {
            nextFrame = true;
        }        
    };
    game.rootScene.addEventListener('enterframe',cb);
   
});

test('edge.interactivity_finished_edge.js', function() {
    assertInstanceOf(game.assets['images/button.png'], enchant.Surface,
            "game.assets['images/button.png']", "enchant.Surface");
    
    var edge = enchant.edge.Compositions.instance;
    var symbolInstance = edge.createSymbolInstance("EDGE-298358922");
    
    assertInstanceOf(symbolInstance, enchant.edge.Symbol,
            "symbolInstance", "enchant.edge.Symbol");
    equal(symbolInstance.id,"EDGE-298358922");
    symbolInstance.addToGroup(game.rootScene);
    stop();
    setTimeout(function() {
        start();
        equal(symbolInstance.isPlaying(),true);
    }, 70);
});