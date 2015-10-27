/*global jasmine, describe, xdescribe, it, expect, afterEach, beforeEach, angular, xit */
/**
 * Created by ferron on 9/28/13.
 */


describe('Testing Custom Matchers', function () {
    "use strict";

    xit('Expect all values in an array to be unique', function () {
        expect([1, 2, 3, 5]).toBeUniqueArray();
    });

    xit('Expect the dates to be the same', function () {
        var date = new Date();
        expect(date).toBeSameDate(date);
    });

    it('Expect number to be even ', function () {
        expect(2).toBeEvenNumber();
    });

    it('Expect number to be even ', function () {
        expect(3).not.toBeEvenNumber();
    });

    it('Expect number', function () {
        expect(2).toBeNumber();
    });

    it('Expect not number', function () {
        expect('ass').not.toBeNumber();
    });

    it('Expect number to be odd ', function () {
        expect(3).toBeOddNumber();
    });

    it('Expect to be not be NaN', function () {
        expect("1").not.toBeNaN();
    });

    it('Expected string to have length of', function () {
        expect("jasmine").toHaveLength(7);
    });


    it('Expected string to start with', function () {
        expect("jasmine").toStartWith("jas");
    });

    it('Expected string to end with', function () {
        expect("jasmine").toEndWith("ine");
    });

    it('Expected string to not end with', function () {
        expect("jasmine").not.toEndWith("ene");
    });

    it('Expected string to appear only once', function () {
        expect("elements elemental").toContainOnce("elements");
    });

    it('Expected string to appear only multiple time', function () {
        expect("elements elemental").not.toContainOnce("element");
    });

    it('Expect to be NaN ', function () {
        expect('assass').toBeNaN();
    });

    it('Expect date to be in ISO8601 Date Format', function () {
        expect(new Date().toISOString()).toBeIso8601Date();
    });

    it('Expect date to be in ISO8601 Date Format', function () {
        expect(new Date().toDateString()).not.toBeIso8601Date();
    });

    it("Expect array to contain unique items", function () {
        expect([1, 2, 5, 7, 8]).toBeUniqueArray();
    });

    it("Expect array to contain not be unique items", function () {
        expect([8, 1, 2, 5, 7, 8]).not.toBeUniqueArray();
    });

    xit('Expect not to work properly', function () {
        expect({}).toBeObject();
    });

    it('Expected Dates to match', function () {
        var date = new Date();
        expect(date).toMatchDatePart({ date : date, part : 'day'});
        expect(date).toMatchDatePart({ date : date, part : 'date'});
        expect(date).toMatchDatePart({ date : date, part : 'month'});
        expect(date).toMatchDatePart({ date : date, part : 'year'});
        expect(date).toMatchDatePart({ date : date, part : 'milliseconds'});
        expect(date).toMatchDatePart({ date : date, part : 'seconds'});
        expect(date).toMatchDatePart({ date : date, part : 'minutes'});
        expect(date).toMatchDatePart({ date : date, part : 'hours'});
        expect(date).toMatchDatePart({ date : date, part : 'time'});
    });
});


