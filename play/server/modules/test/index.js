'use strict';

const centress = require('../../../../src');
const centressModule = centress.module;

/**
 * Enable this module as centress module
 */

centress.module(exports, {

  // prefix: '/test',
  // index: 1,

  init: function (app, server) {

    let a = centressModule.get('module-foo');
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