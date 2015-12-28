describe("ParallelAction", function() {
    var TimelineMock;

    before(function() {
        enchant();

        TimelineMock = function(node) {
            this.node = node;
            this.next = sinon.spy();
        };
    });

    describe("ADDED_TO_TIMELINE event", function() {
        it("dispatch same event to running actions", function() {
            var sp = new Sprite(32, 32),
                tl = new TimelineMock(sp),
                action1 = new Action(),
                action2 = new Action(),
                action3 = new Action(),
                parallelAction = new ParallelAction(),
                event = new Event(Event.ADDED_TO_TIMELINE),
                handlerSpy1 = sinon.spy(),
                handlerSpy2 = sinon.spy(),
                handlerSpy3 = sinon.spy();

            event.timeline = tl;
            action1.addEventListener(Event.ADDED_TO_TIMELINE, handlerSpy1);
            action2.addEventListener(Event.ADDED_TO_TIMELINE, handlerSpy2);
            action3.addEventListener(Event.ADDED_TO_TIMELINE, handlerSpy3);
            parallelAction.actions.push(action1, action2);
            parallelAction.endedActions.push(action3);
            parallelAction.dispatchEvent(event);
            expect(handlerSpy1.calledOnce).to.be.true;
            expect(handlerSpy2.calledOnce).to.be.true;
            expect(handlerSpy3.notCalled).to.be.true;
            expect(handlerSpy1.args[0][0].timeline).to.equal(tl);
            expect(handlerSpy2.args[0][0].timeline).to.equal(tl);
        });
    });

    describe("REMOVED_FROM_TIMELINE event", function() {
        it("reset #actions and #endedActions", function() {
            var sp = new Sprite(32, 32),
                tl = new TimelineMock(sp),
                action1 = new Action(),
                action2 = new Action(),
                parallelAction = new ParallelAction(),
                event = new Event(Event.REMOVED_FROM_TIMELINE);

            event.timeline = tl;
            parallelAction.endedActions.push(action1, action2);
            expect(parallelAction.actions).to.deep.equal([]);
            expect(parallelAction.endedActions).to.deep.equal([ action1, action2 ]);
            parallelAction.dispatchEvent(event);
            expect(parallelAction.actions).to.deep.equal([ action1, action2 ]);
            expect(parallelAction.endedActions).to.deep.equal([]);
        });
    });

    describe("ACTION_STARRT event", function() {
        it("dispatch same event to running actions", function() {
            var sp = new Sprite(32, 32),
                tl = new TimelineMock(sp),
                action1 = new Action(),
                action2 = new Action(),
                action3 = new Action(),
                parallelAction = new ParallelAction(),
                event = new Event(Event.ACTION_START),
                handlerSpy1 = sinon.spy(),
                handlerSpy2 = sinon.spy(),
                handlerSpy3 = sinon.spy();

            event.timeline = tl;
            action1.addEventListener(Event.ACTION_START, handlerSpy1);
            action2.addEventListener(Event.ACTION_START, handlerSpy2);
            action3.addEventListener(Event.ACTION_START, handlerSpy3);
            parallelAction.actions.push(action1, action2);
            parallelAction.endedActions.push(action3);
            parallelAction.dispatchEvent(event);
            expect(handlerSpy1.calledOnce).to.be.true;
            expect(handlerSpy2.calledOnce).to.be.true;
            expect(handlerSpy3.notCalled).to.be.true;
            expect(handlerSpy1.args[0][0].timeline).to.equal(tl);
            expect(handlerSpy2.args[0][0].timeline).to.equal(tl);
        });
    });

    describe("ACTION_TICK event", function() {
        it("dispatch event to running actions", function() {
            var sp = new Sprite(32, 32),
                tl = new TimelineMock(sp),
                action1 = new Action(),
                action2 = new Action(),
                action3 = new Action(),
                parallelAction = new ParallelAction(),
                event = new Event(Event.ACTION_TICK),
                handlerSpy1 = sinon.spy(),
                handlerSpy2 = sinon.spy(),
                handlerSpy3 = sinon.spy();

            event.timeline = tl;
            action1.addEventListener(Event.ACTION_TICK, handlerSpy1);
            action2.addEventListener(Event.ACTION_TICK, handlerSpy2);
            action3.addEventListener(Event.ACTION_TICK, handlerSpy3);
            parallelAction.actions.push(action1, action2);
            parallelAction.endedActions.push(action3);
            parallelAction.dispatchEvent(event);
            expect(handlerSpy1.calledOnce).to.be.true;
            expect(handlerSpy2.calledOnce).to.be.true;
            expect(handlerSpy3.notCalled).to.be.true;
        });

        it("inactivate ended actions when dispatching", function() {
            var sp = new Sprite(32, 32),
                tl = new TimelineMock(sp),
                action1 = new Action({ time: 1 }),
                action2 = new Action({ time: 2 }),
                parallelAction = new ParallelAction(),
                event = new Event(Event.ACTION_TICK),
                onActionEndSpy = sinon.spy(),
                onRemovedFromTimelineSpy = sinon.spy();

            event.timeline = tl;
            event.elapsed = 1;
            action1.addEventListener(Event.ACTION_END, onActionEndSpy);
            action1.addEventListener(Event.REMOVED_FROM_TIMELINE, onRemovedFromTimelineSpy);
            parallelAction.actions.push(action1, action2);
            expect(parallelAction.actions).to.deep.equal([ action1, action2 ]);
            expect(parallelAction.endedActions).to.deep.equal([]);
            expect(onActionEndSpy.notCalled).to.be.true;
            expect(onRemovedFromTimelineSpy.notCalled).to.be.true;
            parallelAction.dispatchEvent(event);
            expect(parallelAction.actions).to.deep.equal([ action2 ]);
            expect(parallelAction.endedActions).to.deep.equal([ action1 ]);
            expect(onActionEndSpy.calledOnce).to.be.true;
            expect(onRemovedFromTimelineSpy.calledOnce).to.be.true;
        });

        it("call Timeline#next when all actions ended", function() {
            var sp = new Sprite(32, 32),
                tl = new TimelineMock(sp),
                action1 = new Action({ time: 1 }),
                action2 = new Action({ time: 2 }),
                parallelAction = new ParallelAction(),
                event = new Event(Event.ACTION_TICK);

            event.timeline = tl;
            event.elapsed = 1;
            parallelAction.actions.push(action1, action2);
            parallelAction.dispatchEvent(event);
            expect(tl.next.notCalled).to.be.true;
            parallelAction.dispatchEvent(event);
            expect(tl.next.calledOnce).to.be.true;
        });
    });

});
