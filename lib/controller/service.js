"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _debug = _interopRequireDefault(require("debug"));

var _glob = _interopRequireDefault(require("glob"));

var _path = _interopRequireDefault(require("path"));

var _lodash = _interopRequireDefault(require("lodash.defaultsdeep"));

var _decorators = require("./decorators");

require("./express");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

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

    _defineProperty(this, "options", {
      paths: ['./controllers'],
      "default": 'index',
      mapRoutes: []
    });

    this.core = provider.service('core');
    this.server = provider.service('@server');
    this.auth = provider.service('@authentication');
    debugCtrl('created');
  }

  _createClass(Controller, [{
    key: "setOptions",
    value: function setOptions(options) {
      this.options = (0, _lodash["default"])(options, this.options);
    }
  }, {
    key: "mountControllers",
    value: function mountControllers() {
      var _this = this;

      var paths = this.options.paths.map(function (p) {
        return _path["default"].resolve(_this.core.path, p);
      });
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
          if (des.api) this._addMethod(this.server.appApi, des, des.api[0]);
          if (des.page) this._addMethod(this.server.appRoot, des, des.page[0]);
        }
      }
    }
  }, {
    key: "_addMethod",
    value: function _addMethod(router, des, ctrl) {
      if (!ctrl) return;
      if (ctrl === this.options["default"]) ctrl = '';
      var mw = []; // middlewares
      // Add authentication

      if (des.auth) {
        if (des.authMethod) {
          if (des.authMethod[0] !== false) mw.push(this.auth.authorize(des.authMethod[0], des.authMethod[1], des.authMethod[2]));
        } else {
          mw.push(this.auth.authorize(des.auth[0], des.auth[1], des.auth[2]));
        }
      } // Append middlewares


      if (des.middleware) mw = mw.concat(des.middleware); // Add middlewares

      if (des.httpGet) this._addHandler(router, 'get', ctrl, des.httpGet[0], mw, des.value);
      if (des.httpPost) this._addHandler(router, 'post', ctrl, des.httpPost[0], mw, des.value);
      if (des.httpPut) this._addHandler(router, 'put', ctrl, des.httpPut[0], mw, des.value);
      if (des.httpDelete) this._addHandler(router, 'delete', ctrl, des.httpDelete[0], mw, des.value);
      if (des.httpPatch) this._addHandler(router, 'patch', ctrl, des.httpPatch[0], mw, des.value);
    }
    /**
     * Do not register action if the controller is default as this will 
     * make the action to act like a controller.
     */

  }, {
    key: "_addHandler",
    value: function _addHandler(router, method, ctrl, action, mw, value) {
      if (!action) return;
      if (action === this.options["default"]) action = '';else if (!ctrl) return; // Scan for mapped paths

      var destPath = '/' + ctrl + '/' + action;
      router[method]([].concat(_toConsumableArray(this._getMapPaths(destPath)), [destPath]), mw, value);
    }
  }, {
    key: "_getMapPaths",
    value: function _getMapPaths(destPath) {
      for (var i = 0; i < this.options.mapRoutes.length; i++) {
        var item = this.options.mapRoutes[i];

        if (destPath === item[item.length - 1]) {
          var clonedItem = _toConsumableArray(item);

          clonedItem.pop();
          return clonedItem;
        }
      }

      return [];
    }
  }]);

  return Controller;
}();

exports["default"] = Controller;

_defineProperty(Controller, "service", '@controller');