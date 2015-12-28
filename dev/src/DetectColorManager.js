enchant.DetectColorManager = enchant.Class.create({
    initialize: function(reso, max) {
        this.reference = [];
        this.colorResolution = reso || 16;
        this.max = max || 1;
        this.capacity = Math.pow(this.colorResolution, 3);
        for (var i = 1, l = this.capacity; i < l; i++) {
            this.reference[i] = null;
        }
    },
    attachDetectColor: function(sprite) {
        var i = this.reference.indexOf(null);
        if (i === -1) {
            i = 1;
        }
        this.reference[i] = sprite;
        return this._getColor(i);
    },
    detachDetectColor: function(sprite) {
        var i = this.reference.indexOf(sprite);
        if (i !== -1) {
            this.reference[i] = null;
        }
    },
    _getColor: function(n) {
        var C = this.colorResolution;
        var d = C / this.max;
        return [
            parseInt((n / C / C) % C, 10) / d,
            parseInt((n / C) % C, 10) / d,
            parseInt(n % C, 10) / d,
            1.0
        ];
    },
    _decodeDetectColor: function(color, i) {
        i = i || 0;
        var C = this.colorResolution;
        return ~~(color[i] * C * C * C / 256) +
            ~~(color[i + 1] * C * C / 256) +
            ~~(color[i + 2] * C / 256);
    },
    getSpriteByColor: function(color) {
        return this.reference[this._decodeDetectColor(color)];
    },
    getSpriteByColors: function(rgba) {
        var i, l, id, result,
            score = 0,
            found = {};

        for (i = 0, l = rgba.length; i < l; i+= 4) {
            id = this._decodeDetectColor(rgba, i);
            found[id] = (found[id] || 0) + 1;
        }
        for (id in found) {
            if (found[id] > score) {
                score = found[id];
                result = id;
            }
        }

        return this.reference[result];
    }
});
