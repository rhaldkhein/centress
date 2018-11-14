'use strict';

const _set = require('lodash/set');
const centress = require('../../src');

let config = {};
_set(config, 'path.root', __dirname);
_set(config, 'server.port', 3002);

centress.boot(config);