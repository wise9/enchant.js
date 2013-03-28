var _intersectBetweenClassAndInstance = function(Class, instance) {
    var ret = [];
    var c;
    for (var i = 0, l = Class.collection.length; i < l; i++) {
        c = Class.collection[i];
        if (instance._intersectOne(c)) {
            ret.push(c);
        }
    }
    return ret;
};

var _intersectBetweenClassAndClass = function(Class1, Class2) {
    var ret = [];
    var c1, c2;
    for (var i = 0, l = Class1.collection.length; i < l; i++) {
        c1 = Class1.collection[i];
        for (var j = 0, ll = Class2.collection.length; j < ll; j++) {
            c2 = Class2.collection[j];
            if (c1._intersectOne(c2)) {
                ret.push([ c1, c2 ]);
            }
        }
    }
    return ret;
};

var _intersectStrictBetweenClassAndInstance = function(Class, instance) {
    var ret = [];
    var c;
    for (var i = 0, l = Class.collection.length; i < l; i++) {
        c = Class.collection[i];
        if (instance._intersectStrictOne(c)) {
            ret.push(c);
        }
    }
    return ret;
};

var _intersectStrictBetweenClassAndClass = function(Class1, Class2) {
    var ret = [];
    var c1, c2;
    for (var i = 0, l = Class1.collection.length; i < l; i++) {
        c1 = Class1.collection[i];
        for (var j = 0, ll = Class2.collection.length; j < ll; j++) {
            c2 = Class2.collection[j];
            if (c1._intersectStrictOne(c2)) {
                ret.push([ c1, c2 ]);
            }
        }
    }
    return ret;
};

var _staticIntersect = function(other) {
    if (other instanceof enchant.Entity) {
        return _intersectBetweenClassAndInstance(this, other);
    } else if (typeof other === 'function' && other.collection) {
        return _intersectBetweenClassAndClass(this, other);
    }
    return false;
};

var _staticIntersectStrict = function(other) {
    if (other instanceof enchant.Entity) {
        return _intersectStrictBetweenClassAndInstance(this, other);
    } else if (typeof other === 'function' && other.collection) {
        return _intersectStrictBetweenClassAndClass(this, other);
    }
    return false;
};

/**
 * @scope enchant.Entity.prototype
 */
