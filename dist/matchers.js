/*
 (c) Ferron Hanse 2012
 https://github.com/ferronrsmith/anuglarjs-jasmine-matchers
 Released under the MIT license

 Changelog

 removed toBeNan - now apart of jasmine 2
 deprecate toMatchRegex, use toMatch
 remove toBeSameDate, use toMatchDatePart({date: date, part: 'time'}) instead)

 */


/*jslint nomen : true*/
/*jslint devel : true*/
/*jslint unparam : true */
/*jslint browser : true */
/*jslint bitwise : true*/
/*global describe, beforeEach, inject, module, angular, document, it, expect, $, jasmine, toJson, jqLiteHasClass */

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
        bjQuery = false,
        primitives = ['string', 'boolean', 'object', 'array', 'number', 'date', 'function'];

    hlp.cssMatcher = function cssMatcher(presentClasses, absentClasses) {
        return function () {
            return {
                compare: function (actual) {
                    var element = angular.element(actual),
                        present = true,
                        absent = false,
                        message;

                    angular.forEach(presentClasses.split(' '), function (className) {
                        present = present && element.hasClass(className);
                    });

                    angular.forEach(absentClasses.split(' '), function (className) {
                        absent = absent || element.hasClass(className);
                    });

                    message = function () {
                        return "Expected to have " + presentClasses +
                            (absentClasses ? (" and not have " + absentClasses + " ") : "") +
                            "but had " + element[0].className + ".";
                    };
                    return {
                        pass: present && !absent,
                        message: message
                    };
                }
            };
        };
    };

    hlp.isNgElementHidden = function (element) {
        // we need to check element.getAttribute for SVG nodes
        var hidden = true;
        angular.forEach(angular.element(element), function (element) {
            if ((' '  + (element.getAttribute('class') || '') + ' ').indexOf(' ng-hide ') === -1) {
                hidden = false;
            }
        });
        return hidden;
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

    hlp.toCamelCase = function (actual) {
        return actual.charAt(0).toUpperCase() + actual.substring(1);
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

    hlp.isPromiseLike = function (obj) {
        return obj && hlp.isOfType(obj.then, 'function');
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

    hlp.checkArgumentCount = function (args, count) {
        var result = args.length === count;
        if (!result) {
            throw new Error("Invalid number of arguments");
        }
    };

    // type checking toBe wrapper
    hlp.toBeType = function (type) {
        return (function (t) {
            var test = function (actual, isNot) {
                var result = hlp.isOfType(actual, t);
                return {
                    pass : isNot ? !result : result,
                    message : "Expected '" + hlp.dp(actual) + "' to " + (isNot ? " not" : "") + " be " + t
                };
            };
            return hlp.evaluate.call(this, test);
        }(type));
    };


    String.prototype.t = function () {
        var args = arguments;
        return this.replace(/\{(\d+)\}/g, function (match, number) {
            return args[number] !== 'undefined' ? args[number] : match;
        });
    };

    String.prototype.toCamelCase = function () {
        return hlp.toCamelCase(this);
    };

    /**
     * Check if jQuery is present
     * @return {boolean} boolean indicating if jQuery is present
     */
    bjQuery = (function () {
        return (window.$ !== undefined || window.jQuery !== undefined);
    }());


    // primitive match generator
    angular.forEach(primitives, function (item) {
        matchers['toBe' + item.toCamelCase()] = function () {
            return hlp.toBeType(item);
        };
    });

    matchers.toBeEmpty = hlp.cssMatcher('ng-empty', 'ng-not-empty');
    matchers.toBeNotEmpty = hlp.cssMatcher('ng-not-empty', 'ng-empty');
    matchers.toBeInvalid = hlp.cssMatcher('ng-invalid', 'ng-valid');
    matchers.toBeValid = hlp.cssMatcher('ng-valid', 'ng-invalid');
    matchers.toBeDirty = hlp.cssMatcher('ng-dirty', 'ng-pristine');
    matchers.toBePristine = hlp.cssMatcher('ng-pristine', 'ng-dirty');
    matchers.toBeUntouched = hlp.cssMatcher('ng-untouched', 'ng-touched');
    matchers.toBeTouched = hlp.cssMatcher('ng-touched', 'ng-untouched');

    matchers.toBeAPromise = function () {
        function generateCompare(isNot) {
            return function (actual) {
                return { pass: hlp.isPromiseLike(actual), message: "Expected object " + (isNot ? "not " : "") + "to be a promise" };
            };
        }

        return {
            compare: generateCompare(false),
            negativeCompare: generateCompare(true)
        };
    };

    matchers.toBeShown = function () {
        function generateCompare(isNot) {
            return function (actual) {
                var pass = !hlp.isNgElementHidden(actual);
                if (isNot) {
                    pass = !pass;
                }
                return { pass: pass, message: "Expected element " + (isNot ? "" : "not ") + "to have 'ng-hide' class" };
            };
        }
        return {
            compare: generateCompare(false),
            negativeCompare: generateCompare(true)
        };
    };

    matchers.toBeHidden = function () {
        function generateCompare(isNot) {
            return function (actual) {
                var pass = hlp.isNgElementHidden(actual);
                if (isNot) {
                    pass = !pass;
                }
                return { pass: pass, message: "Expected element " + (isNot ? "" : "not ") + "to have 'ng-hide' class" };
            };
        }
        return {
            compare: generateCompare(false),
            negativeCompare: generateCompare(true)
        };
    };

    matchers.toEqual = function (util) {
        /**
         * @return {boolean}
         */
        function DOMTester(a, b) {
            if (a && b && a.nodeType > 0 && b.nodeType > 0) {
                return a === b;
            }
        }
        return {
            compare: function (actual, expected) {
                if (actual && actual.$$log) {
                    actual = (typeof expected === 'string')
                        ? actual.toString()
                        : actual.toArray();
                }
                return {
                    pass: util.equals(actual, expected, [DOMTester])
                };
            }
        };
    };

    matchers.toEqualData = function () {
        return {
            compare: function (actual, expected) {
                return { pass: angular.equals(actual, expected) };
            }
        };
    };

    matchers.toHaveBeenCalledOnce = function () {
        return {
            compare: function (actual) {
                if (arguments.length > 1) {
                    throw new Error('toHaveBeenCalledOnce does not take arguments, use toHaveBeenCalledWith');
                }

                if (!jasmine.isSpy(actual)) {
                    throw new Error('Expected a spy, but got ' + jasmine.pp(actual) + '.');
                }

                var message = function () {
                    var msg = 'Expected spy ' + actual.identity() + ' to have been called once, but was ',
                        count = this.actual.calls.count();
                    return [
                        count === 0 ? msg + 'never called.' :
                                msg + 'called ' + count + ' times.',
                        msg.replace('to have', 'not to have') + 'called once.'
                    ];
                };

                return {
                    pass: actual.calls.count() === 1,
                    message: message
                };
            }
        };
    };

    matchers.toHaveBeenCalledOnceWith = function (util, customEqualityTesters) {
        return {
            compare: function (actual) {
                var expectedArgs = Array.prototype.slice.call(arguments, 1), message;
                if (!jasmine.isSpy(actual)) {
                    throw new Error('Expected a spy, but got ' + jasmine.pp(actual) + '.');
                }
                message = function () {
                    var result;
                    if (actual.calls.count() !== 1) {
                        if (actual.calls.count() === 0) {
                            result = [
                                'Expected spy ' + actual.identity() + ' to have been called once with ' +
                                    jasmine.pp(expectedArgs) + ' but it was never called.',
                                'Expected spy ' + actual.identity() + ' not to have been called with ' +
                                    jasmine.pp(expectedArgs) + ' but it was.'
                            ];
                        }

                        result = [
                            'Expected spy ' + actual.identity() + ' to have been called once with ' +
                                jasmine.pp(expectedArgs) + ' but it was called ' + actual.calls.count() + ' times.',
                            'Expected spy ' + actual.identity() + ' not to have been called once with ' +
                                jasmine.pp(expectedArgs) + ' but it was.'
                        ];
                    } else {
                        result = [
                            'Expected spy ' + actual.identity() + ' to have been called once with ' +
                                jasmine.pp(expectedArgs) + ' but was called with ' + jasmine.pp(actual.calls.argsFor(0)),
                            'Expected spy ' + actual.identity() + ' not to have been called once with ' +
                                jasmine.pp(expectedArgs) + ' but was called with ' + jasmine.pp(actual.calls.argsFor(0))
                        ];
                    }
                    return result;
                };
                return {
                    pass: actual.calls.count() === 1 && util.equals(actual.calls.argsFor(0), expectedArgs),
                    message: message
                };
            }
        };
    };

    matchers.toBeOneOf = function () {
        return {
            compare: function (actual) {
                var expectedArgs = Array.prototype.slice.call(arguments, 1);
                return { pass: expectedArgs.indexOf(actual) !== -1 };
            }
        };
    };

    matchers.toHaveClass = function () {
        function generateCompare(isNot) {
            return function (actual, clazz) {
                var classes = clazz.trim().split(/\s+/), i;
                for (i = 0; i < classes.length; i += 1) {
                    if (!angular.element(actual[0]).hasClass(classes[i])) {
                        return { pass: isNot };
                    }
                }
                return { pass: !isNot };
            };
        }

        return {
            compare: generateCompare(false),
            negativeCompare: generateCompare(true)
        };
    };

    matchers.toThrowMinErr = function () {
        function generateCompare(isNot) {
            return function (actual, namespace, code, content) {
                var result,
                    exception,
                    message,
                    output,
                    exceptionMessage = '',
                    escapeRegexp = function (str) {
                        // This function escapes all special regex characters.
                        // We use it to create matching regex from arbitrary strings.
                        // http://stackoverflow.com/questions/3446170/escape-string-for-use-in-javascript-regex
                        return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
                    },
                    codeRegex = new RegExp('^\\[' + escapeRegexp(namespace) + ':' + escapeRegexp(code) + '\\]'),
                    not = isNot ? "not " : "",
                    regex = jasmine.isA_("RegExp", content) ? content :
                            angular.isDefined(content) ? new RegExp(escapeRegexp(content)) : undefined;

                if (!angular.isFunction(actual)) {
                    throw new Error('Actual is not a function');
                }

                try {
                    actual();
                } catch (e) {
                    exception = e;
                }

                if (exception) {
                    exceptionMessage = exception.message || exception;
                }

                message = function () {
                    return "Expected function " + not + "to throw " +
                        namespace + "MinErr('" + code + "')" +
                        (regex ? " matching " + regex.toString() : "") +
                        (exception ? ", but it threw " + exceptionMessage : ".");
                };

                result = codeRegex.test(exceptionMessage);
                if (!result) {
                    if (isNot) {
                        output = { pass: !result, message: message };
                    } else {
                        output = { pass: result, message: message };
                    }
                }

                if (angular.isDefined(regex)) {
                    if (isNot) {
                        output = { pass: !regex.test(exceptionMessage), message: message };
                    } else {
                        output = { pass: regex.test(exceptionMessage), message: message };
                    }
                }
                if (isNot) {
                    output = { pass: !result, message: message };
                } else {
                    output = { pass: result, message: message };
                }
                return output;
            };
        }
        return {
            compare: generateCompare(false),
            negativeCompare: generateCompare(true)
        };
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
     * date before
     */
    matchers.toBeBefore = function () {
        var test = function (actual, isNot, expected) {
            hlp.checkArgumentType(actual, 'date');
            hlp.checkArgumentType(expected, 'date');
            var result = actual.getTime() < expected.getTime();
            return {
                pass : isNot ? !result : result,
                message : "Expected '" + hlp.dp(actual) + "' to " + (isNot ? " not" : "") + " be before " + hlp.dp(expected)
            };
        };
        return hlp.evaluate.call(this, test);
    };

    /**
     * date after
     */
    matchers.toBeAfter = function (date) {
        var test = function (actual, isNot, expected) {
            hlp.checkArgumentType(actual, 'date');
            hlp.checkArgumentType(expected, 'date');
            var result = actual.getTime() > expected.getTime();
            return {
                pass : isNot ? !result : result,
                message : "Expected '" + hlp.dp(actual) + "' to " + (isNot ? " not" : "") + " be after " + hlp.dp(expected)
            };
        };
        return hlp.evaluate.call(this, test);
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
                message : "Expected " + hlp.dp(actual) + " to " + (isNot ? " not" : "") + " contain " + expected + " only once"
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
        return {
            compare : function (actual) {
                var expectedArgs = Array.prototype.slice.call(arguments, 1), date, part, dateFn, actualDateFn;
                hlp.checkArgumentCount(expectedArgs, 2);
                date = expectedArgs[0];
                part = expectedArgs[1];
                hlp.checkArgumentType(actual, 'date');
                hlp.checkArgumentType(date, 'date');
                hlp.checkArgumentType(part, 'string');
                dateFn = date['get' + part.toCamelCase()];
                actualDateFn = actual['get' + part.toCamelCase()];
                hlp.checkArgumentType(dateFn, 'function');
                hlp.checkArgumentType(actualDateFn, 'function');
                return {
                    pass: actual['get' + part.toCamelCase()]() === date['get' + part.toCamelCase()](),
                    message : hlp.msg.date.nomatch.Date.t(hlp.dp(actual['get' + part.toCamelCase()]()),
                        hlp.dp(date['get' + part.toCamelCase()]()))
                };
            }
        };
    };

    // aliases
    jasmine.addMatchers(matchers);

    // Keep a reference to the original matchers, for tests
    jasmine.__angular_jasmine_matchers__ = matchers;
});