(function() {
    /**
     [lang:ja]
     * @scope enchant.Map.prototype
     [/lang]
     [lang:en]
     * @scope enchant.Map.prototype
     [/lang]
     */
    enchant.Map = enchant.Class.create(enchant.Entity, {
        /**
         [lang:ja]
         * タイルセットからマップを生成して表示するクラス.
         *
         * @param {Number} tileWidth タイルの横幅.
         * @param {Number} tileHeight タイルの高さ.
         * @constructs
         * @extends enchant.Entity
         [/lang]
         [lang:en]
         * A class to create and display maps from a tile set.
         *
         * @param {Number} tileWidth Tile width.
         * @param {Number} tileHeight Tile height.
         * @constructs
         * @extends enchant.Entity
         [/lang]
         */
        initialize: function(tileWidth, tileHeight) {
            var game = enchant.Game.instance;

            enchant.Entity.call(this);

            var canvas = document.createElement('canvas');
            if (enchant.ENV.RETINA_DISPLAY && game.scale === 2) {
                canvas.width = game.width * 2;
                canvas.height = game.height * 2;
                this._style.webkitTransformOrigin = '0 0';
                this._style.webkitTransform = 'scale(0.5)';
            } else {
                canvas.width = game.width;
                canvas.height = game.height;
            }
            this._element.appendChild(canvas);
            this._context = canvas.getContext('2d');

            this._tileWidth = tileWidth || 0;
            this._tileHeight = tileHeight || 0;
            this._image = null;
            this._data = [
                [
                    []
                ]
            ];
            this._dirty = false;
            this._tight = false;

            this.touchEnabled = false;

            /**
             [lang:ja]
             * タイルが衝突判定を持つかを表す値の二元配列.
             * @type {Array.<Array.<Number>>}
             [/lang]
             [lang:en]
             * Two dimensional array to show level of tiles with collision detection.
             * @type {Array.<Array.<Number>>}
             [/lang]
             */
            this.collisionData = null;

            this._listeners['render'] = null;
            this.addEventListener('render', function() {
                if (this._dirty || this._previousOffsetX == null) {
                    this._dirty = false;
                    this.redraw(0, 0, game.width, game.height);
                } else if (this._offsetX !== this._previousOffsetX ||
                    this._offsetY !== this._previousOffsetY) {
                    if (this._tight) {
                        var x = -this._offsetX;
                        var y = -this._offsetY;
                        var px = -this._previousOffsetX;
                        var py = -this._previousOffsetY;
                        var w1 = x - px + game.width;
                        var w2 = px - x + game.width;
                        var h1 = y - py + game.height;
                        var h2 = py - y + game.height;
                        if (w1 > this._tileWidth && w2 > this._tileWidth &&
                            h1 > this._tileHeight && h2 > this._tileHeight) {
                            var sx, sy, dx, dy, sw, sh;
                            if (w1 < w2) {
                                sx = 0;
                                dx = px - x;
                                sw = w1;
                            } else {
                                sx = x - px;
                                dx = 0;
                                sw = w2;
                            }
                            if (h1 < h2) {
                                sy = 0;
                                dy = py - y;
                                sh = h1;
                            } else {
                                sy = y - py;
                                dy = 0;
                                sh = h2;
                            }

                            if (game._buffer == null) {
                                game._buffer = document.createElement('canvas');
                                game._buffer.width = this._context.canvas.width;
                                game._buffer.height = this._context.canvas.height;
                            }
                            var context = game._buffer.getContext('2d');
                            if (this._doubledImage) {
                                context.clearRect(0, 0, sw * 2, sh * 2);
                                context.drawImage(this._context.canvas,
                                    sx * 2, sy * 2, sw * 2, sh * 2, 0, 0, sw * 2, sh * 2);
                                context = this._context;
                                context.clearRect(dx * 2, dy * 2, sw * 2, sh * 2);
                                context.drawImage(game._buffer,
                                    0, 0, sw * 2, sh * 2, dx * 2, dy * 2, sw * 2, sh * 2);
                            } else {
                                context.clearRect(0, 0, sw, sh);
                                context.drawImage(this._context.canvas,
                                    sx, sy, sw, sh, 0, 0, sw, sh);
                                context = this._context;
                                context.clearRect(dx, dy, sw, sh);
                                context.drawImage(game._buffer,
                                    0, 0, sw, sh, dx, dy, sw, sh);
                            }

                            if (dx === 0) {
                                this.redraw(sw, 0, game.width - sw, game.height);
                            } else {
                                this.redraw(0, 0, game.width - sw, game.height);
                            }
                            if (dy === 0) {
                                this.redraw(0, sh, game.width, game.height - sh);
                            } else {
                                this.redraw(0, 0, game.width, game.height - sh);
                            }
                        } else {
                            this.redraw(0, 0, game.width, game.height);
                        }
                    } else {
                        this.redraw(0, 0, game.width, game.height);
                    }
                }
                this._previousOffsetX = this._offsetX;
                this._previousOffsetY = this._offsetY;
            });
        },
        /**
         [lang:ja]
         * データを設定する.
         * タイルががimageプロパティの画像に左上から順に配列されていると見て, 0から始まる
         * インデックスの二元配列を設定する.複数指定された場合は後のものから順に表示される.
         * @param {...Array<Array.<Number>>} data タイルのインデックスの二元配列. 複数指定できる.
         [/lang]
         [lang:en]
         * Set data.
         * Sees that tiles are set in order in array from the upper left of image properties image,
         * and sets a two-dimensional index array starting from 0. When more than one is set, they are displayed in reverse order.
         * @param {...Array<Array.<Number>>} data Two-dimensional display of tile index. Multiple designations possible.
         [/lang]
         */
        loadData: function(data) {
            this._data = Array.prototype.slice.apply(arguments);
            this._dirty = true;

            this._tight = false;
            for (var i = 0, len = this._data.length; i < len; i++) {
                var c = 0;
                data = this._data[i];
                for (var y = 0, l = data.length; y < l; y++) {
                    for (var x = 0, ll = data[y].length; x < ll; x++) {
                        if (data[y][x] >= 0){
                            c++;
                        }
                    }
                }
                if (c / (data.length * data[0].length) > 0.2) {
                    this._tight = true;
                    break;
                }
            }
        },
        /**
         [lang:ja]
         * ある座標のタイルが何か調べる
         * @param x
         * @param y
         * @return {*}
         [/lang]
         [lang:en]
         * Check what tile it is on designated position
         [/lang]
         */
        checkTile: function(x, y) {
            if (x < 0 || this.width <= x || y < 0 || this.height <= y) {
                return false;
            }
            var width = this._image.width;
            var height = this._image.height;
            var tileWidth = this._tileWidth || width;
            var tileHeight = this._tileHeight || height;
            x = x / tileWidth | 0;
            y = y / tileHeight | 0;
            //		return this._data[y][x];
            var data = this._data[0];
            return data[y][x];
        },
        /**
         [lang:ja]
         * Map上に障害物があるかどうかを判定する.
         * @param {Number} x 判定を行うマップ上の点のx座標.
         * @param {Number} y 判定を行うマップ上の点のy座標.
         * @return {Boolean} 障害物があるかどうか.
         [/lang]
         [lang:en]
         * Judges whether or not obstacles are on top of Map.
         * @param {Number} x x coordinates of detection spot on map.
         * @param {Number} y y coordinates of detection spot on map.
         * @return {Boolean} Checks for obstacles.
         [/lang]
         */
        hitTest: function(x, y) {
            if (x < 0 || this.width <= x || y < 0 || this.height <= y) {
                return false;
            }
            var width = this._image.width;
            var height = this._image.height;
            var tileWidth = this._tileWidth || width;
            var tileHeight = this._tileHeight || height;
            x = x / tileWidth | 0;
            y = y / tileHeight | 0;
            if (this.collisionData != null) {
                return this.collisionData[y] && !!this.collisionData[y][x];
            } else {
                for (var i = 0, len = this._data.length; i < len; i++) {
                    var data = this._data[i];
                    var n;
                    if (data[y] != null && (n = data[y][x]) != null &&
                        0 <= n && n < (width / tileWidth | 0) * (height / tileHeight | 0)) {
                        return true;
                    }
                }
                return false;
            }
        },
        /**
         [lang:ja]
         * Mapで表示するタイルセット画像.
         * @type {enchant.Surface}
         [/lang]
         [lang:en]
         * Tile set image displayed on Map.
         * @type {enchant.Surface}
         [/lang]
         */
        image: {
            get: function() {
                return this._image;
            },
            set: function(image) {
                var game = enchant.Game.instance;

                this._image = image;
                if (enchant.ENV.RETINA_DISPLAY && game.scale === 2) {
                    var img = new enchant.Surface(image.width * 2, image.height * 2);
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
            }
        },
        /**
         [lang:ja]
         * Mapのタイルの横幅.
         * @type {Number}
         [/lang]
         [lang:en]
         * Map tile width.
         * @type {Number}
         [/lang]
         */
        tileWidth: {
            get: function() {
                return this._tileWidth;
            },
            set: function(tileWidth) {
                this._tileWidth = tileWidth;
                this._dirty = true;
            }
        },
        /**
         [lang:ja]
         * Mapのタイルの高さ.
         * @type {Number}
         [/lang]
         [lang:en]
         * Map tile height.
         * @type {Number}
         [/lang]
         */
        tileHeight: {
            get: function() {
                return this._tileHeight;
            },
            set: function(tileHeight) {
                this._tileHeight = tileHeight;
                this._dirty = true;
            }
        },
        /**
         [lang:ja]
         * @private
         [/lang]
         [lang:en]
         * @private
         [/lang]
         */
        width: {
            get: function() {
                return this._tileWidth * this._data[0][0].length;
            }
        },
        /**
         [lang:ja]
         * @private
         [/lang]
         [lang:en]
         * @private
         [/lang]
         */
        height: {
            get: function() {
                return this._tileHeight * this._data[0].length;
            }
        },
        /**
         [lang:ja]
         * @private
         [/lang]
         [lang:en]
         * @private
         [/lang]
         */
        redraw: function(x, y, width, height) {
            if (this._image == null) {
                return;
            }

            var image, tileWidth, tileHeight, dx, dy;
            if (this._doubledImage) {
                image = this._doubledImage;
                tileWidth = this._tileWidth * 2;
                tileHeight = this._tileHeight * 2;
                dx = -this._offsetX * 2;
                dy = -this._offsetY * 2;
                x *= 2;
                y *= 2;
                width *= 2;
                height *= 2;
            } else {
                image = this._image;
                tileWidth = this._tileWidth;
                tileHeight = this._tileHeight;
                dx = -this._offsetX;
                dy = -this._offsetY;
            }
            var row = image.width / tileWidth | 0;
            var col = image.height / tileHeight | 0;
            var left = Math.max((x + dx) / tileWidth | 0, 0);
            var top = Math.max((y + dy) / tileHeight | 0, 0);
            var right = Math.ceil((x + dx + width) / tileWidth);
            var bottom = Math.ceil((y + dy + height) / tileHeight);

            var source = image._element;
            var context = this._context;
            var canvas = context.canvas;
            context.clearRect(x, y, width, height);
            for (var i = 0, len = this._data.length; i < len; i++) {
                var data = this._data[i];
                var r = Math.min(right, data[0].length);
                var b = Math.min(bottom, data.length);
                for (y = top; y < b; y++) {
                    for (x = left; x < r; x++) {
                        var n = data[y][x];
                        if (0 <= n && n < row * col) {
                            var sx = (n % row) * tileWidth;
                            var sy = (n / row | 0) * tileHeight;
                            context.drawImage(source, sx, sy, tileWidth, tileHeight,
                                x * tileWidth - dx, y * tileHeight - dy, tileWidth, tileHeight);
                        }
                    }
                }
            }
        }
    });
}());

