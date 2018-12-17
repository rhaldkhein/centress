'use strict';

const express = require('express');
const centress = require('..');
const BaseError = centress.lib('error/base');
const HttpError = centress.lib('error/http');
const InternalError = centress.lib('error/internal');
const mapErrNameCode = {
  'ValidationError': InternalError.VALIDATION
};

let _master;

centress.module(exports, {

  index: Number.NaN,

  init: master => {
    _master = master;
  },

  api: () => {

    const logger = centress.lib('logger/file');

    // Flush composed data
    _master.api.use((req, res) => {
      if (res.locals.__data)
        return res.success(res.locals.__data);
      throw new HttpError(HttpError.NOT_FOUND);
    });

    // Catch and flush error
    _master.api.use((err, req, res, next) => {
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

  },

  routes: () => {

    let expressStatics = _master.settings.folders || [];
    expressStatics.forEach(elem => {
      _master.router.use(express.static(elem.path, elem.options));
    });

  }

});