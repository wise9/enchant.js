/**
 * @fileOverview
 * mixing.enchant.js
 * <p>A plugin for enchant.js which allows to mix 
 * arbitrary many {@link enchant.Class} classes together.
 * It is also possible to add functions and properties defined
 * as a recipe ({@link enchant.Class.MixingRecipe}) to arbitrary many classes to avoid copy and paste.</p>
 * <p>Through this it is possible to achieve a behavior similar to multiple inheritance</p>
 * <p>Requires:<ul>
 * <li>enchant.js v0.6 or later.</li></ul></p>
 * See also {@link enchant.Class.mixClasses}, {@link enchant.Class.MixingRecipe.createFromClass}, 
 * {@link enchant.Class.mixClassesFromRecipe}, {@link enchant.Class.MixingRecipe} and 
 * {@link enchant.Class.applyMixingRecipe} for an introduction.
 * @require enchant.js v0.6+
 *
 * @version 0.1
 * @author Ubiquitous Entertainment Inc. (Kevin Kratzer)
 **/

if (enchant !== undefined) {
    (function() {

        /**
         * @private
         */
        var decorateFunctionFactory = function(srcFunction, currentFunctionName) {
            return function() {
                var firstResult, secondResult;
                firstResult = this._mixing[currentFunctionName].apply(this,arguments);
                secondResult = srcFunction.apply(this,arguments);
                if(secondResult) {
                    return secondResult;
                }
                if(firstResult) {
                    return firstResult;
                }
            };
        };

        /**
         * @private
         */
        var voidFunction = function(){};

        /**
         * @private
         */
        var multipleMixingCombinationFunctionFactory = function(oldFunc,newFunc, key) {
            return function() {
                var firstResult = oldFunc.apply(this,arguments);
                var mixingStore = this._mixing[key];
                this._mixing[key] = voidFunction;
                var secondResult = newFunc.apply(this,arguments);
                this._mixing[key] = mixingStore;
                if(secondResult) {
                    return secondResult;
                }
                if(firstResult) {
                    return firstResult;
                }
            };
        };

        /**
         * @private
         */
        var createFromPrototypeNonRecursive = function(decorate, override, properties, source, functionOverrideNameList, functionIgnoreNameList, propertyIgnoreNameList) {
            for(var key in source) {
                if(source.hasOwnProperty(key)) {
                    var descriptor = Object.getOwnPropertyDescriptor(source, key);
                    if(descriptor.value && typeof(descriptor.value) === 'function') {
                        if((!functionIgnoreNameList || functionIgnoreNameList.indexOf(key) === -1) && key !== 'constructor') {
                            if(!functionOverrideNameList || functionOverrideNameList.indexOf(key) === -1) {
                                decorate[key] = (decorateFunctionFactory(source[key],key));
                            } else {
                                override[key] = source[key];
                            }
                        }
                    } else {
                        if(!propertyIgnoreNameList || propertyIgnoreNameList.indexOf(key) === -1 && key !== '_mixing') {
                            properties[key] = descriptor;
                        }
                    }
                }
            }
        };

        /**
         * @private
         */
        var createFromPrototype = function(decorate,override,properties,source,onlyOwnProperties, functionOverrideNameList, functionIgnoreNameList, propertyIgnoreNameList) {
            if(!onlyOwnProperties && source instanceof Object) {
                createFromPrototype(decorate,override,properties,Object.getPrototypeOf(source),onlyOwnProperties, functionOverrideNameList, functionIgnoreNameList, propertyIgnoreNameList);
            }
            createFromPrototypeNonRecursive(decorate,override,properties,source, functionOverrideNameList, functionIgnoreNameList, propertyIgnoreNameList);
        };

        /**
         * @private
         */
        var getFunctionParams = function(methodString) {
            if(typeof(methodString) !== 'string') {
                methodString = methodString.toString();
            }
            return methodString.substring(methodString.indexOf('(')+1,methodString.indexOf(')')).replace(/\s+/,'').split(',');
        };

        /*Public Interface */
        /**
         * @scope enchant.Class.MixingRecipe.prototype
         */
        enchant.Class.MixingRecipe = enchant.Class.create({
            /**
             * Creates a new MixingRecipe which is used for describing in which way functions and properties should be added during the mixing.
             * To create a recipe from an existing class see {@link enchant.Class.MixingRecipe.createFromClass}
             * @class This class is describing in which way the mixing will be performed on the target classes.
             * For this purpose, MixingRecipe contains three properties:
             * <ul><li>decorateMethods (methods which will be decorated in the target, see decorator pattern)</li>
             * <li>overrideMethods (methods which will be overriden in the target)</li>
             * <li>overrideProperties (properties which will be redefined in the target)</li></ul>
             * <p>See also {@link enchant.Class.mixClasses}, {@link enchant.Class.mixClassesFromRecipe} and {@link enchant.Class.applyMixingRecipe}.</p>
             * @param {Object} decorateMethods The methods which will be decorated in the target, see decorator pattern. To access methods which have been decorated in the class resulting from mixing the _mixing property can be used, e.g. this._mixing.myFunction.apply(this,arguments).<br>(Object containing key-value pairs, key := function name, value := function).
             * @param {Object} overrideMethods The methods which will be overriden in the target.<br>(Object containing key-value pairs, key := function name, value := function).
             * @param {Object} properties The properties which will be redefined in the target.<br>(Object containing key-value pairs, key := function name, value := property descriptor).
             * @property {Object} decorateMethods The methods which will be decorated in the target, see decorator pattern. To access methods which have been decorated in the class resulting from mixing the _mixing property can be used, e.g. this._mixing.myFunction.apply(this,arguments).<br>(Object containing key-value pairs, key := function name, value := function).
             * @property {Object} overrideMethods The methods which will be overriden in the target.<br>(Object containing key-value pairs, key := function name, value := function).
             * @property {Object} overrideProperties The properties which will be redefined in the target.<br>(Object containing key-value pairs, key := function name, value := property descriptor).
             * @example
             *      var recipe = new enchant.Class.MixingRecipe({
             *          add : function(value) {
             *              this._myValue += 3*value;
             *              this._mixing.add.apply(this,arguments);
             *          },
             *          mult : function(value) {
             *              this._myValue *= value*7;
             *              this._mixing.mult.apply(this,arguments);
             *          }
             *      },{
             *          sub : function(value) {
             *              this._myValue -= 5*value;
             *          }
             *      },{
             *      myProperty : {
             *          get: function() {
             *              return 3*this._myPropertyValue;
             *          },
             *          set : function(val) {
             *              this._myPropertyValue = val;
             *          }
             *      }});
             *      var NewClass = enchant.Class.applyMixingRecipe(Class1,recipe);
             * @extends Object
             * @constructs
             */
            initialize : function(decorateMethods, overrideMethods, properties) {
                this.decorateMethods = decorateMethods;
                this.overrideMethods = overrideMethods;
                this.overrideProperties = properties;
            }
        });

        /**
         * Takes the methods and properties of the given class to create a new MixingRecipe.
         * The default behavior is to take all functions and properties of the given class
         * including functions and properties defined in super classes, whereas functions
         * are set to decorate the mixing target.<br>Methods which are decorated will automatically
         * call the soureClass method and the mixing target method (using the _mixing property) - 
         * so there is no need to handle this yourself.
         * <p>To change the default behavior set the corresponding arguments of the function.</p>
         * 
         * @param {Function<constructor function created with enchant.Class>} sourceClass The class which will be used to create the recipe.
         * @param [boolean] onlyOwnProperties If set to true, the functions and properties of the super classes will be ignored.
         * @param [Array<String>] functionOverrideNameList An array containing names of functions which should be set to override functions in the target during mixing.
         * @param [Array<String>] functionIgnoreNameList An array containing names of functions which should be ignored when creating the recipe.
         * @param [Array<String>] propertyIgnoreNameList An array containing names of properties which should be ignored when creating the recipe.
         * @returns {enchant.Class.MixingRecipe} The MixingRecipe created from the definition of the sourceClass.
         * @example
         *      var recipe = enchant.Class.MixingRecipe.createFromClass(Class2, true, 
         *              ['overrideFunction1','overrideFunction2'],
         *              ['ignoreFunction1','ignoreFunction2'],
         *              ['ignoreProperty1','ignorePropterty2']);
         *      recipe.overrideMethods['additionalFunction'] = new function() {
         *          console.log('Hello, World');
         *      }
         *      recipe.overrideProperties['newProperty'] = {
         *          get: function() {
         *              return this._newProperty;
         *          },
         *          set : function(val) {
         *              this._newProperty = val;
         *          }
         *      }
         *      var NewClass = enchant.Class.mixClassesFromRecipe(Class1,Class2,recipe);
         * @constructs
         * @static
         */
        enchant.Class.MixingRecipe.createFromClass = function(sourceClass, onlyOwnProperties, functionOverrideNameList, functionIgnoreNameList, propertyIgnoreNameList) {
            var decorate = {};
            var override = {};
            var properties = {};

            var source = sourceClass.prototype;
            createFromPrototype(decorate,override,properties,source,onlyOwnProperties, functionOverrideNameList, functionIgnoreNameList, propertyIgnoreNameList);
            return new enchant.Class.MixingRecipe(decorate,override,properties);
        };

        /**
         * Uses the given MixingRecipe, applies it to the first class and returns the result - the MixingRecipe should correspond to the secondClass.
         * A default initialize method will be added which will call the initialize functions of both classes.
         * The signature for the default initialize method is:<br>
         * ([firstClass constructor arg 1],...,[firstClass constructor arg n],[secondClass constructor arg1],...[secondClass constructor arg n])
         * <p>Both classes will not be modified.</p> See also: {@link enchant.Class.MixingRecipe}
         * 
         * @param {Function<constructor function created with enchant.Class>} firstClass The class to which the recipe will be applied.
         * @param {Function<constructor function created with enchant.Class>} secondClass The class which is related to the MixingRecipe, used for the default initialize function.
         * @param {enchant.Class.MixingRecipe} recipe The recipe which is applied to the first class - should correspond to the secondClass. 
         * @param [Function] initializeMethod If provided, this function will be used to initialize the resulting class instead of the default initialize method.
         * @returns {Function<constructor function created with enchant.Class>} initializeMethod The class which is the result of mixing both classes using the recipe.
         * @example
         *      var MapGroup = enchant.Class.mixClasses(Map, Group,true);
         *      var map = new MapGroup(16, 16);
         *      var SpriteLabel = enchant.Class.mixClasses(Sprite, Label,true);
         *      var kumaLabel = new SpriteLabel(32,32,'Kuma');
         * @static
         */
        enchant.Class.mixClassesFromRecipe = function(firstClass, secondClass, recipe, initializeMethod) {
            var result = enchant.Class.applyMixingRecipe(firstClass,recipe);
            var paramLength = getFunctionParams(firstClass.prototype.initialize).length;
            if(typeof(initializeMethod) !== 'function') {
                initializeMethod = function() {
                    var args = Array.prototype.slice.call(arguments);
                    secondClass.prototype.initialize.apply(this,args.slice(paramLength));
                    firstClass.prototype.initialize.apply(this,args.slice(0,paramLength));
                };
            }
            result.prototype.initialize = initializeMethod;
            return result;
        };


        /**
         * Creates an MixingRecipe out of the second class, applies it to the first class and returns the result.
         * The default behavior is to take all functions and properties of the second class,
         * including functions and properties defined in its super classes, whereas functions
         * are set to decorate the mixing target.<br>Methods which are decorated will automatically
         * call the soureClass method and the mixing target method (using the _mixing property) - 
         * so there is no need to handle this yourself.
         * <p>Furthermore, a default initialize method will be added which will
         * call the initialize functions of both classes. The signature for the default initialize method is:<br>
         * ([firstClass constructor arg 1],...,[firstClass constructor arg n],[secondClass constructor arg 1],...[secondClass constructor arg n])</p>
         * <p>Both classes will not be modified.</p> See also: {@link enchant.Class.MixingRecipe}
         * 
         * @param {Function<constructor function created with enchant.Class>} firstClass The class to which the recipe will be applied.
         * @param {Function<constructor function created with enchant.Class>} secondClass The class from which the recipe will be created
         * @param [boolean] useOnlyOwnPropertiesForSecondClass If set to true, the functions and properties of the super classes will be ignored during the recipe creation of the secondClass.
         * @param [Function] initializeMethod If provided, this function will be used to initialize the resulting class instead of the default initialize method.
         * @returns {Function<constructor function created with enchant.Class>} The class which is the result of mixing both classes.
         * @example
         *      var MapGroup = enchant.Class.mixClasses(Map, Group,true);
         *      var map = new MapGroup(16, 16);
         *      var SpriteLabel = enchant.Class.mixClasses(Sprite, Label,true);
         *      var kumaLabel = new SpriteLabel(32,32,'Kuma');
         * @static
         */
        enchant.Class.mixClasses = function(firstClass, secondClass, useOnlyOwnPropertiesForSecondClass, initializeMethod) {
            return enchant.Class.mixClassesFromRecipe(firstClass,secondClass,enchant.Class.MixingRecipe.createFromClass(secondClass, useOnlyOwnPropertiesForSecondClass, [], ['initialize'], []),initializeMethod);
        };

        /**
         * Applies the defined MixingRecipe to the target class creating a new class definition which is then returned.
         * The target class is not modified directly.<br>See also: {@link enchant.Class.MixingRecipe}.
         * 
         * @param {Function<constructor function created with enchant.Class>} target The class to which the recipe will be applied.
         * @param {enchant.Class.MixingRecipe} source The MixingRecipe which is used to add new functionality to the target.
         * @returns {Function<constructor function created with enchant.Class>} The class which is the result of mixing the target class with the source recipe.
         * @example
         *      var recipe = new enchant.Class.MixingRecipe({
         *         // ... see enchant.Class.MixingRecipe
         *      },{
         *          // ... see enchant.Class.MixingRecipe
         *      },{
         *          // ... see enchant.Class.MixingRecipe
         *      });
         *      var NewClass = applyMixingRecipe(Class1,recipe);
         * @static
         */
        enchant.Class.applyMixingRecipe = function(target, source) {
            var result = enchant.Class.create(target,{});
            target = result.prototype;
            for(var recipeKey in source) {
                if(source.hasOwnProperty(recipeKey)) {
                    var currentSource = source[recipeKey];
                    if(recipeKey === 'overrideMethods') {
                        for(var methodKey in currentSource) {
                            if(currentSource.hasOwnProperty(methodKey)) {
                                target[methodKey] = currentSource[methodKey];
                                if(target._mixing && target._mixing[methodKey]) {
                                    target._mixing[methodKey] = voidFunction;
                                }
                            }
                        }
                    } else if(recipeKey === 'overrideProperties') {
                        for(var propertyKey in currentSource) {
                            if(currentSource.hasOwnProperty(propertyKey)) {
                                Object.defineProperty(target,propertyKey,currentSource[propertyKey]);
                            }
                        }
                    } else if(recipeKey === 'decorateMethods') {
                        if(!target._mixing) {
                            target._mixing = {};
                        }
                        for(var key in currentSource) {
                            if(currentSource.hasOwnProperty(key)) {
                                var targetHolder = target;
                                if(!target[key]) {
                                    while(targetHolder instanceof Object && !targetHolder[key]) {
                                        targetHolder = Object.getPrototypeOf(targetHolder);
                                    }
                                }
                                if(target._mixing[key]) {
                                    var newFunc = targetHolder[key];
                                    target._mixing[key] = (multipleMixingCombinationFunctionFactory(target._mixing[key],newFunc,key));
                                } else {
                                    target._mixing[key] = targetHolder[key];
                                    if(!target._mixing[key]) {
                                        target._mixing[key] = voidFunction;
                                    }
                                }
                                target[key] = currentSource[key];
                            }
                        }
                    }
                }
            }
            return result;
        };
    })();
}
