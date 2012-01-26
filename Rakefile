# 'rake' コマンドを実行することで、dev/enchant.dev.js から、
# コメント翻訳ファイル enchant.js, enchant.ja.js を生成し、また
# minified ファイル enchant.min.js を生成します。
# 
# rake docs

require 'rubygems'
require 'rake'
require 'rake/clean'
require 'net/http'

RELEASES = ['enchant.js', 'enchant.min.js', 'doc/index.html', 'sound.swf']
CLEAN << 'enchant.js' << 'enchant.ja.js' << 'enchant.min.js' << 'doc/index.html'

SOURCE = File.read('dev/enchant.dev.js')
VER = SOURCE[/enchant\.js\s+(v\d+\.\d+\.\d+)/, 1]

Copyright = <<EOS
/*
enchant.js #{VER}
Copyright (c) Ubiquitous Entertainment Inc.
Dual licensed under the MIT or GPL Version 3 licenses
http://www.opensource.org/licenses/mit-license.php
http://www.gnu.org/licenses/gpl-3.0.html
*/
EOS

task :default => [:clean, :lang, :minify]

task :create => RELEASES

task :lang => ['enchant.js', 'enchant.ja.js']

task :bind do
    p ARGV.pop
end

file 'enchant.js' => ['dev/enchant.dev.js'] do |t|
    File.open('enchant.js', 'w'){ |f|
        f << SOURCE.gsub(/\[lang\:en\]\n(.*?)\[\/lang\]\n/m, "\\1").gsub(/\[lang\:ja\]\n(.*?)\[\/lang\]\n/m, "")  }
    print "generated: enchant.js\n"
end


file 'enchant.ja.js' => ['dev/enchant.dev.js'] do |t|
    File.open('enchant.ja.js', 'w'){ |f|
        f << SOURCE.gsub(/\[lang\:en\]\n(.*?)\[\/lang\]\n/m, "").gsub(/\[lang\:ja\]\n(.*?)\[\/lang\]\n/m, "\\1")
    }
    print "generated: enchant.ja.js\n"
end

task :test do |t|
  Dir.glob('./examples/**/index.html') {|example|
    res = `phantomjs test-phantomjs.js #{example} | grep Error`
    print res
  }
end

task :doc => ['doc/index.html'] do |t|
   print 'rm -r doc/index.html'
  `rm -r doc/index.html`
end

task :minify => ['enchant.min.js']

file 'enchant.min.js' => ['enchant.js'] do |t|
	print "generated: #{t.name} ..";
	File.open(t.name, 'w') {|f|
		uri = URI.parse('http://closure-compiler.appspot.com/compile')
		req = Net::HTTP::Post.new(uri.request_uri)
		req.set_form_data({
			'js_code'           => SOURCE,
			'compilation_level' => 'SIMPLE_OPTIMIZATIONS',
			'output_format'     => 'text',
			'output_info'       => 'compiled_code'
		})
		f << Net::HTTP.start(uri.host, uri.port) {|http| Copyright + http.request(req).body }
  }
	print "done\n"
end

file ['doc/ja/index.html','doc/en/index.html'] do |t|
  sh 'jsdoc -d=doc/ja -t=doc/template enchant.js'
  sh 'jsdoc -d=doc/en -t=doc/template enchant.ja.js'
end

file 'sound.swf' do |t|
  sh 'mxmlc sound.as'
end
