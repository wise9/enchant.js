console.log('Hello, world!');
var page = new WebPage();

if (phantom.args.length !== 1) {
    console.log('Usage: test-phantomjs.js filename');
    phantom.exit();
} else {
    fname = phantom.args[0];
    page.open(fname, function (status) {
        if(status !== "success") console.log(phantom.args[0], status);
        else console.log('success')
        phantom.exit();
    });
}
