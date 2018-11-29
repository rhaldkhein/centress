'use strict';

const centress = require('..');

centress.module(exports, {

  index: Number.MIN_SAFE_INTEGER + 999991,

  init: master => {
    master.app.get('/health', (req, res) => {
      res.end();
    });
  },

});