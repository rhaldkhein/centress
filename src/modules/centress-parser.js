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

    // Use helmet
    main.app.use(helmet(main.config.helmetConfig));

    // Parse application/json
    if (main.config.json)
      main.app.use(bodyparser.json());

    // Parse application/x-www-form-urlencoded
    if (main.config.urlencoded)
      main.app.use(
        bodyparser.urlencoded({
          extended: true
        })
      );

  },

});