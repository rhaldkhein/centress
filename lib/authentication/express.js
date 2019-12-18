"use strict";

var _express = require("express");

if ('useAuthentication' in _express.application) throw new Error('Not compatible with express');

_express.application.useAuthentication = function (config) {
  var auth = this.$provider.service('@authentication');
  this.use(auth.initialize(config && config.initializeOptions));
  if (config && config.session) this.use(auth.session(config.sessionOptions));
};