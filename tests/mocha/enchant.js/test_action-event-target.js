describe("ActionEventTarget", function() {
    before(function() {
        enchant();
    });

    describe("#dispatchEvent", function() {
        it("handle callback as same as EventTarget", function() {
            var actionEventTarget = new ActionEventTarget(),
                testEvent = new enchant.Event('test'),
                handlerSpy1 = sinon.spy(),
                handlerSpy2 = sinon.spy(),
                handlerSpy3 = sinon.spy();

            actionEventTarget.addEventListener('test', handlerSpy1);
            actionEventTarget.addEventListener('test', handlerSpy2);
            actionEventTarget.ontest = handlerSpy3;
            actionEventTarget.dispatchEvent(testEvent);
            expect(handlerSpy1.calledOnce).to.be.true;
            expect(handlerSpy2.calledOnce).to.be.true;
            expect(handlerSpy3.calledOnce).to.be.true;
            expect(handlerSpy1.calledWith(testEvent)).to.be.true;
            expect(handlerSpy2.calledWith(testEvent)).to.be.true;
            expect(handlerSpy3.calledWith(testEvent)).to.be.true;
            expect(handlerSpy1.calledOn(actionEventTarget)).to.be.true;
            expect(handlerSpy2.calledOn(actionEventTarget)).to.be.true;
            expect(handlerSpy3.calledOn(actionEventTarget)).to.be.true;
            expect(handlerSpy1.calledAfter(handlerSpy2)).to.be.true;
            expect(handlerSpy2.calledAfter(handlerSpy3)).to.be.true;
        });

        it("call event handlers on #node", function() {
            var sp = new Sprite(32, 32),
                actionEventTarget = new ActionEventTarget(),
                testEvent = new enchant.Event('test'),
                handlerSpy1 = sinon.spy(),
                handlerSpy2 = sinon.spy(),
                handlerSpy3 = sinon.spy();

            actionEventTarget.node = sp;
            actionEventTarget.addEventListener('test', handlerSpy1);
            actionEventTarget.addEventListener('test', handlerSpy2);
            actionEventTarget.ontest = handlerSpy3;
            actionEventTarget.dispatchEvent(testEvent);
            expect(handlerSpy1.calledOn(sp)).to.be.true;
            expect(handlerSpy2.calledOn(sp)).to.be.true;
            expect(handlerSpy3.calledOn(sp)).to.be.true;
        });
    });
});
