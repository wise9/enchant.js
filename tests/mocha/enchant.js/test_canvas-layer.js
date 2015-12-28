describe('CanvasLayer', function(){
    var core;

    before(function(){
        enchant();
        core = new Core();
    });

    it('is an instanceof enchant.Group', function(){
        var canvasLayer = new CanvasLayer();
        expect(canvasLayer).to.be.an.instanceof(enchant.Group);
    });

    describe('#initialize', function(){
        var cl;

        beforeEach(function(){
            cl = new CanvasLayer();
        });

        it('creates canvas', function(){
            expect(cl._element.tagName).to.equal('CANVAS');
            expect(cl.context).to.equal(cl._element.getContext('2d'));
            expect(cl._element.style.position).to.equal('absolute');
            expect(cl._element.style.top).to.equal('0px');
            expect(cl._element.style.left).to.equal('0px');
            expect(cl._detect.tagName).to.equal('CANVAS');
            expect(cl._dctx).to.equal(cl._detect.getContext('2d'));
            expect(cl._detect.style.position).to.equal('absolute');
        });

        it('initializes _lastDetected', function(){
            expect(cl._lastDetected).to.equal(0);
        });

        it('initializes its width and height', function(){
            expect(cl.width).to.equal(core.width);
            expect(cl.height).to.equal(core.height);
        });

        it('initializes color manager', function(){
            var expected = new enchant.DetectColorManager(16, 256);
            expect(cl._colorManager).to.deep.equal(expected);
        });

        it('dispatches event from its owned scene', function(){
            var scene = new CanvasScene();
            var spy1 = sinon.spy(),
                spy2 = sinon.spy(),
                spy3 = sinon.spy();
            scene.addEventListener(enchant.Event.TOUCH_START, spy1);
            scene.addEventListener(enchant.Event.TOUCH_MOVE, spy2);
            scene.addEventListener(enchant.Event.TOUCH_END, spy3);
            expect(spy1.called).to.be.false;
            expect(spy2.called).to.be.false;
            expect(spy3.called).to.be.false;
            scene._layers['Canvas'].dispatchEvent(new enchant.Event('touchstart'));
            expect(spy1.called).to.be.true;
            scene._layers['Canvas'].dispatchEvent(new enchant.Event('touchmove'));
            expect(spy2.called).to.be.true;
            scene._layers['Canvas'].dispatchEvent(new enchant.Event('touchend'));
            expect(spy3.called).to.be.true;
        });
    });

    describe('#__onchildadded', function(){
        var scene, e, node;
        beforeEach(function(){
            scene = new CanvasScene();
            e = new enchant.Event('childadded');
            node = new Node();
            e.node = node;
            e.target = scene._layers.Canvas;
        });

        it('sets _cvsCache to added node', function(){
            sinon.spy(enchant.CanvasLayer, '_attachCache');
            expect(node._cvsCache).to.not.exist;
            expect(enchant.CanvasLayer._attachCache.called).to.be.false;
            scene._layers.Canvas.dispatchEvent(e);
            expect(node._cvsCache).to.exist;
            expect(enchant.CanvasLayer._attachCache.called).to.be.true;
            enchant.CanvasLayer._attachCache.restore();
        });

        it('calls CanvasRenderer#render to render added node', function(){
            sinon.spy(enchant.CanvasRenderer.instance, 'render');
            expect(enchant.CanvasRenderer.instance.render.called).to.be.false;
            scene._layers.Canvas.dispatchEvent(e);
            expect(enchant.CanvasRenderer.instance.render.called).to.be.true;
            enchant.CanvasRenderer.instance.render.restore();
        });
    });

    describe('#__onchildremoved', function(){
        it('removes _cvsCache from deleted node', function(){
            var scene = new CanvasScene(),
                e = new enchant.Event('childremoved'),
                node = new Node();
            sinon.spy(enchant.CanvasLayer, '_detachCache');
            e.node = node;
            e.target = scene._layers.Canvas;
            scene.addChild(node);
            expect(node._cvsCache).to.exist;
            expect(enchant.CanvasLayer._detachCache.called).to.be.false;
            scene._layers.Canvas.dispatchEvent(e);
            expect(node._cvsCache).to.not.exist;
            expect(enchant.CanvasLayer._detachCache.called).to.be.true;
            enchant.CanvasLayer._detachCache.restore();
        });
    });

    describe('width', function(){
        var cl;
        before(function(){
            cl = new CanvasLayer();
        });

        it('returns current width', function(){
            expect(cl.width).to.equal(320);
        });

        it('sets new width', function(){
            expect(cl._width).to.equal(320);
            expect(cl._element.width).to.equal(320);
            expect(cl._detect.width).to.equal(320);
            cl.width = 10;
            expect(cl._width).to.equal(10);
            expect(cl._element.width).to.equal(10);
            expect(cl._detect.width).to.equal(10);
        });
    });

    describe('height', function(){
        var cl;
        before(function(){
            cl = new CanvasLayer();
        });

        it('returns current heidht', function(){
            expect(cl.height).to.equal(320);
        });

        it('sets new height', function(){
            expect(cl._height).to.equal(320);
            expect(cl._element.height).to.equal(320);
            expect(cl._detect.height).to.equal(320);
            cl.height = 10;
            expect(cl._height).to.equal(10);
            expect(cl._element.height).to.equal(10);
            expect(cl._detect.height).to.equal(10);
        });
    });

    describe('#addChild', function(){
        var scene;
        before(function(){
            scene = new CanvasScene();
        });

        it('adds given node to its childnodes array', function(){
            var node = new Node();
            expect(scene._layers.Canvas.childNodes).to.have.length(0);
            scene._layers.Canvas.addChild(node);
            expect(scene._layers.Canvas.childNodes).to.have.length(1);
        });

        it('sets parent node to given node', function(){
            var node = new Node();
            expect(node.parentNode).to.be.null;
            scene._layers.Canvas.addChild(node);
            expect(node.parentNode).to.equal(scene._layers.Canvas);
        });

        it('dispatches childadded event from it', function(){
            var node = new Node(),
                spy = sinon.spy();
            scene._layers.Canvas.addEventListener('childadded', spy);
            expect(spy.called).to.be.false;
            scene._layers.Canvas.addChild(node);
            expect(spy.callCount).to.equal(1);
            expect(spy.args[0][0].node).to.equal(node);
            expect(spy.args[0][0].next).to.be.null;
        });

        it('dispatches added event from given node', function(){
            var node = new Node(),
                spy = sinon.spy();
            node.addEventListener('added', spy);
            expect(spy.called).to.be.false;
            scene._layers.Canvas.addChild(node);
            expect(spy.callCount).to.equal(1);
        });

        it('does not have this.scene, so given node never dispatches addedtoscene event', function(){
            var node = new Node(),
                spy1 = sinon.spy();
            sinon.spy(scene, 'addChild');
            node.addEventListener('addedtoscene', spy1);
            expect(scene._layers.Canvas.scene).to.not.exist;
            expect(scene._layers.Canvas._scene).to.exist;
            expect(node.scene).to.be.null;
            expect(spy1.called).to.be.false;
            expect(scene.addChild.called).to.be.false;
            scene._layers.Canvas.addChild(node);
            expect(spy1.called, 'call CanvasLayer#addChild').to.be.false;
            expect(node.scene).to.be.null;
            scene._layers.Canvas.removeChild(node);
            sinon.spy(scene._layers.Canvas, 'addChild');
            expect(scene._layers.Canvas.addChild.called).to.be.false;
            expect(scene.addChild.called).to.be.false;
            scene.addChild(node);
            expect(spy1.called, 'call Group#addChild').to.be.true;
            expect(scene._layers.Canvas.addChild.called).to.be.true;
            expect(scene.addChild.called).to.be.true;
            expect(node.scene).to.equal(scene);
            scene.addChild.restore();
            scene._layers.Canvas.addChild.restore();
        });
    });

    describe('#insertBefore', function(){
        var scene, node1;
        beforeEach(function(){
            scene = new CanvasScene();
            node1 = new Node();
            scene._layers.Canvas.addChild(node1);
        });

        it('calls #addChild if given reference was not found in childnodes array', function(){
            scene = new CanvasScene();
            sinon.spy(scene._layers.Canvas, 'addChild');
            var node = new Node();
            expect(scene._layers.Canvas.childNodes).to.have.length(0);
            scene._layers.Canvas.insertBefore(node, null);
            expect(scene._layers.Canvas.addChild.called).to.be.true;
            expect(scene._layers.Canvas.childNodes).to.have.length(1);
            scene._layers.Canvas.addChild.restore();
        });

        it('adds given node to childnodes array before the given reference', function(){
            var node2 = new Node();
            expect(scene._layers.Canvas.childNodes).to.have.length(1);
            expect(scene._layers.Canvas.childNodes[0]).to.equal(node1);
            scene._layers.Canvas.insertBefore(node2, node1);
            expect(scene._layers.Canvas.childNodes).to.have.length(2);
            expect(scene._layers.Canvas.childNodes[0]).to.equal(node2);
            expect(scene._layers.Canvas.childNodes[1]).to.equal(node1);
        });

        it('dispatches childadded event from it', function(){
            var node2 = new Node(),
                spy = sinon.spy();
            scene._layers.Canvas.addEventListener('childadded', spy);
            expect(spy.called).to.be.false;
            scene._layers.Canvas.insertBefore(node2, node1);
            expect(spy.callCount).to.equal(1);
            expect(spy.args[0][0].node).to.equal(node2);
            expect(spy.args[0][0].next).to.equal(node1);
        });

        it('dispatches added event from given node', function(){
            var node2 = new Node(),
                spy = sinon.spy();
            node2.addEventListener('added', spy);
            expect(spy.called).to.be.false;
            scene._layers.Canvas.insertBefore(node2, node1);
            expect(spy.callCount).to.equal(1);
        });

        it('does not have this.scene, so given node never dispatches addedtoscene event', function(){
            var node2 = new Node(),
                spy = sinon.spy();
            node2.addEventListener('addedtoscene', spy);
            sinon.spy(scene, 'insertBefore');
            expect(scene._layers.Canvas.scene).to.not.exist;
            expect(scene._layers.Canvas._scene).to.exist;
            expect(spy.called).to.be.false;
            expect(node2.scene).to.be.null;
            expect(scene.insertBefore.called).to.be.false;
            scene._layers.Canvas.insertBefore(node2, node1);
            expect(spy.called, 'called CanvasLayer#insertBefore').to.be.false;
            expect(scene.insertBefore.called).to.be.false;
            expect(node2.scene).to.be.null;
            scene._layers.Canvas.removeChild(node2);
            sinon.spy(scene._layers.Canvas, 'insertBefore');
            expect(scene._layers.Canvas.insertBefore.called).to.be.false;
            scene.insertBefore(node2, node1);
            expect(spy.called, 'called #Group.insertBefoer').to.be.true;
            expect(scene.insertBefore.called).to.be.true;
            expect(scene._layers.Canvas.insertBefore.called).to.be.true;
            expect(node2.scene).to.equal(scene);
            scene.insertBefore.restore();
            scene._layers.Canvas.insertBefore.restore();
        });
    });

    describe('#_startRendering', function(){
        var cl;
        beforeEach(function(){
            cl = new CanvasLayer();
            sinon.spy(cl, '_onexitframe');
        });

        afterEach(function(){
            cl._onexitframe.restore();
        });

        it('calls #_onexitframe when it called', function(){
            expect(cl._onexitframe.called).to.be.false;
            cl._startRendering();
            expect(cl._onexitframe.called).to.be.true;
        });

        it('calls _onexitframe when exitframe event occurred', function(){
            cl._startRendering();
            expect(cl._onexitframe.callCount).to.equal(1);
            cl.dispatchEvent(new enchant.Event(enchant.Event.EXIT_FRAME));
            expect(cl._onexitframe.callCount).to.equal(2);
        });
    });

    describe('#_stopRendering', function(){
        var cl;
        beforeEach(function(){
            cl = new CanvasLayer();
            sinon.spy(cl, '_onexitframe');
        });

        afterEach(function(){
            cl._onexitframe.restore();
        });

        it('calls #_onexitframe when int called', function(){
            expect(cl._onexitframe.called).to.be.false;
            cl._stopRendering();
            expect(cl._onexitframe.called).to.be.true;
        });

        it.skip('removes eventlistener. This test is pending because of issue #277');
    });

    describe('#_onexitframe', function(){
        var cl;
        beforeEach(function(){
            cl = new CanvasLayer();
        });

        it('calls CanvasRenderer#render', function(){
            sinon.spy(enchant.CanvasRenderer.instance, 'render');
            expect(enchant.CanvasRenderer.instance.render.called).to.be.false;
            cl._onexitframe();
            expect(enchant.CanvasRenderer.instance.render.called).to.be.true;
            enchant.CanvasRenderer.instance.render.restore();
        });

        it('clears canvas', function(){
            var ctx = cl.context;
            ctx.fillStyle = 'rgb(255, 0, 0)';
            ctx.fillRect(0, 0, cl.width, cl.height);
            var sample = ctx.getImageData(100, 100, 1, 1).data;
            expect(sample[0]).to.equal(255);
            expect(sample[1]).to.equal(0);
            expect(sample[2]).to.equal(0);
            expect(sample[3]).to.equal(255);
            cl._onexitframe();
            sample = ctx.getImageData(100, 100, 1, 1).data;
            expect(sample[0]).to.equal(0);
            expect(sample[1]).to.equal(0);
            expect(sample[2]).to.equal(0);
            expect(sample[3]).to.equal(0);
        });
    });

    describe('#_determineEventTarget', function(){
        it('calls #_getEntityByPosition', function(){
            var cl = new CanvasLayer();
            sinon.spy(cl, '_getEntityByPosition');
            var e = new enchant.Event('touchstart');
            e.x = 100; e.y = 100;
            expect(cl._getEntityByPosition.called).to.be.false;
            cl._determineEventTarget(e);
            expect(cl._getEntityByPosition.called).to.be.true;
            expect(cl._getEntityByPosition.calledWith(e.x, e.y)).to.be.true;
            cl._getEntityByPosition.restore();
        });
    });

    describe('#_getEntityByPosition', function(){
        var scene, sprite;
        beforeEach(function(){
            core = new Core();
            scene = new CanvasScene();
            sprite = new Sprite(100, 100);
            sprite.x = 0; sprite.y = 0;
            scene.addChild(sprite);
        });

        it('updates _lastDetected', function(){
            expect(scene._layers.Canvas._lastDetected).to.equal(0);
            scene._layers.Canvas._getEntityByPosition(1, 1);
            expect(scene._layers.Canvas._lastDetected).to.equal(0);
            core.frame++;
            scene._layers.Canvas._getEntityByPosition(1, 1);
            expect(scene._layers.Canvas._lastDetected).to.equal(1);
        });

        it('redraws detect canvas by calling CanvasRenderer#detectRender', function(){
            sinon.spy(enchant.CanvasRenderer.instance, 'detectRender');
            scene._layers.Canvas._getEntityByPosition(1, 1);
            expect(enchant.CanvasRenderer.instance.detectRender.called).to.be.false;
            core.frame++;
            scene._layers.Canvas._getEntityByPosition(1, 1);
            expect(enchant.CanvasRenderer.instance.detectRender.calledWith(scene._layers.Canvas._dctx, scene._layers.Canvas)).to.be.true;
            enchant.CanvasRenderer.instance.detectRender.restore();
        });

        it('returns the node by calling DetectColorManager#getSpriteByColors', function(){
            sinon.spy(scene._layers.Canvas._colorManager, 'getSpriteByColors');
            expect(scene._layers.Canvas._colorManager.getSpriteByColors.called).to.be.false;
            core.frame++;
            var ret = scene._layers.Canvas._getEntityByPosition(1, 1);
            var color = scene._layers.Canvas._dctx.getImageData(0, 0, 3, 3).data;
            expect(scene._layers.Canvas._colorManager.getSpriteByColors.calledWith(color)).to.be.true;
            expect(ret).to.equal(sprite);
            scene._layers.Canvas._colorManager.getSpriteByColors.restore();
        });

        it('uses enchant.ENV.COLOR_DETECTION_LEVEL', function(){
            var ret, color;
            sinon.spy(scene._layers.Canvas._colorManager, 'getSpriteByColors');
            core.frame++;
            enchant.ENV.COLOR_DETECTION_LEVEL = 1;
            ret = scene._layers.Canvas._getEntityByPosition(2, 2);
            color = scene._layers.Canvas._dctx.getImageData(2, 2, 1, 1).data;
            expect(scene._layers.Canvas._colorManager.getSpriteByColors.calledWith(color)).to.be.true;
            enchant.ENV.COLOR_DETECTION_LEVEL = 3;
            ret = scene._layers.Canvas._getEntityByPosition(2, 2);
            color = scene._layers.Canvas._dctx.getImageData(0, 0, 5, 5).data;
            expect(scene._layers.Canvas._colorManager.getSpriteByColors.calledWith(color)).to.be.true;
        });
    });

    describe('enchant.CanvasLayer._attachCache', function(){
        var cl;
        beforeEach(function(){
            cl = new CanvasLayer();
        });

        it('sets _cvsCache if it does not exist on given node', function(){
            var node = new Node();
            expect(node._cvsCache).to.not.exist;
            enchant.CanvasLayer._attachCache(node, cl, function(){}, function(){});
            expect(node._cvsCache).to.exist;
            expect(node._cvsCache.matrix).to.deep.equal([1, 0, 0, 1, 0, 0]);
            expect(node._cvsCache.detectColor).to.equal('rgba(0,0,16,1)');
        });

        it('attaces event listeners to given node', function(){
            var node = new Node(),
                spy_childadded = sinon.spy(),
                spy_childremoved = sinon.spy();
            enchant.CanvasLayer._attachCache(node, cl, spy_childadded, spy_childremoved);
            expect(spy_childadded.called).to.be.false;
            expect(spy_childremoved.called).to.be.false;
            node.dispatchEvent(new enchant.Event('childadded'));
            expect(spy_childadded.called).to.be.true;
            node.dispatchEvent(new enchant.Event('childremoved'));
            expect(spy_childremoved.called).to.be.true;
        });

        it('attaches _cvsCache to given node\'s children if children exist', function(){
            var group = new Group(),
                node = new Node();
            group.addChild(node);
            expect(group._cvsCache).to.not.exist;
            expect(node._cvsCache).to.not.exist;
            enchant.CanvasLayer._attachCache(group, cl, function(){}, function(){});
            expect(group._cvsCache).to.exist;
            expect(node._cvsCache).to.exist;
        });
    });

    describe('enchant.CanvasLayer._detachCache', function(){
        var cl;
        beforeEach(function(){
            cl = new CanvasLayer();
        });

        it('deletes _cvsCache from given node', function(){
            var node = new Node();
            enchant.CanvasLayer._attachCache(node, cl, function(){}, function(){});
            expect(node._cvsCache).to.exist;
            enchant.CanvasLayer._detachCache(node, cl, function(){}, function(){});
            expect(node._cvsCache).to.not.exist;
        });

        it('removes event listeners from given node', function(){
            var node = new Node(),
                spy_childadded = sinon.spy(),
                spy_childremoved = sinon.spy();
            enchant.CanvasLayer._attachCache(node, cl, spy_childadded, spy_childremoved);
            node.dispatchEvent(new enchant.Event('childadded'));
            expect(spy_childadded.callCount).to.equal(1);
            node.dispatchEvent(new enchant.Event('childremoved'));
            expect(spy_childremoved.callCount).to.equal(1);
            enchant.CanvasLayer._detachCache(node, cl, spy_childadded, spy_childremoved);
            node.dispatchEvent(new enchant.Event('childadded'));
            expect(spy_childadded.callCount).to.equal(1);
            node.dispatchEvent(new enchant.Event('childremoved'));
            expect(spy_childremoved.callCount).to.equal(1);
        });

        it('removes _cvsCache from given node\'s children if children exist', function(){
            var group = new Group(),
                node = new Node();
            group.addChild(node);
            enchant.CanvasLayer._attachCache(group, cl, function(){}, function(){});
            expect(group._cvsCache).to.exist;
            expect(node._cvsCache).to.exist;
            enchant.CanvasLayer._detachCache(group, cl, function(){}, function(){});
            expect(group._cvsCache).to.not.exist;
            expect(node._cvsCache).to.not.exist;
        });
    });
});