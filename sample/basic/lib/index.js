"use strict";

var _lib = _interopRequireDefault(require("../../../lib"));

var _startup = require("./startup");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var app = (0, _lib["default"])();
app.configure(_startup.configureServices, _startup.configureApplication).start();