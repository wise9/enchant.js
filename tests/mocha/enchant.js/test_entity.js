describe("Entity", function(){
    before(function(){
        enchant();
        var game = new Core(320, 320);
        game.preload('start.png');
        // working around of error "game.assets['start.png'] is undefined"
        game.assets['start.png'] = new Surface();
    });

    /**
     * @see https://github.com/wise9/enchant.js/issues/14
     */
    describe("issue #14", function(){
        it("should not throw error when Sprite.frame set before Sprite.image set.", function(){
            var sprite = new enchant.Sprite(32, 32);
            var error;
            try {
                sprite.frame = 0;
                sprite.image = enchant.Core.instance.assets['start.png'];
            } catch(e) {
                error = e;
            }
            expect(error).to.be.undefined;
        });
    });

    /**
     * @see https://github.com/wise9/enchant.js/issues/18
     */
    describe("issue #18", function(){
        it("should work with buttonMode", function(){
            var sprite = new Sprite();
            sprite.buttonMode = 'a';
            expect(sprite.buttonPressed).not.to.be.ok;
            sprite.dispatchEvent(new enchant.Event('touchstart'));
            expect(sprite.buttonPressed).to.be.ok;
            sprite.dispatchEvent(new enchant.Event('touchend'));
            expect(sprite.buttonPressed).not.to.be.ok;
        });
    });

    describe("EventListener", function(){
        it("should be able to add and remove EventListener", function(){
            var sprite = new Sprite();
            listener = function(){};
            sprite.clearEventListener('enterframe');
            sprite.addEventListener('enterframe', listener);
            expect(sprite._listeners['enterframe'].length).to.be.equal(1);
            sprite.removeEventListener('enterframe', listener);
            expect(sprite._listeners['enterframe'].length).to.be.empty;
        });

        it("should be able to add multiple EvenetListeners", function(){
            var sprite = new Sprite();
            var listener1 = function(){};
            var listener2 = function(){};
            sprite.clearEventListener('enterframe');
            sprite.addEventListener('enterframe', listener1);
            expect(sprite._listeners['enterframe'].length).to.be.equal(1);
            sprite.addEventListener('enterframe', listener2);
            expect(sprite._listeners['enterframe'].length).to.be.equal(2);
        });

        it("should remove all EventListeners at once", function(){
            var sprite = new Sprite();
            var listener1 = function(){};
            var listener2 = function(){};
            sprite.clearEventListener('enterframe');
            sprite.addEventListener('enterframe', listener1);
            sprite.addEventListener('enterframe', listener2);
            expect(sprite._listeners['enterframe'].length).to.be.equal(2);
            sprite.clearEventListener('enterframe');
            expect(sprite._listeners['enterframe']).to.be.undefined;
            sprite.addEventListener('enterframe', listener1);
            sprite.addEventListener('enterframe', listener2);
            expect(sprite._listeners['enterframe'].length).to.be.equal(2);
            sprite.clearEventListener();
            expect(sprite._listeners['enterframe']).to.be.undefined;
        });
    });

    describe("#intersects, #within (collision detection)", function(){
        it("should detect collision each entity belongs to different groups.", function(){
            var a = new enchant.Sprite(32, 32),
                b = new enchant.Sprite(32, 32),
                scene = new enchant.Scene(),
                ga = new enchant.Group(),
                gb = new enchant.Group();
            ga.addChild(a);
            gb.addChild(b);
            scene.addChild(ga);
            scene.addChild(gb);
            expect(a.intersect(b)).to.be.true;
            expect(a.within(b)).to.be.true;
            a.x = 64;
            expect(a.intersect(b)).to.be.false;
            expect(a.within(b)).to.be.false;
            ga.x = -64;
            expect(a.intersect(b)).to.be.true;
            expect(a.within(b)).to.be.true;
            b.y = 64;
            expect(a.intersect(b)).to.be.false;
            expect(a.within(b)).to.be.false;
            gb.y = -64;
            expect(a.intersect(b)).to.be.true;
            expect(a.within(b)).to.be.true;
        });
    });

    /**
     * @see https://github.com/wise9/enchant.js/issues/95
     */
    describe("issue #95", function(){
        it("(Sprite) should draw a image repetitively when the image is smaller than the sprite", function(){
            var surface = new enchant.Surface(24, 24);
            var context = surface.context;
            // draw checkerboard pattern
            context.fillStyle = '#FFFFFF';
            context.fillRect(0, 0, 24, 24);
            context.fillStyle = '#000000';
            context.fillRect(0, 0, 12, 12);
            context.fillRect(12, 12, 12, 12);
            var expected = new enchant.Surface(32, 32);
            var ctx = expected.context;
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, 32, 32);
            ctx.fillStyle = '#000000';
            ctx.fillRect(0, 0, 12, 12); 
            ctx.fillRect(12, 12, 12, 12); 
            ctx.fillRect(24, 0, 8, 12); 
            ctx.fillRect(0, 24, 12, 8); 
            ctx.fillRect(24, 24, 8, 8);
            var expectedArray = ctx.getImageData(0, 0, 32, 32).data;
            var sprite = new enchant.Sprite(32, 32);
            sprite.image = surface;
            var actual = new enchant.Surface(32, 32);
            sprite.cvsRender(actual.context);
            var actualArray = actual.context.getImageData(0, 0, 32, 32).data;
            expect(expectedArray.length).to.be.equal(actualArray.length);
            var len = actualArray.length;
            var error = 0;
            var errorCapacity = Math.round(len / 100);
            for(var i = 0; i < len; i++) {
                if(actualArray[i] !== expectedArray[i]) {
                    error++;
                }
            }
            var result = ((len - error) / len * 100).toFixed(2) + "% same";
            expect(error).to.be.below(errorCapacity, result);
        });
    });
    
    describe("#collection behavior", function(){
        it("Node.remove", function(){
            var initialCollectionLength = enchant.Sprite.collection.length;
            var a = new enchant.Sprite(32, 32),
                b = new enchant.Sprite(32, 32),
                scene = new enchant.Scene(),
                ga = new enchant.Group();
            expect(enchant.Sprite.collection.length).to.be.equal(initialCollectionLength);
            scene.addChild(ga);
            expect(enchant.Sprite.collection.length).to.be.equal(initialCollectionLength);
            scene.addChild(b);
            expect(enchant.Sprite.collection.length).to.be.equal(initialCollectionLength+1);
            ga.addChild(a);
            expect(enchant.Sprite.collection.length).to.be.equal(initialCollectionLength+2);
            b.remove();
            expect(enchant.Sprite.collection.length).to.be.equal(initialCollectionLength+1);
            a.remove();
            expect(enchant.Sprite.collection.length).to.be.equal(initialCollectionLength);
            a = new enchant.Sprite(32, 32)
            expect(enchant.Sprite.collection.length).to.be.equal(initialCollectionLength);
            ga.addChild(a);
            expect(enchant.Sprite.collection.length).to.be.equal(initialCollectionLength+1);
            ga.remove();
            expect(enchant.Sprite.collection.length).to.be.equal(initialCollectionLength);
            a.remove();
            expect(enchant.Sprite.collection.length).to.be.equal(initialCollectionLength);
            
            a = new enchant.Sprite(32, 32)
            ga = new enchant.Group();
            expect(enchant.Sprite.collection.length).to.be.equal(initialCollectionLength);
            ga.addChild(a);
            expect(enchant.Sprite.collection.length).to.be.equal(initialCollectionLength);
            a.remove();
            ga.remove();
            expect(enchant.Sprite.collection.length).to.be.equal(initialCollectionLength);
            
            // listener check as remove has been used
            expect(a._listeners).to.be.empty;
            expect(b._listeners).to.be.empty;
            expect(ga._listeners).to.be.empty;
        });
        
        it("parentNode.removeChild", function(){
            var initialCollectionLength = enchant.Sprite.collection.length;
            var a = new enchant.Sprite(32, 32),
                b = new enchant.Sprite(32, 32),
                scene = new enchant.Scene(),
                ga = new enchant.Group();
            expect(enchant.Sprite.collection.length).to.be.equal(initialCollectionLength);
            scene.addChild(ga);
            expect(enchant.Sprite.collection.length).to.be.equal(initialCollectionLength);
            scene.addChild(b);
            expect(enchant.Sprite.collection.length).to.be.equal(initialCollectionLength+1);
            ga.addChild(a);
            expect(enchant.Sprite.collection.length).to.be.equal(initialCollectionLength+2);
            b.parentNode.removeChild(b);
            expect(enchant.Sprite.collection.length).to.be.equal(initialCollectionLength+1);
            a.parentNode.removeChild(a);
            expect(enchant.Sprite.collection.length).to.be.equal(initialCollectionLength);
            ga.addChild(a);
            expect(enchant.Sprite.collection.length).to.be.equal(initialCollectionLength+1);
            ga.parentNode.removeChild(ga);
            expect(enchant.Sprite.collection.length).to.be.equal(initialCollectionLength);
            a.parentNode.removeChild(a);
            expect(enchant.Sprite.collection.length).to.be.equal(initialCollectionLength);
            
            ga.addChild(a);
            expect(enchant.Sprite.collection.length).to.be.equal(initialCollectionLength);
            a.parentNode.removeChild(a);
            expect(enchant.Sprite.collection.length).to.be.equal(initialCollectionLength);
            
            expect(a._listeners).to.not.be.empty;
            expect(b._listeners).to.not.be.empty;
            expect(ga._listeners).to.not.be.empty;
        });
    });
});
