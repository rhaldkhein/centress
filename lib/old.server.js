'use strict';

var _ = require('lodash');

var express = require('express');

var http = require('http');

var config = global.__CENTRESS__.config;

var moduleFactory = require('./module');

var modules = _.sortBy(_.values(moduleFactory.getAll()), ['index']);

var logger = require('./libs/logger/console');

module.exports = function () {
  var app = express();
  var api = express.Router();
  var router = express.Router();
  var server = http.Server(app);
  app.use(config.apiBaseUrl, api);
  app.use(router); // Apply express settings

  var expressSettings = config.express.settings;

  for (var key in expressSettings) {
    app.set(key, expressSettings[key]);
  }
  /**
   * Initialize startup modules
   */


  function initModules() {
    var inits = [];
    modules.forEach(function (mod) {
      if (_.isFunction(mod.init)) {
        var modConfig = config.modules[mod.name] || {};
        inits.push(mod.init({
          app: app,
          api: api,
          router: router,
          server: server,
          config: _.omit(modConfig, moduleFactory.configKeys)
        }));
      }
    });
    return Promise.all(inits);
  }
  /**
   * Modules routes
   */


  function setupModulesRoutes() {
    modules.forEach(function (mod) {
      if (!_.isString(mod.prefix)) mod.prefix = '/' + mod.name;

      if (_.isFunction(mod.api)) {
        var moduleApi = express.Router();
        mod.api(moduleApi);
        api.use(mod.prefix, moduleApi);
      }

      if (_.isFunction(mod.routes)) {
        var moduleRouter = express.Router();
        mod.routes(moduleRouter);
        router.use(mod.prefix, moduleRouter);
      }
    });
  }
  /**
   * Listen server
   */


  function listenUp() {
    return new Promise(function (resolve, reject) {
      var port = config.server.port;
      var host = config.server.host;
      logger.info("Server: starting on ".concat(host, ":").concat(port));
      server.listen(port, function (err) {
        if (err) reject(err);
        resolve();
        logger.info("Server: started");
      });
    });
  } // Export app for use in other boot scripts


  return Promise.resolve().then(initModules).then(setupModulesRoutes).then(listenUp)["return"](app);
}; // Bubble up errors to modules


module.exports.error = function (err) {
  modules.forEach(function (mod) {
    if (_.isFunction(mod.error)) mod.error(err);
  });
};