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

SOURCE = File.read('dev/enchant.js')
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

task :default => [:lang, :minify]

task :create => RELEASES

task :bind do
    p ARGV.pop
end

task :lang do |t|
    Dir.glob(['./dev/enchant.js', './dev/plugins/*.js']) { |file|
        p file
        source = File.read(file)
        dest_en = file.gsub(/\/dev\//, '/')
        dest_ja = file.gsub(/\/dev\//, '/ja/')
        dest_de = file.gsub(/\/dev\//, '/de/')
        File.open(dest_en, 'w'){ |f|
            f << source.gsub(/^[\t \*]*\[lang\:en\]\n(.*?)[\t \*]*\[\/lang\]\n/m, "\\1").gsub(/^[\t \*]*\[lang\:ja\]\n(.*?)[\t \*]*\[\/lang\]\n/m, "").gsub(/^[\t \*]*\[lang\:de\]\n(.*?)[\t \*]*\[\/lang\]\n/m, "")
        }
        File.open(dest_ja, 'w'){ |f|
            f << source.gsub(/^[\t \*]*\[lang\:en\]\n(.*?)[\t \*]*\[\/lang\]\n/m, "").gsub(/^[\t \*]*\[lang\:ja\]\n(.*?)[\t \*]*\[\/lang\]\n/m, "\\1").gsub(/^[\t \*]*\[lang\:de\]\n(.*?)[\t \*]*\[\/lang\]\n/m, "")
        }
        File.open(dest_de, 'w'){ |f|
            f << source.gsub(/^[\t \*]*\[lang\:en\]\n(.*?)[\t \*]*\[\/lang\]\n/m, "").gsub(/^[\t \*]*\[lang\:ja\]\n(.*?)[\t \*]*\[\/lang\]\n/m, "").gsub(/^[\t \*]*\[lang\:de\]\n(.*?)[\t \*]*\[\/lang\]\n/m, "\\1")
        }
        print "source: #{file}\n"
        print "generated: #{dest_en}\n"
        print "generated: #{dest_ja}\n"
        print "generated: #{dest_de}\n"
    }
end

task :test do |t|
    Dir.glob('./examples/**/index.html') {|example|
        res = `phantomjs test-phantomjs.js #{example} | grep Error`
        print res
    }
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

task :doc do |t|
    sh 'java -jar jsdoc-toolkit/jsrun.jar jsdoc-toolkit/app/run.js ja/enchant.js -t=doc/template -d=doc/core/ja'
    sh 'java -jar jsdoc-toolkit/jsrun.jar jsdoc-toolkit/app/run.js enchant.js -t=doc/template -d=doc/core/en'
    sh 'java -jar jsdoc-toolkit/jsrun.jar jsdoc-toolkit/app/run.js de/enchant.js -t=doc/template -d=doc/core/de'
    sh 'java -jar jsdoc-toolkit/jsrun.jar jsdoc-toolkit/app/run.js ja/enchant.js ja/plugins/*.js -t=doc/template -d=doc/plugins/ja'
    sh 'java -jar jsdoc-toolkit/jsrun.jar jsdoc-toolkit/app/run.js enchant.js plugins/*.js -t=doc/template -d=doc/plugins/en'
    sh 'java -jar jsdoc-toolkit/jsrun.jar jsdoc-toolkit/app/run.js de/enchant.js de/plugins/*.js -t=doc/template -d=doc/plugins/de'
#    sh 'jsduck ja/enchant.js ja/plugins/*.enchant.js --output duck/ja';
#    sh 'jsduck enchant.js plugins/*.enchant.js --output duck/en';
end

file 'jsdoc-toolkit' do |t|
    zip_name = "#{t.name}.zip"
    File.open(zip_name, 'w') {|f|
        f << download('http://jsdoc-toolkit.googlecode.com/files/jsdoc_toolkit-2.4.0.zip')
    }
    sh "unzip #{zip_name}"
    sh "mv jsdoc_toolkit-2.4.0/#{t.name} #{t.name}"
    sh 'rm -rf jsdoc_toolkit-2.4.0'
    sh "rm #{zip_name}"
end

def download(path)
  uri = URI.parse(path)
  http = Net::HTTP.new(uri.host, uri.port)
  request = Net::HTTP::Get.new(uri.request_uri)
  http.request(request).body
end

file 'sound.swf' do |t|
    sh 'mxmlc sound.as'
end
