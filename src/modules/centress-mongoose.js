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

  index: Number.MIN_SAFE_INTEGER + 999992,

  init: master => {

    _.defaults(master.settings, defaults);

    if (_.isEmpty(master.settings.database)) return;

    if (master.settings.validateOnUpdate) mongoose.plugin(validateOnUpdate);

    const logger = centress.lib('logger/console');

    let host = master.settings.host + (master.settings.port ? ':' + master.settings.port : ''),
      credentials = master.settings.user ? master.settings.user + ':' + master.settings.password + '@' : '',
      url = 'mongodb://' + credentials;

    // Append host
    url += host;

    // Append database name
    url += '/' + master.settings.database;

    // Assign default promise to mongoose
    mongoose.Promise = global.Promise;

    // Initiate connection
    logger.debug(`Database: connecting to ${host}`);
    return mongoose
      .connect(url, master.settings.options)
      .then(() => logger.debug(`Database: connected`));
  },

  error: () => {
    mongoose.disconnect();
  }

});