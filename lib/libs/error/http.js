'use strict'; // Default error class

var codes = {
  'BAD_REQUEST': 400,
  'NOT_FOUND': 404,
  'NOT_IMPLEMENTED': 501
};

var errorFactory = require('.');

module.exports = errorFactory('Http', codes);