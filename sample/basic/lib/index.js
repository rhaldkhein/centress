"use strict";

var _index = _interopRequireDefault(require("../../../index"));

var _startup = require("./startup");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var app = (0, _index["default"])();
app.configure(_startup.configureServices, _startup.configureApplication).on('start', function (prov) {
  prov.get('@server').listen();
}).start();