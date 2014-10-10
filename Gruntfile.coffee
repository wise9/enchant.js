module.exports = (grunt) ->
  # Project configuration.
  grunt.initConfig
      pkg: grunt.file.readJSON 'package.json'
      jshint:
        core: [ 'dev/src/*.js', '!dev/src/_*.js' ]
        plugins: [ 'dev/src/*.js', '!dev/src/_*.js', 'dev/plugins/*.js' ]
        collada: [ 'dev/plugins/collada.gl.enchant.js' ]
        mixing: [ 'dev/src/*.js', '!dev/src/_*.js',
          'dev/plugins/mixing.enchant.js' ]
        options:
          curly: true
          eqeqeq: true
          immed: true
          latedef: true
          newcap: false
          noarg: true
          sub: true
          undef: true
          boss: true
          eqnull: true
          browser: true
          proto: true
          multistr: true
          globals:
            enchant: true
            webkitAudioContext: true
            DocumentFragment: true
            WebGLBuffer: true
            gl: true
            Ammo: true
            vec2: true
            vec3: true
            vec4: true
            mat2: true
            mat3: true
            mat4: true
            quat4: true

      concat:
        dist:
          src: [
            'dev/src/_intro.js'
            'dev/src/header.js'
            'dev/src/Class.js'
            'dev/src/Env.js'
            'dev/src/Event.js'
            'dev/src/EventTarget.js'
            'dev/src/Core.js'
            'dev/src/Game.js'
            'dev/src/InputManager.js'
            'dev/src/InputSource.js'
            'dev/src/BinaryInputManager.js'
            'dev/src/BinaryInputSource.js'
            'dev/src/KeyboardInputManager.js'
            'dev/src/KeyboardInputSource.js'
            'dev/src/Node.js'
            'dev/src/Entity.js'
            'dev/src/Sprite.js'
            'dev/src/Label.js'
            'dev/src/Map.js'
            'dev/src/Group.js'
            'dev/src/Matrix.js'
            'dev/src/DetectColorManager.js'
            'dev/src/DomManager.js'
            'dev/src/DomLayer.js'
            'dev/src/CanvasLayer.js'
            'dev/src/CanvasRenderer.js'
            'dev/src/Scene.js'
            'dev/src/LoadingScene.js'
            'dev/src/CanvasScene.js'
            'dev/src/DOMScene.js'
            'dev/src/Surface.js'

            'dev/src/Deferred.js'

            # sound support
            'dev/src/DOMSound.js'
            'dev/src/WebAudioSound.js'
            'dev/src/Sound.js'

            # animation feature
            'dev/src/Easing.js'
            'dev/src/ActionEventTarget.js'
            'dev/src/Timeline.js'
            'dev/src/Action.js'
            'dev/src/ParallelAction.js'
            'dev/src/Tween.js'

            'dev/src/_outro.js'
          ]
          dest: 'dev/enchant.js'
          options:
            process: true
            banner: """
/**
 * <%= pkg.name %> v<%= pkg.version %>
 * <%= pkg.homepage %>
 *
 * Copyright Ubiquitous Entertainment Inc.
 * Released under the MIT license.
 */\n\n
"""

      uglify:
        dist:
          files:
            'enchant.min.js': [ 'dev/enchant.js' ]
          options:
            banner: "/* <%= pkg.name %> v<%= pkg.version %> <%= pkg.homepage %> Copyright (c) Ubiquitous Entertainment Inc. Released Under the MIT license. */\n"

      qunit:
        files: [ 'tests/qunit/*/*.html' ]

      mocha:
        all: 'tests/mocha/*.html'
        core: 'test/mocha/enchant.js/*.html'

      exec:
        whatever:
          cmd: (command) -> command

      watch:
        core:
          files: [ 'dev/src/*.js' ]
          tasks: [ 'concat', 'uglify' ]
        plugins:
          files: [ 'dev/src/*.js', 'dev/plugins/*.js' ]
          tasks: [ 'jshint', 'concat', 'uglify', 'exec:lang' ]

  grunt.loadNpmTasks 'grunt-contrib-jshint'
  grunt.loadNpmTasks 'grunt-contrib-concat'
  grunt.loadNpmTasks 'grunt-contrib-uglify'
  grunt.loadNpmTasks 'grunt-contrib-qunit'
  grunt.loadNpmTasks 'grunt-contrib-watch'
  grunt.loadNpmTasks 'grunt-mocha'
  grunt.loadNpmTasks 'grunt-exec'
  grunt.loadTasks 'tasks/'

  # Default task.
  grunt.registerTask 'default', [ 'jshint:core', 'concat', 'uglify', 'qunit', 'lang:en', 'lang:ja', 'lang:de', 'build' ]
