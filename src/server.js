'use strict';

const _ = require('lodash');
const express = require('express');
const http = require('http');
const bodyparser = require('body-parser');
const glob = require('glob');
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
  let pathServices = config.path.services;

  // Initiate startup services
  if (pathServices) {
    glob.sync('*/init.js', { cwd: pathServices })
      .forEach(filename => {
        require(pathServices + '/' + filename)(app, server);
      });
  }

  // Important routes
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

  // Services routes
  if (pathServices) {
    let serviceRoutes = [];
    const apiRouter = express.Router();
    glob.sync('*/routes.js', { cwd: pathServices })
      .forEach(filename => {
        let route = require(pathServices + '/' + filename);
        if (!route.prefix) route.prefix = filename.split('/')[0];
        serviceRoutes.push(route);
      });
    _.sortBy(serviceRoutes, ['index']).forEach(route => {
      const serviceRouter = express.Router();
      // Pass the router for service only and global router
      route(serviceRouter, apiRouter);
      app.use(baseUrl + '/' + route.prefix, serviceRouter);
    });
    app.use(baseUrl, apiRouter);
  }

  // Serve static files before ending routes
  let expressStatics = config.express.statics;
  expressStatics.forEach(elem => {
    app.use(express.static(elem.path, elem.options));
  });

  // Ending routes
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

  // Listen
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