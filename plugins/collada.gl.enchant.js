/**
 * @fileOverview
 * collada.gl.enchant.js
 * @version v0.4.0
 * @require enchant.js v0.4.5+
 * @require gl.enchant.js v0.3.1+
 * @author Ubiquitous Entertainment Inc.
 * @description
 * Plugin to load collada format (.dae) files on gl.enchant.js
 *
 * @detail
 * Uses gl-matrix.js in vectors and matrix operations.
 * gl-matrix.js:
 * https://github.com/toji/gl-matrix/
 */
if (enchant.gl !== undefined) {
    enchant.Core._loadFuncs['dae'] = function(src, callback) {
        enchant.gl.Sprite3D.loadCollada(src, function(collada, src) {
            enchant.Core.instance.assets[src] = collada;
            if (callback != null) {
                callback();
            }
        });
    };
    (function() {
        /**
        * Create Sprite3D from Collada data.
        * At present, data that has joint and animation is not supported.
        * In addition, vertex attributes should be triangles.
        * @example
        *   var scene = new Scene3D();
        *   Sprite3D.loadCollada('hoge.dae',　function(model){
        *       scene.addChild(model);
        *   });
        * @param {String} url Collada model URL,
        * @param {function(enchant.pro.Sprite3D)} onload Callback when loading is complete. Sprite3D created from model will be delivered to argument
        * @static
        */
        enchant.gl.Sprite3D.loadCollada = function(url, onload) {
            if (typeof onload !== 'function') {
                return;
            }
            var req = new XMLHttpRequest();
            req.open('GET', url, true);
            req.onload = function() {
                var maxbonenum = 6;
                var lib = {};
                var collada = req.responseXML.getElementsByTagName('COLLADA')[0];
                for (var i = 0, l = availableLibraryFeatures.length; i < l; i++) {
                    lib[availableLibraryFeatures[i].libraryName] = availableLibraryFeatures[i].loadLibraryFromXML(collada, url);
                }
                var scene = new Scene(collada.getElementsByTagName('scene')[0]);
                var rootSprite = new enchant.gl.collada.RootColladaSprite3D();
                var rootColladaSprite3D = new enchant.gl.collada.ColladaSprite3D(lib);
                var rootColladaSkeletonSprite3D = new enchant.gl.collada.ColladaSkeletonSprite3D(lib);
                if (scene.visualSceneUrl) {
                    var visualScene = lib['visual_scenes'][scene.visualSceneUrl];
                    for (var nk in visualScene.nodes) {
                        visualScene.nodes[nk].resolveChildNodes(lib);
                    }
                    for (var k in visualScene.nodes) {
                        if (visualScene.nodes[k].controllerUrl) {
                            var skeletonContainer = new Node(visualScene.nodes[k].xml);
                            skeletonContainer.nodes = [];
                            for (var key in visualScene.nodes[k].skeletons) {
                                skeletonContainer.nodes[visualScene.nodes[k].skeletons[key].id] = (visualScene.nodes[k].skeletons[key]);
                            }
                            var bone = new enchant.gl.collada.ColladaBone(skeletonContainer, [0, 0, 0]);
                            var skeleton = new enchant.gl.collada.ColladaSkeleton();
                            skeleton.addChild(bone);
                            skeleton.solveFKs();
                            rootColladaSkeletonSprite3D.skeleton = skeleton;
                            var skin = lib['controllers'][visualScene.nodes[k].controllerUrl].skin.getProcessedSkinData();
                            skeleton.calculateTableForIds(skin.ids);
                            rootColladaSkeletonSprite3D.addColladaSkeletonSprite3DFromNode(skeletonContainer, skin, skeleton, maxbonenum);
                        } else {
                            rootColladaSprite3D.addColladaSprite3DFromNode(visualScene.nodes[k]);
                        }
                    }
                }
                rootSprite.addChild(rootColladaSprite3D);
                rootSprite.addChild(rootColladaSkeletonSprite3D);
                onload(rootSprite, url);
            };
            req.send(null);
        };
        var Unit = enchant.Class.create({
            initialize: function(xml) {
                this.xml = xml;
                this._datas = {};
                this.loadParams();
            },
            loadParams: function() {
                for (var i = 0, l = this._childable.length; i < l; i++) {
                    var nodes = [];
                    var param = this._childable[i];
                    if (this.xml !== undefined) {
                        for (var j = 0, k = this.xml.childNodes.length; j < k; j++) {
                            if (this.xml.childNodes[j].nodeName === param) {
                                nodes.push(this.xml.childNodes[j]);
                            }
                        }
                    }
                    this._datas[param] = nodes;
                }
            },
            parseFloatArray: function(element) {
                var array = [];
                var floatStrings = (element.textContent).split(/\s+/);
                for (var k = 0; k < floatStrings.length; k++) {
                    var value = parseFloat(floatStrings[k]);
                    if (!isNaN(value)) {
                        array.push(value);
                    }
                }
                return array;
            },
            getParentDirectory: function(path) {
                return path.substring(0, path.lastIndexOf('/') + 1);
            },
            getReferenceAttribute: function(element, attribute) {
                return element.getAttribute(attribute).replace('#', '');
            },
            getReferenceTextContent: function(element) {
                return element.textContent.replace('#', '');
            }
        });
        Unit.prototype._childable = [];
        var Scene = enchant.Class.create(Unit, {
            initialize: function(xml) {
                Unit.call(this, xml);
                if (this._datas['instance_visual_scene']) {
                    this.visualSceneUrl = this.getReferenceAttribute(this._datas['instance_visual_scene'][0], 'url');
                }
            }
        });
        Scene.prototype._childable = ['instance_visual_scene'];
        var Image = enchant.Class.create(Unit, {
            initialize: function(xml, url) {
                Unit.call(this, xml);
                this.initFrom = '';
                if (this._datas['init_from']) {
                    this.initFrom = this._datas['init_from'][0].textContent;
                    if (this.initFrom.substr(0, 4) ==='file') {
                        var spl=this.initFrom.split('/');
                        this.initFrom=spl[spl.length-1];
                    }
                    if (this.initFrom.substr(0, 4) !== 'http') {
                        if (this.initFrom.substr(0, 2) === './') {
                            this.initFrom = this.initFrom.substr(2, this.initFrom.length - 2);
                        }
                        this.initFrom = this.getParentDirectory(url) + this.initFrom;
                    }
                }
            }
        });
        Image.prototype._childable = ['renderable', 'init_from', 'create_2d', 'create_3d', 'create_map'];
        var Geometry = enchant.Class.create(Unit, {
            initialize: function(xml) {
                Unit.call(this, xml);
                if (this._datas['mesh']) {
                    this.Mesh = new GeometryMesh(this._datas['mesh'][0]);
                }
            }
        });
        Geometry.prototype._childable = ['asset', 'convex_mesh', 'mesh', 'spline', 'extra'];
        var GeometryMesh = enchant.Class.create(Unit, {
            initialize: function(xml) {
                Unit.call(this, xml);
                this.srcs = [];
                this.srcs.offset = null;
                this.vertices = [];
                this.triangles = [];
                if (this._datas['source']) {
                    for (var i = 0, l = this._datas['source'].length; i < l; i++) {
                        this.srcs[this._datas['source'][i].getAttribute('id')] = this.parseFloatArray(this._datas['source'][i].getElementsByTagName('float_array')[0]);
                    }
                }
                if (this._datas['vertices']) {
                    this.vertices = new Vertices(this._datas['vertices'][0]);
                }
                if (this._datas['triangles'].length > 0) {
                    this.triangles = [];
                    for (var ti = 0; ti < this._datas['triangles'].length; ti++) {
                        this.triangles[ti] = new Triangle(this._datas['triangles'][ti], this.srcs, this.vertices);
                    }
                }
                if (this._datas['polylist'].length > 0) {
                    this.triangles = [];
                    for (var pi = 0; pi < this._datas['polylist'].length; pi++) {
                        this.triangles[pi] = new Polylist(this._datas['polylist'][pi], this.srcs, this.vertices);
                    }
                }
            }
        });
        GeometryMesh.prototype._childable = ['source', 'vertices', 'lines', 'linestripes', 'polygons', 'polylist', 'triangles', 'trifans', 'tristrips', 'extra'];
        var Vertices = enchant.Class.create(Unit, {
            initialize: function(xml) {
                Unit.call(this, xml);
                this.source = {};
                for (var i = 0; i < this._datas['input'].length; i++) {
                    var input = this._datas['input'][i];
                    this.source[input.getAttribute('semantic')] = this.getReferenceAttribute(input, 'source');
                }
                this.id = xml.getAttribute('id');
                this.position = this.source['POSITION'];
            }
        });
        Vertices.prototype._childable = ['input', 'extras'];
        var AbstractGeometryMeshTriangleData = enchant.Class.create(Unit, {
            initialize: function(xml, srcs, vertices) {
                Unit.call(this, xml);
                this.inputs = [];
                this.primitives = [];
                this.stride = 0;
                this.material = this.xml.getAttribute('material');
                if (this._datas['input']) {
                    for (var i = 0, l = this._datas['input'].length; i < l; i++) {
                        var sourceId = this.getReferenceAttribute(this._datas['input'][i], 'source');
                        var offset = parseInt(this._datas['input'][i].getAttribute('offset'), 10);
                        var set = parseInt(this._datas['input'][i].getAttribute('set'), 10);
                        if (srcs[sourceId]) {
                            this._addSource(srcs, sourceId, this._datas['input'][i].getAttribute('semantic'));
                            this.inputs[this._datas['input'][i].getAttribute('semantic') + 'offset'] = offset;
                            if (!isNaN(set)) {
                                this.inputs[this._datas['input'][i].getAttribute('semantic') + 'set'] = set;
                            } else {
                                this.inputs[this._datas['input'][i].getAttribute('semantic') + 'set'] =0;
                            }
                        } else if (vertices.id === sourceId) {
                            for (var key in vertices.source) {
                                if (srcs[vertices.source[key]]) {
                                    this._addSource(srcs, vertices.source[key], key);
                                    this.inputs[key + 'offset'] = offset;
                                }
                            }
                        }
                        this.stride = Math.max(this.stride, (offset + 1));
                    }
                }
                if (this._datas['p']) {
                    if (this._datas['p'][0]) {
                        this._calculatePrimitives(this.parseFloatArray(this._datas['p'][0]));
                    }
                }
            },
            _calculatePrimitives: function(pointArray) {},
            _addSource: function(sources, sourceId, inputId) {
                var source = sources[sourceId];
                this.inputs[inputId] = source;
                if (inputId === 'TEXCOORD') {
                    for (var sj = 1; sj < source.length; sj += 2) {
                        this.inputs[inputId][sj] = source[sj];
                    }
                }
            }
        });
        var Triangle = enchant.Class.create(AbstractGeometryMeshTriangleData, {
            _calculatePrimitives: function(pointArray) {
                this.primitives = pointArray;
            }
        });
        Triangle.prototype._childable = ['input', 'p'];
        var Polylist = enchant.Class.create(AbstractGeometryMeshTriangleData, {
            _calculatePrimitives: function(primitives) {
                var vcount = this.parseFloatArray(this._datas['vcount'][0]);
                var num = 0;
                var last = 0;
                var triangles = [];
                var first = true;
                for (var i = 0, l = primitives.length / this.stride; i < l; i++) {
                    if (first) {
                        for (var j = 0; j < this.stride; j++) {
                            triangles.push(primitives[i * this.stride + j]);
                        }
                    } else {
                        for (var lj = 0; lj < this.stride; lj++) {
                            triangles.push(primitives[last * this.stride + lj]);
                        }
                        for (var prej = 0; prej < this.stride; prej++) {
                            triangles.push(primitives[(i - 1) * this.stride + prej]);
                        }
                        for (var cj = 0; cj < this.stride; cj++) {
                            triangles.push(primitives[i * this.stride + cj]);
                        }
                    }
                    if (i - last === 2) {
                        first = false;
                    }
                    if (vcount[num] - 1 === i - last) {
                        this.primitives = this.primitives.concat(triangles);
                        last += vcount[num];
                        num += 1;
                        triangles = [];
                        first = true;
                    }
                }
            }
        });
        Polylist.prototype._childable = ['input', 'p', 'vcount'];
        var VisualScene = enchant.Class.create(Unit, {
            initialize: function(xml) {
                Unit.call(this, xml);
                this.nodes = [];
                for (var i = 0, l = this._datas['node'].length; i < l; i++) {
                    this.nodes[this._datas['node'][i].getAttribute('id')] = new Node(this._datas['node'][i]);
                }
            }
        });
        VisualScene.prototype._childable = ['asset', 'node', 'evaluate_scene', 'extra'];
        var Node = enchant.Class.create(Unit, {
            initialize: function(xml) {
                this.nodes = [];
                this.childNodeIds = [];
                this.skeletons = [];
                this.skeletonChildNodeIds = [];
                this.translate = [0, 0, 0];
                this.rotate = [];
                this.nMatrix = [];
                Unit.call(this, xml);
                if (xml) {
                    if (xml.getAttribute('sid')) {
                        this.sid = xml.getAttribute('sid');
                    } else {
                        this.sid = xml.getAttribute('id');
                    }
                    this.id = xml.getAttribute('id');
                    this.type = xml.getAttribute('type');
                    for (var i = 0, l = this._datas['node'].length; i < l; i++) {
                        this.nodes[this._datas['node'][i].getAttribute('id')] = new Node(this._datas['node'][i]);
                    }
                    if (this._datas['translate'].length > 0) {
                        this.translate = this.parseFloatArray(this._datas['translate'][0]);
                    }
                    for (var ri = 0, rl = this._datas['rotate'].length; ri < rl; ri++) {
                        this.rotate[this._datas['rotate'][ri].getAttribute('sid')] = this.parseFloatArray(this._datas['rotate'][ri]);
                    }
                    for (var mi = 0, ml = this._datas['matrix'].length; mi < ml; mi++) {
                        this.nMatrix[this._datas['matrix'][mi].getAttribute('sid')] = mat4.transpose(this.parseFloatArray(this._datas['matrix'][0]));
                    }
                    var materialNode = null;
                    if (this._datas['instance_geometry'].length > 0) {
                        materialNode = this._datas['instance_geometry'][0];
                        this.geometryUrl = this.getReferenceAttribute(materialNode, 'url');
                    } else if (this._datas['instance_controller'].length > 0) {
                        materialNode = this._datas['instance_controller'][0];
                        this.controllerUrl = this.getReferenceAttribute(materialNode, 'url');
                        var skels = this._datas['instance_controller'][0].getElementsByTagName('skeleton');
                        for (i = 0, l = skels.length; i < l; i++) {
                            this.skeletonChildNodeIds[i] = this.getReferenceTextContent(skels[i]);
                        }
                    }
                    if (this._datas['instance_node']) {
                        for (i = 0, l = this._datas['instance_node'].length; i < l; i++) {
                            this.childNodeIds[i] = this.getReferenceAttribute(this._datas['instance_node'][i], 'url');
                        }
                    }
                    if (materialNode != null) {
                        var material = materialNode.getElementsByTagName('instance_material');
                        if (material) {
                            this.materialTarget = {};
                            for (i = 0; i < material.length; i++) {
                                this.materialTarget[material[i].getAttribute('symbol')] = this.getReferenceAttribute(material[i], 'target');
                            }
                        }
                    }
                }
            },
            resolveChildNodes: function(lib) {
                this.__resolveChildNodes(lib, this.childNodeIds, this.nodes);
                var libNodes = lib['nodes'];
                var libVisualScene = lib['visual_scenes'];
                for (var key in this.skeletonChildNodeIds) {
                    var element = null;
                    for (var nodeKey in libNodes) {
                        if (libNodes[nodeKey]._getNodeInHirachy(this.skeletonChildNodeIds[key])) {
                            element = libNodes[nodeKey];
                        }
                        if (element != null) {break;}
                    }
                    for (nodeKey in libVisualScene) {
                        if (element != null) {break;}
                        if (libVisualScene[nodeKey]._getNodeInHirachy(this.skeletonChildNodeIds[key])) {
                            element = libNodes[nodeKey];
                        }
                    }
                    if (element != null) {
                        element.resolveChildNodes(lib);
                        this.skeletons.push(element);
                    }
                }
                for (var i = 0; i < this.skeletons.length; i++) {
                    for (var j = i + 1; j < this.skeletons.length; j++) {
                        if (this.skeletons[i]._getNodeInHirachy(this.skeletons[j].id)) {
                            this.skeletons.splice(j, 1);
                            j--;
                        } else if (this.skeletons[j]._getNodeInHirachy(this.skeletons[i].id)) {
                            this.skeletons.splice(i, 1);
                            i--;
                            break;
                        }
                    }
                }
            },
            __resolveChildNodes: function(lib, childNodeIds, childArray) {
                for (var key in childArray) {
                    childArray[key].resolveChildNodes(lib);
                }
                var libNodes = lib['nodes'];
                var libVisualScene = lib['visual_scenes'];
                for (var i = 0; i < childNodeIds.length;) {
                    var element = null;
                    for (key in libNodes) {
                        element = libNodes[key]._getNodeInHirachy(childNodeIds[i]);
                        if (element != null) {break;}
                    }
                    for (key in libVisualScene) {
                        if (element != null) {break;}
                        var nodes = libVisualScene[key].nodes;
                        for (var nodeKey in nodes) {
                            element = nodes[nodeKey]._getNodeInHirachy(childNodeIds[i]);
                            if (element != null) {break;}
                        }
                    }
                    if (element != null) {
                        childArray[element.id] = new Node(element.xml);
                        childArray[element.id].resolveChildNodes(lib);
                        childNodeIds.splice(i, 1);
                    } else {
                        i++;
                    }
                }
            },
            _getNodeInHirachy: function(id) {
                if (this.id === id) {return this;}
                var child = null;
                for (var k in this.nodes) {
                    child = this.nodes[k]._getNodeInHirachy(id);
                    if (child != null) {break;}
                }
                return child;
            },
            getRotationMatrix: function() {
                var rotation = mat4.create();
                mat4.identity(rotation);
                for (var rotationSid in this.rotate) {
                    var rotationVec = this.rotate[rotationSid];
                    var mat = new enchant.gl.Quat(rotationVec[0], rotationVec[1], rotationVec[2], rotationVec[3] * Math.PI / 180);
                    mat4.multiply(rotation, mat.toMat4(mat4.create()));
                }
                return rotation;
            },
            getTranslationMatrix: function() {
                var translation = mat4.create();
                mat4.identity(translation);
                var position = this.translate;
                mat4.translate(translation, [position[0], position[1], position[2]]);
                return translation;
            },
            getnMatrix: function() {
                var matrix = mat4.create();
                mat4.identity(matrix);
                for (var matrixSid in this.nMatrix) {
                    mat4.multiply(matrix, this.nMatrix[matrixSid]);
                }
                return matrix;
            },
            getNode: function() {
                var table = this.nodes;
                var child = [];
                for (var key in table){
                    child[key] = [];
                    child[key] = table[key].getNode();
                    for(var ckey in child[key]){
                        table[ckey] = child[key][ckey];
                    }
                }
                return table;
            },
            getAnimationMatrixFromOneAnimationNode: function(Animation, libAnimationClips, flag) {
                var core = enchant.Core.instance;
                var rotation = this.getRotationMatrix();
                var translation = this.getTranslationMatrix();
                var matrix = this.getnMatrix();
                var animationMatrixes = [];
                var sid = this.sid;
                animationMatrixes[sid] = [];
                animationMatrixes[sid][0] = mat4.multiply(translation, rotation, mat4.create());
                mat4.multiply(animationMatrixes[sid][0], matrix);
                var output = [];
                var input = [];
                var length = 0;
                for (var ci = 0, cl = Animation.channels.length; ci < cl; ci++) {
                    if (this.id === Animation.channels[ci].target.split('/')[0]) {
                        var currentLength = Animation.samplers[Animation.channels[ci].samplerId].input.length;
                        length = Math.max(currentLength, length);
                        if (Animation.samplers[Animation.channels[ci].samplerId].input.length === length) {
                            input = Animation.samplers[Animation.channels[ci].samplerId].input;
                        }
                        output[Animation.channels[ci].target.split('/')[1].split('.')[0]] = Animation.samplers[Animation.channels[ci].samplerId].output;
                    }
                }
                for (var i = 0, l = length; i < l; i++) {
                    var rot = mat4.create();
                    var trans = mat4.create();
                    var nMat = mat4.create();
                    mat4.identity(rot);
                    mat4.identity(trans);
                    mat4.identity(nMat);
                    mat4.translate(trans, this.translate);
                    for (var rkey in this.rotate) {
                        var tmpf = false;
                        var mat;
                        for (var okey in output) {
                            if (rkey === okey) {
                                mat = new enchant.gl.Quat(this.rotate[rkey][0], this.rotate[rkey][1], this.rotate[rkey][2], output[okey][i] * Math.PI / 180);
                                mat4.multiply(rot, mat.toMat4(mat4.create()));
                                tmpf = true;
                            }
                        }
                        if (!tmpf) {
                            mat = new enchant.gl.Quat(this.rotate[rkey][0], this.rotate[rkey][1], this.rotate[rkey][2], this.rotate[rkey][3] * Math.PI / 180);
                            mat4.multiply(rot, mat.toMat4(mat4.create()));
                        }
                    }
                    for (var okey2 in output) {
                        if (okey2 === 'translation') {
                            mat4.identity(trans);
                            mat4.translate(trans, [output[okey2][i * 3], output[okey2][i * 3 + 1], output[okey2][i * 3 + 2]]);
                        } else if (okey2 === 'scale') {
                            //TODO !
                        } else if (okey2 === 'matrix') {
                            var tmpMat = [];
                            for (var j = 0; j < 16; j++) {
                                tmpMat.push(output[okey2][i*16+j]);
                            }
                            mat4.transpose(tmpMat);
                            mat4.multiply(nMat,tmpMat);
                        } else {
                            for (var mkey in this.nMatrix) {
                                if (okey2.indexOf('(')!==-1) {
                                    if (mkey === okey2.split('(')[0]) {
                                        if (!isNaN(output[okey2][i])) {
                                            nMat[parseInt(okey2.split('(')[1].split(')')[0], 10) * 4 + parseInt(okey2.split(')(')[1].split(')')[0], 10)] = output[okey2][i];
                                        } else {
                                            nMat[parseInt(okey2.split('(')[1].split(')')[0], 10) * 4 + parseInt(okey2.split(')(')[1].split(')')[0], 10)] = output[okey2][0];
                                        }
                                    }
                                } else {
                                    var tmpMatrix = [];
                                    for (var oj = 0; oj < 16; oj++) {
                                        tmpMatrix.push(output[okey2][i * 16 + oj]);
                                    }
                                    mat4.transpose(tmpMatrix);
                                    mat4.multiply(nMat, tmpMatrix);
                                }
                            }
                        }
                    }
                    animationMatrixes[sid][Math.round(core.fps * input[i])] = mat4.multiply(trans, rot, mat4.create());
                    mat4.multiply(animationMatrixes[sid][Math.round(core.fps * input[i])],nMat);
                }
                if (Animation.animations.length > 0) {
                    var child = this.getAnimationMatrixesLocal(Animation.animations, libAnimationClips, true);
                    for (var ccl in child) {
                        animationMatrixes[ccl] = child[ccl];
                    }
                }
                return animationMatrixes;
            },
            getAnimationMatrixesLocal: function(libAnimations, libAnimationClips, flag) {
                var core = enchant.Core.instance;
                var rotation = this.getRotationMatrix();
                var translation = this.getTranslationMatrix();
                var matrix = this.getnMatrix();
                var animationMatrixes = [];
                animationMatrixes[this.sid] = [];
                animationMatrixes[this.sid][0] = mat4.multiply(translation, rotation, mat4.create());
                mat4.multiply(animationMatrixes[this.sid][0], matrix);
                var output = [];
                var input = [];
                var length = 0;
                for (var key in libAnimations) {
                    for (var ci = 0, cl = libAnimations[key].channels.length; ci < cl; ci++) {
                        if (this.id === libAnimations[key].channels[ci].target.split('/')[0]) {
                            var currentLength = libAnimations[key].samplers[libAnimations[key].channels[ci].samplerId].input.length;
                            length = Math.max(currentLength, length);
                            if (libAnimations[key].samplers[libAnimations[key].channels[ci].samplerId].input.length === length) {
                                input = libAnimations[key].samplers[libAnimations[key].channels[ci].samplerId].input;
                            }
                            output[libAnimations[key].channels[ci].target.split('/')[1].split('.')[0]] = libAnimations[key].samplers[libAnimations[key].channels[ci].samplerId].output;
                        }
                    }
                    for (var ackey in libAnimationClips) {
                        if (libAnimationClips[ackey].urls.indexOf(key) > -1 && flag) {
                            length = 0;
                        } 
                    }
                    if (libAnimations[key].animations.length > 0 && length > 0) {
                        var child = this.getAnimationMatrixesLocal(libAnimations[key].animations, libAnimationClips, true);
                        for (var ckey in child) {
                            animationMatrixes[ckey] = child[ckey];
                        }
                    }
                }
                for (var i = 0, l = length; i < l; i++) {
                    var rot = mat4.create();
                    var trans = mat4.create();
                    var nMat = mat4.create();
                    mat4.identity(rot);
                    mat4.identity(trans);
                    mat4.identity(nMat);
                    mat4.translate(trans, this.translate);
                    for (var rkey in this.rotate) {
                        var tmpf = false;
                        var mat;
                        for (var okey in output) {
                            if (rkey === okey) {
                                mat = new enchant.gl.Quat(this.rotate[rkey][0], this.rotate[rkey][1], this.rotate[rkey][2], output[okey][i] * Math.PI / 180);
                                mat4.multiply(rot, mat.toMat4(mat4.create()));
                                tmpf = true;
                            }
                        }
                        if (!tmpf) {
                            mat = new enchant.gl.Quat(this.rotate[rkey][0], this.rotate[rkey][1], this.rotate[rkey][2], this.rotate[rkey][3] * Math.PI / 180);
                            mat4.multiply(rot, mat.toMat4(mat4.create()));
                        }
                    }
                    for (var okey2 in output) {
                        if (okey2 === 'translation') {
                            mat4.identity(trans);
                            mat4.translate(trans, [output[okey2][i * 3], output[okey2][i * 3 + 1], output[okey2][i * 3 + 2]]);
                        } else if (okey2 === 'scale') {
                            //TODO !
                        } else if (okey2 === 'matrix') {
                            var tmpMat = [];
                            for (var j = 0; j < 16; j++) {
                                tmpMat.push(output[okey2][i*16+j]);
                            }
                            mat4.transpose(tmpMat);
                            mat4.multiply(nMat,tmpMat);
                        } else {
                            for (var mkey in this.nMatrix) {
                                if (okey2.indexOf('(')!==-1) {
                                    if (mkey === okey2.split('(')[0]) {
                                        if (!isNaN(output[okey2][i])) {
                                            nMat[parseInt(okey2.split('(')[1].split(')')[0], 10) * 4 + parseInt(okey2.split(')(')[1].split(')')[0], 10)] = output[okey2][i];
                                        } else {
                                            nMat[parseInt(okey2.split('(')[1].split(')')[0], 10) * 4 + parseInt(okey2.split(')(')[1].split(')')[0], 10)] = output[okey2][0];
                                        }
                                    }
                                } else {
                                    var tmpMatrix = [];
                                    for (var oj = 0; oj < 16; oj++) {
                                        tmpMatrix.push(output[okey2][i * 16 + oj]);
                                    }
                                    mat4.transpose(tmpMatrix);
                                    mat4.multiply(nMat, tmpMatrix); 
                                }
                            }
                        }
                    }
                    animationMatrixes[this.sid][Math.round(core.fps * input[i])] = mat4.multiply(trans, rot, mat4.create());
                    mat4.multiply(animationMatrixes[this.sid][Math.round(core.fps * input[i])],nMat);
                }
                for (var k in this.nodes) {
                    var childmat = this.nodes[k].getAnimationMatrixesLocal(libAnimations, libAnimationClips, true);
                    for (l in childmat) {
                        animationMatrixes[l] = childmat[l];
                    }
                }
                return animationMatrixes;
            },
            getAnimationMatrixesLocalFromAnimationClips: function(libAnimations, libAnimationClips) {
                var animationMatrixClips = [];
                for (var ackey in libAnimationClips) {
                    var urls = libAnimationClips[ackey].urls;
                    animationMatrixClips[ackey] = [];
                    for (var ui = 0, ul = urls.length; ui < ul; ui++) {
                        var child = [];
                        if (libAnimations[urls[ui]].channels[0]) {
                            child = this.getNode()[libAnimations[urls[ui]].channels[0].target.split('/')[0]].getAnimationMatrixFromOneAnimationNode(libAnimations[urls[ui]], libAnimationClips, true);
                        }
                        var child2 = [];
                        if (libAnimations[urls[ui]].animations[0]) {
                            child2 = this.getAnimationMatrixesLocal(libAnimations[urls[ui]].animations, libAnimationClips, true);
                        }
                        for (var l in child) {
                            animationMatrixClips[ackey][l] = child[l];
                        }
                        for (l in child2) {
                            animationMatrixClips[ackey][l] = child2[l];
                        }
                    }
                }
                return animationMatrixClips;
            }
        });
        Node.prototype._childable = ['node', 'Lookat', 'matrix', 'rotate', 'scale', 'skew', 'translate', 'instance_camera', 'instance_controller', 'instance_geometry', 'instance_light', 'instance_node', 'extra'];
        var Material = enchant.Class.create(Unit, {
            initialize: function(xml) {
                Unit.call(this, xml);
                this.effectUrl = this.getReferenceAttribute(this._datas['instance_effect'][0], 'url');
            }
        });
        Material.prototype._childable = ['asset', 'instance_effect', 'extra'];
        var Animation = enchant.Class.create(Unit, {
            initialize: function(xml) {
                Unit.call(this, xml);
                this.srcs = [];
                this.channels = [];
                this.samplers = [];
                this.animations = [];
                for (var ai = 0, al = this._datas['animation'].length; ai < al; ai++) {
                    this.animations[ai] = new Animation(this._datas['animation'][ai]);
                }
                for (var ci = 0, cl = this._datas['channel'].length; ci < cl; ci++) {
                    this.channels[ci]={};
                    this.channels[ci].target = this.getReferenceAttribute(this._datas['channel'][ci], 'target');
                    this.channels[ci].samplerId = this.getReferenceAttribute(this._datas['channel'][ci], 'source');
                }
                for (var i = 0, l = this._datas['source'].length; i < l; i++) {
                    if (this._datas['source'][i].getElementsByTagName('float_array')[0]) {
                        this.srcs[this._datas['source'][i].getAttribute('id')] = this.parseFloatArray(this._datas['source'][i].getElementsByTagName('float_array')[0]);
                    }
                }
                for (var si = 0, sl = this._datas['sampler'].length; si < sl; si++) {
                    this.samplers[this._datas['sampler'][si].getAttribute('id')] = new Sampler(this._datas['sampler'][si], this.srcs);
                }
                if (this._datas['sampler'].length > 0) {
                    this.sampler = new Sampler(this._datas['sampler'][0], this.srcs);
                }
            }
        });
        Animation.prototype._childable = ['asset', 'animation', 'source', 'sampler', 'channel', 'extra'];
        var AnimationClip = enchant.Class.create(Unit, {
           initialize: function(xml) {
               Unit.call(this, xml);
               this.urls = [];
               for (var i = 0, l = this._datas['instance_animation'].length; i < l; i++) {
                   this.urls.push(this._datas['instance_animation'][i].getAttribute('url').replace('#', ''));
               }
           } 
        });
        AnimationClip.prototype._childable = ['asset','instance_animation','instance_formula','extra'];
        var Sampler = enchant.Class.create(Unit, {
            initialize: function(xml, srcs) {
                Unit.call(this, xml);
                this.input = [];
                this.output = [];
                for (var i = 0, l = this._datas['input'].length; i < l; i++) {
                    if (this._datas['input'][i].getAttribute('semantic') === 'OUTPUT') {
                        this.output = srcs[this.getReferenceAttribute(this._datas['input'][i], 'source')];
                    }
                    if (this._datas['input'][i].getAttribute('semantic') === 'INPUT') {
                        this.input = srcs[this.getReferenceAttribute(this._datas['input'][i], 'source')];
                    }
                }
            }
        });
        Sampler.prototype._childable = ['input'];
        var Controller = enchant.Class.create(Unit, {
            initialize: function(xml) {
                Unit.call(this, xml);
                for (var i = 0, l = this._datas['skin'].length; i < l; i++) {
                    this.skin = new Skin(this._datas['skin'][i]);
                }
            }
        });
        Controller.prototype._childable = ['asset', 'skin', 'morph', 'extra'];
        var Skin = enchant.Class.create(Unit, {
            initialize: function(xml) {
                Unit.call(this, xml);
                this.source = this.getReferenceAttribute(xml, 'source');
                this.sources = [];
                var child;
                for (var i = 0, l = this._datas['source'].length; i < l; i++) {
                    var source = this._datas['source'][i];
                    for (var j = 0, m = source.childNodes.length; j < m; j++) {
                        child = source.childNodes[j];
                        if (child.nodeName === 'Name_array') {
                            this.sources[source.getAttribute('id')] = child.textContent.split(' ');
                        }
                        if (child.nodeName === 'float_array') {
                            this.sources[source.getAttribute('id')] = this.parseFloatArray(child);
                        }
                    }
                }
                this.joints = {};
                var joints = this._datas['joints'][0];
                for (i = 0, l = joints.childNodes.length; i < l; i++) {
                    child = joints.childNodes[i];
                    if (child.nodeName === 'input') {
                        this.joints[child.getAttribute('semantic')] = this.sources[this.getReferenceAttribute(child, 'source')];
                    }
                }
                this.vertex_weights = [];
                var vweights = this._datas['vertex_weights'][0];
                for (i = 0, l = vweights.childNodes.length; i < l; i++) {
                    child = vweights.childNodes[i];
                    if (child.nodeName === 'input') {
                        this.vertex_weights[child.getAttribute('semantic')] = this.sources[this.getReferenceAttribute(child, 'source')];
                        this.vertex_weights[child.getAttribute('semantic') + '_offset'] = child.getAttribute('offset');
                    }
                    if (child.nodeName === 'vcount' || child.nodeName === 'v') {
                        this.vertex_weights[child.nodeName] = this.parseFloatArray(child);
                    }
                }
            },
            getProcessedSkinData: function() {
                var resultSkin = {};
                resultSkin.joints = {};
                var ids = {};
                for (var i = 0, l = this.vertex_weights.JOINT.length; i < l; i++) {
                    ids[this.vertex_weights.JOINT[i]] = i;
                }
                resultSkin.ids = ids;
                resultSkin.source = this.source;
                for (i = 0, l = this.joints['JOINT'].length; i < l; i++) {
                    resultSkin.joints[this.joints['JOINT'][i]] = [];
                    for (var j = 0; j < 16; j++) {
                        var retu = (j - j % 4) / 4;
                        var gyou = j % 4;
                        resultSkin.joints[this.joints['JOINT'][i]].push(this.joints['INV_BIND_MATRIX'][i * 16 + gyou * 4 + retu]);
                    }
                }
                resultSkin.vertex_weights = [];
                var last = 0;
                for (i = 0, l = this.vertex_weights['vcount'].length; i < l; i++) {
                    resultSkin.vertex_weights[i] = [];
                    for (var vj = 0, vl = this.vertex_weights['vcount'][i]; vj < vl; vj++) {
                        var weight = this.vertex_weights['WEIGHT'][this.vertex_weights['v'][(last + vj) * 2 + 1]];
                        resultSkin.vertex_weights[i][this.vertex_weights['JOINT'][this.vertex_weights['v'][(last + vj) * 2]]] = weight;
                    }
                    last += this.vertex_weights['vcount'][i];
                }
                return resultSkin;
            }
        });
        Skin.prototype._childable = ['bind_shape_matrix', 'source', 'joints', 'vertex_weights', 'extra'];
        var Effect = enchant.Class.create(Unit, {
            getFieldFromXMLWithDefaultValue: function(defaultValue, elementName, floatArrayName) {
                var element = this._datas['profile_COMMON'][0].getElementsByTagName(elementName)[0];
                if (element) {
                    var array = element.getElementsByTagName(floatArrayName)[0];
                    if (array) {return this.parseFloatArray(array);}
                }
                return defaultValue;
            },
            initialize: function(xml) {
                Unit.call(this, xml);
                if (this._datas['profile_COMMON'][0].getElementsByTagName('newparam')[0]) {
                    this.imageSrc = this._datas['profile_COMMON'][0].getElementsByTagName('newparam')[0].getElementsByTagName('surface')[0].getElementsByTagName('init_from')[0].textContent;
                }
                this.emission = this.getFieldFromXMLWithDefaultValue([0, 0, 0, 1], 'emission', 'color');
                this.ambient = this.getFieldFromXMLWithDefaultValue([1, 1, 1, 1], 'ambient', 'color');
                this.diffuse = this.getFieldFromXMLWithDefaultValue([1.0, 1.0, 1.0, 1], 'diffuse', 'color');
                this.specular = this.getFieldFromXMLWithDefaultValue([1, 1, 1, 1], 'specular', 'color');
                this.shininess = this.getFieldFromXMLWithDefaultValue([20], 'shininess', 'float');
                this.reflective = this.getFieldFromXMLWithDefaultValue([0, 0, 0, 0], 'reflective', 'color');
                this.reflectivity = this.getFieldFromXMLWithDefaultValue([0], 'reflectivity', 'float');
                this.transparent = this.getFieldFromXMLWithDefaultValue([0, 0, 0, 0], 'transparent', 'color');
                this.transparency = this.getFieldFromXMLWithDefaultValue(0, 'transparency', 'float');
            }
        });
        Effect.prototype._childable = ['asset', 'annotate', 'image', 'newparam', 'profile_CG', 'profile_GLSL', 'profile_COMMON', 'extra'];

        /**
         * Exports collada.gl.enchant.js class to enchant.
         */
        enchant.gl.collada = {};
        /**
         * @scope enchant.gl.collada.ColladaBone.prototype
         */
        enchant.gl.collada.ColladaBone = enchant.Class.create(enchant.gl.Bone, {
            /**
             * Class to display the status of bones used for collada skinning.
             * @param {Node} node
             * @param {vec3} parentpos
             * @param {quat4} parentrot
             * @constructs
             * @extends enchant.gl.Bone
             */
            initialize: function(node, parentpos, parentrot) {
                var rotation = node.getRotationMatrix();
                var translation = node.getTranslationMatrix();
                var matrix = node.getnMatrix();
                var animationMatrixes = [];
                animationMatrixes[0] = [];
                animationMatrixes[0][node.sid] = mat4.multiply(translation, rotation, mat4.create());
                mat4.multiply(animationMatrixes[0][node.sid],matrix);
                var pos = vec3.create([animationMatrixes[0][node.sid][12], animationMatrixes[0][node.sid][13], animationMatrixes[0][node.sid][14]]);
                var rotation3x3 = mat4.toMat3(animationMatrixes[0][node.sid], mat3.create());
                mat3.transpose(rotation3x3);
                var quatanion = mat3.toQuat4(rotation3x3, quat4.create());
                var wquatanion, local;
                if (parentrot) {
                    wquatanion = quat4.multiply(parentrot, quatanion, quat4.create());
                    local = quat4.multiplyVec3(parentrot, vec3.create(pos));
                } else {
                    wquatanion = quatanion;
                    local = vec3.create(pos);
                }
                var head = vec3.add(parentpos, local, vec3.create());
                enchant.gl.Bone.call(this, node.sid, head, pos, quatanion);
                for (var k in node.nodes) {
                    var child = new enchant.gl.collada.ColladaBone(node.nodes[k], head, wquatanion);
                    this.addChild(child);
                }
            }
        });
        /**
         * @scope enchant.gl.collada.ColladaSkeleton.prototype
         */
        enchant.gl.collada.ColladaSkeleton = enchant.Class.create(enchant.gl.Skeleton, {
            /**
             * Class that becomes bone structure route augmented with specific collada information.
             * @constructs
             * @extends enchant.gl.Skeleton
             */
            initialize: function() {
                enchant.gl.Skeleton.call(this);
            },
            calculateTableForIds: function(ids) {
                this.table = this._calculateFlatTableForIds(this, ids);
            },
            _calculateFlatTableForIds: function(skelPart, ids) {
                var table = {};
                table.pos = [];
                table.rot = [];
                for (var i = 0; i < 4; i++) {
                    if (i < 3) {table['pos'][ids[skelPart._name] * 3 + i] = skelPart._globalpos[i];}
                    table['rot'][ids[skelPart._name] * 4 + i] = skelPart._globalrot[i];
                }
                for (var x = 0, l = skelPart.childNodes.length; x < l; x++) {
                    var child = this._calculateFlatTableForIds(skelPart.childNodes[x], ids);
                    for (var key in child) {
                        for (var k in child[key]) {
                            table[key][k] = child[key][k];
                        }
                    }
                }
                return table;
            }
        });
        /**
         * @scope enchant.gl.collada.ColladaMesh.prototype
         */
        enchant.gl.collada.ColladaMesh = enchant.Class.create(enchant.gl.Mesh, {
            /**
             * Class to store peak arrays and textures.
             * Used as a enchant.gl.collada.ColladaSprite3D property.
             * @param {Triangle} triangles
             * @constructs
             * @extends enchant.gl.Mesh
             */
            initialize: function(triangles) {
                enchant.gl.Mesh.call(this);
                this.parseMeshFromGeometryMesh(triangles);
                this.colors = [];
                for (var i = 0; i < (this.vertices.length / 3) * 4; i++) {
                    this.colors[i] = 1.0;
                }
            },
            parseMeshFromGeometryMesh: function(triangles) {
                var inputs = triangles.inputs;
                this.vertices = [];
                this.normals = [];
                this.texCoords = [];
                this.indices = [];
                var index;
                for (var k = 0; k < triangles.primitives.length; k += triangles.stride) {
                    if (triangles.inputs['POSITIONoffset'] >= 0) {
                        index = triangles.primitives[k + triangles.inputs['POSITIONoffset']] * 3;
                        this.vertices.push(inputs['POSITION'][index], inputs['POSITION'][index + 1], inputs['POSITION'][index + 2]);
                    }
                    if (triangles.inputs['NORMALoffset'] >= 0) {
                        index = triangles.primitives[k + triangles.inputs['NORMALoffset']] * 3;
                        this.normals.push(inputs['NORMAL'][index], inputs['NORMAL'][index + 1], inputs['NORMAL'][index + 2]);
                    }
                    if (triangles.inputs['TEXCOORDoffset'] >= 0) {
                        index = triangles.primitives[k + triangles.inputs['TEXCOORDoffset']] * (2+triangles.inputs['TEXCOORDset']);
                        this.texCoords.push(inputs['TEXCOORD'][index], inputs['TEXCOORD'][index + 1]);
                    } else {
                        this.texCoords.push(0, 0);
                    }
                }
                for (k = 0; k < triangles.primitives.length / (triangles.stride); k++) {
                    this.indices.push(k);
                }
            }
        });
        /**
         * @scope enchant.gl.collada.ColladaSkeletonSpriteMesh.prototype
         */
        enchant.gl.collada.ColladaSkeletonSpriteMesh = enchant.Class.create(enchant.gl.collada.ColladaMesh, {
            /**
             * Class to store peak arrays and textures.
             * Used as an enchant.gl.collada.ColladaSkeletonSprite3D property.
             * @param {Triangle} triangles
             * @constructs
             * @extends enchant.gl.collada.ColladaMesh
             */
            initialize: function(triangles) {
                enchant.gl.collada.ColladaMesh.call(this, triangles);
                var vpos1Buffer = new enchant.gl.Buffer(enchant.gl.Buffer.VERTICES);
                var vpos2Buffer = new enchant.gl.Buffer(enchant.gl.Buffer.VERTICES);
                var vpos3Buffer = new enchant.gl.Buffer(enchant.gl.Buffer.VERTICES);
                var bindicesBuffer = new enchant.gl.Buffer(enchant.gl.Buffer.BONE_INDICES);
                var weights1Buffer = new enchant.gl.Buffer(enchant.gl.Buffer.WEIGHTS);
                var weights2Buffer = new enchant.gl.Buffer(enchant.gl.Buffer.WEIGHTS);
                this._addAttribute(vpos1Buffer, 'vpos1');
                this._addAttribute(vpos2Buffer, 'vpos2');
                this._addAttribute(vpos3Buffer, 'vpos3');
                this._addAttribute(bindicesBuffer, 'boneIndices');
                this._addAttribute(weights1Buffer, 'weights1');
                this._addAttribute(weights2Buffer, 'weights2');
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
        /**
         * @scope enchant.gl.collada.AbstractColladaSprite3D.prototype
         */
        enchant.gl.collada.AbstractColladaSprite3D = enchant.Class.create(enchant.gl.Sprite3D, {
            /**
             * Base class used for collada Sprite3Ds.
             * This class should not be initialized directly.
             * @param {Object} lib
             * @param {Node} node
             * @param {Triangle} triangles
             * @constructs
             * @extends enchant.gl.Sprite3D
             */
            initialize: function(lib, node, triangles) {
                enchant.gl.Sprite3D.call(this);
                this.lib = lib;
                if (triangles) {
                    this.mesh = this._getMesh(triangles);
                    this.initSpriteTexture(node, lib, triangles);
                }
            },
            _getMesh: function(triangles) {
                return null;
            },
            getPose: function(poses, length, localframe) {
                var core = enchant.Core.instance;
                var frame = (core.frame) % length;
                if (localframe) {
                    frame = localframe;
                }
                var pose = [];
                for (var k in poses) {
                    pose[k] = poses[k].getFrame(frame);
                }
                return pose;
            },
            createPoses: function(node, poses, lib) {
                var matrix = node.getAnimationMatrixesLocal(lib['animations'], lib['animation_clips'], true);
                var length = 0;
                for (var k in matrix) {
                    poses[k] = new enchant.gl.KeyFrameManager();
                    for (var i in matrix[k]) {
                        var pos = vec3.create([matrix[k][i][12], matrix[k][i][13], matrix[k][i][14]]);
                        var rotation3x3 = mat4.toMat3(matrix[k][i], mat3.create());
                        mat3.transpose(rotation3x3);
                        var quatanion = quat4.fromRotationMatrix(rotation3x3, quat4.create());
                        poses[k].addFrame(new enchant.gl.Pose(pos, quatanion), parseInt(i, 10));
                    }
                    length = Math.max(poses[k].length, length);
                }
                return length;
            },
            createPosesClips: function(node, poseclips, lib) {
                var matrixclips = node.getAnimationMatrixesLocalFromAnimationClips(lib['animations'],lib['animation_clips']);
                var length = [];
                var core = enchant.Core.instance;
                for (var pkey in matrixclips) {
                    length[pkey] = 0;
                    var matrix = matrixclips[pkey];
                    poseclips[pkey] = [];
                    for (var mkey in matrix) {
                        poseclips[pkey][mkey] = new enchant.gl.KeyFrameManager();
                        for (var i in matrix[mkey]) {
                            var num = 0;
                            if (matrix[mkey].length > parseInt(lib['animation_clips'][pkey].start * core.fps, 10)) {
                                num = i - parseInt(lib['animation_clips'][pkey].start * core.fps, 10);
                            } else {
                                num = i;
                            }
                            var pos = vec3.create([matrix[mkey][i][12], matrix[mkey][i][13], matrix[mkey][i][14]]);
                            var rotation3x3 = mat4.toMat3(matrix[mkey][i], mat3.create());
                            mat3.transpose(rotation3x3);
                            var quatanion = quat4.fromRotationMatrix(rotation3x3, quat4.create());
                            if (num >= 0 && i <= parseInt(lib['animation_clips'][pkey].end * core.fps, 10)) {
                                poseclips[pkey][mkey].addFrame(new enchant.gl.Pose(pos, quatanion), parseInt(num, 10));
                            }
                        }
                        length[pkey] = Math.max(poseclips[pkey][mkey].length, length[pkey]);
                    }
                }
                return length;
            },
            initSpriteTexture: function(node, lib, triangles) {
                var libMaterials = lib['materials'];
                var libEffects = lib['effects'];
                var libImages = lib['images'];
                if (node.materialTarget && this.mesh) {
                    var material = node.materialTarget[triangles.material];
                    if (material) {
                        var texture = this.mesh.texture;
                        var effect = libEffects[libMaterials[material].effectUrl];
                        texture.emission = effect.emission;
                        texture.ambient = effect.ambient;
                        texture.diffuse = effect.diffuse;
                        texture.specular = effect.specular;
                        texture.shininess = effect.shininess[0];
                        if (effect.imageSrc) {
                            texture.src=libImages[effect.imageSrc].initFrom;
                        }
                    }
                }
            },
            _getTriangles: function(geometry, index) {
                if (geometry) {
                    return geometry.Mesh.triangles[index];
                }
                return null;
            },
            _getTrianglesLength: function(geometry) {
                if (geometry) {
                    return geometry.Mesh.triangles.length;
                }
                return 0;
            }
        });
        /**
         * @scope enchant.gl.collada.RootColladaSprite3D.prototype
         */
        enchant.gl.collada.RootColladaSprite3D = enchant.Class.create(enchant.gl.Sprite3D, {
            /**
            * Add animation clip.
            * Animation clip will be played in the order that it is added.
            * @param {String} clipId
            */
            pushAnimationClip: function(clipId){
                this.childNodes[1].pushAnimationClip(clipId);
            },
            /**
            * Delete added animation clip.
            */
            clearAnimationClip: function(){
                this.childNodes[1].clearAnimationClip();
            },
            getAnimationClip: function() {
                return this.childNodes[1].animationClips;
            },
            loop: {
                set: function(flag) {
                    this.childNodes[1].loop = flag;
                },
                get: function() {
                    return this.childNodes[1].loop;
                }
            }
        });
        /**
         * @scope enchant.gl.collada.ColladaSprite3D.prototype
         */
        enchant.gl.collada.ColladaSprite3D = enchant.Class.create(enchant.gl.collada.AbstractColladaSprite3D, {
            _getMesh: function(triangles) {
                return new enchant.gl.collada.ColladaMesh(triangles);
            },
            /**
             * Class to display Sprite3Ds created from a collada file.
             * The ColladaSprite3D class can be used as {@link enchant.gl.Sprite3D}.
             * This method is a factory method for ColladaSprite3D class which creates
             * a new hirachy of ColladaSprite3D from a collada Node.
             * @param {Node} node
             * @constructs
             * @extends enchant.gl.collada.AbstractColladaSprite3D
             */
            addColladaSprite3DFromNode: function(node) {
                var geometry = this.lib['geometries'][node.geometryUrl];
                var trianglesLength = this._getTrianglesLength(geometry);
                var currentTriangle = 0;
                do {
                    var sprite = new enchant.gl.collada.ColladaSprite3D(this.lib, node, this._getTriangles(geometry, currentTriangle));
                    if (node._datas['translate'][0]) {
                        var translate = node.parseFloatArray(node._datas['translate'][0]);
                        sprite.x = translate[0];
                        sprite.y = translate[1];
                        sprite.z = translate[2];
                    } else {
                        sprite.x = sprite.y = sprite.z = 0;
                    }
                    var rotation = [];
                    var rotateX = [1, 0, 0];
                    var rotateY = [0, 1, 0];
                    var rotateZ = [0, 0, 1];
                    for (var i = 0, l = node._datas['rotate'].length; i < l; i++) {
                        var rotate = node._datas['rotate'][i];
                        var sid = rotate.getAttribute('sid');
                        if (sid === 'rotateZ') {
                            rotateZ = node.parseFloatArray(rotate);
                        } else if (sid === 'rotateY') {
                            rotateY = node.parseFloatArray(rotate);
                        } else if (sid === 'rotateX') {
                            rotateX = node.parseFloatArray(rotate);
                        }
                    }
                    for (i = 0; i < 3; i++) {
                        rotation.push(rotateX[i], rotateY[i], rotateZ[i], 0);
                    }
                    rotation.push(0, 0, 0, 1);
                    sprite.rotation = rotation;
                    if (node._datas['matrix'][0]) {
                        var matrix = node.parseFloatArray(node._datas['matrix'][0]);
                        var transposed = [matrix[0], matrix[4], matrix[8], matrix[12], matrix[1], matrix[5], matrix[9], matrix[13], matrix[2], matrix[6], matrix[10], matrix[14], matrix[3], matrix[7], matrix[11], matrix[15]];
                        sprite.matrix = transposed;
                    } else {
                        sprite.matrix = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
                    }
                    if (node._datas['scale'][0]) {
                        var scale = node.parseFloatArray(node._datas['scale'][0]);
                        sprite.scaleX = scale[0];
                        sprite.scaleY = scale[1];
                        sprite.scaleZ = scale[2];
                    } else {
                        sprite.scaleX = sprite.scaleY = sprite.scaleZ = 1;
                    }
                    var poses;
                    if (node.nodes) {
                        for (var k in node.nodes) {
                            sprite.addColladaSprite3DFromNode(node.nodes[k], poses, length);
                        }
                    }
                    poses = [];
                    //var poselength = this.createPoses(node, poses, this.lib);
                    //if (poselength > 0) {
                        //sprite.addEventListener('enterframe', function() {
                            //var currentPose = this.getPose(poses, poselength)[node.sid];

                            // TODO : USE CURRENT POSE TO MODIFY SPRITE ROTATION / TRANSLATION
                            //var mat = new Quat();
                            //mat._quat = currentPose._rotation;
                            //console.log(currentPose._rotation);
                            //sprite.rotationApply(mat);
                            //                          var glMat = mat4.create();
                            //                          mat.toMat4(glMat);
                            //                          mat4.multiply(sprite._rotation, glMat);
                            //mat4.rotateX(sprite._rotation, currentPose._rotation[2]);
                            //mat4.rotateY(sprite._rotation, currentPose._rotation[1]);
                            //mat4.rotateZ(sprite._rotation, currentPose._rotation[0]);
                            //sprite._changedRotation = true;
                            //sprite.translate(currentPose._position[2],currentPose._position[1],currentPose._position[0]);
                        //});
                    //}
                    this.addChild(sprite);
                    currentTriangle++;
                } while (currentTriangle < trianglesLength);
            }
        });
        /**
         * @scope enchant.gl.collada.ColladaSprite3D.prototype
         */
        enchant.gl.collada.ColladaSkeletonSprite3D = enchant.Class.create(enchant.gl.collada.ColladaSprite3D, {
            /**
             * Base class used for collada Sprite3Ds.
             * This class should not be initialized directly.
             * @param {Object} lib
             * @param {Node} node
             * @param {Triangle} triangles
             * @constructs
             * @extends enchant.gl.collada.ColladaSprite3D
             */
            initialize: function(lib, node, triangles) {
                enchant.gl.collada.AbstractColladaSprite3D.call(this, lib, node, triangles);
                this.program = enchant.gl.collada.COLLADA_SHADER_PROGRAM;
                this.animation = [];
                this.defaultAnimation = function(){
                };
                this.animationClips = [];
                this.uMVMatrix = mat4.create();
                this.uNMatrix = mat3.create();
                this.applyAnimationChild = function() {
                    for (var cni = 0, cnl = this.childNodes.length; cni < cnl; cni++) {
                        this.childNodes[cni].defaultAnimation(this.childNodes[cni]);
                        this.childNodes[cni].applyAnimationChild();
                    }
                };
                this.addEventListener("enterframe", function() {
                    this.applyAnimationChild();
                    if (this.animation.length === 0) {
                    } else {
                        var first = this.animation[0];
                        first.frame++;
                        for(var i = 0, l = this.childNodes.length; i < l; i++) {
                            first.animation.enterframe(this.childNodes[i], first.frame);
                        }
                        if (first.frame >= this.animation[0].animation.length) {
                            first = this.animation.shift();
                            if (this.loop) {
                                first.frame = 0;
                                this.animation.push(first);
                            }
                        }
                    }
                });
            },
            pushAnimationClip: function(clipId) {
                if(this.animationClips[clipId]){
                    this.animation.push({animation: this.animationClips[clipId], frame: 0});
                }
            },
            clearAnimationClip: function() {
                this.animation = [];
            },
            _getMesh: function(triangles) {
                return new enchant.gl.collada.ColladaSkeletonSpriteMesh(triangles);
            },
            /**
             * Class to display Sprite3Ds created from a collada file with a skeletal animation.
             * The ColladaSprite3D class can be used as {@link enchant.gl.Sprite3D}.
             * This method is a factory method for ColladaSkeletonSprite3D class which creates
             * a new hirachy of ColladaSkeletonSprite3D from a collada Node.
             * @param {Node} node
             * @constructs
             * @extends enchant.gl.collada.ColladaSprite3D
             */
            addColladaSkeletonSprite3DFromNode: function(node, skin, skeleton, maxbonenum) {
                var controller = this.lib['controllers'][node.controllerUrl];
                var geometry = this.lib['geometries'][controller.skin.source];
                var trianglesLength = this._getTrianglesLength(geometry);
                var currentTriangle = 0;
                var makeEnterframe = function(poses, length, skin, maxbonem) {
                    return function(obj) {
                        skeleton.setPoses(obj.getPose(poses, length));
                        skeleton.solveFKs();
                        skeleton.calculateTableForIds(skin.ids);
                        obj.mesh.udBoneInfo = obj.calculateSkeletonTable(obj.divisioninfo.dividedIndices, skeleton.table, maxbonenum);
                    };
                };
                var makeClipEnterframe = function(poses, length, skin, maxbonem, clipId) {
                    return function(obj, frame) {
                        skeleton.setPoses(obj.getPose(poses, length, frame));
                        skeleton.solveFKs();
                        skeleton.calculateTableForIds(skin.ids);
                        obj.mesh.udBoneInfo = obj.calculateSkeletonTable(obj.divisioninfo.dividedIndices, skeleton.table, maxbonenum);
                    };
                };
                do {
                    var triangles = this._getTriangles(geometry, currentTriangle);
                    var child = new enchant.gl.collada.ColladaSkeletonSprite3D(this.lib, node, triangles);
                    var arrays = this.createStaticArrayForShader(triangles, skin, skeleton);
                    child.divisioninfo = this.getDivisionInfo(arrays, skeleton.table, maxbonenum);
                    this.addChild(child);

                    child.mesh.vpos1 = arrays.vectorFromBone1;
                    child.mesh.vpos2 = arrays.vectorFromBone2;
                    child.mesh.vpos3 = arrays.vectorFromBone3;

                    child.mesh.weights1 = arrays.weights1;
                    child.mesh.weights2 = arrays.weights2;

                    child.mesh.dividedpoints = child.divisioninfo.dividedPoint;
                    child.mesh.boneIndices = child.divisioninfo.boneIndices;
                    child.mesh.udBoneInfo = child.divisioninfo.skeletontable;
                    var poses = [];
                    var length = this.createPoses(node, poses, this.lib);
                    var posesclips = [];
                    var cliplength = this.createPosesClips(node, posesclips, this.lib);
                    for (var clk in cliplength) {
                        if (cliplength[clk] > 0) {
                            var clipenterframe = makeClipEnterframe(posesclips[clk], cliplength[clk], skin, maxbonenum, clk);
                            this.animationClips[clk] = {enterframe: clipenterframe, length: cliplength[clk]};
                        }
                    }
                    if (length > 0) {
                        child.defaultAnimation = makeEnterframe(poses, length, skin, maxbonenum);
                    }
                    currentTriangle++;
                } while (currentTriangle < trianglesLength);
            },
            calculateSkeletonTable: function(dividedIndices, table, n) {
                var skeletontable = [];
                var indices, index, postable, rottable;
                for (var i = 0, l = dividedIndices.length; i < l; i++) {
                    indices = dividedIndices[i];
                    postable = [];
                    rottable = [];
                    for (var j = 0, ll = indices.length; j < ll; j++) {
                        index = indices[j];
                        postable.push(
                            table.pos[index * 3],
                            table.pos[index * 3 + 1],
                            table.pos[index * 3 + 2]
                        );
                        rottable.push(
                            table.rot[index * 4],
                            table.rot[index * 4 + 1],
                            table.rot[index * 4 + 2],
                            table.rot[index * 4 + 3]
                        );
                    }
                    skeletontable.push({
                        pos: new Float32Array(postable),
                        rot: new Float32Array(rottable)
                    });
                }
                return skeletontable;
            },
            /**
             * スキニングの分割描画を行う境界を計算する.
             *
             */
            getDivisionInfo: function(arrays, table, n) {
                var dividedPoint = [0];
                var dividedIndices = [];
                var indices = [];
                var packedIndices = [];
                var count = 0;
                var index, packedIndex, num;
                for (var i = 0, l = arrays.boneIndices.length; i < l; i += 9) {
                    for (var j = 0; j < 9; j++) {
                        index = arrays.boneIndices[i + j];
                        num = indices.indexOf(index);
                        if (num === -1) {
                            indices.push(index);
                            packedIndex = indices.length - 1;
                        } else {
                            packedIndex = num;
                        }
                        packedIndices.push(packedIndex);
                        if (j === 8) {
                            if (indices.length > n) {
                                dividedPoint.push(i + 9);
                                dividedIndices.push(indices);
                                count++;
                                indices = [];
                            }
                        }
                    }
                }
                dividedPoint.push(packedIndices.length);
                dividedIndices.push(indices);
                return {
                    dividedPoint: dividedPoint,
                    dividedIndices: dividedIndices,
                    skeletontable: this.calculateSkeletonTable(dividedIndices, table, n),
                    boneIndices: new Uint16Array(packedIndices)
                };
            },
            createStaticArrayForShader: function(triangles, skin, skeleton) {
                var arraysForShader = {};
                var length = 0;
                var vectorForBones = [
                    [],
                    [],
                    []
                ];
                var weights = [
                    [],
                    []
                ];
                var boneIndices = [];
                var keys = [];
                var index, vec, rvec;
                rvec = vec3.create();
                for (var i = 0, l = triangles.primitives.length; i < l; i += triangles.stride) {
                    if (triangles.inputs['POSITIONoffset'] >= 0) {
                        length++;
                        index = triangles.primitives[i + triangles.inputs['POSITIONoffset']];
                        vec = [
                            triangles.inputs['POSITION'][index * 3],
                            triangles.inputs['POSITION'][index * 3 + 1],
                            triangles.inputs['POSITION'][index * 3 + 2]
                        ];
                        var count = -1;
                        keys.push(skin.vertex_weights[index]);
                        for (var key in skin.vertex_weights[index]) {
                            count++;
                            mat4.multiplyVec3(skin.joints[key], vec, rvec);
                            vectorForBones[count].push(rvec[0], rvec[1], rvec[2]);
                            boneIndices.push(skin.ids[key]);
                            if (count < 2) {
                                weights[count].push(skin.vertex_weights[index][key]);
                            } else {
                                break;
                            }
                        }
                        for (var j = count + 1; j < 3; j++) {
                            if (j < 2) {
                                weights[j].push(0);
                            }
                            vectorForBones[j].push(0, 0, 0);
                            boneIndices.push(0);
                        }
                    }
                }
                for (i = 0; i < 3; i++) {
                    arraysForShader['vectorFromBone' + (i + 1)] = new Float32Array(vectorForBones[i]);
                    if (i < 2) {arraysForShader['weights' + (i + 1)] = new Float32Array(weights[i]);}
                }
                arraysForShader.boneIndices = new Uint16Array(boneIndices);
                arraysForShader.keys = keys;
                return arraysForShader;
            },
            _render: function(detectTouch) {
                var core = enchant.Core.instance;
                var scene = core.currentScene3D;
                var l = scene.directionalLight;
                var detect = (detectTouch === 'detect') ? 1.0 : 0.0;
                mat4.multiply(scene._camera.mat, this.tmpMat, this.uMVMatrix);
                mat4.toInverseMat3(this.tmpMat, this.uNMatrix);
                mat3.transpose(this.uNMatrix);
                core.GL.currentProgram.setAttributes({
                    aVertexPosition: this.mesh._vertices,
                    aVertexNormal: this.mesh._normals,
                    aTextureCoord: this.mesh._texCoords,
                    aBoneIndices: this.mesh._boneIndices,
                    aVectorFromBone1: this.mesh._vpos1,
                    aVectorFromBone2: this.mesh._vpos2,
                    aVectorFromBone3: this.mesh._vpos3,
                    aBoneWeight1: this.mesh._weights1,
                    aBoneWeight2: this.mesh._weights2
                });
                core.GL.currentProgram.setUniforms({
                    uUseDirectionalLight: scene.useDirectionalLight,
                    uLightColor: l.color,
                    uDetectTouch: detect,
                    uAmbientLightColor: scene.ambientLight.color,
                    uPMatrix: scene._camera.projMat,
                    uMVMatrix: this.uMVMatrix,
                    uNMatrix: this.uNMatrix,
                    uLightDirection: [
                        l.directionX, l.directionY, l.directionZ
                    ],
                    uLookVec: [
                        scene._camera._centerX - scene._camera._x,
                        scene._camera._centerY - scene._camera._y,
                        scene._camera._centerZ - scene._camera._z
                    ]
                });
                var u = {
                    uDetectColor: this.detectColor,
                    uSpecular: this.mesh.texture.specular,
                    uDiffuse: this.mesh.texture.diffuse,
                    uEmission: this.mesh.texture.emission,
                    uAmbient: this.mesh.texture.ambient,
                    uShininess: this.mesh.texture.shininess
                };

                if (this.mesh.texture._image) {
                    u.uUseTexture = 1;
                    u.uSampler = this.mesh.texture;
                } else {
                    u.uUseTexture = 0;
                    u.uSampler = 0;
                }
                core.GL.currentProgram.setUniforms(u);
                for (var i = 0; i < this.mesh.dividedpoints.length - 1; i++) {
                    core.GL.currentProgram.setUniforms({
                        uBonePos: this.mesh.udBoneInfo[i]['pos'],
                        uBoneRot: this.mesh.udBoneInfo[i]['rot']
                    });
                    enchant.Core.instance.GL.renderElements(this.mesh._indices, this.mesh.dividedpoints[i] / 3 * 2, this.mesh.dividedpoints[i + 1] / 3 - this.mesh.dividedpoints[i] / 3);
                }
            }
        });
        var bufferProto = Object.getPrototypeOf(enchant.gl.Buffer);
        bufferProto.MORPHS = bufferProto.NORMALS;
        bufferProto.QUATS = bufferProto.COLORS;
        bufferProto.BONE_INDICES = {
            size: 3,
            type: 5123,
            normed: false,
            stride: 0,
            offset: 0,
            btype: 34962,
            Atype: Uint16Array
        };
        bufferProto.WEIGHTS = {
            size: 1,
            type: 5126,
            norm: false,
            stride: 0,
            offset: 0,
            btype: 34962,
            Atype: Float32Array
        };
        var COLLADA_VERTEX_SHADER_SOURCE = '\n\
            uniform mat4 uMVMatrix;\n\
            uniform mat4 uPMatrix;\n\
            uniform mat3 uNMatrix;\n\
            \n\
            uniform vec3 uBonePos[55];\n\
            uniform vec4 uBoneRot[55];\n\
            \n\
            attribute vec3 aBoneIndices;\n\
            attribute vec3 aVertexNormal;\n\
            attribute vec2 aTextureCoord;\n\
            \n\
            attribute float aBoneWeight1;\n\
            attribute float aBoneWeight2;\n\
            attribute vec3 aVectorFromBone1;\n\
            attribute vec3 aVectorFromBone2;\n\
            attribute vec3 aVectorFromBone3;\n\
            \n\
            varying vec3 vNormal;\n\
            varying vec4 vColor;\n\
            varying vec2 vTextureCoord;\n\
            \n\
            \n\
            vec3 qtransform(vec4 q, vec3 v) {\n\
                return v + 2.0 * cross(cross(v, q.xyz) - q.w*v, q.xyz);\n\
            }\n\
            \n\
            void main() {\n\
                int  index[3];\n\
                index[0] = int(aBoneIndices.x);\n\
                index[1] = int(aBoneIndices.y);\n\
                index[2] = int(aBoneIndices.z);\n\
                \n\
                float w3 = 1.0 - aBoneWeight1 - aBoneWeight2;\n\
                \n\
                vec3 position = (qtransform(uBoneRot[index[0]], aVectorFromBone1) + uBonePos[index[0]]) * aBoneWeight1\n\
                        + (qtransform(uBoneRot[index[1]], aVectorFromBone2) + uBonePos[index[1]]) * aBoneWeight2\n\
                        + (qtransform(uBoneRot[index[2]], aVectorFromBone3) + uBonePos[index[2]]) * w3;\n\
                vec3 normal = qtransform(uBoneRot[index[0]], aVertexNormal) * aBoneWeight1\n\
                        + qtransform(uBoneRot[index[1]], aVertexNormal) * aBoneWeight2\n\
                        + qtransform(uBoneRot[index[2]], aVertexNormal) * w3;\n\
                \n\
                gl_Position = uPMatrix * uMVMatrix * vec4(position, 1.0);\n\
                vColor = vec4(1,1,1,1);\n\
                vTextureCoord = aTextureCoord;\n\
                vNormal = normalize(uNMatrix * normal);\n\
                vNormal = normalize(uNMatrix * aVertexNormal);\n\
            }\n\
            ';

        enchant.gl.Core.prototype._original_start = enchant.gl.Core.prototype.start;
        enchant.gl.Core.prototype.start = function() {
            enchant.gl.collada.COLLADA_SHADER_PROGRAM = new enchant.gl.Shader(COLLADA_VERTEX_SHADER_SOURCE, enchant.Core.instance.GL.defaultProgram._fShaderSource);
            this._original_start();
        };
        var ColladaLibraryLoader = enchant.Class.create({
            initialize: function(libraryName, libraryPropertyName, className) {
                this.libraryName = libraryName;
                this.libraryPropertyName = libraryPropertyName;
                this.className = className;
                this.library = {};
            },
            loadLibraryFromXML: function(colladaRootElement, url) {
                var libraries = colladaRootElement.getElementsByTagName('library_' + this.libraryName);
                this.library = {};
                var props = [];
                if (libraries.length > 0) {
                    for (var ci = 0, cl = libraries[0].childNodes.length; ci < cl; ci++) {
                        if (libraries[0].childNodes[ci].nodeName === this.libraryPropertyName) {
                            props.push(libraries[0].childNodes[ci]);
                        }
                    }
                }
                var childNodes=colladaRootElement.childNodes;
                if (this.libraryPropertyName === "node") {
                    props = colladaRootElement.getElementsByTagName(this.libraryPropertyName);
                }
                for (var i = 0, l = props.length; i < l; i++) {
                    var child = props[i];
                    this.library[child.getAttribute('id')] = new this.className(child, url);
                    if (this.libraryPropertyName === "animation_clip") {
                        this.library[child.getAttribute('id')].start=child.getAttribute('start');
                        this.library[child.getAttribute('id')].end=child.getAttribute('end');
                    }
                }
                return this.library;
            }
        });
        var availableLibraryFeatures = [new ColladaLibraryLoader('images', 'image', Image), new ColladaLibraryLoader('geometries', 'geometry', Geometry), new ColladaLibraryLoader('nodes', 'node', Node), new ColladaLibraryLoader('visual_scenes', 'visual_scene', VisualScene), new ColladaLibraryLoader('materials', 'material', Material), new ColladaLibraryLoader('effects', 'effect', Effect), new ColladaLibraryLoader('controllers', 'controller', Controller), new ColladaLibraryLoader('animations', 'animation', Animation), new ColladaLibraryLoader('animation_clips', 'animation_clip', AnimationClip)];
    }());
}
