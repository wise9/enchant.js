describe("EventTarget", function(){
    var TestClass;

    before(function(){
        enchant();
        TestClass = enchant.Class.create(enchant.EventTarget, {
            initialize: function(){
                enchant.EventTarget.call(this);
            }
        });
    });

    it("takes a event listener", function(){
        var testClass = new TestClass();
        var callback = sinon.spy();
        testClass.addEventListener("touchstart", callback);
        expect(testClass._listeners["touchstart"][0]).to.deep.equal(callback);
        expect(Object.keys(testClass._listeners).length).to.equal(1);
        testClass.dispatchEvent(new Event("touchstart"));
        expect(callback.called).to.be.true;
    });

    it("takes several different types of event listener", function(){
        var testClass = new TestClass();
        var callback1 = sinon.spy(),
            callback2 = sinon.spy();
        testClass.addEventListener("touchstart", callback1);
        testClass.addEventListener("touchend", callback2);
        expect(testClass._listeners["touchstart"][0]).to.deep.equal(callback1);
        expect(testClass._listeners["touchend"][0]).to.deep.equal(callback2);
        expect(Object.keys(testClass._listeners).length).to.equal(2);
        testClass.dispatchEvent(new Event("touchstart"));
        testClass.dispatchEvent(new Event("touchend"))
        expect(callback1.called).to.be.true;
        expect(callback1.callCount).to.equal(1);
        expect(callback2.called).to.be.true;
        expect(callback2.callCount).to.equal(1);
    });

    it("takes multiple event listeners to one event type", function(){
        var testClass = new TestClass();
        var callback1 = sinon.spy(),
            callback2 = sinon.spy();
        testClass.addEventListener("touchstart", callback1);
        testClass.addEventListener("touchstart", callback2);
        expect(callback1.called).to.be.false;
        expect(callback2.called).to.be.false;
        testClass.dispatchEvent(new Event("touchstart"));
        expect(callback1.callCount).to.equal(1);
        expect(callback2.callCount).to.equal(1);
    });

    it("#on is synonym for #addEventListener", function(){
        var testClass = new TestClass();
        var callback = sinon.spy();
        testClass.on("touchstart", callback);
        expect(testClass._listeners["touchstart"][0]).to.deep.equal(callback);
        testClass.dispatchEvent(new Event("touchstart"));
        expect(callback.called).to.be.true;
        expect(callback.callCount).to.equal(1);
    });

    it("removes a event listener of itself", function(){
        var testClass = new TestClass();
        var callback = sinon.spy();
        testClass.addEventListener("touchstart", callback);
        testClass.dispatchEvent(new Event("touchstart"));
        expect(callback.callCount).to.equal(1);
        testClass.removeEventListener("touchstart", callback);
        testClass.dispatchEvent(new Event("touchstart"));
        expect(callback.callCount).to.equal(1);
    });

    it("removes event listener from a event which has multiple event listeners", function(){
        var testClass = new TestClass();
        var callback1 = sinon.spy(),
            callback2 = sinon.spy();
        testClass.addEventListener("touchstart", callback1);
        testClass.addEventListener("touchstart", callback2);
        expect(testClass._listeners["touchstart"][1]).to.deep.equal(callback1);
        expect(testClass._listeners["touchstart"][0]).to.deep.equal(callback2);
        testClass.removeEventListener("touchstart", callback2);
        expect(testClass._listeners["touchstart"][0]).to.deep.equal(callback1);
        testClass.dispatchEvent(new Event("touchstart"));
        expect(callback1.callCount).to.equal(1);
        expect(callback2.called).to.be.false;
    });

    it("removes event listener from class which has multiple event listeners on multiple events", function(){
        var testClass = new TestClass();
        var callback1 = sinon.spy(),
            callback2 = sinon.spy();
        testClass.addEventListener("touchstart", callback1);
        testClass.addEventListener("touchend", callback2);
        testClass.dispatchEvent(new Event("touchend"));
        expect(callback1.callCount).to.equal(0);
        expect(callback2.callCount).to.equal(1);
        testClass.removeEventListener("touchend", callback2);
        testClass.dispatchEvent(new Event("touchend"));
        expect(callback2.callCount).to.equal(1);
        expect(testClass._listeners["touchend"].length).to.be.zero;
        expect(Object.keys(testClass._listeners["touchstart"]).length).to.equal(1);
    });

    it("removes all event listeners from all events", function(){
        var sprite = new Sprite();
        expect(Object.keys(sprite._listeners).length).to.be.above(2);
        sprite.clearEventListener();
        expect(Object.keys(sprite._listeners).length).to.be.zero;
    });

    it("removes all event listeners related to one event", function(){
        var testClass = new TestClass();
        var callback1 = sinon.spy(),
            callback2 = sinon.spy(),
            callback3 = sinon.spy();
        testClass.addEventListener("touchstart", callback1);
        testClass.addEventListener("touchstart", callback2);
        testClass.addEventListener("touchend", callback3);
        expect(testClass._listeners["touchstart"].length).to.equal(2);
        expect(testClass._listeners["touchend"].length).to.equal(1);
        testClass.clearEventListener("touchstart");
        expect(testClass._listeners["touchstart"]).to.be.undefined;
        expect(testClass._listeners["touchend"].length).to.equal(1);
    });

    it("dispatches enchant.Event", function(){
        var testClass = new TestClass();
        var callback1 = sinon.spy(),
            callback2 = sinon.spy(),
            callback3 = sinon.spy();
        testClass.addEventListener("touchstart", callback1);
        testClass.addEventListener("touchmove", callback2);
        testClass.addEventListener("touchend", callback3);
        testClass.dispatchEvent(new Event("touchstart"));
        expect(callback1.callCount).to.equal(1);
        expect(callback2.callCount).to.be.zero;
        expect(callback3.callCount).to.be.zero;
        testClass.dispatchEvent(new Event("touchmove"));
        expect(callback1.callCount).to.equal(1);
        expect(callback2.callCount).to.equal(1);
        expect(callback3.callCount).to.be.zero;
        testClass.dispatchEvent(new Event("touchend"));
        expect(callback1.callCount).to.equal(1);
        expect(callback2.callCount).to.equal(1);
        expect(callback3.callCount).to.equal(1);
    });
});