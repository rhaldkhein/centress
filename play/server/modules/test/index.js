'use strict';

const centress = require('../../../../src');

/**
 * Enable this module as centress module
 */

centress.module(exports, {

  prefix: '/test',
  index: 2,

  init: function (config, app, server) {

    let a = centress.get('module-foo');
    console.log(a);

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

/**
 * Other custom exports
 */

exports.funcTest = 'The Test';