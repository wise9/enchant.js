module('gl.enchant.js', {
    setup: function() {
        enchant();
        // var game = new Core();
    },
    teardown: function() {

    }
});

/*
 * issue#54.
 * 
 * Quat#slerp
 */

if (document.createElement('canvas').getContext('experimental-webgl')) {
    test('Quat#slerp', function() {
        function nearlyEqual(numA, numB, message) {
            console.log(numA, numB);
            var a = Math.floor(numA * 1000);
            var b = Math.floor(numB * 1000);
            return equal(a, b, message)
        }

        var q1 = new Quat(1, 0, 0, 0.0);
        var q2 = new Quat(1, 0, 0, 2.0);

        var result = q1.slerp(q2, 0.5);
        var expected = new Quat(1, 0, 0, 1.0);

        nearlyEqual(result._quat[0], expected._quat[0],
            "result._quat[0] == expected._quat[0]");
        nearlyEqual(result._quat[1], expected._quat[1],
            "result._quat[1] == expected._quat[1]");
        nearlyEqual(result._quat[2], expected._quat[2],
            "result._quat[2] == expected._quat[2]");
        nearlyEqual(result._quat[3], expected._quat[3],
            "result._quat[3] == expected._quat[3]");
    });
} else {
    console.log('\nskipping tests using webgl..');
}