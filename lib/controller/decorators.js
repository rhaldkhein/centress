"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports._flush = _flush;
exports.api = api;
exports.page = page;
exports.authorize = authorize;
exports.get = get;
exports.put = put;
exports.post = post;
exports.del = del;
exports.patch = patch;

function _flush() {
  // return compiled methods
  // clean for next controller
  var _methods = methods;
  var _klass = klass;
  clean();
  return {
    methods: _methods,
    klass: _klass
  };
}

function clean() {
  methods = {};
  klass = {};
}

clean();
var klass;
var methods;

function decor(target, key, args) {
  if (!target) {
    // For class, loop through methods and add key and args
    for (var prop in methods) {
      if (methods.hasOwnProperty(prop)) methods[prop][key] = args;
    }

    return;
  } else {
    // For methods
    var des = methods[target.key];
    if (!des) methods[target.key] = des = {
      value: target.descriptor.value,
      name: target.key
    };
    return des;
  }
}
/**
 * Register new annotations below
 */
// CLASSES


function api() {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  return function (target) {
    if (target.kind !== 'class') return;
    decor(null, 'api', args);
  };
}

function page() {
  for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    args[_key2] = arguments[_key2];
  }

  return function (target) {
    if (target.kind !== 'class') return;
    decor(null, 'page', args);
  };
}

function authorize() {
  for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
    args[_key3] = arguments[_key3];
  }

  return function (target) {
    if (target.kind === 'class') decor(null, 'auth', args);else if (target.kind === 'method') decor(target).authMethod = args;
  };
} // METHODS


function get() {
  for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
    args[_key4] = arguments[_key4];
  }

  return function (target) {
    if (target.kind !== 'method') return;
    decor(target).httpGet = args;
  };
}

function put() {
  for (var _len5 = arguments.length, args = new Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
    args[_key5] = arguments[_key5];
  }

  return function (target) {
    if (target.kind !== 'method') return;
    decor(target).httpPut = args;
  };
}

function post() {
  for (var _len6 = arguments.length, args = new Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
    args[_key6] = arguments[_key6];
  }

  return function (target) {
    if (target.kind !== 'method') return;
    decor(target).httpPost = args;
  };
}

function del() {
  for (var _len7 = arguments.length, args = new Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {
    args[_key7] = arguments[_key7];
  }

  return function (target) {
    if (target.kind !== 'method') return;
    decor(target).httpDelete = args;
  };
}

function patch() {
  for (var _len8 = arguments.length, args = new Array(_len8), _key8 = 0; _key8 < _len8; _key8++) {
    args[_key8] = arguments[_key8];
  }

  return function (target) {
    if (target.kind !== 'method') return;
    decor(target).httpPatch = args;
  };
}