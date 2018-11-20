'use strict';

const _isEmpty = require('lodash/isEmpty');
const _clone = require('lodash/clone');
const logger = global.__CENTRESS__.logger;
const path = global.__CENTRESS__.config.path;
const pathRoot = path.root;
const pathModules = path.modules;
let deps = null;
let modules = {};

// Try to get dependencies names from package.json
try {
  const pkg = require(pathRoot + '/package.json');
  deps = pkg.dependencies || null;
} catch (error) {
  logger.console.warn(`Can't find package.json. Skipped.`);
}

function initModule(name, mod) {
  modules[name] = mod;
}

// Retrieve all module instances
exports.getAll = () => _clone(modules);

// Retrieve a module instance
exports.get = name => require(pathModules + '/' + name);

// Scan centress modules and attach to modules object
exports.scan = () => {
  if (_isEmpty(deps)) return;

  for (const key in deps) {
    if (deps.hasOwnProperty(key)) {
      const dep = require(key);
      if (dep.centress) {
        // It's a Centress module
        initModule(key, dep);
      }
    }
  }

};