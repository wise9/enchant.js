describe("Node", function(){
    before(function(){
        enchant();
    });

    it("has x coordinate and default is 0", function(){
        var node = new Node();
        expect(node.x).to.equal(0);
    });

    it("has y coordinate and default is 0", function(){
        var node = new Node();
        expect(node.y).to.equal(0);
    });

    it("can be set at given coordinate", function(){
        var node = new Node();
        expect(node.x).to.equal(0);
        expect(node.y).to.equal(0);
        node.x = 100;
        node.y = 200;
        expect(node.x).to.equal(100);
        expect(node.y).to.equal(200);
    });

    it("can be a child", function(){
        var parent = new Group();
        var node = new Node();
        expect(node.parentNode).to.be.null;
        parent.addChild(node);
        expect(node.parentNode).to.equal(parent);
        expect(parent.childNodes.indexOf(node)).not.to.equal(-1);
    });

    it("removes itself from parent", function(){
        var parent = new Group();
        var node = new Node();
        parent.addChild(node);
        expect(node.parentNode).equal(parent);
        expect(parent.childNodes.indexOf(node)).not.to.equal(-1);
        node.remove();
        expect(parent.childNodes.indexOf(node)).to.equal(-1);
    });

    it("moves to given coordinate", function(){
        var node = new Node();
        expect(node.x).to.equal(0);
        expect(node.y).to.equal(0);
        node.moveTo(100, 150);
        expect(node.x).to.equal(100);
        expect(node.y).to.equal(150);
    });

    it("moves by given amount of distance", function(){
        var node = new Node();
        node.moveTo(100, 150);
        node.moveBy(100, 100);
        expect(node.x).to.equal(200);
        expect(node.y).to.equal(250);
    });

    it("has 3 event listeners by default", function(){
        var node = new Node();
        var listeners = Object.keys(node._listeners);
        expect(listeners.length).to.equal(3);
        ['touchstart', 'touchend', 'touchmove'].map(function(listener){
            expect(listeners.indexOf(listener)).not.to.equal(-1);
        });
    });

    it("offset positions are updated by _updateCoordinate", function(){
        var grandParent = new Group();
        var parent = new Group();
        var node = new Node();
        parent.addChild(node);
        grandParent.addChild(parent);
        node.moveTo(100, 100);
        parent.moveTo(150, 150);
        expect(node._dirty).to.be.true;
        expect(node.x).to.equal(100);
        expect(node.y).to.equal(100);
        expect(node._offsetX).to.equal(0);
        expect(node._offsetY).to.equal(0);
        expect(parent._dirty).to.be.true;
        expect(parent.x).to.equal(150);
        expect(parent.y).to.equal(150);
        expect(parent._offsetX).to.equal(0);
        expect(parent._offsetY).to.equal(0);
        expect(grandParent._dirty).to.be.false;
        expect(grandParent.x).to.equal(0);
        expect(grandParent.y).to.equal(0);
        expect(grandParent._offsetX).to.equal(0);
        expect(grandParent._offsetY).to.equal(0);
        node._updateCoordinate();
        expect(node._dirty).to.be.false;
        expect(node.x).to.equal(100);
        expect(node.y).to.equal(100);
        expect(node._offsetX).to.equal(250);
        expect(node._offsetY).to.equal(250);
        expect(parent._dirty).to.be.false;
        expect(parent.x).to.equal(150);
        expect(parent.y).to.equal(150);
        expect(parent._offsetX).to.equal(150);
        expect(parent._offsetY).to.equal(150);
        expect(grandParent._dirty).to.be.false;
        expect(grandParent.x).to.equal(0);
        expect(grandParent.y).to.equal(0);
        expect(grandParent._offsetX).to.equal(0);
        expect(grandParent._offsetY).to.equal(0);
    });
});