
enchant.DetectColorManager = enchant.Class.create({
    initialize: function(reso, max) {
        this.reference = [];
        this.detectColorNum = 0;
        this.colorResolution = reso || 16;
        this.max = max || 1;
    },
    attachDetectColor: function(sprite) {
        this.detectColorNum += 1;
        this.reference[this.detectColorNum] = sprite;
        return this._createNewColor();
    },
    detachDetectColor: function(sprite) {
        var i = this.reference.indexOf(sprite);
        if (i !== -1) {
            this.reference[i] = null;
        }
    },
    _createNewColor: function() {
        var n = this.detectColorNum;
        var C = this.colorResolution;
        var d = C / this.max;
        return [
            parseInt((n / C / C) % C, 10) / d,
            parseInt((n / C) % C, 10) / d,
            parseInt(n % C, 10) / d, 1.0
        ];
    },
    _decodeDetectColor: function(color) {
        var C = this.colorResolution;
        return ~~(color[0] * C * C * C / 256) +
            ~~(color[1] * C * C / 256) +
            ~~(color[2] * C / 256);
    },
    getSpriteByColor: function(color) {
        return this.reference[this._decodeDetectColor(color)];
    }
});
