'use strict';

const centress = require('../../src');

centress.set('baseUrl', '/api');
centress.set('path.modules', __dirname + '/features');

// Overriding default module settings
centress.set('modules.settings', {
  'module-test': { 
    prefix: '/new_pref', 
    index: 1, 
    disabled: false,
    config: {}
  }
});

centress.boot(__dirname);