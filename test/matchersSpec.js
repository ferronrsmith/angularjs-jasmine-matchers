/*global describe, it, expect, afterEach, beforeEach, angular */
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
});


