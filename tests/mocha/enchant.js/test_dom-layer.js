describe('DomLayer', function(){
    var core, domLayer;

    before(function(){
        enchant();
    });

    beforeEach(function(){
        core = new Core();
        domLayer = new DomLayer();
    });

    it('is an instance of enchant.Group', function(){
        expect(domLayer).to.be.an.instanceof(enchant.Group);
    });

    describe('#initialize', function(){
        it('sets width to core.width value', function(){
            expect(domLayer.width).to.equal(core.width);
            expect(domLayer.width, 'compare with default width of core').to.equal(320);
            core = new Core(1, 1);
            domLayer = new DomLayer();
            expect(domLayer.width).to.equal(1);
        });

        it('sets height to core.height value', function(){
            expect(domLayer.height).to.equal(core.height);
            expect(domLayer.height, 'compare with default height of core').to.equal(320);
            core = new Core(1,1);
            domLayer = new DomLayer();
            expect(domLayer.height).to.equal(1);
        });

        it('calls enchant.DomLayer._attachDomManager when childadded event occured', function(){
            sinon.spy(enchant.DomLayer, '_attachDomManager');
            var scene = new DOMScene(),
                node = new Node();
            expect(enchant.DomLayer._attachDomManager.called).to.be.false;
            scene.addChild(node);
            expect(enchant.DomLayer._attachDomManager.called).to.be.true;
            enchant.DomLayer._attachDomManager.restore();
        });

        it('calls enchant.DomLayer._detachDomManager when childremoved event occured', function(){
            sinon.spy(enchant.DomLayer, '_detachDomManager');
            var scene = new DOMScene(),
                node = new Node();
            scene.addChild(node);
            expect(enchant.DomLayer._detachDomManager.called).to.be.false;
            scene.removeChild(node);
            expect(enchant.DomLayer._detachDomManager.called).to.be.true;
            enchant.DomLayer._detachDomManager.restore();
        });
    });

    describe('width', function(){
        it('returns its width', function(){
            expect(domLayer.width).to.equal(320);
        });

        it('sets width', function(){
            expect(domLayer.width).to.equal(320);
            expect(domLayer._element.style.width).to.equal('320px');
            domLayer.width = 100;
            expect(domLayer.width).to.equal(100);
            expect(domLayer._element.style.width).to.equal('100px');
        });
    });

    describe('height', function(){
        it('returns height', function(){
            expect(domLayer.height).to.equal(320);
        });

        it('sets height', function(){
            expect(domLayer.height).to.equal(320);
            expect(domLayer._element.style.height).to.equal('320px');
            domLayer.height = 100;
            expect(domLayer.height).to.equal(100);
            expect(domLayer._element.style.height).to.equal('100px');
        });
    });

    describe('#addChild', function(){
        it('adds given node to its array', function(){
            expect(domLayer.childNodes).to.have.length(0);
            var node = new Node();
            domLayer.addChild(node);
            expect(domLayer.childNodes).to.have.length(1);
        });

        it('dispatches childadded event from DomLayer', function(done){
            var node = new Node();
            domLayer.addEventListener('childadded', function(e){
                expect(e.node).to.equal(node);
                expect(e.next).to.be.null;
                done();
            });
            domLayer.addChild(node);
        });

        it('dispatches added event from given node', function(){
            var node = new Node();
            var spy = sinon.spy();
            node.addEventListener('added', spy);
            expect(spy.called).to.be.false;
            domLayer.addChild(node);
            expect(spy.called).to.be.true;
        });
    });

    describe('#insertBefore', function(){
        var node1, node2, node3;

        beforeEach(function(){
            node1 = new Node();
            node2 = new Node();
            node3 = new Node();
            domLayer.addChild(node1);
            domLayer.addChild(node2);
        });

        it('inserts new noe into before given node', function(){
            expect(domLayer.childNodes[0]).to.equal(node1);
            expect(domLayer.childNodes[1]).to.equal(node2);
            expect(node3.parentNode).to.be.null;
            domLayer.insertBefore(node3, node2);
            expect(domLayer.childNodes[0]).to.equal(node1);
            expect(domLayer.childNodes[1]).to.equal(node3);
            expect(domLayer.childNodes[2]).to.equal(node2);
            expect(node3.parentNode).to.equal(domLayer);
        });

        it('add given node to end of childNodes when reference node is not found', function(){
            var node4 = new Node();
            expect(domLayer.childNodes).to.not.include(node4);
            domLayer.insertBefore(node3, node4);
            expect(domLayer.childNodes).to.have.length(3);
            expect(domLayer.childNodes[2]).to.equal(node3);
        });

        it('dispatches childadded event from DomLayer', function(done){
            domLayer.addEventListener('childadded', function(e){
                expect(e.node).to.equal(node3);
                expect(e.next).to.equal(node2);
                done();
            });
            domLayer.insertBefore(node3, node2);
        });

        it('dispatches added event from given new node', function(){
            var spy = sinon.spy();
            node3.addEventListener('added', spy);
            expect(spy.called).to.be.false;
            domLayer.insertBefore(node3, node2);
            expect(spy.called).to.be.true;
        });
    });

    describe('#_startRendering', function(){
        it('calls #_onexitframe function', function(){
            sinon.spy(domLayer, '_onexitframe');
            expect(domLayer._onexitframe.called).to.be.false;
            domLayer._startRendering();
            expect(domLayer._onexitframe.called).to.be.true;
            domLayer._onexitframe.restore();
        });

        it('sets event listener to DomLayer', function(){
            sinon.spy(domLayer, '_onexitframe');
            domLayer._startRendering();
            expect(domLayer._onexitframe.callCount).to.equal(1);
            domLayer.dispatchEvent(new enchant.Event('exitframe'));
            expect(domLayer._onexitframe.callCount).to.equal(2);
            domLayer._onexitframe.restore();
        });
    });

    describe('#_stopRendering', function(){
         it('calls #_onexitframe function', function(){
            sinon.spy(domLayer, '_onexitframe');
            expect(domLayer._onexitframe.called).to.be.false;
            domLayer._stopRendering();
            expect(domLayer._onexitframe.called).to.be.true;
            domLayer._onexitframe.restore();
        });

        it('removes event listener from DomLayer', function(){
            sinon.spy(domLayer, '_onexitframe');
            domLayer._startRendering();
            expect(domLayer._onexitframe.callCount).to.equal(1);
            domLayer._stopRendering();
            expect(domLayer._onexitframe.callCount).to.equal(2);
            domLayer.dispatchEvent(new enchant.Event('exitframe'));
            expect(domLayer._onexitframe.callCount).to.equal(2);
            domLayer._onexitframe.restore();
        });
    });

    describe('#_onexitframe', function(){
        it('calls #_rendering', function(){
            sinon.spy(domLayer, '_rendering');
            expect(domLayer._rendering.called).to.be.false;
            domLayer._onexitframe();
            expect(domLayer._rendering.called).to.be.true;
            domLayer._rendering.restore();
        });
    });

    describe('#_rendering', function(){
        it('dispatches given event from given node', function(){
            var root = new DOMScene(),
                node = new Node();
            var spy = sinon.spy();
            node.addEventListener(enchant.Event.RENDER, spy);
            expect(spy.called).to.be.false;
            root.addChild(node); // it calles _render when child node added
            expect(spy.called).to.be.true;
        });
    });

    describe('#_determineEventTarget', function(){
        it('returns event target', function(){
            var scene = new DOMScene(),
                node = new Node();
            scene.addChild(node);
            var evt = document.createEvent('MouseEvents');
            evt.initMouseEvent("mousedown", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
            scene._layers['Dom']._domManager.element.dispatchEvent(evt);
            expect(scene._layers['Dom']._touchEventTarget).to.equal(scene._layers['Dom']);
            expect(scene._layers['Dom']._determineEventTarget(), 'in case target and domManager are same').to.be.null;
            node._domManager.element.dispatchEvent(evt);
            expect(node._domManager.layer._determineEventTarget()).to.equal(node);
        });
    });

    describe('enchant.DomLayer._attachDomManager', function(){
        it('attaches event listeners to given node', function(){
            var onchildadded = sinon.spy(),
                onchildremoved = sinon.spy();
            var node = new Node();
            enchant.DomLayer._attachDomManager(node, onchildadded, onchildremoved);
            expect(onchildadded.called).to.be.false;
            node.dispatchEvent(new enchant.Event('childadded'));
            expect(onchildadded.called).to.be.true;
            expect(onchildremoved.called).to.be.false;
            node.dispatchEvent(new enchant.Event('childremoved'));
            expect(onchildremoved.called).to.be.true;
        });

        it('attaches DomlessManager to given node when node is an instanceof enchant.Group', function(){
            var group = new Group();
            expect(group).to.be.an.instanceof(enchant.Group);
            enchant.DomLayer._attachDomManager(group, function(){}, function(){});
            expect(group._domManager).to.be.an.instanceof(DomlessManager);
        });

        it('attaches DomManager to given node when node is not an instanceof enchant.Group', function(){
            var nodeWithoutElement = new Node();
            expect(nodeWithoutElement).to.be.not.an.instanceof(enchant.Group);
            enchant.DomLayer._attachDomManager(nodeWithoutElement, function(){}, function(){});
            expect(nodeWithoutElement._domManager).to.be.an.instanceof(DomManager);
            expect(nodeWithoutElement._domManager.getDomElement().tagName, 'given node has no element, so this function automatically add element')
                .to.equal('DIV');
            var nodeWithElement = new Node();
            nodeWithElement._element = document.createElement('article');
            expect(nodeWithElement).to.be.not.an.instanceof(enchant.Group);
            enchant.DomLayer._attachDomManager(nodeWithElement, function(){}, function(){});
            expect(nodeWithElement._domManager).to.be.an.instanceof(DomManager);
            expect(nodeWithElement._domManager.getDomElement().tagName).to.equal('ARTICLE');
        });

        it('attaches DomManager to given node\'s children', function(){
            var parentNode = new Group(),
                child1 = new Node(),
                child2 = new Node();
            parentNode.addChild(child1);
            parentNode.addChild(child2);
            expect(child1._domManager).to.not.exist;
            expect(child2._domManager).to.not.exist;
            enchant.DomLayer._attachDomManager(parentNode, function(){}, function(){});
            expect(child1._domManager).to.be.an.instanceof(DomManager);
            expect(child2._domManager).to.be.an.instanceof(DomManager);
        });
    });

    describe('enchant.DomLayer._detachDomManager', function(){
        it('removes event listeners from given node', function(){
            var onchildadded = sinon.spy(),
                onchildremoved = sinon.spy();
            var node = new Node();
            enchant.DomLayer._attachDomManager(node, onchildadded, onchildremoved);
            node.dispatchEvent(new enchant.Event('childadded'));
            node.dispatchEvent(new enchant.Event('childremoved'));
            expect(onchildadded.callCount).to.equal(1);
            expect(onchildremoved.callCount).to.equal(1);
            enchant.DomLayer._detachDomManager(node, onchildadded, onchildremoved);
            node.dispatchEvent(new enchant.Event('childadded'));
            node.dispatchEvent(new enchant.Event('childremoved'));
            expect(onchildadded.callCount).to.equal(1);
            expect(onchildremoved.callCount).to.equal(1);
        });

        it('removes DomManager from given node', function(){
            var node = new Node();
            enchant.DomLayer._attachDomManager(node, function(){}, function(){});
            expect(node._domManager).to.exist;
            enchant.DomLayer._detachDomManager(node, function(){}, function(){});
            expect(node._domManager).to.not.exist;
        });

        it('removes DomManager from given node\'s children', function(){
            var parent = new DOMScene(),
                child1 = new Node(),
                child2 = new Node();
            sinon.spy(enchant.DomLayer, '_detachDomManager');
            parent.addChild(child1);
            parent.addChild(child2);
            expect(child1._domManager).to.exist;
            expect(child1._domManager).to.be.an.instanceof(DomManager);
            expect(child2._domManager).to.exist;
            expect(child2._domManager).to.be.an.instanceof(DomManager);
            expect(enchant.DomLayer._detachDomManager.called).to.be.false;
            parent.removeChild(child1); // this calls _detachDomManager
            expect(enchant.DomLayer._detachDomManager.called).to.be.true;
            expect(child1._domManager).to.not.exist;
            expect(child2._domManager).to.exist;
            enchant.DomLayer._detachDomManager.restore();
        });
    });
});
