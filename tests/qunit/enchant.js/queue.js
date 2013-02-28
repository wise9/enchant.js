module('Queue', {
    setup: function() {
        enchant();
    }
})

test('new Queue', function() {
    var result = false;
    var q = new Queue(function() {
        result = true;
    });
    equal(result, false, 'before call queue');
    q.call();
    equal(result, true, 'after call queue');
});

test('Queue.next', function() {
    var result = false;
    var q = Queue.next(function() {
        result = true;
    });
    equal(result, false, 'before call queue');
    q.call();
    equal(result, true, 'after call queue');
});

test('Queue chain', function() {
    var result1 = false, result2 = false, hoge;
    Queue.next(function() {
        result1 = true;
        return 'hoge';
    })
    .next(function(arg) {
        result2 = true;
        hoge = arg;
    })
    .call();
    equal((result1 & result2), true, 'chain');
    equal(hoge, 'hoge', 'pass returned value');
});

test('Queue#error', function() {
    var result1 = false, result2 = false;
    Queue.next(function() {
        throw new Error('fail');
    })
    .next(function() {
        result1 = true;
    })
    .error(function() {
        result2 = true;
    })
    .call();
    equal(result1, false, 'skipped in error');
    equal(result2, true, 'error handling');

    raises(function() {
        Queue.next(function() {
            throw new Error('fail');
        })
        .call();
    }, /queue failed/, 'no handler');
});

test('async Queue', function() {
    var result = false;
    Queue.next(function() {
        var q = new Queue();
        stop();
        setTimeout(function() {
            q.call();
        }, 100);
        return q;
    })
    .next(function() {
        result = true;
    })
    .call();
    equal(result, false, 'before wait (q.call)');
    setTimeout(function() {
        start();
        equal(result, true, 'after wait (q.call)');
    }, 150);

    var result1 = false, result2 = false;
    Queue.next(function() {
        var q = new Queue();
        stop();
        setTimeout(function() {
            q.fail();
        }, 100);
        return q;
    })
    .next(function() {
        result1 = false;
    })
    .error(function() {
        result2 = true;
    })
    .call();
    equal(result1 | result2, false, 'before wait (q.fail)');
    setTimeout(function() {
        start();
        equal(result1, false, 'skip in error (q.fail)');
        equal(result2, true, 'error handling (q.fail)');
    }, 150);
});
