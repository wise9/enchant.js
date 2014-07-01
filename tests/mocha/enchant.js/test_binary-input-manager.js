describe('BinaryInputManager', function(){
    before(function(){
        enchant();
    });

    it('is an instance of enchant.InputManager', function(){
        var binaryInputManager = new BinaryInputManager({}, 'buttondown', 'buttonup');
        expect(binaryInputManager).to.be.an.instanceof(enchant.InputManager);
    });

    describe('#initialize', function(){
        var binaryInputManager;

        before(function(){
            binaryInputManager = new BinaryInputManager({}, 'active', 'inactive');
        });

        it('sets default value of the number of active inputs', function(){
            expect(binaryInputManager.activeInputsNum).to.exist;
            expect(binaryInputManager.activeInputsNum).to.equal.zero;
        });
        it('sets event name suffix that dispatches by BinaryInputManager',function(){
            expect(binaryInputManager.activeEventNameSuffix).to.equal('active');
            expect(binaryInputManager.inactiveEventNameSuffix).to.equal('inactive');
        });
    });

    describe('#bind', function(){
        it('sets name to specified input', function(){
            var binaryInputManager = new BinaryInputManager({}, 'active', 'inactive');
            var binaryInputSource = new BinaryInputSource('keycode');
            expect(binaryInputManager.valueStore).to.be.empty;
            expect(binaryInputManager._binds).to.be.empty;
            binaryInputManager.bind(binaryInputSource, 'name');
            expect(binaryInputManager.valueStore['name']).to.exist;
            expect(binaryInputManager.valueStore['name']).to.be.false;
            expect(binaryInputManager._binds[binaryInputSource.identifier]).to.equal('name');
        });
    });

    describe('#unbind', function(){
        it('removes binded name', function(){
            var binaryInputManager = new BinaryInputManager({}, 'active', 'inactive');
            var binaryInputSource = new BinaryInputSource('keycode');
            binaryInputManager.bind(binaryInputSource, 'name');
            expect(binaryInputManager.valueStore['name']).to.exist;
            expect(binaryInputManager.valueStore['name']).to.be.false;
            expect(binaryInputManager._binds[binaryInputSource.identifier]).to.equal('name');
            binaryInputManager.unbind(binaryInputSource);
            expect(binaryInputManager.valueStore['name']).to.not.exist;
            expect(binaryInputManager._binds[binaryInputSource.identifier]).to.not.exist;
        });
    });

    describe('#changeState', function(){
        var binaryInputManager, inputSource1, inputSource2, target1, target2;
        var spy1_inputstart, spy1_inputchange, spy1_input1active, spy1_input2active,
            spy1_input1inactive, spy1_input2inactive, spy1_inputend,
            spy2_inputstart, spy2_inputchange, spy2_input1active, spy2_input2active,
            spy2_input1inactive, spy2_input2inactive, spy2_inputend;


        before(function(){
            binaryInputManager = new BinaryInputManager({}, 'active', 'inactive');
            inputSource1 = new BinaryInputSource('keycode1');
            inputSource2 = new BinaryInputSource('keycode2');
            target1 = new EventTarget();
            target2 = new EventTarget();
            binaryInputManager.addBroadcastTarget(target1);
            binaryInputManager.addBroadcastTarget(target2);
            binaryInputManager.bind(inputSource1, 'input1');
            binaryInputManager.bind(inputSource2, 'input2');
        });

        beforeEach(function(){
            spy1_inputstart = sinon.spy();
            spy1_inputchange = sinon.spy();
            spy1_input1active = sinon.spy();
            spy1_input2active = sinon.spy();
            spy1_input1inactive = sinon.spy();
            spy1_input2inactive = sinon.spy();
            spy1_inputend = sinon.spy();
            spy2_inputstart = sinon.spy();
            spy2_inputchange = sinon.spy();
            spy2_input1active = sinon.spy();
            spy2_input2active = sinon.spy();
            spy2_input1inactive = sinon.spy();
            spy2_input2inactive = sinon.spy();
            spy2_inputend = sinon.spy();
            target1.addEventListener('inputstart', spy1_inputstart);
            target1.addEventListener('inputchange', spy1_inputchange);
            target1.addEventListener('input1active', spy1_input1active);
            target1.addEventListener('input2active', spy1_input2active);
            target1.addEventListener('input1inactive', spy1_input1inactive);
            target1.addEventListener('input2inactive', spy1_input2inactive);
            target1.addEventListener('inputend', spy1_inputend);
            target2.addEventListener('inputstart', spy2_inputstart);
            target2.addEventListener('inputchange', spy2_inputchange);
            target2.addEventListener('input1active', spy2_input1active);
            target2.addEventListener('input2active', spy2_input2active);
            target2.addEventListener('input1inactive', spy2_input1inactive);
            target2.addEventListener('input2inactive', spy2_input2inactive);
            target2.addEventListener('inputend', spy2_inputend);
        });

        afterEach(function(){
            target1.removeEventListener('inputstart', spy1_inputstart);
            target1.removeEventListener('inputchange', spy1_inputchange);
            target1.removeEventListener('input1active', spy1_input1active);
            target1.removeEventListener('input2active', spy1_input2active);
            target1.removeEventListener('input1inactive', spy1_input1inactive);
            target1.removeEventListener('input2inactive', spy1_input2inactive);
            target1.removeEventListener('inputend', spy1_inputend);
            target2.removeEventListener('inputstart', spy2_inputstart);
            target2.removeEventListener('inputchange', spy2_inputchange);
            target2.removeEventListener('input1active', spy2_input1active);
            target2.removeEventListener('input2active', spy2_input2active);
            target2.removeEventListener('input1inactive', spy2_input1inactive);
            target2.removeEventListener('input2inactive', spy2_input2inactive);
            target2.removeEventListener('inputend', spy2_inputend);
        });

        it('makes input state "active" and dispatches inputstart event and down event', function(){
            expect(binaryInputManager.valueStore['input1']).to.be.false;
            expect(binaryInputManager.valueStore['input2']).to.be.false;

            binaryInputManager.changeState('input1', true);

            expect(spy1_inputstart.called).to.be.true;
            expect(spy1_inputchange.called).to.be.false;
            expect(spy1_input1active.called).to.be.true;
            expect(spy1_input2active.called).to.be.false;
            expect(spy1_input1inactive.called).to.be.false;
            expect(spy1_input2inactive.called).to.be.false;
            expect(spy1_inputend.called).to.be.false;
            expect(spy2_inputstart.called).to.be.true;
            expect(spy2_inputchange.called).to.be.false;
            expect(spy2_input1active.called).to.be.true;
            expect(spy2_input2active.called).to.be.false;
            expect(spy2_input1inactive.called).to.be.false;
            expect(spy2_input2inactive.called).to.be.false;
            expect(spy2_inputend.called).to.be.false;

            expect(binaryInputManager.valueStore['input1']).to.be.true;
            expect(binaryInputManager.valueStore['input2']).to.be.false;
        });

        it('makes another input satet "active" and dispatches inputchange event and down event', function(){
            expect(binaryInputManager.valueStore['input2']).to.be.false;
            expect(binaryInputManager.valueStore['input1']).to.be.true;

            binaryInputManager.changeState('input2', true);

            expect(spy1_inputstart.called).to.be.false;
            expect(spy1_inputchange.called).to.be.true;
            expect(spy1_input1active.called).to.be.false;
            expect(spy1_input2active.called).to.be.true;
            expect(spy1_input1inactive.called).to.be.false;
            expect(spy1_input2inactive.called).to.be.false;
            expect(spy1_inputend.called).to.be.false;
            expect(spy2_inputstart.called).to.be.false;
            expect(spy2_inputchange.called).to.be.true;
            expect(spy2_input1active.called).to.be.false;
            expect(spy2_input2active.called).to.be.true;
            expect(spy2_input1inactive.called).to.be.false;
            expect(spy2_input2inactive.called).to.be.false;
            expect(spy2_inputend.called).to.be.false;

            expect(binaryInputManager.valueStore['input2']).to.be.true;
            expect(binaryInputManager.valueStore['input1']).to.be.true;
        });
        it('makes another input state "inactive" and dispatches inputchange event and up event', function(){
            expect(binaryInputManager.valueStore['input2']).to.be.true;
            expect(binaryInputManager.valueStore['input1']).to.be.true;

            binaryInputManager.changeState('input2', false);

            expect(spy1_inputstart.called).to.be.false;
            expect(spy1_inputchange.called).to.be.true;
            expect(spy1_input1active.called).to.be.false;
            expect(spy1_input2active.called).to.be.false;
            expect(spy1_input1inactive.called).to.be.false;
            expect(spy1_input2inactive.called).to.be.true;
            expect(spy1_inputend.called).to.be.false;
            expect(spy2_inputstart.called).to.be.false;
            expect(spy2_inputchange.called).to.be.true;
            expect(spy2_input1active.called).to.be.false;
            expect(spy2_input2active.called).to.be.false;
            expect(spy2_input1inactive.called).to.be.false;
            expect(spy2_input2inactive.called).to.be.true;
            expect(spy2_inputend.called).to.be.false;

            expect(binaryInputManager.valueStore['input2']).to.be.false;
            expect(binaryInputManager.valueStore['input1']).to.be.true;

        });

        it('makes input state "inactive" and dispatches inputend event and up event', function(){
            expect(binaryInputManager.valueStore['input2']).to.be.false;
            expect(binaryInputManager.valueStore['input1']).to.be.true;

            binaryInputManager.changeState('input1', false);

            expect(spy1_inputstart.called).to.be.false;
            expect(spy1_inputchange.called).to.be.false;
            expect(spy1_input1active.called).to.be.false;
            expect(spy1_input2active.called).to.be.false;
            expect(spy1_input1inactive.called).to.be.true;
            expect(spy1_input2inactive.called).to.be.false;
            expect(spy1_inputend.called).to.be.true;
            expect(spy2_inputstart.called).to.be.false;
            expect(spy2_inputchange.called).to.be.false;
            expect(spy2_input1active.called).to.be.false;
            expect(spy2_input2active.called).to.be.false;
            expect(spy2_input1inactive.called).to.be.true;
            expect(spy2_input2inactive.called).to.be.false;
            expect(spy2_inputend.called).to.be.true;

            expect(binaryInputManager.valueStore['input2']).to.be.false;
            expect(binaryInputManager.valueStore['input1']).to.be.false;
        });
    });
});
