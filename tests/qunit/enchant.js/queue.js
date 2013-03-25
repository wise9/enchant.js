module('Queue', {
    setup: function() {
        enchant();
    }
})

test('new Queue', function() {
    var result = false;
    var q = new Queue().next(function() {
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
    }, 50);
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
    }, 50);
});

test('Queue#error', function() {
    raises(function() {
        new Queue().next(function() {
            throw new Error('fail');
        }).call();
    }, /queue failed/, 'no handler');

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
    }, 50);
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

test('parallel Queue #arrayArgument', function() {
    stop();
    Queue.parallel([
        Queue.next(function() {
            return 1;
        }),
        Queue.next(function() {
            return 2;
        }),
        Queue.next(function() {
            return 3;
        })
    ])
    .next(function(arr) {
        start();
        deepEqual(arr, [ 1, 2, 3 ], 'returns array');
    });
});

test('parallel Queue #objectArgument', function() {
    stop();
    Queue.parallel({
        one: Queue.next(function() {
            return 1;
        }),
        two: Queue.next(function() {
            return 2;
        }),
        three: Queue.next(function() {
            return 3;
        })
    })
    .next(function(obj) {
        start();
        deepEqual(obj, { one: 1, two: 2, three: 3 }, 'returns object');
    });
});

test('parallel Queue #Error', function() {
    var result = false;
    var c = 0;
    stop();
    Queue.parallel([
        Queue.next(function() {
            throw new Error('error1');
        }),
        Queue.next(function() {
            throw new Error('error2');
        }),
        Queue.next(function() {
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
