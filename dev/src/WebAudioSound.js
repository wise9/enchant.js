
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
        if(!window.AudioContext){
            throw new Error("This browser does not support WebAudio API.");
        }
        enchant.EventTarget.call(this);
        this.context = enchant.WebAudioSound.audioContext;
        this.src = this.context.createBufferSource();
        this.buffer = null;
        this._volume = 1;
        this._currentTime = 0;
        this._state = 0;
        this.connectTarget = enchant.WebAudioSound.destination;
    },
    play: function(dup) {
        if (this._state === 1 && !dup) {
            this.src.disconnect(this.connectTarget);
        }
        if (this._state !== 2) {
            this._currentTime = 0;
        }
        var offset = this._currentTime;
        var actx = this.context;
        this.src = actx.createBufferSource();
        this._gain = actx.createGain();
        this.src.buffer = this.buffer;
        this._gain.gain.value = this._volume;

        this.src.connect(this._gain);
        this._gain.connect(this.connectTarget);
        this.src.start(0, offset, this.buffer.duration - offset - 1.192e-7);
        this._startTime = actx.currentTime - this._currentTime;
        this._state = 1;
    },
    pause: function() {
        var currentTime = this.currentTime;
        if (currentTime === this.duration) {
            return;
        }
        this.src.stop(0);
        this._currentTime = currentTime;
        this._state = 2;
    },
    stop: function() {
        this.src.stop(0);
        this._state = 0;
    },
    clone: function() {
        var sound = new enchant.WebAudioSound();
        sound.buffer = this.buffer;
        return sound;
    },
    duration: {
        get: function() {
            if (this.buffer) {
                return this.buffer.duration;
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
		this._gain.gain.value = volume;
            }
        }
    },
    currentTime: {
        get: function() {
            return Math.max(0, Math.min(this.duration, this.src.context.currentTime - this._startTime));
        },
        set: function(time) {
            this._currentTime = time;
            if (this._state !== 2) {
                this.play(false);
            }
        }
    }
});

enchant.WebAudioSound.load = function(src, type, callback, onerror) {
    var canPlay = (new Audio()).canPlayType(type);
    var sound = new enchant.WebAudioSound();
    onerror = onerror || function() {};
    sound.addEventListener(enchant.Event.LOAD, callback);
    sound.addEventListener(enchant.Event.ERROR, onerror);
    function dispatchErrorEvent() {
        var e = new enchant.Event(enchant.Event.ERROR);
        e.message = 'Cannot load an asset: ' + src;
        enchant.Core.instance.dispatchEvent(e);
        sound.dispatchEvent(e);
    }
    var actx, xhr;
    if (canPlay === 'maybe' || canPlay === 'probably') {
        actx = enchant.WebAudioSound.audioContext;
        xhr = new XMLHttpRequest();
        xhr.open('GET', src, true);
        xhr.responseType = 'arraybuffer';
        xhr.onload = function() {
            actx.decodeAudioData(xhr.response, function(buffer) {
                sound.buffer = buffer;
                sound.dispatchEvent(new enchant.Event(enchant.Event.LOAD));
            }, dispatchErrorEvent);
        };
        xhr.onerror = dispatchErrorEvent;
        xhr.send(null);
    } else {
        setTimeout(dispatchErrorEvent,  50);
    }
    return sound;
};

if(window.AudioContext){
    enchant.WebAudioSound.audioContext = new window.AudioContext();
    enchant.WebAudioSound.destination = enchant.WebAudioSound.audioContext.destination;
}
