'use strict';

var InternalError = require('./error/internal');

var _require = require('express-validator/check'),
    param = _require.param,
    query = _require.query,
    body = _require.body,
    validationResult = _require.validationResult;

function check(req, res, next) {
  var errs = validationResult(req);
  if (errs.isEmpty()) return next();
  next(new InternalError(InternalError.VALIDATION, null, errs.array()));
}

function validate() {
  for (var _len = arguments.length, validations = new Array(_len), _key = 0; _key < _len; _key++) {
    validations[_key] = arguments[_key];
  }

  validations.push(check);
  return validations;
}

module.exports = {
  validate: validate,
  param: param,
  query: query,
  body: body
};