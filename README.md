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

How to build?
------------

[ここからのセクションは、enchant.js の開発に参加する人向けのものです。]

ソースコードは、クラスファイルに分割されています (deb/src/*.js) 。この中には多言語対応のコメントが含まれており、このファイル群から `grunt` コマンドを使って enchant.js をビルドすることができます。
enchant.js の開発に参加したり、pull request を送る場合は、dev/src 以下のファイルを編集し、ビルドした状態のワークツリーををコミットしてください。

node.js で書かれたビルドツリー grunt.js は、以下のコマンドでインストールできます (npm が必要です)。また、qunit テストを grunt.js で実行するためには、 [phantomjs](http://code.google.com/p/phantomjs/) が必要です。

    npm install grunt grunt-exec -g

Source code is divided into class files (dev/src/*.js). They include multi-language comments. You can build enchant.js with 'grunt' command from these files.
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

