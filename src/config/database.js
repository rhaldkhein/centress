'use strict';

module.exports = config => {

  config.database = {};

  // Database name.
  config.database.name = '';

  // Database user.
  config.database.user = '';

  // Databse password.
  config.database.password = '';

  // Server hostname. For docker, this is the database container name.
  config.database.host = 'localhost';

  // Server port.
  config.database.port = 27017;

};