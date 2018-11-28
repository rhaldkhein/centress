'use strict';

const express = require('express');
const centress = require('..');
const BaseError = centress.lib('error/base');
const HttpError = centress.lib('error/http');
const InternalError = centress.lib('error/internal');
const mapErrNameCode = {
  'ValidationError': InternalError.VALIDATION
};

let _app;
let _config;

centress.module(exports, {

  index: Number.MAX_SAFE_INTEGER - 999990,

  init: (app, config) => {
    _app = app;
    _config = config;
  },

  routes: () => {

    const logger = centress.lib('logger/file');

    let expressStatics = _config.folders || [];
    expressStatics.forEach(elem => {
      _app.use(express.static(elem.path, elem.options));
    });

    // Flush composed data
    _app.use((req, res) => {
      if (res.locals.__data)
        return res.success(res.locals.__data);
      throw new HttpError(HttpError.NOT_FOUND);
    });

    // Catch and flush error
    _app.use((err, req, res, next) => {
      // Convert other errors to local error
      if (err instanceof BaseError) {
        res.error(err);
      } else {
        let errCode = mapErrNameCode[err.name];
        // Only log unknown errors
        if (!errCode) {
          // Log to file on production
          logger.error(err.message);
        }
        res.error(
          new InternalError(errCode || InternalError.DEFAULT),
          err
        );
      }
    });

  }

});