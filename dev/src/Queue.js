enchant.Queue = enchant.Class.create({
    initialize: function(succ, fail) {
        this._succ = succ || null;
        this._fail = fail || null;
        this._next = null;
        this._tail = this;
        this._id = null;
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
        if (!(queue instanceof enchant.Queue)) {
            return;
        }
        try {
            received = queue._succ(arg);
        } catch (e) {
            return queue.fail(e);
        }
        if (received instanceof enchant.Queue) {
            enchant.Queue._insert(queue, received);
        } else if (queue._next instanceof enchant.Queue) {
            queue._next.call(received);
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
            var err = new Error('queue failed');
            err.arg = arg;
            throw err;
        }
    },
    parallel: function(arg) {
        var progress = 0;
        var ret = (arg instanceof Array) ? [] : {};
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
                    .error(function(err) { q.fail(err); });
                    clearTimeout(queue._id);
                    queue._id = setTimeout(function(q) { queue.call(); }, 0);
                }(arg[prop], prop));
            }
        }
        return this.next(function() {
            return q;
        });
    }
});
enchant.Queue._insert = function(queue, ins) {
    if (queue._next instanceof enchant.Queue) {
        ins._next = queue._next;
    }
    queue._next = ins;
};
enchant.Queue.next = function(func) {
    var q = new enchant.Queue(func);
    q._id = setTimeout(function() { q.call(); }, 0);
    return q;
};
enchant.Queue.parallel = function(arg) {
    var q = new enchant.Queue();
    q._id = setTimeout(function() { q.call(); }, 0);
    q.parallel(arg);
    return q;
};
