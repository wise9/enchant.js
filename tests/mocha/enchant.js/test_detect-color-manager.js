describe('DetectColorManager', function(){
    var colorManager;

    before(function(){
        enchant();
    });

    beforeEach(function(){
        colorManager = new DetectColorManager(16, 256);
    });

    describe('#initialize', function(){
        it('sets default color resolution value to 16', function(){
            colorManger = new DetectColorManager();
            expect(colorManager.colorResolution).to.equal(16);
        });

        it('sets color resolution value to given value', function(){
            colorManager = new DetectColorManager(32);
            expect(colorManager.colorResolution).to.equal(32);
        });

        it('sets default max value of color to 1', function(){
            colorManager = new DetectColorManager();
            expect(colorManager.max).to.equal(1);
        });

        it('sets max value of color to given value', function(){
            expect(colorManager.max).to.equal(256);
        });

        it('initializes reference array', function(){
            var expectedLength = Math.pow(16, 3);
            expect(colorManager.reference).to.have.length(expectedLength);
            for(var i = 1; i < expectedLength; i++) {
                expect(colorManager.reference[i]).to.be.null;
            }
        });
    });

    describe('#attachDetectColor', function(){
        it('adds given sprite to reference', function(){
            var sprite = new Sprite();
            colorManager.attachDetectColor(sprite);
            expect(colorManager.reference[1]).to.equal(sprite);
        });

        it('returns array of color code', function(){
            var sprite = new Sprite();
            var ret = colorManager.attachDetectColor(sprite);
            expect(ret[0]).to.equal(0);
            expect(ret[1]).to.equal(0);
            expect(ret[2]).to.equal(16);
            expect(ret[3]).to.equal(1.0);
        });
    });

    describe('#detachDetectColor', function(){
        it('removes given sprite from reference', function(){
            var sprite = new Sprite();
            colorManager.attachDetectColor(sprite);
            expect(colorManager.reference[1]).to.equal(sprite);
            colorManager.detachDetectColor(sprite);
            expect(colorManager.reference[1]).to.be.null;
        });
    });

    describe('#getSpriteByColor', function(){
        it('returns sprite which correspond with given color', function(){
            var sprite1 = new Sprite(),
                sprite2 = new Sprite();
            var ret1 = colorManager.attachDetectColor(sprite1);
            var ret2 = colorManager.attachDetectColor(sprite2);
            expect(colorManager.getSpriteByColor(ret2)).to.equal(sprite2);
            expect(colorManager.getSpriteByColor(ret1)).to.equal(sprite1);
        });
    });

    describe('#getSpriteByColors', function(){
        it('returns sprite which correspond with most appeared color', function(){
            var sprite1 = new Sprite(),
                sprite2 = new Sprite();
            var ret1 = colorManager.attachDetectColor(sprite1);
            var ret2 = colorManager.attachDetectColor(sprite2);
            expect(colorManager.getSpriteByColors(ret1)).to.equal(sprite1);
            expect(colorManager.getSpriteByColors([].concat(ret1, ret1, ret2))).to.equal(sprite1);
            expect(colorManager.getSpriteByColors([].concat(ret1, ret2, ret2))).to.equal(sprite2);
        });
    });

    describe('#_getColor', function(){
        it('returns array of color code which calculated with given number', function(){
            expect(colorManager._getColor(1)).to.deep.equal([0, 0, 16, 1]);
            expect(colorManager._getColor(2)).to.deep.equal([0, 0, 32, 1]);
            expect(colorManager._getColor(256)).to.deep.equal([16, 0, 0, 1]);
        });
    });

    describe('#_decodeDetectColor', function(){
        it('returns decoded value which calculated with given color array', function(){
            expect(colorManager._decodeDetectColor([0, 0, 16, 1])).to.equal(1);
            expect(colorManager._decodeDetectColor([0, 0, 32, 1])).to.equal(2);
            expect(colorManager._decodeDetectColor([16, 0, 0, 1])).to.equal(256);
        });

        it('read color from passed index', function(){
            var rgba = [ 0, 0, 16, 1, 0, 0, 32, 1, 16, 0, 0, 1]
            expect(colorManager._decodeDetectColor(rgba, 0)).to.equal(1);
            expect(colorManager._decodeDetectColor(rgba, 4)).to.equal(2);
            expect(colorManager._decodeDetectColor(rgba, 8)).to.equal(256);
        });
    });
});