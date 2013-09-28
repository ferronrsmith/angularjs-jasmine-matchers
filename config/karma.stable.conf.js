/*global module */
module.exports = function (config) {
    "use strict";
    config.set({
        basePath: '../',
        frameworks: ['jasmine'],
        files: [
            'lib/angular-stable-latest.js',
            'lib/angular-stable-mocks.js',
            'dist/*.js',
            'test/*.js'
        ],
        autoWatch: true,
        browsers: ['Chrome'],
        junitReporter: {
            outputFile: 'test_out/unit.xml',
            suite: 'unit'
        }
    });
};
