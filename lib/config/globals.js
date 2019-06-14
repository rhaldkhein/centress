'use strict';

module.exports = function (config) {
  /**
   * Own global namespace.
   */
  global.__CENTRESS__ = {};
  /**
   * Use bluebird as default promise.
   * With bluebird, Warnings are disable by default,
   * but enabled on development mode.
   */

  global.Promise = require('bluebird');
};