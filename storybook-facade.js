'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _storybook = require('@kadira/storybook');

var _withReadme = require('storybook-readme/with-readme');

var _withReadme2 = _interopRequireDefault(_withReadme);

var _storybookAddonKnobs = require('@kadira/storybook-addon-knobs');

var knobs = _interopRequireWildcard(_storybookAddonKnobs);

var _storybookAddonSpecifications = require('storybook-addon-specifications');

var _expect = require('expect');

var _expect2 = _interopRequireDefault(_expect);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var storybook = {
  stories: {},
  action: _storybook.action,
  linkTo: _storybook.linkTo,
  withReadme: _withReadme2.default,
  knobs: knobs
};

var describe = function describe(name, tests) {
  storybook.stories = (0, _storybook.storiesOf)(name, module);
  tests();
};

var it = function it(name, test) {
  var stories = storybook.stories;
  var add = stories.addWithInfo || stories.add;

  add.call(stories, name, function () {
    var story = void 0;

    (0, _storybookAddonSpecifications.specs)(function () {
      return (0, _storybookAddonSpecifications.describe)(name, function () {
        story = test();
      });
    });

    return story || _react2.default.createElement(
      'div',
      null,
      'NO STORY AVAILABLE FOR THIS TEST'
    );
  });
};

var expect = function expect(received) {
  var callExpect = function callExpect(method) {
    for (var _len = arguments.length, expectedArgs = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      expectedArgs[_key - 1] = arguments[_key];
    }

    var expectedValue = expectedArgs[0] || '';
    var receivedFormatted = formatReceived(received, method);
    var name = 'expects ' + receivedFormatted + ' ' + method + ' ' + expectedValue;

    (0, _storybookAddonSpecifications.it)(name, function () {
      var _expectReal;

      (_expectReal = (0, _expect2.default)(received))[method].apply(_expectReal, expectedArgs);
    });
  };

  return expectMethods.reduce(function (expectObject, method) {
    expectObject[method] = callExpect.bind(null, method);
    return expectObject;
  }, {});
};

var formatReceived = function formatReceived(received, method) {
  if (method === 'toMatchSnapshot') {
    return 'component or value';
  } else if (typeof received === 'function') {
    return received.toString();
  } else if ((typeof received === 'undefined' ? 'undefined' : _typeof(received)) === 'object') {
    return JSON.stringify(received, null, 1);
  }

  return received;
};

var expectMethods = ['toBeAn', 'toBeFalsy', 'toBeFewerThan', 'toBeMoreThan', 'toBeTruthy', 'toContain', 'toContainKey', 'toContainKeys', 'toNotBeAn', 'toNotContain', 'toNotContainKey', 'toNotContainKeys', 'toNotInclude', 'toNotIncludeKey', 'toNotIncludeKeys', 'withArgs', 'withContext', 'toBe', 'toBeA', 'toBeGreaterThan', 'toBeGreaterThanOrEqualTo', 'toBeLessThan', 'toBeLessThanOrEqualTo', 'toEqual', 'toExclude', 'toExcludeKey', 'toExcludeKeys', 'toExist', 'toHaveBeenCalled', 'toHaveBeenCalledWith', 'toInclude', 'toIncludeKey', 'toIncludeKeys', 'toMatch', 'toNotBe', 'toNotBeA', 'toNotEqual', 'toNotExist', 'toNotHaveBeenCalled', 'toNotMatch', 'toNotThrow', 'toThrow', 'toMatchSnapshot', 'toBeCalled'];

_expect2.default.extend({
  toMatchSnapshot: function toMatchSnapshot() {
    _expect2.default.assert(true, 'expected a snapshot', this.actual);
    return this;
  },
  toBeCalled: function toBeCalled() {
    _expect2.default.assert(true, 'expected to be called', this.actual);
    return this;
  }
});

// this should actually perform the `only` function at some point
var fdescribe = function fdescribe(name, tests) {
  return describe(name, tests);
};
var fit = function fit(name, test) {
  return it(name, test);
};
var beforeAll = _storybookAddonSpecifications.before;
var afterAll = _storybookAddonSpecifications.after;
var jest = {
  fn: function fn(implementation) {
    return function jestFn() {};
  }, // eslint-disable-line
  clearAllTimers: function clearAllTimers() {},
  disableAutomock: function disableAutomock() {},
  enableAutomock: function enableAutomock() {},
  isMockFunction: function isMockFunction(fn) {},
  // eslint-disable-line
  genMockFromModule: function genMockFromModule(moduleName) {},
  // eslint-disable-line
  mock: function mock(moduleName, factory, options) {},
  // eslint-disable-line
  clearAllMocks: function clearAllMocks() {},
  resetAllMocks: function resetAllMocks() {},
  resetModules: function resetModules() {},
  runAllTicks: function runAllTicks() {},
  runAllTimers: function runAllTimers() {},
  runTimersToTime: function runTimersToTime(msToRun) {},
  // eslint-disable-line
  runOnlyPendingTimers: function runOnlyPendingTimers() {},
  // eslint-disable-line
  setMock: function setMock(moduleName, moduleExports) {},
  // eslint-disable-line
  unmock: function unmock(moduleName) {},
  // eslint-disable-line
  useFakeTimers: function useFakeTimers() {},
  useRealTimers: function useRealTimers() {},
  spyOn: function spyOn(object, methodName) {}
};

window.storybook = storybook;
window.jest = jest;
window.expect = expect;
window.describe = describe;
window.xdescribe = _storybookAddonSpecifications.xdescribe;
window.fdescribe = fdescribe;
window.it = it;
window.xit = _storybookAddonSpecifications.xit;
window.fit = fit;
window.beforeEach = _storybookAddonSpecifications.beforeEach;
window.afterEach = _storybookAddonSpecifications.afterEach;
window.beforeAll = beforeAll;
window.afterAll = afterAll;