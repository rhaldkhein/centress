"use strict";

var _express = require("express");

var _error = _interopRequireDefault(require("../error"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

if (_express.response.jsonError) throw new Error('Can\'t bind jsonError to response');

_express.response.jsonError = function () {
  return new _error["default"](this);
};

if (_express.response.jsonSuccess) throw new Error('Can\'t bind jsonSuccess to response');

_express.response.jsonSuccess = function (payload, opt) {
  this.status(200).json({
    success: {
      code: opt && opt.code || 'OK'
    },
    meta: opt && opt.meta,
    payload: payload
  });
};