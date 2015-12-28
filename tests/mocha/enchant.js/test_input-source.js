describe('InputSource', function(){
    var inputSource;

    before(function(){
        enchant();
    });

    beforeEach(function(){
        inputSource = new InputSource('keycode');
    });

    it('is an instanceof enchant.EventTarget', function(){
        expect(inputSource).to.be.an.instanceof(enchant.EventTarget);
    });
   
    describe('#initialize', function(){
        it('keeps keycode as indetifier', function(){
            expect(inputSource.identifier).to.equal('keycode');
        });
    });

    describe('#notifyStateChange', function(){
        it('dispatches enchant.Event.INPUT_STATE_CHANGED event', function(){
            var spy = sinon.spy();
            inputSource.addEventListener(enchant.Event.INPUT_STATE_CHANGED, spy);
            expect(spy.called).to.be.false;
            inputSource.notifyStateChange('new state');
            expect(spy.called).to.be.true;
        });

        it('dispatches event with data and source', function(done){
            var data = 'new state';
            inputSource.addEventListener(enchant.Event.INPUT_STATE_CHANGED, function(e){
                expect(e.data).to.equal(data);
                expect(e.source).to.deep.equal(inputSource);
                done();
            });
            inputSource.notifyStateChange(data);
        });
    });
});