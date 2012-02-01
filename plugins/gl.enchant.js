/*
 * gl.enchant.js
 *
 * ベクトル・行列演算にglMatrix.jsを使用しています.
 * glMatrix.js:
 * http://code.google.com/p/glmatrix/
 * glMatrix.jsの詳しい使い方:
 * http://code.google.com/p/glmatrix/wiki/Usage
 *
 */

var VENDER_PREFIX = (function() {
    var ua = navigator.userAgent;
    if (ua.indexOf('Opera') != -1) {
        return 'O';
    } else if (ua.indexOf('MSIE') != -1) {
        return 'ms';
    } else if (ua.indexOf('WebKit') != -1) {
        return 'webkit';
    } else if (navigator.product == 'Gecko') {
        return 'Moz';
    } else {
        return '';
    }
})();

/**
 * enchantにenchantPROライブラリのクラスをエクスポートする.
 */
enchant.gl= {};
var gl;

function parseColor(arg) {
    var color = [];
    if (typeof arg == 'string') {
        if (arg.match(/#/)) {
            arg.match(/[0-9a-fA-F]{2}/g).forEach(function(n) {
                    color[color.length] = ('0x' + n - 0) / 255;
                    });
            color[color.length] = 1.0;
        } else if (arg.match(/rgba/)) {
            arg.match(/[0-9]{1,3},/g).forEach(function(n) {
                    color[color.length] = parseInt(n, 10) / 255;
                    });
            color[color.length] = parseFloat(arg.match(/[0-9]\.[0-9]{1,}/)[0]);
        } else if (arg.match(/rgb/)) {
            arg.match(/[0-9]{1,3},/g).forEach(function(n) {
                    color[color.length] = parseInt(n, 10) / 255;
                    });
            color[color.length] = 1.0;
        }
    } else if (arg instanceof Array) {
        color = arg;
    }
    return color;
};


function createDebugContext(context) {
    var ctx = {};
    var type = '';
    context.names = {};
    for (prop in context) {
        type = typeof context[prop];
        if (type == 'function') {
            ctx[prop] = (function(context, prop) {
                return function() {
                    value = undefined;
                    value = context[prop].apply(context, arguments);
                    error = context.getError();
                    if (error) {
                        if (prop != 'viewport') {
                            console.log(context.names[error] + '[' + error + ']: ' + prop);
                            console.log(arguments);
                        }
                    }
                    return value;
                }
            })(context, prop);
        } else if (type == 'number') {
            context.names[context[prop]] = prop;
            ctx[prop] = context[prop];
        } else {
            ctx[prop] = context[prop];
        }
    }
    ctx.getPropName = function(index) {
        return context.names[index];
    };
    return ctx;
}

var storage = {};
storage.detectColorNum = 0;
storage.detectColorList = new Array();
storage.textures = {};
storage.texturesNum = 0;
storage.hasTexture = function(src) {
    return (typeof this.textures[src] != 'undefined');
};
storage.getNewTexture = function(image) {
    var tex = gl.createTexture();
    tex.id = this.texturesNum;
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.bindTexture(gl.TEXTURE_2D, null);
    this.textures[image.src] = tex;
    this.texturesNum += 1;
    return tex;
};
storage.attachDetectColor = function(sprite) {
    this.detectColorNum += 1;
    this.detectColorList[this.detectColorNum] = sprite;
    return [parseInt(this.detectColorNum / 65536) / 255,
            parseInt(this.detectColorNum / 256) / 255,
            parseInt(this.detectColorNum % 256) / 255, 1.0];
};
storage.decodeDetectColor = function(color) {
    return color[0] * 65536 + color[1] * 256 + color[2];
};
storage.color2sprite = function(color) {
    return this.detectColorList[this.decodeDetectColor(color)];
};

enchant.gl.collision = {};
(function() {
    var point2point = function(p1, p2) {
        var vx = p1.x + p1.parent.x - p2.x - p2.parent.x;
        var vy = p1.y + p1.parent.y - p2.y - p2.parent.y;
        var vz = p1.z + p1.parent.z - p2.z - p2.parent.z;
        return (vx * vx + vy * vy + vz * vz);
    };
    var point2BS = function(p, bs) {
        return (point2point(p, bs) - bs.radius * bs.radius);
    };
    var point2AABB = function(p, aabb) {
        var ppx = p.x + p.parent.x;
        var ppy = p.y + p.parent.y;
        var ppz = p.z + p.parent.z;
        var px = aabb.parent.x + aabb.x + aabb.scale;
        var py = aabb.parent.y + aabb.y + aabb.scale;
        var pz = aabb.parent.z + aabb.z + aabb.scale;
        var nx = aabb.parent.x + (aabb.x - aabb.scale);
        var ny = aabb.parent.y + (aabb.y - aabb.scale);
        var nz = aabb.parent.z + (aabb.z - aabb.scale);
        var dist = 0;
        if (ppx < nx) {
            dist += (ppx - nx) * (ppx - nx);
        } else if (px < ppx) {
            dist += (ppx - px) * (ppx - px);
        }
        if (ppy < ny) {
            dist += (ppy - ny) * (ppy - ny);
        } else if (py < ppy) {
            dist += (ppy - py) * (ppy - py);
        }
        if (ppz < nz) {
            dist += (ppz - nz) * (ppz - nz);
        } else if (pz < ppz) {
            dist += (ppz - pz) * (ppz - pz);
        }
        return dist;
    };
    var point2OBB = function(p, obb) {


        return 1;
    };
    var BS2BS = function(bs1, bs2) {
        return (point2point(bs1, bs2) - (bs1.radius + bs2.radius) * (bs1.radius + bs2.radius));
    };
    var BS2AABB = function(bs, aabb) {
        return (point2AABB(bs, aabb) - bs.radius * bs.radius);
    };
    var BS2OBB = function(bs, obb) {
        return 1;
    };
    var AABB2AABB = function(aabb1, aabb2) {
        var px1 = aabb1.parent.x + aabb1.x + aabb1.scale;
        var py1 = aabb1.parent.y + aabb1.y + aabb1.scale;
        var pz1 = aabb1.parent.z + aabb1.z + aabb1.scale;

        var nx1 = aabb1.parent.x + (aabb1.x - aabb1.scale);
        var ny1 = aabb1.parent.y + (aabb1.y - aabb1.scale);
        var nz1 = aabb1.parent.z + (aabb1.z - aabb1.scale);

        var px2 = aabb2.parent.x + aabb2.x + aabb2.scale;
        var py2 = aabb2.parent.y + aabb2.y + aabb2.scale;
        var pz2 = aabb2.parent.z + aabb2.z + aabb2.scale;

        var nx2 = aabb2.parent.x + (aabb2.x - aabb2.scale);
        var ny2 = aabb2.parent.y + (aabb2.y - aabb2.scale);
        var nz2 = aabb2.parent.z + (aabb2.z - aabb2.scale);
        return ((nx2 <= px1) && (nx1 <= px2)
            && (ny2 <= py1) && (ny1 <= py2)
            && (nz2 <= pz1) && (nz1 <= pz2)) ? 0.0 : 1.0;
    };
    var AABB2OBB = function(aabb, obb) {
        return 1;
    };
    var OBB2OBB = function(obb1, obb2) {
        return 1;
    };

    /**
     * @scope enchant.gl.collision.Bounding.prototype
     */
    enchant.gl.collision.Bounding = enchant.Class.create({
        /**
         * Sprite3Dの衝突判定を設定するクラス.
         * 点として定義されている.
         * enchant.gl.collision.Boundingを継承したクラスとして, 
         * {@link enchant.gl.collision.BS}, {@link enchant.gl.collision.AABB},
         * {@link enchant.gl.collision.OBB}, がある.
         * 現在, OBBはサポートされていない.
         * @constructs
         */
        initialize: function() {
            this.type = 'point';
            this.threshold = 0.0001;
            this.x = 0;
            this.y = 0;
            this.z = 0;
            this.parent = {
                x: 0,
                y: 0,
                z: 0
            };
        },
        /**
         * 点との距離を計算する.
         * @param {enchant.gl.collision.Bounding} bounding 衝突点オブジェクト
         * @return {Number}
         */
        toBounding: function(another) {
            return point2point(this, another);
        },
        /**
         * 球との距離を計算する.
         * @param {enchant.gl.collision.BS} boudning 衝突球オブジェクト
         * @return {Number}
         */
        toBS: function(another) {
            return point2BS(this, another);
        },
        /**
         * 回転しない立方体との距離を計算する.
         * 現在, 衝突していなければ1, 衝突していれば0が返される.
         * @param {enchant.gl.collision.AABB} bounding AABB
         * @return {Number}
         */
        toAABB: function(another) {
            return point2AABB(this, another);
        },
        /**
         * 回転する直方体との距離を計算する.
         * 現在, サポートされていない.
         * @param {enchant.gl.collision.OBB} bounding OBB
         * @return {Number}
         */
        toOBB: function(another) {
            return point2OBB(this, another);
        },
        /**
         * 他の衝突判定オブジェクトとの衝突判定.
         * 衝突判定オブジェクトか, x, y, zプロパティを持っているオブジェクトとの衝突を判定することができる.
         * @param {enchant.gl.collision.Bounding|enchant.gl.collision.BS|enchant.gl.collision.AABB|enchant.gl.collision.OBB} bounding 衝突判定オブジェクト
         * @return {Boolean}
         */
        intersect: function(another) {
            switch (another.type) {
                case 'point':
                    return (this.toBounding(another) < this.threshold);
                case 'BS':
                    return (this.toBS(another) < this.threshold);
                case 'AABB':
                    return (this.toAABB(another) < this.threshold);
                case 'OBB':
                    return (this.toOBB(another) < this.threshold);
                default:
                    return false;
            }
        }
    });

    /**
     * @scope enchant.gl.collision.BS.prototype
     */
    enchant.gl.collision.BS = enchant.Class.create(enchant.gl.collision.Bounding, {
        /**
         * Sprite3Dの衝突判定を設定するクラス.
         * 球として定義されている.
         * @constructs
         * @see enchant.gl.collision.Bounding
         */
        initialize: function() {
            enchant.gl.collision.Bounding.call(this);
            this.type = 'BS';
            this.radius = 0.5;
        },
        toBounding: function(another) {
            return BS2point(this, another);
        },
        toBS: function(another) {
            return BS2BS(this, another);
        },
        toAABB: function(another) {
            return BS2AABB(this, another);
        },
        toOBB: function(another) {
            return BS2OBB(this, another);
        }
    });

    /**
     * @scope enchant.gl.collision.AABB.prototype
     */
    enchant.gl.collision.AABB = enchant.Class.create(enchant.gl.collision.Bounding, {
        /**
         * Sprite3Dの衝突判定を設定するクラス.
         * 回転しない立方体として定義されている.
         * @constructs
         * @see enchant.gl.collision.Bounding
         */
        initialize: function() {
            enchant.gl.collision.Bounding.call(this);
            this.type = 'AABB';
            this.scale = 0.5;
        },
        toBounding: function(another) {
            return AABB2point(this, another);
        },
        toBS: function(another) {
            return AABB2BS(this, another);
        },
        toAABB: function(another) {
            return AABB2AABB(this, another);
        },
        toOBB: function(another) {
            return AABB2OBB(this, another);
        }
    });

    /**
     * @scope enchant.gl.collision.OBB.prototype
     */
    enchant.gl.collision.OBB = enchant.Class.create(enchant.gl.collision.Bounding, {
        /**
         * Sprite3Dの衝突判定を設定するクラス.
         * 回転するとして定義されている.
         * @constructs
         * @see enchant.gl.collision.Bounding
         */
        initialize: function() {
            enchant.gl.collision.Bounding.call(this);
            this.type = 'OBB';
        },
        toBounding: function(another) {
            return OBB2point(this, another);
        },
        toBS: function(another) {
            return OBB2BS(this, another);
        },
        toAABB: function(another) {
            return OBB2AABB(this, another);
        },
        toOBB: function(another) {
            return OBB2OBB(this, another);
        }
    });
})();

var parentModule = null;
(function() {
    enchant();
    if (enchant.nineleap != undefined) {
        if (enchant.nineleap.memory != undefined &&
            Object.getPrototypeOf(enchant.nineleap.memory) == Object.prototype) {
            parentModule = enchant.nineleap.memory;
        } else if (enchant.nineleap != undefined &&
            Object.getPrototypeOf(enchant.nineleap) == Object.prototype) {
            parentModule = enchant.nineleap;
        }
    } else {
        parentModule = enchant;
    }
})();

enchant.gl.Game = enchant.Class.create(parentModule.Game, {
    initialize: function(width, height) {
        parentModule.Game.call(this, width, height);
        this.currentScene3D = null;
        this.addEventListener('enterframe', function(e) {
            if (!this.currentScene3D) {
                return;
            }
            var nodes = this.currentScene3D.childNodes.slice();
            var push = Array.prototype.push;
            while (nodes.length) {
                var node = nodes.pop();
                node.dispatchEvent(e);
                node.age ++;
                if (node.childNodes) {
                    push.apply(nodes, node.childNodes);
                }
            }
        });
        var canvas = document.createElement('canvas');
        var glParent = document.createElement('div');
        glParent.style.position = 'absolute';
        glParent.style.zIndex = -1;
        glParent.style[VENDER_PREFIX + 'TransformOrigin'] = '0 0';
        canvas.width = this.width;
        canvas.height = this.height;
        canvas.style.position = 'absolute';
        canvas.style['z-index'] = -1;
        canvas.style[VENDER_PREFIX + 'Transform'] = 'scale(' + this.scale + ')';
        canvas.style[VENDER_PREFIX + 'TransformOrigin'] = '0 0';

        var detect = new Sprite(this.width, this.height);
        var that = this;
        this.touching = null;
        detect.addEventListener('touchstart', function(e) {
            var scene = that.currentScene3D;
            gl.bindFramebuffer(gl.FRAMEBUFFER, scene.detectFramebuffer);
            var color = new Uint8Array(4);
            scene._draw('detect');
            gl.readPixels(parseInt(e.x), parseInt(this.height - e.y), 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, color);
            sprite = storage.color2sprite(color);
            if (sprite) {
                sprite.dispatchEvent(e);
                scene.touching = sprite;
            }
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        });
        detect.addEventListener('touchmove', function(e) {
            var scene = that.currentScene3D;
            if (scene.touching != null) {
                scene.touching.dispatchEvent(e);
            }
        });
        detect.addEventListener('touchend', function(e) {
            var scene = that.currentScene3D;
            if (scene.touching != null) {
                scene.touching.dispatchEvent(e);
            }
            scene.touching = null;
        });
            
        var stage = document.getElementById('enchant-stage');
        glParent.appendChild(canvas);
        this.rootScene.addChild(detect);
        stage.appendChild(glParent)

        try {
            //gl = createDebugContext(canvas.getContext('experimental-webgl'));
            gl = canvas.getContext('experimental-webgl');
            gl.clearColor(0.0, 0.0, 0.0, 1.0);

            gl.viewport(0, 0, this.width, this.height);
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
            gl.enable(gl.DEPTH_TEST);
            gl.enable(gl.CULL_FACE);
        } catch(e) {
            console.log(e);
            alert('could not initialized WebGL');
        }

    }
});

/**
 * @scope enchant.gl.Quat.prototype
 */
enchant.gl.Quat = enchant.Class.create({
    /**
     * クォータニオンを簡単に使用するクラス.
     * @param {Number} x
     * @param {Number} y
     * @param {Number} z
     * @param {Number} rad
     * @constructs
     */
    initialize: function(x, y, z, rad) {
        var l = Math.sqrt(x * x + y * y + z * z);
        if (l) {
            x /= l;
            y /= l;
            z /= l;
        }
        var s = Math.sin(rad/2);
        var c = Math.cos(rad/2);
        this._quat = quat4.create([s*x, s*y, s*z, c]);
    },

    /**
     * クォータニオン同士で球面線形補間を行う.
     * 自身ともう一つのクォータニオンの間の回転移動を補完したクォータニオンを計算する.
     * 回転の度合いは0から1の値で表される. 0が自身側, 1がもう一つ側.
     * 新しいインスタンスが返される.
     * @param {enchant.gl.Quat} Quaternion
     * @param {Number} ratio
     * @return {enchant.gl.Quat}
     */
    slerp: function(another, ratio) {
        var q = new Quat(0, 0, 0, 0);
        quat4.slerp(this._quat, another._quat, ratio, q);
        return q;
    },
    /**
     * クォータニオン同士で球面線形補間を行う.
     * 自身ともう一つのクォータニオンの間の回転移動を補完したクォータニオンを計算する.
     * 回転の度合いは0から1の値で表される. 0が自身側, 1がもう一つ側.
     * 自身の値が上書きされる.
     * @param {enchant.gl.Quat} Quaternion
     * @param {Number} ratio
     * @return {enchant.gl.Quat}
     */
    slerpApply: function(another, ratio) {
        quat4.slerp(this._quat, another._quat, ratio);
        return this;
    },
    /**
     * クォータニオンを回転行列に変換する.
     * @param {Number[]} matrix
     * @return {Number[]}
     */
    toMat4: function(matrix) {
        quat4.toMat4(this._quat, matrix);
        return matrix;
    }
});

/**
 * @scope enchant.gl.Light3D.prototype
 */
enchant.gl.Light3D = enchant.Class.create(enchant.EventTarget, {
    /**
     * 光源クラスの親となるクラス.
     *
     * @constructs
     * @extends enchant.EventTarget
     */
    initialize: function() {
        this._changedColor = true;
        this._color = [0.8, 0.8, 0.8];
    },

    /**
     * 光源の光の色
     * @type Number[]
     */
    color: {
        set: function(array) {
            this._color = array;
            this._changedColor = true;
        },
        get :function() {
            return this._color;
        }
    }
});

/**
 * @scope enchant.gl.DirectionalLight.prototype
 */
enchant.gl.DirectionalLight = enchant.Class.create(enchant.gl.Light3D, {
    /**
     * 3Dシーンでの光源を設定するクラス.
     * 位置を持たない方向光源.
     * @example
     *   var scene = new Scene3D();
     *   var light = new DirectionalLight();
     *   light.color = [1.0, 1.0, 0.0];
     *   light.directionY = 10;
     *   scene.setDirectionalLight(light);
     *
     * @constructs
     * @extends enchant.gl.Light3D
     */
    initialize: function() {
        enchant.gl.Light3D.call(this);
        this._directionX = 0.5;
        this._directionY = 0.5;
        this._directionZ = 1.0;
        this._changedDirection = true;
    }
});

/**
 * 光源の照射方向のx成分
 * @type Number
 */
enchant.gl.DirectionalLight.prototype.directionX = 0.5;

/**
 * 光源の照射方向のy成分
 * @type Number
 */
enchant.gl.DirectionalLight.prototype.directionY = 0.5;

/**
 * 光源の照射方向のz成分
 * @type Number
 */
enchant.gl.DirectionalLight.prototype.directionZ = 1.0;

/**
 * 光源の照射方向
 * @type {Number}
 */
'directionX directionY directionZ'.split(' ').forEach(function(prop) {
    Object.defineProperty(enchant.gl.DirectionalLight.prototype, prop, {
        get: function() {
            return this['_' + prop];
        },
        set: function(n) {
            this['_' + prop] = n;
            this._changedDirection = true;
        }
    });
    enchant.gl.DirectionalLight.prototype[prop] = 0;
});

/**
 * @scope enchant.gl.PointLight.prototype
 */
enchant.gl.PointLight = enchant.Class.create(enchant.gl.Light3D, {
    /**
     * 3Dシーンでの光源を設定するクラス.
     * 方向を持たない点光源.
     * 現在, シーンに追加しても適用されない.
     * @example
     *   var scene = new Scene3D();
     *   var light = new PointLight();
     *   light.color = [1.0, 1.0, 0.0];
     *   light.y = 10;
     *   scene.addLight(light);
     *
     * @constructs
     * @extends enchant.gl.Light3D
     */
    initialize: function() {
        enchant.gl.Light3D.call(this);
        this._x = 0;
        this._y = 0;
        this._z = 0;
        this._changedPosition = true;
    }
});

/**
 * 光源のx座標
 * @type Number
 */
enchant.gl.PointLight.prototype.x = 0;

/**
 * 光源のy座標
 * @type Number
 */
enchant.gl.PointLight.prototype.y = 0;

/**
 * 光源のz座標
 * @type Number
 */
enchant.gl.PointLight.prototype.z = 0;

'x y z'.split(' ').forEach(function(prop) {
    Object.defineProperty(enchant.gl.PointLight.prototype, prop, {
        get: function() {
            return this['_' + prop];
        },
        set: function(n) {
            this['_' + prop] = n;
            this._changedPosition = true;
        }
    });
    enchant.gl.PointLight.prototype[prop] = 0;
});


/**
 * @scope enchant.gl.Texture.prototype
 */
enchant.gl.Texture = enchant.Class.create({
    /**
     * テクスチャ情報を格納するクラス.
     * @example
     *   var sprite = new Sprite3D();
     *   var texture = new Texture();
     *   texture.src = "http://example.com/texture.png";
     *   // 以下のようにも宣言できる.
     *   // var texture = new Texture("http://example.com/texture.png");
     *   sprite.texture = texture;
     * @constructs
     */
    initialize: function(src) {
        /**
         * 環境光のパラメータ
         * @type Number[]
         */
        this.ambient = [ 0.1, 0.1, 0.1, 1.0 ];

        /**
         * 拡散光のパラメータ
         * @type Number[]
         */
        this.diffuse = [ 1.0, 1.0, 1.0, 1.0];

        /**
         * 光の反射量
         * @type Number[]
         */
        this.specular = [ 1.0, 1.0, 1.0, 1.0 ];

        /**
         * 光の発光量
         * @type Number[]
         */
        this.emission = [ 0.0, 0.0, 0.0, 1.0 ];

        /**
         * 鏡面計数
         * @type Number
         */
        this.shininess =20;

        this._glTexture = null;
        this._image = null;
        if (src) {
            this.src = src;
        }
    },

    /**
     * テクスチャ画像のソース.
     * URLかgame.assets内のデータを指定できる.
     * @type String
     * @type enchant.Surface
     */
    src: {
        get: function() {
            return this._src;
        },
        set: function(source) {
            if (!this._glTexture) {
                this._glTexture = gl.createTexture();
            }
            var that = this;
            var onload = (function(that) {
                return function() {
                    if (storage.hasTexture(that._image.src)) {
                        that._glTexture = storage.textures[that._image.src];
                    } else {
                        that._glTexture = storage.getNewTexture(that._image);
                    }
                }
            })(that);
            if (source instanceof Image) {
                this._image = source;
                onload();
            } else if (source instanceof Surface) {
                this._image = source._element;
                onload();
            } else if (typeof source == 'string') {
                this._image = new Image();
                this._image.onload = onload;
                this._image.src = source;
            }
        }
    }
});

/**
 * @scope enchant.gl.Mesh.prototype
 */
enchant.gl.Mesh = enchant.Class.create({
    /**
     * 頂点配列やテクスチャを格納するクラス.
     * スプライトのプロパティとして使用される.
     * @constructs
     */
    initialize: function() {
        this.verticesBuffer = gl.createBuffer();
        this.normalsBuffer = gl.createBuffer();
        this.colorsBuffer = gl.createBuffer();
        this.texCoordsBuffer = gl.createBuffer();
        this.indicesBuffer = gl.createBuffer();

        this.vertices = [];
        this.normals = [];
        this.colors = [];
        this.texCoords = [];
        this.indices = [];

        this.texture = new Texture();
    },

    /**
     * Meshの色を変更する.
     * Mesh.colorsを指定した色の頂点配列にする.
     * @param {Number[]|String} z z軸方向の平行移動量
     * @example
     *   var sprite = new Sprite3D();
     *   //紫色に設定. どれも同じ結果が得られる.
     *   sprite.mesh.setBaseColor([1.0, 0.0, 1.0, 0.0]);
     *   sprite.mesh.setBaseColor('#ff00ff');
     *   sprite.mesh.setBaseColor('rgb(255, 0, 255');
     *   sprite.mesh.setBaseColor('rgba(255, 0, 255, 1.0');
     */
    setBaseColor: function(color) {
        var c = parseColor(color);
        var newColors = [];
        for (var i = 0, l = this.vertices.length / 3; i < l; i++) {
            Array.prototype.push.apply(newColors, c);
        }
        this.colors = newColors;
    },

    /**
     * Meshの頂点配列.
     * 3つの要素を一組として頂点を指定する. 全体の要素数は, 頂点の個数nに対して3nとなる.
     * 3n, 3n+1, 3n+2番目の要素はそれぞれ, n番目の頂点のx, y, z座標である.
     * @example
     *   var sprite = new Sprite3D();
     *   //頂点配列を代入
     *   //データはx, y, z, x, y, z...の順に格納する
     *   sprite.mesh.vertices = [
     *       0.0, 0.0, 0.0,  //0番目の頂点(0.0, 0.0, 0.0)
     *       1.0, 0.0, 0.0,  //1番目の頂点(1.0, 0.0, 0.0)
     *       1.0, 1.0, 0.0,  //2番目の頂点(1.0, 1.0, 0.0)
     *       0.0, 1.0, 0.0   //3番目の頂点(0.0, 1.0, 0.0)
     *   ];
     * @type Number[]
     * @see enchant.gl.Mesh#indices
     * @see enchant.gl.Mesh#normals
     * @see enchant.gl.Mesh#texCoords
     */
    vertices: {
        set: function(array) {
            this._vertices = array;
            gl.bindBuffer(gl.ARRAY_BUFFER, this.verticesBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this._vertices), gl.STATIC_DRAW);
        },
        get: function() {
            return this._vertices;
        }
    },

    /**
     * Meshの頂点法線ベクトル配列.
     * 3つの要素を一組として法線ベクトルを指定する. 全体の要素数は, 法線ベクトルの個数nに対して3nとなる.
     * 3n, 3n+1, 3n+2番目の要素はそれぞれ, n番目の頂点の法線ベクトルのx, y, z成分である.
     * 法線ベクトルはライティングの影の計算に利用される.
     * @example
     *   var sprite = new Sprite3D();
     *   //頂点配列を代入
     *   //データはx, y, z, x, y, z...の順に格納する
     *   sprite.mesh.vertices = [
     *       0.0, 0.0, 0.0,  //0番目の頂点(0.0, 0.0, 0.0)
     *       1.0, 0.0, 0.0,  //1番目の頂点(1.0, 0.0, 0.0)
     *       1.0, 1.0, 0.0,  //2番目の頂点(1.0, 1.0, 0.0)
     *       0.0, 1.0, 0.0   //3番目の頂点(0.0, 1.0, 0.0)
     *   ];
     *
     *   //法線ベクトル配列を代入
     *   //データはx, y, z, x, y, z...の順に格納する
     *   sprite.normals = [
     *       0.0, 0.0, 0.0,  //0番目の頂点の法線ベクトル(0.0, 0.0, 0.0)
     *       1.0, 0.0, 0.0,  //1番目の頂点の法線ベクトル(1.0, 0.0, 0.0)
     *       1.0, 1.0, 0.0,  //2番目の頂点の法線ベクトル(1.0, 1.0, 0.0)
     *       0.0, 1.0, 0.0   //3番目の頂点の法線ベクトル(0.0, 1.0, 0.0)
     *   ];
     * @type Number[]
     * @see enchant.gl.Mesh#vertices
     * @see enchant.gl.Mesh#indices
     * @see enchant.gl.Mesh#texCoords
     */
    normals: {
        set: function(array) {
            this._normals = array;
            gl.bindBuffer(gl.ARRAY_BUFFER, this.normalsBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this._normals), gl.STATIC_DRAW);
        },
        get: function() {
            return this._normals;
        }
    },

    /**
     * Meshのテクスチャマッピング配列.
     * 2つの要素を一組としてuv座標を指定する. 全体の要素数は, 頂点の個数nに対して2nとなる.
     * 2n, 2n+1番目の要素はそれぞれ, n番目の頂点のテクスチャのu, v座標である.
     * それぞれの座標のとりうる値は0<=u,v<=1である.
     * @example
     *   var sprite = new Sprite3D();
     *   var texture = new Texture();
     *   texture.src = "texture.png";
     *   sprite.mesh.texture = texture;
     *
     *   //頂点配列を代入
     *   //データはx, y, z, x, y, z...の順に格納する
     *   sprite.mesh.vertices = [
     *       0.0, 0.0, 0.0,  //0番目の頂点(0.0, 0.0, 0.0)
     *       1.0, 0.0, 0.0,  //1番目の頂点(1.0, 0.0, 0.0)
     *       1.0, 1.0, 0.0,  //2番目の頂点(1.0, 1.0, 0.0)
     *       0.0, 1.0, 0.0   //3番目の頂点(0.0, 1.0, 0.0)
     *   ];
     *
     *   //uv座標配列を代入
     *   //データはu, v, u, v...の順に格納する
     *   sprite.mesh.texCoords = [
     *       0.0, 0.0,  //0番目の頂点のuv座標(0.0, 0.0)
     *       1.0, 0.0,  //1番目の頂点のuv座標(1.0, 0.0)
     *       1.0, 1.0,  //2番目の頂点のuv座標(1.0, 1.0)
     *       0.0, 1.0   //3番目の頂点のuv座標(0.0, 1.0)
     *   ];
     * @type Number[]
     * @see enchant.gl.Mesh#vertices
     * @see enchant.gl.Mesh#indices
     * @see enchant.gl.Mesh#normals
     * @see enchant.gl.Mesh#texture#
     */
    texCoords: {
        set: function(array) {
            this._texCoords = array;
            gl.bindBuffer(gl.ARRAY_BUFFER, this.texCoordsBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this._texCoords), gl.STATIC_DRAW);
        },
        get: function() {
            return this._texCoords;
        }
    },

    /**
     * Meshの頂点インデックス配列.
     * 3つの要素を一組として三角形を指定する.全体の要素数は, 三角形の個数nに対して3nとなる.
     * インデックスの値は, {@link enchant.gl.Mesh#vertices}で指定した頂点の番号である.
     * @example
     *   var sprite = new Sprite3D();
     *   //頂点配列を代入
     *   //データはx, y, z, x, y, z...の順に格納する
     *   sprite.vertices = [
     *       0.0, 0.0, 0.0,  //0番目の頂点(0.0, 0.0, 0.0)
     *       1.0, 0.0, 0.0,  //1番目の頂点(1.0, 0.0, 0.0)
     *       1.0, 1.0, 0.0,  //2番目の頂点(1.0, 1.0, 0.0)
     *       0.0, 1.0, 0.0   //3番目の頂点(0.0, 1.0, 0.0)
     *   ];
     *
     *   //頂点インデックスを代入
     *   //3要素一組として, 三角形を描画する
     *   //この例では(0,0,0), (1,0,0), (1,1,0)の三角形と
     *   //(1,1,0), (0,1,0), (0,0,0)の三角形の計二つを描画する
     *   sprite.indices = [
     *       0, 1, 2,
     *       2, 3, 0
     *   ];
     *   var scene = new Scene3D();
     *   scene.addChild(sprite);
     * @type Integer[]
     * @see enchant.gl.Mesh#vertices
     * @see enchant.gl.Mesh#normals
     * @see enchant.gl.Mesh#texCoords
     */
    indices: {
        set: function(array) {
            this._indices = array;
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indicesBuffer);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this._indices), gl.STATIC_DRAW);
        },
        get: function() {
            return this._indices;
        }
    },

    /**
     * Meshの頂点色配列.
     * 4つの要素を一組として頂点色を指定する. 全体の要素数は, 頂点の個数nに対して4nとなる.
     * 4n, 4n+1, 4n+2, 4n+3番目の要素はそれぞれ, n番目の頂点の色のr, g, b, a成分である.
     * 頂点色はMeshのtextureにテクスチャが割り当てられていない場合の描画に使用される.
     * {@link enchant.gl.Mesh#setBaseColor}で一括して変更することができる.
     * @example
     *   var sprite = new Sprite3D();
     *   //頂点配列を代入
     *   //データはx, y, z, x, y, z...の順に格納する
     *   sprite.mesh.vertices = [
     *       0.0, 0.0, 0.0,  //0番目の頂点(0.0, 0.0, 0.0)
     *       1.0, 0.0, 0.0,  //1番目の頂点(1.0, 0.0, 0.0)
     *       1.0, 1.0, 0.0,  //2番目の頂点(1.0, 1.0, 0.0)
     *       0.0, 1.0, 0.0   //3番目の頂点(0.0, 1.0, 0.0)
     *   ];
     *
     *   //頂点色配列を代入
     *   //データはr, g, b, ,a, r, g, b, a...の順に格納する
     *   sprite.mesh.normals = [
     *       0.0, 0.0, 1.0, 1.0, //0番目の頂点の色(0.0, 0.0, 1.0, 1.0)
     *       0.0, 1.0, 0.0, 1.0, //1番目の頂点の色(0.0, 1.0, 0.0, 1.0)
     *       0.0, 1.0, 1.0, 1.0, //2番目の頂点の色(0.0, 1.0, 1.0, 1.0)
     *       1.0, 0.0, 0.0, 1.0  //3番目の頂点の色(1.0, 0.0, 0.0, 1.0)
     *   ];
     * @type Number[]
     * @see enchant.gl.Mesh#setBaseColor
     */
    colors: {
        set: function(array) {
            this._colors = array;
            gl.bindBuffer(gl.ARRAY_BUFFER, this.colorsBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this._colors), gl.STATIC_DRAW);
        },
        get: function() {
            return this._colors;
        }
    }
});

