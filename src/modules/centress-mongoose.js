'use strict';

const _ = require('lodash');
const centress = require('..');
const mongoose = require('mongoose');

const defaults = {
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
    this.setOptions({ runValidators: true });
  }

  schema.pre('updateMany', setRunValidators);
  schema.pre('updateOne', setRunValidators);
  schema.pre('findOneAndUpdate', setRunValidators);

}

centress.module(exports, {

  index: -9997,

  init: main => {

    _.defaults(main.config, defaults);

    const logger = centress.lib('logger/console');

    if (_.isEmpty(main.config.database)) {
      logger.info(`Database: skipped as not configured`)
      return;
    }

    if (main.config.validateOnUpdate) mongoose.plugin(validateOnUpdate);

    let host = main.config.host + (main.config.port ? ':' + main.config.port : ''),
      credentials = main.config.user ? main.config.user + ':' + main.config.password + '@' : '',
      url = 'mongodb://' + credentials;

    // Append host
    url += host;

    // Append database name
    url += '/' + main.config.database;

    // Assign default promise to mongoose
    mongoose.Promise = global.Promise;

    // Initiate connection
    logger.debug(`Database: connecting to ${host}`);
    return mongoose
      .connect(url, main.config.options)
      .then(() => logger.debug(`Database: connected`));
  },

  error: () => {
    mongoose.disconnect();
  }

});