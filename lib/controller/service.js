"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _glob = _interopRequireDefault(require("glob"));

var _debug = _interopRequireDefault(require("debug"));

var _decorators = require("./decorators");

require("./express");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var debugCtrl = (0, _debug["default"])('excore:controller');

var Controller =
/*#__PURE__*/
function () {
  function Controller(provider) {
    _classCallCheck(this, Controller);

    this.server = provider.service('@server');
    this.auth = provider.service('@authentication');
    debugCtrl('created');
  }

  _createClass(Controller, [{
    key: "mountPaths",
    value: function mountPaths(paths) {
      var _this = this;

      paths.forEach(function (path) {
        _glob["default"].sync(path + '/**/*.js').forEach(function (file) {
          require(file);

          _this._register((0, _decorators._flush)());

          debugCtrl('file ...%s', file.substr(file.length - 24));
        });
      });
      debugCtrl('done');
    }
  }, {
    key: "_register",
    value: function _register(_ref) {
      var methods = _ref.methods;

      for (var key in methods) {
        if (methods.hasOwnProperty(key)) {
          var des = methods[key];
          if (des.api) this._addMethod(this.server.appApi, des, '/' + des.api[0]);
          if (des.page) this._addMethod(this.server.appRoot, des, '/' + des.page[0]);
        }
      }
    }
  }, {
    key: "_addMethod",
    value: function _addMethod(router, des, baseUrl) {
      if (!baseUrl) return;
      var mw = []; // middlewares
      // Add authentication

      if (des.auth) {
        if (des.authMethod) {
          if (des.authMethod[0] !== false) mw.push(this.auth.authorize(des.authMethod[0], des.authMethod[1], des.authMethod[2]));
        } else {
          mw.push(this.auth.authorize(des.auth[0], des.auth[1], des.auth[2]));
        }
      } // Add middlewares


      if (des.httpGet && des.httpGet[0]) router.get(baseUrl + '/' + des.httpGet[0], mw, des.value);
      if (des.httpPost && des.httpPost[0]) router.post(baseUrl + '/' + des.httpPost[0], mw, des.value);
      if (des.httpPut && des.httpPut[0]) router.put(baseUrl + '/' + des.httpPut[0], mw, des.value);
      if (des.httpDelete && des.httpDelete[0]) router["delete"](baseUrl + '/' + des.httpDelete[0], mw, des.value);
      if (des.httpPatch && des.httpPatch[0]) router.patch(baseUrl + '/' + des.httpPatch[0], mw, des.value);
    }
  }]);

  return Controller;
}();

exports["default"] = Controller;

_defineProperty(Controller, "service", '@controller');