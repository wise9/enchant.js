enchant.CacheRectGroup = enchant.Class.create(enchant.RectGroup, {
    initialize: function(width, height) {
        var sf = this.surface = new enchant.Surface(width, height);
        enchant.RectGroup.call(this, width, height);
        this.__visible = true;
        this.enableCacheDraw();
    },
    enableCacheDraw: function() {
        if (this._enableCacheDraw) {
            return;
        }
        this.surface = new enchant.Surface(this.width, this.height);
        this.addEventListener(enchant.Event.RENDER, this._onrender);
        enchant.CacheRectGroup.REDRAW_CACHE_TRIGGER_EVENTS.forEach(function(type) {
            this.addEventListener(type, this._setNeedDraw);
        }, this);
        this._visible = false;
        this._enableCacheDraw = true;
        this._needRedraw = true;
    },
    disableCacheDraw: function() {
        if (!this._enableCacheDraw) {
            return;
        }
        delete this.surface;
        this.removeEventListener(enchant.Event.RENDER, this._onrender);
        enchant.CacheRectGroup.REDRAW_CACHE_TRIGGER_EVENTS.forEach(function(type) {
            this.removeEventListener(type, this._setNeedDraw);
        }, this);
        this._visible = true;
        this._enableCacheDraw = false;
    },
    visible: {
        get: function() {
            return this.__visible;
        },
        set: function(visible) {
            this.__visible = visible;
        }
    },
    width: {
        get: function() {
            return this._width;
        },
        set: function(width) {
            this._width = width;
            this._dirty = true;
            this._needRedraw = true;
            if (this._enableCacheDraw) {
                this.surface.width = width;
            }
        }
    },
    height: {
        get: function() {
            return this._height;
        },
        set: function(height) {
            this._height = height;
            this._dirty = true;
            this._needRedraw = true;
            if (this._enableCacheDraw) {
                this.surface.height = height;
            }
        }
    },
    _setNeedDraw: function() {
        this._needRedraw = true;
    },
    _checkChildDirty: function() {
        if (this._needRedraw) {
            this._needRedraw = false;
            return true;
        }
        var nodes = this.childNodes.slice();
        var node;
        while (nodes.length) {
            node = nodes.shift();
            if (node._dirty) {
                return true;
            }
            Array.prototype.push.apply(nodes, (node.childNodes || []));
        }
        return false;
    },
    _drawChildren: function() {
        var inv = [];
        var renderer = enchant.CacheRectGroup.renderer;
        var ctx = this.surface.context;
        enchant.Matrix.instance.inverse(this._matrix, inv);
        renderer.invMat = inv;
        ctx.clearRect(0, 0, this.width, this.height);
        var render = new enchant.Event(enchant.Event.RENDER);
        for (var i = 0, l = this.childNodes.length; i < l; i++) {
            renderer.render(ctx, this.childNodes[i], render);
        }
    },
    _onrender: function(e) {
        var ctx = this._layer.context;
        var w = this._width;
        var h = this._height;
        enchant.CanvasRenderer.instance.transform(ctx, this);
        if (w > 0 && h > 0 && this.__visible) {
            if (this._checkChildDirty()) {
                this._drawChildren();
            }
            ctx.drawImage(this.surface._element, 0, 0, w, h);
        }
        enchant.Matrix.instance.stack.pop();
    }
});
enchant.CacheRectGroup.REDRAW_CACHE_TRIGGER_EVENTS = [
    enchant.Event.ADDED_TO_SCENE,
    enchant.Event.CHILD_ADDED,
    enchant.Event.CHILD_REMOVED
];
enchant.CacheRectGroup.renderer = new (enchant.Class.create(enchant.CanvasRenderer, {
    transform: function(ctx, node) {
        var m = [];
        enchant.CanvasRenderer.prototype.transform.call(this, ctx, node);
        enchant.Matrix.instance.multiply(this.invMat, node._matrix, m);
        enchant.Matrix.instance.stack[enchant.Matrix.instance.stack.length - 1] = m;
        ctx.setTransform.apply(ctx, m);
    }
}))();
