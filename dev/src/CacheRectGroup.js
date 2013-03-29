/**
 * @scope enchant.CacheRectGroup.prototype
 */
enchant.CacheRectGroup = enchant.Class.create(enchant.RectGroup, {
    /**
     * @name enchant.CacheRectGroup
     * @class
     [lang:ja]
     * 子の描画をSurfaceにキャッシュするRectGroup.
     * @param {Number} width RectGroupの横幅.
     * @param {Number} height RectGroupの縦幅.
     * @param {Boolean} [enableCacheDraw=true] キャッシュ描画を有効にする.
     [/lang]
     [lang:en]
     * RectGroup that draw own children to Surface for Cache.
     * @param {Number} width RectGroup width.
     * @param {Number} height RectGroup height.
     * @param {Boolean} [enableCacheDraw=true] Enable cache draw.
     [/lang]
     * @constructs
     * @extends enchant.RectGroup
     */
    initialize: function(width, height, enableCacheDraw) {
        if (typeof enableCacheDraw === 'undefined') {
            enableCacheDraw = true;
        }
        /**
         [lang:ja]
         * キャッシュ用のSurface.
         [/lang]
         [lang:en]
         * The surface for cache draw.
         [/lang]
         * {@type enchant.Surface}
         */
        this.surface = new enchant.Surface(width, height);
        enchant.RectGroup.call(this, width, height);
        this.__visible = true;
        if (enableCacheDraw) {
            this.enableCacheDraw();
        }
    },
    /**
     [lang:ja]
     * キャッシュ描画を有効にする.
     * {@link enchant.RectGroup#surface}に子を描画し, 子の状態に変化がなければそのSurfaceをSceneに描画して子の描画を呼ばないようになる.
     [/lang]
     [lang:en]
     * enable cache draw.
     * Render own children to {@link enchant.RectGroup#surface}.
     * Rendering itself to scene using the surface and skip rendering the children if there is no change in children status.
     [/lang]
     */
    enableCacheDraw: function() {
        if (this._enableCacheDraw) {
            return;
        }
        this.addEventListener(enchant.Event.RENDER, this._onrender);
        enchant.CacheRectGroup.REDRAW_CACHE_TRIGGER_EVENTS.forEach(function(type) {
            this.addEventListener(type, this._setNeedDraw);
        }, this);
        this._visible = false;
        this._enableCacheDraw = true;
        this._needRedraw = true;
    },
    /**
     [lang:ja]
     * キャッシュ描画を無効にする.
     * 通常の{@link enchant.RectGroup}と同じように描画されるようになる.
     [/lang]
     [lang:en]
     * disable cache draw.
     * Will be rendered same as {@link enchant.RectGroup}.
     [/lang]
     */
    disableCacheDraw: function() {
        if (!this._enableCacheDraw) {
            return;
        }
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
    _hasDirtyChild: function() {
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
    _redraw: function(e) {
        var inv = [];
        var renderer = enchant.CacheRectGroup.renderer;
        var ctx = this.surface.context;
        var width = this.width;
        var height = this.height;

        enchant.Matrix.instance.inverse(this._matrix, inv);
        renderer.invMat = inv;
        ctx.clearRect(0, 0, width, height);

        if (this.compositeOperation) {
            ctx.globalCompositeOperation = this.compositeOperation;
        }
        ctx.globalAlpha = (typeof this._opacity === 'number') ? this._opacity : 1.0;

        if (this._backgroundColor) {
            ctx.fillStyle = this._backgroundColor;
            ctx.fillRect(0, 0, width, height);
        }

        if (this.cvsRender) {
            this.cvsRender(ctx);
        }

        if (enchant.Core.instance._debug && this._debugColor) {
            ctx.strokeStyle = this._debugColor;
            ctx.strokeRect(0, 0, width, height);
        }

        for (var i = 0, l = this.childNodes.length; i < l; i++) {
            renderer.render(ctx, this.childNodes[i], e);
        }
    },
    _onrender: function(e) {
        var ctx = this._layer.context;
        var w = this._width;
        var h = this._height;
        enchant.CanvasRenderer.instance.transform(ctx, this);
        if (w > 0 && h > 0 && this.__visible) {
            if (this._hasDirtyChild()) {
                this._redraw(e);
            }
            ctx.drawImage(this.surface._element, 0, 0, w, h);
        }
        enchant.Matrix.instance.stack.pop();
    }
});
/**
 [lang:ja]
 * キャッシュの更新のトリガーにするEventの名前.
 [/lang]
 * The Event names that triggers cache update.
 * @type {String[]}
 * @static
 */
enchant.CacheRectGroup.REDRAW_CACHE_TRIGGER_EVENTS = [
    enchant.Event.ADDED_TO_SCENE,
    enchant.Event.CHILD_ADDED,
    enchant.Event.CHILD_REMOVED
];
/**
 [lang:ja]
 * CacheRectGroup用のレンダラ.
 [/lang]
 * The customized renderer for CacheRectGroup.
 * @type {String[]}
 * @static
 */
enchant.CacheRectGroup.renderer = new (enchant.Class.create(enchant.CanvasRenderer, {
    transform: function(ctx, node) {
        var m = [];
        enchant.CanvasRenderer.prototype.transform.call(this, ctx, node);
        enchant.Matrix.instance.multiply(this.invMat, node._matrix, m);
        enchant.Matrix.instance.stack[enchant.Matrix.instance.stack.length - 1] = m;
        ctx.setTransform.apply(ctx, m);
    }
}))();
