'use strict';

/**
 * Environment Overrides & Others
 * 
 * Will not override, if `process.env.<prop>` is `undefined`
 */

const _defaultsDeep = require('lodash/defaultsDeep');
const pkg = require('../../package.json');

module.exports = userConfig => {

  let config = _defaultsDeep(
    {
      // Log Level
      logLevel: process.env.APP_LOG_LEVEL,
      // Server
      server: {
        host: process.env.APP_HOST,
        port: process.env.APP_PORT || process.env.PORT
      }
    },
    userConfig
  );

  if (!config.path.routes)
    config.path.routes = config.path.root + '/routes';

  if (!config.path.modules)
    config.path.modules = config.path.root + '/modules';

  if (!config.log4js.appenders.file.filename)
    config.log4js.appenders.file.filename = `${config.path.root}/logs/${pkg.name}.log`;

  return config;
};