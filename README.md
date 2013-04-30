enchant.js
==========

<img src="http://github.com/wise9/enchant.js/raw/master/enchant.png" width="320" height="320">

JavaScript Game Engine

[![Build Status](https://secure.travis-ci.org/wise9/enchant.js.png)](https://travis-ci.org/wise9/enchant.js)

Download
--------

- [enchant.js](http://github.com/wise9/enchant.js/raw/master/enchant.js)
- [enchant.min.js](http://github.com/wise9/enchant.js/raw/master/enchant.min.js) (compressed)


Documentation
-------------

- English
    - <http://wise9.github.com/enchant.js/doc/core/en/index.html>
    - <http://wise9.github.com/enchant.js/doc/plugins/en/index.html> (with plugins)
- Deutsch (German)
    - <http://wise9.github.com/enchant.js/doc/core/de/index.html>
    - <http://wise9.github.com/enchant.js/doc/plugins/de/index.html> (with plugins)
- Japanese
    - <http://wise9.github.com/enchant.js/doc/core/ja/index.html>
    - <http://wise9.github.com/enchant.js/doc/plugins/ja/index.html> (with plugins)
- See also [enchantjs.com](http://enchantjs.com)

Design
------

- Compact
- Standalone
- Graphics Object Tree
- Event Driven

Platform
--------

- Chrome
- Safari
- Firefox
- IE9 
- iOS
- Android 2.1+

License
-------

MIT License

Usage
-----
```html
<script src='./enchant.js'></script>
<script>
    enchant();
    window.onload = function(){
        var game = new Game(320, 320); 

        var label = new Label('Hello, enchant.js!');
        game.rootScene.addChild(label);

        game.start();
    }
</script>
```

More examples and references: [enchantjs.com](http://enchantjs.com)

How to build
------------

Source code is divided into class files (dev/src/*.js). These files include multi-language comments. You can build enchant.js with 'grunt' command from these files.
If you want to send a pull request or join development enchant.js, please edit files under dev/src, use this build tool and commit the built work tree.

To setup grunt.js (build tool for node.js) as npm package, type:

    npm install -g grunt-cli
    npm install

You additionally need [phantomjs](http://code.google.com/p/phantomjs/) to run qunit test in grunt.js.

Build Tasks
-----------

- `grunt` do default tasks (jshint concat uglify qunit exec:lang)
- `grunt watch` watch dev/src/*.js and exec `grunt concat uglify lang` when something is modified
- `grunt jshint` check sourcecode in dev/classes/*.js with jshint
- `grunt concat` generate dev/enchant.js from dev/classes/*.js
- `grunt uglify` generate enchant.min.js from dev/enchant.js
- `grunt exec:lang` generate enchant.js (English comment only) from dev/enchant.js
- `grunt qunit` do qunit tests with phantomjs (headless browser)

If you wish to send your codes to github repos, don't forget to run `grunt` command before you commit your change!

How to contribute
-----------------
If you found issues or improved codes, please write issues or send pull request to `wise9/enchant.js:develop`.
