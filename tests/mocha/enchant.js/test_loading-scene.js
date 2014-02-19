describe("LoadingScene", function(){
    var core, loadingScene, expectedBar;

    before(function(){
        enchant();
    });

    beforeEach(function(){
        core = new Core();
        loadingScene = new LoadingScene();
        expectedBar = document.createElement("canvas");
        expectedBar.width = 128;
        expectedBar.height = 16;
        var border = 3;
        var ctx = expectedBar.getContext("2d");
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, 128, 16);
        ctx.fillStyle = "#000";
        ctx.fillRect(border, border, 122, 10);
    });

    afterEach(function(){
        loadingScene = null;
    });

    var extendsExpectedBar = (function(progress) {
        var _progress = 0;
        return function(){
            _progress *= 0.9;
            _progress += progress*0.1;
            var ctx = expectedBar.getContext("2d");
            ctx.fillStyle = "#fff";
            ctx.fillRect(3, 0, 122 * _progress, 10);
        };
    }());

    it("has indication bar", function(){
        var bar = loadingScene.childNodes[0];
        expect(bar.width).to.equal(128);
        expect(bar.height).to.equal(16);
        expect(bar.x).to.equal(96);
        expect(bar.y).to.equal(152);
        expect(bar.image.context.getImageData(0, 0, 128, 16).data)
            .to.deep.equal(expectedBar.getContext("2d").getImageData(0, 0, 128, 16).data);
    });

    it("indictor extends by the rat of progresson of loading", function(){
        for(var i = 1; i <= 10; i++) {
            var e = new enchant.Event("progress");
            e.loaded = i;
            e.total = 10;
            progress = e.loaded / e.total * 1.0;
            loadingScene.dispatchEvent(e);
            loadingScene.dispatchEvent(new enchant.Event("enterframe"));
            extendsExpectedBar(progress);
            expect(loadingScene.childNodes[0].image.context.getImageData(0, 0, 128, 16).data)
                .to.deep.equal(expectedBar.getContext("2d").getImageData(0, 0, 128, 16).data);
        }
    });

    it("removes itself from core when load event occurred", function(){
        core = enchant.Core.instance;
        loadingScene = core.loadingScene;
        core.pushScene(loadingScene);
        expect(core._scenes.indexOf(loadingScene)).to.not.equal(-1);
        core.loadingScene.dispatchEvent(new enchant.Event("load"));
        expect(core._scenes.indexOf(loadingScene)).to.equal(-1);
    });
});