enchant.CanvasRenderer = enchant.Class.create({
    render: function(ctx, node, e) {
        var width, height, child;
        ctx.save();
        node.dispatchEvent(e);
        // transform
        this.transform(ctx, node);
        if (typeof node._visible === 'undefined' || node._visible) {
            width = node.width;
            height = node.height;
            // composite
            if (node.compositeOperation) {
                ctx.globalCompositeOperation = node.compositeOperation;
            }
            ctx.globalAlpha = (typeof node._opacity === 'number') ? node._opacity : 1.0;
            // render
            if (node._backgroundColor) {
                ctx.fillStyle = node._backgroundColor;
                ctx.fillRect(0, 0, width, height);
            }

            if (node.cvsRender) {
                node.cvsRender(ctx);
            }

            if (enchant.Core.instance._debug && node._debugColor) {
                ctx.strokeStyle = node._debugColor;
                ctx.strokeRect(0, 0, width, height);
            }
            if (node._clipping) {
                ctx.beginPath();
                ctx.rect(0, 0, width, height);
                ctx.clip();
            }
            if (node.childNodes) {
                for (var i = 0, l = node.childNodes.length; i < l; i++) {
                    child = node.childNodes[i];
                    this.render(ctx, child, e);
                }
            }
        }
        ctx.restore();
        enchant.Matrix.instance.stack.pop();
    },
    detectRender: function(ctx, node) {
        var width, height, child;
        if (typeof node._visible === 'undefined' || node._visible) {
            width = node.width;
            height = node.height;
            ctx.save();
            this.transform(ctx, node);
            ctx.fillStyle = node._cvsCache.detectColor;
            if (node._touchEnabled) {
                if (node.detectRender) {
                    node.detectRender(ctx);
                } else {
                    ctx.fillRect(0, 0, width, height);
                }
            }
            if (node._clipping) {
                ctx.beginPath();
                ctx.rect(0, 0, width, height);
                ctx.clip();
            }
            if (node.childNodes) {
                for (var i = 0, l = node.childNodes.length; i < l; i++) {
                    child = node.childNodes[i];
                    this.detectRender(ctx, child);
                }
            }
            ctx.restore();
            enchant.Matrix.instance.stack.pop();
        }
    },
    transform: function(ctx, node) {
        var matrix = enchant.Matrix.instance;
        var stack = matrix.stack;
        var newmat, ox, oy, vec;
        if (node._dirty) {
            matrix.makeTransformMatrix(node, node._cvsCache.matrix);
            newmat = [];
            matrix.multiply(stack[stack.length - 1], node._cvsCache.matrix, newmat);
            node._matrix = newmat;
            ox = (typeof node._originX === 'number') ? node._originX : node._width / 2 || 0;
            oy = (typeof node._originY === 'number') ? node._originY : node._height / 2 || 0;
            vec = [ ox, oy ];
            matrix.multiplyVec(newmat, vec, vec);
            node._offsetX = vec[0] - ox;
            node._offsetY = vec[1] - oy;
            node._dirty = false;
        } else {
            newmat = node._matrix;
        }
        stack.push(newmat);
        ctx.setTransform.apply(ctx, newmat);
    }
});
enchant.CanvasRenderer.instance = new enchant.CanvasRenderer();
