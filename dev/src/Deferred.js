if (window.Deferred) {
    enchant.Deferred = window.Deferred;
} else {
    /**
     * @scope enchant.Deferred.prototype
     */
    enchant.Deferred = enchant.Class.create({
        /**
         * @name enchant.Deferred
         * @class
         [lang:ja]
         * 非同期処理を扱うためのクラス.
         * jsdeferredのAPIを模倣している.
         * jQuery.Deferredとの互換性はない.
         [/lang]
         [lang:en]
         [/lang]
         [lang:de]
         [/lang]
         * <br/>
         * See: <a href="http://cho45.stfuawsc.com/jsdeferred/">
         * http://cho45.stfuawsc.com/jsdeferred/</a>
         *
         * @example
         * enchant.Deferred
         *     .next(function() {
         *         return 42;
         *     })
         *     .next(function(n) {
         *         console.log(n); // 42
         *     })
         *     .next(function() {
         *         return core.load('img.png'); // wait loading
         *     })
         *     .next(function() {
         *         var img = core.assets['img.png'];
         *         console.log(img instanceof enchant.Surface); // true
         *         throw new Error('!!!');
         *     })
         *     .next(function() {
         *         // skip
         *     })
         *     .error(function(err) {
         *          console.log(err.message); // !!!
         *     });
         *
         * @constructs
         */
        initialize: function() {
            this._succ = this._fail = this._next = this._id = null;
            this._tail = this;
        },
        /**
         [lang:ja]
         * 後続の処理を追加する.
         * @param {Function} func 追加する処理.
         [/lang]
         [lang:en]
         * @param {Function} func
         [/lang]
         [lang:de]
         * @param {Function} func
         [/lang]
         */
        next: function(func) {
            var q = new enchant.Deferred();
            q._succ = func;
            return this._add(q);
        },
        /**
         [lang:ja]
         * エラー処理を追加する.
         * @param {Function} func 追加するエラー処理.
         [/lang]
         [lang:en]
         * @param {Function} func
         [/lang]
         [lang:de]
         * @param {Function} func
         [/lang]
         */
        error: function(func) {
            var q = new enchant.Deferred();
            q._fail = func;
            return this._add(q);
        },
        _add: function(queue) {
            this._tail._next = queue;
            this._tail = queue;
            return this;
        },
        /**
         [lang:ja]
         * 値を伝播させる.
         * @param {*} arg 次の処理に渡す値.
         [/lang]
         [lang:en]
         * @param {*} arg
         [/lang]
         [lang:de]
         * @param {*} arg
         [/lang]
         */
        call: function(arg) {
            var received;
            var queue = this;
            while (queue && !queue._succ) {
                queue = queue._next;
            }
            if (!(queue instanceof enchant.Deferred)) {
                return;
            }
            try {
                received = queue._succ(arg);
            } catch (e) {
                return queue.fail(e);
            }
            if (received instanceof enchant.Deferred) {
                enchant.Deferred._insert(queue, received);
            } else if (queue._next instanceof enchant.Deferred) {
                queue._next.call(received);
            }
        },
        /**
         [lang:ja]
         * エラーを伝播させる.
         * @param {*} arg エラーとして伝播させる値.
         [/lang]
         [lang:en]
         * @param {*} arg
         [/lang]
         [lang:de]
         * @param {*} arg
         [/lang]
         */
        fail: function(arg) {
            var result, err,
                queue = this;
            while (queue && !queue._fail) {
                queue = queue._next;
            }
            if (queue instanceof enchant.Deferred) {
                result = queue._fail(arg);
                queue.call(result);
            } else if (arg instanceof Error) {
                throw arg;
            } else {
                err = new Error('failed in Deferred');
                err.arg = arg;
                throw err;
            }
        }
    });
    enchant.Deferred._insert = function(queue, ins) {
        if (queue._next instanceof enchant.Deferred) {
            ins._tail._next = queue._next;
        }
        queue._next = ins;
    };
    /**
     [lang:ja]
     * タイマーで起動するDeferredオブジェクトを生成する.
     * @param {Function} func
     * @return {enchant.Deferred} 生成されたDeferredオブジェクト.
     [/lang]
     [lang:en]
     * @param {Function} func
     * @return {enchant.Deferred}
     [/lang]
     [lang:de]
     * @param {Function} func
     * @return {enchant.Deferred}
     [/lang]
     * @static
     */
    enchant.Deferred.next = function(func) {
        var q = new enchant.Deferred().next(func);
        q._id = setTimeout(function() { q.call(); }, 0);
        return q;
    };
    /**
     [lang:ja]
     * 複数のDeferredオブジェクトを待つDeferredオブジェクトを生成する.
     * @param {Object|enchant.Deferred[]} arg
     * @return {enchant.Deferred} 生成されたDeferredオブジェクト.
     [/lang]
     [lang:en]
     * @param {Object|enchant.Deferred[]} arg
     * @return {enchant.Deferred}
     [/lang]
     [lang:de]
     * @param {Object|enchant.Deferred[]} arg
     * @return {enchant.Deferred}
     [/lang]
     *
     * @example
     * // array
     * enchant.Deferred
     *     .parallel([
     *         enchant.Deferred.next(function() {
     *             return 24;
     *         }),
     *         enchant.Deferred.next(function() {
     *             return 42;
     *         })
     *     ])
     *     .next(function(arg) {
     *         console.log(arg); // [ 24, 42 ]
     *     });
     * // object
     * enchant.Deferred
     *     .parallel({
     *         foo: enchant.Deferred.next(function() {
     *             return 24;
     *         }),
     *         bar: enchant.Deferred.next(function() {
     *             return 42;
     *         })
     *     })
     *     .next(function(arg) {
     *         console.log(arg.foo); // 24
     *         console.log(arg.bar); // 42
     *     });
     *
     * @static
     */
    enchant.Deferred.parallel = function(arg) {
        var q = new enchant.Deferred();
        q._id = setTimeout(function() { q.call(); }, 0);
        var progress = 0;
        var ret = (arg instanceof Array) ? [] : {};
        var p = new enchant.Deferred();
        for (var prop in arg) {
            if (arg.hasOwnProperty(prop)) {
                progress++;
                /*jshint loopfunc:true */
                (function(queue, name) {
                    queue.next(function(arg) {
                        progress--;
                        ret[name] = arg;
                        if (progress <= 0) {
                            p.call(ret);
                        }
                    })
                    .error(function(err) { p.fail(err); });
                    if (typeof queue._id === 'number') {
                        clearTimeout(queue._id);
                    }
                    queue._id = setTimeout(function() { queue.call(); }, 0);
                }(arg[prop], prop));
            }
        }
        if (!progress) {
            p._id = setTimeout(function() { p.call(ret); }, 0);
        }
        return q.next(function() { return p; });
    };
}
