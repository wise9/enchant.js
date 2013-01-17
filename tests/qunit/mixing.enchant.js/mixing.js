module('mixing.enchant.js', {
    setup: function() {
        TestClass = enchant.Class.create({
            initialize: function() {
                this._myPropertyValue = 7;
                this._myAddMethodValue = 11;
                this._myMultMethodValue = 13;
            },
            add : function(value) {
                this._myAddMethodValue += value;
            },
            mult : function(value) {
                this._myMultMethodValue *= value;
            },
            myProperty: {
                get:function() {
                    return this._myPropertyValue;
                },
                set:function(newValue) {
                    this._myPropertyValue = newValue;
                }

            }
        });
    },
    teardown: function() {
        testClass = undefined;
    }
});

test('mixing.init', function() {
    var testObj = new TestClass();
    equal(testObj._myPropertyValue, 7);
    equal(testObj._myAddMethodValue, 11);
    equal(testObj._myMultMethodValue, 13);
    testObj.myProperty = 3;
    testObj.add(5);
    testObj.mult(17);
    equal(testObj._myPropertyValue, 3);
    equal(testObj._myAddMethodValue, 16);
    equal(testObj._myMultMethodValue, 221);
});

test('mixing.empty', function() {
    var recipe = new enchant.Class.MixingRecipe();
    var Mixed = enchant.Class.applyMixingRecipe(TestClass,recipe);
    var testObj = new Mixed();
    equal(testObj._myPropertyValue, 7);
    equal(testObj._myAddMethodValue, 11);
    equal(testObj._myMultMethodValue, 13);
    testObj.myProperty = 3;
    testObj.add(5);
    testObj.mult(17);
    equal(testObj._myPropertyValue, 3);
    equal(testObj._myAddMethodValue, 16);
    equal(testObj._myMultMethodValue, 221);
});


test('mixing.initializeOverwrite', function() {
    var recipe = new enchant.Class.MixingRecipe({},{
        initialize : function() {
            this._myPropertyValue = 1;
            this._myAddMethodValue = 3;
            this._myMultMethodValue = 5;
        }
    },{});
    var Mixed = enchant.Class.applyMixingRecipe(TestClass,recipe);
    var testObj = new Mixed();
    equal(testObj._myPropertyValue, 1);
    equal(testObj._myAddMethodValue, 3);
    equal(testObj._myMultMethodValue, 5);
    testObj.myProperty = 3;
    testObj.add(5);
    testObj.mult(17);
    equal(testObj._myPropertyValue, 3);
    equal(testObj._myAddMethodValue, 8);
    equal(testObj._myMultMethodValue, 85);
});

test('mixing.initializeDecorate', function() {
    var recipe = new enchant.Class.MixingRecipe({
        initialize : function() {
            this._myPropertyValue = 1;
            this._myAddMethodValue = 3;
            this._myMultMethodValue = 5;
            this._mixing.initialize.apply(this,arguments);
        }
    },{},{});
    var Mixed = enchant.Class.applyMixingRecipe(TestClass,recipe);
    var testObj = new Mixed();
    equal(testObj._myPropertyValue, 7);
    equal(testObj._myAddMethodValue, 11);
    equal(testObj._myMultMethodValue, 13);
    testObj.myProperty = 3;
    testObj.add(5);
    testObj.mult(17);
    equal(testObj._myPropertyValue, 3);
    equal(testObj._myAddMethodValue, 16);
    equal(testObj._myMultMethodValue, 221);
});
test('mixing.initializeDecorate2', function() {
    var recipe = new enchant.Class.MixingRecipe({
        initialize : function() {
            this._mixing.initialize.apply(this,arguments);
            this._myPropertyValue = 1;
            this._myAddMethodValue = 3;
            this._myMultMethodValue = 5;
        }
    },{},{});
    var Mixed = enchant.Class.applyMixingRecipe(TestClass,recipe);
    var testObj = new Mixed();
    equal(testObj._myPropertyValue, 1);
    equal(testObj._myAddMethodValue, 3);
    equal(testObj._myMultMethodValue, 5);
    testObj.myProperty = 3;
    testObj.add(5);
    testObj.mult(17);
    equal(testObj._myPropertyValue, 3);
    equal(testObj._myAddMethodValue, 8);
    equal(testObj._myMultMethodValue, 85);
});

