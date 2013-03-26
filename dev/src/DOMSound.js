/**
 * @scope enchant.DOMSound.prototype
 * @type {*}
 */
enchant.DOMSound = enchant.Class.create(enchant.EventTarget, {
    /**
     * @name enchant.DOMSound
     * @class
     [lang:ja]
     * audio要素をラップしたクラス.
     *
     * MP3ファイルの再生はSafari, Chrome, Firefox, Opera, IEが対応
     * (Firefox, OperaではFlashを経由して再生). WAVEファイルの再生は
     * Safari, Chrome, Firefox, Operaが対応している. ブラウザが音声ファイル
     * のコーデックに対応していない場合は再生されない.
     *
     * コンストラクタではなく{@link enchant.DOMSound.load}を通じてインスタンスを作成する.
     [/lang]
     [lang:en]
     * Class to wrap audio elements.
     *
     * Safari, Chrome, Firefox, Opera, and IE all play MP3 files
     * (Firefox and Opera play via Flash). WAVE files can be played on
     * Safari, Chrome, Firefox, and Opera. When the browser is not compatible with
     * the used codec the file will not play.
     *
     * Instances are created not via constructor but via {@link enchant.DOMSound.load}.
     [/lang]
     [lang:de]
     * Klasse die eine Hüllenklasse (Wrapper) für Audio Elemente darstellt.
     *
     * Safari, Chrome, Firefox, Opera, und IE können alle MP3 Dateien abspielen
     * (Firefox und Opera spielen diese mit Hilfe von Flash ab). WAVE Dateien können
     * Safari, Chrome, Firefox, and Opera abspielen. Sollte der Browser nicht mit
     * dem genutzten Codec kompatibel sein, wird die Datei nicht abgespielt.
     *
     * Instanzen dieser Klasse werden nicht mit Hilfe des Konstruktors, sondern mit
     * {@link enchant.DOMSound.load} erstellt.
     [/lang]
     * @constructs
     */
    initialize: function() {
        enchant.EventTarget.call(this);
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
         * @type {Number}
         */
        this.duration = 0;
        throw new Error("Illegal Constructor");
    },
    /**
     [lang:ja]
     * 再生を開始する.
     [/lang]
     [lang:en]
     * Begin playing.
     [/lang]
     [lang:de]
     * Startet die Wiedergabe.
     [/lang]
     */
    play: function() {
        if (this._element) {
            this._element.play();
        }
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
        if (this._element) {
            this._element.pause();
        }
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
        this.pause();
        this.currentTime = 0;
    },
    /**
     [lang:ja]
     * Soundを複製する.
     * @return {enchant.DOMSound} 複製されたSound.
     [/lang]
     [lang:en]
     * Create a copy of this Sound object.
     * @return {enchant.DOMSound} Copied Sound.
     [/lang]
     [lang:de]
     * Erstellt eine Kopie dieses Soundobjektes.
     * @return {enchant.DOMSound} Kopiertes Sound Objekt.
     [/lang]
     */
    clone: function() {
        var clone;
        if (this._element instanceof Audio) {
            clone = Object.create(enchant.DOMSound.prototype, {
                _element: { value: this._element.cloneNode(false) },
                duration: { value: this.duration }
            });
        } else if (enchant.ENV.USE_FLASH_SOUND) {
            return this;
        } else {
            clone = Object.create(enchant.DOMSound.prototype);
        }
        enchant.EventTarget.call(clone);
        return clone;
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
     * @type {Number}
     */
    currentTime: {
        get: function() {
            return this._element ? this._element.currentTime : 0;
        },
        set: function(time) {
            if (this._element) {
                this._element.currentTime = time;
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
     * @type {Number}
     */
    volume: {
        get: function() {
            return this._element ? this._element.volume : 1;
        },
        set: function(volume) {
            if (this._element) {
                this._element.volume = volume;
            }
        }
    }
});

/**
 [lang:ja]
 * 音声ファイルを読み込んでSoundオブジェクトを作成する.
 *
 * @param {String} src ロードする音声ファイルのパス.
 * @param {String} [type] 音声ファイルのMIME Type.
 * @param {Function} callback ロード完了時のコールバック.
 * @param {Function} [onerror] ロード失敗時のコールバック.
 [/lang]
 [lang:en]
 * Loads an audio file and creates Sound object.
 *
 * @param {String} src Path of the audio file to be loaded.
 * @param {String} [type] MIME Type of the audio file.
 * @param {Function} callback on load callback.
 * @param {Function} [onerror] on error callback.
 [/lang]
 [lang:de]
 * Läd eine Audio Datei und erstellt ein Sound objekt.
 *
 * @param {String} src Pfad zu der zu ladenden Audiodatei.
 * @param {String} [type] MIME Type der Audtiodatei.
 [/lang]
 * @return {enchant.DOMSound} DOMSound
 * @static
 */
enchant.DOMSound.load = function(src, type, callback, onerror) {
    if (type == null) {
        var ext = enchant.Core.findExt(src);
        if (ext) {
            type = 'audio/' + ext;
        } else {
            type = '';
        }
    }
    type = type.replace('mp3', 'mpeg').replace('m4a', 'mp4');
    onerror = onerror || function() {};

    var sound = Object.create(enchant.DOMSound.prototype);
    enchant.EventTarget.call(sound);
    sound.addEventListener('load', callback);
    sound.addEventListener('error', onerror);
    var audio = new Audio();
    if (!enchant.ENV.SOUND_ENABLED_ON_MOBILE_SAFARI &&
        enchant.ENV.VENDOR_PREFIX === 'webkit' && enchant.ENV.TOUCH_ENABLED) {
        window.setTimeout(function() {
            sound.dispatchEvent(new enchant.Event('load'));
        }, 0);
    } else {
        if (!enchant.ENV.USE_FLASH_SOUND && audio.canPlayType(type)) {
            audio.addEventListener('canplaythrough', function() {
                sound.duration = audio.duration;
                sound.dispatchEvent(new enchant.Event('load'));
            }, false);
            audio.src = src;
            audio.load();
            audio.autoplay = false;
            audio.onerror = function() {
                var e = new enchant.Event(enchant.Event.ERROR);
                e.message = 'Cannot load an asset: ' + audio.src;
                sound.dispatchEvent(e);
            };
            sound._element = audio;
        } else if (type === 'audio/mpeg') {
            var embed = document.createElement('embed');
            var id = 'enchant-audio' + enchant.Core.instance._soundID++;
            embed.width = embed.height = 1;
            embed.name = id;
            embed.src = 'sound.swf?id=' + id + '&src=' + src;
            embed.allowscriptaccess = 'always';
            embed.style.position = 'absolute';
            embed.style.left = '-1px';
            sound.addEventListener('load', function() {
                Object.defineProperties(embed, {
                    currentTime: {
                        get: function() {
                            return embed.getCurrentTime();
                        },
                        set: function(time) {
                            embed.setCurrentTime(time);
                        }
                    },
                    volume: {
                        get: function() {
                            return embed.getVolume();
                        },
                        set: function(volume) {
                            embed.setVolume(volume);
                        }
                    }
                });
                sound._element = embed;
                sound.duration = embed.getDuration();
            });
            enchant.Core.instance._element.appendChild(embed);
            enchant.DOMSound[id] = sound;
        } else {
            window.setTimeout(function() {
                sound.dispatchEvent(new enchant.Event('load'));
            }, 0);
        }
    }
    return sound;
};
