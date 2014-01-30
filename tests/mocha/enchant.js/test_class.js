describe("Class", function(){
    before(function(){
        enchant();
    });

    it("is a class", function(){
        var TestClass = enchant.Class(Object, {});
        expect(TestClass.prototype.constructor).to.exist;
        expect(TestClass.prototype.initialize).to.exist;
        var tc = new TestClass();
        expect(tc).to.be.an.instanceOf(TestClass);
    });

    describe("#create", function(){
        it("throws Error when arguments are invalid", function(){
            expect(function(){enchant.Class.create();}).to.throw(/definition is undefined/);
            expect(function(){enchant.Class.create(null, {});}).to.throw(/superclass is undefined/);
        });

        it("creates independent class", function(){
            var TestClass = enchant.Class.create({
                foo: function(){
                    return 'foo';
                }
            });
            expect(TestClass.prototype.constructor).to.exist;
            expect(TestClass.prototype.initialize).to.exist;
            expect(TestClass.prototype.foo).to.exist;
            var tc = new TestClass();
            expect(tc.foo()).to.equal('foo');
        });

        it("creates a class inheritting existing Class", function(){
            var TestClass = enchant.Class.create(Sprite);
            expect(TestClass.prototype.initialize).to.deep.equal(Sprite.prototype.initialize);
            expect(TestClass.prototype.cvsRender, "inherit from enchant.Sprite").to.exist;
            expect(TestClass.prototype.within, "inherit from enchant.Entity").to.exist;
            var tc = new TestClass(10, 10);
            expect(tc.height).to.equal(10);
            expect(tc.width).to.equal(10);
        });

        it("creates a class inheritting existing Class and overwrite constructor", function(){
            var TestClass = enchant.Class.create(Sprite, {
                initialize: function(width, height){
                    enchant.Sprite.call(this);
                    this.width = 2 * width
                    this.height = 2 * height;
                }
            });
            expect(TestClass.prototype.initialize).not.to.deep.equal(Sprite.prototype.initialize);
            expect(TestClass.prototype.cvsRender, "inherit from enchant.Sprite").to.exist;
            expect(TestClass.prototype.within, "inherit from enchant.Entity").to.exist;
            var tc = new TestClass(10, 10);
            expect(tc.height).to.equal(20);
            expect(tc.width).to.equal(20);
        });
    });

    describe("#getInheritanceTree", function(){
        it("returns inheritance tree array", function(){
            var inheritanceTree = enchant.Class.getInheritanceTree(enchant.Sprite);
            expect(inheritanceTree.length).to.equal(4);
         });
    });
});