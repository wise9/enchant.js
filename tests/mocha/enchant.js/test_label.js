describe("Label", function(){
    enchant();
    var core, label;
    var LABEL_DIMENSION_TEST_DELTA = 1;

    beforeEach(function(){
        core = new enchant.Core(320, 320);
    });

    it("#getMetrics returns metrics of label itself", function(){
        label = new Label(".");
        label.font = "10px LiberationMono monospace";
        label.textAlign = "left";
        var metrics = label.getMetrics();
        expect(metrics.height).to.equal(11);
        expect(metrics.width).to.be.closeTo(4, LABEL_DIMENSION_TEST_DELTA);
    });

    it("#updateBoundArea", function(){
        label = new Label(".");
        label.font = "10px LiberationMono monospace";
        label.textAlign = "left";
        label.width = 100;
        expect(label._boundHeight).to.equal(11);        
        expect(label._boundWidth).to.be.closeTo(4, LABEL_DIMENSION_TEST_DELTA);
        expect(label._boundOffset).to.equal(0);       
        label.textAlign = "center";
        expect(label._boundOffset).to.be.closeTo(48, LABEL_DIMENSION_TEST_DELTA);
        label.textAlign = "right";
        expect(label._boundOffset).to.be.closeTo(96, LABEL_DIMENSION_TEST_DELTA);
    });

    describe("settings", function(){
        beforeEach(function(){
            label = new Label();
        });

        it("default text is ''", function(){
            expect(label.text).to.equal('');
            expect(label._text).to.equal('');
        });

        it("default font is '14px serif'", function(){
            expect(label.font).to.equal("14px serif");
            expect(label._style.font).to.equal("14px serif");
        });

        it("default text alignment is left", function(){
            expect(label.textAlign).to.equal("left");
            expect(label._style["text-align"]).to.equal("left");
        });

        it("default width is 300", function(){
            expect(label.width).to.equal(300);
            expect(label._width).to.equal(300);
        });

        it("width can be set", function(){
            expect(label.width).to.equal(300, "default");
            label.width = 100;
            expect(label.width).to.equal(100);
            expect(label._width).to.equal(100);
        });

        it("text can be set", function(){
            expect(label.text).to.equal('');
            label.text = "foo";
            expect(label._text).to.equal('foo');
            expect(label.text).to.equal('foo');
        });

        it("text can use '<br/>' tags", function(){
            label.text = "a<br/>b";
            expect(label.text).to.equal("a<br/>b");
            expect(label._splitText[0].text).to.equal("a");
            expect(label._splitText[1].text).to.equal("b");
            label.text = "a<BR>b";
            expect(label._splitText[0].text).to.equal("a");
            expect(label._splitText[1].text).to.equal("b");
            label.text = "a<br />b";
            expect(label._splitText[0].text).to.equal("a");
            expect(label._splitText[1].text).to.equal("b");
        });

        it("textAlign can be set", function(){
            expect(label.textAlign).to.equal("left");
            label.textAlign = "center";
            expect(label.textAlign).to.equal("center");
            expect(label._style["text-align"]).to.equal("center");
            label.textAlign = "right";
            expect(label.textAlign).to.equal("right");
            expect(label._style["text-align"]).to.equal("right");
            label.textAlign = "left";
            expect(label.textAlign).to.equal("left");
            expect(label._style["text-align"]).to.equal("left");
        });

        it("font can be set", function(){
            expect(label.font).to.equal("14px serif");
            label.font = "14px LiberationMono monospace";
            expect(label.font).to.equal("14px LiberationMono monospace");
            expect(label._style.font).to.equal("14px LiberationMono monospace");
        });

        it("color can be set", function(){
            label.color = "red";
            expect(label.color).to.equal("red");
            expect(label._style.color).to.equal("red");
        });
    });

    describe("render to dom", function(){
        beforeEach(function(){
            label = new Label("foo");
            label.color = "#f00";
        });

        it("renders to DOM", function(){
            var div = document.createElement("div");
            label.domRender(div);
            expect(div.innerHTML).to.equal('foo');
        });
    });

    describe("render to canvas", function(){
       var context;

        beforeEach(function(){
            // dummy label for activate canvas layer
            var dummyLabel = new Label('.');
            dummyLabel.moveTo(320, 320);
            core.rootScene.addChild(dummyLabel);
            context = document.getElementsByTagName('canvas')[0].getContext('2d');
            // using multibyte char in tests causes problem when running on phantomjs
            label = new Label('=');
            label.color = "#f00";
            label.font = '10px LiberationMono monospace';
        });

        describe("text alignment", function(){
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
    });
});
