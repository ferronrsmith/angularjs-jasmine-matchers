/*global describe, it, expect, afterEach, beforeEach */
/**
 * Created by ferron on 9/28/13.
 */


describe('Testing Custom Matchers', function () {
    "use strict";

    it('Expect all values in an array to be unique', function () {
        expect([1, 2, 3, 5]).ToBeUniqueArray();
    });
});


