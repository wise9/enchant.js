/**
 [lang:ja]
 * primitive.gl.enchant.js
 * @version 0.3.2
 * @require gl.enchant.js v0.3.1+
 * @author Ubiquitous Entertainment Inc.
 *
 * @description
 * gl.enchant.js で使える基本立体オブジェクト
 [/lang]
 [lang:en]
 * primitive.gl.enchant.js
 * @version 0.3.2
 * @require gl.enchant.js v0.3.1+
 * @author Ubiquitous Entertainment Inc.
 *
 * @description
 * Primitive objects for gl.enchant.js
 [/lang]
 */
if(enchant.gl != undefined){
	(function(){
        enchant.gl.primitive = {};
        enchant.gl.primitive.Plane = enchant.Class.create(enchant.gl.Sprite3D, {
            initialize: function(scale) {
                enchant.gl.Sprite3D.call(this);
                this.mesh = Mesh.createPlane(scale);
            }
        });
        enchant.gl.primitive.PlaneXY = enchant.Class.create(enchant.gl.Sprite3D, {
            initialize: function(scale) {
                enchant.gl.Sprite3D.call(this);
                this.mesh = Mesh.createPlaneXY(scale);
            }
        });
        enchant.gl.primitive.PlaneYZ = enchant.Class.create(enchant.gl.Sprite3D, {
            initialize: function() {
                enchant.gl.Sprite3D.call(this);
                this.mesh = Mesh.createPlaneYZ(scale);
            }
        });
        enchant.gl.primitive.PlaneXZ = enchant.Class.create(enchant.gl.Sprite3D, {
            initialize: function(scale) {
                enchant.gl.Sprite3D.call(this);
                this.mesh = Mesh.createPlaneXZ(scale);
            }
        });
        enchant.gl.primitive.Billboard = enchant.Class.create(enchant.gl.primitive.Plane, {
            initialize: function(scale) {
                var game = enchant.Game.instance;
                enchant.gl.primitive.Plane.call(this, scale);
                this.addEventListener('enterframe', function() {
                    if (game.currentScene3D._camera) {
                        this.rotation = game.currentScene3D.cameraMatInverse;
                    }
                });
            }
        });
        enchant.gl.primitive.BillboardAnimation = enchant.Class.create(enchant.gl.primitive.Billboard, {
            initialize: function(divide, scale) {
                enchant.gl.primitive.Billboard.call(this, scale);
                if (typeof divide != 'undefined') {
                    this.divide = divide;
                } else {
                    this.divide = 4;
                }
                this.frame = 0;
            },
            frame: {
                get: function() {
                    return this._frame;
                },
                set: function(frame) {
                    this._frame = frame;
                    var left = (frame % this.divide) / this.divide;
                    var top = 1 - ((frame / this.divide) | 0) / this.divide;
                    var right = left + (1 / this.divide);
                    var bottom = top - (1 / this.divide);
                    this.mesh.texCoords = [
                        right, top,
                        left, top,
                        left, bottom,
                        right, bottom
                    ];
                }
            }
        });
        enchant.gl.primitive.BillboardY = enchant.Class.create(enchant.gl.primitive.Plane, {
            initialize: function(scale) {
                var game = enchant.Game.instance;
                enchant.gl.primitive.Plane.call(this, scale);
                this.addEventListener('render', function() {
                    if (game.currentScene3D._camera) {
                        this.rotation = game.currentScene3D.cameraMatInverseY;
                    }
                });
            }
        });
        enchant.gl.primitive.Box = enchant.Class.create(enchant.gl.Sprite3D, {
            initialize: function(sx, sy, sz) {
                enchant.gl.Sprite3D.call(this);
                this.mesh = Mesh.createBox(sx, sy, sz);
            }
        });
        enchant.gl.primitive.Cube = enchant.Class.create(enchant.gl.Sprite3D, {
            initialize: function(scale) {
                enchant.gl.Sprite3D.call(this);
                this.mesh = Mesh.createCube(scale);
            }
        });
        enchant.gl.primitive.Sphere = enchant.Class.create(enchant.gl.Sprite3D, {
            initialize: function(r, v, h) {
                enchant.gl.Sprite3D.call(this);
                this.mesh = Mesh.createSphere(r, v, h);
            }
        });
        enchant.gl.primitive.Cylinder = enchant.Class.create(enchant.gl.Sprite3D, {
            initialize: function(r, h, v) {
                enchant.gl.Sprite3D.call(this);
                this.mesh = Mesh.createCylinder(r, h, v);
            }
        });

        var proto = Object.getPrototypeOf(enchant.gl.Mesh);
        proto._createPlane = function(type, scale) {
            if (typeof scale == 'undefined') {
                scale = 0.5;
            }
            var mesh = new enchant.gl.Mesh();
            var vertices;
            switch (type) {
                case 'yz':
                    vertices = [
                         0.0,  1.0,  1.0,
                         0.0, -1.0,  1.0,
                         0.0, -1.0, -1.0,
                         0.0,  1.0, -1.0,
                    ];
                    mesh.normals = [
                        1.0, 0.0, 0.0,
                        1.0, 0.0, 0.0,
                        1.0, 0.0, 0.0,
                        1.0, 0.0, 0.0,
                    ];
                break;

                case 'xz':
                    vertices = [
                         1.0,  0.0,  1.0,
                        -1.0,  0.0,  1.0,
                        -1.0,  0.0, -1.0,
                         1.0,  0.0, -1.0,
                    ];
                    mesh.normals = [
                        0.0, 1.0, 0.0,
                        0.0, 1.0, 0.0,
                        0.0, 1.0, 0.0,
                        0.0, 0.0, 0.0,
                    ];
                break;

                case 'xy':
                default:
                    vertices = [
                         1.0,  1.0, 0.0,
                        -1.0,  1.0, 0.0,
                        -1.0, -1.0, 0.0,
                         1.0, -1.0, 0.0
                    ];
                    mesh.normals = [
                        0.0, 0.0, 1.0,
                        0.0, 0.0, 1.0,
                        0.0, 0.0, 1.0,
                        0.0, 0.0, 1.0,
                    ];
                break;
            }
            for (var i = 0, l = vertices.length; i < l; i++) {
                vertices[i] *= scale;
            }
            mesh.vertices = vertices;
            mesh.colors = [
                1.0, 1.0, 1.0, 1.0,
                1.0, 1.0, 1.0, 1.0,
                1.0, 1.0, 1.0, 1.0,
                1.0, 1.0, 1.0, 1.0
            ];
            mesh.texCoords = [
                1.0, 1.0,
                0.0, 1.0,
                0.0, 0.0,
                1.0, 0.0
            ];
            mesh.indices = [
                0, 1, 2,
                2, 3, 0,
                2, 1, 0,
                0, 3, 2
            ];
            return mesh;
        };
        proto.createPlane = function(scale) {
            return this._createPlane('xy', scale);
        };
        proto.createPlaneXY = function(scale) {
            return this._createPlane('xy', scale);
        };
        proto.createPlaneYZ = function(scale) {
            return this._createPlane('yz', scale);
        };
        proto.createPlaneXZ = function(scale) {
            return this._createPlane('xz', scale);
        };
        proto.createBox = function(sx, sy, sz) {
            if (typeof sx == 'undefined') {
                sx = 0.5;
            } if (typeof sy == 'undefined') {
                sy = 0.5;
            } if (typeof sz == 'undefined') {
                sz = 0.5;
            }
            var mesh = new enchant.gl.Mesh();
            var vertices = [
                 1.0,  1.0,  1.0,
                -1.0,  1.0,  1.0,
                -1.0, -1.0,  1.0,
                 1.0, -1.0,  1.0,

                 1.0,  1.0, -1.0,
                -1.0,  1.0, -1.0,
                -1.0, -1.0, -1.0,
                 1.0, -1.0, -1.0,

                 1.0,  1.0,  1.0,
                -1.0,  1.0,  1.0,
                -1.0,  1.0, -1.0,
                 1.0,  1.0, -1.0,

                 1.0, -1.0,  1.0,
                -1.0, -1.0,  1.0,
                -1.0, -1.0, -1.0,
                 1.0, -1.0, -1.0,

                 1.0,  1.0,  1.0,
                 1.0, -1.0,  1.0,
                 1.0, -1.0, -1.0,
                 1.0,  1.0, -1.0,

                -1.0,  1.0,  1.0,
                -1.0, -1.0,  1.0,
                -1.0, -1.0, -1.0,
                -1.0,  1.0, -1.0
            ];
            for (var i = 0, l = vertices.length; i < l; i+=3) {
                vertices[i] *= sx;
                vertices[i+1] *= sy;
                vertices[i+2] *= sz;
            }
            mesh.vertices = vertices;
                
            mesh.colors = [
                1.0, 1.0, 1.0, 1.0,
                1.0, 1.0, 1.0, 1.0,
                1.0, 1.0, 1.0, 1.0,
                1.0, 1.0, 1.0, 1.0,

                1.0, 1.0, 1.0, 1.0,
                1.0, 1.0, 1.0, 1.0,
                1.0, 1.0, 1.0, 1.0,
                1.0, 1.0, 1.0, 1.0,

                1.0, 1.0, 1.0, 1.0,
                1.0, 1.0, 1.0, 1.0,
                1.0, 1.0, 1.0, 1.0,
                1.0, 1.0, 1.0, 1.0,

                1.0, 1.0, 1.0, 1.0,
                1.0, 1.0, 1.0, 1.0,
                1.0, 1.0, 1.0, 1.0,
                1.0, 1.0, 1.0, 1.0,

                1.0, 1.0, 1.0, 1.0,
                1.0, 1.0, 1.0, 1.0,
                1.0, 1.0, 1.0, 1.0,
                1.0, 1.0, 1.0, 1.0,

                1.0, 1.0, 1.0, 1.0,
                1.0, 1.0, 1.0, 1.0,
                1.0, 1.0, 1.0, 1.0,
                1.0, 1.0, 1.0, 1.0
            ];
            mesh.normals = mesh.vertices;
            mesh.texCoords = [
                1.0, 0.0,
                0.0, 0.0,
                0.0, 1.0,
                1.0, 1.0,

                1.0, 0.0,
                0.0, 0.0,
                0.0, 1.0,
                1.0, 1.0,

                1.0, 0.0,
                0.0, 0.0,
                0.0, 1.0,
                1.0, 1.0,

                1.0, 0.0,
                0.0, 0.0,
                0.0, 1.0,
                1.0, 1.0,

                1.0, 0.0,
                0.0, 0.0,
                0.0, 1.0,
                1.0, 1.0,

                1.0, 0.0,
                0.0, 0.0,
                0.0, 1.0,
                1.0, 1.0
            ];
            var a = [
                0, 1, 2,
                2, 3, 0,
                2, 1, 0,
                0, 3, 2,

                0, 1, 2,
                2, 3, 0,
                2, 1, 0,
                0, 3, 2,

                0, 1, 2,
                2, 3, 0,
                2, 1, 0,
                0, 3, 2,

                0, 1, 2,
                2, 3, 0,
                2, 1, 0,
                0, 3, 2,

                0, 1, 2,
                2, 3, 0,
                2, 1, 0,
                0, 3, 2,

                0, 1, 2,
                2, 3, 0,
                2, 1, 0,
                0, 3, 2
            ];
            for(var i = 0; i < 6 * 12; i++){
                a[i] += Math.floor(i / 12) * 4;
            }
            mesh.indices = a;
            return mesh;
        };
        proto.createCube = function(s) {
            return this.createBox(s, s, s);
        };
        proto.createSphere = function(r, h, v) {
            if (typeof r == 'undefined') {
                r = 1;
            } if (typeof h == 'undefined') {
                h = 20;
            } if (typeof v == 'undefined') {
                v = 20;
            }
            var mesh = new enchant.gl.Mesh();
            var vertices = [];
            var texCoords = [];
            for(var i = 0; i < v; i++){
                for(var j = 0; j < h; j++){
                    vertices[vertices.length] = Math.sin(Math.PI * i / (v - 1)) * Math.cos(Math.PI * 2 * j / (h - 1)) * r;
                    vertices[vertices.length] = Math.cos(Math.PI * i / (v - 1)) * r;
                    vertices[vertices.length] = Math.sin(Math.PI * i / (v - 1)) * Math.sin(Math.PI * 2 * j / (h - 1)) * r;
                    texCoords[texCoords.length] = 1.0 - j / (h - 1);
                    texCoords[texCoords.length] = 1.0 - i / (v - 1);
                }
            }
            mesh.vertices = vertices;
            mesh.texCoords = texCoords;
            var colors = [];
            for(var i = 0, l = mesh.vertices.length / 3 * 4; i < l; i++){
                colors[colors.length] = 1.0;
            }
            mesh.colors = colors;
            mesh.normals = vertices;
            var indices = [];
            for(var i = 0; i < v - 1; i++){
                for(var j = 0; j < h; j++){
                    indices[indices.length] = h * (i + 1) + j;
                    indices[indices.length] = h * i + j;
                    indices[indices.length] = h * (i + 1) + (1 + j) % h;
                    indices[indices.length] = h * i + (1 + j) % h;
                    indices[indices.length] = h * (i + 1) + (1 + j) % h;
                    indices[indices.length] = h * i + j;
                }
            }
            mesh.indices = indices;
            return mesh;
        };
        proto.createCylinder = function(r, h, v) {
            if (typeof r == 'undefined') {
                r = 0.5;
            } if (typeof h == 'undefined') {
                h = 1;
            } if (typeof v == 'undefined') {
                v = 20;
            }
            var vertices = [];
            var indices = [];
            var texCoords = [];
            var normals = [];
            vertices[vertices.length] = 0;
            vertices[vertices.length] = h;
            vertices[vertices.length] = 0;

            normals[normals.length] = 0;
            normals[normals.length] = 1;
            normals[normals.length] = 0;

            texCoords[texCoords.length] = 0;
            texCoords[texCoords.length] = 1;

            vertices[vertices.length] = 0;
            vertices[vertices.length] = -h;
            vertices[vertices.length] = 0;

            normals[normals.length] = 0;
            normals[normals.length] = -1;
            normals[normals.length] = 0;

            texCoords[texCoords.length] = 0;
            texCoords[texCoords.length] = 0;

            var cos = 0;
            var sin = 0;
            var len = 0;
            for (var i = 0; i < v; i++) {
                cos = Math.cos(Math.PI * 2 * i / (v-1));
                sin = Math.sin(Math.PI * 2 * i / (v-1));
                len = Math.sqrt(cos * cos + sin * sin + 0.25);

                vertices[vertices.length] = cos * r;
                vertices[vertices.length] = h;
                vertices[vertices.length] = sin * r;

                normals[normals.length] = cos * len;
                normals[normals.length] = 0.5 * len;
                normals[normals.length] = sin * len;

                texCoords[texCoords.length] = i / v;
                texCoords[texCoords.length] = 1;

                vertices[vertices.length] = cos * r;
                vertices[vertices.length] = -h;
                vertices[vertices.length] = sin * r;

                normals[normals.length] = cos * len;
                normals[normals.length] = -0.5 * len;
                normals[normals.length] = sin * len;

                texCoords[texCoords.length] = i / v;
                texCoords[texCoords.length] = 0;
            }
            for (var i = 0; i < v - 1; i++) {
                indices[indices.length] = 0;
                indices[indices.length] = i * 2 + 4;
                indices[indices.length] = i * 2 + 2;
                indices[indices.length] = 1;
                indices[indices.length] = i * 2 + 3;
                indices[indices.length] = i * 2 + 5;

                indices[indices.length] = i * 2 + 2;
                indices[indices.length] = i * 2 + 4;
                indices[indices.length] = i * 2 + 5;
                indices[indices.length] = i * 2 + 5;
                indices[indices.length] = i * 2 + 3;
                indices[indices.length] = i * 2 + 2;
            }

            var mesh = new enchant.gl.Mesh();
            mesh.vertices = vertices;
            mesh.indices = indices;
            mesh.texCoords = texCoords;
            mesh.normals = normals;
            mesh.setBaseColor('#ffffff');
            return mesh;
        };
    })();
}