/**
 * @scope enchant.gl.Sprite3D.prototype
 */
enchant.gl.Sprite3D = enchant.Class.create(enchant.EventTarget, {
    /**
     * Sprite3D表示機能を持ったクラス.
     * <p>デフォルトでは立方体がロードされる.</p>
     * <p>{@link enchant.gl.Scene3D}のインスタンスに追加することで, 画面上に表示することができる.
     * {@link enchant.gl.Sprite3D#vertices}, {@link enchant.gl.Sprite3D#indices},
     * {@link enchant.gl.Sprite3D#normals}などを変更することで, 任意のSprite3Dを描画することもでき,
     * テクスチャなども貼付けることができる.</p>
     * <p>また, Sprite3Dを子として追加することも可能で, 子は全て親を基準とした座標系で描画される.</p>
     * @example
     *   //シーンの初期化
     *   var scene = new Scene3D();
     *   //Sprite3Dの初期化
     *   var sprite = new Sprite3D();
     *   //Sprite3Dをシーンに追加
     *   scene.addChild(sprite);
     *
     * @constructs
     * @extends enchant.EventTarget
     */
    initialize: function() {
        enchant.EventTarget.call(this);

        /**
         * 子Sprite3D要素の配列.
         * この要素に子として追加されているSprite3Dの一覧を取得できる.
         * 子を追加したり削除したりする場合には, この配列を直接操作せずに,
         * {@link enchant.gl.Sprite3D#addChild}や{@link enchant.gl.Sprite3D#removeChild}を利用する.
         * @type enchant.gl.Sprite3D[]
         * @see enchant.gl.Sprite3D#addChild
         * @see enchant.gl.Sprite3D#removeChild
         */
        this.childNodes = [];

        /**
         * このSprite3Dが現在追加されているシーンオブジェクト.
         * どのシーンにも追加されていないときにはnull.
         * @type enchant.gl.Scene3D
         * @see enchant.gl.Scene3D#addChild
         */
        this.scene = null;

        /**
         * Sprite3Dの親要素.
         * 親が存在しない場合にはnull.
         * @type enchant.gl.Sprite3D|enchant.gl.Scene3D
         */
        this.parentNode = null;

        /**
         * Sprite3Dに適用されるメッシュオブジェクト.
         * @type enchant.gl.Mesh
         * @example
         *   var sprite = new Sprite3D();
         *   sprite.mesh = new Mesh();
         */
        this.mesh = new Mesh();

        this.bounding = new BS();
        this.bounding.parent = this;

        this.age = 0;

        this._x = 0;
        this._y = 0;
        this._z = 0;
        this._scaleX = 1;
        this._scaleY = 1;
        this._scaleZ = 1;
        this._changedTranslation = true;
        this._changedScale = true;

        this._matrix = mat4.create();
        mat4.identity(this._matrix);
        this.tmpMat = mat4.create();
        mat4.identity(this.tmpMat);
        this.modelMat = mat4.create();
        mat4.identity(this.modelMat);
        this._scale = mat4.create();
        mat4.identity(this._scale);
        this._rotation = mat4.create();
        mat4.identity(this._rotation);

        this.detectColor = storage.attachDetectColor(this);

        var parentEvent = function(e) {
            if (this.parentNode instanceof Sprite3D) {
                this.parentNode.dispatchEvent(e);
            }
        }
        this.addEventListener('touchstart', parentEvent);
        this.addEventListener('touchmove', parentEvent);
        this.addEventListener('touchend', parentEvent);

        var added = function(e) {
            if (this.childNodes.length) {
                for (var i = 0, l = this.childNodes.length; i < l; i++) {
                    this.childNodes[i].scene = this.scene;
                    this.childNodes[i].dispatchEvent(e);
                }
            }
        };
        this.addEventListener('addedtoscene', added);

        var removed = function(e) {
            if (this.childNodes.length) {
                for (var i = 0, l = this.childNodes.length; i < l; i++) {
                    this.childNodes[i].scene = null;
                    this.childNodes[i].dispatchEvent(e);
                }
            }
        };
        this.addEventListener('removedfromscene', removed);

    },

    /**
     * Sprite3Dの複製を作成する.
     * 位置,回転行列などがコピーされた新しいインスタンスが返される.
     * @example
     *   var sp = new Sprite3D();
     *   sp.x = 15;
     *   var sp2 = sp.clone();
     *   //sp2.x = 15;
     * @return {enchant.gl.Sprite3D}
     */
    clone: function() {
        var clone = new Sprite3D();
        for (prop in this) {
            if (typeof this[prop] == 'number' ||
                typeof this[prop] == 'string') {
                clone[prop] = this[prop];
            } else if (this[prop] instanceof WebGLBuffer) {
                clone[prop] = this[prop];
            } else if (this[prop] instanceof Float32Array) {
                clone[prop] = new Float32Array(this[prop]);
            } else if (this[prop] instanceof Array 
                && prop != 'childNodes'
                && prop != 'detectColor') {
                clone[prop] = this[prop].filter(function() { return true; });
            }
        }
        clone.mesh = this.mesh;
        if (this.childNodes) {
            for (var i = 0, l = this.childNodes.length; i < l; i++) {
                clone.addChild(this.childNodes[i].clone());
            }
        }
        return clone;
    },

    /**
     * 他のSprite3Dの状態をセットする.
     * Colladaファイルを読み込んだassetsに対して使用できる.
     * @example
     *   var sp = new Sprite3D();
     *   sp.set(game.assets['sample.dae']);
     *   //sample.daeのモデル情報を持ったSprite3Dになる
     *   
     */
    set: function(sprite) {
        for (prop in sprite) {
            if (typeof sprite[prop] == 'number' ||
                typeof sprite[prop] == 'string') {
                this[prop] = sprite[prop];
            } else if (sprite[prop] instanceof WebGLBuffer) {
                this[prop] = sprite[prop];
            } else if (sprite[prop] instanceof Float32Array) {
                this[prop] = new Float32Array(sprite[prop]);
            } else if (sprite[prop] instanceof Array 
                && prop != 'childNodes'
                && prop != 'detectColor') {
                this[prop] = sprite[prop].filter(function() { return true; });
            }
        }
        this.mesh = sprite.mesh;
        if (sprite.childNodes) {
            for (var i = 0, l = sprite.childNodes.length; i < l; i++) {
                this.addChild(sprite.childNodes[i].clone());
            }
        }
    },

    /**
     * 子Sprite3Dを追加する.
     * 追加が完了すると, 子Sprite3Dに対してaddedイベントが発生する.
     * 親が既にシーンに追加されていた場合には, そのシーンに追加され,
     * addedtosceneイベントが発生する.
     * @param {enchant.gl.Sprite3D} sprite 追加する子Sprite3D.
     * @example
     *   var parent = new Sprite3D();
     *   var child = new Sprite3D();
     *   //Sprite3Dを別のSprite3Dに子として追加
     *   parent.addChild(child);
     * @see enchant.gl.Sprite3D#removeChild
     * @see enchant.gl.Sprite3D#childNodes
     * @see enchant.gl.Sprite3D#parentNode
     */
    addChild: function(sprite) {
        this.childNodes.push(sprite);
        sprite.parentNode = this;
        sprite.dispatchEvent(new enchant.Event('added'));
        if (this.scene) {
            sprite.scene = this.scene;
            sprite.dispatchEvent(new enchant.Event('addedtoscene'));
        }
    },

    /**
     * 指定された子Sprite3Dを削除する.
     * 削除が完了すると, 子Sprite3Dに対してremovedイベントが発生する.
     * シーンに追加されていた場合には, そのシーンからも削除され,
     * removedfromsceneイベントが発生する.
     * @param {enchant.gl.Sprite3D} sprite 削除する子Sprite3D.
     * @example
     *   var scene = new Scene3D();
     *   //sceneの一番目の子を削除
     *   scene.removeChild(scene.childNodes[0]);
     * @see enchant.gl.Sprite3D#addChild
     * @see enchant.gl.Sprite3D#childNodes
     * @see enchant.gl.Sprite3D#parentNode
     */
    removeChild: function(sprite) {
        var i;
        if ((i = this.childNodes.indexOf(sprite)) != -1) {
            this.childNodes.splice(i, 1);
        }
        sprite.parentNode = null;
        sprite.dispatchEvent(new enchant.Event('removed'));
        if (this.scene) { 
            sprite.scene = null;
            sprite.dispatchEvent(new enchant.Event('removedfromscene'));
        }
    },

    
    /**
     * 他のオブジェクトとの衝突判定.
     * 衝突判定オブジェクトか, x, y, zプロパティを持っているオブジェクトとの衝突を判定することができる.
     * @param {enchant.gl.Sprite3D} bounding 対象のオブジェクト
     * @return {Boolean}
     */
    intersect: function(another) {
        return this.bounding.intersect(another.bounding);
    },

    /**
     * Sprite3Dを平行移動する.
     * 現在表示されている位置から, 各軸に対して指定された分だけ平行移動をする.
     * @param {Number} x x軸方向の平行移動量
     * @param {Number} y y軸方向の平行移動量
     * @param {Number} z z軸方向の平行移動量
     * @example
     *   var sprite = new Sprite3D();
     *   //x軸方向に10, y軸方向に3, z軸方向に-20平行移動
     *   sprite.translate(10, 3, -20);
     * @see enchant.gl.Sprite3D#x
     * @see enchant.gl.Sprite3D#y
     * @see enchant.gl.Sprite3D#z
     * @see enchant.gl.Sprite3D#scale
     */
    translate: function(x, y, z) {
        this._x += x;
        this._y += y;
        this._z += z;
        this._changedTranslation = true;
    },

    /**
     * Sprite3Dを拡大縮小する.
     * 現在の拡大率から, 各軸に対して指定された倍率分だけ拡大縮小をする.
     * @param {Number} x x軸方向の拡大率
     * @param {Number} y y軸方向の拡大率
     * @param {Number} z z軸方向の拡大率
     * @example
     *   var sprite = new Sprite3D();
     *   //x軸方向に2.0倍, y軸方向に3.0倍, z軸方向に0.5倍に拡大する
     *   sprite.scale(2,0, 3.0, 0.5);
     * @see enchant.gl.Sprite3D#scaleX
     * @see enchant.gl.Sprite3D#scaleY
     * @see enchant.gl.Sprite3D#scaleZ
     * @see enchant.gl.Sprite3D#translate
     */
    scale: function(x, y, z) {
        this._scaleX *= x;
        this._scaleY *= y;
        this._scaleZ *= z;
        this._changedScale = true;
    },

    /**
     * Sprite3Dの名前
     * @type String
     */
    name: {
        get: function() {
            return this._name;
        },
        set: function(name) {
            this._name = name;
        }
    },

    /**
     * Sprite3Dの回転行列.
     * 配列は長さ16の一次元配列であり, 行優先の4x4行列として解釈される.
     * @example
     *   var sprite = new Sprite3D();
     *   //x軸周りに45度回転
     *   var rotX = Math.PI() / 4;
     *   sprite.rotation = [
     *       1, 0, 0, 0,
     *       0, Math.cos(rotX), -Math.sin(rotX), 0,
     *       0, Math.sin(rotX), Math.cos(rotX), 0,
     *       0, 0, 0, 1
     *   ];
     * @type Number[]
     */
    rotation: {
        get: function() {
            return this._rotation;
        },
        set: function(rotation) {
            this._rotation = rotation;
        }
    },

    /**
     * 回転行列にクォータニオンから得られる回転行列をセットする.
     * @type enchant.gl.Quat
     */
    rotationSet: function(quat) {
        quat.toMat4(this._rotation);
    },

    
    /**
     * 回転行列にクォータニオンから得られる回転行列を適用する.
     * @type enchant.gl.Quat
     */
    rotationApply: function(quat) {
        quat.toMat4(this.tmpMat);
        mat4.multiply(this._rotation, this.tmpMat);
    },

    /**
     * Sprite3Dに適用する変換行列.
     * @deprecated
     * @type Number[]
     */
    matrix: {
        set: function(matrix) {
            this._matrix = matrix;
        },
        get: function() {
            return this._matrix;
        }
    },

    /**
     * Sprite3Dの当たり判定に利用されるオブジェクト.
     * @type enchant.gl.Bounding | enchant.gl.BS | enchant.gl.AABB
     */
    bounding: {
        set: function(bounding) {
            this._bounding = bounding;
            this._bounding.parent = this;
        },
        get: function() {
            return this._bounding;
        }
    },

    _draw: function(scene, detectTouch, baseMatrix) {
        if (this._changedTranslation ||
            this._changedScale) {
            mat4.identity(this.modelMat);
            mat4.translate(this.modelMat, [this._x, this._y, this._z]);
            mat4.scale(this.modelMat, [this._scaleX, this._scaleY, this._scaleZ]);
            this._changedTranslation = false;
            this._changedScale = false;
        }
        mat4.multiply(this.modelMat, this._rotation, this.tmpMat)
        mat4.multiply(this.tmpMat, this._matrix, this.tmpMat);
        mat4.multiply(baseMatrix, this.tmpMat, this.tmpMat);


        if (this.childNodes.length) {
            for (var i = 0, l = this.childNodes.length; i < l; i++) {
                this.childNodes[i]._draw(scene, detectTouch, this.tmpMat);
            }
        }
        if (this.mesh.vertices) {
            gl.uniformMatrix4fv(scene.shaderUniforms.modelMat, false, this.tmpMat);
            mat4.toInverseMat3(this.tmpMat, scene.normMat);
            mat3.transpose(scene.normMat);
            gl.uniformMatrix3fv(scene.shaderUniforms.normMat, false, scene.normMat);

            gl.bindBuffer(gl.ARRAY_BUFFER, this.mesh.verticesBuffer);
            gl.vertexAttribPointer(scene.shaderAttributes.vertexPosition, 3, gl.FLOAT, false, 0, 0);

            gl.bindBuffer(gl.ARRAY_BUFFER, this.mesh.normalsBuffer);
            gl.vertexAttribPointer(scene.shaderAttributes.normal, 3, gl.FLOAT, false, 0, 0);

            gl.bindBuffer(gl.ARRAY_BUFFER, this.mesh.texCoordsBuffer);
            gl.vertexAttribPointer(scene.shaderAttributes.textureCoord, 2, gl.FLOAT, false, 0, 0);

            gl.uniform4fv(scene.shaderUniforms.detectColor, this.detectColor);

            gl.bindBuffer(gl.ARRAY_BUFFER, this.mesh.colorsBuffer);
            gl.vertexAttribPointer(scene.shaderAttributes.vertexColor, 4, gl.FLOAT, false, 0, 0);


            if (this.mesh.texture._image) {
                gl.bindTexture(gl.TEXTURE_2D, this.mesh.texture._glTexture);
                gl.uniform1f(scene.shaderUniforms.useTexture, 1.0);
            } else {
                gl.uniform1f(scene.shaderUniforms.useTexture, 0.0);
            }

            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.mesh.indicesBuffer);

            gl.uniform4fv(scene.shaderUniforms.diffuse, this.mesh.texture.diffuse);
            gl.uniform4fv(scene.shaderUniforms.specular, this.mesh.texture.specular);
            gl.uniform4fv(scene.shaderUniforms.emission, this.mesh.texture.emission);
            gl.uniform4fv(scene.shaderUniforms.ambient, this.mesh.texture.ambient);
            gl.uniform1f(scene.shaderUniforms.shininess, this.mesh.texture.shininess);

            gl.drawElements(gl.TRIANGLES, this.mesh.indices.length, gl.UNSIGNED_SHORT, 0);

            this.dispatchEvent(new enchant.Event('render'));

        } else {

        }
    }
});

