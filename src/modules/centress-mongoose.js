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

  index: Number.MIN_SAFE_INTEGER * 0.2,

  init: config => {

    _.defaults(config, defaults);

    if (_.isEmpty(config.database)) return;

    if (config.validateOnUpdate) mongoose.plugin(validateOnUpdate);

    const logger = centress.lib('logger/console');

    let host = config.host + (config.port ? ':' + config.port : ''),
      credentials = config.user ? config.user + ':' + config.password + '@' : '',
      url = 'mongodb://' + credentials;

    // Append host
    url += host;

    // Append database name
    url += '/' + config.database;

    // Assign default promise to mongoose
    mongoose.Promise = global.Promise;

    // Initiate connection
    logger.debug(`Database: connecting to ${host}`);
    return mongoose
      .connect(url, config.options)
      .then(() => logger.debug(`Database: connected`));
  },

  error: () => {
    mongoose.disconnect();
  }

});