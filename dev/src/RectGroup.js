/**
 * @scope enchant.CacheRectGroup.prototype
 */
enchant.RectGroup = enchant.Class.create(enchant.Entity, {
    /**
     * @name enchant.CacheRectGroup
     * @class
     [lang:ja]
     * 子を持つことができるEntity.
     * GroupでなくEntityのサブクラス.
     * @param {Number} width RectGroupの横幅.
     * @param {Number} height RectGroupの縦幅.
     [/lang]
     [lang:en]
     * Entity that can has children.
     * It is subclass of Group but not subclass of Entity.
     * @param {Number} width RectGroup width.
     * @param {Number} height RectGroup height.
     [/lang]
     * @constructs
     * @extends enchant.Entity
     * @borrows enchant.Group#addChild as enchant.Entity#addChild
     * @borrows enchant.Group#insertBefore as enchant.Entity#insertBefore
     * @borrows enchant.Group#removeChild as enchant.Entity#removeChild
     */
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
