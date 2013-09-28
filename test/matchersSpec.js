/*global describe, it, expect, afterEach, beforeEach */
/**
 * Created by ferron on 9/28/13.
 */


describe('Testing Custom Matchers', function () {
    "use strict";

    it('Expect all values in an array to be unique', function () {
        expect([1, 2, 3, 5]).ToBeUniqueArray();
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
});


