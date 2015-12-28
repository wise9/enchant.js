describe("Deferred", function(){
    before(function(){
        enchant();
    });

    it("should create a new Deferred object", function(){
        var result = false;
        var q = new Deferred().next(function(){
            result = true;
        });
        expect(result).to.be.false;
        q.call();
        expect(result).to.be.true;
    });

    it("should execute next function defined by Deferred.next", function(done){
        var result = false;
        Deferred.next(function(){
            result = true;
        });
        expect(result).to.be.false;
        setTimeout(done, 150);
        setTimeout(function(){
            expect(result).to.be.true;
        }, 50);
    });

    it("should execute chained Deferred", function(done){
        setTimeout(done, 150);
        var result1 = result2 = false;
        Deferred.next(function(){
            result1 = true;
        })
        .next(function(){
            result2 = true;
        });
        setTimeout(function(){
            expect(result1).to.be.true;
            expect(result2).to.be.true;
        }, 50);
    });

    it("should pass returned value to chained next Dererred", function(done) {
        setTimeout(done, 150);
        var val;
        Deferred.next(function(){
            return 'foo';
        })
        .next(function(arg){
            val = arg;
        });
        setTimeout(function(){
            expect(val).to.be.equal('foo');
        }, 50);
    });

    it("should throw error", function(){
        var fn = function(){ 
            new Deferred().next(function(){
                throw new Error('fail');
            }).call();
        };
        expect(fn).to.throw(/fail/);
    });

    it("should handle the error", function(done){
        setTimeout(done, 150);
        var result1 = result2 = false;
        Deferred.next(function(){
            throw new Error('fail');
        })
        .next(function(){
            result1 = true;
        })
        .error(function(){
            result2 = true;
        });
        setTimeout(function(){
            expect(result1).to.be.false;
            expect(result2).to.be.true;
        }, 50);
    });

    it("should execute asynchronously", function(done){
        setTimeout(done, 200);
        var result = false;
        Deferred.next(function(){
            var q = new Deferred();
            setTimeout(function(){
                q.call();
            }, 50);
            return q
        })
        .next(function(){
            result = true;
        });
        expect(result).to.be.false;
        setTimeout(function(){
            expect(result).to.be.true;
        }, 100);
    });

    it("should handle the error when execute asynchronously", function(done){
        setTimeout(done, 200);
        var result1 = result2 = false;
        Deferred.next(function(){
            var q = new Deferred();
            setTimeout(function(){
                q.fail();
            }, 50);
            return q;
        })
        .next(function(){
            result1 = true;
        })
        .error(function(){
            result2 = true;
        });
        expect(result1).to.be.false;
        expect(result2).to.be.false;
        setTimeout(function(){
            expect(result1).to.be.false;
            expect(result2).to.be.true;
        }, 100);
    });

    it("should execute parallel with array argument", function(done){
        Deferred.parallel([
            Deferred.next(function(){
                return 1;
            }),
            Deferred.next(function(){
                return 2;
            }),
            Deferred.next(function(){
                return 3;
            })
        ])
        .next(function(arr){
            expect(arr).to.eql([1, 2, 3]);
            done();
        });
    });

    it("should execute parallel with object argument", function(done){
        Deferred.parallel({
            one: Deferred.next(function(){
                return 1;
            }),
            two: Deferred.next(function(){
                return 2;
            }),
            three: Deferred.next(function(){
                return 3;
            })
        })
        .next(function(obj){
            expect(obj).to.eql({one: 1, two: 2, three: 3});
            done();
        });
    });

    it("should handle the error when execute parallel", function(done){
        setTimeout(done, 150);
        var result = false, counter = 0;
        Deferred.parallel([
            Deferred.next(function(){
                throw new Error('error1');
            }),
            Deferred.next(function(){
                throw new Error('error2');
            }),
            Deferred.next(function(){
                return 'success';
            })
        ])
        .next(function(){
            result = true;
        })
        .error(function(err){
            counter++;
            if(!(err instanceof Error) || !(/error\d/.test(err.message))){
                throw Error('');
            }
        });
        setTimeout(function(){
            expect(result).to.be.false;
            expect(counter).to.equal(2);
        }, 50);
    });
});
