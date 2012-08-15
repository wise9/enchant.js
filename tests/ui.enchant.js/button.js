function findElementsWithClass(className) {
	return document.getElementsByClassName(className);
}

function findElementWithId(id) {
	return document.getElementById(id);
}


module('Button', {
	setup: function () {
		enchant();
		var game = new Game();
	},
	teardown: function () {

	}
});


test('Button.text', function () {
    var button = new Button("fuga");
    ok(button.text === "fuga");
    button.text = "hoge";
    ok(button.text === "hoge");
});

test('Button.theme', function () {
    var button = new Button("hoge", "dark");
    var image = typeof button._element.style["background-image"];
    ok(typeof button._element.style["background-image"] !== "undefined");
    ok(button._element.style["background-image"] !== "");
    button._applyTheme(enchant.ui.Button.DEFAULT_THEME.light.normal);
    ok(button.text === "hoge");
});


