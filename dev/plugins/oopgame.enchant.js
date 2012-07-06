/**
 * oopgame.enchant.js
 * @version v0.1 (2012/4/08)
 * @require enchant.js v0.4.3+
 * @author HAZAMA (http://funprogramming.ojaru.jp)
 * 
 * @description
 * 
 * こちらは、enchantを使って大規模なゲームを作りたいという方のためのフレームワークです。
 * オブジェクト指向プログラミングをベースに拡張性豊かなインターフェイスを採用しています。
 * 各クラスの役割はそれぞれのコメントを参照してください。
 * このプラグインには
 *  #外部リソースローダー(xmlやjson)
 *  #xmlファイル内のタグを解釈してゲーム内で使用するためのフレームワーク
 *  #オブジェクトベースの柔軟なユーザーユーザーインプット制御（ただし、マウスやタッチ操作はやや例外）
 *  #タスクベースのゲームロジック実行機能
 *  #マネージャーベースのメインループ
 *  #その他いくつかのユーティリティー関数
 * などが含まれています。
 * 
 * Licensed under the MIT license
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 * 
 * @usage
 *
 *  game.onload = function(){
 *      var stage = new Stage();
 *      var start_screen = new StartScreen(stage.getManager("input"), stage.getManager("task"));
 *      game.currentScene.addChild(stage);
 *      game.currentScene.addChild(start_screen);
 *  }
 */



if(navigator.userAgent.toLowerCase().search("chrome") != -1){   //Chromeだと、funのコンテキストを変えられないようなので、そのWorkaround
    Array.prototype.every = function(fun/*, thisp*/){
        var len = this.length;
        if(typeof fun != "function"){throw new TypeError();}
        
        var thisp = arguments[1];
        for(var i = 0; i < len; ++i){
            if(i in this && !fun.call(thisp, this[i], i, this)){
                return false;
            }
        }
        
        return true;
    };
}

if(!String.prototype.getExpansion){
   
   /**
     * 文字列とRulerに指定したスタイルからその文字列を表示するのに最低限必要な幅と高さを算出する
     * @returns {Object}
     */
    String.prototype.getExpansion = function(){
    	var e = document.getElementById("ruler");
    	var c;
    	while(c = e.lastChild){e.removeChild(c);}
    	var text = e.appendChild(document.createTextNode(this));
    	var expansion = {width : e.offsetWidth, height : e.offsetHeight};
    	e.removeChild(text);
    	return expansion;
    };
}

/**
 * getExpansionで使用するCSSスタイルを設定する。getExpansionを使用するにはメインのHTMLファイルにid="ruler"というdiv要素が必要です。
 * @param style 設定するCSSスタイルの文字列
 * @postcondition styleを考慮した幅と高さがgetExpansionで算出される
 */
function setRulerStyle(style){
	var elem = document.getElementById("ruler");
	var new_style = "display: hidden; position: absolute;" + style;
	elem.setAttribute("style", new_style);
}

if(!String.prototype.fitInWidth){
    
    /**
     * 与えられた幅に収まるようにこの文字列に改行を追加する
     * @param max_width 許容できる最大幅
     * @param num_lines 改行の追加によって何行になったかがこのオブジェクトにセットされる
     * @returns {String} 改行が追加された文字列
     */
    String.prototype.fitInWidth = function(max_width, num_lines){
    	num_lines.val = 1;
    	if(this.length === 0){return "";}
    	if(this.getExpansion().width <= max_width){return this;}
    	var first, last, result = "";
    	for(first = 0; first < this.length; first = last){
    		for(last = this.length; last >= first; --last){
    			var s = this.slice(first, last);
    			if(s.getExpansion().width <= max_width){
    				if(last != this.length){			//文字列の最後には<br>を追加しない
    					s += "<br>";
    					++num_lines.val;
    				}
    				result = result.concat(s);
    				break;
    			}
    		}
    	}
    
    	return result;
    };
}

/**
 * valがlower以上upper未満であるか調べる
 * @param lower
 * @param upper
 * @param val
 * @returns {Boolean}
 */
function isInRange(lower, upper, val){
	return(lower <= val && val < upper);
}

