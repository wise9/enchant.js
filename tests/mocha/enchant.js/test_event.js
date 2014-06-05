describe('enchant.Event', function(){
    var testEvent;

    before(function(){
        enchant();
        testEvent = new enchant.Event('testEvent');
    });

    describe('#initialize', function(){
        it('has type', function(){
            expect(testEvent.type).to.equal('testEvent');
        });

        it('default target is null', function(){
            expect(testEvent.target).to.be.null;
        });

        it('default coordinates are (x, y) = (0, 0)', function(){
            expect(testEvent.x).to.equal.zero;
            expect(testEvent.y).to.equal.zero;
            expect(testEvent.localX).to.equal.zero;
            expect(testEvent.localY).to.equal.zero;
        });
    });

    describe('#_initPosition', function(){
        it('initializes with given coordinates and core size', function(){
            var core = new Core(320, 640);
            var scale = core.scale;
            testEvent._initPosition(100, 200);
            expect(testEvent.x).to.equal(100 / scale);
            expect(testEvent.localX).to.equal(100 / scale);
            expect(testEvent.y).to.equal(200 / scale);
            expect(testEvent.localY).to.equal(200 / scale);
        });
    });

    describe('enchant.js defined events', function(){
        it('has some defined Events', function(){
            expect(enchant.Event.LOAD).to.equal('load');
            expect(enchant.Event.ERROR).to.equal('error');
            expect(enchant.Event.CORE_RESIZE).to.equal('coreresize');
            expect(enchant.Event.PROGRESS).to.equal('progress');
            expect(enchant.Event.ENTER_FRAME).to.equal('enterframe');
            expect(enchant.Event.EXIT_FRAME).to.equal('exitframe');
            expect(enchant.Event.ENTER).to.equal('enter');
            expect(enchant.Event.EXIT).to.equal('exit');
            expect(enchant.Event.CHILD_ADDED).to.equal('childadded');
            expect(enchant.Event.ADDED).to.equal('added');
            expect(enchant.Event.ADDED_TO_SCENE).to.equal('addedtoscene');
            expect(enchant.Event.CHILD_REMOVED).to.equal('childremoved');
            expect(enchant.Event.REMOVED).to.equal('removed');
            expect(enchant.Event.REMOVED_FROM_SCENE).to.equal('removedfromscene');
            expect(enchant.Event.TOUCH_START).to.equal('touchstart');
            expect(enchant.Event.TOUCH_MOVE).to.equal('touchmove');
            expect(enchant.Event.TOUCH_END).to.equal('touchend');
            expect(enchant.Event.RENDER).to.equal('render');
            expect(enchant.Event.INPUT_START).to.equal('inputstart');
            expect(enchant.Event.INPUT_CHANGE).to.equal('inputchange');
            expect(enchant.Event.INPUT_END).to.equal('inputend');
            expect(enchant.Event.INPUT_STATE_CHANGED).to.equal('inputstatechanged');
            expect(enchant.Event.LEFT_BUTTON_DOWN).to.equal('leftbuttondown');
            expect(enchant.Event.LEFT_BUTTON_UP).to.equal('leftbuttonup');
            expect(enchant.Event.RIGHT_BUTTON_DOWN).to.equal('rightbuttondown');
            expect(enchant.Event.RIGHT_BUTTON_UP).to.equal('rightbuttonup');
            expect(enchant.Event.UP_BUTTON_DOWN).to.equal('upbuttondown');
            expect(enchant.Event.UP_BUTTON_UP).to.equal('upbuttonup');
            expect(enchant.Event.DOWN_BUTTON_DOWN).to.equal('downbuttondown');
            expect(enchant.Event.DOWN_BUTTON_UP).to.equal('downbuttonup');
            expect(enchant.Event.A_BUTTON_DOWN).to.equal('abuttondown');
            expect(enchant.Event.A_BUTTON_UP).to.equal('abuttonup');
            expect(enchant.Event.B_BUTTON_DOWN).to.equal('bbuttondown');
            expect(enchant.Event.B_BUTTON_UP).to.equal('bbuttonup');
            expect(enchant.Event.ADDED_TO_TIMELINE).to.equal('addedtotimeline');
            expect(enchant.Event.REMOVED_FROM_TIMELINE).to.equal('removedfromtimeline');
            expect(enchant.Event.ACTION_START).to.equal('actionstart');
            expect(enchant.Event.ACTION_END).to.equal('actionend');
            expect(enchant.Event.ACTION_TICK).to.equal('actiontick');
            expect(enchant.Event.ACTION_ADDED).to.equal('actionadded');
            expect(enchant.Event.ACTION_REMOVED).to.equal('actionremoved');
        });
    });

});