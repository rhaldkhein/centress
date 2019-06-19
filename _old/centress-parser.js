'use strict';

const _defaults = require('lodash/defaults');
const centress = require('..');
const bodyparser = require('body-parser');
const helmet = require('helmet')

centress.module(exports, {

  index: -9999,

  init: main => {

    _defaults(main.config, {
      json: true,
      urlencoded: true,
      helmet: true,
      helmetConfig: {}
    });

    const { config, app } = main;

    // Use helmet
    if (config.helmet)
      app.use(helmet(config.helmetConfig));

    // Parse application/json
    if (config.json)
      app.use(bodyparser.json());

    // Parse application/x-www-form-urlencoded
    if (config.urlencoded)
      app.use(
        bodyparser.urlencoded({
          extended: true
        })
      );

  },

});