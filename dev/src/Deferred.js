if (window.Deferred) {
    enchant.Deferred = window.Deferred;
} else {
    enchant.Deferred = enchant.Class.create({
        initialize: function() {
            this._succ = this._fail = this._next = this._id = null;
            this._tail = this;
        },
        next: function(func) {
            var q = new enchant.Deferred();
            q._succ = func;
            return this._add(q);
        },
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
        fail: function(arg) {
            var queue = this;
            while (queue && !queue._fail) {
                queue = queue._next;
            }
            if (queue instanceof enchant.Deferred) {
                var n = queue._fail(arg);
                queue.call(n);
            } else if (arg instanceof Error) {
                throw arg;
            } else {
                var err = new Error('queue failed');
                err.arg = arg;
                throw err;
            }
        }
    });
    enchant.Deferred._insert = function(queue, ins) {
        if (queue._next instanceof enchant.Deferred) {
            ins._next = queue._next;
        }
        queue._next = ins;
    };
    enchant.Deferred.next = function(func) {
        var q = new enchant.Deferred().next(func);
        q._id = setTimeout(function() { q.call(); }, 0);
        return q;
    };
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
