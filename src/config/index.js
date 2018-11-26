'use strict';

let config = {
  module: { settings: {} }
};

// Sub Configs
require('./path')(config);
require('./system')(config);
require('./server')(config);
require('./database')(config);

require('./vendors/express')(config);
require('./vendors/mongoose')(config);
require('./vendors/log4js')(config);

// Globals
require('./globals')(config);

// Export
module.exports = config;