/**
 * valがtargetからrangeの範囲内にあるかどうか調べる
 * @param range
 * @param target
 * @param val
 * @returns {Boolean}
 */
function isInRangeOnValue(range, target, val){
    return(Math.abs(val - target) < range);
}

if(!Array.prototype.contains){
    
    /**
     * この配列に引数のオブジェクトがすでに含まれているかを返す
     * @param obj 調べたいオブジェクト
     * @returns {boolean} 配列にそのオブジェクトが含まれていたかどうか
     */
    Array.prototype.contains = function(obj){
    	return (this.indexOf(obj) != -1);
    };
}

/**
 * スタート画面。
 */
enchant.StartScreen = enchant.Class.create(enchant.Group, {
	initialize : function(input_manager, task_manager){
		enchant.Group.call(this);

        var back = new enchant.Sprite(game.width, game.height);
		back.backgroundColor = "rgba(100, 100, 100, 0.6)";
        this.addChild(back);
        
        this.moveTo(0, 0);
        this.width = game.width;
        this.height = game.height;
		this.selected_menu_num = 0;
		
        var menu_label = new enchant.Label("MENU");
		menu_label.x = game.width / 2 - 50;
		menu_label.y = 100;
		menu_label.font = "normal x-large serif";
		setRulerStyle(" font: " + menu_label.font);
		menu_label.width = menu_label.text.getExpansion().width;
		menu_label.color = "#1212fb";
		menu_label.backgroundColor = "#ffffff";
		this.addChild(menu_label);

		this.menu_labels = [];
        
        /*** -------------
             ここにメニューに表示したいテキストをラベルとしてmenu_labelsに追加する処理を書く
             -------------
        */

		function isInArea(x, y, obj){
			return(obj.x <= x && x <= obj.x + obj.width && obj.y <= y && y <= obj.y + obj._element.clientHeight);
		}
        
        input_manager.setOperator(new enchant.StartOperator(this.menu_labels, this));

		var touched = false, prev_touched_frame = 0;
		this.addEventListener('touchstart', function(e){
            this.menu_labels.every(function(label){
                if(isInArea(e.x, e.y, label)){
                    touched = true;
                    prev_touched_frame = game.frame;
                    return false;
                }
                
                return true;
            });
		});

		this.addEventListener('touchend', function(e){
			if(touched && game.frame - prev_touched_frame <= 20){
                var last_selected = this.selected_menu_num;
				this.menu_labels.every(function(label, index){
    			    if(isInArea(e.x, e.y, label)){
        		        this.selected_menu_num = index;
                        return false;
    			    }
                    
                    return true;
				}, this);

				if(this.selected_menu_num == last_selected){
                    game.input.a = true;
				}else{
                    task_manager.add(new enchant.UpdateMenuTask(task_manager, this.menu_labels, this.selected_menu_num, last_selected));
				}
                
                touched = false;
			}
		});
	}
});

/**
 * 各マネージャーの基底クラス。このクラスから派生してstageに登録してやることでメインループに組み込まれ、そのクラスは
 * 仕事ができるようになります。
 * (クラスベースのオブジェクト指向言語と違って、Javascriptではいつでもプロパティーを追加できるのでベースクラスのinitialize以外の
 * 実装必須なメソッドはコメントアウトしてあります)
 */
enchant.Manager = enchant.Class.create({
    initialize : function(stage){
        this.stage = stage;             //stageへの参照
        this.is_available = true;       //このマネージャーが有効かどうか
    }/*,
    
    update : function(){
    
    }
    */
});

/**
 * ゲーム起動時に非同期で外部からXmlやJsonファイルを読み込んで内部に貯めこむリソースマネージャーです。
 * コンストラクタに必要なファイルのURLとファイルを読み込んだ時の処理を書いたコールバックをそれぞれ配列にして渡すと
 * 勝手に非同期でそれらを読み込んでコールバックに従って適切な処理をした後、内部に溜め込みます。
 * あとは、それらリソースへのアクセサなどを定義してやれば、stage.getManagerメソッドを介して、
 * それらリソースへ自由にアクセスができるようになるという寸法となっております。
 */