/**
 * Sprite3Dのx座標.
 * @default 0
 * @type Number
 * @see enchant.gl.Sprite3D#translate
 */
enchant.gl.Sprite3D.prototype.x = 0;

/**
 * Sprite3Dのy座標.
 * @default 0
 * @type Number
 * @see enchant.gl.Sprite3D#translate
 */
enchant.gl.Sprite3D.prototype.y = 0;

/**
 * Sprite3Dのz座標.
 * @default 0
 * @type Number
 * @see enchant.gl.Sprite3D#translate
 */
enchant.gl.Sprite3D.prototype.z = 0;

'x y z'.split(' ').forEach(function(prop) {
    Object.defineProperty(enchant.gl.Sprite3D.prototype, prop, {
        get: function() {
            return this['_' + prop];
        },
        set: function(n) {
            this['_' + prop] = n;
            this._changedTranslation = true;
        }
    });
});

/**
 * Sprite3Dのx軸方向に対する拡大率
 * @default 1.0
 * @type Number
 * @see enchant.gl.Sprite3D#scale
 */
enchant.gl.Sprite3D.prototype.scaleX = 1;

/**
 * Sprite3Dのy軸方向に対する拡大率
 * @default 1.0
 * @type Number
 * @see enchant.gl.Sprite3D#scale
 */
