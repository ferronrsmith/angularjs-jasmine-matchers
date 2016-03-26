/*global jasmine, describe, xdescribe, it, expect, afterEach, beforeEach, angular, xit, inject, console, $ */
/**
 * Created by ferron on 9/28/13.
 */


describe('Testing Custom Matchers', function () {
    "use strict";

    var clock;

    beforeEach(function () {
        clock = angular.mock.$mockDate();
    });

    it('Expect the dates to be the same', function () {
        var date = new Date();
        expect(date).toMatchDatePart(date, 'time');
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

    it("Expect value to be an array", function () {
        expect([8, 1, 2, 5, 7, 8]).toBeArray();
    });

    it("Expect array length to be 5", function () {
        expect([8, 1, 2, 5, 7, 8]).toBeArrayOfSize(6);
    });

    it('Expect object to be object', function () {
        expect({}).toBeObject();
    });

    it('Expect value to not be array', function () {
        expect({}).not.toBeArray();
    });

    it('Expect string to not be object', function () {
        expect("").not.toBeObject();
    });

    it('Expect date', function () {
        expect(new Date()).toBeDate();
    });

    it('Expect date to appear before the other', function () {
        var dt1 = new Date(), dt2;
        clock.tick(1);
        dt2 = new Date();
        expect(dt1).toBeBefore(dt2);
    });

    it('Expect date to appear after the other', function () {
        var dt1 = new Date(), dt2;
        clock.tick(1);
        dt2 = new Date();
        expect(dt2).toBeAfter(dt1);
    });

    it('should have toHaveClass matcher', function () {
        var e = angular.element('<div class="abc">');
        expect(e).not.toHaveClass('none');
        expect(e).toHaveClass('abc');
    });

    it('Expect element to have value', function () {
        var e = angular.element('<input type="text" value="some text">');
        expect(e).toHaveVal("some text");
    });

    it('Expect element to have html', function () {
        var e = angular.element('<div class="demo-box">Demonstration Box</div>');
        expect(e).toHaveText("Demonstration Box");
    });

    it('Expect element to have prop', function () {
        var e = angular.element('<input id="check1" type="checkbox" checked="checked">');
        expect(e).toHaveProp("checked", true);
    });

    it('Expect element to have attr', function () {
        var e = angular.element('<input id="check1" type="checkbox" checked="checked">');
        expect(e).toHaveAttr("checked", 'checked');
    });

    it('Expect element to have css', function () {
        var e = angular.element('<div style="background-color:blue;"></div>');
        expect(e).toHaveCss("background-color", 'blue');
    });

    it('Expect element to be disabled', function () {
        var e = angular.element('<input name="email" disabled="disabled">');
        expect(e).toHaveIs(":disabled", true);
    });

    it('Expect element to not be disabled', function () {
        var e = angular.element('<input name="email">');
        expect(e).toHaveIs(":disabled", false);
    });

    it('to be in', function () {
        expect(2).toBeOneOf(1, 2, 3);
    });

    it('to be function', function () {
        expect(function () {
            clock();
        }).toBeFunction();
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
        expect(date).toMatchDatePart(date, 'UTCDate');
    });
});


