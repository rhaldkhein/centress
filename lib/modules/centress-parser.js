'use strict';

var _defaults = require('lodash/defaults');

var centress = require('..');

var bodyparser = require('body-parser');

var helmet = require('helmet');

centress.module(exports, {
  index: -9999,
  init: function init(main) {
    _defaults(main.config, {
      json: true,
      urlencoded: true,
      helmet: true,
      helmetConfig: {}
    });

    var config = main.config,
        app = main.app; // Use helmet

    if (config.helmet) app.use(helmet(config.helmetConfig)); // Parse application/json

    if (config.json) app.use(bodyparser.json()); // Parse application/x-www-form-urlencoded

    if (config.urlencoded) app.use(bodyparser.urlencoded({
      extended: true
    }));
  }
});