module('primitive.gl.enchant.js', {
    setup: function() {
        enchant();
    },
    teardown: function() {

    }
});

if (document.createElement('canvas').getContext('experimental-webgl')) {
    /*
     * issue#54.
     *
     * BillboardAnimation#frame
     */
    test('BillboardAnimation#frame', function() {
        var game = new Core();
        var scene = new Scene3D();
        var ba = new BillboardAnimation();
        scene.addChild(ba);
        game.dispatchEvent(new Event("enterframe"));
        var error = game.GL._gl.getError();
        notEqual(error, gl.INVALID_OPERATION);
    });
}else{
    console.log('\nskipping tests using webgl..');
}

