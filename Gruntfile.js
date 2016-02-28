var path = require('path');
var execFile = require('child_process').execFile;
var packagejson = require('./package.json');
try {
    var electron = require('electron-prebuilt');
} catch (e) {}


module.exports = function(grunt) {
    require('load-grunt-tasks')(grunt);
    var target = grunt.option('target') || 'development';

    var BASENAME = 'Throw';
    var arch = grunt.option('arch') ? grunt.option('arch') : 'ia32';

    var platform = grunt.option('platform') ? grunt.option('platform') : process.platform;

    var env = process.env;
    env.NODE_ENV = 'development';

    grunt.initConfig({
        electron: {
            release: {
                options: {
                    name: BASENAME,
                    dir: 'build/',
                    out: 'dist',
                    version: packagejson['electron-version'],
                    platform: platform,
                    arch: arch,
                    asar: false
                }
            }
        },
        copy: {
            build: {
                files: [{
                    expand: true,
                    cwd: '.',
                    src: ['package.json', 'index.html'],
                    dest: 'build/'
                }, {
                    expand: true,
                    cwd: 'images/',
                    src: ['**/*'],
                    dest: 'build/images/'
                }]
            },
            game: {
                files: [{
                    expand: true,
                    cwd: 'game/',
                    src: ['**/*'],
                    dest: 'build/game/'
                }]
            }
        },
        sass: {
            options: {
                outputStyle: 'compressed',
                sourceMapEmbed: true
            },
            dist: {
                files: {
                    'build/css/main.css': 'styles/src/main.scss',
                    'build/css/vender.css': 'styles/vender/**/*.css'
                }
            }
        },
        babel: {
            options: {
                sourceMap: 'inline',
                presets: ['react', 'es2015', 'stage-0'],
                compact: true,
                comments: false
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: 'src/',
                    src: ['**/*.js'],
                    dest: 'build/js'
                }]
            }
        },
        shell: {
            electron: {
                command: electron + ' . ' + (grunt.option('dev') ? '--dev' : ''),
                options: {
                    async: true,
                    execOptions: {
                        cwd: 'build',
                        env: env
                    }
                }
            }
        },
        'npm-command': {
            release: {
                options: {
                    cwd: 'build/',
                    args: ['--production', '--no-optional']
                }
            }
        },
        clean: {
            build: ['build/'],
            dist: ['dist/'],
            release: ['release/']
        },
        watchChokidar: {
            options: {
                spawn: true
            },
            livereload: {
                options: {
                    livereload: 27871
                },
                files: ['build/**/*', '!build/game/**/*']
            },
            js: {
                files: ['src/**/*.js'],
                tasks: ['newer:babel']
            },
            sass: {
                files: ['styles/**/*.scss'],
                tasks: ['sass']
            },
            copy: {
                files: ['images/*', 'index.html', 'fonts/*'],
                tasks: ['newer:copy:dev']
            }
        }
    });

    grunt.registerTask('default', ['newer:babel', 'sass', 'newer:copy:build', 'shell:electron', 'watchChokidar']);

    grunt.registerTask('run', ['newer:babel', 'shell:electron', 'watchChokidar']);

    grunt.registerTask('clean:all', ['clean:build', 'clean:dist', 'clean:release']);

    grunt.registerTask('release', ['clean:build', 'babel', 'sass', 'copy:build', 'npm-command:release', 'electron:release']);

    process.on('SIGINT', () => {
        grunt.task.run(['shell:electron:kill'])
        process.exit(1)
    })
}