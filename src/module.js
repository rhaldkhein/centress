'use strict';

const _ = require('lodash');
const glob = require('glob');
const path = require('path');
const InternalError = require('./libs/error/internal');

let isMother = false;
let motherCentress;

let depsPkg = {}; // NPM modules
let depsLoc = {}; // Local modules
let modules = {}; // All modules pool
let centresses = {}; // All centress modules pool


// Init and attach module
function init(name, mod, centress) {
  let cntrs = centresses[name] = mod.__CM__(centress);
  cntrs.name = name;
  modules[name] = mod;
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

// Retrieve a centress module instance from local or mother
module.exports.get = name => {
  // Try to get from local pool
  let mod = modules[name];
  if (!mod && motherCentress) {
    // Not in local, try to get from mother
    mod = motherCentress.module.get(name);
  }
  if (!mod) throw new InternalError(
    InternalError.MODULE_NOT_FOUND,
    `Module ${name} is not found. Maybe the module is not mounted yet.`
  );
  return mod;
};

// Retrieve all module instances
module.exports.getAll = () => _.clone(centresses);

// Scan and boot all centress modules and attach to modules object
module.exports.boot = centress => {

  isMother = true;

  let configPath = global.__CENTRESS__.config.path;
  let pathRoot = configPath.root;

  // Try to get dependencies names from package.json
  try {
    let pkg = require(pathRoot + '/package.json');
    let prodDeps = pkg.dependencies || {};
    let devDeps = pkg.devDependencies || {};
    depsPkg = _.merge(depsPkg, prodDeps, devDeps);
  } catch (error) {
    // Nothing to do
  }

  // Try to get dependencies names from local modules
  if (configPath.modules) {
    glob.sync('*', { cwd: configPath.modules })
      .forEach(filename => {
        depsLoc[path.basename(filename, '.js')] = null;
      });
  }

  // Scan NPM modules
  for (let key in depsPkg) {
    let dep = require(pathRoot + '/node_modules/' + key);
    if (_.isFunction(dep.__CM__)) {
      // It's a Centress module
      init(key, dep, centress);
    }
  }


  // Scan local modules
  if (configPath.modules) {
    for (let key in depsLoc) {
      let dep = require(configPath.modules + '/' + key);
      if (_.isFunction(dep.__CM__)) {
        // It's a Centress module
        init(key, dep, centress);
      }
    }
  }

};