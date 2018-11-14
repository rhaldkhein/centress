'use strict';

const _isEmpty = require('lodash/isEmpty');
const mongoose = require('mongoose');
const { config, logger } = global.__CENTRESS__;

function validateOnUpdate(schema) {

  function setRunValidators() {
    this.setOptions({ runValidators: true });
  }

  schema.pre('updateMany', setRunValidators);
  schema.pre('updateOne', setRunValidators);
  schema.pre('findOneAndUpdate', setRunValidators);

}

mongoose.plugin(validateOnUpdate);

// Boot up
module.exports = app => {

  if (_isEmpty(config.database.name)) return app;

  let host = config.database.host + (config.database.port ? ':' + config.database.port : ''),
    credentials = config.database.user ? config.database.user + ':' + config.database.password + '@' : '',
    url = 'mongodb://' + credentials;

  // Append host
  url += host;

  // Append database name
  url += '/' + config.database.name;

  // Assign default promise to mongoose
  mongoose.Promise = global.Promise;

  // Initiate connection
  logger.console.debug(`Database: connecting to ${host}`);
  return mongoose
    .connect(url, config.mongoose.options)
    .then(() => logger.console.debug(`Database: connected`))
    .return(app);

};

// Error on boot
module.exports.close = () => mongoose.disconnect();