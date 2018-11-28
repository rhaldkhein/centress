'use strict';

const centress = require('../../../../src');

/**
 * Enable this module as centress module
 */

centress.module(exports, {

  prefix: '/',
  // index: 1,

  init: function (app) {

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

  routes: function (router) {

    router.get('/foo/world', (req, res) => {
      res.json({ foo: 'world' });
    });

  }

});

/**
 * Other custom exports
 */

exports.funcFoo = 'The Foo';