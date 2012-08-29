var page = new WebPage(),
  address, output, size;
 
if (phantom.args.length < 2 || phantom.args.length > 3) {
  console.log('Usage: rasterize.js URL filename');
  phantom.exit();
} else {
  address = phantom.args[0];
  output = phantom.args[1];
  page.viewportSize = { width: 1024, height: 768 };
  page.open(address, function (status) {
    if (status !== 'success') {
      console.log('Unable to load the address!');
    } else {
      window.setTimeout(function () {
        page.render(output);
        phantom.exit();
      }, 1000);
    }
  });
}