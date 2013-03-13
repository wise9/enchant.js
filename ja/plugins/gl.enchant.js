/**
 * @fileOverview
 * gl.enchant.js
 * @version 0.3.7
 * @require enchant.js v0.4.5+
 * @require gl-matrix.js 1.3.7+
 * @author Ubiquitous Entertainment Inc.
 *
 * @description
 * WebGLを用いた描画ライブラリ
 * enchant.js と組み合わせることで高度な3D描画と、2D描画を組み合わせることができる
 *
 * @detail
 * ベクトル・行列演算にgl-matrix.jsを使用しています.
 * gl-matrix.js:
 * https://github.com/toji/gl-matrix/
 */

/**
 * enchantにgl.enchant.jsのクラスをエクスポートする.
 */
enchant.gl = {};

if (typeof glMatrixArrayType === 'undefined') {
    throw new Error('should load gl-matrix.js before loading gl.enchant.js');
}

(function() {

    var CONTEXT_NAME = 'experimental-webgl';

    var parentModule = null;
    (function() {
        enchant();
        if (enchant.nineleap !== undefined) {
            if (enchant.nineleap.memory !== undefined &&
                Object.getPrototypeOf(enchant.nineleap.memory) === Object.prototype) {
                parentModule = enchant.nineleap.memory;
            } else if (enchant.nineleap !== undefined &&
                Object.getPrototypeOf(enchant.nineleap) === Object.prototype) {
                parentModule = enchant.nineleap;
            }
        } else {
            parentModule = enchant;
        }
    }());

    enchant.gl.Core = enchant.Class.create(parentModule.Core, {
        initialize: function(width, height) {
            parentModule.Core.call(this, width, height);
            this.GL = new GLUtil();
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
                    node.age++;
                    if (node.childNodes) {
                        push.apply(nodes, node.childNodes);
                    }
                }
            });
        },
        debug: function() {
            this.GL._enableDebugContext();
            this._debug = true;
            this.addEventListener("enterframe", function(time) {
                this._actualFps = (1000 / time.elapsed);
            });
            this.start();
        }
    });

    var GLUtil = enchant.Class.create({
        initialize: function() {
            var core = enchant.Core.instance;
            if (typeof core.GL !== 'undefined') {
                return core.GL;
            }
            this._createStage(core.width, core.height, core.scale);
            this._prepare();
            this.textureManager = new TextureManager();
            this.detectColorManager = new DetectColorManager();
            this.detectFrameBuffer = new enchant.gl.FrameBuffer(core.width, core.height);
            this.defaultProgram = new enchant.gl.Shader(DEFAULT_VERTEX_SHADER_SOURCE, DEFAULT_FRAGMENT_SHADER_SOURCE);
            this.setDefaultProgram();
        },
        setDefaultProgram: function() {
            this.setProgram(this.defaultProgram);
        },
        setProgram: function(program) {
            program.use();
            this.currentProgram = program;
        },
        _prepare: function() {
            var width = this._canvas.width;
            var height = this._canvas.height;
            gl.clearColor(0.0, 0.0, 0.0, 1.0);
            gl.viewport(0, 0, width, height);
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
            gl.enable(gl.DEPTH_TEST);
            gl.enable(gl.CULL_FACE);
        },
        _createStage: function(width, height, scale) {
            var div = createParentDiv();
            var that = this;
            var stage = document.getElementById('enchant-stage');
            var cvs = this._canvas = createGLCanvas(width, height, scale);
            var detect = new enchant.Sprite(width, height);
            var core = enchant.Core.instance;
            (function() {
                var color = new Uint8Array(4);
                var touching = null;
                var sprite;
                detect.addEventListener('touchstart', function(e) {
                    var scene = core.currentScene3D;
                    var x = parseInt(e.x, 10);
                    var y = parseInt(this.height - e.y, 10);
                    that.detectFrameBuffer.bind();
                    scene._draw('detect');
                    gl.readPixels(x, y, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, color);
                    sprite = that.detectColorManager.getSpriteByColor(color);
                    if (sprite) {
                        touching = sprite;
                        touching.dispatchEvent(e);
                    }
                    that.detectFrameBuffer.unbind();
                });
                detect.addEventListener('touchmove', function(e) {
                    if (touching !== null) {
                        touching.dispatchEvent(e);
                    }
                });
                detect.addEventListener('touchend', function(e) {
                    if (touching !== null) {
                        touching.dispatchEvent(e);
                    }
                    touching = null;
                });
            }());
            window['gl'] = this._gl = this._getContext(cvs);
            div.appendChild(cvs);
            stage.insertBefore(div, core.rootScene._element);
            core.rootScene.addChild(detect);
        },
        _getContext: function(canvas, debug) {
            var ctx = canvas.getContext(CONTEXT_NAME);
            if (!ctx) {
                window['alert']('could not initialized WebGL');
                throw new Error('could not initialized WebGL');
            }
            if (debug) {
                ctx = createDebugContext(ctx);
            }
            return ctx;
        },
        _enableDebugContext: function() {
            window['gl'] = this._gl = createDebugContext(this._gl);
        },
        parseColor: function(string) {
            return parseColor(string);
        },
        renderElements: function(buffer, offset, length, attributes, uniforms) {
            if (attributes) {
                this.currentProgram.setAttributes(attributes);
            }
            if (uniforms) {
                this.currentProgram.setUniforms(uniforms);
            }
            buffer.bind();
            gl.drawElements(gl.TRIANGLES, length, gl.UNSIGNED_SHORT, offset);
            buffer.unbind();
        }
    });

    var parseColor = function(string) {
        var color = [];
        if (typeof string === 'string') {
            if (string.match(/#/)) {
                string.match(/[0-9a-fA-F]{2}/g).forEach(function(n) {
                    color[color.length] = ('0x' + n - 0) / 255;
                });
                color[color.length] = 1.0;
            } else if (string.match(/rgba/)) {
                string.match(/[0-9]{1,3},/g).forEach(function(n) {
                    color[color.length] = parseInt(n, 10) / 255;
                });
                color[color.length] = parseFloat(string.match(/[0-9]\.[0-9]{1,}/)[0]);
            } else if (string.match(/rgb/)) {
                string.match(/[0-9]{1,3},/g).forEach(function(n) {
                    color[color.length] = parseInt(n, 10) / 255;
                });
                color[color.length] = 1.0;
            }
        } else if (string instanceof Array) {
            color = string;
        }
        return color;
    };

    var createDebugContext = function(context) {
        var ctx = {};
        var names = {};
        var type = '';
        var val;
        var makeFakedMethod = function(context, prop) {
            return function() {
                var value, error;
                value = context[prop].apply(context, arguments);
                error = context.getError();
                if (error) {
                    window['console'].log(names[error] + '(' + error + ')' + ': ' + prop);
                    window['console'].log(arguments);
                }
                return value;
            };
        };
        for (var prop in context) {
            type = typeof context[prop];
            val = context[prop];
            if (type === 'function') {
                ctx[prop] = makeFakedMethod(context, prop);
            } else if (type === 'number') {
                names[val] = prop;
                ctx[prop] = val;
            } else {
                ctx[prop] = val;
            }
        }
        ctx.getNameById = function(i) {
            return names[i];
        };
        return ctx;
    };

    var createParentDiv = function() {
        var div = document.createElement('div');
        div.style['position'] = 'absolute';
        div.style['z-index'] = -1;
        div.style[enchant.ENV.VENDOR_PREFIX + 'TransformOrigin'] = '0 0';
        return div;
    };

    var createGLCanvas = function(width, height, scale) {
        var cvs = document.createElement('canvas');
        cvs.width = width;
        cvs.height = height;
        cvs.style['position'] = 'absolute';
        cvs.style['z-index'] = -1;
        cvs.style[enchant.ENV.VENDOR_PREFIX + 'Transform'] = 'scale(' + scale + ')';
        cvs.style[enchant.ENV.VENDOR_PREFIX + 'TransformOrigin'] = '0 0';
        return cvs;
    };

    var TextureManager = enchant.Class.create({
        initialize: function() {
            this.storage = {};
        },
        hasTexture: function(src) {
            return src in this.storage;
        },
        getWebGLTexture: function(image, flip, wrap, mipmap) {
            var ret;
            if (this.hasTexture(image.src)) {
                ret = this.storage[image.src];
            } else {
                ret = this.createWebGLTexture(image, flip, wrap, mipmap);
            }
            return ret;
        },
        isPowerOfTwo: function(n) {
            return (n > 0) && ((n & (n - 1)) === 0);
        },
        setTextureParameter: function(power, target, wrap, mipmap) {
            var filter;
            if (mipmap) {
                filter = gl.LINEAR_MIPMAP_LINEAR;
            } else {
                filter = gl.NEAREST;
            }
            if (!power) {
                wrap = gl.CLAMP_TO_EDGE;
            }
            gl.texParameteri(target, gl.TEXTURE_WRAP_S, wrap);
            gl.texParameteri(target, gl.TEXTURE_WRAP_T, wrap);
            gl.texParameteri(target, gl.TEXTURE_MAG_FILTER, filter);
            gl.texParameteri(target, gl.TEXTURE_MIN_FILTER, filter);
        },
        _texImage: function(image, target) {
            gl.texImage2D(target, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        },
        _writeWebGLTexture: function(image, target, wrap, mipmap) {
            var power = this.isPowerOfTwo(image.width) && this.isPowerOfTwo(image.height);
            if (typeof target === 'undefined') {
                target = gl.TEXTURE_2D;
            }
            if (typeof wrap === 'undefined') {
                wrap = gl.REPEAT;
            }
            this.setTextureParameter(power, target, wrap, mipmap);

            this._texImage(image, target);
            if (mipmap) {
                gl.generateMipmap(target);
            }
        },
        createWebGLTexture: function(image, flip, wrap, mipmap) {
            var tex = gl.createTexture();
            var target = gl.TEXTURE_2D;
            gl.bindTexture(target, tex);
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, flip);
            this._writeWebGLTexture(image, target, wrap, mipmap);
            gl.bindTexture(target, null);
            this.storage[image.src] = tex;
            return tex;
        },
        createWebGLCubeMapTexture: function(images, wrap, mipmap) {
            var faceTargets = [
                gl.TEXTURE_CUBE_MAP_POSITIVE_X,
                gl.TEXTURE_CUBE_MAP_NEGATIVE_X,
                gl.TEXTURE_CUBE_MAP_POSITIVE_Y,
                gl.TEXTURE_CUBE_MAP_POSITIVE_Y,
                gl.TEXTURE_CUBE_MAP_NEGATIVE_Z,
                gl.TEXTURE_CUBE_MAP_NEGATIVE_Z
            ];

            var tex = gl.createTexture();
            var target, image;
            gl.bindTexture(gl.TEXTURE_CUBE_MAP, tex);
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
            for (var i = 0, l = images.length; i < l; i++) {
                target = faceTargets[i];
                image = images[i];
                this._writeWebGLTexture(image, target, wrap, mipmap);
            }
            gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);
            return tex;
        }
    });

    var DetectColorManager = enchant.Class.create({
        initialize: function() {
            this.reference = [];
            this.detectColorNum = 0;
        },
        attachDetectColor: function(sprite) {
            this.detectColorNum += 1;
            this.reference[this.detectColorNum] = sprite;
            return this._createNewColor();
        },
        _createNewColor: function() {
            var n = this.detectColorNum;
            return [
                parseInt(n / 65536, 10) / 255,
                parseInt(n / 256, 10) / 255,
                parseInt(n % 256, 10) / 255, 1.0
            ];
        },
        _decodeDetectColor: function(color) {
            return Math.floor(color[0] * 65536) +
                Math.floor(color[1] * 256) +
                Math.floor(color[2]);
        },
        getSpriteByColor: function(color) {
            return this.reference[this._decodeDetectColor(color)];
        }
    });

    /**
     * @scope enchant.gl.Framebuffer.prototype
     */
    enchant.gl.FrameBuffer = enchant.Class.create({
        /**
         * WebGLのフレームバッファを管理するクラス.
         * @param {String} width フレームバッファの横幅
         * @param {String} height フレームバッファの縦幅
         * @constructs
         */
        initialize: function(width, height) {
            var core = enchant.Core.instance;
            if (typeof width === 'undefined') {
                width = core.width;
            }
            if (typeof height === 'undefined') {
                height = core.height;
            }
            this.framebuffer = gl.createFramebuffer();
            this.colorbuffer = gl.createRenderbuffer();
            this.depthbuffer = gl.createRenderbuffer();

            gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);

            gl.bindRenderbuffer(gl.RENDERBUFFER, this.colorbuffer);
            gl.renderbufferStorage(gl.RENDERBUFFER, gl.RGBA4, width, height);
            gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.RENDERBUFFER, this.colorbuffer);

            gl.bindRenderbuffer(gl.RENDERBUFFER, this.depthbuffer);
            gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, width, height);
            gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, this.depthbuffer);

            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
            gl.bindRenderbuffer(gl.RENDERBUFFER, null);
        },
        /**
         * フレームバッファをバインドする.
         */
        bind: function() {
            gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);
        },
        /**
         * フレームバッファをアンバインドする.
         */
        unbind: function() {
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        },
        /**
         * オブジェクトを破棄する.
         */
        destroy: function() {
            gl.deleteFramebuffer(this.framebuffer);
            gl.deleteFramebuffer(this.colorbuffer);
            gl.deleteFramebuffer(this.depthbuffer);
        }
    });

    /**
     * @scope enchant.gl.Shader.prototype
     */
    enchant.gl.Shader = enchant.Class.create({
        /**
         * WebGLのシェーダプログラムを管理するクラス.
         * バーテックスシェーダのソースとフラグメントシェーダのソースを渡すことでシェーダプログラムが作成される.
         * @param {String} vshader バーテックスシェーダのソース
         * @param {String} fshader フラグメントシェーダのソース
         * @constructs
         */
        initialize: function(vshader, fshader) {
            this._vShaderSource = '';
            this._fShaderSource = '';
            this._updatedVShaderSource = false;
            this._updatedFShaderSource = false;
            this._vShaderProgram = null;
            this._fShaderProgram = null;
            this._program = null;
            this._uniforms = {};
            this._attributes = {};
            this._attribLocs = {};
            this._samplersNum = 0;

            if (typeof vshader === 'string') {
                this.vShaderSource = vshader;
            }
            if (typeof fshader === 'string') {
                this.fShaderSource = fshader;
            }
            if (this._updatedVShaderSource && this._updatedFShaderSource) {
                this.compile();
            }
        },
        /**
         * バーテックスシェーダのソース
         * @type String
         */
        vShaderSource: {
            get: function() {
                return this._vShaderSource;
            },
            set: function(string) {
                this._vShaderSource = string;
                this._updatedVShaderSource = true;
            }
        },
        /**
         * フラグメントシェーダのソース
         * @type String
         */
        fShaderSource: {
            get: function() {
                return this._fShaderSource;
            },
            set: function(string) {
                this._fShaderSource = string;
                this._updatedFShaderSource = true;
            }
        },
        /**
         * シェーダプログラムをコンパイルする.
         * コンストラクタからシェーダソースを渡した場合は自動的にコンパイルされる.
         * @example
         * var shader = new Shader();
         * // シェーダプログラムのソースを渡す.
         * shader.vShaderSource = vert;
         * shader.fShaderSource = frag;
         * // コンパイル.
         * shader.compile();
         */
        compile: function() {
            if (this._updatedVShaderSource) {
                this._prepareVShader();
            }
            if (this._updatedFShaderSource) {
                this._prepareFShader();
            }
            if (this._program === null) {
                this._program = gl.createProgram();
            } else {
                gl.detachShader(this._program, this._vShaderProgram);
                gl.detachShader(this._program, this._fShaderProgram);
            }
            gl.attachShader(this._program, this._vShaderProgram);
            gl.attachShader(this._program, this._fShaderProgram);
            gl.linkProgram(this._program);
            if (!gl.getProgramParameter(this._program, gl.LINK_STATUS)) {
                this._logShadersInfo();
                throw 'could not compile shader';
            }
            this._getAttributesProperties();
            this._getUniformsProperties();
        },
        /**
         * シェーダプログラムを使用するように設定する.
         */
        use: function() {
            gl.useProgram(this._program);
        },
        /**
         * シェーダプログラムにattribute変数をセットする.
         * enchant.gl.Sprite3Dの内部などで使用される.
         * @param {*} 値
         * @example
         * var shader = new Shader(vert, frag);
         * shader.setAttributes({
         *     aVertexPosition: indices,
         *     aNormal: normals
         * });
         */
        setAttributes: function(params) {
            for (var prop in params) {
                if (params.hasOwnProperty(prop)) {
                    this._attributes[prop] = params[prop];
                }
            }
        },
        /**
         * シェーダプログラムにuniform変数をセットする.
         * enchant.gl.Sprite3Dの内部などで使用される.
         * @param {*} params 値
         * @example
         * var shader = new Shader(vert, frag);
         * shader.setUniforms({
         *     uDiffuse: diffuse,
         *     uLightColor: lightColor
         * });
         */
        setUniforms: function(params) {
            for (var prop in params) {
                if (params.hasOwnProperty(prop)) {
                    this._uniforms[prop] = params[prop];
                }
            }
        },
        _prepareVShader: function() {
            if (this._vShaderProgram === null) {
                this._vShaderProgram = gl.createShader(gl.VERTEX_SHADER);
            }
            gl.shaderSource(this._vShaderProgram, this._vShaderSource);
            gl.compileShader(this._vShaderProgram);
            this._updatedVShaderSource = false;
        },
        _prepareFShader: function() {
            if (this._fShaderProgram === null) {
                this._fShaderProgram = gl.createShader(gl.FRAGMENT_SHADER);
            }
            gl.shaderSource(this._fShaderProgram, this._fShaderSource);
            gl.compileShader(this._fShaderProgram);
            this._updatedFShaderSource = false;
        },
        _logShadersInfo: function() {
            window['console'].log(gl.getShaderInfoLog(this._vShaderProgram));
            window['console'].log(gl.getShaderInfoLog(this._fShaderProgram));
        },
        _getAttributesProperties: function() {
            var n;
            n = gl.getProgramParameter(this._program, gl.ACTIVE_ATTRIBUTES);
            for (var i = 0; i < n; i++) {
                var info = gl.getActiveAttrib(this._program, i);
                this._attribLocs[info.name] = i;
                addAttributesProperty(this, info);
            }
        },
        _getUniformsProperties: function() {
            var n;
            n = gl.getProgramParameter(this._program, gl.ACTIVE_UNIFORMS);
            for (var i = 0; i < n; i++) {
                var info = gl.getActiveUniform(this._program, i);
                addUniformsProperty(this, info);
            }
        },
        /**
         * オブジェクトを破棄する.
         */
        destroy: function() {
            gl.deleteProgram(this._vShaderProgram);
            gl.deleteProgram(this._fShaderProgram);
            gl.deleteProgram(this._program);
        }
    });

    var addAttributesProperty = function(program, info) {
        var name = info.name;
        var loc = program._attribLocs[name];
        /**
         * @type {Object}
         * @memberOf Object.
         */
        var desc = {
            get: function() {
                return 'attrib';
            },
            set: (function(loc) {
                return function(buf) {
                    gl.enableVertexAttribArray(loc);
                    buf._setToAttrib(loc);
                };
            }(loc))
        };
        Object.defineProperty(program._attributes, name, desc);
    };

    var addUniformsProperty = function(program, info) {
        var name = (info.name.slice(-3) === '[0]') ? info.name.slice(0, -3) : info.name;
        var loc = gl.getUniformLocation(program._program, info.name);
        var suffix;
        var sampler = false;
        var matrix = false;
        /**
         * @type {Object}
         */
        var desc = {
            get: function() {
                return 'uniform';
            }
        };
        switch (info.type) {
            case gl.FLOAT:
                suffix = '1f';
                break;

            case gl.FLOAT_MAT2:
                matrix = true;
                /* falls through */
            case gl.FLOAT_VEC2:
                suffix = '2fv';
                break;

            case gl.FLOAT_MAT3:
                matrix = true;
                /* falls through */
            case gl.FLOAT_VEC3:
                suffix = '3fv';
                break;

            case gl.FLOAT_MAT4:
                matrix = true;
                /* falls through */
            case gl.FLOAT_VEC4:
                suffix = '4fv';
                break;

            case gl.SAMPLER_2D:
            case gl.SAMPLER_CUBE:
                sampler = true;
                /* falls through */
            case gl.INT:
            case gl.BOOL:
                suffix = '1i';
                break;

            case gl.INT_VEC2:
            case gl.BOOL_VEC2:
                suffix = '2iv';
                break;

            case gl.INT_VEC3:
            case gl.BOOL_VEC3:
                suffix = '3iv';
                break;

            case gl.INT_VEC4:
            case gl.BOOL_VEC4:
                suffix = '4iv';
                break;
            default:
                throw new Error('no match');
        }
        if (matrix) {
            desc.set = (function(loc, suffix) {
                return function(value) {
                    gl['uniformMatrix' + suffix](loc, false, value);
                };
            }(loc, suffix));
        } else if (sampler) {
            desc.set = (function(loc, suffix, samplersNum) {
                return function(texture) {
                    gl.activeTexture(gl.TEXTURE0 + samplersNum);
                    gl.bindTexture(gl.TEXTURE_2D, texture._glTexture);
                    gl['uniform' + suffix](loc, samplersNum);
                };
            }(loc, suffix, program._samplersNum));
            program._samplersNum++;
        } else {
            desc.set = (function(loc, suffix) {
                return function(value) {
                    gl['uniform' + suffix](loc, value);
                };
            }(loc, suffix));
        }
        Object.defineProperty(program._uniforms, name, desc);
    };

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
            var s = Math.sin(rad / 2);
            var w = Math.cos(rad / 2);
            this._quat = quat4.create([x * s, y * s, z * s, w]);
        },

        /**
         * クォータニオン同士で球面線形補間を行う.
         * 自身ともう一つのクォータニオンの間の回転移動を補完したクォータニオンを計算する.
         * 回転の度合いは0から1の値で表される. 0が自身側, 1がもう一つ側.
         * 新しいインスタンスが返される.
         * @param {enchant.gl.Quat} another Quaternion
         * @param {Number} ratio
         * @return {enchant.gl.Quat}
         */
        slerp: function(another, ratio) {
            var q = new enchant.gl.Quat(0, 0, 0, 0);
            quat4.slerp(this._quat, another._quat, ratio, q._quat);
            return q;
        },
        /**
         * クォータニオン同士で球面線形補間を行う.
         * 自身ともう一つのクォータニオンの間の回転移動を補完したクォータニオンを計算する.
         * 回転の度合いは0から1の値で表される. 0が自身側, 1がもう一つ側.
         * 自身の値が上書きされる.
         * @param {enchant.gl.Quat} another Quaternion
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
        },
        /**
         * クォータニオンをベクトルに適用する.
         * @param {Number[]} vector
         * @return {Number[]}
         */
        multiplyVec3: function(vector) {
            quat4.multiplyVec3(this._quat, vector);
            return vector;
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
            get: function() {
                return this._color;
            }
        }
    });

    /**
     * @scope enchant.gl.AmbientLight.prototype
     */
    enchant.gl.AmbientLight = enchant.Class.create(enchant.gl.Light3D, {
        /**
         * 3Dシーンでの光源を設定するクラス.
         * 環境光を設定する.
         * @example
         *   var scene = new Scene3D();
         *   var light = new AmbientLight();
         *   light.color = [1.0, 1.0, 0.0];
         *   light.directionY = 10;
         *   scene.setAmbientLight(light);
         *
         * @constructs
         * @extends enchant.gl.Light3D
         */
        initialize: function() {
            enchant.gl.Light3D.call(this);
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
        initialize: function(src, opt) {
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
            this.shininess = 20;

            this._glTexture = null;
            this._image = null;
            this._wrap = 10497;
            this._mipmap = false;
            this._flipY = true;
            if (opt) {
                var valid = ['flipY', 'wrap', 'mipmap'];
                for (var prop in opt) {
                    if (opt.hasOwnProperty(prop)) {
                        if (valid.indexOf(prop) !== -1) {
                            this['_' + prop] = opt[prop];
                        }
                    }
                }
            }
            if (src) {
                this.src = src;
            }
        },

        _write: function() {
            gl.bindTexture(gl.TEXTURE_2D, this._glTexture);
            enchant.Core.instance.GL.textureManager._writeWebGLTexture(this._image, gl.TEXTURE_2D, this._wrap, this._mipmap);
            gl.bindTexture(gl.TEXTURE_2D, null);
        },

        /**
         * テクスチャ画像のソース.
         * URLかcore.assets内のデータを指定できる.
         * @type String
         * @type enchant.Surface
         */
        src: {
            get: function() {
                return this._src;
            },
            set: function(source) {
                if (typeof source === 'undefined' ||
                    source === null) {
                    return;
                }
                var that = this;
                var core = enchant.Core.instance;
                var onload = (function(that) {
                    return function() {
                        that._glTexture = core.GL.textureManager.getWebGLTexture(that._image, that._flipY, that._wrap, that._mipmap);
                    };
                }(that));
                if (source instanceof Image) {
                    this._image = source;
                    onload();
                } else if (source instanceof enchant.Surface) {
                    this._image = source._element;
                    onload();
                } else if (typeof source === 'string') {
                    this._image = new Image();
                    this._image.onload = onload;
                    this._image.src = source;
                } else {
                    this._image = source;
                    this._image.src = "c" + Math.random();
                    onload();
                }
            }
        }
    });

    /**
     * @scope enchant.gl.Buffer.prototype
     */
    enchant.gl.Buffer = enchant.Class.create({
        /**
         * 頂点などの配列情報を管理する.
         * enchant.gl.Meshのプロパティとして使用される.
         * @param {*} params parameter
         * @param {Number[]} array
         *
         * @example
         * var index = [ 0, 1, 2, 2, 3, 0 ];
         * var indices = new Buffer(Buffer.INDICES, index);
         *
         * @constructs
         */
        initialize: function(params, array) {
            this._setParams(params);
            if (typeof array !== 'undefined') {
                this._array = array;
            } else {
                this._array = [];
            }
            this._buffer = null;
        },
        /**
         * バッファをバインドする.
         */
        bind: function() {
            gl.bindBuffer(this.btype, this._buffer);
        },
        /**
         * バッファをアンバインドする.
         */
        unbind: function() {
            gl.bindBuffer(this.btype, null);
        },
        _setParams: function(params) {
            for (var prop in params) {
                if (params.hasOwnProperty(prop)) {
                    this[prop] = params[prop];
                }
            }
        },
        _create: function() {
            this._buffer = gl.createBuffer();
        },
        _delete: function() {
            gl.deleteBuffer(this._buffer);
        },
        _bufferData: function() {
            this.bind();
            gl.bufferData(this.btype, new this.Atype(this._array), gl.STATIC_DRAW);
            this.unbind();
        },
        _bufferDataFast: function() {
            this.bind();
            gl.bufferData(this.btype, this._array, gl.STATIC_DRAW);
            this.unbind();
        },
        _setToAttrib: function(loc) {
            this.bind();
            gl.vertexAttribPointer(loc, this.size, this.type, this.norm, this.stride, this.offset);
            this.unbind();
        },
        /**
         * オブジェクトを破棄する.
         */
        destroy: function() {
            this._delete();
        }
    });

    var bufferProto = Object.getPrototypeOf(enchant.gl.Buffer);
    bufferProto.VERTICES = bufferProto.NORMALS = {
        size: 3,
        type: 5126,
        norm: false,
        stride: 0,
        offset: 0,
        btype: 34962,
        Atype: Float32Array
    };
    bufferProto.TEXCOORDS = {
        size: 2,
        type: 5126,
        normed: false,
        stride: 0,
        ptr: 0,
        btype: 34962,
        Atype: Float32Array
    };
    bufferProto.COLORS = {
        size: 4,
        type: 5126,
        normed: false,
        stride: 0,
        ptr: 0,
        btype: 34962,
        Atype: Float32Array
    };
    bufferProto.INDICES = {
        size: 3,
        type: 5123,
        normed: false,
        stride: 0,
        offset: 0,
        btype: 34963,
        Atype: Uint16Array
    };

    /**
     * @scope enchant.gl.Mesh.prototype
     */
    enchant.gl.Mesh = enchant.Class.create({
        /**
         * 頂点配列やテクスチャを格納するクラス.
         * enchant.gl.Sprite3Dのプロパティとして使用される.
         * @constructs
         */
        initialize: function() {
            this.__count = 0;
            this._appear = false;
            this._vertices = new enchant.gl.Buffer(enchant.gl.Buffer.VERTICES);
            this._normals = new enchant.gl.Buffer(enchant.gl.Buffer.NORMALS);
            this._colors = new enchant.gl.Buffer(enchant.gl.Buffer.COLORS);
            this._texCoords = new enchant.gl.Buffer(enchant.gl.Buffer.TEXCOORDS);
            this._indices = new enchant.gl.Buffer(enchant.gl.Buffer.INDICES);
            this.texture = new enchant.gl.Texture();
        },
        /**
         * Meshの色を変更する.
         * Mesh.colorsを指定した色の頂点配列にする.
         * @param {Number[]|String} color z z軸方向の平行移動量
         * @example
         *   var sprite = new Sprite3D();
         *   //紫色に設定. どれも同じ結果が得られる.
         *   sprite.mesh.setBaseColor([1.0, 0.0, 1.0, 0.0]);
         *   sprite.mesh.setBaseColor('#ff00ff');
         *   sprite.mesh.setBaseColor('rgb(255, 0, 255');
         *   sprite.mesh.setBaseColor('rgba(255, 0, 255, 1.0');
         */
        setBaseColor: function(color) {
            var c = enchant.Core.instance.GL.parseColor(color);
            var newColors = [];
            for (var i = 0, l = this.vertices.length / 3; i < l; i++) {
                Array.prototype.push.apply(newColors, c);
            }
            this.colors = newColors;
        },
        /**
         * メッシュの面の向きと法線の向きを反転させる.
         */
        reverse: function() {
            var norm = this.normals;
            var idx = this.indices;
            var t, i, l;
            for (i = 0, l = norm.length; i < l; i++) {
                norm[i] *= -1;
            }
            for (i = 0, l = idx.length; i < l; i += 3) {
                t = idx[i + 1];
                idx[i + 1] = idx[i + 2];
                idx[i + 2] = t;
            }
            this._normals._bufferData();
            this._indices._bufferData();
        },
        _createBuffer: function() {
            for (var prop in this) {
                if (this.hasOwnProperty(prop)) {
                    if (this[prop] instanceof enchant.gl.Buffer) {
                        this[prop]._create();
                        this[prop]._bufferData();
                    }
                }
            }
        },
        _deleteBuffer: function() {
            for (var prop in this) {
                if (this.hasOwnProperty(prop)) {
                    if (this[prop] instanceof enchant.gl.Buffer) {
                        this[prop]._delete();
                    }
                }
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
        /**
         * @type {Number}
         */
        _count: {
            get: function() {
                return this.__count;
            },
            set: function(c) {
                this.__count = c;
                this._controlBuffer();
            }
        },
        _join: function(another, ox, oy, oz) {
            var triangles = this.vertices.length / 3,
                vertices = this.vertices.slice(0),
                i, l;
            for (i = 0, l = another.vertices.length; i < l; i += 3) {
                vertices.push(another.vertices[i] + ox);
                vertices.push(another.vertices[i + 1] + oy);
                vertices.push(another.vertices[i + 2] + oz);
            }
            this.vertices = vertices;
            this.normals = this.normals.concat(another.normals);
            this.texCoords = this.texCoords.concat(another.texCoords);
            this.colors = this.colors.concat(another.colors);
            var indices = this.indices.slice(0);
            for (i = 0, l = another.indices.length; i < l; i++) {
                indices.push(another.indices[i] + triangles);
            }
            this.indices = indices;
        },
        /**
         * オブジェクトを破棄する.
         */
        destroy: function() {
            this._deleteBuffer();
        }
    });

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
    enchant.gl.Mesh.prototype.vertices = [];

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
    enchant.gl.Mesh.prototype.normals = [];

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
    enchant.gl.Mesh.prototype.texCoords = [];

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
    enchant.gl.Mesh.prototype.indices = [];

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
    enchant.gl.Mesh.prototype.colors = [];

    'vertices normals colors texCoords indices'.split(' ').forEach(function(prop) {
        Object.defineProperty(enchant.gl.Mesh.prototype, prop, {
            get: function() {
                return this['_' + prop]._array;
            },
            set: function(array) {
                this['_' + prop]._array = array;
                if (this._appear) {
                    this['_' + prop]._bufferData();
                }
            }
        });
    });

    /**
     * @scope enchant.gl.Sprite3D.prototype
     */
    enchant.gl.Sprite3D = enchant.Class.create(enchant.EventTarget, {
        /**
         * Sprite3D表示機能を持ったクラス.
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
            this._mesh = null;

            this.program = null;

            this.bounding = new enchant.gl.collision.BS();
            this.bounding.parent = this;

            this.age = 0;

            this._x = 0;
            this._y = 0;
            this._z = 0;
            this._scaleX = 1;
            this._scaleY = 1;
            this._scaleZ = 1;
            this._changedTranslation = true;
            this._changedRotation = true;
            this._changedScale = true;
            this._touchable = true;

            this._global = vec3.create();
            this.globalX = 0;
            this.globalY = 0;
            this.globalZ = 0;

            this._matrix = mat4.identity();
            this.tmpMat = mat4.identity();
            this.modelMat = mat4.identity();
            this._rotation = mat4.identity();
            this._normMat = mat3.identity();

            var core = enchant.Core.instance;
            this.detectColor = core.GL.detectColorManager.attachDetectColor(this);

            var parentEvent = function(e) {
                if (this.parentNode instanceof enchant.gl.Sprite3D) {
                    this.parentNode.dispatchEvent(e);
                }
            };
            this.addEventListener('touchstart', parentEvent);
            this.addEventListener('touchmove', parentEvent);
            this.addEventListener('touchend', parentEvent);

            var added = function(e) {
                if (this.mesh !== null) {
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
                if (this.mesh !== null) {
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
            var clone = new enchant.gl.Sprite3D();
            for (var prop in this) {
                if (typeof this[prop] === 'number' ||
                    typeof this[prop] === 'string') {
                    clone[prop] = this[prop];
                } else if (this[prop] instanceof WebGLBuffer) {
                    clone[prop] = this[prop];
                } else if (this[prop] instanceof Float32Array) {
                    clone[prop] = new Float32Array(this[prop]);
                } else if (this[prop] instanceof Array &&
                    prop !== 'childNodes' &&
                    prop !== 'detectColor') {
                    clone[prop] = this[prop].slice(0);
                }
            }
            if (this.mesh !== null) {
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
         * 他のSprite3Dの状態をセットする.
         * Colladaファイルを読み込んだassetsに対して使用できる.
         * @example
         *   var sp = new Sprite3D();
         *   sp.set(core.assets['sample.dae']);
         *   //sample.daeのモデル情報を持ったSprite3Dになる
         */
        set: function(sprite) {
            for (var prop in sprite) {
                if (typeof sprite[prop] === 'number' ||
                    typeof sprite[prop] === 'string') {
                    this[prop] = sprite[prop];
                } else if (sprite[prop] instanceof WebGLBuffer) {
                    this[prop] = sprite[prop];
                } else if (sprite[prop] instanceof Float32Array) {
                    this[prop] = new Float32Array(sprite[prop]);
                } else if (sprite[prop] instanceof Array &&
                    prop !== 'childNodes' &&
                    prop !== 'detectColor') {
                    this[prop] = sprite[prop].slice(0);
                }
            }
            if (sprite.mesh !== null) {
                this.mesh = sprite.mesh;
            }
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
            if ((i = this.childNodes.indexOf(sprite)) !== -1) {
                this.childNodes.splice(i, 1);
                sprite.parentNode = null;
                sprite.dispatchEvent(new enchant.Event('removed'));
                if (this.scene) {
                    sprite.scene = null;
                    sprite.dispatchEvent(new enchant.Event('removedfromscene'));
                }
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
         * Sprite3DをローカルのZ軸方向に動かす.
         * @param {Number} speed
         */
        forward: function(speed) {
            var x = this._rotation[8] * speed;
            var y = this._rotation[9] * speed;
            var z = this._rotation[10] * speed;
            this.translate(x, y, z);
        },

        /**
         * Sprite3DをローカルのX軸方向に動かす.
         * @param {Number} speed
         */
        sidestep: function(speed) {
            var x = this._rotation[0] * speed;
            var y = this._rotation[1] * speed;
            var z = this._rotation[2] * speed;
            this.translate(x, y, z);
        },

        /**
         * Sprite3DをローカルのY軸方向に動かす.
         * @param {Number} speed
         */
        altitude: function(speed) {
            var x = this._rotation[4] * speed;
            var y = this._rotation[5] * speed;
            var z = this._rotation[6] * speed;
            this.translate(x, y, z);
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
                this._changedRotation = true;
            }
        },

        /**
         * 回転行列にクォータニオンから得られる回転行列をセットする.
         * @param {enchant.gl.Quat} quat
         */
        rotationSet: function(quat) {
            quat.toMat4(this._rotation);
            this._changedRotation = true;
        },

        /**
         * 回転行列にクォータニオンから得られる回転行列を適用する.
         * @param {enchant.gl.Quat} quat
         */
        rotationApply: function(quat) {
            quat.toMat4(this.tmpMat);
            mat4.multiply(this._rotation, this.tmpMat);
            this._changedRotation = true;
        },

        /**
         * Sprite3DのローカルのZ軸を軸に回転させる.
         * @param {Number} radius
         */
        rotateRoll: function(rad) {
            this.rotationApply(new enchant.gl.Quat(0, 0, 1, rad));
            this._changedRotation = true;
        },

        /**
         * Sprite3DのローカルのX軸を軸に回転させる.
         * @param {Number} radius
         */
        rotatePitch: function(rad) {
            this.rotationApply(new enchant.gl.Quat(1, 0, 0, rad));
            this._changedRotation = true;
        },

        /**
         * Sprite3DのローカルのY軸を軸に回転させる.
         * @param {Number} radius
         */
        rotateYaw: function(rad) {
            this.rotationApply(new enchant.gl.Quat(0, 1, 0, rad));
            this._changedRotation = true;
        },

        /**
         * @type {enchant.gl.Mesh}
         */
        mesh: {
            get: function() {
                return this._mesh;
            },
            set: function(mesh) {
                if (this.scene !== null) {
                    this._mesh._count -= 1;
                    mesh._count += 1;
                }
                this._mesh = mesh;
            }
        },

        /**
         * Sprite3Dに適用する変換行列.
         * @deprecated
         * @type Number[]
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
         * Sprite3Dの当たり判定に利用されるオブジェクト.
         * @type enchant.gl.Bounding | enchant.gl.BS | enchant.gl.AABB
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
         * Sprite3Dをタッチ可能にするか決定する.
         * falseに設定するとタッチ判定の際無視される.
         * @type bool
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

        _transform: function(baseMatrix) {
            if (this._changedTranslation ||
                this._changedRotation ||
                this._changedScale) {
                mat4.identity(this.modelMat);
                mat4.translate(this.modelMat, [this._x, this._y, this._z]);
                mat4.multiply(this.modelMat, this._rotation, this.modelMat);
                mat4.scale(this.modelMat, [this._scaleX, this._scaleY, this._scaleZ]);
                mat4.multiply(this.modelMat, this._matrix, this.modelMat);
                this._changedTranslation = false;
                this._changedRotation = false;
                this._changedScale = false;
            }

            mat4.multiply(baseMatrix, this.modelMat, this.tmpMat);

            this._global[0] = this._x;
            this._global[1] = this._y;
            this._global[2] = this._z;
            mat4.multiplyVec3(this.tmpMat, this._global);
            this.globalX = this._global[0];
            this.globalY = this._global[1];
            this.globalZ = this._global[2];
        },

        _render: function(detectTouch) {
            var useTexture = this.mesh.texture._image ? 1.0 : 0.0;

            mat4.toInverseMat3(this.tmpMat, this._normMat);
            mat3.transpose(this._normMat);

            var attributes = {
                aVertexPosition: this.mesh._vertices,
                aVertexColor: this.mesh._colors,
                aNormal: this.mesh._normals,
                aTextureCoord: this.mesh._texCoords
            };

            var uniforms = {
                uModelMat: this.tmpMat,
                uDetectColor: this.detectColor,
                uSpecular: this.mesh.texture.specular,
                uDiffuse: this.mesh.texture.diffuse,
                uEmission: this.mesh.texture.emission,
                uAmbient: this.mesh.texture.ambient,
                uShininess: this.mesh.texture.shininess,
                uNormMat: this._normMat,
                uSampler: this.mesh.texture,
                uUseTexture: useTexture
            };

            var length = this.mesh.indices.length;
            enchant.Core.instance.GL.renderElements(this.mesh._indices, 0, length, attributes, uniforms);
        },

        _draw: function(scene, detectTouch, baseMatrix) {

            this._transform(baseMatrix);

            if (this.childNodes.length) {
                for (var i = 0, l = this.childNodes.length; i < l; i++) {
                    this.childNodes[i]._draw(scene, detectTouch, this.tmpMat);
                }
            }

            this.dispatchEvent(new enchant.Event('prerender'));

            if (this.mesh !== null) {
                if (this.program !== null) {
                    enchant.Core.instance.GL.setProgram(this.program);
                    this._render(detectTouch);
                    enchant.Core.instance.GL.setDefaultProgram();
                } else {
                    this._render(detectTouch);
                }
            }

            this.dispatchEvent(new enchant.Event('render'));
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
     * Sprite3Dのグローバルのx座標.
     * @default 0
     * @type Number
     * @see enchant.gl.Sprite3D#translate
     */
    enchant.gl.Sprite3D.prototype.globalX = 0;

    /**
     * Sprite3Dのグローバルのy座標.
     * @default 0
     * @type Number
     * @see enchant.gl.Sprite3D#translate
     */
    enchant.gl.Sprite3D.prototype.globalY = 0;

    /**
     * Sprite3Dのグローバルのz座標.
     * @default 0
     * @type Number
     * @see enchant.gl.Sprite3D#translate
     */
    enchant.gl.Sprite3D.prototype.globalZ = 0;

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
            var core = enchant.Core.instance;
            this.mat = mat4.identity();
            this.invMat = mat4.identity();
            this.invMatY = mat4.identity();
            this._projMat = mat4.create();
            mat4.perspective(20, core.width / core.height, 1.0, 1000.0, this._projMat);
            this._changedPosition = false;
            this._changedCenter = false;
            this._changedUpVector = false;
            this._changedProjection = false;
            this._x = 0;
            this._y = 0;
            this._z = 10;
            this._centerX = 0;
            this._centerY = 0;
            this._centerZ = 0;
            this._upVectorX = 0;
            this._upVectorY = 1;
            this._upVectorZ = 0;
        },
        /**
         * projection matrix
         */
        projMat: {
            get: function() {
                return this._projMat;
            },
            set: function(mat) {
                this._projMat = mat;
                this._changedProjection = true;
            }
        },
        /**
         * カメラの注視点をSprite3Dの位置に合わせる.
         * @param {enchant.gl.Sprite3D} sprite 注視するSprite3D
         */
        lookAt: function(sprite) {
            if (sprite instanceof enchant.gl.Sprite3D) {
                this._centerX = sprite.x;
                this._centerY = sprite.y;
                this._centerZ = sprite.z;
                this._changedCenter = true;
            }
        },
        /**
         * カメラの位置をSprite3Dに近づける.
         * @param {enchant.gl.Sprite3D} sprite 対象のSprite3D
         * @param {Number} position 対象との距離
         * @param {Number} speed 対象に近づく速度
         * @example
         * var sp = new Sprite3D();
         * var camera = new Camera3D();
         * // spを注視しながら後ろ10にカメラの位置を近づけ続ける.
         * sp.addEventListener('enterframe', function() {
         *     camera.lookAt(sp);
         *     camera.chase(sp, -10, 20);
         * });
         */
        chase: function(sprite, position, speed) {
            if (sprite instanceof enchant.gl.Sprite3D) {
                var vx = sprite.x + sprite.rotation[8] * position;
                var vy = sprite.y + sprite.rotation[9] * position;
                var vz = sprite.z + sprite.rotation[10] * position;
                this._x += (vx - this._x) / speed;
                this._y += (vy - this._y) / speed;
                this._z += (vz - this._z) / speed;
                this._changedPosition = true;
            }
        },
        _getForwardVec: function() {
            var x = this._centerX - this._x;
            var y = this._centerY - this._y;
            var z = this._centerZ - this._z;
            return vec3.normalize([x, y, z]);
        },
        _getSideVec: function() {
            var f = this._getForwardVec();
            var u = this._getUpVec();
            return vec3.cross(u, f);
        },
        _getUpVec: function() {
            var x = this._upVectorX;
            var y = this._upVectorY;
            var z = this._upVectorZ;
            return [x, y, z];
        },
        _move: function(v, s) {
            v[0] *= s;
            v[1] *= s;
            v[2] *= s;
            this._x += v[0];
            this._y += v[1];
            this._z += v[2];
            this._centerX += v[0];
            this._centerY += v[1];
            this._centerZ += v[2];
        },
        /**
         * Camera3DをローカルのZ軸方向に動かす.
         * @param {Number} speed
         */
        forward: function(s) {
            var v = this._getForwardVec();
            this._move(v, s);
        },
        /**
         * Camera3DをローカルのX軸方向に動かす.
         * @param {Number} speed
         */
        sidestep: function(s) {
            var v = this._getSideVec();
            this._move(v, s);
        },
        /**
         * Camera3DをローカルのY軸方向に動かす.
         * @param {Number} speed
         */
        altitude: function(s) {
            var v = this._getUpVec();
            this._move(v, s);
        },
        /**
         * Camera3DのローカルのZ軸を軸に回転させる.
         * @param {Number} radius
         */
        rotateRoll: function(rad) {
            var u = this._getUpVec();
            var f = this._getForwardVec();
            var x = f[0];
            var y = f[1];
            var z = f[2];
            var quat = new enchant.gl.Quat(x, y, z, -rad);
            var vec = quat.multiplyVec3(u);
            this._upVectorX = vec[0];
            this._upVectorY = vec[1];
            this._upVectorZ = vec[2];
            this._changedUpVector = true;
        },
        /**
         * Camera3DのローカルのX軸を軸に回転させる.
         * @param {Number} radius
         */
        rotatePitch: function(rad) {
            var u = this._getUpVec();
            var f = this._getForwardVec();
            var s = this._getSideVec();
            var sx = s[0];
            var sy = s[1];
            var sz = s[2];
            var quat = new enchant.gl.Quat(sx, sy, sz, -rad);
            var vec = quat.multiplyVec3(f);
            this._centerX = this._x + vec[0];
            this._centerY = this._y + vec[1];
            this._centerZ = this._z + vec[2];
            vec = vec3.normalize(quat.multiplyVec3(u));
            this._upVectorX = vec[0];
            this._upVectorY = vec[1];
            this._upVectorZ = vec[2];
            this._changedCenter = true;
            this._changedUpVector = true;
        },
        /**
         * Camera3DのローカルのY軸を軸に回転させる.
         * @param {Number} radius
         */
        rotateYaw: function(rad) {
            var u = this._getUpVec();
            var ux = u[0];
            var uy = u[1];
            var uz = u[2];
            var f = this._getForwardVec();
            var quat = new enchant.gl.Quat(ux, uy, uz, -rad);
            var vec = quat.multiplyVec3(f);
            this._centerX = this._x + vec[0];
            this._centerY = this._y + vec[1];
            this._centerZ = this._z + vec[2];
            this._changedCenter = true;
        },
        _updateMatrix: function() {
            mat4.lookAt(
                [this._x, this._y, this._z],
                [this._centerX, this._centerY, this._centerZ],
                [this._upVectorX, this._upVectorY, this._upVectorZ],
                this.mat);
            mat4.lookAt(
                [0, 0, 0],
                [-this._x + this._centerX,
                    -this._y + this._centerY,
                    -this._z + this._centerZ],
                [this._upVectorX, this._upVectorY, this._upVectorZ],
                this.invMat);
            mat4.inverse(this.invMat);
            mat4.lookAt(
                [0, 0, 0],
                [-this._x + this._centerX,
                    0,
                    -this._z + this._centerZ],
                [this._upVectorX, this._upVectorY, this._upVectorZ],
                this.invMatY);
            mat4.inverse(this.invMatY);
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
            var core = enchant.Core.instance;
            if (core.currentScene3D) {
                return core.currentScene3D;
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

            this.identityMat = mat4.identity();
            this._backgroundColor = [0.0, 0.0, 0.0, 1.0];

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
            core.addEventListener('enterframe', func);


            var uniforms = {};
            uniforms['uUseCamera'] = 0.0;
            gl.activeTexture(gl.TEXTURE0);
            core.GL.defaultProgram.setUniforms(uniforms);

            if (core.currentScene3D === null) {
                core.currentScene3D = this;
            }

            this.setAmbientLight(new enchant.gl.AmbientLight());
            this.setDirectionalLight(new enchant.gl.DirectionalLight());
            this.setCamera(new enchant.gl.Camera3D());
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
                var c = enchant.Core.instance.GL.parseColor(arg);
                this._backgroundColor = c;
                gl.clearColor(c[0], c[1], c[2], c[3]);

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
            if ((i = this.childNodes.indexOf(sprite)) !== -1) {
                this.childNodes.splice(i, 1);
                sprite.parentNode = sprite.scene = null;
                sprite.dispatchEvent(new enchant.Event('removed'));
                sprite.dispatchEvent(new enchant.Event('removedfromscene'));
            }
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
            camera._changedProjection = true;
            this._camera = camera;
            enchant.Core.instance.GL.defaultProgram.setUniforms({
                uUseCamera: 1.0
            });
        },

        /**
         * シーンに設定されているカメラを取得する.
         * @see enchant.gl.Camera3D
         * @return {enchant.gl.Camera}
         */
        getCamera: function() {
            return this._camera;
        },

        /**
         * シーンに環境光源を設定する.
         * @param {enchant.gl.AmbientLight} light 設定する照明
         * @see enchant.gl.AmbientLight
         */
        setAmbientLight: function(light) {
            this.ambientLight = light;
        },

        /**
         * シーンに設定されている環境光源を取得する.
         * @see enchant.gl.AmbientLight
         * @return {enchant.gl.AmbientLight}
         */
        getAmbientLight: function() {
            return this.ambientLight;
        },

        /**
         * シーンに平行光源を設定する.
         * @param {enchant.gl.DirectionalLight} light 設定する照明
         * @see enchant.gl.DirectionalLight
         */
        setDirectionalLight: function(light) {
            this.directionalLight = light;
            this.useDirectionalLight = true;
            enchant.Core.instance.GL.defaultProgram.setUniforms({
                uUseDirectionalLight: 1.0
            });
        },

        /**
         * シーンに設定されている平行光源を取得する.
         * @see enchant.gl.DirectionalLight
         * @return {enchant.gl.DirectionalLight}
         */
        getDirectionalLight: function() {
            return this.directionalLight;
        },

        /**
         * シーンに照明を追加する.
         * 現在, シーンに追加しても適用されない.
         * @param {enchant.gl.PointLight} light 追加する照明
         * @see enchant.gl.PointLight
         */
        addLight: function(light) {
            this.lights.push(light);
            this.usePointLight = true;
        },

        /**
         * シーンから照明を削除する
         * @param {enchant.gl.PointLight} light 削除する照明
         * @see enchant.gl.PointLight.
         */
        removeLight: function(light) {
            var i;
            if ((i = this.lights.indexOf(light)) !== -1) {
                this.lights.splice(i, 1);
            }
        },

        _draw: function(detectTouch) {
            var core = enchant.Core.instance;
            var program = core.GL.defaultProgram;

            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

            var detect = (detectTouch === 'detect') ? 1.0 : 0.0;

            var uniforms = { uDetectTouch: detect };

            if (this.ambientLight._changedColor) {
                uniforms['uAmbientLightColor'] = this.ambientLight.color;
                this.ambientLight._changedColor = false;
            }
            if (this.useDirectionalLight) {
                if (this.directionalLight._changedDirection) {
                    uniforms['uLightDirection'] = [
                        this.directionalLight.directionX,
                        this.directionalLight.directionY,
                        this.directionalLight.directionZ
                    ];
                    this.directionalLight._changedDirection = false;
                }
                if (this.directionalLight._changedColor) {
                    uniforms['uLightColor'] = this.directionalLight.color;
                    this.directionalLight._changedColor = false;
                }
            }

            if (this._camera) {
                if (this._camera._changedPosition ||
                    this._camera._changedCenter ||
                    this._camera._changedUpVector ||
                    this._camera._changedProjection) {
                    this._camera._updateMatrix();
                    uniforms['uCameraMat'] = this._camera.mat;
                    uniforms['uProjMat'] = this._camera._projMat;
                    uniforms['uLookVec'] = [
                        this._camera._centerX - this._camera._x,
                        this._camera._centerY - this._camera._y,
                        this._camera._centerZ - this._camera._z
                    ];
                    this._camera._changedPosition = false;
                    this._camera._changedCenter = false;
                    this._camera._changedUpVector = false;
                    this._camera._changedProjection = false;
                }
            }
            program.setUniforms(uniforms);

            mat4.identity(this.identityMat);
            for (var i = 0, l = this.childNodes.length; i < l; i++) {
                this.childNodes[i]._draw(this, detectTouch, this.identityMat);
            }

        }
    });

    /**
     * @type {Object}
     */
    enchant.gl.collision = {};

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
        return ((nx2 <= px1) && (nx1 <= px2) &&
            (ny2 <= py1) && (ny1 <= py2) &&
            (nz2 <= pz1) && (nz1 <= pz2)) ? 0.0 : 1.0;
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

    // borrowed from MMD.js
    var bezierp = function(x1, x2, y1, y2, x) {
        var t, tt, v;
        t = x;
        while (true) {
            v = ipfunc(t, x1, x2) - x;
            if (v * v < 0.0000001) {
                break;
            }
            tt = ipfuncd(t, x1, x2);
            if (tt === 0) {
                break;
            }
            t -= v / tt;
        }
        return ipfunc(t, y1, y2);
    };
    var ipfunc = function(t, p1, p2) {
        return (1 + 3 * p1 - 3 * p2) * t * t * t + (3 * p2 - 6 * p1) * t * t + 3 * p1 * t;
    };
    var ipfuncd = function(t, p1, p2) {
        return (3 + 9 * p1 - 9 * p2) * t * t + (6 * p2 - 12 * p1) * t + 3 * p1;
    };
    var frac = function(n1, n2, t) {
        return (t - n1) / (n2 - n1);
    };
    var lerp = function(n1, n2, r) {
        return n1 + r * (n2 - n1);
    };

    var _tmpve = vec3.create();
    var _tmpvt = vec3.create();
    var _tmpaxis = vec3.create();
    var _tmpquat = quat4.create();
    var _tmpinv = quat4.create();

    /**
     * @scope enchant.gl.State.prototype
     */
    enchant.gl.State = enchant.Class.create({
        /**
         * アニメーションの状態を表すための基底クラス.
         * @param {Number[]} position
         * @param {Number[]} rotation
         * @constructs
         */
        initialize: function(position, rotation) {
            this._position = vec3.create();
            vec3.set(position, this._position);
            this._rotation = quat4.create();
            quat4.set(rotation, this._rotation);
        },
        /**
         * 位置・回転をセットする.
         */
        set: function(pose) {
            vec3.set(pose._position, this._position);
            quat4.set(pose._rotation, this._rotation);
        }
    });

    /**
     * @scope enchant.gl.Pose.prototype
     */
    enchant.gl.Pose = enchant.Class.create(enchant.gl.State, {
        /**
         * 姿勢を処理するためのクラス.
         * @param {Number[]} position
         * @param {Number[]} rotation
         * @constructs
         * @extends enchant.gl.State
         */
        initialize: function(position, rotation) {
            enchant.gl.State.call(this, position, rotation);
        },
        /**
         * 他の姿勢との補間を行う.
         * @param {enchant.gl.Pose} another
         * @param {Number} ratio
         * @return {enchant.gl.Pose}
         */
        getInterpolation: function(another, ratio) {
            vec3.lerp(this._position, another._position, ratio, _tmpve);
            quat4.slerp(this._rotation, another._rotation, ratio, _tmpquat);
            return new enchant.gl.Pose(_tmpve, _tmpquat);
        },
        _bezierp: function(x1, y1, x2, y2, x) {
            return bezierp(x1, x2, y1, y2, x);
        }
    });

    /**
     * @scope enchant.gl.KeyFrameManager.prototype
     */
    enchant.gl.KeyFrameManager = enchant.Class.create({
        /**
         * キーフレームアニメーションを実現するためのクラス.
         * enchant.gl.Poseに限らず様々なデータを扱える.
         * @constructs
         */
        initialize: function() {
            this._frames = [];
            this._units = [];
            this.length = -1;
            this._lastPose = null;
        },
        /**
         * フレームを追加する.
         * @param {*} pose キーフレーム.
         * @param {Number} frame フレーム番号.
         */
        addFrame: function(pose, frame) {
            if (typeof frame !== 'number') {
                this.length += 1;
                frame = this.length;
            }
            if (frame > this.length) {
                this.length = frame;
                this._lastPose = pose;
            }
            this._frames.push(frame);
            this._units[frame] = pose;
        },
        /**
         * 指定されたフレーム番号の情報を返す.
         * 指定されたフレーム番号に該当するデータがない場合, 指定されたフレーム番号の前後のデータから補間したデータを取得する.
         * @param {Number} frame フレーム番号
         * @return {*}
         */
        getFrame: function(frame) {
            var prev, next, index, pidx, nidx;
            var ratio = 0;
            if (frame >= this.length) {
                return this._lastPose;
            }
            if (this._units[frame]) {
                return this._units[frame];
            } else {
                index = this._getPrevFrameIndex(frame);
                pidx = this._frames[index];
                nidx = this._frames[index + 1];
                prev = this._units[pidx];
                next = this._units[nidx];
                ratio = this._frac(pidx, nidx, frame);
                return this._interpole(prev, next, ratio);
            }
        },
        bake: function() {
            var state;
            for (var i = 0, l = this.length; i < l; i++) {
                if (this._units[i]) {
                    continue;
                }
                state = this.getFrame(i);
                this.addFrame(state, i);
            }
            this._sort();
        },
        _frac: function(p, n, t) {
            return frac(p, n, t);
        },
        _interpole: function(prev, next, ratio) {
            return prev.getInterpolation(next, ratio);
        },
        _sort: function() {
            this._frames.sort(function(a, b) {
                return a - b;
            });
        },
        _getPrevFrameIndex: function(frame) {
            for (var i = 0, l = this._frames.length; i < l; i++) {
                if (this._frames[i] > frame) {
                    break;
                }
            }
            return i - 1;
        }
    });

    /**
     * @scope enchant.gl.Bone.prototype
     */
    enchant.gl.Bone = enchant.Class.create(enchant.gl.State, {
        /**
         * ボーンの状態を表すクラス.
         * @param {String} name
         * @param {Number} head
         * @param {Number} position
         * @param {Number} rotation
         * @constructs
         * @extends enchant.gl.State
         */
        initialize: function(name, head, position, rotation) {
            enchant.gl.State.call(this, position, rotation);
            this._name = name;
            this._origin = vec3.create();

            vec3.set(head, this._origin);

            this._globalpos = vec3.create();
            vec3.set(head, this._globalpos);

            this._globalrot = quat4.identity();

            this.parentNode = null;
            this.childNodes = [];

            /**
             * IK解決の際にクォータニオンに変換をかける関数を設定する.
             */
            this.constraint = null;
        },
        /**
         * ボーンに子のボーンを追加する.
         * @param {enchant.gl.Bone} child
         */
        addChild: function(child) {
            this.childNodes.push(child);
            child.parentNode = this;
        },
        /**
         * ボーンから子のボーンを削除する.
         * @param {enchant.gl.Bone} child
         */
        removeChild: function(child) {
            var i;
            if ((i = this.childNodes.indexOf(child)) !== -1) {
                this.childNodes.splice(i, 1);
            }
            child.parentNode = null;
        },
        /**
         * ボーンの姿勢をセットする.
         * @param {*} poses
         */
        setPoses: function(poses) {
            var child;
            if (poses[this._name]) {
                this.set(poses[this._name]);
            }
            for (var i = 0, l = this.childNodes.length; i < l; i++) {
                child = this.childNodes[i];
                child.setPoses(poses);
            }
        },
        _applyPose: function(){
            var parent = this.parentNode;
            quat4.multiply(parent._globalrot, this._rotation, this._globalrot);
            quat4.multiplyVec3(parent._globalrot, this._position, this._globalpos);
            vec3.add(parent._globalpos, this._globalpos, this._globalpos);
        },
        _solveFK: function() {
            var child;
            this._applyPose();
            for (var i = 0, l = this.childNodes.length; i < l; i++) {
                child = this.childNodes[i];
                child._solveFK();
            }
        },
        _solve: function(quat) {
            quat4.normalize(quat, this._rotation);
            this._solveFK();
        }
    });

    /**
     * @scope enchant.gl.Skeleton.prototype
     */
    enchant.gl.Skeleton = enchant.Class.create({
        /**
         * ボーンの構造のルートになるクラス.
         * @constructs
         */
        initialize: function() {
            this.childNodes = [];
            this._origin = vec3.create();
            this._position = vec3.create();
            this._rotation = quat4.identity();
            this._globalpos = vec3.create();
            this._globalrot = quat4.identity();
            this._iks = [];
        },
        /**
         * Skeletonに子のボーンを追加する.
         * @param {enchant.gl.Bone} child
         */
        addChild: function(bone) {
            this.childNodes.push(bone);
            bone.parentNode = this;
        },
        /**
         * Skeletonから子のボーンを削除する.
         * @param {enchant.gl.Bone} child
         */
        removeChild: function(bone) {
            var i;
            if ((i = this.childNodes.indexOf(bone)) !== -1) {
                this.childNodes.splice(i, 1);
            }
            bone.parentNode = null;
        },
        /**
         * 姿勢をセットする.
         * @param {*} poses
         */
        setPoses: function(poses) {
            var child;
            for (var i = 0, l = this.childNodes.length; i < l; i++) {
                child = this.childNodes[i];
                child.setPoses(poses);
            }
        },
        /**
         * FKによって姿勢解決を行う.
         * セットされた姿勢情報から姿勢をつくる.
         */
        solveFKs: function() {
            var child;
            for (var i = 0, l = this.childNodes.length; i < l; i++) {
                child = this.childNodes[i];
                child._solveFK();
            }
        },
        /**
         * IKの制御情報を追加する.
         * @param {enchant.gl.Bone} effector
         * @param {enchant.gl.Bone} target
         * @param {enchant.gl.Bone[]} bones
         * @param {Number} maxangle
         * @param {Number} iteration
         * @see enchant.gl.Skeleton#solveIKs
         */
        addIKControl: function(effector, target, bones, maxangle, iteration) {
            this._iks.push(arguments);
        },
        // by ccd
        /**
         * IKによって姿勢解決を行う.
         * {@link enchant.gl.Skeleton#addIKControl}によって追加された情報をもとにする.
         */
        solveIKs: function() {
            var param;
            for (var i = 0, l = this._iks.length; i < l; i++) {
                param = this._iks[i];
                this._solveIK.apply(this, param);
            }
        },
        _solveIK: function(effector, target, bones, maxangle, iteration) {
            var len, origin;
            vec3.subtract(target._origin, target.parentNode._origin, _tmpinv);
            var threshold = vec3.length(_tmpinv) * 0.1;
            for (var i = 0; i < iteration; i++) {
                vec3.subtract(target._globalpos, effector._globalpos, _tmpinv);
                len = vec3.length(_tmpinv);
                if (len < threshold) {
                    break;
                }
                for (var j = 0, ll = bones.length; j < ll; j++) {
                    origin = bones[j];
                    this._ccd(effector, target, origin, maxangle, threshold);
                }
            }
        },
        _ccd: function(effector, target, origin, maxangle, threshold) {
            vec3.subtract(effector._globalpos, origin._globalpos, _tmpve);
            vec3.subtract(target._globalpos, origin._globalpos, _tmpvt);
            vec3.cross(_tmpvt, _tmpve, _tmpaxis);
            var elen = vec3.length(_tmpve);
            var tlen = vec3.length(_tmpvt);
            var alen = vec3.length(_tmpaxis);

            if (elen < threshold || tlen < threshold || alen < threshold) {
                return;
            }
            var rad = Math.acos(vec3.dot(_tmpve, _tmpvt) / elen / tlen);

            if (rad > maxangle) {
                rad = maxangle;
            }
            vec3.scale(_tmpaxis, Math.sin(rad / 2) / alen, _tmpquat);
            _tmpquat[3] = Math.cos(rad / 2);
            quat4.inverse(origin.parentNode._globalrot, _tmpinv);
            quat4.multiply(_tmpinv, _tmpquat, _tmpquat);
            quat4.multiply(_tmpquat, origin._globalrot, _tmpquat);


            if (origin.constraint) {
                origin.constraint(_tmpquat);
            }

            origin._solve(_tmpquat);
        }
    });

    var DEFAULT_VERTEX_SHADER_SOURCE = '\n\
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

    var DEFAULT_FRAGMENT_SHADER_SOURCE = '\n\
    precision highp float;\n\
    \n\
    uniform sampler2D uSampler;\n\
    uniform float uUseDirectionalLight;\n\
    uniform vec3 uAmbientLightColor;\n\
    uniform vec3 uLightColor;\n\
    uniform vec3 uLookVec;\n\
    uniform vec4 uAmbient;\n\
    uniform vec4 uDiffuse;\n\
    uniform vec4 uSpecular;\n\
    uniform vec4 uEmission;\n\
    uniform vec4 uDetectColor;\n\
    uniform float uDetectTouch;\n\
    uniform float uUseTexture;\n\
    uniform float uShininess;\n\
    uniform vec3 uLightDirection;\n\
    \n\
    varying vec2 vTextureCoord;\n\
    varying vec4 vColor;\n\
    varying vec3 vNormal;\n\
    \n\
    \n\
    void main() {\n\
        float pi = 4.0 * atan(1.0);\n\
        vec4 texColor = texture2D(uSampler, vTextureCoord);\n\
        vec4 baseColor = vColor;\n\
        baseColor *= texColor * uUseTexture + vec4(1.0, 1.0, 1.0, 1.0) * (1.0 - uUseTexture);\n\
        float alpha = baseColor.a * uDetectColor.a * uDetectTouch + baseColor.a * (1.0 - uDetectTouch);\n\
        if (alpha < 0.2) {\n\
            discard;\n\
        }\n\
        else {\n\
            vec4 amb = uAmbient * vec4(uAmbientLightColor, 1.0);\n\
            vec3 N = normalize(vNormal);\n\
            vec3 L = normalize(uLightDirection);\n\
            vec3 E = normalize(uLookVec);\n\
            vec3 R = reflect(-L, N);\n\
            float lamber = max(dot(N, L) , 0.0);\n\
            vec4 dif = uDiffuse * lamber;\n\
            float s = max(dot(R, -E), 0.0);\n\
            vec4 specularColor = (uShininess + 2.0) / (2.0 * pi) * uSpecular * pow(s, uShininess) * sign(lamber);\n\
            gl_FragColor = (vec4(((amb + vec4(uLightColor, 1.0) * (dif + specularColor)) * baseColor).rgb, baseColor.a) \
                * uUseDirectionalLight + baseColor * (1.0 - uUseDirectionalLight)) \
                * (1.0 - uDetectTouch) + uDetectColor * uDetectTouch;\n\
        }\n\
    }';

}());
