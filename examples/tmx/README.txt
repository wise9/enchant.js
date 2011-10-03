INFORMATION
-----------

This is an example project to show TMX loader plugin. It shows some of the
features included in the plugin like advanced collision types, entities
binding and animation (the red and blue shapes are there on purpose, take a
look to the code in "game.js").

Feel free to edit the map using Tiled Map Editor (http://www.mapeditor.org).
The file is "map1.tmx", under "maps" folder.

If you are using Firefox you should be able to test it just opening
"index.html" with it, but other browsers like Chrome and Opera are a little bit
trickier (don't blame me, it's just their don't-use-AJAX-with-local-files
policy). "SimpleWebServer.jar", is, as its name says, a minimal development web
server that will let you try the example locally. Use "server.bat" (Windows) or
"server.sh" (Linux) to run it and the type "http://localhost" in the address
bar of your browser (sorry for Mac users but I really don't know the script for
it - "java -jar SimpleWebServer.jar" with admin privileges should do it.).

Please note how the elevated zone borders block your way - not the whole tile,
but only its border. Also, take a look at how the entities are placed in the
map and see the plugin in-code documentation and the tileset info to learn how
to set up animations.

Any feedback or question is welcome via my user "javidcf" at Github.

