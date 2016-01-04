/**
 * @fileOverview
 * wiiu.enchant.js
 * @version 0.1.0
 * @require enchant.js v0.6.0+
 * @author UEI Corporation
 *
 * @description
 * Library for making game for Nintendo wii U
 * ("Wii U" is registered trademark of Nintendo,Inc.)
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
        alert("width: " + window.innerWidth + " height: " + window.innerHeight);
        enchant.Core.apply(this, arguments);

        var label = new Label("");
        this.rootScene.addChild(label);
        var debug = function(str) {
            label.text += str + '<br />';
        };

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
        core.input.rstick = {x: 0, y: 0};
        core.input.lstick = {x: 0, y: 0};

        debug('wiiu?' + (window.wiiu ? "on" : "off"));
        for(var i in window.wiiu){
        }

        if (window.wiiu) {
            core.addEventListener("enterframe", function() {
                /**
                 * watch data from wiiU controller
                 */
                var data = window.wiiu.gamepad.update();
                if (!data.isEnabled) {
                    console.log('Wii U Gamepad is not connected');
                }

                var evt, target;

                core.input = {};

                if (data.lStickX !== prevData.lStickX || data.lStickY !== prevData.lStickY) {
                    evt = new enchant.Event(enchant.Event.L_STICK_MOVE);
                    evt.x = data.lStickX;
                    evt.y = -data.lStickY;
                    core.dispatchEvent(evt);
                }
                core.input['lstick'] = {x: data.lStickX, y: -data.lStickY};

                if (data.rStickX !== prevData.rStickX || data.rStickY !== prevData.rStickY) {
                    evt = new enchant.Event(enchant.Event.R_STICK_MOVE);
                    evt.x = data.rStickX;
                    evt.y = -data.rStickY;
                    core.dispatchEvent(evt);
                }
                core.input['rstick'] = {x: data.rStickX, y: -data.rStickY};

                evt = new enchant.Event(enchant.Event.DEVICE_MOTION);
                core.input['acc'] = {
                    x: evt.x = data.accX,
                    y: evt.y = data.accY,
                    z: evt.z = data.accZ
                };
                core.rootScene.dispatchEvent(evt);

                evt = new enchant.Event(enchant.Event.DEVICE_ORIENTATION);
                core.input['angle'] = {
                    x: evt.x = data.angleX,
                    y: evt.y = data.angleY,
                    z: evt.z = data.angleZ
                };
                core.rootScene.dispatchEvent(evt);

                for(var type in keyEventTable){
                    if(keyEventTable.hasOwnProperty(type)){
                        var bitmask = keyEventTable[type];
                        var hold = data.hold & bitmask;

                        if(hold && !core.input[type]){
                            // Button data: On, Flag: Off -> buttondown
                            core.input[type] = true;
                            evt = new enchant.Event(type + 'buttondown');
                            this.dispatchEvent(evt);
                            debug(type + 'buttondown');
                        }else if(!hold && core.input[type]){
                            // Button data: On, Flag: Off -> buttonup
                            delete core.input[type];
                            evt = new enchant.Event(type  + 'buttonup');
                            this.dispatchEvent(evt);
                            debug(type + 'buttondown');
                        }
                    }
                }
                prevData = data;
            });
        } else {
            console.log('This browser is not wiiU browser.');
        }

    }
});