'use strict';

var production = process.env.NODE_ENV == 'production';

var log4js = require('.');

module.exports = log4js.getLogger(production ? 'file' : undefined);