'use strict';


module.exports = config => {

  // Status flags
  config.production = process.env.NODE_ENV === 'production';
  config.prod = config.production;
  config.development = !config.production;
  config.dev = config.development;

  // Set log level
  config.logLevel = 'all';

  // Base url
  config.baseUrl = '';

};