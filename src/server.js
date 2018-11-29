'use strict';

const _ = require('lodash');
const express = require('express');
const http = require('http');
const { config } = global.__CENTRESS__;
const moduleFactory = require('./module');
const modules = _.sortBy(_.values(moduleFactory.getAll()), ['index']);
const logger = require('./libs/logger/console');

module.exports = () => {

  const app = express();
  const api = express.Router();
  const router = express.Router();
  const server = http.Server(app);

  app.use(config.apiBaseUrl, api);
  app.use(router);

  // Apply express settings
  let expressSettings = config.express.settings;
  for (let key in expressSettings) app.set(key, expressSettings[key]);

  /**
   * Initialize startup modules
   */
  function initModules() {
    let inits = [];
    modules.forEach(mod => {
      if (_.isFunction(mod.init)) {
        let settings = config.modules.settings[mod.name] || {};
        inits.push(mod.init({ app, api, router, server, config: settings.config || {} }));
      }
    });
    return Promise.all(inits);
  }

  /**
   * Modules routes
   */
  function setupModulesRoutes() {
    modules.forEach(mod => {
      if (!_.isString(mod.prefix)) mod.prefix = '/' + mod.name;
      const moduleApi = express.Router();
      const moduleRouter = express.Router();
      if (_.isFunction(mod.api)) {
        mod.api(moduleApi);
        api.use(mod.prefix, moduleApi);
      }
      if (_.isFunction(mod.routes)) {
        mod.routes(moduleRouter);
        router.use(mod.prefix, moduleRouter);
      }
    });
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
    .then(setupModulesRoutes)
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