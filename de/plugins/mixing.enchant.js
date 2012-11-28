/**
 * @fileOverview
 * mixing.enchant.js
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
        var multipleMixingCombinationFunctionFactory = function(oldFunc,newFunc, key) {
            return function() {
                var firstResult = oldFunc.apply(this,arguments);
                var mixingStore = this._mixing[key];
                this._mixing[key] = function(){};
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
        var voidFunction = function(){};

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
         * @static
         */
        enchant.Class.mixClasses = function(firstClass, secondClass, useOnlyOwnPropertiesForSecondClass, initializeMethod) {
            return enchant.Class.mixClassesFromRecipe(firstClass,secondClass,enchant.Class.MixingRecipe.createFromClass(secondClass, useOnlyOwnPropertiesForSecondClass, [], ['initialize'], []),initializeMethod);
        };
        
        /**
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
