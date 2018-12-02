'use strict';

const centress = require('../../src');

centress.set('paths.modules', __dirname + '/features');

// Overriding default module settings
centress.set('modules.settings', {

  // 'module-test': {
  //   prefix: '/new_pref',
  //   index: 1
  // }

  // 'centress-mongoose': {
  //   config: { database: 'centress' }
  // }

});

centress.boot();