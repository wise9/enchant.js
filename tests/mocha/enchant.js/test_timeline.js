describe("Timeline", function() {

    function createEnterFrameEvent() {
        var evt = new enchant.Event(enchant.Event.ENTER_FRAME);
        evt.elapsed = 1000 / 30;

        return evt;
    }

    before(function() {
        enchant();
    });

    describe("#initialize", function() {
        it("set #node", function() {
            var sp = new Sprite(32, 32),
                tl = new Timeline(sp);

            expect(tl.node).to.equal(sp);
        });
    });

    describe("#isFrameBased", function() {
        it("default is frame based", function() {
            var sp = new Sprite(32, 32),
                tl = new Timeline(sp);

            expect(tl.isFrameBased).to.be.true;
        });
    });

    describe("#setTimeBased", function() {
        it("set #isFrameBased to false", function() {
            var sp = new Sprite(32, 32),
                tl = new Timeline(sp);

            tl.setTimeBased();
            expect(tl.isFrameBased).to.be.false;
        });
    });

    describe("#setFrameBased", function() {
        it("set #isFrameBased to true", function() {
            var sp = new Sprite(32, 32),
                tl = new Timeline(sp);

            tl.setTimeBased();
            expect(tl.isFrameBased).to.be.false;
            tl.setFrameBased();
            expect(tl.isFrameBased).to.be.true;
        });
    });

    describe("#loop", function() {
        it("set #looped to true", function() {
            var sp = new Sprite(32, 32),
                tl = new Timeline(sp);

            tl.loop();
            expect(tl.looped).to.be.true;
        });
    });

    describe("#unloop", function() {
        it("set #looped to false", function() {
            var sp = new Sprite(32, 32),
                tl = new Timeline(sp);

            tl.loop();
            expect(tl.looped).to.be.true;
            tl.unloop();
            expect(tl.looped).to.be.false;
        });
    });

    describe("#_activateTimeline", function() {
        it("set _activated to true", function() {
            var sp = new Sprite(32, 32),
                tl = new Timeline(sp);

            expect(tl._activated).to.be.false;
            tl._activateTimeline();
            expect(tl._activated).to.be.true;
        });

        it("add event handler to the node", function() {
            var sp = new Sprite(32, 32),
                tl = new Timeline(sp);

            tl._activateTimeline();
            expect(sp._listeners.enterframe).to.contain(tl._nodeEventListener);
        });

        it("enable event propagation between node and timeline", function() {
            var sp = new Sprite(32, 32),
                tl = new Timeline(sp),
                event = createEnterFrameEvent(),
                onEnterFrameSpy = sinon.spy();

            tl.addEventListener(Event.ENTER_FRAME, onEnterFrameSpy);
            tl._activateTimeline();
            sp.dispatchEvent(event);
            expect(onEnterFrameSpy.calledOnce).to.be.true;
        });

        it("do nothing if timeline is pausing", function() {
            var sp = new Sprite(32, 32),
                tl = new Timeline(sp);

            sp.addEventListener(enchant.Event.ENTER_FRAME, function() {});
            tl.paused = true;
            tl._activateTimeline();
            expect(tl._activated).to.be.false;
            expect(sp._listeners.enterframe).to.not.contain(tl._nodeEventListener);
        });
    });

    describe("#_deactivateTimeline", function() {
        it("set _activated to false", function() {
            var sp = new Sprite(32, 32),
                tl = new Timeline(sp);

            tl._activateTimeline();
            expect(tl._activated).to.be.true;
            tl._deactivateTimeline();
            expect(tl._activated).to.be.false;
        });

        it("remove event handler from the node", function() {
            var sp = new Sprite(32, 32),
                tl = new Timeline(sp);

            tl._activateTimeline();
            tl._deactivateTimeline();
            expect(sp._listeners.enterframe).to.not.contain(tl._nodeEventListener);
        });

        it("disable event propagation between node and timeline", function() {
            var sp = new Sprite(32, 32),
                tl = new Timeline(sp),
                event = createEnterFrameEvent(),
                onEnterFrameSpy = sinon.spy();

            tl.addEventListener(Event.ENTER_FRAME, onEnterFrameSpy);
            tl._activateTimeline();
            sp.dispatchEvent(event);
            expect(onEnterFrameSpy.calledOnce).to.be.true;
            tl._deactivateTimeline();
            sp.dispatchEvent(event);
            expect(onEnterFrameSpy.calledOnce).to.be.true;
        });
    });

    describe("#pause", function() {
        it("set #paused to true", function() {
            var sp = new Sprite(32, 32),
                tl = new Timeline(sp);

            expect(tl.paused).to.be.false;
            tl.pause();
            expect(tl.paused).to.be.true;
        });

        it("deactivate itself", function() {
            var sp = new Sprite(32, 32),
                tl = new Timeline(sp),
                deactivateSpy = sinon.spy(tl, "_deactivateTimeline");

            tl.pause();
            expect(deactivateSpy.calledOnce).to.be.true;
        });

        it("do nothing if already paused", function() {
            var sp = new Sprite(32, 32),
                tl = new Timeline(sp),
                deactivateSpy = sinon.spy(tl, "_deactivateTimeline");

            tl.pause();
            expect(deactivateSpy.calledOnce).to.be.true;
            tl.pause();
            expect(deactivateSpy.calledOnce).to.be.true;
        });
    });

    describe("#resume", function() {
        it("set #paused to false", function() {
            var sp = new Sprite(32, 32),
                tl = new Timeline(sp);

            tl.pause();
            expect(tl.paused).to.be.true;
            tl.resume();
            expect(tl.paused).to.be.false;
        });

        it("activate itself", function() {
            var sp = new Sprite(32, 32),
                tl = new Timeline(sp),
                activateSpy = sinon.spy(tl, "_activateTimeline");

            tl.pause();
            expect(activateSpy.notCalled).to.be.true;
            tl.resume();
            expect(activateSpy.calledOnce).to.be.true;
        });

        it("do nothing if not paused", function() {
            var sp = new Sprite(32, 32),
                tl = new Timeline(sp),
                activateSpy = sinon.spy(tl, "_activateTimeline");

            tl.resume();
            expect(activateSpy.notCalled).to.be.true;
        });
    });

    describe("#and", function() {
        it("create a new ParallelAction with queued action", function() {
            var sp = new Sprite(32, 32),
                tl = new Timeline(sp),
                action = new Action();

            tl.queue.push(action);
            tl.and();
            expect(tl.queue).to.have.length(1);
            expect(tl.queue[0]).to.be.instanceOf(ParallelAction);
            expect(tl.queue[0].actions).to.deep.equal([ action ]);
            expect(tl._parallel).to.equal(tl.queue[0]);
        });

        it("do nothing if last action is instance of ParallelAction", function() {
            var parallelAction, _parallel, queue, actions,
                sp = new Sprite(32, 32),
                tl = new Timeline(sp),
                action = new Action();

            tl.queue.push(action);
            tl.and();
            parallelAction = tl.queue[0];
            _parallel = tl._parallel;
            queue = tl.queue.slice();
            actions = parallelAction.actions.slice();
            tl.and();
            expect(tl._parallel).to.equal(_parallel);
            expect(tl.queue).to.deep.equal(queue);
            expect(parallelAction.actions).to.deep.equal(actions);
        });
    });

    describe("#add", function() {
        it("add passed action to queue", function() {
            var sp = new Sprite(32, 32),
                tl = new Timeline(sp),
                action = new Action();

            expect(tl.queue).to.be.empty;
            tl.add(action);
            expect(tl.queue).to.have.length(1);
        });

        it("dispatch ADDED_TO_TIMELINE event to the action", function() {
            var sp = new Sprite(32, 32),
                tl = new Timeline(sp),
                action = new Action(),
                onAddedToTimelineSpy = sinon.spy();

            action.addEventListener(enchant.Event.ADDED_TO_TIMELINE, onAddedToTimelineSpy);
            tl.add(action);
            expect(onAddedToTimelineSpy.calledOnce).to.be.true;
        });

        it("dispatch ACTION_ADDED event to itself", function() {
            var sp = new Sprite(32, 32),
                tl = new Timeline(sp),
                action = new Action(),
                onActionAddedSpy = sinon.spy();

            tl.addEventListener(enchant.Event.ACTION_ADDED, onActionAddedSpy);
            tl.add(action);
            expect(onActionAddedSpy.calledOnce).to.be.true;
        });

        it("activate itself if queue was empty", function() {
            var sp = new Sprite(32, 32),
                tl = new Timeline(sp),
                action = new Action();

            expect(tl.queue).to.be.empty;
            expect(tl._activated).to.be.false;
            tl.add(action);
            expect(tl._activated).to.be.true;
        });

        it("reset action's frame", function() {
            var sp = new Sprite(32, 32),
                tl = new Timeline(sp),
                action = new Action();

            action.frame = 42;
            tl.add(action);
            expect(action.frame).to.equal(0);
        });

        it("add passed action to #_parallel instead of queue after calling #and", function() {
            var sp = new Sprite(32, 32),
                tl = new Timeline(sp),
                action1 = new Action(),
                action2 = new Action();

            tl.add(action1);
            tl.and();
            tl.add(action2);
            expect(tl.queue).to.have.length(1);
            expect(tl.queue[0]).to.be.instanceOf(ParallelAction);
            expect(tl.queue[0].actions).to.deep.equal([ action1, action2 ]);
            expect(tl._parallel).to.be.null;
        });
    });

    describe("#action", function() {
        it("create new Action with passed property, then add to queue", function() {
            var sp = new Sprite(32, 32),
                tl = new Timeline(sp),
                params = {},
                constructorSpy = sinon.spy(enchant, "Action");

            expect(tl.queue).to.be.empty;
            tl.tween(params);
            expect(tl.queue).to.have.length(1);
            expect(constructorSpy.calledWithNew()).to.be.true;
            expect(constructorSpy.calledWith(params)).to.be.true;
            constructorSpy.restore();
        });
    });

    describe("#tween", function() {
        it("create new Tween with passed property, then add to queue", function() {
            var sp = new Sprite(32, 32),
                tl = new Timeline(sp),
                params = {},
                constructorSpy = sinon.spy(enchant, "Tween");

            expect(tl.queue).to.be.empty;
            tl.tween(params);
            expect(tl.queue).to.have.length(1);
            expect(constructorSpy.calledWithNew()).to.be.true;
            expect(constructorSpy.calledWith(params)).to.be.true;
            constructorSpy.restore();
        });
    });

    describe("#clear", function() {
        it("clear queue", function() {
            var sp = new Sprite(32, 32),
                tl = new Timeline(sp),
                action1 = new Action(),
                action2 = new Action();

            tl.add(action1);
            tl.add(action2);
            expect(tl.queue).to.have.length(2);
            tl.clear();
            expect(tl.queue).to.be.empty;
        });

        it("dispatch REMOVED_FROM_TIMELINE event to queued action", function() {
            var sp = new Sprite(32, 32),
                tl = new Timeline(sp),
                action1 = new Action(),
                action2 = new Action(),
                handlerSpy1 = sinon.spy();
                handlerSpy2 = sinon.spy();

            action1.addEventListener(Event.REMOVED_FROM_TIMELINE, handlerSpy1);
            action2.addEventListener(Event.REMOVED_FROM_TIMELINE, handlerSpy2);
            tl.add(action1);
            tl.add(action2);
            tl.clear();
            expect(handlerSpy1.calledOnce).to.be.true;
            expect(handlerSpy2.calledOnce).to.be.true;
        });

        it("deactivate itself", function() {
            var sp = new Sprite(32, 32),
                tl = new Timeline(sp),
                action = new Action(),
                deactivateSpy = sinon.spy(tl, "_deactivateTimeline");

            tl.add(action);
            tl.clear();
            expect(deactivateSpy.calledOnce).to.be.true;
        });
    });

    describe("#exec", function() {
        it("call #then", function() {
            var sp = new Sprite(32, 32),
                tl = new Timeline(sp),
                callback = function() {},
                thenSpy = sinon.spy(tl, "then");

            tl.exec(callback);
            expect(thenSpy.calledOnce).to.be.true;
            expect(thenSpy.calledWith(callback)).to.be.true;
        });

        it("return itself", function() {
            var sp = new Sprite(32, 32),
                tl = new Timeline(sp);

            expect(tl.exec(function() {})).to.equal(tl);
        });
    });

    describe("#tick", function() {
        it("dispatch events to current action", function() {
            var sp = new Sprite(32, 32),
                tl = new Timeline(sp),
                action = new Action(),
                onActionStartSpy = sinon.spy(),
                onActionTickSpy = sinon.spy(),
                time1 = 1,
                time2 = 2;

            action.addEventListener(Event.ACTION_START, onActionStartSpy);
            action.addEventListener(Event.ACTION_TICK, onActionTickSpy);

            tl.add(action);
            tl.tick(time1);
            expect(onActionStartSpy.calledOnce).to.be.true;
            expect(onActionTickSpy.calledOnce).to.be.true;
            expect(onActionTickSpy.args[0][0].elapsed).to.equal(time1);
            tl.tick(time2);
            expect(onActionStartSpy.calledOnce).to.be.true;
            expect(onActionTickSpy.calledTwice).to.be.true;
            expect(onActionTickSpy.args[1][0].elapsed).to.equal(time2);
        });

        it("do nothing if queue is empty", function() {
            var sp = new Sprite(32, 32),
                tl = new Timeline(sp);

            expect(function() {
                tl.tick(1);
            }).to.not.throws();
        });

    });

    describe("#next", function() {
        it("dispatch REMOVED_FROM_TIMELINE event to current action", function() {
            var sp = new Sprite(32, 32),
                tl = new Timeline(sp),
                action = new Action(),
                onRemovedFromTimelineSpy = sinon.spy();

            action.addEventListener(Event.REMOVED_FROM_TIMELINE, onRemovedFromTimelineSpy);
            tl.add(action);
            tl.next();
            expect(onRemovedFromTimelineSpy.calledOnce).to.be.true;
        });

        it("dispatch ACTION_END event to current action", function() {
            var sp = new Sprite(32, 32),
                tl = new Timeline(sp),
                action = new Action(),
                onActionEndSpy = sinon.spy();

            action.addEventListener(Event.ACTION_END, onActionEndSpy);
            tl.add(action);
            tl.next();
            expect(onActionEndSpy.calledOnce).to.be.true;
        });

        it("re-append current action to queue if timeline is looping", function() {
            var sp = new Sprite(32, 32),
                tl = new Timeline(sp),
                action1 = new Action(),
                action2 = new Action();

            tl.looped = true;
            tl.add(action1);
            tl.add(action2);
            tl.next();
            expect(tl.queue).to.deep.equal([ action2, action1 ]);
        });

        it("deactivate itself if queue become empty", function() {
            var sp = new Sprite(32, 32),
                tl = new Timeline(sp),
                action = new Action();

            tl.add(action);
            expect(tl._activated).to.be.true;
            tl.next();
            expect(tl._activated).to.be.false;
        });

        it("continue animation if remainingTime is passed (frame based)", function() {
            var sp = new Sprite(32, 32),
                tl = new Timeline(sp),
                action1 = new Action(),
                action2 = new Action(),
                onActionTickSpy = sinon.spy(),
                remainingTime = 1;

            action2.addEventListener(Event.ACTION_TICK, onActionTickSpy);
            tl.add(action1);
            tl.add(action2);
            tl.next(remainingTime);
            expect(onActionTickSpy.calledOnce).to.be.true;
            expect(onActionTickSpy.args[0][0].elapsed).to.equal(remainingTime);
        });

        it("continue animation if remainingTime is passed (time based)", function() {
            var sp = new Sprite(32, 32),
                tl = new Timeline(sp),
                action1 = new Action(),
                action2 = new Action(),
                onActionTickSpy = sinon.spy(),
                remainingTime = 1000 / 30;

            action2.addEventListener(Event.ACTION_TICK, onActionTickSpy);
            tl.setTimeBased();
            tl.add(action1);
            tl.add(action2);
            tl.next(remainingTime);
            expect(onActionTickSpy.calledOnce).to.be.true;
            expect(onActionTickSpy.args[0][0].elapsed).to.equal(remainingTime);
        });

        it("continue animation if next action's time is 0", function() {
            var sp = new Sprite(32, 32),
                tl = new Timeline(sp),
                action1 = new Action(),
                action2 = new Action({ time: 0 }),
                onActionTickSpy = sinon.spy();

            action2.addEventListener(Event.ACTION_TICK, onActionTickSpy);
            tl.add(action1);
            tl.add(action2);
            tl.next();
            expect(onActionTickSpy.calledOnce).to.be.true;
        });
    });

    describe("#skip", function() {
        it("dispatch ENTER_FRAME events for skipping (frame based)", function() {
            var sp = new Sprite(32, 32),
                tl = new Timeline(sp),
                onEnterFrameSpy = sinon.spy(),
                elapsed = 4;

            tl.addEventListener(Event.ENTER_FRAME, onEnterFrameSpy);
            tl.skip(elapsed);
            expect(onEnterFrameSpy.callCount).to.equal(elapsed);
        });

        it("dispatch ENTER_FRAME event once for skipping (time based)", function() {
            var sp = new Sprite(32, 32),
                tl = new Timeline(sp),
                onEnterFrameSpy = sinon.spy(),
                elapsed = 1000 / 30;

            tl.addEventListener(Event.ENTER_FRAME, onEnterFrameSpy);
            tl.setTimeBased();
            tl.skip(elapsed);
            expect(onEnterFrameSpy.calledOnce).to.be.true;
            expect(onEnterFrameSpy.args[0][0].elapsed).to.equal(elapsed);
        });
    });

    describe("#then", function() {
        it("add a new Action", function() {
            var sp = new Sprite(32, 32),
                tl = new Timeline(sp),
                constructorSpy = sinon.spy(enchant, "Action");

            tl.then(function() {});
            expect(tl.queue).to.have.length(1);
            expect(constructorSpy.calledWithNew()).to.be.true;
            expect(constructorSpy.calledWith({ onactiontick: sinon.match.func, time: 0 })).to.be.true;
            constructorSpy.restore();
        });

        it("return itself", function() {
            var sp = new Sprite(32, 32),
                tl = new Timeline(sp);

            expect(tl.then(function() {})).to.equal(tl);
        });

        it("execute callback (frame based)", function() {
            var sp = new Sprite(32, 32),
                tl = new Timeline(sp),
                event = createEnterFrameEvent(),
                callbackSpy = sinon.spy();

            tl.then(callbackSpy);
            tl.dispatchEvent(event);

            expect(callbackSpy.calledOnce).to.be.true;
            expect(callbackSpy.calledOn(sp)).to.be.true;
        });

        it("execute callback (time based)", function() {
            var sp = new Sprite(32, 32),
                tl = new Timeline(sp),
                event = createEnterFrameEvent(),
                callbackSpy = sinon.spy();

            tl.setTimeBased();
            tl.then(callbackSpy);
            tl.dispatchEvent(event);

            expect(callbackSpy.calledOnce).to.be.true;
            expect(callbackSpy.calledOn(sp)).to.be.true;
        });

        it("execute all callbacks if chained", function() {
            var sp = new Sprite(32, 32),
                tl = new Timeline(sp),
                event = createEnterFrameEvent(),
                callbackSpy1 = sinon.spy(),
                callbackSpy2 = sinon.spy();

            tl.then(callbackSpy1);
            tl.then(callbackSpy2);
            tl.dispatchEvent(event);

            expect(callbackSpy1.calledOnce).to.be.true;
            expect(callbackSpy2.calledOnce).to.be.true;
        });
    });

    describe("#delay", function() {
        it("add a new Action", function() {
            var sp = new Sprite(32, 32),
                tl = new Timeline(sp),
                constructorSpy = sinon.spy(enchant, "Action"),
                time = 42;

            tl.delay(time);
            expect(tl.queue).to.have.length(1);
            expect(constructorSpy.calledWithNew()).to.be.true;
            expect(constructorSpy.calledWith({ time: time })).to.be.true;
            constructorSpy.restore();
        });

        it("return itself", function() {
            var sp = new Sprite(32, 32),
                tl = new Timeline(sp);

            expect(tl.delay(1)).to.equal(tl);
        });

        it("wait passed frames (frame based)", function() {
            var sp = new Sprite(32, 32),
                tl = new Timeline(sp),
                event = createEnterFrameEvent();

            tl.delay(2);
            tl.dispatchEvent(event);
            expect(tl.queue).to.have.length(1);
            tl.dispatchEvent(event);
            expect(tl.queue).to.have.length(0);
        });

        it("wait passed time (time based)", function() {
            var sp = new Sprite(32, 32),
                tl = new Timeline(sp),
                event = createEnterFrameEvent();

            tl.setTimeBased();
            tl.delay(1000 / 30 * 2);
            tl.dispatchEvent(event);
            expect(tl.queue).to.have.length(1);
            tl.dispatchEvent(event);
            expect(tl.queue).to.have.length(0);

        });
    });

    describe("#cue", function() {
        it("return itself", function() {
            var sp = new Sprite(32, 32),
                tl = new Timeline(sp);

            expect(tl.cue({})).to.equal(tl);
        });

        it("execute functions on specified frame (frame based)", function() {
            var sp = new Sprite(32, 32),
                tl = new Timeline(sp),
                event = createEnterFrameEvent(),
                cueSpy1 = sinon.spy(),
                cueSpy2 = sinon.spy(),
                cueSpy3 = sinon.spy();

            tl.cue({
                2: cueSpy1,
                4: cueSpy2,
                6: cueSpy3
            });
            tl.dispatchEvent(event);
            tl.dispatchEvent(event);
            expect(cueSpy1.calledOnce).to.be.true;
            expect(cueSpy2.notCalled).to.be.true;
            expect(cueSpy3.notCalled).to.be.true;
            tl.dispatchEvent(event);
            tl.dispatchEvent(event);
            expect(cueSpy1.calledOnce).to.be.true;
            expect(cueSpy2.calledOnce).to.be.true;
            expect(cueSpy3.notCalled).to.be.true;
            tl.dispatchEvent(event);
            tl.dispatchEvent(event);
            expect(cueSpy1.calledOnce).to.be.true;
            expect(cueSpy2.calledOnce).to.be.true;
            expect(cueSpy3.calledOnce).to.be.true;
        });

        it("execute functions on specified timing (time based)", function() {
            var sp = new Sprite(32, 32),
                tl = new Timeline(sp),
                event = createEnterFrameEvent(),
                cueSpy1 = sinon.spy(),
                cueSpy2 = sinon.spy(),
                cueSpy3 = sinon.spy();

            tl.setTimeBased();
            tl.cue({
                30: cueSpy1,
                90: cueSpy2,
                150: cueSpy3
            });
            tl.dispatchEvent(event);
            expect(cueSpy1.calledOnce).to.be.true;
            expect(cueSpy2.notCalled).to.be.true;
            expect(cueSpy3.notCalled).to.be.true;
            tl.dispatchEvent(event);
            expect(cueSpy1.calledOnce).to.be.true;
            expect(cueSpy2.notCalled).to.be.true;
            expect(cueSpy3.notCalled).to.be.true;
            tl.dispatchEvent(event);
            expect(cueSpy1.calledOnce).to.be.true;
            expect(cueSpy2.calledOnce).to.be.true;
            expect(cueSpy3.notCalled).to.be.true;
            tl.dispatchEvent(event);
            expect(cueSpy1.calledOnce).to.be.true;
            expect(cueSpy2.calledOnce).to.be.true;
            expect(cueSpy3.notCalled).to.be.true;
            tl.dispatchEvent(event);
            expect(cueSpy1.calledOnce).to.be.true;
            expect(cueSpy2.calledOnce).to.be.true;
            expect(cueSpy3.calledOnce).to.be.true;
        });
    });

    describe("#repeat", function() {
        it("add a new Action", function() {
            var sp = new Sprite(32, 32),
                tl = new Timeline(sp),
                constructorSpy = sinon.spy(enchant, "Action"),
                time = 42;

            tl.repeat(function() {}, time);
            expect(tl.queue).to.have.length(1);
            expect(constructorSpy.calledWithNew()).to.be.true;
            expect(constructorSpy.calledWith({ onactiontick: sinon.match.func, time: time })).to.be.true;
            constructorSpy.restore();
        });

        it("return itself", function() {
            var sp = new Sprite(32, 32),
                tl = new Timeline(sp);

            expect(tl.repeat(function() {}, 1)).to.equal(tl);
        });

        it("execute passed function on each frames while passed frames (frame based)", function() {
            var sp = new Sprite(32, 32),
                tl = new Timeline(sp),
                event = createEnterFrameEvent(),
                repeatSpy = sinon.spy();

            tl.repeat(repeatSpy, 3);
            tl.dispatchEvent(event);
            expect(repeatSpy.calledOnce).to.be.true;
            tl.dispatchEvent(event);
            expect(repeatSpy.calledTwice).to.be.true;
            tl.dispatchEvent(event);
            expect(repeatSpy.calledThrice).to.be.true;
            tl.dispatchEvent(event);
            expect(repeatSpy.calledThrice).to.be.true;
        });

        it("execute passed function on each frames until time exceeded (time based)", function() {
            var sp = new Sprite(32, 32),
                tl = new Timeline(sp),
                event = createEnterFrameEvent(),
                repeatSpy = sinon.spy();

            tl.setTimeBased();
            tl.repeat(repeatSpy, 100);
            tl.dispatchEvent(event);
            expect(repeatSpy.calledOnce).to.be.true;
            tl.dispatchEvent(event);
            expect(repeatSpy.calledTwice).to.be.true;
            tl.dispatchEvent(event);
            expect(repeatSpy.calledThrice).to.be.true;
            tl.dispatchEvent(event);
            expect(repeatSpy.calledThrice).to.be.true;
        });
    });

    describe("#waitUntil", function() {
        it("add a new Action", function() {
            var sp = new Sprite(32, 32),
                tl = new Timeline(sp),
                constcurtorSpy = sinon.spy(enchant, "Action");

            tl.waitUntil(function() {});
            expect(tl.queue).to.have.length(1);
            expect(constcurtorSpy.calledWithNew()).to.be.true;
            expect(constcurtorSpy.calledWith({ onactiontick: sinon.match.func })).to.be.true;
        });

        it("return itself", function() {
            var sp = new Sprite(32, 32),
                tl = new Timeline(sp);

            expect(tl.waitUntil(function() {})).to.equal(tl);
        });

        it("execute passed function on each frames until getting truthy result (frame based)", function() {
            var sp = new Sprite(32, 32),
                tl = new Timeline(sp),
                event = createEnterFrameEvent(),
                result = false,
                waitUntilSpy = sinon.spy(function() { return result; });

            tl.waitUntil(waitUntilSpy);
            tl.dispatchEvent(event);
            expect(waitUntilSpy.calledOnce).to.be.true;
            result = true;
            tl.dispatchEvent(event);
            expect(waitUntilSpy.calledTwice).to.be.true;
            tl.dispatchEvent(event);
            expect(waitUntilSpy.calledTwice).to.be.true;
        });

        it("execute passed function on each frames until getting truthy result (time based)", function() {
            var sp = new Sprite(32, 32),
                tl = new Timeline(sp),
                event = createEnterFrameEvent(),
                result = false,
                waitUntilSpy = sinon.spy(function() { return result; });

            tl.setTimeBased();
            tl.waitUntil(waitUntilSpy);
            tl.dispatchEvent(event);
            expect(waitUntilSpy.calledOnce).to.be.true;
            result = true;
            tl.dispatchEvent(event);
            expect(waitUntilSpy.calledTwice).to.be.true;
            tl.dispatchEvent(event);
            expect(waitUntilSpy.calledTwice).to.be.true;
        });
    });

    describe("#hide", function() {
        it("use #then", function() {
            var sp = new Sprite(32, 32),
                tl = new Timeline(sp),
                thenSpy = sinon.spy(tl, "then");

            tl.hide();
            expect(thenSpy.calledOnce).to.be.true;
        });

        it("return itself", function() {
            var sp = new Sprite(32, 32),
                tl = new Timeline(sp);

            expect(tl.hide()).to.equal(tl);
        });

        it("set node's opacity to 0", function() {
            var sp = new Sprite(32, 32),
                tl = new Timeline(sp),
                event = createEnterFrameEvent();

            tl.hide();
            expect(sp.opacity).to.equal(1);
            tl.dispatchEvent(event);
            expect(sp.opacity).to.equal(0);
        });
    });

    describe("#show", function() {
        it("use #then", function() {
            var sp = new Sprite(32, 32),
                tl = new Timeline(sp),
                thenSpy = sinon.spy(tl, "then");

            tl.show();
            expect(thenSpy.calledOnce).to.be.true;
        });

        it("return itself", function() {
            var sp = new Sprite(32, 32),
                tl = new Timeline(sp);

            expect(tl.show()).to.equal(tl);
        });

        it("set node's opacity to 0", function() {
            var sp = new Sprite(32, 32),
                tl = new Timeline(sp),
                event = createEnterFrameEvent();

            sp.opacity = 0;
            tl.show();
            expect(sp.opacity).to.equal(0);
            tl.dispatchEvent(event);
            expect(sp.opacity).to.equal(1);
        });
    });

    describe("#removeFromScene", function() {
        it("use #then", function() {
            var sp = new Sprite(32, 32),
                tl = new Timeline(sp),
                thenSpy = sinon.spy(tl, "then");

            tl.removeFromScene();
            expect(thenSpy.calledOnce).to.be.true;
        });

        it("return itself", function() {
            var sp = new Sprite(32, 32),
                tl = new Timeline(sp);

            expect(tl.removeFromScene()).to.equal(tl);
        });

        it("remove node from parent", function() {
            var sp = new Sprite(32, 32),
                tl = new Timeline(sp),
                group = new Group(),
                event = createEnterFrameEvent();

            group.addChild(sp);
            tl.removeFromScene();
            expect(sp.parentNode).to.equal(group);
            tl.dispatchEvent(event);
            expect(sp.parentNode).to.be.null;
        });
    });

    describe("#fadeTo", function() {
        it("add a new Tween", function() {
            var sp = new Sprite(32, 32),
                tl = new Timeline(sp),
                constructorSpy = sinon.spy(enchant, "Tween"),
                opacity = 0.5,
                time = 42,
                easing = enchant.Easing.LINEAR;

            tl.fadeTo(opacity, time, easing);
            expect(tl.queue).to.have.length(1);
            expect(constructorSpy.calledWithNew()).to.be.true;
            expect(constructorSpy.calledWith({ opacity: opacity, time: time, easing: easing })).to.be.true;
            constructorSpy.restore();
        });

        it("return itself", function() {
            var sp = new Sprite(32, 32),
                tl = new Timeline(sp);

            expect(tl.fadeTo(0, 42)).to.equal(tl);
        });

        it("modify node's opacity (frame based)", function() {
            var sp = new Sprite(32, 32),
                tl = new Timeline(sp),
                event = createEnterFrameEvent();

            tl.fadeTo(0, 3, enchant.Easing.LINEAR);
            expect(sp.opacity).to.equal(1);
            tl.dispatchEvent(event);
            expect(sp.opacity).to.closeTo(0.666, 0.001);
            tl.dispatchEvent(event);
            expect(sp.opacity).to.closeTo(0.333, 0.001);
            tl.dispatchEvent(event);
            expect(sp.opacity).to.equal(0);

        });

        it("modify node's opacity (time based)", function() {
            var sp = new Sprite(32, 32),
                tl = new Timeline(sp),
                event = createEnterFrameEvent();

            tl.setTimeBased();
            tl.fadeTo(0, 100, enchant.Easing.LINEAR);
            expect(sp.opacity).to.equal(1);
            tl.dispatchEvent(event);
            expect(sp.opacity).to.closeTo(0.666, 0.001);
            tl.dispatchEvent(event);
            expect(sp.opacity).to.closeTo(0.333, 0.001);
            tl.dispatchEvent(event);
            expect(sp.opacity).to.equal(0);

        });
    });

    describe("#fadeIn", function() {
        it("use #fadeTo", function() {
            var sp = new Sprite(32, 32),
                tl = new Timeline(sp),
                fadeToSpy = sinon.spy(tl, "fadeTo"),
                time = 42,
                easing = enchant.Easing.LINEAR;

            tl.fadeIn(time, easing);
            expect(fadeToSpy.calledOnce).to.be.true;
            expect(fadeToSpy.calledWith(1, time, easing)).to.be.true;
        });

        it("return itself", function() {
            var sp = new Sprite(32, 32),
                tl = new Timeline(sp);

            expect(tl.fadeIn(42)).to.equal(tl);
        });
    });

    describe("#fadeOut", function() {
        it("use #fadeTo", function() {
            var sp = new Sprite(32, 32),
                tl = new Timeline(sp),
                fadeToSpy = sinon.spy(tl, "fadeTo"),
                time = 42,
                easing = enchant.Easing.LINEAR;

            tl.fadeOut(time, easing);
            expect(fadeToSpy.calledOnce).to.be.true;
            expect(fadeToSpy.calledWith(0, time, easing)).to.be.true;
        });

        it("return itself", function() {
            var sp = new Sprite(32, 32),
                tl = new Timeline(sp);

            expect(tl.fadeOut(42)).to.equal(tl);
        });
    });

    describe("#moveTo", function() {
        it("add a new Tween", function() {
            var sp = new Sprite(32, 32),
                tl = new Timeline(sp),
                constructorSpy = sinon.spy(enchant, "Tween"),
                x = 2,
                y = 4,
                time = 8,
                easing = enchant.Easing.LINEAR;

            tl.moveTo(x, y, time, easing);
            expect(tl.queue).to.have.length(1);
            expect(constructorSpy.calledWithNew()).to.be.true;
            expect(constructorSpy.calledWith({ x: x, y: y, time: time, easing: easing })).to.be.true;
            constructorSpy.restore();
        });

        it("return itself", function() {
            var sp = new Sprite(32, 32),
                tl = new Timeline(sp);

            expect(tl.moveTo(2, 4, 8)).to.equal(tl);
        });

        it("modify node's position (frame based)", function() {
            var sp = new Sprite(32, 32),
                tl = new Timeline(sp),
                event = createEnterFrameEvent();

            tl.moveTo(30, 30, 3, enchant.Easing.LINEAR);
            expect(sp.x).to.equal(0);
            expect(sp.y).to.equal(0);
            tl.dispatchEvent(event);
            expect(sp.x).to.equal(10);
            expect(sp.y).to.equal(10);
            tl.dispatchEvent(event);
            expect(sp.x).to.equal(20);
            expect(sp.y).to.equal(20);
            tl.dispatchEvent(event);
            expect(sp.x).to.equal(30);
            expect(sp.y).to.equal(30);
        });

        it("modify node's position (time based)", function() {
            var sp = new Sprite(32, 32),
                tl = new Timeline(sp),
                event = createEnterFrameEvent();

            tl.setTimeBased();
            tl.moveTo(30, 30, 100, enchant.Easing.LINEAR);
            expect(sp.x).to.equal(0);
            expect(sp.y).to.equal(0);
            tl.dispatchEvent(event);
            expect(sp.x).to.closeTo(10, 1);
            expect(sp.y).to.closeTo(10, 1);
            tl.dispatchEvent(event);
            expect(sp.x).to.closeTo(20, 1);
            expect(sp.y).to.closeTo(20, 1);
            tl.dispatchEvent(event);
            expect(sp.x).to.equal(30);
            expect(sp.y).to.equal(30);
        });
    });

    describe("#moveX", function() {
        it("add a new Tween", function() {
            var sp = new Sprite(32, 32),
                tl = new Timeline(sp),
                constructorSpy = sinon.spy(enchant, "Tween"),
                x = 32,
                time = 42,
                easing = enchant.Easing.LINEAR;

            tl.moveX(x, time, easing);
            expect(tl.queue).to.have.length(1);
            expect(constructorSpy.calledWithNew()).to.be.true;
            expect(constructorSpy.calledWith({ x: x, time: time, easing: easing })).to.be.true;
            constructorSpy.restore();
        });

        it("return itself", function() {
            var sp = new Sprite(32, 32),
                tl = new Timeline(sp);

            expect(tl.moveX(32, 42)).to.equal(tl);
        });

        it("modify node's position (frame based)", function() {
            var sp = new Sprite(32, 32),
                tl = new Timeline(sp),
                event = createEnterFrameEvent();

            tl.moveX(30, 3, enchant.Easing.LINEAR);
            expect(sp.x).to.equal(0);
            tl.dispatchEvent(event);
            expect(sp.x).to.equal(10);
            tl.dispatchEvent(event);
            expect(sp.x).to.equal(20);
            tl.dispatchEvent(event);
            expect(sp.x).to.equal(30);
        });

        it("modify node's position (time based)", function() {
            var sp = new Sprite(32, 32),
                tl = new Timeline(sp),
                event = createEnterFrameEvent();

            tl.setTimeBased();
            tl.moveX(30, 100, enchant.Easing.LINEAR);
            expect(sp.x).to.equal(0);
            tl.dispatchEvent(event);
            expect(sp.x).to.closeTo(10, 1);
            tl.dispatchEvent(event);
            expect(sp.x).to.closeTo(20, 1);
            tl.dispatchEvent(event);
            expect(sp.x).to.equal(30);
        });
    });

    describe("#moveY", function() {
        it("add a new Tween", function() {
            var sp = new Sprite(32, 32),
                tl = new Timeline(sp),
                constructorSpy = sinon.spy(enchant, "Tween"),
                y = 32,
                time = 42,
                easing = enchant.Easing.LINEAR;

            tl.moveY(y, time, easing);
            expect(tl.queue).to.have.length(1);
            expect(constructorSpy.calledWithNew()).to.be.true;
            expect(constructorSpy.calledWith({ y: y, time: time, easing: easing })).to.be.true;
            constructorSpy.restore();
        });

        it("return itself", function() {
            var sp = new Sprite(32, 32),
                tl = new Timeline(sp);

            expect(tl.moveY(32, 42)).to.equal(tl);
        });

        it("modify node's position (frame based)", function() {
            var sp = new Sprite(32, 32),
                tl = new Timeline(sp),
                event = createEnterFrameEvent();

            tl.moveY(30, 3, enchant.Easing.LINEAR);
            expect(sp.y).to.equal(0);
            tl.dispatchEvent(event);
            expect(sp.y).to.equal(10);
            tl.dispatchEvent(event);
            expect(sp.y).to.equal(20);
            tl.dispatchEvent(event);
            expect(sp.y).to.equal(30);
        });

        it("modify node's position (time based)", function() {
            var sp = new Sprite(32, 32),
                tl = new Timeline(sp),
                event = createEnterFrameEvent();

            tl.setTimeBased();
            tl.moveY(30, 100, enchant.Easing.LINEAR);
            expect(sp.y).to.equal(0);
            tl.dispatchEvent(event);
            expect(sp.y).to.closeTo(10, 1);
            tl.dispatchEvent(event);
            expect(sp.y).to.closeTo(20, 1);
            tl.dispatchEvent(event);
            expect(sp.y).to.equal(30);
        });
    });

    describe("#moveBy", function() {
        it("add a new Tween", function() {
            var sp = new Sprite(32, 32),
                tl = new Timeline(sp),
                constructorSpy = sinon.spy(enchant, "Tween"),
                time = 8,
                easing = enchant.Easing.LINEAR;

            tl.moveBy(32, 32, time, easing);
            expect(tl.queue).to.have.length(1);
            expect(constructorSpy.calledWithNew()).to.be.true;
            expect(constructorSpy.calledWith({ x: sinon.match.func, y: sinon.match.func, time: time, easing: easing })).to.be.true;
            constructorSpy.restore();
        });

        it("return itself", function() {
            var sp = new Sprite(32, 32),
                tl = new Timeline(sp);

            expect(tl.moveBy(32, 32, 30)).to.equal(tl);
        });

        it("modify node's position (frame based)", function() {
            var sp = new Sprite(32, 32),
                tl = new Timeline(sp),
                event = createEnterFrameEvent();

            sp.x = sp.y = 30;
            tl.moveBy(30, 30, 3, enchant.Easing.LINEAR);
            expect(sp.x).to.equal(30);
            expect(sp.y).to.equal(30);
            tl.dispatchEvent(event);
            expect(sp.x).to.equal(40);
            expect(sp.y).to.equal(40);
            tl.dispatchEvent(event);
            expect(sp.x).to.equal(50);
            expect(sp.y).to.equal(50);
            tl.dispatchEvent(event);
            expect(sp.x).to.equal(60);
            expect(sp.y).to.equal(60);
        });

        it("modify node's position (time based)", function() {
            var sp = new Sprite(32, 32),
                tl = new Timeline(sp),
                event = createEnterFrameEvent();

            sp.x = sp.y = 30;
            tl.setTimeBased();
            tl.moveBy(30, 30, 100, enchant.Easing.LINEAR);
            expect(sp.x).to.equal(30);
            expect(sp.y).to.equal(30);
            tl.dispatchEvent(event);
            expect(sp.x).to.closeTo(40, 1);
            expect(sp.y).to.closeTo(40, 1);
            tl.dispatchEvent(event);
            expect(sp.x).to.closeTo(50, 1);
            expect(sp.y).to.closeTo(50, 1);
            tl.dispatchEvent(event);
            expect(sp.x).to.equal(60);
            expect(sp.y).to.equal(60);
        });

        it("should not conflict with external modification (frame based)", function() {
            var sp = new Sprite(32, 32),
                tl = new Timeline(sp),
                event = createEnterFrameEvent();

            sp.x = sp.y = 30;
            tl.moveBy(30, 30, 3, enchant.Easing.LINEAR);
            expect(sp.x).to.equal(30);
            expect(sp.y).to.equal(30);
            sp.moveBy(5, 5);
            tl.dispatchEvent(event);
            expect(sp.x).to.equal(45);
            expect(sp.y).to.equal(45);
            sp.moveBy(5, 5);
            tl.dispatchEvent(event);
            expect(sp.x).to.equal(60);
            expect(sp.y).to.equal(60);
            sp.moveBy(5, 5);
            tl.dispatchEvent(event);
            expect(sp.x).to.equal(75);
            expect(sp.y).to.equal(75);
        });

        it("should not conflict with external modification (time based)", function() {
            var sp = new Sprite(32, 32),
                tl = new Timeline(sp),
                event = createEnterFrameEvent();

            sp.x = sp.y = 30;
            tl.setTimeBased();
            tl.moveBy(30, 30, 100, enchant.Easing.LINEAR);
            expect(sp.x).to.equal(30);
            expect(sp.y).to.equal(30);
            sp.moveBy(5, 5);
            tl.dispatchEvent(event);
            expect(sp.x).to.closeTo(45, 1);
            expect(sp.y).to.closeTo(45, 1);
            sp.moveBy(5, 5);
            tl.dispatchEvent(event);
            expect(sp.x).to.closeTo(60, 1);
            expect(sp.y).to.closeTo(60, 1);
            sp.moveBy(5, 5);
            tl.dispatchEvent(event);
            expect(sp.x).to.equal(75);
            expect(sp.y).to.equal(75);
        });
    });

    describe("#scaleTo", function() {
        it("add a new Tween", function() {
            var sp = new Sprite(32, 32),
                tl = new Timeline(sp),
                constructorSpy = sinon.spy(enchant, "Tween"),
                scaleX = 2,
                scaleY = 4,
                time = 8,
                easing = enchant.Easing.LINEAR;

            tl.scaleTo(scaleX, scaleY, time, easing);
            expect(constructorSpy.calledWithNew()).to.be.true;
            expect(constructorSpy.calledWith({ scaleX: scaleX, scaleY: scaleY, time: time, easing: easing })).to.be.true;
            constructorSpy.restore();
        });

        it("can omit scaleY argument", function() {
            var sp = new Sprite(32, 32),
                tl = new Timeline(sp),
                constructorSpy = sinon.spy(enchant, "Tween"),
                scale = 2,
                time = 42,
                easing = enchant.Easing.LINEAR;

            tl.scaleTo(scale, time, easing);
            expect(constructorSpy.calledWithNew()).to.be.true;
            expect(constructorSpy.calledWith({ scaleX: scale, scaleY: scale, time: time, easing: easing })).to.be.true;
            constructorSpy.restore();
        });

        it("return itself", function() {
            var sp = new Sprite(32, 32),
                tl = new Timeline(sp);

            expect(tl.scaleTo(2, 2, 30, enchant.Easing.LINEAR)).to.equal(tl);
        });

        it("modify node's scale (frame based)", function() {
            var sp = new Sprite(32, 32),
                tl = new Timeline(sp),
                event = createEnterFrameEvent();

            tl.scaleTo(2, 2, 3, enchant.Easing.LINEAR);
            expect(sp.scaleX).to.equal(1);
            expect(sp.scaleY).to.equal(1);
            tl.dispatchEvent(event);
            expect(sp.scaleX).to.closeTo(1.33, 0.01);
            expect(sp.scaleY).to.closeTo(1.33, 0.01);
            tl.dispatchEvent(event);
            expect(sp.scaleX).to.closeTo(1.66, 0.01);
            expect(sp.scaleY).to.closeTo(1.66, 0.01);
            tl.dispatchEvent(event);
            expect(sp.scaleX).to.equal(2);
            expect(sp.scaleY).to.equal(2);
        });

        it("modify node's scale (time based)", function() {
            var sp = new Sprite(32, 32),
                tl = new Timeline(sp),
                event = createEnterFrameEvent();

            tl.setTimeBased();
            tl.scaleTo(2, 2, 100, enchant.Easing.LINEAR);
            expect(sp.scaleX).to.equal(1);
            expect(sp.scaleY).to.equal(1);
            tl.dispatchEvent(event);
            expect(sp.scaleX).to.closeTo(1.33, 0.01);
            expect(sp.scaleY).to.closeTo(1.33, 0.01);
            tl.dispatchEvent(event);
            expect(sp.scaleX).to.closeTo(1.66, 0.01);
            expect(sp.scaleY).to.closeTo(1.66, 0.01);
            tl.dispatchEvent(event);
            expect(sp.scaleX).to.equal(2);
            expect(sp.scaleY).to.equal(2);
        });
    });

    describe("#scaleBy", function() {
        it("add a new Tween", function() {
            var sp = new Sprite(32, 32),
                tl = new Timeline(sp),
                constructorSpy = sinon.spy(enchant, "Tween"),
                scaleX = 2,
                scaleY = 4,
                time = 8,
                easing = enchant.Easing.LINEAR;

            tl.scaleBy(scaleX, scaleY, time, easing);
            expect(constructorSpy.calledWithNew()).to.be.true;
            expect(constructorSpy.calledWith({ scaleX: sinon.match.func, scaleY: sinon.match.func, time: time, easing: easing })).to.be.true;
            constructorSpy.restore();
        });

        it("can omit scaleY argument", function() {
            var sp = new Sprite(32, 32),
                tl = new Timeline(sp),
                constructorSpy = sinon.spy(enchant, "Tween"),
                scale = 2,
                time = 42,
                easing = enchant.Easing.LINEAR;

            tl.scaleBy(scale, time, easing);
            expect(constructorSpy.calledWithNew()).to.be.true;
            expect(constructorSpy.calledWith({ scaleX: sinon.match.func, scaleY: sinon.match.func, time: time, easing: easing })).to.be.true;
            constructorSpy.restore();
        });

        it("return itself", function() {
            var sp = new Sprite(32, 32),
                tl = new Timeline(sp);

            expect(tl.scaleBy(2, 2, 30, enchant.Easing.LINEAR)).to.equal(tl);
        });

        it("modify node's scale (frame based)", function() {
            var sp = new Sprite(32, 32),
                tl = new Timeline(sp),
                event = createEnterFrameEvent();

            sp.scaleX = sp.scaleY = 2;
            tl.scaleBy(2, 2, 3, enchant.Easing.LINEAR);
            expect(sp.scaleX).to.equal(2);
            expect(sp.scaleY).to.equal(2);
            tl.dispatchEvent(event);
            expect(sp.scaleX).to.closeTo(2.66, 0.01);
            expect(sp.scaleY).to.closeTo(2.66, 0.01);
            tl.dispatchEvent(event);
            expect(sp.scaleX).to.closeTo(3.33, 0.01);
            expect(sp.scaleY).to.closeTo(3.33, 0.01);
            tl.dispatchEvent(event);
            expect(sp.scaleX).to.equal(4);
            expect(sp.scaleY).to.equal(4);
        });

        it("modify node's scale (time based)", function() {
            var sp = new Sprite(32, 32),
                tl = new Timeline(sp),
                event = createEnterFrameEvent();

            sp.scaleX = sp.scaleY = 2;
            tl.setTimeBased();
            tl.scaleBy(2, 2, 100, enchant.Easing.LINEAR);
            expect(sp.scaleX).to.equal(2);
            expect(sp.scaleY).to.equal(2);
            tl.dispatchEvent(event);
            expect(sp.scaleX).to.closeTo(2.66, 0.01);
            expect(sp.scaleY).to.closeTo(2.66, 0.01);
            tl.dispatchEvent(event);
            expect(sp.scaleX).to.closeTo(3.33, 0.01);
            expect(sp.scaleY).to.closeTo(3.33, 0.01);
            tl.dispatchEvent(event);
            expect(sp.scaleX).to.equal(4);
            expect(sp.scaleY).to.equal(4);
        });
    });

    describe("#rotateTo", function() {
        it("add a new Tween", function() {
            var sp = new Sprite(32, 32),
                tl = new Timeline(sp),
                constructorSpy = sinon.spy(enchant, "Tween"),
                deg = 90,
                time = 42,
                easing = enchant.Easing.LINEAR;

            tl.rotateTo(deg, time, easing);
            expect(tl.queue).to.have.length(1);
            expect(constructorSpy.calledWithNew()).to.be.true;
            expect(constructorSpy.calledWith({ rotation: deg, time: time, easing: easing })).to.be.true;
            constructorSpy.restore();
        });

        it("return itself", function() {
            var sp = new Sprite(32, 32),
                tl = new Timeline(sp);

            expect(tl.rotateTo(90, 30)).to.equal(tl);
        });

        it("modify node's rotation (frame based)", function() {
            var sp = new Sprite(32, 32),
                tl = new Timeline(sp),
                event = createEnterFrameEvent();

            tl.rotateTo(90, 3, enchant.Easing.LINEAR);
            expect(sp.rotation).to.equal(0);
            tl.dispatchEvent(event);
            expect(sp.rotation).to.equal(30);
            tl.dispatchEvent(event);
            expect(sp.rotation).to.equal(60);
            tl.dispatchEvent(event);
            expect(sp.rotation).to.equal(90);
        });

        it("modify node's rotation (time based)", function() {
            var sp = new Sprite(32, 32),
                tl = new Timeline(sp),
                event = createEnterFrameEvent();

            tl.setTimeBased();
            tl.rotateTo(90, 100, enchant.Easing.LINEAR);
            expect(sp.rotation).to.equal(0);
            tl.dispatchEvent(event);
            expect(sp.rotation).to.closeTo(30, 1);
            tl.dispatchEvent(event);
            expect(sp.rotation).to.closeTo(60, 1);
            tl.dispatchEvent(event);
            expect(sp.rotation).to.equal(90);
        });
    });

    describe("#rotateBy", function() {
        it("add a new Tween", function() {
            var sp = new Sprite(32, 32),
                tl = new Timeline(sp),
                constructorSpy = sinon.spy(enchant, "Tween"),
                time = 42,
                easing = enchant.Easing.LINEAR;

            tl.rotateBy(90, time, easing);
            expect(tl.queue).to.have.length(1);
            expect(constructorSpy.calledWithNew()).to.be.true;
            expect(constructorSpy.calledWith({ rotation: sinon.match.func, time: time, easing: easing })).to.be.true;
            constructorSpy.restore();
        });

        it("return itself", function() {
            var sp = new Sprite(32, 32),
                tl = new Timeline(sp);

            expect(tl.rotateBy(90, 30)).to.equal(tl);
        });

        it("modify node's rotation (frame based)", function() {
            var sp = new Sprite(32, 32),
                tl = new Timeline(sp),
                event = createEnterFrameEvent();

            sp.rotation = 30;
            tl.rotateBy(90, 3, enchant.Easing.LINEAR);
            expect(sp.rotation).to.equal(30);
            tl.dispatchEvent(event);
            expect(sp.rotation).to.equal(60);
            tl.dispatchEvent(event);
            expect(sp.rotation).to.equal(90);
            tl.dispatchEvent(event);
            expect(sp.rotation).to.equal(120);
        });

        it("modify node's rotation (time based)", function() {
            var sp = new Sprite(32, 32),
                tl = new Timeline(sp),
                event = createEnterFrameEvent();

            sp.rotation = 30;
            tl.setTimeBased();
            tl.rotateBy(90, 100, enchant.Easing.LINEAR);
            expect(sp.rotation).to.equal(30);
            tl.dispatchEvent(event);
            expect(sp.rotation).to.closeTo(60, 1);
            tl.dispatchEvent(event);
            expect(sp.rotation).to.closeTo(90, 1);
            tl.dispatchEvent(event);
            expect(sp.rotation).to.equal(120);
        });

        it("should not conflict with external modification (frame based)", function() {
            var sp = new Sprite(32, 32),
                tl = new Timeline(sp),
                event = createEnterFrameEvent();

            sp.rotation = 30;
            tl.rotateBy(90, 3, enchant.Easing.LINEAR);
            expect(sp.rotation).to.equal(30);
            sp.rotation += 15;
            tl.dispatchEvent(event);
            expect(sp.rotation).to.equal(75);
            sp.rotation += 15;
            tl.dispatchEvent(event);
            expect(sp.rotation).to.equal(120);
            sp.rotation += 15;
            tl.dispatchEvent(event);
            expect(sp.rotation).to.equal(165);
        });

        it("should not conflict with external modification (time based)", function() {
            var sp = new Sprite(32, 32),
                tl = new Timeline(sp),
                event = createEnterFrameEvent();

            sp.rotation = 30;
            tl.setTimeBased();
            tl.rotateBy(90, 100, enchant.Easing.LINEAR);
            expect(sp.rotation).to.equal(30);
            sp.rotation += 15;
            tl.dispatchEvent(event);
            expect(sp.rotation).to.closeTo(75, 1);
            sp.rotation += 15;
            tl.dispatchEvent(event);
            expect(sp.rotation).to.closeTo(120, 1);
            sp.rotation += 15;
            tl.dispatchEvent(event);
            expect(sp.rotation).to.equal(165);
        });
    });

    describe("ENTER_FRAME event", function() {
        it("execute #tick", function() {
            var sp = new Sprite(32, 32),
                tl = new Timeline(sp),
                event = createEnterFrameEvent(),
                tickSpy = sinon.spy(tl, 'tick');

            tl.dispatchEvent(event);
            expect(tickSpy.calledOnce).to.be.true;
        });

        it("do nothing if timeline is pausing", function() {
            var sp = new Sprite(32, 32),
                tl = new Timeline(sp),
                event = createEnterFrameEvent(),
                tickSpy = sinon.spy(tl, 'tick');

            tl.paused = true;
            tl.dispatchEvent(event);
            expect(tickSpy.notCalled).to.be.true;
        });

        it("use 1 as elapsed time (frame based)", function() {
            var sp = new Sprite(32, 32),
                tl = new Timeline(sp),
                event = createEnterFrameEvent(),
                tickSpy = sinon.spy(tl, 'tick');

            tl.dispatchEvent(event);
            expect(tickSpy.args[0][0]).to.equal(1);
        });

        it("use events' value as elapsed time (time based)", function() {
            var sp = new Sprite(32, 32),
                tl = new Timeline(sp),
                event = createEnterFrameEvent(),
                tickSpy = sinon.spy(tl, 'tick');

            tl.setTimeBased();
            tl.dispatchEvent(event);
            expect(tickSpy.args[0][0]).to.equal(event.elapsed);
        });
    });

    describe("combinations", function() {
        it("tl.delay(1).then", function() {
            var sp = new Sprite(32, 32),
                tl = new Timeline(sp),
                event = createEnterFrameEvent(),
                callbackSpy = sinon.spy();

            tl.delay(1);
            tl.then(callbackSpy);
            tl.dispatchEvent(event);
            expect(callbackSpy.calledOnce).to.be.true;
        });

        it("tl.delay(1).delay(1).then", function() {
            var sp = new Sprite(32, 32),
                tl = new Timeline(sp),
                event = createEnterFrameEvent(),
                callbackSpy = sinon.spy();

            tl.delay(1);
            tl.delay(1);
            tl.then(callbackSpy);
            tl.dispatchEvent(event);
            expect(callbackSpy.notCalled).to.be.true;
            tl.dispatchEvent(event);
            expect(callbackSpy.calledOnce).to.be.true;
        });

        it("tl.delay(1).then.delay(1).then", function() {
            var sp = new Sprite(32, 32),
                tl = new Timeline(sp),
                event = createEnterFrameEvent(),
                callbackSpy1 = sinon.spy(),
                callbackSpy2 = sinon.spy();

            tl.delay(1);
            tl.then(callbackSpy1);
            tl.delay(1);
            tl.then(callbackSpy2);
            tl.dispatchEvent(event);
            expect(callbackSpy1.calledOnce).to.be.true;
            expect(callbackSpy2.notCalled).to.be.true;
            tl.dispatchEvent(event);
            expect(callbackSpy1.calledOnce).to.be.true;
            expect(callbackSpy2.calledOnce).to.be.true;
        });

        it("tl.then.loop", function() {
            var sp = new Sprite(32, 32),
                tl = new Timeline(sp),
                event = createEnterFrameEvent(),
                callbackSpy = sinon.spy();

            expect(function() {
                tl.then(callbackSpy);
                tl.loop();
                tl.dispatchEvent(event);
            }).to.throws("Maximum call stack size exceeded");
        });

        it("tl.delay(1).then.loop", function() {
            var sp = new Sprite(32, 32),
                tl = new Timeline(sp),
                event = createEnterFrameEvent(),
                callbackSpy = sinon.spy();

            tl.delay(1);
            tl.then(callbackSpy);
            tl.loop();
            tl.dispatchEvent(event);
            expect(callbackSpy.calledOnce).to.be.true;
            tl.dispatchEvent(event);
            expect(callbackSpy.calledTwice).to.be.true;
        });

        it("tl.repeat(3).and.repeat(2).then", function() {
            var sp = new Sprite(32, 32),
                tl = new Timeline(sp),
                event = createEnterFrameEvent(),
                callbackSpy1 = sinon.spy(),
                callbackSpy2 = sinon.spy(),
                callbackSpy3 = sinon.spy();

            tl.repeat(callbackSpy1, 3);
            tl.and();
            tl.repeat(callbackSpy2, 2);
            tl.then(callbackSpy3);

            expect(callbackSpy1.notCalled).to.be.true;
            expect(callbackSpy2.notCalled).to.be.true;
            expect(callbackSpy3.notCalled).to.be.true;
            tl.dispatchEvent(event);
            expect(callbackSpy1.calledOnce).to.be.true;
            expect(callbackSpy2.calledOnce).to.be.true;
            expect(callbackSpy3.notCalled).to.be.true;
            tl.dispatchEvent(event);
            expect(callbackSpy1.calledTwice).to.be.true;
            expect(callbackSpy2.calledTwice).to.be.true;
            expect(callbackSpy3.notCalled).to.be.true;
            tl.dispatchEvent(event);
            expect(callbackSpy1.calledThrice).to.be.true;
            expect(callbackSpy2.calledTwice).to.be.true;
            expect(callbackSpy3.calledOnce).to.be.true;
        });

        it("tl.moveBy(100, 0, 5).moveBy(100, 0, 5)", function() {
            var sp1 = new Sprite(32, 32),
                sp2 = new Sprite(32, 32),
                tl1 = new Timeline(sp1),
                tl2 = new Timeline(sp2),
                event = createEnterFrameEvent();

            tl1.moveBy(100, 0, 5, enchant.Easing.LINEAR);
            tl1.moveBy(100, 0, 5, enchant.Easing.LINEAR);
            tl2.moveBy(200, 0, 10, enchant.Easing.LINEAR);

            for (var i = 0; i < 9; i++) {
                tl1.dispatchEvent(event);
                tl2.dispatchEvent(event);
                expect(sp1.x).to.closeTo(sp2.x, 0.01);
                expect(tl1._activated).to.be.true;
                expect(tl2._activated).to.be.true;
            }

            tl1.dispatchEvent(event);
            tl2.dispatchEvent(event);
            expect(sp1.x).to.closeTo(sp2.x, 0.01);
            expect(tl1._activated).to.be.false;
            expect(tl2._activated).to.be.false;
        });

        it("tl.moveBy(100, 0, 10).and.moveBy(100, 0, 10)", function() {
            var sp1 = new Sprite(32, 32),
                sp2 = new Sprite(32, 32),
                tl1 = new Timeline(sp1),
                tl2 = new Timeline(sp2),
                event = createEnterFrameEvent();

            tl1.moveBy(100, 0, 10, enchant.Easing.LINEAR);
            tl1.and();
            tl1.moveBy(100, 0, 10, enchant.Easing.LINEAR);
            tl2.moveBy(200, 0, 10, enchant.Easing.LINEAR);

            for (var i = 0; i < 9; i++) {
                tl1.dispatchEvent(event);
                tl2.dispatchEvent(event);
                expect(sp1.x).to.closeTo(sp2.x, 0.01);
                expect(tl1._activated).to.be.true;
                expect(tl2._activated).to.be.true;
            }

            tl1.dispatchEvent(event);
            tl2.dispatchEvent(event);
            expect(sp1.x).to.closeTo(sp2.x, 0.01);
            expect(tl1._activated).to.be.false;
            expect(tl2._activated).to.be.false;
        });

        it("tl.moveBy(100, 0, 10).and.moveBy(0, 100, 10)", function() {
            var sp1 = new Sprite(32, 32),
                sp2 = new Sprite(32, 32),
                tl1 = new Timeline(sp1),
                tl2 = new Timeline(sp2),
                event = createEnterFrameEvent();

            tl1.moveBy(100, 0, 10, enchant.Easing.LINEAR);
            tl1.and();
            tl1.moveBy(0, 100, 10, enchant.Easing.LINEAR);
            tl2.moveBy(100, 100, 10, enchant.Easing.LINEAR);

            for (var i = 0; i < 9; i++) {
                tl1.dispatchEvent(event);
                tl2.dispatchEvent(event);
                expect(sp1.x).to.closeTo(sp2.x, 0.01);
                expect(sp1.y).to.closeTo(sp2.y, 0.01);
                expect(tl1._activated).to.be.true;
                expect(tl2._activated).to.be.true;
            }

            tl1.dispatchEvent(event);
            tl2.dispatchEvent(event);
            expect(sp1.x).to.closeTo(sp2.x, 0.01);
            expect(sp1.y).to.closeTo(sp2.y, 0.01);
            expect(tl1._activated).to.be.false;
            expect(tl2._activated).to.be.false;
        });
    });

});
