'use strict';

const _set = require('lodash/set');
const centress = require('../src');

let config = {};
_set(config, 'baseUrl', '/api');
_set(config, 'path.root', __dirname);
// _set(config, 'database.name', 'centress');
_set(config, 'mongoose.options', { useNewUrlParser: true });

centress.boot(config);