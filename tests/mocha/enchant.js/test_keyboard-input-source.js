describe('KeyboardInputSource', function(){

    before(function(){
        enchant();
    });

    it('is an instance of enchant.BinaryInputSource', function(){
        var keyboardInputSource = new KeyboardInputSource('keycode');
        expect(keyboardInputSource).to.be.an.instanceof(enchant.BinaryInputSource);
    });

    describe('enchant.KeyboardInputSource.getByKeyCode', function(){
        it('creates a new KeyboardInputSource instance with given keycode if it has not created', function(){
            expect(enchant.KeyboardInputSource._instances).to.be.empty;
            var keyboardInputSource = enchant.KeyboardInputSource.getByKeyCode('keycode');
            expect(keyboardInputSource).to.be.an.instanceof(enchant.KeyboardInputSource);
            expect(enchant.KeyboardInputSource._instances).to.not.be.empty;
        });

        it('returns KeyboardInputSource instance if KeyboardInputSource instance already created with given keycode', function(){
            enchant.KeyboardInputSource.getByKeyCode('keycode');
            expect(enchant.KeyboardInputSource._instances['keycode']).to.exist;
            var keyboardInputSource = enchant.KeyboardInputSource.getByKeyCode('keycode');
            expect(keyboardInputSource).to.deep.equal(enchant.KeyboardInputSource._instances['keycode']);
        });
    });
});