'use strict';

const _ = require('lodash');
const logger = global.__CENTRESS__.logger;
const path = global.__CENTRESS__.config.path;
const pathRoot = path.root;
let deps = null;
let modules = {};

// Try to get dependencies names from package.json
try {
  const pkg = require(pathRoot + '/package.json');
  deps = pkg.dependencies || null;
} catch (error) {
  logger.console.warn(`Can't find package.json. Skipped.`);
}

function initModule(name, centressModule) {
  centressModule.name = name;
  modules[name] = centressModule;
}

// Retrieve all module instances
exports.getAll = () => _.clone(modules);

// Retrieve a module instance
exports.get = name => modules[name];

// Scan and boot all centress modules and attach to modules object
exports.boot = centress => {
  if (_.isEmpty(deps)) return;

  for (const key in deps) {
    if (deps.hasOwnProperty(key)) {
      const dep = require(pathRoot + '/node_modules/' + key);
      if (_.isFunction(dep.centress)) {
        // It's a Centress module
        initModule(key, dep.centress(centress));
      }
    }
  }

};