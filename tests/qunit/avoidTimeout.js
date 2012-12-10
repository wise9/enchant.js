var times = 0;
var __id = setInterval(function() {
    console.log(''); // dummy for grunt qunit
    times++;
    if (times > 30) {
        clearInterval(__id);
    }
}, 1000);
