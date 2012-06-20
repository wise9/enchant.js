/**
[lang:ja]
 * collada.gl.enchant.js
 * @version v0.3.5
 * @require gl.enchant.js v0.3.1+
 * @author Ubiquitous Entertainment Inc.
 *
 * @description
 * gl.enchant.jsでcolladaファイル(.dae)を読み込むためのプラグイン
 *
 * @detail
 * ベクトル・行列演算にglMatrix.jsを使用しています.
 * glMatrix.js:
 * http://code.google.com/p/glmatrix/
 * glMatrix.jsの詳しい使い方:
 * http://code.google.com/p/glmatrix/wiki/Usage
 [/lang]
 [lang:en]
 * collada.gl.enchant.js
 * @version v0.3.5
 * @require gl.enchant.js v0.3.1+
 * @author Ubiquitous Entertainment Inc.
 *
 * @description
 * Plugin to load collada format (.dae) files on gl.enchant.js
 *
 * @detail
 * Uses glMatrix.js in hectors and matrix operations.
 * glMatrix.js:
 * http://code.google.com/p/glmatrix/
 * For more information on glMatrix.js usage:
 * http://code.google.com/p/glmatrix/wiki/Usage
 [/lang]
 */

if (enchant.gl != undefined) {
    enchant.Game._loadFuncs['dae'] = function(src, callback) {
        if (callback == null) callback = function() {};
        enchant.gl.Sprite3D.loadCollada(src, function(collada, src){
            enchant.Game.instance.assets[src] = collada;
            callback();
        });
    };

    (function(){
        /**
        [lang:ja]
         * ColladaデータからSprite3Dを作成する.
         * 現在, ジョイント, アニメーションを含むデータに対応していません.
         * また, 頂点属性がtrianglesである必要があります.
         * @example
         *   var scene = new Scene3D();
         *   Sprite3D.loadCollada("hoge.dae",　function(model){
         *       scene.addChild(model);
         *   });
         * @param {String} url コラーダモデルのURL
         * @param {function(enchant.pro.Sprite3D)} onload ロード完了時のコールバック 引数にはモデルから生成されたSprite3Dが渡される
         * @static
        [/lang]
        [lang:en]
         * Create Sprite3D from Collada data.
         * At present, data that has joint and animation is not supported.
         * In addition, vertex attributes should be triangles.
         * @example
         *   var scene = new Scene3D();
         *   Sprite3D.loadCollada("hoge.dae",　function(model){
         *       scene.addChild(model);
         *   });
         * @param {String} url Collada model URL,
         * @param {function(enchant.pro.Sprite3D)} onload Callback when loading is complete. Sprite3D created from model will be delivered to argument
         * @static
        [/lang]
         */
        enchant.gl.Sprite3D.loadCollada = function(url, onload){
            var _this = this;
            this.url = url;
            if (typeof onload != "function") {
                throw new Error('Argument must be function');
                return null;
            }
            else {
                _this.onload = onload;
            }
            var collada = new Collada();
            var that = this;
            collada.onload = function(model){
                var root = new Sprite3D();
                model.getCorrespondingGeometry = function(node){
                    for(var i = 0; i < this.geometries.length; i++){
                        if(node.url == this.geometries[i].id){
                            return this.geometries[i];
                        }
                    }
                    return null;
                };
                function createSprite3D(model, node, geometry){
                    var mesh = geometry.meshes[0];
                    var ep_mesh = new Sprite3D();
                    ep_mesh.mesh = new Mesh();
                    var texture = ep_mesh.mesh.texture;
                    var material = mesh.material;
                    if (material) {
                        texture.src = material.src;
                    }
                    if(node.instance_material_target){
                        var target = node.instance_material_target;
                        var material = collada.getMaterialById(target);
                        if(material){
                            var instanceEffectUrl = material.instanceEffect.url;
                            var effect = collada.getEffectById(instanceEffectUrl);
                            if (effect && effect.profileCommon && effect.profileCommon.surface &&
                                effect.profileCommon.surface.initFrom) {
                                var img = that.getImageById(effect.profileCommon.surface.initFrom)
                                if (img) {
                                    texture.src = img.initFrom;
                                }
                            }
                            if(effect && effect.profileCommon && effect.profileCommon.technique &&
                                effect.profileCommon.technique.phong){
                                texture.emission = effect.profileCommon.technique.phong.emission;
                                texture.ambient = effect.profileCommon.technique.phong.ambient;
                                texture.diffuse = effect.profileCommon.technique.phong.diffuse;
                                texture.specular = effect.profileCommon.technique.phong.specular;
                                texture.shininess = effect.profileCommon.technique.phong.shininess;
                            }
                        }
                    }

                    ep_mesh.mesh.vertices = mesh.vertices;
                    var colors = [];
                    for(var i = 0; i < ep_mesh.mesh.vertices.length / 3; i++){
                        colors[colors.length] = 1.0;
                        colors[colors.length] = 1.0;
                        colors[colors.length] = 1.0;
                        colors[colors.length] = 1.0;
                    }
                    ep_mesh.mesh.colors = colors;
                    ep_mesh.mesh.normals = mesh.normals;
                    ep_mesh.mesh.texCoords = mesh.uv;
                    ep_mesh.mesh.indices = mesh.indices;
                    if(node.translate){
                        ep_mesh.x = node.translate[0];
                        ep_mesh.y = node.translate[1];
                        ep_mesh.z = node.translate[2];
                    }else{
                        ep_mesh.x = ep_mesh.y = ep_mesh.z = 0;
                    }
                    var rotation = new Array();
                    if (node.rotateX && node.rotateY && node.rotateZ) {
                        rotation.push(node.rotateX[0], node.rotateY[0], node.rotateZ[0], 0);
                        rotation.push(node.rotateX[1], node.rotateY[1], node.rotateZ[1], 0);
                        rotation.push(node.rotateX[2], node.rotateY[2], node.rotateZ[2], 0);
                    } else {
                        rotation.push(1,0,0,0,0,1,0,0,0,0,1,0);
                    }
                    rotation.push(0, 0, 0, 1);
                    ep_mesh.rotation = rotation;

                    if(node.matrix){
                        var transposed = [
                            node.matrix[0], node.matrix[4], node.matrix[8], node.matrix[12],
                            node.matrix[1], node.matrix[5], node.matrix[9], node.matrix[13],
                            node.matrix[2], node.matrix[6], node.matrix[10], node.matrix[14],
                            node.matrix[3], node.matrix[7], node.matrix[11], node.matrix[15],
                        ];
                        ep_mesh.matrix = transposed;
                    }else{
                        ep_mesh.matrix = [
                            1, 0, 0, 0,
                            0, 1, 0, 0,
                            0, 0, 1, 0,
                            0, 0, 0, 1];
                    }
                    if(node.scale){
                        ep_mesh.scaleX = node.scale[0];
                        ep_mesh.scaleY = node.scale[1];
                        ep_mesh.scaleZ = node.scale[2];
                    }else{
                        ep_mesh.scaleX = ep_mesh.scaleY = ep_mesh.scaleZ = 1;
                    }
                    ep_mesh.name = geometry.id;
                    if(node.nodes){
                        for(var i = 0; i < node.nodes.length; i++){
                            var childNode = node.nodes[i];
                            var childGeometry = model.getCorrespondingGeometry(childNode);
                            if(childGeometry) ep_mesh.addChild(createSprite3D(model, childNode, childGeometry));
                        }
                    }
                    return ep_mesh;
                }
                for (var i = 0; i < model.visualScene.nodes.length; i++) {
                    var node = model.visualScene.nodes[i];
                    var geometry = model.getCorrespondingGeometry(node);
                    if(geometry) root.addChild(createSprite3D(model, node, geometry));
                }
                _this.onload(root, url);
            };
            collada.loadModel(url);
        }

        function Collada() {
            var _this = this;
            this.debug = true;
            this.materials = new Array();
            this.geometries = new Array();
            this.effects = new Array();
            this.images = new Array();
            this.getEffectById = function(id){
                for(var i = 0; i < this.effects.length; i++){
                    if(this.effects[i].id == id) return this.effects[i];
                }
                return null;
            }
            this.getMaterialById = function(id){
                for(var i = 0; i < this.materials.length; i++){
                    if(this.materials[i].id == id) return this.materials[i];
                }
                return null;
            }
            this.getGeometryById = function(id){
                for(var i = 0; i < this.geometries.length; i++){
                    if(this.geometries[i].id == id) return this.geometries[i];
                }
                return null;
            }
            this.getImageById = function(id){
                for(var i = 0; i < this.images.length; i++){
                    if(this.images[i].id == id) return this.images[i];
                }
                return null;
            }

            function getParentDirectory(path){
                var strary = path.split("/");
                var result = "";
                for (var i = 0; i < strary.length - 1; i++) {
                    result += strary[i] + "/";
                }
                return result;
            }

            function parseFloatArray(str){
                var array = new Array();
                var floatStrings = str.split(" ");
                for (var k = 0; k < floatStrings.length; k++) {
                    array.push(parseFloat(floatStrings[k]));
                }
                return array;
            }
            function parseIntArray(str){
                var array = new Array();
                var intStrings = str.split(" ");
                for (var k = 0; k < intStrings.length; k++) {
                    array.push(parseInt(intStrings[k]));
                }
                return array;
            }

            this.loadModel = function(url){
                var req = new XMLHttpRequest();
                req.open("GET", url, true);
                req.onload = function(){
                    var xml = req.responseXML;
                    loadImage(xml, url);
                    loadMaterials(xml);
                    loadEffects(xml);
                    loadGeometries(xml);
                    loadVisualScenes(xml);
                    var model = _this.convert();
                    _this.onload(model);
                }
                req.send(null);
            }

            function loadGeometries(xml){
                var geometries = xml.getElementsByTagName("library_geometries")[0].getElementsByTagName("geometry");
                for (var i = 0; i < geometries.length; i++) {
                    _this.geometries.push(new Geometry(geometries[i]));
                }
            }
            function Geometry(xml){
                var _this = this;
                this.id = xml.getAttribute("id");
                this.meshes = new Array();
                var meshes = xml.getElementsByTagName("mesh");
                for (var i = 0; i < meshes.length; i++) {
                    var mesh = meshes[i];
                    this.meshes.push(new Mesh(mesh));
                }
                function Mesh(xml){
                    var _this = this;

                    var triangles = xml.getElementsByTagName("triangles")[0];
                    this.triangles = new Triangles(triangles);
                    var vertices = xml.getElementsByTagName("vertices")[0];
                    this.verticesInfo = new Vertices(vertices);

                    var sources = xml.getElementsByTagName("source");
                    for (var i = 0; i < sources.length; i++) {
                        var source = sources[i];
                        var id = source.getAttribute("id");
                        if (id == this.verticesInfo.positionId) {
                            this.vertices = parseFloatArray(source.getElementsByTagName("float_array")[0].textContent);
                        }
                        else if (id == this.triangles.normalId) {
                            this.normals = parseFloatArray(source.getElementsByTagName("float_array")[0].textContent);
                        }else if (id == this.triangles.uvId) {
                            this.uv = parseFloatArray(source.getElementsByTagName("float_array")[0].textContent);
                            for(var i = 1; i < this.uv.length; i+=2){
                                this.uv[i] = 1.0 - this.uv[i];
                            }
                        }
                    }

                    function Triangles(xml){

                        var _this = this;
                        this.count = xml.getAttribute("count");
                        this.material = xml.getAttribute("material");

                        var inputs = xml.getElementsByTagName("input");
                        this.stride = 0;

                        this.vertexOffset = -1;
                        this.normalOffset = -1;
                        this.uvOffset = -1;
                        for (var i = 0; i < inputs.length; i++) {
                            var input = inputs[i];
                            var semantic = input.getAttribute("semantic");
                            var offset = parseInt(input.getAttribute("offset"));
                            if(offset + 1 > this.stride) this.stride = offset + 1;
                            if (semantic == "VERTEX") {
                                if (offset || offset == 0) {
                                    _this.vertexOffset = offset;
                                }
                                _this.vertexId = input.getAttribute("source").replace("#", "");
                            }else if (semantic == "NORMAL") {
                                if (offset || offset == 0) {
                                    _this.normalOffset = offset;
                                }
                                _this.normalId = input.getAttribute("source").replace("#", "");
                            }else if (semantic == "TEXCOORD") {
                                if (offset || offset == 0) {
                                    _this.uvOffset = offset;
                                }
                                _this.uvId = input.getAttribute("source").replace("#", "");
                            }
                        }
                        this.primitive = parseFloatArray(xml.getElementsByTagName("p")[0].textContent);

                    }
                    function Vertices(xml){
                        var _this = this;
                        var inputs = xml.getElementsByTagName("input");
                        for (var i = 0; i < inputs.length; i++) {
                            var input = inputs[i];
                            var semantic = input.getAttribute("semantic");
                            if (semantic == "POSITION") {
                                this.positionId = input.getAttribute("source").replace("#", "");
                            }else if (semantic == "NORMAL") {
                                this.normalId = input.getAttribute("source").replace("#", "");
                            }
                        }
                    }
                }
            }

            function loadImage(xml, url){
                var lib_images = xml.getElementsByTagName("library_images")[0];
                if (lib_images) {
                    var imgs = lib_images.getElementsByTagName("image");
                } else {
                    var imgs = [];
                }
                for (var i = 0; i < imgs.length; i++) {
                    _this.images.push(new Image(imgs[i], url));
                }
            }

            function Image(xml, url){
                this.id = xml.getAttribute("id");
                this.name = xml.getAttribute("name");
                var init_from = xml.getElementsByTagName("init_from")[0];
                if (init_from) {
                    this.initFrom = init_from.textContent;
                    if (this.initFrom.substr(0, 4) != "http") {
                        if (this.initFrom.substr(0, 2) == "./") {
                            this.initFrom = this.initFrom.substr(2, this.initFrom.length - 2);
                        }
                        this.initFrom = getParentDirectory(url) + this.initFrom;
                    }
                }
            }

            function loadEffects(xml){
                var effects = xml.getElementsByTagName("effect");
                for (var i = 0; i < effects.length; i++) {
                    _this.effects.push(new Effect(effects[i]));
                }

            }

            function Effect(xml){
                var _this = this;
                this.id = xml.getAttribute("id");
                var profile_common = xml.getElementsByTagName("profile_COMMON")[0];
                this.profileCommon = new ProfileCommon(profile_common);
                function ProfileCommon(xml){
                    var _this = this;
                    this.technique;
                    this.surface;

                    var technique = xml.getElementsByTagName("technique")[0];
                    if (technique) {
                        this.technique = new Technique(technique);
                    }

                    var newParams = xml.getElementsByTagName("newparam");
                    for (var i = 0; i < newParams.length; i++) {
                        var surface = newParams[i].getElementsByTagName("surface")[0];
                        if (surface) {
                            this.surface = new Surface(surface);
                        }
                    }
                    function Surface(xml){
                        var _this = this;

                        this.type = xml.getAttribute("type");
                        var initFrom = xml.getElementsByTagName("init_from")[0];
                        if (initFrom) {
                            this.initFrom = initFrom.textContent;
                        }
                        var format = xml.getElementsByTagName("format")[0];
                        if (format) {
                            this.format = format.textContent;
                        }
                    }

                    function Technique(xml){
                        var _this = this;

                        var phong = xml.getElementsByTagName("phong")[0];
                        if (phong) {
                            this.phong = new Phong(phong);
                        }
                        function Phong(xml){
                            var _this = this;
                            this.emission = [0, 0, 0, 1];
                            this.ambient = [0.3, 0.3, 0.3, 1];
                            this.diffuse = [1, 1, 1, 1];
                            this.specular = [0, 0, 0, 1];
                            this.shininess = 100;
                            this.reflective = [0, 0, 0, 1];
                            this.reflectivity = 0.1;
                            this.transparent = [0, 0, 0, 1];
                            this.transparency = 1.0;

                            var props = [
                                'emission', 'ambient', 'diffuse',
                                'specular', 'shininess', 'refrective',
                                'refrectivity', 'transparent', 'transparency'
                            ];
                            var temp;
                            var property;
                            var body;
                            for (var i = 0, l = props.length; i < l; i++) {
                                property = props[i];
                                body = xml.getElementsByTagName(property);
                                if (body.length == 1) {
                                    temp = body[0].getElementsByTagName('color');
                                    if (temp.length == 1) {
                                        this[property] = parseFloatArray(temp[0].textContent);
                                        temp = false;
                                    }
                                }
                            }
                        }
                    }
                }
            }

            function loadMaterials(xml){
                var materials = xml.getElementsByTagName("library_materials")[0].getElementsByTagName("material");
                for (var i = 0; i < materials.length; i++) {
                    _this.materials.push(new Material(materials[i]));
                }
            }

            function Material(xmlMaterial){
                var _this = this;
                var instance_effects_xml = xmlMaterial.getElementsByTagName("instance_effect");
                this.id = xmlMaterial.getAttribute("id");
                this.name = xmlMaterial.getAttribute("name");
                this.instanceEffect = new InstanceEffect(instance_effects_xml[0]);
                this.emission = [0, 0, 0, 1];
                this.ambient = [0.3, 0.3, 0.3, 1];
                this.diffuse = [1, 1, 1, 1];
                this.specular = [0, 0, 0, 1];
                this.shininess = [0, 0, 0, 1];

                var setParams = xmlMaterial.getElementsByTagName("setparam");
                for (var i = 0; i < setParams.length; i++) {
                    var param = setParams[i];
                    var ref = param.getAttribute("ref");
                    var val = param.firstChild.nodevalue;
                    if (ref == "DIFFUSE") {
                        _this.diffuse = parseFloatArray(val);
                    }else if (ref == "AMBIENT") {
                        _this.ambient = parseFloatArray(val);
                    }else if (ref == "EMISSION") {
                        _this.emission = parseFloatArray(val);
                    }else if (ref == "SPECULAR") {
                        _this.specular = parseFloatArray(val);
                    }else if (ref == "SHININESS") {
                        _this.shininess = parseFloatArray(val);
                    }
                }

                function InstanceEffect(xml){
                    var _this = this;
                    this.url = xml.getAttribute("url");
                    this.url = this.url.slice(1);
                }
            }

            function loadVisualScenes(xml){
                var visualScenes = xml.getElementsByTagName("visual_scene");
                _this.visualScenes = new Array();
                for (var i = 0; i < visualScenes.length; i++) {
                    var visualScene = visualScenes[i];
                    _this.visualScenes.push(new VisualScene(visualScene));
                }
            }

            function VisualScene(xml){
                function Node(xml){
                    var _this = this;
                    this.id = xml.getAttribute("id");
                    this.name = xml.getAttribute("name");

                    var translate = xml.getElementsByTagName("translate")[0];
                    if (translate) {
                        this.translate = parseFloatArray(translate.textContent);
                    }
                    var rotates = xml.getElementsByTagName("rotate");
                    for (var i = 0; i < rotates.length; i++) {
                        var rotate = rotates[i];
                        var sid = rotate.getAttribute("sid");
                        if (sid == "rotateZ") {
                            this.rotateZ = parseFloatArray(rotate.textContent);
                        }else if (sid == "rotateY") {
                            this.rotateY = parseFloatArray(rotate.textContent);
                        }else if (sid == "rotateX") {
                            this.rotateX = parseFloatArray(rotate.textContent);
                        }
                    }
                    var scale = xml.getElementsByTagName("scale")[0];
                    if (scale) {
                        this.scale = parseFloatArray(scale.textContent);
                    }
                    var matrix = xml.getElementsByTagName("matrix")[0];
                    if(matrix){
                        this.matrix = parseFloatArray(matrix.textContent);
                    }
                    var instance_geometry = xml.getElementsByTagName("instance_geometry")[0];
                    if (instance_geometry) {
                        var url = instance_geometry.getAttribute("url");
                        if (url) {
                            this.url = url.replace("#", "");
                        }
                        var instance_material = instance_geometry.getElementsByTagName("instance_material")[0];
                        if(instance_material){
                            var target = instance_material.getAttribute("target");
                            if(target){
                                this.instance_material_target = target.replace("#", "");
                            }
                        }
                    }
                }

                function getNodeHierarchy(element){
                    var array = [];
                    for(var i = 0; i < element.childNodes.length; i++){
                        var child = element.childNodes[i];
                        if(child.nodeName == 'node'){
                            var childNode = new Node(child);
                            array.push(childNode);
                            var grandChildren = getNodeHierarchy(child);
                            if(grandChildren) childNode.nodes = grandChildren;
                        }
                    }
                    return array;
                }

                var _this = this;
                this.id = xml.getAttribute("id");
                this.name = xml.getAttribute("name");
                this.nodes = getNodeHierarchy(xml);
            }

            this.onload = function(){
            }

            this.convert = function(){
                var model = new EPModel();
                var resultGeometries = new Array();
                for (var i = 0; i < _this.geometries.length; i++) {
                    var geometry = _this.geometries[i];
                    var resultGeometry = new Object();
                    resultGeometry.id = geometry.id;
                    resultGeometry.meshes = new Array();
                    for (var j = 0; j < geometry.meshes.length; j++) {

                        var mesh = geometry.meshes[j];
                        var resultMesh = new Object();
                        var triangles = mesh.triangles;
                        resultMesh.vertices = new Array();
                        resultMesh.normals = new Array();
                        resultMesh.uv = new Array();
                        resultMesh.indices = new Array();
                        for (var k = 0; k < triangles.primitive.length; k += triangles.stride) {
                            if (triangles.vertexOffset >= 0) {
                                var index = triangles.primitive[k + triangles.vertexOffset] * 3;
                                resultMesh.vertices.push(mesh.vertices[index], mesh.vertices[index + 1], mesh.vertices[index + 2]);
                            }
                            if (triangles.normalOffset >= 0) {
                                var index = triangles.primitive[k + triangles.normalOffset] * 3;
                                resultMesh.normals.push(mesh.normals[index], mesh.normals[index + 1], mesh.normals[index + 2]);
                            } else {
                                resultMesh.normals.push(0, 0, 1);
                            }
                            if (triangles.uvOffset >= 0) {
                                var index = triangles.primitive[k + triangles.uvOffset] * 2;
                                resultMesh.uv.push(mesh.uv[index], 1.0 - mesh.uv[index + 1]);
                            } else {
                                resultMesh.uv.push(0, 0);
                            }
                        }

                        for (var k = 0; k < triangles.primitive.length / triangles.stride; k++) {
                            resultMesh.indices.push(k);
                        }

                        var material = false;
                        for (k = 0; k < _this.materials.length; k++) {
                            if (_this.materials[k].id == triangles.material) {
                                material = _this.materials[k];
                            }
                        }
                        if (material) {
                            var effect = false;
                            for (var k = 0; k < _this.effects.length; k++) {
                                if (_this.effects[k].id == material.instanceEffect.url) {
                                    effect = _this.effects[k];
                                    break;
                                }
                            }
                            if (effect) {
                                var profileCommon = effect.profileCommon;
                                var technique = profileCommon.technique;
                                var phong = technique.phong;
                                var rm = [];
                                var initfrom = null;
                                if (profileCommon.surface) {
                                    initfrom = profileCommon.surface.initFrom;
                                }
                                var images = _this.images;
                                for (var l = 0; l < images.length; l++) {
                                    if (images[l].id == initfrom) {
                                        rm.src = images[l].initFrom;
                                        break;
                                    }
                                }

                                rm.emission = material.emission;
                                rm.ambient = material.ambient;
                                rm.diffuse = material.diffuse;
                                rm.specular = material.specular;
                                rm.shininess = material.shininess
                                resultMesh.material = rm;
                            }
                        }
                        resultGeometry.meshes.push(resultMesh);
                    }
                    resultGeometries.push(resultGeometry);
                }
                model.geometries = resultGeometries;
                var visualScene = _this.visualScenes[0];
                if (visualScene) {
                    model.visualScene = visualScene;
                }

                return model;
            }


            function EPModel(){
                var _this = this;
                this.geometries = new Array();


                function Geometry(){
                    this.meshes = new Array();
                }
                function Mesh(){
                    this.vertices = new Array();
                    this.normals = new Array();
                    this.uv = new Array();
                    this.indices = new Array();
                    this.material;
                }
                function Material(){
                    this.emission = [0, 0, 0, 1];
                    this.ambient = [0.3, 0.3, 0.3, 1];
                    this.diffuse = [1, 1, 1, 1];
                    this.specular = [0, 0, 0, 1];
                    this.shininess = [0, 0, 0, 1];
                }
            }
        }
    })();
}
