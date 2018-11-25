'use strict';

const centress = require('../../src');

centress.set('baseUrl', '/api');
centress.set('path.modules', __dirname + '/features');

// Overriding default module settings
centress.set('module.settings', {
  'module-test': { prefix: '/new_pref', index: 1 }
});

centress.boot(__dirname);