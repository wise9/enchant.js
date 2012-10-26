/*global module:false*/

module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-exec');

    // Project configuration.
    grunt.initConfig({
            meta: {
                version: 'v0.5.2',
                banner: '/**\n\
 * enchant.js <%= meta.version %>\n\
 *\n\
 * Copyright (c) Ubiquitous Entertainment Inc.\n\
 * Dual licensed under the MIT or GPL Version 3 licenses\n\
 *\n\
 * Permission is hereby granted, free of charge, to any person obtaining a copy\n\
 * of this software and associated documentation files (the "Software"), to deal\n\
 * in the Software without restriction, including without limitation the rights\n\
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell\n\
 * copies of the Software, and to permit persons to whom the Software is\n\
 * furnished to do so, subject to the following conditions:\n\
 *\n\
 * The above copyright notice and this permission notice shall be included in\n\
 * all copies or substantial portions of the Software.\n\
 *\n\
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\n\
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\n\
 * FITNESS FOR A PARTICULAR PURPOSE AND NON-INFRINGEMENT. IN NO EVENT SHALL THE\n\
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\n\
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\n\
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN\n\
 * THE SOFTWARE.\n\
 *\n\
 * This program is free software: you can redistribute it and/or modify\n\
 * it under the terms of the GNU General Public License as published by\n\
 * the Free Software Foundation, either version 3 of the License, or\n\
 * (at your option) any later version.\n\
 *\n\
 * This program is distributed in the hope that it will be useful,\n\
 * but WITHOUT ANY WARRANTY; without even the implied warranty of\n\
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the\n\
 * GNU General Public License for more details.\n\
 *\n\
 * You should have received a copy of the GNU General Public License\n\
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.\n\
 */',
                min_banner: '/* enchant.js <%= meta.version %> http://enchantjs.com Licensed under MIT or GPLv3. (c) Ubiquitous Entertainment Inc. */'
            },
            lint: {
                core: ['dev/header.js', 'dev/src/*.js'],
                plugins: ['dev/header.js', 'dev/src/*.js', 'dev/plugins/*.js']
            },
            qunit: {
                files: ['tests/qunit/*/*.html']
            },
            concat: {
                dist: {
                    src: ['<banner:meta.banner>',
                        'dev/src/_header.js',
                        'dev/src/Class.js',
                        'dev/src/Env.js',
                        'dev/src/Event.js',
                        'dev/src/EventTarget.js',
                        'dev/src/Game.js',
                        'dev/src/Node.js',
                        'dev/src/Entity.js',
                        'dev/src/Sprite.js',
                        'dev/src/Label.js',
                        'dev/src/Map.js',
                        'dev/src/Group.js',
                        'dev/src/RGroup.js',
                        'dev/src/CanvasGroup.js',
                        'dev/src/CanvasScene.js',
                        'dev/src/Scene.js',
                        'dev/src/Surface.js',
                        'dev/src/Sound.js'
                    ],
                    dest: 'dev/enchant.js'
                }
            },
            min: {
                dist: {
                    src: ['<banner:meta.min_banner>', 'dev/enchant.js'],
                    dest: 'enchant.min.js'
                }
            },
            watch: {
                files: 'dev/src/*.js',
                tasks: 'concat min'
            },
            jshint: {
                options: {
                    curly: true,
                    eqeqeq: true,
                    immed: true,
                    latedef: true,
                    newcap: true,
                    noarg: true,
                    sub: true,
                    undef: true,
                    boss: true,
                    eqnull: true,
                    browser: true,
                    proto: true,
                    multistr: true
                },
                globals: {
                    enchant: true,
                    WebGLBuffer: true,
                    gl: true,
                    Ammo: true,
                    vec2: true,
                    vec3: true,
                    vec4: true,
                    mat2: true,
                    mat3: true,
                    mat4: true,
                    quat4: true
                }
            },
            exec: {
                lang: {
                    command: 'rake lang'
                },
                doc: {
                    command: 'rake doc'
                }
            }
        }
    )
    ;

// Default task.
    grunt.registerTask('default', 'lint:core concat min qunit exec:lang');
}
;
