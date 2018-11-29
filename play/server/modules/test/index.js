'use strict';

const centress = require('../../../../src');

/**
 * Enable this module as centress module
 */

centress.module(exports, {

  // prefix: '/',
  index: 2,

  init: function (master) {

    let a = centress.get('module-foo');
    console.log(a);

    master.app.get('/test/bar', (req, res) => {
      res.json({ test: 'bar' });
    });

  },

  api: function (apiRouter) {

    apiRouter.get('/test/world', (req, res) => {
      res.json({ test: 'world' });
    });

  }

});

/**
 * Other custom exports
 */

exports.funcTest = 'The Test';