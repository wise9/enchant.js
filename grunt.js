/*global module:false*/
module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        meta: {
            version: 'v0.5.1',
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
            files: ['dev/header.js', 'dev/classes/*.js']
        },
        qunit: {
            files: ['tests/*/index.html']
        },
        concat: {
            dist: {
                src: ['<banner:meta.banner>',
                    'dev/header.js',
                    'dev/classes/Class.js',
                    'dev/classes/Env.js',
                    'dev/classes/Event.js',
                    'dev/classes/EventTarget.js',
                    'dev/classes/Game.js',
                    'dev/classes/Node.js',
                    'dev/classes/Entity.js',
                    'dev/classes/Sprite.js',
                    'dev/classes/Label.js',
                    'dev/classes/Map.js',
                    'dev/classes/Group.js',
                    'dev/classes/RGroup.js',
                    'dev/classes/CanvasGroup.js',
                    'dev/classes/Scene.js',
                    'dev/classes/Surface.js',
                    'dev/classes/Sound.js'
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
            files: '<config:concat.dist.src>',
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
                browser: true
            },
            globals: {
                enchant: true
            }
        },
        uglify: {}
    });

    // Default task.
    grunt.registerTask('default', 'qunit concat min lint');
};
