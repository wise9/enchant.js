# v0.6.0

- features
    - WebAudioAPI support
    - DOM/Canvas Compatible rendering
    - Object Collection
    - Animation Engine (tl.enchant.js is included to core)
- license
    - Eliminated GPLv3 license
- Release Note
    - http://wise9.jp/archives/8077 (Japanese)

From v0.6.0, documents were excluded from repository. see 'doc/readme.md'.

# v0.6.0-pre
- features
    - Canvas based rendering support
    - enchant.Game -> enchant.Core (renamed)

# v0.5.3

# v0.5.2

- features
    - add enchant.ENV.KEY_BIND_TABLE and PREVENT_DEFAULT_KEY_CODES (#74, #88)
- bugfix
    - Handle mouse event even if touch event is exists (#102)
    - Sprite.opacity in CanvasGroup (#99)
    - Sprite.visible in CanvasGroup (#96)
    - Group.scale in CanvasGroup (#98)
    - drawing in CanvasGroup (#94)
    - and many other bug fixes
- plugins
    - tl.enchant.js
        - added time based animation
        - added lazy event listener initialization for performance gain
        - added enchant.Easing.SWING
        - bugfix about Timeline#pause, resume (#87)
    - mmd.gl.enchant.js
        - performance improved
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
