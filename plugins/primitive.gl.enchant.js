if(enchant.gl){
	(function(){
	enchant.gl.primitive = {};
    enchant.gl.primitive.Plane = enchant.Class.create(enchant.gl.Sprite3D, {
    	initialize:function(){
    		enchant.gl.Sprite3D.call(this);
            this.vertices = [
            	 0.5,  0.5,  0.0,
            	-0.5,  0.5,  0.0,
            	-0.5, -0.5,  0.0,
            	 0.5, -0.5,  0.0
            ];
            this.colors = [
            	1.0, 0.0, 0.0, 1.0,
            	1.0, 0.0, 0.0, 1.0,
            	1.0, 0.0, 0.0, 1.0,
            	1.0, 0.0, 0.0, 1.0
            ];
            this.normals = this.vertices;
            this.texCoords = [
            	1.0, 1.0,
            	0.0, 1.0,
            	0.0, 0.0,
            	1.0, 0.0
            ];
            this.indices = [
            	0, 1, 2,
            	2, 3, 0,
            	2, 1, 0,
            	0, 3, 2
            ];
       	}
    });
    enchant.gl.primitive.PlaneXY = enchant.Class.create(enchant.gl.Sprite3D, {
    	initialize:function(){
    		enchant.gl.Sprite3D.call(this);
            this.vertices = [
            	0.0,    0.5,  0.5,  
            	0.0,  -0.5,  0.5, 
            	0.0,  -0.5, -0.5,
            	0.0,    0.5, -0.5, 
            ];
            this.colors = [
            	1.0, 0.0, 0.0, 1.0,
            	1.0, 0.0, 0.0, 1.0,
            	1.0, 0.0, 0.0, 1.0,
            	1.0, 0.0, 0.0, 1.0
            ];
            this.normals = this.vertices;
            this.texCoords = [
            	1.0, 1.0,
            	0.0, 1.0,
            	0.0, 0.0,
            	1.0, 0.0
            ];
            this.indices = [
            	0, 1, 2,
            	2, 3, 0,
            	2, 1, 0,
            	0, 3, 2
            ];
       	}
    });
    enchant.gl.primitive.PlaneYZ = enchant.Class.create(enchant.gl.Sprite3D, {
    	initialize:function(){
    		enchant.gl.Sprite3D.call(this);
            this.vertices = [
            	 0.5,  0.5,  0.0,
            	-0.5,  0.5,  0.0,
            	-0.5, -0.5,  0.0,
            	 0.5, -0.5,  0.0
            ];
            this.colors = [
            	1.0, 0.0, 0.0, 1.0,
            	1.0, 0.0, 0.0, 1.0,
            	1.0, 0.0, 0.0, 1.0,
            	1.0, 0.0, 0.0, 1.0
            ];
            this.normals = this.vertices;
            this.texCoords = [
            	1.0, 1.0,
            	0.0, 1.0,
            	0.0, 0.0,
            	1.0, 0.0
            ];
            this.indices = [
            	0, 1, 2,
            	2, 3, 0,
            	2, 1, 0,
            	0, 3, 2
            ];
       	}
    });
    enchant.gl.primitive.PlaneXZ = enchant.Class.create(enchant.gl.Sprite3D, {
    	initialize:function(){
    		enchant.gl.Sprite3D.call(this);
            this.vertices = [
            	 0.5,  0.0,   0.5,  
            	-0.5,  0.0,   0.5,
            	-0.5, 0.0,   -0.5,
            	 0.5, 0.0,    -0.5, 
           ];
            this.colors = [
            	1.0, 0.0, 0.0, 1.0,
            	1.0, 0.0, 0.0, 1.0,
            	1.0, 0.0, 0.0, 1.0,
            	1.0, 0.0, 0.0, 1.0
            ];
            this.normals = this.vertices;
            this.texCoords = [
            	1.0, 0.0,
            	0.0, 0.0,
            	0.0, 1.0,
            	1.0, 1.0
            ];
            this.indices = [
            	0, 1, 2,
            	2, 3, 0,
            	2, 1, 0,
            	0, 3, 2
            ];
       	}
    });
    enchant.gl.primitive.Billboard = enchant.Class.create(enchant.gl.primitive.Plane, {
        initialize: function() {
            var game = enchant.Game.instance;
            this.mat = mat4.create();
            this.inverse = mat4.create();
            enchant.gl.primitive.Plane.call(this);
            this.addEventListener('render', function() {
                if (game.currentScene3D._camera) {
                    mat4.identity(this.inverse);
                    mat4.translate(this.inverse, [
                        -game.currentScene3D._camera.x,
                        -game.currentScene3D._camera.y,
                        -game.currentScene3D._camera.z,
                    ]);
                    mat4.set(game.currentScene3D.cameraMat, this.mat);
                    mat4.inverse(this.mat);
                    mat4.multiply(this.inverse, this.mat, this.mat);
                    this.rotation = this.mat;
                }
            });
        }   
    }); 
    enchant.gl.primitive.Cube= enchant.Class.create(enchant.gl.Sprite3D, {
    	initialize:function(){
    		enchant.gl.Sprite3D.call(this);
            this.vertices = [
            	 0.5,  0.5,  0.5,
            	-0.5,  0.5,  0.5,
            	-0.5, -0.5,  0.5,
            	 0.5, -0.5,  0.5,

            	 0.5,  0.5, -0.5,
            	-0.5,  0.5, -0.5,
            	-0.5, -0.5, -0.5,
            	 0.5, -0.5, -0.5,

            	 0.5,  0.5,  0.5,
            	-0.5,  0.5,  0.5,
            	-0.5,  0.5, -0.5,
            	 0.5,  0.5, -0.5,

            	 0.5, -0.5,  0.5,
            	-0.5, -0.5,  0.5,
            	-0.5, -0.5, -0.5,
            	 0.5, -0.5, -0.5,

            	 0.5,  0.5,  0.5,
            	 0.5, -0.5,  0.5,
            	 0.5, -0.5, -0.5,
            	 0.5,  0.5, -0.5,

            	-0.5,  0.5,  0.5,
            	-0.5, -0.5,  0.5,
            	-0.5, -0.5, -0.5,
            	-0.5,  0.5, -0.5
            ];
            this.colors = [
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
            this.normals = this.vertices;
            this.texCoords = [
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
            this.indices = a;
       	}
    });
    enchant.gl.primitive.Sphere = enchant.Class.create(enchant.gl.Sprite3D, {
    	initialize:function(){
    		var v = 10;
    		var h = 10;
    		enchant.gl.Sprite3D.call(this);
    		var vertices = [];
    		var texCoords = [];
    		for(var i = 0; i < v; i++){
    			for(var j = 0; j < h; j++){
    				vertices[vertices.length] = Math.sin(Math.PI * i / (v - 1)) * Math.cos(Math.PI * 2 * j / (h - 1));
    				vertices[vertices.length] = Math.cos(Math.PI * i / (v - 1));
    				vertices[vertices.length] = Math.sin(Math.PI * i / (v - 1)) * Math.sin(Math.PI * 2 * j / (h - 1));
    				texCoords[texCoords.length] = 1.0 - j / (h - 1);
    				texCoords[texCoords.length] = 1.0 - i / (v - 1);
    			}
    		}
    		this.vertices = vertices;
    		this.texCoords = texCoords;
    		var colors = [];
    		for(var i = 0, l = this.vertices.length / 3 * 4; i < l; i++){
    			colors[colors.length] = 1.0;
    		}
    		this.colors = colors;
            this.normals = vertices;
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
            this.indices = indices;
       	}
    });	 
  })();
}
