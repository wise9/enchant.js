enchant.Queue = enchant.Class.create({
    initialize: function() {
        this._succ = this._fail = this._next = this._id = null;
        this._tail = this;
    },
    next: function(func) {
        var q = new enchant.Queue();
        q._succ = func;
        return this._add(q);
    },
    error: function(func) {
        var q = new enchant.Queue();
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
    }
});
enchant.Queue._insert = function(queue, ins) {
    if (queue._next instanceof enchant.Queue) {
        ins._next = queue._next;
    }
    queue._next = ins;
};
enchant.Queue.next = function(func) {
    var q = new enchant.Queue().next(func);
    q._id = setTimeout(function() { q.call(); }, 0);
    return q;
};
enchant.Queue.parallel = function(arg) {
    var q = new enchant.Queue();
    q._id = setTimeout(function() { q.call(); }, 0);
    var progress = 0;
    var ret = (arg instanceof Array) ? [] : {};
    var p = new enchant.Queue();
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
                clearTimeout(queue._id);
                queue._id = setTimeout(function() { queue.call(); }, 0);
            }(arg[prop], prop));
        }
    }
    if (!progress) {
        p._id = setTimeout(function() { p.call(ret); }, 0);
    }
    return q.next(function() { return p; });
};
