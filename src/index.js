'use strict';

const _ = require('lodash');
const glob = require('glob');

let userConfig = {};

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
 * Set single user configuration
 */

exports.set = (path, value) => {
  _.set(userConfig, path, value);
};

/**
 * Export module hub
 */

exports.module = require('./module');

/**
 * Return a module
 */

exports.get = exports.module.get;

/**
 * Boot up the server
 */

exports.boot = (pathRoot) => {

  // Mandatory options
  if (!_.isString(_.get(userConfig, 'path.root'))) {
    if (_.isString(pathRoot))
      _.set(userConfig, 'path.root', pathRoot);
    else
      throw new Error('Root path is required and must be string');
  }

  // Merge default and user config
  const baseConfig = _.defaultsDeep(
    // User config
    userConfig,
    // Default config
    require('./config')
  );

  // Apply master config for env vars
  const config = require('./config/master')(baseConfig);
  exports.config = config;

  // Initialize built-in logger
  const logger = exports.logger = require('./libs/logger');
  logger.init(config.log4js);

  // Globalize some objects for internal use
  global.__CENTRESS__.config = config;
  global.__CENTRESS__.logger = logger;

  // Exports libraries
  exports.lib = require('./libs');

  // Boot all centress modules passing centress object
  exports.module.boot(exports);

  // Start database and express server
  const database = require('./database');
  const server = require('./server');

  /**
   * Error handdler
   */

  function error(err) {
    database.close();
    logger.console.error(err);
  }

  /**
   * Boot sequence
   */

  Promise.resolve()
    .then(database)
    .then(server)
    .then(extensions)
    .catch(error);

};