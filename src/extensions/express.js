'use strict';

const { config } = global.__SYNTRESS__;
const express = require('express');
const prodErrorMessage = 'Error occured. Please see server logs.';

if (express.response.success) throw new Error(`Can't extend express with "success" method. Upgraded express?`);
express.response.success = function (payload, code = 'OK') {
  this.status(200).json({
    success: true,
    code,
    payload
  });
};

if (express.response.error) throw new Error(`Can't extend express with "error" method. Upgraded express?`);
express.response.error = function (err, payload) {
  this.status(err.status || 400).json({
    error: true,
    code: err.code || null,
    // #SECURITY: Error message must not be sent to client on production
    message: config.prod ? prodErrorMessage : err.message || null,
    // User payload, otherwire error object
    payload: payload || err
  });
};

if (express.response.data) throw new Error(`Can't extend express with "data" method. Upgraded express?`);
express.response.data = function (name, value) {
  if (!this.locals.__data) this.locals.__data = {};
  if (name) this.locals.__data[name] = value;
};

if (express.response.read) throw new Error(`Can't extend express with "read" method. Upgraded express?`);
express.response.read = function (name) {
  if (!this.locals.__data) return;
  return this.locals.__data[name];
};