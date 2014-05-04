/*global module */
module.exports = function (config) {
    "use strict";
    config.set({
        basePath: '../',
        frameworks: ['jasmine'],
        files: [
            'lib/angular-unstable-latest.js',
            'lib/angular-unstable-mocks.js',
            'lib/datespy.min.js',
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
