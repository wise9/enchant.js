describe('InputManager', function(){
    before(function(){
        enchant();
    });

    it('is an instance of enchant.EventTarget', function(){
        var inputManager = new InputManager({});
        expect(inputManager).to.be.an.instanceof(enchant.EventTarget);
    });
   
    describe('#initialize', function(){
        var valueStore;

        beforeEach(function(){
            valueStore = {};
        });

        it('creates array for storing broadcast targets', function(){
            var inputManager = new InputManager(valueStore);
            expect(inputManager.broadcastTarget).to.be.an.instanceof(Array);
            expect(inputManager.broadcastTarget).to.be.empty;
        });

        it('sets given associative array as valueStore', function(){
            var inputManager = new InputManager(valueStore);
            expect(inputManager.valueStore).to.deep.equal(valueStore);
            expect(inputManager.valueStore).to.be.empty;
        });

        it('sets given "source" as a source that will be added to event object', function(){
            var inputSource = new InputSource('keycode');
            var inputManager = new InputManager(valueStore, inputSource);
            expect(inputManager.source).to.deep.equal(inputSource);
        });

        it('sets itselves instance as a source that will be added to event object when "source" not given', function(){
            var inputManager = new InputManager(valueStore);
            expect(inputManager.source).to.deep.equal(inputManager);
        });
    });

    describe('#bind', function(){
        var inputManager, inputSource;

        beforeEach(function(){
            inputManager = new InputManager({});
            inputSource = new InputSource('keycode');
        });

        it('binds given input source and name', function(){
            expect(inputManager._binds).to.be.empty;
            inputManager.bind(inputSource, 'name');
            expect(inputManager._binds).to.exist;
            expect(inputManager._binds[inputSource.identifier]).to.equal('name');
        });

        it('adds event listener to given input source', function(){
            sinon.spy(inputManager, '_stateHandler');
            sinon.spy(inputManager, 'changeState');
            inputManager.bind(inputSource, 'name');
            expect(inputManager._stateHandler.called).to.be.false;
            expect(inputManager.changeState.called).to.be.false;
            inputSource.notifyStateChange('data');
            expect(inputManager._stateHandler.called).to.be.true;
            expect(inputManager.changeState.called).to.be.true;
            expect(inputManager.changeState.calledWithExactly('name', 'data')).to.be.true;
            inputManager._stateHandler.restore();
            inputManager.changeState.restore();
        });
    });

    describe('#unbind', function(){
        it('removes binded name', function(){
            var inputManager = new InputManager({});
            var inputSource = new InputSource('keycode');
            sinon.spy(inputManager, '_stateHandler');
            inputManager.bind(inputSource, 'name');
            inputSource.notifyStateChange('data');
            expect(inputManager._stateHandler.called).to.be.true;
            expect(inputManager._stateHandler.callCount).to.equal(1);
            expect(inputManager._binds['keycode']).to.exist;
            inputManager.unbind(inputSource);
            expect(inputManager._binds['keycode']).to.not.exist;
            inputSource.notifyStateChange('data');
            expect(inputManager._stateHandler.callCount).to.equal(1);
            inputManager._stateHandler.restore();
        });
    });

    describe('#addBroadcastTarget', function(){
        it('adds event target', function(){
            var inputManager = new InputManager({});
            var target = new EventTarget();
            expect(inputManager.broadcastTarget).to.be.empty;
            inputManager.addBroadcastTarget(target);
            expect(inputManager.broadcastTarget).to.have.length(1);
            expect(inputManager.broadcastTarget).to.include(target);
            inputManager.addBroadcastTarget(target);
            expect(inputManager.broadcastTarget, 'it does not add same event target').to.have.length(1);
        });
    });

    describe('#removeBroadcastTarget', function(){
        it('removes event target', function(){
            var inputManager = new InputManager({});
            var target1 = new EventTarget(),
                target2 = new EventTarget(),
                target3 = new EventTarget();
            inputManager.addBroadcastTarget(target1);
            inputManager.addBroadcastTarget(target2);
            expect(inputManager.broadcastTarget).to.have.length(2);
            expect(inputManager.broadcastTarget).to.include(target1);
            expect(inputManager.broadcastTarget).to.include(target2);
            inputManager.removeBroadcastTarget(target2);
            expect(inputManager.broadcastTarget).to.have.length(1);
            expect(inputManager.broadcastTarget).to.include(target1);
            expect(inputManager.broadcastTarget).to.not.include(target2);
            inputManager.removeBroadcastTarget(target3);
            expect(inputManager.broadcastTarget, 'it does nothing when given event target has not added').to.have.length(1);
            expect(inputManager.broadcastTarget, 'it does nothing when given event target has not added').to.include(target1);
            expect(inputManager.broadcastTarget, 'it does nothing when given event target has not added').to.not.include(target2);
            expect(inputManager.broadcastTarget, 'it does nothing when given event target has not added').to.not.include(target3);

        });
    });

    describe('#broadcastEvent', function(){
        it('dispatches event to enchant.InputManager.broadcastTarget', function(){
            var inputManager = new InputManager({});
            var target1 = new EventTarget(),
                target2 = new EventTarget();
            var spy1 = sinon.spy(),
                spy2 = sinon.spy();
            target1.addEventListener('keydown', spy1);
            target2.addEventListener('keydown', spy2);
            inputManager.addBroadcastTarget(target1);
            expect(spy1.called).to.be.false;
            inputManager.broadcastEvent(new enchant.Event('keydown'));
            expect(spy1.called).to.be.true;
            expect(spy1.callCount).to.equal(1);
            expect(spy2.called).to.be.false;
            inputManager.addBroadcastTarget(target2);
            inputManager.broadcastEvent(new enchant.Event('keydown'));
            expect(spy1.callCount).to.equal(2);
            expect(spy2.called).to.be.true;
            expect(spy2.callCount).to.equal(1);
            inputManager.removeBroadcastTarget(target1);
            inputManager.broadcastEvent(new enchant.Event('keydown'));
            expect(spy1.callCount).to.equal(2);
            expect(spy2.callCount).to.equal(2);
        });
    });

    describe('#changeState', function(){
        // it does nothing on InputManager , so just confirm the existence of this method.
        it('exists', function(){
            var inputManager = new InputManager();
            expect(inputManager.changeState).to.exist;
        });
    });

});