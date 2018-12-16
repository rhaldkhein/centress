'use strict';

const _ = require('lodash');
const glob = require('glob');
const callsite = require('callsite');
const path = require('path');

let userConfig = {};

/**
 * Load extensions
 */

function extensions(app) {
  let pathExt = __dirname + '/exts';
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

function set(path, value) {
  _.set(userConfig, path, value);
}
exports.set = set;

/**
 * Export internal libraries
 */
exports.lib = require('./libs');

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

exports.boot = pathRoot => {

  // Mandatory options
  if (!_.isString(_.get(userConfig, 'paths.root'))) {
    if (!_.isString(pathRoot))
      pathRoot = path.dirname(callsite()[1].getFileName());
    _.set(userConfig, 'paths.root', pathRoot);
  }

  // Merge default and user config
  const baseConfig = _.defaultsDeep(
    // User config
    userConfig,
    // Default config
    require('./config')
  );

  // Apply master config for env vars
  const config = Object.freeze(require('./config/master')(baseConfig));
  exports.config = config;

  // Globalize some objects for internal use
  global.__CENTRESS__.config = config;

  // Initialize built-in logger
  const logger = require('./libs/logger/console');

  // Boot all centress modules passing centress object
  exports.module.boot(exports);

  // Start database and express server
  const server = require('./server');

  // Error handler
  function error(err) {
    server.error(err);
    logger.error(err);
  }

  // Boot sequence
  Promise.resolve()
    .then(server)
    .then(extensions)
    .catch(error);

};

/**
 * Set mock flag. For developing centress module.
 */

exports.mock = () => {
  set('__mock__', true);
};