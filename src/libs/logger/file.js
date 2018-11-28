'use strict';

const production = process.env.NODE_ENV == 'production';
const log4js = require('.');

module.exports = log4js.getLogger(production ? 'file' : undefined);