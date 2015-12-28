describe("matrix", function(){
    var matrix;

    before(function(){
        enchant();
        matrix = enchant.Matrix.instance;
    });

    it("#makeTransformMatrix makes transform matrix", function(){
        var node = new Node();
        node.x = 1;
        node.y = 1;
        var ans = [];
        matrix.makeTransformMatrix(node, ans);
        expect(ans[0]).to.equal(1);
        expect(ans[1]).to.equal(0);
        expect(ans[2]).to.equal(0);
        expect(ans[3]).to.equal(1);
        expect(ans[4]).to.equal(1);
        expect(ans[5]).to.equal(1);
        node.width = 2;
        node.height = 2;
        matrix.makeTransformMatrix(node, ans);
        expect(ans[0]).to.equal(1);
        expect(ans[1]).to.equal(0);
        expect(ans[2]).to.equal(0);
        expect(ans[3]).to.equal(1);
        expect(ans[4]).to.equal(1);
        expect(ans[5]).to.equal(1);
        node._rotation = 45;
        matrix.makeTransformMatrix(node, ans);
        expect(ans[0]).to.be.within(0.70, 0.71); 
        expect(ans[1]).to.be.within(0.70, 0.71);
        expect(ans[2]).to.be.within(-0.71, -0.70);
        expect(ans[3]).to.be.within(0.70, 0.71);
        expect(ans[4]).to.be.within(1.9, 2.0);
        expect(ans[5]).to.be.within(0.58, 0.59);
        node._scaleX = 2;
        node._scaleY = 2;
        matrix.makeTransformMatrix(node, ans);
        expect(ans[0]).to.be.within(1.41, 1.42);
        expect(ans[1]).to.be.within(1.41, 1.42);
        expect(ans[2]).to.be.within(-1.42, -1.41);
        expect(ans[3]).to.be.within(1.41, 1.42);
        expect(ans[4]).to.be.within(1.9, 2.0);
        expect(ans[5]).to.be.within(-0.83, -0.82);
    });

    it("#multiply multiplies two matrixes", function(){
        var m1 = [1, 2, 3, 4, 5, 6];
        var m2 = [2, 3, 4, 5, 6, 7];
        var ans = [];
        matrix.multiply(m1, m2, ans);
        expect(ans.length).to.equal(6);
        expect(ans[0]).to.equal(11);
        expect(ans[1]).to.equal(16);
        expect(ans[2]).to.equal(19);
        expect(ans[3]).to.equal(28);
        expect(ans[4]).to.equal(32);
        expect(ans[5]).to.equal(46);

    });

    it("#multiplyVec multiplies matrix by vector", function(){
        var m = [1, 2, 3, 4, 5, 6];
        var v = [2, 3];
        var ans = [];
        matrix.multiplyVec(m, v, ans);
        expect(ans[0]).to.equal(16);
        expect(ans[1]).to.equal(22);
    });
});