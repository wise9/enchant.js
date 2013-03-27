QUnit.config.autostart = false;

enchant();

window.onload = function() {
    var core = new Core();
    core.onload = function() {
        QUnit.start();
    };
    core.start();
};

module('MutableText');

test('MutableText with 1 character', function () {
    var m = new MutableText(0, 0);
    m.text = '1';
    equal(m.width, 16);
    equal(m.height, 16);
    equal(m.text, '1');
});

test('MutableText with 5 characters', function () {
    var m = new MutableText(0, 0);
    m.text = '12345';
    equal(m.width,  16 * 5, 'its width should equal to "fontSize * length"');
    equal(m.height, 16,     'its height should equal to fontSize');
    equal(m.text, '12345');

    for (var i = 1; i <= 5; ++i) {
        m.row = i;
        equal(m.width,  16 * i,                'its width should equal to "fontSize * row"');
        equal(m.height, 16 * Math.ceil(5 / i), 'its height should equal to "fontSize * Math.ceil(length / row)"');
    }

    for (var i = 5; i <= 20; ++i) {
        m.row = i;
        equal(m.width,  16 * i, 'its width should equal to "fontSize * row"');
        equal(m.height, 16,     'its height should equal to fontSize');
    }

    m.row = 21;
    equal(m.width,  16 * 20, 'its width should equal to core.width');
    equal(m.height, 16,      'its height should equal to fontSize');
});
