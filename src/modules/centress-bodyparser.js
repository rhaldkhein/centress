'use strict';

const centress = require('..');
const bodyparser = require('body-parser');

centress.module(exports, {

  index: Number.MIN_SAFE_INTEGER + 999990,

  init: master => {
    // json and form-urlencoded
    master.app.use(bodyparser.json());
    master.app.use(
      bodyparser.urlencoded({
        extended: true
      })
    );
  },

});