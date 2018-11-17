'use strict';


const logger = global.__CENTRESS__.logger;
const path = global.__CENTRESS__.config.path;
const pathRoot = path.root;
const pathModules = path.modules;

let deps = null;
try {
  const pkg = require(pathRoot + '/package.json');
  deps = pkg.dependencies || null;
} catch (error) {
  logger.console.warn(`Can't find package.json. Skipped.`);
}

// Retreive a module instance
module.exports.get = name => require(pathModules + '/' + name);

// Reading Centress modules from package.json
module.exports._init = (app, server) => {

  if (!deps) return;

  for (const key in deps) {
    if (deps.hasOwnProperty(key)) {
      const dep = require(key);
      if (dep.centress && dep.init) {
        // It's a Centress module
        dep.init(app, server);
      }
    }
  }

};

module.exports._routes = (app, express, baseRouter) => {

  if (!deps) return;

  // for (const key in deps) {
  //   if (deps.hasOwnProperty(key)) {
  //     const dep = require(key);
  //     if (dep.centress && dep.routes) {
  //       // It's a Centress module
  //       dep.routes(app, server);
  //     }
  //   }
  // }

};