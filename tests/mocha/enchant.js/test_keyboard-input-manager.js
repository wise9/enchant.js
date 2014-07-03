describe('KeyboardInputManager', function(){

    before(function(){
        enchant();
    });

    after(function(){
        enchant.KeyboardInputSource._instances = {};
    });

    it('is an instanceof BinaryInputManager', function(){
        var keyboardInputManager = new KeyboardInputManager(window.document, {});
        expect(keyboardInputManager).to.be.an.instanceof(enchant.BinaryInputManager);
    });

    describe('#initialize', function(){
        var core, keyboardInputManager, target;

        var makeKeyEvent = function(type){
            var keyEvent = document.createEvent('KeyboardEvent');
            keyEvent.initKeyboardEvent(type, true, true, window, true, false, false, false, 0, 0);
            return keyEvent; // it returns keycode 0
        };

        before(function(){
            enchant.KeyboardInputSource._instances = {};
            var core = new Core();
            keyboardInputManager = new KeyboardInputManager(window.document, {});
            target = new enchant.EventTarget();
            keyboardInputManager.addBroadcastTarget(target);
            keyboardInputManager.keybind(0, 'test');
            core.start();
        });

        it('ataches keydown event to given domElement', function(){
            var spy_inputstart = sinon.spy(),
                spy_keydown = sinon.spy();
            target.addEventListener('inputstart', spy_inputstart);
            target.addEventListener('testbuttondown', spy_keydown);
            var keydownEvent = makeKeyEvent('keydown');
            expect(spy_inputstart.called).to.be.false;
            expect(spy_keydown.called).to.be.false;
            window.document.dispatchEvent(keydownEvent);
            expect(spy_inputstart.called).to.be.true;
            expect(spy_keydown.called).to.be.true;
        });

        it('ataches keyup event to given domElement', function(){
            var spy_inputend = sinon.spy(),
                spy_keyup = sinon.spy();
                target.addEventListener('inputend', spy_inputend);
                target.addEventListener('testbuttonup', spy_keyup);
                var keyupEvent = makeKeyEvent('keyup');
                expect(spy_inputend.called).to.be.false;
                expect(spy_keyup.called).to.be.false;
                window.document.dispatchEvent(keyupEvent);
                expect(spy_inputend.called).to.be.true;
                expect(spy_keyup.called).to.be.true;
        });
    });

    describe('#keybind', function(){
        it('binds keycode and given name', function(){
            var keyboardInputManager = new KeyboardInputManager(window.document, {});
            sinon.spy(keyboardInputManager, 'bind');
            sinon.spy(KeyboardInputSource, 'getByKeyCode');
            expect(keyboardInputManager.bind.called).to.be.false;
            expect(KeyboardInputSource.getByKeyCode.called).to.be.false;
            keyboardInputManager.keybind('keycode', 'name');
            expect(keyboardInputManager.bind.called).to.be.true;
            expect(keyboardInputManager.bind.calledWithExactly(enchant.KeyboardInputSource.getByKeyCode('keycode'), 'name')).to.be.true;
            expect(KeyboardInputSource.getByKeyCode.called).to.be.true;
            expect(KeyboardInputSource.getByKeyCode.calledWithExactly('keycode')).to.be.true;
            keyboardInputManager.bind.restore();
            KeyboardInputSource.getByKeyCode.restore();
        });
    });

    describe('#keyunbind', function(){
        it('unbinds given keycode', function(){
            var keyboardInputManager = new KeyboardInputManager(window.document, {});
            sinon.spy(keyboardInputManager, 'unbind');
            keyboardInputManager.keybind('keycode', 'name');
            expect(keyboardInputManager.unbind.called).to.be.false;
            keyboardInputManager.keyunbind('keycode');
            expect(keyboardInputManager.unbind.called).to.be.true;
            expect(keyboardInputManager.unbind.calledWithExactly(enchant.KeyboardInputSource.getByKeyCode('keycode'))).to.be.true;
            keyboardInputManager.unbind.restore();
        });
    });

});