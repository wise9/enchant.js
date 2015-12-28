describe("Surface", function(){
    var core, surface;

    before(function(){
        enchant();
    });

    beforeEach(function(){
        core = new Core();
        surface = new Surface(320, 320);
    });

    it("provides canvas context", function(){
        expect(surface.context.canvas.tagName).to.equal("CANVAS");
    });

    it("has width and height", function(){
        expect(surface.width).to.equal(320);
        expect(surface.height).to.equal(320);
    });

    it("#setPixel sets 1px within surface", function(){
        surface.setPixel(0, 0, 255, 255, 255, 1);
        var pixel = surface.context.getImageData(0, 0, 1, 1).data;
        expect(pixel[0]).to.equal(255);
        expect(pixel[1]).to.equal(255);
        expect(pixel[2]).to.equal(255);
        expect(pixel[3]).to.equal(1);
    });

    it("#getPixel gets 1px from surface", function(){
        surface.setPixel(0, 0, 255, 255, 255, 1);
        var pixel = surface.getPixel(0, 0);
        expect(pixel[0]).to.equal(255);
        expect(pixel[1]).to.equal(255);
        expect(pixel[2]).to.equal(255);
        expect(pixel[3]).to.equal(1);
    });

    it("#clear clears all surface pixels and make the pixels transparent", function(){
        surface.context.fillStyle = "#fff";
        surface.context.fillRect(0, 0, 320, 320);
        var pixel1 = surface.getPixel(0, 0);
        expect(pixel1[0]).to.equal(255);
        expect(pixel1[1]).to.equal(255);
        expect(pixel1[2]).to.equal(255);
        expect(pixel1[3]).to.equal(255);

        var pixel2 = surface.getPixel(100, 100);
        expect(pixel2[0]).to.equal(255);
        expect(pixel2[1]).to.equal(255);
        expect(pixel2[2]).to.equal(255);
        expect(pixel2[3]).to.equal(255);
        surface.clear();
        
        pixel1 = surface.getPixel(0, 0);
        expect(pixel1[0]).to.equal(0);
        expect(pixel1[1]).to.equal(0);
        expect(pixel1[2]).to.equal(0);
        expect(pixel1[3]).to.equal(0);

        pixel2 = surface.getPixel(100, 100);
        expect(pixel2[0]).to.equal(0);
        expect(pixel2[1]).to.equal(0);
        expect(pixel2[2]).to.equal(0);
        expect(pixel2[3]).to.equal(0);
    });

    it("#draw draws given surface on this surface", function(){
        var anotherSurface = new Surface(10, 10);
        anotherSurface.context.beginPath();
        anotherSurface.context.fillStyle = 'rgba(255, 0, 0, 1)';
        anotherSurface.context.fillRect(0, 0, 10, 10);
        surface.draw(anotherSurface);
        var pixel = surface.getPixel(0, 0);
        expect(pixel[0]).to.equal(255); // R
        expect(pixel[1]).to.equal(0);   // G
        expect(pixel[2]).to.equal(0);   // B
        expect(pixel[3]).to.equal(255); // alpha, it's bounds are 0 to 255
        pixel = surface.getPixel(9, 9);
        expect(pixel[0]).to.equal(255); // R
        expect(pixel[1]).to.equal(0);   // G
        expect(pixel[2]).to.equal(0);   // B
        expect(pixel[3]).to.equal(255); // alpha, it's bounds are 0 to 255
        pixel = surface.getPixel(10, 10);
        expect(pixel[0]).to.equal(0); // R
        expect(pixel[1]).to.equal(0); // G
        expect(pixel[2]).to.equal(0); // B
        expect(pixel[3]).to.equal(0); // alpha, it's bounds are 0 to 255

    });

    it("#clone copies surface", function(){
        surface.setPixel(0, 0, 255, 255, 255, 1);
        var anotherSurface = surface.clone();
        var pixel = surface.getPixel(0, 0);
        var anotherPixel = anotherSurface.getPixel(0, 0);
        expect(anotherPixel).to.deep.equal(pixel);
        pixel = surface.getPixel(320, 320);
        anotherPixel = anotherSurface.getPixel(320, 320);
        expect(anotherPixel).to.deep.equal(pixel);
    });

    it("#toDataURL creates a data URI scheme", function(){
        var canvas = surface.context.canvas;
        expect(canvas.toDataURL()).to.equal(surface.toDataURL());
    });

    describe("enchant.Surface.load", function(){
        it("loads image file and makes surface", function(){
            var errorCallback = sinon.spy(),
                callback = sinon.spy();
            expect(callback.called).to.be.false;
            expect(errorCallback.called).to.be.false;
            var imageSurface = enchant.Surface.load("./start.png", callback, errorCallback);
            expect(imageSurface instanceof Surface).to.be.true;
            expect(imageSurface._element.tagName).to.equal("IMG");
            expect(imageSurface._element["src"]).to.match(/mocha\/enchant.js\/start.png$/);
            expect(imageSurface._css).to.equal("url(./start.png)");
            expect(imageSurface.context).to.be.null;
            imageSurface.dispatchEvent(new enchant.Event("load"));
            expect(callback.callCount).to.equal(1);
            imageSurface.dispatchEvent(new enchant.Event("error"));
            expect(errorCallback.callCount).to.equal(1);
            callback = sinon.spy();
            imageSurface.addEventListener(enchant.Event.LOAD, callback);
            expect(callback.called).to.be.false;
            imageSurface._element.onload();
            expect(callback.callCount).to.equal(1);
            expect(imageSurface.width).to.equal(0);
            expect(imageSurface.height).to.equal(0);
        });
    });
});
