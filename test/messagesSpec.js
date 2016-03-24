/*global jasmine, describe, xdescribe, it, iit, xit, expect, afterEach, beforeEach, angular, datespy, console */
/**
 * Created by ferron on 9/28/13.
 */


describe('Testing Custom Matchers Messages', function () {
    "use strict";

    var test, clock;
    beforeEach(function () {

        clock = angular.mock.$mockDate();
        // Create mock "expect" matchers, to extract only the failure message, without triggering test failures.
        function Matchers(actual, isNot) {
            this.actual = actual;
            this.isNot = isNot;
        }

        /*jslint nomen: true*/
        angular.forEach(jasmine.__angular_jasmine_matchers__, function (method, methodName) {
            Matchers.prototype[methodName] = function () {
                var expectedArgs = Array.prototype.slice.call(arguments, 0),
                    fn = method.apply(null, arguments),
                    result;
                expectedArgs = [this.actual].concat(expectedArgs);
                if (this.isNot && fn.negativeCompare) {
                    result = fn.negativeCompare.apply(null, expectedArgs);
                } else {
                    result = fn.compare.apply(null, expectedArgs);
                }

                this.pass = result.pass;
                this.message = result.message;

                return this;
            };
        });
        test = function (actual) {
            var positive = new Matchers(actual, false);
            positive.not = new Matchers(actual, true);
            return positive;
        };
    });

    afterEach(function () {
        clock.restore();
    });

    /*jslint regexp: true*/

    it("should get a message from toEqualData", function () {
        expect(test(33).toEqualData(44).message).toMatch(/33.*44/);
        expect(test(33).not.toEqualData(33).message).toMatch(/33.*not.*33/);
    });

    it("should get a message from toBeUniqueArray", function () {
        expect(test([1, 2, 2, 2]).toBeUniqueArray().message).toMatch(/\[.*1.*2.*2.*2.*\].*unique/);
        expect(test([1, 2, 3, 5]).not.toBeUniqueArray().message).toMatch(/not/);
    });

    it("should get a message from toBeEvenNumber", function () {
        expect(test(33).toBeEvenNumber().message).toMatch(/33.*even/);
    });

    it("should get a message from toBeEvenNumber not statement", function () {
        expect(test(22).not.toBeEvenNumber().message).toMatch(/22.*not.*even/);
    });


    it("should get a message from toBeOddNumber", function () {
        expect(test(22).toBeOddNumber().message).toMatch(/22.*odd/);
    });

    it("should get a message from toBeOddNumber not statement", function () {
        expect(test(22).not.toBeOddNumber().message).toMatch(/22.*not/);
    });

    it("should get a message from toBeIso8601Date", function () {
        expect(test("NONO").toBeIso8601Date().message).toMatch(/NONO/);
        expect(test("2014-01-01").not.toBeIso8601Date().message).toMatch(/2014-01-01.*not/);
    });

    it("should get a message from toBeObject", function () {
        expect(test(11).toBeObject().message).toMatch(/11.*object/);
        expect(test({}).not.toBeObject().message).toMatch(/\{\}.*not/);
    });

    it("should get a message from toMatchDatePart", function () {
        var date1 = new Date(2011, 10, 11), date2 = new Date(2012, 11, 12);
        expect(test(date1).toMatchDatePart(date2, 'date').message).toMatch(/11.*12/);
        expect(test(date1).toMatchDatePart(date2, 'month').message).toMatch(/10.*11/);
        expect(test(date1).toMatchDatePart(date2, 'FullYear').message).toMatch(/2011.*2012/);
        // xxx todo: implement "not" message for this matcher
    });

});


