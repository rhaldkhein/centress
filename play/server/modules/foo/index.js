'use strict';

const centress = require('../../../../src');

/**
 * Enable this module as centress module
 */

centress.module(exports, {

  // prefix: '/',
  // index: 1,

  init: function (master) {

    let a = centress.get('module-test');
    console.log(a);

    let b = centress.get('yoo');
    console.log(b);

    let c = centress.get('baz');
    console.log(c);

    master.app.get('/foo/bar', (req, res) => {
      res.json({ foo: 'bar' });
    });

  },

  api: function (apiRouter) {

    apiRouter.get('/foo/world', (req, res) => {
      res.json({ foo: 'world' });
    });

  }

});

/**
 * Other custom exports
 */

exports.funcFoo = 'The Foo';