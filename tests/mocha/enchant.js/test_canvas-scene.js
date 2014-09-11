describe("CanvasScene", function(){
    var core, canvasScene;

    beforeEach(function(){
        enchant();
        core = new Core();
        canvasScene = new CanvasScene();
    });

    afterEach(function(){
        core = null;
        canvasScene = null;
    });

    it("makes CanvasScene", function(){
        expect(canvasScene._layers["Canvas"]).to.exist;
    });

    it("#_determineEventTarget returns target which is affected by event", function(){
        var target = canvasScene._determineEventTarget(new enchant.Event("touchstart"));
        expect(target).to.equal(canvasScene);
        var sprite = new Sprite();
        var stub = sinon.stub(canvasScene._layers.Canvas, "_determineEventTarget");
        stub.returns(sprite);
        target = canvasScene._determineEventTarget(new enchant.Event("touchstart"));
        expect(target).to.equal(sprite);
    });

    it("adds layer to child when childadded event occurred", function(){
        core.pushScene(canvasScene);
        var sprite = new Sprite();
        var callback = sinon.spy();
        canvasScene.addEventListener(enchant.Event.CHILD_ADDED, callback);
        canvasScene.addChild(sprite);
        expect(callback.called).to.be.true;
        expect(canvasScene._layers.Canvas.lastChild).to.deep.equal(sprite);
    });

    it("starts rendering when the scene started", function(){
        var stub = sinon.stub(canvasScene._layers.Canvas, "_startRendering");
        expect(stub.called).to.be.false;
        canvasScene.dispatchEvent(new enchant.Event("enter"));
        expect(stub.called).to.be.true;
    });

    it("stops rendering when the scene stops", function(){
        var stub = sinon.stub(canvasScene._layers.Canvas, "_stopRendering");
        expect(stub.called).to.be.false;
        canvasScene.dispatchEvent(new enchant.Event("exit"));
        expect(stub.called).to.be.true;
    });
});