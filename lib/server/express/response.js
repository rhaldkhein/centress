"use strict";

var _express = require("express");

var _error = require("../error");

var prod = process.env.NODE_ENV === 'production';
if (_express.response.jsonError) throw new Error('Can\'t bind jsonError to response');

_express.response.jsonError = function (error) {
  if (!error) error = new _error.AppError();

  if (!(error instanceof _error.AppError)) {
    error = new _error.AppError(error.payload || error.details || (prod ? undefined : error.stack), error.meta, error.message, error.status, error.code);
  }

  error.send(this);
};

if (_express.response.jsonSuccess) throw new Error('Can\'t bind jsonSuccess to response');

_express.response.jsonSuccess = function (payload, options) {
  this.status(200).json({
    success: {
      code: options && options.code || 'OK'
    },
    meta: options && options.meta,
    payload: payload
  });
};