'use strict';

const centress = require('../../src');

centress.set('baseUrl', '/api');
centress.set('path.modules', __dirname + '/features');

centress.boot(__dirname);