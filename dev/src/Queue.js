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
        return this._emit('succ', arg);
    },
    fail: function(arg) {
        return this._emit('fail', arg);
    },
    _emit: function(stat, arg) {
        var received;
        if (stat === 'succ') {
            if (this._succ) {
                try {
                    received = this._succ.call(this, arg);
                } catch (e) {
                    return this._emit('fail', e);
                }
            } else {
                received = arg;
            }
            if (this._next instanceof enchant.Queue) {
                if (received instanceof enchant.Queue) {
                    enchant.Queue.insert(this, received);
                } else {
                    this._next._emit('succ', received);
                }
            }
        } else if (stat === 'fail') {
            var queue = this;
            while (queue && !queue._fail) {
                queue = queue._next;
            }
            if (queue instanceof enchant.Queue) {
                var n = queue._fail.call(queue, arg);
                queue._emit.call(queue, 'succ', n);
            } else {
                var e = new Error('queue failed');
                e.arg = arg;
                throw e;
            }
        }
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
    return new enchant.Queue(func);
};
