/**
 * @fileOverview
 * wiiu.enchant.js
 * @version 0.1.0
 * @require enchant.js v0.6.0+
 * @author Ubiquitous Entertainment Inc.
 *
 * @description
 * Library for making game for Nintendo wii U
 [/lang]
 */

/**
 * plugin namespace object
 * @namespace
 * @type {Object}
 */
enchant.wiiu = {};

enchant.Event.L_STICK_MOVE = 'lstickmove';
enchant.Event.R_STICK_MOVE = 'rstickmove';
enchant.Event.DEVICE_MOTION = 'devicemotion';
enchant.Event.DEVICE_ORIENTATION = 'deviceorientation';

enchant.wiiu.Core = enchant.Class.create(enchant.Core, {
    initialize: function() {
        enchant.Core.apply(this, arguments);

        /**
         * disable default keybind
         */
        this._keybind = {};

        var touched = false;
        var prevData = {};
        var pushed = {};

        var keyEventTable = {
            'a': 0x8000,
            'b': 0x4000,
            'x': 0x2000,
            'y': 0x1000,
            'l': 0x0020,
            'r': 0x0010,
            'zl': 0x0080,
            'zr': 0x0040,
            'up': 0x0200,
            'down': 0x0100,
            'right': 0x0800,
            'left': 0x0400
        };
        var core = this;


        if (window.wiiu) {
            this.addEventListener("enterframe", function() {
                /**
                 * watch data from wiiU controller
                 */
                var data = window.wiiu.update();
                console.log(data);
                if (!data.isEnabled) {
                    console.log('This browser is not wiiU browser.');
                }

                var evt, target;

//                if (data.lStickX !== prevData.lStickX || data.lStickY !== prevData.lStickY) {
                    evt = new enchant.Event(enchant.Event.L_STICK_MOVE);
                    evt.x = data.lStickX;
                    evt.y = data.lStickY;
                    console.log(evt.type, evt, enchant.Event.L_STICK_MOVE);
                    this.rootScene.dispatchEvent(evt);
//                }

//                if (data.rStickX !== prevData.rStickX || data.rStickY !== prevData.rStickY) {
                    evt = new enchant.Event(enchant.Event.R_STICK_MOVE);
                    evt.x = data.rStickX;
                    evt.y = data.rStickY;
                    this.rootScene.dispatchEvent(evt);
//                }

                evt = new enchant.Event(enchant.Event.DEVICE_MOTION);
                evt.x = data.accX;
                evt.y = data.accY;
                evt.z = data.accZ;
                this.rootScene.dispatchEvent(evt);

                evt = new enchant.Event(enchant.Event.DEVICE_ORIENTATION);
                evt.x = data.angleX;
                evt.y = data.angleY;
                evt.z = data.angleZ;
                this.rootScene.dispatchEvent(evt);

                for(var type in keyEventTable){
                    if(keyEventTable.hasOwnProperty(type)){
                        var bitmask = keyEventTable[type];
                        var hold = data.hold & bitmask;
                        if(hold && !core.input[type]){
                            // Button data: On, Flag: Off -> buttondown
                            pushed[type] = true;
                            evt = new enchant.Event(button + 'buttondown');
                            this.dispatchEvent(evt);
                        }else if(!hold && core.input[type]){
                            // Button data: On, Flag: Off -> buttonup
                            delete pushed[type];
                            evt = new enchant.Event(button + 'buttonup');
                            this.dispatchEvent(evt);
                        }
                    }
                    this.addEventListener(type + 'buttondown', function(e) {
                        var inputEvent;
                        if (!this.input[type]) {
                            this.input[type] = true;
                            inputEvent = new enchant.Event((c++) ? 'inputchange' : 'inputstart');
                            this.dispatchEvent(inputEvent);
                        }
                        this.currentScene.dispatchEvent(e);
                        if (inputEvent) {
                            this.currentScene.dispatchEvent(inputEvent);
                        }
                    });
                    this.addEventListener(type + 'buttonup', function(e) {
                        var inputEvent;
                        if (this.input[type]) {
                            this.input[type] = false;
                            inputEvent = new enchant.Event((--c) ? 'inputchange' : 'inputend');
                            this.dispatchEvent(inputEvent);
                        }
                        this.currentScene.dispatchEvent(e);
                        if (inputEvent) {
                            this.currentScene.dispatchEvent(inputEvent);
                        }
                    });
                }
                prevData = data;
            });
        } else {
            console.log('This browser is not wiiU browser.');
        }

    }
});