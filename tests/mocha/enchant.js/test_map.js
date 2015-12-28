describe('Map', function(){
    var core;

    before(function(){
        enchant();
        core = new Core();
    });

    it('is an instance of enchant.Entity', function(){
        var map = new Map();
        expect(map).to.be.an.instanceof(enchant.Entity);
    });

    describe('#initialize', function(){
        it('initializes values', function(){
            var map = new Map();
            expect(map.touchEnabled).to.be.false;
            expect(map.collisionData).to.be.null;
        });
    });

    describe('image', function(){
        var map, image;

        before(function(){
            map = new Map();
        });

        it('sets image which use for tile set', function(done){
            expect(map._image).to.be.null;
            core.load('../../../images/map0.png', 'mapImage', function(){
                map.image = core.assets['mapImage'];
                expect(map._image).to.equal(core.assets['mapImage']);
                done();
            });
        });

        it('returns an image of use for tile set', function(){
            expect(map.image).to.equal(core.assets['mapImage']);
        });
    });

    describe('tileWidth', function(){
        var map;

        before(function(){
            map = new Map();
        });

        it('sets tileWidth', function(){
            expect(map._tileWidth).to.equal(0);
            map.tileWidth = 16;
            expect(map._tileWidth).to.equal(16);
        });

        it('returns current tileWidth', function(){
            expect(map.tileWidth).to.equal(16);
        });
    });

    describe('tileHeight', function(){
        var map;

        before(function(){
            map = new Map();
        });

        it('sets tileHeight', function(){
            expect(map._tileHeight).to.equal(0);
            map.tileHeight = 16;
            expect(map._tileHeight).to.equal(16);
        });

        it('returns current tileHeight', function(){
            expect(map.tileHeight).to.equal(16);
        });
    });

    describe('#loadData', function(){
        var map;

        beforeEach(function(){
            map = new Map();
        });

        it('sets map data', function(){
            var mapData = [[1, 2, 3], [1, 2, 3], [1, 2, 3]];
            expect(map._data).to.deep.equal([[[]]]);
            map.loadData(mapData);
            expect(map._data).to.deep.equal([mapData]);
        });

        it('takes multiple map data', function(){
            var map1 = [[0, 0], [1, 1]];
            var map2 = [[2, 2], [3, 3]];
            map.loadData(map1, map2);
            expect(map._data).to.deep.equal([map1, map2]);
        });
    });

    describe('#checkTile', function(){
        var map;

        before(function(done){
            core = new Core(48, 48);
            map = new Map(16, 16);
            core.load('../../../images/map0.png', 'mapImage', function(){
                map.image = core.assets['mapImage'];
                var mapData = [[0, 1, 2], [3, 4, 5], [6, 7, 8]];
                map.loadData(mapData);
                done();
            });
        });

        it('checks what tile is present at the given position', function(){
            expect(map.checkTile(0, 0)).to.equal(0);
            expect(map.checkTile(17, 17)).to.equal(4);
            expect(map.checkTile(47, 47)).to.equal(8);
        });

        it('returns false when given position is out of range', function(){
            expect(map.checkTile(100, 100)).to.be.false;
        });
    });

    describe('#hitTest', function(){
        var map;

        before(function(done){
            core = new Core(48, 48);
            map = new Map(16, 16);
            core.load('../../../images/map0.png', 'mapImage', function(){
                var mapData = [[0, 0, 0], [1, 1, 1], [2, 2, 2]];
                var collisionData = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
                map.image = core.assets['mapImage'];
                map.collisionData = collisionData;
                map.loadData(mapData);
                done();
            });
        });

        it('returns true when obstacles exists on given position', function(){
            expect(map.hitTest(0, 0)).to.be.true;
            expect(map.hitTest(17, 17)).to.be.true;
            expect(map.hitTest(34, 34)).to.be.true;
        });

        it('returns false when obstacles does not exist on given potision', function(){
            expect(map.hitTest(17, 0)).to.be.false;
            expect(map.hitTest(17, 33)).to.be.false;
            expect(map.hitTest(0, 17)).to.be.false;
            expect(map.hitTest(33, 17)).to.be.false;
            expect(map.hitTest(0, 33)).to.be.false;
            expect(map.hitTest(17, 33)).to.be.false;
        });

        it('returns false when given position is out of range', function(){
            expect(map.hitTest(100, 100)).to.be.false;
        });
    });

    describe('#redraw', function(){
        var map;

        before(function(done){
            core = new Core(32, 32);
            map = new Map(16, 16);
            core.load('../../../images/map0.png', 'mapImage', function(){
                map.image = core.assets['mapImage'];
                map.loadData([[0, 1], [16, 17]]);
                done();
            });
        });

        it('draws map', function(){
            var expected_cvs = document.createElement('canvas');
            expected_cvs.setAttribute('width', 32);
            expected_cvs.setAttribute('height', 32);
            var expected_ctx = expected_cvs.getContext('2d');
            var image = new Image();
            image.src = '../../../images/map0.png';
            expected_ctx.drawImage(image, 0, 0, 32, 32, 0, 0, 32, 32);
            var expected = expected_ctx.getImageData(0, 0, 32, 32).data;
            map.redraw(0, 0, 32, 32);
            var actual_ctx = map._context;
            var actual = actual_ctx.getImageData(0, 0, 32, 32).data;
            expect(actual).to.deep.equal(expected);
        });
    });

    describe('#cvsRender', function(){
        var map;

        before(function(done){
            core = new Core(16, 16);
            map = new Map(16, 16);
            core.load('../../../images/map0.png', 'map0', function(){
                map.image = core.assets['map0'];
                map.loadData([[0]]);
                done();
            });
        });

        it('renders map to given context', function(done){
            var expected_cvs = document.createElement('canvas');
            expected_cvs.setAttribute('width', 16);
            expected_cvs.setAttribute('height', 16);
            var expected_ctx = expected_cvs.getContext('2d');
            var image = new Image();
            image.src = '../../../images/map0.png';
            expected_ctx.drawImage(image, 0, 0, 16, 16, 0, 0, 16, 16);
            var expected = expected_ctx.getImageData(0, 0, 16, 16).data;
            var actual_cvs = document.createElement('canvas');
            actual_cvs.setAttribute('width', 16);
            actual_cvs.setAttribute('height', 16);
            var actual_ctx = actual_cvs.getContext('2d');
            map.redraw(0, 0, 16, 16);
            map.cvsRender(actual_ctx);
            var actual = actual_ctx.getImageData(0, 0, 16, 16).data;
            expect(actual).to.deep.equal(expected);
            done();
        });
    });

    describe('#domRender', function(){
        var map;

        before(function(done){
            core = new Core(16, 16);
            map = new Map(16, 16);
            core.load('../../../images/map0.png', 'map0', function(){
                map.image = core.assets['map0'];
                map.loadData([[0]]);
                done();
            });
        });

        it('renders map to dom', function(){
            map.redraw(0, 0, 16, 16);
            map.domRender(document.createElement('div'));
            expect(map._style['background-image']).to.equal('-webkit-canvas(enchant-surface1)');
            expect(map._style[enchant.ENV.VENDOR_PREFIX + 'Transform']).to.equal('matrix(1, 0, 0, 1, 0, 0)');
         });
    });

    describe('when "render" event occurs', function(){
        var map;

        beforeEach(function(){
            core = new Core(64, 64);
            map = new Map(16, 16);
            sinon.spy(map, 'redraw');
        });

        it.skip('in case _dirty = false. NEED TO REFACTOR enchant.Map', function(){});

        it('the map should not be drawn as the offsets are not updated yet (1 frame lag issue #296 - https://github.com/wise9/enchant.js/issues/296)', function(done){
            core.load('../../../images/map0.png', 'map0', function(){
                map.image = core.assets['map0'];
                map.loadData([[0, 0, 0], [0, 0, 0], [0, 0, 0]]);
                map.dispatchEvent(new enchant.Event('render'));
            });
            map.addEventListener('render', function(){
                setTimeout(function(){
                    expect(map.redraw.notCalled).to.be.true;
                    done();
                }, 100);
            });

        });
        
        it('and the map is dirty, the previous offsets must be deleted to ensure a buffer update during the rendering', function(done){
            core.load('../../../images/map0.png', 'map0', function(){
                map.image = core.assets['map0'];
                map.loadData([[0, 0, 0], [0, 0, 0], [0, 0, 0]]);
                map._dirty = true;
                map._previousOffsetX = 1;
                map._previousOffsetY = 2;
                map.dispatchEvent(new enchant.Event('render'));
            });
            map.addEventListener('render', function(){
                setTimeout(function(){
                    expect(map._previousOffsetX).to.not.exist;
                    expect(map._previousOffsetY).to.not.exist;
                    done();
                }, 100);
            });

        });

        afterEach(function(){
            map.redraw.restore();
        });
    });
    
    describe('when "cvsRender" is called', function(){
        var map;

        before(function(){
            core = new Core(64, 64);
            map = new Map(16, 16);
            sinon.spy(map, 'redraw');
        });
        
        it('draws map with given conditions', function(done){
            core.load('../../../images/map0.png', 'map0', function(){
                map.image = core.assets['map0'];
                map.loadData([[0, 0, 0], [0, 0, 0], [0, 0, 0]]);
                map.dispatchEvent(new enchant.Event('render'));
                var surface = new enchant.Surface(64,64);
                map.cvsRender(surface.context);
            });
            map.addEventListener('render', function(){
                setTimeout(function(){
                    expect(map.redraw.lastCall.calledWithExactly(0, 0, 64, 64)).to.be.true;
                    done();
                }, 100);
            });

        });

        after(function(){
            map.redraw.restore();
        });
    });
    

    describe('when "domRender" is called', function(){
        var map;

        before(function(){
            core = new Core(64, 64);
            map = new Map(16, 16);
            sinon.spy(map, 'redraw');
        });

        it('draws map with given conditions', function(done){
            core.load('../../../images/map0.png', 'map0', function(){
                map.image = core.assets['map0'];
                map.loadData([[0, 0, 0], [0, 0, 0], [0, 0, 0]]);
                map.dispatchEvent(new enchant.Event('render'));
                var surface = new enchant.Surface(64,64);
                map.domRender(document.createElement('div'));
            });
            map.addEventListener('render', function(){
                setTimeout(function(){
                    expect(map.redraw.lastCall.calledWithExactly(0, 0, 64, 64)).to.be.true;
                    done();
                }, 100);
            });

        });
        
        describe('when managed in core', function(){
            var map;

            before(function(){
                core = new Core(64, 64);
                map = new Map(16, 16);
                sinon.spy(map, 'redraw');
            });
            
            it('the map should only be drawn once without modification', function(done){
                core.preload({map0: '../../../images/map0.png'});
                core.onload = function() {
                    map.image = core.assets['map0'];
                    map.loadData([[0, 0, 0], [0, 0, 0], [0, 0, 0]]);
                    core.rootScene.addChild(map);
                    core.rootScene.addEventListener("enterframe", function() {
                        if(this.age === 5) {
                            expect(map.redraw.callCount).to.equal(1);
                            expect(map.redraw.lastCall.calledWithExactly(0, 0, 64, 64)).to.be.true;
                            done();
                        }
                    });
                    core.rootScene.age = 0;
                }
                core.start();
            });
            
            it('the map should be redrawn once and only once when it became dirty', function(done){
                core.rootScene.age = 100;
                map._dirty = true;
                core.rootScene.addEventListener("enterframe", function() {
                    if(this.age === 105) {
                        expect(map.redraw.callCount).to.equal(2);
                        expect(map.redraw.lastCall.calledWithExactly(0, 0, 64, 64)).to.be.true;
                        done();
                    }
                });
            });

            after(function(){
                map.redraw.restore();
            });
        });

        after(function(){
            map.redraw.restore();
        });
    });
});