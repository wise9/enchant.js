module.exports = (grunt) ->

  jsdoc_command = (scripts, template, destination) ->
    [
      'java -jar jsdoc-toolkit/jsrun.jar jsdoc-toolkit/app/run.js'
      scripts.join ' '
      '-t=' + template
      '-d=' + destination
    ].join ' '

  grunt.registerTask 'jsdoc-core', '(internal) Generate jsdoc reference.', (lang) ->
    grunt.task.run 'exec:whatever:' + jsdoc_command [
      'lang/' + lang + '/enchant.js'
    ], 'doc/template', 'doc/core/' + lang + '/'

  grunt.registerTask 'jsdoc-plugins', '(internal) Generate jsdoc reference.', (lang) ->
    grunt.task.run 'exec:whatever:' + jsdoc_command [
      'lang/' + lang + '/enchant.js'
      'lang/' + lang + '/plugins/*.js'
    ], 'doc/template', 'doc/plugins/' + lang + '/'

  grunt.registerTask 'doc', 'Generate jsdoc reference.', ->
    [ 'en', 'ja', 'de' ].forEach (lang) ->
      grunt.task.run 'jsdoc-core:' + lang, 'jsdoc-plugins:' + lang
