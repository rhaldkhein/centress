'use strict';

var _ = require('lodash');

var centress = require('..');

var mongoose = require('mongoose');

var defaults = {
  user: process.env.APP_DB_USER || '',
  password: process.env.APP_DB_PASS || '',
  database: process.env.APP_DB_NAME || '',
  host: process.env.APP_DB_HOST || 'localhost',
  port: process.env.APP_DB_PORT || 27017,
  validateOnUpdate: true,
  options: {
    useNewUrlParser: true
  }
};

function validateOnUpdate(schema) {
  function setRunValidators() {
    this.setOptions({
      runValidators: true
    });
  }

  schema.pre('updateMany', setRunValidators);
  schema.pre('updateOne', setRunValidators);
  schema.pre('findOneAndUpdate', setRunValidators);
}

centress.module(exports, {
  index: -9997,
  init: function init(main) {
    _.defaults(main.config, defaults);

    var config = main.config;
    var logger = centress.lib('logger/console');

    if (_.isEmpty(config.database)) {
      logger.info("Database: skipped as not configured");
      return;
    }

    if (config.validateOnUpdate) mongoose.plugin(validateOnUpdate);
    var host = config.host + (config.port ? ':' + config.port : ''),
        credentials = config.user ? config.user + ':' + config.password + '@' : '',
        url = 'mongodb://' + credentials; // Append host

    url += host; // Append database name

    url += '/' + config.database; // Assign default promise to mongoose

    mongoose.Promise = global.Promise; // Initiate connection

    logger.debug("Database: connecting to ".concat(host));
    return mongoose.connect(url, config.options).then(function () {
      return logger.debug("Database: connected");
    });
  },
  error: function error() {
    mongoose.disconnect();
  }
});