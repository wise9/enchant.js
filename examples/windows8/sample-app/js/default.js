// 空白のテンプレートの概要については、次のドキュメントを参照してください:
// http://go.microsoft.com/fwlink/?LinkId=232509
(function () {
    "use strict";

    function updateView() {
        var frame = document.getElementById('frame');
        var width = parseInt(frame.getAttribute('width'));
        var height = parseInt(frame.getAttribute('height'));
        var size = Math.min(window.innerWidth / width, window.innerHeight / height);
        frame.style.left = (window.innerWidth - width * size) / 2 + 'px';
        frame.style.top = (window.innerHeight - height * size) / 2 + 'px';
        frame.style.msTransformOrigin = '0px 0px';
        frame.style.msTransform = 'scale(' + size + ',' + size + ')';
    }

    WinJS.Binding.optimizeBindingReferences = true;

    var app = WinJS.Application;
    var activation = Windows.ApplicationModel.Activation;

    app.onactivated = function (args) {
        if (args.detail.kind === activation.ActivationKind.launch) {
            if (args.detail.previousExecutionState !== activation.ApplicationExecutionState.terminated) {
                var frame = document.getElementById('frame');
                frame.onload = function () {
                    frame.contentWindow.postMessage('hello', '*');
                };
                frame.src = 'enchant/index.html';
                updateView();
            } else {
                updateView();
            }
            args.setPromise(WinJS.UI.processAll());
        }
    };

    window.onresize = function () {
        updateView();
    }

    app.oncheckpoint = function (args) {
    };

    app.start();
})();
