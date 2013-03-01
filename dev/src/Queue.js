enchant.Queue = enchant.Class.create(enchant.EventTarget, {
    initialize: function(succ, fail) {
        enchant.EventTarget.call(this);
        this._succ = succ || null;
        this._fail = fail || null;
        this._next = null;
        this._tail = this;
    },
    next: function(func) {
        var q = new enchant.Queue(func);
        return this._add(q);
    },
    error: function(func) {
        var q = new enchant.Queue(null, func);
        return this._add(q);
    },
    _add: function(queue) {
        enchant.Queue.connect(this._tail, queue);
        this._tail = queue;
        return this;
    },
    call: function(arg) {
        var received;
        var queue = this;
        while (queue && !queue._succ) {
            queue = queue._next;
        }
        if (!(queue instanceof enchant.Queue)) {
            return;
        }
        try {
            received = queue._succ(arg);
        } catch (e) {
            return queue.fail(e);
        }
        if (queue._next instanceof enchant.Queue) {
            if (received instanceof enchant.Queue) {
                enchant.Queue.insert(queue, received);
            } else {
                queue._next.call(received);
            }
        }
    },
    fail: function(arg) {
        var queue = this;
        while (queue && !queue._fail) {
            queue = queue._next;
        }
        if (queue instanceof enchant.Queue) {
            var n = queue._fail(arg);
            queue.call(n);
        } else {
            var e = new Error('queue failed');
            e.arg = arg;
            throw e;
        }
    },
    parallel: function(arg) {
        var progress = 0;
        var ret = (arg instanceof Array) ? [] : {};
        this.next(function() {
            var q = new enchant.Queue();
            for (var prop in arg) {
                if (arg.hasOwnProperty(prop)) {
                    progress++;
                    /*jshint loopfunc:true */
                    (function(queue, name) {
                        queue.next(function(arg) {
                            progress--;
                            ret[name] = arg;
                            if (progress <= 0) {
                                q.call(ret);
                            }
                        })
                        .error(function(e) {
                            q.fail(e);
                        });
                        setTimeout(function(q) {
                            queue.call();
                        }, 0);
                    }(arg[prop], prop));
                }
            }
            return q;
        });
        return this;
    }
});
enchant.Queue.connect = function(queue1, queue2) {
    queue1._next = queue2;
};
enchant.Queue.insert = function(queue1, ins) {
    if (queue1._next instanceof enchant.Queue) {
        ins._next = queue1._next;
    }
    enchant.Queue.connect(queue1, ins);
};
enchant.Queue.next = function(func) {
    var q = new enchant.Queue(func);
    setTimeout(function() {
        q.call();
    }, 0);
    return q;
};
enchant.Queue.parallel = function(arg) {
    var q = new enchant.Queue();
    q.parallel(arg);
    setTimeout(function() {
        q.call();
    }, 0);
    return q;
};