enchant.ResourceManager = enchant.Class.create(enchant.Manager, {
	initialize : function(stage, urls, callbacks, xml_accessor, json_accessor){
        enchant.Manager.call(this, stage);
        
		var http_objs = [], xmls = [], jsons = [];
            
        for(var i = 0; i < urls.length; ++i){
            var tmp = new XMLHttpRequest();
            tmp.onreadystatechanged = callbacks[i];
            tmp.open("get", urls[i], true);
            tmp.send(null);
            http_objs.push(tmp);
        }
        
        this.getXml = xml_accessor || function(){
            return xmls;
        };
        
        this.getJson = json_accessor || function(){
            return jsons;
        };
	}
});

/**
 * 外部リソースにXmlファイルを用いたときに活用できると思われるタグマネージャーです。
 * マネージャーといっておきながら、ResourceManagerと同じくゲームのメインループには参加しないupdateメソッドを持たない部類ですが、
 * このクラスはinterpretメソッドによって内部に持ったInterpreterを使用してXmlファイルから読み込んだタグを解釈させることができます。
 * 使い方はInterpreterを継承した解釈したいタグのInterpreterを定義してそれをinitializeメソッド内でchild_interpretersに
 * 登録するだけです。あとは、interpretメソッドを呼び出すたびにタグのタイプを見て自動で使用するinterpreterをマネージャーが判断します。
 * もちろん好みに合わせて他のメソッドやプロパティー、interpretの仕様を変更することもできます。
 */
enchant.TagManager = enchant.Class.create(enchant.Manager, {
    initialize : function(stage){
        enchant.Manager.call(this, stage);
        
        this.xml_manager = null;
        this.label_manager = null;
        this.sound_manager = null;
        this.effect_manager = null;
        
        /**
         * タグを実際に解釈するインタープリタのベースクラス。派生クラスは、interpretメソッドを定義しなければなりません。
         * (クラスベースのオブジェクト指向言語と違って、Javascriptではいつでもプロパティーを追加できるのでベースクラスのinitialize以外の
         * 実装必須なメソッドはコメントアウトしてあります)
         */
        var Interpreter = enchant.Class.create({
            initialize : function(manager){
                this.manager = manager;
            }/*,
            
            interpret : function(){
                
            }
            */
        });
        
        this.child_interpreters = {
            /*ここに上で定義したInterpreterの登録をします
            例：normal : new Interpreter(this)*/
        }
    },
    
    interpret : function(tag_obj){
        if(!this.xml_manager){this.xml_manager = this.stage.getManager("xml");}
        if(!this.label_manager){this.label_manager = this.stage.getManager("label");}
        if(!this.sound_manager){this.sound_manager = this.stage.getManager("sound");}
        if(!this.effect_manager){this.effect_manager = this.stage.getManager("effect");}
        
        this.child_interpreters[tag_obj.type].interpret(tag_obj);
    }
});

/**
 * ゲーム内のサウンドを管理します。使い方は音を鳴らしたいときにaddメソッドに鳴らしたいサウンドファイルのパスを渡すだけです。
 * そうしたら、次にこのマネージャーのupdateメソッドが呼ばれたときに勝手に音が鳴ります。
 * ただ、ボリュームやループ再生をしたい場合にはちょっと変更しなければダメですが・・・
 */
enchant.SoundManager = enchant.Class.create(enchant.Manager, {
	initialize : function(stage){
        enchant.Manager.call(this, stage);
        
        this.queue = [];
	},
    
    /**
     * キューにファイルを追加する
     * @param path 追加するファイルのパス。予めサウンドファイルをenchant.Game.loadを使って読み込んでおく必要がある
     * @returns {Number} このサウンドファイルが再生し終わるまでにかかるフレーム数（他のオブジェクトと同期をとるため）
     */
    add : function(path){
        var tmp = game.assets[path];
        this.queue.push(tmp);
        return game.fps * tmp.duration;
    },
    
    update : function(){
        if(!this.is_available || !game.is_in_game){return;}
        
        this.queue.forEach(function(sound){
            sound.play();
        });
        
        this.queue.splice(0);
    }
});

