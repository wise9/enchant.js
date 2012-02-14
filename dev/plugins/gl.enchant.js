/*
[lang:ja]
 * gl.enchant.js
 * @version 0.3.2
 * @require enchant.js v0.4.3+
 * @author Ubiquitous Entertainment Inc.
 *
 * @description
 * WebGLを用いた描画ライブラリ
 * enchant.js と組み合わせることで高度な3D描画と、2D描画を組み合わせることができる
 *
 * @detail
 * ベクトル・行列演算にglMatrix.jsを使用しています.
 * glMatrix.js:
 * http://code.google.com/p/glmatrix/
 * glMatrix.jsの詳しい使い方:
 * http://code.google.com/p/glmatrix/wiki/Usage
 *
[/lang]
[lang:en]
 * gl.enchant.js
 * @version 0.3.1
 * @require enchant.js v0.4.3+
 * @author Ubiquitous Entertainment Inc.
 *
 * @description
 * Drawing library using WebGL
 * By combining with enchant.js, high quality 3D drawing and combination with 2D drawing is possible
 *
 * @detail
 * Uses glMatrix.js in hector, matrix operation.
 * glMatrix.js:
 * http://code.google.com/p/glmatrix/
 * More on how to use glMatrix:
 * http://code.google.com/p/glmatrix/wiki/Usage
 *
[/lang]
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
[lang:ja]
 * enchantにgl.enchant.jsのクラスをエクスポートする.
[/lang]
[lang:en]
 * Exports gl.enchant.js class to enchant.
[/lang]
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
    [lang:ja]
     * @scope enchant.gl.collision.Bounding.prototype
    [/lang]
    [lang:en]
     * @scope enchant.gl.collision.Bounding.prototype
    [/lang]
     */
    enchant.gl.collision.Bounding = enchant.Class.create({
        /**
        [lang:ja]
         * Sprite3Dの衝突判定を設定するクラス.
         * 点として定義されている.
         * enchant.gl.collision.Boundingを継承したクラスとして, 
         * {@link enchant.gl.collision.BS}, {@link enchant.gl.collision.AABB},
         * {@link enchant.gl.collision.OBB}, がある.
         * 現在, OBBはサポートされていない.
         * @constructs
        [/lang]
        [lang:en]
         * Class to set Sprite3D collision detection.
         * Defined as a point.
         * {@link enchant.gl.collision.BS}, {@link enchant.gl.collision.AABB},
		 * {@link enchant.gl.collision.OBB} exist as
		 * inherited classes of enchant.gl.collision.Bounding
         * Currently, OBB is not supported.
         * @constructs
        [/lang]
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
        [lang:ja]
         * 点との距離を計算する.
         * @param {enchant.gl.collision.Bounding} bounding 衝突点オブジェクト
         * @return {Number}
        [/lang]
        [lang:en]
         * Calculates distance between points.
         * @param {enchant.gl.collision.Bounding} bounding Collision point object
         * @return {Number}
        [/lang]
         */
        toBounding: function(another) {
            return point2point(this, another);
        },
        /**
        [lang:ja]
         * 球との距離を計算する.
         * @param {enchant.gl.collision.BS} boudning 衝突球オブジェクト
         * @return {Number}
        [/lang]
        [lang:en]
         * Calculates distance between balls.
         * @param {enchant.gl.collision.BS} boudning Collision ball object
         * @return {Number}
        [/lang]
         */
        toBS: function(another) {
            return point2BS(this, another);
        },
        /**
        [lang:ja]
         * 回転しない立方体との距離を計算する.
         * 現在, 衝突していなければ1, 衝突していれば0が返される.
         * @param {enchant.gl.collision.AABB} bounding AABB
         * @return {Number}
        [/lang]
        [lang:en]
         * Calculates distance from non-rotating cube.
         *Currently, 0 will be returned with or without collision.
         * @param {enchant.gl.collision.AABB} bounding AABB
         * @return {Number}
        [/lang]
         */
        toAABB: function(another) {
            return point2AABB(this, another);
        },
        /**
        [lang:ja]
         * 回転する直方体との距離を計算する.
         * 現在, サポートされていない.
         * @param {enchant.gl.collision.OBB} bounding OBB
         * @return {Number}
        [/lang]
        [lang:en]
         * Calculates distance from rotating cuboid.
         * Not currently supported.
         * @param {enchant.gl.collision.OBB} bounding OBB
         * @return {Number}
        [/lang]
         */
        toOBB: function(another) {
            return point2OBB(this, another);
        },
        /**
        [lang:ja]
         * 他の衝突判定オブジェクトとの衝突判定.
         * 衝突判定オブジェクトか, x, y, zプロパティを持っているオブジェクトとの衝突を判定することができる.
         * @param {enchant.gl.collision.Bounding|enchant.gl.collision.BS|enchant.gl.collision.AABB|enchant.gl.collision.OBB} bounding 衝突判定オブジェクト
         * @return {Boolean}
        [/lang]
        [lang:en]
         * Collision detection with other collision detection object.
         * A collision detection object can detect collision with an object with x, y, z properties.
         * @param {enchant.gl.collision.Bounding|enchant.gl.collision.BS|enchant.gl.collision.AABB|enchant.gl.collision.OBB} bounding Collision detection object
         * @return {Boolean}
        [/lang]
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
    [lang:ja]
     * @scope enchant.gl.collision.BS.prototype
    [/lang]
    [lang:en]
     * @scope enchant.gl.collision.BS.prototype
    [/lang]
     */
    enchant.gl.collision.BS = enchant.Class.create(enchant.gl.collision.Bounding, {
        /**
        [lang:ja]
         * Sprite3Dの衝突判定を設定するクラス.
         * 球として定義されている.
         * @constructs
         * @see enchant.gl.collision.Bounding
        [/lang]
        [lang:en]
         * Class that sets Sprite3D collision detection.
         * Defined as a ball.
         * @constructs
         * @see enchant.gl.collision.Bounding
        [/lang]
         */
        initialize: function() {
            enchant.gl.collision.Bounding.call(this);
            this.type = 'BS';
            this.radius = 0.5;
        },
        toBounding: function(another) {
            return point2BS(another, this);
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
    [lang:ja]
     * @scope enchant.gl.collision.AABB.prototype
    [/lang]
    [lang:en]
     * @scope enchant.gl.collision.AABB.prototype
    [/lang]
     */
    enchant.gl.collision.AABB = enchant.Class.create(enchant.gl.collision.Bounding, {
        /**
        [lang:ja]
         * Sprite3Dの衝突判定を設定するクラス.
         * 回転しない立方体として定義されている.
         * @constructs
         * @see enchant.gl.collision.Bounding
        [/lang]
        [lang:en]
         * Class that sets Sprite3D collision detection.
         * Defined as non-rotating cube.
         * @constructs
         * @see enchant.gl.collision.Bounding
        [/lang]
         */
        initialize: function() {
            enchant.gl.collision.Bounding.call(this);
            this.type = 'AABB';
            this.scale = 0.5;
        },
        toBounding: function(another) {
            return point2AABB(another, this);
        },
        toBS: function(another) {
            return BS2AABB(another, this);
        },
        toAABB: function(another) {
            return AABB2AABB(this, another);
        },
        toOBB: function(another) {
            return AABB2OBB(this, another);
        }
    });

    /**
    [lang:ja]
     * @scope enchant.gl.collision.OBB.prototype
    [/lang]
    [lang:en]
     * @scope enchant.gl.collision.OBB.prototype
    [/lang]
     */
    enchant.gl.collision.OBB = enchant.Class.create(enchant.gl.collision.Bounding, {
        /**
        [lang:ja]
         * Sprite3Dの衝突判定を設定するクラス.
         * 回転するとして定義されている.
         * @constructs
         * @see enchant.gl.collision.Bounding
        [/lang]
        [lang:en]
         * Class that sets Sprite3D collision detection.
         * Defined as rotating.
         * @constructs
         * @see enchant.gl.collision.Bounding
        [/lang]
         */
        initialize: function() {
            enchant.gl.collision.Bounding.call(this);
            this.type = 'OBB';
        },
        toBounding: function(another) {
            return point2OBB(another, this);
        },
        toBS: function(another) {
            return BS2OBB(another, this);
        },
        toAABB: function(another) {
            return AABB2OBB(another, this);
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
            gl = createDebugContext(canvas.getContext('experimental-webgl'));
            //gl = canvas.getContext('experimental-webgl');
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
[lang:ja]
 * @scope enchant.gl.Quat.prototype
[/lang]
[lang:en]
 * @scope enchant.gl.Quat.prototype
[/lang]
 */
enchant.gl.Quat = enchant.Class.create({
    /**
    [lang:ja]
     * クォータニオンを簡単に使用するクラス.
     * @param {Number} x
     * @param {Number} y
     * @param {Number} z
     * @param {Number} rad
     * @constructs
    [/lang]
    [lang:en]
     * Class that easily uses quaternions.
     * @param {Number} x
     * @param {Number} y
     * @param {Number} z
     * @param {Number} rad
     * @constructs
    [/lang]
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
    [lang:ja]
     * クォータニオン同士で球面線形補間を行う.
     * 自身ともう一つのクォータニオンの間の回転移動を補完したクォータニオンを計算する.
     * 回転の度合いは0から1の値で表される. 0が自身側, 1がもう一つ側.
     * 新しいインスタンスが返される.
     * @param {enchant.gl.Quat} Quaternion
     * @param {Number} ratio
     * @return {enchant.gl.Quat}
    [/lang]
    [lang:en]
     * Performs spherical linear interpolation between quarternions.
     * Calculates quarternion that supplements rotation between this quarternion and another.
     * Degree of rotation will be expressed in levels from 0 to 1. 0 is the side of this quarternion, 1 is the side of its counterpart.
     * New instance will be returned.
     * @param {enchant.gl.Quat} Quaternion
     * @param {Number} ratio
     * @return {enchant.gl.Quat}
    [/lang]
     */
    slerp: function(another, ratio) {
        var q = new Quat(0, 0, 0, 0);
        quat4.slerp(this._quat, another._quat, ratio, q);
        return q;
    },
    /**
    [lang:ja]
     * クォータニオン同士で球面線形補間を行う.
     * 自身ともう一つのクォータニオンの間の回転移動を補完したクォータニオンを計算する.
     * 回転の度合いは0から1の値で表される. 0が自身側, 1がもう一つ側.
     * 自身の値が上書きされる.
     * @param {enchant.gl.Quat} Quaternion
     * @param {Number} ratio
     * @return {enchant.gl.Quat}
    [/lang]
    [lang:en]
     * Performs spherical linear interpolation between quarternions.
     * Calculates quarternion that supplements rotation between this quarternion and another.
     * Degree of rotation will be expressed in levels from 0 to 1. 0 is the side of this quarternion, 1 is the side of its counterpart.
     * This side's value will be overwritten.
     * @param {enchant.gl.Quat} Quaternion
     * @param {Number} ratio
     * @return {enchant.gl.Quat}
    [/lang]
     */
    slerpApply: function(another, ratio) {
        quat4.slerp(this._quat, another._quat, ratio);
        return this;
    },
    /**
    [lang:ja]
     * クォータニオンを回転行列に変換する.
     * @param {Number[]} matrix
     * @return {Number[]}
    [/lang]
    [lang:en]
     * Convert quarternion to rotation matrix.
     * @param {Number[]} matrix
     * @return {Number[]}
    [/lang]
     */
    toMat4: function(matrix) {
        quat4.toMat4(this._quat, matrix);
        return matrix;
    },
    /**
    [lang:ja]
     * クォータニオンをベクトルに適用する.
     * @param {Number[]} vector
     * @return {Number[]}
    [/lang]
    [lang:en]
     * Apply quarternion to vector.
     * @param {Number[]} vector 
     * @return {Number[]}
    [/lang]
     */
    multiplyVec3: function(vector) {
        quat4.multiplyVec3(this._quat, vector);
        return vector;
    }
});

/**
[lang:ja]
 * @scope enchant.gl.Light3D.prototype
[/lang]
[lang:en]
 * @scope enchant.gl.Light3D.prototype
[/lang]
 */
enchant.gl.Light3D = enchant.Class.create(enchant.EventTarget, {
    /**
    [lang:ja]
         * 光源クラスの親となるクラス.
     *
     * @constructs
     * @extends enchant.EventTarget
    [/lang]
    [lang:en]
     * Light source class parent class.
     *
     * @constructs
     * @extends enchant.EventTarget
    [/lang]
     */
    initialize: function() {
        this._changedColor = true;
        this._color = [0.8, 0.8, 0.8];
    },

    /**
    [lang:ja]
     * 光源の光の色
     * @type Number[]
    [/lang]
    [lang:en]
     * Light source light color
     * @type Number[]
    [/lang]
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
[lang:ja]
 * @scope enchant.gl.DirectionalLight.prototype
[/lang]
[lang:en]
 * @scope enchant.gl.DirectionalLight.prototype
[/lang]
 */
enchant.gl.DirectionalLight = enchant.Class.create(enchant.gl.Light3D, {
    /**
    [lang:ja]
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
    [/lang]
    [lang:en]
     * Class for setting light source in 3D scene.
     * Directioned light source without position.
     * @example
     *   var scene = new Scene3D();
     *   var light = new DirectionalLight();
     *   light.color = [1.0, 1.0, 0.0];
     *   light.directionY = 10;
     *   scene.setDirectionalLight(light);
     *
     * @constructs
     * @extends enchant.gl.Light3D
    [/lang]
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
[lang:ja]
 * 光源の照射方向のx成分
 * @type Number
[/lang]
[lang:en]
 * Light source exposure direction x component
 * @type Number
[/lang]
 */
enchant.gl.DirectionalLight.prototype.directionX = 0.5;

/**
[lang:ja]
 * 光源の照射方向のy成分
 * @type Number
[/lang]
[lang:en]
 * Light source exposure direction y component
 * @type Number
[/lang]
 */
enchant.gl.DirectionalLight.prototype.directionY = 0.5;

/**
[lang:ja]
 * 光源の照射方向のz成分
 * @type Number
[/lang]
[lang:en]
 * Light source exposure direction z component
 * @type Number
[/lang]
 */
enchant.gl.DirectionalLight.prototype.directionZ = 1.0;

/**
[lang:ja]
 * 光源の照射方向
 * @type {Number}
[/lang]
[lang:en]
 * Light source exposure direction
 * @type {Number}
[/lang]
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
[lang:ja]
 * @scope enchant.gl.PointLight.prototype
[/lang]
[lang:en]
 * @scope enchant.gl.PointLight.prototype
[/lang]
 */
enchant.gl.PointLight = enchant.Class.create(enchant.gl.Light3D, {
    /**
    [lang:ja]
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
    [/lang]
    [lang:en]
     * Class that sets 3D scene light source.
     * Directionless positional light source.
     * At present, will not be applied even if added to scene.
     * @example
     *   var scene = new Scene3D();
     *   var light = new PointLight();
     *   light.color = [1.0, 1.0, 0.0];
     *   light.y = 10;
     *   scene.addLight(light);
     *
     * @constructs
     * @extends enchant.gl.Light3D
    [/lang]
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
[lang:ja]
 * 光源のx座標
 * @type Number
[/lang]
[lang:en]
 * Light source x axis
 * @type Number
[/lang]
 */
enchant.gl.PointLight.prototype.x = 0;

/**
[lang:ja]
 * 光源のy座標
 * @type Number
[/lang]
[lang:en]
 * Light source y axis
 * @type Number
[/lang]
 */
enchant.gl.PointLight.prototype.y = 0;

/**
[lang:ja]
 * 光源のz座標
 * @type Number
[/lang]
[lang:en]
 * Light source z axis
 * @type Number
[/lang]
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
[lang:ja]
 * @scope enchant.gl.Texture.prototype
[/lang]
[lang:en]
 * @scope enchant.gl.Texture.prototype
[/lang]
 */
enchant.gl.Texture = enchant.Class.create({
    /**
    [lang:ja]
     * テクスチャ情報を格納するクラス.
     * @example
     *   var sprite = new Sprite3D();
     *   var texture = new Texture();
     *   texture.src = "http://example.com/texture.png";
     *   // 以下のようにも宣言できる.
     *   // var texture = new Texture("http://example.com/texture.png");
     *   sprite.texture = texture;
     * @constructs
    [/lang]
    [lang:en]
     * Class to store Sprite3D texture information.
     * @example
     *   var sprite = new Sprite3D();
     *   var texture = new Texture();
     *   texture.src = "http://example.com/texture.png";
     *   // Can also be declared as below.
     *   // var texture = new Texture("http://example.com/texture.png");
     *   sprite.texture = texture;
     * @constructs
    [/lang]
     */
    initialize: function(src) {
        /**
        [lang:ja]
         * 環境光のパラメータ
         * @type Number[]
        [/lang]
        [lang:en]
         * Ambient light parameter
         * @type Number[]
        [/lang]
         */
        this.ambient = [ 0.1, 0.1, 0.1, 1.0 ];

        /**
        [lang:ja]
         * 拡散光のパラメータ
         * @type Number[]
        [/lang]
        [lang:en]
         * Light scattering parameter
         * @type Number[]
        [/lang]
         */
        this.diffuse = [ 1.0, 1.0, 1.0, 1.0];

        /**
        [lang:ja]
         * 光の反射量
         * @type Number[]
        [/lang]
        [lang:en]
         * Amount of light reflection
         * @type Number[]
        [/lang]
         */
        this.specular = [ 1.0, 1.0, 1.0, 1.0 ];

        /**
        [lang:ja]
         * 光の発光量
         * @type Number[]
        [/lang]
        [lang:en]
         * Amount of luminescence
         * @type Number[]
        [/lang]
         */
        this.emission = [ 0.0, 0.0, 0.0, 1.0 ];

        /**
        [lang:ja]
         * 鏡面計数
         * @type Number
        [/lang]
        [lang:en]
         * Specular figures
         * @type Number
        [/lang]
         */
        this.shininess =20;

        this._glTexture = null;
        this._image = null;
        if (src) {
            this.src = src;
        }
    },

    /**
    [lang:ja]
     * テクスチャ画像のソース.
     * URLかgame.assets内のデータを指定できる.
     * @type String
     * @type enchant.Surface
    [/lang]
    [lang:en]
     * Texture image source.
     * You can set URL or game.assets data.
     * @type String
     * @type enchant.Surface
    [/lang]
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
[lang:ja]
 * @scope enchant.gl.Mesh.prototype
[/lang]
[lang:en]
 * @scope enchant.gl.Mesh.prototype
[/lang]
 */
enchant.gl.Mesh = enchant.Class.create({
    /**
    [lang:ja]
     * 頂点配列やテクスチャを格納するクラス.
     * スプライトのプロパティとして使用される.
     * @constructs
    [/lang]
    [lang:en]
     * Class to store peak arrays and textures.
     * Used as a sprite property.
     * @constructs
    [/lang]
     */
    initialize: function() {
        this.__count = 0;
        this._appear = false;

        this.vertices = [];
        this.normals = [];
        this.colors = [];
        this.texCoords = [];
        this.indices = [];

        this.texture = new Texture();
    },

    _createBuffer: function() {
        this.verticesBuffer = gl.createBuffer();
        this.normalsBuffer = gl.createBuffer();
        this.colorsBuffer = gl.createBuffer();
        this.texCoordsBuffer = gl.createBuffer();
        this.indicesBuffer = gl.createBuffer();
        this._bufferData(this.verticesBuffer, this._vertices, gl.ARRAY_BUFFER, gl.STATIC_DRAW, Float32Array);
        this._bufferData(this.normalsBuffer, this._normals, gl.ARRAY_BUFFER, gl.STATIC_DRAW, Float32Array);
        this._bufferData(this.colorsBuffer, this._colors, gl.ARRAY_BUFFER, gl.STATIC_DRAW, Float32Array);
        this._bufferData(this.texCoordsBuffer, this._texCoords, gl.ARRAY_BUFFER, gl.STATIC_DRAW, Float32Array);
        this._bufferData(this.indicesBuffer, this._indices, gl.ELEMENT_ARRAY_BUFFER, gl.STATIC_DRAW, Uint16Array);
        console.log('create');
    },

    _deleteBuffer: function() {
        gl.deleteBuffer(this.verticesBuffer);
        gl.deleteBuffer(this.normalsBuffer);
        gl.deleteBuffer(this.colorsBuffer);
        gl.deleteBuffer(this.texCoordsBuffer);
        gl.deleteBuffer(this.indicesBuffer);
        console.log('delete');
    },

    _bufferData: function(buffer, array, target, usage, type) {
        if (this._appear) {
            gl.bindBuffer(target, buffer);
            gl.bufferData(target, new type(array), usage);
        }
    },

    _controlBuffer: function() {
        if (this._appear) {
            if (this.__count <= 0) {
                this._appear = false;
                this._deleteBuffer();
            }
        } else {
            if (this.__count > 0) {
                this._appear = true;
                this._createBuffer();
            }
        }
    },
    
    _count: {
        get: function() {
            return this.__count;
        },
        set: function(c) {
            this.__count = c;
            this._controlBuffer();
        }
    },

    /**
    [lang:ja]
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
    [/lang]
    [lang:en]
     * Change Mesh color.
     * Becomes peak array for Mesh.colors set color.
     * @param {Number[]|String} z Amount of parallel displacement on z axis
     * @example
     *   var sprite = new Sprite3D();
     *   //Sets to purple. All yield the same result.
     *   sprite.mesh.setBaseColor([1.0, 0.0, 1.0, 0.0]);
     *   sprite.mesh.setBaseColor('#ff00ff');
     *   sprite.mesh.setBaseColor('rgb(255, 0, 255');
     *   sprite.mesh.setBaseColor('rgba(255, 0, 255, 1.0');
    [/lang]
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
    [lang:ja]
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
    [/lang]
    [lang:en]
     * Mesh peak array.
     * Sets 3 elements together at peak. The complete number of elements becomes 3n corresponding to the quantity of the peak.
     * The 3n, 3n+1, and 3n+2 elements become, respectively, the n peak x, y, and z coordinates.
     * @example
     *   var sprite = new Sprite3D();
     *   //Substitute peak array
     *   //Data is stored in an order of x, y, z, x, y, z...
     *   sprite.mesh.vertices = [
     *       0.0, 0.0, 0.0,  //0 peak (0.0, 0.0, 0.0)
     *       1.0, 0.0, 0.0,  //1 peak (1.0, 0.0, 0.0)
     *       1.0, 1.0, 0.0,  //2 peak (1.0, 1.0, 0.0)
     *       0.0, 1.0, 0.0   //3 peak (0.0, 1.0, 0.0)
     *   ];
     * @type Number[]
     * @see enchant.gl.Mesh#indices
     * @see enchant.gl.Mesh#normals
     * @see enchant.gl.Mesh#texCoords
    [/lang]
     */
    vertices: {
        set: function(array) {
            this._vertices = array;
            this._bufferData(this.verticesBuffer, this._vertices, gl.ARRAY_BUFFER, gl.STATIC_DRAW, Float32Array);
        },
        get: function() {
            return this._vertices;
        }
    },

    /**
    [lang:ja]
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
    [/lang]
    [lang:en]
     * Mesh peak normal vector array.
     * Sets 3 elements as one in normal vector. The complete element number becomes 3n for normal vector quantity n.
     * 3n, 3n+1, and 3n+2 elements are the n level peak x, y, and z elements of the normal vector.
     * The normal vector is used in calculations for lighting and shadow.
     * @example
     *   var sprite = new Sprite3D();
     *   //Substitutes peak array
     *   //Data is stored in an order of x, y, z, x, y, z...
     *   sprite.vertices = [
     *       0.0, 0.0, 0.0,  //0 peak (0.0, 0.0, 0.0)
     *       1.0, 0.0, 0.0,  //1 peak (1.0, 0.0, 0.0)
     *       1.0, 1.0, 0.0,  //2 peak (1.0, 1.0, 0.0)
     *       0.0, 1.0, 0.0   //3 peak (0.0, 1.0, 0.0)
     *   ];
     *
     *   //Substitutes normal vector array
     *   //Data is a stored in an order of x, y, z, x, y, z...
     *   sprite.normals = [
     *       0.0, 0.0, 0.0,  //0 level peak normal vector (0.0, 0.0, 0.0)
     *       1.0, 0.0, 0.0,  //1 level peak normal vector (1.0, 0.0, 0.0)
     *       1.0, 1.0, 0.0,  //2 level peak normal vector (1.0, 1.0, 0.0)
     *       0.0, 1.0, 0.0   //3 level peak normal vector (0.0, 1.0, 0.0)
     *   ];
     * @type Number[]
     * @see enchant.gl.Mesh#vertices
     * @see enchant.gl.Mesh#indices
     * @see enchant.gl.Mesh#texCoords
    [/lang]
     */
    normals: {
        set: function(array) {
            this._normals = array;
            this._bufferData(this.normalsBuffer, this._normals, gl.ARRAY_BUFFER, gl.STATIC_DRAW, Float32Array);
        },
        get: function() {
            return this._normals;
        }
    },

    /**
    [lang:ja]
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
    [/lang]
    [lang:en]
     * Mesh texture mapping array.
     * Sets two elements as one in uv coordinates. The total number of elements becomes 2n in response to the peak quantity.
     * 2n, 2n+1 level elements correspond to n level peak texture u, v coordinates.
     * The coordinates that can be acquired for each coordinate correspond to 0<=u, v<=1.
     * @example
     *   var sprite = new Sprite3D();
     *   var texture = new Texture();
     *   texture.src = "texture.png";
     *   sprite.mesh.texture = texture;
     *
     *   //Substitutes peak level
     *   //Data is stored in an order of x, y, z, x, y, z...
     *   sprite.vertices = [
     *       0.0, 0.0, 0.0,  //0 peak (0.0, 0.0, 0.0)
     *       1.0, 0.0, 0.0,  //1 peak (1.0, 0.0, 0.0)
     *       1.0, 1.0, 0.0,  //2 peak (1.0, 1.0, 0.0)
     *       0.0, 1.0, 0.0   //3 peak (0.0, 1.0, 0.0)
     *   ];
     *
     *   //Substitutes uv coordinate array
     *   //Data is stored in an order of u, v, u, v...
     *   sprite.texCoords = [
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
    [/lang]
     */
    texCoords: {
        set: function(array) {
            this._texCoords = array;
            this._bufferData(this.texCoordsBuffer, this._texCoords, gl.ARRAY_BUFFER, gl.STATIC_DRAW, Float32Array);
        },
        get: function() {
            return this._texCoords;
        }
    },

    /**
    [lang:ja]
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
    [/lang]
    [lang:en]
     * Sprite3D peak index array.
     * 3 elements are set as one in a triangle. The total number of elements becomes 3n corresponding to the triangle's total quantity n.
     * Index level is the peak number designated in {@link enchant.gl.Sprite3D#vertices}.
     * @example
     *   var sprite = new Sprite3D();
     *   //Substitutes peak array
     *   //Data is stored in an order of x, y, z, x, y, z...
     *   sprite.vertices = [
     *       0.0, 0.0, 0.0,  //0 peak (0.0, 0.0, 0.0)
     *       1.0, 0.0, 0.0,  //1 peak (1.0, 0.0, 0.0)
     *       1.0, 1.0, 0.0,  //2 peak (1.0, 1.0, 0.0)
     *       0.0, 1.0, 0.0   //3 peak (0.0, 1.0, 0.0)
     *   ];
     *
     *   //Substitutes peak index
     *   //Draws triangle with 3 elements as one
     *   //In this example the two triangles (0,0,0), (1,0,0), (1,1,0) and 
     *   //(1,1,0), (0,1,0), (0,0,0) are drawn.
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
    [/lang]
     */
    indices: {
        set: function(array) {
            this._indices = array;
            this._bufferData(this.indicesBuffer, this._indices, gl.ELEMENT_ARRAY_BUFFER, gl.STATIC_DRAW, Uint16Array);
        },
        get: function() {
            return this._indices;
        }
    },

    /**
    [lang:ja]
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
    [/lang]
    [lang:en]
     * Mesh peak color array.
     * The 4 elements are set as one peak color. The entire number of elements becomes 4n corresponding to the peak quantity n.
     * The 4n, 4n+1, 4n+2, and 4n+3 elements are the n level peak colors r, g, b, a.
     * Peak color is used for drawing when Texture is not assigned to Sprite3D Texture.
     * {@link enchant.gl.Mesh#setBaseColor} can be used to bundle together and change.
     * @example
     *   var sprite = new Sprite3D();
     *   //Substitutes peak array
     *   //Data is stored in an order of x, y, z, x, y, z...
     *   sprite.vertices = [
     *       0.0, 0.0, 0.0,  //0 peak (0.0, 0.0, 0.0)
     *       1.0, 0.0, 0.0,  //1 peak (1.0, 0.0, 0.0)
     *       1.0, 1.0, 0.0,  //2 peak (1.0, 1.0, 0.0)
     *       0.0, 1.0, 0.0   //3 peak (0.0, 1.0, 0.0)
     *   ];
     *
     *   //Substitutes peak level array
     *   //Data is stored in an order of r, g, b, a, r, g, b, a...
     *   sprite.normals = [
     *       0.0, 0.0, 1.0, 1.0, //0 peak color (0.0, 0.0, 1.0, 1.0)
     *       0.0, 1.0, 0.0, 1.0, //1 peak color (0.0, 1.0, 0.0, 1.0)
     *       0.0, 1.0, 1.0, 1.0, //2 peak color (0.0, 1.0, 1.0, 1.0)
     *       1.0, 0.0, 0.0, 1.0  //3 peak color (1.0, 0.0, 0.0, 1.0)
     *   ];
     * @type Number[]
     * @see enchant.gl.Mesh#setBaseColor
    [/lang]
     */
    colors: {
        set: function(array) {
            this._colors = array;
            this._bufferData(this.colorsBuffer, this._colors, gl.ARRAY_BUFFER, gl.STATIC_DRAW, Float32Array);
        },
        get: function() {
            return this._colors;
        }
    }
});

/**
[lang:ja]
 * @scope enchant.gl.Sprite3D.prototype
[/lang]
[lang:en]
 * @scope enchant.gl.Sprite3D.prototype
[/lang]
 */
enchant.gl.Sprite3D = enchant.Class.create(enchant.EventTarget, {
    /**
    [lang:ja]
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
    [/lang]
    [lang:en]
     * Class with Sprite3D display function.
     * <p>Cube loaded by default.</p>
     * <p>By adding {@link enchant.gl.Scene3D} instance, you can display atop an image. 
     * By changing {@link enchant.gl.Sprite3D#vertices}, {@link enchant.gl.Sprite3D#indices},
     * {@link enchant.gl.Sprite3D#normals} and others, you can freely draw Sprite3D,
     * as well as pasting texture and more.</p>
     * <p>In addition, it is also possible to add Sprite3D as a child, and all child classes will be drawn with coordinates based on their parents.</p>
     * @example
     *   //Scene initialization
     *   var scene = new Scene3D();
     *   //Sprite3D initialization
     *   var sprite = new Sprite3D();
     *   //Add Sprite3D to scene
     *   scene.addChild(sprite);
     *
     * @constructs
     * @extends enchant.EventTarget
    [/lang]
     */
    initialize: function() {
        enchant.EventTarget.call(this);

        /**
        [lang:ja]
         * 子Sprite3D要素の配列.
         * この要素に子として追加されているSprite3Dの一覧を取得できる.
         * 子を追加したり削除したりする場合には, この配列を直接操作せずに,
         * {@link enchant.gl.Sprite3D#addChild}や{@link enchant.gl.Sprite3D#removeChild}を利用する.
         * @type enchant.gl.Sprite3D[]
         * @see enchant.gl.Sprite3D#addChild
         * @see enchant.gl.Sprite3D#removeChild
        [/lang]
        [lang:en]
         * Array for child Sprite 3D element.
         * Can acquire list of Sprite3Ds added as child classes to this element.
         * When adding or subtracting child classes, without directly operating this array,
         * {@link enchant.gl.Sprite3D#addChild} or {@link enchant.gl.Sprite3D#removeChild} is used.
         * @type enchant.gl.Sprite3D[]
         * @see enchant.gl.Sprite3D#addChild
         * @see enchant.gl.Sprite3D#removeChild
        [/lang]
         */
        this.childNodes = [];

        /**
        [lang:ja]
         * このSprite3Dが現在追加されているシーンオブジェクト.
         * どのシーンにも追加されていないときにはnull.
         * @type enchant.gl.Scene3D
         * @see enchant.gl.Scene3D#addChild
        [/lang]
        [lang:en]
         * The scene object currently added by this Sprite3D.
         * When no scene is added this is null.
         * @type enchant.gl.Scene3D
         * @see enchant.gl.Scene3D#addChild
        [/lang]
         */
        this.scene = null;

        /**
        [lang:ja]
         * Sprite3Dの親要素.
         * 親が存在しない場合にはnull.
         * @type enchant.gl.Sprite3D|enchant.gl.Scene3D
        [/lang]
        [lang:en]
         * Sprite3D parent element.
         * When no parent exists this is null.
         * @type enchant.gl.Sprite3D|enchant.gl.Scene3D
        [/lang]
         */
        this.parentNode = null;

        /**
        [lang:ja]
         * Sprite3Dに適用されるメッシュオブジェクト.
         * @type enchant.gl.Mesh
         * @example
         *   var sprite = new Sprite3D();
         *   sprite.mesh = new Mesh();
        [/lang]
        [lang:en]
         * Mesh object applied to Sprite3D.
         * @type enchant.gl.Mesh
         * @example
         *   var sprite = new Sprite3D();
         *   sprite.mesh = new Mesh();
        [/lang]
         */
        //this.mesh = new Mesh();
        this._mesh = null;

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
        this._touchable = true;

        this._global = vec3.create();
        this.globalX = 0;
        this.globalY = 0;
        this.globalZ = 0;

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
            if (this.mesh != null) {
                this.mesh._count++;
            }
            if (this.childNodes.length) {
                for (var i = 0, l = this.childNodes.length; i < l; i++) {
                    this.childNodes[i].scene = this.scene;
                    this.childNodes[i].dispatchEvent(e);
                }
            }
        };
        this.addEventListener('addedtoscene', added);

        var removed = function(e) {
            if (this.mesh != null) {
                this.mesh._count--;
            }
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
    [lang:ja]
     * Sprite3Dの複製を作成する.
     * 位置,回転行列などがコピーされた新しいインスタンスが返される.
     * @example
     *   var sp = new Sprite3D();
     *   sp.x = 15;
     *   var sp2 = sp.clone();
     *   //sp2.x = 15;
     * @return {enchant.gl.Sprite3D}
    [/lang]
    [lang:en]
     * Executes the reproduction of Sprite3D.
     * Position, rotation line, and others will be returned to a copied, new instance.
     * @example
     *   var sp = new Sprite3D();
     *   sp.x = 15;
     *   var sp2 = sp.clone();
     *   //sp2.x = 15;
     * @return {enchant.gl.Sprite3D}
    [/lang]
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
                //clone[prop] = this[prop].filter(function() { return true; });
                clone[prop] = this[prop].slice(0);
            }
        }
        if (this.mesh != null) {
            clone.mesh = this.mesh;
        }
        if (this.childNodes) {
            for (var i = 0, l = this.childNodes.length; i < l; i++) {
                clone.addChild(this.childNodes[i].clone());
            }
        }
        return clone;
    },

    /**
    [lang:ja]
     * 他のSprite3Dの状態をセットする.
     * Colladaファイルを読み込んだassetsに対して使用できる.
     * @example
     *   var sp = new Sprite3D();
     *   sp.set(game.assets['sample.dae']);
     *   //sample.daeのモデル情報を持ったSprite3Dになる
     *   
    [/lang]
    [lang:en]
     * Sets condition of other Sprite3D.
     * Can be used corresponding Collada file's loaded assets.
     * @example
     *   var sp = new Sprite3D();
     *   sp.set(game.assets['sample.dae']);
     *   //Becomes Sprite3D with sample.dae model information
     *   
    [/lang]
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
        if (sprite.mesh != null) {
            this.mesh = sprite.mesh;
        }
        if (sprite.childNodes) {
            for (var i = 0, l = sprite.childNodes.length; i < l; i++) {
                this.addChild(sprite.childNodes[i].clone());
            }
        }
    },

    /**
    [lang:ja]
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
    [/lang]
    [lang:en]
     * Add child Sprite3D.
     * When it is added, an "added" event will be created for child Sprite3D.
     * When a parent is already added to scene, it will be added to scene,
     * and an "addedtoscene" event will be created.
     * Child Sprite3D for adding @param {enchant.gl.Sprite3D} sprite. 
     * @example
     *   var parent = new Sprite3D();
     *   var child = new Sprite3D();
     *   //Add Sprite3D as child to another Sprite3D
     *   parent.addChild(child);
     * @see enchant.gl.Sprite3D#removeChild
     * @see enchant.gl.Sprite3D#childNodes
     * @see enchant.gl.Sprite3D#parentNode
    [/lang]
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
[lang:ja]
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
     [/lang]
[lang:en]
     * Deletes designated child Sprite3D.
     * When deletion is complete, a "removed" event will be created for child Sprite3D.
     * When added to scene, it will be deleted from that scene,
     * and a "removedfromscene" event will be created.
     * Child Sprite3D for deleting @param {enchant.gl.Sprite3D} sprite.
     * @example
     *   var scene = new Scene3D();
     *   //Deletes scene's first child
     *   scene.removeChild(scene.childNodes[0]);
     * @see enchant.gl.Sprite3D#addChild
     * @see enchant.gl.Sprite3D#childNodes
     * @see enchant.gl.Sprite3D#parentNode
     [/lang]
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
[lang:ja]
     * 他のオブジェクトとの衝突判定.
     * 衝突判定オブジェクトか, x, y, zプロパティを持っているオブジェクトとの衝突を判定することができる.
     * @param {enchant.gl.Sprite3D} bounding 対象のオブジェクト
     * @return {Boolean}
     [/lang]
[lang:en]
     * Other object collison detection.
     * Can detect collisions with collision detection objects with x, y, z properties.
     * @param {enchant.gl.Sprite3D} bounding Target object
     * @return {Boolean}
     [/lang]
     */
    intersect: function(another) {
        return this.bounding.intersect(another.bounding);
    },

    /**
[lang:ja]
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
     [/lang]
[lang:en]
     * Parallel displacement of Sprite3D.
     * Displaces each coordinate a designated amount from its current location.
     * @param {Number} x Parallel displacement of x axis
     * @param {Number} y Parallel displacement of y axis
     * @param {Number} z Parallel displacement of z axis
     * @example
     *   var sprite = new Sprite3D();
     *   //Parallel displacement by 10 along the x axis, 3 along the y axis, and -20 along the z axis
     *   sprite.translate(10, 3, -20);
     * @see enchant.gl.Sprite3D#x
     * @see enchant.gl.Sprite3D#y
     * @see enchant.gl.Sprite3D#z
     * @see enchant.gl.Sprite3D#scale
     [/lang]
     */
    translate: function(x, y, z) {
        this._x += x;
        this._y += y;
        this._z += z;
        this._changedTranslation = true;
    },

    /**
[lang:ja]
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
     [/lang]
[lang:en]
     * Expand or contract Sprite3D.
     * Expands each axis by a designated expansion rate.
     * @param {Number} x x axis expansion rate
     * @param {Number} y y axis expansion rate
     * @param {Number} z z axis expansion rate
     * @example
     *   var sprite = new Sprite3D();
     *   //Expand x axis by 2.0 times, y axis by 3.0 times, and z axis by 0.5 times
     *   sprite.scale(2,0, 3.0, 0.5);
     * @see enchant.gl.Sprite3D#scaleX
     * @see enchant.gl.Sprite3D#scaleY
     * @see enchant.gl.Sprite3D#scaleZ
     * @see enchant.gl.Sprite3D#translate
     [/lang]
     */
    scale: function(x, y, z) {
        this._scaleX *= x;
        this._scaleY *= y;
        this._scaleZ *= z;
        this._changedScale = true;
    },

    /**
[lang:ja]
     * Sprite3Dの名前
     * @type String
     [/lang]
[lang:en]
     * Sprite3D name
     * @type String
     [/lang]
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
[lang:ja]
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
     [/lang]
[lang:en]
     * Sprite3D rotation line.
     * Array is a one-dimensional array of length 16, interpreted as the 4x4 line destination.
     * @example
     *   var sprite = new Sprite3D();
     *   //45 degree rotation along the x axis
     *   var rotX = Math.PI() / 4;
     *   sprite.rotation = [
     *       1, 0, 0, 0,
     *       0, Math.cos(rotX), -Math.sin(rotX), 0,
     *       0, Math.sin(rotX), Math.cos(rotX), 0,
     *       0, 0, 0, 1
     *   ];
     * @type Number[]
     [/lang]
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
[lang:ja]
     * 回転行列にクォータニオンから得られる回転行列をセットする.
     * @type enchant.gl.Quat
     [/lang]
[lang:en]
     * Sets rotation line in rotation line received from quarterion.
     * @type enchant.gl.Quat
     [/lang]
     */
    rotationSet: function(quat) {
        quat.toMat4(this._rotation);
    },

    
    /**
[lang:ja]
     * 回転行列にクォータニオンから得られる回転行列を適用する.
     * @type enchant.gl.Quat
     [/lang]
[lang:en]
     * Applies rotation line in rotation line received from quarterion.
     * @type enchant.gl.Quat
     [/lang]
     */
    rotationApply: function(quat) {
        quat.toMat4(this.tmpMat);
        mat4.multiply(this._rotation, this.tmpMat);
    },

    mesh: {
        get: function() {
            return this._mesh;
        },
        set: function(mesh) {
            this._mesh = mesh;
        }
    },

    /**
[lang:ja]
     * Sprite3Dに適用する変換行列.
     * @deprecated
     * @type Number[]
     [/lang]
[lang:en]
     * Conversion line applied to Sprite3D.
     * @deprecated
     * @type Number[]
     [/lang]
     */
    matrix: {
        get: function() {
            return this._matrix;
        },
        set: function(matrix) {
            this._matrix = matrix;
        }
    },

    /**
[lang:ja]
     * Sprite3Dの当たり判定に利用されるオブジェクト.
     * @type enchant.gl.Bounding | enchant.gl.BS | enchant.gl.AABB
     [/lang]
[lang:en]
     * Object used in Sprite3D collision detection.
     * @type enchant.gl.Bounding | enchant.gl.BS | enchant.gl.AABB
     [/lang]
     */
    bounding: {
        get: function() {
            return this._bounding;
        },
        set: function(bounding) {
            this._bounding = bounding;
            this._bounding.parent = this;
        }
    },

    /**
[lang:ja]
     * Sprite3Dをタッチ可能にするか決定する.
     * falseに設定するとタッチ判定の際無視される.
     * @type bool
     [/lang]
     */
    touchable: {
        get: function() {
            return this._touchable;
        },
        set: function(bool) {
            this._touchable = bool;
            if (this._touchable) {
                this.detectColor[3] = 1.0;
            } else {
                this.detectColor[3] = 0.0;
            }
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

        this._global[0] = this._x;
        this._global[1] = this._y;
        this._global[2] = this._z;
        mat4.multiplyVec3(this.tmpMat, this._global);
        this.globalX = this._global[0];
        this.globalY = this._global[1];
        this.globalZ = this._global[2];

        if (this.childNodes.length) {
            for (var i = 0, l = this.childNodes.length; i < l; i++) {
                this.childNodes[i]._draw(scene, detectTouch, this.tmpMat);
            }
        }
        if (this.mesh != null) {
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
[lang:ja]
 * Sprite3Dのx座標.
 * @default 0
 * @type Number
 * @see enchant.gl.Sprite3D#translate
 [/lang]
[lang:en]
 * Sprite3D x coordinates.
 * @default 0
 * @type Number
 * @see enchant.gl.Sprite3D#translate
 [/lang]
 */
enchant.gl.Sprite3D.prototype.x = 0;

/**
[lang:ja]
 * Sprite3Dのy座標.
 * @default 0
 * @type Number
 * @see enchant.gl.Sprite3D#translate
 [/lang]
[lang:en]
 * Sprite3D y coordinates.
 * @default 0
 * @type Number
 * @see enchant.gl.Sprite3D#translate
 [/lang]
 */
enchant.gl.Sprite3D.prototype.y = 0;

/**
[lang:ja]
 * Sprite3Dのz座標.
 * @default 0
 * @type Number
 * @see enchant.gl.Sprite3D#translate
 [/lang]
[lang:en]
 * Sprite3D z coordinates.
 * @default 0
 * @type Number
 * @see enchant.gl.Sprite3D#translate
 [/lang]
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
[lang:ja]
 * Sprite3Dのx軸方向に対する拡大率
 * @default 1.0
 * @type Number
 * @see enchant.gl.Sprite3D#scale
 [/lang]
[lang:en]
 * Sprite3D x axis direction expansion rate
 * @default 1.0
 * @type Number
 * @see enchant.gl.Sprite3D#scale
 [/lang]
 */
enchant.gl.Sprite3D.prototype.scaleX = 1;

/**
[lang:ja]
 * Sprite3Dのy軸方向に対する拡大率
 * @default 1.0
 * @type Number
 * @see enchant.gl.Sprite3D#scale
 [/lang]
[lang:en]
 * Sprite3D y axis direction expansion rate
 * @default 1.0
 * @type Number
 * @see enchant.gl.Sprite3D#scale
 [/lang]
 */
enchant.gl.Sprite3D.prototype.scaleY = 1;
/**
[lang:ja]
 * Sprite3Dのz軸方向に対する拡大率
 * @default 1.0
 * @type Number
 * @see enchant.gl.Sprite3D#scale
 [/lang]
[lang:en]
 * Sprite3D z axis direction expansion rate
 * @default 1.0
 * @type Number
 * @see enchant.gl.Sprite3D#scale
 [/lang]
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
[lang:ja]
 * Sprite3Dのグローバルのx座標.
 * @default 0
 * @type Number
 * @see enchant.gl.Sprite3D#translate
 [/lang]
 [lang:en]
 * Sprite3D global x coordinates.
 * @default 0
 * @type Number
 * @see enchant.gl.Sprite3D#translate
 [/lang]
 */
enchant.gl.Sprite3D.prototype.globalX = 0;

/**
[lang:ja]
 * Sprite3Dのグローバルのy座標.
 * @default 0
 * @type Number
 * @see enchant.gl.Sprite3D#translate
 [/lang]
 [lang:en]
 * Sprite 3D global y coordinates.
 * @default 0
 * @type Number
 * @see enchant.gl.Sprite3D#translate
 [/lang]
 */
enchant.gl.Sprite3D.prototype.globalY = 0;

/**
[lang:ja]
 * Sprite3Dのグローバルのz座標.
 * @default 0
 * @type Number
 * @see enchant.gl.Sprite3D#translate
 [/lang]
 [lang:en]
 * Sprite3D global 3D coordinates.
 * @default 0
 * @type Number
 * @see enchant.gl.Sprite3D#translate
 [/lang]
 */
enchant.gl.Sprite3D.prototype.globalZ = 0;

/**
[lang:ja]
 * @scope enchant.gl.Camera3D.prototype
 [/lang]
[lang:en]
 * @scope enchant.gl.Camera3D.prototype
 [/lang]
 */
enchant.gl.Camera3D = enchant.Class.create({
    /**
[lang:ja]
     * 3Dシーンのカメラを設定するクラス
     * @example
     * var scene = new Scene3D();
     * var camera = new Camera3D();
     * camera.x = 0;
     * camera.y = 0;
     * camera.z = 10;
     * scene.setCamera(camera);
     * @constructs
     [/lang]
[lang:en]
     * Class to set 3D scene camera
     * @example
     * var scene = new Scene3D();
     * var camera = new Camera3D();
     * camera.x = 0;
     * camera.y = 0;
     * camera.z = 10;
     * scene.setCamera(camera);
     * @constructs
     [/lang]
     */
    initialize: function() {
        this._changedPosition = false;
        this._changedCenter = false;
        this._changedUpVector = false;
        this._x = 0;
        this._y = 0;
        this._z = 10;
        this._centerX = 0;
        this._centerY = 0;
        this._centerZ = 0;
        this._upVectorX = 0;
        this._upVectorY = 1;
        this._upVectorZ = 0;
        this._focus;
        this._focusing = function() {
        };
    },
    /**
    [lang:ja]
     * カメラの注視点をSprite3Dの位置に合わせる.
     * @param {enchant.gl.Sprite3D} sprite 注視するSprite3D
     [/lang]
    [lang:en]
     * @param {enchant.gl.Sprite3D} sprite 注視するSprite3D
     [/lang]
     */
    lookAt: function(sprite) {
        if (sprite instanceof Sprite3D) {
            this._centerX = sprite.x;
            this._centerY = sprite.y;
            this._centerZ = sprite.z;
            this._changedCenter = true;
        }
    }
});

/**
[lang:ja]
 * カメラのx座標
 * @type Number
 [/lang]
[lang:en]
 * Camera x coordinates
 * @type Number
 [/lang]
 */
enchant.gl.Camera3D.prototype.x = 0;

/**
[lang:ja]
 * カメラのy座標
 * @type Number
 [/lang]
[lang:en]
 * Camera y coordinates
 * @type Number
 [/lang]
 */
enchant.gl.Camera3D.prototype.y = 0;

/**
[lang:ja]
 * カメラのz座標
 * @type Number
 [/lang]
[lang:en]
 * Camera z coordinates
 * @type Number
 [/lang]
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
[lang:ja]
 * カメラの視点のx座標
 * @type Number
 [/lang]
[lang:en]
 * Camera perspective x coordinates
 * @type Number
 [/lang]
 */
enchant.gl.Camera3D.prototype.centerX = 0;

/**
[lang:ja]
 * カメラの視点のy座標
 * @type Number
 [/lang]
[lang:en]
 * Camera perspective y coordinates
 * @type Number
 [/lang]
 */
enchant.gl.Camera3D.prototype.centerY = 0;

/**
[lang:ja]
 * カメラの視点のz座標
 * @type Number
 [/lang]
[lang:en]
 * Camera perspective z coordinates
 * @type Number
 [/lang]
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
[lang:ja]
 * カメラの上方向ベクトルのx成分
 * @type Number
 [/lang]
[lang:en]
 * Camera upper hector x component
 * @type Number
 [/lang]
 */
enchant.gl.Camera3D.prototype.upVectorX = 0;

/**
[lang:ja]
 * カメラの上方向ベクトルのy成分
 * @type Number
 [/lang]
[lang:en]
 * Camera upper hector y component
 * @type Number
 [/lang]
 */
enchant.gl.Camera3D.prototype.upVectorY = 1;

/**
[lang:ja]
 * カメラの上方向ベクトルのz成分
 * @type Number
 [/lang]
[lang:en]
 * Camera upper hector z component
 * @type Number
 [/lang]
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
[lang:ja]
 * @scope enchant.gl.Scene3D.prototype
 [/lang]
[lang:en]
 * @scope enchant.gl.Scene3D.prototype
 [/lang]
 */
enchant.gl.Scene3D = enchant.Class.create(enchant.EventTarget, {
    /**
[lang:ja]
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
     [/lang]
[lang:en]
     * Class for displayed Sprite3D tree route.
     * Currently, multiple definitions are impossible, and the Scene3D defined first will be returned.
     *
     * @example
     *   var scene = new Scene3D();
     *   var sprite = new Sprite3D();
     *   scene.addChild(sprite);
     *
     * @constructs
     * @extends enchant.EventTarget
     [/lang]
     */
    initialize: function() {
        var game = enchant.Game.instance;
        if (game.currentScene3D) {
            return game.currentScene3D;
        }
        enchant.EventTarget.call(this);
        /**
[lang:ja]
         * 子要素の配列.
         * このシーンに子として追加されているSprite3Dの一覧を取得できる.
         * 子を追加したり削除したりする場合には, この配列を直接操作せずに,
         * {@link enchant.gl.Scene3D#addChild}や{@link enchant.gl.Scene3D#removeChild}を利用する.
         * @type enchant.gl.Sprite3D[]
         [/lang]
[lang:en]
         * Child element array.
         * A list of Sprite3D added as child classes in this scene can be acquired.
         * When adding or subtracting child classes, without directly operating this array, 
         * {@link enchant.gl.Scene3D#addChild} or {@link enchant.gl.Scene3D#removeChild} is used.
         * @type enchant.gl.Sprite3D[]
         [/lang]
         */
        this.childNodes = [];

        /**
[lang:ja]
         * 照明の配列.
         * 現在, シーンに適用される光源は0番目のみ.
         * このシーンに追加されている光源の一覧を取得する.
         * 照明を追加したり削除したりする場合には, この配列を直接操作せずに,
         * {@link enchant.gl.Scene3D#addLight}や{@link enchant.gl.Scene3D#removeLight}を利用する.
         * @type enchant.gl.PointLight[]
         [/lang]
[lang:en]
         * Lighting array.
         * At present, the only light source active in the scene is 0.
         * Acquires a list of light sources acquired in this scene.
         * When lighting is added or deleted, without directly operating this array,
         * {@link enchant.gl.Scene3D#addLight} or {@link enchant.gl.Scene3D#removeLight} is used.
         * @type enchant.gl.PointLight[]
         [/lang]
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

        this.setDirectionalLight(new DirectionalLight());
        this.setCamera(new Camera3D());
    },

    /**
[lang:ja]
     * Scene3Dの背景色
     * @type Number[]
     [/lang]
[lang:en]
     * Scene3D background color
     * @type Number[]
     [/lang]
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
[lang:ja]
     * シーンにSprite3Dを追加する.
     * 引数に渡されたSprite3Dと, その子を全てシーンに追加する.
     * シーンに追加されると自動的にSprite3Dは画面上に表示される.
     * 一度追加したオブジェクトを削除するには{@link enchant.gl.Scene3D#removeChild}を利用する.
     * @param {enchant.gl.Sprite3D} sprite 追加するSprite3D
     * @see enchant.gl.Scene3D#removeChild
     * @see enchant.gl.Scene3D#childNodes
     [/lang]
[lang:en]
     * Add Sprite3D to scene.
     * Adds Sprite3D delivered to argument and child classes to scene.
     * Sprite3D will automatically be displayed on screen if added to scene.
     * Use {@link enchant.gl.Scene3D#removeChild} to delete object added once.
     * @param {enchant.gl.Sprite3D} sprite Sprite3D to be added
     * @see enchant.gl.Scene3D#removeChild
     * @see enchant.gl.Scene3D#childNodes
     [/lang]
     */
    addChild: function(sprite) {
        this.childNodes.push(sprite);
        sprite.parentNode = sprite.scene = this;
        sprite.dispatchEvent(new enchant.Event('added'));
        sprite.dispatchEvent(new enchant.Event('addedtoscene'));
        sprite.dispatchEvent(new enchant.Event('render'));
    },

    /**
[lang:ja]
     * シーンからSprite3Dを削除する.
     * シーンから指定されたSprite3Dを削除する.
     * 削除されたSprite3Dは画面上に表示されなくなる.
     * Sprite3Dを追加するには{@link enchant.gl.Scene3D#addChild}を利用する.
     * @param {enchant.gl.Sprite3D} sprite 削除するSprite3D
     * @see enchant.gl.Scene3D#addChild
     * @see enchant.gl.Scene3D#childNodes
     [/lang]
[lang:en]
     * Delete Sprite3D from scene.
     * Deletes designated Sprite3D from scene.
     * The deleted Sprite3D will no longer be displayed on the screen.
     * Use {@link enchant.gl.Scene3D#addChild} to add Sprite3D.
     * @param {enchant.gl.Sprite3D} sprite Sprite3D to delete
     * @see enchant.gl.Scene3D#addChild
     * @see enchant.gl.Scene3D#childNodes
     [/lang]
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
[lang:ja]
     * シーンのカメラ位置をセットする.
     * @param {enchant.gl.Camera3D} camera セットするカメラ
     * @see enchant.gl.Camera3D
     [/lang]
[lang:en]
     * Sets scene's camera postion.
     * @param {enchant.gl.Camera3D} camera Camera to set
     * @see enchant.gl.Camera3D
     [/lang]
     */
    setCamera: function(camera) {
        camera._changedPosition = true;
        camera._changedCenter = true;
        camera._changedUpVector = true;
        this._camera = camera;
        gl.uniform1f(this.shaderUniforms.useCamera, 1.0);
    },   

    /**
[lang:ja]
     * シーンに平行光源を設定する.
     * @param {enchant.gl.DirectionalLight} light 設定する照明
     * @see enchant.gl.DirectionalLight
     [/lang]
[lang:en]
     * Sets directional light source in scene.
     * @param {enchant.gl.DirectionalLight} light Lighting to set
     * @see enchant.gl.DirectionalLight
     [/lang]
     */
    setDirectionalLight: function(light) {
        this.directionalLight = light;
        this.useDirectionalLight = true;
        gl.uniform1f(this.shaderUniforms.useDirectionalLight, 1.0);
    },

    /**
    [lang:ja]
     * シーンに設定されている平行光源を取得する.
     * @see enchant.gl.DirectionalLight
     * @return {enchant.gl.DirectionalLight}
     [/lang]
    [lang:en]
     * Gets directional light source in scene.
     * @see enchant.gl.DirectionalLight
     * @return {enchant.gl.DirectionalLight}
     [/lang]
     */
    getDirectionalLight: function() {
        return this.directionalLight;
    },

    /**
[lang:ja]
     * シーンに照明を追加する.
     * 現在, シーンに追加しても適用されない.
     * @param {enchant.gl.PointLight} light 追加する照明
     * @see enchant.gl.PointLight
     [/lang]
[lang:en]
     * Add lighting to scene.
     * Currently, will not be used even if added to scene.
     * @param {enchant.gl.PointLight} light Lighting to add
     * @see enchant.gl.PointLight
     [/lang]
     */
    addLight: function(light){
        this.lights.push(light);
        this.usePointLight = true;
    },   

    /**
[lang:ja]
     * シーンから照明を削除する
     * @param {enchant.gl.PointLight} light 削除する照明
     * @see enchant.gl.PointLight.
     [/lang]
[lang:en]
     * Delete lighting from scene
     * @param {enchant.gl.PointLight} light Lighting to delete
     * @see enchant.gl.PointLight.
     [/lang]
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
    float alpha = uDetectColor.a * uDetectTouch + baseColor.a * (1.0 - uDetectTouch);\n\
    if (alpha < 0.2) {\n\
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

