/*global jasmine, describe, xdescribe, it, expect, afterEach, beforeEach, angular */
/**
 * Created by ferron on 9/28/13.
 */


describe('Testing Custom Matchers', function () {
    "use strict";

    it('Expect all values in an array to be unique', function () {
        expect([1, 2, 3, 5]).toBeUniqueArray();
    });

    it('Expect the dates to be the same', function () {
        var date = new Date();
        expect(date).toBeSameDate(date);
    });

    it('Expect number to be even ', function () {
        expect(2).toBeEvenNumber();
    });

    it('Expect number to be odd ', function () {
        expect(3).toBeOddNumber();
    });

    it('Expect date to be in ISO8601 Date Format', function () {
        expect(new Date().toISOString()).toBeIso8601Date();
    });

    it('Expect elements to have matching attributes', function () {
        expect(angular.element('<input id="check1" type="checkbox" checked="checked">')).toHaveMatchingAtrr(
            'checked',
            [{'checked': 'checked'}]
        );
    });

    it('Expect not to work properly', function () {
        expect({}).toBeObject();
    });

    it('Expected Dates to match', function () {
        var date = new Date();
        expect(date).toMatchDatePart(date, 'day');
        expect(date).toMatchDatePart(date, 'date');
        expect(date).toMatchDatePart(date, 'month');
        expect(date).toMatchDatePart(date, 'year');
        expect(date).toMatchDatePart(date, 'milliseconds');
        expect(date).toMatchDatePart(date, 'seconds');
        expect(date).toMatchDatePart(date, 'minutes');
        expect(date).toMatchDatePart(date, 'hours');
        expect(date).toMatchDatePart(date, 'time');
    });


    describe('messages', function () {
        var test;
        beforeEach(function () {
            // Create mock "expect" matchers, to extract only the failure message, without triggering test failures.
            function Matchers(actual, isNot) {
                this.actual = actual;
                this.isNot = isNot;
            }

            Matchers.prototype = {};
            /*jslint nomen: true*/
            angular.forEach(jasmine.__angular_jasmine_matchers__, function (method, methodName) {
                Matchers.prototype[methodName] = function () {
                    var result = !!(method.apply(this, arguments));
                    if (result !== this.isNot) {
                        this.message = null;
                    }
                    return this;
                };
            });
            test = function (actual) {
                var positive = new Matchers(actual, false);
                positive.not = new Matchers(actual, true);
                return positive;
            };
        });

        /*jslint regexp: true*/

        it("should get a message from toEqualData", function () {
            expect(test(33).toEqualData(44).message()).toMatch(/33.*44/);
            expect(test(33).not.toEqualData(33).message()).toMatch(/33.*not.*33/);
        });

        it("should get a message from toBeUniqueArray", function () {
            expect(test([1, 2, 2, 2]).toBeUniqueArray().message()).toMatch(/\[.*1.*2.*2.*2.*\].*unique/);
            expect(test([1, 2, 3, 5]).not.toBeUniqueArray().message()).toMatch(/not/);
        });

        it("should get a message from toBeSameDate", function () {
            var date1 = new Date("2014-01-01"), date2 = new Date("2014-02-02");
            expect(test(date1).toBeSameDate(date2).message()).toMatch(/2014-01-01.*2014-02-02/);
            expect(test(date1).not.toBeSameDate(date1).message()).toMatch(/not/);
        });

        it("should get a message from toBeEvenNumber", function () {
            expect(test(33).toBeEvenNumber().message()).toMatch(/33.*even/);
            // xxx todo: implement "not" message for this matcher
        });

        it("should get a message from toBeOddNumber", function () {
            expect(test(22).toBeOddNumber().message()).toMatch(/22.*odd/);
            // xxx todo: implement "not" message for this matcher
        });

        it("should get a message from toBeIso8601Date", function () {
            expect(test("NONO").toBeIso8601Date().message()).toMatch(/NONO/);
            expect(test("2014-01-01").not.toBeIso8601Date().message()).toMatch(/2014-01-01.*not/);
        });

        it("should get a message from toBeObject", function () {
            expect(test(11).toBeObject().message()).toMatch(/11.*Object/);
            expect(test({}).not.toBeObject().message()).toMatch(/\{\}.*not/);
        });

        it("should get a message from toMatchDatePart", function () {
            var date1 = new Date("2011-11-11"), date2 = new Date("2012-12-12");
            expect(test(date1).toMatchDatePart(date2, 'date').message()).toMatch(/11.*12/);
            expect(test(date1).toMatchDatePart(date2, 'month').message()).toMatch(/10.*11/);
            expect(test(date1).toMatchDatePart(date2, 'year').message()).toMatch(/2011.*2012/);
            // xxx todo: implement "not" message for this matcher
        });

    });

});


