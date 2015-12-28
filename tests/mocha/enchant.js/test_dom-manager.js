describe('DomManager', function(){
    var core;

    before(function(){
        enchant();
        core = new Core();
    });

    describe('#initialize', function(){
        it('initializes with default values', function(){
            var div = document.createElement('div');
            var node = new Node();
            var domManager = new DomManager(node, div);
            expect(domManager.layer).to.be.null;
            expect(domManager.targetNode).to.equal(node);
            expect(domManager.element).to.equal(div);
            expect(domManager.style).to.equal(div.style);
            expect(domManager.style.position).to.equal('absolute');
            expect(domManager.style[enchant.ENV.VENDOR_PREFIX + 'TransformOrigin']).to.equal('0px 0px');
        });

        it('sets debug style when running with debug mode', function(){
            core.debug();
            var domManager = new DomManager(new Node(), 'div');
            expect(domManager.style.border).to.equal('1px solid blue');
            expect(domManager.style.margin).to.equal('-1px');
        });

        it('creates DOM element with given string', function(){
            var domManager = new DomManager(new Node(), 'div');
            expect(domManager.element).is.an.instanceof(HTMLDivElement);
            expect(domManager.element.tagName).to.equal('DIV');
        });
    });

    describe('#getDomElement', function(){
        it('returns its element', function(){
            var div = document.createElement('div');
            var domManager = new DomManager(new Node(), div);
            expect(domManager.getDomElement()).to.equal(div);
        });
    });

    describe('#getDomElementAsNext', function(){
        it('returns its element', function(){
            var div = document.createElement('div');
            var domManager = new DomManager(new Node(), div);
            expect(domManager.getDomElementAsNext()).to.equal(div);
        });
    });

    describe('#getNextManager', function(){
        it('returns null when next node does not exist', function(){
            var scene = new DOMScene(),
                child = new Node();
            scene.addChild(child);
            expect(child._domManager.getNextManager(child._domManager)).to.be.null;
        });

        it('returns given domManager\'s next sibling\'s domManager', function(){
            var scene = new DOMScene(),
                child1 = new Node(),
                child2 = new Node();
            scene.addChild(child1);
            scene.addChild(child2);
            expect(child1._domManager.getNextManager(child1._domManager)).to.equal(child2._domManager);
        });
    });

    describe('#addManager', function(){
        it('adds given childManager\'s DOM element to its element', function(){
            var node = new Node(),
                child1 = new Node();
            enchant.DomLayer._attachDomManager(node, function(){}, function(){});
            var expected = node._domManager.getDomElement();
            enchant.DomLayer._attachDomManager(child1, function(){}, function(){});
            var child1Element = child1._domManager.getDomElement();
            expected.appendChild(child1Element);
            node._domManager.addManager(child1._domManager, null);
            expect(node._domManager.element, 'in case nextManager is null').to.equal(expected);
            var child2 = new Node();
            enchant.DomLayer._attachDomManager(child2, function(){}, function(){});
            expected.insertBefore(child2._domManager.getDomElement(), child1Element);
            node._domManager.addManager(child2._domManager, child1._domManager);
            expect(node._domManager.element, 'in case nextManager is not null').to.equal(expected);
        });

        it('adds given childManager\'s DOM element to its element in case given childmanager is a DomlessManager', function(){
            var node = new Node(),
                group = new Group(),
                child = new Node();
            DomLayer._attachDomManager(node, function(){}, function(){});
            group.addChild(child);
            DomLayer._attachDomManager(group, function(){}, function(){});
            expect(group._domManager).to.be.an.instanceof(DomlessManager);
            var expected = node._domManager.element.outerHTML;
            expected = expected.replace(/></, '>' + group._domManager._domRef[0].outerHTML + '<');
            node._domManager.addManager(group._domManager, null);
            expect(node._domManager.element.outerHTML, 'in case nextManager is null').to.equal(expected);
            node = new Node();
            var node2 = new Node();
            DomLayer._attachDomManager(node, function(){}, function(){});
            DomLayer._attachDomManager(node2, function(){}, function(){});
            node._domManager.addManager(node2._domManager, null);
            expected = node._domManager.element.outerHTML;
            expected = expected.replace(/></, '>' + group._domManager._domRef[0].outerHTML + '<');
            node._domManager.addManager(group._domManager, node2._domManager);
            expect(node._domManager.element.outerHTML, 'in case nextManager given').to.equal(expected);
        });
    });

    describe('#removeManager', function(){
        it('removes given DomManger\'s element in case given dommanager is an instanceof DomManager', function(){
            var node = new Node(),
                child1 = new Node();
            enchant.DomLayer._attachDomManager(node, function(){}, function(){});
            enchant.DomLayer._attachDomManager(child1, function(){}, function(){});
            node._domManager.addManager(child1._domManager, null);
            expect(node._domManager.getDomElement().childNodes).to.have.length(1);
            node._domManager.removeManager(child1._domManager);
            expect(node._domManager.getDomElement().childNodes).to.have.length(0);
        });

        it('removes given DomManger\'s element in case given dommanager is an instanceof DomlessManager', function(){
            var node = new Node(),
                child1 = new Node(),
                group = new Group(),
                child2 = new Node();
            DomLayer._attachDomManager(node, function(){}, function(){});
            DomLayer._attachDomManager(child1, function(){}, function(){});
            node._domManager.addManager(child1._domManager);
            group.addChild(child2);
            DomLayer._attachDomManager(group, function(){}, function(){});
            var expected = node._domManager.element.outerHTML;
            node._domManager.addManager(group._domManager, child1._domManager);
            expect(node._domManager.element.outerHTML).to.not.equal(expected);
            node._domManager.removeManager(group._domManager);
            expect(node._domManager.element.outerHTML).to.equal(expected);
        });
    });

    describe('#setLayer', function(){
        it('sets layer', function(){
            var domManager = new DomManager(new Node(), 'div');
            var domLayer = new DomLayer();
            domManager.setLayer(domLayer);
            expect(domManager.layer).to.equal(domLayer);
        });

        it('sets layer to given node\'s children', function(){
            var scene = new DOMScene();
            var child1 = new Node(),
                child2 = new Node();
            scene.addChild(child1);
            scene.addChild(child2);
            expect(child1._domManager.layer).to.equal(scene._layers['Dom']);
            expect(child2._domManager.layer).to.equal(scene._layers['Dom']);
        });
    });

    describe('#render', function(){
        it('sets transoform matrix', function(){
            var scene = DOMScene();
            var label = new Label('test');
            scene.addChild(label);
            label._domManager.render([1, 0, 0, 1, 0, 0]);
            expect(label._domManager.style[enchant.ENV.VENDOR_PREFIX + 'Transform']).to.equal('matrix(1, 0, 0, 1, 0, 0)');
            label.rotate(90);
            label._domManager.render([1, 0, 0, 1, 0, 0]);
            expect(label._domManager.style[enchant.ENV.VENDOR_PREFIX + 'Transform']).to.equal('matrix(0, 1, -1, 0, 150, -150)');
            label.rotate(-90);
            label.x = 10;
            label.y = 10;
            label._domManager.render([1, 0, 0, 1, 0, 0]);
            expect(label._domManager.style[enchant.ENV.VENDOR_PREFIX + 'Transform']).to.equal('matrix(1, 0, 0, 1, 10, 10)');
            label.x = 0;
            label.y = 0;
            label.scale(2);
            label._domManager.render([1, 0, 0, 1, 0, 0]);
            expect(label._domManager.style[enchant.ENV.VENDOR_PREFIX + 'Transform']).to.equal('matrix(2, 0, 0, 2, -150, 0)');
        });
    });

    describe('#domRender', function(){
        var node;

        beforeEach(function(){
            node = new Node();
            DomLayer._attachDomManager(node, function(){}, function(){});
        });

        it('adds _style property if it is not exist', function(){
            expect(node._domManager.targetNode._style).to.be.undefined;
            node._domManager.domRender();
            expect(node._domManager.targetNode._style).to.exist;
        });

        it('sets __styleStatus property if it is not exist', function(){
            expect(node._domManager.targetNode.__styleStatus).to.be.undefined;
            node._domManager.domRender();
            expect(node._domManager.targetNode.__styleStatus).to.exist;
        });

        it('sets width and height to its _style property if they are not null', function(){
            node.width = 32;
            node.height = 32;
            node._domManager.domRender();
            expect(node._domManager.targetNode._style.width).to.equal('32px');
            expect(node._domManager.targetNode._style.height).to.equal('32px');
        });

        it('sets its targetNode opacity to its _style property', function(){
            expect(node._opacity).to.be.undefined;
            node._domManager.domRender();
            expect(node._domManager.targetNode._style.opacity).to.be.undefined;
            node._opacity = 1;
            node._domManager.domRender();
            expect(node._domManager.targetNode._style.opacity).to.equal(1);
        });

        it('sets its targetNode background color to its _style property', function(){
            expect(node._backgroundColor).to.be.undefined;
            node._domManager.domRender();
            expect(node._domManager.targetNode._style['background-color']).to.be.undefined;
            node._backgroundColor = '#112233';
            node._domManager.domRender();
            expect(node._domManager.targetNode._style['background-color']).to.equal('#112233');
        });

        it('sets display property to its _style if its targetNode has _visible property', function(){
            expect(node._visible).to.be.undefined;
            node._domManager.domRender();
            expect(node._domManager.targetNode._style.display).to.be.undefined;
            node._visible = true;
            node._domManager.domRender();
            expect(node._domManager.targetNode._style.display).to.equal('block');
            node._visible = false;
            node._domManager.domRender();
            expect(node._domManager.targetNode._style.display).to.equal('none');
        });

        it('calls its targetNode domRender function if its exist', function(){
            var label = new Label('test');
            sinon.spy(label, 'domRender');
            DomLayer._attachDomManager(label, function(){}, function(){});
            expect(label.domRender.callCount).to.equal(0);
            label._domManager.domRender();
            expect(label.domRender.callCount).to.equal(1);
            label.domRender.restore();
        });

        it('renders with its _style property', function(){
            node.width = 32;
            node.height = 64;
            node._opacity = 1;
            node._backgroundColor = '#112233';
            node._domManager.domRender();
            expect(node._domManager.style.width).to.equal('32px');
            expect(node._domManager.targetNode.__styleStatus['width']).to.equal('32px');
            expect(node._domManager.style.height).to.equal('64px');
            expect(node._domManager.targetNode.__styleStatus['height']).to.equal('64px');
            expect(node._domManager.style.opacity).to.equal('1');
            expect(node._domManager.targetNode.__styleStatus['opacity']).to.equal(1);
            expect(node._domManager.style['background-color']).to.equal('rgb(17, 34, 51)');
            expect(node._domManager.targetNode.__styleStatus['background-color']).to.equal('#112233');
        });
    });

    describe('#remove', function(){
        it('removes its element', function(){
            var node = new Node();
            enchant.DomLayer._attachDomManager(node, function(){}, function(){});
            sinon.spy(node._domManager, '_detachEvent');
            expect(node._domManager.element).is.not.null;
            expect(node._domManager.style).is.not.null;
            expect(node._domManager.targetNode).is.not.null;
            expect(node._domManager._detachEvent.called).to.be.false;
            node._domManager.remove();
            expect(node._domManager._detachEvent.called).to.be.true;
            expect(node._domManager.element).to.be.null;
            expect(node._domManager.style).to.be.null;
            expect(node._domManager.targetNode).to.be.null;
            node._domManager._detachEvent.restore();
        });
    });
});

