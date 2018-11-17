'use strict';

const InternalError = require('./error/internal');
const { param, query, body, validationResult } = require('express-validator/check');

function check(req, res, next) {
  const errs = validationResult(req);
  if (errs.isEmpty()) return next();
  next(new InternalError(InternalError.VALIDATION, null, errs.array()));
}

function validate(...validations) {
  validations.push(check);
  return validations;
}

module.exports = { validate, param, query, body };