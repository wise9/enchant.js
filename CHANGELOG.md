
# v0.5.2

- features
    -
- bugfix
    -
- plugins
    - tl.enchant.js
        - added time based animation
        - added lazy event listener initialization for performance gain
    - gl.enchant.js
    - avatar.enchant.js
        - bugfix about namespace (issue #90)

# v0.5.1

- features 
    - Rearrange unit tests
    - Introduce grunt.js and separate source file into individual class file.
      Now you can build enchant.js with "grunt" command.
      See README.md if you don't have grunt.js.
    - Add Map#checkTile
    - Add EventTarget#on (synonym for addEventListener)
- bugfix
    - Entity#intersect, #within between entities in different groups (issue #77)
    - Remove zerodiv on calculating background-position (issue #70)
    - Add <area> tag for ENV.USE_DEFAULT_EVENT_TAGS
    - Sound support for iPhone while using nineleap.enchant.js
    - Fix plugin namespace structure in avatar.enchant.js
    - Remove Math.round from tween method in tl.enchant.js (enables to use tl.enchant.js with 3D context)
    - Fix source code style to pass jshint

# v0.5.0

- features
- bugfix
