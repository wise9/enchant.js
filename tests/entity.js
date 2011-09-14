module('Entity', {
	setup: function () {
		enchant();
		var game = new Game();
	},
	teardown: function() {
		// Gameインスタンスを破棄したいのだがそんな処理は無い様子
	}
});


test('Entity.class', function () {
	var label = new Label();
	label['class'] = 'myClassName';
	equal(label['class'], 'myClassName');

	ok(findElementsWithClass('myClassName').length === 0);
	enchant.Game.instance.rootScene.addChild(label);
	ok(findElementsWithClass('myClassName').length === 1);
});

test('Entity.id', function () {
	var label = new Label();
	label.id = 'myId';
	equal(label.id, 'myId');

	ok(findElementWithId('myId') === null);
	enchant.Game.instance.rootScene.addChild(label);
	ok(findElementWithId('myId') !== null);
});

function findElementsWithClass(className) {
	return document.getElementsByClassName(className);
}

function findElementWithId(id) {
	return document.getElementById(id);
}
