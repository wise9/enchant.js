enchant.RectGroup = enchant.Class.create(enchant.Entity, {
    initialize: function(width, height) {
        this.childNodes = [];
        enchant.Entity.call(this);
        this.width = width;
        this.height = height;

        [ enchant.Event.ADDED_TO_SCENE, enchant.Event.REMOVED_FROM_SCENE ]
            .forEach(function(event) {
                this.addEventListener(event, function(e) {
                    this.childNodes.slice().forEach(function(child) {
                        child.scene = this.scene;
                        child.dispatchEvent(e);
                    }, this);
                });
            }, this);
    },
    addChild: enchant.Group.prototype.addChild,
    insertBefore: enchant.Group.prototype.insertBefore,
    removeChild: enchant.Group.prototype.removeChild,
    firstChild: Object.getOwnPropertyDescriptor(enchant.Group.prototype, 'firstChild'),
    lastChild: Object.getOwnPropertyDescriptor(enchant.Group.prototype, 'lastChild'),
    _dirty: Object.getOwnPropertyDescriptor(enchant.Group.prototype, '_dirty')
});