enchant.gl.Sprite3D.prototype.scaleY = 1;
/**
 * Sprite3Dのz軸方向に対する拡大率
 * @default 1.0
 * @type Number
 * @see enchant.gl.Sprite3D#scale
 */
enchant.gl.Sprite3D.prototype.scaleZ = 1;

'scaleX scaleY scaleZ'.split(' ').forEach(function(prop) {
    Object.defineProperty(enchant.gl.Sprite3D.prototype, prop, {
        get: function() {
            return this['_' + prop];
        },
        set: function(scale) {
            this['_' + prop] = scale;
            this._changedScale = true;
        }
    });
});

/**
 * @scope enchant.gl.Camera3D.prototype
 */
enchant.gl.Camera3D = enchant.Class.create({
    /**
     * 3Dシーンのカメラを設定するクラス
     * @example
     * var scene = new Scene3D();
     * var camera = new Camera3D();
     * camera.x = 0;
     * camera.y = 0;
     * camera.z = 10;
     * scene.setCamera(camera);
     * @constructs
     */
    initialize: function() {
        this._changedPosition = false;
        this._changedCenter = false;
        this._changedUpVector = false;
        this._x = 0;
        this._y = 0;
        this._z = 0;
        this._centerX = 0;
        this._centerY = 0;
        this._centerZ =-10;
        this._upVectorX = 0;
        this._upVectorY = 1;
        this._upVectorZ = 0;
    }
});

