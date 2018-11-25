'use strict';

const centress = require('../../../../src');

/**
 * Enable this module as centress module
 */

centress.module(exports, {

  // prefix: '/test',
  // index: 1,

  init: function (app, server) {

    app.get('/test/bar', (req, res) => {
      res.json({ test: 'bar' });
    });

  },

  routes: (moduleRouter, baseRouter) => {

    moduleRouter.get('/test/world', (req, res) => {
      res.json({ test: 'world' });
    });

    baseRouter.get('/test/foo', (req, res) => {
      res.json({ test: 'foo' });
    });

  }

});

process.nextTick(() => {
  let a = centress.get('module-foo');
  console.log(a);
});

/**
 * Other custom exports
 */

exports.funcTest = 'The Test';