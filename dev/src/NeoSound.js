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
            enchant.EventTarget.call(this);
            this.src = null;
            this.buffer = null;
        },
        load: function(src, callback) {
        },
        play: function() {
            var actx = enchant.NeoSound.audioContext;
            this.src = actx.createBufferSource();
            this.src.buffer = this.buffer;
            this.src.noteOn(0);
            this.src.connect(actx.destination);
        },
        pause: function() {
        },
        stop: function() {
        },
        clone: function() {
            // iranaikamo
        }
    });
    enchant.NeoSound.load = function(src, type, callback) {
        var actx = enchant.NeoSound.audioContext;
        var xhr = new XMLHttpRequest();
        var sound = new enchant.NeoSound();
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
                    console.log(error);
                    callback();
                }
            );
        };
        xhr.send(null);
        return sound;
    };

    enchant.NeoSound.audioContext = new webkitAudioContext();

}
