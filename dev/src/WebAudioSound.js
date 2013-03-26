
window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext || window.msAudioContext || window.oAudioContext;

/**
 * @scope enchant.WebAudioSound.prototype
 * @type {*}
 */
enchant.WebAudioSound = enchant.Class.create(enchant.EventTarget, {
    /**
     * @name enchant.WebAudioSound
     * @class
     * Sound wrapper class for Web Audio API (supported on some webkit-based browsers)
     *
     * @constructs
     */
    initialize: function() {
        if(!window.webkitAudioContext){
            throw new Error("This browser does not support WebAudio API.");
        }
        var actx = enchant.WebAudioSound.audioContext;
        enchant.EventTarget.call(this);
        this.src = actx.createBufferSource();
        this.buffer = null;
        this._volume = 1;
        this._currentTime = 0;
        this._state = 0;
        this.connectTarget = enchant.WebAudioSound.destination;
    },
    play: function(dup) {
        var actx = enchant.WebAudioSound.audioContext;
        if (this._state === 2) {
            this.src.connect(this.connectTarget);
        } else {
            if (this._state === 1 && !dup) {
                this.src.disconnect(this.connectTarget);
            }
            this.src = actx.createBufferSource();
            this.src.buffer = this.buffer;
            this.src.gain.value = this._volume;
            this.src.connect(this.connectTarget);
            this.src.noteOn(0);
        }
        this._state = 1;
    },
    pause: function() {
        var actx = enchant.WebAudioSound.audioContext;
        this.src.disconnect(this.connectTarget);
        this._state = 2;
    },
    stop: function() {
        this.src.noteOff(0);
        this._state = 0;
    },
    clone: function() {
        var sound = new enchant.WebAudioSound();
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

enchant.WebAudioSound.load = function(src, type, callback, onerror) {
    var canPlay = (new Audio()).canPlayType(type);
    var sound = new enchant.WebAudioSound();
    onerror = onerror || function() {};
    sound.addEventListener(enchant.Event.LOAD, callback);
    sound.addEventListener(enchant.Event.ERROR, onerror);
    var e = new enchant.Event(enchant.Event.ERROR);
    e.message = 'Cannot load an asset: ' + src;
    var actx, xhr;
    if (canPlay === 'maybe' || canPlay === 'probably') {
        actx = enchant.WebAudioSound.audioContext;
        xhr = new XMLHttpRequest();
        xhr.responseType = 'arraybuffer';
        xhr.open('GET', src, true);
        xhr.onload = function() {
            actx.decodeAudioData(
                xhr.response,
                function(buffer) {
                    sound.buffer = buffer;
                    sound.dispatchEvent(new enchant.Event(enchant.Event.LOAD));
                },
                function(error) {
                    sound.dispatchEvent(e);
                }
            );
        };
        xhr.send(null);
    } else {
        setTimeout(function() {
            sound.dispatchEvent(e);
        }, 50);
    }
    return sound;
};

if(window.AudioContext){
    enchant.WebAudioSound.audioContext = new window.AudioContext();
    enchant.WebAudioSound.destination = enchant.WebAudioSound.audioContext.destination;
}
