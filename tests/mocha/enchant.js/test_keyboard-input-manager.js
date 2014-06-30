describe('KeyboardInputManager', function(){

    before(function(){
        enchant();
    });

    describe('#initialize', function(){

        it('calls BinaryInputManager initializing method');
        it('ataches keydown event to given domElement');
        it('ataches keyup event to given domElement');
    });

    describe('#keybind', function(){
        it('binds keycode and given name');
    });

    describe('#keyunbind', function(){
        it('unbinds given keycode');
    });

});