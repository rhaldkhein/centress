'use strict';

/**
 * Environment Overrides & Others
 * 
 * Will not override if env is `undefined`
 */

const pkg = require('../../package.json');

module.exports = userConfig => {
  return {

    // Log Level
    logLevel: process.env.APP_LOG_LEVEL,

    // Path
    path: {
      routes: userConfig.path.root + '/routes',
      modules: userConfig.path.root + '/modules'
    },

    // Server
    server: {
      host: process.env.APP_HOST,
      port: process.env.APP_PORT || process.env.PORT
    },

    // Database
    database: {
      name: process.env.APP_DB_NAME,
      user: process.env.APP_DB_USER,
      password: process.env.APP_DB_PASS,
      host: process.env.APP_DB_HOST,
      port: process.env.APP_DB_PORT
    },

    /**
     * VENDORS
     */

    log4js: {
      appenders: {
        file: {
          filename: `${userConfig.path.root}/logs/${pkg.name}.log`
        }
      }
    }

  };
};