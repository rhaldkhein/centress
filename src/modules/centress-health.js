'use strict';

const centress = require('..');
const bodyparser = require('body-parser');

centress.module(exports, {

  index: Number.MIN_SAFE_INTEGER + 1001,

  init: (config, app) => {
    app.get('/health', (req, res) => {
      res.end();
    });
  },

});