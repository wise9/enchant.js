describe('Core', function(){

    before(function(){
        enchant();
    });

    var makeKeyEvent = function(keycode, type){
        var keyEvent = document.createEvent('KeyboardEvent');
        keyEvent.initKeyboardEvent(type, true, true, window, true, false, false, false, keycode, keycode);
        return keyEvent;
    };

    var makeKeydownEvent = function(keycode){
        return makeKeyEvent(keycode, 'keydown');
    };

    var makeKeyupEvent = function(keycode) {
        return makeKeyEvent(keycode, 'keyup');
    };

    var makeMouseEvent = function(type) {
        var mouseEvent = document.createEvent('MouseEvent');
        mouseEvent.initMouseEvent(type, true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
        return mouseEvent;
    };

    describe('enchant.Core.instance', function(){
        it('returns instance of enchant.Core', function(){
            var core = new Core();
            expect(enchant.Core.instance).not.to.be.null;
            expect(enchant.Core.instance).to.be.an.instanceOf(enchant.Core);
        });
    });

    describe('initialize', function(){
        it('sets default values', function(){
            var stage = document.getElementById('enchant-stage');
            var expectedScale;
            if(stage) {
                var style = window.getComputedStyle(document.getElementById('enchant-stage'));
                var sWidth = parseInt(style.width, 10),
                    sHeight = parseInt(style.height, 10);
                expectedScale = Math.min(sWidth / 320, sHeight / 320);
            } else {
                expectedScale = Math.min(window.innerWidth / 320, window.innerHeight / 320);
            }
            var core = new Core();
            expect(core.scale).to.equal(expectedScale);
            expect(core.fps).to.equal(30);
            expect(core.frame).to.equal(0);
            expect(core.ready).to.be.false;
            expect(core.running).to.be.false;
            expect(core.currentScene).to.equal(core.rootScene);
            expect(core.rootScene).to.be.an.instanceOf(enchant.Scene);
            expect(core.loadingScene).to.be.an.instanceOf(enchant.LoadingScene);
        });

        it('loads preloaded assets', function(done){
            var core = new Core();
            expect(core.assets).to.be.empty;
            core.preload('../../../images/chara1.png');
            core.addEventListener('load', function(){
                expect(core.assets['../../../images/chara1.png']).to.be.exist;
                var loadedAsset = core.assets['../../../images/chara1.png'];
                expect(loadedAsset).to.be.instanceOf(enchant.Surface);
                done();
            });
            core.start();
        });
    });

    describe('Event Handlings', function(){
        var core;
        beforeEach(function(){
            enchant.ENV.TOUCH_ENAVLED = true;
            core = new Core();
        });

        it('dispatches enchant.Event("keydown") when keydown event occurred', function(){
            var listenerOnCore = sinon.spy(),
                listenerOnDocument = sinon.spy();
            core.addEventListener('keydown', listenerOnCore);
            expect(listenerOnDocument.called).to.be.false;
            expect(listenerOnCore.called).to.be.false;
            document.addEventListener('keydown', listenerOnDocument);
            document.dispatchEvent(makeKeydownEvent(1));
            expect(listenerOnDocument.called).to.be.true;
            expect(listenerOnCore.called).to.be.true;
        });
    });

    describe('width', function(){
        var core;

        beforeEach(function(){
            core = new Core(400, 400);
        });

        it('returns width of the core screen', function(){
            expect(core.width).to.equal(400);
        });

        it('sets new width of the core screen', function(){
            expect(core.width).to.equal(400);
            core.width = 320;
            expect(core.width).to.equal(320);
        });

        it('dispatches coreresize event when new width set', function(){
            var callback = sinon.spy();
            core.addEventListener('coreresize', callback);
            expect(callback.called).to.be.false;
            core.width = 320;
            expect(callback.called).to.be.true;
        });
    });

    describe('height', function(){
        var core;

        beforeEach(function(){
            core = new Core(400, 400);
        });

        it('returns height of the core screen', function(){
            expect(core.height).to.equal(400);
        });

        it('sets new height of the core screen', function(){
            expect(core.height).to.equal(400);
            core.height = 320;
            expect(core.height).to.equal(320);
        });

        it('dispatches coreresize event when new height set', function(){
            var callback = sinon.spy();
            core.addEventListener('coreresize', callback);
            expect(callback.called).to.be.false;
            core.height = 320;
            expect(callback.called).to.be.true;
        });
    });

    describe('scale', function(){
        var core;

        beforeEach(function(){
            core = new Core();
        });

        it('returns scaling of the core rendering', function(){
            var style = window.getComputedStyle(document.getElementById('enchant-stage'));
            var sWidth = parseInt(style.width, 10),
                sHeight = parseInt(style.height, 10);
            expectedScale = Math.min(sWidth/core.width, sHeight/core.height);
            expect(core.scale).to.equal(expectedScale);
        });

        it('sets scaling of the core rendering', function(){
            expect(core.scale).to.not.equal(1);
            core.scale = 1;
            expect(core.scale).to.equal(1);
        });

        it('dispatches coreresize event when new scale set', function(){
            var callback = sinon.spy();
            core.addEventListener('coreresize', callback);
            expect(callback.called).to.be.false;
            core.scale = 1;
            expect(callback.called).to.be.true;
        });
    });

    describe('#preload', function(){
        it('sets an asset for preloading', function(){
            var core = new Core();
            expect(core._assets).to.be.empty;
            core.preload('../../../images/chara0.png');
            expect(core._assets).to.have.length(1);
            expect(core._assets[0]).to.equal('../../../images/chara0.png');
        });

        it('sets some assets for preloading', function(){
            var core = new Core();
            expect(core._assets).to.be.empty;
            core.preload(['../../../images/chara0.png', '../../../images/chara1.png']);
            expect(core._assets).to.have.length(2);
            expect(core._assets[0]).to.equal('../../../images/chara0.png');
            expect(core._assets[1]).to.equal('../../../images/chara1.png');
        });
    });

    describe('#load', function(){
        var core;

        beforeEach(function(){
            core = new Core();
        });

        it('loads file as enchant.Surface', function(done){
            core.load('../../../images/chara0.png', function(){
                var assets = enchant.Core.instance.assets;
                expect(assets['../../../images/chara0.png']).to.be.an.instanceof(enchant.Surface);
                done();
            });
        });

        it('loads file by xhr', function(done){
            core.load('https://raw.githubusercontent.com/wise9/enchant.js/master/images/chara0.png', 'image', function(){
                expect(enchant.Core.instance.assets['image']).to.be.an.instanceof(enchant.Surface);
                done();
            });
        });

        it('sets alias name to loaded file', function(done){
            core.load('../../../images/chara0.png', 'chara0', function(){
                var assets = enchant.Core.instance.assets;
                expect(assets['../../../images/chara0.png']).to.be.undefined;
                expect(assets['chara0']).to.exist;
                expect(assets['chara0']).to.be.an.instanceof(enchant.Surface);
                done();
            });
        });

        it('calls success callback function when the file successfuly loaded', function(done){
            var spy = sinon.spy();
            core.load('../../../images/chara0.png', spy);
            setTimeout(function(){
                expect(spy.called).to.be.true;
                expect(enchant.Core.instance.assets['../../../images/chara0.png'], 'confirm load file succeeded').to.be.an.instanceof(enchant.Surface);
                done();
            }, 100);
        });

        it('calls given error callback function when failed to load the file with 4 arguments', function(done){
            var spyCallback = sinon.spy(),
                spyError = sinon.spy(),
                spyErrorDeferred = sinon.spy();
            var anAsset = 'fail.png';
            core.load(anAsset, '', spyCallback, spyError).error(spyErrorDeferred);
            setTimeout(function(){
                expect(spyCallback.called).to.be.false;
                expect(spyError.called).to.be.true;
                expect(spyErrorDeferred.called).to.be.true;
                done();
            }, 100);
        });

        it('calls given error callback when failed to load the file with 3 arguments', function(done){
            var spyCallback = sinon.spy(),
                spyError = sinon.spy(),
                spyErrorDeferred = sinon.spy();
            core.load('fail.png', spyCallback, spyError).error(spyErrorDeferred);
            setTimeout(function(){
                expect(spyCallback.called).to.be.false;
                expect(spyError.called).to.be.true;
                expect(spyErrorDeferred.called).to.be.true;
                done();
            }, 100);
        });
    });

    describe('#start', function(){
        var core;

        beforeEach(function(){
            core = new Core();
        });

        it('starts the core', function(done){
            sinon.spy(core, '_requestNextFrame');
            expect(core.ready).to.be.false;
            expect(core.running).to.be.false;
            core.start();
            var frameStartAt = core.frame;
            expect(core.ready).to.be.true;
            expect(core.running).to.be.true;
            setTimeout(function(){
                expect(core.frame).to.be.above(frameStartAt);
                expect(core.ready).to.be.true;
                expect(core.running).to.be.true;
                expect(core._requestNextFrame.called).to.be.true;
                core._requestNextFrame.restore();
                done();
            }, 500);
        });

        it('loads an asset which set by #preload function', function(done){
            core.preload('../../../images/chara0.png');
            expect(core.assets['../../../images/chara0.png']).to.not.exist;
            core.addEventListener('load', function(){
                expect(core.assets['../../../images/chara0.png']).to.exist;
                done();
            });
            core.start();
        });

        it('loads some assets which set by #preload function', function(done){
            core.preload(['../../../images/chara0.png', '../../../images/chara1.png']);
            expect(core.assets['../../../images/chara0.png']).to.not.exist;
            expect(core.assets['../../../images/chara1.png']).to.not.exist;
            core.addEventListener('load', function(){
                expect(core.assets['../../../images/chara0.png']).to.exist;
                expect(core.assets['../../../images/chara1.png']).to.exist;
                done();
            });
            core.start();
        });

        it('shows "loading" scene on loading assets', function(done){
            sinon.spy(core, '_requestPreload');
            var spy = sinon.spy(),
                spy2 = sinon.spy();
            core.loadingScene.addEventListener('load', spy);
            core.loadingScene.addEventListener('progress', spy2);
            core.preload(['../../../images/chara0.png', '../../../images/chara1.png']);
            core.addEventListener('load', function(){
                expect(core._requestPreload.called).to.be.true;
                expect(spy.called).to.be.true;
                expect(spy2.called).to.be.true;
                core._requestPreload.restore();
                done();
            });
            core.start();
        });
    });

    describe('#debug', function(){
        it('runs with debug flag', function(){
            var core = new Core();
            sinon.spy(core, 'start');
            expect(core._debug).to.be.undefined;
            expect(core.start.called).to.be.false;
            core.debug();
            expect(core._debug).to.be.true;
            expect(core.start.calledOnce).to.be.true;
            core.start.restore();
        });
    });

    describe('actualFps', function(){
        it('exists', function(){
            var core = new Core();
            expect(core.actualFps, 'this test just confirms the existence of property').to.exist;
        });
    });

    describe('#stop', function(){
        var core;

        beforeEach(function(){
            core = new Core();
        });

        it('stops the frame updating', function(done){
            expect(core.ready).to.be.false;
            core.start();
            expect(core.ready).to.be.true;
            var frameAtStart = core.frame;
            setTimeout(function(){
                core.stop();
                expect(core.ready).to.be.false;
                setTimeout(function(){
                    var frameAtStop = core.frame;
                    expect(frameAtStop).to.be.above(frameAtStart);
                    setTimeout(function(){
                        expect(frameAtStop).to.equal(core.frame);
                        done();
                    }, 100);
                }, 100); 
            }, 100);
        });

        it('stops running', function(){
            expect(core.running).to.be.false;
            core.start();
            expect(core.running).to.be.true;
            core.stop();
            expect(core.running).to.be.false;
        });
    });

    describe('#pause', function(){
        var core;

        beforeEach(function(){
            core = new Core();
        });

        it('stops the frame updating', function(done){
            expect(core.ready).to.be.false;
            core.start();
            expect(core.ready).to.be.true;
            var frameAtStart = core.frame;
            setTimeout(function(){
                core.pause();
                expect(core.ready).to.be.false;
                setTimeout(function(){
                    var frameAtStop = core.frame;
                    expect(frameAtStop).to.be.above(frameAtStart);
                    setTimeout(function(){
                        expect(frameAtStop).to.equal(core.frame);
                        expect(core.ready).to.be.false;
                        done();
                    }, 100);
                }, 100);
            }, 100);
        });

        it('does not stop running', function(){
            expect(core.running).to.be.false;
            core.start();
            expect(core.running).to.be.true;
            core.pause();
            expect(core.running).to.be.true;
        });
    });

    describe('#resume', function(){
        it('resumes core operation', function(done){
            var core = new Core();
            expect(core.ready).to.be.false;
            core.start();
            expect(core.ready).to.be.true;
            var frameAtStart = core.frame;
            setTimeout(function(){
                core.pause();
                expect(core.ready).to.be.false;
                setTimeout(function(){
                    var frameAtStop = core.frame;
                    setTimeout(function(){
                        expect(frameAtStop).to.equal(core.frame);
                        expect(core.ready).to.be.false;
                        core.resume();
                        setTimeout(function(){
                            var frameAtResume = core.frame;
                            expect(frameAtResume).to.be.above(frameAtStop);
                            expect(frameAtResume).to.be.above(frameAtStart);
                            expect(core.ready).to.be.true;
                            done();
                        }, 100);
                    }, 100);
                }, 100);
            }, 100);
        });
    });

    describe('#pushScene', function(){
        var core;

        beforeEach(function(){
            core = new Core();
        });

        it('adds given scene to top of scene stack', function(){
            expect(core._scenes[0]).to.deep.equal(core.rootScene);
            var scene1 = new Scene();
            core.pushScene(scene1);
            expect(core._scenes).to.have.length(2);
            expect(core._scenes[1]).to.deep.equal(scene1);
        });

        it('changes currentScene to new scene', function(){
            expect(core.currentScene).to.deep.equal(core.rootScene);
            var scene1 = new Scene();
            core.pushScene(scene1);
            expect(core.currentScene).to.not.deep.equal(core.rootScene);
            expect(core.currentScene).to.deep.equal(scene1);
        });

        it('dispatches exit event from old scene', function(){
            var scene1 = new Scene(),
                scene2 = new Scene();
            var spy = sinon.spy();
            scene1.addEventListener('exit', spy);
            core.pushScene(scene1);
            expect(spy.called).to.be.false;
            core.pushScene(scene2);
            expect(spy.called).to.be.true;
        });

        it('dispatches enter event from new scene', function(){
            var scene1 = new Scene();
            var spy = sinon.spy();
            scene1.addEventListener('enter', spy);
            expect(spy.called).to.be.false;
            core.pushScene(scene1);
            expect(spy.called).to.be.true;
        });

        it('adds new Scene\'s element to core._element', function(){
            var scene1 = new Scene();
            var stage = document.getElementById('enchant-stage');
            expect(stage.children).to.have.length(1);
            expect(stage.firstChild).to.equal(core._element.firstChild);
            core.pushScene(scene1);
            expect(stage.children).to.have.length(2);
            expect(stage.lastChild).to.equal(core._element.lastChild);
            expect(core._element.lastChild).to.equal(scene1._element);
        });

        it('returns new scene stack\'s length', function(){
            var scene1 = new Scene(),
                scene2 = new Scene();
            expect(core._scenes).to.have.length(1);
            var ret = core.pushScene(scene1);
            expect(ret).to.equal(2);
            ret = core.pushScene(scene2);
            expect(ret).to.equal(3);
        });
    });

    describe('#popScene', function(){
        var core, scene1, scene2;

        beforeEach(function(){
            core = new Core();
            scene1 = new Scene();
            scene2 = new Scene();
            core.pushScene(scene1);
            core.pushScene(scene2);
        });

        it('returns poped scene', function(){
            var ret = core.popScene();
            expect(ret).to.deep.equal(scene2);
            ret = core.popScene();
            expect(ret).to.deep.equal(scene1);
        });

        it('returns rootScene when no scenes in stack without rootScene', function(){
            core = new Core();
            expect(core.popScene()).to.deep.equal(core.rootScene);
        });

        it('removes popped scene\'s HTMLElement from core._element', function(){
            var stage = document.getElementById('enchant-stage');
            expect(stage.children).to.have.length(3);
            var ret = core.popScene();
            expect(stage.children).to.have.length(2);
            expect(ret._element).to.deep.equal(scene2._element);
            expect(stage.lastChild).to.not.deep.equal(scene2._element);
            expect(stage.lastChild).to.deep.equal(scene1._element);
        });

        it('dispatches exit event from popped scene', function(){
            var spy = sinon.spy();
            scene2.addEventListener('exit', spy);
            expect(spy.called).to.be.false;
            core.popScene();
            expect(spy.called).to.be.true;
        });

        it('changes currentScene', function(){
            expect(core.currentScene).to.deep.equal(scene2);
            core.popScene();
            expect(core.currentScene).to.not.deep.equal(scene2);
            expect(core.currentScene).to.deep.equal(scene1);
        });

        it('dispatches enter event from new currentScene', function(){
            var spy1 = sinon.spy(),
                spy2 = sinon.spy();
            scene1.addEventListener('enter', spy1);
            core.rootScene.addEventListener('enter', spy2);
            expect(spy1.called).to.be.false;
            expect(spy2.called).to.be.false;
            core.popScene();
            expect(spy1.called).to.be.true;
            expect(spy2.called).to.be.false;
        });
    });

    describe('#replaceScene', function(){
        var core, scene1, scene2;

        beforeEach(function(){
            core = new Core();
            scene1 = new Scene();
            scene2 = new Scene();
            core.pushScene(scene1);
        });

        it('replaces currentScene to given scene', function(){
            expect(core._scenes).to.have.length(2);
            expect(core.currentScene).to.deep.equal(scene1);
            core.replaceScene(scene2);
            expect(core._scenes).to.have.length(2);
            expect(core.currentScene).to.deep.equal(scene2);
        });

        it('returns scene stack length', function(){
            expect(core._scenes).to.have.length(2);
            var ret = core.replaceScene(scene2);
            expect(core._scenes).to.have.length(2);
            expect(ret).to.equal(2);
        });
    });

    describe('#removeScene', function(){
        var core, scene1, scene2;

        beforeEach(function(){
            core = new Core();
            scene1 = new Scene();
            scene2 = new Scene();
            core.pushScene(scene1);
            core.pushScene(scene2);
        });

        it('removes scene from scene stack', function(){
            expect(core._scenes).to.have.length(3);
            expect(core._scenes).to.include(scene1);
            core.removeScene(scene1);
            expect(core._scenes).to.have.length(2);
            expect(core._scenes).to.not.include(scene1);
        });

        it('removes scene from scne stack and change currentScene if the given scene is currentScene', function(){
            expect(core.currentScene).to.deep.equal(scene2);
            core.removeScene(scene2);
            expect(core.currentScene).to.not.deep.equal(scene2);
            expect(core.currentScene).to.deep.equal(scene1);
        });

        it('returns deleted scene', function(){
            var ret = core.removeScene(scene1);
            expect(ret).to.deep.equal(scene1);
        });

        it('returns null if the given scene does not exists on scene stack', function(){
            var scene3 = new Scene();
            var ret = core.removeScene(scene3);
            expect(ret).to.be.null;
        });

        it('removes removed scene\'s HTMLElement from core._element', function(){
            var stage = document.getElementById('enchant-stage');
            expect(stage.children[1]).to.equal(scene1._element);
            core.removeScene(scene1);
            for(var i = 0, l = stage.children.length; i < l; i++) {
                expect(stage.children[i]).to.not.equal(scene1._element);
            }
        });
    });

    describe('#keybind', function(){
        var core;

        beforeEach(function(){
            core = new Core();
            sinon.spy(core, '_buttonListener'); // spys exist method
        });

        afterEach(function(){
            core._buttonListener.restore();
        });

        it.skip('binds keycode to an enchant.js button', function(){
            // initKeyboardEvent is deprecated so this test will fail.
            var spyKeydown = sinon.spy(),
                spyKeyup = sinon.spy();
            core.addEventListener('leftbuttondown', spyKeydown);
            core.addEventListener('leftbuttonup', spyKeyup);
            document.dispatchEvent(makeKeydownEvent(65));
            expect(spyKeydown.called).to.be.false;
            document.dispatchEvent(makeKeyupEvent(65));
            expect(spyKeyup.called).to.be.false;
            core.keybind(65, 'left');
            document.dispatchEvent(makeKeydownEvent(65));
            expect(spyKeydown.called).to.be.true;
            document.dispatchEvent(makeKeyupEvent(65));
            expect(spyKeyup.called).to.be.true;

        });

        it('sets event listener for keydown to Core correspond to binded enchant.js button', function(){
            core.keybind(65, 'left'); // keyboard "a"
            core.dispatchEvent(new enchant.Event('leftbuttondown'));
            expect(core._buttonListener.getCall(0).args[0].type).to.equal('leftbuttondown');
            expect(core._buttonListener.callCount).to.equal(1);
            core.dispatchEvent(new enchant.Event('rightbuttondown'));
            expect(core._buttonListener.callCount).to.equal(1);
        });

        it('sets event listener for keyup to Core coresspond to binded enchant.js button', function(){
            core.keybind(65, 'left');
            core.dispatchEvent(new enchant.Event('leftbuttonup'));
            expect(core._buttonListener.getCall(0).args[0].type).to.equal('leftbuttonup');
            expect(core._buttonListener.callCount).to.equal(1);
            core.dispatchEvent(new enchant.Event('rightbuttonup'));
            expect(core._buttonListener.callCount).to.equal(1);
        });

        it('dispatches buttondown event from currentScene', function(){
            var spy = sinon.spy();
            var scene = new Scene();
            scene.addEventListener('leftbuttondown', spy);
            core.pushScene(scene);
            core.keybind(65, 'left');
            expect(spy.called).to.be.false;
            core.dispatchEvent(new enchant.Event('leftbuttondown'));
            expect(spy.called).to.be.true;
        });

        it('dispathches buttonup event from currentScene', function(){
            var spy = sinon.spy();
            var scene = new Scene();
            scene.addEventListener('leftbuttonup', spy);
            core.pushScene(scene);
            core.keybind(65, 'left');
            expect(spy.called).to.be.false;
            core.dispatchEvent(new enchant.Event('leftbuttonup'));
            expect(spy.called).to.be.true;
        });
    });

    describe('#keyunbind', function(){
        var core;

        beforeEach(function(){
            core = new Core();
            sinon.spy(core, '_buttonListener'); // spys exist method
        });

        it('deletes the key binding for the given key');

        it('does not dispatch event after this event called', function(){
            var scene = new Scene();
            var spyKeydown = sinon.spy(),
                spyKeyup = sinon.spy();
            scene.addEventListener('leftbuttondown', spyKeydown);
            scene.addEventListener('leftbuttonup', spyKeyup);
            core.pushScene(scene);
            core.keybind(65, 'left');
            expect(spyKeydown.called).to.be.false;
            core.dispatchEvent(new enchant.Event('leftbuttondown'));
            expect(core._buttonListener.callCount).to.equal(1);
            expect(spyKeydown.called).to.be.true;
            expect(spyKeydown.callCount, 'scene captures event from core and itself').to.equal(2);
            expect(spyKeyup.called).to.be.false;
            core.dispatchEvent(new enchant.Event('leftbuttonup'));
            expect(spyKeyup.called).to.be.true;
            expect(spyKeyup.callCount, 'scene captures event from core and itself').to.equal(2);
            expect(core._buttonListener.callCount).to.equal(2);
            core.keyunbind(65);
            core.dispatchEvent(new enchant.Event('leftbuttondown'));
            expect(spyKeydown.callCount, 'scene captures event only from itself').to.equal(3);
            expect(core._buttonListener.callCount).to.equal(2);
            core.dispatchEvent(new enchant.Event('leftbuttonup'));
            expect(spyKeyup.callCount, 'scene captures event only from itself').to.equal(3);
            expect(core._buttonListener.callCount).to.equal(2);
        });

    });

    describe('#changeButtonState', function(){
        it('changes button state', function(){
            // This test just confirm existence of Core#changeButtonState
            // Actual test is done on KeyboardInputManager test
            var core = new Core();
            expect(core.changeButtonState).to.exist;
        });
    });

    describe('#getElapsedTime', function(){
        it('returns the core time elapsed since Core#start was called', function(done){
            var core = new Core();
            core.start();
            core.addEventListener('load', function(){
                setTimeout(function(){
                    var stoppedTime = core.getElapsedTime();
                    var endFrame = core.frame;
                    var expectedTime = endFrame / 30;
                    expect(stoppedTime).to.equal(expectedTime);
                    done();
                }, 1000);
            });

        });
    });

    describe('enchant.Core.findExt', function(){
        it('returns file extention from given path', function(){
            expect(enchant.Core.findExt('/path/to/something/test.png')).to.equal('png');
            expect(enchant.Core.findExt('test.png')).to.equal('png');
            expect(enchant.Core.findExt('test.gif')).to.equal('gif');
            expect(enchant.Core.findExt('test.wav')).to.equal('wav');
            expect(enchant.Core.findExt('test.php')).to.equal('php');
        });
    });

});

