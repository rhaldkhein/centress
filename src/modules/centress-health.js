'use strict';

const centress = require('..');

centress.module(exports, {

  index: Number.MIN_SAFE_INTEGER + 999991,

  init: app => {
    app.get('/health', (req, res) => {
      res.end();
    });
  },

});