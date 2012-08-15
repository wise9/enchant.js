/**
 [lang:ja]
 * @scope enchant.EventTarget.prototype
 [/lang]
 [lang:en]
 * @scope enchant.EventTarget.prototype
 [/lang]
 */
enchant.EventTarget = enchant.Class.create({
    /**
     [lang:ja]
     * DOM Event風味の独自イベント実装を行ったクラス.
     * ただしフェーズの概念はなし.
     * @constructs
     [/lang]
     [lang:en]
     * A class for independent event implementation like DOM Events.
     * However, does not include phase concept.
     * @constructs
     [/lang]
     */
    initialize: function() {
        this._listeners = {};
    },
    /**
     [lang:ja]
     * イベントリスナを追加する.
     * @param {String} type イベントのタイプ.
     * @param {function(e:enchant.Event)} listener 追加するイベントリスナ.
     [/lang]
     [lang:en]
     * Add EventListener.
     * @param {String} type Event type.
     * @param {function(e:enchant.Event)} listener EventListener added.
     [/lang]
     */
    addEventListener: function(type, listener) {
        var listeners = this._listeners[type];
        if (listeners == null) {
            this._listeners[type] = [listener];
        } else if (listeners.indexOf(listener) === -1) {
            listeners.unshift(listener);

        }
    },
    /**
     * Synonym for addEventListener
     * @param {String} type Event type.
     * @param {function(e:enchant.Event)} listener EventListener added.
     */
    on: function() {
        this.addEventListener.apply(this, arguments);
    },
    /**
     [lang:ja]
     * イベントリスナを削除する.
     * @param {String} type イベントのタイプ.
     * @param {function(e:enchant.Event)} listener 削除するイベントリスナ.
     [/lang]
     [lang:en]
     * Delete EventListener.
     * @param {String} type Event type.
     * @param {function(e:enchant.Event)} listener EventListener deleted.
     [/lang]
     */
    removeEventListener: function(type, listener) {
        var listeners = this._listeners[type];
        if (listeners != null) {
            var i = listeners.indexOf(listener);
            if (i !== -1) {
                listeners.splice(i, 1);
            }
        }
    },
    /**
     [lang:ja]
     * すべてのイベントリスナを削除する.
     * @param {String} type イベントのタイプ.
     [/lang]
     [lang:en]
     * Clear EventListener.
     * @param {String} type Event type.
     [/lang]
     */
    clearEventListener: function(type) {
        if (type != null) {
            delete this._listeners[type];
        } else {
            this._listeners = {};
        }
    },
    /**
     [lang:ja]
     * イベントを発行する.
     * @param {enchant.Event} e 発行するイベント.
     [/lang]
     [lang:en]
     * Issue event.
     * @param {enchant.Event} e Event issued.
     [/lang]
     */
    dispatchEvent: function(e) {
        e.target = this;
        e.localX = e.x - this._offsetX;
        e.localY = e.y - this._offsetY;
        if (this['on' + e.type] != null){
            this['on' + e.type](e);
        }
        var listeners = this._listeners[e.type];
        if (listeners != null) {
            listeners = listeners.slice();
            for (var i = 0, len = listeners.length; i < len; i++) {
                listeners[i].call(this, e);
            }
        }
    }
});
