if (webkitAudioContext) {

    enchant.Game._loadFuncs['mp3'] =
    enchant.Game._loadFuncs['aac'] =
    enchant.Game._loadFuncs['m4a'] =
    enchant.Game._loadFuncs['wav'] =
    enchant.Game._loadFuncs['ogg'] = function(src, callback, ext) {
        this.assets[src] = enchant.NeoSound.load(src, 'audio/' + ext, callback);
    };

    enchant.NeoSound = enchant.Class.create(enchant.EventTarget, {
        initialize: function() {
            var actx = enchant.NeoSound.audioContext;
            enchant.EventTarget.call(this);
            this.src = actx.createBufferSource();
            this.buffer = null;
            this._volume = 1;
            this._currentTime = 0;
            this._state = 0;
        },
        play: function() {
            var actx = enchant.NeoSound.audioContext;
            if (this._state == 2) {
                this.src.connect(actx.destination);
            } else {
                if (this._state == 1) {
                    this.src.disconnect(actx.destination);
                }
                this.src = actx.createBufferSource();
                this.src.buffer = this.buffer;
                this.src.gain.value = this._volume;
                this.src.connect(actx.destination);
                this.src.noteOn(0);
            }
            this._state = 1;
        },
        pause: function() {
            var actx = enchant.NeoSound.audioContext;
            this.src.disconnect(actx.destination);
            this._state = 2;
        },
        stop: function() {
            this.src.noteOff(0);
            this._state = 0;
        },
        clone: function() {
            var sound = new enchant.NeoSound();
            sound.buffer = this.buffer;
            return sound;
        },
        dulation: {
            get: function() {
                if (this.buffer) {
                    return this.buffer.dulation;
                } else {
                    return 0;
                }
            }
        },
        volume: {
            get: function() {
                return this._volume;
            },
            set: function(volume) {
                volume = Math.max(0, Math.min(1, volume));
                this._volume = volume;
                if (this.src) {
                    this.src.gain.value = volume;
                }
            }
        },
        currentTime: {
            get: function() {
                window.console.log('currentTime is not allowed');
                return this._currentTime;
            },
            set: function(time) {
                window.console.log('currentTime is not allowed');
                this._currentTime = time;
            }
        }
    });

    enchant.NeoSound.load = function(src, type, callback) {
        var actx = enchant.NeoSound.audioContext;
        var xhr = new XMLHttpRequest();
        var sound = new enchant.NeoSound();
        var mimeType = 'audio/' + enchant.Game.findExt(src);
        // TODO check Audio.canPlayType(mimeType)
        xhr.responseType = 'arraybuffer';
        xhr.open('GET', src, true);
        xhr.onload = function() {
            actx.decodeAudioData(
                xhr.response,
                function(buffer) {
                    sound.buffer = buffer;
                    callback();
                },
                function(error) {
                    // TODO change to enchant Error
                    window.console.log(error);
                }
            );
        };
        xhr.send(null);
        return sound;
    };

    enchant.NeoSound.audioContext = new webkitAudioContext();

}
