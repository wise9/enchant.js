module.exports = (grunt) ->

  grunt.registerTask 'copy', 'Copy file or directory recursively.', (from, to) ->
    if grunt.file.exists to
      grunt.file.delete to, force: true

    grunt.file.recurse from, (abspath, rootdir, subdir, filename) ->
      path = (subdir || '') + '/' + filename
      grunt.file.copy from + path, to + path
