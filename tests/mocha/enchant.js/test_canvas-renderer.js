describe('CanvasRenderer', function(){
    var core;

    before(function(){
        enchant();
        core = new Core();
    });
    
    it('enchant.CanvasRenderer.instance exists', function(){
        expect(enchant.CanvasRenderer.instance).to.exist;
    });

    describe('#render', function(){
        var scene, sprite, e;
        beforeEach(function(){
            scene = new CanvasScene();
            sprite = new Sprite(100, 100);
            scene.addChild(sprite);
            e = new enchant.Event('render');
        });

        it('dispatches given event from given node', function(){
            var spy = sinon.spy();
            sprite.addEventListener('render', spy);
            expect(spy.called).to.be.false;
            enchant.CanvasRenderer.instance.render(scene._layers.Canvas.context, sprite, e);
            expect(spy.called).to.be.true;
        });

        it('renders given node', function(){
            sprite.backgroundColor = 'red';
            var before1 = scene._layers.Canvas.context.getImageData(0, 0, 1, 1).data;
            expect(before1[0]).to.equal(0);
            expect(before1[1]).to.equal(0);
            expect(before1[2]).to.equal(0);
            expect(before1[3]).to.equal(0);
            var before2 = scene._layers.Canvas.context.getImageData(50, 50, 1, 1).data;
            expect(before2[0]).to.equal(0);
            expect(before2[1]).to.equal(0);
            expect(before2[2]).to.equal(0);
            expect(before2[3]).to.equal(0);
            var before3 = scene._layers.Canvas.context.getImageData(99, 99, 1, 1).data;
            expect(before3[0]).to.equal(0);
            expect(before3[1]).to.equal(0);
            expect(before3[2]).to.equal(0);
            expect(before3[3]).to.equal(0);
            var before4 = scene._layers.Canvas.context.getImageData(100, 100, 1, 1).data;
            expect(before4[0]).to.equal(0);
            expect(before4[1]).to.equal(0);
            expect(before4[2]).to.equal(0);
            expect(before4[3]).to.equal(0);
            enchant.CanvasRenderer.instance.render(scene._layers.Canvas.context, sprite, e);
            var after1 = scene._layers.Canvas.context.getImageData(0, 0, 1, 1).data;
            expect(after1[0]).to.equal(255);
            expect(after1[1]).to.equal(0);
            expect(after1[2]).to.equal(0);
            expect(after1[3]).to.equal(255);
            var after2 = scene._layers.Canvas.context.getImageData(50, 50, 1, 1).data;
            expect(after2[0]).to.equal(255);
            expect(after2[1]).to.equal(0);
            expect(after2[2]).to.equal(0);
            expect(after2[3]).to.equal(255);
            var after3 = scene._layers.Canvas.context.getImageData(99, 99, 1, 1).data;
            expect(after3[0]).to.equal(255);
            expect(after3[1]).to.equal(0);
            expect(after3[2]).to.equal(0);
            expect(after3[3]).to.equal(255);
            var after4 = scene._layers.Canvas.context.getImageData(100, 100, 1, 1).data;
            expect(after4[0]).to.equal(0);
            expect(after4[1]).to.equal(0);
            expect(after4[2]).to.equal(0);
            expect(after4[3]).to.equal(0);
        });

        it('sets globalCompositeOperation to given context', function(){
            var group = new Group(),
                sprite1 = new Sprite(20, 20),
                sprite2 = new Sprite(20, 20);
            group.addChild(sprite1);
            group.addChild(sprite2);
            scene.addChild(group);
            group.compositeOperation = 'xor';
            sprite1.backgroundColor = 'red';
            sprite2.backgroundColor = 'blue';
            sprite2.x = 10; sprite2.y = 10;
            var before1 = scene._layers.Canvas.context.getImageData(5, 5, 1, 1).data;
            expect(before1[0]).to.equal(0);
            expect(before1[1]).to.equal(0);
            expect(before1[2]).to.equal(0);
            expect(before1[3]).to.equal(0);
            var before2 = scene._layers.Canvas.context.getImageData(15, 15, 1, 1).data;
            expect(before2[0]).to.equal(0);
            expect(before2[1]).to.equal(0);
            expect(before2[2]).to.equal(0);
            expect(before2[3]).to.equal(0);
            var before3 = scene._layers.Canvas.context.getImageData(25, 25, 1, 1).data;
            expect(before3[0]).to.equal(0);
            expect(before3[1]).to.equal(0);
            expect(before3[2]).to.equal(0);
            expect(before3[3]).to.equal(0);
            enchant.CanvasRenderer.instance.render(scene._layers.Canvas.context, group, e);
            var after1 = scene._layers.Canvas.context.getImageData(5, 5, 1, 1).data;
            expect(after1[0]).to.equal(255);
            expect(after1[1]).to.equal(0);
            expect(after1[2]).to.equal(0);
            expect(after1[3]).to.equal(255);
            var after2 = scene._layers.Canvas.context.getImageData(15, 15, 1, 1).data;
            expect(after2[0]).to.equal(0);
            expect(after2[1]).to.equal(0);
            expect(after2[2]).to.equal(0);
            expect(after2[3]).to.equal(0);
            var after3 = scene._layers.Canvas.context.getImageData(25, 25, 1, 1).data;
            expect(after3[0]).to.equal(0);
            expect(after3[1]).to.equal(0);
            expect(after3[2]).to.equal(255);
            expect(after3[3]).to.equal(255);
        });

        it('sets globalAlpha to given context', function(){
            sprite._opacity = 0.5;
            sprite.backgroundColor = 'red';
            var before = scene._layers.Canvas.context.getImageData(1, 1, 1, 1).data;
            expect(before[0]).to.equal(0);
            expect(before[1]).to.equal(0);
            expect(before[2]).to.equal(0);
            expect(before[3]).to.equal(0);
            enchant.CanvasRenderer.instance.render(scene._layers.Canvas.context, sprite, e);
            var after = scene._layers.Canvas.context.getImageData(1, 1, 1, 1).data;
            expect(after[0]).to.equal(255);
            expect(after[1]).to.equal(0);
            expect(after[2]).to.equal(0);
            expect(after[3]).to.equal(127);
        });

        it('draws background with given node\'s backgroundColor', function(){
            sprite.backgroundColor = 'red';
            var before = scene._layers.Canvas.context.getImageData(1, 1, 1, 1).data;
            expect(before[0]).to.equal(0);
            expect(before[1]).to.equal(0);
            expect(before[2]).to.equal(0);
            expect(before[3]).to.equal(0);
            enchant.CanvasRenderer.instance.render(scene._layers.Canvas.context, sprite, e);
            var after = scene._layers.Canvas.context.getImageData(1, 1, 1, 1).data;
            expect(after[0]).to.equal(255);
            expect(after[1]).to.equal(0);
            expect(after[2]).to.equal(0);
            expect(after[3]).to.equal(255);
        });

        it('calls #transform', function(){
            sinon.spy(enchant.CanvasRenderer.instance, 'transform');
            expect(enchant.CanvasRenderer.instance.transform.called).to.be.false;
            enchant.CanvasRenderer.instance.render(scene._layers.Canvas.context, sprite, e);
            expect(enchant.CanvasRenderer.instance.transform.called).to.be.true;
            enchant.CanvasRenderer.instance.transform.restore();
        });

        it('calls given node\'s #svcRender method if exists', function(){
            sinon.spy(sprite, 'cvsRender');
            expect(sprite.cvsRender.called).to.be.false;
            enchant.CanvasRenderer.instance.render(scene._layers.Canvas.context, sprite, e);
            expect(sprite.cvsRender.called).to.be.true;
            expect(sprite.cvsRender.calledWith(scene._layers.Canvas.context)).to.be.true;
            sprite.cvsRender.restore();
        });

        it('draws outline of given node if the game starts with debug mode', function(){
            core._debug = true;
            var before = scene._layers.Canvas.context.getImageData(0, 0, 1, 1).data;
            expect(before[0]).to.equal(0);
            expect(before[1]).to.equal(0);
            expect(before[2]).to.equal(0);
            expect(before[3]).to.equal(0);
            enchant.CanvasRenderer.instance.render(scene._layers.Canvas.context, sprite, e);
            var after = scene._layers.Canvas.context.getImageData(0, 0, 1, 1).data;
            expect(after[0]).to.equal(255);
            expect(after[1]).to.equal(0);
            expect(after[2]).to.equal(0);
            expect(after[3]).to.equal(192);
            core._debug = false;
        });

        it('sets clipping area if clipping flag set', function(){
            var group = new Group(),
                sprite1 = new Sprite(100, 100);
            group.addChild(sprite1);
            group.width = 50; group.height = 50;
            group._clipping = true;
            sprite1.backgroundColor = 'red';
            scene.addChild(group);
            scene._layers.Canvas.context.clearRect(0, 0, core.width, core.height);
            var before1 = scene._layers.Canvas.context.getImageData(1, 1, 1, 1).data;
            expect(before1[0]).to.equal(0);
            expect(before1[1]).to.equal(0);
            expect(before1[2]).to.equal(0);
            expect(before1[3]).to.equal(0);
            var before2 = scene._layers.Canvas.context.getImageData(60, 60, 1, 1).data;
            expect(before2[0]).to.equal(0);
            expect(before2[1]).to.equal(0);
            expect(before2[2]).to.equal(0);
            expect(before2[3]).to.equal(0);
            enchant.CanvasRenderer.instance.render(scene._layers.Canvas.context, group, e);
            var after1 = scene._layers.Canvas.context.getImageData(1, 1, 1, 1).data;
            expect(after1[0], 'inside clipping area').to.equal(255);
            expect(after1[1], 'inside clipping area').to.equal(0);
            expect(after1[2], 'inside clipping area').to.equal(0);
            expect(after1[3], 'inside clipping area').to.equal(255);
            var after2 = scene._layers.Canvas.context.getImageData(60, 60, 1, 1).data;
            expect(after2[0], 'outside clipping area').to.equal(0);
            expect(after2[1], 'outside clipping area').to.equal(0);
            expect(after2[2], 'outside clipping area').to.equal(0);
            expect(after2[3], 'outside clipping area').to.equal(0);
        });

        it('draws given node\'s children', function(){
            var group = new Group(),
                sprite1 = new Sprite(10, 10),
                sprite2 = new Sprite(10, 10);
            group.addChild(sprite1);
            group.addChild(sprite2);
            scene.addChild(group);
            sprite1.backgroundColor = 'blue';
            sprite2.x = 100; sprite2.y = 100;
            sprite2.backgroundColor = 'red';
            var before1 = scene._layers.Canvas.context.getImageData(1, 1, 1, 1).data;
            expect(before1[0]).to.equal(0);
            expect(before1[1]).to.equal(0);
            expect(before1[2]).to.equal(0);
            expect(before1[3]).to.equal(0);
            var before2 = scene._layers.Canvas.context.getImageData(101, 101, 1, 1).data;
            expect(before2[0]).to.equal(0);
            expect(before2[1]).to.equal(0);
            expect(before2[2]).to.equal(0);
            expect(before2[3]).to.equal(0);
            var before3 = scene._layers.Canvas.context.getImageData(30, 30, 1, 1).data;
            expect(before3[0]).to.equal(0);
            expect(before3[1]).to.equal(0);
            expect(before3[2]).to.equal(0);
            expect(before3[3]).to.equal(0);
            enchant.CanvasRenderer.instance.render(scene._layers.Canvas.context, group, e);
            var after1 = scene._layers.Canvas.context.getImageData(1, 1, 1, 1).data;
            expect(after1[0]).to.equal(0);
            expect(after1[1]).to.equal(0);
            expect(after1[2]).to.equal(255);
            expect(after1[3]).to.equal(255);
            var after2 = scene._layers.Canvas.context.getImageData(101, 101, 1, 1).data;
            expect(after2[0]).to.equal(255);
            expect(after2[1]).to.equal(0);
            expect(after2[2]).to.equal(0);
            expect(after2[3]).to.equal(255);
            var after3 = scene._layers.Canvas.context.getImageData(30, 30, 1, 1).data;
            expect(after3[0]).to.equal(0);
            expect(after3[1]).to.equal(0);
            expect(after3[2]).to.equal(0);
            expect(after3[3]).to.equal(0);
        });

        it('draws transformed node', function(){
            sinon.spy(enchant.CanvasRenderer.instance, 'transform');
            sprite.backgroundColor = 'red';
            enchant.CanvasRenderer.instance.render(scene._layers.Canvas.context, sprite, e);
            var before1 = scene._layers.Canvas.context.getImageData(10, 10, 1, 1).data;
            expect(before1[0]).to.equal(255);
            expect(before1[1]).to.equal(0);
            expect(before1[2]).to.equal(0);
            expect(before1[3]).to.equal(255);
            var before2 = scene._layers.Canvas.context.getImageData(150, 10, 1, 1).data;
            expect(before2[0]).to.equal(0);
            expect(before2[1]).to.equal(0);
            expect(before2[2]).to.equal(0);
            expect(before2[3]).to.equal(0);
            sprite.width = 200;
            scene._layers.Canvas.context.clearRect(0, 0, core.width, core.height);
            enchant.CanvasRenderer.instance.render(scene._layers.Canvas.context, sprite, e);
            var after1 = scene._layers.Canvas.context.getImageData(10, 10, 1, 1).data;
            expect(after1[0]).to.equal(255);
            expect(after1[1]).to.equal(0);
            expect(after1[2]).to.equal(0);
            expect(after1[3]).to.equal(255);
            var after2 = scene._layers.Canvas.context.getImageData(150, 10, 1, 1).data;
            expect(after2[0]).to.equal(255);
            expect(after2[1]).to.equal(0);
            expect(after2[2]).to.equal(0);
            expect(after2[3]).to.equal(255);
            sprite.x = 20; sprite.y = 20;
            scene._layers.Canvas.context.clearRect(0, 0, core.width, core.height);
            enchant.CanvasRenderer.instance.render(scene._layers.Canvas.context, sprite, e);
            after1 = scene._layers.Canvas.context.getImageData(10, 10, 1, 1).data;
            expect(after1[0]).to.equal(0);
            expect(after1[1]).to.equal(0);
            expect(after1[2]).to.equal(0);
            expect(after1[3]).to.equal(0);
            after2 = scene._layers.Canvas.context.getImageData(20, 20, 1, 1).data;
            expect(after2[0]).to.equal(255);
            expect(after2[1]).to.equal(0);
            expect(after2[2]).to.equal(0);
            expect(after2[3]).to.equal(255);
            var after3 = scene._layers.Canvas.context.getImageData(219, 119, 1, 1).data;
            expect(after3[0]).to.equal(255);
            expect(after3[1]).to.equal(0);
            expect(after3[2]).to.equal(0);
            expect(after3[3]).to.equal(255);
            var after4 = scene._layers.Canvas.context.getImageData(220, 120, 1, 1).data;
            expect(after4[0]).to.equal(0);
            expect(after4[1]).to.equal(0);
            expect(after4[2]).to.equal(0);
            expect(after4[3]).to.equal(0);
            enchant.CanvasRenderer.instance.transform.restore();
        });
    });

    describe('#detectRender', function(){
        var scene, sprite;

        beforeEach(function(){
            scene = new CanvasScene();
            sprite = new Sprite(100, 100);
            scene.addChild(sprite);
        });

        it('draws figure to detect canvas', function(){
            var before = scene._layers.Canvas._dctx.getImageData(1, 1, 1, 1).data;
            expect(before[0]).to.equal(0);
            expect(before[1]).to.equal(0);
            expect(before[2]).to.equal(0);
            expect(before[3]).to.equal(0);
            enchant.CanvasRenderer.instance.detectRender(scene._layers.Canvas._dctx, sprite);
            var after = scene._layers.Canvas._dctx.getImageData(1, 1, 1, 1).data;
            expect(after[0], 'inside sprite').to.equal(0);
            expect(after[1], 'inside sprite').to.equal(0);
            expect(after[2], 'inside sprite').to.equal(16);
            expect(after[3], 'inside sprite').to.equal(255);
            var after2 = scene._layers.Canvas._dctx.getImageData(100, 100, 1, 1).data;
            expect(after2[0], 'outside sprite').to.equal(0);
            expect(after2[0], 'outside sprite').to.equal(0);
            expect(after2[0], 'outside sprite').to.equal(0);
            expect(after2[0], 'outside sprite').to.equal(0);
        });

        it('does nothing if given node is not visible', function(){
            sprite.visible = false;
            var before = scene._layers.Canvas._dctx.getImageData(1, 1, 1, 1).data;
            expect(before[0]).to.equal(0);
            expect(before[1]).to.equal(0);
            expect(before[2]).to.equal(0);
            expect(before[3]).to.equal(0);
            enchant.CanvasRenderer.instance.detectRender(scene._layers.Canvas._dctx, sprite);
            var after = scene._layers.Canvas._dctx.getImageData(1, 1, 1, 1).data;
            expect(after[0]).to.equal(0);
            expect(after[1]).to.equal(0);
            expect(after[2]).to.equal(0);
            expect(after[3]).to.equal(0);
        });

        it('clips the detect canvas', function(){
            var group = new Group(),
                sprite1 = new Sprite(100, 100);
            group._clipping = true;
            group.width = 20;
            group.height = 20;
            group.addChild(sprite1);
            scene.addChild(group);
            var before1 = scene._layers.Canvas._dctx.getImageData(1, 1, 1, 1).data;
            expect(before1[0], 'inside clipping area').to.equal(0);
            expect(before1[1], 'inside clipping area').to.equal(0);
            expect(before1[2], 'inside clipping area').to.equal(0);
            expect(before1[3], 'inside clipping area').to.equal(0);
            var before2 = scene._layers.Canvas._dctx.getImageData(30, 30, 1, 1).data;
            expect(before2[0], 'outside clipping area').to.equal(0);
            expect(before2[1], 'outside clipping area').to.equal(0);
            expect(before2[2], 'outside clipping area').to.equal(0);
            expect(before2[3], 'outside clipping area').to.equal(0);
            enchant.CanvasRenderer.instance.detectRender(scene._layers.Canvas._dctx, group);
            var after1 = scene._layers.Canvas._dctx.getImageData(1, 1, 1, 1).data;
            expect(after1[0], 'inside clipping area').to.equal(0);
            expect(after1[1], 'inside clipping area').to.equal(0);
            expect(after1[2], 'inside clipping area').to.equal(48);
            expect(after1[3], 'inside clipping area').to.equal(255);
            var after2 = scene._layers.Canvas._dctx.getImageData(30, 30, 1, 1).data;
            expect(after2[0], 'outside clipping area').to.equal(0);
            expect(after2[1], 'outside clipping area').to.equal(0);
            expect(after2[2], 'outside clipping area').to.equal(0);
            expect(after2[3], 'outside clipping area').to.equal(0);
        });

        it('draws its childNodes to detect canvas', function(){
            var group = new Group(),
                sprite1 = new Sprite(10, 10),
                sprite2 = new Sprite(10, 10);
            group.addChild(sprite1);
            group.addChild(sprite2);
            scene.addChild(group);
            sprite1.x = 0; sprite1.y = 0;
            sprite2.x = 100; sprite2.y = 100;
            var before1 = scene._layers.Canvas._dctx.getImageData(1, 1, 1, 1).data;
            expect(before1[0]).to.equal(0);
            expect(before1[1]).to.equal(0);
            expect(before1[2]).to.equal(0);
            expect(before1[3]).to.equal(0);
            var before2 = scene._layers.Canvas._dctx.getImageData(101, 101, 1, 1).data;
            expect(before2[0]).to.equal(0);
            expect(before2[1]).to.equal(0);
            expect(before2[2]).to.equal(0);
            expect(before2[3]).to.equal(0);
            var before3 = scene._layers.Canvas._dctx.getImageData(30, 30, 1, 1).data;
            expect(before3[0]).to.equal(0);
            expect(before3[1]).to.equal(0);
            expect(before3[2]).to.equal(0);
            expect(before3[3]).to.equal(0);
            enchant.CanvasRenderer.instance.detectRender(scene._layers.Canvas._dctx, group);
            var after1 = scene._layers.Canvas._dctx.getImageData(1, 1, 1, 1).data;
            expect(after1[0]).to.equal(0);
            expect(after1[1]).to.equal(0);
            expect(after1[2]).to.equal(48);
            expect(after1[3]).to.equal(255);
            var after2 = scene._layers.Canvas._dctx.getImageData(101, 101, 1, 1).data;
            expect(after2[0]).to.equal(0);
            expect(after2[1]).to.equal(0);
            expect(after2[2]).to.equal(64);
            expect(after2[3]).to.equal(255);
            var after3 = scene._layers.Canvas._dctx.getImageData(30, 30, 1, 1).data;
            expect(after3[0]).to.equal(0);
            expect(after3[1]).to.equal(0);
            expect(after3[2]).to.equal(0);
            expect(after3[3]).to.equal(0);
        });

        it('calls #transform method', function(){
            sinon.spy(enchant.CanvasRenderer.instance, 'transform');
            expect(enchant.CanvasRenderer.instance.transform.called).to.be.false;
            enchant.CanvasRenderer.instance.detectRender(scene._layers.Canvas._dctx, sprite);
            expect(enchant.CanvasRenderer.instance.transform.called).to.be.true;
            expect(enchant.CanvasRenderer.instance.transform.calledWith(scene._layers.Canvas._dctx, sprite)).to.be.true;
            enchant.CanvasRenderer.instance.transform.restore();
        });
    });

    describe('#transform', function(){
        var scene, sprite;
        beforeEach(function(){
            scene = new CanvasScene();
            sprite = new Sprite(100, 100);
            scene.addChild(sprite);
        });

        it('does not caluculate transform matrix when the given node is not dirty', function(){
            var originalMatrix = sprite._matrix;
            expect(sprite._dirty).to.be.false;
            expect(enchant.Matrix.instance.stack).to.deep.equal([[1, 0, 0, 1, 0, 0]]);
            enchant.CanvasRenderer.instance.transform(scene._layers.Canvas.context, sprite);
            expect(sprite._dirty).to.be.false;
            expect(enchant.Matrix.instance.stack).to.deep.equal([[1, 0, 0, 1, 0, 0], originalMatrix]);
            enchant.Matrix.instance.stack.pop();
        });

        it('caluculate transform matrix', function(){
            expect(enchant.Matrix.instance.stack).to.deep.equal([[1, 0, 0, 1, 0, 0]]);
            sprite.scaleX = 2; sprite.scaleY = 2;
            sprite.x = 10; sprite.y = 10;
            enchant.CanvasRenderer.instance.transform(scene._layers.Canvas.context, sprite);
            expect(enchant.Matrix.instance.stack).to.deep.equal([[1, 0, 0, 1, 0, 0], [2, 0, 0, 2, -40, -40]]);
            enchant.Matrix.instance.stack.pop();
        });
    });
});