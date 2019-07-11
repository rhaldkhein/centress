"use strict";

var _express = require("express");

if (_express.application.useControllers) throw new Error('Not compatible with express');

_express.application.useControllers = function (options) {
  var controller = this.$provider.service('@controller');
  controller.setOptions(options);
  controller.mountControllers();
};