/**
 * ラベルを管理するクラスです。基本的にはSoundManagerと同じですが、こちらはaddメソッドにenchant.Labelのインスタンスを渡し、
 * ラベルを表示し始める時間、消去する時間を追加で引数に渡す部分が違います。
 * また一意な識別子(id)を付与することでそのオブジェクトをあとから削除することもできます。
 * end_timeに0をセットするとオブジェクトの生存時間の管理をプログラマーがしなければならないため、idを付与し忘れるとそのオブジェクトは
 * 永久にゲーム内に残ることになります。
 */
enchant.LabelManager = enchant.Class.create(enchant.Manager, {
	initialize : function(stage){
        enchant.Manager.call(this, stage);
        
		this.labels = [];
	},

    /**
     * ゲーム内にラベルオブジェクトを追加する
     * @param label 追加するラベルオブジェクト。enchant.Labelのインスタンス
     * @param start_time ラベルオブジェクトを画面に表示し始めるフレーム数
     * @param end_time ラベルオブジェクトを画面から消すフレーム数
     * @param id 一意な識別子
     */
	add : function(label, start_time, end_time, id){
		this.labels.push({obj : label, start_time : (isNaN(start_time)) ? 0 : start_time, end_time : isNaN(end_time) ? 0 : end_time, 
            is_added : false, id : id});
	},
    
    /**
     * ゲームから指定したidのラベルオブジェクトを削除する
     * @param id 削除するラベルのオブジェクト
     * @return {boolean} 削除に成功したかどうか。指定したidのオブジェクトが見つからなければfalseが返ってきます
     */
    remove : function(id){
        return !this.labels.every(function(label, index){
            if(label.id == id){
                this.stage.removeChild(label.obj);
                this.labels.splice(index, 1);
                return false;
            }
            
            return true;
        }, this);
    },

	update : function(){
        if(!this.is_available || !game.is_in_game){return;}
        
		this.labels.forEach(function(label){
			if(!label.is_added && label.start_time <= game.frame){
				this.stage.addChild(label.obj);
				label.is_added = true;
			}
			if(label.end_time <= game.frame){
				this.stage.removeChild(label.obj);
			}
		}, this);

		this.labels = this.labels.filter(function(label){
			return(label.end_time > game.frame);
		});
	}
});

/**
 * 画像を管理するクラスです。使い方などはLabelManagerと共通しています。
 * また一意な識別子(id)を付与することでそのオブジェクトをあとから削除することもできます。
 * end_timeに0をセットするとオブジェクトの生存時間の管理をプログラマーがしなければならないため、idを付与し忘れるとそのオブジェクトは
 * 永久にゲーム内に残ることになります。
 */
enchant.ImageManager = enchant.Class.create(enchant.Manager, {
    initialize : function(stage){
        enchant.Manager.call(this, stage);
        
		this.imgs = [];
	},

    /**
     * ゲーム内に画像オブジェクトを追加する
     * @param image 追加する画像オブジェクト。enchant.Spriteのインスタンス
     * @param start_time 画像オブジェクトを画面に表示し始めるフレーム数
     * @param end_time 画像オブジェクトを画面から消すフレーム数
     * @param id 一意な識別子
     */
	add : function(image, start_time, end_time, id){
		this.imgs.push({obj : image, start_time : (isNaN(start_time)) ? 0 : start_time, end_time : isNaN(end_time) ? 0 : end_time, 
            is_added : false, id : id});
	},
    
    /**
     * ゲームから指定したidの画像オブジェクトを削除する
     * @param id 削除する画像のオブジェクト
     * @return {boolean} 削除に成功したかどうか。指定したidのオブジェクトが見つからなければfalseが返ってきます
     */
    remove : function(id){
        return !this.imgs.every(function(img, index){
            if(img.id == id){
                this.stage.removeChild(img.obj);
                this.imgs.splice(index, 1);
                return false;
            }
            
            return true;
        }, this);
    },

	update : function(){
        if(!this.is_available || !game.is_in_game){return;}
        
		this.imgs.forEach(function(image){
			if(!image.is_added && image.start_time <= game.frame){
				this.stage.addChild(image.obj);
				image.is_added = true;
			}
			if(image.end_time <= game.frame){
				this.stage.removeChild(image.obj);
			}
		}, this);

		this.imgs = this.imgs.filter(function(image){
			return(image.end_time == 0 || image.end_time > game.frame);
		});
	}
});

/**
 * エフェクトを管理します。
 */
