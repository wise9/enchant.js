/**
 * @fileOverview
 * telepathy.enchant.js
 * @version 0.1.0
 * @require enchant.js v0.8.0+
 * @author UEI Corporation
 */
(function() {
/**
 * @namespace enchant.telepathy
 */
enchant.telepathy = {};

/**
 [lang:ja]
 * デフォルトの送信APIのURL.
 [/lang]
 [lang:en]
 * The default URL of sending API.
 [/lang]
 * @type String
 */
enchant.telepathy.SEND_API_URL = 'http://skylab.enchantmoon.com/moonblock/add_data/';
/**
 [lang:ja]
 * デフォルトの受信APIのURL.
 [/lang]
 [lang:en]
 * The default URL of receiving API.
 [/lang]
 * @type String
 */
enchant.telepathy.RECV_API_URL = 'http://skylab.enchantmoon.com/moonblock/watch/';

/**
 [lang:ja]
 * オブジェクトににアプリケーション外からのメッセージ(テレパシー)を与えるイベント.
 * 発行するオブジェクト: {@link enchant.telepathy.TelepathySence}
 [/lang]
 [lang:en]
 * Event which gives foreign message to objects.
 * Issued by {@link enchant.telepathy.TelepathySence}
 [/lang]
 * @type String
 */
enchant.Event.TELEPATHY = 'telepathy';

/**
 * @scope enchant.telepathy.Telepathy.prototype
 */
enchant.telepathy.Telepathy = enchant.Class.create(enchant.Event, {
    /**
     * @name enchant.telepathy.Telepathy
     * @class
     [lang:ja]
     * アプリケーション外からのメッセージを表すイベントオブジェクト.
     * @param {String} channel チャンネル.
     * @param {*} data データ.
     [/lang]
     [lang:en]
     * Event which represents foreign message.
     * @param {String} channel channel.
     * @param {*} data content.
     [/lang]
     * @constructs
     * @extends enchant.Event
     */
    initialize: function(channel, data) {
        enchant.Event.call(this, enchant.Event.TELEPATHY);

        /**
         [lang:ja]
         * テレパシーのチャンネルを表す.
         [/lang]
         [lang:en]
         * Telepathy channel.
         [/lang]
         * @type String
         */
        this.channel = channel;
        /**
         [lang:ja]
         * テレパシーの内容を表す.
         [/lang]
         [lang:en]
         * Telepathy content.
         [/lang]
         * @type *
         */
        this.data = data;
    }
});

/**
 * @scope enchant.telepathy.TelepathySense.prototype
 */
enchant.telepathy.TelepathySense = enchant.Class.create(enchant.EventTarget, {
    /**
     * @name enchant.telepathy.TelepathySense
     * @class
    [lang:ja]
     * テレパシーの送受信を行うためのオブジェクト.
    [/lang]
    [lang:en]
     * Object for sending and receiving telepathy.
    [/lang]
     * @construct
     * @extends enchant.EventTarget
     */
    initialize: function() {
        enchant.EventTarget.call(this);

        /**
         [lang:ja]
         * Telepathyの受信者を保持するオブジェクト.
         [/lang]
         [lang:en]
         * Object which stores channelers.
         [/lang]
         * @type Object
         */
        this.channelers = {};
        /**
         [lang:ja]
         * Telepathyの受信に使用するEventSourceを保持するオブジェクト.
         [/lang]
         [lang:en]
         * Object which stores EventSource.
         [/lang]
         * @type Object
         */
        this.eventSources = {};
        /**
         [lang:ja]
         * 最後に受信したTelepathyオブジェクト.
         [/lang]
         [lang:en]
         * The telepathy object which received lastly.
         [/lang]
         * @type enchant.telepathy.Telepathy
         */
        this.lastTelepathy = null;
        /**
         [lang:ja]
         * テレパシー送信APIのURL.
         [/lang]
         [lang:en]
         * URL of the send API.
         [/lang]
         * @type String
         */
        this.sendAPI = enchant.telepathy.SEND_API_URL;
        /**
         [lang:ja]
         * テレパシー受信APIのURL.
         [/lang]
         [lang:en]
         * URL of the receive API.
         [/lang]
         * @type String
         */
        this.recvAPI = enchant.telepathy.RECV_API_URL;

        this.addEventListener(enchant.Event.TELEPATHY, this._ontelepathy);
    },
    /**
     * @param {enchant.Event} evt
     * @private
     */
    _ontelepathy: function(evt) {
        var i, l,
            channelers = this.channelers[evt.channel];

        this.lastTelepathy = evt;

        if (!channelers) {
            return;
        }

        for (i = 0, l = channelers.length; i < l; i++) {
            channelers[i].dispatchEvent(evt);
        }
    },
    /**
     [lang:ja]
     * オブジェクトをTelepathyの受信者に設定する.
     * @param {String} channel 対象のチャンネル.
     * @param {enchant.EventTarget} target 対象のオブジェクト.
     [/lang]
     [lang:en]
     * Adds objet as telepathy channeler.
     * @param {String} channel target channel.
     * @param {enchant.EventTarget} target target object.
     [/lang]
     */
    addChanneler: function(channel, target) {
        if (this.channelers[channel]) {
            if (this.channelers[channel].indexOf(target) === -1) {
                this.channelers[channel].push(target);
            }
        } else {
            this.channelers[channel] = [ target ];
        }
    },
    /**
     [lang:ja]
     * オブジェクトをTelepathyの受信者から除外する.
     * @param {String} channel 対象のチャンネル.
     * @param {enchant.EventTarget} target 対象のオブジェクト.
     [/lang]
     [lang:en]
     * Removes objet from telepathy channeler.
     * @param {String} channel target channel.
     * @param {enchant.EventTarget} target target object.
     [/lang]
     */
    removeChanneler: function(channel, target) {
        var i;

        if (!this.channelers[channel]) {
            return;
        }

        i = this.channelers[channel].indexOf(target);

        if (i !== -1) {
            this.channelers[channel].splice(i, 1);
        }
    },
    /**
     [lang:ja]
     * テレパシーを送信する.
     * @param {String} channel 対象のチャンネル.
     * @param {*} message 送信するデータ.
     [/lang]
     [lang:en]
     * Sends the telepathy.
     * @param {String} channel target channel.
     * @param {*} message data to send.
     [/lang]
     */
    send: function(channel, message) {
        var xhr = new XMLHttpRequest(),
            data = JSON.stringify({ value: message });

        xhr.open('POST', this.sendAPI + channel, true);
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        xhr.addEventListener('error', function(evt) {
            var errorEvent = new enchant.Event(enchant.Event.ERROR);
            errorEvent.message = 'Cannot send telepathy: ' + channel;
            this.dispatchEvent(errorEvent);
        }.bind(this));
        xhr.send('object=' + data);
    },
    /**
     [lang:ja]
     * テレパシーの受信を開始する.
     * @param {String} channel 対象のチャンネル.
     [/lang]
     [lang:en]
     * Begins to receive the telepathy.
     * @param {String} channel target channel.
     [/lang]
     */
    open: function(channel) {
        var eventSource = new EventSource(this.recvAPI + channel);

        eventSource.addEventListener('message', function(evt) {
            var i, l,
                data = JSON.parse(evt.data),
                stream = data.objects;

            for (i = 0, l = stream.length; i < l; i++) {
                this.dispatchEvent(new enchant.telepathy.Telepathy(channel, JSON.parse(stream[i]).value));
            }
        }.bind(this));

        this.eventSources[channel] = eventSource;
    },
    /**
     [lang:ja]
     * テレパシーの受信を終了する.
     * @param {String} channel 対象のチャンネル.
     [/lang]
     [lang:en]
     * Ends to receive the telepathy.
     * @param {String} channel target channel.
     [/lang]
     */
    close: function(channel) {
        var eventSource = this.eventSources[channel];

        if (eventSource) {
            eventSource.close();
            delete this.eventSources[channel];
            delete this.channelers[channel];
        }
    },
    /**
     [lang:ja]
     * 全てのチャンネルについてテレパシーの受信を終了する.
     [/lang]
     [lang:en]
     * Closes all telepathy channels.
     [/lang]
     */
    closeAll: function() {
        for (var channel in this.eventSources) {
            this.close(channel);
        }
    },
    /**
     [lang:ja]
     * TelepathySenseの後処理を行う.
     [/lang]
     [lang:en]
     * Finalizes TelepathySense.
     [/lang]
     */
    finalize: function() {
        this.clearEventListener();
        this.closeAll();
        this.channelers = {};
    }
});

}());
