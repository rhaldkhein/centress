'use strict';

// Default error class
const codes = {
  'VALIDATION': 400
};

const errorFactory = require('.');
module.exports = errorFactory('Internal', codes);