describe('KeyboardInputManager', function(){

    before(function(){
        enchant();
    });

    describe('#initialize', function(){

        it('calles BinaryInputManager initializing method', function(){});
        it('ataches keydown event to given domElement');
        it('ataches keyup event to given domElement');
    });

    describe('#keybind', function(){
        it.skip('binds keycode and given name', function(){
            var flagStore = {};
            var keyboardInputManager = new KeyboardInputManager(window.document, flagStore);
        });
    });

    describe('#keyunbind', function(){
        it('unbinds given keycode');
    });

});