describe('DomlessManager', function(){
    describe('#initialize', function(){
        it('sets initial parameters', function(){
            var group = new Group();
            var domlessManager = new DomlessManager(group);
            expect(domlessManager._domRef).to.be.an.instanceof(Array);
            expect(domlessManager._domRef).to.have.length(0);
            expect(domlessManager.targetNode).to.equal(group);
        });
    });

    describe('#_register', function(){
        var group;

        beforeEach(function(){
            group = new Group();
            DomLayer._attachDomManager(group, function(){}, function(){});
        });

        it('adds given element to _domRef if given nextElement does not exist in _domRef and given element is not an array', function(){
            expect(group._domManager._domRef).to.have.length(0);
            var elem = document.createElement('div');
            group._domManager._register(elem, null);
            expect(group._domManager._domRef).to.have.length(1);
            expect(group._domManager._domRef[0]).to.equal(elem);
        });

        it('adds given element to _domRef if given nextElement exists and given element is not an array', function(){
            var node1 = new Node(),
                node2 = new Node();
            group.addChild(node1);
            group.addChild(node2);
            DomLayer._attachDomManager(group, function(){}, function(){});
            expect(group._domManager._domRef).to.have.length(2);
            var elem = document.createElement('div');
            group._domManager._register(elem, node2._domManager.getDomElementAsNext());
            expect(group._domManager._domRef).to.have.length(3);
            expect(group._domManager._domRef[1]).to.equal(elem);
            expect(group._domManager._domRef[2]).to.equal(node2._domManager.getDomElementAsNext());
        });

        it('adds given elements to _domRef if given elements is an array and given nextElement does not exist', function(){
            var elem1 = document.createElement('div'),
                elem2 = document.createElement('div');
            var arrElem = [elem1, elem2];
            expect(group._domManager._domRef).to.have.length(0);
            group._domManager._register(arrElem, null);
            expect(group._domManager._domRef).to.have.length(2);
            expect(group._domManager._domRef).to.deep.equal(arrElem);
        });
        it('adds given elements to _domRef if given elements is an array and given nextElement exist', function(){
            var node1 = new Node(),
                node2 = new Node();
            group.addChild(node1);
            group.addChild(node2);
            DomLayer._attachDomManager(group, function(){}, function(){});
            expect(group._domManager._domRef).to.deep.equal([node1._domManager.getDomElementAsNext(), node2._domManager.getDomElementAsNext()]);
            var elem1 = document.createElement('div'),
                elem2 = document.createElement('div');
            var arrElem = [elem1, elem2];
            group._domManager._register(arrElem, node2._domManager.getDomElementAsNext());
            expect(group._domManager._domRef).to.have.length(4);
            expect(group._domManager._domRef[0]).to.equal(node1._domManager.getDomElementAsNext());
            expect(group._domManager._domRef[1]).to.equal(elem1);
            expect(group._domManager._domRef[2]).to.equal(elem2);
            expect(group._domManager._domRef[3]).to.equal(node2._domManager.getDomElementAsNext());
        });
    });

    describe('#getNextManager', function(){
        it('returns next siblings domManager if it exists', function(){
            var scene = new DOMScene(),
                group1 = new Group(),
                group2 = new Group();
            scene.addChild(group1);
            scene.addChild(group2);
            expect(group1._domManager.getNextManager(group1._domManager)).to.equal(group2._domManager);
        });

        it('returns null when it has no siblings', function(){
            var scene = new DOMScene(),
                group = new Group();
            scene.addChild(group);
            expect(group._domManager.getNextManager(group._domManager)).to.be.null;
        });
    });

    describe('#getDomElement', function(){
        it('returns empty array when its has no child', function(){
            var group = new Group();
            DomLayer._attachDomManager(group, function(){}, function(){});
            var ret = group._domManager.getDomElement();
            expect(ret).to.deep.equal([]);
        });

        it('returns array of children\'s DOM objects when its has children', function(){
            var scene = new DOMScene(),
                group = new Group(),
                node1 = new Node(),
                node2 = new Node();
            group.addChild(node1);
            group.addChild(node2);
            scene.addChild(group);
            expect(group._domManager).to.be.an.instanceof(DomlessManager);
            var expected = [ node1._domManager.element, node2._domManager.element ];
            expect(group._domManager.getDomElement()).to.deep.equal(expected);
        });
    });

    describe('#getDomElementAsNext', function(){
        it('returns _domRef[0] value when the length of _domRef is not zero', function(){
            var group = new Group(),
                node1 = new Node(),
                node2 = new Node();
            group.addChild(node1);
            group.addChild(node2);
            DomLayer._attachDomManager(group, function(){}, function(){});
            expect(group._domManager._domRef[0]).to.equal(node1._domManager.element);
            expect(group._domManager.getDomElementAsNext()).to.equal(node1._domManager.element);
        });

        it('returns nextManager\'s element when it exists', function(){
            var scene = new DOMScene(),
                group = new Group(),
                node = new Node();
            scene.addChild(group);
            scene.addChild(node);
            expect(group._domManager._domRef).to.be.empty;
            expect(group._domManager.getDomElementAsNext()).to.equal(node._domManager.element);
        });
        it('returns null when it has empty _domRef and it has no nextManager', function(){
            var scene = new Scene(),
                group = new Group();
            scene.addChild(group);
            DomLayer._attachDomManager(group, function(){}, function(){});
            expect(group._domManager.getDomElementAsNext()).to.be.null;
        });
    });

    describe('#addManager', function(){
        it('adds given child node\'s element into its _domRef', function(){
            var group = new Group();
            group._domManager = new DomlessManager(group);
            expect(group._domManager._domRef).to.have.length(0);
            var child = new Node();
            enchant.DomLayer._attachDomManager(child, function(){}, function(){});
            group._domManager.addManager(child._domManager);
            expect(group._domManager._domRef).to.have.length(1);
            expect(group._domManager._domRef[0]).to.equal(child._domManager.element);
        });

        it('calls parentNode\'s DomManager#addManager when it has parentNode', function(){
            var scene = new DOMScene(),
                group = new Group(),
                node = new Node();
            scene.addChild(group);
            enchant.DomLayer._attachDomManager(node, function(){}, function(){});
            sinon.spy(group._domManager, 'addManager');
            expect(group._domManager.addManager.called).to.be.false;
            group._domManager.addManager(node._domManager, null);
            expect(group._domManager.addManager.called).to.be.true;
            expect(group._domManager.addManager.lastCall.calledWithExactly(node._domManager, null));
            var anotherNode = new Node();
            enchant.DomLayer._attachDomManager(anotherNode, function(){}, function(){});
            group._domManager.addManager(anotherNode._domManager, node._domManager);
            expect(group._domManager.addManager.lastCall.calledWithExactly(anotherNode._domManager, node._domManager));
        });
    });

    describe('#removeManager', function(){
        var scene, group, child1, child2, child3;

        beforeEach(function(){
            scene = new DOMScene();
            group = new Group();
            child1 = new Node();
            child2 = new Node();
            child3 = new Node();
            group.addChild(child1);
            group.addChild(child2);
            group.addChild(child3);
            scene.addChild(group);
            child2._domManager.element.id = 'will_delete';
        });

        it('removes given childManager\'s dom element from childManager\'s parent node', function(){
            expect(scene._layers['Dom']._domManager.element.childNodes[1]).to.equal(child2._domManager.element);
            expect(scene._layers['Dom']._domManager.element.childNodes[1].id).to.equal('will_delete');
            group._domManager.removeManager(child2._domManager);
            expect(scene._layers['Dom']._domManager.element.childNodes[1].id).to.not.equal('will_delete');
        });

        it('removes given childManager from its _domRef array', function(){
            expect(group._domManager._domRef).to.have.length(3);
            expect(group._domManager._domRef[1]).to.equal(child2._domManager.element);
            expect(group._domManager._domRef[1].id).to.equal('will_delete');
            group._domManager.removeManager(child2._domManager);
            expect(group._domManager._domRef).to.have.length(2);
            expect(group._domManager._domRef[1]).to.not.equal(child2._domManager);
        });
    });

    describe('#setLayer', function(){
        it('sets layer', function(){
            var domlessManager = new DomlessManager(new Group());
            var domLayer = new DomLayer();
            expect(domlessManager.layer).to.not.exist;
            domlessManager.setLayer(domLayer);
            expect(domlessManager.layer).to.equal(domLayer);
        });

        it('sets layer to its children', function(){
            var group = new Group(),
                child1 = new Node(),
                child2 = new Node();
            group.addChild(child1);
            group.addChild(child2);
            enchant.DomLayer._attachDomManager(group, function(){}, function(){});
            expect(group._domManager.layer).to.not.exist;
            expect(child1._domManager.layer).to.not.exist;
            expect(child2._domManager.layer).to.not.exist;
            var domLayer = new DomLayer();
            group._domManager.setLayer(domLayer);
            expect(group._domManager.layer).to.equal(domLayer);
            expect(child1._domManager.layer).to.equal(domLayer);
            expect(child2._domManager.layer).to.equal(domLayer);
        });
    });

    describe('#render', function(){
        it('calculates position and set result to enchant.Matrix.stack', function(){
            var group = new Group();
            var matrix = enchant.Matrix.instance;
            enchant.DomLayer._attachDomManager(group, function(){}, function(){});
            expect(matrix.stack).to.deep.equal([[1, 0, 0, 1, 0, 0]]);
            group._domManager.render([1, 0, 0, 1, 0, 0]);
            expect(matrix.stack).to.deep.equal([[1, 0, 0, 1, 0, 0], [1, 0, 0, 1, 0, 0]]);
        });
    });

    describe('#remove', function(){
        it('removes targetNode', function(){
            var domlessManager = new DomlessManager(new Group());
            expect(domlessManager.targetNode).to.be.exist;
            domlessManager.remove();
            expect(domlessManager.targetNode).to.be.null;
        });

        it('removes all the registered dom elements', function(){
            var group = new Group();
            var child1 = new Node(),
                child2 = new Node();
            group.addChild(child1);
            group.addChild(child2);
            enchant.DomLayer._attachDomManager(group, function(){}, function(){});
            expect(group._domManager._domRef).to.have.length(2);
            group._domManager.remove();
            expect(group._domManager._domRef).to.have.length(0);
        });
    });
});

