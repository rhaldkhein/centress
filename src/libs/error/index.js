'use strict';

const _ = require('lodash');
const BaseError = require('./base');

let errorFactory = (name, codes) => {

  class CustomError extends BaseError {
    constructor(code, message, data) {
      super(code, message, data);
      this.name = name + 'Error';
      this.code = code || CustomError.DEFAULT;
      let status = finalCodes[code];
      this.status = status || 400;
      this.init();
    }
  }

  let finalCodes = {};
  CustomError._prefix = errorFactory.prefix + name.toUpperCase() + '_';
  CustomError.DEFAULT = CustomError._prefix + 'GENERIC';
  _.forEach(codes, function (value, key) {
    let fullCode = CustomError._prefix + key;
    CustomError[key] = fullCode;
    finalCodes[fullCode] = value;
  });

  CustomError.create = (code, message) => {
    return new CustomError(code, message);
  };

  CustomError.throw = (code, message) => {
    throw new CustomError(code, message);
  };

  return CustomError;

};

module.exports = errorFactory;

errorFactory.BaseError = BaseError;
errorFactory.prefix = 'ERR_APP_';