enchant.EffectManager = enchant.Class.create(enchant.Manager, {
	initialize : function(stage){
        enchant.Manager.call(this, stage);
        
		this.effects = [];
	},
    
    /**
     * エフェクトを追加します。
     * @param effect 追加するEffectのインスタンス
     * @param id 追加するエフェクトに設定するid
     */
	add : function(effect, id){
        effect.id = id;
		this.effects.push(effect);
	},

    /**
     * 指定したidのエフェクトを削除します。end_timeが設定されていないエフェクトはこのメソッドを明示的に呼び出さない限り
     * いつまでも効果が持続します。
     */
	remove : function(id){
		this.effects.forEach(function(effect, index){
			if(effect.id == id){
				this.effects.splice(index, 1);
			}
		}, this);
	},

	update : function(){
        if(!this.is_available || !game.is_in_game){return;}
        
		this.effects = this.effects.filter(function(effect){
			return (game.frame <= effect.end_time || effect.end_time === 0);
		});

		this.effects.forEach(function(effect){
			effect.update();
		});
	}
});

/**
 * エフェクトの基底クラス
 * end_timeに0をセットすると、明示的にEffectManagerのremoveを呼び出して削除しなければ、そのエフェクトはいつまでも効果が持続することになる
 */
enchant.Effect = enchant.Class.create({
	initialize : function(time_to_end_affecting, time_to_start_affecting, is_dummy){
		this.start_time = (isNaN(time_to_start_affecting)) ? 0 : time_to_start_affecting;
		this.end_time = time_to_end_affecting || 0;
		var is_dummy = (is_dummy != undefined) ? is_dummy : false;
		this.isDummy = function(){return is_dummy;}
	}
});

/**
 * だんだんオブジェクトを出現させるエフェクト。opacityプロパティーを持ったものならなんにでも適用できる
 */
enchant.FadeInEffect = enchant.Class.create(enchant.Effect, {
	initialize : function(targets, time_to_start_affecting, time_to_end_affecting, increasing_rate){
		enchant.Effect.call(this, time_to_end_affecting, time_to_start_affecting);

		this.targets = targets;
		this.targets.forEach(function(target){
			target.opacity = 0;
		});
		this.opacity_increasing_rate = increasing_rate;
	},

	update : function(){
		if(this.start_time <= game.frame && game.frame <= this.end_time){
			this.targets.forEach(function(target){
				target.opacity += this.opacity_increasing_rate;
			}, this);
		}
	}
});

/**
 * だんだんオブジェクトを消していくエフェクト。opacityプロパティーを持ったものならなんにでも適用できる
 */
enchant.FadeOutEffect = enchant.Class.create(enchant.Effect, {
	initialize : function(targets, time_to_start_affecting, time_to_end_affecting, decreasing_rate){
		enchant.Effect.call(this, time_to_end_affecting, time_to_start_affecting);

		this.targets = targets;
		this.targets.forEach(function(target){
			target.opacity = 1;
		});
		this.opacity_decreasing_rate = decreasing_rate;
	},

	update : function(){
		if(this.start_time <= game.frame && game.frame <= this.end_time){
			this.targets.forEach(function(target){
				target.opacity -= this.opacity_decreasing_rate;
			}, this);
		}
	}
});

/**
 * 特定の座標を最小値から最大値の間で振動させるクラス。x,yプロパティーを持つものならなんにでも適用できる
 */
enchant.TimeIndependentVibrationEffect = enchant.Class.create(enchant.Effect, {
	initialize : function(target, min_x, max_x, min_y, max_y, max_rate, time_to_end_affecting, time_to_start_affecting){
		enchant.Effect.call(this, time_to_end_affecting, time_to_start_affecting);

		this.target = target;								//座標を更新する対象となるオブジェクト
		this.min_val = {x : min_x, y : min_y};				//最小値
		this.max_val = {x : max_x, y : max_y};				//最大値
		this.average_val = {x : (min_x + max_x) / 2, y : (min_y + max_y) / 2};
		this.max_rate = max_rate;						//1回の更新で更新できる最大値
	},

	update : function(){
		var diff_x = mersenne.nextInt(this.max_rate), diff_y = mersenne.nextInt(this.max_rate);
		this.target.x += (this.target.x >= this.average_val.x) ? -diff_x : diff_x;
		this.target.y += (this.target.y >= this.average_val.y) ? -diff_y : diff_y;
	}
});

