/**
 * oopgame.enchant.js
 * @version v0.1 (2012/4/08)
 * @require enchant.js v0.4.3+
 * @author HAZAMA (http://funprogramming.ojaru.jp)
 * 
 * @description
 * 
 * A framework for developing a big game based on enchant.js.
 * Because it is designed in OOP style you can easily expand the game later on.
 * Comments above each class's definition must describe itself.
 * This plugin includes
 *  #Resource loader(xml and json)
 *  #The framework for interpreting xml tags
 *  #Flexible operation on user inputs based on objects(except for mouse and touch interfaces which require additional work)
 *  #Game logics driven by tasks
 *  #The program's main loop consisted of managers
 *  #And some other utility functions
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



if(navigator.userAgent.toLowerCase().search("chrome") != -1){   //Just a workaround for chrome since its every method doesn't seem to allow you to change the context of the fun object
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
     * Calculates the width and height of a string based on the style set in "ruler"
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
 * Sets the "ruler" style. The getExpansion method requires you to have a div element with id "ruler" in your HTML.
 * @param style The CSS style in string
 * @postcondition getExpansion gives you the size of a string based on the style set by this function
 */
function setRulerStyle(style){
	var elem = document.getElementById("ruler");
	var new_style = "display: hidden; position: absolute;" + style;
	elem.setAttribute("style", new_style);
}

if(!String.prototype.fitInWidth){
    
    /**
     * Makes the string fit into a certain width
     * @param max_width Max allowed width
     * @param num_lines This object will indicate how many lines the string has after calling this method
     * @returns {String} The resulting string
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
    				if(last != this.length){			//We don't need to add a <br> to the end of the string.
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
 * Checks "val" is over "lower" and smaller than "upper"
 * @param lower
 * @param upper
 * @param val
 * @returns {Boolean}
 */
function isInRange(lower, upper, val){
	return(lower <= val && val < upper);
}

/**
 * Checks "val" is in the range of "range" from "target"
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
     * Inspects the array contains the object
     * @param obj The object to be checked
     * @returns {boolean} Whether the array contains the object
     */
    Array.prototype.contains = function(obj){
    	return (this.indexOf(obj) != -1);
    };
}

/**
 * The start screen
 */
var StartScreen = enchant.Class.create(enchant.Group, {
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
             Write menus definitions here
             -------------
        */

		function isInArea(x, y, obj){
			return(obj.x <= x && x <= obj.x + obj.width && obj.y <= y && y <= obj.y + obj._element.clientHeight);
		}
        
        input_manager.setOperator(new StartOperator(this.menu_labels, this));

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
                    task_manager.add(new UpdateMenuTask(task_manager, this.menu_labels, this.selected_menu_num, last_selected));
				}
                
                touched = false;
			}
		});
	}
});

/**
 * Base class for managers. To make managers work properly, inherit from this class and register it to the stage object.
 * (Because different from the class-base programming languages Javascript allows you to add properties to objects at any time
 * I comment out the methods required to be implemented other than the initialize method.)
 */
var Manager = enchant.Class.create({
    initialize : function(stage){
        this.stage = stage;             //the reference to the stage object
        this.is_available = true;       //whether the manager is available or not
    }/*,
    
    update : function(){
    
    }
    */
});

/**
 * This class reads resources such as XML and JSON asynchronously and stores them inside.
 * To use the class, you just need to pass URLs to the files that need to be read and callbacks that applied on them to the constructor.
 * Note that you should define the accessors to the resources by yourself.
 */
