/**
 * @fileOverview
 * primitive.gl.enchant.js
 * @version 0.3.5
 * @require gl.enchant.js v0.3.5+
 * @author Ubiquitous Entertainment Inc.
 *
 * @description
 [lang:ja]
 * gl.enchant.js で使える基本立体オブジェクト
 [/lang]
 [lang:en]
 * Primitive objects for gl.enchant.js
 [/lang]
 */


if (enchant.gl !== undefined) {
    (function() {
        enchant.gl.primitive = {};
        enchant.gl.primitive.Plane = enchant.Class.create(enchant.gl.Sprite3D, {
            initialize: function(scale) {
                enchant.gl.Sprite3D.call(this);
                this.mesh = enchant.gl.Mesh.createPlane(scale);
            }
        });
        enchant.gl.primitive.PlaneXY = enchant.Class.create(enchant.gl.Sprite3D, {
            initialize: function(scale) {
                enchant.gl.Sprite3D.call(this);
                this.mesh = enchant.gl.Mesh.createPlaneXY(scale);
            }
        });
        enchant.gl.primitive.PlaneYZ = enchant.Class.create(enchant.gl.Sprite3D, {
            initialize: function(scale) {
                enchant.gl.Sprite3D.call(this);
                this.mesh = enchant.gl.Mesh.createPlaneYZ(scale);
            }
        });
        enchant.gl.primitive.PlaneXZ = enchant.Class.create(enchant.gl.Sprite3D, {
            initialize: function(scale) {
                enchant.gl.Sprite3D.call(this);
                this.mesh = enchant.gl.Mesh.createPlaneXZ(scale);
            }
        });
        enchant.gl.primitive.Billboard = enchant.Class.create(enchant.gl.primitive.Plane, {
            initialize: function(scale) {
                var core = enchant.Core.instance;
                enchant.gl.primitive.Plane.call(this, scale);
                this.addEventListener('enterframe', function() {
                    if (core.currentScene3D._camera) {
                        this.rotation = core.currentScene3D._camera.invMat;
                    }
                });
            }
        });
        enchant.gl.primitive.BillboardAnimation = enchant.Class.create(enchant.gl.primitive.Billboard, {
            initialize: function(divide, scale) {
                enchant.gl.primitive.Billboard.call(this, scale);
                if (typeof divide !== 'undefined') {
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
                        right, bottom,
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
                var core = enchant.Core.instance;
                enchant.gl.primitive.Plane.call(this, scale);
                this.addEventListener('render', function() {
                    if (core.currentScene3D._camera) {
                        this.rotation = core.currentScene3D._camera.invMatY;
                    }
                });
            }
        });
        enchant.gl.primitive.Box = enchant.Class.create(enchant.gl.Sprite3D, {
            initialize: function(sx, sy, sz) {
                enchant.gl.Sprite3D.call(this);
                this.mesh = enchant.gl.Mesh.createBox(sx, sy, sz);
            }
        });
        enchant.gl.primitive.Cube = enchant.Class.create(enchant.gl.Sprite3D, {
            initialize: function(scale) {
                enchant.gl.Sprite3D.call(this);
                this.mesh = enchant.gl.Mesh.createCube(scale);
            }
        });
        enchant.gl.primitive.Sphere = enchant.Class.create(enchant.gl.Sprite3D, {
            initialize: function(r, v, h) {
                enchant.gl.Sprite3D.call(this);
                this.mesh = enchant.gl.Mesh.createSphere(r, v, h);
            }
        });
        enchant.gl.primitive.Cylinder = enchant.Class.create(enchant.gl.Sprite3D, {
            initialize: function(r, h, v) {
                enchant.gl.Sprite3D.call(this);
                this.mesh = enchant.gl.Mesh.createCylinder(r, h, v);
            }
        });
        enchant.gl.primitive.Torus = enchant.Class.create(enchant.gl.Sprite3D, {
            initialize: function(r, r2, v, v2) {
                enchant.gl.Sprite3D.call(this);
                this.mesh = enchant.gl.Mesh.createTorus(r, r2, v, v2);
            }
        });

        var proto = Object.getPrototypeOf(enchant.gl.Mesh);
        proto._createPlane = function(type, scale) {
            if (typeof scale === 'undefined') {
                scale = 0.5;
            }
            var mesh = new enchant.gl.Mesh();
            var vertices;
            if (type === 'yz') {
                vertices = [
                    0.0, 1.0, 1.0,
                    0.0, -1.0, 1.0,
                    0.0, -1.0, -1.0,
                    0.0, 1.0, -1.0,

                    0.0, 1.0, 1.0,
                    0.0, -1.0, 1.0,
                    0.0, -1.0, -1.0,
                    0.0, 1.0, -1.0
                ];
                mesh.normals = [
                    1.0, 0.0, 0.0,
                    1.0, 0.0, 0.0,
                    1.0, 0.0, 0.0,
                    1.0, 0.0, 0.0,

                    -1.0, 0.0, 0.0,
                    -1.0, 0.0, 0.0,
                    -1.0, 0.0, 0.0,
                    -1.0, 0.0, 0.0
                ];
            } else if (type === 'xz') {
                vertices = [
                    1.0, 0.0, 1.0,
                    -1.0, 0.0, 1.0,
                    -1.0, 0.0, -1.0,
                    1.0, 0.0, -1.0,

                    1.0, 0.0, 1.0,
                    -1.0, 0.0, 1.0,
                    -1.0, 0.0, -1.0,
                    1.0, 0.0, -1.0
                ];
                mesh.normals = [
                    0.0, -1.0, 0.0,
                    0.0, -1.0, 0.0,
                    0.0, -1.0, 0.0,
                    0.0, -1.0, 0.0,

                    0.0, 1.0, 0.0,
                    0.0, 1.0, 0.0,
                    0.0, 1.0, 0.0,
                    0.0, 1.0, 0.0
                ];
            } else {
                vertices = [
                    1.0, 1.0, 0.0,
                    -1.0, 1.0, 0.0,
                    -1.0, -1.0, 0.0,
                    1.0, -1.0, 0.0,

                    1.0, 1.0, 0.0,
                    -1.0, 1.0, 0.0,
                    -1.0, -1.0, 0.0,
                    1.0, -1.0, 0.0
                ];
                mesh.normals = [
                    0.0, 0.0, 1.0,
                    0.0, 0.0, 1.0,
                    0.0, 0.0, 1.0,
                    0.0, 0.0, 1.0,

                    0.0, 0.0, -1.0,
                    0.0, 0.0, -1.0,
                    0.0, 0.0, -1.0,
                    0.0, 0.0, -1.0
                ];
            }
            for (var i = 0, l = vertices.length; i < l; i++) {
                vertices[i] *= scale;
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
                1.0, 1.0, 1.0, 1.0
            ];
            mesh.texCoords = [
                1.0, 1.0,
                0.0, 1.0,
                0.0, 0.0,
                1.0, 0.0,

                1.0, 1.0,
                0.0, 1.0,
                0.0, 0.0,
                1.0, 0.0
            ];
            mesh.indices = [
                0, 1, 2,
                2, 3, 0,
                6, 5, 4,
                4, 7, 6
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
            if (typeof sx === 'undefined') {
                sx = 0.5;
            }
            if (typeof sy === 'undefined') {
                sy = 0.5;
            }
            if (typeof sz === 'undefined') {
                sz = 0.5;
            }
            var mesh = new enchant.gl.Mesh();
            var vertices = [
                1.0, 1.0, 1.0,
                -1.0, 1.0, 1.0,
                -1.0, -1.0, 1.0,
                1.0, -1.0, 1.0,

                1.0, 1.0, -1.0,
                -1.0, 1.0, -1.0,
                -1.0, -1.0, -1.0,
                1.0, -1.0, -1.0,

                1.0, 1.0, 1.0,
                -1.0, 1.0, 1.0,
                -1.0, 1.0, -1.0,
                1.0, 1.0, -1.0,

                1.0, -1.0, 1.0,
                -1.0, -1.0, 1.0,
                -1.0, -1.0, -1.0,
                1.0, -1.0, -1.0,

                1.0, 1.0, 1.0,
                1.0, -1.0, 1.0,
                1.0, -1.0, -1.0,
                1.0, 1.0, -1.0,

                -1.0, 1.0, 1.0,
                -1.0, -1.0, 1.0,
                -1.0, -1.0, -1.0,
                -1.0, 1.0, -1.0
            ];
            for (var i = 0, l = vertices.length; i < l; i += 3) {
                vertices[i] *= sx;
                vertices[i + 1] *= sy;
                vertices[i + 2] *= sz;
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
            mesh.normals = [
                0.0, 0.0, 1.0,
                0.0, 0.0, 1.0,
                0.0, 0.0, 1.0,
                0.0, 0.0, 1.0,
                0.0, 0.0, -1.0,
                0.0, 0.0, -1.0,
                0.0, 0.0, -1.0,
                0.0, 0.0, -1.0,
                0.0, 1.0, 0.0,
                0.0, 1.0, 0.0,
                0.0, 1.0, 0.0,
                0.0, 1.0, 0.0,
                0.0, -1.0, 0.0,
                0.0, -1.0, 0.0,
                0.0, -1.0, 0.0,
                0.0, -1.0, 0.0,
                1.0, 0.0, 0.0,
                1.0, 0.0, 0.0,
                1.0, 0.0, 0.0,
                1.0, 0.0, 0.0,
                -1.0, 0.0, 0.0,
                -1.0, 0.0, 0.0,
                -1.0, 0.0, 0.0,
                -1.0, 0.0, 0.0
            ];
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

                2, 1, 0,
                0, 3, 2,

                0, 1, 2,
                2, 3, 0,

                0, 1, 2,
                2, 3, 0,

                2, 1, 0,
                0, 3, 2
            ];
            for (i = 0; i < 6 * 6; i++) {
                a[i] += Math.floor(i / 6) * 4;
            }
            mesh.indices = a;
            return mesh;
        };
        proto.createCube = function(s) {
            return this.createBox(s, s, s);
        };
        proto.createSphere = function(r, h, v) {
            var i, j, l;
            if (typeof r === 'undefined') {
                r = 1;
            }
            if (typeof h === 'undefined') {
                h = 20;
            }
            if (typeof v === 'undefined') {
                v = 20;
            }
            var mesh = new enchant.gl.Mesh();
            var vertices = [];
            var texCoords = [];
            for (i = 0; i < v; i++) {
                for (j = 0; j < h; j++) {
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
            for (i = 0, l = mesh.vertices.length / 3 * 4; i < l; i++) {
                colors[colors.length] = 1.0;
            }
            mesh.colors = colors;
            mesh.normals = vertices.slice(0);
            var indices = [];

            for (i = 0; i < v - 1; i++) {
                for (j = 0; j < h; j++) {
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
            if (typeof r === 'undefined') {
                r = 0.5;
            }
            if (typeof h === 'undefined') {
                h = 1;
            }
            if (typeof v === 'undefined') {
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
            for (var i = 0; i < v; i++) {
                cos = Math.cos(Math.PI * 2 * i / (v - 1));
                sin = Math.sin(Math.PI * 2 * i / (v - 1));

                vertices[vertices.length] = cos * r;
                vertices[vertices.length] = h;
                vertices[vertices.length] = sin * r;

                normals[normals.length] = 0;
                normals[normals.length] = 1;
                normals[normals.length] = 0;

                texCoords[texCoords.length] = i / (v - 1);
                texCoords[texCoords.length] = 1;

                vertices[vertices.length] = cos * r;
                vertices[vertices.length] = -h;
                vertices[vertices.length] = sin * r;

                normals[normals.length] = 0;
                normals[normals.length] = -1;
                normals[normals.length] = 0;

                texCoords[texCoords.length] = i / (v - 1);
                texCoords[texCoords.length] = 0;

                vertices[vertices.length] = cos * r;
                vertices[vertices.length] = h;
                vertices[vertices.length] = sin * r;

                normals[normals.length] = cos;
                normals[normals.length] = 0;
                normals[normals.length] = sin;

                texCoords[texCoords.length] = i / (v - 1);
                texCoords[texCoords.length] = 1;

                vertices[vertices.length] = cos * r;
                vertices[vertices.length] = -h;
                vertices[vertices.length] = sin * r;

                normals[normals.length] = cos;
                normals[normals.length] = 0;
                normals[normals.length] = sin;

                texCoords[texCoords.length] = i / (v - 1);
                texCoords[texCoords.length] = 0;
            }
            for (i = 0; i < v - 1; i++) {
                indices[indices.length] = 0;
                indices[indices.length] = 2 + i * 4 + 4;
                indices[indices.length] = 2 + i * 4 + 0;
                indices[indices.length] = 1;
                indices[indices.length] = 2 + i * 4 + 1;
                indices[indices.length] = 2 + i * 4 + 5;

                indices[indices.length] = 2 + i * 4 + 2;
                indices[indices.length] = 2 + i * 4 + 6;
                indices[indices.length] = 2 + i * 4 + 3;
                indices[indices.length] = 2 + i * 4 + 6;
                indices[indices.length] = 2 + i * 4 + 7;
                indices[indices.length] = 2 + i * 4 + 3;
            }

            var mesh = new enchant.gl.Mesh();
            mesh.vertices = vertices;
            mesh.indices = indices;
            mesh.texCoords = texCoords;
            mesh.normals = normals;
            mesh.setBaseColor('#ffffff');
            return mesh;
        };
        proto.createTorus = function(r, r2, v, v2) {
            var i, j;
            if (typeof r === 'undefined') {
                r = 1.0;
            }
            if (typeof r2 === 'undefined') {
                r2 = 0.3;
            }
            if (typeof v === 'undefined') {
                v = 20;
            }
            if (typeof v2 === 'undefined') {
                v2 = 20;
            }
            var ring = [];
            var norm = [];
            var rad;
            var cos;
            var sin;
            for (i = 0; i < v2; i++) {
                rad = Math.PI * 2 * i / (v2 - 1);
                cos = Math.cos(rad);
                sin = Math.sin(rad);
                ring[ring.length] = 0;
                ring[ring.length] = sin * r2;
                ring[ring.length] = cos * r2 + r - r2;
                norm[norm.length] = 0;
                norm[norm.length] = sin;
                norm[norm.length] = cos;
            }
            var vertices = [];
            var normals = [];
            var texCoords = [];
            for (i = 0; i < v; i++) {
                rad = Math.PI * 2 * i / (v - 1);
                cos = Math.cos(rad);
                sin = Math.sin(rad);
                for (j = 0; j < ring.length; j += 3) {
                    vertices[vertices.length] = ring[j] * cos - ring[j + 2] * sin;
                    vertices[vertices.length] = ring[j + 1];
                    vertices[vertices.length] = ring[j + 2] * cos + ring[j] * sin;
                    normals[normals.length] = norm[j] * cos - ring[j + 2] * sin;
                    normals[normals.length] = norm[j + 1];
                    normals[normals.length] = norm[j + 2] * cos + ring[j] + sin;
                    texCoords[texCoords.length] = 1.0 - i / (v - 1);
                    texCoords[texCoords.length] = j / (ring.length - 3);
                }
            }
            var indices = [];
            var c, c2;
            for (i = 0; i < v - 1; i++) {
                for (j = 0; j < v2 - 1; j++) {
                    c = v2 * i + j;
                    c2 = v2 * (i + 1) + j;
                    indices[indices.length] = c;
                    indices[indices.length] = c + 1;
                    indices[indices.length] = c2;
                    indices[indices.length] = c2 + 1;
                    indices[indices.length] = c2;
                    indices[indices.length] = c + 1;
                }
            }
            var mesh = new enchant.gl.Mesh();
            mesh.vertices = vertices;
            mesh.normals = normals;
            mesh.texCoords = texCoords;
            mesh.indices = indices;
            mesh.setBaseColor('#ffffff');

            return mesh;
        };
    }());
}
