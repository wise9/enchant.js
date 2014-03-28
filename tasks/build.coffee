module.exports = (grunt) ->

  grunt.registerTask 'build', 'Create build directory.', ->
    grunt.task.run 'copy:lang/en/:build/', 'exec:whatever:git checkout build/readme.md'
