'use strict';

// Default error class
const codes = {
  'BAD_REQUEST': 400,
  'NOT_FOUND': 404,
  'NOT_IMPLEMENTED': 501
};

const errorFactory = require('.');
module.exports = errorFactory('Http', codes);