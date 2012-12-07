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

task :default => [:lang]

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

task :mbcheck => ['enchant.js'] do |t|
    linenum = 0;
    File.read('enchant.js').each_line do |line|
        linenum += 1;
        if line.match(/[^\x01-\x7E]/)
            print "#{linenum}: #{line}"
        end
    end
end

task :doc do |t|
    sh 'java -jar jsdoc-toolkit/jsrun.jar jsdoc-toolkit/app/run.js ja/enchant.js -t=doc/template -d=doc/core/ja'
    sh 'java -jar jsdoc-toolkit/jsrun.jar jsdoc-toolkit/app/run.js enchant.js -t=doc/template -d=doc/core/en'
    sh 'java -jar jsdoc-toolkit/jsrun.jar jsdoc-toolkit/app/run.js de/enchant.js -t=doc/template -d=doc/core/de'
    sh 'java -jar jsdoc-toolkit/jsrun.jar jsdoc-toolkit/app/run.js ja/enchant.js ja/plugins/*.js -t=doc/template -d=doc/plugins/ja'
    sh 'java -jar jsdoc-toolkit/jsrun.jar jsdoc-toolkit/app/run.js enchant.js plugins/*.js -t=doc/template -d=doc/plugins/en'
    sh 'java -jar jsdoc-toolkit/jsrun.jar jsdoc-toolkit/app/run.js de/enchant.js de/plugins/*.js -t=doc/template -d=doc/plugins/de'
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
