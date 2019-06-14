'use strict';

var _ = require('lodash');

var glob = require('glob');

var path = require('path');

var InternalError = require('./libs/error/internal');

var moduleConfigKeys = ['disabled', 'index', 'prefix'];
var isMother = false;
var motherCentress;
var depsPkg = {}; // NPM modules

var depsLoc = {}; // Local modules

var modules = {}; // All modules pool

var centresses = {}; // All centress modules pool

/**
 * Init and attach module
 */

function init(name, mod, centress, config) {
  // Must be a centress module
  if (!_.isFunction(mod.__CM__)) return; // Resolve individual module config

  var ctrs = _.assign(mod.__CM__(centress), _.pick(config.modules[name], moduleConfigKeys)); // Attach name


  ctrs.name = name; // Set default index

  if (_.isNil(ctrs.index)) ctrs.index = Number.MAX_SAFE_INTEGER * 0.1; // Attach centress module

  if (!ctrs.disabled) {
    if (modules[name]) throw new InternalError(InternalError.MODULE_CONFLICT, "Conflict module \"".concat(name, "\". Rename or remove the module to continue."));
    centresses[name] = ctrs;
    modules[name] = mod;
  }
}
/**
 * Creates a centress module
 */


module.exports = function (context, options) {
  if (context.__CM__) return;

  context.__CM__ = function (centress) {
    // `centress` here is the mother centress
    // that holds all other centress modules
    if (!isMother) motherCentress = centress;
    return options;
  };
};
/**
 * Export config keys
 */


module.exports.configKeys = moduleConfigKeys;
/**
 * Retrieve a centress module instance from local or mother
 */

module.exports.get = function (name) {
  // Try to get from local pool
  var mod = modules[name];

  if (!mod && motherCentress) {
    // Not in local, try to get from mother
    mod = motherCentress.module.get(name);
  }

  if (!mod) throw new InternalError(InternalError.MODULE_NOT_FOUND, "Module \"".concat(name, "\" is not found. Maybe the module is not mounted yet?"));
  return mod;
};
/**
 * Retrieve all module instances
 */


module.exports.getAll = function () {
  return _.clone(centresses);
};
/**
 * Scan and boot all centress modules and attach to modules object
 */


module.exports.boot = function (centress) {
  isMother = true;
  var config = global.__CENTRESS__.config;
  var configPath = config.paths;
  var pathRoot = configPath.root;
  var pathModConfigs = configPath.moduleConfigs; // Retrieve module config from directory

  glob.sync('*.js', {
    cwd: pathModConfigs
  }).forEach(function (filename) {
    var name = path.basename(filename, '.js'); // if (config.modules[name]) { // Show config override warning }

    config.modules[name] = require(pathModConfigs + '/' + filename);
  }); // Try to get dependencies names from package.json

  try {
    var pkg = require(pathRoot + '/package.json');

    var prodDeps = pkg.dependencies || {};
    var devDeps = pkg.devDependencies || {};
    depsPkg = _.merge(depsPkg, prodDeps, devDeps); // Add the working module as dependency

    if (config.__mock__) init(pkg.name, require(pathRoot + '/' + pkg.main), centress, config);
  } catch (error) {} // Nothing to do
  // Try to get dependencies names from local modules


  if (configPath.modules) {
    var locModPath = configPath.modules;

    var fnPushDepsLoc = function fnPushDepsLoc(filename) {
      depsLoc[path.basename(filename, '.js')] = locModPath;
    };

    glob.sync('*', {
      cwd: locModPath
    }).forEach(fnPushDepsLoc);
    locModPath = __dirname + '/modules';
    glob.sync('*', {
      cwd: locModPath
    }).forEach(fnPushDepsLoc);
  } // Scan NPM modules


  for (var key in depsPkg) {
    var dep = require(pathRoot + '/node_modules/' + key);

    init(key, dep, centress, config);
  } // Scan local modules


  if (!_.isEmpty(depsLoc)) {
    for (var _key in depsLoc) {
      var _dep = require(depsLoc[_key] + '/' + _key);

      init(_key, _dep, centress, config);
    }
  }
};