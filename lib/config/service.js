"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _path = _interopRequireDefault(require("path"));

var _fs = _interopRequireDefault(require("fs"));

var _lodash = _interopRequireDefault(require("lodash.defaultsdeep"));

var _lodash2 = _interopRequireDefault(require("lodash.get"));

var _debug = _interopRequireDefault(require("debug"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var debugConfig = (0, _debug["default"])('excore:config');
var prod = process.env.NODE_ENV === 'production';

var Config =
/*#__PURE__*/
function () {
  function Config(provider, opt) {
    _classCallCheck(this, Config);

    _defineProperty(this, "config", null);

    var core = provider.service('core');
    var option = (0, _lodash["default"])({}, opt, {
      file: './config.js',
      devFile: './config.dev.js'
    });

    var file = _path["default"].resolve(core.path, option.file);

    var devFile = _path["default"].resolve(core.path, option.devFile);

    var config = {};
    var devConfig = {};

    try {
      if (_fs["default"].existsSync(file)) {
        config = require(file);
        config = config["default"] || config;
      }

      if (_fs["default"].existsSync(devFile)) {
        devConfig = require(devFile);
        devConfig = devConfig["default"] || devConfig;
      }
    } catch (e) {// Nothing
    }

    this.config = (0, _lodash["default"])(prod ? {} : devConfig, config);
    debugConfig('created ...%s', file.substr(file.length - 24));
  }

  _createClass(Config, [{
    key: "get",
    value: function get(path, defaultValue) {
      return (0, _lodash2["default"])(this.config, path, defaultValue);
    }
  }]);

  return Config;
}();

exports["default"] = Config;

_defineProperty(Config, "service", '@config');