'use strict'; // Default error class

var codes = {
  'VALIDATION': 400,
  'MODULE_NOT_FOUND': 404,
  'MODULE_CONFLICT': 400
};

var errorFactory = require('.');

module.exports = errorFactory('Internal', codes);