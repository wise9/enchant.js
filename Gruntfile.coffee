glob = require 'glob'
module.exports = (grunt) ->
  # Project configuration.
  grunt.initConfig
      pkg: grunt.file.readJSON 'package.json'

      jshint:
        core: ['dev/src/*.js', '!dev/src/_*.js']
        plugins: ['dev/src/*.js', '!dev/src/_*.js', 'dev/plugins/*.js']
        mixing: ['dev/src/*.js', '!dev/src/_*.js',
          'dev/plugins/mixing.enchant.js']
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
            'dev/src/Scene.js'
            'dev/src/CanvasScene.js'
            'dev/src/DOMScene.js'
            'dev/src/Surface.js'

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
            'enchant.min.js': ['dev/enchant.js']
          options:
            banner: "/* <%= pkg.name %> v<%= pkg.version %> <%= pkg.homepage %> Copyright (c) Ubiquitous Entertainment Inc. Released Under the MIT license. */\n"

      qunit:
        files: ['tests/qunit/*/*.html']

      exec:
        lang:
          command: 'rake lang'
        doc:
          command: 'rake doc'



      watch:
        core:
          files: ['dev/src/*.js']
          tasks: ['concat', 'uglify']
        plugins:
          files: ['dev/src/*.js', 'dev/plugins/*.js']
          tasks: ['jshint', 'concat', 'uglify', 'exec:lang']

  grunt.loadNpmTasks 'grunt-contrib-jshint'
  grunt.loadNpmTasks 'grunt-contrib-concat'
  grunt.loadNpmTasks 'grunt-contrib-uglify'
  grunt.loadNpmTasks 'grunt-contrib-qunit'
  grunt.loadNpmTasks 'grunt-exec'

  # Default task.
  grunt.registerTask 'default', [
    'jshint:core', 'concat', 'uglify', 'qunit', 'exec:lang']

  grunt.registerTask 'lang', 'Make lang file.', ()->
    grunt.log.writeln 'processing..'
    done = this.async;
    fs = require('fs')

    (glob.sync "dev/{plugins\/,}*.js").forEach (source)->
      dist_en = source.toString().replace(/dev\//, './')
      dist_ja = source.toString().replace(/dev\//, './ja/')
      dist_de = source.toString().replace(/dev\//, './de/')

      fs.writeFileSync dist_en, (fs.readFileSync source).toString()
      .replace(/^[\*\s]+\[lang:en\]\n(\s*[\s\S]*?\n)[\*\s]*\[\/lang\]\s*\n/mg, '$1')
      .replace(/^[\*\s]+\[lang:ja\]\n(\s*[\s\S]*?\n)[\*\s]*\[\/lang\]\s*\n/mg, '')
      .replace(/^[\*\s]+\[lang:de\]\n(\s*[\s\S]*?\n)[\*\s]*\[\/lang\]\s*\n/mg, '')

      fs.writeFileSync dist_ja, (fs.readFileSync source).toString()
      .replace(/^[\*\s]+\[lang:en\]\n(\s*[\s\S]*?\n)[\*\s]*\[\/lang\]\s*/mg, '')
      .replace(/^[\*\s]+\[lang:ja\]\n(\s*[\s\S]*?\n)[\*\s]*\[\/lang\]\s*/mg, '$1')
      .replace(/^[\*\s]+\[lang:de\]\n(\s*[\s\S]*?\n)[\*\s]*\[\/lang\]\s*/mg, '')

      fs.writeFileSync dist_de, (fs.readFileSync source).toString()
      .replace(/^[\*\s]+\[lang:en\]\n(\s*[\s\S]*?\n)[\*\s]*\[\/lang\]\s*\n/mg, '')
      .replace(/^[\*\s]+\[lang:ja\]\n(\s*[\s\S]*?\n)[\*\s]*\[\/lang\]\s*\n/mg, '')
      .replace(/^[\*\s]+\[lang:de\]\n(\s*[\s\S]*?\n)[\*\s]*\[\/lang\]\s*\n/mg, '$1')

      grunt.log.writeln(source)
    grunt.log.writeln 'processing..'
