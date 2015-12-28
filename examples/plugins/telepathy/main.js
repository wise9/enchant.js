enchant();

window.onload = function() {
    var CHANNEL = 'enchant_chat_example_0';
    var lines = [];
    var core = new enchant.Core(320, 320);
    core.onload = function() {
        var sense = new enchant.telepathy.TelepathySense();
        sense.onerror = function(evt) {
            console.log(evt.message);
        };

        var name = new enchant.Label('User' + ('0' + Math.floor(Math.random() * 100)).slice(-2));
        name.backgroundColor = '#a0a0a0';
        name.height = 16;
        name.ontouchend = function() {
            name.text = prompt('name', this.text);
        };

        var output = new enchant.Label('');
        output.height = 16;
        output.y = 16;
        output.ontelepathy = function(evt) {
            lines.push(
                    '(' + (new Date(evt.data.time)).toLocaleTimeString() + ')' +
                    evt.data.name + ':' + evt.data.text);
            lines = lines.slice(-18);
            this.text = lines.join('<br>');
        };

        var send = new enchant.Label('New message');
        send.backgroundColor = '#a0a0a0';
        send.height = 16;
        send.y = 320 - 16;
        send.ontouchend = function() {
            var text = prompt('message', '');
            sense.send(CHANNEL, {
                time: Date.now(),
                name: name.text,
                text: text
            });
        };

        core.rootScene.addChild(name);
        core.rootScene.addChild(send);
        core.rootScene.addChild(output);

        sense.open(CHANNEL);
        sense.addChanneler(CHANNEL, output);
    };
    core.start();
};
