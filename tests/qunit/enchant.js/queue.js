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
    Queue.next(function() {
        result = true;
    });
    equal(result, false, 'before call queue');
    stop();
    setTimeout(function() {
        start();
        equal(result, true, 'after call queue');
    }, 0);
});

test('chained Queue', function() {
    var result1 = false, result2 = false, hoge;
    Queue.next(function() {
        result1 = true;
        return 'hoge';
    })
    .next(function(arg) {
        result2 = true;
        hoge = arg;
    });
    stop();
    setTimeout(function() {
        start();
        equal((result1 & result2), true, 'chain');
        equal(hoge, 'hoge', 'pass returned value');
    }, 0);
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
    });
    stop();
    setTimeout(function() {
        start();
        equal(result1, false, 'skipped in error');
        equal(result2, true, 'error handling');
    }, 0);

    raises(function() {
        (new Queue()).next(function() {
            throw new Error('fail');
        }).call();
    }, /queue failed/, 'no handler');
});

test('async Queue', function() {
    var result = false;
    Queue.next(function() {
        var q = new Queue();
        setTimeout(function() {
            q.call();
        }, 100);
        return q;
    })
    .next(function() {
        result = true;
    });
    equal(result, false, 'before wait (q.call)');
    stop();
    setTimeout(function() {
        start();
        equal(result, true, 'after wait (q.call)');
    }, 150);

    var result1 = false, result2 = false;
    Queue.next(function() {
        var q = new Queue();
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
    });
    equal(result1 | result2, false, 'before wait (q.fail)');
    stop();
    setTimeout(function() {
        start();
        equal(result1, false, 'skip in error (q.fail)');
        equal(result2, true, 'error handling (q.fail)');
    }, 150);
});

test('parallel Queue', function() {
    stop();
    (new enchant.Queue()).parallel([
        new Queue(function() {
            return 1;
        }),
        new Queue(function() {
            return 2;
        }),
        new Queue(function() {
            return 3;
        })
    ])
    .next(function(arr) {
        start();
        deepEqual(arr, [ 1, 2, 3 ], 'returns array');
    })
    .call();

    stop();
    Queue.parallel({
        one: new Queue(function() {
            return 1;
        }),
        two: new Queue(function() {
            return 2;
        }),
        three: new Queue(function() {
            return 3;
        })
    })
    .next(function(obj) {
        start();
        deepEqual(obj, { one: 1, two: 2, three: 3 }, 'returns object');
    });

    var result = false;
    var c = 0;
    stop();
    Queue.parallel([
        new Queue(function() {
            throw new Error('error1');
        }),
        new Queue(function() {
            throw new Error('error2');
        }),
        new Queue(function() {
            return 'success';
        })
    ])
    .next(function(arr) {
        result = true;
    })
    .error(function(err) {
        c++;
        if (!(err instanceof Error) || !(/error\d/.test(err.message))) {
            throw new Error('');
        }
    });
    setTimeout(function() {
        start();
        equal(result, false, 'skipped');
        equal(c, 2, 'receive 2 errors');

    }, 50);
});
