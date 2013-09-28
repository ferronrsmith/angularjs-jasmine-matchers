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
        watch: {
            files: '<%= meta.bin.lintFiles %>',
            tasks: ['jslint', 'karma:stable']
        }
    });

    grunt.loadNpmTasks('grunt-jslint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-karma');
    grunt.registerTask('test', ['jslint', 'karma:stable']);
    grunt.registerTask('default', ['jslint', 'karma:stable']);

};