test('mixing.property', function() {
    var recipe = new enchant.Class.MixingRecipe({},{},{
        myProperty : {
            get: function() {
                return this._myPropertyValue;
            },
            set : function(val) {
                this._myPropertyValue = 3*val;
            }
        }
    });
    var Mixed = enchant.Class.applyMixingRecipe(TestClass,recipe);
    var testObj = new Mixed();
    equal(testObj._myPropertyValue, 7);
    equal(testObj._myAddMethodValue, 11);
    equal(testObj._myMultMethodValue, 13);
    testObj.myProperty = 3;
    testObj.add(5);
    testObj.mult(17);
    equal(testObj._myPropertyValue, 9);
    equal(testObj._myAddMethodValue, 16);
    equal(testObj._myMultMethodValue, 221);
});

test('mixing.property2', function() {
    var recipe = new enchant.Class.MixingRecipe({},{},{
        myProperty : {
            get: function() {
                return 3*this._myPropertyValue;
            },
            set : function(val) {
                this._myPropertyValue = val;
            }
        }
    });
    var Mixed = enchant.Class.applyMixingRecipe(TestClass,recipe);
    var testObj = new Mixed();
    equal(testObj._myPropertyValue, 7);
    equal(testObj._myAddMethodValue, 11);
    equal(testObj._myMultMethodValue, 13);
    testObj.myProperty = 3;
    testObj.add(5);
    testObj.mult(17);
    equal(testObj.myProperty, 9);
    equal(testObj._myAddMethodValue, 16);
    equal(testObj._myMultMethodValue, 221);
});

test('mixing.overrideFunc', function() {
    var recipe = new enchant.Class.MixingRecipe({},{
        add : function(value) {
            this._myAddMethodValue += 3*value;
        },
        mult : function(value) {
            this._myMultMethodValue *= value*7;
        }
    },{});
    var Mixed = enchant.Class.applyMixingRecipe(TestClass,recipe);
    var testObj = new Mixed();
    equal(testObj._myPropertyValue, 7);
    equal(testObj._myAddMethodValue, 11);
    equal(testObj._myMultMethodValue, 13);
    testObj.myProperty = 3;
    testObj.add(5);
    testObj.mult(17);
    equal(testObj._myPropertyValue, 3);
    equal(testObj._myAddMethodValue, 26);
    equal(testObj._myMultMethodValue, 1547);
});

test('mixing.decorateFunc1', function() {
    var recipe = new enchant.Class.MixingRecipe({
        add : function(value) {
            this._myAddMethodValue += 3*value;
            this._mixing.add.apply(this,arguments);
        },
        mult : function(value) {
            this._myMultMethodValue *= value*7;
            this._mixing.mult.apply(this,arguments);
        }
    },{},{});
    var Mixed = enchant.Class.applyMixingRecipe(TestClass,recipe);
    var testObj = new Mixed();
    equal(testObj._myPropertyValue, 7);
    equal(testObj._myAddMethodValue, 11);
    equal(testObj._myMultMethodValue, 13);
    testObj.myProperty = 3;
    testObj.add(5);
    testObj.mult(17);
    equal(testObj._myPropertyValue, 3);
    equal(testObj._myAddMethodValue, 31);
    equal(testObj._myMultMethodValue, 26299);
});

test('mixing.decorateFunc2', function() {
    var recipe = new enchant.Class.MixingRecipe({
        add : function(value) {
            this._myAddMethodValue += 3*value;
            this._mixing.add.call(this,this._myAddMethodValue);
        },
        mult : function(value) {
            this._myMultMethodValue *= value*7;
            this._mixing.mult.call(this,this._myMultMethodValue);
        }
    },{},{});
    var Mixed = enchant.Class.applyMixingRecipe(TestClass,recipe);
    var testObj = new Mixed();
    equal(testObj._myPropertyValue, 7);
    equal(testObj._myAddMethodValue, 11);
    equal(testObj._myMultMethodValue, 13);
    testObj.myProperty = 3;
    testObj.add(5);
    testObj.mult(17);
    equal(testObj._myPropertyValue, 3);
    equal(testObj._myAddMethodValue, 52);
    equal(testObj._myMultMethodValue, 2393209);
});

test('mixing.decorateFunc3', function() {
    var recipe = new enchant.Class.MixingRecipe({
        add : function(value) {
            this._mixing.add.call(this,value);
            this._myAddMethodValue += 3*this._myAddMethodValue;
        },
        mult : function(value) {
            this._mixing.mult.call(this,value);
            this._myMultMethodValue *= this._myMultMethodValue*7;
        }
    },{},{});
    var Mixed = enchant.Class.applyMixingRecipe(TestClass,recipe);
    var testObj = new Mixed();
    equal(testObj._myPropertyValue, 7);
    equal(testObj._myAddMethodValue, 11);
    equal(testObj._myMultMethodValue, 13);
    testObj.myProperty = 3;
    testObj.add(5);
    testObj.mult(17);
    equal(testObj._myPropertyValue, 3);
    equal(testObj._myAddMethodValue, 64);
    equal(testObj._myMultMethodValue, 341887);
});


