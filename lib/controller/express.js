"use strict";

var _express = require("express");

if ('useControllers' in _express.application) throw new Error('Not compatible with express');

_express.application.useControllers = function (options) {
  var controller = this.$provider.service('@controller');
  controller.setOptions(options);
  controller.mountControllers();
};