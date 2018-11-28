'use strict';

const centress = require('../../../../src');

/**
 * Enable this module as centress module
 */

centress.module(exports, {

  prefix: '/',
  index: 2,

  init: function (app) {

    let a = centress.get('module-foo');
    console.log(a);

    app.get('/test/bar', (req, res) => {
      res.json({ test: 'bar' });
    });

  },

  routes: function (router) {

    router.get('/test/world', (req, res) => {
      res.json({ test: 'world' });
    });

  }

});

/**
 * Other custom exports
 */

exports.funcTest = 'The Test';