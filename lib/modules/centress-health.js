'use strict';

var centress = require('..');

centress.module(exports, {
  index: -9998,
  init: function init(master) {
    master.app.get('/health', function (req, res) {
      res.end();
    });
  }
});