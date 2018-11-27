'use strict';

module.exports = class BaseError extends Error {
  constructor(code, message, data) {
    super(message);
    this.data = data;
  }
  init() { }
};