test('mixing.multipleDecorate', function() {
    var Mixed = TestClass;
    for(var i = 0; i < 10; i++) {
        var recipe = new enchant.Class.MixingRecipe({
            add : function(value) {
                this._mixing.add.call(this,value);
                this._myAddMethodValue += 3*value;
            }
        },{},{});
        Mixed = enchant.Class.applyMixingRecipe(Mixed,recipe);
    }
    var testObj = new Mixed();
    equal(testObj._myPropertyValue, 7);
    equal(testObj._myAddMethodValue, 11);
    equal(testObj._myMultMethodValue, 13);
    testObj.myProperty = 3;
    testObj.add(5);
    testObj.mult(17);
    equal(testObj._myPropertyValue, 3);
    equal(testObj._myAddMethodValue, 166); //5*3*10+5+11
    equal(testObj._myMultMethodValue, 221);
});

test('mixing.multipleDecorate2', function() {
    var Mixed = TestClass;
    for(var i = 0; i < 10; i++) {
        var recipe = new enchant.Class.MixingRecipe({
            add : function(value) {
                this._mixing.add.call(this,value);
                this._myAddMethodValue += 3*value;
            }
        },{},{});
        Mixed = enchant.Class.applyMixingRecipe(Mixed,recipe);
    }
    //overwrite add!
    var recipe = new enchant.Class.MixingRecipe({},{
        add : function(value) {
            this._myAddMethodValue += 3*value;
        }
    },{});
    Mixed = enchant.Class.applyMixingRecipe(Mixed,recipe);

    //decorate again..
    for(var i = 0; i < 10; i++) {
        var recipe = new enchant.Class.MixingRecipe({
            add : function(value) {
                this._mixing.add.call(this,value);
                this._myAddMethodValue += 7*value;
            }
        },{},{});
        Mixed = enchant.Class.applyMixingRecipe(Mixed,recipe);
    }
    var testObj = new Mixed();
    equal(testObj._myPropertyValue, 7);
    equal(testObj._myAddMethodValue, 11);
    equal(testObj._myMultMethodValue, 13);
    testObj.myProperty = 3;
    testObj.add(5);
    testObj.mult(17);
    equal(testObj._myPropertyValue, 3);
    equal(testObj._myAddMethodValue, 376); //5*7*10+15+11
    equal(testObj._myMultMethodValue, 221);
});

test('mixing.classRecipe', function() {
    var recipe = enchant.Class.MixingRecipe.createFromClass(TestClass, true, ['add']);
    equal(typeof(recipe.decorateMethods['mult']),'function');
    equal(recipe.overrideMethods['add'],TestClass.prototype.add);
    deepEqual(recipe.overrideProperties['myProperty'],Object.getOwnPropertyDescriptor(TestClass.prototype,'myProperty'));
});

test('mixing.classMixing2', function() {
    Mixed = TestClass;
    for(var i = 0; i < 10; i++) {
        Mixed = enchant.Class.mixClasses(TestClass,Mixed,true);
    }
    var testObj = new Mixed();
    equal(testObj._myPropertyValue, 7);
    equal(testObj._myAddMethodValue, 11);
    equal(testObj._myMultMethodValue, 13);
    testObj.myProperty = 3;
    testObj.add(5);
    testObj.mult(17);
    equal(testObj._myPropertyValue, 3);
    equal(testObj._myAddMethodValue, 66);
    equal(testObj._myMultMethodValue, 445534651999229);
});

test('mixing.classMixing3', function() {
    Mixed = TestClass;
    for(var i = 0; i < 10; i++) {
        Mixed = enchant.Class.mixClasses(Mixed,TestClass,true);
    }
    var testObj = new Mixed();
    equal(testObj._myPropertyValue, 7);
    equal(testObj._myAddMethodValue, 11);
    equal(testObj._myMultMethodValue, 13);
    testObj.myProperty = 3;
    testObj.add(5);
    testObj.mult(17);
    equal(testObj._myPropertyValue, 3);
    equal(testObj._myAddMethodValue, 66);
    equal(testObj._myMultMethodValue, 445534651999229);
});