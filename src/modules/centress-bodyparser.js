'use strict';

const centress = require('..');
const bodyparser = require('body-parser');

centress.module(exports, {

  index: Number.MIN_SAFE_INTEGER + 999990,

  init: app => {
    // json and form-urlencoded
    app.use(bodyparser.json());
    app.use(
      bodyparser.urlencoded({
        extended: true
      })
    );
  },

});