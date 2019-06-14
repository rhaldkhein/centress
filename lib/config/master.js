'use strict';
/**
 * Environment Overrides & Others
 * 
 * Will not override, if `process.env.<prop>` is `undefined`
 */

var _defaultsDeep = require('lodash/defaultsDeep');

var pkg = require('../../package.json');

module.exports = function (userConfig) {
  var config = _defaultsDeep({
    // Log Level
    logLevel: process.env.APP_LOG_LEVEL,
    // Server
    server: {
      host: process.env.APP_HOST,
      port: process.env.APP_PORT || process.env.PORT
    }
  }, userConfig);

  if (!config.paths.modules) config.paths.modules = config.paths.root + '/modules';
  if (!config.paths.moduleConfigs) config.paths.moduleConfigs = config.paths.root + '/config';
  if (!config.log4js.appenders.file.filename) config.log4js.appenders.file.filename = "".concat(config.paths.root, "/logs/").concat(pkg.name, ".log");
  return config;
};