/**
 * カメラのx座標
 * @type Number
 */
enchant.gl.Camera3D.prototype.x = 0;

/**
 * カメラのy座標
 * @type Number
 */
enchant.gl.Camera3D.prototype.y = 0;

/**
 * カメラのz座標
 * @type Number
 */
enchant.gl.Camera3D.prototype.z = 0;

'x y z'.split(' ').forEach(function(prop) {
    Object.defineProperty(enchant.gl.Camera3D.prototype, prop, {
        get: function() {
            return this['_' + prop];
        },
        set: function(n) {
            this['_' + prop] = n;
            this._changedPosition = true;
        }
    });
});

/**
 * カメラの視点のx座標
 * @type Number
 */
enchant.gl.Camera3D.prototype.centerX = 0;

/**
 * カメラの視点のy座標
 * @type Number
 */
enchant.gl.Camera3D.prototype.centerY = 0;

/**
 * カメラの視点のz座標
 * @type Number
 */
enchant.gl.Camera3D.prototype.centerZ = 0;

'centerX centerY centerZ'.split(' ').forEach(function(prop) {
    Object.defineProperty(enchant.gl.Camera3D.prototype, prop, {
        get: function() {
            return this['_' + prop];
        },
        set: function(n) {
            this['_' + prop] = n;
            this._changedCenter = true;
        }
    });
});

