/**
 * @scope enchant.EventTarget.prototype
 */
enchant.EventTarget = enchant.Class.create({
    /**
     * @name enchant.EventTarget
     * @class
     [lang:ja]
     * DOM Event風味の独自イベント実装を行ったクラス.
     * ただしフェーズの概念はなし.
     [/lang]
     [lang:en]
     * A class for implementation of events similar to DOM Events.
     * However, it does not include the concept of phases.
     [/lang]
     [lang:de]
     * Eine Klasse für eine unabhängige Implementierung von Ereignissen 
     * (Events), ähnlich wie DOM Events.
     * Jedoch wird das Phasenkonzept nicht unterstützt.
     [/lang]
     * @constructs
     */
    initialize: function() {
        this._listeners = {};
    },
    /**
     [lang:ja]
     * イベントリスナを追加する.
     * @param {String} type イベントのタイプ.
     * @param {Function(e:enchant.Event)} listener 追加するイベントリスナ.
     [/lang]
     [lang:en]
     * Add a new event listener which will be executed when the event
     * is dispatched.
     * @param {String} type Type of the events.
     * @param {Function(e:enchant.Event)} listener Event listener to be added.
     [/lang]
     [lang:de]
     * Fügt einen neuen Ereignisbeobachter hinzu, welcher beim Auftreten des
     * Events ausgeführt wird.
     * @param {String} type Ereignis Typ.
     * @param {Function(e:enchant.Event)} listener Der Ereignisbeobachter 
     * der hinzugefügt wird.
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
     [lang:ja]
     * addEventListener と同じ.
     * @param {String} type イベントのタイプ.
     * @param {Function(e:enchant.Event)} listener 追加するイベントリスナ.
     [/lang]
     [lang:en]
     * Synonym for addEventListener.
     * @param {String} type Type of the events.
     * @param {Function(e:enchant.Event)} listener Event listener to be added.
     [/lang]
     [lang:de]
     * Synonym für addEventListener.
     * @param {String} type Ereignis Typ.
     * @param {Function(e:enchant.Event)} listener Der Ereignisbeobachter 
     * der hinzugefügt wird.
     [/lang]
     * @see enchant.EventTarget#addEventListener
     */
    on: function() {
        this.addEventListener.apply(this, arguments);
    },
    /**
     [lang:ja]
     * イベントリスナを削除する.
     * @param {String} type イベントのタイプ.
     * @param {Function(e:enchant.Event)} listener 削除するイベントリスナ.
     [/lang]
     [lang:en]
     * Delete an event listener.
     * @param {String} [type] Type of the events.
     * @param {Function(e:enchant.Event)} listener Event listener to be deleted.
     [/lang]
     [lang:de]
     * Entfernt einen Ereignisbeobachter.
     * @param {String} [type] Ereignis Typ.
     * @param {Function(e:enchant.Event)} listener Der Ereignisbeobachter 
     * der entfernt wird.
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
     * Clear all defined event listeners of a given type.
     * If no type is given, all listeners will be removed.
     * @param {String} type Type of the events.
     [/lang]
     [lang:de]
     * Entfernt alle Ereignisbeobachter für einen Typ.
     * Wenn kein Typ gegeben ist, werden alle 
     * Ereignisbeobachter entfernt.
     * @param {String} type Ereignis Typ.
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
     * Issue an event.
     * @param {enchant.Event} e Event to be issued.
     [/lang]
     [lang:de]
     * Löst ein Ereignis aus.
     * @param {enchant.Event} e Ereignis das ausgelöst werden soll.
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
