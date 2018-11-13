'use strict';

/* eslint-disable */

// Imports
const _noop = require('lodash/noop');
const production = process.env.NODE_ENV == 'production';
const log4js = require('log4js');

// Expose global own console class
const Logger = {

  // Initialize and configure
  init: config => {
    log4js.configure(config);
    // Converting native console on production
    if (production) {
      for (const key in console) {
        if (typeof console[key] == 'function') {
          console[key] = _noop;
        }
      }
    }
  },

  // Expost console logging
  console: log4js.getLogger(),

  // For development, log all to console (default)
  file: log4js.getLogger(production ? 'file' : undefined)

};


// Exports
module.exports = Logger;