/**
 * Piece.frameをいじるエフェクト
 */
enchant.PieceFrameEffect = enchant.Class.create(enchant.Effect, {
	initialize : function(pieces, frame, time_to_start_affecting){
		enchant.Effect.call(this, time_to_start_affecting + 1, time_to_start_affecting);

		this.targets = pieces;
		this.frame = frame;
	},

	update : function(){
		if(this.start_time <= game.frame && game.frame <= this.end_time){
			this.targets.forEach(function(piece){
				piece.frame = this.frame;
			}, this);
		}
	}
});

/**
 * オブジェクトの透明度を変更するエフェクト
 */
enchant.OpacityChangeEffect = enchant.Class.create(enchant.Effect, {
	initialize : function(pieces, value, time_to_start_affecting){
		enchant.Effect.call(this, time_to_start_affecting + 1, time_to_start_affecting);

		this.targets = pieces;
		this.value = value;
	},

	update : function(){
		if(this.start_time <= game.frame && game.frame <= this.end_time){
			this.targets.forEach(function(piece){
				piece.opacity = this.value;
			}, this);
		}
	}
});

/**
 * タスクのベースとなるクラス。各タスクはこのクラスを継承して実装する。継承したクラスは、executeメソッドを定義して
 * そこに実行すべきゲームロジックを記述する。
 * (クラスベースのオブジェクト指向言語と違って、Javascriptではいつでもプロパティーを追加できるのでベースクラスのinitialize以外の
 * 実装必須なメソッドはコメントアウトしてあります)
 */
enchant.TaskBase = enchant.Class.create({
    initialize : function(task_manager, name){
        this.task_manager = task_manager;
        this.name = name;                   //一意な識別子。デバッグ用
    }/*,
    
    execute : function(){
    
    }*/
});

/**
 * StartScreen内のメニューラベルを更新するタスク。独自のタスクを実装する場合は、このクラスを参照してください
 */
enchant.UpdateMenuTask = enchant.Class.create(enchant.TaskBase, {
    initialize : function(task_manager, menu_labels, selected, last){
        enchant.TaskBase.call(this, task_manager, "UpdateMenu");
        
        this.menu_labels = menu_labels;
        this.selected_menu_num = selected;
        this.last_selected = last;
    },
    
    execute : function(){
        if(this.selected_menu_num != this.last_selected){
        	this.menu_labels[this.last_selected].color = "#000000";
			this.menu_labels[this.selected_menu_num].color = "rgb(233, 109, 140)";
		}
    }
});

/**
 * タスクを管理します。そのフレームに処理すべきタスクを保持しておき、毎フレーム実行します。
 * 実行が終わったタスクはすべてキューから取り除かれます。キューは毎フレーム一旦クリアされてしまうことに注意してください。
 * もし２フレーム以上同じタスクを使い続けたい場合は、そのタスクのexecuteメソッド内で自分をTaskManagerに登録する必要があります。
 * （まあ別に登録する部分はどこでもいいですけどね。execute内でthis.task_manager.add(this)などとやるのが一番ラクだと思うので）
 */
enchantTaskManager = enchant.Class.create(enchant.Manager, {
    initialize : function(stage){
        enchant.Manager.call(this, stage);
        
        this.queue = [];    //処理すべきTaskQueue
        this.buffer = [];   //Task内からTaskを追加できるように一時保存領域を用意しておく
    },
    
    add : function(task){
        this.buffer.push(task);
        if(!this.is_available){this.is_available = true;}
    },
    
    update : function(){
        if(!this.is_available || !game.is_in_game){return;}
        
        this.queue.forEach(function(task){
            task.execute();
        });
        
        this.queue = this.buffer;
        if(!this.buffer.length){this.is_available = false;}
        this.buffer = [];
    }
});

/**
 * ユーザーインプット制御の基底クラス。派生クラス内に実際にユーザーインプットを受けたときに実行すべき処理を記述します。
 * 派生クラスは、自分が処理すべきユーザーインプットに対応したoperate**メソッドをすべて実装する必要があります。
 * （**にはUp,DownなどInputManager内に記述した各ユーザーインプットに対応したエイリアス名が入ります）
 */
