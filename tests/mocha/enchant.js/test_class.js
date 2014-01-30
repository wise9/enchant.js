describe("Class", function(){
    before(function(){
        enchant();
    });

    it("stands for Class");

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

        it("creates a class inheritting 'Sprite'");
        it("creates a class inheritting 'Sprite' and overwrite constructor");
    });

    describe("#getInheritanceTree", function(){
        it("shows inheritance tree");
    });
});