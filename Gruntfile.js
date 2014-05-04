/*global module */
module.exports = function (grunt) {
    "use strict";
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        meta : {
            bin : {
                lintFiles : ['Gruntfile.js', 'dist/matchers.js', 'config/*.js', 'test/*.js']
            }
        },
        jslint: {
            all : {
                src: '<%= meta.bin.lintFiles %>',
                options: { }
            }
        },
        karma: {
            options: {
                singleRun: true,
                browsers: ['PhantomJS'],
                reporters: 'dots'
            },
            stable: {
                configFile: 'config/karma.stable.conf.js'
            },
            unstable: {
                configFile: 'config/karma.unstable.conf.js'
            }
        },
        yuidoc: {
            compile: {
                name: '<%= pkg.name %>',
                description: '<%= pkg.description %>',
                version: '<%= pkg.version %>',
                url: '<%= pkg.homepage %>',
                options: {
                    paths: ['dist/', 'test/'],
//                    themedir: 'path/to/custom/theme/',
                    outdir: 'docs/'
                }
            }
        },
        watch: {
            files: '<%= meta.bin.lintFiles %>',
            tasks: ['jslint', 'karma:stable', 'yuidoc', 'notify:watch']
        },
        notify: {
            watch: {
                options: {
                    title: 'Task Complete',  // optional
                    message: 'Finish Linting, Running Tests & Building Documentation' //required
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-notify');
    grunt.loadNpmTasks('grunt-jslint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-yuidoc');
    grunt.loadNpmTasks('grunt-karma');
    grunt.registerTask('test', ['jslint', 'karma:stable', 'karma:unstable']);
    grunt.registerTask('doc', ['yuidoc']);
    grunt.registerTask('default', ['jslint', 'karma:stable', 'karma:unstable']);

};
