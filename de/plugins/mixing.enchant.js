/**
 * @fileOverview
 * mixing.enchant.js
 * <p>Ein Plugin für enchant.js mit dem es möglich ist, beliebig viele
 * {@link enchant.Class} Klassen zusammen zu mischen.
 * Um Copy & Paste zu vermeiden, ist es auch möglich Funktionen und
 * Properties, die in einem Rezept ({@link enchant.Class.MixingRecipe}) 
 * definiert sind zu beliebig vielen Klassen hinzuzufügen.</p>
 * <p>Durch dies ist es möglich ein Verhalten ähnlich zu multipler Vererbung zu erlangen.</p>
 * <p>Benötigt:<ul>
 * <li>enchant.js v0.6 oder höher.</li></ul></p>
 * Weiterführende Informationen: {@link enchant.Class.mixClasses}, {@link enchant.Class.MixingRecipe.createFromClass}, 
 * {@link enchant.Class.mixClassesFromRecipe}, {@link enchant.Class.MixingRecipe} und 
 * {@link enchant.Class.applyMixingRecipe}
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
             * Erstellt ein neues MixingRecipe, welches beschreibt, auf welche Art und Weise Funktionen und Properties während des Mischens hinzugefügt werden.
             * Um ein Rezept aus einer bereits existierend Klasse zu erstellen, ist auf {@link enchant.Class.MixingRecipe.createFromClass} zu verweisen.
             * @class Diese Klasse beschreibt auf welche Art und Weise das mischen mit der Zielklasse durchgeführt wird.
             * Für diesen Zweck enthählt ein MixingRecipe drei Properties:
             * <ul><li>decorateMethods (Methoden, welche in der Zielklasse dekoriert werden, siehe Dekorierer Entwurfsmuster)</li>
             * <li>overrideMethods (Methoden, welche in der Zielklasse überschrieben werden)</li>
             * <li>overrideProperties (Properties, welche in der Zielklasse redefiniert werden)</li></ul>
             * <p>Siehe auch: {@link enchant.Class.mixClasses}, {@link enchant.Class.mixClassesFromRecipe} und {@link enchant.Class.applyMixingRecipe}.</p>
             * @param {Object} decorateMethods Die Methoden, welche in der Zielklasse dekoriert werden, siehe Dekorierer Entwurfsmuster. Auf die dekoriertie Methode kann in der durch das Mixen erstellten Klasse mit Hilfe des _mixing Property zugegriffen werden, z.B. this._mixing.myFunction.apply(this,arguments).<br>(Objekt welches Schlüssel-Wert Paare enthält, Schlüssel := Funktionsname, Wert := Funktion)
             * @param {Object} overrideMethods Die Methoden, welche in der Zielklasse überschrieben werden.<br>(Objekt welches Schlüssel-Wert Paare enthält, Schlüssel := Funktionsname, Wert := Funktion).
             * @param {Object} properties Die Properties, welche in der Zielklasse redefiniert werden.<br>(Objekt welches Schlüssel-Wert Paare enthält, Schlüssel := Funktionsname, Wert := Propertydescriptor).
             * @property {Object} decorateMethods Die Methoden, welche in der Zielklasse dekoriert werden, siehe Dekorierer Entwurfsmuster. Auf die dekoriertie Methode kann in der durch das Mixen erstellten Klasse mit Hilfe des _mixing Property zugegriffen werden, z.B. this._mixing.myFunction.apply(this,arguments).<br>(Objekt welches Schlüssel-Wert Paare enthält, Schlüssel := Funktionsname, Wert := Funktion)
             * @property {Object} overrideMethods Die Methoden, welche in der Zielklasse überschrieben werden.<br>(Objekt welches Schlüssel-Wert Paare enthält, Schlüssel := Funktionsname, Wert := Funktion).
             * @property {Object} overrideProperties Die Properties, welche in der Zielklasse redefiniert werden.<br>(Objekt welches Schlüssel-Wert Paare enthält, Schlüssel := Funktionsname, Wert := Propertydescriptor).
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
         * Nimmt die Methoden und Properties der übergebenen Klasse um ein neues MixingRecipe zu erstellen.
         * Das Standardverhalten dabei ist, alle Funktionen und Properties der übergebenen Klasse, 
         * einschließlich der Funktionen und Properties in den Superklassen zu nehmen und diese
         * in der Zielklasse beim mixen zu dekorieren.<br>Methoden welche dekoriert werden, rufen
         * automatisch die Methoden der sourceClass und der Zielklasse des Mixens, mit Hilfe des
         * _mixing Properties, auf. Daher muss dies nicht selbst berücksichtigt werden.
         * <p>Durch die entsprechenden Argumente der Funktion kann das Standardverhalten zu verändert werden.</p>
         * 
         * @param {Function<constructor Funktion die mit enchant.Class erstellt wurde>} sourceClass Die Klasse aus der das MixingRecipe erstellt wird.
         * @param [boolean] onlyOwnProperties Wenn dieses Argument true ist, werden Funktionen und Properties der Superklassen ignoriert. 
         * @param [Array<String>] functionOverrideNameList Ein Array welches Namen von Funktionen enthält, welche während des Mixens überschrieben werden sollen. 
         * @param [Array<String>] functionIgnoreNameList Ein Array welches Namen von Funktionen enthält, welche bei der MixingRecipe erstellung ignoriert werden sollen. 
         * @param [Array<String>] propertyIgnoreNameList Ein Array welches Namen von Properties enthält, welche bei der MixingRecipe erstellung ignoriert werden sollen.
         * @returns {enchant.Class.MixingRecipe} Das MixingRecipe, welches aus der Definition der sourceClass erstellt wurde.
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
         * Nutzt das gegebene MixingRecipe, wendet es auf die "firstClass" Klasse an und liefert das Ergebnis daraus zurück - das MixingRecipe sollte der secondClass entsprechen.
         * Eine Standard-Initialisierungsmethode wird hinzugefügt, welche die Initialisierungsmethode beider Klassen aufruft.
         * Die Signatur für diese Standard-Initialisierungsmethode ist:<br>
         * ([firstClass Konstruktor Arg 1],...,[firstClass Konstruktor Arg n],[secondClass Konstruktor Arg 1],...[secondClass Konstruktor Arg n])</p>
         * <p>Beide Klassen werden nicht verändert.</p> Siehe auch: {@link enchant.Class.MixingRecipe}
         * @param {Function<constructor Funktion die mit enchant.Class erstellt wurde>} firstClass Die Klasse auf die das MixingRecipe angewendet wird.
         * @param {Function<constructor Funktion die mit enchant.Class erstellt wurde>} secondClass Die Klasse die dem MixingRecipe entpsricht, wird für die Standard-Initialisierungsmethode genutzt.
         * @param {enchant.Class.MixingRecipe} recipe Das MixingRecipe, welches auf die firstClass Klasse angewendet wird - sollte der secondClass entsprechen.
         * @param [Function] initializeMethod Falls gegeben, wird diese Methode, anstelle der Standard-Initialisierungsmethode, zum Initialisieren der resultierenden Klasse verwendet. 
         * @returns {Function<constructor Funktion die mit enchant.Class erstellt wurde>} Die Klasse, welche das Ergebnis des Mixens beider Klassen mit Hilfe des MixingRecipe darstellt.
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
         * Erstellt ein MixingRecipe aus der "secondClass" Klasse, wendet dieses auf die "firstClass" Klasse an und liefert das Ergebnis daraus zurück.
         * Das Standardverhalten dabei ist, alle Funktionen und Properties der "secondClass" Klasse, 
         * einschließlich der Funktionen und Properties in deren Superklassen zu nehmen und diese
         * in der Zielklasse beim mixen zu dekorieren.<br>Methoden welche dekoriert werden, rufen
         * automatisch die Methoden der sourceClass und der Zielklasse des Mixens, mit Hilfe des
         * _mixing Properties, auf. Daher muss dies nicht selbst berücksichtigt werden.
         * <p>Des Weiteren wird eine Standard-Initialisierungsmethode, welche die Initialisierungsmethode beider Klassen aufruft, hinzugefügt.
         * Die Signatur für diese Standard-Initialisierungsmethode ist:<br>
         * ([firstClass Konstruktor Arg 1],...,[firstClass Konstruktor Arg n],[secondClass Konstruktor Arg 1],...[secondClass Konstruktor Arg n])</p>
         * <p>Beide Klassen werden nicht verändert.</p> Siehe auch: {@link enchant.Class.MixingRecipe}
         * 
         * @param {Function<constructor Funktion die mit enchant.Class erstellt wurde>} firstClass Die Klasse auf die das MixingRecipe angewendet wird.
         * @param {Function<constructor Funktion die mit enchant.Class erstellt wurde>} secondClass Die Klasse aus der das MixingRecipe erstellt wird.
         * @param [boolean] onlyOwnProperties Wenn dieses Argument true ist, werden Funktionen und Properties der Superklassen der "secondClass" Klasse ignoriert. 
         * @param [Function] initializeMethod Falls gegeben, wird diese Methode, anstelle der Standard-Initialisierungsmethode, zum Initialisieren der resultierenden Klasse verwendet. 
         * @returns {Function<constructor Funktion die mit enchant.Class erstellt wurde>} Die Klasse, welche das Ergebnis des Mixens beider Klassen darstellt.
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
         * Wendet das übergebene MixingRecipe auf die Zielklasse an, erstellt eine neue Klassendefinition und liefert diese als Rückgabewert zurück.
         * Die Zielklasse wird nicht modifiziert.<br>Siehe auch: {@link enchant.Class.MixingRecipe}.
         * 
         * @param {Function<constructor Funktion die mit enchant.Class erstellt wurde>} target Die Klasse auf die das MixingRecipe angewendet wird.
         * @param {enchant.Class.MixingRecipe} source Das MixingRecipe, welches genutzt wird um der Zielklasse neue Funktionalität zu verleihen. 
         * @returns {Function<constructor Funktion die mit enchant.Class erstellt wurde>} Die Klasse, welche das Ergebnis des Mixens der Zielklasse (target) mit dem Rezept (source) darstellt. 
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
