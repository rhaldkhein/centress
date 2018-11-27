'use strict';

const centress = require('../../../../src');

/**
 * Enable this module as centress module
 */

centress.module(exports, {

  // prefix: '/test',
  // index: 1,

  init: (config, app, server) => {

    let a = centress.get('module-test');
    console.log(a);

    let b = centress.get('yoo');
    console.log(b);

    let c = centress.get('baz');
    console.log(c);

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