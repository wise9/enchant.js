describe("mixing.enchant.js", function(){
    beforeEach(function(){
        TestClass = enchant.Class.create({
            initialize: function(){
                this._myPropertyValue = 7;
                this._myAddMethodValue = 11;
                this._myMultMethodValue = 13;
            },
            add: function(value){
                this._myAddMethodValue += value;
            },
            mult: function(value) {
                this._myMultMethodValue *= value;
            },
            myProperty: {
                get: function(){
                    return this._myPropertyValue;
                },
                set: function(newValue){
                    this._myPropertyValue = newValue;
                }
            }
        });
    });

    afterEach(function(){
        TestClass = undefined;
    });

    describe("TestClass", function(){
        it("should be properly initialized", function(){
            var testObj = new TestClass();
            expect(testObj._myPropertyValue).to.equal(7);
            expect(testObj._myAddMethodValue).to.equal(11);
            expect(testObj._myMultMethodValue).to.equal(13);
        });

        it("should return the value which set to TestObj.myProperty as _myPropertyValue", function(){
            var testObj = new TestClass();
            testObj.myProperty = 3;
            expect(testObj._myPropertyValue).to.equal(3);
        });

        it("should return the value which set to _myPropertyValue as TestObj.myProperty", function(){
            var testObj = new TestClass();
            expect(testObj.myProperty).to.equal(testObj._myPropertyValue);
            expect(testObj.myProperty).to.equal(7);
        });

        it("should add value to _myAddMethodValue", function(){
            var testObj = new TestClass();
            expect(testObj._myAddMethodValue).to.equal(11);
            testObj.add(5);
            expect(testObj._myAddMethodValue).to.equal(16);
        });

        it("should multiply value to _myMultMethodValue", function(){
            var testObj = new TestClass();
            expect(testObj._myMultMethodValue).to.equal(13);
            testObj.mult(17);
            expect(testObj._myMultMethodValue).to.equal(221);
        });
    });


    describe("MixingRecipe", function(){
        it("should change nothing when applying empty", function(){
            var recipe = new enchant.Class.MixingRecipe();
            var Mixed = enchant.Class.applyMixingRecipe(TestClass, recipe);
            var testObj = new Mixed();
            expect(testObj._myPropertyValue).to.equal(7);
            expect(testObj._myAddMethodValue).to.equal(11);
            expect(testObj._myMultMethodValue).to.equal(13);
            testObj.myProperty = 3;
            testObj.add(5);
            testObj.mult(17);
            expect(testObj._myPropertyValue).to.equal(3);
            expect(testObj._myAddMethodValue).to.equal(16);
            expect(testObj._myMultMethodValue).to.equal(221);
        });

        describe("overrideMethods", function(){
            it("should override the initialize method", function(){
                var recipe = new enchant.Class.MixingRecipe({}, {
                    initialize: function(){
                        this._myPropertyValue = 1;
                        this._myAddMethodValue = 3;
                        this._myMultMethodValue = 5;
                    }
                }, {});
                var Mixed = enchant.Class.applyMixingRecipe(TestClass, recipe);
                var testObj = new Mixed();
                expect(testObj._myPropertyValue).to.equal(1);
                expect(testObj._myAddMethodValue).to.equal(3);
                expect(testObj._myMultMethodValue).to.equal(5);
                testObj.myProperty = 3;
                testObj.add(5);
                testObj.mult(17);
                expect(testObj._myPropertyValue).to.equal(3);
                expect(testObj._myAddMethodValue).to.equal(8);
                expect(testObj._myMultMethodValue).to.equal(85);
            });

            it("should override function", function(){
                var recipe = new enchant.Class.MixingRecipe({}, {
                    add: function(value){
                        this._myAddMethodValue += 3 * value;
                    },
                    mult: function(value){
                        this._myMultMethodValue *= 7 * value;
                    }
                }, {});
                var Mixed = enchant.Class.applyMixingRecipe(TestClass, recipe);
                var testObj = new Mixed();
                expect(testObj._myAddMethodValue).to.equal(11);
                expect(testObj._myMultMethodValue).to.equal(13);
                testObj.add(5);
                testObj.mult(17);
                expect(testObj._myAddMethodValue).to.equal(26);
                expect(testObj._myMultMethodValue).to.equal(1547);
            });
        });

        describe("decorateMethods", function(){
            it("should not affect because of calling 'apply' at the end of initialize method", function(){
                var recipe = new enchant.Class.MixingRecipe({
                    initialize: function(){
                        this._myPropertyValue = 1;
                        this._myAddMethodValue = 3;
                        this._myMultMethodValue = 5;
                        this._mixing.initialize.apply(this, arguments);
                    }
                }, {}, {});
                var Mixed = enchant.Class.applyMixingRecipe(TestClass, recipe);
                var testObj = new Mixed();
                expect(testObj._myPropertyValue).to.equal(7);
                expect(testObj._myAddMethodValue).to.equal(11);
                expect(testObj._myMultMethodValue).to.equal(13);
                testObj.myProperty = 3;
                testObj.add(5);
                testObj.mult(17);
                expect(testObj._myPropertyValue).to.equal(3);
                expect(testObj._myAddMethodValue).to.equal(16);
                expect(testObj._myMultMethodValue).to.equal(221);
            });
            
            it("should affect to initialize method", function(){
                var recipe = new enchant.Class.MixingRecipe({
                    initialize: function(){
                        this._mixing.initialize.apply(this, arguments);
                        this._myPropertyValue = 1;
                        this._myAddMethodValue = 3;
                        this._myMultMethodValue = 5;
                    }
                }, {}, {});
                var Mixed = enchant.Class.applyMixingRecipe(TestClass, recipe);
                var testObj = new Mixed();
                expect(testObj._myPropertyValue).to.equal(1);
                expect(testObj._myAddMethodValue).to.equal(3);
                expect(testObj._myMultMethodValue).to.equal(5);
                testObj.myProperty = 3;
                testObj.add(5);
                testObj.mult(17);
                expect(testObj._myPropertyValue).to.equal(3);
                expect(testObj._myAddMethodValue).to.equal(8);
                expect(testObj._myMultMethodValue).to.equal(85);
            });
            
            it("should add functionality to 'function' passing arguments object", function(){
                var recipe = new enchant.Class.MixingRecipe({
                    add: function(value){
                        this._myAddMethodValue += 3 * value;
                        this._mixing.add.apply(this, arguments);
                    },
                    mult: function(value){
                        this._myMultMethodValue *= 7 * value;
                        this._mixing.mult.apply(this, arguments);
                    }
                }, {}, {});
                var Mixed = enchant.Class.applyMixingRecipe(TestClass, recipe);
                var testObj = new Mixed();
                expect(testObj._myAddMethodValue).to.equal(11);
                expect(testObj._myMultMethodValue).to.equal(13);
                testObj.add(5);
                testObj.mult(17);
                expect(testObj._myAddMethodValue).to.equal(31);
                expect(testObj._myMultMethodValue).to.equal(26299);
            });

            it("should add functionality to 'funciton' passing its own property", function(){
                var recipe = new enchant.Class.MixingRecipe({
                    add: function(value) {
                        this._myAddMethodValue += 3 * value;
                        this._mixing.add.call(this, this._myAddMethodValue);
                    },
                    mult: function(value) {
                        this._myMultMethodValue *= 7 * value;
                        this._mixing.mult.call(this, this._myMultMethodValue);
                    }
                }, {}, {});
                var Mixed = enchant.Class.applyMixingRecipe(TestClass, recipe);
                var testObj = new Mixed();
                expect(testObj._myAddMethodValue).to.equal(11);
                expect(testObj._myMultMethodValue).to.equal(13);
                testObj.add(5);
                testObj.mult(17);
                expect(testObj._myAddMethodValue).to.equal(52);
                expect(testObj._myMultMethodValue).to.equal(2393209);
            });

            it("should add functionality to 'funciton' passing argument which set to the function", function(){
                var recipe = new enchant.Class.MixingRecipe({
                    add: function(value) {
                        this._mixing.add.call(this, value);
                        this._myAddMethodValue += 3 * this._myAddMethodValue;
                    },
                    mult: function(value) {
                        this._mixing.mult.call(this, value);
                        this._myMultMethodValue *= 7 * this._myMultMethodValue;
                    }
                }, {}, {});
                var Mixed = enchant.Class.applyMixingRecipe(TestClass, recipe);
                var testObj = new Mixed();
                expect(testObj._myAddMethodValue).to.equal(11);
                expect(testObj._myMultMethodValue).to.equal(13);
                testObj.add(5);
                testObj.mult(17);
                expect(testObj._myAddMethodValue).to.equal(64);
                expect(testObj._myMultMethodValue).to.equal(341887);
            });

            it("should add functionality to 'function' several times", function(){
                var Mixed = TestClass;
                for(var i = 0; i < 10; i++) {
                    var recipe = new enchant.Class.MixingRecipe({
                        add: function(value){
                            this._mixing.add.call(this, value);
                            this._myAddMethodValue += 3 * value;
                        }
                    }, {}, {});
                    Mixed = enchant.Class.applyMixingRecipe(Mixed, recipe);
                }
                var testObj = new Mixed();
                expect(testObj._myAddMethodValue).to.equal(11);
                testObj.add(5);
                expect(testObj._myAddMethodValue).to.equal(166); // (3 * 5(value)) * 10(i) + (5 + 11) (TestClass#add) 
            });

            it("should add functionality to 'function' correctly when decorate -> override -> decorate2. Override and decorate2 should be affected", function(){
                var Mixed = TestClass;
                for (var i = 0; i < 10; i++) {
                    var recipe = new enchant.Class.MixingRecipe({
                        add: function(value) {
                            this._mixing.add.call(this, value);
                            this._myAddMethodValue += 3 * value;
                        }
                    }, {}, {});
                    Mixed = enchant.Class.applyMixingRecipe(Mixed, recipe);
                };
                // override add function
                var recipe = new enchant.Class.MixingRecipe({}, {
                    add: function(value){
                        this._myAddMethodValue += 3 * value;
                    }
                }, {});
                Mixed = enchant.Class.applyMixingRecipe(Mixed, recipe);
                // decorate again
                for(var i = 0; i < 10; i++) {
                    var recipe = new enchant.Class.MixingRecipe({
                        add: function(value){
                            this._mixing.add.call(this, value);
                            this._myAddMethodValue += 7 * value;
                        }
                    }, {}, {});
                    Mixed = enchant.Class.applyMixingRecipe(Mixed, recipe);
                }
                var testObj = new Mixed();
                expect(testObj._myAddMethodValue).to.equal(11);
                testObj.add(5);
                expect(testObj._myAddMethodValue).to.equal(376); // 5*7*10 + 11 + 15
            });
        });

        describe("overrideProperties", function(){
            it("set method should override", function(){
                var recipe = new enchant.Class.MixingRecipe({}, {}, {
                    myProperty: {
                        get: function() {
                            return this._myPropertyValue;
                        },
                        set: function(value) {
                            this._myPropertyValue = 3 * value;
                        }
                    }
                });
                var Mixed = enchant.Class.applyMixingRecipe(TestClass, recipe);
                var testObj = new Mixed();
                expect(testObj._myPropertyValue).to.equal(7);
                testObj.myProperty = 3;
                expect(testObj._myPropertyValue).to.equal(9);
            });

            it("get method should override", function(){
                var recipe = new enchant.Class.MixingRecipe({}, {}, {
                    myProperty: {
                        get: function(){
                            return 3 * this._myPropertyValue;
                        },
                        set: function(value){
                            this._myPropertyValue = value;
                        }
                    }
                });
                var Mixed = enchant.Class.applyMixingRecipe(TestClass, recipe);
                var testObj = new Mixed();
                expect(testObj._myPropertyValue).to.equal(7);
                expect(testObj.myProperty).to.equal(21);
            });
        });

        describe("createFromClass", function(){
            it("should create recipe from given Class", function(){
                var recipe = enchant.Class.MixingRecipe.createFromClass(TestClass, true, ['add']);
                expect(typeof(recipe.decorateMethods['mult'])).to.equal('function');
                expect(recipe.overrideMethods['add']).to.equal(TestClass.prototype.add);
                expect(recipe.overrideProperties['myProperty']).to.deep.equal(Object.getOwnPropertyDescriptor(TestClass.prototype, 'myProperty'));
            });
        });

        describe("mixClasses", function(){
            it("should mix 'mixed class' to 'not mixed class' multiple times", function(){
                var Mixed = TestClass;
                for(i = 0; i < 10; i++) {
                    Mixed = enchant.Class.mixClasses(TestClass, Mixed, true);
                }
                var testObj = new Mixed();
                expect(testObj._myPropertyValue).to.equal(7);
                expect(testObj._myAddMethodValue).to.equal(11);
                expect(testObj._myMultMethodValue).to.equal(13);
                testObj.myProperty = 3;
                testObj.add(5);
                testObj.mult(17);
                expect(testObj._myPropertyValue).to.equal(3);
                expect(testObj._myAddMethodValue).to.equal(66);
                expect(testObj._myMultMethodValue).to.equal(445534651999229);
            });

            it("should mix 'not mixed class' to 'mixed class' multiple times", function(){
                var Mixed = TestClass;
                for(i = 0; i < 10; i++) {
                    Mixed = enchant.Class.mixClasses(Mixed, TestClass, true);
                }
                var testObj = new Mixed();
                expect(testObj._myPropertyValue).to.equal(7);
                expect(testObj._myAddMethodValue).to.equal(11);
                expect(testObj._myMultMethodValue).to.equal(13);
                testObj.myProperty = 3;
                testObj.add(5);
                testObj.mult(17);
                expect(testObj._myPropertyValue).to.equal(3);
                expect(testObj._myAddMethodValue).to.equal(66);
                expect(testObj._myMultMethodValue).to.equal(445534651999229);

            });
        });
    });
});
