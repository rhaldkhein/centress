'use strict';
/* eslint-disable */

var _noop = require('lodash/noop');

var production = process.env.NODE_ENV == 'production';

var log4js = require('log4js');

log4js.configure(global.__CENTRESS__.config.log4js || {}); // Supress native console on production

if (production) {
  for (var key in console) {
    if (typeof console[key] == 'function') {
      console[key] = _noop;
    }
  }
}

module.exports = log4js;