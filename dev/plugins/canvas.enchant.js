/**
 * canvas.enchant.js
 * @version v0.1 (2011/01/26)
 * @require enchant.js v0.4.3+
 * @author shi3z (http://wise9.jp)
 *
 * @description
 * enable rendering via canvas
 * @usage

EXAMPLE: use canvas to drawing sprite

enchant();
window.onload = function() {
    var game = new Game(320, 320);
    game.preload('bear.png');
    game.onload = function() {
        var bear = new Sprite(32,32);
        bear.image = game.assets['bear.png'];
        
        var canvasGroup = new CanvasGroup();
        canvasGroup.addChild(bear);
        
        game.rootScene.addChild(canvasGroup);
    };
    game.start();
}

*/


/**
 * @scope enchant.CanvasGroup
 */
enchant.CanvasGroup = enchant.Class.create(enchant.Group,{
	initialize:function(){
		enchant.Group.call(this);
		
		cashing = function(node){
		   var row = node._image.width / node.width | 0;
			node._sx = 	~~(node.width*(node.frame%row));
			node._sy = 	~~((node.frame/row|0)*node.height);
			node._sw = 	~~node._width;
			node._sh = 	~~node._height;
			node._dx = 	~~(node.width*(node.scaleX-1)*0.5);
			node._dy = 	~~(node.height*(node.scaleY-1)*0.5);
			node._dw = 	~~(node.width*node.scaleX);
			node._dh = 	~~(node.height*node.scaleY);
			if((node._image.width==node.width)&&(node.scaleX==1&&node.scaleY==1)){
				node.draw = function(context){
						context.drawImage(this.image._element,
							this.x+this._dx,
							this.y+this._dy);					
				}
			}else{
				node.draw = function(context){
					context.drawImage(this.image._element,
						this._sx,this._sy,
						this._sw,this._sh,
						this.x+this._dx,
						this.y+this._dy,
						this._dw,this._dh);	
				}
			}
		};
		
		this.addEventListener('enterframe',this.enterframe=function(){
			this.context.clearRect(0,0,game.width,game.height);
			var context = this.context;
			var nodes = this.canvasChildNodes;
			var copmpsite = "source-atob"
			var fiz=0;
			for(i=0,len =  nodes.length ;i<len;i++){
				var node = nodes[i];
				if(node.alphaBlending){
					context.globalCompositeOperation = 
															node.alphaBlending;
				}else{
					context.globalCompositeOperation = 
															"source-atob";
				}
				node.draw(context);
			}
		});

        this._element = document.createElement('canvas');
        this._element.width = game.width;
        this._element.height = game.height;
        this._element.style.position = 'absolute';
        this.context = this._element.getContext('2d');

		var node=this;
        this.canvasChildNodes = [];
        this.currentTime = Date.now();

		this.addChild = function(node){
			cashing(node);
			node._listeners.render=[];
	        this.childNodes[this.childNodes]=node;
	        this.canvasChildNodes[this.canvasChildNodes.length]=node;
	        node.parentNode = this;
	        node.dispatchEvent(new enchant.Event('added'));
	        if (this.scene) {
	            var e = new enchant.Event('addedtoscene');
	            node.scene = this.scene;
	            node.dispatchEvent(e);
	            node._updateCoordinate();
	        }	        
		};
	},
	removeChild:function(node){
		for(i = 0, len= this.canvasChildNodes.length; i < len; i++){
	 		if(this.canvasChildNodes[i] === node){
 				this.canvasChildNodes.splice(i,1);
			}
		}
	}
});