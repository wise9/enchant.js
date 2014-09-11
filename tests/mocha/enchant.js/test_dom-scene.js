describe("DomScene", function(){
    var core, domScene;

    beforeEach(function(){
        enchant();
        core = new Core();
        domScene = new DOMScene();
    });

    afterEach(function(){
        core = null;
        domScene = null;
    });

    it("makes DomScene", function(){
        expect(domScene._layers['Dom']).to.exist;
    });

    it("#_determineEventTarget returns target which is affected by event", function(){
        var target = domScene._determineEventTarget(new enchant.Event("touchstart"));
        expect(target).to.equal(domScene);
        var sprite = new Sprite();
        var stub = sinon.stub(domScene._layers.Dom, "_determineEventTarget");
        stub.returns(sprite);
        target = domScene._determineEventTarget(new enchant.Event("touchstart"));
        expect(target).to.equal(sprite);
    });

    it("adds layer to child when childadded event occurred", function(){
        core.pushScene(domScene);
        var sprite = new Sprite();
        var callback = sinon.spy();
        domScene.addEventListener(enchant.Event.CHILD_ADDED, callback);
        domScene.addChild(sprite);
        expect(callback.called).to.be.true;
        expect(domScene._layers.Dom.lastChild).to.deep.equal(sprite);
    });

    it("starts rendering when the scene started", function(){
        var stub = sinon.stub(domScene._layers.Dom, "_startRendering");
        expect(stub.called).to.be.false;
        domScene.dispatchEvent(new enchant.Event("enter"));
        expect(stub.called).to.be.true;
    });

    it("stops rendering when the scene stops", function(){
        var stub = sinon.stub(domScene._layers.Dom, "_stopRendering");
        expect(stub.called).to.be.false;
        domScene.dispatchEvent(new enchant.Event("exit"));
        expect(stub.called).to.be.true;
    });
});