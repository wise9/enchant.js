describe("Scene", function(){
    var core, scene;

    beforeEach(function(){
        enchant();
        core = new Core();
        scene = new Scene();
    });

    afterEach(function(){
        core = null;
    });

    describe("#initialize", function(){
        it("makes div tag with styles which posesses its layer", function(){
            expect(scene._element.tagName).to.equal("DIV");
            expect(scene._element.style.position).to.equal("absolute");
            expect(scene._element.style.overflow).to.equal("hidden");
        });

        it("sets event listeners to itself", function(){
            expect(scene._listeners[enchant.Event.CHILD_ADDED][0]).to.equal(scene._onchildadded);
            expect(scene._listeners[enchant.Event.CHILD_REMOVED][0]).to.equal(scene._onchildremoved);
            expect(scene._listeners[enchant.Event.ENTER][0]).to.equal(scene._onenter);
            expect(scene._listeners[enchant.Event.EXIT][0]).to.equal(scene._onexit);
            expect(scene._listeners[enchant.Event.CORE_RESIZE][0]).to.equal(scene._oncoreresize);
        });
    });

    describe("#remove", function() {
        it("removes all children", function() {
            var sprite1 = new enchant.Sprite();
            var sprite2 = new enchant.Sprite();
            scene.addChild(sprite1);
            scene.addChild(sprite2);
            expect(scene.childNodes.length).to.equal(2);
            scene.remove();
            expect(scene.childNodes.length).to.equal(0);
        });

        it("removes all event listners", function() {
            var clearEventListener = sinon.spy(scene, 'clearEventListener');
            scene.remove();
            expect(clearEventListener.called).to.be.true;
        });

        it("is removed from scene stack", function() {
            core.pushScene(scene);
            expect(core._scenes.indexOf(scene)).not.to.be.equal(-1);
            scene.remove();
            expect(core._scenes.indexOf(scene)).to.be.equal(-1);
        });
    });

    describe("with no layer", function(){
        it("can be set x position", function(){
            expect(scene.x).to.be.zero;
            expect(scene._x, "borrow from enchant.Node").to.be.zero;
            scene.x = 10;
            expect(scene.x).to.equal(10);
            expect(scene._x).to.equal(10);
        });

        it("can be set y position", function(){
            expect(scene.y).to.be.zero;
            expect(scene._y, "borrow from enchant.Node").to.be.zero;
            scene.y = 10;
            expect(scene.y).to.equal(10);
            expect(scene._y).to.equal(10);
        });

        it("can be set width", function(){
            expect(scene.width, "sets on _oncoreresize").to.equal(320);
            expect(scene._width).to.equal(320);
            scene.width = 640;
            expect(scene.width).to.equal(640);
            expect(scene._width).to.equal(640);
        });

        it("can be set height", function(){
            expect(scene.height, "sets on _oncoreresize").to.equal(320);
            expect(scene._height).to.equal(320);
            scene.height = 640;
            expect(scene.height).to.be.equal(640);
            expect(scene._height).to.be.equal(640);
        });

        it("can be set its rotation", function(){
            expect(scene.rotation, "borrow from enchant.Group").to.be.zero;
            expect(scene._rotation).to.be.zero;
            scene.rotation = 60;
            expect(scene.rotation).to.equal(60);
            expect(scene._rotation).to.equal(60);
        });

        it("can be set scaleX", function(){
            expect(scene.scaleX, "borrow from enchant.Group").to.equal(1);
            expect(scene._scaleX).to.equal(1);
            scene.scaleX = 10;
            expect(scene.scaleX).to.equal(10);
            expect(scene._scaleX).to.equal(10);
        });

        it("can be set scaleY", function(){
            expect(scene.scaleY, "borrow from enchant.Group").to.equal(1);
            expect(scene._scaleY).to.equal(1);
            scene.scaleY = 10;
            expect(scene.scaleY).to.equal(10);
            expect(scene._scaleY).to.equal(10);
        });

        it("resizes its width and height when coreresize event occurred", function(){
            core.pushScene(scene);
            expect(scene.width, "borrow from core").to.equal(320);
            expect(scene.height, "borrow from core").to.equal(320);
            core.width = 400; // coreresize event occurrs
            expect(scene.width).to.equal(400);
            expect(scene.height).to.equal(320);
            core.height = 500; // coreresize event occurrs
            expect(scene.width).to.equal(400);
            expect(scene.height).to.equal(500);
        });
    });

    it("can be set background color", function(){
        expect(scene.backgroundColor).to.be.null;
        expect(scene._backgroundColor).to.be.null;
        scene.backgroundColor = "#f00";
        expect(scene.backgroundColor).to.equal("#f00");
        expect(scene._backgroundColor).to.equal("#f00");
        expect(scene._element.style.backgroundColor).to.equal("rgb(255, 0, 0)");
    });

    describe("adding layers", function(){
        it("can be add DomLayer or CanvasLayer or both", function(){
            expect(Object.keys(scene._layers).length).to.be.zero;
            scene.addLayer("Canvas");
            expect(Object.keys(scene._layers).length).to.equal(1);
            expect(scene._layers["Canvas"]).to.exist;
            expect(scene._element.lastChild.tagName).to.equal("CANVAS");
            expect(scene._layerPriority[0]).to.equal("Canvas");
            scene.addLayer("Dom");
            expect(Object.keys(scene._layers).length).to.equal(2);
            expect(scene._layers["Dom"]).to.exist;
            expect(scene._element.lastChild.tagName).to.equal("DIV");
            expect(scene._layerPriority[0]).to.equal("Canvas");
            expect(scene._layerPriority[1]).to.equal("Dom");
            scene = null;
            scene = new Scene();
            expect(Object.keys(scene._layers).length).to.be.zero;
            scene.addLayer("Dom");
            expect(Object.keys(scene._layers).length).to.equal(1);
            expect(scene._layers["Dom"]).to.exist;
            expect(scene._element.lastChild.tagName).to.equal("DIV");
            expect(scene._layerPriority[0]).to.equal("Dom");
            scene.addLayer("Canvas");
            expect(scene._element.lastChild.tagName).to.equal("CANVAS");
            expect(scene._layerPriority[0]).to.equal("Dom");
            expect(scene._layerPriority[1]).to.equal("Canvas");
        });

        it("can not be add same type of layer", function(){
            scene.addLayer("Canvas");
            expect(Object.keys(scene._layers).length).to.equal(1);
            expect(scene._element.childNodes.length).to.equal(1);
            expect(scene._layerPriority.length).to.equal(1);
            scene.addLayer("Canvas");
            expect(Object.keys(scene._layers).length).to.equal(1);
            expect(scene._element.childNodes.length).to.equal(1);
            expect(scene._layerPriority.length).to.equal(1);
            scene = null;
            scene = new Scene();
            scene.addLayer("Dom");
            expect(Object.keys(scene._layers).length).to.equal(1);
            expect(scene._element.childNodes.length).to.equal(1);
            expect(scene._layerPriority.length).to.equal(1);
            scene.addLayer("Dom");
            expect(Object.keys(scene._layers).length).to.equal(1);
            expect(scene._element.childNodes.length).to.equal(1);
            expect(scene._layerPriority.length).to.equal(1);
        });

        it("can be set layer priority when adding layer", function(){
            scene.addLayer("Canvas");
            expect(scene._element.childNodes.length).to.equal(1);
            expect(scene._element.childNodes[0].tagName).to.equal("CANVAS");
            expect(scene._layerPriority[0]).to.equal("Canvas");
            scene.addLayer("Dom", 0);
            expect(scene._element.childNodes.length).to.equal(2);
            expect(scene._element.childNodes[0].tagName).to.equal("DIV");
            expect(scene._element.childNodes[1].tagName).to.equal("CANVAS");
            expect(scene._layerPriority[0]).to.equal("Dom");
            expect(scene._layerPriority[1]).to.equal("Canvas");
        });
    });

    describe("with layer", function(){
        beforeEach(function(){
            scene.addLayer("Dom");
            scene.addLayer("Canvas");
        });

        it("can be set x position and it affects to all layers", function(){
            expect(scene.x).to.be.zero;
            expect(scene._layers["Dom"].x).to.be.zero;
            expect(scene._layers["Canvas"].x).to.be.zero;
            scene.x = 10;
            expect(scene.x).to.equal(10);
            expect(scene._layers["Dom"].x).to.equal(10);
            expect(scene._layers["Canvas"].x).to.equal(10);
        });

        it("can be set y position and it affects to all layers", function(){
            expect(scene.y).to.be.zero;
            expect(scene._layers["Dom"].y).to.be.zero;
            expect(scene._layers["Canvas"].y).to.be.zero;
            scene.y = 10;
            expect(scene.y).to.equal(10);
            expect(scene._layers["Dom"].y).to.equal(10);
            expect(scene._layers["Canvas"].y).to.equal(10);
        });

        it("can be set width and it affects to all layers", function(){
            expect(scene.width).to.equal(320);
            expect(scene._layers["Dom"].width).to.equal(320);
            expect(scene._layers["Canvas"].width).to.equal(320);
            scene.width = 640;
            expect(scene.width).to.equal(640);
            expect(scene._layers["Dom"].width).to.equal(640);
            expect(scene._layers["Canvas"].width).to.equal(640);
        });

        it("can be set height and it affects to all layers", function(){
            expect(scene.height).to.equal(320);
            expect(scene._layers["Dom"].height).to.equal(320);
            expect(scene._layers["Canvas"].height).to.equal(320);
            scene.height = 640;
            expect(scene.height).to.be.equal(640);
            expect(scene._layers["Dom"].height).to.equal(640);
            expect(scene._layers["Canvas"].height).to.equal(640);
        });

        it("can be set its rotation and it affects to all layers", function(){
            expect(scene.rotation).to.be.zero;
            expect(scene._layers["Dom"].rotation).to.be.zero;
            expect(scene._layers["Canvas"].rotation).to.be.zero;
            scene.rotation = 60;
            expect(scene.rotation).to.equal(60);
            expect(scene._layers["Dom"].rotation).to.equal(60);
            expect(scene._layers["Canvas"].rotation).to.equal(60);
        });

        it("can be set scaleX and it affects to all layers", function(){
            expect(scene.scaleX).to.equal(1);
            expect(scene._layers["Dom"].scaleX).to.equal(1);
            expect(scene._layers["Canvas"].scaleX).to.equal(1);
            scene.scaleX = 10;
            expect(scene.scaleX).to.equal(10);
            expect(scene._layers["Dom"].scaleX).to.equal(10);
            expect(scene._layers["Canvas"].scaleX).to.equal(10);
        });

        it("can be set scaleY it affects to all layers", function(){
            expect(scene.scaleY).to.equal(1);
            expect(scene._layers["Dom"].scaleY).to.equal(1);
            expect(scene._layers["Canvas"].scaleY).to.equal(1);
            scene.scaleY = 10;
            expect(scene.scaleY).to.equal(10);
            expect(scene._layers["Dom"].scaleY).to.equal(10);
            expect(scene._layers["Canvas"].scaleY).to.equal(10);
        });

        it("all layers dispatches coreresize event when coreresize event occurred", function(){
            core.pushScene(scene);
            var callback1 = sinon.spy(),
                callback2 = sinon.spy();
            scene._layers["Dom"].addEventListener(enchant.Event.CORE_RESIZE, callback1);
            scene._layers["Canvas"].addEventListener(enchant.Event.CORE_RESIZE, callback2);
            expect(callback1.called).to.be.false;
            expect(callback2.called).to.be.false;
            core.width = 400; // coreresize event occurrs
            expect(callback1.callCount).to.equal(1);
            expect(callback2.callCount).to.equal(1);
        });

        it("#_determineEventTarget returns target layer", function(){
            var target = scene._determineEventTarget(new enchant.Event("touchstart"));
            expect(target).to.equal(scene);
            var spriteOnCanvas = new Sprite();
            var stubCanvas = sinon.stub(scene._layers["Canvas"], "_determineEventTarget");
            stubCanvas.returns(spriteOnCanvas);
            target = scene._determineEventTarget(new enchant.Event("touchstart"));
            expect(target).to.equal(spriteOnCanvas);
            expect(stubCanvas.callCount).to.equal(1);
            var spriteOnDom = new Sprite();
            var stubDom = sinon.stub(scene._layers["Dom"], "_determineEventTarget");
            stubDom.returns(spriteOnDom);
            target = scene._determineEventTarget(new enchant.Event("touchstart"));
            expect(target).to.equal(spriteOnCanvas);
            expect(stubCanvas.callCount).to.equal(2);
            expect(stubDom.callCount).to.equal(0);
        });

        it("adds layer to child when childadded event occurred", function(){
            core.pushScene(scene);
            var sprite = new Sprite();
            var callback = sinon.spy();
            scene.addEventListener(enchant.Event.CHILD_ADDED, callback);
            scene.addChild(sprite);
            expect(callback.called).to.be.true;
            expect(sprite.parentNode).to.equal(scene);
            expect(scene._layers["Canvas"].lastChild).to.deep.equal(sprite);

        });

        it("removes child layer when childremoved event occurred", function(){
            core.pushScene(scene);
            var sprite = new Sprite();
            scene.addChild(sprite);
            expect(scene._layers["Canvas"].lastChild).to.equal(sprite);
            scene.removeChild(sprite);
            expect(scene._layers["Canvas"].lastChild).to.not.equal(sprite);
        });

        it("starts rendering when the scene started", function(){
            var stub = sinon.stub(scene._layers["Canvas"], "_startRendering");
            expect(stub.called).to.be.false;
            scene.dispatchEvent(new enchant.Event("enter"));
            expect(stub.called).to.be.true;
        });

        it("stops rendering when the scene stops", function(){
            var stub = sinon.stub(scene._layers["Canvas"], "_stopRendering");
            expect(stub.called).to.be.false;
            scene.dispatchEvent(new enchant.Event("exit"));
            expect(stub.called).to.be.true;
        });
    });
});