enchant.InputOperator = enchant.Class.create({
    initialize : function(){
        this.input_manager = null;
    }/*,
    
    setInputManager : function(input_manager){
    
    },
    
    operate** : function(){
    
    }
    ...
    */
});

/**
 * StartScreen内で使われるInputOperator。独自のInputOperatorを実装するときはこのクラスを参照してください
 */
enchant.StartOperator = enchant.Class.create(enchant.InputOperator, {
    initialize : function(menu_labels, screen){
        enchant.InputOperator.call(this);
        
        this.task_manager = null;           //わかりやすいようにこのクラス内で使うmanagerへの参照を宣言しておく
        this.menu_labels = menu_labels;
        this.screen = screen;
    },
    
    setInputManager : function(input_manager){
        this.input_manager = input_manager;
        this.task_manager = input_manager.stage.getManager("task");     //このクラス内で使うmanagerの参照を実際に設定する
    },
    
    operateUp : function(){
        var last_selected_num = this.screen.selected_menu_num;
        this.screen.selected_menu_num = (this.screen.selected_menu_num + (this.menu_labels.length - 1)) % this.menu_labels.length;
        this.task_manager.add(new enchant.UpdateMenuTask(this.task_manager, this.menu_labels, this.screen.selected_menu_num, last_selected_num));
    },
    
    operateDown : function(){
        var last_selected_num = this.screen.selected_menu_num;
        this.screen.selected_menu_num = (this.screen.selected_menu_num + 1) % this.menu_labels.length;
        this.task_manager.add(new enchant.UpdateMenuTask(this.task_manager, this.menu_labels, this.screen.selected_menu_num, last_selected_num));
    },
    
    operateA : function(){
        game.currentScene.removeChild(this.screen);
        /** -------------
            ここに各モードの初期化処理を書く
            -------------
        */
    }
});

/**
 * ユーザーインプットを処理するクラス。ユーザーから何らかの入力があったら、このクラスを介して各InputOperatorにイベントが斡旋されます。
 * 使い方は、ユーザーインプットへのリアクションを変えたい位置で目的のInputOperatorのインスタンスを生成してこのクラスのsetOperatorに
 * セットするだけです。ユーザーインプットの種類は必要に応じて増やすことができます。
 */
enchant.InputManager = enchant.Class.create(enchant.Manager, {
    initialize : function(stage){
        enchant.Manager.call(this, stage);
        
        this.operator = null;
    },
    
    setOperator : function(operator){
        this.operator = operator;
        operator.setInputManager(this);
    },
    
    update : function(){
        if(!this.is_available){return;}
        
        if(game.input.left && this.operator.operateLeft){
    		this.operator.operateLeft();
			game.input['left'] = false;
		}else if(game.input.right && this.operator.operateRight){
			this.operator.operateRight();
			game.input['right'] = false;
		}else if(game.input.up && this.operator.operateUp){
			this.operator.operateUp();
			game.input['up'] = false;
		}else if(game.input.down && this.operator.operateDown){
			this.operator.operateDown();
			game.input['down'] = false;
		}else if(game.input.a && this.operator.operateA){
			this.operator.operateA();
			game.input['a'] = false;
		}else if(game.input.b && this.operator.operateB){
			this.operator.operateB();
			game.input['b'] = false;
		}else if(game.input.c && this.operator.operateC){
			this.operator.operateC();
			game.input['c'] = false;
		}
    }
});

/**
 * 画面上に表示されるオブジェクトの親兼、各マネージャーの取りまとめ役。他のマネージャーにアクセスする必要が出た場合には、
 * このStage.getManagerを介して他のマネージャーへの参照を得ることができます。また、各マネージャーはこのクラスのinitialize内の
 * managersに直接インスタンスを生成するのが手っ取り早く簡潔に書けると思います。
 */
