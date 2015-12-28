describe("Group",function(){
    var game;
    before(function(){
        enchant();
        game = new Core(320, 320);
    });
    describe("#addChild", function(){
        it("should add Entity as a child", function(){
            var group = new enchant.Group();
            var entity = new enchant.Entity();
            expect(group.childNodes).to.be.empty;
            group.addChild(entity);
            expect(group.childNodes.length).to.equal(1);
            expect(group.childNodes[0]).to.equal(entity);
        });

        it("should add Sprite as a child", function(){
            var group = new enchant.Group();
            var sprite = new enchant.Sprite();
            expect(group.childNodes).to.be.empty;
            group.addChild(sprite);
            expect(group.childNodes.length).to.equal(1);
            expect(group.childNodes[0]).to.equal(sprite);
        });

        it("should add multiple node as children", function(){
            var group = new enchant.Group();
            var entity = new enchant.Entity();
            var sprite = new enchant.Sprite();
            expect(group.childNodes).to.be.empty;
            group.addChild(entity);
            expect(group.childNodes.length).to.equal(1);
            group.addChild(sprite);
            expect(group.childNodes.length).to.equal(2);
            expect(group.childNodes[0]).to.equal(entity);
            expect(group.childNodes[1]).to.equal(sprite);
        });
        
        it("should add Group as a child", function(){
            var group = new enchant.Group();
            var child_group = new enchant.Group();
            expect(group.childNodes).to.be.empty;
            group.addChild(child_group);
            expect(group.childNodes.length).to.equal(1);
            expect(group.childNodes[0]).to.equal(child_group);
        });
    });
    
    describe("#remove", function(){
        it("should remove all childNodes", function() {
            var initialGroupCollectionLength = enchant.Entity.collection.length;
            var parentGroup = new enchant.Group();
            var group = new enchant.Group();
            var childAmount = 10;
            var children = [];
            for(var i = 0; i < childAmount; i++) {
                var entity = new enchant.Entity();
                group.addChild(entity);
                children.push(entity);
            }
            parentGroup.addChild(group);
            game.rootScene.addChild(parentGroup);
            
            expect(group.childNodes.length).to.equal(childAmount);
            expect(parentGroup.childNodes.length).to.equal(1);
            
            parentGroup.remove();
            expect(group.childNodes.length).to.be.empty;
            expect(group.parentNode).to.not.exist;
            expect(group._listeners).to.be.empty;
            expect(parentGroup.childNodes.length).to.be.empty;
            expect(parentGroup.parentNode).to.not.exist;
            expect(parentGroup._listeners).to.be.empty;
            for(var i = 0; i < childAmount; i++) {
                var entity = children[i];
                expect(entity.parentNode).to.not.exist;
                expect(entity._listeners).to.be.empty;
            }
            expect(enchant.Entity.collection.length).to.equal(initialGroupCollectionLength);
        });
    });

    describe("#removeChild", function(){
        it("should remove children", function(){
            var group = new enchant.Group();
            var entity = new enchant.Entity();
            var sprite = new enchant.Sprite();
            group.addChild(entity);
            group.addChild(sprite);
            expect(group.childNodes.length).to.equal(2);
            group.removeChild(entity);
            expect(group.childNodes.length).to.equal(1);
            expect(group.childNodes[0]).to.equal(sprite);
            expect(group.childNodes[1]).to.be.undefined;
            group.removeChild(sprite);
            expect(group.childNodes.length).to.be.empty;
        });
    });

    describe("Event Propagation", function(){
        it("should propagate event to children when event 'enterframe' occurred", function(){
            var group = new enchant.Group();
            var child1 = new enchant.Entity();
            var child2 = new enchant.Sprite();
            group.addChild(child1);
            group.addChild(child2);
            game.rootScene.addChild(group);
            game._tick();
            expect(child1.age).to.equal(1);
            expect(child2.age).to.equal(1);
            expect(group.age).to.equal(1);
            game.rootScene.removeChild(group);
        });

        it("should propagate event to children containing Group node when event 'enterframe' occurred", function(){
            var group = new enchant.Group();
            var child_group = new enchant.Group();
            var child1 = new enchant.Entity();
            var child2 = new enchant.Sprite();
            var grand_child = new enchant.Sprite();
            group.addChild(child1);
            group.addChild(child2);
            group.addChild(child_group);
            child_group.addChild(grand_child);
            game.rootScene.addChild(group);
            game._tick();
            expect(group.age).to.equal(1);
            expect(child1.age).to.equal(1);
            expect(child2.age).to.equal(1);
            expect(child_group.age).to.equal(1);
            expect(grand_child.age).to.equal(1);
            game.rootScene.removeChild(group);
        });
    });
});
