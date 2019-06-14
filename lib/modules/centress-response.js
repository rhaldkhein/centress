'use strict';

var express = require('express');

var centress = require('..');

var BaseError = centress.lib('error/base');
var HttpError = centress.lib('error/http');
var InternalError = centress.lib('error/internal');
var mapErrNameCode = {
  'ValidationError': InternalError.VALIDATION
};

var _master;

centress.module(exports, {
  index: Number.NaN,
  init: function init(master) {
    _master = master;
  },
  api: function api() {
    var logger = centress.lib('logger/file'); // Flush composed data

    _master.api.use(function (req, res, done) {
      if (res.locals.__data) return res.success(res.locals.__data);
      done(new HttpError(HttpError.NOT_FOUND));
    }); // Catch and flush error


    _master.api.use(function (err, req, res, next) {
      // Convert other errors to local error
      if (err instanceof BaseError) {
        res.error(err);
      } else {
        var errCode = mapErrNameCode[err.name]; // Only log unknown errors

        if (!errCode) {
          // Log to file on production
          logger.error(err.message);
        }

        res.error(new InternalError(errCode || InternalError.DEFAULT), err);
      }
    });
  },
  routes: function routes() {
    var expressStatics = _master.config.staticDirs || [];
    expressStatics.forEach(function (elem) {
      _master.router.use(express["static"](elem.path, elem.options));
    });
  }
});