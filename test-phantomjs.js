if (phantom.state.length === 0) {
    phantom.state = 'test-phantomjs';
    phantom.open(phantom.args[0]);
} else {
    if (phantom.loadStatus === 'success') {
        phantom.exit();
    }
}
