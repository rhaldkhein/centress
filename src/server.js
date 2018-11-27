'use strict';

const _ = require('lodash');
const express = require('express');
const http = require('http');
const glob = require('glob');
const { config } = global.__CENTRESS__;
const moduleFactory = require('./module');
const modules = _.sortBy(_.values(moduleFactory.getAll()), ['index']);
const logger = require('./libs/logger/console');

module.exports = () => {

  const app = express();
  const server = http.Server(app);
  const baseUrl = config.baseUrl;

  // Apply express settings
  let expressSettings = config.express.settings;
  for (let key in expressSettings) app.set(key, expressSettings[key]);

  // Paths
  let pathRoutes = config.path.routes;

  /**
   * Initialize startup modules
   */
  function initModules() {
    let inits = [];
    modules.forEach(mod => {
      if (_.isFunction(mod.init)) {
        let settings = config.modules.settings[mod.name] || {};
        inits.push(mod.init(settings.config || {}, app, server));
      }
    });
    return Promise.all(inits);
  }

  /**
   * Important routes
   */
  function setupImportantRoutes() {
    if (pathRoutes) {
      const importantRouter = express.Router();
      glob.sync('**/_*.js', { cwd: pathRoutes })
        .reverse().forEach(filename => {
          let url = filename.replace(/.js$/, '')
            .replace(/^_/, '')
            .replace(/\/_/, '/');
          require(pathRoutes + '/' + filename)(importantRouter, app);
          if (url === 'index') url = '';
          app.use(baseUrl + '/' + url, importantRouter);
        });
    }
  }

  /**
   * Modules routes
   */
  function setupModulesRoutes() {
    const baseRouter = express.Router();
    modules.forEach(mod => {
      if (!_.isFunction(mod.routes)) return;
      if (!_.isString(mod.prefix)) mod.prefix = '/' + mod.name;
      const moduleRouter = express.Router();
      mod.routes(moduleRouter, baseRouter, app);
      app.use(baseUrl + mod.prefix, moduleRouter);
    });
    app.use(baseUrl, baseRouter);
  }

  /**
   * Ending routes
   */
  function setupEndingRoutes() {
    if (pathRoutes) {
      const endingRouter = express.Router();
      glob.sync('**/[^_]*.js', { cwd: pathRoutes })
        .reverse().forEach(filename => {
          let url = filename.replace(/.js$/, '');
          require(pathRoutes + '/' + filename)(endingRouter, app);
          if (url === 'index') url = '';
          app.use(baseUrl + '/' + url, endingRouter);
        });
    }
  }

  /**
   * Listen server
   */
  function listenUp() {
    return new Promise((resolve, reject) => {
      let port = config.server.port;
      let host = config.server.host;
      logger.info(`Server: starting on ${host}:${port}`);
      server.listen(port, (err) => {
        if (err) reject(err);
        resolve();
        logger.info(`Server: started`);
      });
    });
  }

  // Export app for use in other boot scripts
  return Promise.resolve()
    .then(initModules)
    .then(setupImportantRoutes)
    .then(setupModulesRoutes)
    .then(setupEndingRoutes)
    .then(listenUp)
    .return(app);

};

// Bubble up errors to modules
module.exports.error = (err) => {
  modules.forEach(mod => {
    if (_.isFunction(mod.error))
      mod.error(err);
  });
};