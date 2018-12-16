'use strict';

const _ = require('lodash');
const glob = require('glob');
const path = require('path');
const InternalError = require('./libs/error/internal');

const initSettingsKeys = ['disabled', 'index', 'prefix'];

let isMother = false;
let motherCentress;

let depsPkg = {}; // NPM modules
let depsLoc = {}; // Local modules
let modules = {}; // All modules pool
let centresses = {}; // All centress modules pool


/**
 * Init and attach module
 */
function init(name, mod, centress, config) {
  // Must be a centress module
  if (!_.isFunction(mod.__CM__)) return;
  // Resolve settings
  let ctrs = _.assign(
    mod.__CM__(centress),
    _.pick(config.modules.settings[name], initSettingsKeys)
  );
  // Attach name
  ctrs.name = name;
  // Set default index
  if (_.isNil(ctrs.index))
    ctrs.index = Number.MAX_SAFE_INTEGER * 0.1;
  // Attach centress module
  if (!ctrs.disabled) {
    if (modules[name])
      throw new InternalError(
        InternalError.MODULE_CONFLICT,
        `Conflict module "${name}". Rename or remove the module to continue.`
      );
    centresses[name] = ctrs;
    modules[name] = mod;
  }
}

/**
 * Creates a centress module
 */
module.exports = (context, options) => {
  if (context.__CM__) return;
  context.__CM__ = centress => {
    // `centress` here is the mother centress
    // that holds all other centress modules
    if (!isMother) motherCentress = centress;
    return options;
  };
};

/**
 * Retrieve a centress module instance from local or mother
 */
module.exports.get = name => {
  // Try to get from local pool
  let mod = modules[name];
  if (!mod && motherCentress) {
    // Not in local, try to get from mother
    mod = motherCentress.module.get(name);
  }
  if (!mod) throw new InternalError(
    InternalError.MODULE_NOT_FOUND,
    `Module "${name}" is not found. Maybe the module is not mounted yet?`
  );
  return mod;
};

/**
 * Retrieve all module instances
 */
module.exports.getAll = () => _.clone(centresses);

/**
 * Scan and boot all centress modules and attach to modules object
 */
module.exports.boot = centress => {

  isMother = true;

  let config = global.__CENTRESS__.config;
  let configPath = config.paths;
  let pathRoot = configPath.root;

  // Try to get dependencies names from package.json
  try {
    let pkg = require(pathRoot + '/package.json');
    let prodDeps = pkg.dependencies || {};
    let devDeps = pkg.devDependencies || {};
    depsPkg = _.merge(depsPkg, prodDeps, devDeps);
    // Add the working module as dependency
    if (config.__mock__)
      init(pkg.name, require(pathRoot + '/' + pkg.main), centress, config);
  } catch (error) {
    // Nothing to do
  }

  // Try to get dependencies names from local modules
  if (configPath.modules) {
    let locModPath = configPath.modules;
    let fnPushDepsLoc = filename => {
      depsLoc[path.basename(filename, '.js')] = locModPath;
    };
    glob.sync('*', { cwd: locModPath }).forEach(fnPushDepsLoc);
    locModPath = __dirname + '/modules';
    glob.sync('*', { cwd: locModPath }).forEach(fnPushDepsLoc);
  }

  // Scan NPM modules
  for (let key in depsPkg) {
    let dep = require(pathRoot + '/node_modules/' + key);
    init(key, dep, centress, config);
  }

  // Scan local modules
  if (!_.isEmpty(depsLoc)) {
    for (let key in depsLoc) {
      let dep = require(depsLoc[key] + '/' + key);
      init(key, dep, centress, config);
    }
  }

};