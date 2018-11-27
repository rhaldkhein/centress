'use strict';

/* eslint-disable */

const _noop = require('lodash/noop');
const production = process.env.NODE_ENV == 'production';
const log4js = require('log4js');

log4js.configure(global.__CENTRESS__.config.log4js || {});

// Supress native console on production
if (production) {
  for (const key in console) {
    if (typeof console[key] == 'function') {
      console[key] = _noop;
    }
  }
}

module.exports = log4js;