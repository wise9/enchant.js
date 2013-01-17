/**
 * @fileOverview
 * mixing.enchant.js
 [lang:ja]
 * <p>複数のクラスを混ぜることができるようにし、同じ関数やプロパティを複数のクラスに追加することができるようにするenchant.jsプラグイン.
 * その上、コピーアンドペーストをしないために、製法（{@link enchant.Class.MixingRecipe}）で定義された関数やプロパティを
 * 複数クラスに混ぜることもできるようにする.</p>
 * <p>これで複数の継承ようなことができるということ</p>
 * <p>必要なもの:</p><ul>
 * <li>enchant.js v0.6　以上.</li></ul></p>
 * 詳細は{@link enchant.Class.mixClasses}, {@link enchant.Class.MixingRecipe.createFromClass},
 * {@link enchant.Class.mixClassesFromRecipe}, {@link enchant.Class.MixingRecipe} や
 * {@link enchant.Class.applyMixingRecipe} 参照してください.
 [/lang]
 [lang:en]
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
 [/lang]
 [lang:de]
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
 [/lang]
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
            [lang:ja]
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
            [/lang]
            [lang:en]
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
            [/lang]
            [lang:de]
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
            [/lang]
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
         [lang:ja]
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
         [/lang]
         [lang:en]
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
         [/lang]
         [lang:de]
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
         [/lang]
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
         [lang:ja]
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
         [/lang]
         [lang:en]
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
         [/lang]
         [lang:de]
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
         [/lang]
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
         [lang:ja]
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
         [/lang]
         [lang:en]
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
         [/lang]
         [lang:de]
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
         [/lang]
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
         [lang:ja]
         * 設定されたMixingRecipeを先クラスに実行して、新たなクラスを生成してこのクラスを戻る.
         * 先クラスが変更されない.<br>{@link enchant.Class.MixingRecipe}　を参照してください.
         * 
         * @param {Function<constructor enchant.Classで生成された関数>} target MixingRecipeを実行される先クラス.
         * @param {enchant.Class.MixingRecipe} source 先に新しい機能を追加するMixingRecipe.
         * @returns {Function<constructor enchant.Classで生成された関数>} sourceという製法とtargetというクラスを混ぜた結果クラス.
         [/lang]
         [lang:en]
         * Applies the defined MixingRecipe to the target class creating a new class definition which is then returned.
         * The target class is not modified directly.<br>See also: {@link enchant.Class.MixingRecipe}.
         * 
         * @param {Function<constructor function created with enchant.Class>} target The class to which the recipe will be applied.
         * @param {enchant.Class.MixingRecipe} source The MixingRecipe which is used to add new functionality to the target.
         * @returns {Function<constructor function created with enchant.Class>} The class which is the result of mixing the target class with the source recipe.
         [/lang]
         [lang:de]
         * Wendet das übergebene MixingRecipe auf die Zielklasse an, erstellt eine neue Klassendefinition und liefert diese als Rückgabewert zurück.
         * Die Zielklasse wird nicht modifiziert.<br>Siehe auch: {@link enchant.Class.MixingRecipe}.
         * 
         * @param {Function<constructor Funktion die mit enchant.Class erstellt wurde>} target Die Klasse auf die das MixingRecipe angewendet wird.
         * @param {enchant.Class.MixingRecipe} source Das MixingRecipe, welches genutzt wird um der Zielklasse neue Funktionalität zu verleihen. 
         * @returns {Function<constructor Funktion die mit enchant.Class erstellt wurde>} Die Klasse, welche das Ergebnis des Mixens der Zielklasse (target) mit dem Rezept (source) darstellt. 
         [/lang]
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
