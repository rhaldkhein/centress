'use strict';

const _isString = require('lodash/isString');
const _defaultsDeep = require('lodash/defaultsDeep');
const glob = require('glob');

/**
 * Load extensions
 */

function extensions(app) {
  let pathExt = __dirname + '/extensions';
  glob.sync('*.js', { cwd: pathExt })
    .forEach(filename => {
      let fn = require(pathExt + '/' + filename);
      if (typeof fn === 'function') fn(app);
    });
  return app;
}

/**
 * Boot sequence
 */

exports.boot = (userConfig) => {

  // Mandatory options
  if (_isString(userConfig))
    userConfig = { path: { root: userConfig } };

  // Building configs to single object
  const config = _defaultsDeep(
    // Environment config
    require('./config/master')(userConfig),
    // User config
    userConfig,
    // Default config
    require('./config')
  );
  exports.config = config;

  // Initialize built-in logger
  const logger = exports.logger = require('./libs/logger');
  logger.init(config.log4js);

  global.__CENTRESS__.config = config;
  global.__CENTRESS__.logger = logger;

  exports.lib = require('./libs');
  const modules = exports.module = require('./module');
  modules.scan();

  const database = require('./database');
  const server = require('./server');

  /**
   * Error handdler
   */

  function error(err) {
    database.close();
    logger.console.error(err);
  }


  Promise.resolve()
    .then(database)
    .then(server)
    .then(extensions)
    .catch(error);

};