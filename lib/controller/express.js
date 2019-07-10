"use strict";

var _express = require("express");

var _path = _interopRequireDefault(require("path"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

if (_express.application.useControllers) throw new Error('Not compatible with express');

_express.application.useControllers = function (config) {
  config = config || {
    paths: ['./controllers']
  };
  if (typeof config === 'string') config = {
    paths: [config]
  };
  var paths = config.paths;
  var core = this.$provider.service('__core__');
  var controller = this.$provider.service('@controller');
  controller.mountPaths(paths.map(function (p) {
    return _path["default"].resolve(core.path, p);
  }));
};