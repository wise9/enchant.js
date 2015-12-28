describe("Action", function() {
    var TimelineMock;

    before(function() {
        enchant();

        TimelineMock = function(node) {
            this.node = node;
            this.next = sinon.spy();
        };
    });

    describe("#initialize", function() {
        it("copy params", function() {
            var params = { str: 'foo', num: 42, obj: {}, func: function() {} },
                action = new Action(params);

            expect(action.str).to.equal(params.str);
            expect(action.num).to.equal(params.num);
            expect(action.obj).to.equal(params.obj);
            expect(action.func).to.equal(params.func);
        });
    });

    describe("ADDED_TO_TIMELINE event", function() {
        it("set #node, #timeline and #frame", function() {
            var sp = new Sprite(32, 32),
                tl = new TimelineMock(sp),
                action = new Action(),
                event = new Event(Event.ADDED_TO_TIMELINE);

            event.timeline = tl;
            action.frame = 5;
            expect(action.timeline).to.be.null;
            expect(action.node).to.be.null;
            action.dispatchEvent(event);
            expect(action.timeline).to.equal(tl);
            expect(action.node).to.equal(sp);
            expect(action.frame).to.equal(0);
        });
    });

    describe("REMOVED_FROM_TIMELINE event", function() {
        it("set #node, #timeline and #frame", function() {
            var sp = new Sprite(32, 32),
                tl = new TimelineMock(sp),
                action = new Action({}),
                event = new Event(Event.REMOVED_FROM_TIMELINE);

            event.timeline = tl;
            action.frame = 5;
            action.timeline = tl;
            action.node = sp;
            action.dispatchEvent(event);
            expect(action.timeline).to.be.null;
            expect(action.node).to.be.null;
            expect(action.frame).to.equal(0);
        });
    });

    describe("ACTION_TICK event", function() {
        it("increace #frame by elapsed frame", function() {
            var time = 3,
                sp = new Sprite(32, 32),
                tl = new TimelineMock(sp),
                action = new Action({ time: time }),
                event = new Event(Event.ACTION_TICK);

            event.timeline = tl;
            event.elapsed = 1;
            action.timeline = tl;
            action.node = sp;
            action.dispatchEvent(event);
            expect(action.frame).to.equal(1);
            expect(tl.next.notCalled).to.be.true;
            action.dispatchEvent(event);
            expect(action.frame).to.equal(2);
            expect(tl.next.notCalled).to.be.true;
            action.dispatchEvent(event);
            expect(action.frame).to.equal(3);
            expect(tl.next.calledOnce).to.be.true;
            expect(tl.next.calledWith(0)).to.be.true;
        });

        it("increace #frame by elapsed time", function() {
            var timePerFrame = 1000 / 30,
                time = 80,
                sp = new Sprite(32, 32),
                tl = new TimelineMock(sp),
                action = new Action({ time: time }),
                event = new Event(Event.ACTION_TICK);

            event.timeline = tl;
            event.elapsed = timePerFrame;
            action.timeline = tl;
            action.node = sp;
            action.dispatchEvent(event);
            expect(action.frame).to.equal(timePerFrame * 1);
            expect(tl.next.notCalled).to.be.true;
            action.dispatchEvent(event);
            expect(action.frame).to.equal(timePerFrame * 2);
            expect(tl.next.notCalled).to.be.true;
            action.dispatchEvent(event);
            expect(action.frame).to.equal(time);
            expect(tl.next.calledOnce).to.be.true;
            expect(tl.next.calledWith(timePerFrame * 3 - time)).to.be.true;
        });
    });

});
