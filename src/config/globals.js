'use strict';

module.exports = config => {

  /**
   * Own global namespace.
   */
  global.__CENTRESS__ = {};

  /**
   * Use bluebird as default promise.
   * Warnings are disable by default,
   * but enabled on development mdoe.
   */
  global.Promise = require('bluebird');

};