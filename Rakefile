require 'rubygems'
require 'rake'
require 'rake/clean'
require 'net/http'

RELEASES = ['enchant.js', 'enchant.min.js', 'doc/index.html']
CLEAN << 'enchant.min.js' << 'doc/index.html'

SOURCE = File.read('enchant.js')
VERSION = SOURCE[/enchant\.js\s+(v\d+\.\d+\.\d+)/, 1]
Copyright = <<EOS
/*
enchant.js #{VERSION}
Copyright (c) Ubiquitous Entertainment Inc.
Dual licensed under the MIT or GPL Version 3 licenses
http://www.opensource.org/licenses/mit-license.php
http://www.gnu.org/licenses/gpl-3.0.html
*/
EOS

task :default => [:test]

task :create => RELEASES

task :test do |t|
  Dir.glob('./examples/**/index.html') {|example|
    res = `phantomjs test-phantomjs.js #{example} | grep Error`
    print res
  }
end

task :doc => ['doc/index.html'] do |t|
end

file 'enchant.min.js' => ['enchant.js'] do |t|
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
end

file 'doc/index.html' do |t|
  sh 'jsdoc -d=doc -t=doc/template enchant.js'
end
