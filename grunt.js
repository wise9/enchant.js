/*global module:false*/

module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-exec');

    // Project configuration.
    grunt.initConfig({
            meta: {
                version: 'v0.6.0',
                banner: '/**\n\
 * enchant.js <%= meta.version %>\n\
 * http://enchantjs.com\n\
 * \n\
 * Copyright Ubiquitous Entertainment Inc.\n\
 * Released under MIT license.\n\
 */',
                min_banner: '/* enchant.js <%= meta.version %> http://enchantjs.com Copyright (c) Ubiquitous Entertainment Inc. Released Under MIT license. */'
            },
            lint: {
                core: ['dev/header.js', grunt.file.expand('dev/src/*.js').filter(function(file){ return !file.match(/_/); })],
                plugins: ['dev/header.js', 'dev/src/*.js', 'dev/plugins/*.js'],
                mixing: ['dev/header.js', grunt.file.expand('dev/src/*.js').filter(function(file){ return !file.match(/_/); }),'dev/plugins/mixing.enchant.js']
            },
            qunit: {
                files: ['tests/qunit/*/*.html']
            },
            concat: {
                dist: {
                    src: ['<banner:meta.banner>',
                        'dev/src/_intro.js',
                        'dev/src/header.js',
                        'dev/src/Class.js',
                        'dev/src/Env.js',
                        'dev/src/Event.js',
                        'dev/src/EventTarget.js',
                        'dev/src/Core.js',
                        'dev/src/Game.js',
                        'dev/src/Node.js',
                        'dev/src/Entity.js',
                        'dev/src/Sprite.js',
                        'dev/src/Label.js',
                        'dev/src/Map.js',
                        'dev/src/Group.js',
                        'dev/src/Matrix.js',
                        'dev/src/DetectColorManager.js',
                        'dev/src/DomManager.js',
                        'dev/src/DomLayer.js',
                        'dev/src/CanvasLayer.js',
                        'dev/src/Scene.js',
                        'dev/src/Surface.js',
                        'dev/src/Sound.js',

                        // animation feature
                        'dev/src/Easing.js',
                        'dev/src/ActionEventTarget.js',
                        'dev/src/Timeline.js',
                        'dev/src/Action.js',
                        'dev/src/ParallelAction.js',
                        'dev/src/Tween.js',
                        'dev/src/_outro.js'
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
                core: {
                    files: 'dev/src/*.js',
                    tasks: 'concat min'
                },
                plugins: {
                    files: [
                        'dev/src/*.js',
                        'dev/plugins/*.js',
                    ],
                    tasks: 'lint:core concat min qunit exec:lang'
                }
            },
            jshint: {
                options: {
                    curly: true,
                    eqeqeq: true,
                    immed: true,
                    latedef: true,
                    newcap: false,
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
                    webkitAudioContext: true,
                    DocumentFragment: true,
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
