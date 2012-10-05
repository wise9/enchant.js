enchant.js
==========

<img src="http://github.com/wise9/enchant.js/raw/master/enchant.png" width="320" height="320">

JavaScript Game Engine

Download
--------

- [enchant.js](http://github.com/wise9/enchant.js/raw/master/enchant.js)
- [enchant.min.js](http://github.com/wise9/enchant.js/raw/master/enchant.min.js) (compressed)


Documentation
-------------

- See [enchantjs.com](http://enchantjs.com)

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

Dual licensed under the MIT or GPL Version 3 licenses

Usage
-----
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

More examples and references: [enchantjs.com](http://enchantjs.com)

How to build
------------

Source code is divided into class files (dev/src/*.js). These files include multi-language comments. You can build enchant.js with 'grunt' command from these files.
If you want to send a pull request or join development enchant.js, please edit files under dev/src, use this build tool and commit the built work tree.

To setup grunt.js (build tool for node.js) as npm package, type:

    npm install grunt grunt-exec -g

You need npm to install grunt, and [phantomjs](http://code.google.com/p/phantomjs/) to run qunit test in grunt.js.

Build Tasks
-----------

- `grunt` do default tasks (lint concat min qunit exec:lang)
- `grunt watch` watch dev/src/*.js and exec `grunt concat min lang` when something is modified
- `grunt lint` check sourcecode in dev/classes/*.js with jshint
- `grunt concat` generate dev/enchant.js from dev/classes/*.js
- `grunt min` generate enchant.min.js from dev/enchant.js
- `grunt exec:lang` generate enchant.js (English comment only) from dev/enchant.js
- `grunt qunit` do qunit tests with phantomjs (headless browser)

If you wish to send your codes to github repos, don't forget to run `grunt` command before you commit your change!

How to contribute
-----------------
If you found issues or improved codes, please write issues or send pull request to `wise9/enchant.js:develop`.
