/**
 * @fileOverview
 * extendMap.enchant.js
 * @version 1.0
 * @require enchant.js v0.4 or later
 * @author rtsan
 *
 * @description
 * enchantMapEditor:
 * http://github.com/wise9/enchantMapEditor
 */

/**
 * plugin namespace object
 * @type {Object}
 */
enchant.extendMap = {};

/**
 * scope enchant.extendMap.ExMap.prototype
 * @type {*}
 */
enchant.extendMap.ExMap = enchant.Class.create(enchant.Map, {
    /**
     * @extends enchant.Map
     */

    type2data: function() {
        var len = this._typeData.length;
        var xlen = this._typeData[0][0].length;
        var ylen = this._typeData[0].length;
        for (var index = 0; index < len; index++) {
            this._data[index] = new Array();
            for (var y = 0; y < ylen; y++) {
                this._data[index][y] = new Array();
                for (var x = 0; x < xlen; x++) {
                    this._data[index][y][x] = this.searchPattern(index, x, y);
                }
            }
        }
    },
    data2type: function() {
        var len = this._data.length;
        var xlen = this._data[0][0].length;
        var ylen = this._data[0].length;
        this._typeData = new Array();
        for (var index = 0; index < len; index++) {
            this._typeData[index] = new Array();
            for (var y = 0; y < ylen; y++) {
                this._typeData[index][y] = new Array();
                for (var x = 0; x < xlen; x++) {
                    this._typeData[index][y][x] = Math.floor(this._data[index][y][x] / 68);
                    if (this._data[index][y][x] % 17 > 12) {
                        this._typeData[index][y][x] = -1;
                    }
                }
            }
        }
    },
    isOwn: function(index, x, y, own) {
        var data = this._typeData[index][y][x];
        if (data == own
            || data == -1
            || data > 7
            || (typeof this._types != 'undefined')
            && this._types[data].parentNum == this._types[own].baseNum) {
            return true;
        } else {
            return false;
        }
    },
    searchPattern: function(index, x, y) {
        var patternTable = {
            0: 42, 2: 54, 8: 3, 10: 53, 11: 57, 16: 1, 18: 51, 22: 55, 24: 2, 26: 52,
            27: 44, 30: 45, 31: 56, 64: 20, 66: 37, 72: 19, 74: 36, 75: 10, 80: 17, 82: 34,
            86: 11, 88: 18, 90: 35, 91: 60, 94: 58, 95: 59, 104: 23, 106: 27, 107: 40, 120: 61,
            122: 26, 123: 43, 126: 9, 127: 6, 208: 21, 210: 28, 214: 38, 216: 62, 218: 24, 222: 41,
            223: 7, 219: 8, 248: 22, 250: 25, 251: 4, 254: 5, 255: 39
        };
        var patternNumber = 0;
        var own = this._typeData[index][y][x];
        var xlen = this._typeData[index][y].length - 1;
        var ylen = this._typeData[index].length - 1;
        if (own == -1) {
            return -1;
        } else if (own > 7) {
            return this._data[index][y][x];
        }
        if (x == 0) {
            patternNumber |= 41;
        } else if (x == xlen) {
            patternNumber |= 148;
        }
        if (y == 0) {
            patternNumber |= 7;
        } else if (y == ylen) {
            patternNumber |= 224;
        }

        if (x > 0) {
            if (this.isOwn(index, x - 1, y, own)) {
                patternNumber += 8;
            }

        }
        if (x < xlen) {
            if (this.isOwn(index, x + 1, y, own)) {
                patternNumber += 16;
            }
        }
        if (y > 0) {
            if (this.isOwn(index, x, y - 1, own)) {
                patternNumber += 2;
            }
        }
        if (y < ylen) {
            if (this.isOwn(index, x, y + 1, own)) {
                patternNumber += 64;
            }
        }
        if (x > 0 && y > 0) {
            if (this.isOwn(index, x - 1, y - 1, own)) {
                patternNumber += 1;
            }
        }
        if (x < xlen && y > 0) {
            if (this.isOwn(index, x + 1, y - 1, own)) {
                patternNumber += 4;
            }
        }
        if (x > 0 && y < ylen) {
            if (this.isOwn(index, x - 1, y + 1, own)) {
                patternNumber += 32;
            }
        }
        if (x < xlen && y < ylen) {
            if (this.isOwn(index, x + 1, y + 1, own)) {
                patternNumber += 128;
            }
        }

        if (!((patternNumber & 1) && (patternNumber & 2) && (patternNumber & 8))) {
            patternNumber &= 254;
        }
        if (!((patternNumber & 4) && (patternNumber & 2) && (patternNumber & 16))) {
            patternNumber &= 251;
        }
        if (!((patternNumber & 32) && (patternNumber & 64) && (patternNumber & 8))) {
            patternNumber &= 223;
        }
        if (!((patternNumber & 128) && (patternNumber & 64) && (patternNumber & 16))) {
            patternNumber &= 127;
        }

        if (patternTable.hasOwnProperty(patternNumber)) {
            var ret = own * 68 + patternTable[patternNumber];
        } else {
            var ret = -1;
            console.log('this._typeData[' + index + '][' + y + '][' + x + '] = ' + patternNumber + ' // undefined');
        }
        return ret;
    },
    match: function(ind1, ind2) {
        var i = 0;
        while (i < 1024) {
            if (this._types[ind1].baseType[i] ^ this._types[ind2].parentType[i]) {
                return false;
            } else {
                i++;
            }
        }
        return true;
    },
    loadTypeData: function(data) {
        this._typeData = Array.prototype.slice.apply(arguments);
        this._dirty = true;
        this.type2data();
        var c = 0;
        for (var index = 0, l = this._data.length; index < l; index++) {
            for (var y = 0, ll = this._data[0].length; y < ll; y++) {
                for (var x = 0, lll = this._data[0][0].length; x < lll; x++) {
                    if (this._typeData[index][y][x] > 7) {
                        this._typeData[index][y][x] = -1;
                    }
                    if (this._data[index][y][x] >= 0) {
                        c++;
                    }
                }
            }
        }
        if (c / (data.length * data[0].length) > 0.2) {
            this._tight = true;
        } else {
            this._tight = false;
        }
    },
    loadData: function(data) {
        this._data = Array.prototype.slice.apply(arguments);
        this._dirty = true;
        this.data2type();
        var c = 0;
        for (var index = 0, l = this._data.length; index < l; index++) {
            for (var y = 0, ll = this._data[0].length; y < ll; y++) {
                for (var x = 0, lll = this._data[0][0].length; x < lll; x++) {
                    if (this._data[index][y][x] >= 0) {
                        c++;
                    }
                }
            }
        }
        if (c / (data.length * data[0].length) > 0.2) {
            this._tight = true;
        } else {
            this._tight = false;
        }
    },
    image: {
        get: function() {
            return this._image;
        },
        set: function(image) {
            var img = image.clone();
            var core = enchant.Core.instance;
            var surface = new Surface(272, 512);
            var Type = function(image, left, top, tileWidth, tileHeight) {
                this.baseType = [];
                this.parentType = [];
                this.baseType = image.context.getImageData(left, top, tileWidth, tileHeight).data;
                this.parentType = image.context.getImageData(left + tileWidth, top, tileWidth, tileHeight).data;
            };
            var extract = function(left, top, sx, sy) {
                var params = [
                    [  0, 16, 48, 8, 16, 0, 48, 8 ],
                    [  0, 56, 48, 8, 16, 8, 48, 8 ],
                    [  0, 16, 8, 48, 48, 16, 8, 48 ],
                    [ 40, 16, 8, 48, 56, 16, 8, 48 ],
                    [  0, 16, 48, 48, 0, 16, 48, 48 ],
                    [ 40, 8, 8, 8, 8, 24, 8, 8 ],
                    [ 40, 0, 8, 8, 8, 48, 8, 8 ],
                    [ 32, 8, 8, 8, 32, 24, 8, 8 ],
                    [ 32, 0, 8, 8, 32, 48, 8, 8 ],
                    [ 40, 0, 8, 8, 8, 32, 8, 8 ],
                    [ 40, 8, 8, 8, 8, 40, 8, 8 ],
                    [ 32, 0, 8, 8, 32, 32, 8, 8 ],
                    [ 32, 8, 8, 8, 32, 40, 8, 8 ],
                    [ 32, 8, 8, 8, 16, 24, 8, 8 ],
                    [ 40, 8, 8, 8, 24, 24, 8, 8 ],
                    [ 40, 0, 8, 8, 24, 48, 8, 8 ],
                    [ 32, 0, 8, 8, 16, 48, 8, 8 ],
                    [ 32, 0, 16, 16, 112, 16, 16, 16 ],
                    [ 32, 0, 16, 16, 112, 32, 16, 16 ],
                    [ 32, 0, 16, 16, 112, 48, 16, 16 ],
                    [ 32, 0, 16, 16, 128, 16, 16, 16 ],
                    [ 32, 0, 16, 16, 128, 48, 16, 16 ],
                    [ 32, 0, 16, 16, 144, 16, 16, 16 ],
                    [ 32, 0, 16, 16, 144, 32, 16, 16 ],
                    [ 32, 0, 16, 16, 144, 48, 16, 16 ],
                    [ 24, 32, 8, 8, 120, 48, 8, 8 ],
                    [ 24, 40, 8, 8, 120, 24, 8, 8 ],
                    [ 16, 32, 8, 8, 144, 48, 8, 8 ],
                    [ 16, 40, 8, 8, 144, 24, 8, 8 ],
                    [ 16, 40, 16, 8, 128, 24, 16, 8 ],
                    [ 16, 32, 16, 8, 128, 48, 16, 8 ],
                    [ 24, 32, 8, 16, 120, 32, 8, 16 ],
                    [ 16, 32, 8, 16, 144, 32, 8, 16 ],
                    [  0, 16, 8, 8, 128, 32, 8, 8 ],
                    [ 40, 16, 8, 8, 136, 32, 8, 8 ],
                    [  0, 56, 8, 8, 128, 40, 8, 8 ],
                    [ 40, 56, 8, 8, 136, 40, 8, 8 ],
                    [ 16, 32, 16, 16, 64, 0, 16, 16 ],
                    [ 40, 0, 8, 8, 72, 0, 8, 8 ],
                    [ 16, 32, 16, 16, 80, 0, 16, 16 ],
                    [ 32, 0, 8, 8, 80, 0, 8, 8 ],
                    [ 16, 32, 16, 16, 96, 0, 16, 16 ],
                    [ 40, 8, 8, 8, 104, 8, 8, 8 ],
                    [ 16, 32, 16, 16, 112, 0, 16, 16 ],
                    [ 32, 8, 8, 8, 112, 8, 8, 8 ],
                    [ 16, 32, 16, 16, 128, 0, 16, 16 ],
                    [ 40, 0, 8, 8, 136, 0, 8, 8 ],
                    [ 32, 8, 8, 8, 128, 8, 8, 8 ],
                    [ 16, 32, 16, 16, 144, 0, 16, 16 ],
                    [ 32, 0, 8, 8, 144, 0, 8, 8 ],
                    [ 40, 8, 8, 8, 152, 8, 8, 8 ],
                    [ 32, 32, 16, 16, 160, 0, 16, 16 ],
                    [ 32, 32, 16, 16, 160, 16, 16, 16 ],
                    [ 32, 8, 8, 8, 160, 8, 8, 8 ],
                    [ 32, 0, 8, 8, 160, 16, 8, 8 ],
                    [  0, 32, 16, 16, 176, 0, 16, 16 ],
                    [  0, 32, 16, 16, 176, 16, 16, 16 ],
                    [ 40, 8, 8, 8, 184, 8, 8, 8 ],
                    [ 40, 0, 8, 8, 184, 16, 8, 8 ],
                    [  8, 48, 16, 16, 160, 32, 16, 16 ],
                    [  8, 48, 16, 16, 176, 32, 16, 16 ],
                    [ 40, 0, 8, 8, 168, 32, 8, 8 ],
                    [ 32, 0, 8, 8, 176, 32, 8, 8 ],
                    [  8, 16, 16, 16, 160, 48, 16, 16 ],
                    [  8, 16, 16, 16, 176, 48, 16, 16 ],
                    [ 40, 8, 8, 8, 168, 56, 8, 8 ],
                    [ 32, 8, 8, 8, 176, 56, 8, 8 ],
                    [  0, 0, 16, 16, 0, 0, 16, 16 ],
                    [  0, 16, 48, 48, 64, 16, 48, 48 ],
                    [ 32, 0, 16, 16, 16, 32, 16, 16 ]
                ];
                for (var i = 0, l = params.length; i < l; i++) {
                    params[i][0] += left;
                    params[i][1] += top;
                    params[i][4] += sx;
                    params[i][5] += sy;
                    params[i].unshift(image);
                    surface.draw.apply(surface, params[i]);
                }
            };

            // イメージの展開
            surface.draw(image, 96, 0, 80, 256, 192, 0, 80, 256);
            surface.draw(image, 176, 0, 80, 256, 192, 256, 80, 256);
            for (var y = 0; y < 4; y++) {
                for (var x = 0; x < 2; x++) {
                    var left = x * 48;
                    var top = y * 64;
                    extract(left, top, 0, (x + y * 2) * 64);
                }
            }

            this._image = surface;
            this._types = new Array();

            for (var y = 0; y < 4; y++) {
                for (var x = 0; x < 2; x++) {
                    var left = x * 48;
                    var top = y * 64;
                    this._types[x + y * 2] = new Type(img, left, top, this.tileWidth, this.tileHeight);
                }
            }
            for (var i = 0; i < 8; i++) {
                for (var j = 0; j < 8; j++) {
                    if (this.match(i, j)) {
                        this._types[j].parentNum = i;
                    }
                }
                if (this._types[i].parentNum == undefined) {
                    this._types[i].parentNum = i;
                }
                this._types[i].baseNum = i;
            }

            /*
             if (RETINA_DISPLAY && core.scale == 2) {
             var img = new Surface(image.width * 2, image.height * 2);
             var tileWidth = this._tileWidth || image.width;
             var tileHeight = this._tileHeight || image.height;
             var row = image.width / tileWidth | 0;
             var col = image.height / tileHeight | 0;
             for (var y = 0; y < col; y++) {
             for (var x = 0; x < row; x++) {
             img.draw(image, x * tileWidth, y * tileHeight, tileWidth, tileHeight,
             x * tileWidth * 2, y * tileHeight * 2, tileWidth * 2, tileHeight * 2);
             }
             }
             this._doubledImage = img;
             }
             this._dirty = true;
             */
        }
    }
});
