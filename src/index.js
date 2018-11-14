'use strict';

const _isString = require('lodash/isString');
const _defaultsDeep = require('lodash/defaultsDeep');
const glob = require('glob');

/**
 * Boot sequence
 */

exports.boot = (userConfig) => {

  if (_isString(userConfig))
    userConfig = { path: { root: userConfig } };

  const config = _defaultsDeep(
    require('./config/master')(userConfig),
    userConfig,
    require('./config')
  );
  exports.config = config;

  const Logger = exports.logger = require('./libs/logger');
  Logger.init(config.log4js);

  global.__CENTRESS__.config = config;
  global.__CENTRESS__.logger = Logger;

  exports.lib = require('./libs');

  const service = require('./service');
  exports.service = service;

  const database = require('./database');
  const server = require('./server');


  /**
   * Load extensions
   */

  function extensions(app) {
    let pathExt = __dirname + '/extensions';
    glob.sync('*.js', { cwd: pathExt })
      .forEach(filename => {
        let fn = require(pathExt + '/' + filename);
        if (typeof fn === 'function') fn(app);
      });
    return app;
  }

  /**
   * Error handdler
   */

  function error(err) {
    database.close();
    Logger.console.error(err);
  }


  Promise.resolve()
    .then(database)
    .then(server)
    .then(extensions)
    .catch(error);

};