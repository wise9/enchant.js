module.exports = (grunt) ->

  fs = require 'fs'
  http = require 'http'
  unzip = require 'unzip'

  download = (src, dest, callback) ->
    writeStream = fs.createWriteStream dest
    get = http.get src, (response) ->
      response.pipe writeStream

      writeStream.on 'close', ->
        callback null

      writeStream.on 'error', (err) ->
        callback err

    get.on 'error', (err) ->
      callback err

  extract = (path, dest, callback) ->
    readStream = fs.createReadStream path
    ext = unzip.Extract path: dest

    ext.on 'close', ->
      callback null

    ext.on 'error', (err) ->
      callback err

    readStream.pipe ext

  download_link = 'http://jsdoc-toolkit.googlecode.com/files/jsdoc_toolkit-2.4.0.zip'
  archive_name = 'jsdoc-toolkit.zip'
  extracted_directory_name = 'jsdoc_toolkit-2.4.0/'
  install_path = 'jsdoc-toolkit/'

  grunt.registerTask 'download-jsdoc-toolkit', '(internal) Download archive of jsdoc-toolkit.', ->
    done = @async()

    download download_link, archive_name, (err) ->
      if err
        grunt.log.warn 'download failed'
      else
        grunt.log.writeln 'zip downloaded'
      done !err

  grunt.registerTask 'extract-jsdoc-toolkit', '(internal) Extract archive of jsdoc-toolkit.', ->
    done = @async()

    extract archive_name, './', (err) ->
      if err
        grunt.log.warn 'extract failed'
      else
        grunt.log.writeln 'zip extracted'
      done !err

  grunt.registerTask 'finalize-jsdoc-toolkit', '(internal) Place jsdoc-toolkit into correct position.', ->
    grunt.file.delete './' + archive_name, force: true
    grunt.file.delete './' + extracted_directory_name, force: true

  grunt.registerTask 'install-jsdoc-toolkit', 'Install jsdoc-toolkit 2.4.0 into repository.', ->
    grunt.task.run [
      'download-jsdoc-toolkit',
      'extract-jsdoc-toolkit',
      'copy:' + extracted_directory_name + install_path + ':' + install_path,
      'finalize-jsdoc-toolkit'
    ]
