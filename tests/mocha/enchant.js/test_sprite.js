describe("Sprite", function(){
    var core;

    before(function(){
        enchant();
    });

    describe("#initialize", function(){
        it("sets width and height", function(){
            var sprite = new Sprite(100, 150);
            expect(sprite.width).to.equal(100);
            expect(sprite.height).to.equal(150);
        });
    });

    describe("image", function(){
        it("returns null when the image was not given", function(){
            var sprite = new Sprite();
            expect(sprite.image).to.be.null;
        });

        it("sets image which is preloaded to core", function(done){
            core = new Core();
            core.preload("icon0.png");
            core.onload = function(){
                var sprite = new Sprite(12, 12);
                sprite.image = core.assets["icon0.png"];
                expect(sprite.image).to.deep.equal(core.assets["icon0.png"]);
                core.stop();
                done();
            };
            core.start();
        });
    });

    describe("frame", function(){
        beforeEach(function(){
            core = new Core();
        });

        afterEach(function(){
            core.stop();
            core = null;
        });

        it("returns which frame is currently set", function(done){
            var sprite = new Sprite(16, 16);
            expect(sprite.frame).to.be.zero;
            sprite.frame = 10;
            expect(sprite.frame).to.equal(10);
            core.preload("icon0.png");
            core.onload = function(){
                sprite.image = core.assets["icon0.png"];
                sprite.frame = 10;
                expect(sprite.frame).to.equal(10);
                done();
            };
            core.start();
        });

        it("sets multiple values for animation", function(done){
            var sprite = new Sprite(16, 16);
            core.preload("icon0.png");
            var assertAnimationFrame = function(){
                var count = 0,
                    doneCalled = false;
                return function(){
                    expect(sprite.frame).to.be.within(0, 2);
                    count++;
                    if(count > 2 && !doneCalled) {
                        doneCalled = true;
                        done();
                    }
                }
            };
            core.onload = function(){
                sprite.image = core.assets["icon0.png"];
                sprite.frame = [0, 1, 2];
                expect(sprite._frameSequence).to.be.members([0, 1, 2]);
                sprite.addEventListener("enterframe", assertAnimationFrame());
                var scene = new Scene();
                scene.addChild(sprite)
                core.pushScene(scene);
            };
            core.start();
        });

        it("#_setFrame compute position of frame", function(done){
            var sprite = new Sprite(16, 16);
            core.preload("icon0.png");
            core.onload = function(){
                sprite.image = core.assets["icon0.png"];
                sprite.frame = 0;
                expect(sprite._frameTop).to.be.zero;
                expect(sprite._frameLeft).to.be.zero;
                sprite.frame = 2;
                var row = sprite._image.width / sprite._width;
                expect(sprite._frameTop).to.equal(0);
                expect(sprite._frameLeft).to.equal(32);
                done();
            };
            core.start();
        });

    });

    describe("width", function(){
        it("set new width to Sprite", function(){
            var sprite = new Sprite(16, 16);
            expect(sprite.width).to.equal(16);
            sprite.width = 32;
            expect(sprite.width).to.equal(32);
        });
        it("returns width of Sprite", function(){
            var sprite = new Sprite(16, 16);
            expect(sprite.width).to.equal(16);
        });
    });

    describe("height", function(){
        it("set new height to Sprite", function(){
            var sprite = new Sprite(16, 16);
            expect(sprite.height).to.equal(16);
            sprite.height = 32;
            expect(sprite.height).to.equal(32);
        });

        it("returns width of Sprite", function(){
            var sprite = new Sprite(16, 32);
            expect(sprite.height).to.equal(32);
        });
    });

    describe("#domRender",function(){
        beforeEach(function(){
            core = new Core();
            core.preload("icon0.png");
        });

        afterEach(function(){
            core.stop();
            core = null;
        });

        it.skip("renders image on IE using css");

        it("renders image using css", function(done){
            var sprite = new Sprite(16, 16);
            core.onload = function(){
                sprite.image = core.assets["icon0.png"];
                sprite.frame = 1;
                sprite.domRender();
                expect(sprite._style['background-image']).to.equal('url(icon0.png)');
                expect(sprite._style['background-position']).to.equal('-16px 0px');
                done();
            };
            core.start();
        });
    });

    describe("#cvsRender", function(){
        it("renders image to canvas", function(done){
            var expected_canvas = document.createElement("canvas");
            expected_canvas.setAttribute("width", 16);
            expected_canvas.setAttribute("height", 16);
            var expected_ctx = expected_canvas.getContext('2d');
            var image = new Image();
            image.src = "icon0.png";
            expected_ctx.drawImage(image, 16, 0, 16, 16, 0, 0, 16, 16);
            var expected = expected_ctx.getImageData(0, 0, 16, 16).data;
            core = new Core();
            core.preload("icon0.png");
            var surface = new enchant.Surface(16, 16);
            var sprite = new Sprite(16, 16);
            core.onload = function(){
                sprite.image = core.assets["icon0.png"];
                sprite.frame = 1;
                sprite.cvsRender(surface.context);
                var actual = surface.context.getImageData(0, 0, 16, 16).data;
                expect(actual).to.deep.equal(expected);
                done();
            };
            core.start();
        });
    });
    
    describe("#sprite frame issue 298 - https://github.com/wise9/enchant.js/issues/298", function(){
        
        it("frameArray -> frame (number)", function(){
            var sprite = new enchant.Sprite(32, 32);
            var enterframe = new enchant.Event(enchant.Event.ENTER_FRAME);
            var frameArray = [1,2,3,4,5,6,7,8,9];
            var frameArrayLength = frameArray.length;
            var iterations = 17;
            
            sprite.frame = 0;
            expect(sprite.frame).to.equal(0);
            
            for (var i = 0; i < 13; i++) {
                sprite.dispatchEvent(enterframe);
                expect(sprite.frame).to.equal(0);
            }
            
            sprite.frame = frameArray;
            for (var i = 0; i < iterations; i++) {
                expect(sprite.frame).to.equal(i%frameArrayLength+1);
                sprite.dispatchEvent(enterframe);
            }
            var expected = iterations%frameArrayLength+1;
            expect(sprite.frame).to.equal(expected);
            
            sprite.frame = expected;
            for (var i = 0; i < 7; i++) {
                sprite.dispatchEvent(enterframe);
                expect(sprite.frame).to.equal(expected);
            }
        });
        
        it("frameArray <- frame (number)", function(){
            var sprite = new enchant.Sprite(32, 32);
            var enterframe = new enchant.Event(enchant.Event.ENTER_FRAME);
            var frameArray = [6,6,7,7];
            var frameArrayLength = frameArray.length;
            var iterations = 17;
            
            sprite.frame = frameArray; // frame 6
            expect(sprite.frame).to.equal(6);
            sprite.dispatchEvent(enterframe); // frame 6
            expect(sprite.frame).to.equal(6);
            sprite.dispatchEvent(enterframe); // frame 7
            expect(sprite.frame).to.equal(7);
            sprite.frame = 6;
            expect(sprite.frame).to.equal(6);
            
            for (var i = 0; i < 13; i++) {
                sprite.dispatchEvent(enterframe);
                expect(sprite.frame).to.equal(6);
            }
            
            sprite.frame = frameArray;
            for (var i = 0; i < iterations; i++) {
                expect(sprite.frame).to.equal(frameArray[i%frameArrayLength]);
                sprite.dispatchEvent(enterframe);
            }
            
            var expected = frameArray[iterations%frameArrayLength];
            expect(sprite.frame).to.equal(expected);
        });
        
        it("frameArray <-> frame (number)", function(){
            var sprite = new enchant.Sprite(32, 32);
            var enterframe = new enchant.Event(enchant.Event.ENTER_FRAME);
            var frameArray = [6,6,7,7];
            var frameArrayLength = frameArray.length;
            var iterations = 17;
            
            sprite.frame = 0;
            expect(sprite.frame).to.equal(0);
            
            for (var i = 0; i < 13; i++) {
                sprite.dispatchEvent(enterframe);
                expect(sprite.frame).to.equal(0);
            }
            
            sprite.frame = frameArray;
            expect(sprite.frame).to.equal(6);
            sprite.dispatchEvent(enterframe);
            expect(sprite.frame).to.equal(6);
            sprite.dispatchEvent(enterframe);
            expect(sprite.frame).to.equal(7);
            sprite.frame = [6];
            expect(sprite.frame).to.equal(6);
            
            for (var i = 0; i < 13; i++) {
                sprite.dispatchEvent(enterframe);
                expect(sprite.frame).to.equal(6);
            }
            
            sprite.frame = frameArray;
            for (var i = 0; i < iterations; i++) {
                expect(sprite.frame).to.equal(frameArray[i%frameArrayLength]);
                sprite.dispatchEvent(enterframe);
            }
            
            var expected = frameArray[iterations%frameArrayLength];
            expect(sprite.frame).to.equal(expected);
        });
    });
    
});