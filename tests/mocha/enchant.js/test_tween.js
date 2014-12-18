describe("Tween", function() {
    var TimelineMock;

    before(function() {
        enchant();

        TimelineMock = function(node) {
            this.node = node;
            this.next = sinon.spy();
        };
    });

    describe("#initialize", function() {
        it("default easing function is LINEAR", function() {
            var tween = new Tween();

            expect(tween.easing).to.equal(enchant.Easing.LINEAR);
        });
    });

    describe("ACTION_TICK event", function() {
        it("ease node's property with specified function", function() {
            var sp = new Sprite(32, 32),
                tl = new TimelineMock(sp),
                tween1 = new Tween({ x: 32, time: 2, easing: enchant.Easing.LINEAR }),
                tween2 = new Tween({ y: 32, time: 2, easing: enchant.Easing.BACK_EASEIN }),
                actionStartEvent = new Event(Event.ACTION_START),
                actionTickEvent = new Event(Event.ACTION_TICK);

            actionStartEvent.timeline = tl;
            actionTickEvent.timeline = tl;
            actionTickEvent.elapsed = 1;
            tween1.node = sp;
            tween2.node = sp;
            tween1.dispatchEvent(actionStartEvent);
            tween2.dispatchEvent(actionStartEvent);
            expect(sp.x).to.equal(0);
            expect(sp.y).to.equal(0);
            tween1.dispatchEvent(actionTickEvent);
            tween2.dispatchEvent(actionTickEvent);
            expect(sp.x).to.equal(16);
            expect(sp.y).to.lessThan(0);
            tween1.dispatchEvent(actionTickEvent);
            tween2.dispatchEvent(actionTickEvent);
            expect(sp.x).to.equal(32);
            expect(sp.y).to.closeTo(32, 0.1);
        });

        it("use function result to target value", function() {
            var sp = new Sprite(32, 32),
                tl = new TimelineMock(sp),
                tween = new Tween({ x: function() { return 32; }, time: 2, easing: enchant.Easing.LINEAR }),
                actionStartEvent = new Event(Event.ACTION_START),
                actionTickEvent = new Event(Event.ACTION_TICK);

            actionStartEvent.timeline = tl;
            actionTickEvent.timeline = tl;
            actionTickEvent.elapsed = 1;
            tween.node = sp;
            tween.dispatchEvent(actionStartEvent);
            expect(sp.x).to.equal(0);
            tween.dispatchEvent(actionTickEvent);
            expect(sp.x).to.equal(16);
            tween.dispatchEvent(actionTickEvent);
            expect(sp.x).to.equal(32);
        });
    });

});
