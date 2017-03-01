'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var itReal = it;

it = function it(name, test) {
  itReal(name, function () {
    // eslint-disable-line consistent-return
    var ret = test();

    // storybook `it` allows for returning the story component,
    // but undefined or promises is expected in jest
    if (isPromise(ret)) {
      return ret;
    }
  });
};

var isPromise = function isPromise(val) {
  return (typeof val === 'undefined' ? 'undefined' : _typeof(val)) === 'object' && val.next;
};

global.storybook = {
  action: function action(name) {
    return function () {
      return console.log('action', name);
    };
  },
  linkTo: function linkTo(component, story) {
    return function () {
      return console.log('linkTo', component, story);
    };
  },
  withReadme: function withReadme(readme) {
    return null;
  }, // eslint-disable-line no-unused-vars
  knobs: {
    text: function text(label, value) {
      return value;
    },
    boolean: function boolean(label, value) {
      return value;
    },
    number: function number(label, value, options) {
      return value;
    }, // eslint-disable-line no-unused-vars
    color: function color(label, value) {
      return value;
    },
    object: function object(label, value) {
      return value;
    },
    array: function array(label, value) {
      var separator = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : ',';
      return value;
    }, // eslint-disable-line no-unused-vars
    select: function select(label, options, value) {
      return value;
    },
    date: function date(label, value) {
      return value;
    }
  },
  stories: {
    addDecorator: function addDecorator() {
      return null;
    },
    add: function add() {
      return null;
    },
    addWithInfo: function addWithInfo() {
      return null;
    }
  }
};