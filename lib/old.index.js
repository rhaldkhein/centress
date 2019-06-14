'use strict';

var _ = require('lodash');

var glob = require('glob');

var callsite = require('callsite');

var path = require('path');

var userConfig = {};
/**
 * Load extensions
 */

function extensions(app) {
  var pathExt = __dirname + '/exts';
  glob.sync('*.js', {
    cwd: pathExt
  }).forEach(function (filename) {
    var fn = require(pathExt + '/' + filename);

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

exports.boot = function (pathRoot) {
  // Mandatory options
  if (!_.isString(_.get(userConfig, 'paths.root'))) {
    if (!_.isString(pathRoot)) pathRoot = path.dirname(callsite()[1].getFileName());

    _.set(userConfig, 'paths.root', pathRoot);
  } // Merge default and user config


  var baseConfig = _.defaultsDeep( // User config
  userConfig, // Default config
  require('./config')); // Apply master config for env vars


  var config = Object.freeze(require('./config/master')(baseConfig));
  exports.config = config; // Globalize some objects for internal use

  global.__CENTRESS__.config = config; // Initialize built-in logger

  var logger = require('./libs/logger/console'); // Boot all centress modules passing centress object


  exports.module.boot(exports); // Start database and express server

  var server = require('./server'); // Error handler


  function error(err) {
    server.error(err);
    logger.error(err);
  } // Boot sequence


  Promise.resolve().then(server).then(extensions)["catch"](error);
};
/**
 * Set mock flag. For developing centress module.
 */


exports.mock = function () {
  set('__mock__', true);
};