enchant.Entity = enchant.Class.create(enchant.Node, {
    /**
     * @name enchant.Entity
     * @class
     [lang:ja]
     * DOM上で表示する実体を持ったクラス. 直接使用することはない.
     [/lang]
     [lang:en]
     * A class with objects displayed as DOM elements. Not to be used directly.
     [/lang]
     [lang:de]
     * Eine Klasse die Objekte mit Hilfe von DOM Elementen darstellt.
     * Sollte nicht direkt verwendet werden.
     [/lang]
     * @constructs
     * @extends enchant.Node
     */
    initialize: function() {
        var core = enchant.Core.instance;
        enchant.Node.call(this);

        this._rotation = 0;
        this._scaleX = 1;
        this._scaleY = 1;

        this._touchEnabled = true;
        this._clipping = false;

        this._originX = null;
        this._originY = null;

        this._width = 0;
        this._height = 0;
        this._backgroundColor = null;
        this._debugColor = '#0000ff';
        this._opacity = 1;
        this._visible = true;
        this._buttonMode = null;

        this._style = {};
        this.__styleStatus = {};

        /**
         [lang:ja]
         * Entityを描画する際の合成処理を設定する.
         * Canvas上に描画する際のみ有効.
         * CanvasのコンテキストのglobalCompositeOperationにセットされる.
         [/lang]
         */
        this.compositeOperation = null;

        /**
         [lang:ja]
         * Entityにボタンの機能を設定する.
         * Entityに対するタッチ, クリックをleft, right, up, down, a, bいずれかの
         * ボタン入力として割り当てる.
         [/lang]
         [lang:en]
         * Defines this Entity as a button.
         * When touched or clicked the corresponding button event is dispatched.
         * Valid buttonModes are: left, right, up, down, a, b. 
         [/lang]
         [lang:de]
         * Definiert diese Entity als Schaltfläche (Button).
         * Bei einem Klick oder Touch wird das entsprechende
         * Button Ereignis (Event) ausgelöst.
         * Mögliche buttonModes sind: left, right, up, down, a, b. 
         [/lang]
         * @type {String}
         */
        this.buttonMode = null;
        /**
         [lang:ja]
         * Entityが押されているかどうか.
         * {@link enchant.Entity.buttonMode}が設定されているときだけ機能する.
         [/lang]
         [lang:en]
         * Indicates if this Entity is being clicked.
         * Only works when {@link enchant.Entity.buttonMode} is set.
         [/lang]
         [lang:de]
         * Zeigt an, ob auf die Entity geklickt wurde.
         * Funktioniert nur wenn {@link enchant.Entity.buttonMode} gesetzt ist.
         [/lang]
         * @type {Boolean}
         */
        this.buttonPressed = false;
        this.addEventListener('touchstart', function() {
            if (!this.buttonMode) {
                return;
            }
            this.buttonPressed = true;
            var e = new enchant.Event(this.buttonMode + 'buttondown');
            this.dispatchEvent(e);
            core.dispatchEvent(e);
        });
        this.addEventListener('touchend', function() {
            if (!this.buttonMode) {
                return;
            }
            this.buttonPressed = false;
            var e = new enchant.Event(this.buttonMode + 'buttonup');
            this.dispatchEvent(e);
            core.dispatchEvent(e);
        });

        this.enableCollection();
    },
    /**
     [lang:ja]
     * Entityの横幅.
     [/lang]
     [lang:en]
     * The width of the Entity.
     [/lang]
     [lang:de]
     * Die Breite der Entity.
     [/lang]
     * @type {Number}
     */
    width: {
        get: function() {
            return this._width;
        },
        set: function(width) {
            this._width = width;
            this._dirty = true;
        }
    },
    /**
     [lang:ja]
     * Entityの高さ.
     [/lang]
     [lang:en]
     * The height of the Entity.
     [/lang]
     [lang:de]
     * Die Höhe der Entity.
     [/lang]
     * @type {Number}
     */
    height: {
        get: function() {
            return this._height;
        },
        set: function(height) {
            this._height = height;
            this._dirty = true;
        }
    },
    /**
     [lang:ja]
     * Entityの背景色.
     * CSSの'color'プロパティと同様の形式で指定できる.
     [/lang]
     [lang:en]
     * The Entity background color.
     * Must be provided in the same format as the CSS 'color' property.
     [/lang]
     [lang:de]
     * Die Hintergrundfarbe der Entity.
     * Muss im gleichen Format definiert werden wie das CSS 'color' Attribut.
     [/lang]
     * @type {String}
     */
    backgroundColor: {
        get: function() {
            return this._backgroundColor;
        },
        set: function(color) {
            this._backgroundColor = color;
        }
    },
    /**
     [lang:ja]
     * Entityのデバッグの枠色.
     * CSSの'color'プロパティと同様の形式で指定できる.
     [/lang]
     [lang:en]
     * The Entity debug color.
     * Must be provided in the same format as the CSS 'color' property.
     [/lang]
     * @type {String}
     */
    debugColor: {
        get: function() {
            return this._debugColor;
        },
        set: function(color) {
            this._debugColor = color;
        }
    },
    /**
     [lang:ja]
     * Entityの透明度.
     * 0から1までの値を設定する(0が完全な透明, 1が完全な不透明).
     [/lang]
     [lang:en]
     * The transparency of this entity.
     * Defines the transparency level from 0 to 1
     * (0 is completely transparent, 1 is completely opaque).
     [/lang]
     [lang:de]
     * Transparenz der Entity.
     * Definiert den Level der Transparenz von 0 bis 1
     * (0 ist komplett transparent, 1 ist vollständig deckend).
     [/lang]
     * @type {Number}
     */
    opacity: {
        get: function() {
            return this._opacity;
        },
        set: function(opacity) {
            this._opacity = parseFloat(opacity);
        }
    },
    /**
     [lang:ja]
     * Entityを表示するかどうかを指定する.
     [/lang]
     [lang:en]
     * Indicates whether or not to display this Entity.
     [/lang]
     [lang:de]
     * Zeigt an, ob die Entity dargestellt werden soll oder nicht.
     [/lang]
     * @type {Boolean}
     */
    visible: {
        get: function() {
            return this._visible;
        },
        set: function(visible) {
            this._visible = visible;
        }
    },
    /**
     [lang:ja]
     * Entityのタッチを有効にするかどうかを指定する.
     [/lang]
     [lang:en]
     * Indicates whether or not this Entity can be touched.
     [/lang]
     [lang:de]
     * Definiert ob auf die Entity geklickt werden kann. 
     [/lang]
     * @type {Boolean}
     */
    touchEnabled: {
        get: function() {
            return this._touchEnabled;
        },
        set: function(enabled) {
            this._touchEnabled = enabled;
            if (enabled) {
                this._style.pointerEvents = 'all';
            } else {
                this._style.pointerEvents = 'none';
            }
        }
    },
    /**
     [lang:ja]
     * Entityの矩形が交差しているかどうかにより衝突判定を行う.
     * @param {*} other 衝突判定を行うEntityなどx, y, width, heightプロパティを持ったObject.
     * @return {Boolean} 衝突判定の結果.
     [/lang]
     [lang:en]
     * Performs a collision detection based on whether or not the bounding rectangles are intersecting.
     * @param {*} other An object like Entity, with the properties x, y, width, height, which are used for the 
     * collision detection.
     * @return {Boolean} True, if a collision was detected.
     [/lang]
     [lang:de]
     * Führt eine Kollisionsdetektion durch, die überprüft ob eine Überschneidung zwischen den
     * begrenzenden Rechtecken existiert. 
     * @param {*} other Ein Objekt wie Entity, welches x, y, width und height Variablen besitzt,
     * mit dem die Kollisionsdetektion durchgeführt wird.
     * @return {Boolean} True, falls eine Kollision festgestellt wurde.
     [/lang]
     */
    intersect: function(other) {
        if (other instanceof enchant.Entity) {
            return this._intersectOne(other);
        } else if (typeof other === 'function' && other.collection) {
            return _intersectBetweenClassAndInstance(other, this);
        }
        return false;
    },
    _intersectOne: function(other) {
        if (this._dirty) {
            this._updateCoordinate();
        } if (other._dirty) {
            other._updateCoordinate();
        }
        return this._offsetX < other._offsetX + other.width && other._offsetX < this._offsetX + this.width &&
            this._offsetY < other._offsetY + other.height && other._offsetY < this._offsetY + this.height;
    },
    intersectStrict: function(other) {
        if (other instanceof enchant.Entity) {
            return this._intersectStrictOne(other);
        } else if (typeof other === 'function' && other.collection) {
            return _intersectStrictBetweenClassAndInstance(other, this);
        }
        return false;
    },
    _intersectStrictOne: function(other) {
        if (this._dirty) {
            this._updateCoordinate();
        } if (other._dirty) {
            other._updateCoordinate();
        }
        var rect1 = this.getOrientedBoundingRect(),
            rect2 = other.getOrientedBoundingRect(),
            lt1 = rect1.leftTop, rt1 = rect1.rightTop,
            lb1 = rect1.leftBottom, rb1 = rect1.rightBottom,
            lt2 = rect2.leftTop, rt2 = rect2.rightTop,
            lb2 = rect2.leftBottom, rb2 = rect2.rightBottom,
            ltx1 = lt1[0], lty1 = lt1[1], rtx1 = rt1[0], rty1 = rt1[1],
            lbx1 = lb1[0], lby1 = lb1[1], rbx1 = rb1[0], rby1 = rb1[1],
            ltx2 = lt2[0], lty2 = lt2[1], rtx2 = rt2[0], rty2 = rt2[1],
            lbx2 = lb2[0], lby2 = lb2[1], rbx2 = rb2[0], rby2 = rb2[1],
            t1 = [ rtx1 - ltx1, rty1 - lty1 ],
            r1 = [ rbx1 - rtx1, rby1 - rty1 ],
            b1 = [ lbx1 - rbx1, lby1 - rby1 ],
            l1 = [ ltx1 - lbx1, lty1 - lby1 ],
            t2 = [ rtx2 - ltx2, rty2 - lty2 ],
            r2 = [ rbx2 - rtx2, rby2 - rty2 ],
            b2 = [ lbx2 - rbx2, lby2 - rby2 ],
            l2 = [ ltx2 - lbx2, lty2 - lby2 ],
            cx1 = (ltx1 + rtx1 + lbx1 + rbx1) >> 2,
            cy1 = (lty1 + rty1 + lby1 + rby1) >> 2,
            cx2 = (ltx2 + rtx2 + lbx2 + rbx2) >> 2,
            cy2 = (lty2 + rty2 + lby2 + rby2) >> 2,
            i, j, poss1, poss2, dirs1, dirs2, pos1, pos2, dir1, dir2,
            px1, py1, px2, py2, dx1, dy1, dx2, dy2, vx, vy, c, c1, c2;
        if (t1[0] * (cy2 - lty1) - t1[1] * (cx2 - ltx1) > 0 &&
            r1[0] * (cy2 - rty1) - r1[1] * (cx2 - rtx1) > 0 &&
            b1[0] * (cy2 - rby1) - b1[1] * (cx2 - rbx1) > 0 &&
            l1[0] * (cy2 - lby1) - l1[1] * (cx2 - lbx1) > 0) {
            return true;
        } else if (t2[0] * (cy1 - lty2) - t2[1] * (cx1 - ltx2) > 0 &&
            r2[0] * (cy1 - rty2) - r2[1] * (cx1 - rtx2) > 0 &&
            b2[0] * (cy1 - rby2) - b2[1] * (cx1 - rbx2) > 0 &&
            l2[0] * (cy1 - lby2) - l2[1] * (cx1 - lbx2) > 0) {
            return true;
        } else {
            poss1 = [ lt1, rt1, rb1, lb1 ];
            poss2 = [ lt2, rt2, rb2, lb2 ];
            dirs1 = [ t1, r1, b1, l1 ];
            dirs2 = [ t2, r2, b2, l2 ];
            for (i = 0; i < 4; i++) {
                pos1 = poss1[i];
                px1 = pos1[0]; py1 = pos1[1];
                dir1 = dirs1[i];
                dx1 = dir1[0]; dy1 = dir1[1];
                for (j = 0; j < 4; j++) {
                    pos2 = poss2[j];
                    px2 = pos2[0]; py2 = pos2[1];
                    dir2 = dirs2[j];
                    dx2 = dir2[0]; dy2 = dir2[1];
                    c = dx1 * dy2 - dy1 * dx2;
                    if (c !== 0) {
                        vx = px2 - px1;
                        vy = py2 - py1;
                        c1 = (vx * dy1 - vy * dx1) / c;
                        c2 = (vx * dy2 - vy * dx2) / c;
                        if (0 < c1 && c1 < 1 && 0 < c2 && c2 < 1) {
                            return true;
                        }
                    }
                }
            }
            return false;
        }
    },
    /**
     [lang:ja]
     * Entityの中心点どうしの距離により衝突判定を行う.
     * @param {*} other 衝突判定を行うEntityなどx, y, width, heightプロパティを持ったObject.
     * @param {Number} [distance] 衝突したと見なす最大の距離. デフォルト値は二つのEntityの横幅と高さの平均.
     * @return {Boolean} 衝突判定の結果.
     [/lang]
     [lang:en]
     * Performs a collision detection based on distance from the Entity's central point.
     * @param {*} other An object like Entity, with properties x, y, width, height, which are used for the 
     * collision detection.
     * @param {Number} [distance] The greatest distance to be considered for a collision.
     * The default distance is the average of both objects width and height.
     * @return {Boolean} True, if a collision was detected.
     [/lang]
     [lang:de]
     * Führt eine Kollisionsdetektion durch, die anhand der Distanz zwischen den Objekten feststellt,
     * ob eine Kollision aufgetreten ist.
     * @param {*} other Ein Objekt wie Entity, welches x, y, width und height Variablen besitzt,
     * mit dem die Kollisionsdetektion durchgeführt wird.
     * @param {Number} [distance] Die größte Distanz die für die Kollision in betracht gezogen wird.
     * Der Standardwert ist der Durchschnitt der Breite und Höhe beider Objekte.
     * @return {Boolean} True, falls eine Kollision festgestellt wurde.
     [/lang]
     */
    within: function(other, distance) {
        if (this._dirty) {
            this._updateCoordinate();
        } if (other._dirty) {
            other._updateCoordinate();
        }
        if (distance == null) {
            distance = (this.width + this.height + other.width + other.height) / 4;
        }
        var _;
        return (_ = this._offsetX - other._offsetX + (this.width - other.width) / 2) * _ +
            (_ = this._offsetY - other._offsetY + (this.height - other.height) / 2) * _ < distance * distance;
    }, /**
     [lang:ja]
     * Spriteを拡大縮小する.
     * @param {Number} x 拡大するx軸方向の倍率.
     * @param {Number} [y] 拡大するy軸方向の倍率.
     [/lang]
     [lang:en]
     * Enlarges or shrinks this Sprite.
     * @param {Number} x Scaling factor on the x axis.
     * @param {Number} [y] Scaling factor on the y axis.
     [/lang]
     [lang:de]
     * Vergrößert oder verkleinert dieses Sprite.
     * @param {Number} x Skalierungsfaktor auf der x-Achse.
     * @param {Number} [y] Skalierungsfaktor auf der y-Achse.
     [/lang]
     */
    scale: function(x, y) {
        this._scaleX *= x;
        this._scaleY *= (y != null) ? y : x;
        this._dirty = true;
    },
    /**
     [lang:ja]
     * Spriteを回転する.
     * @param {Number} deg 回転する角度 (度数法).
     [/lang]
     [lang:en]
     * Rotate this Sprite.
     * @param {Number} deg Rotation angle (degree).
     [/lang]
     [lang:de]
     * Rotiert dieses Sprite.
     * @param {Number} deg Rotationswinkel (Grad).
     [/lang]
     */
    rotate: function(deg) {
        this._rotation += deg;
        this._dirty = true;
    },
    /**
     [lang:ja]
     * Spriteのx軸方向の倍率.
     [/lang]
     [lang:en]
     * Scaling factor on the x axis of this Sprite.
     [/lang]
     [lang:de]
     * Skalierungsfaktor auf der x-Achse dieses Sprites.
     [/lang]
     * @type {Number}
     */
    scaleX: {
        get: function() {
            return this._scaleX;
        },
        set: function(scaleX) {
            this._scaleX = scaleX;
            this._dirty = true;
        }
    },
    /**
     [lang:ja]
     * Spriteのy軸方向の倍率.
     [/lang]
     [lang:en]
     * Scaling factor on the y axis of this Sprite.
     [/lang]
     [lang:de]
     * Skalierungsfaktor auf der y-Achse dieses Sprites.
     [/lang]
     * @type {Number}
     */
    scaleY: {
        get: function() {
            return this._scaleY;
        },
        set: function(scaleY) {
            this._scaleY = scaleY;
            this._dirty = true;
        }
    },
    /**
     [lang:ja]
     * Spriteの回転角 (度数法).
     [/lang]
     [lang:en]
     * Sprite rotation angle (degree).
     [/lang]
     [lang:de]
     * Rotationswinkel des Sprites (Grad).
     [/lang]
     * @type {Number}
     */
    rotation: {
        get: function() {
            return this._rotation;
        },
        set: function(rotation) {
            this._rotation = rotation;
            this._dirty = true;
        }
    },
    /**
     [lang:ja]
     * 回転・拡大縮小の基準点のX座標
     [/lang]
     [lang:en]
     * The point of origin used for rotation and scaling.
     [/lang]
     [lang:de]
     * Ausgangspunkt für Rotation und Skalierung.
     [/lang]
     * @type {Number}
     */
    originX: {
        get: function() {
            return this._originX;
        },
        set: function(originX) {
            this._originX = originX;
            this._dirty = true;
        }
    },
    /**
     [lang:ja]
     * 回転・拡大縮小の基準点のY座標
     [/lang]
     [lang:en]
     * The point of origin used for rotation and scaling.
     [/lang]
     [lang:de]
     * Ausgangspunkt für Rotation und Skalierung.
     [/lang]
     * @type {Number}
     */
    originY: {
        get: function() {
            return this._originY;
        },
        set: function(originY) {
            this._originY = originY;
            this._dirty = true;
        }
    },
    /**
     [lang:ja]
     * インスタンスをコレクションの対象にする.
     * デフォルトで呼び出される.
     [/lang]
     */
    enableCollection: function() {
        this.addEventListener('addedtoscene', this._addSelfToCollection);
        this.addEventListener('removedfromscene', this._removeSelfFromCollection);
        if (this.scene) {
            this._addSelfToCollection();
        }
    },
    /**
     [lang:ja]
     * インスタンスをコレクションの対象から除外する.
     [/lang]
     */
    disableCollection: function() {
        this.removeEventListener('addedtoscene', this._addSelfToCollection);
        this.removeEventListener('removedfromscene', this._removeSelfFromCollection);
        if (this.scene) {
            this._removeSelfFromCollection();
        }
    },
    _addSelfToCollection: function() {
        var Constructor = this.getConstructor();
        Constructor._collectionTarget.forEach(function(C) {
            C.collection.push(this);
        }, this);
    },
    _removeSelfFromCollection: function() {
        var Constructor = this.getConstructor();
        Constructor._collectionTarget.forEach(function(C) {
            var i = C.collection.indexOf(this);
            if (i !== -1) {
                C.collection.splice(i, 1);
            }
        }, this);
    },
    getBoundingRect: function() {
        var w = this.width || 0;
        var h = this.height || 0;
        var mat = this._matrix;
        var m11w = mat[0] * w, m12w = mat[1] * w,
            m21h = mat[2] * h, m22h = mat[3] * h,
            mdx = mat[4], mdy = mat[5];
        var xw = [ mdx, m11w + mdx, m21h + mdx, m11w + m21h + mdx ].sort(function(a, b) { return a - b; });
        var yh = [ mdy, m12w + mdy, m22h + mdy, m12w + m22h + mdy ].sort(function(a, b) { return a - b; });

        return {
            left: xw[0],
            top: yh[0],
            width: xw[3] - xw[0],
            height: yh[3] - yh[0]
        };
    },
    getOrientedBoundingRect: function() {
        var w = this.width || 0;
        var h = this.height || 0;
        var mat = this._matrix;
        var m11w = mat[0] * w, m12w = mat[1] * w,
            m21h = mat[2] * h, m22h = mat[3] * h,
            mdx = mat[4], mdy = mat[5];

        return {
            leftTop: [ mdx, mdy ],
            rightTop: [ m11w + mdx, m12w + mdy ],
            leftBottom: [ m21h + mdx, m22h + mdy ],
            rightBottom: [ m11w + m21h + mdx, m12w + m22h + mdy ]
        };
    },
    getConstructor: function() {
        return Object.getPrototypeOf(this).constructor;
    }
});

var _collectizeConstructor = function(Constructor) {
    if (Constructor._collective) {
        return;
    }
    var rel = enchant.Class.getInheritanceTree(Constructor);
    var i = rel.indexOf(enchant.Entity);
    if (i !== -1) {
        Constructor._collectionTarget = rel.splice(0, i + 1);
    } else {
        Constructor._collectionTarget = [];
    }
    Constructor.intersect = _staticIntersect;
    Constructor.intersectStrict = _staticIntersectStrict;
    Constructor.collection = [];
    Constructor._collective = true;
};

_collectizeConstructor(enchant.Entity);

enchant.Entity._inherited = function(subclass) {
    _collectizeConstructor(subclass);
};
