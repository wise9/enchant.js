module.exports = (grunt) ->

  make_repl = (lang) ->
    new RegExp('^[\\*\\s]*\\[lang:' + lang + '\\]\\n([\\s\\S]*?)^[\\*\\s]*\\[\\/lang\\]\\n', 'mg')

  grunt.registerTask 'lang', 'Generate localized files.', (lang, path) ->
    lang = lang || 'en'
    path = path || 'lang/' + lang

    grunt.file.mkdir 'lang/' + lang + '/plugins'

    repl_en = make_repl 'en'
    repl_ja = make_repl 'ja'
    repl_de = make_repl 'de'

    (grunt.file.expand 'dev/{plugins\/,}*.js').forEach (source) ->
      dist = source.toString().replace /dev\//, './lang/' + lang + '/'

      grunt.file.write dist, (grunt.file.read source).toString()
        .replace(repl_en, (if lang == 'en' then '$1' else ''))
        .replace(repl_ja, (if lang == 'ja' then '$1' else ''))
        .replace(repl_de, (if lang == 'de' then '$1' else ''))

      grunt.log.writeln source, '->', dist
