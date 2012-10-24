enchant.CanvasView = enchant.Class.create(enchant.EventTarget, {
    initialize: function(width, height, contextType) {
        enchant.EventTarget.call(this, width, height);
        this.width = width;
        this.height = height;

        this.element = document.createElement('canvas');
        this.element.width = this.width;
        this.element.height = this.height;
        contextType = contextType || '2d';
        this.context = this.element.getContext(contextType);
    }
});

enchant.DomView = enchant.Class.create(enchant.EventTarget, {
    initialize: function(width, height) {
        enchant.EventTarget.call(this);
        this.width = width;
        this.height = height;

        this.element = document.createElement('div');
        this.element.style.width = this.width + 'px';
        this.element.style.height = this.height + 'px';
    }
});
