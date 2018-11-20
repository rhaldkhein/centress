'use strict';

const _ = require('lodash');
const express = require('express');
const http = require('http');
const bodyparser = require('body-parser');
const glob = require('glob');
const modules = require('./module').getAll();
const { config, logger } = global.__CENTRESS__;

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
      if (elem.init) elem.init(app, server);
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

  _.sortBy(_.values(modules), ['index']).forEach(mod => {
    if (!mod.routes) return;
    const moduleRouter = express.Router();
    mod.routes(moduleRouter, baseRouter);
  });

  const baseRouter = express.Router();
  if (pathModules) {
    let moduleRoutes = [];
    glob.sync('*/routes.js', { cwd: pathModules })
      .forEach(filename => {
        let route = require(pathModules + '/' + filename);
        if (!route.prefix) route.prefix = filename.split('/')[0];
        moduleRoutes.push(route);
      });
    _.sortBy(moduleRoutes, ['index']).forEach(route => {
      const moduleRouter = express.Router();
      // Pass the router for module only and global router
      route(moduleRouter, baseRouter);
      app.use(baseUrl + '/' + route.prefix, moduleRouter);
    });
    app.use(baseUrl, baseRouter);
  }

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