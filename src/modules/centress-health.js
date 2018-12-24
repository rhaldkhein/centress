'use strict';

const centress = require('..');

centress.module(exports, {

  index: -9998,

  init: master => {
    master.app.get('/health', (req, res) => {
      res.end();
    });
  },

});