window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext || window.msAudioContext || window.oAudioContext;

/**
 * @scope enchant.WebAudioSound.prototype
 */
enchant.WebAudioSound = enchant.Class.create(enchant.EventTarget, {
    /**
     * @name enchant.WebAudioSound
     * @class
     [lang:ja]
     * WebAudioをラップしたクラス.
     [/lang]
     [lang:en]
     * Sound wrapper class for Web Audio API (supported on some webkit-based browsers)
     [/lang]
     [lang:de]
     [/lang]
     * @constructs
     * @extends enchant.EventTarget
     */
    initialize: function() {
        if(!window.webkitAudioContext){
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
    /**
     [lang:ja]
     * 再生を開始する.
     * @param {Boolean} [dup=false] trueならオブジェクトの現在の再生を残したまま新しく音声を再生する.
     [/lang]
     [lang:en]
     * Begin playing.
     * @param {Boolean} [dup=false] If true, Object plays new sound while keeps last sound.
     [/lang]
     [lang:de]
     * Startet die Wiedergabe.
     * @param {Boolean} [dup=false] Wenn true, Objekt spielt neuen Sound während im letzten Ton hält.
     [/lang]
     */
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
        this.src.buffer = this.buffer;
        this.src.gain.value = this._volume;
        this.src.connect(this.connectTarget);
        this.src.noteGrainOn(0, offset, this.buffer.duration - offset - 1.192e-7);
        this._startTime = actx.currentTime - this._currentTime;
        this._state = 1;
    },
    /**
     [lang:ja]
     * 再生を中断する.
     [/lang]
     [lang:en]
     * Pause playback.
     [/lang]
     [lang:de]
     * Pausiert die Wiedergabe.
     [/lang]
     */
    pause: function() {
        var currentTime = this.currentTime;
        if (currentTime === this.duration) {
            return;
        }
        this.src.noteOff(0);
        this._currentTime = currentTime;
        this._state = 2;
    },
    /**
     [lang:ja]
     * 再生を停止する.
     [/lang]
     [lang:en]
     * Stop playing.
     [/lang]
     [lang:de]
     * Stoppt die Wiedergabe.
     [/lang]
     */
    stop: function() {
        this.src.noteOff(0);
        this._state = 0;
    },
    /**
     [lang:ja]
     * Soundを複製する.
     * @return {enchant.WebAudioSound} 複製されたSound.
     [/lang]
     [lang:en]
     * Create a copy of this Sound object.
     * @return {enchant.WebAudioSound} Copied Sound.
     [/lang]
     [lang:de]
     * Erstellt eine Kopie dieses Soundobjektes.
     * @return {enchant.WebAudioSound} Kopiertes Sound Objekt.
     [/lang]
     */
    clone: function() {
        var sound = new enchant.WebAudioSound();
        sound.buffer = this.buffer;
        return sound;
    },
    /**
     [lang:ja]
     * Soundの再生時間 (秒).
     [/lang]
     [lang:en]
     * Sound file duration (seconds).
     [/lang]
     [lang:de]
     * Die länge der Sounddatei in Sekunden.
     [/lang]
     * @type Number
     */
    duration: {
        get: function() {
            if (this.buffer) {
                return this.buffer.duration;
            } else {
                return 0;
            }
        }
    },
    /**
     [lang:ja]
     * 現在の再生位置 (秒).
     [/lang]
     [lang:en]
     * Current playback position (seconds).
     [/lang]
     [lang:de]
     * Aktuelle Wiedergabeposition (seconds).
     [/lang]
     * @type Number
     */
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
    /**
     [lang:ja]
     * ボリューム. 0 (無音) ～ 1 (フルボリューム).
     [/lang]
     [lang:en]
     * Volume. 0 (muted) ～ 1 (full volume).
     [/lang]
     [lang:de]
     * Lautstärke. 0 (stumm) ～ 1 (volle Lautstärke).
     [/lang]
     * @type Number
     */
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

/**
 [lang:ja]
 * 音声ファイルを読み込んでWebAudioSoundオブジェクトを作成する.
 * @param {String} src ロードする音声ファイルのパス.
 * @param {String} [type] 音声ファイルのMIME Type.
 * @param {Function} [callback] ロード完了時のコールバック.
 * @param {Function} [onerror] ロード失敗時のコールバック.
 [/lang]
 [lang:en]
 * Loads an audio file and creates WebAudioSound object.
 * @param {String} src Path of the audio file to be loaded.
 * @param {String} [type] MIME Type of the audio file.
 * @param {Function} [callback] on load callback.
 * @param {Function} [onerror] on error callback.
 [/lang]
 [lang:de]
 * Läd eine Audio Datei und erstellt ein WebAudioSound objekt.
 * @param {String} src Pfad zu der zu ladenden Audiodatei.
 * @param {String} [type] MIME Type der Audtiodatei.
 * @param {Function} [callback]
 * @param {Function} [onerror]
 [/lang]
 * @return {enchant.WebAudioSound} WebAudioSound
 * @static
 */
enchant.WebAudioSound.load = function(src, type, callback, onerror) {
    var canPlay = (new Audio()).canPlayType(type);
    var sound = new enchant.WebAudioSound();
    callback = callback || function() {};
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

if (window.AudioContext) {
    enchant.WebAudioSound.audioContext = new window.AudioContext();
    enchant.WebAudioSound.destination = enchant.WebAudioSound.audioContext.destination;
}