/**
 * カメラの上方向ベクトルのx成分
 * @type Number
 */
enchant.gl.Camera3D.prototype.upVectorX = 0;

/**
 * カメラの上方向ベクトルのy成分
 * @type Number
 */
enchant.gl.Camera3D.prototype.upVectorY = 1;

/**
 * カメラの上方向ベクトルのz成分
 * @type Number
 */
enchant.gl.Camera3D.prototype.upVectorZ = 0;

'upVectorX upVectorY upVectorZ'.split(' ').forEach(function(prop) {
    Object.defineProperty(enchant.gl.Camera3D.prototype, prop, {
        get: function() {
            return this['_' + prop];
        },
        set: function(n) {
            this['_' + prop] = n;
            this._changedUpVector = true;
        }
    });
});

/**
 * @scope enchant.gl.Scene3D.prototype
 */
enchant.gl.Scene3D = enchant.Class.create(enchant.EventTarget, {
    /**
     * 表示Sprite3Dツリーのルートになるクラス.
     * 現在, 複数定義することは出来ず, 最初に定義したScene3Dが返される.
     *
     * @example
     *   var scene = new Scene3D();
     *   var sprite = new Sprite3D();
     *   scene.addChild(sprite);
     *
     * @constructs
     * @extends enchant.EventTarget
     */
    initialize: function() {
        var game = enchant.Game.instance;
        if (game.currentScene3D) {
            return game.currentScene3D;
        }
        enchant.EventTarget.call(this);
        /**
         * 子要素の配列.
         * このシーンに子として追加されているSprite3Dの一覧を取得できる.
         * 子を追加したり削除したりする場合には, この配列を直接操作せずに,
         * {@link enchant.gl.Scene3D#addChild}や{@link enchant.gl.Scene3D#removeChild}を利用する.
         * @type enchant.gl.Sprite3D[]
         */
        this.childNodes = [];

        /**
         * 照明の配列.
         * 現在, シーンに適用される光源は0番目のみ.
         * このシーンに追加されている光源の一覧を取得する.
         * 照明を追加したり削除したりする場合には, この配列を直接操作せずに,
         * {@link enchant.gl.Scene3D#addLight}や{@link enchant.gl.Scene3D#removeLight}を利用する.
         * @type enchant.gl.PointLight[]
         */
        this.lights = [];

        this.projMat = mat4.create();
        this.modelMat = mat4.create();
        this.normMat = mat3.create();
        this.cameraMat = mat4.create();
        this.cameraMatInverse = mat4.create();
        this.cameraMatInverseY = mat4.create();
        this._backgroundColor = [0.0, 0.0, 0.0, 1.0];

        this.shaderAttributes = [];
        this.shaderUniforms = [];

        var listener = function(e) {
            for (var i = 0, len = this.childNodes.length; i < len; i++) {
                var sprite = this.childNodes[i];
                sprite.dispatchEvent(e);
            }
        };
        this.addEventListener('added', listener);
        this.addEventListener('removed', listener);
        this.addEventListener('addedtoscene', listener);
        this.addEventListener('removedfromscene', listener);

        var that = this;
        var func = function() {
            that._draw();
        };
        game.addEventListener('enterframe', func);

        this.vertexShader = gl.createShader(gl.VERTEX_SHADER);
        this.fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
        this.shaderProgram = gl.createProgram();

        // タッチ検出用のフレームバッファ
        this.detectFramebuffer = gl.createFramebuffer();
        this.detectColorbuffer = gl.createRenderbuffer();
        this.detectDepthbuffer = gl.createRenderbuffer();

        gl.bindFramebuffer(gl.FRAMEBUFFER, this.detectFramebuffer);

        gl.bindRenderbuffer(gl.RENDERBUFFER, this.detectColorbuffer);
        gl.renderbufferStorage(gl.RENDERBUFFER, gl.RGBA4, game.width, game.height);
        gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.RENDERBUFFER, this.detectColorbuffer);

        gl.bindRenderbuffer(gl.RENDERBUFFER, this.detectDepthbuffer);
        gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, game.width, game.height);
        gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, this.detectDepthbuffer);

        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.bindRenderbuffer(gl.RENDERBUFFER, null);


        gl.shaderSource(this.vertexShader, vshader);
        gl.compileShader(this.vertexShader);
        gl.shaderSource(this.fragmentShader, fshader);
        gl.compileShader(this.fragmentShader);

        gl.attachShader(this.shaderProgram, this.vertexShader);
        gl.attachShader(this.shaderProgram, this.fragmentShader);
        gl.linkProgram(this.shaderProgram);
        if (!gl.getProgramParameter(this.shaderProgram, gl.LINK_STATUS)) {
            console.log(gl.getProgramParameter(this.shaderProgram, gl.LINK_STATUS));
            alert("could not initialized Shader");
            console.log(gl.getShaderInfoLog(this.vertexShader));
            console.log(gl.getShaderInfoLog(this.fragmentShader));
        }
        gl.useProgram(this.shaderProgram);
        this.shaderAttributes.vertexPosition = gl.getAttribLocation(this.shaderProgram, 'aVertexPosition');
        gl.enableVertexAttribArray(this.shaderAttributes.vertexPosition);
        this.shaderAttributes.vertexColor = gl.getAttribLocation(this.shaderProgram, 'aVertexColor');
        gl.enableVertexAttribArray(this.shaderAttributes.vertexColor);
        this.shaderAttributes.textureCoord = gl.getAttribLocation(this.shaderProgram, 'aTextureCoord');
        gl.enableVertexAttribArray(this.shaderAttributes.textureCoord);
        this.shaderAttributes.normal = gl.getAttribLocation(this.shaderProgram, 'aNormal');
        gl.enableVertexAttribArray(this.shaderAttributes.normal);

        this.shaderUniforms.modelMat = gl.getUniformLocation(this.shaderProgram, 'uModelMat');
        this.shaderUniforms.normMat = gl.getUniformLocation(this.shaderProgram, 'uNormMat');
        this.shaderUniforms.rotMat = gl.getUniformLocation(this.shaderProgram, 'uRotMat');
        this.shaderUniforms.projMat = gl.getUniformLocation(this.shaderProgram, 'uProjMat');
        this.shaderUniforms.cameraMat = gl.getUniformLocation(this.shaderProgram, 'uCameraMat');
        this.shaderUniforms.useCamera = gl.getUniformLocation(this.shaderProgram, 'uUseCamera');
        this.shaderUniforms.useTexture = gl.getUniformLocation(this.shaderProgram, 'uUseTexture');
        this.shaderUniforms.useDirectionalLight = gl.getUniformLocation(this.shaderProgram, 'uUseDirectionalLihgt');
        this.shaderUniforms.lightColor = gl.getUniformLocation(this.shaderProgram, 'uLightColor');
        this.shaderUniforms.lightDirection = gl.getUniformLocation(this.shaderProgram, 'uLightDirection');
        this.shaderUniforms.detectTouch = gl.getUniformLocation(this.shaderProgram, 'uDetectTouch');
        this.shaderUniforms.detectColor = gl.getUniformLocation(this.shaderProgram, 'uDetectColor');
        this.shaderUniforms.sampler = gl.getUniformLocation(this.shaderProgram, 'uSampler');
        this.shaderUniforms.lookVec = gl.getUniformLocation(this.shaderProgram, 'uLookVec');
        this.shaderUniforms.diffuse = gl.getUniformLocation(this.shaderProgram, 'uDiffuse');
        this.shaderUniforms.specular = gl.getUniformLocation(this.shaderProgram, 'uSpecular');
        this.shaderUniforms.emission = gl.getUniformLocation(this.shaderProgram, 'uEmission');
        this.shaderUniforms.ambient = gl.getUniformLocation(this.shaderProgram, 'uAmbient');
        this.shaderUniforms.shininess = gl.getUniformLocation(this.shaderProgram, 'uShininess');

        mat4.perspective(20, game.width / game.height, 1.0, 1000.0, this.projMat);
        gl.uniform1i(this.shaderUniforms.sampler, 0);
        gl.uniformMatrix4fv(this.shaderUniforms.projMat, false, this.projMat);
        gl.uniform1f(this.shaderUniforms.useCamera, 0.0);
        gl.uniform1f(this.shaderUniforms.useDirectionalLight, 0.0);
        gl.activeTexture(gl.TEXTURE0);

        if (game.currentScene3D == null) {
            game.currentScene3D = this;
        }
    },

    /**
     * Scene3Dの背景色
     * @type Number[]
     */
    backgroundColor: {
        get: function() {
            return this._backgroundColor;
        },
        set: function(arg) {
            a = parseColor(arg);
            this._backgroundColor = a;
            gl.clearColor(a[0], a[1], a[2], a[3]);

        }
    },

    /**
     * シーンにSprite3Dを追加する.
     * 引数に渡されたSprite3Dと, その子を全てシーンに追加する.
     * シーンに追加されると自動的にSprite3Dは画面上に表示される.
     * 一度追加したオブジェクトを削除するには{@link enchant.gl.Scene3D#removeChild}を利用する.
     * @param {enchant.gl.Sprite3D} sprite 追加するSprite3D
     * @see enchant.gl.Scene3D#removeChild
     * @see enchant.gl.Scene3D#childNodes
     */
    addChild: function(sprite) {
        this.childNodes.push(sprite);
        sprite.parentNode = sprite.scene = this;
        sprite.dispatchEvent(new enchant.Event('added'));
        sprite.dispatchEvent(new enchant.Event('addedtoscene'));
        sprite.dispatchEvent(new enchant.Event('render'));
    },

    /**
     * シーンからSprite3Dを削除する.
     * シーンから指定されたSprite3Dを削除する.
     * 削除されたSprite3Dは画面上に表示されなくなる.
     * Sprite3Dを追加するには{@link enchant.gl.Scene3D#addChild}を利用する.
     * @param {enchant.gl.Sprite3D} sprite 削除するSprite3D
     * @see enchant.gl.Scene3D#addChild
     * @see enchant.gl.Scene3D#childNodes
     */
    removeChild: function(sprite) {
        var i;
        if ((i = this.childNodes.indexOf(sprite)) != -1) {
            this.childNodes.splice(i, 1);
        }
        sprite.parentNode = sprite.scene = null;
        sprite.dispatchEvent(new enchant.Event('removed'));
        sprite.dispatchEvent(new enchant.Event('removedfromscene'));
    },

    /**
     * シーンのカメラ位置をセットする.
     * @param {enchant.gl.Camera3D} camera セットするカメラ
     * @see enchant.gl.Camera3D
     */
    setCamera: function(camera) {
        camera._changedPosition = true;
        camera._changedCenter = true;
        camera._changedUpVector = true;
        this._camera = camera;
        gl.uniform1f(this.shaderUniforms.useCamera, 1.0);
    },   

    /**
     * シーンに平行光源を設定する.
     * @param {enchant.gl.DirectionalLight} light 設定する照明
     * @see enchant.gl.DirectionalLight
     */
    setDirectionalLight: function(light) {
        this.directionalLight = light;
        this.useDirectionalLight = true;
        gl.uniform1f(this.shaderUniforms.useDirectionalLight, 1.0);
    },

    /**
     * シーンに照明を追加する.
     * 現在, シーンに追加しても適用されない.
     * @param {enchant.gl.PointLight} light 追加する照明
     * @see enchant.gl.PointLight
     */
    addLight: function(light){
        this.lights.push(light);
        this.usePointLight = true;
    },   

    /**
     * シーンから照明を削除する
     * @param {enchant.gl.PointLight} light 削除する照明
     * @see enchant.gl.PointLight.
     */
    removeLight: function(light){
        var i;
        if ((i = this.lights.indexOf(light)) != -1) {
            this.lights.splice(i, 1);
        }    
    },

    _draw: function(detectTouch) {
        var game = enchant.Game.instance;
        gl.viewport(0, 0, game.width, game.height);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        if (detectTouch == 'detect') {
            gl.uniform1f(this.shaderUniforms.detectTouch, 1.0);
        } else {
            gl.uniform1f(this.shaderUniforms.detectTouch, 0.0);
        }

        if (this.useDirectionalLight) {
            if (this.directionalLight._changedDirection) {
                gl.uniform3fv(this.shaderUniforms.lightDirection,
                    [this.directionalLight.directionX,
                     this.directionalLight.directionY,
                     this.directionalLight.directionZ]);
                this.directionalLight._changedDirection = false;
            } if (this.directionalLight._changedColor) {
                gl.uniform3fv(this.shaderUniforms.lightColor, this.directionalLight.color);
                this.directionalLight._changedColor = false;
            }
        }

        if (this._camera) {
            if (this._camera._changedPosition ||
                this._camera._changedCenter ||
                this._camera._changedUpVector) {
                mat4.lookAt(
                    [this._camera._x, this._camera._y, this._camera._z], 
                    [this._camera._centerX, this._camera._centerY, this._camera._centerZ],
                    [this._camera._upVectorX, this._camera._upVectorY, this._camera._upVectorZ], 
                    this.cameraMat);
                mat4.lookAt(
                    [0, 0, 0], 
                    [-this._camera._x + this._camera._centerX,
                    -this._camera._y + this._camera._centerY,
                    -this._camera._z + this._camera._centerZ],
                    [this._camera._upVectorX, this._camera._upVectorY, this._camera._upVectorZ], 
                    this.cameraMatInverse);
                mat4.inverse(this.cameraMatInverse);
                mat4.lookAt(
                    [0, 0, 0], 
                    [-this._camera._x + this._camera._centerX,
                    0,
                    -this._camera._z + this._camera._centerZ],
                    [this._camera._upVectorX, this._camera._upVectorY, this._camera._upVectorZ], 
                    this.cameraMatInverseY);
                mat4.inverse(this.cameraMatInverseY);
                gl.uniformMatrix4fv(this.shaderUniforms.cameraMat, false, this.cameraMat);
                gl.uniform3fv(this.shaderUniforms.lookVec, [this._camera._centerX - this._camera._x,
                                                            this._camera._centerY - this._camera._y,
                                                            this._camera._centerZ - this._camera._z]);
            }
        }
		var identityMatrix = mat4.create();
		mat4.identity(identityMatrix);
        for (var i = 0, l = this.childNodes.length; i < l; i++) {
            this.childNodes[i]._draw(this, detectTouch, identityMatrix);
        }

    }
});


