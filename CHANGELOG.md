# v0.8.2

- feature
    - add ANIMATION_END event (thx @bytehala)  
        Sprite dispatches "ANIMATION_END" event when frame animation ended
- bugfix
    - bugfix about Sprite#frame to setting same frame sequence (thx @bytehala)
    - bugfix about "Touch to Start" scene in iOS
    - bugfix about Node#\_updateCoordinate
    - bugfix about Core#keyunbind
    - bugfix about Core#load

# v0.8.1

- feature
    - add enchant.ENV.BROWSER
    - default value of enchant.ENV.SOUND_ENABLED_ON_MOBILE_SAFARI became true  
        WebAudio API is available in iOS6+
    - enchant.Sound.load callback became optional (#224)
    - enchant.Sprite#frame duplicates assigned Array (#202)
    - support newer interface of WebAudio API (thx @kumabook)
    - improved API documents (thx @Crowbeak)
- bugfix
    - improved behavior of enchant.Deferred chaining
    - detect Internet Explorer 11 correctly (#256)
    - bugfix about enchant.Timeline#next (#242) (thx @xy124)  
        In rare case, it failed to dispatch "actionend" event
    - bugfix about enchant.DOMSound.load on Firefox (#235)  
        Firefox dispatches "canplaythrough" event more than once

# v0.8.0

- features
    - add WebAudioSound#currentTime
    - add some classes about button input detection (feature/input)
    - some fixes for supporting Nintendo Web Framework
- bugfix
    - bugfix about WebAudioSound#duration (#222)

# v0.7.1

# v0.7.0

- features
    - add Entity#intersectStrict (feature/boundingRect #166)
    - add Deferred class
    - add LoadingScene class
    - allows preload alias (feature/asset-name-alias #193)
    - Core can be resize after initialized
    - add Core resize event
    - improved Group#addChild, insertBefore
- bugfix
    - improved some DOM bugs on Internet Explorer
    - some fixes

# v0.6.3

# v0.6.2

- features
    - support requestAnimationFrame API (feature/requestAnimationFrame, #131)
    - better keybind (feature/better-keybind, #148)
    - improved performance on Android (feature/lazy-scene, #145)

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
