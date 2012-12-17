var context, core, label;
module('Label.textAlign', {
    setup: function () {
        enchant();
        core = new Core(320, 320);
        context = document.getElementsByTagName('canvas')[0].getContext('2d');
        label = new Label('■');
        label.color = '#f00'
        label.font = '10px monospace';
        ok(!verifyTextAt('left'));
        ok(!verifyTextAt('center'));
        ok(!verifyTextAt('right'));
    }
});

function verifyTextAt(textAlign) {
    var x = 5, image;
    if (textAlign === 'center') {
        x = label.width / 2;
    } else if (textAlign === 'right') {
        x = label.width - 5;
    }
    image = context.getImageData(x,5,1,1).data;
    return image[0] === 255;
}

test('textAlign supports "left"', function (){
    label.textAlign = 'left';
    core.rootScene.addChild(label);

    ok( verifyTextAt('left'));
    ok(!verifyTextAt('center'));
    ok(!verifyTextAt('right'));
});

test('textAlign supports "center"', function (){
    label.textAlign = 'center';
    core.rootScene.addChild(label);

    ok(!verifyTextAt('left'));
    ok( verifyTextAt('center'));
    ok(!verifyTextAt('right'));
});

test('textAlign supports "right"', function (){
    label.textAlign = 'right';
    core.rootScene.addChild(label);

    ok(!verifyTextAt('left'));
    ok(!verifyTextAt('center'));
    ok( verifyTextAt('right'));
});

test('default textAlign is "left"', function (){
    core.rootScene.addChild(label);

    ok( verifyTextAt('left'));
    ok(!verifyTextAt('center'));
    ok(!verifyTextAt('right'));
});