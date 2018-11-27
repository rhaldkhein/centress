'use strict';

const centress = require('..');
const bodyparser = require('body-parser');

centress.module(exports, {

  index: Number.MIN_SAFE_INTEGER * 0.1,

  init: (_config, app) => {
    // Add body parsers. Only `json and form-urlencoded`, NOT multipart
    app.use(bodyparser.json());
    app.use(
      bodyparser.urlencoded({
        extended: true
      })
    );
  },

});