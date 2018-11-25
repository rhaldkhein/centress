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

    let a = centressModule.get('module-test');
    console.log(a);

    app.get('/foo/bar', (req, res) => {
      res.json({ foo: 'bar' });
    });

  },

  routes: (moduleRouter, baseRouter) => {

    moduleRouter.get('/foo/world', (req, res) => {
      res.json({ foo: 'world' });
    });

    baseRouter.get('/foo/foo', (req, res) => {
      res.json({ foo: 'foo' });
    });

  }

});


/**
 * Other custom exports
 */

exports.funcFoo = 'The Foo';