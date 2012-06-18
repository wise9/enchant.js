/**
[lang:ja]
 * mmd.gl.enchant.js
 * @version 0.2.1
 * @require enchant.js v0.4.5+
 * @require gl.enchant.js v0.3.5+
 * @require bone.gl.enchant.js v0.2.1+
 * @author Ubiquitous Entertainment Inc.
 *
 * @description
 * MikuMikuDanceのPMDファイルとVMDファイルをgl.enchant.js上で使用できるようにするプラグイン.
 *
 * @detail
 * ファイルの読み込み・パースにMMD.jsのMMD.Model.jsとMMD.Motion.jsを使用します.
 * シェーダのソースをMMD.VertexShaderSource.jsとMMD.FragmentShaderSource.jsから引用しています.
 *
 * MMD.js:
 * https://github.com/edvakf/MMD.js
 * MMD.jsについて:
 * http://edv.sakura.ne.jp/mmd/
[/lang]
[lang:en]
 * mmd.gl.enchant.js
 * @version 0.2.0
 * @require enchant.js v0.4.3+
 * @require gl.enchant.js v0.3.5+
 * @require bone.gl.enchant.js v0.2.0+
 * @author Ubiquitous Entertainment Inc.
 *
 * @description
 * Plugin to allow use of MikuMikuDance PMD and VMD files in gl.enchant.js.
 *
 * @detail
 * MMD.js' MMD.Model and MMD.Motion are used in file loading and parse.
 * Shader source is quoted from MMD.VertexShaderSource and MMD.FragmentShaderSource.
 *
 * MMD.js:
 * https://github.com/edvakf/MMD.js
 * About MMD.js:
 * http://edv.sakura.ne.jp/mmd/
[/lang]
 */

// for MMD.js
var MMD = {};

