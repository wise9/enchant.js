enchant();

window.onload = function(){
    var core = new Core();
    core.start();
    mocha.run();
};

describe("enchant.ui.MutableText", function(done){
    describe("with 1 character", function(){
        it("default size should be 16px * 16px", function(){
            var m = new MutableText(0, 0);
            m.text = '1';
            expect(m.width).to.equal(16);
            expect(m.height).to.equal(16);
            expect(m.text).to.equal('1');
        });
    });

    describe("with 5 characters", function(){
        it("width should equal to 'fontsize * length'", function(){
            var m = new MutableText(0, 0);
            m.text = '12345';
            expect(m.width).to.equal(16 * 5);
        });

        it("height should equal to fontsize", function(){
            var m = new MutableText(0, 0);
            m.text = '12345';
            expect(m.height).to.equal(16);
        });

        it("characters should be same as set to MutableText.text", function(){
            var m = new MutableText(0, 0);
            m.text = '12345';
            expect(m.text).to.equal('12345');
        });

        it("width should equal to 'fontsize * row' when row is less than or equal 5", function(){
            var m = new MutableText(0, 0);
            m.text = '12345';
            for(var i = 1; i <= 5; i++) {
                m.row = i;
                expect(m.width).to.equal(16 * i);
            }
        });

        it("height should equal to 'fontsize * Math.ceil(length / row)' when row is less than or equal 5", function(){
            var m = new MutableText(0, 0);
            m.text = '12345';
            for(var i = 1; i <= 5; i++) {
                m.row = i;
                expect(m.height).to.equal(16 * Math.ceil(5 / i));
            }
        });

        it("width should equal to 'fontsize * row' when 5 <= row <= 20", function(){
            var m = new MutableText(0, 0);
            m.text = '12345';
            for(var i = 5; i <= 20; i++) {
                m.row = i;
                expect(m.width).to.equal(16 * i);
            }
        });

        it("height should equal to 'fontsize' when 5 <= row <= 20", function(){
            var m = new MutableText(0, 0);
            m.text = '12345';
            for(var i = 5; i <= 20; i++) {
                m.row = i;
                expect(m.height).to.equal(16);
            }
        });

        it("width should equal to 'core.width' when row is over 21", function(){
            var m = new MutableText(0, 0);
            m.text = '12345';
            m.row = 21;
            expect(m.width).to.equal(16 * 20);
        });

        it("height should equal to 'fontsize' when row is over 21", function(){
            var m = new MutableText(0, 0);
            m.text = '12345';
            m.row = 21; 
            expect(m.height).to.equal(16);
        });
    });
});