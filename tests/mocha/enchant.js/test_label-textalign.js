describe("Label.textAlign", function(){
    var context, core, label;

    beforeEach(function(){
        enchant();
        core = new enchant.Core(320, 320);
        // dummy label for activate canvas layer
        var dummyLabel = new Label('.');
        dummyLabel.moveTo(320, 320);
        core.rootScene.addChild(dummyLabel);
        context = document.getElementsByTagName('canvas')[0].getContext('2d');
        // using multibyte char in tests causes problem when running on phantomjs
        label = new Label('=');
        label.color = "#f00";
        label.font = '10px mono monospace';
    });

    var verifyTextAt = function(textAlign){
        var x = 4, image;
        if(textAlign === 'center') {
            x = label.width / 2;
        } else if (textAlign === 'right') {
            x = label.width - 5;
        }
        // this code is trying to avoid problem about difference of font
        var max = 0;
        for (var y = 0; y < 10; y++) {
            image = context.getImageData(x, y, 1, 1).data;
            max = Math.max(image[0], max);
        }
        return max > 128;
    };

    it("should not be ok with no alignment setting", function(){
        expect(verifyTextAt('left')).to.not.be.ok;
        expect(verifyTextAt('center')).to.not.be.ok;
        expect(verifyTextAt('right')).to.not.be.ok;
    });

    it("should align left", function(){
        label.textAlign = "left";
        core.rootScene.addChild(label);
        expect(verifyTextAt('left')).to.be.ok;
        expect(verifyTextAt('center')).to.not.be.ok;
        expect(verifyTextAt('right')).to.not.be.ok;
    });

    it("should align center", function(){
        label.textAlign = "center";
        core.rootScene.addChild(label);
        expect(verifyTextAt('left')).to.not.be.ok;
        expect(verifyTextAt('center')).to.be.ok;
        expect(verifyTextAt('right')).to.not.be.ok;
    });

    it("should align right", function(){
        label.textAlign = "right";
        core.rootScene.addChild(label);
        expect(verifyTextAt('left')).to.not.be.ok;
        expect(verifyTextAt('center')).to.not.be.ok;
        expect(verifyTextAt('right')).to.be.ok;
    });

    it("should align left as default", function(){
        core.rootScene.addChild(label);
        expect(verifyTextAt('left')).to.be.ok;
        expect(verifyTextAt('center')).to.not.be.ok;
        expect(verifyTextAt('right')).to.not.be.ok;
    });
});