(function() {

    var splitPath = function(path) {
        var split = path.match(/(.{0,})\/([\S^/]{1,}\.pmd)/);
        if (split == null) {
            split = [ '.' + path, '.', path ];
        }
        return split;
    };

    enchant.gl.mmd = {};

    enchant.Game._loadFuncs['pmd'] = function(src, callback) {
        if (callback == null) callback = function() {};
        var model = new enchant.gl.mmd.MSprite3D(src, function() {
            enchant.Game.instance.assets[src] = model;
            callback();
        });
    };

    enchant.Game._loadFuncs['vmd'] = function(src, callback) {
        if (callback == null) callback = function() {};
        var anim = new enchant.gl.mmd.MAnimation(src, function() {
            enchant.Game.instance.assets[src] = anim;
            callback();
        });
    };

    /**
     * @scope enchant.gl.mmd.MMesh.prototype
     */
    enchant.gl.mmd.MMesh = enchant.Class.create(enchant.gl.Mesh, {
        /**
        [lang:ja]
         * MSprite3D用のメッシュオブジェクト.
         * @constructs
         * @extends enchant.gl.Mesh
		[/lang]
		[lang:en]
         * MSprite3D mesh object.
         * @constructs
         * @extends enchant.gl.Mesh
        [/lang]
         */
        initialize: function() {
            enchant.gl.Mesh.call(this);
            var vpos1Buffer = new enchant.gl.Buffer(enchant.gl.Buffer.VERTICES);
            var vpos2Buffer = new enchant.gl.Buffer(enchant.gl.Buffer.VERTICES);
            var bone1posBuffer = new enchant.gl.Buffer(enchant.gl.Buffer.VERTICES);
            var bone2posBuffer = new enchant.gl.Buffer(enchant.gl.Buffer.VERTICES);
            var quats1Buffer = new enchant.gl.Buffer(enchant.gl.Buffer.QUATS);
            var quats2Buffer = new enchant.gl.Buffer(enchant.gl.Buffer.QUATS);
            var morphsBuffer = new enchant.gl.Buffer(enchant.gl.Buffer.MORPHS);
            var weightsBuffer = new enchant.gl.Buffer(enchant.gl.Buffer.WEIGHTS);
            var edgesBuffer = new enchant.gl.Buffer(enchant.gl.Buffer.EDGES);
            this._addAttribute(vpos1Buffer, 'vpos1');
            this._addAttribute(vpos2Buffer, 'vpos2');
            this._addAttribute(bone1posBuffer, 'bone1pos');
            this._addAttribute(bone2posBuffer, 'bone2pos');
            this._addAttribute(quats1Buffer, 'quats1');
            this._addAttribute(quats2Buffer, 'quats2');
            this._addAttribute(morphsBuffer, 'morphs');
            this._addAttribute(weightsBuffer, 'weights');
            this._addAttribute(edgesBuffer, 'edges');
        },
        _addAttribute: function(buffer, prop) {
            this['_' + prop] = buffer;
            Object.defineProperty(this, prop, {
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
        }
    });

    enchant.gl.mmd.MBone = enchant.Class.create(enchant.gl.Bone, {
        initialize: function(param) {
            var pos = vec3.create();
            var rot = quat4.create([0, 0, 0, 1]);
            enchant.gl.Bone.call(this, param.name, param.head_pos, pos, rot);
        }
    });

    enchant.gl.mmd.MSkeleton = enchant.Class.create(enchant.gl.Skeleton, {
        initialize: function(bones) {
            enchant.gl.Skeleton.call(this);
            this.table = new Array();
            if (bones) {
                this.load(bones);
            }
        },
        load: function(bones) {
            for (var i = 0, l = bones.length; i < l; i++) {
                bone = bones[i];
                this._add(bone);
            }
        },
        _add: function(param) {
            var bone = new MBone(param);
            this.table.push(bone);
            if (param.parent_bone_index == 0xFFFF) {
                this.addChild(bone);
            } else {
                this.table[param.parent_bone_index].addChild(bone);
            }
            if (param.name.match(/ひざ/)) {
                bone.constraint = function(q) {
                    return quat4.set([Math.sqrt(1 - q[3] * q[3]), 0, 0, q[3]], q);
                };
            }
        },
        _addIK: function(data) {
            var bones = new Array();
            effector = this.table[data.bone_index];
            target = this.table[data.target_bone_index];
            for (var i = 0, l = data.child_bones.length; i < l; i++) {
                bones[i] = this.table[data.child_bones[i]];
            }
            maxangle = data.control_weight * 4;
            iteration = data.iterations;
            this.addIKControl(effector, target, bones, maxangle, iteration);
        }
    });

    /**
     * @scope enchant.gl.mmd.MSprite3D.prototype
     */
    enchant.gl.mmd.MSprite3D = enchant.Class.create(enchant.gl.Sprite3D, {
        /**
        [lang:ja]
         * PMDファイルに対応したSprite3D.
         * 引数を渡すと{@link enchant.gl.mmd.MAnimation#loadVmd}が呼び出される.
         * @param {String} path ファイルパス
         * @param {Function} callback コールバック関数
         * @constructs
         * @extends enchant.gl.Sprite3D
		[/lang]
		[lang:en]
         * Sprite3D optimized for PMD files.
         * @constructs
         * @extends enchant.gl.Sprite3D
        [/lang]
         */
        initialize: function(path, callback) {
            enchant.gl.Sprite3D.call(this);
            this.program = enchant.gl.mmd.MMD_SHADER_PROGRAM;
            this.animation = [];
            this.uMVMatrix = mat4.create();
            this.uNMatrix = mat4.create();

            this.addEventListener('enterframe', function() {
                var first;
                var skeleton = this.skeleton;
                var morph = this.morph;
                if (this.animation.length == 0) {
                } else {
                    first = this.animation[0];

                    var data = first.animation._tick(first.frame);
                    first.frame++;

                    this._skinning(data.poses);

                    this._morphing(data.morphs);

                    if (first.frame > first.animation.length) {
                        first = this.animation.shift();
                        if (this.loop) {
                            first.frame = 0;
                            this.animation.push(first);
                        }
                    }
                }
            });
            if (arguments.length == 2) {
                this.loadPmd(path, callback);
            }
        },
        /**
        [lang:ja]
         * アニメーションを追加する.
         * アニメーションは追加された順に再生されていく.
         * @param {enchant.gl.mmd.MAnimation} animation
		[/lang]
		[lang:en]
         * Add animation.
         * Animation will be played in the order that it is added.
         * @param {enchant.gl.mmd.MAnimation} animation
        [/lang]
         */
        pushAnimation: function(animation) {
            this.animation.push({ frame: 0, animation: animation });
        },
        /**
        [lang:ja]
         * 追加されたアニメーションを削除する.
		[/lang]
		[lang:en]
         * Delete added animation.
        [/lang]
         */
        clearAnimation: function(animation) {
            this.animation = [];
        },
        _skinning: function(poses) {
            var skeleton = this.skeleton;
            skeleton.setPoses(poses);
            skeleton.solveFKs();
            skeleton.solveIKs();
            this._applySkeleton();

        },
        _morphing: function(morphs) {
            var target = this.mesh.morphs;
            for (var i = 0, l = target.length; i < l; i++) {
                target[i] = 0;
            }
            this.morph.morphing(morphs, target);
            this.mesh._morphs._bufferDataFast();
        },
        _render: function() {
            var game = enchant.Game.instance;
            var scene = game.currentScene3D;
            var l = scene.directionalLight;
            var lvec = [l._directionX, l._directionY, l._directionZ];
            var uMVMatrix = mat4.identity(this.uMVMatrix);
            mat4.multiply(scene._camera.mat, this.tmpMat, uMVMatrix);
            var uNMatrix = mat4.identity(this.uNMatrix);
            mat4.transpose(mat4.inverse(uMVMatrix, uNMatrix));
            var uLightDirection = vec3.normalize(lvec);
            mat4.multiplyVec3(uNMatrix, uLightDirection);
            game.GL.currentProgram.setAttributes({
                aVertexPosition: this.mesh._vertices,
                aVertexNormal: this.mesh._normals,
                aTextureCoord: this.mesh._texCoords,
                aVectorFromBone1: this.mesh._vpos1,
                aVectorFromBone2: this.mesh._vpos2,
                aBone1Position: this.mesh._bone1pos,
                aBone2Position: this.mesh._bone2pos,
                aBone1Rotation: this.mesh._quats1,
                aBone2Rotation: this.mesh._quats2,
                aMultiPurposeVector: this.mesh._morphs,
                aBoneWeight: this.mesh._weights,
                aVertexEdge: this.mesh._edges
            });
            game.GL.currentProgram.setUniforms({
                uLightDirection: uLightDirection,
                uPMatrix: scene._camera.projMat,
                uMVMatrix: uMVMatrix,
                uNMatrix: uNMatrix
            });
            var length;
            var material;
            var offset = 0;
            for (var i = 0, l = this.mesh.materials.length; i < l; i++) {
                material = this.mesh.materials[i];
                var u = {
                    uAmbientColor: material.ambient,
                    uDiffuseColor: material.diffuse,
                    uSpecularColor: material.specular,
                    uShininess: material.shininess,
                    uAlpha: material.alpha
                };
                if (material.toon) {
                    u.uToon = material.toon;
                }
                if (material.texture) {
                    if (material.texture._image.src.match(/sph/)) {
                        u.uUseSphereMap = 1;
                        u.uUseTexture = 0;
                        u.uUseSphereMapAdditive = 0;
                        u.uSphereMap = material.texture;
                    } else {
                        u.uUseSphereMap = 0;
                        u.uUseTexture = 1;
                        u.uTexture = material.texture;
                    }
                } else {
                    u.uUseTexture = 0;
                    u.uTexture = 0;
                    u.uUseSphereMap = 0;
                }
                game.GL.currentProgram.setUniforms(u);


                length = material.face_vert_count;
                enchant.Game.instance.GL.renderElements(this.mesh._indices, offset * 2, length);

                if (material.edge_flag) {
                    enchant.gl.mmd.MMD_SHADER_PROGRAM.setUniforms({ uEdge: 1 });
                    gl.cullFace(gl.FRONT);
                    enchant.Game.instance.GL.renderElements(this.mesh._indices, offset * 2, length);
                    gl.cullFace(gl.BACK);
                    enchant.gl.mmd.MMD_SHADER_PROGRAM.setUniforms({ uEdge: 0 });
                }

                offset += material.face_vert_count;
            }
        },
        /**
        [lang:ja]
         * .pmdファイルをロードする.
         * @param {String} path ファイルパス
         * @param {Function} callback コールバック関数
         * @example
         * // model/miku.pmd を読み込む.
         * var mk = new MSprite3D();
         * mk.loadPmd('model/miku.pmd', function() {
         *     scene.addChild(mk);
         * });
		[/lang]
		[lang:en]
         * Load .pmd files.
         * @param {String} path File path
         * @param {Function} callback Callback function
         * @example
         * // model/miku.pmd loading.
         * var mk = new MSprite3D();
         * mk.loadPmd('model/miku.pmd', function() {
         *     scene.addChild(mk);
         * });
        [/lang]
         */
        loadPmd: function(path, callback) {
            var split = splitPath(path);
            var model = new MMD.Model(split[1], split[2]);
            var that = this;
            this._data = model;
            model.load(function() {
                return that._parse(model, callback);
            });
        },
        set: function(sp) {
            this._parse(sp._data);
            this._data = sp._data;
        },
        clone: function() {
            var sp = new enchant.gl.mmd.MSprite3D();
            sp._parse(this._data);
            sp._data = this._data;
            return sp;
        },
        _parse: function(model, callback) {
            if (typeof callback != 'function') {
                callback = function() {};
            }
            var data;
            var original;
            var params = [ 'ambient', 'diffuse', 'specular', 'shininess', 'alpha', 'face_vert_count', 'edge_flag' ];

            var mesh = new MMesh();
            var length = model.vertices.length;
            var v;
            var b1, b2;
            var ind;
            var material;
            var vertices = new Float32Array(length * 3);
            var normals = new Float32Array(length * 3);
            var texCoords = new Float32Array(length * 2);
            var indices = new Uint16Array(model.triangles);
            var vpos1 = new Float32Array(length * 3);
            var vpos2 = new Float32Array(length * 3);
            var bone1pos = new Float32Array(length * 3);
            var bone2pos = new Float32Array(length * 3);
            var quats1 = new Float32Array(length * 4);
            var quats2 = new Float32Array(length * 4);
            var morphs = new Float32Array(length * 3);
            var weights = new Float32Array(length);
            var edges = new Uint16Array(length);
            var bindex1 = new Float32Array(length);
            var bindex2 = new Float32Array(length);
            var tmp = vec3.create();
            var tmp2 = vec3.create();
            for (var i = 0; i < length; i++) {
                v = model.vertices[i];
                b1 = model.bones[v.bone_num1];
                b2 = model.bones[v.bone_num2];
                bindex1[i] = v.bone_num1;
                bindex2[i] = v.bone_num2;
                tmp.set([v.x, v.y, v.z]);
                vertices.set(tmp, i * 3);
                vec3.subtract(tmp, b1.head_pos, tmp2);
                vpos1.set(tmp2, i * 3);
                vec3.subtract(tmp, b2.head_pos, tmp2);
                vpos2.set(tmp2, i * 3);
                normals.set([v.nx, v.ny, v.nz], i * 3);
                texCoords.set([v.u, v.v], i * 2);
                bone1pos.set(b1.head_pos, i * 3);
                bone2pos.set(b2.head_pos, i * 3);
                quats1.set([0, 0, 0, 1], i * 4);
                quats2.set([0, 0, 0, 1], i * 4);
                morphs.set([0, 0, 0], i * 3);
                weights[i] = v.bone_weight;
                edges[i] = 1 - v.edge_flag;
            }


            mesh.vertices = vertices;
            mesh.normals = normals;
            mesh.texCoords = texCoords;
            mesh.indices = indices;
            mesh.vpos1 = vpos1;
            mesh.vpos2 = vpos2;
            mesh.bone1pos = bone1pos;
            mesh.bone2pos = bone2pos;
            mesh.quats1 = quats1;
            mesh.quats2 = quats2;
            mesh.weights = weights;
            mesh.edges = edges;
            mesh.morphs = morphs;
            mesh.colors = new Float32Array(length * 4);
            mesh.bindex1 = bindex1;
            mesh.bindex2 = bindex2;

            this.mesh = mesh;

            this.mesh.materials = new Array();

            this.skeleton = new MSkeleton(model.bones);
            for (var i = 0, l = model.iks.length; i < l; i++) {
                data = model.iks[i];
                this.skeleton._addIK(data);
            }

            this.morph = new MMorph(model.morphs);

            for (var i = 0, l = model.materials.length; i < l; i++) {
                original = model.materials[i];
                material = this.mesh.materials[i] = {};
                for (prop in params) {
                    material[params[prop]] = original[params[prop]];
                }
                if (typeof model.toon_file_names[i] != 'undefined') {
                    material.toon = new Texture(model.directory + '/' + model.toon_file_names[original.toon_index], {flipY:false});
                }
                if (original.texture_file_name) {
                    material.texture = new Texture(model.directory + '/' + original.texture_file_name);
                }
            }

            callback(this);
        },
        _applySkeleton: function() {
            var sk = this.skeleton;
            var mesh = this.mesh;
            var bi1, bi2, b1, b2;
            var length = this.mesh.vertices.length / 3;
            for (var i = 0; i < length; i++) {
                bi1 = mesh.bindex1[i];
                bi2 = mesh.bindex2[i];
                b1 = sk.table[bi1];
                b2 = sk.table[bi2];
                mesh._bone1pos._array.set(b1._globalpos, i * 3);
                mesh._quats1._array.set(b1._globalrot, i * 4);
                mesh._bone2pos._array.set(b2._globalpos, i * 3);
                mesh._quats2._array.set(b2._globalrot, i * 4);
            }
            mesh._bone1pos._bufferDataFast();
            mesh._bone2pos._bufferDataFast();
            mesh._quats1._bufferDataFast();
            mesh._quats2._bufferDataFast();
        }
    });


    enchant.gl.mmd.MPose = enchant.Class.create(enchant.gl.Pose, {
        initialize: function(param) {
            enchant.gl.Pose.call(this, param.location, param.rotation);
            this._interpolation = param.interpolation;
        },
        _internalInterpole: function(i, x) {
            var x1 = this._interpolation[0 + i] / 127;
            var y1 = this._interpolation[4 + i] / 127;
            var x2 = this._interpolation[8 + i] / 127;
            var y2 = this._interpolation[12 + i] / 127;
            return this._bezierp(x1, y1, x2, y2, x);
        },
        getInterpolation: function(another, ratio) {
            var v = vec3.create();
            var q = quat4.create();
            var xt = this._internalInterpole(0, ratio);
            var yt = this._internalInterpole(1, ratio);
            var zt = this._internalInterpole(2, ratio);
            var rt = this._internalInterpole(3, ratio);
            v[0] = this._position[0] + (another._position[0] - this._position[0]) * xt;
            v[1] = this._position[1] + (another._position[1] - this._position[1]) * yt;
            v[2] = this._position[2] + (another._position[2] - this._position[2]) * zt;
            var loc = v;
            var rot = quat4.slerp(this._rotation, another._rotation, rt, q);
            return new Pose(loc, rot);
        }
    });

    enchant.gl.mmd.MMorph = enchant.Class.create({
        initialize: function(data) {
            this._base;
            this._morphs = {};
            if (typeof data != 'undefined') {
                this._load(data);
            }
        },
        _load: function(data) {
            this._base = data.slice(0, 1)[0];
            var m, name, vert, morph;
            for (var i = 1, l = data.length; i < l; i++) {
                m = data[i];
                name = m.name;
                vert = m.vert_data;
                morph = this._morphs[name] = {};
                morph.index = new Float32Array(vert.length);
                morph.vert = new Float32Array(vert.length * 3);
                for (var j = 0, ll = vert.length; j < ll; j++) {
                    morph.index[j] = this._base.vert_data[vert[j].index].index * 3;
                    morph.vert[j * 3] = vert[j].x;
                    morph.vert[j * 3 + 1] = vert[j].y;
                    morph.vert[j * 3 + 2] = vert[j].z;
                }
            }
        },
        morphing: function(data, target) {
            var weight, index;
            for (prop in data) {
                weight = data[prop];
                if (weight && this._morphs[prop]) {
                    this._morphing(prop, target, weight);
                }
            }
        },
        _morphing: function(name, target, weight) {
            var set = this._morphs[name];
            var index;
            for (var i = 0, l = set.index.length; i < l; i++) {
                index = set.index[i];
                target[index] += set.vert[i*3] * weight;
                target[index + 1] += set.vert[i*3+1] * weight;
                target[index + 2] += set.vert[i*3+2] * weight;
            }
        }
    });

    enchant.gl.mmd.MMorphPoint = enchant.Class.create({
        initialize: function(weight) {
            this._weight = weight;
        },
        getInterpolation: function(another, ratio) {
            return lerp(this._weight, another._weight, ratio);
        }
    });

    enchant.gl.mmd.MKeyFrameManager = enchant.Class.create(enchant.gl.KeyFrameManager, {
        initialize: function() {
            enchant.gl.KeyFrameManager.call(this);
        }
    });

    /**
     * @scope enchant.gl.mmd.MAnimation.prototype
     */
    enchant.gl.mmd.MAnimation = enchant.Class.create({
        /**
        [lang:ja]
         * VMDファイルに対応したSprite3D.
         * キャラクターの姿勢とモーフィングのデータが読み込まれる.
         * 引数を渡すと{@link enchant.gl.mmd.MAnimation#loadVmd}が呼び出される.
         * @param {String} path ファイルパス
         * @param {Function} callback コールバック関数
         * @constructs
         * @extends enchant.gl.Sprite3D
         * @see enchant.gl.mmd.MAnimation#loadVmd
		[/lang]
		[lang:en]
         * Sprite3D optimized to VMD file.
         * Character data and morphing are loaded.
         * If argument is delivered {@link enchant.gl.mmd.MAnimation#loadVmd} will be called up.
         * @param {String} path File path
         * @param {Function} callback Callback function
         * @constructs
         * @extends enchant.gl.Sprite3D
         * @see enchant.gl.mmd.MAnimation#loadVmd
        [/lang]
         */
        initialize: function(path, callback) {
            this.length = -1;
            if (arguments.length == 2) {
                this.loadVmd(path, callback);
            }
        },
        /**
        [lang:ja]
         * .vmdファイルをロードする.
         * @param {String} path ファイルパス
         * @param {Function} callback コールバック関数
         * @example
         * // motion/dance.vmd を読み込む.
         * var dance = new MAnimation();
         * dance.loadVmd('motion/dance.vmd', function() {
         *     mk.pushAnimation(dance);
         * });
		[/lang]
		[lang:en]
         * Load .vmd file.
         * @param {String} path File path
         * @param {Function} callback Callback function
         * @example
         * // motion/dance.vmd is loaded.
         * var dance = new MAnimation();
         * dance.loadVmd('motion/dance.vmd', function() {
         *     mk.pushAnimation(dance);
         * });
        [/lang]
         */
        loadVmd: function(path, callback) {
            var motion = new MMD.Motion(path);
            var frame;
            var that = this;
            motion.load(function() {
                that.motions = parseMotion(motion.bone);
                that.morphs = parseMorph(motion.morph);
                that._calcLength();
                callback(that);
            });
        },
        _tick: function(frame) {
            var poses = this._getFrame(this.motions, frame);
            var morphs = this._getFrame(this.morphs, frame);
            return {
                poses: poses,
                morphs: morphs
            };
        },
        _getFrame: function(data, frame) {
            var ret = {};
            for (prop in data) {
                ret[prop] = data[prop].getFrame(frame);
            }
            return ret;
        },
        _calcLength: function() {
            var data, deta;
            for (prop in this) {
                data = this[prop];
                if (data instanceof Object) {
                    for (plop in data) {
                        deta = data[plop];
                        if (deta instanceof enchant.gl.mmd.MKeyFrameManager) {
                            if (this.length < deta.length) {
                                this.length = deta.length;
                            }
                        }
                    }
                }
            }
        }
    });

    var parseMorph = function(data) {
        var morphs = {};
        var morph, name, frame, weight;
        for (var i = 0, l = data.length; i < l; i++) {
            morph = data[i];
            name = morph.name;
            frame = morph.frame;
            weight = morph.weight;
            if (typeof morphs[name] == 'undefined') {
                morphs[name] = new enchant.gl.mmd.MKeyFrameManager();
            }
            morphs[name].addFrame(new MMorphPoint(weight), frame);
        }
        for (prop in morphs) {
            morphs[prop]._sort();
        }
        return morphs;
    };

    var parseMotion = function(data) {
        var motions = {};
        var bone, name, frame;
        for (var i = 0, l = data.length; i < l; i++) {
            bone = data[i];
            name = bone.name;
            frame = bone.frame;
            if (typeof motions[name] == 'undefined') {
                motions[name] = new enchant.gl.mmd.MKeyFrameManager();
            }
            motions[name].addFrame(new MPose(bone), frame);
        }
        for (prop in motions) {
            motions[prop]._sort();
        }
        return motions;
    };

    var bufferProto = Object.getPrototypeOf(enchant.gl.Buffer);
    bufferProto.MORPHS = bufferProto.NORMALS;
    bufferProto.QUATS = bufferProto.COLORS;
    bufferProto.WEIGHTS = {
        size: 1,
        type: 5126,
        norm: false,
        stride: 0,
        offset: 0,
        btype: 34962,
        Atype: Float32Array
    };
    bufferProto.EDGES = {
        size: 1,
        type: 5123,
        norm: false,
        stride: 0,
        offset: 0,
        btype: 34962,
        Atype: Uint16Array
    };

    enchant.gl.Game.prototype._original_start = enchant.gl.Game.prototype.start;
    enchant.gl.Game.prototype.start = function() {
        enchant.gl.mmd.MMD_SHADER_PROGRAM = new enchant.gl.Shader(MMD_VERTEX_SHADER_SOURCE, MMD_FRAGMENT_SHADER_SOURCE);
        this.GL.setProgram(enchant.gl.mmd.MMD_SHADER_PROGRAM);
        enchant.gl.mmd.MMD_SHADER_PROGRAM.setUniforms({
            uLightMatrix: [ 1, 0, 0, 0,
                            0, 1, 0, 0,
                            0, 0, 1, 0,
                            0, 0, 0, 1 ],
            uLightColor: [0.6, 0.6, 0.6],
            uSelfShadow: 0,
            uShadowMap: 0,
            uGenerateShadowMap: 0,
            uCenterPoint: 0,
            uAxis: 0,
            uAxisColor: [ 1, 0, 1 ],
            uEdge: 0,
            uEdgeColor: [0, 0, 0],
            uEdgeThickness: 0.004
        });
        this.GL.setDefaultProgram();
        this._original_start();
    };

    var lerp = function(n1, n2, r) {
        return n1 + r * (n2 - n1);
    };

    var MMD_VERTEX_SHADER_SOURCE = '\n\
        uniform mat4 uMVMatrix;\n\
        uniform mat4 uPMatrix;\n\
        uniform mat4 uNMatrix;\n\
        \n\
        uniform mat4 uLightMatrix;\n\
        \n\
        attribute vec3 aVertexNormal;\n\
        attribute vec2 aTextureCoord;\n\
        attribute float aVertexEdge;\n\
        \n\
        attribute float aBoneWeight;\n\
        attribute vec3 aVectorFromBone1;\n\
        attribute vec3 aVectorFromBone2;\n\
        attribute vec4 aBone1Rotation;\n\
        attribute vec4 aBone2Rotation;\n\
        attribute vec3 aBone1Position;\n\
        attribute vec3 aBone2Position;\n\
        \n\
        attribute vec3 aMultiPurposeVector;\n\
        \n\
        varying vec3 vPosition;\n\
        varying vec3 vNormal;\n\
        varying vec2 vTextureCoord;\n\
        varying vec4 vLightCoord;\n\
        \n\
        uniform float uEdgeThickness;\n\
        uniform bool uEdge;\n\
        \n\
        uniform bool uGenerateShadowMap;\n\
        \n\
        uniform bool uSelfShadow;\n\
        \n\
        uniform bool uAxis;\n\
        uniform bool uCenterPoint;\n\
        \n\
        vec3 qtransform(vec4 q, vec3 v) {\n\
            return v + 2.0 * cross(cross(v, q.xyz) - q.w*v, q.xyz);\n\
        }\n\
        \n\
        void main() {\n\
            vec3 position;\n\
            vec3 normal;\n\
        \n\
            if (uAxis || uCenterPoint) {\n\
        \n\
                position = aMultiPurposeVector;\n\
        \n\
            } else {\n\
        \n\
                float weight = aBoneWeight;\n\
                vec3 morph = aMultiPurposeVector;\n\
        \n\
                position = qtransform(aBone1Rotation, aVectorFromBone1 + morph) + aBone1Position;\n\
                normal = qtransform(aBone1Rotation, aVertexNormal);\n\
        \n\
                if (weight < 0.99) {\n\
                    vec3 p2 = qtransform(aBone2Rotation, aVectorFromBone2 + morph) + aBone2Position;\n\
                    vec3 n2 = qtransform(aBone2Rotation, normal);\n\
        \n\
                    position = mix(p2, position, weight);\n\
                    normal = normalize(mix(n2, normal, weight));\n\
                }\n\
            }\n\
        \n\
           \n\
            gl_Position = uPMatrix * uMVMatrix * vec4(position, 1.0);\n\
        \n\
            if (uCenterPoint) {\n\
                gl_Position.z = 0.0;\n\
                gl_PointSize = 16.0;\n\
            }\n\
        \n\
            if (uGenerateShadowMap || uAxis || uCenterPoint) return;\n\
        \n\
           \n\
            vTextureCoord = aTextureCoord;\n\
            vPosition = (uMVMatrix * vec4(position, 1.0)).xyz;\n\
            vNormal = (uNMatrix * vec4(normal, 1.0)).xyz;\n\
        \n\
            if (uSelfShadow) {\n\
                vLightCoord = uLightMatrix * vec4(position, 1.0);\n\
            }\n\
        \n\
            if (uEdge) {\n\
                vec4 pos = gl_Position;\n\
                vec4 pos2 = uPMatrix * uMVMatrix * vec4(position + normal, 1.0);\n\
                vec4 norm = normalize(pos2 - pos);\n\
                gl_Position = pos + norm * uEdgeThickness * aVertexEdge * pos.w;\n\
                return;\n\
            }\n\
        }\n\
    ';

    var MMD_FRAGMENT_SHADER_SOURCE = '\n\
        #ifdef GL_ES\n\
            precision highp float;\n\
        #endif\n\
        \n\
        varying vec2 vTextureCoord;\n\
        varying vec3 vPosition;\n\
        varying vec3 vNormal;\n\
        varying vec4 vLightCoord;\n\
        \n\
        uniform vec3 uLightDirection;\n\
        uniform vec3 uLightColor;\n\
        \n\
        uniform vec3 uAmbientColor;\n\
        uniform vec3 uSpecularColor;\n\
        uniform vec3 uDiffuseColor;\n\
        uniform float uAlpha;\n\
        uniform float uShininess;\n\
        \n\
        uniform bool uUseTexture;\n\
        uniform bool uUseSphereMap;\n\
        uniform bool uIsSphereMapAdditive;\n\
        \n\
        uniform sampler2D uToon;\n\
        uniform sampler2D uTexture;\n\
        uniform sampler2D uSphereMap;\n\
        \n\
        uniform bool uEdge;\n\
        uniform float uEdgeThickness;\n\
        uniform vec3 uEdgeColor;\n\
        \n\
        uniform bool uGenerateShadowMap;\n\
        uniform bool uSelfShadow;\n\
        uniform sampler2D uShadowMap;\n\
        \n\
        uniform bool uAxis;\n\
        uniform vec3 uAxisColor;\n\
        uniform bool uCenterPoint;\n\
        \n\
        // from http://spidergl.org/example.php?id=6\n\
        vec4 pack_depth(const in float depth) {\n\
            const vec4 bit_shift = vec4(256.0*256.0*256.0, 256.0*256.0, 256.0, 1.0);\n\
            const vec4 bit_mask  = vec4(0.0, 1.0/256.0, 1.0/256.0, 1.0/256.0);\n\
            vec4 res = fract(depth * bit_shift);\n\
            res -= res.xxyz * bit_mask;\n\
            return res;\n\
        }\n\
        float unpack_depth(const in vec4 rgba_depth)\n\
        {\n\
            const vec4 bit_shift = vec4(1.0/(256.0*256.0*256.0), 1.0/(256.0*256.0), 1.0/256.0, 1.0);\n\
            float depth = dot(rgba_depth, bit_shift);\n\
            return depth;\n\
        }\n\
        \n\
        void main() {\n\
            if (uGenerateShadowMap) {\n\
               \n\
                gl_FragColor = pack_depth(gl_FragCoord.z);\n\
                return;\n\
            }\n\
            if (uAxis) {\n\
                gl_FragColor = vec4(uAxisColor, 1.0);\n\
                return;\n\
            }\n\
            if (uCenterPoint) {\n\
                vec2 uv = gl_PointCoord * 2.0 - 1.0;\n\
                float w = dot(uv, uv);\n\
                if (w < 0.3 || (w > 0.5 && w < 1.0)) {\n\
                    gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);\n\
                } else {\n\
                    discard;\n\
                }\n\
                return;\n\
            }\n\
        \n\
           \n\
            vec3 norm = normalize(vNormal);\n\
            vec3 cameraDirection = normalize(-vPosition);\n\
        \n\
            vec3 color;\n\
            float alpha = uAlpha;\n\
        \n\
            if (uEdge) {\n\
        \n\
                color = uEdgeColor;\n\
        \n\
            } else {\n\
        \n\
                color = vec3(1.0, 1.0, 1.0);\n\
                if (uUseTexture) {\n\
                    vec4 texColor = texture2D(uTexture, vTextureCoord);\n\
                    color *= texColor.rgb;\n\
                    alpha *= texColor.a;\n\
                }\n\
                if (uUseSphereMap) {\n\
                    vec2 sphereCoord = 0.5 * (1.0 + vec2(1.0, -1.0) * norm.xy);\n\
                    if (uIsSphereMapAdditive) {\n\
                        color += texture2D(uSphereMap, sphereCoord).rgb;\n\
                    } else {\n\
                        color *= texture2D(uSphereMap, sphereCoord).rgb;\n\
                    }\n\
                }\n\
        \n\
               \n\
                vec3 halfAngle = normalize(uLightDirection + cameraDirection);\n\
                float specularWeight = pow( max(0.001, dot(halfAngle, norm)) , uShininess );\n\
               \n\
                vec3 specular = specularWeight * uSpecularColor;\n\
        \n\
                vec2 toonCoord = vec2(0.0, 0.5 * (1.0 - dot( uLightDirection, norm )));\n\
        \n\
                if (uSelfShadow) {\n\
                    vec3 lightCoord = vLightCoord.xyz / vLightCoord.w;\n\
                    vec4 rgbaDepth = texture2D(uShadowMap, lightCoord.xy);\n\
                    float depth = unpack_depth(rgbaDepth);\n\
                    if (depth < lightCoord.z - 0.01) {\n\
                        toonCoord = vec2(0.0, 0.55);\n\
                    }\n\
                }\n\
        \n\
                color *= uAmbientColor + uLightColor * (uDiffuseColor + specular);\n\
        \n\
                color = clamp(color, 0.0, 1.0);\n\
                color *= texture2D(uToon, toonCoord).rgb;\n\
        \n\
            }\n\
            gl_FragColor = vec4(color, alpha);\n\
        \n\
        }\n\
    ';
})();