enchant.Stage = enchant.Class.create(enchant.Group, {
	initialize : function(){
		enchant.Group.call(this);
        
        game.is_in_game = true;                //ゲーム中かどうか。ポーズなどの間、falseに設定しておくとゲーム自体を停止できます

        var files = ["Effects.xml"];            //外部リソースのファイルパスを設定
        var callbacks = [function(){}];         //そのリソースに施す処理をコールバックで定義
        var resource_manager = new enchant.ResourceManager(this, files, callbacks);    //ResourceManagerの初期化。filesやcallbacksは必要に応じて書き換えてください
        //各マネージャーをinstantiateすると同時にstageに登録する。ただし、ここに書いただけではupdateは呼ばれない
        var managers = {resource : resource_manager, tag : new enchant.TagManager(this), sound : new enchant.SoundManager(this), label : new enchant.LabelManager(this),
            effect : new enchant.EffectManager(this), input : new enchant.InputManager(this), task : new enchant.TaskManager(this), image : new enchant.ImageManager(this)
        };
        
        /*ゲームのメインループに参加するマネージャーを登録する。ここにも書いて初めて毎フレーム、updateが呼ばれるようになる
        ここに記述した順にマネージャーのupdateメソッドが呼ばれるので、順番にも注意してください*/
        var array = [managers.input, managers.task, managers.effect, managers.label, managers.image, managers.sound];
        var back = new enchant.Sprite(game.width, game.height);
    	back.backgroundColor = "#ebebeb";           //背景を設定。必要に応じて変更してください
        
		this.addChild(back);
        
        /**
         * 独自定義のマネージャーを登録する
         * @param name 登録するマネージャー名
         * @param manager 登録するマネージャーインスタンス
         * @param is_updatable 毎フレームupdateメソッドを呼ぶか
         */
        this.addManager = function(name, manager, is_updatable){
            managers[name] = manager;
            if(is_updatable){array.push(manager);}
        };
        
        /**
         * 登録されているマネージャーインスタンスを取得する
         * @param name 取得するマネージャー名
         */
        this.getManager = function(name){
            return managers[name];
        };
        
        this.addEventListener('enterframe', function(){
            array.forEach(function(manager){
                manager.update();
            });
        });
        
        /**
         * ゲーム画面の中央にラベルを表示します
         * @param text ラベルにセットするテキスト
         * @param params {Object} 様々なパラメータ(style : CSS形式のスタイル指定文字列, start_time : LabelManager.addに渡すstart_timeパラメータ
         * , end_time : LabelManager.addに渡すend_timeパラメータ, x : align.xがfalseのときのx座標, y : align.yがfalseのときのy座標,
         * auto_show : 自動で画面に表示するかどうか)
         * @param align {Object} X軸方向とY軸方向のうちどの方向を中心に揃えるかを指定するフラグ(x : trueならX軸方向を中心に揃える,
         * y : trueならY軸方向を中心に揃える)
         * @returns {Object} 追加したenchant.Labelオブジェクト
         */
        this.createLabelAtCenter = function(text, params, align){
            var label = new enchant.Label(text);
            var styles = this.interpretStyle(params.style);
            styles.forEach(function(style){
                label._style[style.name] = style.content;
            });
            
            setRulerStyle(params.style);
            var size = text.getExpansion();
            label.moveTo((align.x) ? game.width / 2 - size.width / 2 : params.x,
                (align.y) ? game.height / 2 - size.height / 2 : params.y);
            label.width = size.width;
            if(params.auto_show){managers.label.add(label, params.start_time, params.end_time, params.id);}
            return label;
        };
	},
    
    /**
     * CSS形式で記述されたスタイル指定文字列を解析してプロパティー名をキー、その設定を値とするオブジェクトに変換する
     * タグマネージャーを使用してxmlファイルから読み込んだタグを解釈するときなどに使用できるでしょう。
     * なお、enchantのシステム上positionプロパティーを変更してしまうとenchantのシステムに破綻をきたす可能性があるので
     * 処理対象から除外してあります。
     * @param str 解釈するCSS文字列
     * @returns {Object} 
     */
    interpretStyle : function(str){
		var styles = [];
		while(str){
			var result;
			if(result = str.match(/^[ \t]+/)){

			}else if((result = str.match(/^([\w\-]+)\s*:\s*([^;]+);?/)) && result[1] != "position"){
				styles.push({name : result[1], content : result[2]});
			}

			str = str.substring(result[0].length);
		}

		return styles;
	}
});