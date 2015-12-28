describe('BinaryInputSource', function(){
    before(function(){
        enchant();
    });

    it('is an instance of InputSource', function(){
        var binaryInputSource = new BinaryInputSource('keycode');
        expect(binaryInputSource).to.be.an.instanceof(enchant.InputSource);
    });
});