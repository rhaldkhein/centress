'use strict';

const centress = require('../../src');

centress.set('paths.modules', __dirname + '/features');

// Overriding default module settings
centress.set('modules', {

  'module-test': {
    prefix: '/new_pref',
    index: 1,
    settings: {
      bbb: 'bbb'
    }
  }

  // 'centress-mongoose': {
  //   config: { database: 'centress' }
  // }

});

// centress.mock();

centress.boot();