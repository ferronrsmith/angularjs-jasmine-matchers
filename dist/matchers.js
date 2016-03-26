/*
 (c) Ferron Hanse 2016
 https://github.com/ferronrsmith/anuglarjs-jasmine-matchers
 Released under the MIT license

 Changelog

 removed toBeNan - now apart of jasmine 2
 deprecated toMatchRegex, use toMatch
 remove toBeSameDate, use toMatchDatePart({date: date, part: 'time'}) instead)
 remove toHaveId, use toHaveAttr('id', id)
 remove toBeDisabled, use toHaveIs(':disabled', true)
 remove toBeChecked, use toHaveIs(':checked', true)
 remove toBeEmpty, use toHaveIs(':empty', true)
 remove toBeHidden, use toHaveIs(':hidden', true)
 remove toBeVisible, use toHaveIs(':visible', true)
 remove toBeSelected, use toHaveIs(':selected', true)
 remove toBeNonEmptyString
 remove toHaveData

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
    var matchers = {},
        hlp = {},
        bjQuery = false,
        primitives = ['string', 'boolean', 'object', 'array', 'number', 'date', 'function'],
        types = ['val', 'text'],
        argTypes = ['attr', 'prop', 'is', 'css'];

    /**
     * Check if jQuery is present
     * @return {boolean} boolean indicating if jQuery is present
     */
    bjQuery = (function () {
        return (window.$ !== undefined || window.jQuery !== undefined);
    }());


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

    hlp.checkJQuery = function () {
        if (!bjQuery) {
            throw new Error("JQuery not detected");
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

    hlp.toHave = function (type) {
        return (function (t) {
            var test = function (actual, isNot, expected) {
                hlp.checkArgumentType(actual, 'object');
                hlp.checkArgumentType(expected, 'string');
                var result = actual[type]() === expected;
                return {
                    pass : isNot ? !result : result,
                    message : "Expected " + hlp.dp(actual[type]()) + " to " + (isNot ? " not" : "") + " to have " + type + " " + expected
                };
            };
            return hlp.evaluate.call(this, test);
        }(type));
    };

    hlp.toHaveArgs = function (type) {
        return (function (t) {
            return {
                compare : function (actual) {
                    var expectedArgs = Array.prototype.slice.call(arguments, 1), expected, prop, result;
                    hlp.checkArgumentCount(expectedArgs, 2);
                    prop = expectedArgs[0];
                    expected = expectedArgs[1];
                    hlp.checkArgumentType(prop, 'string');
                    if (t === 'is') {
                        hlp.checkJQuery();
                    }
                    result = actual[t](prop) === expected;
                    return {
                        pass : result,
                        message : "Expected [" + hlp.dp(t) + "] to be " + actual[t](prop)
                    };
                }
            };
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

    // primitive match generator
    angular.forEach(primitives, function (item) {
        matchers['toBe' + item.toCamelCase()] = function () {
            return hlp.toBeType(item);
        };
    });

    angular.forEach(types, function (item) {
        matchers['toHave' + item.toCamelCase()] = function () {
            return hlp.toHave(item);
        };
    });

    angular.forEach(argTypes, function (item) {
        matchers['toHave' + item.toCamelCase()] = function () {
            return hlp.toHaveArgs(item);
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
        var test = function (actual, isNot, expected) {
            var result = angular.equals(actual, expected);
            return {
                pass: isNot ? !result : result,
                message: "Expected " + hlp.dp(actual) + " data {0} to Equal ".t(isNot ? "not" : "") + expected
            };
        };
        return hlp.evaluate.call(this, test);
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

    matchers.toEqualError = function (message) {
        return {
            compare : function (actual, message) {
                var expected;
                if (actual.message && actual.name === 'Error') {
                    expected = angular.toJson(actual.message);
                } else {
                    expected = angular.toJson(actual);
                }
                return {
                    pass: actual.name === 'Error' && actual.message === message,
                    message : "Expected " + expected + " to {0} be an Error with message ".t(this.isNot ? "not" : "") + angular.toJson(message)
                };
            }
        };

    };

    matchers.toMatchError = function () {
        return {
            compare : function (actual, messageRegexp) {
                var expected;
                if (actual.message && actual.name === 'Error') {
                    expected = angular.toJson(actual.message);
                } else {
                    expected = angular.toJson(actual);
                }
                return {
                    pass: actual.name === 'Error' && messageRegexp.test(actual.message),
                    message : "Expected " + expected + " to {0} match an Error with message ".t(this.isNot ? "not" : "") + angular.toJson(messageRegexp)
                };
            }
        };
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
        var test = function (actual, isNot, expected) {
            var result = hlp.isOfType(actual, 'String')
                    && actual.length >= 10
                    && new Date(actual).toString() !== 'Invalid Date'
                    && new Date(actual).toISOString().slice(0, actual.length) === actual;
            return {
                pass : isNot ? !result : result,
                message : "Expected '" + hlp.dp(actual) + "' to " + (isNot ? " not" : "") + " be an Iso8601 date "
            };
        };
        return hlp.evaluate.call(this, test);
    };

    /**
     * Asserts subject is an Array with a defined number of members
     */
    matchers.toBeArrayOfSize = function () {
        var test = function (actual, isNot, size) {
            hlp.checkArgumentType(actual, 'array');
            hlp.checkArgumentType(size, 'number');
            var result = hlp.isOfType(actual, 'array') && actual.length === size;
            return {
                pass : isNot ? !result : result,
                message : "Expected '" + hlp.dp(actual) + "' to {0} be an [Array] of size {1}".t(isNot ? "not" : "", size)
            };
        };
        return hlp.evaluate.call(this, test);
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

    matchers.toContainSelector = function () {
        return {
            compare : function (actual, expected) {
                return {
                    pass: actual.find(expected).length,
                    message : "Expected '" + hlp.dp(actual) + "' to have contain '" + hlp.dp(expected) + "'."
                };
            }
        };
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
     * Any date getter can be used as comparison </br
     *        <br />
     *        <b>Tested with:</b>
     *        <b>
     *          See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date
     *          for a full list of supported parts
     *        </b>
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