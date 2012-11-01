/**
 [lang:ja]
 * @scope enchant.Sound.prototype
 [/lang]
 [lang:en]
 * @scope enchant.Sound.prototype
 [/lang]
 */
enchant.Sound = enchant.Class.create(enchant.EventTarget, {
    /**
     [lang:ja]
     * audio要素をラップしたクラス.
     *
     * MP3ファイルの再生はSafari, Chrome, Firefox, Opera, IEが対応
     * (Firefox, OperaではFlashを経由して再生). WAVEファイルの再生は
     * Safari, Chrome, Firefox, Operaが対応している. ブラウザが音声ファイル
     * のコーデックに対応していない場合は再生されない.
     *
     * コンストラクタではなくenchant.Sound.loadを通じてインスタンスを作成する.
     *
     * @constructs
     [/lang]
     [lang:en]
     * Class to wrap audio elements.
     *
     * Safari, Chrome, Firefox, Opera, and IE all play MP3 files
     * (Firefox and Opera play via Flash). WAVE files can be played on
     * Safari, Chrome, Firefox, and Opera. When the browser is not compatible with
     * the codec the file will not fully play.
     *
     * Instances are created not via constructor but via enchant.Sound.load.
     *
     * @constructs
     [/lang]
     */
    initialize: function() {
        enchant.EventTarget.call(this);
        /**
         [lang:ja]
         * Soundの再生時間 (秒).
         * @type {Number}
         [/lang]
         [lang:en]
         * Sound play time (seconds).
         * @type {Number}
         [/lang]
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
     */
    play: function() {
        if (this._element){
            this._element.play();
        }
    },
    /**
     [lang:ja]
     * 再生を中断する.
     [/lang]
     [lang:en]
     * Interrupt playing.
     [/lang]
     */
    pause: function() {
        if (this._element){
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
     */
    stop: function() {
        this.pause();
        this.currentTime = 0;
    },
    /**
     [lang:ja]
     * Soundを複製する.
     * @return {enchant.Sound} 複製されたSound.
     [/lang]
     [lang:en]
     * Copy Sound.
     * @return {enchant.Sound} Copied Sound.
     [/lang]
     */
    clone: function() {
        var clone;
        if (this._element instanceof Audio) {
            clone = Object.create(enchant.Sound.prototype, {
                _element: { value: this._element.cloneNode(false) },
                duration: { value: this.duration }
            });
        } else if (enchant.ENV.USE_FLASH_SOUND) {
            return this;
        } else {
            clone = Object.create(enchant.Sound.prototype);
        }
        enchant.EventTarget.call(clone);
        return clone;
    },
    /**
     [lang:ja]
     * 現在の再生位置 (秒).
     * @type {Number}
     [/lang]
     [lang:en]
     * Current play point (seconds).
     * @type {Number}
     [/lang]
     */
    currentTime: {
        get: function() {
            return this._element ? this._element.currentTime : 0;
        },
        set: function(time) {
            if (this._element){
                this._element.currentTime = time;
            }
        }
    },
    /**
     [lang:ja]
     * ボリューム. 0 (無音) ～ 1 (フルボリューム).
     * @type {Number}
     [/lang]
     [lang:en]
     * Volume. 0 (mute) ～ 1 (full volume).
     * @type {Number}
     [/lang]
     */
    volume: {
        get: function() {
            return this._element ? this._element.volume : 1;
        },
        set: function(volume) {
            if (this._element){
                this._element.volume = volume;
            }
        }
    }
});

/**
 [lang:ja]
 * 音声ファイルを読み込んでSurfaceオブジェクトを作成する.
 *
 * @param {String} src ロードする音声ファイルのパス.
 * @param {String} [type] 音声ファイルのMIME Type.
 * @static
 [/lang]
 [lang:en]
 * Load audio file, create Surface object.
 *
 * @param {String} src Path of loaded audio file.
 * @param {String} [type] MIME Type of audio file.
 * @static
 [/lang]
 */
enchant.Sound.load = function(src, type) {
    if (type == null) {
        var ext = enchant.Game.findExt(src);
        if (ext) {
            type = 'audio/' + ext;
        } else {
            type = '';
        }
    }
    type = type.replace('mp3', 'mpeg').replace('m4a', 'mp4');

    var sound = Object.create(enchant.Sound.prototype);
    enchant.EventTarget.call(sound);
    var audio = new Audio();
    if (!enchant.Sound.enabledInMobileSafari &&
        enchant.ENV.VENDOR_PREFIX === 'webkit' && enchant.ENV.TOUCH_ENABLED) {
        window.setTimeout(function() {
            sound.dispatchEvent(new enchant.Event('load'));
        }, 0);
    } else {
        if (!enchant.ENV.USE_FLASH_SOUND && audio.canPlayType(type)) {
            audio.src = src;
            audio.load();
            audio.autoplay = false;
            audio.onerror = function() {
                throw new Error('Cannot load an asset: ' + audio.src);
            };
            audio.addEventListener('canplaythrough', function() {
                sound.duration = audio.duration;
                sound.dispatchEvent(new enchant.Event('load'));
            }, false);
            sound._element = audio;
        } else if (type === 'audio/mpeg') {
            var embed = document.createElement('embed');
            var id = 'enchant-audio' + enchant.Game.instance._soundID++;
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
            enchant.Game.instance._element.appendChild(embed);
            enchant.Sound[id] = sound;
        } else {
            window.setTimeout(function() {
                sound.dispatchEvent(new enchant.Event('load'));
            }, 0);
        }
    }
    return sound;
};
