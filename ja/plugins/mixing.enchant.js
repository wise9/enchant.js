/**
 * @fileOverview
 * mixing.enchant.js
 * <p>複数のクラスを混ぜることができるようにし、同じ関数やプロパティを複数のクラスに追加することができるようにするenchant.jsプラグイン.
 * その上、コピーアンドペーストをしないために、製法（{@link enchant.Class.MixingRecipe}）で定義された関数やプロパティを
 * 複数クラスに混ぜることもできるようにする.</p>
 * <p>これで複数の継承ようなことができるということ</p>
 * <p>必要なもの:</p><ul>
 * <li>enchant.js v0.6　以上.</li></ul></p>
 * 詳細は{@link enchant.Class.mixClasses}, {@link enchant.Class.MixingRecipe.createFromClass},
 * {@link enchant.Class.mixClassesFromRecipe}, {@link enchant.Class.MixingRecipe} や
 * {@link enchant.Class.applyMixingRecipe} 参照してください.
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
             * 混ぜる中、どういう風に関数やプロパティが追加されるか設定する新たなMixingRecipeを生成する.
             * クラスからMixingRecipeを生成することには　{@link enchant.Class.MixingRecipe.createFromClass}　を参照してください.
             * @class 混ぜる先にどういう風に混ぜる処理を行うか設定する.
             * このために、MixingRecipeはプロパティが三つある：
             * <ul><li>decorateMethods（先の関数をラップする関数、デコレータ・パターンを参照してください）</li>
             * <li>overrideMethods (先の関数をオーバーライドする関数)</li>
             * <li>overrideProperties　（先のプロパティをオーバーライドするプロパティ）</li></ul>
             * <p>{@link enchant.Class.mixClasses}、 {@link enchant.Class.mixClassesFromRecipe} や {@link enchant.Class.applyMixingRecipe}　を参照してください.</p>
             * @param {Object} decorateMethods 先の関数をラップする関数、デコレータ・パターンを参照してください. 混ぜる結果のクラスでラップされた関数をアクセスするように_mixingというプロパティがある、例：this._mixing.myFunction.apply(this,arguments).<br>（キーと値のペア持っているオブジェクト、キーは関数名、値は関数）.
             * @param {Object} overrideMethods 先の関数をオーバーライドする関数.<br>（キーと値のペア持っているオブジェクト、キーは関数名、値は関数）.
             * @param {Object} properties 先のプロパティをオーバーライドするプロパティ.<br>（キーと値のペア持っているオブジェクト、キーは関数名、値はプロパティデスクリプタ）.
             * @property {Object} decorateMethods 先の関数をラップする関数、デコレータ・パターンを参照してください. 混ぜる結果のクラスでラップされた関数をアクセスするように_mixingというプロパティがある、例：this._mixing.myFunction.apply(this,arguments).<br>（キーと値のペア持っているオブジェクト、キーは関数名、値は関数）.
             * @property {Object} overrideMethods 先の関数をオーバーライドする関数.<br>（キーと値のペア持っているオブジェクト、キーは関数名、値は関数）.
             * @property {Object} overrideProperties 先のプロパティをオーバーライドするプロパティ.<br>（キーと値のペア持っているオブジェクト、キーは関数名、値はプロパティデスクリプタ）.
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
         * 引数のクルスの関数やプロパティから、MixingRecipeを生成する.
         * デフォルト振舞はsourceClassの全ての関数やプロパティ、スーパークラスの関数やプロパティも使用して、
         * 混ぜる先の関数をラップする（decorate).<br>_mixingプロパティでラップされた関数が自動的に、
         * sourceClassと混ぜる先の関数を呼び出されるので、関係なくてもいい.
         * <p>対応引数でデフォルト振舞を変更ができる.</p>
         * 
         * @param {Function<constructor enchant.Classで生成された関数>} sourceClass このクラスから、MixingRecipeが生成される.
         * @param [boolean] onlyOwnProperties Trueの場合、スーパークラスの関数やプロパティが無視されない. 
         * @param [Array<String>] functionOverrideNameList 混ぜるときオーバーライドされる関数名を持っている配列.  
         * @param [Array<String>] functionIgnoreNameList MixingRecipeを生成するとき無視される関数名を持っている配列.  
         * @param [Array<String>] propertyIgnoreNameList MixingRecipeを生成するとき無視されるプロパティ名を持っている配列.
         * @returns {enchant.Class.MixingRecipe}　クラス定義から生成されたMixingRecipe.
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
         * 設定されたMixingRecipeを使用して、firstClassというクラスに実行して、この結果を戻る。設定されたMixingRecipeはsecondClassというクラスに関係があったほうがいい.
         * どちらでもクラスの初期化関数を呼び出すデフォルト初期化関数が追加される.
         * このデフォルト初期か関数の書式は：<br>
         * ([firstClass コンストラクタ 引数 1],...,[firstClass コンストラクタ 引数 n],[secondClass コンストラクタ 引数 1],...[secondClass コンストラクタ 引数 n])</p>
         * <p>どちらでもクラスが変更されない</p>{@link enchant.Class.MixingRecipe}　を参照してください.
         * @param {Function<constructor enchant.Classで生成された関数>} firstClass MixingRecipeを実行されるクラス.
         * @param {Function<constructor enchant.Classで生成された関数>} sourceClass MixingRecipに関係があるクラス。デフォルト初期化関数に使用される。
         * @param {enchant.Class.MixingRecipe} recipe firstClassに実行される製法。 secondClassに関係があったほうがいい.
         * @param [Function] initializeMethod 設定すると、新しいクラスの初期化にデフォルト初期化関数が使用されないけど、この関数が使用される. 
         * @returns {Function<constructor enchant.Classで生成された関数>} 製法でどちらでもクラスを混ぜた結果クラス.
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
         * secondClassというクルスからMixingRecipeを生成して、firstClassというクラスに実行して、この結果を戻る.
         * デフォルト振舞はsecondClassの全ての関数やプロパティ、スーパークラスの関数やプロパティも使用して、
         * 混ぜる先の関数をラップする（decorate).<br>_mixingプロパティでラップされた関数が自動的に、
         * sourceClassと混ぜる先の関数を呼び出されるので、関係なくてもいい.
         * <p>その上、どちらでもクラスの初期化関数を呼び出すデフォルト初期化関数が追加される.このデフォルト初期か関数の書式は：<br>
         * ([firstClass コンストラクタ 引数 1],...,[firstClass コンストラクタ 引数 n],[secondClass コンストラクタ 引数 1],...[secondClass コンストラクタ 引数 n])</p>
         * <p>どちらでもクラスが変更されない</p>{@link enchant.Class.MixingRecipe}　を参照してください.
         * @param {Function<constructor enchant.Classで生成された関数>} firstClass MixingRecipeを実行されるクラス.
         * @param {Function<constructor enchant.Classで生成された関数>} sourceClass このクラスから、MixingRecipeが生成される.
         * @param [boolean] onlyOwnProperties Trueの場合、スーパークラスの関数やプロパティが無視されない. 
         * @param [Function] initializeMethod 設定すると、新しいクラスの初期化にデフォルト初期化関数が使用されないけど、この関数が使用される. 
         * @returns {Function<constructor enchant.Classで生成された関数>} どちらでもクラスを混ぜた結果クラス.
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
         * 設定されたMixingRecipeを先クラスに実行して、新たなクラスを生成してこのクラスを戻る.
         * 先クラスが変更されない.<br>{@link enchant.Class.MixingRecipe}　を参照してください.
         * 
         * @param {Function<constructor enchant.Classで生成された関数>} target MixingRecipeを実行される先クラス.
         * @param {enchant.Class.MixingRecipe} source 先に新しい機能を追加するMixingRecipe.
         * @returns {Function<constructor enchant.Classで生成された関数>} sourceという製法とtargetというクラスを混ぜた結果クラス.
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
