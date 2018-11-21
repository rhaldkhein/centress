'use strict';

const _ = require('lodash');
const express = require('express');
const http = require('http');
const bodyparser = require('body-parser');
const glob = require('glob');

const { config, logger } = global.__CENTRESS__;
const moduleFactory = require('./module');
const modules = moduleFactory.getAll();

module.exports = () => {

  const app = express();
  const server = http.Server(app);
  const baseUrl = config.baseUrl;

  // Apply express settings
  let expressSettings = config.express.settings;
  for (let key in expressSettings) app.set(key, expressSettings[key]);

  // Add body parsers. Only `json and form-urlencoded`, NOT multipart
  app.use(bodyparser.json());
  app.use(
    bodyparser.urlencoded({
      extended: true
    })
  );

  // Paths
  let pathRoutes = config.path.routes;
  // let pathModules = config.path.modules;

  /**
   * Initialize startup modules
   */

  for (const key in modules) {
    if (modules.hasOwnProperty(key)) {
      const elem = modules[key];
      if (_.isFunction(elem.init)) elem.init(app, server);
    }
  }

  /**
   * Important routes
   */

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

  /**
   * Modules routes
   */

  const baseRouter = express.Router();
  _.sortBy(_.values(modules), ['index']).forEach(mod => {
    if (!_.isFunction(mod.routes)) return;
    if (!_.isString(mod.prefix)) mod.prefix = '/' + mod.name;
    const moduleRouter = express.Router();
    mod.routes(moduleRouter, baseRouter);
    app.use(baseUrl + mod.prefix, moduleRouter);
  });
  app.use(baseUrl, baseRouter);

  /**
   * Static files
   */

  // Serve static files before ending routes
  let expressStatics = config.express.statics;
  expressStatics.forEach(elem => {
    app.use(express.static(elem.path, elem.options));
  });

  /**
   * Ending routes
   */

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

  /**
   * Listen server
   */
  let listen = new Promise((resolve, reject) => {
    let port = config.server.port;
    let host = config.server.host;
    logger.console.info(`Server: starting on ${host}:${port}`);
    server.listen(port, (err) => {
      if (err) reject(err);
      resolve();
      logger.console.info(`Server: started`);
    });
  });

  // Export app for use in other boot scripts
  return listen.return(app);

};