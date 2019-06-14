'use strict';

var production = process.env.NODE_ENV == 'production';

module.exports = function (config) {
  config.log4js = {
    pm2: true,
    appenders: {
      console: {
        type: 'console'
      },
      file: {
        type: 'file',
        // filename: `logs/server.log`,
        maxLogSize: 10485760,
        backups: 3,
        compress: true
      }
    },
    categories: {
      // For production, get log level from config
      "default": {
        appenders: ['console'],
        level: production ? config.logLevel : 'all'
      },
      // Specific log level for other outputs
      file: {
        appenders: ['file'],
        level: 'info'
      }
    }
  };
};