var vshader = '\n\
attribute vec3 aVertexPosition;\n\
attribute vec4 aVertexColor;\n\
\n\
attribute vec3 aNormal;\n\
attribute vec2 aTextureCoord;\n\
\n\
uniform mat4 uModelMat;\n\
uniform mat4 uRotMat;\n\
uniform mat4 uCameraMat;\n\
uniform mat4 uProjMat;\n\
uniform mat3 uNormMat;\n\
uniform float uUseCamera;\n\
\n\
varying vec2 vTextureCoord;\n\
varying vec4 vColor;\n\
varying vec3 vNormal;\n\
\n\
void main() {\n\
    vec4 p = uModelMat * vec4(aVertexPosition, 1.0);\n\
    gl_Position = uProjMat * (uCameraMat * uUseCamera) * p + uProjMat * p * (1.0 - uUseCamera);\n\
    vTextureCoord = aTextureCoord;\n\
    vColor = aVertexColor;\n\
    vNormal = uNormMat * aNormal;\n\
}';

var fshader = '\n\
precision highp float;\n\
\n\
uniform sampler2D uSampler;\n\
uniform vec3 uLightColor;\n\
uniform vec3 uLookVec;\n\
uniform vec4 uAmbient;\n\
uniform vec4 uDiffuse;\n\
uniform vec4 uSpecular;\n\
uniform vec4 uEmission;\n\
uniform vec4 uDetectColor;\n\
uniform float uDetectTouch;\n\
uniform float uUseTexture;\n\
uniform float uUseLighting;\n\
uniform float uShininess;\n\
uniform vec3 uLightDirection;\n\
\n\
varying vec2 vTextureCoord;\n\
varying vec4 vColor;\n\
varying vec3 vNormal;\n\
\n\
\n\
void main() {\n\
    vec4 texColor = texture2D(uSampler, vTextureCoord);\n\
    vec4 baseColor = vColor ;\n\
    baseColor *= texColor * uUseTexture + vec4(1.0, 1.0, 1.0, 1.0) * (1.0 - uUseTexture);\n\
    if (baseColor.a < 0.2) {\n\
        discard;\n\
    }\n\
    else {\n\
        vec4 phongColor = uAmbient;\n\
        vec3 N = normalize(vNormal);\n\
        vec3 L = normalize(uLightDirection);\n\
        vec3 E = normalize(uLookVec);\n\
        vec3 R = reflect(-L, N);\n\
        float lamber = max(dot(N, L) , 0.0);\n\
        phongColor += uDiffuse * lamber;\n\
        float s = max(dot(R,-E), 0.0);\n\
        vec4 specularColor= uSpecular * pow(s, uShininess) * sign(lamber);\n\
        gl_FragColor = (uEmission * baseColor + specularColor + vec4(baseColor.rgb * phongColor.rgb * uLightColor.rgb, baseColor.a)) \
            * (1.0 - uDetectTouch) + uDetectColor * uDetectTouch;\n\
    }\n\
}';

