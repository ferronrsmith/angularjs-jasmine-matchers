/*
 (c) Ferron Hanse 2012
 https://github.com/ferronrsmith/anuglarjs-jasmine-matchers
 Released under the MIT license
 */


/*jslint nomen : true*/
/*jslint devel : true*/
/*jslint unparam : true */
/*jslint browser : true */
/*jslint bitwise : true*/
/*global describe, beforeEach, inject, module, angular, document, it, expect, $, jasmine, toJson */

/**
 Provides a comprehensive set of custom matchers for the Jasmine testing framework
 @class matchers
 @main matchers
 **/
beforeEach(function () {
    "use strict";
    var customMatchers = {},
        matchers = {},
        hlp = {},
        bjQuery = false;

    hlp.cssMatcher = function (presentClasses, absentClasses) {
        var self = this;
        return function () {
            var element = angular.element(self.actual), present = true, absent = false;

            angular.forEach(presentClasses.split(' '), function (className) {
                present = present && element.hasClass(className);
            });

            angular.forEach(absentClasses.split(' '), function (className) {
                absent = absent || element.hasClass(className);
            });

            self.message = function () {
                return "Expected to {0} have ".t(this.isNot ? "not" : "") + presentClasses +
                    (absentClasses ? (" and not have " + absentClasses + " ") : "") +
                    " but had " + element[0].className + ".";
            };
            return present && !absent;
        };
    };

    /**
     * Returns the index of an object in a given array
     * @method hpl.indexOf
     * @param array :- array object to be checked
     * @param obj :- object (value) to be checked for in the array
     * @return {number} index of the obj in the array
     */
    hlp.indexOf = function (array, obj) {
        var i;
        for (i = 0; i < array.length; i += 1) {
            if (obj === array[i]) {
                return i;
            }
        }
        return -1;
    };

    /**
     * Check if an object has a particular property matches the expected value
     * @method hpl.hasProperty
     * @param actualValue property value
     * @param expectedValue expected value
     * @return {boolean} boolean indicating if the values match
     */
    hlp.hasProperty = function (actualValue, expectedValue) {
        if (expectedValue === undefined) {
            return actualValue !== undefined;
        }
        return actualValue === expectedValue;
    };

    /**
     * Returns the type of the object entered
     * @param actual -  object to be checked
     */
    hlp.typeOf = function (actual) {
        return Object.prototype.toString.call(actual).replace(/(\[|object|\s|\])/g, "").toLowerCase();
    };

    /**
     * Checks if a given element/JavaScript object matches the type
     * @method hpl.isOfType
     * @param actual Object to be checked for type comparison
     * @param type type to be matched
     * @return {boolean} boolean indicating if the type matches the object type
     */
    hlp.isOfType = function (actual, type) {
        return hlp.typeOf(actual) === type.toLowerCase();
    };

    /**
     * Checks if the a given word/phrase/substring is at the end of a string
     * @method hpl.endsWith
     * @param {String} haystack string to be search
     * @param needle {String} word/phrase/substring
     * @return {boolean} boolean indicating if the word/phrase/substring was found at the end of the string
     */
    hlp.endsWith = function (haystack, needle) {
        return haystack.substr(-needle.length) === needle;
    };

    /**
     * Checks if the a given word/phrase/substring is at the beginning of a string
     * @method hpl.endsWith
     * @param {String} haystack string to be search
     * @param needle {String} word/phrase/substring
     * @return {boolean} boolean indicating if the word/phrase/substring was found at the beginning of the string
     */
    hlp.startsWith = function (haystack, needle) {
        return haystack.substr(0, needle.length) === needle;
    };

    /**
     * Coverts a given object literal to an array
     * @method hlp.objToArray
     * @param obj - object literal
     * @return {Array} array representation of the object
     * @since 0.2 :- Removed $$hashKey check
     */
    hlp.objToArray = function (obj) {
        var arr = [], aDup = {};
        angular.copy(obj, aDup);
        angular.forEach(aDup, function (value, key) {
            arr.push(value);
        });
        return arr;
    };

    /**
     * Coverts a given a list of object literals to a flatten array
     * @method hlp.objListToArray
     * @param obj - object literals
     * @return {Array} flatten array representation of the objects
     */
    hlp.objListToArray = function (obj) {
        var res = [];
        angular.forEach(obj, function (value, key) {
            res = res.concat(hlp.objToArray(value));
        });
        return res;
    };

    hlp.isNumber = function (val) {
        return !isNaN(parseFloat(val)) && !hlp.isOfType(val, 'String');
    };

    /**
     * Message constant for jQuery
     * @type {string}
     */
    hlp.msg = {
        jQuery: "Error: jQuery not found. this matcher has a dependency on jQuery",
        date: {
            invalidType: 'Expected {0} & {1} to be a Date',
            nomatch: {
                Date: 'Expected {0} & {1} to match',
                part: "Invalid part : {0} entered"
            }
        }
    };

    hlp.dp = function (x) {
        return angular.mock.dump(arguments.length > 1 ? arguments : x);
    };

    /**
     * Returns isNot String
     * @param context
     * @param altText
     */
    hlp.isNot = function (context, altText) {
        altText = altText || "";
        return context.isNot ? "not " : altText;
    };

    hlp.evaluate = function (test) {
        return {
            compare: function (actual, expected) {
                return test(actual, false, expected);
            },
            negativeCompare: function (actual, expected) {
                return test(actual, true, expected);
            }
        };
    };

    hlp.checkArgumentType = function (value, type) {
        var result = hlp.isOfType(value, type);
        if (!result) {
            throw new Error("Invalid type detected, Expected [{0}], but was [{1}]".t(type, hlp.typeOf(value)));
        }
    };


    String.prototype.t = function () {
        var args = arguments;
        return this.replace(/\{(\d+)\}/g, function (match, number) {
            return args[number] !== 'undefined' ? args[number] : match;
        });
    };

    /**
     * Check if jQuery is present
     * @return {boolean} boolean indicating if jQuery is present
     */
    bjQuery = (function () {
        return (window.$ !== undefined || window.jQuery !== undefined);
    }());

    customMatchers.toBeInvalid = hlp.cssMatcher('ng-invalid', 'ng-valid');
    customMatchers.toBeValid = hlp.cssMatcher('ng-valid', 'ng-invalid');
    customMatchers.toBeDirty = hlp.cssMatcher('ng-dirty', 'ng-pristine');
    customMatchers.toBePristine = hlp.cssMatcher('ng-pristine', 'ng-dirty');
    customMatchers.toEqual = function (expected) {
        if (this.actual && this.actual.$$log) {
            if (typeof expected === 'string') {
                this.actual = this.actual.toString();
            } else {
                this.actual = this.actual.toArray();
            }
        }
        return jasmine.Matchers.prototype.toEqual.call(this, expected);
    };

    customMatchers.toEqualData = function (expected) {
        this.message = function () {
            return "Expected " + hlp.dp(this.actual) + " data {0} to Equal ".t(this.isNot ? "not" : "") + expected;
        };
        return angular.equals(this.actual, expected);
    };

    customMatchers.toEqualError = function (message) {
        this.message = function () {
            var expected;
            if (this.actual.message && this.actual.name === 'Error') {
                expected = angular.toJson(this.actual.message);
            } else {
                expected = angular.toJson(this.actual);
            }
            return "Expected " + expected + " to {0} be an Error with message ".t(this.isNot ? "not" : "") + angular.toJson(message);
        };
        return this.actual.name === 'Error' && this.actual.message === message;
    };

    customMatchers.toMatchError = function (messageRegexp) {
        this.message = function () {
            var expected;
            if (this.actual.message && this.actual.name === 'Error') {
                expected = angular.toJson(this.actual.message);
            } else {
                expected = angular.toJson(this.actual);
            }
            return "Expected " + expected + " to {0} match an Error with message ".t(this.isNot ? "not" : "") + angular.toJson(messageRegexp);
        };
        return this.actual.name === 'Error' && messageRegexp.test(this.actual.message);
    };

    customMatchers.toHaveBeenCalledOnce = function () {
        if (arguments.length > 0) {
            throw new Error('toHaveBeenCalledOnce does not take arguments, use toHaveBeenCalledWith');
        }

        if (!jasmine.isSpy(this.actual)) {
            throw new Error('Expected a spy, but got ' + jasmine.pp(this.actual) + '.');
        }

        this.message = function () {
            var msg = 'Expected spy ' + this.actual.identity + ' to have been called once, but was ',
                count = this.actual.callCount;
            return [
                count === 0 ? msg + 'never called.' : msg + 'called ' + count + ' times.',
                msg.replace('to have', 'not to have') + 'called once.'
            ];
        };

        return this.actual.callCount === 1;
    };

    customMatchers.toHaveBeenCalledOnceWith = function () {
        var expectedArgs = jasmine.util.argsToArray(arguments);

        if (!jasmine.isSpy(this.actual)) {
            throw new Error('Expected a spy, but got ' + jasmine.pp(this.actual) + '.');
        }

        this.message = function () {
            var result;
            if (this.actual.callCount !== 1) {
                if (this.actual.callCount === 0) {
                    result = [
                        'Expected spy ' + this.actual.identity + ' to have been called with ' +
                            jasmine.pp(expectedArgs) + ' but it was never called.',
                        'Expected spy ' + this.actual.identity + ' not to have been called with ' +
                            jasmine.pp(expectedArgs) + ' but it was.'
                    ];
                } else {
                    result = [
                        'Expected spy ' + this.actual.identity + ' to have been called with ' +
                            jasmine.pp(expectedArgs) + ' but it was never called.',
                        'Expected spy ' + this.actual.identity + ' not to have been called with ' +
                            jasmine.pp(expectedArgs) + ' but it was.'
                    ];
                }
            } else {
                result = [
                    'Expected spy ' + this.actual.identity + ' to have been called with ' +
                        jasmine.pp(expectedArgs) + ' but was called with ' + jasmine.pp(this.actual.argsForCall),
                    'Expected spy ' + this.actual.identity + ' not to have been called with ' +
                        jasmine.pp(expectedArgs) + ' but was called with ' + jasmine.pp(this.actual.argsForCall)
                ];
            }
            return result;
        };

        return this.actual.callCount === 1 && this.env.contains_(this.actual.argsForCall, expectedArgs);
    };

    customMatchers.toBeOneOf = function () {
        this.message = function () {
            return "Expected '" + hlp.dp(this.actual) + "' to {0} be one of '".t(this.isNot ? "not" : "") + hlp.dp(arguments) + "'.";
        };
        return hlp.indexOf(arguments, this.actual) !== -1;
    };

    customMatchers.toHaveClass = function (clazz) {
        this.message = function () {
            return "Expected '" + hlp.dp(this.actual) + "' to {0} have class '".t(this.isNot ? "not" : "") + clazz + "'.";
        };
        return this.actual.hasClass ? this.actual.hasClass(clazz) : angular.element(this.actual).hasClass(clazz);
    };

    customMatchers.toHaveCss = function (css) {
        var prop; // css prop
        this.message = function () {
            return "Expected '" + hlp.dp(this.actual) + "' to {0} have css '".t(this.isNot ? "not" : "") + hlp.dp(css) + "'.";
        };
        for (prop in css) {
            if (css.hasOwnProperty(prop)) {
                if (this.actual.css(prop) !== css[prop]) {
                    return false;
                }
            }
        }
        return true;
    };

    customMatchers.toMatchRegex = function (regex) {

        this.message = function () {
            return "Expected '" + hlp.dp(this.actual) + "' to {0} match '".t(this.isNot ? "not" : "") + regex;
        };

        var reg;
        if (hlp.isOfType(regex, "String")) {
            reg = new RegExp(regex);
        } else if (hlp.isOfType(regex, "RegExp")) {
            reg = regex;
        }
        return reg.test(this.actual);
    };

    customMatchers.toBeVisible = function () {
        this.message = function () {
            return "Expected '" + hlp.dp(this.actual) + "' to {0} be visible '".t(this.isNot ? "not" : "");
        };
        return this.actual.is(':visible');
    };

    customMatchers.toBeHidden = function () {
        this.message = function () {
            return "Expected '" + hlp.dp(this.actual) + "' to {0} be hidden '".t(this.isNot ? "not" : "");
        };
        return this.actual.is(':hidden');
    };

    customMatchers.toBeSelected = function () {
        this.message = function () {
            return "Expected '" + hlp.dp(this.actual) + "' to {0} be selected '".t(this.isNot ? "not" : "");
        };
        return this.actual.is(':selected');
    };

    customMatchers.toBeChecked = function () {
        this.message = function () {
            return "Expected '" + hlp.dp(this.actual) + "' to {0} be checked '".t(this.isNot ? "not" : "");
        };
        return this.actual.is(':checked');
    };

    customMatchers.toBeSameDate = function (date) {
        this.message = function () {
            return "Expected '" + hlp.dp(this.actual) + "' to {0} be equal to '".t(this.isNot ? "not" : "") + hlp.dp(date);
        };

        var actualDate = this.actual;
        return actualDate.getDate() === date.getDate() &&
            actualDate.getFullYear() === date.getFullYear() &&
            actualDate.getMonth() === date.getMonth() &&
            actualDate.getHours() === date.getHours() &&
            actualDate.getMinutes() === date.getMinutes() &&
            actualDate.getSeconds() === date.getSeconds();
    };

    customMatchers.toBeEmpty = function () {
        this.message = function () {
            return "Expected '" + hlp.dp(this.actual) + "' to {0} be empty '".t(this.isNot ? "not" : "");
        };
        return this.actual.is(':empty');
    };

    customMatchers.toBeEmptyString = function () {
        this.message = function () {
            return "Expected string '" + hlp.dp(this.actual) + "' to {0} be empty '".t(this.isNot ? "not" : "");
        };
        return hlp.isOfType(this.actual, 'String') && $.trim(this.actual).length === 0;
    };

    customMatchers.toExist = function () {
        this.message = function () {
            var msg = "";
            if (bjQuery) {
                msg = "Expected '" + hlp.dp(this.actual) + "' to {0} exists '".t(this.isNot ? "not" : "");
            } else {
                msg = hlp.msg.jQuery;
            }
            return msg;
        };
        return bjQuery ? $(document).find(this.actual).length : false;
    };

    customMatchers.toHaveAttr = function (attributeName, expectedAttributeValue) {
        this.message = function () {
            return "Expected '" + hlp.dp(this.actual) + "' to {0} have attribute '".t(this.isNot ? "not" : "") + attributeName + "' with value " + expectedAttributeValue + ".";
        };
        return hlp.hasProperty(this.actual.attr(attributeName), expectedAttributeValue);
    };

    customMatchers.toHaveProp = function (propertyName, expectedPropertyValue) {
        this.message = function () {
            return "Expected '" + hlp.dp(this.actual) + "' to {0} have property '".t(this.isNot ? "not" : "") + expectedPropertyValue + "'.";
        };
        return hlp.hasProperty(this.actual.prop(propertyName), expectedPropertyValue);
    };

    customMatchers.toHaveId = function (id) {
        this.message = function () {
            return "Expected '" + hlp.dp(this.actual) + "' to {0} have id '".t(this.isNot ? "not" : "") + id + "'.";
        };
        return this.actual.attr('id') === id;
    };

    customMatchers.toBeDisabled = function (selector) {
        this.message = function () {
            return "Expected '" + hlp.dp(this.actual) + "' to {0} be disabled '".t(this.isNot ? "not" : "") + hlp.dp(selector) + "'.";
        };
        return this.actual.is(':disabled');
    };

    customMatchers.toBeFocused = function (selector) {
        this.message = function () {
            return "Expected '" + hlp.dp(this.actual) + "' to {0} be focused '".t(this.isNot ? "not" : "") + hlp.dp(selector) + "'.";
        };
        return this.actual.is(':focus');
    };

    customMatchers.toHaveText = function (text) {
        if (!bjQuery) {
            return false;
        }

        this.message = function () {
            var msg = "";
            if (bjQuery) {
                msg = "Expected '" + hlp.dp(this.actual) + "' to {0} have text '".t(this.isNot ? "not" : "") + text + "'.";
            } else {
                msg = hlp.msg.jQuery;
            }
            return msg;
        };

        var trimmedText = $.trim(this.actual.text()), result;
        if (text && angular.isFunction(text.test)) {
            result = text.test(trimmedText);
        } else {
            result = trimmedText === text;
        }
        return result;
    };

    customMatchers.toHaveValue = function (value) {
        this.message = function () {
            return "Expected '" + hlp.dp(this.actual) + "' to {0} have value '".t(this.isNot ? "not" : "") + value + "'.";
        };
        return this.actual.val() === value;
    };

    customMatchers.toHaveData = function (key, expectedValue) {
        this.message = function () {
            return "Expected '" + hlp.dp(this.actual) + "' to {0} have data '" + expectedValue + "'.".t(this.isNot ? "not" : "");
        };
        return hlp.hasProperty(this.actual.data(key), expectedValue);
    };

    /**
     * Does not return true if subject is null
     * @return {Boolean}
     */
    customMatchers.toBeObject = function () {
        this.message = function () {
            return "Expected '" + hlp.dp(this.actual) + "' to {0} be an [Object]".t(this.isNot ? "not" : "");
        };
        return hlp.isOfType(this.actual, 'Object');
    };


    /**
     * @return {Boolean}
     */
    customMatchers.toBeArray = function () {
        this.message = function () {
            return "Expected '" + hlp.dp(this.actual) + "' to {0} be an [Array]".t(this.isNot ? "not" : "");
        };
        return hlp.isOfType(this.actual, 'Array');
    };

    /**
     * @return {Boolean}
     */
    customMatchers.toBeDate = function () {
        this.message = function () {
            return "Expected '" + hlp.dp(this.actual) + "' to {0} be a [Date]".t(this.isNot ? "not" : "");
        };
        return hlp.isOfType(this.actual, 'Date');
    };

    /**
     * @return {Boolean}
     */
    customMatchers.toBeBefore = function (date) {
        this.message = function () {
            return "Expected '" + hlp.dp(this.actual) + "' to {0} be before".t(this.isNot ? "not" : "") + hlp.dp(date);
        };
        return hlp.isOfType(this.actual, 'Date') && this.actual.getTime() < date.getTime();
    };

    /**
     * @return {Boolean}
     */
    customMatchers.toBeAfter = function (date) {
        this.message = function () {
            return "Expected '" + hlp.dp(this.actual) + "' to {0} be after".t(this.isNot ? "not" : "") + hlp.dp(date);
        };
        return hlp.isOfType(this.actual, 'Date') && this.actual.getTime() > date.getTime();
    };

    matchers.toBeIso8601Date = function () {
        return {
            compare: function (actual) {
                return {
                    pass: hlp.isOfType(actual, 'String')
                        && actual.length >= 10
                        && new Date(actual).toString() !== 'Invalid Date'
                        && new Date(actual).toISOString().slice(0, actual.length) === actual
                };
            }
        };
    };

    /**
     * Asserts subject is an Array with a defined number of members
     * @param  {Number} size
     * @return {Boolean}
     */
    customMatchers.toBeArrayOfSize = function (size) {
        this.message = function () {
            return "Expected '" + hlp.dp(this.actual) + "' to {0} be an [Array] of size {1}".t(this.isNot ? "not" : "", size);
        };
        return hlp.isOfType(this.actual, 'Array') && this.actual.length === size;
    };

    /**
     * @return {Boolean}
     */
    customMatchers.toBeString = function () {
        this.message = function () {
            return "Expected '" + hlp.dp(this.actual) + "' to {0} be a [String]".t(this.isNot ? "not" : "");
        };
        return hlp.isOfType(this.actual, 'String');
    };

    /**
     * @return {Boolean}
     */
    customMatchers.toBeBoolean = function () {
        this.message = function () {
            return "Expected '" + hlp.dp(this.actual) + "' to {0} be Boolean".t(this.isNot ? "not" : "");
        };
        return hlp.isOfType(this.actual, 'Boolean');
    };


    /**
     * @return {Boolean}
     */
    customMatchers.toBeNonEmptyString = function () {
        if (!bjQuery) {
            return false;
        }

        this.message = function () {
            var msg = "";
            if (bjQuery) {
                msg = "Expected '" + hlp.dp(this.actual) + "' to " + hlp.isNot(this, "") + "be a non empty string ";
            } else {
                msg = hlp.msg.jQuery;
            }
            return msg;
        };
        return hlp.isOfType(this.actual, 'String') && $.trim(this.actual).length > 0;
    };

    /**
     */
    matchers.toBeNumber = function () {
        var test = function (actual, isNot) {
            var result = hlp.isNumber(actual);
            return {
                pass : isNot ? !result : result,
                message : "Expected " + hlp.dp(actual) + " to " + (isNot ? " not" : "") + " be a number"
            };
        };

        return hlp.evaluate.call(this, test);
    };

    matchers.toBeEvenNumber = function () {
        var test = function (actual, isNot) {
            var result = hlp.isNumber(actual) && actual % 2 === 0;
            return {
                pass : isNot ? !result : result,
                message : "Expected " + hlp.dp(actual) + " to " + (isNot ? " not" : "") + " be an even number"
            };
        };

        return hlp.evaluate.call(this, test);
    };

    matchers.toBeOddNumber = function () {
        var test = function (actual, isNot) {
            var result = hlp.isNumber(actual) && actual % 2 !== 0;
            return {
                pass : isNot ? !result : result,
                message : "Expected " + hlp.dp(actual) + " to " + (isNot ? " not" : "") + " be an odd number"
            };
        };

        return hlp.evaluate.call(this, test);
    };

    matchers.toBeNaN = function () {
        var test = function (actual, isNot) {
            var result = isNaN(actual);
            return {
                pass : isNot ? !result : result,
                message : "Expected '" + hlp.dp(actual) + "' to" + (isNot ? " not" : "") + " be a [NaN]"
            };
        };

        return hlp.evaluate.call(this, test);
    };

    /**
     * @return {Boolean}
     */
    customMatchers.toBeFunction = function () {
        this.message = function () {
            return "Expected '" + hlp.dp(this.actual) + "' to " + hlp.isNot(this, "") + " be a [Function]";
        };
        return hlp.isOfType(this.actual, 'Function');
    };

    matchers.toHaveLength = function () {
        var test = function (actual, isNot, expected) {
            hlp.checkArgumentType(actual, 'string');
            hlp.checkArgumentType(expected, 'number');
            var result = actual.length === expected;
            return {
                pass : isNot ? !result : result,
                message : "Expected " + hlp.dp(actual) + " to " + (isNot ? " not" : "") + " have a length of " + expected + " but was " + actual.length
            };
        };

        return hlp.evaluate.call(this, test);
    };

    matchers.toStartWith = function () {
        var test = function (actual, isNot, expected) {
            hlp.checkArgumentType(actual, 'string');
            hlp.checkArgumentType(expected, 'string');
            var result = hlp.startsWith(actual, expected);
            return {
                pass : isNot ? !result : result,
                message : "Expected " + hlp.dp(actual) + " to " + (isNot ? " not" : "") + " to start with " + expected
            };
        };

        return hlp.evaluate.call(this, test);
    };

    matchers.toEndWith = function () {
        var test = function (actual, isNot, expected) {
            hlp.checkArgumentType(actual, 'string');
            hlp.checkArgumentType(expected, 'string');
            var result = hlp.endsWith(actual, expected);
            return {
                pass : isNot ? !result : result,
                message : "Expected " + hlp.dp(actual) + " to " + (isNot ? " not" : "") + " to ends with " + expected
            };
        };

        return hlp.evaluate.call(this, test);
    };

    matchers.toContainOnce = function () {
        var test = function (actual, isNot, expected) {
            hlp.checkArgumentType(actual, 'string');
            hlp.checkArgumentType(expected, 'string');
            var result = false, firstFoundAt;
            if (actual) {
                firstFoundAt = actual.indexOf(expected);
                result = firstFoundAt !== -1 && firstFoundAt === actual.lastIndexOf(expected);
            }
            return {
                pass : isNot ? !result : result,
                message : "Expected " + hlp.dp(actual) + " to " + (isNot ? " not" : "") + " to contain only one " + expected
            };
        };

        return hlp.evaluate.call(this, test);
    };

    customMatchers.toContainSelector = function (selector) {
        this.message = function () {
            return "Expected '" + hlp.dp(this.actual) + "' to have contain '" + hlp.dp(selector) + "'.";
        };
        return this.actual.find(selector).length;
    };

    matchers.toBeUniqueArray = function () {
        var test = function (actual, isNot) {
            hlp.checkArgumentType(actual, 'array');
            var result = true, i, len = actual.length, o = [];

            // iterate over the array, adding unique elements to o
            for (i = 0; i < len; i += 1) {
                if (hlp.indexOf(o, actual[i]) === -1) {
                    o.push(actual[i]);
                } else {
                    result = false;
                    break;
                }
            }
            return {
                pass : isNot ? !result : result,
                message : "Expected " + hlp.dp(actual) + " values {0} to be unique".t(isNot ? "not" : "")
            };
        };
        return hlp.evaluate.call(this, test);
    };

    /**
     *
     * @method matchers.toMatchDatePart
     * @param expected {Date} Date to be compared
     * @param {String} part specific part/property of the date you want to be compared </br
     *        <br />
     *        <b>Currently supported parts are listed below :</b>
     *        <ul>
     *            <li>date</li>
     *            <li>day</li>
     *            <li>month</li>
     *            <li>year</li>
     *            <li>milliseconds</li>
     *            <li>minutes</li>
     *            <li>seconds</li>
     *            <li>hours</li>
     *            <li>time</li>
     *        </ul>
     *  e.g usages :expect(date).toMatchDatePart(date, 'day');
     * @beta
     */
    matchers.toMatchDatePart = function () {
        var test = function (actual, isNot, expected) {
            hlp.checkArgumentType(actual, 'date');
            hlp.checkArgumentType(expected, 'object');
            hlp.checkArgumentType(expected.date, 'date');
            hlp.checkArgumentType(expected.part, 'string');
            var result, msg;

            switch (expected.part) {
            case 'date':
                result = actual.getDate() === expected.date.getDate();
                msg = hlp.msg.date.nomatch.Date.t(hlp.dp(actual.getDate()), hlp.dp(expected.date.getDate()));
                break;
            case 'day':
                result = actual.getDay() === expected.date.getDay();
                msg = hlp.msg.date.nomatch.Date.t(hlp.dp(actual.getDay()), hlp.dp(expected.date.getDay()));
                break;
            case 'month':
                result = actual.getMonth() === expected.date.getMonth();
                msg = hlp.msg.date.nomatch.Date.t(hlp.dp(actual.getMonth()), hlp.dp(expected.date.getMonth()));
                break;
            case 'year':
                result = actual.getFullYear() === expected.date.getFullYear();
                msg = hlp.msg.date.nomatch.Date.t(hlp.dp(actual.getFullYear()), hlp.dp(expected.date.getFullYear()));
                break;
            case 'milliseconds':
                result = actual.getMilliseconds() === expected.date.getMilliseconds();
                msg = hlp.msg.date.nomatch.Date.t(hlp.dp(actual.getMilliseconds()), hlp.dp(expected.date.getMilliseconds()));
                break;
            case 'seconds':
                result = actual.getSeconds() === expected.date.getSeconds();
                msg = hlp.msg.date.nomatch.Date.t(hlp.dp(actual.getSeconds()), hlp.dp(expected.date.getSeconds()));
                break;
            case 'minutes':
                result = actual.getMinutes() === expected.date.getMinutes();
                msg = hlp.msg.date.nomatch.Date.t(hlp.dp(actual.getMinutes()), hlp.dp(expected.date.getMinutes()));
                break;
            case 'hours':
                result = actual.getHours() === expected.date.getHours();
                msg = hlp.msg.date.nomatch.Date.t(hlp.dp(actual.getHours()), hlp.dp(expected.date.getHours()));
                break;
            case 'time':
                result = actual.getTime() === expected.date.getTime();
                msg = hlp.msg.date.nomatch.Date.t(hlp.dp(actual.getTime()), hlp.dp(expected.date.getTime()));
                break;
            default:
                msg = hlp.msg.date.nomatch.part.t(expected.part);
            }

            return {
                pass : isNot ? !result : result,
                message : msg
            };
        };

        return hlp.evaluate.call(this, test);
    };

    // aliases
    jasmine.addMatchers(matchers);

    // Keep a reference to the original matchers, for tests
    jasmine.__angular_jasmine_matchers__ = matchers;
});