var ResourceManager = enchant.Class.create(Manager, {
	initialize : function(stage, urls, callbacks, xml_accessor, json_accessor){
        Manager.call(this, stage);
        
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
 * This class can be useful if you use XML files for additional resources.
 * Despite of the name containing "Manager" part, TagManager, as well as ResourceManager, doesn't have the update method
 * since it only handles data manipulation.
 * This class has some interpreters inside and make them interpreting tags defined in XML files.
 * To do that, you must define interpreter classes inside the initialize method and instantiate and register them to the TagManager's
 * interpreters object. And then the interpret method can do the work for you.
 */
var TagManager = enchant.Class.create(Manager, {
    initialize : function(stage){
        Manager.call(this, stage);
        
        this.xml_manager = null;
        this.label_manager = null;
        this.sound_manager = null;
        this.effect_manager = null;
        
        /**
         * Base class for interpreters. Classes inherited from this must implement the "interpret" method.
         * (Because different from the class-base programming languages Javascript allows you to add properties to objects at any time
         * I comment out the methods required to be implemented other than the initialize method.)
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
            /*Register the interpreters here
            e.g.：normal : new Interpreter(this)*/
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
 * This class manipulate sounds. All you have to do is to call the "add" method with a path to the sound file that you want to play
 * and the sound will play when the "update" method is called next time.
 * Unfortunately you must do some additional work to change the volume or to play the sound in loop.
 */
var SoundManager = enchant.Class.create(Manager, {
	initialize : function(stage){
        Manager.call(this, stage);
        
        this.queue = [];
	},
    
    /**
     * Add the sound to the queue.
     * @param path The path to the sound file. The file needs to be loaded using the enchant.Game.Load method before calling this method.
     * @returns {Number} The frame count in which the sound finishes playing(for synchronizing)
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
 * This class manages labels. Basically it is almost identical to SoundManager except that the "add" method takes two extra arguments.
 * And passing id argument allows you to manipulate the same object later on.
 * Note that if you pass 0 to the "end_time" parameter and forget defining the id, the object will have no chance to be destroyed.
 */
var LabelManager = enchant.Class.create(Manager, {
	initialize : function(stage){
        Manager.call(this, stage);
        
		this.labels = [];
	},

    /**
     * Adds a label.
     * @param label An enchant.Label instance to be added
     * @param start_time The frame count at which the object should appear on the screen
     * @param end_time The frame count at which the object should disappear.
     * @param id A unique id
     */
	add : function(label, start_time, end_time, id){
		this.labels.push({obj : label, start_time : (isNaN(start_time)) ? 0 : start_time, end_time : isNaN(end_time) ? 0 : end_time, 
            is_added : false, id : id});
	},
    
    /**
     * Removes the label with the id.
     * @param id An id
     * @return {boolean} Whether the operation is successful or not. Returns false if it can't find a lable with the id
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
 * Manager of images. You can use the class in the same way as LabelManager.
 * And passing id argument allows you to manipulate the same object later on.
 * Note that if you pass 0 to the "end_time" parameter and forget defining the id, the object will have no chance to be destroyed.
 */
var ImageManager = enchant.Class.create(Manager, {
    initialize : function(stage){
        Manager.call(this, stage);
        
		this.imgs = [];
	},

    /**
     * Adds an image.
     * @param image An enchant.Sprite instance to be added
     * @param start_time The frame count at which the object should appear on the screen
     * @param end_time The frame count at which the object should disappear.
     * @param id An id
     */
	add : function(image, start_time, end_time, id){
		this.imgs.push({obj : image, start_time : (isNaN(start_time)) ? 0 : start_time, end_time : isNaN(end_time) ? 0 : end_time, 
            is_added : false, id : id});
	},
    
    /**
     * Removes the image with the id.
     * @param id An id
     * @return {boolean} Whether the operation is successful or not. Returns false if it can't find a lable with the id
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
 * Manages effects.
 */
var EffectManager = enchant.Class.create(Manager, {
	initialize : function(stage){
        Manager.call(this, stage);
        
		this.effects = [];
	},
    
    /**
     * Adds an effect.
     * @param effect An effect instance to be added
     * @param id An unique id
     */
	add : function(effect, id){
        effect.id = id;
		this.effects.push(effect);
	},

    /**
     * Removes the effect with the id
     * @param id An id
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
 * Base class for Effects. If you omit the "time_to_end_affecting" parameter you must manage the life time of those effects.
 */
var Effect = enchant.Class.create({
	initialize : function(time_to_end_affecting, time_to_start_affecting){
		this.start_time = (isNaN(time_to_start_affecting)) ? 0 : time_to_start_affecting;
		this.end_time = time_to_end_affecting || 0;
	}
});

/**
 * This fades in specific objects. Can be applied to any objects that have the "opacity" property.
 */
var FadeInEffect = enchant.Class.create(Effect, {
	initialize : function(targets, time_to_start_affecting, time_to_end_affecting, increasing_rate){
		Effect.call(this, time_to_end_affecting, time_to_start_affecting);

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
 * This fades out spcific objects. Other things are identical to FadeInEffect class.
 */
var FadeOutEffect = enchant.Class.create(Effect, {
	initialize : function(targets, time_to_start_affecting, time_to_end_affecting, decreasing_rate){
		Effect.call(this, time_to_end_affecting, time_to_start_affecting);

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
 * This class makes objects vibrating between the maximum and minimum value. Can be applied to any objects that have "x" and "y" properties.
 */
var TimeIndependentVibrationEffect = enchant.Class.create(Effect, {
	initialize : function(target, min_x, max_x, min_y, max_y, max_rate, time_to_end_affecting, time_to_start_affecting){
		Effect.call(this, time_to_end_affecting, time_to_start_affecting);

		this.target = target;								//the target object
		this.min_val = {x : min_x, y : min_y};				//mininun values
		this.max_val = {x : max_x, y : max_y};				//maximum values
		this.average_val = {x : (min_x + max_x) / 2, y : (min_y + max_y) / 2};
		this.max_rate = max_rate;						//the maximum value by which the object moves at a frame
	},

	update : function(){
		var diff_x = mersenne.nextInt(this.max_rate), diff_y = mersenne.nextInt(this.max_rate);
		this.target.x += (this.target.x >= this.average_val.x) ? -diff_x : diff_x;
		this.target.y += (this.target.y >= this.average_val.y) ? -diff_y : diff_y;
	}
});

/**
 * The effect changes the "frame" property of enchant.Sprite instances.
 */
var PieceFrameEffect = enchant.Class.create(Effect, {
	initialize : function(pieces, frame, time_to_start_affecting){
		Effect.call(this, time_to_start_affecting + 1, time_to_start_affecting);

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
 * This class operates on the "opacity" property.
 */
var OpacityChangeEffect = enchant.Class.create(Effect, {
	initialize : function(pieces, value, time_to_start_affecting){
		Effect.call(this, time_to_start_affecting + 1, time_to_start_affecting);

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
 * Base class for Tasks. You must define the various game logics inside the "execute" method.
 * (Because different from the class-base programming languages Javascript allows you to add properties to objects at any time
 * I comment out the methods required to be implemented other than the initialize method.)
 */
var TaskBase = enchant.Class.create({
    initialize : function(task_manager, name){
        this.task_manager = task_manager;
        this.name = name;                   //A unique name. Can be useful for debugging
    }/*,
    
    execute : function(){
    
    }*/
});

/**
 * Updates the menus inside the StartScreen. Can be a handy example of defining your own tasks.
 */
var UpdateMenuTask = enchant.Class.create(TaskBase, {
    initialize : function(task_manager, menu_labels, selected, last){
        TaskBase.call(this, task_manager, "UpdateMenu");
        
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
 * Manages tasks. This class holds tasks and executes them at every frame.
 * Note that every time all the queued tasks are executed it clears up the queue.
 * So if you want to execute a certain task for over 2 frames, you should register the task from inside itself.
 */
var TaskManager = enchant.Class.create(Manager, {
    initialize : function(stage){
        Manager.call(this, stage);
        
        this.queue = [];    //The queue of tasks
        this.buffer = [];   //Buffer for tasks. It allows you to add tasks from inside a task.
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
 * Base class for operations of user inputs. The inherited classes can specify the behaviors against paticular user inputs.
 * So the inherited classes must implement all of the "operate**" methods in which it is interested.
 * (The "**" represents an alias defined in the InputManager's update method such as "Up", "Down", "A" etc.)
 */
var InputOperator = enchant.Class.create({
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
 * The input operator used in StartScreen. And it can help you define your own InputOperators.
 */
var StartOperator = enchant.Class.create(InputOperator, {
    initialize : function(menu_labels, screen){
        InputOperator.call(this);
        
        this.task_manager = null;           //A reference to the task_manager object
        this.menu_labels = menu_labels;
        this.screen = screen;
    },
    
    setInputManager : function(input_manager){
        this.input_manager = input_manager;
        this.task_manager = input_manager.stage.getManager("task");     //Set an actual reference
    },
    
    operateUp : function(){
        var last_selected_num = this.screen.selected_menu_num;
        this.screen.selected_menu_num = (this.screen.selected_menu_num + (this.menu_labels.length - 1)) % this.menu_labels.length;
        this.task_manager.add(new UpdateMenuTask(this.task_manager, this.menu_labels, this.screen.selected_menu_num, last_selected_num));
    },
    
    operateDown : function(){
        var last_selected_num = this.screen.selected_menu_num;
        this.screen.selected_menu_num = (this.screen.selected_menu_num + 1) % this.menu_labels.length;
        this.task_manager.add(new UpdateMenuTask(this.task_manager, this.menu_labels, this.screen.selected_menu_num, last_selected_num));
    },
    
    operateA : function(){
        game.currentScene.removeChild(this.screen);
        /** -------------
            Initialize objects that provides actual "gaming" here.
            -------------
        */
    }
});

/**
 * This class manages user inputs. The class receives user inputs from enchant and invokes a corresponding "operate**" method.
 * You can change the reactions to such user inputs by setting a different operator. And you can increase the number of user inputs
 * up to as many as you want.
 */
var InputManager = enchant.Class.create(Manager, {
    initialize : function(stage){
        Manager.call(this, stage);
        
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
 * It's the root object of other displayable objects and the parent of managers. I recommend that you instantiate the managers inside
 * the "initialize" method of this class.
 */
var Stage = enchant.Class.create(enchant.Group, {
	initialize : function(){
		enchant.Group.call(this);
        
        game.is_in_game = true;                //Whether we're in game or not. You can stop the whole game system by setting it to false.

        var files = ["Effects.xml"];            //Specify the paths to resource files.
        var callbacks = [function(){}];         //Define the callbacks which should be applied to them
        var resource_manager = new ResourceManager(this, files, callbacks);    //Initialize the ResourceManager.
        //Instantiate and register managers to the stage. An extra work needs to be done in order for update method of each manager to be called every frame.
        var managers = {resource : resource_manager, tag : new TagManager(this), sound : new SoundManager(this), label : new LabelManager(this),
            effect : new EffectManager(this), input : new InputManager(this), task : new TaskManager(this), image : new ImageManager(this)
        };
        
        /*Specify which manager's update method must be called at every frame.
        Note also that the managers will be called in the order as in the array definition.*/
        var array = [managers.input, managers.task, managers.effect, managers.label, managers.image, managers.sound];
        var back = new enchant.Sprite(game.width, game.height);
    	back.backgroundColor = "#ebebeb";           //Set the background
        
		this.addChild(back);
        
        this.getManager = function(name){
            return managers[name];
        };
        
        this.addEventListener('enterframe', function(){
            array.forEach(function(manager){
                manager.update();
            });
        });
        
        /**
         * Creates a label which should appear at the center of the screen.
         * @param text The text set on the label
         * @param params {Object} Various parameters(style : The CSS style, start_time : The "start_time" parameter passed to the
         * LabelManager.add method, end_time : The "end_time" parameter passed to the LabelManager.add method, x : The x coordinate
         * if "align.x" is false, y : The y coordinate if "align.y" is false, auto_show : Whether the label should automatically appear
         * on the screen)
         * @param align {Object} Flags to indicate which axis the label should be aligned along(x : If true the center of the label 
         * along the X axis must match that of the screen, y : If true the center of the label along the Y axis must match that of the screen)
         * @returns {Object} The enchant.Label instance that's been created
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
     * Interprets a CSS string and converts it into an object whose keys are the CSS property names and values are the corresponding values.
     * I assume that it is useful when you use an XML file as some kind of script.
     * Note that it ignores the "position" property because it may cause a problem to the enchant system.
     * @param str The string to be inspected
     * @returns {Object} The resulting object
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