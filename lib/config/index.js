'use strict';

var config = {}; // Sub Configs

require('./path')(config);

require('./system')(config);

require('./server')(config);

require('./vendors/express')(config);

require('./vendors/log4js')(config); // Globals


require('./globals')(config); // Export


module.exports = config;